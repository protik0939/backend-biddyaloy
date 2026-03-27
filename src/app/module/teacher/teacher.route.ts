import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { TeacherController } from "./teacher.controller";
import { TeacherValidation } from "./teacher.validation";

const router = Router();

router.get("/profile", requireSessionRole("TEACHER"), TeacherController.getProfileOverview);

router.patch(
  "/profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateProfileSchema),
  TeacherController.updateProfile,
);

router.get(
  "/application-profile",
  requireSessionRole("TEACHER"),
  TeacherController.getApplicationProfile,
);

router.post(
  "/application-profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createTeacherApplicationProfileSchema),
  TeacherController.createApplicationProfile,
);

router.patch(
  "/application-profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateTeacherApplicationProfileSchema),
  TeacherController.updateApplicationProfile,
);

router.delete(
  "/application-profile",
  requireSessionRole("TEACHER"),
  TeacherController.deleteApplicationProfile,
);

router.post(
  "/job-applications/:postingId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createJobApplicationSchema),
  TeacherController.applyToTeacherJobPosting,
);

router.get(
  "/job-applications",
  requireSessionRole("TEACHER"),
  TeacherController.listMyJobApplications,
);

router.get(
  "/sections",
  requireSessionRole("TEACHER"),
  TeacherController.listAssignedSectionsWithStudents,
);

router.get(
  "/classworks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.listClassworksSchema),
  TeacherController.listClassworks,
);

router.post(
  "/classworks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createClassworkSchema),
  TeacherController.createClasswork,
);

router.patch(
  "/classworks/:classworkId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateClassworkSchema),
  TeacherController.updateClasswork,
);

router.delete(
  "/classworks/:classworkId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.deleteClassworkSchema),
  TeacherController.deleteClasswork,
);

router.get(
  "/attendance",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.getSectionAttendanceSchema),
  TeacherController.getSectionAttendanceForDay,
);

router.post(
  "/attendance",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.upsertSectionAttendanceSchema),
  TeacherController.upsertSectionAttendanceForDay,
);

router.get(
  "/marks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.listSectionMarksSchema),
  TeacherController.listSectionMarks,
);

router.post(
  "/marks/:courseRegistrationId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.upsertMarkSchema),
  TeacherController.upsertSectionMark,
);

router.get(
  "/applications",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(TeacherValidation.listTeacherJobApplicationsSchema),
  TeacherController.listTeacherApplicationsForAdmin,
);

router.patch(
  "/applications/:applicationId/review",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(TeacherValidation.reviewTeacherJobApplicationSchema),
  TeacherController.reviewTeacherApplication,
);

export const TeacherRouter = router;
