import { Component, computed, input } from '@angular/core';

@Component({
    imports: [],
    selector: 'notification-item',
    templateUrl: './notification-item.html'
})
export class NotificationItem {
    // INPUTS
    readonly id = input.required<string>();

    // COMPUTED
    protected readonly notificationId = computed<string>(() => `notification-${this.id()}`);
}
