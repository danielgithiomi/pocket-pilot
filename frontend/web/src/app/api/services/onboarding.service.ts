import { ToastService } from '@atoms/toast';
import { AuthService } from './auth.service';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { OnboardingMutation } from '@methods/mutations';
import { IStandardError, IStandardResponse, OnboardingPayload, User } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly mutation = inject(OnboardingMutation);

  onboardUser(payload: OnboardingPayload) {
    return this.mutation.onboardUser(payload).pipe(
      map((response: IStandardResponse<User>) => response.data),
      tap((user: User) => {
        console.log('login user', user);
        this.authService.createSession(user);
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
