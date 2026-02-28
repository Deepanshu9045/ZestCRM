"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Set display name
            await updateProfile(userCredential.user, {
                displayName: fullName,
            });

            // Save user to Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name: fullName,
                email: email,
            });

            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                const message = err.message;
                if (message.includes("email-already-in-use")) {
                    setError("An account with this email already exists.");
                } else if (message.includes("invalid-email")) {
                    setError("Please enter a valid email address.");
                } else if (message.includes("weak-password")) {
                    setError("Password is too weak. Use at least 8 characters.");
                } else if (message.includes("operation-not-allowed") || message.includes("OPERATION_NOT_ALLOWED")) {
                    setError("Email/Password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.");
                } else if (message.includes("Missing or insufficient permissions") || message.includes("permission-denied")) {
                    setError("Firestore permission denied. Go to Firebase Console → Firestore Database → Rules, and allow write access for authenticated users.");
                } else if (message.includes("network-request-failed")) {
                    setError("Network error. Please check your connection.");
                } else {
                    setError(`Signup failed: ${message}`);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white">Create account</h2>
                <p className="mt-1 text-sm text-slate-400">
                    Get started with ZestCRM today
                </p>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div>
                    <label
                        htmlFor="signup-name"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                        Full Name
                    </label>
                    <input
                        id="signup-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
                    />
                </div>

                {/* Email */}
                <div>
                    <label
                        htmlFor="signup-email"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                        Email Address
                    </label>
                    <input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
                    />
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="signup-password"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                    {/* Password strength indicator */}
                    {password && (
                        <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${password.length >= level * 3
                                        ? password.length >= 12
                                            ? "bg-emerald-500"
                                            : password.length >= 8
                                                ? "bg-amber-500"
                                                : "bg-red-500"
                                        : "bg-white/10"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label
                        htmlFor="signup-confirm-password"
                        className="mb-1.5 block text-sm font-medium text-slate-300"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="signup-confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:bg-white/10 focus:ring-2 ${confirmPassword && confirmPassword !== password
                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                            : "border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20"
                            }`}
                    />
                    {confirmPassword && confirmPassword !== password && (
                        <p className="mt-1.5 text-xs text-red-400">
                            Passwords do not match
                        </p>
                    )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">
                    <input
                        id="signup-terms"
                        type="checkbox"
                        required
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/20"
                    />
                    <label htmlFor="signup-terms" className="text-xs text-slate-400">
                        I agree to the{" "}
                        <span className="cursor-pointer text-purple-400 hover:text-purple-300">
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="cursor-pointer text-purple-400 hover:text-purple-300">
                            Privacy Policy
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Creating account…
                        </span>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-500">or</span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google Sign Up */}
            <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
            >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </button>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-purple-400 transition-colors hover:text-purple-300"
                >
                    Sign in
                </Link>
            </p>
        </>
    );
}
