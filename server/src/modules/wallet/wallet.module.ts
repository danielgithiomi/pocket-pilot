import { Module } from '@nestjs/common';
import { CookiesAuthGuard } from '@common/guards';
import { AccountService } from './services/account.service';
import { TransactionService } from './services/transaction.service';
import { AccountController } from './controllers/account.controller';
import { UserService } from '@modules/identity/services/user.service';
import { TransactionController } from './controllers/transaction.controller';
import { CookiesService } from '@modules/identity/services/cookies.service';

@Module({
    controllers: [AccountController, TransactionController],
    providers: [AccountService, TransactionService, UserService, CookiesAuthGuard, CookiesService],
})
export class WalletModule {}
