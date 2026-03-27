import { z } from "zod";

const uuidSchema = z.uuid("Please provide a valid id");

const classworkTypeSchema = z.enum(["TASK", "ASSIGNMENT", "QUIZ", "NOTICE"]);

const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT"]);

const markFieldSchema = z
  .number("Mark must be a number")
  .min(0, "Mark cannot be negative")
  .max(100, "Mark cannot exceed 100");

const createJobApplicationSchema = z.object({
  params: z.object({
    postingId: uuidSchema,
  }),
  body: z.object({
    coverLetter: z
      .string("Cover letter must be a string")
      .trim()
      .min(10, "Cover letter must be at least 10 characters")
      .max(2500, "Cover letter must not exceed 2500 characters")
      .optional(),
  }),
});

const academicRecordSchema = z.object({
  degree: z.string("degree is required").trim().min(2).max(120),
  institute: z.string("institute is required").trim().min(2).max(180),
  result: z.string("result is required").trim().min(1).max(60),
  year: z.number("year must be a number").int().min(1950).max(2100),
});

const experienceRecordSchema = z.object({
  organization: z.string("organization is required").trim().min(2).max(180),
  title: z.string("title is required").trim().min(2).max(120),
  startDate: z.iso.datetime("startDate must be a valid ISO datetime"),
  endDate: z.iso.datetime("endDate must be a valid ISO datetime").optional(),
  responsibilities: z.string("responsibilities must be a string").trim().max(2000).optional(),
});

const createTeacherApplicationProfileSchema = z.object({
  body: z.object({
    headline: z.string("headline is required").trim().min(2).max(180),
    about: z.string("about is required").trim().min(20).max(5000),
    resumeUrl: z.url("resumeUrl must be a valid URL").trim(),
    portfolioUrl: z.url("portfolioUrl must be a valid URL").trim().optional(),
    skills: z
      .array(z.string("skill must be a string").trim().min(1).max(60))
      .min(1, "At least one skill is required"),
    certifications: z
      .array(z.string("certification must be a string").trim().min(1).max(120))
      .optional(),
    academicRecords: z.array(academicRecordSchema).min(1, "At least one academic record is required"),
    experiences: z.array(experienceRecordSchema).min(1, "At least one experience record is required"),
  }),
});

const updateTeacherApplicationProfileSchema = z.object({
  body: z
    .object({
      headline: z.string("headline must be a string").trim().min(2).max(180).optional(),
      about: z.string("about must be a string").trim().min(20).max(5000).optional(),
      resumeUrl: z.url("resumeUrl must be a valid URL").trim().optional(),
      portfolioUrl: z.url("portfolioUrl must be a valid URL").trim().optional(),
      skills: z.array(z.string("skill must be a string").trim().min(1).max(60)).optional(),
      certifications: z
        .array(z.string("certification must be a string").trim().min(1).max(120))
        .optional(),
      academicRecords: z.array(academicRecordSchema).optional(),
      experiences: z.array(experienceRecordSchema).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string("name must be a string").trim().min(2).max(120).optional(),
      image: z.url("image must be a valid URL").trim().optional(),
      bio: z.string("bio must be a string").trim().max(1200).optional(),
      designation: z.string("designation must be a string").trim().min(2).max(80).optional(),
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

const listClassworksSchema = z.object({
  query: z.object({
    sectionId: uuidSchema.optional(),
    type: classworkTypeSchema.optional(),
  }),
});

const createClassworkSchema = z.object({
  body: z.object({
    sectionId: uuidSchema,
    type: classworkTypeSchema,
    title: z.string("Title is required").trim().min(2).max(180),
    content: z
      .string("Content must be a string")
      .trim()
      .max(3000, "Content must not exceed 3000 characters")
      .optional(),
    dueAt: z.iso.datetime("dueAt must be a valid ISO datetime").optional(),
  }),
});

const updateClassworkSchema = z.object({
  params: z.object({
    classworkId: uuidSchema,
  }),
  body: z
    .object({
      type: classworkTypeSchema.optional(),
      title: z.string("Title must be a string").trim().min(2).max(180).optional(),
      content: z
        .string("Content must be a string")
        .trim()
        .max(3000, "Content must not exceed 3000 characters")
        .optional(),
      dueAt: z.iso.datetime("dueAt must be a valid ISO datetime").optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

const deleteClassworkSchema = z.object({
  params: z.object({
    classworkId: uuidSchema,
  }),
});

const getSectionAttendanceSchema = z.object({
  query: z.object({
    sectionId: uuidSchema,
    date: z.iso.datetime("date must be a valid ISO datetime"),
  }),
});

const upsertSectionAttendanceSchema = z.object({
  body: z.object({
    sectionId: uuidSchema,
    date: z.iso.datetime("date must be a valid ISO datetime"),
    items: z
      .array(
        z.object({
          courseRegistrationId: uuidSchema,
          status: attendanceStatusSchema,
        }),
      )
      .min(1, "At least one attendance item is required"),
  }),
});

const listSectionMarksSchema = z.object({
  query: z.object({
    sectionId: uuidSchema,
  }),
});

const upsertMarkSchema = z.object({
  params: z.object({
    courseRegistrationId: uuidSchema,
  }),
  body: z
    .object({
      labReport: markFieldSchema.optional(),
      labTask: markFieldSchema.optional(),
      project: markFieldSchema.optional(),
      projectReport: markFieldSchema.optional(),
      presentation: markFieldSchema.optional(),
      labEvaluation: markFieldSchema.optional(),
      viva: markFieldSchema.optional(),
      quiz1: markFieldSchema.optional(),
      quiz2: markFieldSchema.optional(),
      quiz3: markFieldSchema.optional(),
      assignment: markFieldSchema.optional(),
      midterm: markFieldSchema.optional(),
      finalExam: markFieldSchema.optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one marks field is required",
    }),
});

const listTeacherJobApplicationsSchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "SHORTLISTED", "APPROVED", "REJECTED"]).optional(),
  }),
});

const reviewTeacherJobApplicationSchema = z.object({
  params: z.object({
    applicationId: uuidSchema,
  }),
  body: z
    .object({
      status: z.enum(["SHORTLISTED", "APPROVED", "REJECTED"]),
      responseMessage: z.string("responseMessage must be a string").trim().max(1200).optional(),
      rejectionReason: z.string("rejectionReason must be a string").trim().max(1200).optional(),
      teacherInitial: z
        .string("teacherInitial must be a string")
        .trim()
        .min(2)
        .max(15)
        .optional(),
      teachersId: z.string("teachersId must be a string").trim().min(2).max(30).optional(),
      designation: z.string("designation must be a string").trim().min(2).max(80).optional(),
      bio: z.string("bio must be a string").trim().max(1200).optional(),
      departmentId: uuidSchema.optional(),
    })
    .refine(
      (value) => value.status === "REJECTED" ? Boolean(value.rejectionReason?.trim()) : true,
      {
        path: ["rejectionReason"],
        message: "rejectionReason is required when rejecting",
      },
    )
    .refine(
      (value) => value.status === "APPROVED" ? Boolean(value.teacherInitial?.trim()) : true,
      {
        path: ["teacherInitial"],
        message: "teacherInitial is required when approving",
      },
    )
    .refine(
      (value) => value.status === "APPROVED" ? Boolean(value.teachersId?.trim()) : true,
      {
        path: ["teachersId"],
        message: "teachersId is required when approving",
      },
    )
    .refine(
      (value) => value.status === "APPROVED" ? Boolean(value.designation?.trim()) : true,
      {
        path: ["designation"],
        message: "designation is required when approving",
      },
    ),
});

export const TeacherValidation = {
  createTeacherApplicationProfileSchema,
  updateTeacherApplicationProfileSchema,
  updateProfileSchema,
  createJobApplicationSchema,
  listClassworksSchema,
  createClassworkSchema,
  updateClassworkSchema,
  deleteClassworkSchema,
  getSectionAttendanceSchema,
  upsertSectionAttendanceSchema,
  listSectionMarksSchema,
  upsertMarkSchema,
  listTeacherJobApplicationsSchema,
  reviewTeacherJobApplicationSchema,
};
