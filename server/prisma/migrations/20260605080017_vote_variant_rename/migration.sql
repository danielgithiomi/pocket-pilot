/*
  Warnings:

  - You are about to drop the column `voteType` on the `Feature Votes` table. All the data in the column will be lost.
  - Added the required column `voteVariant` to the `Feature Votes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteVariant" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "Feature Votes" DROP COLUMN "voteType",
ADD COLUMN     "voteVariant" "VoteVariant" NOT NULL;

-- DropEnum
DROP TYPE "VoteType";
