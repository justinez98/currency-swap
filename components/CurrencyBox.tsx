"use client";

import { useState, memo, useMemo } from "react";
import { CurrencySelector } from "./CurrencySelector";
import { Currency } from "@/types/currency";
import { CURRENCY_INFO } from "@/utils/currencies";
import { convertCurrency } from "@/utils/conversion";
import { formatAmountWithSeparators } from "@/utils/conversion";

interface CurrencyBoxProps {
    type: "input" | "output";
    currency: Currency;
    amount: string;
    onCurrencyChange: (currency: Currency) => void;
    onAmountChange: (amount: string) => void;
    disabled?: boolean;
    isCalculating?: boolean;
    error?: string | null;
    inputUSDValue?: number; // USD value of input amount
    outputUSDValue?: number; // USD value of output amount
}

export const CurrencyBox = memo(function CurrencyBox({
    type,
    currency,
    amount,
    onCurrencyChange,
    onAmountChange,
    disabled = false,
    isCalculating = false,
    error = null,
    inputUSDValue,
    outputUSDValue,
}: CurrencyBoxProps) {
    const currencyInfo = CURRENCY_INFO[currency];
    const isInput = type === "input";
    const isOutput = type === "output";

    // Calculate USD equivalent (memoized)
    const usdEquivalent = useMemo((): string | null => {
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return null;
        }
        try {
            const numAmount = parseFloat(amount);
            const usdValue = currency === Currency.USD
                ? numAmount
                : convertCurrency(numAmount, currency, Currency.USD, false);
            return `$${formatAmountWithSeparators(usdValue, 2)}`;
        } catch {
            return null;
        }
    }, [amount, currency]);

    // Calculate percentage difference for output (memoized)
    const percentageDiff = useMemo((): { value: number; display: string; } | null => {
        if (!isOutput || !inputUSDValue || !outputUSDValue || inputUSDValue === 0) {
            return null;
        }

        const difference = outputUSDValue - inputUSDValue;
        const percentage = (difference / inputUSDValue) * 100;

        return {
            value: difference,
            display: `${difference >= 0 ? "+" : ""}${formatAmountWithSeparators(difference, 2)} (${percentage >= 0 ? "+" : ""}${formatAmountWithSeparators(percentage, 2)}%)`,
        };
    }, [isOutput, inputUSDValue, outputUSDValue]);

    const [showTooltip, setShowTooltip] = useState(false);

    // Calculate dynamic font size based on number length
    const getFontSize = (value: string): string => {
        if (!value || value.length === 0) return '2.5rem';

        const length = value.length;
        if (length <= 8) return '2.5rem';
        if (length <= 12) return '2rem';
        if (length <= 16) return '1.5rem';
        return '1.25rem';
    };

    return (
        <div
            className={`
                relative p-4 rounded-xl border transition-all duration-200
                ${error
                    ? "border-red-500/50 bg-red-950/20"
                    : disabled && !isCalculating
                    ? "border-gray-700/50 bg-gray-900/30"
                    : "border-gray-800 bg-gray-900/50"
                }
                ${disabled && !isCalculating ? "" : "hover:border-gray-700"}
                ${disabled && !isCalculating ? "" : "focus-within:border-[#00ff88]/50"}
            `}
        >
            {/* Label */}
            <div className="flex items-center justify-between mb-4">
                <label
                    htmlFor={`${type}-amount`}
                    className="text-sm font-medium text-gray-400"
                >
                    {isInput ? "Sell" : "Buy"}
                </label>
                {isCalculating && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg
                            className="animate-spin h-4 w-4 text-[#00ff88]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-gray-400">Calculating...</span>
                    </div>
                )}
            </div>

            {/* Amount Input/Display */}
            <div className="flex items-start gap-4">
                {/* Currency Selector - Left Side */}
                <div className="flex-shrink-0">
                    <CurrencySelector
                        selectedCurrency={currency}
                        onSelect={onCurrencyChange}
                        disabled={disabled || isCalculating}
                    />
                </div>

                {/* Amount Input - Right Side */}
                <div className="flex-1 text-right min-w-0">
                    <div className="relative w-full overflow-x-auto scrollbar-hide">
                        <input
                            id={`${type}-amount`}
                            type="text"
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => onAmountChange(e.target.value)}
                            disabled={disabled || isCalculating}
                            placeholder="0.00"
                            style={{
                                fontSize: getFontSize(amount),
                                transition: 'font-size 0.2s ease-in-out',
                            }}
                            className={`
                                w-full font-bold bg-transparent
                                text-right
                                placeholder-gray-600
                                focus:outline-none
                                whitespace-nowrap
                                ${disabled 
                                    ? "cursor-not-allowed text-gray-500 opacity-70" 
                                    : error 
                                    ? "text-red-400" 
                                    : "text-white"
                                }
                                transition-colors duration-200
                            `}
                        />
                    </div>
                    {/* USD Equivalent */}
                    {usdEquivalent && (
                        <div className="mt-1 relative w-full min-w-0">
                            <div
                                className={`text-sm text-right flex flex-wrap justify-end gap-x-2 ${isOutput && percentageDiff ? "cursor-help" : ""
                                    } ${disabled ? "text-gray-500 opacity-60" : "text-gray-500"} transition-colors duration-200`}
                                onMouseEnter={() => isOutput && percentageDiff && !disabled && setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                <span>{usdEquivalent}</span>
                                {isOutput && percentageDiff && (
                                    <span
                                        className={`${disabled ? "text-gray-500 opacity-60" : "text-gray-400"} ${showTooltip
                                            ? "underline decoration-dotted underline-offset-2"
                                            : ""
                                            } transition-colors duration-200`}
                                    >
                                        ({((percentageDiff.value / (inputUSDValue || 1)) * 100) >= 0 ? "+" : ""}
                                        {formatAmountWithSeparators(
                                            ((percentageDiff.value / (inputUSDValue || 1)) * 100),
                                            2
                                        )}%)
                                    </span>
                                )}
                            </div>
                            {/* Tooltip */}
                            {showTooltip && percentageDiff && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-xs text-gray-300 max-w-xs z-50">
                                    <div className="text-center">
                                        Estimated difference between the input USD amount and the output USD amount.
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                        <div className="w-2 h-2 bg-gray-800 border-r border-b border-gray-700 rotate-45"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {error && (
                        <div className="mt-2 flex items-start gap-2 justify-end">
                            <svg
                                className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm text-red-400 flex-1 text-right">
                                {error}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className={`mt-2 text-sm transition-colors duration-200 ${disabled ? "text-gray-500 opacity-60" : "text-gray-500"}`}>
                {currencyInfo.name}
            </div>
        </div>
    );
});
