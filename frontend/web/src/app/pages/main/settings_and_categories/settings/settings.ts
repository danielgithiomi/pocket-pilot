import { Input } from '@atoms/input';
import { Radio, RadioOption } from '@atoms/radio';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { AccountsService } from '@api/accounts.service';
import { CURRENCIES, LANGUAGES } from '@global/constants';
import { Component, computed, inject, signal } from '@angular/core';
import {
  ApplicationThemeOptions,
  SettingsFormSchema,
  SettingsFormValidationSchema,
  ThemeVariant,
} from './settings.types';

@Component({
  selector: 'settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
  imports: [LucideAngularModule, Input, Radio, Select, Button],
})
export class Settings {
  // SIGNALS
  protected readonly isSubmittingSettingsForm = signal<boolean>(false);

  // DATA
  protected readonly languages = LANGUAGES;
  protected readonly currencies = CURRENCIES;
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
  // SERVICES
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountsService);
  private readonly user = this.authService.user;
  private readonly defaultCurrency = this.accountService.getDefaultCurrency();
  private readonly monthlySpendingLimit = this.accountService.getMonthlySpendingLimit();
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
  resetSettingsForm() {
    this.settingsForm().reset(this.initialSettingsFormState);
    this.settingsFormModel.set(this.initialSettingsFormState);
  }

  protected onThemeChange(theme: string) {
    if (!ApplicationThemeOptions.includes(theme as ThemeVariant)) return;
    this.settingsForm.preferredTheme().controlValue.set(theme as ThemeVariant);
  }

  // SUBMISSIONS
  protected submitSettingsForm(event: Event) {
    event.preventDefault();

    console.log(this.settingsFormModel());
  }
}
