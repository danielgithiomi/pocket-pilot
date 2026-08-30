import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@shared/constants';
import {
    SplitrSquad,
    SplitrEventPayload,
    SplitrSquadPayload,
    SettleSplitrPayload,
    IVoidResourceResponse,
    ISplitrEvent
} from '@shared/types';

@Injectable({
    providedIn: 'root'
})
export class SplitrMutation {
    private readonly client = inject(ApiClient);

    // SQUADS
    createNewSquad(payload: SplitrSquadPayload) {
        const endpoint = endpoints.squads;
        return this.client.post<SplitrSquad, SplitrSquadPayload>(endpoint, payload);
    }

    updateExistingUserSquad(squadId: string, payload: SplitrSquadPayload) {
        const endpoint = `${endpoints.squads}/${squadId}`;
        return this.client.put<SplitrSquad, SplitrSquadPayload>(endpoint, payload);
    }

    deleteExistingUserSquad(squadId: string) {
        const endpoint = `${endpoints.squads}/${squadId}`;
        return this.client.delete<IVoidResourceResponse>(endpoint);
    }

    // EVENTS
    createNewSplitrEvent(payload: SplitrEventPayload) {
        const endpoint = endpoints.splitr;
        return this.client.post<ISplitrEvent, SplitrEventPayload>(endpoint, payload);
    }

    markSplitrEventAsSettledOrPending(eventId: string, payload: SettleSplitrPayload) {
        const endpoint = `${endpoints.splitr}/${eventId}/settle`;
        return this.client.patch<IVoidResourceResponse, SettleSplitrPayload>(endpoint, payload);
    }

    deleteExistingSplitrEvent(eventId: string) {
        const endpoint = `${endpoints.splitr}/${eventId}`;
        return this.client.delete<IVoidResourceResponse>(endpoint);
    }
}
