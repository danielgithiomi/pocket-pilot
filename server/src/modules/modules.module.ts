import {Module} from '@nestjs/common';
import {AccountsModule} from './accounts/accounts.module';
import {IdentityModule} from './identity/identity.module';
import {DatabaseModule} from '@infrastructure/database/database.module';

@Module({
  exports: [AccountsModule, IdentityModule],
  imports: [DatabaseModule, AccountsModule, IdentityModule],
})
export class AppModules {}
