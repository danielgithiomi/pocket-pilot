import { ExposeEnumDto } from '@common/types';
import { hoursToMilliseconds } from '@libs/utils';
import { CookiesAuthGuard } from '@common/guards';
import { Summary, UserInRequest } from '@common/decorators';
import { FeaturesService } from '../services/features.service';
import { FeatureDto, FeaturePayload } from '../dto/features.dto';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';

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

    @Post()
    @UseGuards(CookiesAuthGuard)
    @ApiCookieAuth('access_token')
    @Summary('Feature created', 'The user created a new feature and was saved to the database')
    @ApiOperation({ summary: 'Add a new feature request', description: 'Create a new feature request' })
    @ApiResponse({
        status: 201,
        type: FeatureDto,
        description: 'Feature created successfully',
    })
    async createFeatureRequest(@UserInRequest() user: User, @Body() payload: FeaturePayload): Promise<FeatureDto> {
        return this.featuresService.createFeatureRequest(user.id, payload);
    }

    @Get()
    @UseGuards(CookiesAuthGuard)
    @CacheKey('feature:requests')
    @ApiCookieAuth('access_token')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(hoursToMilliseconds(12))
    @Summary('Feature requests retrieved', 'The application retrieved all feature requests')
    @ApiOperation({ summary: 'Get all feature requests', description: 'Get all feature requests' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: FeatureDto,
        description: 'Feature requests fetched successfully',
    })
    async getFeatureRequests(): Promise<FeatureDto[]> {
        return this.featuresService.getFeatureRequests();
    }

    @Get(':userId')
    @UseGuards(CookiesAuthGuard)
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'userId', description: 'The ID of the user to retrieve feature requests for' })
    @Summary('User feature requests retrieved', 'The application retrieved all feature requests for a user')
    @ApiOperation({
        summary: 'Get all feature requests for a user',
        description: 'Get all feature requests for a user',
    })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: FeatureDto,
        description: 'User feature requests fetched successfully',
    })
    async getUserFeatureRequests(@Param('userId') userId: string): Promise<FeatureDto[]> {
        return this.featuresService.getUserFeatureRequests(userId);
    }
}
