-- CreateEnum
CREATE TYPE "rfStatus" AS ENUM ('panding', 'paid', 'failed');

-- AlterTable
ALTER TABLE "RefundBooking" ADD COLUMN     "refundStatus" "rfStatus" NOT NULL DEFAULT 'panding';
