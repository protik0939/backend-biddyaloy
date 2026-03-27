import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { DepartmentController } from "./department.controller";
import { DepartmentValidation } from "./department.validation";

const router = Router();

router.get("/profile", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.getDepartmentProfile);
router.get(
  "/dashboard-summary",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  DepartmentController.getDashboardSummary,
);
router.patch(
  "/profile",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateDepartmentProfileSchema),
  DepartmentController.updateDepartmentProfile,
);

router.get("/semesters", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listSemesters);
router.post(
  "/semesters",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createSemesterSchema),
  DepartmentController.createSemester,
);
router.patch(
  "/semesters/:semesterId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateSemesterSchema),
  DepartmentController.updateSemester,
);

router.get("/batches", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listBatches);
router.post(
  "/batches",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createBatchSchema),
  DepartmentController.createBatch,
);
router.patch(
  "/batches/:batchId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateBatchSchema),
  DepartmentController.updateBatch,
);
router.delete(
  "/batches/:batchId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.deleteBatchSchema),
  DepartmentController.deleteBatch,
);

router.get("/sections", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listSections);
router.post(
  "/sections",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createSectionSchema),
  DepartmentController.createSection,
);
router.patch(
  "/sections/:sectionId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateSectionSchema),
  DepartmentController.updateSection,
);
router.delete(
  "/sections/:sectionId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.deleteSectionSchema),
  DepartmentController.deleteSection,
);

router.get("/programs", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listPrograms);
router.post(
  "/programs",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createProgramSchema),
  DepartmentController.createProgram,
);
router.patch(
  "/programs/:programId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateProgramSchema),
  DepartmentController.updateProgram,
);

router.get("/courses", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listCourses);
router.post(
  "/courses",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createCourseSchema),
  DepartmentController.createCourse,
);
router.patch(
  "/courses/:courseId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateCourseSchema),
  DepartmentController.updateCourse,
);
router.delete(
  "/courses/:courseId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.deleteCourseSchema),
  DepartmentController.deleteCourse,
);

router.get(
  "/course-registrations",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  DepartmentController.listCourseRegistrations,
);
router.get(
  "/course-teacher-assignments",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  DepartmentController.listSectionCourseTeacherAssignments,
);
router.post(
  "/course-teacher-assignments",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.upsertSectionCourseTeacherAssignmentSchema),
  DepartmentController.upsertSectionCourseTeacherAssignment,
);
router.post(
  "/course-registrations",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createCourseRegistrationSchema),
  DepartmentController.createCourseRegistration,
);
router.patch(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateCourseRegistrationSchema),
  DepartmentController.updateCourseRegistration,
);
router.delete(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.deleteCourseRegistrationSchema),
  DepartmentController.deleteCourseRegistration,
);

router.get("/teachers", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listTeachers);
router.post(
  "/teachers",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createTeacherSchema),
  DepartmentController.createTeacher,
);
router.patch(
  "/teachers/:teacherProfileId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateTeacherSchema),
  DepartmentController.updateTeacher,
);

router.get("/students", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listStudents);
router.post(
  "/students",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createStudentSchema),
  DepartmentController.createStudent,
);
router.patch(
  "/students/:studentProfileId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateStudentSchema),
  DepartmentController.updateStudent,
);

router.get(
  "/student-applications",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.listStudentAdmissionApplicationsSchema),
  DepartmentController.listStudentAdmissionApplications,
);

router.patch(
  "/student-applications/:applicationId/review",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.reviewStudentAdmissionApplicationSchema),
  DepartmentController.reviewStudentAdmissionApplication,
);

export const DepartmentRouter = router;
