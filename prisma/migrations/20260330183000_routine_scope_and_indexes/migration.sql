ALTER TABLE "schedules"
ADD COLUMN IF NOT EXISTS "institutionId" TEXT,
ADD COLUMN IF NOT EXISTS "departmentId" TEXT;

ALTER TABLE "routines"
ADD COLUMN IF NOT EXISTS "institutionId" TEXT,
ADD COLUMN IF NOT EXISTS "departmentId" TEXT;

CREATE INDEX IF NOT EXISTS "schedules_institutionId_idx"
ON "schedules"("institutionId");

CREATE INDEX IF NOT EXISTS "schedules_departmentId_idx"
ON "schedules"("departmentId");

CREATE INDEX IF NOT EXISTS "routines_institutionId_idx"
ON "routines"("institutionId");

CREATE INDEX IF NOT EXISTS "routines_departmentId_idx"
ON "routines"("departmentId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'schedules_institutionId_fkey'
    ) THEN
        ALTER TABLE "schedules"
        ADD CONSTRAINT "schedules_institutionId_fkey"
        FOREIGN KEY ("institutionId") REFERENCES "institutions"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'schedules_departmentId_fkey'
    ) THEN
        ALTER TABLE "schedules"
        ADD CONSTRAINT "schedules_departmentId_fkey"
        FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'routines_institutionId_fkey'
    ) THEN
        ALTER TABLE "routines"
        ADD CONSTRAINT "routines_institutionId_fkey"
        FOREIGN KEY ("institutionId") REFERENCES "institutions"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'routines_departmentId_fkey'
    ) THEN
        ALTER TABLE "routines"
        ADD CONSTRAINT "routines_departmentId_fkey"
        FOREIGN KEY ("departmentId") REFERENCES "departments"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
