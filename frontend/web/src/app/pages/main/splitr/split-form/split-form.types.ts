import { required, schema } from '@angular/forms/signals';
import { SplittableOrder, BillPayerPayload, PaymentStrategyVariant } from '@global/types';

export interface SplitFormSchema {
    eventDate: Date;
    eventName: string;
    squadName: string;
    isSettled: boolean;
    eventMembers: string[];
    billingCurrency: string;
    billPayers: BillPayerPayload[];
    verificationTotal: number | null;
    eventSplittables: SplittableOrder[];
    billPaymentStrategy: PaymentStrategyVariant;
}

export const InitialSplitFormState = {
    eventName: '',
    squadName: '',
    billPayers: [],
    eventMembers: [],
    isSettled: false,
    eventSplittables: [],
    eventDate: new Date(),
    verificationTotal: null,
    billPaymentStrategy: 'ONE' as PaymentStrategyVariant
};

export const SplitFormValidationSchema = schema<SplitFormSchema>((root) => {
    // Name
    required(root.eventName, { message: 'The event name is required field!' });

    // Date
    required(root.eventDate, { message: 'The event date is required field!' });

    // Squad
    required(root.squadName, { message: 'The squad name is required field!' });

    // Members
    required(root.eventMembers, { message: 'The event members are required field!' });

    // Billing Currency
    required(root.billingCurrency, { message: 'The billing currency is required field!' });
});
