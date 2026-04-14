import { Prisma } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { UserPreferencesDto } from './onboarding.dto';

export type FullUser = Prisma.UserCreateInput;

export type UserWithPreferences = Prisma.UserGetPayload<{
    include: {
        userPreferences: true;
    };
}>;

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

export class UpdateUserDto {
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
    phoneNumber!: string;
}

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    newPassword!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    currentPassword!: string;
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
        example: '+1234567890',
        description: 'Phone number of the user',
    })
    phoneNumber!: string;

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

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'Date and time when the user last logged in',
    })
    lastLoginAt!: Date | null;

    @Expose()
    @ApiProperty({
        example: 0,
        description: 'Number of failed login attempts',
    })
    failedLoginAttempts!: number;

    @Expose()
    @ApiProperty({
        example: false,
        description: 'Whether the account is locked',
    })
    isAccountLocked!: boolean;

    @Expose()
    @ApiProperty({
        example: true,
        description: 'Whether the user has completed onboarding',
    })
    isOnboarded!: boolean;
}

@Exclude()
@ApiExtraModels(UserPreferencesDto)
export class UserWithPreferencesDto extends UserResponseDto {
    @Expose()
    @Type(() => UserPreferencesDto)
    @ApiProperty({
        type: UserPreferencesDto,
        description: 'User preferences',
    })
    userPreferences!: UserPreferencesDto;
}

// SWAGGER
@ApiExtraModels(UserWithPreferencesDto)
export class UsersWithCountResponseDto {
    @ApiProperty({ type: Number, example: 1 })
    count!: number;

    @ApiProperty({ type: 'array', items: { $ref: getSchemaPath(UserWithPreferencesDto) } })
    data!: UserWithPreferencesDto[];
}
