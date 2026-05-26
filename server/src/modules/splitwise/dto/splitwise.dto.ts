import { Exclude, Expose, Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { PaymentStrategy as PaymentStrategyVariant, SplitStrategy as SplitStrategyVariant } from '@prisma/client';

// BILL PAYER - The people who paid for the order
export class BillPayerPayload {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'John',
        description: 'The name of the bill payer',
    })
    payerName!: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @ApiProperty({
        example: 100,
        description: 'The amount of the bill payer',
    })
    payerAmount!: number;
}

// BILL PAYER DTO - The people who paid for the order
@Exclude()
export class BillPayerDto extends BillPayerPayload {
    @Expose()
    @ApiProperty({
        description: 'The ID of the bill payer',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The creation date of the bill payer',
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The update date of the bill payer',
    })
    updatedAt!: Date;

    @Expose()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the owning splitwise event that this bill payer belongs to',
    })
    splitwiseEventId!: string;
}

// QUANTITY SPLIT - The quantity of the item ordered
export class QuantitySplitPayload {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the consumer',
    })
    consumerName!: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 1,
        description: 'The quantity of the item ordered',
    })
    consumerQuantity!: number;
}

// QUANTITY SPLIT DTO - How the item was split between the consumers
@Exclude()
export class QuantitySplitDto extends QuantitySplitPayload {
    @Expose()
    @ApiProperty({
        description: 'The ID of the quantity split',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The creation date of the quantity split',
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The update date of the quantity split',
    })
    updatedAt!: Date;

    @Expose()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the owning splittable that this quantity split belongs to',
    })
    splittableId!: string;
}

// SPLITTABLE ORDER PAYLOAD - The item in the order that was split
export class SplittablePayload {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Dinner',
        description: 'The name of the splittable order item',
    })
    name!: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @ApiProperty({
        example: 300,
        description: 'The total amount of the splittable order item',
    })
    total!: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 1,
        description: 'The quantity of the item ordered',
    })
    quantity!: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @ApiProperty({
        example: 100,
        description: 'The unit price of the splittable order item',
    })
    unitPrice!: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'QUANTITY',
        description: 'The split strategy of the splittable order item',
    })
    splitStrategy!: SplitStrategyVariant;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({
        example: true,
        description: 'Whether the splittable is settled',
    })
    settled!: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuantitySplitPayload)
    @ApiProperty({
        description: 'How the item was split between the consumers',
        example: [{ consumerName: 'John Doe', consumerQuantity: 1 }],
    })
    quantitySplits!: QuantitySplitPayload[];
}

// SPLITTABLE ORDER DTO - The item in the order that was split
@Exclude()
@ApiExtraModels(QuantitySplitDto)
export class SplittableDto extends SplittablePayload {
    @Expose()
    @ApiProperty({
        description: 'The ID of the splittable',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The creation date of the splittable',
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The update date of the splittable',
    })
    updatedAt!: Date;

    @Expose()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the owning splitwise event that this splittable belongs to',
    })
    splitEventId!: string;

    @Expose()
    @Type(() => QuantitySplitDto)
    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(QuantitySplitDto) },
        description: 'How the item was split between the consumers',
        example: [{ id: '123e4567-e89b-12d3-a456-426614174000', consumerName: 'John Doe', consumerQuantity: 1 }],
    })
    declare quantitySplits: QuantitySplitDto[];
}

// SPLITWISE EVENT PAYLOAD - The payload for the splitwise event
export class SplitwiseEventPayload {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Dinner',
        description: 'The name of the event',
    })
    eventName!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'My Squad',
        description: 'The name of the squad',
    })
    squadName!: string;

    @IsArray()
    @Type(() => BillPayerPayload)
    @ValidateNested({ each: true })
    @ApiProperty({
        description: 'The bill payers',
        example: [{ payerName: 'John Doe', payerAmount: 100 }],
    })
    billPayers!: BillPayerPayload[];

    @IsArray()
    @Type(() => SplittablePayload)
    @ValidateNested({ each: true })
    @ApiProperty({
        type: 'array',
        description: 'The splittables',
        items: { $ref: getSchemaPath(SplittableDto) },
        example: [
            {
                total: 100,
                quantity: 1,
                settled: false,
                name: 'Dinner',
                unitPrice: 100,
                splitStrategy: 'EQUAL',
                quantitySplits: [{ consumerName: 'John Doe', consumerQuantity: 1 }],
            },
        ],
    })
    eventSplittables!: SplittablePayload[];

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({
        description: 'The event members',
        example: ['John Doe', 'Jane Doe'],
    })
    eventMembers!: string[];

    @IsDate()
    @Type(() => Date)
    @ApiProperty({
        type: 'string',
        format: 'date-time',
        example: '2026-05-24T13:03:15.811Z',
        description: 'The date of the event',
    })
    eventDate!: Date;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @ApiProperty({
        example: 100,
        description: 'The verification total',
    })
    verificationTotal!: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'ONE',
        description: 'The bill payer strategy',
    })
    billPaymentStrategy!: PaymentStrategyVariant;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'MUR',
        description: 'The billing currency',
    })
    billingCurrency!: string;
}

// SPLITWISE EVENT DTO - The splitwise event
@Exclude()
@ApiExtraModels(BillPayerDto, SplittableDto)
export class SplitwiseEventDto extends SplitwiseEventPayload {
    @Expose()
    @ApiProperty({
        description: 'The ID of the splitwise event',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the creator of the splitwise event',
    })
    creatorId!: string;

    @Expose()
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The creation date of the splitwise event',
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The update date of the splitwise event',
    })
    updatedAt!: Date;

    @Expose()
    @ApiProperty({
        nullable: true,
        example: '2026-05-24T13:03:15.811Z',
        description: 'The date of the event was settled',
    })
    settledAt!: Date | null;

    @Expose()
    @Type(() => BillPayerDto)
    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(BillPayerDto) },
        description: 'The bill payers',
    })
    declare billPayers: BillPayerDto[];

    @Expose()
    @Type(() => SplittableDto)
    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(SplittableDto) },
        description: 'The splittables',
    })
    declare eventSplittables: SplittableDto[];
}
