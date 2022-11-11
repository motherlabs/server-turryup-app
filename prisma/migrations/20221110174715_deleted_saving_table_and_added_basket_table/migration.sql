/*
  Warnings:

  - You are about to drop the `Saving` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Saving" DROP CONSTRAINT "Saving_userId_fkey";

-- DropTable
DROP TABLE "Saving";

-- CreateTable
CREATE TABLE "Basket" (
    "id" SERIAL NOT NULL,
    "goodsId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "state" "DefaultState" NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Basket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_goodsId_fkey" FOREIGN KEY ("goodsId") REFERENCES "Goods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
