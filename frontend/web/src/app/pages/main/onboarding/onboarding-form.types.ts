import { maxLength, minLength, required, schema, validate } from '@angular/forms/signals';

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
  // Phone Number
  required(root.phoneNumber, { message: 'The phone number is required field!' });
  maxLength(root.phoneNumber, 10, { message: 'The phone number must not exceed 10 digits!' });
  minLength(root.phoneNumber, 8, { message: 'The phone number must be at least 8 digits long!' });
  validate(root.phoneNumber, (control) => {
    const number = control.value();
    if (number && !/^\d+$/.test(number)) {
      return {
        kind: 'phone-number-invalid',
        message: 'The phone number must contain only digits!',
      };
    }
    return null;
  });
  // TODO: Improve number validation (e.g., check if it's a valid phone number) → add country code selector

  // Default Currency
  required(root.defaultCurrency, { message: 'The default currency is required field!' });

  // Preferred Language
  required(root.preferredLanguage, { message: 'The preferred language is required field!' });

  // Monthly Spending Limit
  required(root.monthlySpendingLimit, { message: 'The monthly spending limit is required field!' });
});
