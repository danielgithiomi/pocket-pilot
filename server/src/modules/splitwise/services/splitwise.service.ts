import { Injectable } from '@nestjs/common';
import { SplitCategoryTag } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { SplitwiseCache } from '../caches/splitwise.cache';
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
}
