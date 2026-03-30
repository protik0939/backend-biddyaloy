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
  semesterParamsSchema: z.object({
    params: z.object({
      semesterId: z.uuid("Please provide a valid semester id"),
    }),
  }),

  createSemesterSchema: z.object({
    body: z.object({
      name: z.string("Semester name is required").trim().min(2).max(80),
      startDate: z.iso.datetime("startDate must be a valid ISO datetime"),
      endDate: z.iso.datetime("endDate must be a valid ISO datetime"),
    }),
  }),

  updateSemesterSchema: z.object({
    params: z.object({
      semesterId: z.uuid("Please provide a valid semester id"),
    }),
    body: z
      .object({
        name: z.string("Semester name must be a string").trim().min(2).max(80).optional(),
        startDate: z.iso.datetime("startDate must be a valid ISO datetime").optional(),
        endDate: z.iso.datetime("endDate must be a valid ISO datetime").optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  updateProfileSchema: z.object({
    body: z
      .object({
        name: z.string("name must be a string").trim().min(2).max(120).optional(),
        image: z.url("image must be a valid URL").trim().optional(),
        contactNo: z.string("contactNo must be a string").trim().max(30).optional(),
        presentAddress: z.string("presentAddress must be a string").trim().max(300).optional(),
        permanentAddress: z
          .string("permanentAddress must be a string")
          .trim()
          .max(300)
          .optional(),
        bloodGroup: z.string("bloodGroup must be a string").trim().max(10).optional(),
        gender: z.string("gender must be a string").trim().max(20).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  upsertSslCommerzCredentialSchema: z.object({
    body: z
      .object({
        storeId: z.string("storeId must be a string").trim().min(2).max(120).optional(),
        storePassword: z
          .string("storePassword must be a string")
          .trim()
          .min(4)
          .max(200)
          .optional(),
        baseUrl: z.url("baseUrl must be a valid URL").trim().max(400).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

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
