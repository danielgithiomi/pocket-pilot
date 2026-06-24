import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { FeaturePayload, FeatureWithUser, UpdateFeatureStatusPayload } from '../dto/features.dto';

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

    getFeatureRequestById(featureId: string): Promise<FeatureWithUser | null> {
        return this.db.feature.findUnique({
            where: { id: featureId },
            include: { featureVotes: true, user: { select: { name: true } } }
        });
    }

    toggleFeatureUpvoteById(userId: string, featureId: string): Promise<FeatureWithUser> {
        return this.db.$transaction(async trx => {
            const existingFeatureVote = await trx.featureVotes.findUnique({
                where: {
                    featureId_userId: { featureId, userId }
                }
            });

            if (!existingFeatureVote) {
                await trx.featureVotes.create({
                    data: {
                        userId,
                        featureId
                    }
                });

                return trx.feature.update({
                    where: { id: featureId },
                    data: {
                        featureScore: { increment: 1 },
                        upvoteCount: { increment: 1 }
                    },
                    include: { featureVotes: true, user: { select: { name: true } } }
                });
            }

            await trx.featureVotes.delete({
                where: {
                    featureId_userId: { featureId, userId }
                }
            });

            return trx.feature.update({
                where: { id: featureId },
                data: {
                    featureScore: { decrement: 1 },
                    upvoteCount: { decrement: 1 }
                },
                include: { featureVotes: true, user: { select: { name: true } } }
            });
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
