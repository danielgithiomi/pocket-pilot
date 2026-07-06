import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private readonly NOTIFICATIONS: Notification[] = [
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

    private readonly notifications = signal<Notification[]>(this.NOTIFICATIONS);

    // getNotifications = () => this.notifications.asReadonly();

    getUserWrappedNotifications = (): UserWrappedNotifications => {
        const totalCount = this.notifications().length;
        const notifications = this.notifications();
        const unreadCount = this.notifications().filter(n => n.status === 'unread').length;

        return {
            totalCount,
            unreadCount,
            notifications,
            hasUnreadNotifications: unreadCount > 0
        };
    };
}

// INTERNAL TYPES
interface Notification {
    id: number;
    link: string;
    title: string;
    details: string;
    status: 'unread' | 'read';
}

interface UserWrappedNotifications {
    totalCount: number;
    unreadCount: number;
    notifications: Notification[];
    hasUnreadNotifications: boolean;
}
