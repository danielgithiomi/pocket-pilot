import { CookiesAuthGuard } from '@common/guards';
import { hoursToMilliseconds } from '@libs/utils';
import { SplitwiseService } from '../services/splitwise.service';
import { ExposeEnumDto, VoidResourceResponse } from '@common/types';
import { Public, Summary, UserInRequest } from '@common/decorators';
import { Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Body, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SplitwiseEventDto, SplitwiseEventPayload, SettleSplitrPayload } from '../dto/splitwise.dto';

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
    getUserSplitwiseEvents(@UserInRequest() user: User) {
        return this.splitwiseService.getUserSplitwiseEvents(user.id);
    }

    @Get(':eventId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Get a splitwise event by ID' })
    @Summary('Splitwise event retrieved', 'The user retrieved a splitwise event by ID')
    @ApiParam({
        name: 'eventId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The ID of the splitwise event to retrieve',
    })
    @ApiResponse({
        status: 200,
        type: SplitwiseEventDto,
    })
    getUserSplitwiseEventById(@UserInRequest() user: User, @Param('eventId') eventId: string) {
        return this.splitwiseService.getSplitwiseEventById(user.id, eventId);
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

    @Patch(':eventId/settle')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Mark a splitwise event as settled or pending' })
    @Summary('Splitwise event settled or pending', 'The user marked a splitwise event as settled or pending')
    @ApiParam({
        name: 'eventId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The ID of the splitwise event to mark as settled or pending',
    })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
    })
    async markSplitwiseEventAsSettledOrPending(
        @UserInRequest() user: User,
        @Param('eventId') eventId: string,
        @Body() payload: SettleSplitrPayload,
    ): Promise<VoidResourceResponse> {
        const { eventName, isSettled } = await this.splitwiseService.markSplitwiseEventAsSettledOrPending(
            user.id,
            eventId,
            payload,
        );

        const message = 'Event marked as ' + (isSettled ? 'settled!' : 'pending!');
        const details = `Your [${eventName}] splitwise event has been marked as ${isSettled ? 'settled' : 'pending'} successfully.`;

        return { message, details };
    }

    @Delete(':eventId')
    @HttpCode(200)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Delete a splitwise event' })
    @Summary('Splitwise event deleted', 'The user deleted a splitwise event')
    @ApiParam({
        name: 'eventId',
        schema: { type: 'string', format: 'uuid' },
        description: 'The ID of the splitwise event to delete',
    })
    @ApiResponse({
        status: 200,
        type: VoidResourceResponse,
    })
    async deleteSplitwiseEvent(
        @UserInRequest() user: User,
        @Param('eventId') eventId: string,
    ): Promise<VoidResourceResponse> {
        const deletedEvent = await this.splitwiseService.deleteSplitwiseEvent(user.id, eventId);

        return {
            message: 'Splitwise event deleted!',
            details: `Your [${deletedEvent.eventName}] splitwise event has been deleted successfully.`,
        };
    }
}
