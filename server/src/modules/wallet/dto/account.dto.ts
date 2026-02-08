import { Prisma } from '@prisma/client';

export type CreateAccountDto = Pick<Prisma.AccountCreateInput, 'name'>;
