export type ActivityType = "lead_created" | "customer_converted" | "task_completed" | "task_created" | "deal_won" | "deal_lost" | "note_added";
export type EntityType = "Lead" | "Customer" | "Task" | "Deal";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "in_progress" | "completed";
export type LeadSource = "Website" | "Referral" | "Cold Call" | "Social Media" | "Other";

export interface DashboardStats {
    totalLeads: number;
    totalLeadsGrowth: number;
    convertedCustomers: number;
    activeDeals: number;
    totalRevenue: number;
    conversionRate: number;
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface ActivityItem {
    id: string;
    userId: string;
    userName: string;
    action: ActivityType;
    entityType: EntityType;
    entityId: string;
    entityName: string;
    timestamp: Date; // In Firestore this will be a Timestamp, but converted for UI
}

export interface TaskItem {
    id: string;
    title: string;
    assignedUserId: string;
    assignedUserName: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
}

// Minimal types for existing entities based on the requirements
export interface Lead {
    id: string;
    name: string;
    source: LeadSource;
    status: "new" | "contacted" | "qualified" | "won" | "lost";
    createdAt: Date;
    revenue?: number; // Estimated or actual
}

export interface Customer {
    id: string;
    name: string;
    createdAt: Date;
}
