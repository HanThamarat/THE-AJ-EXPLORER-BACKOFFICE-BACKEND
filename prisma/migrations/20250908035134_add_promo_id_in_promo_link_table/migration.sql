/*
  Warnings:

  - Added the required column `promoId` to the `promoLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."promoLink" ADD COLUMN     "promoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."promoLink" ADD CONSTRAINT "promoLink_promoId_fkey" FOREIGN KEY ("promoId") REFERENCES "public"."packagePromo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
