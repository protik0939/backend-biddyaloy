import { ApplyForInstitutionValidationSchema } from './../apply/apply.validation';
import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post("/register", validateRequest(AuthValidation.registerSchema), AuthController.registerUser);
router.post("/apply", validateRequest(ApplyForInstitutionValidationSchema.applyForInstitutionSchema));
router.post("/login", validateRequest(AuthValidation.loginSchema), AuthController.loginUser);
router.get(
	"/me",
	requireSessionRole("SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"),
	AuthController.getCurrentUserProfile,
);

export const AuthRoutes = router;