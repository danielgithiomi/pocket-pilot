import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class SplitwiseCache extends EntityCache<any[]> {
    constructor(@Inject(CACHE_MANAGER) cache: Cache) {
        super(cache, 'splitwise');
    }
}
