import { Prisma } from '@prisma/client';

export type FullTransaction = Prisma.TransactionCreateInput;

export type Transaction = Omit<FullTransaction, 'account'>;
