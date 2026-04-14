import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@atoms/toast';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@api/auth.service';
import { IGlobalException, IStandardError } from '@global/types';
import { CLEAR_SESSION_ERROR_NAME, WEB_ROUTES } from '@global/constants';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = error.error as IGlobalException;

      if (apiError && apiError.success === false) {
        return throwError(() => {
          if (!apiError.error) {
            return {
              type: 'unexpected',
              statusCode: apiError.statusCode,
              title: 'An unexpected error occurred',
              details: 'No error object found in the response!',
            } satisfies IStandardError;
          }

          const { name, title, type, details } = apiError.error;

          if (name && CLEAR_SESSION_ERROR_NAME[name]) {
            authService.clearSession();
            router.navigateByUrl(WEB_ROUTES.login);

            toastService.show({
              variant: 'warning',
              title: 'Please login again!',
              details: 'You were redirected because your session has expired.',
            });

            return {
              type,
              details: 'Your user session has expired! Please login again.',
              statusCode: 401,
              title: 'Session Expired!',
            } satisfies IStandardError;
          }

          return {
            type: type,
            details: details,
            statusCode: apiError.statusCode,
            title: title ?? 'An unexpected error occurred',
          } satisfies IStandardError;
        });
      }

      // SERVER ERROR
      if (error.status.toString().startsWith('5')) {
        return throwError(() => ({
          title: 'SERVER_ERROR',
          statusCode: error.status || 500,
          details: 'A server error occurred. Please contact support for assistance!',
        }));
      }

      // Network / CORS / unknown errors
      return throwError(() => ({
        title: 'NETWORK_ERROR',
        statusCode: error.status,
        details: 'An network error occurred. Ensure you have an internet connection!',
      }));
    }),
  );
};
