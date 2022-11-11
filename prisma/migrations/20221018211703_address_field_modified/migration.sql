/*
  Warnings:

  - You are about to alter the column `seletedRange` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(2,1)`.
  - You are about to alter the column `latitude` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,7)`.
  - You are about to alter the column `longitude` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,7)`.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "seletedRange" SET DATA TYPE DECIMAL(2,1),
ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(10,7),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(10,7);
