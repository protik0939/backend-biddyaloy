-- Make class slots semester-scoped and time-only.
ALTER TABLE "schedules"
ADD COLUMN IF NOT EXISTS "semesterId" TEXT;

ALTER TABLE "schedules"
ALTER COLUMN "startTime" TYPE TEXT
USING to_char("startTime", 'HH24:MI');

ALTER TABLE "schedules"
ALTER COLUMN "endTime" TYPE TEXT
USING to_char("endTime", 'HH24:MI');

DO $$
DECLARE
  semester_table text;
BEGIN
  IF to_regclass('public."semesters"') IS NOT NULL THEN
    semester_table := '"semesters"';
  ELSIF to_regclass('public."Semester"') IS NOT NULL THEN
    semester_table := '"Semester"';
  ELSE
    RAISE EXCEPTION 'Semester table not found (expected "semesters" or "Semester")';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'schedules_semesterId_fkey'
  ) THEN
    EXECUTE format(
      'ALTER TABLE "schedules" ADD CONSTRAINT "schedules_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES %s("id") ON DELETE SET NULL ON UPDATE CASCADE',
      semester_table
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "schedules_semesterId_idx" ON "schedules"("semesterId");
