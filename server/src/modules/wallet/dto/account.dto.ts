import { Prisma } from '@prisma/client';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export type FullAccount = Prisma.AccountCreateInput;

// INPUT
export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Account name must be at least 3 characters long' })
    @MaxLength(25, { message: 'Account name must be at most 25 characters long' })
    @ApiProperty({ example: 'Expenditure Account', description: 'The name of the account' })
    name!: string;
}

// OUTPUT
@Exclude()
export class Account {
    @Expose()
    @ApiProperty({
        description: 'The ID of the account',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        example: 'Expenditure Account',
        description: 'The name of the account',
    })
    name!: string;

    @Expose()
    @ApiProperty({
        example: 1000,
        description: 'The balance of the account',
    })
    @Type(() => Number)
    balance!: number;

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The creation date of the account',
    })
    @Type(() => Date)
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        example: '2022-01-01T00:00:00.000Z',
        description: 'The update date of the account',
    })
    @Type(() => Date)
    updatedAt!: Date;
}

export type AccountWithTransactions = Prisma.AccountGetPayload<{
    include: { transactions: true };
}>;

export type AccountWithHolder = Prisma.AccountGetPayload<{
    include: { holder: { select: { name: true; email: true } } };
}>;

@Exclude()
export class AccountHolder {
    @Expose()
    @ApiProperty({ example: 'Daniel', description: 'The name of the account holder' })
    name!: string;

    @Expose()
    @ApiProperty({ example: 'daniel@example.com', description: 'The email of the account holder' })
    email!: string;
}

@Exclude()
export class AccountWithHolderDto {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the account' })
    id!: string;

    @Expose()
    @ApiProperty({ example: 'Savings Account', description: 'The name of the account' })
    name!: string;

    @Expose()
    @ApiProperty({
        example: 'Savings Account',
        description: 'The name of the account',
    })
    type!: string;

    @Expose()
    @ApiProperty({ example: 1000, description: 'The balance of the account' })
    balance!: number;

    @Expose()
    @ApiProperty({ example: '2026-02-11T00:00:00.000Z', description: 'Creation date of the account' })
    @Type(() => Date)
    createdAt!: Date;

    @Expose()
    @ApiProperty({ example: '2026-02-11T00:00:00.000Z', description: 'Last update date of the account' })
    @Type(() => Date)
    updatedAt!: Date;

    @Expose()
    @ApiProperty({ example: '5183bc66-22fe-4d07-9166-e53c0b3b9ea7', description: 'The ID of the account holder' })
    @Type(() => String)
    holderId!: string;

    @Expose()
    @ApiProperty({ type: AccountHolder, description: 'The account holder with selected fields' })
    @Type(() => AccountHolder)
    holder!: AccountHolder;
}

// SWAGGER
@ApiExtraModels(AccountWithHolderDto)
export class AccountsResponseDto {
    @ApiProperty({ type: Number, example: 1 })
    count!: number;

    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(AccountWithHolderDto) },
    })
    data!: AccountWithHolderDto[];
}

@ApiExtraModels(AccountWithHolderDto)
export class UserAccountsResponseDto {
    @ApiProperty({ type: Number, example: 1 })
    count!: number;

    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(Account) },
    })
    data!: Account[];
}
