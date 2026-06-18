/*
  Warnings:

  - You are about to drop the column `authorId` on the `Feature Comments` table. All the data in the column will be lost.
  - You are about to drop the column `voterId` on the `Feature Votes` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Splitr Events` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[featureId,userId]` on the table `Feature Votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Feature Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Feature Votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Splitr Events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feature Comments"
    DROP CONSTRAINT "Feature Comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Feature Votes"
    DROP CONSTRAINT "Feature Votes_voterId_fkey";

-- DropForeignKey
ALTER TABLE "Splitr Events"
    DROP CONSTRAINT "Splitr Events_creatorId_fkey";

-- DropIndex
DROP INDEX "Feature Votes_featureId_voterId_key";

-- AlterTable
ALTER TABLE "Feature Comments"
    DROP COLUMN "authorId",
    ADD COLUMN "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Feature Votes"
    DROP COLUMN "voterId",
    ADD COLUMN "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Splitr Events"
    DROP COLUMN "creatorId",
    ADD COLUMN "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Feature Votes_featureId_userId_key" ON "Feature Votes" ("featureId", "userId");

-- AddForeignKey
ALTER TABLE "Splitr Events"
    ADD CONSTRAINT "Splitr Events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature Comments"
    ADD CONSTRAINT "Feature Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature Votes"
    ADD CONSTRAINT "Feature Votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
