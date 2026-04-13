import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CookiesService } from './services/cookies.service';
import { WalletModule } from '@modules/wallet/wallet.module';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { UserRepository } from './repositories/user.repository';
import { AuthRepository } from './repositories/auth.repository';
import { OnboardingService } from './services/onboarding.service';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { OnboardingController } from './controllers/onboarding.controller';
import { OnboardingRepository } from './repositories/onboarding.repository';
import { CategoriesService } from '@modules/wallet/services/categories.service';
import { CategoriesRepository } from '@modules/wallet/repositories/categories.repository';

@Module({
    exports: [UserRepository, UserService],
    imports: [DatabaseModule, WalletModule],
    controllers: [UserController, AuthController, OnboardingController],
    providers: [
        UserService,
        AuthService,
        CookiesService,
        UserRepository,
        AuthRepository,
        CategoriesService,
        OnboardingService,
        OnboardingController,
        CategoriesRepository,
        OnboardingRepository,
    ],
})
export class IdentityModule {}
