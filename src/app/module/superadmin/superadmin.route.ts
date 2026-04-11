import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { SuperAdminController } from "./superadmin.controller";

const router = Router();

router.get(
  "/admins",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listAdmins,
);

router.get(
  "/institutions",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listInstitutions,
);

router.get(
  "/students",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listStudents,
);

router.get(
  "/teachers",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listTeachers,
);

router.get(
  "/recent-highlights",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listRecentHighlights,
);

export const SuperAdminRouter = router;
