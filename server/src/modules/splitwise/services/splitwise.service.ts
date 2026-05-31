import { SplitCategoryTag } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { plainToInstance } from 'class-transformer';
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

    async getUserSplitwiseEvents(userId: string): Promise<SplitwiseEventDto[]> {
        const userEvents = await this.splitwiseCache.getOrSetCache<SplitwiseEventDto[]>(userId, () =>
            this.splitwiseRepository.getUserSplitwiseEvents(userId),
        );
        return userEvents.map(event => plainToInstance(SplitwiseEventDto, event));
    }

    async getSplitwiseEventById(userId: string, eventId: string): Promise<SplitwiseEventDto> {
        const eventById = (await this.getUserSplitwiseEvents(userId)).find(event => event.id === eventId);

        if (!eventById)
            throw new NotFoundException({
                name: 'SPLITWISE_EVENT_NOT_FOUND!',
                title: 'Splitwise Event Not Found!',
                details: `No splitwise event found with the ID: [${eventId}].`,
            });

        return eventById;
    }

    async createSplitwiseEvent(userId: string, payload: SplitwiseEventPayload) {
        const createdEvent = await this.splitwiseRepository.createSplitwiseEvent(userId, payload);
        await this.invalidateCache(userId);
        return plainToInstance(SplitwiseEventDto, createdEvent);
    }

    async markSplitwiseEventAsSettledOrPending(userId: string, eventId: string, payload: SettleSplitrPayload) {
        const markedEvent = await this.splitwiseRepository.markSplitwiseEventAsSettledOrPending(
            userId,
            eventId,
            payload,
        );
        await this.invalidateCache(userId);
        return plainToInstance(SplitwiseEventDto, markedEvent);
    }

    async deleteSplitwiseEvent(userId: string, eventId: string) {
        const deletedEvent = await this.splitwiseRepository.deleteSplitwiseEvent(userId, eventId);
        await this.invalidateCache(userId);
        return plainToInstance(SplitwiseEventDto, deletedEvent);
    }

    // HELPER FUNCTIONS
    private async invalidateCache(userId: string) {
        await this.splitwiseCache.invalidateCache(userId);
    }
}
