import React, { useState, useEffect } from "react";
import { ZestButton } from "@/components/ui/ZestButton";
import { X } from "lucide-react";
import { CreateTaskPayload, TaskDoc, TaskPriority, TaskStatus, TaskType, RelatedEntity } from "@/services/tasks.service";

export interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (taskData: CreateTaskPayload) => Promise<void>;
    initialData?: TaskDoc;
}

const taskTypes: TaskType[] = ["Call", "Meeting", "Email", "Demo", "Follow-up", "Other"];
const priorities: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];
const statuses: TaskStatus[] = ["Pending", "In Progress", "Completed", "Overdue", "Cancelled"];
const relatedEntityTypes: RelatedEntity[] = ["Lead", "Customer", "Deal"];

export function AddTaskModal({ open, onClose, onSubmit, initialData }: AddTaskModalProps) {
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState<CreateTaskPayload>({
        title: "",
        description: "",
        relatedToName: "",
        relatedToType: "Lead",
        taskType: "Call",
        priority: "Medium",
        status: "Pending",
        assignedTo: "",
        dueDate: new Date().toISOString().slice(0, 16),
    });

    useEffect(() => {
        if (open && initialData) {
            setValues({
                title: initialData.title,
                description: initialData.description || "",
                relatedToName: initialData.relatedToName || "",
                relatedToType: initialData.relatedToType || "Lead",
                taskType: initialData.taskType,
                priority: initialData.priority,
                status: initialData.status,
                assignedTo: initialData.assignedTo || "",
                dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : "",
            });
        } else if (open && !initialData) {
            setValues({
                title: "",
                description: "",
                relatedToName: "",
                relatedToType: "Lead",
                taskType: "Call",
                priority: "Medium",
                status: "Pending",
                assignedTo: "",
                dueDate: new Date().toISOString().slice(0, 16),
            })
        }
    }, [open, initialData]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...values,
                dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : new Date().toISOString()
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save task.");
        } finally {
            setLoading(false);
        }
    };

    const set = (k: keyof CreateTaskPayload, v: any) => setValues((s) => ({ ...s, [k]: v }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 shadow-xl border dark:border-slate-800 max-h-[90vh] flex flex-col transition-all overflow-hidden">
                <div className="flex items-center justify-between border-b dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {initialData ? "Edit Task" : "Create New Task"}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex-1">
                    <form id="task-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Task Title *</label>
                            <input required value={values.title} onChange={(e) => set("title", e.target.value)} placeholder="E.g., Follow up call with John" className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Related To</label>
                            <div className="flex gap-2">
                                <select value={values.relatedToType} onChange={(e) => set("relatedToType", e.target.value)} className="w-1/3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all">
                                    {relatedEntityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <input value={values.relatedToName} onChange={(e) => set("relatedToName", e.target.value)} placeholder="Name of Lead, Customer, or Deal" className="w-2/3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Task Type</label>
                            <select value={values.taskType} onChange={(e) => set("taskType", e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all">
                                {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                            <select value={values.priority} onChange={(e) => set("priority", e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all">
                                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select value={values.status} onChange={(e) => set("status", e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all">
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Due Date & Time *</label>
                            <input required type="datetime-local" value={values.dueDate} onChange={(e) => set("dueDate", e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Assigned To</label>
                            <input value={values.assignedTo} onChange={(e) => set("assignedTo", e.target.value)} placeholder="Team member name or email" className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description / Notes</label>
                            <textarea value={values.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Add any relevant notes or context here..." className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white outline-none ring-indigo-500 focus:ring-2 transition-all" />
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-2 border-t dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl">
                    <ZestButton type="button" variant="outline" onClick={onClose}>Cancel</ZestButton>
                    <ZestButton type="submit" form="task-form" isLoading={loading}>
                        {initialData ? "Save Changes" : "Create Task"}
                    </ZestButton>
                </div>

            </div>
        </div>
    );
}
