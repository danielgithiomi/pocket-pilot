import { ToastService } from '@atoms/toast';
import { inject, Injectable } from '@angular/core';
import { BillsMutation } from '@methods/mutations';
import { BillsResource } from '@methods/resources';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Bill, CreateBillPayload, IStandardError, IStandardResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private readonly resource = inject(BillsResource);
  private readonly mutation = inject(BillsMutation);
  private readonly toastService = inject(ToastService);

  getBillTypes = () => this.resource.getBillTypes;

  getUserBills = () => this.resource.getUserBills;

  createNewBill = (payload: CreateBillPayload): Observable<Bill> => {
    return this.mutation.createNewUserBill(payload).pipe(
      map((response: IStandardResponse<Bill>) => response.data),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  };

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      variant: 'error',
      details: details as string,
    });
  };
}
