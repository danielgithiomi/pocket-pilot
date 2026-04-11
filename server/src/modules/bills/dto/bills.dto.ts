import { randomUUID } from 'crypto';
import { BillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// Request
export class CreateBillPayload {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Electricity', description: 'The name of the bill' })
    name!: string;

    @IsNotEmpty()
    @IsEnum(BillType)
    @ApiProperty({ example: BillType.MONTHLY, description: 'The recurrence pattern of the bill' })
    type!: BillType;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 200.0, description: 'The amount of the bill' })
    amount!: number;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @ApiProperty({ example: '2025-10-01', description: 'The due date of the bill' })
    dueDate!: Date;
}

// Response
export class BillDTO {
    @ApiProperty({ example: randomUUID(), description: 'The ID of the bill' })
    id!: string;

    @ApiProperty({ example: randomUUID(), description: 'The ID of the user who owns the bill' })
    userId!: string;

    @ApiProperty({ example: 'Electricity', description: 'The name of the bill' })
    name!: string;

    @ApiProperty({ example: BillType.MONTHLY, description: 'The recurrence pattern of the bill' })
    type!: BillType;

    @ApiProperty({ example: 200.0, description: 'The amount of the bill' })
    amount!: number;

    @ApiProperty({ example: '2025-10-01', description: 'The due date of the bill' })
    dueDate!: Date;
}
