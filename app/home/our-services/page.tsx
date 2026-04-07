import {
    ShareIcon, MailIcon,
    ChartIcon, BriefcaseIcon, BankIcon, ShieldIcon, BoltIcon, UsersIcon,
    CloudIcon, ClockIcon, MobileIcon, DocumentSearchIcon
} from "@/app/icons/page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Zest CRM - Home",
    description: "Welcome to Zest CRM",
};

interface FeatureItem {
    icon: React.ElementType;
    text: string;
    iconColorClass: string;
}

interface Feature {
    title: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
    buttonText: string;
    // Color themes
    gradientFrom: string;
    gradientTo: string;
    shadowColor: string;
    iconBgColor: string;
    textColor: string;
    items: FeatureItem[];
}

const features: Feature[] = [
    {
        title: "Sales Pipeline",
        description: "Visualize and manage deals through customizable stages with our drag-and-drop Kanban board.",
        icon: BriefcaseIcon,
        buttonText: "Manage Pipeline",
        gradientFrom: "from-blue-600",
        gradientTo: "to-cyan-600",
        shadowColor: "shadow-blue-500/30",
        iconBgColor: "bg-blue-600",
        textColor: "text-blue-600 dark:text-blue-400",
        items: [
            { icon: BriefcaseIcon, text: "Kanban Board", iconColorClass: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30" },
            { icon: DocumentSearchIcon, text: "Deal Tracking", iconColorClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30" }
        ]
    },
    {
        title: "Lead & Customer Management",
        description: "Capture leads and seamlessly convert them to active customers. Keep track of all customer interactions in one place.",
        icon: UsersIcon,
        buttonText: "Manage Customers",
        gradientFrom: "from-emerald-500",
        gradientTo: "to-teal-500",
        shadowColor: "shadow-emerald-500/30",
        iconBgColor: "bg-emerald-500",
        textColor: "text-emerald-600 dark:text-emerald-400",
        items: [
            { icon: UsersIcon, text: "Lead Capture", iconColorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30" },
            { icon: BankIcon, text: "Customer Profiles", iconColorClass: "text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30" }
        ]
    },
    {
        title: "Task & Activity Tracking",
        description: "Never miss a follow-up. Create tasks, set deadlines, and view all team activities in a real-time feed.",
        icon: ClockIcon,
        buttonText: "Track Activities",
        gradientFrom: "from-orange-500",
        gradientTo: "to-amber-500",
        shadowColor: "shadow-orange-500/30",
        iconBgColor: "bg-orange-500",
        textColor: "text-orange-600 dark:text-orange-400",
        items: [
            { icon: ClockIcon, text: "Upcoming Tasks", iconColorClass: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30" },
            { icon: ShieldIcon, text: "Activity Feed", iconColorClass: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30" }
        ]
    },
    {
        title: "Reports & Analytics",
        description: "Make data-driven decisions. Visual dashboards for revenue forecasts, lead sources, and conversion rates.",
        icon: ChartIcon,
        buttonText: "See Insights",
        gradientFrom: "from-cyan-500",
        gradientTo: "to-blue-500",
        shadowColor: "shadow-cyan-500/30",
        iconBgColor: "bg-cyan-500",
        textColor: "text-cyan-600 dark:text-cyan-400",
        items: [
            { icon: ChartIcon, text: "Revenue Tracking", iconColorClass: "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30" },
            { icon: DocumentSearchIcon, text: "Lead Source Analysis", iconColorClass: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30" }
        ]
    },
    {
        title: "Cloud & Mobile",
        description: "Access your CRM from anywhere. Secure cloud storage and mobile-friendly design for on-the-go management.",
        icon: CloudIcon,
        badge: "ANYWHERE ACCESS",
        buttonText: "Go Mobile",
        gradientFrom: "from-indigo-600",
        gradientTo: "to-purple-600",
        shadowColor: "shadow-indigo-500/30",
        iconBgColor: "bg-indigo-600",
        textColor: "text-indigo-600 dark:text-indigo-400",
        items: [
            { icon: MobileIcon, text: "Mobile Optimized", iconColorClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30" },
            { icon: CloudIcon, text: "Real-time Sync", iconColorClass: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30" }
        ]
    }
];

export default function HeadPage() {
    return (
        <div className="text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100">
            {/* Hero Content */}
            <main className="relative flex flex-col items-center justify-center pt-10 pb-20 px-4">
                <div className="w-full max-w-7xl mx-auto grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
                    <div className="space-y-6 text-left animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur dark:border-blue-900/40 dark:bg-slate-950/60 dark:text-blue-300">
                            <BoltIcon className="h-4 w-4" />
                            Built for modern sales teams
                        </div>

                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.05]">
                            Zest CRM made
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600">
                                Powering Smarter Customer Relationships.
                            </span>
                        </h2>

                        <p className="max-w-2xl text-base md:text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Bring leads, pipeline activity, task follow-ups, and revenue visibility into one polished workspace your whole team can actually move fast in.
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <div className="rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-900/80">Lead capture</div>
                            <div className="rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-900/80">Task automation</div>
                            <div className="rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-900/80">Sales forecasting</div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[600px] animate-in fade-in zoom-in-95 duration-1000">
                        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,_rgba(56,189,248,0.28),_transparent_32%),radial-gradient(circle_at_80%_10%,_rgba(16,185,129,0.2),_transparent_26%),radial-gradient(circle_at_70%_80%,_rgba(14,165,233,0.18),_transparent_28%)] blur-3xl" />
                        <div className="absolute left-10 top-10 -z-10 h-32 w-32 rounded-full border border-cyan-200/70 bg-cyan-100/40 blur-sm dark:border-cyan-500/10 dark:bg-cyan-500/5" />
                        <div className="absolute bottom-12 right-12 -z-10 h-24 w-24 rounded-[2rem] border border-emerald-200/70 bg-emerald-100/40 rotate-12 blur-sm dark:border-emerald-500/10 dark:bg-emerald-500/5" />

                        <div className="relative pt-12">
                            <div className="relative rounded-[2.25rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 shadow-[0_35px_90px_rgba(15,23,42,0.28)] dark:border-white/10">
                                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

                                <div className="rounded-[1.7rem] border border-white/10 bg-slate-900/90 p-5">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-2">
                                                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">CRM Command Center</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                                            <ShareIcon className="h-4 w-4" />
                                            Real-time sync
                                        </div>
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                                        <div className="space-y-4">
                                            <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,47,73,0.9),rgba(15,23,42,0.95))] p-4 text-white">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Dashboard preview</p>
                                                        <p className="mt-2 text-2xl font-bold">Sales at a glance</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-cyan-300/10 p-2 text-cyan-200">
                                                        <ChartIcon className="h-5 w-5" />
                                                    </div>
                                                </div>

                                                <div className="mt-5 grid grid-cols-4 gap-3">
                                                    {[68, 92, 56, 112, 74, 98, 84, 120].map((height, index) => (
                                                        <div key={index} className="flex h-28 items-end">
                                                            <div
                                                                className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-500 via-sky-400 to-emerald-300 shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                                                                style={{ height: `${height}%` }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-300">
                                                    <div className="rounded-xl bg-white/5 px-3 py-2">Qualified</div>
                                                    <div className="rounded-xl bg-white/5 px-3 py-2">Negotiation</div>
                                                    <div className="rounded-xl bg-white/5 px-3 py-2">Won</div>
                                                </div>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-white">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Lead flow</p>
                                                            <p className="mt-2 text-xl font-bold">126 new leads</p>
                                                        </div>
                                                        <UsersIcon className="h-5 w-5 text-emerald-300" />
                                                    </div>
                                                    <div className="mt-4 h-2 rounded-full bg-white/10">
                                                        <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" />
                                                    </div>
                                                </div>

                                                <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-white">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Revenue forecast</p>
                                                            <p className="mt-2 text-xl font-bold">$54.8k</p>
                                                        </div>
                                                        <BankIcon className="h-5 w-5 text-cyan-300" />
                                                    </div>
                                                    <div className="mt-4 flex gap-2">
                                                        <span className="h-8 flex-1 rounded-xl bg-cyan-400/30" />
                                                        <span className="h-8 flex-1 rounded-xl bg-cyan-400/50" />
                                                        <span className="h-8 flex-1 rounded-xl bg-cyan-400/70" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-white">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Pipeline pulse</p>
                                                        <p className="mt-2 text-xl font-semibold">43 active deals</p>
                                                    </div>
                                                    <BriefcaseIcon className="h-5 w-5 text-violet-300" />
                                                </div>
                                                <div className="mt-4 space-y-3">
                                                    {[
                                                        ["Discovery", "82%", "bg-violet-400"],
                                                        ["Demo", "61%", "bg-cyan-400"],
                                                        ["Proposal", "44%", "bg-emerald-400"],
                                                    ].map(([label, value, color]) => (
                                                        <div key={label}>
                                                            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                                                                <span>{label}</span>
                                                                <span>{value}</span>
                                                            </div>
                                                            <div className="h-2 rounded-full bg-white/10">
                                                                <div className={`h-2 rounded-full ${color}`} style={{ width: value }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,132,199,0.18))] p-4 text-white">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Today&apos;s tasks</p>
                                                    <ClockIcon className="h-5 w-5 text-orange-300" />
                                                </div>
                                                <div className="mt-4 space-y-3">
                                                    {[
                                                        "Follow up with Acme Corp",
                                                        "Review Q2 sales forecast",
                                                        "Assign demo requests",
                                                    ].map((task, index) => (
                                                        <div key={task} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm">
                                                            <div className={`flex h-7 w-7 items-center justify-center rounded-full ${index === 0 ? "bg-emerald-400/20 text-emerald-300" : index === 1 ? "bg-cyan-400/20 text-cyan-300" : "bg-violet-400/20 text-violet-300"}`}>
                                                                {index + 1}
                                                            </div>
                                                            <span>{task}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-auto h-6 w-[78%] rounded-b-[999px] bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 shadow-[0_18px_45px_rgba(15,23,42,0.22)]" />
                        </div>

                        <div className="absolute -left-6 top-6 rounded-[1.6rem] border border-white/70 bg-white/90 px-4 py-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-900/85">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Leads</p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <UsersIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">+126</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">this week</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-4 top-28 rounded-[1.6rem] border border-white/70 bg-white/90 px-4 py-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-900/85">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Tasks</p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="rounded-2xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                                    <ClockIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">18</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">due today</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-24 -left-2 rounded-[1.6rem] border border-white/70 bg-white/90 px-4 py-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-900/85">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Sales</p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="rounded-2xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                                    <MailIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">32</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">deals closing</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-2 right-10 rounded-[1.6rem] border border-white/70 bg-white/90 px-4 py-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-900/85">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Revenue</p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300">
                                    <BankIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">$54.8k</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">forecast</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-7xl mx-auto mt-16 perspective-1000">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-4">
                        {features.map((feature, index) => {
                            // Determine tilt direction based on index (assuming 3 columns)
                            // Left column (0, 3, etc.): Tilt Right (positive rotation)
                            // Middle column (1, 4, etc.): No Tilt
                            // Right column (2, 5, etc.): Tilt Left (negative rotation)
                            let tiltClass = "hover:rotate-0";
                            if (index % 3 === 2) {
                                tiltClass = "lg:hover:rotate-1"; // Tilt Right only on lg
                            } else if (index % 3 === 0) {
                                tiltClass = "lg:hover:-rotate-1"; // Tilt Left only on lg
                            }

                            const offsetClass =
                                feature.title === "Reports & Analytics" || feature.title === "Cloud & Mobile"
                                    ? "md:translate-x40 lg:translate-x-50"
                                    : "";

                            return (
                                <div key={index} className={`group relative transition-all duration-500 hover:-translate-y-2 ${tiltClass} ${offsetClass}`}>
                                    {/* Glow Effect with Pulse */}
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt`}></div>

                                    {/* Card Content */}
                                    <div className="relative h-full bg-slate-50 dark:bg-slate-950 border border-gray-200 dark:border-white/10 p-2 rounded-[2rem] overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-shimmer delay-100`}></div>

                                        <div className={`h-full bg-slate-100/70 dark:bg-slate-900/60 p-8 rounded-[1.8rem] transition-colors relative overflow-hidden group-hover:bg-opacity-50`}>
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                                            {/* Floating Icon with 3D effect */}
                                            <div className="relative z-10 mb-8 flex justify-between items-start">
                                                <div className={`w-14 h-14 ${feature.iconBgColor} rounded-2xl flex items-center justify-center text-white shadow-lg ${feature.shadowColor} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                                                    <feature.icon className="w-7 h-7" />
                                                </div>
                                                {feature.badge && (
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 group-hover:translate-x-0">
                                                        <span className={`text-[10px] font-bold px-2 py-1 bg-white dark:bg-white/10 ${feature.textColor} rounded-full border border-gray-100 dark:border-white/5 shadow-sm`}>
                                                            {feature.badge}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Text Content */}
                                            <div className="relative z-10 space-y-3 mb-6">
                                                <h4 className={`text-2xl font-bold text-gray-900 dark:text-white group-hover:${feature.textColor} transition-colors`}>
                                                    {feature.title}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                                    {feature.description}
                                                </p>
                                            </div>

                                            {/* Interactive List */}
                                            <div className="relative z-10 space-y-2">
                                                {feature.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-white/10">
                                                        <div className={`p-1.5 rounded-lg ${item.iconColorClass}`}>
                                                            <item.icon className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{item.text}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Action Button appearing on hover */}
                                            <div className="relative z-10 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                                                <button className={`flex items-center gap-2 text-sm font-bold ${feature.textColor} group-hover:gap-3 transition-all duration-300`}>
                                                    {feature.buttonText} <span className="text-lg">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] animate-blob opacity-70"></div>
                    <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] animate-blob [animation-delay:2s] opacity-70"></div>
                    <div className="absolute bottom-10 left-1/2 w-[500px] h-[500px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[128px] animate-blob [animation-delay:4s] opacity-70"></div>
                </div>

            </main>
        </div>
    );
}
