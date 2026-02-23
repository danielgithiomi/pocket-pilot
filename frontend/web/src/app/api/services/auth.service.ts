import { catchError, EMPTY, of } from 'rxjs';
import { ILoginRequest, IStandardError } from '@global/types';
import { AuthMutation } from '@methods/mutations';
import { inject, Injectable } from '@angular/core';
import { ToastService } from '@components/ui/atoms/toast';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private readonly mutation = inject(AuthMutation)
  private readonly toastService = inject(ToastService)

  login(request: ILoginRequest) {
    return this.mutation.login(request).pipe(
      catchError((error: IStandardError) => {
        this.renderToast(error)
        return EMPTY;
      })
    );
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    this.toastService.show({
      title: error.message,
      message: error.details as string,
      variant: 'error',
    })
  }
}
