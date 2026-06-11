import { plainToInstance } from 'class-transformer';
import { SquadsCache } from '../caches/splitr.cache';
import { Injectable, NotFoundException } from '@nestjs/common';
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

    async getSplitrSquadById(userId: string, squadId: string): Promise<SplitrSquadDto> {
        const userSquads = await this.getUserSplitrSquads(userId);
        const squadById = userSquads.find(squad => squad.id === squadId);

        if (!squadById)
            throw new NotFoundException({
                name: 'SPLITR_SQUAD_NOT_FOUND!',
                title: 'Splitr Squad Not Found!',
                details: `No splitr squad found with the ID provided.`,
            });

        return squadById;
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
        const { id: squadIdToUpdate } = await this.getSplitrSquadById(userId, squadId);

        const updatedSplitrSquad = await this.squadsRepository.updateExistingUserSplitrSquad(
            userId,
            squadIdToUpdate,
            payload,
        );
        await this.invalidateCache(userId);
        return plainToInstance(SplitrSquadDto, updatedSplitrSquad);
    }

    async deleteUserSplitrSquad(userId: string, squadId: string) {
        const { id: squadIdToDelete } = await this.getSplitrSquadById(userId, squadId);

        const deleteSquad = await this.squadsRepository.deleteUserSplitrSquad(userId, squadIdToDelete);
        await this.invalidateCache(userId);
        return deleteSquad;
    }

    // HELPER FUNCTIONS
    private async invalidateCache(userId: string) {
        await this.squadCache.invalidateCache(userId);
    }
}
