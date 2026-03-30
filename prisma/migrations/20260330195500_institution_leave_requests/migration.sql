DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InstitutionLeaveRequestStatus') THEN
        CREATE TYPE "InstitutionLeaveRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
END $$;

CREATE TABLE "institution_leave_requests" (
    "id" TEXT NOT NULL,
    "requesterUserId" TEXT NOT NULL,
    "requesterRole" "UserRole" NOT NULL,
    "institutionId" TEXT NOT NULL,
    "status" "InstitutionLeaveRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_leave_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "institution_leave_requests_requesterUserId_status_idx"
ON "institution_leave_requests"("requesterUserId", "status");

CREATE INDEX "institution_leave_requests_institutionId_status_idx"
ON "institution_leave_requests"("institutionId", "status");

ALTER TABLE "institution_leave_requests"
ADD CONSTRAINT "institution_leave_requests_requesterUserId_fkey"
FOREIGN KEY ("requesterUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "institution_leave_requests"
ADD CONSTRAINT "institution_leave_requests_institutionId_fkey"
FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "institution_leave_requests"
ADD CONSTRAINT "institution_leave_requests_reviewedByUserId_fkey"
FOREIGN KEY ("reviewedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
