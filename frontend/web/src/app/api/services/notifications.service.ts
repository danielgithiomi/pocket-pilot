import { Injectable, signal } from '@angular/core';
import { PPNotification as Notification } from '@global/types';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private readonly TEST_NOTIFICATIONS: Notification[] = [
        {
            id: '1',
            status: 'UNREAD',
            resourceLink: '/profile',
            title: 'New user registered',
            details: 'You have 1 new user registered'
        },
        {
            id: '2',
            status: 'UNREAD',
            title: 'Server Error',
            resourceLink: '/bills',
            details: 'Server error occurred'
        },
        {
            id: '3',
            status: 'READ',
            resourceLink: '/accounts',
            title: 'Suspicious activity',
            details: 'Some suspicious activity has been detected'
        },
        {
            id: '4',
            status: 'READ',
            resourceLink: '/accounts',
            title: 'Additional activity',
            details: 'Some suspicious activity has been detected werwerwwerwe'
        }
    ];

    private readonly notifications = signal<Notification[]>(this.TEST_NOTIFICATIONS);

    // ACCESSORS
    readonly notificationsSignal = this.notifications.asReadonly();
}
