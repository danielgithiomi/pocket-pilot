import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PPCustomConfig } from '@infrastructure/config/config.schema';
import { IDatabaseConfig, IRedisConfig } from '@infrastructure/config/config.types';

@Injectable()
export class PPConfigService {
    constructor(private readonly service: ConfigService<PPCustomConfig, true>) {}

    get redis(): IRedisConfig {
        return {
            port: this.service.getOrThrow<number>('REDIS_PORT'),
            host: this.service.getOrThrow<string>('REDIS_HOST'),
            defaultTTL: this.service.getOrThrow<number>('REDIS_DEFAULT_TTL_SECONDS'),
        };
    }

    get database(): IDatabaseConfig {
        return {
            url: this.service.getOrThrow<string>('DATABASE_URL'),
        };
    }

    get aws() {
        return {
            region: this.service.getOrThrow<string>('AWS_S3_REGION'),
            maxAttempts: this.service.getOrThrow<number>('AWS_MAX_ATTEMPTS'),
            accessKeyId: this.service.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
            socketTimeout: this.service.getOrThrow<number>('AWS_MAX_SOCKET_TIMEOUT'),
            secretAccessKey: this.service.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
            connectionTimeout: this.service.getOrThrow<number>('AWS_MAX_CONNECTION_TIMEOUT'),
        };
    }
}
