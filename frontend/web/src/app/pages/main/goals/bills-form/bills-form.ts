import { Button } from '@atoms/button';
import { Form } from '@organisms/form';
import { form } from '@angular/forms/signals';
import { RadioOption, Radio } from '@atoms/radio';
import { DatePicker } from '@organisms/date-picker';
import { LucideAngularModule } from 'lucide-angular';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import {
  NewBillSchema,
  NewBillFormValidationSchema,
  INITIAL_FORM_STATE as initialFormData,
} from './bills-form.types';

@Component({
  selector: 'app-bills-form',
  templateUrl: './bills-form.html',
  imports: [LucideAngularModule, Form, Button, Radio, DatePicker],
})
export class BillsFormComponent {
  // Inputs
  isBillsFormOpen = input.required<boolean>();

  // Outputs
  onBillsFormClose = output<void>();

  // Signals
  protected readonly isSubmittingForm = signal<boolean>(false);

  // Services
//   protected readonly billService = inject(BillService);

  // Form
  protected readonly newBillFormModel = signal<NewBillSchema>(initialFormData);
  protected readonly newBillForm = form(this.newBillFormModel, NewBillFormValidationSchema);

  // Computed
//   protected readonly formattedBillTypes = computed<RadioOption[]>(() => {
//     return Object.values(NewBillSchema.billType.enum).map((type) => ({
//       value: type,
//       label: type,
//     }));
//   });

  // Methods
  protected handleCloseForm() {
    this.onBillsFormClose.emit();
  }

  // Submissions
  protected submitNewBillForm(event: Event) {
    event.preventDefault();
    console.log(this.newBillForm().value());
  }
}
