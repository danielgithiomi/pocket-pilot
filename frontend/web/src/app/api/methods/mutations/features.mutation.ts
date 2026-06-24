import { Observable } from 'rxjs';
import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { Feature, FeaturePayload, IStandardResponse, IVoidResourceResponse } from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class FeaturesMutation {
    private readonly client = inject(ApiClient);

    createNewFeature(payload: FeaturePayload) {
        return this.client.post<Feature, FeaturePayload>(endpoints.features, payload);
    }

    toggleFeatureUpvoteById(featureId: string): Observable<IStandardResponse<Feature>> {
        const url = `${endpoints.feature_votes}/${featureId}`;
        return this.client.patch<Feature, Record<string, never>>(url, {});
    }

    deleteFeatureRequestById(featureId: string) {
        const url = `${endpoints.features}/${featureId}`;
        return this.client.delete<IVoidResourceResponse>(url);
    }
}
