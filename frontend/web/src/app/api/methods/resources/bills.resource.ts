import { ApiClient } from '../api-client';
import { Injectable, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IEnumResponse, IStandardResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class BillsResource {
  private readonly client = inject(ApiClient);
  
  getBillTypes = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    url: endpoints.bill_types,
  }));
}
