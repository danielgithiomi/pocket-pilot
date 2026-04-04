import { AuthService } from '@api/auth.service';
import { Categories } from '@global/types';
import { IStandardResponse } from '@global/types';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';

@Injectable({
  providedIn: 'root',
})
export class CategoriesResource {
  private readonly authService: AuthService = inject(AuthService);

  getUserCategories = httpResource<IStandardResponse<Categories>>(() => {
    const user = this.authService.user();

    if (!user) return undefined;

    return {
      method: 'GET',
      url: concatUrl(endpoints.categories),
    };
  });
}
