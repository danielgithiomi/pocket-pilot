import { type Request } from 'express';
import { CookiesAuthGuard } from '@common/guards';
import { User } from '@modules/identity/dto/user.dto';
import { type CreateAccountDto } from '../dto/account.dto';
import { AccountService } from '../services/account.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

@Controller('accounts')
@UseGuards(CookiesAuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get()
    getUserWallets(@Req() req: Request) {
        const { id }: User = req.user!;
        return this.accountService.getUserAccounts(id!);
    }

    @Post()
    createAccount(@Body() accountDto: CreateAccountDto) {
        return this.accountService.createAccount(accountDto);
    }
}
