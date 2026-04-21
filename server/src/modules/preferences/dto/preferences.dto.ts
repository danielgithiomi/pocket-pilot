import { ApplicationTheme } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePreferencesPayload {
    @IsString()
    @IsNotEmpty()
    @IsEnum(ApplicationTheme)
    preferredTheme!: ApplicationTheme;

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
