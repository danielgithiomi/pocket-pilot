import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class TransactionService {
    constructor(private readonly db: DatabaseService) {}

    getTransactionsByAccountId(accountId: string) {
        return this.db.transaction.findMany({
            where: { accountId },
        });
    }
}
