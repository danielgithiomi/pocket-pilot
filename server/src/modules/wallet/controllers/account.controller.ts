import { type Request } from 'express';
import { CookiesAuthGuard } from '@common/guards';
import { User } from '@modules/identity/dto/user.dto';
import { AccountService } from '../services/account.service';
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { type CreateAccountDto, Account, DeleteResourceResponse, GetAccountsResponse } from '../dto/account.dto';
import { Summary } from '@common/decorators';

@Controller('accounts')
@UseGuards(CookiesAuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get('all')
    async getAllAccounts(): Promise<GetAccountsResponse> {
        const allAccounts: Account[] = await this.accountService.getAllAccounts();

        return {
            count: allAccounts.length,
            accounts: allAccounts,
        };
    }

    @Get()
    async getUserAccounts(@Req() req: Request<User>): Promise<GetAccountsResponse> {
        const { id }: User = req.user!;
        const userAccounts: Account[] = await this.accountService.getUserAccounts(id!);

        return {
            count: userAccounts.length,
            accounts: userAccounts,
        };
    }

    @Post()
    createAccount(@Req() req: Request<User>, @Body() accountDto: CreateAccountDto) {
        const { id }: User = req.user!;
        return this.accountService.createAccount(id!, accountDto);
    }

    @Delete(':accountId')
    @Summary('Delete Successful!', 'You have successfully deleted the account.')
    async deleteAccountById(
        @Req() req: Request<User>,
        @Param('accountId') accountId: string,
    ): Promise<DeleteResourceResponse> {
        const { id: userId }: User = req.user!;
        await this.accountService.deleteAccountById(userId!, accountId);

        return {
            message: 'Account Deleted',
            details: `The account with id: {${accountId}} has been deleted successfully.`,
        };
    }
}
