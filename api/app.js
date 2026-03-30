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
import { Router as Router13 } from "express";

// src/app/module/classroom/classroom.route.ts
import { Router } from "express";

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
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n  requestedTransferRequests            InstitutionTransferRequest[]  @relation("TransferRequestRequesterUser")\n  reviewedTransferRequests             InstitutionTransferRequest[]  @relation("TransferRequestReviewerUser")\n  sentNotices                          Notice[]                      @relation("NoticeSenderUser")\n  readNotices                          NoticeRead[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                           Program[]\n  batches                            Batch[]\n  courses                            Course[]\n  sections                           Section[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  transferRequestsAsTargetDepartment InstitutionTransferRequest[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionTransferEntityType {\n  STUDENT\n  TEACHER\n}\n\nenum InstitutionTransferStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  CANCELLED\n}\n\nenum NoticeAudienceRole {\n  ADMIN\n  FACULTY\n  DEPARTMENT\n  TEACHER\n  STUDENT\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                               @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                             @default(now())\n  updatedAt                   DateTime                             @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n  schedules                   Schedule[]\n  routines                    Routine[]\n  notices                     Notice[]\n  sourceTransferRequests      InstitutionTransferRequest[]         @relation("TransferRequestSourceInstitution")\n  targetTransferRequests      InstitutionTransferRequest[]         @relation("TransferRequestTargetInstitution")\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel InstitutionTransferRequest {\n  id String @id @default(uuid())\n\n  entityType InstitutionTransferEntityType\n  status     InstitutionTransferStatus     @default(PENDING)\n\n  sourceInstitutionId String\n  sourceInstitution   Institution @relation("TransferRequestSourceInstitution", fields: [sourceInstitutionId], references: [id])\n\n  targetInstitutionId String\n  targetInstitution   Institution @relation("TransferRequestTargetInstitution", fields: [targetInstitutionId], references: [id])\n\n  requesterUserId String\n  requesterUser   User   @relation("TransferRequestRequesterUser", fields: [requesterUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TransferRequestReviewerUser", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  targetDepartmentId String?\n  targetDepartment   Department? @relation(fields: [targetDepartmentId], references: [id])\n\n  requestMessage  String?\n  responseMessage String?\n\n  requestedAt DateTime  @default(now())\n  reviewedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceInstitutionId, status])\n  @@index([targetInstitutionId, status])\n  @@index([requesterUserId])\n  @@index([studentProfileId])\n  @@index([teacherProfileId])\n  @@map("institution_transfer_requests")\n}\n\nmodel Notice {\n  id      String @id @default(uuid())\n  title   String\n  content String\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  senderUserId String\n  senderUser   User               @relation("NoticeSenderUser", fields: [senderUserId], references: [id])\n  senderRole   NoticeAudienceRole\n\n  recipients NoticeRecipientRole[]\n  reads      NoticeRead[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, createdAt])\n  @@index([senderUserId, createdAt])\n  @@map("notices")\n}\n\nmodel NoticeRecipientRole {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  role NoticeAudienceRole\n\n  createdAt DateTime @default(now())\n\n  @@unique([noticeId, role])\n  @@index([role])\n  @@map("notice_recipient_roles")\n}\n\nmodel NoticeRead {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  readAt DateTime @default(now())\n\n  @@unique([noticeId, userId])\n  @@index([userId, readAt])\n  @@map("notice_reads")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  semesterId String?\n  semester   Semester? @relation(fields: [semesterId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  startTime String\n  endTime   String\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@index([semesterId])\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  schedules           Schedule[]\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n  transferRequests      InstitutionTransferRequest[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n  transferRequests          InstitutionTransferRequest[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"requestedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestRequesterUser"},{"name":"reviewedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestReviewerUser"},{"name":"sentNotices","kind":"object","type":"Notice","relationName":"NoticeSenderUser"},{"name":"readNotices","kind":"object","type":"NoticeRead","relationName":"NoticeReadToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentToStudentFeePayment"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"DepartmentToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"DepartmentToRoutine"},{"name":"transferRequestsAsTargetDepartment","kind":"object","type":"InstitutionTransferRequest","relationName":"DepartmentToInstitutionTransferRequest"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"InstitutionToStudentFeePayment"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"InstitutionToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"InstitutionToRoutine"},{"name":"notices","kind":"object","type":"Notice","relationName":"InstitutionToNotice"},{"name":"sourceTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestSourceInstitution"},{"name":"targetTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestTargetInstitution"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"InstitutionTransferRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"entityType","kind":"enum","type":"InstitutionTransferEntityType"},{"name":"status","kind":"enum","type":"InstitutionTransferStatus"},{"name":"sourceInstitutionId","kind":"scalar","type":"String"},{"name":"sourceInstitution","kind":"object","type":"Institution","relationName":"TransferRequestSourceInstitution"},{"name":"targetInstitutionId","kind":"scalar","type":"String"},{"name":"targetInstitution","kind":"object","type":"Institution","relationName":"TransferRequestTargetInstitution"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"TransferRequestRequesterUser"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TransferRequestReviewerUser"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"targetDepartmentId","kind":"scalar","type":"String"},{"name":"targetDepartment","kind":"object","type":"Department","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"requestMessage","kind":"scalar","type":"String"},{"name":"responseMessage","kind":"scalar","type":"String"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_transfer_requests"},"Notice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToNotice"},{"name":"senderUserId","kind":"scalar","type":"String"},{"name":"senderUser","kind":"object","type":"User","relationName":"NoticeSenderUser"},{"name":"senderRole","kind":"enum","type":"NoticeAudienceRole"},{"name":"recipients","kind":"object","type":"NoticeRecipientRole","relationName":"NoticeToNoticeRecipientRole"},{"name":"reads","kind":"object","type":"NoticeRead","relationName":"NoticeToNoticeRead"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notices"},"NoticeRecipientRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRecipientRole"},{"name":"role","kind":"enum","type":"NoticeAudienceRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_recipient_roles"},"NoticeRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRead"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NoticeReadToUser"},{"name":"readAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_reads"},"DepartmentSemesterFeeConfiguration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"totalFeeAmount","kind":"scalar","type":"Decimal"},{"name":"monthlyFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"}],"dbName":"department_semester_fee_configurations"},"StudentFeePayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentFeePayment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentFeePayment"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SemesterToStudentFeePayment"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentFeePaymentToStudentProfile"},{"name":"feeConfigurationId","kind":"scalar","type":"String"},{"name":"feeConfiguration","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"},{"name":"paymentMode","kind":"enum","type":"StudentFeePaymentMode"},{"name":"status","kind":"enum","type":"StudentFeePaymentStatus"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paymentInitiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_fee_payments"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToRoutine"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"ScheduleToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSchedule"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSchedule"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"ScheduleToSemester"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"SemesterToStudentFeePayment"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"StudentFeePaymentToStudentProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","schedules","courseRegistrations","section","course","teacherProfile","sectionTeacherAssignments","classwork","classworkSubmissions","applications","_count","posting","studentUser","reviewerUser","studentProfile","admissionApplications","semester","feePayments","feeConfiguration","sourceInstitution","targetInstitution","requesterUser","targetDepartment","transferRequests","submissions","classworks","sections","batch","feeConfigurations","schedule","courseRegistration","routines","classRoom","attendances","mark","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","transferRequestsAsTargetDepartment","departments","faculties","classrooms","applicantUser","reviewedByUser","institutionApplications","senderUser","notice","recipients","reads","notices","sourceTransferRequests","targetTransferRequests","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","requestedTransferRequests","reviewedTransferRequests","sentNotices","readNotices","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","InstitutionTransferRequest.findUnique","InstitutionTransferRequest.findUniqueOrThrow","InstitutionTransferRequest.findFirst","InstitutionTransferRequest.findFirstOrThrow","InstitutionTransferRequest.findMany","InstitutionTransferRequest.createOne","InstitutionTransferRequest.createMany","InstitutionTransferRequest.createManyAndReturn","InstitutionTransferRequest.updateOne","InstitutionTransferRequest.updateMany","InstitutionTransferRequest.updateManyAndReturn","InstitutionTransferRequest.upsertOne","InstitutionTransferRequest.deleteOne","InstitutionTransferRequest.deleteMany","InstitutionTransferRequest.groupBy","InstitutionTransferRequest.aggregate","Notice.findUnique","Notice.findUniqueOrThrow","Notice.findFirst","Notice.findFirstOrThrow","Notice.findMany","Notice.createOne","Notice.createMany","Notice.createManyAndReturn","Notice.updateOne","Notice.updateMany","Notice.updateManyAndReturn","Notice.upsertOne","Notice.deleteOne","Notice.deleteMany","Notice.groupBy","Notice.aggregate","NoticeRecipientRole.findUnique","NoticeRecipientRole.findUniqueOrThrow","NoticeRecipientRole.findFirst","NoticeRecipientRole.findFirstOrThrow","NoticeRecipientRole.findMany","NoticeRecipientRole.createOne","NoticeRecipientRole.createMany","NoticeRecipientRole.createManyAndReturn","NoticeRecipientRole.updateOne","NoticeRecipientRole.updateMany","NoticeRecipientRole.updateManyAndReturn","NoticeRecipientRole.upsertOne","NoticeRecipientRole.deleteOne","NoticeRecipientRole.deleteMany","NoticeRecipientRole.groupBy","NoticeRecipientRole.aggregate","NoticeRead.findUnique","NoticeRead.findUniqueOrThrow","NoticeRead.findFirst","NoticeRead.findFirstOrThrow","NoticeRead.findMany","NoticeRead.createOne","NoticeRead.createMany","NoticeRead.createManyAndReturn","NoticeRead.updateOne","NoticeRead.updateMany","NoticeRead.updateManyAndReturn","NoticeRead.upsertOne","NoticeRead.deleteOne","NoticeRead.deleteMany","NoticeRead.groupBy","NoticeRead.aggregate","DepartmentSemesterFeeConfiguration.findUnique","DepartmentSemesterFeeConfiguration.findUniqueOrThrow","DepartmentSemesterFeeConfiguration.findFirst","DepartmentSemesterFeeConfiguration.findFirstOrThrow","DepartmentSemesterFeeConfiguration.findMany","DepartmentSemesterFeeConfiguration.createOne","DepartmentSemesterFeeConfiguration.createMany","DepartmentSemesterFeeConfiguration.createManyAndReturn","DepartmentSemesterFeeConfiguration.updateOne","DepartmentSemesterFeeConfiguration.updateMany","DepartmentSemesterFeeConfiguration.updateManyAndReturn","DepartmentSemesterFeeConfiguration.upsertOne","DepartmentSemesterFeeConfiguration.deleteOne","DepartmentSemesterFeeConfiguration.deleteMany","DepartmentSemesterFeeConfiguration.groupBy","DepartmentSemesterFeeConfiguration.aggregate","StudentFeePayment.findUnique","StudentFeePayment.findUniqueOrThrow","StudentFeePayment.findFirst","StudentFeePayment.findFirstOrThrow","StudentFeePayment.findMany","StudentFeePayment.createOne","StudentFeePayment.createMany","StudentFeePayment.createManyAndReturn","StudentFeePayment.updateOne","StudentFeePayment.updateMany","StudentFeePayment.updateManyAndReturn","StudentFeePayment.upsertOne","StudentFeePayment.deleteOne","StudentFeePayment.deleteMany","StudentFeePayment.groupBy","StudentFeePayment.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","feeConfigurationId","StudentFeePaymentMode","paymentMode","StudentFeePaymentStatus","monthsCovered","amount","currency","gatewayName","tranId","gatewaySessionKey","gatewayValId","gatewayBankTranId","gatewayCardType","gatewayStatus","gatewayRawPayload","paymentInitiatedAt","paidAt","totalFeeAmount","monthlyFeeAmount","isActive","noticeId","readAt","NoticeAudienceRole","role","senderUserId","senderRole","InstitutionTransferEntityType","entityType","InstitutionTransferStatus","sourceInstitutionId","targetInstitutionId","requesterUserId","targetDepartmentId","requestMessage","responseMessage","requestedAt","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","InstitutionApplicationStatus","rejectionReason","reviewedByUserId","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","accountStatus","date","AttendanceStatus","AdminRole","noticeId_userId","noticeId_role","postingId_teacherUserId","courseRegistrationId_date","departmentId_semesterId","postingId_studentUserId","classworkId_studentProfileId","sectionId_courseId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "0xvSAuAECwMAAOAJACAHAADsCgAguwUAALULADC8BQAACwAQvQUAALULADC-BQEAAAABwwUBANsJACHFBQEAAAABxgVAAN8JACHHBUAA3wkAIb8GAAC2C_oGIgEAAAABACAMAwAA4AkAILsFAAC4CwAwvAUAAAMAEL0FAAC4CwAwvgUBANsJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACHfBkAA3wkAIesGAQDbCQAh7AYBANwJACHtBgEA3AkAIQMDAACkDQAg7AYAALkLACDtBgAAuQsAIAwDAADgCQAguwUAALgLADC8BQAAAwAQvQUAALgLADC-BQEAAAABxQUBANsJACHGBUAA3wkAIccFQADfCQAh3wZAAN8JACHrBgEAAAAB7AYBANwJACHtBgEA3AkAIQMAAAADACABAAAEADACAAAFACARAwAA4AkAILsFAAC3CwAwvAUAAAcAEL0FAAC3CwAwvgUBANsJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACHiBgEA2wkAIeMGAQDbCQAh5AYBANwJACHlBgEA3AkAIeYGAQDcCQAh5wZAAPAKACHoBkAA8AoAIekGAQDcCQAh6gYBANwJACEIAwAApA0AIOQGAAC5CwAg5QYAALkLACDmBgAAuQsAIOcGAAC5CwAg6AYAALkLACDpBgAAuQsAIOoGAAC5CwAgEQMAAOAJACC7BQAAtwsAMLwFAAAHABC9BQAAtwsAML4FAQAAAAHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACHiBgEA2wkAIeMGAQDbCQAh5AYBANwJACHlBgEA3AkAIeYGAQDcCQAh5wZAAPAKACHoBkAA8AoAIekGAQDcCQAh6gYBANwJACEDAAAABwAgAQAACAAwAgAACQAgCwMAAOAJACAHAADsCgAguwUAALULADC8BQAACwAQvQUAALULADC-BQEA2wkAIcMFAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAhvwYAALYL-gYiAgMAAKQNACAHAACOFwAgAwAAAAsAIAEAAAwAMAIAAAEAIBYDAADgCQAgBwAA7AoAIAkAAIgLACANAAD9CQAgEQAAvgoAICIAAMUKACAkAADACgAgRgAAjgoAIEcAAMIKACC7BQAAtAsAMLwFAAAOABC9BQAAtAsAML4FAQDbCQAhvwUBANsJACHABQEA2wkAIcEFAQDbCQAhwgUBANwJACHDBQEA2wkAIcQFAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAhCgMAAKQNACAHAACOFwAgCQAAkhcAIA0AALcPACARAAD9FAAgIgAAhBUAICQAAP8UACBGAACmEAAgRwAAgRUAIMIFAAC5CwAgFgMAAOAJACAHAADsCgAgCQAAiAsAIA0AAP0JACARAAC-CgAgIgAAxQoAICQAAMAKACBGAACOCgAgRwAAwgoAILsFAAC0CwAwvAUAAA4AEL0FAAC0CwAwvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBANsJACHCBQEA3AkAIcMFAQDbCQAhxAUBANsJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACEDAAAADgAgAQAADwAwAgAAEAAgDAcAAPIKACA5AACzCwAguwUAALILADC8BQAAEgAQvQUAALILADC-BQEA2wkAIcMFAQDcCQAhxgVAAN8JACHHBUAA3wkAIZQGAQDcCQAhzgYBANwJACHVBgEA2wkAIQUHAACOFwAgOQAAohcAIMMFAAC5CwAglAYAALkLACDOBgAAuQsAIAwHAADyCgAgOQAAswsAILsFAACyCwAwvAUAABIAEL0FAACyCwAwvgUBAAAAAcMFAQDcCQAhxgVAAN8JACHHBUAA3wkAIZQGAQDcCQAhzgYBANwJACHVBgEA2wkAIQMAAAASACABAAATADACAAAUACAiBgAAuwoAIAwAAPsJACANAAD9CQAgEQAAvgoAIBwAAP8JACAlAAD8CQAgJwAA_gkAICoAAMMKACAuAAC3CgAgLwAAuAoAIDAAALoKACAxAAC8CgAgMgAAvQoAIDQAAI4KACA1AADACgAgNgAAwQoAIDcAAMIKACA6AAC2CgAgOwAAuQoAID4AAL8KACBDAADECgAgRAAAxQoAIEUAAMUKACC7BQAAtAoAMLwFAAAWABC9BQAAtAoAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIfIFAAC1CtAGI44GAQDbCQAhlAYBANwJACHOBgEA3AkAIdEGAQDcCQAhAQAAABYAIBwIAACxCwAgDAAA-wkAIA0AAP0JACARAAC-CgAgHAAA_wkAICUAAPwJACAnAAD-CQAgKgAAwwoAIC4AALcKACAvAAC4CgAgMAAAugoAIDEAALwKACAyAAC9CgAgNAAAjgoAIDUAAMAKACA2AADBCgAgNwAAwgoAIDgAAMUKACC7BQAAsAsAMLwFAAAYABC9BQAAsAsAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIZQGAQDcCQAhpQYBANwJACHOBgEA3AkAIdUGAQDbCQAhFQgAAKEXACAMAAC1DwAgDQAAtw8AIBEAAP0UACAcAAC5DwAgJQAAtg8AICcAALgPACAqAACCFQAgLgAA9hQAIC8AAPcUACAwAAD5FAAgMQAA-xQAIDIAAPwUACA0AACmEAAgNQAA_xQAIDYAAIAVACA3AACBFQAgOAAAhBUAIJQGAAC5CwAgpQYAALkLACDOBgAAuQsAIBwIAACxCwAgDAAA-wkAIA0AAP0JACARAAC-CgAgHAAA_wkAICUAAPwJACAnAAD-CQAgKgAAwwoAIC4AALcKACAvAAC4CgAgMAAAugoAIDEAALwKACAyAAC9CgAgNAAAjgoAIDUAAMAKACA2AADBCgAgNwAAwgoAIDgAAMUKACC7BQAAsAsAMLwFAAAYABC9BQAAsAsAML4FAQAAAAHGBUAA3wkAIccFQADfCQAhlAYBANwJACGlBgEA3AkAIc4GAQDcCQAh1QYBANsJACEDAAAAGAAgAQAAGQAwAgAAGgAgAQAAABIAIBIHAADsCgAgCQAAiAsAIA0AAP0JACAPAAC6CgAguwUAAK8LADC8BQAAHQAQvQUAAK8LADC-BQEA2wkAIcMFAQDbCQAhxAUBANsJACHGBUAA3wkAIccFQADfCQAh7wUBANsJACGUBgEA3AkAIZ4GAQDcCQAhnwZAAPAKACGgBggA9woAIaEGCAD3CgAhCQcAAI4XACAJAACSFwAgDQAAtw8AIA8AAPkUACCUBgAAuQsAIJ4GAAC5CwAgnwYAALkLACCgBgAAuQsAIKEGAAC5CwAgEgcAAOwKACAJAACICwAgDQAA_QkAIA8AALoKACC7BQAArwsAMLwFAAAdABC9BQAArwsAML4FAQAAAAHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhlAYBANwJACGeBgEA3AkAIZ8GQADwCgAhoAYIAPcKACGhBggA9woAIQMAAAAdACABAAAeADACAAAfACASBwAA7AoAIAkAAIgLACAKAACtCwAgDQAA_QkAIBEAAL4KACC7BQAArgsAMLwFAAAhABC9BQAArgsAML4FAQDbCQAhwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACGUBgEA3AkAIaAGAgCiCwAhpgYBANwJACHXBgEA2wkAIdgGAQDbCQAhCAcAAI4XACAJAACSFwAgCgAAoBcAIA0AALcPACARAAD9FAAglAYAALkLACCgBgAAuQsAIKYGAAC5CwAgEgcAAOwKACAJAACICwAgCgAArQsAIA0AAP0JACARAAC-CgAguwUAAK4LADC8BQAAIQAQvQUAAK4LADC-BQEAAAABwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACGUBgEA3AkAIaAGAgCiCwAhpgYBANwJACHXBgEAAAAB2AYBANsJACEDAAAAIQAgAQAAIgAwAgAAIwAgAQAAAB0AIBoHAADsCgAgCQAA-goAIAoAAK0LACALAADDCgAgDgAAnQsAIA8AAKALACAQAAD5CgAgGQAAkgsAIBsAAIkLACAsAACrCwAgLQAArAsAILsFAACqCwAwvAUAACYAEL0FAACqCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIeYFAQDbCQAh5wUBANsJACHoBQEA2wkAIeoFAQDbCQAhlgYBANsJACGmBgEA3AkAIdYGQADfCQAhDQcAAI4XACAJAACSFwAgCgAAoBcAIAsAAIIVACAOAACZFwAgDwAAmhcAIBAAAJEXACAZAACVFwAgGwAAlBcAICwAAJ4XACAtAACfFwAgxAUAALkLACCmBgAAuQsAIBoHAADsCgAgCQAA-goAIAoAAK0LACALAADDCgAgDgAAnQsAIA8AAKALACAQAAD5CgAgGQAAkgsAIBsAAIkLACAsAACrCwAgLQAArAsAILsFAACqCwAwvAUAACYAEL0FAACqCwAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHnBQEA2wkAIegFAQDbCQAh6gUBANsJACGWBgEA2wkAIaYGAQDcCQAh1gZAAN8JACEDAAAAJgAgAQAAJwAwAgAAKAAgEwcAAPIKACAJAAD6CgAgKAAAqAsAICkAAPgKACArAACpCwAguwUAAKcLADC8BQAAKgAQvQUAAKcLADC-BQEA2wkAIcMFAQDcCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh_AUBANsJACGOBgEA2wkAIZQGAQDcCQAhmwYBANwJACGcBgEA2wkAIZ0GAQDbCQAhCQcAAI4XACAJAACSFwAgKAAAnBcAICkAAJAXACArAACdFwAgwwUAALkLACDEBQAAuQsAIJQGAAC5CwAgmwYAALkLACATBwAA8goAIAkAAPoKACAoAACoCwAgKQAA-AoAICsAAKkLACC7BQAApwsAMLwFAAAqABC9BQAApwsAML4FAQAAAAHDBQEA3AkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIfwFAQDbCQAhjgYBANsJACGUBgEA3AkAIZsGAQDcCQAhnAYBANsJACGdBgEA2wkAIQMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgDQwAAPsJACANAAD9CQAgHAAA_wkAICUAAPwJACAnAAD-CQAguwUAAPoJADC8BQAALwAQvQUAAPoJADC-BQEA2wkAIcMFAQDbCQAhjgYBANsJACGPBkAA3wkAIZAGQADfCQAhAQAAAC8AIBIHAADyCgAgCQAA-goAIAsAAMMKACAbAACmCwAguwUAAKQLADC8BQAAMQAQvQUAAKQLADC-BQEA2wkAIcMFAQDcCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh9gUAAKULmwYijgYBANsJACGUBgEA3AkAIZYGAQDcCQAhmAYBANsJACGZBgEA2wkAIQgHAACOFwAgCQAAkhcAIAsAAIIVACAbAACUFwAgwwUAALkLACDEBQAAuQsAIJQGAAC5CwAglgYAALkLACASBwAA8goAIAkAAPoKACALAADDCgAgGwAApgsAILsFAACkCwAwvAUAADEAEL0FAACkCwAwvgUBAAAAAcMFAQDcCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh9gUAAKULmwYijgYBANsJACGUBgEA3AkAIZYGAQDcCQAhmAYBANsJACGZBgEA2wkAIQMAAAAxACABAAAyADACAAAzACAUBwAA7AoAIAkAAPoKACANAAD9CQAgEQAAvgoAIBsAAIkLACAkAADACgAgJgAAowsAILsFAAChCwAwvAUAADUAEL0FAAChCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACGVBgIAogsAIZYGAQDbCQAhlwYBANwJACELBwAAjhcAIAkAAJIXACANAAC3DwAgEQAA_RQAIBsAAJQXACAkAAD_FAAgJgAAmxcAIMQFAAC5CwAglAYAALkLACCVBgAAuQsAIJcGAAC5CwAgFAcAAOwKACAJAAD6CgAgDQAA_QkAIBEAAL4KACAbAACJCwAgJAAAwAoAICYAAKMLACC7BQAAoQsAMLwFAAA1ABC9BQAAoQsAML4FAQAAAAHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACGVBgIAogsAIZYGAQDbCQAhlwYBANwJACEDAAAANQAgAQAANgAwAgAANwAgAwAAACYAIAEAACcAMAIAACgAIBAHAADsCgAgCQAA-goAIA4AAJ0LACAPAACgCwAgEAAA-QoAILsFAACfCwAwvAUAADoAEL0FAACfCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIeYFAQDbCQAh5wUBANsJACHoBQEA2wkAIQYHAACOFwAgCQAAkhcAIA4AAJkXACAPAACaFwAgEAAAkRcAIMQFAAC5CwAgEQcAAOwKACAJAAD6CgAgDgAAnQsAIA8AAKALACAQAAD5CgAguwUAAJ8LADC8BQAAOgAQvQUAAJ8LADC-BQEAAAABwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHmBQEA2wkAIecFAQDbCQAh6AUBANsJACGBBwAAngsAIAMAAAA6ACABAAA7ADACAAA8ACABAAAAGAAgEwcAAOwKACAJAAD6CgAgDgAAnQsAIBAAAPkKACAjAADBCgAguwUAAJsLADC8BQAAPwAQvQUAAJsLADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHoBQEA2wkAIe8FAQDbCQAh8AUBANwJACHyBQAAnAvyBSLzBUAA8AoAIQgHAACOFwAgCQAAkhcAIA4AAJkXACAQAACRFwAgIwAAgBUAIMQFAAC5CwAg8AUAALkLACDzBQAAuQsAIBMHAADsCgAgCQAA-goAIA4AAJ0LACAQAAD5CgAgIwAAwQoAILsFAACbCwAwvAUAAD8AEL0FAACbCwAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHoBQEA2wkAIe8FAQDbCQAh8AUBANwJACHyBQAAnAvyBSLzBUAA8AoAIQMAAAA_ACABAABAADACAABBACABAAAAGAAgEgcAAOwKACAJAAD6CgAgEgAAmgsAIBkAAJILACC7BQAAmQsAMLwFAABEABC9BQAAmQsAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHpBQEA2wkAIeoFAQDbCQAh6wUBANwJACHsBQEA3AkAIe0FAQDcCQAh7gVAAN8JACEIBwAAjhcAIAkAAJIXACASAACYFwAgGQAAlRcAIMQFAAC5CwAg6wUAALkLACDsBQAAuQsAIO0FAAC5CwAgEwcAAOwKACAJAAD6CgAgEgAAmgsAIBkAAJILACC7BQAAmQsAMLwFAABEABC9BQAAmQsAML4FAQAAAAHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIekFAQDbCQAh6gUBANsJACHrBQEA3AkAIewFAQDcCQAh7QUBANwJACHuBUAA3wkAIYAHAACYCwAgAwAAAEQAIAEAAEUAMAIAAEYAIAEAAAAYACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAAEQAIAEAAEUAMAIAAEYAIBMWAACXCwAgFwAA4AkAIBgAAPEKACAZAACNCwAguwUAAJULADC8BQAASwAQvQUAAJULADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHqBQEA3AkAIfQFAQDcCQAh9gUAAJYLjAYi9wUBANwJACH4BUAA8AoAIfkFQADfCQAh-gUBANsJACH7BQEA3AkAIYwGAQDbCQAhCRYAAJcXACAXAACkDQAgGAAApA0AIBkAAJUXACDqBQAAuQsAIPQFAAC5CwAg9wUAALkLACD4BQAAuQsAIPsFAAC5CwAgFBYAAJcLACAXAADgCQAgGAAA8QoAIBkAAI0LACC7BQAAlQsAMLwFAABLABC9BQAAlQsAML4FAQAAAAHGBUAA3wkAIccFQADfCQAh6gUBANwJACH0BQEA3AkAIfYFAACWC4wGIvcFAQDcCQAh-AVAAPAKACH5BUAA3wkAIfoFAQDbCQAh-wUBANwJACGMBgEA2wkAIf8GAACUCwAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACABAAAASwAgJAQAANYKACAFAADXCgAgBgAAuwoAIBAAALwKACAZAAC9CgAgNAAAjgoAID4AAL8KACBIAAC_CgAgSQAAjgoAIEoAANgKACBLAACLCgAgTAAAiwoAIE0AANkKACBOAADaCgAgTwAAxQoAIFAAAMUKACBRAADECgAgUgAA2woAILsFAADVCgAwvAUAAFEAEL0FAADVCgAwvgUBANsJACHCBQEA3AkAIcYFQADfCQAhxwVAAN8JACGOBgEA2wkAIb8GAQDbCQAh7gYBANsJACHvBiAA3gkAIfAGAQDcCQAh8QYBANwJACHyBgEA3AkAIfMGAQDcCQAh9AYBANwJACH1BgEA3AkAIfYGAQDbCQAhAQAAAFEAIBMDAADgCQAgBwAA7AoAIAkAAPoKACANAAD9CQAgEwAAwQoAIBoAAIsKACAcAAD_CQAgIgAAxQoAILsFAACACwAwvAUAAFMAEL0FAACACwAwvgUBANsJACHCBQEA3AkAIcMFAQDbCQAhxAUBANwJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACGKBgEA2wkAIQEAAABTACAfBwAA7AoAIAkAAIgLACAZAACSCwAgGwAAiQsAIB0AAJMLACC7BQAAjgsAMLwFAABVABC9BQAAjgsAML4FAQDbCQAhwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACHqBQEA2wkAIfYFAACQC6wGIpYGAQDbCQAhqAYBANsJACGqBgAAjwuqBiKsBgIA9AoAIa0GEACHCwAhrgYBANsJACGvBgEA2wkAIbAGAQDbCQAhsQYBANwJACGyBgEA3AkAIbMGAQDcCQAhtAYBANwJACG1BgEA3AkAIbYGAACRCwAgtwZAAN8JACG4BkAA8AoAIQwHAACOFwAgCQAAkhcAIBkAAJUXACAbAACUFwAgHQAAlhcAILEGAAC5CwAgsgYAALkLACCzBgAAuQsAILQGAAC5CwAgtQYAALkLACC2BgAAuQsAILgGAAC5CwAgHwcAAOwKACAJAACICwAgGQAAkgsAIBsAAIkLACAdAACTCwAguwUAAI4LADC8BQAAVQAQvQUAAI4LADC-BQEAAAABwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACHqBQEA2wkAIfYFAACQC6wGIpYGAQDbCQAhqAYBANsJACGqBgAAjwuqBiKsBgIA9AoAIa0GEACHCwAhrgYBANsJACGvBgEA2wkAIbAGAQAAAAGxBgEAAAABsgYBANwJACGzBgEA3AkAIbQGAQDcCQAhtQYBANwJACG2BgAAkQsAILcGQADfCQAhuAZAAPAKACEDAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIAEAAABVACAaEAAA_woAIBgAAPEKACAZAACNCwAgHgAA7AoAIB8AAOwKACAgAADgCQAgIQAA-goAILsFAACKCwAwvAUAAFsAEL0FAACKCwAwvgUBANsJACHGBUAA3wkAIccFQADfCQAh6AUBANwJACHqBQEA3AkAIfYFAACMC8UGIvgFQADwCgAh-wUBANwJACHDBgAAiwvDBiLFBgEA2wkAIcYGAQDbCQAhxwYBANsJACHIBgEA3AkAIckGAQDcCQAhygYBANwJACHLBkAA3wkAIQ4QAACRFwAgGAAApA0AIBkAAJUXACAeAACOFwAgHwAAjhcAICAAAKQNACAhAACSFwAg6AUAALkLACDqBQAAuQsAIPgFAAC5CwAg-wUAALkLACDIBgAAuQsAIMkGAAC5CwAgygYAALkLACAaEAAA_woAIBgAAPEKACAZAACNCwAgHgAA7AoAIB8AAOwKACAgAADgCQAgIQAA-goAILsFAACKCwAwvAUAAFsAEL0FAACKCwAwvgUBAAAAAcYFQADfCQAhxwVAAN8JACHoBQEA3AkAIeoFAQDcCQAh9gUAAIwLxQYi-AVAAPAKACH7BQEA3AkAIcMGAACLC8MGIsUGAQDbCQAhxgYBANsJACHHBgEA2wkAIcgGAQDcCQAhyQYBANwJACHKBgEA3AkAIcsGQADfCQAhAwAAAFsAIAEAAFwAMAIAAF0AIAEAAABRACABAAAAUwAgAQAAAA4AIAEAAAAYACABAAAAJgAgAQAAAEQAIAEAAABLACABAAAAVQAgAQAAAFsAIAEAAAAYACABAAAARAAgAQAAABgAIA0HAADsCgAgCQAA-goAICUAAPwJACC7BQAAgQsAMLwFAABrABC9BQAAgQsAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACGOBgEA2wkAIZQGAQDcCQAhAQAAAGsAIAEAAAAYACADAAAANQAgAQAANgAwAgAANwAgAQAAADUAIAEAAAAmACABAAAAOgAgAQAAAD8AIAMAAAAmACABAAAnADACAAAoACARBwAA7AoAIAkAAIgLACAbAACJCwAgHAAA_wkAILsFAACGCwAwvAUAAHQAEL0FAACGCwAwvgUBANsJACHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIZYGAQDbCQAhrgYBANsJACG5BhAAhwsAIboGEACHCwAhuwYgAN4JACEEBwAAjhcAIAkAAJIXACAbAACUFwAgHAAAuQ8AIBIHAADsCgAgCQAAiAsAIBsAAIkLACAcAAD_CQAguwUAAIYLADC8BQAAdAAQvQUAAIYLADC-BQEAAAABwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACGWBgEA2wkAIa4GAQDbCQAhuQYQAIcLACG6BhAAhwsAIbsGIADeCQAh_gYAAIULACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIAEAAAAxACABAAAANQAgAQAAACYAIAEAAAB0ACABAAAAVQAgAQAAABYAIAEAAAAYACABAAAAKgAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACABAAAAFgAgAQAAABgAIAopAAD4CgAguwUAAIMLADC8BQAAhQEAEL0FAACDCwAwvgUBANsJACHGBUAA3wkAIccFQADfCQAh9gUAAIQL-QYi_AUBANsJACH3BkAA3wkAIQEpAACQFwAgCykAAPgKACC7BQAAgwsAMLwFAACFAQAQvQUAAIMLADC-BQEAAAABxgVAAN8JACHHBUAA3wkAIfYFAACEC_kGIvwFAQDbCQAh9wZAAN8JACH9BgAAggsAIAMAAACFAQAgAQAAhgEAMAIAAIcBACAbBwAA7AoAIAkAAPoKACAQAAD5CgAgKQAA-AoAILsFAAD2CgAwvAUAAIkBABC9BQAA9goAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHoBQEA2wkAIfwFAQDbCQAh_QUIAPcKACH-BQgA9woAIf8FCAD3CgAhgAYIAPcKACGBBggA9woAIYIGCAD3CgAhgwYIAPcKACGEBggA9woAIYUGCAD3CgAhhgYIAPcKACGHBggA9woAIYgGCAD3CgAhiQYIAPcKACEBAAAAiQEAIAEAAAAYACABAAAAGAAgAQAAAB0AIAEAAAAqACABAAAAhQEAIAMAAAA6ACABAAA7ADACAAA8ACABAAAAJgAgAQAAADoAIAMAAAAmACABAAAnADACAAAoACABAAAAIQAgAQAAACYAIAUHAACOFwAgCQAAkhcAICUAALYPACDEBQAAuQsAIJQGAAC5CwAgDQcAAOwKACAJAAD6CgAgJQAA_AkAILsFAACBCwAwvAUAAGsAEL0FAACBCwAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAhjgYBANsJACGUBgEA3AkAIQMAAABrACABAACWAQAwAgAAlwEAIAMAAAAhACABAAAiADACAAAjACADAAAANQAgAQAANgAwAgAANwAgAwAAAA4AIAEAAA8AMAIAABAAIAoDAACkDQAgBwAAjhcAIAkAAJIXACANAAC3DwAgEwAAgBUAIBoAAJUQACAcAAC5DwAgIgAAhBUAIMIFAAC5CwAgxAUAALkLACATAwAA4AkAIAcAAOwKACAJAAD6CgAgDQAA_QkAIBMAAMEKACAaAACLCgAgHAAA_wkAICIAAMUKACC7BQAAgAsAMLwFAABTABC9BQAAgAsAML4FAQAAAAHCBQEA3AkAIcMFAQDbCQAhxAUBANwJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACGKBgEAAAABAwAAAFMAIAEAAJwBADACAACdAQAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACAXBwAA7AoAIAkAAPoKACAQAAD_CgAgFgAA_goAIBgAAPEKACAzAADgCQAguwUAAPwKADC8BQAAoQEAEL0FAAD8CgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIdMFAQDbCQAh6AUBANwJACH0BQEA3AkAIfYFAAD9CvYFIvcFAQDcCQAh-AVAAPAKACH5BUAA3wkAIfoFAQDbCQAh-wUBANwJACEMBwAAjhcAIAkAAJIXACAQAACRFwAgFgAAkxcAIBgAAKQNACAzAACkDQAgxAUAALkLACDoBQAAuQsAIPQFAAC5CwAg9wUAALkLACD4BQAAuQsAIPsFAAC5CwAgGAcAAOwKACAJAAD6CgAgEAAA_woAIBYAAP4KACAYAADxCgAgMwAA4AkAILsFAAD8CgAwvAUAAKEBABC9BQAA_AoAML4FAQAAAAHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIdMFAQDbCQAh6AUBANwJACH0BQEA3AkAIfYFAAD9CvYFIvcFAQDcCQAh-AVAAPAKACH5BUAA3wkAIfoFAQDbCQAh-wUBANwJACH8BgAA-woAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAQAAAKEBACABAAAAUQAgAQAAAA4AIAEAAAAYACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAEQAIAEAAEUAMAIAAEYAIBIHAACOFwAgCQAAkhcAIBAAAJEXACApAACQFwAgxAUAALkLACD9BQAAuQsAIP4FAAC5CwAg_wUAALkLACCABgAAuQsAIIEGAAC5CwAgggYAALkLACCDBgAAuQsAIIQGAAC5CwAghQYAALkLACCGBgAAuQsAIIcGAAC5CwAgiAYAALkLACCJBgAAuQsAIBsHAADsCgAgCQAA-goAIBAAAPkKACApAAD4CgAguwUAAPYKADC8BQAAiQEAEL0FAAD2CgAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh6AUBANsJACH8BQEAAAAB_QUIAPcKACH-BQgA9woAIf8FCAD3CgAhgAYIAPcKACGBBggA9woAIYIGCAD3CgAhgwYIAPcKACGEBggA9woAIYUGCAD3CgAhhgYIAPcKACGHBggA9woAIYgGCAD3CgAhiQYIAPcKACEDAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAABVACABAABWADACAABXACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAACoAIAEAACsAMAIAACwAIAMAAABbACABAABcADACAABdACABAAAAHQAgAQAAAGsAIAEAAAAhACABAAAANQAgAQAAAA4AIAEAAABTACABAAAAJgAgAQAAADoAIAEAAAChAQAgAQAAAD8AIAEAAABEACABAAAAiQEAIAEAAAB0ACABAAAAVQAgAQAAADEAIAEAAAAqACABAAAAWwAgAQAAABgAIAMAAAAdACABAAAeADACAAAfACADAAAAawAgAQAAlgEAMAIAAJcBACAOBwAA7AoAICoAAMMKACC7BQAA8woAMLwFAADIAQAQvQUAAPMKADC-BQEA2wkAIcMFAQDbCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDcCQAh2QYBANsJACHaBgEA2wkAIdsGAgD0CgAh3QYAAPUK3QYiAwcAAI4XACAqAACCFQAgjgYAALkLACAOBwAA7AoAICoAAMMKACC7BQAA8woAMLwFAADIAQAQvQUAAPMKADC-BQEAAAABwwUBANsJACHGBUAA3wkAIccFQADfCQAhjgYBANwJACHZBgEA2wkAIdoGAQDbCQAh2wYCAPQKACHdBgAA9QrdBiIDAAAAyAEAIAEAAMkBADACAADKAQAgAwAAADUAIAEAADYAMAIAADcAIAMAAAAhACABAAAiADACAAAjACADAAAACwAgAQAADAAwAgAAAQAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAAAmACABAAAnADACAAAoACADAAAAOgAgAQAAOwAwAgAAPAAgFAcAAPIKACA8AADgCQAgPQAA8QoAILsFAADuCgAwvAUAANMBABC9BQAA7goAML4FAQDbCQAhwwUBANwJACHGBUAA3wkAIccFQADfCQAh9gUAAO8K0wYi-AVAAPAKACGUBgEA3AkAIcwGAQDbCQAhzQYBANsJACHOBgEA3AkAIdAGAAC1CtAGI9EGAQDcCQAh0wYBANwJACHUBgEA3AkAIQsHAACOFwAgPAAApA0AID0AAKQNACDDBQAAuQsAIPgFAAC5CwAglAYAALkLACDOBgAAuQsAINAGAAC5CwAg0QYAALkLACDTBgAAuQsAINQGAAC5CwAgFAcAAPIKACA8AADgCQAgPQAA8QoAILsFAADuCgAwvAUAANMBABC9BQAA7goAML4FAQAAAAHDBQEA3AkAIcYFQADfCQAhxwVAAN8JACH2BQAA7wrTBiL4BUAA8AoAIZQGAQDcCQAhzAYBANsJACHNBgEA2wkAIc4GAQDcCQAh0AYAALUK0AYj0QYBANwJACHTBgEA3AkAIdQGAQDcCQAhAwAAANMBACABAADUAQAwAgAA1QEAIAEAAABRACABAAAAFgAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAA_ACABAABAADACAABBACADAAAARAAgAQAARQAwAgAARgAgAwAAAIkBACABAACsAQAwAgAArQEAIAMAAAB0ACABAAB1ADACAAB2ACADAAAAVQAgAQAAVgAwAgAAVwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAqACABAAArADACAAAsACAPBwAA7AoAID8AAOAJACBBAADtCgAgQgAA2woAILsFAADrCgAwvAUAAOEBABC9BQAA6woAML4FAQDbCQAhwwUBANsJACHGBUAA3wkAIccFQADfCQAh7wUBANsJACHwBQEA2wkAIcAGAQDbCQAhwQYAAOoKvwYiBAcAAI4XACA_AACkDQAgQQAAjxcAIEIAAIQXACAPBwAA7AoAID8AAOAJACBBAADtCgAgQgAA2woAILsFAADrCgAwvAUAAOEBABC9BQAA6woAML4FAQAAAAHDBQEA2wkAIcYFQADfCQAhxwVAAN8JACHvBQEA2wkAIfAFAQDbCQAhwAYBANsJACHBBgAA6gq_BiIDAAAA4QEAIAEAAOIBADACAADjAQAgCEAAAOcKACC7BQAA6QoAMLwFAADlAQAQvQUAAOkKADC-BQEA2wkAIcYFQADfCQAhvAYBANsJACG_BgAA6gq_BiIBQAAAjRcAIAlAAADnCgAguwUAAOkKADC8BQAA5QEAEL0FAADpCgAwvgUBAAAAAcYFQADfCQAhvAYBANsJACG_BgAA6gq_BiL7BgAA6AoAIAMAAADlAQAgAQAA5gEAMAIAAOcBACAJAwAA4AkAIEAAAOcKACC7BQAA5goAMLwFAADpAQAQvQUAAOYKADC-BQEA2wkAIcUFAQDbCQAhvAYBANsJACG9BkAA3wkAIQIDAACkDQAgQAAAjRcAIAoDAADgCQAgQAAA5woAILsFAADmCgAwvAUAAOkBABC9BQAA5goAML4FAQAAAAHFBQEA2wkAIbwGAQDbCQAhvQZAAN8JACH6BgAA5QoAIAMAAADpAQAgAQAA6gEAMAIAAOsBACABAAAA5QEAIAEAAADpAQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACABAAAAEgAgAQAAAB0AIAEAAABrACABAAAAyAEAIAEAAAA1ACABAAAAIQAgAQAAAAsAIAEAAAAOACABAAAAUwAgAQAAACYAIAEAAAA6ACABAAAA0wEAIAEAAAChAQAgAQAAAD8AIAEAAABEACABAAAAiQEAIAEAAAB0ACABAAAAVQAgAQAAADEAIAEAAAAqACABAAAA4QEAIAEAAABbACABAAAAWwAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAWwAgAQAAXAAwAgAAXQAgAQAAACYAIAEAAAA6ACABAAAAPwAgAQAAAKEBACABAAAAiQEAIAEAAABbACADAAAAUwAgAQAAnAEAMAIAAJ0BACADAAAA0wEAIAEAANQBADACAADVAQAgAwAAANMBACABAADUAQAwAgAA1QEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgETMAAOAJACC7BQAA2gkAMLwFAACZAgAQvQUAANoJADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHTBQEA2wkAIdQFAQDbCQAh1QUBANsJACHWBQEA2wkAIdcFAQDcCQAh2AUAANQJACDZBQAA1AkAINoFAADdCQAg2wUAAN0JACDcBSAA3gkAIQEAAACZAgAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACANFwAA4AkAILsFAAD4CQAwvAUAAJ0CABC9BQAA-AkAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIdQFAQDbCQAh1QUBANsJACHaBQAA3QkAINwFIADeCQAhjAYBANsJACGNBgAA1AkAIAEAAACdAgAgCgMAAOAJACC7BQAA5AoAMLwFAACfAgAQvQUAAOQKADC-BQEA2wkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAId4GAQDbCQAh3wZAAN8JACEBAwAApA0AIAoDAADgCQAguwUAAOQKADC8BQAAnwIAEL0FAADkCgAwvgUBAAAAAcUFAQAAAAHGBUAA3wkAIccFQADfCQAh3gYBANsJACHfBkAA3wkAIQMAAACfAgAgAQAAoAIAMAIAAKECACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAADhAQAgAQAA4gEAMAIAAOMBACADAAAA6QEAIAEAAOoBADACAADrAQAgAQAAAAMAIAEAAAAHACABAAAACwAgAQAAAA4AIAEAAABTACABAAAA0wEAIAEAAADTAQAgAQAAAKEBACABAAAAoQEAIAEAAABLACABAAAASwAgAQAAAJ8CACABAAAAWwAgAQAAAFsAIAEAAADhAQAgAQAAAOkBACABAAAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACADAAAACwAgAQAADAAwAgAAAQAgCAMAALUSACAHAADUFgAgvgUBAAAAAcMFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAG_BgAAAPoGAgFYAAC7AgAgBr4FAQAAAAHDBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABvwYAAAD6BgIBWAAAvQIAMAFYAAC9AgAwCAMAALMSACAHAADSFgAgvgUBAL0LACHDBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIb8GAACxEvoGIgIAAAABACBYAADAAgAgBr4FAQC9CwAhwwUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACG_BgAAsRL6BiICAAAACwAgWAAAwgIAIAIAAAALACBYAADCAgAgAwAAAAEAIF8AALsCACBgAADAAgAgAQAAAAEAIAEAAAALACADFQAAihcAIGUAAIwXACBmAACLFwAgCbsFAADgCgAwvAUAAMkCABC9BQAA4AoAML4FAQDICQAhwwUBAMgJACHFBQEAyAkAIcYFQADKCQAhxwVAAMoJACG_BgAA4Qr6BiIDAAAACwAgAQAAyAIAMGQAAMkCACADAAAACwAgAQAADAAwAgAAAQAgAQAAAIcBACABAAAAhwEAIAMAAACFAQAgAQAAhgEAMAIAAIcBACADAAAAhQEAIAEAAIYBADACAACHAQAgAwAAAIUBACABAACGAQAwAgAAhwEAIAcpAACJFwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAAD5BgL8BQEAAAAB9wZAAAAAAQFYAADRAgAgBr4FAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAA-QYC_AUBAAAAAfcGQAAAAAEBWAAA0wIAMAFYAADTAgAwBykAAIgXACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACH2BQAA7wz5BiL8BQEAvQsAIfcGQAC_CwAhAgAAAIcBACBYAADWAgAgBr4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfYFAADvDPkGIvwFAQC9CwAh9wZAAL8LACECAAAAhQEAIFgAANgCACACAAAAhQEAIFgAANgCACADAAAAhwEAIF8AANECACBgAADWAgAgAQAAAIcBACABAAAAhQEAIAMVAACFFwAgZQAAhxcAIGYAAIYXACAJuwUAANwKADC8BQAA3wIAEL0FAADcCgAwvgUBAMgJACHGBUAAygkAIccFQADKCQAh9gUAAN0K-QYi_AUBAMgJACH3BkAAygkAIQMAAACFAQAgAQAA3gIAMGQAAN8CACADAAAAhQEAIAEAAIYBADACAACHAQAgJAQAANYKACAFAADXCgAgBgAAuwoAIBAAALwKACAZAAC9CgAgNAAAjgoAID4AAL8KACBIAAC_CgAgSQAAjgoAIEoAANgKACBLAACLCgAgTAAAiwoAIE0AANkKACBOAADaCgAgTwAAxQoAIFAAAMUKACBRAADECgAgUgAA2woAILsFAADVCgAwvAUAAFEAEL0FAADVCgAwvgUBAAAAAcIFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhvwYBANsJACHuBgEAAAAB7wYgAN4JACHwBgEA3AkAIfEGAQDcCQAh8gYBANwJACHzBgEA3AkAIfQGAQDcCQAh9QYBANwJACH2BgEA2wkAIQEAAADiAgAgAQAAAOICACAZBAAA_xYAIAUAAIAXACAGAAD6FAAgEAAA-xQAIBkAAPwUACA0AACmEAAgPgAA_hQAIEgAAP4UACBJAACmEAAgSgAAgRcAIEsAAJUQACBMAACVEAAgTQAAghcAIE4AAIMXACBPAACEFQAgUAAAhBUAIFEAAIMVACBSAACEFwAgwgUAALkLACDwBgAAuQsAIPEGAAC5CwAg8gYAALkLACDzBgAAuQsAIPQGAAC5CwAg9QYAALkLACADAAAAUQAgAQAA5QIAMAIAAOICACADAAAAUQAgAQAA5QIAMAIAAOICACADAAAAUQAgAQAA5QIAMAIAAOICACAhBAAA7RYAIAUAAO4WACAGAADvFgAgEAAA8BYAIBkAAPEWACA0AAD0FgAgPgAA8hYAIEgAAPMWACBJAAD1FgAgSgAA9hYAIEsAAPcWACBMAAD4FgAgTQAA-RYAIE4AAPoWACBPAAD7FgAgUAAA_BYAIFEAAP0WACBSAAD-FgAgvgUBAAAAAcIFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAG_BgEAAAAB7gYBAAAAAe8GIAAAAAHwBgEAAAAB8QYBAAAAAfIGAQAAAAHzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAABAVgAAOkCACAPvgUBAAAAAcIFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAG_BgEAAAAB7gYBAAAAAe8GIAAAAAHwBgEAAAAB8QYBAAAAAfIGAQAAAAHzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAABAVgAAOsCADABWAAA6wIAMCEEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACC-BQEAvQsAIcIFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhvwYBAL0LACHuBgEAvQsAIe8GIACfDQAh8AYBAL4LACHxBgEAvgsAIfIGAQC-CwAh8wYBAL4LACH0BgEAvgsAIfUGAQC-CwAh9gYBAL0LACECAAAA4gIAIFgAAO4CACAPvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhAgAAAFEAIFgAAPACACACAAAAUQAgWAAA8AIAIAMAAADiAgAgXwAA6QIAIGAAAO4CACABAAAA4gIAIAEAAABRACAKFQAAsxUAIGUAALUVACBmAAC0FQAgwgUAALkLACDwBgAAuQsAIPEGAAC5CwAg8gYAALkLACDzBgAAuQsAIPQGAAC5CwAg9QYAALkLACASuwUAANQKADC8BQAA9wIAEL0FAADUCgAwvgUBAMgJACHCBQEAyQkAIcYFQADKCQAhxwVAAMoJACGOBgEAyAkAIb8GAQDICQAh7gYBAMgJACHvBiAA1gkAIfAGAQDJCQAh8QYBAMkJACHyBgEAyQkAIfMGAQDJCQAh9AYBAMkJACH1BgEAyQkAIfYGAQDICQAhAwAAAFEAIAEAAPYCADBkAAD3AgAgAwAAAFEAIAEAAOUCADACAADiAgAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAAshUAIL4FAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAHfBkAAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAABAVgAAP8CACAIvgUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAd8GQAAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAEBWAAAgQMAMAFYAACBAwAwCQMAALEVACC-BQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAId8GQAC_CwAh6wYBAL0LACHsBgEAvgsAIe0GAQC-CwAhAgAAAAUAIFgAAIQDACAIvgUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHfBkAAvwsAIesGAQC9CwAh7AYBAL4LACHtBgEAvgsAIQIAAAADACBYAACGAwAgAgAAAAMAIFgAAIYDACADAAAABQAgXwAA_wIAIGAAAIQDACABAAAABQAgAQAAAAMAIAUVAACuFQAgZQAAsBUAIGYAAK8VACDsBgAAuQsAIO0GAAC5CwAgC7sFAADTCgAwvAUAAI0DABC9BQAA0woAML4FAQDICQAhxQUBAMgJACHGBUAAygkAIccFQADKCQAh3wZAAMoJACHrBgEAyAkAIewGAQDJCQAh7QYBAMkJACEDAAAAAwAgAQAAjAMAMGQAAI0DACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAArRUAIL4FAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAHiBgEAAAAB4wYBAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGQAAAAAHoBkAAAAAB6QYBAAAAAeoGAQAAAAEBWAAAlQMAIA2-BQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAAB4gYBAAAAAeMGAQAAAAHkBgEAAAAB5QYBAAAAAeYGAQAAAAHnBkAAAAAB6AZAAAAAAekGAQAAAAHqBgEAAAABAVgAAJcDADABWAAAlwMAMA4DAACsFQAgvgUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHiBgEAvQsAIeMGAQC9CwAh5AYBAL4LACHlBgEAvgsAIeYGAQC-CwAh5wZAANULACHoBkAA1QsAIekGAQC-CwAh6gYBAL4LACECAAAACQAgWAAAmgMAIA2-BQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIeIGAQC9CwAh4wYBAL0LACHkBgEAvgsAIeUGAQC-CwAh5gYBAL4LACHnBkAA1QsAIegGQADVCwAh6QYBAL4LACHqBgEAvgsAIQIAAAAHACBYAACcAwAgAgAAAAcAIFgAAJwDACADAAAACQAgXwAAlQMAIGAAAJoDACABAAAACQAgAQAAAAcAIAoVAACpFQAgZQAAqxUAIGYAAKoVACDkBgAAuQsAIOUGAAC5CwAg5gYAALkLACDnBgAAuQsAIOgGAAC5CwAg6QYAALkLACDqBgAAuQsAIBC7BQAA0goAMLwFAACjAwAQvQUAANIKADC-BQEAyAkAIcUFAQDICQAhxgVAAMoJACHHBUAAygkAIeIGAQDICQAh4wYBAMgJACHkBgEAyQkAIeUGAQDJCQAh5gYBAMkJACHnBkAA5QkAIegGQADlCQAh6QYBAMkJACHqBgEAyQkAIQMAAAAHACABAACiAwAwZAAAowMAIAMAAAAHACABAAAIADACAAAJACAJuwUAANEKADC8BQAAqQMAEL0FAADRCgAwvgUBAAAAAcYFQADfCQAhxwVAAN8JACHfBkAA3wkAIeAGAQDbCQAh4QYBANsJACEBAAAApgMAIAEAAACmAwAgCbsFAADRCgAwvAUAAKkDABC9BQAA0QoAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAId8GQADfCQAh4AYBANsJACHhBgEA2wkAIQADAAAAqQMAIAEAAKoDADACAACmAwAgAwAAAKkDACABAACqAwAwAgAApgMAIAMAAACpAwAgAQAAqgMAMAIAAKYDACAGvgUBAAAAAcYFQAAAAAHHBUAAAAAB3wZAAAAAAeAGAQAAAAHhBgEAAAABAVgAAK4DACAGvgUBAAAAAcYFQAAAAAHHBUAAAAAB3wZAAAAAAeAGAQAAAAHhBgEAAAABAVgAALADADABWAAAsAMAMAa-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHfBkAAvwsAIeAGAQC9CwAh4QYBAL0LACECAAAApgMAIFgAALMDACAGvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh3wZAAL8LACHgBgEAvQsAIeEGAQC9CwAhAgAAAKkDACBYAAC1AwAgAgAAAKkDACBYAAC1AwAgAwAAAKYDACBfAACuAwAgYAAAswMAIAEAAACmAwAgAQAAAKkDACADFQAAphUAIGUAAKgVACBmAACnFQAgCbsFAADQCgAwvAUAALwDABC9BQAA0AoAML4FAQDICQAhxgVAAMoJACHHBUAAygkAId8GQADKCQAh4AYBAMgJACHhBgEAyAkAIQMAAACpAwAgAQAAuwMAMGQAALwDACADAAAAqQMAIAEAAKoDADACAACmAwAgAQAAAKECACABAAAAoQIAIAMAAACfAgAgAQAAoAIAMAIAAKECACADAAAAnwIAIAEAAKACADACAAChAgAgAwAAAJ8CACABAACgAgAwAgAAoQIAIAcDAAClFQAgvgUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAd4GAQAAAAHfBkAAAAABAVgAAMQDACAGvgUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAd4GAQAAAAHfBkAAAAABAVgAAMYDADABWAAAxgMAMAcDAACkFQAgvgUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHeBgEAvQsAId8GQAC_CwAhAgAAAKECACBYAADJAwAgBr4FAQC9CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAh3gYBAL0LACHfBkAAvwsAIQIAAACfAgAgWAAAywMAIAIAAACfAgAgWAAAywMAIAMAAAChAgAgXwAAxAMAIGAAAMkDACABAAAAoQIAIAEAAACfAgAgAxUAAKEVACBlAACjFQAgZgAAohUAIAm7BQAAzwoAMLwFAADSAwAQvQUAAM8KADC-BQEAyAkAIcUFAQDICQAhxgVAAMoJACHHBUAAygkAId4GAQDICQAh3wZAAMoJACEDAAAAnwIAIAEAANEDADBkAADSAwAgAwAAAJ8CACABAACgAgAwAgAAoQIAIAEAAACXAQAgAQAAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACAKBwAAwBQAIAkAAPkSACAlAAD6EgAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAQFYAADaAwAgB74FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAZQGAQAAAAEBWAAA3AMAMAFYAADcAwAwAQAAABgAIAoHAAC-FAAgCQAA7RIAICUAAO4SACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIQIAAACXAQAgWAAA4AMAIAe-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIQIAAABrACBYAADiAwAgAgAAAGsAIFgAAOIDACABAAAAGAAgAwAAAJcBACBfAADaAwAgYAAA4AMAIAEAAACXAQAgAQAAAGsAIAUVAACeFQAgZQAAoBUAIGYAAJ8VACDEBQAAuQsAIJQGAAC5CwAgCrsFAADOCgAwvAUAAOoDABC9BQAAzgoAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACGOBgEAyAkAIZQGAQDJCQAhAwAAAGsAIAEAAOkDADBkAADqAwAgAwAAAGsAIAEAAJYBADACAACXAQAgAQAAAMoBACABAAAAygEAIAMAAADIAQAgAQAAyQEAMAIAAMoBACADAAAAyAEAIAEAAMkBADACAADKAQAgAwAAAMgBACABAADJAQAwAgAAygEAIAsHAACdFQAgKgAA4RIAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAAB2QYBAAAAAdoGAQAAAAHbBgIAAAAB3QYAAADdBgIBWAAA8gMAIAm-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAdkGAQAAAAHaBgEAAAAB2wYCAAAAAd0GAAAA3QYCAVgAAPQDADABWAAA9AMAMAsHAACcFQAgKgAA1hIAIL4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAhjgYBAL4LACHZBgEAvQsAIdoGAQC9CwAh2wYCAOANACHdBgAA1BLdBiICAAAAygEAIFgAAPcDACAJvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvgsAIdkGAQC9CwAh2gYBAL0LACHbBgIA4A0AId0GAADUEt0GIgIAAADIAQAgWAAA-QMAIAIAAADIAQAgWAAA-QMAIAMAAADKAQAgXwAA8gMAIGAAAPcDACABAAAAygEAIAEAAADIAQAgBhUAAJcVACBlAACaFQAgZgAAmRUAIOcBAACYFQAg6AEAAJsVACCOBgAAuQsAIAy7BQAAygoAMLwFAACABAAQvQUAAMoKADC-BQEAyAkAIcMFAQDICQAhxgVAAMoJACHHBUAAygkAIY4GAQDJCQAh2QYBAMgJACHaBgEAyAkAIdsGAgCSCgAh3QYAAMsK3QYiAwAAAMgBACABAAD_AwAwZAAAgAQAIAMAAADIAQAgAQAAyQEAMAIAAMoBACABAAAAIwAgAQAAACMAIAMAAAAhACABAAAiADACAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIA8HAAD9DwAgCQAA_g8AIAoAAMASACANAAD_DwAgEQAAgBAAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaAGAgAAAAGmBgEAAAAB1wYBAAAAAdgGAQAAAAEBWAAAiAQAIAq-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAGgBgIAAAABpgYBAAAAAdcGAQAAAAHYBgEAAAABAVgAAIoEADABWAAAigQAMAEAAAAdACAPBwAA5g8AIAkAAOcPACAKAAC-EgAgDQAA6A8AIBEAAOkPACC-BQEAvQsAIcMFAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGgBgIA6A4AIaYGAQC-CwAh1wYBAL0LACHYBgEAvQsAIQIAAAAjACBYAACOBAAgCr4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaAGAgDoDgAhpgYBAL4LACHXBgEAvQsAIdgGAQC9CwAhAgAAACEAIFgAAJAEACACAAAAIQAgWAAAkAQAIAEAAAAdACADAAAAIwAgXwAAiAQAIGAAAI4EACABAAAAIwAgAQAAACEAIAgVAACSFQAgZQAAlRUAIGYAAJQVACDnAQAAkxUAIOgBAACWFQAglAYAALkLACCgBgAAuQsAIKYGAAC5CwAgDbsFAADJCgAwvAUAAJgEABC9BQAAyQoAML4FAQDICQAhwwUBAMgJACHEBQEAyAkAIcYFQADKCQAhxwVAAMoJACGUBgEAyQkAIaAGAgCBCgAhpgYBAMkJACHXBgEAyAkAIdgGAQDICQAhAwAAACEAIAEAAJcEADBkAACYBAAgAwAAACEAIAEAACIAMAIAACMAIAEAAAAoACABAAAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgFwcAAJANACAJAACNDQAgCgAAjg0AIAsAAIcNACAOAACMDQAgDwAAig0AIBAAAJIOACAZAACLDQAgGwAAjw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHqBQEAAAABlgYBAAAAAaYGAQAAAAHWBkAAAAABAVgAAKAEACAMvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHqBQEAAAABlgYBAAAAAaYGAQAAAAHWBkAAAAABAVgAAKIEADABWAAAogQAMAEAAAAYACABAAAAHQAgFwcAAN0MACAJAADaDAAgCgAA2wwAIAsAANQMACAOAADZDAAgDwAA1wwAIBAAAJAOACAZAADYDAAgGwAA3AwAICwAANUMACAtAADWDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIeoFAQC9CwAhlgYBAL0LACGmBgEAvgsAIdYGQAC_CwAhAgAAACgAIFgAAKcEACAMvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIeoFAQC9CwAhlgYBAL0LACGmBgEAvgsAIdYGQAC_CwAhAgAAACYAIFgAAKkEACACAAAAJgAgWAAAqQQAIAEAAAAYACABAAAAHQAgAwAAACgAIF8AAKAEACBgAACnBAAgAQAAACgAIAEAAAAmACAFFQAAjxUAIGUAAJEVACBmAACQFQAgxAUAALkLACCmBgAAuQsAIA-7BQAAyAoAMLwFAACyBAAQvQUAAMgKADC-BQEAyAkAIcMFAQDICQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAh5gUBAMgJACHnBQEAyAkAIegFAQDICQAh6gUBAMgJACGWBgEAyAkAIaYGAQDJCQAh1gZAAMoJACEDAAAAJgAgAQAAsQQAMGQAALIEACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAABoAIAEAAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACAZCAAAjhUAIAwAANkUACANAADRFAAgEQAA0hQAIBwAANgUACAlAADOFAAgJwAA1xQAICoAANoUACAuAADLFAAgLwAAzBQAIDAAAM0UACAxAADPFAAgMgAA0BQAIDQAANMUACA1AADUFAAgNgAA1RQAIDcAANYUACA4AADbFAAgvgUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaUGAQAAAAHOBgEAAAAB1QYBAAAAAQFYAAC6BAAgB74FAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAGlBgEAAAABzgYBAAAAAdUGAQAAAAEBWAAAvAQAMAFYAAC8BAAwAQAAABIAIBkIAACNFQAgDAAArBMAIA0AAKQTACARAAClEwAgHAAAqxMAICUAAKETACAnAACqEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQIAAAAaACBYAADABAAgB74FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhAgAAABgAIFgAAMIEACACAAAAGAAgWAAAwgQAIAEAAAASACADAAAAGgAgXwAAugQAIGAAAMAEACABAAAAGgAgAQAAABgAIAYVAACKFQAgZQAAjBUAIGYAAIsVACCUBgAAuQsAIKUGAAC5CwAgzgYAALkLACAKuwUAAMcKADC8BQAAygQAEL0FAADHCgAwvgUBAMgJACHGBUAAygkAIccFQADKCQAhlAYBAMkJACGlBgEAyQkAIc4GAQDJCQAh1QYBAMgJACEDAAAAGAAgAQAAyQQAMGQAAMoEACADAAAAGAAgAQAAGQAwAgAAGgAgAQAAABQAIAEAAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACAJBwAAiRUAIDkAAN0UACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAc4GAQAAAAHVBgEAAAABAVgAANIEACAHvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAHOBgEAAAAB1QYBAAAAAQFYAADUBAAwAVgAANQEADABAAAAFgAgCQcAAIgVACA5AACSEwAgvgUBAL0LACHDBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIc4GAQC-CwAh1QYBAL0LACECAAAAFAAgWAAA2AQAIAe-BQEAvQsAIcMFAQC-CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQIAAAASACBYAADaBAAgAgAAABIAIFgAANoEACABAAAAFgAgAwAAABQAIF8AANIEACBgAADYBAAgAQAAABQAIAEAAAASACAGFQAAhRUAIGUAAIcVACBmAACGFQAgwwUAALkLACCUBgAAuQsAIM4GAAC5CwAgCrsFAADGCgAwvAUAAOIEABC9BQAAxgoAML4FAQDICQAhwwUBAMkJACHGBUAAygkAIccFQADKCQAhlAYBAMkJACHOBgEAyQkAIdUGAQDICQAhAwAAABIAIAEAAOEEADBkAADiBAAgAwAAABIAIAEAABMAMAIAABQAICIGAAC7CgAgDAAA-wkAIA0AAP0JACARAAC-CgAgHAAA_wkAICUAAPwJACAnAAD-CQAgKgAAwwoAIC4AALcKACAvAAC4CgAgMAAAugoAIDEAALwKACAyAAC9CgAgNAAAjgoAIDUAAMAKACA2AADBCgAgNwAAwgoAIDoAALYKACA7AAC5CgAgPgAAvwoAIEMAAMQKACBEAADFCgAgRQAAxQoAILsFAAC0CgAwvAUAABYAEL0FAAC0CgAwvgUBAAAAAcYFQADfCQAhxwVAAN8JACHyBQAAtQrQBiOOBgEA2wkAIZQGAQDcCQAhzgYBANwJACHRBgEA3AkAIQEAAADlBAAgAQAAAOUEACAbBgAA-hQAIAwAALUPACANAAC3DwAgEQAA_RQAIBwAALkPACAlAAC2DwAgJwAAuA8AICoAAIIVACAuAAD2FAAgLwAA9xQAIDAAAPkUACAxAAD7FAAgMgAA_BQAIDQAAKYQACA1AAD_FAAgNgAAgBUAIDcAAIEVACA6AAD1FAAgOwAA-BQAID4AAP4UACBDAACDFQAgRAAAhBUAIEUAAIQVACDyBQAAuQsAIJQGAAC5CwAgzgYAALkLACDRBgAAuQsAIAMAAAAWACABAADoBAAwAgAA5QQAIAMAAAAWACABAADoBAAwAgAA5QQAIAMAAAAWACABAADoBAAwAgAA5QQAIB8GAADkFAAgDAAA8BQAIA0AAOcUACARAADoFAAgHAAA7xQAICUAAOIUACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQFYAADsBAAgCL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQFYAADuBAAwAVgAAO4EADAfBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQIAAADlBAAgWAAA8QQAIAi-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQIAAAAWACBYAADzBAAgAgAAABYAIFgAAPMEACADAAAA5QQAIF8AAOwEACBgAADxBAAgAQAAAOUEACABAAAAFgAgBxUAAPEQACBlAADzEAAgZgAA8hAAIPIFAAC5CwAglAYAALkLACDOBgAAuQsAINEGAAC5CwAgC7sFAACzCgAwvAUAAPoEABC9BQAAswoAML4FAQDICQAhxgVAAMoJACHHBUAAygkAIfIFAACtCtAGI44GAQDICQAhlAYBAMkJACHOBgEAyQkAIdEGAQDJCQAhAwAAABYAIAEAAPkEADBkAAD6BAAgAwAAABYAIAEAAOgEADACAADlBAAgAQAAANUBACABAAAA1QEAIAMAAADTAQAgAQAA1AEAMAIAANUBACADAAAA0wEAIAEAANQBADACAADVAQAgAwAAANMBACABAADUAQAwAgAA1QEAIBEHAADwEAAgPAAA7hAAID0AAO8QACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAADTBgL4BUAAAAABlAYBAAAAAcwGAQAAAAHNBgEAAAABzgYBAAAAAdAGAAAA0AYD0QYBAAAAAdMGAQAAAAHUBgEAAAABAVgAAIIFACAOvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAA0wYC-AVAAAAAAZQGAQAAAAHMBgEAAAABzQYBAAAAAc4GAQAAAAHQBgAAANAGA9EGAQAAAAHTBgEAAAAB1AYBAAAAAQFYAACEBQAwAVgAAIQFADABAAAAUQAgAQAAABYAIBEHAADtEAAgPAAA6xAAID0AAOwQACC-BQEAvQsAIcMFAQC-CwAhxgVAAL8LACHHBUAAvwsAIfYFAADqENMGIvgFQADVCwAhlAYBAL4LACHMBgEAvQsAIc0GAQC9CwAhzgYBAL4LACHQBgAA6RDQBiPRBgEAvgsAIdMGAQC-CwAh1AYBAL4LACECAAAA1QEAIFgAAIkFACAOvgUBAL0LACHDBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH2BQAA6hDTBiL4BUAA1QsAIZQGAQC-CwAhzAYBAL0LACHNBgEAvQsAIc4GAQC-CwAh0AYAAOkQ0AYj0QYBAL4LACHTBgEAvgsAIdQGAQC-CwAhAgAAANMBACBYAACLBQAgAgAAANMBACBYAACLBQAgAQAAAFEAIAEAAAAWACADAAAA1QEAIF8AAIIFACBgAACJBQAgAQAAANUBACABAAAA0wEAIAsVAADmEAAgZQAA6BAAIGYAAOcQACDDBQAAuQsAIPgFAAC5CwAglAYAALkLACDOBgAAuQsAINAGAAC5CwAg0QYAALkLACDTBgAAuQsAINQGAAC5CwAgEbsFAACsCgAwvAUAAJQFABC9BQAArAoAML4FAQDICQAhwwUBAMkJACHGBUAAygkAIccFQADKCQAh9gUAAK4K0wYi-AVAAOUJACGUBgEAyQkAIcwGAQDICQAhzQYBAMgJACHOBgEAyQkAIdAGAACtCtAGI9EGAQDJCQAh0wYBAMkJACHUBgEAyQkAIQMAAADTAQAgAQAAkwUAMGQAAJQFACADAAAA0wEAIAEAANQBADACAADVAQAgAQAAAF0AIAEAAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACAXEAAA0w0AIBgAAOELACAZAADiCwAgHgAA3gsAIB8AAN8LACAgAADgCwAgIQAA4wsAIL4FAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAHqBQEAAAAB9gUAAADFBgL4BUAAAAAB-wUBAAAAAcMGAAAAwwYCxQYBAAAAAcYGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAHKBgEAAAABywZAAAAAAQFYAACcBQAgEL4FAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAHqBQEAAAAB9gUAAADFBgL4BUAAAAAB-wUBAAAAAcMGAAAAwwYCxQYBAAAAAcYGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAHKBgEAAAABywZAAAAAAQFYAACeBQAwAVgAAJ4FADABAAAAUQAgAQAAAFMAIAEAAAAOACABAAAAGAAgFxAAANENACAYAADaCwAgGQAA2wsAIB4AANcLACAfAADYCwAgIAAA2QsAICEAANwLACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHoBQEAvgsAIeoFAQC-CwAh9gUAANQLxQYi-AVAANULACH7BQEAvgsAIcMGAADTC8MGIsUGAQC9CwAhxgYBAL0LACHHBgEAvQsAIcgGAQC-CwAhyQYBAL4LACHKBgEAvgsAIcsGQAC_CwAhAgAAAF0AIFgAAKUFACAQvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAh-wUBAL4LACHDBgAA0wvDBiLFBgEAvQsAIcYGAQC9CwAhxwYBAL0LACHIBgEAvgsAIckGAQC-CwAhygYBAL4LACHLBkAAvwsAIQIAAABbACBYAACnBQAgAgAAAFsAIFgAAKcFACABAAAAUQAgAQAAAFMAIAEAAAAOACABAAAAGAAgAwAAAF0AIF8AAJwFACBgAAClBQAgAQAAAF0AIAEAAABbACAKFQAA4xAAIGUAAOUQACBmAADkEAAg6AUAALkLACDqBQAAuQsAIPgFAAC5CwAg-wUAALkLACDIBgAAuQsAIMkGAAC5CwAgygYAALkLACATuwUAAKUKADC8BQAAsgUAEL0FAAClCgAwvgUBAMgJACHGBUAAygkAIccFQADKCQAh6AUBAMkJACHqBQEAyQkAIfYFAACnCsUGIvgFQADlCQAh-wUBAMkJACHDBgAApgrDBiLFBgEAyAkAIcYGAQDICQAhxwYBAMgJACHIBgEAyQkAIckGAQDJCQAhygYBAMkJACHLBkAAygkAIQMAAABbACABAACxBQAwZAAAsgUAIAMAAABbACABAABcADACAABdACABAAAA4wEAIAEAAADjAQAgAwAAAOEBACABAADiAQAwAgAA4wEAIAMAAADhAQAgAQAA4gEAMAIAAOMBACADAAAA4QEAIAEAAOIBADACAADjAQAgDAcAAN8QACA_AADgEAAgQQAA4RAAIEIAAOIQACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAfAFAQAAAAHABgEAAAABwQYAAAC_BgIBWAAAugUAIAi-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAfAFAQAAAAHABgEAAAABwQYAAAC_BgIBWAAAvAUAMAFYAAC8BQAwDAcAAMMQACA_AADEEAAgQQAAxRAAIEIAAMYQACC-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAh8AUBAL0LACHABgEAvQsAIcEGAAC9EL8GIgIAAADjAQAgWAAAvwUAIAi-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAh8AUBAL0LACHABgEAvQsAIcEGAAC9EL8GIgIAAADhAQAgWAAAwQUAIAIAAADhAQAgWAAAwQUAIAMAAADjAQAgXwAAugUAIGAAAL8FACABAAAA4wEAIAEAAADhAQAgAxUAAMAQACBlAADCEAAgZgAAwRAAIAu7BQAApAoAMLwFAADIBQAQvQUAAKQKADC-BQEAyAkAIcMFAQDICQAhxgVAAMoJACHHBUAAygkAIe8FAQDICQAh8AUBAMgJACHABgEAyAkAIcEGAAChCr8GIgMAAADhAQAgAQAAxwUAMGQAAMgFACADAAAA4QEAIAEAAOIBADACAADjAQAgAQAAAOcBACABAAAA5wEAIAMAAADlAQAgAQAA5gEAMAIAAOcBACADAAAA5QEAIAEAAOYBADACAADnAQAgAwAAAOUBACABAADmAQAwAgAA5wEAIAVAAAC_EAAgvgUBAAAAAcYFQAAAAAG8BgEAAAABvwYAAAC_BgIBWAAA0AUAIAS-BQEAAAABxgVAAAAAAbwGAQAAAAG_BgAAAL8GAgFYAADSBQAwAVgAANIFADAFQAAAvhAAIL4FAQC9CwAhxgVAAL8LACG8BgEAvQsAIb8GAAC9EL8GIgIAAADnAQAgWAAA1QUAIAS-BQEAvQsAIcYFQAC_CwAhvAYBAL0LACG_BgAAvRC_BiICAAAA5QEAIFgAANcFACACAAAA5QEAIFgAANcFACADAAAA5wEAIF8AANAFACBgAADVBQAgAQAAAOcBACABAAAA5QEAIAMVAAC6EAAgZQAAvBAAIGYAALsQACAHuwUAAKAKADC8BQAA3gUAEL0FAACgCgAwvgUBAMgJACHGBUAAygkAIbwGAQDICQAhvwYAAKEKvwYiAwAAAOUBACABAADdBQAwZAAA3gUAIAMAAADlAQAgAQAA5gEAMAIAAOcBACABAAAA6wEAIAEAAADrAQAgAwAAAOkBACABAADqAQAwAgAA6wEAIAMAAADpAQAgAQAA6gEAMAIAAOsBACADAAAA6QEAIAEAAOoBADACAADrAQAgBgMAALkQACBAAAC4EAAgvgUBAAAAAcUFAQAAAAG8BgEAAAABvQZAAAAAAQFYAADmBQAgBL4FAQAAAAHFBQEAAAABvAYBAAAAAb0GQAAAAAEBWAAA6AUAMAFYAADoBQAwBgMAALcQACBAAAC2EAAgvgUBAL0LACHFBQEAvQsAIbwGAQC9CwAhvQZAAL8LACECAAAA6wEAIFgAAOsFACAEvgUBAL0LACHFBQEAvQsAIbwGAQC9CwAhvQZAAL8LACECAAAA6QEAIFgAAO0FACACAAAA6QEAIFgAAO0FACADAAAA6wEAIF8AAOYFACBgAADrBQAgAQAAAOsBACABAAAA6QEAIAMVAACzEAAgZQAAtRAAIGYAALQQACAHuwUAAJ8KADC8BQAA9AUAEL0FAACfCgAwvgUBAMgJACHFBQEAyAkAIbwGAQDICQAhvQZAAMoJACEDAAAA6QEAIAEAAPMFADBkAAD0BQAgAwAAAOkBACABAADqAQAwAgAA6wEAIAEAAAB2ACABAAAAdgAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAAB0ACABAAB1ADACAAB2ACADAAAAdAAgAQAAdQAwAgAAdgAgDgcAANIOACAJAADTDgAgGwAAshAAIBwAANQOACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAZYGAQAAAAGuBgEAAAABuQYQAAAAAboGEAAAAAG7BiAAAAABAVgAAPwFACAKvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGWBgEAAAABrgYBAAAAAbkGEAAAAAG6BhAAAAABuwYgAAAAAQFYAAD-BQAwAVgAAP4FADAOBwAAxQ4AIAkAAMYOACAbAACxEAAgHAAAxw4AIL4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGWBgEAvQsAIa4GAQC9CwAhuQYQAOENACG6BhAA4Q0AIbsGIACfDQAhAgAAAHYAIFgAAIEGACAKvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZYGAQC9CwAhrgYBAL0LACG5BhAA4Q0AIboGEADhDQAhuwYgAJ8NACECAAAAdAAgWAAAgwYAIAIAAAB0ACBYAACDBgAgAwAAAHYAIF8AAPwFACBgAACBBgAgAQAAAHYAIAEAAAB0ACAFFQAArBAAIGUAAK8QACBmAACuEAAg5wEAAK0QACDoAQAAsBAAIA27BQAAngoAMLwFAACKBgAQvQUAAJ4KADC-BQEAyAkAIcMFAQDICQAhxAUBAMgJACHGBUAAygkAIccFQADKCQAhlgYBAMgJACGuBgEAyAkAIbkGEACTCgAhugYQAJMKACG7BiAA1gkAIQMAAAB0ACABAACJBgAwZAAAigYAIAMAAAB0ACABAAB1ADACAAB2ACABAAAAVwAgAQAAAFcAIAMAAABVACABAABWADACAABXACADAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIBwHAADoDQAgCQAA6Q0AIBkAALkOACAbAADqDQAgHQAA6w0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAfYFAAAArAYClgYBAAAAAagGAQAAAAGqBgAAAKoGAqwGAgAAAAGtBhAAAAABrgYBAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BoAAAAABtwZAAAAAAbgGQAAAAAEBWAAAkgYAIBe-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAKwGApYGAQAAAAGoBgEAAAABqgYAAACqBgKsBgIAAAABrQYQAAAAAa4GAQAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BgEAAAABtgaAAAAAAbcGQAAAAAG4BkAAAAABAVgAAJQGADABWAAAlAYAMBwHAADjDQAgCQAA5A0AIBkAALcOACAbAADlDQAgHQAA5g0AIL4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHqBQEAvQsAIfYFAADfDawGIpYGAQC9CwAhqAYBAL0LACGqBgAA3g2qBiKsBgIA4A0AIa0GEADhDQAhrgYBAL0LACGvBgEAvQsAIbAGAQC9CwAhsQYBAL4LACGyBgEAvgsAIbMGAQC-CwAhtAYBAL4LACG1BgEAvgsAIbYGgAAAAAG3BkAAvwsAIbgGQADVCwAhAgAAAFcAIFgAAJcGACAXvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIeoFAQC9CwAh9gUAAN8NrAYilgYBAL0LACGoBgEAvQsAIaoGAADeDaoGIqwGAgDgDQAhrQYQAOENACGuBgEAvQsAIa8GAQC9CwAhsAYBAL0LACGxBgEAvgsAIbIGAQC-CwAhswYBAL4LACG0BgEAvgsAIbUGAQC-CwAhtgaAAAAAAbcGQAC_CwAhuAZAANULACECAAAAVQAgWAAAmQYAIAIAAABVACBYAACZBgAgAwAAAFcAIF8AAJIGACBgAACXBgAgAQAAAFcAIAEAAABVACAMFQAApxAAIGUAAKoQACBmAACpEAAg5wEAAKgQACDoAQAAqxAAILEGAAC5CwAgsgYAALkLACCzBgAAuQsAILQGAAC5CwAgtQYAALkLACC2BgAAuQsAILgGAAC5CwAgGrsFAACPCgAwvAUAAKAGABC9BQAAjwoAML4FAQDICQAhwwUBAMgJACHEBQEAyAkAIcYFQADKCQAhxwVAAMoJACHqBQEAyAkAIfYFAACRCqwGIpYGAQDICQAhqAYBAMgJACGqBgAAkAqqBiKsBgIAkgoAIa0GEACTCgAhrgYBAMgJACGvBgEAyAkAIbAGAQDICQAhsQYBAMkJACGyBgEAyQkAIbMGAQDJCQAhtAYBAMkJACG1BgEAyQkAIbYGAACUCgAgtwZAAMoJACG4BkAA5QkAIQMAAABVACABAACfBgAwZAAAoAYAIAMAAABVACABAABWADACAABXACAQFAAAjgoAILsFAACNCgAwvAUAAKYGABC9BQAAjQoAML4FAQAAAAHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhogYBANwJACGjBgEA2wkAIaQGAADUCQAgpQYBANwJACGmBgEA3AkAIacGAQDbCQAhAQAAAKMGACABAAAAowYAIBAUAACOCgAguwUAAI0KADC8BQAApgYAEL0FAACNCgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhogYBANwJACGjBgEA2wkAIaQGAADUCQAgpQYBANwJACGmBgEA3AkAIacGAQDbCQAhBRQAAKYQACDEBQAAuQsAIKIGAAC5CwAgpQYAALkLACCmBgAAuQsAIAMAAACmBgAgAQAApwYAMAIAAKMGACADAAAApgYAIAEAAKcGADACAACjBgAgAwAAAKYGACABAACnBgAwAgAAowYAIA0UAAClEAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAABogYBAAAAAaMGAQAAAAGkBgAApBAAIKUGAQAAAAGmBgEAAAABpwYBAAAAAQFYAACrBgAgDL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAaIGAQAAAAGjBgEAAAABpAYAAKQQACClBgEAAAABpgYBAAAAAacGAQAAAAEBWAAArQYAMAFYAACtBgAwDRQAAJoQACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACGiBgEAvgsAIaMGAQC9CwAhpAYAAJkQACClBgEAvgsAIaYGAQC-CwAhpwYBAL0LACECAAAAowYAIFgAALAGACAMvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAhogYBAL4LACGjBgEAvQsAIaQGAACZEAAgpQYBAL4LACGmBgEAvgsAIacGAQC9CwAhAgAAAKYGACBYAACyBgAgAgAAAKYGACBYAACyBgAgAwAAAKMGACBfAACrBgAgYAAAsAYAIAEAAACjBgAgAQAAAKYGACAHFQAAlhAAIGUAAJgQACBmAACXEAAgxAUAALkLACCiBgAAuQsAIKUGAAC5CwAgpgYAALkLACAPuwUAAIwKADC8BQAAuQYAEL0FAACMCgAwvgUBAMgJACHDBQEAyAkAIcQFAQDJCQAhxgVAAMoJACHHBUAAygkAIe8FAQDICQAhogYBAMkJACGjBgEAyAkAIaQGAADUCQAgpQYBAMkJACGmBgEAyQkAIacGAQDICQAhAwAAAKYGACABAAC4BgAwZAAAuQYAIAMAAACmBgAgAQAApwYAMAIAAKMGACAQFAAAiwoAILsFAACKCgAwvAUAAL8GABC9BQAAigoAML4FAQAAAAHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhogYBANwJACGjBgEA2wkAIaQGAADUCQAgpQYBANwJACGmBgEA3AkAIacGAQDbCQAhAQAAALwGACABAAAAvAYAIBAUAACLCgAguwUAAIoKADC8BQAAvwYAEL0FAACKCgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhogYBANwJACGjBgEA2wkAIaQGAADUCQAgpQYBANwJACGmBgEA3AkAIacGAQDbCQAhBRQAAJUQACDEBQAAuQsAIKIGAAC5CwAgpQYAALkLACCmBgAAuQsAIAMAAAC_BgAgAQAAwAYAMAIAALwGACADAAAAvwYAIAEAAMAGADACAAC8BgAgAwAAAL8GACABAADABgAwAgAAvAYAIA0UAACUEAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAABogYBAAAAAaMGAQAAAAGkBgAAkxAAIKUGAQAAAAGmBgEAAAABpwYBAAAAAQFYAADEBgAgDL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAaIGAQAAAAGjBgEAAAABpAYAAJMQACClBgEAAAABpgYBAAAAAacGAQAAAAEBWAAAxgYAMAFYAADGBgAwDRQAAIkQACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACGiBgEAvgsAIaMGAQC9CwAhpAYAAIgQACClBgEAvgsAIaYGAQC-CwAhpwYBAL0LACECAAAAvAYAIFgAAMkGACAMvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAhogYBAL4LACGjBgEAvQsAIaQGAACIEAAgpQYBAL4LACGmBgEAvgsAIacGAQC9CwAhAgAAAL8GACBYAADLBgAgAgAAAL8GACBYAADLBgAgAwAAALwGACBfAADEBgAgYAAAyQYAIAEAAAC8BgAgAQAAAL8GACAHFQAAhRAAIGUAAIcQACBmAACGEAAgxAUAALkLACCiBgAAuQsAIKUGAAC5CwAgpgYAALkLACAPuwUAAIkKADC8BQAA0gYAEL0FAACJCgAwvgUBAMgJACHDBQEAyAkAIcQFAQDJCQAhxgVAAMoJACHHBUAAygkAIe8FAQDICQAhogYBAMkJACGjBgEAyAkAIaQGAADUCQAgpQYBAMkJACGmBgEAyQkAIacGAQDICQAhAwAAAL8GACABAADRBgAwZAAA0gYAIAMAAAC_BgAgAQAAwAYAMAIAALwGACABAAAAHwAgAQAAAB8AIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIA8HAACDEAAgCQAAhBAAIA0AAIIQACAPAACBEAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAABlAYBAAAAAZ4GAQAAAAGfBkAAAAABoAYIAAAAAaEGCAAAAAEBWAAA2gYAIAu-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAe8FAQAAAAGUBgEAAAABngYBAAAAAZ8GQAAAAAGgBggAAAABoQYIAAAAAQFYAADcBgAwAVgAANwGADAPBwAA0A8AIAkAANEPACANAADPDwAgDwAAzg8AIL4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHvBQEAvQsAIZQGAQC-CwAhngYBAL4LACGfBkAA1QsAIaAGCADuCwAhoQYIAO4LACECAAAAHwAgWAAA3wYAIAu-BQEAvQsAIcMFAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACGUBgEAvgsAIZ4GAQC-CwAhnwZAANULACGgBggA7gsAIaEGCADuCwAhAgAAAB0AIFgAAOEGACACAAAAHQAgWAAA4QYAIAMAAAAfACBfAADaBgAgYAAA3wYAIAEAAAAfACABAAAAHQAgChUAAMkPACBlAADMDwAgZgAAyw8AIOcBAADKDwAg6AEAAM0PACCUBgAAuQsAIJ4GAAC5CwAgnwYAALkLACCgBgAAuQsAIKEGAAC5CwAgDrsFAACICgAwvAUAAOgGABC9BQAAiAoAML4FAQDICQAhwwUBAMgJACHEBQEAyAkAIcYFQADKCQAhxwVAAMoJACHvBQEAyAkAIZQGAQDJCQAhngYBAMkJACGfBkAA5QkAIaAGCADvCQAhoQYIAO8JACEDAAAAHQAgAQAA5wYAMGQAAOgGACADAAAAHQAgAQAAHgAwAgAAHwAgAQAAACwAIAEAAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACAQBwAAhA0AIAkAAIUNACAoAACCDQAgKQAAqw8AICsAAIMNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfwFAQAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAQFYAADwBgAgC74FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB_AUBAAAAAY4GAQAAAAGUBgEAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABAVgAAPIGADABWAAA8gYAMAEAAAAWACABAAAAGAAgEAcAAP8MACAJAACADQAgKAAA_QwAICkAAKkPACArAAD-DAAgvgUBAL0LACHDBQEAvgsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIfwFAQC9CwAhjgYBAL0LACGUBgEAvgsAIZsGAQC-CwAhnAYBAL0LACGdBgEAvQsAIQIAAAAsACBYAAD3BgAgC74FAQC9CwAhwwUBAL4LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH8BQEAvQsAIY4GAQC9CwAhlAYBAL4LACGbBgEAvgsAIZwGAQC9CwAhnQYBAL0LACECAAAAKgAgWAAA-QYAIAIAAAAqACBYAAD5BgAgAQAAABYAIAEAAAAYACADAAAALAAgXwAA8AYAIGAAAPcGACABAAAALAAgAQAAACoAIAcVAADGDwAgZQAAyA8AIGYAAMcPACDDBQAAuQsAIMQFAAC5CwAglAYAALkLACCbBgAAuQsAIA67BQAAhwoAMLwFAACCBwAQvQUAAIcKADC-BQEAyAkAIcMFAQDJCQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAh_AUBAMgJACGOBgEAyAkAIZQGAQDJCQAhmwYBAMkJACGcBgEAyAkAIZ0GAQDICQAhAwAAACoAIAEAAIEHADBkAACCBwAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAzACABAAAAMwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgDwcAAK4PACAJAACvDwAgCwAArQ8AIBsAAMUPACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAAmwYCjgYBAAAAAZQGAQAAAAGWBgEAAAABmAYBAAAAAZkGAQAAAAEBWAAAigcAIAu-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAAmwYCjgYBAAAAAZQGAQAAAAGWBgEAAAABmAYBAAAAAZkGAQAAAAEBWAAAjAcAMAFYAACMBwAwAQAAAC8AIAEAAAAWACABAAAAGAAgDwcAAJ8PACAJAACgDwAgCwAAng8AIBsAAMQPACC-BQEAvQsAIcMFAQC-CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh9gUAAJwPmwYijgYBAL0LACGUBgEAvgsAIZYGAQC-CwAhmAYBAL0LACGZBgEAvQsAIQIAAAAzACBYAACSBwAgC74FAQC9CwAhwwUBAL4LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH2BQAAnA-bBiKOBgEAvQsAIZQGAQC-CwAhlgYBAL4LACGYBgEAvQsAIZkGAQC9CwAhAgAAADEAIFgAAJQHACACAAAAMQAgWAAAlAcAIAEAAAAvACABAAAAFgAgAQAAABgAIAMAAAAzACBfAACKBwAgYAAAkgcAIAEAAAAzACABAAAAMQAgBxUAAMEPACBlAADDDwAgZgAAwg8AIMMFAAC5CwAgxAUAALkLACCUBgAAuQsAIJYGAAC5CwAgDrsFAACDCgAwvAUAAJ4HABC9BQAAgwoAML4FAQDICQAhwwUBAMkJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACH2BQAAhAqbBiKOBgEAyAkAIZQGAQDJCQAhlgYBAMkJACGYBgEAyAkAIZkGAQDICQAhAwAAADEAIAEAAJ0HADBkAACeBwAgAwAAADEAIAEAADIAMAIAADMAIAEAAAA3ACABAAAANwAgAwAAADUAIAEAADYAMAIAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgEQcAAI8PACAJAACQDwAgDQAAjA8AIBEAAI0PACAbAADADwAgJAAAjg8AICYAAJEPACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAGUBgEAAAABlQYCAAAAAZYGAQAAAAGXBgEAAAABAVgAAKYHACAKvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZUGAgAAAAGWBgEAAAABlwYBAAAAAQFYAACoBwAwAVgAAKgHADABAAAAGAAgAQAAAGsAIBEHAADtDgAgCQAA7g4AIA0AAOoOACARAADrDgAgGwAAvw8AICQAAOwOACAmAADvDgAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhlAYBAL4LACGVBgIA6A4AIZYGAQC9CwAhlwYBAL4LACECAAAANwAgWAAArQcAIAq-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIZUGAgDoDgAhlgYBAL0LACGXBgEAvgsAIQIAAAA1ACBYAACvBwAgAgAAADUAIFgAAK8HACABAAAAGAAgAQAAAGsAIAMAAAA3ACBfAACmBwAgYAAArQcAIAEAAAA3ACABAAAANQAgCRUAALoPACBlAAC9DwAgZgAAvA8AIOcBAAC7DwAg6AEAAL4PACDEBQAAuQsAIJQGAAC5CwAglQYAALkLACCXBgAAuQsAIA27BQAAgAoAMLwFAAC4BwAQvQUAAIAKADC-BQEAyAkAIcMFAQDICQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAhjgYBAMgJACGUBgEAyQkAIZUGAgCBCgAhlgYBAMgJACGXBgEAyQkAIQMAAAA1ACABAAC3BwAwZAAAuAcAIAMAAAA1ACABAAA2ADACAAA3ACANDAAA-wkAIA0AAP0JACAcAAD_CQAgJQAA_AkAICcAAP4JACC7BQAA-gkAMLwFAAAvABC9BQAA-gkAML4FAQAAAAHDBQEA2wkAIY4GAQDbCQAhjwZAAN8JACGQBkAA3wkAIQEAAAC7BwAgAQAAALsHACAFDAAAtQ8AIA0AALcPACAcAAC5DwAgJQAAtg8AICcAALgPACADAAAALwAgAQAAvgcAMAIAALsHACADAAAALwAgAQAAvgcAMAIAALsHACADAAAALwAgAQAAvgcAMAIAALsHACAKDAAAsA8AIA0AALIPACAcAAC0DwAgJQAAsQ8AICcAALMPACC-BQEAAAABwwUBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAQFYAADCBwAgBb4FAQAAAAHDBQEAAAABjgYBAAAAAY8GQAAAAAGQBkAAAAABAVgAAMQHADABWAAAxAcAMAoMAACqDgAgDQAArA4AIBwAAK4OACAlAACrDgAgJwAArQ4AIL4FAQC9CwAhwwUBAL0LACGOBgEAvQsAIY8GQAC_CwAhkAZAAL8LACECAAAAuwcAIFgAAMcHACAFvgUBAL0LACHDBQEAvQsAIY4GAQC9CwAhjwZAAL8LACGQBkAAvwsAIQIAAAAvACBYAADJBwAgAgAAAC8AIFgAAMkHACADAAAAuwcAIF8AAMIHACBgAADHBwAgAQAAALsHACABAAAALwAgAxUAAKcOACBlAACpDgAgZgAAqA4AIAi7BQAA-QkAMLwFAADQBwAQvQUAAPkJADC-BQEAyAkAIcMFAQDICQAhjgYBAMgJACGPBkAAygkAIZAGQADKCQAhAwAAAC8AIAEAAM8HADBkAADQBwAgAwAAAC8AIAEAAL4HADACAAC7BwAgDRcAAOAJACC7BQAA-AkAMLwFAACdAgAQvQUAAPgJADC-BQEAAAABxgVAAN8JACHHBUAA3wkAIdQFAQDbCQAh1QUBANsJACHaBQAA3QkAINwFIADeCQAhjAYBAAAAAY0GAADUCQAgAQAAANMHACABAAAA0wcAIAEXAACkDQAgAwAAAJ0CACABAADWBwAwAgAA0wcAIAMAAACdAgAgAQAA1gcAMAIAANMHACADAAAAnQIAIAEAANYHADACAADTBwAgChcAAKYOACC-BQEAAAABxgVAAAAAAccFQAAAAAHUBQEAAAAB1QUBAAAAAdoFgAAAAAHcBSAAAAABjAYBAAAAAY0GAAClDgAgAVgAANoHACAJvgUBAAAAAcYFQAAAAAHHBUAAAAAB1AUBAAAAAdUFAQAAAAHaBYAAAAAB3AUgAAAAAYwGAQAAAAGNBgAApQ4AIAFYAADcBwAwAVgAANwHADAKFwAApA4AIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIdQFAQC9CwAh1QUBAL0LACHaBYAAAAAB3AUgAJ8NACGMBgEAvQsAIY0GAACjDgAgAgAAANMHACBYAADfBwAgCb4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIdQFAQC9CwAh1QUBAL0LACHaBYAAAAAB3AUgAJ8NACGMBgEAvQsAIY0GAACjDgAgAgAAAJ0CACBYAADhBwAgAgAAAJ0CACBYAADhBwAgAwAAANMHACBfAADaBwAgYAAA3wcAIAEAAADTBwAgAQAAAJ0CACADFQAAoA4AIGUAAKIOACBmAAChDgAgDLsFAAD3CQAwvAUAAOgHABC9BQAA9wkAML4FAQDICQAhxgVAAMoJACHHBUAAygkAIdQFAQDICQAh1QUBAMgJACHaBQAA1QkAINwFIADWCQAhjAYBAMgJACGNBgAA1AkAIAMAAACdAgAgAQAA5wcAMGQAAOgHACADAAAAnQIAIAEAANYHADACAADTBwAgAQAAAE0AIAEAAABNACADAAAASwAgAQAATAAwAgAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACAQFgAA_A0AIBcAAP0NACAYAAD-DQAgGQAAnw4AIL4FAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH0BQEAAAAB9gUAAACMBgL3BQEAAAAB-AVAAAAAAfkFQAAAAAH6BQEAAAAB-wUBAAAAAYwGAQAAAAEBWAAA8AcAIAy-BQEAAAABxgVAAAAAAccFQAAAAAHqBQEAAAAB9AUBAAAAAfYFAAAAjAYC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-gUBAAAAAfsFAQAAAAGMBgEAAAABAVgAAPIHADABWAAA8gcAMAEAAABRACABAAAAUwAgEBYAAPgNACAXAAD5DQAgGAAA-g0AIBkAAJ4OACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHqBQEAvgsAIfQFAQC-CwAh9gUAAPYNjAYi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIYwGAQC9CwAhAgAAAE0AIFgAAPcHACAMvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL4LACH0BQEAvgsAIfYFAAD2DYwGIvcFAQC-CwAh-AVAANULACH5BUAAvwsAIfoFAQC9CwAh-wUBAL4LACGMBgEAvQsAIQIAAABLACBYAAD5BwAgAgAAAEsAIFgAAPkHACABAAAAUQAgAQAAAFMAIAMAAABNACBfAADwBwAgYAAA9wcAIAEAAABNACABAAAASwAgCBUAAJsOACBlAACdDgAgZgAAnA4AIOoFAAC5CwAg9AUAALkLACD3BQAAuQsAIPgFAAC5CwAg-wUAALkLACAPuwUAAPMJADC8BQAAgggAEL0FAADzCQAwvgUBAMgJACHGBUAAygkAIccFQADKCQAh6gUBAMkJACH0BQEAyQkAIfYFAAD0CYwGIvcFAQDJCQAh-AVAAOUJACH5BUAAygkAIfoFAQDICQAh-wUBAMkJACGMBgEAyAkAIQMAAABLACABAACBCAAwZAAAgggAIAMAAABLACABAABMADACAABNACABAAAAnQEAIAEAAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgEAMAAJUOACAHAACTDgAgCQAAlA4AIA0AAJYOACATAACXDgAgGgAAmA4AIBwAAJkOACAiAACaDgAgvgUBAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAYoGAQAAAAEBWAAAiggAIAi-BQEAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABigYBAAAAAQFYAACMCAAwAVgAAIwIADABAAAAGAAgEAMAAMMNACAHAADBDQAgCQAAwg0AIA0AAMQNACATAADFDQAgGgAAxg0AIBwAAMcNACAiAADIDQAgvgUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxAUBAL4LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGKBgEAvQsAIQIAAACdAQAgWAAAkAgAIAi-BQEAvQsAIcIFAQC-CwAhwwUBAL0LACHEBQEAvgsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIYoGAQC9CwAhAgAAAFMAIFgAAJIIACACAAAAUwAgWAAAkggAIAEAAAAYACADAAAAnQEAIF8AAIoIACBgAACQCAAgAQAAAJ0BACABAAAAUwAgBRUAAL4NACBlAADADQAgZgAAvw0AIMIFAAC5CwAgxAUAALkLACALuwUAAPIJADC8BQAAmggAEL0FAADyCQAwvgUBAMgJACHCBQEAyQkAIcMFAQDICQAhxAUBAMkJACHFBQEAyAkAIcYFQADKCQAhxwVAAMoJACGKBgEAyAkAIQMAAABTACABAACZCAAwZAAAmggAIAMAAABTACABAACcAQAwAgAAnQEAIAEAAACtAQAgAQAAAK0BACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAIkBACABAACsAQAwAgAArQEAIAMAAACJAQAgAQAArAEAMAIAAK0BACAYBwAA9QsAIAkAAPYLACAQAADkDAAgKQAA9AsAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAfwFAQAAAAH9BQgAAAAB_gUIAAAAAf8FCAAAAAGABggAAAABgQYIAAAAAYIGCAAAAAGDBggAAAABhAYIAAAAAYUGCAAAAAGGBggAAAABhwYIAAAAAYgGCAAAAAGJBggAAAABAVgAAKIIACAUvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB_AUBAAAAAf0FCAAAAAH-BQgAAAAB_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCAAAAAGEBggAAAABhQYIAAAAAYYGCAAAAAGHBggAAAABiAYIAAAAAYkGCAAAAAEBWAAApAgAMAFYAACkCAAwAQAAABgAIBgHAADxCwAgCQAA8gsAIBAAAOMMACApAADwCwAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIegFAQC9CwAh_AUBAL0LACH9BQgA7gsAIf4FCADuCwAh_wUIAO4LACGABggA7gsAIYEGCADuCwAhggYIAO4LACGDBggA7gsAIYQGCADuCwAhhQYIAO4LACGGBggA7gsAIYcGCADuCwAhiAYIAO4LACGJBggA7gsAIQIAAACtAQAgWAAAqAgAIBS-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh6AUBAL0LACH8BQEAvQsAIf0FCADuCwAh_gUIAO4LACH_BQgA7gsAIYAGCADuCwAhgQYIAO4LACGCBggA7gsAIYMGCADuCwAhhAYIAO4LACGFBggA7gsAIYYGCADuCwAhhwYIAO4LACGIBggA7gsAIYkGCADuCwAhAgAAAIkBACBYAACqCAAgAgAAAIkBACBYAACqCAAgAQAAABgAIAMAAACtAQAgXwAAoggAIGAAAKgIACABAAAArQEAIAEAAACJAQAgExUAALkNACBlAAC8DQAgZgAAuw0AIOcBAAC6DQAg6AEAAL0NACDEBQAAuQsAIP0FAAC5CwAg_gUAALkLACD_BQAAuQsAIIAGAAC5CwAggQYAALkLACCCBgAAuQsAIIMGAAC5CwAghAYAALkLACCFBgAAuQsAIIYGAAC5CwAghwYAALkLACCIBgAAuQsAIIkGAAC5CwAgF7sFAADuCQAwvAUAALIIABC9BQAA7gkAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACHoBQEAyAkAIfwFAQDICQAh_QUIAO8JACH-BQgA7wkAIf8FCADvCQAhgAYIAO8JACGBBggA7wkAIYIGCADvCQAhgwYIAO8JACGEBggA7wkAIYUGCADvCQAhhgYIAO8JACGHBggA7wkAIYgGCADvCQAhiQYIAO8JACEDAAAAiQEAIAEAALEIADBkAACyCAAgAwAAAIkBACABAACsAQAwAgAArQEAIAEAAACjAQAgAQAAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACAUBwAAjAwAIAkAAI0MACAQAAC4DQAgFgAAiQwAIBgAAIsMACAzAACKDAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHTBQEAAAAB6AUBAAAAAfQFAQAAAAH2BQAAAPYFAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABAVgAALoIACAOvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHTBQEAAAAB6AUBAAAAAfQFAQAAAAH2BQAAAPYFAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABAVgAALwIADABWAAAvAgAMAEAAABRACABAAAADgAgAQAAABgAIBQHAACGDAAgCQAAhwwAIBAAALcNACAWAACDDAAgGAAAhQwAIDMAAIQMACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh0wUBAL0LACHoBQEAvgsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIQIAAACjAQAgWAAAwggAIA6-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh0wUBAL0LACHoBQEAvgsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIQIAAAChAQAgWAAAxAgAIAIAAAChAQAgWAAAxAgAIAEAAABRACABAAAADgAgAQAAABgAIAMAAACjAQAgXwAAuggAIGAAAMIIACABAAAAowEAIAEAAAChAQAgCRUAALQNACBlAAC2DQAgZgAAtQ0AIMQFAAC5CwAg6AUAALkLACD0BQAAuQsAIPcFAAC5CwAg-AUAALkLACD7BQAAuQsAIBG7BQAA6gkAMLwFAADOCAAQvQUAAOoJADC-BQEAyAkAIcMFAQDICQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAh0wUBAMgJACHoBQEAyQkAIfQFAQDJCQAh9gUAAOsJ9gUi9wUBAMkJACH4BUAA5QkAIfkFQADKCQAh-gUBAMgJACH7BQEAyQkAIQMAAAChAQAgAQAAzQgAMGQAAM4IACADAAAAoQEAIAEAAKIBADACAACjAQAgAQAAAEEAIAEAAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAAA_ACABAABAADACAABBACAQBwAAsgwAIAkAALMMACAOAACxDAAgEAAAsw0AICMAALQMACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHoBQEAAAAB7wUBAAAAAfAFAQAAAAHyBQAAAPIFAvMFQAAAAAEBWAAA1ggAIAu-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHoBQEAAAAB7wUBAAAAAfAFAQAAAAHyBQAAAPIFAvMFQAAAAAEBWAAA2AgAMAFYAADYCAAwAQAAABgAIBAHAACbDAAgCQAAnAwAIA4AAJoMACAQAACyDQAgIwAAnQwAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIegFAQC9CwAh7wUBAL0LACHwBQEAvgsAIfIFAACYDPIFIvMFQADVCwAhAgAAAEEAIFgAANwIACALvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh6AUBAL0LACHvBQEAvQsAIfAFAQC-CwAh8gUAAJgM8gUi8wVAANULACECAAAAPwAgWAAA3ggAIAIAAAA_ACBYAADeCAAgAQAAABgAIAMAAABBACBfAADWCAAgYAAA3AgAIAEAAABBACABAAAAPwAgBhUAAK8NACBlAACxDQAgZgAAsA0AIMQFAAC5CwAg8AUAALkLACDzBQAAuQsAIA67BQAA4wkAMLwFAADmCAAQvQUAAOMJADC-BQEAyAkAIcMFAQDICQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAh5gUBAMgJACHoBQEAyAkAIe8FAQDICQAh8AUBAMkJACHyBQAA5AnyBSLzBUAA5QkAIQMAAAA_ACABAADlCAAwZAAA5ggAIAMAAAA_ACABAABAADACAABBACABAAAARgAgAQAAAEYAIAMAAABEACABAABFADACAABGACADAAAARAAgAQAARQAwAgAARgAgAwAAAEQAIAEAAEUAMAIAAEYAIA8HAACuDAAgCQAArwwAIBIAAK4NACAZAACtDAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHpBQEAAAAB6gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FQAAAAAEBWAAA7ggAIAu-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAekFAQAAAAHqBQEAAAAB6wUBAAAAAewFAQAAAAHtBQEAAAAB7gVAAAAAAQFYAADwCAAwAVgAAPAIADABAAAAGAAgDwcAAKoMACAJAACrDAAgEgAArQ0AIBkAAKkMACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh6QUBAL0LACHqBQEAvQsAIesFAQC-CwAh7AUBAL4LACHtBQEAvgsAIe4FQAC_CwAhAgAAAEYAIFgAAPQIACALvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIekFAQC9CwAh6gUBAL0LACHrBQEAvgsAIewFAQC-CwAh7QUBAL4LACHuBUAAvwsAIQIAAABEACBYAAD2CAAgAgAAAEQAIFgAAPYIACABAAAAGAAgAwAAAEYAIF8AAO4IACBgAAD0CAAgAQAAAEYAIAEAAABEACAHFQAAqg0AIGUAAKwNACBmAACrDQAgxAUAALkLACDrBQAAuQsAIOwFAAC5CwAg7QUAALkLACAOuwUAAOIJADC8BQAA_ggAEL0FAADiCQAwvgUBAMgJACHDBQEAyAkAIcQFAQDJCQAhxgVAAMoJACHHBUAAygkAIekFAQDICQAh6gUBAMgJACHrBQEAyQkAIewFAQDJCQAh7QUBAMkJACHuBUAAygkAIQMAAABEACABAAD9CAAwZAAA_ggAIAMAAABEACABAABFADACAABGACABAAAAPAAgAQAAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgAwAAADoAIAEAADsAMAIAADwAIA0HAADHDAAgCQAAyAwAIA4AAMUMACAPAADGDAAgEAAAqQ0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAABAVgAAIYJACAIvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAEBWAAAiAkAMAFYAACICQAwAQAAABgAIA0HAADCDAAgCQAAwwwAIA4AAMAMACAPAADBDAAgEAAAqA0AIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6AUBAL0LACECAAAAPAAgWAAAjAkAIAi-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHnBQEAvQsAIegFAQC9CwAhAgAAADoAIFgAAI4JACACAAAAOgAgWAAAjgkAIAEAAAAYACADAAAAPAAgXwAAhgkAIGAAAIwJACABAAAAPAAgAQAAADoAIAQVAAClDQAgZQAApw0AIGYAAKYNACDEBQAAuQsAIAu7BQAA4QkAMLwFAACWCQAQvQUAAOEJADC-BQEAyAkAIcMFAQDICQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAh5gUBAMgJACHnBQEAyAkAIegFAQDICQAhAwAAADoAIAEAAJUJADBkAACWCQAgAwAAADoAIAEAADsAMAIAADwAIBEzAADgCQAguwUAANoJADC8BQAAmQIAEL0FAADaCQAwvgUBAAAAAcYFQADfCQAhxwVAAN8JACHTBQEAAAAB1AUBANsJACHVBQEA2wkAIdYFAQDbCQAh1wUBANwJACHYBQAA1AkAINkFAADUCQAg2gUAAN0JACDbBQAA3QkAINwFIADeCQAhAQAAAJkJACABAAAAmQkAIAIzAACkDQAg1wUAALkLACADAAAAmQIAIAEAAJwJADACAACZCQAgAwAAAJkCACABAACcCQAwAgAAmQkAIAMAAACZAgAgAQAAnAkAMAIAAJkJACAOMwAAow0AIL4FAQAAAAHGBUAAAAABxwVAAAAAAdMFAQAAAAHUBQEAAAAB1QUBAAAAAdYFAQAAAAHXBQEAAAAB2AUAAKENACDZBQAAog0AINoFgAAAAAHbBYAAAAAB3AUgAAAAAQFYAACgCQAgDb4FAQAAAAHGBUAAAAABxwVAAAAAAdMFAQAAAAHUBQEAAAAB1QUBAAAAAdYFAQAAAAHXBQEAAAAB2AUAAKENACDZBQAAog0AINoFgAAAAAHbBYAAAAAB3AUgAAAAAQFYAACiCQAwAVgAAKIJADAOMwAAoA0AIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIdMFAQC9CwAh1AUBAL0LACHVBQEAvQsAIdYFAQC9CwAh1wUBAL4LACHYBQAAnQ0AINkFAACeDQAg2gWAAAAAAdsFgAAAAAHcBSAAnw0AIQIAAACZCQAgWAAApQkAIA2-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHTBQEAvQsAIdQFAQC9CwAh1QUBAL0LACHWBQEAvQsAIdcFAQC-CwAh2AUAAJ0NACDZBQAAng0AINoFgAAAAAHbBYAAAAAB3AUgAJ8NACECAAAAmQIAIFgAAKcJACACAAAAmQIAIFgAAKcJACADAAAAmQkAIF8AAKAJACBgAAClCQAgAQAAAJkJACABAAAAmQIAIAQVAACaDQAgZQAAnA0AIGYAAJsNACDXBQAAuQsAIBC7BQAA0wkAMLwFAACuCQAQvQUAANMJADC-BQEAyAkAIcYFQADKCQAhxwVAAMoJACHTBQEAyAkAIdQFAQDICQAh1QUBAMgJACHWBQEAyAkAIdcFAQDJCQAh2AUAANQJACDZBQAA1AkAINoFAADVCQAg2wUAANUJACDcBSAA1gkAIQMAAACZAgAgAQAArQkAMGQAAK4JACADAAAAmQIAIAEAAJwJADACAACZCQAgAQAAABAAIAEAAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAAAOACABAAAPADACAAAQACATAwAAmQ0AIAcAAJENACAJAACYDQAgDQAAkg0AIBEAAJMNACAiAACXDQAgJAAAlA0AIEYAAJUNACBHAACWDQAgvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAQFYAAC2CQAgCr4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAEBWAAAuAkAMAFYAAC4CQAwEwMAAMgLACAHAADACwAgCQAAxwsAIA0AAMELACARAADCCwAgIgAAxgsAICQAAMMLACBGAADECwAgRwAAxQsAIL4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC9CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhAgAAABAAIFgAALsJACAKvgUBAL0LACG_BQEAvQsAIcAFAQC9CwAhwQUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxAUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACECAAAADgAgWAAAvQkAIAIAAAAOACBYAAC9CQAgAwAAABAAIF8AALYJACBgAAC7CQAgAQAAABAAIAEAAAAOACAEFQAAugsAIGUAALwLACBmAAC7CwAgwgUAALkLACANuwUAAMcJADC8BQAAxAkAEL0FAADHCQAwvgUBAMgJACG_BQEAyAkAIcAFAQDICQAhwQUBAMgJACHCBQEAyQkAIcMFAQDICQAhxAUBAMgJACHFBQEAyAkAIcYFQADKCQAhxwVAAMoJACEDAAAADgAgAQAAwwkAMGQAAMQJACADAAAADgAgAQAADwAwAgAAEAAgDbsFAADHCQAwvAUAAMQJABC9BQAAxwkAML4FAQDICQAhvwUBAMgJACHABQEAyAkAIcEFAQDICQAhwgUBAMkJACHDBQEAyAkAIcQFAQDICQAhxQUBAMgJACHGBUAAygkAIccFQADKCQAhDhUAAMwJACBlAADSCQAgZgAA0gkAIMgFAQAAAAHJBQEAAAAEygUBAAAABMsFAQAAAAHMBQEAAAABzQUBAAAAAc4FAQAAAAHPBQEA0QkAIdAFAQAAAAHRBQEAAAAB0gUBAAAAAQ4VAADPCQAgZQAA0AkAIGYAANAJACDIBQEAAAAByQUBAAAABcoFAQAAAAXLBQEAAAABzAUBAAAAAc0FAQAAAAHOBQEAAAABzwUBAM4JACHQBQEAAAAB0QUBAAAAAdIFAQAAAAELFQAAzAkAIGUAAM0JACBmAADNCQAgyAVAAAAAAckFQAAAAATKBUAAAAAEywVAAAAAAcwFQAAAAAHNBUAAAAABzgVAAAAAAc8FQADLCQAhCxUAAMwJACBlAADNCQAgZgAAzQkAIMgFQAAAAAHJBUAAAAAEygVAAAAABMsFQAAAAAHMBUAAAAABzQVAAAAAAc4FQAAAAAHPBUAAywkAIQjIBQIAAAAByQUCAAAABMoFAgAAAATLBQIAAAABzAUCAAAAAc0FAgAAAAHOBQIAAAABzwUCAMwJACEIyAVAAAAAAckFQAAAAATKBUAAAAAEywVAAAAAAcwFQAAAAAHNBUAAAAABzgVAAAAAAc8FQADNCQAhDhUAAM8JACBlAADQCQAgZgAA0AkAIMgFAQAAAAHJBQEAAAAFygUBAAAABcsFAQAAAAHMBQEAAAABzQUBAAAAAc4FAQAAAAHPBQEAzgkAIdAFAQAAAAHRBQEAAAAB0gUBAAAAAQjIBQIAAAAByQUCAAAABcoFAgAAAAXLBQIAAAABzAUCAAAAAc0FAgAAAAHOBQIAAAABzwUCAM8JACELyAUBAAAAAckFAQAAAAXKBQEAAAAFywUBAAAAAcwFAQAAAAHNBQEAAAABzgUBAAAAAc8FAQDQCQAh0AUBAAAAAdEFAQAAAAHSBQEAAAABDhUAAMwJACBlAADSCQAgZgAA0gkAIMgFAQAAAAHJBQEAAAAEygUBAAAABMsFAQAAAAHMBQEAAAABzQUBAAAAAc4FAQAAAAHPBQEA0QkAIdAFAQAAAAHRBQEAAAAB0gUBAAAAAQvIBQEAAAAByQUBAAAABMoFAQAAAATLBQEAAAABzAUBAAAAAc0FAQAAAAHOBQEAAAABzwUBANIJACHQBQEAAAAB0QUBAAAAAdIFAQAAAAEQuwUAANMJADC8BQAArgkAEL0FAADTCQAwvgUBAMgJACHGBUAAygkAIccFQADKCQAh0wUBAMgJACHUBQEAyAkAIdUFAQDICQAh1gUBAMgJACHXBQEAyQkAIdgFAADUCQAg2QUAANQJACDaBQAA1QkAINsFAADVCQAg3AUgANYJACEEyAUBAAAABeMFAQAAAAHkBQEAAAAE5QUBAAAABA8VAADMCQAgZQAA2QkAIGYAANkJACDIBYAAAAABywWAAAAAAcwFgAAAAAHNBYAAAAABzgWAAAAAAc8FgAAAAAHdBQEAAAAB3gUBAAAAAd8FAQAAAAHgBYAAAAAB4QWAAAAAAeIFgAAAAAEFFQAAzAkAIGUAANgJACBmAADYCQAgyAUgAAAAAc8FIADXCQAhBRUAAMwJACBlAADYCQAgZgAA2AkAIMgFIAAAAAHPBSAA1wkAIQLIBSAAAAABzwUgANgJACEMyAWAAAAAAcsFgAAAAAHMBYAAAAABzQWAAAAAAc4FgAAAAAHPBYAAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AWAAAAAAeEFgAAAAAHiBYAAAAABETMAAOAJACC7BQAA2gkAMLwFAACZAgAQvQUAANoJADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHTBQEA2wkAIdQFAQDbCQAh1QUBANsJACHWBQEA2wkAIdcFAQDcCQAh2AUAANQJACDZBQAA1AkAINoFAADdCQAg2wUAAN0JACDcBSAA3gkAIQvIBQEAAAAByQUBAAAABMoFAQAAAATLBQEAAAABzAUBAAAAAc0FAQAAAAHOBQEAAAABzwUBANIJACHQBQEAAAAB0QUBAAAAAdIFAQAAAAELyAUBAAAAAckFAQAAAAXKBQEAAAAFywUBAAAAAcwFAQAAAAHNBQEAAAABzgUBAAAAAc8FAQDQCQAh0AUBAAAAAdEFAQAAAAHSBQEAAAABDMgFgAAAAAHLBYAAAAABzAWAAAAAAc0FgAAAAAHOBYAAAAABzwWAAAAAAd0FAQAAAAHeBQEAAAAB3wUBAAAAAeAFgAAAAAHhBYAAAAAB4gWAAAAAAQLIBSAAAAABzwUgANgJACEIyAVAAAAAAckFQAAAAATKBUAAAAAEywVAAAAAAcwFQAAAAAHNBUAAAAABzgVAAAAAAc8FQADNCQAhJgQAANYKACAFAADXCgAgBgAAuwoAIBAAALwKACAZAAC9CgAgNAAAjgoAID4AAL8KACBIAAC_CgAgSQAAjgoAIEoAANgKACBLAACLCgAgTAAAiwoAIE0AANkKACBOAADaCgAgTwAAxQoAIFAAAMUKACBRAADECgAgUgAA2woAILsFAADVCgAwvAUAAFEAEL0FAADVCgAwvgUBANsJACHCBQEA3AkAIcYFQADfCQAhxwVAAN8JACGOBgEA2wkAIb8GAQDbCQAh7gYBANsJACHvBiAA3gkAIfAGAQDcCQAh8QYBANwJACHyBgEA3AkAIfMGAQDcCQAh9AYBANwJACH1BgEA3AkAIfYGAQDbCQAhggcAAFEAIIMHAABRACALuwUAAOEJADC8BQAAlgkAEL0FAADhCQAwvgUBAMgJACHDBQEAyAkAIcQFAQDJCQAhxgVAAMoJACHHBUAAygkAIeYFAQDICQAh5wUBAMgJACHoBQEAyAkAIQ67BQAA4gkAMLwFAAD-CAAQvQUAAOIJADC-BQEAyAkAIcMFAQDICQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAh6QUBAMgJACHqBQEAyAkAIesFAQDJCQAh7AUBAMkJACHtBQEAyQkAIe4FQADKCQAhDrsFAADjCQAwvAUAAOYIABC9BQAA4wkAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACHmBQEAyAkAIegFAQDICQAh7wUBAMgJACHwBQEAyQkAIfIFAADkCfIFIvMFQADlCQAhBxUAAMwJACBlAADpCQAgZgAA6QkAIMgFAAAA8gUCyQUAAADyBQjKBQAAAPIFCM8FAADoCfIFIgsVAADPCQAgZQAA5wkAIGYAAOcJACDIBUAAAAAByQVAAAAABcoFQAAAAAXLBUAAAAABzAVAAAAAAc0FQAAAAAHOBUAAAAABzwVAAOYJACELFQAAzwkAIGUAAOcJACBmAADnCQAgyAVAAAAAAckFQAAAAAXKBUAAAAAFywVAAAAAAcwFQAAAAAHNBUAAAAABzgVAAAAAAc8FQADmCQAhCMgFQAAAAAHJBUAAAAAFygVAAAAABcsFQAAAAAHMBUAAAAABzQVAAAAAAc4FQAAAAAHPBUAA5wkAIQcVAADMCQAgZQAA6QkAIGYAAOkJACDIBQAAAPIFAskFAAAA8gUIygUAAADyBQjPBQAA6AnyBSIEyAUAAADyBQLJBQAAAPIFCMoFAAAA8gUIzwUAAOkJ8gUiEbsFAADqCQAwvAUAAM4IABC9BQAA6gkAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACHTBQEAyAkAIegFAQDJCQAh9AUBAMkJACH2BQAA6wn2BSL3BQEAyQkAIfgFQADlCQAh-QVAAMoJACH6BQEAyAkAIfsFAQDJCQAhBxUAAMwJACBlAADtCQAgZgAA7QkAIMgFAAAA9gUCyQUAAAD2BQjKBQAAAPYFCM8FAADsCfYFIgcVAADMCQAgZQAA7QkAIGYAAO0JACDIBQAAAPYFAskFAAAA9gUIygUAAAD2BQjPBQAA7An2BSIEyAUAAAD2BQLJBQAAAPYFCMoFAAAA9gUIzwUAAO0J9gUiF7sFAADuCQAwvAUAALIIABC9BQAA7gkAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACHoBQEAyAkAIfwFAQDICQAh_QUIAO8JACH-BQgA7wkAIf8FCADvCQAhgAYIAO8JACGBBggA7wkAIYIGCADvCQAhgwYIAO8JACGEBggA7wkAIYUGCADvCQAhhgYIAO8JACGHBggA7wkAIYgGCADvCQAhiQYIAO8JACENFQAAzwkAIGUAAPEJACBmAADxCQAg5wEAAPEJACDoAQAA8QkAIMgFCAAAAAHJBQgAAAAFygUIAAAABcsFCAAAAAHMBQgAAAABzQUIAAAAAc4FCAAAAAHPBQgA8AkAIQ0VAADPCQAgZQAA8QkAIGYAAPEJACDnAQAA8QkAIOgBAADxCQAgyAUIAAAAAckFCAAAAAXKBQgAAAAFywUIAAAAAcwFCAAAAAHNBQgAAAABzgUIAAAAAc8FCADwCQAhCMgFCAAAAAHJBQgAAAAFygUIAAAABcsFCAAAAAHMBQgAAAABzQUIAAAAAc4FCAAAAAHPBQgA8QkAIQu7BQAA8gkAMLwFAACaCAAQvQUAAPIJADC-BQEAyAkAIcIFAQDJCQAhwwUBAMgJACHEBQEAyQkAIcUFAQDICQAhxgVAAMoJACHHBUAAygkAIYoGAQDICQAhD7sFAADzCQAwvAUAAIIIABC9BQAA8wkAML4FAQDICQAhxgVAAMoJACHHBUAAygkAIeoFAQDJCQAh9AUBAMkJACH2BQAA9AmMBiL3BQEAyQkAIfgFQADlCQAh-QVAAMoJACH6BQEAyAkAIfsFAQDJCQAhjAYBAMgJACEHFQAAzAkAIGUAAPYJACBmAAD2CQAgyAUAAACMBgLJBQAAAIwGCMoFAAAAjAYIzwUAAPUJjAYiBxUAAMwJACBlAAD2CQAgZgAA9gkAIMgFAAAAjAYCyQUAAACMBgjKBQAAAIwGCM8FAAD1CYwGIgTIBQAAAIwGAskFAAAAjAYIygUAAACMBgjPBQAA9gmMBiIMuwUAAPcJADC8BQAA6AcAEL0FAAD3CQAwvgUBAMgJACHGBUAAygkAIccFQADKCQAh1AUBAMgJACHVBQEAyAkAIdoFAADVCQAg3AUgANYJACGMBgEAyAkAIY0GAADUCQAgDRcAAOAJACC7BQAA-AkAMLwFAACdAgAQvQUAAPgJADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHUBQEA2wkAIdUFAQDbCQAh2gUAAN0JACDcBSAA3gkAIYwGAQDbCQAhjQYAANQJACAIuwUAAPkJADC8BQAA0AcAEL0FAAD5CQAwvgUBAMgJACHDBQEAyAkAIY4GAQDICQAhjwZAAMoJACGQBkAAygkAIQ0MAAD7CQAgDQAA_QkAIBwAAP8JACAlAAD8CQAgJwAA_gkAILsFAAD6CQAwvAUAAC8AEL0FAAD6CQAwvgUBANsJACHDBQEA2wkAIY4GAQDbCQAhjwZAAN8JACGQBkAA3wkAIQORBgAAMQAgkgYAADEAIJMGAAAxACADkQYAADUAIJIGAAA1ACCTBgAANQAgA5EGAAAmACCSBgAAJgAgkwYAACYAIAORBgAAdAAgkgYAAHQAIJMGAAB0ACADkQYAAFUAIJIGAABVACCTBgAAVQAgDbsFAACACgAwvAUAALgHABC9BQAAgAoAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACGOBgEAyAkAIZQGAQDJCQAhlQYCAIEKACGWBgEAyAkAIZcGAQDJCQAhDRUAAM8JACBlAADPCQAgZgAAzwkAIOcBAADxCQAg6AEAAM8JACDIBQIAAAAByQUCAAAABcoFAgAAAAXLBQIAAAABzAUCAAAAAc0FAgAAAAHOBQIAAAABzwUCAIIKACENFQAAzwkAIGUAAM8JACBmAADPCQAg5wEAAPEJACDoAQAAzwkAIMgFAgAAAAHJBQIAAAAFygUCAAAABcsFAgAAAAHMBQIAAAABzQUCAAAAAc4FAgAAAAHPBQIAggoAIQ67BQAAgwoAMLwFAACeBwAQvQUAAIMKADC-BQEAyAkAIcMFAQDJCQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAh9gUAAIQKmwYijgYBAMgJACGUBgEAyQkAIZYGAQDJCQAhmAYBAMgJACGZBgEAyAkAIQcVAADMCQAgZQAAhgoAIGYAAIYKACDIBQAAAJsGAskFAAAAmwYIygUAAACbBgjPBQAAhQqbBiIHFQAAzAkAIGUAAIYKACBmAACGCgAgyAUAAACbBgLJBQAAAJsGCMoFAAAAmwYIzwUAAIUKmwYiBMgFAAAAmwYCyQUAAACbBgjKBQAAAJsGCM8FAACGCpsGIg67BQAAhwoAMLwFAACCBwAQvQUAAIcKADC-BQEAyAkAIcMFAQDJCQAhxAUBAMkJACHGBUAAygkAIccFQADKCQAh_AUBAMgJACGOBgEAyAkAIZQGAQDJCQAhmwYBAMkJACGcBgEAyAkAIZ0GAQDICQAhDrsFAACICgAwvAUAAOgGABC9BQAAiAoAML4FAQDICQAhwwUBAMgJACHEBQEAyAkAIcYFQADKCQAhxwVAAMoJACHvBQEAyAkAIZQGAQDJCQAhngYBAMkJACGfBkAA5QkAIaAGCADvCQAhoQYIAO8JACEPuwUAAIkKADC8BQAA0gYAEL0FAACJCgAwvgUBAMgJACHDBQEAyAkAIcQFAQDJCQAhxgVAAMoJACHHBUAAygkAIe8FAQDICQAhogYBAMkJACGjBgEAyAkAIaQGAADUCQAgpQYBAMkJACGmBgEAyQkAIacGAQDICQAhEBQAAIsKACC7BQAAigoAMLwFAAC_BgAQvQUAAIoKADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh7wUBANsJACGiBgEA3AkAIaMGAQDbCQAhpAYAANQJACClBgEA3AkAIaYGAQDcCQAhpwYBANsJACEDkQYAAEsAIJIGAABLACCTBgAASwAgD7sFAACMCgAwvAUAALkGABC9BQAAjAoAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACHvBQEAyAkAIaIGAQDJCQAhowYBAMgJACGkBgAA1AkAIKUGAQDJCQAhpgYBAMkJACGnBgEAyAkAIRAUAACOCgAguwUAAI0KADC8BQAApgYAEL0FAACNCgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhogYBANwJACGjBgEA2wkAIaQGAADUCQAgpQYBANwJACGmBgEA3AkAIacGAQDbCQAhA5EGAAChAQAgkgYAAKEBACCTBgAAoQEAIBq7BQAAjwoAMLwFAACgBgAQvQUAAI8KADC-BQEAyAkAIcMFAQDICQAhxAUBAMgJACHGBUAAygkAIccFQADKCQAh6gUBAMgJACH2BQAAkQqsBiKWBgEAyAkAIagGAQDICQAhqgYAAJAKqgYirAYCAJIKACGtBhAAkwoAIa4GAQDICQAhrwYBAMgJACGwBgEAyAkAIbEGAQDJCQAhsgYBAMkJACGzBgEAyQkAIbQGAQDJCQAhtQYBAMkJACG2BgAAlAoAILcGQADKCQAhuAZAAOUJACEHFQAAzAkAIGUAAJ0KACBmAACdCgAgyAUAAACqBgLJBQAAAKoGCMoFAAAAqgYIzwUAAJwKqgYiBxUAAMwJACBlAACbCgAgZgAAmwoAIMgFAAAArAYCyQUAAACsBgjKBQAAAKwGCM8FAACaCqwGIg0VAADMCQAgZQAAzAkAIGYAAMwJACDnAQAAmQoAIOgBAADMCQAgyAUCAAAAAckFAgAAAATKBQIAAAAEywUCAAAAAcwFAgAAAAHNBQIAAAABzgUCAAAAAc8FAgCYCgAhDRUAAMwJACBlAACXCgAgZgAAlwoAIOcBAACXCgAg6AEAAJcKACDIBRAAAAAByQUQAAAABMoFEAAAAATLBRAAAAABzAUQAAAAAc0FEAAAAAHOBRAAAAABzwUQAJYKACEPFQAAzwkAIGUAAJUKACBmAACVCgAgyAWAAAAAAcsFgAAAAAHMBYAAAAABzQWAAAAAAc4FgAAAAAHPBYAAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AWAAAAAAeEFgAAAAAHiBYAAAAABDMgFgAAAAAHLBYAAAAABzAWAAAAAAc0FgAAAAAHOBYAAAAABzwWAAAAAAd0FAQAAAAHeBQEAAAAB3wUBAAAAAeAFgAAAAAHhBYAAAAAB4gWAAAAAAQ0VAADMCQAgZQAAlwoAIGYAAJcKACDnAQAAlwoAIOgBAACXCgAgyAUQAAAAAckFEAAAAATKBRAAAAAEywUQAAAAAcwFEAAAAAHNBRAAAAABzgUQAAAAAc8FEACWCgAhCMgFEAAAAAHJBRAAAAAEygUQAAAABMsFEAAAAAHMBRAAAAABzQUQAAAAAc4FEAAAAAHPBRAAlwoAIQ0VAADMCQAgZQAAzAkAIGYAAMwJACDnAQAAmQoAIOgBAADMCQAgyAUCAAAAAckFAgAAAATKBQIAAAAEywUCAAAAAcwFAgAAAAHNBQIAAAABzgUCAAAAAc8FAgCYCgAhCMgFCAAAAAHJBQgAAAAEygUIAAAABMsFCAAAAAHMBQgAAAABzQUIAAAAAc4FCAAAAAHPBQgAmQoAIQcVAADMCQAgZQAAmwoAIGYAAJsKACDIBQAAAKwGAskFAAAArAYIygUAAACsBgjPBQAAmgqsBiIEyAUAAACsBgLJBQAAAKwGCMoFAAAArAYIzwUAAJsKrAYiBxUAAMwJACBlAACdCgAgZgAAnQoAIMgFAAAAqgYCyQUAAACqBgjKBQAAAKoGCM8FAACcCqoGIgTIBQAAAKoGAskFAAAAqgYIygUAAACqBgjPBQAAnQqqBiINuwUAAJ4KADC8BQAAigYAEL0FAACeCgAwvgUBAMgJACHDBQEAyAkAIcQFAQDICQAhxgVAAMoJACHHBUAAygkAIZYGAQDICQAhrgYBAMgJACG5BhAAkwoAIboGEACTCgAhuwYgANYJACEHuwUAAJ8KADC8BQAA9AUAEL0FAACfCgAwvgUBAMgJACHFBQEAyAkAIbwGAQDICQAhvQZAAMoJACEHuwUAAKAKADC8BQAA3gUAEL0FAACgCgAwvgUBAMgJACHGBUAAygkAIbwGAQDICQAhvwYAAKEKvwYiBxUAAMwJACBlAACjCgAgZgAAowoAIMgFAAAAvwYCyQUAAAC_BgjKBQAAAL8GCM8FAACiCr8GIgcVAADMCQAgZQAAowoAIGYAAKMKACDIBQAAAL8GAskFAAAAvwYIygUAAAC_BgjPBQAAogq_BiIEyAUAAAC_BgLJBQAAAL8GCMoFAAAAvwYIzwUAAKMKvwYiC7sFAACkCgAwvAUAAMgFABC9BQAApAoAML4FAQDICQAhwwUBAMgJACHGBUAAygkAIccFQADKCQAh7wUBAMgJACHwBQEAyAkAIcAGAQDICQAhwQYAAKEKvwYiE7sFAAClCgAwvAUAALIFABC9BQAApQoAML4FAQDICQAhxgVAAMoJACHHBUAAygkAIegFAQDJCQAh6gUBAMkJACH2BQAApwrFBiL4BUAA5QkAIfsFAQDJCQAhwwYAAKYKwwYixQYBAMgJACHGBgEAyAkAIccGAQDICQAhyAYBAMkJACHJBgEAyQkAIcoGAQDJCQAhywZAAMoJACEHFQAAzAkAIGUAAKsKACBmAACrCgAgyAUAAADDBgLJBQAAAMMGCMoFAAAAwwYIzwUAAKoKwwYiBxUAAMwJACBlAACpCgAgZgAAqQoAIMgFAAAAxQYCyQUAAADFBgjKBQAAAMUGCM8FAACoCsUGIgcVAADMCQAgZQAAqQoAIGYAAKkKACDIBQAAAMUGAskFAAAAxQYIygUAAADFBgjPBQAAqArFBiIEyAUAAADFBgLJBQAAAMUGCMoFAAAAxQYIzwUAAKkKxQYiBxUAAMwJACBlAACrCgAgZgAAqwoAIMgFAAAAwwYCyQUAAADDBgjKBQAAAMMGCM8FAACqCsMGIgTIBQAAAMMGAskFAAAAwwYIygUAAADDBgjPBQAAqwrDBiIRuwUAAKwKADC8BQAAlAUAEL0FAACsCgAwvgUBAMgJACHDBQEAyQkAIcYFQADKCQAhxwVAAMoJACH2BQAArgrTBiL4BUAA5QkAIZQGAQDJCQAhzAYBAMgJACHNBgEAyAkAIc4GAQDJCQAh0AYAAK0K0AYj0QYBAMkJACHTBgEAyQkAIdQGAQDJCQAhBxUAAM8JACBlAACyCgAgZgAAsgoAIMgFAAAA0AYDyQUAAADQBgnKBQAAANAGCc8FAACxCtAGIwcVAADMCQAgZQAAsAoAIGYAALAKACDIBQAAANMGAskFAAAA0wYIygUAAADTBgjPBQAArwrTBiIHFQAAzAkAIGUAALAKACBmAACwCgAgyAUAAADTBgLJBQAAANMGCMoFAAAA0wYIzwUAAK8K0wYiBMgFAAAA0wYCyQUAAADTBgjKBQAAANMGCM8FAACwCtMGIgcVAADPCQAgZQAAsgoAIGYAALIKACDIBQAAANAGA8kFAAAA0AYJygUAAADQBgnPBQAAsQrQBiMEyAUAAADQBgPJBQAAANAGCcoFAAAA0AYJzwUAALIK0AYjC7sFAACzCgAwvAUAAPoEABC9BQAAswoAML4FAQDICQAhxgVAAMoJACHHBUAAygkAIfIFAACtCtAGI44GAQDICQAhlAYBAMkJACHOBgEAyQkAIdEGAQDJCQAhIgYAALsKACAMAAD7CQAgDQAA_QkAIBEAAL4KACAcAAD_CQAgJQAA_AkAICcAAP4JACAqAADDCgAgLgAAtwoAIC8AALgKACAwAAC6CgAgMQAAvAoAIDIAAL0KACA0AACOCgAgNQAAwAoAIDYAAMEKACA3AADCCgAgOgAAtgoAIDsAALkKACA-AAC_CgAgQwAAxAoAIEQAAMUKACBFAADFCgAguwUAALQKADC8BQAAFgAQvQUAALQKADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHyBQAAtQrQBiOOBgEA2wkAIZQGAQDcCQAhzgYBANwJACHRBgEA3AkAIQTIBQAAANAGA8kFAAAA0AYJygUAAADQBgnPBQAAsgrQBiMDkQYAABIAIJIGAAASACCTBgAAEgAgA5EGAAAdACCSBgAAHQAgkwYAAB0AIAORBgAAawAgkgYAAGsAIJMGAABrACADkQYAAMgBACCSBgAAyAEAIJMGAADIAQAgA5EGAAAhACCSBgAAIQAgkwYAACEAIAORBgAACwAgkgYAAAsAIJMGAAALACADkQYAAA4AIJIGAAAOACCTBgAADgAgA5EGAABTACCSBgAAUwAgkwYAAFMAIAORBgAAOgAgkgYAADoAIJMGAAA6ACADkQYAANMBACCSBgAA0wEAIJMGAADTAQAgA5EGAAA_ACCSBgAAPwAgkwYAAD8AIAORBgAARAAgkgYAAEQAIJMGAABEACADkQYAAIkBACCSBgAAiQEAIJMGAACJAQAgA5EGAAAqACCSBgAAKgAgkwYAACoAIAORBgAA4QEAIJIGAADhAQAgkwYAAOEBACADkQYAAFsAIJIGAABbACCTBgAAWwAgCrsFAADGCgAwvAUAAOIEABC9BQAAxgoAML4FAQDICQAhwwUBAMkJACHGBUAAygkAIccFQADKCQAhlAYBAMkJACHOBgEAyQkAIdUGAQDICQAhCrsFAADHCgAwvAUAAMoEABC9BQAAxwoAML4FAQDICQAhxgVAAMoJACHHBUAAygkAIZQGAQDJCQAhpQYBAMkJACHOBgEAyQkAIdUGAQDICQAhD7sFAADICgAwvAUAALIEABC9BQAAyAoAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACHmBQEAyAkAIecFAQDICQAh6AUBAMgJACHqBQEAyAkAIZYGAQDICQAhpgYBAMkJACHWBkAAygkAIQ27BQAAyQoAMLwFAACYBAAQvQUAAMkKADC-BQEAyAkAIcMFAQDICQAhxAUBAMgJACHGBUAAygkAIccFQADKCQAhlAYBAMkJACGgBgIAgQoAIaYGAQDJCQAh1wYBAMgJACHYBgEAyAkAIQy7BQAAygoAMLwFAACABAAQvQUAAMoKADC-BQEAyAkAIcMFAQDICQAhxgVAAMoJACHHBUAAygkAIY4GAQDJCQAh2QYBAMgJACHaBgEAyAkAIdsGAgCSCgAh3QYAAMsK3QYiBxUAAMwJACBlAADNCgAgZgAAzQoAIMgFAAAA3QYCyQUAAADdBgjKBQAAAN0GCM8FAADMCt0GIgcVAADMCQAgZQAAzQoAIGYAAM0KACDIBQAAAN0GAskFAAAA3QYIygUAAADdBgjPBQAAzArdBiIEyAUAAADdBgLJBQAAAN0GCMoFAAAA3QYIzwUAAM0K3QYiCrsFAADOCgAwvAUAAOoDABC9BQAAzgoAML4FAQDICQAhwwUBAMgJACHEBQEAyQkAIcYFQADKCQAhxwVAAMoJACGOBgEAyAkAIZQGAQDJCQAhCbsFAADPCgAwvAUAANIDABC9BQAAzwoAML4FAQDICQAhxQUBAMgJACHGBUAAygkAIccFQADKCQAh3gYBAMgJACHfBkAAygkAIQm7BQAA0AoAMLwFAAC8AwAQvQUAANAKADC-BQEAyAkAIcYFQADKCQAhxwVAAMoJACHfBkAAygkAIeAGAQDICQAh4QYBAMgJACEJuwUAANEKADC8BQAAqQMAEL0FAADRCgAwvgUBANsJACHGBUAA3wkAIccFQADfCQAh3wZAAN8JACHgBgEA2wkAIeEGAQDbCQAhELsFAADSCgAwvAUAAKMDABC9BQAA0goAML4FAQDICQAhxQUBAMgJACHGBUAAygkAIccFQADKCQAh4gYBAMgJACHjBgEAyAkAIeQGAQDJCQAh5QYBAMkJACHmBgEAyQkAIecGQADlCQAh6AZAAOUJACHpBgEAyQkAIeoGAQDJCQAhC7sFAADTCgAwvAUAAI0DABC9BQAA0woAML4FAQDICQAhxQUBAMgJACHGBUAAygkAIccFQADKCQAh3wZAAMoJACHrBgEAyAkAIewGAQDJCQAh7QYBAMkJACESuwUAANQKADC8BQAA9wIAEL0FAADUCgAwvgUBAMgJACHCBQEAyQkAIcYFQADKCQAhxwVAAMoJACGOBgEAyAkAIb8GAQDICQAh7gYBAMgJACHvBiAA1gkAIfAGAQDJCQAh8QYBAMkJACHyBgEAyQkAIfMGAQDJCQAh9AYBAMkJACH1BgEAyQkAIfYGAQDICQAhJAQAANYKACAFAADXCgAgBgAAuwoAIBAAALwKACAZAAC9CgAgNAAAjgoAID4AAL8KACBIAAC_CgAgSQAAjgoAIEoAANgKACBLAACLCgAgTAAAiwoAIE0AANkKACBOAADaCgAgTwAAxQoAIFAAAMUKACBRAADECgAgUgAA2woAILsFAADVCgAwvAUAAFEAEL0FAADVCgAwvgUBANsJACHCBQEA3AkAIcYFQADfCQAhxwVAAN8JACGOBgEA2wkAIb8GAQDbCQAh7gYBANsJACHvBiAA3gkAIfAGAQDcCQAh8QYBANwJACHyBgEA3AkAIfMGAQDcCQAh9AYBANwJACH1BgEA3AkAIfYGAQDbCQAhA5EGAAADACCSBgAAAwAgkwYAAAMAIAORBgAABwAgkgYAAAcAIJMGAAAHACATMwAA4AkAILsFAADaCQAwvAUAAJkCABC9BQAA2gkAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIdMFAQDbCQAh1AUBANsJACHVBQEA2wkAIdYFAQDbCQAh1wUBANwJACHYBQAA1AkAINkFAADUCQAg2gUAAN0JACDbBQAA3QkAINwFIADeCQAhggcAAJkCACCDBwAAmQIAIA8XAADgCQAguwUAAPgJADC8BQAAnQIAEL0FAAD4CQAwvgUBANsJACHGBUAA3wkAIccFQADfCQAh1AUBANsJACHVBQEA2wkAIdoFAADdCQAg3AUgAN4JACGMBgEA2wkAIY0GAADUCQAgggcAAJ0CACCDBwAAnQIAIAORBgAAnwIAIJIGAACfAgAgkwYAAJ8CACADkQYAAOkBACCSBgAA6QEAIJMGAADpAQAgCbsFAADcCgAwvAUAAN8CABC9BQAA3AoAML4FAQDICQAhxgVAAMoJACHHBUAAygkAIfYFAADdCvkGIvwFAQDICQAh9wZAAMoJACEHFQAAzAkAIGUAAN8KACBmAADfCgAgyAUAAAD5BgLJBQAAAPkGCMoFAAAA-QYIzwUAAN4K-QYiBxUAAMwJACBlAADfCgAgZgAA3woAIMgFAAAA-QYCyQUAAAD5BgjKBQAAAPkGCM8FAADeCvkGIgTIBQAAAPkGAskFAAAA-QYIygUAAAD5BgjPBQAA3wr5BiIJuwUAAOAKADC8BQAAyQIAEL0FAADgCgAwvgUBAMgJACHDBQEAyAkAIcUFAQDICQAhxgVAAMoJACHHBUAAygkAIb8GAADhCvoGIgcVAADMCQAgZQAA4woAIGYAAOMKACDIBQAAAPoGAskFAAAA-gYIygUAAAD6BgjPBQAA4gr6BiIHFQAAzAkAIGUAAOMKACBmAADjCgAgyAUAAAD6BgLJBQAAAPoGCMoFAAAA-gYIzwUAAOIK-gYiBMgFAAAA-gYCyQUAAAD6BgjKBQAAAPoGCM8FAADjCvoGIgoDAADgCQAguwUAAOQKADC8BQAAnwIAEL0FAADkCgAwvgUBANsJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACHeBgEA2wkAId8GQADfCQAhAsUFAQAAAAG8BgEAAAABCQMAAOAJACBAAADnCgAguwUAAOYKADC8BQAA6QEAEL0FAADmCgAwvgUBANsJACHFBQEA2wkAIbwGAQDbCQAhvQZAAN8JACERBwAA7AoAID8AAOAJACBBAADtCgAgQgAA2woAILsFAADrCgAwvAUAAOEBABC9BQAA6woAML4FAQDbCQAhwwUBANsJACHGBUAA3wkAIccFQADfCQAh7wUBANsJACHwBQEA2wkAIcAGAQDbCQAhwQYAAOoKvwYiggcAAOEBACCDBwAA4QEAIAK8BgEAAAABvwYAAAC_BgIIQAAA5woAILsFAADpCgAwvAUAAOUBABC9BQAA6QoAML4FAQDbCQAhxgVAAN8JACG8BgEA2wkAIb8GAADqCr8GIgTIBQAAAL8GAskFAAAAvwYIygUAAAC_BgjPBQAAowq_BiIPBwAA7AoAID8AAOAJACBBAADtCgAgQgAA2woAILsFAADrCgAwvAUAAOEBABC9BQAA6woAML4FAQDbCQAhwwUBANsJACHGBUAA3wkAIccFQADfCQAh7wUBANsJACHwBQEA2wkAIcAGAQDbCQAhwQYAAOoKvwYiJAYAALsKACAMAAD7CQAgDQAA_QkAIBEAAL4KACAcAAD_CQAgJQAA_AkAICcAAP4JACAqAADDCgAgLgAAtwoAIC8AALgKACAwAAC6CgAgMQAAvAoAIDIAAL0KACA0AACOCgAgNQAAwAoAIDYAAMEKACA3AADCCgAgOgAAtgoAIDsAALkKACA-AAC_CgAgQwAAxAoAIEQAAMUKACBFAADFCgAguwUAALQKADC8BQAAFgAQvQUAALQKADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHyBQAAtQrQBiOOBgEA2wkAIZQGAQDcCQAhzgYBANwJACHRBgEA3AkAIYIHAAAWACCDBwAAFgAgA5EGAADlAQAgkgYAAOUBACCTBgAA5QEAIBQHAADyCgAgPAAA4AkAID0AAPEKACC7BQAA7goAMLwFAADTAQAQvQUAAO4KADC-BQEA2wkAIcMFAQDcCQAhxgVAAN8JACHHBUAA3wkAIfYFAADvCtMGIvgFQADwCgAhlAYBANwJACHMBgEA2wkAIc0GAQDbCQAhzgYBANwJACHQBgAAtQrQBiPRBgEA3AkAIdMGAQDcCQAh1AYBANwJACEEyAUAAADTBgLJBQAAANMGCMoFAAAA0wYIzwUAALAK0wYiCMgFQAAAAAHJBUAAAAAFygVAAAAABcsFQAAAAAHMBUAAAAABzQVAAAAAAc4FQAAAAAHPBUAA5wkAISYEAADWCgAgBQAA1woAIAYAALsKACAQAAC8CgAgGQAAvQoAIDQAAI4KACA-AAC_CgAgSAAAvwoAIEkAAI4KACBKAADYCgAgSwAAiwoAIEwAAIsKACBNAADZCgAgTgAA2goAIE8AAMUKACBQAADFCgAgUQAAxAoAIFIAANsKACC7BQAA1QoAMLwFAABRABC9BQAA1QoAML4FAQDbCQAhwgUBANwJACHGBUAA3wkAIccFQADfCQAhjgYBANsJACG_BgEA2wkAIe4GAQDbCQAh7wYgAN4JACHwBgEA3AkAIfEGAQDcCQAh8gYBANwJACHzBgEA3AkAIfQGAQDcCQAh9QYBANwJACH2BgEA2wkAIYIHAABRACCDBwAAUQAgJAYAALsKACAMAAD7CQAgDQAA_QkAIBEAAL4KACAcAAD_CQAgJQAA_AkAICcAAP4JACAqAADDCgAgLgAAtwoAIC8AALgKACAwAAC6CgAgMQAAvAoAIDIAAL0KACA0AACOCgAgNQAAwAoAIDYAAMEKACA3AADCCgAgOgAAtgoAIDsAALkKACA-AAC_CgAgQwAAxAoAIEQAAMUKACBFAADFCgAguwUAALQKADC8BQAAFgAQvQUAALQKADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHyBQAAtQrQBiOOBgEA2wkAIZQGAQDcCQAhzgYBANwJACHRBgEA3AkAIYIHAAAWACCDBwAAFgAgDgcAAOwKACAqAADDCgAguwUAAPMKADC8BQAAyAEAEL0FAADzCgAwvgUBANsJACHDBQEA2wkAIcYFQADfCQAhxwVAAN8JACGOBgEA3AkAIdkGAQDbCQAh2gYBANsJACHbBgIA9AoAId0GAAD1Ct0GIgjIBQIAAAAByQUCAAAABMoFAgAAAATLBQIAAAABzAUCAAAAAc0FAgAAAAHOBQIAAAABzwUCAMwJACEEyAUAAADdBgLJBQAAAN0GCMoFAAAA3QYIzwUAAM0K3QYiGwcAAOwKACAJAAD6CgAgEAAA-QoAICkAAPgKACC7BQAA9goAMLwFAACJAQAQvQUAAPYKADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh6AUBANsJACH8BQEA2wkAIf0FCAD3CgAh_gUIAPcKACH_BQgA9woAIYAGCAD3CgAhgQYIAPcKACGCBggA9woAIYMGCAD3CgAhhAYIAPcKACGFBggA9woAIYYGCAD3CgAhhwYIAPcKACGIBggA9woAIYkGCAD3CgAhCMgFCAAAAAHJBQgAAAAFygUIAAAABcsFCAAAAAHMBQgAAAABzQUIAAAAAc4FCAAAAAHPBQgA8QkAIRwHAADsCgAgCQAA-goAIAoAAK0LACALAADDCgAgDgAAnQsAIA8AAKALACAQAAD5CgAgGQAAkgsAIBsAAIkLACAsAACrCwAgLQAArAsAILsFAACqCwAwvAUAACYAEL0FAACqCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIeYFAQDbCQAh5wUBANsJACHoBQEA2wkAIeoFAQDbCQAhlgYBANsJACGmBgEA3AkAIdYGQADfCQAhggcAACYAIIMHAAAmACAYAwAA4AkAIAcAAOwKACAJAACICwAgDQAA_QkAIBEAAL4KACAiAADFCgAgJAAAwAoAIEYAAI4KACBHAADCCgAguwUAALQLADC8BQAADgAQvQUAALQLADC-BQEA2wkAIb8FAQDbCQAhwAUBANsJACHBBQEA2wkAIcIFAQDcCQAhwwUBANsJACHEBQEA2wkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIYIHAAAOACCDBwAADgAgHggAALELACAMAAD7CQAgDQAA_QkAIBEAAL4KACAcAAD_CQAgJQAA_AkAICcAAP4JACAqAADDCgAgLgAAtwoAIC8AALgKACAwAAC6CgAgMQAAvAoAIDIAAL0KACA0AACOCgAgNQAAwAoAIDYAAMEKACA3AADCCgAgOAAAxQoAILsFAACwCwAwvAUAABgAEL0FAACwCwAwvgUBANsJACHGBUAA3wkAIccFQADfCQAhlAYBANwJACGlBgEA3AkAIc4GAQDcCQAh1QYBANsJACGCBwAAGAAggwcAABgAIALTBQEAAAAB-gUBAAAAARcHAADsCgAgCQAA-goAIBAAAP8KACAWAAD-CgAgGAAA8QoAIDMAAOAJACC7BQAA_AoAMLwFAAChAQAQvQUAAPwKADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh0wUBANsJACHoBQEA3AkAIfQFAQDcCQAh9gUAAP0K9gUi9wUBANwJACH4BUAA8AoAIfkFQADfCQAh-gUBANsJACH7BQEA3AkAIQTIBQAAAPYFAskFAAAA9gUIygUAAAD2BQjPBQAA7Qn2BSISFAAAjgoAILsFAACNCgAwvAUAAKYGABC9BQAAjQoAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHvBQEA2wkAIaIGAQDcCQAhowYBANsJACGkBgAA1AkAIKUGAQDcCQAhpgYBANwJACGnBgEA2wkAIYIHAACmBgAggwcAAKYGACAYAwAA4AkAIAcAAOwKACAJAACICwAgDQAA_QkAIBEAAL4KACAiAADFCgAgJAAAwAoAIEYAAI4KACBHAADCCgAguwUAALQLADC8BQAADgAQvQUAALQLADC-BQEA2wkAIb8FAQDbCQAhwAUBANsJACHBBQEA2wkAIcIFAQDcCQAhwwUBANsJACHEBQEA2wkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIYIHAAAOACCDBwAADgAgEwMAAOAJACAHAADsCgAgCQAA-goAIA0AAP0JACATAADBCgAgGgAAiwoAIBwAAP8JACAiAADFCgAguwUAAIALADC8BQAAUwAQvQUAAIALADC-BQEA2wkAIcIFAQDcCQAhwwUBANsJACHEBQEA3AkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIYoGAQDbCQAhDQcAAOwKACAJAAD6CgAgJQAA_AkAILsFAACBCwAwvAUAAGsAEL0FAACBCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACEC_AUBAAAAAfcGQAAAAAEKKQAA-AoAILsFAACDCwAwvAUAAIUBABC9BQAAgwsAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIfYFAACEC_kGIvwFAQDbCQAh9wZAAN8JACEEyAUAAAD5BgLJBQAAAPkGCMoFAAAA-QYIzwUAAN8K-QYiAsQFAQAAAAGWBgEAAAABEQcAAOwKACAJAACICwAgGwAAiQsAIBwAAP8JACC7BQAAhgsAMLwFAAB0ABC9BQAAhgsAML4FAQDbCQAhwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACGWBgEA2wkAIa4GAQDbCQAhuQYQAIcLACG6BhAAhwsAIbsGIADeCQAhCMgFEAAAAAHJBRAAAAAEygUQAAAABMsFEAAAAAHMBRAAAAABzQUQAAAAAc4FEAAAAAHPBRAAlwoAIR4IAACxCwAgDAAA-wkAIA0AAP0JACARAAC-CgAgHAAA_wkAICUAAPwJACAnAAD-CQAgKgAAwwoAIC4AALcKACAvAAC4CgAgMAAAugoAIDEAALwKACAyAAC9CgAgNAAAjgoAIDUAAMAKACA2AADBCgAgNwAAwgoAIDgAAMUKACC7BQAAsAsAMLwFAAAYABC9BQAAsAsAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIZQGAQDcCQAhpQYBANwJACHOBgEA3AkAIdUGAQDbCQAhggcAABgAIIMHAAAYACAPDAAA-wkAIA0AAP0JACAcAAD_CQAgJQAA_AkAICcAAP4JACC7BQAA-gkAMLwFAAAvABC9BQAA-gkAML4FAQDbCQAhwwUBANsJACGOBgEA2wkAIY8GQADfCQAhkAZAAN8JACGCBwAALwAggwcAAC8AIBoQAAD_CgAgGAAA8QoAIBkAAI0LACAeAADsCgAgHwAA7AoAICAAAOAJACAhAAD6CgAguwUAAIoLADC8BQAAWwAQvQUAAIoLADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHoBQEA3AkAIeoFAQDcCQAh9gUAAIwLxQYi-AVAAPAKACH7BQEA3AkAIcMGAACLC8MGIsUGAQDbCQAhxgYBANsJACHHBgEA2wkAIcgGAQDcCQAhyQYBANwJACHKBgEA3AkAIcsGQADfCQAhBMgFAAAAwwYCyQUAAADDBgjKBQAAAMMGCM8FAACrCsMGIgTIBQAAAMUGAskFAAAAxQYIygUAAADFBgjPBQAAqQrFBiIVAwAA4AkAIAcAAOwKACAJAAD6CgAgDQAA_QkAIBMAAMEKACAaAACLCgAgHAAA_wkAICIAAMUKACC7BQAAgAsAMLwFAABTABC9BQAAgAsAML4FAQDbCQAhwgUBANwJACHDBQEA2wkAIcQFAQDcCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAhigYBANsJACGCBwAAUwAggwcAAFMAIB8HAADsCgAgCQAAiAsAIBkAAJILACAbAACJCwAgHQAAkwsAILsFAACOCwAwvAUAAFUAEL0FAACOCwAwvgUBANsJACHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIeoFAQDbCQAh9gUAAJALrAYilgYBANsJACGoBgEA2wkAIaoGAACPC6oGIqwGAgD0CgAhrQYQAIcLACGuBgEA2wkAIa8GAQDbCQAhsAYBANsJACGxBgEA3AkAIbIGAQDcCQAhswYBANwJACG0BgEA3AkAIbUGAQDcCQAhtgYAAJELACC3BkAA3wkAIbgGQADwCgAhBMgFAAAAqgYCyQUAAACqBgjKBQAAAKoGCM8FAACdCqoGIgTIBQAAAKwGAskFAAAArAYIygUAAACsBgjPBQAAmwqsBiIMyAWAAAAAAcsFgAAAAAHMBYAAAAABzQWAAAAAAc4FgAAAAAHPBYAAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AWAAAAAAeEFgAAAAAHiBYAAAAABFQMAAOAJACAHAADsCgAgCQAA-goAIA0AAP0JACATAADBCgAgGgAAiwoAIBwAAP8JACAiAADFCgAguwUAAIALADC8BQAAUwAQvQUAAIALADC-BQEA2wkAIcIFAQDcCQAhwwUBANsJACHEBQEA3AkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIYoGAQDbCQAhggcAAFMAIIMHAABTACATBwAA7AoAIAkAAIgLACAbAACJCwAgHAAA_wkAILsFAACGCwAwvAUAAHQAEL0FAACGCwAwvgUBANsJACHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIZYGAQDbCQAhrgYBANsJACG5BhAAhwsAIboGEACHCwAhuwYgAN4JACGCBwAAdAAggwcAAHQAIAL6BQEAAAABjAYBAAAAARMWAACXCwAgFwAA4AkAIBgAAPEKACAZAACNCwAguwUAAJULADC8BQAASwAQvQUAAJULADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHqBQEA3AkAIfQFAQDcCQAh9gUAAJYLjAYi9wUBANwJACH4BUAA8AoAIfkFQADfCQAh-gUBANsJACH7BQEA3AkAIYwGAQDbCQAhBMgFAAAAjAYCyQUAAACMBgjKBQAAAIwGCM8FAAD2CYwGIhIUAACLCgAguwUAAIoKADC8BQAAvwYAEL0FAACKCgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhogYBANwJACGjBgEA2wkAIaQGAADUCQAgpQYBANwJACGmBgEA3AkAIacGAQDbCQAhggcAAL8GACCDBwAAvwYAIALpBQEAAAAB6gUBAAAAARIHAADsCgAgCQAA-goAIBIAAJoLACAZAACSCwAguwUAAJkLADC8BQAARAAQvQUAAJkLADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh6QUBANsJACHqBQEA2wkAIesFAQDcCQAh7AUBANwJACHtBQEA3AkAIe4FQADfCQAhFQcAAOwKACAJAAD6CgAgDgAAnQsAIBAAAPkKACAjAADBCgAguwUAAJsLADC8BQAAPwAQvQUAAJsLADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHoBQEA2wkAIe8FAQDbCQAh8AUBANwJACHyBQAAnAvyBSLzBUAA8AoAIYIHAAA_ACCDBwAAPwAgEwcAAOwKACAJAAD6CgAgDgAAnQsAIBAAAPkKACAjAADBCgAguwUAAJsLADC8BQAAPwAQvQUAAJsLADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHoBQEA2wkAIe8FAQDbCQAh8AUBANwJACHyBQAAnAvyBSLzBUAA8AoAIQTIBQAAAPIFAskFAAAA8gUIygUAAADyBQjPBQAA6QnyBSIWBwAA7AoAIAkAAPoKACANAAD9CQAgEQAAvgoAIBsAAIkLACAkAADACgAgJgAAowsAILsFAAChCwAwvAUAADUAEL0FAAChCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACGVBgIAogsAIZYGAQDbCQAhlwYBANwJACGCBwAANQAggwcAADUAIALmBQEAAAAB5wUBAAAAARAHAADsCgAgCQAA-goAIA4AAJ0LACAPAACgCwAgEAAA-QoAILsFAACfCwAwvAUAADoAEL0FAACfCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIeYFAQDbCQAh5wUBANsJACHoBQEA2wkAIRQHAADsCgAgCQAAiAsAIAoAAK0LACANAAD9CQAgEQAAvgoAILsFAACuCwAwvAUAACEAEL0FAACuCwAwvgUBANsJACHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIZQGAQDcCQAhoAYCAKILACGmBgEA3AkAIdcGAQDbCQAh2AYBANsJACGCBwAAIQAggwcAACEAIBQHAADsCgAgCQAA-goAIA0AAP0JACARAAC-CgAgGwAAiQsAICQAAMAKACAmAACjCwAguwUAAKELADC8BQAANQAQvQUAAKELADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAhjgYBANsJACGUBgEA3AkAIZUGAgCiCwAhlgYBANsJACGXBgEA3AkAIQjIBQIAAAAByQUCAAAABcoFAgAAAAXLBQIAAAABzAUCAAAAAc0FAgAAAAHOBQIAAAABzwUCAM8JACEPBwAA7AoAIAkAAPoKACAlAAD8CQAguwUAAIELADC8BQAAawAQvQUAAIELADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAhjgYBANsJACGUBgEA3AkAIYIHAABrACCDBwAAawAgEgcAAPIKACAJAAD6CgAgCwAAwwoAIBsAAKYLACC7BQAApAsAMLwFAAAxABC9BQAApAsAML4FAQDbCQAhwwUBANwJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACH2BQAApQubBiKOBgEA2wkAIZQGAQDcCQAhlgYBANwJACGYBgEA2wkAIZkGAQDbCQAhBMgFAAAAmwYCyQUAAACbBgjKBQAAAJsGCM8FAACGCpsGIg8MAAD7CQAgDQAA_QkAIBwAAP8JACAlAAD8CQAgJwAA_gkAILsFAAD6CQAwvAUAAC8AEL0FAAD6CQAwvgUBANsJACHDBQEA2wkAIY4GAQDbCQAhjwZAAN8JACGQBkAA3wkAIYIHAAAvACCDBwAALwAgEwcAAPIKACAJAAD6CgAgKAAAqAsAICkAAPgKACArAACpCwAguwUAAKcLADC8BQAAKgAQvQUAAKcLADC-BQEA2wkAIcMFAQDcCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh_AUBANsJACGOBgEA2wkAIZQGAQDcCQAhmwYBANwJACGcBgEA2wkAIZ0GAQDbCQAhFAcAAPIKACAJAAD6CgAgCwAAwwoAIBsAAKYLACC7BQAApAsAMLwFAAAxABC9BQAApAsAML4FAQDbCQAhwwUBANwJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACH2BQAApQubBiKOBgEA2wkAIZQGAQDcCQAhlgYBANwJACGYBgEA2wkAIZkGAQDbCQAhggcAADEAIIMHAAAxACAQBwAA7AoAICoAAMMKACC7BQAA8woAMLwFAADIAQAQvQUAAPMKADC-BQEA2wkAIcMFAQDbCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDcCQAh2QYBANsJACHaBgEA2wkAIdsGAgD0CgAh3QYAAPUK3QYiggcAAMgBACCDBwAAyAEAIBoHAADsCgAgCQAA-goAIAoAAK0LACALAADDCgAgDgAAnQsAIA8AAKALACAQAAD5CgAgGQAAkgsAIBsAAIkLACAsAACrCwAgLQAArAsAILsFAACqCwAwvAUAACYAEL0FAACqCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIeYFAQDbCQAh5wUBANsJACHoBQEA2wkAIeoFAQDbCQAhlgYBANsJACGmBgEA3AkAIdYGQADfCQAhA5EGAACFAQAgkgYAAIUBACCTBgAAhQEAIB0HAADsCgAgCQAA-goAIBAAAPkKACApAAD4CgAguwUAAPYKADC8BQAAiQEAEL0FAAD2CgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIegFAQDbCQAh_AUBANsJACH9BQgA9woAIf4FCAD3CgAh_wUIAPcKACGABggA9woAIYEGCAD3CgAhggYIAPcKACGDBggA9woAIYQGCAD3CgAhhQYIAPcKACGGBggA9woAIYcGCAD3CgAhiAYIAPcKACGJBggA9woAIYIHAACJAQAggwcAAIkBACAUBwAA7AoAIAkAAIgLACANAAD9CQAgDwAAugoAILsFAACvCwAwvAUAAB0AEL0FAACvCwAwvgUBANsJACHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhlAYBANwJACGeBgEA3AkAIZ8GQADwCgAhoAYIAPcKACGhBggA9woAIYIHAAAdACCDBwAAHQAgEgcAAOwKACAJAACICwAgCgAArQsAIA0AAP0JACARAAC-CgAguwUAAK4LADC8BQAAIQAQvQUAAK4LADC-BQEA2wkAIcMFAQDbCQAhxAUBANsJACHGBUAA3wkAIccFQADfCQAhlAYBANwJACGgBgIAogsAIaYGAQDcCQAh1wYBANsJACHYBgEA2wkAIRIHAADsCgAgCQAAiAsAIA0AAP0JACAPAAC6CgAguwUAAK8LADC8BQAAHQAQvQUAAK8LADC-BQEA2wkAIcMFAQDbCQAhxAUBANsJACHGBUAA3wkAIccFQADfCQAh7wUBANsJACGUBgEA3AkAIZ4GAQDcCQAhnwZAAPAKACGgBggA9woAIaEGCAD3CgAhHAgAALELACAMAAD7CQAgDQAA_QkAIBEAAL4KACAcAAD_CQAgJQAA_AkAICcAAP4JACAqAADDCgAgLgAAtwoAIC8AALgKACAwAAC6CgAgMQAAvAoAIDIAAL0KACA0AACOCgAgNQAAwAoAIDYAAMEKACA3AADCCgAgOAAAxQoAILsFAACwCwAwvAUAABgAEL0FAACwCwAwvgUBANsJACHGBUAA3wkAIccFQADfCQAhlAYBANwJACGlBgEA3AkAIc4GAQDcCQAh1QYBANsJACEOBwAA8goAIDkAALMLACC7BQAAsgsAMLwFAAASABC9BQAAsgsAML4FAQDbCQAhwwUBANwJACHGBUAA3wkAIccFQADfCQAhlAYBANwJACHOBgEA3AkAIdUGAQDbCQAhggcAABIAIIMHAAASACAMBwAA8goAIDkAALMLACC7BQAAsgsAMLwFAAASABC9BQAAsgsAML4FAQDbCQAhwwUBANwJACHGBUAA3wkAIccFQADfCQAhlAYBANwJACHOBgEA3AkAIdUGAQDbCQAhA5EGAAAYACCSBgAAGAAgkwYAABgAIBYDAADgCQAgBwAA7AoAIAkAAIgLACANAAD9CQAgEQAAvgoAICIAAMUKACAkAADACgAgRgAAjgoAIEcAAMIKACC7BQAAtAsAMLwFAAAOABC9BQAAtAsAML4FAQDbCQAhvwUBANsJACHABQEA2wkAIcEFAQDbCQAhwgUBANwJACHDBQEA2wkAIcQFAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAhCwMAAOAJACAHAADsCgAguwUAALULADC8BQAACwAQvQUAALULADC-BQEA2wkAIcMFAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAhvwYAALYL-gYiBMgFAAAA-gYCyQUAAAD6BgjKBQAAAPoGCM8FAADjCvoGIhEDAADgCQAguwUAALcLADC8BQAABwAQvQUAALcLADC-BQEA2wkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIeIGAQDbCQAh4wYBANsJACHkBgEA3AkAIeUGAQDcCQAh5gYBANwJACHnBkAA8AoAIegGQADwCgAh6QYBANwJACHqBgEA3AkAIQwDAADgCQAguwUAALgLADC8BQAAAwAQvQUAALgLADC-BQEA2wkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAId8GQADfCQAh6wYBANsJACHsBgEA3AkAIe0GAQDcCQAhAAAAAAGHBwEAAAABAYcHAQAAAAEBhwdAAAAAAQVfAACMGgAgYAAA0hsAIIQHAACNGgAghQcAANEbACCKBwAA5QQAIAtfAADJDAAwYAAAzgwAMIQHAADKDAAwhQcAAMsMADCGBwAAzAwAIIcHAADNDAAwiAcAAM0MADCJBwAAzQwAMIoHAADNDAAwiwcAAM8MADCMBwAA0AwAMAtfAAC1DAAwYAAAugwAMIQHAAC2DAAwhQcAALcMADCGBwAAuAwAIIcHAAC5DAAwiAcAALkMADCJBwAAuQwAMIoHAAC5DAAwiwcAALsMADCMBwAAvAwAMAtfAACODAAwYAAAkwwAMIQHAACPDAAwhQcAAJAMADCGBwAAkQwAIIcHAACSDAAwiAcAAJIMADCJBwAAkgwAMIoHAACSDAAwiwcAAJQMADCMBwAAlQwAMAtfAAD3CwAwYAAA_AsAMIQHAAD4CwAwhQcAAPkLADCGBwAA-gsAIIcHAAD7CwAwiAcAAPsLADCJBwAA-wsAMIoHAAD7CwAwiwcAAP0LADCMBwAA_gsAMAtfAADkCwAwYAAA6QsAMIQHAADlCwAwhQcAAOYLADCGBwAA5wsAIIcHAADoCwAwiAcAAOgLADCJBwAA6AsAMIoHAADoCwAwiwcAAOoLADCMBwAA6wsAMAtfAADJCwAwYAAAzgsAMIQHAADKCwAwhQcAAMsLADCGBwAAzAsAIIcHAADNCwAwiAcAAM0LADCJBwAAzQsAMIoHAADNCwAwiwcAAM8LADCMBwAA0AsAMAVfAACKGgAgYAAAzxsAIIQHAACLGgAghQcAAM4bACCKBwAAGgAgBV8AAIgaACBgAADMGwAghAcAAIkaACCFBwAAyxsAIIoHAADiAgAgFRgAAOELACAZAADiCwAgHgAA3gsAIB8AAN8LACAgAADgCwAgIQAA4wsAIL4FAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLFBgEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGAQAAAAHLBkAAAAABAgAAAF0AIF8AAN0LACADAAAAXQAgXwAA3QsAIGAAANYLACABWAAAyhsAMBoQAAD_CgAgGAAA8QoAIBkAAI0LACAeAADsCgAgHwAA7AoAICAAAOAJACAhAAD6CgAguwUAAIoLADC8BQAAWwAQvQUAAIoLADC-BQEAAAABxgVAAN8JACHHBUAA3wkAIegFAQDcCQAh6gUBANwJACH2BQAAjAvFBiL4BUAA8AoAIfsFAQDcCQAhwwYAAIsLwwYixQYBANsJACHGBgEA2wkAIccGAQDbCQAhyAYBANwJACHJBgEA3AkAIcoGAQDcCQAhywZAAN8JACECAAAAXQAgWAAA1gsAIAIAAADRCwAgWAAA0gsAIBO7BQAA0AsAMLwFAADRCwAQvQUAANALADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHoBQEA3AkAIeoFAQDcCQAh9gUAAIwLxQYi-AVAAPAKACH7BQEA3AkAIcMGAACLC8MGIsUGAQDbCQAhxgYBANsJACHHBgEA2wkAIcgGAQDcCQAhyQYBANwJACHKBgEA3AkAIcsGQADfCQAhE7sFAADQCwAwvAUAANELABC9BQAA0AsAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIegFAQDcCQAh6gUBANwJACH2BQAAjAvFBiL4BUAA8AoAIfsFAQDcCQAhwwYAAIsLwwYixQYBANsJACHGBgEA2wkAIccGAQDbCQAhyAYBANwJACHJBgEA3AkAIcoGAQDcCQAhywZAAN8JACEPvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL4LACH2BQAA1AvFBiL4BUAA1QsAIfsFAQC-CwAhwwYAANMLwwYixQYBAL0LACHGBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEBhwcAAADDBgIBhwcAAADFBgIBhwdAAAAAARUYAADaCwAgGQAA2wsAIB4AANcLACAfAADYCwAgIAAA2QsAICEAANwLACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAh-wUBAL4LACHDBgAA0wvDBiLFBgEAvQsAIcYGAQC9CwAhxwYBAL0LACHIBgEAvgsAIckGAQC-CwAhygYBAL4LACHLBkAAvwsAIQVfAAC2GwAgYAAAyBsAIIQHAAC3GwAghQcAAMcbACCKBwAA5QQAIAVfAAC0GwAgYAAAxRsAIIQHAAC1GwAghQcAAMQbACCKBwAA5QQAIAVfAACyGwAgYAAAwhsAIIQHAACzGwAghQcAAMEbACCKBwAA4gIAIAdfAACwGwAgYAAAvxsAIIQHAACxGwAghQcAAL4bACCIBwAAUQAgiQcAAFEAIIoHAADiAgAgB18AAK4bACBgAAC8GwAghAcAAK8bACCFBwAAuxsAIIgHAABTACCJBwAAUwAgigcAAJ0BACAHXwAArBsAIGAAALkbACCEBwAArRsAIIUHAAC4GwAgiAcAABgAIIkHAAAYACCKBwAAGgAgFRgAAOELACAZAADiCwAgHgAA3gsAIB8AAN8LACAgAADgCwAgIQAA4wsAIL4FAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLFBgEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGAQAAAAHLBkAAAAABA18AALYbACCEBwAAtxsAIIoHAADlBAAgA18AALQbACCEBwAAtRsAIIoHAADlBAAgA18AALIbACCEBwAAsxsAIIoHAADiAgAgA18AALAbACCEBwAAsRsAIIoHAADiAgAgA18AAK4bACCEBwAArxsAIIoHAACdAQAgA18AAKwbACCEBwAArRsAIIoHAAAaACAWBwAA9QsAIAkAAPYLACApAAD0CwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAH8BQEAAAAB_QUIAAAAAf4FCAAAAAH_BQgAAAABgAYIAAAAAYEGCAAAAAGCBggAAAABgwYIAAAAAYQGCAAAAAGFBggAAAABhgYIAAAAAYcGCAAAAAGIBggAAAABiQYIAAAAAQIAAACtAQAgXwAA8wsAIAMAAACtAQAgXwAA8wsAIGAAAO8LACABWAAAqxsAMBsHAADsCgAgCQAA-goAIBAAAPkKACApAAD4CgAguwUAAPYKADC8BQAAiQEAEL0FAAD2CgAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh6AUBANsJACH8BQEAAAAB_QUIAPcKACH-BQgA9woAIf8FCAD3CgAhgAYIAPcKACGBBggA9woAIYIGCAD3CgAhgwYIAPcKACGEBggA9woAIYUGCAD3CgAhhgYIAPcKACGHBggA9woAIYgGCAD3CgAhiQYIAPcKACECAAAArQEAIFgAAO8LACACAAAA7AsAIFgAAO0LACAXuwUAAOsLADC8BQAA7AsAEL0FAADrCwAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIegFAQDbCQAh_AUBANsJACH9BQgA9woAIf4FCAD3CgAh_wUIAPcKACGABggA9woAIYEGCAD3CgAhggYIAPcKACGDBggA9woAIYQGCAD3CgAhhQYIAPcKACGGBggA9woAIYcGCAD3CgAhiAYIAPcKACGJBggA9woAIRe7BQAA6wsAMLwFAADsCwAQvQUAAOsLADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh6AUBANsJACH8BQEA2wkAIf0FCAD3CgAh_gUIAPcKACH_BQgA9woAIYAGCAD3CgAhgQYIAPcKACGCBggA9woAIYMGCAD3CgAhhAYIAPcKACGFBggA9woAIYYGCAD3CgAhhwYIAPcKACGIBggA9woAIYkGCAD3CgAhE74FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH8BQEAvQsAIf0FCADuCwAh_gUIAO4LACH_BQgA7gsAIYAGCADuCwAhgQYIAO4LACGCBggA7gsAIYMGCADuCwAhhAYIAO4LACGFBggA7gsAIYYGCADuCwAhhwYIAO4LACGIBggA7gsAIYkGCADuCwAhBYcHCAAAAAGOBwgAAAABjwcIAAAAAZAHCAAAAAGRBwgAAAABFgcAAPELACAJAADyCwAgKQAA8AsAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH8BQEAvQsAIf0FCADuCwAh_gUIAO4LACH_BQgA7gsAIYAGCADuCwAhgQYIAO4LACGCBggA7gsAIYMGCADuCwAhhAYIAO4LACGFBggA7gsAIYYGCADuCwAhhwYIAO4LACGIBggA7gsAIYkGCADuCwAhBV8AAKAbACBgAACpGwAghAcAAKEbACCFBwAAqBsAIIoHAAAoACAFXwAAnhsAIGAAAKYbACCEBwAAnxsAIIUHAAClGwAgigcAAOUEACAHXwAAnBsAIGAAAKMbACCEBwAAnRsAIIUHAACiGwAgiAcAABgAIIkHAAAYACCKBwAAGgAgFgcAAPULACAJAAD2CwAgKQAA9AsAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB_AUBAAAAAf0FCAAAAAH-BQgAAAAB_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCAAAAAGEBggAAAABhQYIAAAAAYYGCAAAAAGHBggAAAABiAYIAAAAAYkGCAAAAAEDXwAAoBsAIIQHAAChGwAgigcAACgAIANfAACeGwAghAcAAJ8bACCKBwAA5QQAIANfAACcGwAghAcAAJ0bACCKBwAAGgAgEgcAAIwMACAJAACNDAAgFgAAiQwAIBgAAIsMACAzAACKDAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHTBQEAAAAB9AUBAAAAAfYFAAAA9gUC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-gUBAAAAAfsFAQAAAAECAAAAowEAIF8AAIgMACADAAAAowEAIF8AAIgMACBgAACCDAAgAVgAAJsbADAYBwAA7AoAIAkAAPoKACAQAAD_CgAgFgAA_goAIBgAAPEKACAzAADgCQAguwUAAPwKADC8BQAAoQEAEL0FAAD8CgAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh0wUBANsJACHoBQEA3AkAIfQFAQDcCQAh9gUAAP0K9gUi9wUBANwJACH4BUAA8AoAIfkFQADfCQAh-gUBANsJACH7BQEA3AkAIfwGAAD7CgAgAgAAAKMBACBYAACCDAAgAgAAAP8LACBYAACADAAgEbsFAAD-CwAwvAUAAP8LABC9BQAA_gsAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHTBQEA2wkAIegFAQDcCQAh9AUBANwJACH2BQAA_Qr2BSL3BQEA3AkAIfgFQADwCgAh-QVAAN8JACH6BQEA2wkAIfsFAQDcCQAhEbsFAAD-CwAwvAUAAP8LABC9BQAA_gsAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHTBQEA2wkAIegFAQDcCQAh9AUBANwJACH2BQAA_Qr2BSL3BQEA3AkAIfgFQADwCgAh-QVAAN8JACH6BQEA2wkAIfsFAQDcCQAhDb4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHTBQEAvQsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIQGHBwAAAPYFAhIHAACGDAAgCQAAhwwAIBYAAIMMACAYAACFDAAgMwAAhAwAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHTBQEAvQsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIQVfAACKGwAgYAAAmRsAIIQHAACLGwAghQcAAJgbACCKBwAAowYAIAVfAACIGwAgYAAAlhsAIIQHAACJGwAghQcAAJUbACCKBwAA4gIAIAdfAACGGwAgYAAAkxsAIIQHAACHGwAghQcAAJIbACCIBwAAUQAgiQcAAFEAIIoHAADiAgAgBV8AAIQbACBgAACQGwAghAcAAIUbACCFBwAAjxsAIIoHAADlBAAgB18AAIIbACBgAACNGwAghAcAAIMbACCFBwAAjBsAIIgHAAAYACCJBwAAGAAgigcAABoAIBIHAACMDAAgCQAAjQwAIBYAAIkMACAYAACLDAAgMwAAigwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB0wUBAAAAAfQFAQAAAAH2BQAAAPYFAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABA18AAIobACCEBwAAixsAIIoHAACjBgAgA18AAIgbACCEBwAAiRsAIIoHAADiAgAgA18AAIYbACCEBwAAhxsAIIoHAADiAgAgA18AAIQbACCEBwAAhRsAIIoHAADlBAAgA18AAIIbACCEBwAAgxsAIIoHAAAaACAOBwAAsgwAIAkAALMMACAOAACxDAAgIwAAtAwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAe8FAQAAAAHwBQEAAAAB8gUAAADyBQLzBUAAAAABAgAAAEEAIF8AALAMACADAAAAQQAgXwAAsAwAIGAAAJkMACABWAAAgRsAMBMHAADsCgAgCQAA-goAIA4AAJ0LACAQAAD5CgAgIwAAwQoAILsFAACbCwAwvAUAAD8AEL0FAACbCwAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHoBQEA2wkAIe8FAQDbCQAh8AUBANwJACHyBQAAnAvyBSLzBUAA8AoAIQIAAABBACBYAACZDAAgAgAAAJYMACBYAACXDAAgDrsFAACVDAAwvAUAAJYMABC9BQAAlQwAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHmBQEA2wkAIegFAQDbCQAh7wUBANsJACHwBQEA3AkAIfIFAACcC_IFIvMFQADwCgAhDrsFAACVDAAwvAUAAJYMABC9BQAAlQwAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHmBQEA2wkAIegFAQDbCQAh7wUBANsJACHwBQEA3AkAIfIFAACcC_IFIvMFQADwCgAhCr4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIe8FAQC9CwAh8AUBAL4LACHyBQAAmAzyBSLzBUAA1QsAIQGHBwAAAPIFAg4HAACbDAAgCQAAnAwAIA4AAJoMACAjAACdDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh7wUBAL0LACHwBQEAvgsAIfIFAACYDPIFIvMFQADVCwAhBV8AAOYaACBgAAD_GgAghAcAAOcaACCFBwAA_hoAIIoHAAA3ACAFXwAA5BoAIGAAAPwaACCEBwAA5RoAIIUHAAD7GgAgigcAAOUEACAHXwAA4hoAIGAAAPkaACCEBwAA4xoAIIUHAAD4GgAgiAcAABgAIIkHAAAYACCKBwAAGgAgC18AAJ4MADBgAACjDAAwhAcAAJ8MADCFBwAAoAwAMIYHAAChDAAghwcAAKIMADCIBwAAogwAMIkHAACiDAAwigcAAKIMADCLBwAApAwAMIwHAAClDAAwDQcAAK4MACAJAACvDAAgGQAArQwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FQAAAAAECAAAARgAgXwAArAwAIAMAAABGACBfAACsDAAgYAAAqAwAIAFYAAD3GgAwEwcAAOwKACAJAAD6CgAgEgAAmgsAIBkAAJILACC7BQAAmQsAMLwFAABEABC9BQAAmQsAML4FAQAAAAHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIekFAQDbCQAh6gUBANsJACHrBQEA3AkAIewFAQDcCQAh7QUBANwJACHuBUAA3wkAIYAHAACYCwAgAgAAAEYAIFgAAKgMACACAAAApgwAIFgAAKcMACAOuwUAAKUMADC8BQAApgwAEL0FAAClDAAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIekFAQDbCQAh6gUBANsJACHrBQEA3AkAIewFAQDcCQAh7QUBANwJACHuBUAA3wkAIQ67BQAApQwAMLwFAACmDAAQvQUAAKUMADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh6QUBANsJACHqBQEA2wkAIesFAQDcCQAh7AUBANwJACHtBQEA3AkAIe4FQADfCQAhCr4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHqBQEAvQsAIesFAQC-CwAh7AUBAL4LACHtBQEAvgsAIe4FQAC_CwAhDQcAAKoMACAJAACrDAAgGQAAqQwAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHqBQEAvQsAIesFAQC-CwAh7AUBAL4LACHtBQEAvgsAIe4FQAC_CwAhBV8AAOwaACBgAAD1GgAghAcAAO0aACCFBwAA9BoAIIoHAACdAQAgBV8AAOoaACBgAADyGgAghAcAAOsaACCFBwAA8RoAIIoHAADlBAAgB18AAOgaACBgAADvGgAghAcAAOkaACCFBwAA7hoAIIgHAAAYACCJBwAAGAAgigcAABoAIA0HAACuDAAgCQAArwwAIBkAAK0MACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBUAAAAABA18AAOwaACCEBwAA7RoAIIoHAACdAQAgA18AAOoaACCEBwAA6xoAIIoHAADlBAAgA18AAOgaACCEBwAA6RoAIIoHAAAaACAOBwAAsgwAIAkAALMMACAOAACxDAAgIwAAtAwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAe8FAQAAAAHwBQEAAAAB8gUAAADyBQLzBUAAAAABA18AAOYaACCEBwAA5xoAIIoHAAA3ACADXwAA5BoAIIQHAADlGgAgigcAAOUEACADXwAA4hoAIIQHAADjGgAgigcAABoAIARfAACeDAAwhAcAAJ8MADCGBwAAoQwAIIoHAACiDAAwCwcAAMcMACAJAADIDAAgDgAAxQwAIA8AAMYMACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAABAgAAADwAIF8AAMQMACADAAAAPAAgXwAAxAwAIGAAAL8MACABWAAA4RoAMBEHAADsCgAgCQAA-goAIA4AAJ0LACAPAACgCwAgEAAA-QoAILsFAACfCwAwvAUAADoAEL0FAACfCwAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHnBQEA2wkAIegFAQDbCQAhgQcAAJ4LACACAAAAPAAgWAAAvwwAIAIAAAC9DAAgWAAAvgwAIAu7BQAAvAwAMLwFAAC9DAAQvQUAALwMADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHnBQEA2wkAIegFAQDbCQAhC7sFAAC8DAAwvAUAAL0MABC9BQAAvAwAML4FAQDbCQAhwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACHmBQEA2wkAIecFAQDbCQAh6AUBANsJACEHvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACELBwAAwgwAIAkAAMMMACAOAADADAAgDwAAwQwAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAhBV8AANMaACBgAADfGgAghAcAANQaACCFBwAA3hoAIIoHAAA3ACAFXwAA0RoAIGAAANwaACCEBwAA0hoAIIUHAADbGgAgigcAACMAIAVfAADPGgAgYAAA2RoAIIQHAADQGgAghQcAANgaACCKBwAA5QQAIAdfAADNGgAgYAAA1hoAIIQHAADOGgAghQcAANUaACCIBwAAGAAgiQcAABgAIIoHAAAaACALBwAAxwwAIAkAAMgMACAOAADFDAAgDwAAxgwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAEDXwAA0xoAIIQHAADUGgAgigcAADcAIANfAADRGgAghAcAANIaACCKBwAAIwAgA18AAM8aACCEBwAA0BoAIIoHAADlBAAgA18AAM0aACCEBwAAzhoAIIoHAAAaACAVBwAAkA0AIAkAAI0NACAKAACODQAgCwAAhw0AIA4AAIwNACAPAACKDQAgGQAAiw0AIBsAAI8NACAsAACIDQAgLQAAiQ0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHqBQEAAAABlgYBAAAAAaYGAQAAAAHWBkAAAAABAgAAACgAIF8AAIYNACADAAAAKAAgXwAAhg0AIGAAANMMACABWAAAzBoAMBoHAADsCgAgCQAA-goAIAoAAK0LACALAADDCgAgDgAAnQsAIA8AAKALACAQAAD5CgAgGQAAkgsAIBsAAIkLACAsAACrCwAgLQAArAsAILsFAACqCwAwvAUAACYAEL0FAACqCwAwvgUBAAAAAcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHnBQEA2wkAIegFAQDbCQAh6gUBANsJACGWBgEA2wkAIaYGAQDcCQAh1gZAAN8JACECAAAAKAAgWAAA0wwAIAIAAADRDAAgWAAA0gwAIA-7BQAA0AwAMLwFAADRDAAQvQUAANAMADC-BQEA2wkAIcMFAQDbCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh5gUBANsJACHnBQEA2wkAIegFAQDbCQAh6gUBANsJACGWBgEA2wkAIaYGAQDcCQAh1gZAAN8JACEPuwUAANAMADC8BQAA0QwAEL0FAADQDAAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIeYFAQDbCQAh5wUBANsJACHoBQEA2wkAIeoFAQDbCQAhlgYBANsJACGmBgEA3AkAIdYGQADfCQAhC74FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6gUBAL0LACGWBgEAvQsAIaYGAQC-CwAh1gZAAL8LACEVBwAA3QwAIAkAANoMACAKAADbDAAgCwAA1AwAIA4AANkMACAPAADXDAAgGQAA2AwAIBsAANwMACAsAADVDAAgLQAA1gwAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6gUBAL0LACGWBgEAvQsAIaYGAQC-CwAh1gZAAL8LACELXwAA8gwAMGAAAPcMADCEBwAA8wwAMIUHAAD0DAAwhgcAAPUMACCHBwAA9gwAMIgHAAD2DAAwiQcAAPYMADCKBwAA9gwAMIsHAAD4DAAwjAcAAPkMADALXwAA5QwAMGAAAOoMADCEBwAA5gwAMIUHAADnDAAwhgcAAOgMACCHBwAA6QwAMIgHAADpDAAwiQcAAOkMADCKBwAA6QwAMIsHAADrDAAwjAcAAOwMADAHXwAA3gwAIGAAAOEMACCEBwAA3wwAIIUHAADgDAAgiAcAAIkBACCJBwAAiQEAIIoHAACtAQAgBV8AAJoaACBgAADKGgAghAcAAJsaACCFBwAAyRoAIIoHAAAjACAFXwAAmBoAIGAAAMcaACCEBwAAmRoAIIUHAADGGgAgigcAAJ0BACAFXwAAlhoAIGAAAMQaACCEBwAAlxoAIIUHAADDGgAgigcAADcAIAdfAACUGgAgYAAAwRoAIIQHAACVGgAghQcAAMAaACCIBwAAGAAgiQcAABgAIIoHAAAaACAHXwAAkhoAIGAAAL4aACCEBwAAkxoAIIUHAAC9GgAgiAcAAB0AIIkHAAAdACCKBwAAHwAgBV8AAJAaACBgAAC7GgAghAcAAJEaACCFBwAAuhoAIIoHAAC7BwAgBV8AAI4aACBgAAC4GgAghAcAAI8aACCFBwAAtxoAIIoHAADlBAAgFgcAAPULACAJAAD2CwAgEAAA5AwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAf0FCAAAAAH-BQgAAAAB_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCAAAAAGEBggAAAABhQYIAAAAAYYGCAAAAAGHBggAAAABiAYIAAAAAYkGCAAAAAECAAAArQEAIF8AAN4MACADAAAAiQEAIF8AAN4MACBgAADiDAAgGAAAAIkBACAHAADxCwAgCQAA8gsAIBAAAOMMACBYAADiDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIegFAQC9CwAh_QUIAO4LACH-BQgA7gsAIf8FCADuCwAhgAYIAO4LACGBBggA7gsAIYIGCADuCwAhgwYIAO4LACGEBggA7gsAIYUGCADuCwAhhgYIAO4LACGHBggA7gsAIYgGCADuCwAhiQYIAO4LACEWBwAA8QsAIAkAAPILACAQAADjDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIegFAQC9CwAh_QUIAO4LACH-BQgA7gsAIf8FCADuCwAhgAYIAO4LACGBBggA7gsAIYIGCADuCwAhgwYIAO4LACGEBggA7gsAIYUGCADuCwAhhgYIAO4LACGHBggA7gsAIYgGCADuCwAhiQYIAO4LACEFXwAAshoAIGAAALUaACCEBwAAsxoAIIUHAAC0GgAgigcAABAAIANfAACyGgAghAcAALMaACCKBwAAEAAgBb4FAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAA-QYC9wZAAAAAAQIAAACHAQAgXwAA8QwAIAMAAACHAQAgXwAA8QwAIGAAAPAMACABWAAAsRoAMAspAAD4CgAguwUAAIMLADC8BQAAhQEAEL0FAACDCwAwvgUBAAAAAcYFQADfCQAhxwVAAN8JACH2BQAAhAv5BiL8BQEA2wkAIfcGQADfCQAh_QYAAIILACACAAAAhwEAIFgAAPAMACACAAAA7QwAIFgAAO4MACAJuwUAAOwMADC8BQAA7QwAEL0FAADsDAAwvgUBANsJACHGBUAA3wkAIccFQADfCQAh9gUAAIQL-QYi_AUBANsJACH3BkAA3wkAIQm7BQAA7AwAMLwFAADtDAAQvQUAAOwMADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACH2BQAAhAv5BiL8BQEA2wkAIfcGQADfCQAhBb4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfYFAADvDPkGIvcGQAC_CwAhAYcHAAAA-QYCBb4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfYFAADvDPkGIvcGQAC_CwAhBb4FAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAA-QYC9wZAAAAAAQ4HAACEDQAgCQAAhQ0AICgAAIINACArAACDDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAQIAAAAsACBfAACBDQAgAwAAACwAIF8AAIENACBgAAD8DAAgAVgAALAaADATBwAA8goAIAkAAPoKACAoAACoCwAgKQAA-AoAICsAAKkLACC7BQAApwsAMLwFAAAqABC9BQAApwsAML4FAQAAAAHDBQEA3AkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIfwFAQDbCQAhjgYBANsJACGUBgEA3AkAIZsGAQDcCQAhnAYBANsJACGdBgEA2wkAIQIAAAAsACBYAAD8DAAgAgAAAPoMACBYAAD7DAAgDrsFAAD5DAAwvAUAAPoMABC9BQAA-QwAML4FAQDbCQAhwwUBANwJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACH8BQEA2wkAIY4GAQDbCQAhlAYBANwJACGbBgEA3AkAIZwGAQDbCQAhnQYBANsJACEOuwUAAPkMADC8BQAA-gwAEL0FAAD5DAAwvgUBANsJACHDBQEA3AkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIfwFAQDbCQAhjgYBANsJACGUBgEA3AkAIZsGAQDcCQAhnAYBANsJACGdBgEA2wkAIQq-BQEAvQsAIcMFAQC-CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIZsGAQC-CwAhnAYBAL0LACGdBgEAvQsAIQ4HAAD_DAAgCQAAgA0AICgAAP0MACArAAD-DAAgvgUBAL0LACHDBQEAvgsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhlAYBAL4LACGbBgEAvgsAIZwGAQC9CwAhnQYBAL0LACEFXwAAohoAIGAAAK4aACCEBwAAoxoAIIUHAACtGgAgigcAADMAIAVfAACgGgAgYAAAqxoAIIQHAAChGgAghQcAAKoaACCKBwAAygEAIAdfAACeGgAgYAAAqBoAIIQHAACfGgAghQcAAKcaACCIBwAAFgAgiQcAABYAIIoHAADlBAAgB18AAJwaACBgAAClGgAghAcAAJ0aACCFBwAApBoAIIgHAAAYACCJBwAAGAAgigcAABoAIA4HAACEDQAgCQAAhQ0AICgAAIINACArAACDDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAQNfAACiGgAghAcAAKMaACCKBwAAMwAgA18AAKAaACCEBwAAoRoAIIoHAADKAQAgA18AAJ4aACCEBwAAnxoAIIoHAADlBAAgA18AAJwaACCEBwAAnRoAIIoHAAAaACAVBwAAkA0AIAkAAI0NACAKAACODQAgCwAAhw0AIA4AAIwNACAPAACKDQAgGQAAiw0AIBsAAI8NACAsAACIDQAgLQAAiQ0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHqBQEAAAABlgYBAAAAAaYGAQAAAAHWBkAAAAABBF8AAPIMADCEBwAA8wwAMIYHAAD1DAAgigcAAPYMADAEXwAA5QwAMIQHAADmDAAwhgcAAOgMACCKBwAA6QwAMANfAADeDAAghAcAAN8MACCKBwAArQEAIANfAACaGgAghAcAAJsaACCKBwAAIwAgA18AAJgaACCEBwAAmRoAIIoHAACdAQAgA18AAJYaACCEBwAAlxoAIIoHAAA3ACADXwAAlBoAIIQHAACVGgAgigcAABoAIANfAACSGgAghAcAAJMaACCKBwAAHwAgA18AAJAaACCEBwAAkRoAIIoHAAC7BwAgA18AAI4aACCEBwAAjxoAIIoHAADlBAAgA18AAIwaACCEBwAAjRoAIIoHAADlBAAgBF8AAMkMADCEBwAAygwAMIYHAADMDAAgigcAAM0MADAEXwAAtQwAMIQHAAC2DAAwhgcAALgMACCKBwAAuQwAMARfAACODAAwhAcAAI8MADCGBwAAkQwAIIoHAACSDAAwBF8AAPcLADCEBwAA-AsAMIYHAAD6CwAgigcAAPsLADAEXwAA5AsAMIQHAADlCwAwhgcAAOcLACCKBwAA6AsAMARfAADJCwAwhAcAAMoLADCGBwAAzAsAIIoHAADNCwAwA18AAIoaACCEBwAAixoAIIoHAAAaACADXwAAiBoAIIQHAACJGgAgigcAAOICACAAAAAChwcBAAAABI0HAQAAAAUChwcBAAAABI0HAQAAAAUBhwcgAAAAAQVfAACDGgAgYAAAhhoAIIQHAACEGgAghQcAAIUaACCKBwAA4gIAIAGHBwEAAAAEAYcHAQAAAAQDXwAAgxoAIIQHAACEGgAgigcAAOICACAZBAAA_xYAIAUAAIAXACAGAAD6FAAgEAAA-xQAIBkAAPwUACA0AACmEAAgPgAA_hQAIEgAAP4UACBJAACmEAAgSgAAgRcAIEsAAJUQACBMAACVEAAgTQAAghcAIE4AAIMXACBPAACEFQAgUAAAhBUAIFEAAIMVACBSAACEFwAgwgUAALkLACDwBgAAuQsAIPEGAAC5CwAg8gYAALkLACDzBgAAuQsAIPQGAAC5CwAg9QYAALkLACAAAAAFXwAA_hkAIGAAAIEaACCEBwAA_xkAIIUHAACAGgAgigcAABAAIANfAAD-GQAghAcAAP8ZACCKBwAAEAAgAAAABV8AAPkZACBgAAD8GQAghAcAAPoZACCFBwAA-xkAIIoHAABBACADXwAA-RkAIIQHAAD6GQAgigcAAEEAIAAAAAVfAAD0GQAgYAAA9xkAIIQHAAD1GQAghQcAAPYZACCKBwAAEAAgA18AAPQZACCEBwAA9RkAIIoHAAAQACAAAAAHXwAA7xkAIGAAAPIZACCEBwAA8BkAIIUHAADxGQAgiAcAAA4AIIkHAAAOACCKBwAAEAAgA18AAO8ZACCEBwAA8BkAIIoHAAAQACAAAAAAAAAAAAVfAACyGQAgYAAA7RkAIIQHAACzGQAghQcAAOwZACCKBwAA5QQAIAdfAACwGQAgYAAA6hkAIIQHAACxGQAghQcAAOkZACCIBwAAGAAgiQcAABgAIIoHAAAaACAFXwAArhkAIGAAAOcZACCEBwAArxkAIIUHAADmGQAgigcAAOICACALXwAAiA4AMGAAAIwOADCEBwAAiQ4AMIUHAACKDgAwhgcAAIsOACCHBwAAzQwAMIgHAADNDAAwiQcAAM0MADCKBwAAzQwAMIsHAACNDgAwjAcAANAMADALXwAA_w0AMGAAAIMOADCEBwAAgA4AMIUHAACBDgAwhgcAAIIOACCHBwAAogwAMIgHAACiDAAwiQcAAKIMADCKBwAAogwAMIsHAACEDgAwjAcAAKUMADALXwAA7A0AMGAAAPENADCEBwAA7Q0AMIUHAADuDQAwhgcAAO8NACCHBwAA8A0AMIgHAADwDQAwiQcAAPANADCKBwAA8A0AMIsHAADyDQAwjAcAAPMNADALXwAA1A0AMGAAANkNADCEBwAA1Q0AMIUHAADWDQAwhgcAANcNACCHBwAA2A0AMIgHAADYDQAwiQcAANgNADCKBwAA2A0AMIsHAADaDQAwjAcAANsNADALXwAAyQ0AMGAAAM0NADCEBwAAyg0AMIUHAADLDQAwhgcAAMwNACCHBwAAzQsAMIgHAADNCwAwiQcAAM0LADCKBwAAzQsAMIsHAADODQAwjAcAANALADAVEAAA0w0AIBgAAOELACAeAADeCwAgHwAA3wsAICAAAOALACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAfYFAAAAxQYC-AVAAAAAAfsFAQAAAAHDBgAAAMMGAsUGAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAECAAAAXQAgXwAA0g0AIAMAAABdACBfAADSDQAgYAAA0A0AIAFYAADlGQAwAgAAAF0AIFgAANANACACAAAA0QsAIFgAAM8NACAPvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACH2BQAA1AvFBiL4BUAA1QsAIfsFAQC-CwAhwwYAANMLwwYixQYBAL0LACHGBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0Q0AIBgAANoLACAeAADXCwAgHwAA2AsAICAAANkLACAhAADcCwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACH2BQAA1AvFBiL4BUAA1QsAIfsFAQC-CwAhwwYAANMLwwYixQYBAL0LACHGBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEHXwAA4BkAIGAAAOMZACCEBwAA4RkAIIUHAADiGQAgiAcAAA4AIIkHAAAOACCKBwAAEAAgFRAAANMNACAYAADhCwAgHgAA3gsAIB8AAN8LACAgAADgCwAgIQAA4wsAIL4FAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLFBgEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGAQAAAAHLBkAAAAABA18AAOAZACCEBwAA4RkAIIoHAAAQACAaBwAA6A0AIAkAAOkNACAbAADqDQAgHQAA6w0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAACsBgKWBgEAAAABqAYBAAAAAaoGAAAAqgYCrAYCAAAAAa0GEAAAAAGuBgEAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQYBAAAAAbYGgAAAAAG3BkAAAAABuAZAAAAAAQIAAABXACBfAADnDQAgAwAAAFcAIF8AAOcNACBgAADiDQAgAVgAAN8ZADAfBwAA7AoAIAkAAIgLACAZAACSCwAgGwAAiQsAIB0AAJMLACC7BQAAjgsAMLwFAABVABC9BQAAjgsAML4FAQAAAAHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIeoFAQDbCQAh9gUAAJALrAYilgYBANsJACGoBgEA2wkAIaoGAACPC6oGIqwGAgD0CgAhrQYQAIcLACGuBgEA2wkAIa8GAQDbCQAhsAYBAAAAAbEGAQAAAAGyBgEA3AkAIbMGAQDcCQAhtAYBANwJACG1BgEA3AkAIbYGAACRCwAgtwZAAN8JACG4BkAA8AoAIQIAAABXACBYAADiDQAgAgAAANwNACBYAADdDQAgGrsFAADbDQAwvAUAANwNABC9BQAA2w0AML4FAQDbCQAhwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACHqBQEA2wkAIfYFAACQC6wGIpYGAQDbCQAhqAYBANsJACGqBgAAjwuqBiKsBgIA9AoAIa0GEACHCwAhrgYBANsJACGvBgEA2wkAIbAGAQDbCQAhsQYBANwJACGyBgEA3AkAIbMGAQDcCQAhtAYBANwJACG1BgEA3AkAIbYGAACRCwAgtwZAAN8JACG4BkAA8AoAIRq7BQAA2w0AMLwFAADcDQAQvQUAANsNADC-BQEA2wkAIcMFAQDbCQAhxAUBANsJACHGBUAA3wkAIccFQADfCQAh6gUBANsJACH2BQAAkAusBiKWBgEA2wkAIagGAQDbCQAhqgYAAI8LqgYirAYCAPQKACGtBhAAhwsAIa4GAQDbCQAhrwYBANsJACGwBgEA2wkAIbEGAQDcCQAhsgYBANwJACGzBgEA3AkAIbQGAQDcCQAhtQYBANwJACG2BgAAkQsAILcGQADfCQAhuAZAAPAKACEWvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIfYFAADfDawGIpYGAQC9CwAhqAYBAL0LACGqBgAA3g2qBiKsBgIA4A0AIa0GEADhDQAhrgYBAL0LACGvBgEAvQsAIbAGAQC9CwAhsQYBAL4LACGyBgEAvgsAIbMGAQC-CwAhtAYBAL4LACG1BgEAvgsAIbYGgAAAAAG3BkAAvwsAIbgGQADVCwAhAYcHAAAAqgYCAYcHAAAArAYCBYcHAgAAAAGOBwIAAAABjwcCAAAAAZAHAgAAAAGRBwIAAAABBYcHEAAAAAGOBxAAAAABjwcQAAAAAZAHEAAAAAGRBxAAAAABGgcAAOMNACAJAADkDQAgGwAA5Q0AIB0AAOYNACC-BQEAvQsAIcMFAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAh9gUAAN8NrAYilgYBAL0LACGoBgEAvQsAIaoGAADeDaoGIqwGAgDgDQAhrQYQAOENACGuBgEAvQsAIa8GAQC9CwAhsAYBAL0LACGxBgEAvgsAIbIGAQC-CwAhswYBAL4LACG0BgEAvgsAIbUGAQC-CwAhtgaAAAAAAbcGQAC_CwAhuAZAANULACEFXwAA0RkAIGAAAN0ZACCEBwAA0hkAIIUHAADcGQAgigcAAOUEACAFXwAAzxkAIGAAANoZACCEBwAA0BkAIIUHAADZGQAgigcAABoAIAVfAADNGQAgYAAA1xkAIIQHAADOGQAghQcAANYZACCKBwAAuwcAIAVfAADLGQAgYAAA1BkAIIQHAADMGQAghQcAANMZACCKBwAAdgAgGgcAAOgNACAJAADpDQAgGwAA6g0AIB0AAOsNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAArAYClgYBAAAAAagGAQAAAAGqBgAAAKoGAqwGAgAAAAGtBhAAAAABrgYBAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BoAAAAABtwZAAAAAAbgGQAAAAAEDXwAA0RkAIIQHAADSGQAgigcAAOUEACADXwAAzxkAIIQHAADQGQAgigcAABoAIANfAADNGQAghAcAAM4ZACCKBwAAuwcAIANfAADLGQAghAcAAMwZACCKBwAAdgAgDhYAAPwNACAXAAD9DQAgGAAA_g0AIL4FAQAAAAHGBUAAAAABxwVAAAAAAfQFAQAAAAH2BQAAAIwGAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABjAYBAAAAAQIAAABNACBfAAD7DQAgAwAAAE0AIF8AAPsNACBgAAD3DQAgAVgAAMoZADAUFgAAlwsAIBcAAOAJACAYAADxCgAgGQAAjQsAILsFAACVCwAwvAUAAEsAEL0FAACVCwAwvgUBAAAAAcYFQADfCQAhxwVAAN8JACHqBQEA3AkAIfQFAQDcCQAh9gUAAJYLjAYi9wUBANwJACH4BUAA8AoAIfkFQADfCQAh-gUBANsJACH7BQEA3AkAIYwGAQDbCQAh_wYAAJQLACACAAAATQAgWAAA9w0AIAIAAAD0DQAgWAAA9Q0AIA-7BQAA8w0AMLwFAAD0DQAQvQUAAPMNADC-BQEA2wkAIcYFQADfCQAhxwVAAN8JACHqBQEA3AkAIfQFAQDcCQAh9gUAAJYLjAYi9wUBANwJACH4BUAA8AoAIfkFQADfCQAh-gUBANsJACH7BQEA3AkAIYwGAQDbCQAhD7sFAADzDQAwvAUAAPQNABC9BQAA8w0AML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIeoFAQDcCQAh9AUBANwJACH2BQAAlguMBiL3BQEA3AkAIfgFQADwCgAh-QVAAN8JACH6BQEA2wkAIfsFAQDcCQAhjAYBANsJACELvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh9AUBAL4LACH2BQAA9g2MBiL3BQEAvgsAIfgFQADVCwAh-QVAAL8LACH6BQEAvQsAIfsFAQC-CwAhjAYBAL0LACEBhwcAAACMBgIOFgAA-A0AIBcAAPkNACAYAAD6DQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh9AUBAL4LACH2BQAA9g2MBiL3BQEAvgsAIfgFQADVCwAh-QVAAL8LACH6BQEAvQsAIfsFAQC-CwAhjAYBAL0LACEFXwAAvxkAIGAAAMgZACCEBwAAwBkAIIUHAADHGQAgigcAALwGACAFXwAAvRkAIGAAAMUZACCEBwAAvhkAIIUHAADEGQAgigcAAOICACAHXwAAuxkAIGAAAMIZACCEBwAAvBkAIIUHAADBGQAgiAcAAFEAIIkHAABRACCKBwAA4gIAIA4WAAD8DQAgFwAA_Q0AIBgAAP4NACC-BQEAAAABxgVAAAAAAccFQAAAAAH0BQEAAAAB9gUAAACMBgL3BQEAAAAB-AVAAAAAAfkFQAAAAAH6BQEAAAAB-wUBAAAAAYwGAQAAAAEDXwAAvxkAIIQHAADAGQAgigcAALwGACADXwAAvRkAIIQHAAC-GQAgigcAAOICACADXwAAuxkAIIQHAAC8GQAgigcAAOICACANBwAArgwAIAkAAK8MACASAACuDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHpBQEAAAAB6wUBAAAAAewFAQAAAAHtBQEAAAAB7gVAAAAAAQIAAABGACBfAACHDgAgAwAAAEYAIF8AAIcOACBgAACGDgAgAVgAALoZADACAAAARgAgWAAAhg4AIAIAAACmDAAgWAAAhQ4AIAq-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh6QUBAL0LACHrBQEAvgsAIewFAQC-CwAh7QUBAL4LACHuBUAAvwsAIQ0HAACqDAAgCQAAqwwAIBIAAK0NACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh6QUBAL0LACHrBQEAvgsAIewFAQC-CwAh7QUBAL4LACHuBUAAvwsAIQ0HAACuDAAgCQAArwwAIBIAAK4NACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAekFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBUAAAAABFQcAAJANACAJAACNDQAgCgAAjg0AIAsAAIcNACAOAACMDQAgDwAAig0AIBAAAJIOACAbAACPDQAgLAAAiA0AIC0AAIkNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAZYGAQAAAAGmBgEAAAAB1gZAAAAAAQIAAAAoACBfAACRDgAgAwAAACgAIF8AAJEOACBgAACPDgAgAVgAALkZADACAAAAKAAgWAAAjw4AIAIAAADRDAAgWAAAjg4AIAu-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHnBQEAvQsAIegFAQC9CwAhlgYBAL0LACGmBgEAvgsAIdYGQAC_CwAhFQcAAN0MACAJAADaDAAgCgAA2wwAIAsAANQMACAOAADZDAAgDwAA1wwAIBAAAJAOACAbAADcDAAgLAAA1QwAIC0AANYMACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHnBQEAvQsAIegFAQC9CwAhlgYBAL0LACGmBgEAvgsAIdYGQAC_CwAhBV8AALQZACBgAAC3GQAghAcAALUZACCFBwAAthkAIIoHAAAQACAVBwAAkA0AIAkAAI0NACAKAACODQAgCwAAhw0AIA4AAIwNACAPAACKDQAgEAAAkg4AIBsAAI8NACAsAACIDQAgLQAAiQ0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAABlgYBAAAAAaYGAQAAAAHWBkAAAAABA18AALQZACCEBwAAtRkAIIoHAAAQACADXwAAshkAIIQHAACzGQAgigcAAOUEACADXwAAsBkAIIQHAACxGQAgigcAABoAIANfAACuGQAghAcAAK8ZACCKBwAA4gIAIARfAACIDgAwhAcAAIkOADCGBwAAiw4AIIoHAADNDAAwBF8AAP8NADCEBwAAgA4AMIYHAACCDgAgigcAAKIMADAEXwAA7A0AMIQHAADtDQAwhgcAAO8NACCKBwAA8A0AMARfAADUDQAwhAcAANUNADCGBwAA1w0AIIoHAADYDQAwBF8AAMkNADCEBwAAyg0AMIYHAADMDQAgigcAAM0LADAAAAAHXwAAqRkAIGAAAKwZACCEBwAAqhkAIIUHAACrGQAgiAcAAFMAIIkHAABTACCKBwAAnQEAIANfAACpGQAghAcAAKoZACCKBwAAnQEAIAAAAAKHBwEAAAAEjQcBAAAABQVfAACkGQAgYAAApxkAIIQHAAClGQAghQcAAKYZACCKBwAA4gIAIAGHBwEAAAAEA18AAKQZACCEBwAApRkAIIoHAADiAgAgAAAAC18AAJIPADBgAACXDwAwhAcAAJMPADCFBwAAlA8AMIYHAACVDwAghwcAAJYPADCIBwAAlg8AMIkHAACWDwAwigcAAJYPADCLBwAAmA8AMIwHAACZDwAwC18AAN4OADBgAADjDgAwhAcAAN8OADCFBwAA4A4AMIYHAADhDgAghwcAAOIOADCIBwAA4g4AMIkHAADiDgAwigcAAOIOADCLBwAA5A4AMIwHAADlDgAwC18AANUOADBgAADZDgAwhAcAANYOADCFBwAA1w4AMIYHAADYDgAghwcAAM0MADCIBwAAzQwAMIkHAADNDAAwigcAAM0MADCLBwAA2g4AMIwHAADQDAAwC18AALoOADBgAAC_DgAwhAcAALsOADCFBwAAvA4AMIYHAAC9DgAghwcAAL4OADCIBwAAvg4AMIkHAAC-DgAwigcAAL4OADCLBwAAwA4AMIwHAADBDgAwC18AAK8OADBgAACzDgAwhAcAALAOADCFBwAAsQ4AMIYHAACyDgAghwcAANgNADCIBwAA2A0AMIkHAADYDQAwigcAANgNADCLBwAAtA4AMIwHAADbDQAwGgcAAOgNACAJAADpDQAgGQAAuQ4AIB0AAOsNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAKwGAqgGAQAAAAGqBgAAAKoGAqwGAgAAAAGtBhAAAAABrgYBAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BoAAAAABtwZAAAAAAbgGQAAAAAECAAAAVwAgXwAAuA4AIAMAAABXACBfAAC4DgAgYAAAtg4AIAFYAACjGQAwAgAAAFcAIFgAALYOACACAAAA3A0AIFgAALUOACAWvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIeoFAQC9CwAh9gUAAN8NrAYiqAYBAL0LACGqBgAA3g2qBiKsBgIA4A0AIa0GEADhDQAhrgYBAL0LACGvBgEAvQsAIbAGAQC9CwAhsQYBAL4LACGyBgEAvgsAIbMGAQC-CwAhtAYBAL4LACG1BgEAvgsAIbYGgAAAAAG3BkAAvwsAIbgGQADVCwAhGgcAAOMNACAJAADkDQAgGQAAtw4AIB0AAOYNACC-BQEAvQsAIcMFAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL0LACH2BQAA3w2sBiKoBgEAvQsAIaoGAADeDaoGIqwGAgDgDQAhrQYQAOENACGuBgEAvQsAIa8GAQC9CwAhsAYBAL0LACGxBgEAvgsAIbIGAQC-CwAhswYBAL4LACG0BgEAvgsAIbUGAQC-CwAhtgaAAAAAAbcGQAC_CwAhuAZAANULACEFXwAAnhkAIGAAAKEZACCEBwAAnxkAIIUHAACgGQAgigcAAJ0BACAaBwAA6A0AIAkAAOkNACAZAAC5DgAgHQAA6w0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAfYFAAAArAYCqAYBAAAAAaoGAAAAqgYCrAYCAAAAAa0GEAAAAAGuBgEAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQYBAAAAAbYGgAAAAAG3BkAAAAABuAZAAAAAAQNfAACeGQAghAcAAJ8ZACCKBwAAnQEAIAwHAADSDgAgCQAA0w4AIBwAANQOACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAa4GAQAAAAG5BhAAAAABugYQAAAAAbsGIAAAAAECAAAAdgAgXwAA0Q4AIAMAAAB2ACBfAADRDgAgYAAAxA4AIAFYAACdGQAwEgcAAOwKACAJAACICwAgGwAAiQsAIBwAAP8JACC7BQAAhgsAMLwFAAB0ABC9BQAAhgsAML4FAQAAAAHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIZYGAQDbCQAhrgYBANsJACG5BhAAhwsAIboGEACHCwAhuwYgAN4JACH-BgAAhQsAIAIAAAB2ACBYAADEDgAgAgAAAMIOACBYAADDDgAgDbsFAADBDgAwvAUAAMIOABC9BQAAwQ4AML4FAQDbCQAhwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACGWBgEA2wkAIa4GAQDbCQAhuQYQAIcLACG6BhAAhwsAIbsGIADeCQAhDbsFAADBDgAwvAUAAMIOABC9BQAAwQ4AML4FAQDbCQAhwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACGWBgEA2wkAIa4GAQDbCQAhuQYQAIcLACG6BhAAhwsAIbsGIADeCQAhCb4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGuBgEAvQsAIbkGEADhDQAhugYQAOENACG7BiAAnw0AIQwHAADFDgAgCQAAxg4AIBwAAMcOACC-BQEAvQsAIcMFAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAhrgYBAL0LACG5BhAA4Q0AIboGEADhDQAhuwYgAJ8NACEFXwAAlBkAIGAAAJsZACCEBwAAlRkAIIUHAACaGQAgigcAAOUEACAFXwAAkhkAIGAAAJgZACCEBwAAkxkAIIUHAACXGQAgigcAABoAIAtfAADIDgAwYAAAzA4AMIQHAADJDgAwhQcAAMoOADCGBwAAyw4AIIcHAADYDQAwiAcAANgNADCJBwAA2A0AMIoHAADYDQAwiwcAAM0OADCMBwAA2w0AMBoHAADoDQAgCQAA6Q0AIBkAALkOACAbAADqDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHqBQEAAAAB9gUAAACsBgKWBgEAAAABqgYAAACqBgKsBgIAAAABrQYQAAAAAa4GAQAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BgEAAAABtgaAAAAAAbcGQAAAAAG4BkAAAAABAgAAAFcAIF8AANAOACADAAAAVwAgXwAA0A4AIGAAAM8OACABWAAAlhkAMAIAAABXACBYAADPDgAgAgAAANwNACBYAADODgAgFr4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHqBQEAvQsAIfYFAADfDawGIpYGAQC9CwAhqgYAAN4NqgYirAYCAOANACGtBhAA4Q0AIa4GAQC9CwAhrwYBAL0LACGwBgEAvQsAIbEGAQC-CwAhsgYBAL4LACGzBgEAvgsAIbQGAQC-CwAhtQYBAL4LACG2BoAAAAABtwZAAL8LACG4BkAA1QsAIRoHAADjDQAgCQAA5A0AIBkAALcOACAbAADlDQAgvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIeoFAQC9CwAh9gUAAN8NrAYilgYBAL0LACGqBgAA3g2qBiKsBgIA4A0AIa0GEADhDQAhrgYBAL0LACGvBgEAvQsAIbAGAQC9CwAhsQYBAL4LACGyBgEAvgsAIbMGAQC-CwAhtAYBAL4LACG1BgEAvgsAIbYGgAAAAAG3BkAAvwsAIbgGQADVCwAhGgcAAOgNACAJAADpDQAgGQAAuQ4AIBsAAOoNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAKwGApYGAQAAAAGqBgAAAKoGAqwGAgAAAAGtBhAAAAABrgYBAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BoAAAAABtwZAAAAAAbgGQAAAAAEMBwAA0g4AIAkAANMOACAcAADUDgAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGuBgEAAAABuQYQAAAAAboGEAAAAAG7BiAAAAABA18AAJQZACCEBwAAlRkAIIoHAADlBAAgA18AAJIZACCEBwAAkxkAIIoHAAAaACAEXwAAyA4AMIQHAADJDgAwhgcAAMsOACCKBwAA2A0AMBUHAACQDQAgCQAAjQ0AIAoAAI4NACALAACHDQAgDgAAjA0AIA8AAIoNACAQAACSDgAgGQAAiw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHqBQEAAAABpgYBAAAAAdYGQAAAAAECAAAAKAAgXwAA3Q4AIAMAAAAoACBfAADdDgAgYAAA3A4AIAFYAACRGQAwAgAAACgAIFgAANwOACACAAAA0QwAIFgAANsOACALvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIeoFAQC9CwAhpgYBAL4LACHWBkAAvwsAIRUHAADdDAAgCQAA2gwAIAoAANsMACALAADUDAAgDgAA2QwAIA8AANcMACAQAACQDgAgGQAA2AwAICwAANUMACAtAADWDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIeoFAQC9CwAhpgYBAL4LACHWBkAAvwsAIRUHAACQDQAgCQAAjQ0AIAoAAI4NACALAACHDQAgDgAAjA0AIA8AAIoNACAQAACSDgAgGQAAiw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHqBQEAAAABpgYBAAAAAdYGQAAAAAEPBwAAjw8AIAkAAJAPACANAACMDwAgEQAAjQ8AICQAAI4PACAmAACRDwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZUGAgAAAAGXBgEAAAABAgAAADcAIF8AAIsPACADAAAANwAgXwAAiw8AIGAAAOkOACABWAAAkBkAMBQHAADsCgAgCQAA-goAIA0AAP0JACARAAC-CgAgGwAAiQsAICQAAMAKACAmAACjCwAguwUAAKELADC8BQAANQAQvQUAAKELADC-BQEAAAABwwUBANsJACHEBQEA3AkAIcYFQADfCQAhxwVAAN8JACGOBgEA2wkAIZQGAQDcCQAhlQYCAKILACGWBgEA2wkAIZcGAQDcCQAhAgAAADcAIFgAAOkOACACAAAA5g4AIFgAAOcOACANuwUAAOUOADC8BQAA5g4AEL0FAADlDgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACGVBgIAogsAIZYGAQDbCQAhlwYBANwJACENuwUAAOUOADC8BQAA5g4AEL0FAADlDgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACGVBgIAogsAIZYGAQDbCQAhlwYBANwJACEJvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhlAYBAL4LACGVBgIA6A4AIZcGAQC-CwAhBYcHAgAAAAGOBwIAAAABjwcCAAAAAZAHAgAAAAGRBwIAAAABDwcAAO0OACAJAADuDgAgDQAA6g4AIBEAAOsOACAkAADsDgAgJgAA7w4AIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIZQGAQC-CwAhlQYCAOgOACGXBgEAvgsAIQtfAACCDwAwYAAAhg8AMIQHAACDDwAwhQcAAIQPADCGBwAAhQ8AIIcHAADNDAAwiAcAAM0MADCJBwAAzQwAMIoHAADNDAAwiwcAAIcPADCMBwAA0AwAMAtfAAD5DgAwYAAA_Q4AMIQHAAD6DgAwhQcAAPsOADCGBwAA_A4AIIcHAAC5DAAwiAcAALkMADCJBwAAuQwAMIoHAAC5DAAwiwcAAP4OADCMBwAAvAwAMAtfAADwDgAwYAAA9A4AMIQHAADxDgAwhQcAAPIOADCGBwAA8w4AIIcHAACSDAAwiAcAAJIMADCJBwAAkgwAMIoHAACSDAAwiwcAAPUOADCMBwAAlQwAMAVfAACCGQAgYAAAjhkAIIQHAACDGQAghQcAAI0ZACCKBwAA5QQAIAdfAACAGQAgYAAAixkAIIQHAACBGQAghQcAAIoZACCIBwAAGAAgiQcAABgAIIoHAAAaACAHXwAA_hgAIGAAAIgZACCEBwAA_xgAIIUHAACHGQAgiAcAAGsAIIkHAABrACCKBwAAlwEAIA4HAACyDAAgCQAAswwAIBAAALMNACAjAAC0DAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB7wUBAAAAAfAFAQAAAAHyBQAAAPIFAvMFQAAAAAECAAAAQQAgXwAA-A4AIAMAAABBACBfAAD4DgAgYAAA9w4AIAFYAACGGQAwAgAAAEEAIFgAAPcOACACAAAAlgwAIFgAAPYOACAKvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIegFAQC9CwAh7wUBAL0LACHwBQEAvgsAIfIFAACYDPIFIvMFQADVCwAhDgcAAJsMACAJAACcDAAgEAAAsg0AICMAAJ0MACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh6AUBAL0LACHvBQEAvQsAIfAFAQC-CwAh8gUAAJgM8gUi8wVAANULACEOBwAAsgwAIAkAALMMACAQAACzDQAgIwAAtAwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAe8FAQAAAAHwBQEAAAAB8gUAAADyBQLzBUAAAAABCwcAAMcMACAJAADIDAAgDwAAxgwAIBAAAKkNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAecFAQAAAAHoBQEAAAABAgAAADwAIF8AAIEPACADAAAAPAAgXwAAgQ8AIGAAAIAPACABWAAAhRkAMAIAAAA8ACBYAACADwAgAgAAAL0MACBYAAD_DgAgB74FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHnBQEAvQsAIegFAQC9CwAhCwcAAMIMACAJAADDDAAgDwAAwQwAIBAAAKgNACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5wUBAL0LACHoBQEAvQsAIQsHAADHDAAgCQAAyAwAIA8AAMYMACAQAACpDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHnBQEAAAAB6AUBAAAAARUHAACQDQAgCQAAjQ0AIAoAAI4NACALAACHDQAgDwAAig0AIBAAAJIOACAZAACLDQAgGwAAjw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHnBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAECAAAAKAAgXwAAig8AIAMAAAAoACBfAACKDwAgYAAAiQ8AIAFYAACEGQAwAgAAACgAIFgAAIkPACACAAAA0QwAIFgAAIgPACALvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIecFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAhpgYBAL4LACHWBkAAvwsAIRUHAADdDAAgCQAA2gwAIAoAANsMACALAADUDAAgDwAA1wwAIBAAAJAOACAZAADYDAAgGwAA3AwAICwAANUMACAtAADWDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIecFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAhpgYBAL4LACHWBkAAvwsAIRUHAACQDQAgCQAAjQ0AIAoAAI4NACALAACHDQAgDwAAig0AIBAAAJIOACAZAACLDQAgGwAAjw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHnBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAEPBwAAjw8AIAkAAJAPACANAACMDwAgEQAAjQ8AICQAAI4PACAmAACRDwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZUGAgAAAAGXBgEAAAABBF8AAIIPADCEBwAAgw8AMIYHAACFDwAgigcAAM0MADAEXwAA-Q4AMIQHAAD6DgAwhgcAAPwOACCKBwAAuQwAMARfAADwDgAwhAcAAPEOADCGBwAA8w4AIIoHAACSDAAwA18AAIIZACCEBwAAgxkAIIoHAADlBAAgA18AAIAZACCEBwAAgRkAIIoHAAAaACADXwAA_hgAIIQHAAD_GAAgigcAAJcBACANBwAArg8AIAkAAK8PACALAACtDwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAH2BQAAAJsGAo4GAQAAAAGUBgEAAAABmAYBAAAAAZkGAQAAAAECAAAAMwAgXwAArA8AIAMAAAAzACBfAACsDwAgYAAAnQ8AIAFYAAD9GAAwEgcAAPIKACAJAAD6CgAgCwAAwwoAIBsAAKYLACC7BQAApAsAMLwFAAAxABC9BQAApAsAML4FAQAAAAHDBQEA3AkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIfYFAAClC5sGIo4GAQDbCQAhlAYBANwJACGWBgEA3AkAIZgGAQDbCQAhmQYBANsJACECAAAAMwAgWAAAnQ8AIAIAAACaDwAgWAAAmw8AIA67BQAAmQ8AMLwFAACaDwAQvQUAAJkPADC-BQEA2wkAIcMFAQDcCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh9gUAAKULmwYijgYBANsJACGUBgEA3AkAIZYGAQDcCQAhmAYBANsJACGZBgEA2wkAIQ67BQAAmQ8AMLwFAACaDwAQvQUAAJkPADC-BQEA2wkAIcMFAQDcCQAhxAUBANwJACHGBUAA3wkAIccFQADfCQAh9gUAAKULmwYijgYBANsJACGUBgEA3AkAIZYGAQDcCQAhmAYBANsJACGZBgEA2wkAIQq-BQEAvQsAIcMFAQC-CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh9gUAAJwPmwYijgYBAL0LACGUBgEAvgsAIZgGAQC9CwAhmQYBAL0LACEBhwcAAACbBgINBwAAnw8AIAkAAKAPACALAACeDwAgvgUBAL0LACHDBQEAvgsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIfYFAACcD5sGIo4GAQC9CwAhlAYBAL4LACGYBgEAvQsAIZkGAQC9CwAhC18AAKEPADBgAAClDwAwhAcAAKIPADCFBwAAow8AMIYHAACkDwAghwcAAPYMADCIBwAA9gwAMIkHAAD2DAAwigcAAPYMADCLBwAApg8AMIwHAAD5DAAwB18AAO8YACBgAAD7GAAghAcAAPAYACCFBwAA-hgAIIgHAAAWACCJBwAAFgAgigcAAOUEACAHXwAA7RgAIGAAAPgYACCEBwAA7hgAIIUHAAD3GAAgiAcAABgAIIkHAAAYACCKBwAAGgAgDgcAAIQNACAJAACFDQAgKQAAqw8AICsAAIMNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfwFAQAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGdBgEAAAABAgAAACwAIF8AAKoPACADAAAALAAgXwAAqg8AIGAAAKgPACABWAAA9hgAMAIAAAAsACBYAACoDwAgAgAAAPoMACBYAACnDwAgCr4FAQC9CwAhwwUBAL4LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH8BQEAvQsAIY4GAQC9CwAhlAYBAL4LACGbBgEAvgsAIZ0GAQC9CwAhDgcAAP8MACAJAACADQAgKQAAqQ8AICsAAP4MACC-BQEAvQsAIcMFAQC-CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh_AUBAL0LACGOBgEAvQsAIZQGAQC-CwAhmwYBAL4LACGdBgEAvQsAIQVfAADxGAAgYAAA9BgAIIQHAADyGAAghQcAAPMYACCKBwAAKAAgDgcAAIQNACAJAACFDQAgKQAAqw8AICsAAIMNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfwFAQAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGdBgEAAAABA18AAPEYACCEBwAA8hgAIIoHAAAoACANBwAArg8AIAkAAK8PACALAACtDwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAH2BQAAAJsGAo4GAQAAAAGUBgEAAAABmAYBAAAAAZkGAQAAAAEEXwAAoQ8AMIQHAACiDwAwhgcAAKQPACCKBwAA9gwAMANfAADvGAAghAcAAPAYACCKBwAA5QQAIANfAADtGAAghAcAAO4YACCKBwAAGgAgBF8AAJIPADCEBwAAkw8AMIYHAACVDwAgigcAAJYPADAEXwAA3g4AMIQHAADfDgAwhgcAAOEOACCKBwAA4g4AMARfAADVDgAwhAcAANYOADCGBwAA2A4AIIoHAADNDAAwBF8AALoOADCEBwAAuw4AMIYHAAC9DgAgigcAAL4OADAEXwAArw4AMIQHAACwDgAwhgcAALIOACCKBwAA2A0AMAAAAAAAAAAAAAAFXwAA6BgAIGAAAOsYACCEBwAA6RgAIIUHAADqGAAgigcAALsHACADXwAA6BgAIIQHAADpGAAgigcAALsHACAAAAAHXwAA4xgAIGAAAOYYACCEBwAA5BgAIIUHAADlGAAgiAcAAC8AIIkHAAAvACCKBwAAuwcAIANfAADjGAAghAcAAOQYACCKBwAAuwcAIAAAAAAAAAAAC18AANsPADBgAADgDwAwhAcAANwPADCFBwAA3Q8AMIYHAADeDwAghwcAAN8PADCIBwAA3w8AMIkHAADfDwAwigcAAN8PADCLBwAA4Q8AMIwHAADiDwAwC18AANIPADBgAADWDwAwhAcAANMPADCFBwAA1A8AMIYHAADVDwAghwcAAM0MADCIBwAAzQwAMIkHAADNDAAwigcAAM0MADCLBwAA1w8AMIwHAADQDAAwBV8AAM0YACBgAADhGAAghAcAAM4YACCFBwAA4BgAIIoHAADlBAAgBV8AAMsYACBgAADeGAAghAcAAMwYACCFBwAA3RgAIIoHAAAaACAVBwAAkA0AIAkAAI0NACALAACHDQAgDgAAjA0AIA8AAIoNACAQAACSDgAgGQAAiw0AIBsAAI8NACAsAACIDQAgLQAAiQ0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6gUBAAAAAZYGAQAAAAHWBkAAAAABAgAAACgAIF8AANoPACADAAAAKAAgXwAA2g8AIGAAANkPACABWAAA3BgAMAIAAAAoACBYAADZDwAgAgAAANEMACBYAADYDwAgC74FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAh1gZAAL8LACEVBwAA3QwAIAkAANoMACALAADUDAAgDgAA2QwAIA8AANcMACAQAACQDgAgGQAA2AwAIBsAANwMACAsAADVDAAgLQAA1gwAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAh1gZAAL8LACEVBwAAkA0AIAkAAI0NACALAACHDQAgDgAAjA0AIA8AAIoNACAQAACSDgAgGQAAiw0AIBsAAI8NACAsAACIDQAgLQAAiQ0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6gUBAAAAAZYGAQAAAAHWBkAAAAABDQcAAP0PACAJAAD-DwAgDQAA_w8AIBEAAIAQACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAGgBgIAAAAB1wYBAAAAAdgGAQAAAAECAAAAIwAgXwAA_A8AIAMAAAAjACBfAAD8DwAgYAAA5Q8AIAFYAADbGAAwEgcAAOwKACAJAACICwAgCgAArQsAIA0AAP0JACARAAC-CgAguwUAAK4LADC8BQAAIQAQvQUAAK4LADC-BQEAAAABwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACGUBgEA3AkAIaAGAgCiCwAhpgYBANwJACHXBgEAAAAB2AYBANsJACECAAAAIwAgWAAA5Q8AIAIAAADjDwAgWAAA5A8AIA27BQAA4g8AMLwFAADjDwAQvQUAAOIPADC-BQEA2wkAIcMFAQDbCQAhxAUBANsJACHGBUAA3wkAIccFQADfCQAhlAYBANwJACGgBgIAogsAIaYGAQDcCQAh1wYBANsJACHYBgEA2wkAIQ27BQAA4g8AMLwFAADjDwAQvQUAAOIPADC-BQEA2wkAIcMFAQDbCQAhxAUBANsJACHGBUAA3wkAIccFQADfCQAhlAYBANwJACGgBgIAogsAIaYGAQDcCQAh1wYBANsJACHYBgEA2wkAIQm-BQEAvQsAIcMFAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGgBgIA6A4AIdcGAQC9CwAh2AYBAL0LACENBwAA5g8AIAkAAOcPACANAADoDwAgEQAA6Q8AIL4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaAGAgDoDgAh1wYBAL0LACHYBgEAvQsAIQVfAADRGAAgYAAA2RgAIIQHAADSGAAghQcAANgYACCKBwAA5QQAIAVfAADPGAAgYAAA1hgAIIQHAADQGAAghQcAANUYACCKBwAAGgAgC18AAPMPADBgAAD3DwAwhAcAAPQPADCFBwAA9Q8AMIYHAAD2DwAghwcAAM0MADCIBwAAzQwAMIkHAADNDAAwigcAAM0MADCLBwAA-A8AMIwHAADQDAAwC18AAOoPADBgAADuDwAwhAcAAOsPADCFBwAA7A8AMIYHAADtDwAghwcAALkMADCIBwAAuQwAMIkHAAC5DAAwigcAALkMADCLBwAA7w8AMIwHAAC8DAAwCwcAAMcMACAJAADIDAAgDgAAxQwAIBAAAKkNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHoBQEAAAABAgAAADwAIF8AAPIPACADAAAAPAAgXwAA8g8AIGAAAPEPACABWAAA1BgAMAIAAAA8ACBYAADxDwAgAgAAAL0MACBYAADwDwAgB74FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIegFAQC9CwAhCwcAAMIMACAJAADDDAAgDgAAwAwAIBAAAKgNACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHoBQEAvQsAIQsHAADHDAAgCQAAyAwAIA4AAMUMACAQAACpDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB6AUBAAAAARUHAACQDQAgCQAAjQ0AIAoAAI4NACALAACHDQAgDgAAjA0AIBAAAJIOACAZAACLDQAgGwAAjw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAECAAAAKAAgXwAA-w8AIAMAAAAoACBfAAD7DwAgYAAA-g8AIAFYAADTGAAwAgAAACgAIFgAAPoPACACAAAA0QwAIFgAAPkPACALvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAhpgYBAL4LACHWBkAAvwsAIRUHAADdDAAgCQAA2gwAIAoAANsMACALAADUDAAgDgAA2QwAIBAAAJAOACAZAADYDAAgGwAA3AwAICwAANUMACAtAADWDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAhpgYBAL4LACHWBkAAvwsAIRUHAACQDQAgCQAAjQ0AIAoAAI4NACALAACHDQAgDgAAjA0AIBAAAJIOACAZAACLDQAgGwAAjw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAENBwAA_Q8AIAkAAP4PACANAAD_DwAgEQAAgBAAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaAGAgAAAAHXBgEAAAAB2AYBAAAAAQNfAADRGAAghAcAANIYACCKBwAA5QQAIANfAADPGAAghAcAANAYACCKBwAAGgAgBF8AAPMPADCEBwAA9A8AMIYHAAD2DwAgigcAAM0MADAEXwAA6g8AMIQHAADrDwAwhgcAAO0PACCKBwAAuQwAMARfAADbDwAwhAcAANwPADCGBwAA3g8AIIoHAADfDwAwBF8AANIPADCEBwAA0w8AMIYHAADVDwAgigcAAM0MADADXwAAzRgAIIQHAADOGAAgigcAAOUEACADXwAAyxgAIIQHAADMGAAgigcAABoAIAAAAAKHBwEAAAAEjQcBAAAABQtfAACKEAAwYAAAjhAAMIQHAACLEAAwhQcAAIwQADCGBwAAjRAAIIcHAADwDQAwiAcAAPANADCJBwAA8A0AMIoHAADwDQAwiwcAAI8QADCMBwAA8w0AMA4XAAD9DQAgGAAA_g0AIBkAAJ8OACC-BQEAAAABxgVAAAAAAccFQAAAAAHqBQEAAAAB9AUBAAAAAfYFAAAAjAYC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-wUBAAAAAYwGAQAAAAECAAAATQAgXwAAkhAAIAMAAABNACBfAACSEAAgYAAAkRAAIAFYAADKGAAwAgAAAE0AIFgAAJEQACACAAAA9A0AIFgAAJAQACALvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL4LACH0BQEAvgsAIfYFAAD2DYwGIvcFAQC-CwAh-AVAANULACH5BUAAvwsAIfsFAQC-CwAhjAYBAL0LACEOFwAA-Q0AIBgAAPoNACAZAACeDgAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL4LACH0BQEAvgsAIfYFAAD2DYwGIvcFAQC-CwAh-AVAANULACH5BUAAvwsAIfsFAQC-CwAhjAYBAL0LACEOFwAA_Q0AIBgAAP4NACAZAACfDgAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAfQFAQAAAAH2BQAAAIwGAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfsFAQAAAAGMBgEAAAABAYcHAQAAAAQEXwAAihAAMIQHAACLEAAwhgcAAI0QACCKBwAA8A0AMAAAAAAChwcBAAAABI0HAQAAAAULXwAAmxAAMGAAAJ8QADCEBwAAnBAAMIUHAACdEAAwhgcAAJ4QACCHBwAA-wsAMIgHAAD7CwAwiQcAAPsLADCKBwAA-wsAMIsHAACgEAAwjAcAAP4LADASBwAAjAwAIAkAAI0MACAQAAC4DQAgGAAAiwwAIDMAAIoMACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAdMFAQAAAAHoBQEAAAAB9AUBAAAAAfYFAAAA9gUC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-wUBAAAAAQIAAACjAQAgXwAAoxAAIAMAAACjAQAgXwAAoxAAIGAAAKIQACABWAAAyRgAMAIAAACjAQAgWAAAohAAIAIAAAD_CwAgWAAAoRAAIA2-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh0wUBAL0LACHoBQEAvgsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-wUBAL4LACESBwAAhgwAIAkAAIcMACAQAAC3DQAgGAAAhQwAIDMAAIQMACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh0wUBAL0LACHoBQEAvgsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-wUBAL4LACESBwAAjAwAIAkAAI0MACAQAAC4DQAgGAAAiwwAIDMAAIoMACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAdMFAQAAAAHoBQEAAAAB9AUBAAAAAfYFAAAA9gUC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-wUBAAAAAQGHBwEAAAAEBF8AAJsQADCEBwAAnBAAMIYHAACeEAAgigcAAPsLADAAAAAAAAAAAAAAAAVfAADEGAAgYAAAxxgAIIQHAADFGAAghQcAAMYYACCKBwAAuwcAIANfAADEGAAghAcAAMUYACCKBwAAuwcAIAAAAAVfAAC8GAAgYAAAwhgAIIQHAAC9GAAghQcAAMEYACCKBwAA4wEAIAVfAAC6GAAgYAAAvxgAIIQHAAC7GAAghQcAAL4YACCKBwAA4gIAIANfAAC8GAAghAcAAL0YACCKBwAA4wEAIANfAAC6GAAghAcAALsYACCKBwAA4gIAIAAAAAGHBwAAAL8GAgVfAAC1GAAgYAAAuBgAIIQHAAC2GAAghQcAALcYACCKBwAA4wEAIANfAAC1GAAghAcAALYYACCKBwAA4wEAIAAAAAVfAACrGAAgYAAAsxgAIIQHAACsGAAghQcAALIYACCKBwAA5QQAIAVfAACpGAAgYAAAsBgAIIQHAACqGAAghQcAAK8YACCKBwAA4gIAIAtfAADTEAAwYAAA2BAAMIQHAADUEAAwhQcAANUQADCGBwAA1hAAIIcHAADXEAAwiAcAANcQADCJBwAA1xAAMIoHAADXEAAwiwcAANkQADCMBwAA2hAAMAtfAADHEAAwYAAAzBAAMIQHAADIEAAwhQcAAMkQADCGBwAAyhAAIIcHAADLEAAwiAcAAMsQADCJBwAAyxAAMIoHAADLEAAwiwcAAM0QADCMBwAAzhAAMAQDAAC5EAAgvgUBAAAAAcUFAQAAAAG9BkAAAAABAgAAAOsBACBfAADSEAAgAwAAAOsBACBfAADSEAAgYAAA0RAAIAFYAACuGAAwCgMAAOAJACBAAADnCgAguwUAAOYKADC8BQAA6QEAEL0FAADmCgAwvgUBAAAAAcUFAQDbCQAhvAYBANsJACG9BkAA3wkAIfoGAADlCgAgAgAAAOsBACBYAADREAAgAgAAAM8QACBYAADQEAAgB7sFAADOEAAwvAUAAM8QABC9BQAAzhAAML4FAQDbCQAhxQUBANsJACG8BgEA2wkAIb0GQADfCQAhB7sFAADOEAAwvAUAAM8QABC9BQAAzhAAML4FAQDbCQAhxQUBANsJACG8BgEA2wkAIb0GQADfCQAhA74FAQC9CwAhxQUBAL0LACG9BkAAvwsAIQQDAAC3EAAgvgUBAL0LACHFBQEAvQsAIb0GQAC_CwAhBAMAALkQACC-BQEAAAABxQUBAAAAAb0GQAAAAAEDvgUBAAAAAcYFQAAAAAG_BgAAAL8GAgIAAADnAQAgXwAA3hAAIAMAAADnAQAgXwAA3hAAIGAAAN0QACABWAAArRgAMAlAAADnCgAguwUAAOkKADC8BQAA5QEAEL0FAADpCgAwvgUBAAAAAcYFQADfCQAhvAYBANsJACG_BgAA6gq_BiL7BgAA6AoAIAIAAADnAQAgWAAA3RAAIAIAAADbEAAgWAAA3BAAIAe7BQAA2hAAMLwFAADbEAAQvQUAANoQADC-BQEA2wkAIcYFQADfCQAhvAYBANsJACG_BgAA6gq_BiIHuwUAANoQADC8BQAA2xAAEL0FAADaEAAwvgUBANsJACHGBUAA3wkAIbwGAQDbCQAhvwYAAOoKvwYiA74FAQC9CwAhxgVAAL8LACG_BgAAvRC_BiIDvgUBAL0LACHGBUAAvwsAIb8GAAC9EL8GIgO-BQEAAAABxgVAAAAAAb8GAAAAvwYCA18AAKsYACCEBwAArBgAIIoHAADlBAAgA18AAKkYACCEBwAAqhgAIIoHAADiAgAgBF8AANMQADCEBwAA1BAAMIYHAADWEAAgigcAANcQADAEXwAAxxAAMIQHAADIEAAwhgcAAMoQACCKBwAAyxAAMAAAAAAAAAGHBwAAANAGAwGHBwAAANMGAgVfAACeGAAgYAAApxgAIIQHAACfGAAghQcAAKYYACCKBwAA4gIAIAdfAACcGAAgYAAApBgAIIQHAACdGAAghQcAAKMYACCIBwAAUQAgiQcAAFEAIIoHAADiAgAgB18AAJoYACBgAAChGAAghAcAAJsYACCFBwAAoBgAIIgHAAAWACCJBwAAFgAgigcAAOUEACADXwAAnhgAIIQHAACfGAAgigcAAOICACADXwAAnBgAIIQHAACdGAAgigcAAOICACADXwAAmhgAIIQHAACbGAAgigcAAOUEACAAAAALXwAAhxMAMGAAAIwTADCEBwAAiBMAMIUHAACJEwAwhgcAAIoTACCHBwAAixMAMIgHAACLEwAwiQcAAIsTADCKBwAAixMAMIsHAACNEwAwjAcAAI4TADALXwAA-xIAMGAAAIATADCEBwAA_BIAMIUHAAD9EgAwhgcAAP4SACCHBwAA_xIAMIgHAAD_EgAwiQcAAP8SADCKBwAA_xIAMIsHAACBEwAwjAcAAIITADALXwAA4hIAMGAAAOcSADCEBwAA4xIAMIUHAADkEgAwhgcAAOUSACCHBwAA5hIAMIgHAADmEgAwiQcAAOYSADCKBwAA5hIAMIsHAADoEgAwjAcAAOkSADALXwAAyhIAMGAAAM8SADCEBwAAyxIAMIUHAADMEgAwhgcAAM0SACCHBwAAzhIAMIgHAADOEgAwiQcAAM4SADCKBwAAzhIAMIsHAADQEgAwjAcAANESADALXwAAwRIAMGAAAMUSADCEBwAAwhIAMIUHAADDEgAwhgcAAMQSACCHBwAA4g4AMIgHAADiDgAwiQcAAOIOADCKBwAA4g4AMIsHAADGEgAwjAcAAOUOADALXwAAthIAMGAAALoSADCEBwAAtxIAMIUHAAC4EgAwhgcAALkSACCHBwAA3w8AMIgHAADfDwAwiQcAAN8PADCKBwAA3w8AMIsHAAC7EgAwjAcAAOIPADALXwAApxIAMGAAAKwSADCEBwAAqBIAMIUHAACpEgAwhgcAAKoSACCHBwAAqxIAMIgHAACrEgAwiQcAAKsSADCKBwAAqxIAMIsHAACtEgAwjAcAAK4SADALXwAAmxIAMGAAAKASADCEBwAAnBIAMIUHAACdEgAwhgcAAJ4SACCHBwAAnxIAMIgHAACfEgAwiQcAAJ8SADCKBwAAnxIAMIsHAAChEgAwjAcAAKISADALXwAAjxIAMGAAAJQSADCEBwAAkBIAMIUHAACREgAwhgcAAJISACCHBwAAkxIAMIgHAACTEgAwiQcAAJMSADCKBwAAkxIAMIsHAACVEgAwjAcAAJYSADALXwAAhhIAMGAAAIoSADCEBwAAhxIAMIUHAACIEgAwhgcAAIkSACCHBwAAzQwAMIgHAADNDAAwiQcAAM0MADCKBwAAzQwAMIsHAACLEgAwjAcAANAMADALXwAA_REAMGAAAIESADCEBwAA_hEAMIUHAAD_EQAwhgcAAIASACCHBwAAuQwAMIgHAAC5DAAwiQcAALkMADCKBwAAuQwAMIsHAACCEgAwjAcAALwMADALXwAA8REAMGAAAPYRADCEBwAA8hEAMIUHAADzEQAwhgcAAPQRACCHBwAA9REAMIgHAAD1EQAwiQcAAPURADCKBwAA9REAMIsHAAD3EQAwjAcAAPgRADALXwAA6BEAMGAAAOwRADCEBwAA6REAMIUHAADqEQAwhgcAAOsRACCHBwAA-wsAMIgHAAD7CwAwiQcAAPsLADCKBwAA-wsAMIsHAADtEQAwjAcAAP4LADALXwAA3xEAMGAAAOMRADCEBwAA4BEAMIUHAADhEQAwhgcAAOIRACCHBwAAkgwAMIgHAACSDAAwiQcAAJIMADCKBwAAkgwAMIsHAADkEQAwjAcAAJUMADALXwAA1hEAMGAAANoRADCEBwAA1xEAMIUHAADYEQAwhgcAANkRACCHBwAAogwAMIgHAACiDAAwiQcAAKIMADCKBwAAogwAMIsHAADbEQAwjAcAAKUMADALXwAAzREAMGAAANERADCEBwAAzhEAMIUHAADPEQAwhgcAANARACCHBwAA6AsAMIgHAADoCwAwiQcAAOgLADCKBwAA6AsAMIsHAADSEQAwjAcAAOsLADALXwAAxBEAMGAAAMgRADCEBwAAxREAMIUHAADGEQAwhgcAAMcRACCHBwAAvg4AMIgHAAC-DgAwiQcAAL4OADCKBwAAvg4AMIsHAADJEQAwjAcAAMEOADALXwAAuxEAMGAAAL8RADCEBwAAvBEAMIUHAAC9EQAwhgcAAL4RACCHBwAA2A0AMIgHAADYDQAwiQcAANgNADCKBwAA2A0AMIsHAADAEQAwjAcAANsNADALXwAAshEAMGAAALYRADCEBwAAsxEAMIUHAAC0EQAwhgcAALURACCHBwAAlg8AMIgHAACWDwAwiQcAAJYPADCKBwAAlg8AMIsHAAC3EQAwjAcAAJkPADALXwAAqREAMGAAAK0RADCEBwAAqhEAMIUHAACrEQAwhgcAAKwRACCHBwAA9gwAMIgHAAD2DAAwiQcAAPYMADCKBwAA9gwAMIsHAACuEQAwjAcAAPkMADALXwAAnREAMGAAAKIRADCEBwAAnhEAMIUHAACfEQAwhgcAAKARACCHBwAAoREAMIgHAAChEQAwiQcAAKERADCKBwAAoREAMIsHAACjEQAwjAcAAKQRADALXwAAlBEAMGAAAJgRADCEBwAAlREAMIUHAACWEQAwhgcAAJcRACCHBwAAzQsAMIgHAADNCwAwiQcAAM0LADCKBwAAzQsAMIsHAACZEQAwjAcAANALADALXwAAixEAMGAAAI8RADCEBwAAjBEAMIUHAACNEQAwhgcAAI4RACCHBwAAzQsAMIgHAADNCwAwiQcAAM0LADCKBwAAzQsAMIsHAACQEQAwjAcAANALADAVEAAA0w0AIBgAAOELACAZAADiCwAgHgAA3gsAICAAAOALACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLFBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAECAAAAXQAgXwAAkxEAIAMAAABdACBfAACTEQAgYAAAkhEAIAFYAACZGAAwAgAAAF0AIFgAAJIRACACAAAA0QsAIFgAAJERACAPvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAh-wUBAL4LACHDBgAA0wvDBiLFBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0Q0AIBgAANoLACAZAADbCwAgHgAA1wsAICAAANkLACAhAADcCwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAh-wUBAL4LACHDBgAA0wvDBiLFBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0w0AIBgAAOELACAZAADiCwAgHgAA3gsAICAAAOALACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLFBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAEVEAAA0w0AIBgAAOELACAZAADiCwAgHwAA3wsAICAAAOALACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAECAAAAXQAgXwAAnBEAIAMAAABdACBfAACcEQAgYAAAmxEAIAFYAACYGAAwAgAAAF0AIFgAAJsRACACAAAA0QsAIFgAAJoRACAPvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAh-wUBAL4LACHDBgAA0wvDBiLGBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0Q0AIBgAANoLACAZAADbCwAgHwAA2AsAICAAANkLACAhAADcCwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAh-wUBAL4LACHDBgAA0wvDBiLGBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0w0AIBgAAOELACAZAADiCwAgHwAA3wsAICAAAOALACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAEKPwAA4BAAIEEAAOEQACBCAADiEAAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAfAFAQAAAAHABgEAAAABwQYAAAC_BgICAAAA4wEAIF8AAKgRACADAAAA4wEAIF8AAKgRACBgAACnEQAgAVgAAJcYADAPBwAA7AoAID8AAOAJACBBAADtCgAgQgAA2woAILsFAADrCgAwvAUAAOEBABC9BQAA6woAML4FAQAAAAHDBQEA2wkAIcYFQADfCQAhxwVAAN8JACHvBQEA2wkAIfAFAQDbCQAhwAYBANsJACHBBgAA6gq_BiICAAAA4wEAIFgAAKcRACACAAAApREAIFgAAKYRACALuwUAAKQRADC8BQAApREAEL0FAACkEQAwvgUBANsJACHDBQEA2wkAIcYFQADfCQAhxwVAAN8JACHvBQEA2wkAIfAFAQDbCQAhwAYBANsJACHBBgAA6gq_BiILuwUAAKQRADC8BQAApREAEL0FAACkEQAwvgUBANsJACHDBQEA2wkAIcYFQADfCQAhxwVAAN8JACHvBQEA2wkAIfAFAQDbCQAhwAYBANsJACHBBgAA6gq_BiIHvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACHwBQEAvQsAIcAGAQC9CwAhwQYAAL0QvwYiCj8AAMQQACBBAADFEAAgQgAAxhAAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAh8AUBAL0LACHABgEAvQsAIcEGAAC9EL8GIgo_AADgEAAgQQAA4RAAIEIAAOIQACC-BQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAAB8AUBAAAAAcAGAQAAAAHBBgAAAL8GAg4JAACFDQAgKAAAgg0AICkAAKsPACArAACDDQAgvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfwFAQAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAQIAAAAsACBfAACxEQAgAwAAACwAIF8AALERACBgAACwEQAgAVgAAJYYADACAAAALAAgWAAAsBEAIAIAAAD6DAAgWAAArxEAIAq-BQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIfwFAQC9CwAhjgYBAL0LACGUBgEAvgsAIZsGAQC-CwAhnAYBAL0LACGdBgEAvQsAIQ4JAACADQAgKAAA_QwAICkAAKkPACArAAD-DAAgvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH8BQEAvQsAIY4GAQC9CwAhlAYBAL4LACGbBgEAvgsAIZwGAQC9CwAhnQYBAL0LACEOCQAAhQ0AICgAAIINACApAACrDwAgKwAAgw0AIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAH8BQEAAAABjgYBAAAAAZQGAQAAAAGbBgEAAAABnAYBAAAAAZ0GAQAAAAENCQAArw8AIAsAAK0PACAbAADFDwAgvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAAmwYCjgYBAAAAAZQGAQAAAAGWBgEAAAABmAYBAAAAAZkGAQAAAAECAAAAMwAgXwAAuhEAIAMAAAAzACBfAAC6EQAgYAAAuREAIAFYAACVGAAwAgAAADMAIFgAALkRACACAAAAmg8AIFgAALgRACAKvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH2BQAAnA-bBiKOBgEAvQsAIZQGAQC-CwAhlgYBAL4LACGYBgEAvQsAIZkGAQC9CwAhDQkAAKAPACALAACeDwAgGwAAxA8AIL4FAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh9gUAAJwPmwYijgYBAL0LACGUBgEAvgsAIZYGAQC-CwAhmAYBAL0LACGZBgEAvQsAIQ0JAACvDwAgCwAArQ8AIBsAAMUPACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAACbBgKOBgEAAAABlAYBAAAAAZYGAQAAAAGYBgEAAAABmQYBAAAAARoJAADpDQAgGQAAuQ4AIBsAAOoNACAdAADrDQAgvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAKwGApYGAQAAAAGoBgEAAAABqgYAAACqBgKsBgIAAAABrQYQAAAAAa4GAQAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BgEAAAABtgaAAAAAAbcGQAAAAAG4BkAAAAABAgAAAFcAIF8AAMMRACADAAAAVwAgXwAAwxEAIGAAAMIRACABWAAAlBgAMAIAAABXACBYAADCEQAgAgAAANwNACBYAADBEQAgFr4FAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL0LACH2BQAA3w2sBiKWBgEAvQsAIagGAQC9CwAhqgYAAN4NqgYirAYCAOANACGtBhAA4Q0AIa4GAQC9CwAhrwYBAL0LACGwBgEAvQsAIbEGAQC-CwAhsgYBAL4LACGzBgEAvgsAIbQGAQC-CwAhtQYBAL4LACG2BoAAAAABtwZAAL8LACG4BkAA1QsAIRoJAADkDQAgGQAAtw4AIBsAAOUNACAdAADmDQAgvgUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHqBQEAvQsAIfYFAADfDawGIpYGAQC9CwAhqAYBAL0LACGqBgAA3g2qBiKsBgIA4A0AIa0GEADhDQAhrgYBAL0LACGvBgEAvQsAIbAGAQC9CwAhsQYBAL4LACGyBgEAvgsAIbMGAQC-CwAhtAYBAL4LACG1BgEAvgsAIbYGgAAAAAG3BkAAvwsAIbgGQADVCwAhGgkAAOkNACAZAAC5DgAgGwAA6g0AIB0AAOsNACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAfYFAAAArAYClgYBAAAAAagGAQAAAAGqBgAAAKoGAqwGAgAAAAGtBhAAAAABrgYBAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BoAAAAABtwZAAAAAAbgGQAAAAAEMCQAA0w4AIBsAALIQACAcAADUDgAgvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAZYGAQAAAAGuBgEAAAABuQYQAAAAAboGEAAAAAG7BiAAAAABAgAAAHYAIF8AAMwRACADAAAAdgAgXwAAzBEAIGAAAMsRACABWAAAkxgAMAIAAAB2ACBYAADLEQAgAgAAAMIOACBYAADKEQAgCb4FAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAhlgYBAL0LACGuBgEAvQsAIbkGEADhDQAhugYQAOENACG7BiAAnw0AIQwJAADGDgAgGwAAsRAAIBwAAMcOACC-BQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZYGAQC9CwAhrgYBAL0LACG5BhAA4Q0AIboGEADhDQAhuwYgAJ8NACEMCQAA0w4AIBsAALIQACAcAADUDgAgvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAZYGAQAAAAGuBgEAAAABuQYQAAAAAboGEAAAAAG7BiAAAAABFgkAAPYLACAQAADkDAAgKQAA9AsAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB_AUBAAAAAf0FCAAAAAH-BQgAAAAB_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCAAAAAGEBggAAAABhQYIAAAAAYYGCAAAAAGHBggAAAABiAYIAAAAAYkGCAAAAAECAAAArQEAIF8AANURACADAAAArQEAIF8AANURACBgAADUEQAgAVgAAJIYADACAAAArQEAIFgAANQRACACAAAA7AsAIFgAANMRACATvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHoBQEAvQsAIfwFAQC9CwAh_QUIAO4LACH-BQgA7gsAIf8FCADuCwAhgAYIAO4LACGBBggA7gsAIYIGCADuCwAhgwYIAO4LACGEBggA7gsAIYUGCADuCwAhhgYIAO4LACGHBggA7gsAIYgGCADuCwAhiQYIAO4LACEWCQAA8gsAIBAAAOMMACApAADwCwAgvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHoBQEAvQsAIfwFAQC9CwAh_QUIAO4LACH-BQgA7gsAIf8FCADuCwAhgAYIAO4LACGBBggA7gsAIYIGCADuCwAhgwYIAO4LACGEBggA7gsAIYUGCADuCwAhhgYIAO4LACGHBggA7gsAIYgGCADuCwAhiQYIAO4LACEWCQAA9gsAIBAAAOQMACApAAD0CwAgvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAH8BQEAAAAB_QUIAAAAAf4FCAAAAAH_BQgAAAABgAYIAAAAAYEGCAAAAAGCBggAAAABgwYIAAAAAYQGCAAAAAGFBggAAAABhgYIAAAAAYcGCAAAAAGIBggAAAABiQYIAAAAAQ0JAACvDAAgEgAArg0AIBkAAK0MACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6QUBAAAAAeoFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBUAAAAABAgAAAEYAIF8AAN4RACADAAAARgAgXwAA3hEAIGAAAN0RACABWAAAkRgAMAIAAABGACBYAADdEQAgAgAAAKYMACBYAADcEQAgCr4FAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh6QUBAL0LACHqBQEAvQsAIesFAQC-CwAh7AUBAL4LACHtBQEAvgsAIe4FQAC_CwAhDQkAAKsMACASAACtDQAgGQAAqQwAIL4FAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh6QUBAL0LACHqBQEAvQsAIesFAQC-CwAh7AUBAL4LACHtBQEAvgsAIe4FQAC_CwAhDQkAAK8MACASAACuDQAgGQAArQwAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHpBQEAAAAB6gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FQAAAAAEOCQAAswwAIA4AALEMACAQAACzDQAgIwAAtAwAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB6AUBAAAAAe8FAQAAAAHwBQEAAAAB8gUAAADyBQLzBUAAAAABAgAAAEEAIF8AAOcRACADAAAAQQAgXwAA5xEAIGAAAOYRACABWAAAkBgAMAIAAABBACBYAADmEQAgAgAAAJYMACBYAADlEQAgCr4FAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHoBQEAvQsAIe8FAQC9CwAh8AUBAL4LACHyBQAAmAzyBSLzBUAA1QsAIQ4JAACcDAAgDgAAmgwAIBAAALINACAjAACdDAAgvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIegFAQC9CwAh7wUBAL0LACHwBQEAvgsAIfIFAACYDPIFIvMFQADVCwAhDgkAALMMACAOAACxDAAgEAAAsw0AICMAALQMACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAegFAQAAAAHvBQEAAAAB8AUBAAAAAfIFAAAA8gUC8wVAAAAAARIJAACNDAAgEAAAuA0AIBYAAIkMACAYAACLDAAgMwAAigwAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHTBQEAAAAB6AUBAAAAAfQFAQAAAAH2BQAAAPYFAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABAgAAAKMBACBfAADwEQAgAwAAAKMBACBfAADwEQAgYAAA7xEAIAFYAACPGAAwAgAAAKMBACBYAADvEQAgAgAAAP8LACBYAADuEQAgDb4FAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh0wUBAL0LACHoBQEAvgsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIRIJAACHDAAgEAAAtw0AIBYAAIMMACAYAACFDAAgMwAAhAwAIL4FAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh0wUBAL0LACHoBQEAvgsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIRIJAACNDAAgEAAAuA0AIBYAAIkMACAYAACLDAAgMwAAigwAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHTBQEAAAAB6AUBAAAAAfQFAQAAAAH2BQAAAPYFAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABDzwAAO4QACA9AADvEAAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAADTBgL4BUAAAAABlAYBAAAAAcwGAQAAAAHNBgEAAAABzgYBAAAAAdAGAAAA0AYD0QYBAAAAAdMGAQAAAAHUBgEAAAABAgAAANUBACBfAAD8EQAgAwAAANUBACBfAAD8EQAgYAAA-xEAIAFYAACOGAAwFAcAAPIKACA8AADgCQAgPQAA8QoAILsFAADuCgAwvAUAANMBABC9BQAA7goAML4FAQAAAAHDBQEA3AkAIcYFQADfCQAhxwVAAN8JACH2BQAA7wrTBiL4BUAA8AoAIZQGAQDcCQAhzAYBANsJACHNBgEA2wkAIc4GAQDcCQAh0AYAALUK0AYj0QYBANwJACHTBgEA3AkAIdQGAQDcCQAhAgAAANUBACBYAAD7EQAgAgAAAPkRACBYAAD6EQAgEbsFAAD4EQAwvAUAAPkRABC9BQAA-BEAML4FAQDbCQAhwwUBANwJACHGBUAA3wkAIccFQADfCQAh9gUAAO8K0wYi-AVAAPAKACGUBgEA3AkAIcwGAQDbCQAhzQYBANsJACHOBgEA3AkAIdAGAAC1CtAGI9EGAQDcCQAh0wYBANwJACHUBgEA3AkAIRG7BQAA-BEAMLwFAAD5EQAQvQUAAPgRADC-BQEA2wkAIcMFAQDcCQAhxgVAAN8JACHHBUAA3wkAIfYFAADvCtMGIvgFQADwCgAhlAYBANwJACHMBgEA2wkAIc0GAQDbCQAhzgYBANwJACHQBgAAtQrQBiPRBgEA3AkAIdMGAQDcCQAh1AYBANwJACENvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh9gUAAOoQ0wYi-AVAANULACGUBgEAvgsAIcwGAQC9CwAhzQYBAL0LACHOBgEAvgsAIdAGAADpENAGI9EGAQC-CwAh0wYBAL4LACHUBgEAvgsAIQ88AADrEAAgPQAA7BAAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfYFAADqENMGIvgFQADVCwAhlAYBAL4LACHMBgEAvQsAIc0GAQC9CwAhzgYBAL4LACHQBgAA6RDQBiPRBgEAvgsAIdMGAQC-CwAh1AYBAL4LACEPPAAA7hAAID0AAO8QACC-BQEAAAABxgVAAAAAAccFQAAAAAH2BQAAANMGAvgFQAAAAAGUBgEAAAABzAYBAAAAAc0GAQAAAAHOBgEAAAAB0AYAAADQBgPRBgEAAAAB0wYBAAAAAdQGAQAAAAELCQAAyAwAIA4AAMUMACAPAADGDAAgEAAAqQ0AIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAECAAAAPAAgXwAAhRIAIAMAAAA8ACBfAACFEgAgYAAAhBIAIAFYAACNGAAwAgAAADwAIFgAAIQSACACAAAAvQwAIFgAAIMSACAHvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6AUBAL0LACELCQAAwwwAIA4AAMAMACAPAADBDAAgEAAAqA0AIL4FAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHnBQEAvQsAIegFAQC9CwAhCwkAAMgMACAOAADFDAAgDwAAxgwAIBAAAKkNACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAABFQkAAI0NACAKAACODQAgCwAAhw0AIA4AAIwNACAPAACKDQAgEAAAkg4AIBkAAIsNACAbAACPDQAgLAAAiA0AIC0AAIkNACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6gUBAAAAAZYGAQAAAAGmBgEAAAAB1gZAAAAAAQIAAAAoACBfAACOEgAgAwAAACgAIF8AAI4SACBgAACNEgAgAVgAAIwYADACAAAAKAAgWAAAjRIAIAIAAADRDAAgWAAAjBIAIAu-BQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIeoFAQC9CwAhlgYBAL0LACGmBgEAvgsAIdYGQAC_CwAhFQkAANoMACAKAADbDAAgCwAA1AwAIA4AANkMACAPAADXDAAgEAAAkA4AIBkAANgMACAbAADcDAAgLAAA1QwAIC0AANYMACC-BQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIeoFAQC9CwAhlgYBAL0LACGmBgEAvgsAIdYGQAC_CwAhFQkAAI0NACAKAACODQAgCwAAhw0AIA4AAIwNACAPAACKDQAgEAAAkg4AIBkAAIsNACAbAACPDQAgLAAAiA0AIC0AAIkNACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6gUBAAAAAZYGAQAAAAGmBgEAAAAB1gZAAAAAAQ4DAACVDgAgCQAAlA4AIA0AAJYOACATAACXDgAgGgAAmA4AIBwAAJkOACAiAACaDgAgvgUBAAAAAcIFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABigYBAAAAAQIAAACdAQAgXwAAmhIAIAMAAACdAQAgXwAAmhIAIGAAAJkSACABWAAAixgAMBMDAADgCQAgBwAA7AoAIAkAAPoKACANAAD9CQAgEwAAwQoAIBoAAIsKACAcAAD_CQAgIgAAxQoAILsFAACACwAwvAUAAFMAEL0FAACACwAwvgUBAAAAAcIFAQDcCQAhwwUBANsJACHEBQEA3AkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIYoGAQAAAAECAAAAnQEAIFgAAJkSACACAAAAlxIAIFgAAJgSACALuwUAAJYSADC8BQAAlxIAEL0FAACWEgAwvgUBANsJACHCBQEA3AkAIcMFAQDbCQAhxAUBANwJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACGKBgEA2wkAIQu7BQAAlhIAMLwFAACXEgAQvQUAAJYSADC-BQEA2wkAIcIFAQDcCQAhwwUBANsJACHEBQEA3AkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIYoGAQDbCQAhB74FAQC9CwAhwgUBAL4LACHEBQEAvgsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIYoGAQC9CwAhDgMAAMMNACAJAADCDQAgDQAAxA0AIBMAAMUNACAaAADGDQAgHAAAxw0AICIAAMgNACC-BQEAvQsAIcIFAQC-CwAhxAUBAL4LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGKBgEAvQsAIQ4DAACVDgAgCQAAlA4AIA0AAJYOACATAACXDgAgGgAAmA4AIBwAAJkOACAiAACaDgAgvgUBAAAAAcIFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABigYBAAAAAREDAACZDQAgCQAAmA0AIA0AAJINACARAACTDQAgIgAAlw0AICQAAJQNACBGAACVDQAgRwAAlg0AIL4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAQIAAAAQACBfAACmEgAgAwAAABAAIF8AAKYSACBgAAClEgAgAVgAAIoYADAWAwAA4AkAIAcAAOwKACAJAACICwAgDQAA_QkAIBEAAL4KACAiAADFCgAgJAAAwAoAIEYAAI4KACBHAADCCgAguwUAALQLADC8BQAADgAQvQUAALQLADC-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEA2wkAIcIFAQDcCQAhwwUBANsJACHEBQEA2wkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIQIAAAAQACBYAAClEgAgAgAAAKMSACBYAACkEgAgDbsFAACiEgAwvAUAAKMSABC9BQAAohIAML4FAQDbCQAhvwUBANsJACHABQEA2wkAIcEFAQDbCQAhwgUBANwJACHDBQEA2wkAIcQFAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAhDbsFAACiEgAwvAUAAKMSABC9BQAAohIAML4FAQDbCQAhvwUBANsJACHABQEA2wkAIcEFAQDbCQAhwgUBANwJACHDBQEA2wkAIcQFAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAhCb4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHEBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIREDAADICwAgCQAAxwsAIA0AAMELACARAADCCwAgIgAAxgsAICQAAMMLACBGAADECwAgRwAAxQsAIL4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHEBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIREDAACZDQAgCQAAmA0AIA0AAJINACARAACTDQAgIgAAlw0AICQAAJQNACBGAACVDQAgRwAAlg0AIL4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAQYDAAC1EgAgvgUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAb8GAAAA-gYCAgAAAAEAIF8AALQSACADAAAAAQAgXwAAtBIAIGAAALISACABWAAAiRgAMAsDAADgCQAgBwAA7AoAILsFAAC1CwAwvAUAAAsAEL0FAAC1CwAwvgUBAAAAAcMFAQDbCQAhxQUBAAAAAcYFQADfCQAhxwVAAN8JACG_BgAAtgv6BiICAAAAAQAgWAAAshIAIAIAAACvEgAgWAAAsBIAIAm7BQAArhIAMLwFAACvEgAQvQUAAK4SADC-BQEA2wkAIcMFAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAhvwYAALYL-gYiCbsFAACuEgAwvAUAAK8SABC9BQAArhIAML4FAQDbCQAhwwUBANsJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACG_BgAAtgv6BiIFvgUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACG_BgAAsRL6BiIBhwcAAAD6BgIGAwAAsxIAIL4FAQC9CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhvwYAALES-gYiBV8AAIQYACBgAACHGAAghAcAAIUYACCFBwAAhhgAIIoHAADiAgAgBgMAALUSACC-BQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABvwYAAAD6BgIDXwAAhBgAIIQHAACFGAAgigcAAOICACANCQAA_g8AIAoAAMASACANAAD_DwAgEQAAgBAAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABoAYCAAAAAaYGAQAAAAHXBgEAAAAB2AYBAAAAAQIAAAAjACBfAAC_EgAgAwAAACMAIF8AAL8SACBgAAC9EgAgAVgAAIMYADACAAAAIwAgWAAAvRIAIAIAAADjDwAgWAAAvBIAIAm-BQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhoAYCAOgOACGmBgEAvgsAIdcGAQC9CwAh2AYBAL0LACENCQAA5w8AIAoAAL4SACANAADoDwAgEQAA6Q8AIL4FAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGgBgIA6A4AIaYGAQC-CwAh1wYBAL0LACHYBgEAvQsAIQdfAAD-FwAgYAAAgRgAIIQHAAD_FwAghQcAAIAYACCIBwAAHQAgiQcAAB0AIIoHAAAfACANCQAA_g8AIAoAAMASACANAAD_DwAgEQAAgBAAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABoAYCAAAAAaYGAQAAAAHXBgEAAAAB2AYBAAAAAQNfAAD-FwAghAcAAP8XACCKBwAAHwAgDwkAAJAPACANAACMDwAgEQAAjQ8AIBsAAMAPACAkAACODwAgJgAAkQ8AIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZUGAgAAAAGWBgEAAAABlwYBAAAAAQIAAAA3ACBfAADJEgAgAwAAADcAIF8AAMkSACBgAADIEgAgAVgAAP0XADACAAAANwAgWAAAyBIAIAIAAADmDgAgWAAAxxIAIAm-BQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhlAYBAL4LACGVBgIA6A4AIZYGAQC9CwAhlwYBAL4LACEPCQAA7g4AIA0AAOoOACARAADrDgAgGwAAvw8AICQAAOwOACAmAADvDgAgvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIZQGAQC-CwAhlQYCAOgOACGWBgEAvQsAIZcGAQC-CwAhDwkAAJAPACANAACMDwAgEQAAjQ8AIBsAAMAPACAkAACODwAgJgAAkQ8AIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZUGAgAAAAGWBgEAAAABlwYBAAAAAQkqAADhEgAgvgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAdkGAQAAAAHaBgEAAAAB2wYCAAAAAd0GAAAA3QYCAgAAAMoBACBfAADgEgAgAwAAAMoBACBfAADgEgAgYAAA1RIAIAFYAAD8FwAwDgcAAOwKACAqAADDCgAguwUAAPMKADC8BQAAyAEAEL0FAADzCgAwvgUBAAAAAcMFAQDbCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDcCQAh2QYBANsJACHaBgEA2wkAIdsGAgD0CgAh3QYAAPUK3QYiAgAAAMoBACBYAADVEgAgAgAAANISACBYAADTEgAgDLsFAADREgAwvAUAANISABC9BQAA0RIAML4FAQDbCQAhwwUBANsJACHGBUAA3wkAIccFQADfCQAhjgYBANwJACHZBgEA2wkAIdoGAQDbCQAh2wYCAPQKACHdBgAA9QrdBiIMuwUAANESADC8BQAA0hIAEL0FAADREgAwvgUBANsJACHDBQEA2wkAIcYFQADfCQAhxwVAAN8JACGOBgEA3AkAIdkGAQDbCQAh2gYBANsJACHbBgIA9AoAId0GAAD1Ct0GIgi-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvgsAIdkGAQC9CwAh2gYBAL0LACHbBgIA4A0AId0GAADUEt0GIgGHBwAAAN0GAgkqAADWEgAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhjgYBAL4LACHZBgEAvQsAIdoGAQC9CwAh2wYCAOANACHdBgAA1BLdBiILXwAA1xIAMGAAANsSADCEBwAA2BIAMIUHAADZEgAwhgcAANoSACCHBwAA9gwAMIgHAAD2DAAwiQcAAPYMADCKBwAA9gwAMIsHAADcEgAwjAcAAPkMADAOBwAAhA0AIAkAAIUNACAoAACCDQAgKQAAqw8AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB_AUBAAAAAY4GAQAAAAGUBgEAAAABmwYBAAAAAZwGAQAAAAECAAAALAAgXwAA3xIAIAMAAAAsACBfAADfEgAgYAAA3hIAIAFYAAD7FwAwAgAAACwAIFgAAN4SACACAAAA-gwAIFgAAN0SACAKvgUBAL0LACHDBQEAvgsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIfwFAQC9CwAhjgYBAL0LACGUBgEAvgsAIZsGAQC-CwAhnAYBAL0LACEOBwAA_wwAIAkAAIANACAoAAD9DAAgKQAAqQ8AIL4FAQC9CwAhwwUBAL4LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH8BQEAvQsAIY4GAQC9CwAhlAYBAL4LACGbBgEAvgsAIZwGAQC9CwAhDgcAAIQNACAJAACFDQAgKAAAgg0AICkAAKsPACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfwFAQAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGcBgEAAAABCSoAAOESACC-BQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAAB2QYBAAAAAdoGAQAAAAHbBgIAAAAB3QYAAADdBgIEXwAA1xIAMIQHAADYEgAwhgcAANoSACCKBwAA9gwAMAgJAAD5EgAgJQAA-hIAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAQIAAACXAQAgXwAA-BIAIAMAAACXAQAgXwAA-BIAIGAAAOwSACABWAAA-hcAMA0HAADsCgAgCQAA-goAICUAAPwJACC7BQAAgQsAMLwFAABrABC9BQAAgQsAML4FAQAAAAHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACECAAAAlwEAIFgAAOwSACACAAAA6hIAIFgAAOsSACAKuwUAAOkSADC8BQAA6hIAEL0FAADpEgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACEKuwUAAOkSADC8BQAA6hIAEL0FAADpEgAwvgUBANsJACHDBQEA2wkAIcQFAQDcCQAhxgVAAN8JACHHBUAA3wkAIY4GAQDbCQAhlAYBANwJACEGvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIZQGAQC-CwAhCAkAAO0SACAlAADuEgAgvgUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIZQGAQC-CwAhB18AAPQXACBgAAD4FwAghAcAAPUXACCFBwAA9xcAIIgHAAAYACCJBwAAGAAgigcAABoAIAtfAADvEgAwYAAA8xIAMIQHAADwEgAwhQcAAPESADCGBwAA8hIAIIcHAADiDgAwiAcAAOIOADCJBwAA4g4AMIoHAADiDgAwiwcAAPQSADCMBwAA5Q4AMA8HAACPDwAgCQAAkA8AIA0AAIwPACARAACNDwAgGwAAwA8AICQAAI4PACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAGUBgEAAAABlQYCAAAAAZYGAQAAAAECAAAANwAgXwAA9xIAIAMAAAA3ACBfAAD3EgAgYAAA9hIAIAFYAAD2FwAwAgAAADcAIFgAAPYSACACAAAA5g4AIFgAAPUSACAJvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhlAYBAL4LACGVBgIA6A4AIZYGAQC9CwAhDwcAAO0OACAJAADuDgAgDQAA6g4AIBEAAOsOACAbAAC_DwAgJAAA7A4AIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIZQGAQC-CwAhlQYCAOgOACGWBgEAvQsAIQ8HAACPDwAgCQAAkA8AIA0AAIwPACARAACNDwAgGwAAwA8AICQAAI4PACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAGUBgEAAAABlQYCAAAAAZYGAQAAAAEICQAA-RIAICUAAPoSACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAZQGAQAAAAEDXwAA9BcAIIQHAAD1FwAgigcAABoAIARfAADvEgAwhAcAAPASADCGBwAA8hIAIIoHAADiDgAwDQkAAIQQACANAACCEAAgDwAAgRAAIL4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAABlAYBAAAAAZ4GAQAAAAGfBkAAAAABoAYIAAAAAaEGCAAAAAECAAAAHwAgXwAAhhMAIAMAAAAfACBfAACGEwAgYAAAhRMAIAFYAADzFwAwEgcAAOwKACAJAACICwAgDQAA_QkAIA8AALoKACC7BQAArwsAMLwFAAAdABC9BQAArwsAML4FAQAAAAHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhlAYBANwJACGeBgEA3AkAIZ8GQADwCgAhoAYIAPcKACGhBggA9woAIQIAAAAfACBYAACFEwAgAgAAAIMTACBYAACEEwAgDrsFAACCEwAwvAUAAIMTABC9BQAAghMAML4FAQDbCQAhwwUBANsJACHEBQEA2wkAIcYFQADfCQAhxwVAAN8JACHvBQEA2wkAIZQGAQDcCQAhngYBANwJACGfBkAA8AoAIaAGCAD3CgAhoQYIAPcKACEOuwUAAIITADC8BQAAgxMAEL0FAACCEwAwvgUBANsJACHDBQEA2wkAIcQFAQDbCQAhxgVAAN8JACHHBUAA3wkAIe8FAQDbCQAhlAYBANwJACGeBgEA3AkAIZ8GQADwCgAhoAYIAPcKACGhBggA9woAIQq-BQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAhlAYBAL4LACGeBgEAvgsAIZ8GQADVCwAhoAYIAO4LACGhBggA7gsAIQ0JAADRDwAgDQAAzw8AIA8AAM4PACC-BQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAhlAYBAL4LACGeBgEAvgsAIZ8GQADVCwAhoAYIAO4LACGhBggA7gsAIQ0JAACEEAAgDQAAghAAIA8AAIEQACC-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAZQGAQAAAAGeBgEAAAABnwZAAAAAAaAGCAAAAAGhBggAAAABBzkAAN0UACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABzgYBAAAAAdUGAQAAAAECAAAAFAAgXwAA3BQAIAMAAAAUACBfAADcFAAgYAAAkRMAIAFYAADyFwAwDAcAAPIKACA5AACzCwAguwUAALILADC8BQAAEgAQvQUAALILADC-BQEAAAABwwUBANwJACHGBUAA3wkAIccFQADfCQAhlAYBANwJACHOBgEA3AkAIdUGAQDbCQAhAgAAABQAIFgAAJETACACAAAAjxMAIFgAAJATACAKuwUAAI4TADC8BQAAjxMAEL0FAACOEwAwvgUBANsJACHDBQEA3AkAIcYFQADfCQAhxwVAAN8JACGUBgEA3AkAIc4GAQDcCQAh1QYBANsJACEKuwUAAI4TADC8BQAAjxMAEL0FAACOEwAwvgUBANsJACHDBQEA3AkAIcYFQADfCQAhxwVAAN8JACGUBgEA3AkAIc4GAQDcCQAh1QYBANsJACEGvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACHOBgEAvgsAIdUGAQC9CwAhBzkAAJITACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIc4GAQC-CwAh1QYBAL0LACELXwAAkxMAMGAAAJgTADCEBwAAlBMAMIUHAACVEwAwhgcAAJYTACCHBwAAlxMAMIgHAACXEwAwiQcAAJcTADCKBwAAlxMAMIsHAACZEwAwjAcAAJoTADAXDAAA2RQAIA0AANEUACARAADSFAAgHAAA2BQAICUAAM4UACAnAADXFAAgKgAA2hQAIC4AAMsUACAvAADMFAAgMAAAzRQAIDEAAM8UACAyAADQFAAgNAAA0xQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABzgYBAAAAAdUGAQAAAAECAAAAGgAgXwAAyhQAIAMAAAAaACBfAADKFAAgYAAAnRMAIAFYAADxFwAwHAgAALELACAMAAD7CQAgDQAA_QkAIBEAAL4KACAcAAD_CQAgJQAA_AkAICcAAP4JACAqAADDCgAgLgAAtwoAIC8AALgKACAwAAC6CgAgMQAAvAoAIDIAAL0KACA0AACOCgAgNQAAwAoAIDYAAMEKACA3AADCCgAgOAAAxQoAILsFAACwCwAwvAUAABgAEL0FAACwCwAwvgUBAAAAAcYFQADfCQAhxwVAAN8JACGUBgEA3AkAIaUGAQDcCQAhzgYBANwJACHVBgEA2wkAIQIAAAAaACBYAACdEwAgAgAAAJsTACBYAACcEwAgCrsFAACaEwAwvAUAAJsTABC9BQAAmhMAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIZQGAQDcCQAhpQYBANwJACHOBgEA3AkAIdUGAQDbCQAhCrsFAACaEwAwvAUAAJsTABC9BQAAmhMAML4FAQDbCQAhxgVAAN8JACHHBUAA3wkAIZQGAQDcCQAhpQYBANwJACHOBgEA3AkAIdUGAQDbCQAhBr4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhzgYBAL4LACHVBgEAvQsAIRcMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQtfAADBFAAwYAAAxRQAMIQHAADCFAAwhQcAAMMUADCGBwAAxBQAIIcHAAD_EgAwiAcAAP8SADCJBwAA_xIAMIoHAAD_EgAwiwcAAMYUADCMBwAAghMAMAtfAAC2FAAwYAAAuhQAMIQHAAC3FAAwhQcAALgUADCGBwAAuRQAIIcHAADmEgAwiAcAAOYSADCJBwAA5hIAMIoHAADmEgAwiwcAALsUADCMBwAA6RIAMAtfAACtFAAwYAAAsRQAMIQHAACuFAAwhQcAAK8UADCGBwAAsBQAIIcHAADfDwAwiAcAAN8PADCJBwAA3w8AMIoHAADfDwAwiwcAALIUADCMBwAA4g8AMAtfAACkFAAwYAAAqBQAMIQHAAClFAAwhQcAAKYUADCGBwAApxQAIIcHAADiDgAwiAcAAOIOADCJBwAA4g4AMIoHAADiDgAwiwcAAKkUADCMBwAA5Q4AMAtfAACbFAAwYAAAnxQAMIQHAACcFAAwhQcAAJ0UADCGBwAAnhQAIIcHAACfEgAwiAcAAJ8SADCJBwAAnxIAMIoHAACfEgAwiwcAAKAUADCMBwAAohIAMAtfAACSFAAwYAAAlhQAMIQHAACTFAAwhQcAAJQUADCGBwAAlRQAIIcHAACTEgAwiAcAAJMSADCJBwAAkxIAMIoHAACTEgAwiwcAAJcUADCMBwAAlhIAMAtfAACJFAAwYAAAjRQAMIQHAACKFAAwhQcAAIsUADCGBwAAjBQAIIcHAADNDAAwiAcAAM0MADCJBwAAzQwAMIoHAADNDAAwiwcAAI4UADCMBwAA0AwAMAtfAACAFAAwYAAAhBQAMIQHAACBFAAwhQcAAIIUADCGBwAAgxQAIIcHAAC5DAAwiAcAALkMADCJBwAAuQwAMIoHAAC5DAAwiwcAAIUUADCMBwAAvAwAMAtfAAD3EwAwYAAA-xMAMIQHAAD4EwAwhQcAAPkTADCGBwAA-hMAIIcHAAD7CwAwiAcAAPsLADCJBwAA-wsAMIoHAAD7CwAwiwcAAPwTADCMBwAA_gsAMAtfAADuEwAwYAAA8hMAMIQHAADvEwAwhQcAAPATADCGBwAA8RMAIIcHAACSDAAwiAcAAJIMADCJBwAAkgwAMIoHAACSDAAwiwcAAPMTADCMBwAAlQwAMAtfAADlEwAwYAAA6RMAMIQHAADmEwAwhQcAAOcTADCGBwAA6BMAIIcHAACiDAAwiAcAAKIMADCJBwAAogwAMIoHAACiDAAwiwcAAOoTADCMBwAApQwAMAtfAADcEwAwYAAA4BMAMIQHAADdEwAwhQcAAN4TADCGBwAA3xMAIIcHAADoCwAwiAcAAOgLADCJBwAA6AsAMIoHAADoCwAwiwcAAOETADCMBwAA6wsAMAtfAADTEwAwYAAA1xMAMIQHAADUEwAwhQcAANUTADCGBwAA1hMAIIcHAAC-DgAwiAcAAL4OADCJBwAAvg4AMIoHAAC-DgAwiwcAANgTADCMBwAAwQ4AMAtfAADKEwAwYAAAzhMAMIQHAADLEwAwhQcAAMwTADCGBwAAzRMAIIcHAADYDQAwiAcAANgNADCJBwAA2A0AMIoHAADYDQAwiwcAAM8TADCMBwAA2w0AMAtfAADBEwAwYAAAxRMAMIQHAADCEwAwhQcAAMMTADCGBwAAxBMAIIcHAACWDwAwiAcAAJYPADCJBwAAlg8AMIoHAACWDwAwiwcAAMYTADCMBwAAmQ8AMAtfAAC4EwAwYAAAvBMAMIQHAAC5EwAwhQcAALoTADCGBwAAuxMAIIcHAAD2DAAwiAcAAPYMADCJBwAA9gwAMIoHAAD2DAAwiwcAAL0TADCMBwAA-QwAMAtfAACvEwAwYAAAsxMAMIQHAACwEwAwhQcAALETADCGBwAAshMAIIcHAADNCwAwiAcAAM0LADCJBwAAzQsAMIoHAADNCwAwiwcAALQTADCMBwAA0AsAMBUQAADTDQAgGAAA4QsAIBkAAOILACAeAADeCwAgHwAA3wsAICAAAOALACC-BQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB6gUBAAAAAfYFAAAAxQYC-AVAAAAAAfsFAQAAAAHDBgAAAMMGAsUGAQAAAAHGBgEAAAABxwYBAAAAAckGAQAAAAHKBgEAAAABywZAAAAAAQIAAABdACBfAAC3EwAgAwAAAF0AIF8AALcTACBgAAC2EwAgAVgAAPAXADACAAAAXQAgWAAAthMAIAIAAADRCwAgWAAAtRMAIA--BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHoBQEAvgsAIeoFAQC-CwAh9gUAANQLxQYi-AVAANULACH7BQEAvgsAIcMGAADTC8MGIsUGAQC9CwAhxgYBAL0LACHHBgEAvQsAIckGAQC-CwAhygYBAL4LACHLBkAAvwsAIRUQAADRDQAgGAAA2gsAIBkAANsLACAeAADXCwAgHwAA2AsAICAAANkLACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHoBQEAvgsAIeoFAQC-CwAh9gUAANQLxQYi-AVAANULACH7BQEAvgsAIcMGAADTC8MGIsUGAQC9CwAhxgYBAL0LACHHBgEAvQsAIckGAQC-CwAhygYBAL4LACHLBkAAvwsAIRUQAADTDQAgGAAA4QsAIBkAAOILACAeAADeCwAgHwAA3wsAICAAAOALACC-BQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB6gUBAAAAAfYFAAAAxQYC-AVAAAAAAfsFAQAAAAHDBgAAAMMGAsUGAQAAAAHGBgEAAAABxwYBAAAAAckGAQAAAAHKBgEAAAABywZAAAAAAQ4HAACEDQAgKAAAgg0AICkAAKsPACArAACDDQAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAfwFAQAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAQIAAAAsACBfAADAEwAgAwAAACwAIF8AAMATACBgAAC_EwAgAVgAAO8XADACAAAALAAgWAAAvxMAIAIAAAD6DAAgWAAAvhMAIAq-BQEAvQsAIcMFAQC-CwAhxgVAAL8LACHHBUAAvwsAIfwFAQC9CwAhjgYBAL0LACGUBgEAvgsAIZsGAQC-CwAhnAYBAL0LACGdBgEAvQsAIQ4HAAD_DAAgKAAA_QwAICkAAKkPACArAAD-DAAgvgUBAL0LACHDBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH8BQEAvQsAIY4GAQC9CwAhlAYBAL4LACGbBgEAvgsAIZwGAQC9CwAhnQYBAL0LACEOBwAAhA0AICgAAIINACApAACrDwAgKwAAgw0AIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAH8BQEAAAABjgYBAAAAAZQGAQAAAAGbBgEAAAABnAYBAAAAAZ0GAQAAAAENBwAArg8AIAsAAK0PACAbAADFDwAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAAmwYCjgYBAAAAAZQGAQAAAAGWBgEAAAABmAYBAAAAAZkGAQAAAAECAAAAMwAgXwAAyRMAIAMAAAAzACBfAADJEwAgYAAAyBMAIAFYAADuFwAwAgAAADMAIFgAAMgTACACAAAAmg8AIFgAAMcTACAKvgUBAL0LACHDBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH2BQAAnA-bBiKOBgEAvQsAIZQGAQC-CwAhlgYBAL4LACGYBgEAvQsAIZkGAQC9CwAhDQcAAJ8PACALAACeDwAgGwAAxA8AIL4FAQC9CwAhwwUBAL4LACHGBUAAvwsAIccFQAC_CwAh9gUAAJwPmwYijgYBAL0LACGUBgEAvgsAIZYGAQC-CwAhmAYBAL0LACGZBgEAvQsAIQ0HAACuDwAgCwAArQ8AIBsAAMUPACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAACbBgKOBgEAAAABlAYBAAAAAZYGAQAAAAGYBgEAAAABmQYBAAAAARoHAADoDQAgGQAAuQ4AIBsAAOoNACAdAADrDQAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAKwGApYGAQAAAAGoBgEAAAABqgYAAACqBgKsBgIAAAABrQYQAAAAAa4GAQAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BgEAAAABtgaAAAAAAbcGQAAAAAG4BkAAAAABAgAAAFcAIF8AANITACADAAAAVwAgXwAA0hMAIGAAANETACABWAAA7RcAMAIAAABXACBYAADREwAgAgAAANwNACBYAADQEwAgFr4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL0LACH2BQAA3w2sBiKWBgEAvQsAIagGAQC9CwAhqgYAAN4NqgYirAYCAOANACGtBhAA4Q0AIa4GAQC9CwAhrwYBAL0LACGwBgEAvQsAIbEGAQC-CwAhsgYBAL4LACGzBgEAvgsAIbQGAQC-CwAhtQYBAL4LACG2BoAAAAABtwZAAL8LACG4BkAA1QsAIRoHAADjDQAgGQAAtw4AIBsAAOUNACAdAADmDQAgvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHqBQEAvQsAIfYFAADfDawGIpYGAQC9CwAhqAYBAL0LACGqBgAA3g2qBiKsBgIA4A0AIa0GEADhDQAhrgYBAL0LACGvBgEAvQsAIbAGAQC9CwAhsQYBAL4LACGyBgEAvgsAIbMGAQC-CwAhtAYBAL4LACG1BgEAvgsAIbYGgAAAAAG3BkAAvwsAIbgGQADVCwAhGgcAAOgNACAZAAC5DgAgGwAA6g0AIB0AAOsNACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAfYFAAAArAYClgYBAAAAAagGAQAAAAGqBgAAAKoGAqwGAgAAAAGtBhAAAAABrgYBAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BoAAAAABtwZAAAAAAbgGQAAAAAEMBwAA0g4AIBsAALIQACAcAADUDgAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAZYGAQAAAAGuBgEAAAABuQYQAAAAAboGEAAAAAG7BiAAAAABAgAAAHYAIF8AANsTACADAAAAdgAgXwAA2xMAIGAAANoTACABWAAA7BcAMAIAAAB2ACBYAADaEwAgAgAAAMIOACBYAADZEwAgCb4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAhlgYBAL0LACGuBgEAvQsAIbkGEADhDQAhugYQAOENACG7BiAAnw0AIQwHAADFDgAgGwAAsRAAIBwAAMcOACC-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZYGAQC9CwAhrgYBAL0LACG5BhAA4Q0AIboGEADhDQAhuwYgAJ8NACEMBwAA0g4AIBsAALIQACAcAADUDgAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAZYGAQAAAAGuBgEAAAABuQYQAAAAAboGEAAAAAG7BiAAAAABFgcAAPULACAQAADkDAAgKQAA9AsAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB_AUBAAAAAf0FCAAAAAH-BQgAAAAB_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCAAAAAGEBggAAAABhQYIAAAAAYYGCAAAAAGHBggAAAABiAYIAAAAAYkGCAAAAAECAAAArQEAIF8AAOQTACADAAAArQEAIF8AAOQTACBgAADjEwAgAVgAAOsXADACAAAArQEAIFgAAOMTACACAAAA7AsAIFgAAOITACATvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHoBQEAvQsAIfwFAQC9CwAh_QUIAO4LACH-BQgA7gsAIf8FCADuCwAhgAYIAO4LACGBBggA7gsAIYIGCADuCwAhgwYIAO4LACGEBggA7gsAIYUGCADuCwAhhgYIAO4LACGHBggA7gsAIYgGCADuCwAhiQYIAO4LACEWBwAA8QsAIBAAAOMMACApAADwCwAgvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHoBQEAvQsAIfwFAQC9CwAh_QUIAO4LACH-BQgA7gsAIf8FCADuCwAhgAYIAO4LACGBBggA7gsAIYIGCADuCwAhgwYIAO4LACGEBggA7gsAIYUGCADuCwAhhgYIAO4LACGHBggA7gsAIYgGCADuCwAhiQYIAO4LACEWBwAA9QsAIBAAAOQMACApAAD0CwAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAH8BQEAAAAB_QUIAAAAAf4FCAAAAAH_BQgAAAABgAYIAAAAAYEGCAAAAAGCBggAAAABgwYIAAAAAYQGCAAAAAGFBggAAAABhgYIAAAAAYcGCAAAAAGIBggAAAABiQYIAAAAAQ0HAACuDAAgEgAArg0AIBkAAK0MACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB6QUBAAAAAeoFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBUAAAAABAgAAAEYAIF8AAO0TACADAAAARgAgXwAA7RMAIGAAAOwTACABWAAA6hcAMAIAAABGACBYAADsEwAgAgAAAKYMACBYAADrEwAgCr4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh6QUBAL0LACHqBQEAvQsAIesFAQC-CwAh7AUBAL4LACHtBQEAvgsAIe4FQAC_CwAhDQcAAKoMACASAACtDQAgGQAAqQwAIL4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh6QUBAL0LACHqBQEAvQsAIesFAQC-CwAh7AUBAL4LACHtBQEAvgsAIe4FQAC_CwAhDQcAAK4MACASAACuDQAgGQAArQwAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHpBQEAAAAB6gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FQAAAAAEOBwAAsgwAIA4AALEMACAQAACzDQAgIwAAtAwAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB6AUBAAAAAe8FAQAAAAHwBQEAAAAB8gUAAADyBQLzBUAAAAABAgAAAEEAIF8AAPYTACADAAAAQQAgXwAA9hMAIGAAAPUTACABWAAA6RcAMAIAAABBACBYAAD1EwAgAgAAAJYMACBYAAD0EwAgCr4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHoBQEAvQsAIe8FAQC9CwAh8AUBAL4LACHyBQAAmAzyBSLzBUAA1QsAIQ4HAACbDAAgDgAAmgwAIBAAALINACAjAACdDAAgvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIegFAQC9CwAh7wUBAL0LACHwBQEAvgsAIfIFAACYDPIFIvMFQADVCwAhDgcAALIMACAOAACxDAAgEAAAsw0AICMAALQMACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAegFAQAAAAHvBQEAAAAB8AUBAAAAAfIFAAAA8gUC8wVAAAAAARIHAACMDAAgEAAAuA0AIBYAAIkMACAYAACLDAAgMwAAigwAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHTBQEAAAAB6AUBAAAAAfQFAQAAAAH2BQAAAPYFAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABAgAAAKMBACBfAAD_EwAgAwAAAKMBACBfAAD_EwAgYAAA_hMAIAFYAADoFwAwAgAAAKMBACBYAAD-EwAgAgAAAP8LACBYAAD9EwAgDb4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh0wUBAL0LACHoBQEAvgsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIRIHAACGDAAgEAAAtw0AIBYAAIMMACAYAACFDAAgMwAAhAwAIL4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh0wUBAL0LACHoBQEAvgsAIfQFAQC-CwAh9gUAAIEM9gUi9wUBAL4LACH4BUAA1QsAIfkFQAC_CwAh-gUBAL0LACH7BQEAvgsAIRIHAACMDAAgEAAAuA0AIBYAAIkMACAYAACLDAAgMwAAigwAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHTBQEAAAAB6AUBAAAAAfQFAQAAAAH2BQAAAPYFAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABCwcAAMcMACAOAADFDAAgDwAAxgwAIBAAAKkNACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAABAgAAADwAIF8AAIgUACADAAAAPAAgXwAAiBQAIGAAAIcUACABWAAA5xcAMAIAAAA8ACBYAACHFAAgAgAAAL0MACBYAACGFAAgB74FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHnBQEAvQsAIegFAQC9CwAhCwcAAMIMACAOAADADAAgDwAAwQwAIBAAAKgNACC-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIQsHAADHDAAgDgAAxQwAIA8AAMYMACAQAACpDQAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAARUHAACQDQAgCgAAjg0AIAsAAIcNACAOAACMDQAgDwAAig0AIBAAAJIOACAZAACLDQAgGwAAjw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAECAAAAKAAgXwAAkRQAIAMAAAAoACBfAACRFAAgYAAAkBQAIAFYAADmFwAwAgAAACgAIFgAAJAUACACAAAA0QwAIFgAAI8UACALvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAhpgYBAL4LACHWBkAAvwsAIRUHAADdDAAgCgAA2wwAIAsAANQMACAOAADZDAAgDwAA1wwAIBAAAJAOACAZAADYDAAgGwAA3AwAICwAANUMACAtAADWDAAgvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAhpgYBAL4LACHWBkAAvwsAIRUHAACQDQAgCgAAjg0AIAsAAIcNACAOAACMDQAgDwAAig0AIBAAAJIOACAZAACLDQAgGwAAjw0AICwAAIgNACAtAACJDQAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAEOAwAAlQ4AIAcAAJMOACANAACWDgAgEwAAlw4AIBoAAJgOACAcAACZDgAgIgAAmg4AIL4FAQAAAAHCBQEAAAABwwUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAYoGAQAAAAECAAAAnQEAIF8AAJoUACADAAAAnQEAIF8AAJoUACBgAACZFAAgAVgAAOUXADACAAAAnQEAIFgAAJkUACACAAAAlxIAIFgAAJgUACAHvgUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhigYBAL0LACEOAwAAww0AIAcAAMENACANAADEDQAgEwAAxQ0AIBoAAMYNACAcAADHDQAgIgAAyA0AIL4FAQC9CwAhwgUBAL4LACHDBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIYoGAQC9CwAhDgMAAJUOACAHAACTDgAgDQAAlg4AIBMAAJcOACAaAACYDgAgHAAAmQ4AICIAAJoOACC-BQEAAAABwgUBAAAAAcMFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAGKBgEAAAABEQMAAJkNACAHAACRDQAgDQAAkg0AIBEAAJMNACAiAACXDQAgJAAAlA0AIEYAAJUNACBHAACWDQAgvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAAAAAcIFAQAAAAHDBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABAgAAABAAIF8AAKMUACADAAAAEAAgXwAAoxQAIGAAAKIUACABWAAA5BcAMAIAAAAQACBYAACiFAAgAgAAAKMSACBYAAChFAAgCb4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIREDAADICwAgBwAAwAsAIA0AAMELACARAADCCwAgIgAAxgsAICQAAMMLACBGAADECwAgRwAAxQsAIL4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIREDAACZDQAgBwAAkQ0AIA0AAJINACARAACTDQAgIgAAlw0AICQAAJQNACBGAACVDQAgRwAAlg0AIL4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABwwUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAQ8HAACPDwAgDQAAjA8AIBEAAI0PACAbAADADwAgJAAAjg8AICYAAJEPACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAZQGAQAAAAGVBgIAAAABlgYBAAAAAZcGAQAAAAECAAAANwAgXwAArBQAIAMAAAA3ACBfAACsFAAgYAAAqxQAIAFYAADjFwAwAgAAADcAIFgAAKsUACACAAAA5g4AIFgAAKoUACAJvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIZQGAQC-CwAhlQYCAOgOACGWBgEAvQsAIZcGAQC-CwAhDwcAAO0OACANAADqDgAgEQAA6w4AIBsAAL8PACAkAADsDgAgJgAA7w4AIL4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIZUGAgDoDgAhlgYBAL0LACGXBgEAvgsAIQ8HAACPDwAgDQAAjA8AIBEAAI0PACAbAADADwAgJAAAjg8AICYAAJEPACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAZQGAQAAAAGVBgIAAAABlgYBAAAAAZcGAQAAAAENBwAA_Q8AIAoAAMASACANAAD_DwAgEQAAgBAAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABoAYCAAAAAaYGAQAAAAHXBgEAAAAB2AYBAAAAAQIAAAAjACBfAAC1FAAgAwAAACMAIF8AALUUACBgAAC0FAAgAVgAAOIXADACAAAAIwAgWAAAtBQAIAIAAADjDwAgWAAAsxQAIAm-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhoAYCAOgOACGmBgEAvgsAIdcGAQC9CwAh2AYBAL0LACENBwAA5g8AIAoAAL4SACANAADoDwAgEQAA6Q8AIL4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGgBgIA6A4AIaYGAQC-CwAh1wYBAL0LACHYBgEAvQsAIQ0HAAD9DwAgCgAAwBIAIA0AAP8PACARAACAEAAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAGgBgIAAAABpgYBAAAAAdcGAQAAAAHYBgEAAAABCAcAAMAUACAlAAD6EgAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAGUBgEAAAABAgAAAJcBACBfAAC_FAAgAwAAAJcBACBfAAC_FAAgYAAAvRQAIAFYAADhFwAwAgAAAJcBACBYAAC9FAAgAgAAAOoSACBYAAC8FAAgBr4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIQgHAAC-FAAgJQAA7hIAIL4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIQVfAADcFwAgYAAA3xcAIIQHAADdFwAghQcAAN4XACCKBwAA5QQAIAgHAADAFAAgJQAA-hIAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAQNfAADcFwAghAcAAN0XACCKBwAA5QQAIA0HAACDEAAgDQAAghAAIA8AAIEQACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAZQGAQAAAAGeBgEAAAABnwZAAAAAAaAGCAAAAAGhBggAAAABAgAAAB8AIF8AAMkUACADAAAAHwAgXwAAyRQAIGAAAMgUACABWAAA2xcAMAIAAAAfACBYAADIFAAgAgAAAIMTACBYAADHFAAgCr4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACGUBgEAvgsAIZ4GAQC-CwAhnwZAANULACGgBggA7gsAIaEGCADuCwAhDQcAANAPACANAADPDwAgDwAAzg8AIL4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACGUBgEAvgsAIZ4GAQC-CwAhnwZAANULACGgBggA7gsAIaEGCADuCwAhDQcAAIMQACANAACCEAAgDwAAgRAAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAABlAYBAAAAAZ4GAQAAAAGfBkAAAAABoAYIAAAAAaEGCAAAAAEXDAAA2RQAIA0AANEUACARAADSFAAgHAAA2BQAICUAAM4UACAnAADXFAAgKgAA2hQAIC4AAMsUACAvAADMFAAgMAAAzRQAIDEAAM8UACAyAADQFAAgNAAA0xQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABzgYBAAAAAdUGAQAAAAEEXwAAwRQAMIQHAADCFAAwhgcAAMQUACCKBwAA_xIAMARfAAC2FAAwhAcAALcUADCGBwAAuRQAIIoHAADmEgAwBF8AAK0UADCEBwAArhQAMIYHAACwFAAgigcAAN8PADAEXwAApBQAMIQHAAClFAAwhgcAAKcUACCKBwAA4g4AMARfAACbFAAwhAcAAJwUADCGBwAAnhQAIIoHAACfEgAwBF8AAJIUADCEBwAAkxQAMIYHAACVFAAgigcAAJMSADAEXwAAiRQAMIQHAACKFAAwhgcAAIwUACCKBwAAzQwAMARfAACAFAAwhAcAAIEUADCGBwAAgxQAIIoHAAC5DAAwBF8AAPcTADCEBwAA-BMAMIYHAAD6EwAgigcAAPsLADAEXwAA7hMAMIQHAADvEwAwhgcAAPETACCKBwAAkgwAMARfAADlEwAwhAcAAOYTADCGBwAA6BMAIIoHAACiDAAwBF8AANwTADCEBwAA3RMAMIYHAADfEwAgigcAAOgLADAEXwAA0xMAMIQHAADUEwAwhgcAANYTACCKBwAAvg4AMARfAADKEwAwhAcAAMsTADCGBwAAzRMAIIoHAADYDQAwBF8AAMETADCEBwAAwhMAMIYHAADEEwAgigcAAJYPADAEXwAAuBMAMIQHAAC5EwAwhgcAALsTACCKBwAA9gwAMARfAACvEwAwhAcAALATADCGBwAAshMAIIoHAADNCwAwBzkAAN0UACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABzgYBAAAAAdUGAQAAAAEEXwAAkxMAMIQHAACUEwAwhgcAAJYTACCKBwAAlxMAMARfAACHEwAwhAcAAIgTADCGBwAAihMAIIoHAACLEwAwBF8AAPsSADCEBwAA_BIAMIYHAAD-EgAgigcAAP8SADAEXwAA4hIAMIQHAADjEgAwhgcAAOUSACCKBwAA5hIAMARfAADKEgAwhAcAAMsSADCGBwAAzRIAIIoHAADOEgAwBF8AAMESADCEBwAAwhIAMIYHAADEEgAgigcAAOIOADAEXwAAthIAMIQHAAC3EgAwhgcAALkSACCKBwAA3w8AMARfAACnEgAwhAcAAKgSADCGBwAAqhIAIIoHAACrEgAwBF8AAJsSADCEBwAAnBIAMIYHAACeEgAgigcAAJ8SADAEXwAAjxIAMIQHAACQEgAwhgcAAJISACCKBwAAkxIAMARfAACGEgAwhAcAAIcSADCGBwAAiRIAIIoHAADNDAAwBF8AAP0RADCEBwAA_hEAMIYHAACAEgAgigcAALkMADAEXwAA8REAMIQHAADyEQAwhgcAAPQRACCKBwAA9REAMARfAADoEQAwhAcAAOkRADCGBwAA6xEAIIoHAAD7CwAwBF8AAN8RADCEBwAA4BEAMIYHAADiEQAgigcAAJIMADAEXwAA1hEAMIQHAADXEQAwhgcAANkRACCKBwAAogwAMARfAADNEQAwhAcAAM4RADCGBwAA0BEAIIoHAADoCwAwBF8AAMQRADCEBwAAxREAMIYHAADHEQAgigcAAL4OADAEXwAAuxEAMIQHAAC8EQAwhgcAAL4RACCKBwAA2A0AMARfAACyEQAwhAcAALMRADCGBwAAtREAIIoHAACWDwAwBF8AAKkRADCEBwAAqhEAMIYHAACsEQAgigcAAPYMADAEXwAAnREAMIQHAACeEQAwhgcAAKARACCKBwAAoREAMARfAACUEQAwhAcAAJURADCGBwAAlxEAIIoHAADNCwAwBF8AAIsRADCEBwAAjBEAMIYHAACOEQAgigcAAM0LADAAAAAAAAAAAAAAAAAAAAAAAAAAB18AANYXACBgAADZFwAghAcAANcXACCFBwAA2BcAIIgHAAAWACCJBwAAFgAgigcAAOUEACADXwAA1hcAIIQHAADXFwAgigcAAOUEACAAAAAHXwAA0RcAIGAAANQXACCEBwAA0hcAIIUHAADTFwAgiAcAABIAIIkHAAASACCKBwAAFAAgA18AANEXACCEBwAA0hcAIIoHAAAUACAAAAAAAAAAAAAAAAAABV8AAMwXACBgAADPFwAghAcAAM0XACCFBwAAzhcAIIoHAADlBAAgA18AAMwXACCEBwAAzRcAIIoHAADlBAAgAAAAAAAABV8AAMcXACBgAADKFwAghAcAAMgXACCFBwAAyRcAIIoHAADiAgAgA18AAMcXACCEBwAAyBcAIIoHAADiAgAgAAAAAAAABV8AAMIXACBgAADFFwAghAcAAMMXACCFBwAAxBcAIIoHAADiAgAgA18AAMIXACCEBwAAwxcAIIoHAADiAgAgAAAABV8AAL0XACBgAADAFwAghAcAAL4XACCFBwAAvxcAIIoHAADiAgAgA18AAL0XACCEBwAAvhcAIIoHAADiAgAgAAAAC18AAOEWADBgAADmFgAwhAcAAOIWADCFBwAA4xYAMIYHAADkFgAghwcAAOUWADCIBwAA5RYAMIkHAADlFgAwigcAAOUWADCLBwAA5xYAMIwHAADoFgAwC18AANUWADBgAADaFgAwhAcAANYWADCFBwAA1xYAMIYHAADYFgAghwcAANkWADCIBwAA2RYAMIkHAADZFgAwigcAANkWADCLBwAA2xYAMIwHAADcFgAwC18AAMoWADBgAADOFgAwhAcAAMsWADCFBwAAzBYAMIYHAADNFgAghwcAAKsSADCIBwAAqxIAMIkHAACrEgAwigcAAKsSADCLBwAAzxYAMIwHAACuEgAwC18AAMEWADBgAADFFgAwhAcAAMIWADCFBwAAwxYAMIYHAADEFgAghwcAAJ8SADCIBwAAnxIAMIkHAACfEgAwigcAAJ8SADCLBwAAxhYAMIwHAACiEgAwC18AALgWADBgAAC8FgAwhAcAALkWADCFBwAAuhYAMIYHAAC7FgAghwcAAJMSADCIBwAAkxIAMIkHAACTEgAwigcAAJMSADCLBwAAvRYAMIwHAACWEgAwC18AAK8WADBgAACzFgAwhAcAALAWADCFBwAAsRYAMIYHAACyFgAghwcAAPURADCIBwAA9REAMIkHAAD1EQAwigcAAPURADCLBwAAtBYAMIwHAAD4EQAwC18AAKYWADBgAACqFgAwhAcAAKcWADCFBwAAqBYAMIYHAACpFgAghwcAAPURADCIBwAA9REAMIkHAAD1EQAwigcAAPURADCLBwAAqxYAMIwHAAD4EQAwC18AAJ0WADBgAAChFgAwhAcAAJ4WADCFBwAAnxYAMIYHAACgFgAghwcAAPsLADCIBwAA-wsAMIkHAAD7CwAwigcAAPsLADCLBwAAohYAMIwHAAD-CwAwC18AAJQWADBgAACYFgAwhAcAAJUWADCFBwAAlhYAMIYHAACXFgAghwcAAPsLADCIBwAA-wsAMIkHAAD7CwAwigcAAPsLADCLBwAAmRYAMIwHAAD-CwAwB18AAI8WACBgAACSFgAghAcAAJAWACCFBwAAkRYAIIgHAACZAgAgiQcAAJkCACCKBwAAmQkAIAtfAACGFgAwYAAAihYAMIQHAACHFgAwhQcAAIgWADCGBwAAiRYAIIcHAADwDQAwiAcAAPANADCJBwAA8A0AMIoHAADwDQAwiwcAAIsWADCMBwAA8w0AMAtfAAD9FQAwYAAAgRYAMIQHAAD-FQAwhQcAAP8VADCGBwAAgBYAIIcHAADwDQAwiAcAAPANADCJBwAA8A0AMIoHAADwDQAwiwcAAIIWADCMBwAA8w0AMAdfAAD4FQAgYAAA-xUAIIQHAAD5FQAghQcAAPoVACCIBwAAnQIAIIkHAACdAgAgigcAANMHACALXwAA7BUAMGAAAPEVADCEBwAA7RUAMIUHAADuFQAwhgcAAO8VACCHBwAA8BUAMIgHAADwFQAwiQcAAPAVADCKBwAA8BUAMIsHAADyFQAwjAcAAPMVADALXwAA4xUAMGAAAOcVADCEBwAA5BUAMIUHAADlFQAwhgcAAOYVACCHBwAAzQsAMIgHAADNCwAwiQcAAM0LADCKBwAAzQsAMIsHAADoFQAwjAcAANALADALXwAA2hUAMGAAAN4VADCEBwAA2xUAMIUHAADcFQAwhgcAAN0VACCHBwAAzQsAMIgHAADNCwAwiQcAAM0LADCKBwAAzQsAMIsHAADfFQAwjAcAANALADALXwAA0RUAMGAAANUVADCEBwAA0hUAMIUHAADTFQAwhgcAANQVACCHBwAAoREAMIgHAAChEQAwiQcAAKERADCKBwAAoREAMIsHAADWFQAwjAcAAKQRADALXwAAyBUAMGAAAMwVADCEBwAAyRUAMIUHAADKFQAwhgcAAMsVACCHBwAAyxAAMIgHAADLEAAwiQcAAMsQADCKBwAAyxAAMIsHAADNFQAwjAcAAM4QADAEQAAAuBAAIL4FAQAAAAG8BgEAAAABvQZAAAAAAQIAAADrAQAgXwAA0BUAIAMAAADrAQAgXwAA0BUAIGAAAM8VACABWAAAvBcAMAIAAADrAQAgWAAAzxUAIAIAAADPEAAgWAAAzhUAIAO-BQEAvQsAIbwGAQC9CwAhvQZAAL8LACEEQAAAthAAIL4FAQC9CwAhvAYBAL0LACG9BkAAvwsAIQRAAAC4EAAgvgUBAAAAAbwGAQAAAAG9BkAAAAABCgcAAN8QACBBAADhEAAgQgAA4hAAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAAB8AUBAAAAAcEGAAAAvwYCAgAAAOMBACBfAADZFQAgAwAAAOMBACBfAADZFQAgYAAA2BUAIAFYAAC7FwAwAgAAAOMBACBYAADYFQAgAgAAAKURACBYAADXFQAgB74FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACHwBQEAvQsAIcEGAAC9EL8GIgoHAADDEAAgQQAAxRAAIEIAAMYQACC-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAh8AUBAL0LACHBBgAAvRC_BiIKBwAA3xAAIEEAAOEQACBCAADiEAAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAe8FAQAAAAHwBQEAAAABwQYAAAC_BgIVEAAA0w0AIBkAAOILACAeAADeCwAgHwAA3wsAICAAAOALACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAHDBgAAAMMGAsUGAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAECAAAAXQAgXwAA4hUAIAMAAABdACBfAADiFQAgYAAA4RUAIAFYAAC6FwAwAgAAAF0AIFgAAOEVACACAAAA0QsAIFgAAOAVACAPvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAhwwYAANMLwwYixQYBAL0LACHGBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0Q0AIBkAANsLACAeAADXCwAgHwAA2AsAICAAANkLACAhAADcCwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAhwwYAANMLwwYixQYBAL0LACHGBgEAvQsAIccGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0w0AIBkAAOILACAeAADeCwAgHwAA3wsAICAAAOALACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAHDBgAAAMMGAsUGAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAEVEAAA0w0AIBgAAOELACAZAADiCwAgHgAA3gsAIB8AAN8LACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLFBgEAAAABxgYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAECAAAAXQAgXwAA6xUAIAMAAABdACBfAADrFQAgYAAA6hUAIAFYAAC5FwAwAgAAAF0AIFgAAOoVACACAAAA0QsAIFgAAOkVACAPvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAh-wUBAL4LACHDBgAA0wvDBiLFBgEAvQsAIcYGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0Q0AIBgAANoLACAZAADbCwAgHgAA1wsAIB8AANgLACAhAADcCwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6AUBAL4LACHqBQEAvgsAIfYFAADUC8UGIvgFQADVCwAh-wUBAL4LACHDBgAA0wvDBiLFBgEAvQsAIcYGAQC9CwAhyAYBAL4LACHJBgEAvgsAIcoGAQC-CwAhywZAAL8LACEVEAAA0w0AIBgAAOELACAZAADiCwAgHgAA3gsAIB8AAN8LACAhAADjCwAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAeoFAQAAAAH2BQAAAMUGAvgFQAAAAAH7BQEAAAABwwYAAADDBgLFBgEAAAABxgYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAEFvgUBAAAAAcYFQAAAAAHHBUAAAAAB3gYBAAAAAd8GQAAAAAECAAAAoQIAIF8AAPcVACADAAAAoQIAIF8AAPcVACBgAAD2FQAgAVgAALgXADAKAwAA4AkAILsFAADkCgAwvAUAAJ8CABC9BQAA5AoAML4FAQAAAAHFBQEAAAABxgVAAN8JACHHBUAA3wkAId4GAQDbCQAh3wZAAN8JACECAAAAoQIAIFgAAPYVACACAAAA9BUAIFgAAPUVACAJuwUAAPMVADC8BQAA9BUAEL0FAADzFQAwvgUBANsJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACHeBgEA2wkAId8GQADfCQAhCbsFAADzFQAwvAUAAPQVABC9BQAA8xUAML4FAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAh3gYBANsJACHfBkAA3wkAIQW-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHeBgEAvQsAId8GQAC_CwAhBb4FAQC9CwAhxgVAAL8LACHHBUAAvwsAId4GAQC9CwAh3wZAAL8LACEFvgUBAAAAAcYFQAAAAAHHBUAAAAAB3gYBAAAAAd8GQAAAAAEIvgUBAAAAAcYFQAAAAAHHBUAAAAAB1AUBAAAAAdUFAQAAAAHaBYAAAAAB3AUgAAAAAY0GAAClDgAgAgAAANMHACBfAAD4FQAgAwAAAJ0CACBfAAD4FQAgYAAA_BUAIAoAAACdAgAgWAAA_BUAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIdQFAQC9CwAh1QUBAL0LACHaBYAAAAAB3AUgAJ8NACGNBgAAow4AIAi-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHUBQEAvQsAIdUFAQC9CwAh2gWAAAAAAdwFIACfDQAhjQYAAKMOACAOFgAA_A0AIBcAAP0NACAZAACfDgAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAfQFAQAAAAH2BQAAAIwGAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAGMBgEAAAABAgAAAE0AIF8AAIUWACADAAAATQAgXwAAhRYAIGAAAIQWACABWAAAtxcAMAIAAABNACBYAACEFgAgAgAAAPQNACBYAACDFgAgC74FAQC9CwAhxgVAAL8LACHHBUAAvwsAIeoFAQC-CwAh9AUBAL4LACH2BQAA9g2MBiL3BQEAvgsAIfgFQADVCwAh-QVAAL8LACH6BQEAvQsAIYwGAQC9CwAhDhYAAPgNACAXAAD5DQAgGQAAng4AIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIeoFAQC-CwAh9AUBAL4LACH2BQAA9g2MBiL3BQEAvgsAIfgFQADVCwAh-QVAAL8LACH6BQEAvQsAIYwGAQC9CwAhDhYAAPwNACAXAAD9DQAgGQAAnw4AIL4FAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH0BQEAAAAB9gUAAACMBgL3BQEAAAAB-AVAAAAAAfkFQAAAAAH6BQEAAAABjAYBAAAAAQ4WAAD8DQAgGAAA_g0AIBkAAJ8OACC-BQEAAAABxgVAAAAAAccFQAAAAAHqBQEAAAAB9AUBAAAAAfYFAAAAjAYC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-gUBAAAAAfsFAQAAAAECAAAATQAgXwAAjhYAIAMAAABNACBfAACOFgAgYAAAjRYAIAFYAAC2FwAwAgAAAE0AIFgAAI0WACACAAAA9A0AIFgAAIwWACALvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL4LACH0BQEAvgsAIfYFAAD2DYwGIvcFAQC-CwAh-AVAANULACH5BUAAvwsAIfoFAQC9CwAh-wUBAL4LACEOFgAA-A0AIBgAAPoNACAZAACeDgAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh6gUBAL4LACH0BQEAvgsAIfYFAAD2DYwGIvcFAQC-CwAh-AVAANULACH5BUAAvwsAIfoFAQC9CwAh-wUBAL4LACEOFgAA_A0AIBgAAP4NACAZAACfDgAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAfQFAQAAAAH2BQAAAIwGAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABDL4FAQAAAAHGBUAAAAABxwVAAAAAAdQFAQAAAAHVBQEAAAAB1gUBAAAAAdcFAQAAAAHYBQAAoQ0AINkFAACiDQAg2gWAAAAAAdsFgAAAAAHcBSAAAAABAgAAAJkJACBfAACPFgAgAwAAAJkCACBfAACPFgAgYAAAkxYAIA4AAACZAgAgWAAAkxYAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIdQFAQC9CwAh1QUBAL0LACHWBQEAvQsAIdcFAQC-CwAh2AUAAJ0NACDZBQAAng0AINoFgAAAAAHbBYAAAAAB3AUgAJ8NACEMvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh1AUBAL0LACHVBQEAvQsAIdYFAQC9CwAh1wUBAL4LACHYBQAAnQ0AINkFAACeDQAg2gWAAAAAAdsFgAAAAAHcBSAAnw0AIRIHAACMDAAgCQAAjQwAIBAAALgNACAWAACJDAAgMwAAigwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB0wUBAAAAAegFAQAAAAH0BQEAAAAB9gUAAAD2BQL3BQEAAAAB-AVAAAAAAfkFQAAAAAH6BQEAAAABAgAAAKMBACBfAACcFgAgAwAAAKMBACBfAACcFgAgYAAAmxYAIAFYAAC1FwAwAgAAAKMBACBYAACbFgAgAgAAAP8LACBYAACaFgAgDb4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHTBQEAvQsAIegFAQC-CwAh9AUBAL4LACH2BQAAgQz2BSL3BQEAvgsAIfgFQADVCwAh-QVAAL8LACH6BQEAvQsAIRIHAACGDAAgCQAAhwwAIBAAALcNACAWAACDDAAgMwAAhAwAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHTBQEAvQsAIegFAQC-CwAh9AUBAL4LACH2BQAAgQz2BSL3BQEAvgsAIfgFQADVCwAh-QVAAL8LACH6BQEAvQsAIRIHAACMDAAgCQAAjQwAIBAAALgNACAWAACJDAAgMwAAigwAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB0wUBAAAAAegFAQAAAAH0BQEAAAAB9gUAAAD2BQL3BQEAAAAB-AVAAAAAAfkFQAAAAAH6BQEAAAABEgcAAIwMACAJAACNDAAgEAAAuA0AIBYAAIkMACAYAACLDAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB9AUBAAAAAfYFAAAA9gUC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-gUBAAAAAfsFAQAAAAECAAAAowEAIF8AAKUWACADAAAAowEAIF8AAKUWACBgAACkFgAgAVgAALQXADACAAAAowEAIFgAAKQWACACAAAA_wsAIFgAAKMWACANvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIegFAQC-CwAh9AUBAL4LACH2BQAAgQz2BSL3BQEAvgsAIfgFQADVCwAh-QVAAL8LACH6BQEAvQsAIfsFAQC-CwAhEgcAAIYMACAJAACHDAAgEAAAtw0AIBYAAIMMACAYAACFDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIegFAQC-CwAh9AUBAL4LACH2BQAAgQz2BSL3BQEAvgsAIfgFQADVCwAh-QVAAL8LACH6BQEAvQsAIfsFAQC-CwAhEgcAAIwMACAJAACNDAAgEAAAuA0AIBYAAIkMACAYAACLDAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB9AUBAAAAAfYFAAAA9gUC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-gUBAAAAAfsFAQAAAAEPBwAA8BAAIDwAAO4QACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAADTBgL4BUAAAAABlAYBAAAAAcwGAQAAAAHNBgEAAAABzgYBAAAAAdAGAAAA0AYD0QYBAAAAAdMGAQAAAAECAAAA1QEAIF8AAK4WACADAAAA1QEAIF8AAK4WACBgAACtFgAgAVgAALMXADACAAAA1QEAIFgAAK0WACACAAAA-REAIFgAAKwWACANvgUBAL0LACHDBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH2BQAA6hDTBiL4BUAA1QsAIZQGAQC-CwAhzAYBAL0LACHNBgEAvQsAIc4GAQC-CwAh0AYAAOkQ0AYj0QYBAL4LACHTBgEAvgsAIQ8HAADtEAAgPAAA6xAAIL4FAQC9CwAhwwUBAL4LACHGBUAAvwsAIccFQAC_CwAh9gUAAOoQ0wYi-AVAANULACGUBgEAvgsAIcwGAQC9CwAhzQYBAL0LACHOBgEAvgsAIdAGAADpENAGI9EGAQC-CwAh0wYBAL4LACEPBwAA8BAAIDwAAO4QACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAADTBgL4BUAAAAABlAYBAAAAAcwGAQAAAAHNBgEAAAABzgYBAAAAAdAGAAAA0AYD0QYBAAAAAdMGAQAAAAEPBwAA8BAAID0AAO8QACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAADTBgL4BUAAAAABlAYBAAAAAc0GAQAAAAHOBgEAAAAB0AYAAADQBgPRBgEAAAAB0wYBAAAAAdQGAQAAAAECAAAA1QEAIF8AALcWACADAAAA1QEAIF8AALcWACBgAAC2FgAgAVgAALIXADACAAAA1QEAIFgAALYWACACAAAA-REAIFgAALUWACANvgUBAL0LACHDBQEAvgsAIcYFQAC_CwAhxwVAAL8LACH2BQAA6hDTBiL4BUAA1QsAIZQGAQC-CwAhzQYBAL0LACHOBgEAvgsAIdAGAADpENAGI9EGAQC-CwAh0wYBAL4LACHUBgEAvgsAIQ8HAADtEAAgPQAA7BAAIL4FAQC9CwAhwwUBAL4LACHGBUAAvwsAIccFQAC_CwAh9gUAAOoQ0wYi-AVAANULACGUBgEAvgsAIc0GAQC9CwAhzgYBAL4LACHQBgAA6RDQBiPRBgEAvgsAIdMGAQC-CwAh1AYBAL4LACEPBwAA8BAAID0AAO8QACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAADTBgL4BUAAAAABlAYBAAAAAc0GAQAAAAHOBgEAAAAB0AYAAADQBgPRBgEAAAAB0wYBAAAAAdQGAQAAAAEOBwAAkw4AIAkAAJQOACANAACWDgAgEwAAlw4AIBoAAJgOACAcAACZDgAgIgAAmg4AIL4FAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAYoGAQAAAAECAAAAnQEAIF8AAMAWACADAAAAnQEAIF8AAMAWACBgAAC_FgAgAVgAALEXADACAAAAnQEAIFgAAL8WACACAAAAlxIAIFgAAL4WACAHvgUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhigYBAL0LACEOBwAAwQ0AIAkAAMINACANAADEDQAgEwAAxQ0AIBoAAMYNACAcAADHDQAgIgAAyA0AIL4FAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIYoGAQC9CwAhDgcAAJMOACAJAACUDgAgDQAAlg4AIBMAAJcOACAaAACYDgAgHAAAmQ4AICIAAJoOACC-BQEAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGKBgEAAAABEQcAAJENACAJAACYDQAgDQAAkg0AIBEAAJMNACAiAACXDQAgJAAAlA0AIEYAAJUNACBHAACWDQAgvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABAgAAABAAIF8AAMkWACADAAAAEAAgXwAAyRYAIGAAAMgWACABWAAAsBcAMAIAAAAQACBYAADIFgAgAgAAAKMSACBYAADHFgAgCb4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIREHAADACwAgCQAAxwsAIA0AAMELACARAADCCwAgIgAAxgsAICQAAMMLACBGAADECwAgRwAAxQsAIL4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIREHAACRDQAgCQAAmA0AIA0AAJINACARAACTDQAgIgAAlw0AICQAAJQNACBGAACVDQAgRwAAlg0AIL4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAQYHAADUFgAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAb8GAAAA-gYCAgAAAAEAIF8AANMWACADAAAAAQAgXwAA0xYAIGAAANEWACABWAAArxcAMAIAAAABACBYAADRFgAgAgAAAK8SACBYAADQFgAgBb4FAQC9CwAhwwUBAL0LACHGBUAAvwsAIccFQAC_CwAhvwYAALES-gYiBgcAANIWACC-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIb8GAACxEvoGIgVfAACqFwAgYAAArRcAIIQHAACrFwAghQcAAKwXACCKBwAA5QQAIAYHAADUFgAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAb8GAAAA-gYCA18AAKoXACCEBwAAqxcAIIoHAADlBAAgDL4FAQAAAAHGBUAAAAABxwVAAAAAAeIGAQAAAAHjBgEAAAAB5AYBAAAAAeUGAQAAAAHmBgEAAAAB5wZAAAAAAegGQAAAAAHpBgEAAAAB6gYBAAAAAQIAAAAJACBfAADgFgAgAwAAAAkAIF8AAOAWACBgAADfFgAgAVgAAKkXADARAwAA4AkAILsFAAC3CwAwvAUAAAcAEL0FAAC3CwAwvgUBAAAAAcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAIeIGAQDbCQAh4wYBANsJACHkBgEA3AkAIeUGAQDcCQAh5gYBANwJACHnBkAA8AoAIegGQADwCgAh6QYBANwJACHqBgEA3AkAIQIAAAAJACBYAADfFgAgAgAAAN0WACBYAADeFgAgELsFAADcFgAwvAUAAN0WABC9BQAA3BYAML4FAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAh4gYBANsJACHjBgEA2wkAIeQGAQDcCQAh5QYBANwJACHmBgEA3AkAIecGQADwCgAh6AZAAPAKACHpBgEA3AkAIeoGAQDcCQAhELsFAADcFgAwvAUAAN0WABC9BQAA3BYAML4FAQDbCQAhxQUBANsJACHGBUAA3wkAIccFQADfCQAh4gYBANsJACHjBgEA2wkAIeQGAQDcCQAh5QYBANwJACHmBgEA3AkAIecGQADwCgAh6AZAAPAKACHpBgEA3AkAIeoGAQDcCQAhDL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIeIGAQC9CwAh4wYBAL0LACHkBgEAvgsAIeUGAQC-CwAh5gYBAL4LACHnBkAA1QsAIegGQADVCwAh6QYBAL4LACHqBgEAvgsAIQy-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHiBgEAvQsAIeMGAQC9CwAh5AYBAL4LACHlBgEAvgsAIeYGAQC-CwAh5wZAANULACHoBkAA1QsAIekGAQC-CwAh6gYBAL4LACEMvgUBAAAAAcYFQAAAAAHHBUAAAAAB4gYBAAAAAeMGAQAAAAHkBgEAAAAB5QYBAAAAAeYGAQAAAAHnBkAAAAAB6AZAAAAAAekGAQAAAAHqBgEAAAABB74FAQAAAAHGBUAAAAABxwVAAAAAAd8GQAAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAECAAAABQAgXwAA7BYAIAMAAAAFACBfAADsFgAgYAAA6xYAIAFYAACoFwAwDAMAAOAJACC7BQAAuAsAMLwFAAADABC9BQAAuAsAML4FAQAAAAHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACHfBkAA3wkAIesGAQAAAAHsBgEA3AkAIe0GAQDcCQAhAgAAAAUAIFgAAOsWACACAAAA6RYAIFgAAOoWACALuwUAAOgWADC8BQAA6RYAEL0FAADoFgAwvgUBANsJACHFBQEA2wkAIcYFQADfCQAhxwVAAN8JACHfBkAA3wkAIesGAQDbCQAh7AYBANwJACHtBgEA3AkAIQu7BQAA6BYAMLwFAADpFgAQvQUAAOgWADC-BQEA2wkAIcUFAQDbCQAhxgVAAN8JACHHBUAA3wkAId8GQADfCQAh6wYBANsJACHsBgEA3AkAIe0GAQDcCQAhB74FAQC9CwAhxgVAAL8LACHHBUAAvwsAId8GQAC_CwAh6wYBAL0LACHsBgEAvgsAIe0GAQC-CwAhB74FAQC9CwAhxgVAAL8LACHHBUAAvwsAId8GQAC_CwAh6wYBAL0LACHsBgEAvgsAIe0GAQC-CwAhB74FAQAAAAHGBUAAAAABxwVAAAAAAd8GQAAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAEEXwAA4RYAMIQHAADiFgAwhgcAAOQWACCKBwAA5RYAMARfAADVFgAwhAcAANYWADCGBwAA2BYAIIoHAADZFgAwBF8AAMoWADCEBwAAyxYAMIYHAADNFgAgigcAAKsSADAEXwAAwRYAMIQHAADCFgAwhgcAAMQWACCKBwAAnxIAMARfAAC4FgAwhAcAALkWADCGBwAAuxYAIIoHAACTEgAwBF8AAK8WADCEBwAAsBYAMIYHAACyFgAgigcAAPURADAEXwAAphYAMIQHAACnFgAwhgcAAKkWACCKBwAA9REAMARfAACdFgAwhAcAAJ4WADCGBwAAoBYAIIoHAAD7CwAwBF8AAJQWADCEBwAAlRYAMIYHAACXFgAgigcAAPsLADADXwAAjxYAIIQHAACQFgAgigcAAJkJACAEXwAAhhYAMIQHAACHFgAwhgcAAIkWACCKBwAA8A0AMARfAAD9FQAwhAcAAP4VADCGBwAAgBYAIIoHAADwDQAwA18AAPgVACCEBwAA-RUAIIoHAADTBwAgBF8AAOwVADCEBwAA7RUAMIYHAADvFQAgigcAAPAVADAEXwAA4xUAMIQHAADkFQAwhgcAAOYVACCKBwAAzQsAMARfAADaFQAwhAcAANsVADCGBwAA3RUAIIoHAADNCwAwBF8AANEVADCEBwAA0hUAMIYHAADUFQAgigcAAKERADAEXwAAyBUAMIQHAADJFQAwhgcAAMsVACCKBwAAyxAAMAAAAjMAAKQNACDXBQAAuQsAIAEXAACkDQAgAAAAAAAFXwAAoxcAIGAAAKYXACCEBwAApBcAIIUHAAClFwAgigcAACgAIANfAACjFwAghAcAAKQXACCKBwAAKAAgAAAABAcAAI4XACA_AACkDQAgQQAAjxcAIEIAAIQXACAbBgAA-hQAIAwAALUPACANAAC3DwAgEQAA_RQAIBwAALkPACAlAAC2DwAgJwAAuA8AICoAAIIVACAuAAD2FAAgLwAA9xQAIDAAAPkUACAxAAD7FAAgMgAA_BQAIDQAAKYQACA1AAD_FAAgNgAAgBUAIDcAAIEVACA6AAD1FAAgOwAA-BQAID4AAP4UACBDAACDFQAgRAAAhBUAIEUAAIQVACDyBQAAuQsAIJQGAAC5CwAgzgYAALkLACDRBgAAuQsAIAANBwAAjhcAIAkAAJIXACAKAACgFwAgCwAAghUAIA4AAJkXACAPAACaFwAgEAAAkRcAIBkAAJUXACAbAACUFwAgLAAAnhcAIC0AAJ8XACDEBQAAuQsAIKYGAAC5CwAgCgMAAKQNACAHAACOFwAgCQAAkhcAIA0AALcPACARAAD9FAAgIgAAhBUAICQAAP8UACBGAACmEAAgRwAAgRUAIMIFAAC5CwAgFQgAAKEXACAMAAC1DwAgDQAAtw8AIBEAAP0UACAcAAC5DwAgJQAAtg8AICcAALgPACAqAACCFQAgLgAA9hQAIC8AAPcUACAwAAD5FAAgMQAA-xQAIDIAAPwUACA0AACmEAAgNQAA_xQAIDYAAIAVACA3AACBFQAgOAAAhBUAIJQGAAC5CwAgpQYAALkLACDOBgAAuQsAIAUUAACmEAAgxAUAALkLACCiBgAAuQsAIKUGAAC5CwAgpgYAALkLACAFDAAAtQ8AIA0AALcPACAcAAC5DwAgJQAAtg8AICcAALgPACAKAwAApA0AIAcAAI4XACAJAACSFwAgDQAAtw8AIBMAAIAVACAaAACVEAAgHAAAuQ8AICIAAIQVACDCBQAAuQsAIMQFAAC5CwAgBAcAAI4XACAJAACSFwAgGwAAlBcAIBwAALkPACAFFAAAlRAAIMQFAAC5CwAgogYAALkLACClBgAAuQsAIKYGAAC5CwAgCAcAAI4XACAJAACSFwAgDgAAmRcAIBAAAJEXACAjAACAFQAgxAUAALkLACDwBQAAuQsAIPMFAAC5CwAgCwcAAI4XACAJAACSFwAgDQAAtw8AIBEAAP0UACAbAACUFwAgJAAA_xQAICYAAJsXACDEBQAAuQsAIJQGAAC5CwAglQYAALkLACCXBgAAuQsAIAgHAACOFwAgCQAAkhcAIAoAAKAXACANAAC3DwAgEQAA_RQAIJQGAAC5CwAgoAYAALkLACCmBgAAuQsAIAUHAACOFwAgCQAAkhcAICUAALYPACDEBQAAuQsAIJQGAAC5CwAgCAcAAI4XACAJAACSFwAgCwAAghUAIBsAAJQXACDDBQAAuQsAIMQFAAC5CwAglAYAALkLACCWBgAAuQsAIAMHAACOFwAgKgAAghUAII4GAAC5CwAgABIHAACOFwAgCQAAkhcAIBAAAJEXACApAACQFwAgxAUAALkLACD9BQAAuQsAIP4FAAC5CwAg_wUAALkLACCABgAAuQsAIIEGAAC5CwAgggYAALkLACCDBgAAuQsAIIQGAAC5CwAghQYAALkLACCGBgAAuQsAIIcGAAC5CwAgiAYAALkLACCJBgAAuQsAIAkHAACOFwAgCQAAkhcAIA0AALcPACAPAAD5FAAglAYAALkLACCeBgAAuQsAIJ8GAAC5CwAgoAYAALkLACChBgAAuQsAIAUHAACOFwAgOQAAohcAIMMFAAC5CwAglAYAALkLACDOBgAAuQsAIAAWBwAAkA0AIAkAAI0NACAKAACODQAgCwAAhw0AIA4AAIwNACAPAACKDQAgEAAAkg4AIBkAAIsNACAbAACPDQAgLQAAiQ0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6gUBAAAAAZYGAQAAAAGmBgEAAAAB1gZAAAAAAQIAAAAoACBfAACjFwAgAwAAACYAIF8AAKMXACBgAACnFwAgGAAAACYAIAcAAN0MACAJAADaDAAgCgAA2wwAIAsAANQMACAOAADZDAAgDwAA1wwAIBAAAJAOACAZAADYDAAgGwAA3AwAIC0AANYMACBYAACnFwAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIeoFAQC9CwAhlgYBAL0LACGmBgEAvgsAIdYGQAC_CwAhFgcAAN0MACAJAADaDAAgCgAA2wwAIAsAANQMACAOAADZDAAgDwAA1wwAIBAAAJAOACAZAADYDAAgGwAA3AwAIC0AANYMACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHnBQEAvQsAIegFAQC9CwAh6gUBAL0LACGWBgEAvQsAIaYGAQC-CwAh1gZAAL8LACEHvgUBAAAAAcYFQAAAAAHHBUAAAAAB3wZAAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQy-BQEAAAABxgVAAAAAAccFQAAAAAHiBgEAAAAB4wYBAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGQAAAAAHoBkAAAAAB6QYBAAAAAeoGAQAAAAEeDAAA8BQAIA0AAOcUACARAADoFAAgHAAA7xQAICUAAOIUACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQIAAADlBAAgXwAAqhcAIAMAAAAWACBfAACqFwAgYAAArhcAICAAAAAWACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAArhcAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQW-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAABvwYAAAD6BgIJvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABB74FAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAYoGAQAAAAENvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAA0wYC-AVAAAAAAZQGAQAAAAHNBgEAAAABzgYBAAAAAdAGAAAA0AYD0QYBAAAAAdMGAQAAAAHUBgEAAAABDb4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAH2BQAAANMGAvgFQAAAAAGUBgEAAAABzAYBAAAAAc0GAQAAAAHOBgEAAAAB0AYAAADQBgPRBgEAAAAB0wYBAAAAAQ2-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAH0BQEAAAAB9gUAAAD2BQL3BQEAAAAB-AVAAAAAAfkFQAAAAAH6BQEAAAAB-wUBAAAAAQ2-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAdMFAQAAAAHoBQEAAAAB9AUBAAAAAfYFAAAA9gUC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-gUBAAAAAQu-BQEAAAABxgVAAAAAAccFQAAAAAHqBQEAAAAB9AUBAAAAAfYFAAAAjAYC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-gUBAAAAAfsFAQAAAAELvgUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAfQFAQAAAAH2BQAAAIwGAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAGMBgEAAAABBb4FAQAAAAHGBUAAAAABxwVAAAAAAd4GAQAAAAHfBkAAAAABD74FAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAHqBQEAAAAB9gUAAADFBgL4BUAAAAAB-wUBAAAAAcMGAAAAwwYCxQYBAAAAAcYGAQAAAAHIBgEAAAAByQYBAAAAAcoGAQAAAAHLBkAAAAABD74FAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAHqBQEAAAAB9gUAAADFBgL4BUAAAAABwwYAAADDBgLFBgEAAAABxgYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGAQAAAAHLBkAAAAABB74FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAAB8AUBAAAAAcEGAAAAvwYCA74FAQAAAAG8BgEAAAABvQZAAAAAASAFAADuFgAgBgAA7xYAIBAAAPAWACAZAADxFgAgNAAA9BYAID4AAPIWACBIAADzFgAgSQAA9RYAIEoAAPYWACBLAAD3FgAgTAAA-BYAIE0AAPkWACBOAAD6FgAgTwAA-xYAIFAAAPwWACBRAAD9FgAgUgAA_hYAIL4FAQAAAAHCBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABvwYBAAAAAe4GAQAAAAHvBiAAAAAB8AYBAAAAAfEGAQAAAAHyBgEAAAAB8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAQIAAADiAgAgXwAAvRcAIAMAAABRACBfAAC9FwAgYAAAwRcAICIAAABRACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFAAAMUVACBRAADGFQAgUgAAxxUAIFgAAMEXACC-BQEAvQsAIcIFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhvwYBAL0LACHuBgEAvQsAIe8GIACfDQAh8AYBAL4LACHxBgEAvgsAIfIGAQC-CwAh8wYBAL4LACH0BgEAvgsAIfUGAQC-CwAh9gYBAL0LACEgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACC-BQEAvQsAIcIFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhvwYBAL0LACHuBgEAvQsAIe8GIACfDQAh8AYBAL4LACHxBgEAvgsAIfIGAQC-CwAh8wYBAL4LACH0BgEAvgsAIfUGAQC-CwAh9gYBAL0LACEgBAAA7RYAIAYAAO8WACAQAADwFgAgGQAA8RYAIDQAAPQWACA-AADyFgAgSAAA8xYAIEkAAPUWACBKAAD2FgAgSwAA9xYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUQAA_RYAIFIAAP4WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AAMIXACADAAAAUQAgXwAAwhcAIGAAAMYXACAiAAAAUQAgBAAAthUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACBYAADGFwAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAALYVACAGAAC4FQAgEAAAuRUAIBkAALoVACA0AAC9FQAgPgAAuxUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAAO0WACAFAADuFgAgBgAA7xYAIBAAAPAWACAZAADxFgAgNAAA9BYAID4AAPIWACBIAADzFgAgSQAA9RYAIEoAAPYWACBLAAD3FgAgTAAA-BYAIE0AAPkWACBPAAD7FgAgUAAA_BYAIFEAAP0WACBSAAD-FgAgvgUBAAAAAcIFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAG_BgEAAAAB7gYBAAAAAe8GIAAAAAHwBgEAAAAB8QYBAAAAAfIGAQAAAAHzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAABAgAAAOICACBfAADHFwAgAwAAAFEAIF8AAMcXACBgAADLFwAgIgAAAFEAIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgWAAAyxcAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTwAAxBUAIFAAAMUVACBRAADGFQAgUgAAxxUAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAIR4GAADkFAAgDAAA8BQAIA0AAOcUACARAADoFAAgHAAA7xQAICUAAOIUACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA-AADpFAAgQwAA8hQAIEQAAPMUACBFAAD0FAAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB8gUAAADQBgOOBgEAAAABlAYBAAAAAc4GAQAAAAHRBgEAAAABAgAAAOUEACBfAADMFwAgAwAAABYAIF8AAMwXACBgAADQFwAgIAAAABYAIAYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACBYAADQFwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEeBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhCAcAAIkVACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAc4GAQAAAAHVBgEAAAABAgAAABQAIF8AANEXACADAAAAEgAgXwAA0RcAIGAAANUXACAKAAAAEgAgBwAAiBUAIFgAANUXACC-BQEAvQsAIcMFAQC-CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQgHAACIFQAgvgUBAL0LACHDBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEeBgAA5BQAIAwAAPAUACANAADnFAAgEQAA6BQAIBwAAO8UACAlAADiFAAgJwAA7hQAICoAAPEUACAuAADfFAAgLwAA4BQAIDAAAOMUACAxAADlFAAgMgAA5hQAIDQAAOoUACA1AADrFAAgNgAA7BQAIDcAAO0UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQIAAADlBAAgXwAA1hcAIAMAAAAWACBfAADWFwAgYAAA2hcAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAA2hcAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQq-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAZQGAQAAAAGeBgEAAAABnwZAAAAAAaAGCAAAAAGhBggAAAABHgYAAOQUACAMAADwFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAqAADxFAAgLgAA3xQAIDAAAOMUACAxAADlFAAgMgAA5hQAIDQAAOoUACA1AADrFAAgNgAA7BQAIDcAAO0UACA6AADeFAAgOwAA4RQAID4AAOkUACBDAADyFAAgRAAA8xQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AANwXACADAAAAFgAgXwAA3BcAIGAAAOAXACAgAAAAFgAgBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIFgAAOAXACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIR4GAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEGvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAGUBgEAAAABCb4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABoAYCAAAAAaYGAQAAAAHXBgEAAAAB2AYBAAAAAQm-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAZQGAQAAAAGVBgIAAAABlgYBAAAAAZcGAQAAAAEJvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAAAAAcIFAQAAAAHDBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABB74FAQAAAAHCBQEAAAABwwUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAYoGAQAAAAELvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAEHvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAQ2-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB0wUBAAAAAegFAQAAAAH0BQEAAAAB9gUAAAD2BQL3BQEAAAAB-AVAAAAAAfkFQAAAAAH6BQEAAAAB-wUBAAAAAQq-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAegFAQAAAAHvBQEAAAAB8AUBAAAAAfIFAAAA8gUC8wVAAAAAAQq-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB6QUBAAAAAeoFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBUAAAAABE74FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB_AUBAAAAAf0FCAAAAAH-BQgAAAAB_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCAAAAAGEBggAAAABhQYIAAAAAYYGCAAAAAGHBggAAAABiAYIAAAAAYkGCAAAAAEJvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAZYGAQAAAAGuBgEAAAABuQYQAAAAAboGEAAAAAG7BiAAAAABFr4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAHqBQEAAAAB9gUAAACsBgKWBgEAAAABqAYBAAAAAaoGAAAAqgYCrAYCAAAAAa0GEAAAAAGuBgEAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQYBAAAAAbYGgAAAAAG3BkAAAAABuAZAAAAAAQq-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAACbBgKOBgEAAAABlAYBAAAAAZYGAQAAAAGYBgEAAAABmQYBAAAAAQq-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB_AUBAAAAAY4GAQAAAAGUBgEAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABD74FAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAHqBQEAAAAB9gUAAADFBgL4BUAAAAAB-wUBAAAAAcMGAAAAwwYCxQYBAAAAAcYGAQAAAAHHBgEAAAAByQYBAAAAAcoGAQAAAAHLBkAAAAABBr4FAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAHOBgEAAAAB1QYBAAAAAQa-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABzgYBAAAAAdUGAQAAAAEKvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAe8FAQAAAAGUBgEAAAABngYBAAAAAZ8GQAAAAAGgBggAAAABoQYIAAAAARgIAACOFQAgDAAA2RQAIA0AANEUACARAADSFAAgHAAA2BQAICUAAM4UACAnAADXFAAgKgAA2hQAIC4AAMsUACAwAADNFAAgMQAAzxQAIDIAANAUACA0AADTFAAgNQAA1BQAIDYAANUUACA3AADWFAAgOAAA2xQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAGlBgEAAAABzgYBAAAAAdUGAQAAAAECAAAAGgAgXwAA9BcAIAm-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAGUBgEAAAABlQYCAAAAAZYGAQAAAAEDAAAAGAAgXwAA9BcAIGAAAPkXACAaAAAAGAAgCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACBYAAD5FwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEYCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQa-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAZQGAQAAAAEKvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAH8BQEAAAABjgYBAAAAAZQGAQAAAAGbBgEAAAABnAYBAAAAAQi-BQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAAB2QYBAAAAAdoGAQAAAAHbBgIAAAAB3QYAAADdBgIJvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAGUBgEAAAABlQYCAAAAAZYGAQAAAAGXBgEAAAABDgcAAIMQACAJAACEEAAgDQAAghAAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAZQGAQAAAAGeBgEAAAABnwZAAAAAAaAGCAAAAAGhBggAAAABAgAAAB8AIF8AAP4XACADAAAAHQAgXwAA_hcAIGAAAIIYACAQAAAAHQAgBwAA0A8AIAkAANEPACANAADPDwAgWAAAghgAIL4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHvBQEAvQsAIZQGAQC-CwAhngYBAL4LACGfBkAA1QsAIaAGCADuCwAhoQYIAO4LACEOBwAA0A8AIAkAANEPACANAADPDwAgvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAhlAYBAL4LACGeBgEAvgsAIZ8GQADVCwAhoAYIAO4LACGhBggA7gsAIQm-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaAGAgAAAAGmBgEAAAAB1wYBAAAAAdgGAQAAAAEgBAAA7RYAIAUAAO4WACAQAADwFgAgGQAA8RYAIDQAAPQWACA-AADyFgAgSAAA8xYAIEkAAPUWACBKAAD2FgAgSwAA9xYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUQAA_RYAIFIAAP4WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AAIQYACADAAAAUQAgXwAAhBgAIGAAAIgYACAiAAAAUQAgBAAAthUAIAUAALcVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACBYAACIGAAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAALYVACAFAAC3FQAgEAAAuRUAIBkAALoVACA0AAC9FQAgPgAAuxUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhBb4FAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAG_BgAAAPoGAgm-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEAAAABwgUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAEHvgUBAAAAAcIFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABigYBAAAAAQu-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6gUBAAAAAZYGAQAAAAGmBgEAAAAB1gZAAAAAAQe-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAABDb4FAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAA0wYC-AVAAAAAAZQGAQAAAAHMBgEAAAABzQYBAAAAAc4GAQAAAAHQBgAAANAGA9EGAQAAAAHTBgEAAAAB1AYBAAAAAQ2-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB0wUBAAAAAegFAQAAAAH0BQEAAAAB9gUAAAD2BQL3BQEAAAAB-AVAAAAAAfkFQAAAAAH6BQEAAAAB-wUBAAAAAQq-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAegFAQAAAAHvBQEAAAAB8AUBAAAAAfIFAAAA8gUC8wVAAAAAAQq-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6QUBAAAAAeoFAQAAAAHrBQEAAAAB7AUBAAAAAe0FAQAAAAHuBUAAAAABE74FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHoBQEAAAAB_AUBAAAAAf0FCAAAAAH-BQgAAAAB_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCAAAAAGEBggAAAABhQYIAAAAAYYGCAAAAAGHBggAAAABiAYIAAAAAYkGCAAAAAEJvgUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAZYGAQAAAAGuBgEAAAABuQYQAAAAAboGEAAAAAG7BiAAAAABFr4FAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHqBQEAAAAB9gUAAACsBgKWBgEAAAABqAYBAAAAAaoGAAAAqgYCrAYCAAAAAa0GEAAAAAGuBgEAAAABrwYBAAAAAbAGAQAAAAGxBgEAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQYBAAAAAbYGgAAAAAG3BkAAAAABuAZAAAAAAQq-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB9gUAAACbBgKOBgEAAAABlAYBAAAAAZYGAQAAAAGYBgEAAAABmQYBAAAAAQq-BQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB_AUBAAAAAY4GAQAAAAGUBgEAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABB74FAQAAAAHGBUAAAAABxwVAAAAAAe8FAQAAAAHwBQEAAAABwAYBAAAAAcEGAAAAvwYCD74FAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAHqBQEAAAAB9gUAAADFBgL4BUAAAAAB-wUBAAAAAcMGAAAAwwYCxgYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGAQAAAAHLBkAAAAABD74FAQAAAAHGBUAAAAABxwVAAAAAAegFAQAAAAHqBQEAAAAB9gUAAADFBgL4BUAAAAAB-wUBAAAAAcMGAAAAwwYCxQYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAcoGAQAAAAHLBkAAAAABHgYAAOQUACAMAADwFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAqAADxFAAgLgAA3xQAIC8AAOAUACAwAADjFAAgMQAA5RQAIDIAAOYUACA0AADqFAAgNQAA6xQAIDYAAOwUACA3AADtFAAgOgAA3hQAIDsAAOEUACBDAADyFAAgRAAA8xQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AAJoYACAgBAAA7RYAIAUAAO4WACAGAADvFgAgEAAA8BYAIBkAAPEWACA0AAD0FgAgPgAA8hYAIEkAAPUWACBKAAD2FgAgSwAA9xYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUQAA_RYAIFIAAP4WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AAJwYACAgBAAA7RYAIAUAAO4WACAGAADvFgAgEAAA8BYAIBkAAPEWACA0AAD0FgAgSAAA8xYAIEkAAPUWACBKAAD2FgAgSwAA9xYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUQAA_RYAIFIAAP4WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AAJ4YACADAAAAFgAgXwAAmhgAIGAAAKIYACAgAAAAFgAgBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAIEMAAIgRACBEAACJEQAgRQAAihEAIFgAAKIYACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIR4GAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEDAAAAUQAgXwAAnBgAIGAAAKUYACAiAAAAUQAgBAAAthUAIAUAALcVACAGAAC4FQAgEAAAuRUAIBkAALoVACA0AAC9FQAgPgAAuxUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACBYAAClGAAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhAwAAAFEAIF8AAJ4YACBgAACoGAAgIgAAAFEAIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgWAAAqBgAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFAAAMUVACBRAADGFQAgUgAAxxUAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAADtFgAgBQAA7hYAIAYAAO8WACAQAADwFgAgGQAA8RYAIDQAAPQWACA-AADyFgAgSAAA8xYAIEkAAPUWACBKAAD2FgAgSwAA9xYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUgAA_hYAIL4FAQAAAAHCBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABvwYBAAAAAe4GAQAAAAHvBiAAAAAB8AYBAAAAAfEGAQAAAAHyBgEAAAAB8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAQIAAADiAgAgXwAAqRgAIB4GAADkFAAgDAAA8BQAIA0AAOcUACARAADoFAAgHAAA7xQAICUAAOIUACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEQAAPMUACBFAAD0FAAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB8gUAAADQBgOOBgEAAAABlAYBAAAAAc4GAQAAAAHRBgEAAAABAgAAAOUEACBfAACrGAAgA74FAQAAAAHGBUAAAAABvwYAAAC_BgIDvgUBAAAAAcUFAQAAAAG9BkAAAAABAwAAAFEAIF8AAKkYACBgAACxGAAgIgAAAFEAIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFAAAMUVACBSAADHFQAgWAAAsRgAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUgAAxxUAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAIQMAAAAWACBfAACrGAAgYAAAtBgAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEQAAIkRACBFAACKEQAgWAAAtBgAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQsHAADfEAAgPwAA4BAAIEIAAOIQACC-BQEAAAABwwUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAfAFAQAAAAHABgEAAAABwQYAAAC_BgICAAAA4wEAIF8AALUYACADAAAA4QEAIF8AALUYACBgAAC5GAAgDQAAAOEBACAHAADDEAAgPwAAxBAAIEIAAMYQACBYAAC5GAAgvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHvBQEAvQsAIfAFAQC9CwAhwAYBAL0LACHBBgAAvRC_BiILBwAAwxAAID8AAMQQACBCAADGEAAgvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHvBQEAvQsAIfAFAQC9CwAhwAYBAL0LACHBBgAAvRC_BiIgBAAA7RYAIAUAAO4WACAGAADvFgAgEAAA8BYAIBkAAPEWACA0AAD0FgAgPgAA8hYAIEgAAPMWACBJAAD1FgAgSgAA9hYAIEsAAPcWACBMAAD4FgAgTQAA-RYAIE4AAPoWACBPAAD7FgAgUAAA_BYAIFEAAP0WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AALoYACALBwAA3xAAID8AAOAQACBBAADhEAAgvgUBAAAAAcMFAQAAAAHGBUAAAAABxwVAAAAAAe8FAQAAAAHwBQEAAAABwAYBAAAAAcEGAAAAvwYCAgAAAOMBACBfAAC8GAAgAwAAAFEAIF8AALoYACBgAADAGAAgIgAAAFEAIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFAAAMUVACBRAADGFQAgWAAAwBgAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAIQMAAADhAQAgXwAAvBgAIGAAAMMYACANAAAA4QEAIAcAAMMQACA_AADEEAAgQQAAxRAAIFgAAMMYACC-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAh8AUBAL0LACHABgEAvQsAIcEGAAC9EL8GIgsHAADDEAAgPwAAxBAAIEEAAMUQACC-BQEAvQsAIcMFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAh8AUBAL0LACHABgEAvQsAIcEGAAC9EL8GIgkMAACwDwAgDQAAsg8AIBwAALQPACAlAACxDwAgvgUBAAAAAcMFAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAECAAAAuwcAIF8AAMQYACADAAAALwAgXwAAxBgAIGAAAMgYACALAAAALwAgDAAAqg4AIA0AAKwOACAcAACuDgAgJQAAqw4AIFgAAMgYACC-BQEAvQsAIcMFAQC9CwAhjgYBAL0LACGPBkAAvwsAIZAGQAC_CwAhCQwAAKoOACANAACsDgAgHAAArg4AICUAAKsOACC-BQEAvQsAIcMFAQC9CwAhjgYBAL0LACGPBkAAvwsAIZAGQAC_CwAhDb4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB0wUBAAAAAegFAQAAAAH0BQEAAAAB9gUAAAD2BQL3BQEAAAAB-AVAAAAAAfkFQAAAAAH7BQEAAAABC74FAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH0BQEAAAAB9gUAAACMBgL3BQEAAAAB-AVAAAAAAfkFQAAAAAH7BQEAAAABjAYBAAAAARgIAACOFQAgDAAA2RQAIA0AANEUACARAADSFAAgHAAA2BQAICUAAM4UACAnAADXFAAgKgAA2hQAIC8AAMwUACAwAADNFAAgMQAAzxQAIDIAANAUACA0AADTFAAgNQAA1BQAIDYAANUUACA3AADWFAAgOAAA2xQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAGlBgEAAAABzgYBAAAAAdUGAQAAAAECAAAAGgAgXwAAyxgAIB4GAADkFAAgDAAA8BQAIA0AAOcUACARAADoFAAgHAAA7xQAICUAAOIUACAnAADuFAAgKgAA8RQAIC8AAOAUACAwAADjFAAgMQAA5RQAIDIAAOYUACA0AADqFAAgNQAA6xQAIDYAAOwUACA3AADtFAAgOgAA3hQAIDsAAOEUACA-AADpFAAgQwAA8hQAIEQAAPMUACBFAAD0FAAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB8gUAAADQBgOOBgEAAAABlAYBAAAAAc4GAQAAAAHRBgEAAAABAgAAAOUEACBfAADNGAAgGAgAAI4VACAMAADZFAAgDQAA0RQAIBEAANIUACAcAADYFAAgJQAAzhQAICcAANcUACAqAADaFAAgLgAAyxQAIC8AAMwUACAxAADPFAAgMgAA0BQAIDQAANMUACA1AADUFAAgNgAA1RQAIDcAANYUACA4AADbFAAgvgUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaUGAQAAAAHOBgEAAAAB1QYBAAAAAQIAAAAaACBfAADPGAAgHgYAAOQUACAMAADwFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAqAADxFAAgLgAA3xQAIC8AAOAUACAxAADlFAAgMgAA5hQAIDQAAOoUACA1AADrFAAgNgAA7BQAIDcAAO0UACA6AADeFAAgOwAA4RQAID4AAOkUACBDAADyFAAgRAAA8xQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AANEYACALvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAEHvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB6AUBAAAAAQMAAAAYACBfAADPGAAgYAAA1xgAIBoAAAAYACAIAACNFQAgDAAArBMAIA0AAKQTACARAAClEwAgHAAAqxMAICUAAKETACAnAACqEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIFgAANcYACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIRgIAACNFQAgDAAArBMAIA0AAKQTACARAAClEwAgHAAAqxMAICUAAKETACAnAACqEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhAwAAABYAIF8AANEYACBgAADaGAAgIAAAABYAIAYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACBYAADaGAAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEeBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhCb4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaAGAgAAAAHXBgEAAAAB2AYBAAAAAQu-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAAB1gZAAAAAAQMAAAAYACBfAADLGAAgYAAA3xgAIBoAAAAYACAIAACNFQAgDAAArBMAIA0AAKQTACARAAClEwAgHAAAqxMAICUAAKETACAnAACqEwAgKgAArRMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIFgAAN8YACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIRgIAACNFQAgDAAArBMAIA0AAKQTACARAAClEwAgHAAAqxMAICUAAKETACAnAACqEwAgKgAArRMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhAwAAABYAIF8AAM0YACBgAADiGAAgIAAAABYAIAYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACBYAADiGAAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEeBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhCQ0AALIPACAcAAC0DwAgJQAAsQ8AICcAALMPACC-BQEAAAABwwUBAAAAAY4GAQAAAAGPBkAAAAABkAZAAAAAAQIAAAC7BwAgXwAA4xgAIAMAAAAvACBfAADjGAAgYAAA5xgAIAsAAAAvACANAACsDgAgHAAArg4AICUAAKsOACAnAACtDgAgWAAA5xgAIL4FAQC9CwAhwwUBAL0LACGOBgEAvQsAIY8GQAC_CwAhkAZAAL8LACEJDQAArA4AIBwAAK4OACAlAACrDgAgJwAArQ4AIL4FAQC9CwAhwwUBAL0LACGOBgEAvQsAIY8GQAC_CwAhkAZAAL8LACEJDAAAsA8AIA0AALIPACAcAAC0DwAgJwAAsw8AIL4FAQAAAAHDBQEAAAABjgYBAAAAAY8GQAAAAAGQBkAAAAABAgAAALsHACBfAADoGAAgAwAAAC8AIF8AAOgYACBgAADsGAAgCwAAAC8AIAwAAKoOACANAACsDgAgHAAArg4AICcAAK0OACBYAADsGAAgvgUBAL0LACHDBQEAvQsAIY4GAQC9CwAhjwZAAL8LACGQBkAAvwsAIQkMAACqDgAgDQAArA4AIBwAAK4OACAnAACtDgAgvgUBAL0LACHDBQEAvQsAIY4GAQC9CwAhjwZAAL8LACGQBkAAvwsAIRgIAACOFQAgDQAA0RQAIBEAANIUACAcAADYFAAgJQAAzhQAICcAANcUACAqAADaFAAgLgAAyxQAIC8AAMwUACAwAADNFAAgMQAAzxQAIDIAANAUACA0AADTFAAgNQAA1BQAIDYAANUUACA3AADWFAAgOAAA2xQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAGlBgEAAAABzgYBAAAAAdUGAQAAAAECAAAAGgAgXwAA7RgAIB4GAADkFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAqAADxFAAgLgAA3xQAIC8AAOAUACAwAADjFAAgMQAA5RQAIDIAAOYUACA0AADqFAAgNQAA6xQAIDYAAOwUACA3AADtFAAgOgAA3hQAIDsAAOEUACA-AADpFAAgQwAA8hQAIEQAAPMUACBFAAD0FAAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB8gUAAADQBgOOBgEAAAABlAYBAAAAAc4GAQAAAAHRBgEAAAABAgAAAOUEACBfAADvGAAgFgcAAJANACAJAACNDQAgCgAAjg0AIA4AAIwNACAPAACKDQAgEAAAkg4AIBkAAIsNACAbAACPDQAgLAAAiA0AIC0AAIkNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAECAAAAKAAgXwAA8RgAIAMAAAAmACBfAADxGAAgYAAA9RgAIBgAAAAmACAHAADdDAAgCQAA2gwAIAoAANsMACAOAADZDAAgDwAA1wwAIBAAAJAOACAZAADYDAAgGwAA3AwAICwAANUMACAtAADWDAAgWAAA9RgAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAhpgYBAL4LACHWBkAAvwsAIRYHAADdDAAgCQAA2gwAIAoAANsMACAOAADZDAAgDwAA1wwAIBAAAJAOACAZAADYDAAgGwAA3AwAICwAANUMACAtAADWDAAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIeYFAQC9CwAh5wUBAL0LACHoBQEAvQsAIeoFAQC9CwAhlgYBAL0LACGmBgEAvgsAIdYGQAC_CwAhCr4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB_AUBAAAAAY4GAQAAAAGUBgEAAAABmwYBAAAAAZ0GAQAAAAEDAAAAGAAgXwAA7RgAIGAAAPkYACAaAAAAGAAgCAAAjRUAIA0AAKQTACARAAClEwAgHAAAqxMAICUAAKETACAnAACqEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACBYAAD5GAAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEYCAAAjRUAIA0AAKQTACARAAClEwAgHAAAqxMAICUAAKETACAnAACqEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQMAAAAWACBfAADvGAAgYAAA_BgAICAAAAAWACAGAAD6EAAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAA_BgAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQq-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfYFAAAAmwYCjgYBAAAAAZQGAQAAAAGYBgEAAAABmQYBAAAAAQkHAADAFAAgCQAA-RIAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAZQGAQAAAAECAAAAlwEAIF8AAP4YACAYCAAAjhUAIAwAANkUACANAADRFAAgEQAA0hQAIBwAANgUACAnAADXFAAgKgAA2hQAIC4AAMsUACAvAADMFAAgMAAAzRQAIDEAAM8UACAyAADQFAAgNAAA0xQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABpQYBAAAAAc4GAQAAAAHVBgEAAAABAgAAABoAIF8AAIAZACAeBgAA5BQAIAwAAPAUACANAADnFAAgEQAA6BQAIBwAAO8UACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQIAAADlBAAgXwAAghkAIAu-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAecFAQAAAAHoBQEAAAAB6gUBAAAAAZYGAQAAAAGmBgEAAAAB1gZAAAAAAQe-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAecFAQAAAAHoBQEAAAABCr4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAe8FAQAAAAHwBQEAAAAB8gUAAADyBQLzBUAAAAABAwAAAGsAIF8AAP4YACBgAACJGQAgCwAAAGsAIAcAAL4UACAJAADtEgAgWAAAiRkAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIZQGAQC-CwAhCQcAAL4UACAJAADtEgAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhlAYBAL4LACEDAAAAGAAgXwAAgBkAIGAAAIwZACAaAAAAGAAgCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAnAACqEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACBYAACMGQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEYCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAnAACqEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQMAAAAWACBfAACCGQAgYAAAjxkAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAAjxkAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQm-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAGUBgEAAAABlQYCAAAAAZcGAQAAAAELvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHqBQEAAAABpgYBAAAAAdYGQAAAAAEYCAAAjhUAIAwAANkUACANAADRFAAgEQAA0hQAIBwAANgUACAlAADOFAAgKgAA2hQAIC4AAMsUACAvAADMFAAgMAAAzRQAIDEAAM8UACAyAADQFAAgNAAA0xQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABpQYBAAAAAc4GAQAAAAHVBgEAAAABAgAAABoAIF8AAJIZACAeBgAA5BQAIAwAAPAUACANAADnFAAgEQAA6BQAIBwAAO8UACAlAADiFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQIAAADlBAAgXwAAlBkAIBa-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAKwGApYGAQAAAAGqBgAAAKoGAqwGAgAAAAGtBhAAAAABrgYBAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BoAAAAABtwZAAAAAAbgGQAAAAAEDAAAAGAAgXwAAkhkAIGAAAJkZACAaAAAAGAAgCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACBYAACZGQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEYCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgKgAArRMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQMAAAAWACBfAACUGQAgYAAAnBkAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAAnBkAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQm-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAa4GAQAAAAG5BhAAAAABugYQAAAAAbsGIAAAAAEPAwAAlQ4AIAcAAJMOACAJAACUDgAgDQAAlg4AIBMAAJcOACAaAACYDgAgIgAAmg4AIL4FAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAGKBgEAAAABAgAAAJ0BACBfAACeGQAgAwAAAFMAIF8AAJ4ZACBgAACiGQAgEQAAAFMAIAMAAMMNACAHAADBDQAgCQAAwg0AIA0AAMQNACATAADFDQAgGgAAxg0AICIAAMgNACBYAACiGQAgvgUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxAUBAL4LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGKBgEAvQsAIQ8DAADDDQAgBwAAwQ0AIAkAAMINACANAADEDQAgEwAAxQ0AIBoAAMYNACAiAADIDQAgvgUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxAUBAL4LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGKBgEAvQsAIRa-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeoFAQAAAAH2BQAAAKwGAqgGAQAAAAGqBgAAAKoGAqwGAgAAAAGtBhAAAAABrgYBAAAAAa8GAQAAAAGwBgEAAAABsQYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGAQAAAAG2BoAAAAABtwZAAAAAAbgGQAAAAAEgBAAA7RYAIAUAAO4WACAGAADvFgAgEAAA8BYAIBkAAPEWACA0AAD0FgAgPgAA8hYAIEgAAPMWACBJAAD1FgAgSgAA9hYAIEsAAPcWACBMAAD4FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUQAA_RYAIFIAAP4WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AAKQZACADAAAAUQAgXwAApBkAIGAAAKgZACAiAAAAUQAgBAAAthUAIAUAALcVACAGAAC4FQAgEAAAuRUAIBkAALoVACA0AAC9FQAgPgAAuxUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACBYAACoGQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhDwMAAJUOACAHAACTDgAgCQAAlA4AIA0AAJYOACATAACXDgAgHAAAmQ4AICIAAJoOACC-BQEAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABigYBAAAAAQIAAACdAQAgXwAAqRkAIAMAAABTACBfAACpGQAgYAAArRkAIBEAAABTACADAADDDQAgBwAAwQ0AIAkAAMINACANAADEDQAgEwAAxQ0AIBwAAMcNACAiAADIDQAgWAAArRkAIL4FAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC-CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhigYBAL0LACEPAwAAww0AIAcAAMENACAJAADCDQAgDQAAxA0AIBMAAMUNACAcAADHDQAgIgAAyA0AIL4FAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC-CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhigYBAL0LACEgBAAA7RYAIAUAAO4WACAGAADvFgAgEAAA8BYAIDQAAPQWACA-AADyFgAgSAAA8xYAIEkAAPUWACBKAAD2FgAgSwAA9xYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUQAA_RYAIFIAAP4WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AAK4ZACAYCAAAjhUAIAwAANkUACANAADRFAAgEQAA0hQAIBwAANgUACAlAADOFAAgJwAA1xQAICoAANoUACAuAADLFAAgLwAAzBQAIDAAAM0UACAxAADPFAAgNAAA0xQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABpQYBAAAAAc4GAQAAAAHVBgEAAAABAgAAABoAIF8AALAZACAeBgAA5BQAIAwAAPAUACANAADnFAAgEQAA6BQAIBwAAO8UACAlAADiFAAgJwAA7hQAICoAAPEUACAuAADfFAAgLwAA4BQAIDAAAOMUACAxAADlFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQIAAADlBAAgXwAAshkAIBIDAACZDQAgBwAAkQ0AIAkAAJgNACARAACTDQAgIgAAlw0AICQAAJQNACBGAACVDQAgRwAAlg0AIL4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAECAAAAEAAgXwAAtBkAIAMAAAAOACBfAAC0GQAgYAAAuBkAIBQAAAAOACADAADICwAgBwAAwAsAIAkAAMcLACARAADCCwAgIgAAxgsAICQAAMMLACBGAADECwAgRwAAxQsAIFgAALgZACC-BQEAvQsAIb8FAQC9CwAhwAUBAL0LACHBBQEAvQsAIcIFAQC-CwAhwwUBAL0LACHEBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIRIDAADICwAgBwAAwAsAIAkAAMcLACARAADCCwAgIgAAxgsAICQAAMMLACBGAADECwAgRwAAxQsAIL4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC9CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhC74FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAABlgYBAAAAAaYGAQAAAAHWBkAAAAABCr4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6QUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FQAAAAAEgBAAA7RYAIAUAAO4WACAGAADvFgAgEAAA8BYAIBkAAPEWACA0AAD0FgAgPgAA8hYAIEgAAPMWACBJAAD1FgAgSgAA9hYAIEsAAPcWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUQAA_RYAIFIAAP4WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AALsZACAgBAAA7RYAIAUAAO4WACAGAADvFgAgEAAA8BYAIBkAAPEWACA0AAD0FgAgPgAA8hYAIEgAAPMWACBJAAD1FgAgSgAA9hYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBQAAD8FgAgUQAA_RYAIFIAAP4WACC-BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAb8GAQAAAAHuBgEAAAAB7wYgAAAAAfAGAQAAAAHxBgEAAAAB8gYBAAAAAfMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAECAAAA4gIAIF8AAL0ZACAMvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHvBQEAAAABogYBAAAAAaMGAQAAAAGkBgAAkxAAIKUGAQAAAAGmBgEAAAABpwYBAAAAAQIAAAC8BgAgXwAAvxkAIAMAAABRACBfAAC7GQAgYAAAwxkAICIAAABRACAEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFAAAMUVACBRAADGFQAgUgAAxxUAIFgAAMMZACC-BQEAvQsAIcIFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhvwYBAL0LACHuBgEAvQsAIe8GIACfDQAh8AYBAL4LACHxBgEAvgsAIfIGAQC-CwAh8wYBAL4LACH0BgEAvgsAIfUGAQC-CwAh9gYBAL0LACEgBAAAthUAIAUAALcVACAGAAC4FQAgEAAAuRUAIBkAALoVACA0AAC9FQAgPgAAuxUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACC-BQEAvQsAIcIFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhvwYBAL0LACHuBgEAvQsAIe8GIACfDQAh8AYBAL4LACHxBgEAvgsAIfIGAQC-CwAh8wYBAL4LACH0BgEAvgsAIfUGAQC-CwAh9gYBAL0LACEDAAAAUQAgXwAAvRkAIGAAAMYZACAiAAAAUQAgBAAAthUAIAUAALcVACAGAAC4FQAgEAAAuRUAIBkAALoVACA0AAC9FQAgPgAAuxUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACBYAADGGQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhAwAAAL8GACBfAAC_GQAgYAAAyRkAIA4AAAC_BgAgWAAAyRkAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHvBQEAvQsAIaIGAQC-CwAhowYBAL0LACGkBgAAiBAAIKUGAQC-CwAhpgYBAL4LACGnBgEAvQsAIQy-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACGiBgEAvgsAIaMGAQC9CwAhpAYAAIgQACClBgEAvgsAIaYGAQC-CwAhpwYBAL0LACELvgUBAAAAAcYFQAAAAAHHBUAAAAAB9AUBAAAAAfYFAAAAjAYC9wUBAAAAAfgFQAAAAAH5BUAAAAAB-gUBAAAAAfsFAQAAAAGMBgEAAAABDQcAANIOACAJAADTDgAgGwAAshAAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABlgYBAAAAAa4GAQAAAAG5BhAAAAABugYQAAAAAbsGIAAAAAECAAAAdgAgXwAAyxkAIAkMAACwDwAgDQAAsg8AICUAALEPACAnAACzDwAgvgUBAAAAAcMFAQAAAAGOBgEAAAABjwZAAAAAAZAGQAAAAAECAAAAuwcAIF8AAM0ZACAYCAAAjhUAIAwAANkUACANAADRFAAgEQAA0hQAICUAAM4UACAnAADXFAAgKgAA2hQAIC4AAMsUACAvAADMFAAgMAAAzRQAIDEAAM8UACAyAADQFAAgNAAA0xQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABpQYBAAAAAc4GAQAAAAHVBgEAAAABAgAAABoAIF8AAM8ZACAeBgAA5BQAIAwAAPAUACANAADnFAAgEQAA6BQAICUAAOIUACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQIAAADlBAAgXwAA0RkAIAMAAAB0ACBfAADLGQAgYAAA1RkAIA8AAAB0ACAHAADFDgAgCQAAxg4AIBsAALEQACBYAADVGQAgvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZYGAQC9CwAhrgYBAL0LACG5BhAA4Q0AIboGEADhDQAhuwYgAJ8NACENBwAAxQ4AIAkAAMYOACAbAACxEAAgvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZYGAQC9CwAhrgYBAL0LACG5BhAA4Q0AIboGEADhDQAhuwYgAJ8NACEDAAAALwAgXwAAzRkAIGAAANgZACALAAAALwAgDAAAqg4AIA0AAKwOACAlAACrDgAgJwAArQ4AIFgAANgZACC-BQEAvQsAIcMFAQC9CwAhjgYBAL0LACGPBkAAvwsAIZAGQAC_CwAhCQwAAKoOACANAACsDgAgJQAAqw4AICcAAK0OACC-BQEAvQsAIcMFAQC9CwAhjgYBAL0LACGPBkAAvwsAIZAGQAC_CwAhAwAAABgAIF8AAM8ZACBgAADbGQAgGgAAABgAIAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgLwAAnxMAIDAAAKATACAxAACiEwAgMgAAoxMAIDQAAKYTACA1AACnEwAgNgAAqBMAIDcAAKkTACA4AACuEwAgWAAA2xkAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhGAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgLwAAnxMAIDAAAKATACAxAACiEwAgMgAAoxMAIDQAAKYTACA1AACnEwAgNgAAqBMAIDcAAKkTACA4AACuEwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEDAAAAFgAgXwAA0RkAIGAAAN4ZACAgAAAAFgAgBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIFgAAN4ZACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIR4GAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEWvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAH2BQAAAKwGApYGAQAAAAGoBgEAAAABqgYAAACqBgKsBgIAAAABrQYQAAAAAa4GAQAAAAGvBgEAAAABsAYBAAAAAbEGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BgEAAAABtgaAAAAAAbcGQAAAAAG4BkAAAAABEgMAAJkNACAHAACRDQAgCQAAmA0AIA0AAJINACARAACTDQAgJAAAlA0AIEYAAJUNACBHAACWDQAgvgUBAAAAAb8FAQAAAAHABQEAAAABwQUBAAAAAcIFAQAAAAHDBQEAAAABxAUBAAAAAcUFAQAAAAHGBUAAAAABxwVAAAAAAQIAAAAQACBfAADgGQAgAwAAAA4AIF8AAOAZACBgAADkGQAgFAAAAA4AIAMAAMgLACAHAADACwAgCQAAxwsAIA0AAMELACARAADCCwAgJAAAwwsAIEYAAMQLACBHAADFCwAgWAAA5BkAIL4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC9CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhEgMAAMgLACAHAADACwAgCQAAxwsAIA0AAMELACARAADCCwAgJAAAwwsAIEYAAMQLACBHAADFCwAgvgUBAL0LACG_BQEAvQsAIcAFAQC9CwAhwQUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxAUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACEPvgUBAAAAAcYFQAAAAAHHBUAAAAAB6AUBAAAAAfYFAAAAxQYC-AVAAAAAAfsFAQAAAAHDBgAAAMMGAsUGAQAAAAHGBgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABygYBAAAAAcsGQAAAAAEDAAAAUQAgXwAArhkAIGAAAOgZACAiAAAAUQAgBAAAthUAIAUAALcVACAGAAC4FQAgEAAAuRUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACBYAADoGQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACA0AAC9FQAgPgAAuxUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhAwAAABgAIF8AALAZACBgAADrGQAgGgAAABgAIAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDQAAKYTACA1AACnEwAgNgAAqBMAIDcAAKkTACA4AACuEwAgWAAA6xkAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhGAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDQAAKYTACA1AACnEwAgNgAAqBMAIDcAAKkTACA4AACuEwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEDAAAAFgAgXwAAshkAIGAAAO4ZACAgAAAAFgAgBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIFgAAO4ZACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIR4GAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACESAwAAmQ0AIAcAAJENACAJAACYDQAgDQAAkg0AIBEAAJMNACAiAACXDQAgJAAAlA0AIEcAAJYNACC-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABAgAAABAAIF8AAO8ZACADAAAADgAgXwAA7xkAIGAAAPMZACAUAAAADgAgAwAAyAsAIAcAAMALACAJAADHCwAgDQAAwQsAIBEAAMILACAiAADGCwAgJAAAwwsAIEcAAMULACBYAADzGQAgvgUBAL0LACG_BQEAvQsAIcAFAQC9CwAhwQUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxAUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACESAwAAyAsAIAcAAMALACAJAADHCwAgDQAAwQsAIBEAAMILACAiAADGCwAgJAAAwwsAIEcAAMULACC-BQEAvQsAIb8FAQC9CwAhwAUBAL0LACHBBQEAvQsAIcIFAQC-CwAhwwUBAL0LACHEBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIRIDAACZDQAgBwAAkQ0AIAkAAJgNACANAACSDQAgEQAAkw0AICIAAJcNACBGAACVDQAgRwAAlg0AIL4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAECAAAAEAAgXwAA9BkAIAMAAAAOACBfAAD0GQAgYAAA-BkAIBQAAAAOACADAADICwAgBwAAwAsAIAkAAMcLACANAADBCwAgEQAAwgsAICIAAMYLACBGAADECwAgRwAAxQsAIFgAAPgZACC-BQEAvQsAIb8FAQC9CwAhwAUBAL0LACHBBQEAvQsAIcIFAQC-CwAhwwUBAL0LACHEBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIRIDAADICwAgBwAAwAsAIAkAAMcLACANAADBCwAgEQAAwgsAICIAAMYLACBGAADECwAgRwAAxQsAIL4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC9CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhDwcAALIMACAJAACzDAAgDgAAsQwAIBAAALMNACC-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHoBQEAAAAB7wUBAAAAAfAFAQAAAAHyBQAAAPIFAvMFQAAAAAECAAAAQQAgXwAA-RkAIAMAAAA_ACBfAAD5GQAgYAAA_RkAIBEAAAA_ACAHAACbDAAgCQAAnAwAIA4AAJoMACAQAACyDQAgWAAA_RkAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIegFAQC9CwAh7wUBAL0LACHwBQEAvgsAIfIFAACYDPIFIvMFQADVCwAhDwcAAJsMACAJAACcDAAgDgAAmgwAIBAAALINACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHoBQEAvQsAIe8FAQC9CwAh8AUBAL4LACHyBQAAmAzyBSLzBUAA1QsAIRIDAACZDQAgBwAAkQ0AIAkAAJgNACANAACSDQAgIgAAlw0AICQAAJQNACBGAACVDQAgRwAAlg0AIL4FAQAAAAG_BQEAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAECAAAAEAAgXwAA_hkAIAMAAAAOACBfAAD-GQAgYAAAghoAIBQAAAAOACADAADICwAgBwAAwAsAIAkAAMcLACANAADBCwAgIgAAxgsAICQAAMMLACBGAADECwAgRwAAxQsAIFgAAIIaACC-BQEAvQsAIb8FAQC9CwAhwAUBAL0LACHBBQEAvQsAIcIFAQC-CwAhwwUBAL0LACHEBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIRIDAADICwAgBwAAwAsAIAkAAMcLACANAADBCwAgIgAAxgsAICQAAMMLACBGAADECwAgRwAAxQsAIL4FAQC9CwAhvwUBAL0LACHABQEAvQsAIcEFAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC9CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhIAQAAO0WACAFAADuFgAgBgAA7xYAIBAAAPAWACAZAADxFgAgNAAA9BYAID4AAPIWACBIAADzFgAgSQAA9RYAIEsAAPcWACBMAAD4FgAgTQAA-RYAIE4AAPoWACBPAAD7FgAgUAAA_BYAIFEAAP0WACBSAAD-FgAgvgUBAAAAAcIFAQAAAAHGBUAAAAABxwVAAAAAAY4GAQAAAAG_BgEAAAAB7gYBAAAAAe8GIAAAAAHwBgEAAAAB8QYBAAAAAfIGAQAAAAHzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAABAgAAAOICACBfAACDGgAgAwAAAFEAIF8AAIMaACBgAACHGgAgIgAAAFEAIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgWAAAhxoAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFAAAMUVACBRAADGFQAgUgAAxxUAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAADtFgAgBQAA7hYAIAYAAO8WACAZAADxFgAgNAAA9BYAID4AAPIWACBIAADzFgAgSQAA9RYAIEoAAPYWACBLAAD3FgAgTAAA-BYAIE0AAPkWACBOAAD6FgAgTwAA-xYAIFAAAPwWACBRAAD9FgAgUgAA_hYAIL4FAQAAAAHCBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABvwYBAAAAAe4GAQAAAAHvBiAAAAAB8AYBAAAAAfEGAQAAAAHyBgEAAAAB8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAQIAAADiAgAgXwAAiBoAIBgIAACOFQAgDAAA2RQAIA0AANEUACARAADSFAAgHAAA2BQAICUAAM4UACAnAADXFAAgKgAA2hQAIC4AAMsUACAvAADMFAAgMAAAzRQAIDIAANAUACA0AADTFAAgNQAA1BQAIDYAANUUACA3AADWFAAgOAAA2xQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAZQGAQAAAAGlBgEAAAABzgYBAAAAAdUGAQAAAAECAAAAGgAgXwAAihoAIB4GAADkFAAgDAAA8BQAIA0AAOcUACARAADoFAAgHAAA7xQAICUAAOIUACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDIAAOYUACA0AADqFAAgNQAA6xQAIDYAAOwUACA3AADtFAAgOgAA3hQAIDsAAOEUACA-AADpFAAgQwAA8hQAIEQAAPMUACBFAAD0FAAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB8gUAAADQBgOOBgEAAAABlAYBAAAAAc4GAQAAAAHRBgEAAAABAgAAAOUEACBfAACMGgAgHgYAAOQUACAMAADwFAAgEQAA6BQAIBwAAO8UACAlAADiFAAgJwAA7hQAICoAAPEUACAuAADfFAAgLwAA4BQAIDAAAOMUACAxAADlFAAgMgAA5hQAIDQAAOoUACA1AADrFAAgNgAA7BQAIDcAAO0UACA6AADeFAAgOwAA4RQAID4AAOkUACBDAADyFAAgRAAA8xQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AAI4aACAJDAAAsA8AIBwAALQPACAlAACxDwAgJwAAsw8AIL4FAQAAAAHDBQEAAAABjgYBAAAAAY8GQAAAAAGQBkAAAAABAgAAALsHACBfAACQGgAgDgcAAIMQACAJAACEEAAgDwAAgRAAIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB7wUBAAAAAZQGAQAAAAGeBgEAAAABnwZAAAAAAaAGCAAAAAGhBggAAAABAgAAAB8AIF8AAJIaACAYCAAAjhUAIAwAANkUACARAADSFAAgHAAA2BQAICUAAM4UACAnAADXFAAgKgAA2hQAIC4AAMsUACAvAADMFAAgMAAAzRQAIDEAAM8UACAyAADQFAAgNAAA0xQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABpQYBAAAAAc4GAQAAAAHVBgEAAAABAgAAABoAIF8AAJQaACAQBwAAjw8AIAkAAJAPACARAACNDwAgGwAAwA8AICQAAI4PACAmAACRDwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZUGAgAAAAGWBgEAAAABlwYBAAAAAQIAAAA3ACBfAACWGgAgDwMAAJUOACAHAACTDgAgCQAAlA4AIBMAAJcOACAaAACYDgAgHAAAmQ4AICIAAJoOACC-BQEAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABigYBAAAAAQIAAACdAQAgXwAAmBoAIA4HAAD9DwAgCQAA_g8AIAoAAMASACARAACAEAAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABoAYCAAAAAaYGAQAAAAHXBgEAAAAB2AYBAAAAAQIAAAAjACBfAACaGgAgGAgAAI4VACAMAADZFAAgDQAA0RQAIBEAANIUACAcAADYFAAgJQAAzhQAICcAANcUACAuAADLFAAgLwAAzBQAIDAAAM0UACAxAADPFAAgMgAA0BQAIDQAANMUACA1AADUFAAgNgAA1RQAIDcAANYUACA4AADbFAAgvgUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaUGAQAAAAHOBgEAAAAB1QYBAAAAAQIAAAAaACBfAACcGgAgHgYAAOQUACAMAADwFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAuAADfFAAgLwAA4BQAIDAAAOMUACAxAADlFAAgMgAA5hQAIDQAAOoUACA1AADrFAAgNgAA7BQAIDcAAO0UACA6AADeFAAgOwAA4RQAID4AAOkUACBDAADyFAAgRAAA8xQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AAJ4aACAKBwAAnRUAIL4FAQAAAAHDBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAAB2QYBAAAAAdoGAQAAAAHbBgIAAAAB3QYAAADdBgICAAAAygEAIF8AAKAaACAOBwAArg8AIAkAAK8PACAbAADFDwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAH2BQAAAJsGAo4GAQAAAAGUBgEAAAABlgYBAAAAAZgGAQAAAAGZBgEAAAABAgAAADMAIF8AAKIaACADAAAAGAAgXwAAnBoAIGAAAKYaACAaAAAAGAAgCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACBYAACmGgAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEYCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAIC4AAJ4TACAvAACfEwAgMAAAoBMAIDEAAKITACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQMAAAAWACBfAACeGgAgYAAAqRoAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAAqRoAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQMAAADIAQAgXwAAoBoAIGAAAKwaACAMAAAAyAEAIAcAAJwVACBYAACsGgAgvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvgsAIdkGAQC9CwAh2gYBAL0LACHbBgIA4A0AId0GAADUEt0GIgoHAACcFQAgvgUBAL0LACHDBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvgsAIdkGAQC9CwAh2gYBAL0LACHbBgIA4A0AId0GAADUEt0GIgMAAAAxACBfAACiGgAgYAAArxoAIBAAAAAxACAHAACfDwAgCQAAoA8AIBsAAMQPACBYAACvGgAgvgUBAL0LACHDBQEAvgsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIfYFAACcD5sGIo4GAQC9CwAhlAYBAL4LACGWBgEAvgsAIZgGAQC9CwAhmQYBAL0LACEOBwAAnw8AIAkAAKAPACAbAADEDwAgvgUBAL0LACHDBQEAvgsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIfYFAACcD5sGIo4GAQC9CwAhlAYBAL4LACGWBgEAvgsAIZgGAQC9CwAhmQYBAL0LACEKvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAQW-BQEAAAABxgVAAAAAAccFQAAAAAH2BQAAAPkGAvcGQAAAAAESAwAAmQ0AIAcAAJENACAJAACYDQAgDQAAkg0AIBEAAJMNACAiAACXDQAgJAAAlA0AIEYAAJUNACC-BQEAAAABvwUBAAAAAcAFAQAAAAHBBQEAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABAgAAABAAIF8AALIaACADAAAADgAgXwAAshoAIGAAALYaACAUAAAADgAgAwAAyAsAIAcAAMALACAJAADHCwAgDQAAwQsAIBEAAMILACAiAADGCwAgJAAAwwsAIEYAAMQLACBYAAC2GgAgvgUBAL0LACG_BQEAvQsAIcAFAQC9CwAhwQUBAL0LACHCBQEAvgsAIcMFAQC9CwAhxAUBAL0LACHFBQEAvQsAIcYFQAC_CwAhxwVAAL8LACESAwAAyAsAIAcAAMALACAJAADHCwAgDQAAwQsAIBEAAMILACAiAADGCwAgJAAAwwsAIEYAAMQLACC-BQEAvQsAIb8FAQC9CwAhwAUBAL0LACHBBQEAvQsAIcIFAQC-CwAhwwUBAL0LACHEBQEAvQsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIQMAAAAWACBfAACOGgAgYAAAuRoAICAAAAAWACAGAAD6EAAgDAAAhhEAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAAuRoAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQMAAAAvACBfAACQGgAgYAAAvBoAIAsAAAAvACAMAACqDgAgHAAArg4AICUAAKsOACAnAACtDgAgWAAAvBoAIL4FAQC9CwAhwwUBAL0LACGOBgEAvQsAIY8GQAC_CwAhkAZAAL8LACEJDAAAqg4AIBwAAK4OACAlAACrDgAgJwAArQ4AIL4FAQC9CwAhwwUBAL0LACGOBgEAvQsAIY8GQAC_CwAhkAZAAL8LACEDAAAAHQAgXwAAkhoAIGAAAL8aACAQAAAAHQAgBwAA0A8AIAkAANEPACAPAADODwAgWAAAvxoAIL4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACHvBQEAvQsAIZQGAQC-CwAhngYBAL4LACGfBkAA1QsAIaAGCADuCwAhoQYIAO4LACEOBwAA0A8AIAkAANEPACAPAADODwAgvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAhlAYBAL4LACGeBgEAvgsAIZ8GQADVCwAhoAYIAO4LACGhBggA7gsAIQMAAAAYACBfAACUGgAgYAAAwhoAIBoAAAAYACAIAACNFQAgDAAArBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIFgAAMIaACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIRgIAACNFQAgDAAArBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhAwAAADUAIF8AAJYaACBgAADFGgAgEgAAADUAIAcAAO0OACAJAADuDgAgEQAA6w4AIBsAAL8PACAkAADsDgAgJgAA7w4AIFgAAMUaACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIZUGAgDoDgAhlgYBAL0LACGXBgEAvgsAIRAHAADtDgAgCQAA7g4AIBEAAOsOACAbAAC_DwAgJAAA7A4AICYAAO8OACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIZUGAgDoDgAhlgYBAL0LACGXBgEAvgsAIQMAAABTACBfAACYGgAgYAAAyBoAIBEAAABTACADAADDDQAgBwAAwQ0AIAkAAMINACATAADFDQAgGgAAxg0AIBwAAMcNACAiAADIDQAgWAAAyBoAIL4FAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC-CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhigYBAL0LACEPAwAAww0AIAcAAMENACAJAADCDQAgEwAAxQ0AIBoAAMYNACAcAADHDQAgIgAAyA0AIL4FAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC-CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhigYBAL0LACEDAAAAIQAgXwAAmhoAIGAAAMsaACAQAAAAIQAgBwAA5g8AIAkAAOcPACAKAAC-EgAgEQAA6Q8AIFgAAMsaACC-BQEAvQsAIcMFAQC9CwAhxAUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGgBgIA6A4AIaYGAQC-CwAh1wYBAL0LACHYBgEAvQsAIQ4HAADmDwAgCQAA5w8AIAoAAL4SACARAADpDwAgvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhoAYCAOgOACGmBgEAvgsAIdcGAQC9CwAh2AYBAL0LACELvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB5wUBAAAAAeoFAQAAAAGWBgEAAAABpgYBAAAAAdYGQAAAAAEYCAAAjhUAIAwAANkUACANAADRFAAgHAAA2BQAICUAAM4UACAnAADXFAAgKgAA2hQAIC4AAMsUACAvAADMFAAgMAAAzRQAIDEAAM8UACAyAADQFAAgNAAA0xQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABpQYBAAAAAc4GAQAAAAHVBgEAAAABAgAAABoAIF8AAM0aACAeBgAA5BQAIAwAAPAUACANAADnFAAgHAAA7xQAICUAAOIUACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQIAAADlBAAgXwAAzxoAIA4HAAD9DwAgCQAA_g8AIAoAAMASACANAAD_DwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABoAYCAAAAAaYGAQAAAAHXBgEAAAAB2AYBAAAAAQIAAAAjACBfAADRGgAgEAcAAI8PACAJAACQDwAgDQAAjA8AIBsAAMAPACAkAACODwAgJgAAkQ8AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAABjgYBAAAAAZQGAQAAAAGVBgIAAAABlgYBAAAAAZcGAQAAAAECAAAANwAgXwAA0xoAIAMAAAAYACBfAADNGgAgYAAA1xoAIBoAAAAYACAIAACNFQAgDAAArBMAIA0AAKQTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIFgAANcaACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIRgIAACNFQAgDAAArBMAIA0AAKQTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA3AACpEwAgOAAArhMAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhAwAAABYAIF8AAM8aACBgAADaGgAgIAAAABYAIAYAAPoQACAMAACGEQAgDQAA_RAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACBYAADaGgAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEeBgAA-hAAIAwAAIYRACANAAD9EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhAwAAACEAIF8AANEaACBgAADdGgAgEAAAACEAIAcAAOYPACAJAADnDwAgCgAAvhIAIA0AAOgPACBYAADdGgAgvgUBAL0LACHDBQEAvQsAIcQFAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhoAYCAOgOACGmBgEAvgsAIdcGAQC9CwAh2AYBAL0LACEOBwAA5g8AIAkAAOcPACAKAAC-EgAgDQAA6A8AIL4FAQC9CwAhwwUBAL0LACHEBQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaAGAgDoDgAhpgYBAL4LACHXBgEAvQsAIdgGAQC9CwAhAwAAADUAIF8AANMaACBgAADgGgAgEgAAADUAIAcAAO0OACAJAADuDgAgDQAA6g4AIBsAAL8PACAkAADsDgAgJgAA7w4AIFgAAOAaACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIZUGAgDoDgAhlgYBAL0LACGXBgEAvgsAIRAHAADtDgAgCQAA7g4AIA0AAOoOACAbAAC_DwAgJAAA7A4AICYAAO8OACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACGUBgEAvgsAIZUGAgDoDgAhlgYBAL0LACGXBgEAvgsAIQe-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAeYFAQAAAAHnBQEAAAABGAgAAI4VACAMAADZFAAgDQAA0RQAIBEAANIUACAcAADYFAAgJQAAzhQAICcAANcUACAqAADaFAAgLgAAyxQAIC8AAMwUACAwAADNFAAgMQAAzxQAIDIAANAUACA0AADTFAAgNgAA1RQAIDcAANYUACA4AADbFAAgvgUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaUGAQAAAAHOBgEAAAAB1QYBAAAAAQIAAAAaACBfAADiGgAgHgYAAOQUACAMAADwFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAqAADxFAAgLgAA3xQAIC8AAOAUACAwAADjFAAgMQAA5RQAIDIAAOYUACA0AADqFAAgNgAA7BQAIDcAAO0UACA6AADeFAAgOwAA4RQAID4AAOkUACBDAADyFAAgRAAA8xQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AAOQaACAQBwAAjw8AIAkAAJAPACANAACMDwAgEQAAjQ8AIBsAAMAPACAmAACRDwAgvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABlAYBAAAAAZUGAgAAAAGWBgEAAAABlwYBAAAAAQIAAAA3ACBfAADmGgAgGAgAAI4VACAMAADZFAAgDQAA0RQAIBEAANIUACAcAADYFAAgJQAAzhQAICcAANcUACAqAADaFAAgLgAAyxQAIC8AAMwUACAwAADNFAAgMQAAzxQAIDIAANAUACA0AADTFAAgNQAA1BQAIDcAANYUACA4AADbFAAgvgUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaUGAQAAAAHOBgEAAAAB1QYBAAAAAQIAAAAaACBfAADoGgAgHgYAAOQUACAMAADwFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAqAADxFAAgLgAA3xQAIC8AAOAUACAwAADjFAAgMQAA5RQAIDIAAOYUACA0AADqFAAgNQAA6xQAIDcAAO0UACA6AADeFAAgOwAA4RQAID4AAOkUACBDAADyFAAgRAAA8xQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AAOoaACAPAwAAlQ4AIAcAAJMOACAJAACUDgAgDQAAlg4AIBoAAJgOACAcAACZDgAgIgAAmg4AIL4FAQAAAAHCBQEAAAABwwUBAAAAAcQFAQAAAAHFBQEAAAABxgVAAAAAAccFQAAAAAGKBgEAAAABAgAAAJ0BACBfAADsGgAgAwAAABgAIF8AAOgaACBgAADwGgAgGgAAABgAIAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDcAAKkTACA4AACuEwAgWAAA8BoAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhGAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDcAAKkTACA4AACuEwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEDAAAAFgAgXwAA6hoAIGAAAPMaACAgAAAAFgAgBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIFgAAPMaACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIR4GAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEDAAAAUwAgXwAA7BoAIGAAAPYaACARAAAAUwAgAwAAww0AIAcAAMENACAJAADCDQAgDQAAxA0AIBoAAMYNACAcAADHDQAgIgAAyA0AIFgAAPYaACC-BQEAvQsAIcIFAQC-CwAhwwUBAL0LACHEBQEAvgsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIYoGAQC9CwAhDwMAAMMNACAHAADBDQAgCQAAwg0AIA0AAMQNACAaAADGDQAgHAAAxw0AICIAAMgNACC-BQEAvQsAIcIFAQC-CwAhwwUBAL0LACHEBQEAvgsAIcUFAQC9CwAhxgVAAL8LACHHBUAAvwsAIYoGAQC9CwAhCr4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB6gUBAAAAAesFAQAAAAHsBQEAAAAB7QUBAAAAAe4FQAAAAAEDAAAAGAAgXwAA4hoAIGAAAPoaACAaAAAAGAAgCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgLwAAnxMAIDAAAKATACAxAACiEwAgMgAAoxMAIDQAAKYTACA2AACoEwAgNwAAqRMAIDgAAK4TACBYAAD6GgAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEYCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgLwAAnxMAIDAAAKATACAxAACiEwAgMgAAoxMAIDQAAKYTACA2AACoEwAgNwAAqRMAIDgAAK4TACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQMAAAAWACBfAADkGgAgYAAA_RoAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAA_RoAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQMAAAA1ACBfAADmGgAgYAAAgBsAIBIAAAA1ACAHAADtDgAgCQAA7g4AIA0AAOoOACARAADrDgAgGwAAvw8AICYAAO8OACBYAACAGwAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhlAYBAL4LACGVBgIA6A4AIZYGAQC9CwAhlwYBAL4LACEQBwAA7Q4AIAkAAO4OACANAADqDgAgEQAA6w4AIBsAAL8PACAmAADvDgAgvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhlAYBAL4LACGVBgIA6A4AIZYGAQC9CwAhlwYBAL4LACEKvgUBAAAAAcMFAQAAAAHEBQEAAAABxgVAAAAAAccFQAAAAAHmBQEAAAAB7wUBAAAAAfAFAQAAAAHyBQAAAPIFAvMFQAAAAAEYCAAAjhUAIAwAANkUACANAADRFAAgEQAA0hQAIBwAANgUACAlAADOFAAgJwAA1xQAICoAANoUACAuAADLFAAgLwAAzBQAIDAAAM0UACAxAADPFAAgMgAA0BQAIDUAANQUACA2AADVFAAgNwAA1hQAIDgAANsUACC-BQEAAAABxgVAAAAAAccFQAAAAAGUBgEAAAABpQYBAAAAAc4GAQAAAAHVBgEAAAABAgAAABoAIF8AAIIbACAeBgAA5BQAIAwAAPAUACANAADnFAAgEQAA6BQAIBwAAO8UACAlAADiFAAgJwAA7hQAICoAAPEUACAuAADfFAAgLwAA4BQAIDAAAOMUACAxAADlFAAgMgAA5hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgRQAA9BQAIL4FAQAAAAHGBUAAAAABxwVAAAAAAfIFAAAA0AYDjgYBAAAAAZQGAQAAAAHOBgEAAAAB0QYBAAAAAQIAAADlBAAgXwAAhBsAICAEAADtFgAgBQAA7hYAIAYAAO8WACAQAADwFgAgGQAA8RYAIDQAAPQWACA-AADyFgAgSAAA8xYAIEoAAPYWACBLAAD3FgAgTAAA-BYAIE0AAPkWACBOAAD6FgAgTwAA-xYAIFAAAPwWACBRAAD9FgAgUgAA_hYAIL4FAQAAAAHCBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABvwYBAAAAAe4GAQAAAAHvBiAAAAAB8AYBAAAAAfEGAQAAAAHyBgEAAAAB8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAQIAAADiAgAgXwAAhhsAICAEAADtFgAgBQAA7hYAIAYAAO8WACAQAADwFgAgGQAA8RYAID4AAPIWACBIAADzFgAgSQAA9RYAIEoAAPYWACBLAAD3FgAgTAAA-BYAIE0AAPkWACBOAAD6FgAgTwAA-xYAIFAAAPwWACBRAAD9FgAgUgAA_hYAIL4FAQAAAAHCBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABvwYBAAAAAe4GAQAAAAHvBiAAAAAB8AYBAAAAAfEGAQAAAAHyBgEAAAAB8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAQIAAADiAgAgXwAAiBsAIAy-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAe8FAQAAAAGiBgEAAAABowYBAAAAAaQGAACkEAAgpQYBAAAAAaYGAQAAAAGnBgEAAAABAgAAAKMGACBfAACKGwAgAwAAABgAIF8AAIIbACBgAACOGwAgGgAAABgAIAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA1AACnEwAgNgAAqBMAIDcAAKkTACA4AACuEwAgWAAAjhsAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhGAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA1AACnEwAgNgAAqBMAIDcAAKkTACA4AACuEwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEDAAAAFgAgXwAAhBsAIGAAAJEbACAgAAAAFgAgBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIFgAAJEbACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIR4GAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEDAAAAUQAgXwAAhhsAIGAAAJQbACAiAAAAUQAgBAAAthUAIAUAALcVACAGAAC4FQAgEAAAuRUAIBkAALoVACA0AAC9FQAgPgAAuxUAIEgAALwVACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACBYAACUGwAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhAwAAAFEAIF8AAIgbACBgAACXGwAgIgAAAFEAIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgPgAAuxUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgWAAAlxsAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFAAAMUVACBRAADGFQAgUgAAxxUAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAIQMAAACmBgAgXwAAihsAIGAAAJobACAOAAAApgYAIFgAAJobACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh7wUBAL0LACGiBgEAvgsAIaMGAQC9CwAhpAYAAJkQACClBgEAvgsAIaYGAQC-CwAhpwYBAL0LACEMvgUBAL0LACHDBQEAvQsAIcQFAQC-CwAhxgVAAL8LACHHBUAAvwsAIe8FAQC9CwAhogYBAL4LACGjBgEAvQsAIaQGAACZEAAgpQYBAL4LACGmBgEAvgsAIacGAQC9CwAhDb4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB0wUBAAAAAfQFAQAAAAH2BQAAAPYFAvcFAQAAAAH4BUAAAAAB-QVAAAAAAfoFAQAAAAH7BQEAAAABGAgAAI4VACAMAADZFAAgDQAA0RQAIBEAANIUACAcAADYFAAgJQAAzhQAICcAANcUACAqAADaFAAgLgAAyxQAIC8AAMwUACAwAADNFAAgMQAAzxQAIDIAANAUACA0AADTFAAgNQAA1BQAIDYAANUUACA4AADbFAAgvgUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaUGAQAAAAHOBgEAAAAB1QYBAAAAAQIAAAAaACBfAACcGwAgHgYAAOQUACAMAADwFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAqAADxFAAgLgAA3xQAIC8AAOAUACAwAADjFAAgMQAA5RQAIDIAAOYUACA0AADqFAAgNQAA6xQAIDYAAOwUACA6AADeFAAgOwAA4RQAID4AAOkUACBDAADyFAAgRAAA8xQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AAJ4bACAWBwAAkA0AIAkAAI0NACAKAACODQAgCwAAhw0AIA4AAIwNACAPAACKDQAgEAAAkg4AIBkAAIsNACAbAACPDQAgLAAAiA0AIL4FAQAAAAHDBQEAAAABxAUBAAAAAcYFQAAAAAHHBUAAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6gUBAAAAAZYGAQAAAAGmBgEAAAAB1gZAAAAAAQIAAAAoACBfAACgGwAgAwAAABgAIF8AAJwbACBgAACkGwAgGgAAABgAIAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA4AACuEwAgWAAApBsAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIZQGAQC-CwAhpQYBAL4LACHOBgEAvgsAIdUGAQC9CwAhGAgAAI0VACAMAACsEwAgDQAApBMAIBEAAKUTACAcAACrEwAgJQAAoRMAICcAAKoTACAqAACtEwAgLgAAnhMAIC8AAJ8TACAwAACgEwAgMQAAohMAIDIAAKMTACA0AACmEwAgNQAApxMAIDYAAKgTACA4AACuEwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEDAAAAFgAgXwAAnhsAIGAAAKcbACAgAAAAFgAgBgAA-hAAIAwAAIYRACANAAD9EAAgEQAA_hAAIBwAAIURACAlAAD4EAAgJwAAhBEAICoAAIcRACAuAAD1EAAgLwAA9hAAIDAAAPkQACAxAAD7EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgRQAAihEAIFgAAKcbACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIR4GAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAh8gUAAOkQ0AYjjgYBAL0LACGUBgEAvgsAIc4GAQC-CwAh0QYBAL4LACEDAAAAJgAgXwAAoBsAIGAAAKobACAYAAAAJgAgBwAA3QwAIAkAANoMACAKAADbDAAgCwAA1AwAIA4AANkMACAPAADXDAAgEAAAkA4AIBkAANgMACAbAADcDAAgLAAA1QwAIFgAAKobACC-BQEAvQsAIcMFAQC9CwAhxAUBAL4LACHGBUAAvwsAIccFQAC_CwAh5gUBAL0LACHnBQEAvQsAIegFAQC9CwAh6gUBAL0LACGWBgEAvQsAIaYGAQC-CwAh1gZAAL8LACEWBwAA3QwAIAkAANoMACAKAADbDAAgCwAA1AwAIA4AANkMACAPAADXDAAgEAAAkA4AIBkAANgMACAbAADcDAAgLAAA1QwAIL4FAQC9CwAhwwUBAL0LACHEBQEAvgsAIcYFQAC_CwAhxwVAAL8LACHmBQEAvQsAIecFAQC9CwAh6AUBAL0LACHqBQEAvQsAIZYGAQC9CwAhpgYBAL4LACHWBkAAvwsAIRO-BQEAAAABwwUBAAAAAcQFAQAAAAHGBUAAAAABxwVAAAAAAfwFAQAAAAH9BQgAAAAB_gUIAAAAAf8FCAAAAAGABggAAAABgQYIAAAAAYIGCAAAAAGDBggAAAABhAYIAAAAAYUGCAAAAAGGBggAAAABhwYIAAAAAYgGCAAAAAGJBggAAAABGAgAAI4VACAMAADZFAAgDQAA0RQAIBEAANIUACAcAADYFAAgJQAAzhQAICcAANcUACAqAADaFAAgLgAAyxQAIC8AAMwUACAwAADNFAAgMQAAzxQAIDIAANAUACA0AADTFAAgNQAA1BQAIDYAANUUACA3AADWFAAgvgUBAAAAAcYFQAAAAAHHBUAAAAABlAYBAAAAAaUGAQAAAAHOBgEAAAAB1QYBAAAAAQIAAAAaACBfAACsGwAgDwMAAJUOACAHAACTDgAgCQAAlA4AIA0AAJYOACATAACXDgAgGgAAmA4AIBwAAJkOACC-BQEAAAABwgUBAAAAAcMFAQAAAAHEBQEAAAABxQUBAAAAAcYFQAAAAAHHBUAAAAABigYBAAAAAQIAAACdAQAgXwAArhsAICAEAADtFgAgBQAA7hYAIAYAAO8WACAQAADwFgAgGQAA8RYAIDQAAPQWACA-AADyFgAgSAAA8xYAIEkAAPUWACBKAAD2FgAgSwAA9xYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIE8AAPsWACBRAAD9FgAgUgAA_hYAIL4FAQAAAAHCBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABvwYBAAAAAe4GAQAAAAHvBiAAAAAB8AYBAAAAAfEGAQAAAAHyBgEAAAAB8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAQIAAADiAgAgXwAAsBsAICAEAADtFgAgBQAA7hYAIAYAAO8WACAQAADwFgAgGQAA8RYAIDQAAPQWACA-AADyFgAgSAAA8xYAIEkAAPUWACBKAAD2FgAgSwAA9xYAIEwAAPgWACBNAAD5FgAgTgAA-hYAIFAAAPwWACBRAAD9FgAgUgAA_hYAIL4FAQAAAAHCBQEAAAABxgVAAAAAAccFQAAAAAGOBgEAAAABvwYBAAAAAe4GAQAAAAHvBiAAAAAB8AYBAAAAAfEGAQAAAAHyBgEAAAAB8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAQIAAADiAgAgXwAAshsAIB4GAADkFAAgDAAA8BQAIA0AAOcUACARAADoFAAgHAAA7xQAICUAAOIUACAnAADuFAAgKgAA8RQAIC4AAN8UACAvAADgFAAgMAAA4xQAIDEAAOUUACAyAADmFAAgNAAA6hQAIDUAAOsUACA2AADsFAAgNwAA7RQAIDoAAN4UACA7AADhFAAgPgAA6RQAIEMAAPIUACBEAADzFAAgvgUBAAAAAcYFQAAAAAHHBUAAAAAB8gUAAADQBgOOBgEAAAABlAYBAAAAAc4GAQAAAAHRBgEAAAABAgAAAOUEACBfAAC0GwAgHgYAAOQUACAMAADwFAAgDQAA5xQAIBEAAOgUACAcAADvFAAgJQAA4hQAICcAAO4UACAqAADxFAAgLgAA3xQAIC8AAOAUACAwAADjFAAgMQAA5RQAIDIAAOYUACA0AADqFAAgNQAA6xQAIDYAAOwUACA3AADtFAAgOgAA3hQAIDsAAOEUACA-AADpFAAgQwAA8hQAIEUAAPQUACC-BQEAAAABxgVAAAAAAccFQAAAAAHyBQAAANAGA44GAQAAAAGUBgEAAAABzgYBAAAAAdEGAQAAAAECAAAA5QQAIF8AALYbACADAAAAGAAgXwAArBsAIGAAALobACAaAAAAGAAgCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgLwAAnxMAIDAAAKATACAxAACiEwAgMgAAoxMAIDQAAKYTACA1AACnEwAgNgAAqBMAIDcAAKkTACBYAAC6GwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEYCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgLwAAnxMAIDAAAKATACAxAACiEwAgMgAAoxMAIDQAAKYTACA1AACnEwAgNgAAqBMAIDcAAKkTACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQMAAABTACBfAACuGwAgYAAAvRsAIBEAAABTACADAADDDQAgBwAAwQ0AIAkAAMINACANAADEDQAgEwAAxQ0AIBoAAMYNACAcAADHDQAgWAAAvRsAIL4FAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC-CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhigYBAL0LACEPAwAAww0AIAcAAMENACAJAADCDQAgDQAAxA0AIBMAAMUNACAaAADGDQAgHAAAxw0AIL4FAQC9CwAhwgUBAL4LACHDBQEAvQsAIcQFAQC-CwAhxQUBAL0LACHGBUAAvwsAIccFQAC_CwAhigYBAL0LACEDAAAAUQAgXwAAsBsAIGAAAMAbACAiAAAAUQAgBAAAthUAIAUAALcVACAGAAC4FQAgEAAAuRUAIBkAALoVACA0AAC9FQAgPgAAuxUAIEgAALwVACBJAAC-FQAgSgAAvxUAIEsAAMAVACBMAADBFQAgTQAAwhUAIE4AAMMVACBPAADEFQAgUQAAxhUAIFIAAMcVACBYAADAGwAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFEAAMYVACBSAADHFQAgvgUBAL0LACHCBQEAvgsAIcYFQAC_CwAhxwVAAL8LACGOBgEAvQsAIb8GAQC9CwAh7gYBAL0LACHvBiAAnw0AIfAGAQC-CwAh8QYBAL4LACHyBgEAvgsAIfMGAQC-CwAh9AYBAL4LACH1BgEAvgsAIfYGAQC9CwAhAwAAAFEAIF8AALIbACBgAADDGwAgIgAAAFEAIAQAALYVACAFAAC3FQAgBgAAuBUAIBAAALkVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgUAAAxRUAIFEAAMYVACBSAADHFQAgWAAAwxsAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAISAEAAC2FQAgBQAAtxUAIAYAALgVACAQAAC5FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIFAAAMUVACBRAADGFQAgUgAAxxUAIL4FAQC9CwAhwgUBAL4LACHGBUAAvwsAIccFQAC_CwAhjgYBAL0LACG_BgEAvQsAIe4GAQC9CwAh7wYgAJ8NACHwBgEAvgsAIfEGAQC-CwAh8gYBAL4LACHzBgEAvgsAIfQGAQC-CwAh9QYBAL4LACH2BgEAvQsAIQMAAAAWACBfAAC0GwAgYAAAxhsAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBEAACJEQAgWAAAxhsAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQMAAAAWACBfAAC2GwAgYAAAyRsAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDEAAPsQACAyAAD8EAAgNAAAgBEAIDUAAIERACA2AACCEQAgNwAAgxEAIDoAAPQQACA7AAD3EAAgPgAA_xAAIEMAAIgRACBFAACKEQAgWAAAyRsAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMQAA-xAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQ--BQEAAAABxgVAAAAAAccFQAAAAAHqBQEAAAAB9gUAAADFBgL4BUAAAAAB-wUBAAAAAcMGAAAAwwYCxQYBAAAAAcYGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAHKBgEAAAABywZAAAAAAQMAAABRACBfAACIGgAgYAAAzRsAICIAAABRACAEAAC2FQAgBQAAtxUAIAYAALgVACAZAAC6FQAgNAAAvRUAID4AALsVACBIAAC8FQAgSQAAvhUAIEoAAL8VACBLAADAFQAgTAAAwRUAIE0AAMIVACBOAADDFQAgTwAAxBUAIFAAAMUVACBRAADGFQAgUgAAxxUAIFgAAM0bACC-BQEAvQsAIcIFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhvwYBAL0LACHuBgEAvQsAIe8GIACfDQAh8AYBAL4LACHxBgEAvgsAIfIGAQC-CwAh8wYBAL4LACH0BgEAvgsAIfUGAQC-CwAh9gYBAL0LACEgBAAAthUAIAUAALcVACAGAAC4FQAgGQAAuhUAIDQAAL0VACA-AAC7FQAgSAAAvBUAIEkAAL4VACBKAAC_FQAgSwAAwBUAIEwAAMEVACBNAADCFQAgTgAAwxUAIE8AAMQVACBQAADFFQAgUQAAxhUAIFIAAMcVACC-BQEAvQsAIcIFAQC-CwAhxgVAAL8LACHHBUAAvwsAIY4GAQC9CwAhvwYBAL0LACHuBgEAvQsAIe8GIACfDQAh8AYBAL4LACHxBgEAvgsAIfIGAQC-CwAh8wYBAL4LACH0BgEAvgsAIfUGAQC-CwAh9gYBAL0LACEDAAAAGAAgXwAAihoAIGAAANAbACAaAAAAGAAgCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgLwAAnxMAIDAAAKATACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACBYAADQGwAgvgUBAL0LACHGBUAAvwsAIccFQAC_CwAhlAYBAL4LACGlBgEAvgsAIc4GAQC-CwAh1QYBAL0LACEYCAAAjRUAIAwAAKwTACANAACkEwAgEQAApRMAIBwAAKsTACAlAAChEwAgJwAAqhMAICoAAK0TACAuAACeEwAgLwAAnxMAIDAAAKATACAyAACjEwAgNAAAphMAIDUAAKcTACA2AACoEwAgNwAAqRMAIDgAAK4TACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACGUBgEAvgsAIaUGAQC-CwAhzgYBAL4LACHVBgEAvQsAIQMAAAAWACBfAACMGgAgYAAA0xsAICAAAAAWACAGAAD6EAAgDAAAhhEAIA0AAP0QACARAAD-EAAgHAAAhREAICUAAPgQACAnAACEEQAgKgAAhxEAIC4AAPUQACAvAAD2EAAgMAAA-RAAIDIAAPwQACA0AACAEQAgNQAAgREAIDYAAIIRACA3AACDEQAgOgAA9BAAIDsAAPcQACA-AAD_EAAgQwAAiBEAIEQAAIkRACBFAACKEQAgWAAA0xsAIL4FAQC9CwAhxgVAAL8LACHHBUAAvwsAIfIFAADpENAGI44GAQC9CwAhlAYBAL4LACHOBgEAvgsAIdEGAQC-CwAhHgYAAPoQACAMAACGEQAgDQAA_RAAIBEAAP4QACAcAACFEQAgJQAA-BAAICcAAIQRACAqAACHEQAgLgAA9RAAIC8AAPYQACAwAAD5EAAgMgAA_BAAIDQAAIARACA1AACBEQAgNgAAghEAIDcAAIMRACA6AAD0EAAgOwAA9xAAID4AAP8QACBDAACIEQAgRAAAiREAIEUAAIoRACC-BQEAvQsAIcYFQAC_CwAhxwVAAL8LACHyBQAA6RDQBiOOBgEAvQsAIZQGAQC-CwAhzgYBAL4LACHRBgEAvgsAIQIDAAIHAAYTBAYDBQoEBg0BEBEFFQA4GZQCEzSXAik-lQIuSJYCLkmYAilKmgI1S5sCFEycAhRNngI2TqICN0-jAhpQpAIaUaUCL1KmAjEBAwACAQMAAgoDAAIHAAYJAAgNiAILEYkCEBUANCKNAhokigIRRosCKUeMAiUYBs4BAQzfAQ0N0QELEdIBEBUAMxzeARclzAEPJ90BGCrgAQwuxgEJL8cBHTDNAQoxzwEFMtABEzTZASk12gERNtsBEjfcASU6FQc7ywEiPtYBLkPkAS9E7wEaRfABGgMHFwYVAC05GwgTCBwHDLEBDQ2fAQsRoAEQFQAsHLABFyWaAQ8nrwEYKrIBDC4gCS-YAR0wmQEKMZsBBTKeARM0pAEpNaoBETarARI3rgElOLMBGgUHAAYJAAgNkwELDyQKFQAoBgcABgkACAolCQ0pCxGQARAVACcMBwAGCYwBCAqNAQkLLQwOAA8PAAoQAAUVACYZABMbAA4siAEkLYoBJQUHgwEGCYQBCCgADSkACysAIgUHfgYJfwgLLgwVACEbMA4GDDQNDXMLFQAgHHgXJTgPJ3cYCAcABglqCA05CxE9EBUAHxsADiRCESZsHQUHAAYJPggOAA8PAAoQAAUGBwAGCUMIDgAPEAAFFQAcI0cSBAcABgloCBIAERkAEwkDAAIHAAYJSAgNSQsTShIVABsaThQcWBciXhoEFgAVFwACGFICGVQTAhRPFBUAFgEUUAAFBwAGCQAIGQATGwAOHQAYBQcABgkACBUAGRsADhxZFwEcWgAHEGEFGF8CGWATHgAGHwAGIAACIWIIBQ1jABNkABplABxmACJnAAEjaQAEBwAGCW0IFQAeJW4PASVvAAMNcAARcQAkcgAFDHkADXsAHH0AJXoAJ3wAAQuAAQADBwAGFQAjKoEBDAEqggEAASkACwQHAAYJiwEIEAAFKQALAguOAQAsjwEAAg2RAQARkgEAAg2VAQAPlAEABgcABgmpAQgQqAEFFgAqGKcBAjMAAgIUpQEpFQArARSmAQARDMIBAA26AQARuwEAHMEBACW3AQAnwAEAKsMBAC60AQAvtQEAMLYBADG4AQAyuQEANLwBADW9AQA2vgEAN78BADjEAQABOcUBAAMH2AEGPAACPdcBAgUHAAYVADI_AAJB6AEwQuwBMQFAAC8CAwACQAAvAkHtAQBC7gEAFwb3AQAMgwIADfoBABH7AQAcggIAJfUBACeBAgAqhAIALvIBAC_zAQAw9gEAMfgBADL5AQA0_QEANf4BADb_AQA3gAIAOvEBADv0AQA-_AEAQ4UCAESGAgBFhwIABg2OAgARjwIAIpMCACSQAgBGkQIAR5ICAAEzAAIBFwACAQMAAhAEpwIABagCAAapAgAQqgIAGasCADSuAgA-rAIASK0CAEmvAgBLsAIATLECAE6yAgBPswIAULQCAFG1AgBStgIAAAIDAAIHAAYCAwACBwAGAxUAPWUAPmYAPwAAAAMVAD1lAD5mAD8BKQALASkACwMVAERlAEVmAEYAAAADFQBEZQBFZgBGAAADFQBLZQBMZgBNAAAAAxUAS2UATGYATQEDAAIBAwACAxUAUmUAU2YAVAAAAAMVAFJlAFNmAFQBAwACAQMAAgMVAFllAFpmAFsAAAADFQBZZQBaZgBbAAAAAxUAYWUAYmYAYwAAAAMVAGFlAGJmAGMBAwACAQMAAgMVAGhlAGlmAGoAAAADFQBoZQBpZgBqAgcABgnfAwgCBwAGCeUDCAMVAG9lAHBmAHEAAAADFQBvZQBwZgBxAQcABgEHAAYFFQB2ZQB5ZgB65wEAd-gBAHgAAAAAAAUVAHZlAHlmAHrnAQB36AEAeAMHAAYJAAgKjQQJAwcABgkACAqTBAkFFQB_ZQCCAWYAgwHnAQCAAegBAIEBAAAAAAAFFQB_ZQCCAWYAgwHnAQCAAegBAIEBCAcABgmlBAgKpgQJDgAPDwAKEAAFGQATGwAOCAcABgmsBAgKrQQJDgAPDwAKEAAFGQATGwAOAxUAiAFlAIkBZgCKAQAAAAMVAIgBZQCJAWYAigEBCL8EBwEIxQQHAxUAjwFlAJABZgCRAQAAAAMVAI8BZQCQAWYAkQEBB9cEBgEH3QQGAxUAlgFlAJcBZgCYAQAAAAMVAJYBZQCXAWYAmAEAAAMVAJ0BZQCeAWYAnwEAAAADFQCdAWUAngFmAJ8BAweIBQY8AAI9hwUCAwePBQY8AAI9jgUCAxUApAFlAKUBZgCmAQAAAAMVAKQBZQClAWYApgEHEKMFBRihBQIZogUTHgAGHwAGIAACIaQFCAcQrAUFGKoFAhmrBRMeAAYfAAYgAAIhrQUIAxUAqwFlAKwBZgCtAQAAAAMVAKsBZQCsAWYArQECBwAGPwACAgcABj8AAgMVALIBZQCzAWYAtAEAAAADFQCyAWUAswFmALQBAUAALwFAAC8DFQC5AWUAugFmALsBAAAAAxUAuQFlALoBZgC7AQIDAAJAAC8CAwACQAAvAxUAwAFlAMEBZgDCAQAAAAMVAMABZQDBAWYAwgEDBwAGCQAIGwAOAwcABgkACBsADgUVAMcBZQDKAWYAywHnAQDIAegBAMkBAAAAAAAFFQDHAWUAygFmAMsB5wEAyAHoAQDJAQUHAAYJAAgZABMbAA4dABgFBwAGCQAIGQATGwAOHQAYBRUA0AFlANMBZgDUAecBANEB6AEA0gEAAAAAAAUVANABZQDTAWYA1AHnAQDRAegBANIBAAADFQDZAWUA2gFmANsBAAAAAxUA2QFlANoBZgDbAQAAAxUA4AFlAOEBZgDiAQAAAAMVAOABZQDhAWYA4gECBwAGCQAIAgcABgkACAUVAOcBZQDqAWYA6wHnAQDoAegBAOkBAAAAAAAFFQDnAWUA6gFmAOsB5wEA6AHoAQDpAQUH9QYGCfYGCCgADSkACysAIgUH_AYGCf0GCCgADSkACysAIgMVAPABZQDxAWYA8gEAAAADFQDwAWUA8QFmAPIBAweQBwYJkQcIG48HDgMHmAcGCZkHCBuXBw4DFQD3AWUA-AFmAPkBAAAAAxUA9wFlAPgBZgD5AQQHAAYJqwcIGwAOJqwHHQQHAAYJsgcIGwAOJrMHHQUVAP4BZQCBAmYAggLnAQD_AegBAIACAAAAAAAFFQD-AWUAgQJmAIIC5wEA_wHoAQCAAgAAAxUAhwJlAIgCZgCJAgAAAAMVAIcCZQCIAmYAiQIBFwACARcAAgMVAI4CZQCPAmYAkAIAAAADFQCOAmUAjwJmAJACBBYAFRcAAhj1BwIZ9gcTBBYAFRcAAhj8BwIZ_QcTAxUAlQJlAJYCZgCXAgAAAAMVAJUCZQCWAmYAlwIDAwACBwAGCY8ICAMDAAIHAAYJlQgIAxUAnAJlAJ0CZgCeAgAAAAMVAJwCZQCdAmYAngIEBwAGCacICBAABSkACwQHAAYJrQgIEAAFKQALBRUAowJlAKYCZgCnAucBAKQC6AEApQIAAAAAAAUVAKMCZQCmAmYApwLnAQCkAugBAKUCBgcABgnBCAgQwAgFFgAqGL8IAjMAAgYHAAYJyQgIEMgIBRYAKhjHCAIzAAIDFQCsAmUArQJmAK4CAAAAAxUArAJlAK0CZgCuAgQHAAYJ2wgIDgAPEAAFBAcABgnhCAgOAA8QAAUDFQCzAmUAtAJmALUCAAAAAxUAswJlALQCZgC1AgQHAAYJ8wgIEgARGQATBAcABgn5CAgSABEZABMDFQC6AmUAuwJmALwCAAAAAxUAugJlALsCZgC8AgUHAAYJiwkIDgAPDwAKEAAFBQcABgmRCQgOAA8PAAoQAAUDFQDBAmUAwgJmAMMCAAAAAxUAwQJlAMICZgDDAgEzAAIBMwACAxUAyAJlAMkCZgDKAgAAAAMVAMgCZQDJAmYAygIDAwACBwAGCQAIAwMAAgcABgkACAMVAM8CZQDQAmYA0QIAAAADFQDPAmUA0AJmANECUwIBVLcCAVW4AgFWuQIBV7oCAVm8AgFavgI5W78COlzBAgFdwwI5XsQCO2HFAgFixgIBY8cCOWfKAjxoywJAacwCJGrNAiRrzgIkbM8CJG3QAiRu0gIkb9QCOXDVAkFx1wIkctkCOXPaAkJ02wIkddwCJHbdAjl34AJDeOECR3njAgJ65AICe-YCAnznAgJ96AICfuoCAn_sAjmAAe0CSIEB7wICggHxAjmDAfICSYQB8wIChQH0AgKGAfUCOYcB-AJKiAH5Ak6JAfoCA4oB-wIDiwH8AgOMAf0CA40B_gIDjgGAAwOPAYIDOZABgwNPkQGFAwOSAYcDOZMBiANQlAGJAwOVAYoDA5YBiwM5lwGOA1GYAY8DVZkBkAMEmgGRAwSbAZIDBJwBkwMEnQGUAwSeAZYDBJ8BmAM5oAGZA1ahAZsDBKIBnQM5owGeA1ekAZ8DBKUBoAMEpgGhAzmnAaQDWKgBpQNcqQGnA12qAagDXasBqwNdrAGsA12tAa0DXa4BrwNdrwGxAzmwAbIDXrEBtANdsgG2AzmzAbcDX7QBuANdtQG5A122AboDObcBvQNguAG-A2S5Ab8DN7oBwAM3uwHBAze8AcIDN70BwwM3vgHFAze_AccDOcAByANlwQHKAzfCAcwDOcMBzQNmxAHOAzfFAc8DN8YB0AM5xwHTA2fIAdQDa8kB1QMdygHWAx3LAdcDHcwB2AMdzQHZAx3OAdsDHc8B3QM50AHeA2zRAeEDHdIB4wM50wHkA23UAeYDHdUB5wMd1gHoAznXAesDbtgB7ANy2QHtAyLaAe4DItsB7wMi3AHwAyLdAfEDIt4B8wMi3wH1AzngAfYDc-EB-AMi4gH6AznjAfsDdOQB_AMi5QH9AyLmAf4DOekBgQR16gGCBHvrAYMECuwBhAQK7QGFBAruAYYECu8BhwQK8AGJBArxAYsEOfIBjAR88wGPBAr0AZEEOfUBkgR99gGUBAr3AZUECvgBlgQ5-QGZBH76AZoEhAH7AZsEC_wBnAQL_QGdBAv-AZ4EC_8BnwQLgAKhBAuBAqMEOYICpASFAYMCqAQLhAKqBDmFAqsEhgGGAq4EC4cCrwQLiAKwBDmJArMEhwGKArQEiwGLArUECIwCtgQIjQK3BAiOArgECI8CuQQIkAK7BAiRAr0EOZICvgSMAZMCwQQIlALDBDmVAsQEjQGWAsYECJcCxwQImALIBDmZAssEjgGaAswEkgGbAs0EB5wCzgQHnQLPBAeeAtAEB58C0QQHoALTBAehAtUEOaIC1gSTAaMC2QQHpALbBDmlAtwElAGmAt4EB6cC3wQHqALgBDmpAuMElQGqAuQEmQGrAuYEBqwC5wQGrQLpBAauAuoEBq8C6wQGsALtBAaxAu8EObIC8ASaAbMC8gQGtAL0BDm1AvUEmwG2AvYEBrcC9wQGuAL4BDm5AvsEnAG6AvwEoAG7Av0ELrwC_gQuvQL_BC6-AoAFLr8CgQUuwAKDBS7BAoUFOcIChgWhAcMCigUuxAKMBTnFAo0FogHGApAFLscCkQUuyAKSBTnJApUFowHKApYFpwHLApcFGswCmAUazQKZBRrOApoFGs8CmwUa0AKdBRrRAp8FOdICoAWoAdMCpgUa1AKoBTnVAqkFqQHWAq4FGtcCrwUa2AKwBTnZArMFqgHaArQFrgHbArUFL9wCtgUv3QK3BS_eArgFL98CuQUv4AK7BS_hAr0FOeICvgWvAeMCwAUv5ALCBTnlAsMFsAHmAsQFL-cCxQUv6ALGBTnpAskFsQHqAsoFtQHrAssFMOwCzAUw7QLNBTDuAs4FMO8CzwUw8ALRBTDxAtMFOfIC1AW2AfMC1gUw9ALYBTn1AtkFtwH2AtoFMPcC2wUw-ALcBTn5At8FuAH6AuAFvAH7AuEFMfwC4gUx_QLjBTH-AuQFMf8C5QUxgAPnBTGBA-kFOYID6gW9AYMD7AUxhAPuBTmFA-8FvgGGA_AFMYcD8QUxiAPyBTmJA_UFvwGKA_YFwwGLA_cFGIwD-AUYjQP5BRiOA_oFGI8D-wUYkAP9BRiRA_8FOZIDgAbEAZMDggYYlAOEBjmVA4UGxQGWA4YGGJcDhwYYmAOIBjmZA4sGxgGaA4wGzAGbA40GF5wDjgYXnQOPBheeA5AGF58DkQYXoAOTBhehA5UGOaIDlgbNAaMDmAYXpAOaBjmlA5sGzgGmA5wGF6cDnQYXqAOeBjmpA6EGzwGqA6IG1QGrA6QGKqwDpQYqrQOoBiquA6kGKq8DqgYqsAOsBiqxA64GObIDrwbWAbMDsQYqtAOzBjm1A7QG1wG2A7UGKrcDtgYquAO3Bjm5A7oG2AG6A7sG3AG7A70GFbwDvgYVvQPBBhW-A8IGFb8DwwYVwAPFBhXBA8cGOcIDyAbdAcMDygYVxAPMBjnFA80G3gHGA84GFccDzwYVyAPQBjnJA9MG3wHKA9QG4wHLA9UGCcwD1gYJzQPXBgnOA9gGCc8D2QYJ0APbBgnRA90GOdID3gbkAdMD4AYJ1APiBjnVA-MG5QHWA-QGCdcD5QYJ2APmBjnZA-kG5gHaA-oG7AHbA-sGDNwD7AYM3QPtBgzeA-4GDN8D7wYM4APxBgzhA_MGOeID9AbtAeMD-AYM5AP6BjnlA_sG7gHmA_4GDOcD_wYM6AOABznpA4MH7wHqA4QH8wHrA4UHDewDhgcN7QOHBw3uA4gHDe8DiQcN8AOLBw3xA40HOfIDjgf0AfMDkwcN9AOVBzn1A5YH9QH2A5oHDfcDmwcN-AOcBzn5A58H9gH6A6AH-gH7A6EHD_wDogcP_QOjBw_-A6QHD_8DpQcPgASnBw-BBKkHOYIEqgf7AYMErgcPhASwBzmFBLEH_AGGBLQHD4cEtQcPiAS2BzmJBLkH_QGKBLoHgwKLBLwHDowEvQcOjQS_Bw6OBMAHDo8EwQcOkATDBw6RBMUHOZIExgeEApMEyAcOlATKBzmVBMsHhQKWBMwHDpcEzQcOmATOBzmZBNEHhgKaBNIHigKbBNQHNpwE1Qc2nQTXBzaeBNgHNp8E2Qc2oATbBzahBN0HOaIE3geLAqME4Ac2pATiBzmlBOMHjAKmBOQHNqcE5Qc2qATmBzmpBOkHjQKqBOoHkQKrBOsHFKwE7AcUrQTtBxSuBO4HFK8E7wcUsATxBxSxBPMHObIE9AeSArME-AcUtAT6Bzm1BPsHkwK2BP4HFLcE_wcUuASACDm5BIMIlAK6BIQImAK7BIUIE7wEhggTvQSHCBO-BIgIE78EiQgTwASLCBPBBI0IOcIEjgiZAsMEkQgTxASTCDnFBJQImgLGBJYIE8cElwgTyASYCDnJBJsImwLKBJwInwLLBJ0IJcwEngglzQSfCCXOBKAIJc8EoQgl0ASjCCXRBKUIOdIEpgigAtMEqQgl1ASrCDnVBKwIoQLWBK4IJdcErwgl2ASwCDnZBLMIogLaBLQIqALbBLUIKdwEtggp3QS3CCneBLgIKd8EuQgp4AS7CCnhBL0IOeIEvgipAuMEwwgp5ATFCDnlBMYIqgLmBMoIKecEywgp6ATMCDnpBM8IqwLqBNAIrwLrBNEIEewE0ggR7QTTCBHuBNQIEe8E1QgR8ATXCBHxBNkIOfIE2giwAvME3QgR9ATfCDn1BOAIsQL2BOIIEfcE4wgR-ATkCDn5BOcIsgL6BOgItgL7BOkIEvwE6ggS_QTrCBL-BOwIEv8E7QgSgAXvCBKBBfEIOYIF8gi3AoMF9QgShAX3CDmFBfgIuAKGBfoIEocF-wgSiAX8CDmJBf8IuQKKBYAJvQKLBYEJEIwFggkQjQWDCRCOBYQJEI8FhQkQkAWHCRCRBYkJOZIFigm-ApMFjQkQlAWPCTmVBZAJvwKWBZIJEJcFkwkQmAWUCTmZBZcJwAKaBZgJxAKbBZoJNZwFmwk1nQWdCTWeBZ4JNZ8Fnwk1oAWhCTWhBaMJOaIFpAnFAqMFpgk1pAWoCTmlBakJxgKmBaoJNacFqwk1qAWsCTmpBa8JxwKqBbAJywKrBbEJBawFsgkFrQWzCQWuBbQJBa8FtQkFsAW3CQWxBbkJObIFugnMArMFvAkFtAW-CTm1Bb8JzQK2BcAJBbcFwQkFuAXCCTm5BcUJzgK6BcYJ0gI"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
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
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
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
      req.authUser = user;
      res.locals.authUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var requireAdminRole = () => requireSessionRole("ADMIN");

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

// src/app/module/classroom/classroom.service.ts
function createHttpError(statusCode, message) {
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
    throw createHttpError(403, "Only institution academic admins can access this resource");
  }
  return adminProfile;
}
function assertCanManageRooms(adminRole) {
  if (adminRole !== AdminRole.FACULTYADMIN && adminRole !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError(403, "Only faculty and institution admins can manage rooms");
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
    throw createHttpError(409, "A room with this room number and floor already exists");
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
    throw createHttpError(404, "Room not found for this institution");
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
    throw createHttpError(409, "A room with this room number and floor already exists");
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
    throw createHttpError(404, "Room not found for this institution");
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
    throw createHttpError(409, "Cannot delete room because routines are assigned to it");
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
import { z } from "zod";
var uuidSchema = z.uuid("Please provide a valid id");
var ClassroomValidation = {
  createClassroomSchema: z.object({
    body: z.object({
      name: z.string("Room name must be a string").trim().max(120).optional(),
      roomNo: z.string("Room number is required").trim().min(1).max(40),
      floor: z.string("Floor is required").trim().min(1).max(40),
      capacity: z.number("Capacity must be a number").int().positive().max(2e3),
      roomType: z.enum(ClassRoomType)
    })
  }),
  updateClassroomSchema: z.object({
    params: z.object({
      classroomId: uuidSchema
    }),
    body: z.object({
      name: z.string("Room name must be a string").trim().max(120).optional(),
      roomNo: z.string("Room number must be a string").trim().min(1).max(40).optional(),
      floor: z.string("Floor must be a string").trim().min(1).max(40).optional(),
      capacity: z.number("Capacity must be a number").int().positive().max(2e3).optional(),
      roomType: z.enum(ClassRoomType).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteClassroomSchema: z.object({
    params: z.object({
      classroomId: uuidSchema
    })
  })
};

// src/app/module/classroom/classroom.route.ts
var router = Router();
router.get("/", requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"), ClassroomController.listClassrooms);
router.post(
  "/",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(ClassroomValidation.createClassroomSchema),
  ClassroomController.createClassroom
);
router.patch(
  "/:classroomId",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(ClassroomValidation.updateClassroomSchema),
  ClassroomController.updateClassroom
);
router.delete(
  "/:classroomId",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(ClassroomValidation.deleteClassroomSchema),
  ClassroomController.deleteClassroom
);
var ClassroomRouter = router;

// src/app/module/department/department.route.ts
import { Router as Router2 } from "express";

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
    enabled: true
  },
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
function createHttpError2(statusCode, message) {
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
      institutionId: true
    }
  });
  if (!adminProfile?.institutionId) {
    throw createHttpError2(403, "Only institution academic admins can access this resource");
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
    throw createHttpError2(403, "Only department-level academic admins can access this resource");
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
      throw createHttpError2(404, "Department not found for this institution");
    }
    return {
      institutionId: adminProfile.institutionId,
      departmentId: byId.id
    };
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
    throw createHttpError2(
      404,
      "No department found for this institution. Ask faculty admin to create one first"
    );
  }
  if (departments.length > 1) {
    if (canAccessForUniversity || canAccessForNonUniversity) {
      return {
        institutionId: adminProfile.institutionId,
        departmentId: departments[0].id
      };
    }
    throw createHttpError2(400, "Multiple departments found. Please provide departmentId");
  }
  return {
    institutionId: adminProfile.institutionId,
    departmentId: departments[0].id
  };
}
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
    throw createHttpError2(403, "Only institution academic admins can access this resource");
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
    throw createHttpError2(404, "Institution not found");
  }
  const isUniversityInstitution = institution.type === InstitutionType.UNIVERSITY;
  const isDepartmentAdmin = adminProfile.role === AdminRole.DEPARTMENTADMIN;
  const isFacultyAdmin = adminProfile.role === AdminRole.FACULTYADMIN;
  const isInstitutionAdmin = adminProfile.role === AdminRole.INSTITUTIONADMIN;
  const canAccessForUniversity = isUniversityInstitution && (isInstitutionAdmin || isFacultyAdmin);
  const canAccessForNonUniversity = !isUniversityInstitution && isInstitutionAdmin;
  if (!isDepartmentAdmin && !canAccessForUniversity && !canAccessForNonUniversity) {
    throw createHttpError2(403, "Only department-level academic admins can access this resource");
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
    throw createHttpError2(403, "Only institution academic admins can access this resource");
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
    throw createHttpError2(400, "Class slot time must be in HH:mm format");
  }
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  if (start >= end) {
    throw createHttpError2(400, "Class slot end time must be later than start time");
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
    throw createHttpError2(404, "Semester not found for this institution");
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
    throw createHttpError2(404, "Class slot not found for this department");
  }
  if (!selectedRegistration) {
    throw createHttpError2(404, "Course registration not found for this department");
  }
  if (!selectedClassroom) {
    throw createHttpError2(404, "Room not found for this institution");
  }
  if (!selectedSchedule.semesterId || selectedSchedule.semesterId !== selectedRegistration.semesterId) {
    throw createHttpError2(
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
    throw createHttpError2(
      409,
      "This section already has another class assigned in an overlapping time slot"
    );
  }
  const teacherConflict = overlapping.find(
    (item) => item.courseRegistration.teacherProfileId === selectedRegistration.teacherProfileId
  );
  if (teacherConflict) {
    throw createHttpError2(
      409,
      "The assigned teacher already has another class in an overlapping time slot"
    );
  }
  const roomConflict = overlapping.find((item) => item.classRoom.id === classRoomId);
  if (roomConflict) {
    throw createHttpError2(409, "Another section is already assigned in this room for an overlapping slot");
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
    throw createHttpError2(403, "Only department admins can access this resource");
  }
  const normalizedFullName = payload.fullName?.trim();
  const normalizedShortName = payload.shortName?.trim() || null;
  const normalizedDescription = payload.description?.trim() || null;
  const hasDepartmentMutation = Boolean(payload.fullName || payload.shortName || payload.description) || Boolean(payload.departmentId);
  const savedDepartment = await prisma.$transaction(async (trx) => {
    let nextDepartment = null;
    if (hasDepartmentMutation) {
      if (!normalizedFullName) {
        throw createHttpError2(400, "Department full name is required when updating department details");
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
          throw createHttpError2(
            404,
            "No faculty found for this institution. Ask faculty admin to create a faculty first"
          );
        }
        if (faculties.length > 1) {
          throw createHttpError2(
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
            throw createHttpError2(404, "Department not found for this institution");
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
          throw createHttpError2(400, "Multiple departments found. Please provide departmentId");
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
    throw createHttpError2(400, "endDate must be greater than startDate");
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
    throw createHttpError2(404, "Semester not found");
  }
  const nextStartDate = payload.startDate ? new Date(payload.startDate) : semester.startDate;
  const nextEndDate = payload.endDate ? new Date(payload.endDate) : semester.endDate;
  if (nextEndDate.getTime() <= nextStartDate.getTime()) {
    throw createHttpError2(400, "endDate must be greater than startDate");
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
    throw createHttpError2(
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
    throw createHttpError2(
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
    throw createHttpError2(404, "Class slot not found for this department");
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
    throw createHttpError2(
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
    throw createHttpError2(404, "Class slot not found for this department");
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
    throw createHttpError2(409, "Cannot delete class slot because routines are assigned to it");
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
    throw createHttpError2(
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
    throw createHttpError2(
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
    throw createHttpError2(404, "Routine not found for this department");
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
    throw createHttpError2(
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
    throw createHttpError2(404, "Routine not found for this department");
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
    throw createHttpError2(404, "Batch not found");
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
    throw createHttpError2(404, "Batch not found");
  }
  const sectionCount = await prisma.section.count({
    where: {
      batchId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    }
  });
  if (sectionCount > 0) {
    throw createHttpError2(409, "Cannot delete batch with assigned sections");
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
    throw createHttpError2(404, "Semester not found for this institution");
  }
  if (!batch) {
    throw createHttpError2(404, "Batch not found for this department");
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
    throw createHttpError2(404, "Section not found");
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
      throw createHttpError2(404, "Semester not found for this institution");
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
      throw createHttpError2(404, "Batch not found for this department");
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
    throw createHttpError2(404, "Section not found");
  }
  const registrationCount = await prisma.courseRegistration.count({
    where: {
      sectionId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    }
  });
  if (registrationCount > 0) {
    throw createHttpError2(409, "Cannot delete section with course registrations");
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
    throw createHttpError2(404, "Program not found");
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
      throw createHttpError2(404, "Program not found for this department");
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
    throw createHttpError2(404, "Course not found");
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
      throw createHttpError2(404, "Program not found for this department");
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
    throw createHttpError2(404, "Course not found");
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
    throw createHttpError2(404, "Course not found for this department");
  }
  if (!section) {
    throw createHttpError2(404, "Section not found for this department");
  }
  if (!teacher) {
    throw createHttpError2(404, "Teacher not found for this department");
  }
  if (!semester) {
    throw createHttpError2(404, "Semester not found for this institution");
  }
  if (section.semesterId !== payload.semesterId) {
    throw createHttpError2(400, "Selected section does not belong to the selected semester");
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
    throw createHttpError2(404, "Course not found for this department");
  }
  if (!student) {
    throw createHttpError2(404, "Student not found for this department");
  }
  if (!section) {
    throw createHttpError2(404, "Section not found for this department");
  }
  if (!semester) {
    throw createHttpError2(404, "Semester not found for this institution");
  }
  if (section.semesterId !== payload.semesterId) {
    throw createHttpError2(400, "Selected section does not belong to the selected semester");
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
      throw createHttpError2(404, "Program not found for this department");
    }
  }
  if (course.programId && course.programId !== resolvedProgramId) {
    throw createHttpError2(400, "Selected course does not belong to the selected program");
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
    throw createHttpError2(
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
    throw createHttpError2(409, "Student is already registered for this course in the selected semester");
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
    throw createHttpError2(404, "Course registration not found");
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
    throw createHttpError2(404, "Course not found for this department");
  }
  if (!student) {
    throw createHttpError2(404, "Student not found for this department");
  }
  if (!section) {
    throw createHttpError2(404, "Section not found for this department");
  }
  if (!semester) {
    throw createHttpError2(404, "Semester not found for this institution");
  }
  if (section.semesterId !== nextSemesterId) {
    throw createHttpError2(400, "Selected section does not belong to the selected semester");
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
      throw createHttpError2(404, "Program not found for this department");
    }
  }
  if (course.programId && course.programId !== resolvedProgramId) {
    throw createHttpError2(400, "Selected course does not belong to the selected program");
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
    throw createHttpError2(
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
    throw createHttpError2(409, "Student is already registered for this course in the selected semester");
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
    throw createHttpError2(404, "Course registration not found");
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
    throw createHttpError2(500, "Failed to create teacher account");
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
    throw createHttpError2(404, "Teacher not found");
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
    throw createHttpError2(500, "Failed to create student account");
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
    throw createHttpError2(404, "Student not found");
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
    throw createHttpError2(404, "Teacher not found for this institution");
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
    throw createHttpError2(404, "Student not found for this institution");
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
    throw createHttpError2(400, "Target institution must be different from source institution");
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
    throw createHttpError2(404, "Target institution not found");
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
      throw createHttpError2(404, "Student profile not found for this institution");
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
      throw createHttpError2(409, "A pending transfer request already exists for this student");
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
    throw createHttpError2(404, "Teacher profile not found for this institution");
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
    throw createHttpError2(409, "A pending transfer request already exists for this teacher");
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
    throw createHttpError2(404, "Transfer request not found");
  }
  if (request.status !== InstitutionTransferStatus.PENDING) {
    throw createHttpError2(400, "Transfer request has already been reviewed");
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
      throw createHttpError2(400, "Teacher profile is missing for this transfer request");
    }
    const targetDepartmentId = payload.targetDepartmentId?.trim();
    if (!targetDepartmentId) {
      throw createHttpError2(400, "targetDepartmentId is required to accept teacher transfer");
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
      throw createHttpError2(404, "Target department not found for target institution");
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
          id: request.teacherProfile.userId
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
    throw createHttpError2(400, "Student profile is missing for this transfer request");
  }
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
        id: request.studentProfile.userId
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
    throw createHttpError2(404, "Student admission application not found");
  }
  if (application.status === StudentAdmissionApplicationStatus.APPROVED || application.status === StudentAdmissionApplicationStatus.REJECTED) {
    throw createHttpError2(400, "Application has already been reviewed");
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
    throw createHttpError2(400, "studentsId is required for approval");
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
    throw createHttpError2(400, "monthlyFeeAmount cannot exceed totalFeeAmount");
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
    throw createHttpError2(404, "Semester not found for this institution");
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
    throw createHttpError2(404, "Student not found for this department");
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
import { z as z2 } from "zod";
var uuidSchema2 = z2.uuid("Please provide a valid id");
var timeStringSchema = z2.string("Time must be a string").regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format");
var passwordSchema = z2.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
var DepartmentValidation = {
  updateDepartmentProfileSchema: z2.object({
    body: z2.object({
      fullName: z2.string("Full name must be a string").trim().min(2).max(120).optional(),
      shortName: z2.string("Short name must be a string").trim().min(2).max(30).optional(),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema2.optional(),
      name: z2.string("name must be a string").trim().min(2).max(120).optional(),
      image: z2.url("image must be a valid URL").trim().optional(),
      contactNo: z2.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z2.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z2.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z2.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z2.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createSemesterSchema: z2.object({
    body: z2.object({
      name: z2.string("Semester name is required").trim().min(2).max(80),
      startDate: z2.iso.datetime("startDate must be a valid ISO datetime"),
      endDate: z2.iso.datetime("endDate must be a valid ISO datetime")
    })
  }),
  createScheduleSchema: z2.object({
    body: z2.object({
      name: z2.string("Class slot name is required").trim().min(2).max(120),
      description: z2.string("Description must be a string").trim().max(500).optional(),
      semesterId: uuidSchema2,
      startTime: timeStringSchema,
      endTime: timeStringSchema,
      status: z2.enum(SlotStatus).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateScheduleSchema: z2.object({
    params: z2.object({
      scheduleId: uuidSchema2
    }),
    body: z2.object({
      name: z2.string("Class slot name must be a string").trim().min(2).max(120).optional(),
      description: z2.string("Description must be a string").trim().max(500).optional(),
      semesterId: uuidSchema2.optional(),
      startTime: timeStringSchema.optional(),
      endTime: timeStringSchema.optional(),
      status: z2.enum(SlotStatus).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteScheduleSchema: z2.object({
    params: z2.object({
      scheduleId: uuidSchema2
    })
  }),
  updateSemesterSchema: z2.object({
    params: z2.object({
      semesterId: uuidSchema2
    }),
    body: z2.object({
      name: z2.string("Semester name must be a string").trim().min(2).max(80).optional(),
      startDate: z2.iso.datetime("startDate must be a valid ISO datetime").optional(),
      endDate: z2.iso.datetime("endDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createBatchSchema: z2.object({
    body: z2.object({
      name: z2.string("Batch name is required").trim().min(1).max(80),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateBatchSchema: z2.object({
    params: z2.object({
      batchId: uuidSchema2
    }),
    body: z2.object({
      name: z2.string("Batch name must be a string").trim().min(1).max(80).optional(),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteBatchSchema: z2.object({
    params: z2.object({
      batchId: uuidSchema2
    })
  }),
  createSectionSchema: z2.object({
    body: z2.object({
      name: z2.string("Section name is required").trim().min(1).max(80),
      semesterId: uuidSchema2,
      batchId: uuidSchema2,
      sectionCapacity: z2.number().int().positive().max(500).optional(),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateSectionSchema: z2.object({
    params: z2.object({
      sectionId: uuidSchema2
    }),
    body: z2.object({
      name: z2.string("Section name must be a string").trim().min(1).max(80).optional(),
      semesterId: uuidSchema2.optional(),
      batchId: uuidSchema2.optional(),
      sectionCapacity: z2.number().int().positive().max(500).optional(),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteSectionSchema: z2.object({
    params: z2.object({
      sectionId: uuidSchema2
    })
  }),
  createProgramSchema: z2.object({
    body: z2.object({
      title: z2.string("Program title is required").trim().min(2).max(120),
      shortTitle: z2.string("Short title must be a string").trim().min(2).max(30).optional(),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z2.number().positive().max(500).optional(),
      cost: z2.number().nonnegative().max(1e8).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateProgramSchema: z2.object({
    params: z2.object({
      programId: uuidSchema2
    }),
    body: z2.object({
      title: z2.string("Program title must be a string").trim().min(2).max(120).optional(),
      shortTitle: z2.string("Short title must be a string").trim().min(2).max(30).optional(),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z2.number().positive().max(500).optional(),
      cost: z2.number().nonnegative().max(1e8).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createCourseSchema: z2.object({
    body: z2.object({
      courseCode: z2.string("Course code is required").trim().min(2).max(30),
      courseTitle: z2.string("Course title is required").trim().min(2).max(120),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z2.number().int().positive().max(500).optional(),
      programId: uuidSchema2.optional()
    })
  }),
  updateCourseSchema: z2.object({
    params: z2.object({
      courseId: uuidSchema2
    }),
    body: z2.object({
      courseCode: z2.string("Course code must be a string").trim().min(2).max(30).optional(),
      courseTitle: z2.string("Course title must be a string").trim().min(2).max(120).optional(),
      description: z2.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z2.number().int().positive().max(500).optional(),
      programId: uuidSchema2.optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteCourseSchema: z2.object({
    params: z2.object({
      courseId: uuidSchema2
    })
  }),
  createCourseRegistrationSchema: z2.object({
    body: z2.object({
      courseId: uuidSchema2,
      studentProfileId: uuidSchema2,
      sectionId: uuidSchema2,
      programId: uuidSchema2.optional(),
      semesterId: uuidSchema2,
      departmentId: uuidSchema2.optional(),
      registrationDate: z2.iso.datetime("registrationDate must be a valid ISO datetime").optional()
    })
  }),
  updateCourseRegistrationSchema: z2.object({
    params: z2.object({
      courseRegistrationId: uuidSchema2
    }),
    body: z2.object({
      courseId: uuidSchema2.optional(),
      studentProfileId: uuidSchema2.optional(),
      sectionId: uuidSchema2.optional(),
      programId: uuidSchema2.optional(),
      semesterId: uuidSchema2.optional(),
      registrationDate: z2.iso.datetime("registrationDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteCourseRegistrationSchema: z2.object({
    params: z2.object({
      courseRegistrationId: uuidSchema2
    })
  }),
  upsertSectionCourseTeacherAssignmentSchema: z2.object({
    body: z2.object({
      sectionId: uuidSchema2,
      courseId: uuidSchema2,
      teacherProfileId: uuidSchema2,
      semesterId: uuidSchema2,
      departmentId: uuidSchema2.optional()
    })
  }),
  createRoutineSchema: z2.object({
    body: z2.object({
      name: z2.string("Routine name is required").trim().min(2).max(120),
      description: z2.string("Description must be a string").trim().max(500).optional(),
      version: z2.string("Version must be a string").trim().max(80).optional(),
      scheduleId: uuidSchema2,
      courseRegistrationId: uuidSchema2,
      classRoomId: uuidSchema2,
      departmentId: uuidSchema2.optional()
    })
  }),
  updateRoutineSchema: z2.object({
    params: z2.object({
      routineId: uuidSchema2
    }),
    body: z2.object({
      name: z2.string("Routine name must be a string").trim().min(2).max(120).optional(),
      description: z2.string("Description must be a string").trim().max(500).optional(),
      version: z2.string("Version must be a string").trim().max(80).optional(),
      scheduleId: uuidSchema2.optional(),
      courseRegistrationId: uuidSchema2.optional(),
      classRoomId: uuidSchema2.optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteRoutineSchema: z2.object({
    params: z2.object({
      routineId: uuidSchema2
    })
  }),
  createTeacherSchema: z2.object({
    body: z2.object({
      name: z2.string("Name is required").trim().min(2).max(60),
      email: z2.email("Please provide a valid email").toLowerCase().trim(),
      password: passwordSchema,
      teacherInitial: z2.string("Teacher initial is required").trim().min(2).max(20),
      teachersId: z2.string("Teacher id is required").trim().min(2).max(50),
      designation: z2.string("Designation is required").trim().min(2).max(80),
      bio: z2.string("Bio must be a string").trim().max(500).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateTeacherSchema: z2.object({
    params: z2.object({
      teacherProfileId: uuidSchema2
    }),
    body: z2.object({
      designation: z2.string("Designation must be a string").trim().min(2).max(80).optional(),
      bio: z2.string("Bio must be a string").trim().max(500).optional(),
      accountStatus: z2.enum(AccountStatus).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createStudentSchema: z2.object({
    body: z2.object({
      name: z2.string("Name is required").trim().min(2).max(60),
      email: z2.email("Please provide a valid email").toLowerCase().trim(),
      password: passwordSchema,
      studentsId: z2.string("Student id is required").trim().min(2).max(50),
      bio: z2.string("Bio must be a string").trim().max(500).optional(),
      departmentId: uuidSchema2.optional()
    })
  }),
  updateStudentSchema: z2.object({
    params: z2.object({
      studentProfileId: uuidSchema2
    }),
    body: z2.object({
      bio: z2.string("Bio must be a string").trim().max(500).optional(),
      accountStatus: z2.enum(AccountStatus).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  listStudentAdmissionApplicationsSchema: z2.object({
    query: z2.object({
      status: z2.enum(["PENDING", "SHORTLISTED", "APPROVED", "REJECTED"]).optional()
    })
  }),
  reviewStudentAdmissionApplicationSchema: z2.object({
    params: z2.object({
      applicationId: uuidSchema2
    }),
    body: z2.object({
      status: z2.enum(["SHORTLISTED", "APPROVED", "REJECTED"]),
      responseMessage: z2.string("responseMessage must be a string").trim().max(1200).optional(),
      rejectionReason: z2.string("rejectionReason must be a string").trim().max(1200).optional(),
      studentsId: z2.string("studentsId must be a string").trim().min(2).max(50).optional(),
      bio: z2.string("bio must be a string").trim().max(1200).optional()
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
  upsertFeeConfigurationSchema: z2.object({
    body: z2.object({
      semesterId: uuidSchema2,
      totalFeeAmount: z2.number().positive().max(1e8),
      monthlyFeeAmount: z2.number().positive().max(1e8),
      currency: z2.string().trim().min(3).max(10).optional()
    })
  }),
  listFeeConfigurationsSchema: z2.object({
    query: z2.object({
      semesterId: uuidSchema2.optional()
    })
  }),
  getStudentPaymentInfoSchema: z2.object({
    params: z2.object({
      studentsId: z2.string("studentsId must be a string").trim().min(2).max(50)
    }),
    query: z2.object({
      semesterId: uuidSchema2.optional()
    })
  }),
  removeTeacherSchema: z2.object({
    params: z2.object({
      teacherProfileId: uuidSchema2
    })
  }),
  removeStudentSchema: z2.object({
    params: z2.object({
      studentProfileId: uuidSchema2
    })
  }),
  createInstitutionTransferRequestSchema: z2.object({
    body: z2.object({
      entityType: z2.enum(InstitutionTransferEntityType),
      profileId: uuidSchema2,
      targetInstitutionId: uuidSchema2,
      requestMessage: z2.string("requestMessage must be a string").trim().max(1200).optional()
    })
  }),
  listInstitutionTransferRequestsSchema: z2.object({
    query: z2.object({
      status: z2.enum(InstitutionTransferStatus).optional(),
      entityType: z2.enum(InstitutionTransferEntityType).optional()
    })
  }),
  reviewInstitutionTransferRequestSchema: z2.object({
    params: z2.object({
      transferRequestId: uuidSchema2
    }),
    body: z2.object({
      status: z2.enum([InstitutionTransferStatus.ACCEPTED, InstitutionTransferStatus.REJECTED]),
      responseMessage: z2.string("responseMessage must be a string").trim().max(1200).optional(),
      targetDepartmentId: uuidSchema2.optional()
    })
  })
};

// src/app/module/department/department.route.ts
var router2 = Router2();
var departmentRoles = ["ADMIN", "FACULTY", "DEPARTMENT"];
router2.get("/profile", requireSessionRole(...departmentRoles), DepartmentController.getDepartmentProfile);
router2.get(
  "/dashboard-summary",
  requireSessionRole(...departmentRoles),
  DepartmentController.getDashboardSummary
);
router2.patch(
  "/profile",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateDepartmentProfileSchema),
  DepartmentController.updateDepartmentProfile
);
router2.get("/semesters", requireSessionRole(...departmentRoles), DepartmentController.listSemesters);
router2.post(
  "/semesters",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createSemesterSchema),
  DepartmentController.createSemester
);
router2.get("/schedules", requireSessionRole(...departmentRoles), DepartmentController.listSchedules);
router2.post(
  "/schedules",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createScheduleSchema),
  DepartmentController.createSchedule
);
router2.patch(
  "/schedules/:scheduleId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateScheduleSchema),
  DepartmentController.updateSchedule
);
router2.delete(
  "/schedules/:scheduleId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteScheduleSchema),
  DepartmentController.deleteSchedule
);
router2.patch(
  "/semesters/:semesterId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateSemesterSchema),
  DepartmentController.updateSemester
);
router2.get("/batches", requireSessionRole(...departmentRoles), DepartmentController.listBatches);
router2.post(
  "/batches",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createBatchSchema),
  DepartmentController.createBatch
);
router2.patch(
  "/batches/:batchId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateBatchSchema),
  DepartmentController.updateBatch
);
router2.delete(
  "/batches/:batchId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteBatchSchema),
  DepartmentController.deleteBatch
);
router2.get("/sections", requireSessionRole(...departmentRoles), DepartmentController.listSections);
router2.post(
  "/sections",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createSectionSchema),
  DepartmentController.createSection
);
router2.patch(
  "/sections/:sectionId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateSectionSchema),
  DepartmentController.updateSection
);
router2.delete(
  "/sections/:sectionId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteSectionSchema),
  DepartmentController.deleteSection
);
router2.get("/programs", requireSessionRole(...departmentRoles), DepartmentController.listPrograms);
router2.post(
  "/programs",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createProgramSchema),
  DepartmentController.createProgram
);
router2.patch(
  "/programs/:programId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateProgramSchema),
  DepartmentController.updateProgram
);
router2.get("/courses", requireSessionRole(...departmentRoles), DepartmentController.listCourses);
router2.post(
  "/courses",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createCourseSchema),
  DepartmentController.createCourse
);
router2.patch(
  "/courses/:courseId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateCourseSchema),
  DepartmentController.updateCourse
);
router2.delete(
  "/courses/:courseId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteCourseSchema),
  DepartmentController.deleteCourse
);
router2.get(
  "/course-registrations",
  requireSessionRole(...departmentRoles),
  DepartmentController.listCourseRegistrations
);
router2.get(
  "/course-teacher-assignments",
  requireSessionRole(...departmentRoles),
  DepartmentController.listSectionCourseTeacherAssignments
);
router2.post(
  "/course-teacher-assignments",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.upsertSectionCourseTeacherAssignmentSchema),
  DepartmentController.upsertSectionCourseTeacherAssignment
);
router2.post(
  "/course-registrations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createCourseRegistrationSchema),
  DepartmentController.createCourseRegistration
);
router2.get("/routines", requireSessionRole(...departmentRoles), DepartmentController.listRoutines);
router2.post(
  "/routines",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createRoutineSchema),
  DepartmentController.createRoutine
);
router2.patch(
  "/routines/:routineId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateRoutineSchema),
  DepartmentController.updateRoutine
);
router2.delete(
  "/routines/:routineId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteRoutineSchema),
  DepartmentController.deleteRoutine
);
router2.patch(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateCourseRegistrationSchema),
  DepartmentController.updateCourseRegistration
);
router2.delete(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.deleteCourseRegistrationSchema),
  DepartmentController.deleteCourseRegistration
);
router2.get("/teachers", requireSessionRole(...departmentRoles), DepartmentController.listTeachers);
router2.post(
  "/teachers",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createTeacherSchema),
  DepartmentController.createTeacher
);
router2.patch(
  "/teachers/:teacherProfileId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateTeacherSchema),
  DepartmentController.updateTeacher
);
router2.delete(
  "/teachers/:teacherProfileId/remove",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.removeTeacherSchema),
  DepartmentController.removeTeacher
);
router2.get("/students", requireSessionRole(...departmentRoles), DepartmentController.listStudents);
router2.post(
  "/students",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createStudentSchema),
  DepartmentController.createStudent
);
router2.patch(
  "/students/:studentProfileId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.updateStudentSchema),
  DepartmentController.updateStudent
);
router2.delete(
  "/students/:studentProfileId/remove",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.removeStudentSchema),
  DepartmentController.removeStudent
);
router2.get(
  "/student-applications",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listStudentAdmissionApplicationsSchema),
  DepartmentController.listStudentAdmissionApplications
);
router2.patch(
  "/student-applications/:applicationId/review",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.reviewStudentAdmissionApplicationSchema),
  DepartmentController.reviewStudentAdmissionApplication
);
router2.get(
  "/fees/configurations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listFeeConfigurationsSchema),
  DepartmentController.listFeeConfigurations
);
router2.post(
  "/fees/configurations",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.upsertFeeConfigurationSchema),
  DepartmentController.upsertFeeConfiguration
);
router2.get(
  "/fees/students/:studentsId",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.getStudentPaymentInfoSchema),
  DepartmentController.getStudentPaymentInfoByStudentId
);
router2.post(
  "/transfers",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.createInstitutionTransferRequestSchema),
  DepartmentController.createInstitutionTransferRequest
);
router2.get(
  "/transfers/outgoing",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listInstitutionTransferRequestsSchema),
  DepartmentController.listOutgoingInstitutionTransferRequests
);
router2.get(
  "/transfers/incoming",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listInstitutionTransferRequestsSchema),
  DepartmentController.listIncomingInstitutionTransferRequests
);
router2.patch(
  "/transfers/:transferRequestId/review",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.reviewInstitutionTransferRequestSchema),
  DepartmentController.reviewInstitutionTransferRequest
);
var DepartmentRouter = router2;

// src/app/module/apply/apply.validation.ts
import z3 from "zod";
var ApplyForInstitutionValidationSchema = {
  applyForInstitutionSchema: z3.object({
    name: z3.string().min(1, "Name is required"),
    email: z3.string().email("Invalid email address"),
    password: z3.string().min(6, "Password must be at least 6 characters long"),
    instituteName: z3.string().min(1, "Institute name is required"),
    instituteShortname: z3.string().min(1, "Institute shortname is required"),
    description: z3.string().min(1, "Description is required"),
    instituteType: z3.enum(
      [
        InstitutionType.COLLEGE,
        InstitutionType.SCHOOL,
        InstitutionType.UNIVERSITY,
        InstitutionType.TRAINING_CENTER,
        InstitutionType.OTHER
      ],
      "Invalid institute type"
    ),
    instituteLogo: z3.string().min(1, "Institute logo is required")
  })
};

// src/app/module/auth/auth.route.ts
import { Router as Router3 } from "express";

// src/app/module/auth/authOtp.service.ts
import { createHash, randomInt } from "crypto";

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
function createHttpError3(statusCode, message) {
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
    throw createHttpError3(404, "User account not found");
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
        throw createHttpError3(
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
    throw createHttpError3(400, "Account is already verified");
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
    throw createHttpError3(400, "OTP has expired. Please request a new code");
  }
  if (otpRecord.expiresAt.getTime() <= Date.now()) {
    await prisma.emailOtp.deleteMany({
      where: {
        userId: user.id
      }
    });
    throw createHttpError3(400, "OTP has expired. Please request a new code");
  }
  if (otpRecord.otpHash !== hashOtp(otpCode)) {
    throw createHttpError3(400, "Invalid OTP code");
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
var AuthService = {
  registerUser,
  loginUser,
  getCurrentUserProfile,
  getAccountVerificationOtpStatus,
  resendAccountVerificationOtp,
  verifyAccountOtp
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
var AuthController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getCurrentUserProfile: getCurrentUserProfile2,
  getOtpStatus,
  resendOtp,
  verifyOtp
};

// src/app/module/auth/auth.validation.ts
import { z as z4 } from "zod";
var passwordSchema2 = z4.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
  /[^A-Za-z0-9]/,
  "Password must contain at least one special character"
);
var emailSchema = z4.email("Please provide a valid email address").toLowerCase().trim();
var registerSchema = z4.object({
  body: z4.object({
    name: z4.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(60, "Name must not exceed 60 characters").regex(
      /^[a-zA-Z\s'-]+$/,
      "Name must only contain letters, spaces, hyphens or apostrophes"
    ),
    email: emailSchema,
    password: passwordSchema2,
    role: z4.enum([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.SUPERADMIN], {
      message: `Invalid role. Must be one of: ${UserRole.SUPERADMIN}, ${UserRole.ADMIN}, ${UserRole.TEACHER}, ${UserRole.STUDENT}`
    }).optional(),
    adminRole: z4.enum([AdminRole.DEPARTMENTADMIN, AdminRole.INSTITUTIONADMIN, AdminRole.FACULTYADMIN], {
      message: `Invalid admin role. Must be one of: ${AdminRole.DEPARTMENTADMIN}, ${AdminRole.INSTITUTIONADMIN}, ${AdminRole.FACULTYADMIN}`
    }).optional(),
    institutionId: z4.string().optional()
  })
});
var loginSchema = z4.object({
  body: z4.object({
    email: emailSchema,
    password: z4.string("Password is required").min(1, "Password is required")
  })
});
var otpBaseSchema = z4.object({
  body: z4.object({
    email: emailSchema
  })
});
var verifyOtpSchema = z4.object({
  body: z4.object({
    email: emailSchema,
    otp: z4.string("OTP is required").trim().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
  })
});
var changePasswordSchema = z4.object({
  body: z4.object({
    currentPassword: z4.string("Current password is required").min(1, "Current password is required"),
    newPassword: passwordSchema2,
    confirmNewPassword: z4.string("Please confirm your new password").min(1, "Please confirm your new password")
  })
}).refine((data) => data.body.newPassword === data.body.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["body", "confirmNewPassword"]
}).refine((data) => data.body.currentPassword !== data.body.newPassword, {
  message: "New password must be different from the current password",
  path: ["body", "newPassword"]
});
var forgotPasswordSchema = z4.object({
  body: z4.object({
    email: emailSchema
  })
});
var resetPasswordSchema = z4.object({
  body: z4.object({
    token: z4.string("Reset token is required").min(1, "Reset token is required"),
    newPassword: passwordSchema2,
    confirmNewPassword: z4.string("Please confirm your new password").min(1, "Please confirm your new password")
  })
}).refine((data) => data.body.newPassword === data.body.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["body", "confirmNewPassword"]
});
var verifyEmailSchema = z4.object({
  body: z4.object({
    token: z4.string("Verification token is required").min(1, "Verification token is required")
  })
});
var refreshTokenSchema = z4.object({
  cookies: z4.object({
    refreshToken: z4.string("Refresh token is required").min(1, "Refresh token is required")
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
  verifyEmailSchema,
  refreshTokenSchema
};

// src/app/module/auth/auth.route.ts
var router3 = Router3();
router3.post("/register", validateRequest(AuthValidation.registerSchema), AuthController.registerUser);
router3.post("/apply", validateRequest(ApplyForInstitutionValidationSchema.applyForInstitutionSchema));
router3.post("/login", validateRequest(AuthValidation.loginSchema), AuthController.loginUser);
router3.post(
  "/otp/status",
  validateRequest(AuthValidation.otpBaseSchema),
  AuthController.getOtpStatus
);
router3.post(
  "/otp/resend",
  validateRequest(AuthValidation.otpBaseSchema),
  AuthController.resendOtp
);
router3.post(
  "/otp/verify",
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthController.verifyOtp
);
router3.get(
  "/me",
  requireSessionRole("SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"),
  AuthController.getCurrentUserProfile
);
var AuthRoutes = router3;

// src/app/module/facultyProfile/facultyProfile.route.ts
import { Router as Router4 } from "express";

// src/app/module/facultyProfile/facultyProfile.service.ts
function createHttpError4(statusCode, message) {
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
    throw createHttpError4(403, "Only faculty-level admins can access this resource");
  }
  const canUseFacultyFeatures = adminProfile.role === AdminRole.FACULTYADMIN || adminProfile.role === AdminRole.INSTITUTIONADMIN;
  if (!canUseFacultyFeatures) {
    throw createHttpError4(403, "Only faculty-level admins can access this resource");
  }
  return adminProfile;
}
var updateFacultyDisplayName = async (userId, payload) => {
  const adminProfile = await resolveFacultyManagementContext(userId);
  const normalizedName = (payload.fullName ?? payload.name ?? "").trim();
  const hasFacultyMutation = Boolean(payload.fullName || payload.name || payload.shortName || payload.description) || Boolean(payload.facultyId);
  if (hasFacultyMutation && !normalizedName) {
    throw createHttpError4(400, "Full name is required when updating faculty details");
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
          throw createHttpError4(
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
        throw createHttpError4(404, "Faculty not found");
      }
      if (!targetFaculty.institutionId || targetFaculty.institutionId !== adminProfile.institutionId) {
        throw createHttpError4(403, "You can only update faculty under your institution");
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
      throw createHttpError4(404, "Faculty not found for this institution");
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
      throw createHttpError4(
        404,
        "No faculty found for this institution. Update faculty profile first"
      );
    }
    if (faculties.length > 1) {
      throw createHttpError4(400, "Multiple faculties found. Please provide facultyId");
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
import { z as z5 } from "zod";
var FacultyProfileValidation = {
  createDepartmentSchema: z5.object({
    body: z5.object({
      fullName: z5.string("Department full name is required").trim().min(2, "Department full name must be at least 2 characters long").max(120, "Department full name must not exceed 120 characters"),
      shortName: z5.string("Department short name must be a string").trim().min(2, "Department short name must be at least 2 characters long").max(30, "Department short name must not exceed 30 characters").optional(),
      description: z5.string("Department description must be a string").trim().min(3, "Department description must be at least 3 characters long").max(500, "Department description must not exceed 500 characters").optional(),
      facultyId: z5.uuid("Please provide a valid faculty id").optional()
    })
  }),
  updateFacultyDisplayNameSchema: z5.object({
    body: z5.object({
      name: z5.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(80, "Name must not exceed 80 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Name must only contain letters, spaces, hyphens or apostrophes"
      ).optional(),
      fullName: z5.string("Full name is required").trim().min(2, "Full name must be at least 2 characters long").max(80, "Full name must not exceed 80 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Full name must only contain letters, spaces, hyphens or apostrophes"
      ).optional(),
      facultyId: z5.uuid("Please provide a valid faculty id").optional(),
      shortName: z5.string("Short name must be a string").trim().min(2, "Short name must be at least 2 characters long").max(30, "Short name must not exceed 30 characters").optional(),
      description: z5.string("Description must be a string").trim().min(3, "Description must be at least 3 characters long").max(500, "Description must not exceed 500 characters").optional(),
      image: z5.url("image must be a valid URL").trim().optional(),
      contactNo: z5.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z5.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z5.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z5.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z5.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  })
};

// src/app/module/facultyProfile/facultyProfile.route.ts
var router4 = Router4();
router4.get(
  "/profile",
  requireSessionRole("ADMIN", "FACULTY"),
  FacultyProfileController.getFacultyProfileDetails
);
router4.patch(
  "/profile/name",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(FacultyProfileValidation.updateFacultyDisplayNameSchema),
  FacultyProfileController.updateFacultyDisplayName
);
router4.post(
  "/departments",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(FacultyProfileValidation.createDepartmentSchema),
  FacultyProfileController.createDepartment
);
var FacultyProfileRouter = router4;

// src/app/module/institute/institute.route.ts
import { Router as Router5 } from "express";

// src/app/module/institute/interface.validation.ts
import z6 from "zod";
var createInstitutionSchema = z6.object({
  body: z6.object({
    name: z6.string("Institution name is required").min(1, "Institution name is required"),
    description: z6.string("Institution description is required").min(1, "Institution description is required"),
    shortName: z6.string("Institution short name is required").min(1, "Institution short name is required"),
    type: z6.enum([InstitutionType.UNIVERSITY, InstitutionType.COLLEGE, InstitutionType.SCHOOL, InstitutionType.TRAINING_CENTER, InstitutionType.OTHER], {
      message: `Invalid institution type. Must be one of: ${InstitutionType.UNIVERSITY}, ${InstitutionType.COLLEGE}, ${InstitutionType.SCHOOL}, ${InstitutionType.TRAINING_CENTER}, ${InstitutionType.OTHER}`
    }),
    institutionLogo: z6.string("Institution logo is required").min(1, "Institution logo is required")
  })
});
var InstituteValidation = {
  createInstitutionSchema,
  listInstitutionOptionsSchema: z6.object({
    query: z6.object({
      search: z6.string().trim().min(1).max(120).optional()
    })
  })
};

// src/app/module/institute/institute.service.ts
function createHttpError5(statusCode, message) {
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
    throw createHttpError5(403, "Only institution admins can list institution options");
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
var router5 = Router5();
router5.post("/create", validateRequest(InstituteValidation.createInstitutionSchema), InstituteController.createInstitution);
router5.get(
  "/options",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(InstituteValidation.listInstitutionOptionsSchema),
  InstituteController.listInstitutionOptions
);
var InstituteRoutes = router5;

// src/app/module/institutionAdmin/institutionAdmin.route.ts
import { Router as Router6 } from "express";

// src/app/module/institutionAdmin/institutionAdmin.service.ts
function createHttpError6(statusCode, message) {
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
function normalizeSearch3(search) {
  const value = search?.trim();
  return value || void 0;
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
    throw createHttpError6(403, "Only institution admins can manage semesters");
  }
  if (creatorAdminProfile.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError6(403, "Only institution admins can manage semesters");
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
var createSemester3 = async (creatorUserId, payload) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw createHttpError6(400, "Invalid startDate or endDate");
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate <= today) {
    throw createHttpError6(400, "startDate must be after today");
  }
  if (startDate >= endDate) {
    throw createHttpError6(400, "startDate must be before endDate");
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
    throw createHttpError6(404, "Semester not found for this institution");
  }
  let nextStartDate = existingSemester.startDate;
  let nextEndDate = existingSemester.endDate;
  if (payload.startDate) {
    const parsedStartDate = new Date(payload.startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw createHttpError6(400, "Invalid startDate");
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedStartDate <= today) {
      throw createHttpError6(400, "startDate must be after today");
    }
    nextStartDate = parsedStartDate;
  }
  if (payload.endDate) {
    const parsedEndDate = new Date(payload.endDate);
    if (Number.isNaN(parsedEndDate.getTime())) {
      throw createHttpError6(400, "Invalid endDate");
    }
    nextEndDate = parsedEndDate;
  }
  if (nextStartDate >= nextEndDate) {
    throw createHttpError6(400, "startDate must be before endDate");
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
    throw createHttpError6(404, "Semester not found for this institution");
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
    throw createHttpError6(403, "Only institution-level admins can view faculties");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, "DEPARTMENT")) {
    throw createHttpError6(403, "You are not allowed to view faculties for department creation");
  }
  const normalizedSearch = normalizeSearch3(search);
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
    throw createHttpError6(403, "Only institution-level admins can create sub-admin accounts");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, payload.accountType)) {
    throw createHttpError6(
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
    throw createHttpError6(500, "Failed to create account");
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
        throw createHttpError6(404, "Faculty not found for this institution");
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
          throw createHttpError6(
            400,
            "Cannot create department without a faculty. Provide faculty fields first"
          );
        }
        if (faculties.length > 1) {
          throw createHttpError6(
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
  listSemesters: listSemesters3,
  createSemester: createSemester3,
  updateSemester: updateSemester3,
  deleteSemester,
  createSubAdminAccount,
  listFaculties
};

// src/app/module/institutionAdmin/institutionAdmin.controller.ts
var readParam3 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue3 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
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
    readQueryValue3(req.query.search)
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
  createSubAdminAccount: createSubAdminAccount2,
  listFaculties: listFaculties2,
  listSemesters: listSemesters4,
  createSemester: createSemester4,
  updateSemester: updateSemester4,
  deleteSemester: deleteSemester2
};

// src/app/module/institutionAdmin/institutionAdmin.validation.ts
import { z as z7 } from "zod";
var passwordSchema3 = z7.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
var InstitutionAdminValidation = {
  semesterParamsSchema: z7.object({
    params: z7.object({
      semesterId: z7.uuid("Please provide a valid semester id")
    })
  }),
  createSemesterSchema: z7.object({
    body: z7.object({
      name: z7.string("Semester name is required").trim().min(2).max(80),
      startDate: z7.iso.datetime("startDate must be a valid ISO datetime"),
      endDate: z7.iso.datetime("endDate must be a valid ISO datetime")
    })
  }),
  updateSemesterSchema: z7.object({
    params: z7.object({
      semesterId: z7.uuid("Please provide a valid semester id")
    }),
    body: z7.object({
      name: z7.string("Semester name must be a string").trim().min(2).max(80).optional(),
      startDate: z7.iso.datetime("startDate must be a valid ISO datetime").optional(),
      endDate: z7.iso.datetime("endDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  updateProfileSchema: z7.object({
    body: z7.object({
      name: z7.string("name must be a string").trim().min(2).max(120).optional(),
      image: z7.url("image must be a valid URL").trim().optional(),
      contactNo: z7.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z7.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z7.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z7.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z7.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createSubAdminSchema: z7.object({
    body: z7.object({
      name: z7.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(60, "Name must not exceed 60 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Name must only contain letters, spaces, hyphens or apostrophes"
      ),
      email: z7.email("Please provide a valid email address").toLowerCase().trim(),
      password: passwordSchema3,
      accountType: z7.enum(["FACULTY", "DEPARTMENT"]),
      facultyId: z7.uuid("Please provide a valid faculty id").optional(),
      facultyFullName: z7.string("Faculty full name must be a string").trim().min(2, "Faculty full name must be at least 2 characters long").max(120, "Faculty full name must not exceed 120 characters").optional(),
      facultyShortName: z7.string("Faculty short name must be a string").trim().min(2, "Faculty short name must be at least 2 characters long").max(30, "Faculty short name must not exceed 30 characters").optional(),
      facultyDescription: z7.string("Faculty description must be a string").trim().min(3, "Faculty description must be at least 3 characters long").max(500, "Faculty description must not exceed 500 characters").optional(),
      departmentFullName: z7.string("Department full name must be a string").trim().min(2, "Department full name must be at least 2 characters long").max(120, "Department full name must not exceed 120 characters").optional(),
      departmentShortName: z7.string("Department short name must be a string").trim().min(2, "Department short name must be at least 2 characters long").max(30, "Department short name must not exceed 30 characters").optional(),
      departmentDescription: z7.string("Department description must be a string").trim().min(3, "Department description must be at least 3 characters long").max(500, "Department description must not exceed 500 characters").optional()
    })
  })
};

// src/app/module/institutionAdmin/institutionAdmin.route.ts
var router6 = Router6();
router6.get(
  "/dashboard-summary",
  requireAdminRole(),
  InstitutionAdminController.getDashboardSummary
);
router6.patch(
  "/profile",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.updateProfileSchema),
  InstitutionAdminController.updateProfile
);
router6.get("/faculties", requireAdminRole(), InstitutionAdminController.listFaculties);
router6.get("/semesters", requireAdminRole(), InstitutionAdminController.listSemesters);
router6.post(
  "/semesters",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.createSemesterSchema),
  InstitutionAdminController.createSemester
);
router6.patch(
  "/semesters/:semesterId",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.updateSemesterSchema),
  InstitutionAdminController.updateSemester
);
router6.delete(
  "/semesters/:semesterId",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.semesterParamsSchema),
  InstitutionAdminController.deleteSemester
);
router6.post(
  "/sub-admins",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.createSubAdminSchema),
  InstitutionAdminController.createSubAdminAccount
);
var InstitutionAdminRouter = router6;

// src/app/module/institutionApplication/institutionApplication.route.ts
import { Router as Router7 } from "express";

// src/app/module/institutionApplication/institutionApplication.service.ts
function createHttpError7(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
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
    throw createHttpError7(400, "You are already assigned to an institution");
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
    throw createHttpError7(400, "You already have a pending application");
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
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.adminProfile.count(),
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
    prisma.institution.count({
      where: {
        createdAt: {
          gte: monthStart
        }
      }
    }),
    prisma.studentProfile.count({
      where: {
        createdAt: {
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
    throw createHttpError7(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError7(400, "Application already reviewed");
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
  review: review2
};

// src/app/module/institutionApplication/institutionApplication.validation.ts
import z8 from "zod";
var InstitutionApplicationValidation = {
  createSchema: z8.object({
    body: z8.object({
      institutionName: z8.string().min(2, "Institution name is required"),
      description: z8.string().max(500, "Description is too long").optional(),
      shortName: z8.string().min(2, "Short name must be at least 2 characters").max(50, "Short name is too long").optional(),
      institutionType: z8.enum([
        InstitutionType.SCHOOL,
        InstitutionType.COLLEGE,
        InstitutionType.UNIVERSITY,
        InstitutionType.TRAINING_CENTER,
        InstitutionType.OTHER
      ]),
      institutionLogo: z8.string().url("Institution logo must be a valid URL").optional()
    })
  }),
  reviewSchema: z8.object({
    body: z8.object({
      status: z8.enum([
        InstitutionApplicationStatus.APPROVED,
        InstitutionApplicationStatus.REJECTED
      ]),
      rejectionReason: z8.string().max(500, "Rejection reason is too long").optional()
    }).refine(
      (data) => data.status === InstitutionApplicationStatus.APPROVED || data.rejectionReason && data.rejectionReason.trim().length > 0,
      {
        message: "Rejection reason is required when rejecting an application",
        path: ["rejectionReason"]
      }
    )
  })
};

// src/app/module/institutionApplication/institutionApplication.route.ts
var router7 = Router7();
router7.post(
  "/admin/apply",
  requireAdminRole(),
  validateRequest(InstitutionApplicationValidation.createSchema),
  InstitutionApplicationController.create
);
router7.get(
  "/admin/my-applications",
  requireAdminRole(),
  InstitutionApplicationController.myApplications
);
router7.get(
  "/superadmin",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.listForSuperAdmin
);
router7.get(
  "/superadmin-summary",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.getSuperAdminSummary
);
router7.patch(
  "/superadmin/:applicationId/review",
  requireSessionRole("SUPERADMIN"),
  validateRequest(InstitutionApplicationValidation.reviewSchema),
  InstitutionApplicationController.review
);
var InstitutionApplicationRouter = router7;

// src/app/module/notice/notice.route.ts
import { Router as Router8 } from "express";

// src/app/module/notice/notice.service.ts
function createHttpError8(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch4(search) {
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
    throw createHttpError8(404, "User not found");
  }
  if (user.role === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { institutionId: true }
    });
    if (!teacherProfile?.institutionId) {
      throw createHttpError8(403, "Teacher is not assigned to any institution yet");
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
      throw createHttpError8(403, "Student is not assigned to any institution yet");
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
      throw createHttpError8(403, "Admin is not assigned to any institution");
    }
    const resolvedRole = adminProfile.role === AdminRole.FACULTYADMIN ? "FACULTY" : adminProfile.role === AdminRole.DEPARTMENTADMIN ? "DEPARTMENT" : "ADMIN";
    return {
      userId,
      institutionId: adminProfile.institutionId,
      role: resolvedRole
    };
  }
  throw createHttpError8(403, "Unsupported role for notices");
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
    throw createHttpError8(404, "Notice not found");
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
  const normalizedSearch = normalizeSearch4(query.search);
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
    throw createHttpError8(403, "Only admin, faculty, and department can send notices");
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
    throw createHttpError8(404, "Notice not found");
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
    throw createHttpError8(404, "Notice not found");
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
    throw createHttpError8(404, "Notice not found");
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
var readQueryValue4 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
var listNotices2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.listNotices(user.id, {
    search: readQueryValue4(req.query.search)
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
import { z as z9 } from "zod";
var uuidSchema3 = z9.uuid("Please provide a valid id");
var noticeAudienceRoleSchema = z9.enum(["ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"]);
var listNoticesSchema = z9.object({
  query: z9.object({
    search: z9.string("search must be a string").trim().max(120).optional()
  })
});
var createNoticeSchema = z9.object({
  body: z9.object({
    title: z9.string("title is required").trim().min(2).max(180),
    content: z9.string("content is required").trim().min(2).max(5e3),
    targetRoles: z9.array(noticeAudienceRoleSchema).min(1, "Select at least one target role")
  })
});
var updateNoticeSchema = z9.object({
  params: z9.object({
    noticeId: uuidSchema3
  }),
  body: z9.object({
    title: z9.string("title must be a string").trim().min(2).max(180).optional(),
    content: z9.string("content must be a string").trim().min(2).max(5e3).optional(),
    targetRoles: z9.array(noticeAudienceRoleSchema).min(1, "Select at least one target role").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var noticeParamsSchema = z9.object({
  params: z9.object({
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
var router8 = Router8();
router8.get(
  "/",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(NoticeValidation.listNoticesSchema),
  NoticeController.listNotices
);
router8.get(
  "/unread-count",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  NoticeController.getUnreadCount
);
router8.post(
  "/",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.createNoticeSchema),
  NoticeController.createNotice
);
router8.patch(
  "/:noticeId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.updateNoticeSchema),
  NoticeController.updateNotice
);
router8.delete(
  "/:noticeId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.noticeParamsSchema),
  NoticeController.deleteNotice
);
router8.post(
  "/:noticeId/read",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(NoticeValidation.noticeParamsSchema),
  NoticeController.markNoticeAsRead
);
router8.post(
  "/read-all",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  NoticeController.markAllNoticesAsRead
);
var NoticeRouter = router8;

// src/app/module/posting/posting.route.ts
import { Router as Router9 } from "express";

// src/app/module/posting/posting.service.ts
function createHttpError9(statusCode, message) {
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
function normalizeSearch5(search) {
  const value = search?.trim();
  return value || void 0;
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
    throw createHttpError9(403, "Only admin users under an institution can manage postings");
  }
  return adminProfile;
}
async function resolveScopedIds(userId, payload) {
  const context = await resolveAdminContext(userId);
  if (context.role === AdminRole.INSTITUTIONADMIN) {
    if (!payload.facultyId || !payload.departmentId) {
      throw createHttpError9(
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
      throw createHttpError9(404, "Faculty not found for this institution");
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
      throw createHttpError9(404, "Department not found under selected faculty");
    }
    return {
      institutionId: context.institutionId,
      facultyId: payload.facultyId,
      departmentId: payload.departmentId,
      programId: null
    };
  }
  if (context.role === AdminRole.FACULTYADMIN) {
    if (!payload.departmentId) {
      throw createHttpError9(400, "Faculty admin must provide departmentId");
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
      throw createHttpError9(404, "Department not found for this institution");
    }
    if (!department.facultyId) {
      throw createHttpError9(400, "Department is not assigned to a faculty");
    }
    return {
      institutionId: context.institutionId,
      facultyId: department.facultyId,
      departmentId: department.id,
      programId: null
    };
  }
  if (context.role === AdminRole.DEPARTMENTADMIN) {
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
      throw createHttpError9(404, "Department not found for this institution");
    }
    if (departments.length > 1) {
      throw createHttpError9(400, "Multiple departments found. Contact institution admin to resolve mapping");
    }
    return {
      institutionId: context.institutionId,
      facultyId: departments[0].facultyId,
      departmentId: departments[0].id,
      programId: null
    };
  }
  throw createHttpError9(403, "Unsupported admin role for posting management");
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
var listTeacherJobPostsPublic = async (limit = 50) => {
  let posts;
  try {
    posts = await prisma.teacherJobPost.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: Math.min(limit, 100)
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }
    throw error;
  }
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
      institution: institution?.name ?? "Unknown institution",
      institutionShortName: institution?.shortName ?? null,
      institutionLogo: institution?.institutionLogo ?? null,
      facultyName: faculty?.fullName ?? null,
      departmentName: department?.fullName ?? null,
      programTitle: program?.title ?? null
    };
  });
};
var listStudentAdmissionPostsPublic = async (limit = 50) => {
  let posts;
  try {
    posts = await prisma.studentAdmissionPost.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: Math.min(limit, 100)
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }
    throw error;
  }
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
      institution: institution?.name ?? "Unknown institution",
      institutionShortName: institution?.shortName ?? null,
      institutionLogo: institution?.institutionLogo ?? null,
      facultyName: faculty?.fullName ?? null,
      departmentName: department?.fullName ?? null,
      programTitle: program?.title ?? null
    };
  });
};
var getPostingOptions = async (userId, search) => {
  const context = await resolveAdminContext(userId);
  const normalizedSearch = normalizeSearch5(search);
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
  throw createHttpError9(403, "Unsupported admin role for posting options");
};
var PostingService = {
  createTeacherJobPost,
  createStudentAdmissionPost,
  listTeacherJobPostsPublic,
  listStudentAdmissionPostsPublic,
  getPostingOptions
};

// src/app/module/posting/posting.controller.ts
var readLimit = (value) => {
  let raw2;
  if (Array.isArray(value)) {
    const first = value[0];
    raw2 = typeof first === "string" ? first : void 0;
  } else if (typeof value === "string") {
    raw2 = value;
  }
  const parsed = raw2 ? Number(raw2) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
};
var readQueryValue5 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
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
  const result = await PostingService.listTeacherJobPostsPublic(limit);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher job posts fetched successfully",
    data: result
  });
});
var listStudentAdmissionPostsPublic2 = catchAsync(async (req, res) => {
  const limit = readLimit(req.query.limit);
  const result = await PostingService.listStudentAdmissionPostsPublic(limit);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student admission posts fetched successfully",
    data: result
  });
});
var getPostingOptions2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.getPostingOptions(user.id, readQueryValue5(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Posting options fetched successfully",
    data: result
  });
});
var PostingController = {
  createTeacherJobPost: createTeacherJobPost2,
  createStudentAdmissionPost: createStudentAdmissionPost2,
  listTeacherJobPostsPublic: listTeacherJobPostsPublic2,
  listStudentAdmissionPostsPublic: listStudentAdmissionPostsPublic2,
  getPostingOptions: getPostingOptions2
};

// src/app/module/posting/posting.validation.ts
import { z as z10 } from "zod";
var uuidSchema4 = z10.uuid("Please provide a valid id");
var createPostingSchema = z10.object({
  body: z10.object({
    title: z10.string("Title is required").trim().min(2).max(150),
    location: z10.string("Location must be a string").trim().min(2).max(150).optional(),
    summary: z10.string("Summary is required").trim().min(10).max(600),
    details: z10.array(z10.string("Detail must be a string").trim().min(2).max(300)).max(20).optional(),
    facultyId: uuidSchema4.optional(),
    departmentId: uuidSchema4.optional()
  })
});
var listPublicPostingSchema = z10.object({
  query: z10.object({
    limit: z10.string("limit must be a number").regex(/^\d+$/, "limit must be a positive integer").optional()
  })
});
var PostingValidation = {
  createPostingSchema,
  listPublicPostingSchema
};

// src/app/module/posting/posting.route.ts
var router9 = Router9();
router9.get(
  "/teacher/public",
  validateRequest(PostingValidation.listPublicPostingSchema),
  PostingController.listTeacherJobPostsPublic
);
router9.get(
  "/student/public",
  validateRequest(PostingValidation.listPublicPostingSchema),
  PostingController.listStudentAdmissionPostsPublic
);
router9.get(
  "/options",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  PostingController.getPostingOptions
);
router9.post(
  "/teacher",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.createPostingSchema),
  PostingController.createTeacherJobPost
);
router9.post(
  "/student",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.createPostingSchema),
  PostingController.createStudentAdmissionPost
);
var PostingRouter = router9;

// src/app/module/routine/routine.route.ts
import { Router as Router10 } from "express";

// src/app/module/routine/routine.service.ts
function createHttpError10(statusCode, message) {
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
    throw createHttpError10(403, "No institution context found for this account");
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
import { z as z11 } from "zod";
var uuidSchema5 = z11.uuid("Please provide a valid id");
var RoutineValidation = {
  listRoutinesSchema: z11.object({
    query: z11.object({
      sectionId: uuidSchema5.optional(),
      semesterId: uuidSchema5.optional(),
      teacherInitial: z11.string("teacherInitial must be a string").trim().min(1).max(40).optional(),
      search: z11.string("search must be a string").trim().max(120).optional()
    })
  })
};

// src/app/module/routine/routine.route.ts
var router10 = Router10();
router10.get(
  "/",
  requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(RoutineValidation.listRoutinesSchema),
  RoutineController.listRoutines
);
var RoutineRouter = router10;

// src/app/module/student/student.route.ts
import { Router as Router11 } from "express";

// src/app/module/student/student.service.ts
var LAB_MARKS_MAX = {
  attendance: 10
};
var THEORY_MARKS_MAX = {
  attendance: 7
};
function createHttpError11(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch7(search) {
  const value = search?.trim();
  return value || void 0;
}
function toMoneyNumber2(value) {
  const numericValue = Number(value ?? 0);
  return Number(numericValue.toFixed(2));
}
function toSafeUpper(value, fallbackValue) {
  const normalized = value?.trim().toUpperCase();
  return normalized || fallbackValue;
}
function areMoneyValuesEqual(left, right) {
  return Math.abs(toMoneyNumber2(left) - toMoneyNumber2(right)) < 0.01;
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
function getSslCommerzBaseUrl() {
  const envBaseUrl = process.env.SSLCOMMERZ_BASE_URL?.trim().replace(/\/$/, "");
  return envBaseUrl || "https://sandbox.sslcommerz.com";
}
function getSslCommerzCredentials() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePassword) {
    throw createHttpError11(
      500,
      "SSLCommerz credentials are not configured. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD."
    );
  }
  return {
    storeId,
    storePassword
  };
}
function normalizeCallbackQuery(query) {
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
    throw createHttpError11(404, "Student account not found");
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
    throw createHttpError11(403, "Student is not assigned to any institution yet");
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
    throw createHttpError11(404, "Classwork not found");
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
    throw createHttpError11(403, "You are not registered in this classwork section");
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
    throw createHttpError11(409, "Submission already exists. Please update it.");
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
    throw createHttpError11(404, "Submission not found");
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
    throw createHttpError11(404, "Submission not found");
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
    throw createHttpError11(409, "Application profile already exists. Use update instead.");
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
    throw createHttpError11(404, "Application profile not found");
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
    throw createHttpError11(404, "Application profile not found");
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
    throw createHttpError11(
      400,
      "Complete your application profile and upload required documents before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError11(400, "You are already assigned to an institution");
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
    throw createHttpError11(404, "Student admission posting not found");
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
    throw createHttpError11(409, "You already applied to this admission post");
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
    throw createHttpError11(403, "Student is not assigned to a department yet");
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
      toMoneyNumber2((paidBySemester.get(payment.semesterId) ?? 0) + toMoneyNumber2(payment.amount))
    );
  }
  const feeItems = feeConfigurations.map((configuration) => {
    const totalFeeAmount = toMoneyNumber2(configuration.totalFeeAmount);
    const monthlyFeeAmount = toMoneyNumber2(configuration.monthlyFeeAmount);
    const paidAmount = toMoneyNumber2(paidBySemester.get(configuration.semesterId) ?? 0);
    const dueAmount = Math.max(0, toMoneyNumber2(totalFeeAmount - paidAmount));
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
      totalConfiguredAmount: toMoneyNumber2(totalConfiguredAmount),
      totalPaidAmount: toMoneyNumber2(totalPaidAmount),
      totalDueAmount: toMoneyNumber2(Math.max(0, totalConfiguredAmount - totalPaidAmount))
    },
    feeItems,
    paymentHistory: successfulPayments.map((payment) => ({
      ...payment,
      amount: toMoneyNumber2(payment.amount)
    }))
  };
};
var initiateFeePayment = async (userId, payload) => {
  const { profile, user } = await resolveStudentInstitutionContext(userId);
  if (!profile.departmentId) {
    throw createHttpError11(403, "Student is not assigned to a department yet");
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
    throw createHttpError11(404, "No fee configuration found for the selected semester/session");
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
  const totalFeeAmount = toMoneyNumber2(feeConfiguration.totalFeeAmount);
  const monthlyFeeAmount = toMoneyNumber2(feeConfiguration.monthlyFeeAmount);
  const paidAmount = toMoneyNumber2(
    successfulPayments.reduce((sum, item) => sum + toMoneyNumber2(item.amount), 0)
  );
  const dueAmount = toMoneyNumber2(Math.max(0, totalFeeAmount - paidAmount));
  if (dueAmount <= 0) {
    throw createHttpError11(409, "No due amount left for this semester/session");
  }
  const mode = payload.paymentMode;
  let requestedAmount = dueAmount;
  let monthsCovered = 0;
  if (mode === FEE_PAYMENT_MODE_MONTHLY) {
    const monthsCount = payload.monthsCount ?? 0;
    if (!monthsCount || monthsCount < 1) {
      throw createHttpError11(400, "monthsCount must be at least 1 for monthly payment");
    }
    requestedAmount = toMoneyNumber2(Math.min(dueAmount, monthlyFeeAmount * monthsCount));
    monthsCovered = monthsCount;
  } else {
    monthsCovered = Math.max(1, Math.ceil(dueAmount / Math.max(monthlyFeeAmount, 1)));
  }
  if (requestedAmount <= 0) {
    throw createHttpError11(400, "Invalid payment amount");
  }
  const transactionId = createTransactionId();
  const backendBaseUrl = getBackendPublicUrl();
  const { storeId, storePassword } = getSslCommerzCredentials();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl();
  const currency = toSafeUpper(feeConfiguration.currency, "BDT");
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
    throw createHttpError11(502, failureMessage);
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
  const query = normalizeCallbackQuery(rawQuery);
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
  const isValidTransaction = validationData?.tran_id === payment.tranId;
  const isValidAmount = areMoneyValuesEqual(validationData?.amount, payment.amount);
  const isValidCurrency = toSafeUpper(validationData?.currency_type, payment.currency) === toSafeUpper(payment.currency, "BDT");
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
  const alreadyPaidAmount = toMoneyNumber2(
    successfulSemesterPayments.reduce(
      (sum, item) => sum + toMoneyNumber2(item.amount),
      0
    )
  );
  const currentAmount = toMoneyNumber2(payment.amount);
  const totalFeeAmount = toMoneyNumber2(payment.feeConfiguration.totalFeeAmount);
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
var readParam5 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue6 = (value) => {
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
    readParam5(req.params.postingId),
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
  const search = readQueryValue6(req.query.search);
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
  const search = readQueryValue6(req.query.search);
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
  const search = readQueryValue6(req.query.search);
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
  const result = await StudentService.updateSubmission(user.id, readParam5(req.params.submissionId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Submission updated successfully",
    data: result
  });
});
var deleteSubmission2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.deleteSubmission(user.id, readParam5(req.params.submissionId));
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
import { z as z12 } from "zod";
var uuidSchema6 = z12.uuid("Please provide a valid id");
var classworkTypeSchema = z12.enum(["TASK", "ASSIGNMENT", "QUIZ", "NOTICE"]);
var studentAcademicRecordSchema = z12.object({
  examName: z12.string("examName is required").trim().min(2).max(120),
  institute: z12.string("institute is required").trim().min(2).max(180),
  result: z12.string("result is required").trim().min(1).max(60),
  year: z12.number("year must be a number").int().min(1950).max(2100)
});
var createStudentApplicationProfileSchema = z12.object({
  body: z12.object({
    headline: z12.string("headline is required").trim().min(2).max(180),
    about: z12.string("about is required").trim().min(20).max(5e3),
    documentUrls: z12.array(z12.url("document URL must be valid").trim()).min(1),
    academicRecords: z12.array(studentAcademicRecordSchema).min(1)
  })
});
var updateStudentApplicationProfileSchema = z12.object({
  body: z12.object({
    headline: z12.string("headline must be a string").trim().min(2).max(180).optional(),
    about: z12.string("about must be a string").trim().min(20).max(5e3).optional(),
    documentUrls: z12.array(z12.url("document URL must be valid").trim()).optional(),
    academicRecords: z12.array(studentAcademicRecordSchema).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var createAdmissionApplicationSchema = z12.object({
  params: z12.object({
    postingId: uuidSchema6
  }),
  body: z12.object({
    coverLetter: z12.string("coverLetter must be a string").trim().max(2500).optional()
  })
});
var listTimelineSchema = z12.object({
  query: z12.object({
    semesterId: uuidSchema6.optional(),
    type: classworkTypeSchema.optional()
  })
});
var listRegisteredCoursesSchema = z12.object({
  query: z12.object({
    semesterId: uuidSchema6.optional()
  })
});
var listResultsSchema = z12.object({
  query: z12.object({
    semesterId: uuidSchema6
  })
});
var createSubmissionSchema = z12.object({
  body: z12.object({
    classworkId: uuidSchema6,
    responseText: z12.string("responseText must be a string").trim().max(5e3, "responseText must be at most 5000 characters").optional(),
    attachmentUrl: z12.url("attachmentUrl must be a valid URL").trim().optional(),
    attachmentName: z12.string("attachmentName must be a string").trim().max(200, "attachmentName must be at most 200 characters").optional()
  }).refine((value) => Boolean(value.responseText?.trim()) || Boolean(value.attachmentUrl?.trim()), {
    message: "responseText or attachmentUrl is required"
  })
});
var updateSubmissionSchema = z12.object({
  params: z12.object({
    submissionId: uuidSchema6
  }),
  body: z12.object({
    responseText: z12.string("responseText must be a string").trim().max(5e3, "responseText must be at most 5000 characters").optional(),
    attachmentUrl: z12.url("attachmentUrl must be a valid URL").trim().optional(),
    attachmentName: z12.string("attachmentName must be a string").trim().max(200, "attachmentName must be at most 200 characters").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var deleteSubmissionSchema = z12.object({
  params: z12.object({
    submissionId: uuidSchema6
  })
});
var listSubmissionsSchema = z12.object({
  query: z12.object({
    classworkId: uuidSchema6.optional(),
    semesterId: uuidSchema6.optional()
  })
});
var updateProfileSchema = z12.object({
  body: z12.object({
    name: z12.string("name must be a string").trim().min(2).max(120).optional(),
    image: z12.url("image must be a valid URL").trim().optional(),
    bio: z12.string("bio must be a string").trim().max(1200).optional(),
    contactNo: z12.string("contactNo must be a string").trim().max(30).optional(),
    presentAddress: z12.string("presentAddress must be a string").trim().max(300).optional(),
    permanentAddress: z12.string("permanentAddress must be a string").trim().max(300).optional(),
    bloodGroup: z12.string("bloodGroup must be a string").trim().max(10).optional(),
    gender: z12.string("gender must be a string").trim().max(20).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var initiateFeePaymentSchema = z12.object({
  body: z12.object({
    semesterId: uuidSchema6,
    paymentMode: z12.enum(["MONTHLY", "FULL"]),
    monthsCount: z12.number().int().positive().max(12).optional()
  }).refine(
    (value) => value.paymentMode === "MONTHLY" ? Boolean(value.monthsCount) : true,
    {
      path: ["monthsCount"],
      message: "monthsCount is required when paymentMode is MONTHLY"
    }
  )
});
var feeGatewayCallbackSchema = z12.object({
  query: z12.object({
    tran_id: z12.string().trim().min(3),
    val_id: z12.string().trim().min(1).optional(),
    amount: z12.string().trim().min(1).optional(),
    currency: z12.string().trim().min(1).optional(),
    status: z12.string().trim().min(1).optional()
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
var router11 = Router11();
router11.get("/profile", requireSessionRole("STUDENT"), StudentController.getProfileOverview);
router11.get(
  "/application-profile",
  requireSessionRole("STUDENT"),
  StudentController.getApplicationProfile
);
router11.post(
  "/application-profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createStudentApplicationProfileSchema),
  StudentController.createApplicationProfile
);
router11.patch(
  "/application-profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateStudentApplicationProfileSchema),
  StudentController.updateApplicationProfile
);
router11.delete(
  "/application-profile",
  requireSessionRole("STUDENT"),
  StudentController.deleteApplicationProfile
);
router11.post(
  "/admission-applications/:postingId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createAdmissionApplicationSchema),
  StudentController.applyToAdmissionPosting
);
router11.get(
  "/admission-applications",
  requireSessionRole("STUDENT"),
  StudentController.listMyAdmissionApplications
);
router11.patch(
  "/profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateProfileSchema),
  StudentController.updateProfile
);
router11.get(
  "/timeline",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listTimelineSchema),
  StudentController.listTimeline
);
router11.get(
  "/registered-courses",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listRegisteredCoursesSchema),
  StudentController.listRegisteredCourses
);
router11.get(
  "/routines",
  requireSessionRole("STUDENT"),
  StudentController.listRoutines
);
router11.get(
  "/results",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listResultsSchema),
  StudentController.listResults
);
router11.get(
  "/submissions",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listSubmissionsSchema),
  StudentController.listSubmissions
);
router11.post(
  "/submissions",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createSubmissionSchema),
  StudentController.createSubmission
);
router11.patch(
  "/submissions/:submissionId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateSubmissionSchema),
  StudentController.updateSubmission
);
router11.delete(
  "/submissions/:submissionId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.deleteSubmissionSchema),
  StudentController.deleteSubmission
);
router11.get("/fees/payment/success", StudentController.handleFeePaymentSuccessRedirect);
router11.get("/fees/payment/fail", StudentController.handleFeePaymentFailureRedirect);
router11.get("/fees/payment/cancel", StudentController.handleFeePaymentCancelRedirect);
router11.post("/fees/payment/success", StudentController.handleFeePaymentSuccessRedirect);
router11.post("/fees/payment/fail", StudentController.handleFeePaymentFailureRedirect);
router11.post("/fees/payment/cancel", StudentController.handleFeePaymentCancelRedirect);
router11.get("/fees", requireSessionRole("STUDENT"), StudentController.getFeeOverview);
router11.post(
  "/fees/initiate",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.initiateFeePaymentSchema),
  StudentController.initiateFeePayment
);
var StudentRouter = router11;

// src/app/module/teacher/teacher.route.ts
import { Router as Router12 } from "express";

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
function createHttpError12(statusCode, message) {
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
    throw createHttpError12(400, "Invalid date");
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
    throw createHttpError12(400, `${fieldName} cannot be negative`);
  }
  if (value > maxValue) {
    throw createHttpError12(400, `${fieldName} cannot exceed ${maxValue}`);
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
    throw createHttpError12(404, "User not found");
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
    throw createHttpError12(403, "Teacher is not assigned to any institution yet");
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
    throw createHttpError12(403, "Only institution admins can perform this action");
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
    throw createHttpError12(409, "Application profile already exists. Use update instead.");
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
    throw createHttpError12(404, "Application profile not found");
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
    throw createHttpError12(404, "Application profile not found");
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
    throw createHttpError12(
      400,
      "Complete your application profile (academic records, experiences, resume, and skills) before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError12(400, "You are already assigned to an institution");
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
    throw createHttpError12(404, "Teacher posting not found");
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
    throw createHttpError12(409, "You already applied to this posting");
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
      throw createHttpError12(403, "You are not assigned to this section");
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
    throw createHttpError12(403, "You are not assigned to this section");
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
    throw createHttpError12(404, "Classwork not found");
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
    throw createHttpError12(404, "Classwork not found");
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
    throw createHttpError12(404, "No students found for this section");
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
    throw createHttpError12(404, "No students found for this section");
  }
  const allowedRegistrationIds = new Set(registrations.map((item) => item.id));
  for (const item of payload.items) {
    if (!allowedRegistrationIds.has(item.courseRegistrationId)) {
      throw createHttpError12(400, "One or more attendance records are outside your assigned section");
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
    throw createHttpError12(404, "No students found for this section");
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
    throw createHttpError12(404, "Course registration not found for this teacher");
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
      throw createHttpError12(400, `${field} is not allowed for this course type`);
    }
    enforceMaxMark(value, max, field);
    dataToSave[field] = toTwoDecimals2(value);
  }
  if (Object.keys(dataToSave).length === 0) {
    throw createHttpError12(400, "No valid marks field provided for this course type");
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
    throw createHttpError12(404, "Application not found");
  }
  if (application.status === TeacherJobApplicationStatus.APPROVED || application.status === TeacherJobApplicationStatus.REJECTED) {
    throw createHttpError12(400, "Application has already been reviewed");
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
    throw createHttpError12(400, "departmentId is required to approve this application");
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
    throw createHttpError12(404, "Department not found for this institution");
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
      throw createHttpError12(400, "teacherInitial, teachersId and designation are required for approval");
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
var readParam6 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue7 = (value) => {
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
    readQueryValue7(req.query.search)
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
  const search = readQueryValue7(req.query.search);
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
    readParam6(req.params.classworkId),
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
  const result = await TeacherService.deleteClasswork(user.id, readParam6(req.params.classworkId));
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
    readParam6(req.params.courseRegistrationId),
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
    readParam6(req.params.applicationId),
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
import { z as z13 } from "zod";
var uuidSchema7 = z13.uuid("Please provide a valid id");
var classworkTypeSchema2 = z13.enum(["TASK", "ASSIGNMENT", "QUIZ", "NOTICE"]);
var attendanceStatusSchema = z13.enum(["PRESENT", "ABSENT"]);
var markFieldSchema = z13.number("Mark must be a number").min(0, "Mark cannot be negative").max(100, "Mark cannot exceed 100");
var createJobApplicationSchema = z13.object({
  params: z13.object({
    postingId: uuidSchema7
  }),
  body: z13.object({
    coverLetter: z13.string("Cover letter must be a string").trim().min(10, "Cover letter must be at least 10 characters").max(2500, "Cover letter must not exceed 2500 characters").optional()
  })
});
var academicRecordSchema = z13.object({
  degree: z13.string("degree is required").trim().min(2).max(120),
  institute: z13.string("institute is required").trim().min(2).max(180),
  result: z13.string("result is required").trim().min(1).max(60),
  year: z13.number("year must be a number").int().min(1950).max(2100)
});
var experienceRecordSchema = z13.object({
  organization: z13.string("organization is required").trim().min(2).max(180),
  title: z13.string("title is required").trim().min(2).max(120),
  startDate: z13.iso.datetime("startDate must be a valid ISO datetime"),
  endDate: z13.iso.datetime("endDate must be a valid ISO datetime").optional(),
  responsibilities: z13.string("responsibilities must be a string").trim().max(2e3).optional()
});
var createTeacherApplicationProfileSchema = z13.object({
  body: z13.object({
    headline: z13.string("headline is required").trim().min(2).max(180),
    about: z13.string("about is required").trim().min(20).max(5e3),
    resumeUrl: z13.url("resumeUrl must be a valid URL").trim(),
    portfolioUrl: z13.url("portfolioUrl must be a valid URL").trim().optional(),
    skills: z13.array(z13.string("skill must be a string").trim().min(1).max(60)).min(1, "At least one skill is required"),
    certifications: z13.array(z13.string("certification must be a string").trim().min(1).max(120)).optional(),
    academicRecords: z13.array(academicRecordSchema).min(1, "At least one academic record is required"),
    experiences: z13.array(experienceRecordSchema).min(1, "At least one experience record is required")
  })
});
var updateTeacherApplicationProfileSchema = z13.object({
  body: z13.object({
    headline: z13.string("headline must be a string").trim().min(2).max(180).optional(),
    about: z13.string("about must be a string").trim().min(20).max(5e3).optional(),
    resumeUrl: z13.url("resumeUrl must be a valid URL").trim().optional(),
    portfolioUrl: z13.url("portfolioUrl must be a valid URL").trim().optional(),
    skills: z13.array(z13.string("skill must be a string").trim().min(1).max(60)).optional(),
    certifications: z13.array(z13.string("certification must be a string").trim().min(1).max(120)).optional(),
    academicRecords: z13.array(academicRecordSchema).optional(),
    experiences: z13.array(experienceRecordSchema).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var updateProfileSchema2 = z13.object({
  body: z13.object({
    name: z13.string("name must be a string").trim().min(2).max(120).optional(),
    image: z13.url("image must be a valid URL").trim().optional(),
    bio: z13.string("bio must be a string").trim().max(1200).optional(),
    designation: z13.string("designation must be a string").trim().min(2).max(80).optional(),
    contactNo: z13.string("contactNo must be a string").trim().max(30).optional(),
    presentAddress: z13.string("presentAddress must be a string").trim().max(300).optional(),
    permanentAddress: z13.string("permanentAddress must be a string").trim().max(300).optional(),
    bloodGroup: z13.string("bloodGroup must be a string").trim().max(10).optional(),
    gender: z13.string("gender must be a string").trim().max(20).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var listClassworksSchema = z13.object({
  query: z13.object({
    sectionId: uuidSchema7.optional(),
    type: classworkTypeSchema2.optional(),
    search: z13.string("search must be a string").trim().max(120).optional()
  })
});
var createClassworkSchema = z13.object({
  body: z13.object({
    sectionId: uuidSchema7,
    type: classworkTypeSchema2,
    title: z13.string("Title is required").trim().min(2).max(180),
    content: z13.string("Content must be a string").trim().max(3e3, "Content must not exceed 3000 characters").optional(),
    dueAt: z13.iso.datetime("dueAt must be a valid ISO datetime").optional()
  })
});
var updateClassworkSchema = z13.object({
  params: z13.object({
    classworkId: uuidSchema7
  }),
  body: z13.object({
    type: classworkTypeSchema2.optional(),
    title: z13.string("Title must be a string").trim().min(2).max(180).optional(),
    content: z13.string("Content must be a string").trim().max(3e3, "Content must not exceed 3000 characters").optional(),
    dueAt: z13.iso.datetime("dueAt must be a valid ISO datetime").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var deleteClassworkSchema = z13.object({
  params: z13.object({
    classworkId: uuidSchema7
  })
});
var getSectionAttendanceSchema = z13.object({
  query: z13.object({
    sectionId: uuidSchema7,
    date: z13.iso.datetime("date must be a valid ISO datetime")
  })
});
var upsertSectionAttendanceSchema = z13.object({
  body: z13.object({
    sectionId: uuidSchema7,
    date: z13.iso.datetime("date must be a valid ISO datetime"),
    items: z13.array(
      z13.object({
        courseRegistrationId: uuidSchema7,
        status: attendanceStatusSchema
      })
    ).min(1, "At least one attendance item is required")
  })
});
var listSectionMarksSchema = z13.object({
  query: z13.object({
    sectionId: uuidSchema7
  })
});
var upsertMarkSchema = z13.object({
  params: z13.object({
    courseRegistrationId: uuidSchema7
  }),
  body: z13.object({
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
var listTeacherJobApplicationsSchema = z13.object({
  query: z13.object({
    status: z13.enum(["PENDING", "SHORTLISTED", "APPROVED", "REJECTED"]).optional()
  })
});
var reviewTeacherJobApplicationSchema = z13.object({
  params: z13.object({
    applicationId: uuidSchema7
  }),
  body: z13.object({
    status: z13.enum(["SHORTLISTED", "APPROVED", "REJECTED"]),
    responseMessage: z13.string("responseMessage must be a string").trim().max(1200).optional(),
    rejectionReason: z13.string("rejectionReason must be a string").trim().max(1200).optional(),
    teacherInitial: z13.string("teacherInitial must be a string").trim().min(2).max(15).optional(),
    teachersId: z13.string("teachersId must be a string").trim().min(2).max(30).optional(),
    designation: z13.string("designation must be a string").trim().min(2).max(80).optional(),
    bio: z13.string("bio must be a string").trim().max(1200).optional(),
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
var router12 = Router12();
router12.get("/profile", requireSessionRole("TEACHER"), TeacherController.getProfileOverview);
router12.patch(
  "/profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateProfileSchema),
  TeacherController.updateProfile
);
router12.get(
  "/application-profile",
  requireSessionRole("TEACHER"),
  TeacherController.getApplicationProfile
);
router12.post(
  "/application-profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createTeacherApplicationProfileSchema),
  TeacherController.createApplicationProfile
);
router12.patch(
  "/application-profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateTeacherApplicationProfileSchema),
  TeacherController.updateApplicationProfile
);
router12.delete(
  "/application-profile",
  requireSessionRole("TEACHER"),
  TeacherController.deleteApplicationProfile
);
router12.post(
  "/job-applications/:postingId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createJobApplicationSchema),
  TeacherController.applyToTeacherJobPosting
);
router12.get(
  "/job-applications",
  requireSessionRole("TEACHER"),
  TeacherController.listMyJobApplications
);
router12.get(
  "/sections",
  requireSessionRole("TEACHER"),
  TeacherController.listAssignedSectionsWithStudents
);
router12.get(
  "/routines",
  requireSessionRole("TEACHER"),
  TeacherController.listRoutines
);
router12.get(
  "/classworks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.listClassworksSchema),
  TeacherController.listClassworks
);
router12.post(
  "/classworks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createClassworkSchema),
  TeacherController.createClasswork
);
router12.patch(
  "/classworks/:classworkId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateClassworkSchema),
  TeacherController.updateClasswork
);
router12.delete(
  "/classworks/:classworkId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.deleteClassworkSchema),
  TeacherController.deleteClasswork
);
router12.get(
  "/attendance",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.getSectionAttendanceSchema),
  TeacherController.getSectionAttendanceForDay
);
router12.post(
  "/attendance",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.upsertSectionAttendanceSchema),
  TeacherController.upsertSectionAttendanceForDay
);
router12.get(
  "/marks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.listSectionMarksSchema),
  TeacherController.listSectionMarks
);
router12.post(
  "/marks/:courseRegistrationId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.upsertMarkSchema),
  TeacherController.upsertSectionMark
);
router12.get(
  "/applications",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(TeacherValidation.listTeacherJobApplicationsSchema),
  TeacherController.listTeacherApplicationsForAdmin
);
router12.patch(
  "/applications/:applicationId/review",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(TeacherValidation.reviewTeacherJobApplicationSchema),
  TeacherController.reviewTeacherApplication
);
var TeacherRouter = router12;

// src/app/routes/index.ts
var router13 = Router13();
router13.use("/auth", AuthRoutes);
router13.use("/classrooms", ClassroomRouter);
router13.use("/department", DepartmentRouter);
router13.use("/faculty", FacultyProfileRouter);
router13.use("/institute", InstituteRoutes);
router13.use("/institution-applications", InstitutionApplicationRouter);
router13.use("/institution-admin", InstitutionAdminRouter);
router13.use("/notices", NoticeRouter);
router13.use("/postings", PostingRouter);
router13.use("/routines", RoutineRouter);
router13.use("/teacher", TeacherRouter);
router13.use("/student", StudentRouter);
var IndexRouters = router13;

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
var isPaymentGatewayCallbackPath = (path3) => path3.startsWith("/api/v1/student/fees/payment/");
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
