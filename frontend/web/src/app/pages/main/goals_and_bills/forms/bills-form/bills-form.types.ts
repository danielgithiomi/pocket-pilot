import { required, schema, validate } from '@angular/forms/signals';

// FORM
export interface NewBillSchema {
  name: string;
  type: string;
  dueDate: Date;
  currency: string;
  amount: number | null;
}

export const NewBillFormValidationSchema = schema<NewBillSchema>((root) => {
  // Name
  required(root.name, { message: 'The bill name is required field!' });

  // Type
  required(root.type, { message: 'The bill type is required field!' });

  // Currency
  required(root.currency, { message: 'The bill currency is required field!' });

  // Due Date
  required(root.dueDate, { message: 'The bill due date is required field!' });

  // Amount
  required(root.amount, { message: 'The bill amount is required field!' });
  validate(root.amount, (context) => {
    const value = context.value();
    if (value === null) return undefined;

    const asString = value.toString();
    const isValid = /^\d+(\.\d{1,2})?$/.test(asString);

    return isValid
      ? undefined
      : { kind: 'error', message: 'Amount cannot exceed 2 decimal places' };
  });
});
