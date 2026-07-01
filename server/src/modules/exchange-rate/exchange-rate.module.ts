import { Module } from '@nestjs/common';
import { ExchangeRateCache } from './cache/exchange-rate.cache';
import { ExchangeRateService } from './services/exchange-rate.service';
import { ExchangeRateController } from './controllers/exchange-rate.controller';
import { ExchangeRateRepository } from './repositories/exchange-rate.respository';

@Module({
    exports: [ExchangeRateService],
    controllers: [ExchangeRateController],
    providers: [ExchangeRateService, ExchangeRateCache, ExchangeRateRepository]
})
export class ExchangeRateModule {}
