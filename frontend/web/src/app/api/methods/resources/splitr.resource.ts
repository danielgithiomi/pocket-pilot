import { Injectable } from '@angular/core';
import { ISplitrEvent } from '@global/types';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IEnumResponse, IStandardResponse, SplitrSquad } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class SplitrResource {
  getOrderCategoryTags = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.orderTags),
  }));

  // SQUADS
  getUserSplitrSquads = httpResource<IStandardResponse<SplitrSquad[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.squads),
  }));

  // EVENTS
  getUserSplitrEvents = httpResource<IStandardResponse<ISplitrEvent[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.splitr),
  }));

  getSplitrEventById = (eventId: string) => httpResource<IStandardResponse<ISplitrEvent>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(`${endpoints.splitr}/${eventId}`),
  }));
}
