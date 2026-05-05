"use client";
import React, { useState, useEffect, useCallback } from "react";
import { LeadsHeader } from "@/components/leads/LeadsHeader";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { LeadPipeline } from "@/components/leads/LeadPipeline";
import { LeadsTable, Lead } from "@/components/leads/LeadsTable";
import { AddLeadModal } from "@/components/leads/AddLeadModal";
import {
  listLeads,
  addLead,
  bulkDeleteLeads,
  uiToStatusMachine,
  statusMachineToUi,
} from "@/services/leads.service";

export default function LeadsPage() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listLeads(200);
      setRows(
        data.map((l) => ({
          ...l,
          status: statusMachineToUi(l.status) as Lead["status"],
          source: l.source as Lead["source"],
        }))
      );
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleAdd = async (v: Record<string, any>) => {
    await addLead({
      fullName: v.fullName,
      company: v.company || "",
      email: v.email || "",
      phone: v.phone || "",
      source: v.source,
      status: uiToStatusMachine(v.status),
      assignedTo: v.assignedTo || "",
      notes: v.notes || "",
      expectedValue: v.expectedValue ? Number(v.expectedValue) : undefined,
      followUpDate: v.followUpDate || undefined,
    });
    await loadLeads();
  };

  const handleBulkDelete = async (ids: string[]) => {
    await bulkDeleteLeads(ids);
    await loadLeads();
  };

  return (
    <div className="space-y-6">
      <LeadsHeader onAdd={() => setOpen(true)} />
      <LeadsStats />
      <LeadPipeline />
      <LeadsTable data={rows} isLoading={loading} onBulkDelete={handleBulkDelete} />
      <AddLeadModal open={open} onClose={() => setOpen(false)} onSubmit={handleAdd} />
    </div>
  );
}
