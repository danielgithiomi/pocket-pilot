import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { Radio, RadioOption } from '@atoms/radio';
import { LucideAngularModule } from 'lucide-angular';
import { AccountsService } from '@api/accounts.service';
import { ThemeService } from '@infrastructure/services';
import { CURRENCIES, LANGUAGES } from '@global/constants';
import { UpdateUserPreferencesPayload } from '@global/types';
import { PreferencesService } from '@api/preferences.service';
import { Component, computed, inject, signal } from '@angular/core';
import { normalizeThemePreference } from '@infrastructure/services/theme.utils';
import {
    ThemeVariant,
    SettingsFormSchema,
    ApplicationThemeOptions,
    SettingsFormValidationSchema
} from './settings.types';

@Component({
    selector: 'settings',
    styleUrl: './settings.css',
    templateUrl: './settings.html',
    imports: [LucideAngularModule, Input, Radio, Select, Button]
})
export class Settings {
    // SIGNALS
    protected readonly isSubmittingSettingsForm = signal<boolean>(false);

    // SERVICES
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);
    private readonly themeService = inject(ThemeService);
    private readonly accountService = inject(AccountsService);
    private readonly preferencesService = inject(PreferencesService);

    // DATA
    protected readonly languages = LANGUAGES;
    protected readonly currencies = CURRENCIES;
    private readonly user = this.authService.user;
    private readonly defaultCurrency = this.accountService.getDefaultCurrency();
    private readonly monthlySpendingLimit = this.accountService.getMonthlySpendingLimit();

    // COMPUTED
    protected readonly monthlySpendingLimitLabel = computed<string>(() => {
        return `Monthly Spending Limit (${this.defaultCurrency})`;
    });
    protected readonly applicationThemes = computed<RadioOption[]>(() =>
        ApplicationThemeOptions.map((theme) => {
            let label: string;

            switch (theme) {
                case 'SYSTEM':
                    label = 'System';
                    break;
                case 'LIGHT':
                    label = 'Light';
                    break;
                case 'DARK':
                    label = 'Dark';
                    break;
            }

            return { label, value: theme };
        })
    );

    // FORM
    private initialSettingsFormState: SettingsFormSchema = {
        defaultCurrency: this.defaultCurrency,
        preferredTheme:
            normalizeThemePreference(this.user()?.userPreferences.preferredTheme) ?? this.themeService.theme(),
        monthlySpendingLimit: this.monthlySpendingLimit,
        preferredLanguage: this.user()?.userPreferences.preferredLanguage ?? 'en'
    };
    private readonly settingsFormModel = signal<SettingsFormSchema>(this.initialSettingsFormState);
    protected readonly settingsForm = form(this.settingsFormModel, SettingsFormValidationSchema);

    // METHODS
    resetSettingsForm() {
        this.settingsForm().reset(this.initialSettingsFormState);
        this.settingsFormModel.set(this.initialSettingsFormState);
        this.themeService.setTheme(this.initialSettingsFormState.preferredTheme);
    }

    protected onThemeChange(theme: string) {
        if (!ApplicationThemeOptions.includes(theme as ThemeVariant)) return;
        this.settingsForm.preferredTheme().controlValue.set(theme as ThemeVariant);
        this.themeService.previewTheme(theme);
    }

    // SUBMISSIONS
    protected submitSettingsForm(event: Event) {
        event.preventDefault();

        if (this.settingsForm().invalid()) return;

        this.isSubmittingSettingsForm.set(true);

        const payload: UpdateUserPreferencesPayload = {
            ...this.settingsFormModel(),
            monthlySpendingLimit: this.settingsFormModel().monthlySpendingLimit!
        };

        this.preferencesService.updateUserPreferences(payload).subscribe({
            next: () => {
                this.themeService.setTheme(payload.preferredTheme);
                this.initialSettingsFormState = { ...this.settingsFormModel() };
                this.toastService.show({
                    variant: 'success',
                    title: 'Settings updated',
                    details: 'Your preferences have been saved.'
                });
                this.isSubmittingSettingsForm.set(false);
            },
            error: () => this.isSubmittingSettingsForm.set(false)
        });
    }
}
