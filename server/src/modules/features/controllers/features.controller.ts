import { hoursToMilliseconds } from '@libs/utils';
import { CookiesAuthGuard } from '@common/guards';
import { FeaturesService } from '../services/features.service';
import { Public, Summary, UserInRequest } from '@common/decorators';
import { ExposeEnumDto, VoidResourceResponse } from '@common/types';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { FeatureDto, FeaturePayload, FeaturesWithCountDto, UpdateFeatureStatusPayload } from '../dto/features.dto';

@UseGuards(CookiesAuthGuard)
@Controller('features')
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}

    @Public()
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
        description: 'Feature categories fetched successfully'
    })
    getFeatureCategories(): ExposeEnumDto[] {
        return this.featuresService.getFeatureCategories();
    }

    @Public()
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
        description: 'Feature status fetched successfully'
    })
    getFeatureStatusOptions(): ExposeEnumDto[] {
        return this.featuresService.getFeatureStatuses();
    }

    @Post()
    @ApiCookieAuth('access_token')
    @Summary('Feature created', 'The user created a new feature and was saved to the database')
    @ApiOperation({ summary: 'Add a new feature request', description: 'Create a new feature request' })
    @ApiResponse({
        status: 201,
        type: FeatureDto,
        description: 'Feature created successfully'
    })
    async createFeatureRequest(@UserInRequest() user: User, @Body() payload: FeaturePayload): Promise<FeatureDto> {
        return this.featuresService.createFeatureRequest(user.id, payload);
    }

    @Get()
    @ApiCookieAuth('access_token')
    @CacheKey('features:all-features')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(hoursToMilliseconds(12))
    @Summary('Feature requests retrieved', 'The application retrieved all feature requests')
    @ApiOperation({ summary: 'Get all feature requests', description: 'Get all feature requests' })
    @ApiResponse({
        status: 200,
        type: FeaturesWithCountDto,
        description: 'Feature requests with count fetched successfully'
    })
    getFeatureRequests(): Promise<FeaturesWithCountDto> {
        return this.featuresService.getFeatureRequests();
    }

    @Get('user')
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'userId', description: 'The ID of the user to retrieve feature requests for' })
    @Summary('User feature requests retrieved', 'The application retrieved all feature requests for a user')
    @ApiOperation({
        summary: 'Get all feature requests for a user',
        description: 'Get all feature requests for a user'
    })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: FeatureDto,
        description: 'User feature requests fetched successfully'
    })
    async getUserFeatureRequests(@UserInRequest() user: User): Promise<FeatureDto[]> {
        return this.featuresService.getUserFeatureRequests(user.id);
    }

    @Patch('votes/:featureId')
    @ApiCookieAuth('access_token')
    @ApiParam({ name: 'featureId', description: 'The ID of the feature that the user is upvoting' })
    @Summary('Feature upvote toggled', 'The user toggled their upvote on the feature request')
    @ApiOperation({
        summary: 'Toggle a feature upvote',
        description: 'Add the current user upvote to a feature request, or remove it if it already exists'
    })
    @ApiResponse({
        status: 200,
        type: FeatureDto,
        description: 'The updated feature'
    })
    toggleFeatureUpvoteById(@UserInRequest() user: User, @Param('featureId') featureId: string): Promise<FeatureDto> {
        return this.featuresService.toggleFeatureUpvoteById(user.id, featureId);
    }

    @Patch(':featureId/status')
    @ApiCookieAuth('access_token')
    @Summary('Feature status updated', 'The user updated the status of a feature request')
    @ApiParam({ name: 'featureId', description: 'The ID of the feature to update the status of' })
    @ApiOperation({
        summary: 'Update the feature status',
        description: 'Modify the status of a feature by its ID'
    })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
        description: 'Feature status updated successfully'
    })
    async updateFeatureStatusById(
        @UserInRequest() user: User,
        @Param('featureId') featureId: string,
        @Body() payload: UpdateFeatureStatusPayload
    ): Promise<VoidResourceResponse> {
        const updatedFeature = await this.featuresService.updateFeatureStatusById(user.id, featureId, payload);

        return {
            message: 'Feature status updated!',
            details: `Your [${updatedFeature.featureTitle}] feature status has been updated to [${updatedFeature.featureStatus}] successfuly.`
        };
    }

    @Delete(':featureId')
    @ApiCookieAuth('access_token')
    @Summary('Feature deleted', 'The user deleted a feature request')
    @ApiParam({ name: 'featureId', description: 'The ID of the feature to delete' })
    @ApiOperation({ summary: 'Delete a feature request', description: 'Delete a feature request by its ID' })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
        description: 'Feature request deleted successfully'
    })
    async deleteFeatureRequestById(
        @UserInRequest() user: User,
        @Param('featureId') featureId: string
    ): Promise<VoidResourceResponse> {
        const deletedFeature = await this.featuresService.deleteFeatureRequestById(user.id, featureId);

        return {
            message: 'Feature request deleted!',
            details: `Your [${deletedFeature.featureTitle}] feature request has been deleted successfuly.`
        };
    }
}
