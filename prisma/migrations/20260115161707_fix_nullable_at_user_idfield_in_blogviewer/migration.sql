-- DropForeignKey
ALTER TABLE "public"."blogViewer" DROP CONSTRAINT "blogViewer_userId_fkey";

-- AlterTable
ALTER TABLE "blogViewer" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "blogViewer" ADD CONSTRAINT "blogViewer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
