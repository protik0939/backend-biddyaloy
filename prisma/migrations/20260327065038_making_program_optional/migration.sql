-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_programId_fkey";

-- DropForeignKey
ALTER TABLE "course_registrations" DROP CONSTRAINT "course_registrations_programId_fkey";

-- AlterTable
ALTER TABLE "course_registrations" ALTER COLUMN "programId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "student_admission_posts" ALTER COLUMN "details" DROP DEFAULT;

-- AlterTable
ALTER TABLE "teacher_job_posts" ALTER COLUMN "details" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_registrations" ADD CONSTRAINT "course_registrations_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
