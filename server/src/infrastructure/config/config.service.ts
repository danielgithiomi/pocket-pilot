import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PPCustomConfig } from '@infrastructure/config/config.schema';

@Injectable()
export class PPConfigService {
    constructor(private readonly service: ConfigService<PPCustomConfig, true>) {}

    get redis() {
        return {
            host: this.service.get<string>('REDIS_HOST'),
            port: this.service.get<number>('REDIS_PORT'),
            defaultTTL: this.service.get<number>('REDIS_DEFAULT_TTL_SECONDS'),
        };
    }
}
