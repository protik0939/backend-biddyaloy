-- DropForeignKey
ALTER TABLE "section_course_teacher_assignments" DROP CONSTRAINT "section_course_teacher_assignments_courseId_fkey";

-- DropForeignKey
ALTER TABLE "section_course_teacher_assignments" DROP CONSTRAINT "section_course_teacher_assignments_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "student_application_profiles" DROP CONSTRAINT "student_application_profiles_studentUserId_fkey";

-- DropForeignKey
ALTER TABLE "student_classwork_submissions" DROP CONSTRAINT "student_classwork_submissions_classworkId_fkey";

-- DropForeignKey
ALTER TABLE "student_classwork_submissions" DROP CONSTRAINT "student_classwork_submissions_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_application_profiles" DROP CONSTRAINT "teacher_application_profiles_teacherUserId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_marks" DROP CONSTRAINT "teacher_marks_courseRegistrationId_fkey";

-- AlterTable
ALTER TABLE "student_application_profiles" ALTER COLUMN "documentUrls" DROP DEFAULT;

-- AlterTable
ALTER TABLE "teacher_application_profiles" ALTER COLUMN "skills" DROP DEFAULT,
ALTER COLUMN "certifications" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "student_application_profiles" ADD CONSTRAINT "student_application_profiles_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_marks" ADD CONSTRAINT "teacher_marks_courseRegistrationId_fkey" FOREIGN KEY ("courseRegistrationId") REFERENCES "course_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_classwork_submissions" ADD CONSTRAINT "student_classwork_submissions_classworkId_fkey" FOREIGN KEY ("classworkId") REFERENCES "teacher_classworks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_classwork_submissions" ADD CONSTRAINT "student_classwork_submissions_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_course_teacher_assignments" ADD CONSTRAINT "section_course_teacher_assignments_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_course_teacher_assignments" ADD CONSTRAINT "section_course_teacher_assignments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_application_profiles" ADD CONSTRAINT "teacher_application_profiles_teacherUserId_fkey" FOREIGN KEY ("teacherUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "section_course_teacher_assignments_teacherProfileId_createdAt_i" RENAME TO "section_course_teacher_assignments_teacherProfileId_created_idx";
