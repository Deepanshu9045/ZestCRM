"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
    LayoutDashboard,
    Users,
    Building2,
    CheckSquare,
    BarChart3,
    PieChart,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Customers", href: "/customers", icon: Building2 },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Pipeline", href: "/pipeline", icon: BarChart3 },
    { name: "Reports", href: "/reports", icon: PieChart },
];

interface SidebarProps {
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, setMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/home");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar component */}
            <div className={`
        fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-200 
        transition-transform duration-300 ease-in-out dark:bg-slate-900 dark:border-slate-800
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                {/* Logo area */}
                <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                            <span className="text-lg font-bold text-white">Z</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Zest<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-md dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Overview
                    </div>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                  ${isActive
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                                    }
                `}
                            >
                                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full mb-1 group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
                        Sign Out
                    </button>
                    <Link
                        href="/settings"
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white transition-all"
                    >
                        <Settings className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400" />
                        Settings
                    </Link>
                </div>
            </div>
        </>
    );
}
