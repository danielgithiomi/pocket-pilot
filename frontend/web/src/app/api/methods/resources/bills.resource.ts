import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IEnumResponse, IStandardResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class BillsResource {  
  getBillTypes = httpResource<IStandardResponse<IEnumResponse[]>>(() => ({
    method: 'GET',
    url: concatUrl(endpoints.bill_types),
  }));
}

