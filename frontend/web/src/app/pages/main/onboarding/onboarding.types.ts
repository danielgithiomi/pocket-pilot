import { getNationalNumberDigits } from '@atoms/phone-number';
import { required, schema, validate } from '@angular/forms/signals';

// FORM SCHEMA
export interface OnboardingFormSchema {
    phoneNumber: string;
    defaultCurrency: string;
    preferredLanguage: string;
    monthlySpendingLimit: number | null;
}

export const INITIAL_ONBOARDING_FORM_STATE: OnboardingFormSchema = {
    phoneNumber: '',
    defaultCurrency: '',
    preferredLanguage: 'en',
    monthlySpendingLimit: null,
};

export const ONBOARDING_FORM_VALIDATION_SCHEMA = schema<OnboardingFormSchema>((root) => {
    required(root.phoneNumber, { message: 'The phone number is required field!' });
    validate(root.phoneNumber, (control) => {
        const number = control.value();
        if (!number) return null;

        if (!/^\+\d+$/.test(number)) {
            return {
                kind: 'phone-number-invalid',
                message: 'Please enter a valid phone number!',
            };
        }

        const nationalDigits = getNationalNumberDigits(number);
        if (nationalDigits.length < 7) {
            return {
                kind: 'phone-number-too-short',
                message: 'The phone number must be at least 7 digits long!',
            };
        }

        if (nationalDigits.length > 14) {
            return {
                kind: 'phone-number-too-long',
                message: 'The phone number must not exceed 14 digits!',
            };
        }

        return null;
    });

    // Default Currency
    required(root.defaultCurrency, { message: 'The default currency is required field!' });

    // Preferred Language
    required(root.preferredLanguage, { message: 'The preferred language is required field!' });

    // Monthly Spending Limit
    required(root.monthlySpendingLimit, {
        message: 'The monthly spending limit is required field!',
    });
});
