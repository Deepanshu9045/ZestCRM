import React from "react";

export default function CostAndRefund() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans">
            <div className="max-w-6xl mx-auto px-6 py-24">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
                    Cost & Refund Policy
                </h1>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Transparent Pricing</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Our goal is to keep things simple. We offer a free tier for individuals just starting out and affordable plans for growing businesses.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                            <li><strong>Free Plan:</strong> $0/month for up to 3 invoices.</li>
                            <li><strong>Pro Plan:</strong> $15/month for unlimited invoices and automation.</li>
                            <li><strong>Enterprise:</strong> Custom pricing for large teams.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Refund Policy</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                            We want you to be happy with Zest Invoice. If you're not satisfied, we're here to help.
                        </p>
                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
                            <h3 className="font-bold mb-2">30-Day Money-Back Guarantee</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                If you are not completely satisfied with our Pro plan within the first 30 days of your subscription, simply contact our support team, and we will issue a full refund—no questions asked.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Cancellation</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You can cancel your subscription at any time directly from your account settings. Your access will continue until the end of your current billing period.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
