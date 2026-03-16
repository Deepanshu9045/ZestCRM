import Link from "next/link";
import Image from "next/image";
import {
    FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon, GitHubIcon
} from "@/app/icons/page";

const footerLinks = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "/" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About Us", href: "#about-us" },
            { name: "Contact Us", href: "#contact-us" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#privacy-policy" },
            { name: "Cost And Refund", href: "#cost-and-refund" },
        ],
    },
];

const socialLinks = [
    { name: "Twitter", href: "#", icon: TwitterIcon },
    { name: "Facebook", href: "#", icon: FacebookIcon },
    { name: "LinkedIn", href: "#", icon: LinkedInIcon },
    { name: "Instagram", href: "#", icon: InstagramIcon },
    { name: "GitHub", href: "#", icon: GitHubIcon },
];

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="lg:w-1/3 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black shadow-md">
                                <Image
                                    src="/logo.png"
                                    alt="Zest CRM Logo"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                                Zest CRM
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                            Manage your sales pipeline, track leads, and close deals effortlessly with our powerful and intuitive CRM.
                        </p>
                        <div className="pt-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Subscribe to our newsletter</h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                />
                                <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-sm rounded-lg hover:opacity-90 transition-opacity">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns - Side by side on mobile */}
                    <div className="lg:w-2/3 grid grid-cols-3 gap-4 lg:gap-8">
                        {footerLinks.map((column) => (
                            <div key={column.title} className="col-span-1">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    {column.title}
                                </h3>
                                <ul className="space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        © {new Date().getFullYear()} Zest CRM Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-full transition-all duration-300"
                                aria-label={social.name}
                            >
                                <social.icon className="w-5 h-5 fill-current" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
