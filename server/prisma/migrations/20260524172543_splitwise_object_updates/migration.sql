/*
  Warnings:

  - You are about to drop the column `categoryTag` on the `Splittables` table. All the data in the column will be lost.
  - You are about to drop the column `consumers` on the `Splittables` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Splittables` table. All the data in the column will be lost.
  - You are about to drop the column `paidBy` on the `Splittables` table. All the data in the column will be lost.
  - You are about to drop the column `paidFor` on the `Splittables` table. All the data in the column will be lost.
  - Added the required column `splitStrategy` to the `Splittables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billPaymentStrategy` to the `Splitwise Events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SplitStrategy" AS ENUM ('SOLE', 'EQUAL', 'QUANTITY');

-- CreateEnum
CREATE TYPE "PaymentStrategy" AS ENUM ('ONE', 'EQUAL', 'CUSTOM');

-- AlterTable
ALTER TABLE "Splittables" DROP COLUMN "categoryTag",
DROP COLUMN "consumers",
DROP COLUMN "creatorId",
DROP COLUMN "paidBy",
DROP COLUMN "paidFor",
ADD COLUMN     "splitStrategy" "SplitStrategy" NOT NULL;

-- AlterTable
ALTER TABLE "Splitwise Events" ADD COLUMN     "billPaymentStrategy" "PaymentStrategy" NOT NULL;
