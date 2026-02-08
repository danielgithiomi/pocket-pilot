import { Module } from '@nestjs/common';
import { CookiesAuthGuard } from '@common/guards';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { UserService } from '@modules/identity/services/user.service';

@Module({
    controllers: [AccountController],
    providers: [AccountService, UserService, CookiesAuthGuard],
})
export class WalletModule {}
