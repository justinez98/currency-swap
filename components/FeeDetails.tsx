"use client";

import { useState, memo, useMemo } from "react";
import { calculateFee, getBaseExchangeRate, formatAmountWithSeparators } from "@/utils/conversion";
import { Currency } from "@/types/currency";

interface FeeDetailsProps {
    fromCurrency: Currency;
    toCurrency: Currency;
    inputAmount: string;
    outputAmount: string;
}

export const FeeDetails = memo(function FeeDetails({
    fromCurrency,
    toCurrency,
    inputAmount,
    outputAmount,
}: FeeDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isRateReversed, setIsRateReversed] = useState(false);

    // Memoize all calculations
    const calculations = useMemo(() => {
        if (!inputAmount || parseFloat(inputAmount) <= 0 || !outputAmount) {
            return null;
        }

        const input = parseFloat(inputAmount);
        const output = parseFloat(outputAmount);
        const fee = calculateFee(output);
        const rateWithoutFee = getBaseExchangeRate(fromCurrency, toCurrency);
        const reverseRateWithoutFee = getBaseExchangeRate(toCurrency, fromCurrency);
        const rateWithFee = input > 0 ? output / input : 0;
        const reverseRateWithFee = output > 0 ? input / output : 0;

        return {
            input,
            output,
            fee,
            rateWithoutFee,
            reverseRateWithoutFee,
            rateWithFee,
            reverseRateWithFee,
        };
    }, [inputAmount, outputAmount, fromCurrency, toCurrency]);

    // Memoize display values based on rate reversal
    const displayValues = useMemo(() => {
        if (!calculations) return null;

        return {
            rate: isRateReversed ? calculations.reverseRateWithoutFee : calculations.rateWithoutFee,
            from: isRateReversed ? toCurrency : fromCurrency,
            to: isRateReversed ? fromCurrency : toCurrency,
        };
    }, [calculations, isRateReversed, fromCurrency, toCurrency]);

    if (!calculations || !displayValues) {
        return null;
    }

    const { input, output, fee, rateWithoutFee, reverseRateWithoutFee, rateWithFee } = calculations;
    const { rate: displayRate, from: displayFrom, to: displayTo } = displayValues;

    const handleRateToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsRateReversed(!isRateReversed);
    };

    const handleContainerClick = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="mt-4 bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <div 
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={handleContainerClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleContainerClick();
                    }
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
                <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-gray-400">Rate</span>
                    <button
                        type="button"
                        onClick={handleRateToggle}
                        className="text-sm font-medium text-white hover:text-[#00ff88] transition-colors cursor-pointer flex items-center gap-1"
                    >
                        1 {displayFrom} ≈ {formatAmountWithSeparators(displayRate, 6)} {displayTo}
                        <svg
                            className="w-3 h-3 text-gray-500 hover:text-[#00ff88] transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Platform Fee</span>
                        <span className="font-medium text-[#00ff88]">1.00%</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Fee Amount</span>
                        <span className="font-medium text-white">
                            {formatAmountWithSeparators(fee, 2)} {toCurrency}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-800">
                        <span className="text-gray-400">You'll receive</span>
                        <span className="font-semibold text-[#00ff88]">
                            {formatAmountWithSeparators(output, 2)} {toCurrency}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-gray-800">
                        <div className="text-xs text-gray-500 space-y-1">
                            <div className="flex justify-between">
                                <span>Input:</span>
                                <span className="text-gray-400">
                                    {formatAmountWithSeparators(input, 2)} {fromCurrency}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Base Rate:</span>
                                <span className="text-gray-400">
                                    1 {fromCurrency} = {formatAmountWithSeparators(rateWithoutFee, 6)} {toCurrency}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>After Fee:</span>
                                <span className="text-gray-400">
                                    {formatAmountWithSeparators(output, 2)} {toCurrency}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
