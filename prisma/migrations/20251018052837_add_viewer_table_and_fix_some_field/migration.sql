-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "thumnbnail" VARCHAR(1000);

-- CreateTable
CREATE TABLE "blogViewer" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogViewer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blogViewer" ADD CONSTRAINT "blogViewer_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogViewer" ADD CONSTRAINT "blogViewer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
