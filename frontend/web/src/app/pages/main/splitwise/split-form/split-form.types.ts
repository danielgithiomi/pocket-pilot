import { SplittableOrder } from '@global/types';
import { required, schema } from '@angular/forms/signals';
import { PaymentOption } from './step-3/split-form-step-3.types';

export interface SplitFormSchema {
  eventDate: Date;
  eventName: string;
  squadName: string;
  eventMembers: string[];
  billingCurrency: string;
  splittables: SplittableOrder[];
  verificationTotal: number | null;
  billPayerStrategy: PaymentOption;
}

export const InitialSplitFormState = {
  eventName: '',
  squadName: '',
  splittables: [],
  eventMembers: [],
  eventDate: new Date(),
  verificationTotal: null,
  billPayerStrategy: 'one' as PaymentOption,
};

export const SplitFormValidationSchema = schema<SplitFormSchema>((root) => {
  // Name
  required(root.eventName, { message: 'The event name is required field!' });

  // Date
  required(root.eventDate, { message: 'The event date is required field!' });

  // Squad
  required(root.squadName, { message: 'The squad name is required field!' });

  // Billing Currency
  required(root.billingCurrency, { message: 'The billing currency is required field!' });

  // Members
  required(root.eventMembers, { message: 'The event members are required field!' });
});
