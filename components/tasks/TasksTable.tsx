import React, { useMemo, useState } from "react";
import { ZestBadge } from "@/components/ui/ZestBadge";
import { ZestButton } from "@/components/ui/ZestButton";
import { ZestCard, ZestCardContent, ZestCardHeader, ZestCardTitle } from "@/components/ui/ZestCard";
import { ChevronDown, ChevronUp, ChevronsUpDown, Edit, Trash2, CheckCircle, Search, X } from "lucide-react";
import { TaskDoc, TaskStatus, TaskPriority } from "@/services/tasks.service";

export interface TasksTableProps {
    tasks: TaskDoc[];
    onEdit: (task: TaskDoc) => void;
    onDelete: (id: string) => Promise<void>;
    onMarkComplete: (task: TaskDoc) => Promise<void>;
    onBulkDelete?: (ids: string[]) => Promise<void>;
}

const statusVariant: Record<TaskStatus, Parameters<typeof ZestBadge>[0]["variant"]> = {
    Pending: "warning",
    "In Progress": "info",
    Completed: "success",
    Overdue: "error",
    Cancelled: "neutral",
};

const priorityVariant: Record<TaskPriority, Parameters<typeof ZestBadge>[0]["variant"]> = {
    Low: "neutral",
    Medium: "info",
    High: "warning",
    Urgent: "error",
};

export function TasksTable({ tasks, onEdit, onDelete, onMarkComplete, onBulkDelete }: TasksTableProps) {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");

    const [sortBy, setSortBy] = useState<keyof TaskDoc>("dueDate");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [selected, setSelected] = useState<Record<string, boolean>>({});

    const filtered = useMemo(() => {
        return tasks.filter((t) => {
            const q = query.toLowerCase();
            const matchesQuery = !q || [t.title, t.relatedToName, t.assignedTo].some((v) => v?.toLowerCase().includes(q));
            const matchesStatus = !statusFilter || t.status === statusFilter;
            const matchesPriority = !priorityFilter || t.priority === priorityFilter;
            return matchesQuery && matchesStatus && matchesPriority;
        });
    }, [tasks, query, statusFilter, priorityFilter]);

    const sorted = useMemo(() => {
        const copy = [...filtered];
        copy.sort((a, b) => {
            const dir = sortDir === "asc" ? 1 : -1;
            const av = a[sortBy] || "";
            const bv = b[sortBy] || "";
            if (sortBy === "dueDate" || sortBy === "createdAt") {
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

    const toggleSort = (key: keyof TaskDoc) => {
        if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortBy(key);
            setSortDir("asc");
        }
    };

    const handleBulkDelete = async () => {
        const ids = Object.entries(selected).filter(([, v]) => v).map(([id]) => id);
        if (!ids.length || !onBulkDelete) return;
        if (window.confirm(`Are you sure you want to delete ${ids.length} tasks?`)) {
            await onBulkDelete(ids);
            setSelected({});
        }
    };

    const resetFilters = () => {
        setQuery("");
        setStatusFilter("");
        setPriorityFilter("");
    };

    return (
        <ZestCard className="overflow-hidden border border-slate-800 bg-slate-950/95 p-0 shadow-[0_18px_45px_-28px_rgba(2,6,23,0.85)] backdrop-blur">
            <ZestCardHeader className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6">
                <ZestCardTitle className="text-slate-100">Tasks List</ZestCardTitle>
                <div className="flex items-center gap-2">
                    {someSelected && onBulkDelete && (
                        <ZestButton
                            variant="outline"
                            onClick={handleBulkDelete}
                            className="gap-2 border-red-900 bg-slate-900 text-red-300 hover:bg-red-950 hover:text-red-200"
                        >
                            <Trash2 className="h-4 w-4" /> Bulk Delete
                        </ZestButton>
                    )}
                </div>
            </ZestCardHeader>
            <ZestCardContent className="p-6 pt-0">
                <div className="mb-6 mt-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 shadow-sm">
                    <div className="mb-3">
                        <p className="text-sm font-semibold text-slate-100">Filter Tasks</p>
                        <p className="text-xs text-slate-400">Search and narrow your task list by status or priority.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                        <div className="relative md:col-span-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search tasks, relations, assignees..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-9 text-sm text-slate-200 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:bg-slate-900 focus:ring-4 focus:ring-sky-950"
                            />
                            {query && (
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                                    onClick={() => setQuery("")}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="md:col-span-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as TaskStatus)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 shadow-sm outline-none transition focus:border-sky-500 focus:bg-slate-900 focus:ring-4 focus:ring-sky-950"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 shadow-sm outline-none transition focus:border-sky-500 focus:bg-slate-900 focus:ring-4 focus:ring-sky-950"
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
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
                                    <th className="w-12 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        <input
                                            type="checkbox"
                                            checked={allSelectedOnPage}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                const upd: Record<string, boolean> = { ...selected };
                                                pageData.forEach((r) => (upd[r.id] = checked));
                                                setSelected(upd);
                                            }}
                                            className="rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                                        />
                                    </th>
                                    <th
                                        className="cursor-pointer px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:bg-slate-800/80"
                                        onClick={() => toggleSort("title")}
                                    >
                                        <div className="flex items-center gap-1">
                                            Task
                                            {sortBy === "title" ? (
                                                sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                                            ) : (
                                                <ChevronsUpDown className="h-3 w-3 text-slate-600" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Related To</th>
                                    <th
                                        className="cursor-pointer px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:bg-slate-800/80"
                                        onClick={() => toggleSort("dueDate")}
                                    >
                                        <div className="flex items-center gap-1">
                                            Due Date
                                            {sortBy === "dueDate" ? (
                                                sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                                            ) : (
                                                <ChevronsUpDown className="h-3 w-3 text-slate-600" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Priority</th>
                                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status</th>
                                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-950">
                                {pageData.map((task) => (
                                    <tr key={task.id} className="transition-colors hover:bg-slate-900">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={!!selected[task.id]}
                                                onChange={(e) => setSelected({ ...selected, [task.id]: e.target.checked })}
                                                className="rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-slate-100">{task.title}</p>
                                            <p className="mt-0.5 text-xs text-slate-400">{task.taskType}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300">
                                            {task.relatedToName ? (
                                                <span>
                                                    <span className="font-medium">{task.relatedToName}</span>
                                                    <span className="block text-xs text-slate-500">{task.relatedToType}</span>
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300">
                                            {task.dueDate
                                                ? new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <ZestBadge variant={priorityVariant[task.priority]}>{task.priority}</ZestBadge>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <ZestBadge variant={statusVariant[task.status]}>{task.status}</ZestBadge>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <div className="flex items-center justify-end gap-1">
                                                {task.status !== "Completed" && (
                                                    <button
                                                        title="Mark Complete"
                                                        onClick={() => onMarkComplete(task)}
                                                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-emerald-950 hover:text-emerald-300"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    title="Edit"
                                                    onClick={() => onEdit(task)}
                                                    className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-sky-950 hover:text-sky-300"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={async () => {
                                                        if (window.confirm("Delete this task?")) await onDelete(task.id);
                                                    }}
                                                    className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-950 hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pageData.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                                            No tasks found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {totalPages > 1 && (
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
                )}
            </ZestCardContent>
        </ZestCard>
    );
}
