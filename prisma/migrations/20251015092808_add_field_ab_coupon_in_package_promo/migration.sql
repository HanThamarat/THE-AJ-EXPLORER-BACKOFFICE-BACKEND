-- CreateEnum
CREATE TYPE "packagePromoType" AS ENUM ('promotion', 'coupon');

-- AlterTable
ALTER TABLE "packagePromo" ADD COLUMN     "couponCode" VARCHAR(30),
ADD COLUMN     "description" VARCHAR(2000),
ADD COLUMN     "type" "packagePromoType" NOT NULL DEFAULT 'promotion';
