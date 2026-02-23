import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '@environments/environment';

const BASE_URL = environment.API_BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class UserResource {

  readonly rootResource = httpResource(() => ({
    url: `${BASE_URL}`,
    method: 'GET',
  }));
  
}
