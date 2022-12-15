-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gender" "GenderType" NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "interestGoods" TEXT NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Info_userId_key" ON "Info"("userId");

-- AddForeignKey
ALTER TABLE "Info" ADD CONSTRAINT "Info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
