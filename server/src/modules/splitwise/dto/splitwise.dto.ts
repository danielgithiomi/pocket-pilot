import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsISO8601, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export type PaymentStrategyVariant = 'ONE' | 'EQUAL' | 'CUSTOM';
export type SplitStrategyVariant = 'EQUAL' | 'SOLE' | 'QUANTITY';

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

// SPLITTABLE ORDER
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
    @IsObject({ each: true, context: { type: QuantitySplitPayload } })
    @ApiProperty({
        description: 'How the item was split between the consumers',
        example: [{ consumerName: 'John Doe', consumerQuantity: 1 }],
    })
    quantitySplits!: QuantitySplitPayload[];
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
    @IsObject({ each: true, context: { type: BillPayerPayload } })
    @ApiProperty({
        description: 'The bill payers',
        example: [{ name: 'John Doe', amount: 100 }],
    })
    billPayers!: BillPayerPayload[];

    @IsArray()
    @IsObject({ each: true, context: { type: SplittablePayload } })
    @ApiProperty({
        description: 'The splittables',
        example: [
            {
                name: 'Dinner',
                total: 100,
                quantity: 1,
                unitPrice: 100,
                splitStrategy: 'EQUAL',
                quantitySplits: [{ consumerName: 'John Doe', consumerQuantity: 1 }],
            },
        ],
    })
    splittables!: SplittablePayload[];

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({
        description: 'The event members',
        example: ['John Doe', 'Jane Doe'],
    })
    eventMembers!: string[];

    @IsString()
    @IsISO8601({ strict: true })
    @ApiProperty({
        example: '2026-05-24T13:03:15.811Z',
        description: 'The date of the event',
    })
    eventDate!: string;

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
