import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { FeatureWithUser, FeaturePayload, UpdateFeatureStatusPayload } from '../dto/features.dto';

@Injectable()
export class FeaturesRepository {
    private readonly FEATURE_REQUESTS_LIMIT = 5;

    constructor(private readonly db: DatabaseService) {}

    createFeatureRequest(userId: string, payload: FeaturePayload): Promise<FeatureWithUser> {
        return this.db.feature.create({
            data: {
                ...payload,
                authorId: userId
            },
            include: {
                featureVotes: true,
                user: { select: { name: true } }
            }
        });
    }

    getFeatureRequests(): Promise<FeatureWithUser[]> {
        return this.db.feature.findMany({
            include: { featureVotes: true, user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            take: this.FEATURE_REQUESTS_LIMIT
        });
    }

    getUserFeatureRequests(userId: string): Promise<FeatureWithUser[]> {
        return this.db.feature.findMany({
            where: { authorId: userId },
            include: { featureVotes: true, user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            take: this.FEATURE_REQUESTS_LIMIT
        });
    }

    updateFeatureStatusById(featureId: string, payload: UpdateFeatureStatusPayload): Promise<FeatureWithUser> {
        const { featureStatus } = payload;

        return this.db.feature.update({
            where: { id: featureId },
            data: { featureStatus },
            include: { featureVotes: true, user: { select: { name: true } } }
        });
    }

    deleteFeatureRequestById(featureId: string): Promise<FeatureWithUser> {
        return this.db.feature.delete({
            where: { id: featureId },
            include: { featureVotes: true, user: { select: { name: true } } }
        });
    }
}
