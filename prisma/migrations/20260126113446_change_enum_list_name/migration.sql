/*
  Warnings:

  - The values [paid] on the enum `rfStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "rfStatus_new" AS ENUM ('panding', 'refunded', 'failed');
ALTER TABLE "public"."RefundBooking" ALTER COLUMN "refundStatus" DROP DEFAULT;
ALTER TABLE "RefundBooking" ALTER COLUMN "refundStatus" TYPE "rfStatus_new" USING ("refundStatus"::text::"rfStatus_new");
ALTER TYPE "rfStatus" RENAME TO "rfStatus_old";
ALTER TYPE "rfStatus_new" RENAME TO "rfStatus";
DROP TYPE "public"."rfStatus_old";
ALTER TABLE "RefundBooking" ALTER COLUMN "refundStatus" SET DEFAULT 'panding';
COMMIT;
