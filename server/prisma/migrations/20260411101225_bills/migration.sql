-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('YEARLY', 'MONTHLY', 'ONE_TIME');

-- CreateTable
CREATE TABLE "Bills" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BillType" NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bills_pkey" PRIMARY KEY ("id")
);
