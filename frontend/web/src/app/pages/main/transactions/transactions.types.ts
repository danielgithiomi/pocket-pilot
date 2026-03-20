import { min, required, schema, validate } from '@angular/forms/signals';
import { TabListItem } from '@components/ui/atoms/tab-list/tab-list.types';
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

// SKELETON
export const skeletonData: TransactionRow[] = Array(10).fill({
  fullId: '<div class="table-skeleton"></div>',
  type: '<div class="table-skeleton"></div>',
  category: '<div class="table-skeleton"></div>',
  accountId: '<div class="table-skeleton"></div>',
  date: '<div class="table-skeleton"></div>',
  id: '<div class="table-skeleton"></div>',
  amount: '<div class="table-skeleton"></div>',
  accountName: '<div class="table-skeleton"></div>',
});

// TAB LIST
export const tabListItems: TabListItem[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'income',
    label: 'Income',
  },
  {
    value: 'expense',
    label: 'Expense',
  },
];
