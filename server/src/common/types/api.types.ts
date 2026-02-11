import { ApiProperty } from '@nestjs/swagger';

export interface WithCountResponse<T> {
    count: number;
    data: T[];
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
