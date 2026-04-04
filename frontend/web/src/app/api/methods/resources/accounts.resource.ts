import { AuthService } from '@api/auth.service';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IEnumResponse, IStandardResponse, UserAccountsWithCount } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsResource {
  private readonly authService: AuthService = inject(AuthService);

  userAccounts = httpResource<IStandardResponse<UserAccountsWithCount>>(() => {
    const user = this.authService.user();

    if (!user) return undefined;

    return {
      method: 'GET',
      cache: 'no-cache',
      url: concatUrl(endpoints.accounts),
    };
  });

  accountTypes = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.account_types),
  }));
}
