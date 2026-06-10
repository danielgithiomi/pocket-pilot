import { Injectable } from '@nestjs/common';
import { PPConfigService } from '@infrastructure/config';
import { EXCHANGE_RATE_CACHE_KEY } from '@common/constants/api.constants';
import { ExchangeRateRepository } from '../repositories/exchange-rate.respository';
import { ExchangeRateCache } from '@modules/exchange-rate/cache/exchange-rate.cache';
import {
    ExchangeRateDto,
    ExchangeRatePayload,
    ExchangeRateResponse,
    PrismaExchangeRateSnapshotWithRates,
} from '../dtos/exchange-rate.dto';

@Injectable()
export class ExchangeRateService {
    constructor(
        private readonly configService: PPConfigService,
        private readonly exchangeRateCache: ExchangeRateCache,
        private readonly exchangeRateRepository: ExchangeRateRepository,
    ) {}

    async getThirdPartyExchangeRates() {
        const { apiKey, apiUrl, defaultCurrency } = this.configService.exchangeRate;

        //https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD
        const finalUrl = `${apiUrl}/${apiKey}/latest/${defaultCurrency}`;

        try {
            const latestExchangeRateResponse = await this.exchangeRateCache.getOrSetCache(EXCHANGE_RATE_CACHE_KEY, () =>
                this.fetchThirdPartyExchangeRates(finalUrl, defaultCurrency),
            );

            console.log('Latest exchange rate response', latestExchangeRateResponse);
            // return latestExchangeRateResponse;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    private async fetchThirdPartyExchangeRates(apiUrl: string, defaultCurrency: string): Promise<ExchangeRateDto> {
        await this.exchangeRateCache.invalidateCache(EXCHANGE_RATE_CACHE_KEY);

        const latestDBSnapshot = await this.exchangeRateRepository.getLatestExchangeRateSnapshot(defaultCurrency);

        if (latestDBSnapshot) {
            console.log('Latest DB snapshot found', latestDBSnapshot);
            return this.toExchangeRateDto(latestDBSnapshot);
        }

        const rawResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const exchangeRateData = (await rawResponse.json()) as ExchangeRateResponse;
        const { base_code, conversion_rates, time_last_update_utc, time_next_update_utc } = exchangeRateData;

        console.log('Exchange rate data', exchangeRateData);

        const payload = {
            baseCurrency: base_code,
            exchangeRates: conversion_rates,
            nextUpdateTime: time_next_update_utc,
            lastUpdatedTime: time_last_update_utc,
        } satisfies ExchangeRatePayload;

        const savedSnapshot = await this.exchangeRateRepository.createExchangeRateSnapshot(payload);
        console.log('Saved snapshot', savedSnapshot);

        await this.deleteOutdatedExchangeRateSnapshots(defaultCurrency);

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
