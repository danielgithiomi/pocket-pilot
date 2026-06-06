import { ExposeEnumDto } from '@common/types/api.types';
import { FeaturesCache } from '../cache/features.cache';
import { formatEnumForFrontend } from '@libs/utils/formatters';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { FeatureDto, FeaturePayload, UpdateFeatureStatusPayload } from '../dto/features.dto';
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
        return createdFeature;
    }

    getFeatureRequests(): Promise<FeatureDto[]> {
        return this.featuresRepository.getFeatureRequests();
    }

    getUserFeatureRequests(userId: string): Promise<FeatureDto[]> {
        return this.featureCache.getOrSetCache<FeatureDto[]>(userId, () =>
            this.featuresRepository.getUserFeatureRequests(userId),
        );
    }

    async updateFeatureStatusById(featureId: string, payload: UpdateFeatureStatusPayload): Promise<FeatureDto> {
        const updatedFeature = await this.featuresRepository.updateFeatureStatusById(featureId, payload);
        const { authorId } = updatedFeature;
        await this.invalidateCache(authorId);
        return updatedFeature;
    }

    async deleteFeatureRequestById(userId: string, featureId: string): Promise<FeatureDto> {
        const deletedFeature = await this.featuresRepository.deleteFeatureRequestById(featureId);
        const { authorId } = deletedFeature;

        if (authorId !== userId) {
            throw new ForbiddenException({
                name: 'FORBIDDEN_OPERATION',
                title: 'Feature Delete Forbidden!',
                message: 'You are not authorized to delete this feature request.',
            });
        }

        await this.invalidateCache(authorId);
        return deletedFeature;
    }

    // HELPER METHODS
    private async invalidateCache(userId: string): Promise<void> {
        await this.featureCache.invalidateCache(userId);
        await this.featureCache.invalidateCache('all-features');
    }
}
