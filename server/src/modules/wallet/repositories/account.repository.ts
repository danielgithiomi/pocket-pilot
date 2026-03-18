import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from '../dto/account.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class AccountRepository {
    constructor(private readonly db: DatabaseService) {}

    async createNewAccount(userId: string, data: CreateAccountDto) {
        const { name, type } = data;
        return this.db.account.create({ data: { name, type, holderId: userId } });
    }

    async getAccountById(accountId: string) {
        return this.db.account.findUnique({ where: { id: accountId } });
    }
}
