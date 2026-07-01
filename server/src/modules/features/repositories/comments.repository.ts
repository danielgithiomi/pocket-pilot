import { Injectable } from '@nestjs/common';
import { FeatureCommentPayload, PrismaComment } from '../dto/comments.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class CommentsRepository {
    private readonly includedFields = {
        author: { select: { name: true, profilePictureKey: true } }
    };

    constructor(private readonly db: DatabaseService) {}

    addCommentToFeature(userId: string, featureId: string, payload: FeatureCommentPayload): Promise<PrismaComment> {
        const { comment } = payload;

        return this.db.featureComments.create({
            data: { userId, comment, featureId },
            include: this.includedFields
        });
    }

    getAllFeatureComments(userId: string, featureId: string) {
        return this.db.featureComments.findMany({
            where: { featureId },
            orderBy: { createdAt: 'desc' },
            include: this.includedFields
        });
    }
}
