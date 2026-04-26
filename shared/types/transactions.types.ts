export interface CreateTransactionRequest {
  type: string;
  category: string;
  description: string;
  amount: number | null;
}

export interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  category: string;
  description: string;
}

export interface AccountInTransaction {
  id: string;
  name: string;
  currency: string;
}

export interface TransactionWithAccount extends Transaction {
  account: AccountInTransaction;
}

export interface TransactionsWithAccountWithCount {
  count: number;
  data: TransactionWithAccount[];
}
