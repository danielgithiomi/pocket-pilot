import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { PPConfigModule } from './config/config.module';
import { RedisConfig } from './config/redis/redis.config';
import { DatabaseModule } from './database/database.module';

@Global()
@Module({
    exports: [DatabaseModule, PPConfigModule],
    imports: [DatabaseModule, PPConfigModule, CacheModule.registerAsync(RedisConfig)],
})
export class InfrastructureModule {}
