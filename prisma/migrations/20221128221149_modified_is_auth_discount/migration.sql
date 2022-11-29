/*
  Warnings:

  - The `isAutoDiscount` column on the `Goods` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Goods" DROP COLUMN "isAutoDiscount",
ADD COLUMN     "isAutoDiscount" INTEGER NOT NULL DEFAULT 0;
