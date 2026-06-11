-- Store exchange-rate snapshot timestamps with explicit UTC timezone semantics.
-- Existing naive TIMESTAMP values are interpreted as UTC wall-clock instants.
ALTER TABLE "Exchange Rate Snapshots"
    ALTER COLUMN "nextUpdateTime" TYPE TIMESTAMPTZ(3) USING "nextUpdateTime" AT TIME ZONE 'UTC',
    ALTER COLUMN "lastUpdatedTime" TYPE TIMESTAMPTZ(3) USING "lastUpdatedTime" AT TIME ZONE 'UTC',
    ALTER COLUMN "fetchedAt" TYPE TIMESTAMPTZ(3) USING "fetchedAt" AT TIME ZONE 'UTC';
