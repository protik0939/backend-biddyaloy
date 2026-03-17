-- CreateTable
CREATE TABLE "ClassRoom" (
    "id" SERIAL NOT NULL,
    "roomNo" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "roomType" "ClassRoomType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassRoom_pkey" PRIMARY KEY ("id")
);
