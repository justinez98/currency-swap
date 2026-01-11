"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string; };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to console or error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-black py-8 sm:py-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center">
                {/* Error Icon */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-4">
                        <svg
                            className="w-10 h-10 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full"></div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Something went wrong!
                    </h1>
                    <p className="text-gray-400 text-lg mb-2">
                        An unexpected error occurred.
                    </p>
                    {error.message && (
                        <p className="text-sm text-gray-500 mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800 max-w-md mx-auto">
                            {error.message}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 rounded-xl bg-[#00ff88] hover:bg-[#00e677] text-black font-semibold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-gray-700"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
