import { CookiesAuthGuard } from '@common/guards';
import { plainToInstance } from 'class-transformer';
import { type User } from '@modules/identity/dto/user.dto';
import { Summary, UserInRequest } from '@common/decorators';
import { AccountService } from '../services/account.service';
import { ExposeEnumDto, VoidResourceResponse } from '@common/types';
import { denormalizeCategoryName, hoursToMilliseconds } from '@libs/utils';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import {
    Account,
    CreateAccountDto,
    AccountWithHolder,
    AccountsResponseDto,
    AccountWithHolderDto,
    UserAccountsResponseDto,
    AccountWithTransactionsResponseDto,
} from '../dto/account.dto';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(CookiesAuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get('types')
    @CacheKey('account:types')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @Summary('Account Types Retrieved!', 'You have successfully retrieved all account types.')
    @ApiOperation({ summary: 'Get Account Types', description: 'Get all available account types' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Account types fetched successfully',
    })
    async getAccountTypes(): Promise<ExposeEnumDto[]> {
        return await this.accountService.getAccountTypes();
    }

    @Get('all')
    @ApiCookieAuth('access_token')
    @Summary('All Accounts Retrieved!', 'You have successfully retrieved all accounts.')
    @ApiOperation({ summary: 'Retrieve all accounts', description: 'Get all created accounts in the database.' })
    @ApiResponse({
        status: 200,
        isArray: false,
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

    @Get()
    @ApiCookieAuth('access_token')
    @Summary('User Accounts Retrieved!', 'You have successfully retrieved your accounts.')
    @ApiOperation({ summary: 'Get User Accounts', description: 'Get all accounts of the logged in user' })
    @ApiResponse({
        status: 200,
        isArray: false,
        type: UserAccountsResponseDto,
        description: 'Accounts fetched successfully',
    })
    async getUserAccounts(@UserInRequest() user: User): Promise<UserAccountsResponseDto> {
        const userAccounts: Account[] = await this.accountService.getUserAccounts(user.id!);

        return {
            count: userAccounts.length,
            data: userAccounts,
        };
    }

    @Get(':accountId')
    @ApiCookieAuth('access_token')
    @Summary('Account Retrieved!', 'You have successfully retrieved the account.')
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
    @ApiCookieAuth('access_token')
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
    @Summary('Account Transactions Retrieved!', 'You have successfully retrieved the account transactions.')
    async getAccountAndTransactions(
        @UserInRequest() user: User,
        @Param('accountId') accountId: string,
    ): Promise<AccountWithTransactionsResponseDto> {
        const accountWithTransactions = await this.accountService.getAccountAndTransactions(user.id!, accountId);

        return {
            count: accountWithTransactions.transactions.length,
            data: accountWithTransactions,
        };
    }

    @Post()
    @ApiCookieAuth('access_token')
    @ApiBody({ type: CreateAccountDto })
    @Summary('Account Created!', 'You have successfully created an account.')
    @ApiOperation({ summary: 'Create Account', description: 'Create a new account' })
    @ApiResponse({
        status: 201,
        type: Account,
        isArray: false,
        description: 'Account created successfully',
    })
    createAccount(@UserInRequest() user: User, @Body() payload: CreateAccountDto): Promise<Account> {
        return this.accountService.createAccount(user.id!, payload);
    }

    @Delete(':accountId')
    @ApiCookieAuth('access_token')
    @ApiParam({
        required: true,
        name: 'accountId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The id of the account to be deleted.',
    })
    @ApiResponse({
        status: 200,
        isArray: false,
        type: VoidResourceResponse,
        description: 'Account deleted successfully',
    })
    @Summary('Delete Successful!', 'You have successfully deleted the account.')
    @ApiOperation({ summary: 'Delete Account', description: 'Delete an account by its id' })
    async deleteAccountById(
        @UserInRequest() user: User,
        @Param('accountId') accountId: string,
    ): Promise<VoidResourceResponse> {
        const deletedWallet = await this.accountService.deleteAccountById(user.id!, accountId);

        return {
            message: 'Account Deleted!',
            details: `Your [${denormalizeCategoryName(deletedWallet.name)}] account has been deleted successfully.`,
        };
    }
}
