import { JwtModule } from '@nestjs/jwt';
import { GoalsModule } from './goals/goals.module';
import { WalletModule } from './wallet/wallet.module';
import { Module, DynamicModule } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { DatabaseModule } from '@infrastructure/database/database.module';

const JWTModule: DynamicModule = JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_ENCODING_KEY,
    signOptions: {
        expiresIn: '1h',
    },
});

@Module({
    exports: [IdentityModule, WalletModule, GoalsModule],
    imports: [IdentityModule, WalletModule, GoalsModule, DatabaseModule, JWTModule],
})
export class AppModules {}
