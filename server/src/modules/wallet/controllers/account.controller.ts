import { CookiesAuthGuard } from '@common/guards';
import { type User } from '@modules/identity/dto/user.dto';
import { Summary, UserInRequest } from '@common/decorators';
import { AccountService } from '../services/account.service';
import { DeleteResourceResponse, WithCountResponse } from '@common/types';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { type CreateAccountDto, Account, AccountWithHolder, AccountWithTransactions } from '../dto/account.dto';

@Controller('accounts')
@UseGuards(CookiesAuthGuard)
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

    @Get()
    async getUserAccounts(@UserInRequest() user: User): Promise<WithCountResponse<Account>> {
        const userAccounts: Account[] = await this.accountService.getUserAccounts(user.id!);

        return {
            count: userAccounts.length,
            data: userAccounts,
        };
    }

    @Get(':accountId')
    getAccountById(@UserInRequest() user: User, @Param('accountId') accountId: string): Promise<Account> {
        return this.accountService.getAccountById(user.id!, accountId);
    }

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
