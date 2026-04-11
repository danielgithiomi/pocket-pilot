import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { Bill, CreateBillPayload, IVoidResourceResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class BillsMutation {
  private readonly client = inject(ApiClient);

  createNewUserBill(payload: CreateBillPayload) {
    return this.client.post<Bill, CreateBillPayload>(endpoints.user_bills, payload);
  }

  deleteUserBillById(billId: string) {
    const url = `${endpoints.user_bills}/${billId}`;
    return this.client.delete<IVoidResourceResponse>(url);
  }
}
