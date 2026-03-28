import { Request, Response } from "express";
import { TeacherClassworkType } from "../../../generated/prisma/enums";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StudentService } from "./student.service";

const readParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
};

const getProfileOverview = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.getProfileOverview(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile fetched successfully",
    data: result,
  });
});

const getApplicationProfile = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.getApplicationProfile(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile fetched successfully",
    data: result,
  });
});

const createApplicationProfile = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.createApplicationProfile(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Application profile created successfully",
    data: result,
  });
});

const updateApplicationProfile = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.updateApplicationProfile(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile updated successfully",
    data: result,
  });
});

const deleteApplicationProfile = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.deleteApplicationProfile(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile deleted successfully",
    data: result,
  });
});

const applyToAdmissionPosting = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.applyToAdmissionPosting(
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

const listMyAdmissionApplications = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.listMyAdmissionApplications(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Admission applications fetched successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.updateProfile(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile updated successfully",
    data: result,
  });
});

const listTimeline = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : undefined;
  const type = typeof req.query.type === "string" ? (req.query.type as TeacherClassworkType) : undefined;
  const search = readQueryValue(req.query.search);

  const result = await StudentService.listTimeline(user.id, {
    semesterId,
    type,
    search,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student timeline fetched successfully",
    data: result,
  });
});

const listRegisteredCourses = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : undefined;
  const search = readQueryValue(req.query.search);

  const result = await StudentService.listRegisteredCourses(user.id, {
    semesterId,
    search,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Registered courses fetched successfully",
    data: result,
  });
});

const listResults = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : "";

  const result = await StudentService.listResults(user.id, { semesterId });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student results fetched successfully",
    data: result,
  });
});

const listSubmissions = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const classworkId = typeof req.query.classworkId === "string" ? req.query.classworkId : undefined;
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : undefined;
  const search = readQueryValue(req.query.search);

  const result = await StudentService.listSubmissions(user.id, {
    classworkId,
    semesterId,
    search,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Submissions fetched successfully",
    data: result,
  });
});

const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.createSubmission(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Submission created successfully",
    data: result,
  });
});

const updateSubmission = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.updateSubmission(user.id, readParam(req.params.submissionId), req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Submission updated successfully",
    data: result,
  });
});

const deleteSubmission = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await StudentService.deleteSubmission(user.id, readParam(req.params.submissionId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Submission deleted successfully",
    data: result,
  });
});

const getFeePlaceholder = catchAsync(async (_req: Request, res: Response) => {
  const result = await StudentService.getFeePlaceholder();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Fee module status fetched successfully",
    data: result,
  });
});

export const StudentController = {
  getProfileOverview,
  getApplicationProfile,
  createApplicationProfile,
  updateApplicationProfile,
  deleteApplicationProfile,
  applyToAdmissionPosting,
  listMyAdmissionApplications,
  updateProfile,
  listTimeline,
  listRegisteredCourses,
  listResults,
  listSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getFeePlaceholder,
};
