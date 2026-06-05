import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ExposeEnumDto } from '@common/types/api.types';
import { FeaturesCache } from '../cache/features.cache';
import { formatEnumForFrontend } from '@libs/utils/formatters';
import { FeatureDto, FeaturePayload } from '../dto/features.dto';
import { FeaturesRepository } from '../repositories/features.repository';
import { FeatureCategory, FeatureStatus, VoteVariant } from '@prisma/client';

@Injectable()
export class FeaturesService {
    constructor(
        private readonly featureCache: FeaturesCache,
        private readonly featuresRepository: FeaturesRepository,
    ) {}

    async getFeatureCategories(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(FeatureCategory).map(formatEnumForFrontend));
    }

    async getFeatureStatuses(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(FeatureStatus).map(formatEnumForFrontend));
    }

    async getFeatureVoteVariants(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(VoteVariant).map(formatEnumForFrontend));
    }

    async createFeatureRequest(userId: string, payload: FeaturePayload): Promise<FeatureDto> {
        const createdFeature = await this.featuresRepository.createFeatureRequest(userId, payload);
        await this.invalidateCache(userId);
        return this.toFeatureDto(createdFeature);
    }

    getFeatureRequests(): Promise<FeatureDto[]> {
        return this.featuresRepository.getFeatureRequests();
    }

    async getUserFeatureRequests(userId: string): Promise<FeatureDto[]> {
        const cachedUserFeatures = await this.featureCache.getOrSetCache<FeatureDto[]>(userId, () =>
            this.featuresRepository.getUserFeatureRequests(userId),
        );
        return cachedUserFeatures.map(feature => this.toFeatureDto(feature));
    }

    // HELPER METHODS
    private toFeatureDto(feature: FeatureDto): FeatureDto {
        return plainToInstance(FeatureDto, feature);
    }

    private async invalidateCache(userId: string): Promise<void> {
        await this.featureCache.invalidateCache(userId);
        await this.featureCache.invalidateCache('feature:requests');
    }
}
