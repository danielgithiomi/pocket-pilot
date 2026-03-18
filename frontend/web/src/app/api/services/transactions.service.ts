import { inject, Injectable } from '@angular/core';
import { TransactionsResource } from '@methods/resources';
import { ToastService } from '@components/ui/atoms/toast';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly toastService = inject(ToastService);
  private readonly transactionsResource = inject(TransactionsResource);

  getAllTransactions() {
    return this.transactionsResource.allTransactions;
  }

  getTransactionTypes() {
    return this.transactionsResource.transactionTypes;
  }

  getTransactionCategories() {
    return this.transactionsResource.transactionCategories;
  }
}
