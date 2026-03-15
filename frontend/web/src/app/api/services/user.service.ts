import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastService } from '@atoms/toast';
import { IStandardError } from '@global/types';
import { IRegisterRequest } from '@global/types';
import { UserMutation } from '@methods/mutations';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly mutation = inject(UserMutation);
  private readonly toastService = inject(ToastService);

  register(request: IRegisterRequest) {
    return this.mutation.register(request).pipe(
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
