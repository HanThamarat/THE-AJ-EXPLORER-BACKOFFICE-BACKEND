/*
  Warnings:

  - Added the required column `blogType` to the `blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "blogType" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "blogType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blog" ADD CONSTRAINT "blog_blogType_fkey" FOREIGN KEY ("blogType") REFERENCES "blogType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
