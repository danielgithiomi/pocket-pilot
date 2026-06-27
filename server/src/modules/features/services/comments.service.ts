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
        console.log(userId, featureId, payload);

        const comment: PrismaComment = await this.commentsRepository.addCommentToFeature(userId, featureId, payload);

        console.log(comment);

        const formatProfilePictureUrl = async (profilePictureKey: string | null) => {
            if (!profilePictureKey) return null;
            return await this.awsService.checkAndGenerateProfilePictureUrl(profilePictureKey);
        };

        return await mapPrismaCommentToDto(comment, formatProfilePictureUrl);
    }
}
