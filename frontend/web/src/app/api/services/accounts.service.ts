import { catchError, EMPTY } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { AccountsResource } from '@methods/resources';
import { AccountsMutation } from '@methods/mutations';
import { STORED_AUTH_USER_KEY } from '@libs/constants';
import { ToastService } from '@components/ui/atoms/toast';
import { CreateAccountRequest, IStandardError, User } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly toastService = inject(ToastService);
  private readonly accountsMutation = inject(AccountsMutation);
  private readonly accountsResource = inject(AccountsResource);

  getUserFromLocalStorage(): User | null {
    const storedUser = localStorage.getItem(STORED_AUTH_USER_KEY);

    if (!storedUser) {
      this.renderToast({
        type: 'error',
        statusCode: 404,
        title: 'User not found!',
        details: 'No user found in the application local storage.',
      });
      return null;
    }
    return JSON.parse(storedUser);
  }

  getMaximumSpendingLimit() {
    const user = this.getUserFromLocalStorage();

    if (!user) return 0;

    return user.userPreferences.monthlySpendingLimit;
  }

  getDefaultCurrency() {
    const user = this.getUserFromLocalStorage();
    
    if (!user) return 'USD';

    return user.userPreferences.defaultCurrency;
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
