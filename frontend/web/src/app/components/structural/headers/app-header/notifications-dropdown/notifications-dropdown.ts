import { NgClass } from '@angular/common';
import { TabList, TabListItem } from '@atoms/tab-list';
import { PPNotification as Notification } from '@global/types';
import { NotificationsStore } from '@stores/notifications.store';
import { CheckCheck, LucideAngularModule, X } from 'lucide-angular';
import { NotificationItem } from '@structural/main/notification-item';
import { Component, computed, inject, output, signal } from '@angular/core';

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
    protected readonly notificationsStore = inject(NotificationsStore);

    // DATA
    protected readonly notificationsSummary = this.notificationsStore.notificationsSummary();

    // SIGNAL STATES
    protected readonly activeTabIndex = signal<number>(0);
    protected readonly isMarkingAllAsRead = signal<boolean>(false);

    // COMPUTEDs
    protected readonly notifications = computed<Notification[]>(() => this.notificationsSummary.notifications);

    // METHODS
    protected handleTabChange(index: number) {
        this.activeTabIndex.set(index);
    }

    protected handleMarkAllAsRead() {
        if (!this.notificationsSummary.hasUnreadNotifications) return;

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
            label: `All [${this.notificationsSummary.totalCount}]`
        },
        {
            value: 'unread',
            label: `Unread${this.notificationsSummary.hasUnreadNotifications ? ` [${this.notificationsSummary.unreadCount}]` : ''}`
        }
    ];
}
