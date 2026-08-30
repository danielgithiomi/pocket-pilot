export type NotificationStatus = "UNREAD" | "READ" | "ARCHIVED";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type NotificationCategory =
    | "BILL"
    | "BUDGET"
    | "TRANSACTION"
    | "ACCOUNT"
    | "GOAL"
    | "SECURITY"
    | "SYSTEM";

export type NotificationType =
    | "BILL_DUE_SOON"
    | "BILL_OVERDUE"
    | "BILL_PAID"
    | "BUDGET_WARNING"
    | "BUDGET_EXCEEDED"
    | "LARGE_TRANSACTION"
    | "UNUSUAL_SPENDING"
    | "ACCOUNT_BALANCE_LOW"
    | "BANK_SYNC_FAILED"
    | "GOAL_MILESTONE"
    | "SECURITY_ALERT"
    | "SYSTEM_UPDATE";

export type NotificationActionType = "NAVIGATE" | "API_CALL" | "EXTERNAL_LINK";

export type NotificationActionVariant =
    | "PRIMARY"
    | "SECONDARY"
    | "DANGER"
    | "GHOST";

export type NotificationResourceType =
    | "BILL"
    | "BUDGET"
    | "TRANSACTION"
    | "ACCOUNT"
    | "GOAL"
    | "SETTINGS"
    | "SYSTEM";

export type NotificationFilter =
    | "all"
    | "unread"
    | "action_required"
    | Lowercase<NotificationCategory>;

export interface NotificationAction {
  id: string;
  label: string;
  type: NotificationActionType;
  variant: NotificationActionVariant;
  url?: string;
  apiEndpoint?: string;
  confirmationRequired?: boolean;
}

export interface NotificationResource {
  resourceType: NotificationResourceType;
  resourceId?: string;
  resourceUrl?: string;
}

export interface NotificationMoney {
  amount: number;
  currency: string;
}

export interface NotificationMetadata {
  amount?: NotificationMoney;
  billName?: string;
  budgetName?: string;
  accountName?: string;
  merchantName?: string;
  goalName?: string;
  dueDate?: string;
  paidDate?: string;
  percentageUsed?: number;
  previousAmount?: NotificationMoney;
  currentAmount?: NotificationMoney;
  daysRemaining?: number;
  transactionDate?: string;
  extraLabel?: string;
  extraValue?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  shortMessage?: string;
  icon: string;
  accentColor?: string;
  resource?: NotificationResource;
  metadata?: NotificationMetadata;
  actions?: NotificationAction[];
  requiresAction: boolean;
  createdAt: string;
  updatedAt?: string;
  readAt?: string | null;
  archivedAt?: string | null;
  expiresAt?: string | null;
  dedupeKey?: string | null;
}

export interface NotificationSummary {
  totalCount: number;
  unreadCount: number;
  actionRequiredCount: number;
  criticalCount: number;
  archivedCount: number;
  hasUnreadNotifications: boolean;
}

export interface NotificationActionResult {
  message: string;
  details: string;
  redirectUrl?: string;
}

export interface NotificationEventPayload {
  eventType:
      | "CONNECTED"
      | "NOTIFICATION_CREATED"
      | "NOTIFICATION_UPDATED"
      | "NOTIFICATIONS_REFRESHED";
  notification?: AppNotification;
  notifications?: AppNotification[];
  summary?: NotificationSummary;
}

// Backwards-compatible aliases for the existing header/dropdown implementation.
export type TNotificationStatus = NotificationStatus;
export type TNotificationFilter = "all" | "read" | "unread";
export type PPNotification = AppNotification;
export type PPNotificationSummary = NotificationSummary & {
  notifications: AppNotification[];
};
