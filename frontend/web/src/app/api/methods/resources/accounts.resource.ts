import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
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
  accountTypes = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.account_types),
  }));

  userAccounts = httpResource<IStandardResponse<UserAccountsWithCount>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.accounts),
  }));

  accountById = (accountId: string) =>
    httpResource<IStandardResponse<AccountWithTransactions>>(() => {
      const url = `accounts/${accountId}`;
      return {
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(url),
      };
    });

  accountWithTransactions = (accountId: string) =>
    httpResource<IStandardResponse<AccountWithTransactions>>(() => {
      const url = `accounts/${accountId}/all-transactions`;
      return {
        method: 'GET',
        cache: 'no-cache',
        url: concatUrl(url),
      };
    });
}
