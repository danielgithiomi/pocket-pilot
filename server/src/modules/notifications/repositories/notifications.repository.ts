import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { Notification, NotificationStatus, Prisma } from '@prisma/client';

@Injectable()
export class NotificationsRepository {
    constructor(private readonly db: DatabaseService) {}

    getUserNotifications(userId: string): Promise<Notification[]> {
        return this.db.notification.findMany({
            where: {
                userId,
                status: { not: NotificationStatus.ARCHIVED }
            },
            orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
        });
    }

    getAllUserNotifications(userId: string): Promise<Notification[]> {
        return this.db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    countUserNotifications(userId: string, status?: NotificationStatus): Promise<number> {
        return this.db.notification.count({
            where: {
                userId,
                ...(status ? { status } : {})
            }
        });
    }

    createManyNotifications(notifications: Prisma.NotificationCreateManyInput[]) {
        return this.db.notification.createMany({
            data: notifications,
            skipDuplicates: true
        });
    }

    findUserNotificationById(userId: string, notificationId: string): Promise<Notification | null> {
        return this.db.notification.findFirst({
            where: { id: notificationId, userId }
        });
    }

    markAsRead(userId: string, notificationId: string): Promise<Notification> {
        return this.db.notification.update({
            where: { id: notificationId, userId },
            data: {
                status: NotificationStatus.READ,
                readAt: new Date()
            }
        });
    }

    archive(userId: string, notificationId: string): Promise<Notification> {
        return this.db.notification.update({
            where: { id: notificationId, userId },
            data: {
                status: NotificationStatus.ARCHIVED,
                archivedAt: new Date()
            }
        });
    }

    markAllAsRead(userId: string) {
        return this.db.notification.updateMany({
            where: {
                userId,
                status: NotificationStatus.UNREAD
            },
            data: {
                status: NotificationStatus.READ,
                readAt: new Date()
            }
        });
    }
}
