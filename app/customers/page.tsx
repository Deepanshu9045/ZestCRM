"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    Users,
    Plus,
    Search,
    Building2,
    Mail,
    Phone,
    MoreVertical
} from "lucide-react";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    setLoading(true);
                    const customersRef = collection(db, "customers");
                    const q = query(customersRef, where("uId", "==", user.uid));
                    const querySnapshot = await getDocs(q);

                    const customersList = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }));

                    customersList.sort((a: any, b: any) => {
                        const dateA = new Date(a.createdAt || 0).getTime();
                        const dateB = new Date(b.createdAt || 0).getTime();
                        return dateB - dateA; // Newest first
                    });

                    setCustomers(customersList);
                } catch (error) {
                    console.error("Error fetching customers:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setCustomers([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        Customers
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        A list of all the customers in your database including their name, company, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href="/customers/new"
                        className="inline-flex items-center gap-2 justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add customer
                    </Link>
                </div>
            </div>

            {/* Filters / Search Bar */}
            <div className="mb-6 flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-indigo-500 transition-all dark:placeholder:text-slate-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6 dark:text-white">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Company
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Contact
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    LTV
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                                            Loading customers...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Users className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                                            <p>No customers found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                                                    {customer.name?.charAt(0) || "C"}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-white">{customer.name}</div>
                                                    <div className="text-slate-500 dark:text-slate-400 hidden sm:block text-xs">{customer.customerType} • {customer.id?.substring(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-slate-400" />
                                                <span className="truncate max-w-[150px]">{customer.company || "—"}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">{customer.industry}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate max-w-[150px]">{customer.email || "—"}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                    <span>{customer.phone || "—"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${customer.status === "Active"
                                                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                                                : customer.status === "Lead"
                                                    ? "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20"
                                                    : "bg-slate-50 text-slate-600 ring-slate-500/10 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20"
                                                }`}>
                                                {customer.status || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900 dark:text-white font-medium">
                                            {customer.lifetimeValue ? `₹${customer.lifetimeValue.toLocaleString('en-IN')}` : "—"}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                <span className="sr-only">Edit</span>
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
