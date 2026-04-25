import { Injectable } from '@nestjs/common';
import { CreateAccountDto, UpdateAccountPayload } from '../dto/account.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class AccountRepository {
    constructor(private readonly db: DatabaseService) {}

    createNewAccount(userId: string, payload: CreateAccountDto) {
        const { name, type, currency } = payload;
        return this.db.account.create({ data: { name, type, currency, holderId: userId } });
    }

    getAllApplicationAccounts() {
        return this.db.account.findMany({
            include: { holder: { select: { name: true, email: true } } },
        });
    }

    getUserAccounts(holderId: string) {
        return this.db.account.findMany({ where: { holderId } });
    }

    getAccountById(accountId: string) {
        return this.db.account.findUnique({ where: { id: accountId } });
    }

    getAccountWithTransactions(accountId: string) {
        return this.db.account.findUnique({
            where: { id: accountId },
            include: { transactions: { omit: { accountId: true } } },
        });
    }

    updateAccountById(accountId: string, payload: UpdateAccountPayload) {
        return this.db.account.update({ where: { id: accountId }, data: payload });
    }

    deleteAccountById(userId: string, accountId: string) {
        return this.db.account.delete({ where: { id: accountId, holderId: userId } });
    }
}
