import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import {
  IVoidResourceResponse,
  TransactionWithAccount,
  CreateTransactionRequest,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionsMutation {
  private readonly client = inject(ApiClient);

  createTransaction(accountId: string, payload: CreateTransactionRequest) {
    return this.client.post<TransactionWithAccount, CreateTransactionRequest>(
      `accounts/${accountId}/transactions`,
      payload,
    );
  }

  deleteTransaction(accountId: string, transactionId: string) {
    return this.client.delete<IVoidResourceResponse>(
      `accounts/${accountId}/transactions/${transactionId}`,
    );
  }
}
