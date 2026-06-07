import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { FeatureWithUser, FeaturePayload, UpdateFeatureStatusPayload } from '../dto/features.dto';

@Injectable()
export class FeaturesRepository {
    constructor(private readonly db: DatabaseService) {}

    createFeatureRequest(userId: string, payload: FeaturePayload): Promise<FeatureWithUser> {
        return this.db.feature.create({
            data: {
                ...payload,
                authorId: userId,
            },
            include: {
                featureVotes: true,
                user: { select: { name: true } },
            },
        });
    }

    getFeatureRequests(): Promise<FeatureWithUser[]> {
        return this.db.feature.findMany({
            orderBy: { createdAt: 'desc' },
            include: { featureVotes: true, user: { select: { name: true } } },
        });
    }

    getUserFeatureRequests(userId: string): Promise<FeatureWithUser[]> {
        return this.db.feature.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
            include: { featureVotes: true, user: { select: { name: true } } },
        });
    }

    updateFeatureStatusById(featureId: string, payload: UpdateFeatureStatusPayload): Promise<FeatureWithUser> {
        const { featureStatus } = payload;

        return this.db.feature.update({
            where: { id: featureId },
            data: { featureStatus },
            include: { featureVotes: true, user: { select: { name: true } } },
        });
    }

    deleteFeatureRequestById(featureId: string): Promise<FeatureWithUser> {
        return this.db.feature.delete({
            where: { id: featureId },
            include: { featureVotes: true, user: { select: { name: true } } },
        });
    }
}
