/*
  Warnings:

  - You are about to drop the column `accountName` on the `UserBankAccount` table. All the data in the column will be lost.
  - You are about to alter the column `accountNumber` on the `UserBankAccount` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - Added the required column `accountFirstName` to the `UserBankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountLastNaem` to the `UserBankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBankAccount" DROP COLUMN "accountName",
ADD COLUMN     "accountFirstName" VARCHAR(100) NOT NULL,
ADD COLUMN     "accountLastNaem" VARCHAR(100) NOT NULL,
ALTER COLUMN "accountNumber" SET DATA TYPE VARCHAR(40);
