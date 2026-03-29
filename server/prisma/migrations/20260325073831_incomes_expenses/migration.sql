/*
  Warnings:

  - You are about to drop the column `categories` on the `Categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "categories",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expenses" TEXT[],
ADD COLUMN     "incomes" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Categories_userId_key" ON "Categories"("userId");
