import { Summary } from '@common/decorators';
import { hoursToMilliseconds } from '@libs/utils';
import { PPConfigService } from '@infrastructure/config';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
@ApiTags('App')
export class AppController {
    constructor(private readonly config: PPConfigService) {}

    @Get()
    @Summary('API root', 'Returns a success message if the API is running.')
    @ApiResponse({ status: 200, description: 'You have successfully called the Pocket Pilot API!' })
    @ApiOperation({ summary: 'Get API Configuration', description: 'Returns the Pocket Pilot API Configuration.' })
    getRoot() {
        const { url } = this.config.database;
        return {
            url,
            message: 'You have successfully called the Pocket Pilot API!',
        };
    }

    @Get('redis')
    @CacheKey('pp-redis-config')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @Summary('Pocket Pilot Redis', 'Pocket Pilot Redis Configuration')
    @ApiOperation({ summary: 'Get Redis Configuration', description: 'Returns the Pocket Pilot Redis Configuration.' })
    getRedis() {
        const { port, host, defaultTTL } = this.config.redis;
        return {
            port,
            host,
            defaultTTL: `${defaultTTL} seconds`,
            connectionString: `redis://${host}:${port}`,
            message: 'You have successfully called the Pocket Pilot Redis Configuration!',
        };
    }
}
