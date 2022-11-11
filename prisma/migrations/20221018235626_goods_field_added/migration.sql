/*
  Warnings:

  - Added the required column `storeLatitude` to the `Goods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeLongitude` to the `Goods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeName` to the `Goods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goods" ADD COLUMN     "storeLatitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "storeLongitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "storeName" TEXT NOT NULL;
