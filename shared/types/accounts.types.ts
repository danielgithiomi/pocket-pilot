export interface CreateAccountRequest {
  name: string;
  type: AccountType | "";
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  type: AccountType;
}

export interface UserAccountsWithCount {
  data: Account[];
  count: number;
}

export type AccountType = "WALLET" | "BANK" | "SAVINGS" | "CREDIT" | "CURRENT";
