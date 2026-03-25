import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { AccountStatus, UserRole } from "../../generated/prisma/enums";
import { role } from "better-auth/plugins";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
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
