import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export type FullAccount = Prisma.AccountCreateInput;

// INPUT
export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(25)
    @ApiProperty({
        example: 'Expenditure Account',
        description: 'The name of the account',
    })
    name!: string;
}

// OUTPUT
@Exclude()
export class AccountClass {
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

export type Account = FullAccount;

export type AccountWithTransactions = Prisma.AccountGetPayload<{
    include: { transactions: true };
}>;

export type AccountWithHolder = Prisma.AccountGetPayload<{
    include: { holder: true };
}>;
