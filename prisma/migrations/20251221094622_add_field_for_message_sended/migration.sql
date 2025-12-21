-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "messageId" VARCHAR(60),
ADD COLUMN     "messageSend" BOOLEAN DEFAULT false;
