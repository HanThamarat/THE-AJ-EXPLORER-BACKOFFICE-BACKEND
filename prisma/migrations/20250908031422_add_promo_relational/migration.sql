-- CreateTable
CREATE TABLE "public"."packagePromo" (
    "id" SERIAL NOT NULL,
    "promoName" VARCHAR(100) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,

    CONSTRAINT "packagePromo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."promoLink" (
    "id" SERIAL NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "packageLink" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promoLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."packagePromo" ADD CONSTRAINT "packagePromo_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."administrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packagePromo" ADD CONSTRAINT "packagePromo_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."administrator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."promoLink" ADD CONSTRAINT "promoLink_packageLink_fkey" FOREIGN KEY ("packageLink") REFERENCES "public"."packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
