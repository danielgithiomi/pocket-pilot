import { SplitCategoryTag } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { SplitwiseCache } from '../caches/splitwise.cache';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SplitwiseRepository } from '../repositories/splitwise.repository';
import { SettleSplitrPayload, SplitwiseEventDto, SplitwiseEventPayload } from '../dto/splitwise.dto';

@Injectable()
export class SplitwiseService {
    constructor(
        private readonly splitwiseCache: SplitwiseCache,
        private readonly splitwiseRepository: SplitwiseRepository,
    ) {}

    async getSplitwiseCategories() {
        return await Promise.resolve(Object.values(SplitCategoryTag).map(formatEnumForFrontend));
    }

    getUserSplitwiseEvents(userId: string): Promise<SplitwiseEventDto[]> {
        return this.splitwiseCache.getOrSetCache<SplitwiseEventDto[]>(userId, () =>
            this.splitwiseRepository.getUserSplitwiseEvents(userId),
        );
    }

    async getSplitwiseEventById(userId: string, eventId: string): Promise<SplitwiseEventDto> {
        const eventById = (await this.getUserSplitwiseEvents(userId)).find(event => event.id === eventId);

        if (!eventById)
            throw new NotFoundException({
                name: 'SPLITWISE_EVENT_NOT_FOUND!',
                title: 'Splitwise Event Not Found!',
                details: `No splitr event found with the ID provided.`,
            });

        return eventById;
    }

    async createSplitwiseEvent(userId: string, payload: SplitwiseEventPayload) {
        const createdEvent = await this.splitwiseRepository.createSplitwiseEvent(userId, payload);
        await this.invalidateCache(userId);
        return createdEvent;
    }

    async markSplitwiseEventAsSettledOrPending(userId: string, eventId: string, payload: SettleSplitrPayload) {
        const { id } = await this.getSplitwiseEventById(userId, eventId);
        const updatedEvent = await this.splitwiseRepository.markSplitwiseEventAsSettledOrPending(userId, id, payload);
        await this.invalidateCache(userId);
        return updatedEvent;
    }

    async deleteSplitwiseEvent(userId: string, eventId: string) {
        const { id } = await this.getSplitwiseEventById(userId, eventId);
        const deletedEvent = await this.splitwiseRepository.deleteSplitwiseEvent(userId, id);
        await this.invalidateCache(userId);
        return deletedEvent;
    }

    // HELPER FUNCTIONS
    private async invalidateCache(userId: string) {
        await this.splitwiseCache.invalidateCache(userId);
    }
}
