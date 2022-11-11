/*
  Warnings:

  - You are about to alter the column `latitude` on the `Address` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,7)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION;
