ALTER TABLE "teacher_profiles"
  ALTER COLUMN "institutionId" DROP NOT NULL;

ALTER TABLE "student_profiles"
  ALTER COLUMN "institutionId" DROP NOT NULL;
