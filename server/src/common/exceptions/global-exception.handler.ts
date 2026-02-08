/* eslint-disable
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-call
*/

/**
 * Reason:
 * Global exception filter intentionally operates on `unknown`
 * framework-level exception shapes (NestJS HttpException, validation errors).
 */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IGlobalExceptionFilter } from '@common/constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const isHttpException: boolean = exception instanceof HttpException;

        const statusCode = isHttpException
            ? (exception as HttpException).getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = isHttpException ? (exception as HttpException).getResponse() : null;

        const type = isHttpException ? (exception as HttpException).name : 'Internal Server Error';

        const name = typeof exceptionResponse === 'string' ? exceptionResponse : undefined;

        const message =
            typeof exceptionResponse === 'string'
                ? exceptionResponse
                : ((exceptionResponse as any)?.message ?? 'An unexpected error occurred');

        const details = typeof exceptionResponse === 'object' ? (exceptionResponse as any)?.details : undefined;

        response.status(statusCode).json({
            success: false,
            statusCode,
            error: {
                name,
                type,
                message,
                details,
            },
            metadata: {
                endpoint: request.url,
                timestamp: new Date().toISOString(),
                requestId: randomUUID(),
            },
        } as IGlobalExceptionFilter);
    }
}
