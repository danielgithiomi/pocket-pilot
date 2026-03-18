/*
  Warnings:

  - Changed the type of `category` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('HOUSEHOLD', 'GROCERIES', 'TRANSPORTATION', 'ENTERTAINMENT', 'UTILITIES', 'HEALTH', 'EDUCATION');

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "category",
ADD COLUMN     "category" "TransactionCategory" NOT NULL;

-- DropEnum
DROP TYPE "CategoryType";
