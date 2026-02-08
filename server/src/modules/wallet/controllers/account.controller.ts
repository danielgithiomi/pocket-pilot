import { type CreateAccountDto } from '../dto/account.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountService } from '../services/account.service';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get(':userId')
    getWallet(@Param('userId') userId: string) {
        return this.accountService.getUserAccounts(userId);
    }

    @Post()
    createAccount(@Body() accountDto: CreateAccountDto) {
        return this.accountService.createAccount(accountDto);
    }
}
