import { CookiesAuthGuard } from '@common/guards';
import { DeleteResourceResponse } from '@common/types';
import { type User } from '@modules/identity/dto/user.dto';
import { Summary, UserInRequest } from '@common/decorators';
import { AccountService } from '../services/account.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Account,
    CreateAccountDto,
    AccountWithHolder,
    AccountsResponseDto,
    AccountWithHolderDto,
    UserAccountsResponseDto,
    AccountWithTransactionsResponseDto,
} from '../dto/account.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(CookiesAuthGuard)
@ApiCookieAuth('access_token')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get('all')
    @ApiOperation({ summary: 'Retrieve all accounts', description: 'Get all created accounts in the database.' })
    @ApiResponse({
        status: 200,
        type: AccountsResponseDto,
        description: 'Accounts fetched successfully',
    })
    async getAllAccounts(): Promise<AccountsResponseDto> {
        const allAccounts: AccountWithHolder[] = await this.accountService.getAllAccounts();

        return {
            count: allAccounts.length,
            data: plainToInstance(AccountWithHolderDto, allAccounts),
        };
    }

    @ApiOperation({ summary: 'Get User Accounts', description: 'Get all accounts of the logged in user' })
    @ApiResponse({
        status: 200,
        type: UserAccountsResponseDto,
        description: 'Accounts fetched successfully',
    })
    @Get()
    async getUserAccounts(@UserInRequest() user: User): Promise<UserAccountsResponseDto> {
        const userAccounts: Account[] = await this.accountService.getUserAccounts(user.id!);

        return {
            count: userAccounts.length,
            data: userAccounts,
        };
    }

    @Get(':accountId')
    @ApiOperation({ summary: 'Get Account By Id', description: 'Get an account by its id' })
    @ApiResponse({ status: 200, type: Account, description: 'Account fetched successfully' })
    @ApiParam({
        required: true,
        name: 'accountId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the account to be fetched',
    })
    getAccountById(@UserInRequest() user: User, @Param('accountId') accountId: string): Promise<Account> {
        return this.accountService.getAccountById(user.id!, accountId);
    }

    @Get(':accountId/all-transactions')
    @ApiParam({
        required: true,
        name: 'accountId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the account to be fetched with its transactions.',
    })
    @ApiOperation({
        summary: 'Get Account and its transactions',
        description: 'Get an account and all its relevant transactions.',
    })
    @ApiResponse({
        status: 200,
        isArray: false,
        type: AccountWithTransactionsResponseDto,
        description: 'Account and transactions fetched successfully.',
    })
    async getAccountAndTransactions(
        @UserInRequest() user: User,
        @Param('accountId') accountId: string,
    ): Promise<AccountWithTransactionsResponseDto> {
        const accountWithTransactions = await this.accountService.getAccountAndTransactions(user.id!, accountId);

        return {
            transactionCount: accountWithTransactions.transactions.length,
            data: accountWithTransactions,
        };
    }

    @ApiOperation({ summary: 'Create Account', description: 'Create a new account' })
    @ApiBody({ type: CreateAccountDto })
    @ApiResponse({
        status: 201,
        isArray: false,
        type: Account,
        description: 'Account created successfully',
    })
    @Post()
    createAccount(@UserInRequest() user: User, @Body() accountDto: CreateAccountDto): Promise<Account> {
        return this.accountService.createAccount(user.id!, accountDto);
    }

    @Delete(':accountId')
    @Summary('Delete Successful!', 'You have successfully deleted the account.')
    async deleteAccountById(
        @UserInRequest() user: User,
        @Param('accountId') accountId: string,
    ): Promise<DeleteResourceResponse> {
        await this.accountService.deleteAccountById(user.id!, accountId);

        return {
            message: 'Account Deleted',
            details: `The account with id: {${accountId}} has been deleted successfully.`,
        };
    }
}
