import { NextFunction, Request, Response } from "express";
import { AccountStatus } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

type AuthUserRole = "SUPERADMIN" | "ADMIN" | "FACULTY" | "DEPARTMENT" | "TEACHER" | "STUDENT";

type SessionUser = {
  id: string;
  role: string;
  accountStatus: string;
};

async function resolveInstitutionIdForUser(user: SessionUser): Promise<string | null> {
  if (user.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        institutionId: true,
      },
    });

    return adminProfile?.institutionId ?? null;
  }

  if (user.role === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        institutionId: true,
      },
    });

    return teacherProfile?.institutionId ?? null;
  }

  if (user.role === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        institutionId: true,
      },
    });

    return studentProfile?.institutionId ?? null;
  }

  return null;
}

async function hasActiveInstitutionSubscription(institutionId: string): Promise<boolean> {
  const activeSubscription = await (prisma as any).institutionSubscription.findFirst({
    where: {
      institutionId,
      status: "ACTIVE",
      endsAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(activeSubscription?.id);
}

function canBypassSubscriptionExpiry(user: SessionUser, req: Request) {
  const normalizedOriginalUrl = req.originalUrl?.split("?")[0] ?? "";
  const normalizedPath = req.path ?? "";
  const normalizedRoutePath = `${req.baseUrl ?? ""}${req.path ?? ""}`;

  const isRenewInitiateRoute =
    normalizedOriginalUrl === "/api/v1/institution-admin/subscription/renew/initiate" ||
    normalizedPath === "/subscription/renew/initiate" ||
    normalizedRoutePath === "/api/v1/institution-admin/subscription/renew/initiate";

  if (user.role === "ADMIN" && isRenewInitiateRoute) {
    return true;
  }

  const canRequestLeave = user.role === "TEACHER" || user.role === "STUDENT";
  const isLeaveRoute =
    normalizedOriginalUrl === "/api/v1/auth/leave-institution" ||
    normalizedPath === "/leave-institution" ||
    normalizedRoutePath === "/api/v1/auth/leave-institution";

  if (canRequestLeave && isLeaveRoute) {
    return true;
  }

  return false;
}

const SESSION_COOKIE_KEYS = [
  "__Secure-better-auth.session_token",
  "__Secure-better-auth.session-token",
  "__Host-better-auth.session_token",
  "__Host-better-auth.session-token",
  "better-auth.session_token",
  "better-auth.session-token",
  "session_token",
  "auth_token",
];

function getCookieMap(cookieHeader: string | undefined): Map<string, string> {
  const cookieMap = new Map<string, string>();
  if (!cookieHeader) {
    return cookieMap;
  }

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawKey, ...rawValueParts] = part.trim().split("=");
    if (!rawKey) {
      continue;
    }

    const value = rawValueParts.join("=");
    cookieMap.set(rawKey, decodeURIComponent(value ?? ""));
  }

  return cookieMap;
}

function getSessionTokenFromRequest(req: Request): string | undefined {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader?.toLowerCase().startsWith("bearer ")) {
    const bearerToken = authorizationHeader.slice("bearer ".length).trim();
    if (bearerToken) {
      return bearerToken;
    }
  }

  const cookieHeader = req.headers.cookie;
  const cookieMap = getCookieMap(cookieHeader);

  for (const key of SESSION_COOKIE_KEYS) {
    const token = cookieMap.get(key);
    if (token) {
      return token;
    }
  }

  for (const [key, value] of cookieMap.entries()) {
    const normalizedKey = key.toLowerCase();
    const looksLikeBetterAuthSession =
      normalizedKey.includes("better-auth") &&
      (normalizedKey.includes("session_token") || normalizedKey.includes("session-token"));

    if (looksLikeBetterAuthSession && value) {
      return value;
    }
  }

  return undefined;
}

function toHeaders(req: Request): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        headers.append(key, entry);
      }
      continue;
    }

    if (typeof value === "string") {
      headers.set(key, value);
    }
  }

  return headers;
}

async function resolveUserFromRequest(req: Request): Promise<SessionUser | null> {
  const sessionData = await auth.api.getSession({
    headers: toHeaders(req),
    query: {
      disableCookieCache: true,
    },
  });

  const userId = sessionData?.user?.id;
  if (!userId) {
    return null;
  }

  const userRecord = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
      accountStatus: true,
    },
  });

  if (!userRecord) {
    return null;
  }

  return {
    id: userRecord.id,
    role: userRecord.role,
    accountStatus: userRecord.accountStatus,
  };
}

async function resolveUserFromSessionToken(sessionToken: string): Promise<SessionUser | null> {
  const session = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          role: true,
          accountStatus: true,
        },
      },
    },
  });

  if (!session?.user) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return {
    id: session.user.id,
    role: session.user.role,
    accountStatus: session.user.accountStatus,
  };
}

export const requireSessionRole = (...roles: AuthUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let user = await resolveUserFromRequest(req);

      if (!user) {
        const fallbackToken = getSessionTokenFromRequest(req);
        if (fallbackToken) {
          user = await resolveUserFromSessionToken(fallbackToken);
        }
      }

      if (!user) {
        const cookieKeys = Array.from(getCookieMap(req.headers.cookie).keys());
        const fallbackToken = getSessionTokenFromRequest(req);
        console.log("[AUTH][BACKEND] requireSessionRole missing token", {
          path: req.path,
          method: req.method,
          cookieKeys,
          candidateTokenPreview: fallbackToken?.slice(0, 8) ?? null,
        });
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!roles.includes(user.role as AuthUserRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: insufficient role",
        });
      }

      if (user.accountStatus === AccountStatus.PENDING) {
        return res.status(403).json({
          success: false,
          message: "Account verification is required",
        });
      }

      if (user.role !== "SUPERADMIN") {
        if (canBypassSubscriptionExpiry(user, req)) {
          req.authUser = user;
          res.locals.authUser = user;
          next();
          return;
        }

        const institutionId = await resolveInstitutionIdForUser(user);
        if (institutionId) {
          const hasActiveSubscription = await hasActiveInstitutionSubscription(institutionId);
          if (!hasActiveSubscription) {
            return res.status(402).json({
              success: false,
              code: "INSTITUTION_SUBSCRIPTION_EXPIRED",
              message:
                "This portal subscription has expired for your institution. Please contact your institution admin.",
            });
          }
        }
      }

      req.authUser = user;
      res.locals.authUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdminRole = () => requireSessionRole("ADMIN");
