-- CreateEnum
CREATE TYPE "SplitCategoryCard" AS ENUM ('FOOD', 'DESERT', 'DRINKS', 'SHOPPPING', 'UTILITIES', 'TRANSPORT', 'ENTERTAINMENT');

-- CreateTable
CREATE TABLE "Split Squads" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "squadName" TEXT NOT NULL,
    "squadImageKey" TEXT,
    "squadMembers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Split Squads_pkey" PRIMARY KEY ("id")
);
