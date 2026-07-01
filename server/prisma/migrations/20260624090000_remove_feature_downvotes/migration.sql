-- Existing downvote records no longer represent a supported product action.
DELETE
FROM "Feature Votes"
WHERE "voteVariant" = 'DOWNVOTE';

ALTER TABLE "Feature Votes"
    DROP COLUMN "voteVariant";

ALTER TABLE "Features"
    DROP COLUMN "downvoteCount";

UPDATE "Features"
SET "upvoteCount"  = vote_counts."count",
    "featureScore" = vote_counts."count"
FROM (SELECT "featureId", COUNT(*)::INTEGER AS "count"
      FROM "Feature Votes"
      GROUP BY "featureId") AS vote_counts
WHERE "Features"."id" = vote_counts."featureId";

UPDATE "Features"
SET "upvoteCount"  = 0,
    "featureScore" = 0
WHERE NOT EXISTS (SELECT 1
                  FROM "Feature Votes"
                  WHERE "Feature Votes"."featureId" = "Features"."id");

DROP TYPE "VoteVariant";
