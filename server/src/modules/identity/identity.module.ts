import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, AuthService],
  controllers: [UserController, AuthController],
})
export class IdentityModule {}
