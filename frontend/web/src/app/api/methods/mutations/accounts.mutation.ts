import { Observable } from 'rxjs';
import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import {
    Account,
    IStandardResponse,
    UpdateAccountPayload,
    CreateAccountPayload,
    IVoidResourceResponse,
    UpdateAccountBalanceVisibilityPayload,
} from '@global/types';

@Injectable({
    providedIn: 'root',
})
export class AccountsMutation {
    private readonly client = inject(ApiClient);

    createAccount(payload: CreateAccountPayload): Observable<IStandardResponse<Account>> {
        return this.client.post<Account, CreateAccountPayload>(endpoints.accounts, payload);
    }

    updateAccountById(
        accountId: string,
        payload: UpdateAccountPayload,
    ): Observable<IStandardResponse<Account>> {
        return this.client.put<Account, UpdateAccountPayload>(
            `${endpoints.accounts}/${accountId}`,
            payload,
        );
    }

    updateAccountBalanceVisibilityById(
        accountId: string,
        payload: UpdateAccountBalanceVisibilityPayload,
    ): Observable<IStandardResponse<Account>> {
        return this.client.patch<Account, UpdateAccountBalanceVisibilityPayload>(
            `${endpoints.accounts}/${accountId}/visibility`,
            payload,
        );
    }

    deleteAccountById(accountId: string): Observable<IStandardResponse<IVoidResourceResponse>> {
        return this.client.delete<IVoidResourceResponse>(`${endpoints.accounts}/${accountId}`);
    }
}
