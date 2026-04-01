import { min, required, schema } from '@angular/forms/signals';

export type TransactionLimitSchema = {
  amount: number;
};

export const TransactionLimitValidationSchema = schema<TransactionLimitSchema>((root) => {
  required(root.amount, { message: 'The amount is required field!' });
  min(root.amount, 1, { message: 'The minimum transaction amount must be at least 1!' });
});
