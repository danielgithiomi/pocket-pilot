/*
  Warnings:

  - Added the required column `authorId` to the `Feature Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feature Comments"
    ADD COLUMN "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Feature Comments"
    ADD CONSTRAINT "Feature Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
