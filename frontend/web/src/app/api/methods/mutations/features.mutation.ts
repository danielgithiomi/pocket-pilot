import { Observable } from 'rxjs';
import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { Feature, FeatureCommentPayload, FeaturePayload, IStandardResponse, IVoidResourceResponse } from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class FeaturesMutation {
    private readonly client = inject(ApiClient);

    // FEATURES
    createNewFeature(payload: FeaturePayload) {
        return this.client.post<Feature, FeaturePayload>(endpoints.features, payload);
    }

    toggleFeatureUpvoteById(featureId: string): Observable<IStandardResponse<Feature>> {
        // feature_votes/{featureId}
        const url = `${endpoints.feature_votes}/${featureId}`;
        return this.client.patch<Feature, {}>(url, {});
    }

    deleteFeatureRequestById(featureId: string) {
        // features/{featureId}
        const url = `${endpoints.features}/${featureId}`;
        return this.client.delete<IVoidResourceResponse>(url);
    }

    // COMMENTS
    addCommentToFeature(featureId: string, payload: FeatureCommentPayload): Observable<IStandardResponse<IVoidResourceResponse>> {
        // features/{featureId}/comments
        const url = `${endpoints.features}/${featureId}/comments`;
        return this.client.post<IVoidResourceResponse, FeatureCommentPayload>(url, payload);
    }
}
