import { FeatureDto, FeatureWithUser } from '../dto/features.dto';

export function flattenFeature(feature: FeatureWithUser): FeatureDto {
    const {
        featureVotes,
        user: { name: authorName },
        ...rest
    } = feature;

    return {
        ...rest,
        authorName,
        featureVotes
    };
}
