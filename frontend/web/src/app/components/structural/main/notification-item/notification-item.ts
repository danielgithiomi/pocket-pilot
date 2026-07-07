import { Pinger } from '@atoms/pinger';
import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PPNotification as Notification } from '@global/types';

@Component({
    imports: [NgClass, Pinger],
    selector: 'notification-item',
    styleUrl: './notification-item.css',
    templateUrl: './notification-item.html'
})
export class NotificationItem {
    // INPUTS
    readonly notificationItem = input.required<Notification>();

    // COMPUTED
    protected readonly notificationId = computed<string>(() => `notification-${this.notificationItem().id}`);
}
