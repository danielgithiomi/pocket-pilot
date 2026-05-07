import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IStandardResponse, SplitwiseSquad } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class SplitwiseResource {
  getUserSplitwiseSquads = httpResource<IStandardResponse<SplitwiseSquad[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.squads),
  }));
}
