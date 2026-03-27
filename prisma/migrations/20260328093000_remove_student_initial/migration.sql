-- Remove deprecated studentInitial from student profile records.
DROP INDEX IF EXISTS "student_profiles_studentInitial_key";

ALTER TABLE "student_profiles"
  DROP COLUMN IF EXISTS "studentInitial";
