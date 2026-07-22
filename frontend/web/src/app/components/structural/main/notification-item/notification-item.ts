import { Pinger } from '@atoms/pinger';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { formatToReadable } from '@libs/utils';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { AppNotification, NotificationAction, NotificationMetadata, NotificationPriority } from '@global/types';
import {
    Archive,
    Bell,
    CreditCard,
    EyeIcon,
    Gauge,
    LucideAngularModule,
    LucideIconData,
    ReceiptCent,
    ShieldAlert,
    TriangleAlert,
    Trophy,
    Wallet
} from 'lucide-angular';

const UNREAD_HIGHLIGHT_DURATION_MS = 3000;

type NotificationItemDisplayMode = 'compact' | 'full';

const ICON_MAP: Record<string, LucideIconData> = {
    bell: Bell,
    gauge: Gauge,
    trophy: Trophy,
    wallet: Wallet,
    'credit-card': CreditCard,
    'receipt-cent': ReceiptCent,
    'shield-alert': ShieldAlert,
    'triangle-alert': TriangleAlert
};

@Component({
    selector: 'notification-item',
    styleUrl: './notification-item.css',
    templateUrl: './notification-item.html',
    imports: [LucideAngularModule, NgClass, Button, Pinger]
})
export class NotificationItem {
    // ICONS
    protected readonly IconSize = 13;
    protected readonly ArchiveIcon = Archive;
    protected readonly MarkReadIcon = EyeIcon;

    // INPUTS
    readonly notificationItem = input.required<AppNotification>();
    readonly displayMode = input<NotificationItemDisplayMode>('compact');

    // OUTPUTS
    readonly archive = output<string>();
    readonly markAsRead = output<string>();
    readonly actionSelected = output<{ notificationId: string; action: NotificationAction }>();

    // STATES
    protected readonly showUnreadHighlight = signal<boolean>(false);

    // COMPUTED
    protected readonly isUnread = computed<boolean>(() => this.notificationItem().status === 'UNREAD');
    protected readonly isCompact = computed<boolean>(() => this.displayMode() === 'compact');
    protected readonly icon = computed<LucideIconData>(() => ICON_MAP[this.notificationItem().icon] ?? Bell);
    protected readonly notificationId = computed<string>(() => `notification-${this.notificationItem().id}`);
    protected readonly priorityLabel = computed<string>(() => formatToReadable(this.notificationItem().priority));
    protected readonly categoryLabel = computed<string>(() => formatToReadable(this.notificationItem().category));
    protected readonly previewMessage = computed<string>(
        () => this.notificationItem().shortMessage ?? this.notificationItem().message
    );
    protected readonly createdAtLabel = computed<string>(() =>
        new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(
            new Date(this.notificationItem().createdAt)
        )
    );
    protected readonly compactCreatedAtLabel = computed<string>(() =>
        new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
            new Date(this.notificationItem().createdAt)
        )
    );

    protected readonly formattedAmount = computed<string | null>(() => {
        const amount = this.notificationItem().metadata?.amount;
        if (!amount) return null;

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: amount.currency
        }).format(amount.amount);
    });

    protected readonly metadataChips = computed<Array<{ label: string; value: string }>>(() => {
        const metadata = this.notificationItem().metadata;
        if (!metadata) return [];

        return this.buildMetadataChips(metadata);
    });

    protected readonly priorityClass = computed<string>(() =>
        this.resolvePriorityClass(this.notificationItem().priority)
    );

    constructor() {
        effect(onCleanup => {
            if (!this.isUnread()) {
                this.showUnreadHighlight.set(false);
                return;
            }

            this.showUnreadHighlight.set(true);
            const timeoutId = setTimeout(() => this.showUnreadHighlight.set(false), UNREAD_HIGHLIGHT_DURATION_MS);
            onCleanup(() => clearTimeout(timeoutId));
        });
    }

    protected handleAction(action: NotificationAction): void {
        this.actionSelected.emit({ notificationId: this.notificationItem().id, action });
    }

    private buildMetadataChips(metadata: NotificationMetadata): Array<{ label: string; value: string }> {
        const chips: Array<{ label: string; value: string }> = [];

        if (this.formattedAmount()) chips.push({ label: 'Amount', value: this.formattedAmount()! });
        if (metadata.daysRemaining != null) chips.push({ label: 'Days', value: metadata.daysRemaining.toString() });
        if (metadata.percentageUsed != null) chips.push({ label: 'Used', value: `${metadata.percentageUsed}%` });
        if (metadata.accountName) chips.push({ label: 'Account', value: metadata.accountName });
        if (metadata.merchantName) chips.push({ label: 'Merchant', value: metadata.merchantName });
        if (metadata.extraLabel && metadata.extraValue)
            chips.push({ label: metadata.extraLabel, value: metadata.extraValue });

        return chips;
    }

    private resolvePriorityClass(priority: NotificationPriority): string {
        switch (priority) {
            case 'CRITICAL':
                return 'critical';
            case 'HIGH':
                return 'high';
            case 'MEDIUM':
                return 'medium';
            default:
                return 'low';
        }
    }
}
