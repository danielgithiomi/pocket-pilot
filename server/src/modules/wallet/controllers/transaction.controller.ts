import { CookiesAuthGuard } from '@common/guards';
import { TransactionService } from '../services/transaction.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Transaction,
    TransactionWithAccount,
    TransactionsResponseDto,
    type CreateTransactionDto,
    TransactionsWithAccountResponseDto,
} from '../dto/transaction.dto';

@Controller('accounts')
@ApiTags('Transactions')
@ApiCookieAuth('access_token')
@UseGuards(CookiesAuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get('transactions/all')
    @ApiOperation({ summary: 'Get global transactions', description: 'Get all transactions from all accounts' })
    @ApiResponse({
        status: 200,
        type: TransactionsWithAccountResponseDto,
        description: 'Returns all database transactions.',
    })
    async getAllTransactions(): Promise<TransactionsWithAccountResponseDto> {
        const allTransactions: TransactionWithAccount[] = await this.transactionService.getAllTransactions();

        return {
            count: allTransactions.length,
            data: allTransactions,
        };
    }

    @Get(':accountId/transactions')
    @ApiOperation({ summary: 'Get account transactions', description: 'Get all transactions for the specific account' })
    @ApiParam({
        required: true,
        name: 'accountId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the account to be fetched with its transactions.',
    })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: Transaction,
        description: 'Returns all transactions for the specific account.',
    })
    async getTransactionsByAccountId(@Param('accountId') accountId: string): Promise<TransactionsResponseDto> {
        const accountTransactions: Transaction[] = await this.transactionService.getTransactionsByAccountId(accountId);

        return {
            count: accountTransactions.length,
            data: accountTransactions,
        };
    }

    @Post(':accountId/transactions')
    @ApiOperation({
        summary: 'Create account transaction',
        description: 'Create a new transaction for the specific account',
    })
    @ApiParam({
        required: true,
        name: 'accountId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the account to be updated with the new transaction.',
    })
    @ApiResponse({
        status: 201,
        type: Transaction,
        description: 'Returns the created transaction.',
    })
    createTransactionByAccountId(
        @Param('accountId') accountId: string,
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        return this.transactionService.createTransactionByAccountId(accountId, createTransactionDto);
    }
}
