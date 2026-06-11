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
    PrismaExchangeRateSnapshotWithRates,
} from '../dtos/exchange-rate.dto';

@Injectable()
export class ExchangeRateService {
    private readonly BASE_CURRENCY: string = 'USD' as const;
    private readonly logger = new Logger(ExchangeRateService.name);

    constructor(
        private readonly configService: PPConfigService,
        private readonly exchangeRateCache: ExchangeRateCache,
        private readonly exchangeRateRepository: ExchangeRateRepository,
    ) {}

    async getThirdPartyExchangeRates() {
        const { defaultCurrency } = this.configService.exchangeRate;

        try {
            const latestExchangeRateResponse: ExchangeRateDto = await this.exchangeRateCache.getOrSetCache(
                EXCHANGE_RATE_CACHE_KEY,
                async () => {
                    // Invalidate cache
                    await this.exchangeRateCache.invalidateCache(EXCHANGE_RATE_CACHE_KEY);

                    // Fetch from database
                    const dbSnapshot = await this.fetchFromDatabase(defaultCurrency);
                    if (dbSnapshot) return dbSnapshot;

                    // Nothing found in DB, fetch from third party
                    const thirdPartyData: ExchangeRateResponse = await this.fetchThirdPartyExchangeRates();

                    // Persist fetched data to database
                    return await this.saveThirdPartyDataToDB(thirdPartyData);
                },
            );

            return latestExchangeRateResponse;
        } catch (error) {
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

    async performCurrencyConversion(
        amount: number,
        fromCurrency: string,
        toCurrency: string,
    ): Promise<CurrencyConversionResult> {
        const exchangeRateSnapshot = await this.getThirdPartyExchangeRates();

        // CONVERSION CLOSURE
        const convertAmount = (amount: number, sourceCurrency: string, targetCurrency: string) => {
            const sourceCurrencyRate = exchangeRateSnapshot.exchangeRates[sourceCurrency];
            const targetCurrencyRate = exchangeRateSnapshot.exchangeRates[targetCurrency];

            return (amount * targetCurrencyRate) / sourceCurrencyRate;
        };

        const toBaseAmount = convertAmount(amount, fromCurrency, this.BASE_CURRENCY);
        const toTargetAmount = convertAmount(toBaseAmount, this.BASE_CURRENCY, toCurrency);

        return {
            base: {
                currency: this.BASE_CURRENCY,
                amount: exchangeRateSnapshot.exchangeRates[this.BASE_CURRENCY],
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

    // HELPER FUNCTIONS
    private async fetchFromDatabase(defaultCurrency: string): Promise<ExchangeRateDto | null> {
        const latestDBSnapshot = await this.exchangeRateRepository.getLatestExchangeRateSnapshot(defaultCurrency);

        if (!latestDBSnapshot) return null;

        return this.toExchangeRateDto(latestDBSnapshot);
    }

    private async fetchThirdPartyExchangeRates(): Promise<ExchangeRateResponse> {
        const { apiKey, apiUrl, defaultCurrency } = this.configService.exchangeRate;

        //https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD
        const finalUrl = `${apiUrl}/${apiKey}/latest/${defaultCurrency}`;

        const rawResponse = await fetch(finalUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

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

        await this.deleteOutdatedExchangeRateSnapshots(payload.baseCurrency);

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
            fetchedAt,
            baseCurrency,
            nextUpdateTime,
            lastUpdatedTime,
            exchangeRates: mappedExchangeRates,
        } satisfies ExchangeRateDto;
    }
}
