import {
  AccountStatus,
  InstitutionTransferEntityType,
  InstitutionTransferStatus,
  SlotStatus,
} from "../../../generated/prisma/enums";
import { z } from "zod";

const uuidSchema = z.uuid("Please provide a valid id");
const timeStringSchema = z
  .string("Time must be a string")
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format");

const passwordSchema = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must not exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const DepartmentValidation = {
  setActiveDepartmentWorkspaceSchema: z.object({
    body: z.object({
      departmentId: uuidSchema,
    }),
  }),

  updateDepartmentProfileSchema: z.object({
    body: z
      .object({
        fullName: z.string("Full name must be a string").trim().min(2).max(120).optional(),
        shortName: z.string("Short name must be a string").trim().min(2).max(30).optional(),
        description: z.string("Description must be a string").trim().min(3).max(500).optional(),
        departmentId: uuidSchema.optional(),
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

  createSemesterSchema: z.object({
    body: z.object({
      name: z.string("Semester name is required").trim().min(2).max(80),
      startDate: z.iso.datetime("startDate must be a valid ISO datetime"),
      endDate: z.iso.datetime("endDate must be a valid ISO datetime"),
    }),
  }),

  createScheduleSchema: z.object({
    body: z.object({
      name: z.string("Class slot name is required").trim().min(2).max(120),
      description: z.string("Description must be a string").trim().max(500).optional(),
      semesterId: uuidSchema,
      startTime: timeStringSchema,
      endTime: timeStringSchema,
      status: z.enum(SlotStatus).optional(),
      departmentId: uuidSchema.optional(),
    }),
  }),

  updateScheduleSchema: z.object({
    params: z.object({
      scheduleId: uuidSchema,
    }),
    body: z
      .object({
        name: z.string("Class slot name must be a string").trim().min(2).max(120).optional(),
        description: z.string("Description must be a string").trim().max(500).optional(),
        semesterId: uuidSchema.optional(),
        startTime: timeStringSchema.optional(),
        endTime: timeStringSchema.optional(),
        status: z.enum(SlotStatus).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  deleteScheduleSchema: z.object({
    params: z.object({
      scheduleId: uuidSchema,
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

  createBatchSchema: z.object({
    body: z.object({
      name: z.string("Batch name is required").trim().min(1).max(80),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema.optional(),
    }),
  }),

  updateBatchSchema: z.object({
    params: z.object({
      batchId: uuidSchema,
    }),
    body: z
      .object({
        name: z.string("Batch name must be a string").trim().min(1).max(80).optional(),
        description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  deleteBatchSchema: z.object({
    params: z.object({
      batchId: uuidSchema,
    }),
  }),

  createSectionSchema: z.object({
    body: z.object({
      name: z.string("Section name is required").trim().min(1).max(80),
      semesterId: uuidSchema,
      batchId: uuidSchema,
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
        batchId: uuidSchema.optional(),
        sectionCapacity: z.number().int().positive().max(500).optional(),
        description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  deleteSectionSchema: z.object({
    params: z.object({
      sectionId: uuidSchema,
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
      sectionId: uuidSchema,
      programId: uuidSchema.optional(),
      semesterId: uuidSchema,
      departmentId: uuidSchema.optional(),
      registrationDate: z.iso.datetime("registrationDate must be a valid ISO datetime").optional(),
    }),
  }),

  updateCourseRegistrationSchema: z.object({
    params: z.object({
      courseRegistrationId: uuidSchema,
    }),
    body: z
      .object({
        courseId: uuidSchema.optional(),
        studentProfileId: uuidSchema.optional(),
        sectionId: uuidSchema.optional(),
        programId: uuidSchema.optional(),
        semesterId: uuidSchema.optional(),
        registrationDate: z.iso.datetime("registrationDate must be a valid ISO datetime").optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  deleteCourseRegistrationSchema: z.object({
    params: z.object({
      courseRegistrationId: uuidSchema,
    }),
  }),

  upsertSectionCourseTeacherAssignmentSchema: z.object({
    body: z.object({
      sectionId: uuidSchema,
      courseId: uuidSchema,
      teacherProfileId: uuidSchema,
      semesterId: uuidSchema,
      departmentId: uuidSchema.optional(),
    }),
  }),

  createRoutineSchema: z.object({
    body: z.object({
      name: z.string("Routine name is required").trim().min(2).max(120),
      description: z.string("Description must be a string").trim().max(500).optional(),
      version: z.string("Version must be a string").trim().max(80).optional(),
      scheduleId: uuidSchema,
      courseRegistrationId: uuidSchema,
      classRoomId: uuidSchema,
      departmentId: uuidSchema.optional(),
    }),
  }),

  updateRoutineSchema: z.object({
    params: z.object({
      routineId: uuidSchema,
    }),
    body: z
      .object({
        name: z.string("Routine name must be a string").trim().min(2).max(120).optional(),
        description: z.string("Description must be a string").trim().max(500).optional(),
        version: z.string("Version must be a string").trim().max(80).optional(),
        scheduleId: uuidSchema.optional(),
        courseRegistrationId: uuidSchema.optional(),
        classRoomId: uuidSchema.optional(),
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
      }),
  }),

  deleteRoutineSchema: z.object({
    params: z.object({
      routineId: uuidSchema,
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

  listStudentAdmissionApplicationsSchema: z.object({
    query: z.object({
      status: z.enum(["PENDING", "SHORTLISTED", "APPROVED", "REJECTED"]).optional(),
    }),
  }),

  reviewStudentAdmissionApplicationSchema: z.object({
    params: z.object({
      applicationId: uuidSchema,
    }),
    body: z
      .object({
        status: z.enum(["SHORTLISTED", "APPROVED", "REJECTED"]),
        responseMessage: z.string("responseMessage must be a string").trim().max(1200).optional(),
        rejectionReason: z.string("rejectionReason must be a string").trim().max(1200).optional(),
        studentsId: z.string("studentsId must be a string").trim().min(2).max(50).optional(),
        bio: z.string("bio must be a string").trim().max(1200).optional(),
      })
      .refine(
        (value) => value.status === "REJECTED" ? Boolean(value.rejectionReason?.trim()) : true,
        {
          path: ["rejectionReason"],
          message: "rejectionReason is required when rejecting",
        },
      )
      .refine(
        (value) => value.status === "APPROVED" ? Boolean(value.studentsId?.trim()) : true,
        {
          path: ["studentsId"],
          message: "studentsId is required when approving",
        },
      ),
  }),

  upsertFeeConfigurationSchema: z.object({
    body: z.object({
      semesterId: uuidSchema,
      totalFeeAmount: z.number().positive().max(100000000),
      monthlyFeeAmount: z.number().positive().max(100000000),
      currency: z.string().trim().min(3).max(10).optional(),
    }),
  }),

  listFeeConfigurationsSchema: z.object({
    query: z.object({
      semesterId: uuidSchema.optional(),
    }),
  }),

  getStudentPaymentInfoSchema: z.object({
    params: z.object({
      studentsId: z.string("studentsId must be a string").trim().min(2).max(50),
    }),
    query: z.object({
      semesterId: uuidSchema.optional(),
    }),
  }),

  removeTeacherSchema: z.object({
    params: z.object({
      teacherProfileId: uuidSchema,
    }),
  }),

  removeStudentSchema: z.object({
    params: z.object({
      studentProfileId: uuidSchema,
    }),
  }),

  createInstitutionTransferRequestSchema: z.object({
    body: z.object({
      entityType: z.enum(InstitutionTransferEntityType),
      profileId: uuidSchema,
      targetInstitutionId: uuidSchema,
      requestMessage: z.string("requestMessage must be a string").trim().max(1200).optional(),
    }),
  }),

  listInstitutionTransferRequestsSchema: z.object({
    query: z.object({
      status: z.enum(InstitutionTransferStatus).optional(),
      entityType: z.enum(InstitutionTransferEntityType).optional(),
    }),
  }),

  reviewInstitutionTransferRequestSchema: z.object({
    params: z.object({
      transferRequestId: uuidSchema,
    }),
    body: z.object({
      status: z.enum([InstitutionTransferStatus.ACCEPTED, InstitutionTransferStatus.REJECTED]),
      responseMessage: z.string("responseMessage must be a string").trim().max(1200).optional(),
      targetDepartmentId: uuidSchema.optional(),
    }),
  }),
};
