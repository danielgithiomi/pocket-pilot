export type CategoryVariant = 'INCOME' | 'EXPENSE';

export interface CreateCategoryRequest {
  categoryName: string;
  categoryType: CategoryVariant;
}

interface UserMetaData {
  id: string;
  name: string;
}

export interface Categories {
  id: string;
  incomes: string[];
  expenses: string[];
  createdAt: string;
  updatedAt: string;
  user: UserMetaData;
}
