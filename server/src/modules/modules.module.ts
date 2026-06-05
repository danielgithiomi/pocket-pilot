import { JwtModule } from '@nestjs/jwt';
import { AwsModule } from './aws/aws.module';
import { BillsModule } from './bills/bills.module';
import { GoalsModule } from './goals/goals.module';
import { SplitrModule } from './splitr/splitr.module';
import { WalletModule } from './wallet/wallet.module';
import { DynamicModule, Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
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
    imports: [
        AwsModule,
        JWTModule,
        GoalsModule,
        BillsModule,
        SplitrModule,
        WalletModule,
        IdentityModule,
        FeaturesModule,
        DatabaseModule,
        PreferencesModule,
    ],
})
export class AppModules {}
