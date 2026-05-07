import { Injectable } from '@nestjs/common';
import { SplitCategoryTag } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { plainToInstance } from 'class-transformer';
import { SquadsCache } from './caches/squads.cache';
import { SplitwiseRepository } from './repositories/splitwise.repository';
import { SplitwiseSquadDto, SplitwiseSquadPayload } from './dto/splitwise.dto';

@Injectable()
export class SplitwiseService {
    constructor(
        private readonly squadCache: SquadsCache,
        private readonly splitwiseRepository: SplitwiseRepository,
    ) {}

    async getSplitwiseCategories() {
        return await Promise.resolve(Object.values(SplitCategoryTag).map(formatEnumForFrontend));
    }

    async getUserSplitwiseSquads(userId: string): Promise<SplitwiseSquadDto[]> {
        return this.splitwiseRepository.getUserSplitwiseSquads(userId);
    }

    async createSplitwiseSquad(userId: string, payload: SplitwiseSquadPayload): Promise<SplitwiseSquadDto> {
        const createdSplitwiseSquad = await this.splitwiseRepository.createNewSplitWiseSquad(userId, payload);
        await this.invalidateCache(userId);
        return plainToInstance(SplitwiseSquadDto, createdSplitwiseSquad);
    }

    // HELPER FUNCTIONS
    private async invalidateCache(userId: string) {
        await this.squadCache.invalidateCache(userId);
    }
}
