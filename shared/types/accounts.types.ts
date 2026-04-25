import { Transaction } from "./transactions.types";

export interface CreateAccountPayload {
  name: string;
  currency: string;
  type: AccountType | "";
}

export type UpdateAccountPayload = CreateAccountPayload;

export interface Account {
  id: string;
  name: string;
  balance: number;
  holderId: string;
  currency: string;
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
  count: number;
  data: Account & {
    transactions: Transaction[];
  };
}
