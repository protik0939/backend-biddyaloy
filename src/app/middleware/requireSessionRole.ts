import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

type AuthUserRole = "SUPERADMIN" | "ADMIN" | "FACULTY" | "DEPARTMENT" | "TEACHER" | "STUDENT";

type SessionUser = {
  id: string;
  role: string;
};

const SESSION_COOKIE_KEYS = [
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
        },
      },
    },
  });

  if (!session || !session.user) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return {
    id: session.user.id,
    role: session.user.role,
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
          message: "Forbidden",
        });
      }

      res.locals.authUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
