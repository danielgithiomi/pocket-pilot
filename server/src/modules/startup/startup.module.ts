import { Global, Module } from '@nestjs/common';
import { IdentityModule } from '@modules/identity/identity.module';
import { UserService } from '@modules/identity/services/user.service';
import { StartupService } from '@modules/startup/services/startup.service';
import { ExchangeRateModule } from '@modules/exchange-rate/exchange-rate.module';

@Global()
@Module({
    providers: [StartupService, UserService],
    imports: [ExchangeRateModule, IdentityModule]
})
export class StartupModule {}
