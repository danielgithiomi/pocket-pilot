import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ExchangeRateDto } from '@modules/exchange-rate/dtos/exchange-rate.dto';
import { ExchangeRateService } from '@modules/exchange-rate/services/exchange-rate.service';

@Injectable()
export class StartupService implements OnApplicationBootstrap {
    private readonly logger = new Logger(StartupService.name);

    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    /**
     * Fetches the latest exchange rate data from a specified provider.
     * This method is run automatically on application startup.
     *
     * @returns {Promise<void>} A promise that resolves when the exchange rate data has been successfully fetched and processed.
     */
    async onApplicationBootstrap(): Promise<void> {
        // const { baseCurrency, nextUpdateTime, lastUpdatedTime, fetchedAt }: ExchangeRateDto =
        //     await this.exchangeRateService.fetchAndPersistExchangeRates();
        //
        // this.logger.warn({
        //     name: 'EXCHANGE_RATE_FETCH_SUCCESS_STARTUP',
        //     title: '(STARTUP) Exchange Rate Data Fetch Success',
        //     message: `(STARTUP) Successfully persisted exchange rate snapshot at ${fetchedAt.toISOString()}.`,
        //     exchangeRate: {
        //         baseCurrency,
        //         fetchedAt: fetchedAt.toISOString(),
        //         nextUpdateTime: nextUpdateTime.toISOString(),
        //         lastUpdatedTime: lastUpdatedTime.toISOString(),
        //     },
        // });
    }

    /**
     * Fetches the latest exchange rate data from a specified provider.
     * This method is scheduled to run automatically every day at midnight.
     *
     * @return {Promise<void>} A promise that resolves when the exchange rate data has been successfully fetched and processed.
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async fetchExchangeRateData(): Promise<void> {
        const { baseCurrency, nextUpdateTime, lastUpdatedTime, fetchedAt }: ExchangeRateDto =
            await this.exchangeRateService.fetchAndPersistExchangeRates();

        this.logger.warn({
            name: 'EXCHANGE_RATE_FETCH_SUCCESS_CRON_JOB',
            title: '(CRON_JOB) Exchange Rate Data Fetch Success',
            message: `(CRON_JOB) Successfully persisted exchange rate snapshot at ${fetchedAt.toISOString()}.`,
            exchangeRate: {
                baseCurrency,
                fetchedAt: fetchedAt.toISOString(),
                nextUpdateTime: nextUpdateTime.toISOString(),
                lastUpdatedTime: lastUpdatedTime.toISOString()
            }
        });
    }
}
