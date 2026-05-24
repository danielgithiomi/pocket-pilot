import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SquadsCache } from '../caches/squads.cache';
import { SquadsRepository } from '../repositories/squads.repository';
import { SplitwiseSquadDto, SplitwiseSquadPayload } from '../dto/splitwise.dto';

@Injectable()
export class SquadsService {
    constructor(
        private readonly squadCache: SquadsCache,
        private readonly squadsRepository: SquadsRepository,
    ) {}

    async getUserSplitwiseSquads(userId: string): Promise<SplitwiseSquadDto[]> {
        return this.squadCache.getOrSetCache<SplitwiseSquadDto[]>(userId, () =>
            this.squadsRepository.getUserSplitwiseSquads(userId),
        );
    }

    async createSplitwiseSquad(userId: string, payload: SplitwiseSquadPayload): Promise<SplitwiseSquadDto> {
        const createdSplitwiseSquad = await this.squadsRepository.createNewSplitWiseSquad(userId, payload);
        await this.invalidateCache(userId);
        return plainToInstance(SplitwiseSquadDto, createdSplitwiseSquad);
    }

    async updateExistingUserSplitwiseSquad(
        userId: string,
        squadId: string,
        payload: SplitwiseSquadPayload,
    ): Promise<SplitwiseSquadDto> {
        const updatedSplitwiseSquad = await this.squadsRepository.updateExistingUserSplitwiseSquad(
            userId,
            squadId,
            payload,
        );
        await this.invalidateCache(userId);
        return plainToInstance(SplitwiseSquadDto, updatedSplitwiseSquad);
    }

    async deleteUserSplitwiseSquad(userId: string, squadId: string) {
        const deleteSquad = await this.squadsRepository.deleteUserSplitwiseSquad(userId, squadId);
        await this.invalidateCache(userId);
        return deleteSquad;
    }

    // HELPER FUNCTIONS
    private async invalidateCache(userId: string) {
        await this.squadCache.invalidateCache(userId);
    }
}
