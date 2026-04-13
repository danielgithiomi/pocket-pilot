import { Exclude, Expose } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
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
        description: 'Unique identifier for the user preferences',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

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

@ApiExtraModels(UserPreferencesDto)
export class UserWithPreferencesDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier for the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        example: 'johndoe@test.com',
        description: 'Email address of the user',
    })
    email!: string;

    @Expose()
    @ApiProperty({
        example: 'John Doe',
        description: 'Name of the user',
    })
    name!: string;

    @Expose()
    @ApiProperty({
        example: '+1234567890',
        description: 'Phone number of the user',
    })
    phoneNumber!: string;

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Date and time when the user was created',
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Date and time when the user was last updated',
    })
    updatedAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Date and time when the user last logged in',
    })
    lastLoginAt!: Date | null;

    @Expose()
    @ApiProperty({
        example: 0,
        description: 'Number of failed login attempts',
    })
    failedLoginAttempts!: number;

    @Expose()
    @ApiProperty({
        example: false,
        description: 'Whether the account is locked',
    })
    isAccountLocked!: boolean;

    @Expose()
    @ApiProperty({
        example: true,
        description: 'Whether the user has completed onboarding',
    })
    isOnboarded!: boolean;

    @ApiProperty({ type: UserPreferencesDto })
    preferences!: UserPreferencesDto;
}
