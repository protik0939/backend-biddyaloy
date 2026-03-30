import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.registerUser(payload);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const getCurrentUserProfile = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await AuthService.getCurrentUserProfile(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Current user fetched successfully",
    data: result,
  });
});

const getAccessStatus = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string; role: string };

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Access status fetched successfully",
    data: {
      ok: true,
      userId: user.id,
      role: user.role,
    },
  });
});

const getOtpStatus = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.getAccountVerificationOtpStatus(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "OTP status fetched successfully",
    data: result,
  });
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.resendAccountVerificationOtp(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "OTP sent successfully",
    data: result,
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.verifyAccountOtp(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Account verified successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.requestPasswordReset(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Password reset request processed successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.resetPassword(payload);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const cookieHeader = req.headers.cookie;
  const result = await AuthService.changePassword(payload, cookieHeader);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const leaveInstitution = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string; role: string };
  const result = await AuthService.requestInstitutionLeave(user.id, user.role, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institution leave request submitted successfully",
    data: result,
  });
});

const listInstitutionLeaveRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.listInstitutionLeaveRequestsForSuperAdmin(req.query as any);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institution leave requests fetched successfully",
    data: result,
  });
});

const reviewInstitutionLeaveRequest = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const requestIdParam = req.params.requestId;
  const requestId = Array.isArray(requestIdParam) ? requestIdParam[0] : requestIdParam;

  const result = await AuthService.reviewInstitutionLeaveRequestBySuperAdmin(
    user.id,
    requestId,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institution leave request reviewed successfully",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  getAccessStatus,
  getCurrentUserProfile,
  getOtpStatus,
  resendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  changePassword,
  leaveInstitution,
  listInstitutionLeaveRequests,
  reviewInstitutionLeaveRequest,
};
