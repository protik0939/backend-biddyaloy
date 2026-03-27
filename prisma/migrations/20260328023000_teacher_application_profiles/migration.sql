CREATE TABLE IF NOT EXISTS "teacher_application_profiles" (
    "id" TEXT NOT NULL,
    "teacherUserId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "portfolioUrl" TEXT,
    "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "certifications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "academicRecords" JSONB NOT NULL,
    "experiences" JSONB NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_application_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "teacher_application_profiles_teacherUserId_key"
ON "teacher_application_profiles"("teacherUserId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'teacher_application_profiles_teacherUserId_fkey'
    ) THEN
        ALTER TABLE "teacher_application_profiles"
        ADD CONSTRAINT "teacher_application_profiles_teacherUserId_fkey"
        FOREIGN KEY ("teacherUserId") REFERENCES "user"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
