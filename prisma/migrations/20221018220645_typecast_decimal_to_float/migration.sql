/*
  Warnings:

  - You are about to alter the column `seletedRange` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,1)` to `DoublePrecision`.
  - You are about to alter the column `longitude` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,7)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "seletedRange" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;
