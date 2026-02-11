import { ApiProperty } from '@nestjs/swagger';

export interface WithCountResponse<T> {
    count: number;
    data: T[];
}

export interface DeleteResourceResponse {
    message: string;
    details: string;
}

export class WithCountResponseClass<T> {
    @ApiProperty({ type: 'number', example: 1 })
    count!: number;

    @ApiProperty({ type: 'array', items: { type: 'object' } })
    data!: T[];
}
