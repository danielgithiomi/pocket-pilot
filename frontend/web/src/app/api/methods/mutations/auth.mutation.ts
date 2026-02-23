import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { ILoginRequest, IAuthResponse } from '@global/types';
import { API_ENDPOINTS as endpoints } from '@global/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthMutation {
  private readonly client = inject(ApiClient);

  login(request: ILoginRequest) {
    return this.client.post<IAuthResponse, ILoginRequest>(endpoints.login, request);
  }
}
