import { Injectable } from '@angular/core';
import { UserResource as resource } from '@methods/resources';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  me() {
    return resource.root();
  }
}
