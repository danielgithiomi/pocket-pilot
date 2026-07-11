import { ExposeEnumDto } from '@common/types';
import { plainToInstance } from 'class-transformer';
import { Account, TransactionType } from '@prisma/client';
import { SSE_EVENT_VARIANT } from '@modules/sse/sse.types';
import { SSEService } from '@modules/sse/services/sse.service';
import { AccountRepository } from '../repositories/account.repository';
import { AccountDetailsCache, AccountsCache } from '../cache/wallet.cache';
import { denormalizeCategoryName, formatEnumForFrontend } from '@libs/utils';
import { TransactionRepository } from '../repositories/transaction.respository';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CompleteTransactionDto, CreateTransactionDto, NegativeBalanceSSEPayload } from '../dto/transaction.dto';

@Injectable()
export class TransactionService {
    constructor(
        private readonly sseService: SSEService,
        private readonly accountsCache: AccountsCache,
        private readonly accountRepository: AccountRepository,
        private readonly accountDetailsCache: AccountDetailsCache,
        private readonly transactionRepository: TransactionRepository
    ) {}

    getTransactionTypes(): ExposeEnumDto[] {
        return Object.values(TransactionType).map(formatEnumForFrontend);
    }

    async getAllTransactions(): Promise<CompleteTransactionDto[]> {
        const transactions = await this.transactionRepository.getAllTransactionsAndAccountData();

        return plainToInstance(CompleteTransactionDto, transactions);
    }

    async getUserTransactions(userId: string): Promise<CompleteTransactionDto[]> {
        const transactions = await this.transactionRepository.getUserTransactionsAndAccountData(userId);

        return plainToInstance(CompleteTransactionDto, transactions);
    }

    async getAllTransactionsRelatedToAccountId(accountId: string): Promise<CompleteTransactionDto[]> {
        const transactions = await this.transactionRepository.getAllTransactionsRelatedToAccountId(accountId);

        return plainToInstance(CompleteTransactionDto, transactions);
    }

    async createTransactionByAccountId(
        userId: string,
        accountId: string,
        createTransactionDto: CreateTransactionDto
    ): Promise<CompleteTransactionDto> {
        const transformedDto: CreateTransactionDto = {
            ...createTransactionDto,
            category: denormalizeCategoryName(createTransactionDto.category)
        };

        if (!this.isTransactionTypeValid(transformedDto.type))
            throw new BadRequestException({
                name: 'INVALID_TRANSACTION_TYPE',
                title: 'Invalid transaction type!',
                message: `The transaction type ${transformedDto.type} is not valid.`
            });

        const account: Account = await this.confirmAccountExists(accountId);

        if (!this.isAccountOwnedByUser(userId, account.holderId))
            throw new ForbiddenException({
                name: 'CREATION_FORBIDDEN',
                title: 'Failed to create the transaction!',
                message: 'You are not allowed to create a transaction for this account.'
            });

        this.alertIfNegativeBalance(userId, transformedDto, account);

        const createdTransaction = await this.transactionRepository.createNewTransactionAndUpdateBalance(
            accountId,
            transformedDto
        );

        await this.invalidateAccountCache(userId, accountId);
        return createdTransaction;
    }

    async deleteTransactionByAccountId(userId: string, accountId: string, transactionId: string): Promise<void> {
        const account = await this.confirmAccountExists(accountId);

        if (!this.isAccountOwnedByUser(userId, account.holderId)) {
            throw new ForbiddenException({
                name: 'DELETION_FORBIDDEN',
                title: 'Failed to delete the transaction!',
                message: 'You are not allowed to delete a transaction for this account.'
            });
        }

        await this.transactionRepository.deleteTransactionById(transactionId);
        await this.invalidateAccountCache(userId, accountId);
    }

    // HELPER FUNCTIONS
    private isAccountOwnedByUser(userId: string, accountHolderId: string) {
        return userId === accountHolderId;
    }

    private isTransactionTypeValid(type: string): boolean {
        return type === TransactionType.TRANSFER || type === TransactionType.EXPENSE || type === TransactionType.INCOME;
    }

    private async invalidateAccountCache(userId: string, accountId: string) {
        await this.accountsCache.invalidateCache(userId);
        await this.accountDetailsCache.invalidateCache(accountId);
    }

    private async confirmAccountExists(accountId: string): Promise<Account> {
        const account: Account | null = await this.accountRepository.getAccountById(accountId);

        if (!account)
            throw new NotFoundException({
                name: 'ACCOUNT_NOT_FOUND',
                title: 'Account not found!',
                message: `Couldn't create a transaction because the account with ID: {${accountId}} does not exist.`
            });

        return account;
    }

    private alertIfNegativeBalance(userId: string, transaction: CreateTransactionDto, account: Account): void {
        const { balance } = account;
        const { amount } = transaction;

        if (balance >= amount) return;

        this.sseService.emitToUser<NegativeBalanceSSEPayload>(userId, SSE_EVENT_VARIANT.NEGATIVE_BALANCE, {
            userId,
            account,
            transaction
        });
    }
}
