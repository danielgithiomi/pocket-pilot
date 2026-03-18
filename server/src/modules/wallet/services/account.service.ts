import { formatEnumForFrontend } from '@libs/utils';
import { plainToInstance } from 'class-transformer';
import { Account, Prisma, AccountType } from '@prisma/client';
import { AccountRepository } from '../repositories/account.repository';
import { DatabaseService } from '@infrastructure/database/database.service';
import { CreateAccountDto, AccountWithHolder, AccountWithTransactionsDto, AccountTypeDto } from '../dto/account.dto';
import {
    Injectable,
    ConflictException,
    NotFoundException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AccountService {
    constructor(
        private readonly db: DatabaseService,
        private readonly accountRepository: AccountRepository,
    ) {}

    async getAccountTypes(): Promise<AccountTypeDto[]> {
        return Promise.resolve(Object.values(AccountType).map(formatEnumForFrontend));
    }

    async getAllAccounts(): Promise<AccountWithHolder[]> {
        return this.db.account.findMany({
            include: { holder: { select: { name: true, email: true } } },
        });
    }

    async getUserAccounts(holderId: string): Promise<Account[]> {
        return this.db.account.findMany({ where: { holderId } });
    }

    async getAccountById(userId: string, accountId: string): Promise<Account> {
        const accounts = await this.getUserAccounts(userId);
        return this.verifyAccountAndOwnership(accounts, userId, accountId);
    }

    async getAccountAndTransactions(userId: string, accountId: string): Promise<AccountWithTransactionsDto> {
        const accounts: Account[] = await this.getUserAccounts(userId);
        const foundAccount = this.verifyAccountAndOwnership(accounts, userId, accountId);

        const account = await this.db.account.findUnique({
            where: { id: foundAccount.id },
            include: { transactions: { select: { id: true, amount: true, type: true, date: true } } },
        });

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
            return await this.accountRepository.createNewAccount(userId, data);
        } catch (error) {
            if (this.isPrismaUniqueConstraintError(error)) {
                throw new ConflictException({
                    name: 'ACCOUNT_NAME_CONFLICT',
                    title: 'Account Already Exists!',
                    details: `You already have an account with the name: {${data.name}}.`,
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

        return this.db.account.delete({ where: { id: foundAccount.id, holderId: userId } });
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
    private isPrismaUniqueConstraintError(error: unknown): boolean {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return error.code === 'P2002';
        }
        return false;
    }
}
