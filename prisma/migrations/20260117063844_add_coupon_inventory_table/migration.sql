-- CreateTable
CREATE TABLE "couponInventory" (
    "id" SERIAL NOT NULL,
    "couponId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couponInventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "couponInventory" ADD CONSTRAINT "couponInventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couponInventory" ADD CONSTRAINT "couponInventory_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "packagePromo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
