import { PPConfigService } from '@infrastructure/config';
import { EXCHANGE_RATE_CACHE_KEY } from '@common/constants/api.constants';
import { ExchangeRateRepository } from '../repositories/exchange-rate.respository';
import { ExchangeRateCache } from '@modules/exchange-rate/cache/exchange-rate.cache';
import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
    ExchangeRateDto,
    ExchangeRatePayload,
    ExchangeRateResponse,
    CurrencyConversionResult,
    PrismaExchangeRateSnapshotWithRates,
} from '../dtos/exchange-rate.dto';

@Injectable()
export class ExchangeRateService {
    private readonly logger = new Logger(ExchangeRateService.name);

    constructor(
        private readonly configService: PPConfigService,
        private readonly exchangeRateCache: ExchangeRateCache,
        private readonly exchangeRateRepository: ExchangeRateRepository,
    ) {}

    /**
     * Used on application startup and by the midnight cron job.
     * Clears cache and database, fetches fresh rates from the third-party API, persists, and caches.
     */
    async fetchAndPersistExchangeRates(): Promise<ExchangeRateDto> {
        try {
            const { defaultCurrency } = this.configService.exchangeRate;

            await this.deleteOutdatedExchangeRateSnapshots(defaultCurrency);
            return await this.refreshExchangeRates();
        } catch (error) {
            return this.handleFetchError(error);
        }
    }

    /**
     * Standard read path for API requests and currency conversion.
     * Resolves in order: cache → database → third-party API.
     */
    async getThirdPartyExchangeRates(): Promise<ExchangeRateDto> {
        try {
            return await this.resolveExchangeRates();
        } catch (error) {
            return this.handleFetchError(error);
        }
    }

    async performCurrencyConversion(
        amount: number,
        fromCurrency: string,
        toCurrency: string,
    ): Promise<CurrencyConversionResult> {
        const { defaultCurrency: BASE_CURRENCY } = this.configService.exchangeRate;
        const exchangeRateSnapshot = await this.getThirdPartyExchangeRates();

        const convertAmount = (value: number, sourceCurrency: string, targetCurrency: string) => {
            const sourceCurrencyRate = exchangeRateSnapshot.exchangeRates[sourceCurrency];
            const targetCurrencyRate = exchangeRateSnapshot.exchangeRates[targetCurrency];

            return (value * targetCurrencyRate) / sourceCurrencyRate;
        };

        const toBaseAmount = convertAmount(amount, fromCurrency, BASE_CURRENCY);
        const toTargetAmount = convertAmount(toBaseAmount, BASE_CURRENCY, toCurrency);

        return {
            base: {
                currency: BASE_CURRENCY,
                amount: exchangeRateSnapshot.exchangeRates[BASE_CURRENCY],
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

    // RESOLUTION STRATEGIES
    private async refreshExchangeRates(): Promise<ExchangeRateDto> {
        const { defaultCurrency } = this.configService.exchangeRate;

        await this.exchangeRateCache.invalidateCache(EXCHANGE_RATE_CACHE_KEY);
        await this.exchangeRateRepository.deleteAllExchangeRateSnapshots(defaultCurrency);

        const snapshot = await this.fetchFromThirdPartyAndPersist();
        await this.exchangeRateCache.setCache(EXCHANGE_RATE_CACHE_KEY, snapshot);

        return snapshot;
    }

    private async resolveExchangeRates(): Promise<ExchangeRateDto> {
        const cachedSnapshot = await this.exchangeRateCache.getCache(EXCHANGE_RATE_CACHE_KEY);
        if (cachedSnapshot) return cachedSnapshot;

        const { defaultCurrency } = this.configService.exchangeRate;
        const dbSnapshot = await this.fetchFromDatabase(defaultCurrency);

        if (dbSnapshot) {
            await this.exchangeRateCache.setCache(EXCHANGE_RATE_CACHE_KEY, dbSnapshot);
            return dbSnapshot;
        }

        const snapshot = await this.fetchFromThirdPartyAndPersist();
        await this.exchangeRateCache.setCache(EXCHANGE_RATE_CACHE_KEY, snapshot);

        return snapshot;
    }

    private async fetchFromThirdPartyAndPersist(): Promise<ExchangeRateDto> {
        const thirdPartyData = await this.fetchFromThirdPartyApi();
        return this.saveThirdPartyDataToDB(thirdPartyData);
    }

    // HELPER FUNCTIONS
    private async fetchFromDatabase(defaultCurrency: string): Promise<ExchangeRateDto | null> {
        const latestDBSnapshot = await this.exchangeRateRepository.getLatestExchangeRateSnapshot(defaultCurrency);

        if (!latestDBSnapshot) return null;

        return this.toExchangeRateDto(latestDBSnapshot);
    }

    private async fetchFromThirdPartyApi(): Promise<ExchangeRateResponse> {
        const { apiKey, apiUrl, defaultCurrency } = this.configService.exchangeRate;

        const finalUrl = `${apiUrl}/${apiKey}/latest/${defaultCurrency}`;

        const rawResponse = await fetch(finalUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!rawResponse.ok) {
            throw new Error(`Third-party exchange rate API responded with status ${rawResponse.status}`);
        }

        return rawResponse.json() as Promise<ExchangeRateResponse>;
    }

    private async saveThirdPartyDataToDB(thirdPartyData: ExchangeRateResponse): Promise<ExchangeRateDto> {
        const { base_code, conversion_rates, time_last_update_utc, time_next_update_utc } = thirdPartyData;

        const payload = {
            baseCurrency: base_code,
            exchangeRates: conversion_rates,
            nextUpdateTime: time_next_update_utc,
            lastUpdatedTime: time_last_update_utc,
        } satisfies ExchangeRatePayload;

        const savedSnapshot = await this.exchangeRateRepository.createExchangeRateSnapshot(payload);

        return this.toExchangeRateDto(savedSnapshot);
    }

    private async deleteOutdatedExchangeRateSnapshots(defaultCurrency: string) {
        await this.exchangeRateRepository.deleteOutdatedExchangeRateSnapshots(defaultCurrency);
    }

    private toExchangeRateDto(snapshot: PrismaExchangeRateSnapshotWithRates): ExchangeRateDto {
        const { id, baseCurrency, exchangeRates, nextUpdateTime, lastUpdatedTime, fetchedAt } = snapshot;

        const mappedExchangeRates = Object.fromEntries(
            exchangeRates.map(({ currency, rate }) => [currency, Number(rate)]),
        );

        return {
            id,
            baseCurrency,
            nextUpdateTime,
            lastUpdatedTime,
            fetchedAt: new Date(fetchedAt),
            exchangeRates: mappedExchangeRates,
        } satisfies ExchangeRateDto;
    }

    private handleFetchError(error: unknown): never {
        this.logger.error('Error fetching exchange rates', error);
        throw new InternalServerErrorException({
            name: 'EXCHANGE_RATE_FETCH_ERROR',
            title: 'Error fetching exchange rates',
            message: 'Error fetching exchange rates',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            details: 'There was an error fetching the exchange rates. Please try again later.',
        });
    }
}
