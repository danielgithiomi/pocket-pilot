import { Global, Module } from '@nestjs/common';
import { StartupService } from '@modules/startup/services/startup.service';

@Global()
@Module({
    imports: [],
    providers: [StartupService],
})
export class StartupModule {}
