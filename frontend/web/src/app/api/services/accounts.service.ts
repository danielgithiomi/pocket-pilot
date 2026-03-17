import { inject, Injectable } from '@angular/core';
import { AccountsResource } from '@methods/resources/accounts.resource';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly accountsResource = inject(AccountsResource);

  getUserWallets() {
    return this.accountsResource.userAccounts;
  }
}
