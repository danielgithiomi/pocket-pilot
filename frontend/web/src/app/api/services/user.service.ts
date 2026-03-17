import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { ToastService } from '@atoms/toast';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthService } from '@api/auth.service';
import { IRegisterRequest } from '@global/types';
import { UserMutation } from '@methods/mutations';
import { IAuthResponse, IStandardError, IStandardResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly mutation = inject(UserMutation);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  register(request: IRegisterRequest) {
    return this.mutation.register(request).pipe(
      tap((response: IStandardResponse<IAuthResponse>) => {
        const { data } = response;
        this.authService.createSession(data);
        return response;
      }),
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
