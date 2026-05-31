/*
  Warnings:

  - You are about to drop the column `splitwiseEventId` on the `Bill Payers` table. All the data in the column will be lost.
  - You are about to drop the `Splitwise Events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Splitwise Squads` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `splitrEventId` to the `Bill Payers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bill Payers" DROP CONSTRAINT "Bill Payers_splitwiseEventId_fkey";

-- DropForeignKey
ALTER TABLE "Splittables" DROP CONSTRAINT "Splittables_splitEventId_fkey";

-- AlterTable
ALTER TABLE "Bill Payers" DROP COLUMN "splitwiseEventId",
ADD COLUMN     "splitrEventId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Splitwise Events";

-- DropTable
DROP TABLE "Splitwise Squads";

-- CreateTable
CREATE TABLE "Splitr Squads" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "squadName" TEXT NOT NULL,
    "squadImageKey" TEXT,
    "squadMembers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Splitr Squads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Splitr Events" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "squadName" TEXT NOT NULL,
    "eventMembers" TEXT[],
    "verificationTotal" DOUBLE PRECISION NOT NULL,
    "billingCurrency" TEXT NOT NULL,
    "billPaymentStrategy" "PaymentStrategy" NOT NULL,
    "isSettled" BOOLEAN NOT NULL DEFAULT false,
    "settledAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Splitr Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill Payers" ADD CONSTRAINT "Bill Payers_splitrEventId_fkey" FOREIGN KEY ("splitrEventId") REFERENCES "Splitr Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Splittables" ADD CONSTRAINT "Splittables_splitEventId_fkey" FOREIGN KEY ("splitEventId") REFERENCES "Splitr Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
