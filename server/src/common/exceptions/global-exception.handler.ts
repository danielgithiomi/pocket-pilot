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

import { randomUUID } from 'crypto';
import { IGlobalError } from '@common/types';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        // Determine if the exception is an HttpException
        const isHttpException = exception instanceof HttpException;

        // =========================
        // NON-HTTP EXCEPTIONS
        // =========================
        if (!isHttpException) {
            const anyException = exception as any;
            const upstreamError = anyException?.response?.data?.error;
            const nativeError = exception instanceof Error ? exception : undefined;

            const name = upstreamError?.name ?? upstreamError?.code ?? nativeError?.name ?? undefined;
            const message = upstreamError?.message ?? nativeError?.message ?? 'An unexpected error occurred';
            const details = upstreamError?.details ?? undefined;
            const type = upstreamError?.type ?? 'Internal Server Error';
            const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

            return response.status(statusCode).json({
                success: false,
                statusCode,
                error: {
                    type,
                    name,
                    message,
                    details,
                },
                metadata: {
                    endpoint: request.url,
                    timestamp: new Date().toISOString(),
                    requestId: randomUUID(),
                },
            } as IGlobalError);
        }

        // =========================
        // HTTP EXCEPTIONS (NestJS)
        // =========================
        const castException = exception as HttpException;
        const statusCode = castException.getStatus();
        const exceptionResponse = castException.getResponse();

        // Extract structured information
        let name: string | undefined;
        let title: string | undefined;
        let message: string | undefined;
        let details: unknown;
        let type: string;

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
            type = castException.name;
            name = exceptionResponse;
        } else if (typeof exceptionResponse === 'object') {
            const err = exceptionResponse as any;
            name = err.name ?? err.code ?? undefined;
            title = err.title ?? 'Internal Http Exception Error';
            message = err.message ?? 'An unexpected error occurred';
            details = err.details;
            type = castException.name;
        } else {
            type = castException.name;
            message = 'An unexpected error occurred';
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            error: {
                type,
                name,
                title,
                message,
                details,
            },
            metadata: {
                endpoint: request.url,
                timestamp: new Date().toISOString(),
                requestId: randomUUID(),
            },
        } as IGlobalError);
    }
}
