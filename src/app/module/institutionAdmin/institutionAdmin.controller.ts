import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { InstitutionAdminService } from "./institutionAdmin.service";

const readParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : (value ?? "");

const readQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
};

const createSubAdminAccount = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.createSubAdminAccount(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

const listFaculties = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.listFaculties(
    user.id,
    readQueryValue(req.query.search),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Faculties fetched successfully",
    data: result,
  });
});

const getDashboardSummary = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.getDashboardSummary(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Dashboard summary fetched successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.updateProfile(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const getSslCommerzCredential = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.getSslCommerzCredential(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "SSLCommerz credential settings fetched successfully",
    data: result,
  });
});

const upsertSslCommerzCredential = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.upsertSslCommerzCredential(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "SSLCommerz credential settings updated successfully",
    data: result,
  });
});

const initiateSubscriptionRenewal = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.initiateSubscriptionRenewal(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Subscription renewal payment initiated successfully",
    data: result,
  });
});

const handleRenewalPaymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const result = await InstitutionAdminService.handleSubscriptionRenewalPaymentCallback(
    "success",
    req.query as Record<string, unknown>,
  );

  res.redirect(result.redirectUrl);
});

const handleRenewalPaymentFail = catchAsync(async (req: Request, res: Response) => {
  const result = await InstitutionAdminService.handleSubscriptionRenewalPaymentCallback(
    "failed",
    req.query as Record<string, unknown>,
  );

  res.redirect(result.redirectUrl);
});

const handleRenewalPaymentCancel = catchAsync(async (req: Request, res: Response) => {
  const result = await InstitutionAdminService.handleSubscriptionRenewalPaymentCallback(
    "cancelled",
    req.query as Record<string, unknown>,
  );

  res.redirect(result.redirectUrl);
});

const listSemesters = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.listSemesters(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semesters fetched successfully",
    data: result,
  });
});

const createSemester = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.createSemester(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Semester created successfully",
    data: result,
  });
});

const updateSemester = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.updateSemester(
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

const deleteSemester = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.deleteSemester(
    user.id,
    readParam(req.params.semesterId),
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semester deleted successfully",
    data: result,
  });
});

export const InstitutionAdminController = {
  getDashboardSummary,
  updateProfile,
  getSslCommerzCredential,
  upsertSslCommerzCredential,
  initiateSubscriptionRenewal,
  handleRenewalPaymentSuccess,
  handleRenewalPaymentFail,
  handleRenewalPaymentCancel,
  createSubAdminAccount,
  listFaculties,
  listSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
};
