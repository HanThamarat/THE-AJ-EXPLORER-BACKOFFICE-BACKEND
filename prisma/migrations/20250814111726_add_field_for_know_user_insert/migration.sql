/*
  Warnings:

  - Added the required column `created_by` to the `packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."packages" ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "updated_by" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."blog" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "descrition" TEXT,
    "status" BOOLEAN DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "updated_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "blog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."administrator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."packages" ADD CONSTRAINT "packages_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."administrator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog" ADD CONSTRAINT "blog_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."administrator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog" ADD CONSTRAINT "blog_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."administrator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
