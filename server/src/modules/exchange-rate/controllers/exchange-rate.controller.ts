import { Summary } from '@common/decorators';
import { hoursToMilliseconds } from '@libs/utils';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExchangeRateDto } from '../dtos/exchange-rate.dto';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
    EXCHANGE_RATE_CACHE_KEY,
    EXCHANGE_RATE_CACHE_PREFIX,
    EXCHANGE_RATE_CACHE_TTL_HOURS
} from '@common/constants/api.constants';

@Controller('exchange-rate')
export class ExchangeRateController {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(hoursToMilliseconds(EXCHANGE_RATE_CACHE_TTL_HOURS))
    @CacheKey(`${EXCHANGE_RATE_CACHE_PREFIX}:${EXCHANGE_RATE_CACHE_KEY}`)
    @Summary('Exchange Rate Retrieved!', 'You have successfully retrieved the exchange rate.')
    @ApiResponse({ status: 200, type: ExchangeRateDto, description: 'The third party exchange rate' })
    @ApiOperation({ summary: 'Get the third party exchange rate', description: 'Get the third party exchange rate' })
    getThirdPartyExchangeRate() {
        return this.exchangeRateService.getThirdPartyExchangeRates();
    }
}
