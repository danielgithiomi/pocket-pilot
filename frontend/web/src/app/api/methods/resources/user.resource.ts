import { User } from '@global/types';
import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserResource {

  readonly rootResource = httpResource(() => ({
    method: 'GET',
    url: concatUrl(),
  }));

  readonly me = httpResource<User>(() => ({
    method: 'GET',
    credentials: 'include',
    url: concatUrl('auth/me'),
  }));
}
