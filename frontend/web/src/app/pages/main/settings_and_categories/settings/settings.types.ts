import { required, schema, validate } from '@angular/forms/signals';

export const ApplicationThemeOptions = ['SYSTEM', 'LIGHT', 'DARK'] as const;
export type ThemeVariant = (typeof ApplicationThemeOptions)[number];

export interface SettingsFormSchema {
  defaultCurrency: string;
  preferredLanguage: string;
  preferredTheme: ThemeVariant;
  monthlySpendingLimit: number | null;
}

export const SettingsFormValidationSchema = schema<SettingsFormSchema>((root) => {
  // Preferred Theme
  required(root.preferredTheme, { message: 'The preferred theme is required field!' });

  // Default Currency
  required(root.defaultCurrency, { message: 'The default currency is required field!' });

  // Preferred Language
  required(root.preferredLanguage, { message: 'The preferred language is required field!' });

  // Monthly Spending Limit
  required(root.monthlySpendingLimit, { message: 'The monthly spending limit is required field!' });
  validate(root.monthlySpendingLimit, (context) => {
    const value = context.value();
    if (value === null) return undefined;

    const asString = value.toString();
    const isValid = /^\d+(\.\d{1,2})?$/.test(asString);

    return isValid
      ? undefined
      : { kind: 'error', message: 'Amount cannot exceed 2 decimal places' };
  });
});
