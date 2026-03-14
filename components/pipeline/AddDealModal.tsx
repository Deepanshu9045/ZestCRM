"use client";

import React, { useEffect, useState } from "react";
import { ZestButton } from "@/components/ui/ZestButton";
import { X, Calendar, DollarSign, User, FileText, Info } from "lucide-react";
import { CreateDealPayload, DealDoc, DealStage, PIPELINE_STAGES, DealPriority, DealStatus } from "@/services/pipeline.service";

interface AddDealModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateDealPayload) => Promise<void>;
    initialData?: DealDoc;
}

export function AddDealModal({ open, onClose, onSubmit, initialData }: AddDealModalProps) {
    const [formData, setFormData] = useState<CreateDealPayload>({
        dealName: "",
        companyName: "",
        value: 0,
        stage: "Lead In",
        probability: 10,
        priority: "Medium",
        assignedTo: "",
        expectedCloseDate: "",
        status: "Active",
        notes: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                dealName: initialData.dealName,
                companyName: initialData.companyName,
                value: initialData.value,
                stage: initialData.stage,
                probability: initialData.probability,
                priority: initialData.priority,
                assignedTo: initialData.assignedTo,
                expectedCloseDate: initialData.expectedCloseDate,
                status: initialData.status,
                notes: initialData.notes || ""
            });
        } else {
            setFormData({
                dealName: "",
                companyName: "",
                value: 0,
                stage: "Lead In",
                probability: 10,
                priority: "Medium",
                assignedTo: "",
                expectedCloseDate: "",
                status: "Active",
                notes: ""
            });
        }
    }, [initialData, open]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            console.error("Failed to save deal:", err);
        } finally {
            setLoading(false);
        }
    };

    const priorities: DealPriority[] = ["Low", "Medium", "High", "Urgent"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 transition-all">
                <div className="flex items-center justify-between p-6 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{initialData ? "Edit Deal" : "Add New Deal"}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter the details of the sales opportunity.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deal Name*</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Enterprise Software License"
                                className="w-full p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={formData.dealName}
                                onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Acme Corp"
                                className="w-full p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deal Value ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    className="w-full pl-10 pr-4 p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expected Close Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                    value={formData.expectedCloseDate}
                                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stage</label>
                            <select
                                className="w-full p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                            >
                                {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Probability (%)</label>
                            <div className="relative">
                                <Info className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full pl-10 pr-4 p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.probability}
                                    onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                            <div className="flex gap-2">
                                {priorities.map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${formData.priority === p ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned To</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Sales Manager Name"
                                    className="w-full pl-10 pr-4 p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes & Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <textarea
                                rows={3}
                                placeholder="Add any additional details or background..."
                                className="w-full pl-10 pr-4 p-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-2">
                    <ZestButton variant="ghost" onClick={onClose}>Cancel</ZestButton>
                    <ZestButton variant="primary" type="submit" onClick={handleSubmit} isLoading={loading} disabled={!formData.dealName}>
                        {loading ? "Saving..." : initialData ? "Update Deal" : "Save Deal"}
                    </ZestButton>
                </div>
            </div>
        </div>
    );
}
