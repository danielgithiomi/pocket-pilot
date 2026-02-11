import { ApiProperty } from '@nestjs/swagger';

export const JWT_REFRESH_TOKEN_VALIDITY_DAYS: number = 7;
export const JWT_ACCESS_TOKEN_VALIDITY_MINUTES: number = 60;

export const RAW_RESPONSE_REFLECTOR_KEY = 'RAW_RESPONSE';
export const RESPONSE_SUMMARY_REFLECTOR_KEY = 'WRAPPED_RESPONSE';

// TOKENS
export interface RequestCookies {
    access_token: string;
    refresh_token: string;
}

// RESPONSE SUMMARY
export interface ResponseSummary {
    message: string;
    description?: string;
}

// RESPONSE STRUCTURE
export class MessageResponse {
    @ApiProperty({ description: 'Message', example: 'User logged out successfully.' })
    message!: string;
}

export interface IGlobalInterceptor<T> {
    body: T;
    success: true;
    statusCode: number;
    summary: ResponseSummary;
    metadata: {
        endpoint: string;
        timestamp: string;
        requestId: string;
    };
}

// EXCEPTION STRUCTURE
export interface IGlobalExceptionFilter {
    success: false;
    statusCode: number;
    error: {
        type: string;
        name?: string;
        message?: string;
        details?: unknown;
    };
    metadata: {
        endpoint: string;
        timestamp: string;
        requestId: string;
    };
}
