import { AuthService } from './auth.service';
import { catchError, EMPTY, map } from 'rxjs';
import { AccountsResource } from '@methods/resources';
import { AccountsMutation } from '@methods/mutations';
import { ToastService } from '@components/ui/atoms/toast';
import { computed, inject, Injectable } from '@angular/core';
import {
  User,
  IStandardError,
  IStandardResponse,
  CreateAccountRequest,
  IVoidResourceResponse,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly accountsMutation = inject(AccountsMutation);
  private readonly accountsResource = inject(AccountsResource);

  private readonly storedUser = computed<User>(() => this.authService.user()!);

  getMonthlySpendingLimit() {
    return this.storedUser().userPreferences.monthlySpendingLimit;
  }

  getDefaultCurrency() {
    return this.storedUser().userPreferences.defaultCurrency;
  }

  getAccountTypes() {
    return this.accountsResource.accountTypes;
  }

  getAccountWithItsTransactionsById(accountId: string) {
    return this.accountsResource.accountWithTransactions(accountId);
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
      map((response: IStandardResponse<IVoidResourceResponse>) => response.data),
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
