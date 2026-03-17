import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IStandardResponse, UserAccountsWithCount } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsResource {
  userAccounts = httpResource<IStandardResponse<UserAccountsWithCount>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.accounts),
  }));
}
