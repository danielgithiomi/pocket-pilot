/*
  Warnings:

  - You are about to drop the `Features` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Feature Comments"
    DROP CONSTRAINT "Feature Comments_featureId_fkey";

-- DropForeignKey
ALTER TABLE "Feature Votes"
    DROP CONSTRAINT "Feature Votes_featureId_fkey";

-- DropForeignKey
ALTER TABLE "Features"
    DROP CONSTRAINT "Features_authorId_fkey";

-- DropTable
DROP TABLE "Features";

-- CreateTable
CREATE TABLE "Feature Requests"
(
    "id"              TEXT              NOT NULL,
    "featureTitle"    TEXT              NOT NULL,
    "featureContent"  TEXT              NOT NULL,
    "upvoteCount"     INTEGER           NOT NULL DEFAULT 0,
    "featureCategory" "FeatureCategory" NOT NULL,
    "featureStatus"   "FeatureStatus"   NOT NULL DEFAULT 'NEW',
    "updatedAt"       TIMESTAMP(3)      NOT NULL,
    "createdAt"       TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId"        TEXT              NOT NULL,

    CONSTRAINT "Feature Requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feature Requests_id_authorId_key" ON "Feature Requests" ("id", "authorId");

-- AddForeignKey
ALTER TABLE "Feature Requests"
    ADD CONSTRAINT "Feature Requests_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature Comments"
    ADD CONSTRAINT "Feature Comments_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature Requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature Votes"
    ADD CONSTRAINT "Feature Votes_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature Requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
