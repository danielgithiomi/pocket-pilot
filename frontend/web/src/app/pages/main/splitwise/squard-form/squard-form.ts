import { Form } from '@organisms/form';
import { Button } from '@atoms/button';
import { Component, signal } from '@angular/core';
import { CreateSquadSchema, CreateSquadValidationSchema, InitialCreateSquadData } from './squad-form-types';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'splitwise-squard-form',
  templateUrl: './squard-form.html',
  imports: [Form, Button],
})
export class SplitwiseSquardForm {
  // STATE SIGNALS
  protected readonly isSubmittingCreateSquadForm = signal<boolean>(false);

  // FORM
  protected readonly createSquadFormModel = signal<CreateSquadSchema>(InitialCreateSquadData);
  protected readonly createSquadForm = form(this.createSquadFormModel, CreateSquadValidationSchema);

  // METHODS
  resetCreateSquadForm() {
    console.log('Reset create squad form');
  }

  handleCreateSquadFormSubmit(event: Event) {
    event.preventDefault();
    console.log('Create squad form submitted');
  }
}
