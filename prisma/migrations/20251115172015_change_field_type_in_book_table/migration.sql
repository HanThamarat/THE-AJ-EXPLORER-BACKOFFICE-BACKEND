/*
  Warnings:

  - You are about to alter the column `childPrice` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `adultPrice` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `groupPrice` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `amount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "childPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "adultPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "groupPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;
