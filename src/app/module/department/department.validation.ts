import { AccountStatus } from "../../../generated/prisma/enums";
import { z } from "zod";

const uuidSchema = z.uuid("Please provide a valid id");

const passwordSchema = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must not exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const DepartmentValidation = {
  updateDepartmentProfileSchema: z.object({
    body: z.object({
      fullName: z.string("Full name is required").trim().min(2).max(120),
      shortName: z.string("Short name must be a string").trim().min(2).max(30).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema.optional(),
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
      semesterId: uuidSchema,
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

  createSectionSchema: z.object({
    body: z.object({
      name: z.string("Section name is required").trim().min(1).max(80),
      semesterId: uuidSchema,
      sectionCapacity: z.number().int().positive().max(500).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema.optional(),
    }),
  }),

  updateSectionSchema: z.object({
    params: z.object({
      sectionId: uuidSchema,
    }),
    body: z
      .object({
        name: z.string("Section name must be a string").trim().min(1).max(80).optional(),
        semesterId: uuidSchema.optional(),
        sectionCapacity: z.number().int().positive().max(500).optional(),
        description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  createProgramSchema: z.object({
    body: z.object({
      title: z.string("Program title is required").trim().min(2).max(120),
      shortTitle: z.string("Short title must be a string").trim().min(2).max(30).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z.number().positive().max(500).optional(),
      cost: z.number().nonnegative().max(100000000).optional(),
      departmentId: uuidSchema.optional(),
    }),
  }),

  updateProgramSchema: z.object({
    params: z.object({
      programId: uuidSchema,
    }),
    body: z
      .object({
        title: z.string("Program title must be a string").trim().min(2).max(120).optional(),
        shortTitle: z.string("Short title must be a string").trim().min(2).max(30).optional(),
        description: z.string("Description must be a string").trim().min(3).max(500).optional(),
        credits: z.number().positive().max(500).optional(),
        cost: z.number().nonnegative().max(100000000).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  createCourseSchema: z.object({
    body: z.object({
      courseCode: z.string("Course code is required").trim().min(2).max(30),
      courseTitle: z.string("Course title is required").trim().min(2).max(120),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z.number().int().positive().max(500).optional(),
      programId: uuidSchema.optional(),
    }),
  }),

  updateCourseSchema: z.object({
    params: z.object({
      courseId: uuidSchema,
    }),
    body: z
      .object({
        courseCode: z.string("Course code must be a string").trim().min(2).max(30).optional(),
        courseTitle: z.string("Course title must be a string").trim().min(2).max(120).optional(),
        description: z.string("Description must be a string").trim().min(3).max(500).optional(),
        credits: z.number().int().positive().max(500).optional(),
        programId: uuidSchema.optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  deleteCourseSchema: z.object({
    params: z.object({
      courseId: uuidSchema,
    }),
  }),

  createCourseRegistrationSchema: z.object({
    body: z.object({
      courseId: uuidSchema,
      studentProfileId: uuidSchema,
      teacherProfileId: uuidSchema,
      sectionId: uuidSchema,
      programId: uuidSchema.optional(),
      semesterId: uuidSchema,
      departmentId: uuidSchema.optional(),
      registrationDate: z.iso.datetime("registrationDate must be a valid ISO datetime").optional(),
    }),
  }),

  createTeacherSchema: z.object({
    body: z.object({
      name: z.string("Name is required").trim().min(2).max(60),
      email: z.email("Please provide a valid email").toLowerCase().trim(),
      password: passwordSchema,
      teacherInitial: z.string("Teacher initial is required").trim().min(2).max(20),
      teachersId: z.string("Teacher id is required").trim().min(2).max(50),
      designation: z.string("Designation is required").trim().min(2).max(80),
      bio: z.string("Bio must be a string").trim().max(500).optional(),
      departmentId: uuidSchema.optional(),
    }),
  }),

  updateTeacherSchema: z.object({
    params: z.object({
      teacherProfileId: uuidSchema,
    }),
    body: z
      .object({
        designation: z.string("Designation must be a string").trim().min(2).max(80).optional(),
        bio: z.string("Bio must be a string").trim().max(500).optional(),
        accountStatus: z.enum(AccountStatus).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  createStudentSchema: z.object({
    body: z.object({
      name: z.string("Name is required").trim().min(2).max(60),
      email: z.email("Please provide a valid email").toLowerCase().trim(),
      password: passwordSchema,
      studentInitial: z.string("Student initial is required").trim().min(2).max(20),
      studentsId: z.string("Student id is required").trim().min(2).max(50),
      bio: z.string("Bio must be a string").trim().max(500).optional(),
      departmentId: uuidSchema.optional(),
    }),
  }),

  updateStudentSchema: z.object({
    params: z.object({
      studentProfileId: uuidSchema,
    }),
    body: z
      .object({
        bio: z.string("Bio must be a string").trim().max(500).optional(),
        accountStatus: z.enum(AccountStatus).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),
};
