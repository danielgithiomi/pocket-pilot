import { catchError, throwError } from 'rxjs';
import { IGlobalException, IStandardError } from '@global/types';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = error.error as IGlobalException;

      if (apiError && apiError.success === false) {
        console.log(apiError);
        return throwError(
          () =>
            ({
              statusCode: apiError.statusCode,
              title: apiError.error?.title ?? 'An unexpected error occurred',
              type: apiError.error?.type,
              details: apiError.error?.details,
            }) satisfies IStandardError,
        );
      }

      // Network / CORS / unknown errors
      return throwError(() => ({
        statusCode: error.status,
        message: error.message || 'Network error',
        type: 'NETWORK_ERROR',
      }));
    }),
  );
};
