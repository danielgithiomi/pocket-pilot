import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CookiesService } from './services/cookies.service';
import { WalletModule } from '@modules/wallet/wallet.module';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { UserRepository } from './repositories/user.repository';
import { AuthRepository } from './repositories/auth.repository';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { CategoriesService } from '@modules/wallet/services/categories.service';
import { CategoriesRepository } from '@modules/wallet/repositories/categories.repository';

@Module({
    exports: [UserRepository],
    imports: [DatabaseModule, WalletModule],
    controllers: [UserController, AuthController],
    providers: [
        UserService,
        AuthService,
        CookiesService,
        UserRepository,
        AuthRepository,
        CategoriesService,
        CategoriesRepository,
    ],
})
export class IdentityModule {}
