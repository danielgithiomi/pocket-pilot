import { map } from 'rxjs/operators';
import { IGlobalResponse, IStandardResponse } from '@global/types';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';

export const ResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        const response = event.body as IGlobalResponse<unknown>;

        // Only unwrap if it matches your backend contract
        if (response && response.success === true && 'body' in response) {
          const standardResponse: IStandardResponse<unknown> = {
            data: response.body,
            endpoint: response.metadata.endpoint,
            statusCode: response.statusCode,
            summary: response.summary,
          };

          return event.clone({
            body: standardResponse,
          });
        }
      }

      return event;
    }),
  );
};
