"use client";
import React, { useState } from "react";

export default function ContactUs() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate form submission
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans">
            <div className="max-w-3xl mx-auto px-6 py-24">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    Contact Us
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                    Have a question or just want to say hi? We'd love to hear from you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            id="message"
                            required
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                    >
                        {submitted ? "Message Sent!" : "Send Message"}
                    </button>
                </form>

                <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/10 text-center">
                    <p className="text-gray-500">Or email us directly at <a href="mailto:support@zestcrm.com" className="text-blue-600 hover:underline">support@zestcrm.com</a></p>
                </div>
            </div>
        </div>
    );
}
