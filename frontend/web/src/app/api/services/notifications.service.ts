import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private readonly NOTIFICATIONS = [
        {
            id: 1,
            link: '/profile',
            status: 'unread',
            title: 'New user registered',
            details: 'You have 1 new user registered'
        },
        {
            id: 2,
            link: '/bills',
            status: 'unread',
            title: 'Server Error',
            details: 'Server error occurred'
        },
        {
            id: 3,
            status: 'read',
            link: '/accounts',
            title: 'Suspicious activity',
            details: 'Some suspicious activity has been detected'
        }
    ];

    private readonly notifications = signal(this.NOTIFICATIONS);

    getNotifications = () => this.notifications.asReadonly();
}
