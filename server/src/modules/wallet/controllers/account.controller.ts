import { type CreateAccountDto } from '../dto/account.dto';
import { AccountService } from '../services/account.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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
