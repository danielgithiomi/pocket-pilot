import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { hoursToSeconds } from '@libs/utils';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EXCHANGE_RATE_CACHE_PREFIX } from '@common/constants/api.constants';
import { ExchangeRateDto } from '@modules/exchange-rate/dtos/exchange-rate.dto';

@Injectable()
export class ExchangeRateCache extends EntityCache<ExchangeRateDto> {
    constructor(@Inject(CACHE_MANAGER) protected readonly cache: Cache) {
        super(cache, EXCHANGE_RATE_CACHE_PREFIX, hoursToSeconds(24));
    }
}
