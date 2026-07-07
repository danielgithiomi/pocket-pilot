import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { NotificationsStore } from '@stores/notifications.store';
import { CheckCheck, LucideAngularModule, X } from 'lucide-angular';
import { NotificationItem } from '@structural/main/notification-item';
import { Component, computed, inject, output, signal } from '@angular/core';
import { TabChangeEventOutput, TabList, TabListItem } from '@atoms/tab-list';
import { PPNotification as Notification, TNotificationFilter as NotificationFilter } from '@global/types';

@Component({
    selector: 'notifications-dropdown',
    styleUrl: './notifications-dropdown.css',
    templateUrl: './notifications-dropdown.html',
    imports: [NgClass, LucideAngularModule, TabList, NotificationItem]
})
export class NotificationsDropdown {
    // ICONS
    protected readonly iconSize: number = 18;
    protected readonly CloseIcon = X;
    protected readonly MarkAsReadIcon = CheckCheck;

    // OUTPUTS
    protected closeNotificationsPanelEvent = output<void>();

    // SERVICES
    private readonly router = inject(Router);
    protected readonly notificationsStore = inject(NotificationsStore);

    // DATA
    protected readonly notificationsSummary = this.notificationsStore.notificationsSummary;
    protected readonly activeNotificationFilter = this.notificationsStore.activeNotificationsFilter;

    // SIGNAL STATES
    protected readonly activeTabIndex = signal<number>(0);
    protected readonly isMarkingAllAsRead = signal<boolean>(false);
    protected readonly activeTabValue = signal<NotificationFilter>(this.activeNotificationFilter());

    // COMPUTEDs
    protected readonly notifications = computed<Notification[]>(() => {
        console.log('notifications', this.notificationsSummary().notifications);
        return this.notificationsSummary().notifications;
    });

    // METHODS
    protected handleOnViewAllClick = async () => {
        this.closeNotificationsPanelEvent.emit();
        await this.router.navigateByUrl('/notifications');
    };
    protected handleOnTabChange({ index, value }: TabChangeEventOutput) {
        this.activeTabIndex.set(index);
        this.notificationsStore.setNotificationFilter(value as NotificationFilter);
    }

    protected handleMarkAllAsRead() {
        if (!this.notificationsSummary().hasUnreadNotifications) return;

        alert('Mark all as read');
        this.isMarkingAllAsRead.set(true);

        setTimeout(() => {
            this.isMarkingAllAsRead.set(false);
        }, 2500);
    }

    // STATIC DATA
    protected readonly tabListItems: TabListItem[] = [
        {
            value: 'all',
            label: `All${this.notificationsSummary().totalCount > 0 ? ` [${this.notificationsSummary().totalCount}]` : ''}`
        },
        {
            value: 'unread',
            label: `Unread${this.notificationsSummary().hasUnreadNotifications ? ` [${this.notificationsSummary().unreadCount}]` : ''}`
        }
    ];
}
