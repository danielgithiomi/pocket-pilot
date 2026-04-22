import { ToastService } from '@atoms/toast';
import { AuthService } from './auth.service';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PreferencesMutation } from '@methods/mutations';
import {
  IStandardError,
  IStandardResponse,
  IVoidResourceResponse,
  UpdateUserPreferencesPayload,
} from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly mutation = inject(PreferencesMutation);

  updateUserPreferences(payload: UpdateUserPreferencesPayload) {
    return this.mutation.updateUserPreferences(payload).pipe(
      tap(() => this.authService.reinitializeSession()),
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
