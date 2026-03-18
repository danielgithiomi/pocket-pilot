import { ExposeEnumDto } from '@common/types';
import { plainToInstance } from 'class-transformer';
import { formatEnumForFrontend } from '@libs/utils';
import { DatabaseService } from '@infrastructure/database/database.service';
import { TransactionCategory, TransactionType, Account } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction, CreateTransactionDto, TransactionWithAccount } from '../dto/transaction.dto';

@Injectable()
export class TransactionService {
    constructor(private readonly db: DatabaseService) {}

    async getTransactionTypes(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(TransactionType).map(formatEnumForFrontend));
    }

    async getTransactionCategories(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(TransactionCategory).map(formatEnumForFrontend));
    }

    async getAllTransactions(): Promise<TransactionWithAccount[]> {
        const transactions = await this.db.transaction.findMany({
            include: { account: { select: { id: true, name: true } } },
        });

        return plainToInstance(TransactionWithAccount, transactions);
    }

    async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
        await this.confirmWalletExists(accountId);

        return this.db.transaction.findMany({
            where: { accountId },
            select: { id: true, type: true, category: true, amount: true, date: true },
        });
    }

    async createTransactionByAccountId(
        accountId: string,
        createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        const transformedDto: CreateTransactionDto = {
            ...createTransactionDto,
            type: createTransactionDto.type.toUpperCase() as TransactionType,
        };

        if (transformedDto.type !== TransactionType.EXPENSE && transformedDto.type !== TransactionType.INCOME)
            throw new BadRequestException({
                name: 'INVALID_TRANSACTION_TYPE',
                title: 'Invalid transaction type!',
                message: `The transaction type ${createTransactionDto.type.toUpperCase()} is not valid.`,
            });

        const account = await this.confirmWalletExists(accountId);
        console.log('Transaction service - account:', account);

        return this.db.transaction.create({
            data: {
                accountId,
                ...transformedDto,
            },
            select: { id: true, type: true, category: true, amount: true, date: true },
        });
    }

    private async confirmWalletExists(accountId: string): Promise<Account> {
        const account: Account | null = await this.db.account.findUnique({
            where: { id: accountId },
        });

        if (!account) {
            throw new NotFoundException({
                name: 'ACCOUNT_NOT_FOUND',
                title: 'Account not found!',
                message: `Couldn't create a transaction because the account with ID: {${accountId}} does not exist.`,
            });
        }

        return account;
    }
}
