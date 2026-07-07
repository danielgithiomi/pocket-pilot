export type TNotificationStatus = "READ" | "UNREAD";

export type TNotificationFilter = "all" | "read" | "unread";

export interface PPNotification {
	id: string;
	title: string;
	createdAt: Date;
	details: string;
	resourceLink: string;
	emphasisSplits?: string[];
	status: TNotificationStatus;
}

export interface PPNotificationSummary {
	totalCount: number;
	unreadCount: number;
	notifications: PPNotification[];
	hasUnreadNotifications: boolean;
}
