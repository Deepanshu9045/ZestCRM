"use client";
import emailjs from "@emailjs/browser";
import React, { useState } from "react";

type ContactForm = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

const initialForm: ContactForm = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

export default function ContactUs() {
    const [form, setForm] = useState<ContactForm>(initialForm);
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        if (!serviceId || !templateId || !publicKey) {
            setStatus("error");
            return;
        }

        try {
            await emailjs.send(
                serviceId,
                templateId,
                {
                    name: form.name,
                    email: form.email,
                    subject: form.subject,
                    time: new Date().toLocaleString(),
                    message: form.message,
                    reply_to: form.email,
                },
                {
                    publicKey,
                },
            );

            setForm(initialForm);
            setStatus("sent");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-24">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    Contact Us
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                    Have a question or just want to say hi? We&apos;d love to hear from you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
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
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="How can we help?"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                    >
                        {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent!" : "Send Message"}
                    </button>
                    {status === "error" && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            We couldn&apos;t send your message right now. Please email us directly.
                        </p>
                    )}
                    {status === "sent" && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Thanks for reaching out. We&apos;ll get back to you soon.
                        </p>
                    )}
                </form>

                <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/10 text-center">
                    <p className="text-gray-500">Or email us directly at <a href="mailto:support@zestcrm.com" className="text-blue-600 hover:underline">support@zestcrm.com</a></p>
                </div>
            </div>
        </div>
    );
}
