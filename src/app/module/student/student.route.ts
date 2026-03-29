import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { StudentController } from "./student.controller";
import { StudentValidation } from "./student.validation";

const router = Router();

router.get("/profile", requireSessionRole("STUDENT"), StudentController.getProfileOverview);

router.get(
  "/application-profile",
  requireSessionRole("STUDENT"),
  StudentController.getApplicationProfile,
);

router.post(
  "/application-profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createStudentApplicationProfileSchema),
  StudentController.createApplicationProfile,
);

router.patch(
  "/application-profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateStudentApplicationProfileSchema),
  StudentController.updateApplicationProfile,
);

router.delete(
  "/application-profile",
  requireSessionRole("STUDENT"),
  StudentController.deleteApplicationProfile,
);

router.post(
  "/admission-applications/:postingId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createAdmissionApplicationSchema),
  StudentController.applyToAdmissionPosting,
);

router.get(
  "/admission-applications",
  requireSessionRole("STUDENT"),
  StudentController.listMyAdmissionApplications,
);

router.patch(
  "/profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateProfileSchema),
  StudentController.updateProfile,
);

router.get(
  "/timeline",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listTimelineSchema),
  StudentController.listTimeline,
);

router.get(
  "/registered-courses",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listRegisteredCoursesSchema),
  StudentController.listRegisteredCourses,
);

router.get(
  "/results",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listResultsSchema),
  StudentController.listResults,
);

router.get(
  "/submissions",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listSubmissionsSchema),
  StudentController.listSubmissions,
);

router.post(
  "/submissions",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createSubmissionSchema),
  StudentController.createSubmission,
);

router.patch(
  "/submissions/:submissionId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateSubmissionSchema),
  StudentController.updateSubmission,
);

router.delete(
  "/submissions/:submissionId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.deleteSubmissionSchema),
  StudentController.deleteSubmission,
);

router.get("/fees/payment/success", StudentController.handleFeePaymentSuccessRedirect);
router.get("/fees/payment/fail", StudentController.handleFeePaymentFailureRedirect);
router.get("/fees/payment/cancel", StudentController.handleFeePaymentCancelRedirect);
router.post("/fees/payment/success", StudentController.handleFeePaymentSuccessRedirect);
router.post("/fees/payment/fail", StudentController.handleFeePaymentFailureRedirect);
router.post("/fees/payment/cancel", StudentController.handleFeePaymentCancelRedirect);

router.get("/fees", requireSessionRole("STUDENT"), StudentController.getFeeOverview);
router.post(
  "/fees/initiate",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.initiateFeePaymentSchema),
  StudentController.initiateFeePayment,
);

export const StudentRouter = router;
