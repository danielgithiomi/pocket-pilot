import { Button } from '@atoms/button';
import { Component, signal } from '@angular/core';
import { CheckCheck, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.html',
    imports: [LucideAngularModule, Button]
})
export class Notifications {
    // ICONS
    protected readonly iconSize: number = 18;
    protected readonly MarkAllAsReadIcon = CheckCheck;

    // SIGNAL STATES
    protected readonly isLoadingNotifications = signal<boolean>(false);

    // METHODS
    protected handleMarkAllAsRead() {
        this.isLoadingNotifications.set(true);
    }
}
