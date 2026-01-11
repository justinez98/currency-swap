/**
 * Validation utilities for currency swap amounts
 */

import { MIN_AMOUNT, MAX_AMOUNT, MAX_DECIMAL_PLACES } from "@/constants/validation";

export interface ValidationResult {
    isValid: boolean;
    error: string | null;
}

/**
 * Validate amount format (allows empty string, numbers, and decimals)
 */
export function validateAmountFormat(amount: string): ValidationResult {
    // Allow empty string
    if (amount === "") {
        return { isValid: true, error: null };
    }

    // Check for valid number format (digits, optional decimal point, optional digits)
    if (!/^\d*\.?\d*$/.test(amount)) {
        return {
            isValid: false,
            error: "Invalid format. Only numbers and decimals allowed.",
        };
    }

    // Check for multiple decimal points
    const decimalCount = (amount.match(/\./g) || []).length;
    if (decimalCount > 1) {
        return {
            isValid: false,
            error: "Invalid format. Only one decimal point allowed.",
        };
    }

    // Check decimal places
    const decimalPart = amount.split(".")[1];
    if (decimalPart && decimalPart.length > MAX_DECIMAL_PLACES) {
        return {
            isValid: false,
            error: `Maximum ${MAX_DECIMAL_PLACES} decimal places allowed.`,
        };
    }

    return { isValid: true, error: null };
}

/**
 * Validate amount value (numeric validation)
 */
export function validateAmountValue(amount: string): ValidationResult {
    // Allow empty string
    if (amount === "" || amount === "0" || amount === "0." || amount === "0.0") {
        return { isValid: true, error: null };
    }

    const numValue = parseFloat(amount);

    // Check if it's a valid number
    if (isNaN(numValue) || !isFinite(numValue)) {
        return {
            isValid: false,
            error: "Invalid number.",
        };
    }

    // Check minimum value
    if (numValue < MIN_AMOUNT) {
        return {
            isValid: false,
            error: `Minimum amount is ${MIN_AMOUNT.toFixed(2)}.`,
        };
    }

    // Check maximum value
    if (numValue > MAX_AMOUNT) {
        return {
            isValid: false,
            error: `Maximum amount is ${formatLargeNumber(MAX_AMOUNT)}.`,
        };
    }

    // Check for negative values
    if (numValue < 0) {
        return {
            isValid: false,
            error: "Amount cannot be negative.",
        };
    }

    return { isValid: true, error: null };
}

/**
 * Validate amount (format + value)
 */
export function validateAmount(amount: string): ValidationResult {
    // First validate format
    const formatResult = validateAmountFormat(amount);
    if (!formatResult.isValid) {
        return formatResult;
    }

    // Then validate value
    return validateAmountValue(amount);
}

/**
 * Format large numbers for display in error messages
 */
function formatLargeNumber(num: number): string {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toFixed(2);
}

/**
 * Sanitize amount input (remove invalid characters)
 */
export function sanitizeAmountInput(input: string): string {
    // Remove all characters except digits and decimal point
    let sanitized = input.replace(/[^\d.]/g, "");

    // Remove multiple decimal points (keep only first one)
    const parts = sanitized.split(".");
    if (parts.length > 2) {
        sanitized = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit decimal places
    if (sanitized.includes(".")) {
        const [integer, decimal] = sanitized.split(".");
        if (decimal && decimal.length > MAX_DECIMAL_PLACES) {
            sanitized = integer + "." + decimal.substring(0, MAX_DECIMAL_PLACES);
        }
    }

    return sanitized;
}
