import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { InstitutionAdminController } from "./institutionAdmin.controller";
import { InstitutionAdminValidation } from "./institutionAdmin.validation";

const router = Router();

router.post(
  "/sub-admins",
  requireSessionRole("ADMIN"),
  validateRequest(InstitutionAdminValidation.createSubAdminSchema),
  InstitutionAdminController.createSubAdminAccount,
);

export const InstitutionAdminRouter = router;
