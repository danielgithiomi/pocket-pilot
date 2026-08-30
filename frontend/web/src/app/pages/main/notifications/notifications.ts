import { Button } from '@atoms/button';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { TabList, TabListItem } from '@atoms/tab-list';
import { NotificationsStore } from '@stores/notifications.store';
import { Component, computed, inject, signal } from '@angular/core';
import { NoData } from '@components/structural/main/no-data/no-data';
import { NotificationItem } from '@structural/main/notification-item';
import { FetchError } from '@components/structural/main/fetch-error/fetch-error';
import { AppNotification, NotificationAction, NotificationFilter } from '@shared/types';
import { Bell, CheckCheck, LucideAngularModule, Settings, ShieldAlert } from 'lucide-angular';

@Component({
    selector: 'notifications',
    styleUrl: './notifications.css',
    templateUrl: './notifications.html',
    imports: [NgClass, LucideAngularModule, Button, TabList, NotificationItem, FetchError, NoData]
})
export class Notifications {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly BellIcon = Bell;
    protected readonly SettingsIcon = Settings;
    protected readonly CriticalIcon = ShieldAlert;
    protected readonly MarkAllAsReadIcon = CheckCheck;

    // SERVICES
    private readonly router = inject(Router);
    protected readonly notificationsStore = inject(NotificationsStore);

    // STATE
    protected readonly activeTabIndex = signal<number>(0);

    // COMPUTED
    protected readonly pageState = computed(() => ({
        summary: this.notificationsStore.summary(),
        hasError: !!this.notificationsStore.notificationsError(),
        isLoading: this.notificationsStore.notificationsLoading(),
        notifications: this.notificationsStore.filteredNotifications(),
        isMarkingAllAsRead: this.notificationsStore.isMarkingAllAsRead()
    }));

    protected readonly filterTabs = computed<TabListItem[]>(() => {
        const filters: Array<{ value: NotificationFilter; label: string }> = [
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread' },
            { value: 'action_required', label: 'Action Required' },
            { value: 'bill', label: 'Bills' },
            { value: 'budget', label: 'Budgets' },
            { value: 'transaction', label: 'Transactions' },
            { value: 'account', label: 'Accounts' },
            { value: 'security', label: 'Security' }
        ];

        return filters.map((filter) => {
            const count = this.notificationsStore.getTabCount(filter.value);
            return {
                value: filter.value,
                label: `${filter.label}${count > 0 ? ` [${count}]` : ''}`
            };
        });
    });

    protected readonly criticalAlerts = computed<AppNotification[]>(() =>
        this.notificationsStore
            .notifications()
            .filter((notification) => notification.priority === 'CRITICAL')
            .slice(0, 3)
    );

    protected readonly billReminders = computed<AppNotification[]>(() =>
        this.notificationsStore
            .notifications()
            .filter((notification) => notification.category === 'BILL')
            .slice(0, 3)
    );

    protected readonly notificationHealth = computed<number>(() => {
        const summary = this.notificationsStore.summary();
        if (summary.totalCount === 0) return 100;

        return Math.max(0, Math.round(((summary.totalCount - summary.unreadCount) / summary.totalCount) * 100));
    });

    // METHODS
    protected handleFilterChange({ index, value }: { index: number; value: string }): void {
        this.activeTabIndex.set(index);
        this.notificationsStore.setNotificationFilter(value as NotificationFilter);
    }

    protected handleActionSelected(payload: { notificationId: string; action: NotificationAction }): void {
        this.notificationsStore.executeAction(payload.notificationId, payload.action.id);
    }

    protected async goToSettings(): Promise<void> {
        await this.router.navigateByUrl('/settings');
    }
}
