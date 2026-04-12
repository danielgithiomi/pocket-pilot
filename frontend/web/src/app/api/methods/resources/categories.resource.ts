import { Categories } from '@global/types';
import { Injectable } from '@angular/core';
import { IStandardResponse } from '@global/types';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';

@Injectable({
  providedIn: 'root',
})
export class CategoriesResource {
  getUserCategories = httpResource<IStandardResponse<Categories>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.categories),
  }));
}
