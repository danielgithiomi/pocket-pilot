import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { FullUser, UserResponseDto, UserWithPreferences, UserWithPreferencesDto } from './user.dto';

export interface ValidationResult {
    isValid: boolean;
    user: UserWithPreferences;
}

export interface JWTPayload {
    sub: string;
    username: string;
    email: string;
    iat: number;
}

// INPUT DTOs
export class LoginInputDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'user@example.com' })
    email!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'P@55w0rd' })
    password!: string;
}

export type RegisterInputDto = Pick<FullUser, 'name' | 'email' | 'password'>;

// OUTPUT DTOs
export interface LoginOutputDto {
    access_token: string;
    refresh_token: string;
    user: UserWithPreferencesDto;
}

export interface RegisterOutputDto {
    user: UserResponseDto;
    access_token: string;
    refresh_token: string;
}
