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
  description: string;
  type: TransactionType;
  category: TransactionCategory;
}

export interface TransactionWithAccount extends Transaction {
  account: AccountInTransaction;
}

export interface AccountInTransaction {
  id: string;
  name: string;
  currency: string;
}

export interface TransactionsWithAccountWithCount {
  data: TransactionWithAccount[];
  count: number;
}

// ENUMS
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type TransactionCategory =
  | "HEALTH"
  | "HOUSEHOLD"
  | "GROCERIES"
  | "UTILITIES"
  | "EDUCATION"
  | "ENTERTAINMENT"
  | "TRANSPORTATION";
