CREATE TABLE IF NOT EXISTS "student_classwork_submissions" (
    "id" TEXT NOT NULL,
    "classworkId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "responseText" TEXT,
    "attachmentUrl" TEXT,
    "attachmentName" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_classwork_submissions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "student_classwork_submissions_classworkId_studentProfileId_key"
ON "student_classwork_submissions"("classworkId", "studentProfileId");

CREATE INDEX IF NOT EXISTS "student_classwork_submissions_studentProfileId_submittedAt_idx"
ON "student_classwork_submissions"("studentProfileId", "submittedAt");

CREATE INDEX IF NOT EXISTS "student_classwork_submissions_institutionId_idx"
ON "student_classwork_submissions"("institutionId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_classwork_submissions_classworkId_fkey'
    ) THEN
        ALTER TABLE "student_classwork_submissions"
        ADD CONSTRAINT "student_classwork_submissions_classworkId_fkey"
        FOREIGN KEY ("classworkId") REFERENCES "teacher_classworks"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_classwork_submissions_studentProfileId_fkey'
    ) THEN
        ALTER TABLE "student_classwork_submissions"
        ADD CONSTRAINT "student_classwork_submissions_studentProfileId_fkey"
        FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_classwork_submissions_institutionId_fkey'
    ) THEN
        ALTER TABLE "student_classwork_submissions"
        ADD CONSTRAINT "student_classwork_submissions_institutionId_fkey"
        FOREIGN KEY ("institutionId") REFERENCES "institutions"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_classwork_submissions_departmentId_fkey'
    ) THEN
        ALTER TABLE "student_classwork_submissions"
        ADD CONSTRAINT "student_classwork_submissions_departmentId_fkey"
        FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
