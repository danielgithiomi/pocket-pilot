import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { CreateAccountDto, ToggleAccountBalanceVisibilityPayload, UpdateAccountPayload } from '../dto/account.dto';

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
        return this.db.account.findMany({ where: { holderId }, orderBy: { createdAt: 'desc' } });
    }

    getAccountById(accountId: string) {
        return this.db.account.findUnique({ where: { id: accountId } });
    }

    getAccountWithTransactions(accountId: string) {
        return this.db.account.findUnique({
            where: { id: accountId },
            include: {
                incomingTransactions: true,
                outgoingTransactions: true,
            },
        });
    }

    updateAccountById(accountId: string, payload: UpdateAccountPayload) {
        return this.db.account.update({ where: { id: accountId }, data: payload });
    }

    toggleAccountBalanceVisibilityById(accountId: string, payload: ToggleAccountBalanceVisibilityPayload) {
        return this.db.account.update({
            where: { id: accountId },
            data: { isBalanceVisible: payload.isBalanceVisible },
        });
    }

    deleteAccountById(userId: string, accountId: string) {
        return this.db.account.delete({ where: { id: accountId, holderId: userId } });
    }
}
