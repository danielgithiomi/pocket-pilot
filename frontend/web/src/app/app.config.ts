import { routes } from './app.routes';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  ErrorInterceptor,
  RequestInterceptor,
  ResponseInterceptor,
} from '@infrastructure/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([RequestInterceptor, ErrorInterceptor, ResponseInterceptor]),
    ),
  ],
};
