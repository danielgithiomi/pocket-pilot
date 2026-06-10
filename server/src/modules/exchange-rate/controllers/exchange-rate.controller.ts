import { Summary } from '@common/decorators';
import { hoursToMilliseconds } from '@libs/utils';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('exchange-rate')
export class ExchangeRateController {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('exchange-rates:all')
    @CacheTTL(hoursToMilliseconds(24))
    @Summary('Get the third party exchange rate')
    getThirdPartyExchangeRate() {
        return this.exchangeRateService.getThirdPartyExchangeRates();
    }
}
