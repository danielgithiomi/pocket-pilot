import { catchError, EMPTY } from 'rxjs';
import { AuthService } from './auth.service';
import { AccountsResource } from '@methods/resources';
import { AccountsMutation } from '@methods/mutations';
import { STORED_AUTH_USER_KEY } from '@libs/constants';
import { ToastService } from '@components/ui/atoms/toast';
import { computed, inject, Injectable } from '@angular/core';
import { CreateAccountRequest, IStandardError, User } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly accountsMutation = inject(AccountsMutation);
  private readonly accountsResource = inject(AccountsResource);

  private readonly storedUser = computed<User>(() => this.authService.user()!);

  getMaximumSpendingLimit() {
    return this.storedUser().userPreferences.monthlySpendingLimit;
  }

  getDefaultCurrency() {
    return this.storedUser().userPreferences.defaultCurrency;
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
