import { catchError, EMPTY } from 'rxjs';
import { ToastService } from '@atoms/toast';
import { AuthMutation } from '@methods/mutations';
import { inject, Injectable } from '@angular/core';
import { ILoginRequest, IStandardError } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly mutation = inject(AuthMutation);
  private readonly toastService = inject(ToastService);

  login(request: ILoginRequest) {
    return this.mutation.login(request).pipe(
      catchError((error: IStandardError) => {
        this.renderToast(error);
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    console.log(error);
    this.toastService.show({
      title,
      details: details as string,
      variant: 'error',
    });
  };
}
