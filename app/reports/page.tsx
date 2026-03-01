"use client";

import React, { useMemo, useState } from "react";
import { ZestCard, ZestCardContent, ZestCardHeader, ZestCardTitle } from "@/components/ui/ZestCard";
import { ZestButton } from "@/components/ui/ZestButton";
import { Calendar, Download, RefreshCw, TrendingUp, Users, Percent, Trophy, CircleSlash, Target, ArrowUpRight, ArrowDownRight, Filter, Mail } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  FunnelChart,
  Funnel,
  LabelList
} from "recharts";
import { ZestLoader } from "@/components/ui/ZestLoader";
import { dashboardService } from "@/services/dashboard.service";
import { useEffect } from "react";

// Color palettes
const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316"]; // indigo, cyan, emerald, amber, red, violet, teal, orange

// Date ranges
type DatePreset = "today" | "this_week" | "this_month" | "this_quarter" | "custom";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

function Section({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

function KpiCard({ title, value, vsText, trend }: { title: string; value: string; vsText: string; trend: "up" | "down" | "neutral" }) {
  const trendEl = trend === "up" ? (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
      <ArrowUpRight className="mr-1 h-3 w-3" />
      {vsText}
    </span>
  ) : trend === "down" ? (
    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
      <ArrowDownRight className="mr-1 h-3 w-3" />
      {vsText}
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{vsText}</span>
  );

  return (
    <ZestCard>
      <ZestCardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <h4 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h4>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">{trendEl} <span className="ml-2">vs last period</span></div>
      </ZestCardContent>
    </ZestCard>
  );
}

export default function ReportsPage() {
  // Filters and date range
  const [datePreset, setDatePreset] = useState<DatePreset>("this_month");
  const [customRange, setCustomRange] = useState<{ from?: string; to?: string }>({});
  const [filters, setFilters] = useState<{ salesperson?: string; team?: string; stage?: string; source?: string; minValue?: number; maxValue?: number }>({});

  // Basic data fetched from dashboard service to seed some charts
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ name: string; value: number }[]>([]);
  const [stats, setStats] = useState<{ totalLeads: number; convertedCustomers: number; activeDeals: number; totalRevenue: number; conversionRate: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [rev, s] = await Promise.all([
          dashboardService.fetchMonthlyRevenue(),
          dashboardService.fetchDashboardStats(),
        ]);
        if (!mounted) return;
        setMonthlyRevenue(rev);
        setStats(s);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [datePreset, customRange.from, customRange.to, filters.salesperson, filters.team, filters.stage, filters.source, filters.minValue, filters.maxValue]);

  // Placeholder/mock computed datasets for other charts until dedicated services exist
  const revenueBySalesperson = useMemo(() => {
    return [
      { name: "Alex", value: 120000 },
      { name: "Priya", value: 98000 },
      { name: "Sam", value: 87000 },
      { name: "Li", value: 66000 },
    ];
  }, []);

  const revenueByStage = useMemo(() => {
    return [
      { name: "Qualified", value: 45000 },
      { name: "Proposal", value: 78000 },
      { name: "Negotiation", value: 52000 },
      { name: "Won", value: 136000 },
    ];
  }, []);

  const forecastVsActual = useMemo(() => {
    const m = monthlyRevenue.map((d) => ({ month: d.name, actual: d.value, forecast: Math.round(d.value * 1.08) }));
    return m.length ? m : [
      { month: "Jan", actual: 80000, forecast: 86000 },
      { month: "Feb", actual: 92000, forecast: 100000 },
      { month: "Mar", actual: 110000, forecast: 118000 },
      { month: "Apr", actual: 90000, forecast: 104000 },
    ];
  }, [monthlyRevenue]);

  const leadsBySource = useMemo(() => {
    return [
      { name: "Website", value: 120 },
      { name: "Facebook", value: 70 },
      { name: "Referral", value: 55 },
      { name: "Email Campaign", value: 48 },
      { name: "Cold Call", value: 32 },
    ];
  }, []);

  const leadsByStatus = useMemo(() => {
    return [
      { name: "New", value: 140 },
      { name: "Contacted", value: 110 },
      { name: "Qualified", value: 80 },
      { name: "Proposal", value: 50 },
      { name: "Won", value: 36 },
      { name: "Lost", value: 22 },
    ];
  }, []);

  const funnelData = useMemo(() => {
    return [
      { name: "Lead In", value: 400 },
      { name: "Contacted", value: 300 },
      { name: "Qualified", value: 200 },
      { name: "Proposal", value: 120 },
      { name: "Won", value: 80 },
    ];
  }, []);

  const responseTime = useMemo(() => {
    return [
      { name: "Avg Response (hrs)", value: 5.2 },
      { name: "Median Response (hrs)", value: 3.4 },
    ];
  }, []);

  const dealsByStage = useMemo(() => {
    return [
      { name: "New", value: 50 },
      { name: "Contacted", value: 44 },
      { name: "Qualified", value: 30 },
      { name: "Proposal", value: 18 },
      { name: "Negotiation", value: 10 },
      { name: "Won", value: 8 },
    ];
  }, []);

  const winLoss = useMemo(() => {
    return [
      { name: "Won", value: 36 },
      { name: "Lost", value: 22 },
    ];
  }, []);

  const tasksCompletedPending = useMemo(() => {
    return [
      { name: "Completed", value: 180 },
      { name: "Pending", value: 65 },
    ];
  }, []);

  const tasksByPriority = useMemo(() => {
    return [
      { name: "High", value: 44 },
      { name: "Medium", value: 120 },
      { name: "Low", value: 81 },
      { name: "Urgent", value: 12 },
    ];
  }, []);

  const tasksByMember = useMemo(() => {
    return [
      { name: "Alex", value: 60 },
      { name: "Priya", value: 54 },
      { name: "Sam", value: 48 },
      { name: "Li", value: 36 },
    ];
  }, []);

  const overdueTrend = useMemo(() => {
    return [
      { month: "Jan", value: 10 },
      { month: "Feb", value: 14 },
      { month: "Mar", value: 9 },
      { month: "Apr", value: 12 },
      { month: "May", value: 8 },
    ];
  }, []);

  const teamTable = useMemo(() => {
    return [
      { name: "Alex Johnson", closed: 18, revenue: 120000, conv: 28, target: 92, art: "2h 15m" },
      { name: "Priya Sharma", closed: 15, revenue: 98000, conv: 24, target: 88, art: "2h 45m" },
      { name: "Sam Carter", closed: 12, revenue: 87000, conv: 21, target: 76, art: "3h 10m" },
      { name: "Li Wei", closed: 10, revenue: 66000, conv: 19, target: 70, art: "2h 55m" },
    ];
  }, []);

  // Derived KPIs
  const kpi = useMemo(() => {
    const totalRevenue = stats?.totalRevenue || 0;
    const avgDealSize = teamTable.length ? Math.round(totalRevenue / (teamTable.reduce((a, b) => a + b.closed, 0) || 1)) : 0;
    return {
      totalRevenue,
      revenueGrowthPct: 12, // placeholder vs last period
      totalLeads: stats?.totalLeads || 0,
      conversionRate: Math.round((stats?.conversionRate || 0) * 10) / 10,
      dealsWon: teamTable.reduce((a, b) => a + b.closed, 0),
      dealsLost: 22, // placeholder
      avgDealSize,
      targetAch: 86, // placeholder
    };
  }, [stats, teamTable]);

  // Export handlers (client-side CSV/XLSX/PDF minimal placeholders)
  function exportCSV() {
    const rows = [
      ["Metric", "Value"],
      ["Total Revenue", kpi.totalRevenue],
      ["Revenue Growth %", kpi.revenueGrowthPct],
      ["Total Leads", kpi.totalLeads],
      ["Lead Conversion Rate", kpi.conversionRate],
      ["Deals Won", kpi.dealsWon],
      ["Deals Lost", kpi.dealsLost],
      ["Average Deal Size", kpi.avgDealSize],
      ["Sales Target Achievement %", kpi.targetAch],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zest-reports-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportExcel() {
    // simple CSV with xls extension as placeholder
    exportCSV();
  }

  function downloadPDF() {
    window.print(); // basic printable export; can be replaced with jsPDF
  }

  function emailReport() {
    const subject = encodeURIComponent("Zest CRM Report");
    const body = encodeURIComponent(`Please find the Zest CRM report. Total Revenue: ${formatCurrency(kpi.totalRevenue)}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  // Filtering actions
  function applyFilters() {
    // In a real app, trigger data refetch with current filters
  }
  function resetFilters() {
    setFilters({});
  }

  return (
    <div className="space-y-8 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Monitor performance, track growth, and make smarter decisions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {[{ k: "today", l: "Today" }, { k: "this_week", l: "This Week" }, { k: "this_month", l: "This Month" }, { k: "this_quarter", l: "This Quarter" }, { k: "custom", l: "Custom" }].map((o) => (
              <button key={o.k} onClick={() => setDatePreset(o.k as DatePreset)} className={`rounded-md px-3 py-1.5 text-sm ${datePreset === o.k ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                {o.l}
              </button>
            ))}
            {datePreset === "custom" && (
              <div className="ml-2 flex items-center gap-2 px-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <input type="date" className="rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900" value={customRange.from || ""} onChange={(e) => setCustomRange((c) => ({ ...c, from: e.target.value }))} />
                <span className="text-slate-500">to</span>
                <input type="date" className="rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900" value={customRange.to || ""} onChange={(e) => setCustomRange((c) => ({ ...c, to: e.target.value }))} />
              </div>
            )}
          </div>
          <ZestButton variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</ZestButton>
          <ZestButton variant="outline" onClick={exportExcel}><Download className="mr-2 h-4 w-4" /> Export Excel</ZestButton>
          <ZestButton variant="outline" onClick={downloadPDF}><Download className="mr-2 h-4 w-4" /> Download PDF</ZestButton>
          <ZestButton variant="secondary" onClick={() => window.location.reload()}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</ZestButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Revenue" value={formatCurrency(kpi.totalRevenue)} vsText={`+${kpi.revenueGrowthPct}%`} trend="up" />
        <KpiCard title="Revenue Growth %" value={`${kpi.revenueGrowthPct}%`} vsText={"+2%"} trend="up" />
        <KpiCard title="Total Leads" value={`${kpi.totalLeads}`} vsText={"+5%"} trend="up" />
        <KpiCard title="Lead Conversion Rate" value={`${kpi.conversionRate}%`} vsText={"+1.2%"} trend="up" />
        <KpiCard title="Deals Won" value={`${kpi.dealsWon}`} vsText={"+3"} trend="up" />
        <KpiCard title="Deals Lost" value={`${kpi.dealsLost}`} vsText={"-2"} trend="down" />
        <KpiCard title="Average Deal Size" value={formatCurrency(kpi.avgDealSize)} vsText={"+4%"} trend="up" />
        <KpiCard title="Sales Target Achievement %" value={`${kpi.targetAch}%`} vsText={"+1%"} trend="up" />
      </div>

      {/* Revenue Reports */}
      <Section title="Revenue Reports">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ZestCard>
            <ZestCardHeader>
              <ZestCardTitle>Monthly Revenue Trend</ZestCardTitle>
            </ZestCardHeader>
            <ZestCardContent>
              {loading ? (
                <div className="flex h-[300px] items-center justify-center"><ZestLoader /></div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                      <YAxis tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dx={-10} />
                      <Tooltip formatter={(v: any) => [formatCurrency(v as number), "Revenue"]} />
                      <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader>
              <ZestCardTitle>Revenue by Salesperson</ZestCardTitle>
            </ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueBySalesperson}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: any) => [formatCurrency(v as number), "Revenue"]} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader>
              <ZestCardTitle>Revenue by Stage</ZestCardTitle>
            </ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByStage}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: any) => [formatCurrency(v as number), "Revenue"]} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader>
              <ZestCardTitle>Forecasted vs Actual Revenue</ZestCardTitle>
            </ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastVsActual}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" name="Actual" stroke="#4f46e5" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#10b981" strokeDasharray="4 4" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>
        </div>
      </Section>

      {/* Leads Reports */}
      <Section title="Leads Reports">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Leads by Source</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={leadsBySource} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                      {leadsBySource.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                      <LabelList dataKey="name" position="outside" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Leads by Status</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={leadsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard className="lg:col-span-2">
            <ZestCardHeader><ZestCardTitle>Lead Conversion Funnel</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      {funnelData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <LabelList position="right" fill="#374151" stroke="none" dataKey="name" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Lead Response Time Analysis</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={responseTime}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>
        </div>
      </Section>

      {/* Pipeline Performance */}
      <Section title="Pipeline Performance Reports">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Deals by Stage</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={dealsByStage}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Win/Loss Ratio</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={winLoss} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                      {winLoss.map((_, idx) => <Cell key={idx} fill={idx === 0 ? "#10b981" : "#ef4444"} />)}
                      <LabelList dataKey="name" position="outside" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Average Sales Cycle Duration</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="flex h-[300px] items-center justify-center text-center text-slate-600 dark:text-slate-300">
                <div>
                  <div className="text-4xl font-bold">24 days</div>
                  <div className="mt-2 text-sm">Avg time from Lead In to Won across selected period</div>
                </div>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Stage-wise Drop-off Rate</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={[{ name: "New → Contacted", value: 18 }, { name: "Contacted → Qualified", value: 22 }, { name: "Qualified → Proposal", value: 16 }, { name: "Proposal → Won", value: 10 }]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v: any) => [`${v}%`, "Drop-off"]} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>
        </div>
      </Section>

      {/* Task Productivity */}
      <Section title="Task Productivity Reports">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Tasks Completed vs Pending</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={tasksCompletedPending}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Tasks by Priority</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={tasksByPriority} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                      {tasksByPriority.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                      <LabelList dataKey="name" position="outside" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Tasks by Team Member</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={tasksByMember}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>

          <ZestCard>
            <ZestCardHeader><ZestCardTitle>Overdue Tasks Trend</ZestCardTitle></ZestCardHeader>
            <ZestCardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <LineChart data={overdueTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ZestCardContent>
          </ZestCard>
        </div>
      </Section>

      {/* Sales Team Performance */}
      <Section title="Sales Team Performance">
        <ZestCard>
          <ZestCardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {['Salesperson Name','Deals Closed','Revenue Generated','Conversion Rate','Target Achievement %','Average Response Time'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {teamTable.map((r) => (
                    <tr key={r.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">{r.name}</td>
                      <td className="px-4 py-2">{r.closed}</td>
                      <td className="px-4 py-2">{formatCurrency(r.revenue)}</td>
                      <td className="px-4 py-2">{r.conv}%</td>
                      <td className="px-4 py-2">{r.target}%</td>
                      <td className="px-4 py-2">{r.art}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ZestCardContent>
        </ZestCard>
      </Section>

      {/* Advanced Filters */}
      <Section title="Advanced Filters" actions={<ZestButton variant="ghost"><Filter className="mr-2 h-4 w-4" />Filters</ZestButton>}>
        <ZestCard>
          <ZestCardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Salesperson</label>
                <select value={filters.salesperson || ""} onChange={(e) => setFilters((f) => ({ ...f, salesperson: e.target.value || undefined }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option value="">All</option>
                  <option>Alex</option>
                  <option>Priya</option>
                  <option>Sam</option>
                  <option>Li</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Team</label>
                <select value={filters.team || ""} onChange={(e) => setFilters((f) => ({ ...f, team: e.target.value || undefined }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option value="">All</option>
                  <option>North</option>
                  <option>South</option>
                  <option>East</option>
                  <option>West</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Stage</label>
                <select value={filters.stage || ""} onChange={(e) => setFilters((f) => ({ ...f, stage: e.target.value || undefined }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option value="">All</option>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Proposal</option>
                  <option>Won</option>
                  <option>Lost</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Lead Source</label>
                <select value={filters.source || ""} onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value || undefined }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option value="">All</option>
                  <option>Website</option>
                  <option>Facebook</option>
                  <option>Referral</option>
                  <option>Email Campaign</option>
                  <option>Cold Call</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Min Deal Value</label>
                  <input type="number" value={filters.minValue ?? ""} onChange={(e) => setFilters((f) => ({ ...f, minValue: e.target.value ? Number(e.target.value) : undefined }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="0" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Max Deal Value</label>
                  <input type="number" value={filters.maxValue ?? ""} onChange={(e) => setFilters((f) => ({ ...f, maxValue: e.target.value ? Number(e.target.value) : undefined }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="100000" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <ZestButton onClick={applyFilters} variant="primary">Apply Filters</ZestButton>
              <ZestButton onClick={resetFilters} variant="outline">Reset Filters</ZestButton>
              <ZestButton onClick={emailReport} variant="secondary"><Mail className="mr-2 h-4 w-4" /> Email report</ZestButton>
            </div>
          </ZestCardContent>
        </ZestCard>
      </Section>

      {/* Smart Analytics callouts */}
      <Section title="Smart Analytics">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ZestCard>
            <ZestCardContent>
              <div className="text-sm text-slate-600 dark:text-slate-300">Conversion Rate</div>
              <div className="mt-2 text-2xl font-semibold">{kpi.conversionRate}%</div>
              <div className="mt-2 text-xs text-slate-500">(Won Deals / Total Deals) × 100</div>
            </ZestCardContent>
          </ZestCard>
          <ZestCard>
            <ZestCardContent>
              <div className="text-sm text-slate-600 dark:text-slate-300">Weighted Revenue</div>
              <div className="mt-2 text-2xl font-semibold">{formatCurrency(Math.round(kpi.totalRevenue * 0.85))}</div>
              <div className="mt-2 text-xs text-slate-500">Sum of Deal Value × Probability</div>
            </ZestCardContent>
          </ZestCard>
          <ZestCard>
            <ZestCardContent>
              <div className="text-sm text-slate-600 dark:text-slate-300">Sales Growth %</div>
              <div className="mt-2 text-2xl font-semibold">{kpi.revenueGrowthPct}%</div>
              <div className="mt-2 text-xs text-slate-500">vs previous period</div>
            </ZestCardContent>
          </ZestCard>
          <ZestCard>
            <ZestCardContent>
              <div className="text-sm text-slate-600 dark:text-slate-300">Target vs Achievement</div>
              <div className="mt-2 text-2xl font-semibold">{kpi.targetAch}%</div>
              <div className="mt-2 text-xs text-slate-500">Goal attainment for the period</div>
            </ZestCardContent>
          </ZestCard>
        </div>
      </Section>
    </div>
  );
}
