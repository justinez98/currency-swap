"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSwapStore } from "@/store/useSwapStore";
import { isValidCurrency } from "@/utils/currencies";

/**
 * URL State Management Hook
 * 
 * Syncs Zustand store with URL query parameters for:
 * - Shareable links
 * - Browser back/forward support
 * - State persistence on refresh
 * 
 * URL format: /?from=USD&to=EUR&amount=100
 */
export function useURLSync() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isInitialized = useRef(false);

    const {
        fromCurrency,
        toCurrency,
        inputAmount,
        setFromCurrency,
        setToCurrency,
        setInputAmount,
        calculateBasedOnLastEdited,
    } = useSwapStore();

    // Read URL params and initialize store on mount (only once)
    useEffect(() => {
        if (isInitialized.current) return;

        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const amount = searchParams.get("amount");

        // Only update if URL has valid params (prevents overwriting user input)
        if (from && isValidCurrency(from)) {
            setFromCurrency(from);
        }
        if (to && isValidCurrency(to)) {
            setToCurrency(to);
        }
        if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
            setInputAmount(amount, true); // Skip calculation, will be triggered by currency changes
        }

        // Trigger calculation after initial URL load
        // Use setTimeout to ensure state updates are applied first
        setTimeout(() => {
            const state = useSwapStore.getState();
            if (state.inputAmount) {
                state.calculateBasedOnLastEdited();
            }
        }, 0);

        isInitialized.current = true;
    }, [searchParams, setFromCurrency, setToCurrency, setInputAmount]);

    // Update URL when store changes (with debouncing to avoid too many updates)
    useEffect(() => {
        if (!isInitialized.current) return; // Don't update URL until initialized from URL

        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();

            if (fromCurrency) params.set("from", fromCurrency);
            if (toCurrency) params.set("to", toCurrency);
            if (inputAmount) params.set("amount", inputAmount);

            const newURL = `${pathname}?${params.toString()}`;
            const currentURL = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

            // Only update URL if it's different (prevents unnecessary navigation)
            if (newURL !== currentURL) {
                // Use replace to avoid adding to history on every keystroke
                router.replace(newURL, { scroll: false });
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [fromCurrency, toCurrency, inputAmount, pathname, router, searchParams]);

    // Handle browser back/forward
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const from = params.get("from");
            const to = params.get("to");
            const amount = params.get("amount");

            if (from && isValidCurrency(from)) {
                setFromCurrency(from);
            }
            if (to && isValidCurrency(to)) {
                setToCurrency(to);
            }
            if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
                setInputAmount(amount, true);
            }

            // Trigger calculation after setting values from URL
            // Use setTimeout to ensure state updates are applied first
            setTimeout(() => {
                calculateBasedOnLastEdited();
            }, 0);
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [setFromCurrency, setToCurrency, setInputAmount, calculateBasedOnLastEdited]);
}

/**
 * Get shareable link from current state
 * Can be called from anywhere (not a hook)
 */
export function getShareableLink(baseUrl: string = ""): string {
    if (typeof window === "undefined" && !baseUrl) return "";

    const { fromCurrency, toCurrency, inputAmount } = useSwapStore.getState();
    const params = new URLSearchParams();

    if (fromCurrency) params.set("from", fromCurrency);
    if (toCurrency) params.set("to", toCurrency);
    if (inputAmount) params.set("amount", inputAmount);

    const url = baseUrl || (typeof window !== "undefined" ? window.location.origin + window.location.pathname : "");
    return `${url}?${params.toString()}`;
}
