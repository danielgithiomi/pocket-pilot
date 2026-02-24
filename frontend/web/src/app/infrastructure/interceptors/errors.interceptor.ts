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

      // SERVER ERROR
      if(error.status.toString().startsWith('5')){
        return throwError(() => ({
          title: 'SERVER_ERROR',
          statusCode: error.status || 500,
          details: 'A server error occurred. Please contact support for assistance!'
        }))
      }

      // Network / CORS / unknown errors
      return throwError(() => ({
        title: 'NETWORK_ERROR',
        statusCode: error.status,
        details: 'An network error occurred. Ensure you have an internet connection!',
        // details: error.message || 'Network error',
      }));
    }),
  );
};
