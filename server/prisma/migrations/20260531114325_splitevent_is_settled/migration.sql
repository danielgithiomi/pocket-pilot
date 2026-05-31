/*
  Warnings:

  - You are about to drop the column `settled` on the `Splittables` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User Transaction Categories" DROP CONSTRAINT "User Transaction Categories_userId_fkey";

-- AlterTable
ALTER TABLE "Splittables" DROP COLUMN "settled";

-- AlterTable
ALTER TABLE "Splitwise Events" ADD COLUMN     "isSettled" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "User Transaction Categories" ADD CONSTRAINT "User Transaction Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
