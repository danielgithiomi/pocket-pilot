import { ExposeEnumDto } from '@common/types';
import { CookiesAuthGuard } from '@common/guards';
import { hoursToMilliseconds } from '@libs/utils';
import { SplitwiseService } from './splitwise.service';
import { Body, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Public, Summary, UserInRequest } from '@common/decorators';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { SplitwiseSquadDto, SplitwiseSquadPayload } from './dto/splitwise.dto';

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

    @Get('squads')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all splitwise squads' })
    @Summary('Splitwise squads retrieved', 'The user retrieved all splitwise squads')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: SplitwiseSquadDto,
        description: 'Splitwise squads retrieved successfully',
    })
    getUserSplitwiseSquads(@UserInRequest() user: User): Promise<SplitwiseSquadDto[]> {
        return this.splitwiseService.getUserSplitwiseSquads(user.id);
    }

    @Post('squads')
    @HttpCode(201)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Create splitwise squad' })
    @Summary('Splitwise squad created', 'The user created a splitwise squad')
    @ApiResponse({
        status: 201,
        isArray: false,
        type: SplitwiseSquadDto,
        description: 'Splitwise squad created successfully',
    })
    createSplitwiseSquad(
        @UserInRequest() user: User,
        @Body() payload: SplitwiseSquadPayload,
    ): Promise<SplitwiseSquadDto> {
        return this.splitwiseService.createSplitwiseSquad(user.id, payload);
    }
}
