import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private readonly http = inject(HttpClient);

  login() {
    console.log('Login service');
    console.log(environment.API_BASE_URL);
  }
};
