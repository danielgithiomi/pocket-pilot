import { Global, Module } from '@nestjs/common';
import { StartupService } from '@modules/startup/services/startup.service';
import { ExchangeRateModule } from '@modules/exchange-rate/exchange-rate.module';

@Global()
@Module({
    imports: [ExchangeRateModule],
    providers: [StartupService],
})
export class StartupModule {}
