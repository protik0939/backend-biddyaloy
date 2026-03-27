import { z } from "zod";

const uuidSchema = z.uuid("Please provide a valid id");

const classworkTypeSchema = z.enum(["TASK", "ASSIGNMENT", "QUIZ", "NOTICE"]);

const studentAcademicRecordSchema = z.object({
  examName: z.string("examName is required").trim().min(2).max(120),
  institute: z.string("institute is required").trim().min(2).max(180),
  result: z.string("result is required").trim().min(1).max(60),
  year: z.number("year must be a number").int().min(1950).max(2100),
});

const createStudentApplicationProfileSchema = z.object({
  body: z.object({
    headline: z.string("headline is required").trim().min(2).max(180),
    about: z.string("about is required").trim().min(20).max(5000),
    documentUrls: z.array(z.url("document URL must be valid").trim()).min(1),
    academicRecords: z.array(studentAcademicRecordSchema).min(1),
  }),
});

const updateStudentApplicationProfileSchema = z.object({
  body: z
    .object({
      headline: z.string("headline must be a string").trim().min(2).max(180).optional(),
      about: z.string("about must be a string").trim().min(20).max(5000).optional(),
      documentUrls: z.array(z.url("document URL must be valid").trim()).optional(),
      academicRecords: z.array(studentAcademicRecordSchema).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

const createAdmissionApplicationSchema = z.object({
  params: z.object({
    postingId: uuidSchema,
  }),
  body: z.object({
    coverLetter: z.string("coverLetter must be a string").trim().max(2500).optional(),
  }),
});

const listTimelineSchema = z.object({
  query: z.object({
    semesterId: uuidSchema.optional(),
    type: classworkTypeSchema.optional(),
  }),
});

const listRegisteredCoursesSchema = z.object({
  query: z.object({
    semesterId: uuidSchema.optional(),
  }),
});

const listResultsSchema = z.object({
  query: z.object({
    semesterId: uuidSchema,
  }),
});

const createSubmissionSchema = z.object({
  body: z
    .object({
      classworkId: uuidSchema,
      responseText: z
        .string("responseText must be a string")
        .trim()
        .max(5000, "responseText must be at most 5000 characters")
        .optional(),
      attachmentUrl: z
        .url("attachmentUrl must be a valid URL")
        .trim()
        .optional(),
      attachmentName: z
        .string("attachmentName must be a string")
        .trim()
        .max(200, "attachmentName must be at most 200 characters")
        .optional(),
    })
    .refine((value) => Boolean(value.responseText?.trim()) || Boolean(value.attachmentUrl?.trim()), {
      message: "responseText or attachmentUrl is required",
    }),
});

const updateSubmissionSchema = z.object({
  params: z.object({
    submissionId: uuidSchema,
  }),
  body: z
    .object({
      responseText: z
        .string("responseText must be a string")
        .trim()
        .max(5000, "responseText must be at most 5000 characters")
        .optional(),
      attachmentUrl: z
        .url("attachmentUrl must be a valid URL")
        .trim()
        .optional(),
      attachmentName: z
        .string("attachmentName must be a string")
        .trim()
        .max(200, "attachmentName must be at most 200 characters")
        .optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

const deleteSubmissionSchema = z.object({
  params: z.object({
    submissionId: uuidSchema,
  }),
});

const listSubmissionsSchema = z.object({
  query: z.object({
    classworkId: uuidSchema.optional(),
    semesterId: uuidSchema.optional(),
  }),
});

const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string("name must be a string").trim().min(2).max(120).optional(),
      image: z.url("image must be a valid URL").trim().optional(),
      bio: z.string("bio must be a string").trim().max(1200).optional(),
      contactNo: z.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z.string("gender must be a string").trim().max(20).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

export const StudentValidation = {
  createStudentApplicationProfileSchema,
  updateStudentApplicationProfileSchema,
  createAdmissionApplicationSchema,
  listTimelineSchema,
  listRegisteredCoursesSchema,
  listResultsSchema,
  createSubmissionSchema,
  updateSubmissionSchema,
  deleteSubmissionSchema,
  listSubmissionsSchema,
  updateProfileSchema,
};
