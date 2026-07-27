import { NotificationsService } from '@api/notifications.service';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
    AppNotification,
    NotificationEventPayload,
    NotificationFilter,
    NotificationSummary,
    PPNotificationSummary,
    TNotificationFilter
} from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class NotificationsStore {
    private eventSource?: EventSource;
    private readonly destroyRef = inject(DestroyRef);
    private readonly notificationsService = inject(NotificationsService);

    private readonly summaryResource = this.notificationsService.getNotificationSummary();
    private readonly notificationsResource = this.notificationsService.getUserNotifications();

    private readonly _isMarkingAllAsRead = signal<boolean>(false);
    private readonly _activeMutationId = signal<string | null>(null);
    private readonly _activeNotificationsFilter = signal<NotificationFilter>('all');

    readonly activeMutationId = this._activeMutationId.asReadonly();
    readonly isMarkingAllAsRead = this._isMarkingAllAsRead.asReadonly();
    readonly activeNotificationsFilter = this._activeNotificationsFilter.asReadonly();

    readonly notificationsLoading = computed(
        () => this.notificationsResource.isLoading() || this.summaryResource.isLoading()
    );

    readonly notificationsError = computed(() => this.notificationsResource.error() || this.summaryResource.error());

    readonly notifications = computed<AppNotification[]>(() => {
        if (this.notificationsResource.error() || !this.notificationsResource.hasValue()) return [];
        return this.notificationsResource.value().data;
    });

    readonly filteredNotifications = computed<AppNotification[]>(() => {
        const notifications = this.notifications();
        const filter = this._activeNotificationsFilter();

        if (filter === 'all') return notifications;
        if (filter === 'unread') return notifications.filter((notification) => notification.status === 'UNREAD');
        if (filter === 'action_required') return notifications.filter((notification) => notification.requiresAction);

        return notifications.filter((notification) => notification.category.toLowerCase() === filter);
    });

    readonly summary = computed<NotificationSummary>(() => {
        if (!this.summaryResource.error()) return this.summaryResource.value().data;

        const notifications = this.notifications();
        const unreadCount = notifications.filter((notification) => notification.status === 'UNREAD').length;

        return {
            unreadCount,
            archivedCount: 0,
            totalCount: notifications.length,
            hasUnreadNotifications: unreadCount > 0,
            actionRequiredCount: notifications.filter((notification) => notification.requiresAction).length,
            criticalCount: notifications.filter((notification) => notification.priority === 'CRITICAL').length
        };
    });

    readonly notificationsSummary = computed<PPNotificationSummary>(() => ({
        ...this.summary(),
        notifications: this.filteredNotifications()
    }));

    constructor() {
        this.connectToSSEStream();
        this.destroyRef.onDestroy(() => this.eventSource?.close());
    }

    setNotificationFilter(filter: NotificationFilter | TNotificationFilter): void {
        if (filter === 'read') {
            this._activeNotificationsFilter.set('all');
            return;
        }

        this._activeNotificationsFilter.set(filter);
    }

    getTabCount(filter: NotificationFilter): number {
        const notifications = this.notifications();

        if (filter === 'all') return notifications.length;
        if (filter === 'unread') return notifications.filter((notification) => notification.status === 'UNREAD').length;
        if (filter === 'action_required')
            return notifications.filter((notification) => notification.requiresAction).length;

        return notifications.filter((notification) => notification.category.toLowerCase() === filter).length;
    }

    reload(): void {
        this.summaryResource.reload();
        this.notificationsResource.reload();
    }

    markAsRead(notificationId: string): void {
        this._activeMutationId.set(notificationId);
        this.notificationsService.markAsRead(notificationId).subscribe({
            next: () => this.reload(),
            complete: () => this._activeMutationId.set(null)
        });
    }

    archive(notificationId: string): void {
        this._activeMutationId.set(notificationId);
        this.notificationsService.archive(notificationId).subscribe({
            next: () => this.reload(),
            complete: () => this._activeMutationId.set(null)
        });
    }

    markAllAsRead(): void {
        if (!this.summary().hasUnreadNotifications) return;

        this._isMarkingAllAsRead.set(true);
        this.notificationsService.markAllAsRead().subscribe({
            next: () => this.reload(),
            complete: () => this._isMarkingAllAsRead.set(false)
        });
    }

    executeAction(notificationId: string, actionId: string): void {
        this._activeMutationId.set(notificationId);
        this.notificationsService.executeAction(notificationId, actionId).subscribe({
            next: (result) => {
                this.reload();
                if (result.redirectUrl) this.notificationsService.redirectToActionTarget(result.redirectUrl);
            },
            complete: () => this._activeMutationId.set(null)
        });
    }

    private connectToSSEStream(): void {
        if (this.eventSource) return;

        this.eventSource = this.notificationsService.connectToNotificationsSSEStream(
            (_: NotificationEventPayload) => this.reload(),
            () => {
                // EventSource handles reconnections automatically. We keep the error quiet here so
                // transient local-dev backend restarts do not spam the UI with toasts.
            }
        );
    }
}
