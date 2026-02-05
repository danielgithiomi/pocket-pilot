import {Module} from '@nestjs/common';
import {AccountsModule} from './accounts/accounts.module';
import {DatabaseModule} from '../infrastructure/database/database.module';
import {IdentityModule} from './identity/identity.module';

@Module({
  controllers: [],
  providers: [],
    imports: [DatabaseModule, AccountsModule, IdentityModule],
  exports: [DatabaseModule, AccountsModule],
})
export class AppModules {}
