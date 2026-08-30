import { Categories } from '@shared/types';
import { Injectable } from '@angular/core';
import { IStandardResponse } from '@shared/types';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@shared/constants';

@Injectable({
    providedIn: 'root'
})
export class CategoriesResource {
    readonly getUserCategories = httpResource<IStandardResponse<Categories>>(() => ({
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(endpoints.categories)
    }));
}
