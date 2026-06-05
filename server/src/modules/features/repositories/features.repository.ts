import { Injectable } from '@nestjs/common';
import { FeatureDto, FeaturePayload } from '../dto/features.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

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
        return this.db.feature.findMany({ include: { featureVotes: true } });
    }

    getUserFeatureRequests(userId: string): Promise<FeatureDto[]> {
        return this.db.feature.findMany({
            where: { authorId: userId },
            include: { featureVotes: true },
        });
    }
}
