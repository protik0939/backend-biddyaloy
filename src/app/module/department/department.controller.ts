import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DepartmentService } from "./department.service";

const readParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
};

const getDepartmentProfile = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.getDepartmentProfile(
    user.id,
    req.query.departmentId as string | undefined,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department profile fetched successfully",
    data: result,
  });
});

const getDashboardSummary = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.getDashboardSummary(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department dashboard summary fetched successfully",
    data: result,
  });
});

const updateDepartmentProfile = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateDepartmentProfile(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department profile updated successfully",
    data: result,
  });
});

const listSemesters = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listSemesters(user.id, readQueryValue(req.query.search));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semesters fetched successfully",
    data: result,
  });
});

const createSemester = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.createSemester(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Semester created successfully",
    data: result,
  });
});

const updateSemester = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateSemester(
    user.id,
    readParam(req.params.semesterId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semester updated successfully",
    data: result,
  });
});

const listBatches = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listBatches(
    user.id,
    req.query.departmentId as string | undefined,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Batches fetched successfully",
    data: result,
  });
});

const createBatch = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.createBatch(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Batch created successfully",
    data: result,
  });
});

const updateBatch = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateBatch(user.id, readParam(req.params.batchId), req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Batch updated successfully",
    data: result,
  });
});

const deleteBatch = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.deleteBatch(user.id, readParam(req.params.batchId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Batch deleted successfully",
    data: result,
  });
});

const listSections = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listSections(
    user.id,
    req.query.departmentId as string | undefined,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Sections fetched successfully",
    data: result,
  });
});

const createSection = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.createSection(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Section created successfully",
    data: result,
  });
});

const updateSection = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateSection(
    user.id,
    readParam(req.params.sectionId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Section updated successfully",
    data: result,
  });
});

const deleteSection = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.deleteSection(user.id, readParam(req.params.sectionId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Section deleted successfully",
    data: result,
  });
});

const listPrograms = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listPrograms(
    user.id,
    req.query.departmentId as string | undefined,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Programs fetched successfully",
    data: result,
  });
});

const createProgram = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.createProgram(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Program created successfully",
    data: result,
  });
});

const updateProgram = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateProgram(
    user.id,
    readParam(req.params.programId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Program updated successfully",
    data: result,
  });
});

const listCourses = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listCourses(
    user.id,
    req.query.departmentId as string | undefined,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Courses fetched successfully",
    data: result,
  });
});

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.createCourse(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateCourse(
    user.id,
    readParam(req.params.courseId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.deleteCourse(user.id, readParam(req.params.courseId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

const listCourseRegistrations = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listCourseRegistrations(
    user.id,
    req.query.departmentId as string | undefined,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course registrations fetched successfully",
    data: result,
  });
});

const listSectionCourseTeacherAssignments = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listSectionCourseTeacherAssignments(
    user.id,
    req.query.departmentId as string | undefined,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course teacher assignments fetched successfully",
    data: result,
  });
});

const upsertSectionCourseTeacherAssignment = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.upsertSectionCourseTeacherAssignment(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course teacher assignment saved successfully",
    data: result,
  });
});

const createCourseRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.createCourseRegistration(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Course registration created successfully",
    data: result,
  });
});

const updateCourseRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateCourseRegistration(
    user.id,
    readParam(req.params.courseRegistrationId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course registration updated successfully",
    data: result,
  });
});

const deleteCourseRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.deleteCourseRegistration(
    user.id,
    readParam(req.params.courseRegistrationId),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course registration deleted successfully",
    data: result,
  });
});

const listTeachers = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listTeachers(
    user.id,
    req.query.departmentId as string | undefined,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teachers fetched successfully",
    data: result,
  });
});

const createTeacher = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.createTeacher(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Teacher created successfully",
    data: result,
  });
});

const updateTeacher = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateTeacher(
    user.id,
    readParam(req.params.teacherProfileId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher updated successfully",
    data: result,
  });
});

const listStudents = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listStudents(
    user.id,
    req.query.departmentId as string | undefined,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Students fetched successfully",
    data: result,
  });
});

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.createStudent(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.updateStudent(
    user.id,
    readParam(req.params.studentProfileId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

const listStudentAdmissionApplications = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.listStudentAdmissionApplications(
    user.id,
    req.query.status as "PENDING" | "SHORTLISTED" | "APPROVED" | "REJECTED" | undefined,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission applications fetched successfully",
    data: result,
  });
});

const reviewStudentAdmissionApplication = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.reviewStudentAdmissionApplication(
    user.id,
    readParam(req.params.applicationId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission application reviewed successfully",
    data: result,
  });
});

const listFeeConfigurations = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : undefined;
  const result = await DepartmentService.listFeeConfigurations(user.id, { semesterId });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department fee configurations fetched successfully",
    data: result,
  });
});

const upsertFeeConfiguration = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await DepartmentService.upsertFeeConfiguration(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department fee configuration saved successfully",
    data: result,
  });
});

const getStudentPaymentInfoByStudentId = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : undefined;
  const result = await DepartmentService.getStudentPaymentInfoByStudentId(
    user.id,
    readParam(req.params.studentsId),
    semesterId,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student payment info fetched successfully",
    data: result,
  });
});

export const DepartmentController = {
  getDepartmentProfile,
  getDashboardSummary,
  updateDepartmentProfile,
  listSemesters,
  createSemester,
  updateSemester,
  listBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  listSections,
  createSection,
  updateSection,
  deleteSection,
  listPrograms,
  createProgram,
  updateProgram,
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  listCourseRegistrations,
  listSectionCourseTeacherAssignments,
  upsertSectionCourseTeacherAssignment,
  createCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration,
  listTeachers,
  createTeacher,
  updateTeacher,
  listStudents,
  createStudent,
  updateStudent,
  listStudentAdmissionApplications,
  reviewStudentAdmissionApplication,
  listFeeConfigurations,
  upsertFeeConfiguration,
  getStudentPaymentInfoByStudentId,
};
