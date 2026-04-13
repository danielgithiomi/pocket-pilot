import { User } from '@global/types';
import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Form } from '@organisms/form';
import { Select } from '@atoms/select';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { OnboardingPayload } from '@global/types';
import { Component, inject, signal } from '@angular/core';
import { LANGUAGES, CURRENCIES } from '@global/constants';
import { OnboardingService } from '@api/onboarding.service';
import { LucideAngularModule, ChevronsRight } from 'lucide-angular';
import {
  OnboardingFormSchema,
  INITIAL_ONBOARDING_FORM_STATE,
  ONBOARDING_FORM_VALIDATION_SCHEMA,
} from './onboarding-form.types';

@Component({
  selector: 'onboarding',
  templateUrl: './onboarding.html',
  imports: [Form, Input, Select, Button, LucideAngularModule],
})
export class Onboarding {
  // ICONS
  readonly iconSize = 20;
  protected readonly chevrons = ChevronsRight;

  // SIGNALS
  protected readonly isSubmitting = signal<boolean>(false);

  // DATA
  protected readonly languages = LANGUAGES;
  protected readonly currencies = CURRENCIES;
  protected readonly initialOnboardingFormState = INITIAL_ONBOARDING_FORM_STATE;

  // SERVICES
  private readonly toastService = inject(ToastService);
  private readonly onboardingService = inject(OnboardingService);

  // FORM
  protected readonly onboardingFormModel = signal<OnboardingFormSchema>(
    this.initialOnboardingFormState,
  );
  protected readonly onboardingForm = form(
    this.onboardingFormModel,
    ONBOARDING_FORM_VALIDATION_SCHEMA,
  );

  // METHODS
  protected resetOnboardingForm() {
    this.onboardingForm().reset();
    this.onboardingFormModel.set(this.initialOnboardingFormState);
  }

  submitOnboardingForm(event: Event) {
    event.preventDefault();

    console.log('submitting onboarding form');

    this.isSubmitting.set(true);

    const { phoneNumber, monthlySpendingLimit, ...rest } = this.onboardingFormModel();

    const payload: OnboardingPayload = {
      ...rest,
      phoneNumber: phoneNumber!,
      monthlySpendingLimit: monthlySpendingLimit!,
    };

    setTimeout(() => {
      this.onboardingService.onboardUser(payload).subscribe({
        next: (response: User) => {
          this.toastService.show({
            variant: 'success',
            title: 'Onboarding completed!',
            details: `You have completed the onbarding process ${response.name}. You can now enjoy Pocket Pilot!`,
          });

          this.resetOnboardingForm();
        },
        complete: () => this.isSubmitting.set(false),
      });
    }, 2000);
  }
}
