import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { DynamicModule, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '@infrastructure/database/database.module';

const JWTModule: DynamicModule = JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_ENCODING_KEY,
    signOptions: {
        expiresIn: '1h',
    },
});

@Module({
    imports: [DatabaseModule, JWTModule],
    providers: [UserService, AuthService],
    controllers: [UserController, AuthController],
})
export class IdentityModule {}
