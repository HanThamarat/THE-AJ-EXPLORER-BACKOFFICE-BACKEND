BEGIN;

-- If a previous failed run left rfStatus_new around, remove it
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rfstatus_new') THEN
    DROP TYPE "rfStatus_new";
  END IF;
END $$;

-- create the new enum
CREATE TYPE "rfStatus_new" AS ENUM ('panding', 'refunded', 'failed');

-- drop default, change column type
ALTER TABLE "public"."RefundBooking"
  ALTER COLUMN "refundStatus" DROP DEFAULT;

ALTER TABLE "public"."RefundBooking"
  ALTER COLUMN "refundStatus" TYPE "rfStatus_new"
  USING ("refundStatus"::text::"rfStatus_new");

-- rename old + new
ALTER TYPE "rfStatus" RENAME TO "rfStatus_old";
ALTER TYPE "rfStatus_new" RENAME TO "rfStatus";

-- delete old enum
DROP TYPE "rfStatus_old";

-- restore default
ALTER TABLE "public"."RefundBooking"
  ALTER COLUMN "refundStatus" SET DEFAULT 'panding';

COMMIT;