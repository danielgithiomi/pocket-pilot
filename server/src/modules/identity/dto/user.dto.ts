import { Prisma } from '@prisma/client';

export type FullUser = Prisma.UserCreateInput;

export interface JWTPayload {
    sub: string;
    username: string;
    email: string;
    iat: number;
}

// INPUT DTOs
export type LoginInputDto = Pick<FullUser, 'email' | 'password'>;
export type RegisterInputDto = Pick<FullUser, 'name' | 'email' | 'password'>;

// OUTPUT DTOs
export type User = Omit<FullUser, 'password'>;

export interface LoginOutputDto {
    user: User;
    access_token: string;
    refresh_token: string;
}
