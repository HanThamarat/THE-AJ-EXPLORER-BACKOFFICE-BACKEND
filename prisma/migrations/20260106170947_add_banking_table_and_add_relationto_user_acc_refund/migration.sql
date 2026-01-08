/*
  Warnings:

  - You are about to drop the column `bankName` on the `UserBankAccount` table. All the data in the column will be lost.
  - Added the required column `bankId` to the `UserBankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBankAccount" DROP COLUMN "bankName",
ADD COLUMN     "bankId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Banking" (
    "id" SERIAL NOT NULL,
    "bankNameEn" VARCHAR(100) NOT NULL,
    "bankNameTh" VARCHAR(100) NOT NULL,
    "bankShortName" VARCHAR(20) NOT NULL,
    "bankCode" VARCHAR(10) NOT NULL,
    "bankPicture" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Banking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserBankAccount" ADD CONSTRAINT "UserBankAccount_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Banking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
