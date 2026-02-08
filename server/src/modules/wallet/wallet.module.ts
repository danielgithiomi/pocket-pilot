import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { AuthTokenInterceptor } from '@common/interceptors/auth-token.interceptor';

@Module({
    providers: [
        AccountService,
        {
            provide: APP_INTERCEPTOR,
            useClass: AuthTokenInterceptor,
        },
    ],
    controllers: [AccountController],
})
export class WalletModule {}
