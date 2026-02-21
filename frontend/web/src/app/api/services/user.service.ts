import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { UserResource } from '@methods/resources/user.resource';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly resource = inject(UserResource);
  
  root() {
    const me = this.resource.rootResource;
    console.log(me.value());
    return me.value();
  }
}
