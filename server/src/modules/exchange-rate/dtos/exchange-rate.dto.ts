export interface ExchangeRateResponse {
    result: string;
    base_code: string;
    terms_of_use: string;
    documentation: string;
    time_last_update_unix: number;
    time_last_update_utc: string;
    time_next_update_unix: number;
    time_next_update_utc: string;
    conversionRates: Record<string, number>;
}

export interface ExchangeRatePayload {
    baseCurrency: string;
    nextUpdateTime: string;
    lastUpdateTime: string;
    exchangeRates: Record<string, number>;
}
