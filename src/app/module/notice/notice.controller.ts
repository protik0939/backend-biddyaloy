import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { NoticeService } from "./notice.service";

const readParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
};

const listNotices = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await NoticeService.listNotices(user.id, {
    search: readQueryValue(req.query.search),
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notices fetched successfully",
    data: result,
  });
});

const getUnreadCount = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await NoticeService.getUnreadCount(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Unread notice count fetched successfully",
    data: result,
  });
});

const createNotice = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await NoticeService.createNotice(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Notice created successfully",
    data: result,
  });
});

const updateNotice = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await NoticeService.updateNotice(user.id, readParam(req.params.noticeId), req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notice updated successfully",
    data: result,
  });
});

const deleteNotice = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await NoticeService.deleteNotice(user.id, readParam(req.params.noticeId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notice deleted successfully",
    data: result,
  });
});

const markNoticeAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await NoticeService.markNoticeAsRead(user.id, readParam(req.params.noticeId));

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notice marked as read",
    data: result,
  });
});

const markAllNoticesAsRead = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await NoticeService.markAllNoticesAsRead(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notices marked as read",
    data: result,
  });
});

export const NoticeController = {
  listNotices,
  getUnreadCount,
  createNotice,
  updateNotice,
  deleteNotice,
  markNoticeAsRead,
  markAllNoticesAsRead,
};
