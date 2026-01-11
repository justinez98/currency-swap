import { Currency } from "@/types/currency";
import { CURRENCY_RATES, CURRENCY_INFO } from "../constants/currencyConstants";

// Re-export constants for backward compatibility
export { CURRENCY_RATES, CURRENCY_INFO };

/**
 * Get all available currency codes
 */
export function getCurrencyCodes(): Currency[] {
    return Object.values(Currency);
}

/**
 * Check if a currency code is valid
 */
export function isValidCurrency(code: string): code is Currency {
    return Object.values(Currency).includes(code as Currency);
}

/**
 * Convert string to Currency enum (for URL params, etc.)
 */
export function toCurrency(code: string): Currency | null {
    return isValidCurrency(code) ? (code as Currency) : null;
}

/**
 * Get all available currency codes (string-based version for lib compatibility)
 */
export function getCurrencyCodesString(): string[] {
    return Object.keys(CURRENCY_RATES);
}

/**
 * Check if a currency code is valid (string-based version for lib compatibility)
 */
export function isValidCurrencyString(code: string): boolean {
    return code in CURRENCY_RATES;
}
