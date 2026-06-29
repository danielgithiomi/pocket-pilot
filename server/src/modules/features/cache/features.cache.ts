import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { minutesToSeconds } from '@libs/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FeatureDto, FeatureWithCommentsDto } from '../dto/features.dto';

export class FeaturesCache extends EntityCache<FeatureDto[]> {
    constructor(@Inject(CACHE_MANAGER) protected readonly cache: Cache) {
        super(cache, 'features', minutesToSeconds(15));
    }
}

export class FeatureCommentsCache extends EntityCache<FeatureWithCommentsDto[]> {
    constructor(@Inject(CACHE_MANAGER) protected readonly cache: Cache) {
        super(cache, 'features', minutesToSeconds(5));
    }
}
