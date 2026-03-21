import { inject } from '@angular/core';
import { ApiClient } from '../api-client';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import {
  IAuthResponse,
  IRegisterRequest,
  IStandardResponse,
  IUpdateUserRequest,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class UserMutation {
  private readonly client = inject(ApiClient);

  register(request: IRegisterRequest) {
    return this.client.post<IAuthResponse, IRegisterRequest>(endpoints.register, request);
  }

  update(userId: string, payload: IUpdateUserRequest) {
    return this.client.put<IStandardResponse<IAuthResponse>, IUpdateUserRequest>(
      `users/${userId}`,
      payload,
    );
  }
}
