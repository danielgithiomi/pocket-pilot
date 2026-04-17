import { TabListItem } from '@atoms/tab-list';
import { CategoryTypeEnum } from '@global/enums';
import { CreateCategoryRequest } from '@global/types';
import { minLength, required, schema } from '@angular/forms/signals';

// DATA
export const categoryTabItems: TabListItem[] = [
  {
    value: CategoryTypeEnum.INCOME,
    label: 'Income',
  },
  {
    value: CategoryTypeEnum.EXPENSE,
    label: 'Expense',
  },
];

// FORM
export type CategorySchema = CreateCategoryRequest;

export const initialCategoryFormState: CategorySchema = {
  categoryName: '',
  categoryType: CategoryTypeEnum.INCOME,
};

export const categoryFormValidationSchema = schema<CategorySchema>((root) => {
  required(root.categoryName, { message: 'The name is required field!' });
  minLength(root.categoryName, 3, { message: 'The name must be at least 3 characters long!' });
});
