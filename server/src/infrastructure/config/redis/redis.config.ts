import { secondsToMilliseconds } from '@libs/utils';
import { PPConfigService } from '@infrastructure/config';
import KeyvRedis, { RedisClientOptions } from '@keyv/redis';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

export const RedisConfig: CacheModuleAsyncOptions = {
    isGlobal: true,
    inject: [],
    useFactory: (configService: PPConfigService) => {
        const { host, port, defaultTTL } = configService.redis;
        const pingInterval: number = defaultTTL * 2;

        const options: RedisClientOptions = {
            pingInterval,
            socket: { port },
            name: 'bff-redis',
            url: `redis://${host}:${port}`,
        };

        console.log(host, port, defaultTTL, pingInterval);

        return {
            stores: [new KeyvRedis(options)],
            ttl: secondsToMilliseconds(defaultTTL),
        };
    },
};
