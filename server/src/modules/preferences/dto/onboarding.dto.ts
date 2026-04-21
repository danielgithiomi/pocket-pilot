import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OnboardingPayload {
    @IsString()
    @IsNotEmpty()
    phoneNumber!: string;

    @IsString()
    @IsNotEmpty()
    defaultCurrency!: string;

    @IsString()
    @IsNotEmpty()
    preferredLanguage!: string;

    @IsNumber()
    @IsNotEmpty()
    monthlySpendingLimit!: number;
}

@Exclude()
export class UserPreferencesDto {
    @Expose()
    @ApiProperty({
        example: 1000,
        description: 'Monthly spending limit of the user',
    })
    monthlySpendingLimit!: number;

    @Expose()
    @ApiProperty({
        example: 'USD',
        description: 'Default currency of the user',
    })
    defaultCurrency!: string;

    @Expose()
    @ApiProperty({
        example: 'en',
        description: 'Preferred language of the user',
    })
    preferredLanguage!: string;
}
