/*
  Warnings:

  - You are about to drop the column `splitEventId` on the `Splittables` table. All the data in the column will be lost.
  - Added the required column `splitrEventId` to the `Splittables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Splittables" DROP CONSTRAINT "Splittables_splitEventId_fkey";

-- AlterTable
ALTER TABLE "Splittables" DROP COLUMN "splitEventId",
ADD COLUMN     "splitrEventId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Financial Goals" ADD CONSTRAINT "Financial Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User Bills" ADD CONSTRAINT "User Bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Splittables" ADD CONSTRAINT "Splittables_splitrEventId_fkey" FOREIGN KEY ("splitrEventId") REFERENCES "Splitr Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Splitr Events" ADD CONSTRAINT "Splitr Events_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
