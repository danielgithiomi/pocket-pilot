import {FeatureCategoryEnum, FeatureStatusEnum} from "../enums";

// PAYLOADS
export interface FeaturePayload {
    featureTitle: string;
    featureContent: string;
    featureCategory: FeatureCategoryEnum;
}

export interface FeatureCommentPayload {
    comment: string;
    featureId: string;
}

// RESPONSES
export interface FeatureVote {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    featureId: string;
}

export interface FeatureComment {
    id: string;
    createdAt: Date;
    comment: string;
    featureId: string;
    authorName: string;
    authorProfilePictureUrl?: string;
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
