import { Currency } from "@/types/currency";
import { CURRENCY_RATES } from "./currencies";

/**
 * Fee percentage (1% = 0.01)
 */
export const FEE_PERCENTAGE = 0.01;

/**
 * Convert an amount from one currency to another via USD
 * 
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param applyFee - Whether to apply the 1% fee (default: true)
 * @returns The converted amount
 */
export function convertCurrency(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    applyFee: boolean = true
): number {
    // Validate currencies
    if (!(fromCurrency in CURRENCY_RATES) || !(toCurrency in CURRENCY_RATES)) {
        throw new Error(`Invalid currency code: ${fromCurrency} or ${toCurrency}`);
    }

    // If same currency, return the amount
    if (fromCurrency === toCurrency) {
        return amount;
    }

    // Convert from source currency to USD
    // If fromCurrency is USD, rate is 1, so amount stays the same
    // Otherwise: amount / rate = USD equivalent
    const usdAmount = fromCurrency === Currency.USD
        ? amount
        : amount / CURRENCY_RATES[fromCurrency];

    // Convert from USD to target currency
    // If toCurrency is USD, rate is 1, so USD amount stays the same
    // Otherwise: USD amount * rate = target currency equivalent
    let convertedAmount = toCurrency === Currency.USD
        ? usdAmount
        : usdAmount * CURRENCY_RATES[toCurrency];

    // Step 3: Apply 1% fee (deducted from output amount)
    if (applyFee) {
        convertedAmount = convertedAmount * (1 - FEE_PERCENTAGE);
    }

    return convertedAmount;
}

/**
 * Reverse conversion: Calculate input amount from output amount
 * This is used when user edits the output amount
 * 
 * @param outputAmount - The desired output amount
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param applyFee - Whether the fee was applied (default: true)
 * @returns The required input amount
 */
export function reverseConvertCurrency(
    outputAmount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    applyFee: boolean = true
): number {
    // Validate currencies
    if (!(fromCurrency in CURRENCY_RATES) || !(toCurrency in CURRENCY_RATES)) {
        throw new Error(`Invalid currency code: ${fromCurrency} or ${toCurrency}`);
    }

    // If same currency, return the amount
    if (fromCurrency === toCurrency) {
        return outputAmount;
    }

    // Reverse the fee to get gross output
    // If fee was applied, outputAmount = grossAmount * (1 - fee)
    // grossAmount = outputAmount / (1 - fee)
    let grossOutputAmount = applyFee
        ? outputAmount / (1 - FEE_PERCENTAGE)
        : outputAmount;

    // Convert from target currency back to USD
    // If toCurrency is USD, grossOutputAmount is already in USD
    // Otherwise, grossOutputAmount / rate = USD equivalent
    const usdAmount = toCurrency === Currency.USD
        ? grossOutputAmount
        : grossOutputAmount / CURRENCY_RATES[toCurrency];

    // Convert from USD to source currency
    // If fromCurrency is USD, USD amount is the result
    // Otherwise: USD amount * rate = source currency equivalent
    const inputAmount = fromCurrency === Currency.USD
        ? usdAmount
        : usdAmount * CURRENCY_RATES[fromCurrency];

    return inputAmount;
}

/**
 * Get base exchange rate (without fee) between two currencies
 * This is the rate for 1 unit of fromCurrency to toCurrency
 *
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns The base exchange rate (1 fromCurrency = X toCurrency)
 */
export function getBaseExchangeRate(
    fromCurrency: Currency,
    toCurrency: Currency
): number {
    // Validate currencies
    if (!(fromCurrency in CURRENCY_RATES) || !(toCurrency in CURRENCY_RATES)) {
        throw new Error(`Invalid currency code: ${fromCurrency} or ${toCurrency}`);
    }

    // If same currency, rate is 1
    if (fromCurrency === toCurrency) {
        return 1;
    }

    // Use convertCurrency with amount=1 and applyFee=false
    // This handles all cases: USD->other, other->USD, other->other
    return convertCurrency(1, fromCurrency, toCurrency, false);
}

/**
 * Calculate the fee amount for a given output amount
 * 
 * @param outputAmount - The output amount (after fee)
 * @returns The fee amount
 */
export function calculateFee(outputAmount: number): number {
    // If outputAmount = grossAmount * (1 - fee)
    // Then: grossAmount = outputAmount / (1 - fee)
    // And: fee = grossAmount - outputAmount
    const grossAmount = outputAmount / (1 - FEE_PERCENTAGE);
    return grossAmount - outputAmount;
}

/**
 * Format a number for display with proper decimal places
 * Truncates (rounds down) instead of standard rounding
 * 
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 */
export function formatAmount(amount: number, decimals: number = 2): string {
    if (isNaN(amount) || !isFinite(amount) || amount === null || amount === undefined) {
        return "0.00";
    }

    // Truncate instead of round: multiply, floor, then divide
    const multiplier = Math.pow(10, decimals);
    const truncated = Math.floor(amount * multiplier) / multiplier;
    return truncated.toFixed(decimals);
}

/**
 * Format a number with thousand separators
 * Truncates (rounds down) instead of standard rounding
 * 
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with thousand separators
 */
export function formatAmountWithSeparators(
    amount: number,
    decimals: number = 2
): string {
    if (isNaN(amount) || !isFinite(amount) || amount === null || amount === undefined) {
        return "0.00";
    }

    // Truncate instead of round: multiply, floor, then divide
    const multiplier = Math.pow(10, decimals);
    const truncated = Math.floor(amount * multiplier) / multiplier;

    return truncated.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Format amount for input display (no thousand separators, preserves user input)
 * 
 * @param amount - The amount string to format
 * @returns Formatted string suitable for input fields
 */
export function formatAmountForInput(amount: string): string {
    if (!amount || amount === "") {
        return "";
    }

    // Remove any non-numeric characters except decimal point
    let cleaned = amount.replace(/[^\d.]/g, "");

    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    return cleaned;
}

/**
 * Format currency amount with currency symbol
 * 
 * @param amount - The amount to format
 * @param currencyCode - Currency code
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with currency symbol
 */
export function formatCurrency(
    amount: number,
    currencyCode: string,
    decimals: number = 2
): string {
    if (isNaN(amount) || !isFinite(amount)) {
        return `0.00 ${currencyCode}`;
    }

    const formatted = formatAmountWithSeparators(amount, decimals);
    return `${formatted} ${currencyCode}`;
}
