import {routes} from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding())
  ]
};
