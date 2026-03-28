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

export const PostingController = {
  createTeacherJobPost,
  createStudentAdmissionPost,
  listTeacherJobPostsPublic,
  listStudentAdmissionPostsPublic,
  getPostingOptions,
};
