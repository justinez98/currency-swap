/**
 * Currency enum - All supported currencies
 */
export enum Currency {
    USD = "USD",
    HKD = "HKD",
    AUD = "AUD",
    MYR = "MYR",
    GBP = "GBP",
    EUR = "EUR",
    IDR = "IDR",
    NZD = "NZD",
    CNY = "CNY",
    CZK = "CZK",
    AED = "AED",
}

/**
 * Currency metadata for display
 */
export interface CurrencyInfo {
    code: Currency;
    name: string;
    symbol?: string;
}
