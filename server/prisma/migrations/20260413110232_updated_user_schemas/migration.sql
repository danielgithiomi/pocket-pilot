/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `User Preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User Bills" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User Preferences" DROP COLUMN "phoneNumber",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "defaultCurrency" DROP DEFAULT,
ALTER COLUMN "preferredLanguage" DROP DEFAULT,
ALTER COLUMN "monthlySpendingLimit" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "phoneNumber" TEXT;
