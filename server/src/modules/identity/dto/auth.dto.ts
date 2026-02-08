import { FullUser } from './user.dto';

export interface ValidationResult {
    isValid: boolean;
    user: FullUser;
}

export interface LoginOutputDto {
    user: FullUser;
    access_token: string;
    refresh_token: string;
}

export interface JWTPayload {
    sub: string;
    username: string;
    email: string;
    iat: number;
}

// INPUT DTOs
export type LoginInputDto = Pick<FullUser, 'email' | 'password'>;
export type RegisterInputDto = Pick<FullUser, 'name' | 'email' | 'password'>;
