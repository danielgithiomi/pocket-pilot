import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Form } from '@organisms/form';
import { Select } from '@atoms/select';
import { form } from '@angular/forms/signals';
import { Component, signal } from '@angular/core';
import { LANGUAGES, CURRENCIES } from '@global/constants';
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
    console.log('Onboarding form submitted', event);
  }
}
