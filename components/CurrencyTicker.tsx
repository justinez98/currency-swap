"use client";

import { useState, useMemo, memo } from "react";
import Marquee from "react-fast-marquee";
import { Currency } from "@/types/currency";
import { getCurrencyCodes, CURRENCY_INFO } from "@/utils/currencies";
import { convertCurrency } from "@/utils/conversion";
import { formatAmountWithSeparators } from "@/utils/conversion";

export const CurrencyTicker = memo(function CurrencyTicker() {
    const [showTooltip, setShowTooltip] = useState(false);

    // Memoize currency rates calculation - rates are static, so only calculate once
    const currencyRates = useMemo(() => {
        const currencies = getCurrencyCodes();
        return currencies.map((code) => {
            try {
                const usdRate = code === Currency.USD ? 1 : convertCurrency(1, code, Currency.USD, false);
                return {
                    code,
                    name: CURRENCY_INFO[code].name,
                    usdRate,
                };
            } catch {
                return null;
            }
        }).filter((item): item is { code: Currency; name: string; usdRate: number; } => item !== null);
    }, []);

    return (
        <div className="w-full mb-6">
            <div className="mb-3 px-4">
                <div className="inline-flex items-center gap-2 relative">
                    <div
                        className="relative w-8 h-8 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center hover:bg-gray-800 transition-colors cursor-help"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    {showTooltip && (
                        <div
                            className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-xs text-gray-300 whitespace-nowrap z-[9999] pointer-events-none opacity-100"
                        >
                            Rates shown are relative to USD (US Dollar)
                            <div className="absolute top-full left-4 -mt-1">
                                <div className="w-2 h-2 bg-gray-800 border-r border-b border-gray-700 rotate-45"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-hidden">

                <Marquee
                    speed={50}
                    gradient={true}
                    gradientColor="rgb(0, 0, 0)"
                    gradientWidth={50}
                    pauseOnHover={true}
                >
                    {currencyRates.map((currency) => (
                        <div
                            key={currency.code}
                            className="flex items-center gap-1.5 px-2 flex-shrink-0 whitespace-nowrap"
                        >
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/50 border border-gray-800">
                                <span className="text-sm font-semibold text-white">
                                    {currency.code}
                                </span>
                                <span className="text-xs text-gray-400">
                                    ${formatAmountWithSeparators(currency.usdRate, 5)}
                                </span>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    );
});
