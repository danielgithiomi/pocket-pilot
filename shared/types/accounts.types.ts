export interface CreateAccountRequest {
  name: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccountsWithCount {
  data: Account[];
  count: number;
}

export interface AccountTypeDto {
  value: string;
  label: string;
}
