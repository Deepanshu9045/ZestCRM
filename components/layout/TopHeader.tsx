"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface TopHeaderProps {
    setMobileMenuOpen: (open: boolean) => void;
    title?: string;
}

type HeaderProfile = {
    businessName: string;
    businessOwner: string;
};

const emptyProfile: HeaderProfile = {
    businessName: "",
    businessOwner: "",
};

export function TopHeader({ setMobileMenuOpen, title = "Dashboard" }: TopHeaderProps) {
    const router = useRouter();
    const [profile, setProfile] = useState<HeaderProfile>(emptyProfile);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setProfile(emptyProfile);
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userData = userDoc.data();

                setProfile({
                    businessName: userData?.businessName ?? "",
                    businessOwner: userData?.businessOwner ?? user.displayName ?? "",
                });
            } catch (error) {
                console.error("Failed to load header profile:", error);
                setProfile({
                    businessName: "",
                    businessOwner: user.displayName ?? "",
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const avatarFallback = (profile.businessName || profile.businessOwner || "U")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/80">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-slate-700 lg:hidden dark:text-slate-300"
                onClick={() => setMobileMenuOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="h-6 w-px bg-slate-200 lg:hidden dark:bg-slate-700" aria-hidden="true" />

            <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch lg:gap-x-6">
                <h1 className="hidden text-xl font-semibold leading-6 text-slate-900 sm:block dark:text-white">
                    {title}
                </h1>

                <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
                    <form className="relative flex max-w-md flex-1" action="#" method="GET">
                        <label htmlFor="search-field" className="sr-only">
                            Search
                        </label>
                        <Search
                            className="pointer-events-none absolute inset-y-0 left-0 ml-3 h-full w-5 text-slate-400"
                            aria-hidden="true"
                        />
                        <input
                            id="search-field"
                            className="block h-9 w-full rounded-full border-0 py-0 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-indigo-500"
                            placeholder="Search..."
                            type="search"
                            name="search"
                        />
                    </form>

                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        <button
                            type="button"
                            className="-m-2.5 relative p-2.5 text-slate-400 transition-colors hover:text-slate-500"
                        >
                            <span className="sr-only">View notifications</span>
                            <Bell className="h-6 w-6" aria-hidden="true" />
                            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                        </button>

                        <div
                            className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700"
                            aria-hidden="true"
                        />

                        <button
                            type="button"
                            onClick={() => router.push("/settings")}
                            className="cursor-pointer rounded-full p-1 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                            <span className="flex items-center gap-x-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 text-sm font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400">
                                    {avatarFallback}
                                </span>
                                <span className="hidden lg:flex lg:items-center">
                                    <span
                                        className="mr-2 text-sm font-medium leading-6 text-slate-900 dark:text-slate-100"
                                        aria-hidden="true"
                                    >
                                        {profile.businessName || profile.businessOwner || "User"}
                                    </span>
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
