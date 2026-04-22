import { JwtModule } from '@nestjs/jwt';
import { BillsModule } from './bills/bills.module';
import { GoalsModule } from './goals/goals.module';
import { WalletModule } from './wallet/wallet.module';
import { Module, DynamicModule } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { PreferencesModule } from './preferences/preferences.module';
import { DatabaseModule } from '@infrastructure/database/database.module';

const JWTModule: DynamicModule = JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_ENCODING_KEY,
    signOptions: {
        expiresIn: '1h',
    },
});

@Module({
    exports: [IdentityModule, WalletModule, GoalsModule, BillsModule],
    imports: [IdentityModule, WalletModule, GoalsModule, BillsModule, DatabaseModule, JWTModule, PreferencesModule],
})
export class AppModules {}
