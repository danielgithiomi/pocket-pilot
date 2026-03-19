import { min, required, schema, validate } from '@angular/forms/signals';
import { CreateTransactionRequest, TransactionCategory, TransactionType } from '@global/types';

// TABLE
export interface TransactionRow {
  id: string;
  date: string;
  fullId: string;
  amount: string;
  accountId: string;
  accountName: string;
  type: TransactionType;
  category: TransactionCategory;
}

// FORM
export type TransactionSchema = CreateTransactionRequest & {
  accountId: string;
};

export const initialTransactionFormState: TransactionSchema = {
  type: '',
  amount: null,
  category: '',
  accountId: '',
};

export const transactionFormValidationSchema = schema<TransactionSchema>((root) => {
  required(root.amount, { message: 'The amount is required field!' });
  min(root.amount, 1, { message: 'The minimum transaction amount must be at least 1!' });

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
