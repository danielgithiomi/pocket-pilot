import { AuthService } from '@api/auth.service';
import { concatUrl } from '@methods/methods.utils';
import { inject, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import {
  IEnumResponse,
  IStandardResponse,
  UserAccountsWithCount,
  AccountWithTransactions,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsResource {
  private readonly authService: AuthService = inject(AuthService);

  accountTypes = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.account_types),
  }));

  userAccounts = httpResource<IStandardResponse<UserAccountsWithCount>>(() => {
    const user = this.authService.user();

    if (!user) return undefined;

    return {
      method: 'GET',
      cache: 'no-cache',
      url: concatUrl(endpoints.accounts),
    };
  });

  accountWithTransactions = (accountId: string) =>
    httpResource<IStandardResponse<AccountWithTransactions>>(() => {
      const url = `accounts/${accountId}`;
      return {
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(url),
      };
    });
}
