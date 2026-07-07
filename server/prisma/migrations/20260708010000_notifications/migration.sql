-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('BILL', 'BUDGET', 'TRANSACTION', 'ACCOUNT', 'GOAL', 'SECURITY', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM (
    'BILL_DUE_SOON',
    'BILL_OVERDUE',
    'BILL_PAID',
    'BUDGET_WARNING',
    'BUDGET_EXCEEDED',
    'LARGE_TRANSACTION',
    'UNUSUAL_SPENDING',
    'ACCOUNT_BALANCE_LOW',
    'BANK_SYNC_FAILED',
    'GOAL_MILESTONE',
    'SECURITY_ALERT',
    'SYSTEM_UPDATE'
    );

-- CreateTable
CREATE TABLE "Notifications"
(
    "id"             TEXT                   NOT NULL,
    "type"           "NotificationType"     NOT NULL,
    "category"       "NotificationCategory" NOT NULL,
    "priority"       "NotificationPriority" NOT NULL DEFAULT 'LOW',
    "status"         "NotificationStatus"   NOT NULL DEFAULT 'UNREAD',
    "title"          TEXT                   NOT NULL,
    "message"        TEXT                   NOT NULL,
    "shortMessage"   TEXT,
    "icon"           TEXT                   NOT NULL,
    "accentColor"    TEXT,
    "resource"       JSONB,
    "metadata"       JSONB,
    "actions"        JSONB,
    "requiresAction" BOOLEAN                NOT NULL DEFAULT false,
    "createdAt"      TIMESTAMP(3)           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)           NOT NULL,
    "readAt"         TIMESTAMP(3),
    "archivedAt"     TIMESTAMP(3),
    "expiresAt"      TIMESTAMP(3),
    "dedupeKey"      TEXT,
    "userId"         TEXT                   NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_userId_dedupeKey_key" ON "Notifications" ("userId", "dedupeKey");

-- CreateIndex
CREATE INDEX "Notifications_userId_status_idx" ON "Notifications" ("userId", "status");

-- CreateIndex
CREATE INDEX "Notifications_userId_category_idx" ON "Notifications" ("userId", "category");

-- CreateIndex
CREATE INDEX "Notifications_userId_priority_idx" ON "Notifications" ("userId", "priority");

-- AddForeignKey
ALTER TABLE "Notifications"
    ADD CONSTRAINT "Notifications_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
