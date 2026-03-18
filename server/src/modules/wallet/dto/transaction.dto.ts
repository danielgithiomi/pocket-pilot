import { Exclude, Expose, Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Prisma, TransactionType, TransactionCategory } from '@prisma/client';

export type FullTransaction = Prisma.TransactionCreateInput;

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ enum: TransactionType, description: 'The type of the transaction' })
    type!: TransactionType;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ enum: TransactionCategory, description: 'The category of the transaction' })
    category!: TransactionCategory;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 1000, description: 'The amount of the transaction' })
    amount!: number;
}

export class TransactionTypeDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Transaction type name must be at least 3 characters long' })
    @MaxLength(25, { message: 'Transaction type name must be at most 25 characters long' })
    @ApiProperty({ example: 'Income', description: 'The name of the transaction type' })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ enum: TransactionCategory, description: 'The category of the transaction type' })
    type!: TransactionCategory;
}

@Exclude()
export class Transaction {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the transaction' })
    id!: string;

    @Expose()
    @ApiProperty({ example: 'INCOME', description: 'The type of the transaction' })
    type!: string;

    @Expose()
    @ApiProperty({ example: 'Groceries', description: 'The type of the transaction' })
    category!: string;

    @Expose()
    @ApiProperty({ example: 1000, description: 'The amount of the transaction' })
    amount!: number;

    @Expose()
    @Type(() => Date)
    @ApiProperty({ example: '2026-02-11T00:00:00.000Z', description: 'The date of the transaction' })
    date!: Date;
}

@Exclude()
export class TransactionAccount {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the account' })
    id!: string;

    @Expose()
    @ApiProperty({ example: 'Savings Account', description: 'The name of the owning account' })
    name!: string;
}

@Exclude()
export class TransactionWithAccount extends Transaction {
    @Expose()
    @Type(() => TransactionAccount)
    @ApiProperty({ type: TransactionAccount, description: 'The owning account of the transaction' })
    account!: TransactionAccount;
}

@ApiExtraModels(Transaction)
export class TransactionsResponseDto {
    @ApiProperty({ example: 3, description: 'The total number of transactions' })
    count!: number;

    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(Transaction) },
    })
    data!: Transaction[];
}

@ApiExtraModels(TransactionWithAccount)
export class TransactionsWithAccountResponseDto {
    @ApiProperty({ example: 1, description: 'The number of transactions for the account' })
    count!: number;

    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(TransactionWithAccount) },
    })
    data!: TransactionWithAccount[];
}
