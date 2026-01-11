"use client";

import { memo, useMemo } from "react";
import { formatAmountWithSeparators, calculateFee, getBaseExchangeRate } from "@/utils/conversion";
import { Currency } from "@/types/currency";
import { CURRENCY_INFO } from "@/utils/currencies";

interface ConversionReceiptProps {
    fromCurrency: Currency;
    toCurrency: Currency;
    inputAmount: string;
    outputAmount: string;
    onBack: () => void;
}

export const ConversionReceipt = memo(function ConversionReceipt({
    fromCurrency,
    toCurrency,
    inputAmount,
    outputAmount,
    onBack,
}: ConversionReceiptProps) {
    // Memoize all calculations
    const receiptData = useMemo(() => {
        const inputValue = parseFloat(inputAmount);
        const outputValue = parseFloat(outputAmount);
        const feeAmount = calculateFee(outputValue);

        // Calculate effective exchange rate (actual rate used, with fee)
        const effectiveRate = inputValue > 0 ? outputValue / inputValue : 0;

        // Calculate base exchange rate (without fee) for display
        // Uses memoized utility function that handles all currency pairs
        const baseRate = getBaseExchangeRate(fromCurrency, toCurrency);

        return { inputValue, outputValue, feeAmount, effectiveRate, baseRate };
    }, [inputAmount, outputAmount, fromCurrency, toCurrency]);

    const { inputValue, outputValue, feeAmount, effectiveRate } = receiptData;

    // Format date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="w-full max-w-2xl mx-auto p-1 sm:p-6">
            <div className="space-y-0 rounded-2xl border-2 border-gray-800 p-6 bg-gray-900/30">
                {/* Success Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00ff88]/20 mb-4">
                        <svg
                            className="w-8 h-8 text-[#00ff88]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Conversion Successful!</h2>
                    <p className="text-sm text-gray-400">Your currency exchange has been completed</p>
                </div>

                {/* Receipt Card */}
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-6">
                    <div className="text-center mb-6 pb-4 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-1">Transaction Receipt</h3>
                        <p className="text-xs text-gray-500 truncate">{dateStr} at {timeStr}</p>
                    </div>

                    {/* Exchange Details */}
                    <div className="space-y-4 mb-6">
                        {/* You Sent */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-400 mb-1">You Sent</p>
                                <p className="text-lg font-semibold text-white truncate">
                                    {formatAmountWithSeparators(inputValue, 2)} {fromCurrency}
                                </p>
                            </div>
                            <div className="text-right min-w-0 flex-shrink-0">
                                <p className="text-xs text-gray-500 mb-1">Currency</p>
                                <p className="text-sm font-medium text-gray-300 truncate">
                                    {CURRENCY_INFO[fromCurrency]?.name || fromCurrency}
                                </p>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center my-2">
                            <div className="w-8 h-8 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-[#00ff88]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* You Received */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-400 mb-1">You Received</p>
                                <p className="text-lg font-semibold text-[#00ff88] truncate">
                                    {formatAmountWithSeparators(outputValue, 2)} {toCurrency}
                                </p>
                            </div>
                            <div className="text-right min-w-0 flex-shrink-0">
                                <p className="text-xs text-gray-500 mb-1">Currency</p>
                                <p className="text-sm font-medium text-gray-300 truncate">
                                    {CURRENCY_INFO[toCurrency]?.name || toCurrency}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="pt-4 border-t border-gray-800 space-y-3">
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-400 flex-shrink-0">Exchange Rate</span>
                            <span className="text-sm font-medium text-white text-right truncate min-w-0">
                                1 {fromCurrency} = {formatAmountWithSeparators(effectiveRate, 6)} {toCurrency}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-400 flex-shrink-0">Platform Fee (1%)</span>
                            <span className="text-sm font-medium text-white text-right truncate min-w-0">
                                {formatAmountWithSeparators(feeAmount, 2)} {toCurrency}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4 pt-2 border-t border-gray-800">
                            <span className="text-sm font-semibold text-gray-300 flex-shrink-0">Total Amount</span>
                            <span className="text-base font-bold text-[#00ff88] text-right truncate min-w-0">
                                {formatAmountWithSeparators(outputValue, 2)} {toCurrency}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="w-full py-4 px-6 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-gray-700"
                >
                    Back to Swap
                </button>
            </div>
        </div>
    );
});
