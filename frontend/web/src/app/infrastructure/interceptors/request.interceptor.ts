import { HttpInterceptorFn } from '@angular/common/http';

export const RequestInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    responseType: 'json',
    withCredentials: true,
    reportProgress: false,
    credentials: 'include',
    setHeaders: {
      'X-App-Version': '1.0.0',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return next(cloned);
};
