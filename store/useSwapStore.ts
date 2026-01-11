import { create } from "zustand";
import { convertCurrency, reverseConvertCurrency, formatAmount } from "@/utils/conversion";
import { Currency } from "@/types/currency";
import { isValidCurrency, toCurrency } from "@/utils/currencies";
import { validateAmount, sanitizeAmountInput, validateAmountValue } from "@/utils/validation";

export type LastEdited = "input" | "output";

// Debounce delay in milliseconds
const CALCULATION_DEBOUNCE_MS = 300;

export interface SwapState {
    // Core state
    fromCurrency: Currency;
    toCurrency: Currency;
    inputAmount: string;
    outputAmount: string;

    // UI state
    lastEdited: LastEdited;
    isCalculating: boolean;
    error: string | null;
    calculationTimeout: NodeJS.Timeout | null;
    showReceipt: boolean;

    // Actions
    setFromCurrency: (currency: Currency | string) => void;
    setToCurrency: (currency: Currency | string) => void;
    setInputAmount: (amount: string, skipCalculation?: boolean) => void;
    setOutputAmount: (amount: string, skipCalculation?: boolean) => void;
    swapCurrencies: () => void;
    calculateOutput: () => void;
    calculateInput: () => void;
    calculateBasedOnLastEdited: () => void;
    setError: (error: string | null) => void;
    handleConvert: () => void;
    hideReceipt: () => void;
    reset: () => void;
}

// Default values
const DEFAULT_FROM = Currency.USD;
const DEFAULT_TO = Currency.EUR;
const DEFAULT_AMOUNT = ""; // Start with empty amount

const initialState = {
    fromCurrency: DEFAULT_FROM,
    toCurrency: DEFAULT_TO,
    inputAmount: DEFAULT_AMOUNT,
    outputAmount: "",
    lastEdited: "input" as LastEdited,
    isCalculating: false,
    error: null,
    calculationTimeout: null,
    showReceipt: false,
};

export const useSwapStore = create<SwapState>((set, get) => ({
    ...initialState,

    setFromCurrency: (currency: Currency | string) => {
        const currencyEnum = typeof currency === "string" ? toCurrency(currency) : currency;
        if (!currencyEnum || !isValidCurrency(currencyEnum)) {
            set({ error: `Invalid currency: ${currency}` });
            return;
        }

        const state = get();

        // If selecting the same currency as the output, swap instead
        if (currencyEnum === state.toCurrency) {
            state.swapCurrencies();
            return;
        }

        // Clear any pending calculations
        if (state.calculationTimeout) {
            clearTimeout(state.calculationTimeout);
            set({ calculationTimeout: null });
        }

        // When changing input currency, keep input amount and recalculate output
        // Update lastEdited to "input" to ensure calculateOutput() works correctly
        set({ fromCurrency: currencyEnum, error: null, lastEdited: "input" });
        if (state.inputAmount) {
            const updatedState = get();
            updatedState.calculateOutput();
        }
    },

    setToCurrency: (currency: Currency | string) => {
        const currencyEnum = typeof currency === "string" ? toCurrency(currency) : currency;
        if (!currencyEnum || !isValidCurrency(currencyEnum)) {
            set({ error: `Invalid currency: ${currency}` });
            return;
        }

        const state = get();

        // If selecting the same currency as the input, swap instead
        if (currencyEnum === state.fromCurrency) {
            state.swapCurrencies();
            return;
        }

        // Clear any pending calculations
        if (state.calculationTimeout) {
            clearTimeout(state.calculationTimeout);
            set({ calculationTimeout: null });
        }

        // When changing output currency, keep output amount and recalculate input
        // Update lastEdited to "output" to ensure calculateInput() works correctly
        if (state.outputAmount) {
            set({ toCurrency: currencyEnum, error: null, lastEdited: "output" });
            const updatedState = get();
            updatedState.calculateInput();
        } else if (state.inputAmount) {
            // If no output amount, calculate from input
            set({ toCurrency: currencyEnum, error: null, lastEdited: "input" });
            const updatedState = get();
            updatedState.calculateOutput();
        } else {
            set({ toCurrency: currencyEnum, error: null });
        }
    },

    setInputAmount: (amount: string, skipCalculation = false) => {
        // Sanitize input first
        const sanitized = sanitizeAmountInput(amount);

        // Validate amount
        const validation = validateAmount(sanitized);
        if (!validation.isValid) {
            set({
                error: validation.error,
                lastEdited: "input",
            });
            return; // Don't update if invalid
        }

        const state = get();
        // Clear any pending calculations
        if (state.calculationTimeout) {
            clearTimeout(state.calculationTimeout);
            set({ calculationTimeout: null });
        }

        set({
            inputAmount: sanitized,
            lastEdited: "input",
            error: null,
        });

        if (!skipCalculation && sanitized) {
            // Validate value before calculation
            const valueValidation = validateAmountValue(sanitized);
            if (!valueValidation.isValid) {
                set({ error: valueValidation.error });
                return;
            }

            // Debounce calculation to prevent race conditions
            const timeout = setTimeout(() => {
                const currentState = get();
                // Only calculate if input is still the last edited field
                if (currentState.lastEdited === "input") {
                    // Clear timeout before calculating
                    set({ calculationTimeout: null });
                    currentState.calculateOutput();
                }
            }, CALCULATION_DEBOUNCE_MS);

            set({ calculationTimeout: timeout });
        } else if (!sanitized) {
            set({ outputAmount: "" });
        }
    },

    setOutputAmount: (amount: string, skipCalculation = false) => {
        // Sanitize input first
        const sanitized = sanitizeAmountInput(amount);

        // Validate amount
        const validation = validateAmount(sanitized);
        if (!validation.isValid) {
            set({
                error: validation.error,
                lastEdited: "output",
            });
            return; // Don't update if invalid
        }

        const state = get();
        // Clear any pending calculations
        if (state.calculationTimeout) {
            clearTimeout(state.calculationTimeout);
            set({ calculationTimeout: null });
        }

        set({
            outputAmount: sanitized,
            lastEdited: "output",
            error: null,
        });

        if (!skipCalculation && sanitized) {
            // Validate value before calculation
            const valueValidation = validateAmountValue(sanitized);
            if (!valueValidation.isValid) {
                set({ error: valueValidation.error });
                return;
            }

            // Debounce calculation to prevent race conditions
            const timeout = setTimeout(() => {
                const currentState = get();
                // Only calculate if output is still the last edited field
                if (currentState.lastEdited === "output") {
                    // Clear timeout before calculating
                    set({ calculationTimeout: null });
                    currentState.calculateInput();
                }
            }, CALCULATION_DEBOUNCE_MS);

            set({ calculationTimeout: timeout });
        } else if (!sanitized) {
            set({ inputAmount: "" });
        }
    },

    calculateOutput: () => {
        const { inputAmount, fromCurrency, toCurrency, lastEdited } = get();

        // Race condition check: only calculate if input was last edited
        if (lastEdited !== "input") {
            return;
        }

        if (!inputAmount || inputAmount.trim() === "") {
            set({ outputAmount: "", isCalculating: false, error: null });
            return;
        }

        // Validate amount value
        const valueValidation = validateAmountValue(inputAmount);
        if (!valueValidation.isValid) {
            set({
                error: valueValidation.error,
                isCalculating: false,
                outputAmount: "",
            });
            return;
        }

        const amount = parseFloat(inputAmount);
        if (isNaN(amount) || amount <= 0) {
            set({ outputAmount: "", isCalculating: false, error: null });
            return;
        }

        try {
            set({ isCalculating: true, error: null });

            // convertCurrency already handles same currency case and applies fee
            const converted = convertCurrency(amount, fromCurrency, toCurrency);
            const formatted = formatAmount(converted);

            // Double-check lastEdited hasn't changed during calculation
            const currentState = get();
            if (currentState.lastEdited === "input") {
                set({
                    outputAmount: formatted,
                    isCalculating: false,
                    error: null,
                    calculationTimeout: null, // Clear timeout when calculation completes
                });
            } else {
                // State changed during calculation, reset isCalculating
                set({ 
                    isCalculating: false,
                    calculationTimeout: null, // Clear timeout when calculation completes
                });
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Conversion error. Please try again.",
                isCalculating: false,
                outputAmount: "",
                calculationTimeout: null, // Clear timeout on error
            });
        }
    },

    calculateInput: () => {
        const { outputAmount, fromCurrency, toCurrency, lastEdited } = get();

        // Race condition check: only calculate if output was last edited
        if (lastEdited !== "output") {
            return;
        }

        if (!outputAmount || outputAmount.trim() === "") {
            set({ inputAmount: "", isCalculating: false, error: null });
            return;
        }

        // Validate amount value
        const valueValidation = validateAmountValue(outputAmount);
        if (!valueValidation.isValid) {
            set({
                error: valueValidation.error,
                isCalculating: false,
                inputAmount: "",
            });
            return;
        }

        const amount = parseFloat(outputAmount);
        if (isNaN(amount) || amount <= 0) {
            set({ inputAmount: "", isCalculating: false, error: null });
            return;
        }

        try {
            set({ isCalculating: true, error: null });

            // reverseConvertCurrency already handles same currency case and reverses fee
            const input = reverseConvertCurrency(amount, fromCurrency, toCurrency);
            const formatted = formatAmount(input);

            // Double-check lastEdited hasn't changed during calculation
            const currentState = get();
            if (currentState.lastEdited === "output") {
                set({
                    inputAmount: formatted,
                    isCalculating: false,
                    error: null,
                    calculationTimeout: null, // Clear timeout when calculation completes
                });
            } else {
                // State changed during calculation, reset isCalculating
                set({ 
                    isCalculating: false,
                    calculationTimeout: null, // Clear timeout when calculation completes
                });
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Conversion error. Please try again.",
                isCalculating: false,
                inputAmount: "",
                calculationTimeout: null, // Clear timeout on error
            });
        }
    },

    calculateBasedOnLastEdited: () => {
        const state = get();
        const { lastEdited, calculationTimeout } = state;

        // Clear any pending calculations
        if (calculationTimeout) {
            clearTimeout(calculationTimeout);
            set({ calculationTimeout: null });
        }

        // Calculate based on which field was last edited
        if (lastEdited === "input") {
            state.calculateOutput();
        } else {
            state.calculateInput();
        }
    },

    swapCurrencies: () => {
        const state = get();
        const { fromCurrency, toCurrency, inputAmount, calculationTimeout } = state;

        // Clear any pending calculations
        if (calculationTimeout) {
            clearTimeout(calculationTimeout);
        }

        // Swap only currencies, keep input amount and recalculate output
        set({
            fromCurrency: toCurrency,
            toCurrency: fromCurrency,
            lastEdited: "input", // Keep input as the source of truth
            calculationTimeout: null,
        });

        // Recalculate output based on the swapped currencies and existing input amount
        requestAnimationFrame(() => {
            const currentState = get();
            if (currentState.inputAmount) {
                currentState.calculateOutput();
            } else {
                // If no input amount, clear output
                set({ outputAmount: "" });
            }
        });
    },

    setError: (error: string | null) => {
        set({ error });
    },

    handleConvert: () => {
        const { inputAmount, outputAmount } = get();
        // Only show receipt if we have valid amounts
        if (inputAmount && parseFloat(inputAmount) > 0 && outputAmount && parseFloat(outputAmount) > 0) {
            set({ showReceipt: true });
        }
    },

    hideReceipt: () => {
        set({ showReceipt: false });
    },

    reset: () => {
        const state = get();
        // Clear any pending calculations to prevent memory leaks
        if (state.calculationTimeout) {
            clearTimeout(state.calculationTimeout);
        }
        set(initialState);
    },
}));
