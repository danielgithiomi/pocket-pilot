import { ApiTags } from '@nestjs/swagger';
import { CookiesAuthGuard } from '@common/guards';
import { WithCountResponse } from '@common/types';
import { TransactionService } from '../services/transaction.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { type CreateTransactionDto, type Transaction } from '../dto/transaction.dto';

@ApiTags('Transactions')
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

    @Post(':accountId/transactions')
    createTransactionByAccountId(
        @Param('accountId') accountId: string,
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        return this.transactionService.createTransactionByAccountId(accountId, createTransactionDto);
    }
}
