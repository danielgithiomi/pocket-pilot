import {Module} from '@nestjs/common';
import {AccountsModule} from './accounts/accounts.module';
import {IdentityModule} from './identity/identity.module';
import {DatabaseModule} from '@infrastructure/database/database.module';
import {WalletModule} from "./wallet/wallet.module";

@Module({
    exports: [AccountsModule, IdentityModule, WalletModule],
    imports: [DatabaseModule, AccountsModule, IdentityModule],
})
export class AppModules {}
