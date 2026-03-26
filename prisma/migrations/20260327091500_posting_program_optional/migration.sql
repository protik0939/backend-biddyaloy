ALTER TABLE "teacher_job_posts"
ALTER COLUMN "programId" DROP NOT NULL;

ALTER TABLE "student_admission_posts"
ALTER COLUMN "programId" DROP NOT NULL;
