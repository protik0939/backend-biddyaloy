import { Request, Response } from "express";
import { TeacherClassworkType, TeacherJobApplicationStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TeacherService } from "./teacher.service";

const readParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

const getProfileOverview = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.getProfileOverview(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher profile fetched successfully",
    data: result,
  });
});

const getApplicationProfile = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.getApplicationProfile(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile fetched successfully",
    data: result,
  });
});

const createApplicationProfile = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.createApplicationProfile(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Application profile created successfully",
    data: result,
  });
});

const updateApplicationProfile = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.updateApplicationProfile(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile updated successfully",
    data: result,
  });
});

const deleteApplicationProfile = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.deleteApplicationProfile(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile deleted successfully",
    data: result,
  });
});

const applyToTeacherJobPosting = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.applyToTeacherJobPosting(
    user.id,
    readParam(req.params.postingId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Application submitted successfully",
    data: result,
  });
});

const listMyJobApplications = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.listMyJobApplications(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Applications fetched successfully",
    data: result,
  });
});

const listAssignedSectionsWithStudents = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.listAssignedSectionsWithStudents(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Sections fetched successfully",
    data: result,
  });
});

const listClassworks = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const sectionId = typeof req.query.sectionId === "string" ? req.query.sectionId : undefined;
  const type =
    typeof req.query.type === "string"
      ? (req.query.type as TeacherClassworkType)
      : undefined;

  const result = await TeacherService.listClassworks(user.id, {
    sectionId,
    type,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Classworks fetched successfully",
    data: result,
  });
});

const createClasswork = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.createClasswork(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Classwork created successfully",
    data: result,
  });
});

const updateClasswork = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.updateClasswork(
    user.id,
    readParam(req.params.classworkId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Classwork updated successfully",
    data: result,
  });
});

const deleteClasswork = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.deleteClasswork(user.id, readParam(req.params.classworkId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Classwork deleted successfully",
    data: result,
  });
});

const getSectionAttendanceForDay = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const sectionId = typeof req.query.sectionId === "string" ? req.query.sectionId : "";
  const date = typeof req.query.date === "string" ? req.query.date : "";
  const result = await TeacherService.getSectionAttendanceForDay(user.id, sectionId, date);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Attendance fetched successfully",
    data: result,
  });
});

const upsertSectionAttendanceForDay = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.upsertSectionAttendanceForDay(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Attendance submitted successfully",
    data: result,
  });
});

const listSectionMarks = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const sectionId = typeof req.query.sectionId === "string" ? req.query.sectionId : "";
  const result = await TeacherService.listSectionMarks(user.id, sectionId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Section marks fetched successfully",
    data: result,
  });
});

const upsertSectionMark = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.upsertSectionMark(
    user.id,
    readParam(req.params.courseRegistrationId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Marks updated successfully",
    data: result,
  });
});

const listTeacherApplicationsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const status =
    typeof req.query.status === "string"
      ? (req.query.status as TeacherJobApplicationStatus)
      : undefined;

  const result = await TeacherService.listTeacherApplicationsForAdmin(user.id, status);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher applications fetched successfully",
    data: result,
  });
});

const reviewTeacherApplication = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await TeacherService.reviewTeacherApplication(
    user.id,
    readParam(req.params.applicationId),
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher application reviewed successfully",
    data: result,
  });
});

export const TeacherController = {
  getProfileOverview,
  getApplicationProfile,
  createApplicationProfile,
  updateApplicationProfile,
  deleteApplicationProfile,
  applyToTeacherJobPosting,
  listMyJobApplications,
  listAssignedSectionsWithStudents,
  listClassworks,
  createClasswork,
  updateClasswork,
  deleteClasswork,
  getSectionAttendanceForDay,
  upsertSectionAttendanceForDay,
  listSectionMarks,
  upsertSectionMark,
  listTeacherApplicationsForAdmin,
  reviewTeacherApplication,
};
