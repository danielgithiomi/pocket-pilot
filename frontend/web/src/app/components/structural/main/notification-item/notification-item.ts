import { Pinger } from '@atoms/pinger';
import { NgClass } from '@angular/common';
import { formatRelativeDate } from '@libs/utils';
import { PPNotification as Notification } from '@global/types';
import { LucideAngularModule, PartyPopper } from 'lucide-angular';
import { Component, computed, effect, input, signal } from '@angular/core';

const UNREAD_HIGHLIGHT_DURATION_MS = 3000;

@Component({
    selector: 'notification-item',
    styleUrl: './notification-item.css',
    templateUrl: './notification-item.html',
    imports: [LucideAngularModule, NgClass, Pinger]
})
export class NotificationItem {
    // ICONS
    protected readonly iconSize = 18;
    protected readonly NotificationIcon = PartyPopper;

    // INPUTS
    readonly notificationItem = input.required<Notification>();

    // STATES
    protected readonly showUnreadHighlight = signal<boolean>(false);

    // COMPUTED
    protected readonly isUnread = computed<boolean>(() => this.notificationItem().status === 'UNREAD');
    protected readonly notificationId = computed<string>(() => `notification-${this.notificationItem().id}`);

    // METHODS
    protected getRelativeDate = (notificationDate: Date): string => formatRelativeDate(notificationDate);

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
}
