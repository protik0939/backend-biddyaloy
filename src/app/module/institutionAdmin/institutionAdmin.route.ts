import { Router } from "express";
import { requireAdminRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { InstitutionAdminController } from "./institutionAdmin.controller";
import { InstitutionAdminValidation } from "./institutionAdmin.validation";

const router = Router();

router.get(
  "/dashboard-summary",
  requireAdminRole(),
  InstitutionAdminController.getDashboardSummary,
);
router.patch(
  "/profile",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.updateProfileSchema),
  InstitutionAdminController.updateProfile,
);
router.get(
  "/payment-gateway/sslcommerz",
  requireAdminRole(),
  InstitutionAdminController.getSslCommerzCredential,
);
router.put(
  "/payment-gateway/sslcommerz",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.upsertSslCommerzCredentialSchema),
  InstitutionAdminController.upsertSslCommerzCredential,
);
router.post(
  "/subscription/renew/initiate",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.initiateSubscriptionRenewalSchema),
  InstitutionAdminController.initiateSubscriptionRenewal,
);
router.get(
  "/subscription/renew/payment/success",
  InstitutionAdminController.handleRenewalPaymentSuccess,
);
router.get(
  "/subscription/renew/payment/fail",
  InstitutionAdminController.handleRenewalPaymentFail,
);
router.get(
  "/subscription/renew/payment/cancel",
  InstitutionAdminController.handleRenewalPaymentCancel,
);
router.post(
  "/subscription/renew/payment/success",
  InstitutionAdminController.handleRenewalPaymentSuccess,
);
router.post(
  "/subscription/renew/payment/fail",
  InstitutionAdminController.handleRenewalPaymentFail,
);
router.post(
  "/subscription/renew/payment/cancel",
  InstitutionAdminController.handleRenewalPaymentCancel,
);
router.get("/faculties", requireAdminRole(), InstitutionAdminController.listFaculties);
router.get("/semesters", requireAdminRole(), InstitutionAdminController.listSemesters);
router.post(
  "/semesters",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.createSemesterSchema),
  InstitutionAdminController.createSemester,
);
router.patch(
  "/semesters/:semesterId",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.updateSemesterSchema),
  InstitutionAdminController.updateSemester,
);
router.delete(
  "/semesters/:semesterId",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.semesterParamsSchema),
  InstitutionAdminController.deleteSemester,
);

router.post(
  "/sub-admins",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.createSubAdminSchema),
  InstitutionAdminController.createSubAdminAccount,
);

export const InstitutionAdminRouter = router;
