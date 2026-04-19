import { secondsToMilliseconds } from '@libs/utils';
import KeyvRedis, { RedisClientOptions } from '@keyv/redis';
// import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

export const RedisConfig = {
    isGlobal: true,
    inject: [],
    useFactory: configService => {
        const { host, port, defaultTTL } = configService.redis;
        const pingInterval: number = defaultTTL * 2;

        const options: RedisClientOptions = {
            pingInterval,
            socket: { port },
            name: 'bff-redis',
            url: `redis://${host}:${port}`,
        };

        return {
            stores: [new KeyvRedis(options)],
            ttl: secondsToMilliseconds(defaultTTL),
        };
    },
};
