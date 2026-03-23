import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import {
  IStandardResponse,
  TransactionWithAccount,
  CreateTransactionRequest,
  IVoidResourceResponse,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionsMutation {
  private readonly client = inject(ApiClient);

  createTransaction(accountId: string, payload: CreateTransactionRequest) {
    return this.client.post<IStandardResponse<TransactionWithAccount>, CreateTransactionRequest>(
      `accounts/${accountId}/transactions`,
      payload,
    );
  }

  deleteTransaction(accountId: string, transactionId: string) {
    return this.client.delete<IStandardResponse<IVoidResourceResponse>>(
      `accounts/${accountId}/transactions/${transactionId}`,
    );
  }
}
