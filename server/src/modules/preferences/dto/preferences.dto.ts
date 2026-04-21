import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePreferencesPayload {
    @IsString()
    @IsNotEmpty()
    applicationTheme!: string;

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
