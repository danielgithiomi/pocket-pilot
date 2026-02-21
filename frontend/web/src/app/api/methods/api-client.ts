import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      params: new HttpParams({ fromObject: params || {} }),
    });
  }

  post<T, B>(endpoint: string, body: B): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  put<T, B>(endpoint: string, body: B): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
