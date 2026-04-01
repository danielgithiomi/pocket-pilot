export interface CreateTransactionRequest {
  description: string;
  amount: number | null;
  type: TransactionType | "";
  category: TransactionCategory | "";
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

export interface TransactionWithAccount extends Transaction {
  account: AccountInTransaction;
}

export interface AccountInTransaction {
  id: string;
  name: string;
}

export interface TransactionsWithAccountWithCount {
  data: TransactionWithAccount[];
  count: number;
}

// ENUMS
export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionCategory =
  | "HOUSEHOLD"
  | "GROCERIES"
  | "TRANSPORTATION"
  | "ENTERTAINMENT"
  | "UTILITIES"
  | "HEALTH"
  | "EDUCATION";
