import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { Feature, FeaturePayload, IVoidResourceResponse } from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class FeaturesMutation {
    private readonly client = inject(ApiClient);

    createNewFeature(payload: FeaturePayload) {
        return this.client.post<Feature, FeaturePayload>(endpoints.features, payload);
    }

    deleteFeatureRequestById(featureId: string) {
        const url = `${endpoints.features}/${featureId}`;
        return this.client.delete<IVoidResourceResponse>(url);
    }
}
