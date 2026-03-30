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
router.post(
	"/otp/status",
	validateRequest(AuthValidation.otpBaseSchema),
	AuthController.getOtpStatus,
);
router.post(
	"/otp/resend",
	validateRequest(AuthValidation.otpBaseSchema),
	AuthController.resendOtp,
);
router.post(
	"/otp/verify",
	validateRequest(AuthValidation.verifyOtpSchema),
	AuthController.verifyOtp,
);
router.post(
	"/password/forgot",
	validateRequest(AuthValidation.forgotPasswordSchema),
	AuthController.forgotPassword,
);
router.post(
	"/password/reset",
	validateRequest(AuthValidation.resetPasswordSchema),
	AuthController.resetPassword,
);
router.post(
	"/password/change",
	requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
	validateRequest(AuthValidation.changePasswordSchema),
	AuthController.changePassword,
);
router.get(
	"/me",
	requireSessionRole("SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"),
	AuthController.getCurrentUserProfile,
);

export const AuthRoutes = router;