import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;
  
  get<T>(url: string) {
    return this.http.get<T>(`${this.baseUrl}/${url}`);
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(url, body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(url, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(url);
  }

}
