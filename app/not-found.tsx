"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black py-8 sm:py-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center">
                {/* 404 Number */}
                <div className="mb-6">
                    <h1 className="text-8xl sm:text-9xl font-extrabold text-white mb-4 tracking-tight">
                        404
                    </h1>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[#00ff88] to-transparent rounded-full"></div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-400 text-lg">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl bg-[#00ff88] hover:bg-[#00e677] text-black font-semibold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                        Go to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-gray-700"
                    >
                        Go Back
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-12 flex justify-center gap-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#00ff88]/30 animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>
            </div>
        </main>
    );
}
