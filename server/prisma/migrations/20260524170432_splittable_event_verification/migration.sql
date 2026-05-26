/*
  Warnings:

  - Added the required column `verificationTotal` to the `Splitwise Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Splitwise Events" ADD COLUMN     "verificationTotal" DOUBLE PRECISION NOT NULL;
