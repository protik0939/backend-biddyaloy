import { ApplyForInstitutionValidationSchema } from './../apply/apply.validation';
import { Router } from "express";
import { requireSession } from "../../middleware/requireSession";
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
router.post(
	"/leave-institution",
	requireSessionRole("TEACHER", "STUDENT"),
	validateRequest(AuthValidation.leaveInstitutionSchema),
	AuthController.leaveInstitution,
);
router.get(
	"/leave-institution/superadmin",
	requireSessionRole("SUPERADMIN"),
	validateRequest(AuthValidation.listInstitutionLeaveRequestsSchema),
	AuthController.listInstitutionLeaveRequests,
);
router.patch(
	"/leave-institution/superadmin/:requestId/review",
	requireSessionRole("SUPERADMIN"),
	validateRequest(AuthValidation.reviewInstitutionLeaveRequestSchema),
	AuthController.reviewInstitutionLeaveRequest,
);
router.get(
	"/access-status",
	requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
	AuthController.getAccessStatus,
);

router.get(
	"/me",
	requireSessionRole("SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"),
	AuthController.getCurrentUserProfile,
);

router.get(
	"/session-info",
	requireSession(),
	AuthController.getSessionInfo,
);

router.patch(
	"/select-role",
	requireSession(),
	validateRequest(AuthValidation.selectRoleSchema),
	AuthController.selectRole,
);

export const AuthRoutes = router;