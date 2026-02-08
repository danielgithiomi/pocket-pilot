import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { IdentityModule } from './identity/identity.module';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Module({
    exports: [IdentityModule, WalletModule],
    imports: [IdentityModule, WalletModule, DatabaseModule],
})
export class AppModules {}
