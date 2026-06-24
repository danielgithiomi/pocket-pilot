import { ExposeEnumDto } from '@common/types/api.types';
import { FeaturesCache } from '../cache/features.cache';
import { formatEnumForFrontend } from '@libs/utils/formatters';
import { FeaturesRepository } from '../repositories/features.repository';
import { FeatureCategory, FeatureStatus } from '@prisma/client';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
    FeatureDto,
    FeaturePayload,
    FeaturesWithCountDto,
    FeatureWithUser,
    UpdateFeatureStatusPayload
} from '../dto/features.dto';
import { flattenFeature } from './features.mappers';

@Injectable()
export class FeaturesService {
    constructor(
        private readonly featureCache: FeaturesCache,
        private readonly featuresRepository: FeaturesRepository
    ) {}

    getFeatureCategories = (): ExposeEnumDto[] => Object.values(FeatureCategory).map(formatEnumForFrontend);

    getFeatureStatuses = (): ExposeEnumDto[] => Object.values(FeatureStatus).map(formatEnumForFrontend);

    async createFeatureRequest(userId: string, payload: FeaturePayload): Promise<FeatureDto> {
        const createdFeature: FeatureWithUser = await this.featuresRepository.createFeatureRequest(userId, payload);
        await this.invalidateCache(userId);
        return flattenFeature(createdFeature);
    }

    getFeatureRequests(): Promise<FeaturesWithCountDto> {
        return this.featureCache.getOrSetCache<FeaturesWithCountDto>('all-features', async () => {
            const features = await this.featuresRepository.getFeatureRequests();
            return { count: features.length, features: features.map(flattenFeature) };
        });
    }

    getUserFeatureRequests(userId: string): Promise<FeatureDto[]> {
        return this.featureCache.getOrSetCache<FeatureDto[]>(userId, async () => {
            const userFeatures: FeatureWithUser[] = await this.featuresRepository.getUserFeatureRequests(userId);
            return userFeatures.map(flattenFeature);
        });
    }

    async getFeatureById(featureId: string): Promise<FeatureDto> {
        const foundFeature = await this.featuresRepository.getFeatureRequestById(featureId);

        if (!foundFeature)
            throw new NotFoundException({
                name: 'FEATURE_NOT_FOUND',
                title: 'Feature Not Found!',
                message: 'The feature you are trying to access does not exist in the database.'
            });

        return flattenFeature(foundFeature);
    }

    async updateFeatureStatusById(userId: string, featureId: string, payload: UpdateFeatureStatusPayload): Promise<FeatureDto> {
        await this.performAssertions(userId, featureId);

        const updatedFeature: FeatureWithUser = await this.featuresRepository.updateFeatureStatusById(featureId, payload);

        const { authorId } = updatedFeature;
        await this.invalidateCache(authorId);

        return flattenFeature(updatedFeature);
    }

    async toggleFeatureUpvoteById(userId: string, featureId: string): Promise<FeatureDto> {
        await this.ascertainFeatureExists(featureId);

        const updatedFeature = await this.featuresRepository.toggleFeatureUpvoteById(userId, featureId);
        await this.invalidateCache(updatedFeature.authorId);

        return flattenFeature(updatedFeature);
    }

    async deleteFeatureRequestById(userId: string, featureId: string): Promise<FeatureDto> {
        await this.performAssertions(userId, featureId);

        const deletedFeature: FeatureWithUser = await this.featuresRepository.deleteFeatureRequestById(featureId);

        const { authorId } = deletedFeature;
        await this.invalidateCache(authorId);

        return flattenFeature(deletedFeature);
    }

    // HELPER METHODS
    private async invalidateCache(userId?: string): Promise<void> {
        if (userId) await this.featureCache.invalidateCache(userId);
        await this.featureCache.invalidateCache('all-features');
    }

    private async performAssertions(userId: string, featureId: string) {
        await this.ascertainFeatureExists(featureId);
        await this.ascertainFeatureBelongsToUser(featureId, userId);
    }

    private async ascertainFeatureExists(featureId: string): Promise<boolean> {
        await this.getFeatureById(featureId);
        return true;
    }

    private async ascertainFeatureBelongsToUser(featureId: string, userId: string): Promise<boolean> {
        await this.ascertainFeatureExists(featureId);

        const feature = await this.getFeatureById(featureId);
        const isOwnedByUser = feature.authorId === userId;

        if (!isOwnedByUser)
            throw new ForbiddenException({
                name: 'FORBIDDEN_OPERATION',
                title: 'Feature Access Forbidden!',
                message: 'You are not authorized to access this feature or modify it.'
            });

        return !!isOwnedByUser;
    }
}
