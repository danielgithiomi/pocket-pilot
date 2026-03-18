/*
  Warnings:

  - A unique constraint covering the columns `[name,holderId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_name_holderId_key" ON "Account"("name", "holderId");
