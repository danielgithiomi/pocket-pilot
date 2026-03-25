import { Module } from '@nestjs/common';
import { CookiesAuthGuard } from '@common/guards';
import { AccountService } from './services/account.service';
import { CategoriesService } from './services/categories.service';
import { TransactionService } from './services/transaction.service';
import { AccountController } from './controllers/account.controller';
import { UserService } from '@modules/identity/services/user.service';
import { AccountRepository } from './repositories/account.repository';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesRepository } from './repositories/categories.repository';
import { CookiesService } from '@modules/identity/services/cookies.service';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionRepository } from './repositories/transaction.respository';
import { UserRepository } from '@modules/identity/repositories/user.repository';

@Module({
    controllers: [AccountController, TransactionController, CategoriesController],
    providers: [
        UserService,
        CookiesService,
        UserRepository,
        AccountService,
        CookiesAuthGuard,
        AccountRepository,
        CategoriesService,
        TransactionService,
        CategoriesRepository,
        TransactionRepository,
    ],
})
export class WalletModule {}
