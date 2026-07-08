import {
    Notification,
    NotificationCategory,
    NotificationPriority,
    NotificationStatus,
    NotificationType,
    Prisma
} from '@prisma/client';
import { VoidResourceResponse } from '@common/types';
import { ServerSentEventsService } from '@common/sse';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationActionDto, NotificationActionResultDto, NotificationSummaryDto } from '../dto/notifications.dto';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly serverEvents: ServerSentEventsService,
        private readonly notificationsRepository: NotificationsRepository
    ) {}

    async getUserNotifications(userId: string): Promise<Notification[]> {
        await this.seedStarterNotificationsIfNeeded(userId);
        return this.notificationsRepository.getUserNotifications(userId);
    }

    async getSummary(userId: string): Promise<NotificationSummaryDto> {
        await this.seedStarterNotificationsIfNeeded(userId);

        const [notifications, archivedCount] = await Promise.all([
            this.notificationsRepository.getUserNotifications(userId),
            this.notificationsRepository.countUserNotifications(userId, NotificationStatus.ARCHIVED)
        ]);

        const unreadCount = notifications.filter(notification => notification.status === NotificationStatus.UNREAD).length;
        const actionRequiredCount = notifications.filter(notification => notification.requiresAction).length;
        const criticalCount = notifications.filter(
            notification => notification.priority === NotificationPriority.CRITICAL
        ).length;

        return {
            unreadCount,
            criticalCount,
            archivedCount,
            actionRequiredCount,
            totalCount: notifications.length,
            hasUnreadNotifications: unreadCount > 0
        };
    }

    async markAsRead(userId: string, notificationId: string): Promise<Notification> {
        await this.ensureUserNotificationExists(userId, notificationId);
        const notification = await this.notificationsRepository.markAsRead(userId, notificationId);
        this.serverEvents.emitToUser(userId, 'notification.updated', {
            notification,
            eventType: 'NOTIFICATION_UPDATED'
        });
        return notification;
    }

    async archive(userId: string, notificationId: string): Promise<Notification> {
        await this.ensureUserNotificationExists(userId, notificationId);
        const notification = await this.notificationsRepository.archive(userId, notificationId);
        this.serverEvents.emitToUser(userId, 'notification.updated', {
            notification,
            eventType: 'NOTIFICATION_UPDATED'
        });
        return notification;
    }

    async markAllAsRead(userId: string): Promise<VoidResourceResponse> {
        const result = await this.notificationsRepository.markAllAsRead(userId);
        const notifications = await this.notificationsRepository.getUserNotifications(userId);

        this.serverEvents.emitToUser(userId, 'notifications.refreshed', {
            notifications,
            eventType: 'NOTIFICATIONS_REFRESHED',
            updatedCount: result.count
        });

        return {
            message: 'Notifications marked as read.',
            details: `${result.count} unread notification${result.count === 1 ? '' : 's'} marked as read.`
        };
    }

    async executeAction(userId: string, notificationId: string, actionId: string): Promise<NotificationActionResultDto> {
        const notification = await this.ensureUserNotificationExists(userId, notificationId);
        const actions = (notification.actions ?? []) as unknown as NotificationActionDto[];
        const action = actions.find(candidate => candidate.id === actionId);

        if (!action) {
            throw new BadRequestException({
                type: 'NOTIFICATION_ACTION_NOT_FOUND',
                title: 'Notification action not found!',
                details: `The action [${actionId}] does not exist for this notification.`
            });
        }

        if (notification.status === NotificationStatus.UNREAD) {
            await this.markAsRead(userId, notificationId);
        }

        // Command-style notification actions are accepted here, but domain-specific effects
        // such as bill payment or account transfer should live in their owning modules.
        return {
            message: 'Notification action accepted.',
            details: `The [${action.label}] action was handled successfully.`,
            redirectUrl: action.url
        };
    }

    private async ensureUserNotificationExists(userId: string, notificationId: string): Promise<Notification> {
        const notification = await this.notificationsRepository.findUserNotificationById(userId, notificationId);

        if (!notification) {
            throw new NotFoundException({
                type: 'NOTIFICATION_NOT_FOUND',
                title: 'Notification not found!',
                details: 'The notification does not exist or is not available to this user.'
            });
        }

        return notification;
    }

    private async seedStarterNotificationsIfNeeded(userId: string): Promise<void> {
        const existingCount = await this.notificationsRepository.countUserNotifications(userId);
        if (existingCount > 0) return;

        const now = new Date();
        const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

        const starterNotifications: Prisma.NotificationCreateManyInput[] = [
            {
                userId,
                icon: 'receipt-cent',
                title: 'Electricity bill due soon',
                type: NotificationType.BILL_DUE_SOON,
                category: NotificationCategory.BILL,
                priority: NotificationPriority.HIGH,
                status: NotificationStatus.UNREAD,
                shortMessage: 'Electricity bill due in 3 days',
                message: 'Your electricity bill is due in 3 days. Review it now to avoid a late payment.',
                requiresAction: true,
                dedupeKey: 'starter-bill-due-soon',
                accentColor: 'var(--warning)',
                resource: this.asJson({ resourceType: 'BILL', resourceUrl: '/goals' }),
                metadata: this.asJson({
                    daysRemaining: 3,
                    billName: 'Electricity',
                    dueDate: daysFromNow(3),
                    amount: { amount: 125.5, currency: 'USD' }
                }),
                actions: this.asJson([
                    { id: 'view-bill', label: 'View bill', type: 'NAVIGATE', variant: 'PRIMARY', url: '/goals' },
                    { id: 'mark-paid', label: 'Mark paid', type: 'API_CALL', variant: 'SECONDARY' }
                ])
            },
            {
                userId,
                icon: 'triangle-alert',
                title: 'Rent payment is overdue',
                type: NotificationType.BILL_OVERDUE,
                category: NotificationCategory.BILL,
                priority: NotificationPriority.CRITICAL,
                status: NotificationStatus.UNREAD,
                message: 'Your rent payment appears overdue. Take action now to protect your payment history.',
                requiresAction: true,
                dedupeKey: 'starter-bill-overdue',
                accentColor: 'var(--error)',
                resource: this.asJson({ resourceType: 'BILL', resourceUrl: '/goals' }),
                metadata: this.asJson({
                    daysRemaining: -2,
                    billName: 'Rent',
                    dueDate: daysFromNow(-2),
                    amount: { amount: 1200, currency: 'USD' }
                }),
                actions: this.asJson([
                    { id: 'pay-now', label: 'Pay now', type: 'NAVIGATE', variant: 'DANGER', url: '/goals' },
                    { id: 'view-details', label: 'View details', type: 'NAVIGATE', variant: 'SECONDARY', url: '/goals' }
                ])
            },
            {
                userId,
                icon: 'gauge',
                title: 'Household budget is at 86%',
                type: NotificationType.BUDGET_WARNING,
                category: NotificationCategory.BUDGET,
                priority: NotificationPriority.MEDIUM,
                status: NotificationStatus.UNREAD,
                message: 'You have used 86% of your household budget with a week left in the month.',
                requiresAction: false,
                dedupeKey: 'starter-budget-warning',
                accentColor: 'var(--warning)',
                resource: this.asJson({ resourceType: 'BUDGET', resourceUrl: '/settings' }),
                metadata: this.asJson({
                    budgetName: 'Household',
                    percentageUsed: 86,
                    extraLabel: 'Remaining',
                    extraValue: '14%'
                }),
                actions: this.asJson([
                    { id: 'review-budget', label: 'Review budget', type: 'NAVIGATE', variant: 'PRIMARY', url: '/settings' }
                ])
            },
            {
                userId,
                icon: 'credit-card',
                title: 'Large transaction detected',
                type: NotificationType.LARGE_TRANSACTION,
                category: NotificationCategory.TRANSACTION,
                priority: NotificationPriority.MEDIUM,
                status: NotificationStatus.READ,
                readAt: now,
                message: 'A larger than usual transaction was recorded at City Market.',
                requiresAction: false,
                dedupeKey: 'starter-large-transaction',
                resource: this.asJson({ resourceType: 'TRANSACTION', resourceUrl: '/transactions' }),
                metadata: this.asJson({
                    accountName: 'Main Checking',
                    merchantName: 'City Market',
                    transactionDate: now.toISOString(),
                    amount: { amount: 420.75, currency: 'USD' }
                }),
                actions: this.asJson([
                    {
                        id: 'view-transaction',
                        label: 'View transaction',
                        type: 'NAVIGATE',
                        variant: 'PRIMARY',
                        url: '/transactions'
                    }
                ])
            },
            {
                userId,
                icon: 'shield-alert',
                title: 'Security review recommended',
                type: NotificationType.SECURITY_ALERT,
                category: NotificationCategory.SECURITY,
                priority: NotificationPriority.CRITICAL,
                status: NotificationStatus.UNREAD,
                message: 'We noticed a new sign-in pattern. Review your security settings if this was not you.',
                requiresAction: true,
                dedupeKey: 'starter-security-alert',
                accentColor: 'var(--error)',
                resource: this.asJson({ resourceType: 'SETTINGS', resourceUrl: '/profile' }),
                metadata: this.asJson({ extraLabel: 'Risk', extraValue: 'High' }),
                actions: this.asJson([
                    { id: 'review-security', label: 'Review security', type: 'NAVIGATE', variant: 'DANGER', url: '/profile' }
                ])
            },
            {
                userId,
                icon: 'trophy',
                title: 'Emergency fund milestone reached',
                type: NotificationType.GOAL_MILESTONE,
                category: NotificationCategory.GOAL,
                priority: NotificationPriority.LOW,
                status: NotificationStatus.READ,
                readAt: now,
                message: 'Your emergency fund is now 50% funded. Small wins, big momentum.',
                requiresAction: false,
                dedupeKey: 'starter-goal-milestone',
                resource: this.asJson({ resourceType: 'GOAL', resourceUrl: '/goals' }),
                metadata: this.asJson({ goalName: 'Emergency Fund', percentageUsed: 50 }),
                actions: this.asJson([
                    { id: 'view-goal', label: 'View goal', type: 'NAVIGATE', variant: 'PRIMARY', url: '/goals' }
                ])
            }
        ];

        await this.notificationsRepository.createManyNotifications(starterNotifications);
    }

    private asJson(value: unknown): Prisma.InputJsonValue {
        return value as Prisma.InputJsonValue;
    }
}
