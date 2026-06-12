import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { Feature, FeaturesWithCount, IEnumResponse, IStandardResponse } from '@global/types';

@Injectable({ providedIn: 'root' })
export class FeaturesResource {
    getFeatureStatus = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.feature_status)
    }));

    getFeatureVoteVariants = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.feature_vote_variants)
    }));

    getFeatureCategories = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.feature_categories)
    }));

    getFeatureRequests = httpResource<IStandardResponse<FeaturesWithCount>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.features)
    }));

    getUserFeatureRequests = httpResource<IStandardResponse<Feature[]>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.user_features)
    }));
}
