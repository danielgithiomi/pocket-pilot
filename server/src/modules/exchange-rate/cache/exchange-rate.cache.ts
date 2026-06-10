import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { hoursToSeconds } from '@libs/utils';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExchangeRateResponse } from '@modules/exchange-rate/dtos/exchange-rate.dto';

@Injectable()
export class ExchangeRateCache extends EntityCache<ExchangeRateResponse> {
    constructor(@Inject(CACHE_MANAGER) protected readonly cache: Cache) {
        super(cache, 'exchange-rates', hoursToSeconds(24));
    }
}
