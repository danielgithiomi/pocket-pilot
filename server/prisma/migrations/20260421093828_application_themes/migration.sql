-- CreateEnum
CREATE TYPE "ApplicationTheme" AS ENUM ('SYSTEM', 'LIGHT', 'DARK');

-- AlterTable
ALTER TABLE "User Preferences" ADD COLUMN     "preferredTheme" "ApplicationTheme" NOT NULL DEFAULT 'SYSTEM';
