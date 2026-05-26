import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SplitwiseSquadDto } from '../dto/squads.dto';

export class SquadsCache extends EntityCache<SplitwiseSquadDto[]> {
    constructor(@Inject(CACHE_MANAGER) cache: Cache) {
        super(cache, 'squads');
    }
}
