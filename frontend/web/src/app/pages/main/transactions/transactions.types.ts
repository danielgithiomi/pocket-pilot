import { CreateTransactionRequest } from '@global/types';
import { TabListItem } from '@components/ui/atoms/tab-list/tab-list.types';
import { maxLength, min, required, schema, validate } from '@angular/forms/signals';

// TABLE
export interface TransactionRow {
  id: string;
  date: string;
  type: string;
  fullId: string;
  amount: string;
  category: string;
  accountId: string;
  accountName: string;
  description: string;
}

// FORM
export type TransactionSchema = CreateTransactionRequest & {
  accountId: string;
  description: string;
};

export const initialTransactionFormState: TransactionSchema = {
  type: '',
  amount: null,
  category: '',
  accountId: '',
  description: '',
};

export const transactionFormValidationSchema = schema<TransactionSchema>((root) => {
  maxLength(root.description, 50, { message: 'The description must be less than 50 characters!' });

  required(root.amount, { message: 'The amount is required field!' });
  min(root.amount, 1, { message: 'The minimum transaction amount must be at least 1!' });
  validate(root.amount, (context) => {
    const value = context.value();
    if (value === null) return undefined;

    const asString = value.toString();
    const isValid = /^\d+(\.\d{1,2})?$/.test(asString);

    return isValid
      ? undefined
      : { kind: 'error', message: 'Amount cannot exceed 2 decimal places' };
  });

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

// SKELETON
export const skeletonData = Array(10)
  .fill(null)
  .map((_, index) => ({
    fullId: `<div class="table-skeleton skeleton-${index}"></div>`,
    type: `<div class="table-skeleton skeleton-${index}"></div>`,
    category: `<div class="table-skeleton skeleton-${index}"></div>`,
    accountId: `<div class="table-skeleton skeleton-${index}"></div>`,
    date: `<div class="table-skeleton skeleton-${index}"></div>`,
    id: `<div class="table-skeleton skeleton-${index}"></div>`,
    amount: `<div class="table-skeleton skeleton-${index}"></div>`,
    accountName: `<div class="table-skeleton skeleton-${index}"></div>`,
  })) as unknown as TransactionRow[];

// TAB LIST
export const tabListItems: TabListItem[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'income',
    label: 'Incomes',
  },
  {
    value: 'expense',
    label: 'Expenses',
  },
  {
    value: 'transfers',
    label: 'Transfers',
  },
];
