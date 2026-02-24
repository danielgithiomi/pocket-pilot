import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CookiesService } from './services/cookies.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController, AuthController],
    providers: [UserService, AuthService, CookiesService],
})
export class IdentityModule {}
