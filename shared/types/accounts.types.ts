import { Transaction } from "./transactions.types";

export interface CreateAccountRequest {
  name: string;
  type: AccountType | "";
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  holderId: string;
  createdAt: string;
  updatedAt: string;
  type: AccountType;
}

export interface UserAccountsWithCount {
  data: Account[];
  count: number;
}

export type AccountType = "WALLET" | "BANK" | "SAVINGS" | "CREDIT" | "CURRENT";

export interface AccountWithTransactions extends Account {
  transactions: Transaction[];
}
