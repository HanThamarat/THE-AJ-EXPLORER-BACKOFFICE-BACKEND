BEGIN;

-- Clean leftover temp enum if it exists
DROP TYPE IF EXISTS "rfStatus_new";

-- Create new enum
CREATE TYPE "rfStatus_new" AS ENUM ('panding', 'refunded', 'failed');

-- Remove default
ALTER TABLE "public"."RefundBooking"
  ALTER COLUMN "refundStatus" DROP DEFAULT;

-- Convert data SAFELY (map 'paid')
ALTER TABLE "public"."RefundBooking"
  ALTER COLUMN "refundStatus" TYPE "rfStatus_new"
  USING (
    CASE
      WHEN "refundStatus"::text = 'paid' THEN 'refunded'::"rfStatus_new"
      ELSE "refundStatus"::text::"rfStatus_new"
    END
  );

-- Swap enum names
ALTER TYPE "rfStatus" RENAME TO "rfStatus_old";
ALTER TYPE "rfStatus_new" RENAME TO "rfStatus";

-- Drop old enum
DROP TYPE "rfStatus_old";

-- Restore default
ALTER TABLE "public"."RefundBooking"
  ALTER COLUMN "refundStatus" SET DEFAULT 'panding';

COMMIT;
