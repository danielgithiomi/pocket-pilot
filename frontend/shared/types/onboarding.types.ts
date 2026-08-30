export interface OnboardingPayload {
  phoneNumber: string;
  defaultCurrency: string;
  preferredLanguage: string;
  monthlySpendingLimit: number;
}

export interface UserPreferences {
  preferredTheme: string;
  defaultCurrency: string;
  preferredLanguage: string;
  monthlySpendingLimit: number;
}
