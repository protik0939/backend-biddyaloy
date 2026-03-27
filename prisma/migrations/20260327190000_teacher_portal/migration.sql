DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TeacherJobApplicationStatus') THEN
        CREATE TYPE "TeacherJobApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TeacherClassworkType') THEN
        CREATE TYPE "TeacherClassworkType" AS ENUM ('TASK', 'ASSIGNMENT', 'QUIZ', 'NOTICE');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "teacher_job_applications" (
    "id" TEXT NOT NULL,
    "coverLetter" TEXT,
    "status" "TeacherJobApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "institutionResponse" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postingId" TEXT NOT NULL,
    "teacherUserId" TEXT NOT NULL,
    "reviewerUserId" TEXT,
    "teacherProfileId" TEXT,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_job_applications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "teacher_classworks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "type" "TeacherClassworkType" NOT NULL,
    "dueAt" TIMESTAMP(3),
    "sectionId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_classworks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "teacher_job_applications_postingId_teacherUserId_key"
ON "teacher_job_applications"("postingId", "teacherUserId");

CREATE INDEX IF NOT EXISTS "teacher_job_applications_teacherUserId_idx"
ON "teacher_job_applications"("teacherUserId");

CREATE INDEX IF NOT EXISTS "teacher_job_applications_institutionId_status_idx"
ON "teacher_job_applications"("institutionId", "status");

CREATE INDEX IF NOT EXISTS "teacher_classworks_teacherProfileId_createdAt_idx"
ON "teacher_classworks"("teacherProfileId", "createdAt");

CREATE INDEX IF NOT EXISTS "teacher_classworks_sectionId_type_idx"
ON "teacher_classworks"("sectionId", "type");

CREATE UNIQUE INDEX IF NOT EXISTS "attendances_courseRegistrationId_date_key"
ON "attendances"("courseRegistrationId", "date");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_job_applications_postingId_fkey'
    ) THEN
        ALTER TABLE "teacher_job_applications"
        ADD CONSTRAINT "teacher_job_applications_postingId_fkey"
        FOREIGN KEY ("postingId") REFERENCES "teacher_job_posts"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_job_applications_teacherUserId_fkey'
    ) THEN
        ALTER TABLE "teacher_job_applications"
        ADD CONSTRAINT "teacher_job_applications_teacherUserId_fkey"
        FOREIGN KEY ("teacherUserId") REFERENCES "user"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_job_applications_reviewerUserId_fkey'
    ) THEN
        ALTER TABLE "teacher_job_applications"
        ADD CONSTRAINT "teacher_job_applications_reviewerUserId_fkey"
        FOREIGN KEY ("reviewerUserId") REFERENCES "user"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_job_applications_teacherProfileId_fkey'
    ) THEN
        ALTER TABLE "teacher_job_applications"
        ADD CONSTRAINT "teacher_job_applications_teacherProfileId_fkey"
        FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_job_applications_institutionId_fkey'
    ) THEN
        ALTER TABLE "teacher_job_applications"
        ADD CONSTRAINT "teacher_job_applications_institutionId_fkey"
        FOREIGN KEY ("institutionId") REFERENCES "institutions"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_job_applications_departmentId_fkey'
    ) THEN
        ALTER TABLE "teacher_job_applications"
        ADD CONSTRAINT "teacher_job_applications_departmentId_fkey"
        FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_classworks_sectionId_fkey'
    ) THEN
        ALTER TABLE "teacher_classworks"
        ADD CONSTRAINT "teacher_classworks_sectionId_fkey"
        FOREIGN KEY ("sectionId") REFERENCES "sections"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_classworks_teacherProfileId_fkey'
    ) THEN
        ALTER TABLE "teacher_classworks"
        ADD CONSTRAINT "teacher_classworks_teacherProfileId_fkey"
        FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_classworks_institutionId_fkey'
    ) THEN
        ALTER TABLE "teacher_classworks"
        ADD CONSTRAINT "teacher_classworks_institutionId_fkey"
        FOREIGN KEY ("institutionId") REFERENCES "institutions"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_classworks_departmentId_fkey'
    ) THEN
        ALTER TABLE "teacher_classworks"
        ADD CONSTRAINT "teacher_classworks_departmentId_fkey"
        FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
