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

  uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
  ): Observable<IStandardResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const formData = new FormData();
    formData.append(fieldName, file);
    return this.http.post<IStandardResponse<T>>(url, formData, {
      cache: 'no-cache',
      reportProgress: true,
      credentials: 'include',
    });
  }

  put<T, B>(endpoint: string, body: B): Observable<IStandardResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<IStandardResponse<T>>(url, body);
  }

  delete<T>(endpoint: string): Observable<IStandardResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<IStandardResponse<T>>(url);
  }

  deleteWithBody<T, B>(endpoint: string, body: B): Observable<IStandardResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<IStandardResponse<T>>(url, { body });
  }
}
