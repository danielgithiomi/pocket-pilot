import { Observable } from 'rxjs';
import { VoteVariantEnum } from '@global/enums';
import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { Feature, FeaturePayload, FeatureVotePayload, IStandardResponse, IVoidResourceResponse } from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class FeaturesMutation {
    private readonly client = inject(ApiClient);

    createNewFeature(payload: FeaturePayload) {
        return this.client.post<Feature, FeaturePayload>(endpoints.features, payload);
    }

    voteOnFeatureById(featureId: string, voteVariant: VoteVariantEnum): Observable<IStandardResponse<Feature>> {
        const url = `${endpoints.feature_votes}/${featureId}`;
        const payload: FeatureVotePayload = { voteVariant };
        return this.client.post<Feature, FeatureVotePayload>(url, payload);
    }

    deleteFeatureRequestById(featureId: string) {
        const url = `${endpoints.features}/${featureId}`;
        return this.client.delete<IVoidResourceResponse>(url);
    }
}
