import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { CreateTransactionRequest, IStandardResponse, TransactionWithAccount } from '@global/types';

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
}
