import { Observable } from 'rxjs';
import { CookiesAuthGuard } from '@common/guards';
import { VoidResourceResponse } from '@common/types';
import { ServerSentEventsService } from '@common/sse';
import { NotificationsService } from '../services/notifications.service';
import { RawResponse, Summary, UserInRequest } from '@common/decorators';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppNotificationDto, NotificationActionResultDto, NotificationSummaryDto } from '../dto/notifications.dto';
import { Body, Controller, Get, HttpCode, MessageEvent, Param, Patch, Post, Sse, UseGuards } from '@nestjs/common';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(CookiesAuthGuard)
@ApiCookieAuth('access_token')
export class NotificationsController {
    constructor(
        private readonly serverEvents: ServerSentEventsService,
        private readonly notificationsService: NotificationsService
    ) {}

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Get user notifications' })
    @Summary('Notifications retrieved', 'Your notifications were retrieved successfully.')
    @ApiResponse({ status: 200, type: AppNotificationDto, isArray: true })
    getUserNotifications(@UserInRequest() user: User) {
        return this.notificationsService.getUserNotifications(user.id);
    }

    @Get('summary')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get user notification summary' })
    @Summary('Notification summary retrieved', 'Your notification summary was retrieved successfully.')
    @ApiResponse({ status: 200, type: NotificationSummaryDto })
    getSummary(@UserInRequest() user: User) {
        return this.notificationsService.getSummary(user.id);
    }

    @Sse('stream')
    @RawResponse()
    @ApiOperation({ summary: 'Subscribe to user server-sent events' })
    stream(@UserInRequest() user: User): Observable<MessageEvent> {
        return this.serverEvents.streamForUser(user.id);
    }

    @Patch('mark-all-read')
    @HttpCode(200)
    @ApiOperation({ summary: 'Mark all user notifications as read' })
    @Summary('Notifications marked as read', 'All unread notifications were marked as read.')
    @ApiResponse({ status: 200, type: VoidResourceResponse })
    markAllAsRead(@UserInRequest() user: User): Promise<VoidResourceResponse> {
        return this.notificationsService.markAllAsRead(user.id);
    }

    @Patch(':notificationId/read')
    @HttpCode(200)
    @ApiOperation({ summary: 'Mark one notification as read' })
    @ApiParam({ name: 'notificationId', required: true })
    @Summary('Notification marked as read', 'The notification was marked as read.')
    @ApiResponse({ status: 200, type: AppNotificationDto })
    markAsRead(@UserInRequest() user: User, @Param('notificationId') notificationId: string) {
        return this.notificationsService.markAsRead(user.id, notificationId);
    }

    @Patch(':notificationId/archive')
    @HttpCode(200)
    @ApiOperation({ summary: 'Archive one notification' })
    @ApiParam({ name: 'notificationId', required: true })
    @Summary('Notification archived', 'The notification was archived.')
    @ApiResponse({ status: 200, type: AppNotificationDto })
    archive(@UserInRequest() user: User, @Param('notificationId') notificationId: string) {
        return this.notificationsService.archive(user.id, notificationId);
    }

    @Post(':notificationId/actions/:actionId')
    @HttpCode(200)
    @ApiOperation({ summary: 'Execute a notification action' })
    @ApiParam({ name: 'notificationId', required: true })
    @ApiParam({ name: 'actionId', required: true })
    @Summary('Notification action completed', 'The notification action was completed successfully.')
    @ApiResponse({ status: 200, type: NotificationActionResultDto })
    executeAction(
        @UserInRequest() user: User,
        @Param('notificationId') notificationId: string,
        @Param('actionId') actionId: string,
        @Body() _payload: Record<string, unknown>
    ) {
        console.log('Payload', _payload);
        return this.notificationsService.executeAction(user.id, notificationId, actionId);
    }
}
