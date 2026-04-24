import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IEnumResponse, IStandardResponse, TransactionsWithAccountWithCount } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionsResource {
  allTransactions = httpResource<IStandardResponse<TransactionsWithAccountWithCount>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.all_transactions),
  }));

  userTransactions = httpResource<IStandardResponse<TransactionsWithAccountWithCount>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.user_transactions),
  }));

  transactionTypes = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    cache: 'no-cache',
    url: concatUrl(endpoints.transaction_types),
  }));
}
