import { routes } from './app.routes';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { CookiesInterceptor, ErrorInterceptor } from '@infrastructure/interceptors';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([CookiesInterceptor, ErrorInterceptor])),
  ],
};
