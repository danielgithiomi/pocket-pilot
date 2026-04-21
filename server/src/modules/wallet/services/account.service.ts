import { ExposeEnumDto } from '@common/types';
import { formatEnumForFrontend } from '@libs/utils';
import { plainToInstance } from 'class-transformer';
import { Account, AccountType, Prisma } from '@prisma/client';
import { AccountsCache } from '@modules/wallet/cache/accounts.cache';
import { AccountRepository } from '../repositories/account.repository';
import { TransactionRepository } from '../repositories/transaction.respository';
import { AccountWithHolder, AccountWithTransactionsDto, CreateAccountDto } from '../dto/account.dto';
import {
    Injectable,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AccountService {
    constructor(
        private readonly cache: AccountsCache,
        private readonly accountRepository: AccountRepository,
        private readonly transactionRepository: TransactionRepository,
    ) {}

    async getAccountTypes(): Promise<ExposeEnumDto[]> {
        return Promise.resolve(Object.values(AccountType).map(formatEnumForFrontend));
    }

    async getAllAccounts(): Promise<AccountWithHolder[]> {
        return this.cache.getOrSetCache<AccountWithHolder[]>('all', () =>
            this.accountRepository.getAllApplicationAccounts(),
        );
    }

    async getUserAccounts(holderId: string): Promise<Account[]> {
        return this.cache.getOrSetCache<Account[]>(holderId, () => this.accountRepository.getUserAccounts(holderId));
    }

    async getAccountById(userId: string, accountId: string): Promise<Account> {
        const accounts = await this.getUserAccounts(userId);
        return this.verifyAccountAndOwnership(accounts, userId, accountId);
    }

    async getAccountAndTransactions(userId: string, accountId: string): Promise<AccountWithTransactionsDto> {
        const accounts: Account[] = await this.getUserAccounts(userId);
        const foundAccount = this.verifyAccountAndOwnership(accounts, userId, accountId);

        const account = await this.accountRepository.getAccountWithTransactions(foundAccount.id);

        if (!account) {
            throw new NotFoundException({
                name: 'ACCOUNT_NOT_FOUND',
                title: 'Account Not Found',
                details: `The account with id: {${accountId}} was not found.`,
            });
        }

        return plainToInstance(AccountWithTransactionsDto, account);
    }

    async createAccount(userId: string, data: CreateAccountDto): Promise<Account> {
        try {
            const newAccountData: CreateAccountDto = {
                ...data,
                name: data.name.toLowerCase(),
            };

            const createdAccount = await this.accountRepository.createNewAccount(userId, newAccountData);
            await this.cache.invalidateCache(userId);
            return createdAccount;
        } catch (error) {
            if (this.isPrismaError(error) === 'unique-constraint') {
                throw new ConflictException({
                    name: 'ACCOUNT_NAME_CONFLICT',
                    title: 'Account Already Exists!',
                    details: `You already have an account with the name: [${data.name}].`,
                });
            }

            throw new InternalServerErrorException({
                name: 'ACCOUNT_CREATION_FAILED',
                title: 'Failed to create account!',
                details: 'An unexpected error occurred while creating the account.',
            });
        }
    }

    async deleteAccountById(userId: string, accountId: string): Promise<Account> {
        const accounts: Account[] = await this.getUserAccounts(userId);

        const foundAccount = this.verifyAccountAndOwnership(accounts, userId, accountId);

        if (await this.accountHasTransactions(foundAccount.id)) {
            throw new ConflictException({
                name: 'ACCOUNT_DELETE_FAILED',
                title: 'Account Delete Failed!',
                details: 'This account has transactions and cannot be deleted.',
            });
        }

        const deletedAccount = await this.accountRepository.deleteAccountById(userId, accountId);
        await this.cache.invalidateCache(userId);
        return deletedAccount;
    }

    private verifyAccountAndOwnership(accounts: Account[], userId: string, accountId: string): Account {
        const accountExists = accounts.find(account => account.id === accountId);

        if (!accountExists)
            throw new NotFoundException({
                name: 'ACCOUNT_NOT_FOUND',
                title: 'Account Not Found',
                details: `The account you are trying to access with id: {${accountId}} does not exist.`,
            });

        const isAccountOwner = accountExists.holderId === userId;

        if (!isAccountOwner)
            throw new ForbiddenException({
                name: 'ACCOUNT_ACCESS_FORBIDDEN',
                title: 'Account Access Forbidden',
                details: `You do not have permission to access the account with id: {${accountId}}`,
            });

        return accountExists;
    }

    // HELPER FUNCTIONS
    private isPrismaError(error: unknown): string {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    return 'unique-constraint';
                case 'P2003':
                    return 'relation-constraint';
                default:
                    return 'unknown';
            }
        }
        return 'non-prisma';
    }

    private async accountHasTransactions(accountId: string): Promise<boolean> {
        const accountTransactionCount = await this.transactionRepository.getTransactionCountByAccountId(accountId);
        return accountTransactionCount > 0;
    }
}
