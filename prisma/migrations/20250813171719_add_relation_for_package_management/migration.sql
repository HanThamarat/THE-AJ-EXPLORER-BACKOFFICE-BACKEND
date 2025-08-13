-- AlterTable
ALTER TABLE "public"."administrator" ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- CreateTable
CREATE TABLE "public"."packages" (
    "id" SERIAL NOT NULL,
    "packageName" VARCHAR(100),
    "packageTypeId" INTEGER NOT NULL,
    "description" VARCHAR(9000),
    "provinceId" INTEGER,
    "districtId" INTEGER,
    "subDistrictId" INTEGER,
    "lon" VARCHAR(100),
    "lat" VARCHAR(100),
    "packageImages" TEXT,
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."packageOption" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "pkgOptionId" INTEGER NOT NULL,
    "name" VARCHAR(100),
    "description" VARCHAR(6000),
    "adultPrice" DOUBLE PRECISION,
    "childPrice" DOUBLE PRECISION,
    "groupPrice" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packageOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pakageType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pakageType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pakageOptionType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pakageOptionType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_packageTypeId_fkey" FOREIGN KEY ("packageTypeId") REFERENCES "public"."pakageType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "public"."province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."district"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "public"."subdistrict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packageOption" ADD CONSTRAINT "packageOption_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packageOption" ADD CONSTRAINT "packageOption_pkgOptionId_fkey" FOREIGN KEY ("pkgOptionId") REFERENCES "public"."pakageOptionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
