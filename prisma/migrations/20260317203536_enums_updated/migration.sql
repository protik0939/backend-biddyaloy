/*
  Warnings:

  - The values [SUPERADMIN] on the enum `AdminRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [EXCUSED,LATE] on the enum `AttendanceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminRole_new" AS ENUM ('INSTITUTIONADMIN', 'DEPARTMENTADMIN', 'FACULTYADMIN');
ALTER TABLE "admin_profiles" ALTER COLUMN "role" TYPE "AdminRole_new" USING ("role"::text::"AdminRole_new");
ALTER TYPE "AdminRole" RENAME TO "AdminRole_old";
ALTER TYPE "AdminRole_new" RENAME TO "AdminRole";
DROP TYPE "public"."AdminRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "AttendanceStatus_new" AS ENUM ('PRESENT', 'ABSENT');
ALTER TABLE "attendances" ALTER COLUMN "status" TYPE "AttendanceStatus_new" USING ("status"::text::"AttendanceStatus_new");
ALTER TYPE "AttendanceStatus" RENAME TO "AttendanceStatus_old";
ALTER TYPE "AttendanceStatus_new" RENAME TO "AttendanceStatus";
DROP TYPE "public"."AttendanceStatus_old";
COMMIT;
