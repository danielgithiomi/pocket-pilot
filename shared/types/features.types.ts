import { VoteVariantEnum, FeatureCategoryEnum, FeatureStatusEnum } from "../enums/features.enums";

export interface FeatureVote {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    voteVariant: VoteVariantEnum;
}

export interface FeatureComment {
    id: string;
    createdAt: Date;
    comment: string;
}

export interface Feature {
    id: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    authorName: string;
    upvoteCount: number;
    featureTitle: string;
    featureScore: number;
    downvoteCount: number;
    featureContent: string;
    featureStatus: FeatureStatusEnum;
    featureCategory: FeatureCategoryEnum;

    featureVotes: FeatureVote[];
    featureComments: FeatureComment[];
}

export interface FeaturesWithCount {
    count: number;
    features: Feature[];
}

export interface FeatureServiceConstants {
    featureStatuses: FeatureStatusEnum[];
    featureVoteVariants: VoteVariantEnum[];
    featureCategories: FeatureCategoryEnum[];
}
