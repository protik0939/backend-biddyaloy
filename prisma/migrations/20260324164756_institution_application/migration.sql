/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `admin_profiles` will be added. If there are existing duplicate values, this will fail.
  - Made the column `accountStatus` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InstitutionApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "accountStatus" SET NOT NULL,
ALTER COLUMN "accountStatus" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "institution_applications" (
    "id" TEXT NOT NULL,
    "applicantUserId" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "description" TEXT,
    "shortName" TEXT,
    "institutionType" "InstitutionType",
    "institutionLogo" TEXT,
    "status" "InstitutionApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "institutionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "institution_applications_applicantUserId_idx" ON "institution_applications"("applicantUserId");

-- CreateIndex
CREATE INDEX "institution_applications_status_idx" ON "institution_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_userId_key" ON "admin_profiles"("userId");

-- AddForeignKey
ALTER TABLE "institution_applications" ADD CONSTRAINT "institution_applications_applicantUserId_fkey" FOREIGN KEY ("applicantUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_applications" ADD CONSTRAINT "institution_applications_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_applications" ADD CONSTRAINT "institution_applications_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
