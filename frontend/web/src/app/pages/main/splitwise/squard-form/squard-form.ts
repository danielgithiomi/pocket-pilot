import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { form } from '@angular/forms/signals';
import { Form, FormCloseEvent } from '@organisms/form';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { Component, input, output, signal } from '@angular/core';
import {
  CreateSquadSchema,
  initialCreateSquadData,
  createSquadValidationSchema,
} from './squad-form-types';

@Component({
  selector: 'splitwise-squard-form',
  templateUrl: './squard-form.html',
  imports: [LucideAngularModule, Form, Button, Input],
})
export class SplitwiseSquardForm {
  // ICONS
  protected readonly iconSize: number = 18;
  protected readonly AddUserIcon = UserPlus;

  // INPUTS
  readonly squadMembers = input.required<string[]>();

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
