CREATE TABLE IF NOT EXISTS "section_course_teacher_assignments" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_course_teacher_assignments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "section_course_teacher_assignments_sectionId_courseId_key"
ON "section_course_teacher_assignments"("sectionId", "courseId");

CREATE INDEX IF NOT EXISTS "section_course_teacher_assignments_teacherProfileId_createdAt_idx"
ON "section_course_teacher_assignments"("teacherProfileId", "createdAt");

CREATE INDEX IF NOT EXISTS "section_course_teacher_assignments_institutionId_idx"
ON "section_course_teacher_assignments"("institutionId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'section_course_teacher_assignments_sectionId_fkey'
    ) THEN
        ALTER TABLE "section_course_teacher_assignments"
        ADD CONSTRAINT "section_course_teacher_assignments_sectionId_fkey"
        FOREIGN KEY ("sectionId") REFERENCES "sections"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'section_course_teacher_assignments_courseId_fkey'
    ) THEN
        ALTER TABLE "section_course_teacher_assignments"
        ADD CONSTRAINT "section_course_teacher_assignments_courseId_fkey"
        FOREIGN KEY ("courseId") REFERENCES "Course"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'section_course_teacher_assignments_teacherProfileId_fkey'
    ) THEN
        ALTER TABLE "section_course_teacher_assignments"
        ADD CONSTRAINT "section_course_teacher_assignments_teacherProfileId_fkey"
        FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'section_course_teacher_assignments_institutionId_fkey'
    ) THEN
        ALTER TABLE "section_course_teacher_assignments"
        ADD CONSTRAINT "section_course_teacher_assignments_institutionId_fkey"
        FOREIGN KEY ("institutionId") REFERENCES "institutions"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'section_course_teacher_assignments_departmentId_fkey'
    ) THEN
        ALTER TABLE "section_course_teacher_assignments"
        ADD CONSTRAINT "section_course_teacher_assignments_departmentId_fkey"
        FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
