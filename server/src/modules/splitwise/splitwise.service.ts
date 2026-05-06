import { Injectable } from '@nestjs/common';
import { SplitCategoryTag } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';

@Injectable()
export class SplitwiseService {
    async getSplitwiseCategories() {
        return await Promise.resolve(Object.values(SplitCategoryTag).map(formatEnumForFrontend));
    }
}
