import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from '@infrastructure/config/config.types';
import { PPCustomConfig } from '@infrastructure/config/config.schema';

@Injectable()
export class PPConfigService {
    constructor(private readonly service: ConfigService<PPCustomConfig, true>) {}

    get redis(): RedisConfig {
        return {
            port: this.service.get<number>('REDIS_PORT'),
            host: this.service.get<string>('REDIS_HOST'),
            defaultTTL: this.service.get<number>('REDIS_DEFAULT_TTL_SECONDS'),
        };
    }
}
