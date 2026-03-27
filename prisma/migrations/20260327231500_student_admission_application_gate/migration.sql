DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StudentAdmissionApplicationStatus') THEN
        CREATE TYPE "StudentAdmissionApplicationStatus" AS ENUM ('PENDING', 'SHORTLISTED', 'APPROVED', 'REJECTED');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "student_application_profiles" (
    "id" TEXT NOT NULL,
    "studentUserId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "documentUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "academicRecords" JSONB NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_application_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "student_admission_applications" (
    "id" TEXT NOT NULL,
    "coverLetter" TEXT,
    "status" "StudentAdmissionApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "institutionResponse" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postingId" TEXT NOT NULL,
    "studentUserId" TEXT NOT NULL,
    "reviewerUserId" TEXT,
    "studentProfileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_admission_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "student_application_profiles_studentUserId_key"
ON "student_application_profiles"("studentUserId");

CREATE UNIQUE INDEX IF NOT EXISTS "student_admission_applications_postingId_studentUserId_key"
ON "student_admission_applications"("postingId", "studentUserId");

CREATE INDEX IF NOT EXISTS "student_admission_applications_studentUserId_idx"
ON "student_admission_applications"("studentUserId");

CREATE INDEX IF NOT EXISTS "student_admission_applications_status_idx"
ON "student_admission_applications"("status");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_application_profiles_studentUserId_fkey'
    ) THEN
        ALTER TABLE "student_application_profiles"
        ADD CONSTRAINT "student_application_profiles_studentUserId_fkey"
        FOREIGN KEY ("studentUserId") REFERENCES "user"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_admission_applications_postingId_fkey'
    ) THEN
        ALTER TABLE "student_admission_applications"
        ADD CONSTRAINT "student_admission_applications_postingId_fkey"
        FOREIGN KEY ("postingId") REFERENCES "student_admission_posts"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_admission_applications_studentUserId_fkey'
    ) THEN
        ALTER TABLE "student_admission_applications"
        ADD CONSTRAINT "student_admission_applications_studentUserId_fkey"
        FOREIGN KEY ("studentUserId") REFERENCES "user"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_admission_applications_reviewerUserId_fkey'
    ) THEN
        ALTER TABLE "student_admission_applications"
        ADD CONSTRAINT "student_admission_applications_reviewerUserId_fkey"
        FOREIGN KEY ("reviewerUserId") REFERENCES "user"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'student_admission_applications_studentProfileId_fkey'
    ) THEN
        ALTER TABLE "student_admission_applications"
        ADD CONSTRAINT "student_admission_applications_studentProfileId_fkey"
        FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
