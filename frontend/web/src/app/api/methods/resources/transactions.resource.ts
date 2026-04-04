import { AuthService } from '@api/auth.service';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IEnumResponse, IStandardResponse, TransactionsWithAccountWithCount } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionsResource {
  private readonly authService: AuthService = inject(AuthService);

  allTransactions = httpResource<IStandardResponse<TransactionsWithAccountWithCount>>(() => {
    const user = this.authService.user();
    if (!user) {
      return undefined;
    }
    return {
      method: 'GET',
      url: concatUrl(endpoints.all_transactions),
    };
  });

  userTransactions = httpResource<IStandardResponse<TransactionsWithAccountWithCount>>(() => {
    const user = this.authService.user();

    if (!user) return undefined;
    
    return {
      method: 'GET',
      url: concatUrl(endpoints.user_transactions),
    };
  });

  transactionTypes = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.transaction_types),
  }));
}
