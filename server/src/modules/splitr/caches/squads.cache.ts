import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { EntityCache } from '@common/cache';
import { SplitrSquadDto } from '../dto/squads.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class SquadsCache extends EntityCache<SplitrSquadDto[]> {
    constructor(@Inject(CACHE_MANAGER) cache: Cache) {
        super(cache, 'squads');
    }
}
