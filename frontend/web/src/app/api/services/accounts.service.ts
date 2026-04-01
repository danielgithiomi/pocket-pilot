import { catchError, EMPTY } from 'rxjs';
import { AccountsResource } from '@methods/resources';
import { AccountsMutation } from '@methods/mutations';
import { ToastService } from '@components/ui/atoms/toast';
import { inject, Injectable, signal } from '@angular/core';
import { CreateAccountRequest, IStandardError } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly toastService = inject(ToastService);
  private readonly accountsMutation = inject(AccountsMutation);
  private readonly accountsResource = inject(AccountsResource);
  private readonly maximumSpendingLimit = signal<number>(60000);
  private readonly defaultCurrency: Intl.NumberFormatOptions['currency'] = 'MUR';

  getMaximumSpendingLimit() {
    return this.maximumSpendingLimit;
  }

  setMaximumSpendingLimit(limit: number) {
    this.maximumSpendingLimit.set(limit);
  }

  getDefaultCurrency() {
    return this.defaultCurrency;
  }

  getAccountTypes() {
    return this.accountsResource.accountTypes;
  }

  createNewAccount(payload: CreateAccountRequest) {
    return this.accountsMutation.createAccount(payload).pipe(
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  getUserAccounts() {
    return this.accountsResource.userAccounts;
  }

  deleteAccountById(accountId: string) {
    return this.accountsMutation.deleteAccountById(accountId).pipe(
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
}
