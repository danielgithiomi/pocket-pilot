import { HttpException, HttpStatus } from '@nestjs/common';

export interface LockedExceptionPayload {
    name: string;
    title: string;
    message: string;
    details?: unknown;
}

export class LockedException extends HttpException {
    constructor(payload: LockedExceptionPayload) {
        super(
            {
                statusCode: HttpStatus.LOCKED,
                name: payload.name,
                title: payload.title,
                message: payload.message,
                details: payload.details ?? null,
            },
            HttpStatus.LOCKED,
        );
    }
}
