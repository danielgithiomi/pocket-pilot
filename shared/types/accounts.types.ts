export interface Account {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccountsWithCount {
  accounts: Account[];
  count: number;
}
