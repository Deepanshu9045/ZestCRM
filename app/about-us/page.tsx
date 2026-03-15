import React from "react";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    About Us
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                    At Zest Invoice, we're on a mission to simplify financial management for freelancers and small businesses worldwide. We believe that getting paid shouldn't be a hassle.
                </p>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            To empower entrepreneurs with intuitive, powerful, and beautiful tools that make managing finances a breeze. We strive to automate the mundane so you can focus on what you love—building your business.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            A world where every business owner, no matter how small, has access to enterprise-grade financial clarity and control, without the enterprise-grade complexity.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Zest?</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">3x</div>
                            <p className="text-sm text-gray-500">Faster Payments</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-violet-600 mb-2">10k+</div>
                            <p className="text-sm text-gray-500">Happy Users</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-pink-600 mb-2">99.9%</div>
                            <p className="text-sm text-gray-500">Uptime</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
