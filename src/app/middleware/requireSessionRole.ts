import { NextFunction, Request, Response } from "express";
import { AccountStatus } from "../../generated/prisma/enums";
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
  if (user.role !== "ADMIN") {
    return false;
  }

  const normalizedOriginalUrl = req.originalUrl?.split("?")[0] ?? "";
  const normalizedPath = req.path ?? "";
  const normalizedRoutePath = `${req.baseUrl ?? ""}${req.path ?? ""}`;

  return (
    normalizedOriginalUrl === "/api/v1/institution-admin/subscription/renew/initiate" ||
    normalizedPath === "/subscription/renew/initiate" ||
    normalizedRoutePath === "/api/v1/institution-admin/subscription/renew/initiate"
  );
}

const SESSION_COOKIE_KEYS = [
  "__Secure-better-auth.session_token",
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

  return undefined;
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
      const sessionToken = getSessionTokenFromRequest(req);
      if (!sessionToken) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await resolveUserFromSessionToken(sessionToken);
      if (!user) {
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
