import { ApiProperty } from '@nestjs/swagger';

// TOKENS
export interface IRequestCookies {
    access_token: string;
    refresh_token: string;
}

// RESPONSE SUMMARY
export interface IResponseSummary {
    message: string;
    description?: string;
}

// RESPONSE STRUCTURE
export interface IGlobalResponse<T> {
    body: T;
    success: true;
    statusCode: number;
    summary: IResponseSummary;
    metadata: {
        endpoint: string;
        timestamp: string;
        requestId: string;
    };
}

// EXCEPTION STRUCTURE
export interface IGlobalError {
    success: false;
    statusCode: number;
    error: {
        type: string;
        name?: string;
        title?: string;
        details?: unknown;
    };
    metadata: {
        endpoint: string;
        timestamp: string;
        requestId: string;
    };
}

export class MessageResponse {
    @ApiProperty({ description: 'Message', example: 'User logged out successfully.' })
    message!: string;
}

export class DeleteResourceResponse {
    @ApiProperty({ description: 'Message', example: 'Resource deleted successfully.' })
    message!: string;

    @ApiProperty({
        description: 'Details',
        example: 'The resource with id: {123e4567-e89b-12d3-a456-426614174000} has been deleted successfully.',
    })
    details?: string;
}

export class WithCountResponseClass<T> {
    @ApiProperty({ type: 'number', example: 1 })
    count!: number;

    @ApiProperty({ type: 'array', items: { type: 'object' } })
    data!: T[];
}
