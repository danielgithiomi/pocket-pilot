import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { type AccountDto } from './dtos/account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  getWallets() {
    return this.accountsService.getAllWallets();
  }

  @Post()
  createAccount(@Body() body: AccountDto) {
    return this.accountsService.createAccount(body);
  }
}
