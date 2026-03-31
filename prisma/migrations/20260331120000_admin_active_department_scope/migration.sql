-- Add active department scope for admin workspace context switching
ALTER TABLE "admin_profiles"
ADD COLUMN "activeDepartmentId" TEXT;

CREATE INDEX "admin_profiles_activeDepartmentId_idx"
ON "admin_profiles"("activeDepartmentId");

ALTER TABLE "admin_profiles"
ADD CONSTRAINT "admin_profiles_activeDepartmentId_fkey"
FOREIGN KEY ("activeDepartmentId") REFERENCES "departments"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
