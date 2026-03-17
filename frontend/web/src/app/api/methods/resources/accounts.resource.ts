import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { IStandardResponse, UserAccountsWithCount } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsResource {
  userAccounts = httpResource<IStandardResponse<UserAccountsWithCount>>(() => ({
    method: 'GET',
    url: concatUrl('accounts'),
  }));
}
