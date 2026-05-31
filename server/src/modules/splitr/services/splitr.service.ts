import { SplitCategoryTag } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { SplitrCache } from '../caches/splitr.cache';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SplitrRepository } from '../repositories/splitr.repository';
import { SettleSplitrPayload, SplitrEventDto, SplitrEventPayload } from '../dto/splitr.dto';

@Injectable()
export class SplitrService {
    constructor(
        private readonly splitrCache: SplitrCache,
        private readonly splitrRepository: SplitrRepository,
    ) {}

    async getSplitwiseCategories() {
        return await Promise.resolve(Object.values(SplitCategoryTag).map(formatEnumForFrontend));
    }

    getUserSplitrEvents(userId: string): Promise<SplitrEventDto[]> {
        return this.splitrCache.getOrSetCache<SplitrEventDto[]>(userId, () =>
            this.splitrRepository.getUserSplitrEvents(userId),
        );
    }

    async getSplitrEventById(userId: string, eventId: string): Promise<SplitrEventDto> {
        const eventById = (await this.getUserSplitrEvents(userId)).find(event => event.id === eventId);

        if (!eventById)
            throw new NotFoundException({
                name: 'SPLITR_EVENT_NOT_FOUND!',
                title: 'Splitr Event Not Found!',
                details: `No splitr event found with the ID provided.`,
            });

        return eventById;
    }

    async createSplitrEvent(userId: string, payload: SplitrEventPayload) {
        const createdEvent = await this.splitrRepository.createSplitrEvent(userId, payload);
        await this.invalidateCache(userId);
        return createdEvent;
    }

    async markSplitrEventAsSettledOrPending(userId: string, eventId: string, payload: SettleSplitrPayload) {
        const { id } = await this.getSplitrEventById(userId, eventId);
        const updatedEvent = await this.splitrRepository.markSplitrEventAsSettledOrPending(userId, id, payload);
        await this.invalidateCache(userId);
        return updatedEvent;
    }

    async deleteSplitrEvent(userId: string, eventId: string) {
        const { id } = await this.getSplitrEventById(userId, eventId);
        const deletedEvent = await this.splitrRepository.deleteSplitrEvent(userId, id);
        await this.invalidateCache(userId);
        return deletedEvent;
    }

    // HELPER FUNCTIONS
    private async invalidateCache(userId: string) {
        await this.splitrCache.invalidateCache(userId);
    }
}
