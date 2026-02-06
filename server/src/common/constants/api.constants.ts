export const RAW_RESPONSE_REFLECTOR_KEY = 'RAW_RESPONSE';
export const RESPONSE_SUMMARY_REFLECTOR_KEY = 'WRAPPED_RESPONSE';

// RESPONSE SUMMARY
export interface ResponseSummary {
    message: string;
    description?: string;
}

// RESPONSE STRUCTURE
export interface GlobalInterceptor<T> {
    body: T;
    success: boolean;
    statusCode: number;
    summary: ResponseSummary;
    metadata: {
        endpoint: string;
        timestamp: string;
        requestId: string;
    };
}
