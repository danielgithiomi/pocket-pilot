import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { concatUrl } from '@methods/methods.utils';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IEnumResponse, IStandardResponse, TransactionsWithAccountWithCount } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionsResource {
  allTransactions = httpResource<IStandardResponse<TransactionsWithAccountWithCount>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.all_transactions),
  }));

  userTransactions = httpResource<IStandardResponse<TransactionsWithAccountWithCount>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.user_transactions),
  }));

  transactionTypes = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.transaction_types),
  }));

  transactionCategories = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.transaction_categories),
  }));
}
