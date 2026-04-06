-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'PAUSED', 'FAILED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "GoalCategory" AS ENUM ('OTHER', 'TRAVEL', 'SAVINGS', 'VACATION', 'EDUCATION', 'RETIREMENT', 'INVESTMENTS', 'HOME_PURCHASE', 'DEBT_REDUCTION', 'EMERGENCY_FUND');

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "status" "GoalStatus" NOT NULL,
    "category" "GoalCategory" NOT NULL,
    "monthlyContribution" DOUBLE PRECISION NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);
