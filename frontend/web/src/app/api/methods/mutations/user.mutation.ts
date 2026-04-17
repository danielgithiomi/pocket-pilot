import { inject } from '@angular/core';
import { ApiClient } from '../api-client';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import {
  User,
  IRegisterRequest,
  IUpdateUserRequest,
  IVoidResourceResponse,
  IChangePasswordRequest,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class UserMutation {
  private readonly client = inject(ApiClient);

  register(request: IRegisterRequest) {
    return this.client.post<User, IRegisterRequest>(endpoints.register, request);
  }

  update(userId: string, payload: IUpdateUserRequest) {
    return this.client.put<User, IUpdateUserRequest>(`users/${userId}`, payload);
  }

  changePassword(userId: string, payload: IChangePasswordRequest) {
    return this.client.put<IVoidResourceResponse, IChangePasswordRequest>(
      `users/${userId}/change-password`,
      payload,
    );
  }
}
