import { Module } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { UserService } from '@modules/identity/services/user.service';
import { CookiesAuthGuard } from '@common/guards';

@Module({
    providers: [AccountService, UserService, CookiesAuthGuard],
    controllers: [AccountController],
})
export class WalletModule {}
