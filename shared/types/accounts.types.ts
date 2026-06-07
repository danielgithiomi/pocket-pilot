import { TransactionInAccount } from "./transactions.types";

export interface CreateAccountPayload {
  name: string;
  currency: string;
  type: AccountType | "";
}

export type UpdateAccountPayload = CreateAccountPayload;

export type UpdateAccountBalanceVisibilityPayload = Omit<
  Required<CreateAccountPayload>,
  "name" | "currency" | "type"
>;

export interface Account {
  id: string;
  name: string;
  balance: number;
  holderId: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  type: AccountType;
  isBalanceVisible: boolean;
}

export interface UserAccountsWithCount {
  data: Account[];
  count: number;
}

export type AccountType = "WALLET" | "BANK" | "SAVINGS" | "CREDIT" | "CURRENT";

export interface AccountWithTransactions {
  count: number;
  data: Account & {
    transactions: TransactionInAccount[];
  };
}
