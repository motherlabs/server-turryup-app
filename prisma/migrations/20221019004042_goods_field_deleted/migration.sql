/*
  Warnings:

  - You are about to drop the column `storeLatitude` on the `Goods` table. All the data in the column will be lost.
  - You are about to drop the column `storeLongitude` on the `Goods` table. All the data in the column will be lost.
  - You are about to drop the column `storeName` on the `Goods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goods" DROP COLUMN "storeLatitude",
DROP COLUMN "storeLongitude",
DROP COLUMN "storeName";
