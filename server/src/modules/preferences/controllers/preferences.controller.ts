import { CookiesAuthGuard } from '@common/guards';
import { Summary, UserInRequest } from '@common/decorators';
import { UpdatePreferencesPayload } from '../dto/preferences.dto';
import { ExposeEnumDto, VoidResourceResponse } from '@common/types';
import { PreferencesService } from '../services/preferences.service';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UserWithPreferencesDto as User } from '@modules/identity/dto/user.dto';
import { Body, Controller, Get, HttpCode, Put, UseGuards, UseInterceptors } from '@nestjs/common';

@Controller('preferences')
export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) {}

    @Get('themes')
    @HttpCode(200)
    @CacheTTL(0)
    @CacheKey('theme:options')
    @UseInterceptors(CacheInterceptor)
    @Summary('Get application themes.', 'Get the application theme options.')
    @ApiOperation({
        summary: 'Get application themes',
        description: 'Get the application theme options.',
    })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Application themes retrieved successfully.',
    })
    getApplicationThemes() {
        return this.preferencesService.getApplicationThemes();
    }

    @Put()
    @HttpCode(200)
    @UseGuards(CookiesAuthGuard)
    @ApiCookieAuth('access_token')
    @Summary('Update application preferences.', 'Update the application preferences.')
    @ApiOperation({
        summary: 'Update application preferences',
        description: 'Update the application preferences.',
    })
    @ApiResponse({
        status: 200,
        description: 'Application preferences updated successfully.',
    })
    async updateUserPreferences(
        @UserInRequest() user: User,
        @Body() payload: UpdatePreferencesPayload,
    ): Promise<VoidResourceResponse> {
        await this.preferencesService.updateUserPreferences(user.id, payload);

        return {
            message: 'Preferences updated successfully!',
            details: 'Your user preferences have been updated successfully.',
        } satisfies VoidResourceResponse;
    }
}
