import { Injectable } from '@nestjs/common';
import { AwsService } from '@modules/aws/aws.service';
import { mapPrismaCommentToDto } from '../mappers/comments.mappers';
import { CommentsRepository } from '../repositories/comments.repository';
import { FeatureCommentPayload, PrismaComment } from '../dto/comments.dto';

@Injectable()
export class CommentsService {
    constructor(
        private readonly awsService: AwsService,
        private readonly commentsRepository: CommentsRepository
    ) {}

    async addCommentToFeature(userId: string, featureId: string, payload: FeatureCommentPayload) {
        const comment: PrismaComment = await this.commentsRepository.addCommentToFeature(userId, featureId, payload);

        return await mapPrismaCommentToDto(comment, this.formatProfilePictureUrl);
    }

    async getAllFeatureComments(userId: string, featureId: string) {
        const prismaComments: PrismaComment[] = await this.commentsRepository.getAllFeatureComments(userId, featureId);

        return await Promise.all(
            prismaComments.map(async comment => await mapPrismaCommentToDto(comment, this.formatProfilePictureUrl))
        );
    }

    // HELPER FUNCTIONS
    private formatProfilePictureUrl = async (profilePictureKey: string | null) => {
        if (!profilePictureKey) return null;
        return await this.awsService.checkAndGenerateProfilePictureUrl(profilePictureKey);
    };
}
