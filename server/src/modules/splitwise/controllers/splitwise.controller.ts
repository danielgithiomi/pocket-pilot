import { ExposeEnumDto } from '@common/types';
import { CookiesAuthGuard } from '@common/guards';
import { hoursToMilliseconds } from '@libs/utils';
import { Body, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SplitwiseService } from '../services/splitwise.service';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Public, Summary, UserInRequest } from '@common/decorators';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { SplitwiseEventDto, SplitwiseEventPayload } from '../dto/splitwise.dto';

@Controller('splitwise')
@UseGuards(CookiesAuthGuard)
export class SplitwiseController {
    constructor(private readonly splitwiseService: SplitwiseService) {}

    @Get('tags')
    @CacheKey('splitwise:tags')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
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

    @Get()
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all user splitwise events' })
    @Summary('User splitwise events retrieved', 'The user retrieved all their splitwise events')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: [SplitwiseEventDto],
    })
    getSplitwiseEvents(@UserInRequest() user: User) {
        return this.splitwiseService.getUserSplitwiseEvents(user.id);
    }

    @Post()
    @HttpCode(201)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Create a splitwise event' })
    @Summary('Splitwise event created', 'The user created a splitwise event')
    @ApiResponse({
        status: 201,
        isArray: false,
        type: SplitwiseEventDto,
    })
    createSplitwiseEvent(@UserInRequest() user: User, @Body() payload: SplitwiseEventPayload) {
        return this.splitwiseService.createSplitwiseEvent(user.id, payload);
    }
}
