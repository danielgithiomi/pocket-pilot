import { catchError, EMPTY, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { TransactionsResource } from '@methods/resources';
import { ToastService } from '@components/ui/atoms/toast';
import { TransactionsMutation } from '@methods/mutations';
import { CreateTransactionRequest, IStandardError } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly toastService = inject(ToastService);
  private readonly transactionsMutation = inject(TransactionsMutation);
  private readonly transactionsResource = inject(TransactionsResource);

  getAllTransactions() {
    return this.transactionsResource.allTransactions;
  }

  getUserTransactions() {
    return this.transactionsResource.userTransactions;
  }

  getTransactionTypes() {
    return this.transactionsResource.transactionTypes;
  }

  getTransactionCategories() {
    return this.transactionsResource.transactionCategories;
  }

  createTransaction(
    accountId: string,
    availableBalance: number,
    payload: CreateTransactionRequest,
  ) {
    // Give warning if transaction would result in negative balance
    if (this.isNegativeBalance(availableBalance, payload))
      this.toastService.show({
        variant: 'warning',
        title: 'Exceeding available balance!',
        details: 'This transaction would result in a negative account balance.',
      });

    return this.transactionsMutation.createTransaction(accountId, payload).pipe(
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  deleteTransaction(accountId: string, transactionId: string) {
    return this.transactionsMutation.deleteTransaction(accountId, transactionId).pipe(
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      details: details as string,
      variant: 'error',
    });
  };

  private isNegativeBalance(availableBalance: number, payload: CreateTransactionRequest) {
    return availableBalance > 0 && payload.amount > availableBalance && payload.type === 'EXPENSE';
  }
}
