import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { InstitutionAdminController } from "./institutionAdmin.controller";
import { InstitutionAdminValidation } from "./institutionAdmin.validation";

const router = Router();

router.get(
  "/dashboard-summary",
  requireSessionRole("ADMIN"),
  InstitutionAdminController.getDashboardSummary,
);
router.patch(
  "/profile",
  requireSessionRole("ADMIN"),
  validateRequest(InstitutionAdminValidation.updateProfileSchema),
  InstitutionAdminController.updateProfile,
);
router.get("/faculties", requireSessionRole("ADMIN"), InstitutionAdminController.listFaculties);
router.get("/semesters", requireSessionRole("ADMIN"), InstitutionAdminController.listSemesters);
router.post(
  "/semesters",
  requireSessionRole("ADMIN"),
  validateRequest(InstitutionAdminValidation.createSemesterSchema),
  InstitutionAdminController.createSemester,
);
router.patch(
  "/semesters/:semesterId",
  requireSessionRole("ADMIN"),
  validateRequest(InstitutionAdminValidation.updateSemesterSchema),
  InstitutionAdminController.updateSemester,
);
router.delete(
  "/semesters/:semesterId",
  requireSessionRole("ADMIN"),
  validateRequest(InstitutionAdminValidation.semesterParamsSchema),
  InstitutionAdminController.deleteSemester,
);

router.post(
  "/sub-admins",
  requireSessionRole("ADMIN"),
  validateRequest(InstitutionAdminValidation.createSubAdminSchema),
  InstitutionAdminController.createSubAdminAccount,
);

export const InstitutionAdminRouter = router;
