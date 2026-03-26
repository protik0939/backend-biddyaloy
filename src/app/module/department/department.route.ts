import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { DepartmentController } from "./department.controller";
import { DepartmentValidation } from "./department.validation";

const router = Router();

router.get("/profile", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.getDepartmentProfile);
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

export const DepartmentRouter = router;
