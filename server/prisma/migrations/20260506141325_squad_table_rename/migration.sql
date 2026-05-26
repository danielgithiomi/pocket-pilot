/*
  Warnings:

  - You are about to drop the `Split Squads` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SplitCategoryTag" AS ENUM ('FOOD', 'DESERT', 'DRINKS', 'SHOPPING', 'UTILITIES', 'TRANSPORT', 'ENTERTAINMENT');

-- DropTable
DROP TABLE "Split Squads";

-- DropEnum
DROP TYPE "SplitCategoryCard";

-- CreateTable
CREATE TABLE "Splitwise Squads" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "squadName" TEXT NOT NULL,
    "squadImageKey" TEXT,
    "squadMembers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Splitwise Squads_pkey" PRIMARY KEY ("id")
);
