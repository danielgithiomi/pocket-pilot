import { ExposeEnumDto } from '@common/types';
import { CookiesAuthGuard } from '@common/guards';
import { hoursToMilliseconds } from '@libs/utils';
import { HttpCode, UseGuards } from '@nestjs/common';
import { Public, Summary } from '@common/decorators';
import { SplitwiseService } from './splitwise.service';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('splitwise')
@UseGuards(CookiesAuthGuard)
export class SplitwiseController {
    constructor(private readonly splitwiseService: SplitwiseService) {}

    @Get('tags')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @CacheKey('splitwise:categories-tags')
    @Public()
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all splitwise category tags' })
    @Summary('Splitwise category tags retrieved', 'The user retrieved all splitwise category tags')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Splitwise category tags retrieved successfully',
    })
    getSplitwiseCategories() {
        return this.splitwiseService.getSplitwiseCategories();
    }
}
