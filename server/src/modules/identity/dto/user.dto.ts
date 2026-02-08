import { Prisma } from '@prisma/client';

export type FullUser = Prisma.UserCreateInput;

// OUTPUT DTOs
export type User = Omit<FullUser, 'password'>;
