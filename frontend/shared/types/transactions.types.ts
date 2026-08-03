export interface CreateTransactionRequest {
  type: string;
  category: string;
  description: string;
  amount: number | null;
  sourceAccountId: string;
  targetAccountId: string;
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

export interface TransactionInAccount extends Transaction {
  sourceAccountId: string;
  targetAccountId: string | null;
}

export interface TransactionWithAccount extends Transaction {
  sourceAccount: AccountInTransaction;
  targetAccount: AccountInTransaction | null;
}

export interface TransactionsWithAccountWithCount {
  count: number;
  data: TransactionWithAccount[];
}
