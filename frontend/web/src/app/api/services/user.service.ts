import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { ToastService } from '@atoms/toast';
import { UserMutation } from '@methods/mutations';
import { STORED_ONBOARDING_USER_KEY } from '@libs/constants';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';
import {
  User,
  IStandardError,
  IRegisterRequest,
  IStandardResponse,
  IUpdateUserRequest,
  IVoidResourceResponse,
  IChangePasswordRequest,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly mutation = inject(UserMutation);
  private readonly toastService = inject(ToastService);

  register(request: IRegisterRequest) {
    return this.mutation.register(request).pipe(
      map((response: IStandardResponse<User>) => response.data),
      tap((user: User) => {
        localStorage.setItem(STORED_ONBOARDING_USER_KEY, JSON.stringify(!user.isOnboarded));
      }),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  update(userId: string, payload: IUpdateUserRequest): Observable<User> {
    return this.mutation.update(userId, payload).pipe(
      map((response: IStandardResponse<User>) => response.data),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  changePassword(
    userId: string,
    payload: IChangePasswordRequest,
  ): Observable<IVoidResourceResponse> {
    return this.mutation.changePassword(userId, payload).pipe(
      map((response: IStandardResponse<IVoidResourceResponse>) => response.data),
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      details: details as string,
      variant: 'error',
    });
  };
}
