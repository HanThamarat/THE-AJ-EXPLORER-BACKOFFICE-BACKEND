/*
  Warnings:

  - You are about to drop the column `lat` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `lon` on the `packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."packages" DROP COLUMN "lat",
DROP COLUMN "lon",
ADD COLUMN     "additional_description" VARCHAR(9000),
ADD COLUMN     "benefit_include" TEXT,
ADD COLUMN     "benefit_not_include" TEXT,
ADD COLUMN     "depart_point_lat" VARCHAR(100),
ADD COLUMN     "depart_point_lon" VARCHAR(100),
ADD COLUMN     "end_point_lat" VARCHAR(100),
ADD COLUMN     "end_point_lon" VARCHAR(100);

-- CreateTable
CREATE TABLE "public"."packageAttraction" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "attractionName" VARCHAR(100) NOT NULL,
    "attractionTime" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packageAttraction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."packageAttraction" ADD CONSTRAINT "packageAttraction_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
