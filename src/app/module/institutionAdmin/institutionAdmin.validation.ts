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
      facultyId: z.uuid("Please provide a valid faculty id").optional(),
      facultyFullName: z
        .string("Faculty full name must be a string")
        .trim()
        .min(2, "Faculty full name must be at least 2 characters long")
        .max(120, "Faculty full name must not exceed 120 characters")
        .optional(),
      facultyShortName: z
        .string("Faculty short name must be a string")
        .trim()
        .min(2, "Faculty short name must be at least 2 characters long")
        .max(30, "Faculty short name must not exceed 30 characters")
        .optional(),
      facultyDescription: z
        .string("Faculty description must be a string")
        .trim()
        .min(3, "Faculty description must be at least 3 characters long")
        .max(500, "Faculty description must not exceed 500 characters")
        .optional(),
      departmentFullName: z
        .string("Department full name must be a string")
        .trim()
        .min(2, "Department full name must be at least 2 characters long")
        .max(120, "Department full name must not exceed 120 characters")
        .optional(),
      departmentShortName: z
        .string("Department short name must be a string")
        .trim()
        .min(2, "Department short name must be at least 2 characters long")
        .max(30, "Department short name must not exceed 30 characters")
        .optional(),
      departmentDescription: z
        .string("Department description must be a string")
        .trim()
        .min(3, "Department description must be at least 3 characters long")
        .max(500, "Department description must not exceed 500 characters")
        .optional(),
    }),
  }),
};
