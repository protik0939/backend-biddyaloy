import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PostingService } from "./posting.service";

const readLimit = (value: unknown) => {
  let raw: string | undefined;
  if (Array.isArray(value)) {
    const first = value[0];
    raw = typeof first === "string" ? first : undefined;
  } else if (typeof value === "string") {
    raw = value;
  }

  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
};

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
};

const readParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

const createTeacherJobPost = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.createTeacherJobPost(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Teacher job post created successfully",
    data: result,
  });
});

const createStudentAdmissionPost = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.createStudentAdmissionPost(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Student admission post created successfully",
    data: result,
  });
});

const listTeacherJobPostsPublic = catchAsync(async (req: Request, res: Response) => {
  const limit = readLimit(req.query.limit);
  const result = await PostingService.listTeacherJobPostsPublic(limit);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher job posts fetched successfully",
    data: result,
  });
});

const listStudentAdmissionPostsPublic = catchAsync(async (req: Request, res: Response) => {
  const limit = readLimit(req.query.limit);
  const result = await PostingService.listStudentAdmissionPostsPublic(limit);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission posts fetched successfully",
    data: result,
  });
});

const getPostingOptions = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.getPostingOptions(user.id, readQueryValue(req.query.search));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Posting options fetched successfully",
    data: result,
  });
});

const listTeacherJobPostsManaged = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.listTeacherJobPostsManaged(user.id, readQueryValue(req.query.search));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Managed teacher job posts fetched successfully",
    data: result,
  });
});

const listStudentAdmissionPostsManaged = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.listStudentAdmissionPostsManaged(user.id, readQueryValue(req.query.search));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Managed student admission posts fetched successfully",
    data: result,
  });
});

const updateTeacherJobPost = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.updateTeacherJobPost(user.id, readParam(req.params.postingId), req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher job post updated successfully",
    data: result,
  });
});

const updateStudentAdmissionPost = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.updateStudentAdmissionPost(user.id, readParam(req.params.postingId), req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission post updated successfully",
    data: result,
  });
});

const deleteTeacherJobPost = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.deleteTeacherJobPost(user.id, readParam(req.params.postingId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher job post deleted successfully",
    data: result,
  });
});

const deleteStudentAdmissionPost = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await PostingService.deleteStudentAdmissionPost(user.id, readParam(req.params.postingId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission post deleted successfully",
    data: result,
  });
});

export const PostingController = {
  createTeacherJobPost,
  createStudentAdmissionPost,
  listTeacherJobPostsPublic,
  listStudentAdmissionPostsPublic,
  getPostingOptions,
  listTeacherJobPostsManaged,
  listStudentAdmissionPostsManaged,
  updateTeacherJobPost,
  updateStudentAdmissionPost,
  deleteTeacherJobPost,
  deleteStudentAdmissionPost,
};
