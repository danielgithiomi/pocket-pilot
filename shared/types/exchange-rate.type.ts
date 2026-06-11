export const EXCHANGE_RATE_BASE_CURRENCY = 'USD' as const;

export interface ExchangeRatesSnapshot {
    id: string;
    fetchedAt: Date;
    baseCurrency: string;
    nextUpdateTime: Date;
    lastUpdatedTime: Date;
    exchangeRates: Record<string, number>;
}

export interface CurrencyConversionResult {
    source: {
        amount: number;
        currency: string;
    };
    target: {
        amount: number;
        currency: string;
    };
    base: {
        amount: number;
        currency: string;
    };
}