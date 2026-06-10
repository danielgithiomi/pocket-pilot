-- CreateTable
CREATE TABLE "Exchange Rates" (
    "id" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "nextUpdateTime" TIMESTAMP(3) NOT NULL,
    "lastUpdatedTime" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exchange Rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "rate" DECIMAL(18,8) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exchange Rates_baseCurrency_lastUpdatedTime_key" ON "Exchange Rates"("baseCurrency", "lastUpdatedTime");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_snapshotId_currency_key" ON "ExchangeRate"("snapshotId", "currency");

-- AddForeignKey
ALTER TABLE "ExchangeRate" ADD CONSTRAINT "ExchangeRate_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Exchange Rates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
