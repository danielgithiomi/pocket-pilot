import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import {
    SplitwiseSquad,
    SettleSplitrPayload,
    IVoidResourceResponse,
    SplitwiseEventPayload,
    SplitwiseSquadPayload,
} from '@global/types';

@Injectable({
    providedIn: 'root',
})
export class SplitwiseMutation {
    private readonly client = inject(ApiClient);

    // SQUADS
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

    // EVENTS
    createNewSplitwiseEvent(payload: SplitwiseEventPayload) {
        const endpoint = endpoints.splitwise;
        return this.client.post<SplitwiseEventPayload, SplitwiseEventPayload>(endpoint, payload);
    }

    markSplitrEventAsSettled(eventId: string, payload: SettleSplitrPayload) {
        const endpoint = `${endpoints.splitwise}/${eventId}/settle`;
        return this.client.patch<IVoidResourceResponse, SettleSplitrPayload>(endpoint, payload);
    }

    deleteExistingSplitrEvent(eventId: string) {
        const endpoint = `${endpoints.splitwise}/${eventId}`;
        return this.client.delete<IVoidResourceResponse>(endpoint);
    }
}
