import { NgClass } from '@angular/common';
import { TabList, TabListItem } from '@atoms/tab-list';
import { Component, output, signal } from '@angular/core';
import { CheckCheck, LucideAngularModule, X } from 'lucide-angular';

@Component({
    selector: 'notifications-dropdown',
    styleUrl: './notifications-dropdown.css',
    templateUrl: './notifications-dropdown.html',
    imports: [NgClass, LucideAngularModule, TabList]
})
export class NotificationsDropdown {
    // ICONS
    protected readonly iconSize: number = 18;
    protected readonly CloseIcon = X;
    protected readonly MarkAsReadIcon = CheckCheck;

    // OUTPUTS
    protected closeNotificationsPanelEvent = output<void>();

    // DATA
    protected readonly notificationsCount = [
        {
            name: 'Notification 1',
            variant: 'read'
        },
        {
            name: 'Notification 2',
            variant: 'unread'
        }
    ];

    // SIGNAL STATES
    protected readonly activeTabIndex = signal<number>(0);
    protected readonly isMarkingAllAsRead = signal<boolean>(false);

    // METHODS
    protected handleTabChange(index: number) {
        this.activeTabIndex.set(index);
    }

    protected handleMarkAllAsRead() {
        alert('Mark all as read');
        this.isMarkingAllAsRead.set(true);

        setTimeout(() => {
            this.isMarkingAllAsRead.set(false);
        }, 2500);
    }

    // DATA
    protected readonly tabListItems: TabListItem[] = [
        {
            value: 'all',
            label: `All [${this.notificationsCount.length}]`
        },
        {
            value: 'unread',
            label: `Unread [${this.notificationsCount.filter(notification => notification.variant === 'unread').length}]`
        }
    ];
}
