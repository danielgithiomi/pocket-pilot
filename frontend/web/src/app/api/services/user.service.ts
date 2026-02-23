import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { IRegisterRequest } from '@global/types';
import { UserMutation } from '@methods/mutations';
import { UserResource } from '@methods/resources';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly resource = inject(UserResource);
  private readonly mutation = inject(UserMutation);
  
  root() {
    const me = this.resource.rootResource;
    console.log(me.value());
    return me.value();
  }

  register(request: IRegisterRequest) {
    return this.mutation.register(request).subscribe((response) => {
      console.log("Service: ", response);
    });
  }
}
