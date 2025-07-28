/*
  Warnings:

  - A unique constraint covering the columns `[zkCommitment]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "zkCommitment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_zkCommitment_key" ON "User"("zkCommitment");
