-- AlterTable
ALTER TABLE "couponInventory" ADD COLUMN     "bookingId" TEXT;

-- AddForeignKey
ALTER TABLE "couponInventory" ADD CONSTRAINT "couponInventory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE SET NULL ON UPDATE CASCADE;
