import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { AccountsService } from '@api/accounts.service';
import { Component, inject, input, signal } from '@angular/core';
import { SettingsFormSchema, SettingsFormValidationSchema } from './settings-form.types';

@Component({
  selector: 'settings-form',
  // styleUrl: './settings-form.css',
  templateUrl: './settings-form.html',
  imports: [],
})
export class SettingsForm {
  // INPUTS
  isSubmittingForm = input.required<boolean>();

  // SERVICES
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountsService);

  // DATA
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
  protected resetSettingsForm() {
    this.settingsForm().reset(this.initialSettingsFormState);
    this.settingsFormModel.set(this.initialSettingsFormState);
  }

  // SUBMISSIONS
  protected submitSettingsForm(event: Event) {
    event.preventDefault();

    console.log(this.settingsFormModel());
  }
}
