import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';
import { IStandardError } from '@global/types';
import { IRegisterRequest } from '@global/types';
import { UserMutation } from '@methods/mutations';
import { UserResource } from '@methods/resources';
import { ToastService } from '@components/ui/atoms/toast';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly resource = inject(UserResource);
  private readonly mutation = inject(UserMutation);
  private readonly toastService = inject(ToastService);

  root() {
    const me = this.resource.rootResource;
    console.log(me.value());
    return me.value();
  }

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
    this.toastService.show({
      title: error.title,
      message: error.details as string,
      variant: 'error',
    });
  };
}
