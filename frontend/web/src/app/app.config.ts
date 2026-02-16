import {routes} from './app.routes';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding())
  ]
};
