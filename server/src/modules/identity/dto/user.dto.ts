import { Prisma } from '@prisma/client';

export type LoginInputDto = Pick<Prisma.UserCreateInput, 'email' | 'password'>;
export type RegisterInputDto = Pick<
  Prisma.UserCreateInput,
  'name' | 'email' | 'password'
>;
