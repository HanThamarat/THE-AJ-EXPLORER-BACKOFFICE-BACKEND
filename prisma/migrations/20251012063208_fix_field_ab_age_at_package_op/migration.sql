/*
  Warnings:

  - You are about to drop the column `adultAge` on the `packageOption` table. All the data in the column will be lost.
  - You are about to drop the column `childAge` on the `packageOption` table. All the data in the column will be lost.
  - You are about to drop the column `groupAge` on the `packageOption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "packageOption" DROP COLUMN "adultAge",
DROP COLUMN "childAge",
DROP COLUMN "groupAge",
ADD COLUMN     "adultFromAge" VARCHAR(10),
ADD COLUMN     "adultToAge" VARCHAR(10),
ADD COLUMN     "childFromAge" VARCHAR(10),
ADD COLUMN     "childToAge" VARCHAR(10),
ADD COLUMN     "groupFromAge" VARCHAR(10),
ADD COLUMN     "groupToAge" VARCHAR(10);
