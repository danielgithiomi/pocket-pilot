import { OnboardingPayload, User } from '@shared/types';
import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Form } from '@organisms/form';
import { Select } from '@atoms/select';
import { Router } from '@angular/router';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { PhoneNumber } from '@atoms/phone-number';
import { CURRENCIES, DEFAULT_COUNTRY_ISO, LANGUAGES, WEB_ROUTES } from '@shared/constants';
import { Component, inject, signal } from '@angular/core';
import { OnboardingService } from '@api/onboarding.service';
import { ChevronsRight, LucideAngularModule } from 'lucide-angular';
import {
    INITIAL_ONBOARDING_FORM_STATE,
    ONBOARDING_FORM_VALIDATION_SCHEMA,
    OnboardingFormSchema
} from './onboarding.types';

@Component({
    selector: 'onboarding',
    templateUrl: './onboarding.html',
    imports: [Form, Input, Select, Button, PhoneNumber, LucideAngularModule]
})
export class Onboarding {
    // ICONS
    readonly iconSize = 20;
    protected readonly chevrons = ChevronsRight;

    // SIGNALS
    protected readonly isSubmitting = signal<boolean>(false);
    protected readonly defaultCountryIso = signal<string>(DEFAULT_COUNTRY_ISO);

    // DATA
    protected readonly languages = LANGUAGES;
    protected readonly currencies = CURRENCIES;
    protected readonly initialOnboardingFormState = INITIAL_ONBOARDING_FORM_STATE;

    // SERVICES
    private readonly router = inject(Router);
    private readonly toastService = inject(ToastService);
    private readonly onboardingService = inject(OnboardingService);

    // FORM
    protected readonly onboardingFormModel = signal<OnboardingFormSchema>(this.initialOnboardingFormState);
    protected readonly onboardingForm = form(this.onboardingFormModel, ONBOARDING_FORM_VALIDATION_SCHEMA);

    // METHODS
    protected resetOnboardingForm() {
        this.onboardingForm().reset();
        this.onboardingFormModel.set(this.initialOnboardingFormState);
    }

    submitOnboardingForm(event: Event) {
        event.preventDefault();

        this.isSubmitting.set(true);

        const { phoneNumber, monthlySpendingLimit, ...rest } = this.onboardingFormModel();

        const payload: OnboardingPayload = {
            ...rest,
            phoneNumber: phoneNumber!,
            monthlySpendingLimit: monthlySpendingLimit!
        };

        setTimeout(() => {
            this.onboardingService.onboardUser(payload).subscribe({
                next: (response: User) => {
                    this.toastService.show({
                        variant: 'success',
                        title: 'Onboarding completed!',
                        details: `You have completed the onboarding process [${response.name}]. You can now enjoy Pocket Pilot!`
                    });

                    this.resetOnboardingForm();
                    this.router.navigate([WEB_ROUTES.dashboard], { replaceUrl: true });
                },
                complete: () => this.isSubmitting.set(false)
            });
        }, 2000);
    }
}
