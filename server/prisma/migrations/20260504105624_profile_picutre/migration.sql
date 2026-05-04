-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "profilePictureUrl" TEXT;

-- CreateIndex
CREATE INDEX "Transactions_sourceAccountId_idx" ON "Transactions"("sourceAccountId");

-- CreateIndex
CREATE INDEX "Transactions_targetAccountId_idx" ON "Transactions"("targetAccountId");
