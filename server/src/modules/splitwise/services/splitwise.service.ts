import { Injectable } from '@nestjs/common';
import { SplitCategoryTag } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { SplitwiseCache } from '../caches/splitwise.cache';
import { SplitwiseEventPayload } from '../dto/splitwise.dto';
import { SplitwiseRepository } from '../repositories/splitwise.repository';

@Injectable()
export class SplitwiseService {
    constructor(
        private readonly splitwiseCache: SplitwiseCache,
        private readonly splitwiseRepository: SplitwiseRepository,
    ) {}

    async getSplitwiseCategories() {
        return await Promise.resolve(Object.values(SplitCategoryTag).map(formatEnumForFrontend));
    }

    async createSplitwiseEvent(userId: string, payload: SplitwiseEventPayload) {
        const createdEvent = await this.splitwiseRepository.createSplitwiseEvent(userId, payload);
        console.log(createdEvent);
        return createdEvent;
    }
}
