/*
  Warnings:

  - You are about to drop the `ClassRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ClassRoom";

-- CreateTable
CREATE TABLE "classrooms" (
    "id" SERIAL NOT NULL,
    "roomNo" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "roomType" "ClassRoomType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);
