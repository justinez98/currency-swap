"use client";

import { useEffect, useMemo, useState } from "react";
import { CurrencyBox } from "./CurrencyBox";
import { SwapButton } from "./SwapButton";
import { FeeDetails } from "./FeeDetails";
import { ConversionReceipt } from "./ConversionReceipt";
import { ShareSheet } from "./ShareSheet";
import { useSwapStore } from "@/store/useSwapStore";
import { convertCurrency } from "@/utils/conversion";
import { Currency } from "@/types/currency";

export function SwapInterface() {
    const {
        fromCurrency,
        toCurrency,
        inputAmount,
        outputAmount,
        lastEdited,
        isCalculating,
        error,
        showReceipt,
        setFromCurrency,
        setToCurrency,
        setInputAmount,
        setOutputAmount,
        swapCurrencies,
        calculateBasedOnLastEdited,
        handleConvert,
        hideReceipt,
    } = useSwapStore();

    // Trigger initial calculation on mount if input amount exists
    useEffect(() => {
        if (inputAmount && !outputAmount) {
            calculateBasedOnLastEdited();
        }
    }, []);

    useEffect(() => {
        if (inputAmount || outputAmount) {
            calculateBasedOnLastEdited();
        }
    }, [fromCurrency, toCurrency]);

    const inputUSDValue = useMemo(() => {
        if (!inputAmount || isNaN(parseFloat(inputAmount)) || parseFloat(inputAmount) <= 0) {
            return 0;
        }
        try {
            return fromCurrency === Currency.USD
                ? parseFloat(inputAmount)
                : convertCurrency(parseFloat(inputAmount), fromCurrency, Currency.USD, false);
        } catch {
            return 0;
        }
    }, [inputAmount, fromCurrency]);

    const outputUSDValue = useMemo(() => {
        if (!outputAmount || isNaN(parseFloat(outputAmount)) || parseFloat(outputAmount) <= 0) {
            return 0;
        }
        try {
            return toCurrency === Currency.USD
                ? parseFloat(outputAmount)
                : convertCurrency(parseFloat(outputAmount), toCurrency, Currency.USD, false);
        } catch {
            return 0;
        }
    }, [outputAmount, toCurrency]);

    // Share sheet state
    const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

    // Show receipt screen if conversion was successful
    if (showReceipt) {
        return (
            <ConversionReceipt
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                inputAmount={inputAmount}
                outputAmount={outputAmount}
                onBack={hideReceipt}
            />
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-2 sm:p-6">
            <div className="space-y-0 rounded-2xl border-2 border-gray-800 p-3 sm:p-4 bg-gray-900/30 transition-all duration-300">
                <CurrencyBox
                    type="input"
                    currency={fromCurrency}
                    amount={inputAmount}
                    onCurrencyChange={setFromCurrency}
                    onAmountChange={setInputAmount}
                    disabled={false}
                    isCalculating={isCalculating && lastEdited === "input"}
                    error={lastEdited === "input" ? error : null}
                />

                <div className="flex justify-center -my-3 relative z-10">
                    <SwapButton onClick={swapCurrencies} disabled={isCalculating} />
                </div>

                <CurrencyBox
                    type="output"
                    currency={toCurrency}
                    amount={outputAmount}
                    onCurrencyChange={setToCurrency}
                    onAmountChange={setOutputAmount}
                    disabled={false}
                    isCalculating={isCalculating && lastEdited === "output"}
                    error={lastEdited === "output" ? error : null}
                    inputUSDValue={inputUSDValue}
                    outputUSDValue={outputUSDValue}
                />

                <FeeDetails
                    fromCurrency={fromCurrency}
                    toCurrency={toCurrency}
                    inputAmount={inputAmount}
                    outputAmount={outputAmount}
                />

                {inputAmount && parseFloat(inputAmount) > 0 && outputAmount && (
                    <div className="mt-6 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleConvert}
                            disabled={isCalculating || !inputAmount || parseFloat(inputAmount) <= 0}
                            className="flex-1 py-4 px-6 rounded-xl bg-[#00ff88] hover:bg-[#00e677] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-semibold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                            {isCalculating ? "Calculating..." : "Convert"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsShareSheetOpen(true)}
                            disabled={isCalculating}
                            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 relative group"
                            aria-label="Share"
                            title="Share"
                        >
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-[#00ff88] transition-colors"
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
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-700">
                                Share
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                    <div className="w-2 h-2 bg-gray-800 border-r border-b border-gray-700 rotate-45"></div>
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Share Sheet */}
                <ShareSheet
                    isOpen={isShareSheetOpen}
                    onClose={() => setIsShareSheetOpen(false)}
                    fromCurrency={fromCurrency}
                    toCurrency={toCurrency}
                    inputAmount={inputAmount}
                    outputAmount={outputAmount}
                />
            </div>
        </div>
    );
}
