import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { Form } from '@organisms/form';
import { BillType } from '@global/types';
import { ToastService } from '@atoms/toast';
import { BillTypeEnum } from '@global/enums';
import { form } from '@angular/forms/signals';
import { BillsService } from '@api/bills.service';
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
  selector: 'bills-form',
  templateUrl: './bills-form.html',
  imports: [LucideAngularModule, Form, Button, Radio, DatePicker, Input],
})
export class BillsForm {
  // Inputs
  isBillsFormOpen = input.required<boolean>();

  // Outputs
  onBillsFormClose = output<void>();

  // Signals
  protected readonly isSubmittingForm = signal<boolean>(false);

  // Services
  protected readonly billService = inject(BillsService);
  protected readonly toastService = inject(ToastService);

  // Data
  protected readonly billTypes = this.billService.getBillTypes();

  // Form
  protected readonly minStartDate = signal<Date>(new Date());
  protected readonly newBillFormModel = signal<NewBillSchema>(initialFormData);
  protected readonly newBillForm = form(this.newBillFormModel, NewBillFormValidationSchema);

  // Computed
  protected readonly formattedBillTypes = computed<RadioOption[]>(() => {
    const billTypes = this.billTypes.value()?.data;
    if (!billTypes) return [];
    return billTypes.map(({ label, value }) => ({ value, label }));
  });

  // Methods
  protected handleCloseForm() {
    this.onBillsFormClose.emit();
  }

  protected resetNewBillForm() {
    this.newBillForm().reset();
    this.newBillFormModel.set(initialFormData);
  }

  protected onBillingTypeChange(type: string) {
    const billType = Object.values(BillTypeEnum).find((billType) => billType === type);
    this.newBillForm.type().controlValue.set(billType!);
  }

  // Submissions
  protected submitNewBillForm(event: Event) {
    event.preventDefault();

    this.isSubmittingForm.set(true);
    const { amount, type, ...rest } = this.newBillFormModel();

    const payload = {
      ...rest,
      amount: amount || 0,
      type: Object.values(BillTypeEnum).find((billType) => billType === type)!,
    };

    this.billService.createNewBill(payload).subscribe({
      next: () => {
        this.toastService.show({
          variant: 'success',
          title: 'Bill added!',
          details: 'Your bill has been added successfully. Now you can track it.',
        });

        this.resetNewBillForm();
        this.onBillsFormClose.emit();
      },
      complete: () => {
        this.isSubmittingForm.set(false);
      },
    });
  }
}
