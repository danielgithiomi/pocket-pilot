import { CreateCategoryRequest } from '@global/types';
import { minLength, required, schema } from '@angular/forms/signals';
import { TabListItem } from '@components/ui/atoms/tab-list/tab-list.types';

// DATA
export const categoryTabItems: TabListItem[] = [
  {
    value: 'INCOME',
    label: 'Income',
  },
  {
    value: 'EXPENSE',
    label: 'Expense',
  },
];

// FORM
export type CategorySchema = CreateCategoryRequest;

export const initialCategoryFormState: CategorySchema = {
  categoryName: '',
  categoryType: 'INCOME',
};

export const categoryFormValidationSchema = schema<CategorySchema>((root) => {
  required(root.categoryName, { message: 'The name is required field!' });
  minLength(root.categoryName, 3, { message: 'The name must be at least 3 characters long!' });
});
