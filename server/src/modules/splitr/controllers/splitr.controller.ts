import { CookiesAuthGuard } from '@common/guards';
import { hoursToMilliseconds } from '@libs/utils';
import { SplitrService } from '../services/splitr.service';
import { ExposeEnumDto, VoidResourceResponse } from '@common/types';
import { Public, Summary, UserInRequest } from '@common/decorators';
import { Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Body, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SplitrEventDto, SplitrEventPayload, SettleSplitrPayload } from '../dto/splitr.dto';

@Controller('splitr')
@UseGuards(CookiesAuthGuard)
export class SplitrController {
    constructor(private readonly splitrService: SplitrService) {}

    @Get('tags')
    @CacheKey('splitr:tags')
    @CacheTTL(hoursToMilliseconds(24))
    @UseInterceptors(CacheInterceptor)
    @Public()
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all splitr category tags' })
    @Summary('Splitr category tags retrieved', 'The user retrieved all splitr category tags')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: ExposeEnumDto,
        description: 'Splitr category tags retrieved successfully',
    })
    getSplitrCategories() {
        return this.splitrService.getSplitrCategories();
    }

    @Get()
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get all user splitr events' })
    @Summary('User splitr events retrieved', 'The user retrieved all their splitr events')
    @ApiResponse({
        status: 200,
        isArray: true,
        type: [SplitrEventDto],
    })
    getUserSplitrEvents(@UserInRequest() user: User) {
        return this.splitrService.getUserSplitrEvents(user.id);
    }

    @Get(':eventId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get a splitr event by ID' })
    @Summary('Splitr event retrieved', 'The user retrieved a splitr event by ID')
    @ApiParam({
        name: 'eventId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The ID of the splitr event to retrieve',
    })
    @ApiResponse({
        status: 200,
        type: SplitrEventDto,
    })
    getSplitrEventById(@UserInRequest() user: User, @Param('eventId') eventId: string) {
        return this.splitrService.getSplitrEventById(user.id, eventId);
    }

    @Post()
    @HttpCode(201)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Create a splitr event' })
    @Summary('Splitr event created', 'The user created a splitr event')
    @ApiResponse({
        status: 201,
        isArray: false,
        type: SplitrEventDto,
    })
    createSplitrEvent(@UserInRequest() user: User, @Body() payload: SplitrEventPayload) {
        return this.splitrService.createSplitrEvent(user.id, payload);
    }

    @Patch(':eventId/settle')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Mark a splitr event as settled or pending' })
    @Summary('Splitr event settled or pending', 'The user marked a splitr event as settled or pending')
    @ApiParam({
        name: 'eventId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The ID of the splitr event to mark as settled or pending',
    })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
    })
    async markSplitrEventAsSettledOrPending(
        @UserInRequest() user: User,
        @Param('eventId') eventId: string,
        @Body() payload: SettleSplitrPayload,
    ): Promise<VoidResourceResponse> {
        const { eventName, isSettled } = await this.splitrService.markSplitrEventAsSettledOrPending(
            user.id,
            eventId,
            payload,
        );

        const message = 'Event status updated!';
        const details = `Your [${eventName}] splitr event has been marked as ${isSettled ? 'settled' : 'pending'} successfully.`;

        return { message, details };
    }

    @Delete(':eventId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Delete a splitr event' })
    @Summary('Splitr event deleted', 'The user deleted a splitr event')
    @ApiParam({
        name: 'eventId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The ID of the splitr event to delete',
    })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
    })
    async deleteSplitrEvent(
        @UserInRequest() user: User,
        @Param('eventId') eventId: string,
    ): Promise<VoidResourceResponse> {
        const deletedEvent = await this.splitrService.deleteSplitrEvent(user.id, eventId);

        return {
            message: 'Splitr event deleted!',
            details: `Your [${deletedEvent.eventName}] splitr event has been deleted successfully.`,
        };
    }
}
