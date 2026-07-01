import { FeatureDto, FeatureWithUser } from '../dto/features.dto';

export function flattenFeature(feature: FeatureWithUser): FeatureDto {
    const {
        user: { name: authorName },
        _count: { featureVotes: votesCount, featureComments: commentsCount },
        ...rest
    } = feature;

    return {
        ...rest,
        authorName,
        commentsCount,
        upvoteCount: votesCount
    };
}
