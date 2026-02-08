import { type Request } from 'express';
import { Summary } from '@common/decorators';
import { CookiesAuthGuard } from '@common/guards';
import { User } from '@modules/identity/dto/user.dto';
import { AccountService } from '../services/account.service';
import { type CreateAccountDto, Account, GetAccountsResponse } from '../dto/account.dto';
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

@Controller('accounts')
@UseGuards(CookiesAuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get()
    async getUserWallets(@Req() req: Request<User>): Promise<GetAccountsResponse> {
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
    @Summary('Delete Successful', 'Deleted the account successfully')
    deleteAccountById(@Req() req: Request<User>, @Param('accountId') accountId: string) {
        const { id: userId }: User = req.user!;
        return this.accountService.deleteAccountById(userId!, accountId);
    }
}
