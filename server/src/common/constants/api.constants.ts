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
