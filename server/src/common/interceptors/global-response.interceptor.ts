/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access
*/

/**
 * Reason:
 * Global response interceptor intentionally operates on `unknown`
 */

import {CallHandler, ExecutionContext, Global, Injectable, NestInterceptor,} from '@nestjs/common';
import {Observable} from 'rxjs';
import {randomUUID} from 'crypto';
import {map} from 'rxjs/operators';
import {Reflector} from '@nestjs/core';
import {
    GlobalInterceptor,
    RAW_RESPONSE_REFLECTOR_KEY as raw_key,
    RESPONSE_SUMMARY_REFLECTOR_KEY as summary_key,
    ResponseSummary,
} from '@common/constants';

@Global()
@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<
    T,
    GlobalInterceptor<T>
> {
    constructor(private readonly reflector: Reflector) {
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<GlobalInterceptor<T>> {
        const isRaw = this.reflector.get<boolean>(raw_key, context.getHandler());

        if (isRaw) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return next.handle();
        }

        const cxt = context.switchToHttp();
        const request = cxt.getRequest();
        const response = cxt.getResponse();

        const summary = this.reflector.get<ResponseSummary>(
            summary_key,
            context.getHandler(),
        ) ?? {message: 'Operation Successful'};

        return next.handle().pipe(
            map((body) => ({
                success: true,
                statusCode: response.statusCode,
                body: body ?? {},
                summary: {
                    message: summary.message,
                    description: summary.description,
                },
                metadata: {
                    endpoint: request.url,
                    requestId: randomUUID(),
                    timestamp: new Date().toISOString(),
                },
            })),
        );
    }
}
