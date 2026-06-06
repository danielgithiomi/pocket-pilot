import { hoursToMilliseconds } from '@libs/utils';
import { CookiesAuthGuard } from '@common/guards';
import { Summary, UserInRequest } from '@common/decorators';
import { FeaturesService } from '../services/features.service';
import { ExposeEnumDto, VoidResourceResponse } from '@common/types';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FeatureDto, FeaturePayload, FeaturesWithCountDto } from '../dto/features.dto';
import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';

@Controller('features')
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}

    @Get('categories')
    @ApiCookieAuth('access_token')
    @CacheKey('features:categories')
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
    @CacheKey('features:status')
    @ApiCookieAuth('access_token')
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
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @CacheKey('features:vote-variants')
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
    @ApiCookieAuth('access_token')
    @CacheKey('features:all-features')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(hoursToMilliseconds(12))
    @Summary('Feature requests retrieved', 'The application retrieved all feature requests')
    @ApiOperation({ summary: 'Get all feature requests', description: 'Get all feature requests' })
    @ApiResponse({
        status: 200,
        type: FeaturesWithCountDto,
        description: 'Feature requests with count fetched successfully',
    })
    async getFeatureRequests(): Promise<FeaturesWithCountDto> {
        const features = await this.featuresService.getFeatureRequests();
        const count = features.length;

        return { count, features };
    }

    @Get('user')
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
    async getUserFeatureRequests(@UserInRequest() user: User): Promise<FeatureDto[]> {
        return this.featuresService.getUserFeatureRequests(user.id);
    }

    @Delete(':featureId')
    @UseGuards(CookiesAuthGuard)
    @ApiCookieAuth('access_token')
    @Summary('Feature deleted', 'The user deleted a feature request')
    @ApiParam({ name: 'featureId', description: 'The ID of the feature to delete' })
    @ApiOperation({ summary: 'Delete a feature request', description: 'Delete a feature request by its ID' })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
        description: 'Feature request deleted successfully',
    })
    async deleteFeatureRequestById(
        @UserInRequest() user: User,
        @Param('featureId') featureId: string,
    ): Promise<VoidResourceResponse> {
        const deletedFeature = await this.featuresService.deleteFeatureRequestById(user.id, featureId);

        return {
            message: 'Feature request deleted!',
            details: `Your [${deletedFeature.featureTitle}] feature request has been deleted successfuly.`,
        };
    }
}
