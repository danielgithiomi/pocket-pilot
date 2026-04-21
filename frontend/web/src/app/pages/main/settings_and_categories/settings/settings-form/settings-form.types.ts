// FORM
import { required, schema } from '@angular/forms/signals';

export type ThemeVariant = 'system' | 'light' | 'dark';

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
});
