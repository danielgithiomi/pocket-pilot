/*
  Warnings:

  - You are about to drop the column `baseCurrency` on the `Exchange Rates` table. All the data in the column will be lost.
  - You are about to drop the column `fetchedAt` on the `Exchange Rates` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdatedTime` on the `Exchange Rates` table. All the data in the column will be lost.
  - You are about to drop the column `nextUpdateTime` on the `Exchange Rates` table. All the data in the column will be lost.
  - You are about to drop the `ExchangeRate` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[snapshotId,currency]` on the table `Exchange Rates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currency` to the `Exchange Rates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `Exchange Rates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshotId` to the `Exchange Rates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExchangeRate" DROP CONSTRAINT "ExchangeRate_snapshotId_fkey";

-- DropIndex
DROP INDEX "Exchange Rates_baseCurrency_lastUpdatedTime_key";

-- AlterTable
ALTER TABLE "Exchange Rates" DROP COLUMN "baseCurrency",
DROP COLUMN "fetchedAt",
DROP COLUMN "lastUpdatedTime",
DROP COLUMN "nextUpdateTime",
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "rate" DECIMAL(18,8) NOT NULL,
ADD COLUMN     "snapshotId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ExchangeRate";

-- CreateTable
CREATE TABLE "Exchange Rate Snapshots" (
    "id" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "nextUpdateTime" TIMESTAMP(3) NOT NULL,
    "lastUpdatedTime" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exchange Rate Snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exchange Rate Snapshots_baseCurrency_lastUpdatedTime_key" ON "Exchange Rate Snapshots"("baseCurrency", "lastUpdatedTime");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange Rates_snapshotId_currency_key" ON "Exchange Rates"("snapshotId", "currency");

-- AddForeignKey
ALTER TABLE "Exchange Rates" ADD CONSTRAINT "Exchange Rates_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Exchange Rate Snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
