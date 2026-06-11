import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { SplitrEventDto } from '../dto/splitr.dto';
import { SplitrSquadDto } from '../dto/squads.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class SplitrCache extends EntityCache<SplitrEventDto[]> {
    constructor(@Inject(CACHE_MANAGER) cache: Cache) {
        super(cache, 'splitr');
    }
}

export class SquadsCache extends EntityCache<SplitrSquadDto[]> {
    constructor(@Inject(CACHE_MANAGER) cache: Cache) {
        super(cache, 'squads');
    }
}
