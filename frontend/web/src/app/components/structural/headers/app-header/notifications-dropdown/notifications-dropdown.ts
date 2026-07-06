import { Component, signal } from '@angular/core';
import { TabList, TabListItem } from '@atoms/tab-list';
import { CheckCheck, LucideAngularModule, X } from 'lucide-angular';

@Component({
    selector: 'notifications-dropdown',
    styleUrl: './notifications-dropdown.css',
    templateUrl: './notifications-dropdown.html',
    imports: [LucideAngularModule, TabList]
})
export class NotificationsDropdown {
    // ICONS
    protected readonly iconSize: number = 18;
    protected readonly CloseIcon = X;
    protected readonly MarkAsReadIcon = CheckCheck;

    // SIGNAL STATES
    protected readonly activeTabIndex = signal<number>(0);

    // METHODS
    protected handleTabChange(index: number) {
        this.activeTabIndex.set(index);
    }

    // DATA
    protected readonly tabListItems: TabListItem[] = [
        {
            value: 'all',
            label: 'All'
        },
        {
            value: 'unread',
            label: 'Unread'
        }
    ];
}
