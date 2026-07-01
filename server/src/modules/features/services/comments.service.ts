import { Injectable } from '@nestjs/common';
import { AwsService } from '@modules/aws/aws.service';
import { FeatureCommentsCache } from '../cache/features.cache';
import { FeaturesService } from '../services/features.service';
import { mapPrismaCommentToDto } from '../mappers/comments.mappers';
import { CommentsRepository } from '../repositories/comments.repository';
import { FeatureCommentPayload, PrismaComment } from '../dto/comments.dto';

@Injectable()
export class CommentsService {
    private COMMENTS_CACHE_KEY = 'comments';

    constructor(
        private readonly awsService: AwsService,
        private readonly featuresService: FeaturesService,
        private readonly commentsRepository: CommentsRepository,
        private readonly featureCommentsCache: FeatureCommentsCache
    ) {}

    async addCommentToFeature(userId: string, featureId: string, payload: FeatureCommentPayload) {
        const comment: PrismaComment = await this.commentsRepository.addCommentToFeature(userId, featureId, payload);

        await this.invalidateCommentsCache(featureId);

        return await mapPrismaCommentToDto(comment, this.formatProfilePictureUrl);
    }

    async getAllFeatureComments(userId: string, featureId: string) {
        const cacheKey: string = this.generateFeatureCommentsCacheKey(featureId);

        return await this.featureCommentsCache.getOrSetCache(cacheKey, async () => {
            const prismaComments: PrismaComment[] = await this.commentsRepository.getAllFeatureComments(userId, featureId);

            return await Promise.all(
                prismaComments.map(async comment => await mapPrismaCommentToDto(comment, this.formatProfilePictureUrl))
            );
        });
    }

    // HELPER FUNCTIONS
    private formatProfilePictureUrl = async (profilePictureKey: string | null) => {
        if (!profilePictureKey) return null;
        return await this.awsService.checkAndGenerateProfilePictureUrl(profilePictureKey);
    };

    private async invalidateCommentsCache(featureId: string) {
        const commentsCacheKey: string = this.generateFeatureCommentsCacheKey(featureId);

        await this.featuresService.invalidateCache();
        await this.featureCommentsCache.invalidateCache(commentsCacheKey);
    }

    private generateFeatureCommentsCacheKey(featureId: string) {
        return `${this.COMMENTS_CACHE_KEY}:${featureId}`;
    }
}
