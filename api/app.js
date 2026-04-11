var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/app/middleware/globalErrorHandler.ts
import { ZodError } from "zod";
var globalErrorHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors = [];
  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }));
  } else if (error instanceof Error) {
    const statusFromError = error.statusCode;
    if (typeof statusFromError === "number") {
      statusCode = statusFromError;
    }
    message = error.message;
  }
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

// src/app/middleware/notFound.ts
var notFound = (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
};

// src/app/routes/index.ts
import { Router as Router16 } from "express";

// src/app/module/ai/ai.route.ts
import { Router } from "express";

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse({
      body: req.body,
      cookies: req.cookies,
      params: req.params,
      query: req.query
    });
    if (!parsedResult.success) {
      return next(parsedResult.error);
    }
    req.body = parsedResult.data.body;
    next();
  };
};

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/ai/ai.service.ts
function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function extractTextContent(content) {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    const collected = content.map((item) => {
      if (!item || typeof item !== "object") {
        return "";
      }
      const maybeText = item.text;
      return typeof maybeText === "string" ? maybeText : "";
    }).filter(Boolean);
    return collected.join("\n");
  }
  return "";
}
function extractJsonPayload(text) {
  const fencedRegex = /```json\s*([\s\S]*?)\s*```/i;
  const fencedMatch = fencedRegex.exec(text);
  const source = fencedMatch?.[1] ?? text;
  const firstCurly = source.indexOf("{");
  const lastCurly = source.lastIndexOf("}");
  if (firstCurly < 0 || lastCurly <= firstCurly) {
    return null;
  }
  const candidate = source.slice(firstCurly, lastCurly + 1);
  try {
    const parsed = JSON.parse(candidate);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function uniqueById(items) {
  const seen = /* @__PURE__ */ new Set();
  const ordered = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      ordered.push(item);
    }
  }
  return ordered;
}
var recommendPostings = async (payload) => {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw createHttpError(500, "OPENROUTER_API_KEY is not configured");
  }
  const model = process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini";
  const limitedPostings = uniqueById(payload.postings).slice(0, 40);
  const systemPrompt = [
    "You are an educational placement assistant.",
    "Analyze the provided postings and return strict JSON only.",
    'JSON shape: { "summary": string, "recommendedPostingIds": string[], "tips": string[] }',
    "Recommendations must reference valid posting IDs from the input.",
    "Keep summary concise (max 120 words) and tips practical (3-5 items)."
  ].join(" ");
  const userPrompt = JSON.stringify(
    {
      mode: payload.mode,
      userQuery: payload.query,
      postings: limitedPostings
    },
    null,
    2
  );
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...process.env.OPENROUTER_APP_URL ? { "HTTP-Referer": process.env.OPENROUTER_APP_URL } : {},
      ...process.env.OPENROUTER_APP_NAME ? { "X-Title": process.env.OPENROUTER_APP_NAME } : {}
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });
  const raw3 = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw createHttpError(
      502,
      raw3.error?.message || "OpenRouter request failed"
    );
  }
  const text = extractTextContent(raw3.choices?.[0]?.message?.content);
  const parsed = extractJsonPayload(text);
  const recommendedIds = Array.isArray(parsed?.recommendedPostingIds) ? parsed?.recommendedPostingIds.filter(
    (item) => typeof item === "string" && item.length > 0
  ) : [];
  const selectedIds = recommendedIds.length > 0 ? recommendedIds : limitedPostings.slice(0, 3).map((item) => item.id);
  const recommendations = selectedIds.map((id) => limitedPostings.find((item) => item.id === id)).filter((item) => Boolean(item));
  const summary = typeof parsed?.summary === "string" && parsed.summary.trim().length > 0 ? parsed.summary.trim() : text || "Here are the best-fit postings based on your preferences.";
  const tips = Array.isArray(parsed?.tips) ? parsed.tips.filter((item) => typeof item === "string" && item.trim().length > 0) : [];
  return {
    model,
    summary,
    tips,
    recommendedPostingIds: recommendations.map((item) => item.id),
    recommendations
  };
};
var AIService = {
  recommendPostings
};

// src/app/module/ai/ai.controller.ts
var recommendPostings2 = catchAsync(async (req, res) => {
  const result = await AIService.recommendPostings(req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "AI recommendation generated successfully",
    data: result
  });
});
var AIController = {
  recommendPostings: recommendPostings2
};

// src/app/module/ai/ai.validation.ts
import { z } from "zod";
var recommendationRequestSchema = z.object({
  body: z.object({
    mode: z.enum(["teacher", "student"]),
    query: z.string("query is required").trim().min(8).max(1200),
    postings: z.array(
      z.object({
        id: z.string("id is required").trim().min(1),
        title: z.string("title is required").trim().min(2).max(180),
        summary: z.string("summary is required").trim().min(6).max(1200),
        location: z.string("location must be a string").trim().max(180).nullable().optional(),
        institution: z.string("institution is required").trim().min(2).max(180),
        departmentName: z.string("departmentName must be a string").trim().max(180).nullable().optional(),
        programTitle: z.string("programTitle must be a string").trim().max(180).nullable().optional()
      })
    ).min(1, "At least one posting is required").max(40, "A maximum of 40 postings can be analyzed per request")
  })
});
var AIValidation = {
  recommendationRequestSchema
};

// src/app/module/ai/ai.route.ts
var router = Router();
router.post(
  "/recommend-postings",
  validateRequest(AIValidation.recommendationRequestSchema),
  AIController.recommendPostings
);
var AIRouter = router;

// src/app/module/classroom/classroom.route.ts
import { Router as Router2 } from "express";

// src/generated/prisma/enums.ts
var ClassRoomType = {
  LAB: "LAB",
  LECTURE: "LECTURE",
  SEMINAR: "SEMINAR",
  LIBRARY: "LIBRARY",
  TEACHER_ROOM: "TEACHER_ROOM",
  STUDENT_LOUNGE: "STUDENT_LOUNGE",
  ADMIN_OFFICE: "ADMIN_OFFICE"
};
var AccountStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  DEACTIVATED: "DEACTIVATED",
  BANNED: "BANNED",
  DELETIONPENDING: "DELETIONPENDING",
  DELETED: "DELETED"
};
var InstitutionType = {
  SCHOOL: "SCHOOL",
  COLLEGE: "COLLEGE",
  UNIVERSITY: "UNIVERSITY",
  TRAINING_CENTER: "TRAINING_CENTER",
  OTHER: "OTHER"
};
var AdminRole = {
  INSTITUTIONADMIN: "INSTITUTIONADMIN",
  DEPARTMENTADMIN: "DEPARTMENTADMIN",
  FACULTYADMIN: "FACULTYADMIN"
};
var SlotStatus = {
  CLASS_SLOT: "CLASS_SLOT",
  BREAK_SLOT: "BREAK_SLOT"
};
var AttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT"
};
var UserRole = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT"
};
var InstitutionApplicationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var TeacherJobApplicationStatus = {
  PENDING: "PENDING",
  SHORTLISTED: "SHORTLISTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var StudentAdmissionApplicationStatus = {
  PENDING: "PENDING",
  SHORTLISTED: "SHORTLISTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var InstitutionTransferEntityType = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER"
};
var InstitutionTransferStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED"
};

// src/app/lib/prisma.ts
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId      String\n  institution        Institution @relation(fields: [institutionId], references: [id])\n  activeDepartmentId String?\n  activeDepartment   Department? @relation("AdminProfileActiveDepartment", fields: [activeDepartmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n  requestedTransferRequests            InstitutionTransferRequest[]  @relation("TransferRequestRequesterUser")\n  reviewedTransferRequests             InstitutionTransferRequest[]  @relation("TransferRequestReviewerUser")\n  requestedInstitutionLeaveRequests    InstitutionLeaveRequest[]     @relation("InstitutionLeaveRequestRequester")\n  reviewedInstitutionLeaveRequests     InstitutionLeaveRequest[]     @relation("InstitutionLeaveRequestReviewer")\n  sentNotices                          Notice[]                      @relation("NoticeSenderUser")\n  readNotices                          NoticeRead[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                           Program[]\n  batches                            Batch[]\n  courses                            Course[]\n  sections                           Section[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  transferRequestsAsTargetDepartment InstitutionTransferRequest[]\n  activeAdminProfiles                AdminProfile[]                       @relation("AdminProfileActiveDepartment")\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum InstitutionSubscriptionPlan {\n  MONTHLY\n  HALF_YEARLY\n  YEARLY\n}\n\nenum InstitutionSubscriptionPaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionSubscriptionStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionTransferEntityType {\n  STUDENT\n  TEACHER\n}\n\nenum InstitutionTransferStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  CANCELLED\n}\n\nenum InstitutionLeaveRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum NoticeAudienceRole {\n  ADMIN\n  FACULTY\n  DEPARTMENT\n  TEACHER\n  STUDENT\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                                  @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                                @default(now())\n  updatedAt                   DateTime                                @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n  paymentGatewayCredential    InstitutionPaymentGatewayCredential?\n  renewalPayments             InstitutionSubscriptionRenewalPayment[]\n  subscriptions               InstitutionSubscription[]\n  schedules                   Schedule[]\n  routines                    Routine[]\n  notices                     Notice[]\n  leaveRequests               InstitutionLeaveRequest[]\n  sourceTransferRequests      InstitutionTransferRequest[]            @relation("TransferRequestSourceInstitution")\n  targetTransferRequests      InstitutionTransferRequest[]            @relation("TransferRequestTargetInstitution")\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  subscriptionPlan              InstitutionSubscriptionPlan?\n  subscriptionAmount            Decimal?                             @db.Decimal(12, 2)\n  subscriptionCurrency          String                               @default("BDT")\n  subscriptionMonths            Int?\n  subscriptionPaymentStatus     InstitutionSubscriptionPaymentStatus @default(PENDING)\n  subscriptionTranId            String?                              @unique\n  subscriptionGatewayStatus     String?\n  subscriptionGatewaySessionKey String?                              @unique\n  subscriptionGatewayValId      String?\n  subscriptionGatewayBankTranId String?\n  subscriptionGatewayCardType   String?\n  subscriptionGatewayRawPayload Json?\n  subscriptionPaidAt            DateTime?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution?              @relation(fields: [institutionId], references: [id])\n  subscriptions InstitutionSubscription[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel InstitutionLeaveRequest {\n  id String @id @default(uuid())\n\n  requesterUserId String\n  requesterUser   User   @relation("InstitutionLeaveRequestRequester", fields: [requesterUserId], references: [id])\n\n  requesterRole UserRole\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  status InstitutionLeaveRequestStatus @default(PENDING)\n  reason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionLeaveRequestReviewer", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([requesterUserId, status])\n  @@index([institutionId, status])\n  @@map("institution_leave_requests")\n}\n\nmodel InstitutionTransferRequest {\n  id String @id @default(uuid())\n\n  entityType InstitutionTransferEntityType\n  status     InstitutionTransferStatus     @default(PENDING)\n\n  sourceInstitutionId String\n  sourceInstitution   Institution @relation("TransferRequestSourceInstitution", fields: [sourceInstitutionId], references: [id])\n\n  targetInstitutionId String\n  targetInstitution   Institution @relation("TransferRequestTargetInstitution", fields: [targetInstitutionId], references: [id])\n\n  requesterUserId String\n  requesterUser   User   @relation("TransferRequestRequesterUser", fields: [requesterUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TransferRequestReviewerUser", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  targetDepartmentId String?\n  targetDepartment   Department? @relation(fields: [targetDepartmentId], references: [id])\n\n  requestMessage  String?\n  responseMessage String?\n\n  requestedAt DateTime  @default(now())\n  reviewedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceInstitutionId, status])\n  @@index([targetInstitutionId, status])\n  @@index([requesterUserId])\n  @@index([studentProfileId])\n  @@index([teacherProfileId])\n  @@map("institution_transfer_requests")\n}\n\nmodel Notice {\n  id      String @id @default(uuid())\n  title   String\n  content String\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  senderUserId String\n  senderUser   User               @relation("NoticeSenderUser", fields: [senderUserId], references: [id])\n  senderRole   NoticeAudienceRole\n\n  recipients NoticeRecipientRole[]\n  reads      NoticeRead[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, createdAt])\n  @@index([senderUserId, createdAt])\n  @@map("notices")\n}\n\nmodel NoticeRecipientRole {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  role NoticeAudienceRole\n\n  createdAt DateTime @default(now())\n\n  @@unique([noticeId, role])\n  @@index([role])\n  @@map("notice_recipient_roles")\n}\n\nmodel NoticeRead {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  readAt DateTime @default(now())\n\n  @@unique([noticeId, userId])\n  @@index([userId, readAt])\n  @@map("notice_reads")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel InstitutionPaymentGatewayCredential {\n  id                               String      @id @default(uuid())\n  institutionId                    String      @unique\n  institution                      Institution @relation(fields: [institutionId], references: [id])\n  sslCommerzStoreIdEncrypted       String\n  sslCommerzStorePasswordEncrypted String\n  sslCommerzBaseUrlEncrypted       String\n  sslCommerzStoreIdHash            String\n  sslCommerzStorePasswordHash      String\n  sslCommerzBaseUrlHash            String\n  isActive                         Boolean     @default(true)\n  lastUpdatedByUserId              String?\n  createdAt                        DateTime    @default(now())\n  updatedAt                        DateTime    @updatedAt\n\n  @@index([institutionId, isActive])\n  @@map("institution_payment_gateway_credentials")\n}\n\nmodel InstitutionSubscriptionRenewalPayment {\n  id                String                               @id @default(uuid())\n  institutionId     String\n  institution       Institution                          @relation(fields: [institutionId], references: [id])\n  initiatedByUserId String\n  plan              InstitutionSubscriptionPlan\n  amount            Decimal                              @db.Decimal(12, 2)\n  currency          String                               @default("BDT")\n  monthsCovered     Int\n  status            InstitutionSubscriptionPaymentStatus @default(PENDING)\n  tranId            String                               @unique\n  gatewayStatus     String?\n  gatewaySessionKey String?                              @unique\n  gatewayValId      String?\n  gatewayBankTranId String?\n  gatewayCardType   String?\n  gatewayRawPayload Json?\n  paidAt            DateTime?\n  createdAt         DateTime                             @default(now())\n  updatedAt         DateTime                             @updatedAt\n\n  @@index([institutionId, status, createdAt])\n  @@index([initiatedByUserId, status])\n  @@map("institution_subscription_renewal_payments")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  semesterId String?\n  semester   Semester? @relation(fields: [semesterId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  startTime String\n  endTime   String\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@index([semesterId])\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  schedules           Schedule[]\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n  transferRequests      InstitutionTransferRequest[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel InstitutionSubscription {\n  id String @id @default(uuid())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  sourceApplicationId String?\n  sourceApplication   InstitutionApplication? @relation(fields: [sourceApplicationId], references: [id])\n\n  plan          InstitutionSubscriptionPlan\n  status        InstitutionSubscriptionStatus @default(ACTIVE)\n  amount        Decimal                       @db.Decimal(12, 2)\n  currency      String                        @default("BDT")\n  monthsCovered Int\n  startsAt      DateTime\n  endsAt        DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, status, endsAt])\n  @@index([sourceApplicationId])\n  @@map("institution_subscriptions")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n  transferRequests          InstitutionTransferRequest[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"activeDepartmentId","kind":"scalar","type":"String"},{"name":"activeDepartment","kind":"object","type":"Department","relationName":"AdminProfileActiveDepartment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"requestedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestRequesterUser"},{"name":"reviewedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestReviewerUser"},{"name":"requestedInstitutionLeaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionLeaveRequestRequester"},{"name":"reviewedInstitutionLeaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionLeaveRequestReviewer"},{"name":"sentNotices","kind":"object","type":"Notice","relationName":"NoticeSenderUser"},{"name":"readNotices","kind":"object","type":"NoticeRead","relationName":"NoticeReadToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentToStudentFeePayment"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"DepartmentToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"DepartmentToRoutine"},{"name":"transferRequestsAsTargetDepartment","kind":"object","type":"InstitutionTransferRequest","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"activeAdminProfiles","kind":"object","type":"AdminProfile","relationName":"AdminProfileActiveDepartment"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"InstitutionToStudentFeePayment"},{"name":"paymentGatewayCredential","kind":"object","type":"InstitutionPaymentGatewayCredential","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"renewalPayments","kind":"object","type":"InstitutionSubscriptionRenewalPayment","relationName":"InstitutionToInstitutionSubscriptionRenewalPayment"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionToInstitutionSubscription"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"InstitutionToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"InstitutionToRoutine"},{"name":"notices","kind":"object","type":"Notice","relationName":"InstitutionToNotice"},{"name":"leaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionToInstitutionLeaveRequest"},{"name":"sourceTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestSourceInstitution"},{"name":"targetTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestTargetInstitution"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"subscriptionPlan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"subscriptionAmount","kind":"scalar","type":"Decimal"},{"name":"subscriptionCurrency","kind":"scalar","type":"String"},{"name":"subscriptionMonths","kind":"scalar","type":"Int"},{"name":"subscriptionPaymentStatus","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"subscriptionTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayStatus","kind":"scalar","type":"String"},{"name":"subscriptionGatewaySessionKey","kind":"scalar","type":"String"},{"name":"subscriptionGatewayValId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayBankTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayCardType","kind":"scalar","type":"String"},{"name":"subscriptionGatewayRawPayload","kind":"scalar","type":"Json"},{"name":"subscriptionPaidAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"InstitutionLeaveRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"InstitutionLeaveRequestRequester"},{"name":"requesterRole","kind":"enum","type":"UserRole"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionLeaveRequest"},{"name":"status","kind":"enum","type":"InstitutionLeaveRequestStatus"},{"name":"reason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionLeaveRequestReviewer"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_leave_requests"},"InstitutionTransferRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"entityType","kind":"enum","type":"InstitutionTransferEntityType"},{"name":"status","kind":"enum","type":"InstitutionTransferStatus"},{"name":"sourceInstitutionId","kind":"scalar","type":"String"},{"name":"sourceInstitution","kind":"object","type":"Institution","relationName":"TransferRequestSourceInstitution"},{"name":"targetInstitutionId","kind":"scalar","type":"String"},{"name":"targetInstitution","kind":"object","type":"Institution","relationName":"TransferRequestTargetInstitution"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"TransferRequestRequesterUser"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TransferRequestReviewerUser"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"targetDepartmentId","kind":"scalar","type":"String"},{"name":"targetDepartment","kind":"object","type":"Department","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"requestMessage","kind":"scalar","type":"String"},{"name":"responseMessage","kind":"scalar","type":"String"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_transfer_requests"},"Notice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToNotice"},{"name":"senderUserId","kind":"scalar","type":"String"},{"name":"senderUser","kind":"object","type":"User","relationName":"NoticeSenderUser"},{"name":"senderRole","kind":"enum","type":"NoticeAudienceRole"},{"name":"recipients","kind":"object","type":"NoticeRecipientRole","relationName":"NoticeToNoticeRecipientRole"},{"name":"reads","kind":"object","type":"NoticeRead","relationName":"NoticeToNoticeRead"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notices"},"NoticeRecipientRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRecipientRole"},{"name":"role","kind":"enum","type":"NoticeAudienceRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_recipient_roles"},"NoticeRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRead"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NoticeReadToUser"},{"name":"readAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_reads"},"DepartmentSemesterFeeConfiguration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"totalFeeAmount","kind":"scalar","type":"Decimal"},{"name":"monthlyFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"}],"dbName":"department_semester_fee_configurations"},"StudentFeePayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentFeePayment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentFeePayment"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SemesterToStudentFeePayment"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentFeePaymentToStudentProfile"},{"name":"feeConfigurationId","kind":"scalar","type":"String"},{"name":"feeConfiguration","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"},{"name":"paymentMode","kind":"enum","type":"StudentFeePaymentMode"},{"name":"status","kind":"enum","type":"StudentFeePaymentStatus"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paymentInitiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_fee_payments"},"InstitutionPaymentGatewayCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"sslCommerzStoreIdEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStoreIdHash","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordHash","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlHash","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"lastUpdatedByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_payment_gateway_credentials"},"InstitutionSubscriptionRenewalPayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscriptionRenewalPayment"},{"name":"initiatedByUserId","kind":"scalar","type":"String"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscription_renewal_payments"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToRoutine"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"ScheduleToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSchedule"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSchedule"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"ScheduleToSemester"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"SemesterToStudentFeePayment"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"StudentFeePaymentToStudentProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"InstitutionSubscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscription"},{"name":"sourceApplicationId","kind":"scalar","type":"String"},{"name":"sourceApplication","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"endsAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscriptions"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","schedules","courseRegistrations","section","course","teacherProfile","sectionTeacherAssignments","classwork","classworkSubmissions","applications","_count","posting","studentUser","reviewerUser","studentProfile","admissionApplications","semester","feePayments","feeConfiguration","sourceInstitution","targetInstitution","requesterUser","targetDepartment","transferRequests","submissions","classworks","sections","batch","feeConfigurations","schedule","courseRegistration","routines","classRoom","attendances","mark","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","transferRequestsAsTargetDepartment","activeAdminProfiles","departments","faculties","classrooms","applicantUser","reviewedByUser","sourceApplication","subscriptions","institutionApplications","paymentGatewayCredential","renewalPayments","senderUser","notice","recipients","reads","notices","leaveRequests","sourceTransferRequests","targetTransferRequests","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","requestedTransferRequests","reviewedTransferRequests","requestedInstitutionLeaveRequests","reviewedInstitutionLeaveRequests","sentNotices","readNotices","activeDepartment","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","InstitutionLeaveRequest.findUnique","InstitutionLeaveRequest.findUniqueOrThrow","InstitutionLeaveRequest.findFirst","InstitutionLeaveRequest.findFirstOrThrow","InstitutionLeaveRequest.findMany","InstitutionLeaveRequest.createOne","InstitutionLeaveRequest.createMany","InstitutionLeaveRequest.createManyAndReturn","InstitutionLeaveRequest.updateOne","InstitutionLeaveRequest.updateMany","InstitutionLeaveRequest.updateManyAndReturn","InstitutionLeaveRequest.upsertOne","InstitutionLeaveRequest.deleteOne","InstitutionLeaveRequest.deleteMany","InstitutionLeaveRequest.groupBy","InstitutionLeaveRequest.aggregate","InstitutionTransferRequest.findUnique","InstitutionTransferRequest.findUniqueOrThrow","InstitutionTransferRequest.findFirst","InstitutionTransferRequest.findFirstOrThrow","InstitutionTransferRequest.findMany","InstitutionTransferRequest.createOne","InstitutionTransferRequest.createMany","InstitutionTransferRequest.createManyAndReturn","InstitutionTransferRequest.updateOne","InstitutionTransferRequest.updateMany","InstitutionTransferRequest.updateManyAndReturn","InstitutionTransferRequest.upsertOne","InstitutionTransferRequest.deleteOne","InstitutionTransferRequest.deleteMany","InstitutionTransferRequest.groupBy","InstitutionTransferRequest.aggregate","Notice.findUnique","Notice.findUniqueOrThrow","Notice.findFirst","Notice.findFirstOrThrow","Notice.findMany","Notice.createOne","Notice.createMany","Notice.createManyAndReturn","Notice.updateOne","Notice.updateMany","Notice.updateManyAndReturn","Notice.upsertOne","Notice.deleteOne","Notice.deleteMany","Notice.groupBy","Notice.aggregate","NoticeRecipientRole.findUnique","NoticeRecipientRole.findUniqueOrThrow","NoticeRecipientRole.findFirst","NoticeRecipientRole.findFirstOrThrow","NoticeRecipientRole.findMany","NoticeRecipientRole.createOne","NoticeRecipientRole.createMany","NoticeRecipientRole.createManyAndReturn","NoticeRecipientRole.updateOne","NoticeRecipientRole.updateMany","NoticeRecipientRole.updateManyAndReturn","NoticeRecipientRole.upsertOne","NoticeRecipientRole.deleteOne","NoticeRecipientRole.deleteMany","NoticeRecipientRole.groupBy","NoticeRecipientRole.aggregate","NoticeRead.findUnique","NoticeRead.findUniqueOrThrow","NoticeRead.findFirst","NoticeRead.findFirstOrThrow","NoticeRead.findMany","NoticeRead.createOne","NoticeRead.createMany","NoticeRead.createManyAndReturn","NoticeRead.updateOne","NoticeRead.updateMany","NoticeRead.updateManyAndReturn","NoticeRead.upsertOne","NoticeRead.deleteOne","NoticeRead.deleteMany","NoticeRead.groupBy","NoticeRead.aggregate","DepartmentSemesterFeeConfiguration.findUnique","DepartmentSemesterFeeConfiguration.findUniqueOrThrow","DepartmentSemesterFeeConfiguration.findFirst","DepartmentSemesterFeeConfiguration.findFirstOrThrow","DepartmentSemesterFeeConfiguration.findMany","DepartmentSemesterFeeConfiguration.createOne","DepartmentSemesterFeeConfiguration.createMany","DepartmentSemesterFeeConfiguration.createManyAndReturn","DepartmentSemesterFeeConfiguration.updateOne","DepartmentSemesterFeeConfiguration.updateMany","DepartmentSemesterFeeConfiguration.updateManyAndReturn","DepartmentSemesterFeeConfiguration.upsertOne","DepartmentSemesterFeeConfiguration.deleteOne","DepartmentSemesterFeeConfiguration.deleteMany","DepartmentSemesterFeeConfiguration.groupBy","DepartmentSemesterFeeConfiguration.aggregate","StudentFeePayment.findUnique","StudentFeePayment.findUniqueOrThrow","StudentFeePayment.findFirst","StudentFeePayment.findFirstOrThrow","StudentFeePayment.findMany","StudentFeePayment.createOne","StudentFeePayment.createMany","StudentFeePayment.createManyAndReturn","StudentFeePayment.updateOne","StudentFeePayment.updateMany","StudentFeePayment.updateManyAndReturn","StudentFeePayment.upsertOne","StudentFeePayment.deleteOne","StudentFeePayment.deleteMany","StudentFeePayment.groupBy","StudentFeePayment.aggregate","InstitutionPaymentGatewayCredential.findUnique","InstitutionPaymentGatewayCredential.findUniqueOrThrow","InstitutionPaymentGatewayCredential.findFirst","InstitutionPaymentGatewayCredential.findFirstOrThrow","InstitutionPaymentGatewayCredential.findMany","InstitutionPaymentGatewayCredential.createOne","InstitutionPaymentGatewayCredential.createMany","InstitutionPaymentGatewayCredential.createManyAndReturn","InstitutionPaymentGatewayCredential.updateOne","InstitutionPaymentGatewayCredential.updateMany","InstitutionPaymentGatewayCredential.updateManyAndReturn","InstitutionPaymentGatewayCredential.upsertOne","InstitutionPaymentGatewayCredential.deleteOne","InstitutionPaymentGatewayCredential.deleteMany","InstitutionPaymentGatewayCredential.groupBy","InstitutionPaymentGatewayCredential.aggregate","InstitutionSubscriptionRenewalPayment.findUnique","InstitutionSubscriptionRenewalPayment.findUniqueOrThrow","InstitutionSubscriptionRenewalPayment.findFirst","InstitutionSubscriptionRenewalPayment.findFirstOrThrow","InstitutionSubscriptionRenewalPayment.findMany","InstitutionSubscriptionRenewalPayment.createOne","InstitutionSubscriptionRenewalPayment.createMany","InstitutionSubscriptionRenewalPayment.createManyAndReturn","InstitutionSubscriptionRenewalPayment.updateOne","InstitutionSubscriptionRenewalPayment.updateMany","InstitutionSubscriptionRenewalPayment.updateManyAndReturn","InstitutionSubscriptionRenewalPayment.upsertOne","InstitutionSubscriptionRenewalPayment.deleteOne","InstitutionSubscriptionRenewalPayment.deleteMany","InstitutionSubscriptionRenewalPayment.groupBy","InstitutionSubscriptionRenewalPayment.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","InstitutionSubscription.findUnique","InstitutionSubscription.findUniqueOrThrow","InstitutionSubscription.findFirst","InstitutionSubscription.findFirstOrThrow","InstitutionSubscription.findMany","InstitutionSubscription.createOne","InstitutionSubscription.createMany","InstitutionSubscription.createManyAndReturn","InstitutionSubscription.updateOne","InstitutionSubscription.updateMany","InstitutionSubscription.updateManyAndReturn","InstitutionSubscription.upsertOne","InstitutionSubscription.deleteOne","InstitutionSubscription.deleteMany","InstitutionSubscription.groupBy","InstitutionSubscription.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","sourceApplicationId","InstitutionSubscriptionPlan","plan","InstitutionSubscriptionStatus","amount","currency","monthsCovered","startsAt","endsAt","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","initiatedByUserId","InstitutionSubscriptionPaymentStatus","tranId","gatewayStatus","gatewaySessionKey","gatewayValId","gatewayBankTranId","gatewayCardType","gatewayRawPayload","paidAt","sslCommerzStoreIdEncrypted","sslCommerzStorePasswordEncrypted","sslCommerzBaseUrlEncrypted","sslCommerzStoreIdHash","sslCommerzStorePasswordHash","sslCommerzBaseUrlHash","isActive","lastUpdatedByUserId","feeConfigurationId","StudentFeePaymentMode","paymentMode","StudentFeePaymentStatus","gatewayName","paymentInitiatedAt","totalFeeAmount","monthlyFeeAmount","noticeId","readAt","NoticeAudienceRole","role","senderUserId","senderRole","InstitutionTransferEntityType","entityType","InstitutionTransferStatus","sourceInstitutionId","targetInstitutionId","requesterUserId","targetDepartmentId","requestMessage","responseMessage","requestedAt","UserRole","requesterRole","InstitutionLeaveRequestStatus","reason","reviewedByUserId","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","subscriptionPlan","subscriptionAmount","subscriptionCurrency","subscriptionMonths","subscriptionPaymentStatus","subscriptionTranId","subscriptionGatewayStatus","subscriptionGatewaySessionKey","subscriptionGatewayValId","subscriptionGatewayBankTranId","subscriptionGatewayCardType","subscriptionGatewayRawPayload","subscriptionPaidAt","InstitutionApplicationStatus","rejectionReason","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","accountStatus","date","AttendanceStatus","AdminRole","activeDepartmentId","noticeId_userId","noticeId_role","postingId_teacherUserId","courseRegistrationId_date","departmentId_semesterId","postingId_studentUserId","classworkId_studentProfileId","sectionId_courseId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "sh75AqAFDQMAANwKACAHAACgCwAgWwAAogwAIIQGAADaDAAwhQYAAAsAEIYGAADaDAAwhwYBAAAAAYwGAQDXCgAhjgYBAAAAAY8GQADbCgAhkAZAANsKACGXBwAA2wzjByLjBwEA2AoAIQEAAAABACAMAwAA3AoAIIQGAADdDAAwhQYAAAMAEIYGAADdDAAwhwYBANcKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHIB0AA2woAIdQHAQDXCgAh1QcBANgKACHWBwEA2AoAIQMDAADJDgAg1QcAAN4MACDWBwAA3gwAIAwDAADcCgAghAYAAN0MADCFBgAAAwAQhgYAAN0MADCHBgEAAAABjgYBANcKACGPBkAA2woAIZAGQADbCgAhyAdAANsKACHUBwEAAAAB1QcBANgKACHWBwEA2AoAIQMAAAADACABAAAEADACAAAFACARAwAA3AoAIIQGAADcDAAwhQYAAAcAEIYGAADcDAAwhwYBANcKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHLBwEA1woAIcwHAQDXCgAhzQcBANgKACHOBwEA2AoAIc8HAQDYCgAh0AdAAIMMACHRB0AAgwwAIdIHAQDYCgAh0wcBANgKACEIAwAAyQ4AIM0HAADeDAAgzgcAAN4MACDPBwAA3gwAINAHAADeDAAg0QcAAN4MACDSBwAA3gwAINMHAADeDAAgEQMAANwKACCEBgAA3AwAMIUGAAAHABCGBgAA3AwAMIcGAQAAAAGOBgEA1woAIY8GQADbCgAhkAZAANsKACHLBwEA1woAIcwHAQDXCgAhzQcBANgKACHOBwEA2AoAIc8HAQDYCgAh0AdAAIMMACHRB0AAgwwAIdIHAQDYCgAh0wcBANgKACEDAAAABwAgAQAACAAwAgAACQAgDQMAANwKACAHAACgCwAgWwAAogwAIIQGAADaDAAwhQYAAAsAEIYGAADaDAAwhwYBANcKACGMBgEA1woAIY4GAQDXCgAhjwZAANsKACGQBkAA2woAIZcHAADbDOMHIuMHAQDYCgAhBAMAAMkOACAHAADkEQAgWwAAwhkAIOMHAADeDAAgAwAAAAsAIAEAAAwAMAIAAAEAIBYDAADcCgAgBwAAoAsAIAkAAK8MACANAACGCwAgEQAA1QsAICIAAOALACAkAADXCwAgTAAAlwsAIE0AANkLACCEBgAA2QwAMIUGAAAOABCGBgAA2QwAMIcGAQDXCgAhiAYBANcKACGJBgEA1woAIYoGAQDXCgAhiwYBANgKACGMBgEA1woAIY0GAQDXCgAhjgYBANcKACGPBkAA2woAIZAGQADbCgAhCgMAAMkOACAHAADkEQAgCQAAwhkAIA0AAOcQACARAACVFwAgIgAAoBcAICQAAJcXACBMAADWEQAgTQAAmRcAIIsGAADeDAAgFgMAANwKACAHAACgCwAgCQAArwwAIA0AAIYLACARAADVCwAgIgAA4AsAICQAANcLACBMAACXCwAgTQAA2QsAIIQGAADZDAAwhQYAAA4AEIYGAADZDAAwhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBANcKACGLBgEA2AoAIYwGAQDXCgAhjQYBANcKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACEDAAAADgAgAQAADwAwAgAAEAAgDAcAAJsMACA6AADYDAAghAYAANcMADCFBgAAEgAQhgYAANcMADCHBgEA1woAIYwGAQDYCgAhjwZAANsKACGQBkAA2woAIeYGAQDYCgAhqwcBANgKACG-BwEA1woAIQUHAADkEQAgOgAA0hkAIIwGAADeDAAg5gYAAN4MACCrBwAA3gwAIAwHAACbDAAgOgAA2AwAIIQGAADXDAAwhQYAABIAEIYGAADXDAAwhwYBAAAAAYwGAQDYCgAhjwZAANsKACGQBkAA2woAIeYGAQDYCgAhqwcBANgKACG-BwEA1woAIQMAAAASACABAAATADACAAAUACAmBgAA0gsAIAwAAIQLACANAACGCwAgEQAA1QsAIBwAAIgLACAlAACFCwAgJwAAhwsAICoAAN0LACAuAADOCwAgLwAAzwsAIDAAANELACAxAADTCwAgMgAA1AsAIDQAAJcLACA1AADXCwAgNgAA2AsAIDcAANkLACA7AADNCwAgPAAA0AsAIEAAANwLACBBAADWCwAgQgAA2gsAIEMAANsLACBIAADeCwAgSQAA3wsAIEoAAOALACBLAADgCwAghAYAAMsLADCFBgAAFgAQhgYAAMsLADCHBgEA1woAIY8GQADbCgAhkAZAANsKACG7BgAAzAutByPgBgEA1woAIeYGAQDYCgAhqwcBANgKACGuBwEA2AoAIQEAAAAWACAdCAAA1gwAIAwAAIQLACANAACGCwAgEQAA1QsAIBwAAIgLACAlAACFCwAgJwAAhwsAICoAAN0LACAuAADOCwAgLwAAzwsAIDAAANELACAxAADTCwAgMgAA1AsAIDQAAJcLACA1AADXCwAgNgAA2AsAIDcAANkLACA4AADgCwAgOQAA0gsAIIQGAADVDAAwhQYAABgAEIYGAADVDAAwhwYBANcKACGPBkAA2woAIZAGQADbCgAh5gYBANgKACH3BgEA2AoAIasHAQDYCgAhvgcBANcKACEWCAAA0RkAIAwAAOUQACANAADnEAAgEQAAlRcAIBwAAOkQACAlAADmEAAgJwAA6BAAICoAAJ0XACAuAACOFwAgLwAAjxcAIDAAAJEXACAxAACTFwAgMgAAlBcAIDQAANYRACA1AACXFwAgNgAAmBcAIDcAAJkXACA4AACgFwAgOQAAkhcAIOYGAADeDAAg9wYAAN4MACCrBwAA3gwAIB0IAADWDAAgDAAAhAsAIA0AAIYLACARAADVCwAgHAAAiAsAICUAAIULACAnAACHCwAgKgAA3QsAIC4AAM4LACAvAADPCwAgMAAA0QsAIDEAANMLACAyAADUCwAgNAAAlwsAIDUAANcLACA2AADYCwAgNwAA2QsAIDgAAOALACA5AADSCwAghAYAANUMADCFBgAAGAAQhgYAANUMADCHBgEAAAABjwZAANsKACGQBkAA2woAIeYGAQDYCgAh9wYBANgKACGrBwEA2AoAIb4HAQDXCgAhAwAAABgAIAEAABkAMAIAABoAIAEAAAASACASBwAAoAsAIAkAAK8MACANAACGCwAgDwAA0QsAIIQGAADUDAAwhQYAAB0AEIYGAADUDAAwhwYBANcKACGMBgEA1woAIY0GAQDXCgAhjwZAANsKACGQBkAA2woAIbgGAQDXCgAh5gYBANgKACHwBgEA2AoAIfEGQACDDAAh8gYIAJ8MACHzBggAnwwAIQkHAADkEQAgCQAAwhkAIA0AAOcQACAPAACRFwAg5gYAAN4MACDwBgAA3gwAIPEGAADeDAAg8gYAAN4MACDzBgAA3gwAIBIHAACgCwAgCQAArwwAIA0AAIYLACAPAADRCwAghAYAANQMADCFBgAAHQAQhgYAANQMADCHBgEAAAABjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACG4BgEA1woAIeYGAQDYCgAh8AYBANgKACHxBkAAgwwAIfIGCACfDAAh8wYIAJ8MACEDAAAAHQAgAQAAHgAwAgAAHwAgEgcAAKALACAJAACvDAAgCgAA0gwAIA0AAIYLACARAADVCwAghAYAANMMADCFBgAAIQAQhgYAANMMADCHBgEA1woAIYwGAQDXCgAhjQYBANcKACGPBkAA2woAIZAGQADbCgAh5gYBANgKACHyBgIAmQwAIfgGAQDYCgAhwAcBANcKACHBBwEA1woAIQgHAADkEQAgCQAAwhkAIAoAANAZACANAADnEAAgEQAAlRcAIOYGAADeDAAg8gYAAN4MACD4BgAA3gwAIBIHAACgCwAgCQAArwwAIAoAANIMACANAACGCwAgEQAA1QsAIIQGAADTDAAwhQYAACEAEIYGAADTDAAwhwYBAAAAAYwGAQDXCgAhjQYBANcKACGPBkAA2woAIZAGQADbCgAh5gYBANgKACHyBgIAmQwAIfgGAQDYCgAhwAcBAAAAAcEHAQDXCgAhAwAAACEAIAEAACIAMAIAACMAIAEAAAAdACAaBwAAoAsAIAkAAKIMACAKAADSDAAgCwAA3QsAIA4AAMMMACAPAADGDAAgEAAAoQwAIBkAALgMACAbAACwDAAgLAAA0AwAIC0AANEMACCEBgAAzwwAMIUGAAAmABCGBgAAzwwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACGvBgEA1woAIbAGAQDXCgAhsQYBANcKACGzBgEA1woAIegGAQDXCgAh-AYBANgKACG_B0AA2woAIQ0HAADkEQAgCQAAwhkAIAoAANAZACALAACdFwAgDgAAyRkAIA8AAMoZACAQAADBGQAgGQAAxRkAIBsAAMQZACAsAADOGQAgLQAAzxkAII0GAADeDAAg-AYAAN4MACAaBwAAoAsAIAkAAKIMACAKAADSDAAgCwAA3QsAIA4AAMMMACAPAADGDAAgEAAAoQwAIBkAALgMACAbAACwDAAgLAAA0AwAIC0AANEMACCEBgAAzwwAMIUGAAAmABCGBgAAzwwAMIcGAQAAAAGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIa8GAQDXCgAhsAYBANcKACGxBgEA1woAIbMGAQDXCgAh6AYBANcKACH4BgEA2AoAIb8HQADbCgAhAwAAACYAIAEAACcAMAIAACgAIBMHAACbDAAgCQAAogwAICgAAM0MACApAACgDAAgKwAAzgwAIIQGAADMDAAwhQYAACoAEIYGAADMDAAwhwYBANcKACGMBgEA2AoAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIcUGAQDXCgAh4AYBANcKACHmBgEA2AoAIe0GAQDYCgAh7gYBANcKACHvBgEA1woAIQkHAADkEQAgCQAAwhkAICgAAMwZACApAADAGQAgKwAAzRkAIIwGAADeDAAgjQYAAN4MACDmBgAA3gwAIO0GAADeDAAgEwcAAJsMACAJAACiDAAgKAAAzQwAICkAAKAMACArAADODAAghAYAAMwMADCFBgAAKgAQhgYAAMwMADCHBgEAAAABjAYBANgKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACHFBgEA1woAIeAGAQDXCgAh5gYBANgKACHtBgEA2AoAIe4GAQDXCgAh7wYBANcKACEDAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIA0MAACECwAgDQAAhgsAIBwAAIgLACAlAACFCwAgJwAAhwsAIIQGAACDCwAwhQYAAC8AEIYGAACDCwAwhwYBANcKACGMBgEA1woAIeAGAQDXCgAh4QZAANsKACHiBkAA2woAIQEAAAAvACASBwAAmwwAIAkAAKIMACALAADdCwAgGwAAywwAIIQGAADJDAAwhQYAADEAEIYGAADJDAAwhwYBANcKACGMBgEA2AoAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIb8GAADKDO0GIuAGAQDXCgAh5gYBANgKACHoBgEA2AoAIeoGAQDXCgAh6wYBANcKACEIBwAA5BEAIAkAAMIZACALAACdFwAgGwAAxBkAIIwGAADeDAAgjQYAAN4MACDmBgAA3gwAIOgGAADeDAAgEgcAAJsMACAJAACiDAAgCwAA3QsAIBsAAMsMACCEBgAAyQwAMIUGAAAxABCGBgAAyQwAMIcGAQAAAAGMBgEA2AoAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIb8GAADKDO0GIuAGAQDXCgAh5gYBANgKACHoBgEA2AoAIeoGAQDXCgAh6wYBANcKACEDAAAAMQAgAQAAMgAwAgAAMwAgFAcAAKALACAJAACiDAAgDQAAhgsAIBEAANULACAbAACwDAAgJAAA1wsAICYAAMgMACCEBgAAxwwAMIUGAAA1ABCGBgAAxwwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACHgBgEA1woAIeYGAQDYCgAh5wYCAJkMACHoBgEA1woAIekGAQDYCgAhCwcAAOQRACAJAADCGQAgDQAA5xAAIBEAAJUXACAbAADEGQAgJAAAlxcAICYAAMsZACCNBgAA3gwAIOYGAADeDAAg5wYAAN4MACDpBgAA3gwAIBQHAACgCwAgCQAAogwAIA0AAIYLACARAADVCwAgGwAAsAwAICQAANcLACAmAADIDAAghAYAAMcMADCFBgAANQAQhgYAAMcMADCHBgEAAAABjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACHgBgEA1woAIeYGAQDYCgAh5wYCAJkMACHoBgEA1woAIekGAQDYCgAhAwAAADUAIAEAADYAMAIAADcAIAMAAAAmACABAAAnADACAAAoACAQBwAAoAsAIAkAAKIMACAOAADDDAAgDwAAxgwAIBAAAKEMACCEBgAAxQwAMIUGAAA6ABCGBgAAxQwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACGvBgEA1woAIbAGAQDXCgAhsQYBANcKACEGBwAA5BEAIAkAAMIZACAOAADJGQAgDwAAyhkAIBAAAMEZACCNBgAA3gwAIBEHAACgCwAgCQAAogwAIA4AAMMMACAPAADGDAAgEAAAoQwAIIQGAADFDAAwhQYAADoAEIYGAADFDAAwhwYBAAAAAYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhrwYBANcKACGwBgEA1woAIbEGAQDXCgAh6wcAAMQMACADAAAAOgAgAQAAOwAwAgAAPAAgAQAAABgAIBMHAACgCwAgCQAAogwAIA4AAMMMACAQAAChDAAgIwAA2AsAIIQGAADBDAAwhQYAAD8AEIYGAADBDAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIa8GAQDXCgAhsQYBANcKACG4BgEA1woAIbkGAQDYCgAhuwYAAMIMuwYivAZAAIMMACEIBwAA5BEAIAkAAMIZACAOAADJGQAgEAAAwRkAICMAAJgXACCNBgAA3gwAILkGAADeDAAgvAYAAN4MACATBwAAoAsAIAkAAKIMACAOAADDDAAgEAAAoQwAICMAANgLACCEBgAAwQwAMIUGAAA_ABCGBgAAwQwAMIcGAQAAAAGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIa8GAQDXCgAhsQYBANcKACG4BgEA1woAIbkGAQDYCgAhuwYAAMIMuwYivAZAAIMMACEDAAAAPwAgAQAAQAAwAgAAQQAgAQAAABgAIBIHAACgCwAgCQAAogwAIBIAAMAMACAZAAC4DAAghAYAAL8MADCFBgAARAAQhgYAAL8MADCHBgEA1woAIYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhsgYBANcKACGzBgEA1woAIbQGAQDYCgAhtQYBANgKACG2BgEA2AoAIbcGQADbCgAhCAcAAOQRACAJAADCGQAgEgAAyBkAIBkAAMUZACCNBgAA3gwAILQGAADeDAAgtQYAAN4MACC2BgAA3gwAIBMHAACgCwAgCQAAogwAIBIAAMAMACAZAAC4DAAghAYAAL8MADCFBgAARAAQhgYAAL8MADCHBgEAAAABjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACGyBgEA1woAIbMGAQDXCgAhtAYBANgKACG1BgEA2AoAIbYGAQDYCgAhtwZAANsKACHqBwAAvgwAIAMAAABEACABAABFADACAABGACABAAAAGAAgAwAAACYAIAEAACcAMAIAACgAIAMAAABEACABAABFADACAABGACATFgAAvQwAIBcAANwKACAYAACEDAAgGQAAtAwAIIQGAAC7DAAwhQYAAEsAEIYGAAC7DAAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhswYBANgKACG9BgEA2AoAIb8GAAC8DN4GIsAGAQDYCgAhwQZAAIMMACHCBkAA2woAIcMGAQDXCgAhxAYBANgKACHeBgEA1woAIQkWAADHGQAgFwAAyQ4AIBgAAMkOACAZAADFGQAgswYAAN4MACC9BgAA3gwAIMAGAADeDAAgwQYAAN4MACDEBgAA3gwAIBQWAAC9DAAgFwAA3AoAIBgAAIQMACAZAAC0DAAghAYAALsMADCFBgAASwAQhgYAALsMADCHBgEAAAABjwZAANsKACGQBkAA2woAIbMGAQDYCgAhvQYBANgKACG_BgAAvAzeBiLABgEA2AoAIcEGQACDDAAhwgZAANsKACHDBgEA1woAIcQGAQDYCgAh3gYBANcKACHpBwAAugwAIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgAQAAAEsAICYEAADxCwAgBQAA8gsAIAYAANILACAQAADTCwAgGQAA1AsAIDQAAJcLACBBAADWCwAgTgAA1gsAIE8AAJcLACBQAADzCwAgUQAAlAsAIFIAAJQLACBTAAD0CwAgVAAA9QsAIFUAAOALACBWAADgCwAgVwAA3wsAIFgAAN8LACBZAADeCwAgWgAA9gsAIIQGAADwCwAwhQYAAFEAEIYGAADwCwAwhwYBANcKACGLBgEA2AoAIY8GQADbCgAhkAZAANsKACHgBgEA1woAIZcHAQDXCgAh1wcBANcKACHYByAA2goAIdkHAQDYCgAh2gcBANgKACHbBwEA2AoAIdwHAQDYCgAh3QcBANgKACHeBwEA2AoAId8HAQDXCgAhAQAAAFEAIBMDAADcCgAgBwAAoAsAIAkAAKIMACANAACGCwAgEwAA2AsAIBoAAJQLACAcAACICwAgIgAA4AsAIIQGAACoDAAwhQYAAFMAEIYGAACoDAAwhwYBANcKACGLBgEA2AoAIYwGAQDXCgAhjQYBANgKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHcBgEA1woAIQEAAABTACAfBwAAoAsAIAkAAK8MACAZAAC4DAAgGwAAsAwAIB0AALkMACCEBgAAtQwAMIUGAABVABCGBgAAtQwAMIcGAQDXCgAhjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACGzBgEA1woAIb8GAAC3DJAHItcGEACPDAAh2AYBANcKACHZBgIAkAwAIegGAQDXCgAh_AYBANcKACH9BgEA2AoAIf4GAQDYCgAh_wYBANgKACGABwEA2AoAIYEHAQDYCgAhggcAAJIMACCDB0AAgwwAIYwHAQDXCgAhjgcAALYMjgcikAcBANcKACGRB0AA2woAIQwHAADkEQAgCQAAwhkAIBkAAMUZACAbAADEGQAgHQAAxhkAIP0GAADeDAAg_gYAAN4MACD_BgAA3gwAIIAHAADeDAAggQcAAN4MACCCBwAA3gwAIIMHAADeDAAgHwcAAKALACAJAACvDAAgGQAAuAwAIBsAALAMACAdAAC5DAAghAYAALUMADCFBgAAVQAQhgYAALUMADCHBgEAAAABjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACGzBgEA1woAIb8GAAC3DJAHItcGEACPDAAh2AYBANcKACHZBgIAkAwAIegGAQDXCgAh_AYBAAAAAf0GAQDYCgAh_gYBAAAAAf8GAQDYCgAhgAcBANgKACGBBwEA2AoAIYIHAACSDAAggwdAAIMMACGMBwEA1woAIY4HAAC2DI4HIpAHAQDXCgAhkQdAANsKACEDAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIAEAAABVACAaEAAApwwAIBgAAIQMACAZAAC0DAAgHgAAoAsAIB8AAKALACAgAADcCgAgIQAAogwAIIQGAACxDAAwhQYAAFsAEIYGAACxDAAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhsQYBANgKACGzBgEA2AoAIb8GAACzDJ0HIsEGQACDDAAhxAYBANgKACGbBwAAsgybByKdBwEA1woAIZ4HAQDXCgAhnwcBANcKACGgBwEA2AoAIaEHAQDYCgAhogcBANgKACGjB0AA2woAIQ4QAADBGQAgGAAAyQ4AIBkAAMUZACAeAADkEQAgHwAA5BEAICAAAMkOACAhAADCGQAgsQYAAN4MACCzBgAA3gwAIMEGAADeDAAgxAYAAN4MACCgBwAA3gwAIKEHAADeDAAgogcAAN4MACAaEAAApwwAIBgAAIQMACAZAAC0DAAgHgAAoAsAIB8AAKALACAgAADcCgAgIQAAogwAIIQGAACxDAAwhQYAAFsAEIYGAACxDAAwhwYBAAAAAY8GQADbCgAhkAZAANsKACGxBgEA2AoAIbMGAQDYCgAhvwYAALMMnQciwQZAAIMMACHEBgEA2AoAIZsHAACyDJsHIp0HAQDXCgAhngcBANcKACGfBwEA1woAIaAHAQDYCgAhoQcBANgKACGiBwEA2AoAIaMHQADbCgAhAwAAAFsAIAEAAFwAMAIAAF0AIAEAAABRACABAAAAUwAgAQAAAA4AIAEAAAAYACABAAAAJgAgAQAAAEQAIAEAAABLACABAAAAVQAgAQAAAFsAIAEAAAAYACABAAAARAAgAQAAABgAIA0HAACgCwAgCQAAogwAICUAAIULACCEBgAAqQwAMIUGAABrABCGBgAAqQwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACHgBgEA1woAIeYGAQDYCgAhAQAAAGsAIAEAAAAYACADAAAANQAgAQAANgAwAgAANwAgAQAAADUAIAEAAAAmACABAAAAOgAgAQAAAD8AIAMAAAAmACABAAAnADACAAAoACARBwAAoAsAIAkAAK8MACAbAACwDAAgHAAAiAsAIIQGAACuDAAwhQYAAHQAEIYGAACuDAAwhwYBANcKACGMBgEA1woAIY0GAQDXCgAhjwZAANsKACGQBkAA2woAIdgGAQDXCgAh6AYBANcKACGKByAA2goAIZIHEACPDAAhkwcQAI8MACEEBwAA5BEAIAkAAMIZACAbAADEGQAgHAAA6RAAIBIHAACgCwAgCQAArwwAIBsAALAMACAcAACICwAghAYAAK4MADCFBgAAdAAQhgYAAK4MADCHBgEAAAABjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACHYBgEA1woAIegGAQDXCgAhigcgANoKACGSBxAAjwwAIZMHEACPDAAh6AcAAK0MACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIAEAAAAxACABAAAANQAgAQAAACYAIAEAAAB0ACABAAAAVQAgAQAAABYAIAEAAAAYACABAAAAKgAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACABAAAAFgAgAQAAABgAIAopAACgDAAghAYAAKsMADCFBgAAhQEAEIYGAACrDAAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAKwM4gcixQYBANcKACHgB0AA2woAIQEpAADAGQAgCykAAKAMACCEBgAAqwwAMIUGAACFAQAQhgYAAKsMADCHBgEAAAABjwZAANsKACGQBkAA2woAIb8GAACsDOIHIsUGAQDXCgAh4AdAANsKACHnBwAAqgwAIAMAAACFAQAgAQAAhgEAMAIAAIcBACAbBwAAoAsAIAkAAKIMACAQAAChDAAgKQAAoAwAIIQGAACeDAAwhQYAAIkBABCGBgAAngwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACGxBgEA1woAIcUGAQDXCgAhxgYIAJ8MACHHBggAnwwAIcgGCACfDAAhyQYIAJ8MACHKBggAnwwAIcsGCACfDAAhzAYIAJ8MACHNBggAnwwAIc4GCACfDAAhzwYIAJ8MACHQBggAnwwAIdEGCACfDAAh0gYIAJ8MACEBAAAAiQEAIAEAAAAYACABAAAAGAAgAQAAAB0AIAEAAAAqACABAAAAhQEAIAMAAAA6ACABAAA7ADACAAA8ACABAAAAJgAgAQAAADoAIAMAAAAmACABAAAnADACAAAoACABAAAAIQAgAQAAACYAIAUHAADkEQAgCQAAwhkAICUAAOYQACCNBgAA3gwAIOYGAADeDAAgDQcAAKALACAJAACiDAAgJQAAhQsAIIQGAACpDAAwhQYAAGsAEIYGAACpDAAwhwYBAAAAAYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAh4AYBANcKACHmBgEA2AoAIQMAAABrACABAACWAQAwAgAAlwEAIAMAAAAhACABAAAiADACAAAjACADAAAANQAgAQAANgAwAgAANwAgAwAAAA4AIAEAAA8AMAIAABAAIAoDAADJDgAgBwAA5BEAIAkAAMIZACANAADnEAAgEwAAmBcAIBoAAMURACAcAADpEAAgIgAAoBcAIIsGAADeDAAgjQYAAN4MACATAwAA3AoAIAcAAKALACAJAACiDAAgDQAAhgsAIBMAANgLACAaAACUCwAgHAAAiAsAICIAAOALACCEBgAAqAwAMIUGAABTABCGBgAAqAwAMIcGAQAAAAGLBgEA2AoAIYwGAQDXCgAhjQYBANgKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHcBgEAAAABAwAAAFMAIAEAAJwBADACAACdAQAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACAXBwAAoAsAIAkAAKIMACAQAACnDAAgFgAApgwAIBgAAIQMACAzAADcCgAghAYAAKQMADCFBgAAoQEAEIYGAACkDAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIZwGAQDXCgAhsQYBANgKACG9BgEA2AoAIb8GAAClDL8GIsAGAQDYCgAhwQZAAIMMACHCBkAA2woAIcMGAQDXCgAhxAYBANgKACEMBwAA5BEAIAkAAMIZACAQAADBGQAgFgAAwxkAIBgAAMkOACAzAADJDgAgjQYAAN4MACCxBgAA3gwAIL0GAADeDAAgwAYAAN4MACDBBgAA3gwAIMQGAADeDAAgGAcAAKALACAJAACiDAAgEAAApwwAIBYAAKYMACAYAACEDAAgMwAA3AoAIIQGAACkDAAwhQYAAKEBABCGBgAApAwAMIcGAQAAAAGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIZwGAQDXCgAhsQYBANgKACG9BgEA2AoAIb8GAAClDL8GIsAGAQDYCgAhwQZAAIMMACHCBkAA2woAIcMGAQDXCgAhxAYBANgKACHmBwAAowwAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAQAAAKEBACABAAAAUQAgAQAAAA4AIAEAAAAYACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAEQAIAEAAEUAMAIAAEYAIBIHAADkEQAgCQAAwhkAIBAAAMEZACApAADAGQAgjQYAAN4MACDGBgAA3gwAIMcGAADeDAAgyAYAAN4MACDJBgAA3gwAIMoGAADeDAAgywYAAN4MACDMBgAA3gwAIM0GAADeDAAgzgYAAN4MACDPBgAA3gwAINAGAADeDAAg0QYAAN4MACDSBgAA3gwAIBsHAACgCwAgCQAAogwAIBAAAKEMACApAACgDAAghAYAAJ4MADCFBgAAiQEAEIYGAACeDAAwhwYBAAAAAYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhsQYBANcKACHFBgEAAAABxgYIAJ8MACHHBggAnwwAIcgGCACfDAAhyQYIAJ8MACHKBggAnwwAIcsGCACfDAAhzAYIAJ8MACHNBggAnwwAIc4GCACfDAAhzwYIAJ8MACHQBggAnwwAIdEGCACfDAAh0gYIAJ8MACEDAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAABVACABAABWADACAABXACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAACoAIAEAACsAMAIAACwAIAMAAABbACABAABcADACAABdACADAAAACwAgAQAADAAwAgAAAQAgAQAAAB0AIAEAAABrACABAAAAIQAgAQAAADUAIAEAAAAOACABAAAAUwAgAQAAACYAIAEAAAA6ACABAAAAoQEAIAEAAAA_ACABAAAARAAgAQAAAIkBACABAAAAdAAgAQAAAFUAIAEAAAAxACABAAAAKgAgAQAAAFsAIAEAAAALACABAAAAGAAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAABrACABAACWAQAwAgAAlwEAIA4HAACgCwAgKgAA3QsAIIQGAACcDAAwhQYAAMoBABCGBgAAnAwAMIcGAQDXCgAhjAYBANcKACGPBkAA2woAIZAGQADbCgAh4AYBANgKACHCBwEA1woAIcMHAQDXCgAhxAcCAJAMACHGBwAAnQzGByIDBwAA5BEAICoAAJ0XACDgBgAA3gwAIA4HAACgCwAgKgAA3QsAIIQGAACcDAAwhQYAAMoBABCGBgAAnAwAMIcGAQAAAAGMBgEA1woAIY8GQADbCgAhkAZAANsKACHgBgEA2AoAIcIHAQDXCgAhwwcBANcKACHEBwIAkAwAIcYHAACdDMYHIgMAAADKAQAgAQAAywEAMAIAAMwBACADAAAANQAgAQAANgAwAgAANwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAALACABAAAMADACAAABACADAAAADgAgAQAADwAwAgAAEAAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACAiBwAAmwwAID0AANwKACA-AACEDAAgQAAA3AsAIIQGAACWDAAwhQYAANUBABCGBgAAlgwAMIcGAQDXCgAhjAYBANgKACGPBkAA2woAIZAGQADbCgAhvwYAAJoMvQciwQZAAIMMACHmBgEA2AoAIagHAQDYCgAhqQcBANcKACGqBwEA1woAIasHAQDYCgAhrQcAAMwLrQcjrgcBANgKACGvBwAAlwzVBiOwBxAAmAwAIbEHAQDXCgAhsgcCAJkMACGzBwAAkQz8BiK0BwEA2AoAIbUHAQDYCgAhtgcBANgKACG3BwEA2AoAIbgHAQDYCgAhuQcBANgKACG6BwAAkgwAILsHQACDDAAhvQcBANgKACEXBwAA5BEAID0AAMkOACA-AADJDgAgQAAAnBcAIIwGAADeDAAgwQYAAN4MACDmBgAA3gwAIKgHAADeDAAgqwcAAN4MACCtBwAA3gwAIK4HAADeDAAgrwcAAN4MACCwBwAA3gwAILIHAADeDAAgtAcAAN4MACC1BwAA3gwAILYHAADeDAAgtwcAAN4MACC4BwAA3gwAILkHAADeDAAgugcAAN4MACC7BwAA3gwAIL0HAADeDAAgIgcAAJsMACA9AADcCgAgPgAAhAwAIEAAANwLACCEBgAAlgwAMIUGAADVAQAQhgYAAJYMADCHBgEAAAABjAYBANgKACGPBkAA2woAIZAGQADbCgAhvwYAAJoMvQciwQZAAIMMACHmBgEA2AoAIagHAQDYCgAhqQcBANcKACGqBwEA1woAIasHAQDYCgAhrQcAAMwLrQcjrgcBANgKACGvBwAAlwzVBiOwBxAAmAwAIbEHAQDXCgAhsgcCAJkMACGzBwAAkQz8BiK0BwEAAAABtQcBANgKACG2BwEAAAABtwcBANgKACG4BwEA2AoAIbkHAQDYCgAhugcAAJIMACC7B0AAgwwAIb0HAQDYCgAhAwAAANUBACABAADWAQAwAgAA1wEAIAEAAABRACABAAAAFgAgEQcAAKALACA_AACVDAAghAYAAJMMADCFBgAA2wEAEIYGAACTDAAwhwYBANcKACGMBgEA1woAIY8GQADbCgAhkAZAANsKACG_BgAAlAzXBiLTBgEA2AoAIdUGAACODNUGItcGEACPDAAh2AYBANcKACHZBgIAkAwAIdoGQADbCgAh2wZAANsKACEDBwAA5BEAID8AAL8ZACDTBgAA3gwAIBEHAACgCwAgPwAAlQwAIIQGAACTDAAwhQYAANsBABCGBgAAkwwAMIcGAQAAAAGMBgEA1woAIY8GQADbCgAhkAZAANsKACG_BgAAlAzXBiLTBgEA2AoAIdUGAACODNUGItcGEACPDAAh2AYBANcKACHZBgIAkAwAIdoGQADbCgAh2wZAANsKACEDAAAA2wEAIAEAANwBADACAADdAQAgAQAAANUBACABAAAA2wEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAEQAIAEAAEUAMAIAAEYAIAMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIBAHAACgCwAghAYAAJ8LADCFBgAA5wEAEIYGAACfCwAwhwYBANcKACGMBgEA1woAIY8GQADbCgAhkAZAANsKACGEBwEA1woAIYUHAQDXCgAhhgcBANcKACGHBwEA1woAIYgHAQDXCgAhiQcBANcKACGKByAA2goAIYsHAQDYCgAhAQAAAOcBACAWBwAAoAsAIIQGAACNDAAwhQYAAOkBABCGBgAAjQwAMIcGAQDXCgAhjAYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAJEM_AYi1QYAAI4M1QYi1wYQAI8MACHYBgEA1woAIdkGAgCQDAAh-gYBANcKACH8BgEA1woAIf0GAQDYCgAh_gYBANgKACH_BgEA2AoAIYAHAQDYCgAhgQcBANgKACGCBwAAkgwAIIMHQACDDAAhCAcAAOQRACD9BgAA3gwAIP4GAADeDAAg_wYAAN4MACCABwAA3gwAIIEHAADeDAAgggcAAN4MACCDBwAA3gwAIBYHAACgCwAghAYAAI0MADCFBgAA6QEAEIYGAACNDAAwhwYBAAAAAYwGAQDXCgAhjwZAANsKACGQBkAA2woAIb8GAACRDPwGItUGAACODNUGItcGEACPDAAh2AYBANcKACHZBgIAkAwAIfoGAQDXCgAh_AYBAAAAAf0GAQDYCgAh_gYBAAAAAf8GAQDYCgAhgAcBANgKACGBBwEA2AoAIYIHAACSDAAggwdAAIMMACEDAAAA6QEAIAEAAOoBADACAADrAQAgAwAAANsBACABAADcAQAwAgAA3QEAIAMAAAAxACABAAAyADACAAAzACADAAAAKgAgAQAAKwAwAgAALAAgDwcAAKALACBEAADcCgAgRgAAjAwAIEcAAPYLACCEBgAAiwwAMIUGAADwAQAQhgYAAIsMADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIbgGAQDXCgAhuQYBANcKACGYBwEA1woAIZkHAACKDJcHIgQHAADkEQAgRAAAyQ4AIEYAAL4ZACBHAAC0GQAgDwcAAKALACBEAADcCgAgRgAAjAwAIEcAAPYLACCEBgAAiwwAMIUGAADwAQAQhgYAAIsMADCHBgEAAAABjAYBANcKACGPBkAA2woAIZAGQADbCgAhuAYBANcKACG5BgEA1woAIZgHAQDXCgAhmQcAAIoMlwciAwAAAPABACABAADxAQAwAgAA8gEAIAhFAACHDAAghAYAAIkMADCFBgAA9AEAEIYGAACJDAAwhwYBANcKACGPBkAA2woAIZQHAQDXCgAhlwcAAIoMlwciAUUAAL0ZACAJRQAAhwwAIIQGAACJDAAwhQYAAPQBABCGBgAAiQwAMIcGAQAAAAGPBkAA2woAIZQHAQDXCgAhlwcAAIoMlwci5QcAAIgMACADAAAA9AEAIAEAAPUBADACAAD2AQAgCQMAANwKACBFAACHDAAghAYAAIYMADCFBgAA-AEAEIYGAACGDAAwhwYBANcKACGOBgEA1woAIZQHAQDXCgAhlQdAANsKACECAwAAyQ4AIEUAAL0ZACAKAwAA3AoAIEUAAIcMACCEBgAAhgwAMIUGAAD4AQAQhgYAAIYMADCHBgEAAAABjgYBANcKACGUBwEA1woAIZUHQADbCgAh5AcAAIUMACADAAAA-AEAIAEAAPkBADACAAD6AQAgAQAAAPQBACABAAAA-AEAIBAHAACgCwAgIAAA3AoAID4AAIQMACCEBgAAgAwAMIUGAAD-AQAQhgYAAIAMADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIb8GAACCDKcHIsEGQACDDAAhnwcBANcKACGlBwAAgQylByKnBwEA2AoAIagHAQDYCgAhBgcAAOQRACAgAADJDgAgPgAAyQ4AIMEGAADeDAAgpwcAAN4MACCoBwAA3gwAIBAHAACgCwAgIAAA3AoAID4AAIQMACCEBgAAgAwAMIUGAAD-AQAQhgYAAIAMADCHBgEAAAABjAYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAIIMpwciwQZAAIMMACGfBwEA1woAIaUHAACBDKUHIqcHAQDYCgAhqAcBANgKACEDAAAA_gEAIAEAAP8BADACAACAAgAgAQAAAFEAIAMAAABbACABAABcADACAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAQAAABIAIAEAAAAdACABAAAAawAgAQAAAMoBACABAAAANQAgAQAAACEAIAEAAAALACABAAAADgAgAQAAAFMAIAEAAAAmACABAAAAOgAgAQAAANUBACABAAAAoQEAIAEAAAA_ACABAAAARAAgAQAAAIkBACABAAAAdAAgAQAAAFUAIAEAAADpAQAgAQAAANsBACABAAAAMQAgAQAAACoAIAEAAADwAQAgAQAAAP4BACABAAAAWwAgAQAAAFsAIAMAAAAmACABAAAnADACAAAoACADAAAAOgAgAQAAOwAwAgAAPAAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAAAmACABAAAAOgAgAQAAAD8AIAEAAAChAQAgAQAAAIkBACABAAAAWwAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAANUBACABAADWAQAwAgAA1wEAIAMAAADVAQAgAQAA1gEAMAIAANcBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAKEBACABAACiAQAwAgAAowEAIBEzAADcCgAghAYAANYKADCFBgAAsAIAEIYGAADWCgAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhnAYBANcKACGdBgEA1woAIZ4GAQDXCgAhnwYBANcKACGgBgEA2AoAIaEGAADQCgAgogYAANAKACCjBgAA2QoAIKQGAADZCgAgpQYgANoKACEBAAAAsAIAIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgDRcAANwKACCEBgAAgQsAMIUGAAC0AgAQhgYAAIELADCHBgEA1woAIY8GQADbCgAhkAZAANsKACGdBgEA1woAIZ4GAQDXCgAhowYAANkKACClBiAA2goAId4GAQDXCgAh3wYAANAKACABAAAAtAIAIAoDAADcCgAghAYAAP8LADCFBgAAtgIAEIYGAAD_CwAwhwYBANcKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHHBwEA1woAIcgHQADbCgAhAQMAAMkOACAKAwAA3AoAIIQGAAD_CwAwhQYAALYCABCGBgAA_wsAMIcGAQAAAAGOBgEAAAABjwZAANsKACGQBkAA2woAIccHAQDXCgAhyAdAANsKACEDAAAAtgIAIAEAALcCADACAAC4AgAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACADAAAA_gEAIAEAAP8BADACAACAAgAgAwAAAP4BACABAAD_AQAwAgAAgAIAIAMAAADwAQAgAQAA8QEAMAIAAPIBACADAAAA-AEAIAEAAPkBADACAAD6AQAgAQAAAAMAIAEAAAAHACABAAAACwAgAQAAAA4AIAEAAABTACABAAAA1QEAIAEAAADVAQAgAQAAAKEBACABAAAAoQEAIAEAAABLACABAAAASwAgAQAAALYCACABAAAAWwAgAQAAAFsAIAEAAAD-AQAgAQAAAP4BACABAAAA8AEAIAEAAAD4AQAgAQAAABgAIAEAAAABACADAAAACwAgAQAADAAwAgAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACAKAwAAuxQAIAcAAMEVACBbAAC8FAAghwYBAAAAAYwGAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAGXBwAAAOMHAuMHAQAAAAEBYQAA1wIAIAeHBgEAAAABjAYBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAZcHAAAA4wcC4wcBAAAAAQFhAADZAgAwAWEAANkCADABAAAAGAAgCgMAALgUACAHAAC_FQAgWwAAuRQAIIcGAQDiDAAhjAYBAOIMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACGXBwAAthTjByLjBwEA4wwAIQIAAAABACBhAADdAgAgB4cGAQDiDAAhjAYBAOIMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACGXBwAAthTjByLjBwEA4wwAIQIAAAALACBhAADfAgAgAgAAAAsAIGEAAN8CACABAAAAGAAgAwAAAAEAIGgAANcCACBpAADdAgAgAQAAAAEAIAEAAAALACAEFQAAuhkAIG4AALwZACBvAAC7GQAg4wcAAN4MACAKhAYAAPsLADCFBgAA5wIAEIYGAAD7CwAwhwYBAMQKACGMBgEAxAoAIY4GAQDECgAhjwZAAMYKACGQBkAAxgoAIZcHAAD8C-MHIuMHAQDFCgAhAwAAAAsAIAEAAOYCADBtAADnAgAgAwAAAAsAIAEAAAwAMAIAAAEAIAEAAACHAQAgAQAAAIcBACADAAAAhQEAIAEAAIYBADACAACHAQAgAwAAAIUBACABAACGAQAwAgAAhwEAIAMAAACFAQAgAQAAhgEAMAIAAIcBACAHKQAAuRkAIIcGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAA4gcCxQYBAAAAAeAHQAAAAAEBYQAA7wIAIAaHBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAOIHAsUGAQAAAAHgB0AAAAABAWEAAPECADABYQAA8QIAMAcpAAC4GQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAAJQO4gcixQYBAOIMACHgB0AA5AwAIQIAAACHAQAgYQAA9AIAIAaHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAAlA7iByLFBgEA4gwAIeAHQADkDAAhAgAAAIUBACBhAAD2AgAgAgAAAIUBACBhAAD2AgAgAwAAAIcBACBoAADvAgAgaQAA9AIAIAEAAACHAQAgAQAAAIUBACADFQAAtRkAIG4AALcZACBvAAC2GQAgCYQGAAD3CwAwhQYAAP0CABCGBgAA9wsAMIcGAQDECgAhjwZAAMYKACGQBkAAxgoAIb8GAAD4C-IHIsUGAQDECgAh4AdAAMYKACEDAAAAhQEAIAEAAPwCADBtAAD9AgAgAwAAAIUBACABAACGAQAwAgAAhwEAICYEAADxCwAgBQAA8gsAIAYAANILACAQAADTCwAgGQAA1AsAIDQAAJcLACBBAADWCwAgTgAA1gsAIE8AAJcLACBQAADzCwAgUQAAlAsAIFIAAJQLACBTAAD0CwAgVAAA9QsAIFUAAOALACBWAADgCwAgVwAA3wsAIFgAAN8LACBZAADeCwAgWgAA9gsAIIQGAADwCwAwhQYAAFEAEIYGAADwCwAwhwYBAAAAAYsGAQDYCgAhjwZAANsKACGQBkAA2woAIeAGAQDXCgAhlwcBANcKACHXBwEAAAAB2AcgANoKACHZBwEA2AoAIdoHAQDYCgAh2wcBANgKACHcBwEA2AoAId0HAQDYCgAh3gcBANgKACHfBwEA1woAIQEAAACAAwAgAQAAAIADACAbBAAArxkAIAUAALAZACAGAACSFwAgEAAAkxcAIBkAAJQXACA0AADWEQAgQQAAlhcAIE4AAJYXACBPAADWEQAgUAAAsRkAIFEAAMURACBSAADFEQAgUwAAshkAIFQAALMZACBVAACgFwAgVgAAoBcAIFcAAJ8XACBYAACfFwAgWQAAnhcAIFoAALQZACCLBgAA3gwAINkHAADeDAAg2gcAAN4MACDbBwAA3gwAINwHAADeDAAg3QcAAN4MACDeBwAA3gwAIAMAAABRACABAACDAwAwAgAAgAMAIAMAAABRACABAACDAwAwAgAAgAMAIAMAAABRACABAACDAwAwAgAAgAMAICMEAACbGQAgBQAAnBkAIAYAAJ0ZACAQAACeGQAgGQAAnxkAIDQAAKIZACBBAACgGQAgTgAAoRkAIE8AAKMZACBQAACkGQAgUQAApRkAIFIAAKYZACBTAACnGQAgVAAAqBkAIFUAAKkZACBWAACqGQAgVwAAqxkAIFgAAKwZACBZAACtGQAgWgAArhkAIIcGAQAAAAGLBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAABlwcBAAAAAdcHAQAAAAHYByAAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwEAAAAB3wcBAAAAAQFhAACHAwAgD4cGAQAAAAGLBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAABlwcBAAAAAdcHAQAAAAHYByAAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwEAAAAB3wcBAAAAAQFhAACJAwAwAWEAAIkDADAjBAAA0hcAIAUAANMXACAGAADUFwAgEAAA1RcAIBkAANYXACA0AADZFwAgQQAA1xcAIE4AANgXACBPAADaFwAgUAAA2xcAIFEAANwXACBSAADdFwAgUwAA3hcAIFQAAN8XACBVAADgFwAgVgAA4RcAIFcAAOIXACBYAADjFwAgWQAA5BcAIFoAAOUXACCHBgEA4gwAIYsGAQDjDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAhlwcBAOIMACHXBwEA4gwAIdgHIADEDgAh2QcBAOMMACHaBwEA4wwAIdsHAQDjDAAh3AcBAOMMACHdBwEA4wwAId4HAQDjDAAh3wcBAOIMACECAAAAgAMAIGEAAIwDACAPhwYBAOIMACGLBgEA4wwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIZcHAQDiDAAh1wcBAOIMACHYByAAxA4AIdkHAQDjDAAh2gcBAOMMACHbBwEA4wwAIdwHAQDjDAAh3QcBAOMMACHeBwEA4wwAId8HAQDiDAAhAgAAAFEAIGEAAI4DACACAAAAUQAgYQAAjgMAIAMAAACAAwAgaAAAhwMAIGkAAIwDACABAAAAgAMAIAEAAABRACAKFQAAzxcAIG4AANEXACBvAADQFwAgiwYAAN4MACDZBwAA3gwAINoHAADeDAAg2wcAAN4MACDcBwAA3gwAIN0HAADeDAAg3gcAAN4MACAShAYAAO8LADCFBgAAlQMAEIYGAADvCwAwhwYBAMQKACGLBgEAxQoAIY8GQADGCgAhkAZAAMYKACHgBgEAxAoAIZcHAQDECgAh1wcBAMQKACHYByAA0goAIdkHAQDFCgAh2gcBAMUKACHbBwEAxQoAIdwHAQDFCgAh3QcBAMUKACHeBwEAxQoAId8HAQDECgAhAwAAAFEAIAEAAJQDADBtAACVAwAgAwAAAFEAIAEAAIMDADACAACAAwAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAAzhcAIIcGAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAHIB0AAAAAB1AcBAAAAAdUHAQAAAAHWBwEAAAABAWEAAJ0DACAIhwYBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAcgHQAAAAAHUBwEAAAAB1QcBAAAAAdYHAQAAAAEBYQAAnwMAMAFhAACfAwAwCQMAAM0XACCHBgEA4gwAIY4GAQDiDAAhjwZAAOQMACGQBkAA5AwAIcgHQADkDAAh1AcBAOIMACHVBwEA4wwAIdYHAQDjDAAhAgAAAAUAIGEAAKIDACAIhwYBAOIMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACHIB0AA5AwAIdQHAQDiDAAh1QcBAOMMACHWBwEA4wwAIQIAAAADACBhAACkAwAgAgAAAAMAIGEAAKQDACADAAAABQAgaAAAnQMAIGkAAKIDACABAAAABQAgAQAAAAMAIAUVAADKFwAgbgAAzBcAIG8AAMsXACDVBwAA3gwAINYHAADeDAAgC4QGAADuCwAwhQYAAKsDABCGBgAA7gsAMIcGAQDECgAhjgYBAMQKACGPBkAAxgoAIZAGQADGCgAhyAdAAMYKACHUBwEAxAoAIdUHAQDFCgAh1gcBAMUKACEDAAAAAwAgAQAAqgMAMG0AAKsDACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAAyRcAIIcGAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAHLBwEAAAABzAcBAAAAAc0HAQAAAAHOBwEAAAABzwcBAAAAAdAHQAAAAAHRB0AAAAAB0gcBAAAAAdMHAQAAAAEBYQAAswMAIA2HBgEAAAABjgYBAAAAAY8GQAAAAAGQBkAAAAABywcBAAAAAcwHAQAAAAHNBwEAAAABzgcBAAAAAc8HAQAAAAHQB0AAAAAB0QdAAAAAAdIHAQAAAAHTBwEAAAABAWEAALUDADABYQAAtQMAMA4DAADIFwAghwYBAOIMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACHLBwEA4gwAIcwHAQDiDAAhzQcBAOMMACHOBwEA4wwAIc8HAQDjDAAh0AdAAPoMACHRB0AA-gwAIdIHAQDjDAAh0wcBAOMMACECAAAACQAgYQAAuAMAIA2HBgEA4gwAIY4GAQDiDAAhjwZAAOQMACGQBkAA5AwAIcsHAQDiDAAhzAcBAOIMACHNBwEA4wwAIc4HAQDjDAAhzwcBAOMMACHQB0AA-gwAIdEHQAD6DAAh0gcBAOMMACHTBwEA4wwAIQIAAAAHACBhAAC6AwAgAgAAAAcAIGEAALoDACADAAAACQAgaAAAswMAIGkAALgDACABAAAACQAgAQAAAAcAIAoVAADFFwAgbgAAxxcAIG8AAMYXACDNBwAA3gwAIM4HAADeDAAgzwcAAN4MACDQBwAA3gwAINEHAADeDAAg0gcAAN4MACDTBwAA3gwAIBCEBgAA7QsAMIUGAADBAwAQhgYAAO0LADCHBgEAxAoAIY4GAQDECgAhjwZAAMYKACGQBkAAxgoAIcsHAQDECgAhzAcBAMQKACHNBwEAxQoAIc4HAQDFCgAhzwcBAMUKACHQB0AA4QoAIdEHQADhCgAh0gcBAMUKACHTBwEAxQoAIQMAAAAHACABAADAAwAwbQAAwQMAIAMAAAAHACABAAAIADACAAAJACAJhAYAAOwLADCFBgAAxwMAEIYGAADsCwAwhwYBAAAAAY8GQADbCgAhkAZAANsKACHIB0AA2woAIckHAQDXCgAhygcBANcKACEBAAAAxAMAIAEAAADEAwAgCYQGAADsCwAwhQYAAMcDABCGBgAA7AsAMIcGAQDXCgAhjwZAANsKACGQBkAA2woAIcgHQADbCgAhyQcBANcKACHKBwEA1woAIQADAAAAxwMAIAEAAMgDADACAADEAwAgAwAAAMcDACABAADIAwAwAgAAxAMAIAMAAADHAwAgAQAAyAMAMAIAAMQDACAGhwYBAAAAAY8GQAAAAAGQBkAAAAAByAdAAAAAAckHAQAAAAHKBwEAAAABAWEAAMwDACAGhwYBAAAAAY8GQAAAAAGQBkAAAAAByAdAAAAAAckHAQAAAAHKBwEAAAABAWEAAM4DADABYQAAzgMAMAaHBgEA4gwAIY8GQADkDAAhkAZAAOQMACHIB0AA5AwAIckHAQDiDAAhygcBAOIMACECAAAAxAMAIGEAANEDACAGhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhyAdAAOQMACHJBwEA4gwAIcoHAQDiDAAhAgAAAMcDACBhAADTAwAgAgAAAMcDACBhAADTAwAgAwAAAMQDACBoAADMAwAgaQAA0QMAIAEAAADEAwAgAQAAAMcDACADFQAAwhcAIG4AAMQXACBvAADDFwAgCYQGAADrCwAwhQYAANoDABCGBgAA6wsAMIcGAQDECgAhjwZAAMYKACGQBkAAxgoAIcgHQADGCgAhyQcBAMQKACHKBwEAxAoAIQMAAADHAwAgAQAA2QMAMG0AANoDACADAAAAxwMAIAEAAMgDADACAADEAwAgAQAAALgCACABAAAAuAIAIAMAAAC2AgAgAQAAtwIAMAIAALgCACADAAAAtgIAIAEAALcCADACAAC4AgAgAwAAALYCACABAAC3AgAwAgAAuAIAIAcDAADBFwAghwYBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAccHAQAAAAHIB0AAAAABAWEAAOIDACAGhwYBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAccHAQAAAAHIB0AAAAABAWEAAOQDADABYQAA5AMAMAcDAADAFwAghwYBAOIMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACHHBwEA4gwAIcgHQADkDAAhAgAAALgCACBhAADnAwAgBocGAQDiDAAhjgYBAOIMACGPBkAA5AwAIZAGQADkDAAhxwcBAOIMACHIB0AA5AwAIQIAAAC2AgAgYQAA6QMAIAIAAAC2AgAgYQAA6QMAIAMAAAC4AgAgaAAA4gMAIGkAAOcDACABAAAAuAIAIAEAAAC2AgAgAxUAAL0XACBuAAC_FwAgbwAAvhcAIAmEBgAA6gsAMIUGAADwAwAQhgYAAOoLADCHBgEAxAoAIY4GAQDECgAhjwZAAMYKACGQBkAAxgoAIccHAQDECgAhyAdAAMYKACEDAAAAtgIAIAEAAO8DADBtAADwAwAgAwAAALYCACABAAC3AgAwAgAAuAIAIAEAAACXAQAgAQAAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACAKBwAA0xYAIAkAAIAVACAlAACBFQAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAAB5gYBAAAAAQFhAAD4AwAgB4cGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAeYGAQAAAAEBYQAA-gMAMAFhAAD6AwAwAQAAABgAIAoHAADRFgAgCQAA9BQAICUAAPUUACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAh4AYBAOIMACHmBgEA4wwAIQIAAACXAQAgYQAA_gMAIAeHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAh4AYBAOIMACHmBgEA4wwAIQIAAABrACBhAACABAAgAgAAAGsAIGEAAIAEACABAAAAGAAgAwAAAJcBACBoAAD4AwAgaQAA_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_B0AAAAABAWEAAL4EACAMhwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGzBgEAAAAB6AYBAAAAAfgGAQAAAAG_B0AAAAABAWEAAMAEADABYQAAwAQAMAEAAAAYACABAAAAHQAgFwcAAIIOACAJAAD_DQAgCgAAgA4AIAsAAPkNACAOAAD-DQAgDwAA_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_wQAMG0AAIAFACADAAAAEgAgAQAAEwAwAgAAFAAgJgYAANILACAMAACECwAgDQAAhgsAIBEAANULACAcAACICwAgJQAAhQsAICcAAIcLACAqAADdCwAgLgAAzgsAIC8AAM8LACAwAADRCwAgMQAA0wsAIDIAANQLACA0AACXCwAgNQAA1wsAIDYAANgLACA3AADZCwAgOwAAzQsAIDwAANALACBAAADcCwAgQQAA1gsAIEIAANoLACBDAADbCwAgSAAA3gsAIEkAAN8LACBKAADgCwAgSwAA4AsAIIQGAADLCwAwhQYAABYAEIYGAADLCwAwhwYBAAAAAY8GQADbCgAhkAZAANsKACG7BgAAzAutByPgBgEA1woAIeYGAQDYCgAhqwcBANgKACGuBwEA2AoAIQEAAACDBQAgAQAAAIMFACAfBgAAkhcAIAwAAOUQACANAADnEAAgEQAAlRcAIBwAAOkQACAlAADmEAAgJwAA6BAAICoAAJ0XACAuAACOFwAgLwAAjxcAIDAAAJEXACAxAACTFwAgMgAAlBcAIDQAANYRACA1AACXFwAgNgAAmBcAIDcAAJkXACA7AACNFwAgPAAAkBcAIEAAAJwXACBBAACWFwAgQgAAmhcAIEMAAJsXACBIAACeFwAgSQAAnxcAIEoAAKAXACBLAACgFwAguwYAAN4MACDmBgAA3gwAIKsHAADeDAAgrgcAAN4MACADAAAAFgAgAQAAhgUAMAIAAIMFACADAAAAFgAgAQAAhgUAMAIAAIMFACADAAAAFgAgAQAAhgUAMAIAAIMFACAjBgAA-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA7AADyFgAgPAAA9RYAIEAAAIYXACBBAAD9FgAgQgAAhBcAIEMAAIUXACBIAACJFwAgSQAAihcAIEoAAIsXACBLAACMFwAghwYBAAAAAY8GQAAAAAGQBkAAAAABuwYAAACtBwPgBgEAAAAB5gYBAAAAAasHAQAAAAGuBwEAAAABAWEAAIoFACAIhwYBAAAAAY8GQAAAAAGQBkAAAAABuwYAAACtBwPgBgEAAAAB5gYBAAAAAasHAQAAAAGuBwEAAAABAWEAAIwFADABYQAAjAUAMCMGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAIQIAAACDBQAgYQAAjwUAIAiHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAIQIAAAAWACBhAACRBQAgAgAAABYAIGEAAJEFACADAAAAgwUAIGgAAIoFACBpAACPBQAgAQAAAIMFACABAAAAFgAgBxUAAMwSACBuAADOEgAgbwAAzRIAILsGAADeDAAg5gYAAN4MACCrBwAA3gwAIK4HAADeDAAgC4QGAADKCwAwhQYAAJgFABCGBgAAygsAMIcGAQDECgAhjwZAAMYKACGQBkAAxgoAIbsGAAC-C60HI-AGAQDECgAh5gYBAMUKACGrBwEAxQoAIa4HAQDFCgAhAwAAABYAIAEAAJcFADBtAACYBQAgAwAAABYAIAEAAIYFADACAACDBQAgAQAAANcBACABAAAA1wEAIAMAAADVAQAgAQAA1gEAMAIAANcBACADAAAA1QEAIAEAANYBADACAADXAQAgAwAAANUBACABAADWAQAwAgAA1wEAIB8HAADKEgAgPQAAyBIAID4AAMkSACBAAADLEgAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAAvQcCwQZAAAAAAeYGAQAAAAGoBwEAAAABqQcBAAAAAaoHAQAAAAGrBwEAAAABrQcAAACtBwOuBwEAAAABrwcAAADVBgOwBxAAAAABsQcBAAAAAbIHAgAAAAGzBwAAAPwGArQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAboHgAAAAAG7B0AAAAABvQcBAAAAAQFhAACgBQAgG4cGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAL0HAsEGQAAAAAHmBgEAAAABqAcBAAAAAakHAQAAAAGqBwEAAAABqwcBAAAAAa0HAAAArQcDrgcBAAAAAa8HAAAA1QYDsAcQAAAAAbEHAQAAAAGyBwIAAAABswcAAAD8BgK0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAG6B4AAAAABuwdAAAAAAb0HAQAAAAEBYQAAogUAMAFhAACiBQAwAQAAAFEAIAEAAAAWACAfBwAAuhIAID0AALgSACA-AAC5EgAgQAAAuxIAIIcGAQDiDAAhjAYBAOMMACGPBkAA5AwAIZAGQADkDAAhvwYAALcSvQciwQZAAPoMACHmBgEA4wwAIagHAQDjDAAhqQcBAOIMACGqBwEA4gwAIasHAQDjDAAhrQcAALQSrQcjrgcBAOMMACGvBwAAtRLVBiOwBxAAthIAIbEHAQDiDAAhsgcCAJgQACGzBwAA3BH8BiK0BwEA4wwAIbUHAQDjDAAhtgcBAOMMACG3BwEA4wwAIbgHAQDjDAAhuQcBAOMMACG6B4AAAAABuwdAAPoMACG9BwEA4wwAIQIAAADXAQAgYQAApwUAIBuHBgEA4gwAIYwGAQDjDAAhjwZAAOQMACGQBkAA5AwAIb8GAAC3Er0HIsEGQAD6DAAh5gYBAOMMACGoBwEA4wwAIakHAQDiDAAhqgcBAOIMACGrBwEA4wwAIa0HAAC0Eq0HI64HAQDjDAAhrwcAALUS1QYjsAcQALYSACGxBwEA4gwAIbIHAgCYEAAhswcAANwR_AYitAcBAOMMACG1BwEA4wwAIbYHAQDjDAAhtwcBAOMMACG4BwEA4wwAIbkHAQDjDAAhugeAAAAAAbsHQAD6DAAhvQcBAOMMACECAAAA1QEAIGEAAKkFACACAAAA1QEAIGEAAKkFACABAAAAUQAgAQAAABYAIAMAAADXAQAgaAAAoAUAIGkAAKcFACABAAAA1wEAIAEAAADVAQAgGBUAAK8SACBuAACyEgAgbwAAsRIAIPABAACwEgAg8QEAALMSACCMBgAA3gwAIMEGAADeDAAg5gYAAN4MACCoBwAA3gwAIKsHAADeDAAgrQcAAN4MACCuBwAA3gwAIK8HAADeDAAgsAcAAN4MACCyBwAA3gwAILQHAADeDAAgtQcAAN4MACC2BwAA3gwAILcHAADeDAAguAcAAN4MACC5BwAA3gwAILoHAADeDAAguwcAAN4MACC9BwAA3gwAIB6EBgAAvQsAMIUGAACyBQAQhgYAAL0LADCHBgEAxAoAIYwGAQDFCgAhjwZAAMYKACGQBkAAxgoAIb8GAADBC70HIsEGQADhCgAh5gYBAMUKACGoBwEAxQoAIakHAQDECgAhqgcBAMQKACGrBwEAxQoAIa0HAAC-C60HI64HAQDFCgAhrwcAAL8L1QYjsAcQAMALACGxBwEAxAoAIbIHAgCKCwAhswcAAJkL_AYitAcBAMUKACG1BwEAxQoAIbYHAQDFCgAhtwcBAMUKACG4BwEAxQoAIbkHAQDFCgAhugcAAJoLACC7B0AA4QoAIb0HAQDFCgAhAwAAANUBACABAACxBQAwbQAAsgUAIAMAAADVAQAgAQAA1gEAMAIAANcBACABAAAAgAIAIAEAAACAAgAgAwAAAP4BACABAAD_AQAwAgAAgAIAIAMAAAD-AQAgAQAA_wEAMAIAAIACACADAAAA_gEAIAEAAP8BADACAACAAgAgDQcAAK0SACAgAACsEgAgPgAArhIAIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAKcHAsEGQAAAAAGfBwEAAAABpQcAAAClBwKnBwEAAAABqAcBAAAAAQFhAAC6BQAgCocGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAKcHAsEGQAAAAAGfBwEAAAABpQcAAAClBwKnBwEAAAABqAcBAAAAAQFhAAC8BQAwAWEAALwFADABAAAAUQAgDQcAAKoSACAgAACpEgAgPgAAqxIAIIcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAAKgSpwciwQZAAPoMACGfBwEA4gwAIaUHAACnEqUHIqcHAQDjDAAhqAcBAOMMACECAAAAgAIAIGEAAMAFACAKhwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAAqBKnByLBBkAA-gwAIZ8HAQDiDAAhpQcAAKcSpQcipwcBAOMMACGoBwEA4wwAIQIAAAD-AQAgYQAAwgUAIAIAAAD-AQAgYQAAwgUAIAEAAABRACADAAAAgAIAIGgAALoFACBpAADABQAgAQAAAIACACABAAAA_gEAIAYVAACkEgAgbgAAphIAIG8AAKUSACDBBgAA3gwAIKcHAADeDAAgqAcAAN4MACANhAYAALYLADCFBgAAygUAEIYGAAC2CwAwhwYBAMQKACGMBgEAxAoAIY8GQADGCgAhkAZAAMYKACG_BgAAuAunByLBBkAA4QoAIZ8HAQDECgAhpQcAALcLpQcipwcBAMUKACGoBwEAxQoAIQMAAAD-AQAgAQAAyQUAMG0AAMoFACADAAAA_gEAIAEAAP8BADACAACAAgAgAQAAAF0AIAEAAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACAXEAAAhQ8AIBgAAIYNACAZAACHDQAgHgAAgw0AIB8AAIQNACAgAACFDQAgIQAAiA0AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHAQAAAAGiBwEAAAABowdAAAAAAQFhAADSBQAgEIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHAQAAAAGiBwEAAAABowdAAAAAAQFhAADUBQAwAWEAANQFADABAAAAUQAgAQAAAFMAIAEAAAAOACABAAAAGAAgFxAAAIMPACAYAAD_DAAgGQAAgA0AIB4AAPwMACAfAAD9DAAgIAAA_gwAICEAAIENACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACGxBgEA4wwAIbMGAQDjDAAhvwYAAPkMnQciwQZAAPoMACHEBgEA4wwAIZsHAAD4DJsHIp0HAQDiDAAhngcBAOIMACGfBwEA4gwAIaAHAQDjDAAhoQcBAOMMACGiBwEA4wwAIaMHQADkDAAhAgAAAF0AIGEAANsFACAQhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhsQYBAOMMACGzBgEA4wwAIb8GAAD5DJ0HIsEGQAD6DAAhxAYBAOMMACGbBwAA-AybByKdBwEA4gwAIZ4HAQDiDAAhnwcBAOIMACGgBwEA4wwAIaEHAQDjDAAhogcBAOMMACGjB0AA5AwAIQIAAABbACBhAADdBQAgAgAAAFsAIGEAAN0FACABAAAAUQAgAQAAAFMAIAEAAAAOACABAAAAGAAgAwAAAF0AIGgAANIFACBpAADbBQAgAQAAAF0AIAEAAABbACAKFQAAoRIAIG4AAKMSACBvAACiEgAgsQYAAN4MACCzBgAA3gwAIMEGAADeDAAgxAYAAN4MACCgBwAA3gwAIKEHAADeDAAgogcAAN4MACAThAYAAK8LADCFBgAA6AUAEIYGAACvCwAwhwYBAMQKACGPBkAAxgoAIZAGQADGCgAhsQYBAMUKACGzBgEAxQoAIb8GAACxC50HIsEGQADhCgAhxAYBAMUKACGbBwAAsAubByKdBwEAxAoAIZ4HAQDECgAhnwcBAMQKACGgBwEAxQoAIaEHAQDFCgAhogcBAMUKACGjB0AAxgoAIQMAAABbACABAADnBQAwbQAA6AUAIAMAAABbACABAABcADACAABdACABAAAA8gEAIAEAAADyAQAgAwAAAPABACABAADxAQAwAgAA8gEAIAMAAADwAQAgAQAA8QEAMAIAAPIBACADAAAA8AEAIAEAAPEBADACAADyAQAgDAcAAJ0SACBEAACeEgAgRgAAnxIAIEcAAKASACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABuAYBAAAAAbkGAQAAAAGYBwEAAAABmQcAAACXBwIBYQAA8AUAIAiHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABuAYBAAAAAbkGAQAAAAGYBwEAAAABmQcAAACXBwIBYQAA8gUAMAFhAADyBQAwDAcAAIESACBEAACCEgAgRgAAgxIAIEcAAIQSACCHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbgGAQDiDAAhuQYBAOIMACGYBwEA4gwAIZkHAAD7EZcHIgIAAADyAQAgYQAA9QUAIAiHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbgGAQDiDAAhuQYBAOIMACGYBwEA4gwAIZkHAAD7EZcHIgIAAADwAQAgYQAA9wUAIAIAAADwAQAgYQAA9wUAIAMAAADyAQAgaAAA8AUAIGkAAPUFACABAAAA8gEAIAEAAADwAQAgAxUAAP4RACBuAACAEgAgbwAA_xEAIAuEBgAArgsAMIUGAAD-BQAQhgYAAK4LADCHBgEAxAoAIYwGAQDECgAhjwZAAMYKACGQBkAAxgoAIbgGAQDECgAhuQYBAMQKACGYBwEAxAoAIZkHAACrC5cHIgMAAADwAQAgAQAA_QUAMG0AAP4FACADAAAA8AEAIAEAAPEBADACAADyAQAgAQAAAPYBACABAAAA9gEAIAMAAAD0AQAgAQAA9QEAMAIAAPYBACADAAAA9AEAIAEAAPUBADACAAD2AQAgAwAAAPQBACABAAD1AQAwAgAA9gEAIAVFAAD9EQAghwYBAAAAAY8GQAAAAAGUBwEAAAABlwcAAACXBwIBYQAAhgYAIASHBgEAAAABjwZAAAAAAZQHAQAAAAGXBwAAAJcHAgFhAACIBgAwAWEAAIgGADAFRQAA_BEAIIcGAQDiDAAhjwZAAOQMACGUBwEA4gwAIZcHAAD7EZcHIgIAAAD2AQAgYQAAiwYAIASHBgEA4gwAIY8GQADkDAAhlAcBAOIMACGXBwAA-xGXByICAAAA9AEAIGEAAI0GACACAAAA9AEAIGEAAI0GACADAAAA9gEAIGgAAIYGACBpAACLBgAgAQAAAPYBACABAAAA9AEAIAMVAAD4EQAgbgAA-hEAIG8AAPkRACAHhAYAAKoLADCFBgAAlAYAEIYGAACqCwAwhwYBAMQKACGPBkAAxgoAIZQHAQDECgAhlwcAAKsLlwciAwAAAPQBACABAACTBgAwbQAAlAYAIAMAAAD0AQAgAQAA9QEAMAIAAPYBACABAAAA-gEAIAEAAAD6AQAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAMAAAD4AQAgAQAA-QEAMAIAAPoBACADAAAA-AEAIAEAAPkBADACAAD6AQAgBgMAAPcRACBFAAD2EQAghwYBAAAAAY4GAQAAAAGUBwEAAAABlQdAAAAAAQFhAACcBgAgBIcGAQAAAAGOBgEAAAABlAcBAAAAAZUHQAAAAAEBYQAAngYAMAFhAACeBgAwBgMAAPURACBFAAD0EQAghwYBAOIMACGOBgEA4gwAIZQHAQDiDAAhlQdAAOQMACECAAAA-gEAIGEAAKEGACAEhwYBAOIMACGOBgEA4gwAIZQHAQDiDAAhlQdAAOQMACECAAAA-AEAIGEAAKMGACACAAAA-AEAIGEAAKMGACADAAAA-gEAIGgAAJwGACBpAAChBgAgAQAAAPoBACABAAAA-AEAIAMVAADxEQAgbgAA8xEAIG8AAPIRACAHhAYAAKkLADCFBgAAqgYAEIYGAACpCwAwhwYBAMQKACGOBgEAxAoAIZQHAQDECgAhlQdAAMYKACEDAAAA-AEAIAEAAKkGADBtAACqBgAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAEAAAB2ACABAAAAdgAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAAB0ACABAAB1ADACAAB2ACADAAAAdAAgAQAAdQAwAgAAdgAgDgcAAIIQACAJAACDEAAgGwAA8BEAIBwAAIQQACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAdgGAQAAAAHoBgEAAAABigcgAAAAAZIHEAAAAAGTBxAAAAABAWEAALIGACAKhwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHYBgEAAAAB6AYBAAAAAYoHIAAAAAGSBxAAAAABkwcQAAAAAQFhAAC0BgAwAWEAALQGADAOBwAA9Q8AIAkAAPYPACAbAADvEQAgHAAA9w8AIIcGAQDiDAAhjAYBAOIMACGNBgEA4gwAIY8GQADkDAAhkAZAAOQMACHYBgEA4gwAIegGAQDiDAAhigcgAMQOACGSBxAA6g4AIZMHEADqDgAhAgAAAHYAIGEAALcGACAKhwYBAOIMACGMBgEA4gwAIY0GAQDiDAAhjwZAAOQMACGQBkAA5AwAIdgGAQDiDAAh6AYBAOIMACGKByAAxA4AIZIHEADqDgAhkwcQAOoOACECAAAAdAAgYQAAuQYAIAIAAAB0ACBhAAC5BgAgAwAAAHYAIGgAALIGACBpAAC3BgAgAQAAAHYAIAEAAAB0ACAFFQAA6hEAIG4AAO0RACBvAADsEQAg8AEAAOsRACDxAQAA7hEAIA2EBgAAqAsAMIUGAADABgAQhgYAAKgLADCHBgEAxAoAIYwGAQDECgAhjQYBAMQKACGPBkAAxgoAIZAGQADGCgAh2AYBAMQKACHoBgEAxAoAIYoHIADSCgAhkgcQAPEKACGTBxAA8QoAIQMAAAB0ACABAAC_BgAwbQAAwAYAIAMAAAB0ACABAAB1ADACAAB2ACABAAAAVwAgAQAAAFcAIAMAAABVACABAABWADACAABXACADAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIBwHAACYDwAgCQAAmQ8AIBkAAOkPACAbAACaDwAgHQAAmw8AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb8GAAAAkAcC1wYQAAAAAdgGAQAAAAHZBgIAAAAB6AYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABjAcBAAAAAY4HAAAAjgcCkAcBAAAAAZEHQAAAAAEBYQAAyAYAIBeHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbMGAQAAAAG_BgAAAJAHAtcGEAAAAAHYBgEAAAAB2QYCAAAAAegGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAcBAAAAAYEHAQAAAAGCB4AAAAABgwdAAAAAAYwHAQAAAAGOBwAAAI4HApAHAQAAAAGRB0AAAAABAWEAAMoGADABYQAAygYAMBwHAACTDwAgCQAAlA8AIBkAAOcPACAbAACVDwAgHQAAlg8AIIcGAQDiDAAhjAYBAOIMACGNBgEA4gwAIY8GQADkDAAhkAZAAOQMACGzBgEA4gwAIb8GAACRD5AHItcGEADqDgAh2AYBAOIMACHZBgIA6w4AIegGAQDiDAAh_AYBAOIMACH9BgEA4wwAIf4GAQDjDAAh_wYBAOMMACGABwEA4wwAIYEHAQDjDAAhggeAAAAAAYMHQAD6DAAhjAcBAOIMACGOBwAAkA-OByKQBwEA4gwAIZEHQADkDAAhAgAAAFcAIGEAAM0GACAXhwYBAOIMACGMBgEA4gwAIY0GAQDiDAAhjwZAAOQMACGQBkAA5AwAIbMGAQDiDAAhvwYAAJEPkAci1wYQAOoOACHYBgEA4gwAIdkGAgDrDgAh6AYBAOIMACH8BgEA4gwAIf0GAQDjDAAh_gYBAOMMACH_BgEA4wwAIYAHAQDjDAAhgQcBAOMMACGCB4AAAAABgwdAAPoMACGMBwEA4gwAIY4HAACQD44HIpAHAQDiDAAhkQdAAOQMACECAAAAVQAgYQAAzwYAIAIAAABVACBhAADPBgAgAwAAAFcAIGgAAMgGACBpAADNBgAgAQAAAFcAIAEAAABVACAMFQAA5REAIG4AAOgRACBvAADnEQAg8AEAAOYRACDxAQAA6REAIP0GAADeDAAg_gYAAN4MACD_BgAA3gwAIIAHAADeDAAggQcAAN4MACCCBwAA3gwAIIMHAADeDAAgGoQGAAChCwAwhQYAANYGABCGBgAAoQsAMIcGAQDECgAhjAYBAMQKACGNBgEAxAoAIY8GQADGCgAhkAZAAMYKACGzBgEAxAoAIb8GAACjC5AHItcGEADxCgAh2AYBAMQKACHZBgIA8goAIegGAQDECgAh_AYBAMQKACH9BgEAxQoAIf4GAQDFCgAh_wYBAMUKACGABwEAxQoAIYEHAQDFCgAhggcAAJoLACCDB0AA4QoAIYwHAQDECgAhjgcAAKILjgcikAcBAMQKACGRB0AAxgoAIQMAAABVACABAADVBgAwbQAA1gYAIAMAAABVACABAABWADACAABXACAQBwAAoAsAIIQGAACfCwAwhQYAAOcBABCGBgAAnwsAMIcGAQAAAAGMBgEAAAABjwZAANsKACGQBkAA2woAIYQHAQDXCgAhhQcBANcKACGGBwEA1woAIYcHAQDXCgAhiAcBANcKACGJBwEA1woAIYoHIADaCgAhiwcBANgKACEBAAAA2QYAIAEAAADZBgAgAgcAAOQRACCLBwAA3gwAIAMAAADnAQAgAQAA3AYAMAIAANkGACADAAAA5wEAIAEAANwGADACAADZBgAgAwAAAOcBACABAADcBgAwAgAA2QYAIA0HAADjEQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAYQHAQAAAAGFBwEAAAABhgcBAAAAAYcHAQAAAAGIBwEAAAABiQcBAAAAAYoHIAAAAAGLBwEAAAABAWEAAOAGACAMhwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAYQHAQAAAAGFBwEAAAABhgcBAAAAAYcHAQAAAAGIBwEAAAABiQcBAAAAAYoHIAAAAAGLBwEAAAABAWEAAOIGADABYQAA4gYAMA0HAADiEQAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACGEBwEA4gwAIYUHAQDiDAAhhgcBAOIMACGHBwEA4gwAIYgHAQDiDAAhiQcBAOIMACGKByAAxA4AIYsHAQDjDAAhAgAAANkGACBhAADlBgAgDIcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhhAcBAOIMACGFBwEA4gwAIYYHAQDiDAAhhwcBAOIMACGIBwEA4gwAIYkHAQDiDAAhigcgAMQOACGLBwEA4wwAIQIAAADnAQAgYQAA5wYAIAIAAADnAQAgYQAA5wYAIAMAAADZBgAgaAAA4AYAIGkAAOUGACABAAAA2QYAIAEAAADnAQAgBBUAAN8RACBuAADhEQAgbwAA4BEAIIsHAADeDAAgD4QGAACeCwAwhQYAAO4GABCGBgAAngsAMIcGAQDECgAhjAYBAMQKACGPBkAAxgoAIZAGQADGCgAhhAcBAMQKACGFBwEAxAoAIYYHAQDECgAhhwcBAMQKACGIBwEAxAoAIYkHAQDECgAhigcgANIKACGLBwEAxQoAIQMAAADnAQAgAQAA7QYAMG0AAO4GACADAAAA5wEAIAEAANwGADACAADZBgAgAQAAAOsBACABAAAA6wEAIAMAAADpAQAgAQAA6gEAMAIAAOsBACADAAAA6QEAIAEAAOoBADACAADrAQAgAwAAAOkBACABAADqAQAwAgAA6wEAIBMHAADeEQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAA_AYC1QYAAADVBgLXBhAAAAAB2AYBAAAAAdkGAgAAAAH6BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHAQAAAAGBBwEAAAABggeAAAAAAYMHQAAAAAEBYQAA9gYAIBKHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAAD8BgLVBgAAANUGAtcGEAAAAAHYBgEAAAAB2QYCAAAAAfoGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAcBAAAAAYEHAQAAAAGCB4AAAAABgwdAAAAAAQFhAAD4BgAwAWEAAPgGADATBwAA3REAIIcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAANwR_AYi1QYAAOgO1QYi1wYQAOoOACHYBgEA4gwAIdkGAgDrDgAh-gYBAOIMACH8BgEA4gwAIf0GAQDjDAAh_gYBAOMMACH_BgEA4wwAIYAHAQDjDAAhgQcBAOMMACGCB4AAAAABgwdAAPoMACECAAAA6wEAIGEAAPsGACAShwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAA3BH8BiLVBgAA6A7VBiLXBhAA6g4AIdgGAQDiDAAh2QYCAOsOACH6BgEA4gwAIfwGAQDiDAAh_QYBAOMMACH-BgEA4wwAIf8GAQDjDAAhgAcBAOMMACGBBwEA4wwAIYIHgAAAAAGDB0AA-gwAIQIAAADpAQAgYQAA_QYAIAIAAADpAQAgYQAA_QYAIAMAAADrAQAgaAAA9gYAIGkAAPsGACABAAAA6wEAIAEAAADpAQAgDBUAANcRACBuAADaEQAgbwAA2REAIPABAADYEQAg8QEAANsRACD9BgAA3gwAIP4GAADeDAAg_wYAAN4MACCABwAA3gwAIIEHAADeDAAgggcAAN4MACCDBwAA3gwAIBWEBgAAmAsAMIUGAACEBwAQhgYAAJgLADCHBgEAxAoAIYwGAQDECgAhjwZAAMYKACGQBkAAxgoAIb8GAACZC_wGItUGAADvCtUGItcGEADxCgAh2AYBAMQKACHZBgIA8goAIfoGAQDECgAh_AYBAMQKACH9BgEAxQoAIf4GAQDFCgAh_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_xAAIA8AAP4QACCHBgEA4gwAIYwGAQDiDAAhjQYBAOIMACGPBkAA5AwAIZAGQADkDAAhuAYBAOIMACHmBgEA4wwAIfAGAQDjDAAh8QZAAPoMACHyBggAkw0AIfMGCACTDQAhAgAAAB8AIGEAAMMHACALhwYBAOIMACGMBgEA4gwAIY0GAQDiDAAhjwZAAOQMACGQBkAA5AwAIbgGAQDiDAAh5gYBAOMMACHwBgEA4wwAIfEGQAD6DAAh8gYIAJMNACHzBggAkw0AIQIAAAAdACBhAADFBwAgAgAAAB0AIGEAAMUHACADAAAAHwAgaAAAvgcAIGkAAMMHACABAAAAHwAgAQAAAB0AIAoVAAD5EAAgbgAA_BAAIG8AAPsQACDwAQAA-hAAIPEBAAD9EAAg5gYAAN4MACDwBgAA3gwAIPEGAADeDAAg8gYAAN4MACDzBgAA3gwAIA6EBgAAkQsAMIUGAADMBwAQhgYAAJELADCHBgEAxAoAIYwGAQDECgAhjQYBAMQKACGPBkAAxgoAIZAGQADGCgAhuAYBAMQKACHmBgEAxQoAIfAGAQDFCgAh8QZAAOEKACHyBggA6woAIfMGCADrCgAhAwAAAB0AIAEAAMsHADBtAADMBwAgAwAAAB0AIAEAAB4AMAIAAB8AIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgEAcAAKkOACAJAACqDgAgKAAApw4AICkAANsQACArAACoDgAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHFBgEAAAAB4AYBAAAAAeYGAQAAAAHtBgEAAAAB7gYBAAAAAe8GAQAAAAEBYQAA1AcAIAuHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAcUGAQAAAAHgBgEAAAAB5gYBAAAAAe0GAQAAAAHuBgEAAAAB7wYBAAAAAQFhAADWBwAwAWEAANYHADABAAAAFgAgAQAAABgAIBAHAACkDgAgCQAApQ4AICgAAKIOACApAADZEAAgKwAAow4AIIcGAQDiDAAhjAYBAOMMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACHFBgEA4gwAIeAGAQDiDAAh5gYBAOMMACHtBgEA4wwAIe4GAQDiDAAh7wYBAOIMACECAAAALAAgYQAA2wcAIAuHBgEA4gwAIYwGAQDjDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhxQYBAOIMACHgBgEA4gwAIeYGAQDjDAAh7QYBAOMMACHuBgEA4gwAIe8GAQDiDAAhAgAAACoAIGEAAN0HACACAAAAKgAgYQAA3QcAIAEAAAAWACABAAAAGAAgAwAAACwAIGgAANQHACBpAADbBwAgAQAAACwAIAEAAAAqACAHFQAA9hAAIG4AAPgQACBvAAD3EAAgjAYAAN4MACCNBgAA3gwAIOYGAADeDAAg7QYAAN4MACAOhAYAAJALADCFBgAA5gcAEIYGAACQCwAwhwYBAMQKACGMBgEAxQoAIY0GAQDFCgAhjwZAAMYKACGQBkAAxgoAIcUGAQDECgAh4AYBAMQKACHmBgEAxQoAIe0GAQDFCgAh7gYBAMQKACHvBgEAxAoAIQMAAAAqACABAADlBwAwbQAA5gcAIAMAAAAqACABAAArADACAAAsACABAAAAMwAgAQAAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAADEAIAEAADIAMAIAADMAIA8HAADeEAAgCQAA3xAAIAsAAN0QACAbAAD1EAAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAO0GAuAGAQAAAAHmBgEAAAAB6AYBAAAAAeoGAQAAAAHrBgEAAAABAWEAAO4HACALhwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAO0GAuAGAQAAAAHmBgEAAAAB6AYBAAAAAeoGAQAAAAHrBgEAAAABAWEAAPAHADABYQAA8AcAMAEAAAAvACABAAAAFgAgAQAAABgAIA8HAADPEAAgCQAA0BAAIAsAAM4QACAbAAD0EAAghwYBAOIMACGMBgEA4wwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIb8GAADMEO0GIuAGAQDiDAAh5gYBAOMMACHoBgEA4wwAIeoGAQDiDAAh6wYBAOIMACECAAAAMwAgYQAA9gcAIAuHBgEA4gwAIYwGAQDjDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhvwYAAMwQ7QYi4AYBAOIMACHmBgEA4wwAIegGAQDjDAAh6gYBAOIMACHrBgEA4gwAIQIAAAAxACBhAAD4BwAgAgAAADEAIGEAAPgHACABAAAALwAgAQAAABYAIAEAAAAYACADAAAAMwAgaAAA7gcAIGkAAPYHACABAAAAMwAgAQAAADEAIAcVAADxEAAgbgAA8xAAIG8AAPIQACCMBgAA3gwAII0GAADeDAAg5gYAAN4MACDoBgAA3gwAIA6EBgAAjAsAMIUGAACCCAAQhgYAAIwLADCHBgEAxAoAIYwGAQDFCgAhjQYBAMUKACGPBkAAxgoAIZAGQADGCgAhvwYAAI0L7QYi4AYBAMQKACHmBgEAxQoAIegGAQDFCgAh6gYBAMQKACHrBgEAxAoAIQMAAAAxACABAACBCAAwbQAAgggAIAMAAAAxACABAAAyADACAAAzACABAAAANwAgAQAAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgAwAAADUAIAEAADYAMAIAADcAIBEHAAC_EAAgCQAAwBAAIA0AALwQACARAAC9EAAgGwAA8BAAICQAAL4QACAmAADBEAAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAAB5gYBAAAAAecGAgAAAAHoBgEAAAAB6QYBAAAAAQFhAACKCAAgCocGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAeYGAQAAAAHnBgIAAAAB6AYBAAAAAekGAQAAAAEBYQAAjAgAMAFhAACMCAAwAQAAABgAIAEAAABrACARBwAAnRAAIAkAAJ4QACANAACaEAAgEQAAmxAAIBsAAO8QACAkAACcEAAgJgAAnxAAIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIeYGAQDjDAAh5wYCAJgQACHoBgEA4gwAIekGAQDjDAAhAgAAADcAIGEAAJEIACAKhwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAh5gYBAOMMACHnBgIAmBAAIegGAQDiDAAh6QYBAOMMACECAAAANQAgYQAAkwgAIAIAAAA1ACBhAACTCAAgAQAAABgAIAEAAABrACADAAAANwAgaAAAiggAIGkAAJEIACABAAAANwAgAQAAADUAIAkVAADqEAAgbgAA7RAAIG8AAOwQACDwAQAA6xAAIPEBAADuEAAgjQYAAN4MACDmBgAA3gwAIOcGAADeDAAg6QYAAN4MACANhAYAAIkLADCFBgAAnAgAEIYGAACJCwAwhwYBAMQKACGMBgEAxAoAIY0GAQDFCgAhjwZAAMYKACGQBkAAxgoAIeAGAQDECgAh5gYBAMUKACHnBgIAigsAIegGAQDECgAh6QYBAMUKACEDAAAANQAgAQAAmwgAMG0AAJwIACADAAAANQAgAQAANgAwAgAANwAgDQwAAIQLACANAACGCwAgHAAAiAsAICUAAIULACAnAACHCwAghAYAAIMLADCFBgAALwAQhgYAAIMLADCHBgEAAAABjAYBANcKACHgBgEA1woAIeEGQADbCgAh4gZAANsKACEBAAAAnwgAIAEAAACfCAAgBQwAAOUQACANAADnEAAgHAAA6RAAICUAAOYQACAnAADoEAAgAwAAAC8AIAEAAKIIADACAACfCAAgAwAAAC8AIAEAAKIIADACAACfCAAgAwAAAC8AIAEAAKIIADACAACfCAAgCgwAAOAQACANAADiEAAgHAAA5BAAICUAAOEQACAnAADjEAAghwYBAAAAAYwGAQAAAAHgBgEAAAAB4QZAAAAAAeIGQAAAAAEBYQAApggAIAWHBgEAAAABjAYBAAAAAeAGAQAAAAHhBkAAAAAB4gZAAAAAAQFhAACoCAAwAWEAAKgIADAKDAAA2g8AIA0AANwPACAcAADeDwAgJQAA2w8AICcAAN0PACCHBgEA4gwAIYwGAQDiDAAh4AYBAOIMACHhBkAA5AwAIeIGQADkDAAhAgAAAJ8IACBhAACrCAAgBYcGAQDiDAAhjAYBAOIMACHgBgEA4gwAIeEGQADkDAAh4gZAAOQMACECAAAALwAgYQAArQgAIAIAAAAvACBhAACtCAAgAwAAAJ8IACBoAACmCAAgaQAAqwgAIAEAAACfCAAgAQAAAC8AIAMVAADXDwAgbgAA2Q8AIG8AANgPACAIhAYAAIILADCFBgAAtAgAEIYGAACCCwAwhwYBAMQKACGMBgEAxAoAIeAGAQDECgAh4QZAAMYKACHiBkAAxgoAIQMAAAAvACABAACzCAAwbQAAtAgAIAMAAAAvACABAACiCAAwAgAAnwgAIA0XAADcCgAghAYAAIELADCFBgAAtAIAEIYGAACBCwAwhwYBAAAAAY8GQADbCgAhkAZAANsKACGdBgEA1woAIZ4GAQDXCgAhowYAANkKACClBiAA2goAId4GAQAAAAHfBgAA0AoAIAEAAAC3CAAgAQAAALcIACABFwAAyQ4AIAMAAAC0AgAgAQAAuggAMAIAALcIACADAAAAtAIAIAEAALoIADACAAC3CAAgAwAAALQCACABAAC6CAAwAgAAtwgAIAoXAADWDwAghwYBAAAAAY8GQAAAAAGQBkAAAAABnQYBAAAAAZ4GAQAAAAGjBoAAAAABpQYgAAAAAd4GAQAAAAHfBgAA1Q8AIAFhAAC-CAAgCYcGAQAAAAGPBkAAAAABkAZAAAAAAZ0GAQAAAAGeBgEAAAABowaAAAAAAaUGIAAAAAHeBgEAAAAB3wYAANUPACABYQAAwAgAMAFhAADACAAwChcAANQPACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACGdBgEA4gwAIZ4GAQDiDAAhowaAAAAAAaUGIADEDgAh3gYBAOIMACHfBgAA0w8AIAIAAAC3CAAgYQAAwwgAIAmHBgEA4gwAIY8GQADkDAAhkAZAAOQMACGdBgEA4gwAIZ4GAQDiDAAhowaAAAAAAaUGIADEDgAh3gYBAOIMACHfBgAA0w8AIAIAAAC0AgAgYQAAxQgAIAIAAAC0AgAgYQAAxQgAIAMAAAC3CAAgaAAAvggAIGkAAMMIACABAAAAtwgAIAEAAAC0AgAgAxUAANAPACBuAADSDwAgbwAA0Q8AIAyEBgAAgAsAMIUGAADMCAAQhgYAAIALADCHBgEAxAoAIY8GQADGCgAhkAZAAMYKACGdBgEAxAoAIZ4GAQDECgAhowYAANEKACClBiAA0goAId4GAQDECgAh3wYAANAKACADAAAAtAIAIAEAAMsIADBtAADMCAAgAwAAALQCACABAAC6CAAwAgAAtwgAIAEAAABNACABAAAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgEBYAAKwPACAXAACtDwAgGAAArg8AIBkAAM8PACCHBgEAAAABjwZAAAAAAZAGQAAAAAGzBgEAAAABvQYBAAAAAb8GAAAA3gYCwAYBAAAAAcEGQAAAAAHCBkAAAAABwwYBAAAAAcQGAQAAAAHeBgEAAAABAWEAANQIACAMhwYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb0GAQAAAAG_BgAAAN4GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAAB3gYBAAAAAQFhAADWCAAwAWEAANYIADABAAAAUQAgAQAAAFMAIBAWAACoDwAgFwAAqQ8AIBgAAKoPACAZAADODwAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhswYBAOMMACG9BgEA4wwAIb8GAACmD94GIsAGAQDjDAAhwQZAAPoMACHCBkAA5AwAIcMGAQDiDAAhxAYBAOMMACHeBgEA4gwAIQIAAABNACBhAADbCAAgDIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbMGAQDjDAAhvQYBAOMMACG_BgAApg_eBiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAIcQGAQDjDAAh3gYBAOIMACECAAAASwAgYQAA3QgAIAIAAABLACBhAADdCAAgAQAAAFEAIAEAAABTACADAAAATQAgaAAA1AgAIGkAANsIACABAAAATQAgAQAAAEsAIAgVAADLDwAgbgAAzQ8AIG8AAMwPACCzBgAA3gwAIL0GAADeDAAgwAYAAN4MACDBBgAA3gwAIMQGAADeDAAgD4QGAAD8CgAwhQYAAOYIABCGBgAA_AoAMIcGAQDECgAhjwZAAMYKACGQBkAAxgoAIbMGAQDFCgAhvQYBAMUKACG_BgAA_QreBiLABgEAxQoAIcEGQADhCgAhwgZAAMYKACHDBgEAxAoAIcQGAQDFCgAh3gYBAMQKACEDAAAASwAgAQAA5QgAMG0AAOYIACADAAAASwAgAQAATAAwAgAATQAgAQAAAJ0BACABAAAAnQEAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAABTACABAACcAQAwAgAAnQEAIBADAADFDwAgBwAAww8AIAkAAMQPACANAADGDwAgEwAAxw8AIBoAAMgPACAcAADJDwAgIgAAyg8AIIcGAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAHcBgEAAAABAWEAAO4IACAIhwYBAAAAAYsGAQAAAAGMBgEAAAABjQYBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAdwGAQAAAAEBYQAA8AgAMAFhAADwCAAwAQAAABgAIBADAAD1DgAgBwAA8w4AIAkAAPQOACANAAD2DgAgEwAA9w4AIBoAAPgOACAcAAD5DgAgIgAA-g4AIIcGAQDiDAAhiwYBAOMMACGMBgEA4gwAIY0GAQDjDAAhjgYBAOIMACGPBkAA5AwAIZAGQADkDAAh3AYBAOIMACECAAAAnQEAIGEAAPQIACAIhwYBAOIMACGLBgEA4wwAIYwGAQDiDAAhjQYBAOMMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACHcBgEA4gwAIQIAAABTACBhAAD2CAAgAgAAAFMAIGEAAPYIACABAAAAGAAgAwAAAJ0BACBoAADuCAAgaQAA9AgAIAEAAACdAQAgAQAAAFMAIAUVAADwDgAgbgAA8g4AIG8AAPEOACCLBgAA3gwAII0GAADeDAAgC4QGAAD7CgAwhQYAAP4IABCGBgAA-woAMIcGAQDECgAhiwYBAMUKACGMBgEAxAoAIY0GAQDFCgAhjgYBAMQKACGPBkAAxgoAIZAGQADGCgAh3AYBAMQKACEDAAAAUwAgAQAA_QgAMG0AAP4IACADAAAAUwAgAQAAnAEAMAIAAJ0BACABAAAA3QEAIAEAAADdAQAgAwAAANsBACABAADcAQAwAgAA3QEAIAMAAADbAQAgAQAA3AEAMAIAAN0BACADAAAA2wEAIAEAANwBADACAADdAQAgDgcAAO4OACA_AADvDgAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAA1wYC0wYBAAAAAdUGAAAA1QYC1wYQAAAAAdgGAQAAAAHZBgIAAAAB2gZAAAAAAdsGQAAAAAEBYQAAhgkAIAyHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAADXBgLTBgEAAAAB1QYAAADVBgLXBhAAAAAB2AYBAAAAAdkGAgAAAAHaBkAAAAAB2wZAAAAAAQFhAACICQAwAWEAAIgJADABAAAA1QEAIA4HAADsDgAgPwAA7Q4AIIcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAAOkO1wYi0wYBAOMMACHVBgAA6A7VBiLXBhAA6g4AIdgGAQDiDAAh2QYCAOsOACHaBkAA5AwAIdsGQADkDAAhAgAAAN0BACBhAACMCQAgDIcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAAOkO1wYi0wYBAOMMACHVBgAA6A7VBiLXBhAA6g4AIdgGAQDiDAAh2QYCAOsOACHaBkAA5AwAIdsGQADkDAAhAgAAANsBACBhAACOCQAgAgAAANsBACBhAACOCQAgAQAAANUBACADAAAA3QEAIGgAAIYJACBpAACMCQAgAQAAAN0BACABAAAA2wEAIAYVAADjDgAgbgAA5g4AIG8AAOUOACDwAQAA5A4AIPEBAADnDgAg0wYAAN4MACAPhAYAAO4KADCFBgAAlgkAEIYGAADuCgAwhwYBAMQKACGMBgEAxAoAIY8GQADGCgAhkAZAAMYKACG_BgAA8ArXBiLTBgEAxQoAIdUGAADvCtUGItcGEADxCgAh2AYBAMQKACHZBgIA8goAIdoGQADGCgAh2wZAAMYKACEDAAAA2wEAIAEAAJUJADBtAACWCQAgAwAAANsBACABAADcAQAwAgAA3QEAIAEAAACtAQAgAQAAAK0BACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAIkBACABAACsAQAwAgAArQEAIAMAAACJAQAgAQAArAEAMAIAAK0BACAYBwAAmg0AIAkAAJsNACAQAACJDgAgKQAAmQ0AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAcUGAQAAAAHGBggAAAABxwYIAAAAAcgGCAAAAAHJBggAAAABygYIAAAAAcsGCAAAAAHMBggAAAABzQYIAAAAAc4GCAAAAAHPBggAAAAB0AYIAAAAAdEGCAAAAAHSBggAAAABAWEAAJ4JACAUhwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGxBgEAAAABxQYBAAAAAcYGCAAAAAHHBggAAAAByAYIAAAAAckGCAAAAAHKBggAAAABywYIAAAAAcwGCAAAAAHNBggAAAABzgYIAAAAAc8GCAAAAAHQBggAAAAB0QYIAAAAAdIGCAAAAAEBYQAAoAkAMAFhAACgCQAwAQAAABgAIBgHAACWDQAgCQAAlw0AIBAAAIgOACApAACVDQAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDiDAAhxQYBAOIMACHGBggAkw0AIccGCACTDQAhyAYIAJMNACHJBggAkw0AIcoGCACTDQAhywYIAJMNACHMBggAkw0AIc0GCACTDQAhzgYIAJMNACHPBggAkw0AIdAGCACTDQAh0QYIAJMNACHSBggAkw0AIQIAAACtAQAgYQAApAkAIBSHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhsQYBAOIMACHFBgEA4gwAIcYGCACTDQAhxwYIAJMNACHIBggAkw0AIckGCACTDQAhygYIAJMNACHLBggAkw0AIcwGCACTDQAhzQYIAJMNACHOBggAkw0AIc8GCACTDQAh0AYIAJMNACHRBggAkw0AIdIGCACTDQAhAgAAAIkBACBhAACmCQAgAgAAAIkBACBhAACmCQAgAQAAABgAIAMAAACtAQAgaAAAngkAIGkAAKQJACABAAAArQEAIAEAAACJAQAgExUAAN4OACBuAADhDgAgbwAA4A4AIPABAADfDgAg8QEAAOIOACCNBgAA3gwAIMYGAADeDAAgxwYAAN4MACDIBgAA3gwAIMkGAADeDAAgygYAAN4MACDLBgAA3gwAIMwGAADeDAAgzQYAAN4MACDOBgAA3gwAIM8GAADeDAAg0AYAAN4MACDRBgAA3gwAINIGAADeDAAgF4QGAADqCgAwhQYAAK4JABCGBgAA6goAMIcGAQDECgAhjAYBAMQKACGNBgEAxQoAIY8GQADGCgAhkAZAAMYKACGxBgEAxAoAIcUGAQDECgAhxgYIAOsKACHHBggA6woAIcgGCADrCgAhyQYIAOsKACHKBggA6woAIcsGCADrCgAhzAYIAOsKACHNBggA6woAIc4GCADrCgAhzwYIAOsKACHQBggA6woAIdEGCADrCgAh0gYIAOsKACEDAAAAiQEAIAEAAK0JADBtAACuCQAgAwAAAIkBACABAACsAQAwAgAArQEAIAEAAACjAQAgAQAAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACAUBwAAsQ0AIAkAALINACAQAADdDgAgFgAArg0AIBgAALANACAzAACvDQAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGcBgEAAAABsQYBAAAAAb0GAQAAAAG_BgAAAL8GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAABAWEAALYJACAOhwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGcBgEAAAABsQYBAAAAAb0GAQAAAAG_BgAAAL8GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAABAWEAALgJADABYQAAuAkAMAEAAABRACABAAAADgAgAQAAABgAIBQHAACrDQAgCQAArA0AIBAAANwOACAWAACoDQAgGAAAqg0AIDMAAKkNACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhnAYBAOIMACGxBgEA4wwAIb0GAQDjDAAhvwYAAKYNvwYiwAYBAOMMACHBBkAA-gwAIcIGQADkDAAhwwYBAOIMACHEBgEA4wwAIQIAAACjAQAgYQAAvgkAIA6HBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhnAYBAOIMACGxBgEA4wwAIb0GAQDjDAAhvwYAAKYNvwYiwAYBAOMMACHBBkAA-gwAIcIGQADkDAAhwwYBAOIMACHEBgEA4wwAIQIAAAChAQAgYQAAwAkAIAIAAAChAQAgYQAAwAkAIAEAAABRACABAAAADgAgAQAAABgAIAMAAACjAQAgaAAAtgkAIGkAAL4JACABAAAAowEAIAEAAAChAQAgCRUAANkOACBuAADbDgAgbwAA2g4AII0GAADeDAAgsQYAAN4MACC9BgAA3gwAIMAGAADeDAAgwQYAAN4MACDEBgAA3gwAIBGEBgAA5goAMIUGAADKCQAQhgYAAOYKADCHBgEAxAoAIYwGAQDECgAhjQYBAMUKACGPBkAAxgoAIZAGQADGCgAhnAYBAMQKACGxBgEAxQoAIb0GAQDFCgAhvwYAAOcKvwYiwAYBAMUKACHBBkAA4QoAIcIGQADGCgAhwwYBAMQKACHEBgEAxQoAIQMAAAChAQAgAQAAyQkAMG0AAMoJACADAAAAoQEAIAEAAKIBADACAACjAQAgAQAAAEEAIAEAAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAAA_ACABAABAADACAABBACAQBwAA1w0AIAkAANgNACAOAADWDQAgEAAA2A4AICMAANkNACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGxBgEAAAABuAYBAAAAAbkGAQAAAAG7BgAAALsGArwGQAAAAAEBYQAA0gkAIAuHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGxBgEAAAABuAYBAAAAAbkGAQAAAAG7BgAAALsGArwGQAAAAAEBYQAA1AkAMAFhAADUCQAwAQAAABgAIBAHAADADQAgCQAAwQ0AIA4AAL8NACAQAADXDgAgIwAAwg0AIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGvBgEA4gwAIbEGAQDiDAAhuAYBAOIMACG5BgEA4wwAIbsGAAC9DbsGIrwGQAD6DAAhAgAAAEEAIGEAANgJACALhwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsQYBAOIMACG4BgEA4gwAIbkGAQDjDAAhuwYAAL0NuwYivAZAAPoMACECAAAAPwAgYQAA2gkAIAIAAAA_ACBhAADaCQAgAQAAABgAIAMAAABBACBoAADSCQAgaQAA2AkAIAEAAABBACABAAAAPwAgBhUAANQOACBuAADWDgAgbwAA1Q4AII0GAADeDAAguQYAAN4MACC8BgAA3gwAIA6EBgAA3woAMIUGAADiCQAQhgYAAN8KADCHBgEAxAoAIYwGAQDECgAhjQYBAMUKACGPBkAAxgoAIZAGQADGCgAhrwYBAMQKACGxBgEAxAoAIbgGAQDECgAhuQYBAMUKACG7BgAA4Aq7BiK8BkAA4QoAIQMAAAA_ACABAADhCQAwbQAA4gkAIAMAAAA_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_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_BgKSBgAAAL8GCJMGAAAAvwYImAYAAOgKvwYiBxUAAMgKACBuAADpCgAgbwAA6QoAIJEGAAAAvwYCkgYAAAC_BgiTBgAAAL8GCJgGAADoCr8GIgSRBgAAAL8GApIGAAAAvwYIkwYAAAC_BgiYBgAA6Qq_BiIXhAYAAOoKADCFBgAArgkAEIYGAADqCgAwhwYBAMQKACGMBgEAxAoAIY0GAQDFCgAhjwZAAMYKACGQBkAAxgoAIbEGAQDECgAhxQYBAMQKACHGBggA6woAIccGCADrCgAhyAYIAOsKACHJBggA6woAIcoGCADrCgAhywYIAOsKACHMBggA6woAIc0GCADrCgAhzgYIAOsKACHPBggA6woAIdAGCADrCgAh0QYIAOsKACHSBggA6woAIQ0VAADLCgAgbgAA7QoAIG8AAO0KACDwAQAA7QoAIPEBAADtCgAgkQYIAAAAAZIGCAAAAAWTBggAAAAFlAYIAAAAAZUGCAAAAAGWBggAAAABlwYIAAAAAZgGCADsCgAhDRUAAMsKACBuAADtCgAgbwAA7QoAIPABAADtCgAg8QEAAO0KACCRBggAAAABkgYIAAAABZMGCAAAAAWUBggAAAABlQYIAAAAAZYGCAAAAAGXBggAAAABmAYIAOwKACEIkQYIAAAAAZIGCAAAAAWTBggAAAAFlAYIAAAAAZUGCAAAAAGWBggAAAABlwYIAAAAAZgGCADtCgAhD4QGAADuCgAwhQYAAJYJABCGBgAA7goAMIcGAQDECgAhjAYBAMQKACGPBkAAxgoAIZAGQADGCgAhvwYAAPAK1wYi0wYBAMUKACHVBgAA7wrVBiLXBhAA8QoAIdgGAQDECgAh2QYCAPIKACHaBkAAxgoAIdsGQADGCgAhBxUAAMgKACBuAAD6CgAgbwAA-goAIJEGAAAA1QYCkgYAAADVBgiTBgAAANUGCJgGAAD5CtUGIgcVAADICgAgbgAA-AoAIG8AAPgKACCRBgAAANcGApIGAAAA1wYIkwYAAADXBgiYBgAA9wrXBiINFQAAyAoAIG4AAPYKACBvAAD2CgAg8AEAAPYKACDxAQAA9goAIJEGEAAAAAGSBhAAAAAEkwYQAAAABJQGEAAAAAGVBhAAAAABlgYQAAAAAZcGEAAAAAGYBhAA9QoAIQ0VAADICgAgbgAAyAoAIG8AAMgKACDwAQAA9AoAIPEBAADICgAgkQYCAAAAAZIGAgAAAASTBgIAAAAElAYCAAAAAZUGAgAAAAGWBgIAAAABlwYCAAAAAZgGAgDzCgAhDRUAAMgKACBuAADICgAgbwAAyAoAIPABAAD0CgAg8QEAAMgKACCRBgIAAAABkgYCAAAABJMGAgAAAASUBgIAAAABlQYCAAAAAZYGAgAAAAGXBgIAAAABmAYCAPMKACEIkQYIAAAAAZIGCAAAAASTBggAAAAElAYIAAAAAZUGCAAAAAGWBggAAAABlwYIAAAAAZgGCAD0CgAhDRUAAMgKACBuAAD2CgAgbwAA9goAIPABAAD2CgAg8QEAAPYKACCRBhAAAAABkgYQAAAABJMGEAAAAASUBhAAAAABlQYQAAAAAZYGEAAAAAGXBhAAAAABmAYQAPUKACEIkQYQAAAAAZIGEAAAAASTBhAAAAAElAYQAAAAAZUGEAAAAAGWBhAAAAABlwYQAAAAAZgGEAD2CgAhBxUAAMgKACBuAAD4CgAgbwAA-AoAIJEGAAAA1wYCkgYAAADXBgiTBgAAANcGCJgGAAD3CtcGIgSRBgAAANcGApIGAAAA1wYIkwYAAADXBgiYBgAA-ArXBiIHFQAAyAoAIG4AAPoKACBvAAD6CgAgkQYAAADVBgKSBgAAANUGCJMGAAAA1QYImAYAAPkK1QYiBJEGAAAA1QYCkgYAAADVBgiTBgAAANUGCJgGAAD6CtUGIguEBgAA-woAMIUGAAD-CAAQhgYAAPsKADCHBgEAxAoAIYsGAQDFCgAhjAYBAMQKACGNBgEAxQoAIY4GAQDECgAhjwZAAMYKACGQBkAAxgoAIdwGAQDECgAhD4QGAAD8CgAwhQYAAOYIABCGBgAA_AoAMIcGAQDECgAhjwZAAMYKACGQBkAAxgoAIbMGAQDFCgAhvQYBAMUKACG_BgAA_QreBiLABgEAxQoAIcEGQADhCgAhwgZAAMYKACHDBgEAxAoAIcQGAQDFCgAh3gYBAMQKACEHFQAAyAoAIG4AAP8KACBvAAD_CgAgkQYAAADeBgKSBgAAAN4GCJMGAAAA3gYImAYAAP4K3gYiBxUAAMgKACBuAAD_CgAgbwAA_woAIJEGAAAA3gYCkgYAAADeBgiTBgAAAN4GCJgGAAD-Ct4GIgSRBgAAAN4GApIGAAAA3gYIkwYAAADeBgiYBgAA_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_wGItUGAADvCtUGItcGEADxCgAh2AYBAMQKACHZBgIA8goAIfoGAQDECgAh_AYBAMQKACH9BgEAxQoAIf4GAQDFCgAh_wYBAMUKACGABwEAxQoAIYEHAQDFCgAhggcAAJoLACCDB0AA4QoAIQcVAADICgAgbgAAnQsAIG8AAJ0LACCRBgAAAPwGApIGAAAA_AYIkwYAAAD8BgiYBgAAnAv8BiIPFQAAywoAIG4AAJsLACBvAACbCwAgkQaAAAAAAZQGgAAAAAGVBoAAAAABlgaAAAAAAZcGgAAAAAGYBoAAAAABpgYBAAAAAacGAQAAAAGoBgEAAAABqQaAAAAAAaoGgAAAAAGrBoAAAAABDJEGgAAAAAGUBoAAAAABlQaAAAAAAZYGgAAAAAGXBoAAAAABmAaAAAAAAaYGAQAAAAGnBgEAAAABqAYBAAAAAakGgAAAAAGqBoAAAAABqwaAAAAAAQcVAADICgAgbgAAnQsAIG8AAJ0LACCRBgAAAPwGApIGAAAA_AYIkwYAAAD8BgiYBgAAnAv8BiIEkQYAAAD8BgKSBgAAAPwGCJMGAAAA_AYImAYAAJ0L_AYiD4QGAACeCwAwhQYAAO4GABCGBgAAngsAMIcGAQDECgAhjAYBAMQKACGPBkAAxgoAIZAGQADGCgAhhAcBAMQKACGFBwEAxAoAIYYHAQDECgAhhwcBAMQKACGIBwEAxAoAIYkHAQDECgAhigcgANIKACGLBwEAxQoAIRAHAACgCwAghAYAAJ8LADCFBgAA5wEAEIYGAACfCwAwhwYBANcKACGMBgEA1woAIY8GQADbCgAhkAZAANsKACGEBwEA1woAIYUHAQDXCgAhhgcBANcKACGHBwEA1woAIYgHAQDXCgAhiQcBANcKACGKByAA2goAIYsHAQDYCgAhKAYAANILACAMAACECwAgDQAAhgsAIBEAANULACAcAACICwAgJQAAhQsAICcAAIcLACAqAADdCwAgLgAAzgsAIC8AAM8LACAwAADRCwAgMQAA0wsAIDIAANQLACA0AACXCwAgNQAA1wsAIDYAANgLACA3AADZCwAgOwAAzQsAIDwAANALACBAAADcCwAgQQAA1gsAIEIAANoLACBDAADbCwAgSAAA3gsAIEkAAN8LACBKAADgCwAgSwAA4AsAIIQGAADLCwAwhQYAABYAEIYGAADLCwAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhuwYAAMwLrQcj4AYBANcKACHmBgEA2AoAIasHAQDYCgAhrgcBANgKACHsBwAAFgAg7QcAABYAIBqEBgAAoQsAMIUGAADWBgAQhgYAAKELADCHBgEAxAoAIYwGAQDECgAhjQYBAMQKACGPBkAAxgoAIZAGQADGCgAhswYBAMQKACG_BgAAowuQByLXBhAA8QoAIdgGAQDECgAh2QYCAPIKACHoBgEAxAoAIfwGAQDECgAh_QYBAMUKACH-BgEAxQoAIf8GAQDFCgAhgAcBAMUKACGBBwEAxQoAIYIHAACaCwAggwdAAOEKACGMBwEAxAoAIY4HAACiC44HIpAHAQDECgAhkQdAAMYKACEHFQAAyAoAIG4AAKcLACBvAACnCwAgkQYAAACOBwKSBgAAAI4HCJMGAAAAjgcImAYAAKYLjgciBxUAAMgKACBuAAClCwAgbwAApQsAIJEGAAAAkAcCkgYAAACQBwiTBgAAAJAHCJgGAACkC5AHIgcVAADICgAgbgAApQsAIG8AAKULACCRBgAAAJAHApIGAAAAkAcIkwYAAACQBwiYBgAApAuQByIEkQYAAACQBwKSBgAAAJAHCJMGAAAAkAcImAYAAKULkAciBxUAAMgKACBuAACnCwAgbwAApwsAIJEGAAAAjgcCkgYAAACOBwiTBgAAAI4HCJgGAACmC44HIgSRBgAAAI4HApIGAAAAjgcIkwYAAACOBwiYBgAApwuOByINhAYAAKgLADCFBgAAwAYAEIYGAACoCwAwhwYBAMQKACGMBgEAxAoAIY0GAQDECgAhjwZAAMYKACGQBkAAxgoAIdgGAQDECgAh6AYBAMQKACGKByAA0goAIZIHEADxCgAhkwcQAPEKACEHhAYAAKkLADCFBgAAqgYAEIYGAACpCwAwhwYBAMQKACGOBgEAxAoAIZQHAQDECgAhlQdAAMYKACEHhAYAAKoLADCFBgAAlAYAEIYGAACqCwAwhwYBAMQKACGPBkAAxgoAIZQHAQDECgAhlwcAAKsLlwciBxUAAMgKACBuAACtCwAgbwAArQsAIJEGAAAAlwcCkgYAAACXBwiTBgAAAJcHCJgGAACsC5cHIgcVAADICgAgbgAArQsAIG8AAK0LACCRBgAAAJcHApIGAAAAlwcIkwYAAACXBwiYBgAArAuXByIEkQYAAACXBwKSBgAAAJcHCJMGAAAAlwcImAYAAK0LlwciC4QGAACuCwAwhQYAAP4FABCGBgAArgsAMIcGAQDECgAhjAYBAMQKACGPBkAAxgoAIZAGQADGCgAhuAYBAMQKACG5BgEAxAoAIZgHAQDECgAhmQcAAKsLlwciE4QGAACvCwAwhQYAAOgFABCGBgAArwsAMIcGAQDECgAhjwZAAMYKACGQBkAAxgoAIbEGAQDFCgAhswYBAMUKACG_BgAAsQudByLBBkAA4QoAIcQGAQDFCgAhmwcAALALmwcinQcBAMQKACGeBwEAxAoAIZ8HAQDECgAhoAcBAMUKACGhBwEAxQoAIaIHAQDFCgAhowdAAMYKACEHFQAAyAoAIG4AALULACBvAAC1CwAgkQYAAACbBwKSBgAAAJsHCJMGAAAAmwcImAYAALQLmwciBxUAAMgKACBuAACzCwAgbwAAswsAIJEGAAAAnQcCkgYAAACdBwiTBgAAAJ0HCJgGAACyC50HIgcVAADICgAgbgAAswsAIG8AALMLACCRBgAAAJ0HApIGAAAAnQcIkwYAAACdBwiYBgAAsgudByIEkQYAAACdBwKSBgAAAJ0HCJMGAAAAnQcImAYAALMLnQciBxUAAMgKACBuAAC1CwAgbwAAtQsAIJEGAAAAmwcCkgYAAACbBwiTBgAAAJsHCJgGAAC0C5sHIgSRBgAAAJsHApIGAAAAmwcIkwYAAACbBwiYBgAAtQubByINhAYAALYLADCFBgAAygUAEIYGAAC2CwAwhwYBAMQKACGMBgEAxAoAIY8GQADGCgAhkAZAAMYKACG_BgAAuAunByLBBkAA4QoAIZ8HAQDECgAhpQcAALcLpQcipwcBAMUKACGoBwEAxQoAIQcVAADICgAgbgAAvAsAIG8AALwLACCRBgAAAKUHApIGAAAApQcIkwYAAAClBwiYBgAAuwulByIHFQAAyAoAIG4AALoLACBvAAC6CwAgkQYAAACnBwKSBgAAAKcHCJMGAAAApwcImAYAALkLpwciBxUAAMgKACBuAAC6CwAgbwAAugsAIJEGAAAApwcCkgYAAACnBwiTBgAAAKcHCJgGAAC5C6cHIgSRBgAAAKcHApIGAAAApwcIkwYAAACnBwiYBgAAugunByIHFQAAyAoAIG4AALwLACBvAAC8CwAgkQYAAAClBwKSBgAAAKUHCJMGAAAApQcImAYAALsLpQciBJEGAAAApQcCkgYAAAClBwiTBgAAAKUHCJgGAAC8C6UHIh6EBgAAvQsAMIUGAACyBQAQhgYAAL0LADCHBgEAxAoAIYwGAQDFCgAhjwZAAMYKACGQBkAAxgoAIb8GAADBC70HIsEGQADhCgAh5gYBAMUKACGoBwEAxQoAIakHAQDECgAhqgcBAMQKACGrBwEAxQoAIa0HAAC-C60HI64HAQDFCgAhrwcAAL8L1QYjsAcQAMALACGxBwEAxAoAIbIHAgCKCwAhswcAAJkL_AYitAcBAMUKACG1BwEAxQoAIbYHAQDFCgAhtwcBAMUKACG4BwEAxQoAIbkHAQDFCgAhugcAAJoLACC7B0AA4QoAIb0HAQDFCgAhBxUAAMsKACBuAADJCwAgbwAAyQsAIJEGAAAArQcDkgYAAACtBwmTBgAAAK0HCZgGAADIC60HIwcVAADLCgAgbgAAxwsAIG8AAMcLACCRBgAAANUGA5IGAAAA1QYJkwYAAADVBgmYBgAAxgvVBiMNFQAAywoAIG4AAMULACBvAADFCwAg8AEAAMULACDxAQAAxQsAIJEGEAAAAAGSBhAAAAAFkwYQAAAABZQGEAAAAAGVBhAAAAABlgYQAAAAAZcGEAAAAAGYBhAAxAsAIQcVAADICgAgbgAAwwsAIG8AAMMLACCRBgAAAL0HApIGAAAAvQcIkwYAAAC9BwiYBgAAwgu9ByIHFQAAyAoAIG4AAMMLACBvAADDCwAgkQYAAAC9BwKSBgAAAL0HCJMGAAAAvQcImAYAAMILvQciBJEGAAAAvQcCkgYAAAC9BwiTBgAAAL0HCJgGAADDC70HIg0VAADLCgAgbgAAxQsAIG8AAMULACDwAQAAxQsAIPEBAADFCwAgkQYQAAAAAZIGEAAAAAWTBhAAAAAFlAYQAAAAAZUGEAAAAAGWBhAAAAABlwYQAAAAAZgGEADECwAhCJEGEAAAAAGSBhAAAAAFkwYQAAAABZQGEAAAAAGVBhAAAAABlgYQAAAAAZcGEAAAAAGYBhAAxQsAIQcVAADLCgAgbgAAxwsAIG8AAMcLACCRBgAAANUGA5IGAAAA1QYJkwYAAADVBgmYBgAAxgvVBiMEkQYAAADVBgOSBgAAANUGCZMGAAAA1QYJmAYAAMcL1QYjBxUAAMsKACBuAADJCwAgbwAAyQsAIJEGAAAArQcDkgYAAACtBwmTBgAAAK0HCZgGAADIC60HIwSRBgAAAK0HA5IGAAAArQcJkwYAAACtBwmYBgAAyQutByMLhAYAAMoLADCFBgAAmAUAEIYGAADKCwAwhwYBAMQKACGPBkAAxgoAIZAGQADGCgAhuwYAAL4LrQcj4AYBAMQKACHmBgEAxQoAIasHAQDFCgAhrgcBAMUKACEmBgAA0gsAIAwAAIQLACANAACGCwAgEQAA1QsAIBwAAIgLACAlAACFCwAgJwAAhwsAICoAAN0LACAuAADOCwAgLwAAzwsAIDAAANELACAxAADTCwAgMgAA1AsAIDQAAJcLACA1AADXCwAgNgAA2AsAIDcAANkLACA7AADNCwAgPAAA0AsAIEAAANwLACBBAADWCwAgQgAA2gsAIEMAANsLACBIAADeCwAgSQAA3wsAIEoAAOALACBLAADgCwAghAYAAMsLADCFBgAAFgAQhgYAAMsLADCHBgEA1woAIY8GQADbCgAhkAZAANsKACG7BgAAzAutByPgBgEA1woAIeYGAQDYCgAhqwcBANgKACGuBwEA2AoAIQSRBgAAAK0HA5IGAAAArQcJkwYAAACtBwmYBgAAyQutByMD4wYAABIAIOQGAAASACDlBgAAEgAgA-MGAAAdACDkBgAAHQAg5QYAAB0AIAPjBgAAawAg5AYAAGsAIOUGAABrACAD4wYAAMoBACDkBgAAygEAIOUGAADKAQAgA-MGAAAhACDkBgAAIQAg5QYAACEAIAPjBgAACwAg5AYAAAsAIOUGAAALACAD4wYAAA4AIOQGAAAOACDlBgAADgAgA-MGAABTACDkBgAAUwAg5QYAAFMAIAPjBgAAOgAg5AYAADoAIOUGAAA6ACAD4wYAANUBACDkBgAA1QEAIOUGAADVAQAgA-MGAAA_ACDkBgAAPwAg5QYAAD8AIAPjBgAARAAg5AYAAEQAIOUGAABEACAD4wYAAIkBACDkBgAAiQEAIOUGAACJAQAgEgcAAKALACCEBgAAnwsAMIUGAADnAQAQhgYAAJ8LADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIYQHAQDXCgAhhQcBANcKACGGBwEA1woAIYcHAQDXCgAhiAcBANcKACGJBwEA1woAIYoHIADaCgAhiwcBANgKACHsBwAA5wEAIO0HAADnAQAgA-MGAADpAQAg5AYAAOkBACDlBgAA6QEAIAPjBgAA2wEAIOQGAADbAQAg5QYAANsBACAD4wYAACoAIOQGAAAqACDlBgAAKgAgA-MGAADwAQAg5AYAAPABACDlBgAA8AEAIAPjBgAA_gEAIOQGAAD-AQAg5QYAAP4BACAD4wYAAFsAIOQGAABbACDlBgAAWwAgCoQGAADhCwAwhQYAAIAFABCGBgAA4QsAMIcGAQDECgAhjAYBAMUKACGPBkAAxgoAIZAGQADGCgAh5gYBAMUKACGrBwEAxQoAIb4HAQDECgAhCoQGAADiCwAwhQYAAOgEABCGBgAA4gsAMIcGAQDECgAhjwZAAMYKACGQBkAAxgoAIeYGAQDFCgAh9wYBAMUKACGrBwEAxQoAIb4HAQDECgAhD4QGAADjCwAwhQYAANAEABCGBgAA4wsAMIcGAQDECgAhjAYBAMQKACGNBgEAxQoAIY8GQADGCgAhkAZAAMYKACGvBgEAxAoAIbAGAQDECgAhsQYBAMQKACGzBgEAxAoAIegGAQDECgAh-AYBAMUKACG_B0AAxgoAIQ2EBgAA5AsAMIUGAAC2BAAQhgYAAOQLADCHBgEAxAoAIYwGAQDECgAhjQYBAMQKACGPBkAAxgoAIZAGQADGCgAh5gYBAMUKACHyBgIAigsAIfgGAQDFCgAhwAcBAMQKACHBBwEAxAoAIQyEBgAA5QsAMIUGAACeBAAQhgYAAOULADCHBgEAxAoAIYwGAQDECgAhjwZAAMYKACGQBkAAxgoAIeAGAQDFCgAhwgcBAMQKACHDBwEAxAoAIcQHAgDyCgAhxgcAAOYLxgciBxUAAMgKACBuAADoCwAgbwAA6AsAIJEGAAAAxgcCkgYAAADGBwiTBgAAAMYHCJgGAADnC8YHIgcVAADICgAgbgAA6AsAIG8AAOgLACCRBgAAAMYHApIGAAAAxgcIkwYAAADGBwiYBgAA5wvGByIEkQYAAADGBwKSBgAAAMYHCJMGAAAAxgcImAYAAOgLxgciCoQGAADpCwAwhQYAAIgEABCGBgAA6QsAMIcGAQDECgAhjAYBAMQKACGNBgEAxQoAIY8GQADGCgAhkAZAAMYKACHgBgEAxAoAIeYGAQDFCgAhCYQGAADqCwAwhQYAAPADABCGBgAA6gsAMIcGAQDECgAhjgYBAMQKACGPBkAAxgoAIZAGQADGCgAhxwcBAMQKACHIB0AAxgoAIQmEBgAA6wsAMIUGAADaAwAQhgYAAOsLADCHBgEAxAoAIY8GQADGCgAhkAZAAMYKACHIB0AAxgoAIckHAQDECgAhygcBAMQKACEJhAYAAOwLADCFBgAAxwMAEIYGAADsCwAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhyAdAANsKACHJBwEA1woAIcoHAQDXCgAhEIQGAADtCwAwhQYAAMEDABCGBgAA7QsAMIcGAQDECgAhjgYBAMQKACGPBkAAxgoAIZAGQADGCgAhywcBAMQKACHMBwEAxAoAIc0HAQDFCgAhzgcBAMUKACHPBwEAxQoAIdAHQADhCgAh0QdAAOEKACHSBwEAxQoAIdMHAQDFCgAhC4QGAADuCwAwhQYAAKsDABCGBgAA7gsAMIcGAQDECgAhjgYBAMQKACGPBkAAxgoAIZAGQADGCgAhyAdAAMYKACHUBwEAxAoAIdUHAQDFCgAh1gcBAMUKACEShAYAAO8LADCFBgAAlQMAEIYGAADvCwAwhwYBAMQKACGLBgEAxQoAIY8GQADGCgAhkAZAAMYKACHgBgEAxAoAIZcHAQDECgAh1wcBAMQKACHYByAA0goAIdkHAQDFCgAh2gcBAMUKACHbBwEAxQoAIdwHAQDFCgAh3QcBAMUKACHeBwEAxQoAId8HAQDECgAhJgQAAPELACAFAADyCwAgBgAA0gsAIBAAANMLACAZAADUCwAgNAAAlwsAIEEAANYLACBOAADWCwAgTwAAlwsAIFAAAPMLACBRAACUCwAgUgAAlAsAIFMAAPQLACBUAAD1CwAgVQAA4AsAIFYAAOALACBXAADfCwAgWAAA3wsAIFkAAN4LACBaAAD2CwAghAYAAPALADCFBgAAUQAQhgYAAPALADCHBgEA1woAIYsGAQDYCgAhjwZAANsKACGQBkAA2woAIeAGAQDXCgAhlwcBANcKACHXBwEA1woAIdgHIADaCgAh2QcBANgKACHaBwEA2AoAIdsHAQDYCgAh3AcBANgKACHdBwEA2AoAId4HAQDYCgAh3wcBANcKACED4wYAAAMAIOQGAAADACDlBgAAAwAgA-MGAAAHACDkBgAABwAg5QYAAAcAIBMzAADcCgAghAYAANYKADCFBgAAsAIAEIYGAADWCgAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhnAYBANcKACGdBgEA1woAIZ4GAQDXCgAhnwYBANcKACGgBgEA2AoAIaEGAADQCgAgogYAANAKACCjBgAA2QoAIKQGAADZCgAgpQYgANoKACHsBwAAsAIAIO0HAACwAgAgDxcAANwKACCEBgAAgQsAMIUGAAC0AgAQhgYAAIELADCHBgEA1woAIY8GQADbCgAhkAZAANsKACGdBgEA1woAIZ4GAQDXCgAhowYAANkKACClBiAA2goAId4GAQDXCgAh3wYAANAKACDsBwAAtAIAIO0HAAC0AgAgA-MGAAC2AgAg5AYAALYCACDlBgAAtgIAIAPjBgAA-AEAIOQGAAD4AQAg5QYAAPgBACAJhAYAAPcLADCFBgAA_QIAEIYGAAD3CwAwhwYBAMQKACGPBkAAxgoAIZAGQADGCgAhvwYAAPgL4gcixQYBAMQKACHgB0AAxgoAIQcVAADICgAgbgAA-gsAIG8AAPoLACCRBgAAAOIHApIGAAAA4gcIkwYAAADiBwiYBgAA-QviByIHFQAAyAoAIG4AAPoLACBvAAD6CwAgkQYAAADiBwKSBgAAAOIHCJMGAAAA4gcImAYAAPkL4gciBJEGAAAA4gcCkgYAAADiBwiTBgAAAOIHCJgGAAD6C-IHIgqEBgAA-wsAMIUGAADnAgAQhgYAAPsLADCHBgEAxAoAIYwGAQDECgAhjgYBAMQKACGPBkAAxgoAIZAGQADGCgAhlwcAAPwL4wci4wcBAMUKACEHFQAAyAoAIG4AAP4LACBvAAD-CwAgkQYAAADjBwKSBgAAAOMHCJMGAAAA4wcImAYAAP0L4wciBxUAAMgKACBuAAD-CwAgbwAA_gsAIJEGAAAA4wcCkgYAAADjBwiTBgAAAOMHCJgGAAD9C-MHIgSRBgAAAOMHApIGAAAA4wcIkwYAAADjBwiYBgAA_gvjByIKAwAA3AoAIIQGAAD_CwAwhQYAALYCABCGBgAA_wsAMIcGAQDXCgAhjgYBANcKACGPBkAA2woAIZAGQADbCgAhxwcBANcKACHIB0AA2woAIRAHAACgCwAgIAAA3AoAID4AAIQMACCEBgAAgAwAMIUGAAD-AQAQhgYAAIAMADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIb8GAACCDKcHIsEGQACDDAAhnwcBANcKACGlBwAAgQylByKnBwEA2AoAIagHAQDYCgAhBJEGAAAApQcCkgYAAAClBwiTBgAAAKUHCJgGAAC8C6UHIgSRBgAAAKcHApIGAAAApwcIkwYAAACnBwiYBgAAugunByIIkQZAAAAAAZIGQAAAAAWTBkAAAAAFlAZAAAAAAZUGQAAAAAGWBkAAAAABlwZAAAAAAZgGQADjCgAhKAQAAPELACAFAADyCwAgBgAA0gsAIBAAANMLACAZAADUCwAgNAAAlwsAIEEAANYLACBOAADWCwAgTwAAlwsAIFAAAPMLACBRAACUCwAgUgAAlAsAIFMAAPQLACBUAAD1CwAgVQAA4AsAIFYAAOALACBXAADfCwAgWAAA3wsAIFkAAN4LACBaAAD2CwAghAYAAPALADCFBgAAUQAQhgYAAPALADCHBgEA1woAIYsGAQDYCgAhjwZAANsKACGQBkAA2woAIeAGAQDXCgAhlwcBANcKACHXBwEA1woAIdgHIADaCgAh2QcBANgKACHaBwEA2AoAIdsHAQDYCgAh3AcBANgKACHdBwEA2AoAId4HAQDYCgAh3wcBANcKACHsBwAAUQAg7QcAAFEAIAKOBgEAAAABlAcBAAAAAQkDAADcCgAgRQAAhwwAIIQGAACGDAAwhQYAAPgBABCGBgAAhgwAMIcGAQDXCgAhjgYBANcKACGUBwEA1woAIZUHQADbCgAhEQcAAKALACBEAADcCgAgRgAAjAwAIEcAAPYLACCEBgAAiwwAMIUGAADwAQAQhgYAAIsMADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIbgGAQDXCgAhuQYBANcKACGYBwEA1woAIZkHAACKDJcHIuwHAADwAQAg7QcAAPABACAClAcBAAAAAZcHAAAAlwcCCEUAAIcMACCEBgAAiQwAMIUGAAD0AQAQhgYAAIkMADCHBgEA1woAIY8GQADbCgAhlAcBANcKACGXBwAAigyXByIEkQYAAACXBwKSBgAAAJcHCJMGAAAAlwcImAYAAK0LlwciDwcAAKALACBEAADcCgAgRgAAjAwAIEcAAPYLACCEBgAAiwwAMIUGAADwAQAQhgYAAIsMADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIbgGAQDXCgAhuQYBANcKACGYBwEA1woAIZkHAACKDJcHIgPjBgAA9AEAIOQGAAD0AQAg5QYAAPQBACAWBwAAoAsAIIQGAACNDAAwhQYAAOkBABCGBgAAjQwAMIcGAQDXCgAhjAYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAJEM_AYi1QYAAI4M1QYi1wYQAI8MACHYBgEA1woAIdkGAgCQDAAh-gYBANcKACH8BgEA1woAIf0GAQDYCgAh_gYBANgKACH_BgEA2AoAIYAHAQDYCgAhgQcBANgKACGCBwAAkgwAIIMHQACDDAAhBJEGAAAA1QYCkgYAAADVBgiTBgAAANUGCJgGAAD6CtUGIgiRBhAAAAABkgYQAAAABJMGEAAAAASUBhAAAAABlQYQAAAAAZYGEAAAAAGXBhAAAAABmAYQAPYKACEIkQYCAAAAAZIGAgAAAASTBgIAAAAElAYCAAAAAZUGAgAAAAGWBgIAAAABlwYCAAAAAZgGAgDICgAhBJEGAAAA_AYCkgYAAAD8BgiTBgAAAPwGCJgGAACdC_wGIgyRBoAAAAABlAaAAAAAAZUGgAAAAAGWBoAAAAABlwaAAAAAAZgGgAAAAAGmBgEAAAABpwYBAAAAAagGAQAAAAGpBoAAAAABqgaAAAAAAasGgAAAAAERBwAAoAsAID8AAJUMACCEBgAAkwwAMIUGAADbAQAQhgYAAJMMADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIb8GAACUDNcGItMGAQDYCgAh1QYAAI4M1QYi1wYQAI8MACHYBgEA1woAIdkGAgCQDAAh2gZAANsKACHbBkAA2woAIQSRBgAAANcGApIGAAAA1wYIkwYAAADXBgiYBgAA-ArXBiIkBwAAmwwAID0AANwKACA-AACEDAAgQAAA3AsAIIQGAACWDAAwhQYAANUBABCGBgAAlgwAMIcGAQDXCgAhjAYBANgKACGPBkAA2woAIZAGQADbCgAhvwYAAJoMvQciwQZAAIMMACHmBgEA2AoAIagHAQDYCgAhqQcBANcKACGqBwEA1woAIasHAQDYCgAhrQcAAMwLrQcjrgcBANgKACGvBwAAlwzVBiOwBxAAmAwAIbEHAQDXCgAhsgcCAJkMACGzBwAAkQz8BiK0BwEA2AoAIbUHAQDYCgAhtgcBANgKACG3BwEA2AoAIbgHAQDYCgAhuQcBANgKACG6BwAAkgwAILsHQACDDAAhvQcBANgKACHsBwAA1QEAIO0HAADVAQAgIgcAAJsMACA9AADcCgAgPgAAhAwAIEAAANwLACCEBgAAlgwAMIUGAADVAQAQhgYAAJYMADCHBgEA1woAIYwGAQDYCgAhjwZAANsKACGQBkAA2woAIb8GAACaDL0HIsEGQACDDAAh5gYBANgKACGoBwEA2AoAIakHAQDXCgAhqgcBANcKACGrBwEA2AoAIa0HAADMC60HI64HAQDYCgAhrwcAAJcM1QYjsAcQAJgMACGxBwEA1woAIbIHAgCZDAAhswcAAJEM_AYitAcBANgKACG1BwEA2AoAIbYHAQDYCgAhtwcBANgKACG4BwEA2AoAIbkHAQDYCgAhugcAAJIMACC7B0AAgwwAIb0HAQDYCgAhBJEGAAAA1QYDkgYAAADVBgmTBgAAANUGCZgGAADHC9UGIwiRBhAAAAABkgYQAAAABZMGEAAAAAWUBhAAAAABlQYQAAAAAZYGEAAAAAGXBhAAAAABmAYQAMULACEIkQYCAAAAAZIGAgAAAAWTBgIAAAAFlAYCAAAAAZUGAgAAAAGWBgIAAAABlwYCAAAAAZgGAgDLCgAhBJEGAAAAvQcCkgYAAAC9BwiTBgAAAL0HCJgGAADDC70HIigGAADSCwAgDAAAhAsAIA0AAIYLACARAADVCwAgHAAAiAsAICUAAIULACAnAACHCwAgKgAA3QsAIC4AAM4LACAvAADPCwAgMAAA0QsAIDEAANMLACAyAADUCwAgNAAAlwsAIDUAANcLACA2AADYCwAgNwAA2QsAIDsAAM0LACA8AADQCwAgQAAA3AsAIEEAANYLACBCAADaCwAgQwAA2wsAIEgAAN4LACBJAADfCwAgSgAA4AsAIEsAAOALACCEBgAAywsAMIUGAAAWABCGBgAAywsAMIcGAQDXCgAhjwZAANsKACGQBkAA2woAIbsGAADMC60HI-AGAQDXCgAh5gYBANgKACGrBwEA2AoAIa4HAQDYCgAh7AcAABYAIO0HAAAWACAOBwAAoAsAICoAAN0LACCEBgAAnAwAMIUGAADKAQAQhgYAAJwMADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIeAGAQDYCgAhwgcBANcKACHDBwEA1woAIcQHAgCQDAAhxgcAAJ0MxgciBJEGAAAAxgcCkgYAAADGBwiTBgAAAMYHCJgGAADoC8YHIhsHAACgCwAgCQAAogwAIBAAAKEMACApAACgDAAghAYAAJ4MADCFBgAAiQEAEIYGAACeDAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIbEGAQDXCgAhxQYBANcKACHGBggAnwwAIccGCACfDAAhyAYIAJ8MACHJBggAnwwAIcoGCACfDAAhywYIAJ8MACHMBggAnwwAIc0GCACfDAAhzgYIAJ8MACHPBggAnwwAIdAGCACfDAAh0QYIAJ8MACHSBggAnwwAIQiRBggAAAABkgYIAAAABZMGCAAAAAWUBggAAAABlQYIAAAAAZYGCAAAAAGXBggAAAABmAYIAO0KACEcBwAAoAsAIAkAAKIMACAKAADSDAAgCwAA3QsAIA4AAMMMACAPAADGDAAgEAAAoQwAIBkAALgMACAbAACwDAAgLAAA0AwAIC0AANEMACCEBgAAzwwAMIUGAAAmABCGBgAAzwwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACGvBgEA1woAIbAGAQDXCgAhsQYBANcKACGzBgEA1woAIegGAQDXCgAh-AYBANgKACG_B0AA2woAIewHAAAmACDtBwAAJgAgGAMAANwKACAHAACgCwAgCQAArwwAIA0AAIYLACARAADVCwAgIgAA4AsAICQAANcLACBMAACXCwAgTQAA2QsAIIQGAADZDAAwhQYAAA4AEIYGAADZDAAwhwYBANcKACGIBgEA1woAIYkGAQDXCgAhigYBANcKACGLBgEA2AoAIYwGAQDXCgAhjQYBANcKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHsBwAADgAg7QcAAA4AIB8IAADWDAAgDAAAhAsAIA0AAIYLACARAADVCwAgHAAAiAsAICUAAIULACAnAACHCwAgKgAA3QsAIC4AAM4LACAvAADPCwAgMAAA0QsAIDEAANMLACAyAADUCwAgNAAAlwsAIDUAANcLACA2AADYCwAgNwAA2QsAIDgAAOALACA5AADSCwAghAYAANUMADCFBgAAGAAQhgYAANUMADCHBgEA1woAIY8GQADbCgAhkAZAANsKACHmBgEA2AoAIfcGAQDYCgAhqwcBANgKACG-BwEA1woAIewHAAAYACDtBwAAGAAgApwGAQAAAAHDBgEAAAABFwcAAKALACAJAACiDAAgEAAApwwAIBYAAKYMACAYAACEDAAgMwAA3AoAIIQGAACkDAAwhQYAAKEBABCGBgAApAwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACGcBgEA1woAIbEGAQDYCgAhvQYBANgKACG_BgAApQy_BiLABgEA2AoAIcEGQACDDAAhwgZAANsKACHDBgEA1woAIcQGAQDYCgAhBJEGAAAAvwYCkgYAAAC_BgiTBgAAAL8GCJgGAADpCr8GIhIUAACXCwAghAYAAJYLADCFBgAAigcAEIYGAACWCwAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIbgGAQDXCgAh9AYBANgKACH1BgEA1woAIfYGAADQCgAg9wYBANgKACH4BgEA2AoAIfkGAQDXCgAh7AcAAIoHACDtBwAAigcAIBgDAADcCgAgBwAAoAsAIAkAAK8MACANAACGCwAgEQAA1QsAICIAAOALACAkAADXCwAgTAAAlwsAIE0AANkLACCEBgAA2QwAMIUGAAAOABCGBgAA2QwAMIcGAQDXCgAhiAYBANcKACGJBgEA1woAIYoGAQDXCgAhiwYBANgKACGMBgEA1woAIY0GAQDXCgAhjgYBANcKACGPBkAA2woAIZAGQADbCgAh7AcAAA4AIO0HAAAOACATAwAA3AoAIAcAAKALACAJAACiDAAgDQAAhgsAIBMAANgLACAaAACUCwAgHAAAiAsAICIAAOALACCEBgAAqAwAMIUGAABTABCGBgAAqAwAMIcGAQDXCgAhiwYBANgKACGMBgEA1woAIY0GAQDYCgAhjgYBANcKACGPBkAA2woAIZAGQADbCgAh3AYBANcKACENBwAAoAsAIAkAAKIMACAlAACFCwAghAYAAKkMADCFBgAAawAQhgYAAKkMADCHBgEA1woAIYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAh4AYBANcKACHmBgEA2AoAIQLFBgEAAAAB4AdAAAAAAQopAACgDAAghAYAAKsMADCFBgAAhQEAEIYGAACrDAAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAKwM4gcixQYBANcKACHgB0AA2woAIQSRBgAAAOIHApIGAAAA4gcIkwYAAADiBwiYBgAA-gviByICjQYBAAAAAegGAQAAAAERBwAAoAsAIAkAAK8MACAbAACwDAAgHAAAiAsAIIQGAACuDAAwhQYAAHQAEIYGAACuDAAwhwYBANcKACGMBgEA1woAIY0GAQDXCgAhjwZAANsKACGQBkAA2woAIdgGAQDXCgAh6AYBANcKACGKByAA2goAIZIHEACPDAAhkwcQAI8MACEfCAAA1gwAIAwAAIQLACANAACGCwAgEQAA1QsAIBwAAIgLACAlAACFCwAgJwAAhwsAICoAAN0LACAuAADOCwAgLwAAzwsAIDAAANELACAxAADTCwAgMgAA1AsAIDQAAJcLACA1AADXCwAgNgAA2AsAIDcAANkLACA4AADgCwAgOQAA0gsAIIQGAADVDAAwhQYAABgAEIYGAADVDAAwhwYBANcKACGPBkAA2woAIZAGQADbCgAh5gYBANgKACH3BgEA2AoAIasHAQDYCgAhvgcBANcKACHsBwAAGAAg7QcAABgAIA8MAACECwAgDQAAhgsAIBwAAIgLACAlAACFCwAgJwAAhwsAIIQGAACDCwAwhQYAAC8AEIYGAACDCwAwhwYBANcKACGMBgEA1woAIeAGAQDXCgAh4QZAANsKACHiBkAA2woAIewHAAAvACDtBwAALwAgGhAAAKcMACAYAACEDAAgGQAAtAwAIB4AAKALACAfAACgCwAgIAAA3AoAICEAAKIMACCEBgAAsQwAMIUGAABbABCGBgAAsQwAMIcGAQDXCgAhjwZAANsKACGQBkAA2woAIbEGAQDYCgAhswYBANgKACG_BgAAswydByLBBkAAgwwAIcQGAQDYCgAhmwcAALIMmwcinQcBANcKACGeBwEA1woAIZ8HAQDXCgAhoAcBANgKACGhBwEA2AoAIaIHAQDYCgAhowdAANsKACEEkQYAAACbBwKSBgAAAJsHCJMGAAAAmwcImAYAALULmwciBJEGAAAAnQcCkgYAAACdBwiTBgAAAJ0HCJgGAACzC50HIhUDAADcCgAgBwAAoAsAIAkAAKIMACANAACGCwAgEwAA2AsAIBoAAJQLACAcAACICwAgIgAA4AsAIIQGAACoDAAwhQYAAFMAEIYGAACoDAAwhwYBANcKACGLBgEA2AoAIYwGAQDXCgAhjQYBANgKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHcBgEA1woAIewHAABTACDtBwAAUwAgHwcAAKALACAJAACvDAAgGQAAuAwAIBsAALAMACAdAAC5DAAghAYAALUMADCFBgAAVQAQhgYAALUMADCHBgEA1woAIYwGAQDXCgAhjQYBANcKACGPBkAA2woAIZAGQADbCgAhswYBANcKACG_BgAAtwyQByLXBhAAjwwAIdgGAQDXCgAh2QYCAJAMACHoBgEA1woAIfwGAQDXCgAh_QYBANgKACH-BgEA2AoAIf8GAQDYCgAhgAcBANgKACGBBwEA2AoAIYIHAACSDAAggwdAAIMMACGMBwEA1woAIY4HAAC2DI4HIpAHAQDXCgAhkQdAANsKACEEkQYAAACOBwKSBgAAAI4HCJMGAAAAjgcImAYAAKcLjgciBJEGAAAAkAcCkgYAAACQBwiTBgAAAJAHCJgGAAClC5AHIhUDAADcCgAgBwAAoAsAIAkAAKIMACANAACGCwAgEwAA2AsAIBoAAJQLACAcAACICwAgIgAA4AsAIIQGAACoDAAwhQYAAFMAEIYGAACoDAAwhwYBANcKACGLBgEA2AoAIYwGAQDXCgAhjQYBANgKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHcBgEA1woAIewHAABTACDtBwAAUwAgEwcAAKALACAJAACvDAAgGwAAsAwAIBwAAIgLACCEBgAArgwAMIUGAAB0ABCGBgAArgwAMIcGAQDXCgAhjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACHYBgEA1woAIegGAQDXCgAhigcgANoKACGSBxAAjwwAIZMHEACPDAAh7AcAAHQAIO0HAAB0ACACwwYBAAAAAd4GAQAAAAETFgAAvQwAIBcAANwKACAYAACEDAAgGQAAtAwAIIQGAAC7DAAwhQYAAEsAEIYGAAC7DAAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhswYBANgKACG9BgEA2AoAIb8GAAC8DN4GIsAGAQDYCgAhwQZAAIMMACHCBkAA2woAIcMGAQDXCgAhxAYBANgKACHeBgEA1woAIQSRBgAAAN4GApIGAAAA3gYIkwYAAADeBgiYBgAA_wreBiISFAAAlAsAIIQGAACTCwAwhQYAAKMHABCGBgAAkwsAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACG4BgEA1woAIfQGAQDYCgAh9QYBANcKACH2BgAA0AoAIPcGAQDYCgAh-AYBANgKACH5BgEA1woAIewHAACjBwAg7QcAAKMHACACsgYBAAAAAbMGAQAAAAESBwAAoAsAIAkAAKIMACASAADADAAgGQAAuAwAIIQGAAC_DAAwhQYAAEQAEIYGAAC_DAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIbIGAQDXCgAhswYBANcKACG0BgEA2AoAIbUGAQDYCgAhtgYBANgKACG3BkAA2woAIRUHAACgCwAgCQAAogwAIA4AAMMMACAQAAChDAAgIwAA2AsAIIQGAADBDAAwhQYAAD8AEIYGAADBDAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIa8GAQDXCgAhsQYBANcKACG4BgEA1woAIbkGAQDYCgAhuwYAAMIMuwYivAZAAIMMACHsBwAAPwAg7QcAAD8AIBMHAACgCwAgCQAAogwAIA4AAMMMACAQAAChDAAgIwAA2AsAIIQGAADBDAAwhQYAAD8AEIYGAADBDAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIa8GAQDXCgAhsQYBANcKACG4BgEA1woAIbkGAQDYCgAhuwYAAMIMuwYivAZAAIMMACEEkQYAAAC7BgKSBgAAALsGCJMGAAAAuwYImAYAAOUKuwYiFgcAAKALACAJAACiDAAgDQAAhgsAIBEAANULACAbAACwDAAgJAAA1wsAICYAAMgMACCEBgAAxwwAMIUGAAA1ABCGBgAAxwwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACHgBgEA1woAIeYGAQDYCgAh5wYCAJkMACHoBgEA1woAIekGAQDYCgAh7AcAADUAIO0HAAA1ACACrwYBAAAAAbAGAQAAAAEQBwAAoAsAIAkAAKIMACAOAADDDAAgDwAAxgwAIBAAAKEMACCEBgAAxQwAMIUGAAA6ABCGBgAAxQwAMIcGAQDXCgAhjAYBANcKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACGvBgEA1woAIbAGAQDXCgAhsQYBANcKACEUBwAAoAsAIAkAAK8MACAKAADSDAAgDQAAhgsAIBEAANULACCEBgAA0wwAMIUGAAAhABCGBgAA0wwAMIcGAQDXCgAhjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACHmBgEA2AoAIfIGAgCZDAAh-AYBANgKACHABwEA1woAIcEHAQDXCgAh7AcAACEAIO0HAAAhACAUBwAAoAsAIAkAAKIMACANAACGCwAgEQAA1QsAIBsAALAMACAkAADXCwAgJgAAyAwAIIQGAADHDAAwhQYAADUAEIYGAADHDAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIeAGAQDXCgAh5gYBANgKACHnBgIAmQwAIegGAQDXCgAh6QYBANgKACEPBwAAoAsAIAkAAKIMACAlAACFCwAghAYAAKkMADCFBgAAawAQhgYAAKkMADCHBgEA1woAIYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAh4AYBANcKACHmBgEA2AoAIewHAABrACDtBwAAawAgEgcAAJsMACAJAACiDAAgCwAA3QsAIBsAAMsMACCEBgAAyQwAMIUGAAAxABCGBgAAyQwAMIcGAQDXCgAhjAYBANgKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACG_BgAAygztBiLgBgEA1woAIeYGAQDYCgAh6AYBANgKACHqBgEA1woAIesGAQDXCgAhBJEGAAAA7QYCkgYAAADtBgiTBgAAAO0GCJgGAACPC-0GIg8MAACECwAgDQAAhgsAIBwAAIgLACAlAACFCwAgJwAAhwsAIIQGAACDCwAwhQYAAC8AEIYGAACDCwAwhwYBANcKACGMBgEA1woAIeAGAQDXCgAh4QZAANsKACHiBkAA2woAIewHAAAvACDtBwAALwAgEwcAAJsMACAJAACiDAAgKAAAzQwAICkAAKAMACArAADODAAghAYAAMwMADCFBgAAKgAQhgYAAMwMADCHBgEA1woAIYwGAQDYCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhxQYBANcKACHgBgEA1woAIeYGAQDYCgAh7QYBANgKACHuBgEA1woAIe8GAQDXCgAhFAcAAJsMACAJAACiDAAgCwAA3QsAIBsAAMsMACCEBgAAyQwAMIUGAAAxABCGBgAAyQwAMIcGAQDXCgAhjAYBANgKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACG_BgAAygztBiLgBgEA1woAIeYGAQDYCgAh6AYBANgKACHqBgEA1woAIesGAQDXCgAh7AcAADEAIO0HAAAxACAQBwAAoAsAICoAAN0LACCEBgAAnAwAMIUGAADKAQAQhgYAAJwMADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIeAGAQDYCgAhwgcBANcKACHDBwEA1woAIcQHAgCQDAAhxgcAAJ0Mxgci7AcAAMoBACDtBwAAygEAIBoHAACgCwAgCQAAogwAIAoAANIMACALAADdCwAgDgAAwwwAIA8AAMYMACAQAAChDAAgGQAAuAwAIBsAALAMACAsAADQDAAgLQAA0QwAIIQGAADPDAAwhQYAACYAEIYGAADPDAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIa8GAQDXCgAhsAYBANcKACGxBgEA1woAIbMGAQDXCgAh6AYBANcKACH4BgEA2AoAIb8HQADbCgAhA-MGAACFAQAg5AYAAIUBACDlBgAAhQEAIB0HAACgCwAgCQAAogwAIBAAAKEMACApAACgDAAghAYAAJ4MADCFBgAAiQEAEIYGAACeDAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIbEGAQDXCgAhxQYBANcKACHGBggAnwwAIccGCACfDAAhyAYIAJ8MACHJBggAnwwAIcoGCACfDAAhywYIAJ8MACHMBggAnwwAIc0GCACfDAAhzgYIAJ8MACHPBggAnwwAIdAGCACfDAAh0QYIAJ8MACHSBggAnwwAIewHAACJAQAg7QcAAIkBACAUBwAAoAsAIAkAAK8MACANAACGCwAgDwAA0QsAIIQGAADUDAAwhQYAAB0AEIYGAADUDAAwhwYBANcKACGMBgEA1woAIY0GAQDXCgAhjwZAANsKACGQBkAA2woAIbgGAQDXCgAh5gYBANgKACHwBgEA2AoAIfEGQACDDAAh8gYIAJ8MACHzBggAnwwAIewHAAAdACDtBwAAHQAgEgcAAKALACAJAACvDAAgCgAA0gwAIA0AAIYLACARAADVCwAghAYAANMMADCFBgAAIQAQhgYAANMMADCHBgEA1woAIYwGAQDXCgAhjQYBANcKACGPBkAA2woAIZAGQADbCgAh5gYBANgKACHyBgIAmQwAIfgGAQDYCgAhwAcBANcKACHBBwEA1woAIRIHAACgCwAgCQAArwwAIA0AAIYLACAPAADRCwAghAYAANQMADCFBgAAHQAQhgYAANQMADCHBgEA1woAIYwGAQDXCgAhjQYBANcKACGPBkAA2woAIZAGQADbCgAhuAYBANcKACHmBgEA2AoAIfAGAQDYCgAh8QZAAIMMACHyBggAnwwAIfMGCACfDAAhHQgAANYMACAMAACECwAgDQAAhgsAIBEAANULACAcAACICwAgJQAAhQsAICcAAIcLACAqAADdCwAgLgAAzgsAIC8AAM8LACAwAADRCwAgMQAA0wsAIDIAANQLACA0AACXCwAgNQAA1wsAIDYAANgLACA3AADZCwAgOAAA4AsAIDkAANILACCEBgAA1QwAMIUGAAAYABCGBgAA1QwAMIcGAQDXCgAhjwZAANsKACGQBkAA2woAIeYGAQDYCgAh9wYBANgKACGrBwEA2AoAIb4HAQDXCgAhDgcAAJsMACA6AADYDAAghAYAANcMADCFBgAAEgAQhgYAANcMADCHBgEA1woAIYwGAQDYCgAhjwZAANsKACGQBkAA2woAIeYGAQDYCgAhqwcBANgKACG-BwEA1woAIewHAAASACDtBwAAEgAgDAcAAJsMACA6AADYDAAghAYAANcMADCFBgAAEgAQhgYAANcMADCHBgEA1woAIYwGAQDYCgAhjwZAANsKACGQBkAA2woAIeYGAQDYCgAhqwcBANgKACG-BwEA1woAIQPjBgAAGAAg5AYAABgAIOUGAAAYACAWAwAA3AoAIAcAAKALACAJAACvDAAgDQAAhgsAIBEAANULACAiAADgCwAgJAAA1wsAIEwAAJcLACBNAADZCwAghAYAANkMADCFBgAADgAQhgYAANkMADCHBgEA1woAIYgGAQDXCgAhiQYBANcKACGKBgEA1woAIYsGAQDYCgAhjAYBANcKACGNBgEA1woAIY4GAQDXCgAhjwZAANsKACGQBkAA2woAIQ0DAADcCgAgBwAAoAsAIFsAAKIMACCEBgAA2gwAMIUGAAALABCGBgAA2gwAMIcGAQDXCgAhjAYBANcKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACGXBwAA2wzjByLjBwEA2AoAIQSRBgAAAOMHApIGAAAA4wcIkwYAAADjBwiYBgAA_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_wwAIBkAAIANACAeAAD8DAAgHwAA_QwAICAAAP4MACAhAACBDQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhswYBAOMMACG_BgAA-QydByLBBkAA-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_HQAgaQAAiB4AIO4HAACAHgAg7wcAAIceACD0BwAAKAAgBWgAAP0dACBpAACFHgAg7gcAAP4dACDvBwAAhB4AIPQHAACDBQAgB2gAAPsdACBpAACCHgAg7gcAAPwdACDvBwAAgR4AIPIHAAAYACDzBwAAGAAg9AcAABoAIBYHAACaDQAgCQAAmw0AICkAAJkNACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAcUGAQAAAAHGBggAAAABxwYIAAAAAcgGCAAAAAHJBggAAAABygYIAAAAAcsGCAAAAAHMBggAAAABzQYIAAAAAc4GCAAAAAHPBggAAAAB0AYIAAAAAdEGCAAAAAHSBggAAAABA2gAAP8dACDuBwAAgB4AIPQHAAAoACADaAAA_R0AIO4HAAD-HQAg9AcAAIMFACADaAAA-x0AIO4HAAD8HQAg9AcAABoAIBIHAACxDQAgCQAAsg0AIBYAAK4NACAYAACwDQAgMwAArw0AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABnAYBAAAAAb0GAQAAAAG_BgAAAL8GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAABAgAAAKMBACBoAACtDQAgAwAAAKMBACBoAACtDQAgaQAApw0AIAFhAAD6HQAwGAcAAKALACAJAACiDAAgEAAApwwAIBYAAKYMACAYAACEDAAgMwAA3AoAIIQGAACkDAAwhQYAAKEBABCGBgAApAwAMIcGAQAAAAGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIZwGAQDXCgAhsQYBANgKACG9BgEA2AoAIb8GAAClDL8GIsAGAQDYCgAhwQZAAIMMACHCBkAA2woAIcMGAQDXCgAhxAYBANgKACHmBwAAowwAIAIAAACjAQAgYQAApw0AIAIAAACkDQAgYQAApQ0AIBGEBgAAow0AMIUGAACkDQAQhgYAAKMNADCHBgEA1woAIYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhnAYBANcKACGxBgEA2AoAIb0GAQDYCgAhvwYAAKUMvwYiwAYBANgKACHBBkAAgwwAIcIGQADbCgAhwwYBANcKACHEBgEA2AoAIRGEBgAAow0AMIUGAACkDQAQhgYAAKMNADCHBgEA1woAIYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhnAYBANcKACGxBgEA2AoAIb0GAQDYCgAhvwYAAKUMvwYiwAYBANgKACHBBkAAgwwAIcIGQADbCgAhwwYBANcKACHEBgEA2AoAIQ2HBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhnAYBAOIMACG9BgEA4wwAIb8GAACmDb8GIsAGAQDjDAAhwQZAAPoMACHCBkAA5AwAIcMGAQDiDAAhxAYBAOMMACEB8QcAAAC_BgISBwAAqw0AIAkAAKwNACAWAACoDQAgGAAAqg0AIDMAAKkNACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhnAYBAOIMACG9BgEA4wwAIb8GAACmDb8GIsAGAQDjDAAhwQZAAPoMACHCBkAA5AwAIcMGAQDiDAAhxAYBAOMMACEFaAAA6R0AIGkAAPgdACDuBwAA6h0AIO8HAAD3HQAg9AcAAIcHACAFaAAA5x0AIGkAAPUdACDuBwAA6B0AIO8HAAD0HQAg9AcAAIADACAHaAAA5R0AIGkAAPIdACDuBwAA5h0AIO8HAADxHQAg8gcAAFEAIPMHAABRACD0BwAAgAMAIAVoAADjHQAgaQAA7x0AIO4HAADkHQAg7wcAAO4dACD0BwAAgwUAIAdoAADhHQAgaQAA7B0AIO4HAADiHQAg7wcAAOsdACDyBwAAGAAg8wcAABgAIPQHAAAaACASBwAAsQ0AIAkAALINACAWAACuDQAgGAAAsA0AIDMAAK8NACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAZwGAQAAAAG9BgEAAAABvwYAAAC_BgLABgEAAAABwQZAAAAAAcIGQAAAAAHDBgEAAAABxAYBAAAAAQNoAADpHQAg7gcAAOodACD0BwAAhwcAIANoAADnHQAg7gcAAOgdACD0BwAAgAMAIANoAADlHQAg7gcAAOYdACD0BwAAgAMAIANoAADjHQAg7gcAAOQdACD0BwAAgwUAIANoAADhHQAg7gcAAOIdACD0BwAAGgAgDgcAANcNACAJAADYDQAgDgAA1g0AICMAANkNACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAG4BgEAAAABuQYBAAAAAbsGAAAAuwYCvAZAAAAAAQIAAABBACBoAADVDQAgAwAAAEEAIGgAANUNACBpAAC-DQAgAWEAAOAdADATBwAAoAsAIAkAAKIMACAOAADDDAAgEAAAoQwAICMAANgLACCEBgAAwQwAMIUGAAA_ABCGBgAAwQwAMIcGAQAAAAGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIa8GAQDXCgAhsQYBANcKACG4BgEA1woAIbkGAQDYCgAhuwYAAMIMuwYivAZAAIMMACECAAAAQQAgYQAAvg0AIAIAAAC7DQAgYQAAvA0AIA6EBgAAug0AMIUGAAC7DQAQhgYAALoNADCHBgEA1woAIYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhrwYBANcKACGxBgEA1woAIbgGAQDXCgAhuQYBANgKACG7BgAAwgy7BiK8BkAAgwwAIQ6EBgAAug0AMIUGAAC7DQAQhgYAALoNADCHBgEA1woAIYwGAQDXCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhrwYBANcKACGxBgEA1woAIbgGAQDXCgAhuQYBANgKACG7BgAAwgy7BiK8BkAAgwwAIQqHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACG4BgEA4gwAIbkGAQDjDAAhuwYAAL0NuwYivAZAAPoMACEB8QcAAAC7BgIOBwAAwA0AIAkAAMENACAOAAC_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-AYBANgKACG_B0AA2woAIQuHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACGwBgEA4gwAIbMGAQDiDAAh6AYBAOIMACH4BgEA4wwAIb8HQADkDAAhFQcAAIIOACAJAAD_DQAgCgAAgA4AIAsAAPkNACAOAAD-DQAgDwAA_A0AIBkAAP0NACAbAACBDgAgLAAA-g0AIC0AAPsNACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACGwBgEA4gwAIbMGAQDiDAAh6AYBAOIMACH4BgEA4wwAIb8HQADkDAAhC2gAAJcOADBpAACcDgAw7gcAAJgOADDvBwAAmQ4AMPAHAACaDgAg8QcAAJsOADDyBwAAmw4AMPMHAACbDgAw9AcAAJsOADD1BwAAnQ4AMPYHAACeDgAwC2gAAIoOADBpAACPDgAw7gcAAIsOADDvBwAAjA4AMPAHAACNDgAg8QcAAI4OADDyBwAAjg4AMPMHAACODgAw9AcAAI4OADD1BwAAkA4AMPYHAACRDgAwB2gAAIMOACBpAACGDgAg7gcAAIQOACDvBwAAhQ4AIPIHAACJAQAg8wcAAIkBACD0BwAArQEAIAVoAAD5HAAgaQAAqR0AIO4HAAD6HAAg7wcAAKgdACD0BwAAIwAgBWgAAPccACBpAACmHQAg7gcAAPgcACDvBwAApR0AIPQHAACdAQAgBWgAAPUcACBpAACjHQAg7gcAAPYcACDvBwAAoh0AIPQHAAA3ACAHaAAA8xwAIGkAAKAdACDuBwAA9BwAIO8HAACfHQAg8gcAABgAIPMHAAAYACD0BwAAGgAgB2gAAPEcACBpAACdHQAg7gcAAPIcACDvBwAAnB0AIPIHAAAdACDzBwAAHQAg9AcAAB8AIAVoAADvHAAgaQAAmh0AIO4HAADwHAAg7wcAAJkdACD0BwAAnwgAIAVoAADtHAAgaQAAlx0AIO4HAADuHAAg7wcAAJYdACD0BwAAgwUAIBYHAACaDQAgCQAAmw0AIBAAAIkOACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAHGBggAAAABxwYIAAAAAcgGCAAAAAHJBggAAAABygYIAAAAAcsGCAAAAAHMBggAAAABzQYIAAAAAc4GCAAAAAHPBggAAAAB0AYIAAAAAdEGCAAAAAHSBggAAAABAgAAAK0BACBoAACDDgAgAwAAAIkBACBoAACDDgAgaQAAhw4AIBgAAACJAQAgBwAAlg0AIAkAAJcNACAQAACIDgAgYQAAhw4AIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGxBgEA4gwAIcYGCACTDQAhxwYIAJMNACHIBggAkw0AIckGCACTDQAhygYIAJMNACHLBggAkw0AIcwGCACTDQAhzQYIAJMNACHOBggAkw0AIc8GCACTDQAh0AYIAJMNACHRBggAkw0AIdIGCACTDQAhFgcAAJYNACAJAACXDQAgEAAAiA4AIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGxBgEA4gwAIcYGCACTDQAhxwYIAJMNACHIBggAkw0AIckGCACTDQAhygYIAJMNACHLBggAkw0AIcwGCACTDQAhzQYIAJMNACHOBggAkw0AIc8GCACTDQAh0AYIAJMNACHRBggAkw0AIdIGCACTDQAhBWgAAJEdACBpAACUHQAg7gcAAJIdACDvBwAAkx0AIPQHAAAQACADaAAAkR0AIO4HAACSHQAg9AcAABAAIAWHBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAOIHAuAHQAAAAAECAAAAhwEAIGgAAJYOACADAAAAhwEAIGgAAJYOACBpAACVDgAgAWEAAJAdADALKQAAoAwAIIQGAACrDAAwhQYAAIUBABCGBgAAqwwAMIcGAQAAAAGPBkAA2woAIZAGQADbCgAhvwYAAKwM4gcixQYBANcKACHgB0AA2woAIecHAACqDAAgAgAAAIcBACBhAACVDgAgAgAAAJIOACBhAACTDgAgCYQGAACRDgAwhQYAAJIOABCGBgAAkQ4AMIcGAQDXCgAhjwZAANsKACGQBkAA2woAIb8GAACsDOIHIsUGAQDXCgAh4AdAANsKACEJhAYAAJEOADCFBgAAkg4AEIYGAACRDgAwhwYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAKwM4gcixQYBANcKACHgB0AA2woAIQWHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAAlA7iByLgB0AA5AwAIQHxBwAAAOIHAgWHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAAlA7iByLgB0AA5AwAIQWHBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAOIHAuAHQAAAAAEOBwAAqQ4AIAkAAKoOACAoAACnDgAgKwAAqA4AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAeYGAQAAAAHtBgEAAAAB7gYBAAAAAe8GAQAAAAECAAAALAAgaAAApg4AIAMAAAAsACBoAACmDgAgaQAAoQ4AIAFhAACPHQAwEwcAAJsMACAJAACiDAAgKAAAzQwAICkAAKAMACArAADODAAghAYAAMwMADCFBgAAKgAQhgYAAMwMADCHBgEAAAABjAYBANgKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACHFBgEA1woAIeAGAQDXCgAh5gYBANgKACHtBgEA2AoAIe4GAQDXCgAh7wYBANcKACECAAAALAAgYQAAoQ4AIAIAAACfDgAgYQAAoA4AIA6EBgAAng4AMIUGAACfDgAQhgYAAJ4OADCHBgEA1woAIYwGAQDYCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhxQYBANcKACHgBgEA1woAIeYGAQDYCgAh7QYBANgKACHuBgEA1woAIe8GAQDXCgAhDoQGAACeDgAwhQYAAJ8OABCGBgAAng4AMIcGAQDXCgAhjAYBANgKACGNBgEA2AoAIY8GQADbCgAhkAZAANsKACHFBgEA1woAIeAGAQDXCgAh5gYBANgKACHtBgEA2AoAIe4GAQDXCgAh7wYBANcKACEKhwYBAOIMACGMBgEA4wwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAh5gYBAOMMACHtBgEA4wwAIe4GAQDiDAAh7wYBAOIMACEOBwAApA4AIAkAAKUOACAoAACiDgAgKwAAow4AIIcGAQDiDAAhjAYBAOMMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIeYGAQDjDAAh7QYBAOMMACHuBgEA4gwAIe8GAQDiDAAhBWgAAIEdACBpAACNHQAg7gcAAIIdACDvBwAAjB0AIPQHAAAzACAFaAAA_xwAIGkAAIodACDuBwAAgB0AIO8HAACJHQAg9AcAAMwBACAHaAAA_RwAIGkAAIcdACDuBwAA_hwAIO8HAACGHQAg8gcAABYAIPMHAAAWACD0BwAAgwUAIAdoAAD7HAAgaQAAhB0AIO4HAAD8HAAg7wcAAIMdACDyBwAAGAAg8wcAABgAIPQHAAAaACAOBwAAqQ4AIAkAAKoOACAoAACnDgAgKwAAqA4AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAeYGAQAAAAHtBgEAAAAB7gYBAAAAAe8GAQAAAAEDaAAAgR0AIO4HAACCHQAg9AcAADMAIANoAAD_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-w4AMGkAAP8OADDuBwAA_A4AMO8HAAD9DgAw8AcAAP4OACDxBwAA8gwAMPIHAADyDAAw8wcAAPIMADD0BwAA8gwAMPUHAACADwAw9gcAAPUMADAVEAAAhQ8AIBgAAIYNACAeAACDDQAgHwAAhA0AICAAAIUNACAhAACIDQAghwYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAb8GAAAAnQcCwQZAAAAAAcQGAQAAAAGbBwAAAJsHAp0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhBwEAAAABogcBAAAAAaMHQAAAAAECAAAAXQAgaAAAhA8AIAMAAABdACBoAACEDwAgaQAAgg8AIAFhAAC6HAAwAgAAAF0AIGEAAIIPACACAAAA9gwAIGEAAIEPACAPhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhsQYBAOMMACG_BgAA-QydByLBBkAA-gwAIcQGAQDjDAAhmwcAAPgMmwcinQcBAOIMACGeBwEA4gwAIZ8HAQDiDAAhoAcBAOMMACGhBwEA4wwAIaIHAQDjDAAhowdAAOQMACEVEAAAgw8AIBgAAP8MACAeAAD8DAAgHwAA_QwAICAAAP4MACAhAACBDQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhsQYBAOMMACG_BgAA-QydByLBBkAA-gwAIcQGAQDjDAAhmwcAAPgMmwcinQcBAOIMACGeBwEA4gwAIZ8HAQDiDAAhoAcBAOMMACGhBwEA4wwAIaIHAQDjDAAhowdAAOQMACEHaAAAtRwAIGkAALgcACDuBwAAthwAIO8HAAC3HAAg8gcAAA4AIPMHAAAOACD0BwAAEAAgFRAAAIUPACAYAACGDQAgHgAAgw0AIB8AAIQNACAgAACFDQAgIQAAiA0AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAG_BgAAAJ0HAsEGQAAAAAHEBgEAAAABmwcAAACbBwKdBwEAAAABngcBAAAAAZ8HAQAAAAGgBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABA2gAALUcACDuBwAAthwAIPQHAAAQACAaBwAAmA8AIAkAAJkPACAbAACaDwAgHQAAmw8AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAACQBwLXBhAAAAAB2AYBAAAAAdkGAgAAAAHoBgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHAQAAAAGBBwEAAAABggeAAAAAAYMHQAAAAAGMBwEAAAABjgcAAACOBwKQBwEAAAABkQdAAAAAAQIAAABXACBoAACXDwAgAwAAAFcAIGgAAJcPACBpAACSDwAgAWEAALQcADAfBwAAoAsAIAkAAK8MACAZAAC4DAAgGwAAsAwAIB0AALkMACCEBgAAtQwAMIUGAABVABCGBgAAtQwAMIcGAQAAAAGMBgEA1woAIY0GAQDXCgAhjwZAANsKACGQBkAA2woAIbMGAQDXCgAhvwYAALcMkAci1wYQAI8MACHYBgEA1woAIdkGAgCQDAAh6AYBANcKACH8BgEAAAAB_QYBANgKACH-BgEAAAAB_wYBANgKACGABwEA2AoAIYEHAQDYCgAhggcAAJIMACCDB0AAgwwAIYwHAQDXCgAhjgcAALYMjgcikAcBANcKACGRB0AA2woAIQIAAABXACBhAACSDwAgAgAAAI4PACBhAACPDwAgGoQGAACNDwAwhQYAAI4PABCGBgAAjQ8AMIcGAQDXCgAhjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACGzBgEA1woAIb8GAAC3DJAHItcGEACPDAAh2AYBANcKACHZBgIAkAwAIegGAQDXCgAh_AYBANcKACH9BgEA2AoAIf4GAQDYCgAh_wYBANgKACGABwEA2AoAIYEHAQDYCgAhggcAAJIMACCDB0AAgwwAIYwHAQDXCgAhjgcAALYMjgcikAcBANcKACGRB0AA2woAIRqEBgAAjQ8AMIUGAACODwAQhgYAAI0PADCHBgEA1woAIYwGAQDXCgAhjQYBANcKACGPBkAA2woAIZAGQADbCgAhswYBANcKACG_BgAAtwyQByLXBhAAjwwAIdgGAQDXCgAh2QYCAJAMACHoBgEA1woAIfwGAQDXCgAh_QYBANgKACH-BgEA2AoAIf8GAQDYCgAhgAcBANgKACGBBwEA2AoAIYIHAACSDAAggwdAAIMMACGMBwEA1woAIY4HAAC2DI4HIpAHAQDXCgAhkQdAANsKACEWhwYBAOIMACGMBgEA4gwAIY0GAQDiDAAhjwZAAOQMACGQBkAA5AwAIb8GAACRD5AHItcGEADqDgAh2AYBAOIMACHZBgIA6w4AIegGAQDiDAAh_AYBAOIMACH9BgEA4wwAIf4GAQDjDAAh_wYBAOMMACGABwEA4wwAIYEHAQDjDAAhggeAAAAAAYMHQAD6DAAhjAcBAOIMACGOBwAAkA-OByKQBwEA4gwAIZEHQADkDAAhAfEHAAAAjgcCAfEHAAAAkAcCGgcAAJMPACAJAACUDwAgGwAAlQ8AIB0AAJYPACCHBgEA4gwAIYwGAQDiDAAhjQYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAAJEPkAci1wYQAOoOACHYBgEA4gwAIdkGAgDrDgAh6AYBAOIMACH8BgEA4gwAIf0GAQDjDAAh_gYBAOMMACH_BgEA4wwAIYAHAQDjDAAhgQcBAOMMACGCB4AAAAABgwdAAPoMACGMBwEA4gwAIY4HAACQD44HIpAHAQDiDAAhkQdAAOQMACEFaAAAphwAIGkAALIcACDuBwAApxwAIO8HAACxHAAg9AcAAIMFACAFaAAApBwAIGkAAK8cACDuBwAApRwAIO8HAACuHAAg9AcAABoAIAVoAACiHAAgaQAArBwAIO4HAACjHAAg7wcAAKscACD0BwAAnwgAIAVoAACgHAAgaQAAqRwAIO4HAAChHAAg7wcAAKgcACD0BwAAdgAgGgcAAJgPACAJAACZDwAgGwAAmg8AIB0AAJsPACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAAkAcC1wYQAAAAAdgGAQAAAAHZBgIAAAAB6AYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABjAcBAAAAAY4HAAAAjgcCkAcBAAAAAZEHQAAAAAEDaAAAphwAIO4HAACnHAAg9AcAAIMFACADaAAApBwAIO4HAAClHAAg9AcAABoAIANoAACiHAAg7gcAAKMcACD0BwAAnwgAIANoAACgHAAg7gcAAKEcACD0BwAAdgAgDhYAAKwPACAXAACtDwAgGAAArg8AIIcGAQAAAAGPBkAAAAABkAZAAAAAAb0GAQAAAAG_BgAAAN4GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAAB3gYBAAAAAQIAAABNACBoAACrDwAgAwAAAE0AIGgAAKsPACBpAACnDwAgAWEAAJ8cADAUFgAAvQwAIBcAANwKACAYAACEDAAgGQAAtAwAIIQGAAC7DAAwhQYAAEsAEIYGAAC7DAAwhwYBAAAAAY8GQADbCgAhkAZAANsKACGzBgEA2AoAIb0GAQDYCgAhvwYAALwM3gYiwAYBANgKACHBBkAAgwwAIcIGQADbCgAhwwYBANcKACHEBgEA2AoAId4GAQDXCgAh6QcAALoMACACAAAATQAgYQAApw8AIAIAAACkDwAgYQAApQ8AIA-EBgAAow8AMIUGAACkDwAQhgYAAKMPADCHBgEA1woAIY8GQADbCgAhkAZAANsKACGzBgEA2AoAIb0GAQDYCgAhvwYAALwM3gYiwAYBANgKACHBBkAAgwwAIcIGQADbCgAhwwYBANcKACHEBgEA2AoAId4GAQDXCgAhD4QGAACjDwAwhQYAAKQPABCGBgAAow8AMIcGAQDXCgAhjwZAANsKACGQBkAA2woAIbMGAQDYCgAhvQYBANgKACG_BgAAvAzeBiLABgEA2AoAIcEGQACDDAAhwgZAANsKACHDBgEA1woAIcQGAQDYCgAh3gYBANcKACELhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhvQYBAOMMACG_BgAApg_eBiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAIcQGAQDjDAAh3gYBAOIMACEB8QcAAADeBgIOFgAAqA8AIBcAAKkPACAYAACqDwAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhvQYBAOMMACG_BgAApg_eBiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAIcQGAQDjDAAh3gYBAOIMACEFaAAAlBwAIGkAAJ0cACDuBwAAlRwAIO8HAACcHAAg9AcAAKAHACAFaAAAkhwAIGkAAJocACDuBwAAkxwAIO8HAACZHAAg9AcAAIADACAHaAAAkBwAIGkAAJccACDuBwAAkRwAIO8HAACWHAAg8gcAAFEAIPMHAABRACD0BwAAgAMAIA4WAACsDwAgFwAArQ8AIBgAAK4PACCHBgEAAAABjwZAAAAAAZAGQAAAAAG9BgEAAAABvwYAAADeBgLABgEAAAABwQZAAAAAAcIGQAAAAAHDBgEAAAABxAYBAAAAAd4GAQAAAAEDaAAAlBwAIO4HAACVHAAg9AcAAKAHACADaAAAkhwAIO4HAACTHAAg9AcAAIADACADaAAAkBwAIO4HAACRHAAg9AcAAIADACANBwAA0w0AIAkAANQNACASAADTDgAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGyBgEAAAABtAYBAAAAAbUGAQAAAAG2BgEAAAABtwZAAAAAAQIAAABGACBoAAC3DwAgAwAAAEYAIGgAALcPACBpAAC2DwAgAWEAAI8cADACAAAARgAgYQAAtg8AIAIAAADLDQAgYQAAtQ8AIAqHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhsgYBAOIMACG0BgEA4wwAIbUGAQDjDAAhtgYBAOMMACG3BkAA5AwAIQ0HAADPDQAgCQAA0A0AIBIAANIOACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhsgYBAOIMACG0BgEA4wwAIbUGAQDjDAAhtgYBAOMMACG3BkAA5AwAIQ0HAADTDQAgCQAA1A0AIBIAANMOACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbIGAQAAAAG0BgEAAAABtQYBAAAAAbYGAQAAAAG3BkAAAAABFQcAALUOACAJAACyDgAgCgAAsw4AIAsAAKwOACAOAACxDgAgDwAArw4AIBAAAMIPACAbAAC0DgAgLAAArQ4AIC0AAK4OACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAegGAQAAAAH4BgEAAAABvwdAAAAAAQIAAAAoACBoAADBDwAgAwAAACgAIGgAAMEPACBpAAC_DwAgAWEAAI4cADACAAAAKAAgYQAAvw8AIAIAAAD2DQAgYQAAvg8AIAuHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACGwBgEA4gwAIbEGAQDiDAAh6AYBAOIMACH4BgEA4wwAIb8HQADkDAAhFQcAAIIOACAJAAD_DQAgCgAAgA4AIAsAAPkNACAOAAD-DQAgDwAA_A0AIBAAAMAPACAbAACBDgAgLAAA-g0AIC0AAPsNACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACGwBgEA4gwAIbEGAQDiDAAh6AYBAOIMACH4BgEA4wwAIb8HQADkDAAhBWgAAIkcACBpAACMHAAg7gcAAIocACDvBwAAixwAIPQHAAAQACAVBwAAtQ4AIAkAALIOACAKAACzDgAgCwAArA4AIA4AALEOACAPAACvDgAgEAAAwg8AIBsAALQOACAsAACtDgAgLQAArg4AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAAB6AYBAAAAAfgGAQAAAAG_B0AAAAABA2gAAIkcACDuBwAAihwAIPQHAAAQACADaAAAhxwAIO4HAACIHAAg9AcAAIMFACADaAAAhRwAIO4HAACGHAAg9AcAABoAIANoAACDHAAg7gcAAIQcACD0BwAAgAMAIARoAAC4DwAw7gcAALkPADDwBwAAuw8AIPQHAADyDQAwBGgAAK8PADDuBwAAsA8AMPAHAACyDwAg9AcAAMcNADAEaAAAnA8AMO4HAACdDwAw8AcAAJ8PACD0BwAAoA8AMARoAACGDwAw7gcAAIcPADDwBwAAiQ8AIPQHAACKDwAwBGgAAPsOADDuBwAA_A4AMPAHAAD-DgAg9AcAAPIMADAAAAAHaAAA_hsAIGkAAIEcACDuBwAA_xsAIO8HAACAHAAg8gcAAFMAIPMHAABTACD0BwAAnQEAIANoAAD-GwAg7gcAAP8bACD0BwAAnQEAIAAAAALxBwEAAAAE-wcBAAAABQVoAAD5GwAgaQAA_BsAIO4HAAD6GwAg7wcAAPsbACD0BwAAgAMAIAHxBwEAAAAEA2gAAPkbACDuBwAA-hsAIPQHAACAAwAgAAAAC2gAAMIQADBpAADHEAAw7gcAAMMQADDvBwAAxBAAMPAHAADFEAAg8QcAAMYQADDyBwAAxhAAMPMHAADGEAAw9AcAAMYQADD1BwAAyBAAMPYHAADJEAAwC2gAAI4QADBpAACTEAAw7gcAAI8QADDvBwAAkBAAMPAHAACREAAg8QcAAJIQADDyBwAAkhAAMPMHAACSEAAw9AcAAJIQADD1BwAAlBAAMPYHAACVEAAwC2gAAIUQADBpAACJEAAw7gcAAIYQADDvBwAAhxAAMPAHAACIEAAg8QcAAPINADDyBwAA8g0AMPMHAADyDQAw9AcAAPINADD1BwAAihAAMPYHAAD1DQAwC2gAAOoPADBpAADvDwAw7gcAAOsPADDvBwAA7A8AMPAHAADtDwAg8QcAAO4PADDyBwAA7g8AMPMHAADuDwAw9AcAAO4PADD1BwAA8A8AMPYHAADxDwAwC2gAAN8PADBpAADjDwAw7gcAAOAPADDvBwAA4Q8AMPAHAADiDwAg8QcAAIoPADDyBwAAig8AMPMHAACKDwAw9AcAAIoPADD1BwAA5A8AMPYHAACNDwAwGgcAAJgPACAJAACZDwAgGQAA6Q8AIB0AAJsPACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbMGAQAAAAG_BgAAAJAHAtcGEAAAAAHYBgEAAAAB2QYCAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABjAcBAAAAAY4HAAAAjgcCkAcBAAAAAZEHQAAAAAECAAAAVwAgaAAA6A8AIAMAAABXACBoAADoDwAgaQAA5g8AIAFhAAD4GwAwAgAAAFcAIGEAAOYPACACAAAAjg8AIGEAAOUPACAWhwYBAOIMACGMBgEA4gwAIY0GAQDiDAAhjwZAAOQMACGQBkAA5AwAIbMGAQDiDAAhvwYAAJEPkAci1wYQAOoOACHYBgEA4gwAIdkGAgDrDgAh_AYBAOIMACH9BgEA4wwAIf4GAQDjDAAh_wYBAOMMACGABwEA4wwAIYEHAQDjDAAhggeAAAAAAYMHQAD6DAAhjAcBAOIMACGOBwAAkA-OByKQBwEA4gwAIZEHQADkDAAhGgcAAJMPACAJAACUDwAgGQAA5w8AIB0AAJYPACCHBgEA4gwAIYwGAQDiDAAhjQYBAOIMACGPBkAA5AwAIZAGQADkDAAhswYBAOIMACG_BgAAkQ-QByLXBhAA6g4AIdgGAQDiDAAh2QYCAOsOACH8BgEA4gwAIf0GAQDjDAAh_gYBAOMMACH_BgEA4wwAIYAHAQDjDAAhgQcBAOMMACGCB4AAAAABgwdAAPoMACGMBwEA4gwAIY4HAACQD44HIpAHAQDiDAAhkQdAAOQMACEFaAAA8xsAIGkAAPYbACDuBwAA9BsAIO8HAAD1GwAg9AcAAJ0BACAaBwAAmA8AIAkAAJkPACAZAADpDwAgHQAAmw8AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb8GAAAAkAcC1wYQAAAAAdgGAQAAAAHZBgIAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHAQAAAAGBBwEAAAABggeAAAAAAYMHQAAAAAGMBwEAAAABjgcAAACOBwKQBwEAAAABkQdAAAAAAQNoAADzGwAg7gcAAPQbACD0BwAAnQEAIAwHAACCEAAgCQAAgxAAIBwAAIQQACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAdgGAQAAAAGKByAAAAABkgcQAAAAAZMHEAAAAAECAAAAdgAgaAAAgRAAIAMAAAB2ACBoAACBEAAgaQAA9A8AIAFhAADyGwAwEgcAAKALACAJAACvDAAgGwAAsAwAIBwAAIgLACCEBgAArgwAMIUGAAB0ABCGBgAArgwAMIcGAQAAAAGMBgEA1woAIY0GAQDXCgAhjwZAANsKACGQBkAA2woAIdgGAQDXCgAh6AYBANcKACGKByAA2goAIZIHEACPDAAhkwcQAI8MACHoBwAArQwAIAIAAAB2ACBhAAD0DwAgAgAAAPIPACBhAADzDwAgDYQGAADxDwAwhQYAAPIPABCGBgAA8Q8AMIcGAQDXCgAhjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACHYBgEA1woAIegGAQDXCgAhigcgANoKACGSBxAAjwwAIZMHEACPDAAhDYQGAADxDwAwhQYAAPIPABCGBgAA8Q8AMIcGAQDXCgAhjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACHYBgEA1woAIegGAQDXCgAhigcgANoKACGSBxAAjwwAIZMHEACPDAAhCYcGAQDiDAAhjAYBAOIMACGNBgEA4gwAIY8GQADkDAAhkAZAAOQMACHYBgEA4gwAIYoHIADEDgAhkgcQAOoOACGTBxAA6g4AIQwHAAD1DwAgCQAA9g8AIBwAAPcPACCHBgEA4gwAIYwGAQDiDAAhjQYBAOIMACGPBkAA5AwAIZAGQADkDAAh2AYBAOIMACGKByAAxA4AIZIHEADqDgAhkwcQAOoOACEFaAAA6RsAIGkAAPAbACDuBwAA6hsAIO8HAADvGwAg9AcAAIMFACAFaAAA5xsAIGkAAO0bACDuBwAA6BsAIO8HAADsGwAg9AcAABoAIAtoAAD4DwAwaQAA_A8AMO4HAAD5DwAw7wcAAPoPADDwBwAA-w8AIPEHAACKDwAw8gcAAIoPADDzBwAAig8AMPQHAACKDwAw9QcAAP0PADD2BwAAjQ8AMBoHAACYDwAgCQAAmQ8AIBkAAOkPACAbAACaDwAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGzBgEAAAABvwYAAACQBwLXBhAAAAAB2AYBAAAAAdkGAgAAAAHoBgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHAQAAAAGBBwEAAAABggeAAAAAAYMHQAAAAAGOBwAAAI4HApAHAQAAAAGRB0AAAAABAgAAAFcAIGgAAIAQACADAAAAVwAgaAAAgBAAIGkAAP8PACABYQAA6xsAMAIAAABXACBhAAD_DwAgAgAAAI4PACBhAAD-DwAgFocGAQDiDAAhjAYBAOIMACGNBgEA4gwAIY8GQADkDAAhkAZAAOQMACGzBgEA4gwAIb8GAACRD5AHItcGEADqDgAh2AYBAOIMACHZBgIA6w4AIegGAQDiDAAh_AYBAOIMACH9BgEA4wwAIf4GAQDjDAAh_wYBAOMMACGABwEA4wwAIYEHAQDjDAAhggeAAAAAAYMHQAD6DAAhjgcAAJAPjgcikAcBAOIMACGRB0AA5AwAIRoHAACTDwAgCQAAlA8AIBkAAOcPACAbAACVDwAghwYBAOIMACGMBgEA4gwAIY0GAQDiDAAhjwZAAOQMACGQBkAA5AwAIbMGAQDiDAAhvwYAAJEPkAci1wYQAOoOACHYBgEA4gwAIdkGAgDrDgAh6AYBAOIMACH8BgEA4gwAIf0GAQDjDAAh_gYBAOMMACH_BgEA4wwAIYAHAQDjDAAhgQcBAOMMACGCB4AAAAABgwdAAPoMACGOBwAAkA-OByKQBwEA4gwAIZEHQADkDAAhGgcAAJgPACAJAACZDwAgGQAA6Q8AIBsAAJoPACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbMGAQAAAAG_BgAAAJAHAtcGEAAAAAHYBgEAAAAB2QYCAAAAAegGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAcBAAAAAYEHAQAAAAGCB4AAAAABgwdAAAAAAY4HAAAAjgcCkAcBAAAAAZEHQAAAAAEMBwAAghAAIAkAAIMQACAcAACEEAAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHYBgEAAAABigcgAAAAAZIHEAAAAAGTBxAAAAABA2gAAOkbACDuBwAA6hsAIPQHAACDBQAgA2gAAOcbACDuBwAA6BsAIPQHAAAaACAEaAAA-A8AMO4HAAD5DwAw8AcAAPsPACD0BwAAig8AMBUHAAC1DgAgCQAAsg4AIAoAALMOACALAACsDgAgDgAAsQ4AIA8AAK8OACAQAADCDwAgGQAAsA4AICwAAK0OACAtAACuDgAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGzBgEAAAAB-AYBAAAAAb8HQAAAAAECAAAAKAAgaAAAjRAAIAMAAAAoACBoAACNEAAgaQAAjBAAIAFhAADmGwAwAgAAACgAIGEAAIwQACACAAAA9g0AIGEAAIsQACALhwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsAYBAOIMACGxBgEA4gwAIbMGAQDiDAAh-AYBAOMMACG_B0AA5AwAIRUHAACCDgAgCQAA_w0AIAoAAIAOACALAAD5DQAgDgAA_g0AIA8AAPwNACAQAADADwAgGQAA_Q0AICwAAPoNACAtAAD7DQAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsAYBAOIMACGxBgEA4gwAIbMGAQDiDAAh-AYBAOMMACG_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-AYBAOMMACG_B0AA5AwAIRUHAACCDgAgCQAA_w0AIAoAAIAOACALAAD5DQAgDwAA_A0AIBAAAMAPACAZAAD9DQAgGwAAgQ4AICwAAPoNACAtAAD7DQAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIbAGAQDiDAAhsQYBAOIMACGzBgEA4gwAIegGAQDiDAAh-AYBAOMMACG_B0AA5AwAIRUHAAC1DgAgCQAAsg4AIAoAALMOACALAACsDgAgDwAArw4AIBAAAMIPACAZAACwDgAgGwAAtA4AICwAAK0OACAtAACuDgAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGwBgEAAAABsQYBAAAAAbMGAQAAAAHoBgEAAAAB-AYBAAAAAb8HQAAAAAEPBwAAvxAAIAkAAMAQACANAAC8EAAgEQAAvRAAICQAAL4QACAmAADBEAAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAAB5gYBAAAAAecGAgAAAAHpBgEAAAABBGgAALIQADDuBwAAsxAAMPAHAAC1EAAg9AcAAPINADAEaAAAqRAAMO4HAACqEAAw8AcAAKwQACD0BwAA3g0AMARoAACgEAAw7gcAAKEQADDwBwAAoxAAIPQHAAC3DQAwA2gAANcbACDuBwAA2BsAIPQHAACDBQAgA2gAANUbACDuBwAA1hsAIPQHAAAaACADaAAA0xsAIO4HAADUGwAg9AcAAJcBACANBwAA3hAAIAkAAN8QACALAADdEAAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAO0GAuAGAQAAAAHmBgEAAAAB6gYBAAAAAesGAQAAAAECAAAAMwAgaAAA3BAAIAMAAAAzACBoAADcEAAgaQAAzRAAIAFhAADSGwAwEgcAAJsMACAJAACiDAAgCwAA3QsAIBsAAMsMACCEBgAAyQwAMIUGAAAxABCGBgAAyQwAMIcGAQAAAAGMBgEA2AoAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIb8GAADKDO0GIuAGAQDXCgAh5gYBANgKACHoBgEA2AoAIeoGAQDXCgAh6wYBANcKACECAAAAMwAgYQAAzRAAIAIAAADKEAAgYQAAyxAAIA6EBgAAyRAAMIUGAADKEAAQhgYAAMkQADCHBgEA1woAIYwGAQDYCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhvwYAAMoM7QYi4AYBANcKACHmBgEA2AoAIegGAQDYCgAh6gYBANcKACHrBgEA1woAIQ6EBgAAyRAAMIUGAADKEAAQhgYAAMkQADCHBgEA1woAIYwGAQDYCgAhjQYBANgKACGPBkAA2woAIZAGQADbCgAhvwYAAMoM7QYi4AYBANcKACHmBgEA2AoAIegGAQDYCgAh6gYBANcKACHrBgEA1woAIQqHBgEA4gwAIYwGAQDjDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhvwYAAMwQ7QYi4AYBAOIMACHmBgEA4wwAIeoGAQDiDAAh6wYBAOIMACEB8QcAAADtBgINBwAAzxAAIAkAANAQACALAADOEAAghwYBAOIMACGMBgEA4wwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIb8GAADMEO0GIuAGAQDiDAAh5gYBAOMMACHqBgEA4gwAIesGAQDiDAAhC2gAANEQADBpAADVEAAw7gcAANIQADDvBwAA0xAAMPAHAADUEAAg8QcAAJsOADDyBwAAmw4AMPMHAACbDgAw9AcAAJsOADD1BwAA1hAAMPYHAACeDgAwB2gAAMQbACBpAADQGwAg7gcAAMUbACDvBwAAzxsAIPIHAAAWACDzBwAAFgAg9AcAAIMFACAHaAAAwhsAIGkAAM0bACDuBwAAwxsAIO8HAADMGwAg8gcAABgAIPMHAAAYACD0BwAAGgAgDgcAAKkOACAJAACqDgAgKQAA2xAAICsAAKgOACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAcUGAQAAAAHgBgEAAAAB5gYBAAAAAe0GAQAAAAHvBgEAAAABAgAAACwAIGgAANoQACADAAAALAAgaAAA2hAAIGkAANgQACABYQAAyxsAMAIAAAAsACBhAADYEAAgAgAAAJ8OACBhAADXEAAgCocGAQDiDAAhjAYBAOMMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACHFBgEA4gwAIeAGAQDiDAAh5gYBAOMMACHtBgEA4wwAIe8GAQDiDAAhDgcAAKQOACAJAAClDgAgKQAA2RAAICsAAKMOACCHBgEA4gwAIYwGAQDjDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhxQYBAOIMACHgBgEA4gwAIeYGAQDjDAAh7QYBAOMMACHvBgEA4gwAIQVoAADGGwAgaQAAyRsAIO4HAADHGwAg7wcAAMgbACD0BwAAKAAgDgcAAKkOACAJAACqDgAgKQAA2xAAICsAAKgOACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAcUGAQAAAAHgBgEAAAAB5gYBAAAAAe0GAQAAAAHvBgEAAAABA2gAAMYbACDuBwAAxxsAIPQHAAAoACANBwAA3hAAIAkAAN8QACALAADdEAAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAO0GAuAGAQAAAAHmBgEAAAAB6gYBAAAAAesGAQAAAAEEaAAA0RAAMO4HAADSEAAw8AcAANQQACD0BwAAmw4AMANoAADEGwAg7gcAAMUbACD0BwAAgwUAIANoAADCGwAg7gcAAMMbACD0BwAAGgAgBGgAAMIQADDuBwAAwxAAMPAHAADFEAAg9AcAAMYQADAEaAAAjhAAMO4HAACPEAAw8AcAAJEQACD0BwAAkhAAMARoAACFEAAw7gcAAIYQADDwBwAAiBAAIPQHAADyDQAwBGgAAOoPADDuBwAA6w8AMPAHAADtDwAg9AcAAO4PADAEaAAA3w8AMO4HAADgDwAw8AcAAOIPACD0BwAAig8AMAAAAAAAAAAAAAAFaAAAvRsAIGkAAMAbACDuBwAAvhsAIO8HAAC_GwAg9AcAAJ8IACADaAAAvRsAIO4HAAC-GwAg9AcAAJ8IACAAAAAHaAAAuBsAIGkAALsbACDuBwAAuRsAIO8HAAC6GwAg8gcAAC8AIPMHAAAvACD0BwAAnwgAIANoAAC4GwAg7gcAALkbACD0BwAAnwgAIAAAAAAAAAAAC2gAAIsRADBpAACQEQAw7gcAAIwRADDvBwAAjREAMPAHAACOEQAg8QcAAI8RADDyBwAAjxEAMPMHAACPEQAw9AcAAI8RADD1BwAAkREAMPYHAACSEQAwC2gAAIIRADBpAACGEQAw7gcAAIMRADDvBwAAhBEAMPAHAACFEQAg8QcAAPINADDyBwAA8g0AMPMHAADyDQAw9AcAAPINADD1BwAAhxEAMPYHAAD1DQAwBWgAAKIbACBpAAC2GwAg7gcAAKMbACDvBwAAtRsAIPQHAACDBQAgBWgAAKAbACBpAACzGwAg7gcAAKEbACDvBwAAshsAIPQHAAAaACAVBwAAtQ4AIAkAALIOACALAACsDgAgDgAAsQ4AIA8AAK8OACAQAADCDwAgGQAAsA4AIBsAALQOACAsAACtDgAgLQAArg4AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABswYBAAAAAegGAQAAAAG_B0AAAAABAgAAACgAIGgAAIoRACADAAAAKAAgaAAAihEAIGkAAIkRACABYQAAsRsAMAIAAAAoACBhAACJEQAgAgAAAPYNACBhAACIEQAgC4cGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGvBgEA4gwAIbAGAQDiDAAhsQYBAOIMACGzBgEA4gwAIegGAQDiDAAhvwdAAOQMACEVBwAAgg4AIAkAAP8NACALAAD5DQAgDgAA_g0AIA8AAPwNACAQAADADwAgGQAA_Q0AIBsAAIEOACAsAAD6DQAgLQAA-w0AIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGvBgEA4gwAIbAGAQDiDAAhsQYBAOIMACGzBgEA4gwAIegGAQDiDAAhvwdAAOQMACEVBwAAtQ4AIAkAALIOACALAACsDgAgDgAAsQ4AIA8AAK8OACAQAADCDwAgGQAAsA4AIBsAALQOACAsAACtDgAgLQAArg4AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABswYBAAAAAegGAQAAAAG_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-AYBAOMMACG_B0AA5AwAIRUHAACCDgAgCQAA_w0AIAoAAIAOACALAAD5DQAgDgAA_g0AIBAAAMAPACAZAAD9DQAgGwAAgQ4AICwAAPoNACAtAAD7DQAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsQYBAOIMACGzBgEA4gwAIegGAQDiDAAh-AYBAOMMACG_B0AA5AwAIRUHAAC1DgAgCQAAsg4AIAoAALMOACALAACsDgAgDgAAsQ4AIBAAAMIPACAZAACwDgAgGwAAtA4AICwAAK0OACAtAACuDgAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGvBgEAAAABsQYBAAAAAbMGAQAAAAHoBgEAAAAB-AYBAAAAAb8HQAAAAAENBwAArREAIAkAAK4RACANAACvEQAgEQAAsBEAIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAAB5gYBAAAAAfIGAgAAAAHABwEAAAABwQcBAAAAAQNoAACmGwAg7gcAAKcbACD0BwAAgwUAIANoAACkGwAg7gcAAKUbACD0BwAAGgAgBGgAAKMRADDuBwAApBEAMPAHAACmEQAg9AcAAPINADAEaAAAmhEAMO4HAACbEQAw8AcAAJ0RACD0BwAA3g0AMARoAACLEQAw7gcAAIwRADDwBwAAjhEAIPQHAACPEQAwBGgAAIIRADDuBwAAgxEAMPAHAACFEQAg9AcAAPINADADaAAAohsAIO4HAACjGwAg9AcAAIMFACADaAAAoBsAIO4HAAChGwAg9AcAABoAIAAAAALxBwEAAAAE-wcBAAAABQtoAAC6EQAwaQAAvhEAMO4HAAC7EQAw7wcAALwRADDwBwAAvREAIPEHAACgDwAw8gcAAKAPADDzBwAAoA8AMPQHAACgDwAw9QcAAL8RADD2BwAAow8AMA4XAACtDwAgGAAArg8AIBkAAM8PACCHBgEAAAABjwZAAAAAAZAGQAAAAAGzBgEAAAABvQYBAAAAAb8GAAAA3gYCwAYBAAAAAcEGQAAAAAHCBkAAAAABxAYBAAAAAd4GAQAAAAECAAAATQAgaAAAwhEAIAMAAABNACBoAADCEQAgaQAAwREAIAFhAACfGwAwAgAAAE0AIGEAAMERACACAAAApA8AIGEAAMARACALhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhswYBAOMMACG9BgEA4wwAIb8GAACmD94GIsAGAQDjDAAhwQZAAPoMACHCBkAA5AwAIcQGAQDjDAAh3gYBAOIMACEOFwAAqQ8AIBgAAKoPACAZAADODwAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhswYBAOMMACG9BgEA4wwAIb8GAACmD94GIsAGAQDjDAAhwQZAAPoMACHCBkAA5AwAIcQGAQDjDAAh3gYBAOIMACEOFwAArQ8AIBgAAK4PACAZAADPDwAghwYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb0GAQAAAAG_BgAAAN4GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcQGAQAAAAHeBgEAAAABAfEHAQAAAAQEaAAAuhEAMO4HAAC7EQAw8AcAAL0RACD0BwAAoA8AMAAAAAAC8QcBAAAABPsHAQAAAAULaAAAyxEAMGkAAM8RADDuBwAAzBEAMO8HAADNEQAw8AcAAM4RACDxBwAAoA0AMPIHAACgDQAw8wcAAKANADD0BwAAoA0AMPUHAADQEQAw9gcAAKMNADASBwAAsQ0AIAkAALINACAQAADdDgAgGAAAsA0AIDMAAK8NACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAZwGAQAAAAGxBgEAAAABvQYBAAAAAb8GAAAAvwYCwAYBAAAAAcEGQAAAAAHCBkAAAAABxAYBAAAAAQIAAACjAQAgaAAA0xEAIAMAAACjAQAgaAAA0xEAIGkAANIRACABYQAAnhsAMAIAAACjAQAgYQAA0hEAIAIAAACkDQAgYQAA0REAIA2HBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhnAYBAOIMACGxBgEA4wwAIb0GAQDjDAAhvwYAAKYNvwYiwAYBAOMMACHBBkAA-gwAIcIGQADkDAAhxAYBAOMMACESBwAAqw0AIAkAAKwNACAQAADcDgAgGAAAqg0AIDMAAKkNACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhnAYBAOIMACGxBgEA4wwAIb0GAQDjDAAhvwYAAKYNvwYiwAYBAOMMACHBBkAA-gwAIcIGQADkDAAhxAYBAOMMACESBwAAsQ0AIAkAALINACAQAADdDgAgGAAAsA0AIDMAAK8NACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAZwGAQAAAAGxBgEAAAABvQYBAAAAAb8GAAAAvwYCwAYBAAAAAcEGQAAAAAHCBkAAAAABxAYBAAAAAQHxBwEAAAAEBGgAAMsRADDuBwAAzBEAMPAHAADOEQAg9AcAAKANADAAAAAAAAAB8QcAAAD8BgIFaAAAmRsAIGkAAJwbACDuBwAAmhsAIO8HAACbGwAg9AcAAIMFACADaAAAmRsAIO4HAACaGwAg9AcAAIMFACAAAAAFaAAAlBsAIGkAAJcbACDuBwAAlRsAIO8HAACWGwAg9AcAAIMFACADaAAAlBsAIO4HAACVGwAg9AcAAIMFACAfBgAAkhcAIAwAAOUQACANAADnEAAgEQAAlRcAIBwAAOkQACAlAADmEAAgJwAA6BAAICoAAJ0XACAuAACOFwAgLwAAjxcAIDAAAJEXACAxAACTFwAgMgAAlBcAIDQAANYRACA1AACXFwAgNgAAmBcAIDcAAJkXACA7AACNFwAgPAAAkBcAIEAAAJwXACBBAACWFwAgQgAAmhcAIEMAAJsXACBIAACeFwAgSQAAnxcAIEoAAKAXACBLAACgFwAguwYAAN4MACDmBgAA3gwAIKsHAADeDAAgrgcAAN4MACAAAAAAAAAAAAAABWgAAI8bACBpAACSGwAg7gcAAJAbACDvBwAAkRsAIPQHAACfCAAgA2gAAI8bACDuBwAAkBsAIPQHAACfCAAgAAAABWgAAIcbACBpAACNGwAg7gcAAIgbACDvBwAAjBsAIPQHAADyAQAgBWgAAIUbACBpAACKGwAg7gcAAIYbACDvBwAAiRsAIPQHAACAAwAgA2gAAIcbACDuBwAAiBsAIPQHAADyAQAgA2gAAIUbACDuBwAAhhsAIPQHAACAAwAgAAAAAfEHAAAAlwcCBWgAAIAbACBpAACDGwAg7gcAAIEbACDvBwAAghsAIPQHAADyAQAgA2gAAIAbACDuBwAAgRsAIPQHAADyAQAgAAAABWgAAPYaACBpAAD-GgAg7gcAAPcaACDvBwAA_RoAIPQHAACDBQAgBWgAAPQaACBpAAD7GgAg7gcAAPUaACDvBwAA-hoAIPQHAACAAwAgC2gAAJESADBpAACWEgAw7gcAAJISADDvBwAAkxIAMPAHAACUEgAg8QcAAJUSADDyBwAAlRIAMPMHAACVEgAw9AcAAJUSADD1BwAAlxIAMPYHAACYEgAwC2gAAIUSADBpAACKEgAw7gcAAIYSADDvBwAAhxIAMPAHAACIEgAg8QcAAIkSADDyBwAAiRIAMPMHAACJEgAw9AcAAIkSADD1BwAAixIAMPYHAACMEgAwBAMAAPcRACCHBgEAAAABjgYBAAAAAZUHQAAAAAECAAAA-gEAIGgAAJASACADAAAA-gEAIGgAAJASACBpAACPEgAgAWEAAPkaADAKAwAA3AoAIEUAAIcMACCEBgAAhgwAMIUGAAD4AQAQhgYAAIYMADCHBgEAAAABjgYBANcKACGUBwEA1woAIZUHQADbCgAh5AcAAIUMACACAAAA-gEAIGEAAI8SACACAAAAjRIAIGEAAI4SACAHhAYAAIwSADCFBgAAjRIAEIYGAACMEgAwhwYBANcKACGOBgEA1woAIZQHAQDXCgAhlQdAANsKACEHhAYAAIwSADCFBgAAjRIAEIYGAACMEgAwhwYBANcKACGOBgEA1woAIZQHAQDXCgAhlQdAANsKACEDhwYBAOIMACGOBgEA4gwAIZUHQADkDAAhBAMAAPURACCHBgEA4gwAIY4GAQDiDAAhlQdAAOQMACEEAwAA9xEAIIcGAQAAAAGOBgEAAAABlQdAAAAAAQOHBgEAAAABjwZAAAAAAZcHAAAAlwcCAgAAAPYBACBoAACcEgAgAwAAAPYBACBoAACcEgAgaQAAmxIAIAFhAAD4GgAwCUUAAIcMACCEBgAAiQwAMIUGAAD0AQAQhgYAAIkMADCHBgEAAAABjwZAANsKACGUBwEA1woAIZcHAACKDJcHIuUHAACIDAAgAgAAAPYBACBhAACbEgAgAgAAAJkSACBhAACaEgAgB4QGAACYEgAwhQYAAJkSABCGBgAAmBIAMIcGAQDXCgAhjwZAANsKACGUBwEA1woAIZcHAACKDJcHIgeEBgAAmBIAMIUGAACZEgAQhgYAAJgSADCHBgEA1woAIY8GQADbCgAhlAcBANcKACGXBwAAigyXByIDhwYBAOIMACGPBkAA5AwAIZcHAAD7EZcHIgOHBgEA4gwAIY8GQADkDAAhlwcAAPsRlwciA4cGAQAAAAGPBkAAAAABlwcAAACXBwIDaAAA9hoAIO4HAAD3GgAg9AcAAIMFACADaAAA9BoAIO4HAAD1GgAg9AcAAIADACAEaAAAkRIAMO4HAACSEgAw8AcAAJQSACD0BwAAlRIAMARoAACFEgAw7gcAAIYSADDwBwAAiBIAIPQHAACJEgAwAAAAAAAAAfEHAAAApQcCAfEHAAAApwcCBWgAAOkaACBpAADyGgAg7gcAAOoaACDvBwAA8RoAIPQHAACAAwAgBWgAAOcaACBpAADvGgAg7gcAAOgaACDvBwAA7hoAIPQHAACDBQAgB2gAAOUaACBpAADsGgAg7gcAAOYaACDvBwAA6xoAIPIHAABRACDzBwAAUQAg9AcAAIADACADaAAA6RoAIO4HAADqGgAg9AcAAIADACADaAAA5xoAIO4HAADoGgAg9AcAAIMFACADaAAA5RoAIO4HAADmGgAg9AcAAIADACAAAAAAAAHxBwAAAK0HAwHxBwAAANUGAwXxBxAAAAAB9wcQAAAAAfgHEAAAAAH5BxAAAAAB-gcQAAAAAQHxBwAAAL0HAgVoAADZGgAgaQAA4xoAIO4HAADaGgAg7wcAAOIaACD0BwAAgAMAIAdoAADXGgAgaQAA4BoAIO4HAADYGgAg7wcAAN8aACDyBwAAUQAg8wcAAFEAIPQHAACAAwAgB2gAANUaACBpAADdGgAg7gcAANYaACDvBwAA3BoAIPIHAAAWACDzBwAAFgAg9AcAAIMFACALaAAAvBIAMGkAAMESADDuBwAAvRIAMO8HAAC-EgAw8AcAAL8SACDxBwAAwBIAMPIHAADAEgAw8wcAAMASADD0BwAAwBIAMPUHAADCEgAw9gcAAMMSADAMBwAA7g4AIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAANcGAtUGAAAA1QYC1wYQAAAAAdgGAQAAAAHZBgIAAAAB2gZAAAAAAdsGQAAAAAECAAAA3QEAIGgAAMcSACADAAAA3QEAIGgAAMcSACBpAADGEgAgAWEAANsaADARBwAAoAsAID8AAJUMACCEBgAAkwwAMIUGAADbAQAQhgYAAJMMADCHBgEAAAABjAYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAJQM1wYi0wYBANgKACHVBgAAjgzVBiLXBhAAjwwAIdgGAQDXCgAh2QYCAJAMACHaBkAA2woAIdsGQADbCgAhAgAAAN0BACBhAADGEgAgAgAAAMQSACBhAADFEgAgD4QGAADDEgAwhQYAAMQSABCGBgAAwxIAMIcGAQDXCgAhjAYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAJQM1wYi0wYBANgKACHVBgAAjgzVBiLXBhAAjwwAIdgGAQDXCgAh2QYCAJAMACHaBkAA2woAIdsGQADbCgAhD4QGAADDEgAwhQYAAMQSABCGBgAAwxIAMIcGAQDXCgAhjAYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAJQM1wYi0wYBANgKACHVBgAAjgzVBiLXBhAAjwwAIdgGAQDXCgAh2QYCAJAMACHaBkAA2woAIdsGQADbCgAhC4cGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAAOkO1wYi1QYAAOgO1QYi1wYQAOoOACHYBgEA4gwAIdkGAgDrDgAh2gZAAOQMACHbBkAA5AwAIQwHAADsDgAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAA6Q7XBiLVBgAA6A7VBiLXBhAA6g4AIdgGAQDiDAAh2QYCAOsOACHaBkAA5AwAIdsGQADkDAAhDAcAAO4OACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAADXBgLVBgAAANUGAtcGEAAAAAHYBgEAAAAB2QYCAAAAAdoGQAAAAAHbBkAAAAABA2gAANkaACDuBwAA2hoAIPQHAACAAwAgA2gAANcaACDuBwAA2BoAIPQHAACAAwAgA2gAANUaACDuBwAA1hoAIPQHAACDBQAgBGgAALwSADDuBwAAvRIAMPAHAAC_EgAg9AcAAMASADAAAAALaAAAjhUAMGkAAJMVADDuBwAAjxUAMO8HAACQFQAw8AcAAJEVACDxBwAAkhUAMPIHAACSFQAw8wcAAJIVADD0BwAAkhUAMPUHAACUFQAw9gcAAJUVADALaAAAghUAMGkAAIcVADDuBwAAgxUAMO8HAACEFQAw8AcAAIUVACDxBwAAhhUAMPIHAACGFQAw8wcAAIYVADD0BwAAhhUAMPUHAACIFQAw9gcAAIkVADALaAAA6RQAMGkAAO4UADDuBwAA6hQAMO8HAADrFAAw8AcAAOwUACDxBwAA7RQAMPIHAADtFAAw8wcAAO0UADD0BwAA7RQAMPUHAADvFAAw9gcAAPAUADALaAAA0RQAMGkAANYUADDuBwAA0hQAMO8HAADTFAAw8AcAANQUACDxBwAA1RQAMPIHAADVFAAw8wcAANUUADD0BwAA1RQAMPUHAADXFAAw9gcAANgUADALaAAAyBQAMGkAAMwUADDuBwAAyRQAMO8HAADKFAAw8AcAAMsUACDxBwAAkhAAMPIHAACSEAAw8wcAAJIQADD0BwAAkhAAMPUHAADNFAAw9gcAAJUQADALaAAAvRQAMGkAAMEUADDuBwAAvhQAMO8HAAC_FAAw8AcAAMAUACDxBwAAjxEAMPIHAACPEQAw8wcAAI8RADD0BwAAjxEAMPUHAADCFAAw9gcAAJIRADALaAAArBQAMGkAALEUADDuBwAArRQAMO8HAACuFAAw8AcAAK8UACDxBwAAsBQAMPIHAACwFAAw8wcAALAUADD0BwAAsBQAMPUHAACyFAAw9gcAALMUADALaAAAoBQAMGkAAKUUADDuBwAAoRQAMO8HAACiFAAw8AcAAKMUACDxBwAApBQAMPIHAACkFAAw8wcAAKQUADD0BwAApBQAMPUHAACmFAAw9gcAAKcUADALaAAAlBQAMGkAAJkUADDuBwAAlRQAMO8HAACWFAAw8AcAAJcUACDxBwAAmBQAMPIHAACYFAAw8wcAAJgUADD0BwAAmBQAMPUHAACaFAAw9gcAAJsUADALaAAAixQAMGkAAI8UADDuBwAAjBQAMO8HAACNFAAw8AcAAI4UACDxBwAA8g0AMPIHAADyDQAw8wcAAPINADD0BwAA8g0AMPUHAACQFAAw9gcAAPUNADALaAAAghQAMGkAAIYUADDuBwAAgxQAMO8HAACEFAAw8AcAAIUUACDxBwAA3g0AMPIHAADeDQAw8wcAAN4NADD0BwAA3g0AMPUHAACHFAAw9gcAAOENADALaAAA9hMAMGkAAPsTADDuBwAA9xMAMO8HAAD4EwAw8AcAAPkTACDxBwAA-hMAMPIHAAD6EwAw8wcAAPoTADD0BwAA-hMAMPUHAAD8EwAw9gcAAP0TADALaAAA7RMAMGkAAPETADDuBwAA7hMAMO8HAADvEwAw8AcAAPATACDxBwAAoA0AMPIHAACgDQAw8wcAAKANADD0BwAAoA0AMPUHAADyEwAw9gcAAKMNADALaAAA5BMAMGkAAOgTADDuBwAA5RMAMO8HAADmEwAw8AcAAOcTACDxBwAAtw0AMPIHAAC3DQAw8wcAALcNADD0BwAAtw0AMPUHAADpEwAw9gcAALoNADALaAAA2xMAMGkAAN8TADDuBwAA3BMAMO8HAADdEwAw8AcAAN4TACDxBwAAxw0AMPIHAADHDQAw8wcAAMcNADD0BwAAxw0AMPUHAADgEwAw9gcAAMoNADALaAAA0hMAMGkAANYTADDuBwAA0xMAMO8HAADUEwAw8AcAANUTACDxBwAAjQ0AMPIHAACNDQAw8wcAAI0NADD0BwAAjQ0AMPUHAADXEwAw9gcAAJANADALaAAAyRMAMGkAAM0TADDuBwAAyhMAMO8HAADLEwAw8AcAAMwTACDxBwAA7g8AMPIHAADuDwAw8wcAAO4PADD0BwAA7g8AMPUHAADOEwAw9gcAAPEPADALaAAAwBMAMGkAAMQTADDuBwAAwRMAMO8HAADCEwAw8AcAAMMTACDxBwAAig8AMPIHAACKDwAw8wcAAIoPADD0BwAAig8AMPUHAADFEwAw9gcAAI0PADAHaAAAuxMAIGkAAL4TACDuBwAAvBMAIO8HAAC9EwAg8gcAAOcBACDzBwAA5wEAIPQHAADZBgAgC2gAAK8TADBpAAC0EwAw7gcAALATADDvBwAAsRMAMPAHAACyEwAg8QcAALMTADDyBwAAsxMAMPMHAACzEwAw9AcAALMTADD1BwAAtRMAMPYHAAC2EwAwC2gAAKYTADBpAACqEwAw7gcAAKcTADDvBwAAqBMAMPAHAACpEwAg8QcAAMASADDyBwAAwBIAMPMHAADAEgAw9AcAAMASADD1BwAAqxMAMPYHAADDEgAwC2gAAJ0TADBpAAChEwAw7gcAAJ4TADDvBwAAnxMAMPAHAACgEwAg8QcAAMYQADDyBwAAxhAAMPMHAADGEAAw9AcAAMYQADD1BwAAohMAMPYHAADJEAAwC2gAAJQTADBpAACYEwAw7gcAAJUTADDvBwAAlhMAMPAHAACXEwAg8QcAAJsOADDyBwAAmw4AMPMHAACbDgAw9AcAAJsOADD1BwAAmRMAMPYHAACeDgAwC2gAAIgTADBpAACNEwAw7gcAAIkTADDvBwAAihMAMPAHAACLEwAg8QcAAIwTADDyBwAAjBMAMPMHAACMEwAw9AcAAIwTADD1BwAAjhMAMPYHAACPEwAwC2gAAPwSADBpAACBEwAw7gcAAP0SADDvBwAA_hIAMPAHAAD_EgAg8QcAAIATADDyBwAAgBMAMPMHAACAEwAw9AcAAIATADD1BwAAghMAMPYHAACDEwAwC2gAAPMSADBpAAD3EgAw7gcAAPQSADDvBwAA9RIAMPAHAAD2EgAg8QcAAPIMADDyBwAA8gwAMPMHAADyDAAw9AcAAPIMADD1BwAA-BIAMPYHAAD1DAAwC2gAAOoSADBpAADuEgAw7gcAAOsSADDvBwAA7BIAMPAHAADtEgAg8QcAAPIMADDyBwAA8gwAMPMHAADyDAAw9AcAAPIMADD1BwAA7xIAMPYHAAD1DAAwFRAAAIUPACAYAACGDQAgGQAAhw0AIB4AAIMNACAgAACFDQAgIQAAiA0AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCnQcBAAAAAZ8HAQAAAAGgBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABAgAAAF0AIGgAAPISACADAAAAXQAgaAAA8hIAIGkAAPESACABYQAA1BoAMAIAAABdACBhAADxEgAgAgAAAPYMACBhAADwEgAgD4cGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDjDAAhswYBAOMMACG_BgAA-QydByLBBkAA-gwAIcQGAQDjDAAhmwcAAPgMmwcinQcBAOIMACGfBwEA4gwAIaAHAQDjDAAhoQcBAOMMACGiBwEA4wwAIaMHQADkDAAhFRAAAIMPACAYAAD_DAAgGQAAgA0AIB4AAPwMACAgAAD-DAAgIQAAgQ0AIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDjDAAhswYBAOMMACG_BgAA-QydByLBBkAA-gwAIcQGAQDjDAAhmwcAAPgMmwcinQcBAOIMACGfBwEA4gwAIaAHAQDjDAAhoQcBAOMMACGiBwEA4wwAIaMHQADkDAAhFRAAAIUPACAYAACGDQAgGQAAhw0AIB4AAIMNACAgAACFDQAgIQAAiA0AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCnQcBAAAAAZ8HAQAAAAGgBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABFRAAAIUPACAYAACGDQAgGQAAhw0AIB8AAIQNACAgAACFDQAgIQAAiA0AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCngcBAAAAAZ8HAQAAAAGgBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABAgAAAF0AIGgAAPsSACADAAAAXQAgaAAA-xIAIGkAAPoSACABYQAA0xoAMAIAAABdACBhAAD6EgAgAgAAAPYMACBhAAD5EgAgD4cGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDjDAAhswYBAOMMACG_BgAA-QydByLBBkAA-gwAIcQGAQDjDAAhmwcAAPgMmwcingcBAOIMACGfBwEA4gwAIaAHAQDjDAAhoQcBAOMMACGiBwEA4wwAIaMHQADkDAAhFRAAAIMPACAYAAD_DAAgGQAAgA0AIB8AAP0MACAgAAD-DAAgIQAAgQ0AIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDjDAAhswYBAOMMACG_BgAA-QydByLBBkAA-gwAIcQGAQDjDAAhmwcAAPgMmwcingcBAOIMACGfBwEA4gwAIaAHAQDjDAAhoQcBAOMMACGiBwEA4wwAIaMHQADkDAAhFRAAAIUPACAYAACGDQAgGQAAhw0AIB8AAIQNACAgAACFDQAgIQAAiA0AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCngcBAAAAAZ8HAQAAAAGgBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABCyAAAKwSACA-AACuEgAghwYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAACnBwLBBkAAAAABnwcBAAAAAaUHAAAApQcCpwcBAAAAAagHAQAAAAECAAAAgAIAIGgAAIcTACADAAAAgAIAIGgAAIcTACBpAACGEwAgAWEAANIaADAQBwAAoAsAICAAANwKACA-AACEDAAghAYAAIAMADCFBgAA_gEAEIYGAACADAAwhwYBAAAAAYwGAQDXCgAhjwZAANsKACGQBkAA2woAIb8GAACCDKcHIsEGQACDDAAhnwcBANcKACGlBwAAgQylByKnBwEA2AoAIagHAQDYCgAhAgAAAIACACBhAACGEwAgAgAAAIQTACBhAACFEwAgDYQGAACDEwAwhQYAAIQTABCGBgAAgxMAMIcGAQDXCgAhjAYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAIIMpwciwQZAAIMMACGfBwEA1woAIaUHAACBDKUHIqcHAQDYCgAhqAcBANgKACENhAYAAIMTADCFBgAAhBMAEIYGAACDEwAwhwYBANcKACGMBgEA1woAIY8GQADbCgAhkAZAANsKACG_BgAAggynByLBBkAAgwwAIZ8HAQDXCgAhpQcAAIEMpQcipwcBANgKACGoBwEA2AoAIQmHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAAqBKnByLBBkAA-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_BgAAzBDtBiLgBgEA4gwAIeYGAQDjDAAh6AYBAOMMACHqBgEA4gwAIesGAQDiDAAhDQkAANAQACALAADOEAAgGwAA9BAAIIcGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhvwYAAMwQ7QYi4AYBAOIMACHmBgEA4wwAIegGAQDjDAAh6gYBAOIMACHrBgEA4gwAIQ0JAADfEAAgCwAA3RAAIBsAAPUQACCHBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAADtBgLgBgEAAAAB5gYBAAAAAegGAQAAAAHqBgEAAAAB6wYBAAAAAQw_AADvDgAghwYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAADXBgLTBgEAAAAB1QYAAADVBgLXBhAAAAAB2AYBAAAAAdkGAgAAAAHaBkAAAAAB2wZAAAAAAQIAAADdAQAgaAAArhMAIAMAAADdAQAgaAAArhMAIGkAAK0TACABYQAAzhoAMAIAAADdAQAgYQAArRMAIAIAAADEEgAgYQAArBMAIAuHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAA6Q7XBiLTBgEA4wwAIdUGAADoDtUGItcGEADqDgAh2AYBAOIMACHZBgIA6w4AIdoGQADkDAAh2wZAAOQMACEMPwAA7Q4AIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIb8GAADpDtcGItMGAQDjDAAh1QYAAOgO1QYi1wYQAOoOACHYBgEA4gwAIdkGAgDrDgAh2gZAAOQMACHbBkAA5AwAIQw_AADvDgAghwYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAADXBgLTBgEAAAAB1QYAAADVBgLXBhAAAAAB2AYBAAAAAdkGAgAAAAHaBkAAAAAB2wZAAAAAARGHBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAPwGAtUGAAAA1QYC1wYQAAAAAdgGAQAAAAHZBgIAAAAB-gYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABAgAAAOsBACBoAAC6EwAgAwAAAOsBACBoAAC6EwAgaQAAuRMAIAFhAADNGgAwFgcAAKALACCEBgAAjQwAMIUGAADpAQAQhgYAAI0MADCHBgEAAAABjAYBANcKACGPBkAA2woAIZAGQADbCgAhvwYAAJEM_AYi1QYAAI4M1QYi1wYQAI8MACHYBgEA1woAIdkGAgCQDAAh-gYBANcKACH8BgEAAAAB_QYBANgKACH-BgEAAAAB_wYBANgKACGABwEA2AoAIYEHAQDYCgAhggcAAJIMACCDB0AAgwwAIQIAAADrAQAgYQAAuRMAIAIAAAC3EwAgYQAAuBMAIBWEBgAAthMAMIUGAAC3EwAQhgYAALYTADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIb8GAACRDPwGItUGAACODNUGItcGEACPDAAh2AYBANcKACHZBgIAkAwAIfoGAQDXCgAh_AYBANcKACH9BgEA2AoAIf4GAQDYCgAh_wYBANgKACGABwEA2AoAIYEHAQDYCgAhggcAAJIMACCDB0AAgwwAIRWEBgAAthMAMIUGAAC3EwAQhgYAALYTADCHBgEA1woAIYwGAQDXCgAhjwZAANsKACGQBkAA2woAIb8GAACRDPwGItUGAACODNUGItcGEACPDAAh2AYBANcKACHZBgIAkAwAIfoGAQDXCgAh_AYBANcKACH9BgEA2AoAIf4GAQDYCgAh_wYBANgKACGABwEA2AoAIYEHAQDYCgAhggcAAJIMACCDB0AAgwwAIRGHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAA3BH8BiLVBgAA6A7VBiLXBhAA6g4AIdgGAQDiDAAh2QYCAOsOACH6BgEA4gwAIfwGAQDiDAAh_QYBAOMMACH-BgEA4wwAIf8GAQDjDAAhgAcBAOMMACGBBwEA4wwAIYIHgAAAAAGDB0AA-gwAIRGHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAA3BH8BiLVBgAA6A7VBiLXBhAA6g4AIdgGAQDiDAAh2QYCAOsOACH6BgEA4gwAIfwGAQDiDAAh_QYBAOMMACH-BgEA4wwAIf8GAQDjDAAhgAcBAOMMACGBBwEA4wwAIYIHgAAAAAGDB0AA-gwAIRGHBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAPwGAtUGAAAA1QYC1wYQAAAAAdgGAQAAAAHZBgIAAAAB-gYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABC4cGAQAAAAGPBkAAAAABkAZAAAAAAYQHAQAAAAGFBwEAAAABhgcBAAAAAYcHAQAAAAGIBwEAAAABiQcBAAAAAYoHIAAAAAGLBwEAAAABAgAAANkGACBoAAC7EwAgAwAAAOcBACBoAAC7EwAgaQAAvxMAIA0AAADnAQAgYQAAvxMAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIYQHAQDiDAAhhQcBAOIMACGGBwEA4gwAIYcHAQDiDAAhiAcBAOIMACGJBwEA4gwAIYoHIADEDgAhiwcBAOMMACELhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhhAcBAOIMACGFBwEA4gwAIYYHAQDiDAAhhwcBAOIMACGIBwEA4gwAIYkHAQDiDAAhigcgAMQOACGLBwEA4wwAIRoJAACZDwAgGQAA6Q8AIBsAAJoPACAdAACbDwAghwYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbMGAQAAAAG_BgAAAJAHAtcGEAAAAAHYBgEAAAAB2QYCAAAAAegGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAcBAAAAAYEHAQAAAAGCB4AAAAABgwdAAAAAAYwHAQAAAAGOBwAAAI4HApAHAQAAAAGRB0AAAAABAgAAAFcAIGgAAMgTACADAAAAVwAgaAAAyBMAIGkAAMcTACABYQAAzBoAMAIAAABXACBhAADHEwAgAgAAAI4PACBhAADGEwAgFocGAQDiDAAhjQYBAOIMACGPBkAA5AwAIZAGQADkDAAhswYBAOIMACG_BgAAkQ-QByLXBhAA6g4AIdgGAQDiDAAh2QYCAOsOACHoBgEA4gwAIfwGAQDiDAAh_QYBAOMMACH-BgEA4wwAIf8GAQDjDAAhgAcBAOMMACGBBwEA4wwAIYIHgAAAAAGDB0AA-gwAIYwHAQDiDAAhjgcAAJAPjgcikAcBAOIMACGRB0AA5AwAIRoJAACUDwAgGQAA5w8AIBsAAJUPACAdAACWDwAghwYBAOIMACGNBgEA4gwAIY8GQADkDAAhkAZAAOQMACGzBgEA4gwAIb8GAACRD5AHItcGEADqDgAh2AYBAOIMACHZBgIA6w4AIegGAQDiDAAh_AYBAOIMACH9BgEA4wwAIf4GAQDjDAAh_wYBAOMMACGABwEA4wwAIYEHAQDjDAAhggeAAAAAAYMHQAD6DAAhjAcBAOIMACGOBwAAkA-OByKQBwEA4gwAIZEHQADkDAAhGgkAAJkPACAZAADpDwAgGwAAmg8AIB0AAJsPACCHBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb8GAAAAkAcC1wYQAAAAAdgGAQAAAAHZBgIAAAAB6AYBAAAAAfwGAQAAAAH9BgEAAAAB_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_BgAAAL8GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAABAgAAAKMBACBoAAD1EwAgAwAAAKMBACBoAAD1EwAgaQAA9BMAIAFhAADHGgAwAgAAAKMBACBhAAD0EwAgAgAAAKQNACBhAADzEwAgDYcGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhnAYBAOIMACGxBgEA4wwAIb0GAQDjDAAhvwYAAKYNvwYiwAYBAOMMACHBBkAA-gwAIcIGQADkDAAhwwYBAOIMACHEBgEA4wwAIRIJAACsDQAgEAAA3A4AIBYAAKgNACAYAACqDQAgMwAAqQ0AIIcGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhnAYBAOIMACGxBgEA4wwAIb0GAQDjDAAhvwYAAKYNvwYiwAYBAOMMACHBBkAA-gwAIcIGQADkDAAhwwYBAOIMACHEBgEA4wwAIRIJAACyDQAgEAAA3Q4AIBYAAK4NACAYAACwDQAgMwAArw0AIIcGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGcBgEAAAABsQYBAAAAAb0GAQAAAAG_BgAAAL8GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAABHT0AAMgSACA-AADJEgAgQAAAyxIAIIcGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAAvQcCwQZAAAAAAeYGAQAAAAGoBwEAAAABqQcBAAAAAaoHAQAAAAGrBwEAAAABrQcAAACtBwOuBwEAAAABrwcAAADVBgOwBxAAAAABsQcBAAAAAbIHAgAAAAGzBwAAAPwGArQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAboHgAAAAAG7B0AAAAABvQcBAAAAAQIAAADXAQAgaAAAgRQAIAMAAADXAQAgaAAAgRQAIGkAAIAUACABYQAAxhoAMCIHAACbDAAgPQAA3AoAID4AAIQMACBAAADcCwAghAYAAJYMADCFBgAA1QEAEIYGAACWDAAwhwYBAAAAAYwGAQDYCgAhjwZAANsKACGQBkAA2woAIb8GAACaDL0HIsEGQACDDAAh5gYBANgKACGoBwEA2AoAIakHAQDXCgAhqgcBANcKACGrBwEA2AoAIa0HAADMC60HI64HAQDYCgAhrwcAAJcM1QYjsAcQAJgMACGxBwEA1woAIbIHAgCZDAAhswcAAJEM_AYitAcBAAAAAbUHAQDYCgAhtgcBAAAAAbcHAQDYCgAhuAcBANgKACG5BwEA2AoAIboHAACSDAAguwdAAIMMACG9BwEA2AoAIQIAAADXAQAgYQAAgBQAIAIAAAD-EwAgYQAA_xMAIB6EBgAA_RMAMIUGAAD-EwAQhgYAAP0TADCHBgEA1woAIYwGAQDYCgAhjwZAANsKACGQBkAA2woAIb8GAACaDL0HIsEGQACDDAAh5gYBANgKACGoBwEA2AoAIakHAQDXCgAhqgcBANcKACGrBwEA2AoAIa0HAADMC60HI64HAQDYCgAhrwcAAJcM1QYjsAcQAJgMACGxBwEA1woAIbIHAgCZDAAhswcAAJEM_AYitAcBANgKACG1BwEA2AoAIbYHAQDYCgAhtwcBANgKACG4BwEA2AoAIbkHAQDYCgAhugcAAJIMACC7B0AAgwwAIb0HAQDYCgAhHoQGAAD9EwAwhQYAAP4TABCGBgAA_RMAMIcGAQDXCgAhjAYBANgKACGPBkAA2woAIZAGQADbCgAhvwYAAJoMvQciwQZAAIMMACHmBgEA2AoAIagHAQDYCgAhqQcBANcKACGqBwEA1woAIasHAQDYCgAhrQcAAMwLrQcjrgcBANgKACGvBwAAlwzVBiOwBxAAmAwAIbEHAQDXCgAhsgcCAJkMACGzBwAAkQz8BiK0BwEA2AoAIbUHAQDYCgAhtgcBANgKACG3BwEA2AoAIbgHAQDYCgAhuQcBANgKACG6BwAAkgwAILsHQACDDAAhvQcBANgKACEahwYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAALcSvQciwQZAAPoMACHmBgEA4wwAIagHAQDjDAAhqQcBAOIMACGqBwEA4gwAIasHAQDjDAAhrQcAALQSrQcjrgcBAOMMACGvBwAAtRLVBiOwBxAAthIAIbEHAQDiDAAhsgcCAJgQACGzBwAA3BH8BiK0BwEA4wwAIbUHAQDjDAAhtgcBAOMMACG3BwEA4wwAIbgHAQDjDAAhuQcBAOMMACG6B4AAAAABuwdAAPoMACG9BwEA4wwAIR09AAC4EgAgPgAAuRIAIEAAALsSACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG_BgAAtxK9ByLBBkAA-gwAIeYGAQDjDAAhqAcBAOMMACGpBwEA4gwAIaoHAQDiDAAhqwcBAOMMACGtBwAAtBKtByOuBwEA4wwAIa8HAAC1EtUGI7AHEAC2EgAhsQcBAOIMACGyBwIAmBAAIbMHAADcEfwGIrQHAQDjDAAhtQcBAOMMACG2BwEA4wwAIbcHAQDjDAAhuAcBAOMMACG5BwEA4wwAIboHgAAAAAG7B0AA-gwAIb0HAQDjDAAhHT0AAMgSACA-AADJEgAgQAAAyxIAIIcGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAAvQcCwQZAAAAAAeYGAQAAAAGoBwEAAAABqQcBAAAAAaoHAQAAAAGrBwEAAAABrQcAAACtBwOuBwEAAAABrwcAAADVBgOwBxAAAAABsQcBAAAAAbIHAgAAAAGzBwAAAPwGArQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAboHgAAAAAG7B0AAAAABvQcBAAAAAQsJAADtDQAgDgAA6g0AIA8AAOsNACAQAADODgAghwYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAQIAAAA8ACBoAACKFAAgAwAAADwAIGgAAIoUACBpAACJFAAgAWEAAMUaADACAAAAPAAgYQAAiRQAIAIAAADiDQAgYQAAiBQAIAeHBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsAYBAOIMACGxBgEA4gwAIQsJAADoDQAgDgAA5Q0AIA8AAOYNACAQAADNDgAghwYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGvBgEA4gwAIbAGAQDiDAAhsQYBAOIMACELCQAA7Q0AIA4AAOoNACAPAADrDQAgEAAAzg4AIIcGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAEVCQAAsg4AIAoAALMOACALAACsDgAgDgAAsQ4AIA8AAK8OACAQAADCDwAgGQAAsA4AIBsAALQOACAsAACtDgAgLQAArg4AIIcGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGzBgEAAAAB6AYBAAAAAfgGAQAAAAG_B0AAAAABAgAAACgAIGgAAJMUACADAAAAKAAgaAAAkxQAIGkAAJIUACABYQAAxBoAMAIAAAAoACBhAACSFAAgAgAAAPYNACBhAACRFAAgC4cGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACGwBgEA4gwAIbEGAQDiDAAhswYBAOIMACHoBgEA4gwAIfgGAQDjDAAhvwdAAOQMACEVCQAA_w0AIAoAAIAOACALAAD5DQAgDgAA_g0AIA8AAPwNACAQAADADwAgGQAA_Q0AIBsAAIEOACAsAAD6DQAgLQAA-w0AIIcGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACGwBgEA4gwAIbEGAQDiDAAhswYBAOIMACHoBgEA4gwAIfgGAQDjDAAhvwdAAOQMACEVCQAAsg4AIAoAALMOACALAACsDgAgDgAAsQ4AIA8AAK8OACAQAADCDwAgGQAAsA4AIBsAALQOACAsAACtDgAgLQAArg4AIIcGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGzBgEAAAAB6AYBAAAAAfgGAQAAAAG_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_xQAIAMAAACXAQAgaAAA_xQAIGkAAPMUACABYQAArRoAMA0HAACgCwAgCQAAogwAICUAAIULACCEBgAAqQwAMIUGAABrABCGBgAAqQwAMIcGAQAAAAGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIeAGAQDXCgAh5gYBANgKACECAAAAlwEAIGEAAPMUACACAAAA8RQAIGEAAPIUACAKhAYAAPAUADCFBgAA8RQAEIYGAADwFAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIeAGAQDXCgAh5gYBANgKACEKhAYAAPAUADCFBgAA8RQAEIYGAADwFAAwhwYBANcKACGMBgEA1woAIY0GAQDYCgAhjwZAANsKACGQBkAA2woAIeAGAQDXCgAh5gYBANgKACEGhwYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIeYGAQDjDAAhCAkAAPQUACAlAAD1FAAghwYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIeYGAQDjDAAhB2gAAKcaACBpAACrGgAg7gcAAKgaACDvBwAAqhoAIPIHAAAYACDzBwAAGAAg9AcAABoAIAtoAAD2FAAwaQAA-hQAMO4HAAD3FAAw7wcAAPgUADDwBwAA-RQAIPEHAACSEAAw8gcAAJIQADDzBwAAkhAAMPQHAACSEAAw9QcAAPsUADD2BwAAlRAAMA8HAAC_EAAgCQAAwBAAIA0AALwQACARAAC9EAAgGwAA8BAAICQAAL4QACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAeAGAQAAAAHmBgEAAAAB5wYCAAAAAegGAQAAAAECAAAANwAgaAAA_hQAIAMAAAA3ACBoAAD-FAAgaQAA_RQAIAFhAACpGgAwAgAAADcAIGEAAP0UACACAAAAlhAAIGEAAPwUACAJhwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAh5gYBAOMMACHnBgIAmBAAIegGAQDiDAAhDwcAAJ0QACAJAACeEAAgDQAAmhAAIBEAAJsQACAbAADvEAAgJAAAnBAAIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIeYGAQDjDAAh5wYCAJgQACHoBgEA4gwAIQ8HAAC_EAAgCQAAwBAAIA0AALwQACARAAC9EAAgGwAA8BAAICQAAL4QACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAeAGAQAAAAHmBgEAAAAB5wYCAAAAAegGAQAAAAEICQAAgBUAICUAAIEVACCHBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAeYGAQAAAAEDaAAApxoAIO4HAACoGgAg9AcAABoAIARoAAD2FAAw7gcAAPcUADDwBwAA-RQAIPQHAACSEAAwDQkAALQRACANAACyEQAgDwAAsREAIIcGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAG4BgEAAAAB5gYBAAAAAfAGAQAAAAHxBkAAAAAB8gYIAAAAAfMGCAAAAAECAAAAHwAgaAAAjRUAIAMAAAAfACBoAACNFQAgaQAAjBUAIAFhAACmGgAwEgcAAKALACAJAACvDAAgDQAAhgsAIA8AANELACCEBgAA1AwAMIUGAAAdABCGBgAA1AwAMIcGAQAAAAGMBgEA1woAIY0GAQDXCgAhjwZAANsKACGQBkAA2woAIbgGAQDXCgAh5gYBANgKACHwBgEA2AoAIfEGQACDDAAh8gYIAJ8MACHzBggAnwwAIQIAAAAfACBhAACMFQAgAgAAAIoVACBhAACLFQAgDoQGAACJFQAwhQYAAIoVABCGBgAAiRUAMIcGAQDXCgAhjAYBANcKACGNBgEA1woAIY8GQADbCgAhkAZAANsKACG4BgEA1woAIeYGAQDYCgAh8AYBANgKACHxBkAAgwwAIfIGCACfDAAh8wYIAJ8MACEOhAYAAIkVADCFBgAAihUAEIYGAACJFQAwhwYBANcKACGMBgEA1woAIY0GAQDXCgAhjwZAANsKACGQBkAA2woAIbgGAQDXCgAh5gYBANgKACHwBgEA2AoAIfEGQACDDAAh8gYIAJ8MACHzBggAnwwAIQqHBgEA4gwAIY0GAQDiDAAhjwZAAOQMACGQBkAA5AwAIbgGAQDiDAAh5gYBAOMMACHwBgEA4wwAIfEGQAD6DAAh8gYIAJMNACHzBggAkw0AIQ0JAACBEQAgDQAA_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_BUAMO4HAAD5FQAw7wcAAPoVADDwBwAA-xUAIPEHAADHDQAw8gcAAMcNADDzBwAAxw0AMPQHAADHDQAw9QcAAP0VADD2BwAAyg0AMAtoAADvFQAwaQAA8xUAMO4HAADwFQAw7wcAAPEVADDwBwAA8hUAIPEHAACNDQAw8gcAAI0NADDzBwAAjQ0AMPQHAACNDQAw9QcAAPQVADD2BwAAkA0AMAtoAADmFQAwaQAA6hUAMO4HAADnFQAw7wcAAOgVADDwBwAA6RUAIPEHAADuDwAw8gcAAO4PADDzBwAA7g8AMPQHAADuDwAw9QcAAOsVADD2BwAA8Q8AMAtoAADdFQAwaQAA4RUAMO4HAADeFQAw7wcAAN8VADDwBwAA4BUAIPEHAACKDwAw8gcAAIoPADDzBwAAig8AMPQHAACKDwAw9QcAAOIVADD2BwAAjQ8AMAtoAADUFQAwaQAA2BUAMO4HAADVFQAw7wcAANYVADDwBwAA1xUAIPEHAADGEAAw8gcAAMYQADDzBwAAxhAAMPQHAADGEAAw9QcAANkVADD2BwAAyRAAMAtoAADLFQAwaQAAzxUAMO4HAADMFQAw7wcAAM0VADDwBwAAzhUAIPEHAACbDgAw8gcAAJsOADDzBwAAmw4AMPQHAACbDgAw9QcAANAVADD2BwAAng4AMAtoAADCFQAwaQAAxhUAMO4HAADDFQAw7wcAAMQVADDwBwAAxRUAIPEHAADyDAAw8gcAAPIMADDzBwAA8gwAMPQHAADyDAAw9QcAAMcVADD2BwAA9QwAMAtoAAC3FQAwaQAAuxUAMO4HAAC4FQAw7wcAALkVADDwBwAAuhUAIPEHAACwFAAw8gcAALAUADDzBwAAsBQAMPQHAACwFAAw9QcAALwVADD2BwAAsxQAMAgDAAC7FAAgBwAAwRUAIIcGAQAAAAGMBgEAAAABjgYBAAAAAY8GQAAAAAGQBkAAAAABlwcAAADjBwICAAAAAQAgaAAAwBUAIAMAAAABACBoAADAFQAgaQAAvhUAIAFhAACjGgAwAgAAAAEAIGEAAL4VACACAAAAtBQAIGEAAL0VACAGhwYBAOIMACGMBgEA4gwAIY4GAQDiDAAhjwZAAOQMACGQBkAA5AwAIZcHAAC2FOMHIggDAAC4FAAgBwAAvxUAIIcGAQDiDAAhjAYBAOIMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACGXBwAAthTjByIFaAAAnhoAIGkAAKEaACDuBwAAnxoAIO8HAACgGgAg9AcAAIMFACAIAwAAuxQAIAcAAMEVACCHBgEAAAABjAYBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAZcHAAAA4wcCA2gAAJ4aACDuBwAAnxoAIPQHAACDBQAgFRAAAIUPACAYAACGDQAgGQAAhw0AIB4AAIMNACAfAACEDQAgIAAAhQ0AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCnQcBAAAAAZ4HAQAAAAGfBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABAgAAAF0AIGgAAMoVACADAAAAXQAgaAAAyhUAIGkAAMkVACABYQAAnRoAMAIAAABdACBhAADJFQAgAgAAAPYMACBhAADIFQAgD4cGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDjDAAhswYBAOMMACG_BgAA-QydByLBBkAA-gwAIcQGAQDjDAAhmwcAAPgMmwcinQcBAOIMACGeBwEA4gwAIZ8HAQDiDAAhoQcBAOMMACGiBwEA4wwAIaMHQADkDAAhFRAAAIMPACAYAAD_DAAgGQAAgA0AIB4AAPwMACAfAAD9DAAgIAAA_gwAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDjDAAhswYBAOMMACG_BgAA-QydByLBBkAA-gwAIcQGAQDjDAAhmwcAAPgMmwcinQcBAOIMACGeBwEA4gwAIZ8HAQDiDAAhoQcBAOMMACGiBwEA4wwAIaMHQADkDAAhFRAAAIUPACAYAACGDQAgGQAAhw0AIB4AAIMNACAfAACEDQAgIAAAhQ0AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCnQcBAAAAAZ4HAQAAAAGfBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABDgcAAKkOACAoAACnDgAgKQAA2xAAICsAAKgOACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABxQYBAAAAAeAGAQAAAAHmBgEAAAAB7QYBAAAAAe4GAQAAAAHvBgEAAAABAgAAACwAIGgAANMVACADAAAALAAgaAAA0xUAIGkAANIVACABYQAAnBoAMAIAAAAsACBhAADSFQAgAgAAAJ8OACBhAADRFQAgCocGAQDiDAAhjAYBAOMMACGPBkAA5AwAIZAGQADkDAAhxQYBAOIMACHgBgEA4gwAIeYGAQDjDAAh7QYBAOMMACHuBgEA4gwAIe8GAQDiDAAhDgcAAKQOACAoAACiDgAgKQAA2RAAICsAAKMOACCHBgEA4gwAIYwGAQDjDAAhjwZAAOQMACGQBkAA5AwAIcUGAQDiDAAh4AYBAOIMACHmBgEA4wwAIe0GAQDjDAAh7gYBAOIMACHvBgEA4gwAIQ4HAACpDgAgKAAApw4AICkAANsQACArAACoDgAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAcUGAQAAAAHgBgEAAAAB5gYBAAAAAe0GAQAAAAHuBgEAAAAB7wYBAAAAAQ0HAADeEAAgCwAA3RAAIBsAAPUQACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAADtBgLgBgEAAAAB5gYBAAAAAegGAQAAAAHqBgEAAAAB6wYBAAAAAQIAAAAzACBoAADcFQAgAwAAADMAIGgAANwVACBpAADbFQAgAWEAAJsaADACAAAAMwAgYQAA2xUAIAIAAADKEAAgYQAA2hUAIAqHBgEA4gwAIYwGAQDjDAAhjwZAAOQMACGQBkAA5AwAIb8GAADMEO0GIuAGAQDiDAAh5gYBAOMMACHoBgEA4wwAIeoGAQDiDAAh6wYBAOIMACENBwAAzxAAIAsAAM4QACAbAAD0EAAghwYBAOIMACGMBgEA4wwAIY8GQADkDAAhkAZAAOQMACG_BgAAzBDtBiLgBgEA4gwAIeYGAQDjDAAh6AYBAOMMACHqBgEA4gwAIesGAQDiDAAhDQcAAN4QACALAADdEAAgGwAA9RAAIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAO0GAuAGAQAAAAHmBgEAAAAB6AYBAAAAAeoGAQAAAAHrBgEAAAABGgcAAJgPACAZAADpDwAgGwAAmg8AIB0AAJsPACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb8GAAAAkAcC1wYQAAAAAdgGAQAAAAHZBgIAAAAB6AYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABjAcBAAAAAY4HAAAAjgcCkAcBAAAAAZEHQAAAAAECAAAAVwAgaAAA5RUAIAMAAABXACBoAADlFQAgaQAA5BUAIAFhAACaGgAwAgAAAFcAIGEAAOQVACACAAAAjg8AIGEAAOMVACAWhwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACGzBgEA4gwAIb8GAACRD5AHItcGEADqDgAh2AYBAOIMACHZBgIA6w4AIegGAQDiDAAh_AYBAOIMACH9BgEA4wwAIf4GAQDjDAAh_wYBAOMMACGABwEA4wwAIYEHAQDjDAAhggeAAAAAAYMHQAD6DAAhjAcBAOIMACGOBwAAkA-OByKQBwEA4gwAIZEHQADkDAAhGgcAAJMPACAZAADnDwAgGwAAlQ8AIB0AAJYPACCHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbMGAQDiDAAhvwYAAJEPkAci1wYQAOoOACHYBgEA4gwAIdkGAgDrDgAh6AYBAOIMACH8BgEA4gwAIf0GAQDjDAAh_gYBAOMMACH_BgEA4wwAIYAHAQDjDAAhgQcBAOMMACGCB4AAAAABgwdAAPoMACGMBwEA4gwAIY4HAACQD44HIpAHAQDiDAAhkQdAAOQMACEaBwAAmA8AIBkAAOkPACAbAACaDwAgHQAAmw8AIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAGzBgEAAAABvwYAAACQBwLXBhAAAAAB2AYBAAAAAdkGAgAAAAHoBgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHAQAAAAGBBwEAAAABggeAAAAAAYMHQAAAAAGMBwEAAAABjgcAAACOBwKQBwEAAAABkQdAAAAAAQwHAACCEAAgGwAA8BEAIBwAAIQQACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAAB2AYBAAAAAegGAQAAAAGKByAAAAABkgcQAAAAAZMHEAAAAAECAAAAdgAgaAAA7hUAIAMAAAB2ACBoAADuFQAgaQAA7RUAIAFhAACZGgAwAgAAAHYAIGEAAO0VACACAAAA8g8AIGEAAOwVACAJhwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACHYBgEA4gwAIegGAQDiDAAhigcgAMQOACGSBxAA6g4AIZMHEADqDgAhDAcAAPUPACAbAADvEQAgHAAA9w8AIIcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAh2AYBAOIMACHoBgEA4gwAIYoHIADEDgAhkgcQAOoOACGTBxAA6g4AIQwHAACCEAAgGwAA8BEAIBwAAIQQACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAAB2AYBAAAAAegGAQAAAAGKByAAAAABkgcQAAAAAZMHEAAAAAEWBwAAmg0AIBAAAIkOACApAACZDQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAHFBgEAAAABxgYIAAAAAccGCAAAAAHIBggAAAAByQYIAAAAAcoGCAAAAAHLBggAAAABzAYIAAAAAc0GCAAAAAHOBggAAAABzwYIAAAAAdAGCAAAAAHRBggAAAAB0gYIAAAAAQIAAACtAQAgaAAA9xUAIAMAAACtAQAgaAAA9xUAIGkAAPYVACABYQAAmBoAMAIAAACtAQAgYQAA9hUAIAIAAACRDQAgYQAA9RUAIBOHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDiDAAhxQYBAOIMACHGBggAkw0AIccGCACTDQAhyAYIAJMNACHJBggAkw0AIcoGCACTDQAhywYIAJMNACHMBggAkw0AIc0GCACTDQAhzgYIAJMNACHPBggAkw0AIdAGCACTDQAh0QYIAJMNACHSBggAkw0AIRYHAACWDQAgEAAAiA4AICkAAJUNACCHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDiDAAhxQYBAOIMACHGBggAkw0AIccGCACTDQAhyAYIAJMNACHJBggAkw0AIcoGCACTDQAhywYIAJMNACHMBggAkw0AIc0GCACTDQAhzgYIAJMNACHPBggAkw0AIdAGCACTDQAh0QYIAJMNACHSBggAkw0AIRYHAACaDQAgEAAAiQ4AICkAAJkNACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAcUGAQAAAAHGBggAAAABxwYIAAAAAcgGCAAAAAHJBggAAAABygYIAAAAAcsGCAAAAAHMBggAAAABzQYIAAAAAc4GCAAAAAHPBggAAAAB0AYIAAAAAdEGCAAAAAHSBggAAAABDQcAANMNACASAADTDgAgGQAA0g0AIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BgEAAAABtgYBAAAAAbcGQAAAAAECAAAARgAgaAAAgBYAIAMAAABGACBoAACAFgAgaQAA_xUAIAFhAACXGgAwAgAAAEYAIGEAAP8VACACAAAAyw0AIGEAAP4VACAKhwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACGyBgEA4gwAIbMGAQDiDAAhtAYBAOMMACG1BgEA4wwAIbYGAQDjDAAhtwZAAOQMACENBwAAzw0AIBIAANIOACAZAADODQAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACGyBgEA4gwAIbMGAQDiDAAhtAYBAOMMACG1BgEA4wwAIbYGAQDjDAAhtwZAAOQMACENBwAA0w0AIBIAANMOACAZAADSDQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BgEAAAABtwZAAAAAAQ4HAADXDQAgDgAA1g0AIBAAANgOACAjAADZDQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGxBgEAAAABuAYBAAAAAbkGAQAAAAG7BgAAALsGArwGQAAAAAECAAAAQQAgaAAAiRYAIAMAAABBACBoAACJFgAgaQAAiBYAIAFhAACWGgAwAgAAAEEAIGEAAIgWACACAAAAuw0AIGEAAIcWACAKhwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACGvBgEA4gwAIbEGAQDiDAAhuAYBAOIMACG5BgEA4wwAIbsGAAC9DbsGIrwGQAD6DAAhDgcAAMANACAOAAC_DQAgEAAA1w4AICMAAMINACCHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsQYBAOIMACG4BgEA4gwAIbkGAQDjDAAhuwYAAL0NuwYivAZAAPoMACEOBwAA1w0AIA4AANYNACAQAADYDgAgIwAA2Q0AIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAGvBgEAAAABsQYBAAAAAbgGAQAAAAG5BgEAAAABuwYAAAC7BgK8BkAAAAABEgcAALENACAQAADdDgAgFgAArg0AIBgAALANACAzAACvDQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAZwGAQAAAAGxBgEAAAABvQYBAAAAAb8GAAAAvwYCwAYBAAAAAcEGQAAAAAHCBkAAAAABwwYBAAAAAcQGAQAAAAECAAAAowEAIGgAAJIWACADAAAAowEAIGgAAJIWACBpAACRFgAgAWEAAJUaADACAAAAowEAIGEAAJEWACACAAAApA0AIGEAAJAWACANhwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACGcBgEA4gwAIbEGAQDjDAAhvQYBAOMMACG_BgAApg2_BiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAIcQGAQDjDAAhEgcAAKsNACAQAADcDgAgFgAAqA0AIBgAAKoNACAzAACpDQAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACGcBgEA4gwAIbEGAQDjDAAhvQYBAOMMACG_BgAApg2_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_FgAgAwAAADcAIGgAAL8WACBpAAC-FgAgAWEAAJAaADACAAAANwAgYQAAvhYAIAIAAACWEAAgYQAAvRYAIAmHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAh5gYBAOMMACHnBgIAmBAAIegGAQDiDAAh6QYBAOMMACEPBwAAnRAAIA0AAJoQACARAACbEAAgGwAA7xAAICQAAJwQACAmAACfEAAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIeYGAQDjDAAh5wYCAJgQACHoBgEA4gwAIekGAQDjDAAhDwcAAL8QACANAAC8EAAgEQAAvRAAIBsAAPAQACAkAAC-EAAgJgAAwRAAIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAAB5gYBAAAAAecGAgAAAAHoBgEAAAAB6QYBAAAAAQ0HAACtEQAgCgAAxxQAIA0AAK8RACARAACwEQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAeYGAQAAAAHyBgIAAAAB-AYBAAAAAcAHAQAAAAHBBwEAAAABAgAAACMAIGgAAMgWACADAAAAIwAgaAAAyBYAIGkAAMcWACABYQAAjxoAMAIAAAAjACBhAADHFgAgAgAAAJMRACBhAADGFgAgCYcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAh5gYBAOMMACHyBgIAmBAAIfgGAQDjDAAhwAcBAOIMACHBBwEA4gwAIQ0HAACWEQAgCgAAxRQAIA0AAJgRACARAACZEQAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACHmBgEA4wwAIfIGAgCYEAAh-AYBAOMMACHABwEA4gwAIcEHAQDiDAAhDQcAAK0RACAKAADHFAAgDQAArxEAIBEAALARACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAAB5gYBAAAAAfIGAgAAAAH4BgEAAAABwAcBAAAAAcEHAQAAAAEIBwAA0xYAICUAAIEVACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAeYGAQAAAAECAAAAlwEAIGgAANIWACADAAAAlwEAIGgAANIWACBpAADQFgAgAWEAAI4aADACAAAAlwEAIGEAANAWACACAAAA8RQAIGEAAM8WACAGhwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIeYGAQDjDAAhCAcAANEWACAlAAD1FAAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIeYGAQDjDAAhBWgAAIkaACBpAACMGgAg7gcAAIoaACDvBwAAixoAIPQHAACDBQAgCAcAANMWACAlAACBFQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAeAGAQAAAAHmBgEAAAABA2gAAIkaACDuBwAAihoAIPQHAACDBQAgDQcAALMRACANAACyEQAgDwAAsREAIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG4BgEAAAAB5gYBAAAAAfAGAQAAAAHxBkAAAAAB8gYIAAAAAfMGCAAAAAECAAAAHwAgaAAA3BYAIAMAAAAfACBoAADcFgAgaQAA2xYAIAFhAACIGgAwAgAAAB8AIGEAANsWACACAAAAihUAIGEAANoWACAKhwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACG4BgEA4gwAIeYGAQDjDAAh8AYBAOMMACHxBkAA-gwAIfIGCACTDQAh8wYIAJMNACENBwAAgBEAIA0AAP8QACAPAAD-EAAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACG4BgEA4gwAIeYGAQDjDAAh8AYBAOMMACHxBkAA-gwAIfIGCACTDQAh8wYIAJMNACENBwAAsxEAIA0AALIRACAPAACxEQAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAbgGAQAAAAHmBgEAAAAB8AYBAAAAAfEGQAAAAAHyBggAAAAB8wYIAAAAARgMAADsFgAgDQAA5BYAIBEAAOUWACAcAADrFgAgJQAA4RYAICcAAOoWACAqAADtFgAgLgAA3hYAIC8AAN8WACAwAADgFgAgMQAA4hYAIDIAAOMWACA0AADmFgAgNQAA5xYAIDYAAOgWACA3AADpFgAgOAAA7hYAIDkAAO8WACCHBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAABqwcBAAAAAb4HAQAAAAEEaAAA1BYAMO4HAADVFgAw8AcAANcWACD0BwAAhhUAMARoAADJFgAw7gcAAMoWADDwBwAAzBYAIPQHAADtFAAwBGgAAMAWADDuBwAAwRYAMPAHAADDFgAg9AcAAI8RADAEaAAAtxYAMO4HAAC4FgAw8AcAALoWACD0BwAAkhAAMARoAACuFgAw7gcAAK8WADDwBwAAsRYAIPQHAACkFAAwBGgAAKUWADDuBwAAphYAMPAHAACoFgAg9AcAAJgUADAEaAAAnBYAMO4HAACdFgAw8AcAAJ8WACD0BwAA8g0AMARoAACTFgAw7gcAAJQWADDwBwAAlhYAIPQHAADeDQAwBGgAAIoWADDuBwAAixYAMPAHAACNFgAg9AcAAKANADAEaAAAgRYAMO4HAACCFgAw8AcAAIQWACD0BwAAtw0AMARoAAD4FQAw7gcAAPkVADDwBwAA-xUAIPQHAADHDQAwBGgAAO8VADDuBwAA8BUAMPAHAADyFQAg9AcAAI0NADAEaAAA5hUAMO4HAADnFQAw8AcAAOkVACD0BwAA7g8AMARoAADdFQAw7gcAAN4VADDwBwAA4BUAIPQHAACKDwAwBGgAANQVADDuBwAA1RUAMPAHAADXFQAg9AcAAMYQADAEaAAAyxUAMO4HAADMFQAw8AcAAM4VACD0BwAAmw4AMARoAADCFQAw7gcAAMMVADDwBwAAxRUAIPQHAADyDAAwBGgAALcVADDuBwAAuBUAMPAHAAC6FQAg9AcAALAUADAHOgAA8RYAIIcGAQAAAAGPBkAAAAABkAZAAAAAAeYGAQAAAAGrBwEAAAABvgcBAAAAAQRoAACaFQAw7gcAAJsVADDwBwAAnRUAIPQHAACeFQAwBGgAAI4VADDuBwAAjxUAMPAHAACRFQAg9AcAAJIVADAEaAAAghUAMO4HAACDFQAw8AcAAIUVACD0BwAAhhUAMARoAADpFAAw7gcAAOoUADDwBwAA7BQAIPQHAADtFAAwBGgAANEUADDuBwAA0hQAMPAHAADUFAAg9AcAANUUADAEaAAAyBQAMO4HAADJFAAw8AcAAMsUACD0BwAAkhAAMARoAAC9FAAw7gcAAL4UADDwBwAAwBQAIPQHAACPEQAwBGgAAKwUADDuBwAArRQAMPAHAACvFAAg9AcAALAUADAEaAAAoBQAMO4HAAChFAAw8AcAAKMUACD0BwAApBQAMARoAACUFAAw7gcAAJUUADDwBwAAlxQAIPQHAACYFAAwBGgAAIsUADDuBwAAjBQAMPAHAACOFAAg9AcAAPINADAEaAAAghQAMO4HAACDFAAw8AcAAIUUACD0BwAA3g0AMARoAAD2EwAw7gcAAPcTADDwBwAA-RMAIPQHAAD6EwAwBGgAAO0TADDuBwAA7hMAMPAHAADwEwAg9AcAAKANADAEaAAA5BMAMO4HAADlEwAw8AcAAOcTACD0BwAAtw0AMARoAADbEwAw7gcAANwTADDwBwAA3hMAIPQHAADHDQAwBGgAANITADDuBwAA0xMAMPAHAADVEwAg9AcAAI0NADAEaAAAyRMAMO4HAADKEwAw8AcAAMwTACD0BwAA7g8AMARoAADAEwAw7gcAAMETADDwBwAAwxMAIPQHAACKDwAwA2gAALsTACDuBwAAvBMAIPQHAADZBgAgBGgAAK8TADDuBwAAsBMAMPAHAACyEwAg9AcAALMTADAEaAAAphMAMO4HAACnEwAw8AcAAKkTACD0BwAAwBIAMARoAACdEwAw7gcAAJ4TADDwBwAAoBMAIPQHAADGEAAwBGgAAJQTADDuBwAAlRMAMPAHAACXEwAg9AcAAJsOADAEaAAAiBMAMO4HAACJEwAw8AcAAIsTACD0BwAAjBMAMARoAAD8EgAw7gcAAP0SADDwBwAA_xIAIPQHAACAEwAwBGgAAPMSADDuBwAA9BIAMPAHAAD2EgAg9AcAAPIMADAEaAAA6hIAMO4HAADrEgAw8AcAAO0SACD0BwAA8gwAMAAAAAAAAAAAAAAAAAACBwAA5BEAIIsHAADeDAAgAAAAAAAAAAAAB2gAAIMaACBpAACGGgAg7gcAAIQaACDvBwAAhRoAIPIHAAAWACDzBwAAFgAg9AcAAIMFACADaAAAgxoAIO4HAACEGgAg9AcAAIMFACAAAAAHaAAA_hkAIGkAAIEaACDuBwAA_xkAIO8HAACAGgAg8gcAABIAIPMHAAASACD0BwAAFAAgA2gAAP4ZACDuBwAA_xkAIPQHAAAUACAAAAAAAAAAAAAAAAAABWgAAPkZACBpAAD8GQAg7gcAAPoZACDvBwAA-xkAIPQHAACDBQAgA2gAAPkZACDuBwAA-hkAIPQHAACDBQAgAAAAAAAABWgAAPQZACBpAAD3GQAg7gcAAPUZACDvBwAA9hkAIPQHAACAAwAgA2gAAPQZACDuBwAA9RkAIPQHAACAAwAgAAAAAAAABWgAAO8ZACBpAADyGQAg7gcAAPAZACDvBwAA8RkAIPQHAACAAwAgA2gAAO8ZACDuBwAA8BkAIPQHAACAAwAgAAAABWgAAOoZACBpAADtGQAg7gcAAOsZACDvBwAA7BkAIPQHAACAAwAgA2gAAOoZACDuBwAA6xkAIPQHAACAAwAgAAAAC2gAAI8ZADBpAACUGQAw7gcAAJAZADDvBwAAkRkAMPAHAACSGQAg8QcAAJMZADDyBwAAkxkAMPMHAACTGQAw9AcAAJMZADD1BwAAlRkAMPYHAACWGQAwC2gAAIMZADBpAACIGQAw7gcAAIQZADDvBwAAhRkAMPAHAACGGQAg8QcAAIcZADDyBwAAhxkAMPMHAACHGQAw9AcAAIcZADD1BwAAiRkAMPYHAACKGQAwC2gAAPoYADBpAAD-GAAw7gcAAPsYADDvBwAA_BgAMPAHAAD9GAAg8QcAALAUADDyBwAAsBQAMPMHAACwFAAw9AcAALAUADD1BwAA_xgAMPYHAACzFAAwC2gAAPEYADBpAAD1GAAw7gcAAPIYADDvBwAA8xgAMPAHAAD0GAAg8QcAAKQUADDyBwAApBQAMPMHAACkFAAw9AcAAKQUADD1BwAA9hgAMPYHAACnFAAwC2gAAOgYADBpAADsGAAw7gcAAOkYADDvBwAA6hgAMPAHAADrGAAg8QcAAJgUADDyBwAAmBQAMPMHAACYFAAw9AcAAJgUADD1BwAA7RgAMPYHAACbFAAwC2gAAN8YADBpAADjGAAw7gcAAOAYADDvBwAA4RgAMPAHAADiGAAg8QcAAPoTADDyBwAA-hMAMPMHAAD6EwAw9AcAAPoTADD1BwAA5BgAMPYHAAD9EwAwC2gAANYYADBpAADaGAAw7gcAANcYADDvBwAA2BgAMPAHAADZGAAg8QcAAPoTADDyBwAA-hMAMPMHAAD6EwAw9AcAAPoTADD1BwAA2xgAMPYHAAD9EwAwC2gAAM0YADBpAADRGAAw7gcAAM4YADDvBwAAzxgAMPAHAADQGAAg8QcAAKANADDyBwAAoA0AMPMHAACgDQAw9AcAAKANADD1BwAA0hgAMPYHAACjDQAwC2gAAMQYADBpAADIGAAw7gcAAMUYADDvBwAAxhgAMPAHAADHGAAg8QcAAKANADDyBwAAoA0AMPMHAACgDQAw9AcAAKANADD1BwAAyRgAMPYHAACjDQAwB2gAAL8YACBpAADCGAAg7gcAAMAYACDvBwAAwRgAIPIHAACwAgAg8wcAALACACD0BwAAlQoAIAtoAAC2GAAwaQAAuhgAMO4HAAC3GAAw7wcAALgYADDwBwAAuRgAIPEHAACgDwAw8gcAAKAPADDzBwAAoA8AMPQHAACgDwAw9QcAALsYADD2BwAAow8AMAtoAACtGAAwaQAAsRgAMO4HAACuGAAw7wcAAK8YADDwBwAAsBgAIPEHAACgDwAw8gcAAKAPADDzBwAAoA8AMPQHAACgDwAw9QcAALIYADD2BwAAow8AMAdoAACoGAAgaQAAqxgAIO4HAACpGAAg7wcAAKoYACDyBwAAtAIAIPMHAAC0AgAg9AcAALcIACALaAAAnBgAMGkAAKEYADDuBwAAnRgAMO8HAACeGAAw8AcAAJ8YACDxBwAAoBgAMPIHAACgGAAw8wcAAKAYADD0BwAAoBgAMPUHAACiGAAw9gcAAKMYADALaAAAkxgAMGkAAJcYADDuBwAAlBgAMO8HAACVGAAw8AcAAJYYACDxBwAA8gwAMPIHAADyDAAw8wcAAPIMADD0BwAA8gwAMPUHAACYGAAw9gcAAPUMADALaAAAihgAMGkAAI4YADDuBwAAixgAMO8HAACMGAAw8AcAAI0YACDxBwAA8gwAMPIHAADyDAAw8wcAAPIMADD0BwAA8gwAMPUHAACPGAAw9gcAAPUMADALaAAAgRgAMGkAAIUYADDuBwAAghgAMO8HAACDGAAw8AcAAIQYACDxBwAAgBMAMPIHAACAEwAw8wcAAIATADD0BwAAgBMAMPUHAACGGAAw9gcAAIMTADALaAAA-BcAMGkAAPwXADDuBwAA-RcAMO8HAAD6FwAw8AcAAPsXACDxBwAAgBMAMPIHAACAEwAw8wcAAIATADD0BwAAgBMAMPUHAAD9FwAw9gcAAIMTADALaAAA7xcAMGkAAPMXADDuBwAA8BcAMO8HAADxFwAw8AcAAPIXACDxBwAAjBMAMPIHAACMEwAw8wcAAIwTADD0BwAAjBMAMPUHAAD0FwAw9gcAAI8TADALaAAA5hcAMGkAAOoXADDuBwAA5xcAMO8HAADoFwAw8AcAAOkXACDxBwAAiRIAMPIHAACJEgAw8wcAAIkSADD0BwAAiRIAMPUHAADrFwAw9gcAAIwSADAERQAA9hEAIIcGAQAAAAGUBwEAAAABlQdAAAAAAQIAAAD6AQAgaAAA7hcAIAMAAAD6AQAgaAAA7hcAIGkAAO0XACABYQAA6RkAMAIAAAD6AQAgYQAA7RcAIAIAAACNEgAgYQAA7BcAIAOHBgEA4gwAIZQHAQDiDAAhlQdAAOQMACEERQAA9BEAIIcGAQDiDAAhlAcBAOIMACGVB0AA5AwAIQRFAAD2EQAghwYBAAAAAZQHAQAAAAGVB0AAAAABCgcAAJ0SACBGAACfEgAgRwAAoBIAIIcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG4BgEAAAABuQYBAAAAAZkHAAAAlwcCAgAAAPIBACBoAAD3FwAgAwAAAPIBACBoAAD3FwAgaQAA9hcAIAFhAADoGQAwAgAAAPIBACBhAAD2FwAgAgAAAJATACBhAAD1FwAgB4cGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhuAYBAOIMACG5BgEA4gwAIZkHAAD7EZcHIgoHAACBEgAgRgAAgxIAIEcAAIQSACCHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbgGAQDiDAAhuQYBAOIMACGZBwAA-xGXByIKBwAAnRIAIEYAAJ8SACBHAACgEgAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAbgGAQAAAAG5BgEAAAABmQcAAACXBwILBwAArRIAICAAAKwSACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAACnBwLBBkAAAAABnwcBAAAAAaUHAAAApQcCpwcBAAAAAQIAAACAAgAgaAAAgBgAIAMAAACAAgAgaAAAgBgAIGkAAP8XACABYQAA5xkAMAIAAACAAgAgYQAA_xcAIAIAAACEEwAgYQAA_hcAIAmHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIb8GAACoEqcHIsEGQAD6DAAhnwcBAOIMACGlBwAApxKlByKnBwEA4wwAIQsHAACqEgAgIAAAqRIAIIcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAAKgSpwciwQZAAPoMACGfBwEA4gwAIaUHAACnEqUHIqcHAQDjDAAhCwcAAK0SACAgAACsEgAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAApwcCwQZAAAAAAZ8HAQAAAAGlBwAAAKUHAqcHAQAAAAELBwAArRIAID4AAK4SACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAACnBwLBBkAAAAABpQcAAAClBwKnBwEAAAABqAcBAAAAAQIAAACAAgAgaAAAiRgAIAMAAACAAgAgaAAAiRgAIGkAAIgYACABYQAA5hkAMAIAAACAAgAgYQAAiBgAIAIAAACEEwAgYQAAhxgAIAmHBgEA4gwAIYwGAQDiDAAhjwZAAOQMACGQBkAA5AwAIb8GAACoEqcHIsEGQAD6DAAhpQcAAKcSpQcipwcBAOMMACGoBwEA4wwAIQsHAACqEgAgPgAAqxIAIIcGAQDiDAAhjAYBAOIMACGPBkAA5AwAIZAGQADkDAAhvwYAAKgSpwciwQZAAPoMACGlBwAApxKlByKnBwEA4wwAIagHAQDjDAAhCwcAAK0SACA-AACuEgAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAApwcCwQZAAAAAAaUHAAAApQcCpwcBAAAAAagHAQAAAAEVEAAAhQ8AIBkAAIcNACAeAACDDQAgHwAAhA0AICAAAIUNACAhAACIDQAghwYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAbMGAQAAAAG_BgAAAJ0HAsEGQAAAAAGbBwAAAJsHAp0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhBwEAAAABogcBAAAAAaMHQAAAAAECAAAAXQAgaAAAkhgAIAMAAABdACBoAACSGAAgaQAAkRgAIAFhAADlGQAwAgAAAF0AIGEAAJEYACACAAAA9gwAIGEAAJAYACAPhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhsQYBAOMMACGzBgEA4wwAIb8GAAD5DJ0HIsEGQAD6DAAhmwcAAPgMmwcinQcBAOIMACGeBwEA4gwAIZ8HAQDiDAAhoAcBAOMMACGhBwEA4wwAIaIHAQDjDAAhowdAAOQMACEVEAAAgw8AIBkAAIANACAeAAD8DAAgHwAA_QwAICAAAP4MACAhAACBDQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhsQYBAOMMACGzBgEA4wwAIb8GAAD5DJ0HIsEGQAD6DAAhmwcAAPgMmwcinQcBAOIMACGeBwEA4gwAIZ8HAQDiDAAhoAcBAOMMACGhBwEA4wwAIaIHAQDjDAAhowdAAOQMACEVEAAAhQ8AIBkAAIcNACAeAACDDQAgHwAAhA0AICAAAIUNACAhAACIDQAghwYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAbMGAQAAAAG_BgAAAJ0HAsEGQAAAAAGbBwAAAJsHAp0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhBwEAAAABogcBAAAAAaMHQAAAAAEVEAAAhQ8AIBgAAIYNACAZAACHDQAgHgAAgw0AIB8AAIQNACAhAACIDQAghwYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAbMGAQAAAAG_BgAAAJ0HAsEGQAAAAAHEBgEAAAABmwcAAACbBwKdBwEAAAABngcBAAAAAaAHAQAAAAGhBwEAAAABogcBAAAAAaMHQAAAAAECAAAAXQAgaAAAmxgAIAMAAABdACBoAACbGAAgaQAAmhgAIAFhAADkGQAwAgAAAF0AIGEAAJoYACACAAAA9gwAIGEAAJkYACAPhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhsQYBAOMMACGzBgEA4wwAIb8GAAD5DJ0HIsEGQAD6DAAhxAYBAOMMACGbBwAA-AybByKdBwEA4gwAIZ4HAQDiDAAhoAcBAOMMACGhBwEA4wwAIaIHAQDjDAAhowdAAOQMACEVEAAAgw8AIBgAAP8MACAZAACADQAgHgAA_AwAIB8AAP0MACAhAACBDQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhsQYBAOMMACGzBgEA4wwAIb8GAAD5DJ0HIsEGQAD6DAAhxAYBAOMMACGbBwAA-AybByKdBwEA4gwAIZ4HAQDiDAAhoAcBAOMMACGhBwEA4wwAIaIHAQDjDAAhowdAAOQMACEVEAAAhQ8AIBgAAIYNACAZAACHDQAgHgAAgw0AIB8AAIQNACAhAACIDQAghwYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAbMGAQAAAAG_BgAAAJ0HAsEGQAAAAAHEBgEAAAABmwcAAACbBwKdBwEAAAABngcBAAAAAaAHAQAAAAGhBwEAAAABogcBAAAAAaMHQAAAAAEFhwYBAAAAAY8GQAAAAAGQBkAAAAABxwcBAAAAAcgHQAAAAAECAAAAuAIAIGgAAKcYACADAAAAuAIAIGgAAKcYACBpAACmGAAgAWEAAOMZADAKAwAA3AoAIIQGAAD_CwAwhQYAALYCABCGBgAA_wsAMIcGAQAAAAGOBgEAAAABjwZAANsKACGQBkAA2woAIccHAQDXCgAhyAdAANsKACECAAAAuAIAIGEAAKYYACACAAAApBgAIGEAAKUYACAJhAYAAKMYADCFBgAApBgAEIYGAACjGAAwhwYBANcKACGOBgEA1woAIY8GQADbCgAhkAZAANsKACHHBwEA1woAIcgHQADbCgAhCYQGAACjGAAwhQYAAKQYABCGBgAAoxgAMIcGAQDXCgAhjgYBANcKACGPBkAA2woAIZAGQADbCgAhxwcBANcKACHIB0AA2woAIQWHBgEA4gwAIY8GQADkDAAhkAZAAOQMACHHBwEA4gwAIcgHQADkDAAhBYcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIccHAQDiDAAhyAdAAOQMACEFhwYBAAAAAY8GQAAAAAGQBkAAAAABxwcBAAAAAcgHQAAAAAEIhwYBAAAAAY8GQAAAAAGQBkAAAAABnQYBAAAAAZ4GAQAAAAGjBoAAAAABpQYgAAAAAd8GAADVDwAgAgAAALcIACBoAACoGAAgAwAAALQCACBoAACoGAAgaQAArBgAIAoAAAC0AgAgYQAArBgAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIZ0GAQDiDAAhngYBAOIMACGjBoAAAAABpQYgAMQOACHfBgAA0w8AIAiHBgEA4gwAIY8GQADkDAAhkAZAAOQMACGdBgEA4gwAIZ4GAQDiDAAhowaAAAAAAaUGIADEDgAh3wYAANMPACAOFgAArA8AIBcAAK0PACAZAADPDwAghwYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb0GAQAAAAG_BgAAAN4GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHeBgEAAAABAgAAAE0AIGgAALUYACADAAAATQAgaAAAtRgAIGkAALQYACABYQAA4hkAMAIAAABNACBhAAC0GAAgAgAAAKQPACBhAACzGAAgC4cGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbMGAQDjDAAhvQYBAOMMACG_BgAApg_eBiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAId4GAQDiDAAhDhYAAKgPACAXAACpDwAgGQAAzg8AIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbMGAQDjDAAhvQYBAOMMACG_BgAApg_eBiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAId4GAQDiDAAhDhYAAKwPACAXAACtDwAgGQAAzw8AIIcGAQAAAAGPBkAAAAABkAZAAAAAAbMGAQAAAAG9BgEAAAABvwYAAADeBgLABgEAAAABwQZAAAAAAcIGQAAAAAHDBgEAAAAB3gYBAAAAAQ4WAACsDwAgGAAArg8AIBkAAM8PACCHBgEAAAABjwZAAAAAAZAGQAAAAAGzBgEAAAABvQYBAAAAAb8GAAAA3gYCwAYBAAAAAcEGQAAAAAHCBkAAAAABwwYBAAAAAcQGAQAAAAECAAAATQAgaAAAvhgAIAMAAABNACBoAAC-GAAgaQAAvRgAIAFhAADhGQAwAgAAAE0AIGEAAL0YACACAAAApA8AIGEAALwYACALhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhswYBAOMMACG9BgEA4wwAIb8GAACmD94GIsAGAQDjDAAhwQZAAPoMACHCBkAA5AwAIcMGAQDiDAAhxAYBAOMMACEOFgAAqA8AIBgAAKoPACAZAADODwAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhswYBAOMMACG9BgEA4wwAIb8GAACmD94GIsAGAQDjDAAhwQZAAPoMACHCBkAA5AwAIcMGAQDiDAAhxAYBAOMMACEOFgAArA8AIBgAAK4PACAZAADPDwAghwYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb0GAQAAAAG_BgAAAN4GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAABDIcGAQAAAAGPBkAAAAABkAZAAAAAAZ0GAQAAAAGeBgEAAAABnwYBAAAAAaAGAQAAAAGhBgAAxg4AIKIGAADHDgAgowaAAAAAAaQGgAAAAAGlBiAAAAABAgAAAJUKACBoAAC_GAAgAwAAALACACBoAAC_GAAgaQAAwxgAIA4AAACwAgAgYQAAwxgAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIZ0GAQDiDAAhngYBAOIMACGfBgEA4gwAIaAGAQDjDAAhoQYAAMIOACCiBgAAww4AIKMGgAAAAAGkBoAAAAABpQYgAMQOACEMhwYBAOIMACGPBkAA5AwAIZAGQADkDAAhnQYBAOIMACGeBgEA4gwAIZ8GAQDiDAAhoAYBAOMMACGhBgAAwg4AIKIGAADDDgAgowaAAAAAAaQGgAAAAAGlBiAAxA4AIRIHAACxDQAgCQAAsg0AIBAAAN0OACAWAACuDQAgMwAArw0AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABnAYBAAAAAbEGAQAAAAG9BgEAAAABvwYAAAC_BgLABgEAAAABwQZAAAAAAcIGQAAAAAHDBgEAAAABAgAAAKMBACBoAADMGAAgAwAAAKMBACBoAADMGAAgaQAAyxgAIAFhAADgGQAwAgAAAKMBACBhAADLGAAgAgAAAKQNACBhAADKGAAgDYcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGcBgEA4gwAIbEGAQDjDAAhvQYBAOMMACG_BgAApg2_BiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAIRIHAACrDQAgCQAArA0AIBAAANwOACAWAACoDQAgMwAAqQ0AIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGcBgEA4gwAIbEGAQDjDAAhvQYBAOMMACG_BgAApg2_BiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAIRIHAACxDQAgCQAAsg0AIBAAAN0OACAWAACuDQAgMwAArw0AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABnAYBAAAAAbEGAQAAAAG9BgEAAAABvwYAAAC_BgLABgEAAAABwQZAAAAAAcIGQAAAAAHDBgEAAAABEgcAALENACAJAACyDQAgEAAA3Q4AIBYAAK4NACAYAACwDQAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGxBgEAAAABvQYBAAAAAb8GAAAAvwYCwAYBAAAAAcEGQAAAAAHCBkAAAAABwwYBAAAAAcQGAQAAAAECAAAAowEAIGgAANUYACADAAAAowEAIGgAANUYACBpAADUGAAgAWEAAN8ZADACAAAAowEAIGEAANQYACACAAAApA0AIGEAANMYACANhwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDjDAAhvQYBAOMMACG_BgAApg2_BiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAIcQGAQDjDAAhEgcAAKsNACAJAACsDQAgEAAA3A4AIBYAAKgNACAYAACqDQAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIbEGAQDjDAAhvQYBAOMMACG_BgAApg2_BiLABgEA4wwAIcEGQAD6DAAhwgZAAOQMACHDBgEA4gwAIcQGAQDjDAAhEgcAALENACAJAACyDQAgEAAA3Q4AIBYAAK4NACAYAACwDQAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGxBgEAAAABvQYBAAAAAb8GAAAAvwYCwAYBAAAAAcEGQAAAAAHCBkAAAAABwwYBAAAAAcQGAQAAAAEdBwAAyhIAID0AAMgSACBAAADLEgAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAAvQcCwQZAAAAAAeYGAQAAAAGpBwEAAAABqgcBAAAAAasHAQAAAAGtBwAAAK0HA64HAQAAAAGvBwAAANUGA7AHEAAAAAGxBwEAAAABsgcCAAAAAbMHAAAA_AYCtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABugeAAAAAAbsHQAAAAAG9BwEAAAABAgAAANcBACBoAADeGAAgAwAAANcBACBoAADeGAAgaQAA3RgAIAFhAADeGQAwAgAAANcBACBhAADdGAAgAgAAAP4TACBhAADcGAAgGocGAQDiDAAhjAYBAOMMACGPBkAA5AwAIZAGQADkDAAhvwYAALcSvQciwQZAAPoMACHmBgEA4wwAIakHAQDiDAAhqgcBAOIMACGrBwEA4wwAIa0HAAC0Eq0HI64HAQDjDAAhrwcAALUS1QYjsAcQALYSACGxBwEA4gwAIbIHAgCYEAAhswcAANwR_AYitAcBAOMMACG1BwEA4wwAIbYHAQDjDAAhtwcBAOMMACG4BwEA4wwAIbkHAQDjDAAhugeAAAAAAbsHQAD6DAAhvQcBAOMMACEdBwAAuhIAID0AALgSACBAAAC7EgAghwYBAOIMACGMBgEA4wwAIY8GQADkDAAhkAZAAOQMACG_BgAAtxK9ByLBBkAA-gwAIeYGAQDjDAAhqQcBAOIMACGqBwEA4gwAIasHAQDjDAAhrQcAALQSrQcjrgcBAOMMACGvBwAAtRLVBiOwBxAAthIAIbEHAQDiDAAhsgcCAJgQACGzBwAA3BH8BiK0BwEA4wwAIbUHAQDjDAAhtgcBAOMMACG3BwEA4wwAIbgHAQDjDAAhuQcBAOMMACG6B4AAAAABuwdAAPoMACG9BwEA4wwAIR0HAADKEgAgPQAAyBIAIEAAAMsSACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAAC9BwLBBkAAAAAB5gYBAAAAAakHAQAAAAGqBwEAAAABqwcBAAAAAa0HAAAArQcDrgcBAAAAAa8HAAAA1QYDsAcQAAAAAbEHAQAAAAGyBwIAAAABswcAAAD8BgK0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAG6B4AAAAABuwdAAAAAAb0HAQAAAAEdBwAAyhIAID4AAMkSACBAAADLEgAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAAvQcCwQZAAAAAAeYGAQAAAAGoBwEAAAABqgcBAAAAAasHAQAAAAGtBwAAAK0HA64HAQAAAAGvBwAAANUGA7AHEAAAAAGxBwEAAAABsgcCAAAAAbMHAAAA_AYCtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABugeAAAAAAbsHQAAAAAG9BwEAAAABAgAAANcBACBoAADnGAAgAwAAANcBACBoAADnGAAgaQAA5hgAIAFhAADdGQAwAgAAANcBACBhAADmGAAgAgAAAP4TACBhAADlGAAgGocGAQDiDAAhjAYBAOMMACGPBkAA5AwAIZAGQADkDAAhvwYAALcSvQciwQZAAPoMACHmBgEA4wwAIagHAQDjDAAhqgcBAOIMACGrBwEA4wwAIa0HAAC0Eq0HI64HAQDjDAAhrwcAALUS1QYjsAcQALYSACGxBwEA4gwAIbIHAgCYEAAhswcAANwR_AYitAcBAOMMACG1BwEA4wwAIbYHAQDjDAAhtwcBAOMMACG4BwEA4wwAIbkHAQDjDAAhugeAAAAAAbsHQAD6DAAhvQcBAOMMACEdBwAAuhIAID4AALkSACBAAAC7EgAghwYBAOIMACGMBgEA4wwAIY8GQADkDAAhkAZAAOQMACG_BgAAtxK9ByLBBkAA-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_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-xgAMPAHAAD9GAAg9AcAALAUADAEaAAA8RgAMO4HAADyGAAw8AcAAPQYACD0BwAApBQAMARoAADoGAAw7gcAAOkYADDwBwAA6xgAIPQHAACYFAAwBGgAAN8YADDuBwAA4BgAMPAHAADiGAAg9AcAAPoTADAEaAAA1hgAMO4HAADXGAAw8AcAANkYACD0BwAA-hMAMARoAADNGAAw7gcAAM4YADDwBwAA0BgAIPQHAACgDQAwBGgAAMQYADDuBwAAxRgAMPAHAADHGAAg9AcAAKANADADaAAAvxgAIO4HAADAGAAg9AcAAJUKACAEaAAAthgAMO4HAAC3GAAw8AcAALkYACD0BwAAoA8AMARoAACtGAAw7gcAAK4YADDwBwAAsBgAIPQHAACgDwAwA2gAAKgYACDuBwAAqRgAIPQHAAC3CAAgBGgAAJwYADDuBwAAnRgAMPAHAACfGAAg9AcAAKAYADAEaAAAkxgAMO4HAACUGAAw8AcAAJYYACD0BwAA8gwAMARoAACKGAAw7gcAAIsYADDwBwAAjRgAIPQHAADyDAAwBGgAAIEYADDuBwAAghgAMPAHAACEGAAg9AcAAIATADAEaAAA-BcAMO4HAAD5FwAw8AcAAPsXACD0BwAAgBMAMARoAADvFwAw7gcAAPAXADDwBwAA8hcAIPQHAACMEwAwBGgAAOYXADDuBwAA5xcAMPAHAADpFwAg9AcAAIkSADAAAAIzAADJDgAgoAYAAN4MACABFwAAyQ4AIAAAAAAABWgAANMZACBpAADWGQAg7gcAANQZACDvBwAA1RkAIPQHAAAoACADaAAA0xkAIO4HAADUGQAg9AcAACgAIAAAAAQHAADkEQAgRAAAyQ4AIEYAAL4ZACBHAAC0GQAgABcHAADkEQAgPQAAyQ4AID4AAMkOACBAAACcFwAgjAYAAN4MACDBBgAA3gwAIOYGAADeDAAgqAcAAN4MACCrBwAA3gwAIK0HAADeDAAgrgcAAN4MACCvBwAA3gwAILAHAADeDAAgsgcAAN4MACC0BwAA3gwAILUHAADeDAAgtgcAAN4MACC3BwAA3gwAILgHAADeDAAguQcAAN4MACC6BwAA3gwAILsHAADeDAAgvQcAAN4MACANBwAA5BEAIAkAAMIZACAKAADQGQAgCwAAnRcAIA4AAMkZACAPAADKGQAgEAAAwRkAIBkAAMUZACAbAADEGQAgLAAAzhkAIC0AAM8ZACCNBgAA3gwAIPgGAADeDAAgCgMAAMkOACAHAADkEQAgCQAAwhkAIA0AAOcQACARAACVFwAgIgAAoBcAICQAAJcXACBMAADWEQAgTQAAmRcAIIsGAADeDAAgFggAANEZACAMAADlEAAgDQAA5xAAIBEAAJUXACAcAADpEAAgJQAA5hAAICcAAOgQACAqAACdFwAgLgAAjhcAIC8AAI8XACAwAACRFwAgMQAAkxcAIDIAAJQXACA0AADWEQAgNQAAlxcAIDYAAJgXACA3AACZFwAgOAAAoBcAIDkAAJIXACDmBgAA3gwAIPcGAADeDAAgqwcAAN4MACAFFAAA1hEAII0GAADeDAAg9AYAAN4MACD3BgAA3gwAIPgGAADeDAAgBQwAAOUQACANAADnEAAgHAAA6RAAICUAAOYQACAnAADoEAAgCgMAAMkOACAHAADkEQAgCQAAwhkAIA0AAOcQACATAACYFwAgGgAAxREAIBwAAOkQACAiAACgFwAgiwYAAN4MACCNBgAA3gwAIAQHAADkEQAgCQAAwhkAIBsAAMQZACAcAADpEAAgBRQAAMURACCNBgAA3gwAIPQGAADeDAAg9wYAAN4MACD4BgAA3gwAIAgHAADkEQAgCQAAwhkAIA4AAMkZACAQAADBGQAgIwAAmBcAII0GAADeDAAguQYAAN4MACC8BgAA3gwAIAsHAADkEQAgCQAAwhkAIA0AAOcQACARAACVFwAgGwAAxBkAICQAAJcXACAmAADLGQAgjQYAAN4MACDmBgAA3gwAIOcGAADeDAAg6QYAAN4MACAIBwAA5BEAIAkAAMIZACAKAADQGQAgDQAA5xAAIBEAAJUXACDmBgAA3gwAIPIGAADeDAAg-AYAAN4MACAFBwAA5BEAIAkAAMIZACAlAADmEAAgjQYAAN4MACDmBgAA3gwAIAgHAADkEQAgCQAAwhkAIAsAAJ0XACAbAADEGQAgjAYAAN4MACCNBgAA3gwAIOYGAADeDAAg6AYAAN4MACADBwAA5BEAICoAAJ0XACDgBgAA3gwAIAASBwAA5BEAIAkAAMIZACAQAADBGQAgKQAAwBkAII0GAADeDAAgxgYAAN4MACDHBgAA3gwAIMgGAADeDAAgyQYAAN4MACDKBgAA3gwAIMsGAADeDAAgzAYAAN4MACDNBgAA3gwAIM4GAADeDAAgzwYAAN4MACDQBgAA3gwAINEGAADeDAAg0gYAAN4MACAJBwAA5BEAIAkAAMIZACANAADnEAAgDwAAkRcAIOYGAADeDAAg8AYAAN4MACDxBgAA3gwAIPIGAADeDAAg8wYAAN4MACAFBwAA5BEAIDoAANIZACCMBgAA3gwAIOYGAADeDAAgqwcAAN4MACAAFgcAALUOACAJAACyDgAgCgAAsw4AIAsAAKwOACAOAACxDgAgDwAArw4AIBAAAMIPACAZAACwDgAgGwAAtA4AIC0AAK4OACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbMGAQAAAAHoBgEAAAAB-AYBAAAAAb8HQAAAAAECAAAAKAAgaAAA0xkAIAMAAAAmACBoAADTGQAgaQAA1xkAIBgAAAAmACAHAACCDgAgCQAA_w0AIAoAAIAOACALAAD5DQAgDgAA_g0AIA8AAPwNACAQAADADwAgGQAA_Q0AIBsAAIEOACAtAAD7DQAgYQAA1xkAIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGvBgEA4gwAIbAGAQDiDAAhsQYBAOIMACGzBgEA4gwAIegGAQDiDAAh-AYBAOMMACG_B0AA5AwAIRYHAACCDgAgCQAA_w0AIAoAAIAOACALAAD5DQAgDgAA_g0AIA8AAPwNACAQAADADwAgGQAA_Q0AIBsAAIEOACAtAAD7DQAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsAYBAOIMACGxBgEA4gwAIbMGAQDiDAAh6AYBAOIMACH4BgEA4wwAIb8HQADkDAAhB4cGAQAAAAGPBkAAAAABkAZAAAAAAcgHQAAAAAHUBwEAAAAB1QcBAAAAAdYHAQAAAAEMhwYBAAAAAY8GQAAAAAGQBkAAAAABywcBAAAAAcwHAQAAAAHNBwEAAAABzgcBAAAAAc8HAQAAAAHQB0AAAAAB0QdAAAAAAdIHAQAAAAHTBwEAAAABBocGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAGXBwAAAOMHAuMHAQAAAAEJhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABB4cGAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAdwGAQAAAAEahwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAAvQcCwQZAAAAAAeYGAQAAAAGoBwEAAAABqgcBAAAAAasHAQAAAAGtBwAAAK0HA64HAQAAAAGvBwAAANUGA7AHEAAAAAGxBwEAAAABsgcCAAAAAbMHAAAA_AYCtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABugeAAAAAAbsHQAAAAAG9BwEAAAABGocGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAL0HAsEGQAAAAAHmBgEAAAABqQcBAAAAAaoHAQAAAAGrBwEAAAABrQcAAACtBwOuBwEAAAABrwcAAADVBgOwBxAAAAABsQcBAAAAAbIHAgAAAAGzBwAAAPwGArQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAboHgAAAAAG7B0AAAAABvQcBAAAAAQ2HBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAG9BgEAAAABvwYAAAC_BgLABgEAAAABwQZAAAAAAcIGQAAAAAHDBgEAAAABxAYBAAAAAQ2HBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAZwGAQAAAAGxBgEAAAABvQYBAAAAAb8GAAAAvwYCwAYBAAAAAcEGQAAAAAHCBkAAAAABwwYBAAAAAQuHBgEAAAABjwZAAAAAAZAGQAAAAAGzBgEAAAABvQYBAAAAAb8GAAAA3gYCwAYBAAAAAcEGQAAAAAHCBkAAAAABwwYBAAAAAcQGAQAAAAELhwYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb0GAQAAAAG_BgAAAN4GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHeBgEAAAABBYcGAQAAAAGPBkAAAAABkAZAAAAAAccHAQAAAAHIB0AAAAABD4cGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCnQcBAAAAAZ4HAQAAAAGgBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABD4cGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABmwcAAACbBwKdBwEAAAABngcBAAAAAZ8HAQAAAAGgBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABCYcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAKcHAsEGQAAAAAGlBwAAAKUHAqcHAQAAAAGoBwEAAAABCYcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_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_hYAIDUAAP8WACA2AACAFwAgNwAAgRcAIDsAAPIWACBAAACGFwAgQQAA_RYAIEIAAIQXACBDAACFFwAgSAAAiRcAIEkAAIoXACBKAACLFwAgSwAAjBcAIIcGAQAAAAGPBkAAAAABkAZAAAAAAbsGAAAArQcD4AYBAAAAAeYGAQAAAAGrBwEAAAABrgcBAAAAAQIAAACDBQAgaAAA-RkAIAMAAAAWACBoAAD5GQAgaQAA_RkAICQAAAAWACAGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACBAAADjEgAgQQAA2hIAIEIAAOESACBDAADiEgAgSAAA5hIAIEkAAOcSACBKAADoEgAgSwAA6RIAIGEAAP0ZACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAISIGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACBAAADjEgAgQQAA2hIAIEIAAOESACBDAADiEgAgSAAA5hIAIEkAAOcSACBKAADoEgAgSwAA6RIAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbsGAAC0Eq0HI-AGAQDiDAAh5gYBAOMMACGrBwEA4wwAIa4HAQDjDAAhCAcAAKUXACCHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAAB5gYBAAAAAasHAQAAAAG-BwEAAAABAgAAABQAIGgAAP4ZACADAAAAEgAgaAAA_hkAIGkAAIIaACAKAAAAEgAgBwAApBcAIGEAAIIaACCHBgEA4gwAIYwGAQDjDAAhjwZAAOQMACGQBkAA5AwAIeYGAQDjDAAhqwcBAOMMACG-BwEA4gwAIQgHAACkFwAghwYBAOIMACGMBgEA4wwAIY8GQADkDAAhkAZAAOQMACHmBgEA4wwAIasHAQDjDAAhvgcBAOIMACEiBgAA-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA8AAD1FgAgQAAAhhcAIEEAAP0WACBCAACEFwAgQwAAhRcAIEgAAIkXACBJAACKFwAgSgAAixcAIEsAAIwXACCHBgEAAAABjwZAAAAAAZAGQAAAAAG7BgAAAK0HA-AGAQAAAAHmBgEAAAABqwcBAAAAAa4HAQAAAAECAAAAgwUAIGgAAIMaACADAAAAFgAgaAAAgxoAIGkAAIcaACAkAAAAFgAgBgAA1RIAIAwAAOQSACANAADYEgAgEQAA2RIAIBwAAOASACAlAADTEgAgJwAA3xIAICoAAOUSACAuAADQEgAgLwAA0RIAIDAAANQSACAxAADWEgAgMgAA1xIAIDQAANsSACA1AADcEgAgNgAA3RIAIDcAAN4SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACBhAACHGgAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhuwYAALQSrQcj4AYBAOIMACHmBgEA4wwAIasHAQDjDAAhrgcBAOMMACEiBgAA1RIAIAwAAOQSACANAADYEgAgEQAA2RIAIBwAAOASACAlAADTEgAgJwAA3xIAICoAAOUSACAuAADQEgAgLwAA0RIAIDAAANQSACAxAADWEgAgMgAA1xIAIDQAANsSACA1AADcEgAgNgAA3RIAIDcAAN4SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAIQqHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABuAYBAAAAAeYGAQAAAAHwBgEAAAAB8QZAAAAAAfIGCAAAAAHzBggAAAABIgYAAPgWACAMAACHFwAgDQAA-xYAIBEAAPwWACAcAACDFwAgJQAA9hYAICcAAIIXACAqAACIFwAgLgAA8xYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA7AADyFgAgPAAA9RYAIEAAAIYXACBBAAD9FgAgQgAAhBcAIEMAAIUXACBIAACJFwAgSQAAihcAIEoAAIsXACBLAACMFwAghwYBAAAAAY8GQAAAAAGQBkAAAAABuwYAAACtBwPgBgEAAAAB5gYBAAAAAasHAQAAAAGuBwEAAAABAgAAAIMFACBoAACJGgAgAwAAABYAIGgAAIkaACBpAACNGgAgJAAAABYAIAYAANUSACAMAADkEgAgDQAA2BIAIBEAANkSACAcAADgEgAgJQAA0xIAICcAAN8SACAqAADlEgAgLgAA0BIAIDAAANQSACAxAADWEgAgMgAA1xIAIDQAANsSACA1AADcEgAgNgAA3RIAIDcAAN4SACA7AADPEgAgPAAA0hIAIEAAAOMSACBBAADaEgAgQgAA4RIAIEMAAOISACBIAADmEgAgSQAA5xIAIEoAAOgSACBLAADpEgAgYQAAjRoAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbsGAAC0Eq0HI-AGAQDiDAAh5gYBAOMMACGrBwEA4wwAIa4HAQDjDAAhIgYAANUSACAMAADkEgAgDQAA2BIAIBEAANkSACAcAADgEgAgJQAA0xIAICcAAN8SACAqAADlEgAgLgAA0BIAIDAAANQSACAxAADWEgAgMgAA1xIAIDQAANsSACA1AADcEgAgNgAA3RIAIDcAAN4SACA7AADPEgAgPAAA0hIAIEAAAOMSACBBAADaEgAgQgAA4RIAIEMAAOISACBIAADmEgAgSQAA5xIAIEoAAOgSACBLAADpEgAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhuwYAALQSrQcj4AYBAOIMACHmBgEA4wwAIasHAQDjDAAhrgcBAOMMACEGhwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAeAGAQAAAAHmBgEAAAABCYcGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB8gYCAAAAAfgGAQAAAAHABwEAAAABwQcBAAAAAQmHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAeYGAQAAAAHnBgIAAAAB6AYBAAAAAekGAQAAAAEJhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGMBgEAAAABjgYBAAAAAY8GQAAAAAGQBkAAAAABB4cGAQAAAAGLBgEAAAABjAYBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAdwGAQAAAAELhwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbMGAQAAAAHoBgEAAAAB-AYBAAAAAb8HQAAAAAEHhwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAQ2HBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABnAYBAAAAAbEGAQAAAAG9BgEAAAABvwYAAAC_BgLABgEAAAABwQZAAAAAAcIGQAAAAAHDBgEAAAABxAYBAAAAAQqHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbEGAQAAAAG4BgEAAAABuQYBAAAAAbsGAAAAuwYCvAZAAAAAAQqHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQYBAAAAAbYGAQAAAAG3BkAAAAABE4cGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAGxBgEAAAABxQYBAAAAAcYGCAAAAAHHBggAAAAByAYIAAAAAckGCAAAAAHKBggAAAABywYIAAAAAcwGCAAAAAHNBggAAAABzgYIAAAAAc8GCAAAAAHQBggAAAAB0QYIAAAAAdIGCAAAAAEJhwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAdgGAQAAAAHoBgEAAAABigcgAAAAAZIHEAAAAAGTBxAAAAABFocGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAGzBgEAAAABvwYAAACQBwLXBhAAAAAB2AYBAAAAAdkGAgAAAAHoBgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHAQAAAAGBBwEAAAABggeAAAAAAYMHQAAAAAGMBwEAAAABjgcAAACOBwKQBwEAAAABkQdAAAAAAQqHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAADtBgLgBgEAAAAB5gYBAAAAAegGAQAAAAHqBgEAAAAB6wYBAAAAAQqHBgEAAAABjAYBAAAAAY8GQAAAAAGQBkAAAAABxQYBAAAAAeAGAQAAAAHmBgEAAAAB7QYBAAAAAe4GAQAAAAHvBgEAAAABD4cGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAGzBgEAAAABvwYAAACdBwLBBkAAAAABxAYBAAAAAZsHAAAAmwcCnQcBAAAAAZ4HAQAAAAGfBwEAAAABoQcBAAAAAaIHAQAAAAGjB0AAAAABIgwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_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_xAAIGEAALUaACCHBgEA4gwAIYwGAQDiDAAhjQYBAOIMACGPBkAA5AwAIZAGQADkDAAhuAYBAOIMACHmBgEA4wwAIfAGAQDjDAAh8QZAAPoMACHyBggAkw0AIfMGCACTDQAhDgcAAIARACAJAACBEQAgDQAA_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_BgAAAL0HAsEGQAAAAAHmBgEAAAABqAcBAAAAAakHAQAAAAGqBwEAAAABqwcBAAAAAa0HAAAArQcDrgcBAAAAAa8HAAAA1QYDsAcQAAAAAbEHAQAAAAGyBwIAAAABswcAAAD8BgK0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAG6B4AAAAABuwdAAAAAAb0HAQAAAAENhwYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAZwGAQAAAAGxBgEAAAABvQYBAAAAAb8GAAAAvwYCwAYBAAAAAcEGQAAAAAHCBkAAAAABwwYBAAAAAcQGAQAAAAEKhwYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAa8GAQAAAAGxBgEAAAABuAYBAAAAAbkGAQAAAAG7BgAAALsGArwGQAAAAAEKhwYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BgEAAAABtwZAAAAAAROHBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAcUGAQAAAAHGBggAAAABxwYIAAAAAcgGCAAAAAHJBggAAAABygYIAAAAAcsGCAAAAAHMBggAAAABzQYIAAAAAc4GCAAAAAHPBggAAAAB0AYIAAAAAdEGCAAAAAHSBggAAAABCYcGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHYBgEAAAAB6AYBAAAAAYoHIAAAAAGSBxAAAAABkwcQAAAAARaHBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb8GAAAAkAcC1wYQAAAAAdgGAQAAAAHZBgIAAAAB6AYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABjAcBAAAAAY4HAAAAjgcCkAcBAAAAAZEHQAAAAAERhwYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAAD8BgLVBgAAANUGAtcGEAAAAAHYBgEAAAAB2QYCAAAAAfoGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAcBAAAAAYEHAQAAAAGCB4AAAAABgwdAAAAAAQuHBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAANcGAtMGAQAAAAHVBgAAANUGAtcGEAAAAAHYBgEAAAAB2QYCAAAAAdoGQAAAAAHbBkAAAAABCocGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAG_BgAAAO0GAuAGAQAAAAHmBgEAAAAB6AYBAAAAAeoGAQAAAAHrBgEAAAABCocGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHFBgEAAAAB4AYBAAAAAeYGAQAAAAHtBgEAAAAB7gYBAAAAAe8GAQAAAAEHhwYBAAAAAY8GQAAAAAGQBkAAAAABuAYBAAAAAbkGAQAAAAGYBwEAAAABmQcAAACXBwIJhwYBAAAAAY8GQAAAAAGQBkAAAAABvwYAAACnBwLBBkAAAAABnwcBAAAAAaUHAAAApQcCpwcBAAAAAagHAQAAAAEPhwYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAbMGAQAAAAG_BgAAAJ0HAsEGQAAAAAHEBgEAAAABmwcAAACbBwKeBwEAAAABnwcBAAAAAaAHAQAAAAGhBwEAAAABogcBAAAAAaMHQAAAAAEPhwYBAAAAAY8GQAAAAAGQBkAAAAABsQYBAAAAAbMGAQAAAAG_BgAAAJ0HAsEGQAAAAAHEBgEAAAABmwcAAACbBwKdBwEAAAABnwcBAAAAAaAHAQAAAAGhBwEAAAABogcBAAAAAaMHQAAAAAEiBgAA-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA7AADyFgAgPAAA9RYAIEAAAIYXACBCAACEFwAgQwAAhRcAIEgAAIkXACBJAACKFwAgSgAAixcAIEsAAIwXACCHBgEAAAABjwZAAAAAAZAGQAAAAAG7BgAAAK0HA-AGAQAAAAHmBgEAAAABqwcBAAAAAa4HAQAAAAECAAAAgwUAIGgAANUaACAiBAAAmxkAIAUAAJwZACAGAACdGQAgEAAAnhkAIBkAAJ8ZACA0AACiGQAgQQAAoBkAIE8AAKMZACBQAACkGQAgUQAApRkAIFIAAKYZACBTAACnGQAgVAAAqBkAIFUAAKkZACBWAACqGQAgVwAAqxkAIFgAAKwZACBZAACtGQAgWgAArhkAIIcGAQAAAAGLBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAABlwcBAAAAAdcHAQAAAAHYByAAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwEAAAAB3wcBAAAAAQIAAACAAwAgaAAA1xoAICIEAACbGQAgBQAAnBkAIAYAAJ0ZACAQAACeGQAgGQAAnxkAIDQAAKIZACBOAAChGQAgTwAAoxkAIFAAAKQZACBRAAClGQAgUgAAphkAIFMAAKcZACBUAACoGQAgVQAAqRkAIFYAAKoZACBXAACrGQAgWAAArBkAIFkAAK0ZACBaAACuGQAghwYBAAAAAYsGAQAAAAGPBkAAAAABkAZAAAAAAeAGAQAAAAGXBwEAAAAB1wcBAAAAAdgHIAAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAd4HAQAAAAHfBwEAAAABAgAAAIADACBoAADZGgAgC4cGAQAAAAGMBgEAAAABjwZAAAAAAZAGQAAAAAG_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_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-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA7AADyFgAgPAAA9RYAIEAAAIYXACBBAAD9FgAgQgAAhBcAIEMAAIUXACBJAACKFwAgSgAAixcAIEsAAIwXACCHBgEAAAABjwZAAAAAAZAGQAAAAAG7BgAAAK0HA-AGAQAAAAHmBgEAAAABqwcBAAAAAa4HAQAAAAECAAAAgwUAIGgAAPYaACADhwYBAAAAAY8GQAAAAAGXBwAAAJcHAgOHBgEAAAABjgYBAAAAAZUHQAAAAAEDAAAAUQAgaAAA9BoAIGkAAPwaACAkAAAAUQAgBAAA0hcAIAUAANMXACAGAADUFwAgEAAA1RcAIBkAANYXACA0AADZFwAgQQAA1xcAIE4AANgXACBPAADaFwAgUAAA2xcAIFEAANwXACBSAADdFwAgUwAA3hcAIFQAAN8XACBVAADgFwAgVgAA4RcAIFcAAOIXACBYAADjFwAgWgAA5RcAIGEAAPwaACCHBgEA4gwAIYsGAQDjDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAhlwcBAOIMACHXBwEA4gwAIdgHIADEDgAh2QcBAOMMACHaBwEA4wwAIdsHAQDjDAAh3AcBAOMMACHdBwEA4wwAId4HAQDjDAAh3wcBAOIMACEiBAAA0hcAIAUAANMXACAGAADUFwAgEAAA1RcAIBkAANYXACA0AADZFwAgQQAA1xcAIE4AANgXACBPAADaFwAgUAAA2xcAIFEAANwXACBSAADdFwAgUwAA3hcAIFQAAN8XACBVAADgFwAgVgAA4RcAIFcAAOIXACBYAADjFwAgWgAA5RcAIIcGAQDiDAAhiwYBAOMMACGPBkAA5AwAIZAGQADkDAAh4AYBAOIMACGXBwEA4gwAIdcHAQDiDAAh2AcgAMQOACHZBwEA4wwAIdoHAQDjDAAh2wcBAOMMACHcBwEA4wwAId0HAQDjDAAh3gcBAOMMACHfBwEA4gwAIQMAAAAWACBoAAD2GgAgaQAA_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-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA7AADyFgAgPAAA9RYAIEAAAIYXACBBAAD9FgAgQwAAhRcAIEgAAIkXACBJAACKFwAgSgAAixcAIEsAAIwXACCHBgEAAAABjwZAAAAAAZAGQAAAAAG7BgAAAK0HA-AGAQAAAAHmBgEAAAABqwcBAAAAAa4HAQAAAAECAAAAgwUAIGgAAJQbACADAAAAFgAgaAAAlBsAIGkAAJgbACAkAAAAFgAgBgAA1RIAIAwAAOQSACANAADYEgAgEQAA2RIAIBwAAOASACAlAADTEgAgJwAA3xIAICoAAOUSACAuAADQEgAgLwAA0RIAIDAAANQSACAxAADWEgAgMgAA1xIAIDQAANsSACA1AADcEgAgNgAA3RIAIDcAAN4SACA7AADPEgAgPAAA0hIAIEAAAOMSACBBAADaEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACBhAACYGwAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhuwYAALQSrQcj4AYBAOIMACHmBgEA4wwAIasHAQDjDAAhrgcBAOMMACEiBgAA1RIAIAwAAOQSACANAADYEgAgEQAA2RIAIBwAAOASACAlAADTEgAgJwAA3xIAICoAAOUSACAuAADQEgAgLwAA0RIAIDAAANQSACAxAADWEgAgMgAA1xIAIDQAANsSACA1AADcEgAgNgAA3RIAIDcAAN4SACA7AADPEgAgPAAA0hIAIEAAAOMSACBBAADaEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAISIGAAD4FgAgDAAAhxcAIA0AAPsWACARAAD8FgAgHAAAgxcAICUAAPYWACAnAACCFwAgKgAAiBcAIC4AAPMWACAvAAD0FgAgMAAA9xYAIDEAAPkWACAyAAD6FgAgNAAA_hYAIDUAAP8WACA2AACAFwAgNwAAgRcAIDsAAPIWACA8AAD1FgAgQAAAhhcAIEEAAP0WACBCAACEFwAgSAAAiRcAIEkAAIoXACBKAACLFwAgSwAAjBcAIIcGAQAAAAGPBkAAAAABkAZAAAAAAbsGAAAArQcD4AYBAAAAAeYGAQAAAAGrBwEAAAABrgcBAAAAAQIAAACDBQAgaAAAmRsAIAMAAAAWACBoAACZGwAgaQAAnRsAICQAAAAWACAGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgSAAA5hIAIEkAAOcSACBKAADoEgAgSwAA6RIAIGEAAJ0bACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAISIGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgSAAA5hIAIEkAAOcSACBKAADoEgAgSwAA6RIAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbsGAAC0Eq0HI-AGAQDiDAAh5gYBAOMMACGrBwEA4wwAIa4HAQDjDAAhDYcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABnAYBAAAAAbEGAQAAAAG9BgEAAAABvwYAAAC_BgLABgEAAAABwQZAAAAAAcIGQAAAAAHEBgEAAAABC4cGAQAAAAGPBkAAAAABkAZAAAAAAbMGAQAAAAG9BgEAAAABvwYAAADeBgLABgEAAAABwQZAAAAAAcIGQAAAAAHEBgEAAAAB3gYBAAAAARkIAACqFwAgDAAA7BYAIA0AAOQWACARAADlFgAgHAAA6xYAICUAAOEWACAnAADqFgAgKgAA7RYAIC8AAN8WACAwAADgFgAgMQAA4hYAIDIAAOMWACA0AADmFgAgNQAA5xYAIDYAAOgWACA3AADpFgAgOAAA7hYAIDkAAO8WACCHBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB9wYBAAAAAasHAQAAAAG-BwEAAAABAgAAABoAIGgAAKAbACAiBgAA-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAvAAD0FgAgMAAA9xYAIDEAAPkWACAyAAD6FgAgNAAA_hYAIDUAAP8WACA2AACAFwAgNwAAgRcAIDsAAPIWACA8AAD1FgAgQAAAhhcAIEEAAP0WACBCAACEFwAgQwAAhRcAIEgAAIkXACBJAACKFwAgSgAAixcAIEsAAIwXACCHBgEAAAABjwZAAAAAAZAGQAAAAAG7BgAAAK0HA-AGAQAAAAHmBgEAAAABqwcBAAAAAa4HAQAAAAECAAAAgwUAIGgAAKIbACAZCAAAqhcAIAwAAOwWACANAADkFgAgEQAA5RYAIBwAAOsWACAlAADhFgAgJwAA6hYAICoAAO0WACAuAADeFgAgLwAA3xYAIDEAAOIWACAyAADjFgAgNAAA5hYAIDUAAOcWACA2AADoFgAgNwAA6RYAIDgAAO4WACA5AADvFgAghwYBAAAAAY8GQAAAAAGQBkAAAAAB5gYBAAAAAfcGAQAAAAGrBwEAAAABvgcBAAAAAQIAAAAaACBoAACkGwAgIgYAAPgWACAMAACHFwAgDQAA-xYAIBEAAPwWACAcAACDFwAgJQAA9hYAICcAAIIXACAqAACIFwAgLgAA8xYAIC8AAPQWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA7AADyFgAgPAAA9RYAIEAAAIYXACBBAAD9FgAgQgAAhBcAIEMAAIUXACBIAACJFwAgSQAAihcAIEoAAIsXACBLAACMFwAghwYBAAAAAY8GQAAAAAGQBkAAAAABuwYAAACtBwPgBgEAAAAB5gYBAAAAAasHAQAAAAGuBwEAAAABAgAAAIMFACBoAACmGwAgC4cGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbEGAQAAAAGzBgEAAAAB6AYBAAAAAfgGAQAAAAG_B0AAAAABB4cGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbEGAQAAAAEDAAAAGAAgaAAApBsAIGkAAKwbACAbAAAAGAAgCAAAqRcAIAwAALMVACANAACrFQAgEQAArBUAIBwAALIVACAlAACoFQAgJwAAsRUAICoAALQVACAuAAClFQAgLwAAphUAIDEAAKkVACAyAACqFQAgNAAArRUAIDUAAK4VACA2AACvFQAgNwAAsBUAIDgAALUVACA5AAC2FQAgYQAArBsAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIeYGAQDjDAAh9wYBAOMMACGrBwEA4wwAIb4HAQDiDAAhGQgAAKkXACAMAACzFQAgDQAAqxUAIBEAAKwVACAcAACyFQAgJQAAqBUAICcAALEVACAqAAC0FQAgLgAApRUAIC8AAKYVACAxAACpFQAgMgAAqhUAIDQAAK0VACA1AACuFQAgNgAArxUAIDcAALAVACA4AAC1FQAgOQAAthUAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIeYGAQDjDAAh9wYBAOMMACGrBwEA4wwAIb4HAQDiDAAhAwAAABYAIGgAAKYbACBpAACvGwAgJAAAABYAIAYAANUSACAMAADkEgAgDQAA2BIAIBEAANkSACAcAADgEgAgJQAA0xIAICcAAN8SACAqAADlEgAgLgAA0BIAIC8AANESACAxAADWEgAgMgAA1xIAIDQAANsSACA1AADcEgAgNgAA3RIAIDcAAN4SACA7AADPEgAgPAAA0hIAIEAAAOMSACBBAADaEgAgQgAA4RIAIEMAAOISACBIAADmEgAgSQAA5xIAIEoAAOgSACBLAADpEgAgYQAArxsAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbsGAAC0Eq0HI-AGAQDiDAAh5gYBAOMMACGrBwEA4wwAIa4HAQDjDAAhIgYAANUSACAMAADkEgAgDQAA2BIAIBEAANkSACAcAADgEgAgJQAA0xIAICcAAN8SACAqAADlEgAgLgAA0BIAIC8AANESACAxAADWEgAgMgAA1xIAIDQAANsSACA1AADcEgAgNgAA3RIAIDcAAN4SACA7AADPEgAgPAAA0hIAIEAAAOMSACBBAADaEgAgQgAA4RIAIEMAAOISACBIAADmEgAgSQAA5xIAIEoAAOgSACBLAADpEgAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhuwYAALQSrQcj4AYBAOIMACHmBgEA4wwAIasHAQDjDAAhrgcBAOMMACEJhwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB8gYCAAAAAcAHAQAAAAHBBwEAAAABC4cGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABswYBAAAAAegGAQAAAAG_B0AAAAABAwAAABgAIGgAAKAbACBpAAC0GwAgGwAAABgAIAgAAKkXACAMAACzFQAgDQAAqxUAIBEAAKwVACAcAACyFQAgJQAAqBUAICcAALEVACAqAAC0FQAgLwAAphUAIDAAAKcVACAxAACpFQAgMgAAqhUAIDQAAK0VACA1AACuFQAgNgAArxUAIDcAALAVACA4AAC1FQAgOQAAthUAIGEAALQbACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACHmBgEA4wwAIfcGAQDjDAAhqwcBAOMMACG-BwEA4gwAIRkIAACpFwAgDAAAsxUAIA0AAKsVACARAACsFQAgHAAAshUAICUAAKgVACAnAACxFQAgKgAAtBUAIC8AAKYVACAwAACnFQAgMQAAqRUAIDIAAKoVACA0AACtFQAgNQAArhUAIDYAAK8VACA3AACwFQAgOAAAtRUAIDkAALYVACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACHmBgEA4wwAIfcGAQDjDAAhqwcBAOMMACG-BwEA4gwAIQMAAAAWACBoAACiGwAgaQAAtxsAICQAAAAWACAGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC8AANESACAwAADUEgAgMQAA1hIAIDIAANcSACA0AADbEgAgNQAA3BIAIDYAAN0SACA3AADeEgAgOwAAzxIAIDwAANISACBAAADjEgAgQQAA2hIAIEIAAOESACBDAADiEgAgSAAA5hIAIEkAAOcSACBKAADoEgAgSwAA6RIAIGEAALcbACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAISIGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC8AANESACAwAADUEgAgMQAA1hIAIDIAANcSACA0AADbEgAgNQAA3BIAIDYAAN0SACA3AADeEgAgOwAAzxIAIDwAANISACBAAADjEgAgQQAA2hIAIEIAAOESACBDAADiEgAgSAAA5hIAIEkAAOcSACBKAADoEgAgSwAA6RIAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbsGAAC0Eq0HI-AGAQDiDAAh5gYBAOMMACGrBwEA4wwAIa4HAQDjDAAhCQ0AAOIQACAcAADkEAAgJQAA4RAAICcAAOMQACCHBgEAAAABjAYBAAAAAeAGAQAAAAHhBkAAAAAB4gZAAAAAAQIAAACfCAAgaAAAuBsAIAMAAAAvACBoAAC4GwAgaQAAvBsAIAsAAAAvACANAADcDwAgHAAA3g8AICUAANsPACAnAADdDwAgYQAAvBsAIIcGAQDiDAAhjAYBAOIMACHgBgEA4gwAIeEGQADkDAAh4gZAAOQMACEJDQAA3A8AIBwAAN4PACAlAADbDwAgJwAA3Q8AIIcGAQDiDAAhjAYBAOIMACHgBgEA4gwAIeEGQADkDAAh4gZAAOQMACEJDAAA4BAAIA0AAOIQACAcAADkEAAgJwAA4xAAIIcGAQAAAAGMBgEAAAAB4AYBAAAAAeEGQAAAAAHiBkAAAAABAgAAAJ8IACBoAAC9GwAgAwAAAC8AIGgAAL0bACBpAADBGwAgCwAAAC8AIAwAANoPACANAADcDwAgHAAA3g8AICcAAN0PACBhAADBGwAghwYBAOIMACGMBgEA4gwAIeAGAQDiDAAh4QZAAOQMACHiBkAA5AwAIQkMAADaDwAgDQAA3A8AIBwAAN4PACAnAADdDwAghwYBAOIMACGMBgEA4gwAIeAGAQDiDAAh4QZAAOQMACHiBkAA5AwAIRkIAACqFwAgDQAA5BYAIBEAAOUWACAcAADrFgAgJQAA4RYAICcAAOoWACAqAADtFgAgLgAA3hYAIC8AAN8WACAwAADgFgAgMQAA4hYAIDIAAOMWACA0AADmFgAgNQAA5xYAIDYAAOgWACA3AADpFgAgOAAA7hYAIDkAAO8WACCHBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB9wYBAAAAAasHAQAAAAG-BwEAAAABAgAAABoAIGgAAMIbACAiBgAA-BYAIA0AAPsWACARAAD8FgAgHAAAgxcAICUAAPYWACAnAACCFwAgKgAAiBcAIC4AAPMWACAvAAD0FgAgMAAA9xYAIDEAAPkWACAyAAD6FgAgNAAA_hYAIDUAAP8WACA2AACAFwAgNwAAgRcAIDsAAPIWACA8AAD1FgAgQAAAhhcAIEEAAP0WACBCAACEFwAgQwAAhRcAIEgAAIkXACBJAACKFwAgSgAAixcAIEsAAIwXACCHBgEAAAABjwZAAAAAAZAGQAAAAAG7BgAAAK0HA-AGAQAAAAHmBgEAAAABqwcBAAAAAa4HAQAAAAECAAAAgwUAIGgAAMQbACAWBwAAtQ4AIAkAALIOACAKAACzDgAgDgAAsQ4AIA8AAK8OACAQAADCDwAgGQAAsA4AIBsAALQOACAsAACtDgAgLQAArg4AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABswYBAAAAAegGAQAAAAH4BgEAAAABvwdAAAAAAQIAAAAoACBoAADGGwAgAwAAACYAIGgAAMYbACBpAADKGwAgGAAAACYAIAcAAIIOACAJAAD_DQAgCgAAgA4AIA4AAP4NACAPAAD8DQAgEAAAwA8AIBkAAP0NACAbAACBDgAgLAAA-g0AIC0AAPsNACBhAADKGwAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsAYBAOIMACGxBgEA4gwAIbMGAQDiDAAh6AYBAOIMACH4BgEA4wwAIb8HQADkDAAhFgcAAIIOACAJAAD_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-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA7AADyFgAgPAAA9RYAIEAAAIYXACBBAAD9FgAgQgAAhBcAIEMAAIUXACBIAACJFwAgSQAAihcAIEoAAIsXACBLAACMFwAghwYBAAAAAY8GQAAAAAGQBkAAAAABuwYAAACtBwPgBgEAAAAB5gYBAAAAAasHAQAAAAGuBwEAAAABAgAAAIMFACBoAADXGwAgC4cGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABsAYBAAAAAbEGAQAAAAGzBgEAAAAB6AYBAAAAAfgGAQAAAAG_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-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDcAAIEXACA7AADyFgAgPAAA9RYAIEAAAIYXACBBAAD9FgAgQgAAhBcAIEMAAIUXACBIAACJFwAgSQAAihcAIEoAAIsXACBLAACMFwAghwYBAAAAAY8GQAAAAAGQBkAAAAABuwYAAACtBwPgBgEAAAAB5gYBAAAAAasHAQAAAAGuBwEAAAABAgAAAIMFACBoAADpGwAgFocGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABswYBAAAAAb8GAAAAkAcC1wYQAAAAAdgGAQAAAAHZBgIAAAAB6AYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABjgcAAACOBwKQBwEAAAABkQdAAAAAAQMAAAAYACBoAADnGwAgaQAA7hsAIBsAAAAYACAIAACpFwAgDAAAsxUAIA0AAKsVACARAACsFQAgHAAAshUAICUAAKgVACAqAAC0FQAgLgAApRUAIC8AAKYVACAwAACnFQAgMQAAqRUAIDIAAKoVACA0AACtFQAgNQAArhUAIDYAAK8VACA3AACwFQAgOAAAtRUAIDkAALYVACBhAADuGwAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAh5gYBAOMMACH3BgEA4wwAIasHAQDjDAAhvgcBAOIMACEZCAAAqRcAIAwAALMVACANAACrFQAgEQAArBUAIBwAALIVACAlAACoFQAgKgAAtBUAIC4AAKUVACAvAACmFQAgMAAApxUAIDEAAKkVACAyAACqFQAgNAAArRUAIDUAAK4VACA2AACvFQAgNwAAsBUAIDgAALUVACA5AAC2FQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAh5gYBAOMMACH3BgEA4wwAIasHAQDjDAAhvgcBAOIMACEDAAAAFgAgaAAA6RsAIGkAAPEbACAkAAAAFgAgBgAA1RIAIAwAAOQSACANAADYEgAgEQAA2RIAIBwAAOASACAlAADTEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACBhAADxGwAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhuwYAALQSrQcj4AYBAOIMACHmBgEA4wwAIasHAQDjDAAhrgcBAOMMACEiBgAA1RIAIAwAAOQSACANAADYEgAgEQAA2RIAIBwAAOASACAlAADTEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAIQmHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAdgGAQAAAAGKByAAAAABkgcQAAAAAZMHEAAAAAEPAwAAxQ8AIAcAAMMPACAJAADEDwAgDQAAxg8AIBMAAMcPACAaAADIDwAgIgAAyg8AIIcGAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAHcBgEAAAABAgAAAJ0BACBoAADzGwAgAwAAAFMAIGgAAPMbACBpAAD3GwAgEQAAAFMAIAMAAPUOACAHAADzDgAgCQAA9A4AIA0AAPYOACATAAD3DgAgGgAA-A4AICIAAPoOACBhAAD3GwAghwYBAOIMACGLBgEA4wwAIYwGAQDiDAAhjQYBAOMMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACHcBgEA4gwAIQ8DAAD1DgAgBwAA8w4AIAkAAPQOACANAAD2DgAgEwAA9w4AIBoAAPgOACAiAAD6DgAghwYBAOIMACGLBgEA4wwAIYwGAQDiDAAhjQYBAOMMACGOBgEA4gwAIY8GQADkDAAhkAZAAOQMACHcBgEA4gwAIRaHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAbMGAQAAAAG_BgAAAJAHAtcGEAAAAAHYBgEAAAAB2QYCAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGABwEAAAABgQcBAAAAAYIHgAAAAAGDB0AAAAABjAcBAAAAAY4HAAAAjgcCkAcBAAAAAZEHQAAAAAEiBAAAmxkAIAUAAJwZACAGAACdGQAgEAAAnhkAIBkAAJ8ZACA0AACiGQAgQQAAoBkAIE4AAKEZACBPAACjGQAgUAAApBkAIFEAAKUZACBSAACmGQAgVAAAqBkAIFUAAKkZACBWAACqGQAgVwAAqxkAIFgAAKwZACBZAACtGQAgWgAArhkAIIcGAQAAAAGLBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAABlwcBAAAAAdcHAQAAAAHYByAAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwEAAAAB3wcBAAAAAQIAAACAAwAgaAAA-RsAIAMAAABRACBoAAD5GwAgaQAA_RsAICQAAABRACAEAADSFwAgBQAA0xcAIAYAANQXACAQAADVFwAgGQAA1hcAIDQAANkXACBBAADXFwAgTgAA2BcAIE8AANoXACBQAADbFwAgUQAA3BcAIFIAAN0XACBUAADfFwAgVQAA4BcAIFYAAOEXACBXAADiFwAgWAAA4xcAIFkAAOQXACBaAADlFwAgYQAA_RsAIIcGAQDiDAAhiwYBAOMMACGPBkAA5AwAIZAGQADkDAAh4AYBAOIMACGXBwEA4gwAIdcHAQDiDAAh2AcgAMQOACHZBwEA4wwAIdoHAQDjDAAh2wcBAOMMACHcBwEA4wwAId0HAQDjDAAh3gcBAOMMACHfBwEA4gwAISIEAADSFwAgBQAA0xcAIAYAANQXACAQAADVFwAgGQAA1hcAIDQAANkXACBBAADXFwAgTgAA2BcAIE8AANoXACBQAADbFwAgUQAA3BcAIFIAAN0XACBUAADfFwAgVQAA4BcAIFYAAOEXACBXAADiFwAgWAAA4xcAIFkAAOQXACBaAADlFwAghwYBAOIMACGLBgEA4wwAIY8GQADkDAAhkAZAAOQMACHgBgEA4gwAIZcHAQDiDAAh1wcBAOIMACHYByAAxA4AIdkHAQDjDAAh2gcBAOMMACHbBwEA4wwAIdwHAQDjDAAh3QcBAOMMACHeBwEA4wwAId8HAQDiDAAhDwMAAMUPACAHAADDDwAgCQAAxA8AIA0AAMYPACATAADHDwAgHAAAyQ8AICIAAMoPACCHBgEAAAABiwYBAAAAAYwGAQAAAAGNBgEAAAABjgYBAAAAAY8GQAAAAAGQBkAAAAAB3AYBAAAAAQIAAACdAQAgaAAA_hsAIAMAAABTACBoAAD-GwAgaQAAghwAIBEAAABTACADAAD1DgAgBwAA8w4AIAkAAPQOACANAAD2DgAgEwAA9w4AIBwAAPkOACAiAAD6DgAgYQAAghwAIIcGAQDiDAAhiwYBAOMMACGMBgEA4gwAIY0GAQDjDAAhjgYBAOIMACGPBkAA5AwAIZAGQADkDAAh3AYBAOIMACEPAwAA9Q4AIAcAAPMOACAJAAD0DgAgDQAA9g4AIBMAAPcOACAcAAD5DgAgIgAA-g4AIIcGAQDiDAAhiwYBAOMMACGMBgEA4gwAIY0GAQDjDAAhjgYBAOIMACGPBkAA5AwAIZAGQADkDAAh3AYBAOIMACEiBAAAmxkAIAUAAJwZACAGAACdGQAgEAAAnhkAIDQAAKIZACBBAACgGQAgTgAAoRkAIE8AAKMZACBQAACkGQAgUQAApRkAIFIAAKYZACBTAACnGQAgVAAAqBkAIFUAAKkZACBWAACqGQAgVwAAqxkAIFgAAKwZACBZAACtGQAgWgAArhkAIIcGAQAAAAGLBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAABlwcBAAAAAdcHAQAAAAHYByAAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwEAAAAB3wcBAAAAAQIAAACAAwAgaAAAgxwAIBkIAACqFwAgDAAA7BYAIA0AAOQWACARAADlFgAgHAAA6xYAICUAAOEWACAnAADqFgAgKgAA7RYAIC4AAN4WACAvAADfFgAgMAAA4BYAIDEAAOIWACA0AADmFgAgNQAA5xYAIDYAAOgWACA3AADpFgAgOAAA7hYAIDkAAO8WACCHBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB9wYBAAAAAasHAQAAAAG-BwEAAAABAgAAABoAIGgAAIUcACAiBgAA-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgNAAA_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_BgAAAN4GAsAGAQAAAAHBBkAAAAABwgZAAAAAAcMGAQAAAAHEBgEAAAAB3gYBAAAAAQ0HAACCEAAgCQAAgxAAIBsAAPARACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAdgGAQAAAAHoBgEAAAABigcgAAAAAZIHEAAAAAGTBxAAAAABAgAAAHYAIGgAAKAcACAJDAAA4BAAIA0AAOIQACAlAADhEAAgJwAA4xAAIIcGAQAAAAGMBgEAAAAB4AYBAAAAAeEGQAAAAAHiBkAAAAABAgAAAJ8IACBoAACiHAAgGQgAAKoXACAMAADsFgAgDQAA5BYAIBEAAOUWACAlAADhFgAgJwAA6hYAICoAAO0WACAuAADeFgAgLwAA3xYAIDAAAOAWACAxAADiFgAgMgAA4xYAIDQAAOYWACA1AADnFgAgNgAA6BYAIDcAAOkWACA4AADuFgAgOQAA7xYAIIcGAQAAAAGPBkAAAAABkAZAAAAAAeYGAQAAAAH3BgEAAAABqwcBAAAAAb4HAQAAAAECAAAAGgAgaAAApBwAICIGAAD4FgAgDAAAhxcAIA0AAPsWACARAAD8FgAgJQAA9hYAICcAAIIXACAqAACIFwAgLgAA8xYAIC8AAPQWACAwAAD3FgAgMQAA-RYAIDIAAPoWACA0AAD-FgAgNQAA_xYAIDYAAIAXACA3AACBFwAgOwAA8hYAIDwAAPUWACBAAACGFwAgQQAA_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_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHAQAAAAGBBwEAAAABggeAAAAAAYMHQAAAAAGMBwEAAAABjgcAAACOBwKQBwEAAAABkQdAAAAAARIDAAC-DgAgBwAAtg4AIAkAAL0OACANAAC3DgAgEQAAuA4AICQAALkOACBMAAC6DgAgTQAAuw4AIIcGAQAAAAGIBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAECAAAAEAAgaAAAtRwAIAMAAAAOACBoAAC1HAAgaQAAuRwAIBQAAAAOACADAADtDAAgBwAA5QwAIAkAAOwMACANAADmDAAgEQAA5wwAICQAAOgMACBMAADpDAAgTQAA6gwAIGEAALkcACCHBgEA4gwAIYgGAQDiDAAhiQYBAOIMACGKBgEA4gwAIYsGAQDjDAAhjAYBAOIMACGNBgEA4gwAIY4GAQDiDAAhjwZAAOQMACGQBkAA5AwAIRIDAADtDAAgBwAA5QwAIAkAAOwMACANAADmDAAgEQAA5wwAICQAAOgMACBMAADpDAAgTQAA6gwAIIcGAQDiDAAhiAYBAOIMACGJBgEA4gwAIYoGAQDiDAAhiwYBAOMMACGMBgEA4gwAIY0GAQDiDAAhjgYBAOIMACGPBkAA5AwAIZAGQADkDAAhD4cGAQAAAAGPBkAAAAABkAZAAAAAAbEGAQAAAAG_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_hYAIDUAAP8WACA2AACAFwAgNwAAgRcAIDsAAPIWACA8AAD1FgAgQQAA_RYAIEIAAIQXACBDAACFFwAgSAAAiRcAIEkAAIoXACBKAACLFwAgSwAAjBcAIIcGAQAAAAGPBkAAAAABkAZAAAAAAbsGAAAArQcD4AYBAAAAAeYGAQAAAAGrBwEAAAABrgcBAAAAAQIAAACDBQAgaAAAxhwAIAMAAADVAQAgaAAAxBwAIGkAAMocACAgAAAA1QEAIAcAALoSACA9AAC4EgAgPgAAuRIAIGEAAMocACCHBgEA4gwAIYwGAQDjDAAhjwZAAOQMACGQBkAA5AwAIb8GAAC3Er0HIsEGQAD6DAAh5gYBAOMMACGoBwEA4wwAIakHAQDiDAAhqgcBAOIMACGrBwEA4wwAIa0HAAC0Eq0HI64HAQDjDAAhrwcAALUS1QYjsAcQALYSACGxBwEA4gwAIbIHAgCYEAAhswcAANwR_AYitAcBAOMMACG1BwEA4wwAIbYHAQDjDAAhtwcBAOMMACG4BwEA4wwAIbkHAQDjDAAhugeAAAAAAbsHQAD6DAAhvQcBAOMMACEeBwAAuhIAID0AALgSACA-AAC5EgAghwYBAOIMACGMBgEA4wwAIY8GQADkDAAhkAZAAOQMACG_BgAAtxK9ByLBBkAA-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_ACBoAADYHAAgaQAA3BwAIBEAAAA_ACAHAADADQAgCQAAwQ0AIA4AAL8NACAQAADXDgAgYQAA3BwAIIcGAQDiDAAhjAYBAOIMACGNBgEA4wwAIY8GQADkDAAhkAZAAOQMACGvBgEA4gwAIbEGAQDiDAAhuAYBAOIMACG5BgEA4wwAIbsGAAC9DbsGIrwGQAD6DAAhDwcAAMANACAJAADBDQAgDgAAvw0AIBAAANcOACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACGxBgEA4gwAIbgGAQDiDAAhuQYBAOMMACG7BgAAvQ27BiK8BkAA-gwAIRIDAAC-DgAgBwAAtg4AIAkAAL0OACANAAC3DgAgIgAAvA4AICQAALkOACBMAAC6DgAgTQAAuw4AIIcGAQAAAAGIBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAECAAAAEAAgaAAA3RwAIAMAAAAOACBoAADdHAAgaQAA4RwAIBQAAAAOACADAADtDAAgBwAA5QwAIAkAAOwMACANAADmDAAgIgAA6wwAICQAAOgMACBMAADpDAAgTQAA6gwAIGEAAOEcACCHBgEA4gwAIYgGAQDiDAAhiQYBAOIMACGKBgEA4gwAIYsGAQDjDAAhjAYBAOIMACGNBgEA4gwAIY4GAQDiDAAhjwZAAOQMACGQBkAA5AwAIRIDAADtDAAgBwAA5QwAIAkAAOwMACANAADmDAAgIgAA6wwAICQAAOgMACBMAADpDAAgTQAA6gwAIIcGAQDiDAAhiAYBAOIMACGJBgEA4gwAIYoGAQDiDAAhiwYBAOMMACGMBgEA4gwAIY0GAQDiDAAhjgYBAOIMACGPBkAA5AwAIZAGQADkDAAhIgQAAJsZACAFAACcGQAgBgAAnRkAIBAAAJ4ZACAZAACfGQAgNAAAohkAIEEAAKAZACBOAAChGQAgTwAAoxkAIFEAAKUZACBSAACmGQAgUwAApxkAIFQAAKgZACBVAACpGQAgVgAAqhkAIFcAAKsZACBYAACsGQAgWQAArRkAIFoAAK4ZACCHBgEAAAABiwYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAZcHAQAAAAHXBwEAAAAB2AcgAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAAB3gcBAAAAAd8HAQAAAAECAAAAgAMAIGgAAOIcACADAAAAUQAgaAAA4hwAIGkAAOYcACAkAAAAUQAgBAAA0hcAIAUAANMXACAGAADUFwAgEAAA1RcAIBkAANYXACA0AADZFwAgQQAA1xcAIE4AANgXACBPAADaFwAgUQAA3BcAIFIAAN0XACBTAADeFwAgVAAA3xcAIFUAAOAXACBWAADhFwAgVwAA4hcAIFgAAOMXACBZAADkFwAgWgAA5RcAIGEAAOYcACCHBgEA4gwAIYsGAQDjDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAhlwcBAOIMACHXBwEA4gwAIdgHIADEDgAh2QcBAOMMACHaBwEA4wwAIdsHAQDjDAAh3AcBAOMMACHdBwEA4wwAId4HAQDjDAAh3wcBAOIMACEiBAAA0hcAIAUAANMXACAGAADUFwAgEAAA1RcAIBkAANYXACA0AADZFwAgQQAA1xcAIE4AANgXACBPAADaFwAgUQAA3BcAIFIAAN0XACBTAADeFwAgVAAA3xcAIFUAAOAXACBWAADhFwAgVwAA4hcAIFgAAOMXACBZAADkFwAgWgAA5RcAIIcGAQDiDAAhiwYBAOMMACGPBkAA5AwAIZAGQADkDAAh4AYBAOIMACGXBwEA4gwAIdcHAQDiDAAh2AcgAMQOACHZBwEA4wwAIdoHAQDjDAAh2wcBAOMMACHcBwEA4wwAId0HAQDjDAAh3gcBAOMMACHfBwEA4gwAISIEAACbGQAgBQAAnBkAIAYAAJ0ZACAZAACfGQAgNAAAohkAIEEAAKAZACBOAAChGQAgTwAAoxkAIFAAAKQZACBRAAClGQAgUgAAphkAIFMAAKcZACBUAACoGQAgVQAAqRkAIFYAAKoZACBXAACrGQAgWAAArBkAIFkAAK0ZACBaAACuGQAghwYBAAAAAYsGAQAAAAGPBkAAAAABkAZAAAAAAeAGAQAAAAGXBwEAAAAB1wcBAAAAAdgHIAAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAd4HAQAAAAHfBwEAAAABAgAAAIADACBoAADnHAAgGQgAAKoXACAMAADsFgAgDQAA5BYAIBEAAOUWACAcAADrFgAgJQAA4RYAICcAAOoWACAqAADtFgAgLgAA3hYAIC8AAN8WACAwAADgFgAgMgAA4xYAIDQAAOYWACA1AADnFgAgNgAA6BYAIDcAAOkWACA4AADuFgAgOQAA7xYAIIcGAQAAAAGPBkAAAAABkAZAAAAAAeYGAQAAAAH3BgEAAAABqwcBAAAAAb4HAQAAAAECAAAAGgAgaAAA6RwAICIGAAD4FgAgDAAAhxcAIA0AAPsWACARAAD8FgAgHAAAgxcAICUAAPYWACAnAACCFwAgKgAAiBcAIC4AAPMWACAvAAD0FgAgMAAA9xYAIDIAAPoWACA0AAD-FgAgNQAA_xYAIDYAAIAXACA3AACBFwAgOwAA8hYAIDwAAPUWACBAAACGFwAgQQAA_RYAIEIAAIQXACBDAACFFwAgSAAAiRcAIEkAAIoXACBKAACLFwAgSwAAjBcAIIcGAQAAAAGPBkAAAAABkAZAAAAAAbsGAAAArQcD4AYBAAAAAeYGAQAAAAGrBwEAAAABrgcBAAAAAQIAAACDBQAgaAAA6xwAICIGAAD4FgAgDAAAhxcAIBEAAPwWACAcAACDFwAgJQAA9hYAICcAAIIXACAqAACIFwAgLgAA8xYAIC8AAPQWACAwAAD3FgAgMQAA-RYAIDIAAPoWACA0AAD-FgAgNQAA_xYAIDYAAIAXACA3AACBFwAgOwAA8hYAIDwAAPUWACBAAACGFwAgQQAA_RYAIEIAAIQXACBDAACFFwAgSAAAiRcAIEkAAIoXACBKAACLFwAgSwAAjBcAIIcGAQAAAAGPBkAAAAABkAZAAAAAAbsGAAAArQcD4AYBAAAAAeYGAQAAAAGrBwEAAAABrgcBAAAAAQIAAACDBQAgaAAA7RwAIAkMAADgEAAgHAAA5BAAICUAAOEQACAnAADjEAAghwYBAAAAAYwGAQAAAAHgBgEAAAAB4QZAAAAAAeIGQAAAAAECAAAAnwgAIGgAAO8cACAOBwAAsxEAIAkAALQRACAPAACxEQAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAG4BgEAAAAB5gYBAAAAAfAGAQAAAAHxBkAAAAAB8gYIAAAAAfMGCAAAAAECAAAAHwAgaAAA8RwAIBkIAACqFwAgDAAA7BYAIBEAAOUWACAcAADrFgAgJQAA4RYAICcAAOoWACAqAADtFgAgLgAA3hYAIC8AAN8WACAwAADgFgAgMQAA4hYAIDIAAOMWACA0AADmFgAgNQAA5xYAIDYAAOgWACA3AADpFgAgOAAA7hYAIDkAAO8WACCHBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB9wYBAAAAAasHAQAAAAG-BwEAAAABAgAAABoAIGgAAPMcACAQBwAAvxAAIAkAAMAQACARAAC9EAAgGwAA8BAAICQAAL4QACAmAADBEAAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAAB5gYBAAAAAecGAgAAAAHoBgEAAAAB6QYBAAAAAQIAAAA3ACBoAAD1HAAgDwMAAMUPACAHAADDDwAgCQAAxA8AIBMAAMcPACAaAADIDwAgHAAAyQ8AICIAAMoPACCHBgEAAAABiwYBAAAAAYwGAQAAAAGNBgEAAAABjgYBAAAAAY8GQAAAAAGQBkAAAAAB3AYBAAAAAQIAAACdAQAgaAAA9xwAIA4HAACtEQAgCQAArhEAIAoAAMcUACARAACwEQAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB8gYCAAAAAfgGAQAAAAHABwEAAAABwQcBAAAAAQIAAAAjACBoAAD5HAAgGQgAAKoXACAMAADsFgAgDQAA5BYAIBEAAOUWACAcAADrFgAgJQAA4RYAICcAAOoWACAuAADeFgAgLwAA3xYAIDAAAOAWACAxAADiFgAgMgAA4xYAIDQAAOYWACA1AADnFgAgNgAA6BYAIDcAAOkWACA4AADuFgAgOQAA7xYAIIcGAQAAAAGPBkAAAAABkAZAAAAAAeYGAQAAAAH3BgEAAAABqwcBAAAAAb4HAQAAAAECAAAAGgAgaAAA-xwAICIGAAD4FgAgDAAAhxcAIA0AAPsWACARAAD8FgAgHAAAgxcAICUAAPYWACAnAACCFwAgLgAA8xYAIC8AAPQWACAwAAD3FgAgMQAA-RYAIDIAAPoWACA0AAD-FgAgNQAA_xYAIDYAAIAXACA3AACBFwAgOwAA8hYAIDwAAPUWACBAAACGFwAgQQAA_RYAIEIAAIQXACBDAACFFwAgSAAAiRcAIEkAAIoXACBKAACLFwAgSwAAjBcAIIcGAQAAAAGPBkAAAAABkAZAAAAAAbsGAAAArQcD4AYBAAAAAeYGAQAAAAGrBwEAAAABrgcBAAAAAQIAAACDBQAgaAAA_RwAIAoHAAC5FwAghwYBAAAAAYwGAQAAAAGPBkAAAAABkAZAAAAAAeAGAQAAAAHCBwEAAAABwwcBAAAAAcQHAgAAAAHGBwAAAMYHAgIAAADMAQAgaAAA_xwAIA4HAADeEAAgCQAA3xAAIBsAAPUQACCHBgEAAAABjAYBAAAAAY0GAQAAAAGPBkAAAAABkAZAAAAAAb8GAAAA7QYC4AYBAAAAAeYGAQAAAAHoBgEAAAAB6gYBAAAAAesGAQAAAAECAAAAMwAgaAAAgR0AIAMAAAAYACBoAAD7HAAgaQAAhR0AIBsAAAAYACAIAACpFwAgDAAAsxUAIA0AAKsVACARAACsFQAgHAAAshUAICUAAKgVACAnAACxFQAgLgAApRUAIC8AAKYVACAwAACnFQAgMQAAqRUAIDIAAKoVACA0AACtFQAgNQAArhUAIDYAAK8VACA3AACwFQAgOAAAtRUAIDkAALYVACBhAACFHQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAh5gYBAOMMACH3BgEA4wwAIasHAQDjDAAhvgcBAOIMACEZCAAAqRcAIAwAALMVACANAACrFQAgEQAArBUAIBwAALIVACAlAACoFQAgJwAAsRUAIC4AAKUVACAvAACmFQAgMAAApxUAIDEAAKkVACAyAACqFQAgNAAArRUAIDUAAK4VACA2AACvFQAgNwAAsBUAIDgAALUVACA5AAC2FQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAh5gYBAOMMACH3BgEA4wwAIasHAQDjDAAhvgcBAOIMACEDAAAAFgAgaAAA_RwAIGkAAIgdACAkAAAAFgAgBgAA1RIAIAwAAOQSACANAADYEgAgEQAA2RIAIBwAAOASACAlAADTEgAgJwAA3xIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACBhAACIHQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhuwYAALQSrQcj4AYBAOIMACHmBgEA4wwAIasHAQDjDAAhrgcBAOMMACEiBgAA1RIAIAwAAOQSACANAADYEgAgEQAA2RIAIBwAAOASACAlAADTEgAgJwAA3xIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAIQMAAADKAQAgaAAA_xwAIGkAAIsdACAMAAAAygEAIAcAALgXACBhAACLHQAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACHgBgEA4wwAIcIHAQDiDAAhwwcBAOIMACHEBwIA6w4AIcYHAADbFMYHIgoHAAC4FwAghwYBAOIMACGMBgEA4gwAIY8GQADkDAAhkAZAAOQMACHgBgEA4wwAIcIHAQDiDAAhwwcBAOIMACHEBwIA6w4AIcYHAADbFMYHIgMAAAAxACBoAACBHQAgaQAAjh0AIBAAAAAxACAHAADPEAAgCQAA0BAAIBsAAPQQACBhAACOHQAghwYBAOIMACGMBgEA4wwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIb8GAADMEO0GIuAGAQDiDAAh5gYBAOMMACHoBgEA4wwAIeoGAQDiDAAh6wYBAOIMACEOBwAAzxAAIAkAANAQACAbAAD0EAAghwYBAOIMACGMBgEA4wwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIb8GAADMEO0GIuAGAQDiDAAh5gYBAOMMACHoBgEA4wwAIeoGAQDiDAAh6wYBAOIMACEKhwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAAB5gYBAAAAAe0GAQAAAAHuBgEAAAAB7wYBAAAAAQWHBgEAAAABjwZAAAAAAZAGQAAAAAG_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_B0AAAAABGQgAAKoXACAMAADsFgAgDQAA5BYAIBwAAOsWACAlAADhFgAgJwAA6hYAICoAAO0WACAuAADeFgAgLwAA3xYAIDAAAOAWACAxAADiFgAgMgAA4xYAIDQAAOYWACA1AADnFgAgNgAA6BYAIDcAAOkWACA4AADuFgAgOQAA7xYAIIcGAQAAAAGPBkAAAAABkAZAAAAAAeYGAQAAAAH3BgEAAAABqwcBAAAAAb4HAQAAAAECAAAAGgAgaAAArB0AICIGAAD4FgAgDAAAhxcAIA0AAPsWACAcAACDFwAgJQAA9hYAICcAAIIXACAqAACIFwAgLgAA8xYAIC8AAPQWACAwAAD3FgAgMQAA-RYAIDIAAPoWACA0AAD-FgAgNQAA_xYAIDYAAIAXACA3AACBFwAgOwAA8hYAIDwAAPUWACBAAACGFwAgQQAA_RYAIEIAAIQXACBDAACFFwAgSAAAiRcAIEkAAIoXACBKAACLFwAgSwAAjBcAIIcGAQAAAAGPBkAAAAABkAZAAAAAAbsGAAAArQcD4AYBAAAAAeYGAQAAAAGrBwEAAAABrgcBAAAAAQIAAACDBQAgaAAArh0AIA4HAACtEQAgCQAArhEAIAoAAMcUACANAACvEQAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB8gYCAAAAAfgGAQAAAAHABwEAAAABwQcBAAAAAQIAAAAjACBoAACwHQAgEAcAAL8QACAJAADAEAAgDQAAvBAAIBsAAPAQACAkAAC-EAAgJgAAwRAAIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAeYGAQAAAAHnBgIAAAAB6AYBAAAAAekGAQAAAAECAAAANwAgaAAAsh0AIAMAAAAYACBoAACsHQAgaQAAth0AIBsAAAAYACAIAACpFwAgDAAAsxUAIA0AAKsVACAcAACyFQAgJQAAqBUAICcAALEVACAqAAC0FQAgLgAApRUAIC8AAKYVACAwAACnFQAgMQAAqRUAIDIAAKoVACA0AACtFQAgNQAArhUAIDYAAK8VACA3AACwFQAgOAAAtRUAIDkAALYVACBhAAC2HQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAh5gYBAOMMACH3BgEA4wwAIasHAQDjDAAhvgcBAOIMACEZCAAAqRcAIAwAALMVACANAACrFQAgHAAAshUAICUAAKgVACAnAACxFQAgKgAAtBUAIC4AAKUVACAvAACmFQAgMAAApxUAIDEAAKkVACAyAACqFQAgNAAArRUAIDUAAK4VACA2AACvFQAgNwAAsBUAIDgAALUVACA5AAC2FQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAh5gYBAOMMACH3BgEA4wwAIasHAQDjDAAhvgcBAOIMACEDAAAAFgAgaAAArh0AIGkAALkdACAkAAAAFgAgBgAA1RIAIAwAAOQSACANAADYEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACBhAAC5HQAghwYBAOIMACGPBkAA5AwAIZAGQADkDAAhuwYAALQSrQcj4AYBAOIMACHmBgEA4wwAIasHAQDjDAAhrgcBAOMMACEiBgAA1RIAIAwAAOQSACANAADYEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgNwAA3hIAIDsAAM8SACA8AADSEgAgQAAA4xIAIEEAANoSACBCAADhEgAgQwAA4hIAIEgAAOYSACBJAADnEgAgSgAA6BIAIEsAAOkSACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAIQMAAAAhACBoAACwHQAgaQAAvB0AIBAAAAAhACAHAACWEQAgCQAAlxEAIAoAAMUUACANAACYEQAgYQAAvB0AIIcGAQDiDAAhjAYBAOIMACGNBgEA4gwAIY8GQADkDAAhkAZAAOQMACHmBgEA4wwAIfIGAgCYEAAh-AYBAOMMACHABwEA4gwAIcEHAQDiDAAhDgcAAJYRACAJAACXEQAgCgAAxRQAIA0AAJgRACCHBgEA4gwAIYwGAQDiDAAhjQYBAOIMACGPBkAA5AwAIZAGQADkDAAh5gYBAOMMACHyBgIAmBAAIfgGAQDjDAAhwAcBAOIMACHBBwEA4gwAIQMAAAA1ACBoAACyHQAgaQAAvx0AIBIAAAA1ACAHAACdEAAgCQAAnhAAIA0AAJoQACAbAADvEAAgJAAAnBAAICYAAJ8QACBhAAC_HQAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAh5gYBAOMMACHnBgIAmBAAIegGAQDiDAAh6QYBAOMMACEQBwAAnRAAIAkAAJ4QACANAACaEAAgGwAA7xAAICQAAJwQACAmAACfEAAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIeAGAQDiDAAh5gYBAOMMACHnBgIAmBAAIegGAQDiDAAh6QYBAOMMACEHhwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAGvBgEAAAABsAYBAAAAARkIAACqFwAgDAAA7BYAIA0AAOQWACARAADlFgAgHAAA6xYAICUAAOEWACAnAADqFgAgKgAA7RYAIC4AAN4WACAvAADfFgAgMAAA4BYAIDEAAOIWACAyAADjFgAgNAAA5hYAIDYAAOgWACA3AADpFgAgOAAA7hYAIDkAAO8WACCHBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB9wYBAAAAAasHAQAAAAG-BwEAAAABAgAAABoAIGgAAMEdACAiBgAA-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA2AACAFwAgNwAAgRcAIDsAAPIWACA8AAD1FgAgQAAAhhcAIEEAAP0WACBCAACEFwAgQwAAhRcAIEgAAIkXACBJAACKFwAgSgAAixcAIEsAAIwXACCHBgEAAAABjwZAAAAAAZAGQAAAAAG7BgAAAK0HA-AGAQAAAAHmBgEAAAABqwcBAAAAAa4HAQAAAAECAAAAgwUAIGgAAMMdACAQBwAAvxAAIAkAAMAQACANAAC8EAAgEQAAvRAAIBsAAPAQACAmAADBEAAghwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAAB5gYBAAAAAecGAgAAAAHoBgEAAAAB6QYBAAAAAQIAAAA3ACBoAADFHQAgGQgAAKoXACAMAADsFgAgDQAA5BYAIBEAAOUWACAcAADrFgAgJQAA4RYAICcAAOoWACAqAADtFgAgLgAA3hYAIC8AAN8WACAwAADgFgAgMQAA4hYAIDIAAOMWACA0AADmFgAgNQAA5xYAIDcAAOkWACA4AADuFgAgOQAA7xYAIIcGAQAAAAGPBkAAAAABkAZAAAAAAeYGAQAAAAH3BgEAAAABqwcBAAAAAb4HAQAAAAECAAAAGgAgaAAAxx0AICIGAAD4FgAgDAAAhxcAIA0AAPsWACARAAD8FgAgHAAAgxcAICUAAPYWACAnAACCFwAgKgAAiBcAIC4AAPMWACAvAAD0FgAgMAAA9xYAIDEAAPkWACAyAAD6FgAgNAAA_hYAIDUAAP8WACA3AACBFwAgOwAA8hYAIDwAAPUWACBAAACGFwAgQQAA_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_xYAIDYAAIAXACA3AACBFwAgOwAA8hYAIDwAAPUWACBAAACGFwAgQQAA_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_BgLABgEAAAABwQZAAAAAAcIGQAAAAAHDBgEAAAABxAYBAAAAARkIAACqFwAgDAAA7BYAIA0AAOQWACARAADlFgAgHAAA6xYAICUAAOEWACAnAADqFgAgKgAA7RYAIC4AAN4WACAvAADfFgAgMAAA4BYAIDEAAOIWACAyAADjFgAgNAAA5hYAIDUAAOcWACA2AADoFgAgOAAA7hYAIDkAAO8WACCHBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB9wYBAAAAAasHAQAAAAG-BwEAAAABAgAAABoAIGgAAPsdACAiBgAA-BYAIAwAAIcXACANAAD7FgAgEQAA_BYAIBwAAIMXACAlAAD2FgAgJwAAghcAICoAAIgXACAuAADzFgAgLwAA9BYAIDAAAPcWACAxAAD5FgAgMgAA-hYAIDQAAP4WACA1AAD_FgAgNgAAgBcAIDsAAPIWACA8AAD1FgAgQAAAhhcAIEEAAP0WACBCAACEFwAgQwAAhRcAIEgAAIkXACBJAACKFwAgSgAAixcAIEsAAIwXACCHBgEAAAABjwZAAAAAAZAGQAAAAAG7BgAAAK0HA-AGAQAAAAHmBgEAAAABqwcBAAAAAa4HAQAAAAECAAAAgwUAIGgAAP0dACAWBwAAtQ4AIAkAALIOACAKAACzDgAgCwAArA4AIA4AALEOACAPAACvDgAgEAAAwg8AIBkAALAOACAbAAC0DgAgLAAArQ4AIIcGAQAAAAGMBgEAAAABjQYBAAAAAY8GQAAAAAGQBkAAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABswYBAAAAAegGAQAAAAH4BgEAAAABvwdAAAAAAQIAAAAoACBoAAD_HQAgAwAAABgAIGgAAPsdACBpAACDHgAgGwAAABgAIAgAAKkXACAMAACzFQAgDQAAqxUAIBEAAKwVACAcAACyFQAgJQAAqBUAICcAALEVACAqAAC0FQAgLgAApRUAIC8AAKYVACAwAACnFQAgMQAAqRUAIDIAAKoVACA0AACtFQAgNQAArhUAIDYAAK8VACA4AAC1FQAgOQAAthUAIGEAAIMeACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACHmBgEA4wwAIfcGAQDjDAAhqwcBAOMMACG-BwEA4gwAIRkIAACpFwAgDAAAsxUAIA0AAKsVACARAACsFQAgHAAAshUAICUAAKgVACAnAACxFQAgKgAAtBUAIC4AAKUVACAvAACmFQAgMAAApxUAIDEAAKkVACAyAACqFQAgNAAArRUAIDUAAK4VACA2AACvFQAgOAAAtRUAIDkAALYVACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACHmBgEA4wwAIfcGAQDjDAAhqwcBAOMMACG-BwEA4gwAIQMAAAAWACBoAAD9HQAgaQAAhh4AICQAAAAWACAGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgOwAAzxIAIDwAANISACBAAADjEgAgQQAA2hIAIEIAAOESACBDAADiEgAgSAAA5hIAIEkAAOcSACBKAADoEgAgSwAA6RIAIGEAAIYeACCHBgEA4gwAIY8GQADkDAAhkAZAAOQMACG7BgAAtBKtByPgBgEA4gwAIeYGAQDjDAAhqwcBAOMMACGuBwEA4wwAISIGAADVEgAgDAAA5BIAIA0AANgSACARAADZEgAgHAAA4BIAICUAANMSACAnAADfEgAgKgAA5RIAIC4AANASACAvAADREgAgMAAA1BIAIDEAANYSACAyAADXEgAgNAAA2xIAIDUAANwSACA2AADdEgAgOwAAzxIAIDwAANISACBAAADjEgAgQQAA2hIAIEIAAOESACBDAADiEgAgSAAA5hIAIEkAAOcSACBKAADoEgAgSwAA6RIAIIcGAQDiDAAhjwZAAOQMACGQBkAA5AwAIbsGAAC0Eq0HI-AGAQDiDAAh5gYBAOMMACGrBwEA4wwAIa4HAQDjDAAhAwAAACYAIGgAAP8dACBpAACJHgAgGAAAACYAIAcAAIIOACAJAAD_DQAgCgAAgA4AIAsAAPkNACAOAAD-DQAgDwAA_A0AIBAAAMAPACAZAAD9DQAgGwAAgQ4AICwAAPoNACBhAACJHgAghwYBAOIMACGMBgEA4gwAIY0GAQDjDAAhjwZAAOQMACGQBkAA5AwAIa8GAQDiDAAhsAYBAOIMACGxBgEA4gwAIbMGAQDiDAAh6AYBAOIMACH4BgEA4wwAIb8HQADkDAAhFgcAAIIOACAJAAD_DQAgCgAAgA4AIAsAAPkNACAOAAD-DQAgDwAA_A0AIBAAAMAPACAZAAD9DQAgGwAAgQ4AICwAAPoNACCHBgEA4gwAIYwGAQDiDAAhjQYBAOMMACGPBkAA5AwAIZAGQADkDAAhrwYBAOIMACGwBgEA4gwAIbEGAQDiDAAhswYBAOIMACHoBgEA4gwAIfgGAQDjDAAhvwdAAOQMACEThwYBAAAAAYwGAQAAAAGNBgEAAAABjwZAAAAAAZAGQAAAAAHFBgEAAAABxgYIAAAAAccGCAAAAAHIBggAAAAByQYIAAAAAcoGCAAAAAHLBggAAAABzAYIAAAAAc0GCAAAAAHOBggAAAABzwYIAAAAAdAGCAAAAAHRBggAAAAB0gYIAAAAARkIAACqFwAgDAAA7BYAIA0AAOQWACARAADlFgAgHAAA6xYAICUAAOEWACAnAADqFgAgKgAA7RYAIC4AAN4WACAvAADfFgAgMAAA4BYAIDEAAOIWACAyAADjFgAgNAAA5hYAIDUAAOcWACA2AADoFgAgNwAA6RYAIDkAAO8WACCHBgEAAAABjwZAAAAAAZAGQAAAAAHmBgEAAAAB9wYBAAAAAasHAQAAAAG-BwEAAAABAgAAABoAIGgAAIseACAPAwAAxQ8AIAcAAMMPACAJAADEDwAgDQAAxg8AIBMAAMcPACAaAADIDwAgHAAAyQ8AIIcGAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAHcBgEAAAABAgAAAJ0BACBoAACNHgAgIgQAAJsZACAFAACcGQAgBgAAnRkAIBAAAJ4ZACAZAACfGQAgNAAAohkAIEEAAKAZACBOAAChGQAgTwAAoxkAIFAAAKQZACBRAAClGQAgUgAAphkAIFMAAKcZACBUAACoGQAgVQAAqRkAIFcAAKsZACBYAACsGQAgWQAArRkAIFoAAK4ZACCHBgEAAAABiwYBAAAAAY8GQAAAAAGQBkAAAAAB4AYBAAAAAZcHAQAAAAHXBwEAAAAB2AcgAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAAB3gcBAAAAAd8HAQAAAAECAAAAgAMAIGgAAI8eACAiBAAAmxkAIAUAAJwZACAGAACdGQAgEAAAnhkAIBkAAJ8ZACA0AACiGQAgQQAAoBkAIE4AAKEZACBPAACjGQAgUAAApBkAIFEAAKUZACBSAACmGQAgUwAApxkAIFQAAKgZACBWAACqGQAgVwAAqxkAIFgAAKwZACBZAACtGQAgWgAArhkAIIcGAQAAAAGLBgEAAAABjwZAAAAAAZAGQAAAAAHgBgEAAAABlwcBAAAAAdcHAQAAAAHYByAAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwEAAAAB3wcBAAAAAQIAAACAAwAgaAAAkR4AICIGAAD4FgAgDAAAhxcAIA0AAPsWACARAAD8FgAgHAAAgxcAICUAAPYWACAnAACCFwAgKgAAiBcAIC4AAPMWACAvAAD0FgAgMAAA9xYAIDEAAPkWACAyAAD6FgAgNAAA_hYAIDUAAP8WACA2AACAFwAgNwAAgRcAIDsAAPIWACA8AAD1FgAgQAAAhhcAIEEAAP0WACBCAACEFwAgQwAAhRcAIEgAAIkXACBJAACKFwAgSgAAixcAIIcGAQAAAAGPBkAAAAABkAZAAAAAAbsGAAAArQcD4AYBAAAAAeYGAQAAAAGrBwEAAAABrgcBAAAAAQIAAACDBQAgaAAAkx4AICIGAAD4FgAgDAAAhxcAIA0AAPsWACARAAD8FgAgHAAAgxcAICUAAPYWACAnAACCFwAgKgAAiBcAIC4AAPMWACAvAAD0FgAgMAAA9xYAIDEAAPkWACAyAAD6FgAgNAAA_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_AjUBAwACAQMAAgoDAAIHAAYJAAgNnwILEaACEBUAOSKkAhokoQIRTKICKU2jAiUcBtABAQzuAQ0N0wELEdQBEBUAOBzmARclzgEPJ-UBGCrvAQwuyAEJL8kBHTDPAQox0QEFMtIBEzThASk14gERNuMBEjfkASU7FQc8zQEiQO0BL0HYAS5C6AExQ-wBMkjzATNJgQI3SoMCGkuEAhoDBxcGFQAtOhsIFAgcBwyxAQ0NnwELEaABEBUALBywARclmgEPJ68BGCqyAQwuIAkvmAEdMJkBCjGbAQUyngETNKQBKTWqARE2qwESN64BJTizARo5tAEBBQcABgkACA2TAQsPJAoVACgGBwAGCQAICiUJDSkLEZABEBUAJwwHAAYJjAEICo0BCQstDA4ADw8AChAABRUAJhkAExsADiyIASQtigElBQeDAQYJhAEIKAANKQALKwAiBQd-Bgl_CAsuDBUAIRswDgYMNA0NcwsVACAceBclOA8ndxgIBwAGCWoIDTkLET0QFQAfGwAOJEIRJmwdBQcABgk-CA4ADw8AChAABQYHAAYJQwgOAA8QAAUVABwjRxIEBwAGCWgIEgARGQATCQMAAgcABglICA1JCxNKEhUAGxpOFBxYFyJeGgQWABUXAAIYUgIZVBMCFE8UFQAWARRQAAUHAAYJAAgZABMbAA4dABgFBwAGCQAIFQAZGwAOHFkXARxaAAcQYQUYXwIZYBMeAAYfAAYgAAIhYggFDWMAE2QAGmUAHGYAImcAASNpAAQHAAYJbQgVAB4lbg8BJW8AAw1wABFxACRyAAUMeQANewAcfQAlegAnfAABC4ABAAMHAAYVACMqgQEMASqCAQABKQALBAcABgmLAQgQAAUpAAsCC44BACyPAQACDZEBABGSAQACDZUBAA-UAQAGBwAGCakBCBCoAQUWACoYpwECMwACAhSlASkVACsBFKYBABIMwwEADbsBABG8AQAcwgEAJbgBACfBAQAqxAEALrUBAC-2AQAwtwEAMbkBADK6AQA0vQEANb4BADa_AQA3wAEAOMUBADnGAQABOscBAAUH2gEGFQAwPQACPtkBAkDeAS8CBwAGP98BLgFA4AEAAQcABgEHAAYFBwAGFQA2RAACRvcBNEf7ATUBRQAzAgMAAkUAMwJG_AEAR_0BAAMHAAYgAAI-ggICGgaLAgAMmQIADY4CABGPAgAclgIAJYkCACeVAgAqmgIALoYCAC-HAgAwigIAMYwCADKNAgA0kQIANZICADaTAgA3lAIAO4UCADyIAgBAmAIAQZACAEOXAgBImwIASZwCAEqdAgBLngIABg2lAgARpgIAIqoCACSnAgBMqAIATakCAAEzAAIBFwACAQMAAhIEwAIABcECAAbCAgAQwwIAGcQCADTHAgBBxQIATsYCAE_IAgBRyQIAUsoCAFTLAgBVzAIAVs0CAFfOAgBYzwIAWdACAFrRAgAAAwMAAgcABlvcAggDAwACBwAGW-ICCAMVAEJuAENvAEQAAAADFQBCbgBDbwBEASkACwEpAAsDFQBJbgBKbwBLAAAAAxUASW4ASm8ASwAAAxUAUG4AUW8AUgAAAAMVAFBuAFFvAFIBAwACAQMAAgMVAFduAFhvAFkAAAADFQBXbgBYbwBZAQMAAgEDAAIDFQBebgBfbwBgAAAAAxUAXm4AX28AYAAAAAMVAGZuAGdvAGgAAAADFQBmbgBnbwBoAQMAAgEDAAIDFQBtbgBubwBvAAAAAxUAbW4Abm8AbwIHAAYJ_QMIAgcABgmDBAgDFQB0bgB1bwB2AAAAAxUAdG4AdW8AdgEHAAYBBwAGBRUAe24Afm8Af_ABAHzxAQB9AAAAAAAFFQB7bgB-bwB_8AEAfPEBAH0DBwAGCQAICqsECQMHAAYJAAgKsQQJBRUAhAFuAIcBbwCIAfABAIUB8QEAhgEAAAAAAAUVAIQBbgCHAW8AiAHwAQCFAfEBAIYBCAcABgnDBAgKxAQJDgAPDwAKEAAFGQATGwAOCAcABgnKBAgKywQJDgAPDwAKEAAFGQATGwAOAxUAjQFuAI4BbwCPAQAAAAMVAI0BbgCOAW8AjwEBCN0EBwEI4wQHAxUAlAFuAJUBbwCWAQAAAAMVAJQBbgCVAW8AlgEBB_UEBgEH-wQGAxUAmwFuAJwBbwCdAQAAAAMVAJsBbgCcAW8AnQEAAAMVAKIBbgCjAW8ApAEAAAADFQCiAW4AowFvAKQBAwemBQY9AAI-pQUCAwetBQY9AAI-rAUCBRUAqQFuAKwBbwCtAfABAKoB8QEAqwEAAAAAAAUVAKkBbgCsAW8ArQHwAQCqAfEBAKsBAwcABiAAAj6_BQIDBwAGIAACPsUFAgMVALIBbgCzAW8AtAEAAAADFQCyAW4AswFvALQBBxDZBQUY1wUCGdgFEx4ABh8ABiAAAiHaBQgHEOIFBRjgBQIZ4QUTHgAGHwAGIAACIeMFCAMVALkBbgC6AW8AuwEAAAADFQC5AW4AugFvALsBAgcABkQAAgIHAAZEAAIDFQDAAW4AwQFvAMIBAAAAAxUAwAFuAMEBbwDCAQFFADMBRQAzAxUAxwFuAMgBbwDJAQAAAAMVAMcBbgDIAW8AyQECAwACRQAzAgMAAkUAMwMVAM4BbgDPAW8A0AEAAAADFQDOAW4AzwFvANABAwcABgkACBsADgMHAAYJAAgbAA4FFQDVAW4A2AFvANkB8AEA1gHxAQDXAQAAAAAABRUA1QFuANgBbwDZAfABANYB8QEA1wEFBwAGCQAIGQATGwAOHQAYBQcABgkACBkAExsADh0AGAUVAN4BbgDhAW8A4gHwAQDfAfEBAOABAAAAAAAFFQDeAW4A4QFvAOIB8AEA3wHxAQDgAQEHAAYBBwAGAxUA5wFuAOgBbwDpAQAAAAMVAOcBbgDoAW8A6QEBBwAGAQcABgUVAO4BbgDxAW8A8gHwAQDvAfEBAPABAAAAAAAFFQDuAW4A8QFvAPIB8AEA7wHxAQDwAQAAAxUA9wFuAPgBbwD5AQAAAAMVAPcBbgD4AW8A-QEAAAMVAP4BbgD_AW8AgAIAAAADFQD-AW4A_wFvAIACAgcABgkACAIHAAYJAAgFFQCFAm4AiAJvAIkC8AEAhgLxAQCHAgAAAAAABRUAhQJuAIgCbwCJAvABAIYC8QEAhwIFB9kHBgnaBwgoAA0pAAsrACIFB-AHBgnhBwgoAA0pAAsrACIDFQCOAm4AjwJvAJACAAAAAxUAjgJuAI8CbwCQAgMH9AcGCfUHCBvzBw4DB_wHBgn9Bwgb-wcOAxUAlQJuAJYCbwCXAgAAAAMVAJUCbgCWAm8AlwIEBwAGCY8ICBsADiaQCB0EBwAGCZYICBsADiaXCB0FFQCcAm4AnwJvAKAC8AEAnQLxAQCeAgAAAAAABRUAnAJuAJ8CbwCgAvABAJ0C8QEAngIAAAMVAKUCbgCmAm8ApwIAAAADFQClAm4ApgJvAKcCARcAAgEXAAIDFQCsAm4ArQJvAK4CAAAAAxUArAJuAK0CbwCuAgQWABUXAAIY2QgCGdoIEwQWABUXAAIY4AgCGeEIEwMVALMCbgC0Am8AtQIAAAADFQCzAm4AtAJvALUCAwMAAgcABgnzCAgDAwACBwAGCfkICAMVALoCbgC7Am8AvAIAAAADFQC6Am4AuwJvALwCAgcABj-LCS4CBwAGP5EJLgUVAMECbgDEAm8AxQLwAQDCAvEBAMMCAAAAAAAFFQDBAm4AxAJvAMUC8AEAwgLxAQDDAgQHAAYJowkIEAAFKQALBAcABgmpCQgQAAUpAAsFFQDKAm4AzQJvAM4C8AEAywLxAQDMAgAAAAAABRUAygJuAM0CbwDOAvABAMsC8QEAzAIGBwAGCb0JCBC8CQUWACoYuwkCMwACBgcABgnFCQgQxAkFFgAqGMMJAjMAAgMVANMCbgDUAm8A1QIAAAADFQDTAm4A1AJvANUCBAcABgnXCQgOAA8QAAUEBwAGCd0JCA4ADxAABQMVANoCbgDbAm8A3AIAAAADFQDaAm4A2wJvANwCBAcABgnvCQgSABEZABMEBwAGCfUJCBIAERkAEwMVAOECbgDiAm8A4wIAAAADFQDhAm4A4gJvAOMCBQcABgmHCggOAA8PAAoQAAUFBwAGCY0KCA4ADw8AChAABQMVAOgCbgDpAm8A6gIAAAADFQDoAm4A6QJvAOoCATMAAgEzAAIDFQDvAm4A8AJvAPECAAAAAxUA7wJuAPACbwDxAgMDAAIHAAYJAAgDAwACBwAGCQAIAxUA9gJuAPcCbwD4AgAAAAMVAPYCbgD3Am8A-AJcAgFd0wIBXtQCAV_VAgFg1gIBYtgCAWPaAj5k2wI_Zd4CAWbgAj5n4QJAauMCAWvkAgFs5QI-cOgCQXHpAkVy6gIkc-sCJHTsAiR17QIkdu4CJHfwAiR48gI-efMCRnr1AiR79wI-fPgCR335AiR--gIkf_sCPoAB_gJIgQH_AkyCAYEDAoMBggMChAGEAwKFAYUDAoYBhgMChwGIAwKIAYoDPokBiwNNigGNAwKLAY8DPowBkANOjQGRAwKOAZIDAo8BkwM-kAGWA0-RAZcDU5IBmAMDkwGZAwOUAZoDA5UBmwMDlgGcAwOXAZ4DA5gBoAM-mQGhA1SaAaMDA5sBpQM-nAGmA1WdAacDA54BqAMDnwGpAz6gAawDVqEBrQNaogGuAwSjAa8DBKQBsAMEpQGxAwSmAbIDBKcBtAMEqAG2Az6pAbcDW6oBuQMEqwG7Az6sAbwDXK0BvQMErgG-AwSvAb8DPrABwgNdsQHDA2GyAcUDYrMBxgNitAHJA2K1AcoDYrYBywNitwHNA2K4Ac8DPrkB0ANjugHSA2K7AdQDPrwB1QNkvQHWA2K-AdcDYr8B2AM-wAHbA2XBAdwDacIB3QM8wwHeAzzEAd8DPMUB4AM8xgHhAzzHAeMDPMgB5QM-yQHmA2rKAegDPMsB6gM-zAHrA2vNAewDPM4B7QM8zwHuAz7QAfEDbNEB8gNw0gHzAx3TAfQDHdQB9QMd1QH2Ax3WAfcDHdcB-QMd2AH7Az7ZAfwDcdoB_wMd2wGBBD7cAYIEct0BhAQd3gGFBB3fAYYEPuABiQRz4QGKBHfiAYsEIuMBjAQi5AGNBCLlAY4EIuYBjwQi5wGRBCLoAZMEPukBlAR46gGWBCLrAZgEPuwBmQR57QGaBCLuAZsEIu8BnAQ-8gGfBHrzAaAEgAH0AaEECvUBogQK9gGjBAr3AaQECvgBpQQK-QGnBAr6AakEPvsBqgSBAfwBrQQK_QGvBD7-AbAEggH_AbIECoACswQKgQK0BD6CArcEgwGDArgEiQGEArkEC4UCugQLhgK7BAuHArwEC4gCvQQLiQK_BAuKAsEEPosCwgSKAYwCxgQLjQLIBD6OAskEiwGPAswEC5ACzQQLkQLOBD6SAtEEjAGTAtIEkAGUAtMECJUC1AQIlgLVBAiXAtYECJgC1wQImQLZBAiaAtsEPpsC3ASRAZwC3wQInQLhBD6eAuIEkgGfAuQECKAC5QQIoQLmBD6iAukEkwGjAuoElwGkAusEB6UC7AQHpgLtBAenAu4EB6gC7wQHqQLxBAeqAvMEPqsC9ASYAawC9wQHrQL5BD6uAvoEmQGvAvwEB7AC_QQHsQL-BD6yAoEFmgGzAoIFngG0AoQFBrUChQUGtgKHBQa3AogFBrgCiQUGuQKLBQa6Ao0FPrsCjgWfAbwCkAUGvQKSBT6-ApMFoAG_ApQFBsAClQUGwQKWBT7CApkFoQHDApoFpQHEApsFLsUCnAUuxgKdBS7HAp4FLsgCnwUuyQKhBS7KAqMFPssCpAWmAcwCqAUuzQKqBT7OAqsFpwHPAq4FLtACrwUu0QKwBT7SArMFqAHTArQFrgHUArUFN9UCtgU31gK3BTfXArgFN9gCuQU32QK7BTfaAr0FPtsCvgWvAdwCwQU33QLDBT7eAsQFsAHfAsYFN-ACxwU34QLIBT7iAssFsQHjAswFtQHkAs0FGuUCzgUa5gLPBRrnAtAFGugC0QUa6QLTBRrqAtUFPusC1gW2AewC3AUa7QLeBT7uAt8FtwHvAuQFGvAC5QUa8QLmBT7yAukFuAHzAuoFvAH0AusFM_UC7AUz9gLtBTP3Au4FM_gC7wUz-QLxBTP6AvMFPvsC9AW9AfwC9gUz_QL4BT7-AvkFvgH_AvoFM4AD-wUzgQP8BT6CA_8FvwGDA4AGwwGEA4EGNIUDggY0hgODBjSHA4QGNIgDhQY0iQOHBjSKA4kGPosDigbEAYwDjAY0jQOOBj6OA48GxQGPA5AGNJADkQY0kQOSBj6SA5UGxgGTA5YGygGUA5cGNZUDmAY1lgOZBjWXA5oGNZgDmwY1mQOdBjWaA58GPpsDoAbLAZwDogY1nQOkBj6eA6UGzAGfA6YGNaADpwY1oQOoBj6iA6sGzQGjA6wG0QGkA60GGKUDrgYYpgOvBhinA7AGGKgDsQYYqQOzBhiqA7UGPqsDtgbSAawDuAYYrQO6Bj6uA7sG0wGvA7wGGLADvQYYsQO-Bj6yA8EG1AGzA8IG2gG0A8MGF7UDxAYXtgPFBhe3A8YGF7gDxwYXuQPJBhe6A8sGPrsDzAbbAbwDzgYXvQPQBj6-A9EG3AG_A9IGF8AD0wYXwQPUBj7CA9cG3QHDA9gG4wHEA9oGMcUD2wYxxgPdBjHHA94GMcgD3wYxyQPhBjHKA-MGPssD5AbkAcwD5gYxzQPoBj7OA-kG5QHPA-oGMdAD6wYx0QPsBj7SA-8G5gHTA_AG6gHUA_EGMtUD8gYy1gPzBjLXA_QGMtgD9QYy2QP3BjLaA_kGPtsD-gbrAdwD_AYy3QP-Bj7eA_8G7AHfA4AHMuADgQcy4QOCBz7iA4UH7QHjA4YH8wHkA4gHKuUDiQcq5gOMByrnA40HKugDjgcq6QOQByrqA5IHPusDkwf0AewDlQcq7QOXBz7uA5gH9QHvA5kHKvADmgcq8QObBz7yA54H9gHzA58H-gH0A6EHFfUDogcV9gOlBxX3A6YHFfgDpwcV-QOpBxX6A6sHPvsDrAf7AfwDrgcV_QOwBz7-A7EH_AH_A7IHFYAEswcVgQS0Bz6CBLcH_QGDBLgHgQKEBLkHCYUEugcJhgS7BwmHBLwHCYgEvQcJiQS_BwmKBMEHPosEwgeCAowExAcJjQTGBz6OBMcHgwKPBMgHCZAEyQcJkQTKBz6SBM0HhAKTBM4HigKUBM8HDJUE0AcMlgTRBwyXBNIHDJgE0wcMmQTVBwyaBNcHPpsE2AeLApwE3AcMnQTeBz6eBN8HjAKfBOIHDKAE4wcMoQTkBz6iBOcHjQKjBOgHkQKkBOkHDaUE6gcNpgTrBw2nBOwHDagE7QcNqQTvBw2qBPEHPqsE8geSAqwE9wcNrQT5Bz6uBPoHkwKvBP4HDbAE_wcNsQSACD6yBIMIlAKzBIQImAK0BIUID7UEhggPtgSHCA-3BIgID7gEiQgPuQSLCA-6BI0IPrsEjgiZArwEkggPvQSUCD6-BJUImgK_BJgID8AEmQgPwQSaCD7CBJ0ImwLDBJ4IoQLEBKAIDsUEoQgOxgSjCA7HBKQIDsgEpQgOyQSnCA7KBKkIPssEqgiiAswErAgOzQSuCD7OBK8IowLPBLAIDtAEsQgO0QSyCD7SBLUIpALTBLYIqALUBLgIO9UEuQg71gS7CDvXBLwIO9gEvQg72QS_CDvaBMEIPtsEwgipAtwExAg73QTGCD7eBMcIqgLfBMgIO-AEyQg74QTKCD7iBM0IqwLjBM4IrwLkBM8IFOUE0AgU5gTRCBTnBNIIFOgE0wgU6QTVCBTqBNcIPusE2AiwAuwE3AgU7QTeCD7uBN8IsQLvBOIIFPAE4wgU8QTkCD7yBOcIsgLzBOgItgL0BOkIE_UE6ggT9gTrCBP3BOwIE_gE7QgT-QTvCBP6BPEIPvsE8gi3AvwE9QgT_QT3CD7-BPgIuAL_BPoIE4AF-wgTgQX8CD6CBf8IuQKDBYAJvQKEBYEJL4UFggkvhgWDCS-HBYQJL4gFhQkviQWHCS-KBYkJPosFigm-AowFjQkvjQWPCT6OBZAJvwKPBZIJL5AFkwkvkQWUCT6SBZcJwAKTBZgJxgKUBZkJJZUFmgkllgWbCSWXBZwJJZgFnQklmQWfCSWaBaEJPpsFognHApwFpQklnQWnCT6eBagJyAKfBaoJJaAFqwkloQWsCT6iBa8JyQKjBbAJzwKkBbEJKaUFsgkppgWzCSmnBbQJKagFtQkpqQW3CSmqBbkJPqsFugnQAqwFvwkprQXBCT6uBcIJ0QKvBcYJKbAFxwkpsQXICT6yBcsJ0gKzBcwJ1gK0Bc0JEbUFzgkRtgXPCRG3BdAJEbgF0QkRuQXTCRG6BdUJPrsF1gnXArwF2QkRvQXbCT6-BdwJ2AK_Bd4JEcAF3wkRwQXgCT7CBeMJ2QLDBeQJ3QLEBeUJEsUF5gkSxgXnCRLHBegJEsgF6QkSyQXrCRLKBe0JPssF7gneAswF8QkSzQXzCT7OBfQJ3wLPBfYJEtAF9wkS0QX4CT7SBfsJ4ALTBfwJ5ALUBf0JENUF_gkQ1gX_CRDXBYAKENgFgQoQ2QWDChDaBYUKPtsFhgrlAtwFiQoQ3QWLCj7eBYwK5gLfBY4KEOAFjwoQ4QWQCj7iBZMK5wLjBZQK6wLkBZYKOuUFlwo65gWZCjrnBZoKOugFmwo66QWdCjrqBZ8KPusFoArsAuwFogo67QWkCj7uBaUK7QLvBaYKOvAFpwo68QWoCj7yBasK7gLzBawK8gL0Ba0KBfUFrgoF9gWvCgX3BbAKBfgFsQoF-QWzCgX6BbUKPvsFtgrzAvwFuAoF_QW6Cj7-BbsK9AL_BbwKBYAGvQoFgQa-Cj6CBsEK9QKDBsIK-QI"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AdminProfileScalarFieldEnum: () => AdminProfileScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AttendanceScalarFieldEnum: () => AttendanceScalarFieldEnum,
  BatchScalarFieldEnum: () => BatchScalarFieldEnum,
  ClassRoomScalarFieldEnum: () => ClassRoomScalarFieldEnum,
  CourseRegistrationScalarFieldEnum: () => CourseRegistrationScalarFieldEnum,
  CourseScalarFieldEnum: () => CourseScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DepartmentScalarFieldEnum: () => DepartmentScalarFieldEnum,
  DepartmentSemesterFeeConfigurationScalarFieldEnum: () => DepartmentSemesterFeeConfigurationScalarFieldEnum,
  EmailOtpScalarFieldEnum: () => EmailOtpScalarFieldEnum,
  FacultyScalarFieldEnum: () => FacultyScalarFieldEnum,
  InstitutionApplicationScalarFieldEnum: () => InstitutionApplicationScalarFieldEnum,
  InstitutionLeaveRequestScalarFieldEnum: () => InstitutionLeaveRequestScalarFieldEnum,
  InstitutionPaymentGatewayCredentialScalarFieldEnum: () => InstitutionPaymentGatewayCredentialScalarFieldEnum,
  InstitutionScalarFieldEnum: () => InstitutionScalarFieldEnum,
  InstitutionSubscriptionRenewalPaymentScalarFieldEnum: () => InstitutionSubscriptionRenewalPaymentScalarFieldEnum,
  InstitutionSubscriptionScalarFieldEnum: () => InstitutionSubscriptionScalarFieldEnum,
  InstitutionTransferRequestScalarFieldEnum: () => InstitutionTransferRequestScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  ModelName: () => ModelName,
  NoticeReadScalarFieldEnum: () => NoticeReadScalarFieldEnum,
  NoticeRecipientRoleScalarFieldEnum: () => NoticeRecipientRoleScalarFieldEnum,
  NoticeScalarFieldEnum: () => NoticeScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProgramScalarFieldEnum: () => ProgramScalarFieldEnum,
  QueryMode: () => QueryMode,
  RoutineScalarFieldEnum: () => RoutineScalarFieldEnum,
  ScheduleScalarFieldEnum: () => ScheduleScalarFieldEnum,
  SectionCourseTeacherAssignmentScalarFieldEnum: () => SectionCourseTeacherAssignmentScalarFieldEnum,
  SectionScalarFieldEnum: () => SectionScalarFieldEnum,
  SemesterScalarFieldEnum: () => SemesterScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  StudentAdmissionApplicationScalarFieldEnum: () => StudentAdmissionApplicationScalarFieldEnum,
  StudentAdmissionPostScalarFieldEnum: () => StudentAdmissionPostScalarFieldEnum,
  StudentApplicationProfileScalarFieldEnum: () => StudentApplicationProfileScalarFieldEnum,
  StudentClassworkSubmissionScalarFieldEnum: () => StudentClassworkSubmissionScalarFieldEnum,
  StudentFeePaymentScalarFieldEnum: () => StudentFeePaymentScalarFieldEnum,
  StudentProfileScalarFieldEnum: () => StudentProfileScalarFieldEnum,
  TeacherApplicationProfileScalarFieldEnum: () => TeacherApplicationProfileScalarFieldEnum,
  TeacherClassworkScalarFieldEnum: () => TeacherClassworkScalarFieldEnum,
  TeacherJobApplicationScalarFieldEnum: () => TeacherJobApplicationScalarFieldEnum,
  TeacherJobPostScalarFieldEnum: () => TeacherJobPostScalarFieldEnum,
  TeacherMarkScalarFieldEnum: () => TeacherMarkScalarFieldEnum,
  TeacherProfileScalarFieldEnum: () => TeacherProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.6.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  AdminProfile: "AdminProfile",
  Attendance: "Attendance",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  EmailOtp: "EmailOtp",
  Batch: "Batch",
  ClassRoom: "ClassRoom",
  Course: "Course",
  CourseRegistration: "CourseRegistration",
  Department: "Department",
  Faculty: "Faculty",
  Institution: "Institution",
  InstitutionApplication: "InstitutionApplication",
  InstitutionLeaveRequest: "InstitutionLeaveRequest",
  InstitutionTransferRequest: "InstitutionTransferRequest",
  Notice: "Notice",
  NoticeRecipientRole: "NoticeRecipientRole",
  NoticeRead: "NoticeRead",
  DepartmentSemesterFeeConfiguration: "DepartmentSemesterFeeConfiguration",
  StudentFeePayment: "StudentFeePayment",
  InstitutionPaymentGatewayCredential: "InstitutionPaymentGatewayCredential",
  InstitutionSubscriptionRenewalPayment: "InstitutionSubscriptionRenewalPayment",
  TeacherJobPost: "TeacherJobPost",
  StudentAdmissionPost: "StudentAdmissionPost",
  Program: "Program",
  Routine: "Routine",
  Schedule: "Schedule",
  Section: "Section",
  Semester: "Semester",
  StudentApplicationProfile: "StudentApplicationProfile",
  StudentAdmissionApplication: "StudentAdmissionApplication",
  StudentProfile: "StudentProfile",
  InstitutionSubscription: "InstitutionSubscription",
  TeacherMark: "TeacherMark",
  TeacherJobApplication: "TeacherJobApplication",
  TeacherClasswork: "TeacherClasswork",
  StudentClassworkSubmission: "StudentClassworkSubmission",
  SectionCourseTeacherAssignment: "SectionCourseTeacherAssignment",
  TeacherApplicationProfile: "TeacherApplicationProfile",
  TeacherProfile: "TeacherProfile"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminProfileScalarFieldEnum = {
  id: "id",
  role: "role",
  userId: "userId",
  institutionId: "institutionId",
  activeDepartmentId: "activeDepartmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AttendanceScalarFieldEnum = {
  id: "id",
  date: "date",
  status: "status",
  courseRegistrationId: "courseRegistrationId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  contactNo: "contactNo",
  presentAddress: "presentAddress",
  permanentAddress: "permanentAddress",
  bloodGroup: "bloodGroup",
  gender: "gender",
  bio: "bio",
  role: "role",
  accountStatus: "accountStatus"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EmailOtpScalarFieldEnum = {
  id: "id",
  userId: "userId",
  otpHash: "otpHash",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BatchScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  institutionId: "institutionId",
  departmentId: "departmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ClassRoomScalarFieldEnum = {
  id: "id",
  name: "name",
  roomNo: "roomNo",
  floor: "floor",
  capacity: "capacity",
  roomType: "roomType",
  institutionId: "institutionId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CourseScalarFieldEnum = {
  id: "id",
  courseCode: "courseCode",
  courseTitle: "courseTitle",
  description: "description",
  credits: "credits",
  institutionId: "institutionId",
  departmentId: "departmentId",
  programId: "programId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CourseRegistrationScalarFieldEnum = {
  id: "id",
  courseId: "courseId",
  studentProfileId: "studentProfileId",
  teacherProfileId: "teacherProfileId",
  sectionId: "sectionId",
  departmentId: "departmentId",
  programId: "programId",
  semesterId: "semesterId",
  institutionId: "institutionId",
  registrationDate: "registrationDate",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DepartmentScalarFieldEnum = {
  id: "id",
  fullName: "fullName",
  shortName: "shortName",
  description: "description",
  facultyId: "facultyId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var FacultyScalarFieldEnum = {
  id: "id",
  fullName: "fullName",
  shortName: "shortName",
  description: "description",
  institutionId: "institutionId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InstitutionScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  shortName: "shortName",
  type: "type",
  institutionLogo: "institutionLogo",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InstitutionApplicationScalarFieldEnum = {
  id: "id",
  applicantUserId: "applicantUserId",
  institutionName: "institutionName",
  description: "description",
  shortName: "shortName",
  institutionType: "institutionType",
  institutionLogo: "institutionLogo",
  subscriptionPlan: "subscriptionPlan",
  subscriptionAmount: "subscriptionAmount",
  subscriptionCurrency: "subscriptionCurrency",
  subscriptionMonths: "subscriptionMonths",
  subscriptionPaymentStatus: "subscriptionPaymentStatus",
  subscriptionTranId: "subscriptionTranId",
  subscriptionGatewayStatus: "subscriptionGatewayStatus",
  subscriptionGatewaySessionKey: "subscriptionGatewaySessionKey",
  subscriptionGatewayValId: "subscriptionGatewayValId",
  subscriptionGatewayBankTranId: "subscriptionGatewayBankTranId",
  subscriptionGatewayCardType: "subscriptionGatewayCardType",
  subscriptionGatewayRawPayload: "subscriptionGatewayRawPayload",
  subscriptionPaidAt: "subscriptionPaidAt",
  status: "status",
  rejectionReason: "rejectionReason",
  reviewedByUserId: "reviewedByUserId",
  reviewedAt: "reviewedAt",
  institutionId: "institutionId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InstitutionLeaveRequestScalarFieldEnum = {
  id: "id",
  requesterUserId: "requesterUserId",
  requesterRole: "requesterRole",
  institutionId: "institutionId",
  status: "status",
  reason: "reason",
  reviewedByUserId: "reviewedByUserId",
  reviewedAt: "reviewedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InstitutionTransferRequestScalarFieldEnum = {
  id: "id",
  entityType: "entityType",
  status: "status",
  sourceInstitutionId: "sourceInstitutionId",
  targetInstitutionId: "targetInstitutionId",
  requesterUserId: "requesterUserId",
  reviewerUserId: "reviewerUserId",
  studentProfileId: "studentProfileId",
  teacherProfileId: "teacherProfileId",
  targetDepartmentId: "targetDepartmentId",
  requestMessage: "requestMessage",
  responseMessage: "responseMessage",
  requestedAt: "requestedAt",
  reviewedAt: "reviewedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NoticeScalarFieldEnum = {
  id: "id",
  title: "title",
  content: "content",
  institutionId: "institutionId",
  senderUserId: "senderUserId",
  senderRole: "senderRole",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NoticeRecipientRoleScalarFieldEnum = {
  id: "id",
  noticeId: "noticeId",
  role: "role",
  createdAt: "createdAt"
};
var NoticeReadScalarFieldEnum = {
  id: "id",
  noticeId: "noticeId",
  userId: "userId",
  readAt: "readAt"
};
var DepartmentSemesterFeeConfigurationScalarFieldEnum = {
  id: "id",
  institutionId: "institutionId",
  departmentId: "departmentId",
  semesterId: "semesterId",
  totalFeeAmount: "totalFeeAmount",
  monthlyFeeAmount: "monthlyFeeAmount",
  currency: "currency",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StudentFeePaymentScalarFieldEnum = {
  id: "id",
  institutionId: "institutionId",
  departmentId: "departmentId",
  semesterId: "semesterId",
  studentProfileId: "studentProfileId",
  feeConfigurationId: "feeConfigurationId",
  paymentMode: "paymentMode",
  status: "status",
  monthsCovered: "monthsCovered",
  amount: "amount",
  currency: "currency",
  gatewayName: "gatewayName",
  tranId: "tranId",
  gatewaySessionKey: "gatewaySessionKey",
  gatewayValId: "gatewayValId",
  gatewayBankTranId: "gatewayBankTranId",
  gatewayCardType: "gatewayCardType",
  gatewayStatus: "gatewayStatus",
  gatewayRawPayload: "gatewayRawPayload",
  paymentInitiatedAt: "paymentInitiatedAt",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InstitutionPaymentGatewayCredentialScalarFieldEnum = {
  id: "id",
  institutionId: "institutionId",
  sslCommerzStoreIdEncrypted: "sslCommerzStoreIdEncrypted",
  sslCommerzStorePasswordEncrypted: "sslCommerzStorePasswordEncrypted",
  sslCommerzBaseUrlEncrypted: "sslCommerzBaseUrlEncrypted",
  sslCommerzStoreIdHash: "sslCommerzStoreIdHash",
  sslCommerzStorePasswordHash: "sslCommerzStorePasswordHash",
  sslCommerzBaseUrlHash: "sslCommerzBaseUrlHash",
  isActive: "isActive",
  lastUpdatedByUserId: "lastUpdatedByUserId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InstitutionSubscriptionRenewalPaymentScalarFieldEnum = {
  id: "id",
  institutionId: "institutionId",
  initiatedByUserId: "initiatedByUserId",
  plan: "plan",
  amount: "amount",
  currency: "currency",
  monthsCovered: "monthsCovered",
  status: "status",
  tranId: "tranId",
  gatewayStatus: "gatewayStatus",
  gatewaySessionKey: "gatewaySessionKey",
  gatewayValId: "gatewayValId",
  gatewayBankTranId: "gatewayBankTranId",
  gatewayCardType: "gatewayCardType",
  gatewayRawPayload: "gatewayRawPayload",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeacherJobPostScalarFieldEnum = {
  id: "id",
  title: "title",
  location: "location",
  summary: "summary",
  details: "details",
  institutionId: "institutionId",
  facultyId: "facultyId",
  departmentId: "departmentId",
  programId: "programId",
  createdByUserId: "createdByUserId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StudentAdmissionPostScalarFieldEnum = {
  id: "id",
  title: "title",
  location: "location",
  summary: "summary",
  details: "details",
  institutionId: "institutionId",
  facultyId: "facultyId",
  departmentId: "departmentId",
  programId: "programId",
  createdByUserId: "createdByUserId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProgramScalarFieldEnum = {
  id: "id",
  title: "title",
  shortTitle: "shortTitle",
  description: "description",
  duration: "duration",
  credits: "credits",
  cost: "cost",
  institutionId: "institutionId",
  departmentId: "departmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var RoutineScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  version: "version",
  scheduleId: "scheduleId",
  courseRegistrationId: "courseRegistrationId",
  classRoomId: "classRoomId",
  institutionId: "institutionId",
  departmentId: "departmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ScheduleScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  semesterId: "semesterId",
  institutionId: "institutionId",
  departmentId: "departmentId",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SectionScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  sectionCapacity: "sectionCapacity",
  institutionId: "institutionId",
  departmentId: "departmentId",
  semesterId: "semesterId",
  batchId: "batchId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SemesterScalarFieldEnum = {
  id: "id",
  name: "name",
  startDate: "startDate",
  endDate: "endDate",
  institutionId: "institutionId"
};
var StudentApplicationProfileScalarFieldEnum = {
  id: "id",
  studentUserId: "studentUserId",
  headline: "headline",
  about: "about",
  documentUrls: "documentUrls",
  academicRecords: "academicRecords",
  isComplete: "isComplete",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StudentAdmissionApplicationScalarFieldEnum = {
  id: "id",
  coverLetter: "coverLetter",
  status: "status",
  institutionResponse: "institutionResponse",
  reviewedAt: "reviewedAt",
  appliedAt: "appliedAt",
  postingId: "postingId",
  studentUserId: "studentUserId",
  reviewerUserId: "reviewerUserId",
  studentProfileId: "studentProfileId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StudentProfileScalarFieldEnum = {
  id: "id",
  studentsId: "studentsId",
  bio: "bio",
  institutionId: "institutionId",
  departmentId: "departmentId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InstitutionSubscriptionScalarFieldEnum = {
  id: "id",
  institutionId: "institutionId",
  sourceApplicationId: "sourceApplicationId",
  plan: "plan",
  status: "status",
  amount: "amount",
  currency: "currency",
  monthsCovered: "monthsCovered",
  startsAt: "startsAt",
  endsAt: "endsAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeacherMarkScalarFieldEnum = {
  id: "id",
  courseRegistrationId: "courseRegistrationId",
  teacherProfileId: "teacherProfileId",
  institutionId: "institutionId",
  departmentId: "departmentId",
  labReport: "labReport",
  labTask: "labTask",
  project: "project",
  projectReport: "projectReport",
  presentation: "presentation",
  labEvaluation: "labEvaluation",
  viva: "viva",
  quiz1: "quiz1",
  quiz2: "quiz2",
  quiz3: "quiz3",
  assignment: "assignment",
  midterm: "midterm",
  finalExam: "finalExam",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeacherJobApplicationScalarFieldEnum = {
  id: "id",
  coverLetter: "coverLetter",
  status: "status",
  institutionResponse: "institutionResponse",
  reviewedAt: "reviewedAt",
  appliedAt: "appliedAt",
  postingId: "postingId",
  teacherUserId: "teacherUserId",
  reviewerUserId: "reviewerUserId",
  teacherProfileId: "teacherProfileId",
  institutionId: "institutionId",
  departmentId: "departmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeacherClassworkScalarFieldEnum = {
  id: "id",
  title: "title",
  content: "content",
  type: "type",
  dueAt: "dueAt",
  sectionId: "sectionId",
  teacherProfileId: "teacherProfileId",
  institutionId: "institutionId",
  departmentId: "departmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StudentClassworkSubmissionScalarFieldEnum = {
  id: "id",
  classworkId: "classworkId",
  studentProfileId: "studentProfileId",
  responseText: "responseText",
  attachmentUrl: "attachmentUrl",
  attachmentName: "attachmentName",
  submittedAt: "submittedAt",
  institutionId: "institutionId",
  departmentId: "departmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SectionCourseTeacherAssignmentScalarFieldEnum = {
  id: "id",
  sectionId: "sectionId",
  courseId: "courseId",
  teacherProfileId: "teacherProfileId",
  institutionId: "institutionId",
  departmentId: "departmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeacherApplicationProfileScalarFieldEnum = {
  id: "id",
  teacherUserId: "teacherUserId",
  headline: "headline",
  about: "about",
  resumeUrl: "resumeUrl",
  portfolioUrl: "portfolioUrl",
  skills: "skills",
  certifications: "certifications",
  academicRecords: "academicRecords",
  experiences: "experiences",
  isComplete: "isComplete",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeacherProfileScalarFieldEnum = {
  id: "id",
  teacherInitial: "teacherInitial",
  teachersId: "teachersId",
  designation: "designation",
  bio: "bio",
  institutionId: "institutionId",
  departmentId: "departmentId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var __filename = fileURLToPath2(import.meta.url);
var __dirname = path2.dirname(__filename);
dotenv.config({
  path: path2.resolve(__dirname, "../../../.env"),
  override: false
});
var normalizeEnv = (value) => value?.trim().replace(/^"(.*)"$/, "$1");
var connectionString = normalizeEnv(process.env.DATABASE_URL) || normalizeEnv(process.env.POSTGRES_PRISMA_URL) || normalizeEnv(process.env.POSTGRES_URL);
var safeConnectionString = connectionString ?? "postgresql://invalid:invalid@127.0.0.1:5432/invalid";
if (!connectionString) {
  console.error(
    "Database connection string is not set. Provide DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL in your deployment environment."
  );
}
var adapter = new PrismaPg({ connectionString: safeConnectionString });
var prisma = new PrismaClient({ adapter });

// src/app/middleware/requireSessionRole.ts
async function resolveInstitutionIdForUser(user) {
  if (user.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId: user.id
      },
      select: {
        institutionId: true
      }
    });
    return adminProfile?.institutionId ?? null;
  }
  if (user.role === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: {
        userId: user.id
      },
      select: {
        institutionId: true
      }
    });
    return teacherProfile?.institutionId ?? null;
  }
  if (user.role === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        userId: user.id
      },
      select: {
        institutionId: true
      }
    });
    return studentProfile?.institutionId ?? null;
  }
  return null;
}
async function hasActiveInstitutionSubscription(institutionId) {
  const activeSubscription = await prisma.institutionSubscription.findFirst({
    where: {
      institutionId,
      status: "ACTIVE",
      endsAt: {
        gt: /* @__PURE__ */ new Date()
      }
    },
    select: {
      id: true
    }
  });
  return Boolean(activeSubscription?.id);
}
function canBypassSubscriptionExpiry(user, req) {
  const normalizedOriginalUrl = req.originalUrl?.split("?")[0] ?? "";
  const normalizedPath = req.path ?? "";
  const normalizedRoutePath = `${req.baseUrl ?? ""}${req.path ?? ""}`;
  const isRenewInitiateRoute = normalizedOriginalUrl === "/api/v1/institution-admin/subscription/renew/initiate" || normalizedPath === "/subscription/renew/initiate" || normalizedRoutePath === "/api/v1/institution-admin/subscription/renew/initiate";
  if (user.role === "ADMIN" && isRenewInitiateRoute) {
    return true;
  }
  const canRequestLeave = user.role === "TEACHER" || user.role === "STUDENT";
  const isLeaveRoute = normalizedOriginalUrl === "/api/v1/auth/leave-institution" || normalizedPath === "/leave-institution" || normalizedRoutePath === "/api/v1/auth/leave-institution";
  if (canRequestLeave && isLeaveRoute) {
    return true;
  }
  return false;
}
var SESSION_COOKIE_KEYS = [
  "__Secure-better-auth.session_token",
  "better-auth.session_token",
  "better-auth.session-token",
  "session_token",
  "auth_token"
];
function getCookieMap(cookieHeader) {
  const cookieMap = /* @__PURE__ */ new Map();
  if (!cookieHeader) {
    return cookieMap;
  }
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawKey, ...rawValueParts] = part.trim().split("=");
    if (!rawKey) {
      continue;
    }
    const value = rawValueParts.join("=");
    cookieMap.set(rawKey, decodeURIComponent(value ?? ""));
  }
  return cookieMap;
}
function getSessionTokenFromRequest(req) {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader?.toLowerCase().startsWith("bearer ")) {
    const bearerToken = authorizationHeader.slice("bearer ".length).trim();
    if (bearerToken) {
      return bearerToken;
    }
  }
  const cookieHeader = req.headers.cookie;
  const cookieMap = getCookieMap(cookieHeader);
  for (const key of SESSION_COOKIE_KEYS) {
    const token = cookieMap.get(key);
    if (token) {
      return token;
    }
  }
  return void 0;
}
async function resolveUserFromSessionToken(sessionToken) {
  const session = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          role: true,
          accountStatus: true
        }
      }
    }
  });
  if (!session?.user) {
    return null;
  }
  if (session.expiresAt.getTime() <= Date.now()) {
    return null;
  }
  return {
    id: session.user.id,
    role: session.user.role,
    accountStatus: session.user.accountStatus
  };
}
var requireSessionRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const sessionToken = getSessionTokenFromRequest(req);
      if (!sessionToken) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }
      const user = await resolveUserFromSessionToken(sessionToken);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: insufficient role"
        });
      }
      if (user.accountStatus === AccountStatus.PENDING) {
        return res.status(403).json({
          success: false,
          message: "Account verification is required"
        });
      }
      if (user.role !== "SUPERADMIN") {
        if (canBypassSubscriptionExpiry(user, req)) {
          req.authUser = user;
          res.locals.authUser = user;
          next();
          return;
        }
        const institutionId = await resolveInstitutionIdForUser(user);
        if (institutionId) {
          const hasActiveSubscription = await hasActiveInstitutionSubscription(institutionId);
          if (!hasActiveSubscription) {
            return res.status(402).json({
              success: false,
              code: "INSTITUTION_SUBSCRIPTION_EXPIRED",
              message: "This portal subscription has expired for your institution. Please contact your institution admin."
            });
          }
        }
      }
      req.authUser = user;
      res.locals.authUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var requireAdminRole = () => requireSessionRole("ADMIN");

// src/app/module/classroom/classroom.service.ts
function createHttpError2(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch(search) {
  const value = search?.trim();
  return value || void 0;
}
async function resolveAcademicContext(userId) {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError2(403, "Only institution academic admins can access this resource");
  }
  return adminProfile;
}
function assertCanManageRooms(adminRole) {
  if (adminRole !== AdminRole.FACULTYADMIN && adminRole !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError2(403, "Only faculty and institution admins can manage rooms");
  }
}
var listClassrooms = async (userId, search) => {
  const context = await resolveAcademicContext(userId);
  const normalizedSearch = normalizeSearch(search);
  return prisma.classRoom.findMany({
    where: {
      institutionId: context.institutionId,
      ...normalizedSearch ? {
        OR: [
          { name: { contains: normalizedSearch, mode: "insensitive" } },
          { roomNo: { contains: normalizedSearch, mode: "insensitive" } },
          { floor: { contains: normalizedSearch, mode: "insensitive" } }
        ]
      } : {}
    },
    orderBy: [{ floor: "asc" }, { roomNo: "asc" }, { createdAt: "desc" }]
  });
};
var createClassroom = async (userId, payload) => {
  const context = await resolveAcademicContext(userId);
  assertCanManageRooms(context.role);
  const duplicate = await prisma.classRoom.findFirst({
    where: {
      institutionId: context.institutionId,
      roomNo: {
        equals: payload.roomNo.trim(),
        mode: "insensitive"
      },
      floor: {
        equals: payload.floor.trim(),
        mode: "insensitive"
      }
    },
    select: {
      id: true
    }
  });
  if (duplicate) {
    throw createHttpError2(409, "A room with this room number and floor already exists");
  }
  return prisma.classRoom.create({
    data: {
      name: payload.name?.trim() || null,
      roomNo: payload.roomNo.trim(),
      floor: payload.floor.trim(),
      capacity: payload.capacity,
      roomType: payload.roomType,
      institutionId: context.institutionId
    }
  });
};
var updateClassroom = async (userId, classroomId, payload) => {
  const context = await resolveAcademicContext(userId);
  assertCanManageRooms(context.role);
  const current = await prisma.classRoom.findFirst({
    where: {
      id: classroomId,
      institutionId: context.institutionId
    },
    select: {
      id: true,
      roomNo: true,
      floor: true
    }
  });
  if (!current) {
    throw createHttpError2(404, "Room not found for this institution");
  }
  const nextRoomNo = payload.roomNo?.trim() ?? current.roomNo;
  const nextFloor = payload.floor?.trim() ?? current.floor;
  const duplicate = await prisma.classRoom.findFirst({
    where: {
      id: {
        not: classroomId
      },
      institutionId: context.institutionId,
      roomNo: {
        equals: nextRoomNo,
        mode: "insensitive"
      },
      floor: {
        equals: nextFloor,
        mode: "insensitive"
      }
    },
    select: {
      id: true
    }
  });
  if (duplicate) {
    throw createHttpError2(409, "A room with this room number and floor already exists");
  }
  return prisma.classRoom.update({
    where: {
      id: classroomId
    },
    data: {
      name: payload.name === void 0 ? void 0 : payload.name.trim() || null,
      roomNo: payload.roomNo?.trim(),
      floor: payload.floor?.trim(),
      capacity: payload.capacity,
      roomType: payload.roomType
    }
  });
};
var deleteClassroom = async (userId, classroomId) => {
  const context = await resolveAcademicContext(userId);
  assertCanManageRooms(context.role);
  const room = await prisma.classRoom.findFirst({
    where: {
      id: classroomId,
      institutionId: context.institutionId
    },
    select: {
      id: true
    }
  });
  if (!room) {
    throw createHttpError2(404, "Room not found for this institution");
  }
  const assignedRoutine = await prisma.routine.findFirst({
    where: {
      classRoomId: classroomId,
      institutionId: context.institutionId
    },
    select: {
      id: true
    }
  });
  if (assignedRoutine) {
    throw createHttpError2(409, "Cannot delete room because routines are assigned to it");
  }
  await prisma.classRoom.delete({
    where: {
      id: classroomId
    }
  });
  return {
    id: classroomId
  };
};
var ClassroomService = {
  listClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom
};

// src/app/module/classroom/classroom.controller.ts
var readParam = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
var listClassrooms2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await ClassroomService.listClassrooms(user.id, readQueryValue(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Rooms fetched successfully",
    data: result
  });
});
var createClassroom2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await ClassroomService.createClassroom(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Room created successfully",
    data: result
  });
});
var updateClassroom2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await ClassroomService.updateClassroom(user.id, readParam(req.params.classroomId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Room updated successfully",
    data: result
  });
});
var deleteClassroom2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await ClassroomService.deleteClassroom(user.id, readParam(req.params.classroomId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Room deleted successfully",
    data: result
  });
});
var ClassroomController = {
  listClassrooms: listClassrooms2,
  createClassroom: createClassroom2,
  updateClassroom: updateClassroom2,
  deleteClassroom: deleteClassroom2
};

// src/app/module/classroom/classroom.validation.ts
import { z as z2 } from "zod";
var uuidSchema = z2.uuid("Please provide a valid id");
var ClassroomValidation = {
  createClassroomSchema: z2.object({
    body: z2.object({
      name: z2.string("Room name must be a string").trim().max(120).optional(),
      roomNo: z2.string("Room number is required").trim().min(1).max(40),
      floor: z2.string("Floor is required").trim().min(1).max(40),
      capacity: z2.number("Capacity must be a number").int().positive().max(2e3),
      roomType: z2.enum(ClassRoomType)
    })
  }),
  updateClassroomSchema: z2.object({
    params: z2.object({
      classroomId: uuidSchema
    }),
    body: z2.object({
      name: z2.string("Room name must be a string").trim().max(120).optional(),
      roomNo: z2.string("Room number must be a string").trim().min(1).max(40).optional(),
      floor: z2.string("Floor must be a string").trim().min(1).max(40).optional(),
      capacity: z2.number("Capacity must be a number").int().positive().max(2e3).optional(),
      roomType: z2.enum(ClassRoomType).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteClassroomSchema: z2.object({
    params: z2.object({
      classroomId: uuidSchema
    })
  })
};

// src/app/module/classroom/classroom.route.ts
var router2 = Router2();
router2.get("/", requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"), ClassroomController.listClassrooms);
router2.post(
  "/",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(ClassroomValidation.createClassroomSchema),
  ClassroomController.createClassroom
);
router2.patch(
  "/:classroomId",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(ClassroomValidation.updateClassroomSchema),
  ClassroomController.updateClassroom
);
router2.delete(
  "/:classroomId",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(ClassroomValidation.deleteClassroomSchema),
  ClassroomController.deleteClassroom
);
var ClassroomRouter = router2;

// src/app/module/department/department.route.ts
import { Router as Router3 } from "express";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/shared/originPolicy.ts
var LOCAL_DEV_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];
function normalizeOrigin(value) {
  return value.trim().replace(/\/$/, "");
}
function parseOriginList(rawValue) {
  if (!rawValue) {
    return [];
  }
  return rawValue.split(",").map((item) => normalizeOrigin(item)).filter(Boolean);
}
function parsePreviewPattern(rawPattern) {
  if (!rawPattern) {
    return null;
  }
  try {
    return new RegExp(rawPattern);
  } catch {
    return null;
  }
}
function buildOriginPolicy() {
  const exactOrigins = /* @__PURE__ */ new Set([
    ...LOCAL_DEV_ORIGINS,
    ...parseOriginList(process.env.FRONTEND_PUBLIC_URL),
    ...parseOriginList(process.env.FRONTEND_ALLOWED_ORIGINS)
  ]);
  const previewOriginPattern = parsePreviewPattern(process.env.FRONTEND_PREVIEW_URL_PATTERN);
  return {
    exactOrigins,
    previewOriginPattern,
    isAllowedOrigin(origin) {
      const normalizedOrigin = normalizeOrigin(origin);
      if (exactOrigins.has(normalizedOrigin)) {
        return true;
      }
      if (previewOriginPattern?.test(normalizedOrigin)) {
        return true;
      }
      return false;
    }
  };
}
function buildTrustedOrigins() {
  const policy = buildOriginPolicy();
  const trusted = new Set(policy.exactOrigins);
  if (process.env.BACKEND_PUBLIC_URL) {
    trusted.add(normalizeOrigin(process.env.BACKEND_PUBLIC_URL));
  }
  return [...trusted];
}

// src/app/shared/email/sendEmail.ts
import nodemailer from "nodemailer";
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
}
async function sendEmail(payload) {
  const transporter = getTransporter();
  const fromAddress = process.env.MAIL_FROM;
  if (!transporter || !fromAddress) {
    console.warn(
      "Email skipped: configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM to send emails."
    );
    return;
  }
  await transporter.sendMail({
    from: fromAddress,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text
  });
}

// src/app/shared/email/buildEmailTemplate.ts
function escapeHtml(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}
function buildEmailTemplate(options) {
  const previewText = options.previewText ? escapeHtml(options.previewText) : "";
  const heading = escapeHtml(options.heading);
  const bodyText = escapeHtml(options.bodyText).replace(/\n/g, "<br />");
  const helperText = options.helperText ? `<p style="margin:16px 0 0;color:#5f6774;font-size:14px;line-height:1.6;">${escapeHtml(options.helperText)}</p>` : "";
  const cta = options.ctaLabel && options.ctaUrl ? `<a href="${escapeHtml(options.ctaUrl)}" style="display:inline-block;margin-top:20px;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;">${escapeHtml(options.ctaLabel)}</a>` : "";
  const footerNote = options.footerNote ? `<p style="margin:0;color:#7a8393;font-size:12px;line-height:1.6;">${escapeHtml(options.footerNote)}</p>` : "";
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(options.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6fb;font-family:Segoe UI,Arial,sans-serif;">
    <span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${previewText}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e5e9f2;">
            <tr>
              <td>
                <p style="margin:0 0 8px;color:#0f766e;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;">Biddyaloy</p>
                <h1 style="margin:0;color:#111827;font-size:24px;line-height:1.3;">${heading}</h1>
                <p style="margin:16px 0 0;color:#364153;font-size:15px;line-height:1.7;">${bodyText}</p>
                ${helperText}
                ${cta}
              </td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin-top:10px;padding:0 8px;">
            <tr>
              <td align="center">${footerNote}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// src/app/shared/email/templates/passwordResetEmail.ts
function buildPasswordResetEmail(payload) {
  const subject = "Reset your Biddyaloy password";
  const validityLabel = `${payload.validityMinutes} minute${payload.validityMinutes > 1 ? "s" : ""}`;
  const html = buildEmailTemplate({
    subject,
    previewText: "Use this secure link to reset your password",
    heading: "Password reset requested",
    bodyText: "We received a request to reset your Biddyaloy account password. Use the button below to set a new password.",
    helperText: `This link expires in ${validityLabel}. If you did not request this, you can safely ignore this email.`,
    ctaLabel: "Reset password",
    ctaUrl: payload.resetPasswordUrl,
    footerNote: "For your security, Biddyaloy support will never ask for your password or reset link."
  });
  const text = [
    "Password reset requested",
    "",
    `Reset link: ${payload.resetPasswordUrl}`,
    `This link expires in ${validityLabel}.`
  ].join("\n");
  return {
    subject,
    html,
    text
  };
}

// src/app/lib/auth.ts
var isProduction = process.env.NODE_ENV === "production";
var resolvedBaseURL = process.env.BACKEND_PUBLIC_URL ?? process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : void 0);
var cookieAttributes = isProduction ? {
  sameSite: "none",
  secure: true,
  httpOnly: true,
  path: "/"
} : {
  sameSite: "lax",
  secure: false,
  httpOnly: true,
  path: "/"
};
var googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
var googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
function getFrontendResetPasswordUrl(token) {
  const frontendBase = process.env.FRONTEND_PUBLIC_URL;
  if (!frontendBase) {
    return void 0;
  }
  const normalized = frontendBase.endsWith("/") ? frontendBase.slice(0, -1) : frontendBase;
  return `${normalized}/reset-password?token=${encodeURIComponent(token)}`;
}
var auth = betterAuth({
  secret: process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
  baseURL: resolvedBaseURL,
  trustedOrigins: buildTrustedOrigins(),
  useSecureCookies: isProduction,
  defaultCookieAttributes: cookieAttributes,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 30,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token }) => {
      const resetPasswordUrl = getFrontendResetPasswordUrl(token) ?? url;
      const message = buildPasswordResetEmail({
        resetPasswordUrl,
        validityMinutes: 30
      });
      await sendEmail({
        to: user.email,
        subject: message.subject,
        html: message.html,
        text: message.text
      });
    }
  },
  ...googleClientId && googleClientSecret ? {
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret
      }
    }
  } : {},
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        defaultValue: null
      },
      contactNo: {
        type: "string",
        required: false,
        defaultValue: null
      },
      presentAddress: {
        type: "string",
        required: false,
        defaultValue: null
      },
      permanentAddress: {
        type: "string",
        required: false,
        defaultValue: null
      },
      bloodGroup: {
        type: "string",
        required: false,
        defaultValue: null
      },
      gender: {
        type: "string",
        required: false,
        defaultValue: null
      },
      accountStatus: {
        type: "string",
        required: true,
        defaultValue: AccountStatus.PENDING
      },
      role: {
        type: "string",
        required: true
      }
    }
  }
});

// src/app/module/department/department.service.ts
function createHttpError3(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch2(search) {
  const value = search?.trim();
  return value || void 0;
}
function toMoneyNumber(value) {
  const numericValue = Number(value ?? 0);
  return Number(numericValue.toFixed(2));
}
function departmentSemesterFeeConfigurationDelegate() {
  return prisma.departmentSemesterFeeConfiguration;
}
function studentFeePaymentDelegate() {
  return prisma.studentFeePayment;
}
function scheduleDelegate() {
  return prisma.schedule;
}
function routineDelegate() {
  return prisma.routine;
}
var FEE_PAYMENT_STATUS_SUCCESS = "SUCCESS";
async function resolveDepartmentContext(userId, departmentId) {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true,
      activeDepartmentId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError3(403, "Only institution academic admins can access this resource");
  }
  const institution = await prisma.institution.findUnique({
    where: {
      id: adminProfile.institutionId
    },
    select: {
      type: true
    }
  });
  const isUniversityInstitution = institution?.type === InstitutionType.UNIVERSITY;
  const isDepartmentAdmin = adminProfile.role === AdminRole.DEPARTMENTADMIN;
  const isFacultyAdmin = adminProfile.role === AdminRole.FACULTYADMIN;
  const isInstitutionAdmin = adminProfile.role === AdminRole.INSTITUTIONADMIN;
  const canAccessForUniversity = isUniversityInstitution && (isInstitutionAdmin || isFacultyAdmin);
  const canAccessForNonUniversity = !isUniversityInstitution && isInstitutionAdmin;
  if (!isDepartmentAdmin && !canAccessForUniversity && !canAccessForNonUniversity) {
    throw createHttpError3(403, "Only department-level academic admins can access this resource");
  }
  if (departmentId) {
    const byId = await prisma.department.findFirst({
      where: {
        id: departmentId,
        faculty: {
          institutionId: adminProfile.institutionId
        }
      },
      select: {
        id: true
      }
    });
    if (!byId) {
      throw createHttpError3(404, "Department not found for this institution");
    }
    return {
      institutionId: adminProfile.institutionId,
      departmentId: byId.id
    };
  }
  if (adminProfile.activeDepartmentId && (isInstitutionAdmin || isFacultyAdmin)) {
    const preferredDepartment = await prisma.department.findFirst({
      where: {
        id: adminProfile.activeDepartmentId,
        faculty: {
          institutionId: adminProfile.institutionId
        }
      },
      select: {
        id: true
      }
    });
    if (preferredDepartment) {
      return {
        institutionId: adminProfile.institutionId,
        departmentId: preferredDepartment.id
      };
    }
    await prisma.adminProfile.update({
      where: {
        userId
      },
      data: {
        activeDepartmentId: null
      }
    });
  }
  const departments = await prisma.department.findMany({
    where: {
      faculty: {
        institutionId: adminProfile.institutionId
      }
    },
    select: {
      id: true
    },
    take: 2,
    orderBy: {
      createdAt: "asc"
    }
  });
  if (departments.length === 0) {
    if (canAccessForNonUniversity) {
      const bootstrap = await prisma.$transaction(async (trx) => {
        const existingFaculty = await trx.faculty.findFirst({
          where: {
            institutionId: adminProfile.institutionId
          },
          select: {
            id: true
          },
          orderBy: {
            createdAt: "asc"
          }
        });
        const facultyId = existingFaculty ? existingFaculty.id : (await trx.faculty.create({
          data: {
            fullName: "General Faculty",
            shortName: "General",
            description: "Auto-created for non-university academic workspace",
            institutionId: adminProfile.institutionId
          },
          select: {
            id: true
          }
        })).id;
        const createdDepartment = await trx.department.create({
          data: {
            fullName: "General Program",
            shortName: "Program",
            description: "Auto-created for non-university academic workspace",
            facultyId
          },
          select: {
            id: true
          }
        });
        return createdDepartment;
      });
      return {
        institutionId: adminProfile.institutionId,
        departmentId: bootstrap.id
      };
    }
    throw createHttpError3(
      404,
      "No department found for this institution. Ask faculty admin to create one first"
    );
  }
  if (departments.length > 1) {
    if (isDepartmentAdmin || canAccessForUniversity || canAccessForNonUniversity) {
      return {
        institutionId: adminProfile.institutionId,
        departmentId: departments[0].id
      };
    }
    throw createHttpError3(400, "Multiple departments found. Please provide departmentId");
  }
  return {
    institutionId: adminProfile.institutionId,
    departmentId: departments[0].id
  };
}
var listWorkspaceDepartments = async (userId) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true,
      activeDepartmentId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError3(403, "Only institution academic admins can access this resource");
  }
  const canAccessWorkspaceSelection = adminProfile.role === AdminRole.INSTITUTIONADMIN || adminProfile.role === AdminRole.FACULTYADMIN || adminProfile.role === AdminRole.DEPARTMENTADMIN;
  if (!canAccessWorkspaceSelection) {
    throw createHttpError3(403, "Only academic admins can access workspace departments");
  }
  const departments = await prisma.department.findMany({
    where: {
      faculty: {
        institutionId: adminProfile.institutionId
      }
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
      faculty: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      }
    },
    orderBy: [{ faculty: { fullName: "asc" } }, { fullName: "asc" }]
  });
  return {
    activeDepartmentId: adminProfile.activeDepartmentId ?? null,
    departments
  };
};
var setActiveWorkspaceDepartment = async (userId, payload) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError3(403, "Only institution academic admins can access this resource");
  }
  const canSetWorkspaceSelection = adminProfile.role === AdminRole.INSTITUTIONADMIN || adminProfile.role === AdminRole.FACULTYADMIN;
  if (!canSetWorkspaceSelection) {
    throw createHttpError3(403, "Only institution and faculty admins can switch active department");
  }
  const department = await prisma.department.findFirst({
    where: {
      id: payload.departmentId,
      faculty: {
        institutionId: adminProfile.institutionId
      }
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
      faculty: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      }
    }
  });
  if (!department) {
    throw createHttpError3(404, "Department not found for this institution");
  }
  await prisma.adminProfile.update({
    where: {
      userId
    },
    data: {
      activeDepartmentId: department.id
    }
  });
  return {
    activeDepartmentId: department.id,
    department
  };
};
async function resolveAcademicInstitutionContext(userId) {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError3(403, "Only institution academic admins can access this resource");
  }
  const institution = await prisma.institution.findUnique({
    where: {
      id: adminProfile.institutionId
    },
    select: {
      id: true,
      type: true
    }
  });
  if (!institution) {
    throw createHttpError3(404, "Institution not found");
  }
  const isUniversityInstitution = institution.type === InstitutionType.UNIVERSITY;
  const isDepartmentAdmin = adminProfile.role === AdminRole.DEPARTMENTADMIN;
  const isFacultyAdmin = adminProfile.role === AdminRole.FACULTYADMIN;
  const isInstitutionAdmin = adminProfile.role === AdminRole.INSTITUTIONADMIN;
  const canAccessForUniversity = isUniversityInstitution && (isInstitutionAdmin || isFacultyAdmin);
  const canAccessForNonUniversity = !isUniversityInstitution && isInstitutionAdmin;
  if (!isDepartmentAdmin && !canAccessForUniversity && !canAccessForNonUniversity) {
    throw createHttpError3(403, "Only department-level academic admins can access this resource");
  }
  return {
    institutionId: adminProfile.institutionId,
    role: adminProfile.role,
    institutionType: institution.type
  };
}
async function resolveScheduleRoutineManagementContext(userId, departmentId) {
  const context = await resolveDepartmentContext(userId, departmentId);
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError3(403, "Only institution academic admins can access this resource");
  }
  const isDepartmentAdmin = adminProfile.role === AdminRole.DEPARTMENTADMIN;
  const isInstitutionAdmin = adminProfile.role === AdminRole.INSTITUTIONADMIN;
  return {
    ...context,
    canManage: isDepartmentAdmin || isInstitutionAdmin
  };
}
function validateScheduleTimeWindow(startTime, endTime) {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
    throw createHttpError3(400, "Class slot time must be in HH:mm format");
  }
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  if (start >= end) {
    throw createHttpError3(400, "Class slot end time must be later than start time");
  }
}
async function assertSemesterInInstitution(institutionId, semesterId) {
  const semester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId
    },
    select: {
      id: true
    }
  });
  if (!semester) {
    throw createHttpError3(404, "Semester not found for this institution");
  }
}
async function assertRoutineHasNoOverlap(institutionId, departmentId, scheduleId, courseRegistrationId, classRoomId, excludeRoutineId) {
  const [selectedSchedule, selectedRegistration, selectedClassroom] = await Promise.all([
    scheduleDelegate().findFirst({
      where: {
        id: scheduleId,
        institutionId,
        departmentId
      },
      select: {
        id: true,
        semesterId: true,
        startTime: true,
        endTime: true
      }
    }),
    prisma.courseRegistration.findFirst({
      where: {
        id: courseRegistrationId,
        institutionId,
        departmentId
      },
      select: {
        id: true,
        sectionId: true,
        teacherProfileId: true,
        semesterId: true
      }
    }),
    prisma.classRoom.findFirst({
      where: {
        id: classRoomId,
        institutionId
      },
      select: {
        id: true
      }
    })
  ]);
  if (!selectedSchedule) {
    throw createHttpError3(404, "Class slot not found for this department");
  }
  if (!selectedRegistration) {
    throw createHttpError3(404, "Course registration not found for this department");
  }
  if (!selectedClassroom) {
    throw createHttpError3(404, "Room not found for this institution");
  }
  if (!selectedSchedule.semesterId || selectedSchedule.semesterId !== selectedRegistration.semesterId) {
    throw createHttpError3(
      400,
      "Selected class slot semester does not match course registration semester"
    );
  }
  const conflictingRoutines = await routineDelegate().findMany({
    where: {
      institutionId,
      departmentId,
      schedule: {
        semesterId: selectedSchedule.semesterId
      },
      ...excludeRoutineId ? {
        id: {
          not: excludeRoutineId
        }
      } : {}
    },
    include: {
      schedule: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          name: true
        }
      },
      courseRegistration: {
        select: {
          id: true,
          sectionId: true,
          teacherProfileId: true
        }
      },
      classRoom: {
        select: {
          id: true,
          roomNo: true,
          name: true
        }
      }
    }
  });
  const [selectedStartHour, selectedStartMinute] = selectedSchedule.startTime.split(":").map(Number);
  const [selectedEndHour, selectedEndMinute] = selectedSchedule.endTime.split(":").map(Number);
  const selectedStart = selectedStartHour * 60 + selectedStartMinute;
  const selectedEnd = selectedEndHour * 60 + selectedEndMinute;
  const overlapping = conflictingRoutines.filter((item) => {
    const [itemStartHour, itemStartMinute] = item.schedule.startTime.split(":").map(Number);
    const [itemEndHour, itemEndMinute] = item.schedule.endTime.split(":").map(Number);
    const itemStart = itemStartHour * 60 + itemStartMinute;
    const itemEnd = itemEndHour * 60 + itemEndMinute;
    return selectedStart < itemEnd && selectedEnd > itemStart;
  });
  const sectionConflict = overlapping.find(
    (item) => item.courseRegistration.sectionId === selectedRegistration.sectionId
  );
  if (sectionConflict) {
    throw createHttpError3(
      409,
      "This section already has another class assigned in an overlapping time slot"
    );
  }
  const teacherConflict = overlapping.find(
    (item) => item.courseRegistration.teacherProfileId === selectedRegistration.teacherProfileId
  );
  if (teacherConflict) {
    throw createHttpError3(
      409,
      "The assigned teacher already has another class in an overlapping time slot"
    );
  }
  const roomConflict = overlapping.find((item) => item.classRoom.id === classRoomId);
  if (roomConflict) {
    throw createHttpError3(409, "Another section is already assigned in this room for an overlapping slot");
  }
}
var getDepartmentProfile = async (userId, departmentId) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const department = await prisma.department.findUnique({
    where: {
      id: context.departmentId
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
      description: true,
      facultyId: true,
      faculty: {
        select: {
          fullName: true
        }
      },
      createdAt: true,
      updatedAt: true
    }
  });
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      contactNo: true,
      presentAddress: true,
      permanentAddress: true,
      bloodGroup: true,
      gender: true
    }
  });
  return {
    institutionId: context.institutionId,
    ...department,
    user
  };
};
var updateDepartmentProfile = async (userId, payload) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (adminProfile?.role !== AdminRole.DEPARTMENTADMIN) {
    throw createHttpError3(403, "Only department admins can access this resource");
  }
  const normalizedFullName = payload.fullName?.trim();
  const normalizedShortName = payload.shortName?.trim() || null;
  const normalizedDescription = payload.description?.trim() || null;
  const hasDepartmentMutation = Boolean(payload.fullName || payload.shortName || payload.description) || Boolean(payload.departmentId);
  const savedDepartment = await prisma.$transaction(async (trx) => {
    let nextDepartment = null;
    if (hasDepartmentMutation) {
      if (!normalizedFullName) {
        throw createHttpError3(400, "Department full name is required when updating department details");
      }
      const departmentData = {
        fullName: normalizedFullName,
        shortName: normalizedShortName,
        description: normalizedDescription
      };
      const createDepartmentForSingleFaculty = async () => {
        const faculties = await trx.faculty.findMany({
          where: {
            institutionId: adminProfile.institutionId
          },
          select: {
            id: true
          },
          take: 2,
          orderBy: {
            createdAt: "asc"
          }
        });
        if (faculties.length === 0) {
          throw createHttpError3(
            404,
            "No faculty found for this institution. Ask faculty admin to create a faculty first"
          );
        }
        if (faculties.length > 1) {
          throw createHttpError3(
            400,
            "Multiple faculties found. Ask faculty admin to create department under a specific faculty"
          );
        }
        return trx.department.create({
          data: {
            ...departmentData,
            facultyId: faculties[0].id
          },
          select: {
            id: true,
            fullName: true,
            shortName: true,
            description: true,
            updatedAt: true
          }
        });
      };
      if (payload.departmentId) {
        const departmentById = await trx.department.findFirst({
          where: {
            id: payload.departmentId,
            faculty: {
              institutionId: adminProfile.institutionId
            }
          },
          select: {
            id: true
          }
        });
        if (departmentById) {
          nextDepartment = await trx.department.update({
            where: {
              id: departmentById.id
            },
            data: departmentData,
            select: {
              id: true,
              fullName: true,
              shortName: true,
              description: true,
              updatedAt: true
            }
          });
        } else {
          const departmentCount = await trx.department.count({
            where: {
              faculty: {
                institutionId: adminProfile.institutionId
              }
            }
          });
          if (departmentCount > 0) {
            throw createHttpError3(404, "Department not found for this institution");
          }
          nextDepartment = await createDepartmentForSingleFaculty();
        }
      } else {
        const departments = await trx.department.findMany({
          where: {
            faculty: {
              institutionId: adminProfile.institutionId
            }
          },
          select: {
            id: true
          },
          take: 2,
          orderBy: {
            createdAt: "asc"
          }
        });
        if (departments.length > 1) {
          throw createHttpError3(400, "Multiple departments found. Please provide departmentId");
        }
        if (departments.length === 0) {
          nextDepartment = await createDepartmentForSingleFaculty();
        } else {
          nextDepartment = await trx.department.update({
            where: {
              id: departments[0].id
            },
            data: departmentData,
            select: {
              id: true,
              fullName: true,
              shortName: true,
              description: true,
              updatedAt: true
            }
          });
        }
      }
    }
    const nextName = payload.name?.trim();
    if (nextName) {
      await trx.user.update({
        where: {
          id: userId
        },
        data: {
          name: nextName
        }
      });
    }
    await trx.user.update({
      where: {
        id: userId
      },
      data: {
        image: payload.image === void 0 ? void 0 : payload.image.trim() || null,
        contactNo: payload.contactNo === void 0 ? void 0 : payload.contactNo.trim() || null,
        presentAddress: payload.presentAddress === void 0 ? void 0 : payload.presentAddress.trim() || null,
        permanentAddress: payload.permanentAddress === void 0 ? void 0 : payload.permanentAddress.trim() || null,
        bloodGroup: payload.bloodGroup === void 0 ? void 0 : payload.bloodGroup.trim() || null,
        gender: payload.gender === void 0 ? void 0 : payload.gender.trim() || null
      }
    });
    if (nextDepartment) {
      return nextDepartment;
    }
    return trx.department.findFirst({
      where: {
        faculty: {
          institutionId: adminProfile.institutionId
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        fullName: true,
        shortName: true,
        description: true,
        updatedAt: true
      }
    });
  });
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  });
  return {
    ...savedDepartment,
    user
  };
};
var listSemesters = async (userId, search) => {
  const context = await resolveDepartmentContext(userId);
  const normalizedSearch = normalizeSearch2(search);
  return prisma.semester.findMany({
    where: {
      institutionId: context.institutionId,
      ...normalizedSearch ? {
        OR: [{ name: { contains: normalizedSearch, mode: "insensitive" } }]
      } : {}
    },
    orderBy: {
      startDate: "desc"
    }
  });
};
var createSemester = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId);
  if (new Date(payload.endDate).getTime() <= new Date(payload.startDate).getTime()) {
    throw createHttpError3(400, "endDate must be greater than startDate");
  }
  return prisma.semester.create({
    data: {
      name: payload.name.trim(),
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      institutionId: context.institutionId
    }
  });
};
var updateSemester = async (userId, semesterId, payload) => {
  const context = await resolveDepartmentContext(userId);
  const semester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId: context.institutionId
    },
    select: {
      id: true,
      startDate: true,
      endDate: true
    }
  });
  if (!semester) {
    throw createHttpError3(404, "Semester not found");
  }
  const nextStartDate = payload.startDate ? new Date(payload.startDate) : semester.startDate;
  const nextEndDate = payload.endDate ? new Date(payload.endDate) : semester.endDate;
  if (nextEndDate.getTime() <= nextStartDate.getTime()) {
    throw createHttpError3(400, "endDate must be greater than startDate");
  }
  return prisma.semester.update({
    where: {
      id: semesterId
    },
    data: {
      name: payload.name?.trim(),
      startDate: payload.startDate ? new Date(payload.startDate) : void 0,
      endDate: payload.endDate ? new Date(payload.endDate) : void 0
    }
  });
};
var listSchedules = async (userId, departmentId, search, semesterId) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch2(search);
  return scheduleDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      semesterId: semesterId || void 0,
      ...normalizedSearch ? {
        OR: [
          { name: { contains: normalizedSearch, mode: "insensitive" } },
          { description: { contains: normalizedSearch, mode: "insensitive" } }
        ]
      } : {}
    },
    include: {
      department: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      },
      semester: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: [{ startTime: "asc" }, { name: "asc" }]
  });
};
var createSchedule = async (userId, payload) => {
  const context = await resolveScheduleRoutineManagementContext(userId, payload.departmentId);
  if (!context.canManage) {
    throw createHttpError3(
      403,
      "Only department admins can set class slots. For non-university institutions, institution admins can do this."
    );
  }
  await assertSemesterInInstitution(context.institutionId, payload.semesterId);
  validateScheduleTimeWindow(payload.startTime, payload.endTime);
  return scheduleDelegate().create({
    data: {
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      semesterId: payload.semesterId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: payload.status ?? SlotStatus.CLASS_SLOT,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    include: {
      department: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      },
      semester: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};
var updateSchedule = async (userId, scheduleId, payload) => {
  const context = await resolveScheduleRoutineManagementContext(userId);
  if (!context.canManage) {
    throw createHttpError3(
      403,
      "Only department admins can update class slots. For non-university institutions, institution admins can do this."
    );
  }
  const current = await scheduleDelegate().findFirst({
    where: {
      id: scheduleId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true,
      semesterId: true,
      startTime: true,
      endTime: true
    }
  });
  if (!current) {
    throw createHttpError3(404, "Class slot not found for this department");
  }
  if (payload.semesterId) {
    await assertSemesterInInstitution(context.institutionId, payload.semesterId);
  }
  const nextStart = payload.startTime ?? current.startTime;
  const nextEnd = payload.endTime ?? current.endTime;
  validateScheduleTimeWindow(nextStart, nextEnd);
  return scheduleDelegate().update({
    where: {
      id: scheduleId
    },
    data: {
      name: payload.name?.trim(),
      description: payload.description === void 0 ? void 0 : payload.description.trim() || null,
      semesterId: payload.semesterId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: payload.status
    },
    include: {
      department: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      },
      semester: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};
var deleteSchedule = async (userId, scheduleId) => {
  const context = await resolveScheduleRoutineManagementContext(userId);
  if (!context.canManage) {
    throw createHttpError3(
      403,
      "Only department admins can delete class slots. For non-university institutions, institution admins can do this."
    );
  }
  const schedule = await scheduleDelegate().findFirst({
    where: {
      id: scheduleId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!schedule) {
    throw createHttpError3(404, "Class slot not found for this department");
  }
  const dependentRoutine = await routineDelegate().findFirst({
    where: {
      scheduleId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (dependentRoutine) {
    throw createHttpError3(409, "Cannot delete class slot because routines are assigned to it");
  }
  await scheduleDelegate().delete({
    where: {
      id: scheduleId
    }
  });
  return {
    id: scheduleId
  };
};
var listRoutines = async (userId, departmentId, search, semesterId) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch2(search);
  return routineDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...semesterId ? {
        schedule: {
          semesterId
        }
      } : {},
      ...normalizedSearch ? {
        OR: [
          { name: { contains: normalizedSearch, mode: "insensitive" } },
          { description: { contains: normalizedSearch, mode: "insensitive" } },
          { version: { contains: normalizedSearch, mode: "insensitive" } },
          {
            classRoom: {
              OR: [
                { roomNo: { contains: normalizedSearch, mode: "insensitive" } },
                { name: { contains: normalizedSearch, mode: "insensitive" } }
              ]
            }
          },
          {
            courseRegistration: {
              OR: [
                { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
                { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } },
                { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } },
                { teacherProfile: { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } } }
              ]
            }
          }
        ]
      } : {}
    },
    include: {
      schedule: true,
      classRoom: true,
      courseRegistration: {
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              courseTitle: true
            }
          },
          section: {
            select: {
              id: true,
              name: true,
              batch: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          },
          teacherProfile: {
            select: {
              id: true,
              teacherInitial: true,
              teachersId: true,
              designation: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: [{ schedule: { startTime: "asc" } }, { createdAt: "desc" }]
  });
};
var createRoutine = async (userId, payload) => {
  const context = await resolveScheduleRoutineManagementContext(userId, payload.departmentId);
  if (!context.canManage) {
    throw createHttpError3(
      403,
      "Only department admins can set class routines. For non-university institutions, institution admins can do this."
    );
  }
  await assertRoutineHasNoOverlap(
    context.institutionId,
    context.departmentId,
    payload.scheduleId,
    payload.courseRegistrationId,
    payload.classRoomId
  );
  return routineDelegate().create({
    data: {
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      version: payload.version?.trim() || null,
      scheduleId: payload.scheduleId,
      courseRegistrationId: payload.courseRegistrationId,
      classRoomId: payload.classRoomId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    include: {
      schedule: true,
      classRoom: true,
      courseRegistration: {
        include: {
          course: true,
          section: {
            include: {
              batch: true
            }
          },
          semester: true,
          teacherProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });
};
var updateRoutine = async (userId, routineId, payload) => {
  const context = await resolveScheduleRoutineManagementContext(userId);
  if (!context.canManage) {
    throw createHttpError3(
      403,
      "Only department admins can update class routines. For non-university institutions, institution admins can do this."
    );
  }
  const current = await routineDelegate().findFirst({
    where: {
      id: routineId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true,
      scheduleId: true,
      courseRegistrationId: true,
      classRoomId: true
    }
  });
  if (!current) {
    throw createHttpError3(404, "Routine not found for this department");
  }
  const nextScheduleId = payload.scheduleId ?? current.scheduleId;
  const nextCourseRegistrationId = payload.courseRegistrationId ?? current.courseRegistrationId;
  const nextClassRoomId = payload.classRoomId ?? current.classRoomId;
  await assertRoutineHasNoOverlap(
    context.institutionId,
    context.departmentId,
    nextScheduleId,
    nextCourseRegistrationId,
    nextClassRoomId,
    routineId
  );
  return routineDelegate().update({
    where: {
      id: routineId
    },
    data: {
      name: payload.name?.trim(),
      description: payload.description === void 0 ? void 0 : payload.description.trim() || null,
      version: payload.version === void 0 ? void 0 : payload.version.trim() || null,
      scheduleId: payload.scheduleId,
      courseRegistrationId: payload.courseRegistrationId,
      classRoomId: payload.classRoomId
    },
    include: {
      schedule: true,
      classRoom: true,
      courseRegistration: {
        include: {
          course: true,
          section: {
            include: {
              batch: true
            }
          },
          semester: true,
          teacherProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });
};
var deleteRoutine = async (userId, routineId) => {
  const context = await resolveScheduleRoutineManagementContext(userId);
  if (!context.canManage) {
    throw createHttpError3(
      403,
      "Only department admins can delete class routines. For non-university institutions, institution admins can do this."
    );
  }
  const routine = await routineDelegate().findFirst({
    where: {
      id: routineId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!routine) {
    throw createHttpError3(404, "Routine not found for this department");
  }
  await routineDelegate().delete({
    where: {
      id: routineId
    }
  });
  return {
    id: routineId
  };
};
var listBatches = async (userId, departmentId, search) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch2(search);
  return prisma.batch.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...normalizedSearch ? {
        OR: [
          { name: { contains: normalizedSearch, mode: "insensitive" } },
          { description: { contains: normalizedSearch, mode: "insensitive" } }
        ]
      } : {}
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createBatch = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);
  return prisma.batch.create({
    data: {
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    }
  });
};
var updateBatch = async (userId, batchId, payload) => {
  const context = await resolveDepartmentContext(userId);
  const batch = await prisma.batch.findFirst({
    where: {
      id: batchId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!batch) {
    throw createHttpError3(404, "Batch not found");
  }
  return prisma.batch.update({
    where: {
      id: batchId
    },
    data: {
      name: payload.name?.trim(),
      description: payload.description?.trim() || void 0
    }
  });
};
var deleteBatch = async (userId, batchId) => {
  const context = await resolveDepartmentContext(userId);
  const batch = await prisma.batch.findFirst({
    where: {
      id: batchId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!batch) {
    throw createHttpError3(404, "Batch not found");
  }
  const sectionCount = await prisma.section.count({
    where: {
      batchId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    }
  });
  if (sectionCount > 0) {
    throw createHttpError3(409, "Cannot delete batch with assigned sections");
  }
  await prisma.batch.delete({
    where: {
      id: batchId
    }
  });
  return {
    id: batchId
  };
};
var listSections = async (userId, departmentId, search) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch2(search);
  return prisma.section.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...normalizedSearch ? {
        OR: [
          { name: { contains: normalizedSearch, mode: "insensitive" } },
          { description: { contains: normalizedSearch, mode: "insensitive" } },
          { semester: { name: { contains: normalizedSearch, mode: "insensitive" } } },
          { batch: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } }
        ]
      } : {}
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      },
      batch: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createSection = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);
  const [semester, batch] = await Promise.all([
    prisma.semester.findFirst({
      where: {
        id: payload.semesterId,
        institutionId: context.institutionId
      },
      select: {
        id: true
      }
    }),
    prisma.batch.findFirst({
      where: {
        id: payload.batchId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    })
  ]);
  if (!semester) {
    throw createHttpError3(404, "Semester not found for this institution");
  }
  if (!batch) {
    throw createHttpError3(404, "Batch not found for this department");
  }
  return prisma.section.create({
    data: {
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      sectionCapacity: payload.sectionCapacity,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      semesterId: payload.semesterId,
      batchId: payload.batchId
    }
  });
};
var updateSection = async (userId, sectionId, payload) => {
  const context = await resolveDepartmentContext(userId);
  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!section) {
    throw createHttpError3(404, "Section not found");
  }
  if (payload.semesterId) {
    const semester = await prisma.semester.findFirst({
      where: {
        id: payload.semesterId,
        institutionId: context.institutionId
      },
      select: {
        id: true
      }
    });
    if (!semester) {
      throw createHttpError3(404, "Semester not found for this institution");
    }
  }
  if (payload.batchId) {
    const batch = await prisma.batch.findFirst({
      where: {
        id: payload.batchId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    });
    if (!batch) {
      throw createHttpError3(404, "Batch not found for this department");
    }
  }
  return prisma.section.update({
    where: {
      id: sectionId
    },
    data: {
      name: payload.name?.trim(),
      description: payload.description?.trim() || void 0,
      sectionCapacity: payload.sectionCapacity,
      semesterId: payload.semesterId,
      batchId: payload.batchId
    }
  });
};
var deleteSection = async (userId, sectionId) => {
  const context = await resolveDepartmentContext(userId);
  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!section) {
    throw createHttpError3(404, "Section not found");
  }
  const registrationCount = await prisma.courseRegistration.count({
    where: {
      sectionId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    }
  });
  if (registrationCount > 0) {
    throw createHttpError3(409, "Cannot delete section with course registrations");
  }
  await prisma.section.delete({
    where: {
      id: sectionId
    }
  });
  return {
    id: sectionId
  };
};
var listPrograms = async (userId, departmentId, search) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch2(search);
  return prisma.program.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...normalizedSearch ? {
        OR: [
          { title: { contains: normalizedSearch, mode: "insensitive" } },
          { shortTitle: { contains: normalizedSearch, mode: "insensitive" } },
          { description: { contains: normalizedSearch, mode: "insensitive" } }
        ]
      } : {}
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createProgram = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);
  return prisma.program.create({
    data: {
      title: payload.title.trim(),
      shortTitle: payload.shortTitle?.trim() || null,
      description: payload.description?.trim() || null,
      credits: payload.credits,
      cost: payload.cost,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    }
  });
};
var updateProgram = async (userId, programId, payload) => {
  const context = await resolveDepartmentContext(userId);
  const program = await prisma.program.findFirst({
    where: {
      id: programId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!program) {
    throw createHttpError3(404, "Program not found");
  }
  return prisma.program.update({
    where: {
      id: programId
    },
    data: {
      title: payload.title?.trim(),
      shortTitle: payload.shortTitle?.trim() || void 0,
      description: payload.description?.trim() || void 0,
      credits: payload.credits,
      cost: payload.cost
    }
  });
};
var listCourses = async (userId, departmentId, search) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch2(search);
  return prisma.course.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...normalizedSearch ? {
        OR: [
          { courseCode: { contains: normalizedSearch, mode: "insensitive" } },
          { courseTitle: { contains: normalizedSearch, mode: "insensitive" } },
          { description: { contains: normalizedSearch, mode: "insensitive" } },
          { program: { is: { title: { contains: normalizedSearch, mode: "insensitive" } } } }
        ]
      } : {}
    },
    include: {
      program: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createCourse = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId);
  if (payload.programId) {
    const program = await prisma.program.findFirst({
      where: {
        id: payload.programId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    });
    if (!program) {
      throw createHttpError3(404, "Program not found for this department");
    }
  }
  return prisma.course.create({
    data: {
      courseCode: payload.courseCode.trim(),
      courseTitle: payload.courseTitle.trim(),
      description: payload.description?.trim() || null,
      credits: payload.credits,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      programId: payload.programId
    }
  });
};
var updateCourse = async (userId, courseId, payload) => {
  const context = await resolveDepartmentContext(userId);
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!course) {
    throw createHttpError3(404, "Course not found");
  }
  if (payload.programId) {
    const nextProgram = await prisma.program.findFirst({
      where: {
        id: payload.programId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    });
    if (!nextProgram) {
      throw createHttpError3(404, "Program not found for this department");
    }
  }
  return prisma.course.update({
    where: {
      id: courseId
    },
    data: {
      courseCode: payload.courseCode?.trim(),
      courseTitle: payload.courseTitle?.trim(),
      description: payload.description?.trim() || void 0,
      credits: payload.credits,
      programId: payload.programId
    }
  });
};
var deleteCourse = async (userId, courseId) => {
  const context = await resolveDepartmentContext(userId);
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!course) {
    throw createHttpError3(404, "Course not found");
  }
  await prisma.course.delete({
    where: {
      id: courseId
    }
  });
  return {
    id: courseId
  };
};
var listCourseRegistrations = async (userId, departmentId, search, semesterId) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch2(search);
  return prisma.courseRegistration.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      semesterId: semesterId || void 0,
      ...normalizedSearch ? {
        OR: [
          { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } },
          { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } },
          { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
          { studentProfile: { studentsId: { contains: normalizedSearch, mode: "insensitive" } } },
          { studentProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } },
          { teacherProfile: { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } } },
          { teacherProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } }
        ]
      } : {}
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      section: {
        select: {
          id: true,
          name: true,
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      program: {
        select: {
          id: true,
          title: true
        }
      },
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var listSectionCourseTeacherAssignments = async (userId, departmentId, search) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch2(search);
  return prisma.sectionCourseTeacherAssignment.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...normalizedSearch ? {
        OR: [
          { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
          { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } },
          { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } },
          { teacherProfile: { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } } },
          { teacherProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } }
        ]
      } : {}
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
          semesterId: true,
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var upsertSectionCourseTeacherAssignment = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);
  const [course, section, teacher, semester] = await Promise.all([
    prisma.course.findFirst({
      where: {
        id: payload.courseId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    }),
    prisma.section.findFirst({
      where: {
        id: payload.sectionId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true,
        semesterId: true
      }
    }),
    prisma.teacherProfile.findFirst({
      where: {
        id: payload.teacherProfileId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    }),
    prisma.semester.findFirst({
      where: {
        id: payload.semesterId,
        institutionId: context.institutionId
      },
      select: {
        id: true
      }
    })
  ]);
  if (!course) {
    throw createHttpError3(404, "Course not found for this department");
  }
  if (!section) {
    throw createHttpError3(404, "Section not found for this department");
  }
  if (!teacher) {
    throw createHttpError3(404, "Teacher not found for this department");
  }
  if (!semester) {
    throw createHttpError3(404, "Semester not found for this institution");
  }
  if (section.semesterId !== payload.semesterId) {
    throw createHttpError3(400, "Selected section does not belong to the selected semester");
  }
  const assignment = await prisma.sectionCourseTeacherAssignment.upsert({
    where: {
      sectionId_courseId: {
        sectionId: payload.sectionId,
        courseId: payload.courseId
      }
    },
    create: {
      sectionId: payload.sectionId,
      courseId: payload.courseId,
      teacherProfileId: payload.teacherProfileId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    update: {
      teacherProfileId: payload.teacherProfileId
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
          semesterId: true,
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  await prisma.courseRegistration.updateMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      sectionId: payload.sectionId,
      courseId: payload.courseId
    },
    data: {
      teacherProfileId: payload.teacherProfileId
    }
  });
  return assignment;
};
var createCourseRegistration = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);
  const [course, student, section, semester] = await Promise.all([
    prisma.course.findFirst({
      where: {
        id: payload.courseId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true,
        programId: true
      }
    }),
    prisma.studentProfile.findFirst({
      where: {
        id: payload.studentProfileId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    }),
    prisma.section.findFirst({
      where: {
        id: payload.sectionId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true,
        semesterId: true
      }
    }),
    prisma.semester.findFirst({
      where: {
        id: payload.semesterId,
        institutionId: context.institutionId
      },
      select: {
        id: true
      }
    })
  ]);
  if (!course) {
    throw createHttpError3(404, "Course not found for this department");
  }
  if (!student) {
    throw createHttpError3(404, "Student not found for this department");
  }
  if (!section) {
    throw createHttpError3(404, "Section not found for this department");
  }
  if (!semester) {
    throw createHttpError3(404, "Semester not found for this institution");
  }
  if (section.semesterId !== payload.semesterId) {
    throw createHttpError3(400, "Selected section does not belong to the selected semester");
  }
  const resolvedProgramId = payload.programId ?? course.programId ?? null;
  if (resolvedProgramId) {
    const program = await prisma.program.findFirst({
      where: {
        id: resolvedProgramId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    });
    if (!program) {
      throw createHttpError3(404, "Program not found for this department");
    }
  }
  if (course.programId && course.programId !== resolvedProgramId) {
    throw createHttpError3(400, "Selected course does not belong to the selected program");
  }
  const sectionCourseTeacherAssignment = await prisma.sectionCourseTeacherAssignment.findFirst({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      sectionId: payload.sectionId,
      courseId: payload.courseId
    },
    select: {
      teacherProfileId: true
    }
  });
  if (!sectionCourseTeacherAssignment) {
    throw createHttpError3(
      400,
      "No teacher assigned for the selected section and course. Assign teacher first."
    );
  }
  const existingRegistration = await prisma.courseRegistration.findFirst({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      courseId: payload.courseId,
      studentProfileId: payload.studentProfileId,
      semesterId: payload.semesterId
    },
    select: {
      id: true
    }
  });
  if (existingRegistration) {
    throw createHttpError3(409, "Student is already registered for this course in the selected semester");
  }
  return prisma.courseRegistration.create({
    data: {
      courseId: payload.courseId,
      studentProfileId: payload.studentProfileId,
      teacherProfileId: sectionCourseTeacherAssignment.teacherProfileId,
      sectionId: payload.sectionId,
      departmentId: context.departmentId,
      programId: resolvedProgramId,
      semesterId: payload.semesterId,
      institutionId: context.institutionId,
      registrationDate: payload.registrationDate ? new Date(payload.registrationDate) : void 0
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      section: {
        select: {
          id: true,
          name: true,
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      program: {
        select: {
          id: true,
          title: true
        }
      },
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    }
  });
};
var updateCourseRegistration = async (userId, courseRegistrationId, payload) => {
  const context = await resolveDepartmentContext(userId);
  const existing = await prisma.courseRegistration.findFirst({
    where: {
      id: courseRegistrationId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true,
      courseId: true,
      studentProfileId: true,
      sectionId: true,
      programId: true,
      semesterId: true
    }
  });
  if (!existing) {
    throw createHttpError3(404, "Course registration not found");
  }
  const nextCourseId = payload.courseId ?? existing.courseId;
  const nextStudentProfileId = payload.studentProfileId ?? existing.studentProfileId;
  const nextSectionId = payload.sectionId ?? existing.sectionId;
  const nextSemesterId = payload.semesterId ?? existing.semesterId;
  const [course, student, section, semester] = await Promise.all([
    prisma.course.findFirst({
      where: {
        id: nextCourseId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true,
        programId: true
      }
    }),
    prisma.studentProfile.findFirst({
      where: {
        id: nextStudentProfileId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    }),
    prisma.section.findFirst({
      where: {
        id: nextSectionId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true,
        semesterId: true
      }
    }),
    prisma.semester.findFirst({
      where: {
        id: nextSemesterId,
        institutionId: context.institutionId
      },
      select: {
        id: true
      }
    })
  ]);
  if (!course) {
    throw createHttpError3(404, "Course not found for this department");
  }
  if (!student) {
    throw createHttpError3(404, "Student not found for this department");
  }
  if (!section) {
    throw createHttpError3(404, "Section not found for this department");
  }
  if (!semester) {
    throw createHttpError3(404, "Semester not found for this institution");
  }
  if (section.semesterId !== nextSemesterId) {
    throw createHttpError3(400, "Selected section does not belong to the selected semester");
  }
  const resolvedProgramId = payload.programId ?? course.programId ?? existing.programId ?? null;
  if (resolvedProgramId) {
    const program = await prisma.program.findFirst({
      where: {
        id: resolvedProgramId,
        institutionId: context.institutionId,
        departmentId: context.departmentId
      },
      select: {
        id: true
      }
    });
    if (!program) {
      throw createHttpError3(404, "Program not found for this department");
    }
  }
  if (course.programId && course.programId !== resolvedProgramId) {
    throw createHttpError3(400, "Selected course does not belong to the selected program");
  }
  const sectionCourseTeacherAssignment = await prisma.sectionCourseTeacherAssignment.findFirst({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      sectionId: nextSectionId,
      courseId: nextCourseId
    },
    select: {
      teacherProfileId: true
    }
  });
  if (!sectionCourseTeacherAssignment) {
    throw createHttpError3(
      400,
      "No teacher assigned for the selected section and course. Assign teacher first."
    );
  }
  const duplicate = await prisma.courseRegistration.findFirst({
    where: {
      id: {
        not: courseRegistrationId
      },
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      courseId: nextCourseId,
      studentProfileId: nextStudentProfileId,
      semesterId: nextSemesterId
    },
    select: {
      id: true
    }
  });
  if (duplicate) {
    throw createHttpError3(409, "Student is already registered for this course in the selected semester");
  }
  return prisma.courseRegistration.update({
    where: {
      id: courseRegistrationId
    },
    data: {
      courseId: nextCourseId,
      studentProfileId: nextStudentProfileId,
      teacherProfileId: sectionCourseTeacherAssignment.teacherProfileId,
      sectionId: nextSectionId,
      programId: resolvedProgramId,
      semesterId: nextSemesterId,
      registrationDate: payload.registrationDate ? new Date(payload.registrationDate) : void 0
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      section: {
        select: {
          id: true,
          name: true,
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      program: {
        select: {
          id: true,
          title: true
        }
      },
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    }
  });
};
var deleteCourseRegistration = async (userId, courseRegistrationId) => {
  const context = await resolveDepartmentContext(userId);
  const existing = await prisma.courseRegistration.findFirst({
    where: {
      id: courseRegistrationId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true
    }
  });
  if (!existing) {
    throw createHttpError3(404, "Course registration not found");
  }
  await prisma.courseRegistration.delete({
    where: {
      id: courseRegistrationId
    }
  });
  return {
    id: courseRegistrationId
  };
};
var listTeachers = async (userId, departmentId, search) => {
  const scope = await resolveAcademicInstitutionContext(userId);
  const normalizedSearch = normalizeSearch2(search);
  let scopedDepartmentId;
  if (scope.role === AdminRole.DEPARTMENTADMIN || departmentId) {
    const context = await resolveDepartmentContext(userId, departmentId);
    scopedDepartmentId = context.departmentId;
  }
  return prisma.teacherProfile.findMany({
    where: {
      institutionId: scope.institutionId,
      departmentId: scopedDepartmentId,
      ...normalizedSearch ? {
        OR: [
          { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } },
          { teachersId: { contains: normalizedSearch, mode: "insensitive" } },
          { designation: { contains: normalizedSearch, mode: "insensitive" } },
          {
            user: {
              is: {
                OR: [
                  { name: { contains: normalizedSearch, mode: "insensitive" } },
                  { email: { contains: normalizedSearch, mode: "insensitive" } }
                ]
              }
            }
          }
        ]
      } : {}
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createTeacher = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);
  const registered = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: UserRole.TEACHER
    }
  });
  if (!registered.user) {
    throw createHttpError3(500, "Failed to create teacher account");
  }
  const profile = await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: registered.user.id
      },
      data: {
        accountStatus: AccountStatus.ACTIVE
      }
    });
    return trx.teacherProfile.create({
      data: {
        teacherInitial: payload.teacherInitial.trim(),
        teachersId: payload.teachersId.trim(),
        designation: payload.designation.trim(),
        bio: payload.bio?.trim() || null,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
        userId: registered.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true
          }
        }
      }
    });
  });
  return profile;
};
var updateTeacher = async (userId, teacherProfileId, payload) => {
  const scope = await resolveAcademicInstitutionContext(userId);
  const departmentContext = scope.role === AdminRole.DEPARTMENTADMIN ? await resolveDepartmentContext(userId) : null;
  const teacher = await prisma.teacherProfile.findFirst({
    where: {
      id: teacherProfileId,
      institutionId: scope.institutionId,
      departmentId: departmentContext?.departmentId
    },
    select: {
      id: true,
      userId: true
    }
  });
  if (!teacher) {
    throw createHttpError3(404, "Teacher not found");
  }
  const result = await prisma.$transaction(async (trx) => {
    const updatedTeacher = await trx.teacherProfile.update({
      where: {
        id: teacherProfileId
      },
      data: {
        designation: payload.designation?.trim(),
        bio: payload.bio?.trim() || void 0
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true
          }
        }
      }
    });
    if (payload.accountStatus) {
      await trx.user.update({
        where: {
          id: teacher.userId
        },
        data: {
          accountStatus: payload.accountStatus
        }
      });
      updatedTeacher.user.accountStatus = payload.accountStatus;
    }
    return updatedTeacher;
  });
  return result;
};
var listStudents = async (userId, departmentId, search) => {
  const scope = await resolveAcademicInstitutionContext(userId);
  const normalizedSearch = normalizeSearch2(search);
  let scopedDepartmentId;
  if (scope.role === AdminRole.DEPARTMENTADMIN || departmentId) {
    const context = await resolveDepartmentContext(userId, departmentId);
    scopedDepartmentId = context.departmentId;
  }
  return prisma.studentProfile.findMany({
    where: {
      institutionId: scope.institutionId,
      departmentId: scopedDepartmentId,
      ...normalizedSearch ? {
        OR: [
          { studentsId: { contains: normalizedSearch, mode: "insensitive" } },
          {
            user: {
              is: {
                OR: [
                  { name: { contains: normalizedSearch, mode: "insensitive" } },
                  { email: { contains: normalizedSearch, mode: "insensitive" } }
                ]
              }
            }
          }
        ]
      } : {}
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createStudent = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);
  const registered = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: UserRole.STUDENT
    }
  });
  if (!registered.user) {
    throw createHttpError3(500, "Failed to create student account");
  }
  const profile = await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: registered.user.id
      },
      data: {
        accountStatus: AccountStatus.ACTIVE
      }
    });
    return trx.studentProfile.create({
      data: {
        studentsId: payload.studentsId.trim(),
        bio: payload.bio?.trim() || null,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
        userId: registered.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true
          }
        }
      }
    });
  });
  return profile;
};
var updateStudent = async (userId, studentProfileId, payload) => {
  const scope = await resolveAcademicInstitutionContext(userId);
  const departmentContext = scope.role === AdminRole.DEPARTMENTADMIN ? await resolveDepartmentContext(userId) : null;
  const student = await prisma.studentProfile.findFirst({
    where: {
      id: studentProfileId,
      institutionId: scope.institutionId,
      departmentId: departmentContext?.departmentId
    },
    select: {
      id: true,
      userId: true
    }
  });
  if (!student) {
    throw createHttpError3(404, "Student not found");
  }
  const result = await prisma.$transaction(async (trx) => {
    const updatedStudent = await trx.studentProfile.update({
      where: {
        id: studentProfileId
      },
      data: {
        bio: payload.bio?.trim() || void 0
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true
          }
        }
      }
    });
    if (payload.accountStatus) {
      await trx.user.update({
        where: {
          id: student.userId
        },
        data: {
          accountStatus: payload.accountStatus
        }
      });
      updatedStudent.user.accountStatus = payload.accountStatus;
    }
    return updatedStudent;
  });
  return result;
};
var removeTeacher = async (userId, teacherProfileId) => {
  const context = await resolveAcademicInstitutionContext(userId);
  const teacher = await prisma.teacherProfile.findFirst({
    where: {
      id: teacherProfileId,
      institutionId: context.institutionId
    },
    select: {
      id: true,
      userId: true
    }
  });
  if (!teacher) {
    throw createHttpError3(404, "Teacher not found for this institution");
  }
  await prisma.user.update({
    where: {
      id: teacher.userId
    },
    data: {
      accountStatus: AccountStatus.DEACTIVATED
    }
  });
  return {
    teacherProfileId: teacher.id,
    userId: teacher.userId,
    accountStatus: AccountStatus.DEACTIVATED
  };
};
var removeStudent = async (userId, studentProfileId) => {
  const context = await resolveAcademicInstitutionContext(userId);
  const student = await prisma.studentProfile.findFirst({
    where: {
      id: studentProfileId,
      institutionId: context.institutionId
    },
    select: {
      id: true,
      userId: true
    }
  });
  if (!student) {
    throw createHttpError3(404, "Student not found for this institution");
  }
  await prisma.user.update({
    where: {
      id: student.userId
    },
    data: {
      accountStatus: AccountStatus.DEACTIVATED
    }
  });
  return {
    studentProfileId: student.id,
    userId: student.userId,
    accountStatus: AccountStatus.DEACTIVATED
  };
};
var createInstitutionTransferRequest = async (userId, payload) => {
  const context = await resolveAcademicInstitutionContext(userId);
  if (payload.targetInstitutionId === context.institutionId) {
    throw createHttpError3(400, "Target institution must be different from source institution");
  }
  const targetInstitution = await prisma.institution.findUnique({
    where: {
      id: payload.targetInstitutionId
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      type: true
    }
  });
  if (!targetInstitution) {
    throw createHttpError3(404, "Target institution not found");
  }
  if (payload.entityType === InstitutionTransferEntityType.STUDENT) {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        id: payload.profileId,
        institutionId: context.institutionId
      },
      select: {
        id: true
      }
    });
    if (!studentProfile) {
      throw createHttpError3(404, "Student profile not found for this institution");
    }
    const existingPending2 = await prisma.institutionTransferRequest.findFirst({
      where: {
        studentProfileId: studentProfile.id,
        status: InstitutionTransferStatus.PENDING
      },
      select: {
        id: true
      }
    });
    if (existingPending2) {
      throw createHttpError3(409, "A pending transfer request already exists for this student");
    }
    return prisma.institutionTransferRequest.create({
      data: {
        entityType: payload.entityType,
        sourceInstitutionId: context.institutionId,
        targetInstitutionId: payload.targetInstitutionId,
        requesterUserId: userId,
        studentProfileId: studentProfile.id,
        requestMessage: payload.requestMessage?.trim() || null,
        requestedAt: /* @__PURE__ */ new Date()
      },
      include: {
        sourceInstitution: {
          select: {
            id: true,
            name: true,
            shortName: true
          }
        },
        targetInstitution: {
          select: {
            id: true,
            name: true,
            shortName: true
          }
        },
        requesterUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        studentProfile: {
          select: {
            id: true,
            studentsId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  }
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      id: payload.profileId,
      institutionId: context.institutionId
    },
    select: {
      id: true
    }
  });
  if (!teacherProfile) {
    throw createHttpError3(404, "Teacher profile not found for this institution");
  }
  const existingPending = await prisma.institutionTransferRequest.findFirst({
    where: {
      teacherProfileId: teacherProfile.id,
      status: InstitutionTransferStatus.PENDING
    },
    select: {
      id: true
    }
  });
  if (existingPending) {
    throw createHttpError3(409, "A pending transfer request already exists for this teacher");
  }
  return prisma.institutionTransferRequest.create({
    data: {
      entityType: payload.entityType,
      sourceInstitutionId: context.institutionId,
      targetInstitutionId: payload.targetInstitutionId,
      requesterUserId: userId,
      teacherProfileId: teacherProfile.id,
      requestMessage: payload.requestMessage?.trim() || null,
      requestedAt: /* @__PURE__ */ new Date()
    },
    include: {
      sourceInstitution: {
        select: {
          id: true,
          name: true,
          shortName: true
        }
      },
      targetInstitution: {
        select: {
          id: true,
          name: true,
          shortName: true
        }
      },
      requesterUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
};
var listOutgoingInstitutionTransferRequests = async (userId, query) => {
  const context = await resolveAcademicInstitutionContext(userId);
  return prisma.institutionTransferRequest.findMany({
    where: {
      sourceInstitutionId: context.institutionId,
      status: query.status,
      entityType: query.entityType
    },
    include: {
      sourceInstitution: {
        select: {
          id: true,
          name: true,
          shortName: true
        }
      },
      targetInstitution: {
        select: {
          id: true,
          name: true,
          shortName: true
        }
      },
      requesterUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      reviewerUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      targetDepartment: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var listIncomingInstitutionTransferRequests = async (userId, query) => {
  const context = await resolveAcademicInstitutionContext(userId);
  return prisma.institutionTransferRequest.findMany({
    where: {
      targetInstitutionId: context.institutionId,
      status: query.status,
      entityType: query.entityType
    },
    include: {
      sourceInstitution: {
        select: {
          id: true,
          name: true,
          shortName: true
        }
      },
      targetInstitution: {
        select: {
          id: true,
          name: true,
          shortName: true
        }
      },
      requesterUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      reviewerUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      targetDepartment: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var reviewInstitutionTransferRequest = async (reviewerUserId, transferRequestId, payload) => {
  const context = await resolveAcademicInstitutionContext(reviewerUserId);
  const request = await prisma.institutionTransferRequest.findFirst({
    where: {
      id: transferRequestId,
      targetInstitutionId: context.institutionId
    },
    include: {
      teacherProfile: {
        select: {
          id: true,
          userId: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          userId: true
        }
      }
    }
  });
  if (!request) {
    throw createHttpError3(404, "Transfer request not found");
  }
  if (request.status !== InstitutionTransferStatus.PENDING) {
    throw createHttpError3(400, "Transfer request has already been reviewed");
  }
  if (payload.status === InstitutionTransferStatus.REJECTED) {
    return prisma.institutionTransferRequest.update({
      where: {
        id: request.id
      },
      data: {
        status: InstitutionTransferStatus.REJECTED,
        responseMessage: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date()
      },
      include: {
        sourceInstitution: true,
        targetInstitution: true,
        studentProfile: true,
        teacherProfile: true
      }
    });
  }
  if (request.entityType === InstitutionTransferEntityType.TEACHER) {
    if (!request.teacherProfileId || !request.teacherProfile) {
      throw createHttpError3(400, "Teacher profile is missing for this transfer request");
    }
    const teacherProfile = request.teacherProfile;
    const targetDepartmentId = payload.targetDepartmentId?.trim();
    if (!targetDepartmentId) {
      throw createHttpError3(400, "targetDepartmentId is required to accept teacher transfer");
    }
    const targetDepartment = await prisma.department.findFirst({
      where: {
        id: targetDepartmentId,
        faculty: {
          institutionId: context.institutionId
        }
      },
      select: {
        id: true
      }
    });
    if (!targetDepartment) {
      throw createHttpError3(404, "Target department not found for target institution");
    }
    return prisma.$transaction(async (trx) => {
      await trx.teacherProfile.update({
        where: {
          id: request.teacherProfileId
        },
        data: {
          institutionId: context.institutionId,
          departmentId: targetDepartment.id
        }
      });
      await trx.user.update({
        where: {
          id: teacherProfile.userId
        },
        data: {
          accountStatus: AccountStatus.ACTIVE
        }
      });
      return trx.institutionTransferRequest.update({
        where: {
          id: request.id
        },
        data: {
          status: InstitutionTransferStatus.ACCEPTED,
          responseMessage: payload.responseMessage?.trim() || null,
          reviewerUserId,
          reviewedAt: /* @__PURE__ */ new Date(),
          targetDepartmentId: targetDepartment.id
        },
        include: {
          sourceInstitution: true,
          targetInstitution: true,
          studentProfile: true,
          teacherProfile: true,
          targetDepartment: true
        }
      });
    });
  }
  if (!request.studentProfileId || !request.studentProfile) {
    throw createHttpError3(400, "Student profile is missing for this transfer request");
  }
  const studentProfile = request.studentProfile;
  return prisma.$transaction(async (trx) => {
    await trx.studentProfile.update({
      where: {
        id: request.studentProfileId
      },
      data: {
        institutionId: context.institutionId,
        departmentId: null
      }
    });
    await trx.user.update({
      where: {
        id: studentProfile.userId
      },
      data: {
        accountStatus: AccountStatus.ACTIVE
      }
    });
    return trx.institutionTransferRequest.update({
      where: {
        id: request.id
      },
      data: {
        status: InstitutionTransferStatus.ACCEPTED,
        responseMessage: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date()
      },
      include: {
        sourceInstitution: true,
        targetInstitution: true,
        studentProfile: true,
        teacherProfile: true
      }
    });
  });
};
var getDashboardSummary = async (userId) => {
  const context = await resolveDepartmentContext(userId);
  const [user, institution, department, stats] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    }),
    prisma.institution.findUnique({
      where: {
        id: context.institutionId
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        institutionLogo: true,
        type: true
      }
    }),
    prisma.department.findUnique({
      where: {
        id: context.departmentId
      },
      select: {
        id: true,
        fullName: true,
        shortName: true,
        description: true
      }
    }),
    Promise.all([
      prisma.semester.count({
        where: {
          institutionId: context.institutionId
        }
      }),
      prisma.section.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId
        }
      }),
      prisma.teacherProfile.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId
        }
      }),
      prisma.course.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId
        }
      }),
      prisma.studentProfile.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId
        }
      }),
      prisma.teacherJobApplication.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId,
          status: "PENDING"
        }
      }),
      prisma.studentAdmissionApplication.count({
        where: {
          posting: {
            institutionId: context.institutionId,
            departmentId: context.departmentId
          },
          status: "PENDING"
        }
      })
    ])
  ]);
  const [totalSemesters, totalSections, totalTeachers, totalCourses, totalStudents, pendingTeacherApplications, pendingStudentApplications] = stats;
  return {
    user,
    institution,
    department,
    stats: {
      totalSemesters,
      totalSections,
      totalTeachers,
      totalCourses,
      totalStudents,
      pendingTeacherApplications,
      pendingStudentApplications
    }
  };
};
var listStudentAdmissionApplications = async (userId, status) => {
  const context = await resolveDepartmentContext(userId);
  return prisma.studentAdmissionApplication.findMany({
    where: {
      status,
      posting: {
        institutionId: context.institutionId,
        departmentId: context.departmentId
      }
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
          summary: true,
          institutionId: true,
          departmentId: true
        }
      },
      studentUser: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true,
          studentApplicationProfile: {
            select: {
              id: true,
              headline: true,
              about: true,
              documentUrls: true,
              academicRecords: true,
              isComplete: true,
              updatedAt: true
            }
          }
        }
      },
      reviewerUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          bio: true,
          departmentId: true,
          institutionId: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var reviewStudentAdmissionApplication = async (reviewerUserId, applicationId, payload) => {
  const context = await resolveDepartmentContext(reviewerUserId);
  const application = await prisma.studentAdmissionApplication.findFirst({
    where: {
      id: applicationId,
      posting: {
        institutionId: context.institutionId,
        departmentId: context.departmentId
      }
    },
    include: {
      posting: {
        select: {
          id: true,
          institutionId: true,
          departmentId: true
        }
      }
    }
  });
  if (!application) {
    throw createHttpError3(404, "Student admission application not found");
  }
  if (application.status === StudentAdmissionApplicationStatus.APPROVED || application.status === StudentAdmissionApplicationStatus.REJECTED) {
    throw createHttpError3(400, "Application has already been reviewed");
  }
  if (payload.status === StudentAdmissionApplicationStatus.REJECTED) {
    return prisma.studentAdmissionApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: StudentAdmissionApplicationStatus.REJECTED,
        institutionResponse: payload.rejectionReason?.trim() || null,
        reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  if (payload.status === StudentAdmissionApplicationStatus.SHORTLISTED) {
    return prisma.studentAdmissionApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: StudentAdmissionApplicationStatus.SHORTLISTED,
        institutionResponse: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  const studentsId = payload.studentsId?.trim();
  if (!studentsId) {
    throw createHttpError3(400, "studentsId is required for approval");
  }
  return prisma.$transaction(async (trx) => {
    const existingProfile = await trx.studentProfile.findFirst({
      where: {
        userId: application.studentUserId
      },
      select: {
        id: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    let studentProfileId = existingProfile?.id;
    if (studentProfileId) {
      await trx.studentProfile.update({
        where: {
          id: studentProfileId
        },
        data: {
          studentsId,
          bio: payload.bio?.trim() || void 0,
          institutionId: context.institutionId,
          departmentId: context.departmentId
        }
      });
    } else {
      const createdProfile = await trx.studentProfile.create({
        data: {
          studentsId,
          bio: payload.bio?.trim() || null,
          userId: application.studentUserId,
          institutionId: context.institutionId,
          departmentId: context.departmentId
        },
        select: {
          id: true
        }
      });
      studentProfileId = createdProfile.id;
    }
    await trx.user.update({
      where: {
        id: application.studentUserId
      },
      data: {
        accountStatus: AccountStatus.ACTIVE
      }
    });
    return trx.studentAdmissionApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: StudentAdmissionApplicationStatus.APPROVED,
        institutionResponse: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date(),
        studentProfileId
      },
      include: {
        studentUser: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true
          }
        },
        posting: {
          select: {
            id: true,
            title: true,
            location: true,
            summary: true,
            institutionId: true,
            departmentId: true
          }
        }
      }
    });
  });
};
var upsertFeeConfiguration = async (userId, payload) => {
  const context = await resolveDepartmentContext(userId);
  if (payload.monthlyFeeAmount > payload.totalFeeAmount) {
    throw createHttpError3(400, "monthlyFeeAmount cannot exceed totalFeeAmount");
  }
  const semester = await prisma.semester.findFirst({
    where: {
      id: payload.semesterId,
      institutionId: context.institutionId
    },
    select: {
      id: true
    }
  });
  if (!semester) {
    throw createHttpError3(404, "Semester not found for this institution");
  }
  return departmentSemesterFeeConfigurationDelegate().upsert({
    where: {
      departmentId_semesterId: {
        departmentId: context.departmentId,
        semesterId: payload.semesterId
      }
    },
    create: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      semesterId: payload.semesterId,
      totalFeeAmount: payload.totalFeeAmount,
      monthlyFeeAmount: payload.monthlyFeeAmount,
      currency: payload.currency?.trim().toUpperCase() || "BDT",
      isActive: true
    },
    update: {
      totalFeeAmount: payload.totalFeeAmount,
      monthlyFeeAmount: payload.monthlyFeeAmount,
      currency: payload.currency?.trim().toUpperCase() || void 0,
      isActive: true
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    }
  });
};
var listFeeConfigurations = async (userId, query) => {
  const context = await resolveDepartmentContext(userId);
  const configurations = await departmentSemesterFeeConfigurationDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      semesterId: query.semesterId,
      isActive: true
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    },
    orderBy: {
      semester: {
        startDate: "desc"
      }
    }
  });
  if (configurations.length === 0) {
    return [];
  }
  const configurationIds = configurations.map((item) => item.id);
  const payments = await studentFeePaymentDelegate().findMany({
    where: {
      feeConfigurationId: {
        in: configurationIds
      },
      status: FEE_PAYMENT_STATUS_SUCCESS
    },
    select: {
      feeConfigurationId: true,
      amount: true,
      studentProfileId: true
    }
  });
  const paymentStats = /* @__PURE__ */ new Map();
  for (const payment of payments) {
    const existing = paymentStats.get(payment.feeConfigurationId) ?? {
      totalPaidAmount: 0,
      studentIds: /* @__PURE__ */ new Set()
    };
    existing.totalPaidAmount += toMoneyNumber(payment.amount);
    existing.studentIds.add(payment.studentProfileId);
    paymentStats.set(payment.feeConfigurationId, existing);
  }
  return configurations.map((item) => {
    const stats = paymentStats.get(item.id);
    return {
      ...item,
      totalPaidAmount: toMoneyNumber(stats?.totalPaidAmount ?? 0),
      totalStudentsPaid: stats?.studentIds.size ?? 0,
      outstandingAmount: Math.max(
        0,
        toMoneyNumber(item.totalFeeAmount) - toMoneyNumber(stats?.totalPaidAmount ?? 0)
      )
    };
  });
};
var getStudentPaymentInfoByStudentId = async (userId, studentsId, semesterId) => {
  const context = await resolveDepartmentContext(userId);
  const normalizedStudentId = studentsId.trim();
  const student = await prisma.studentProfile.findFirst({
    where: {
      studentsId: {
        equals: normalizedStudentId,
        mode: "insensitive"
      },
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true
        }
      }
    }
  });
  if (!student) {
    throw createHttpError3(404, "Student not found for this department");
  }
  const configurations = await departmentSemesterFeeConfigurationDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      semesterId,
      isActive: true
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    },
    orderBy: {
      semester: {
        startDate: "desc"
      }
    }
  });
  const payments = await studentFeePaymentDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      studentProfileId: student.id,
      semesterId
    },
    select: {
      id: true,
      semesterId: true,
      amount: true,
      monthsCovered: true,
      paymentMode: true,
      status: true,
      currency: true,
      tranId: true,
      paidAt: true,
      createdAt: true,
      gatewayCardType: true,
      gatewayBankTranId: true,
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const paidBySemester = /* @__PURE__ */ new Map();
  for (const payment of payments) {
    if (payment.status !== FEE_PAYMENT_STATUS_SUCCESS) {
      continue;
    }
    paidBySemester.set(
      payment.semesterId,
      toMoneyNumber((paidBySemester.get(payment.semesterId) ?? 0) + toMoneyNumber(payment.amount))
    );
  }
  const feeSummaries = configurations.map((configuration) => {
    const total = toMoneyNumber(configuration.totalFeeAmount);
    const paid = toMoneyNumber(paidBySemester.get(configuration.semesterId) ?? 0);
    return {
      feeConfigurationId: configuration.id,
      semester: configuration.semester,
      totalFeeAmount: total,
      monthlyFeeAmount: toMoneyNumber(configuration.monthlyFeeAmount),
      currency: configuration.currency,
      paidAmount: paid,
      dueAmount: Math.max(0, toMoneyNumber(total - paid))
    };
  });
  return {
    student: {
      id: student.id,
      studentsId: student.studentsId,
      user: student.user
    },
    feeSummaries,
    paymentHistory: payments.map((payment) => ({
      ...payment,
      amount: toMoneyNumber(payment.amount)
    }))
  };
};
var DepartmentService = {
  listWorkspaceDepartments,
  setActiveWorkspaceDepartment,
  getDepartmentProfile,
  updateDepartmentProfile,
  listSemesters,
  createSemester,
  updateSemester,
  listSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  listBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  listSections,
  createSection,
  updateSection,
  deleteSection,
  listPrograms,
  createProgram,
  updateProgram,
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  listCourseRegistrations,
  listSectionCourseTeacherAssignments,
  upsertSectionCourseTeacherAssignment,
  listRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  createCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration,
  listTeachers,
  createTeacher,
  updateTeacher,
  removeTeacher,
  listStudents,
  createStudent,
  updateStudent,
  removeStudent,
  getDashboardSummary,
  listStudentAdmissionApplications,
  reviewStudentAdmissionApplication,
  upsertFeeConfiguration,
  listFeeConfigurations,
  getStudentPaymentInfoByStudentId,
  createInstitutionTransferRequest,
  listOutgoingInstitutionTransferRequests,
  listIncomingInstitutionTransferRequests,
  reviewInstitutionTransferRequest
};

// src/app/module/department/department.controller.ts
var readParam2 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue2 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
var getDepartmentProfile2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.getDepartmentProfile(
    user.id,
    req.query.departmentId
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department profile fetched successfully",
    data: result
  });
});
var listWorkspaceDepartments2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listWorkspaceDepartments(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Workspace departments fetched successfully",
    data: result
  });
});
var setActiveWorkspaceDepartment2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.setActiveWorkspaceDepartment(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Active workspace department updated successfully",
    data: result
  });
});
var getDashboardSummary2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.getDashboardSummary(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department dashboard summary fetched successfully",
    data: result
  });
});
var updateDepartmentProfile2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateDepartmentProfile(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department profile updated successfully",
    data: result
  });
});
var listSemesters2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listSemesters(user.id, readQueryValue2(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semesters fetched successfully",
    data: result
  });
});
var createSemester2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createSemester(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Semester created successfully",
    data: result
  });
});
var listSchedules2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listSchedules(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search),
    readQueryValue2(req.query.semesterId)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Class slots fetched successfully",
    data: result
  });
});
var createSchedule2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createSchedule(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Class slot created successfully",
    data: result
  });
});
var updateSchedule2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateSchedule(user.id, readParam2(req.params.scheduleId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Class slot updated successfully",
    data: result
  });
});
var deleteSchedule2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.deleteSchedule(user.id, readParam2(req.params.scheduleId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Class slot deleted successfully",
    data: result
  });
});
var updateSemester2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateSemester(
    user.id,
    readParam2(req.params.semesterId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semester updated successfully",
    data: result
  });
});
var listBatches2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listBatches(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Batches fetched successfully",
    data: result
  });
});
var createBatch2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createBatch(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Batch created successfully",
    data: result
  });
});
var updateBatch2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateBatch(user.id, readParam2(req.params.batchId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Batch updated successfully",
    data: result
  });
});
var deleteBatch2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.deleteBatch(user.id, readParam2(req.params.batchId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Batch deleted successfully",
    data: result
  });
});
var listSections2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listSections(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Sections fetched successfully",
    data: result
  });
});
var createSection2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createSection(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Section created successfully",
    data: result
  });
});
var updateSection2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateSection(
    user.id,
    readParam2(req.params.sectionId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Section updated successfully",
    data: result
  });
});
var deleteSection2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.deleteSection(user.id, readParam2(req.params.sectionId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Section deleted successfully",
    data: result
  });
});
var listPrograms2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listPrograms(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Programs fetched successfully",
    data: result
  });
});
var createProgram2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createProgram(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Program created successfully",
    data: result
  });
});
var updateProgram2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateProgram(
    user.id,
    readParam2(req.params.programId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Program updated successfully",
    data: result
  });
});
var listCourses2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listCourses(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Courses fetched successfully",
    data: result
  });
});
var createCourse2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createCourse(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Course created successfully",
    data: result
  });
});
var updateCourse2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateCourse(
    user.id,
    readParam2(req.params.courseId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course updated successfully",
    data: result
  });
});
var deleteCourse2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.deleteCourse(user.id, readParam2(req.params.courseId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course deleted successfully",
    data: result
  });
});
var listCourseRegistrations2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listCourseRegistrations(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search),
    readQueryValue2(req.query.semesterId)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course registrations fetched successfully",
    data: result
  });
});
var listSectionCourseTeacherAssignments2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listSectionCourseTeacherAssignments(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course teacher assignments fetched successfully",
    data: result
  });
});
var upsertSectionCourseTeacherAssignment2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.upsertSectionCourseTeacherAssignment(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course teacher assignment saved successfully",
    data: result
  });
});
var createCourseRegistration2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createCourseRegistration(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Course registration created successfully",
    data: result
  });
});
var listRoutines2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listRoutines(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search),
    readQueryValue2(req.query.semesterId)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Routines fetched successfully",
    data: result
  });
});
var createRoutine2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createRoutine(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Routine created successfully",
    data: result
  });
});
var updateRoutine2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateRoutine(user.id, readParam2(req.params.routineId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Routine updated successfully",
    data: result
  });
});
var deleteRoutine2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.deleteRoutine(user.id, readParam2(req.params.routineId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Routine deleted successfully",
    data: result
  });
});
var updateCourseRegistration2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateCourseRegistration(
    user.id,
    readParam2(req.params.courseRegistrationId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course registration updated successfully",
    data: result
  });
});
var deleteCourseRegistration2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.deleteCourseRegistration(
    user.id,
    readParam2(req.params.courseRegistrationId)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Course registration deleted successfully",
    data: result
  });
});
var listTeachers2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listTeachers(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teachers fetched successfully",
    data: result
  });
});
var createTeacher2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createTeacher(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Teacher created successfully",
    data: result
  });
});
var updateTeacher2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateTeacher(
    user.id,
    readParam2(req.params.teacherProfileId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher updated successfully",
    data: result
  });
});
var removeTeacher2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.removeTeacher(user.id, readParam2(req.params.teacherProfileId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher removed successfully",
    data: result
  });
});
var listStudents2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listStudents(
    user.id,
    req.query.departmentId,
    readQueryValue2(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Students fetched successfully",
    data: result
  });
});
var createStudent2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createStudent(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Student created successfully",
    data: result
  });
});
var updateStudent2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateStudent(
    user.id,
    readParam2(req.params.studentProfileId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student updated successfully",
    data: result
  });
});
var removeStudent2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.removeStudent(user.id, readParam2(req.params.studentProfileId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student removed successfully",
    data: result
  });
});
var listStudentAdmissionApplications2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listStudentAdmissionApplications(
    user.id,
    req.query.status
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission applications fetched successfully",
    data: result
  });
});
var reviewStudentAdmissionApplication2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.reviewStudentAdmissionApplication(
    user.id,
    readParam2(req.params.applicationId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission application reviewed successfully",
    data: result
  });
});
var listFeeConfigurations2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : void 0;
  const result = await DepartmentService.listFeeConfigurations(user.id, { semesterId });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department fee configurations fetched successfully",
    data: result
  });
});
var upsertFeeConfiguration2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.upsertFeeConfiguration(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department fee configuration saved successfully",
    data: result
  });
});
var getStudentPaymentInfoByStudentId2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : void 0;
  const result = await DepartmentService.getStudentPaymentInfoByStudentId(
    user.id,
    readParam2(req.params.studentsId),
    semesterId
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student payment info fetched successfully",
    data: result
  });
});
var createInstitutionTransferRequest2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.createInstitutionTransferRequest(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Transfer request created successfully",
    data: result
  });
});
var listOutgoingInstitutionTransferRequests2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listOutgoingInstitutionTransferRequests(user.id, {
    status: req.query.status,
    entityType: req.query.entityType
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Outgoing transfer requests fetched successfully",
    data: result
  });
});
var listIncomingInstitutionTransferRequests2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listIncomingInstitutionTransferRequests(user.id, {
    status: req.query.status,
    entityType: req.query.entityType
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Incoming transfer requests fetched successfully",
    data: result
  });
});
var reviewInstitutionTransferRequest2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.reviewInstitutionTransferRequest(
    user.id,
    readParam2(req.params.transferRequestId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Transfer request reviewed successfully",
    data: result
  });
});
var DepartmentController = {
  listWorkspaceDepartments: listWorkspaceDepartments2,
  setActiveWorkspaceDepartment: setActiveWorkspaceDepartment2,
  getDepartmentProfile: getDepartmentProfile2,
  getDashboardSummary: getDashboardSummary2,
  updateDepartmentProfile: updateDepartmentProfile2,
  listSemesters: listSemesters2,
  createSemester: createSemester2,
  listSchedules: listSchedules2,
  createSchedule: createSchedule2,
  updateSchedule: updateSchedule2,
  deleteSchedule: deleteSchedule2,
  updateSemester: updateSemester2,
  listBatches: listBatches2,
  createBatch: createBatch2,
  updateBatch: updateBatch2,
  deleteBatch: deleteBatch2,
  listSections: listSections2,
  createSection: createSection2,
  updateSection: updateSection2,
  deleteSection: deleteSection2,
  listPrograms: listPrograms2,
  createProgram: createProgram2,
  updateProgram: updateProgram2,
  listCourses: listCourses2,
  createCourse: createCourse2,
  updateCourse: updateCourse2,
  deleteCourse: deleteCourse2,
  listCourseRegistrations: listCourseRegistrations2,
  listSectionCourseTeacherAssignments: listSectionCourseTeacherAssignments2,
  upsertSectionCourseTeacherAssignment: upsertSectionCourseTeacherAssignment2,
  createCourseRegistration: createCourseRegistration2,
  listRoutines: listRoutines2,
  createRoutine: createRoutine2,
  updateRoutine: updateRoutine2,
  deleteRoutine: deleteRoutine2,
  updateCourseRegistration: updateCourseRegistration2,
  deleteCourseRegistration: deleteCourseRegistration2,
  listTeachers: listTeachers2,
  createTeacher: createTeacher2,
  updateTeacher: updateTeacher2,
  removeTeacher: removeTeacher2,
  listStudents: listStudents2,
  createStudent: createStudent2,
  updateStudent: updateStudent2,
  removeStudent: removeStudent2,
  listStudentAdmissionApplications: listStudentAdmissionApplications2,
  reviewStudentAdmissionApplication: reviewStudentAdmissionApplication2,
  listFeeConfigurations: listFeeConfigurations2,
  upsertFeeConfiguration: upsertFeeConfiguration2,
  getStudentPaymentInfoByStudentId: getStudentPaymentInfoByStudentId2,
  createInstitutionTransferRequest: createInstitutionTransferRequest2,
  listOutgoingInstitutionTransferRequests: listOutgoingInstitutionTransferRequests2,
  listIncomingInstitutionTransferRequests: listIncomingInstitutionTransferRequests2,
  reviewInstitutionTransferRequest: reviewInstitutionTransferRequest2
};

// src/app/module/department/department.validation.ts
import { z as z3 } from "zod";
var uuidSchema2 = z3.uuid("Please provide a valid id");
var timeStringSchema = z3.string("Time must be a string").regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format");
var passwordSchema = z3.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
var DepartmentValidation = {
  setActiveDepartmentWorkspaceSchema: z3.object({
    body: z3.object({
      departmentId: uuidSchema2
    })
  }),
  updateDepartmentProfileSchema: z3.object({
    body: z3.object({
      fullName: z3.string("Full name must be a string").trim().min(2).max(120).optional(),
      shortName: z3.string("Short name must be a string").trim().min(2).max(30).optional(),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema2.optional(),
      name: z3.string("name must be a string").trim().min(2).max(120).optional(),
      image: z3.url("image must be a valid URL").trim().optional(),
      contactNo: z3.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z3.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z3.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z3.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z3.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createSemesterSchema: z3.object({
    body: z3.object({
      name: z3.string("Semester name is required").trim().min(2).max(80),
      startDate: z3.iso.datetime("startDate must be a valid ISO datetime"),
      endDate: z3.iso.datetime("endDate must be a valid ISO datetime")
    })
  }),
  createScheduleSchema: z3.object({
    body: z3.object({
      name: z3.string("Class slot name is required").trim().min(2).max(120),
      description: z3.string("Description must be a string").trim().max(500).optional(),
      semesterId: uuidSchema2,
      startTime: timeStringSchema,
      endTime: timeStringSchema,
      status: z3.enum(SlotStatus).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateScheduleSchema: z3.object({
    params: z3.object({
      scheduleId: uuidSchema2
    }),
    body: z3.object({
      name: z3.string("Class slot name must be a string").trim().min(2).max(120).optional(),
      description: z3.string("Description must be a string").trim().max(500).optional(),
      semesterId: uuidSchema2.optional(),
      startTime: timeStringSchema.optional(),
      endTime: timeStringSchema.optional(),
      status: z3.enum(SlotStatus).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteScheduleSchema: z3.object({
    params: z3.object({
      scheduleId: uuidSchema2
    })
  }),
  updateSemesterSchema: z3.object({
    params: z3.object({
      semesterId: uuidSchema2
    }),
    body: z3.object({
      name: z3.string("Semester name must be a string").trim().min(2).max(80).optional(),
      startDate: z3.iso.datetime("startDate must be a valid ISO datetime").optional(),
      endDate: z3.iso.datetime("endDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createBatchSchema: z3.object({
    body: z3.object({
      name: z3.string("Batch name is required").trim().min(1).max(80),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateBatchSchema: z3.object({
    params: z3.object({
      batchId: uuidSchema2
    }),
    body: z3.object({
      name: z3.string("Batch name must be a string").trim().min(1).max(80).optional(),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteBatchSchema: z3.object({
    params: z3.object({
      batchId: uuidSchema2
    })
  }),
  createSectionSchema: z3.object({
    body: z3.object({
      name: z3.string("Section name is required").trim().min(1).max(80),
      semesterId: uuidSchema2,
      batchId: uuidSchema2,
      sectionCapacity: z3.number().int().positive().max(500).optional(),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateSectionSchema: z3.object({
    params: z3.object({
      sectionId: uuidSchema2
    }),
    body: z3.object({
      name: z3.string("Section name must be a string").trim().min(1).max(80).optional(),
      semesterId: uuidSchema2.optional(),
      batchId: uuidSchema2.optional(),
      sectionCapacity: z3.number().int().positive().max(500).optional(),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteSectionSchema: z3.object({
    params: z3.object({
      sectionId: uuidSchema2
    })
  }),
  createProgramSchema: z3.object({
    body: z3.object({
      title: z3.string("Program title is required").trim().min(2).max(120),
      shortTitle: z3.string("Short title must be a string").trim().min(2).max(30).optional(),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z3.number().positive().max(500).optional(),
      cost: z3.number().nonnegative().max(1e8).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateProgramSchema: z3.object({
    params: z3.object({
      programId: uuidSchema2
    }),
    body: z3.object({
      title: z3.string("Program title must be a string").trim().min(2).max(120).optional(),
      shortTitle: z3.string("Short title must be a string").trim().min(2).max(30).optional(),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z3.number().positive().max(500).optional(),
      cost: z3.number().nonnegative().max(1e8).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createCourseSchema: z3.object({
    body: z3.object({
      courseCode: z3.string("Course code is required").trim().min(2).max(30),
      courseTitle: z3.string("Course title is required").trim().min(2).max(120),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z3.number().int().positive().max(500).optional(),
      programId: uuidSchema2.optional()
    })
  }),
  updateCourseSchema: z3.object({
    params: z3.object({
      courseId: uuidSchema2
    }),
    body: z3.object({
      courseCode: z3.string("Course code must be a string").trim().min(2).max(30).optional(),
      courseTitle: z3.string("Course title must be a string").trim().min(2).max(120).optional(),
      description: z3.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z3.number().int().positive().max(500).optional(),
      programId: uuidSchema2.optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteCourseSchema: z3.object({
    params: z3.object({
      courseId: uuidSchema2
    })
  }),
  createCourseRegistrationSchema: z3.object({
    body: z3.object({
      courseId: uuidSchema2,
      studentProfileId: uuidSchema2,
      sectionId: uuidSchema2,
      programId: uuidSchema2.optional(),
      semesterId: uuidSchema2,
      departmentId: uuidSchema2.optional(),
      registrationDate: z3.iso.datetime("registrationDate must be a valid ISO datetime").optional()
    })
  }),
  updateCourseRegistrationSchema: z3.object({
    params: z3.object({
      courseRegistrationId: uuidSchema2
    }),
    body: z3.object({
      courseId: uuidSchema2.optional(),
      studentProfileId: uuidSchema2.optional(),
      sectionId: uuidSchema2.optional(),
      programId: uuidSchema2.optional(),
      semesterId: uuidSchema2.optional(),
      registrationDate: z3.iso.datetime("registrationDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteCourseRegistrationSchema: z3.object({
    params: z3.object({
      courseRegistrationId: uuidSchema2
    })
  }),
  upsertSectionCourseTeacherAssignmentSchema: z3.object({
    body: z3.object({
      sectionId: uuidSchema2,
      courseId: uuidSchema2,
      teacherProfileId: uuidSchema2,
      semesterId: uuidSchema2,
      departmentId: uuidSchema2.optional()
    })
  }),
  createRoutineSchema: z3.object({
    body: z3.object({
      name: z3.string("Routine name is required").trim().min(2).max(120),
      description: z3.string("Description must be a string").trim().max(500).optional(),
      version: z3.string("Version must be a string").trim().max(80).optional(),
      scheduleId: uuidSchema2,
      courseRegistrationId: uuidSchema2,
      classRoomId: uuidSchema2,
      departmentId: uuidSchema2.optional()
    })
  }),
  updateRoutineSchema: z3.object({
    params: z3.object({
      routineId: uuidSchema2
    }),
    body: z3.object({
      name: z3.string("Routine name must be a string").trim().min(2).max(120).optional(),
      description: z3.string("Description must be a string").trim().max(500).optional(),
      version: z3.string("Version must be a string").trim().max(80).optional(),
      scheduleId: uuidSchema2.optional(),
      courseRegistrationId: uuidSchema2.optional(),
      classRoomId: uuidSchema2.optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteRoutineSchema: z3.object({
    params: z3.object({
      routineId: uuidSchema2
    })
  }),
  createTeacherSchema: z3.object({
    body: z3.object({
      name: z3.string("Name is required").trim().min(2).max(60),
      email: z3.email("Please provide a valid email").toLowerCase().trim(),
      password: passwordSchema,
      teacherInitial: z3.string("Teacher initial is required").trim().min(2).max(20),
      teachersId: z3.string("Teacher id is required").trim().min(2).max(50),
      designation: z3.string("Designation is required").trim().min(2).max(80),
      bio: z3.string("Bio must be a string").trim().max(500).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateTeacherSchema: z3.object({
    params: z3.object({
      teacherProfileId: uuidSchema2
    }),
    body: z3.object({
      designation: z3.string("Designation must be a string").trim().min(2).max(80).optional(),
      bio: z3.string("Bio must be a string").trim().max(500).optional(),
      accountStatus: z3.enum(AccountStatus).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createStudentSchema: z3.object({
    body: z3.object({
      name: z3.string("Name is required").trim().min(2).max(60),
      email: z3.email("Please provide a valid email").toLowerCase().trim(),
      password: passwordSchema,
      studentsId: z3.string("Student id is required").trim().min(2).max(50),
      bio: z3.string("Bio must be a string").trim().max(500).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateStudentSchema: z3.object({
    params: z3.object({
      studentProfileId: uuidSchema2
    }),
    body: z3.object({
      bio: z3.string("Bio must be a string").trim().max(500).optional(),
      accountStatus: z3.enum(AccountStatus).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  listStudentAdmissionApplicationsSchema: z3.object({
    query: z3.object({
      status: z3.enum(["PENDING", "SHORTLISTED", "APPROVED", "REJECTED"]).optional()
    })
  }),
  reviewStudentAdmissionApplicationSchema: z3.object({
    params: z3.object({
      applicationId: uuidSchema2
    }),
    body: z3.object({
      status: z3.enum(["SHORTLISTED", "APPROVED", "REJECTED"]),
      responseMessage: z3.string("responseMessage must be a string").trim().max(1200).optional(),
      rejectionReason: z3.string("rejectionReason must be a string").trim().max(1200).optional(),
      studentsId: z3.string("studentsId must be a string").trim().min(2).max(50).optional(),
      bio: z3.string("bio must be a string").trim().max(1200).optional()
    }).refine(
      (value) => value.status === "REJECTED" ? Boolean(value.rejectionReason?.trim()) : true,
      {
        path: ["rejectionReason"],
        message: "rejectionReason is required when rejecting"
      }
    ).refine(
      (value) => value.status === "APPROVED" ? Boolean(value.studentsId?.trim()) : true,
      {
        path: ["studentsId"],
        message: "studentsId is required when approving"
      }
    )
  }),
  upsertFeeConfigurationSchema: z3.object({
    body: z3.object({
      semesterId: uuidSchema2,
      totalFeeAmount: z3.number().positive().max(1e8),
      monthlyFeeAmount: z3.number().positive().max(1e8),
      currency: z3.string().trim().min(3).max(10).optional()
    })
  }),
  listFeeConfigurationsSchema: z3.object({
    query: z3.object({
      semesterId: uuidSchema2.optional()
    })
  }),
  getStudentPaymentInfoSchema: z3.object({
    params: z3.object({
      studentsId: z3.string("studentsId must be a string").trim().min(2).max(50)
    }),
    query: z3.object({
      semesterId: uuidSchema2.optional()
    })
  }),
  removeTeacherSchema: z3.object({
    params: z3.object({
      teacherProfileId: uuidSchema2
    })
  }),
  removeStudentSchema: z3.object({
    params: z3.object({
      studentProfileId: uuidSchema2
    })
  }),
  createInstitutionTransferRequestSchema: z3.object({
    body: z3.object({
      entityType: z3.enum(InstitutionTransferEntityType),
      profileId: uuidSchema2,
      targetInstitutionId: uuidSchema2,
      requestMessage: z3.string("requestMessage must be a string").trim().max(1200).optional()
    })
  }),
  listInstitutionTransferRequestsSchema: z3.object({
    query: z3.object({
      status: z3.enum(InstitutionTransferStatus).optional(),
      entityType: z3.enum(InstitutionTransferEntityType).optional()
    })
  }),
  reviewInstitutionTransferRequestSchema: z3.object({
    params: z3.object({
      transferRequestId: uuidSchema2
    }),
    body: z3.object({
      status: z3.enum([InstitutionTransferStatus.ACCEPTED, InstitutionTransferStatus.REJECTED]),
      responseMessage: z3.string("responseMessage must be a string").trim().max(1200).optional(),
      targetDepartmentId: uuidSchema2.optional()
    })
  })
};

// src/app/module/department/department.route.ts
var router3 = Router3();
var departmentRoles = ["ADMIN", "FACULTY", "DEPARTMENT"];
router3.get(
  "/workspace/departments",
  requireSessionRole(...departmentRoles),
  DepartmentController.listWorkspaceDepartments
);
router3.put(
  "/workspace/active-department",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.setActiveDepartmentWorkspaceSchema),
  DepartmentController.setActiveWorkspaceDepartment
);
router3.get("/profile", requireSessionRole(...departmentRoles), DepartmentController.getDepartmentProfile);
router3.get(
  "/dashboard-summary",
  requireSessionRole(...departmentRoles),
  DepartmentController.getDashboardSummary
);
router3.patch(
  "/profile",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateDepartmentProfileSchema),
  DepartmentController.updateDepartmentProfile
);
router3.get("/semesters", requireSessionRole(...departmentRoles), DepartmentController.listSemesters);
router3.post(
  "/semesters",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createSemesterSchema),
  DepartmentController.createSemester
);
router3.get("/schedules", requireSessionRole(...departmentRoles), DepartmentController.listSchedules);
router3.post(
  "/schedules",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createScheduleSchema),
  DepartmentController.createSchedule
);
router3.patch(
  "/schedules/:scheduleId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateScheduleSchema),
  DepartmentController.updateSchedule
);
router3.delete(
  "/schedules/:scheduleId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteScheduleSchema),
  DepartmentController.deleteSchedule
);
router3.patch(
  "/semesters/:semesterId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateSemesterSchema),
  DepartmentController.updateSemester
);
router3.get("/batches", requireSessionRole(...departmentRoles), DepartmentController.listBatches);
router3.post(
  "/batches",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createBatchSchema),
  DepartmentController.createBatch
);
router3.patch(
  "/batches/:batchId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateBatchSchema),
  DepartmentController.updateBatch
);
router3.delete(
  "/batches/:batchId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteBatchSchema),
  DepartmentController.deleteBatch
);
router3.get("/sections", requireSessionRole(...departmentRoles), DepartmentController.listSections);
router3.post(
  "/sections",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createSectionSchema),
  DepartmentController.createSection
);
router3.patch(
  "/sections/:sectionId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateSectionSchema),
  DepartmentController.updateSection
);
router3.delete(
  "/sections/:sectionId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteSectionSchema),
  DepartmentController.deleteSection
);
router3.get("/programs", requireSessionRole(...departmentRoles), DepartmentController.listPrograms);
router3.post(
  "/programs",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createProgramSchema),
  DepartmentController.createProgram
);
router3.patch(
  "/programs/:programId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateProgramSchema),
  DepartmentController.updateProgram
);
router3.get("/courses", requireSessionRole(...departmentRoles), DepartmentController.listCourses);
router3.post(
  "/courses",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createCourseSchema),
  DepartmentController.createCourse
);
router3.patch(
  "/courses/:courseId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateCourseSchema),
  DepartmentController.updateCourse
);
router3.delete(
  "/courses/:courseId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteCourseSchema),
  DepartmentController.deleteCourse
);
router3.get(
  "/course-registrations",
  requireSessionRole(...departmentRoles),
  DepartmentController.listCourseRegistrations
);
router3.get(
  "/course-teacher-assignments",
  requireSessionRole(...departmentRoles),
  DepartmentController.listSectionCourseTeacherAssignments
);
router3.post(
  "/course-teacher-assignments",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.upsertSectionCourseTeacherAssignmentSchema),
  DepartmentController.upsertSectionCourseTeacherAssignment
);
router3.post(
  "/course-registrations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createCourseRegistrationSchema),
  DepartmentController.createCourseRegistration
);
router3.get("/routines", requireSessionRole(...departmentRoles), DepartmentController.listRoutines);
router3.post(
  "/routines",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createRoutineSchema),
  DepartmentController.createRoutine
);
router3.patch(
  "/routines/:routineId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateRoutineSchema),
  DepartmentController.updateRoutine
);
router3.delete(
  "/routines/:routineId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteRoutineSchema),
  DepartmentController.deleteRoutine
);
router3.patch(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateCourseRegistrationSchema),
  DepartmentController.updateCourseRegistration
);
router3.delete(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteCourseRegistrationSchema),
  DepartmentController.deleteCourseRegistration
);
router3.get("/teachers", requireSessionRole(...departmentRoles), DepartmentController.listTeachers);
router3.post(
  "/teachers",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createTeacherSchema),
  DepartmentController.createTeacher
);
router3.patch(
  "/teachers/:teacherProfileId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateTeacherSchema),
  DepartmentController.updateTeacher
);
router3.delete(
  "/teachers/:teacherProfileId/remove",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.removeTeacherSchema),
  DepartmentController.removeTeacher
);
router3.get("/students", requireSessionRole(...departmentRoles), DepartmentController.listStudents);
router3.post(
  "/students",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createStudentSchema),
  DepartmentController.createStudent
);
router3.patch(
  "/students/:studentProfileId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateStudentSchema),
  DepartmentController.updateStudent
);
router3.delete(
  "/students/:studentProfileId/remove",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.removeStudentSchema),
  DepartmentController.removeStudent
);
router3.get(
  "/student-applications",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listStudentAdmissionApplicationsSchema),
  DepartmentController.listStudentAdmissionApplications
);
router3.patch(
  "/student-applications/:applicationId/review",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.reviewStudentAdmissionApplicationSchema),
  DepartmentController.reviewStudentAdmissionApplication
);
router3.get(
  "/fees/configurations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listFeeConfigurationsSchema),
  DepartmentController.listFeeConfigurations
);
router3.post(
  "/fees/configurations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.upsertFeeConfigurationSchema),
  DepartmentController.upsertFeeConfiguration
);
router3.get(
  "/fees/students/:studentsId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.getStudentPaymentInfoSchema),
  DepartmentController.getStudentPaymentInfoByStudentId
);
router3.post(
  "/transfers",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createInstitutionTransferRequestSchema),
  DepartmentController.createInstitutionTransferRequest
);
router3.get(
  "/transfers/outgoing",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listInstitutionTransferRequestsSchema),
  DepartmentController.listOutgoingInstitutionTransferRequests
);
router3.get(
  "/transfers/incoming",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listInstitutionTransferRequestsSchema),
  DepartmentController.listIncomingInstitutionTransferRequests
);
router3.patch(
  "/transfers/:transferRequestId/review",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.reviewInstitutionTransferRequestSchema),
  DepartmentController.reviewInstitutionTransferRequest
);
var DepartmentRouter = router3;

// src/app/module/apply/apply.validation.ts
import z4 from "zod";
var ApplyForInstitutionValidationSchema = {
  applyForInstitutionSchema: z4.object({
    name: z4.string().min(1, "Name is required"),
    email: z4.string().email("Invalid email address"),
    password: z4.string().min(6, "Password must be at least 6 characters long"),
    instituteName: z4.string().min(1, "Institute name is required"),
    instituteShortname: z4.string().min(1, "Institute shortname is required"),
    description: z4.string().min(1, "Description is required"),
    instituteType: z4.enum(
      [
        InstitutionType.COLLEGE,
        InstitutionType.SCHOOL,
        InstitutionType.UNIVERSITY,
        InstitutionType.TRAINING_CENTER,
        InstitutionType.OTHER
      ],
      "Invalid institute type"
    ),
    instituteLogo: z4.string().min(1, "Institute logo is required")
  })
};

// src/app/module/auth/auth.route.ts
import { Router as Router4 } from "express";

// src/app/module/auth/authOtp.service.ts
import { createHash, randomInt } from "crypto";

// src/app/shared/email/templates/otpVerificationEmail.ts
function buildOtpVerificationEmail(payload) {
  const subject = "Verify your Biddyaloy account";
  const validityLabel = `${payload.validityMinutes} minute${payload.validityMinutes > 1 ? "s" : ""}`;
  const html = buildEmailTemplate({
    subject,
    previewText: `Your verification OTP is ${payload.otpCode}`,
    heading: "Account verification required",
    bodyText: `Use the OTP below to verify your account:

${payload.otpCode}`,
    helperText: `This code expires in ${validityLabel}. If you did not request it, you can ignore this email.`,
    ctaLabel: payload.verificationPageUrl ? "Open verification page" : void 0,
    ctaUrl: payload.verificationPageUrl,
    footerNote: "For your security, never share this code with anyone. Biddyaloy support will never ask for your OTP."
  });
  const text = [
    "Account verification required",
    "",
    `Your OTP: ${payload.otpCode}`,
    `This code expires in ${validityLabel}.`,
    payload.verificationPageUrl ? `Verification page: ${payload.verificationPageUrl}` : ""
  ].filter(Boolean).join("\n");
  return {
    subject,
    html,
    text
  };
}

// src/app/module/auth/authOtp.service.ts
var OTP_VALIDITY_SECONDS = 2 * 60;
var RESEND_COOLDOWN_SECONDS = 60;
function createHttpError4(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function hashOtp(otp) {
  return createHash("sha256").update(otp).digest("hex");
}
function generateOtpCode() {
  return String(randomInt(1e5, 1e6));
}
function getVerificationPageUrl(email) {
  const frontendBase = process.env.FRONTEND_PUBLIC_URL;
  if (!frontendBase) {
    return void 0;
  }
  const normalized = frontendBase.endsWith("/") ? frontendBase.slice(0, -1) : frontendBase;
  return `${normalized}/verify-account?email=${encodeURIComponent(email)}`;
}
async function cleanupExpiredOtp(userId) {
  await prisma.emailOtp.deleteMany({
    where: {
      userId,
      expiresAt: {
        lte: /* @__PURE__ */ new Date()
      }
    }
  });
}
function toOtpStatusPayload(payload) {
  return {
    verificationRequired: true,
    otpExpiresAt: payload.expiresAt.toISOString(),
    resendAvailableAt: new Date(
      payload.createdAt.getTime() + RESEND_COOLDOWN_SECONDS * 1e3
    ).toISOString(),
    otpValiditySeconds: OTP_VALIDITY_SECONDS,
    resendCooldownSeconds: RESEND_COOLDOWN_SECONDS
  };
}
async function sendOtpEmail(email, otpCode) {
  const message = buildOtpVerificationEmail({
    otpCode,
    validityMinutes: Math.floor(OTP_VALIDITY_SECONDS / 60),
    verificationPageUrl: getVerificationPageUrl(email)
  });
  await sendEmail({
    to: email,
    subject: message.subject,
    html: message.html,
    text: message.text
  });
}
async function getUserForOtpByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
      email: true,
      role: true,
      accountStatus: true
    }
  });
  if (!user) {
    throw createHttpError4(404, "User account not found");
  }
  return user;
}
async function issueAccountVerificationOtp(userId, email, options) {
  await cleanupExpiredOtp(userId);
  if (options?.enforceCooldown) {
    const existing = await prisma.emailOtp.findUnique({
      where: {
        userId
      },
      select: {
        createdAt: true
      }
    });
    if (existing) {
      const resendAvailableAt = existing.createdAt.getTime() + RESEND_COOLDOWN_SECONDS * 1e3;
      if (Date.now() < resendAvailableAt) {
        throw createHttpError4(
          429,
          "Please wait one minute before requesting another OTP email"
        );
      }
    }
  }
  const otpCode = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_VALIDITY_SECONDS * 1e3);
  const createdAt = /* @__PURE__ */ new Date();
  await prisma.emailOtp.upsert({
    where: {
      userId
    },
    create: {
      userId,
      otpHash: hashOtp(otpCode),
      expiresAt,
      createdAt
    },
    update: {
      otpHash: hashOtp(otpCode),
      expiresAt,
      createdAt
    }
  });
  await sendOtpEmail(email, otpCode);
  return toOtpStatusPayload({
    expiresAt,
    createdAt
  });
}
async function getAccountVerificationOtpStatusByEmail(email) {
  const user = await getUserForOtpByEmail(email);
  if (user.accountStatus !== AccountStatus.PENDING) {
    return {
      verificationRequired: false,
      otpExpiresAt: null,
      resendAvailableAt: null,
      otpValiditySeconds: OTP_VALIDITY_SECONDS,
      resendCooldownSeconds: RESEND_COOLDOWN_SECONDS
    };
  }
  await cleanupExpiredOtp(user.id);
  const otpRecord = await prisma.emailOtp.findUnique({
    where: {
      userId: user.id
    },
    select: {
      expiresAt: true,
      createdAt: true
    }
  });
  if (!otpRecord) {
    return issueAccountVerificationOtp(user.id, user.email, {
      enforceCooldown: false
    });
  }
  return toOtpStatusPayload({
    expiresAt: otpRecord.expiresAt,
    createdAt: otpRecord.createdAt
  });
}
async function resendAccountVerificationOtpByEmail(email) {
  const user = await getUserForOtpByEmail(email);
  if (user.accountStatus !== AccountStatus.PENDING) {
    throw createHttpError4(400, "Account is already verified");
  }
  return issueAccountVerificationOtp(user.id, user.email, {
    enforceCooldown: true
  });
}
async function verifyAccountOtpByEmail(email, otpCode) {
  const user = await getUserForOtpByEmail(email);
  if (user.accountStatus !== AccountStatus.PENDING) {
    return {
      verified: true,
      role: user.role,
      accountStatus: user.accountStatus
    };
  }
  await cleanupExpiredOtp(user.id);
  const otpRecord = await prisma.emailOtp.findUnique({
    where: {
      userId: user.id
    },
    select: {
      id: true,
      otpHash: true,
      expiresAt: true
    }
  });
  if (!otpRecord) {
    throw createHttpError4(400, "OTP has expired. Please request a new code");
  }
  if (otpRecord.expiresAt.getTime() <= Date.now()) {
    await prisma.emailOtp.deleteMany({
      where: {
        userId: user.id
      }
    });
    throw createHttpError4(400, "OTP has expired. Please request a new code");
  }
  if (otpRecord.otpHash !== hashOtp(otpCode)) {
    throw createHttpError4(400, "Invalid OTP code");
  }
  await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: user.id
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
        emailVerified: true
      }
    });
    await trx.emailOtp.deleteMany({
      where: {
        userId: user.id
      }
    });
  });
  return {
    verified: true,
    role: user.role,
    accountStatus: AccountStatus.ACTIVE
  };
}
var AuthOtpService = {
  issueAccountVerificationOtp,
  getAccountVerificationOtpStatusByEmail,
  resendAccountVerificationOtpByEmail,
  verifyAccountOtpByEmail,
  OTP_VALIDITY_SECONDS,
  RESEND_COOLDOWN_SECONDS
};

// src/app/module/auth/auth.service.ts
function resolveUiRoleFromAdminRole(adminRole) {
  if (adminRole === AdminRole.FACULTYADMIN) {
    return "FACULTY";
  }
  if (adminRole === AdminRole.DEPARTMENTADMIN) {
    return "DEPARTMENT";
  }
  return "ADMIN";
}
var registerUser = async (payload) => {
  const { name, email, password, role } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role
    }
  });
  if (!data.user) {
    throw new Error("Failed to register user");
  }
  const userRecord = await prisma.user.findUnique({
    where: {
      id: data.user.id
    },
    select: {
      accountStatus: true,
      role: true,
      email: true
    }
  });
  if (!userRecord) {
    throw new Error("User account not found");
  }
  if (userRecord.accountStatus === AccountStatus.PENDING) {
    const verification = await AuthOtpService.issueAccountVerificationOtp(
      data.user.id,
      userRecord.email,
      { enforceCooldown: false }
    );
    return {
      ...data,
      role: userRecord.role,
      user: {
        ...data.user,
        role: userRecord.role,
        baseRole: userRecord.role,
        accountStatus: userRecord.accountStatus
      },
      verificationRequired: true,
      verification
    };
  }
  return data;
};
function resolveEffectiveRoleForInstitutionType(baseRole, adminRole, institutionType) {
  if (baseRole !== "ADMIN") {
    return baseRole;
  }
  if (institutionType && institutionType !== "UNIVERSITY") {
    return "ADMIN";
  }
  return resolveUiRoleFromAdminRole(adminRole);
}
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data.user) {
    throw new Error("Invalid email or password");
  }
  const userRecord = await prisma.user.findUnique({
    where: {
      id: data.user.id
    },
    select: {
      role: true,
      accountStatus: true
    }
  });
  if (!userRecord) {
    throw new Error("User account not found");
  }
  if (userRecord.accountStatus === AccountStatus.DELETED) {
    throw new Error("User account has been deleted");
  }
  if (userRecord.accountStatus === AccountStatus.BANNED) {
    throw new Error("User account has been banned");
  }
  if (userRecord.accountStatus === AccountStatus.DEACTIVATED) {
    throw new Error("User account has been deactivated");
  }
  if (userRecord.accountStatus === AccountStatus.DELETIONPENDING) {
    throw new Error("User account deletion is pending");
  }
  if (userRecord.accountStatus === AccountStatus.PENDING) {
    const verification = await AuthOtpService.issueAccountVerificationOtp(
      data.user.id,
      data.user.email,
      { enforceCooldown: false }
    );
    return {
      ...data,
      role: userRecord.role,
      user: {
        ...data.user,
        role: userRecord.role,
        baseRole: userRecord.role,
        accountStatus: userRecord.accountStatus
      },
      verificationRequired: true,
      verification
    };
  }
  let effectiveRole = userRecord.role;
  if (userRecord.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId: data.user.id
      },
      select: {
        role: true,
        institution: {
          select: {
            type: true
          }
        }
      }
    });
    effectiveRole = resolveEffectiveRoleForInstitutionType(
      userRecord.role,
      adminProfile?.role,
      adminProfile?.institution?.type
    );
  }
  return {
    ...data,
    role: effectiveRole,
    user: {
      ...data.user,
      role: effectiveRole,
      baseRole: userRecord.role,
      accountStatus: userRecord.accountStatus
    }
  };
};
var getCurrentUserProfile = async (userId) => {
  const userRecord = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      accountStatus: true
    }
  });
  if (!userRecord) {
    throw new Error("User account not found");
  }
  if (userRecord.accountStatus === AccountStatus.PENDING) {
    const error = new Error("Account verification is required");
    error.statusCode = 403;
    throw error;
  }
  let effectiveRole = userRecord.role;
  let institution = null;
  if (userRecord.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId
      },
      select: {
        role: true,
        institution: {
          select: {
            id: true,
            name: true,
            shortName: true,
            institutionLogo: true,
            type: true
          }
        }
      }
    });
    effectiveRole = resolveEffectiveRoleForInstitutionType(
      userRecord.role,
      adminProfile?.role,
      adminProfile?.institution?.type
    );
    institution = adminProfile?.institution ?? null;
  }
  if (userRecord.role === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: {
        userId
      },
      select: {
        institution: {
          select: {
            id: true,
            name: true,
            shortName: true,
            institutionLogo: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    institution = teacherProfile?.institution ?? null;
  }
  if (userRecord.role === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        userId
      },
      select: {
        institution: {
          select: {
            id: true,
            name: true,
            shortName: true,
            institutionLogo: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    institution = studentProfile?.institution ?? null;
  }
  return {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    image: userRecord.image,
    role: effectiveRole,
    baseRole: userRecord.role,
    accountStatus: userRecord.accountStatus,
    institution
  };
};
var getAccountVerificationOtpStatus = async (payload) => {
  return AuthOtpService.getAccountVerificationOtpStatusByEmail(payload.email);
};
var resendAccountVerificationOtp = async (payload) => {
  return AuthOtpService.resendAccountVerificationOtpByEmail(payload.email);
};
var verifyAccountOtp = async (payload) => {
  const verificationResult = await AuthOtpService.verifyAccountOtpByEmail(
    payload.email,
    payload.otp
  );
  const verifiedUser = await prisma.user.findUnique({
    where: {
      email: payload.email
    },
    select: {
      id: true,
      role: true
    }
  });
  if (!verifiedUser) {
    throw new Error("User account not found");
  }
  let effectiveRole = verifiedUser.role;
  if (verifiedUser.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId: verifiedUser.id
      },
      select: {
        role: true,
        institution: {
          select: {
            type: true
          }
        }
      }
    });
    effectiveRole = resolveEffectiveRoleForInstitutionType(
      verifiedUser.role,
      adminProfile?.role,
      adminProfile?.institution?.type
    );
  }
  return {
    ...verificationResult,
    role: effectiveRole
  };
};
function getFrontendResetPasswordRedirectUrl() {
  const frontendBase = process.env.FRONTEND_PUBLIC_URL;
  if (!frontendBase) {
    return void 0;
  }
  const normalizedBase = frontendBase.endsWith("/") ? frontendBase.slice(0, -1) : frontendBase;
  return `${normalizedBase}/reset-password`;
}
var requestPasswordReset = async (payload) => {
  const redirectTo = getFrontendResetPasswordRedirectUrl();
  const result = await auth.api.requestPasswordReset({
    body: {
      email: payload.email,
      redirectTo
    }
  });
  return {
    status: result.status,
    message: result.message
  };
};
var resetPassword = async (payload) => {
  const result = await auth.api.resetPassword({
    body: {
      token: payload.token,
      newPassword: payload.newPassword
    }
  });
  return {
    status: result.status
  };
};
var changePassword = async (payload, cookieHeader) => {
  const result = await auth.api.changePassword({
    body: {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      revokeOtherSessions: payload.revokeOtherSessions
    },
    headers: cookieHeader ? { cookie: cookieHeader } : void 0
  });
  return {
    token: result.token,
    user: result.user
  };
};
function createHttpError5(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
var requestInstitutionLeave = async (userId, userRole, payload) => {
  if (userRole !== "TEACHER" && userRole !== "STUDENT") {
    throw createHttpError5(403, "Only teacher or student can request institution leave");
  }
  let context = null;
  if (userRole === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: {
        userId
      },
      select: {
        institutionId: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    context = teacherProfile?.institutionId ? { institutionId: teacherProfile.institutionId } : null;
  }
  if (userRole === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        userId
      },
      select: {
        institutionId: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    context = studentProfile?.institutionId ? { institutionId: studentProfile.institutionId } : null;
  }
  if (!context?.institutionId) {
    throw createHttpError5(400, "No institution assignment found for this account");
  }
  const activeSubscription = await prisma.institutionSubscription.findFirst({
    where: {
      institutionId: context.institutionId,
      status: "ACTIVE",
      endsAt: {
        gt: /* @__PURE__ */ new Date()
      }
    },
    select: {
      id: true
    }
  });
  if (activeSubscription?.id) {
    throw createHttpError5(
      400,
      "Institution subscription is active. Leave option is available only after expiry."
    );
  }
  const existingPending = await prisma.institutionLeaveRequest.findFirst({
    where: {
      requesterUserId: userId,
      institutionId: context.institutionId,
      status: "PENDING"
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  if (existingPending) {
    return existingPending;
  }
  return prisma.institutionLeaveRequest.create({
    data: {
      requesterUserId: userId,
      requesterRole: userRole,
      institutionId: context.institutionId,
      reason: payload.reason?.trim() || null,
      status: "PENDING"
    }
  });
};
var listInstitutionLeaveRequestsForSuperAdmin = async (query) => {
  const status = query.status?.trim().toUpperCase();
  const where = status && (status === "PENDING" || status === "APPROVED" || status === "REJECTED") ? { status } : void 0;
  return prisma.institutionLeaveRequest.findMany({
    where,
    include: {
      requesterUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          type: true
        }
      },
      reviewedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var reviewInstitutionLeaveRequestBySuperAdmin = async (reviewerUserId, requestId, payload) => {
  const leaveRequest = await prisma.institutionLeaveRequest.findUnique({
    where: {
      id: requestId
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!leaveRequest) {
    throw createHttpError5(404, "Institution leave request not found");
  }
  if (leaveRequest.status !== "PENDING") {
    throw createHttpError5(400, "Only pending leave requests can be reviewed");
  }
  return prisma.institutionLeaveRequest.update({
    where: {
      id: requestId
    },
    data: {
      status: payload.status,
      reviewedByUserId: reviewerUserId,
      reviewedAt: /* @__PURE__ */ new Date()
    },
    include: {
      requesterUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          type: true
        }
      },
      reviewedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};
var AuthService = {
  registerUser,
  loginUser,
  getCurrentUserProfile,
  getAccountVerificationOtpStatus,
  resendAccountVerificationOtp,
  verifyAccountOtp,
  requestPasswordReset,
  resetPassword,
  changePassword,
  requestInstitutionLeave,
  listInstitutionLeaveRequestsForSuperAdmin,
  reviewInstitutionLeaveRequestBySuperAdmin
};

// src/app/module/auth/auth.controller.ts
var registerUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerUser(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result
  });
});
var getCurrentUserProfile2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await AuthService.getCurrentUserProfile(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Current user fetched successfully",
    data: result
  });
});
var getAccessStatus = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Access status fetched successfully",
    data: {
      ok: true,
      userId: user.id,
      role: user.role
    }
  });
});
var getOtpStatus = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.getAccountVerificationOtpStatus(payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "OTP status fetched successfully",
    data: result
  });
});
var resendOtp = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.resendAccountVerificationOtp(payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "OTP sent successfully",
    data: result
  });
});
var verifyOtp = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.verifyAccountOtp(payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Account verified successfully",
    data: result
  });
});
var forgotPassword = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.requestPasswordReset(payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Password reset request processed successfully",
    data: result
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.resetPassword(payload);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Password reset successfully",
    data: result
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const cookieHeader = req.headers.cookie;
  const result = await AuthService.changePassword(payload, cookieHeader);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var leaveInstitution = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await AuthService.requestInstitutionLeave(user.id, user.role, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institution leave request submitted successfully",
    data: result
  });
});
var listInstitutionLeaveRequests = catchAsync(async (req, res) => {
  const result = await AuthService.listInstitutionLeaveRequestsForSuperAdmin(req.query);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institution leave requests fetched successfully",
    data: result
  });
});
var reviewInstitutionLeaveRequest = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const requestIdParam = req.params.requestId;
  const requestId = Array.isArray(requestIdParam) ? requestIdParam[0] : requestIdParam;
  const result = await AuthService.reviewInstitutionLeaveRequestBySuperAdmin(
    user.id,
    requestId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institution leave request reviewed successfully",
    data: result
  });
});
var AuthController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getAccessStatus,
  getCurrentUserProfile: getCurrentUserProfile2,
  getOtpStatus,
  resendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword: resetPassword2,
  changePassword: changePassword2,
  leaveInstitution,
  listInstitutionLeaveRequests,
  reviewInstitutionLeaveRequest
};

// src/app/module/auth/auth.validation.ts
import { z as z5 } from "zod";
var passwordSchema2 = z5.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(
  /[^A-Za-z0-9]/,
  "Password must contain at least one special character"
);
var emailSchema = z5.email("Please provide a valid email address").toLowerCase().trim();
var registerSchema = z5.object({
  body: z5.object({
    name: z5.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(60, "Name must not exceed 60 characters").regex(
      /^[a-zA-Z\s'-]+$/,
      "Name must only contain letters, spaces, hyphens or apostrophes"
    ),
    email: emailSchema,
    password: passwordSchema2,
    role: z5.enum([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.SUPERADMIN], {
      message: `Invalid role. Must be one of: ${UserRole.SUPERADMIN}, ${UserRole.ADMIN}, ${UserRole.TEACHER}, ${UserRole.STUDENT}`
    }).optional(),
    adminRole: z5.enum([AdminRole.DEPARTMENTADMIN, AdminRole.INSTITUTIONADMIN, AdminRole.FACULTYADMIN], {
      message: `Invalid admin role. Must be one of: ${AdminRole.DEPARTMENTADMIN}, ${AdminRole.INSTITUTIONADMIN}, ${AdminRole.FACULTYADMIN}`
    }).optional(),
    institutionId: z5.string().optional()
  })
});
var loginSchema = z5.object({
  body: z5.object({
    email: emailSchema,
    password: z5.string("Password is required").min(1, "Password is required")
  })
});
var otpBaseSchema = z5.object({
  body: z5.object({
    email: emailSchema
  })
});
var verifyOtpSchema = z5.object({
  body: z5.object({
    email: emailSchema,
    otp: z5.string("OTP is required").trim().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
  })
});
var changePasswordSchema = z5.object({
  body: z5.object({
    currentPassword: z5.string("Current password is required").min(1, "Current password is required"),
    newPassword: passwordSchema2,
    confirmNewPassword: z5.string("Please confirm your new password").min(1, "Please confirm your new password")
  })
}).refine((data) => data.body.newPassword === data.body.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["body", "confirmNewPassword"]
}).refine((data) => data.body.currentPassword !== data.body.newPassword, {
  message: "New password must be different from the current password",
  path: ["body", "newPassword"]
});
var forgotPasswordSchema = z5.object({
  body: z5.object({
    email: emailSchema
  })
});
var resetPasswordSchema = z5.object({
  body: z5.object({
    token: z5.string("Reset token is required").min(1, "Reset token is required"),
    newPassword: passwordSchema2,
    confirmNewPassword: z5.string("Please confirm your new password").min(1, "Please confirm your new password")
  })
}).refine((data) => data.body.newPassword === data.body.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["body", "confirmNewPassword"]
});
var verifyEmailSchema = z5.object({
  body: z5.object({
    token: z5.string("Verification token is required").min(1, "Verification token is required")
  })
});
var refreshTokenSchema = z5.object({
  cookies: z5.object({
    refreshToken: z5.string("Refresh token is required").min(1, "Refresh token is required")
  })
});
var leaveInstitutionSchema = z5.object({
  body: z5.object({
    reason: z5.string("reason must be a string").trim().max(300).optional()
  })
});
var listInstitutionLeaveRequestsSchema = z5.object({
  query: z5.object({
    status: z5.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
  })
});
var reviewInstitutionLeaveRequestSchema = z5.object({
  params: z5.object({
    requestId: z5.uuid("Please provide a valid leave request id")
  }),
  body: z5.object({
    status: z5.enum(["APPROVED", "REJECTED"])
  })
});
var AuthValidation = {
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
  verifyEmailSchema,
  refreshTokenSchema
};

// src/app/module/auth/auth.route.ts
var router4 = Router4();
router4.post("/register", validateRequest(AuthValidation.registerSchema), AuthController.registerUser);
router4.post("/apply", validateRequest(ApplyForInstitutionValidationSchema.applyForInstitutionSchema));
router4.post("/login", validateRequest(AuthValidation.loginSchema), AuthController.loginUser);
router4.post(
  "/otp/status",
  validateRequest(AuthValidation.otpBaseSchema),
  AuthController.getOtpStatus
);
router4.post(
  "/otp/resend",
  validateRequest(AuthValidation.otpBaseSchema),
  AuthController.resendOtp
);
router4.post(
  "/otp/verify",
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthController.verifyOtp
);
router4.post(
  "/password/forgot",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword
);
router4.post(
  "/password/reset",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);
router4.post(
  "/password/change",
  requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword
);
router4.post(
  "/leave-institution",
  requireSessionRole("TEACHER", "STUDENT"),
  validateRequest(AuthValidation.leaveInstitutionSchema),
  AuthController.leaveInstitution
);
router4.get(
  "/leave-institution/superadmin",
  requireSessionRole("SUPERADMIN"),
  validateRequest(AuthValidation.listInstitutionLeaveRequestsSchema),
  AuthController.listInstitutionLeaveRequests
);
router4.patch(
  "/leave-institution/superadmin/:requestId/review",
  requireSessionRole("SUPERADMIN"),
  validateRequest(AuthValidation.reviewInstitutionLeaveRequestSchema),
  AuthController.reviewInstitutionLeaveRequest
);
router4.get(
  "/access-status",
  requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  AuthController.getAccessStatus
);
router4.get(
  "/me",
  requireSessionRole("SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"),
  AuthController.getCurrentUserProfile
);
var AuthRoutes = router4;

// src/app/module/facultyProfile/facultyProfile.route.ts
import { Router as Router5 } from "express";

// src/app/module/facultyProfile/facultyProfile.service.ts
function createHttpError6(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
async function resolveFacultyManagementContext(userId) {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError6(403, "Only faculty-level admins can access this resource");
  }
  const canUseFacultyFeatures = adminProfile.role === AdminRole.FACULTYADMIN || adminProfile.role === AdminRole.INSTITUTIONADMIN;
  if (!canUseFacultyFeatures) {
    throw createHttpError6(403, "Only faculty-level admins can access this resource");
  }
  return adminProfile;
}
var updateFacultyDisplayName = async (userId, payload) => {
  const adminProfile = await resolveFacultyManagementContext(userId);
  const normalizedName = (payload.fullName ?? payload.name ?? "").trim();
  const hasFacultyMutation = Boolean(payload.fullName || payload.name || payload.shortName || payload.description) || Boolean(payload.facultyId);
  if (hasFacultyMutation && !normalizedName) {
    throw createHttpError6(400, "Full name is required when updating faculty details");
  }
  let updatedFacultyId = null;
  let updatedFacultyName = null;
  let resolvedUserName = null;
  await prisma.$transaction(async (trx) => {
    if (hasFacultyMutation) {
      let targetFaculty = null;
      if (payload.facultyId) {
        targetFaculty = await trx.faculty.findFirst({
          where: {
            id: payload.facultyId,
            institutionId: adminProfile.institutionId
          },
          select: {
            id: true,
            institutionId: true
          }
        });
        if (!targetFaculty) {
          const facultyCount = await trx.faculty.count({
            where: {
              institutionId: adminProfile.institutionId
            }
          });
          if (facultyCount === 0) {
            const createdFaculty = await trx.faculty.create({
              data: {
                fullName: normalizedName,
                shortName: payload.shortName?.trim() || void 0,
                description: payload.description?.trim() || void 0,
                institutionId: adminProfile.institutionId
              },
              select: {
                id: true,
                institutionId: true
              }
            });
            targetFaculty = createdFaculty;
          }
        }
      } else {
        const faculties = await trx.faculty.findMany({
          where: {
            institutionId: adminProfile.institutionId
          },
          select: {
            id: true,
            institutionId: true
          },
          take: 2
        });
        if (faculties.length === 1) {
          targetFaculty = faculties[0];
        }
        if (faculties.length > 1) {
          throw createHttpError6(
            400,
            "Multiple faculties found. Please provide facultyId to update the correct faculty"
          );
        }
        if (faculties.length === 0) {
          const createdFaculty = await trx.faculty.create({
            data: {
              fullName: normalizedName,
              shortName: payload.shortName?.trim() || void 0,
              description: payload.description?.trim() || void 0,
              institutionId: adminProfile.institutionId
            },
            select: {
              id: true,
              institutionId: true
            }
          });
          targetFaculty = createdFaculty;
        }
      }
      if (!targetFaculty) {
        throw createHttpError6(404, "Faculty not found");
      }
      if (!targetFaculty.institutionId || targetFaculty.institutionId !== adminProfile.institutionId) {
        throw createHttpError6(403, "You can only update faculty under your institution");
      }
      const updatedFaculty = await trx.faculty.update({
        where: {
          id: targetFaculty.id
        },
        data: {
          fullName: normalizedName,
          shortName: payload.shortName?.trim() || void 0,
          description: payload.description?.trim() || void 0
        },
        select: {
          id: true,
          fullName: true
        }
      });
      updatedFacultyId = updatedFaculty.id;
      updatedFacultyName = updatedFaculty.fullName;
    }
    const updatedUser = await trx.user.update({
      where: {
        id: userId
      },
      data: {
        name: normalizedName || void 0,
        image: payload.image === void 0 ? void 0 : payload.image.trim() || null,
        contactNo: payload.contactNo === void 0 ? void 0 : payload.contactNo.trim() || null,
        presentAddress: payload.presentAddress === void 0 ? void 0 : payload.presentAddress.trim() || null,
        permanentAddress: payload.permanentAddress === void 0 ? void 0 : payload.permanentAddress.trim() || null,
        bloodGroup: payload.bloodGroup === void 0 ? void 0 : payload.bloodGroup.trim() || null,
        gender: payload.gender === void 0 ? void 0 : payload.gender.trim() || null
      },
      select: {
        name: true
      }
    });
    resolvedUserName = updatedUser.name;
  });
  return {
    userId,
    name: resolvedUserName ?? normalizedName,
    facultyId: updatedFacultyId,
    facultyName: updatedFacultyName
  };
};
var getFacultyProfileDetails = async (userId) => {
  const adminProfile = await resolveFacultyManagementContext(userId);
  const faculty = await prisma.faculty.findFirst({
    where: {
      institutionId: adminProfile.institutionId
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
      description: true
    }
  });
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      contactNo: true,
      presentAddress: true,
      permanentAddress: true,
      bloodGroup: true,
      gender: true
    }
  });
  const institution = adminProfile.institutionId ? await prisma.institution.findUnique({
    where: {
      id: adminProfile.institutionId
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      institutionLogo: true,
      type: true
    }
  }) : null;
  const totalDepartments = faculty?.id ? await prisma.department.count({
    where: {
      facultyId: faculty.id
    }
  }) : 0;
  const [totalTeachers, totalStudents, departmentAccounts, activeCourses] = faculty?.id ? await Promise.all([
    prisma.teacherProfile.count({
      where: {
        institutionId: adminProfile.institutionId,
        department: {
          facultyId: faculty.id
        }
      }
    }),
    prisma.studentProfile.count({
      where: {
        institutionId: adminProfile.institutionId,
        department: {
          facultyId: faculty.id
        }
      }
    }),
    prisma.adminProfile.count({
      where: {
        institutionId: adminProfile.institutionId,
        role: AdminRole.DEPARTMENTADMIN
      }
    }),
    prisma.course.count({
      where: {
        institutionId: adminProfile.institutionId,
        department: {
          facultyId: faculty.id
        }
      }
    })
  ]) : [0, 0, 0, 0];
  return {
    userId,
    institutionId: adminProfile.institutionId,
    facultyId: faculty?.id ?? null,
    fullName: faculty?.fullName ?? user?.name ?? "",
    shortName: faculty?.shortName ?? null,
    description: faculty?.description ?? null,
    user: {
      id: user?.id ?? userId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      image: user?.image ?? null,
      contactNo: user?.contactNo ?? null,
      presentAddress: user?.presentAddress ?? null,
      permanentAddress: user?.permanentAddress ?? null,
      bloodGroup: user?.bloodGroup ?? null,
      gender: user?.gender ?? null
    },
    institution,
    stats: {
      totalDepartments,
      totalTeachers,
      totalStudents,
      departmentAccounts,
      activeCourses
    }
  };
};
var createDepartment = async (userId, payload) => {
  const adminProfile = await resolveFacultyManagementContext(userId);
  let targetFacultyId = payload.facultyId;
  if (targetFacultyId) {
    const byId = await prisma.faculty.findFirst({
      where: {
        id: targetFacultyId,
        institutionId: adminProfile.institutionId
      },
      select: {
        id: true
      }
    });
    if (!byId) {
      throw createHttpError6(404, "Faculty not found for this institution");
    }
  } else {
    const faculties = await prisma.faculty.findMany({
      where: {
        institutionId: adminProfile.institutionId
      },
      select: {
        id: true
      },
      take: 2,
      orderBy: {
        createdAt: "asc"
      }
    });
    if (faculties.length === 0) {
      throw createHttpError6(
        404,
        "No faculty found for this institution. Update faculty profile first"
      );
    }
    if (faculties.length > 1) {
      throw createHttpError6(400, "Multiple faculties found. Please provide facultyId");
    }
    targetFacultyId = faculties[0].id;
  }
  return prisma.department.create({
    data: {
      fullName: payload.fullName.trim(),
      shortName: payload.shortName?.trim() || null,
      description: payload.description?.trim() || null,
      facultyId: targetFacultyId
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
      description: true,
      facultyId: true,
      createdAt: true
    }
  });
};
var FacultyProfileService = {
  createDepartment,
  getFacultyProfileDetails,
  updateFacultyDisplayName
};

// src/app/module/facultyProfile/facultyProfile.controller.ts
var getFacultyProfileDetails2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await FacultyProfileService.getFacultyProfileDetails(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Faculty profile fetched successfully",
    data: result
  });
});
var updateFacultyDisplayName2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await FacultyProfileService.updateFacultyDisplayName(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Faculty display name updated successfully",
    data: result
  });
});
var createDepartment2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await FacultyProfileService.createDepartment(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Department created successfully",
    data: result
  });
});
var FacultyProfileController = {
  createDepartment: createDepartment2,
  getFacultyProfileDetails: getFacultyProfileDetails2,
  updateFacultyDisplayName: updateFacultyDisplayName2
};

// src/app/module/facultyProfile/facultyProfile.validation.ts
import { z as z6 } from "zod";
var FacultyProfileValidation = {
  createDepartmentSchema: z6.object({
    body: z6.object({
      fullName: z6.string("Department full name is required").trim().min(2, "Department full name must be at least 2 characters long").max(120, "Department full name must not exceed 120 characters"),
      shortName: z6.string("Department short name must be a string").trim().min(2, "Department short name must be at least 2 characters long").max(30, "Department short name must not exceed 30 characters").optional(),
      description: z6.string("Department description must be a string").trim().min(3, "Department description must be at least 3 characters long").max(500, "Department description must not exceed 500 characters").optional(),
      facultyId: z6.uuid("Please provide a valid faculty id").optional()
    })
  }),
  updateFacultyDisplayNameSchema: z6.object({
    body: z6.object({
      name: z6.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(80, "Name must not exceed 80 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Name must only contain letters, spaces, hyphens or apostrophes"
      ).optional(),
      fullName: z6.string("Full name is required").trim().min(2, "Full name must be at least 2 characters long").max(80, "Full name must not exceed 80 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Full name must only contain letters, spaces, hyphens or apostrophes"
      ).optional(),
      facultyId: z6.uuid("Please provide a valid faculty id").optional(),
      shortName: z6.string("Short name must be a string").trim().min(2, "Short name must be at least 2 characters long").max(30, "Short name must not exceed 30 characters").optional(),
      description: z6.string("Description must be a string").trim().min(3, "Description must be at least 3 characters long").max(500, "Description must not exceed 500 characters").optional(),
      image: z6.url("image must be a valid URL").trim().optional(),
      contactNo: z6.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z6.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z6.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z6.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z6.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  })
};

// src/app/module/facultyProfile/facultyProfile.route.ts
var router5 = Router5();
router5.get(
  "/profile",
  requireSessionRole("ADMIN", "FACULTY"),
  FacultyProfileController.getFacultyProfileDetails
);
router5.patch(
  "/profile/name",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(FacultyProfileValidation.updateFacultyDisplayNameSchema),
  FacultyProfileController.updateFacultyDisplayName
);
router5.post(
  "/departments",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(FacultyProfileValidation.createDepartmentSchema),
  FacultyProfileController.createDepartment
);
var FacultyProfileRouter = router5;

// src/app/module/home/home.route.ts
import { Router as Router6 } from "express";

// src/app/module/posting/posting.service.ts
var DEFAULT_PUBLIC_PAGE_SIZE = 12;
var MAX_PUBLIC_PAGE_SIZE = 40;
function createHttpError7(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function isMissingTableError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }
  const maybeCode = error.code;
  if (maybeCode === "P2021") {
    return true;
  }
  const maybeMessage = error.message;
  return typeof maybeMessage === "string" && maybeMessage.includes("does not exist");
}
function normalizeSearch3(search) {
  const value = search?.trim();
  return value || void 0;
}
function normalizePage(value) {
  if (!value || !Number.isFinite(value) || value < 1) {
    return 1;
  }
  return Math.floor(value);
}
function normalizePageSize(value) {
  if (!value || !Number.isFinite(value) || value < 1) {
    return DEFAULT_PUBLIC_PAGE_SIZE;
  }
  return Math.min(Math.floor(value), MAX_PUBLIC_PAGE_SIZE);
}
function normalizePublicSort(sort) {
  switch (sort) {
    case "oldest":
      return "oldest";
    case "title_asc":
      return "title_asc";
    case "title_desc":
      return "title_desc";
    default:
      return "newest";
  }
}
function getPublicPostingOrderBy(sort) {
  if (sort === "oldest") {
    return { createdAt: "asc" };
  }
  if (sort === "title_asc") {
    return { title: "asc" };
  }
  if (sort === "title_desc") {
    return { title: "desc" };
  }
  return { createdAt: "desc" };
}
function buildPublicPostingWhere(search, location, department) {
  const normalizedSearch = normalizeSearch3(search);
  const normalizedLocation = normalizeSearch3(location);
  const normalizedDepartment = normalizeSearch3(department);
  const where = {};
  if (normalizedSearch) {
    where.OR = [
      { title: { contains: normalizedSearch, mode: "insensitive" } },
      { summary: { contains: normalizedSearch, mode: "insensitive" } },
      { location: { contains: normalizedSearch, mode: "insensitive" } },
      { institution: { name: { contains: normalizedSearch, mode: "insensitive" } } },
      { department: { fullName: { contains: normalizedSearch, mode: "insensitive" } } },
      { program: { title: { contains: normalizedSearch, mode: "insensitive" } } }
    ];
  }
  if (normalizedLocation) {
    where.location = { contains: normalizedLocation, mode: "insensitive" };
  }
  if (normalizedDepartment) {
    where.department = {
      fullName: {
        contains: normalizedDepartment,
        mode: "insensitive"
      }
    };
  }
  return where;
}
function buildPostingMedia(institutionLogo) {
  const fallbackBanner = "/biddyaloycover.webp";
  const fallbackLogo = "/logo/BidyaloylogoIconOnly.svg";
  return [institutionLogo, fallbackBanner, fallbackLogo].filter(
    (item) => Boolean(item)
  );
}
function toPublicPostingItem(post, maps, postingType) {
  const institution = maps.institutionMap.get(post.institutionId);
  const faculty = post.facultyId ? maps.facultyMap.get(post.facultyId) : null;
  const department = post.departmentId ? maps.departmentMap.get(post.departmentId) : null;
  const program = post.programId ? maps.programMap.get(post.programId) : null;
  const scoreSeed = post.title.length + post.summary.length;
  const rating = Number((3.8 + scoreSeed % 12 / 10).toFixed(1));
  return {
    id: post.id,
    postingType,
    title: post.title,
    summary: post.summary,
    details: post.details,
    location: post.location,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    institution: institution?.name ?? "Unknown institution",
    institutionShortName: institution?.shortName ?? null,
    institutionLogo: institution?.institutionLogo ?? null,
    facultyName: faculty?.fullName ?? null,
    departmentName: department?.fullName ?? null,
    programTitle: program?.title ?? null,
    media: buildPostingMedia(institution?.institutionLogo ?? null),
    status: "Open",
    rating,
    reviewCount: 16 + scoreSeed % 41
  };
}
async function resolveAdminContext(userId) {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError7(403, "Only admin users under an institution can manage postings");
  }
  return adminProfile;
}
async function resolveInstitutionAdminScopedIds(context, payload) {
  if (!payload.facultyId || !payload.departmentId) {
    throw createHttpError7(
      400,
      "Institution admin must provide facultyId and departmentId"
    );
  }
  const faculty = await prisma.faculty.findFirst({
    where: {
      id: payload.facultyId,
      institutionId: context.institutionId
    },
    select: {
      id: true
    }
  });
  if (!faculty) {
    throw createHttpError7(404, "Faculty not found for this institution");
  }
  const department = await prisma.department.findFirst({
    where: {
      id: payload.departmentId,
      facultyId: payload.facultyId,
      faculty: {
        institutionId: context.institutionId
      }
    },
    select: {
      id: true
    }
  });
  if (!department) {
    throw createHttpError7(404, "Department not found under selected faculty");
  }
  return {
    institutionId: context.institutionId,
    facultyId: payload.facultyId,
    departmentId: payload.departmentId,
    programId: null
  };
}
async function resolveFacultyAdminScopedIds(context, payload) {
  if (!payload.departmentId) {
    throw createHttpError7(400, "Faculty admin must provide departmentId");
  }
  const department = await prisma.department.findFirst({
    where: {
      id: payload.departmentId,
      faculty: {
        institutionId: context.institutionId
      }
    },
    select: {
      id: true,
      facultyId: true
    }
  });
  if (!department) {
    throw createHttpError7(404, "Department not found for this institution");
  }
  if (!department.facultyId) {
    throw createHttpError7(400, "Department is not assigned to a faculty");
  }
  return {
    institutionId: context.institutionId,
    facultyId: department.facultyId,
    departmentId: department.id,
    programId: null
  };
}
async function resolveDepartmentAdminScopedIds(context) {
  const departments = await prisma.department.findMany({
    where: {
      faculty: {
        institutionId: context.institutionId
      }
    },
    select: {
      id: true,
      facultyId: true
    },
    take: 2,
    orderBy: {
      createdAt: "asc"
    }
  });
  if (departments.length === 0) {
    throw createHttpError7(404, "Department not found for this institution");
  }
  if (departments.length > 1) {
    throw createHttpError7(400, "Multiple departments found. Contact institution admin to resolve mapping");
  }
  return {
    institutionId: context.institutionId,
    facultyId: departments[0].facultyId,
    departmentId: departments[0].id,
    programId: null
  };
}
async function resolveScopedIds(userId, payload) {
  const context = await resolveAdminContext(userId);
  if (context.role === AdminRole.INSTITUTIONADMIN) {
    return resolveInstitutionAdminScopedIds(context, payload);
  }
  if (context.role === AdminRole.FACULTYADMIN) {
    return resolveFacultyAdminScopedIds(context, payload);
  }
  if (context.role === AdminRole.DEPARTMENTADMIN) {
    return resolveDepartmentAdminScopedIds(context);
  }
  throw createHttpError7(403, "Unsupported admin role for posting management");
}
var createTeacherJobPost = async (userId, payload) => {
  const scoped = await resolveScopedIds(userId, payload);
  return prisma.teacherJobPost.create({
    data: {
      title: payload.title.trim(),
      location: payload.location?.trim() || null,
      summary: payload.summary.trim(),
      details: payload.details?.map((item) => item.trim()).filter(Boolean) ?? [],
      institutionId: scoped.institutionId,
      facultyId: scoped.facultyId,
      departmentId: scoped.departmentId,
      programId: scoped.programId,
      createdByUserId: userId
    }
  });
};
var createStudentAdmissionPost = async (userId, payload) => {
  const scoped = await resolveScopedIds(userId, payload);
  return prisma.studentAdmissionPost.create({
    data: {
      title: payload.title.trim(),
      location: payload.location?.trim() || null,
      summary: payload.summary.trim(),
      details: payload.details?.map((item) => item.trim()).filter(Boolean) ?? [],
      institutionId: scoped.institutionId,
      facultyId: scoped.facultyId,
      departmentId: scoped.departmentId,
      programId: scoped.programId,
      createdByUserId: userId
    }
  });
};
var toPostingUpdateData = (payload) => ({
  title: payload.title?.trim(),
  location: payload.location?.trim() || void 0,
  summary: payload.summary?.trim(),
  details: payload.details?.map((item) => item.trim()).filter(Boolean)
});
var listTeacherJobPostsManaged = async (userId, search) => {
  const context = await resolveAdminContext(userId);
  const normalizedSearch = normalizeSearch3(search);
  const posts = await prisma.teacherJobPost.findMany({
    where: {
      institutionId: context.institutionId,
      ...normalizedSearch ? {
        OR: [
          { title: { contains: normalizedSearch, mode: "insensitive" } },
          { summary: { contains: normalizedSearch, mode: "insensitive" } },
          { location: { contains: normalizedSearch, mode: "insensitive" } }
        ]
      } : {}
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const maps = await buildLookupMaps(posts);
  return posts.map((post) => {
    const institution = maps.institutionMap.get(post.institutionId);
    const faculty = post.facultyId ? maps.facultyMap.get(post.facultyId) : null;
    const department = post.departmentId ? maps.departmentMap.get(post.departmentId) : null;
    const program = post.programId ? maps.programMap.get(post.programId) : null;
    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      details: post.details,
      location: post.location,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      institution: institution?.name ?? "Unknown institution",
      institutionShortName: institution?.shortName ?? null,
      institutionLogo: institution?.institutionLogo ?? null,
      facultyName: faculty?.fullName ?? null,
      departmentName: department?.fullName ?? null,
      programTitle: program?.title ?? null
    };
  });
};
var listStudentAdmissionPostsManaged = async (userId, search) => {
  const context = await resolveAdminContext(userId);
  const normalizedSearch = normalizeSearch3(search);
  const posts = await prisma.studentAdmissionPost.findMany({
    where: {
      institutionId: context.institutionId,
      ...normalizedSearch ? {
        OR: [
          { title: { contains: normalizedSearch, mode: "insensitive" } },
          { summary: { contains: normalizedSearch, mode: "insensitive" } },
          { location: { contains: normalizedSearch, mode: "insensitive" } }
        ]
      } : {}
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const maps = await buildLookupMaps(posts);
  return posts.map((post) => {
    const institution = maps.institutionMap.get(post.institutionId);
    const faculty = post.facultyId ? maps.facultyMap.get(post.facultyId) : null;
    const department = post.departmentId ? maps.departmentMap.get(post.departmentId) : null;
    const program = post.programId ? maps.programMap.get(post.programId) : null;
    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      details: post.details,
      location: post.location,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      institution: institution?.name ?? "Unknown institution",
      institutionShortName: institution?.shortName ?? null,
      institutionLogo: institution?.institutionLogo ?? null,
      facultyName: faculty?.fullName ?? null,
      departmentName: department?.fullName ?? null,
      programTitle: program?.title ?? null
    };
  });
};
var updateTeacherJobPost = async (userId, postingId, payload) => {
  const context = await resolveAdminContext(userId);
  const existing = await prisma.teacherJobPost.findUnique({
    where: {
      id: postingId
    },
    select: {
      id: true,
      institutionId: true
    }
  });
  if (existing?.institutionId !== context.institutionId) {
    throw createHttpError7(404, "Teacher job post not found");
  }
  return prisma.teacherJobPost.update({
    where: {
      id: postingId
    },
    data: toPostingUpdateData(payload)
  });
};
var updateStudentAdmissionPost = async (userId, postingId, payload) => {
  const context = await resolveAdminContext(userId);
  const existing = await prisma.studentAdmissionPost.findUnique({
    where: {
      id: postingId
    },
    select: {
      id: true,
      institutionId: true
    }
  });
  if (existing?.institutionId !== context.institutionId) {
    throw createHttpError7(404, "Student admission post not found");
  }
  return prisma.studentAdmissionPost.update({
    where: {
      id: postingId
    },
    data: toPostingUpdateData(payload)
  });
};
var deleteTeacherJobPost = async (userId, postingId) => {
  const context = await resolveAdminContext(userId);
  const existing = await prisma.teacherJobPost.findUnique({
    where: {
      id: postingId
    },
    select: {
      id: true,
      institutionId: true
    }
  });
  if (existing?.institutionId !== context.institutionId) {
    throw createHttpError7(404, "Teacher job post not found");
  }
  await prisma.teacherJobPost.delete({
    where: {
      id: postingId
    }
  });
  return {
    id: postingId
  };
};
var deleteStudentAdmissionPost = async (userId, postingId) => {
  const context = await resolveAdminContext(userId);
  const existing = await prisma.studentAdmissionPost.findUnique({
    where: {
      id: postingId
    },
    select: {
      id: true,
      institutionId: true
    }
  });
  if (existing?.institutionId !== context.institutionId) {
    throw createHttpError7(404, "Student admission post not found");
  }
  await prisma.studentAdmissionPost.delete({
    where: {
      id: postingId
    }
  });
  return {
    id: postingId
  };
};
async function buildLookupMaps(posts) {
  const institutionIds = Array.from(new Set(posts.map((item) => item.institutionId)));
  const facultyIds = Array.from(
    new Set(posts.map((item) => item.facultyId).filter((item) => Boolean(item)))
  );
  const departmentIds = Array.from(
    new Set(posts.map((item) => item.departmentId).filter((item) => Boolean(item)))
  );
  const programIds = Array.from(
    new Set(posts.map((item) => item.programId).filter((item) => Boolean(item)))
  );
  const [institutions, faculties, departments, programs] = await Promise.all([
    institutionIds.length ? prisma.institution.findMany({
      where: {
        id: {
          in: institutionIds
        }
      },
      select: {
        id: true,
        name: true,
        institutionLogo: true,
        shortName: true
      }
    }) : Promise.resolve([]),
    facultyIds.length ? prisma.faculty.findMany({
      where: {
        id: {
          in: facultyIds
        }
      },
      select: {
        id: true,
        fullName: true
      }
    }) : Promise.resolve([]),
    departmentIds.length ? prisma.department.findMany({
      where: {
        id: {
          in: departmentIds
        }
      },
      select: {
        id: true,
        fullName: true
      }
    }) : Promise.resolve([]),
    programIds.length ? prisma.program.findMany({
      where: {
        id: {
          in: programIds
        }
      },
      select: {
        id: true,
        title: true,
        departmentId: true
      }
    }) : Promise.resolve([])
  ]);
  return {
    institutionMap: new Map(institutions.map((item) => [item.id, item])),
    facultyMap: new Map(faculties.map((item) => [item.id, item])),
    departmentMap: new Map(departments.map((item) => [item.id, item])),
    programMap: new Map(programs.map((item) => [item.id, item]))
  };
}
var listTeacherJobPostsPublic = async (options = {}) => {
  let posts;
  const page = normalizePage(options.page);
  const pageSize = normalizePageSize(options.pageSize ?? options.limit);
  const sort = normalizePublicSort(options.sort);
  const where = buildPublicPostingWhere(options.search, options.location);
  try {
    posts = await prisma.teacherJobPost.findMany({
      where,
      orderBy: getPublicPostingOrderBy(sort),
      skip: (page - 1) * pageSize,
      take: pageSize
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }
    throw error;
  }
  const maps = await buildLookupMaps(posts);
  return posts.map(
    (post) => toPublicPostingItem(post, maps, "teacher")
  );
};
var listStudentAdmissionPostsPublic = async (options = {}) => {
  let posts;
  const page = normalizePage(options.page);
  const pageSize = normalizePageSize(options.pageSize ?? options.limit);
  const sort = normalizePublicSort(options.sort);
  const where = buildPublicPostingWhere(options.search, options.location);
  try {
    posts = await prisma.studentAdmissionPost.findMany({
      where,
      orderBy: getPublicPostingOrderBy(sort),
      skip: (page - 1) * pageSize,
      take: pageSize
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }
    throw error;
  }
  const maps = await buildLookupMaps(posts);
  return posts.map(
    (post) => toPublicPostingItem(post, maps, "student")
  );
};
var listPublicExplorePostings = async (query) => {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const sort = normalizePublicSort(query.sort);
  const where = buildPublicPostingWhere(query.search, query.location, query.department);
  let posts = [];
  let total = 0;
  try {
    if (query.type === "student") {
      const [count, rows] = await Promise.all([
        prisma.studentAdmissionPost.count({ where }),
        prisma.studentAdmissionPost.findMany({
          where,
          orderBy: getPublicPostingOrderBy(sort),
          skip: (page - 1) * pageSize,
          take: pageSize
        })
      ]);
      total = count;
      posts = rows;
    } else {
      const [count, rows] = await Promise.all([
        prisma.teacherJobPost.count({ where }),
        prisma.teacherJobPost.findMany({
          where,
          orderBy: getPublicPostingOrderBy(sort),
          skip: (page - 1) * pageSize,
          take: pageSize
        })
      ]);
      total = count;
      posts = rows;
    }
  } catch (error) {
    if (isMissingTableError(error)) {
      return {
        type: query.type,
        sort,
        pagination: {
          page,
          pageSize,
          total: 0,
          totalPages: 0
        },
        filters: {
          locations: [],
          departments: []
        },
        items: []
      };
    }
    throw error;
  }
  const maps = await buildLookupMaps(posts);
  const items = posts.map((post) => toPublicPostingItem(post, maps, query.type));
  const locations = Array.from(
    new Set(items.map((item) => item.location).filter((item) => Boolean(item)))
  ).slice(0, 20);
  const departments = Array.from(
    new Set(items.map((item) => item.departmentName).filter((item) => Boolean(item)))
  ).slice(0, 20);
  return {
    type: query.type,
    sort,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: total > 0 ? Math.ceil(total / pageSize) : 0
    },
    filters: {
      locations,
      departments
    },
    items
  };
};
function buildRelatedPostingWhere(post) {
  return {
    id: { not: post.id },
    OR: [
      { institutionId: post.institutionId },
      ...post.departmentId ? [{ departmentId: post.departmentId }] : [],
      ...post.programId ? [{ programId: post.programId }] : []
    ]
  };
}
async function loadStudentPostingWithRelated(postingId) {
  const post = await prisma.studentAdmissionPost.findUnique({ where: { id: postingId } });
  if (!post) {
    return { post: null, related: [] };
  }
  const related = await prisma.studentAdmissionPost.findMany({
    where: buildRelatedPostingWhere(post),
    orderBy: {
      createdAt: "desc"
    },
    take: 4
  });
  return { post, related };
}
async function loadTeacherPostingWithRelated(postingId) {
  const post = await prisma.teacherJobPost.findUnique({ where: { id: postingId } });
  if (!post) {
    return { post: null, related: [] };
  }
  const related = await prisma.teacherJobPost.findMany({
    where: buildRelatedPostingWhere(post),
    orderBy: {
      createdAt: "desc"
    },
    take: 4
  });
  return { post, related };
}
async function loadPostingWithRelated(postingType, postingId) {
  if (postingType === "student") {
    return loadStudentPostingWithRelated(postingId);
  }
  return loadTeacherPostingWithRelated(postingId);
}
var getPublicPostingDetails = async (postingType, postingId) => {
  let data;
  try {
    data = await loadPostingWithRelated(postingType, postingId);
  } catch (error) {
    if (isMissingTableError(error)) {
      throw createHttpError7(404, "Posting not found");
    }
    throw error;
  }
  if (!data.post) {
    throw createHttpError7(404, "Posting not found");
  }
  const maps = await buildLookupMaps([data.post, ...data.related]);
  const details = toPublicPostingItem(data.post, maps, postingType);
  const relatedItems = data.related.map((item) => toPublicPostingItem(item, maps, postingType));
  return {
    ...details,
    overview: details.summary,
    keyInfo: [
      { label: "Institution", value: details.institution },
      { label: "Department", value: details.departmentName ?? "N/A" },
      { label: "Program", value: details.programTitle ?? "N/A" },
      { label: "Location", value: details.location ?? "Not specified" },
      { label: "Posted", value: details.createdAt.toISOString() },
      { label: "Status", value: details.status }
    ],
    reviews: {
      averageRating: details.rating,
      totalReviews: details.reviewCount,
      highlights: [
        "Clear requirements and role expectations",
        "Responsive institution onboarding process",
        "Strong role-based workflow support"
      ]
    },
    relatedItems
  };
};
var getPostingOptions = async (userId, search) => {
  const context = await resolveAdminContext(userId);
  const normalizedSearch = normalizeSearch3(search);
  if (context.role === AdminRole.INSTITUTIONADMIN) {
    const [faculties, departments] = await Promise.all([
      prisma.faculty.findMany({
        where: {
          institutionId: context.institutionId,
          ...normalizedSearch ? {
            OR: [{ fullName: { contains: normalizedSearch, mode: "insensitive" } }]
          } : {}
        },
        select: {
          id: true,
          fullName: true
        },
        orderBy: {
          fullName: "asc"
        }
      }),
      prisma.department.findMany({
        where: {
          faculty: {
            institutionId: context.institutionId
          },
          ...normalizedSearch ? {
            OR: [{ fullName: { contains: normalizedSearch, mode: "insensitive" } }]
          } : {}
        },
        select: {
          id: true,
          fullName: true,
          facultyId: true
        },
        orderBy: {
          fullName: "asc"
        }
      })
    ]);
    return {
      faculties,
      departments
    };
  }
  if (context.role === AdminRole.FACULTYADMIN) {
    const departments = await prisma.department.findMany({
      where: {
        faculty: {
          institutionId: context.institutionId
        },
        ...normalizedSearch ? {
          OR: [{ fullName: { contains: normalizedSearch, mode: "insensitive" } }]
        } : {}
      },
      select: {
        id: true,
        fullName: true,
        facultyId: true
      },
      orderBy: {
        fullName: "asc"
      }
    });
    return {
      faculties: [],
      departments
    };
  }
  if (context.role === AdminRole.DEPARTMENTADMIN) {
    return {
      faculties: [],
      departments: []
    };
  }
  throw createHttpError7(403, "Unsupported admin role for posting options");
};
var PostingService = {
  createTeacherJobPost,
  createStudentAdmissionPost,
  listTeacherJobPostsPublic,
  listStudentAdmissionPostsPublic,
  listPublicExplorePostings,
  getPublicPostingDetails,
  getPostingOptions,
  listTeacherJobPostsManaged,
  listStudentAdmissionPostsManaged,
  updateTeacherJobPost,
  updateStudentAdmissionPost,
  deleteTeacherJobPost,
  deleteStudentAdmissionPost
};

// src/app/module/home/home.service.ts
var formatCount = (value) => new Intl.NumberFormat("en").format(value);
var buildSummaryCard = (label, value, suffix = "") => ({
  label,
  value: formatCount(value),
  suffix
});
var homeSlides = [
  {
    eyebrow: "SaaS campus portal platform",
    title: "Run every institution in one unified portal.",
    description: "Sell a branded portal to institutions, then manage programs, departments, faculty, teachers, and students in one calm workspace.",
    stats: []
  },
  {
    eyebrow: "Admission + hiring",
    title: "Publish openings and review applications faster.",
    description: "Create teacher and student postings, track approvals, and keep every review step visible for the right stakeholders.",
    stats: []
  },
  {
    eyebrow: "Role-based workflow",
    title: "Give every role the right control panel.",
    description: "From institution admin to student, each workspace is purpose-built with scoped actions, notices, and academic operations.",
    stats: []
  }
];
var features = [
  {
    iconKey: "multi-role",
    title: "Multi-role workspaces",
    description: "Owners, admins, faculty, teachers, and students each get a tailored view."
  },
  {
    iconKey: "approvals",
    title: "Admissions and approvals",
    description: "Teachers and students apply to institutions and track approvals in real time."
  },
  {
    iconKey: "operations",
    title: "Academic operations",
    description: "Manage attendance, assignments, quizzes, and results from one dashboard."
  }
];
var steps = [
  {
    title: "Launch an institution portal",
    description: "Set up your institution, branding, and access rules in minutes."
  },
  {
    title: "Configure programs and roles",
    description: "Add departments, faculty, teachers, students, and academic programs."
  },
  {
    title: "Run daily operations",
    description: "Manage admissions, attendance, assignments, quizzes, and results."
  }
];
var about = {
  title: "One portal to serve every institution you manage.",
  description: "We blend admissions, academics, and communication so leadership teams stay in control while teachers focus on learning.",
  values: ["Role-based permissions", "Institution-ready workflows", "Scalable SaaS operations"],
  highlights: [
    "We launched a full portal for three campuses in one week.",
    "Admissions and approvals finally live in one place.",
    "Teachers and students love the clarity of the portal."
  ]
};
var testimonials = [
  {
    quote: "We sell portals to institutions and everything is managed from one dashboard.",
    name: "Mira A.",
    role: "Platform Owner"
  },
  {
    quote: "Applications from teachers and students flow straight into approvals.",
    name: "Rahim S.",
    role: "Admissions Lead"
  },
  {
    quote: "Attendance, quizzes, and assignments are finally in sync across departments.",
    name: "Nadia T.",
    role: "Academic Operations"
  }
];
var faqs = [
  {
    question: "How quickly can an institution start using Biddyaloy?",
    answer: "Most institutions complete onboarding in 1-3 days, including role setup, profile verification, and first workflow configuration."
  },
  {
    question: "Does the platform support multiple departments and academic structures?",
    answer: "Yes. Biddyaloy supports institution, faculty, department, and program-level workflows with role-based access control."
  },
  {
    question: "Can we manage teacher and student applications from one dashboard?",
    answer: "Yes. Application publishing, screening, review, and approval actions are centralized across admin workspaces."
  },
  {
    question: "How are payments and renewals managed?",
    answer: "Subscription pricing, payment initiation, and renewal status are integrated directly into the institution administration workflow."
  }
];
var buildBlogCard = (item) => ({
  title: item.title,
  excerpt: item.summary,
  href: `/explore/${item.postingType ?? "teacher"}/${item.id}`,
  tag: item.postingType === "student" ? "Admission" : "Hiring"
});
var getContent = async () => {
  const [institutionCount, teacherExplore, studentExplore] = await Promise.all([
    prisma.institution.count(),
    PostingService.listPublicExplorePostings({ type: "teacher", page: 1, pageSize: 3, sort: "newest" }),
    PostingService.listPublicExplorePostings({ type: "student", page: 1, pageSize: 3, sort: "newest" })
  ]);
  const teacherTotal = teacherExplore.pagination.total;
  const studentTotal = studentExplore.pagination.total;
  const topTeacherPost = teacherExplore.items[0];
  const topStudentPost = studentExplore.items[0];
  const slides = [
    {
      ...homeSlides[0],
      stats: [
        buildSummaryCard("Institutions onboarded", institutionCount),
        buildSummaryCard("Open teacher jobs", teacherTotal),
        buildSummaryCard("Admission posts", studentTotal)
      ]
    },
    {
      ...homeSlides[1],
      stats: [
        buildSummaryCard("Teacher openings", teacherTotal),
        buildSummaryCard("Student admissions", studentTotal),
        buildSummaryCard("Live listings", teacherTotal + studentTotal)
      ]
    },
    {
      ...homeSlides[2],
      stats: [
        buildSummaryCard("Role dashboards", 6),
        buildSummaryCard("Public postings", teacherTotal + studentTotal),
        buildSummaryCard("Active institutions", institutionCount)
      ]
    }
  ];
  const blogPosts = [...teacherExplore.items, ...studentExplore.items].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()).slice(0, 3).map(buildBlogCard);
  return {
    slides,
    stats: [
      buildSummaryCard("Institutions onboarded", institutionCount, "+"),
      buildSummaryCard("Teacher openings", teacherTotal, "+"),
      buildSummaryCard("Admission posts", studentTotal, "+"),
      buildSummaryCard("Public workflows", teacherTotal + studentTotal, "+")
    ],
    features,
    steps,
    about,
    testimonials,
    faqs,
    blogPosts: blogPosts.length > 0 ? blogPosts : [
      ...topTeacherPost ? [buildBlogCard(topTeacherPost)] : [],
      ...topStudentPost ? [buildBlogCard(topStudentPost)] : []
    ]
  };
};
var HomeService = {
  getContent
};

// src/app/module/home/home.controller.ts
var getContent2 = catchAsync(async (_req, res) => {
  const result = await HomeService.getContent();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Home content fetched successfully",
    data: result
  });
});
var HomeController = {
  getContent: getContent2
};

// src/app/module/home/home.route.ts
var router6 = Router6();
router6.get("/content", HomeController.getContent);
var HomeRouter = router6;

// src/app/module/institute/institute.route.ts
import { Router as Router7 } from "express";

// src/app/module/institute/interface.validation.ts
import z7 from "zod";
var createInstitutionSchema = z7.object({
  body: z7.object({
    name: z7.string("Institution name is required").min(1, "Institution name is required"),
    description: z7.string("Institution description is required").min(1, "Institution description is required"),
    shortName: z7.string("Institution short name is required").min(1, "Institution short name is required"),
    type: z7.enum([InstitutionType.UNIVERSITY, InstitutionType.COLLEGE, InstitutionType.SCHOOL, InstitutionType.TRAINING_CENTER, InstitutionType.OTHER], {
      message: `Invalid institution type. Must be one of: ${InstitutionType.UNIVERSITY}, ${InstitutionType.COLLEGE}, ${InstitutionType.SCHOOL}, ${InstitutionType.TRAINING_CENTER}, ${InstitutionType.OTHER}`
    }),
    institutionLogo: z7.string("Institution logo is required").min(1, "Institution logo is required")
  })
});
var InstituteValidation = {
  createInstitutionSchema,
  listInstitutionOptionsSchema: z7.object({
    query: z7.object({
      search: z7.string().trim().min(1).max(120).optional()
    })
  })
};

// src/app/module/institute/institute.service.ts
function createHttpError8(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
var createInstitution = async (payload) => {
  const data = await prisma.institution.create({
    data: payload
  });
  if (!data) {
    throw new Error("Failed to create institution");
  }
  return data;
};
var listInstitutionOptions = async (userId, search) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError8(403, "Only institution admins can list institution options");
  }
  const normalizedSearch = search?.trim();
  return prisma.institution.findMany({
    where: {
      id: {
        not: adminProfile.institutionId
      },
      ...normalizedSearch ? {
        OR: [
          {
            name: {
              contains: normalizedSearch,
              mode: "insensitive"
            }
          },
          {
            shortName: {
              contains: normalizedSearch,
              mode: "insensitive"
            }
          }
        ]
      } : {}
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      institutionLogo: true,
      type: true
    },
    orderBy: {
      name: "asc"
    },
    take: 50
  });
};
var InstituteService = {
  createInstitution,
  listInstitutionOptions
};

// src/app/module/institute/institute.controller.ts
var createInstitution2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await InstituteService.createInstitution(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Institution created successfully",
    data: result
  });
});
var listInstitutionOptions2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const search = typeof req.query.search === "string" ? req.query.search : void 0;
  const result = await InstituteService.listInstitutionOptions(user.id, search);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institution options fetched successfully",
    data: result
  });
});
var InstituteController = {
  createInstitution: createInstitution2,
  listInstitutionOptions: listInstitutionOptions2
};

// src/app/module/institute/institute.route.ts
var router7 = Router7();
router7.post("/create", validateRequest(InstituteValidation.createInstitutionSchema), InstituteController.createInstitution);
router7.get(
  "/options",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(InstituteValidation.listInstitutionOptionsSchema),
  InstituteController.listInstitutionOptions
);
var InstituteRoutes = router7;

// src/app/module/institutionAdmin/institutionAdmin.route.ts
import { Router as Router8 } from "express";

// src/app/shared/credentialSecurity.ts
import crypto from "crypto";
function readCredentialSecret() {
  const secret = process.env.CREDENTIAL_ENCRYPTION_KEY?.trim() || process.env.AUTH_SECRET?.trim() || process.env.BETTER_AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "Credential encryption secret is not configured. Set CREDENTIAL_ENCRYPTION_KEY or AUTH_SECRET."
    );
  }
  return secret;
}
function deriveAesKey() {
  const secret = readCredentialSecret();
  return crypto.createHash("sha256").update(secret).digest();
}
function hashCredentialValue(value) {
  const secret = readCredentialSecret();
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
function encryptCredentialValue(plainText) {
  const key = deriveAesKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url")
  ].join(":");
}
function decryptCredentialValue(cipherText) {
  const key = deriveAesKey();
  const [ivBase64, authTagBase64, encryptedBase64] = cipherText.split(":");
  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error("Invalid encrypted credential format");
  }
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivBase64, "base64url")
  );
  decipher.setAuthTag(Buffer.from(authTagBase64, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64url")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}
function maskCredentialValue(value) {
  const trimmed = value.trim();
  if (trimmed.length <= 4) {
    return "*".repeat(Math.max(1, trimmed.length));
  }
  const tail = trimmed.slice(-4);
  return `${"*".repeat(Math.max(4, trimmed.length - 4))}${tail}`;
}

// src/app/module/institutionAdmin/institutionAdmin.service.ts
function createHttpError9(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function resolveAdminRole(accountType) {
  return accountType === "FACULTY" ? AdminRole.FACULTYADMIN : AdminRole.DEPARTMENTADMIN;
}
function canCreateSubAdmin(creatorRole, targetAccountType) {
  if (creatorRole === AdminRole.INSTITUTIONADMIN) {
    return true;
  }
  if (creatorRole === AdminRole.FACULTYADMIN && targetAccountType === "DEPARTMENT") {
    return true;
  }
  return false;
}
function normalizeSearch4(search) {
  const value = search?.trim();
  return value || void 0;
}
var DEFAULT_FRONTEND_BASE = "http://localhost:3000";
var SUBSCRIPTION_PAYMENT_STATUS_PENDING = "PENDING";
var SUBSCRIPTION_PAYMENT_STATUS_PAID = "PAID";
var SUBSCRIPTION_PAYMENT_STATUS_FAILED = "FAILED";
var SUBSCRIPTION_PAYMENT_STATUS_CANCELLED = "CANCELLED";
var SUBSCRIPTION_PLAN_CONFIG = {
  MONTHLY: { months: 1, amount: 500, label: "Monthly" },
  HALF_YEARLY: { months: 6, amount: 2800, label: "Half Yearly" },
  YEARLY: { months: 12, amount: 5600, label: "Yearly" }
};
function getFrontendBaseUrl() {
  const raw3 = process.env.FRONTEND_PUBLIC_URL?.trim() || process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() || DEFAULT_FRONTEND_BASE;
  return raw3.replace(/\/$/, "");
}
function getBackendBaseUrl() {
  const raw3 = process.env.BACKEND_PUBLIC_URL?.trim() || process.env.BASE_URL?.trim();
  if (!raw3) {
    throw createHttpError9(
      500,
      "Backend public URL is not configured. Set BACKEND_PUBLIC_URL in environment."
    );
  }
  return raw3.replace(/\/$/, "");
}
function getSslCommerzBaseUrl() {
  const envBaseUrl = process.env.SSLCOMMERZ_BASE_URL?.trim().replace(/\/$/, "");
  return envBaseUrl || "https://sandbox.sslcommerz.com";
}
function getSslCommerzCredentials() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePassword) {
    throw createHttpError9(
      500,
      "SSLCommerz credentials are not configured. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD."
    );
  }
  return { storeId, storePassword };
}
function toMoneyNumber2(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) {
    return 0;
  }
  return Number(next.toFixed(2));
}
function areMoneyValuesEqual(left, right) {
  return Math.abs(toMoneyNumber2(left) - toMoneyNumber2(right)) <= 0.01;
}
function toSafeUpper(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized ? normalized.toUpperCase() : fallback;
}
function readQueryValue3(value) {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : void 0;
  }
  return typeof value === "string" ? value : void 0;
}
function normalizeCallbackQuery(query) {
  return {
    tran_id: readQueryValue3(query.tran_id),
    val_id: readQueryValue3(query.val_id),
    status: readQueryValue3(query.status),
    bank_tran_id: readQueryValue3(query.bank_tran_id),
    card_type: readQueryValue3(query.card_type)
  };
}
function addMonths(value, months) {
  const next = new Date(value);
  next.setMonth(next.getMonth() + months);
  return next;
}
function buildSubscriptionRenewalRedirectUrl(status, tranId) {
  const frontendBase = getFrontendBaseUrl();
  const pathname = status === "success" ? "/admin" : "/subscription-expired";
  const searchParams = new URLSearchParams({
    subscriptionRenewalStatus: status
  });
  if (tranId) {
    searchParams.set("tranId", tranId);
  }
  return `${frontendBase}${pathname}?${searchParams.toString()}`;
}
var resolveInstitutionAdminContext = async (creatorUserId) => {
  const creatorAdminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId: creatorUserId
    },
    select: {
      institutionId: true,
      role: true
    }
  });
  if (!creatorAdminProfile?.institutionId) {
    throw createHttpError9(403, "Only institution admins can manage semesters");
  }
  if (creatorAdminProfile.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError9(403, "Only institution admins can manage semesters");
  }
  return creatorAdminProfile;
};
var listSemesters3 = async (creatorUserId) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  return prisma.semester.findMany({
    where: {
      institutionId: context.institutionId
    },
    orderBy: {
      startDate: "desc"
    }
  });
};
var getDashboardSummary3 = async (creatorUserId) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const [user, institution, stats] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: creatorUserId
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        contactNo: true,
        presentAddress: true,
        permanentAddress: true,
        bloodGroup: true,
        gender: true
      }
    }),
    prisma.institution.findUnique({
      where: {
        id: context.institutionId
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        institutionLogo: true,
        type: true
      }
    }),
    Promise.all([
      prisma.faculty.count({
        where: {
          institutionId: context.institutionId
        }
      }),
      prisma.department.count({
        where: {
          faculty: {
            institutionId: context.institutionId
          }
        }
      }),
      prisma.semester.count({
        where: {
          institutionId: context.institutionId
        }
      }),
      prisma.teacherProfile.count({
        where: {
          institutionId: context.institutionId
        }
      }),
      prisma.studentProfile.count({
        where: {
          institutionId: context.institutionId
        }
      }),
      prisma.teacherJobApplication.count({
        where: {
          institutionId: context.institutionId,
          status: "PENDING"
        }
      }),
      prisma.studentAdmissionApplication.count({
        where: {
          posting: {
            institutionId: context.institutionId
          },
          status: "PENDING"
        }
      })
    ])
  ]);
  const [
    totalFaculties,
    totalDepartments,
    totalSemesters,
    totalTeachers,
    totalStudents,
    pendingTeacherApplications,
    pendingStudentApplications
  ] = stats;
  return {
    user,
    institution,
    stats: {
      totalFaculties,
      totalDepartments,
      totalSemesters,
      totalTeachers,
      totalStudents,
      pendingTeacherApplications,
      pendingStudentApplications
    }
  };
};
var updateProfile = async (creatorUserId, payload) => {
  await resolveInstitutionAdminContext(creatorUserId);
  const nextName = payload.name?.trim();
  if (nextName) {
    await prisma.user.update({
      where: { id: creatorUserId },
      data: {
        name: nextName
      }
    });
  }
  await prisma.user.update({
    where: { id: creatorUserId },
    data: {
      image: payload.image === void 0 ? void 0 : payload.image.trim() || null,
      contactNo: payload.contactNo === void 0 ? void 0 : payload.contactNo.trim() || null,
      presentAddress: payload.presentAddress === void 0 ? void 0 : payload.presentAddress.trim() || null,
      permanentAddress: payload.permanentAddress === void 0 ? void 0 : payload.permanentAddress.trim() || null,
      bloodGroup: payload.bloodGroup === void 0 ? void 0 : payload.bloodGroup.trim() || null,
      gender: payload.gender === void 0 ? void 0 : payload.gender.trim() || null
    }
  });
  return getDashboardSummary3(creatorUserId);
};
var getSslCommerzCredential = async (creatorUserId) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const existing = await prisma.institutionPaymentGatewayCredential.findUnique({
    where: {
      institutionId: context.institutionId
    },
    select: {
      sslCommerzStoreIdEncrypted: true,
      sslCommerzBaseUrlEncrypted: true,
      sslCommerzStorePasswordHash: true,
      updatedAt: true,
      isActive: true
    }
  });
  if (!existing) {
    return {
      isConfigured: false,
      storeIdMasked: null,
      hasStorePassword: false,
      baseUrl: null,
      updatedAt: null,
      isActive: false
    };
  }
  const storeId = decryptCredentialValue(existing.sslCommerzStoreIdEncrypted);
  const baseUrl = decryptCredentialValue(existing.sslCommerzBaseUrlEncrypted);
  return {
    isConfigured: true,
    storeIdMasked: maskCredentialValue(storeId),
    hasStorePassword: Boolean(existing.sslCommerzStorePasswordHash),
    baseUrl,
    updatedAt: existing.updatedAt,
    isActive: existing.isActive
  };
};
var upsertSslCommerzCredential = async (creatorUserId, payload) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const existing = await prisma.institutionPaymentGatewayCredential.findUnique({
    where: {
      institutionId: context.institutionId
    },
    select: {
      id: true,
      sslCommerzStoreIdEncrypted: true,
      sslCommerzStorePasswordEncrypted: true,
      sslCommerzBaseUrlEncrypted: true
    }
  });
  const nextStoreIdInput = payload.storeId?.trim();
  const nextStorePasswordInput = payload.storePassword?.trim();
  const nextBaseUrlInput = payload.baseUrl?.trim();
  let resolvedStoreId = nextStoreIdInput;
  let resolvedStorePassword = nextStorePasswordInput;
  let resolvedBaseUrl = nextBaseUrlInput;
  if (existing) {
    resolvedStoreId = resolvedStoreId || decryptCredentialValue(existing.sslCommerzStoreIdEncrypted);
    resolvedStorePassword = resolvedStorePassword || decryptCredentialValue(existing.sslCommerzStorePasswordEncrypted);
    resolvedBaseUrl = resolvedBaseUrl || decryptCredentialValue(existing.sslCommerzBaseUrlEncrypted);
  }
  if (!resolvedStoreId || !resolvedStorePassword || !resolvedBaseUrl) {
    throw createHttpError9(
      400,
      "storeId, storePassword and baseUrl are required for SSLCommerz credential setup"
    );
  }
  let normalizedBaseUrl;
  try {
    normalizedBaseUrl = new URL(resolvedBaseUrl).toString().replace(/\/$/, "");
  } catch {
    throw createHttpError9(400, "baseUrl must be a valid URL");
  }
  await prisma.institutionPaymentGatewayCredential.upsert({
    where: {
      institutionId: context.institutionId
    },
    create: {
      institutionId: context.institutionId,
      sslCommerzStoreIdEncrypted: encryptCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordEncrypted: encryptCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlEncrypted: encryptCredentialValue(normalizedBaseUrl),
      sslCommerzStoreIdHash: hashCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordHash: hashCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlHash: hashCredentialValue(normalizedBaseUrl),
      isActive: true,
      lastUpdatedByUserId: creatorUserId
    },
    update: {
      sslCommerzStoreIdEncrypted: encryptCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordEncrypted: encryptCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlEncrypted: encryptCredentialValue(normalizedBaseUrl),
      sslCommerzStoreIdHash: hashCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordHash: hashCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlHash: hashCredentialValue(normalizedBaseUrl),
      isActive: true,
      lastUpdatedByUserId: creatorUserId
    }
  });
  return getSslCommerzCredential(creatorUserId);
};
var initiateSubscriptionRenewal = async (creatorUserId, payload) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const selectedPlan = SUBSCRIPTION_PLAN_CONFIG[payload.plan];
  if (!selectedPlan) {
    throw createHttpError9(400, "Invalid subscription plan selected");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: creatorUserId
    },
    select: {
      name: true,
      email: true,
      contactNo: true,
      presentAddress: true
    }
  });
  if (!user) {
    throw createHttpError9(404, "User not found");
  }
  const amount = toMoneyNumber2(selectedPlan.amount);
  const currency = "BDT";
  const backendBaseUrl = getBackendBaseUrl();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl();
  const { storeId, storePassword } = getSslCommerzCredentials();
  const transactionId = `INSTREN-${context.institutionId.slice(0, 8)}-${Date.now()}`;
  const renewalPayment = await prisma.institutionSubscriptionRenewalPayment.create({
    data: {
      institutionId: context.institutionId,
      initiatedByUserId: creatorUserId,
      plan: payload.plan,
      amount,
      currency,
      monthsCovered: selectedPlan.months,
      status: SUBSCRIPTION_PAYMENT_STATUS_PENDING,
      tranId: transactionId,
      paidAt: null
    },
    select: {
      id: true
    }
  });
  const requestBody = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: amount.toFixed(2),
    currency,
    tran_id: transactionId,
    success_url: `${backendBaseUrl}/api/v1/institution-admin/subscription/renew/payment/success`,
    fail_url: `${backendBaseUrl}/api/v1/institution-admin/subscription/renew/payment/fail`,
    cancel_url: `${backendBaseUrl}/api/v1/institution-admin/subscription/renew/payment/cancel`,
    ipn_url: `${backendBaseUrl}/api/v1/institution-admin/subscription/renew/payment/fail`,
    shipping_method: "NO",
    product_name: `Institution Renewal - ${selectedPlan.label}`,
    product_category: "Education",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.presentAddress?.trim() || "N/A",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: user.contactNo?.trim() || "01700000000",
    value_a: context.institutionId,
    value_b: creatorUserId,
    value_c: payload.plan,
    value_d: renewalPayment.id
  });
  const response = await fetch(`${sslCommerzBaseUrl}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: requestBody.toString()
  });
  const gatewayResponse = await response.json().catch(() => null);
  const gatewayPageUrl = gatewayResponse?.GatewayPageURL;
  const gatewayStatus = gatewayResponse?.status?.toUpperCase();
  if (!response.ok || !gatewayPageUrl || gatewayStatus !== "SUCCESS") {
    await prisma.institutionSubscriptionRenewalPayment.update({
      where: {
        tranId: transactionId
      },
      data: {
        status: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        gatewayStatus: gatewayResponse?.status ?? "FAILED",
        gatewayRawPayload: gatewayResponse ?? { httpStatus: response.status }
      }
    });
    const failureMessage = gatewayResponse?.failedreason?.trim() || gatewayResponse?.status?.trim() || "Unable to initialize SSLCommerz payment session";
    throw createHttpError9(502, failureMessage);
  }
  await prisma.institutionSubscriptionRenewalPayment.update({
    where: {
      tranId: transactionId
    },
    data: {
      status: SUBSCRIPTION_PAYMENT_STATUS_PENDING,
      gatewayStatus: gatewayResponse?.status,
      gatewaySessionKey: gatewayResponse?.sessionkey || null,
      gatewayRawPayload: gatewayResponse
    }
  });
  return {
    institutionId: context.institutionId,
    plan: payload.plan,
    amount,
    currency,
    monthsCovered: selectedPlan.months,
    tranId: transactionId,
    paymentUrl: gatewayPageUrl
  };
};
var handleSubscriptionRenewalPaymentCallback = async (callbackType, rawQuery) => {
  const query = normalizeCallbackQuery(rawQuery);
  const transactionId = query.tran_id?.trim();
  if (!transactionId) {
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed")
    };
  }
  const renewalPayment = await prisma.institutionSubscriptionRenewalPayment.findFirst({
    where: {
      tranId: transactionId
    },
    select: {
      id: true,
      institutionId: true,
      plan: true,
      amount: true,
      currency: true,
      monthsCovered: true,
      status: true,
      tranId: true
    }
  });
  if (!renewalPayment) {
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed", transactionId)
    };
  }
  if (callbackType === "cancelled") {
    if (renewalPayment.status !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      await prisma.institutionSubscriptionRenewalPayment.update({
        where: {
          tranId: transactionId
        },
        data: {
          status: SUBSCRIPTION_PAYMENT_STATUS_CANCELLED,
          gatewayStatus: query.status || "CANCELLED",
          gatewayRawPayload: rawQuery
        }
      });
    }
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("cancelled", transactionId)
    };
  }
  if (callbackType === "failed") {
    if (renewalPayment.status !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      await prisma.institutionSubscriptionRenewalPayment.update({
        where: {
          tranId: transactionId
        },
        data: {
          status: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
          gatewayStatus: query.status || "FAILED",
          gatewayRawPayload: rawQuery
        }
      });
    }
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed", transactionId)
    };
  }
  if (renewalPayment.status === SUBSCRIPTION_PAYMENT_STATUS_PAID) {
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("success", transactionId)
    };
  }
  const validationId = query.val_id?.trim();
  if (!validationId) {
    await prisma.institutionSubscriptionRenewalPayment.update({
      where: {
        tranId: transactionId
      },
      data: {
        status: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        gatewayStatus: query.status || "FAILED",
        gatewayRawPayload: rawQuery
      }
    });
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed", transactionId)
    };
  }
  const { storeId, storePassword } = getSslCommerzCredentials();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl();
  const validatorParams = new URLSearchParams({
    val_id: validationId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json"
  });
  const validationResponse = await fetch(
    `${sslCommerzBaseUrl}/validator/api/validationserverAPI.php?${validatorParams.toString()}`
  );
  const validationData = await validationResponse.json().catch(() => null);
  const validationStatus = validationData?.status?.toUpperCase();
  const isValidStatus = validationStatus === "VALID" || validationStatus === "VALIDATED";
  const isValidTransaction = validationData?.tran_id === renewalPayment.tranId;
  const isValidAmount = areMoneyValuesEqual(validationData?.amount, renewalPayment.amount);
  const isValidCurrency = toSafeUpper(validationData?.currency_type, renewalPayment.currency) === toSafeUpper(renewalPayment.currency, "BDT");
  if (!validationResponse.ok || !isValidStatus || !isValidTransaction || !isValidAmount || !isValidCurrency) {
    await prisma.institutionSubscriptionRenewalPayment.update({
      where: {
        tranId: transactionId
      },
      data: {
        status: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        gatewayStatus: validationData?.status || query.status || "FAILED",
        gatewayValId: validationData?.val_id || validationId,
        gatewayRawPayload: validationData ?? rawQuery
      }
    });
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed", transactionId)
    };
  }
  await prisma.$transaction(async (trx) => {
    await trx.institutionSubscriptionRenewalPayment.update({
      where: {
        tranId: transactionId
      },
      data: {
        status: SUBSCRIPTION_PAYMENT_STATUS_PAID,
        paidAt: /* @__PURE__ */ new Date(),
        gatewayStatus: validationData?.status || "VALID",
        gatewayValId: validationData?.val_id || validationId,
        gatewayBankTranId: validationData?.bank_tran_id || null,
        gatewayCardType: validationData?.card_type || null,
        gatewayRawPayload: validationData
      }
    });
    await trx.institutionSubscription.updateMany({
      where: {
        institutionId: renewalPayment.institutionId,
        status: "ACTIVE",
        endsAt: {
          lte: /* @__PURE__ */ new Date()
        }
      },
      data: {
        status: "EXPIRED"
      }
    });
    const latestSubscription = await trx.institutionSubscription.findFirst({
      where: {
        institutionId: renewalPayment.institutionId
      },
      select: {
        endsAt: true
      },
      orderBy: {
        endsAt: "desc"
      }
    });
    const now = /* @__PURE__ */ new Date();
    const startsAt = latestSubscription?.endsAt && latestSubscription.endsAt > now ? latestSubscription.endsAt : now;
    await trx.institutionSubscription.create({
      data: {
        institutionId: renewalPayment.institutionId,
        sourceApplicationId: null,
        plan: renewalPayment.plan,
        status: "ACTIVE",
        amount: toMoneyNumber2(renewalPayment.amount),
        currency: renewalPayment.currency,
        monthsCovered: renewalPayment.monthsCovered,
        startsAt,
        endsAt: addMonths(startsAt, renewalPayment.monthsCovered)
      }
    });
  });
  return {
    redirectUrl: buildSubscriptionRenewalRedirectUrl("success", transactionId)
  };
};
var createSemester3 = async (creatorUserId, payload) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw createHttpError9(400, "Invalid startDate or endDate");
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate <= today) {
    throw createHttpError9(400, "startDate must be after today");
  }
  if (startDate >= endDate) {
    throw createHttpError9(400, "startDate must be before endDate");
  }
  return prisma.semester.create({
    data: {
      name: payload.name.trim(),
      startDate,
      endDate,
      institutionId: context.institutionId
    }
  });
};
var updateSemester3 = async (creatorUserId, semesterId, payload) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const existingSemester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId: context.institutionId
    }
  });
  if (!existingSemester) {
    throw createHttpError9(404, "Semester not found for this institution");
  }
  let nextStartDate = existingSemester.startDate;
  let nextEndDate = existingSemester.endDate;
  if (payload.startDate) {
    const parsedStartDate = new Date(payload.startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw createHttpError9(400, "Invalid startDate");
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedStartDate <= today) {
      throw createHttpError9(400, "startDate must be after today");
    }
    nextStartDate = parsedStartDate;
  }
  if (payload.endDate) {
    const parsedEndDate = new Date(payload.endDate);
    if (Number.isNaN(parsedEndDate.getTime())) {
      throw createHttpError9(400, "Invalid endDate");
    }
    nextEndDate = parsedEndDate;
  }
  if (nextStartDate >= nextEndDate) {
    throw createHttpError9(400, "startDate must be before endDate");
  }
  return prisma.semester.update({
    where: {
      id: existingSemester.id
    },
    data: {
      name: payload.name?.trim() || void 0,
      startDate: payload.startDate ? nextStartDate : void 0,
      endDate: payload.endDate ? nextEndDate : void 0
    }
  });
};
var deleteSemester = async (creatorUserId, semesterId) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const existingSemester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId: context.institutionId
    },
    select: {
      id: true
    }
  });
  if (!existingSemester) {
    throw createHttpError9(404, "Semester not found for this institution");
  }
  await prisma.semester.delete({
    where: {
      id: existingSemester.id
    }
  });
  return {
    id: existingSemester.id
  };
};
var listFaculties = async (creatorUserId, search) => {
  const creatorAdminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId: creatorUserId
    },
    select: {
      institutionId: true,
      role: true
    }
  });
  if (!creatorAdminProfile?.institutionId) {
    throw createHttpError9(403, "Only institution-level admins can view faculties");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, "DEPARTMENT")) {
    throw createHttpError9(403, "You are not allowed to view faculties for department creation");
  }
  const normalizedSearch = normalizeSearch4(search);
  return prisma.faculty.findMany({
    where: {
      institutionId: creatorAdminProfile.institutionId,
      ...normalizedSearch ? {
        OR: [
          { fullName: { contains: normalizedSearch, mode: "insensitive" } },
          { shortName: { contains: normalizedSearch, mode: "insensitive" } }
        ]
      } : {}
    },
    select: {
      id: true,
      fullName: true,
      shortName: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
};
var createSubAdminAccount = async (creatorUserId, payload) => {
  const creatorAdminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId: creatorUserId
    },
    select: {
      institutionId: true,
      role: true
    }
  });
  if (!creatorAdminProfile?.institutionId) {
    throw createHttpError9(403, "Only institution-level admins can create sub-admin accounts");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, payload.accountType)) {
    throw createHttpError9(
      403,
      "You are not allowed to create this account type. Faculty admins can only create department accounts"
    );
  }
  const registered = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: UserRole.ADMIN
    }
  });
  if (!registered.user) {
    throw createHttpError9(500, "Failed to create account");
  }
  const normalizedFacultyFullName = payload.facultyFullName?.trim();
  const normalizedFacultyShortName = payload.facultyShortName?.trim();
  const normalizedFacultyDescription = payload.facultyDescription?.trim();
  const normalizedDepartmentFullName = payload.departmentFullName?.trim();
  const normalizedDepartmentShortName = payload.departmentShortName?.trim();
  const normalizedDepartmentDescription = payload.departmentDescription?.trim();
  const result = await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: registered.user.id
      },
      data: {
        accountStatus: AccountStatus.ACTIVE
      }
    });
    const adminProfile = await trx.adminProfile.upsert({
      where: {
        userId: registered.user.id
      },
      create: {
        userId: registered.user.id,
        institutionId: creatorAdminProfile.institutionId,
        role: resolveAdminRole(payload.accountType)
      },
      update: {
        institutionId: creatorAdminProfile.institutionId,
        role: resolveAdminRole(payload.accountType)
      },
      select: {
        role: true,
        institutionId: true,
        createdAt: true
      }
    });
    let createdFaculty;
    let targetFacultyId;
    if (payload.facultyId) {
      const existingFaculty = await trx.faculty.findFirst({
        where: {
          id: payload.facultyId,
          institutionId: creatorAdminProfile.institutionId
        },
        select: {
          id: true,
          fullName: true
        }
      });
      if (!existingFaculty) {
        throw createHttpError9(404, "Faculty not found for this institution");
      }
      targetFacultyId = existingFaculty.id;
    }
    if (normalizedFacultyFullName) {
      const faculty = await trx.faculty.create({
        data: {
          fullName: normalizedFacultyFullName,
          shortName: normalizedFacultyShortName || void 0,
          description: normalizedFacultyDescription || void 0,
          institutionId: creatorAdminProfile.institutionId
        },
        select: {
          id: true,
          fullName: true
        }
      });
      createdFaculty = faculty;
      targetFacultyId = faculty.id;
    }
    let createdDepartment;
    if (normalizedDepartmentFullName) {
      if (!targetFacultyId) {
        const faculties = await trx.faculty.findMany({
          where: {
            institutionId: creatorAdminProfile.institutionId
          },
          select: {
            id: true
          },
          take: 2,
          orderBy: {
            createdAt: "asc"
          }
        });
        if (faculties.length === 0) {
          throw createHttpError9(
            400,
            "Cannot create department without a faculty. Provide faculty fields first"
          );
        }
        if (faculties.length > 1) {
          throw createHttpError9(
            400,
            "Multiple faculties found. Provide facultyId or faculty fields to select a target faculty"
          );
        }
        targetFacultyId = faculties[0].id;
      }
      const department = await trx.department.create({
        data: {
          fullName: normalizedDepartmentFullName,
          shortName: normalizedDepartmentShortName || void 0,
          description: normalizedDepartmentDescription || void 0,
          facultyId: targetFacultyId
        },
        select: {
          id: true,
          fullName: true
        }
      });
      createdDepartment = department;
    }
    return {
      adminProfile,
      createdFaculty,
      createdDepartment
    };
  });
  return {
    id: registered.user.id,
    name: registered.user.name,
    email: registered.user.email,
    role: UserRole.ADMIN,
    adminRole: result.adminProfile.role,
    institutionId: result.adminProfile.institutionId,
    createdAt: result.adminProfile.createdAt,
    faculty: result.createdFaculty ?? null,
    department: result.createdDepartment ?? null
  };
};
var InstitutionAdminService = {
  getDashboardSummary: getDashboardSummary3,
  updateProfile,
  getSslCommerzCredential,
  upsertSslCommerzCredential,
  initiateSubscriptionRenewal,
  handleSubscriptionRenewalPaymentCallback,
  listSemesters: listSemesters3,
  createSemester: createSemester3,
  updateSemester: updateSemester3,
  deleteSemester,
  createSubAdminAccount,
  listFaculties
};

// src/app/module/institutionAdmin/institutionAdmin.controller.ts
var readParam3 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue4 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
function getCallbackPayload(req) {
  return {
    ...req.query,
    ...req.body
  };
}
var createSubAdminAccount2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.createSubAdminAccount(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Account created successfully",
    data: result
  });
});
var listFaculties2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.listFaculties(
    user.id,
    readQueryValue4(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Faculties fetched successfully",
    data: result
  });
});
var getDashboardSummary4 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.getDashboardSummary(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Dashboard summary fetched successfully",
    data: result
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.updateProfile(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var getSslCommerzCredential2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.getSslCommerzCredential(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "SSLCommerz credential settings fetched successfully",
    data: result
  });
});
var upsertSslCommerzCredential2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.upsertSslCommerzCredential(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "SSLCommerz credential settings updated successfully",
    data: result
  });
});
var initiateSubscriptionRenewal2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.initiateSubscriptionRenewal(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Subscription renewal payment initiated successfully",
    data: result
  });
});
var handleRenewalPaymentSuccess = catchAsync(async (req, res) => {
  const result = await InstitutionAdminService.handleSubscriptionRenewalPaymentCallback(
    "success",
    getCallbackPayload(req)
  );
  res.redirect(result.redirectUrl);
});
var handleRenewalPaymentFail = catchAsync(async (req, res) => {
  const result = await InstitutionAdminService.handleSubscriptionRenewalPaymentCallback(
    "failed",
    getCallbackPayload(req)
  );
  res.redirect(result.redirectUrl);
});
var handleRenewalPaymentCancel = catchAsync(async (req, res) => {
  const result = await InstitutionAdminService.handleSubscriptionRenewalPaymentCallback(
    "cancelled",
    getCallbackPayload(req)
  );
  res.redirect(result.redirectUrl);
});
var listSemesters4 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.listSemesters(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semesters fetched successfully",
    data: result
  });
});
var createSemester4 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.createSemester(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Semester created successfully",
    data: result
  });
});
var updateSemester4 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.updateSemester(
    user.id,
    readParam3(req.params.semesterId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semester updated successfully",
    data: result
  });
});
var deleteSemester2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.deleteSemester(
    user.id,
    readParam3(req.params.semesterId)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Semester deleted successfully",
    data: result
  });
});
var InstitutionAdminController = {
  getDashboardSummary: getDashboardSummary4,
  updateProfile: updateProfile2,
  getSslCommerzCredential: getSslCommerzCredential2,
  upsertSslCommerzCredential: upsertSslCommerzCredential2,
  initiateSubscriptionRenewal: initiateSubscriptionRenewal2,
  handleRenewalPaymentSuccess,
  handleRenewalPaymentFail,
  handleRenewalPaymentCancel,
  createSubAdminAccount: createSubAdminAccount2,
  listFaculties: listFaculties2,
  listSemesters: listSemesters4,
  createSemester: createSemester4,
  updateSemester: updateSemester4,
  deleteSemester: deleteSemester2
};

// src/app/module/institutionAdmin/institutionAdmin.validation.ts
import { z as z8 } from "zod";
var passwordSchema3 = z8.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
var InstitutionAdminValidation = {
  semesterParamsSchema: z8.object({
    params: z8.object({
      semesterId: z8.uuid("Please provide a valid semester id")
    })
  }),
  createSemesterSchema: z8.object({
    body: z8.object({
      name: z8.string("Semester name is required").trim().min(2).max(80),
      startDate: z8.iso.datetime("startDate must be a valid ISO datetime"),
      endDate: z8.iso.datetime("endDate must be a valid ISO datetime")
    })
  }),
  updateSemesterSchema: z8.object({
    params: z8.object({
      semesterId: z8.uuid("Please provide a valid semester id")
    }),
    body: z8.object({
      name: z8.string("Semester name must be a string").trim().min(2).max(80).optional(),
      startDate: z8.iso.datetime("startDate must be a valid ISO datetime").optional(),
      endDate: z8.iso.datetime("endDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  updateProfileSchema: z8.object({
    body: z8.object({
      name: z8.string("name must be a string").trim().min(2).max(120).optional(),
      image: z8.url("image must be a valid URL").trim().optional(),
      contactNo: z8.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z8.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z8.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z8.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z8.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  upsertSslCommerzCredentialSchema: z8.object({
    body: z8.object({
      storeId: z8.string("storeId must be a string").trim().min(2).max(120).optional(),
      storePassword: z8.string("storePassword must be a string").trim().min(4).max(200).optional(),
      baseUrl: z8.url("baseUrl must be a valid URL").trim().max(400).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  initiateSubscriptionRenewalSchema: z8.object({
    body: z8.object({
      plan: z8.enum(["MONTHLY", "HALF_YEARLY", "YEARLY"])
    })
  }),
  createSubAdminSchema: z8.object({
    body: z8.object({
      name: z8.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(60, "Name must not exceed 60 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Name must only contain letters, spaces, hyphens or apostrophes"
      ),
      email: z8.email("Please provide a valid email address").toLowerCase().trim(),
      password: passwordSchema3,
      accountType: z8.enum(["FACULTY", "DEPARTMENT"]),
      facultyId: z8.uuid("Please provide a valid faculty id").optional(),
      facultyFullName: z8.string("Faculty full name must be a string").trim().min(2, "Faculty full name must be at least 2 characters long").max(120, "Faculty full name must not exceed 120 characters").optional(),
      facultyShortName: z8.string("Faculty short name must be a string").trim().min(2, "Faculty short name must be at least 2 characters long").max(30, "Faculty short name must not exceed 30 characters").optional(),
      facultyDescription: z8.string("Faculty description must be a string").trim().min(3, "Faculty description must be at least 3 characters long").max(500, "Faculty description must not exceed 500 characters").optional(),
      departmentFullName: z8.string("Department full name must be a string").trim().min(2, "Department full name must be at least 2 characters long").max(120, "Department full name must not exceed 120 characters").optional(),
      departmentShortName: z8.string("Department short name must be a string").trim().min(2, "Department short name must be at least 2 characters long").max(30, "Department short name must not exceed 30 characters").optional(),
      departmentDescription: z8.string("Department description must be a string").trim().min(3, "Department description must be at least 3 characters long").max(500, "Department description must not exceed 500 characters").optional()
    })
  })
};

// src/app/module/institutionAdmin/institutionAdmin.route.ts
var router8 = Router8();
router8.get(
  "/dashboard-summary",
  requireAdminRole(),
  InstitutionAdminController.getDashboardSummary
);
router8.patch(
  "/profile",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.updateProfileSchema),
  InstitutionAdminController.updateProfile
);
router8.get(
  "/payment-gateway/sslcommerz",
  requireAdminRole(),
  InstitutionAdminController.getSslCommerzCredential
);
router8.put(
  "/payment-gateway/sslcommerz",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.upsertSslCommerzCredentialSchema),
  InstitutionAdminController.upsertSslCommerzCredential
);
router8.post(
  "/subscription/renew/initiate",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.initiateSubscriptionRenewalSchema),
  InstitutionAdminController.initiateSubscriptionRenewal
);
router8.get(
  "/subscription/renew/payment/success",
  InstitutionAdminController.handleRenewalPaymentSuccess
);
router8.get(
  "/subscription/renew/payment/fail",
  InstitutionAdminController.handleRenewalPaymentFail
);
router8.get(
  "/subscription/renew/payment/cancel",
  InstitutionAdminController.handleRenewalPaymentCancel
);
router8.post(
  "/subscription/renew/payment/success",
  InstitutionAdminController.handleRenewalPaymentSuccess
);
router8.post(
  "/subscription/renew/payment/fail",
  InstitutionAdminController.handleRenewalPaymentFail
);
router8.post(
  "/subscription/renew/payment/cancel",
  InstitutionAdminController.handleRenewalPaymentCancel
);
router8.get("/faculties", requireAdminRole(), InstitutionAdminController.listFaculties);
router8.get("/semesters", requireAdminRole(), InstitutionAdminController.listSemesters);
router8.post(
  "/semesters",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.createSemesterSchema),
  InstitutionAdminController.createSemester
);
router8.patch(
  "/semesters/:semesterId",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.updateSemesterSchema),
  InstitutionAdminController.updateSemester
);
router8.delete(
  "/semesters/:semesterId",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.semesterParamsSchema),
  InstitutionAdminController.deleteSemester
);
router8.post(
  "/sub-admins",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.createSubAdminSchema),
  InstitutionAdminController.createSubAdminAccount
);
var InstitutionAdminRouter = router8;

// src/app/module/institutionApplication/institutionApplication.route.ts
import { Router as Router9 } from "express";

// src/app/module/institutionApplication/institutionApplication.service.ts
function createHttpError10(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
var DEFAULT_FRONTEND_BASE2 = "http://localhost:3000";
var SUBSCRIPTION_PAYMENT_STATUS_PENDING2 = "PENDING";
var SUBSCRIPTION_PAYMENT_STATUS_PAID2 = "PAID";
var SUBSCRIPTION_PAYMENT_STATUS_FAILED2 = "FAILED";
var SUBSCRIPTION_PAYMENT_STATUS_CANCELLED2 = "CANCELLED";
var INSTITUTION_SUBSCRIPTION_STATUS_ACTIVE = "ACTIVE";
var SUBSCRIPTION_PLAN_CONFIG2 = {
  MONTHLY: { months: 1, amount: 500, originalAmount: 500, label: "Monthly" },
  HALF_YEARLY: { months: 6, amount: 2800, originalAmount: 3e3, label: "Half Yearly" },
  YEARLY: { months: 12, amount: 5600, originalAmount: 6e3, label: "Yearly" }
};
function getFrontendBaseUrl2() {
  const raw3 = process.env.FRONTEND_PUBLIC_URL?.trim() || process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() || DEFAULT_FRONTEND_BASE2;
  return raw3.replace(/\/$/, "");
}
function getBackendBaseUrl2() {
  const raw3 = process.env.BACKEND_PUBLIC_URL?.trim() || process.env.BASE_URL?.trim();
  if (!raw3) {
    throw createHttpError10(
      500,
      "Backend public URL is not configured. Set BACKEND_PUBLIC_URL in environment."
    );
  }
  return raw3.replace(/\/$/, "");
}
function getSslCommerzBaseUrl2() {
  const envBaseUrl = process.env.SSLCOMMERZ_BASE_URL?.trim().replace(/\/$/, "");
  return envBaseUrl || "https://sandbox.sslcommerz.com";
}
function getSslCommerzCredentials2() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePassword) {
    throw createHttpError10(
      500,
      "SSLCommerz credentials are not configured. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD."
    );
  }
  return { storeId, storePassword };
}
function toMoneyNumber3(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) {
    return 0;
  }
  return Number(next.toFixed(2));
}
function areMoneyValuesEqual2(left, right) {
  return Math.abs(toMoneyNumber3(left) - toMoneyNumber3(right)) <= 0.01;
}
function buildSubscriptionRedirectUrl(status, tranId) {
  const frontendBase = getFrontendBaseUrl2();
  const searchParams = new URLSearchParams({
    subscriptionPaymentStatus: status
  });
  if (tranId) {
    searchParams.set("tranId", tranId);
  }
  return `${frontendBase}/?${searchParams.toString()}`;
}
function toSafeUpper2(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized ? normalized.toUpperCase() : fallback;
}
function readQueryValue5(value) {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : void 0;
  }
  return typeof value === "string" ? value : void 0;
}
function normalizeCallbackQuery2(query) {
  return {
    tran_id: readQueryValue5(query.tran_id),
    val_id: readQueryValue5(query.val_id),
    status: readQueryValue5(query.status),
    bank_tran_id: readQueryValue5(query.bank_tran_id),
    card_type: readQueryValue5(query.card_type)
  };
}
function addMonths2(value, months) {
  const next = new Date(value);
  next.setMonth(next.getMonth() + months);
  return next;
}
var create = async (userId, payload) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      id: true,
      institutionId: true
    }
  });
  if (adminProfile?.institutionId) {
    throw createHttpError10(400, "You are already assigned to an institution");
  }
  const existingPending = await prisma.institutionApplication.findFirst({
    where: {
      applicantUserId: userId,
      status: InstitutionApplicationStatus.PENDING
    },
    select: {
      id: true
    }
  });
  if (existingPending) {
    throw createHttpError10(400, "You already have a pending application");
  }
  return prisma.institutionApplication.create({
    data: {
      applicantUserId: userId,
      institutionName: payload.institutionName,
      description: payload.description,
      shortName: payload.shortName,
      institutionType: payload.institutionType,
      institutionLogo: payload.institutionLogo,
      status: InstitutionApplicationStatus.PENDING
    }
  });
};
var getMyApplications = async (userId) => {
  return prisma.institutionApplication.findMany({
    where: {
      applicantUserId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var listForSuperAdmin = async (status) => {
  return prisma.institutionApplication.findMany({
    where: status ? {
      status
    } : void 0,
    include: {
      applicantUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      reviewedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          type: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getSubscriptionPricing = async () => {
  const getSupport = (plan) => {
    if (plan === "MONTHLY") {
      return "Standard support";
    }
    if (plan === "HALF_YEARLY") {
      return "Priority support";
    }
    return "Dedicated support";
  };
  const getFeatures = (plan) => {
    if (plan === "MONTHLY") {
      return [
        "Complete institution portal access",
        "Student and teacher onboarding",
        "Academic management and notices"
      ];
    }
    if (plan === "HALF_YEARLY") {
      return [
        "Everything in Monthly",
        "Priority issue handling",
        "Implementation assistance"
      ];
    }
    return [
      "Everything in Half Yearly",
      "Dedicated support channel",
      "Operational review and guidance"
    ];
  };
  return Object.entries(SUBSCRIPTION_PLAN_CONFIG2).map(([plan, config2]) => ({
    plan,
    label: config2.label,
    amount: config2.amount,
    originalAmount: config2.originalAmount,
    monthsCovered: config2.months,
    currency: "BDT",
    support: getSupport(plan),
    features: getFeatures(plan)
  }));
};
var initiateSubscriptionPayment = async (userId, applicationId, payload) => {
  const application = await prisma.institutionApplication.findFirst({
    where: {
      id: applicationId,
      applicantUserId: userId
    }
  });
  if (!application) {
    throw createHttpError10(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError10(400, "Only pending applications can receive subscription payments");
  }
  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
    throw createHttpError10(400, "Subscription payment already completed for this application");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      email: true,
      contactNo: true,
      presentAddress: true
    }
  });
  if (!user) {
    throw createHttpError10(404, "User not found");
  }
  const selectedPlan = SUBSCRIPTION_PLAN_CONFIG2[payload.plan];
  const amount = toMoneyNumber3(selectedPlan.amount);
  const currency = "BDT";
  const backendBaseUrl = getBackendBaseUrl2();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl2();
  const { storeId, storePassword } = getSslCommerzCredentials2();
  const transactionId = `INSTSUB-${application.id.slice(0, 8)}-${Date.now()}`;
  await prisma.institutionApplication.update({
    where: {
      id: application.id
    },
    data: {
      subscriptionPlan: payload.plan,
      subscriptionAmount: amount,
      subscriptionCurrency: currency,
      subscriptionMonths: selectedPlan.months,
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PENDING2,
      subscriptionTranId: transactionId,
      subscriptionPaidAt: null
    }
  });
  const requestBody = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: amount.toFixed(2),
    currency,
    tran_id: transactionId,
    success_url: `${backendBaseUrl}/api/v1/institution-applications/admin/subscription/payment/success`,
    fail_url: `${backendBaseUrl}/api/v1/institution-applications/admin/subscription/payment/fail`,
    cancel_url: `${backendBaseUrl}/api/v1/institution-applications/admin/subscription/payment/cancel`,
    ipn_url: `${backendBaseUrl}/api/v1/institution-applications/admin/subscription/payment/fail`,
    shipping_method: "NO",
    product_name: `Institution Subscription - ${selectedPlan.label}`,
    product_category: "Education",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.presentAddress?.trim() || "N/A",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: user.contactNo?.trim() || "01700000000",
    value_a: application.id,
    value_b: userId,
    value_c: payload.plan
  });
  const response = await fetch(`${sslCommerzBaseUrl}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: requestBody.toString()
  });
  const gatewayResponse = await response.json().catch(() => null);
  const gatewayPageUrl = gatewayResponse?.GatewayPageURL;
  const gatewayStatus = gatewayResponse?.status?.toUpperCase();
  if (!response.ok || !gatewayPageUrl || gatewayStatus !== "SUCCESS") {
    await prisma.institutionApplication.update({
      where: {
        id: application.id
      },
      data: {
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED2,
        subscriptionGatewayStatus: gatewayResponse?.status ?? "FAILED",
        subscriptionGatewayRawPayload: gatewayResponse ?? { httpStatus: response.status }
      }
    });
    const failureMessage = gatewayResponse?.failedreason?.trim() || gatewayResponse?.status?.trim() || "Unable to initialize SSLCommerz payment session";
    throw createHttpError10(502, failureMessage);
  }
  await prisma.institutionApplication.update({
    where: {
      id: application.id
    },
    data: {
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PENDING2,
      subscriptionGatewayStatus: gatewayResponse?.status,
      subscriptionGatewaySessionKey: gatewayResponse?.sessionkey || null,
      subscriptionGatewayRawPayload: gatewayResponse
    }
  });
  return {
    applicationId: application.id,
    plan: payload.plan,
    amount,
    currency,
    monthsCovered: selectedPlan.months,
    tranId: transactionId,
    paymentUrl: gatewayPageUrl
  };
};
var handleSubscriptionPaymentCallback = async (callbackType, rawQuery) => {
  const query = normalizeCallbackQuery2(rawQuery);
  const transactionId = query.tran_id?.trim();
  if (!transactionId) {
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed")
    };
  }
  const application = await prisma.institutionApplication.findFirst({
    where: {
      subscriptionTranId: transactionId
    }
  });
  if (!application) {
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId)
    };
  }
  if (callbackType === "cancelled") {
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
      await prisma.institutionApplication.update({
        where: {
          id: application.id
        },
        data: {
          subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_CANCELLED2,
          subscriptionGatewayStatus: query.status || "CANCELLED",
          subscriptionGatewayRawPayload: rawQuery
        }
      });
    }
    return {
      redirectUrl: buildSubscriptionRedirectUrl("cancelled", transactionId)
    };
  }
  if (callbackType === "failed") {
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
      await prisma.institutionApplication.update({
        where: {
          id: application.id
        },
        data: {
          subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED2,
          subscriptionGatewayStatus: query.status || "FAILED",
          subscriptionGatewayRawPayload: rawQuery
        }
      });
    }
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId)
    };
  }
  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
    return {
      redirectUrl: buildSubscriptionRedirectUrl("success", transactionId)
    };
  }
  const validationId = query.val_id?.trim();
  if (!validationId) {
    await prisma.institutionApplication.update({
      where: {
        id: application.id
      },
      data: {
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED2,
        subscriptionGatewayStatus: query.status || "FAILED",
        subscriptionGatewayRawPayload: rawQuery
      }
    });
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId)
    };
  }
  const { storeId, storePassword } = getSslCommerzCredentials2();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl2();
  const validatorParams = new URLSearchParams({
    val_id: validationId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json"
  });
  const validationResponse = await fetch(
    `${sslCommerzBaseUrl}/validator/api/validationserverAPI.php?${validatorParams.toString()}`
  );
  const validationData = await validationResponse.json().catch(() => null);
  const validationStatus = validationData?.status?.toUpperCase();
  const isValidStatus = validationStatus === "VALID" || validationStatus === "VALIDATED";
  const isValidTransaction = validationData?.tran_id === application.subscriptionTranId;
  const isValidAmount = areMoneyValuesEqual2(validationData?.amount, application.subscriptionAmount);
  const isValidCurrency = toSafeUpper2(validationData?.currency_type, application.subscriptionCurrency) === toSafeUpper2(application.subscriptionCurrency, "BDT");
  if (!validationResponse.ok || !isValidStatus || !isValidTransaction || !isValidAmount || !isValidCurrency) {
    await prisma.institutionApplication.update({
      where: {
        id: application.id
      },
      data: {
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED2,
        subscriptionGatewayStatus: validationData?.status || query.status || "FAILED",
        subscriptionGatewayValId: validationData?.val_id || validationId,
        subscriptionGatewayRawPayload: validationData ?? rawQuery
      }
    });
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId)
    };
  }
  await prisma.institutionApplication.update({
    where: {
      id: application.id
    },
    data: {
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PAID2,
      subscriptionPaidAt: /* @__PURE__ */ new Date(),
      subscriptionGatewayStatus: validationData?.status || "VALID",
      subscriptionGatewayValId: validationData?.val_id || validationId,
      subscriptionGatewayBankTranId: validationData?.bank_tran_id || null,
      subscriptionGatewayCardType: validationData?.card_type || null,
      subscriptionGatewayRawPayload: validationData
    }
  });
  return {
    redirectUrl: buildSubscriptionRedirectUrl("success", transactionId)
  };
};
var listInstitutionStudentPaymentsForSuperAdmin = async (institutionId) => {
  const payments = await prisma.studentFeePayment.findMany({
    where: {
      status: "SUCCESS",
      ...institutionId ? {
        institutionId
      } : {}
    },
    include: {
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          type: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      semester: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      paidAt: "desc"
    }
  });
  const institutionSummaryMap = /* @__PURE__ */ new Map();
  for (const payment of payments) {
    const key = payment.institutionId;
    const existing = institutionSummaryMap.get(key);
    const amount = toMoneyNumber3(payment.amount);
    if (existing) {
      existing.totalAmount = toMoneyNumber3(existing.totalAmount + amount);
      existing.totalPayments += 1;
      institutionSummaryMap.set(key, existing);
    } else {
      institutionSummaryMap.set(key, {
        institutionId: key,
        institutionName: payment.institution?.name ?? "Unknown Institution",
        shortName: payment.institution?.shortName ?? null,
        totalAmount: amount,
        totalPayments: 1
      });
    }
  }
  return {
    summary: Array.from(institutionSummaryMap.values()).sort((left, right) => right.totalAmount - left.totalAmount),
    payments: payments.map((payment) => ({
      id: payment.id,
      institutionId: payment.institutionId,
      institutionName: payment.institution?.name ?? "Unknown Institution",
      institutionType: payment.institution?.type ?? "OTHER",
      studentProfileId: payment.studentProfileId,
      studentsId: payment.studentProfile?.studentsId ?? null,
      studentName: payment.studentProfile?.user?.name ?? "Unknown Student",
      studentEmail: payment.studentProfile?.user?.email ?? null,
      semesterId: payment.semesterId,
      semesterName: payment.semester?.name ?? "N/A",
      paymentMode: payment.paymentMode,
      amount: toMoneyNumber3(payment.amount),
      currency: payment.currency,
      tranId: payment.tranId,
      paidAt: payment.paidAt
    }))
  };
};
var listInstitutionStudentPaymentsForAdmin = async (userId) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError10(403, "Only institution admins can view institution payment details");
  }
  return listInstitutionStudentPaymentsForSuperAdmin(adminProfile.institutionId);
};
var getSuperAdminSummary = async (userId) => {
  const now = /* @__PURE__ */ new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 14);
  const [
    currentUser,
    totalInstitutions,
    totalStudents,
    totalTeachers,
    totalStaffAccounts,
    pendingApplications,
    approvedToday,
    rejectedApplications,
    activeSessions,
    newSignupsLast7Days,
    newSignupsPrevious7Days,
    newStudentsLast7Days,
    newStudentsPrevious7Days,
    newTeachersLast7Days,
    newTeachersPrevious7Days,
    newStaffLast7Days,
    newStaffPrevious7Days,
    newInstitutionsThisMonth,
    newAdmissionsThisMonth,
    pendingTeacherApprovals,
    verifiedTeacherProfiles,
    institutionTypeGroups
  ] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    }),
    prisma.institution.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPERADMIN"] } } }),
    prisma.institutionApplication.count({
      where: {
        status: InstitutionApplicationStatus.PENDING
      }
    }),
    prisma.institutionApplication.count({
      where: {
        status: InstitutionApplicationStatus.APPROVED,
        reviewedAt: {
          gte: dayStart
        }
      }
    }),
    prisma.institutionApplication.count({
      where: {
        status: InstitutionApplicationStatus.REJECTED
      }
    }),
    prisma.session.count({
      where: {
        expiresAt: {
          gt: now
        }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    }),
    prisma.user.count({
      where: {
        role: "TEACHER",
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    prisma.user.count({
      where: {
        role: "TEACHER",
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    }),
    prisma.user.count({
      where: {
        role: {
          in: ["ADMIN", "SUPERADMIN"]
        },
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    prisma.user.count({
      where: {
        role: {
          in: ["ADMIN", "SUPERADMIN"]
        },
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo
        }
      }
    }),
    prisma.institution.count({
      where: {
        createdAt: {
          gte: monthStart
        }
      }
    }),
    prisma.studentAdmissionApplication.count({
      where: {
        appliedAt: {
          gte: monthStart
        }
      }
    }),
    prisma.teacherJobApplication.count({
      where: {
        status: "PENDING"
      }
    }),
    prisma.teacherProfile.count(),
    prisma.institution.groupBy({
      by: ["type"],
      _count: {
        id: true
      }
    })
  ]);
  const growthBase = Math.max(newSignupsPrevious7Days, 1);
  const weeklyGrowthPercentage = Number(
    ((newSignupsLast7Days - newSignupsPrevious7Days) / growthBase * 100).toFixed(2)
  );
  const studentGrowthBase = Math.max(newStudentsPrevious7Days, 1);
  const studentGrowthPercentage = Number(
    ((newStudentsLast7Days - newStudentsPrevious7Days) / studentGrowthBase * 100).toFixed(2)
  );
  const teacherGrowthBase = Math.max(newTeachersPrevious7Days, 1);
  const teacherGrowthPercentage = Number(
    ((newTeachersLast7Days - newTeachersPrevious7Days) / teacherGrowthBase * 100).toFixed(2)
  );
  const staffGrowthBase = Math.max(newStaffPrevious7Days, 1);
  const staffGrowthPercentage = Number(
    ((newStaffLast7Days - newStaffPrevious7Days) / staffGrowthBase * 100).toFixed(2)
  );
  const institutionTypeBreakdown = institutionTypeGroups.reduce(
    (acc, item) => {
      const key = item.type ?? "OTHER";
      acc[key] = item._count.id;
      return acc;
    },
    {}
  );
  return {
    user: currentUser,
    stats: {
      totalInstitutions,
      totalStudents,
      totalTeachers,
      totalStaffAccounts,
      activeSessions,
      pendingApplications,
      approvedToday,
      rejectedApplications,
      newSignupsLast7Days,
      weeklyGrowthPercentage,
      studentGrowthPercentage,
      teacherGrowthPercentage,
      staffGrowthPercentage,
      pendingInstitutionVerifications: pendingApplications,
      newInstitutionsThisMonth,
      newAdmissionsThisMonth,
      pendingTeacherApprovals,
      verifiedTeacherProfiles,
      institutionTypeBreakdown
    }
  };
};
var review = async (reviewerUserId, applicationId, payload) => {
  const application = await prisma.institutionApplication.findUnique({
    where: {
      id: applicationId
    }
  });
  if (!application) {
    throw createHttpError10(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError10(400, "Application already reviewed");
  }
  if (payload.status === InstitutionApplicationStatus.APPROVED) {
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
      throw createHttpError10(400, "Subscription payment is pending for this application");
    }
    if (!application.subscriptionPlan || !application.subscriptionMonths || !application.subscriptionAmount) {
      throw createHttpError10(400, "Subscription metadata is missing for this application");
    }
  }
  if (payload.status === InstitutionApplicationStatus.REJECTED) {
    return prisma.institutionApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: InstitutionApplicationStatus.REJECTED,
        rejectionReason: payload.rejectionReason ?? null,
        reviewedByUserId: reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  return prisma.$transaction(async (trx) => {
    const institution = await trx.institution.create({
      data: {
        name: application.institutionName,
        description: application.description,
        shortName: application.shortName,
        type: application.institutionType,
        institutionLogo: application.institutionLogo
      },
      select: {
        id: true
      }
    });
    await trx.adminProfile.upsert({
      where: {
        userId: application.applicantUserId
      },
      create: {
        userId: application.applicantUserId,
        role: AdminRole.INSTITUTIONADMIN,
        institutionId: institution.id
      },
      update: {
        institutionId: institution.id
      }
    });
    const subscriptionStartsAt = /* @__PURE__ */ new Date();
    const subscriptionEndsAt = addMonths2(subscriptionStartsAt, application.subscriptionMonths ?? 1);
    await trx.institutionSubscription.create({
      data: {
        institutionId: institution.id,
        sourceApplicationId: application.id,
        plan: application.subscriptionPlan,
        status: INSTITUTION_SUBSCRIPTION_STATUS_ACTIVE,
        amount: application.subscriptionAmount,
        currency: application.subscriptionCurrency,
        monthsCovered: application.subscriptionMonths,
        startsAt: subscriptionStartsAt,
        endsAt: subscriptionEndsAt
      }
    });
    return trx.institutionApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: InstitutionApplicationStatus.APPROVED,
        rejectionReason: null,
        reviewedByUserId: reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date(),
        institutionId: institution.id
      }
    });
  });
};
var InstitutionApplicationService = {
  create,
  getMyApplications,
  listForSuperAdmin,
  getSuperAdminSummary,
  getSubscriptionPricing,
  initiateSubscriptionPayment,
  handleSubscriptionPaymentCallback,
  listInstitutionStudentPaymentsForSuperAdmin,
  listInstitutionStudentPaymentsForAdmin,
  review
};

// src/app/module/institutionApplication/institutionApplication.controller.ts
var create2 = async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionApplicationService.create(user.id, req.body);
  res.status(201).json({
    success: true,
    message: "Institution application submitted",
    data: result
  });
};
var myApplications = async (_req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionApplicationService.getMyApplications(user.id);
  res.status(200).json({
    success: true,
    data: result
  });
};
var listForSuperAdmin2 = async (req, res) => {
  const statusRaw = req.query.status;
  const status = typeof statusRaw === "string" && [
    InstitutionApplicationStatus.PENDING,
    InstitutionApplicationStatus.APPROVED,
    InstitutionApplicationStatus.REJECTED
  ].includes(statusRaw) ? statusRaw : void 0;
  const result = await InstitutionApplicationService.listForSuperAdmin(status);
  res.status(200).json({
    success: true,
    data: result
  });
};
var getSuperAdminSummary2 = async (_req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionApplicationService.getSuperAdminSummary(user.id);
  res.status(200).json({
    success: true,
    data: result
  });
};
var getSubscriptionPricing2 = async (_req, res) => {
  const result = await InstitutionApplicationService.getSubscriptionPricing();
  res.status(200).json({
    success: true,
    data: result
  });
};
var initiateSubscriptionPayment2 = async (req, res) => {
  const user = res.locals.authUser;
  const applicationIdParam = req.params.applicationId;
  const applicationId = Array.isArray(applicationIdParam) ? applicationIdParam[0] : applicationIdParam;
  if (!applicationId) {
    return res.status(400).json({
      success: false,
      message: "Application id is required"
    });
  }
  const result = await InstitutionApplicationService.initiateSubscriptionPayment(
    user.id,
    applicationId,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Subscription payment initiated successfully",
    data: result
  });
};
var readSubscriptionCallbackPayload = (req) => ({
  ...req.query,
  ...req.body
});
var handleSubscriptionPaymentSuccessRedirect = async (req, res) => {
  const result = await InstitutionApplicationService.handleSubscriptionPaymentCallback(
    "success",
    readSubscriptionCallbackPayload(req)
  );
  res.redirect(result.redirectUrl);
};
var handleSubscriptionPaymentFailureRedirect = async (req, res) => {
  const result = await InstitutionApplicationService.handleSubscriptionPaymentCallback(
    "failed",
    readSubscriptionCallbackPayload(req)
  );
  res.redirect(result.redirectUrl);
};
var handleSubscriptionPaymentCancelRedirect = async (req, res) => {
  const result = await InstitutionApplicationService.handleSubscriptionPaymentCallback(
    "cancelled",
    readSubscriptionCallbackPayload(req)
  );
  res.redirect(result.redirectUrl);
};
var listInstitutionStudentPaymentsForSuperAdmin2 = async (req, res) => {
  const institutionId = typeof req.query.institutionId === "string" ? req.query.institutionId : void 0;
  const result = await InstitutionApplicationService.listInstitutionStudentPaymentsForSuperAdmin(institutionId);
  res.status(200).json({
    success: true,
    data: result
  });
};
var listInstitutionStudentPaymentsForAdmin2 = async (_req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionApplicationService.listInstitutionStudentPaymentsForAdmin(user.id);
  res.status(200).json({
    success: true,
    data: result
  });
};
var review2 = async (req, res) => {
  const user = res.locals.authUser;
  const applicationIdParam = req.params.applicationId;
  const applicationId = Array.isArray(applicationIdParam) ? applicationIdParam[0] : applicationIdParam;
  if (!applicationId) {
    return res.status(400).json({
      success: false,
      message: "Application id is required"
    });
  }
  const result = await InstitutionApplicationService.review(user.id, applicationId, req.body);
  res.status(200).json({
    success: true,
    message: "Application reviewed successfully",
    data: result
  });
};
var InstitutionApplicationController = {
  create: create2,
  myApplications,
  listForSuperAdmin: listForSuperAdmin2,
  getSuperAdminSummary: getSuperAdminSummary2,
  getSubscriptionPricing: getSubscriptionPricing2,
  initiateSubscriptionPayment: initiateSubscriptionPayment2,
  handleSubscriptionPaymentSuccessRedirect,
  handleSubscriptionPaymentFailureRedirect,
  handleSubscriptionPaymentCancelRedirect,
  listInstitutionStudentPaymentsForSuperAdmin: listInstitutionStudentPaymentsForSuperAdmin2,
  listInstitutionStudentPaymentsForAdmin: listInstitutionStudentPaymentsForAdmin2,
  review: review2
};

// src/app/module/institutionApplication/institutionApplication.validation.ts
import z9 from "zod";
var InstitutionApplicationValidation = {
  createSchema: z9.object({
    body: z9.object({
      institutionName: z9.string().min(2, "Institution name is required"),
      description: z9.string().max(500, "Description is too long").optional(),
      shortName: z9.string().min(2, "Short name must be at least 2 characters").max(50, "Short name is too long").optional(),
      institutionType: z9.enum([
        InstitutionType.SCHOOL,
        InstitutionType.COLLEGE,
        InstitutionType.UNIVERSITY,
        InstitutionType.TRAINING_CENTER,
        InstitutionType.OTHER
      ]),
      institutionLogo: z9.string().url("Institution logo must be a valid URL").optional()
    })
  }),
  reviewSchema: z9.object({
    body: z9.object({
      status: z9.enum([
        InstitutionApplicationStatus.APPROVED,
        InstitutionApplicationStatus.REJECTED
      ]),
      rejectionReason: z9.string().max(500, "Rejection reason is too long").optional()
    }).refine(
      (data) => data.status === InstitutionApplicationStatus.APPROVED || data.rejectionReason && data.rejectionReason.trim().length > 0,
      {
        message: "Rejection reason is required when rejecting an application",
        path: ["rejectionReason"]
      }
    )
  }),
  initiateSubscriptionPaymentSchema: z9.object({
    body: z9.object({
      plan: z9.enum(["MONTHLY", "HALF_YEARLY", "YEARLY"])
    })
  }),
  paymentCallbackQuerySchema: z9.object({
    query: z9.object({
      tran_id: z9.string().trim().min(1),
      val_id: z9.string().trim().optional(),
      status: z9.string().trim().optional(),
      bank_tran_id: z9.string().trim().optional(),
      card_type: z9.string().trim().optional()
    })
  })
};

// src/app/module/institutionApplication/institutionApplication.route.ts
var router9 = Router9();
router9.post(
  "/admin/apply",
  requireAdminRole(),
  validateRequest(InstitutionApplicationValidation.createSchema),
  InstitutionApplicationController.create
);
router9.get(
  "/admin/my-applications",
  requireAdminRole(),
  InstitutionApplicationController.myApplications
);
router9.get(
  "/superadmin",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.listForSuperAdmin
);
router9.get(
  "/superadmin-summary",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.getSuperAdminSummary
);
router9.get(
  "/pricing",
  InstitutionApplicationController.getSubscriptionPricing
);
router9.post(
  "/admin/:applicationId/subscription/initiate",
  requireAdminRole(),
  validateRequest(InstitutionApplicationValidation.initiateSubscriptionPaymentSchema),
  InstitutionApplicationController.initiateSubscriptionPayment
);
router9.get(
  "/admin/subscription/payment/success",
  InstitutionApplicationController.handleSubscriptionPaymentSuccessRedirect
);
router9.get(
  "/admin/subscription/payment/fail",
  InstitutionApplicationController.handleSubscriptionPaymentFailureRedirect
);
router9.get(
  "/admin/subscription/payment/cancel",
  InstitutionApplicationController.handleSubscriptionPaymentCancelRedirect
);
router9.post(
  "/admin/subscription/payment/success",
  InstitutionApplicationController.handleSubscriptionPaymentSuccessRedirect
);
router9.post(
  "/admin/subscription/payment/fail",
  InstitutionApplicationController.handleSubscriptionPaymentFailureRedirect
);
router9.post(
  "/admin/subscription/payment/cancel",
  InstitutionApplicationController.handleSubscriptionPaymentCancelRedirect
);
router9.get(
  "/superadmin/fee-payments",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.listInstitutionStudentPaymentsForSuperAdmin
);
router9.get(
  "/admin/fee-payments",
  requireAdminRole(),
  InstitutionApplicationController.listInstitutionStudentPaymentsForAdmin
);
router9.patch(
  "/superadmin/:applicationId/review",
  requireSessionRole("SUPERADMIN"),
  validateRequest(InstitutionApplicationValidation.reviewSchema),
  InstitutionApplicationController.review
);
var InstitutionApplicationRouter = router9;

// src/app/module/notice/notice.route.ts
import { Router as Router10 } from "express";

// src/app/module/notice/notice.service.ts
function createHttpError11(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch5(search) {
  const value = search?.trim();
  return value || void 0;
}
function noticeDelegate() {
  return prisma.notice;
}
function noticeReadDelegate() {
  return prisma.noticeRead;
}
var SENDER_ROLES = ["ADMIN", "FACULTY", "DEPARTMENT"];
var dedupeRoles = (roles) => Array.from(new Set(roles));
async function resolveNoticeContext(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true }
  });
  if (!user) {
    throw createHttpError11(404, "User not found");
  }
  if (user.role === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { institutionId: true }
    });
    if (!teacherProfile?.institutionId) {
      throw createHttpError11(403, "Teacher is not assigned to any institution yet");
    }
    return {
      userId,
      institutionId: teacherProfile.institutionId,
      role: "TEACHER"
    };
  }
  if (user.role === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { institutionId: true }
    });
    if (!studentProfile?.institutionId) {
      throw createHttpError11(403, "Student is not assigned to any institution yet");
    }
    return {
      userId,
      institutionId: studentProfile.institutionId,
      role: "STUDENT"
    };
  }
  if (user.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { userId },
      select: { institutionId: true, role: true }
    });
    if (!adminProfile?.institutionId) {
      throw createHttpError11(403, "Admin is not assigned to any institution");
    }
    const resolvedRole = adminProfile.role === AdminRole.FACULTYADMIN ? "FACULTY" : adminProfile.role === AdminRole.DEPARTMENTADMIN ? "DEPARTMENT" : "ADMIN";
    return {
      userId,
      institutionId: adminProfile.institutionId,
      role: resolvedRole
    };
  }
  throw createHttpError11(403, "Unsupported role for notices");
}
async function getNoticeByIdForViewer(context, noticeId) {
  const notice = await noticeDelegate().findFirst({
    where: {
      id: noticeId,
      institutionId: context.institutionId,
      OR: [
        {
          senderUserId: context.userId
        },
        {
          recipients: {
            some: {
              role: context.role
            }
          }
        }
      ]
    },
    include: {
      senderUser: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      recipients: {
        select: {
          role: true
        }
      },
      reads: {
        where: {
          userId: context.userId
        },
        take: 1
      }
    }
  });
  if (!notice) {
    throw createHttpError11(404, "Notice not found");
  }
  return {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    createdAt: notice.createdAt,
    updatedAt: notice.updatedAt,
    senderRole: notice.senderRole,
    sender: notice.senderUser,
    targetRoles: notice.recipients.map((item) => item.role),
    isRead: Boolean(notice.reads?.length),
    canEdit: notice.senderUserId === context.userId
  };
}
var listNotices = async (userId, query) => {
  const context = await resolveNoticeContext(userId);
  const normalizedSearch = normalizeSearch5(query.search);
  const notices = await noticeDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      OR: [
        {
          senderUserId: context.userId
        },
        {
          recipients: {
            some: {
              role: context.role
            }
          }
        }
      ],
      ...normalizedSearch ? {
        OR: [
          { title: { contains: normalizedSearch, mode: "insensitive" } },
          { content: { contains: normalizedSearch, mode: "insensitive" } }
        ]
      } : {}
    },
    include: {
      senderUser: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      recipients: {
        select: {
          role: true
        }
      },
      reads: {
        where: {
          userId: context.userId
        },
        take: 1
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return notices.map((notice) => ({
    id: notice.id,
    title: notice.title,
    content: notice.content,
    createdAt: notice.createdAt,
    updatedAt: notice.updatedAt,
    senderRole: notice.senderRole,
    sender: notice.senderUser,
    targetRoles: notice.recipients.map((item) => item.role),
    isRead: Boolean(notice.reads?.length),
    canEdit: notice.senderUserId === context.userId
  }));
};
var getUnreadCount = async (userId) => {
  const context = await resolveNoticeContext(userId);
  const unreadCount = await noticeDelegate().count({
    where: {
      institutionId: context.institutionId,
      recipients: {
        some: {
          role: context.role
        }
      },
      reads: {
        none: {
          userId: context.userId
        }
      }
    }
  });
  return { unreadCount };
};
var createNotice = async (userId, payload) => {
  const context = await resolveNoticeContext(userId);
  if (!SENDER_ROLES.includes(context.role)) {
    throw createHttpError11(403, "Only admin, faculty, and department can send notices");
  }
  const targetRoles = dedupeRoles(payload.targetRoles);
  const createdNotice = await noticeDelegate().create({
    data: {
      title: payload.title.trim(),
      content: payload.content.trim(),
      institutionId: context.institutionId,
      senderUserId: context.userId,
      senderRole: context.role,
      recipients: {
        create: targetRoles.map((role) => ({ role }))
      }
    }
  });
  return getNoticeByIdForViewer(context, createdNotice.id);
};
var updateNotice = async (userId, noticeId, payload) => {
  const context = await resolveNoticeContext(userId);
  const existing = await noticeDelegate().findFirst({
    where: {
      id: noticeId,
      institutionId: context.institutionId,
      senderUserId: context.userId
    },
    select: {
      id: true
    }
  });
  if (!existing) {
    throw createHttpError11(404, "Notice not found");
  }
  await noticeDelegate().update({
    where: {
      id: noticeId
    },
    data: {
      title: payload.title === void 0 ? void 0 : payload.title.trim(),
      content: payload.content === void 0 ? void 0 : payload.content.trim(),
      recipients: payload.targetRoles === void 0 ? void 0 : {
        deleteMany: {},
        create: dedupeRoles(payload.targetRoles).map((role) => ({ role }))
      }
    }
  });
  return getNoticeByIdForViewer(context, noticeId);
};
var deleteNotice = async (userId, noticeId) => {
  const context = await resolveNoticeContext(userId);
  const existing = await noticeDelegate().findFirst({
    where: {
      id: noticeId,
      institutionId: context.institutionId,
      senderUserId: context.userId
    },
    select: {
      id: true
    }
  });
  if (!existing) {
    throw createHttpError11(404, "Notice not found");
  }
  await noticeDelegate().delete({
    where: {
      id: noticeId
    }
  });
  return {
    id: noticeId
  };
};
var markNoticeAsRead = async (userId, noticeId) => {
  const context = await resolveNoticeContext(userId);
  const notice = await noticeDelegate().findFirst({
    where: {
      id: noticeId,
      institutionId: context.institutionId,
      recipients: {
        some: {
          role: context.role
        }
      }
    },
    select: {
      id: true
    }
  });
  if (!notice) {
    throw createHttpError11(404, "Notice not found");
  }
  await noticeReadDelegate().upsert({
    where: {
      noticeId_userId: {
        noticeId,
        userId: context.userId
      }
    },
    create: {
      noticeId,
      userId: context.userId,
      readAt: /* @__PURE__ */ new Date()
    },
    update: {
      readAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    id: noticeId
  };
};
var markAllNoticesAsRead = async (userId) => {
  const context = await resolveNoticeContext(userId);
  const unreadNotices = await noticeDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      recipients: {
        some: {
          role: context.role
        }
      },
      reads: {
        none: {
          userId: context.userId
        }
      }
    },
    select: {
      id: true
    }
  });
  if (!unreadNotices.length) {
    return {
      markedCount: 0
    };
  }
  await noticeReadDelegate().createMany({
    data: unreadNotices.map((item) => ({
      noticeId: item.id,
      userId: context.userId,
      readAt: /* @__PURE__ */ new Date()
    })),
    skipDuplicates: true
  });
  return {
    markedCount: unreadNotices.length
  };
};
var NoticeService = {
  listNotices,
  getUnreadCount,
  createNotice,
  updateNotice,
  deleteNotice,
  markNoticeAsRead,
  markAllNoticesAsRead
};

// src/app/module/notice/notice.controller.ts
var readParam4 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue6 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
var listNotices2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.listNotices(user.id, {
    search: readQueryValue6(req.query.search)
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notices fetched successfully",
    data: result
  });
});
var getUnreadCount2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.getUnreadCount(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Unread notice count fetched successfully",
    data: result
  });
});
var createNotice2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.createNotice(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Notice created successfully",
    data: result
  });
});
var updateNotice2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.updateNotice(user.id, readParam4(req.params.noticeId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notice updated successfully",
    data: result
  });
});
var deleteNotice2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.deleteNotice(user.id, readParam4(req.params.noticeId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notice deleted successfully",
    data: result
  });
});
var markNoticeAsRead2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.markNoticeAsRead(user.id, readParam4(req.params.noticeId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notice marked as read",
    data: result
  });
});
var markAllNoticesAsRead2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.markAllNoticesAsRead(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Notices marked as read",
    data: result
  });
});
var NoticeController = {
  listNotices: listNotices2,
  getUnreadCount: getUnreadCount2,
  createNotice: createNotice2,
  updateNotice: updateNotice2,
  deleteNotice: deleteNotice2,
  markNoticeAsRead: markNoticeAsRead2,
  markAllNoticesAsRead: markAllNoticesAsRead2
};

// src/app/module/notice/notice.validation.ts
import { z as z10 } from "zod";
var uuidSchema3 = z10.uuid("Please provide a valid id");
var noticeAudienceRoleSchema = z10.enum(["ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"]);
var listNoticesSchema = z10.object({
  query: z10.object({
    search: z10.string("search must be a string").trim().max(120).optional()
  })
});
var createNoticeSchema = z10.object({
  body: z10.object({
    title: z10.string("title is required").trim().min(2).max(180),
    content: z10.string("content is required").trim().min(2).max(5e3),
    targetRoles: z10.array(noticeAudienceRoleSchema).min(1, "Select at least one target role")
  })
});
var updateNoticeSchema = z10.object({
  params: z10.object({
    noticeId: uuidSchema3
  }),
  body: z10.object({
    title: z10.string("title must be a string").trim().min(2).max(180).optional(),
    content: z10.string("content must be a string").trim().min(2).max(5e3).optional(),
    targetRoles: z10.array(noticeAudienceRoleSchema).min(1, "Select at least one target role").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var noticeParamsSchema = z10.object({
  params: z10.object({
    noticeId: uuidSchema3
  })
});
var NoticeValidation = {
  listNoticesSchema,
  createNoticeSchema,
  updateNoticeSchema,
  noticeParamsSchema
};

// src/app/module/notice/notice.route.ts
var router10 = Router10();
router10.get(
  "/",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(NoticeValidation.listNoticesSchema),
  NoticeController.listNotices
);
router10.get(
  "/unread-count",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  NoticeController.getUnreadCount
);
router10.post(
  "/",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.createNoticeSchema),
  NoticeController.createNotice
);
router10.patch(
  "/:noticeId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.updateNoticeSchema),
  NoticeController.updateNotice
);
router10.delete(
  "/:noticeId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.noticeParamsSchema),
  NoticeController.deleteNotice
);
router10.post(
  "/:noticeId/read",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(NoticeValidation.noticeParamsSchema),
  NoticeController.markNoticeAsRead
);
router10.post(
  "/read-all",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  NoticeController.markAllNoticesAsRead
);
var NoticeRouter = router10;

// src/app/module/posting/posting.route.ts
import { Router as Router11 } from "express";

// src/app/module/posting/posting.controller.ts
var readLimit = (value) => {
  let raw3;
  if (Array.isArray(value)) {
    const first = value[0];
    raw3 = typeof first === "string" ? first : void 0;
  } else if (typeof value === "string") {
    raw3 = value;
  }
  const parsed = raw3 ? Number(raw3) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
};
var readPositiveInt = (value) => {
  const raw3 = readQueryValue7(value);
  const parsed = raw3 ? Number(raw3) : Number.NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return void 0;
  }
  return parsed;
};
var readQueryValue7 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
var readParam5 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var createTeacherJobPost2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.createTeacherJobPost(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Teacher job post created successfully",
    data: result
  });
});
var createStudentAdmissionPost2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.createStudentAdmissionPost(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Student admission post created successfully",
    data: result
  });
});
var listTeacherJobPostsPublic2 = catchAsync(async (req, res) => {
  const limit = readLimit(req.query.limit);
  const result = await PostingService.listTeacherJobPostsPublic({
    limit,
    search: readQueryValue7(req.query.search),
    location: readQueryValue7(req.query.location),
    sort: readQueryValue7(req.query.sort),
    page: readPositiveInt(req.query.page),
    pageSize: readPositiveInt(req.query.pageSize)
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher job posts fetched successfully",
    data: result
  });
});
var listStudentAdmissionPostsPublic2 = catchAsync(async (req, res) => {
  const limit = readLimit(req.query.limit);
  const result = await PostingService.listStudentAdmissionPostsPublic({
    limit,
    search: readQueryValue7(req.query.search),
    location: readQueryValue7(req.query.location),
    sort: readQueryValue7(req.query.sort),
    page: readPositiveInt(req.query.page),
    pageSize: readPositiveInt(req.query.pageSize)
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission posts fetched successfully",
    data: result
  });
});
var getPostingOptions2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.getPostingOptions(user.id, readQueryValue7(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Posting options fetched successfully",
    data: result
  });
});
var listPublicExplorePostings2 = catchAsync(async (req, res) => {
  const result = await PostingService.listPublicExplorePostings({
    type: readQueryValue7(req.query.type) === "student" ? "student" : "teacher",
    search: readQueryValue7(req.query.search),
    location: readQueryValue7(req.query.location),
    department: readQueryValue7(req.query.department),
    sort: readQueryValue7(req.query.sort),
    page: readPositiveInt(req.query.page),
    pageSize: readPositiveInt(req.query.pageSize)
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Public postings fetched successfully",
    data: result
  });
});
var getPublicPostingDetails2 = catchAsync(async (req, res) => {
  const result = await PostingService.getPublicPostingDetails(
    readParam5(req.params.postingType) === "student" ? "student" : "teacher",
    readParam5(req.params.postingId)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Public posting details fetched successfully",
    data: result
  });
});
var listTeacherJobPostsManaged2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.listTeacherJobPostsManaged(user.id, readQueryValue7(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Managed teacher job posts fetched successfully",
    data: result
  });
});
var listStudentAdmissionPostsManaged2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.listStudentAdmissionPostsManaged(user.id, readQueryValue7(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Managed student admission posts fetched successfully",
    data: result
  });
});
var updateTeacherJobPost2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.updateTeacherJobPost(user.id, readParam5(req.params.postingId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher job post updated successfully",
    data: result
  });
});
var updateStudentAdmissionPost2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.updateStudentAdmissionPost(user.id, readParam5(req.params.postingId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission post updated successfully",
    data: result
  });
});
var deleteTeacherJobPost2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.deleteTeacherJobPost(user.id, readParam5(req.params.postingId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher job post deleted successfully",
    data: result
  });
});
var deleteStudentAdmissionPost2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.deleteStudentAdmissionPost(user.id, readParam5(req.params.postingId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission post deleted successfully",
    data: result
  });
});
var PostingController = {
  createTeacherJobPost: createTeacherJobPost2,
  createStudentAdmissionPost: createStudentAdmissionPost2,
  listTeacherJobPostsPublic: listTeacherJobPostsPublic2,
  listStudentAdmissionPostsPublic: listStudentAdmissionPostsPublic2,
  getPostingOptions: getPostingOptions2,
  listPublicExplorePostings: listPublicExplorePostings2,
  getPublicPostingDetails: getPublicPostingDetails2,
  listTeacherJobPostsManaged: listTeacherJobPostsManaged2,
  listStudentAdmissionPostsManaged: listStudentAdmissionPostsManaged2,
  updateTeacherJobPost: updateTeacherJobPost2,
  updateStudentAdmissionPost: updateStudentAdmissionPost2,
  deleteTeacherJobPost: deleteTeacherJobPost2,
  deleteStudentAdmissionPost: deleteStudentAdmissionPost2
};

// src/app/module/posting/posting.validation.ts
import { z as z11 } from "zod";
var uuidSchema4 = z11.uuid("Please provide a valid id");
var createPostingSchema = z11.object({
  body: z11.object({
    title: z11.string("Title is required").trim().min(2).max(150),
    location: z11.string("Location must be a string").trim().min(2).max(150).optional(),
    summary: z11.string("Summary is required").trim().min(10).max(600),
    details: z11.array(z11.string("Detail must be a string").trim().min(2).max(300)).max(20).optional(),
    facultyId: uuidSchema4.optional(),
    departmentId: uuidSchema4.optional()
  })
});
var updatePostingSchema = z11.object({
  params: z11.object({
    postingId: uuidSchema4
  }),
  body: z11.object({
    title: z11.string("Title must be a string").trim().min(2).max(150).optional(),
    location: z11.string("Location must be a string").trim().min(2).max(150).optional(),
    summary: z11.string("Summary must be a string").trim().min(10).max(600).optional(),
    details: z11.array(z11.string("Detail must be a string").trim().min(2).max(300)).max(20).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var postingIdParamSchema = z11.object({
  params: z11.object({
    postingId: uuidSchema4
  })
});
var listManagedPostingSchema = z11.object({
  query: z11.object({
    search: z11.string("search must be a string").trim().max(120).optional()
  })
});
var listPublicPostingSchema = z11.object({
  query: z11.object({
    limit: z11.string("limit must be a number").regex(/^\d+$/, "limit must be a positive integer").optional(),
    search: z11.string("search must be a string").trim().max(120).optional(),
    location: z11.string("location must be a string").trim().max(120).optional(),
    sort: z11.enum(["newest", "oldest", "title_asc", "title_desc"]).optional(),
    page: z11.string("page must be a number").regex(/^\d+$/, "page must be a positive integer").optional(),
    pageSize: z11.string("pageSize must be a number").regex(/^\d+$/, "pageSize must be a positive integer").optional()
  })
});
var listPublicExplorePostingSchema = z11.object({
  query: z11.object({
    type: z11.enum(["teacher", "student"]),
    search: z11.string("search must be a string").trim().max(120).optional(),
    location: z11.string("location must be a string").trim().max(120).optional(),
    department: z11.string("department must be a string").trim().max(120).optional(),
    sort: z11.enum(["newest", "oldest", "title_asc", "title_desc"]).optional(),
    page: z11.string("page must be a number").regex(/^\d+$/, "page must be a positive integer").optional(),
    pageSize: z11.string("pageSize must be a number").regex(/^\d+$/, "pageSize must be a positive integer").optional()
  })
});
var publicPostingDetailsParamsSchema = z11.object({
  params: z11.object({
    postingType: z11.enum(["teacher", "student"]),
    postingId: uuidSchema4
  })
});
var PostingValidation = {
  createPostingSchema,
  updatePostingSchema,
  postingIdParamSchema,
  listPublicPostingSchema,
  listManagedPostingSchema,
  listPublicExplorePostingSchema,
  publicPostingDetailsParamsSchema
};

// src/app/module/posting/posting.route.ts
var router11 = Router11();
router11.get(
  "/public/explore",
  validateRequest(PostingValidation.listPublicExplorePostingSchema),
  PostingController.listPublicExplorePostings
);
router11.get(
  "/public/:postingType/:postingId",
  validateRequest(PostingValidation.publicPostingDetailsParamsSchema),
  PostingController.getPublicPostingDetails
);
router11.get(
  "/teacher/public",
  validateRequest(PostingValidation.listPublicPostingSchema),
  PostingController.listTeacherJobPostsPublic
);
router11.get(
  "/student/public",
  validateRequest(PostingValidation.listPublicPostingSchema),
  PostingController.listStudentAdmissionPostsPublic
);
router11.get(
  "/options",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  PostingController.getPostingOptions
);
router11.get(
  "/teacher/manage",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.listManagedPostingSchema),
  PostingController.listTeacherJobPostsManaged
);
router11.get(
  "/student/manage",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.listManagedPostingSchema),
  PostingController.listStudentAdmissionPostsManaged
);
router11.post(
  "/teacher",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.createPostingSchema),
  PostingController.createTeacherJobPost
);
router11.post(
  "/student",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.createPostingSchema),
  PostingController.createStudentAdmissionPost
);
router11.patch(
  "/teacher/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.updatePostingSchema),
  PostingController.updateTeacherJobPost
);
router11.patch(
  "/student/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.updatePostingSchema),
  PostingController.updateStudentAdmissionPost
);
router11.delete(
  "/teacher/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.postingIdParamSchema),
  PostingController.deleteTeacherJobPost
);
router11.delete(
  "/student/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.postingIdParamSchema),
  PostingController.deleteStudentAdmissionPost
);
var PostingRouter = router11;

// src/app/module/routine/routine.route.ts
import { Router as Router12 } from "express";

// src/app/module/routine/routine.service.ts
function createHttpError12(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch6(search) {
  const value = search?.trim();
  return value || void 0;
}
async function resolveInstitutionId(userId) {
  const [adminProfile, teacherProfile, studentProfile] = await Promise.all([
    prisma.adminProfile.findUnique({
      where: { userId },
      select: { institutionId: true }
    }),
    prisma.teacherProfile.findFirst({
      where: { userId },
      select: { institutionId: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.studentProfile.findFirst({
      where: { userId },
      select: { institutionId: true },
      orderBy: { createdAt: "desc" }
    })
  ]);
  const institutionId = adminProfile?.institutionId ?? teacherProfile?.institutionId ?? studentProfile?.institutionId;
  if (!institutionId) {
    throw createHttpError12(403, "No institution context found for this account");
  }
  return institutionId;
}
var listRoutines3 = async (userId, query) => {
  const institutionId = await resolveInstitutionId(userId);
  const normalizedSearch = normalizeSearch6(query.search);
  const normalizedTeacherInitial = query.teacherInitial?.trim();
  const courseRegistrationFilter = {};
  if (query.sectionId) {
    courseRegistrationFilter.sectionId = query.sectionId;
  }
  if (normalizedTeacherInitial) {
    courseRegistrationFilter.teacherProfile = {
      teacherInitial: {
        contains: normalizedTeacherInitial,
        mode: "insensitive"
      }
    };
  }
  return prisma.routine.findMany({
    where: {
      institutionId,
      ...query.semesterId ? {
        schedule: {
          semesterId: query.semesterId
        }
      } : {},
      ...Object.keys(courseRegistrationFilter).length > 0 ? {
        courseRegistration: courseRegistrationFilter
      } : {},
      ...normalizedSearch ? {
        OR: [
          { name: { contains: normalizedSearch, mode: "insensitive" } },
          { description: { contains: normalizedSearch, mode: "insensitive" } },
          { classRoom: { roomNo: { contains: normalizedSearch, mode: "insensitive" } } },
          { classRoom: { name: { contains: normalizedSearch, mode: "insensitive" } } },
          { courseRegistration: { section: { name: { contains: normalizedSearch, mode: "insensitive" } } } },
          { courseRegistration: { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } } },
          { courseRegistration: { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } } },
          { courseRegistration: { teacherProfile: { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } } } },
          { schedule: { name: { contains: normalizedSearch, mode: "insensitive" } } }
        ]
      } : {}
    },
    include: {
      schedule: true,
      classRoom: true,
      courseRegistration: {
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              courseTitle: true
            }
          },
          section: {
            select: {
              id: true,
              name: true,
              batch: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          },
          teacherProfile: {
            select: {
              id: true,
              teacherInitial: true,
              teachersId: true,
              designation: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: [{ schedule: { startTime: "asc" } }, { createdAt: "desc" }]
  });
};
var RoutineService = {
  listRoutines: listRoutines3
};

// src/app/module/routine/routine.controller.ts
var listRoutines4 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await RoutineService.listRoutines(user.id, {
    sectionId: typeof req.query.sectionId === "string" ? req.query.sectionId : void 0,
    semesterId: typeof req.query.semesterId === "string" ? req.query.semesterId : void 0,
    teacherInitial: typeof req.query.teacherInitial === "string" ? req.query.teacherInitial : void 0,
    search: typeof req.query.search === "string" ? req.query.search : void 0
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Routine list fetched successfully",
    data: result
  });
});
var RoutineController = {
  listRoutines: listRoutines4
};

// src/app/module/routine/routine.validation.ts
import { z as z12 } from "zod";
var uuidSchema5 = z12.uuid("Please provide a valid id");
var RoutineValidation = {
  listRoutinesSchema: z12.object({
    query: z12.object({
      sectionId: uuidSchema5.optional(),
      semesterId: uuidSchema5.optional(),
      teacherInitial: z12.string("teacherInitial must be a string").trim().min(1).max(40).optional(),
      search: z12.string("search must be a string").trim().max(120).optional()
    })
  })
};

// src/app/module/routine/routine.route.ts
var router12 = Router12();
router12.get(
  "/",
  requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(RoutineValidation.listRoutinesSchema),
  RoutineController.listRoutines
);
var RoutineRouter = router12;

// src/app/module/student/student.route.ts
import { Router as Router13 } from "express";

// src/app/module/student/student.service.ts
var LAB_MARKS_MAX = {
  attendance: 10
};
var THEORY_MARKS_MAX = {
  attendance: 7
};
function createHttpError13(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch7(search) {
  const value = search?.trim();
  return value || void 0;
}
function toMoneyNumber4(value) {
  const numericValue = Number(value ?? 0);
  return Number(numericValue.toFixed(2));
}
function toSafeUpper3(value, fallbackValue) {
  const normalized = value?.trim().toUpperCase();
  return normalized || fallbackValue;
}
function areMoneyValuesEqual3(left, right) {
  return Math.abs(toMoneyNumber4(left) - toMoneyNumber4(right)) < 0.01;
}
function createTransactionId() {
  const randomSuffix = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `BIDDY-${Date.now()}-${randomSuffix}`;
}
function getBackendPublicUrl() {
  return process.env.BACKEND_PUBLIC_URL?.trim().replace(/\/$/, "") || "http://localhost:5000";
}
function getFrontendPublicUrl() {
  return process.env.FRONTEND_PUBLIC_URL?.trim().replace(/\/$/, "") || "http://localhost:3000";
}
function getGlobalSslCommerzCredentials() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  const baseUrl = process.env.SSLCOMMERZ_BASE_URL?.trim().replace(/\/$/, "");
  if (!storeId || !storePassword || !baseUrl) {
    throw createHttpError13(
      500,
      "SSLCommerz credentials are not configured. Set SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_PASSWORD and SSLCOMMERZ_BASE_URL."
    );
  }
  return {
    storeId,
    storePassword,
    baseUrl
  };
}
async function resolveSslCommerzConfigForInstitution(institutionId) {
  const configured = await prisma.institutionPaymentGatewayCredential.findUnique({
    where: {
      institutionId
    },
    select: {
      sslCommerzStoreIdEncrypted: true,
      sslCommerzStorePasswordEncrypted: true,
      sslCommerzBaseUrlEncrypted: true,
      isActive: true
    }
  });
  if (configured?.isActive) {
    return {
      storeId: decryptCredentialValue(configured.sslCommerzStoreIdEncrypted),
      storePassword: decryptCredentialValue(configured.sslCommerzStorePasswordEncrypted),
      baseUrl: decryptCredentialValue(configured.sslCommerzBaseUrlEncrypted).replace(/\/$/, "")
    };
  }
  return getGlobalSslCommerzCredentials();
}
function normalizeCallbackQuery3(query) {
  const readValue = (value) => {
    if (Array.isArray(value)) {
      return typeof value[0] === "string" ? value[0] : void 0;
    }
    return typeof value === "string" ? value : void 0;
  };
  return {
    tran_id: readValue(query.tran_id),
    val_id: readValue(query.val_id),
    amount: readValue(query.amount),
    currency: readValue(query.currency),
    status: readValue(query.status)
  };
}
function buildFeeRedirectUrl(status, tranId) {
  const frontendBase = getFrontendPublicUrl();
  const searchParams = new URLSearchParams({
    paymentStatus: status
  });
  if (tranId) {
    searchParams.set("tranId", tranId);
  }
  return `${frontendBase}/fees?${searchParams.toString()}`;
}
function isLabCourse(courseTitle) {
  const normalized = courseTitle.toLowerCase();
  return normalized.includes("lab") || normalized.includes("laboratory");
}
function toTwoDecimals(value) {
  return Number(value.toFixed(2));
}
function studentSubmissionDelegate() {
  return prisma.studentClassworkSubmission;
}
function studentApplicationProfileDelegate() {
  return prisma.studentApplicationProfile;
}
function studentAdmissionApplicationDelegate() {
  return prisma.studentAdmissionApplication;
}
function feeConfigurationDelegate() {
  return prisma.departmentSemesterFeeConfiguration;
}
function feePaymentDelegate() {
  return prisma.studentFeePayment;
}
var FEE_PAYMENT_MODE_MONTHLY = "MONTHLY";
var FEE_PAYMENT_STATUS_INITIATED = "INITIATED";
var FEE_PAYMENT_STATUS_PENDING = "PENDING";
var FEE_PAYMENT_STATUS_SUCCESS2 = "SUCCESS";
var FEE_PAYMENT_STATUS_FAILED = "FAILED";
var FEE_PAYMENT_STATUS_CANCELLED = "CANCELLED";
function toJsonInputValue(value) {
  if (value === null || value === void 0) {
    return [];
  }
  return value;
}
function hasValidStudentAcademicRecords(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return false;
  }
  return records.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const value = item;
    const year = Number(value.year);
    return typeof value.examName === "string" && value.examName.trim().length >= 2 && typeof value.institute === "string" && value.institute.trim().length >= 2 && typeof value.result === "string" && value.result.trim().length >= 1 && Number.isFinite(year) && year >= 1950 && year <= 2100;
  });
}
function computeStudentApplicationProfileCompleteness(input) {
  const hasDocuments = Array.isArray(input.documentUrls) && input.documentUrls.some((item) => typeof item === "string" && item.trim().length > 0);
  return input.headline.trim().length >= 2 && input.about.trim().length >= 20 && hasDocuments && hasValidStudentAcademicRecords(input.academicRecords);
}
async function resolveStudentContext(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      accountStatus: true,
      contactNo: true,
      presentAddress: true,
      permanentAddress: true,
      bloodGroup: true,
      gender: true
    }
  });
  if (!user) {
    throw createHttpError13(404, "Student account not found");
  }
  const profile = await prisma.studentProfile.findFirst({
    where: {
      userId
    },
    include: {
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true
        }
      },
      department: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return {
    user,
    profile
  };
}
async function resolveStudentInstitutionContext(userId) {
  const context = await resolveStudentContext(userId);
  if (!context.profile?.institutionId) {
    throw createHttpError13(403, "Student is not assigned to any institution yet");
  }
  return {
    user: context.user,
    profile: context.profile
  };
}
var getProfileOverview = async (userId) => {
  const context = await resolveStudentContext(userId);
  const profile = context.profile;
  const applicationProfile = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId
    }
  });
  const applications = await studentAdmissionApplicationDelegate().findMany({
    where: {
      studentUserId: userId
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
          institutionId: true,
          summary: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const institutionIds = Array.from(
    new Set(applications.map((item) => item.posting?.institutionId).filter(Boolean))
  );
  const institutions = institutionIds.length ? await prisma.institution.findMany({
    where: {
      id: {
        in: institutionIds
      }
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      institutionLogo: true
    }
  }) : [];
  const institutionMap = new Map(institutions.map((item) => [item.id, item]));
  const totalRegisteredCourses = profile?.institutionId ? await prisma.courseRegistration.count({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId
    }
  }) : 0;
  const pendingTimelineItems = profile?.institutionId ? await prisma.teacherClasswork.count({
    where: {
      institutionId: profile.institutionId,
      section: {
        courseRegistrations: {
          some: {
            studentProfileId: profile.id
          }
        }
      },
      dueAt: {
        gte: /* @__PURE__ */ new Date()
      }
    }
  }) : 0;
  return {
    hasInstitution: Boolean(profile?.institutionId),
    user: context.user,
    profile: profile ? {
      id: profile.id,
      studentsId: profile.studentsId,
      bio: profile.bio,
      institution: profile.institution,
      department: profile.department
    } : null,
    applicationProfile,
    applications: applications.map((item) => {
      const institution = item.posting?.institutionId ? institutionMap.get(item.posting.institutionId) : null;
      return {
        id: item.id,
        coverLetter: item.coverLetter,
        status: item.status,
        institutionResponse: item.institutionResponse,
        reviewedAt: item.reviewedAt,
        appliedAt: item.appliedAt,
        createdAt: item.createdAt,
        posting: {
          id: item.posting.id,
          title: item.posting.title,
          location: item.posting.location,
          summary: item.posting.summary
        },
        institution: institution ? {
          id: institution.id,
          name: institution.name,
          shortName: institution.shortName,
          institutionLogo: institution.institutionLogo
        } : null
      };
    }),
    stats: {
      totalRegisteredCourses,
      pendingTimelineItems
    }
  };
};
var updateProfile3 = async (userId, payload) => {
  const context = await resolveStudentContext(userId);
  const nextName = payload.name?.trim();
  return prisma.$transaction(async (trx) => {
    if (nextName) {
      await trx.user.update({
        where: { id: userId },
        data: {
          name: nextName
        }
      });
    }
    await trx.user.update({
      where: { id: userId },
      data: {
        image: payload.image === void 0 ? void 0 : payload.image.trim() || null,
        contactNo: payload.contactNo === void 0 ? void 0 : payload.contactNo.trim() || null,
        presentAddress: payload.presentAddress === void 0 ? void 0 : payload.presentAddress.trim() || null,
        permanentAddress: payload.permanentAddress === void 0 ? void 0 : payload.permanentAddress.trim() || null,
        bloodGroup: payload.bloodGroup === void 0 ? void 0 : payload.bloodGroup.trim() || null,
        gender: payload.gender === void 0 ? void 0 : payload.gender.trim() || null
      }
    });
    if (context.profile) {
      await trx.studentProfile.update({
        where: {
          id: context.profile.id
        },
        data: {
          bio: payload.bio === void 0 ? void 0 : payload.bio.trim() || null
        }
      });
    }
    return getProfileOverview(userId);
  });
};
var listTimeline = async (userId, query) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const normalizedSearch = normalizeSearch7(query.search);
  const registrations = await prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
      semesterId: query.semesterId
    },
    select: {
      sectionId: true,
      section: {
        select: {
          id: true,
          name: true,
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          },
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      }
    }
  });
  const sectionIds = Array.from(new Set(registrations.map((item) => item.sectionId)));
  if (sectionIds.length === 0) {
    return [];
  }
  const classworks = await prisma.teacherClasswork.findMany({
    where: {
      institutionId: profile.institutionId,
      sectionId: {
        in: sectionIds
      },
      type: query.type,
      ...normalizedSearch ? {
        OR: [
          { title: { contains: normalizedSearch, mode: "insensitive" } },
          { content: { contains: normalizedSearch, mode: "insensitive" } },
          { section: { name: { contains: normalizedSearch, mode: "insensitive" } } }
        ]
      } : {}
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          }
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      submissions: {
        where: {
          studentProfileId: profile.id
        },
        take: 1
      }
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }]
  });
  const sectionCourseMap = /* @__PURE__ */ new Map();
  for (const registration of registrations) {
    const key = registration.sectionId;
    const list = sectionCourseMap.get(key) ?? [];
    const exists = list.some((item) => item.id === registration.course.id);
    if (!exists) {
      list.push(registration.course);
      sectionCourseMap.set(key, list);
    }
  }
  return classworks.map((item) => {
    const submission = item.submissions?.[0] ?? null;
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      type: item.type,
      dueAt: item.dueAt,
      createdAt: item.createdAt,
      section: item.section,
      courses: sectionCourseMap.get(item.sectionId) ?? [],
      teacher: item.teacherProfile,
      submission: submission ? {
        id: submission.id,
        responseText: submission.responseText,
        attachmentUrl: submission.attachmentUrl,
        attachmentName: submission.attachmentName,
        submittedAt: submission.submittedAt,
        updatedAt: submission.updatedAt
      } : null
    };
  });
};
var listRegisteredCourses = async (userId, query) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const normalizedSearch = normalizeSearch7(query.search);
  return prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
      semesterId: query.semesterId,
      ...normalizedSearch ? {
        OR: [
          { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } },
          { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } },
          { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
          { semester: { name: { contains: normalizedSearch, mode: "insensitive" } } },
          { teacherProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } }
        ]
      } : {}
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
          credits: true
        }
      },
      section: {
        select: {
          id: true,
          name: true,
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: [
      {
        semester: {
          startDate: "desc"
        }
      },
      {
        createdAt: "desc"
      }
    ]
  });
};
var listRoutines5 = async (userId) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const registrations = await prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId
    },
    select: {
      id: true,
      sectionId: true
    }
  });
  const sectionIds = Array.from(new Set(registrations.map((item) => item.sectionId)));
  if (sectionIds.length === 0) {
    return [];
  }
  return prisma.routine.findMany({
    where: {
      institutionId: profile.institutionId,
      courseRegistration: {
        sectionId: {
          in: sectionIds
        }
      }
    },
    include: {
      schedule: true,
      classRoom: true,
      courseRegistration: {
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              courseTitle: true
            }
          },
          section: {
            select: {
              id: true,
              name: true,
              batch: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          },
          teacherProfile: {
            select: {
              id: true,
              teacherInitial: true,
              teachersId: true,
              designation: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: [{ schedule: { startTime: "asc" } }, { createdAt: "desc" }]
  });
};
var listResults = async (userId, query) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const rows = await prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
      semesterId: query.semesterId
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      },
      attendances: {
        select: {
          status: true
        }
      },
      mark: true,
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  if (rows.length === 0) {
    return {
      semesterId: query.semesterId,
      summary: {
        totalCourses: 0,
        averageAttendancePercentage: 0,
        averageResult: 0
      },
      items: []
    };
  }
  const items = rows.map((registration) => {
    const labCourse = isLabCourse(registration.course.courseTitle);
    const totalAttendance = registration.attendances.length;
    const presentCount = registration.attendances.filter(
      (item) => item.status === AttendanceStatus.PRESENT
    ).length;
    const attendancePercentage = totalAttendance > 0 ? presentCount / totalAttendance * 100 : 0;
    const attendanceMax = labCourse ? LAB_MARKS_MAX.attendance : THEORY_MARKS_MAX.attendance;
    const attendanceMark = toTwoDecimals(attendancePercentage / 100 * attendanceMax);
    let totalMark = attendanceMark;
    if (labCourse) {
      totalMark += (registration.mark?.labReport ?? 0) + (registration.mark?.labTask ?? 0) + (registration.mark?.project ?? 0) + (registration.mark?.projectReport ?? 0) + (registration.mark?.presentation ?? 0) + (registration.mark?.labEvaluation ?? 0) + (registration.mark?.viva ?? 0);
    } else {
      const quizzes = [registration.mark?.quiz1, registration.mark?.quiz2, registration.mark?.quiz3].filter(
        (item) => typeof item === "number"
      );
      const quizAverage = quizzes.length > 0 ? toTwoDecimals(quizzes.reduce((sum, value) => sum + value, 0) / quizzes.length) : 0;
      totalMark += quizAverage + (registration.mark?.presentation ?? 0) + (registration.mark?.assignment ?? 0) + (registration.mark?.midterm ?? 0) + (registration.mark?.finalExam ?? 0);
    }
    return {
      courseRegistrationId: registration.id,
      course: registration.course,
      semester: registration.semester,
      teacher: registration.teacherProfile,
      attendance: {
        percentage: toTwoDecimals(attendancePercentage),
        presentClasses: presentCount,
        totalClasses: totalAttendance
      },
      marks: registration.mark,
      totalMark: toTwoDecimals(totalMark),
      maxTotal: 100
    };
  });
  const totalCourses = items.length;
  const averageAttendancePercentage = items.reduce((sum, item) => sum + item.attendance.percentage, 0) / totalCourses;
  const averageResult = items.reduce((sum, item) => sum + item.totalMark, 0) / totalCourses;
  return {
    semesterId: query.semesterId,
    summary: {
      totalCourses,
      averageAttendancePercentage: toTwoDecimals(averageAttendancePercentage),
      averageResult: toTwoDecimals(averageResult)
    },
    items
  };
};
var hasSectionAccessForClasswork = async (studentProfileId, institutionId, classworkId) => {
  const classwork = await prisma.teacherClasswork.findUnique({
    where: {
      id: classworkId
    },
    select: {
      id: true,
      sectionId: true,
      departmentId: true,
      institutionId: true,
      section: {
        select: {
          id: true,
          name: true,
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          }
        }
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
  if (classwork?.institutionId !== institutionId) {
    throw createHttpError13(404, "Classwork not found");
  }
  const registration = await prisma.courseRegistration.findFirst({
    where: {
      studentProfileId,
      institutionId,
      sectionId: classwork.sectionId
    },
    select: {
      id: true,
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      }
    }
  });
  if (!registration) {
    throw createHttpError13(403, "You are not registered in this classwork section");
  }
  return {
    classwork,
    registration
  };
};
var listSubmissions = async (userId, query) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const normalizedSearch = normalizeSearch7(query.search);
  const semesterSectionIds = query.semesterId ? (await prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
      semesterId: query.semesterId
    },
    select: {
      sectionId: true
    }
  })).map((item) => item.sectionId) : void 0;
  return studentSubmissionDelegate().findMany({
    where: {
      studentProfileId: profile.id,
      classworkId: query.classworkId,
      classwork: {
        sectionId: semesterSectionIds ? { in: semesterSectionIds } : void 0,
        ...normalizedSearch ? {
          OR: [
            { title: { contains: normalizedSearch, mode: "insensitive" } },
            { content: { contains: normalizedSearch, mode: "insensitive" } },
            { section: { name: { contains: normalizedSearch, mode: "insensitive" } } }
          ]
        } : {}
      }
    },
    include: {
      classwork: {
        select: {
          id: true,
          title: true,
          type: true,
          dueAt: true,
          section: {
            select: {
              id: true,
              name: true,
              semester: {
                select: {
                  id: true,
                  name: true,
                  startDate: true,
                  endDate: true
                }
              }
            }
          },
          teacherProfile: {
            select: {
              id: true,
              teacherInitial: true,
              designation: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
};
var createSubmission = async (userId, payload) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const { classwork } = await hasSectionAccessForClasswork(
    profile.id,
    profile.institutionId,
    payload.classworkId
  );
  const existing = await studentSubmissionDelegate().findUnique({
    where: {
      classworkId_studentProfileId: {
        classworkId: payload.classworkId,
        studentProfileId: profile.id
      }
    },
    select: {
      id: true
    }
  });
  if (existing) {
    throw createHttpError13(409, "Submission already exists. Please update it.");
  }
  return studentSubmissionDelegate().create({
    data: {
      classworkId: payload.classworkId,
      studentProfileId: profile.id,
      responseText: payload.responseText?.trim() || null,
      attachmentUrl: payload.attachmentUrl?.trim() || null,
      attachmentName: payload.attachmentName?.trim() || null,
      institutionId: profile.institutionId,
      departmentId: classwork.departmentId,
      submittedAt: /* @__PURE__ */ new Date()
    },
    include: {
      classwork: {
        select: {
          id: true,
          title: true,
          type: true,
          dueAt: true
        }
      }
    }
  });
};
var updateSubmission = async (userId, submissionId, payload) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const existing = await studentSubmissionDelegate().findFirst({
    where: {
      id: submissionId,
      studentProfileId: profile.id,
      institutionId: profile.institutionId
    },
    select: {
      id: true,
      classworkId: true
    }
  });
  if (!existing) {
    throw createHttpError13(404, "Submission not found");
  }
  await hasSectionAccessForClasswork(profile.id, profile.institutionId, existing.classworkId);
  return studentSubmissionDelegate().update({
    where: {
      id: submissionId
    },
    data: {
      responseText: payload.responseText === void 0 ? void 0 : payload.responseText.trim() || null,
      attachmentUrl: payload.attachmentUrl === void 0 ? void 0 : payload.attachmentUrl.trim() || null,
      attachmentName: payload.attachmentName === void 0 ? void 0 : payload.attachmentName.trim() || null,
      submittedAt: /* @__PURE__ */ new Date()
    },
    include: {
      classwork: {
        select: {
          id: true,
          title: true,
          type: true,
          dueAt: true
        }
      }
    }
  });
};
var deleteSubmission = async (userId, submissionId) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const existing = await studentSubmissionDelegate().findFirst({
    where: {
      id: submissionId,
      studentProfileId: profile.id,
      institutionId: profile.institutionId
    },
    select: {
      id: true
    }
  });
  if (!existing) {
    throw createHttpError13(404, "Submission not found");
  }
  await studentSubmissionDelegate().delete({
    where: {
      id: submissionId
    }
  });
  return {
    id: submissionId
  };
};
var getApplicationProfile = async (userId) => {
  return studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId
    }
  });
};
var createApplicationProfile = async (userId, payload) => {
  const existing = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId
    },
    select: {
      id: true
    }
  });
  if (existing) {
    throw createHttpError13(409, "Application profile already exists. Use update instead.");
  }
  const normalized = {
    headline: payload.headline.trim(),
    about: payload.about.trim(),
    documentUrls: payload.documentUrls.map((item) => item.trim()).filter(Boolean),
    academicRecords: toJsonInputValue(payload.academicRecords)
  };
  return studentApplicationProfileDelegate().create({
    data: {
      studentUserId: userId,
      ...normalized,
      isComplete: computeStudentApplicationProfileCompleteness(normalized)
    }
  });
};
var updateApplicationProfile = async (userId, payload) => {
  const existing = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId
    }
  });
  if (!existing) {
    throw createHttpError13(404, "Application profile not found");
  }
  const next = {
    headline: payload.headline?.trim() ?? existing.headline,
    about: payload.about?.trim() ?? existing.about,
    documentUrls: payload.documentUrls === void 0 ? existing.documentUrls : payload.documentUrls.map((item) => item.trim()).filter(Boolean),
    academicRecords: toJsonInputValue(payload.academicRecords ?? existing.academicRecords)
  };
  return studentApplicationProfileDelegate().update({
    where: {
      studentUserId: userId
    },
    data: {
      ...next,
      isComplete: computeStudentApplicationProfileCompleteness(next)
    }
  });
};
var deleteApplicationProfile = async (userId) => {
  const existing = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId
    },
    select: {
      id: true
    }
  });
  if (!existing) {
    throw createHttpError13(404, "Application profile not found");
  }
  await studentApplicationProfileDelegate().delete({
    where: {
      studentUserId: userId
    }
  });
  return {
    id: existing.id
  };
};
var applyToAdmissionPosting = async (userId, postingId, payload) => {
  const context = await resolveStudentContext(userId);
  const applicationProfile = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId
    },
    select: {
      id: true,
      isComplete: true
    }
  });
  if (!applicationProfile?.isComplete) {
    throw createHttpError13(
      400,
      "Complete your application profile and upload required documents before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError13(400, "You are already assigned to an institution");
  }
  const posting = await prisma.studentAdmissionPost.findUnique({
    where: {
      id: postingId
    },
    select: {
      id: true,
      title: true,
      location: true
    }
  });
  if (!posting) {
    throw createHttpError13(404, "Student admission posting not found");
  }
  const existing = await studentAdmissionApplicationDelegate().findFirst({
    where: {
      postingId,
      studentUserId: userId
    },
    select: {
      id: true
    }
  });
  if (existing) {
    throw createHttpError13(409, "You already applied to this admission post");
  }
  return studentAdmissionApplicationDelegate().create({
    data: {
      postingId,
      studentUserId: userId,
      studentProfileId: context.profile?.id,
      coverLetter: payload.coverLetter?.trim() || null,
      status: "PENDING"
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true
        }
      }
    }
  });
};
var listMyAdmissionApplications = async (userId) => {
  return studentAdmissionApplicationDelegate().findMany({
    where: {
      studentUserId: userId
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
          summary: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getFeeOverview = async (userId) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  if (!profile.departmentId) {
    throw createHttpError13(403, "Student is not assigned to a department yet");
  }
  const feeConfigurations = await feeConfigurationDelegate().findMany({
    where: {
      institutionId: profile.institutionId,
      departmentId: profile.departmentId,
      isActive: true
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    },
    orderBy: {
      semester: {
        startDate: "desc"
      }
    }
  });
  const successfulPayments = await feePaymentDelegate().findMany({
    where: {
      studentProfileId: profile.id,
      status: FEE_PAYMENT_STATUS_SUCCESS2
    },
    select: {
      id: true,
      semesterId: true,
      amount: true,
      monthsCovered: true,
      paymentMode: true,
      currency: true,
      tranId: true,
      paidAt: true,
      createdAt: true,
      gatewayCardType: true,
      gatewayBankTranId: true,
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const paidBySemester = /* @__PURE__ */ new Map();
  for (const payment of successfulPayments) {
    paidBySemester.set(
      payment.semesterId,
      toMoneyNumber4((paidBySemester.get(payment.semesterId) ?? 0) + toMoneyNumber4(payment.amount))
    );
  }
  const feeItems = feeConfigurations.map((configuration) => {
    const totalFeeAmount = toMoneyNumber4(configuration.totalFeeAmount);
    const monthlyFeeAmount = toMoneyNumber4(configuration.monthlyFeeAmount);
    const paidAmount = toMoneyNumber4(paidBySemester.get(configuration.semesterId) ?? 0);
    const dueAmount = Math.max(0, toMoneyNumber4(totalFeeAmount - paidAmount));
    return {
      feeConfigurationId: configuration.id,
      semester: configuration.semester,
      totalFeeAmount,
      monthlyFeeAmount,
      paidAmount,
      dueAmount,
      currency: configuration.currency
    };
  });
  const totalConfiguredAmount = feeItems.reduce(
    (sum, item) => sum + item.totalFeeAmount,
    0
  );
  const totalPaidAmount = feeItems.reduce(
    (sum, item) => sum + item.paidAmount,
    0
  );
  return {
    summary: {
      totalConfiguredAmount: toMoneyNumber4(totalConfiguredAmount),
      totalPaidAmount: toMoneyNumber4(totalPaidAmount),
      totalDueAmount: toMoneyNumber4(Math.max(0, totalConfiguredAmount - totalPaidAmount))
    },
    feeItems,
    paymentHistory: successfulPayments.map((payment) => ({
      ...payment,
      amount: toMoneyNumber4(payment.amount)
    }))
  };
};
var initiateFeePayment = async (userId, payload) => {
  const { profile, user } = await resolveStudentInstitutionContext(userId);
  if (!profile.departmentId) {
    throw createHttpError13(403, "Student is not assigned to a department yet");
  }
  const feeConfiguration = await feeConfigurationDelegate().findFirst({
    where: {
      institutionId: profile.institutionId,
      departmentId: profile.departmentId,
      semesterId: payload.semesterId,
      isActive: true
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true
        }
      }
    }
  });
  if (!feeConfiguration) {
    throw createHttpError13(404, "No fee configuration found for the selected semester/session");
  }
  const successfulPayments = await feePaymentDelegate().findMany({
    where: {
      studentProfileId: profile.id,
      semesterId: payload.semesterId,
      status: FEE_PAYMENT_STATUS_SUCCESS2
    },
    select: {
      amount: true
    }
  });
  const totalFeeAmount = toMoneyNumber4(feeConfiguration.totalFeeAmount);
  const monthlyFeeAmount = toMoneyNumber4(feeConfiguration.monthlyFeeAmount);
  const paidAmount = toMoneyNumber4(
    successfulPayments.reduce((sum, item) => sum + toMoneyNumber4(item.amount), 0)
  );
  const dueAmount = toMoneyNumber4(Math.max(0, totalFeeAmount - paidAmount));
  if (dueAmount <= 0) {
    throw createHttpError13(409, "No due amount left for this semester/session");
  }
  const mode = payload.paymentMode;
  let requestedAmount = dueAmount;
  let monthsCovered = 0;
  if (mode === FEE_PAYMENT_MODE_MONTHLY) {
    const monthsCount = payload.monthsCount ?? 0;
    if (!monthsCount || monthsCount < 1) {
      throw createHttpError13(400, "monthsCount must be at least 1 for monthly payment");
    }
    requestedAmount = toMoneyNumber4(Math.min(dueAmount, monthlyFeeAmount * monthsCount));
    monthsCovered = monthsCount;
  } else {
    monthsCovered = Math.max(1, Math.ceil(dueAmount / Math.max(monthlyFeeAmount, 1)));
  }
  if (requestedAmount <= 0) {
    throw createHttpError13(400, "Invalid payment amount");
  }
  const transactionId = createTransactionId();
  const backendBaseUrl = getBackendPublicUrl();
  const { storeId, storePassword, baseUrl: sslCommerzBaseUrl } = await resolveSslCommerzConfigForInstitution(profile.institutionId);
  const currency = toSafeUpper3(feeConfiguration.currency, "BDT");
  const createdPayment = await feePaymentDelegate().create({
    data: {
      institutionId: profile.institutionId,
      departmentId: profile.departmentId,
      semesterId: payload.semesterId,
      studentProfileId: profile.id,
      feeConfigurationId: feeConfiguration.id,
      paymentMode: mode,
      status: FEE_PAYMENT_STATUS_INITIATED,
      monthsCovered,
      amount: requestedAmount,
      currency,
      tranId: transactionId,
      paymentInitiatedAt: /* @__PURE__ */ new Date()
    }
  });
  const requestBody = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: requestedAmount.toFixed(2),
    currency,
    tran_id: transactionId,
    success_url: `${backendBaseUrl}/api/v1/student/fees/payment/success`,
    fail_url: `${backendBaseUrl}/api/v1/student/fees/payment/fail`,
    cancel_url: `${backendBaseUrl}/api/v1/student/fees/payment/cancel`,
    ipn_url: `${backendBaseUrl}/api/v1/student/fees/payment/fail`,
    shipping_method: "NO",
    product_name: `Semester Fee - ${feeConfiguration.semester.name}`,
    product_category: "Education",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.presentAddress?.trim() || "N/A",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: user.contactNo?.trim() || "01700000000",
    value_a: createdPayment.id,
    value_b: profile.id,
    value_c: payload.semesterId
  });
  const response = await fetch(`${sslCommerzBaseUrl}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: requestBody.toString()
  });
  const gatewayResponse = await response.json().catch(() => null);
  const gatewayPageUrl = gatewayResponse?.GatewayPageURL;
  const gatewayStatus = gatewayResponse?.status?.toUpperCase();
  if (!response.ok || !gatewayPageUrl || gatewayStatus !== "SUCCESS") {
    await feePaymentDelegate().update({
      where: {
        id: createdPayment.id
      },
      data: {
        status: FEE_PAYMENT_STATUS_FAILED,
        gatewayStatus: gatewayResponse?.status ?? "FAILED",
        gatewayRawPayload: gatewayResponse ?? { httpStatus: response.status }
      }
    });
    const failureMessage = gatewayResponse?.failedreason?.trim() || gatewayResponse?.status?.trim() || "Unable to initialize SSLCommerz payment session";
    throw createHttpError13(502, failureMessage);
  }
  await feePaymentDelegate().update({
    where: {
      id: createdPayment.id
    },
    data: {
      status: FEE_PAYMENT_STATUS_PENDING,
      gatewayStatus: gatewayResponse?.status,
      gatewaySessionKey: gatewayResponse?.sessionkey || null,
      gatewayRawPayload: gatewayResponse
    }
  });
  return {
    paymentId: createdPayment.id,
    tranId: transactionId,
    paymentUrl: gatewayPageUrl,
    amount: requestedAmount,
    currency,
    paymentMode: mode,
    monthsCovered
  };
};
var handleFeeGatewayCallback = async (callbackType, rawQuery) => {
  const query = normalizeCallbackQuery3(rawQuery);
  const transactionId = query.tran_id?.trim();
  if (!transactionId) {
    return {
      redirectUrl: buildFeeRedirectUrl("failed")
    };
  }
  const payment = await feePaymentDelegate().findUnique({
    where: {
      tranId: transactionId
    },
    include: {
      feeConfiguration: {
        select: {
          id: true,
          totalFeeAmount: true
        }
      }
    }
  });
  if (!payment) {
    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId)
    };
  }
  if (callbackType === "cancelled") {
    if (payment.status !== FEE_PAYMENT_STATUS_SUCCESS2) {
      await feePaymentDelegate().update({
        where: {
          id: payment.id
        },
        data: {
          status: FEE_PAYMENT_STATUS_CANCELLED,
          gatewayStatus: query.status || "CANCELLED",
          gatewayRawPayload: rawQuery
        }
      });
    }
    return {
      redirectUrl: buildFeeRedirectUrl("cancelled", transactionId)
    };
  }
  if (callbackType === "failed") {
    if (payment.status !== FEE_PAYMENT_STATUS_SUCCESS2) {
      await feePaymentDelegate().update({
        where: {
          id: payment.id
        },
        data: {
          status: FEE_PAYMENT_STATUS_FAILED,
          gatewayStatus: query.status || "FAILED",
          gatewayRawPayload: rawQuery
        }
      });
    }
    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId)
    };
  }
  if (payment.status === FEE_PAYMENT_STATUS_SUCCESS2) {
    return {
      redirectUrl: buildFeeRedirectUrl("success", transactionId)
    };
  }
  const validationId = query.val_id?.trim();
  if (!validationId) {
    await feePaymentDelegate().update({
      where: {
        id: payment.id
      },
      data: {
        status: FEE_PAYMENT_STATUS_FAILED,
        gatewayStatus: query.status || "FAILED",
        gatewayRawPayload: rawQuery
      }
    });
    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId)
    };
  }
  const { storeId, storePassword, baseUrl: sslCommerzBaseUrl } = await resolveSslCommerzConfigForInstitution(payment.institutionId);
  const validatorParams = new URLSearchParams({
    val_id: validationId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json"
  });
  const validationResponse = await fetch(
    `${sslCommerzBaseUrl}/validator/api/validationserverAPI.php?${validatorParams.toString()}`
  );
  const validationData = await validationResponse.json().catch(() => null);
  const validationStatus = validationData?.status?.toUpperCase();
  const isValidStatus = validationStatus === "VALID" || validationStatus === "VALIDATED";
  const isValidTransaction = validationData?.tran_id === payment.tranId;
  const isValidAmount = areMoneyValuesEqual3(validationData?.amount, payment.amount);
  const isValidCurrency = toSafeUpper3(validationData?.currency_type, payment.currency) === toSafeUpper3(payment.currency, "BDT");
  if (!validationResponse.ok || !isValidStatus || !isValidTransaction || !isValidAmount || !isValidCurrency) {
    await feePaymentDelegate().update({
      where: {
        id: payment.id
      },
      data: {
        status: FEE_PAYMENT_STATUS_FAILED,
        gatewayStatus: validationData?.status || query.status || "FAILED",
        gatewayValId: validationData?.val_id || validationId,
        gatewayRawPayload: validationData ?? rawQuery
      }
    });
    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId)
    };
  }
  const successfulSemesterPayments = await feePaymentDelegate().findMany({
    where: {
      studentProfileId: payment.studentProfileId,
      semesterId: payment.semesterId,
      status: FEE_PAYMENT_STATUS_SUCCESS2,
      id: {
        not: payment.id
      }
    },
    select: {
      amount: true
    }
  });
  const alreadyPaidAmount = toMoneyNumber4(
    successfulSemesterPayments.reduce(
      (sum, item) => sum + toMoneyNumber4(item.amount),
      0
    )
  );
  const currentAmount = toMoneyNumber4(payment.amount);
  const totalFeeAmount = toMoneyNumber4(payment.feeConfiguration.totalFeeAmount);
  if (alreadyPaidAmount + currentAmount > totalFeeAmount + 0.01) {
    await feePaymentDelegate().update({
      where: {
        id: payment.id
      },
      data: {
        status: FEE_PAYMENT_STATUS_FAILED,
        gatewayStatus: "OVERPAYMENT_BLOCKED",
        gatewayValId: validationData?.val_id || validationId,
        gatewayRawPayload: validationData
      }
    });
    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId)
    };
  }
  await feePaymentDelegate().update({
    where: {
      id: payment.id
    },
    data: {
      status: FEE_PAYMENT_STATUS_SUCCESS2,
      paidAt: /* @__PURE__ */ new Date(),
      gatewayStatus: validationData?.status || "VALID",
      gatewayValId: validationData?.val_id || validationId,
      gatewayBankTranId: validationData?.bank_tran_id || null,
      gatewayCardType: validationData?.card_type || null,
      gatewayRawPayload: validationData
    }
  });
  return {
    redirectUrl: buildFeeRedirectUrl("success", transactionId)
  };
};
var StudentService = {
  getProfileOverview,
  getApplicationProfile,
  createApplicationProfile,
  updateApplicationProfile,
  deleteApplicationProfile,
  applyToAdmissionPosting,
  listMyAdmissionApplications,
  updateProfile: updateProfile3,
  listTimeline,
  listRegisteredCourses,
  listRoutines: listRoutines5,
  listResults,
  listSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getFeeOverview,
  initiateFeePayment,
  handleFeeGatewayCallback
};

// src/app/module/student/student.controller.ts
var readParam6 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue8 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
var getProfileOverview2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.getProfileOverview(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile fetched successfully",
    data: result
  });
});
var getApplicationProfile2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.getApplicationProfile(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile fetched successfully",
    data: result
  });
});
var createApplicationProfile2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.createApplicationProfile(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Application profile created successfully",
    data: result
  });
});
var updateApplicationProfile2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.updateApplicationProfile(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile updated successfully",
    data: result
  });
});
var deleteApplicationProfile2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.deleteApplicationProfile(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile deleted successfully",
    data: result
  });
});
var applyToAdmissionPosting2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.applyToAdmissionPosting(
    user.id,
    readParam6(req.params.postingId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Application submitted successfully",
    data: result
  });
});
var listMyAdmissionApplications2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.listMyAdmissionApplications(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Admission applications fetched successfully",
    data: result
  });
});
var updateProfile4 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.updateProfile(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student profile updated successfully",
    data: result
  });
});
var listTimeline2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : void 0;
  const type = typeof req.query.type === "string" ? req.query.type : void 0;
  const search = readQueryValue8(req.query.search);
  const result = await StudentService.listTimeline(user.id, {
    semesterId,
    type,
    search
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student timeline fetched successfully",
    data: result
  });
});
var listRegisteredCourses2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : void 0;
  const search = readQueryValue8(req.query.search);
  const result = await StudentService.listRegisteredCourses(user.id, {
    semesterId,
    search
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Registered courses fetched successfully",
    data: result
  });
});
var listRoutines6 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.listRoutines(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student routines fetched successfully",
    data: result
  });
});
var listResults2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : "";
  const result = await StudentService.listResults(user.id, { semesterId });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student results fetched successfully",
    data: result
  });
});
var listSubmissions2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const classworkId = typeof req.query.classworkId === "string" ? req.query.classworkId : void 0;
  const semesterId = typeof req.query.semesterId === "string" ? req.query.semesterId : void 0;
  const search = readQueryValue8(req.query.search);
  const result = await StudentService.listSubmissions(user.id, {
    classworkId,
    semesterId,
    search
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Submissions fetched successfully",
    data: result
  });
});
var createSubmission2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.createSubmission(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Submission created successfully",
    data: result
  });
});
var updateSubmission2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.updateSubmission(user.id, readParam6(req.params.submissionId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Submission updated successfully",
    data: result
  });
});
var deleteSubmission2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.deleteSubmission(user.id, readParam6(req.params.submissionId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Submission deleted successfully",
    data: result
  });
});
var getFeeOverview2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.getFeeOverview(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student fee overview fetched successfully",
    data: result
  });
});
var initiateFeePayment2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.initiateFeePayment(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Fee payment initiated successfully",
    data: result
  });
});
var readFeeGatewayCallbackPayload = (req) => ({
  ...req.query,
  ...req.body
});
var handleFeePaymentSuccessRedirect = catchAsync(async (req, res) => {
  const result = await StudentService.handleFeeGatewayCallback(
    "success",
    readFeeGatewayCallbackPayload(req)
  );
  res.redirect(302, result.redirectUrl);
});
var handleFeePaymentFailureRedirect = catchAsync(async (req, res) => {
  const result = await StudentService.handleFeeGatewayCallback(
    "failed",
    readFeeGatewayCallbackPayload(req)
  );
  res.redirect(302, result.redirectUrl);
});
var handleFeePaymentCancelRedirect = catchAsync(async (req, res) => {
  const result = await StudentService.handleFeeGatewayCallback(
    "cancelled",
    readFeeGatewayCallbackPayload(req)
  );
  res.redirect(302, result.redirectUrl);
});
var StudentController = {
  getProfileOverview: getProfileOverview2,
  getApplicationProfile: getApplicationProfile2,
  createApplicationProfile: createApplicationProfile2,
  updateApplicationProfile: updateApplicationProfile2,
  deleteApplicationProfile: deleteApplicationProfile2,
  applyToAdmissionPosting: applyToAdmissionPosting2,
  listMyAdmissionApplications: listMyAdmissionApplications2,
  updateProfile: updateProfile4,
  listTimeline: listTimeline2,
  listRegisteredCourses: listRegisteredCourses2,
  listRoutines: listRoutines6,
  listResults: listResults2,
  listSubmissions: listSubmissions2,
  createSubmission: createSubmission2,
  updateSubmission: updateSubmission2,
  deleteSubmission: deleteSubmission2,
  getFeeOverview: getFeeOverview2,
  initiateFeePayment: initiateFeePayment2,
  handleFeePaymentSuccessRedirect,
  handleFeePaymentFailureRedirect,
  handleFeePaymentCancelRedirect
};

// src/app/module/student/student.validation.ts
import { z as z13 } from "zod";
var uuidSchema6 = z13.uuid("Please provide a valid id");
var classworkTypeSchema = z13.enum(["TASK", "ASSIGNMENT", "QUIZ", "NOTICE"]);
var studentAcademicRecordSchema = z13.object({
  examName: z13.string("examName is required").trim().min(2).max(120),
  institute: z13.string("institute is required").trim().min(2).max(180),
  result: z13.string("result is required").trim().min(1).max(60),
  year: z13.number("year must be a number").int().min(1950).max(2100)
});
var createStudentApplicationProfileSchema = z13.object({
  body: z13.object({
    headline: z13.string("headline is required").trim().min(2).max(180),
    about: z13.string("about is required").trim().min(20).max(5e3),
    documentUrls: z13.array(z13.url("document URL must be valid").trim()).min(1),
    academicRecords: z13.array(studentAcademicRecordSchema).min(1)
  })
});
var updateStudentApplicationProfileSchema = z13.object({
  body: z13.object({
    headline: z13.string("headline must be a string").trim().min(2).max(180).optional(),
    about: z13.string("about must be a string").trim().min(20).max(5e3).optional(),
    documentUrls: z13.array(z13.url("document URL must be valid").trim()).optional(),
    academicRecords: z13.array(studentAcademicRecordSchema).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var createAdmissionApplicationSchema = z13.object({
  params: z13.object({
    postingId: uuidSchema6
  }),
  body: z13.object({
    coverLetter: z13.string("coverLetter must be a string").trim().max(2500).optional()
  })
});
var listTimelineSchema = z13.object({
  query: z13.object({
    semesterId: uuidSchema6.optional(),
    type: classworkTypeSchema.optional()
  })
});
var listRegisteredCoursesSchema = z13.object({
  query: z13.object({
    semesterId: uuidSchema6.optional()
  })
});
var listResultsSchema = z13.object({
  query: z13.object({
    semesterId: uuidSchema6
  })
});
var createSubmissionSchema = z13.object({
  body: z13.object({
    classworkId: uuidSchema6,
    responseText: z13.string("responseText must be a string").trim().max(5e3, "responseText must be at most 5000 characters").optional(),
    attachmentUrl: z13.url("attachmentUrl must be a valid URL").trim().optional(),
    attachmentName: z13.string("attachmentName must be a string").trim().max(200, "attachmentName must be at most 200 characters").optional()
  }).refine((value) => Boolean(value.responseText?.trim()) || Boolean(value.attachmentUrl?.trim()), {
    message: "responseText or attachmentUrl is required"
  })
});
var updateSubmissionSchema = z13.object({
  params: z13.object({
    submissionId: uuidSchema6
  }),
  body: z13.object({
    responseText: z13.string("responseText must be a string").trim().max(5e3, "responseText must be at most 5000 characters").optional(),
    attachmentUrl: z13.url("attachmentUrl must be a valid URL").trim().optional(),
    attachmentName: z13.string("attachmentName must be a string").trim().max(200, "attachmentName must be at most 200 characters").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var deleteSubmissionSchema = z13.object({
  params: z13.object({
    submissionId: uuidSchema6
  })
});
var listSubmissionsSchema = z13.object({
  query: z13.object({
    classworkId: uuidSchema6.optional(),
    semesterId: uuidSchema6.optional()
  })
});
var updateProfileSchema = z13.object({
  body: z13.object({
    name: z13.string("name must be a string").trim().min(2).max(120).optional(),
    image: z13.url("image must be a valid URL").trim().optional(),
    bio: z13.string("bio must be a string").trim().max(1200).optional(),
    contactNo: z13.string("contactNo must be a string").trim().max(30).optional(),
    presentAddress: z13.string("presentAddress must be a string").trim().max(300).optional(),
    permanentAddress: z13.string("permanentAddress must be a string").trim().max(300).optional(),
    bloodGroup: z13.string("bloodGroup must be a string").trim().max(10).optional(),
    gender: z13.string("gender must be a string").trim().max(20).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var initiateFeePaymentSchema = z13.object({
  body: z13.object({
    semesterId: uuidSchema6,
    paymentMode: z13.enum(["MONTHLY", "FULL"]),
    monthsCount: z13.number().int().positive().max(12).optional()
  }).refine(
    (value) => value.paymentMode === "MONTHLY" ? Boolean(value.monthsCount) : true,
    {
      path: ["monthsCount"],
      message: "monthsCount is required when paymentMode is MONTHLY"
    }
  )
});
var feeGatewayCallbackSchema = z13.object({
  query: z13.object({
    tran_id: z13.string().trim().min(3),
    val_id: z13.string().trim().min(1).optional(),
    amount: z13.string().trim().min(1).optional(),
    currency: z13.string().trim().min(1).optional(),
    status: z13.string().trim().min(1).optional()
  })
});
var StudentValidation = {
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
  initiateFeePaymentSchema,
  feeGatewayCallbackSchema
};

// src/app/module/student/student.route.ts
var router13 = Router13();
router13.get("/profile", requireSessionRole("STUDENT"), StudentController.getProfileOverview);
router13.get(
  "/application-profile",
  requireSessionRole("STUDENT"),
  StudentController.getApplicationProfile
);
router13.post(
  "/application-profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createStudentApplicationProfileSchema),
  StudentController.createApplicationProfile
);
router13.patch(
  "/application-profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateStudentApplicationProfileSchema),
  StudentController.updateApplicationProfile
);
router13.delete(
  "/application-profile",
  requireSessionRole("STUDENT"),
  StudentController.deleteApplicationProfile
);
router13.post(
  "/admission-applications/:postingId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createAdmissionApplicationSchema),
  StudentController.applyToAdmissionPosting
);
router13.get(
  "/admission-applications",
  requireSessionRole("STUDENT"),
  StudentController.listMyAdmissionApplications
);
router13.patch(
  "/profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateProfileSchema),
  StudentController.updateProfile
);
router13.get(
  "/timeline",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listTimelineSchema),
  StudentController.listTimeline
);
router13.get(
  "/registered-courses",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listRegisteredCoursesSchema),
  StudentController.listRegisteredCourses
);
router13.get(
  "/routines",
  requireSessionRole("STUDENT"),
  StudentController.listRoutines
);
router13.get(
  "/results",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listResultsSchema),
  StudentController.listResults
);
router13.get(
  "/submissions",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listSubmissionsSchema),
  StudentController.listSubmissions
);
router13.post(
  "/submissions",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createSubmissionSchema),
  StudentController.createSubmission
);
router13.patch(
  "/submissions/:submissionId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateSubmissionSchema),
  StudentController.updateSubmission
);
router13.delete(
  "/submissions/:submissionId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.deleteSubmissionSchema),
  StudentController.deleteSubmission
);
router13.get("/fees/payment/success", StudentController.handleFeePaymentSuccessRedirect);
router13.get("/fees/payment/fail", StudentController.handleFeePaymentFailureRedirect);
router13.get("/fees/payment/cancel", StudentController.handleFeePaymentCancelRedirect);
router13.post("/fees/payment/success", StudentController.handleFeePaymentSuccessRedirect);
router13.post("/fees/payment/fail", StudentController.handleFeePaymentFailureRedirect);
router13.post("/fees/payment/cancel", StudentController.handleFeePaymentCancelRedirect);
router13.get("/fees", requireSessionRole("STUDENT"), StudentController.getFeeOverview);
router13.post(
  "/fees/initiate",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.initiateFeePaymentSchema),
  StudentController.initiateFeePayment
);
var StudentRouter = router13;

// src/app/module/teacher/teacher.route.ts
import { Router as Router14 } from "express";

// src/app/module/teacher/teacher.service.ts
var hasValidAcademicRecords = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return false;
  }
  return records.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const value = item;
    return typeof value.degree === "string" && value.degree.trim().length >= 2 && typeof value.institute === "string" && value.institute.trim().length >= 2 && typeof value.result === "string" && value.result.trim().length >= 1 && typeof value.year === "number";
  });
};
var hasValidExperienceRecords = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return false;
  }
  return records.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const value = item;
    return typeof value.organization === "string" && value.organization.trim().length >= 2 && typeof value.title === "string" && value.title.trim().length >= 2 && typeof value.startDate === "string" && value.startDate.trim().length >= 10;
  });
};
var computeApplicationProfileCompleteness = (input) => {
  const hasSkills = Array.isArray(input.skills) && input.skills.some((item) => item.trim().length > 0);
  return input.headline.trim().length >= 2 && input.about.trim().length >= 20 && input.resumeUrl.trim().length > 0 && hasSkills && hasValidAcademicRecords(input.academicRecords) && hasValidExperienceRecords(input.experiences);
};
var toJsonInputValue2 = (value) => {
  if (value === null || value === void 0) {
    return [];
  }
  return value;
};
var LAB_MARKS_MAX2 = {
  labReport: 15,
  labTask: 10,
  project: 15,
  projectReport: 10,
  attendance: 10,
  presentation: 10,
  labEvaluation: 20,
  viva: 10
};
var THEORY_MARKS_MAX2 = {
  quiz1: 15,
  quiz2: 15,
  quiz3: 15,
  presentation: 8,
  attendance: 7,
  assignment: 5,
  midterm: 25,
  finalExam: 40
};
function createHttpError14(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch8(search) {
  const value = search?.trim();
  return value || void 0;
}
function normalizeDateToMidnight(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError14(400, "Invalid date");
  }
  date.setHours(0, 0, 0, 0);
  return date;
}
function getDayRange(value) {
  const start = normalizeDateToMidnight(value);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}
function isLabCourse2(courseTitle) {
  return /\blab$/i.test(courseTitle.trim());
}
function toTwoDecimals2(value) {
  return Math.round(value * 100) / 100;
}
function enforceMaxMark(value, maxValue, fieldName) {
  if (value < 0) {
    throw createHttpError14(400, `${fieldName} cannot be negative`);
  }
  if (value > maxValue) {
    throw createHttpError14(400, `${fieldName} cannot exceed ${maxValue}`);
  }
}
async function resolveTeacherContext(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      contactNo: true,
      presentAddress: true,
      permanentAddress: true,
      bloodGroup: true,
      gender: true,
      accountStatus: true,
      role: true
    }
  });
  if (!user) {
    throw createHttpError14(404, "User not found");
  }
  const profile = await prisma.teacherProfile.findFirst({
    where: {
      userId
    },
    include: {
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true
        }
      },
      department: {
        select: {
          id: true,
          fullName: true,
          shortName: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return {
    user,
    profile
  };
}
async function resolveTeacherInstitutionContext(userId) {
  const context = await resolveTeacherContext(userId);
  if (!context.profile?.institutionId) {
    throw createHttpError14(403, "Teacher is not assigned to any institution yet");
  }
  return {
    user: context.user,
    profile: context.profile
  };
}
async function resolveAdminContext2(userId) {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError14(403, "Only institution admins can perform this action");
  }
  return adminProfile;
}
var getProfileOverview3 = async (userId) => {
  const context = await resolveTeacherContext(userId);
  const applications = await prisma.teacherJobApplication.findMany({
    where: {
      teacherUserId: userId
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true
        }
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true
        }
      },
      department: {
        select: {
          id: true,
          fullName: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const applicationProfile = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId
    }
  });
  return {
    hasInstitution: Boolean(context.profile?.institutionId),
    user: context.user,
    profile: context.profile,
    applicationProfile,
    applications
  };
};
var updateProfile5 = async (userId, payload) => {
  const context = await resolveTeacherContext(userId);
  await prisma.$transaction(async (trx) => {
    const nextName = payload.name?.trim();
    if (nextName) {
      await trx.user.update({
        where: { id: userId },
        data: { name: nextName }
      });
    }
    await trx.user.update({
      where: { id: userId },
      data: {
        image: payload.image === void 0 ? void 0 : payload.image.trim() || null,
        contactNo: payload.contactNo === void 0 ? void 0 : payload.contactNo.trim() || null,
        presentAddress: payload.presentAddress === void 0 ? void 0 : payload.presentAddress.trim() || null,
        permanentAddress: payload.permanentAddress === void 0 ? void 0 : payload.permanentAddress.trim() || null,
        bloodGroup: payload.bloodGroup === void 0 ? void 0 : payload.bloodGroup.trim() || null,
        gender: payload.gender === void 0 ? void 0 : payload.gender.trim() || null
      }
    });
    if (context.profile) {
      await trx.teacherProfile.update({
        where: {
          id: context.profile.id
        },
        data: {
          bio: payload.bio === void 0 ? void 0 : payload.bio.trim() || null,
          designation: payload.designation === void 0 ? void 0 : payload.designation.trim()
        }
      });
    }
  });
  return getProfileOverview3(userId);
};
var getApplicationProfile3 = async (userId) => {
  return prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId
    }
  });
};
var createApplicationProfile3 = async (userId, payload) => {
  const existing = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId
    },
    select: {
      id: true
    }
  });
  if (existing) {
    throw createHttpError14(409, "Application profile already exists. Use update instead.");
  }
  const normalized = {
    headline: payload.headline.trim(),
    about: payload.about.trim(),
    resumeUrl: payload.resumeUrl.trim(),
    portfolioUrl: payload.portfolioUrl?.trim() || null,
    skills: payload.skills.map((item) => item.trim()).filter(Boolean),
    certifications: (payload.certifications ?? []).map((item) => item.trim()).filter(Boolean),
    academicRecords: toJsonInputValue2(payload.academicRecords),
    experiences: toJsonInputValue2(payload.experiences)
  };
  return prisma.teacherApplicationProfile.create({
    data: {
      teacherUserId: userId,
      ...normalized,
      isComplete: computeApplicationProfileCompleteness(normalized)
    }
  });
};
var updateApplicationProfile3 = async (userId, payload) => {
  const existing = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId
    }
  });
  if (!existing) {
    throw createHttpError14(404, "Application profile not found");
  }
  const next = {
    headline: payload.headline?.trim() ?? existing.headline,
    about: payload.about?.trim() ?? existing.about,
    resumeUrl: payload.resumeUrl?.trim() ?? existing.resumeUrl,
    portfolioUrl: payload.portfolioUrl === void 0 ? existing.portfolioUrl : payload.portfolioUrl.trim() || null,
    skills: payload.skills === void 0 ? existing.skills : payload.skills.map((item) => item.trim()).filter(Boolean),
    certifications: payload.certifications === void 0 ? existing.certifications : payload.certifications.map((item) => item.trim()).filter(Boolean),
    academicRecords: toJsonInputValue2(payload.academicRecords ?? existing.academicRecords),
    experiences: toJsonInputValue2(payload.experiences ?? existing.experiences)
  };
  return prisma.teacherApplicationProfile.update({
    where: {
      teacherUserId: userId
    },
    data: {
      ...next,
      isComplete: computeApplicationProfileCompleteness(next)
    }
  });
};
var deleteApplicationProfile3 = async (userId) => {
  const existing = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId
    },
    select: {
      id: true
    }
  });
  if (!existing) {
    throw createHttpError14(404, "Application profile not found");
  }
  await prisma.teacherApplicationProfile.delete({
    where: {
      teacherUserId: userId
    }
  });
  return {
    id: existing.id
  };
};
var applyToTeacherJobPosting = async (userId, postingId, payload) => {
  const context = await resolveTeacherContext(userId);
  const applicationProfile = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId
    },
    select: {
      id: true,
      isComplete: true
    }
  });
  if (!applicationProfile?.isComplete) {
    throw createHttpError14(
      400,
      "Complete your application profile (academic records, experiences, resume, and skills) before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError14(400, "You are already assigned to an institution");
  }
  const posting = await prisma.teacherJobPost.findUnique({
    where: {
      id: postingId
    },
    select: {
      id: true,
      institutionId: true,
      departmentId: true
    }
  });
  if (!posting) {
    throw createHttpError14(404, "Teacher posting not found");
  }
  const existing = await prisma.teacherJobApplication.findFirst({
    where: {
      postingId,
      teacherUserId: userId
    },
    select: {
      id: true
    }
  });
  if (existing) {
    throw createHttpError14(409, "You already applied to this posting");
  }
  return prisma.teacherJobApplication.create({
    data: {
      postingId,
      teacherUserId: userId,
      teacherProfileId: context.profile?.id,
      institutionId: posting.institutionId,
      departmentId: posting.departmentId,
      coverLetter: payload.coverLetter?.trim() || null,
      status: TeacherJobApplicationStatus.PENDING
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true
        }
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true
        }
      },
      department: {
        select: {
          id: true,
          fullName: true
        }
      }
    }
  });
};
var listMyJobApplications = async (userId) => {
  return prisma.teacherJobApplication.findMany({
    where: {
      teacherUserId: userId
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
          summary: true
        }
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true
        }
      },
      department: {
        select: {
          id: true,
          fullName: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var listAssignedSectionsWithStudents = async (userId, search) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const normalizedSearch = normalizeSearch8(search);
  const registrations = await prisma.courseRegistration.findMany({
    where: {
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
      ...normalizedSearch ? {
        OR: [
          { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
          { section: { semester: { name: { contains: normalizedSearch, mode: "insensitive" } } } },
          { section: { batch: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } },
          { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } },
          { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } },
          { studentProfile: { studentsId: { contains: normalizedSearch, mode: "insensitive" } } },
          { studentProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } },
          { studentProfile: { user: { is: { email: { contains: normalizedSearch, mode: "insensitive" } } } } }
        ]
      } : {}
    },
    include: {
      section: {
        include: {
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          },
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      studentProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              accountStatus: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const grouped = /* @__PURE__ */ new Map();
  for (const registration of registrations) {
    const existing = grouped.get(registration.sectionId);
    const studentRecord = {
      courseRegistrationId: registration.id,
      course: registration.course,
      studentProfile: registration.studentProfile
    };
    if (!existing) {
      grouped.set(registration.sectionId, {
        section: {
          id: registration.section.id,
          name: registration.section.name,
          description: registration.section.description,
          sectionCapacity: registration.section.sectionCapacity,
          semester: registration.section.semester,
          batch: registration.section.batch
        },
        students: [studentRecord]
      });
      continue;
    }
    const duplicateStudent = existing.students.some(
      (item) => item.courseRegistrationId === registration.id
    );
    if (!duplicateStudent) {
      existing.students.push(studentRecord);
    }
  }
  return Array.from(grouped.values()).sort(
    (a, b) => a.section.name.localeCompare(b.section.name, void 0, { sensitivity: "base" })
  );
};
var listRoutines7 = async (userId) => {
  const context = await resolveTeacherInstitutionContext(userId);
  return prisma.routine.findMany({
    where: {
      institutionId: context.profile.institutionId,
      courseRegistration: {
        teacherProfileId: context.profile.id
      }
    },
    include: {
      schedule: true,
      classRoom: true,
      courseRegistration: {
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              courseTitle: true
            }
          },
          section: {
            select: {
              id: true,
              name: true,
              batch: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          },
          teacherProfile: {
            select: {
              id: true,
              teacherInitial: true,
              teachersId: true,
              designation: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: [{ schedule: { startTime: "asc" } }, { createdAt: "desc" }]
  });
};
var listClassworks = async (userId, query) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const normalizedSearch = normalizeSearch8(query.search);
  if (query.sectionId) {
    const hasAccess = await prisma.courseRegistration.findFirst({
      where: {
        teacherProfileId: context.profile.id,
        sectionId: query.sectionId,
        institutionId: context.profile.institutionId
      },
      select: {
        id: true
      }
    });
    if (!hasAccess) {
      throw createHttpError14(403, "You are not assigned to this section");
    }
  }
  return prisma.teacherClasswork.findMany({
    where: {
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
      sectionId: query.sectionId,
      type: query.type,
      ...normalizedSearch ? {
        OR: [
          { title: { contains: normalizedSearch, mode: "insensitive" } },
          { content: { contains: normalizedSearch, mode: "insensitive" } },
          { section: { name: { contains: normalizedSearch, mode: "insensitive" } } }
        ]
      } : {}
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true
            }
          },
          batch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }]
  });
};
var createClasswork = async (userId, payload) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const sectionAccess = await prisma.courseRegistration.findFirst({
    where: {
      teacherProfileId: context.profile.id,
      sectionId: payload.sectionId,
      institutionId: context.profile.institutionId
    },
    select: {
      id: true,
      departmentId: true
    }
  });
  if (!sectionAccess) {
    throw createHttpError14(403, "You are not assigned to this section");
  }
  return prisma.teacherClasswork.create({
    data: {
      title: payload.title.trim(),
      content: payload.content?.trim() || null,
      type: payload.type,
      dueAt: payload.dueAt ? new Date(payload.dueAt) : null,
      sectionId: payload.sectionId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
      departmentId: sectionAccess.departmentId
    },
    include: {
      section: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};
var updateClasswork = async (userId, classworkId, payload) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const existing = await prisma.teacherClasswork.findFirst({
    where: {
      id: classworkId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId
    },
    select: {
      id: true
    }
  });
  if (!existing) {
    throw createHttpError14(404, "Classwork not found");
  }
  return prisma.teacherClasswork.update({
    where: {
      id: classworkId
    },
    data: {
      type: payload.type,
      title: payload.title?.trim(),
      content: payload.content === void 0 ? void 0 : payload.content.trim() || null,
      dueAt: payload.dueAt ? new Date(payload.dueAt) : void 0
    },
    include: {
      section: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};
var deleteClasswork = async (userId, classworkId) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const existing = await prisma.teacherClasswork.findFirst({
    where: {
      id: classworkId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId
    },
    select: {
      id: true
    }
  });
  if (!existing) {
    throw createHttpError14(404, "Classwork not found");
  }
  await prisma.teacherClasswork.delete({
    where: {
      id: classworkId
    }
  });
  return {
    id: classworkId
  };
};
var getSectionAttendanceForDay = async (userId, sectionId, date) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const { start, end } = getDayRange(date);
  const registrations = await prisma.courseRegistration.findMany({
    where: {
      teacherProfileId: context.profile.id,
      sectionId,
      institutionId: context.profile.institutionId
    },
    include: {
      studentProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      attendances: {
        where: {
          date: {
            gte: start,
            lt: end
          }
        },
        select: {
          id: true,
          status: true,
          date: true
        },
        take: 1
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  if (registrations.length === 0) {
    throw createHttpError14(404, "No students found for this section");
  }
  return {
    sectionId,
    date: start,
    items: registrations.map((registration) => ({
      courseRegistrationId: registration.id,
      studentProfile: {
        id: registration.studentProfile.id,
        studentsId: registration.studentProfile.studentsId,
        user: registration.studentProfile.user
      },
      course: registration.course,
      status: registration.attendances[0]?.status ?? AttendanceStatus.ABSENT,
      attendanceId: registration.attendances[0]?.id ?? null
    }))
  };
};
var upsertSectionAttendanceForDay = async (userId, payload) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const attendanceDate = normalizeDateToMidnight(payload.date);
  const registrations = await prisma.courseRegistration.findMany({
    where: {
      teacherProfileId: context.profile.id,
      sectionId: payload.sectionId,
      institutionId: context.profile.institutionId
    },
    select: {
      id: true
    }
  });
  if (registrations.length === 0) {
    throw createHttpError14(404, "No students found for this section");
  }
  const allowedRegistrationIds = new Set(registrations.map((item) => item.id));
  for (const item of payload.items) {
    if (!allowedRegistrationIds.has(item.courseRegistrationId)) {
      throw createHttpError14(400, "One or more attendance records are outside your assigned section");
    }
  }
  await prisma.$transaction(
    payload.items.map(
      (item) => prisma.attendance.upsert({
        where: {
          courseRegistrationId_date: {
            courseRegistrationId: item.courseRegistrationId,
            date: attendanceDate
          }
        },
        create: {
          courseRegistrationId: item.courseRegistrationId,
          date: attendanceDate,
          status: item.status
        },
        update: {
          status: item.status
        }
      })
    )
  );
  return getSectionAttendanceForDay(userId, payload.sectionId, attendanceDate.toISOString());
};
var listSectionMarks = async (userId, sectionId) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const registrations = await prisma.courseRegistration.findMany({
    where: {
      teacherProfileId: context.profile.id,
      sectionId,
      institutionId: context.profile.institutionId
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true
        }
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      attendances: {
        select: {
          status: true
        }
      },
      mark: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  if (registrations.length === 0) {
    throw createHttpError14(404, "No students found for this section");
  }
  return registrations.map((registration) => {
    const labCourse = isLabCourse2(registration.course.courseTitle);
    const totalAttendance = registration.attendances.length;
    const presentCount = registration.attendances.filter(
      (item) => item.status === AttendanceStatus.PRESENT
    ).length;
    const attendancePercentage = totalAttendance > 0 ? presentCount / totalAttendance * 100 : 0;
    const attendanceMax = labCourse ? LAB_MARKS_MAX2.attendance : THEORY_MARKS_MAX2.attendance;
    const attendanceMark = toTwoDecimals2(attendancePercentage / 100 * attendanceMax);
    if (labCourse) {
      const labManualTotal = (registration.mark?.labReport ?? 0) + (registration.mark?.labTask ?? 0) + (registration.mark?.project ?? 0) + (registration.mark?.projectReport ?? 0) + (registration.mark?.presentation ?? 0) + (registration.mark?.labEvaluation ?? 0) + (registration.mark?.viva ?? 0);
      return {
        courseRegistrationId: registration.id,
        isLabCourse: true,
        course: registration.course,
        studentProfile: registration.studentProfile,
        marks: registration.mark,
        attendance: {
          percentage: toTwoDecimals2(attendancePercentage),
          mark: attendanceMark,
          max: attendanceMax,
          totalClasses: totalAttendance,
          presentClasses: presentCount
        },
        quizAverage: null,
        totalMark: toTwoDecimals2(labManualTotal + attendanceMark),
        maxTotal: 100
      };
    }
    const quizzes = [registration.mark?.quiz1, registration.mark?.quiz2, registration.mark?.quiz3].filter(
      (item) => typeof item === "number"
    );
    const quizAverage = quizzes.length > 0 ? toTwoDecimals2(quizzes.reduce((acc, item) => acc + item, 0) / quizzes.length) : 0;
    const theoryManualTotal = quizAverage + (registration.mark?.presentation ?? 0) + (registration.mark?.assignment ?? 0) + (registration.mark?.midterm ?? 0) + (registration.mark?.finalExam ?? 0);
    return {
      courseRegistrationId: registration.id,
      isLabCourse: false,
      course: registration.course,
      studentProfile: registration.studentProfile,
      marks: registration.mark,
      attendance: {
        percentage: toTwoDecimals2(attendancePercentage),
        mark: attendanceMark,
        max: attendanceMax,
        totalClasses: totalAttendance,
        presentClasses: presentCount
      },
      quizAverage,
      totalMark: toTwoDecimals2(theoryManualTotal + attendanceMark),
      maxTotal: 100
    };
  });
};
var upsertSectionMark = async (userId, courseRegistrationId, payload) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const registration = await prisma.courseRegistration.findFirst({
    where: {
      id: courseRegistrationId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId
    },
    include: {
      course: {
        select: {
          id: true,
          courseTitle: true
        }
      }
    }
  });
  if (!registration) {
    throw createHttpError14(404, "Course registration not found for this teacher");
  }
  const labCourse = isLabCourse2(registration.course.courseTitle);
  const allowedWithMax = labCourse ? {
    labReport: LAB_MARKS_MAX2.labReport,
    labTask: LAB_MARKS_MAX2.labTask,
    project: LAB_MARKS_MAX2.project,
    projectReport: LAB_MARKS_MAX2.projectReport,
    presentation: LAB_MARKS_MAX2.presentation,
    labEvaluation: LAB_MARKS_MAX2.labEvaluation,
    viva: LAB_MARKS_MAX2.viva
  } : {
    quiz1: THEORY_MARKS_MAX2.quiz1,
    quiz2: THEORY_MARKS_MAX2.quiz2,
    quiz3: THEORY_MARKS_MAX2.quiz3,
    presentation: THEORY_MARKS_MAX2.presentation,
    assignment: THEORY_MARKS_MAX2.assignment,
    midterm: THEORY_MARKS_MAX2.midterm,
    finalExam: THEORY_MARKS_MAX2.finalExam
  };
  const dataToSave = {};
  for (const [key, rawValue] of Object.entries(payload)) {
    const field = key;
    const value = rawValue;
    if (typeof value !== "number") {
      continue;
    }
    const max = allowedWithMax[field];
    if (typeof max !== "number") {
      throw createHttpError14(400, `${field} is not allowed for this course type`);
    }
    enforceMaxMark(value, max, field);
    dataToSave[field] = toTwoDecimals2(value);
  }
  if (Object.keys(dataToSave).length === 0) {
    throw createHttpError14(400, "No valid marks field provided for this course type");
  }
  await prisma.teacherMark.upsert({
    where: {
      courseRegistrationId
    },
    create: {
      courseRegistrationId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
      departmentId: registration.departmentId,
      ...dataToSave
    },
    update: {
      ...dataToSave
    }
  });
  const sectionRows = await listSectionMarks(userId, registration.sectionId);
  return sectionRows.find((item) => item.courseRegistrationId === courseRegistrationId) ?? null;
};
var listTeacherApplicationsForAdmin = async (userId, status) => {
  const admin = await resolveAdminContext2(userId);
  return prisma.teacherJobApplication.findMany({
    where: {
      institutionId: admin.institutionId,
      status
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true
        }
      },
      teacherUser: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true,
          teacherApplicationProfile: {
            select: {
              id: true,
              headline: true,
              about: true,
              resumeUrl: true,
              portfolioUrl: true,
              skills: true,
              certifications: true,
              academicRecords: true,
              experiences: true,
              isComplete: true,
              updatedAt: true
            }
          }
        }
      },
      reviewerUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      department: {
        select: {
          id: true,
          fullName: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var reviewTeacherApplication = async (reviewerUserId, applicationId, payload) => {
  const admin = await resolveAdminContext2(reviewerUserId);
  const application = await prisma.teacherJobApplication.findFirst({
    where: {
      id: applicationId,
      institutionId: admin.institutionId
    },
    include: {
      posting: {
        select: {
          departmentId: true
        }
      }
    }
  });
  if (!application) {
    throw createHttpError14(404, "Application not found");
  }
  if (application.status === TeacherJobApplicationStatus.APPROVED || application.status === TeacherJobApplicationStatus.REJECTED) {
    throw createHttpError14(400, "Application has already been reviewed");
  }
  if (payload.status === TeacherJobApplicationStatus.REJECTED) {
    return prisma.teacherJobApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: TeacherJobApplicationStatus.REJECTED,
        institutionResponse: payload.rejectionReason?.trim() || null,
        reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  if (payload.status === TeacherJobApplicationStatus.SHORTLISTED) {
    return prisma.teacherJobApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: TeacherJobApplicationStatus.SHORTLISTED,
        institutionResponse: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  const targetDepartmentId = payload.departmentId ?? application.posting.departmentId ?? application.departmentId;
  if (!targetDepartmentId) {
    throw createHttpError14(400, "departmentId is required to approve this application");
  }
  const department = await prisma.department.findFirst({
    where: {
      id: targetDepartmentId,
      faculty: {
        institutionId: admin.institutionId
      }
    },
    select: {
      id: true
    }
  });
  if (!department) {
    throw createHttpError14(404, "Department not found for this institution");
  }
  return prisma.$transaction(async (trx) => {
    const existingProfile = await trx.teacherProfile.findFirst({
      where: {
        userId: application.teacherUserId
      },
      select: {
        id: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    let teacherProfileId = existingProfile?.id;
    const teacherInitial = payload.teacherInitial?.trim();
    const teachersId = payload.teachersId?.trim();
    const designation = payload.designation?.trim();
    if (!teacherInitial || !teachersId || !designation) {
      throw createHttpError14(400, "teacherInitial, teachersId and designation are required for approval");
    }
    if (teacherProfileId) {
      await trx.teacherProfile.update({
        where: {
          id: teacherProfileId
        },
        data: {
          teacherInitial,
          teachersId,
          designation,
          bio: payload.bio?.trim() || void 0,
          institutionId: admin.institutionId,
          departmentId: targetDepartmentId
        }
      });
    } else {
      const createdProfile = await trx.teacherProfile.create({
        data: {
          teacherInitial,
          teachersId,
          designation,
          bio: payload.bio?.trim() || null,
          userId: application.teacherUserId,
          institutionId: admin.institutionId,
          departmentId: targetDepartmentId
        },
        select: {
          id: true
        }
      });
      teacherProfileId = createdProfile.id;
    }
    await trx.user.update({
      where: {
        id: application.teacherUserId
      },
      data: {
        accountStatus: AccountStatus.ACTIVE
      }
    });
    return trx.teacherJobApplication.update({
      where: {
        id: applicationId
      },
      data: {
        status: TeacherJobApplicationStatus.APPROVED,
        institutionResponse: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: /* @__PURE__ */ new Date(),
        departmentId: targetDepartmentId,
        teacherProfileId
      },
      include: {
        teacherUser: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true
          }
        },
        department: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });
  });
};
var TeacherService = {
  getProfileOverview: getProfileOverview3,
  updateProfile: updateProfile5,
  getApplicationProfile: getApplicationProfile3,
  createApplicationProfile: createApplicationProfile3,
  updateApplicationProfile: updateApplicationProfile3,
  deleteApplicationProfile: deleteApplicationProfile3,
  applyToTeacherJobPosting,
  listMyJobApplications,
  listAssignedSectionsWithStudents,
  listRoutines: listRoutines7,
  listClassworks,
  createClasswork,
  updateClasswork,
  deleteClasswork,
  getSectionAttendanceForDay,
  upsertSectionAttendanceForDay,
  listSectionMarks,
  upsertSectionMark,
  listTeacherApplicationsForAdmin,
  reviewTeacherApplication
};

// src/app/module/teacher/teacher.controller.ts
var readParam7 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue9 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
var getProfileOverview4 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.getProfileOverview(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher profile fetched successfully",
    data: result
  });
});
var updateProfile6 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.updateProfile(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher profile updated successfully",
    data: result
  });
});
var getApplicationProfile4 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.getApplicationProfile(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile fetched successfully",
    data: result
  });
});
var createApplicationProfile4 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.createApplicationProfile(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Application profile created successfully",
    data: result
  });
});
var updateApplicationProfile4 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.updateApplicationProfile(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile updated successfully",
    data: result
  });
});
var deleteApplicationProfile4 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.deleteApplicationProfile(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Application profile deleted successfully",
    data: result
  });
});
var applyToTeacherJobPosting2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.applyToTeacherJobPosting(
    user.id,
    readParam7(req.params.postingId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Application submitted successfully",
    data: result
  });
});
var listMyJobApplications2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.listMyJobApplications(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Applications fetched successfully",
    data: result
  });
});
var listAssignedSectionsWithStudents2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.listAssignedSectionsWithStudents(
    user.id,
    readQueryValue9(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Sections fetched successfully",
    data: result
  });
});
var listRoutines8 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.listRoutines(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher routines fetched successfully",
    data: result
  });
});
var listClassworks2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const sectionId = typeof req.query.sectionId === "string" ? req.query.sectionId : void 0;
  const type = typeof req.query.type === "string" ? req.query.type : void 0;
  const search = readQueryValue9(req.query.search);
  const result = await TeacherService.listClassworks(user.id, {
    sectionId,
    type,
    search
  });
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Classworks fetched successfully",
    data: result
  });
});
var createClasswork2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.createClasswork(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Classwork created successfully",
    data: result
  });
});
var updateClasswork2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.updateClasswork(
    user.id,
    readParam7(req.params.classworkId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Classwork updated successfully",
    data: result
  });
});
var deleteClasswork2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.deleteClasswork(user.id, readParam7(req.params.classworkId));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Classwork deleted successfully",
    data: result
  });
});
var getSectionAttendanceForDay2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const sectionId = typeof req.query.sectionId === "string" ? req.query.sectionId : "";
  const date = typeof req.query.date === "string" ? req.query.date : "";
  const result = await TeacherService.getSectionAttendanceForDay(user.id, sectionId, date);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Attendance fetched successfully",
    data: result
  });
});
var upsertSectionAttendanceForDay2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.upsertSectionAttendanceForDay(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Attendance submitted successfully",
    data: result
  });
});
var listSectionMarks2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const sectionId = typeof req.query.sectionId === "string" ? req.query.sectionId : "";
  const result = await TeacherService.listSectionMarks(user.id, sectionId);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Section marks fetched successfully",
    data: result
  });
});
var upsertSectionMark2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.upsertSectionMark(
    user.id,
    readParam7(req.params.courseRegistrationId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Marks updated successfully",
    data: result
  });
});
var listTeacherApplicationsForAdmin2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const status = typeof req.query.status === "string" ? req.query.status : void 0;
  const result = await TeacherService.listTeacherApplicationsForAdmin(user.id, status);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher applications fetched successfully",
    data: result
  });
});
var reviewTeacherApplication2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await TeacherService.reviewTeacherApplication(
    user.id,
    readParam7(req.params.applicationId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher application reviewed successfully",
    data: result
  });
});
var TeacherController = {
  getProfileOverview: getProfileOverview4,
  updateProfile: updateProfile6,
  getApplicationProfile: getApplicationProfile4,
  createApplicationProfile: createApplicationProfile4,
  updateApplicationProfile: updateApplicationProfile4,
  deleteApplicationProfile: deleteApplicationProfile4,
  applyToTeacherJobPosting: applyToTeacherJobPosting2,
  listMyJobApplications: listMyJobApplications2,
  listAssignedSectionsWithStudents: listAssignedSectionsWithStudents2,
  listRoutines: listRoutines8,
  listClassworks: listClassworks2,
  createClasswork: createClasswork2,
  updateClasswork: updateClasswork2,
  deleteClasswork: deleteClasswork2,
  getSectionAttendanceForDay: getSectionAttendanceForDay2,
  upsertSectionAttendanceForDay: upsertSectionAttendanceForDay2,
  listSectionMarks: listSectionMarks2,
  upsertSectionMark: upsertSectionMark2,
  listTeacherApplicationsForAdmin: listTeacherApplicationsForAdmin2,
  reviewTeacherApplication: reviewTeacherApplication2
};

// src/app/module/teacher/teacher.validation.ts
import { z as z14 } from "zod";
var uuidSchema7 = z14.uuid("Please provide a valid id");
var classworkTypeSchema2 = z14.enum(["TASK", "ASSIGNMENT", "QUIZ", "NOTICE"]);
var attendanceStatusSchema = z14.enum(["PRESENT", "ABSENT"]);
var markFieldSchema = z14.number("Mark must be a number").min(0, "Mark cannot be negative").max(100, "Mark cannot exceed 100");
var createJobApplicationSchema = z14.object({
  params: z14.object({
    postingId: uuidSchema7
  }),
  body: z14.object({
    coverLetter: z14.string("Cover letter must be a string").trim().min(10, "Cover letter must be at least 10 characters").max(2500, "Cover letter must not exceed 2500 characters").optional()
  })
});
var academicRecordSchema = z14.object({
  degree: z14.string("degree is required").trim().min(2).max(120),
  institute: z14.string("institute is required").trim().min(2).max(180),
  result: z14.string("result is required").trim().min(1).max(60),
  year: z14.number("year must be a number").int().min(1950).max(2100)
});
var experienceRecordSchema = z14.object({
  organization: z14.string("organization is required").trim().min(2).max(180),
  title: z14.string("title is required").trim().min(2).max(120),
  startDate: z14.iso.datetime("startDate must be a valid ISO datetime"),
  endDate: z14.iso.datetime("endDate must be a valid ISO datetime").optional(),
  responsibilities: z14.string("responsibilities must be a string").trim().max(2e3).optional()
});
var createTeacherApplicationProfileSchema = z14.object({
  body: z14.object({
    headline: z14.string("headline is required").trim().min(2).max(180),
    about: z14.string("about is required").trim().min(20).max(5e3),
    resumeUrl: z14.url("resumeUrl must be a valid URL").trim(),
    portfolioUrl: z14.url("portfolioUrl must be a valid URL").trim().optional(),
    skills: z14.array(z14.string("skill must be a string").trim().min(1).max(60)).min(1, "At least one skill is required"),
    certifications: z14.array(z14.string("certification must be a string").trim().min(1).max(120)).optional(),
    academicRecords: z14.array(academicRecordSchema).min(1, "At least one academic record is required"),
    experiences: z14.array(experienceRecordSchema).min(1, "At least one experience record is required")
  })
});
var updateTeacherApplicationProfileSchema = z14.object({
  body: z14.object({
    headline: z14.string("headline must be a string").trim().min(2).max(180).optional(),
    about: z14.string("about must be a string").trim().min(20).max(5e3).optional(),
    resumeUrl: z14.url("resumeUrl must be a valid URL").trim().optional(),
    portfolioUrl: z14.url("portfolioUrl must be a valid URL").trim().optional(),
    skills: z14.array(z14.string("skill must be a string").trim().min(1).max(60)).optional(),
    certifications: z14.array(z14.string("certification must be a string").trim().min(1).max(120)).optional(),
    academicRecords: z14.array(academicRecordSchema).optional(),
    experiences: z14.array(experienceRecordSchema).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var updateProfileSchema2 = z14.object({
  body: z14.object({
    name: z14.string("name must be a string").trim().min(2).max(120).optional(),
    image: z14.url("image must be a valid URL").trim().optional(),
    bio: z14.string("bio must be a string").trim().max(1200).optional(),
    designation: z14.string("designation must be a string").trim().min(2).max(80).optional(),
    contactNo: z14.string("contactNo must be a string").trim().max(30).optional(),
    presentAddress: z14.string("presentAddress must be a string").trim().max(300).optional(),
    permanentAddress: z14.string("permanentAddress must be a string").trim().max(300).optional(),
    bloodGroup: z14.string("bloodGroup must be a string").trim().max(10).optional(),
    gender: z14.string("gender must be a string").trim().max(20).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var listClassworksSchema = z14.object({
  query: z14.object({
    sectionId: uuidSchema7.optional(),
    type: classworkTypeSchema2.optional(),
    search: z14.string("search must be a string").trim().max(120).optional()
  })
});
var createClassworkSchema = z14.object({
  body: z14.object({
    sectionId: uuidSchema7,
    type: classworkTypeSchema2,
    title: z14.string("Title is required").trim().min(2).max(180),
    content: z14.string("Content must be a string").trim().max(3e3, "Content must not exceed 3000 characters").optional(),
    dueAt: z14.iso.datetime("dueAt must be a valid ISO datetime").optional()
  })
});
var updateClassworkSchema = z14.object({
  params: z14.object({
    classworkId: uuidSchema7
  }),
  body: z14.object({
    type: classworkTypeSchema2.optional(),
    title: z14.string("Title must be a string").trim().min(2).max(180).optional(),
    content: z14.string("Content must be a string").trim().max(3e3, "Content must not exceed 3000 characters").optional(),
    dueAt: z14.iso.datetime("dueAt must be a valid ISO datetime").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var deleteClassworkSchema = z14.object({
  params: z14.object({
    classworkId: uuidSchema7
  })
});
var getSectionAttendanceSchema = z14.object({
  query: z14.object({
    sectionId: uuidSchema7,
    date: z14.iso.datetime("date must be a valid ISO datetime")
  })
});
var upsertSectionAttendanceSchema = z14.object({
  body: z14.object({
    sectionId: uuidSchema7,
    date: z14.iso.datetime("date must be a valid ISO datetime"),
    items: z14.array(
      z14.object({
        courseRegistrationId: uuidSchema7,
        status: attendanceStatusSchema
      })
    ).min(1, "At least one attendance item is required")
  })
});
var listSectionMarksSchema = z14.object({
  query: z14.object({
    sectionId: uuidSchema7
  })
});
var upsertMarkSchema = z14.object({
  params: z14.object({
    courseRegistrationId: uuidSchema7
  }),
  body: z14.object({
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
    finalExam: markFieldSchema.optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one marks field is required"
  })
});
var listTeacherJobApplicationsSchema = z14.object({
  query: z14.object({
    status: z14.enum(["PENDING", "SHORTLISTED", "APPROVED", "REJECTED"]).optional()
  })
});
var reviewTeacherJobApplicationSchema = z14.object({
  params: z14.object({
    applicationId: uuidSchema7
  }),
  body: z14.object({
    status: z14.enum(["SHORTLISTED", "APPROVED", "REJECTED"]),
    responseMessage: z14.string("responseMessage must be a string").trim().max(1200).optional(),
    rejectionReason: z14.string("rejectionReason must be a string").trim().max(1200).optional(),
    teacherInitial: z14.string("teacherInitial must be a string").trim().min(2).max(15).optional(),
    teachersId: z14.string("teachersId must be a string").trim().min(2).max(30).optional(),
    designation: z14.string("designation must be a string").trim().min(2).max(80).optional(),
    bio: z14.string("bio must be a string").trim().max(1200).optional(),
    departmentId: uuidSchema7.optional()
  }).refine(
    (value) => value.status === "REJECTED" ? Boolean(value.rejectionReason?.trim()) : true,
    {
      path: ["rejectionReason"],
      message: "rejectionReason is required when rejecting"
    }
  ).refine(
    (value) => value.status === "APPROVED" ? Boolean(value.teacherInitial?.trim()) : true,
    {
      path: ["teacherInitial"],
      message: "teacherInitial is required when approving"
    }
  ).refine(
    (value) => value.status === "APPROVED" ? Boolean(value.teachersId?.trim()) : true,
    {
      path: ["teachersId"],
      message: "teachersId is required when approving"
    }
  ).refine(
    (value) => value.status === "APPROVED" ? Boolean(value.designation?.trim()) : true,
    {
      path: ["designation"],
      message: "designation is required when approving"
    }
  )
});
var TeacherValidation = {
  createTeacherApplicationProfileSchema,
  updateTeacherApplicationProfileSchema,
  updateProfileSchema: updateProfileSchema2,
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
  reviewTeacherJobApplicationSchema
};

// src/app/module/teacher/teacher.route.ts
var router14 = Router14();
router14.get("/profile", requireSessionRole("TEACHER"), TeacherController.getProfileOverview);
router14.patch(
  "/profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateProfileSchema),
  TeacherController.updateProfile
);
router14.get(
  "/application-profile",
  requireSessionRole("TEACHER"),
  TeacherController.getApplicationProfile
);
router14.post(
  "/application-profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createTeacherApplicationProfileSchema),
  TeacherController.createApplicationProfile
);
router14.patch(
  "/application-profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateTeacherApplicationProfileSchema),
  TeacherController.updateApplicationProfile
);
router14.delete(
  "/application-profile",
  requireSessionRole("TEACHER"),
  TeacherController.deleteApplicationProfile
);
router14.post(
  "/job-applications/:postingId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createJobApplicationSchema),
  TeacherController.applyToTeacherJobPosting
);
router14.get(
  "/job-applications",
  requireSessionRole("TEACHER"),
  TeacherController.listMyJobApplications
);
router14.get(
  "/sections",
  requireSessionRole("TEACHER"),
  TeacherController.listAssignedSectionsWithStudents
);
router14.get(
  "/routines",
  requireSessionRole("TEACHER"),
  TeacherController.listRoutines
);
router14.get(
  "/classworks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.listClassworksSchema),
  TeacherController.listClassworks
);
router14.post(
  "/classworks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createClassworkSchema),
  TeacherController.createClasswork
);
router14.patch(
  "/classworks/:classworkId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateClassworkSchema),
  TeacherController.updateClasswork
);
router14.delete(
  "/classworks/:classworkId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.deleteClassworkSchema),
  TeacherController.deleteClasswork
);
router14.get(
  "/attendance",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.getSectionAttendanceSchema),
  TeacherController.getSectionAttendanceForDay
);
router14.post(
  "/attendance",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.upsertSectionAttendanceSchema),
  TeacherController.upsertSectionAttendanceForDay
);
router14.get(
  "/marks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.listSectionMarksSchema),
  TeacherController.listSectionMarks
);
router14.post(
  "/marks/:courseRegistrationId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.upsertMarkSchema),
  TeacherController.upsertSectionMark
);
router14.get(
  "/applications",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(TeacherValidation.listTeacherJobApplicationsSchema),
  TeacherController.listTeacherApplicationsForAdmin
);
router14.patch(
  "/applications/:applicationId/review",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(TeacherValidation.reviewTeacherJobApplicationSchema),
  TeacherController.reviewTeacherApplication
);
var TeacherRouter = router14;

// src/app/module/superadmin/superadmin.route.ts
import { Router as Router15 } from "express";

// src/app/module/superadmin/superadmin.service.ts
var normalizePage2 = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};
var normalizePageSize2 = (value, max = 50) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return 20;
  return Math.min(parsed, max);
};
var listAdmins = async (query) => {
  const page = normalizePage2(query.page);
  const pageSize = normalizePageSize2(query.pageSize, 50);
  const skip = (page - 1) * pageSize;
  const where = query.search ? {
    OR: [
      {
        user: {
          is: {
            name: { contains: query.search, mode: prismaNamespace_exports.QueryMode.insensitive }
          }
        }
      },
      {
        user: {
          is: {
            email: { contains: query.search, mode: prismaNamespace_exports.QueryMode.insensitive }
          }
        }
      }
    ]
  } : {};
  const [items, total] = await Promise.all([
    prisma.adminProfile.findMany({
      where,
      select: {
        id: true,
        userId: true,
        role: true,
        institution: {
          select: { name: true }
        },
        user: {
          select: { name: true, email: true, role: true }
        },
        createdAt: true
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" }
    }),
    prisma.adminProfile.count({ where })
  ]);
  const mappedItems = items.map((admin) => ({
    id: admin.id,
    userId: admin.userId,
    name: admin.user.name,
    email: admin.user.email,
    role: admin.user.role,
    adminRole: admin.role,
    institutionName: admin.institution?.name ?? null,
    createdAt: admin.createdAt.toISOString()
  }));
  const totalPages = Math.ceil(total / pageSize);
  return {
    items: mappedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};
var listInstitutions = async (query) => {
  const page = normalizePage2(query.page);
  const pageSize = normalizePageSize2(query.pageSize, 50);
  const skip = (page - 1) * pageSize;
  const where = query.search ? {
    OR: [
      { name: { contains: query.search, mode: "insensitive" } },
      { shortName: { contains: query.search, mode: "insensitive" } }
    ]
  } : {};
  const [items, total] = await Promise.all([
    prisma.institution.findMany({
      where,
      select: {
        id: true,
        name: true,
        shortName: true,
        type: true,
        institutionLogo: true,
        createdAt: true,
        _count: {
          select: {
            studentProfiles: true,
            teacherProfiles: true
          }
        }
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" }
    }),
    prisma.institution.count({ where })
  ]);
  const mappedItems = items.map((institution) => ({
    id: institution.id,
    name: institution.name,
    shortName: institution.shortName,
    type: institution.type,
    logo: institution.institutionLogo,
    createdAt: institution.createdAt.toISOString(),
    studentCount: institution._count?.studentProfiles ?? 0,
    teacherCount: institution._count?.teacherProfiles ?? 0
  }));
  const totalPages = Math.ceil(total / pageSize);
  return {
    items: mappedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};
var listStudents3 = async (query) => {
  const page = normalizePage2(query.page);
  const pageSize = normalizePageSize2(query.pageSize, 50);
  const skip = (page - 1) * pageSize;
  const where = query.search ? {
    OR: [
      { user: { name: { contains: query.search, mode: "insensitive" } } },
      { user: { email: { contains: query.search, mode: "insensitive" } } }
    ]
  } : {};
  const [items, total] = await Promise.all([
    prisma.studentProfile.findMany({
      where,
      select: {
        id: true,
        userId: true,
        institution: { select: { name: true } },
        department: { select: { fullName: true } },
        createdAt: true,
        user: { select: { name: true, email: true } }
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" }
    }),
    prisma.studentProfile.count({ where })
  ]);
  const mappedItems = items.map((student) => ({
    id: student.id,
    userId: student.userId,
    name: student.user.name,
    email: student.user.email,
    institutionName: student.institution?.name ?? "Unknown",
    departmentName: student.department?.fullName ?? null,
    enrolledAt: student.createdAt.toISOString()
  }));
  const totalPages = Math.ceil(total / pageSize);
  return {
    items: mappedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};
var listTeachers3 = async (query) => {
  const page = normalizePage2(query.page);
  const pageSize = normalizePageSize2(query.pageSize, 50);
  const skip = (page - 1) * pageSize;
  const where = query.search ? {
    OR: [
      { user: { name: { contains: query.search, mode: "insensitive" } } },
      { user: { email: { contains: query.search, mode: "insensitive" } } }
    ]
  } : {};
  const [items, total] = await Promise.all([
    prisma.teacherProfile.findMany({
      where,
      select: {
        id: true,
        userId: true,
        institution: { select: { name: true } },
        department: { select: { fullName: true } },
        createdAt: true,
        user: { select: { name: true, email: true } }
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" }
    }),
    prisma.teacherProfile.count({ where })
  ]);
  const mappedItems = items.map((teacher) => ({
    id: teacher.id,
    userId: teacher.userId,
    name: teacher.user.name,
    email: teacher.user.email,
    institutionName: teacher.institution?.name ?? "Unknown",
    departmentName: teacher.department?.fullName ?? null,
    joinedAt: teacher.createdAt.toISOString()
  }));
  const totalPages = Math.ceil(total / pageSize);
  return {
    items: mappedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};
var listRecentHighlights = async (query) => {
  const page = normalizePage2(query.page);
  const pageSize = normalizePageSize2(query.pageSize, 50);
  const skip = (page - 1) * pageSize;
  const take = page * pageSize;
  const [users, institutionApplications, teacherApplications, studentApplications, counts] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
      take
    }),
    prisma.institutionApplication.findMany({
      select: {
        id: true,
        institutionName: true,
        applicantUser: {
          select: {
            name: true,
            email: true
          }
        },
        createdAt: true
      },
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
      take
    }),
    prisma.teacherJobApplication.findMany({
      select: {
        id: true,
        posting: {
          select: {
            title: true
          }
        },
        teacherUser: {
          select: {
            name: true,
            email: true
          }
        },
        createdAt: true
      },
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
      take
    }),
    prisma.studentAdmissionApplication.findMany({
      select: {
        id: true,
        posting: {
          select: {
            title: true
          }
        },
        studentUser: {
          select: {
            name: true,
            email: true
          }
        },
        createdAt: true
      },
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
      take
    }),
    Promise.all([
      prisma.user.count(),
      prisma.institutionApplication.count(),
      prisma.teacherJobApplication.count(),
      prisma.studentAdmissionApplication.count()
    ])
  ]);
  const timeline = [
    ...users.map((user) => ({
      id: `user-${user.id}`,
      type: "USER_REGISTERED",
      actorName: user.name,
      actorEmail: user.email,
      title: `${user.name} registered`,
      description: `New ${user.role.toLowerCase()} account registration`,
      createdAt: user.createdAt.toISOString(),
      createdAtDate: user.createdAt
    })),
    ...institutionApplications.map((application) => ({
      id: `institution-application-${application.id}`,
      type: "INSTITUTION_APPLICATION",
      actorName: application.applicantUser.name,
      actorEmail: application.applicantUser.email,
      title: `${application.applicantUser.name} submitted institution application`,
      description: `Institution: ${application.institutionName}`,
      createdAt: application.createdAt.toISOString(),
      createdAtDate: application.createdAt
    })),
    ...teacherApplications.map((application) => ({
      id: `teacher-application-${application.id}`,
      type: "TEACHER_JOB_APPLICATION",
      actorName: application.teacherUser.name,
      actorEmail: application.teacherUser.email,
      title: `${application.teacherUser.name} applied for teacher post`,
      description: `Post: ${application.posting.title}`,
      createdAt: application.createdAt.toISOString(),
      createdAtDate: application.createdAt
    })),
    ...studentApplications.map((application) => ({
      id: `student-application-${application.id}`,
      type: "STUDENT_ADMISSION_APPLICATION",
      actorName: application.studentUser.name,
      actorEmail: application.studentUser.email,
      title: `${application.studentUser.name} submitted admission application`,
      description: `Post: ${application.posting.title}`,
      createdAt: application.createdAt.toISOString(),
      createdAtDate: application.createdAt
    }))
  ];
  timeline.sort((a, b) => {
    if (query.sort === "asc") {
      return a.createdAtDate.getTime() - b.createdAtDate.getTime();
    }
    return b.createdAtDate.getTime() - a.createdAtDate.getTime();
  });
  const items = timeline.slice(skip, skip + pageSize).map(({ createdAtDate: _, ...item }) => item);
  const total = counts.reduce((sum, value) => sum + value, 0);
  const totalPages = Math.ceil(total / pageSize);
  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};
var SuperAdminService = {
  listAdmins,
  listInstitutions,
  listStudents: listStudents3,
  listTeachers: listTeachers3,
  listRecentHighlights
};

// src/app/module/superadmin/superadmin.controller.ts
var readPositiveInt2 = (value, defaultValue = 1) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};
var readQueryValue10 = (value) => {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
};
var listAdmins2 = catchAsync(async (req, res) => {
  const query = {
    page: readPositiveInt2(req.query.page, 1),
    pageSize: readPositiveInt2(req.query.pageSize, 20),
    search: readQueryValue10(req.query.search),
    sort: req.query.sort === "asc" ? "asc" : "desc"
  };
  const result = await SuperAdminService.listAdmins(query);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Admins fetched successfully",
    data: result
  });
});
var listInstitutions2 = catchAsync(async (req, res) => {
  const query = {
    page: readPositiveInt2(req.query.page, 1),
    pageSize: readPositiveInt2(req.query.pageSize, 20),
    search: readQueryValue10(req.query.search),
    sort: req.query.sort === "asc" ? "asc" : "desc"
  };
  const result = await SuperAdminService.listInstitutions(query);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institutions fetched successfully",
    data: result
  });
});
var listStudents4 = catchAsync(async (req, res) => {
  const query = {
    page: readPositiveInt2(req.query.page, 1),
    pageSize: readPositiveInt2(req.query.pageSize, 20),
    search: readQueryValue10(req.query.search),
    sort: req.query.sort === "asc" ? "asc" : "desc"
  };
  const result = await SuperAdminService.listStudents(query);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Students fetched successfully",
    data: result
  });
});
var listTeachers4 = catchAsync(async (req, res) => {
  const query = {
    page: readPositiveInt2(req.query.page, 1),
    pageSize: readPositiveInt2(req.query.pageSize, 20),
    search: readQueryValue10(req.query.search),
    sort: req.query.sort === "asc" ? "asc" : "desc"
  };
  const result = await SuperAdminService.listTeachers(query);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teachers fetched successfully",
    data: result
  });
});
var listRecentHighlights2 = catchAsync(async (req, res) => {
  const query = {
    page: readPositiveInt2(req.query.page, 1),
    pageSize: readPositiveInt2(req.query.pageSize, 6),
    sort: req.query.sort === "asc" ? "asc" : "desc"
  };
  const result = await SuperAdminService.listRecentHighlights(query);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Recent highlights fetched successfully",
    data: result
  });
});
var SuperAdminController = {
  listAdmins: listAdmins2,
  listInstitutions: listInstitutions2,
  listStudents: listStudents4,
  listTeachers: listTeachers4,
  listRecentHighlights: listRecentHighlights2
};

// src/app/module/superadmin/superadmin.route.ts
var router15 = Router15();
router15.get(
  "/admins",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listAdmins
);
router15.get(
  "/institutions",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listInstitutions
);
router15.get(
  "/students",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listStudents
);
router15.get(
  "/teachers",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listTeachers
);
router15.get(
  "/recent-highlights",
  requireSessionRole("SUPERADMIN"),
  SuperAdminController.listRecentHighlights
);
var SuperAdminRouter = router15;

// src/app/routes/index.ts
var router16 = Router16();
router16.use("/ai", AIRouter);
router16.use("/auth", AuthRoutes);
router16.use("/classrooms", ClassroomRouter);
router16.use("/department", DepartmentRouter);
router16.use("/faculty", FacultyProfileRouter);
router16.use("/home", HomeRouter);
router16.use("/institute", InstituteRoutes);
router16.use("/institution-applications", InstitutionApplicationRouter);
router16.use("/institution-admin", InstitutionAdminRouter);
router16.use("/notices", NoticeRouter);
router16.use("/postings", PostingRouter);
router16.use("/routines", RoutineRouter);
router16.use("/superadmin", SuperAdminRouter);
router16.use("/teacher", TeacherRouter);
router16.use("/student", StudentRouter);
var IndexRouters = router16;

// src/app.ts
var app = express();
var originPolicy = buildOriginPolicy();
var isNoOriginRequest = (origin) => {
  if (!origin) {
    return true;
  }
  return origin.trim().toLowerCase() === "null";
};
var isAllowedRequestOrigin = (origin) => {
  if (isNoOriginRequest(origin)) {
    return true;
  }
  if (typeof origin !== "string") {
    return false;
  }
  return originPolicy.isAllowedOrigin(origin);
};
var isPaymentGatewayCallbackPath = (path3) => path3.startsWith("/api/v1/student/fees/payment/") || path3.startsWith("/api/v1/institution-applications/admin/subscription/payment/") || path3.startsWith("/api/v1/institution-admin/subscription/renew/payment/");
var corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedRequestOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};
app.use((req, res, next) => {
  if (isPaymentGatewayCallbackPath(req.path)) {
    next();
    return;
  }
  const origin = req.headers.origin;
  if (isAllowedRequestOrigin(origin)) {
    next();
    return;
  }
  res.status(403).json({
    success: false,
    message: "CORS origin denied",
    errors: [{ path: "origin", message: `Origin ${origin} is not allowed` }]
  });
});
app.use(
  cors(corsOptions)
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var authHandler = toNodeHandler(auth);
app.all("/api/auth", authHandler);
app.all(/^\/api\/auth\/.*/, authHandler);
app.use("/api/v1/", IndexRouters);
app.get("/", (req, res) => {
  res.send("Welcome to Biddyaloy!");
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;
export {
  app_default as default
};
