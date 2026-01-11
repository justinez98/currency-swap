"use client";

import { useEffect } from "react";
import { getShareableLink } from "@/hooks/useURLSync";

import { Currency } from "@/types/currency";

interface ShareSheetProps {
    isOpen: boolean;
    onClose: () => void;
    fromCurrency: Currency;
    toCurrency: Currency;
    inputAmount: string;
    outputAmount: string;
}

export function ShareSheet({
    isOpen,
    onClose,
    fromCurrency,
    toCurrency,
    inputAmount,
    outputAmount,
}: ShareSheetProps) {
    // Close on escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const shareUrl = getShareableLink();
    const shareText = `Check out this currency swap: ${inputAmount} ${fromCurrency} → ${outputAmount} ${toCurrency}`;

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Currency Swap",
                    text: shareText,
                    url: shareUrl,
                });
                onClose();
            } catch (err) {
                // User cancelled or error
                if ((err as Error).name !== "AbortError") {
                    console.error("Share failed:", err);
                }
            }
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            onClose();
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        window.open(whatsappUrl, "_blank");
        onClose();
    };


    const handleEmail = () => {
        const subject = encodeURIComponent("Currency Swap");
        const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 bg-gray-900 rounded-t-3xl border-t border-gray-800 shadow-2xl animate-slide-up">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-6 pb-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white">Share</h3>
                </div>

                {/* Share Options */}
                <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {/* Native Share (if available) */}
                    {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                        <button
                            onClick={handleNativeShare}
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-left"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-[#00ff88]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-medium">Share via...</div>
                                <div className="text-sm text-gray-400">Native share options</div>
                            </div>
                        </button>
                    )}

                    {/* WhatsApp */}
                    <button
                        onClick={handleWhatsApp}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-left"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-6 h-6 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="text-white font-medium">WhatsApp</div>
                            <div className="text-sm text-gray-400">Share via WhatsApp</div>
                        </div>
                    </button>

                    {/* Copy Link */}
                    <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-left"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-6 h-6 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="text-white font-medium">Copy Link</div>
                            <div className="text-sm text-gray-400">Copy shareable link</div>
                        </div>
                    </button>

                    {/* Email */}
                    <button
                        onClick={handleEmail}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-left"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="text-white font-medium">Email</div>
                            <div className="text-sm text-gray-400">Share via email</div>
                        </div>
                    </button>
                </div>

                {/* Cancel Button */}
                <div className="px-6 py-4 border-t border-gray-800">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}
