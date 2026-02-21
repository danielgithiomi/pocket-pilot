import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  
  login() {
    console.log('Login service');
    this.http.get<string>(`${environment.API_BASE_URL}`).pipe(
      tap((response) => {
        console.log(response);
      }),
    ).subscribe();
  }
}
