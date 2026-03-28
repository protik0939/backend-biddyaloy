import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { AccountStatus } from "../../generated/prisma/enums";
import { buildTrustedOrigins } from "../shared/originPolicy";
// If your Prisma file is located elsewhere, you can change the path

const isProduction = process.env.NODE_ENV === "production";

const resolvedBaseURL =
  process.env.BACKEND_PUBLIC_URL ??
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

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

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
  baseURL: resolvedBaseURL,
  trustedOrigins: buildTrustedOrigins(),
  useSecureCookies: isProduction,
  defaultCookieAttributes: cookieAttributes,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
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
