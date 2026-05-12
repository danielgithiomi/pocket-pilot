import { Button } from '@atoms/button';
import { formatFullDate } from '@libs/utils';
import { form } from '@angular/forms/signals';
import { SplitwiseSquad } from '@global/types';
import { Form, FormCloseEvent } from '@organisms/form';
import { AccountsService } from '@api/accounts.service';
import { SplitFormStep1 } from './step-1/split-form-step-1';
import { ChevronsRight, ChevronsLeft, LucideAngularModule } from 'lucide-angular';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import {
  SplitFormSchema,
  InitialSplitFormState,
  SplitFormValidationSchema,
} from './split-form.types';
import { SplitFormStep2 } from "./step-2/split-form-step-2";

@Component({
  selector: 'splitwise-split-form',
  templateUrl: './split-form.html',
  imports: [LucideAngularModule, Form, Button, SplitFormStep1, SplitFormStep2],
})
export class SplitwiseSplitForm {
  // ICONS
  protected readonly iconSize = 18;
  protected readonly NextIcon = ChevronsRight;
  protected readonly PreviousIcon = ChevronsLeft;

  // INPUTS
  readonly squads = input.required<SplitwiseSquad[]>();
  readonly isSplitFormOpen = input.required<boolean>();

  // OUTPUTS
  readonly closeSplitFormEvent = output<boolean>();

  // SIGNAL STATES
  protected readonly splitFormStep = signal<FormStepOptions>(1);
  protected readonly isSubmittingSplitForm = signal<boolean>(false);

  // SERVICES
  private readonly accountsService = inject(AccountsService);

  // DATA
  protected readonly defaultCurrency = this.accountsService.getDefaultCurrency();

  // FORM
  private initialLocalFormState: SplitFormSchema = {
    ...InitialSplitFormState,
    billingCurrency: this.defaultCurrency,
  };
  protected readonly splitFormModel = signal<SplitFormSchema>(this.initialLocalFormState);
  protected readonly splitForm = form(this.splitFormModel, SplitFormValidationSchema);

  // METHODS
  protected formatDate = (date: Date) => formatFullDate(date.toISOString());
  protected goToNextStep = (step: FormStepOptions) => this.splitFormStep.set(step);
  protected goToPreviousStep = (step: FormStepOptions) => this.splitFormStep.set(step);
  protected resetSplitForm = () => {
    this.splitForm().reset();
    this.splitFormStep.set(1);
    this.splitFormModel.set(this.initialLocalFormState);
  };

  protected handleSplitFormClose(event: FormCloseEvent) {
    if (event === 'icon') this.resetSplitForm();
    this.closeSplitFormEvent.emit(false);
  }

  // SUBMISSIONS
  protected handleSplitFormSubmit(event: Event) {
    event.preventDefault();

    const { ...payload } = this.splitFormModel();
    console.log(payload);

    // this.isSubmittingSplitForm.set(true);

    // setTimeout(() => {
    //   this.isSubmittingSplitForm.set(false);
    //   this.closeSplitFormEvent.emit(true);
    // }, 2000);
  }
}

type FormStepOptions = 1 | 2 | 3;
