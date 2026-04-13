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
