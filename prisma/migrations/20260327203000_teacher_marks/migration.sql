CREATE TABLE IF NOT EXISTS "teacher_marks" (
    "id" TEXT NOT NULL,
    "courseRegistrationId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT,
    "labReport" DOUBLE PRECISION,
    "labTask" DOUBLE PRECISION,
    "project" DOUBLE PRECISION,
    "projectReport" DOUBLE PRECISION,
    "presentation" DOUBLE PRECISION,
    "labEvaluation" DOUBLE PRECISION,
    "viva" DOUBLE PRECISION,
    "quiz1" DOUBLE PRECISION,
    "quiz2" DOUBLE PRECISION,
    "quiz3" DOUBLE PRECISION,
    "assignment" DOUBLE PRECISION,
    "midterm" DOUBLE PRECISION,
    "finalExam" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_marks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "teacher_marks_courseRegistrationId_key"
ON "teacher_marks"("courseRegistrationId");

CREATE INDEX IF NOT EXISTS "teacher_marks_teacherProfileId_createdAt_idx"
ON "teacher_marks"("teacherProfileId", "createdAt");

CREATE INDEX IF NOT EXISTS "teacher_marks_institutionId_idx"
ON "teacher_marks"("institutionId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_marks_courseRegistrationId_fkey'
    ) THEN
        ALTER TABLE "teacher_marks"
        ADD CONSTRAINT "teacher_marks_courseRegistrationId_fkey"
        FOREIGN KEY ("courseRegistrationId") REFERENCES "course_registrations"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_marks_teacherProfileId_fkey'
    ) THEN
        ALTER TABLE "teacher_marks"
        ADD CONSTRAINT "teacher_marks_teacherProfileId_fkey"
        FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_marks_institutionId_fkey'
    ) THEN
        ALTER TABLE "teacher_marks"
        ADD CONSTRAINT "teacher_marks_institutionId_fkey"
        FOREIGN KEY ("institutionId") REFERENCES "institutions"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_marks_departmentId_fkey'
    ) THEN
        ALTER TABLE "teacher_marks"
        ADD CONSTRAINT "teacher_marks_departmentId_fkey"
        FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
