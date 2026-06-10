import { Injectable } from '@nestjs/common';
import { hoursToMilliseconds } from '@libs/utils';
import { ExchangeRatePayload } from '../dtos/exchange-rate.dto';
import { DatabaseService } from '@infrastructure/database/database.service';
import { EXCHANGE_RATE_SNAPSHOT_RETENTION_DAYS } from '@common/constants/api.constants';

@Injectable()
export class ExchangeRateRepository {
    constructor(private readonly db: DatabaseService) {}

    createExchangeRateSnapshot(payload: ExchangeRatePayload) {
        const { baseCurrency, nextUpdateTime, lastUpdatedTime, exchangeRates } = payload;

        console.log('Creating exchange rate snapshot', payload);

        return this.db.exchangeRateSnapshot.create({
            data: {
                baseCurrency,
                nextUpdateTime: new Date(nextUpdateTime),
                lastUpdatedTime: new Date(lastUpdatedTime),
                exchangeRates: {
                    create: Object.entries(exchangeRates).map(([currency, rate]) => ({ currency, rate })),
                },
            },
            include: { exchangeRates: true },
        });
    }

    getLatestExchangeRateSnapshot(baseCurrency: string) {
        return this.db.exchangeRateSnapshot.findFirst({
            where: { baseCurrency },
            orderBy: { lastUpdatedTime: 'desc' },
            include: { exchangeRates: true },
            take: 1, // Get the latest snapshot
        });
    }

    deleteOutdatedExchangeRateSnapshots(baseCurrency: string) {
        const hoursToRetain = 24 * EXCHANGE_RATE_SNAPSHOT_RETENTION_DAYS;
        const cutoffDate = new Date(Date.now() - hoursToMilliseconds(hoursToRetain));

        return this.db.exchangeRateSnapshot.deleteMany({
            where: { baseCurrency, lastUpdatedTime: { lt: cutoffDate } },
        });
    }
}
