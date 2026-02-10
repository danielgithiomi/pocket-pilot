import { Prisma } from '@prisma/client';

export type FullAccount = Prisma.AccountCreateInput;

// INPUT
export type CreateAccountDto = Pick<FullAccount, 'name'>;

// OUTPUT
export type Account = FullAccount;

export type AccountWithTransactions = Prisma.AccountGetPayload<{
    include: { transactions: true };
}>;

export type AccountWithHolder = Prisma.AccountGetPayload<{
    include: { holder: true };
}>;
