import { ToastService } from '@atoms/toast';
import { AuthService } from './auth.service';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { OnboardingMutation } from '@methods/mutations';
import { IStandardError, IGlobalResponse, OnboardingPayload, User } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly mutation = inject(OnboardingMutation);

  onboardUser(payload: OnboardingPayload) {
    return this.mutation.onboardUser(payload).pipe(
      map((response: IGlobalResponse<User>) => response.body),
      tap((user: User) => {
        this.authService.createSession(user);
        localStorage.removeItem('PP_ONBOARDING_USER');
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
