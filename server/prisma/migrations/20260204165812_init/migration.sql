-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "holder" TEXT NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT 'CURRENT',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_holder_key" ON "Account"("holder");
