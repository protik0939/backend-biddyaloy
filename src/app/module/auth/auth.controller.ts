import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";

const SESSION_COOKIE_KEYS = [
  "__Secure-better-auth.session_token",
  "better-auth.session_token",
  "better-auth.session-token",
  "session_token",
  "auth_token",
];

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";

function getCookieMap(cookieHeader: string | undefined): Map<string, string> {
  const cookieMap = new Map<string, string>();
  if (!cookieHeader) {
    return cookieMap;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rawValueParts] = part.trim().split("=");
    if (!rawKey) {
      continue;
    }

    const rawValue = rawValueParts.join("=");
    try {
      cookieMap.set(rawKey, decodeURIComponent(rawValue ?? ""));
    } catch {
      cookieMap.set(rawKey, rawValue ?? "");
    }
  }

  return cookieMap;
}

function resolveSessionToken(req: Request): string | undefined {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader?.toLowerCase().startsWith("bearer ")) {
    const bearerToken = authorizationHeader.slice("bearer ".length).trim();
    if (bearerToken) {
      return bearerToken;
    }
  }

  const cookieMap = getCookieMap(req.headers.cookie);
  for (const key of SESSION_COOKIE_KEYS) {
    const token = cookieMap.get(key);
    if (token) {
      return token;
    }
  }

  return undefined;
}

function setAuthMirrorCookies(req: Request, res: Response, role: string | null | undefined) {
  const sessionToken = resolveSessionToken(req);
  const normalizedRole = role?.toUpperCase() || "UNAUTHENTICATED";
  const incomingCookieKeys = Array.from(getCookieMap(req.headers.cookie).keys());

  if (sessionToken) {
    res.cookie("auth_token", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: COOKIE_MAX_AGE_MS,
    });
  }

  res.cookie("user_role", normalizedRole, {
    httpOnly: false,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: COOKIE_MAX_AGE_MS,
  });

  console.log("[AUTH][BACKEND] mirror cookies set", {
    path: req.path,
    method: req.method,
    hasSessionToken: Boolean(sessionToken),
    role: normalizedRole,
    incomingCookieKeys,
  });
}

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

const getSessionInfo = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await AuthService.getSessionInfo(user.id);

  setAuthMirrorCookies(req, res, result.role);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Session info fetched successfully",
    data: result,
  });
});

const selectRole = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await AuthService.selectRole(user.id, req.body);

  setAuthMirrorCookies(req, res, result.role);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Role selected successfully",
    data: result,
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
  getSessionInfo,
  selectRole,
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
