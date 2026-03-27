-- DropForeignKey
ALTER TABLE "section_course_teacher_assignments" DROP CONSTRAINT "section_course_teacher_assignments_courseId_fkey";

-- DropForeignKey
ALTER TABLE "section_course_teacher_assignments" DROP CONSTRAINT "section_course_teacher_assignments_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "teacher_marks" DROP CONSTRAINT "teacher_marks_courseRegistrationId_fkey";

-- AddForeignKey
ALTER TABLE "teacher_marks" ADD CONSTRAINT "teacher_marks_courseRegistrationId_fkey" FOREIGN KEY ("courseRegistrationId") REFERENCES "course_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_course_teacher_assignments" ADD CONSTRAINT "section_course_teacher_assignments_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_course_teacher_assignments" ADD CONSTRAINT "section_course_teacher_assignments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "section_course_teacher_assignments_teacherProfileId_createdAt_i" RENAME TO "section_course_teacher_assignments_teacherProfileId_created_idx";
