import { Global, Module } from '@nestjs/common';
import { PPConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

@Global()
@Module({
    imports: [DatabaseModule, PPConfigModule],
    exports: [DatabaseModule, PPConfigModule],
})
export class InfrastructureModule {}
