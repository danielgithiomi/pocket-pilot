import { NotificationsService } from '@api/notifications.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
    PPNotification as Notification,
    PPNotificationSummary as Summary,
    TNotificationFilter as Filter
} from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class NotificationsStore {
    private readonly notificationsService = inject(NotificationsService);

    // LOCAL STATE SIGNALS
    private readonly _notifications = signal<Notification[]>([]);
    private readonly _notificationsError = signal<boolean>(false);
    private readonly _notificationsLoading = signal<boolean>(false);
    private readonly _activeNotificationsFilter = signal<Filter>('all');

    // ACCESSORS
    readonly notifications = this._notifications.asReadonly();
    readonly notificationsError = this._notificationsError.asReadonly();
    readonly notificationsLoading = this._notificationsLoading.asReadonly();
    readonly activeNotificationsFilter = this._activeNotificationsFilter.asReadonly();

    // MODIFIERS
    setNotificationFilter(filter: Filter) {
        this._activeNotificationsFilter.set(filter);
    }

    // COMPUTEDs
    readonly notificationsSummary = computed<Summary>(() => {
        const notifications = this.filteredNotifications();
        const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

        return {
            unreadCount,
            notifications,
            totalCount: notifications.length,
            hasUnreadNotifications: unreadCount > 0
        } satisfies Summary;
    });

    readonly filteredNotifications = computed<Notification[]>(() => {
        const notifications = this._notifications();
        const currentFilter = this._activeNotificationsFilter();

        switch (currentFilter) {
            case 'read':
                return notifications.filter(notification => notification.status === 'READ');
            case 'unread':
                return notifications.filter(notification => notification.status === 'UNREAD');
            case 'all':
            default:
                return notifications;
        }
    });

    // METHODS
    loadNotifications() {
        this._notificationsLoading.set(true);

        setTimeout(() => {
            const fetchedNotifications = this.notificationsService.notificationsSignal();
            this._notifications.set(fetchedNotifications);
            this._notificationsLoading.set(false);
        }, 2000);
    }
}
