DO $$
BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'teacher_marks'
	) THEN
		IF EXISTS (
			SELECT 1 FROM pg_constraint WHERE conname = 'teacher_marks_courseRegistrationId_fkey'
		) THEN
			ALTER TABLE "teacher_marks" DROP CONSTRAINT "teacher_marks_courseRegistrationId_fkey";
		END IF;

		ALTER TABLE "teacher_marks"
		ADD CONSTRAINT "teacher_marks_courseRegistrationId_fkey"
		FOREIGN KEY ("courseRegistrationId") REFERENCES "course_registrations"("id")
		ON DELETE RESTRICT ON UPDATE CASCADE;
	END IF;
END $$;

DO $$
BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'section_course_teacher_assignments'
	) THEN
		IF EXISTS (
			SELECT 1 FROM pg_constraint WHERE conname = 'section_course_teacher_assignments_courseId_fkey'
		) THEN
			ALTER TABLE "section_course_teacher_assignments" DROP CONSTRAINT "section_course_teacher_assignments_courseId_fkey";
		END IF;

		IF EXISTS (
			SELECT 1 FROM pg_constraint WHERE conname = 'section_course_teacher_assignments_sectionId_fkey'
		) THEN
			ALTER TABLE "section_course_teacher_assignments" DROP CONSTRAINT "section_course_teacher_assignments_sectionId_fkey";
		END IF;

		ALTER TABLE "section_course_teacher_assignments"
		ADD CONSTRAINT "section_course_teacher_assignments_sectionId_fkey"
		FOREIGN KEY ("sectionId") REFERENCES "sections"("id")
		ON DELETE RESTRICT ON UPDATE CASCADE;

		ALTER TABLE "section_course_teacher_assignments"
		ADD CONSTRAINT "section_course_teacher_assignments_courseId_fkey"
		FOREIGN KEY ("courseId") REFERENCES "Course"("id")
		ON DELETE RESTRICT ON UPDATE CASCADE;

		IF EXISTS (
			SELECT 1 FROM pg_indexes
			WHERE schemaname = 'public'
			  AND indexname = 'section_course_teacher_assignments_teacherProfileId_createdAt_i'
		) THEN
			ALTER INDEX "section_course_teacher_assignments_teacherProfileId_createdAt_i"
			RENAME TO "section_course_teacher_assignments_teacherProfileId_created_idx";
		END IF;
	END IF;
END $$;
