import { inject } from '@angular/core';
import { ApiClient } from '../api-client';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { IRegisterRequest, IAuthResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class UserMutation {
  private readonly client = inject(ApiClient);

  register(request: IRegisterRequest) {
    return this.client.post<IAuthResponse, IRegisterRequest>(endpoints.register, request);
  }
}
