import { Module } from '@nestjs/common';
import { CookiesAuthGuard } from '@common/guards';
import { AccountService } from './services/account.service';
import { TransactionService } from './services/transaction.service';
import { AccountController } from './controllers/account.controller';
import { UserService } from '@modules/identity/services/user.service';
import { TransactionController } from './controllers/transaction.controller';

@Module({
    controllers: [AccountController, TransactionController],
    providers: [AccountService, TransactionService, UserService, CookiesAuthGuard],
})
export class WalletModule {}
