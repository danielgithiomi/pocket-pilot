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

            const message = error.error?.error?.message ?? error?.message ?? '';

            if (apiError && apiError.success === false) {
                return throwError(() => {
                    if (!apiError.error) {
                        return {
                            type: 'unexpected',
                            statusCode: apiError.statusCode,
                            title: 'An unexpected error occurred',
                            details: message || 'No error object found in the response!',
                        } satisfies IStandardError;
                    }

                    const { name, title, type, details } = apiError.error;

                    if (name && CLEAR_SESSION_ERROR_NAME[name]) {
                        authService.clearSession();
                        router.navigateByUrl(WEB_ROUTES.login);

                        toastService.show({
                            variant: 'warning',
                            title: 'Session Timed Out!',
                            details:
                                'Your session expired and you were logged out. Please login again.',
                        });

                        return {
                            name,
                            type,
                            statusCode: 401,
                            title: 'Session Expired!',
                            details:
                                'Your session timed out and you were logged out. Please login again.',
                        } satisfies IStandardError;
                    }

                    return {
                        name,
                        details,
                        message,
                        type: type,
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

            // Network / CORS / downtime / unknown errors
            return throwError(() => ({
                title: 'CONNECTION_ERROR',
                statusCode: error.status,
                details:
                    'Unable to connect. The server may be unavailable or you may be offline. Please try again.',
            }));
        }),
    );
};
