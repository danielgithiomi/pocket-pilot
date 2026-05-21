import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IVoidResourceResponse, SplitwiseSquad, SplitwiseSquadPayload } from '@global/types';

@Injectable({
    providedIn: 'root',
})
export class SplitwiseMutation {
    private readonly client = inject(ApiClient);

    createNewSquad(payload: SplitwiseSquadPayload) {
        const endpoint = endpoints.squads;
        return this.client.post<SplitwiseSquad, SplitwiseSquadPayload>(endpoint, payload);
    }

    updateExistingUserSquad(squadId: string, payload: SplitwiseSquadPayload) {
        const endpoint = `${endpoints.squads}/${squadId}`;
        return this.client.put<SplitwiseSquad, SplitwiseSquadPayload>(endpoint, payload);
    }

    deleteExistingUserSquad(squadId: string) {
        const endpoint = `${endpoints.squads}/${squadId}`;
        return this.client.delete<IVoidResourceResponse>(endpoint);
    }
}
