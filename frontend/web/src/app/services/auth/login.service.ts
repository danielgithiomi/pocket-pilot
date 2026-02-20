import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  login() {
    console.log('Login service');
    console.log(environment.API_BASE_URL);
  }
};
