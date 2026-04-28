import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { TransferService } from '../services/transfer.service';
import { UserResponseDto } from '@modules/identity/dto/user.dto';
import { VoidResourceResponse, ExposeEnumDto } from '@common/types';
import { TransactionService } from '../services/transaction.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    TransactionDto,
    CompleteTranferDto,
    CreateTransactionDto,
    TransactionWithAccount,
    TransactionsResponseDto,
    CreateTransferTransactionPayload,
    TransactionsWithAccountResponseDto,
} from '../dto/transaction.dto';

@Controller('accounts')
@ApiTags('Transactions')
@UseGuards(CookiesAuthGuard)
export class TransactionController {
    constructor(
        private readonly transferService: TransferService,
        private readonly transactionService: TransactionService,
    ) {}

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
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all user transactions', description: 'Get all transactions for the current user' })
    @ApiResponse({
        status: 200,
        type: TransactionsWithAccountResponseDto,
        description: 'Returns all database transactions.',
    })
    async getUserTransactions(@UserInRequest() user: UserResponseDto): Promise<TransactionsWithAccountResponseDto> {
        const userTransactions: CompleteTranferDto[] = await this.transactionService.getUserTransactions(user.id);

        return {
            count: userTransactions.length,
            data: userTransactions,
        };
    }

    @Get('transactions/all')
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get global transactions', description: 'Get all transactions from all accounts' })
    @ApiResponse({
        status: 200,
        type: TransactionsWithAccountResponseDto,
        description: 'Returns all database transactions.',
    })
    async getAllTransactions(): Promise<TransactionsWithAccountResponseDto> {
        const allTransactions: CompleteTranferDto[] = await this.transactionService.getAllTransactions();

        return {
            count: allTransactions.length,
            data: allTransactions,
        };
    }

    @Get(':accountId/transactions')
    @ApiCookieAuth('access_token')
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
        type: TransactionDto,
        description: 'Returns all transactions for the specific account.',
    })
    async getTransactionsByAccountId(@Param('accountId') accountId: string): Promise<TransactionsResponseDto> {
        const accountTransactions: TransactionDto[] =
            await this.transactionService.getTransactionsByAccountId(accountId);

        return {
            count: accountTransactions.length,
            data: accountTransactions,
        };
    }

    @Post(':accountId/transactions')
    @ApiCookieAuth('access_token')
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

    @Post(':accountId/transfer')
    @ApiCookieAuth('access_token')
    @ApiOperation({
        summary: 'Transfer money between accounts',
        description: 'Transfer money between two accounts',
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
    async transferMoneyBetweenAccounts(
        @Param('accountId') accountId: string,
        @UserInRequest() currentUser: UserResponseDto,
        @Body() transferTransactionPayload: CreateTransferTransactionPayload,
    ): Promise<CompleteTranferDto> {
        const { id: userId } = currentUser;

        return this.transferService.createTransactionAndTransferAmountBetweenAccounts(
            userId,
            accountId,
            transferTransactionPayload,
        );
    }

    @Delete(':accountId/transactions/:transactionId')
    @ApiCookieAuth('access_token')
    @ApiOperation({
        summary: 'Delete account transaction',
        description: 'Delete a transaction for the specific account',
    })
    @ApiParam({
        required: true,
        name: 'accountId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the account to be updated with the new transaction.',
    })
    @ApiParam({
        required: true,
        name: 'transactionId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the transaction to be deleted.',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the deleted transaction.',
    })
    async deleteTransactionByAccountId(
        @Param('accountId') accountId: string,
        @Param('transactionId') transactionId: string,
        @UserInRequest() currentUser: UserResponseDto,
    ): Promise<VoidResourceResponse> {
        const { id: userId } = currentUser;

        await this.transactionService.deleteTransactionByAccountId(userId, accountId, transactionId);

        return {
            message: 'Transaction Deleted!',
            details: `The transaction with id: {${transactionId}} has been deleted successfully.`,
        };
    }
}
