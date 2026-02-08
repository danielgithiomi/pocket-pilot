import { type CreateAccountDto } from '../dto/account.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from '../services/account.service';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get()
    getWallet() {
        return 'This is the wallet controller!';
    }

    @Post()
    createAccount(@Body() accountDto: CreateAccountDto) {
        return this.accountService.createAccount(accountDto);
    }
}
