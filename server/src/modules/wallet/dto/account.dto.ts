import { Prisma } from '@prisma/client';

export type FullAccount = Prisma.AccountCreateInput;

// INPUT
export type CreateAccountDto = Pick<FullAccount, 'name'>;

// OUTPUT
export type Account = FullAccount;

export interface GetAccountsResponse {
    count: number;
    accounts: Account[];
}
