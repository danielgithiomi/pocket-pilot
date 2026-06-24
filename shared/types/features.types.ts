import {FeatureCategoryEnum, FeatureStatusEnum} from "../enums";

// PAYLOADS
export interface FeaturePayload {
    featureTitle: string;
    featureContent: string;
    featureCategory: FeatureCategoryEnum;
}

// RESPONSES
export interface FeatureVote {
    id: string;
    userId: string;
    featureId: string;
    createdAt: Date;
    updatedAt: Date;
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
    commentsCount: number;
    featureContent: string;
    featureStatus: FeatureStatusEnum;
    featureCategory: FeatureCategoryEnum;

    featureVotes: FeatureVote[];
}

export interface FeatureWithComments extends Feature {
    featureComments: FeatureComment[];
}

export interface FeaturesWithCount {
    count: number;
    features: Feature[];
}

export interface FeatureServiceConstants {
    featureStatuses: FeatureStatusEnum[];
    featureCategories: FeatureCategoryEnum[];
}
