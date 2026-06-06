import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { FeatureDto, FeaturePayload, UpdateFeatureStatusPayload } from '../dto/features.dto';

@Injectable()
export class FeaturesRepository {
    constructor(private readonly db: DatabaseService) {}

    createFeatureRequest(userId: string, payload: FeaturePayload): Promise<FeatureDto> {
        return this.db.feature.create({
            data: {
                ...payload,
                authorId: userId,
            },
            include: {
                featureVotes: true,
            },
        });
    }

    getFeatureRequests(): Promise<FeatureDto[]> {
        return this.db.feature.findMany({ include: { featureVotes: true }, orderBy: { createdAt: 'desc' } });
    }

    getUserFeatureRequests(userId: string): Promise<FeatureDto[]> {
        return this.db.feature.findMany({
            where: { authorId: userId },
            include: { featureVotes: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    updateFeatureStatusById(featureId: string, payload: UpdateFeatureStatusPayload): Promise<FeatureDto> {
        const { featureStatus } = payload;

        return this.db.feature.update({
            where: { id: featureId },
            data: { featureStatus },
            include: { featureVotes: true },
        });
    }

    deleteFeatureRequestById(featureId: string): Promise<FeatureDto> {
        return this.db.feature.delete({ where: { id: featureId }, include: { featureVotes: true } });
    }
}
