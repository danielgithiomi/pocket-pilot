import { Injectable } from '@angular/core';
import { ISplitrEvent } from '@shared/types';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { IStandardResponse, SplitrSquad } from '@shared/types';
import { API_ENDPOINTS as endpoints } from '@shared/constants';

@Injectable({
    providedIn: 'root'
})
export class SplitrResource {
    // SQUADS
    getUserSplitrSquads = httpResource<IStandardResponse<SplitrSquad[]>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.squads)
    }));

    // EVENTS
    getUserSplitrEvents = httpResource<IStandardResponse<ISplitrEvent[]>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.splitr)
    }));

    getSplitrEventById = (eventId: string) =>
        httpResource<IStandardResponse<ISplitrEvent>>(() => ({
            method: 'GET',
            cache: 'no-cache',
            url: concatUrl(`${endpoints.splitr}/${eventId}`)
        }));
}
