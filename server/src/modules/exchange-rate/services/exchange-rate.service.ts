import { Injectable } from '@nestjs/common';
import { PPConfigService } from '@infrastructure/config';
import { ExchangeRateCache } from '@modules/exchange-rate/cache/exchange-rate.cache';
import { ExchangeRatePayload, ExchangeRateResponse } from '../dtos/exchange-rate.dto';

@Injectable()
export class ExchangeRateService {
    constructor(
        private readonly configService: PPConfigService,
        private readonly exchangeRateCache: ExchangeRateCache,
    ) {}

    async getThirdPartyExchangeRates() {
        const { apiKey, apiUrl, defaultCurrency } = this.configService.exchangeRate;

        //https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD
        const finalUrl = `${apiUrl}/${apiKey}/latest/${defaultCurrency}`;

        let payload: ExchangeRatePayload;

        try {
            const latestExchangeRateResponse = await this.exchangeRateCache.getOrSetCache('all', () =>
                this.fetchThirdPartyExchangeRates(finalUrl),
            );

            const { base_code, conversionRates, time_last_update_utc, time_next_update_utc } =
                latestExchangeRateResponse;

            payload = {
                baseCurrency: base_code,
                exchangeRates: conversionRates,
                lastUpdateTime: time_last_update_utc,
                nextUpdateTime: time_next_update_utc,
            };
        } catch (error) {
            console.log(error);
            return undefined;
        }

        console.log(payload);
    }

    private async fetchThirdPartyExchangeRates(apiUrl: string): Promise<ExchangeRateResponse> {
        const rawResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return (await rawResponse.json()) as Promise<ExchangeRateResponse>;
    }
}
