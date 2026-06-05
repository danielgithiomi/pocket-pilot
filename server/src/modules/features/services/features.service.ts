import { Injectable } from '@nestjs/common';
import { ExposeEnumDto } from '@common/types/api.types';
import { formatEnumForFrontend } from '@libs/utils/formatters';
import { FeaturesRepository } from '../repositories/features.repository';
import { FeatureCategory, FeatureStatus, VoteVariant } from '@prisma/client';

@Injectable()
export class FeaturesService {
    constructor(private readonly featuresRepository: FeaturesRepository) {}

    async getFeatureCategories(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(FeatureCategory).map(formatEnumForFrontend));
    }

    async getFeatureStatuses(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(FeatureStatus).map(formatEnumForFrontend));
    }

    async getFeatureVoteVariants(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(VoteVariant).map(formatEnumForFrontend));
    }
}
