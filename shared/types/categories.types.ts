export type CategoryVariant = "INCOME" | "EXPENSE";

export interface CreateCategoryRequest {
  name: string;
  type: CategoryVariant;
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
