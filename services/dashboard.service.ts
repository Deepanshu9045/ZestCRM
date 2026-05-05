import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc, Timestamp, getCountFromServer } from "firebase/firestore";
import { db } from "../lib/firebase-client";
import {
    DashboardStats,
    ChartDataPoint,
    ActivityItem,
    TaskItem,
    LeadSource
} from "../types/dashboard.types";

export const dashboardService = {
    /**
     * Fetch aggregate statistics for the top cards
     */
    async fetchDashboardStats(): Promise<DashboardStats> {
        try {
            // 1. Total Leads
            const leadsSnap = await getCountFromServer(collection(db, "leads"));
            const totalLeads = leadsSnap.data().count;

            // Month-over-month growth for Total Leads
            const now = new Date();
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

            const [thisMonthSnap, lastMonthSnap] = await Promise.all([
                getCountFromServer(query(
                    collection(db, "leads"),
                    where("createdAt", ">=", Timestamp.fromDate(startOfThisMonth))
                )),
                getCountFromServer(query(
                    collection(db, "leads"),
                    where("createdAt", ">=", Timestamp.fromDate(startOfLastMonth)),
                    where("createdAt", "<", Timestamp.fromDate(startOfThisMonth))
                )),
            ]);
            const thisMonthCount = thisMonthSnap.data().count;
            const lastMonthCount = lastMonthSnap.data().count;
            const totalLeadsGrowth = lastMonthCount > 0
                ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
                : thisMonthCount > 0 ? 100 : 0;

            // 2. Converted Customers (Leads with status = 'won' or from customers collection)
            const customersSnap = await getCountFromServer(collection(db, "customers"));
            let convertedCustomers = customersSnap.data().count;

            // If no separate customers collection, we might count won leads. Let's do both just in case:
            if (convertedCustomers === 0) {
                const wonLeadsQuery = query(collection(db, "leads"), where("status", "==", "won"));
                const wonLeadsSnap = await getCountFromServer(wonLeadsQuery);
                convertedCustomers = wonLeadsSnap.data().count;
            }

            // 3. Total Revenue from Won Deals
            // Note: getAggregateFromServer is also available for sum in newer firebase sdks, 
            // but let's do a simple manual sum for now to be safe with types
            const wonDealsQuery = query(collection(db, "leads"), where("status", "==", "won"));
            const wonDealsDocs = await getDocs(wonDealsQuery);

            let totalRevenue = 0;
            wonDealsDocs.forEach(doc => {
                const data = doc.data();
                if (data.revenue && typeof data.revenue === 'number') {
                    totalRevenue += data.revenue;
                }
            });

            // 4. Active Deals
            const activeDealsQuery = query(collection(db, "leads"), where("status", "in", ["contacted", "qualified"]));
            const activeDealsSnap = await getCountFromServer(activeDealsQuery);
            const activeDeals = activeDealsSnap.data().count;

            // 5. Conversion Rate
            const conversionRate = totalLeads > 0 ? (convertedCustomers / totalLeads) * 100 : 0;

            return {
                totalLeads,
                totalLeadsGrowth,
                convertedCustomers,
                activeDeals,
                totalRevenue,
                conversionRate,
            };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            // Return default zeroes on error or empty DB
            return { totalLeads: 0, totalLeadsGrowth: 0, convertedCustomers: 0, activeDeals: 0, totalRevenue: 0, conversionRate: 0 };
        }
    },

    /**
     * Fetch monthly revenue data for line chart
     */
    async fetchMonthlyRevenue(): Promise<ChartDataPoint[]> {
        try {
            const wonDealsQuery = query(collection(db, "leads"), where("status", "==", "won"));
            const querySnapshot = await getDocs(wonDealsQuery);

            const monthlyData: Record<string, number> = {};

            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.revenue && data.createdAt) {
                    // Handle both Firestore Timestamp and JS Date
                    const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' }); // e.g. "Jan 24"

                    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + data.revenue;
                }
            });

            // Convert to array format for Recharts
            return Object.entries(monthlyData)
                .map(([name, value]) => ({ name, value }))
                // Basic sort by keeping them chronological if we parse them back, 
                // but for a simple demo, assuming they come out fine or sorting by name loosely works.
                // A robust app would sort by actual date object.
                .sort((a, b) => a.name.localeCompare(b.name));

        } catch (error) {
            console.error("Error fetching monthly revenue:", error);
            return [];
        }
    },

    /**
     * Fetch lead distribution by source for pie chart
     */
    async fetchLeadSourceDistribution(): Promise<ChartDataPoint[]> {
        try {
            const leadsQuery = collection(db, "leads");
            const querySnapshot = await getDocs(leadsQuery);

            const sourceCount: Record<string, number> = {
                "Website": 0,
                "Referral": 0,
                "Cold Call": 0,
                "Social Media": 0,
                "Other": 0
            };

            querySnapshot.forEach(doc => {
                const source = doc.data().source as string;
                if (sourceCount[source] !== undefined) {
                    sourceCount[source]++;
                } else {
                    sourceCount["Other"]++;
                }
            });

            return Object.entries(sourceCount)
                .filter(([_, value]) => value > 0) // Only return sources with data
                .map(([name, value]) => ({ name, value }));

        } catch (error) {
            console.error("Error fetching lead sources:", error);
            return [];
        }
    },

    /**
     * Fetch last 10 activities
     */
    async fetchRecentActivities(): Promise<ActivityItem[]> {
        try {
            const activitiesQuery = query(
                collection(db, "activities"),
                orderBy("timestamp", "desc"),
                limit(10)
            );

            const querySnapshot = await getDocs(activitiesQuery);

            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    userId: data.userId,
                    userName: data.userName,
                    action: data.action,
                    entityType: data.entityType,
                    entityId: data.entityId,
                    entityName: data.entityName,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
                } as ActivityItem;
            });
        } catch (error) {
            console.error("Error fetching recent activities:", error);
            return [];
        }
    },

    /**
     * Fetch incomplete tasks due in next 7 days
     */
    async fetchUpcomingTasks(userId?: string): Promise<TaskItem[]> {
        try {
            // 7 days from now
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

            // NOTE: For complex queries like where + where on diff fields + orderBy, 
            // Firestore requires a composite index. 
            // Kept simple here to avoid index requirements initially:
            let tasksQuery = query(
                collection(db, "tasks"),
                where("status", "!=", "completed"),
                orderBy("status"), // Required by Firestore when using !=
                limit(20)
            );

            const querySnapshot = await getDocs(tasksQuery);

            const tasks = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    assignedUserId: data.assignedUserId,
                    assignedUserName: data.assignedUserName,
                    dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(),
                    priority: data.priority,
                    status: data.status,
                } as TaskItem;
            });

            // Filter in memory for the date to avoid composite index requirement issues for a newly setup project
            return tasks
                .filter(t => t.dueDate <= sevenDaysFromNow)
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .slice(0, 5); // Limit to top 5 upcoming

        } catch (error) {
            console.error("Error fetching upcoming tasks:", error);
            return [];
        }
    },

    /**
     * Mark a task as completed
     */
    async markTaskComplete(taskId: string): Promise<void> {
        try {
            const taskRef = doc(db, "tasks", taskId);
            await updateDoc(taskRef, {
                status: "completed",
                completedAt: Timestamp.now()
            });
        } catch (error) {
            console.error("Error updating task status:", error);
            throw error;
        }
    }
};
