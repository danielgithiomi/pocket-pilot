import { Module } from '@nestjs/common';
import { CookiesAuthGuard } from '@common/guards';
import { AwsService } from '@modules/aws/aws.service';
import { AccountService } from './services/account.service';
import { TransferService } from './services/transfer.service';
import { CategoriesService } from './services/categories.service';
import { TransactionService } from './services/transaction.service';
import { AccountDetailsCache } from './cache/account-details.cache';
import { AccountsCache } from '@modules/wallet/cache/accounts.cache';
import { AccountController } from './controllers/account.controller';
import { UserService } from '@modules/identity/services/user.service';
import { AccountRepository } from './repositories/account.repository';
import { CategoriesCache } from '@modules/wallet/cache/categories.cache';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesRepository } from './repositories/categories.repository';
import { CookiesService } from '@modules/identity/services/cookies.service';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionRepository } from './repositories/transaction.respository';
import { UserRepository } from '@modules/identity/repositories/user.repository';

@Module({
    exports: [CategoriesService, CategoriesCache],
    controllers: [AccountController, TransactionController, CategoriesController],
    providers: [
        AwsService,
        UserService,
        AccountsCache,
        CookiesService,
        UserRepository,
        AccountService,
        TransferService,
        CategoriesCache,
        CookiesAuthGuard,
        AccountRepository,
        CategoriesService,
        TransactionService,
        AccountDetailsCache,
        CategoriesRepository,
        TransactionRepository,
    ],
})
export class WalletModule {}
