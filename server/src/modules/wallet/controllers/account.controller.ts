import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../services/account.service';

@Controller('wallet')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get()
    getWallet() {
        return 'This is the wallet controller!';
    }
}
