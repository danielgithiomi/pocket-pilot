import { SplitCategoryTag } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { SplitwiseCache } from '../caches/splitwise.cache';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SplitwiseRepository } from '../repositories/splitwise.repository';
import { SplitwiseEventDto, SplitwiseEventPayload } from '../dto/splitwise.dto';

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
                details: `No splitwise event found with the ID: [${eventId}].`,
            });

        return eventById;
    }

    async createSplitwiseEvent(userId: string, payload: SplitwiseEventPayload) {
        const createdEvent = await this.splitwiseRepository.createSplitwiseEvent(userId, payload);
        console.log(createdEvent);
        return createdEvent;
    }
}
