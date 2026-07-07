import { Pinger } from '@atoms/pinger';
import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PPNotification as Notification } from '@global/types';
import { LucideAngularModule, PartyPopper } from 'lucide-angular';

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

    // COMPUTED
    protected readonly notificationId = computed<string>(() => `notification-${this.notificationItem().id}`);
}
