import { ExposeEnumDto } from '@common/types';
import { plainToInstance } from 'class-transformer';
import { AccountsCache } from '../cache/accounts.cache';
import { TransactionType, Account } from '@prisma/client';
import { AccountRepository } from '../repositories/account.repository';
import { DatabaseService } from '@infrastructure/database/database.service';
import { denormalizeCategoryName, formatEnumForFrontend } from '@libs/utils';
import { TransactionRepository } from '../repositories/transaction.respository';
import { TransactionDto, CreateTransactionDto, TransactionWithAccount } from '../dto/transaction.dto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TransactionService {
    constructor(
        private readonly db: DatabaseService,
        private readonly accountsCache: AccountsCache,
        private readonly accountRepository: AccountRepository,
        private readonly transactionRepository: TransactionRepository,
    ) {}

    async getTransactionTypes(): Promise<ExposeEnumDto[]> {
        return await Promise.resolve(Object.values(TransactionType).map(formatEnumForFrontend));
    }

    async getAllTransactions(): Promise<TransactionWithAccount[]> {
        const transactions = await this.transactionRepository.getAllTransactionsAndAccountData();

        return plainToInstance(TransactionWithAccount, transactions);
    }

    async getUserTransactions(userId: string): Promise<TransactionWithAccount[]> {
        const transactions = await this.transactionRepository.getUserTransactionsAndAccountData(userId);

        return plainToInstance(TransactionWithAccount, transactions);
    }

    async getTransactionsByAccountId(accountId: string): Promise<TransactionDto[]> {
        await this.confirmAccountExists(accountId);

        return this.db.transaction.findMany({
            where: { accountId },
            select: { id: true, type: true, description: true, category: true, amount: true, date: true },
        });
    }

    async createTransactionByAccountId(
        userId: string,
        accountId: string,
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionWithAccount> {
        const transformedDto: CreateTransactionDto = {
            ...createTransactionDto,
            type: createTransactionDto.type,
            category: denormalizeCategoryName(createTransactionDto.category),
        };

        if (!this.isTransactionTypeValid(transformedDto.type)) {
            throw new BadRequestException({
                name: 'INVALID_TRANSACTION_TYPE',
                title: 'Invalid transaction type!',
                message: `The transaction type ${transformedDto.type} is not valid.`,
            });
        }

        const account = await this.confirmAccountExists(accountId);

        if (!this.isAccountOwnedByUser(userId, account.holderId)) {
            throw new ForbiddenException({
                name: 'CREATION_FORBIDDEN',
                title: 'Failed to create the transaction!',
                message: 'You are not allowed to create a transaction for this account.',
            });
        }

        const createdTransaction = await this.transactionRepository.createNewTransactionAndUpdateBalance(
            accountId,
            transformedDto,
        );
        this.invalidateAccountCache(userId);
        return createdTransaction;
    }

    async deleteTransactionByAccountId(userId: string, accountId: string, transactionId: string): Promise<void> {
        const account = await this.confirmAccountExists(accountId);

        if (!this.isAccountOwnedByUser(userId, account.holderId)) {
            throw new ForbiddenException({
                name: 'DELETION_FORBIDDEN',
                title: 'Failed to delete the transaction!',
                message: 'You are not allowed to delete a transaction for this account.',
            });
        }

        await this.transactionRepository.deleteTransactionById(transactionId);
        this.invalidateAccountCache(userId);
    }

    private async confirmAccountExists(accountId: string): Promise<Account> {
        const account: Account | null = await this.accountRepository.getAccountById(accountId);

        if (!account)
            throw new NotFoundException({
                name: 'ACCOUNT_NOT_FOUND',
                title: 'Account not found!',
                message: `Couldn't create a transaction because the account with ID: {${accountId}} does not exist.`,
            });

        return account;
    }

    // HELPER FUNCTIONS
    private isAccountOwnedByUser(userId: string, accountHolderId: string) {
        return userId === accountHolderId;
    }

    private isTransactionTypeValid(type: string): boolean {
        return type === TransactionType.TRANSFER || type === TransactionType.EXPENSE || type === TransactionType.INCOME ;
    }

    private invalidateAccountCache(userId: string) {
        this.accountsCache.invalidateCache(userId);
    }
}
