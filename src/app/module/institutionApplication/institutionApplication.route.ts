import { Router } from "express";
import { requireAdminRole, requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { InstitutionApplicationController } from "./institutionApplication.controller";
import { InstitutionApplicationValidation } from "./institutionApplication.validation";

const router = Router();

router.post(
  "/admin/apply",
  requireAdminRole(),
  validateRequest(InstitutionApplicationValidation.createSchema),
  InstitutionApplicationController.create,
);

router.get(
  "/admin/my-applications",
  requireAdminRole(),
  InstitutionApplicationController.myApplications,
);

router.get(
  "/superadmin",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.listForSuperAdmin,
);

router.get(
  "/superadmin-summary",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.getSuperAdminSummary,
);

router.patch(
  "/superadmin/:applicationId/review",
  requireSessionRole("SUPERADMIN"),
  validateRequest(InstitutionApplicationValidation.reviewSchema),
  InstitutionApplicationController.review,
);

export const InstitutionApplicationRouter = router;
