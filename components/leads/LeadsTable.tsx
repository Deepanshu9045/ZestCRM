"use client";
import React, { useMemo, useState } from "react";
import { ZestBadge } from "@/components/ui/ZestBadge";
import { ZestButton } from "@/components/ui/ZestButton";
import { ZestCard, ZestCardContent, ZestCardHeader, ZestCardTitle } from "@/components/ui/ZestCard";
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye, Edit, Trash2, Download, Search, X } from "lucide-react";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Converted"
  | "Lost";

export type LeadSource =
  | "Website"
  | "Facebook"
  | "Referral"
  | "Email Campaign"
  | "Cold Call";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  createdAt: string;
}

const statusVariant: Record<LeadStatus, Parameters<typeof ZestBadge>[0]["variant"]> = {
  New: "info",
  Contacted: "neutral",
  Qualified: "success",
  "Proposal Sent": "warning",
  Converted: "success",
  Lost: "error",
};

const statusOrder: Record<LeadStatus, number> = {
  New: 0,
  Contacted: 1,
  Qualified: 2,
  "Proposal Sent": 3,
  Converted: 4,
  Lost: 5,
};

function toCSV(rows: Lead[]): string {
  const header = [
    "Lead Name",
    "Company",
    "Email",
    "Phone",
    "Source",
    "Status",
    "Assigned To",
    "Created Date",
  ];
  const out = [header.join(",")];
  for (const r of rows) {
    const line = [
      r.name,
      r.company,
      r.email,
      r.phone,
      r.source,
      r.status,
      r.assignedTo,
      new Date(r.createdAt).toISOString().slice(0, 10),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
    out.push(line);
  }
  return out.join("\n");
}

function download(filename: string, content: string, mime = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface LeadsTableProps {
  data: Lead[];
}

export function LeadsTable({ data }: LeadsTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [date, setDate] = useState<string>("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<keyof Lead>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const resetFilters = () => {
    setQuery("");
    setStatus("");
    setSource("");
    setDate("");
  };

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        [r.name, r.company, r.email, r.phone].some((v) => v.toLowerCase().includes(q));
      const matchesStatus = !status || r.status === status;
      const matchesSource = !source || r.source === source;
      const matchesDate = !date || new Date(r.createdAt).toISOString().slice(0, 10) === date;
      return matchesQuery && matchesStatus && matchesSource && matchesDate;
    });
  }, [data, query, status, source, date]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "status") {
        return (statusOrder[a.status] - statusOrder[b.status]) * dir;
      }
      const av = a[sortBy];
      const bv = b[sortBy];
      if (sortBy === "createdAt") {
        return (new Date(av as string).getTime() - new Date(bv as string).getTime()) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const allSelectedOnPage = pageData.length > 0 && pageData.every((r) => selected[r.id]);
  const someSelected = Object.values(selected).some(Boolean);

  const toggleSort = (key: keyof Lead) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const handleBulkDelete = () => {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([id]) => id);
    if (!ids.length) return;
    alert(`Bulk delete: ${ids.length} leads`);
    setSelected({});
  };

  const exportCSV = () => {
    download("leads.csv", toCSV(sorted));
  };

  return (
    <ZestCard className="overflow-hidden border border-slate-800 bg-slate-950/95 p-0 shadow-[0_18px_45px_-28px_rgba(2,6,23,0.85)] backdrop-blur">
      <ZestCardHeader className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6">
        <ZestCardTitle>
          <span className="text-slate-100">Leads</span>
        </ZestCardTitle>
        <div className="flex items-center gap-2">
          {someSelected && (
            <ZestButton variant="outline" onClick={handleBulkDelete} className="gap-2">
              <Trash2 className="h-4 w-4" /> Bulk Delete
            </ZestButton>
          )}
          <ZestButton variant="secondary" onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </ZestButton>
        </div>
      </ZestCardHeader>
      <ZestCardContent className="p-6 pt-0">
        <div className="mb-6 mt-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-100">Filter Leads</p>
            <p className="text-xs text-slate-400">Narrow results by status, source, date, or keyword.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="relative md:col-span-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, company, email, phone"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-9 text-sm text-slate-200 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:bg-slate-900 focus:ring-4 focus:ring-sky-950"
              />
              {query && (
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300" onClick={() => setQuery("")}>
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="md:col-span-2">
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 shadow-sm outline-none transition focus:border-sky-500 focus:bg-slate-900 focus:ring-4 focus:ring-sky-950">
                <option value="">Status</option>
                {Object.keys(statusOrder).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <select value={source} onChange={(e) => setSource(e.target.value as any)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 shadow-sm outline-none transition focus:border-sky-500 focus:bg-slate-900 focus:ring-4 focus:ring-sky-950">
                <option value="">Source</option>
                {(["Website", "Facebook", "Referral", "Email Campaign", "Cold Call"] as LeadSource[]).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 shadow-sm outline-none transition focus:border-sky-500 focus:bg-slate-900 focus:ring-4 focus:ring-sky-950" />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <ZestButton variant="outline" onClick={resetFilters} className="w-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
                Reset
              </ZestButton>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/90">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <input
                      type="checkbox"
                      checked={allSelectedOnPage}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const upd: Record<string, boolean> = { ...selected };
                        pageData.forEach((r) => (upd[r.id] = checked));
                        setSelected(upd);
                      }}
                    />
                  </th>
                  {(
                    [
                      ["name", "Lead Name"],
                      ["company", "Company"],
                      ["email", "Email"],
                      ["phone", "Phone"],
                      ["source", "Source"],
                      ["status", "Status"],
                      ["assignedTo", "Assigned To"],
                      ["createdAt", "Created Date"],
                    ] as [keyof Lead, string][]
                  ).map(([key, label]) => (
                    <th
                      key={key as string}
                      className="cursor-pointer select-none px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:bg-slate-800/80"
                      onClick={() => toggleSort(key)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {sortBy === key ? (
                          sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 text-slate-600" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950">
                {pageData.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-slate-900">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={!!selected[r.id]}
                        onChange={(e) => setSelected({ ...selected, [r.id]: e.target.checked })}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-100">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.company}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.source}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      <ZestBadge variant={statusVariant[r.status]}>{r.status}</ZestBadge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{r.assignedTo}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-300">
                      <div className="flex items-center justify-end gap-2">
                        <ZestButton variant="ghost" className="h-8 px-2" aria-label="View"><Eye className="h-4 w-4" /></ZestButton>
                        <ZestButton variant="ghost" className="h-8 px-2" aria-label="Edit"><Edit className="h-4 w-4" /></ZestButton>
                        <ZestButton variant="ghost" className="h-8 px-2" aria-label="Delete"><Trash2 className="h-4 w-4" /></ZestButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-400">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
          <div>
            Page {page} of {totalPages} • {sorted.length} results
          </div>
          <div className="flex items-center gap-2">
            <ZestButton variant="outline" className="border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800" disabled={page === 1} onClick={() => setPage(1)}>First</ZestButton>
            <ZestButton variant="outline" className="border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</ZestButton>
            <ZestButton variant="outline" className="border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</ZestButton>
            <ZestButton variant="outline" className="border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800" disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</ZestButton>
          </div>
        </div>
      </ZestCardContent>
    </ZestCard>
  );
}
