import { Router } from "express";
import { ApplyController } from "./apply.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { ApplyForInstitutionValidationSchema } from "./apply.validation";

const router = Router();

router.post("/institution", validateRequest(ApplyForInstitutionValidationSchema.applyForInstitutionSchema), ApplyController.applyForInstitution);

export const ApplyRoutes = router;