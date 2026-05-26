/*
  Warnings:

  - Added the required column `squadName` to the `Splitwise Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Splitwise Events" ADD COLUMN     "squadName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Bill Payers" (
    "id" TEXT NOT NULL,
    "payerName" TEXT NOT NULL,
    "payerAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "splitwiseEventId" TEXT NOT NULL,

    CONSTRAINT "Bill Payers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill Payers" ADD CONSTRAINT "Bill Payers_splitwiseEventId_fkey" FOREIGN KEY ("splitwiseEventId") REFERENCES "Splitwise Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
