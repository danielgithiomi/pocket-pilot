import { Input } from '@atoms/input';
import { Select } from '@atoms/select';
import { Button } from '@atoms/button';
import { Form } from '@organisms/form';
import { ToastService } from '@atoms/toast';
import { BillTypeEnum } from '@global/enums';
import { form } from '@angular/forms/signals';
import { CURRENCIES } from '@global/constants';
import { BillsService } from '@api/bills.service';
import { RadioOption, Radio } from '@atoms/radio';
import { DatePicker } from '@organisms/date-picker';
import { LucideAngularModule } from 'lucide-angular';
import { SelectOption } from '@atoms/select/select.types';
import { NewBillSchema, NewBillFormValidationSchema } from './bills-form.types';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'bills-form',
  templateUrl: './bills-form.html',
  imports: [LucideAngularModule, Form, Button, Radio, DatePicker, Input, Select],
})
export class BillsForm implements OnInit {
  // Inputs
  currency = input.required<string>();
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
  private readonly INITIAL_FORM_STATE: NewBillSchema = {
    name: '',
    amount: null,
    currency: 'MUR',
    dueDate: new Date(),
    type: BillTypeEnum.MONTHLY,
  };
  protected readonly minStartDate = signal<Date>(new Date());
  protected readonly newBillFormModel = signal<NewBillSchema>(this.INITIAL_FORM_STATE);
  protected readonly newBillForm = form(this.newBillFormModel, NewBillFormValidationSchema);

  ngOnInit(): void {
    this.newBillForm.currency().controlValue.set(this.currency());
  }

  // Computed
  protected readonly currencies = computed<SelectOption[]>(() => {
    const currenciesToInclude = ['USD', 'EUR', 'GBP', 'AED', 'MUR', 'KES', 'ZAR'];
    const currencies = CURRENCIES.filter((currency) =>
      currenciesToInclude.includes(currency.value),
    );
    return currencies.map((currency) => ({ value: currency.value, label: currency.label }));
  });

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
    this.newBillFormModel.set(this.INITIAL_FORM_STATE);
  }

  protected onBillingTypeChange(type: string) {
    const billType = Object.values(BillTypeEnum).find((billType) => billType === type);
    this.newBillForm.type().controlValue.set(billType!);
  }

  protected onCurrencyChange(currency: string) {
    this.newBillForm.currency().controlValue.set(currency);
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
