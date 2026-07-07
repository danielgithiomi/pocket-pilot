import { Component, computed, input } from '@angular/core';
import { Notification } from '@api/notifications.service';

@Component({
    imports: [],
    selector: 'notification-item',
    templateUrl: './notification-item.html'
})
export class NotificationItem {
    // INPUTS
    readonly notificationItem = input.required<Notification>();

    // COMPUTED
    protected readonly notificationId = computed<string>(() => `notification-${this.notificationItem().id}`);
}
