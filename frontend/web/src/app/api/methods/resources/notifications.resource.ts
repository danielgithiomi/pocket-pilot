import { Injectable } from '@angular/core';
import { concatUrl } from '@methods/methods.utils';
import { httpResource } from '@angular/common/http';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { AppNotification, IStandardResponse, NotificationSummary } from '@global/types';

const EMPTY_NOTIFICATIONS_RESPONSE: IStandardResponse<AppNotification[]> = {
    data: [],
    endpoint: '',
    statusCode: 200,
    timestamp: '',
    summary: {
        title: 'Notifications',
        details: 'No notifications loaded.'
    }
};

const EMPTY_SUMMARY_RESPONSE: IStandardResponse<NotificationSummary> = {
    data: {
        totalCount: 0,
        unreadCount: 0,
        criticalCount: 0,
        archivedCount: 0,
        actionRequiredCount: 0,
        hasUnreadNotifications: false
    },
    endpoint: '',
    statusCode: 200,
    timestamp: '',
    summary: {
        title: 'Notification summary',
        details: 'No notification summary loaded.'
    }
};

@Injectable({
    providedIn: 'root'
})
export class NotificationsResource {
    readonly userNotifications = httpResource<IStandardResponse<AppNotification[]>>(
        () => ({
            method: 'GET',
            cache: 'no-cache',
            url: concatUrl(endpoints.notifications)
        }),
        { defaultValue: EMPTY_NOTIFICATIONS_RESPONSE }
    );

    readonly notificationSummary = httpResource<IStandardResponse<NotificationSummary>>(
        () => ({
            method: 'GET',
            cache: 'no-cache',
            url: concatUrl(endpoints.notifications_summary)
        }),
        { defaultValue: EMPTY_SUMMARY_RESPONSE }
    );
}
