import { ExposeEnumDto } from '@common/types/api.types';
import { FeaturesCache } from '../cache/features.cache';
import { formatEnumForFrontend } from '@libs/utils/formatters';
import { FeaturesRepository } from '../repositories/features.repository';
import { FeatureCategory, FeatureStatus, VoteVariant } from '@prisma/client';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
    FeatureDto,
    FeaturePayload,
    FeatureWithUser,
    FeaturesWithCountDto,
    UpdateFeatureStatusPayload,
} from '../dto/features.dto';
import { flattenFeature } from './features.mappers';

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
        const { features }: FeaturesWithCountDto = await this.getFeatureRequests();

        const foundFeature = features.find(feature => feature.id === featureId);

        if (!foundFeature)
            throw new NotFoundException({
                name: 'FEATURE_NOT_FOUND',
                title: 'Feature Not Found!',
                message: 'The feature you are trying to access does not exist in the database.',
            });

        return foundFeature;
    }

    async updateFeatureStatusById(
        userId: string,
        featureId: string,
        payload: UpdateFeatureStatusPayload,
    ): Promise<FeatureDto> {
        await this.assertainFeatureExists(featureId);
        await this.assertainFeatureBelongsToUser(featureId, userId);

        const updatedFeature: FeatureWithUser = await this.featuresRepository.updateFeatureStatusById(
            featureId,
            payload,
        );

        const { authorId } = updatedFeature;
        await this.invalidateCache(authorId);

        return flattenFeature(updatedFeature);
    }

    async deleteFeatureRequestById(userId: string, featureId: string): Promise<FeatureDto> {
        await this.assertainFeatureExists(featureId);
        await this.assertainFeatureBelongsToUser(featureId, userId);

        const deletedFeature: FeatureWithUser = await this.featuresRepository.deleteFeatureRequestById(featureId);

        const { authorId } = deletedFeature;
        await this.invalidateCache(authorId);

        return flattenFeature(deletedFeature);
    }

    // HELPER METHODS
    private async invalidateCache(userId: string): Promise<void> {
        await this.featureCache.invalidateCache(userId);
        await this.featureCache.invalidateCache('all-features');
    }

    private async assertainFeatureExists(featureId: string): Promise<boolean> {
        const { features }: FeaturesWithCountDto = await this.getFeatureRequests();

        const foundFeature = features.find(feature => feature.id === featureId);

        if (!foundFeature)
            throw new NotFoundException({
                name: 'FEATURE_NOT_FOUND',
                title: 'Feature Not Found!',
                message: 'The feature you are trying to access does not exist in the database.',
            });

        return !!foundFeature;
    }

    private async assertainFeatureBelongsToUser(featureId: string, userId: string): Promise<boolean> {
        await this.assertainFeatureExists(featureId);

        const feature = await this.getFeatureById(featureId);
        const isOwnedByUser = feature.authorId === userId;

        if (!isOwnedByUser)
            throw new ForbiddenException({
                name: 'FORBIDDEN_OPERATION',
                title: 'Feature Access Forbidden!',
                message: 'You are not authorized to access this feature or modify it.',
            });

        return !!isOwnedByUser;
    }
}
