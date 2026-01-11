import { Currency, CurrencyInfo } from "@/types/currency";

/**
 * Currency rates based on USD (1 USD = rate)
 * All conversions go through USD as the base currency
 */
export const CURRENCY_RATES: Record<Currency, number> = {
    [Currency.USD]: 1.0,
    [Currency.HKD]: 7.798926,
    [Currency.AUD]: 1.487089,
    [Currency.MYR]: 4.375,
    [Currency.GBP]: 0.761538,
    [Currency.EUR]: 0.899038,
    [Currency.IDR]: 15538.905259,
    [Currency.NZD]: 1.625053,
    [Currency.CNY]: 7.1369,
    [Currency.CZK]: 22.549,
    [Currency.AED]: 3.672815,
};

export const CURRENCY_INFO: Record<Currency, CurrencyInfo> = {
    [Currency.USD]: { code: Currency.USD, name: "US Dollar", symbol: "$" },
    [Currency.HKD]: { code: Currency.HKD, name: "Hong Kong Dollar", symbol: "HK$" },
    [Currency.AUD]: { code: Currency.AUD, name: "Australian Dollar", symbol: "A$" },
    [Currency.MYR]: { code: Currency.MYR, name: "Malaysian Ringgit", symbol: "RM" },
    [Currency.GBP]: { code: Currency.GBP, name: "British Pound", symbol: "£" },
    [Currency.EUR]: { code: Currency.EUR, name: "Euro", symbol: "€" },
    [Currency.IDR]: { code: Currency.IDR, name: "Indonesian Rupiah", symbol: "Rp" },
    [Currency.NZD]: { code: Currency.NZD, name: "New Zealand Dollar", symbol: "NZ$" },
    [Currency.CNY]: { code: Currency.CNY, name: "Chinese Yuan", symbol: "¥" },
    [Currency.CZK]: { code: Currency.CZK, name: "Czech Koruna", symbol: "Kč" },
    [Currency.AED]: { code: Currency.AED, name: "UAE Dirham", symbol: "د.إ" },
};
