/*
  Warnings:

  - You are about to drop the `pakageOptionType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pakageType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."packageOption" DROP CONSTRAINT "packageOption_pkgOptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."packages" DROP CONSTRAINT "packages_packageTypeId_fkey";

-- DropTable
DROP TABLE "public"."pakageOptionType";

-- DropTable
DROP TABLE "public"."pakageType";

-- CreateTable
CREATE TABLE "public"."packageType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packageType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."packageOptionType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "status" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packageOptionType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_packageTypeId_fkey" FOREIGN KEY ("packageTypeId") REFERENCES "public"."packageType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packageOption" ADD CONSTRAINT "packageOption_pkgOptionId_fkey" FOREIGN KEY ("pkgOptionId") REFERENCES "public"."packageOptionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
