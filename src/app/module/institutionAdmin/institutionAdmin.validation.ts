import { z } from "zod";

const passwordSchema = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must not exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const InstitutionAdminValidation = {
  createSubAdminSchema: z.object({
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
      email: z.email("Please provide a valid email address").toLowerCase().trim(),
      password: passwordSchema,
      accountType: z.enum(["FACULTY", "DEPARTMENT"]),
    }),
  }),
};
