import { Account } from '@prisma/client';
import { DatabaseService } from '@infrastructure/database/database.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto, AccountWithHolder, AccountWithTransactions } from '../dto/account.dto';

@Injectable()
export class AccountService {
    constructor(private readonly db: DatabaseService) {}

    getAllAccounts(): Promise<AccountWithHolder[]> {
        return this.db.account.findMany({
            include: { holder: { select: { name: true, email: true } } },
        });
    }

    getUserAccounts(holderId: string): Promise<Account[]> {
        return this.db.account.findMany({ where: { holderId } });
    }

    async getAccountById(userId: string, accountId: string): Promise<Account> {
        const accounts = await this.getUserAccounts(userId);
        return this.verifyAccountAndOwnership(accounts, userId, accountId);
    }

    async getAccountAndTransactions(userId: string, accountId: string): Promise<AccountWithTransactions> {
        const accounts: Account[] = await this.getUserAccounts(userId);
        const foundAccount = this.verifyAccountAndOwnership(accounts, userId, accountId);

        const account = await this.db.account.findUnique({
            where: { id: foundAccount.id },
            include: { transactions: true },
        });

        if (!account) {
            throw new NotFoundException({
                message: 'Account Not Found',
                details: `The account with id: {${accountId}} was not found.`,
            });
        }

        return account;
    }

    createAccount(userId: string, data: CreateAccountDto): Promise<Account> {
        return this.db.account.create({ data: { name: data.name, holderId: userId } });
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
                message: 'Account Not Found',
                details: `The account you are trying to access with id: {${accountId}} does not exist.`,
            });

        const isAccountOwner = accountExists.holderId === userId;

        if (!isAccountOwner)
            throw new ForbiddenException({
                message: 'Account Access Forbidden',
                details: `You do not have permission to access the account with id: {${accountId}}`,
            });

        return accountExists;
    }
}
