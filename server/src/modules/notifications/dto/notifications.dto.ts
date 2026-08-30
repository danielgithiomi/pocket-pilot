import { NotificationCategory, NotificationPriority, NotificationStatus, NotificationType } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationMoneyDto {
    @ApiProperty({ example: 125.5 })
    amount!: number;

    @ApiProperty({ example: 'USD' })
    currency!: string;
}

export class NotificationMetadataDto {
    @ApiPropertyOptional({ type: NotificationMoneyDto })
    amount?: NotificationMoneyDto;

    @ApiPropertyOptional({ example: 'Electricity' })
    billName?: string;

    @ApiPropertyOptional({ example: 'Household' })
    budgetName?: string;

    @ApiPropertyOptional({ example: 'Main Checking' })
    accountName?: string;

    @ApiPropertyOptional({ example: 'Grocery Store' })
    merchantName?: string;

    @ApiPropertyOptional({ example: 'Emergency Fund' })
    goalName?: string;

    @ApiPropertyOptional({ example: '2026-07-12T00:00:00.000Z' })
    dueDate?: string;

    @ApiPropertyOptional({ example: 86 })
    percentageUsed?: number;

    @ApiPropertyOptional({ example: 3 })
    daysRemaining?: number;

    @ApiPropertyOptional({ example: 'Threshold' })
    extraLabel?: string;

    @ApiPropertyOptional({ example: '$100' })
    extraValue?: string;
}

export class NotificationActionDto {
    @ApiProperty({ example: 'view-bill' })
    id!: string;

    @ApiProperty({ example: 'View bill' })
    label!: string;

    @ApiProperty({ enum: ['NAVIGATE', 'API_CALL', 'EXTERNAL_LINK'] })
    type!: 'NAVIGATE' | 'API_CALL' | 'EXTERNAL_LINK';

    @ApiProperty({ enum: ['PRIMARY', 'SECONDARY', 'DANGER', 'GHOST'] })
    variant!: 'PRIMARY' | 'SECONDARY' | 'DANGER' | 'GHOST';

    @ApiPropertyOptional({ example: '/goals' })
    url?: string;

    @ApiPropertyOptional({ example: 'bills/:id/pay' })
    apiEndpoint?: string;

    @ApiPropertyOptional({ example: true })
    confirmationRequired?: boolean;
}

export class NotificationResourceDto {
    @ApiProperty({ enum: ['BILL', 'BUDGET', 'TRANSACTION', 'ACCOUNT', 'GOAL', 'SETTINGS', 'SYSTEM'] })
    resourceType!: 'BILL' | 'BUDGET' | 'TRANSACTION' | 'ACCOUNT' | 'GOAL' | 'SETTINGS' | 'SYSTEM';

    @ApiPropertyOptional({ example: randomUUID() })
    resourceId?: string;

    @ApiPropertyOptional({ example: '/accounts' })
    resourceUrl?: string;
}

export class AppNotificationDto {
    @ApiProperty({ example: randomUUID() })
    id!: string;

    @ApiProperty({ example: randomUUID() })
    userId!: string;

    @ApiProperty({ enum: NotificationType })
    type!: NotificationType;

    @ApiProperty({ enum: NotificationCategory })
    category!: NotificationCategory;

    @ApiProperty({ enum: NotificationPriority })
    priority!: NotificationPriority;

    @ApiProperty({ enum: NotificationStatus })
    status!: NotificationStatus;

    @ApiProperty({ example: 'Bill due soon' })
    title!: string;

    @ApiProperty({ example: 'Your electricity bill is due in 3 days.' })
    message!: string;

    @ApiPropertyOptional({ example: 'Electricity due soon' })
    shortMessage?: string | null;

    @ApiProperty({ example: 'receipt-cent' })
    icon!: string;

    @ApiPropertyOptional({ example: 'var(--warning)' })
    accentColor?: string | null;

    @ApiPropertyOptional({ type: NotificationResourceDto })
    resource?: NotificationResourceDto | null;

    @ApiPropertyOptional({ type: NotificationMetadataDto })
    metadata?: NotificationMetadataDto | null;

    @ApiPropertyOptional({ type: NotificationActionDto, isArray: true })
    actions?: NotificationActionDto[] | null;

    @ApiProperty({ example: true })
    requiresAction!: boolean;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiPropertyOptional()
    readAt?: Date | null;

    @ApiPropertyOptional()
    archivedAt?: Date | null;

    @ApiPropertyOptional()
    expiresAt?: Date | null;

    @ApiPropertyOptional({ example: 'bill-electricity-due-soon' })
    dedupeKey?: string | null;
}

export class NotificationSummaryDto {
    @ApiProperty({ example: 12 })
    totalCount!: number;

    @ApiProperty({ example: 4 })
    unreadCount!: number;

    @ApiProperty({ example: 3 })
    actionRequiredCount!: number;

    @ApiProperty({ example: 2 })
    criticalCount!: number;

    @ApiProperty({ example: 1 })
    archivedCount!: number;

    @ApiProperty({ example: true })
    hasUnreadNotifications!: boolean;
}

export class NotificationActionResultDto {
    @ApiProperty({ example: 'Action queued' })
    message!: string;

    @ApiProperty({ example: 'The notification action was accepted.' })
    details!: string;

    @ApiPropertyOptional({ example: '/bills' })
    redirectUrl?: string;
}
