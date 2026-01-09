/*
  Warnings:

  - You are about to drop the column `resson` on the `RefundBooking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RefundBooking" DROP COLUMN "resson",
ADD COLUMN     "reason" VARCHAR(600);
