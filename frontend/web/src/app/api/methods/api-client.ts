import { Observable } from 'rxjs';
import { IStandardResponse } from '@global/types';
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
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.get<T>(url, {
      params: new HttpParams({ fromObject: params || {} }),
    });
  }

  post<T, B>(endpoint: string, body: B): Observable<IStandardResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post<IStandardResponse<T>>(url, body);
  }

  put<T, B>(endpoint: string, body: B): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<T>(url, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<T>(url);
  }
}
