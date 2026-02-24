import { ApiProperty } from '@nestjs/swagger';
import { FullUser, UserResponseDto } from './user.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface ValidationResult {
    isValid: boolean;
    user: FullUser;
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
    user: UserResponseDto;
    access_token: string;
    refresh_token: string;
}

export interface RegisterOutputDto {
    user: UserResponseDto;
    access_token: string;
    refresh_token: string;
}