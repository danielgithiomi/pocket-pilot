import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from '../dto/account.dto';
import { DatabaseService } from '@infrastructure/database/database.service';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
    constructor(private readonly db: DatabaseService) {}

    getUserAccounts(holderId: string): Promise<Account[]> {
        return this.db.account.findMany({ where: { holderId } });
    }

    createAccount(userId: string, data: CreateAccountDto): Promise<Account> {
        return this.db.account.create({
            data: {
                name: data.name,
                holderId: userId,
            },
        });
    }

    async deleteAccountById(userId: string, accountId: string): Promise<Account> {
        const accounts: Account[] = await this.getUserAccounts(userId);

        const accountExists = accounts.find(account => account.id === accountId);

        if (!accountExists)
            throw new NotFoundException({
                message: 'Account Not Found',
                details: `The account you are trying to delete with id: {${accountId}} does not exist.`,
            });

        const isAccountOwner = accountExists.holderId === userId;

        if (!isAccountOwner)
            throw new ForbiddenException({
                message: 'Account Deletion Forbidden',
                details: `You do not have permission to delete the account with id: {${accountId}}`,
            });

        return this.db.account.delete({ where: { id: accountId, holderId: userId } });
    }
}
