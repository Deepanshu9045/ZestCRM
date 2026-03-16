import Link from "next/link";
import Image from "next/image";
import CursorTrace from "@/components/layout/CursorTrace";
import HeadPage from "./our-services/page";
import AboutUs from "./about-us/page";
import CostAndRefund from "./cost-and-refund/page";
import ContactUs from "./contact-us/page";
import PrivacyPolicy from "./privacy-policy/page";
import Footer from "@/components/layout/footer";


export default function HomePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100">
            <CursorTrace />
            {/* Navbar */}
            <nav className="w-full h-20 flex items-center justify-between px-4 md:px-8 py-6 border-b border-gray-100 dark:border-gray-800/60 backdrop-blur-md sticky top-0 z-50 bg-white/80 dark:bg-black/80">

                {/* Left: Logo + Brand */}
                <Link href="/">
                    <div className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-105">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                            <Image
                                src="/logo.png"
                                alt="ZestCRM Logo"
                                fill
                                sizes="(max-width: 768px) 40px, 48px"
                                className="object-cover"
                                priority
                            />
                        </div>

                        <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            ZestCRM
                        </h1>
                    </div>
                </Link>

                {/* Center: Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <Link href="#about-us" className="hover:text-blue-600 transition-colors">About Us</Link>
                    <Link href="#contact-us" className="hover:text-blue-600 transition-colors">Contact Us</Link>
                    <Link href="#privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                    <Link href="#cost-and-refund" className="hover:text-blue-600 transition-colors">Cost & Refund</Link>
                </div>

                {/* Right: Buttons */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="md:block px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        Login
                    </Link>

                    <Link
                        href="/signup"
                        className="px-4 py-2 md:px-5 md:py-2.5 text-sm font-semibold text-white bg-gray-900 dark:bg-white dark:text-black rounded-full shadow-lg shadow-gray-500/20 hover:shadow-gray-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Sign Up
                    </Link>
                </div>

            </nav>
            <HeadPage />

            <section id="about-us">
                <AboutUs />
            </section>

            <section id="cost-and-refund">
                <CostAndRefund />
            </section>

            <section id="contact-us">
                <ContactUs />
            </section>

            <section id="privacy-policy">
                <PrivacyPolicy />
            </section>

            <Footer />
        </div>
    );
}
