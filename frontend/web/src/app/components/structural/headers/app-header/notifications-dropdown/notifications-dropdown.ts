import { NgClass } from '@angular/common';
import { TabList, TabListItem } from '@atoms/tab-list';
import { Component, inject, output, signal } from '@angular/core';
import { NotificationsService } from '@api/notifications.service';
import { CheckCheck, LucideAngularModule, X } from 'lucide-angular';
import { NotificationItem } from '@structural/main/notification-item';

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
    protected readonly notificationsService = inject(NotificationsService);

    // DATA
    protected readonly notifications = this.notificationsService.getUserWrappedNotifications();

    // SIGNAL STATES
    protected readonly activeTabIndex = signal<number>(0);
    protected readonly isMarkingAllAsRead = signal<boolean>(false);

    // METHODS
    protected handleTabChange(index: number) {
        this.activeTabIndex.set(index);
    }

    protected handleMarkAllAsRead() {
        if (!this.notifications.hasUnreadNotifications) return;

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
            label: `All [${this.notifications.totalCount}]`
        },
        {
            value: 'unread',
            label: `Unread${this.notifications.hasUnreadNotifications ? ` [${this.notifications.unreadCount}]` : ''}`
        }
    ];
}
