import { CreateTransactionRequest } from '@global/types';
import { min, minLength, required, schema, validate } from '@angular/forms/signals';

export type TransactionSchema = CreateTransactionRequest;

export const initialTransactionFormState: TransactionSchema = {
  amount: 0,
  type: '',
  category: '',
};

export const transactionFormValidationSchema = schema<TransactionSchema>((root) => {
  required(root.amount, { message: 'The amount is required field!' });
  min(root.amount, 1, { message: 'The minimum transaction amount must be at least 1.00!' });

  validate(root.type, (context) => {
    const type = context.value();
    if (!type || type.trim() === '') {
      return {
        kind: 'type-required',
        message: 'The transaction type is required field!',
      };
    }
    return null;
  });

  validate(root.category, (context) => {
    const category = context.value();
    if (!category || category.trim() === '') {
      return {
        kind: 'category-required',
        message: 'The transaction category is required field!',
      };
    }
    return null;
  });
});
