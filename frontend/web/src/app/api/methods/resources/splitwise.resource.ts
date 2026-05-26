import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { ISplitrEvent } from '@pages/main/splitwise/events/events'; // TODO: change import to be from types
import { IEnumResponse, IStandardResponse, SplitwiseSquad } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class SplitwiseResource {
  getOrderCategoryTags = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.orderTags),
  }));

  getUserSplitwiseSquads = httpResource<IStandardResponse<SplitwiseSquad[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.squads),
  }));

  getUserSplitrEvents = httpResource<IStandardResponse<ISplitrEvent[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.splitwise),
  }));
}
