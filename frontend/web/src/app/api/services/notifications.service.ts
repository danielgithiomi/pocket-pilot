import { Injectable, signal } from '@angular/core';
import { PPNotification as Notification } from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private readonly TEST_NOTIFICATIONS: Notification[] = [
        {
            id: '1',
            resourceLink: '/profile',
            title: 'New user registered',
            status: 'UNREAD',
            details: 'You have 1 new user registered'
        },
        {
            id: '2',
            resourceLink: '/bills',
            title: 'Server Error',
            details: 'Server error occurred',
            status: 'UNREAD'
        },
        {
            id: '3',
            resourceLink: '/accounts',
            title: 'Suspicious activity',
            status: 'READ',
            details: 'Some suspicious activity has been detected'
        }
    ];

    private readonly notifications = signal<Notification[]>(this.TEST_NOTIFICATIONS);

    // ACCESSORS
    readonly notificationsSignal = this.notifications.asReadonly();
}
