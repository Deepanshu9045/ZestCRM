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
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100">



            {/* Hero Content */}
            <main className="flex flex-col items-center justify-center pt-10 pb-20 px-4 text-center">
                <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">

                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        Zest CRM made <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                            Powering Smarter Customer Relationships.
                        </span>
                    </h2>
                </div>

                {/* Features Section */}
                <div className="max-w-7xl mx-auto mt-10 perspective-1000">

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

                            return (
                                <div key={index} className={`group relative transition-all duration-500 hover:-translate-y-2 ${tiltClass}`}>
                                    {/* Glow Effect with Pulse */}
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt`}></div>

                                    {/* Card Content */}
                                    <div className="relative h-full bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 p-2 rounded-[2rem] overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-shimmer delay-100`}></div>

                                        <div className={`h-full bg-gray-50/50 dark:bg-[#111] p-8 rounded-[1.8rem] transition-colors relative overflow-hidden group-hover:bg-opacity-50`}>
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
