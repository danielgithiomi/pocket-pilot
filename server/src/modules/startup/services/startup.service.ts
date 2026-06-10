import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ExchangeRateService } from '@modules/exchange-rate/services/exchange-rate.service';

@Injectable()
export class StartupService implements OnApplicationBootstrap {
    private readonly logger = new Logger(StartupService.name);

    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    // RUN ON APP STARTUP
    onApplicationBootstrap() {
        this.logger.log('Application is started up and ready to serve requests!');
        // await this.exchangeRateService.getThirdPartyExchangeRates();
    }

    // SETUP CRON JOBS
    /**
     * Fetches the latest exchange rate data from a specified provider.
     * This method is scheduled to run automatically every day at midnight.
     *
     * @return {Promise<void>} A promise that resolves when the exchange rate data has been successfully fetched and processed.
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async fetchExchangeRateData(): Promise<void> {
        await this.exchangeRateService.getThirdPartyExchangeRates();
    }
}
