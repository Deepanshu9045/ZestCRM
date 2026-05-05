"use client";
import React, { useEffect, useState } from "react";
import { ZestCard } from "@/components/ui/ZestCard";
import { TrendingUp, Users, CheckCircle2, Handshake, XCircle } from "lucide-react";
import { fetchLeadsStats } from "@/services/leads.service";

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function Stat({ label, value, icon }: StatItem) {
  return (
    <ZestCard className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {value.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">{icon}</div>
      </div>
    </ZestCard>
  );
}

export function LeadsStats() {
  const [stats, setStats] = useState({ total: 0, new: 0, qualified: 0, converted: 0, lost: 0 });

  useEffect(() => {
    fetchLeadsStats().then(setStats).catch(console.error);
  }, []);

  const items: StatItem[] = [
    { label: "Total Leads",     value: stats.total,     icon: <Users className="h-5 w-5" /> },
    { label: "New Leads",       value: stats.new,        icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Qualified Leads", value: stats.qualified,  icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Converted Leads", value: stats.converted,  icon: <Handshake className="h-5 w-5" /> },
    { label: "Lost Leads",      value: stats.lost,       icon: <XCircle className="h-5 w-5" /> },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((s) => (
        <Stat key={s.label} {...s} />
      ))}
    </div>
  );
}
