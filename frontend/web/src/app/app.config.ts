import player from 'lottie-web';
import { routes } from './app.routes';
import { AuthService } from '@api/auth.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  ErrorInterceptor,
  RequestInterceptor,
  ResponseInterceptor,
} from '@infrastructure/interceptors';

function initializeAuth(authService: AuthService) {
  return () => authService.initializeSession();
}

export const appConfig: ApplicationConfig = {
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
