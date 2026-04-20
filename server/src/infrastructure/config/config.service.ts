import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PPCustomConfig } from '@infrastructure/config/config.schema';
import { IDatabaseConfig, IRedisConfig } from '@infrastructure/config/config.types';

@Injectable()
export class PPConfigService {
    constructor(private readonly service: ConfigService<PPCustomConfig, true>) {}

    get redis(): IRedisConfig {
        return {
            port: this.service.get<number>('REDIS_PORT'),
            host: this.service.get<string>('REDIS_HOST'),
            defaultTTL: this.service.get<number>('REDIS_DEFAULT_TTL_SECONDS'),
        };
    }

    get database(): IDatabaseConfig {
        return {
            url: this.service.get<string>('DATABASE_URL'),
        };
    }
}
