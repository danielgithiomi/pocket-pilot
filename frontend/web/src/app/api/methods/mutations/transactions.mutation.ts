import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import {
  IVoidResourceResponse,
  TransactionWithAccount,
  CreateTransactionRequest,
} from '@global/types';

interface NormalTransactionPayload {
  type: string;
  category: string;
  amount: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsMutation {
  private readonly client = inject(ApiClient);

  createTransaction(accountId: string, payload: CreateTransactionRequest) {
    const modifiedPayload: NormalTransactionPayload = {
      type: payload.type,
      amount: payload.amount!,
      category: payload.category,
      description: payload.description,
    };

    return this.client.post<TransactionWithAccount, NormalTransactionPayload>(
      `accounts/${accountId}/transactions`,
      modifiedPayload,
    );
  }

  createTransferTransaction(accountId: string, payload: CreateTransactionRequest) {
    return this.client.post<TransactionWithAccount, CreateTransactionRequest>(
      `accounts/${accountId}/transfer`,
      payload,
    );
  }

  deleteTransaction(accountId: string, transactionId: string) {
    return this.client.delete<IVoidResourceResponse>(
      `accounts/${accountId}/transactions/${transactionId}`,
    );
  }
}
