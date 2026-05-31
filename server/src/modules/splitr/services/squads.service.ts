import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SquadsCache } from '../caches/squads.cache';
import { SquadsRepository } from '../repositories/squads.repository';
import { SplitrSquadDto, SplitrSquadPayload } from '../dto/squads.dto';

@Injectable()
export class SquadsService {
    constructor(
        private readonly squadCache: SquadsCache,
        private readonly squadsRepository: SquadsRepository,
    ) {}

    async getUserSplitrSquads(userId: string): Promise<SplitrSquadDto[]> {
        return this.squadCache.getOrSetCache<SplitrSquadDto[]>(userId, () =>
            this.squadsRepository.getUserSplitrSquads(userId),
        );
    }

    async createSplitrSquad(userId: string, payload: SplitrSquadPayload): Promise<SplitrSquadDto> {
        const createdSplitrSquad = await this.squadsRepository.createNewSplitrSquad(userId, payload);
        await this.invalidateCache(userId);
        return plainToInstance(SplitrSquadDto, createdSplitrSquad);
    }

    async updateExistingUserSplitrSquad(
        userId: string,
        squadId: string,
        payload: SplitrSquadPayload,
    ): Promise<SplitrSquadDto> {
        const updatedSplitwiseSquad = await this.squadsRepository.updateExistingUserSplitrSquad(
            userId,
            squadId,
            payload,
        );
        await this.invalidateCache(userId);
        return plainToInstance(SplitrSquadDto, updatedSplitwiseSquad);
    }

    async deleteUserSplitrSquad(userId: string, squadId: string) {
        const deleteSquad = await this.squadsRepository.deleteUserSplitrSquad(userId, squadId);
        await this.invalidateCache(userId);
        return deleteSquad;
    }

    // HELPER FUNCTIONS
    private async invalidateCache(userId: string) {
        await this.squadCache.invalidateCache(userId);
    }
}
