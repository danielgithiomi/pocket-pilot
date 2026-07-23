import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { NotificationsStore } from '@stores/notifications.store';
import { CheckCheck, LucideAngularModule, X } from 'lucide-angular';
import { NotificationItem } from '@structural/main/notification-item';
import { Component, computed, inject, output, signal } from '@angular/core';
import { TabChangeEventOutput, TabList, TabListItem } from '@atoms/tab-list';
import { AppNotification, NotificationAction, NotificationFilter } from '@global/types';

@Component({
    selector: 'notifications-dropdown',
    styleUrl: './notifications-dropdown.css',
    templateUrl: './notifications-dropdown.html',
    imports: [NgClass, LucideAngularModule, TabList, NotificationItem]
})
export class NotificationsDropdown {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly CloseIcon = X;
    protected readonly MarkAsReadIcon = CheckCheck;

    // OUTPUTS
    protected closeNotificationsPanelEvent = output<void>();

    // SERVICES
    private readonly router = inject(Router);
    protected readonly notificationsStore = inject(NotificationsStore);

    // DATA
    protected readonly isMarkingAllAsRead = this.notificationsStore.isMarkingAllAsRead;
    protected readonly notificationsSummary = this.notificationsStore.notificationsSummary;
    protected readonly activeNotificationFilter = this.notificationsStore.activeNotificationsFilter;

    // SIGNAL STATES
    protected readonly activeTabIndex = signal<0 | 1>(0);
    protected readonly activeTabValue = signal<NotificationFilter>(this.activeNotificationFilter());

    // COMPUTED
    protected readonly notifications = computed<AppNotification[]>(() =>
        this.notificationsSummary().notifications
    );

    protected readonly tabListItems = computed<TabListItem[]>(() => [
        {
            value: 'all',
            label: `All${this.notificationsStore.getTabCount('all') > 0 ? ` [${this.notificationsStore.getTabCount('all')}]` : ''}`
        },
        {
            value: 'unread',
            label: `Unread${this.notificationsSummary().hasUnreadNotifications ? ` [${this.notificationsSummary().unreadCount}]` : ''}`
        }
    ]);

    // METHODS
    protected handleOnViewAllClick = async () => {
        this.closeNotificationsPanelEvent.emit();
        await this.router.navigateByUrl('/notifications');
    };

    protected handleOnTabChange({ index, value }: TabChangeEventOutput) {
        this.activeTabIndex.set(index as 0 | 1);
        this.notificationsStore.setNotificationFilter(value as NotificationFilter);
    }

    protected handleMarkAllAsRead() {
        if (!this.notificationsSummary().hasUnreadNotifications) return;
        this.notificationsStore.markAllAsRead();
    }

    protected handleActionSelected(payload: { notificationId: string; action: NotificationAction }): void {
        this.notificationsStore.executeAction(payload.notificationId, payload.action.id);
    }
}
