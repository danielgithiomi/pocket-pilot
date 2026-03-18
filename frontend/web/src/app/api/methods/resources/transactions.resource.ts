import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEnumResponse, IStandardResponse } from '@global/types';
import { concatUrl } from '@methods/methods.utils';
import { API_ENDPOINTS as endpoints } from '@global/constants';

@Injectable({
  providedIn: 'root',
})
export class TransactionsResource {
  allTransactions = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.all_transactions),
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
