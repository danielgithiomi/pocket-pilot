import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { TransferService } from './services/transfer.service';
import { CategoriesService } from './services/categories.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { TransactionService } from './services/transaction.service';
import { AccountController } from './controllers/account.controller';
import { AccountRepository } from './repositories/account.repository';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesRepository } from './repositories/categories.repository';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionRepository } from './repositories/transaction.respository';
import { ExchangeRateModule } from '@modules/exchange-rate/exchange-rate.module';
import { CategoriesCache, AccountsCache, AccountDetailsCache } from './cache/wallet.cache';

@Module({
    exports: [CategoriesService, CategoriesCache],
    imports: [forwardRef(() => IdentityModule), ExchangeRateModule],
    controllers: [AccountController, TransactionController, CategoriesController],
    providers: [
        AccountsCache,
        AccountService,
        TransferService,
        CategoriesCache,
        AccountRepository,
        CategoriesService,
        TransactionService,
        AccountDetailsCache,
        CategoriesRepository,
        TransactionRepository,
    ],
})
export class WalletModule {}
