-- AlterTable
ALTER TABLE "Course"
ADD COLUMN "departmentId" TEXT;

-- Backfill departmentId from existing program relation
UPDATE "Course" c
SET "departmentId" = p."departmentId"
FROM "programs" p
WHERE c."programId" = p."id"
  AND c."departmentId" IS NULL;

-- Enforce department scope and optional program linkage
ALTER TABLE "Course"
ALTER COLUMN "departmentId" SET NOT NULL,
ALTER COLUMN "programId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Course"
ADD CONSTRAINT "Course_departmentId_fkey"
FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
