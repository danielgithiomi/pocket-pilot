-- CreateTable
CREATE TABLE "Splittables" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryTag" "SplitCategoryTag" NOT NULL,
    "paidBy" TEXT NOT NULL,
    "paidFor" TEXT[],
    "settled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "splitEventId" TEXT NOT NULL,

    CONSTRAINT "Splittables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Splitwise Events" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventMembers" TEXT[],
    "billingCurrency" TEXT NOT NULL,
    "settledAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Splitwise Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Splittables" ADD CONSTRAINT "Splittables_splitEventId_fkey" FOREIGN KEY ("splitEventId") REFERENCES "Splitwise Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
