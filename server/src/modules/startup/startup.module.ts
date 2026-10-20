import { Global, Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { IdentityModule } from '@modules/identity/identity.module';
import { StartupService } from '@modules/startup/services/startup.service';
import { ExchangeRateModule } from '@modules/exchange-rate/exchange-rate.module';

@Global()
@Module({
    providers: [StartupService, DashboardService],
    imports: [ExchangeRateModule, IdentityModule]
})
export class StartupModule {}
