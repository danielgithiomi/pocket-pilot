import player from 'lottie-web';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  ErrorInterceptor,
  RequestInterceptor,
  ResponseInterceptor,
} from '@infrastructure/interceptors';

// function initializeAuth(authService: AuthService) {
//   return () => authService.initializeSession();
// }

export const AppConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideCacheableAnimationLoader(),
    provideBrowserGlobalErrorListeners(),
    provideLottieOptions({ player: () => player }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([RequestInterceptor, ResponseInterceptor, ErrorInterceptor]),
    ),
  ],
};
