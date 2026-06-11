import { ApiServiceError } from './api-error.service';
import { ExchangeRatesResource } from '@methods/resources';
import { effect, inject, Injectable, signal } from '@angular/core';
import {
    IStandardError,
    ExchangeRatesSnapshot,
    CurrencyConversionResult,
    EXCHANGE_RATE_BASE_CURRENCY,
} from '@global/types';

@Injectable({
    providedIn: 'root',
})
export class ExchangeRateService {
    private readonly errorService = inject(ApiServiceError);
    private readonly exchangeRatesResource = inject(ExchangeRatesResource);

    private readonly _exchangeRateSnapshot = signal<ExchangeRatesSnapshot | null>(null);

    readonly exchangeRateSnapshot = this._exchangeRateSnapshot.asReadonly();

    constructor() {
        effect(() => {
            const response = this.exchangeRatesResource.getExchangeRatesSnapshot.value();

            if (response?.data) {
                this._exchangeRateSnapshot.set(response.data);
            }
        });

        effect(() => {
            const error = this.exchangeRatesResource.getExchangeRatesSnapshot.error() as
                | IStandardError
                | undefined;

            if (!error) return;

            this._exchangeRateSnapshot.set(null);
            this.errorService.renderToast(error);
        });
    }

    performCurrencyConversion(
        amount: number,
        fromCurrency: string,
        toCurrency: string,
    ): CurrencyConversionResult | null {
        const snapshot = this._exchangeRateSnapshot();

        if (!snapshot) return null;

        const convertAmount = (
            value: number,
            sourceCurrency: string,
            targetCurrency: string,
        ): number | null => {
            const sourceCurrencyRate = snapshot.exchangeRates[sourceCurrency];
            const targetCurrencyRate = snapshot.exchangeRates[targetCurrency];

            if (sourceCurrencyRate == null || targetCurrencyRate == null) return null;

            return (value * targetCurrencyRate) / sourceCurrencyRate;
        };

        const toBaseAmount = convertAmount(amount, fromCurrency, EXCHANGE_RATE_BASE_CURRENCY);
        if (toBaseAmount == null) return null;

        const toTargetAmount = convertAmount(toBaseAmount, EXCHANGE_RATE_BASE_CURRENCY, toCurrency);
        if (toTargetAmount == null) return null;

        const baseCurrencyRate = snapshot.exchangeRates[EXCHANGE_RATE_BASE_CURRENCY];
        if (baseCurrencyRate == null) return null;

        return {
            base: {
                currency: EXCHANGE_RATE_BASE_CURRENCY,
                amount: baseCurrencyRate,
            },
            source: {
                currency: fromCurrency,
                amount,
            },
            target: {
                currency: toCurrency,
                amount: toTargetAmount,
            },
        };
    }
}
