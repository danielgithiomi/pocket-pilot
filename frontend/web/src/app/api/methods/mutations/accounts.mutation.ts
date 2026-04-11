import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import {
  Account,
  IStandardResponse,
  CreateAccountRequest,
  IVoidResourceResponse,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsMutation {
  private readonly client = inject(ApiClient);

  createAccount(payload: CreateAccountRequest) {
    return this.client.post<Account, CreateAccountRequest>(endpoints.accounts, payload);
  }

  deleteAccountById(accountId: string) {
    return this.client.delete<IVoidResourceResponse>(`${endpoints.accounts}/${accountId}`);
  }
}
