import { Router } from '@angular/router';
import { NotificationsService } from '@api/notifications.service';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
    AppNotification,
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
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly notificationsService = inject(NotificationsService);

    private readonly notificationsResource = this.notificationsService.getUserNotifications();
    private readonly summaryResource = this.notificationsService.getNotificationSummary();

    private readonly _activeNotificationsFilter = signal<NotificationFilter>('all');
    private readonly _isMarkingAllAsRead = signal<boolean>(false);
    private readonly _activeMutationId = signal<string | null>(null);

    readonly activeMutationId = this._activeMutationId.asReadonly();
    readonly isMarkingAllAsRead = this._isMarkingAllAsRead.asReadonly();
    readonly activeNotificationsFilter = this._activeNotificationsFilter.asReadonly();

    readonly notificationsLoading = computed(
        () => this.notificationsResource.isLoading() || this.summaryResource.isLoading()
    );

    readonly notificationsError = computed(() => this.notificationsResource.error() || this.summaryResource.error());

    readonly notifications = computed<AppNotification[]>(() => {
        const dummy: AppNotification[] = [
            {
                id: 'notif_001',
                userId: 'user_001',
                type: 'BILL_DUE_SOON',
                category: 'BILL',
                priority: 'HIGH',
                status: 'UNREAD',
                title: 'Electricity bill due soon',
                message: 'Your electricity bill of $84.50 is due in 3 days.',
                shortMessage: 'Due in 3 days',
                icon: 'receipt-text',
                requiresAction: true,
                resource: {
                    resourceType: 'BILL',
                    resourceId: 'bill_001',
                    resourceUrl: '/bills/bill_001'
                },
                metadata: {
                    billName: 'Electricity',
                    amount: {
                        amount: 84.5,
                        currency: 'USD'
                    },
                    dueDate: '2026-07-11',
                    daysRemaining: 3
                },
                actions: [
                    {
                        id: 'view_bill',
                        label: 'View bill',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/bills/bill_001'
                    },
                    {
                        id: 'mark_paid',
                        label: 'Mark paid',
                        type: 'API_CALL',
                        variant: 'SECONDARY',
                        apiEndpoint: '/api/bills/bill_001/mark-paid',
                        confirmationRequired: true
                    }
                ],
                createdAt: '2026-07-08T08:30:00.000Z',
                dedupeKey: 'bill_due_soon:user_001:bill_001'
            },
            {
                id: 'notif_002',
                userId: 'user_001',
                type: 'BILL_OVERDUE',
                category: 'BILL',
                priority: 'CRITICAL',
                status: 'UNREAD',
                title: 'Internet bill is overdue',
                message: 'Your internet bill of $49.99 was due yesterday. Pay it soon to avoid service interruption.',
                shortMessage: 'Overdue by 1 day',
                icon: 'circle-alert',
                requiresAction: true,
                resource: {
                    resourceType: 'BILL',
                    resourceId: 'bill_002',
                    resourceUrl: '/bills/bill_002'
                },
                metadata: {
                    billName: 'Internet',
                    amount: {
                        amount: 49.99,
                        currency: 'USD'
                    },
                    dueDate: '2026-07-07',
                    daysRemaining: -1
                },
                actions: [
                    {
                        id: 'pay_now',
                        label: 'Pay now',
                        type: 'NAVIGATE',
                        variant: 'DANGER',
                        url: '/bills/bill_002/pay'
                    },
                    {
                        id: 'view_bill',
                        label: 'View details',
                        type: 'NAVIGATE',
                        variant: 'GHOST',
                        url: '/bills/bill_002'
                    }
                ],
                createdAt: '2026-07-08T07:45:00.000Z',
                dedupeKey: 'bill_overdue:user_001:bill_002'
            },
            {
                id: 'notif_003',
                userId: 'user_001',
                type: 'BUDGET_WARNING',
                category: 'BUDGET',
                priority: 'MEDIUM',
                status: 'UNREAD',
                title: 'Food budget almost reached',
                message: 'You have used 87% of your Food budget this month.',
                shortMessage: '87% used',
                icon: 'chart-pie',
                requiresAction: false,
                resource: {
                    resourceType: 'BUDGET',
                    resourceId: 'budget_001',
                    resourceUrl: '/budgets/budget_001'
                },
                metadata: {
                    budgetName: 'Food',
                    percentageUsed: 87,
                    amount: {
                        amount: 435,
                        currency: 'USD'
                    },
                    extraLabel: 'Monthly limit',
                    extraValue: '$500.00'
                },
                actions: [
                    {
                        id: 'review_budget',
                        label: 'Review budget',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/budgets/budget_001'
                    }
                ],
                createdAt: '2026-07-08T06:20:00.000Z',
                dedupeKey: 'budget_warning:user_001:budget_001:2026-07'
            },
            {
                id: 'notif_004',
                userId: 'user_001',
                type: 'BUDGET_EXCEEDED',
                category: 'BUDGET',
                priority: 'HIGH',
                status: 'READ',
                title: 'Transport budget exceeded',
                message: 'You have exceeded your Transport budget by $32.40 this month.',
                shortMessage: 'Budget exceeded',
                icon: 'trending-up',
                requiresAction: true,
                resource: {
                    resourceType: 'BUDGET',
                    resourceId: 'budget_002',
                    resourceUrl: '/budgets/budget_002'
                },
                metadata: {
                    budgetName: 'Transport',
                    percentageUsed: 112,
                    amount: {
                        amount: 282.4,
                        currency: 'USD'
                    },
                    extraLabel: 'Budget limit',
                    extraValue: '$250.00'
                },
                actions: [
                    {
                        id: 'adjust_budget',
                        label: 'Adjust budget',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/budgets/budget_002/edit'
                    }
                ],
                createdAt: '2026-07-07T17:05:00.000Z',
                readAt: '2026-07-07T18:10:00.000Z',
                dedupeKey: 'budget_exceeded:user_001:budget_002:2026-07'
            },
            {
                id: 'notif_005',
                userId: 'user_001',
                type: 'LARGE_TRANSACTION',
                category: 'TRANSACTION',
                priority: 'MEDIUM',
                status: 'UNREAD',
                title: 'Large transaction detected',
                message: 'A transaction of $725.00 was detected at Apple Store.',
                shortMessage: '$725.00 at Apple Store',
                icon: 'credit-card',
                requiresAction: false,
                resource: {
                    resourceType: 'TRANSACTION',
                    resourceId: 'txn_001',
                    resourceUrl: '/transactions/txn_001'
                },
                metadata: {
                    merchantName: 'Apple Store',
                    transactionDate: '2026-07-08',
                    amount: {
                        amount: 725,
                        currency: 'USD'
                    },
                    accountName: 'Main Checking'
                },
                actions: [
                    {
                        id: 'view_transaction',
                        label: 'View transaction',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/transactions/txn_001'
                    }
                ],
                createdAt: '2026-07-08T05:15:00.000Z',
                dedupeKey: 'large_transaction:user_001:txn_001'
            },
            {
                id: 'notif_006',
                userId: 'user_001',
                type: 'UNUSUAL_SPENDING',
                category: 'TRANSACTION',
                priority: 'HIGH',
                status: 'UNREAD',
                title: 'Unusual spending pattern',
                message: 'Your spending on Entertainment is 64% higher than your usual monthly average.',
                shortMessage: '64% higher than usual',
                icon: 'radar',
                requiresAction: true,
                resource: {
                    resourceType: 'BUDGET',
                    resourceId: 'budget_003',
                    resourceUrl: '/budgets/entertainment'
                },
                metadata: {
                    budgetName: 'Entertainment',
                    percentageUsed: 64,
                    previousAmount: {
                        amount: 180,
                        currency: 'USD'
                    },
                    currentAmount: {
                        amount: 295,
                        currency: 'USD'
                    }
                },
                actions: [
                    {
                        id: 'review_spending',
                        label: 'Review spending',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/analytics/spending/entertainment'
                    }
                ],
                createdAt: '2026-07-07T14:40:00.000Z',
                dedupeKey: 'unusual_spending:user_001:entertainment:2026-07'
            },
            {
                id: 'notif_007',
                userId: 'user_001',
                type: 'ACCOUNT_BALANCE_LOW',
                category: 'ACCOUNT',
                priority: 'CRITICAL',
                status: 'UNREAD',
                title: 'Checking balance is low',
                message: 'Your Main Checking account balance is below your safety threshold of $250.00.',
                shortMessage: 'Balance below threshold',
                icon: 'wallet',
                requiresAction: true,
                resource: {
                    resourceType: 'ACCOUNT',
                    resourceId: 'account_001',
                    resourceUrl: '/accounts/account_001'
                },
                metadata: {
                    accountName: 'Main Checking',
                    amount: {
                        amount: 184.22,
                        currency: 'USD'
                    },
                    extraLabel: 'Safety threshold',
                    extraValue: '$250.00'
                },
                actions: [
                    {
                        id: 'view_account',
                        label: 'View account',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/accounts/account_001'
                    },
                    {
                        id: 'transfer_money',
                        label: 'Transfer money',
                        type: 'NAVIGATE',
                        variant: 'SECONDARY',
                        url: '/transfers/new'
                    }
                ],
                createdAt: '2026-07-08T03:50:00.000Z',
                dedupeKey: 'account_balance_low:user_001:account_001'
            },
            {
                id: 'notif_008',
                userId: 'user_001',
                type: 'BANK_SYNC_FAILED',
                category: 'ACCOUNT',
                priority: 'HIGH',
                status: 'READ',
                title: 'Bank sync failed',
                message:
                    'We could not sync your Revolut account. Reconnect your account to keep your transactions up to date.',
                shortMessage: 'Reconnect required',
                icon: 'refresh-cw-off',
                requiresAction: true,
                resource: {
                    resourceType: 'ACCOUNT',
                    resourceId: 'account_002',
                    resourceUrl: '/accounts/account_002'
                },
                metadata: {
                    accountName: 'Revolut'
                },
                actions: [
                    {
                        id: 'reconnect_account',
                        label: 'Reconnect',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/accounts/account_002/reconnect'
                    }
                ],
                createdAt: '2026-07-06T21:30:00.000Z',
                readAt: '2026-07-07T08:15:00.000Z',
                dedupeKey: 'bank_sync_failed:user_001:account_002'
            },
            {
                id: 'notif_009',
                userId: 'user_001',
                type: 'GOAL_MILESTONE',
                category: 'GOAL',
                priority: 'LOW',
                status: 'READ',
                title: 'Emergency fund reached 75%',
                message: 'Great progress. You have saved 75% of your Emergency Fund goal.',
                shortMessage: '75% completed',
                icon: 'badge-check',
                requiresAction: false,
                resource: {
                    resourceType: 'GOAL',
                    resourceId: 'goal_001',
                    resourceUrl: '/goals/goal_001'
                },
                metadata: {
                    goalName: 'Emergency Fund',
                    percentageUsed: 75,
                    currentAmount: {
                        amount: 3750,
                        currency: 'USD'
                    },
                    extraLabel: 'Goal target',
                    extraValue: '$5,000.00'
                },
                actions: [
                    {
                        id: 'view_goal',
                        label: 'View goal',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/goals/goal_001'
                    }
                ],
                createdAt: '2026-07-05T11:00:00.000Z',
                readAt: '2026-07-05T12:00:00.000Z',
                dedupeKey: 'goal_milestone:user_001:goal_001:75'
            },
            {
                id: 'notif_010',
                userId: 'user_001',
                type: 'SECURITY_ALERT',
                category: 'SECURITY',
                priority: 'CRITICAL',
                status: 'UNREAD',
                title: 'New login detected',
                message: 'A new login to your Pocket Pilot account was detected from Chrome on macOS.',
                shortMessage: 'Chrome on macOS',
                icon: 'shield-alert',
                requiresAction: true,
                resource: {
                    resourceType: 'SETTINGS',
                    resourceUrl: '/settings/security'
                },
                metadata: {
                    extraLabel: 'Location',
                    extraValue: 'Mauritius'
                },
                actions: [
                    {
                        id: 'review_security',
                        label: 'Review security',
                        type: 'NAVIGATE',
                        variant: 'DANGER',
                        url: '/settings/security'
                    }
                ],
                createdAt: '2026-07-08T01:10:00.000Z',
                dedupeKey: 'security_alert:user_001:login:2026-07-08T01:10'
            },
            {
                id: 'notif_011',
                userId: 'user_001',
                type: 'BILL_PAID',
                category: 'BILL',
                priority: 'LOW',
                status: 'READ',
                title: 'Water bill marked as paid',
                message: 'Your water bill of $22.75 has been marked as paid.',
                shortMessage: 'Payment recorded',
                icon: 'check-circle',
                requiresAction: false,
                resource: {
                    resourceType: 'BILL',
                    resourceId: 'bill_003',
                    resourceUrl: '/bills/bill_003'
                },
                metadata: {
                    billName: 'Water',
                    amount: {
                        amount: 22.75,
                        currency: 'USD'
                    },
                    paidDate: '2026-07-07'
                },
                actions: [
                    {
                        id: 'view_bill',
                        label: 'View bill',
                        type: 'NAVIGATE',
                        variant: 'GHOST',
                        url: '/bills/bill_003'
                    }
                ],
                createdAt: '2026-07-07T09:25:00.000Z',
                readAt: '2026-07-07T09:40:00.000Z',
                dedupeKey: 'bill_paid:user_001:bill_003'
            },
            {
                id: 'notif_012',
                userId: 'user_001',
                type: 'SYSTEM_UPDATE',
                category: 'SYSTEM',
                priority: 'LOW',
                status: 'READ',
                title: 'New reports are available',
                message: 'Your monthly spending report for June is ready to view.',
                shortMessage: 'June report ready',
                icon: 'file-chart-column',
                requiresAction: false,
                resource: {
                    resourceType: 'SYSTEM',
                    resourceUrl: '/reports/monthly/2026-06'
                },
                actions: [
                    {
                        id: 'view_report',
                        label: 'View report',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/reports/monthly/2026-06'
                    }
                ],
                createdAt: '2026-07-01T08:00:00.000Z',
                readAt: '2026-07-01T08:20:00.000Z',
                dedupeKey: 'monthly_report:user_001:2026-06'
            }
        ];
        if (this.notificationsResource.error()) return dummy;
        // return this.notificationsResource.value().data;
        return dummy;
    });

    readonly filteredNotifications = computed<AppNotification[]>(() => {
        const filter = this._activeNotificationsFilter();
        const notifications = this.notifications();

        if (filter === 'all') return notifications;
        if (filter === 'unread') return notifications.filter(notification => notification.status === 'UNREAD');
        if (filter === 'action_required') return notifications.filter(notification => notification.requiresAction);

        return notifications.filter(notification => notification.category.toLowerCase() === filter);
    });

    readonly summary = computed<NotificationSummary>(() => {
        if (!this.summaryResource.error()) return this.summaryResource.value().data;

        const notifications = this.notifications();
        const unreadCount = notifications.filter(notification => notification.status === 'UNREAD').length;

        return {
            unreadCount,
            archivedCount: 0,
            totalCount: notifications.length,
            hasUnreadNotifications: unreadCount > 0,
            criticalCount: notifications.filter(notification => notification.priority === 'CRITICAL').length,
            actionRequiredCount: notifications.filter(notification => notification.requiresAction).length
        };
    });

    readonly notificationsSummary = computed<PPNotificationSummary>(() => ({
        ...this.summary(),
        notifications: this.filteredNotifications()
    }));

    constructor() {
        this.connectRealtime();
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
        if (filter === 'unread') return notifications.filter(notification => notification.status === 'UNREAD').length;
        if (filter === 'action_required')
            return notifications.filter(notification => notification.requiresAction).length;

        return notifications.filter(notification => notification.category.toLowerCase() === filter).length;
    }

    loadNotifications(): void {
        this.reload();
    }

    reload(): void {
        this.notificationsResource.reload();
        this.summaryResource.reload();
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
            next: result => {
                this.reload();
                if (result.redirectUrl) this.redirectToActionTarget(result.redirectUrl);
            },
            complete: () => this._activeMutationId.set(null)
        });
    }

    private connectRealtime(): void {
        if (this.eventSource) return;

        this.eventSource = this.notificationsService.connectToEvents(
            () => this.reload(),
            () => {
                // EventSource handles reconnections automatically. We keep the error quiet here so
                // transient local-dev backend restarts do not spam the UI with toasts.
            }
        );
    }

    private redirectToActionTarget(redirectUrl: string): void {
        if (/^https?:\/\//i.test(redirectUrl)) {
            window.location.assign(redirectUrl);
            return;
        }

        void this.router.navigateByUrl(redirectUrl);
    }
}
