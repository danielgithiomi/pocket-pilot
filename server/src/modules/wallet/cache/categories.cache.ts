import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { hoursToSeconds } from '@libs/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CategoriesDto } from '@modules/wallet/dto/categories.dto';

export class CategoriesCache extends EntityCache<CategoriesDto> {
    constructor(@Inject(CACHE_MANAGER) protected readonly cache: Cache) {
        super(cache, 'categories', hoursToSeconds(1));
    }
}
