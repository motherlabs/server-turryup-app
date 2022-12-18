/*
  Warnings:

  - A unique constraint covering the columns `[imp_uid]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[merchant_uid]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imp_uid` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_uid` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cancelAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imp_uid" TEXT NOT NULL,
ADD COLUMN     "merchant_uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_imp_uid_key" ON "Payment"("imp_uid");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_merchant_uid_key" ON "Payment"("merchant_uid");
