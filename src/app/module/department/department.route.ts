import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { DepartmentController } from "./department.controller";
import { DepartmentValidation } from "./department.validation";

const router = Router();
const departmentRoles: ["ADMIN", "FACULTY", "DEPARTMENT"] = ["ADMIN", "FACULTY", "DEPARTMENT"];

router.get("/profile", requireSessionRole(...departmentRoles), DepartmentController.getDepartmentProfile);
router.get(
  "/dashboard-summary",
  requireSessionRole(...departmentRoles),
  DepartmentController.getDashboardSummary,
);
router.patch(
  "/profile",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateDepartmentProfileSchema),
  DepartmentController.updateDepartmentProfile,
);

router.get("/semesters", requireSessionRole(...departmentRoles), DepartmentController.listSemesters);
router.post(
  "/semesters",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createSemesterSchema),
  DepartmentController.createSemester,
);
router.get("/schedules", requireSessionRole(...departmentRoles), DepartmentController.listSchedules);
router.post(
  "/schedules",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createScheduleSchema),
  DepartmentController.createSchedule,
);
router.patch(
  "/schedules/:scheduleId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateScheduleSchema),
  DepartmentController.updateSchedule,
);
router.delete(
  "/schedules/:scheduleId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteScheduleSchema),
  DepartmentController.deleteSchedule,
);
router.patch(
  "/semesters/:semesterId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateSemesterSchema),
  DepartmentController.updateSemester,
);

router.get("/batches", requireSessionRole(...departmentRoles), DepartmentController.listBatches);
router.post(
  "/batches",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createBatchSchema),
  DepartmentController.createBatch,
);
router.patch(
  "/batches/:batchId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateBatchSchema),
  DepartmentController.updateBatch,
);
router.delete(
  "/batches/:batchId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteBatchSchema),
  DepartmentController.deleteBatch,
);

router.get("/sections", requireSessionRole(...departmentRoles), DepartmentController.listSections);
router.post(
  "/sections",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createSectionSchema),
  DepartmentController.createSection,
);
router.patch(
  "/sections/:sectionId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateSectionSchema),
  DepartmentController.updateSection,
);
router.delete(
  "/sections/:sectionId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteSectionSchema),
  DepartmentController.deleteSection,
);

router.get("/programs", requireSessionRole(...departmentRoles), DepartmentController.listPrograms);
router.post(
  "/programs",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createProgramSchema),
  DepartmentController.createProgram,
);
router.patch(
  "/programs/:programId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateProgramSchema),
  DepartmentController.updateProgram,
);

router.get("/courses", requireSessionRole(...departmentRoles), DepartmentController.listCourses);
router.post(
  "/courses",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createCourseSchema),
  DepartmentController.createCourse,
);
router.patch(
  "/courses/:courseId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateCourseSchema),
  DepartmentController.updateCourse,
);
router.delete(
  "/courses/:courseId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteCourseSchema),
  DepartmentController.deleteCourse,
);

router.get(
  "/course-registrations",
  requireSessionRole(...departmentRoles),
  DepartmentController.listCourseRegistrations,
);
router.get(
  "/course-teacher-assignments",
  requireSessionRole(...departmentRoles),
  DepartmentController.listSectionCourseTeacherAssignments,
);
router.post(
  "/course-teacher-assignments",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.upsertSectionCourseTeacherAssignmentSchema),
  DepartmentController.upsertSectionCourseTeacherAssignment,
);
router.post(
  "/course-registrations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createCourseRegistrationSchema),
  DepartmentController.createCourseRegistration,
);
router.get("/routines", requireSessionRole(...departmentRoles), DepartmentController.listRoutines);
router.post(
  "/routines",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createRoutineSchema),
  DepartmentController.createRoutine,
);
router.patch(
  "/routines/:routineId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateRoutineSchema),
  DepartmentController.updateRoutine,
);
router.delete(
  "/routines/:routineId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteRoutineSchema),
  DepartmentController.deleteRoutine,
);
router.patch(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateCourseRegistrationSchema),
  DepartmentController.updateCourseRegistration,
);
router.delete(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteCourseRegistrationSchema),
  DepartmentController.deleteCourseRegistration,
);

router.get("/teachers", requireSessionRole(...departmentRoles), DepartmentController.listTeachers);
router.post(
  "/teachers",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createTeacherSchema),
  DepartmentController.createTeacher,
);
router.patch(
  "/teachers/:teacherProfileId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateTeacherSchema),
  DepartmentController.updateTeacher,
);
router.delete(
  "/teachers/:teacherProfileId/remove",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.removeTeacherSchema),
  DepartmentController.removeTeacher,
);

router.get("/students", requireSessionRole(...departmentRoles), DepartmentController.listStudents);
router.post(
  "/students",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createStudentSchema),
  DepartmentController.createStudent,
);
router.patch(
  "/students/:studentProfileId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateStudentSchema),
  DepartmentController.updateStudent,
);
router.delete(
  "/students/:studentProfileId/remove",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.removeStudentSchema),
  DepartmentController.removeStudent,
);

router.get(
  "/student-applications",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listStudentAdmissionApplicationsSchema),
  DepartmentController.listStudentAdmissionApplications,
);

router.patch(
  "/student-applications/:applicationId/review",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.reviewStudentAdmissionApplicationSchema),
  DepartmentController.reviewStudentAdmissionApplication,
);

router.get(
  "/fees/configurations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listFeeConfigurationsSchema),
  DepartmentController.listFeeConfigurations,
);

router.post(
  "/fees/configurations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.upsertFeeConfigurationSchema),
  DepartmentController.upsertFeeConfiguration,
);

router.get(
  "/fees/students/:studentsId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.getStudentPaymentInfoSchema),
  DepartmentController.getStudentPaymentInfoByStudentId,
);

router.post(
  "/transfers",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createInstitutionTransferRequestSchema),
  DepartmentController.createInstitutionTransferRequest,
);

router.get(
  "/transfers/outgoing",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listInstitutionTransferRequestsSchema),
  DepartmentController.listOutgoingInstitutionTransferRequests,
);

router.get(
  "/transfers/incoming",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listInstitutionTransferRequestsSchema),
  DepartmentController.listIncomingInstitutionTransferRequests,
);

router.patch(
  "/transfers/:transferRequestId/review",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.reviewInstitutionTransferRequestSchema),
  DepartmentController.reviewInstitutionTransferRequest,
);

export const DepartmentRouter = router;
