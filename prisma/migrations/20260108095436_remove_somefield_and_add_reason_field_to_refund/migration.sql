/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `RefundBooking` table. All the data in the column will be lost.
  - Added the required column `refundPercentage` to the `RefundBooking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefundBooking_paymentMethod_idx";

-- AlterTable
ALTER TABLE "RefundBooking" DROP COLUMN "paymentMethod",
ADD COLUMN     "refundPercentage" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "payMethod";
