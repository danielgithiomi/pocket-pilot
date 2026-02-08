import { Injectable } from '@nestjs/common';
import { Transaction } from '../dto/transaction.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class TransactionService {
    constructor(private readonly db: DatabaseService) {}

    async getAllTransactions(): Promise<Transaction[]> {
        return this.db.transaction.findMany({});
    }

    async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
        return this.db.transaction.findMany({
            where: { accountId },
        });
    }
}
