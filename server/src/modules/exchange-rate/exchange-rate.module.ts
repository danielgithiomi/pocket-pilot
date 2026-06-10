import { Module } from '@nestjs/common';
import { ExchangeRateService } from './services/exchange-rate.service';
import { ExchangeRateController } from './controllers/exchange-rate.controller';

@Module({
    imports: [],
    providers: [ExchangeRateService],
    controllers: [ExchangeRateController],
})
export class ExchangeRateModule {}
