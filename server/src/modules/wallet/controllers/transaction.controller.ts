import { CookiesAuthGuard } from '@common/guards';
import { WithCountResponse } from '@common/types';
import { Transaction } from '../dto/transaction.dto';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';

@Controller('accounts')
@UseGuards(CookiesAuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get('transactions/all')
    async getAllTransactions(): Promise<WithCountResponse<Transaction>> {
        const allTransactions: Transaction[] = await this.transactionService.getAllTransactions();

        return {
            count: allTransactions.length,
            data: allTransactions,
        };
    }

    @Get(':accountId/transactions')
    async getTransactionsByAccountId(@Param('accountId') accountId: string): Promise<WithCountResponse<Transaction>> {
        const accountTransactions: Transaction[] = await this.transactionService.getTransactionsByAccountId(accountId);

        return {
            count: accountTransactions.length,
            data: accountTransactions,
        };
    }
}
