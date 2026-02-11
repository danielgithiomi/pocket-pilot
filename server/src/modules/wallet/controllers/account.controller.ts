import { CookiesAuthGuard } from '@common/guards';
import { type User } from '@modules/identity/dto/user.dto';
import { Summary, UserInRequest } from '@common/decorators';
import { AccountService } from '../services/account.service';
import { DeleteResourceResponse, WithCountResponse } from '@common/types';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Account,
    AccountClass,
    CreateAccountDto,
    AccountWithHolder,
    AccountWithTransactions,
} from '../dto/account.dto';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(CookiesAuthGuard)
@ApiCookieAuth('access_token')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get('all')
    async getAllAccounts(): Promise<WithCountResponse<AccountWithHolder>> {
        const allAccounts: AccountWithHolder[] = await this.accountService.getAllAccounts();

        return {
            count: allAccounts.length,
            data: allAccounts,
        };
    }

    @ApiOperation({ summary: 'Get User Accounts', description: 'Get all accounts of the logged in user' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: AccountClass,
        description: 'Accounts fetched successfully',
    })
    @Get()
    async getUserAccounts(@UserInRequest() user: User): Promise<WithCountResponse<Account>> {
        const userAccounts: Account[] = await this.accountService.getUserAccounts(user.id!);

        return {
            count: userAccounts.length,
            data: userAccounts,
        };
    }

    @ApiParam({
        required: true,
        name: 'accountId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the account to be fetched',
    })
    @ApiOperation({ summary: 'Get Account By Id', description: 'Get an account by its id' })
    @ApiResponse({
        status: 200,
        isArray: false,
        type: AccountClass,
        description: 'Account fetched successfully',
    })
    @Get(':accountId')
    getAccountById(@UserInRequest() user: User, @Param('accountId') accountId: string): Promise<Account> {
        return this.accountService.getAccountById(user.id!, accountId);
    }

    @ApiParam({
        required: true,
        name: 'accountId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the account to be fetched',
    })
    @ApiOperation({
        summary: 'Get Account and Transactions',
        description: 'Get an account and its relevant transactions',
    })
    @Get(':accountId/all-transactions')
    async getAccountAndTransactions(
        @UserInRequest() user: User,
        @Param('accountId') accountId: string,
    ): Promise<{ transactionCount: number; data: AccountWithTransactions }> {
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
        type: AccountClass,
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
