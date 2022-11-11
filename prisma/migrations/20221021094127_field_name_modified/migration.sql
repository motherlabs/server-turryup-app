/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeNumber]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storeNumber` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "phoneNumber",
ADD COLUMN     "storeNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Store_storeNumber_key" ON "Store"("storeNumber");
