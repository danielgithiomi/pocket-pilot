import { Button } from '@atoms/button';
import { form } from '@angular/forms/signals';
import { Form, FormCloseEvent } from '@organisms/form';
import { Component, output, signal } from '@angular/core';
import {
  CreateSquadSchema,
  initialCreateSquadData,
  createSquadValidationSchema,
} from './squad-form-types';

@Component({
  selector: 'splitwise-squard-form',
  templateUrl: './squard-form.html',
  imports: [Form, Button],
})
export class SplitwiseSquardForm {
  // OUTPUTS
  readonly closeCreateFormSquadEvent = output<void>();

  // STATE SIGNALS
  protected readonly isSubmittingCreateSquadForm = signal<boolean>(false);

  // FORM
  protected readonly createSquadFormModel = signal<CreateSquadSchema>(initialCreateSquadData);
  protected readonly createSquadForm = form(this.createSquadFormModel, createSquadValidationSchema);

  // METHODS
  resetCreateSquadForm() {
    console.log('Reset create squad form');
  }

  handleCreateSquadFormClose(event: FormCloseEvent) {
    if (event === 'icon') this.resetCreateSquadForm();
    this.closeCreateFormSquadEvent.emit();
  }

  handleCreateSquadFormSubmit(event: Event) {
    event.preventDefault();
    console.log('Create squad form submitted');
  }
}
