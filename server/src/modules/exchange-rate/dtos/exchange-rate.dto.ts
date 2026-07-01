import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export interface CurrencyConversionResult {
    source: {
        amount: number;
        currency: string;
    };
    target: {
        amount: number;
        currency: string;
    };
    base: {
        amount: number;
        currency: string;
    };
}

export interface ExchangeRateResponse {
    result: string;
    base_code: string;
    terms_of_use: string;
    documentation: string;
    time_last_update_utc: string;
    time_next_update_utc: string;
    time_next_update_unix: number;
    time_last_update_unix: number;
    conversion_rates: Record<string, number>;
}

export class ExchangeRatePayload {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'USD', description: 'The base currency' })
    baseCurrency!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'The date the exchange rate will be updated' })
    nextUpdateTime!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'The date the exchange rate was last updated' })
    lastUpdatedTime!: string;

    @IsNotEmpty()
    @ApiProperty({
        example: { USD: 1.0, EUR: 0.85, GBP: 0.75 },
        type: Object as () => Record<string, number>,
        description: 'The exchange rates for the currencies'
    })
    exchangeRates!: Record<string, number>;
}

export type PrismaExchangeRateSnapshotWithRates = Prisma.ExchangeRateSnapshotGetPayload<{
    include: { exchangeRates: true };
}>;

@Exclude()
export class ExchangeRateDto {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the exchange rate' })
    id!: string;

    @Expose()
    @ApiProperty({ example: 'USD', description: 'The base currency' })
    baseCurrency!: string;

    @Expose()
    @ApiProperty({
        example: { USD: 1.0, EUR: 0.85, GBP: 0.75 },
        type: Object as () => Record<string, number>,
        description: 'The exchange rates for the currencies'
    })
    exchangeRates!: Record<string, number>;

    @Expose()
    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'The date the exchange rate will be updated' })
    nextUpdateTime!: Date;

    @Expose()
    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'The date the exchange rate was last updated' })
    lastUpdatedTime!: Date;

    @Expose()
    @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'The date the exchange rate was fetched' })
    fetchedAt!: Date;
}
