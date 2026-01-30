DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rfstatus') THEN
    CREATE TYPE "rfStatus" AS ENUM ('panding', 'paid', 'failed');
  END IF;
END $$;

ALTER TABLE "public"."RefundBooking"
ADD COLUMN IF NOT EXISTS "refundStatus" "rfStatus" NOT NULL DEFAULT 'panding';
