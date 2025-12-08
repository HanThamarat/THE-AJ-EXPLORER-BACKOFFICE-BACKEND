-- CreateTable
CREATE TABLE "ContractBooking" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "country" VARCHAR(40) NOT NULL,
    "phoneNumber" VARCHAR(10) NOT NULL,
    "userId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractBooking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContractBooking" ADD CONSTRAINT "ContractBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
