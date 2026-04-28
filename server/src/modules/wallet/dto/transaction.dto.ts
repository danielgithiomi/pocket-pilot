import { Prisma, TransactionType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export type FullTransaction = Prisma.TransactionCreateInput;

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ enum: TransactionType, description: 'The type of the transaction' })
    type!: TransactionType;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Groceries', description: 'The category of the transaction' })
    category!: string;

    @IsNotEmpty()
    @ApiProperty({ example: 1000, description: 'The amount of the transaction' })
    amount!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Description must not exceed 100 characters' })
    @ApiProperty({ example: 'Dinner with Friends', description: 'The description of the transaction' })
    description!: string;
}

export class CreateTransferTransactionPayload extends CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The ID of the account to transfer from',
    })
    sourceAccountId!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'The ID of the account to transfer to',
    })
    targetAccountId!: string;
}

@Exclude()
export class TransactionDto {
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

    @Expose()
    @ApiProperty({ example: 'Dinner with Friends', description: 'The description of the transaction' })
    description!: string | null;
}

@Exclude()
export class TransactionAccount {
    @Expose()
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The ID of the account' })
    id!: string;

    @Expose()
    @ApiProperty({ example: 'Savings Account', description: 'The name of the owning account' })
    name!: string;

    @Expose()
    @ApiProperty({ example: 'USD', description: 'The currency of the owning account' })
    currency!: string;
}

@Exclude()
export class TransactionWithAccount extends TransactionDto {
    @Expose()
    @Type(() => TransactionAccount)
    @ApiProperty({ type: TransactionAccount, description: 'The owning account of the transaction' })
    account!: TransactionAccount;
}

@Exclude()
export class TransferTransactionDto extends TransactionWithAccount {
    @Expose()
    @Type(() => TransactionAccount)
    @ApiProperty({ type: TransactionAccount, description: 'The source account of the transfer' })
    sourceAccount!: TransactionAccount;

    @Expose()
    @Type(() => TransactionAccount)
    @ApiProperty({ type: TransactionAccount, description: 'The target account of the transfer' })
    targetAccount!: TransactionAccount;
}

@ApiExtraModels(TransactionDto)
export class TransactionsResponseDto {
    @ApiProperty({ example: 3, description: 'The total number of transactions' })
    count!: number;

    @ApiProperty({
        type: 'array',
        items: { $ref: getSchemaPath(TransactionDto) },
    })
    data!: TransactionDto[];
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
