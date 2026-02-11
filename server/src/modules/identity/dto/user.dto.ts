import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export type FullUser = Prisma.UserCreateInput;

// INPUT
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password!: string;
}

// OUTPUT DTOs
export type User = Omit<FullUser, 'password'>;

export class UserResponseDto {
    @ApiProperty({
        description: 'Unique identifier for the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @ApiProperty({
        example: 'johndoe@test.com',
        description: 'Email address of the user',
    })
    email!: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Name of the user',
    })
    name!: string;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Date and time when the user was created',
    })
    createdAt!: Date;

    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Date and time when the user was last updated',
    })
    updatedAt!: Date;
}
