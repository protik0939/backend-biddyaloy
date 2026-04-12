import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

type SessionUser = {
  id: string;
  role: string;
  accountStatus: string;
};

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

  const cookieMap = getCookieMap(req.headers.cookie);

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

export const requireSession = () => {
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
        console.log("[AUTH][BACKEND] requireSession invalid token", {
          path: req.path,
          method: req.method,
          cookieKeys,
          fallbackTokenPreview: fallbackToken ? `${fallbackToken.slice(0, 8)}...` : null,
          candidateSessionCookieKeys: cookieKeys.filter((cookieKey) =>
            SESSION_COOKIE_KEYS.includes(cookieKey) ||
            (cookieKey.toLowerCase().includes("better-auth") &&
              (cookieKey.toLowerCase().includes("session_token") ||
                cookieKey.toLowerCase().includes("session-token"))),
          ),
        });
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      req.authUser = user;
      res.locals.authUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
