import { Global, Module } from '@nestjs/common';
import { StartupService } from '@modules/startup/services/startup.service';
import { ExchangeRateModule } from '@modules/exchange-rate/exchange-rate.module';
import { ExchangeRateService } from '@modules/exchange-rate/services/exchange-rate.service';

@Global()
@Module({
    imports: [ExchangeRateModule],
    providers: [StartupService, ExchangeRateService],
})
export class StartupModule {}
