DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'InstitutionTransferEntityType'
    ) THEN
        CREATE TYPE "InstitutionTransferEntityType" AS ENUM ('STUDENT', 'TEACHER');
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'InstitutionTransferStatus'
    ) THEN
        CREATE TYPE "InstitutionTransferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "institution_transfer_requests" (
    "id" TEXT NOT NULL,
    "entityType" "InstitutionTransferEntityType" NOT NULL,
    "status" "InstitutionTransferStatus" NOT NULL DEFAULT 'PENDING',
    "sourceInstitutionId" TEXT NOT NULL,
    "targetInstitutionId" TEXT NOT NULL,
    "requesterUserId" TEXT NOT NULL,
    "reviewerUserId" TEXT,
    "studentProfileId" TEXT,
    "teacherProfileId" TEXT,
    "targetDepartmentId" TEXT,
    "requestMessage" TEXT,
    "responseMessage" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "institution_transfer_requests_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'institution_transfer_requests_sourceInstitutionId_fkey'
    ) THEN
        ALTER TABLE "institution_transfer_requests"
            ADD CONSTRAINT "institution_transfer_requests_sourceInstitutionId_fkey"
            FOREIGN KEY ("sourceInstitutionId") REFERENCES "institutions"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'institution_transfer_requests_targetInstitutionId_fkey'
    ) THEN
        ALTER TABLE "institution_transfer_requests"
            ADD CONSTRAINT "institution_transfer_requests_targetInstitutionId_fkey"
            FOREIGN KEY ("targetInstitutionId") REFERENCES "institutions"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'institution_transfer_requests_requesterUserId_fkey'
    ) THEN
        ALTER TABLE "institution_transfer_requests"
            ADD CONSTRAINT "institution_transfer_requests_requesterUserId_fkey"
            FOREIGN KEY ("requesterUserId") REFERENCES "user"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'institution_transfer_requests_reviewerUserId_fkey'
    ) THEN
        ALTER TABLE "institution_transfer_requests"
            ADD CONSTRAINT "institution_transfer_requests_reviewerUserId_fkey"
            FOREIGN KEY ("reviewerUserId") REFERENCES "user"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'institution_transfer_requests_studentProfileId_fkey'
    ) THEN
        ALTER TABLE "institution_transfer_requests"
            ADD CONSTRAINT "institution_transfer_requests_studentProfileId_fkey"
            FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'institution_transfer_requests_teacherProfileId_fkey'
    ) THEN
        ALTER TABLE "institution_transfer_requests"
            ADD CONSTRAINT "institution_transfer_requests_teacherProfileId_fkey"
            FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'institution_transfer_requests_targetDepartmentId_fkey'
    ) THEN
        ALTER TABLE "institution_transfer_requests"
            ADD CONSTRAINT "institution_transfer_requests_targetDepartmentId_fkey"
            FOREIGN KEY ("targetDepartmentId") REFERENCES "departments"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "institution_transfer_requests_sourceInstitutionId_status_idx"
    ON "institution_transfer_requests"("sourceInstitutionId", "status");

CREATE INDEX IF NOT EXISTS "institution_transfer_requests_targetInstitutionId_status_idx"
    ON "institution_transfer_requests"("targetInstitutionId", "status");

CREATE INDEX IF NOT EXISTS "institution_transfer_requests_requesterUserId_idx"
    ON "institution_transfer_requests"("requesterUserId");

CREATE INDEX IF NOT EXISTS "institution_transfer_requests_studentProfileId_idx"
    ON "institution_transfer_requests"("studentProfileId");

CREATE INDEX IF NOT EXISTS "institution_transfer_requests_teacherProfileId_idx"
    ON "institution_transfer_requests"("teacherProfileId");
