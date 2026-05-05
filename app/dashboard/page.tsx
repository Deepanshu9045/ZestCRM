"use client";

import React, { useEffect, useState } from "react";
import { ZestStatsCard } from "@/components/dashboard/ZestStatsCard";
import { ZestRevenueChart } from "@/components/dashboard/ZestRevenueChart";
import { ZestLeadSourceChart } from "@/components/dashboard/ZestLeadSourceChart";
import { ZestActivityFeed } from "@/components/dashboard/ZestActivityFeed";
import { ZestUpcomingTasks } from "@/components/dashboard/ZestUpcomingTasks";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardStats } from "@/types/dashboard.types";
import {
    Users,
    Building2,
    Target,
    DollarSign,
    TrendingUp
} from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await dashboardService.fetchDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat("en-US").format(value);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Welcome
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Here's what's happening with your business today.
                    </p>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    {/* Action buttons could go here */}
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <ZestStatsCard
                    title="Total Leads"
                    value={stats ? formatNumber(stats.totalLeads) : "0"}
                    description="from last month"
                    icon={<Users className="h-6 w-6" />}
                    growth={stats ? `${stats.totalLeadsGrowth >= 0 ? "+" : ""}${stats.totalLeadsGrowth}%` : undefined}
                    trend={stats ? (stats.totalLeadsGrowth >= 0 ? "up" : "down") : undefined}
                    isLoading={loading}
                />
                <ZestStatsCard
                    title="Converted Customers"
                    value={stats ? formatNumber(stats.convertedCustomers) : "0"}
                    description="from last month"
                    icon={<Building2 className="h-6 w-6" />}
                    growth="+8%"
                    trend="up"
                    isLoading={loading}
                />
                <ZestStatsCard
                    title="Active Deals"
                    value={stats ? formatNumber(stats.activeDeals) : "0"}
                    description="currently in pipeline"
                    icon={<Target className="h-6 w-6" />}
                    isLoading={loading}
                />
                <ZestStatsCard
                    title="Total Revenue"
                    value={stats ? formatCurrency(stats.totalRevenue) : "$0"}
                    description="from won deals"
                    icon={<DollarSign className="h-6 w-6" />}
                    growth="+24%"
                    trend="up"
                    isLoading={loading}
                />
                <ZestStatsCard
                    title="Conversion Rate"
                    value={stats ? `${stats.conversionRate.toFixed(1)}%` : "0%"}
                    description="lead to customer"
                    icon={<TrendingUp className="h-6 w-6" />}
                    growth="-2%"
                    trend="down"
                    isLoading={loading}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <ZestRevenueChart />
                <ZestLeadSourceChart />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="h-[400px]">
                    <ZestActivityFeed />
                </div>
                <div className="h-[400px]">
                    <ZestUpcomingTasks />
                </div>
            </div>
        </div>
    );
}
