/*
  Warnings:

  - You are about to drop the column `accountId` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `sourceAccountId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_accountId_fkey";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "accountId",
ADD COLUMN     "sourceAccountId" TEXT NOT NULL,
ADD COLUMN     "targetAccountId" TEXT;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_targetAccountId_fkey" FOREIGN KEY ("targetAccountId") REFERENCES "Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
