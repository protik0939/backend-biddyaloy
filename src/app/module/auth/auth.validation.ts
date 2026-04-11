import { z } from "zod";
import { AdminRole, UserRole } from "../../../generated/prisma/enums";

const passwordSchema = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must not exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

const emailSchema = z
  .email("Please provide a valid email address")
  .toLowerCase()
  .trim();

const registerSchema = z.object({
  body: z.object({
    name: z
      .string("Name is required")
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(60, "Name must not exceed 60 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name must only contain letters, spaces, hyphens or apostrophes",
      ),
    email: emailSchema,
    password: passwordSchema,
    role: z
      .enum([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.SUPERADMIN], {
        message: `Invalid role. Must be one of: ${UserRole.SUPERADMIN}, ${UserRole.ADMIN}, ${UserRole.TEACHER}, ${UserRole.STUDENT}`,
      })
      .optional(),
    adminRole: z
      .enum([AdminRole.DEPARTMENTADMIN, AdminRole.INSTITUTIONADMIN, AdminRole.FACULTYADMIN], {
        message: `Invalid admin role. Must be one of: ${AdminRole.DEPARTMENTADMIN}, ${AdminRole.INSTITUTIONADMIN}, ${AdminRole.FACULTYADMIN}`,
      })
      .optional(),
    institutionId: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string("Password is required").min(1, "Password is required"),
  }),
});

const otpBaseSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: emailSchema,
    otp: z
      .string("OTP is required")
      .trim()
      .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  }),
});

const changePasswordSchema = z
  .object({
    body: z.object({
      currentPassword: z
        .string("Current password is required")
        .min(1, "Current password is required"),
      newPassword: passwordSchema,
      confirmNewPassword: z
        .string("Please confirm your new password")
        .min(1, "Please confirm your new password"),
    }),
  })
  .refine((data) => data.body.newPassword === data.body.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["body", "confirmNewPassword"],
  })
  .refine((data) => data.body.currentPassword !== data.body.newPassword, {
    message: "New password must be different from the current password",
    path: ["body", "newPassword"],
  });

const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

const resetPasswordSchema = z
  .object({
    body: z.object({
      token: z
        .string("Reset token is required")
        .min(1, "Reset token is required"),
      newPassword: passwordSchema,
      confirmNewPassword: z
        .string("Please confirm your new password")
        .min(1, "Please confirm your new password"),
    }),
  })
  .refine((data) => data.body.newPassword === data.body.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["body", "confirmNewPassword"],
  });

const verifyEmailSchema = z.object({
  body: z.object({
    token: z
      .string("Verification token is required")
      .min(1, "Verification token is required"),
  }),
});

const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string("Refresh token is required")
      .min(1, "Refresh token is required"),
  }),
});

const leaveInstitutionSchema = z.object({
  body: z.object({
    reason: z.string("reason must be a string").trim().max(300).optional(),
  }),
});

const listInstitutionLeaveRequestsSchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  }),
});

const reviewInstitutionLeaveRequestSchema = z.object({
  params: z.object({
    requestId: z.uuid("Please provide a valid leave request id"),
  }),
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
  }),
});

const selectRoleSchema = z.object({
  body: z.object({
    role: z.enum([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT], {
      message: `Invalid role. Must be one of: ${UserRole.ADMIN}, ${UserRole.TEACHER}, ${UserRole.STUDENT}`,
    }),
  }),
});

export const AuthValidation = {
  registerSchema,
  loginSchema,
  otpBaseSchema,
  verifyOtpSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  leaveInstitutionSchema,
  listInstitutionLeaveRequestsSchema,
  reviewInstitutionLeaveRequestSchema,
  selectRoleSchema,
  verifyEmailSchema,
  refreshTokenSchema,
};
