/*
  Warnings:

  - Added the required column `currency` to the `Financial Goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Financial Goals" ADD COLUMN     "currency" TEXT NOT NULL;
