-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'PAUSED', 'FAILED', 'PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "GoalCategory" AS ENUM ('LOAN', 'TRAVEL', 'SAVINGS', 'PURCHASE', 'VACATION', 'EDUCATION', 'RETIREMENT', 'INVESTMENTS', 'DEBT_PAYMENT', 'EMERGENCY_FUND', 'OTHER');

-- CreateTable
CREATE TABLE "Goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "category" "GoalCategory" NOT NULL,
    "monthlyContribution" DOUBLE PRECISION NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);
