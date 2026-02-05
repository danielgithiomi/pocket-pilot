import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  providers: [UserService],
  imports: [DatabaseModule],
  controllers: [UserController],
})
export class IdentityModule {}
