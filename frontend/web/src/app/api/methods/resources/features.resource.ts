import { Injectable, Signal } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import {
    Feature,
    FeaturesWithCount,
    IEnumResponse,
    IStandardResponse,
    FeatureWithComments,
    FeatureComment
} from '@global/types';

@Injectable({ providedIn: 'root' })
export class FeaturesResource {
    getFeatureStatus = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.feature_status)
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

    getFeatureRequestWithComments = (featureId: string) => {
        // /features/:featureId/comments
        const endpoint = `${endpoints.features}/${featureId}/comments`;

        return httpResource<IStandardResponse<FeatureWithComments>>(() => ({
            method: 'GET',
            cache: 'no-cache',
            url: concatUrl(endpoint)
        }));
    };

    getAllCommentsAssociatedWithFeature = (featureId: Signal<string>) =>
        httpResource<IStandardResponse<FeatureComment[]>>(() => {
            // /features/:featureId/comments
            const endpoint = `${endpoints.features}/${featureId()}/comments`;

            return {
                method: 'GET',
                cache: 'no-cache',
                url: concatUrl(endpoint)
            };
        });
}
