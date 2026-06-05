-- CreateEnum
CREATE TYPE "FeatureStatus" AS ENUM ('NEW', 'SHIPPED', 'PLANNED', 'REJECTED', 'IN_PROGRESS', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "FeatureCategory" AS ENUM ('OTHER', 'UI_UX', 'SPLITR', 'PROFILE', 'ACCOUNTS', 'ANALYSIS', 'SECURITY', 'BUDGETING', 'BUG_REPORT', 'PERFORMANCE', 'NEW_FEATURE', 'TRANSACTIONS', 'BILLS_AND_GOALS');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- CreateTable
CREATE TABLE "Features" (
    "id" TEXT NOT NULL,
    "featureTitle" TEXT NOT NULL,
    "featureContent" TEXT NOT NULL,
    "featureScore" INTEGER NOT NULL DEFAULT 0,
    "upvoteCount" INTEGER NOT NULL DEFAULT 0,
    "downvoteCount" INTEGER NOT NULL DEFAULT 0,
    "featureStatus" "FeatureStatus" NOT NULL,
    "featureCategory" "FeatureCategory" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature Votes" (
    "id" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voterId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "Feature Votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature Comments" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "Feature Comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Features_id_userId_key" ON "Features"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature Votes_featureId_voterId_key" ON "Feature Votes"("featureId", "voterId");

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature Votes" ADD CONSTRAINT "Feature Votes_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature Votes" ADD CONSTRAINT "Feature Votes_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature Comments" ADD CONSTRAINT "Feature Comments_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
