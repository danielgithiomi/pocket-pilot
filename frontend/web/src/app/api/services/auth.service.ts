import { ILoginRequest } from '@global/types';
import { AuthMutation } from '@methods/mutations';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private readonly mutation = inject(AuthMutation)

  login(request: ILoginRequest) {
    console.log('Login service');
    this.mutation.login(request).subscribe((response) => {
      console.log("Service: ", response);
    });
  }
}
