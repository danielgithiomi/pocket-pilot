import { PPConfigService } from '@infrastructure/config';
import { EXCHANGE_RATE_CACHE_KEY } from '@common/constants/api.constants';
import { ExchangeRateRepository } from '../repositories/exchange-rate.respository';
import { ExchangeRateCache } from '@modules/exchange-rate/cache/exchange-rate.cache';
import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
    CurrencyConversionResult,
    ExchangeRateDto,
    ExchangeRatePayload,
    ExchangeRateResponse,
    PrismaExchangeRateSnapshotWithRates
} from '../dtos/exchange-rate.dto';

@Injectable()
export class ExchangeRateService {
    private readonly logger = new Logger(ExchangeRateService.name);

    constructor(
        private readonly configService: PPConfigService,
        private readonly exchangeRateCache: ExchangeRateCache,
        private readonly exchangeRateRepository: ExchangeRateRepository
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

    /**
     * Converts a given amount from one currency to another using exchange rates.
     * Fetches the latest exchange rates and performs conversion calculations based on the configured base currency.
     *
     * @param {number} amount - The amount to be converted.
     * @param {string} fromCurrency - The currency code of the source currency.
     * @param {string} toCurrency - The currency code of the target currency.
     * @return {Promise<CurrencyConversionResult>} A promise that resolves to an object containing the conversion result, including the base currency, source currency, and target currency details.
     */
    async performCurrencyConversion(amount: number, fromCurrency: string, toCurrency: string): Promise<CurrencyConversionResult> {
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
                amount: exchangeRateSnapshot.exchangeRates[BASE_CURRENCY]
            },
            source: {
                currency: fromCurrency,
                amount
            },
            target: {
                currency: toCurrency,
                amount: toTargetAmount
            }
        };
    }

    /**
     * Used by the cron job to refresh exchange rates.
     * Clears cache, deletes all snapshots, fetches fresh rates from the third-party API, persists, and caches.
     * @return An ExchangeRateDto object representing the latest exchange rates.
     */
    private async refreshExchangeRates(): Promise<ExchangeRateDto> {
        const { defaultCurrency } = this.configService.exchangeRate;

        await this.exchangeRateCache.invalidateCache(EXCHANGE_RATE_CACHE_KEY);
        await this.exchangeRateRepository.deleteAllExchangeRateSnapshots(defaultCurrency);

        const snapshot = await this.fetchFromThirdPartyAndPersist();
        await this.exchangeRateCache.setCache(EXCHANGE_RATE_CACHE_KEY, snapshot);

        return snapshot;
    }

    /**
     * Resolves and retrieves the current exchange rates.
     *
     * This method first attempts to get the exchange rates from a cached source.
     * If the cache is unavailable, it attempts to fetch the rates from the database.
     * If neither the cache nor database provides data, it fetches the rates from
     * a third-party service and persists the result for future use.
     *
     * @return {Promise<ExchangeRateDto>} A promise that resolves to the exchange rate data transfer object (ExchangeRateDto).
     */
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

    /**
     * Fetches exchange rate data from a third-party API and persists it into the database.
     *
     * @return {Promise<ExchangeRateDto>} A promise that resolves to the persisted exchange rate data.
     */
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

    /**
     * Fetches the latest exchange rate data from a third-party API.
     *
     * This method retrieves currency exchange rate information based on the default currency
     * specified in the configuration. The API key and URL are also sourced from the configuration.
     * If the API responds with a non-OK status, an error is thrown.
     *
     * @return {Promise<ExchangeRateResponse>} A promise resolving to the exchange rate data received from the API.
     * @throws {Error} If the API response status is not OK.
     */
    private async fetchFromThirdPartyApi(): Promise<ExchangeRateResponse> {
        const { apiKey, apiUrl, defaultCurrency } = this.configService.exchangeRate;

        const finalUrl = `${apiUrl}/${apiKey}/latest/${defaultCurrency}`;

        const rawResponse = await fetch(finalUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!rawResponse.ok) {
            throw new Error(`Third-party exchange rate API responded with status ${rawResponse.status}`);
        }

        return (await rawResponse.json()) as Promise<ExchangeRateResponse>;
    }

    /**
     * Saves third-party exchange rate data to the database.
     *
     * @param {ExchangeRateResponse} thirdPartyData The data received from a third-party service, including exchange rates and related metadata.
     * @return {Promise<ExchangeRateDto>} A promise that resolves to an ExchangeRateDto object after the data is successfully saved and transformed.
     */
    private async saveThirdPartyDataToDB(thirdPartyData: ExchangeRateResponse): Promise<ExchangeRateDto> {
        const { base_code, conversion_rates, time_last_update_utc, time_next_update_utc } = thirdPartyData;

        const payload = {
            baseCurrency: base_code,
            exchangeRates: conversion_rates,
            nextUpdateTime: time_next_update_utc,
            lastUpdatedTime: time_last_update_utc
        } satisfies ExchangeRatePayload;

        const savedSnapshot = await this.exchangeRateRepository.createExchangeRateSnapshot(payload);

        return this.toExchangeRateDto(savedSnapshot);
    }

    /**
     * Deletes outdated exchange rate snapshots for the specified default currency.
     *
     * @param {string} defaultCurrency - The default currency for which outdated exchange rate snapshots should be deleted.
     * @return {Promise<void>} A promise that resolves when the deletion is complete.
     */
    private async deleteOutdatedExchangeRateSnapshots(defaultCurrency: string): Promise<void> {
        await this.exchangeRateRepository.deleteOutdatedExchangeRateSnapshots(defaultCurrency);
    }

    /**
     * Transforms a PrismaExchangeRateSnapshotWithRates object into an ExchangeRateDto.
     *
     * @param {PrismaExchangeRateSnapshotWithRates} snapshot - The exchange rate snapshot containing detailed rate information.
     * @return {ExchangeRateDto} The transformed exchange rate data transfer object.
     */
    private toExchangeRateDto(snapshot: PrismaExchangeRateSnapshotWithRates): ExchangeRateDto {
        const { id, baseCurrency, exchangeRates, nextUpdateTime, lastUpdatedTime, fetchedAt } = snapshot;

        const mappedExchangeRates = Object.fromEntries(exchangeRates.map(({ currency, rate }) => [currency, Number(rate)]));

        return {
            id,
            baseCurrency,
            nextUpdateTime,
            lastUpdatedTime,
            fetchedAt: new Date(fetchedAt),
            exchangeRates: mappedExchangeRates
        } satisfies ExchangeRateDto;
    }

    /**
     * Handles errors encountered during the fetching of exchange rates.
     * Logs the error details and throws an `InternalServerErrorException` with relevant information.
     *
     * @param {unknown} error - The error object encountered during the fetch process.
     * @return {never} This method does not return; it always throws an `InternalServerErrorException`.
     */
    private handleFetchError(error: unknown): never {
        this.logger.error('Error fetching exchange rates', error);
        throw new InternalServerErrorException({
            name: 'EXCHANGE_RATE_FETCH_ERROR',
            title: 'Error fetching exchange rates',
            message: 'Error fetching exchange rates',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            details: 'There was an error fetching the exchange rates. Please try again later.'
        });
    }
}
