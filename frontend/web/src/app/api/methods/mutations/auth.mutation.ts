import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { ILoginRequest, ILoginResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AuthMutation {
  private readonly client = inject(ApiClient);

  login(request: ILoginRequest) {
    const response = this.client.post<ILoginResponse, ILoginRequest>('/auth/login', request);
    console.log('Methods: ', response);
    return response;
  }
}
