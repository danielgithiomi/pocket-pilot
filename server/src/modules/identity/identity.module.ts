import { CookiesAuthGuard } from '@common/guards';
import { Module, forwardRef } from '@nestjs/common';
import { AwsModule } from '@modules/aws/aws.module';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CookiesService } from './services/cookies.service';
import { WalletModule } from '@modules/wallet/wallet.module';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { UserRepository } from './repositories/user.repository';
import { AuthRepository } from './repositories/auth.repository';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Module({
    controllers: [UserController, AuthController],
    imports: [DatabaseModule, forwardRef(() => AwsModule), forwardRef(() => WalletModule)],
    exports: [UserService, UserRepository, CookiesService, CookiesAuthGuard, AuthService],
    providers: [UserService, AuthService, CookiesService, CookiesAuthGuard, UserRepository, AuthRepository],
})
export class IdentityModule {}
