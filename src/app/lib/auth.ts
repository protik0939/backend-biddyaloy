import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { AccountStatus } from "../../generated/prisma/enums";
import { buildTrustedOrigins } from "../shared/originPolicy";
import { sendEmail } from "../shared/email/sendEmail";
import { buildPasswordResetEmail } from "../shared/email/templates/passwordResetEmail";
// If your Prisma file is located elsewhere, you can change the path

const isProduction = process.env.NODE_ENV === "production";

function normalizeUrlCandidate(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/\/$/, "");
}

function isLocalhostUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function resolveAuthBaseUrl(): string | undefined {
  const candidates = [
    normalizeUrlCandidate(process.env.BACKEND_PUBLIC_URL),
    normalizeUrlCandidate(process.env.BETTER_AUTH_URL),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ].filter((value): value is string => Boolean(value));

  if (!isProduction) {
    return candidates[0];
  }

  const firstNonLocal = candidates.find((candidate) => !isLocalhostUrl(candidate));
  return firstNonLocal ?? candidates[0];
}

const resolvedBaseURL = resolveAuthBaseUrl();

const cookieAttributes = isProduction
  ? {
      sameSite: "none" as const,
      secure: true,
      httpOnly: true,
      path: "/",
    }
  : {
      sameSite: "lax" as const,
      secure: false,
      httpOnly: true,
      path: "/",
    };

  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

function getFrontendResetPasswordUrl(token: string): string | undefined {
  const frontendBase = process.env.FRONTEND_PUBLIC_URL;
  if (!frontendBase) {
    return undefined;
  }

  const normalized = frontendBase.endsWith("/")
    ? frontendBase.slice(0, -1)
    : frontendBase;

  return `${normalized}/reset-password?token=${encodeURIComponent(token)}`;
}

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
  baseURL: resolvedBaseURL,
  basePath: "/api/auth",
  trustedOrigins: buildTrustedOrigins(),
  useSecureCookies: isProduction,
  defaultCookieAttributes: cookieAttributes,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 30,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token }) => {
      const resetPasswordUrl = getFrontendResetPasswordUrl(token) ?? url;
      const message = buildPasswordResetEmail({
        resetPasswordUrl,
        validityMinutes: 30,
      });

      await sendEmail({
        to: user.email,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });
    },
  },
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      contactNo: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      presentAddress: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      permanentAddress: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      bloodGroup: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      gender: {
        type: "string",
        required: false,
        defaultValue: null,
      },
      accountStatus: {
        type: "string",
        required: true,
        defaultValue: AccountStatus.PENDING,
      },
      role: {
        type: "string",
        required: true,
      },
    },
  },
});
