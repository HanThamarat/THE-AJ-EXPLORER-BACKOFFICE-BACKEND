/*
  Warnings:

  - Added the required column `created_by` to the `packageType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `packageType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."packageType" ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "updated_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."packageType" ADD CONSTRAINT "packageType_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."administrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packageType" ADD CONSTRAINT "packageType_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."administrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
