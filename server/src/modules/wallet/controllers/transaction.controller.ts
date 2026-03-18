import { ExposeEnumDto } from '@common/types';
import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { UserResponseDto } from '@modules/identity/dto/user.dto';
import { TransactionService } from '../services/transaction.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Transaction,
    CreateTransactionDto,
    TransactionWithAccount,
    TransactionsResponseDto,
    TransactionsWithAccountResponseDto,
} from '../dto/transaction.dto';

@Controller('accounts')
@ApiTags('Transactions')
@ApiCookieAuth('access_token')
@UseGuards(CookiesAuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get('transactions/categories')
    @ApiOperation({ summary: 'Get transaction categories', description: 'Get all transaction categories' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Returns all transaction categories.',
    })
    async getTransactionCategories(): Promise<ExposeEnumDto[]> {
        return this.transactionService.getTransactionCategories();
    }

    @Get('transactions/types')
    @ApiOperation({ summary: 'Get transaction types', description: 'Get all transaction types' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Returns all transaction types.',
    })
    async getTransactionTypes(): Promise<ExposeEnumDto[]> {
        return this.transactionService.getTransactionTypes();
    }

    @Get('transactions/user')
    @ApiOperation({ summary: 'Get all user transactions', description: 'Get all transactions for the current user' })
    @ApiResponse({
        status: 200,
        type: TransactionsWithAccountResponseDto,
        description: 'Returns all database transactions.',
    })
    async getUserTransactions(@UserInRequest() user: UserResponseDto): Promise<TransactionsWithAccountResponseDto> {
        const userTransactions: TransactionWithAccount[] = await this.transactionService.getUserTransactions(user.id);

        return {
            count: userTransactions.length,
            data: userTransactions,
        };
    }

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
        type: TransactionWithAccount,
        description: 'Returns the created transaction with minimal account data.',
    })
    createTransactionByAccountId(
        @Param('accountId') accountId: string,
        @UserInRequest() currentUser: UserResponseDto,
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionWithAccount> {
        const { id: userId } = currentUser;
        return this.transactionService.createTransactionByAccountId(userId, accountId, createTransactionDto);
    }
}
