-- Create teacher job posts table
CREATE TABLE "teacher_job_posts" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "location" TEXT,
  "summary" TEXT NOT NULL,
  "details" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "institutionId" TEXT NOT NULL,
  "facultyId" TEXT,
  "departmentId" TEXT,
  "programId" TEXT NOT NULL,
  "createdByUserId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "teacher_job_posts_pkey" PRIMARY KEY ("id")
);

-- Create student admission posts table
CREATE TABLE "student_admission_posts" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "location" TEXT,
  "summary" TEXT NOT NULL,
  "details" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "institutionId" TEXT NOT NULL,
  "facultyId" TEXT,
  "departmentId" TEXT,
  "programId" TEXT NOT NULL,
  "createdByUserId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "student_admission_posts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "teacher_job_posts_institutionId_idx" ON "teacher_job_posts"("institutionId");
CREATE INDEX "teacher_job_posts_facultyId_idx" ON "teacher_job_posts"("facultyId");
CREATE INDEX "teacher_job_posts_departmentId_idx" ON "teacher_job_posts"("departmentId");
CREATE INDEX "teacher_job_posts_programId_idx" ON "teacher_job_posts"("programId");
CREATE INDEX "teacher_job_posts_createdAt_idx" ON "teacher_job_posts"("createdAt");

CREATE INDEX "student_admission_posts_institutionId_idx" ON "student_admission_posts"("institutionId");
CREATE INDEX "student_admission_posts_facultyId_idx" ON "student_admission_posts"("facultyId");
CREATE INDEX "student_admission_posts_departmentId_idx" ON "student_admission_posts"("departmentId");
CREATE INDEX "student_admission_posts_programId_idx" ON "student_admission_posts"("programId");
CREATE INDEX "student_admission_posts_createdAt_idx" ON "student_admission_posts"("createdAt");
