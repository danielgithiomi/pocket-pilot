import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { Radio, RadioOption } from '@atoms/radio';
import { AccountsService } from '@api/accounts.service';
import { CURRENCIES, LANGUAGES } from '@global/constants';
import { Component, computed, inject, input, signal } from '@angular/core';
import {
  ApplicationThemeOptions,
  SettingsFormSchema,
  SettingsFormValidationSchema,
  ThemeVariant,
} from './settings-form.types';

@Component({
  selector: 'settings-form',
  templateUrl: './settings-form.html',
  imports: [Input, Select, Radio],
})
export class SettingsForm {
  // INPUTS
  isSubmittingForm = input.required<boolean>();

  // SERVICES
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountsService);

  // DATA
  protected readonly languages = LANGUAGES;
  protected readonly currencies = CURRENCIES;
  private readonly user = this.authService.user;
  private readonly defaultCurrency = this.accountService.getDefaultCurrency();
  private readonly monthlySpendingLimit = this.accountService.getMonthlySpendingLimit();

  // COMPUTED
  protected readonly applicationThemes = computed<RadioOption[]>(() =>
    ApplicationThemeOptions.map((theme) => {
      let label: string;

      switch (theme) {
        case 'system':
          label = 'Default (System)';
          break;
        case 'light':
          label = 'Light';
          break;
        case 'dark':
          label = 'Dark';
          break;
      }

      return { label, value: theme };
    }),
  );

  // FORM
  private readonly initialSettingsFormState: SettingsFormSchema = {
    preferredTheme: 'system',
    defaultCurrency: this.defaultCurrency,
    monthlySpendingLimit: this.monthlySpendingLimit,
    preferredLanguage: this.user()?.userPreferences.preferredLanguage ?? 'en',
  };
  private readonly settingsFormModel = signal<SettingsFormSchema>(this.initialSettingsFormState);
  protected readonly settingsForm = form(this.settingsFormModel, SettingsFormValidationSchema);

  // METHODS
  protected resetSettingsForm() {
    this.settingsForm().reset(this.initialSettingsFormState);
    this.settingsFormModel.set(this.initialSettingsFormState);
  }

  // METHODS
  protected onThemeChange(theme: string) {
    if (!ApplicationThemeOptions.includes(theme as ThemeVariant)) {
      console.error('Invalid theme value:', theme);
      return;
    }

    this.settingsForm.preferredTheme().controlValue.set(theme as ThemeVariant);
  }

  // SUBMISSIONS
  protected submitSettingsForm(event: Event) {
    event.preventDefault();

    console.log(this.settingsFormModel());
  }
}
