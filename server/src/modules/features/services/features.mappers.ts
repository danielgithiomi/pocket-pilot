import { FeatureDto, FeatureWithUser } from '../dto/features.dto';

export function flattenFeature(feature: FeatureWithUser): FeatureDto {
    console.log('Logging feature from mapper: ', feature);

    const {
        user: { name: authorName },
        _count: { featureVotes: votesCount, featureComments: commentsCount },
        ...rest
    } = feature;

    const revised = {
        ...rest,
        authorName,
        commentsCount,
        upvoteCount: votesCount
    };

    console.log('Logging revised feature from mapper: ', revised);

    return revised;
}
