import { Summary } from '@common/decorators';
import { ExposeEnumDto } from '@common/types';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PreferencesService } from '../services/preferences.service';

@Controller('preferences')
export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) {}

    @Get('themes')
    @HttpCode(200)
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
}
