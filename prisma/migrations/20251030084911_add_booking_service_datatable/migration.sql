-- CreateEnum
DO $$
BEGIN
    CREATE TYPE "payMethod" AS ENUM ('qr_propmtpay', 'mobile_banking', 'card');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$
BEGIN
    CREATE TYPE "clStatus" AS ENUM ('panding', 'confirmed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$
BEGIN
    CREATE TYPE "payStatus" AS ENUM ('panding', 'paid', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$
BEGIN
    CREATE TYPE "bkStatus" AS ENUM ('panding', 'confirmed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" VARCHAR(10);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "bookingId" VARCHAR(50) NOT NULL,
    "paymentRef" VARCHAR(60),
    "paymentStatus" "payStatus" NOT NULL DEFAULT 'panding',
    "bookingStatus" "bkStatus" NOT NULL DEFAULT 'panding',
    "userId" TEXT NOT NULL,
    "childPrice" DECIMAL(65,30),
    "childQty" INTEGER,
    "adultPrice" DECIMAL(65,30),
    "adultQty" INTEGER,
    "groupPrice" DECIMAL(65,30),
    "groupQty" INTEGER,
    "additionalDetail" VARCHAR(1000),
    "locationId" INTEGER,
    "pickup_lat" DECIMAL(65,30) NOT NULL,
    "pickup_lgn" DECIMAL(65,30) NOT NULL,
    "trip_at" TIMESTAMP(3) NOT NULL,
    "policyAccept" BOOLEAN NOT NULL DEFAULT false,
    "expire_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "bookingId" TEXT NOT NULL,
    "cleanliness" INTEGER NOT NULL,
    "staff" INTEGER NOT NULL,
    "location" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "samary" VARCHAR(1000) NOT NULL,
    "iamge" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CancalationBooking" (
    "id" SERIAL NOT NULL,
    "bookingId" TEXT NOT NULL,
    "cancelStatus" "clStatus" NOT NULL DEFAULT 'panding',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancalationBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefundBooking" (
    "id" SERIAL NOT NULL,
    "bookingId" TEXT NOT NULL,
    "paymentMethod" "payMethod" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "resson" VARCHAR(600),
    "manualRefund" INTEGER,
    "processed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefundBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBankAccount" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locationPoint" (
    "id" SERIAL NOT NULL,
    "locationName" VARCHAR(100) NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "lng" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locationPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingId_key" ON "Booking"("bookingId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locationPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancalationBooking" ADD CONSTRAINT "CancalationBooking_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundBooking" ADD CONSTRAINT "RefundBooking_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundBooking" ADD CONSTRAINT "RefundBooking_manualRefund_fkey" FOREIGN KEY ("manualRefund") REFERENCES "UserBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBankAccount" ADD CONSTRAINT "UserBankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
