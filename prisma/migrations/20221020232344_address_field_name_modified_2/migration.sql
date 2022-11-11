/*
  Warnings:

  - You are about to drop the column `seletedRange` on the `Address` table. All the data in the column will be lost.
  - Added the required column `range` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "seletedRange",
ADD COLUMN     "range" DOUBLE PRECISION NOT NULL;
