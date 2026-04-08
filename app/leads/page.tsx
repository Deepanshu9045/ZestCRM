"use client";
import React, { useState } from "react";
import { LeadsHeader } from "@/components/leads/LeadsHeader";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { LeadPipeline } from "@/components/leads/LeadPipeline";
import { LeadsTable, Lead } from "@/components/leads/LeadsTable";
import { AddLeadModal } from "@/components/leads/AddLeadModal";

export default function LeadsPage() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Lead[]>([]);

  const handleAdd = (v: Record<string, any>) => {
    const n: Lead = {
      id: String(rows.length + 1),
      name: v.fullName,
      company: v.company,
      email: v.email,
      phone: v.phone,
      source: v.source,
      status: v.status,
      assignedTo: v.assignedTo || "Unassigned",
      createdAt: new Date().toISOString(),
    };
    setRows((r) => [n, ...r]);
  };

  return (
    <div className="space-y-6">
      <LeadsHeader onAdd={() => setOpen(true)} />
      <LeadsStats />
      <LeadPipeline />
      <LeadsTable data={rows} />
      <AddLeadModal open={open} onClose={() => setOpen(false)} onSubmit={handleAdd} />
    </div>
  );
}
