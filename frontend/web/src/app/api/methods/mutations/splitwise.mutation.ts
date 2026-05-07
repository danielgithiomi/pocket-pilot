import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { SplitwiseSquad, SplitwiseSquadPayload } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class SplitwiseMutation {
  private readonly client = inject(ApiClient);

  createNewSquad(payload: SplitwiseSquadPayload) {
    return this.client.post<SplitwiseSquad, SplitwiseSquadPayload>(endpoints.squads, payload);
  }
}
