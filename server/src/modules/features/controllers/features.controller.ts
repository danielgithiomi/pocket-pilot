import { ExposeEnumDto } from '@common/types';
import { Summary } from '@common/decorators';
import { hoursToMilliseconds } from '@libs/utils';
import { FeaturesService } from '../services/features.service';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('features')
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}

    @Get('categories')
    @ApiCookieAuth('access_token')
    @CacheKey('feature:categories')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @Summary('Feature categories retrieved', 'The application retrieved all feature categories')
    @ApiOperation({ summary: 'Get all feature categories', description: 'Get all feature categories' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Feature categories fetched successfully',
    })
    async getFeatureCategories(): Promise<ExposeEnumDto[]> {
        return this.featuresService.getFeatureCategories();
    }

    @Get('status')
    @ApiCookieAuth('access_token')
    @CacheKey('feature:status')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @Summary('Feature status retrieved', 'The application retrieved all feature status')
    @ApiOperation({ summary: 'Get all feature status', description: 'Get all feature status' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Feature status fetched successfully',
    })
    async getFeatureStatusOptions(): Promise<ExposeEnumDto[]> {
        return this.featuresService.getFeatureStatuses();
    }

    @Get('vote-variants')
    @ApiCookieAuth('access_token')
    @CacheKey('feature:vote-variants')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @Summary('Feature vote variants retrieved', 'The application retrieved all feature vote variants')
    @ApiOperation({ summary: 'Get all feature vote variants', description: 'Get all feature vote variants' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Feature vote variants fetched successfully',
    })
    async getFeatureVoteVariants(): Promise<ExposeEnumDto[]> {
        return this.featuresService.getFeatureVoteVariants();
    }
}
