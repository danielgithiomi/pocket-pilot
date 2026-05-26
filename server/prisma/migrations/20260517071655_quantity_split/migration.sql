/*
  Warnings:

  - You are about to drop the column `amount` on the `Splittables` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Splittables` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Splittables` table. All the data in the column will be lost.
  - Added the required column `name` to the `Splittables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Splittables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Splittables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Splittables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Splittables" DROP CONSTRAINT "Splittables_splitEventId_fkey";

-- AlterTable
ALTER TABLE "Splittables" DROP COLUMN "amount",
DROP COLUMN "currency",
DROP COLUMN "description",
ADD COLUMN     "consumers" TEXT[],
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Quantity Splits" (
    "id" TEXT NOT NULL,
    "consumerQuantity" INTEGER NOT NULL,
    "consumerName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "splittableId" TEXT NOT NULL,

    CONSTRAINT "Quantity Splits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quantity Splits" ADD CONSTRAINT "Quantity Splits_splittableId_fkey" FOREIGN KEY ("splittableId") REFERENCES "Splittables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Splittables" ADD CONSTRAINT "Splittables_splitEventId_fkey" FOREIGN KEY ("splitEventId") REFERENCES "Splitwise Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
