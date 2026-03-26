import { z } from "zod";

export const FacultyProfileValidation = {
  createDepartmentSchema: z.object({
    body: z.object({
      fullName: z
        .string("Department full name is required")
        .trim()
        .min(2, "Department full name must be at least 2 characters long")
        .max(120, "Department full name must not exceed 120 characters"),
      shortName: z
        .string("Department short name must be a string")
        .trim()
        .min(2, "Department short name must be at least 2 characters long")
        .max(30, "Department short name must not exceed 30 characters")
        .optional(),
      description: z
        .string("Department description must be a string")
        .trim()
        .min(3, "Department description must be at least 3 characters long")
        .max(500, "Department description must not exceed 500 characters")
        .optional(),
      facultyId: z.uuid("Please provide a valid faculty id").optional(),
    }),
  }),

  updateFacultyDisplayNameSchema: z.object({
    body: z
      .object({
        name: z
          .string("Name is required")
          .trim()
          .min(2, "Name must be at least 2 characters long")
          .max(80, "Name must not exceed 80 characters")
          .regex(
            /^[a-zA-Z\s'-]+$/,
            "Name must only contain letters, spaces, hyphens or apostrophes",
          )
          .optional(),
        fullName: z
          .string("Full name is required")
          .trim()
          .min(2, "Full name must be at least 2 characters long")
          .max(80, "Full name must not exceed 80 characters")
          .regex(
            /^[a-zA-Z\s'-]+$/,
            "Full name must only contain letters, spaces, hyphens or apostrophes",
          )
          .optional(),
        facultyId: z.uuid("Please provide a valid faculty id").optional(),
        shortName: z
          .string("Short name must be a string")
          .trim()
          .min(2, "Short name must be at least 2 characters long")
          .max(30, "Short name must not exceed 30 characters")
          .optional(),
        description: z
          .string("Description must be a string")
          .trim()
          .min(3, "Description must be at least 3 characters long")
          .max(500, "Description must not exceed 500 characters")
          .optional(),
      })
      .refine((value) => Boolean(value.name || value.fullName), {
        message: "Either name or fullName is required",
        path: ["name"],
      }),
  }),
};
