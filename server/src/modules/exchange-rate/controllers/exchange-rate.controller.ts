import { Summary } from '@common/decorators';
import { hoursToMilliseconds } from '@libs/utils';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
    EXCHANGE_RATE_CACHE_KEY,
    EXCHANGE_RATE_CACHE_PREFIX,
    EXCHANGE_RATE_CACHE_TTL_HOURS,
} from '@common/constants/api.constants';

@Controller('exchange-rate')
export class ExchangeRateController {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheKey(`${EXCHANGE_RATE_CACHE_PREFIX}:${EXCHANGE_RATE_CACHE_KEY}`)
    @CacheTTL(hoursToMilliseconds(EXCHANGE_RATE_CACHE_TTL_HOURS))
    @Summary('Get the third party exchange rate')
    getThirdPartyExchangeRate() {
        return this.exchangeRateService.getThirdPartyExchangeRates();
    }
}
