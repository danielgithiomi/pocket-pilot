import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';

@Controller('accounts')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get(':accountId/transactions')
    getTrnasactions(@Param('accountId') accountId: string) {
        return this.transactionService.getTransactionsByAccountId(accountId);
    }
}
