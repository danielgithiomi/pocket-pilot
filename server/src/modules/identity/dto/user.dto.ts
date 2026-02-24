import { Prisma } from '@prisma/client';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
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

@Exclude()
export class UserResponseDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier for the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        example: 'johndoe@test.com',
        description: 'Email address of the user',
    })
    email!: string;

    @Expose()
    @ApiProperty({
        example: 'John Doe',
        description: 'Name of the user',
    })
    name!: string;

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Date and time when the user was created',
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Date and time when the user was last updated',
    })
    updatedAt!: Date;
}

// SWAGGER
@ApiExtraModels(UserResponseDto)
export class UsersWithCountResponseDto{
    @ApiProperty({type: Number, example: 1})
    count!: number;

    @ApiProperty({type: 'array', items: { $ref: getSchemaPath(UserResponseDto) }})
    data!: UserResponseDto[];
}
