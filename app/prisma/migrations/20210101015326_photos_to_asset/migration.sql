/*
  Warnings:

  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('Photo', 'Video');

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_userId_fkey";

-- CreateTable
CREATE TABLE "Asset" (
"id" SERIAL,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "type" "AssetType" NOT NULL,
    "url" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "Photo";

-- AddForeignKey
ALTER TABLE "Asset" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD FOREIGN KEY("eventId")REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
