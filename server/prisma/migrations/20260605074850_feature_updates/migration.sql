/*
  Warnings:

  - You are about to drop the column `userId` on the `Features` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,authorId]` on the table `Features` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Features` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Features" DROP CONSTRAINT "Features_userId_fkey";

-- DropIndex
DROP INDEX "Features_id_userId_key";

-- AlterTable
ALTER TABLE "Features" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ALTER COLUMN "featureStatus" SET DEFAULT 'NEW';

-- CreateIndex
CREATE UNIQUE INDEX "Features_id_authorId_key" ON "Features"("id", "authorId");

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
