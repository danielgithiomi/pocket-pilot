import { Module } from '@nestjs/common';
import { ExchangeRateCache } from './cache/exchange-rate.cache';
import { ExchangeRateService } from './services/exchange-rate.service';
import { ExchangeRateController } from './controllers/exchange-rate.controller';
import { ExchangeRateRepository } from './repositories/exchange-rate.respository';

@Module({
    controllers: [ExchangeRateController],
    exports: [ExchangeRateService, ExchangeRateCache, ExchangeRateRepository],
    providers: [ExchangeRateService, ExchangeRateRepository, ExchangeRateCache],
})
export class ExchangeRateModule {}
