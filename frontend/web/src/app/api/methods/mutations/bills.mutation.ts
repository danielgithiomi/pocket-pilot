import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { Bill, CreateBillPayload } from '@global/types';
import { API_ENDPOINTS as endpoints } from '@global/constants';

@Injectable({
  providedIn: 'root',
})
export class BillsMutation {
  private readonly client = inject(ApiClient);

  createNewUserBill(payload: CreateBillPayload) {
    return this.client.post<Bill, CreateBillPayload>(endpoints.user_bills, payload);
  }
}
