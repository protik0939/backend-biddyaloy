DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type t
    WHERE t.typname = 'TeacherJobApplicationStatus'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'TeacherJobApplicationStatus'
        AND e.enumlabel = 'SHORTLISTED'
    ) THEN
      ALTER TYPE "TeacherJobApplicationStatus" ADD VALUE 'SHORTLISTED';
    END IF;
  END IF;
END $$;
