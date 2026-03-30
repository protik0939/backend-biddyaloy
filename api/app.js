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
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n  requestedTransferRequests            InstitutionTransferRequest[]  @relation("TransferRequestRequesterUser")\n  reviewedTransferRequests             InstitutionTransferRequest[]  @relation("TransferRequestReviewerUser")\n  sentNotices                          Notice[]                      @relation("NoticeSenderUser")\n  readNotices                          NoticeRead[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                           Program[]\n  batches                            Batch[]\n  courses                            Course[]\n  sections                           Section[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  transferRequestsAsTargetDepartment InstitutionTransferRequest[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum InstitutionSubscriptionPlan {\n  MONTHLY\n  HALF_YEARLY\n  YEARLY\n}\n\nenum InstitutionSubscriptionPaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionSubscriptionStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionTransferEntityType {\n  STUDENT\n  TEACHER\n}\n\nenum InstitutionTransferStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  CANCELLED\n}\n\nenum NoticeAudienceRole {\n  ADMIN\n  FACULTY\n  DEPARTMENT\n  TEACHER\n  STUDENT\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                               @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                             @default(now())\n  updatedAt                   DateTime                             @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n  paymentGatewayCredential    InstitutionPaymentGatewayCredential?\n  subscriptions               InstitutionSubscription[]\n  schedules                   Schedule[]\n  routines                    Routine[]\n  notices                     Notice[]\n  sourceTransferRequests      InstitutionTransferRequest[]         @relation("TransferRequestSourceInstitution")\n  targetTransferRequests      InstitutionTransferRequest[]         @relation("TransferRequestTargetInstitution")\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  subscriptionPlan              InstitutionSubscriptionPlan?\n  subscriptionAmount            Decimal?                             @db.Decimal(12, 2)\n  subscriptionCurrency          String                               @default("BDT")\n  subscriptionMonths            Int?\n  subscriptionPaymentStatus     InstitutionSubscriptionPaymentStatus @default(PENDING)\n  subscriptionTranId            String?                              @unique\n  subscriptionGatewayStatus     String?\n  subscriptionGatewaySessionKey String?                              @unique\n  subscriptionGatewayValId      String?\n  subscriptionGatewayBankTranId String?\n  subscriptionGatewayCardType   String?\n  subscriptionGatewayRawPayload Json?\n  subscriptionPaidAt            DateTime?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution?              @relation(fields: [institutionId], references: [id])\n  subscriptions InstitutionSubscription[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel InstitutionTransferRequest {\n  id String @id @default(uuid())\n\n  entityType InstitutionTransferEntityType\n  status     InstitutionTransferStatus     @default(PENDING)\n\n  sourceInstitutionId String\n  sourceInstitution   Institution @relation("TransferRequestSourceInstitution", fields: [sourceInstitutionId], references: [id])\n\n  targetInstitutionId String\n  targetInstitution   Institution @relation("TransferRequestTargetInstitution", fields: [targetInstitutionId], references: [id])\n\n  requesterUserId String\n  requesterUser   User   @relation("TransferRequestRequesterUser", fields: [requesterUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TransferRequestReviewerUser", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  targetDepartmentId String?\n  targetDepartment   Department? @relation(fields: [targetDepartmentId], references: [id])\n\n  requestMessage  String?\n  responseMessage String?\n\n  requestedAt DateTime  @default(now())\n  reviewedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceInstitutionId, status])\n  @@index([targetInstitutionId, status])\n  @@index([requesterUserId])\n  @@index([studentProfileId])\n  @@index([teacherProfileId])\n  @@map("institution_transfer_requests")\n}\n\nmodel Notice {\n  id      String @id @default(uuid())\n  title   String\n  content String\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  senderUserId String\n  senderUser   User               @relation("NoticeSenderUser", fields: [senderUserId], references: [id])\n  senderRole   NoticeAudienceRole\n\n  recipients NoticeRecipientRole[]\n  reads      NoticeRead[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, createdAt])\n  @@index([senderUserId, createdAt])\n  @@map("notices")\n}\n\nmodel NoticeRecipientRole {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  role NoticeAudienceRole\n\n  createdAt DateTime @default(now())\n\n  @@unique([noticeId, role])\n  @@index([role])\n  @@map("notice_recipient_roles")\n}\n\nmodel NoticeRead {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  readAt DateTime @default(now())\n\n  @@unique([noticeId, userId])\n  @@index([userId, readAt])\n  @@map("notice_reads")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel InstitutionPaymentGatewayCredential {\n  id                               String      @id @default(uuid())\n  institutionId                    String      @unique\n  institution                      Institution @relation(fields: [institutionId], references: [id])\n  sslCommerzStoreIdEncrypted       String\n  sslCommerzStorePasswordEncrypted String\n  sslCommerzBaseUrlEncrypted       String\n  sslCommerzStoreIdHash            String\n  sslCommerzStorePasswordHash      String\n  sslCommerzBaseUrlHash            String\n  isActive                         Boolean     @default(true)\n  lastUpdatedByUserId              String?\n  createdAt                        DateTime    @default(now())\n  updatedAt                        DateTime    @updatedAt\n\n  @@index([institutionId, isActive])\n  @@map("institution_payment_gateway_credentials")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  semesterId String?\n  semester   Semester? @relation(fields: [semesterId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  startTime String\n  endTime   String\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@index([semesterId])\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  schedules           Schedule[]\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n  transferRequests      InstitutionTransferRequest[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel InstitutionSubscription {\n  id String @id @default(uuid())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  sourceApplicationId String?\n  sourceApplication   InstitutionApplication? @relation(fields: [sourceApplicationId], references: [id])\n\n  plan          InstitutionSubscriptionPlan\n  status        InstitutionSubscriptionStatus @default(ACTIVE)\n  amount        Decimal                       @db.Decimal(12, 2)\n  currency      String                        @default("BDT")\n  monthsCovered Int\n  startsAt      DateTime\n  endsAt        DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, status, endsAt])\n  @@index([sourceApplicationId])\n  @@map("institution_subscriptions")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n  transferRequests          InstitutionTransferRequest[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"requestedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestRequesterUser"},{"name":"reviewedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestReviewerUser"},{"name":"sentNotices","kind":"object","type":"Notice","relationName":"NoticeSenderUser"},{"name":"readNotices","kind":"object","type":"NoticeRead","relationName":"NoticeReadToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentToStudentFeePayment"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"DepartmentToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"DepartmentToRoutine"},{"name":"transferRequestsAsTargetDepartment","kind":"object","type":"InstitutionTransferRequest","relationName":"DepartmentToInstitutionTransferRequest"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"InstitutionToStudentFeePayment"},{"name":"paymentGatewayCredential","kind":"object","type":"InstitutionPaymentGatewayCredential","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionToInstitutionSubscription"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"InstitutionToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"InstitutionToRoutine"},{"name":"notices","kind":"object","type":"Notice","relationName":"InstitutionToNotice"},{"name":"sourceTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestSourceInstitution"},{"name":"targetTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestTargetInstitution"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"subscriptionPlan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"subscriptionAmount","kind":"scalar","type":"Decimal"},{"name":"subscriptionCurrency","kind":"scalar","type":"String"},{"name":"subscriptionMonths","kind":"scalar","type":"Int"},{"name":"subscriptionPaymentStatus","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"subscriptionTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayStatus","kind":"scalar","type":"String"},{"name":"subscriptionGatewaySessionKey","kind":"scalar","type":"String"},{"name":"subscriptionGatewayValId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayBankTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayCardType","kind":"scalar","type":"String"},{"name":"subscriptionGatewayRawPayload","kind":"scalar","type":"Json"},{"name":"subscriptionPaidAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"InstitutionTransferRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"entityType","kind":"enum","type":"InstitutionTransferEntityType"},{"name":"status","kind":"enum","type":"InstitutionTransferStatus"},{"name":"sourceInstitutionId","kind":"scalar","type":"String"},{"name":"sourceInstitution","kind":"object","type":"Institution","relationName":"TransferRequestSourceInstitution"},{"name":"targetInstitutionId","kind":"scalar","type":"String"},{"name":"targetInstitution","kind":"object","type":"Institution","relationName":"TransferRequestTargetInstitution"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"TransferRequestRequesterUser"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TransferRequestReviewerUser"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"targetDepartmentId","kind":"scalar","type":"String"},{"name":"targetDepartment","kind":"object","type":"Department","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"requestMessage","kind":"scalar","type":"String"},{"name":"responseMessage","kind":"scalar","type":"String"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_transfer_requests"},"Notice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToNotice"},{"name":"senderUserId","kind":"scalar","type":"String"},{"name":"senderUser","kind":"object","type":"User","relationName":"NoticeSenderUser"},{"name":"senderRole","kind":"enum","type":"NoticeAudienceRole"},{"name":"recipients","kind":"object","type":"NoticeRecipientRole","relationName":"NoticeToNoticeRecipientRole"},{"name":"reads","kind":"object","type":"NoticeRead","relationName":"NoticeToNoticeRead"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notices"},"NoticeRecipientRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRecipientRole"},{"name":"role","kind":"enum","type":"NoticeAudienceRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_recipient_roles"},"NoticeRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRead"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NoticeReadToUser"},{"name":"readAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_reads"},"DepartmentSemesterFeeConfiguration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"totalFeeAmount","kind":"scalar","type":"Decimal"},{"name":"monthlyFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"}],"dbName":"department_semester_fee_configurations"},"StudentFeePayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentFeePayment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentFeePayment"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SemesterToStudentFeePayment"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentFeePaymentToStudentProfile"},{"name":"feeConfigurationId","kind":"scalar","type":"String"},{"name":"feeConfiguration","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"},{"name":"paymentMode","kind":"enum","type":"StudentFeePaymentMode"},{"name":"status","kind":"enum","type":"StudentFeePaymentStatus"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paymentInitiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_fee_payments"},"InstitutionPaymentGatewayCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"sslCommerzStoreIdEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStoreIdHash","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordHash","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlHash","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"lastUpdatedByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_payment_gateway_credentials"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToRoutine"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"ScheduleToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSchedule"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSchedule"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"ScheduleToSemester"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"SemesterToStudentFeePayment"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"StudentFeePaymentToStudentProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"InstitutionSubscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscription"},{"name":"sourceApplicationId","kind":"scalar","type":"String"},{"name":"sourceApplication","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"endsAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscriptions"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","schedules","courseRegistrations","section","course","teacherProfile","sectionTeacherAssignments","classwork","classworkSubmissions","applications","_count","posting","studentUser","reviewerUser","studentProfile","admissionApplications","semester","feePayments","feeConfiguration","sourceInstitution","targetInstitution","requesterUser","targetDepartment","transferRequests","submissions","classworks","sections","batch","feeConfigurations","schedule","courseRegistration","routines","classRoom","attendances","mark","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","transferRequestsAsTargetDepartment","departments","faculties","classrooms","applicantUser","reviewedByUser","sourceApplication","subscriptions","institutionApplications","paymentGatewayCredential","senderUser","notice","recipients","reads","notices","sourceTransferRequests","targetTransferRequests","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","requestedTransferRequests","reviewedTransferRequests","sentNotices","readNotices","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","InstitutionTransferRequest.findUnique","InstitutionTransferRequest.findUniqueOrThrow","InstitutionTransferRequest.findFirst","InstitutionTransferRequest.findFirstOrThrow","InstitutionTransferRequest.findMany","InstitutionTransferRequest.createOne","InstitutionTransferRequest.createMany","InstitutionTransferRequest.createManyAndReturn","InstitutionTransferRequest.updateOne","InstitutionTransferRequest.updateMany","InstitutionTransferRequest.updateManyAndReturn","InstitutionTransferRequest.upsertOne","InstitutionTransferRequest.deleteOne","InstitutionTransferRequest.deleteMany","InstitutionTransferRequest.groupBy","InstitutionTransferRequest.aggregate","Notice.findUnique","Notice.findUniqueOrThrow","Notice.findFirst","Notice.findFirstOrThrow","Notice.findMany","Notice.createOne","Notice.createMany","Notice.createManyAndReturn","Notice.updateOne","Notice.updateMany","Notice.updateManyAndReturn","Notice.upsertOne","Notice.deleteOne","Notice.deleteMany","Notice.groupBy","Notice.aggregate","NoticeRecipientRole.findUnique","NoticeRecipientRole.findUniqueOrThrow","NoticeRecipientRole.findFirst","NoticeRecipientRole.findFirstOrThrow","NoticeRecipientRole.findMany","NoticeRecipientRole.createOne","NoticeRecipientRole.createMany","NoticeRecipientRole.createManyAndReturn","NoticeRecipientRole.updateOne","NoticeRecipientRole.updateMany","NoticeRecipientRole.updateManyAndReturn","NoticeRecipientRole.upsertOne","NoticeRecipientRole.deleteOne","NoticeRecipientRole.deleteMany","NoticeRecipientRole.groupBy","NoticeRecipientRole.aggregate","NoticeRead.findUnique","NoticeRead.findUniqueOrThrow","NoticeRead.findFirst","NoticeRead.findFirstOrThrow","NoticeRead.findMany","NoticeRead.createOne","NoticeRead.createMany","NoticeRead.createManyAndReturn","NoticeRead.updateOne","NoticeRead.updateMany","NoticeRead.updateManyAndReturn","NoticeRead.upsertOne","NoticeRead.deleteOne","NoticeRead.deleteMany","NoticeRead.groupBy","NoticeRead.aggregate","DepartmentSemesterFeeConfiguration.findUnique","DepartmentSemesterFeeConfiguration.findUniqueOrThrow","DepartmentSemesterFeeConfiguration.findFirst","DepartmentSemesterFeeConfiguration.findFirstOrThrow","DepartmentSemesterFeeConfiguration.findMany","DepartmentSemesterFeeConfiguration.createOne","DepartmentSemesterFeeConfiguration.createMany","DepartmentSemesterFeeConfiguration.createManyAndReturn","DepartmentSemesterFeeConfiguration.updateOne","DepartmentSemesterFeeConfiguration.updateMany","DepartmentSemesterFeeConfiguration.updateManyAndReturn","DepartmentSemesterFeeConfiguration.upsertOne","DepartmentSemesterFeeConfiguration.deleteOne","DepartmentSemesterFeeConfiguration.deleteMany","DepartmentSemesterFeeConfiguration.groupBy","DepartmentSemesterFeeConfiguration.aggregate","StudentFeePayment.findUnique","StudentFeePayment.findUniqueOrThrow","StudentFeePayment.findFirst","StudentFeePayment.findFirstOrThrow","StudentFeePayment.findMany","StudentFeePayment.createOne","StudentFeePayment.createMany","StudentFeePayment.createManyAndReturn","StudentFeePayment.updateOne","StudentFeePayment.updateMany","StudentFeePayment.updateManyAndReturn","StudentFeePayment.upsertOne","StudentFeePayment.deleteOne","StudentFeePayment.deleteMany","StudentFeePayment.groupBy","StudentFeePayment.aggregate","InstitutionPaymentGatewayCredential.findUnique","InstitutionPaymentGatewayCredential.findUniqueOrThrow","InstitutionPaymentGatewayCredential.findFirst","InstitutionPaymentGatewayCredential.findFirstOrThrow","InstitutionPaymentGatewayCredential.findMany","InstitutionPaymentGatewayCredential.createOne","InstitutionPaymentGatewayCredential.createMany","InstitutionPaymentGatewayCredential.createManyAndReturn","InstitutionPaymentGatewayCredential.updateOne","InstitutionPaymentGatewayCredential.updateMany","InstitutionPaymentGatewayCredential.updateManyAndReturn","InstitutionPaymentGatewayCredential.upsertOne","InstitutionPaymentGatewayCredential.deleteOne","InstitutionPaymentGatewayCredential.deleteMany","InstitutionPaymentGatewayCredential.groupBy","InstitutionPaymentGatewayCredential.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","InstitutionSubscription.findUnique","InstitutionSubscription.findUniqueOrThrow","InstitutionSubscription.findFirst","InstitutionSubscription.findFirstOrThrow","InstitutionSubscription.findMany","InstitutionSubscription.createOne","InstitutionSubscription.createMany","InstitutionSubscription.createManyAndReturn","InstitutionSubscription.updateOne","InstitutionSubscription.updateMany","InstitutionSubscription.updateManyAndReturn","InstitutionSubscription.upsertOne","InstitutionSubscription.deleteOne","InstitutionSubscription.deleteMany","InstitutionSubscription.groupBy","InstitutionSubscription.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","sourceApplicationId","InstitutionSubscriptionPlan","plan","InstitutionSubscriptionStatus","amount","currency","monthsCovered","startsAt","endsAt","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","sslCommerzStoreIdEncrypted","sslCommerzStorePasswordEncrypted","sslCommerzBaseUrlEncrypted","sslCommerzStoreIdHash","sslCommerzStorePasswordHash","sslCommerzBaseUrlHash","isActive","lastUpdatedByUserId","feeConfigurationId","StudentFeePaymentMode","paymentMode","StudentFeePaymentStatus","gatewayName","tranId","gatewaySessionKey","gatewayValId","gatewayBankTranId","gatewayCardType","gatewayStatus","gatewayRawPayload","paymentInitiatedAt","paidAt","totalFeeAmount","monthlyFeeAmount","noticeId","readAt","NoticeAudienceRole","role","senderUserId","senderRole","InstitutionTransferEntityType","entityType","InstitutionTransferStatus","sourceInstitutionId","targetInstitutionId","requesterUserId","targetDepartmentId","requestMessage","responseMessage","requestedAt","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","subscriptionPlan","subscriptionAmount","subscriptionCurrency","subscriptionMonths","InstitutionSubscriptionPaymentStatus","subscriptionPaymentStatus","subscriptionTranId","subscriptionGatewayStatus","subscriptionGatewaySessionKey","subscriptionGatewayValId","subscriptionGatewayBankTranId","subscriptionGatewayCardType","subscriptionGatewayRawPayload","subscriptionPaidAt","InstitutionApplicationStatus","rejectionReason","reviewedByUserId","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","accountStatus","date","AttendanceStatus","AdminRole","noticeId_userId","noticeId_role","postingId_teacherUserId","courseRegistrationId_date","departmentId_semesterId","postingId_studentUserId","classworkId_studentProfileId","sectionId_courseId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "8RznAoAFCwMAAJoKACAHAADYCgAg3gUAAIoMADDfBQAACwAQ4AUAAIoMADDhBQEAAAAB5gUBAJUKACHoBQEAAAAB6QVAAJkKACHqBUAAmQoAIe8GAACLDLgHIgEAAAABACAMAwAAmgoAIN4FAACNDAAw3wUAAAMAEOAFAACNDAAw4QUBAJUKACHoBQEAlQoAIekFQACZCgAh6gVAAJkKACGdB0AAmQoAIakHAQCVCgAhqgcBAJYKACGrBwEAlgoAIQMDAAD5DQAgqgcAAI4MACCrBwAAjgwAIAwDAACaCgAg3gUAAI0MADDfBQAAAwAQ4AUAAI0MADDhBQEAAAAB6AUBAJUKACHpBUAAmQoAIeoFQACZCgAhnQdAAJkKACGpBwEAAAABqgcBAJYKACGrBwEAlgoAIQMAAAADACABAAAEADACAAAFACARAwAAmgoAIN4FAACMDAAw3wUAAAcAEOAFAACMDAAw4QUBAJUKACHoBQEAlQoAIekFQACZCgAh6gVAAJkKACGgBwEAlQoAIaEHAQCVCgAhogcBAJYKACGjBwEAlgoAIaQHAQCWCgAhpQdAAMgLACGmB0AAyAsAIacHAQCWCgAhqAcBAJYKACEIAwAA-Q0AIKIHAACODAAgowcAAI4MACCkBwAAjgwAIKUHAACODAAgpgcAAI4MACCnBwAAjgwAIKgHAACODAAgEQMAAJoKACDeBQAAjAwAMN8FAAAHABDgBQAAjAwAMOEFAQAAAAHoBQEAlQoAIekFQACZCgAh6gVAAJkKACGgBwEAlQoAIaEHAQCVCgAhogcBAJYKACGjBwEAlgoAIaQHAQCWCgAhpQdAAMgLACGmB0AAyAsAIacHAQCWCgAhqAcBAJYKACEDAAAABwAgAQAACAAwAgAACQAgCwMAAJoKACAHAADYCgAg3gUAAIoMADDfBQAACwAQ4AUAAIoMADDhBQEAlQoAIeYFAQCVCgAh6AUBAJUKACHpBUAAmQoAIeoFQACZCgAh7wYAAIsMuAciAgMAAPkNACAHAACMEQAgAwAAAAsAIAEAAAwAMAIAAAEAIBYDAACaCgAgBwAA2AoAIAkAAN8LACANAADECgAgEQAAiwsAICIAAJQLACAkAACNCwAgSQAA1QoAIEoAAI8LACDeBQAAiQwAMN8FAAAOABDgBQAAiQwAMOEFAQCVCgAh4gUBAJUKACHjBQEAlQoAIeQFAQCVCgAh5QUBAJYKACHmBQEAlQoAIecFAQCVCgAh6AUBAJUKACHpBUAAmQoAIeoFQACZCgAhCgMAAPkNACAHAACMEQAgCQAAnxgAIA0AAJcQACARAACIFgAgIgAAkRYAICQAAIoWACBJAACGEQAgSgAAjBYAIOUFAACODAAgFgMAAJoKACAHAADYCgAgCQAA3wsAIA0AAMQKACARAACLCwAgIgAAlAsAICQAAI0LACBJAADVCgAgSgAAjwsAIN4FAACJDAAw3wUAAA4AEOAFAACJDAAw4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAJUKACHlBQEAlgoAIeYFAQCVCgAh5wUBAJUKACHoBQEAlQoAIekFQACZCgAh6gVAAJkKACEDAAAADgAgAQAADwAwAgAAEAAgDAcAAMsLACA5AACIDAAg3gUAAIcMADDfBQAAEgAQ4AUAAIcMADDhBQEAlQoAIeYFAQCWCgAh6QVAAJkKACHqBUAAmQoAIcAGAQCWCgAh_gYBAJYKACGTBwEAlQoAIQUHAACMEQAgOQAArxgAIOYFAACODAAgwAYAAI4MACD-BgAAjgwAIAwHAADLCwAgOQAAiAwAIN4FAACHDAAw3wUAABIAEOAFAACHDAAw4QUBAAAAAeYFAQCWCgAh6QVAAJkKACHqBUAAmQoAIcAGAQCWCgAh_gYBAJYKACGTBwEAlQoAIQMAAAASACABAAATADACAAAUACAkBgAAiAsAIAwAAMIKACANAADECgAgEQAAiwsAIBwAAMYKACAlAADDCgAgJwAAxQoAICoAAJILACAuAACECwAgLwAAhQsAIDAAAIcLACAxAACJCwAgMgAAigsAIDQAANUKACA1AACNCwAgNgAAjgsAIDcAAI8LACA6AACDCwAgOwAAhgsAID8AAJELACBAAACMCwAgQQAAkAsAIEYAAJMLACBHAACUCwAgSAAAlAsAIN4FAACBCwAw3wUAABYAEOAFAACBCwAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAhlQYAAIILgAcjugYBAJUKACHABgEAlgoAIf4GAQCWCgAhgQcBAJYKACEBAAAAFgAgHAgAAIYMACAMAADCCgAgDQAAxAoAIBEAAIsLACAcAADGCgAgJQAAwwoAICcAAMUKACAqAACSCwAgLgAAhAsAIC8AAIULACAwAACHCwAgMQAAiQsAIDIAAIoLACA0AADVCgAgNQAAjQsAIDYAAI4LACA3AACPCwAgOAAAlAsAIN4FAACFDAAw3wUAABgAEOAFAACFDAAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAhwAYBAJYKACHRBgEAlgoAIf4GAQCWCgAhkwcBAJUKACEVCAAArhgAIAwAAJUQACANAACXEAAgEQAAiBYAIBwAAJkQACAlAACWEAAgJwAAmBAAICoAAI8WACAuAACBFgAgLwAAghYAIDAAAIQWACAxAACGFgAgMgAAhxYAIDQAAIYRACA1AACKFgAgNgAAixYAIDcAAIwWACA4AACRFgAgwAYAAI4MACDRBgAAjgwAIP4GAACODAAgHAgAAIYMACAMAADCCgAgDQAAxAoAIBEAAIsLACAcAADGCgAgJQAAwwoAICcAAMUKACAqAACSCwAgLgAAhAsAIC8AAIULACAwAACHCwAgMQAAiQsAIDIAAIoLACA0AADVCgAgNQAAjQsAIDYAAI4LACA3AACPCwAgOAAAlAsAIN4FAACFDAAw3wUAABgAEOAFAACFDAAw4QUBAAAAAekFQACZCgAh6gVAAJkKACHABgEAlgoAIdEGAQCWCgAh_gYBAJYKACGTBwEAlQoAIQMAAAAYACABAAAZADACAAAaACABAAAAEgAgEgcAANgKACAJAADfCwAgDQAAxAoAIA8AAIcLACDeBQAAhAwAMN8FAAAdABDgBQAAhAwAMOEFAQCVCgAh5gUBAJUKACHnBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIcAGAQCWCgAhygYBAJYKACHLBkAAyAsAIcwGCADPCwAhzQYIAM8LACEJBwAAjBEAIAkAAJ8YACANAACXEAAgDwAAhBYAIMAGAACODAAgygYAAI4MACDLBgAAjgwAIMwGAACODAAgzQYAAI4MACASBwAA2AoAIAkAAN8LACANAADECgAgDwAAhwsAIN4FAACEDAAw3wUAAB0AEOAFAACEDAAw4QUBAAAAAeYFAQCVCgAh5wUBAJUKACHpBUAAmQoAIeoFQACZCgAhkgYBAJUKACHABgEAlgoAIcoGAQCWCgAhywZAAMgLACHMBggAzwsAIc0GCADPCwAhAwAAAB0AIAEAAB4AMAIAAB8AIBIHAADYCgAgCQAA3wsAIAoAAIIMACANAADECgAgEQAAiwsAIN4FAACDDAAw3wUAACEAEOAFAACDDAAw4QUBAJUKACHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIcAGAQCWCgAhzAYCAMULACHSBgEAlgoAIZUHAQCVCgAhlgcBAJUKACEIBwAAjBEAIAkAAJ8YACAKAACtGAAgDQAAlxAAIBEAAIgWACDABgAAjgwAIMwGAACODAAg0gYAAI4MACASBwAA2AoAIAkAAN8LACAKAACCDAAgDQAAxAoAIBEAAIsLACDeBQAAgwwAMN8FAAAhABDgBQAAgwwAMOEFAQAAAAHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIcAGAQCWCgAhzAYCAMULACHSBgEAlgoAIZUHAQAAAAGWBwEAlQoAIQMAAAAhACABAAAiADACAAAjACABAAAAHQAgGgcAANgKACAJAADSCwAgCgAAggwAIAsAAJILACAOAADzCwAgDwAA9gsAIBAAANELACAZAADoCwAgGwAA4AsAICwAAIAMACAtAACBDAAg3gUAAP8LADDfBQAAJgAQ4AUAAP8LADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhiQYBAJUKACGKBgEAlQoAIYsGAQCVCgAhjQYBAJUKACHCBgEAlQoAIdIGAQCWCgAhlAdAAJkKACENBwAAjBEAIAkAAJ8YACAKAACtGAAgCwAAjxYAIA4AAKYYACAPAACnGAAgEAAAnhgAIBkAAKIYACAbAAChGAAgLAAAqxgAIC0AAKwYACDnBQAAjgwAINIGAACODAAgGgcAANgKACAJAADSCwAgCgAAggwAIAsAAJILACAOAADzCwAgDwAA9gsAIBAAANELACAZAADoCwAgGwAA4AsAICwAAIAMACAtAACBDAAg3gUAAP8LADDfBQAAJgAQ4AUAAP8LADDhBQEAAAAB5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGJBgEAlQoAIYoGAQCVCgAhiwYBAJUKACGNBgEAlQoAIcIGAQCVCgAh0gYBAJYKACGUB0AAmQoAIQMAAAAmACABAAAnADACAAAoACATBwAAywsAIAkAANILACAoAAD9CwAgKQAA0AsAICsAAP4LACDeBQAA_AsAMN8FAAAqABDgBQAA_AsAMOEFAQCVCgAh5gUBAJYKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGfBgEAlQoAIboGAQCVCgAhwAYBAJYKACHHBgEAlgoAIcgGAQCVCgAhyQYBAJUKACEJBwAAjBEAIAkAAJ8YACAoAACpGAAgKQAAnRgAICsAAKoYACDmBQAAjgwAIOcFAACODAAgwAYAAI4MACDHBgAAjgwAIBMHAADLCwAgCQAA0gsAICgAAP0LACApAADQCwAgKwAA_gsAIN4FAAD8CwAw3wUAACoAEOAFAAD8CwAw4QUBAAAAAeYFAQCWCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhnwYBAJUKACG6BgEAlQoAIcAGAQCWCgAhxwYBAJYKACHIBgEAlQoAIckGAQCVCgAhAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACANDAAAwgoAIA0AAMQKACAcAADGCgAgJQAAwwoAICcAAMUKACDeBQAAwQoAMN8FAAAvABDgBQAAwQoAMOEFAQCVCgAh5gUBAJUKACG6BgEAlQoAIbsGQACZCgAhvAZAAJkKACEBAAAALwAgEgcAAMsLACAJAADSCwAgCwAAkgsAIBsAAPsLACDeBQAA-QsAMN8FAAAxABDgBQAA-QsAMOEFAQCVCgAh5gUBAJYKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGZBgAA-gvHBiK6BgEAlQoAIcAGAQCWCgAhwgYBAJYKACHEBgEAlQoAIcUGAQCVCgAhCAcAAIwRACAJAACfGAAgCwAAjxYAIBsAAKEYACDmBQAAjgwAIOcFAACODAAgwAYAAI4MACDCBgAAjgwAIBIHAADLCwAgCQAA0gsAIAsAAJILACAbAAD7CwAg3gUAAPkLADDfBQAAMQAQ4AUAAPkLADDhBQEAAAAB5gUBAJYKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGZBgAA-gvHBiK6BgEAlQoAIcAGAQCWCgAhwgYBAJYKACHEBgEAlQoAIcUGAQCVCgAhAwAAADEAIAEAADIAMAIAADMAIBQHAADYCgAgCQAA0gsAIA0AAMQKACARAACLCwAgGwAA4AsAICQAAI0LACAmAAD4CwAg3gUAAPcLADDfBQAANQAQ4AUAAPcLADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhugYBAJUKACHABgEAlgoAIcEGAgDFCwAhwgYBAJUKACHDBgEAlgoAIQsHAACMEQAgCQAAnxgAIA0AAJcQACARAACIFgAgGwAAoRgAICQAAIoWACAmAACoGAAg5wUAAI4MACDABgAAjgwAIMEGAACODAAgwwYAAI4MACAUBwAA2AoAIAkAANILACANAADECgAgEQAAiwsAIBsAAOALACAkAACNCwAgJgAA-AsAIN4FAAD3CwAw3wUAADUAEOAFAAD3CwAw4QUBAAAAAeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhugYBAJUKACHABgEAlgoAIcEGAgDFCwAhwgYBAJUKACHDBgEAlgoAIQMAAAA1ACABAAA2ADACAAA3ACADAAAAJgAgAQAAJwAwAgAAKAAgEAcAANgKACAJAADSCwAgDgAA8wsAIA8AAPYLACAQAADRCwAg3gUAAPULADDfBQAAOgAQ4AUAAPULADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhiQYBAJUKACGKBgEAlQoAIYsGAQCVCgAhBgcAAIwRACAJAACfGAAgDgAAphgAIA8AAKcYACAQAACeGAAg5wUAAI4MACARBwAA2AoAIAkAANILACAOAADzCwAgDwAA9gsAIBAAANELACDeBQAA9QsAMN8FAAA6ABDgBQAA9QsAMOEFAQAAAAHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIYkGAQCVCgAhigYBAJUKACGLBgEAlQoAIb8HAAD0CwAgAwAAADoAIAEAADsAMAIAADwAIAEAAAAYACATBwAA2AoAIAkAANILACAOAADzCwAgEAAA0QsAICMAAI4LACDeBQAA8QsAMN8FAAA_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_MGIvUGAQCVCgAh9gYBAJUKACH3BgEAlQoAIfgGAQCWCgAh-QYBAJYKACH6BgEAlgoAIfsGQACZCgAhDhAAAJ4YACAYAAD5DQAgGQAAohgAIB4AAIwRACAfAACMEQAgIAAA-Q0AICEAAJ8YACCLBgAAjgwAII0GAACODAAgmwYAAI4MACCeBgAAjgwAIPgGAACODAAg-QYAAI4MACD6BgAAjgwAIBoQAADXCwAgGAAAygsAIBkAAOQLACAeAADYCgAgHwAA2AoAICAAAJoKACAhAADSCwAg3gUAAOELADDfBQAAWwAQ4AUAAOELADDhBQEAAAAB6QVAAJkKACHqBUAAmQoAIYsGAQCWCgAhjQYBAJYKACGZBgAA4wv1BiKbBkAAyAsAIZ4GAQCWCgAh8wYAAOIL8wYi9QYBAJUKACH2BgEAlQoAIfcGAQCVCgAh-AYBAJYKACH5BgEAlgoAIfoGAQCWCgAh-wZAAJkKACEDAAAAWwAgAQAAXAAwAgAAXQAgAQAAAFEAIAEAAABTACABAAAADgAgAQAAABgAIAEAAAAmACABAAAARAAgAQAAAEsAIAEAAABVACABAAAAWwAgAQAAABgAIAEAAABEACABAAAAGAAgDQcAANgKACAJAADSCwAgJQAAwwoAIN4FAADZCwAw3wUAAGsAEOAFAADZCwAw4QUBAJUKACHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIboGAQCVCgAhwAYBAJYKACEBAAAAawAgAQAAABgAIAMAAAA1ACABAAA2ADACAAA3ACABAAAANQAgAQAAACYAIAEAAAA6ACABAAAAPwAgAwAAACYAIAEAACcAMAIAACgAIBEHAADYCgAgCQAA3wsAIBsAAOALACAcAADGCgAg3gUAAN4LADDfBQAAdAAQ4AUAAN4LADDhBQEAlQoAIeYFAQCVCgAh5wUBAJUKACHpBUAAmQoAIeoFQACZCgAhsgYBAJUKACHCBgEAlQoAIdoGIACYCgAh6gYQAL8LACHrBhAAvwsAIQQHAACMEQAgCQAAnxgAIBsAAKEYACAcAACZEAAgEgcAANgKACAJAADfCwAgGwAA4AsAIBwAAMYKACDeBQAA3gsAMN8FAAB0ABDgBQAA3gsAMOEFAQAAAAHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIbIGAQCVCgAhwgYBAJUKACHaBiAAmAoAIeoGEAC_CwAh6wYQAL8LACG8BwAA3QsAIAMAAAB0ACABAAB1ADACAAB2ACADAAAAVQAgAQAAVgAwAgAAVwAgAQAAADEAIAEAAAA1ACABAAAAJgAgAQAAAHQAIAEAAABVACABAAAAFgAgAQAAABgAIAEAAAAqACADAAAAKgAgAQAAKwAwAgAALAAgAQAAACoAIAEAAAAWACABAAAAGAAgCikAANALACDeBQAA2wsAMN8FAACFAQAQ4AUAANsLADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACGZBgAA3Au3ByKfBgEAlQoAIbUHQACZCgAhASkAAJ0YACALKQAA0AsAIN4FAADbCwAw3wUAAIUBABDgBQAA2wsAMOEFAQAAAAHpBUAAmQoAIeoFQACZCgAhmQYAANwLtwcinwYBAJUKACG1B0AAmQoAIbsHAADaCwAgAwAAAIUBACABAACGAQAwAgAAhwEAIBsHAADYCgAgCQAA0gsAIBAAANELACApAADQCwAg3gUAAM4LADDfBQAAiQEAEOAFAADOCwAw4QUBAJUKACHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIYsGAQCVCgAhnwYBAJUKACGgBggAzwsAIaEGCADPCwAhogYIAM8LACGjBggAzwsAIaQGCADPCwAhpQYIAM8LACGmBggAzwsAIacGCADPCwAhqAYIAM8LACGpBggAzwsAIaoGCADPCwAhqwYIAM8LACGsBggAzwsAIQEAAACJAQAgAQAAABgAIAEAAAAYACABAAAAHQAgAQAAACoAIAEAAACFAQAgAwAAADoAIAEAADsAMAIAADwAIAEAAAAmACABAAAAOgAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAhACABAAAAJgAgBQcAAIwRACAJAACfGAAgJQAAlhAAIOcFAACODAAgwAYAAI4MACANBwAA2AoAIAkAANILACAlAADDCgAg3gUAANkLADDfBQAAawAQ4AUAANkLADDhBQEAAAAB5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACG6BgEAlQoAIcAGAQCWCgAhAwAAAGsAIAEAAJYBADACAACXAQAgAwAAACEAIAEAACIAMAIAACMAIAMAAAA1ACABAAA2ADACAAA3ACADAAAADgAgAQAADwAwAgAAEAAgCgMAAPkNACAHAACMEQAgCQAAnxgAIA0AAJcQACATAACLFgAgGgAA9RAAIBwAAJkQACAiAACRFgAg5QUAAI4MACDnBQAAjgwAIBMDAACaCgAgBwAA2AoAIAkAANILACANAADECgAgEwAAjgsAIBoAANIKACAcAADGCgAgIgAAlAsAIN4FAADYCwAw3wUAAFMAEOAFAADYCwAw4QUBAAAAAeUFAQCWCgAh5gUBAJUKACHnBQEAlgoAIegFAQCVCgAh6QVAAJkKACHqBUAAmQoAIbYGAQAAAAEDAAAAUwAgAQAAnAEAMAIAAJ0BACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAADoAIAEAADsAMAIAADwAIBcHAADYCgAgCQAA0gsAIBAAANcLACAWAADWCwAgGAAAygsAIDMAAJoKACDeBQAA1AsAMN8FAAChAQAQ4AUAANQLADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAh9gUBAJUKACGLBgEAlgoAIZcGAQCWCgAhmQYAANULmQYimgYBAJYKACGbBkAAyAsAIZwGQACZCgAhnQYBAJUKACGeBgEAlgoAIQwHAACMEQAgCQAAnxgAIBAAAJ4YACAWAACgGAAgGAAA-Q0AIDMAAPkNACDnBQAAjgwAIIsGAACODAAglwYAAI4MACCaBgAAjgwAIJsGAACODAAgngYAAI4MACAYBwAA2AoAIAkAANILACAQAADXCwAgFgAA1gsAIBgAAMoLACAzAACaCgAg3gUAANQLADDfBQAAoQEAEOAFAADUCwAw4QUBAAAAAeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAh9gUBAJUKACGLBgEAlgoAIZcGAQCWCgAhmQYAANULmQYimgYBAJYKACGbBkAAyAsAIZwGQACZCgAhnQYBAJUKACGeBgEAlgoAIboHAADTCwAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACABAAAAoQEAIAEAAABRACABAAAADgAgAQAAABgAIAMAAAA_ACABAABAADACAABBACADAAAARAAgAQAARQAwAgAARgAgEgcAAIwRACAJAACfGAAgEAAAnhgAICkAAJ0YACDnBQAAjgwAIKAGAACODAAgoQYAAI4MACCiBgAAjgwAIKMGAACODAAgpAYAAI4MACClBgAAjgwAIKYGAACODAAgpwYAAI4MACCoBgAAjgwAIKkGAACODAAgqgYAAI4MACCrBgAAjgwAIKwGAACODAAgGwcAANgKACAJAADSCwAgEAAA0QsAICkAANALACDeBQAAzgsAMN8FAACJAQAQ4AUAAM4LADDhBQEAAAAB5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGLBgEAlQoAIZ8GAQAAAAGgBggAzwsAIaEGCADPCwAhogYIAM8LACGjBggAzwsAIaQGCADPCwAhpQYIAM8LACGmBggAzwsAIacGCADPCwAhqAYIAM8LACGpBggAzwsAIaoGCADPCwAhqwYIAM8LACGsBggAzwsAIQMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIAMAAAAxACABAAAyADACAAAzACADAAAAKgAgAQAAKwAwAgAALAAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAAAdACABAAAAawAgAQAAACEAIAEAAAA1ACABAAAADgAgAQAAAFMAIAEAAAAmACABAAAAOgAgAQAAAKEBACABAAAAPwAgAQAAAEQAIAEAAACJAQAgAQAAAHQAIAEAAABVACABAAAAMQAgAQAAACoAIAEAAABbACABAAAAGAAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAABrACABAACWAQAwAgAAlwEAIA4HAADYCgAgKgAAkgsAIN4FAADMCwAw3wUAAMgBABDgBQAAzAsAMOEFAQCVCgAh5gUBAJUKACHpBUAAmQoAIeoFQACZCgAhugYBAJYKACGXBwEAlQoAIZgHAQCVCgAhmQcCAMALACGbBwAAzQubByIDBwAAjBEAICoAAI8WACC6BgAAjgwAIA4HAADYCgAgKgAAkgsAIN4FAADMCwAw3wUAAMgBABDgBQAAzAsAMOEFAQAAAAHmBQEAlQoAIekFQACZCgAh6gVAAJkKACG6BgEAlgoAIZcHAQCVCgAhmAcBAJUKACGZBwIAwAsAIZsHAADNC5sHIgMAAADIAQAgAQAAyQEAMAIAAMoBACADAAAANQAgAQAANgAwAgAANwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAALACABAAAMADACAAABACADAAAADgAgAQAADwAwAgAAEAAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACAiBwAAywsAIDwAAJoKACA9AADKCwAgPwAAkQsAIN4FAADCCwAw3wUAANMBABDgBQAAwgsAMOEFAQCVCgAh5gUBAJYKACHpBUAAmQoAIeoFQACZCgAhmQYAAMkLkQcimwZAAMgLACHABgEAlgoAIfwGAQCVCgAh_QYBAJUKACH-BgEAlgoAIYAHAACCC4AHI4EHAQCWCgAhggcAAMMLrwYjgwcQAMQLACGEBwEAlQoAIYUHAgDFCwAhhwcAAMYLhwciiAcBAJYKACGJBwEAlgoAIYoHAQCWCgAhiwcBAJYKACGMBwEAlgoAIY0HAQCWCgAhjgcAAMcLACCPB0AAyAsAIZEHAQCWCgAhkgcBAJYKACEXBwAAjBEAIDwAAPkNACA9AAD5DQAgPwAAjhYAIOYFAACODAAgmwYAAI4MACDABgAAjgwAIP4GAACODAAggAcAAI4MACCBBwAAjgwAIIIHAACODAAggwcAAI4MACCFBwAAjgwAIIgHAACODAAgiQcAAI4MACCKBwAAjgwAIIsHAACODAAgjAcAAI4MACCNBwAAjgwAII4HAACODAAgjwcAAI4MACCRBwAAjgwAIJIHAACODAAgIgcAAMsLACA8AACaCgAgPQAAygsAID8AAJELACDeBQAAwgsAMN8FAADTAQAQ4AUAAMILADDhBQEAAAAB5gUBAJYKACHpBUAAmQoAIeoFQACZCgAhmQYAAMkLkQcimwZAAMgLACHABgEAlgoAIfwGAQCVCgAh_QYBAJUKACH-BgEAlgoAIYAHAACCC4AHI4EHAQCWCgAhggcAAMMLrwYjgwcQAMQLACGEBwEAlQoAIYUHAgDFCwAhhwcAAMYLhwciiAcBAAAAAYkHAQCWCgAhigcBAAAAAYsHAQCWCgAhjAcBAJYKACGNBwEAlgoAIY4HAADHCwAgjwdAAMgLACGRBwEAlgoAIZIHAQCWCgAhAwAAANMBACABAADUAQAwAgAA1QEAIAEAAABRACABAAAAFgAgEQcAANgKACA-AADBCwAg3gUAALwLADDfBQAA2QEAEOAFAAC8CwAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGZBgAAvguxBiKtBgEAlgoAIa8GAAC9C68GIrEGEAC_CwAhsgYBAJUKACGzBgIAwAsAIbQGQACZCgAhtQZAAJkKACEDBwAAjBEAID4AAJwYACCtBgAAjgwAIBEHAADYCgAgPgAAwQsAIN4FAAC8CwAw3wUAANkBABDgBQAAvAsAMOEFAQAAAAHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGZBgAAvguxBiKtBgEAlgoAIa8GAAC9C68GIrEGEAC_CwAhsgYBAJUKACGzBgIAwAsAIbQGQACZCgAhtQZAAJkKACEDAAAA2QEAIAEAANoBADACAADbAQAgAQAAANMBACABAAAA2QEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAEQAIAEAAEUAMAIAAEYAIAMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIBAHAADYCgAg3gUAANcKADDfBQAA5QEAEOAFAADXCgAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACHUBgEAlQoAIdUGAQCVCgAh1gYBAJUKACHXBgEAlQoAIdgGAQCVCgAh2QYBAJUKACHaBiAAmAoAIdsGAQCWCgAhAQAAAOUBACADAAAA2QEAIAEAANoBADACAADbAQAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAqACABAAArADACAAAsACAPBwAA2AoAIEIAAJoKACBEAAC7CwAgRQAAqgsAIN4FAAC6CwAw3wUAAOoBABDgBQAAugsAMOEFAQCVCgAh5gUBAJUKACHpBUAAmQoAIeoFQACZCgAhkgYBAJUKACGTBgEAlQoAIfAGAQCVCgAh8QYAALkL7wYiBAcAAIwRACBCAAD5DQAgRAAAmxgAIEUAAJEYACAPBwAA2AoAIEIAAJoKACBEAAC7CwAgRQAAqgsAIN4FAAC6CwAw3wUAAOoBABDgBQAAugsAMOEFAQAAAAHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIZMGAQCVCgAh8AYBAJUKACHxBgAAuQvvBiIDAAAA6gEAIAEAAOsBADACAADsAQAgCEMAALYLACDeBQAAuAsAMN8FAADuAQAQ4AUAALgLADDhBQEAlQoAIekFQACZCgAh7AYBAJUKACHvBgAAuQvvBiIBQwAAmhgAIAlDAAC2CwAg3gUAALgLADDfBQAA7gEAEOAFAAC4CwAw4QUBAAAAAekFQACZCgAh7AYBAJUKACHvBgAAuQvvBiK5BwAAtwsAIAMAAADuAQAgAQAA7wEAMAIAAPABACAJAwAAmgoAIEMAALYLACDeBQAAtQsAMN8FAADyAQAQ4AUAALULADDhBQEAlQoAIegFAQCVCgAh7AYBAJUKACHtBkAAmQoAIQIDAAD5DQAgQwAAmhgAIAoDAACaCgAgQwAAtgsAIN4FAAC1CwAw3wUAAPIBABDgBQAAtQsAMOEFAQAAAAHoBQEAlQoAIewGAQCVCgAh7QZAAJkKACG4BwAAtAsAIAMAAADyAQAgAQAA8wEAMAIAAPQBACABAAAA7gEAIAEAAADyAQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACABAAAAEgAgAQAAAB0AIAEAAABrACABAAAAyAEAIAEAAAA1ACABAAAAIQAgAQAAAAsAIAEAAAAOACABAAAAUwAgAQAAACYAIAEAAAA6ACABAAAA0wEAIAEAAAChAQAgAQAAAD8AIAEAAABEACABAAAAiQEAIAEAAAB0ACABAAAAVQAgAQAAANkBACABAAAAMQAgAQAAACoAIAEAAADqAQAgAQAAAFsAIAEAAABbACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA_ACABAABAADACAABBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAIkBACABAACsAQAwAgAArQEAIAMAAABbACABAABcADACAABdACABAAAAJgAgAQAAADoAIAEAAAA_ACABAAAAoQEAIAEAAACJAQAgAQAAAFsAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAADTAQAgAQAA1AEAMAIAANUBACADAAAA0wEAIAEAANQBADACAADVAQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACARMwAAmgoAIN4FAACUCgAw3wUAAKMCABDgBQAAlAoAMOEFAQCVCgAh6QVAAJkKACHqBUAAmQoAIfYFAQCVCgAh9wUBAJUKACH4BQEAlQoAIfkFAQCVCgAh-gUBAJYKACH7BQAAjgoAIPwFAACOCgAg_QUAAJcKACD-BQAAlwoAIP8FIACYCgAhAQAAAKMCACADAAAASwAgAQAATAAwAgAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIA0XAACaCgAg3gUAAL8KADDfBQAApwIAEOAFAAC_CgAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAh9wUBAJUKACH4BQEAlQoAIf0FAACXCgAg_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-xcAIAYAAPwXACAQAAD9FwAgGQAA_hcAIDQAAIEYACBAAAD_FwAgSwAAgBgAIEwAAIIYACBNAACDGAAgTgAAhBgAIE8AAIUYACBQAACGGAAgUQAAhxgAIFIAAIgYACBTAACJGAAgVAAAihgAIFUAAIsYACDhBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAEBWwAA8wIAIA_hBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAEBWwAA9QIAMAFbAAD1AgAwIQQAAMMWACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFMAANIWACBUAADTFgAgVQAA1BYAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAIQIAAADsAgAgWwAA-AIAIA_hBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACECAAAAUQAgWwAA-gIAIAIAAABRACBbAAD6AgAgAwAAAOwCACBiAADzAgAgYwAA-AIAIAEAAADsAgAgAQAAAFEAIAoVAADAFgAgaAAAwhYAIGkAAMEWACDlBQAAjgwAIK4HAACODAAgrwcAAI4MACCwBwAAjgwAILEHAACODAAgsgcAAI4MACCzBwAAjgwAIBLeBQAAowsAMN8FAACBAwAQ4AUAAKMLADDhBQEAggoAIeUFAQCDCgAh6QVAAIQKACHqBUAAhAoAIboGAQCCCgAh7wYBAIIKACGsBwEAggoAIa0HIACQCgAhrgcBAIMKACGvBwEAgwoAIbAHAQCDCgAhsQcBAIMKACGyBwEAgwoAIbMHAQCDCgAhtAcBAIIKACEDAAAAUQAgAQAAgAMAMGcAAIEDACADAAAAUQAgAQAA7wIAMAIAAOwCACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkDAAC_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_gMAMAFbAAD-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_gYBAIMKACGTBwEAggoAIQMAAAAYACABAADTBAAwZwAA1AQAIAMAAAAYACABAAAZADACAAAaACABAAAAFAAgAQAAABQAIAMAAAASACABAAATADACAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgAwAAABIAIAEAABMAMAIAABQAIAkHAACWFgAgOQAA5hUAIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB_gYBAAAAAZMHAQAAAAEBWwAA3AQAIAfhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABwAYBAAAAAf4GAQAAAAGTBwEAAAABAVsAAN4EADABWwAA3gQAMAEAAAAWACAJBwAAlRYAIDkAAJsUACDhBQEAkgwAIeYFAQCTDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQIAAAAUACBbAADiBAAgB-EFAQCSDAAh5gUBAJMMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACH-BgEAkwwAIZMHAQCSDAAhAgAAABIAIFsAAOQEACACAAAAEgAgWwAA5AQAIAEAAAAWACADAAAAFAAgYgAA3AQAIGMAAOIEACABAAAAFAAgAQAAABIAIAYVAACSFgAgaAAAlBYAIGkAAJMWACDmBQAAjgwAIMAGAACODAAg_gYAAI4MACAK3gUAAJULADDfBQAA7AQAEOAFAACVCwAw4QUBAIIKACHmBQEAgwoAIekFQACECgAh6gVAAIQKACHABgEAgwoAIf4GAQCDCgAhkwcBAIIKACEDAAAAEgAgAQAA6wQAMGcAAOwEACADAAAAEgAgAQAAEwAwAgAAFAAgJAYAAIgLACAMAADCCgAgDQAAxAoAIBEAAIsLACAcAADGCgAgJQAAwwoAICcAAMUKACAqAACSCwAgLgAAhAsAIC8AAIULACAwAACHCwAgMQAAiQsAIDIAAIoLACA0AADVCgAgNQAAjQsAIDYAAI4LACA3AACPCwAgOgAAgwsAIDsAAIYLACA_AACRCwAgQAAAjAsAIEEAAJALACBGAACTCwAgRwAAlAsAIEgAAJQLACDeBQAAgQsAMN8FAAAWABDgBQAAgQsAMOEFAQAAAAHpBUAAmQoAIeoFQACZCgAhlQYAAIILgAcjugYBAJUKACHABgEAlgoAIf4GAQCWCgAhgQcBAJYKACEBAAAA7wQAIAEAAADvBAAgHQYAAIUWACAMAACVEAAgDQAAlxAAIBEAAIgWACAcAACZEAAgJQAAlhAAICcAAJgQACAqAACPFgAgLgAAgRYAIC8AAIIWACAwAACEFgAgMQAAhhYAIDIAAIcWACA0AACGEQAgNQAAihYAIDYAAIsWACA3AACMFgAgOgAAgBYAIDsAAIMWACA_AACOFgAgQAAAiRYAIEEAAI0WACBGAACQFgAgRwAAkRYAIEgAAJEWACCVBgAAjgwAIMAGAACODAAg_gYAAI4MACCBBwAAjgwAIAMAAAAWACABAADyBAAwAgAA7wQAIAMAAAAWACABAADyBAAwAgAA7wQAIAMAAAAWACABAADyBAAwAgAA7wQAICEGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAVsAAPYEACAI4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAVsAAPgEADABWwAA-AQAMCEGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACECAAAA7wQAIFsAAPsEACAI4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACECAAAAFgAgWwAA_QQAIAIAAAAWACBbAAD9BAAgAwAAAO8EACBiAAD2BAAgYwAA-wQAIAEAAADvBAAgAQAAABYAIAcVAADqEQAgaAAA7BEAIGkAAOsRACCVBgAAjgwAIMAGAACODAAg_gYAAI4MACCBBwAAjgwAIAveBQAAgAsAMN8FAACEBQAQ4AUAAIALADDhBQEAggoAIekFQACECgAh6gVAAIQKACGVBgAA8QqAByO6BgEAggoAIcAGAQCDCgAh_gYBAIMKACGBBwEAgwoAIQMAAAAWACABAACDBQAwZwAAhAUAIAMAAAAWACABAADyBAAwAgAA7wQAIAEAAADVAQAgAQAAANUBACADAAAA0wEAIAEAANQBADACAADVAQAgAwAAANMBACABAADUAQAwAgAA1QEAIAMAAADTAQAgAQAA1AEAMAIAANUBACAfBwAA6BEAIDwAAOYRACA9AADnEQAgPwAA6REAIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAJEHApsGQAAAAAHABgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAABgAcAAACABwOBBwEAAAABggcAAACvBgODBxAAAAABhAcBAAAAAYUHAgAAAAGHBwAAAIcHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HgAAAAAGPB0AAAAABkQcBAAAAAZIHAQAAAAEBWwAAjAUAIBvhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABmQYAAACRBwKbBkAAAAABwAYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAYAHAAAAgAcDgQcBAAAAAYIHAAAArwYDgwcQAAAAAYQHAQAAAAGFBwIAAAABhwcAAACHBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB4AAAAABjwdAAAAAAZEHAQAAAAGSBwEAAAABAVsAAI4FADABWwAAjgUAMAEAAABRACABAAAAFgAgHwcAANgRACA8AADWEQAgPQAA1xEAID8AANkRACDhBQEAkgwAIeYFAQCTDAAh6QVAAJQMACHqBUAAlAwAIZkGAADVEZEHIpsGQACqDAAhwAYBAJMMACH8BgEAkgwAIf0GAQCSDAAh_gYBAJMMACGABwAA0RGAByOBBwEAkwwAIYIHAADSEa8GI4MHEADTEQAhhAcBAJIMACGFBwIAyA8AIYcHAADUEYcHIogHAQCTDAAhiQcBAJMMACGKBwEAkwwAIYsHAQCTDAAhjAcBAJMMACGNBwEAkwwAIY4HgAAAAAGPB0AAqgwAIZEHAQCTDAAhkgcBAJMMACECAAAA1QEAIFsAAJMFACAb4QUBAJIMACHmBQEAkwwAIekFQACUDAAh6gVAAJQMACGZBgAA1RGRByKbBkAAqgwAIcAGAQCTDAAh_AYBAJIMACH9BgEAkgwAIf4GAQCTDAAhgAcAANERgAcjgQcBAJMMACGCBwAA0hGvBiODBxAA0xEAIYQHAQCSDAAhhQcCAMgPACGHBwAA1BGHByKIBwEAkwwAIYkHAQCTDAAhigcBAJMMACGLBwEAkwwAIYwHAQCTDAAhjQcBAJMMACGOB4AAAAABjwdAAKoMACGRBwEAkwwAIZIHAQCTDAAhAgAAANMBACBbAACVBQAgAgAAANMBACBbAACVBQAgAQAAAFEAIAEAAAAWACADAAAA1QEAIGIAAIwFACBjAACTBQAgAQAAANUBACABAAAA0wEAIBgVAADMEQAgaAAAzxEAIGkAAM4RACDqAQAAzREAIOsBAADQEQAg5gUAAI4MACCbBgAAjgwAIMAGAACODAAg_gYAAI4MACCABwAAjgwAIIEHAACODAAgggcAAI4MACCDBwAAjgwAIIUHAACODAAgiAcAAI4MACCJBwAAjgwAIIoHAACODAAgiwcAAI4MACCMBwAAjgwAII0HAACODAAgjgcAAI4MACCPBwAAjgwAIJEHAACODAAgkgcAAI4MACAe3gUAAPAKADDfBQAAngUAEOAFAADwCgAw4QUBAIIKACHmBQEAgwoAIekFQACECgAh6gVAAIQKACGZBgAA9QqRByKbBkAAnwoAIcAGAQCDCgAh_AYBAIIKACH9BgEAggoAIf4GAQCDCgAhgAcAAPEKgAcjgQcBAIMKACGCBwAA8gqvBiODBxAA8woAIYQHAQCCCgAhhQcCAMgKACGHBwAA9AqHByKIBwEAgwoAIYkHAQCDCgAhigcBAIMKACGLBwEAgwoAIYwHAQCDCgAhjQcBAIMKACGOBwAA3AoAII8HQACfCgAhkQcBAIMKACGSBwEAgwoAIQMAAADTAQAgAQAAnQUAMGcAAJ4FACADAAAA0wEAIAEAANQBADACAADVAQAgAQAAAF0AIAEAAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACAXEAAAtQ4AIBgAALYMACAZAAC3DAAgHgAAswwAIB8AALQMACAgAAC1DAAgIQAAuAwAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAYsGAQAAAAGNBgEAAAABmQYAAAD1BgKbBkAAAAABngYBAAAAAfMGAAAA8wYC9QYBAAAAAfYGAQAAAAH3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BgEAAAAB-wZAAAAAAQFbAACmBQAgEOEFAQAAAAHpBUAAAAAB6gVAAAAAAYsGAQAAAAGNBgEAAAABmQYAAAD1BgKbBkAAAAABngYBAAAAAfMGAAAA8wYC9QYBAAAAAfYGAQAAAAH3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BgEAAAAB-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_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_gYAMAFbAAD-BgAwDwcAALAQACAJAACxEAAgDQAArxAAIA8AAK4QACDhBQEAkgwAIeYFAQCSDAAh5wUBAJIMACHpBUAAlAwAIeoFQACUDAAhkgYBAJIMACHABgEAkwwAIcoGAQCTDAAhywZAAKoMACHMBggAwwwAIc0GCADDDAAhAgAAAB8AIFsAAIEHACAL4QUBAJIMACHmBQEAkgwAIecFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZIGAQCSDAAhwAYBAJMMACHKBgEAkwwAIcsGQACqDAAhzAYIAMMMACHNBggAwwwAIQIAAAAdACBbAACDBwAgAgAAAB0AIFsAAIMHACADAAAAHwAgYgAA_AYAIGMAAIEHACABAAAAHwAgAQAAAB0AIAoVAACpEAAgaAAArBAAIGkAAKsQACDqAQAAqhAAIOsBAACtEAAgwAYAAI4MACDKBgAAjgwAIMsGAACODAAgzAYAAI4MACDNBgAAjgwAIA7eBQAAzwoAMN8FAACKBwAQ4AUAAM8KADDhBQEAggoAIeYFAQCCCgAh5wUBAIIKACHpBUAAhAoAIeoFQACECgAhkgYBAIIKACHABgEAgwoAIcoGAQCDCgAhywZAAJ8KACHMBggAqQoAIc0GCACpCgAhAwAAAB0AIAEAAIkHADBnAACKBwAgAwAAAB0AIAEAAB4AMAIAAB8AIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgEAcAANkNACAJAADaDQAgKAAA1w0AICkAAIsQACArAADYDQAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGfBgEAAAABugYBAAAAAcAGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAEBWwAAkgcAIAvhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAZ8GAQAAAAG6BgEAAAABwAYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAQFbAACUBwAwAVsAAJQHADABAAAAFgAgAQAAABgAIBAHAADUDQAgCQAA1Q0AICgAANINACApAACJEAAgKwAA0w0AIOEFAQCSDAAh5gUBAJMMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGfBgEAkgwAIboGAQCSDAAhwAYBAJMMACHHBgEAkwwAIcgGAQCSDAAhyQYBAJIMACECAAAALAAgWwAAmQcAIAvhBQEAkgwAIeYFAQCTDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhnwYBAJIMACG6BgEAkgwAIcAGAQCTDAAhxwYBAJMMACHIBgEAkgwAIckGAQCSDAAhAgAAACoAIFsAAJsHACACAAAAKgAgWwAAmwcAIAEAAAAWACABAAAAGAAgAwAAACwAIGIAAJIHACBjAACZBwAgAQAAACwAIAEAAAAqACAHFQAAphAAIGgAAKgQACBpAACnEAAg5gUAAI4MACDnBQAAjgwAIMAGAACODAAgxwYAAI4MACAO3gUAAM4KADDfBQAApAcAEOAFAADOCgAw4QUBAIIKACHmBQEAgwoAIecFAQCDCgAh6QVAAIQKACHqBUAAhAoAIZ8GAQCCCgAhugYBAIIKACHABgEAgwoAIccGAQCDCgAhyAYBAIIKACHJBgEAggoAIQMAAAAqACABAACjBwAwZwAApAcAIAMAAAAqACABAAArADACAAAsACABAAAAMwAgAQAAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAADEAIAEAADIAMAIAADMAIA8HAACOEAAgCQAAjxAAIAsAAI0QACAbAAClEAAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAMcGAroGAQAAAAHABgEAAAABwgYBAAAAAcQGAQAAAAHFBgEAAAABAVsAAKwHACAL4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAMcGAroGAQAAAAHABgEAAAABwgYBAAAAAcQGAQAAAAHFBgEAAAABAVsAAK4HADABWwAArgcAMAEAAAAvACABAAAAFgAgAQAAABgAIA8HAAD_DwAgCQAAgBAAIAsAAP4PACAbAACkEAAg4QUBAJIMACHmBQEAkwwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIZkGAAD8D8cGIroGAQCSDAAhwAYBAJMMACHCBgEAkwwAIcQGAQCSDAAhxQYBAJIMACECAAAAMwAgWwAAtAcAIAvhBQEAkgwAIeYFAQCTDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhmQYAAPwPxwYiugYBAJIMACHABgEAkwwAIcIGAQCTDAAhxAYBAJIMACHFBgEAkgwAIQIAAAAxACBbAAC2BwAgAgAAADEAIFsAALYHACABAAAALwAgAQAAABYAIAEAAAAYACADAAAAMwAgYgAArAcAIGMAALQHACABAAAAMwAgAQAAADEAIAcVAAChEAAgaAAAoxAAIGkAAKIQACDmBQAAjgwAIOcFAACODAAgwAYAAI4MACDCBgAAjgwAIA7eBQAAygoAMN8FAADABwAQ4AUAAMoKADDhBQEAggoAIeYFAQCDCgAh5wUBAIMKACHpBUAAhAoAIeoFQACECgAhmQYAAMsKxwYiugYBAIIKACHABgEAgwoAIcIGAQCDCgAhxAYBAIIKACHFBgEAggoAIQMAAAAxACABAAC_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_CgAw4QUBAAAAAekFQACZCgAh6gVAAJkKACH3BQEAlQoAIfgFAQCVCgAh_QUAAJcKACD_BSAAmAoAIbgGAQAAAAG5BgAAjgoAIAEAAAD1BwAgAQAAAPUHACABFwAA-Q0AIAMAAACnAgAgAQAA-AcAMAIAAPUHACADAAAApwIAIAEAAPgHADACAAD1BwAgAwAAAKcCACABAAD4BwAwAgAA9QcAIAoXAACGDwAg4QUBAAAAAekFQAAAAAHqBUAAAAAB9wUBAAAAAfgFAQAAAAH9BYAAAAAB_wUgAAAAAbgGAQAAAAG5BgAAhQ8AIAFbAAD8BwAgCeEFAQAAAAHpBUAAAAAB6gVAAAAAAfcFAQAAAAH4BQEAAAAB_QWAAAAAAf8FIAAAAAG4BgEAAAABuQYAAIUPACABWwAA_gcAMAFbAAD-BwAwChcAAIQPACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACH3BQEAkgwAIfgFAQCSDAAh_QWAAAAAAf8FIAD0DQAhuAYBAJIMACG5BgAAgw8AIAIAAAD1BwAgWwAAgQgAIAnhBQEAkgwAIekFQACUDAAh6gVAAJQMACH3BQEAkgwAIfgFAQCSDAAh_QWAAAAAAf8FIAD0DQAhuAYBAJIMACG5BgAAgw8AIAIAAACnAgAgWwAAgwgAIAIAAACnAgAgWwAAgwgAIAMAAAD1BwAgYgAA_AcAIGMAAIEIACABAAAA9QcAIAEAAACnAgAgAxUAAIAPACBoAACCDwAgaQAAgQ8AIAzeBQAAvgoAMN8FAACKCAAQ4AUAAL4KADDhBQEAggoAIekFQACECgAh6gVAAIQKACH3BQEAggoAIfgFAQCCCgAh_QUAAI8KACD_BSAAkAoAIbgGAQCCCgAhuQYAAI4KACADAAAApwIAIAEAAIkIADBnAACKCAAgAwAAAKcCACABAAD4BwAwAgAA9QcAIAEAAABNACABAAAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgEBYAANwOACAXAADdDgAgGAAA3g4AIBkAAP8OACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGNBgEAAAABlwYBAAAAAZkGAAAAuAYCmgYBAAAAAZsGQAAAAAGcBkAAAAABnQYBAAAAAZ4GAQAAAAG4BgEAAAABAVsAAJIIACAM4QUBAAAAAekFQAAAAAHqBUAAAAABjQYBAAAAAZcGAQAAAAGZBgAAALgGApoGAQAAAAGbBkAAAAABnAZAAAAAAZ0GAQAAAAGeBgEAAAABuAYBAAAAAQFbAACUCAAwAVsAAJQIADABAAAAUQAgAQAAAFMAIBAWAADYDgAgFwAA2Q4AIBgAANoOACAZAAD-DgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhjQYBAJMMACGXBgEAkwwAIZkGAADWDrgGIpoGAQCTDAAhmwZAAKoMACGcBkAAlAwAIZ0GAQCSDAAhngYBAJMMACG4BgEAkgwAIQIAAABNACBbAACZCAAgDOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIY0GAQCTDAAhlwYBAJMMACGZBgAA1g64BiKaBgEAkwwAIZsGQACqDAAhnAZAAJQMACGdBgEAkgwAIZ4GAQCTDAAhuAYBAJIMACECAAAASwAgWwAAmwgAIAIAAABLACBbAACbCAAgAQAAAFEAIAEAAABTACADAAAATQAgYgAAkggAIGMAAJkIACABAAAATQAgAQAAAEsAIAgVAAD7DgAgaAAA_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_AgAIA7hBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAh9gUBAJIMACGLBgEAkwwAIZcGAQCTDAAhmQYAANYMmQYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhnQYBAJIMACGeBgEAkwwAIQIAAAChAQAgWwAA_ggAIAIAAAChAQAgWwAA_ggAIAEAAABRACABAAAADgAgAQAAABgAIAMAAACjAQAgYgAA9AgAIGMAAPwIACABAAAAowEAIAEAAAChAQAgCRUAAIkOACBoAACLDgAgaQAAig4AIOcFAACODAAgiwYAAI4MACCXBgAAjgwAIJoGAACODAAgmwYAAI4MACCeBgAAjgwAIBHeBQAApAoAMN8FAACICQAQ4AUAAKQKADDhBQEAggoAIeYFAQCCCgAh5wUBAIMKACHpBUAAhAoAIeoFQACECgAh9gUBAIIKACGLBgEAgwoAIZcGAQCDCgAhmQYAAKUKmQYimgYBAIMKACGbBkAAnwoAIZwGQACECgAhnQYBAIIKACGeBgEAgwoAIQMAAAChAQAgAQAAhwkAMGcAAIgJACADAAAAoQEAIAEAAKIBADACAACjAQAgAQAAAEEAIAEAAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAAA_ACABAABAADACAABBACAQBwAAhw0AIAkAAIgNACAOAACGDQAgEAAAiA4AICMAAIkNACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGLBgEAAAABkgYBAAAAAZMGAQAAAAGVBgAAAJUGApYGQAAAAAEBWwAAkAkAIAvhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGLBgEAAAABkgYBAAAAAZMGAQAAAAGVBgAAAJUGApYGQAAAAAEBWwAAkgkAMAFbAACSCQAwAQAAABgAIBAHAADwDAAgCQAA8QwAIA4AAO8MACAQAACHDgAgIwAA8gwAIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGJBgEAkgwAIYsGAQCSDAAhkgYBAJIMACGTBgEAkwwAIZUGAADtDJUGIpYGQACqDAAhAgAAAEEAIFsAAJYJACAL4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhiwYBAJIMACGSBgEAkgwAIZMGAQCTDAAhlQYAAO0MlQYilgZAAKoMACECAAAAPwAgWwAAmAkAIAIAAAA_ACBbAACYCQAgAQAAABgAIAMAAABBACBiAACQCQAgYwAAlgkAIAEAAABBACABAAAAPwAgBhUAAIQOACBoAACGDgAgaQAAhQ4AIOcFAACODAAgkwYAAI4MACCWBgAAjgwAIA7eBQAAnQoAMN8FAACgCQAQ4AUAAJ0KADDhBQEAggoAIeYFAQCCCgAh5wUBAIMKACHpBUAAhAoAIeoFQACECgAhiQYBAIIKACGLBgEAggoAIZIGAQCCCgAhkwYBAIMKACGVBgAAngqVBiKWBkAAnwoAIQMAAAA_ACABAACfCQAwZwAAoAkAIAMAAAA_ACABAABAADACAABBACABAAAARgAgAQAAAEYAIAMAAABEACABAABFADACAABGACADAAAARAAgAQAARQAwAgAARgAgAwAAAEQAIAEAAEUAMAIAAEYAIA8HAACDDQAgCQAAhA0AIBIAAIMOACAZAACCDQAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGMBgEAAAABjQYBAAAAAY4GAQAAAAGPBgEAAAABkAYBAAAAAZEGQAAAAAEBWwAAqAkAIAvhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYwGAQAAAAGNBgEAAAABjgYBAAAAAY8GAQAAAAGQBgEAAAABkQZAAAAAAQFbAACqCQAwAVsAAKoJADABAAAAGAAgDwcAAP8MACAJAACADQAgEgAAgg4AIBkAAP4MACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhjAYBAJIMACGNBgEAkgwAIY4GAQCTDAAhjwYBAJMMACGQBgEAkwwAIZEGQACUDAAhAgAAAEYAIFsAAK4JACAL4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYwGAQCSDAAhjQYBAJIMACGOBgEAkwwAIY8GAQCTDAAhkAYBAJMMACGRBkAAlAwAIQIAAABEACBbAACwCQAgAgAAAEQAIFsAALAJACABAAAAGAAgAwAAAEYAIGIAAKgJACBjAACuCQAgAQAAAEYAIAEAAABEACAHFQAA_w0AIGgAAIEOACBpAACADgAg5wUAAI4MACCOBgAAjgwAII8GAACODAAgkAYAAI4MACAO3gUAAJwKADDfBQAAuAkAEOAFAACcCgAw4QUBAIIKACHmBQEAggoAIecFAQCDCgAh6QVAAIQKACHqBUAAhAoAIYwGAQCCCgAhjQYBAIIKACGOBgEAgwoAIY8GAQCDCgAhkAYBAIMKACGRBkAAhAoAIQMAAABEACABAAC3CQAwZwAAuAkAIAMAAABEACABAABFADACAABGACABAAAAPAAgAQAAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgAwAAADoAIAEAADsAMAIAADwAIA0HAACcDQAgCQAAnQ0AIA4AAJoNACAPAACbDQAgEAAA_g0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABAVsAAMAJACAI4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAEBWwAAwgkAMAFbAADCCQAwAQAAABgAIA0HAACXDQAgCQAAmA0AIA4AAJUNACAPAACWDQAgEAAA_Q0AIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGJBgEAkgwAIYoGAQCSDAAhiwYBAJIMACECAAAAPAAgWwAAxgkAIAjhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhiQYBAJIMACGKBgEAkgwAIYsGAQCSDAAhAgAAADoAIFsAAMgJACACAAAAOgAgWwAAyAkAIAEAAAAYACADAAAAPAAgYgAAwAkAIGMAAMYJACABAAAAPAAgAQAAADoAIAQVAAD6DQAgaAAA_A0AIGkAAPsNACDnBQAAjgwAIAveBQAAmwoAMN8FAADQCQAQ4AUAAJsKADDhBQEAggoAIeYFAQCCCgAh5wUBAIMKACHpBUAAhAoAIeoFQACECgAhiQYBAIIKACGKBgEAggoAIYsGAQCCCgAhAwAAADoAIAEAAM8JADBnAADQCQAgAwAAADoAIAEAADsAMAIAADwAIBEzAACaCgAg3gUAAJQKADDfBQAAowIAEOAFAACUCgAw4QUBAAAAAekFQACZCgAh6gVAAJkKACH2BQEAAAAB9wUBAJUKACH4BQEAlQoAIfkFAQCVCgAh-gUBAJYKACH7BQAAjgoAIPwFAACOCgAg_QUAAJcKACD-BQAAlwoAIP8FIACYCgAhAQAAANMJACABAAAA0wkAIAIzAAD5DQAg-gUAAI4MACADAAAAowIAIAEAANYJADACAADTCQAgAwAAAKMCACABAADWCQAwAgAA0wkAIAMAAACjAgAgAQAA1gkAMAIAANMJACAOMwAA-A0AIOEFAQAAAAHpBUAAAAAB6gVAAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUAAPYNACD8BQAA9w0AIP0FgAAAAAH-BYAAAAAB_wUgAAAAAQFbAADaCQAgDeEFAQAAAAHpBUAAAAAB6gVAAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUAAPYNACD8BQAA9w0AIP0FgAAAAAH-BYAAAAAB_wUgAAAAAQFbAADcCQAwAVsAANwJADAOMwAA9Q0AIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIfYFAQCSDAAh9wUBAJIMACH4BQEAkgwAIfkFAQCSDAAh-gUBAJMMACH7BQAA8g0AIPwFAADzDQAg_QWAAAAAAf4FgAAAAAH_BSAA9A0AIQIAAADTCQAgWwAA3wkAIA3hBQEAkgwAIekFQACUDAAh6gVAAJQMACH2BQEAkgwAIfcFAQCSDAAh-AUBAJIMACH5BQEAkgwAIfoFAQCTDAAh-wUAAPINACD8BQAA8w0AIP0FgAAAAAH-BYAAAAAB_wUgAPQNACECAAAAowIAIFsAAOEJACACAAAAowIAIFsAAOEJACADAAAA0wkAIGIAANoJACBjAADfCQAgAQAAANMJACABAAAAowIAIAQVAADvDQAgaAAA8Q0AIGkAAPANACD6BQAAjgwAIBDeBQAAjQoAMN8FAADoCQAQ4AUAAI0KADDhBQEAggoAIekFQACECgAh6gVAAIQKACH2BQEAggoAIfcFAQCCCgAh-AUBAIIKACH5BQEAggoAIfoFAQCDCgAh-wUAAI4KACD8BQAAjgoAIP0FAACPCgAg_gUAAI8KACD_BSAAkAoAIQMAAACjAgAgAQAA5wkAMGcAAOgJACADAAAAowIAIAEAANYJADACAADTCQAgAQAAABAAIAEAAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAAAOACABAAAPADACAAAQACATAwAA7g0AIAcAAOYNACAJAADtDQAgDQAA5w0AIBEAAOgNACAiAADsDQAgJAAA6Q0AIEkAAOoNACBKAADrDQAg4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAAAAAeUFAQAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHpBUAAAAAB6gVAAAAAAQFbAADwCQAgCuEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFAQAAAAHlBQEAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6QVAAAAAAeoFQAAAAAEBWwAA8gkAMAFbAADyCQAwEwMAAJ0MACAHAACVDAAgCQAAnAwAIA0AAJYMACARAACXDAAgIgAAmwwAICQAAJgMACBJAACZDAAgSgAAmgwAIOEFAQCSDAAh4gUBAJIMACHjBQEAkgwAIeQFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCSDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhAgAAABAAIFsAAPUJACAK4QUBAJIMACHiBQEAkgwAIeMFAQCSDAAh5AUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJIMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACECAAAADgAgWwAA9wkAIAIAAAAOACBbAAD3CQAgAwAAABAAIGIAAPAJACBjAAD1CQAgAQAAABAAIAEAAAAOACAEFQAAjwwAIGgAAJEMACBpAACQDAAg5QUAAI4MACAN3gUAAIEKADDfBQAA_gkAEOAFAACBCgAw4QUBAIIKACHiBQEAggoAIeMFAQCCCgAh5AUBAIIKACHlBQEAgwoAIeYFAQCCCgAh5wUBAIIKACHoBQEAggoAIekFQACECgAh6gVAAIQKACEDAAAADgAgAQAA_QkAMGcAAP4JACADAAAADgAgAQAADwAwAgAAEAAgDd4FAACBCgAw3wUAAP4JABDgBQAAgQoAMOEFAQCCCgAh4gUBAIIKACHjBQEAggoAIeQFAQCCCgAh5QUBAIMKACHmBQEAggoAIecFAQCCCgAh6AUBAIIKACHpBUAAhAoAIeoFQACECgAhDhUAAIYKACBoAACMCgAgaQAAjAoAIOsFAQAAAAHsBQEAAAAE7QUBAAAABO4FAQAAAAHvBQEAAAAB8AUBAAAAAfEFAQAAAAHyBQEAiwoAIfMFAQAAAAH0BQEAAAAB9QUBAAAAAQ4VAACJCgAgaAAAigoAIGkAAIoKACDrBQEAAAAB7AUBAAAABe0FAQAAAAXuBQEAAAAB7wUBAAAAAfAFAQAAAAHxBQEAAAAB8gUBAIgKACHzBQEAAAAB9AUBAAAAAfUFAQAAAAELFQAAhgoAIGgAAIcKACBpAACHCgAg6wVAAAAAAewFQAAAAATtBUAAAAAE7gVAAAAAAe8FQAAAAAHwBUAAAAAB8QVAAAAAAfIFQACFCgAhCxUAAIYKACBoAACHCgAgaQAAhwoAIOsFQAAAAAHsBUAAAAAE7QVAAAAABO4FQAAAAAHvBUAAAAAB8AVAAAAAAfEFQAAAAAHyBUAAhQoAIQjrBQIAAAAB7AUCAAAABO0FAgAAAATuBQIAAAAB7wUCAAAAAfAFAgAAAAHxBQIAAAAB8gUCAIYKACEI6wVAAAAAAewFQAAAAATtBUAAAAAE7gVAAAAAAe8FQAAAAAHwBUAAAAAB8QVAAAAAAfIFQACHCgAhDhUAAIkKACBoAACKCgAgaQAAigoAIOsFAQAAAAHsBQEAAAAF7QUBAAAABe4FAQAAAAHvBQEAAAAB8AUBAAAAAfEFAQAAAAHyBQEAiAoAIfMFAQAAAAH0BQEAAAAB9QUBAAAAAQjrBQIAAAAB7AUCAAAABe0FAgAAAAXuBQIAAAAB7wUCAAAAAfAFAgAAAAHxBQIAAAAB8gUCAIkKACEL6wUBAAAAAewFAQAAAAXtBQEAAAAF7gUBAAAAAe8FAQAAAAHwBQEAAAAB8QUBAAAAAfIFAQCKCgAh8wUBAAAAAfQFAQAAAAH1BQEAAAABDhUAAIYKACBoAACMCgAgaQAAjAoAIOsFAQAAAAHsBQEAAAAE7QUBAAAABO4FAQAAAAHvBQEAAAAB8AUBAAAAAfEFAQAAAAHyBQEAiwoAIfMFAQAAAAH0BQEAAAAB9QUBAAAAAQvrBQEAAAAB7AUBAAAABO0FAQAAAATuBQEAAAAB7wUBAAAAAfAFAQAAAAHxBQEAAAAB8gUBAIwKACHzBQEAAAAB9AUBAAAAAfUFAQAAAAEQ3gUAAI0KADDfBQAA6AkAEOAFAACNCgAw4QUBAIIKACHpBUAAhAoAIeoFQACECgAh9gUBAIIKACH3BQEAggoAIfgFAQCCCgAh-QUBAIIKACH6BQEAgwoAIfsFAACOCgAg_AUAAI4KACD9BQAAjwoAIP4FAACPCgAg_wUgAJAKACEE6wUBAAAABYYGAQAAAAGHBgEAAAAEiAYBAAAABA8VAACGCgAgaAAAkwoAIGkAAJMKACDrBYAAAAAB7gWAAAAAAe8FgAAAAAHwBYAAAAAB8QWAAAAAAfIFgAAAAAGABgEAAAABgQYBAAAAAYIGAQAAAAGDBoAAAAABhAaAAAAAAYUGgAAAAAEFFQAAhgoAIGgAAJIKACBpAACSCgAg6wUgAAAAAfIFIACRCgAhBRUAAIYKACBoAACSCgAgaQAAkgoAIOsFIAAAAAHyBSAAkQoAIQLrBSAAAAAB8gUgAJIKACEM6wWAAAAAAe4FgAAAAAHvBYAAAAAB8AWAAAAAAfEFgAAAAAHyBYAAAAABgAYBAAAAAYEGAQAAAAGCBgEAAAABgwaAAAAAAYQGgAAAAAGFBoAAAAABETMAAJoKACDeBQAAlAoAMN8FAACjAgAQ4AUAAJQKADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACH2BQEAlQoAIfcFAQCVCgAh-AUBAJUKACH5BQEAlQoAIfoFAQCWCgAh-wUAAI4KACD8BQAAjgoAIP0FAACXCgAg_gUAAJcKACD_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_eBQAArAoAMN8FAADUCAAQ4AUAAKwKADDhBQEAggoAIeYFAQCCCgAh6QVAAIQKACHqBUAAhAoAIZkGAACuCrEGIq0GAQCDCgAhrwYAAK0KrwYisQYQAK8KACGyBgEAggoAIbMGAgCwCgAhtAZAAIQKACG1BkAAhAoAIQcVAACGCgAgaAAAuAoAIGkAALgKACDrBQAAAK8GAuwFAAAArwYI7QUAAACvBgjyBQAAtwqvBiIHFQAAhgoAIGgAALYKACBpAAC2CgAg6wUAAACxBgLsBQAAALEGCO0FAAAAsQYI8gUAALUKsQYiDRUAAIYKACBoAAC0CgAgaQAAtAoAIOoBAAC0CgAg6wEAALQKACDrBRAAAAAB7AUQAAAABO0FEAAAAATuBRAAAAAB7wUQAAAAAfAFEAAAAAHxBRAAAAAB8gUQALMKACENFQAAhgoAIGgAAIYKACBpAACGCgAg6gEAALIKACDrAQAAhgoAIOsFAgAAAAHsBQIAAAAE7QUCAAAABO4FAgAAAAHvBQIAAAAB8AUCAAAAAfEFAgAAAAHyBQIAsQoAIQ0VAACGCgAgaAAAhgoAIGkAAIYKACDqAQAAsgoAIOsBAACGCgAg6wUCAAAAAewFAgAAAATtBQIAAAAE7gUCAAAAAe8FAgAAAAHwBQIAAAAB8QUCAAAAAfIFAgCxCgAhCOsFCAAAAAHsBQgAAAAE7QUIAAAABO4FCAAAAAHvBQgAAAAB8AUIAAAAAfEFCAAAAAHyBQgAsgoAIQ0VAACGCgAgaAAAtAoAIGkAALQKACDqAQAAtAoAIOsBAAC0CgAg6wUQAAAAAewFEAAAAATtBRAAAAAE7gUQAAAAAe8FEAAAAAHwBRAAAAAB8QUQAAAAAfIFEACzCgAhCOsFEAAAAAHsBRAAAAAE7QUQAAAABO4FEAAAAAHvBRAAAAAB8AUQAAAAAfEFEAAAAAHyBRAAtAoAIQcVAACGCgAgaAAAtgoAIGkAALYKACDrBQAAALEGAuwFAAAAsQYI7QUAAACxBgjyBQAAtQqxBiIE6wUAAACxBgLsBQAAALEGCO0FAAAAsQYI8gUAALYKsQYiBxUAAIYKACBoAAC4CgAgaQAAuAoAIOsFAAAArwYC7AUAAACvBgjtBQAAAK8GCPIFAAC3Cq8GIgTrBQAAAK8GAuwFAAAArwYI7QUAAACvBgjyBQAAuAqvBiIL3gUAALkKADDfBQAAvAgAEOAFAAC5CgAw4QUBAIIKACHlBQEAgwoAIeYFAQCCCgAh5wUBAIMKACHoBQEAggoAIekFQACECgAh6gVAAIQKACG2BgEAggoAIQ_eBQAAugoAMN8FAACkCAAQ4AUAALoKADDhBQEAggoAIekFQACECgAh6gVAAIQKACGNBgEAgwoAIZcGAQCDCgAhmQYAALsKuAYimgYBAIMKACGbBkAAnwoAIZwGQACECgAhnQYBAIIKACGeBgEAgwoAIbgGAQCCCgAhBxUAAIYKACBoAAC9CgAgaQAAvQoAIOsFAAAAuAYC7AUAAAC4BgjtBQAAALgGCPIFAAC8CrgGIgcVAACGCgAgaAAAvQoAIGkAAL0KACDrBQAAALgGAuwFAAAAuAYI7QUAAAC4BgjyBQAAvAq4BiIE6wUAAAC4BgLsBQAAALgGCO0FAAAAuAYI8gUAAL0KuAYiDN4FAAC-CgAw3wUAAIoIABDgBQAAvgoAMOEFAQCCCgAh6QVAAIQKACHqBUAAhAoAIfcFAQCCCgAh-AUBAIIKACH9BQAAjwoAIP8FIACQCgAhuAYBAIIKACG5BgAAjgoAIA0XAACaCgAg3gUAAL8KADDfBQAApwIAEOAFAAC_CgAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAh9wUBAJUKACH4BQEAlQoAIf0FAACXCgAg_wUgAJgKACG4BgEAlQoAIbkGAACOCgAgCN4FAADACgAw3wUAAPIHABDgBQAAwAoAMOEFAQCCCgAh5gUBAIIKACG6BgEAggoAIbsGQACECgAhvAZAAIQKACENDAAAwgoAIA0AAMQKACAcAADGCgAgJQAAwwoAICcAAMUKACDeBQAAwQoAMN8FAAAvABDgBQAAwQoAMOEFAQCVCgAh5gUBAJUKACG6BgEAlQoAIbsGQACZCgAhvAZAAJkKACEDvQYAADEAIL4GAAAxACC_BgAAMQAgA70GAAA1ACC-BgAANQAgvwYAADUAIAO9BgAAJgAgvgYAACYAIL8GAAAmACADvQYAAHQAIL4GAAB0ACC_BgAAdAAgA70GAABVACC-BgAAVQAgvwYAAFUAIA3eBQAAxwoAMN8FAADaBwAQ4AUAAMcKADDhBQEAggoAIeYFAQCCCgAh5wUBAIMKACHpBUAAhAoAIeoFQACECgAhugYBAIIKACHABgEAgwoAIcEGAgDICgAhwgYBAIIKACHDBgEAgwoAIQ0VAACJCgAgaAAAiQoAIGkAAIkKACDqAQAAqwoAIOsBAACJCgAg6wUCAAAAAewFAgAAAAXtBQIAAAAF7gUCAAAAAe8FAgAAAAHwBQIAAAAB8QUCAAAAAfIFAgDJCgAhDRUAAIkKACBoAACJCgAgaQAAiQoAIOoBAACrCgAg6wEAAIkKACDrBQIAAAAB7AUCAAAABe0FAgAAAAXuBQIAAAAB7wUCAAAAAfAFAgAAAAHxBQIAAAAB8gUCAMkKACEO3gUAAMoKADDfBQAAwAcAEOAFAADKCgAw4QUBAIIKACHmBQEAgwoAIecFAQCDCgAh6QVAAIQKACHqBUAAhAoAIZkGAADLCscGIroGAQCCCgAhwAYBAIMKACHCBgEAgwoAIcQGAQCCCgAhxQYBAIIKACEHFQAAhgoAIGgAAM0KACBpAADNCgAg6wUAAADHBgLsBQAAAMcGCO0FAAAAxwYI8gUAAMwKxwYiBxUAAIYKACBoAADNCgAgaQAAzQoAIOsFAAAAxwYC7AUAAADHBgjtBQAAAMcGCPIFAADMCscGIgTrBQAAAMcGAuwFAAAAxwYI7QUAAADHBgjyBQAAzQrHBiIO3gUAAM4KADDfBQAApAcAEOAFAADOCgAw4QUBAIIKACHmBQEAgwoAIecFAQCDCgAh6QVAAIQKACHqBUAAhAoAIZ8GAQCCCgAhugYBAIIKACHABgEAgwoAIccGAQCDCgAhyAYBAIIKACHJBgEAggoAIQ7eBQAAzwoAMN8FAACKBwAQ4AUAAM8KADDhBQEAggoAIeYFAQCCCgAh5wUBAIIKACHpBUAAhAoAIeoFQACECgAhkgYBAIIKACHABgEAgwoAIcoGAQCDCgAhywZAAJ8KACHMBggAqQoAIc0GCACpCgAhD94FAADQCgAw3wUAAPQGABDgBQAA0AoAMOEFAQCCCgAh5gUBAIIKACHnBQEAgwoAIekFQACECgAh6gVAAIQKACGSBgEAggoAIc4GAQCDCgAhzwYBAIIKACHQBgAAjgoAINEGAQCDCgAh0gYBAIMKACHTBgEAggoAIRAUAADSCgAg3gUAANEKADDfBQAA4QYAEOAFAADRCgAw4QUBAJUKACHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIZIGAQCVCgAhzgYBAJYKACHPBgEAlQoAIdAGAACOCgAg0QYBAJYKACHSBgEAlgoAIdMGAQCVCgAhA70GAABLACC-BgAASwAgvwYAAEsAIA_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_gYBAIMKACGABwAA8QqAByOBBwEAgwoAIYIHAADyCq8GI4MHEADzCgAhhAcBAIIKACGFBwIAyAoAIYcHAAD0CocHIogHAQCDCgAhiQcBAIMKACGKBwEAgwoAIYsHAQCDCgAhjAcBAIMKACGNBwEAgwoAIY4HAADcCgAgjwdAAJ8KACGRBwEAgwoAIZIHAQCDCgAhBxUAAIkKACBoAAD_CgAgaQAA_woAIOsFAAAAgAcD7AUAAACABwntBQAAAIAHCfIFAAD-CoAHIwcVAACJCgAgaAAA_QoAIGkAAP0KACDrBQAAAK8GA-wFAAAArwYJ7QUAAACvBgnyBQAA_AqvBiMNFQAAiQoAIGgAAPsKACBpAAD7CgAg6gEAAPsKACDrAQAA-woAIOsFEAAAAAHsBRAAAAAF7QUQAAAABe4FEAAAAAHvBRAAAAAB8AUQAAAAAfEFEAAAAAHyBRAA-goAIQcVAACGCgAgaAAA-QoAIGkAAPkKACDrBQAAAIcHAuwFAAAAhwcI7QUAAACHBwjyBQAA-AqHByIHFQAAhgoAIGgAAPcKACBpAAD3CgAg6wUAAACRBwLsBQAAAJEHCO0FAAAAkQcI8gUAAPYKkQciBxUAAIYKACBoAAD3CgAgaQAA9woAIOsFAAAAkQcC7AUAAACRBwjtBQAAAJEHCPIFAAD2CpEHIgTrBQAAAJEHAuwFAAAAkQcI7QUAAACRBwjyBQAA9wqRByIHFQAAhgoAIGgAAPkKACBpAAD5CgAg6wUAAACHBwLsBQAAAIcHCO0FAAAAhwcI8gUAAPgKhwciBOsFAAAAhwcC7AUAAACHBwjtBQAAAIcHCPIFAAD5CocHIg0VAACJCgAgaAAA-woAIGkAAPsKACDqAQAA-woAIOsBAAD7CgAg6wUQAAAAAewFEAAAAAXtBRAAAAAF7gUQAAAAAe8FEAAAAAHwBRAAAAAB8QUQAAAAAfIFEAD6CgAhCOsFEAAAAAHsBRAAAAAF7QUQAAAABe4FEAAAAAHvBRAAAAAB8AUQAAAAAfEFEAAAAAHyBRAA-woAIQcVAACJCgAgaAAA_QoAIGkAAP0KACDrBQAAAK8GA-wFAAAArwYJ7QUAAACvBgnyBQAA_AqvBiME6wUAAACvBgPsBQAAAK8GCe0FAAAArwYJ8gUAAP0KrwYjBxUAAIkKACBoAAD_CgAgaQAA_woAIOsFAAAAgAcD7AUAAACABwntBQAAAIAHCfIFAAD-CoAHIwTrBQAAAIAHA-wFAAAAgAcJ7QUAAACABwnyBQAA_wqAByML3gUAAIALADDfBQAAhAUAEOAFAACACwAw4QUBAIIKACHpBUAAhAoAIeoFQACECgAhlQYAAPEKgAcjugYBAIIKACHABgEAgwoAIf4GAQCDCgAhgQcBAIMKACEkBgAAiAsAIAwAAMIKACANAADECgAgEQAAiwsAIBwAAMYKACAlAADDCgAgJwAAxQoAICoAAJILACAuAACECwAgLwAAhQsAIDAAAIcLACAxAACJCwAgMgAAigsAIDQAANUKACA1AACNCwAgNgAAjgsAIDcAAI8LACA6AACDCwAgOwAAhgsAID8AAJELACBAAACMCwAgQQAAkAsAIEYAAJMLACBHAACUCwAgSAAAlAsAIN4FAACBCwAw3wUAABYAEOAFAACBCwAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAhlQYAAIILgAcjugYBAJUKACHABgEAlgoAIf4GAQCWCgAhgQcBAJYKACEE6wUAAACABwPsBQAAAIAHCe0FAAAAgAcJ8gUAAP8KgAcjA70GAAASACC-BgAAEgAgvwYAABIAIAO9BgAAHQAgvgYAAB0AIL8GAAAdACADvQYAAGsAIL4GAABrACC_BgAAawAgA70GAADIAQAgvgYAAMgBACC_BgAAyAEAIAO9BgAAIQAgvgYAACEAIL8GAAAhACADvQYAAAsAIL4GAAALACC_BgAACwAgA70GAAAOACC-BgAADgAgvwYAAA4AIAO9BgAAUwAgvgYAAFMAIL8GAABTACADvQYAADoAIL4GAAA6ACC_BgAAOgAgA70GAADTAQAgvgYAANMBACC_BgAA0wEAIAO9BgAAPwAgvgYAAD8AIL8GAAA_ACADvQYAAEQAIL4GAABEACC_BgAARAAgA70GAACJAQAgvgYAAIkBACC_BgAAiQEAIBIHAADYCgAg3gUAANcKADDfBQAA5QEAEOAFAADXCgAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACHUBgEAlQoAIdUGAQCVCgAh1gYBAJUKACHXBgEAlQoAIdgGAQCVCgAh2QYBAJUKACHaBiAAmAoAIdsGAQCWCgAhwAcAAOUBACDBBwAA5QEAIAO9BgAA2QEAIL4GAADZAQAgvwYAANkBACADvQYAACoAIL4GAAAqACC_BgAAKgAgA70GAADqAQAgvgYAAOoBACC_BgAA6gEAIAO9BgAAWwAgvgYAAFsAIL8GAABbACAK3gUAAJULADDfBQAA7AQAEOAFAACVCwAw4QUBAIIKACHmBQEAgwoAIekFQACECgAh6gVAAIQKACHABgEAgwoAIf4GAQCDCgAhkwcBAIIKACEK3gUAAJYLADDfBQAA1AQAEOAFAACWCwAw4QUBAIIKACHpBUAAhAoAIeoFQACECgAhwAYBAIMKACHRBgEAgwoAIf4GAQCDCgAhkwcBAIIKACEP3gUAAJcLADDfBQAAvAQAEOAFAACXCwAw4QUBAIIKACHmBQEAggoAIecFAQCDCgAh6QVAAIQKACHqBUAAhAoAIYkGAQCCCgAhigYBAIIKACGLBgEAggoAIY0GAQCCCgAhwgYBAIIKACHSBgEAgwoAIZQHQACECgAhDd4FAACYCwAw3wUAAKIEABDgBQAAmAsAMOEFAQCCCgAh5gUBAIIKACHnBQEAggoAIekFQACECgAh6gVAAIQKACHABgEAgwoAIcwGAgDICgAh0gYBAIMKACGVBwEAggoAIZYHAQCCCgAhDN4FAACZCwAw3wUAAIoEABDgBQAAmQsAMOEFAQCCCgAh5gUBAIIKACHpBUAAhAoAIeoFQACECgAhugYBAIMKACGXBwEAggoAIZgHAQCCCgAhmQcCALAKACGbBwAAmgubByIHFQAAhgoAIGgAAJwLACBpAACcCwAg6wUAAACbBwLsBQAAAJsHCO0FAAAAmwcI8gUAAJsLmwciBxUAAIYKACBoAACcCwAgaQAAnAsAIOsFAAAAmwcC7AUAAACbBwjtBQAAAJsHCPIFAACbC5sHIgTrBQAAAJsHAuwFAAAAmwcI7QUAAACbBwjyBQAAnAubByIK3gUAAJ0LADDfBQAA9AMAEOAFAACdCwAw4QUBAIIKACHmBQEAggoAIecFAQCDCgAh6QVAAIQKACHqBUAAhAoAIboGAQCCCgAhwAYBAIMKACEJ3gUAAJ4LADDfBQAA3AMAEOAFAACeCwAw4QUBAIIKACHoBQEAggoAIekFQACECgAh6gVAAIQKACGcBwEAggoAIZ0HQACECgAhCd4FAACfCwAw3wUAAMYDABDgBQAAnwsAMOEFAQCCCgAh6QVAAIQKACHqBUAAhAoAIZ0HQACECgAhngcBAIIKACGfBwEAggoAIQneBQAAoAsAMN8FAACzAwAQ4AUAAKALADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACGdB0AAmQoAIZ4HAQCVCgAhnwcBAJUKACEQ3gUAAKELADDfBQAArQMAEOAFAAChCwAw4QUBAIIKACHoBQEAggoAIekFQACECgAh6gVAAIQKACGgBwEAggoAIaEHAQCCCgAhogcBAIMKACGjBwEAgwoAIaQHAQCDCgAhpQdAAJ8KACGmB0AAnwoAIacHAQCDCgAhqAcBAIMKACEL3gUAAKILADDfBQAAlwMAEOAFAACiCwAw4QUBAIIKACHoBQEAggoAIekFQACECgAh6gVAAIQKACGdB0AAhAoAIakHAQCCCgAhqgcBAIMKACGrBwEAgwoAIRLeBQAAowsAMN8FAACBAwAQ4AUAAKMLADDhBQEAggoAIeUFAQCDCgAh6QVAAIQKACHqBUAAhAoAIboGAQCCCgAh7wYBAIIKACGsBwEAggoAIa0HIACQCgAhrgcBAIMKACGvBwEAgwoAIbAHAQCDCgAhsQcBAIMKACGyBwEAgwoAIbMHAQCDCgAhtAcBAIIKACEkBAAApQsAIAUAAKYLACAGAACICwAgEAAAiQsAIBkAAIoLACA0AADVCgAgQAAAjAsAIEsAAIwLACBMAADVCgAgTQAApwsAIE4AANIKACBPAADSCgAgUAAAqAsAIFEAAKkLACBSAACUCwAgUwAAlAsAIFQAAJMLACBVAACqCwAg3gUAAKQLADDfBQAAUQAQ4AUAAKQLADDhBQEAlQoAIeUFAQCWCgAh6QVAAJkKACHqBUAAmQoAIboGAQCVCgAh7wYBAJUKACGsBwEAlQoAIa0HIACYCgAhrgcBAJYKACGvBwEAlgoAIbAHAQCWCgAhsQcBAJYKACGyBwEAlgoAIbMHAQCWCgAhtAcBAJUKACEDvQYAAAMAIL4GAAADACC_BgAAAwAgA70GAAAHACC-BgAABwAgvwYAAAcAIBMzAACaCgAg3gUAAJQKADDfBQAAowIAEOAFAACUCgAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAh9gUBAJUKACH3BQEAlQoAIfgFAQCVCgAh-QUBAJUKACH6BQEAlgoAIfsFAACOCgAg_AUAAI4KACD9BQAAlwoAIP4FAACXCgAg_wUgAJgKACHABwAAowIAIMEHAACjAgAgDxcAAJoKACDeBQAAvwoAMN8FAACnAgAQ4AUAAL8KADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACH3BQEAlQoAIfgFAQCVCgAh_QUAAJcKACD_BSAAmAoAIbgGAQCVCgAhuQYAAI4KACDABwAApwIAIMEHAACnAgAgA70GAACpAgAgvgYAAKkCACC_BgAAqQIAIAO9BgAA8gEAIL4GAADyAQAgvwYAAPIBACAJ3gUAAKsLADDfBQAA6QIAEOAFAACrCwAw4QUBAIIKACHpBUAAhAoAIeoFQACECgAhmQYAAKwLtwcinwYBAIIKACG1B0AAhAoAIQcVAACGCgAgaAAArgsAIGkAAK4LACDrBQAAALcHAuwFAAAAtwcI7QUAAAC3BwjyBQAArQu3ByIHFQAAhgoAIGgAAK4LACBpAACuCwAg6wUAAAC3BwLsBQAAALcHCO0FAAAAtwcI8gUAAK0LtwciBOsFAAAAtwcC7AUAAAC3BwjtBQAAALcHCPIFAACuC7cHIgneBQAArwsAMN8FAADTAgAQ4AUAAK8LADDhBQEAggoAIeYFAQCCCgAh6AUBAIIKACHpBUAAhAoAIeoFQACECgAh7wYAALALuAciBxUAAIYKACBoAACyCwAgaQAAsgsAIOsFAAAAuAcC7AUAAAC4BwjtBQAAALgHCPIFAACxC7gHIgcVAACGCgAgaAAAsgsAIGkAALILACDrBQAAALgHAuwFAAAAuAcI7QUAAAC4BwjyBQAAsQu4ByIE6wUAAAC4BwLsBQAAALgHCO0FAAAAuAcI8gUAALILuAciCgMAAJoKACDeBQAAswsAMN8FAACpAgAQ4AUAALMLADDhBQEAlQoAIegFAQCVCgAh6QVAAJkKACHqBUAAmQoAIZwHAQCVCgAhnQdAAJkKACEC6AUBAAAAAewGAQAAAAEJAwAAmgoAIEMAALYLACDeBQAAtQsAMN8FAADyAQAQ4AUAALULADDhBQEAlQoAIegFAQCVCgAh7AYBAJUKACHtBkAAmQoAIREHAADYCgAgQgAAmgoAIEQAALsLACBFAACqCwAg3gUAALoLADDfBQAA6gEAEOAFAAC6CwAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIZMGAQCVCgAh8AYBAJUKACHxBgAAuQvvBiLABwAA6gEAIMEHAADqAQAgAuwGAQAAAAHvBgAAAO8GAghDAAC2CwAg3gUAALgLADDfBQAA7gEAEOAFAAC4CwAw4QUBAJUKACHpBUAAmQoAIewGAQCVCgAh7wYAALkL7wYiBOsFAAAA7wYC7AUAAADvBgjtBQAAAO8GCPIFAADnCu8GIg8HAADYCgAgQgAAmgoAIEQAALsLACBFAACqCwAg3gUAALoLADDfBQAA6gEAEOAFAAC6CwAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIZMGAQCVCgAh8AYBAJUKACHxBgAAuQvvBiIDvQYAAO4BACC-BgAA7gEAIL8GAADuAQAgEQcAANgKACA-AADBCwAg3gUAALwLADDfBQAA2QEAEOAFAAC8CwAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGZBgAAvguxBiKtBgEAlgoAIa8GAAC9C68GIrEGEAC_CwAhsgYBAJUKACGzBgIAwAsAIbQGQACZCgAhtQZAAJkKACEE6wUAAACvBgLsBQAAAK8GCO0FAAAArwYI8gUAALgKrwYiBOsFAAAAsQYC7AUAAACxBgjtBQAAALEGCPIFAAC2CrEGIgjrBRAAAAAB7AUQAAAABO0FEAAAAATuBRAAAAAB7wUQAAAAAfAFEAAAAAHxBRAAAAAB8gUQALQKACEI6wUCAAAAAewFAgAAAATtBQIAAAAE7gUCAAAAAe8FAgAAAAHwBQIAAAAB8QUCAAAAAfIFAgCGCgAhJAcAAMsLACA8AACaCgAgPQAAygsAID8AAJELACDeBQAAwgsAMN8FAADTAQAQ4AUAAMILADDhBQEAlQoAIeYFAQCWCgAh6QVAAJkKACHqBUAAmQoAIZkGAADJC5EHIpsGQADICwAhwAYBAJYKACH8BgEAlQoAIf0GAQCVCgAh_gYBAJYKACGABwAAgguAByOBBwEAlgoAIYIHAADDC68GI4MHEADECwAhhAcBAJUKACGFBwIAxQsAIYcHAADGC4cHIogHAQCWCgAhiQcBAJYKACGKBwEAlgoAIYsHAQCWCgAhjAcBAJYKACGNBwEAlgoAIY4HAADHCwAgjwdAAMgLACGRBwEAlgoAIZIHAQCWCgAhwAcAANMBACDBBwAA0wEAICIHAADLCwAgPAAAmgoAID0AAMoLACA_AACRCwAg3gUAAMILADDfBQAA0wEAEOAFAADCCwAw4QUBAJUKACHmBQEAlgoAIekFQACZCgAh6gVAAJkKACGZBgAAyQuRByKbBkAAyAsAIcAGAQCWCgAh_AYBAJUKACH9BgEAlQoAIf4GAQCWCgAhgAcAAIILgAcjgQcBAJYKACGCBwAAwwuvBiODBxAAxAsAIYQHAQCVCgAhhQcCAMULACGHBwAAxguHByKIBwEAlgoAIYkHAQCWCgAhigcBAJYKACGLBwEAlgoAIYwHAQCWCgAhjQcBAJYKACGOBwAAxwsAII8HQADICwAhkQcBAJYKACGSBwEAlgoAIQTrBQAAAK8GA-wFAAAArwYJ7QUAAACvBgnyBQAA_QqvBiMI6wUQAAAAAewFEAAAAAXtBRAAAAAF7gUQAAAAAe8FEAAAAAHwBRAAAAAB8QUQAAAAAfIFEAD7CgAhCOsFAgAAAAHsBQIAAAAF7QUCAAAABe4FAgAAAAHvBQIAAAAB8AUCAAAAAfEFAgAAAAHyBQIAiQoAIQTrBQAAAIcHAuwFAAAAhwcI7QUAAACHBwjyBQAA-QqHByIM6wWAAAAAAe4FgAAAAAHvBYAAAAAB8AWAAAAAAfEFgAAAAAHyBYAAAAABgAYBAAAAAYEGAQAAAAGCBgEAAAABgwaAAAAAAYQGgAAAAAGFBoAAAAABCOsFQAAAAAHsBUAAAAAF7QVAAAAABe4FQAAAAAHvBUAAAAAB8AVAAAAAAfEFQAAAAAHyBUAAoQoAIQTrBQAAAJEHAuwFAAAAkQcI7QUAAACRBwjyBQAA9wqRByImBAAApQsAIAUAAKYLACAGAACICwAgEAAAiQsAIBkAAIoLACA0AADVCgAgQAAAjAsAIEsAAIwLACBMAADVCgAgTQAApwsAIE4AANIKACBPAADSCgAgUAAAqAsAIFEAAKkLACBSAACUCwAgUwAAlAsAIFQAAJMLACBVAACqCwAg3gUAAKQLADDfBQAAUQAQ4AUAAKQLADDhBQEAlQoAIeUFAQCWCgAh6QVAAJkKACHqBUAAmQoAIboGAQCVCgAh7wYBAJUKACGsBwEAlQoAIa0HIACYCgAhrgcBAJYKACGvBwEAlgoAIbAHAQCWCgAhsQcBAJYKACGyBwEAlgoAIbMHAQCWCgAhtAcBAJUKACHABwAAUQAgwQcAAFEAICYGAACICwAgDAAAwgoAIA0AAMQKACARAACLCwAgHAAAxgoAICUAAMMKACAnAADFCgAgKgAAkgsAIC4AAIQLACAvAACFCwAgMAAAhwsAIDEAAIkLACAyAACKCwAgNAAA1QoAIDUAAI0LACA2AACOCwAgNwAAjwsAIDoAAIMLACA7AACGCwAgPwAAkQsAIEAAAIwLACBBAACQCwAgRgAAkwsAIEcAAJQLACBIAACUCwAg3gUAAIELADDfBQAAFgAQ4AUAAIELADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACGVBgAAgguAByO6BgEAlQoAIcAGAQCWCgAh_gYBAJYKACGBBwEAlgoAIcAHAAAWACDBBwAAFgAgDgcAANgKACAqAACSCwAg3gUAAMwLADDfBQAAyAEAEOAFAADMCwAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACG6BgEAlgoAIZcHAQCVCgAhmAcBAJUKACGZBwIAwAsAIZsHAADNC5sHIgTrBQAAAJsHAuwFAAAAmwcI7QUAAACbBwjyBQAAnAubByIbBwAA2AoAIAkAANILACAQAADRCwAgKQAA0AsAIN4FAADOCwAw3wUAAIkBABDgBQAAzgsAMOEFAQCVCgAh5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGLBgEAlQoAIZ8GAQCVCgAhoAYIAM8LACGhBggAzwsAIaIGCADPCwAhowYIAM8LACGkBggAzwsAIaUGCADPCwAhpgYIAM8LACGnBggAzwsAIagGCADPCwAhqQYIAM8LACGqBggAzwsAIasGCADPCwAhrAYIAM8LACEI6wUIAAAAAewFCAAAAAXtBQgAAAAF7gUIAAAAAe8FCAAAAAHwBQgAAAAB8QUIAAAAAfIFCACrCgAhHAcAANgKACAJAADSCwAgCgAAggwAIAsAAJILACAOAADzCwAgDwAA9gsAIBAAANELACAZAADoCwAgGwAA4AsAICwAAIAMACAtAACBDAAg3gUAAP8LADDfBQAAJgAQ4AUAAP8LADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhiQYBAJUKACGKBgEAlQoAIYsGAQCVCgAhjQYBAJUKACHCBgEAlQoAIdIGAQCWCgAhlAdAAJkKACHABwAAJgAgwQcAACYAIBgDAACaCgAgBwAA2AoAIAkAAN8LACANAADECgAgEQAAiwsAICIAAJQLACAkAACNCwAgSQAA1QoAIEoAAI8LACDeBQAAiQwAMN8FAAAOABDgBQAAiQwAMOEFAQCVCgAh4gUBAJUKACHjBQEAlQoAIeQFAQCVCgAh5QUBAJYKACHmBQEAlQoAIecFAQCVCgAh6AUBAJUKACHpBUAAmQoAIeoFQACZCgAhwAcAAA4AIMEHAAAOACAeCAAAhgwAIAwAAMIKACANAADECgAgEQAAiwsAIBwAAMYKACAlAADDCgAgJwAAxQoAICoAAJILACAuAACECwAgLwAAhQsAIDAAAIcLACAxAACJCwAgMgAAigsAIDQAANUKACA1AACNCwAgNgAAjgsAIDcAAI8LACA4AACUCwAg3gUAAIUMADDfBQAAGAAQ4AUAAIUMADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIdEGAQCWCgAh_gYBAJYKACGTBwEAlQoAIcAHAAAYACDBBwAAGAAgAvYFAQAAAAGdBgEAAAABFwcAANgKACAJAADSCwAgEAAA1wsAIBYAANYLACAYAADKCwAgMwAAmgoAIN4FAADUCwAw3wUAAKEBABDgBQAA1AsAMOEFAQCVCgAh5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACH2BQEAlQoAIYsGAQCWCgAhlwYBAJYKACGZBgAA1QuZBiKaBgEAlgoAIZsGQADICwAhnAZAAJkKACGdBgEAlQoAIZ4GAQCWCgAhBOsFAAAAmQYC7AUAAACZBgjtBQAAAJkGCPIFAACnCpkGIhIUAADVCgAg3gUAANQKADDfBQAAyAYAEOAFAADUCgAw4QUBAJUKACHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIZIGAQCVCgAhzgYBAJYKACHPBgEAlQoAIdAGAACOCgAg0QYBAJYKACHSBgEAlgoAIdMGAQCVCgAhwAcAAMgGACDBBwAAyAYAIBgDAACaCgAgBwAA2AoAIAkAAN8LACANAADECgAgEQAAiwsAICIAAJQLACAkAACNCwAgSQAA1QoAIEoAAI8LACDeBQAAiQwAMN8FAAAOABDgBQAAiQwAMOEFAQCVCgAh4gUBAJUKACHjBQEAlQoAIeQFAQCVCgAh5QUBAJYKACHmBQEAlQoAIecFAQCVCgAh6AUBAJUKACHpBUAAmQoAIeoFQACZCgAhwAcAAA4AIMEHAAAOACATAwAAmgoAIAcAANgKACAJAADSCwAgDQAAxAoAIBMAAI4LACAaAADSCgAgHAAAxgoAICIAAJQLACDeBQAA2AsAMN8FAABTABDgBQAA2AsAMOEFAQCVCgAh5QUBAJYKACHmBQEAlQoAIecFAQCWCgAh6AUBAJUKACHpBUAAmQoAIeoFQACZCgAhtgYBAJUKACENBwAA2AoAIAkAANILACAlAADDCgAg3gUAANkLADDfBQAAawAQ4AUAANkLADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhugYBAJUKACHABgEAlgoAIQKfBgEAAAABtQdAAAAAAQopAADQCwAg3gUAANsLADDfBQAAhQEAEOAFAADbCwAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAhmQYAANwLtwcinwYBAJUKACG1B0AAmQoAIQTrBQAAALcHAuwFAAAAtwcI7QUAAAC3BwjyBQAArgu3ByIC5wUBAAAAAcIGAQAAAAERBwAA2AoAIAkAAN8LACAbAADgCwAgHAAAxgoAIN4FAADeCwAw3wUAAHQAEOAFAADeCwAw4QUBAJUKACHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIbIGAQCVCgAhwgYBAJUKACHaBiAAmAoAIeoGEAC_CwAh6wYQAL8LACEeCAAAhgwAIAwAAMIKACANAADECgAgEQAAiwsAIBwAAMYKACAlAADDCgAgJwAAxQoAICoAAJILACAuAACECwAgLwAAhQsAIDAAAIcLACAxAACJCwAgMgAAigsAIDQAANUKACA1AACNCwAgNgAAjgsAIDcAAI8LACA4AACUCwAg3gUAAIUMADDfBQAAGAAQ4AUAAIUMADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIdEGAQCWCgAh_gYBAJYKACGTBwEAlQoAIcAHAAAYACDBBwAAGAAgDwwAAMIKACANAADECgAgHAAAxgoAICUAAMMKACAnAADFCgAg3gUAAMEKADDfBQAALwAQ4AUAAMEKADDhBQEAlQoAIeYFAQCVCgAhugYBAJUKACG7BkAAmQoAIbwGQACZCgAhwAcAAC8AIMEHAAAvACAaEAAA1wsAIBgAAMoLACAZAADkCwAgHgAA2AoAIB8AANgKACAgAACaCgAgIQAA0gsAIN4FAADhCwAw3wUAAFsAEOAFAADhCwAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAhiwYBAJYKACGNBgEAlgoAIZkGAADjC_UGIpsGQADICwAhngYBAJYKACHzBgAA4gvzBiL1BgEAlQoAIfYGAQCVCgAh9wYBAJUKACH4BgEAlgoAIfkGAQCWCgAh-gYBAJYKACH7BkAAmQoAIQTrBQAAAPMGAuwFAAAA8wYI7QUAAADzBgjyBQAA7wrzBiIE6wUAAAD1BgLsBQAAAPUGCO0FAAAA9QYI8gUAAO0K9QYiFQMAAJoKACAHAADYCgAgCQAA0gsAIA0AAMQKACATAACOCwAgGgAA0goAIBwAAMYKACAiAACUCwAg3gUAANgLADDfBQAAUwAQ4AUAANgLADDhBQEAlQoAIeUFAQCWCgAh5gUBAJUKACHnBQEAlgoAIegFAQCVCgAh6QVAAJkKACHqBUAAmQoAIbYGAQCVCgAhwAcAAFMAIMEHAABTACAfBwAA2AoAIAkAAN8LACAZAADoCwAgGwAA4AsAIB0AAOkLACDeBQAA5QsAMN8FAABVABDgBQAA5QsAMOEFAQCVCgAh5gUBAJUKACHnBQEAlQoAIekFQACZCgAh6gVAAJkKACGNBgEAlQoAIZkGAADnC-AGIrEGEAC_CwAhsgYBAJUKACGzBgIAwAsAIcIGAQCVCgAh3AYBAJUKACHeBgAA5gveBiLgBgEAlQoAIeEGAQCVCgAh4gYBAJYKACHjBgEAlgoAIeQGAQCWCgAh5QYBAJYKACHmBgEAlgoAIecGAADHCwAg6AZAAJkKACHpBkAAyAsAIQTrBQAAAN4GAuwFAAAA3gYI7QUAAADeBgjyBQAA4QreBiIE6wUAAADgBgLsBQAAAOAGCO0FAAAA4AYI8gUAAN8K4AYiFQMAAJoKACAHAADYCgAgCQAA0gsAIA0AAMQKACATAACOCwAgGgAA0goAIBwAAMYKACAiAACUCwAg3gUAANgLADDfBQAAUwAQ4AUAANgLADDhBQEAlQoAIeUFAQCWCgAh5gUBAJUKACHnBQEAlgoAIegFAQCVCgAh6QVAAJkKACHqBUAAmQoAIbYGAQCVCgAhwAcAAFMAIMEHAABTACATBwAA2AoAIAkAAN8LACAbAADgCwAgHAAAxgoAIN4FAADeCwAw3wUAAHQAEOAFAADeCwAw4QUBAJUKACHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIbIGAQCVCgAhwgYBAJUKACHaBiAAmAoAIeoGEAC_CwAh6wYQAL8LACHABwAAdAAgwQcAAHQAIAKdBgEAAAABuAYBAAAAARMWAADtCwAgFwAAmgoAIBgAAMoLACAZAADkCwAg3gUAAOsLADDfBQAASwAQ4AUAAOsLADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACGNBgEAlgoAIZcGAQCWCgAhmQYAAOwLuAYimgYBAJYKACGbBkAAyAsAIZwGQACZCgAhnQYBAJUKACGeBgEAlgoAIbgGAQCVCgAhBOsFAAAAuAYC7AUAAAC4BgjtBQAAALgGCPIFAAC9CrgGIhIUAADSCgAg3gUAANEKADDfBQAA4QYAEOAFAADRCgAw4QUBAJUKACHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIZIGAQCVCgAhzgYBAJYKACHPBgEAlQoAIdAGAACOCgAg0QYBAJYKACHSBgEAlgoAIdMGAQCVCgAhwAcAAOEGACDBBwAA4QYAIAKMBgEAAAABjQYBAAAAARIHAADYCgAgCQAA0gsAIBIAAPALACAZAADoCwAg3gUAAO8LADDfBQAARAAQ4AUAAO8LADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhjAYBAJUKACGNBgEAlQoAIY4GAQCWCgAhjwYBAJYKACGQBgEAlgoAIZEGQACZCgAhFQcAANgKACAJAADSCwAgDgAA8wsAIBAAANELACAjAACOCwAg3gUAAPELADDfBQAAPwAQ4AUAAPELADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhiQYBAJUKACGLBgEAlQoAIZIGAQCVCgAhkwYBAJYKACGVBgAA8guVBiKWBkAAyAsAIcAHAAA_ACDBBwAAPwAgEwcAANgKACAJAADSCwAgDgAA8wsAIBAAANELACAjAACOCwAg3gUAAPELADDfBQAAPwAQ4AUAAPELADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhiQYBAJUKACGLBgEAlQoAIZIGAQCVCgAhkwYBAJYKACGVBgAA8guVBiKWBkAAyAsAIQTrBQAAAJUGAuwFAAAAlQYI7QUAAACVBgjyBQAAowqVBiIWBwAA2AoAIAkAANILACANAADECgAgEQAAiwsAIBsAAOALACAkAACNCwAgJgAA-AsAIN4FAAD3CwAw3wUAADUAEOAFAAD3CwAw4QUBAJUKACHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIboGAQCVCgAhwAYBAJYKACHBBgIAxQsAIcIGAQCVCgAhwwYBAJYKACHABwAANQAgwQcAADUAIAKJBgEAAAABigYBAAAAARAHAADYCgAgCQAA0gsAIA4AAPMLACAPAAD2CwAgEAAA0QsAIN4FAAD1CwAw3wUAADoAEOAFAAD1CwAw4QUBAJUKACHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIYkGAQCVCgAhigYBAJUKACGLBgEAlQoAIRQHAADYCgAgCQAA3wsAIAoAAIIMACANAADECgAgEQAAiwsAIN4FAACDDAAw3wUAACEAEOAFAACDDAAw4QUBAJUKACHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIcAGAQCWCgAhzAYCAMULACHSBgEAlgoAIZUHAQCVCgAhlgcBAJUKACHABwAAIQAgwQcAACEAIBQHAADYCgAgCQAA0gsAIA0AAMQKACARAACLCwAgGwAA4AsAICQAAI0LACAmAAD4CwAg3gUAAPcLADDfBQAANQAQ4AUAAPcLADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhugYBAJUKACHABgEAlgoAIcEGAgDFCwAhwgYBAJUKACHDBgEAlgoAIQ8HAADYCgAgCQAA0gsAICUAAMMKACDeBQAA2QsAMN8FAABrABDgBQAA2QsAMOEFAQCVCgAh5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACG6BgEAlQoAIcAGAQCWCgAhwAcAAGsAIMEHAABrACASBwAAywsAIAkAANILACALAACSCwAgGwAA-wsAIN4FAAD5CwAw3wUAADEAEOAFAAD5CwAw4QUBAJUKACHmBQEAlgoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIZkGAAD6C8cGIroGAQCVCgAhwAYBAJYKACHCBgEAlgoAIcQGAQCVCgAhxQYBAJUKACEE6wUAAADHBgLsBQAAAMcGCO0FAAAAxwYI8gUAAM0KxwYiDwwAAMIKACANAADECgAgHAAAxgoAICUAAMMKACAnAADFCgAg3gUAAMEKADDfBQAALwAQ4AUAAMEKADDhBQEAlQoAIeYFAQCVCgAhugYBAJUKACG7BkAAmQoAIbwGQACZCgAhwAcAAC8AIMEHAAAvACATBwAAywsAIAkAANILACAoAAD9CwAgKQAA0AsAICsAAP4LACDeBQAA_AsAMN8FAAAqABDgBQAA_AsAMOEFAQCVCgAh5gUBAJYKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGfBgEAlQoAIboGAQCVCgAhwAYBAJYKACHHBgEAlgoAIcgGAQCVCgAhyQYBAJUKACEUBwAAywsAIAkAANILACALAACSCwAgGwAA-wsAIN4FAAD5CwAw3wUAADEAEOAFAAD5CwAw4QUBAJUKACHmBQEAlgoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIZkGAAD6C8cGIroGAQCVCgAhwAYBAJYKACHCBgEAlgoAIcQGAQCVCgAhxQYBAJUKACHABwAAMQAgwQcAADEAIBAHAADYCgAgKgAAkgsAIN4FAADMCwAw3wUAAMgBABDgBQAAzAsAMOEFAQCVCgAh5gUBAJUKACHpBUAAmQoAIeoFQACZCgAhugYBAJYKACGXBwEAlQoAIZgHAQCVCgAhmQcCAMALACGbBwAAzQubByLABwAAyAEAIMEHAADIAQAgGgcAANgKACAJAADSCwAgCgAAggwAIAsAAJILACAOAADzCwAgDwAA9gsAIBAAANELACAZAADoCwAgGwAA4AsAICwAAIAMACAtAACBDAAg3gUAAP8LADDfBQAAJgAQ4AUAAP8LADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhiQYBAJUKACGKBgEAlQoAIYsGAQCVCgAhjQYBAJUKACHCBgEAlQoAIdIGAQCWCgAhlAdAAJkKACEDvQYAAIUBACC-BgAAhQEAIL8GAACFAQAgHQcAANgKACAJAADSCwAgEAAA0QsAICkAANALACDeBQAAzgsAMN8FAACJAQAQ4AUAAM4LADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhiwYBAJUKACGfBgEAlQoAIaAGCADPCwAhoQYIAM8LACGiBggAzwsAIaMGCADPCwAhpAYIAM8LACGlBggAzwsAIaYGCADPCwAhpwYIAM8LACGoBggAzwsAIakGCADPCwAhqgYIAM8LACGrBggAzwsAIawGCADPCwAhwAcAAIkBACDBBwAAiQEAIBQHAADYCgAgCQAA3wsAIA0AAMQKACAPAACHCwAg3gUAAIQMADDfBQAAHQAQ4AUAAIQMADDhBQEAlQoAIeYFAQCVCgAh5wUBAJUKACHpBUAAmQoAIeoFQACZCgAhkgYBAJUKACHABgEAlgoAIcoGAQCWCgAhywZAAMgLACHMBggAzwsAIc0GCADPCwAhwAcAAB0AIMEHAAAdACASBwAA2AoAIAkAAN8LACAKAACCDAAgDQAAxAoAIBEAAIsLACDeBQAAgwwAMN8FAAAhABDgBQAAgwwAMOEFAQCVCgAh5gUBAJUKACHnBQEAlQoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIcwGAgDFCwAh0gYBAJYKACGVBwEAlQoAIZYHAQCVCgAhEgcAANgKACAJAADfCwAgDQAAxAoAIA8AAIcLACDeBQAAhAwAMN8FAAAdABDgBQAAhAwAMOEFAQCVCgAh5gUBAJUKACHnBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIcAGAQCWCgAhygYBAJYKACHLBkAAyAsAIcwGCADPCwAhzQYIAM8LACEcCAAAhgwAIAwAAMIKACANAADECgAgEQAAiwsAIBwAAMYKACAlAADDCgAgJwAAxQoAICoAAJILACAuAACECwAgLwAAhQsAIDAAAIcLACAxAACJCwAgMgAAigsAIDQAANUKACA1AACNCwAgNgAAjgsAIDcAAI8LACA4AACUCwAg3gUAAIUMADDfBQAAGAAQ4AUAAIUMADDhBQEAlQoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIdEGAQCWCgAh_gYBAJYKACGTBwEAlQoAIQ4HAADLCwAgOQAAiAwAIN4FAACHDAAw3wUAABIAEOAFAACHDAAw4QUBAJUKACHmBQEAlgoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIf4GAQCWCgAhkwcBAJUKACHABwAAEgAgwQcAABIAIAwHAADLCwAgOQAAiAwAIN4FAACHDAAw3wUAABIAEOAFAACHDAAw4QUBAJUKACHmBQEAlgoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIf4GAQCWCgAhkwcBAJUKACEDvQYAABgAIL4GAAAYACC_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_UGIpsGQADICwAhngYBAJYKACHzBgAA4gvzBiL1BgEAlQoAIfYGAQCVCgAh9wYBAJUKACH4BgEAlgoAIfkGAQCWCgAh-gYBAJYKACH7BkAAmQoAIQIAAABdACBbAACrDAAgAgAAAKYMACBbAACnDAAgE94FAAClDAAw3wUAAKYMABDgBQAApQwAMOEFAQCVCgAh6QVAAJkKACHqBUAAmQoAIYsGAQCWCgAhjQYBAJYKACGZBgAA4wv1BiKbBkAAyAsAIZ4GAQCWCgAh8wYAAOIL8wYi9QYBAJUKACH2BgEAlQoAIfcGAQCVCgAh-AYBAJYKACH5BgEAlgoAIfoGAQCWCgAh-wZAAJkKACET3gUAAKUMADDfBQAApgwAEOAFAAClDAAw4QUBAJUKACHpBUAAmQoAIeoFQACZCgAhiwYBAJYKACGNBgEAlgoAIZkGAADjC_UGIpsGQADICwAhngYBAJYKACHzBgAA4gvzBiL1BgEAlQoAIfYGAQCVCgAh9wYBAJUKACH4BgEAlgoAIfkGAQCWCgAh-gYBAJYKACH7BkAAmQoAIQ_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_QwAIAIAAAD7DAAgWwAA_AwAIA7eBQAA-gwAMN8FAAD7DAAQ4AUAAPoMADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhjAYBAJUKACGNBgEAlQoAIY4GAQCWCgAhjwYBAJYKACGQBgEAlgoAIZEGQACZCgAhDt4FAAD6DAAw3wUAAPsMABDgBQAA-gwAMOEFAQCVCgAh5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGMBgEAlQoAIY0GAQCVCgAhjgYBAJYKACGPBgEAlgoAIZAGAQCWCgAhkQZAAJkKACEK4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIY0GAQCSDAAhjgYBAJMMACGPBgEAkwwAIZAGAQCTDAAhkQZAAJQMACENBwAA_wwAIAkAAIANACAZAAD-DAAg4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIY0GAQCSDAAhjgYBAJMMACGPBgEAkwwAIZAGAQCTDAAhkQZAAJQMACEFYgAAihwAIGMAAJMcACDCBwAAixwAIMMHAACSHAAgyAcAAJ0BACAFYgAAiBwAIGMAAJAcACDCBwAAiRwAIMMHAACPHAAgyAcAAO8EACAHYgAAhhwAIGMAAI0cACDCBwAAhxwAIMMHAACMHAAgxgcAABgAIMcHAAAYACDIBwAAGgAgDQcAAIMNACAJAACEDQAgGQAAgg0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABjQYBAAAAAY4GAQAAAAGPBgEAAAABkAYBAAAAAZEGQAAAAAEDYgAAihwAIMIHAACLHAAgyAcAAJ0BACADYgAAiBwAIMIHAACJHAAgyAcAAO8EACADYgAAhhwAIMIHAACHHAAgyAcAABoAIA4HAACHDQAgCQAAiA0AIA4AAIYNACAjAACJDQAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABkgYBAAAAAZMGAQAAAAGVBgAAAJUGApYGQAAAAAEDYgAAhBwAIMIHAACFHAAgyAcAADcAIANiAACCHAAgwgcAAIMcACDIBwAA7wQAIANiAACAHAAgwgcAAIEcACDIBwAAGgAgBGIAAPMMADDCBwAA9AwAMMQHAAD2DAAgyAcAAPcMADALBwAAnA0AIAkAAJ0NACAOAACaDQAgDwAAmw0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYoGAQAAAAECAAAAPAAgYgAAmQ0AIAMAAAA8ACBiAACZDQAgYwAAlA0AIAFbAAD_GwAwEQcAANgKACAJAADSCwAgDgAA8wsAIA8AAPYLACAQAADRCwAg3gUAAPULADDfBQAAOgAQ4AUAAPULADDhBQEAAAAB5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGJBgEAlQoAIYoGAQCVCgAhiwYBAJUKACG_BwAA9AsAIAIAAAA8ACBbAACUDQAgAgAAAJINACBbAACTDQAgC94FAACRDQAw3wUAAJINABDgBQAAkQ0AMOEFAQCVCgAh5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGJBgEAlQoAIYoGAQCVCgAhiwYBAJUKACEL3gUAAJENADDfBQAAkg0AEOAFAACRDQAw4QUBAJUKACHmBQEAlQoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIYkGAQCVCgAhigYBAJUKACGLBgEAlQoAIQfhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhiQYBAJIMACGKBgEAkgwAIQsHAACXDQAgCQAAmA0AIA4AAJUNACAPAACWDQAg4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhigYBAJIMACEFYgAA8RsAIGMAAP0bACDCBwAA8hsAIMMHAAD8GwAgyAcAADcAIAViAADvGwAgYwAA-hsAIMIHAADwGwAgwwcAAPkbACDIBwAAIwAgBWIAAO0bACBjAAD3GwAgwgcAAO4bACDDBwAA9hsAIMgHAADvBAAgB2IAAOsbACBjAAD0GwAgwgcAAOwbACDDBwAA8xsAIMYHAAAYACDHBwAAGAAgyAcAABoAIAsHAACcDQAgCQAAnQ0AIA4AAJoNACAPAACbDQAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABigYBAAAAAQNiAADxGwAgwgcAAPIbACDIBwAANwAgA2IAAO8bACDCBwAA8BsAIMgHAAAjACADYgAA7RsAIMIHAADuGwAgyAcAAO8EACADYgAA6xsAIMIHAADsGwAgyAcAABoAIBUHAADlDQAgCQAA4g0AIAoAAOMNACALAADcDQAgDgAA4Q0AIA8AAN8NACAZAADgDQAgGwAA5A0AICwAAN0NACAtAADeDQAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABigYBAAAAAY0GAQAAAAHCBgEAAAAB0gYBAAAAAZQHQAAAAAECAAAAKAAgYgAA2w0AIAMAAAAoACBiAADbDQAgYwAAqA0AIAFbAADqGwAwGgcAANgKACAJAADSCwAgCgAAggwAIAsAAJILACAOAADzCwAgDwAA9gsAIBAAANELACAZAADoCwAgGwAA4AsAICwAAIAMACAtAACBDAAg3gUAAP8LADDfBQAAJgAQ4AUAAP8LADDhBQEAAAAB5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGJBgEAlQoAIYoGAQCVCgAhiwYBAJUKACGNBgEAlQoAIcIGAQCVCgAh0gYBAJYKACGUB0AAmQoAIQIAAAAoACBbAACoDQAgAgAAAKYNACBbAACnDQAgD94FAAClDQAw3wUAAKYNABDgBQAApQ0AMOEFAQCVCgAh5gUBAJUKACHnBQEAlgoAIekFQACZCgAh6gVAAJkKACGJBgEAlQoAIYoGAQCVCgAhiwYBAJUKACGNBgEAlQoAIcIGAQCVCgAh0gYBAJYKACGUB0AAmQoAIQ_eBQAApQ0AMN8FAACmDQAQ4AUAAKUNADDhBQEAlQoAIeYFAQCVCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhiQYBAJUKACGKBgEAlQoAIYsGAQCVCgAhjQYBAJUKACHCBgEAlQoAIdIGAQCWCgAhlAdAAJkKACEL4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhigYBAJIMACGNBgEAkgwAIcIGAQCSDAAh0gYBAJMMACGUB0AAlAwAIRUHAACyDQAgCQAArw0AIAoAALANACALAACpDQAgDgAArg0AIA8AAKwNACAZAACtDQAgGwAAsQ0AICwAAKoNACAtAACrDQAg4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhigYBAJIMACGNBgEAkgwAIcIGAQCSDAAh0gYBAJMMACGUB0AAlAwAIQtiAADHDQAwYwAAzA0AMMIHAADIDQAwwwcAAMkNADDEBwAAyg0AIMUHAADLDQAwxgcAAMsNADDHBwAAyw0AMMgHAADLDQAwyQcAAM0NADDKBwAAzg0AMAtiAAC6DQAwYwAAvw0AMMIHAAC7DQAwwwcAALwNADDEBwAAvQ0AIMUHAAC-DQAwxgcAAL4NADDHBwAAvg0AMMgHAAC-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_gsAIN4FAAD8CwAw3wUAACoAEOAFAAD8CwAw4QUBAAAAAeYFAQCWCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhnwYBAJUKACG6BgEAlQoAIcAGAQCWCgAhxwYBAJYKACHIBgEAlQoAIckGAQCVCgAhAgAAACwAIFsAANENACACAAAAzw0AIFsAANANACAO3gUAAM4NADDfBQAAzw0AEOAFAADODQAw4QUBAJUKACHmBQEAlgoAIecFAQCWCgAh6QVAAJkKACHqBUAAmQoAIZ8GAQCVCgAhugYBAJUKACHABgEAlgoAIccGAQCWCgAhyAYBAJUKACHJBgEAlQoAIQ7eBQAAzg0AMN8FAADPDQAQ4AUAAM4NADDhBQEAlQoAIeYFAQCWCgAh5wUBAJYKACHpBUAAmQoAIeoFQACZCgAhnwYBAJUKACG6BgEAlQoAIcAGAQCWCgAhxwYBAJYKACHIBgEAlQoAIckGAQCVCgAhCuEFAQCSDAAh5gUBAJMMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIcAGAQCTDAAhxwYBAJMMACHIBgEAkgwAIckGAQCSDAAhDgcAANQNACAJAADVDQAgKAAA0g0AICsAANMNACDhBQEAkgwAIeYFAQCTDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHABgEAkwwAIccGAQCTDAAhyAYBAJIMACHJBgEAkgwAIQViAADAGwAgYwAAzBsAIMIHAADBGwAgwwcAAMsbACDIBwAAMwAgBWIAAL4bACBjAADJGwAgwgcAAL8bACDDBwAAyBsAIMgHAADKAQAgB2IAALwbACBjAADGGwAgwgcAAL0bACDDBwAAxRsAIMYHAAAWACDHBwAAFgAgyAcAAO8EACAHYgAAuhsAIGMAAMMbACDCBwAAuxsAIMMHAADCGwAgxgcAABgAIMcHAAAYACDIBwAAGgAgDgcAANkNACAJAADaDQAgKAAA1w0AICsAANgNACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHABgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABA2IAAMAbACDCBwAAwRsAIMgHAAAzACADYgAAvhsAIMIHAAC_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-GgAgwgcAAMUaACDDBwAA_RoAIMYHAAAYACDHBwAAGAAgyAcAABoAIAViAADCGgAgYwAA-xoAIMIHAADDGgAgwwcAAPoaACDIBwAA7AIAIAtiAADoDgAwYwAA7A4AMMIHAADpDgAwwwcAAOoOADDEBwAA6w4AIMUHAACiDQAwxgcAAKINADDHBwAAog0AMMgHAACiDQAwyQcAAO0OADDKBwAApQ0AMAtiAADfDgAwYwAA4w4AMMIHAADgDgAwwwcAAOEOADDEBwAA4g4AIMUHAAD3DAAwxgcAAPcMADDHBwAA9wwAMMgHAAD3DAAwyQcAAOQOADDKBwAA-gwAMAtiAADMDgAwYwAA0Q4AMMIHAADNDgAwwwcAAM4OADDEBwAAzw4AIMUHAADQDgAwxgcAANAOADDHBwAA0A4AMMgHAADQDgAwyQcAANIOADDKBwAA0w4AMAtiAAC2DgAwYwAAuw4AMMIHAAC3DgAwwwcAALgOADDEBwAAuQ4AIMUHAAC6DgAwxgcAALoOADDHBwAAug4AMMgHAAC6DgAwyQcAALwOADDKBwAAvQ4AMAtiAACrDgAwYwAArw4AMMIHAACsDgAwwwcAAK0OADDEBwAArg4AIMUHAACiDAAwxgcAAKIMADDHBwAAogwAMMgHAACiDAAwyQcAALAOADDKBwAApQwAMBUQAAC1DgAgGAAAtgwAIB4AALMMACAfAAC0DAAgIAAAtQwAICEAALgMACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGLBgEAAAABmQYAAAD1BgKbBkAAAAABngYBAAAAAfMGAAAA8wYC9QYBAAAAAfYGAQAAAAH3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BgEAAAAB-wZAAAAAAQIAAABdACBiAAC0DgAgAwAAAF0AIGIAALQOACBjAACyDgAgAVsAAPkaADACAAAAXQAgWwAAsg4AIAIAAACmDAAgWwAAsQ4AIA_hBQEAkgwAIekFQACUDAAh6gVAAJQMACGLBgEAkwwAIZkGAACpDPUGIpsGQACqDAAhngYBAJMMACHzBgAAqAzzBiL1BgEAkgwAIfYGAQCSDAAh9wYBAJIMACH4BgEAkwwAIfkGAQCTDAAh-gYBAJMMACH7BkAAlAwAIRUQAACzDgAgGAAArwwAIB4AAKwMACAfAACtDAAgIAAArgwAICEAALEMACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGLBgEAkwwAIZkGAACpDPUGIpsGQACqDAAhngYBAJMMACHzBgAAqAzzBiL1BgEAkgwAIfYGAQCSDAAh9wYBAJIMACH4BgEAkwwAIfkGAQCTDAAh-gYBAJMMACH7BkAAlAwAIQdiAAD0GgAgYwAA9xoAIMIHAAD1GgAgwwcAAPYaACDGBwAADgAgxwcAAA4AIMgHAAAQACAVEAAAtQ4AIBgAALYMACAeAACzDAAgHwAAtAwAICAAALUMACAhAAC4DAAg4QUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAZkGAAAA9QYCmwZAAAAAAZ4GAQAAAAHzBgAAAPMGAvUGAQAAAAH2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYBAAAAAfsGQAAAAAEDYgAA9BoAIMIHAAD1GgAgyAcAABAAIBoHAADIDgAgCQAAyQ4AIBsAAMoOACAdAADLDgAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAOAGArEGEAAAAAGyBgEAAAABswYCAAAAAcIGAQAAAAHcBgEAAAAB3gYAAADeBgLgBgEAAAAB4QYBAAAAAeIGAQAAAAHjBgEAAAAB5AYBAAAAAeUGAQAAAAHmBgEAAAAB5waAAAAAAegGQAAAAAHpBkAAAAABAgAAAFcAIGIAAMcOACADAAAAVwAgYgAAxw4AIGMAAMIOACABWwAA8xoAMB8HAADYCgAgCQAA3wsAIBkAAOgLACAbAADgCwAgHQAA6QsAIN4FAADlCwAw3wUAAFUAEOAFAADlCwAw4QUBAAAAAeYFAQCVCgAh5wUBAJUKACHpBUAAmQoAIeoFQACZCgAhjQYBAJUKACGZBgAA5wvgBiKxBhAAvwsAIbIGAQCVCgAhswYCAMALACHCBgEAlQoAIdwGAQCVCgAh3gYAAOYL3gYi4AYBAJUKACHhBgEAAAAB4gYBAAAAAeMGAQCWCgAh5AYBAJYKACHlBgEAlgoAIeYGAQCWCgAh5wYAAMcLACDoBkAAmQoAIekGQADICwAhAgAAAFcAIFsAAMIOACACAAAAvg4AIFsAAL8OACAa3gUAAL0OADDfBQAAvg4AEOAFAAC9DgAw4QUBAJUKACHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIY0GAQCVCgAhmQYAAOcL4AYisQYQAL8LACGyBgEAlQoAIbMGAgDACwAhwgYBAJUKACHcBgEAlQoAId4GAADmC94GIuAGAQCVCgAh4QYBAJUKACHiBgEAlgoAIeMGAQCWCgAh5AYBAJYKACHlBgEAlgoAIeYGAQCWCgAh5wYAAMcLACDoBkAAmQoAIekGQADICwAhGt4FAAC9DgAw3wUAAL4OABDgBQAAvQ4AMOEFAQCVCgAh5gUBAJUKACHnBQEAlQoAIekFQACZCgAh6gVAAJkKACGNBgEAlQoAIZkGAADnC-AGIrEGEAC_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_CwAh6wYQAL8LACEN3gUAAKEPADDfBQAAog8AEOAFAAChDwAw4QUBAJUKACHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIbIGAQCVCgAhwgYBAJUKACHaBiAAmAoAIeoGEAC_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_g0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABigYBAAAAAYsGAQAAAAECAAAAPAAgYgAA4Q8AIAMAAAA8ACBiAADhDwAgYwAA4A8AIAFbAACZGgAwAgAAADwAIFsAAOAPACACAAAAkg0AIFsAAN8PACAH4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYoGAQCSDAAhiwYBAJIMACELBwAAlw0AIAkAAJgNACAPAACWDQAgEAAA_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_A_HBiK6BgEAkgwAIcAGAQCTDAAhxAYBAJIMACHFBgEAkgwAIQHFBwAAAMcGAg0HAAD_DwAgCQAAgBAAIAsAAP4PACDhBQEAkgwAIeYFAQCTDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhmQYAAPwPxwYiugYBAJIMACHABgEAkwwAIcQGAQCSDAAhxQYBAJIMACELYgAAgRAAMGMAAIUQADDCBwAAghAAMMMHAACDEAAwxAcAAIQQACDFBwAAyw0AMMYHAADLDQAwxwcAAMsNADDIBwAAyw0AMMkHAACGEAAwygcAAM4NADAHYgAAgxoAIGMAAI8aACDCBwAAhBoAIMMHAACOGgAgxgcAABYAIMcHAAAWACDIBwAA7wQAIAdiAACBGgAgYwAAjBoAIMIHAACCGgAgwwcAAIsaACDGBwAAGAAgxwcAABgAIMgHAAAaACAOBwAA2Q0AIAkAANoNACApAACLEAAgKwAA2A0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABnwYBAAAAAboGAQAAAAHABgEAAAABxwYBAAAAAckGAQAAAAECAAAALAAgYgAAihAAIAMAAAAsACBiAACKEAAgYwAAiBAAIAFbAACKGgAwAgAAACwAIFsAAIgQACACAAAAzw0AIFsAAIcQACAK4QUBAJIMACHmBQEAkwwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIZ8GAQCSDAAhugYBAJIMACHABgEAkwwAIccGAQCTDAAhyQYBAJIMACEOBwAA1A0AIAkAANUNACApAACJEAAgKwAA0w0AIOEFAQCSDAAh5gUBAJMMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGfBgEAkgwAIboGAQCSDAAhwAYBAJMMACHHBgEAkwwAIckGAQCSDAAhBWIAAIUaACBjAACIGgAgwgcAAIYaACDDBwAAhxoAIMgHAAAoACAOBwAA2Q0AIAkAANoNACApAACLEAAgKwAA2A0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABnwYBAAAAAboGAQAAAAHABgEAAAABxwYBAAAAAckGAQAAAAEDYgAAhRoAIMIHAACGGgAgyAcAACgAIA0HAACOEAAgCQAAjxAAIAsAAI0QACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAxwYCugYBAAAAAcAGAQAAAAHEBgEAAAABxQYBAAAAAQRiAACBEAAwwgcAAIIQADDEBwAAhBAAIMgHAADLDQAwA2IAAIMaACDCBwAAhBoAIMgHAADvBAAgA2IAAIEaACDCBwAAghoAIMgHAAAaACAEYgAA8g8AMMIHAADzDwAwxAcAAPUPACDIBwAA9g8AMARiAAC-DwAwwgcAAL8PADDEBwAAwQ8AIMgHAADCDwAwBGIAALUPADDCBwAAtg8AMMQHAAC4DwAgyAcAAKINADAEYgAAmg8AMMIHAACbDwAwxAcAAJ0PACDIBwAAng8AMARiAACPDwAwwgcAAJAPADDEBwAAkg8AIMgHAAC6DgAwAAAAAAAAAAAAAAViAAD8GQAgYwAA_xkAIMIHAAD9GQAgwwcAAP4ZACDIBwAA3QcAIANiAAD8GQAgwgcAAP0ZACDIBwAA3QcAIAAAAAdiAAD3GQAgYwAA-hkAIMIHAAD4GQAgwwcAAPkZACDGBwAALwAgxwcAAC8AIMgHAADdBwAgA2IAAPcZACDCBwAA-BkAIMgHAADdBwAgAAAAAAAAAAALYgAAuxAAMGMAAMAQADDCBwAAvBAAMMMHAAC9EAAwxAcAAL4QACDFBwAAvxAAMMYHAAC_EAAwxwcAAL8QADDIBwAAvxAAMMkHAADBEAAwygcAAMIQADALYgAAshAAMGMAALYQADDCBwAAsxAAMMMHAAC0EAAwxAcAALUQACDFBwAAog0AMMYHAACiDQAwxwcAAKINADDIBwAAog0AMMkHAAC3EAAwygcAAKUNADAFYgAA4RkAIGMAAPUZACDCBwAA4hkAIMMHAAD0GQAgyAcAAO8EACAFYgAA3xkAIGMAAPIZACDCBwAA4BkAIMMHAADxGQAgyAcAABoAIBUHAADlDQAgCQAA4g0AIAsAANwNACAOAADhDQAgDwAA3w0AIBAAAPIOACAZAADgDQAgGwAA5A0AICwAAN0NACAtAADeDQAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBgEAAAABwgYBAAAAAZQHQAAAAAECAAAAKAAgYgAAuhAAIAMAAAAoACBiAAC6EAAgYwAAuRAAIAFbAADwGQAwAgAAACgAIFsAALkQACACAAAApg0AIFsAALgQACAL4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhigYBAJIMACGLBgEAkgwAIY0GAQCSDAAhwgYBAJIMACGUB0AAlAwAIRUHAACyDQAgCQAArw0AIAsAAKkNACAOAACuDQAgDwAArA0AIBAAAPAOACAZAACtDQAgGwAAsQ0AICwAAKoNACAtAACrDQAg4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhigYBAJIMACGLBgEAkgwAIY0GAQCSDAAhwgYBAJIMACGUB0AAlAwAIRUHAADlDQAgCQAA4g0AIAsAANwNACAOAADhDQAgDwAA3w0AIBAAAPIOACAZAADgDQAgGwAA5A0AICwAAN0NACAtAADeDQAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBgEAAAABwgYBAAAAAZQHQAAAAAENBwAA3RAAIAkAAN4QACANAADfEAAgEQAA4BAAIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABwAYBAAAAAcwGAgAAAAGVBwEAAAABlgcBAAAAAQIAAAAjACBiAADcEAAgAwAAACMAIGIAANwQACBjAADFEAAgAVsAAO8ZADASBwAA2AoAIAkAAN8LACAKAACCDAAgDQAAxAoAIBEAAIsLACDeBQAAgwwAMN8FAAAhABDgBQAAgwwAMOEFAQAAAAHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIcAGAQCWCgAhzAYCAMULACHSBgEAlgoAIZUHAQAAAAGWBwEAlQoAIQIAAAAjACBbAADFEAAgAgAAAMMQACBbAADEEAAgDd4FAADCEAAw3wUAAMMQABDgBQAAwhAAMOEFAQCVCgAh5gUBAJUKACHnBQEAlQoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIcwGAgDFCwAh0gYBAJYKACGVBwEAlQoAIZYHAQCVCgAhDd4FAADCEAAw3wUAAMMQABDgBQAAwhAAMOEFAQCVCgAh5gUBAJUKACHnBQEAlQoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIcwGAgDFCwAh0gYBAJYKACGVBwEAlQoAIZYHAQCVCgAhCeEFAQCSDAAh5gUBAJIMACHnBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIcwGAgDIDwAhlQcBAJIMACGWBwEAkgwAIQ0HAADGEAAgCQAAxxAAIA0AAMgQACARAADJEAAg4QUBAJIMACHmBQEAkgwAIecFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAhzAYCAMgPACGVBwEAkgwAIZYHAQCSDAAhBWIAAOUZACBjAADtGQAgwgcAAOYZACDDBwAA7BkAIMgHAADvBAAgBWIAAOMZACBjAADqGQAgwgcAAOQZACDDBwAA6RkAIMgHAAAaACALYgAA0xAAMGMAANcQADDCBwAA1BAAMMMHAADVEAAwxAcAANYQACDFBwAAog0AMMYHAACiDQAwxwcAAKINADDIBwAAog0AMMkHAADYEAAwygcAAKUNADALYgAAyhAAMGMAAM4QADDCBwAAyxAAMMMHAADMEAAwxAcAAM0QACDFBwAAjg0AMMYHAACODQAwxwcAAI4NADDIBwAAjg0AMMkHAADPEAAwygcAAJENADALBwAAnA0AIAkAAJ0NACAOAACaDQAgEAAA_g0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYsGAQAAAAECAAAAPAAgYgAA0hAAIAMAAAA8ACBiAADSEAAgYwAA0RAAIAFbAADoGQAwAgAAADwAIFsAANEQACACAAAAkg0AIFsAANAQACAH4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhiwYBAJIMACELBwAAlw0AIAkAAJgNACAOAACVDQAgEAAA_Q0AIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGJBgEAkgwAIYsGAQCSDAAhCwcAAJwNACAJAACdDQAgDgAAmg0AIBAAAP4NACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGLBgEAAAABFQcAAOUNACAJAADiDQAgCgAA4w0AIAsAANwNACAOAADhDQAgEAAA8g4AIBkAAOANACAbAADkDQAgLAAA3Q0AIC0AAN4NACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGLBgEAAAABjQYBAAAAAcIGAQAAAAHSBgEAAAABlAdAAAAAAQIAAAAoACBiAADbEAAgAwAAACgAIGIAANsQACBjAADaEAAgAVsAAOcZADACAAAAKAAgWwAA2hAAIAIAAACmDQAgWwAA2RAAIAvhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhiQYBAJIMACGLBgEAkgwAIY0GAQCSDAAhwgYBAJIMACHSBgEAkwwAIZQHQACUDAAhFQcAALINACAJAACvDQAgCgAAsA0AIAsAAKkNACAOAACuDQAgEAAA8A4AIBkAAK0NACAbAACxDQAgLAAAqg0AIC0AAKsNACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhiQYBAJIMACGLBgEAkgwAIY0GAQCSDAAhwgYBAJIMACHSBgEAkwwAIZQHQACUDAAhFQcAAOUNACAJAADiDQAgCgAA4w0AIAsAANwNACAOAADhDQAgEAAA8g4AIBkAAOANACAbAADkDQAgLAAA3Q0AIC0AAN4NACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGLBgEAAAABjQYBAAAAAcIGAQAAAAHSBgEAAAABlAdAAAAAAQ0HAADdEAAgCQAA3hAAIA0AAN8QACARAADgEAAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAABzAYCAAAAAZUHAQAAAAGWBwEAAAABA2IAAOUZACDCBwAA5hkAIMgHAADvBAAgA2IAAOMZACDCBwAA5BkAIMgHAAAaACAEYgAA0xAAMMIHAADUEAAwxAcAANYQACDIBwAAog0AMARiAADKEAAwwgcAAMsQADDEBwAAzRAAIMgHAACODQAwBGIAALsQADDCBwAAvBAAMMQHAAC-EAAgyAcAAL8QADAEYgAAshAAMMIHAACzEAAwxAcAALUQACDIBwAAog0AMANiAADhGQAgwgcAAOIZACDIBwAA7wQAIANiAADfGQAgwgcAAOAZACDIBwAAGgAgAAAAAsUHAQAAAATPBwEAAAAFC2IAAOoQADBjAADuEAAwwgcAAOsQADDDBwAA7BAAMMQHAADtEAAgxQcAANAOADDGBwAA0A4AMMcHAADQDgAwyAcAANAOADDJBwAA7xAAMMoHAADTDgAwDhcAAN0OACAYAADeDgAgGQAA_w4AIOEFAQAAAAHpBUAAAAAB6gVAAAAAAY0GAQAAAAGXBgEAAAABmQYAAAC4BgKaBgEAAAABmwZAAAAAAZwGQAAAAAGeBgEAAAABuAYBAAAAAQIAAABNACBiAADyEAAgAwAAAE0AIGIAAPIQACBjAADxEAAgAVsAAN4ZADACAAAATQAgWwAA8RAAIAIAAADUDgAgWwAA8BAAIAvhBQEAkgwAIekFQACUDAAh6gVAAJQMACGNBgEAkwwAIZcGAQCTDAAhmQYAANYOuAYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhngYBAJMMACG4BgEAkgwAIQ4XAADZDgAgGAAA2g4AIBkAAP4OACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGNBgEAkwwAIZcGAQCTDAAhmQYAANYOuAYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhngYBAJMMACG4BgEAkgwAIQ4XAADdDgAgGAAA3g4AIBkAAP8OACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGNBgEAAAABlwYBAAAAAZkGAAAAuAYCmgYBAAAAAZsGQAAAAAGcBkAAAAABngYBAAAAAbgGAQAAAAEBxQcBAAAABARiAADqEAAwwgcAAOsQADDEBwAA7RAAIMgHAADQDgAwAAAAAALFBwEAAAAEzwcBAAAABQtiAAD7EAAwYwAA_xAAMMIHAAD8EAAwwwcAAP0QADDEBwAA_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_CwAhsgYBAJUKACGzBgIAwAsAIbQGQACZCgAhtQZAAJkKACECAAAA2wEAIFsAAOQRACACAAAA4hEAIFsAAOMRACAP3gUAAOERADDfBQAA4hEAEOAFAADhEQAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGZBgAAvguxBiKtBgEAlgoAIa8GAAC9C68GIrEGEAC_CwAhsgYBAJUKACGzBgIAwAsAIbQGQACZCgAhtQZAAJkKACEP3gUAAOERADDfBQAA4hEAEOAFAADhEQAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGZBgAAvguxBiKtBgEAlgoAIa8GAAC9C68GIrEGEAC_CwAhsgYBAJUKACGzBgIAwAsAIbQGQACZCgAhtQZAAJkKACEL4QUBAJIMACHmBQEAkgwAIekFQACUDAAh6gVAAJQMACGZBgAAmQ6xBiKvBgAAmA6vBiKxBhAAmg4AIbIGAQCSDAAhswYCAJsOACG0BkAAlAwAIbUGQACUDAAhDAcAAJwOACDhBQEAkgwAIeYFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZkGAACZDrEGIq8GAACYDq8GIrEGEACaDgAhsgYBAJIMACGzBgIAmw4AIbQGQACUDAAhtQZAAJQMACEMBwAAng4AIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAALEGAq8GAAAArwYCsQYQAAAAAbIGAQAAAAGzBgIAAAABtAZAAAAAAbUGQAAAAAEDYgAArBkAIMIHAACtGQAgyAcAAOwCACADYgAAqhkAIMIHAACrGQAgyAcAAOwCACADYgAAqBkAIMIHAACpGQAgyAcAAO8EACAEYgAA2hEAMMIHAADbEQAwxAcAAN0RACDIBwAA3hEAMAAAAAtiAACQFAAwYwAAlRQAMMIHAACRFAAwwwcAAJIUADDEBwAAkxQAIMUHAACUFAAwxgcAAJQUADDHBwAAlBQAMMgHAACUFAAwyQcAAJYUADDKBwAAlxQAMAtiAACEFAAwYwAAiRQAMMIHAACFFAAwwwcAAIYUADDEBwAAhxQAIMUHAACIFAAwxgcAAIgUADDHBwAAiBQAMMgHAACIFAAwyQcAAIoUADDKBwAAixQAMAtiAADrEwAwYwAA8BMAMMIHAADsEwAwwwcAAO0TADDEBwAA7hMAIMUHAADvEwAwxgcAAO8TADDHBwAA7xMAMMgHAADvEwAwyQcAAPETADDKBwAA8hMAMAtiAADTEwAwYwAA2BMAMMIHAADUEwAwwwcAANUTADDEBwAA1hMAIMUHAADXEwAwxgcAANcTADDHBwAA1xMAMMgHAADXEwAwyQcAANkTADDKBwAA2hMAMAtiAADKEwAwYwAAzhMAMMIHAADLEwAwwwcAAMwTADDEBwAAzRMAIMUHAADCDwAwxgcAAMIPADDHBwAAwg8AMMgHAADCDwAwyQcAAM8TADDKBwAAxQ8AMAtiAAC_EwAwYwAAwxMAMMIHAADAEwAwwwcAAMETADDEBwAAwhMAIMUHAAC_EAAwxgcAAL8QADDHBwAAvxAAMMgHAAC_EAAwyQcAAMQTADDKBwAAwhAAMAtiAACwEwAwYwAAtRMAMMIHAACxEwAwwwcAALITADDEBwAAsxMAIMUHAAC0EwAwxgcAALQTADDHBwAAtBMAMMgHAAC0EwAwyQcAALYTADDKBwAAtxMAMAtiAACkEwAwYwAAqRMAMMIHAAClEwAwwwcAAKYTADDEBwAApxMAIMUHAACoEwAwxgcAAKgTADDHBwAAqBMAMMgHAACoEwAwyQcAAKoTADDKBwAAqxMAMAtiAACYEwAwYwAAnRMAMMIHAACZEwAwwwcAAJoTADDEBwAAmxMAIMUHAACcEwAwxgcAAJwTADDHBwAAnBMAMMgHAACcEwAwyQcAAJ4TADDKBwAAnxMAMAtiAACPEwAwYwAAkxMAMMIHAACQEwAwwwcAAJETADDEBwAAkhMAIMUHAACiDQAwxgcAAKINADDHBwAAog0AMMgHAACiDQAwyQcAAJQTADDKBwAApQ0AMAtiAACGEwAwYwAAihMAMMIHAACHEwAwwwcAAIgTADDEBwAAiRMAIMUHAACODQAwxgcAAI4NADDHBwAAjg0AMMgHAACODQAwyQcAAIsTADDKBwAAkQ0AMAtiAAD6EgAwYwAA_xIAMMIHAAD7EgAwwwcAAPwSADDEBwAA_RIAIMUHAAD-EgAwxgcAAP4SADDHBwAA_hIAMMgHAAD-EgAwyQcAAIATADDKBwAAgRMAMAtiAADxEgAwYwAA9RIAMMIHAADyEgAwwwcAAPMSADDEBwAA9BIAIMUHAADQDAAwxgcAANAMADDHBwAA0AwAMMgHAADQDAAwyQcAAPYSADDKBwAA0wwAMAtiAADoEgAwYwAA7BIAMMIHAADpEgAwwwcAAOoSADDEBwAA6xIAIMUHAADnDAAwxgcAAOcMADDHBwAA5wwAMMgHAADnDAAwyQcAAO0SADDKBwAA6gwAMAtiAADfEgAwYwAA4xIAMMIHAADgEgAwwwcAAOESADDEBwAA4hIAIMUHAAD3DAAwxgcAAPcMADDHBwAA9wwAMMgHAAD3DAAwyQcAAOQSADDKBwAA-gwAMAtiAADWEgAwYwAA2hIAMMIHAADXEgAwwwcAANgSADDEBwAA2RIAIMUHAAC9DAAwxgcAAL0MADDHBwAAvQwAMMgHAAC9DAAwyQcAANsSADDKBwAAwAwAMAtiAADNEgAwYwAA0RIAMMIHAADOEgAwwwcAAM8SADDEBwAA0BIAIMUHAACeDwAwxgcAAJ4PADDHBwAAng8AMMgHAACeDwAwyQcAANISADDKBwAAoQ8AMAtiAADEEgAwYwAAyBIAMMIHAADFEgAwwwcAAMYSADDEBwAAxxIAIMUHAAC6DgAwxgcAALoOADDHBwAAug4AMMgHAAC6DgAwyQcAAMkSADDKBwAAvQ4AMAdiAAC_EgAgYwAAwhIAIMIHAADAEgAgwwcAAMESACDGBwAA5QEAIMcHAADlAQAgyAcAAK0GACALYgAAthIAMGMAALoSADDCBwAAtxIAMMMHAAC4EgAwxAcAALkSACDFBwAA3hEAMMYHAADeEQAwxwcAAN4RADDIBwAA3hEAMMkHAAC7EgAwygcAAOERADALYgAArRIAMGMAALESADDCBwAArhIAMMMHAACvEgAwxAcAALASACDFBwAA9g8AMMYHAAD2DwAwxwcAAPYPADDIBwAA9g8AMMkHAACyEgAwygcAAPkPADALYgAApBIAMGMAAKgSADDCBwAApRIAMMMHAACmEgAwxAcAAKcSACDFBwAAyw0AMMYHAADLDQAwxwcAAMsNADDIBwAAyw0AMMkHAACpEgAwygcAAM4NADALYgAAmBIAMGMAAJ0SADDCBwAAmRIAMMMHAACaEgAwxAcAAJsSACDFBwAAnBIAMMYHAACcEgAwxwcAAJwSADDIBwAAnBIAMMkHAACeEgAwygcAAJ8SADALYgAAjxIAMGMAAJMSADDCBwAAkBIAMMMHAACREgAwxAcAAJISACDFBwAAogwAMMYHAACiDAAwxwcAAKIMADDIBwAAogwAMMkHAACUEgAwygcAAKUMADALYgAAhhIAMGMAAIoSADDCBwAAhxIAMMMHAACIEgAwxAcAAIkSACDFBwAAogwAMMYHAACiDAAwxwcAAKIMADDIBwAAogwAMMkHAACLEgAwygcAAKUMADAVEAAAtQ4AIBgAALYMACAZAAC3DAAgHgAAswwAICAAALUMACAhAAC4DAAg4QUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAY0GAQAAAAGZBgAAAPUGApsGQAAAAAGeBgEAAAAB8wYAAADzBgL1BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYBAAAAAfsGQAAAAAECAAAAXQAgYgAAjhIAIAMAAABdACBiAACOEgAgYwAAjRIAIAFbAACnGQAwAgAAAF0AIFsAAI0SACACAAAApgwAIFsAAIwSACAP4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhiwYBAJMMACGNBgEAkwwAIZkGAACpDPUGIpsGQACqDAAhngYBAJMMACHzBgAAqAzzBiL1BgEAkgwAIfcGAQCSDAAh-AYBAJMMACH5BgEAkwwAIfoGAQCTDAAh-wZAAJQMACEVEAAAsw4AIBgAAK8MACAZAACwDAAgHgAArAwAICAAAK4MACAhAACxDAAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhiwYBAJMMACGNBgEAkwwAIZkGAACpDPUGIpsGQACqDAAhngYBAJMMACHzBgAAqAzzBiL1BgEAkgwAIfcGAQCSDAAh-AYBAJMMACH5BgEAkwwAIfoGAQCTDAAh-wZAAJQMACEVEAAAtQ4AIBgAALYMACAZAAC3DAAgHgAAswwAICAAALUMACAhAAC4DAAg4QUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAY0GAQAAAAGZBgAAAPUGApsGQAAAAAGeBgEAAAAB8wYAAADzBgL1BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYBAAAAAfsGQAAAAAEVEAAAtQ4AIBgAALYMACAZAAC3DAAgHwAAtAwAICAAALUMACAhAAC4DAAg4QUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAY0GAQAAAAGZBgAAAPUGApsGQAAAAAGeBgEAAAAB8wYAAADzBgL2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYBAAAAAfsGQAAAAAECAAAAXQAgYgAAlxIAIAMAAABdACBiAACXEgAgYwAAlhIAIAFbAACmGQAwAgAAAF0AIFsAAJYSACACAAAApgwAIFsAAJUSACAP4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhiwYBAJMMACGNBgEAkwwAIZkGAACpDPUGIpsGQACqDAAhngYBAJMMACHzBgAAqAzzBiL2BgEAkgwAIfcGAQCSDAAh-AYBAJMMACH5BgEAkwwAIfoGAQCTDAAh-wZAAJQMACEVEAAAsw4AIBgAAK8MACAZAACwDAAgHwAArQwAICAAAK4MACAhAACxDAAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhiwYBAJMMACGNBgEAkwwAIZkGAACpDPUGIpsGQACqDAAhngYBAJMMACHzBgAAqAzzBiL2BgEAkgwAIfcGAQCSDAAh-AYBAJMMACH5BgEAkwwAIfoGAQCTDAAh-wZAAJQMACEVEAAAtQ4AIBgAALYMACAZAAC3DAAgHwAAtAwAICAAALUMACAhAAC4DAAg4QUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAY0GAQAAAAGZBgAAAPUGApsGQAAAAAGeBgEAAAAB8wYAAADzBgL2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYBAAAAAfsGQAAAAAEKQgAAxhEAIEQAAMcRACBFAADIEQAg4QUBAAAAAekFQAAAAAHqBUAAAAABkgYBAAAAAZMGAQAAAAHwBgEAAAAB8QYAAADvBgICAAAA7AEAIGIAAKMSACADAAAA7AEAIGIAAKMSACBjAACiEgAgAVsAAKUZADAPBwAA2AoAIEIAAJoKACBEAAC7CwAgRQAAqgsAIN4FAAC6CwAw3wUAAOoBABDgBQAAugsAMOEFAQAAAAHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIZMGAQCVCgAh8AYBAJUKACHxBgAAuQvvBiICAAAA7AEAIFsAAKISACACAAAAoBIAIFsAAKESACAL3gUAAJ8SADDfBQAAoBIAEOAFAACfEgAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIZMGAQCVCgAh8AYBAJUKACHxBgAAuQvvBiIL3gUAAJ8SADDfBQAAoBIAEOAFAACfEgAw4QUBAJUKACHmBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIZMGAQCVCgAh8AYBAJUKACHxBgAAuQvvBiIH4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhkgYBAJIMACGTBgEAkgwAIfAGAQCSDAAh8QYAAKMR7wYiCkIAAKoRACBEAACrEQAgRQAArBEAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZIGAQCSDAAhkwYBAJIMACHwBgEAkgwAIfEGAACjEe8GIgpCAADGEQAgRAAAxxEAIEUAAMgRACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGSBgEAAAABkwYBAAAAAfAGAQAAAAHxBgAAAO8GAg4JAADaDQAgKAAA1w0AICkAAIsQACArAADYDQAg4QUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAZ8GAQAAAAG6BgEAAAABwAYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAQIAAAAsACBiAACsEgAgAwAAACwAIGIAAKwSACBjAACrEgAgAVsAAKQZADACAAAALAAgWwAAqxIAIAIAAADPDQAgWwAAqhIAIArhBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIZ8GAQCSDAAhugYBAJIMACHABgEAkwwAIccGAQCTDAAhyAYBAJIMACHJBgEAkgwAIQ4JAADVDQAgKAAA0g0AICkAAIkQACArAADTDQAg4QUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGfBgEAkgwAIboGAQCSDAAhwAYBAJMMACHHBgEAkwwAIcgGAQCSDAAhyQYBAJIMACEOCQAA2g0AICgAANcNACApAACLEAAgKwAA2A0AIOEFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGfBgEAAAABugYBAAAAAcAGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAENCQAAjxAAIAsAAI0QACAbAAClEAAg4QUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAxwYCugYBAAAAAcAGAQAAAAHCBgEAAAABxAYBAAAAAcUGAQAAAAECAAAAMwAgYgAAtRIAIAMAAAAzACBiAAC1EgAgYwAAtBIAIAFbAACjGQAwAgAAADMAIFsAALQSACACAAAA-g8AIFsAALMSACAK4QUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGZBgAA_A_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-RIAIAMAAACjAQAgYgAA-RIAIGMAAPgSACABWwAAnBkAMAIAAACjAQAgWwAA-BIAIAIAAADUDAAgWwAA9xIAIA3hBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIfYFAQCSDAAhiwYBAJMMACGXBgEAkwwAIZkGAADWDJkGIpoGAQCTDAAhmwZAAKoMACGcBkAAlAwAIZ0GAQCSDAAhngYBAJMMACESCQAA3AwAIBAAAIwOACAWAADYDAAgGAAA2gwAIDMAANkMACDhBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIfYFAQCSDAAhiwYBAJMMACGXBgEAkwwAIZkGAADWDJkGIpoGAQCTDAAhmwZAAKoMACGcBkAAlAwAIZ0GAQCSDAAhngYBAJMMACESCQAA4gwAIBAAAI0OACAWAADeDAAgGAAA4AwAIDMAAN8MACDhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAAB9gUBAAAAAYsGAQAAAAGXBgEAAAABmQYAAACZBgKaBgEAAAABmwZAAAAAAZwGQAAAAAGdBgEAAAABngYBAAAAAR08AADmEQAgPQAA5xEAID8AAOkRACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAJEHApsGQAAAAAHABgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAABgAcAAACABwOBBwEAAAABggcAAACvBgODBxAAAAABhAcBAAAAAYUHAgAAAAGHBwAAAIcHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HgAAAAAGPB0AAAAABkQcBAAAAAZIHAQAAAAECAAAA1QEAIGIAAIUTACADAAAA1QEAIGIAAIUTACBjAACEEwAgAVsAAJsZADAiBwAAywsAIDwAAJoKACA9AADKCwAgPwAAkQsAIN4FAADCCwAw3wUAANMBABDgBQAAwgsAMOEFAQAAAAHmBQEAlgoAIekFQACZCgAh6gVAAJkKACGZBgAAyQuRByKbBkAAyAsAIcAGAQCWCgAh_AYBAJUKACH9BgEAlQoAIf4GAQCWCgAhgAcAAIILgAcjgQcBAJYKACGCBwAAwwuvBiODBxAAxAsAIYQHAQCVCgAhhQcCAMULACGHBwAAxguHByKIBwEAAAABiQcBAJYKACGKBwEAAAABiwcBAJYKACGMBwEAlgoAIY0HAQCWCgAhjgcAAMcLACCPB0AAyAsAIZEHAQCWCgAhkgcBAJYKACECAAAA1QEAIFsAAIQTACACAAAAghMAIFsAAIMTACAe3gUAAIETADDfBQAAghMAEOAFAACBEwAw4QUBAJUKACHmBQEAlgoAIekFQACZCgAh6gVAAJkKACGZBgAAyQuRByKbBkAAyAsAIcAGAQCWCgAh_AYBAJUKACH9BgEAlQoAIf4GAQCWCgAhgAcAAIILgAcjgQcBAJYKACGCBwAAwwuvBiODBxAAxAsAIYQHAQCVCgAhhQcCAMULACGHBwAAxguHByKIBwEAlgoAIYkHAQCWCgAhigcBAJYKACGLBwEAlgoAIYwHAQCWCgAhjQcBAJYKACGOBwAAxwsAII8HQADICwAhkQcBAJYKACGSBwEAlgoAIR7eBQAAgRMAMN8FAACCEwAQ4AUAAIETADDhBQEAlQoAIeYFAQCWCgAh6QVAAJkKACHqBUAAmQoAIZkGAADJC5EHIpsGQADICwAhwAYBAJYKACH8BgEAlQoAIf0GAQCVCgAh_gYBAJYKACGABwAAgguAByOBBwEAlgoAIYIHAADDC68GI4MHEADECwAhhAcBAJUKACGFBwIAxQsAIYcHAADGC4cHIogHAQCWCgAhiQcBAJYKACGKBwEAlgoAIYsHAQCWCgAhjAcBAJYKACGNBwEAlgoAIY4HAADHCwAgjwdAAMgLACGRBwEAlgoAIZIHAQCWCgAhGuEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZkGAADVEZEHIpsGQACqDAAhwAYBAJMMACH8BgEAkgwAIf0GAQCSDAAh_gYBAJMMACGABwAA0RGAByOBBwEAkwwAIYIHAADSEa8GI4MHEADTEQAhhAcBAJIMACGFBwIAyA8AIYcHAADUEYcHIogHAQCTDAAhiQcBAJMMACGKBwEAkwwAIYsHAQCTDAAhjAcBAJMMACGNBwEAkwwAIY4HgAAAAAGPB0AAqgwAIZEHAQCTDAAhkgcBAJMMACEdPAAA1hEAID0AANcRACA_AADZEQAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhmQYAANURkQcimwZAAKoMACHABgEAkwwAIfwGAQCSDAAh_QYBAJIMACH-BgEAkwwAIYAHAADREYAHI4EHAQCTDAAhggcAANIRrwYjgwcQANMRACGEBwEAkgwAIYUHAgDIDwAhhwcAANQRhwciiAcBAJMMACGJBwEAkwwAIYoHAQCTDAAhiwcBAJMMACGMBwEAkwwAIY0HAQCTDAAhjgeAAAAAAY8HQACqDAAhkQcBAJMMACGSBwEAkwwAIR08AADmEQAgPQAA5xEAID8AAOkRACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAJEHApsGQAAAAAHABgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAABgAcAAACABwOBBwEAAAABggcAAACvBgODBxAAAAABhAcBAAAAAYUHAgAAAAGHBwAAAIcHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HgAAAAAGPB0AAAAABkQcBAAAAAZIHAQAAAAELCQAAnQ0AIA4AAJoNACAPAACbDQAgEAAA_g0AIOEFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAECAAAAPAAgYgAAjhMAIAMAAAA8ACBiAACOEwAgYwAAjRMAIAFbAACaGQAwAgAAADwAIFsAAI0TACACAAAAkg0AIFsAAIwTACAH4QUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGJBgEAkgwAIYoGAQCSDAAhiwYBAJIMACELCQAAmA0AIA4AAJUNACAPAACWDQAgEAAA_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_BMAMMIHAAD5EwAwwwcAAPoTADDEBwAA-xMAIMUHAADCDwAwxgcAAMIPADDHBwAAwg8AMMgHAADCDwAwyQcAAP0TADDKBwAAxQ8AMA8HAADvDwAgCQAA8A8AIA0AAOwPACARAADtDwAgGwAAoBAAICQAAO4PACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHABgEAAAABwQYCAAAAAcIGAQAAAAECAAAANwAgYgAAgBQAIAMAAAA3ACBiAACAFAAgYwAA_xMAIAFbAACDGQAwAgAAADcAIFsAAP8TACACAAAAxg8AIFsAAP4TACAJ4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAhwAYBAJMMACHBBgIAyA8AIcIGAQCSDAAhDwcAAM0PACAJAADODwAgDQAAyg8AIBEAAMsPACAbAACfEAAgJAAAzA8AIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIcAGAQCTDAAhwQYCAMgPACHCBgEAkgwAIQ8HAADvDwAgCQAA8A8AIA0AAOwPACARAADtDwAgGwAAoBAAICQAAO4PACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHABgEAAAABwQYCAAAAAcIGAQAAAAEICQAAghQAICUAAIMUACDhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAcAGAQAAAAEDYgAAgRkAIMIHAACCGQAgyAcAABoAIARiAAD4EwAwwgcAAPkTADDEBwAA-xMAIMgHAADCDwAwDQkAAOQQACANAADiEAAgDwAA4RAAIOEFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGSBgEAAAABwAYBAAAAAcoGAQAAAAHLBkAAAAABzAYIAAAAAc0GCAAAAAECAAAAHwAgYgAAjxQAIAMAAAAfACBiAACPFAAgYwAAjhQAIAFbAACAGQAwEgcAANgKACAJAADfCwAgDQAAxAoAIA8AAIcLACDeBQAAhAwAMN8FAAAdABDgBQAAhAwAMOEFAQAAAAHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIZIGAQCVCgAhwAYBAJYKACHKBgEAlgoAIcsGQADICwAhzAYIAM8LACHNBggAzwsAIQIAAAAfACBbAACOFAAgAgAAAIwUACBbAACNFAAgDt4FAACLFAAw3wUAAIwUABDgBQAAixQAMOEFAQCVCgAh5gUBAJUKACHnBQEAlQoAIekFQACZCgAh6gVAAJkKACGSBgEAlQoAIcAGAQCWCgAhygYBAJYKACHLBkAAyAsAIcwGCADPCwAhzQYIAM8LACEO3gUAAIsUADDfBQAAjBQAEOAFAACLFAAw4QUBAJUKACHmBQEAlQoAIecFAQCVCgAh6QVAAJkKACHqBUAAmQoAIZIGAQCVCgAhwAYBAJYKACHKBgEAlgoAIcsGQADICwAhzAYIAM8LACHNBggAzwsAIQrhBQEAkgwAIecFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZIGAQCSDAAhwAYBAJMMACHKBgEAkwwAIcsGQACqDAAhzAYIAMMMACHNBggAwwwAIQ0JAACxEAAgDQAArxAAIA8AAK4QACDhBQEAkgwAIecFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZIGAQCSDAAhwAYBAJMMACHKBgEAkwwAIcsGQACqDAAhzAYIAMMMACHNBggAwwwAIQ0JAADkEAAgDQAA4hAAIA8AAOEQACDhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABkgYBAAAAAcAGAQAAAAHKBgEAAAABywZAAAAAAcwGCAAAAAHNBggAAAABBzkAAOYVACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAFAAgYgAA5RUAIAMAAAAUACBiAADlFQAgYwAAmhQAIAFbAAD_GAAwDAcAAMsLACA5AACIDAAg3gUAAIcMADDfBQAAEgAQ4AUAAIcMADDhBQEAAAAB5gUBAJYKACHpBUAAmQoAIeoFQACZCgAhwAYBAJYKACH-BgEAlgoAIZMHAQCVCgAhAgAAABQAIFsAAJoUACACAAAAmBQAIFsAAJkUACAK3gUAAJcUADDfBQAAmBQAEOAFAACXFAAw4QUBAJUKACHmBQEAlgoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIf4GAQCWCgAhkwcBAJUKACEK3gUAAJcUADDfBQAAmBQAEOAFAACXFAAw4QUBAJUKACHmBQEAlgoAIekFQACZCgAh6gVAAJkKACHABgEAlgoAIf4GAQCWCgAhkwcBAJUKACEG4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACH-BgEAkwwAIZMHAQCSDAAhBzkAAJsUACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIf4GAQCTDAAhkwcBAJIMACELYgAAnBQAMGMAAKEUADDCBwAAnRQAMMMHAACeFAAwxAcAAJ8UACDFBwAAoBQAMMYHAACgFAAwxwcAAKAUADDIBwAAoBQAMMkHAACiFAAwygcAAKMUADAXDAAA4hUAIA0AANoVACARAADbFQAgHAAA4RUAICUAANcVACAnAADgFQAgKgAA4xUAIC4AANQVACAvAADVFQAgMAAA1hUAIDEAANgVACAyAADZFQAgNAAA3BUAIDUAAN0VACA2AADeFQAgNwAA3xUAIDgAAOQVACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAA0xUAIAMAAAAaACBiAADTFQAgYwAAphQAIAFbAAD-GAAwHAgAAIYMACAMAADCCgAgDQAAxAoAIBEAAIsLACAcAADGCgAgJQAAwwoAICcAAMUKACAqAACSCwAgLgAAhAsAIC8AAIULACAwAACHCwAgMQAAiQsAIDIAAIoLACA0AADVCgAgNQAAjQsAIDYAAI4LACA3AACPCwAgOAAAlAsAIN4FAACFDAAw3wUAABgAEOAFAACFDAAw4QUBAAAAAekFQACZCgAh6gVAAJkKACHABgEAlgoAIdEGAQCWCgAh_gYBAJYKACGTBwEAlQoAIQIAAAAaACBbAACmFAAgAgAAAKQUACBbAAClFAAgCt4FAACjFAAw3wUAAKQUABDgBQAAoxQAMOEFAQCVCgAh6QVAAJkKACHqBUAAmQoAIcAGAQCWCgAh0QYBAJYKACH-BgEAlgoAIZMHAQCVCgAhCt4FAACjFAAw3wUAAKQUABDgBQAAoxQAMOEFAQCVCgAh6QVAAJkKACHqBUAAmQoAIcAGAQCWCgAh0QYBAJYKACH-BgEAlgoAIZMHAQCVCgAhBuEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh_gYBAJMMACGTBwEAkgwAIRcMAAC1FAAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQtiAADKFQAwYwAAzhUAMMIHAADLFQAwwwcAAMwVADDEBwAAzRUAIMUHAACIFAAwxgcAAIgUADDHBwAAiBQAMMgHAACIFAAwyQcAAM8VADDKBwAAixQAMAtiAAC_FQAwYwAAwxUAMMIHAADAFQAwwwcAAMEVADDEBwAAwhUAIMUHAADvEwAwxgcAAO8TADDHBwAA7xMAMMgHAADvEwAwyQcAAMQVADDKBwAA8hMAMAtiAAC2FQAwYwAAuhUAMMIHAAC3FQAwwwcAALgVADDEBwAAuRUAIMUHAAC_EAAwxgcAAL8QADDHBwAAvxAAMMgHAAC_EAAwyQcAALsVADDKBwAAwhAAMAtiAACtFQAwYwAAsRUAMMIHAACuFQAwwwcAAK8VADDEBwAAsBUAIMUHAADCDwAwxgcAAMIPADDHBwAAwg8AMMgHAADCDwAwyQcAALIVADDKBwAAxQ8AMAtiAACkFQAwYwAAqBUAMMIHAAClFQAwwwcAAKYVADDEBwAApxUAIMUHAACoEwAwxgcAAKgTADDHBwAAqBMAMMgHAACoEwAwyQcAAKkVADDKBwAAqxMAMAtiAACbFQAwYwAAnxUAMMIHAACcFQAwwwcAAJ0VADDEBwAAnhUAIMUHAACcEwAwxgcAAJwTADDHBwAAnBMAMMgHAACcEwAwyQcAAKAVADDKBwAAnxMAMAtiAACSFQAwYwAAlhUAMMIHAACTFQAwwwcAAJQVADDEBwAAlRUAIMUHAACiDQAwxgcAAKINADDHBwAAog0AMMgHAACiDQAwyQcAAJcVADDKBwAApQ0AMAtiAACJFQAwYwAAjRUAMMIHAACKFQAwwwcAAIsVADDEBwAAjBUAIMUHAACODQAwxgcAAI4NADDHBwAAjg0AMMgHAACODQAwyQcAAI4VADDKBwAAkQ0AMAtiAACAFQAwYwAAhBUAMMIHAACBFQAwwwcAAIIVADDEBwAAgxUAIMUHAADQDAAwxgcAANAMADDHBwAA0AwAMMgHAADQDAAwyQcAAIUVADDKBwAA0wwAMAtiAAD3FAAwYwAA-xQAMMIHAAD4FAAwwwcAAPkUADDEBwAA-hQAIMUHAADnDAAwxgcAAOcMADDHBwAA5wwAMMgHAADnDAAwyQcAAPwUADDKBwAA6gwAMAtiAADuFAAwYwAA8hQAMMIHAADvFAAwwwcAAPAUADDEBwAA8RQAIMUHAAD3DAAwxgcAAPcMADDHBwAA9wwAMMgHAAD3DAAwyQcAAPMUADDKBwAA-gwAMAtiAADlFAAwYwAA6RQAMMIHAADmFAAwwwcAAOcUADDEBwAA6BQAIMUHAAC9DAAwxgcAAL0MADDHBwAAvQwAMMgHAAC9DAAwyQcAAOoUADDKBwAAwAwAMAtiAADcFAAwYwAA4BQAMMIHAADdFAAwwwcAAN4UADDEBwAA3xQAIMUHAACeDwAwxgcAAJ4PADDHBwAAng8AMMgHAACeDwAwyQcAAOEUADDKBwAAoQ8AMAtiAADTFAAwYwAA1xQAMMIHAADUFAAwwwcAANUUADDEBwAA1hQAIMUHAAC6DgAwxgcAALoOADDHBwAAug4AMMgHAAC6DgAwyQcAANgUADDKBwAAvQ4AMAtiAADKFAAwYwAAzhQAMMIHAADLFAAwwwcAAMwUADDEBwAAzRQAIMUHAAD2DwAwxgcAAPYPADDHBwAA9g8AMMgHAAD2DwAwyQcAAM8UADDKBwAA-Q8AMAtiAADBFAAwYwAAxRQAMMIHAADCFAAwwwcAAMMUADDEBwAAxBQAIMUHAADLDQAwxgcAAMsNADDHBwAAyw0AMMgHAADLDQAwyQcAAMYUADDKBwAAzg0AMAtiAAC4FAAwYwAAvBQAMMIHAAC5FAAwwwcAALoUADDEBwAAuxQAIMUHAACiDAAwxgcAAKIMADDHBwAAogwAMMgHAACiDAAwyQcAAL0UADDKBwAApQwAMBUQAAC1DgAgGAAAtgwAIBkAALcMACAeAACzDAAgHwAAtAwAICAAALUMACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGLBgEAAAABjQYBAAAAAZkGAAAA9QYCmwZAAAAAAZ4GAQAAAAHzBgAAAPMGAvUGAQAAAAH2BgEAAAAB9wYBAAAAAfkGAQAAAAH6BgEAAAAB-wZAAAAAAQIAAABdACBiAADAFAAgAwAAAF0AIGIAAMAUACBjAAC_FAAgAVsAAP0YADACAAAAXQAgWwAAvxQAIAIAAACmDAAgWwAAvhQAIA_hBQEAkgwAIekFQACUDAAh6gVAAJQMACGLBgEAkwwAIY0GAQCTDAAhmQYAAKkM9QYimwZAAKoMACGeBgEAkwwAIfMGAACoDPMGIvUGAQCSDAAh9gYBAJIMACH3BgEAkgwAIfkGAQCTDAAh-gYBAJMMACH7BkAAlAwAIRUQAACzDgAgGAAArwwAIBkAALAMACAeAACsDAAgHwAArQwAICAAAK4MACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGLBgEAkwwAIY0GAQCTDAAhmQYAAKkM9QYimwZAAKoMACGeBgEAkwwAIfMGAACoDPMGIvUGAQCSDAAh9gYBAJIMACH3BgEAkgwAIfkGAQCTDAAh-gYBAJMMACH7BkAAlAwAIRUQAAC1DgAgGAAAtgwAIBkAALcMACAeAACzDAAgHwAAtAwAICAAALUMACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGLBgEAAAABjQYBAAAAAZkGAAAA9QYCmwZAAAAAAZ4GAQAAAAHzBgAAAPMGAvUGAQAAAAH2BgEAAAAB9wYBAAAAAfkGAQAAAAH6BgEAAAAB-wZAAAAAAQ4HAADZDQAgKAAA1w0AICkAAIsQACArAADYDQAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAZ8GAQAAAAG6BgEAAAABwAYBAAAAAccGAQAAAAHIBgEAAAAByQYBAAAAAQIAAAAsACBiAADJFAAgAwAAACwAIGIAAMkUACBjAADIFAAgAVsAAPwYADACAAAALAAgWwAAyBQAIAIAAADPDQAgWwAAxxQAIArhBQEAkgwAIeYFAQCTDAAh6QVAAJQMACHqBUAAlAwAIZ8GAQCSDAAhugYBAJIMACHABgEAkwwAIccGAQCTDAAhyAYBAJIMACHJBgEAkgwAIQ4HAADUDQAgKAAA0g0AICkAAIkQACArAADTDQAg4QUBAJIMACHmBQEAkwwAIekFQACUDAAh6gVAAJQMACGfBgEAkgwAIboGAQCSDAAhwAYBAJMMACHHBgEAkwwAIcgGAQCSDAAhyQYBAJIMACEOBwAA2Q0AICgAANcNACApAACLEAAgKwAA2A0AIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGfBgEAAAABugYBAAAAAcAGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAENBwAAjhAAIAsAAI0QACAbAAClEAAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAxwYCugYBAAAAAcAGAQAAAAHCBgEAAAABxAYBAAAAAcUGAQAAAAECAAAAMwAgYgAA0hQAIAMAAAAzACBiAADSFAAgYwAA0RQAIAFbAAD7GAAwAgAAADMAIFsAANEUACACAAAA-g8AIFsAANAUACAK4QUBAJIMACHmBQEAkwwAIekFQACUDAAh6gVAAJQMACGZBgAA_A_HBiK6BgEAkgwAIcAGAQCTDAAhwgYBAJMMACHEBgEAkgwAIcUGAQCSDAAhDQcAAP8PACALAAD-DwAgGwAApBAAIOEFAQCSDAAh5gUBAJMMACHpBUAAlAwAIeoFQACUDAAhmQYAAPwPxwYiugYBAJIMACHABgEAkwwAIcIGAQCTDAAhxAYBAJIMACHFBgEAkgwAIQ0HAACOEAAgCwAAjRAAIBsAAKUQACDhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABmQYAAADHBgK6BgEAAAABwAYBAAAAAcIGAQAAAAHEBgEAAAABxQYBAAAAARoHAADIDgAgGQAAmQ8AIBsAAMoOACAdAADLDgAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAY0GAQAAAAGZBgAAAOAGArEGEAAAAAGyBgEAAAABswYCAAAAAcIGAQAAAAHcBgEAAAAB3gYAAADeBgLgBgEAAAAB4QYBAAAAAeIGAQAAAAHjBgEAAAAB5AYBAAAAAeUGAQAAAAHmBgEAAAAB5waAAAAAAegGQAAAAAHpBkAAAAABAgAAAFcAIGIAANsUACADAAAAVwAgYgAA2xQAIGMAANoUACABWwAA-hgAMAIAAABXACBbAADaFAAgAgAAAL4OACBbAADZFAAgFuEFAQCSDAAh5gUBAJIMACHpBUAAlAwAIeoFQACUDAAhjQYBAJIMACGZBgAAwQ7gBiKxBhAAmg4AIbIGAQCSDAAhswYCAJsOACHCBgEAkgwAIdwGAQCSDAAh3gYAAMAO3gYi4AYBAJIMACHhBgEAkgwAIeIGAQCTDAAh4wYBAJMMACHkBgEAkwwAIeUGAQCTDAAh5gYBAJMMACHnBoAAAAAB6AZAAJQMACHpBkAAqgwAIRoHAADDDgAgGQAAlw8AIBsAAMUOACAdAADGDgAg4QUBAJIMACHmBQEAkgwAIekFQACUDAAh6gVAAJQMACGNBgEAkgwAIZkGAADBDuAGIrEGEACaDgAhsgYBAJIMACGzBgIAmw4AIcIGAQCSDAAh3AYBAJIMACHeBgAAwA7eBiLgBgEAkgwAIeEGAQCSDAAh4gYBAJMMACHjBgEAkwwAIeQGAQCTDAAh5QYBAJMMACHmBgEAkwwAIecGgAAAAAHoBkAAlAwAIekGQACqDAAhGgcAAMgOACAZAACZDwAgGwAAyg4AIB0AAMsOACDhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABjQYBAAAAAZkGAAAA4AYCsQYQAAAAAbIGAQAAAAGzBgIAAAABwgYBAAAAAdwGAQAAAAHeBgAAAN4GAuAGAQAAAAHhBgEAAAAB4gYBAAAAAeMGAQAAAAHkBgEAAAAB5QYBAAAAAeYGAQAAAAHnBoAAAAAB6AZAAAAAAekGQAAAAAEMBwAAsg8AIBsAAJgRACAcAAC0DwAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAbIGAQAAAAHCBgEAAAAB2gYgAAAAAeoGEAAAAAHrBhAAAAABAgAAAHYAIGIAAOQUACADAAAAdgAgYgAA5BQAIGMAAOMUACABWwAA-RgAMAIAAAB2ACBbAADjFAAgAgAAAKIPACBbAADiFAAgCeEFAQCSDAAh5gUBAJIMACHpBUAAlAwAIeoFQACUDAAhsgYBAJIMACHCBgEAkgwAIdoGIAD0DQAh6gYQAJoOACHrBhAAmg4AIQwHAAClDwAgGwAAlxEAIBwAAKcPACDhBQEAkgwAIeYFAQCSDAAh6QVAAJQMACHqBUAAlAwAIbIGAQCSDAAhwgYBAJIMACHaBiAA9A0AIeoGEACaDgAh6wYQAJoOACEMBwAAsg8AIBsAAJgRACAcAAC0DwAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAbIGAQAAAAHCBgEAAAAB2gYgAAAAAeoGEAAAAAHrBhAAAAABFgcAAMoMACAQAAC5DQAgKQAAyQwAIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGLBgEAAAABnwYBAAAAAaAGCAAAAAGhBggAAAABogYIAAAAAaMGCAAAAAGkBggAAAABpQYIAAAAAaYGCAAAAAGnBggAAAABqAYIAAAAAakGCAAAAAGqBggAAAABqwYIAAAAAawGCAAAAAECAAAArQEAIGIAAO0UACADAAAArQEAIGIAAO0UACBjAADsFAAgAVsAAPgYADACAAAArQEAIFsAAOwUACACAAAAwQwAIFsAAOsUACAT4QUBAJIMACHmBQEAkgwAIekFQACUDAAh6gVAAJQMACGLBgEAkgwAIZ8GAQCSDAAhoAYIAMMMACGhBggAwwwAIaIGCADDDAAhowYIAMMMACGkBggAwwwAIaUGCADDDAAhpgYIAMMMACGnBggAwwwAIagGCADDDAAhqQYIAMMMACGqBggAwwwAIasGCADDDAAhrAYIAMMMACEWBwAAxgwAIBAAALgNACApAADFDAAg4QUBAJIMACHmBQEAkgwAIekFQACUDAAh6gVAAJQMACGLBgEAkgwAIZ8GAQCSDAAhoAYIAMMMACGhBggAwwwAIaIGCADDDAAhowYIAMMMACGkBggAwwwAIaUGCADDDAAhpgYIAMMMACGnBggAwwwAIagGCADDDAAhqQYIAMMMACGqBggAwwwAIasGCADDDAAhrAYIAMMMACEWBwAAygwAIBAAALkNACApAADJDAAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAYsGAQAAAAGfBgEAAAABoAYIAAAAAaEGCAAAAAGiBggAAAABowYIAAAAAaQGCAAAAAGlBggAAAABpgYIAAAAAacGCAAAAAGoBggAAAABqQYIAAAAAaoGCAAAAAGrBggAAAABrAYIAAAAAQ0HAACDDQAgEgAAgw4AIBkAAIINACDhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABjAYBAAAAAY0GAQAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBkAAAAABAgAAAEYAIGIAAPYUACADAAAARgAgYgAA9hQAIGMAAPUUACABWwAA9xgAMAIAAABGACBbAAD1FAAgAgAAAPsMACBbAAD0FAAgCuEFAQCSDAAh5gUBAJIMACHpBUAAlAwAIeoFQACUDAAhjAYBAJIMACGNBgEAkgwAIY4GAQCTDAAhjwYBAJMMACGQBgEAkwwAIZEGQACUDAAhDQcAAP8MACASAACCDgAgGQAA_gwAIOEFAQCSDAAh5gUBAJIMACHpBUAAlAwAIeoFQACUDAAhjAYBAJIMACGNBgEAkgwAIY4GAQCTDAAhjwYBAJMMACGQBgEAkwwAIZEGQACUDAAhDQcAAIMNACASAACDDgAgGQAAgg0AIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGMBgEAAAABjQYBAAAAAY4GAQAAAAGPBgEAAAABkAYBAAAAAZEGQAAAAAEOBwAAhw0AIA4AAIYNACAQAACIDgAgIwAAiQ0AIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABiwYBAAAAAZIGAQAAAAGTBgEAAAABlQYAAACVBgKWBkAAAAABAgAAAEEAIGIAAP8UACADAAAAQQAgYgAA_xQAIGMAAP4UACABWwAA9hgAMAIAAABBACBbAAD-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_gYBAAAAAZMHAQAAAAEEYgAAyhUAMMIHAADLFQAwxAcAAM0VACDIBwAAiBQAMARiAAC_FQAwwgcAAMAVADDEBwAAwhUAIMgHAADvEwAwBGIAALYVADDCBwAAtxUAMMQHAAC5FQAgyAcAAL8QADAEYgAArRUAMMIHAACuFQAwxAcAALAVACDIBwAAwg8AMARiAACkFQAwwgcAAKUVADDEBwAApxUAIMgHAACoEwAwBGIAAJsVADDCBwAAnBUAMMQHAACeFQAgyAcAAJwTADAEYgAAkhUAMMIHAACTFQAwxAcAAJUVACDIBwAAog0AMARiAACJFQAwwgcAAIoVADDEBwAAjBUAIMgHAACODQAwBGIAAIAVADDCBwAAgRUAMMQHAACDFQAgyAcAANAMADAEYgAA9xQAMMIHAAD4FAAwxAcAAPoUACDIBwAA5wwAMARiAADuFAAwwgcAAO8UADDEBwAA8RQAIMgHAAD3DAAwBGIAAOUUADDCBwAA5hQAMMQHAADoFAAgyAcAAL0MADAEYgAA3BQAMMIHAADdFAAwxAcAAN8UACDIBwAAng8AMARiAADTFAAwwgcAANQUADDEBwAA1hQAIMgHAAC6DgAwBGIAAMoUADDCBwAAyxQAMMQHAADNFAAgyAcAAPYPADAEYgAAwRQAMMIHAADCFAAwxAcAAMQUACDIBwAAyw0AMARiAAC4FAAwwgcAALkUADDEBwAAuxQAIMgHAACiDAAwBzkAAOYVACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB_gYBAAAAAZMHAQAAAAEEYgAAnBQAMMIHAACdFAAwxAcAAJ8UACDIBwAAoBQAMARiAACQFAAwwgcAAJEUADDEBwAAkxQAIMgHAACUFAAwBGIAAIQUADDCBwAAhRQAMMQHAACHFAAgyAcAAIgUADAEYgAA6xMAMMIHAADsEwAwxAcAAO4TACDIBwAA7xMAMARiAADTEwAwwgcAANQTADDEBwAA1hMAIMgHAADXEwAwBGIAAMoTADDCBwAAyxMAMMQHAADNEwAgyAcAAMIPADAEYgAAvxMAMMIHAADAEwAwxAcAAMITACDIBwAAvxAAMARiAACwEwAwwgcAALETADDEBwAAsxMAIMgHAAC0EwAwBGIAAKQTADDCBwAApRMAMMQHAACnEwAgyAcAAKgTADAEYgAAmBMAMMIHAACZEwAwxAcAAJsTACDIBwAAnBMAMARiAACPEwAwwgcAAJATADDEBwAAkhMAIMgHAACiDQAwBGIAAIYTADDCBwAAhxMAMMQHAACJEwAgyAcAAI4NADAEYgAA-hIAMMIHAAD7EgAwxAcAAP0SACDIBwAA_hIAMARiAADxEgAwwgcAAPISADDEBwAA9BIAIMgHAADQDAAwBGIAAOgSADDCBwAA6RIAMMQHAADrEgAgyAcAAOcMADAEYgAA3xIAMMIHAADgEgAwxAcAAOISACDIBwAA9wwAMARiAADWEgAwwgcAANcSADDEBwAA2RIAIMgHAAC9DAAwBGIAAM0SADDCBwAAzhIAMMQHAADQEgAgyAcAAJ4PADAEYgAAxBIAMMIHAADFEgAwxAcAAMcSACDIBwAAug4AMANiAAC_EgAgwgcAAMASACDIBwAArQYAIARiAAC2EgAwwgcAALcSADDEBwAAuRIAIMgHAADeEQAwBGIAAK0SADDCBwAArhIAMMQHAACwEgAgyAcAAPYPADAEYgAApBIAMMIHAAClEgAwxAcAAKcSACDIBwAAyw0AMARiAACYEgAwwgcAAJkSADDEBwAAmxIAIMgHAACcEgAwBGIAAI8SADDCBwAAkBIAMMQHAACSEgAgyAcAAKIMADAEYgAAhhIAMMIHAACHEgAwxAcAAIkSACDIBwAAogwAMAAAAAAAAAAAAAAAAAACBwAAjBEAINsGAACODAAgAAAAAAAAAAdiAADjGAAgYwAA5hgAIMIHAADkGAAgwwcAAOUYACDGBwAAFgAgxwcAABYAIMgHAADvBAAgA2IAAOMYACDCBwAA5BgAIMgHAADvBAAgAAAAB2IAAN4YACBjAADhGAAgwgcAAN8YACDDBwAA4BgAIMYHAAASACDHBwAAEgAgyAcAABQAIANiAADeGAAgwgcAAN8YACDIBwAAFAAgAAAAAAAAAAAAAAAAAAViAADZGAAgYwAA3BgAIMIHAADaGAAgwwcAANsYACDIBwAA7wQAIANiAADZGAAgwgcAANoYACDIBwAA7wQAIAAAAAAAAAViAADUGAAgYwAA1xgAIMIHAADVGAAgwwcAANYYACDIBwAA7AIAIANiAADUGAAgwgcAANUYACDIBwAA7AIAIAAAAAAAAAViAADPGAAgYwAA0hgAIMIHAADQGAAgwwcAANEYACDIBwAA7AIAIANiAADPGAAgwgcAANAYACDIBwAA7AIAIAAAAAViAADKGAAgYwAAzRgAIMIHAADLGAAgwwcAAMwYACDIBwAA7AIAIANiAADKGAAgwgcAAMsYACDIBwAA7AIAIAAAAAtiAADuFwAwYwAA8xcAMMIHAADvFwAwwwcAAPAXADDEBwAA8RcAIMUHAADyFwAwxgcAAPIXADDHBwAA8hcAMMgHAADyFwAwyQcAAPQXADDKBwAA9RcAMAtiAADiFwAwYwAA5xcAMMIHAADjFwAwwwcAAOQXADDEBwAA5RcAIMUHAADmFwAwxgcAAOYXADDHBwAA5hcAMMgHAADmFwAwyQcAAOgXADDKBwAA6RcAMAtiAADXFwAwYwAA2xcAMMIHAADYFwAwwwcAANkXADDEBwAA2hcAIMUHAAC0EwAwxgcAALQTADDHBwAAtBMAMMgHAAC0EwAwyQcAANwXADDKBwAAtxMAMAtiAADOFwAwYwAA0hcAMMIHAADPFwAwwwcAANAXADDEBwAA0RcAIMUHAACoEwAwxgcAAKgTADDHBwAAqBMAMMgHAACoEwAwyQcAANMXADDKBwAAqxMAMAtiAADFFwAwYwAAyRcAMMIHAADGFwAwwwcAAMcXADDEBwAAyBcAIMUHAACcEwAwxgcAAJwTADDHBwAAnBMAMMgHAACcEwAwyQcAAMoXADDKBwAAnxMAMAtiAAC8FwAwYwAAwBcAMMIHAAC9FwAwwwcAAL4XADDEBwAAvxcAIMUHAAD-EgAwxgcAAP4SADDHBwAA_hIAMMgHAAD-EgAwyQcAAMEXADDKBwAAgRMAMAtiAACzFwAwYwAAtxcAMMIHAAC0FwAwwwcAALUXADDEBwAAthcAIMUHAAD-EgAwxgcAAP4SADDHBwAA_hIAMMgHAAD-EgAwyQcAALgXADDKBwAAgRMAMAtiAACqFwAwYwAArhcAMMIHAACrFwAwwwcAAKwXADDEBwAArRcAIMUHAADQDAAwxgcAANAMADDHBwAA0AwAMMgHAADQDAAwyQcAAK8XADDKBwAA0wwAMAtiAAChFwAwYwAApRcAMMIHAACiFwAwwwcAAKMXADDEBwAApBcAIMUHAADQDAAwxgcAANAMADDHBwAA0AwAMMgHAADQDAAwyQcAAKYXADDKBwAA0wwAMAdiAACcFwAgYwAAnxcAIMIHAACdFwAgwwcAAJ4XACDGBwAAowIAIMcHAACjAgAgyAcAANMJACALYgAAkxcAMGMAAJcXADDCBwAAlBcAMMMHAACVFwAwxAcAAJYXACDFBwAA0A4AMMYHAADQDgAwxwcAANAOADDIBwAA0A4AMMkHAACYFwAwygcAANMOADALYgAAihcAMGMAAI4XADDCBwAAixcAMMMHAACMFwAwxAcAAI0XACDFBwAA0A4AMMYHAADQDgAwxwcAANAOADDIBwAA0A4AMMkHAACPFwAwygcAANMOADAHYgAAhRcAIGMAAIgXACDCBwAAhhcAIMMHAACHFwAgxgcAAKcCACDHBwAApwIAIMgHAAD1BwAgC2IAAPkWADBjAAD-FgAwwgcAAPoWADDDBwAA-xYAMMQHAAD8FgAgxQcAAP0WADDGBwAA_RYAMMcHAAD9FgAwyAcAAP0WADDJBwAA_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_QWAAAAAAf8FIAAAAAG5BgAAhQ8AIAIAAAD1BwAgYgAAhRcAIAMAAACnAgAgYgAAhRcAIGMAAIkXACAKAAAApwIAIFsAAIkXACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACH3BQEAkgwAIfgFAQCSDAAh_QWAAAAAAf8FIAD0DQAhuQYAAIMPACAI4QUBAJIMACHpBUAAlAwAIeoFQACUDAAh9wUBAJIMACH4BQEAkgwAIf0FgAAAAAH_BSAA9A0AIbkGAACDDwAgDhYAANwOACAXAADdDgAgGQAA_w4AIOEFAQAAAAHpBUAAAAAB6gVAAAAAAY0GAQAAAAGXBgEAAAABmQYAAAC4BgKaBgEAAAABmwZAAAAAAZwGQAAAAAGdBgEAAAABuAYBAAAAAQIAAABNACBiAACSFwAgAwAAAE0AIGIAAJIXACBjAACRFwAgAVsAAMQYADACAAAATQAgWwAAkRcAIAIAAADUDgAgWwAAkBcAIAvhBQEAkgwAIekFQACUDAAh6gVAAJQMACGNBgEAkwwAIZcGAQCTDAAhmQYAANYOuAYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhnQYBAJIMACG4BgEAkgwAIQ4WAADYDgAgFwAA2Q4AIBkAAP4OACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGNBgEAkwwAIZcGAQCTDAAhmQYAANYOuAYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhnQYBAJIMACG4BgEAkgwAIQ4WAADcDgAgFwAA3Q4AIBkAAP8OACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGNBgEAAAABlwYBAAAAAZkGAAAAuAYCmgYBAAAAAZsGQAAAAAGcBkAAAAABnQYBAAAAAbgGAQAAAAEOFgAA3A4AIBgAAN4OACAZAAD_DgAg4QUBAAAAAekFQAAAAAHqBUAAAAABjQYBAAAAAZcGAQAAAAGZBgAAALgGApoGAQAAAAGbBkAAAAABnAZAAAAAAZ0GAQAAAAGeBgEAAAABAgAAAE0AIGIAAJsXACADAAAATQAgYgAAmxcAIGMAAJoXACABWwAAwxgAMAIAAABNACBbAACaFwAgAgAAANQOACBbAACZFwAgC-EFAQCSDAAh6QVAAJQMACHqBUAAlAwAIY0GAQCTDAAhlwYBAJMMACGZBgAA1g64BiKaBgEAkwwAIZsGQACqDAAhnAZAAJQMACGdBgEAkgwAIZ4GAQCTDAAhDhYAANgOACAYAADaDgAgGQAA_g4AIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIY0GAQCTDAAhlwYBAJMMACGZBgAA1g64BiKaBgEAkwwAIZsGQACqDAAhnAZAAJQMACGdBgEAkgwAIZ4GAQCTDAAhDhYAANwOACAYAADeDgAgGQAA_w4AIOEFAQAAAAHpBUAAAAAB6gVAAAAAAY0GAQAAAAGXBgEAAAABmQYAAAC4BgKaBgEAAAABmwZAAAAAAZwGQAAAAAGdBgEAAAABngYBAAAAAQzhBQEAAAAB6QVAAAAAAeoFQAAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUAAPYNACD8BQAA9w0AIP0FgAAAAAH-BYAAAAAB_wUgAAAAAQIAAADTCQAgYgAAnBcAIAMAAACjAgAgYgAAnBcAIGMAAKAXACAOAAAAowIAIFsAAKAXACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACH3BQEAkgwAIfgFAQCSDAAh-QUBAJIMACH6BQEAkwwAIfsFAADyDQAg_AUAAPMNACD9BYAAAAAB_gWAAAAAAf8FIAD0DQAhDOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIfcFAQCSDAAh-AUBAJIMACH5BQEAkgwAIfoFAQCTDAAh-wUAAPINACD8BQAA8w0AIP0FgAAAAAH-BYAAAAAB_wUgAPQNACESBwAA4QwAIAkAAOIMACAQAACNDgAgFgAA3gwAIDMAAN8MACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAfYFAQAAAAGLBgEAAAABlwYBAAAAAZkGAAAAmQYCmgYBAAAAAZsGQAAAAAGcBkAAAAABnQYBAAAAAQIAAACjAQAgYgAAqRcAIAMAAACjAQAgYgAAqRcAIGMAAKgXACABWwAAwhgAMAIAAACjAQAgWwAAqBcAIAIAAADUDAAgWwAApxcAIA3hBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAh9gUBAJIMACGLBgEAkwwAIZcGAQCTDAAhmQYAANYMmQYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhnQYBAJIMACESBwAA2wwAIAkAANwMACAQAACMDgAgFgAA2AwAIDMAANkMACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAh9gUBAJIMACGLBgEAkwwAIZcGAQCTDAAhmQYAANYMmQYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhnQYBAJIMACESBwAA4QwAIAkAAOIMACAQAACNDgAgFgAA3gwAIDMAAN8MACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAfYFAQAAAAGLBgEAAAABlwYBAAAAAZkGAAAAmQYCmgYBAAAAAZsGQAAAAAGcBkAAAAABnQYBAAAAARIHAADhDAAgCQAA4gwAIBAAAI0OACAWAADeDAAgGAAA4AwAIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAZcGAQAAAAGZBgAAAJkGApoGAQAAAAGbBkAAAAABnAZAAAAAAZ0GAQAAAAGeBgEAAAABAgAAAKMBACBiAACyFwAgAwAAAKMBACBiAACyFwAgYwAAsRcAIAFbAADBGAAwAgAAAKMBACBbAACxFwAgAgAAANQMACBbAACwFwAgDeEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGLBgEAkwwAIZcGAQCTDAAhmQYAANYMmQYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhnQYBAJIMACGeBgEAkwwAIRIHAADbDAAgCQAA3AwAIBAAAIwOACAWAADYDAAgGAAA2gwAIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGLBgEAkwwAIZcGAQCTDAAhmQYAANYMmQYimgYBAJMMACGbBkAAqgwAIZwGQACUDAAhnQYBAJIMACGeBgEAkwwAIRIHAADhDAAgCQAA4gwAIBAAAI0OACAWAADeDAAgGAAA4AwAIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAZcGAQAAAAGZBgAAAJkGApoGAQAAAAGbBkAAAAABnAZAAAAAAZ0GAQAAAAGeBgEAAAABHQcAAOgRACA8AADmEQAgPwAA6REAIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAJEHApsGQAAAAAHABgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAABgAcAAACABwOBBwEAAAABggcAAACvBgODBxAAAAABhAcBAAAAAYUHAgAAAAGHBwAAAIcHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HgAAAAAGPB0AAAAABkQcBAAAAAQIAAADVAQAgYgAAuxcAIAMAAADVAQAgYgAAuxcAIGMAALoXACABWwAAwBgAMAIAAADVAQAgWwAAuhcAIAIAAACCEwAgWwAAuRcAIBrhBQEAkgwAIeYFAQCTDAAh6QVAAJQMACHqBUAAlAwAIZkGAADVEZEHIpsGQACqDAAhwAYBAJMMACH8BgEAkgwAIf0GAQCSDAAh_gYBAJMMACGABwAA0RGAByOBBwEAkwwAIYIHAADSEa8GI4MHEADTEQAhhAcBAJIMACGFBwIAyA8AIYcHAADUEYcHIogHAQCTDAAhiQcBAJMMACGKBwEAkwwAIYsHAQCTDAAhjAcBAJMMACGNBwEAkwwAIY4HgAAAAAGPB0AAqgwAIZEHAQCTDAAhHQcAANgRACA8AADWEQAgPwAA2REAIOEFAQCSDAAh5gUBAJMMACHpBUAAlAwAIeoFQACUDAAhmQYAANURkQcimwZAAKoMACHABgEAkwwAIfwGAQCSDAAh_QYBAJIMACH-BgEAkwwAIYAHAADREYAHI4EHAQCTDAAhggcAANIRrwYjgwcQANMRACGEBwEAkgwAIYUHAgDIDwAhhwcAANQRhwciiAcBAJMMACGJBwEAkwwAIYoHAQCTDAAhiwcBAJMMACGMBwEAkwwAIY0HAQCTDAAhjgeAAAAAAY8HQACqDAAhkQcBAJMMACEdBwAA6BEAIDwAAOYRACA_AADpEQAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAkQcCmwZAAAAAAcAGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAGABwAAAIAHA4EHAQAAAAGCBwAAAK8GA4MHEAAAAAGEBwEAAAABhQcCAAAAAYcHAAAAhwcCiAcBAAAAAYkHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgeAAAAAAY8HQAAAAAGRBwEAAAABHQcAAOgRACA9AADnEQAgPwAA6REAIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAJEHApsGQAAAAAHABgEAAAAB_QYBAAAAAf4GAQAAAAGABwAAAIAHA4EHAQAAAAGCBwAAAK8GA4MHEAAAAAGEBwEAAAABhQcCAAAAAYcHAAAAhwcCiAcBAAAAAYkHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgeAAAAAAY8HQAAAAAGRBwEAAAABkgcBAAAAAQIAAADVAQAgYgAAxBcAIAMAAADVAQAgYgAAxBcAIGMAAMMXACABWwAAvxgAMAIAAADVAQAgWwAAwxcAIAIAAACCEwAgWwAAwhcAIBrhBQEAkgwAIeYFAQCTDAAh6QVAAJQMACHqBUAAlAwAIZkGAADVEZEHIpsGQACqDAAhwAYBAJMMACH9BgEAkgwAIf4GAQCTDAAhgAcAANERgAcjgQcBAJMMACGCBwAA0hGvBiODBxAA0xEAIYQHAQCSDAAhhQcCAMgPACGHBwAA1BGHByKIBwEAkwwAIYkHAQCTDAAhigcBAJMMACGLBwEAkwwAIYwHAQCTDAAhjQcBAJMMACGOB4AAAAABjwdAAKoMACGRBwEAkwwAIZIHAQCTDAAhHQcAANgRACA9AADXEQAgPwAA2REAIOEFAQCSDAAh5gUBAJMMACHpBUAAlAwAIeoFQACUDAAhmQYAANURkQcimwZAAKoMACHABgEAkwwAIf0GAQCSDAAh_gYBAJMMACGABwAA0RGAByOBBwEAkwwAIYIHAADSEa8GI4MHEADTEQAhhAcBAJIMACGFBwIAyA8AIYcHAADUEYcHIogHAQCTDAAhiQcBAJMMACGKBwEAkwwAIYsHAQCTDAAhjAcBAJMMACGNBwEAkwwAIY4HgAAAAAGPB0AAqgwAIZEHAQCTDAAhkgcBAJMMACEdBwAA6BEAID0AAOcRACA_AADpEQAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAkQcCmwZAAAAAAcAGAQAAAAH9BgEAAAAB_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_BYAIMgHAAD9FgAwBGIAAPAWADDCBwAA8RYAMMQHAADzFgAgyAcAAKIMADAEYgAA5xYAMMIHAADoFgAwxAcAAOoWACDIBwAAogwAMARiAADeFgAwwgcAAN8WADDEBwAA4RYAIMgHAACcEgAwBGIAANUWADDCBwAA1hYAMMQHAADYFgAgyAcAALERADAAAAIzAAD5DQAg-gUAAI4MACABFwAA-Q0AIAAAAAAABWIAALAYACBjAACzGAAgwgcAALEYACDDBwAAshgAIMgHAAAoACADYgAAsBgAIMIHAACxGAAgyAcAACgAIAAAAAQHAACMEQAgQgAA-Q0AIEQAAJsYACBFAACRGAAgABcHAACMEQAgPAAA-Q0AID0AAPkNACA_AACOFgAg5gUAAI4MACCbBgAAjgwAIMAGAACODAAg_gYAAI4MACCABwAAjgwAIIEHAACODAAgggcAAI4MACCDBwAAjgwAIIUHAACODAAgiAcAAI4MACCJBwAAjgwAIIoHAACODAAgiwcAAI4MACCMBwAAjgwAII0HAACODAAgjgcAAI4MACCPBwAAjgwAIJEHAACODAAgkgcAAI4MACANBwAAjBEAIAkAAJ8YACAKAACtGAAgCwAAjxYAIA4AAKYYACAPAACnGAAgEAAAnhgAIBkAAKIYACAbAAChGAAgLAAAqxgAIC0AAKwYACDnBQAAjgwAINIGAACODAAgCgMAAPkNACAHAACMEQAgCQAAnxgAIA0AAJcQACARAACIFgAgIgAAkRYAICQAAIoWACBJAACGEQAgSgAAjBYAIOUFAACODAAgFQgAAK4YACAMAACVEAAgDQAAlxAAIBEAAIgWACAcAACZEAAgJQAAlhAAICcAAJgQACAqAACPFgAgLgAAgRYAIC8AAIIWACAwAACEFgAgMQAAhhYAIDIAAIcWACA0AACGEQAgNQAAihYAIDYAAIsWACA3AACMFgAgOAAAkRYAIMAGAACODAAg0QYAAI4MACD-BgAAjgwAIAUUAACGEQAg5wUAAI4MACDOBgAAjgwAINEGAACODAAg0gYAAI4MACAFDAAAlRAAIA0AAJcQACAcAACZEAAgJQAAlhAAICcAAJgQACAKAwAA-Q0AIAcAAIwRACAJAACfGAAgDQAAlxAAIBMAAIsWACAaAAD1EAAgHAAAmRAAICIAAJEWACDlBQAAjgwAIOcFAACODAAgBAcAAIwRACAJAACfGAAgGwAAoRgAIBwAAJkQACAFFAAA9RAAIOcFAACODAAgzgYAAI4MACDRBgAAjgwAINIGAACODAAgCAcAAIwRACAJAACfGAAgDgAAphgAIBAAAJ4YACAjAACLFgAg5wUAAI4MACCTBgAAjgwAIJYGAACODAAgCwcAAIwRACAJAACfGAAgDQAAlxAAIBEAAIgWACAbAAChGAAgJAAAihYAICYAAKgYACDnBQAAjgwAIMAGAACODAAgwQYAAI4MACDDBgAAjgwAIAgHAACMEQAgCQAAnxgAIAoAAK0YACANAACXEAAgEQAAiBYAIMAGAACODAAgzAYAAI4MACDSBgAAjgwAIAUHAACMEQAgCQAAnxgAICUAAJYQACDnBQAAjgwAIMAGAACODAAgCAcAAIwRACAJAACfGAAgCwAAjxYAIBsAAKEYACDmBQAAjgwAIOcFAACODAAgwAYAAI4MACDCBgAAjgwAIAMHAACMEQAgKgAAjxYAILoGAACODAAgABIHAACMEQAgCQAAnxgAIBAAAJ4YACApAACdGAAg5wUAAI4MACCgBgAAjgwAIKEGAACODAAgogYAAI4MACCjBgAAjgwAIKQGAACODAAgpQYAAI4MACCmBgAAjgwAIKcGAACODAAgqAYAAI4MACCpBgAAjgwAIKoGAACODAAgqwYAAI4MACCsBgAAjgwAIAkHAACMEQAgCQAAnxgAIA0AAJcQACAPAACEFgAgwAYAAI4MACDKBgAAjgwAIMsGAACODAAgzAYAAI4MACDNBgAAjgwAIAUHAACMEQAgOQAArxgAIOYFAACODAAgwAYAAI4MACD-BgAAjgwAIAAWBwAA5Q0AIAkAAOINACAKAADjDQAgCwAA3A0AIA4AAOENACAPAADfDQAgEAAA8g4AIBkAAOANACAbAADkDQAgLQAA3g0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjQYBAAAAAcIGAQAAAAHSBgEAAAABlAdAAAAAAQIAAAAoACBiAACwGAAgAwAAACYAIGIAALAYACBjAAC0GAAgGAAAACYAIAcAALINACAJAACvDQAgCgAAsA0AIAsAAKkNACAOAACuDQAgDwAArA0AIBAAAPAOACAZAACtDQAgGwAAsQ0AIC0AAKsNACBbAAC0GAAg4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhigYBAJIMACGLBgEAkgwAIY0GAQCSDAAhwgYBAJIMACHSBgEAkwwAIZQHQACUDAAhFgcAALINACAJAACvDQAgCgAAsA0AIAsAAKkNACAOAACuDQAgDwAArA0AIBAAAPAOACAZAACtDQAgGwAAsQ0AIC0AAKsNACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhiQYBAJIMACGKBgEAkgwAIYsGAQCSDAAhjQYBAJIMACHCBgEAkgwAIdIGAQCTDAAhlAdAAJQMACEH4QUBAAAAAekFQAAAAAHqBUAAAAABnQdAAAAAAakHAQAAAAGqBwEAAAABqwcBAAAAAQzhBQEAAAAB6QVAAAAAAeoFQAAAAAGgBwEAAAABoQcBAAAAAaIHAQAAAAGjBwEAAAABpAcBAAAAAaUHQAAAAAGmB0AAAAABpwcBAAAAAagHAQAAAAEgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAAC3GAAgAwAAABYAIGIAALcYACBjAAC7GAAgIgAAABYAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAALsYACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAIQXhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAAB7wYAAAC4BwIJ4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAAAAAeUFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABB-EFAQAAAAHlBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAbYGAQAAAAEa4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAkQcCmwZAAAAAAcAGAQAAAAH9BgEAAAAB_gYBAAAAAYAHAAAAgAcDgQcBAAAAAYIHAAAArwYDgwcQAAAAAYQHAQAAAAGFBwIAAAABhwcAAACHBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB4AAAAABjwdAAAAAAZEHAQAAAAGSBwEAAAABGuEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAJEHApsGQAAAAAHABgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAABgAcAAACABwOBBwEAAAABggcAAACvBgODBxAAAAABhAcBAAAAAYUHAgAAAAGHBwAAAIcHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HgAAAAAGPB0AAAAABkQcBAAAAAQ3hBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYsGAQAAAAGXBgEAAAABmQYAAACZBgKaBgEAAAABmwZAAAAAAZwGQAAAAAGdBgEAAAABngYBAAAAAQ3hBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAfYFAQAAAAGLBgEAAAABlwYBAAAAAZkGAAAAmQYCmgYBAAAAAZsGQAAAAAGcBkAAAAABnQYBAAAAAQvhBQEAAAAB6QVAAAAAAeoFQAAAAAGNBgEAAAABlwYBAAAAAZkGAAAAuAYCmgYBAAAAAZsGQAAAAAGcBkAAAAABnQYBAAAAAZ4GAQAAAAEL4QUBAAAAAekFQAAAAAHqBUAAAAABjQYBAAAAAZcGAQAAAAGZBgAAALgGApoGAQAAAAGbBkAAAAABnAZAAAAAAZ0GAQAAAAG4BgEAAAABBeEFAQAAAAHpBUAAAAAB6gVAAAAAAZwHAQAAAAGdB0AAAAABD-EFAQAAAAHpBUAAAAAB6gVAAAAAAYsGAQAAAAGNBgEAAAABmQYAAAD1BgKbBkAAAAABngYBAAAAAfMGAAAA8wYC9QYBAAAAAfYGAQAAAAH4BgEAAAAB-QYBAAAAAfoGAQAAAAH7BkAAAAABD-EFAQAAAAHpBUAAAAAB6gVAAAAAAYsGAQAAAAGNBgEAAAABmQYAAAD1BgKbBkAAAAAB8wYAAADzBgL1BgEAAAAB9gYBAAAAAfcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGAQAAAAH7BkAAAAABB-EFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGSBgEAAAABkwYBAAAAAfEGAAAA7wYCA-EFAQAAAAHsBgEAAAAB7QZAAAAAASAFAAD7FwAgBgAA_BcAIBAAAP0XACAZAAD-FwAgNAAAgRgAIEAAAP8XACBLAACAGAAgTAAAghgAIE0AAIMYACBOAACEGAAgTwAAhRgAIFAAAIYYACBRAACHGAAgUgAAiBgAIFMAAIkYACBUAACKGAAgVQAAixgAIOEFAQAAAAHlBQEAAAAB6QVAAAAAAeoFQAAAAAG6BgEAAAAB7wYBAAAAAawHAQAAAAGtByAAAAABrgcBAAAAAa8HAQAAAAGwBwEAAAABsQcBAAAAAbIHAQAAAAGzBwEAAAABtAcBAAAAAQIAAADsAgAgYgAAyhgAIAMAAABRACBiAADKGAAgYwAAzhgAICIAAABRACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFMAANIWACBUAADTFgAgVQAA1BYAIFsAAM4YACDhBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACEgBQAAxBYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUQAA0BYAIFIAANEWACBTAADSFgAgVAAA0xYAIFUAANQWACDhBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACEgBAAA-hcAIAYAAPwXACAQAAD9FwAgGQAA_hcAIDQAAIEYACBAAAD_FwAgSwAAgBgAIEwAAIIYACBNAACDGAAgTgAAhBgAIE8AAIUYACBQAACGGAAgUQAAhxgAIFIAAIgYACBTAACJGAAgVAAAihgAIFUAAIsYACDhBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAECAAAA7AIAIGIAAM8YACADAAAAUQAgYgAAzxgAIGMAANMYACAiAAAAUQAgBAAAwxYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUQAA0BYAIFIAANEWACBTAADSFgAgVAAA0xYAIFUAANQWACBbAADTGAAg4QUBAJIMACHlBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIe8GAQCSDAAhrAcBAJIMACGtByAA9A0AIa4HAQCTDAAhrwcBAJMMACGwBwEAkwwAIbEHAQCTDAAhsgcBAJMMACGzBwEAkwwAIbQHAQCSDAAhIAQAAMMWACAGAADFFgAgEAAAxhYAIBkAAMcWACA0AADKFgAgQAAAyBYAIEsAAMkWACBMAADLFgAgTQAAzBYAIE4AAM0WACBPAADOFgAgUAAAzxYAIFEAANAWACBSAADRFgAgUwAA0hYAIFQAANMWACBVAADUFgAg4QUBAJIMACHlBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIe8GAQCSDAAhrAcBAJIMACGtByAA9A0AIa4HAQCTDAAhrwcBAJMMACGwBwEAkwwAIbEHAQCTDAAhsgcBAJMMACGzBwEAkwwAIbQHAQCSDAAhIAQAAPoXACAFAAD7FwAgBgAA_BcAIBAAAP0XACAZAAD-FwAgNAAAgRgAIEAAAP8XACBLAACAGAAgTAAAghgAIE0AAIMYACBOAACEGAAgTwAAhRgAIFAAAIYYACBSAACIGAAgUwAAiRgAIFQAAIoYACBVAACLGAAg4QUBAAAAAeUFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHvBgEAAAABrAcBAAAAAa0HIAAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgcBAAAAAbMHAQAAAAG0BwEAAAABAgAAAOwCACBiAADUGAAgAwAAAFEAIGIAANQYACBjAADYGAAgIgAAAFEAIAQAAMMWACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBSAADRFgAgUwAA0hYAIFQAANMWACBVAADUFgAgWwAA2BgAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAISAEAADDFgAgBQAAxBYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUgAA0RYAIFMAANIWACBUAADTFgAgVQAA1BYAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAISAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAANkYACADAAAAFgAgYgAA2RgAIGMAAN0YACAiAAAAFgAgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAgWwAA3RgAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhCAcAAJYWACDhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABwAYBAAAAAf4GAQAAAAGTBwEAAAABAgAAABQAIGIAAN4YACADAAAAEgAgYgAA3hgAIGMAAOIYACAKAAAAEgAgBwAAlRYAIFsAAOIYACDhBQEAkgwAIeYFAQCTDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQgHAACVFgAg4QUBAJIMACHmBQEAkwwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIf4GAQCTDAAhkwcBAJIMACEgBgAA7RUAIAwAAPsVACANAADwFQAgEQAA8RUAIBwAAPgVACAlAADrFQAgJwAA9xUAICoAAPwVACAuAADoFQAgLwAA6RUAIDAAAOwVACAxAADuFQAgMgAA7xUAIDQAAPMVACA1AAD0FQAgNgAA9RUAIDcAAPYVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAADjGAAgAwAAABYAIGIAAOMYACBjAADnGAAgIgAAABYAIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAAOcYACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAIQrhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABkgYBAAAAAcAGAQAAAAHKBgEAAAABywZAAAAAAcwGCAAAAAHNBggAAAABIAYAAO0VACAMAAD7FQAgDQAA8BUAIBEAAPEVACAcAAD4FQAgJQAA6xUAICcAAPcVACAqAAD8FQAgLgAA6BUAIDAAAOwVACAxAADuFQAgMgAA7xUAIDQAAPMVACA1AAD0FQAgNgAA9RUAIDcAAPYVACA6AADnFQAgOwAA6hUAID8AAPoVACBAAADyFQAgQQAA-RUAIEYAAP0VACBHAAD-FQAgSAAA_xUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAZUGAAAAgAcDugYBAAAAAcAGAQAAAAH-BgEAAAABgQcBAAAAAQIAAADvBAAgYgAA6RgAIAMAAAAWACBiAADpGAAgYwAA7RgAICIAAAAWACAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACBbAADtGAAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEG4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHABgEAAAABCeEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAABzAYCAAAAAdIGAQAAAAGVBwEAAAABlgcBAAAAAQnhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAcAGAQAAAAHBBgIAAAABwgYBAAAAAcMGAQAAAAEJ4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAAAAAeUFAQAAAAHmBQEAAAAB6AUBAAAAAekFQAAAAAHqBUAAAAABB-EFAQAAAAHlBQEAAAAB5gUBAAAAAegFAQAAAAHpBUAAAAAB6gVAAAAAAbYGAQAAAAEL4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAY0GAQAAAAHCBgEAAAAB0gYBAAAAAZQHQAAAAAEH4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAQ3hBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAAB9gUBAAAAAYsGAQAAAAGXBgEAAAABmQYAAACZBgKaBgEAAAABmwZAAAAAAZwGQAAAAAGdBgEAAAABngYBAAAAAQrhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYsGAQAAAAGSBgEAAAABkwYBAAAAAZUGAAAAlQYClgZAAAAAAQrhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABjAYBAAAAAY0GAQAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBkAAAAABE-EFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGLBgEAAAABnwYBAAAAAaAGCAAAAAGhBggAAAABogYIAAAAAaMGCAAAAAGkBggAAAABpQYIAAAAAaYGCAAAAAGnBggAAAABqAYIAAAAAakGCAAAAAGqBggAAAABqwYIAAAAAawGCAAAAAEJ4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAbIGAQAAAAHCBgEAAAAB2gYgAAAAAeoGEAAAAAHrBhAAAAABFuEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGNBgEAAAABmQYAAADgBgKxBhAAAAABsgYBAAAAAbMGAgAAAAHCBgEAAAAB3AYBAAAAAd4GAAAA3gYC4AYBAAAAAeEGAQAAAAHiBgEAAAAB4wYBAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGgAAAAAHoBkAAAAAB6QZAAAAAAQrhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABmQYAAADHBgK6BgEAAAABwAYBAAAAAcIGAQAAAAHEBgEAAAABxQYBAAAAAQrhBQEAAAAB5gUBAAAAAekFQAAAAAHqBUAAAAABnwYBAAAAAboGAQAAAAHABgEAAAABxwYBAAAAAcgGAQAAAAHJBgEAAAABD-EFAQAAAAHpBUAAAAAB6gVAAAAAAYsGAQAAAAGNBgEAAAABmQYAAAD1BgKbBkAAAAABngYBAAAAAfMGAAAA8wYC9QYBAAAAAfYGAQAAAAH3BgEAAAAB-QYBAAAAAfoGAQAAAAH7BkAAAAABBuEFAQAAAAHpBUAAAAAB6gVAAAAAAcAGAQAAAAH-BgEAAAABkwcBAAAAAQbhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB_gYBAAAAAZMHAQAAAAEK4QUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAZIGAQAAAAHABgEAAAABygYBAAAAAcsGQAAAAAHMBggAAAABzQYIAAAAARgIAACbFgAgDAAA4hUAIA0AANoVACARAADbFQAgHAAA4RUAICUAANcVACAnAADgFQAgKgAA4xUAIC4AANQVACAwAADWFQAgMQAA2BUAIDIAANkVACA0AADcFQAgNQAA3RUAIDYAAN4VACA3AADfFQAgOAAA5BUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAcAGAQAAAAHRBgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAAgRkAIAnhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHABgEAAAABwQYCAAAAAcIGAQAAAAEDAAAAGAAgYgAAgRkAIGMAAIYZACAaAAAAGAAgCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAICoAALYUACAuAACnFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACBbAACGGQAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEYCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAICoAALYUACAuAACnFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQbhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAcAGAQAAAAEK4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGfBgEAAAABugYBAAAAAcAGAQAAAAHHBgEAAAAByAYBAAAAAQjhBQEAAAAB6QVAAAAAAeoFQAAAAAG6BgEAAAABlwcBAAAAAZgHAQAAAAGZBwIAAAABmwcAAACbBwIJ4QUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHABgEAAAABwQYCAAAAAcIGAQAAAAHDBgEAAAABDgcAAOMQACAJAADkEAAgDQAA4hAAIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABkgYBAAAAAcAGAQAAAAHKBgEAAAABywZAAAAAAcwGCAAAAAHNBggAAAABAgAAAB8AIGIAAIsZACADAAAAHQAgYgAAixkAIGMAAI8ZACAQAAAAHQAgBwAAsBAAIAkAALEQACANAACvEAAgWwAAjxkAIOEFAQCSDAAh5gUBAJIMACHnBQEAkgwAIekFQACUDAAh6gVAAJQMACGSBgEAkgwAIcAGAQCTDAAhygYBAJMMACHLBkAAqgwAIcwGCADDDAAhzQYIAMMMACEOBwAAsBAAIAkAALEQACANAACvEAAg4QUBAJIMACHmBQEAkgwAIecFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZIGAQCSDAAhwAYBAJMMACHKBgEAkwwAIcsGQACqDAAhzAYIAMMMACHNBggAwwwAIQnhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABwAYBAAAAAcwGAgAAAAHSBgEAAAABlQcBAAAAAZYHAQAAAAEgBAAA-hcAIAUAAPsXACAQAAD9FwAgGQAA_hcAIDQAAIEYACBAAAD_FwAgSwAAgBgAIEwAAIIYACBNAACDGAAgTgAAhBgAIE8AAIUYACBQAACGGAAgUQAAhxgAIFIAAIgYACBTAACJGAAgVAAAihgAIFUAAIsYACDhBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAECAAAA7AIAIGIAAJEZACADAAAAUQAgYgAAkRkAIGMAAJUZACAiAAAAUQAgBAAAwxYAIAUAAMQWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUQAA0BYAIFIAANEWACBTAADSFgAgVAAA0xYAIFUAANQWACBbAACVGQAg4QUBAJIMACHlBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIe8GAQCSDAAhrAcBAJIMACGtByAA9A0AIa4HAQCTDAAhrwcBAJMMACGwBwEAkwwAIbEHAQCTDAAhsgcBAJMMACGzBwEAkwwAIbQHAQCSDAAhIAQAAMMWACAFAADEFgAgEAAAxhYAIBkAAMcWACA0AADKFgAgQAAAyBYAIEsAAMkWACBMAADLFgAgTQAAzBYAIE4AAM0WACBPAADOFgAgUAAAzxYAIFEAANAWACBSAADRFgAgUwAA0hYAIFQAANMWACBVAADUFgAg4QUBAJIMACHlBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIe8GAQCSDAAhrAcBAJIMACGtByAA9A0AIa4HAQCTDAAhrwcBAJMMACGwBwEAkwwAIbEHAQCTDAAhsgcBAJMMACGzBwEAkwwAIbQHAQCSDAAhBeEFAQAAAAHoBQEAAAAB6QVAAAAAAeoFQAAAAAHvBgAAALgHAgnhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBQEAAAAB5QUBAAAAAecFAQAAAAHoBQEAAAAB6QVAAAAAAeoFQAAAAAEH4QUBAAAAAeUFAQAAAAHnBQEAAAAB6AUBAAAAAekFQAAAAAHqBUAAAAABtgYBAAAAAQvhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjQYBAAAAAcIGAQAAAAHSBgEAAAABlAdAAAAAAQfhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABGuEFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAkQcCmwZAAAAAAcAGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAGABwAAAIAHA4EHAQAAAAGCBwAAAK8GA4MHEAAAAAGEBwEAAAABhQcCAAAAAYcHAAAAhwcCiAcBAAAAAYkHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgeAAAAAAY8HQAAAAAGRBwEAAAABkgcBAAAAAQ3hBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAAB9gUBAAAAAYsGAQAAAAGXBgEAAAABmQYAAACZBgKaBgEAAAABmwZAAAAAAZwGQAAAAAGdBgEAAAABngYBAAAAAQrhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYsGAQAAAAGSBgEAAAABkwYBAAAAAZUGAAAAlQYClgZAAAAAAQrhBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABjAYBAAAAAY0GAQAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBkAAAAABE-EFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGLBgEAAAABnwYBAAAAAaAGCAAAAAGhBggAAAABogYIAAAAAaMGCAAAAAGkBggAAAABpQYIAAAAAaYGCAAAAAGnBggAAAABqAYIAAAAAakGCAAAAAGqBggAAAABqwYIAAAAAawGCAAAAAEJ4QUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAbIGAQAAAAHCBgEAAAAB2gYgAAAAAeoGEAAAAAHrBhAAAAABFuEFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGNBgEAAAABmQYAAADgBgKxBhAAAAABsgYBAAAAAbMGAgAAAAHCBgEAAAAB3AYBAAAAAd4GAAAA3gYC4AYBAAAAAeEGAQAAAAHiBgEAAAAB4wYBAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGgAAAAAHoBkAAAAAB6QZAAAAAAQvhBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAALEGAq0GAQAAAAGvBgAAAK8GArEGEAAAAAGyBgEAAAABswYCAAAAAbQGQAAAAAG1BkAAAAABCuEFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAMcGAroGAQAAAAHABgEAAAABwgYBAAAAAcQGAQAAAAHFBgEAAAABCuEFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGfBgEAAAABugYBAAAAAcAGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAEH4QUBAAAAAekFQAAAAAHqBUAAAAABkgYBAAAAAZMGAQAAAAHwBgEAAAAB8QYAAADvBgIP4QUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAY0GAQAAAAGZBgAAAPUGApsGQAAAAAGeBgEAAAAB8wYAAADzBgL2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYBAAAAAfsGQAAAAAEP4QUBAAAAAekFQAAAAAHqBUAAAAABiwYBAAAAAY0GAQAAAAGZBgAAAPUGApsGQAAAAAGeBgEAAAAB8wYAAADzBgL1BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gYBAAAAAfsGQAAAAAEgBgAA7RUAIAwAAPsVACANAADwFQAgEQAA8RUAIBwAAPgVACAlAADrFQAgJwAA9xUAICoAAPwVACAuAADoFQAgLwAA6RUAIDAAAOwVACAxAADuFQAgMgAA7xUAIDQAAPMVACA1AAD0FQAgNgAA9RUAIDcAAPYVACA6AADnFQAgOwAA6hUAID8AAPoVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAACoGQAgIAQAAPoXACAFAAD7FwAgBgAA_BcAIBAAAP0XACAZAAD-FwAgNAAAgRgAIEAAAP8XACBMAACCGAAgTQAAgxgAIE4AAIQYACBPAACFGAAgUAAAhhgAIFEAAIcYACBSAACIGAAgUwAAiRgAIFQAAIoYACBVAACLGAAg4QUBAAAAAeUFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHvBgEAAAABrAcBAAAAAa0HIAAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgcBAAAAAbMHAQAAAAG0BwEAAAABAgAAAOwCACBiAACqGQAgIAQAAPoXACAFAAD7FwAgBgAA_BcAIBAAAP0XACAZAAD-FwAgNAAAgRgAIEsAAIAYACBMAACCGAAgTQAAgxgAIE4AAIQYACBPAACFGAAgUAAAhhgAIFEAAIcYACBSAACIGAAgUwAAiRgAIFQAAIoYACBVAACLGAAg4QUBAAAAAeUFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHvBgEAAAABrAcBAAAAAa0HIAAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgcBAAAAAbMHAQAAAAG0BwEAAAABAgAAAOwCACBiAACsGQAgC-EFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAALEGAq8GAAAArwYCsQYQAAAAAbIGAQAAAAGzBgIAAAABtAZAAAAAAbUGQAAAAAEDAAAAFgAgYgAAqBkAIGMAALEZACAiAAAAFgAgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAgWwAAsRkAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhAwAAAFEAIGIAAKoZACBjAAC0GQAgIgAAAFEAIAQAAMMWACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBMAADLFgAgTQAAzBYAIE4AAM0WACBPAADOFgAgUAAAzxYAIFEAANAWACBSAADRFgAgUwAA0hYAIFQAANMWACBVAADUFgAgWwAAtBkAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAISAEAADDFgAgBQAAxBYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFMAANIWACBUAADTFgAgVQAA1BYAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAIQMAAABRACBiAACsGQAgYwAAtxkAICIAAABRACAEAADDFgAgBQAAxBYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFMAANIWACBUAADTFgAgVQAA1BYAIFsAALcZACDhBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACEgBAAAwxYAIAUAAMQWACAGAADFFgAgEAAAxhYAIBkAAMcWACA0AADKFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUQAA0BYAIFIAANEWACBTAADSFgAgVAAA0xYAIFUAANQWACDhBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACEgBAAA-hcAIAUAAPsXACAGAAD8FwAgEAAA_RcAIBkAAP4XACA0AACBGAAgQAAA_xcAIEsAAIAYACBMAACCGAAgTQAAgxgAIE4AAIQYACBPAACFGAAgUAAAhhgAIFEAAIcYACBSAACIGAAgUwAAiRgAIFUAAIsYACDhBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAECAAAA7AIAIGIAALgZACAgBgAA7RUAIAwAAPsVACANAADwFQAgEQAA8RUAIBwAAPgVACAlAADrFQAgJwAA9xUAICoAAPwVACAuAADoFQAgLwAA6RUAIDAAAOwVACAxAADuFQAgMgAA7xUAIDQAAPMVACA1AAD0FQAgNgAA9RUAIDcAAPYVACA6AADnFQAgOwAA6hUAID8AAPoVACBAAADyFQAgQQAA-RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAAC6GQAgA-EFAQAAAAHpBUAAAAAB7wYAAADvBgID4QUBAAAAAegFAQAAAAHtBkAAAAABAwAAAFEAIGIAALgZACBjAADAGQAgIgAAAFEAIAQAAMMWACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFMAANIWACBVAADUFgAgWwAAwBkAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAISAEAADDFgAgBQAAxBYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUQAA0BYAIFIAANEWACBTAADSFgAgVQAA1BYAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAIQMAAAAWACBiAAC6GQAgYwAAwxkAICIAAAAWACAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRwAAhBIAIEgAAIUSACBbAADDGQAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEcAAIQSACBIAACFEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACELBwAAxREAIEIAAMYRACBFAADIEQAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAZIGAQAAAAGTBgEAAAAB8AYBAAAAAfEGAAAA7wYCAgAAAOwBACBiAADEGQAgAwAAAOoBACBiAADEGQAgYwAAyBkAIA0AAADqAQAgBwAAqREAIEIAAKoRACBFAACsEQAgWwAAyBkAIOEFAQCSDAAh5gUBAJIMACHpBUAAlAwAIeoFQACUDAAhkgYBAJIMACGTBgEAkgwAIfAGAQCSDAAh8QYAAKMR7wYiCwcAAKkRACBCAACqEQAgRQAArBEAIOEFAQCSDAAh5gUBAJIMACHpBUAAlAwAIeoFQACUDAAhkgYBAJIMACGTBgEAkgwAIfAGAQCSDAAh8QYAAKMR7wYiIAQAAPoXACAFAAD7FwAgBgAA_BcAIBAAAP0XACAZAAD-FwAgNAAAgRgAIEAAAP8XACBLAACAGAAgTAAAghgAIE0AAIMYACBOAACEGAAgTwAAhRgAIFAAAIYYACBRAACHGAAgUgAAiBgAIFMAAIkYACBUAACKGAAg4QUBAAAAAeUFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHvBgEAAAABrAcBAAAAAa0HIAAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgcBAAAAAbMHAQAAAAG0BwEAAAABAgAAAOwCACBiAADJGQAgCwcAAMURACBCAADGEQAgRAAAxxEAIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAGSBgEAAAABkwYBAAAAAfAGAQAAAAHxBgAAAO8GAgIAAADsAQAgYgAAyxkAIAMAAABRACBiAADJGQAgYwAAzxkAICIAAABRACAEAADDFgAgBQAAxBYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUQAA0BYAIFIAANEWACBTAADSFgAgVAAA0xYAIFsAAM8ZACDhBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACEgBAAAwxYAIAUAAMQWACAGAADFFgAgEAAAxhYAIBkAAMcWACA0AADKFgAgQAAAyBYAIEsAAMkWACBMAADLFgAgTQAAzBYAIE4AAM0WACBPAADOFgAgUAAAzxYAIFEAANAWACBSAADRFgAgUwAA0hYAIFQAANMWACDhBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACEDAAAA6gEAIGIAAMsZACBjAADSGQAgDQAAAOoBACAHAACpEQAgQgAAqhEAIEQAAKsRACBbAADSGQAg4QUBAJIMACHmBQEAkgwAIekFQACUDAAh6gVAAJQMACGSBgEAkgwAIZMGAQCSDAAh8AYBAJIMACHxBgAAoxHvBiILBwAAqREAIEIAAKoRACBEAACrEQAg4QUBAJIMACHmBQEAkgwAIekFQACUDAAh6gVAAJQMACGSBgEAkgwAIZMGAQCSDAAh8AYBAJIMACHxBgAAoxHvBiIJDAAAkBAAIA0AAJIQACAcAACUEAAgJQAAkRAAIOEFAQAAAAHmBQEAAAABugYBAAAAAbsGQAAAAAG8BkAAAAABAgAAAN0HACBiAADTGQAgAwAAAC8AIGIAANMZACBjAADXGQAgCwAAAC8AIAwAAIoPACANAACMDwAgHAAAjg8AICUAAIsPACBbAADXGQAg4QUBAJIMACHmBQEAkgwAIboGAQCSDAAhuwZAAJQMACG8BkAAlAwAIQkMAACKDwAgDQAAjA8AIBwAAI4PACAlAACLDwAg4QUBAJIMACHmBQEAkgwAIboGAQCSDAAhuwZAAJQMACG8BkAAlAwAISAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAANgZACADAAAAFgAgYgAA2BkAIGMAANwZACAiAAAAFgAgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgRgAAgxIAIEcAAIQSACBIAACFEgAgWwAA3BkAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEYAAIMSACBHAACEEgAgSAAAhRIAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhDeEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAAB9gUBAAAAAYsGAQAAAAGXBgEAAAABmQYAAACZBgKaBgEAAAABmwZAAAAAAZwGQAAAAAGeBgEAAAABC-EFAQAAAAHpBUAAAAAB6gVAAAAAAY0GAQAAAAGXBgEAAAABmQYAAAC4BgKaBgEAAAABmwZAAAAAAZwGQAAAAAGeBgEAAAABuAYBAAAAARgIAACbFgAgDAAA4hUAIA0AANoVACARAADbFQAgHAAA4RUAICUAANcVACAnAADgFQAgKgAA4xUAIC8AANUVACAwAADWFQAgMQAA2BUAIDIAANkVACA0AADcFQAgNQAA3RUAIDYAAN4VACA3AADfFQAgOAAA5BUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAcAGAQAAAAHRBgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAA3xkAICAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC8AAOkVACAwAADsFQAgMQAA7hUAIDIAAO8VACA0AADzFQAgNQAA9BUAIDYAAPUVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAAOEZACAYCAAAmxYAIAwAAOIVACANAADaFQAgEQAA2xUAIBwAAOEVACAlAADXFQAgJwAA4BUAICoAAOMVACAuAADUFQAgLwAA1RUAIDEAANgVACAyAADZFQAgNAAA3BUAIDUAAN0VACA2AADeFQAgNwAA3xUAIDgAAOQVACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB0QYBAAAAAf4GAQAAAAGTBwEAAAABAgAAABoAIGIAAOMZACAgBgAA7RUAIAwAAPsVACANAADwFQAgEQAA8RUAIBwAAPgVACAlAADrFQAgJwAA9xUAICoAAPwVACAuAADoFQAgLwAA6RUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAADlGQAgC-EFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYsGAQAAAAGNBgEAAAABwgYBAAAAAdIGAQAAAAGUB0AAAAABB-EFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYsGAQAAAAEDAAAAGAAgYgAA4xkAIGMAAOsZACAaAAAAGAAgCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAICoAALYUACAuAACnFAAgLwAAqBQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACBbAADrGQAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEYCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAICoAALYUACAuAACnFAAgLwAAqBQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQMAAAAWACBiAADlGQAgYwAA7hkAICIAAAAWACAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACBbAADuGQAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEJ4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAABzAYCAAAAAZUHAQAAAAGWBwEAAAABC-EFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjQYBAAAAAcIGAQAAAAGUB0AAAAABAwAAABgAIGIAAN8ZACBjAADzGQAgGgAAABgAIAgAAJoWACAMAAC1FAAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLwAAqBQAIDAAAKkUACAxAACrFAAgMgAArBQAIDQAAK8UACA1AACwFAAgNgAAsRQAIDcAALIUACA4AAC3FAAgWwAA8xkAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhGAgAAJoWACAMAAC1FAAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLwAAqBQAIDAAAKkUACAxAACrFAAgMgAArBQAIDQAAK8UACA1AACwFAAgNgAAsRQAIDcAALIUACA4AAC3FAAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEDAAAAFgAgYgAA4RkAIGMAAPYZACAiAAAAFgAgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAgWwAA9hkAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhCQ0AAJIQACAcAACUEAAgJQAAkRAAICcAAJMQACDhBQEAAAAB5gUBAAAAAboGAQAAAAG7BkAAAAABvAZAAAAAAQIAAADdBwAgYgAA9xkAIAMAAAAvACBiAAD3GQAgYwAA-xkAIAsAAAAvACANAACMDwAgHAAAjg8AICUAAIsPACAnAACNDwAgWwAA-xkAIOEFAQCSDAAh5gUBAJIMACG6BgEAkgwAIbsGQACUDAAhvAZAAJQMACEJDQAAjA8AIBwAAI4PACAlAACLDwAgJwAAjQ8AIOEFAQCSDAAh5gUBAJIMACG6BgEAkgwAIbsGQACUDAAhvAZAAJQMACEJDAAAkBAAIA0AAJIQACAcAACUEAAgJwAAkxAAIOEFAQAAAAHmBQEAAAABugYBAAAAAbsGQAAAAAG8BkAAAAABAgAAAN0HACBiAAD8GQAgAwAAAC8AIGIAAPwZACBjAACAGgAgCwAAAC8AIAwAAIoPACANAACMDwAgHAAAjg8AICcAAI0PACBbAACAGgAg4QUBAJIMACHmBQEAkgwAIboGAQCSDAAhuwZAAJQMACG8BkAAlAwAIQkMAACKDwAgDQAAjA8AIBwAAI4PACAnAACNDwAg4QUBAJIMACHmBQEAkgwAIboGAQCSDAAhuwZAAJQMACG8BkAAlAwAIRgIAACbFgAgDQAA2hUAIBEAANsVACAcAADhFQAgJQAA1xUAICcAAOAVACAqAADjFQAgLgAA1BUAIC8AANUVACAwAADWFQAgMQAA2BUAIDIAANkVACA0AADcFQAgNQAA3RUAIDYAAN4VACA3AADfFQAgOAAA5BUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAcAGAQAAAAHRBgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAAgRoAICAGAADtFQAgDQAA8BUAIBEAAPEVACAcAAD4FQAgJQAA6xUAICcAAPcVACAqAAD8FQAgLgAA6BUAIC8AAOkVACAwAADsFQAgMQAA7hUAIDIAAO8VACA0AADzFQAgNQAA9BUAIDYAAPUVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAAIMaACAWBwAA5Q0AIAkAAOINACAKAADjDQAgDgAA4Q0AIA8AAN8NACAQAADyDgAgGQAA4A0AIBsAAOQNACAsAADdDQAgLQAA3g0AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjQYBAAAAAcIGAQAAAAHSBgEAAAABlAdAAAAAAQIAAAAoACBiAACFGgAgAwAAACYAIGIAAIUaACBjAACJGgAgGAAAACYAIAcAALINACAJAACvDQAgCgAAsA0AIA4AAK4NACAPAACsDQAgEAAA8A4AIBkAAK0NACAbAACxDQAgLAAAqg0AIC0AAKsNACBbAACJGgAg4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhigYBAJIMACGLBgEAkgwAIY0GAQCSDAAhwgYBAJIMACHSBgEAkwwAIZQHQACUDAAhFgcAALINACAJAACvDQAgCgAAsA0AIA4AAK4NACAPAACsDQAgEAAA8A4AIBkAAK0NACAbAACxDQAgLAAAqg0AIC0AAKsNACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhiQYBAJIMACGKBgEAkgwAIYsGAQCSDAAhjQYBAJIMACHCBgEAkgwAIdIGAQCTDAAhlAdAAJQMACEK4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGfBgEAAAABugYBAAAAAcAGAQAAAAHHBgEAAAAByQYBAAAAAQMAAAAYACBiAACBGgAgYwAAjRoAIBoAAAAYACAIAACaFgAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIFsAAI0aACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIRgIAACaFgAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhAwAAABYAIGIAAIMaACBjAACQGgAgIgAAABYAIAYAAPMRACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAAJAaACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAGAADzEQAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAIQrhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAxwYCugYBAAAAAcAGAQAAAAHEBgEAAAABxQYBAAAAAQkHAADJFQAgCQAAghQAIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAcAGAQAAAAECAAAAlwEAIGIAAJIaACAYCAAAmxYAIAwAAOIVACANAADaFQAgEQAA2xUAIBwAAOEVACAnAADgFQAgKgAA4xUAIC4AANQVACAvAADVFQAgMAAA1hUAIDEAANgVACAyAADZFQAgNAAA3BUAIDUAAN0VACA2AADeFQAgNwAA3xUAIDgAAOQVACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB0QYBAAAAAf4GAQAAAAGTBwEAAAABAgAAABoAIGIAAJQaACAgBgAA7RUAIAwAAPsVACANAADwFQAgEQAA8RUAIBwAAPgVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAACWGgAgC-EFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABigYBAAAAAYsGAQAAAAGNBgEAAAABwgYBAAAAAdIGAQAAAAGUB0AAAAABB-EFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABigYBAAAAAYsGAQAAAAEK4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGLBgEAAAABkgYBAAAAAZMGAQAAAAGVBgAAAJUGApYGQAAAAAEDAAAAawAgYgAAkhoAIGMAAJ0aACALAAAAawAgBwAAxxUAIAkAAPYTACBbAACdGgAg4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAhwAYBAJMMACEJBwAAxxUAIAkAAPYTACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHABgEAkwwAIQMAAAAYACBiAACUGgAgYwAAoBoAIBoAAAAYACAIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIFsAAKAaACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIRgIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhAwAAABYAIGIAAJYaACBjAACjGgAgIgAAABYAIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAAKMaACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAIQnhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHABgEAAAABwQYCAAAAAcMGAQAAAAEL4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBgEAAAAB0gYBAAAAAZQHQAAAAAEYCAAAmxYAIAwAAOIVACANAADaFQAgEQAA2xUAIBwAAOEVACAlAADXFQAgKgAA4xUAIC4AANQVACAvAADVFQAgMAAA1hUAIDEAANgVACAyAADZFQAgNAAA3BUAIDUAAN0VACA2AADeFQAgNwAA3xUAIDgAAOQVACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB0QYBAAAAAf4GAQAAAAGTBwEAAAABAgAAABoAIGIAAKYaACAgBgAA7RUAIAwAAPsVACANAADwFQAgEQAA8RUAIBwAAPgVACAlAADrFQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAACoGgAgFuEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABjQYBAAAAAZkGAAAA4AYCsQYQAAAAAbIGAQAAAAGzBgIAAAABwgYBAAAAAd4GAAAA3gYC4AYBAAAAAeEGAQAAAAHiBgEAAAAB4wYBAAAAAeQGAQAAAAHlBgEAAAAB5gYBAAAAAecGgAAAAAHoBkAAAAAB6QZAAAAAAQMAAAAYACBiAACmGgAgYwAArRoAIBoAAAAYACAIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICUAAKoUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIFsAAK0aACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIRgIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICUAAKoUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhAwAAABYAIGIAAKgaACBjAACwGgAgIgAAABYAIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAALAaACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAIQnhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAbIGAQAAAAHaBiAAAAAB6gYQAAAAAesGEAAAAAEPAwAA9Q4AIAcAAPMOACAJAAD0DgAgDQAA9g4AIBMAAPcOACAaAAD4DgAgIgAA-g4AIOEFAQAAAAHlBQEAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6QVAAAAAAeoFQAAAAAG2BgEAAAABAgAAAJ0BACBiAACyGgAgAwAAAFMAIGIAALIaACBjAAC2GgAgEQAAAFMAIAMAAKUOACAHAACjDgAgCQAApA4AIA0AAKYOACATAACnDgAgGgAAqA4AICIAAKoOACBbAAC2GgAg4QUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJMMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACG2BgEAkgwAIQ8DAAClDgAgBwAAow4AIAkAAKQOACANAACmDgAgEwAApw4AIBoAAKgOACAiAACqDgAg4QUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJMMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACG2BgEAkgwAIRbhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAY0GAQAAAAGZBgAAAOAGArEGEAAAAAGyBgEAAAABswYCAAAAAdwGAQAAAAHeBgAAAN4GAuAGAQAAAAHhBgEAAAAB4gYBAAAAAeMGAQAAAAHkBgEAAAAB5QYBAAAAAeYGAQAAAAHnBoAAAAAB6AZAAAAAAekGQAAAAAEgBAAA-hcAIAUAAPsXACAGAAD8FwAgEAAA_RcAIBkAAP4XACA0AACBGAAgQAAA_xcAIEsAAIAYACBMAACCGAAgTQAAgxgAIE4AAIQYACBPAACFGAAgUQAAhxgAIFIAAIgYACBTAACJGAAgVAAAihgAIFUAAIsYACDhBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAECAAAA7AIAIGIAALgaACADAAAAUQAgYgAAuBoAIGMAALwaACAiAAAAUQAgBAAAwxYAIAUAAMQWACAGAADFFgAgEAAAxhYAIBkAAMcWACA0AADKFgAgQAAAyBYAIEsAAMkWACBMAADLFgAgTQAAzBYAIE4AAM0WACBPAADOFgAgUQAA0BYAIFIAANEWACBTAADSFgAgVAAA0xYAIFUAANQWACBbAAC8GgAg4QUBAJIMACHlBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIe8GAQCSDAAhrAcBAJIMACGtByAA9A0AIa4HAQCTDAAhrwcBAJMMACGwBwEAkwwAIbEHAQCTDAAhsgcBAJMMACGzBwEAkwwAIbQHAQCSDAAhIAQAAMMWACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFEAANAWACBSAADRFgAgUwAA0hYAIFQAANMWACBVAADUFgAg4QUBAJIMACHlBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIe8GAQCSDAAhrAcBAJIMACGtByAA9A0AIa4HAQCTDAAhrwcBAJMMACGwBwEAkwwAIbEHAQCTDAAhsgcBAJMMACGzBwEAkwwAIbQHAQCSDAAhDwMAAPUOACAHAADzDgAgCQAA9A4AIA0AAPYOACATAAD3DgAgHAAA-Q4AICIAAPoOACDhBQEAAAAB5QUBAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAekFQAAAAAHqBUAAAAABtgYBAAAAAQIAAACdAQAgYgAAvRoAIAMAAABTACBiAAC9GgAgYwAAwRoAIBEAAABTACADAAClDgAgBwAAow4AIAkAAKQOACANAACmDgAgEwAApw4AIBwAAKkOACAiAACqDgAgWwAAwRoAIOEFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCTDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhtgYBAJIMACEPAwAApQ4AIAcAAKMOACAJAACkDgAgDQAApg4AIBMAAKcOACAcAACpDgAgIgAAqg4AIOEFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCTDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhtgYBAJIMACEgBAAA-hcAIAUAAPsXACAGAAD8FwAgEAAA_RcAIDQAAIEYACBAAAD_FwAgSwAAgBgAIEwAAIIYACBNAACDGAAgTgAAhBgAIE8AAIUYACBQAACGGAAgUQAAhxgAIFIAAIgYACBTAACJGAAgVAAAihgAIFUAAIsYACDhBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAECAAAA7AIAIGIAAMIaACAYCAAAmxYAIAwAAOIVACANAADaFQAgEQAA2xUAIBwAAOEVACAlAADXFQAgJwAA4BUAICoAAOMVACAuAADUFQAgLwAA1RUAIDAAANYVACAxAADYFQAgNAAA3BUAIDUAAN0VACA2AADeFQAgNwAA3xUAIDgAAOQVACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB0QYBAAAAAf4GAQAAAAGTBwEAAAABAgAAABoAIGIAAMQaACAgBgAA7RUAIAwAAPsVACANAADwFQAgEQAA8RUAIBwAAPgVACAlAADrFQAgJwAA9xUAICoAAPwVACAuAADoFQAgLwAA6RUAIDAAAOwVACAxAADuFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAADGGgAgEgMAAO4NACAHAADmDQAgCQAA7Q0AIBEAAOgNACAiAADsDQAgJAAA6Q0AIEkAAOoNACBKAADrDQAg4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAAAAAeUFAQAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHpBUAAAAAB6gVAAAAAAQIAAAAQACBiAADIGgAgAwAAAA4AIGIAAMgaACBjAADMGgAgFAAAAA4AIAMAAJ0MACAHAACVDAAgCQAAnAwAIBEAAJcMACAiAACbDAAgJAAAmAwAIEkAAJkMACBKAACaDAAgWwAAzBoAIOEFAQCSDAAh4gUBAJIMACHjBQEAkgwAIeQFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCSDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhEgMAAJ0MACAHAACVDAAgCQAAnAwAIBEAAJcMACAiAACbDAAgJAAAmAwAIEkAAJkMACBKAACaDAAg4QUBAJIMACHiBQEAkgwAIeMFAQCSDAAh5AUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJIMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACEL4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAHCBgEAAAAB0gYBAAAAAZQHQAAAAAEK4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGMBgEAAAABjgYBAAAAAY8GAQAAAAGQBgEAAAABkQZAAAAAASAEAAD6FwAgBQAA-xcAIAYAAPwXACAQAAD9FwAgGQAA_hcAIDQAAIEYACBAAAD_FwAgSwAAgBgAIEwAAIIYACBNAACDGAAgTgAAhBgAIFAAAIYYACBRAACHGAAgUgAAiBgAIFMAAIkYACBUAACKGAAgVQAAixgAIOEFAQAAAAHlBQEAAAAB6QVAAAAAAeoFQAAAAAG6BgEAAAAB7wYBAAAAAawHAQAAAAGtByAAAAABrgcBAAAAAa8HAQAAAAGwBwEAAAABsQcBAAAAAbIHAQAAAAGzBwEAAAABtAcBAAAAAQIAAADsAgAgYgAAzxoAICAEAAD6FwAgBQAA-xcAIAYAAPwXACAQAAD9FwAgGQAA_hcAIDQAAIEYACBAAAD_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_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAA4xoAICAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgJQAA6xUAICcAAPcVACAqAAD8FQAgLgAA6BUAIC8AAOkVACAwAADsFQAgMQAA7hUAIDIAAO8VACA0AADzFQAgNQAA9BUAIDYAAPUVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAAOUaACADAAAAdAAgYgAA3xoAIGMAAOkaACAPAAAAdAAgBwAApQ8AIAkAAKYPACAbAACXEQAgWwAA6RoAIOEFAQCSDAAh5gUBAJIMACHnBQEAkgwAIekFQACUDAAh6gVAAJQMACGyBgEAkgwAIcIGAQCSDAAh2gYgAPQNACHqBhAAmg4AIesGEACaDgAhDQcAAKUPACAJAACmDwAgGwAAlxEAIOEFAQCSDAAh5gUBAJIMACHnBQEAkgwAIekFQACUDAAh6gVAAJQMACGyBgEAkgwAIcIGAQCSDAAh2gYgAPQNACHqBhAAmg4AIesGEACaDgAhAwAAAC8AIGIAAOEaACBjAADsGgAgCwAAAC8AIAwAAIoPACANAACMDwAgJQAAiw8AICcAAI0PACBbAADsGgAg4QUBAJIMACHmBQEAkgwAIboGAQCSDAAhuwZAAJQMACG8BkAAlAwAIQkMAACKDwAgDQAAjA8AICUAAIsPACAnAACNDwAg4QUBAJIMACHmBQEAkgwAIboGAQCSDAAhuwZAAJQMACG8BkAAlAwAIQMAAAAYACBiAADjGgAgYwAA7xoAIBoAAAAYACAIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIFsAAO8aACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIRgIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhAwAAABYAIGIAAOUaACBjAADyGgAgIgAAABYAIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAAPIaACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAIRbhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAA4AYCsQYQAAAAAbIGAQAAAAGzBgIAAAABwgYBAAAAAdwGAQAAAAHeBgAAAN4GAuAGAQAAAAHhBgEAAAAB4gYBAAAAAeMGAQAAAAHkBgEAAAAB5QYBAAAAAeYGAQAAAAHnBoAAAAAB6AZAAAAAAekGQAAAAAESAwAA7g0AIAcAAOYNACAJAADtDQAgDQAA5w0AIBEAAOgNACAkAADpDQAgSQAA6g0AIEoAAOsNACDhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBQEAAAAB5QUBAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAekFQAAAAAHqBUAAAAABAgAAABAAIGIAAPQaACADAAAADgAgYgAA9BoAIGMAAPgaACAUAAAADgAgAwAAnQwAIAcAAJUMACAJAACcDAAgDQAAlgwAIBEAAJcMACAkAACYDAAgSQAAmQwAIEoAAJoMACBbAAD4GgAg4QUBAJIMACHiBQEAkgwAIeMFAQCSDAAh5AUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJIMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACESAwAAnQwAIAcAAJUMACAJAACcDAAgDQAAlgwAIBEAAJcMACAkAACYDAAgSQAAmQwAIEoAAJoMACDhBQEAkgwAIeIFAQCSDAAh4wUBAJIMACHkBQEAkgwAIeUFAQCTDAAh5gUBAJIMACHnBQEAkgwAIegFAQCSDAAh6QVAAJQMACHqBUAAlAwAIQ_hBQEAAAAB6QVAAAAAAeoFQAAAAAGLBgEAAAABmQYAAAD1BgKbBkAAAAABngYBAAAAAfMGAAAA8wYC9QYBAAAAAfYGAQAAAAH3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BgEAAAAB-wZAAAAAAQMAAABRACBiAADCGgAgYwAA_BoAICIAAABRACAEAADDFgAgBQAAxBYAIAYAAMUWACAQAADGFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFMAANIWACBUAADTFgAgVQAA1BYAIFsAAPwaACDhBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACEgBAAAwxYAIAUAAMQWACAGAADFFgAgEAAAxhYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUQAA0BYAIFIAANEWACBTAADSFgAgVAAA0xYAIFUAANQWACDhBQEAkgwAIeUFAQCTDAAh6QVAAJQMACHqBUAAlAwAIboGAQCSDAAh7wYBAJIMACGsBwEAkgwAIa0HIAD0DQAhrgcBAJMMACGvBwEAkwwAIbAHAQCTDAAhsQcBAJMMACGyBwEAkwwAIbMHAQCTDAAhtAcBAJIMACEDAAAAGAAgYgAAxBoAIGMAAP8aACAaAAAAGAAgCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAICoAALYUACAuAACnFAAgLwAAqBQAIDAAAKkUACAxAACrFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACBbAAD_GgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEYCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAICoAALYUACAuAACnFAAgLwAAqBQAIDAAAKkUACAxAACrFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQMAAAAWACBiAADGGgAgYwAAghsAICIAAAAWACAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACBbAACCGwAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEeBwAA6BEAIDwAAOYRACA9AADnEQAg4QUBAAAAAeYFAQAAAAHpBUAAAAAB6gVAAAAAAZkGAAAAkQcCmwZAAAAAAcAGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAGABwAAAIAHA4EHAQAAAAGCBwAAAK8GA4MHEAAAAAGEBwEAAAABhQcCAAAAAYcHAAAAhwcCiAcBAAAAAYkHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgeAAAAAAY8HQAAAAAGRBwEAAAABkgcBAAAAAQIAAADVAQAgYgAAgxsAICAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAAIUbACADAAAA0wEAIGIAAIMbACBjAACJGwAgIAAAANMBACAHAADYEQAgPAAA1hEAID0AANcRACBbAACJGwAg4QUBAJIMACHmBQEAkwwAIekFQACUDAAh6gVAAJQMACGZBgAA1RGRByKbBkAAqgwAIcAGAQCTDAAh_AYBAJIMACH9BgEAkgwAIf4GAQCTDAAhgAcAANERgAcjgQcBAJMMACGCBwAA0hGvBiODBxAA0xEAIYQHAQCSDAAhhQcCAMgPACGHBwAA1BGHByKIBwEAkwwAIYkHAQCTDAAhigcBAJMMACGLBwEAkwwAIYwHAQCTDAAhjQcBAJMMACGOB4AAAAABjwdAAKoMACGRBwEAkwwAIZIHAQCTDAAhHgcAANgRACA8AADWEQAgPQAA1xEAIOEFAQCSDAAh5gUBAJMMACHpBUAAlAwAIeoFQACUDAAhmQYAANURkQcimwZAAKoMACHABgEAkwwAIfwGAQCSDAAh_QYBAJIMACH-BgEAkwwAIYAHAADREYAHI4EHAQCTDAAhggcAANIRrwYjgwcQANMRACGEBwEAkgwAIYUHAgDIDwAhhwcAANQRhwciiAcBAJMMACGJBwEAkwwAIYoHAQCTDAAhiwcBAJMMACGMBwEAkwwAIY0HAQCTDAAhjgeAAAAAAY8HQACqDAAhkQcBAJMMACGSBwEAkwwAIQMAAAAWACBiAACFGwAgYwAAjBsAICIAAAAWACAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACBbAACMGwAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACESAwAA7g0AIAcAAOYNACAJAADtDQAgDQAA5w0AIBEAAOgNACAiAADsDQAgJAAA6Q0AIEoAAOsNACDhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBQEAAAAB5QUBAAAAAeYFAQAAAAHnBQEAAAAB6AUBAAAAAekFQAAAAAHqBUAAAAABAgAAABAAIGIAAI0bACADAAAADgAgYgAAjRsAIGMAAJEbACAUAAAADgAgAwAAnQwAIAcAAJUMACAJAACcDAAgDQAAlgwAIBEAAJcMACAiAACbDAAgJAAAmAwAIEoAAJoMACBbAACRGwAg4QUBAJIMACHiBQEAkgwAIeMFAQCSDAAh5AUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJIMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACESAwAAnQwAIAcAAJUMACAJAACcDAAgDQAAlgwAIBEAAJcMACAiAACbDAAgJAAAmAwAIEoAAJoMACDhBQEAkgwAIeIFAQCSDAAh4wUBAJIMACHkBQEAkgwAIeUFAQCTDAAh5gUBAJIMACHnBQEAkgwAIegFAQCSDAAh6QVAAJQMACHqBUAAlAwAIRIDAADuDQAgBwAA5g0AIAkAAO0NACANAADnDQAgEQAA6A0AICIAAOwNACBJAADqDQAgSgAA6w0AIOEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFAQAAAAHlBQEAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6QVAAAAAAeoFQAAAAAECAAAAEAAgYgAAkhsAIAMAAAAOACBiAACSGwAgYwAAlhsAIBQAAAAOACADAACdDAAgBwAAlQwAIAkAAJwMACANAACWDAAgEQAAlwwAICIAAJsMACBJAACZDAAgSgAAmgwAIFsAAJYbACDhBQEAkgwAIeIFAQCSDAAh4wUBAJIMACHkBQEAkgwAIeUFAQCTDAAh5gUBAJIMACHnBQEAkgwAIegFAQCSDAAh6QVAAJQMACHqBUAAlAwAIRIDAACdDAAgBwAAlQwAIAkAAJwMACANAACWDAAgEQAAlwwAICIAAJsMACBJAACZDAAgSgAAmgwAIOEFAQCSDAAh4gUBAJIMACHjBQEAkgwAIeQFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCSDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhDwcAAIcNACAJAACIDQAgDgAAhg0AIBAAAIgOACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGLBgEAAAABkgYBAAAAAZMGAQAAAAGVBgAAAJUGApYGQAAAAAECAAAAQQAgYgAAlxsAIAMAAAA_ACBiAACXGwAgYwAAmxsAIBEAAAA_ACAHAADwDAAgCQAA8QwAIA4AAO8MACAQAACHDgAgWwAAmxsAIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGJBgEAkgwAIYsGAQCSDAAhkgYBAJIMACGTBgEAkwwAIZUGAADtDJUGIpYGQACqDAAhDwcAAPAMACAJAADxDAAgDgAA7wwAIBAAAIcOACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhiQYBAJIMACGLBgEAkgwAIZIGAQCSDAAhkwYBAJMMACGVBgAA7QyVBiKWBkAAqgwAIRIDAADuDQAgBwAA5g0AIAkAAO0NACANAADnDQAgIgAA7A0AICQAAOkNACBJAADqDQAgSgAA6w0AIOEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFAQAAAAHlBQEAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6QVAAAAAAeoFQAAAAAECAAAAEAAgYgAAnBsAIAMAAAAOACBiAACcGwAgYwAAoBsAIBQAAAAOACADAACdDAAgBwAAlQwAIAkAAJwMACANAACWDAAgIgAAmwwAICQAAJgMACBJAACZDAAgSgAAmgwAIFsAAKAbACDhBQEAkgwAIeIFAQCSDAAh4wUBAJIMACHkBQEAkgwAIeUFAQCTDAAh5gUBAJIMACHnBQEAkgwAIegFAQCSDAAh6QVAAJQMACHqBUAAlAwAIRIDAACdDAAgBwAAlQwAIAkAAJwMACANAACWDAAgIgAAmwwAICQAAJgMACBJAACZDAAgSgAAmgwAIOEFAQCSDAAh4gUBAJIMACHjBQEAkgwAIeQFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCSDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhIAQAAPoXACAFAAD7FwAgBgAA_BcAIBAAAP0XACAZAAD-FwAgNAAAgRgAIEAAAP8XACBLAACAGAAgTAAAghgAIE4AAIQYACBPAACFGAAgUAAAhhgAIFEAAIcYACBSAACIGAAgUwAAiRgAIFQAAIoYACBVAACLGAAg4QUBAAAAAeUFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHvBgEAAAABrAcBAAAAAa0HIAAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgcBAAAAAbMHAQAAAAG0BwEAAAABAgAAAOwCACBiAAChGwAgAwAAAFEAIGIAAKEbACBjAAClGwAgIgAAAFEAIAQAAMMWACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE4AAM0WACBPAADOFgAgUAAAzxYAIFEAANAWACBSAADRFgAgUwAA0hYAIFQAANMWACBVAADUFgAgWwAApRsAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAISAEAADDFgAgBQAAxBYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFMAANIWACBUAADTFgAgVQAA1BYAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAISAEAAD6FwAgBQAA-xcAIAYAAPwXACAZAAD-FwAgNAAAgRgAIEAAAP8XACBLAACAGAAgTAAAghgAIE0AAIMYACBOAACEGAAgTwAAhRgAIFAAAIYYACBRAACHGAAgUgAAiBgAIFMAAIkYACBUAACKGAAgVQAAixgAIOEFAQAAAAHlBQEAAAAB6QVAAAAAAeoFQAAAAAG6BgEAAAAB7wYBAAAAAawHAQAAAAGtByAAAAABrgcBAAAAAa8HAQAAAAGwBwEAAAABsQcBAAAAAbIHAQAAAAGzBwEAAAABtAcBAAAAAQIAAADsAgAgYgAAphsAIBgIAACbFgAgDAAA4hUAIA0AANoVACARAADbFQAgHAAA4RUAICUAANcVACAnAADgFQAgKgAA4xUAIC4AANQVACAvAADVFQAgMAAA1hUAIDIAANkVACA0AADcFQAgNQAA3RUAIDYAAN4VACA3AADfFQAgOAAA5BUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAcAGAQAAAAHRBgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAAqBsAICAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDIAAO8VACA0AADzFQAgNQAA9BUAIDYAAPUVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAAKobACAgBgAA7RUAIAwAAPsVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAACsGwAgCQwAAJAQACAcAACUEAAgJQAAkRAAICcAAJMQACDhBQEAAAAB5gUBAAAAAboGAQAAAAG7BkAAAAABvAZAAAAAAQIAAADdBwAgYgAArhsAIA4HAADjEAAgCQAA5BAAIA8AAOEQACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAZIGAQAAAAHABgEAAAABygYBAAAAAcsGQAAAAAHMBggAAAABzQYIAAAAAQIAAAAfACBiAACwGwAgGAgAAJsWACAMAADiFQAgEQAA2xUAIBwAAOEVACAlAADXFQAgJwAA4BUAICoAAOMVACAuAADUFQAgLwAA1RUAIDAAANYVACAxAADYFQAgMgAA2RUAIDQAANwVACA1AADdFQAgNgAA3hUAIDcAAN8VACA4AADkFQAg4QUBAAAAAekFQAAAAAHqBUAAAAABwAYBAAAAAdEGAQAAAAH-BgEAAAABkwcBAAAAAQIAAAAaACBiAACyGwAgEAcAAO8PACAJAADwDwAgEQAA7Q8AIBsAAKAQACAkAADuDwAgJgAA8Q8AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAcAGAQAAAAHBBgIAAAABwgYBAAAAAcMGAQAAAAECAAAANwAgYgAAtBsAIA8DAAD1DgAgBwAA8w4AIAkAAPQOACATAAD3DgAgGgAA-A4AIBwAAPkOACAiAAD6DgAg4QUBAAAAAeUFAQAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHpBUAAAAAB6gVAAAAAAbYGAQAAAAECAAAAnQEAIGIAALYbACAOBwAA3RAAIAkAAN4QACAKAADJEwAgEQAA4BAAIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABwAYBAAAAAcwGAgAAAAHSBgEAAAABlQcBAAAAAZYHAQAAAAECAAAAIwAgYgAAuBsAIBgIAACbFgAgDAAA4hUAIA0AANoVACARAADbFQAgHAAA4RUAICUAANcVACAnAADgFQAgLgAA1BUAIC8AANUVACAwAADWFQAgMQAA2BUAIDIAANkVACA0AADcFQAgNQAA3RUAIDYAAN4VACA3AADfFQAgOAAA5BUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAcAGAQAAAAHRBgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAAuhsAICAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgLgAA6BUAIC8AAOkVACAwAADsFQAgMQAA7hUAIDIAAO8VACA0AADzFQAgNQAA9BUAIDYAAPUVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAALwbACAKBwAAqhYAIOEFAQAAAAHmBQEAAAAB6QVAAAAAAeoFQAAAAAG6BgEAAAABlwcBAAAAAZgHAQAAAAGZBwIAAAABmwcAAACbBwICAAAAygEAIGIAAL4bACAOBwAAjhAAIAkAAI8QACAbAAClEAAg4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGZBgAAAMcGAroGAQAAAAHABgEAAAABwgYBAAAAAcQGAQAAAAHFBgEAAAABAgAAADMAIGIAAMAbACADAAAAGAAgYgAAuhsAIGMAAMQbACAaAAAAGAAgCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACBbAADEGwAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEYCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQMAAAAWACBiAAC8GwAgYwAAxxsAICIAAAAWACAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACBbAADHGwAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEDAAAAyAEAIGIAAL4bACBjAADKGwAgDAAAAMgBACAHAACpFgAgWwAAyhsAIOEFAQCSDAAh5gUBAJIMACHpBUAAlAwAIeoFQACUDAAhugYBAJMMACGXBwEAkgwAIZgHAQCSDAAhmQcCAJsOACGbBwAA3RObByIKBwAAqRYAIOEFAQCSDAAh5gUBAJIMACHpBUAAlAwAIeoFQACUDAAhugYBAJMMACGXBwEAkgwAIZgHAQCSDAAhmQcCAJsOACGbBwAA3RObByIDAAAAMQAgYgAAwBsAIGMAAM0bACAQAAAAMQAgBwAA_w8AIAkAAIAQACAbAACkEAAgWwAAzRsAIOEFAQCSDAAh5gUBAJMMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGZBgAA_A_HBiK6BgEAkgwAIcAGAQCTDAAhwgYBAJMMACHEBgEAkgwAIcUGAQCSDAAhDgcAAP8PACAJAACAEAAgGwAApBAAIOEFAQCSDAAh5gUBAJMMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGZBgAA_A_HBiK6BgEAkgwAIcAGAQCTDAAhwgYBAJMMACHEBgEAkgwAIcUGAQCSDAAhCuEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAcAGAQAAAAHHBgEAAAAByAYBAAAAAckGAQAAAAEF4QUBAAAAAekFQAAAAAHqBUAAAAABmQYAAAC3BwK1B0AAAAABEgMAAO4NACAHAADmDQAgCQAA7Q0AIA0AAOcNACARAADoDQAgIgAA7A0AICQAAOkNACBJAADqDQAg4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AUBAAAAAeUFAQAAAAHmBQEAAAAB5wUBAAAAAegFAQAAAAHpBUAAAAAB6gVAAAAAAQIAAAAQACBiAADQGwAgAwAAAA4AIGIAANAbACBjAADUGwAgFAAAAA4AIAMAAJ0MACAHAACVDAAgCQAAnAwAIA0AAJYMACARAACXDAAgIgAAmwwAICQAAJgMACBJAACZDAAgWwAA1BsAIOEFAQCSDAAh4gUBAJIMACHjBQEAkgwAIeQFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCSDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhEgMAAJ0MACAHAACVDAAgCQAAnAwAIA0AAJYMACARAACXDAAgIgAAmwwAICQAAJgMACBJAACZDAAg4QUBAJIMACHiBQEAkgwAIeMFAQCSDAAh5AUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJIMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACEDAAAAFgAgYgAArBsAIGMAANcbACAiAAAAFgAgBgAA8xEAIAwAAIESACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAgWwAA1xsAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhIAYAAPMRACAMAACBEgAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_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_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAA6xsAICAGAADtFQAgDAAA-xUAIA0AAPAVACAcAAD4FQAgJQAA6xUAICcAAPcVACAqAAD8FQAgLgAA6BUAIC8AAOkVACAwAADsFQAgMQAA7hUAIDIAAO8VACA0AADzFQAgNQAA9BUAIDYAAPUVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAAO0bACAOBwAA3RAAIAkAAN4QACAKAADJEwAgDQAA3xAAIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABwAYBAAAAAcwGAgAAAAHSBgEAAAABlQcBAAAAAZYHAQAAAAECAAAAIwAgYgAA7xsAIBAHAADvDwAgCQAA8A8AIA0AAOwPACAbAACgEAAgJAAA7g8AICYAAPEPACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHABgEAAAABwQYCAAAAAcIGAQAAAAHDBgEAAAABAgAAADcAIGIAAPEbACADAAAAGAAgYgAA6xsAIGMAAPUbACAaAAAAGAAgCAAAmhYAIAwAALUUACANAACtFAAgHAAAtBQAICUAAKoUACAnAACzFAAgKgAAthQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACBbAAD1GwAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEYCAAAmhYAIAwAALUUACANAACtFAAgHAAAtBQAICUAAKoUACAnAACzFAAgKgAAthQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgNwAAshQAIDgAALcUACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQMAAAAWACBiAADtGwAgYwAA-BsAICIAAAAWACAGAADzEQAgDAAAgRIAIA0AAPYRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACBbAAD4GwAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEgBgAA8xEAIAwAAIESACANAAD2EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEDAAAAIQAgYgAA7xsAIGMAAPsbACAQAAAAIQAgBwAAxhAAIAkAAMcQACAKAADHEwAgDQAAyBAAIFsAAPsbACDhBQEAkgwAIeYFAQCSDAAh5wUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHMBgIAyA8AIdIGAQCTDAAhlQcBAJIMACGWBwEAkgwAIQ4HAADGEAAgCQAAxxAAIAoAAMcTACANAADIEAAg4QUBAJIMACHmBQEAkgwAIecFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAhzAYCAMgPACHSBgEAkwwAIZUHAQCSDAAhlgcBAJIMACEDAAAANQAgYgAA8RsAIGMAAP4bACASAAAANQAgBwAAzQ8AIAkAAM4PACANAADKDwAgGwAAnxAAICQAAMwPACAmAADPDwAgWwAA_hsAIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIcAGAQCTDAAhwQYCAMgPACHCBgEAkgwAIcMGAQCTDAAhEAcAAM0PACAJAADODwAgDQAAyg8AIBsAAJ8QACAkAADMDwAgJgAAzw8AIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIcAGAQCTDAAhwQYCAMgPACHCBgEAkgwAIcMGAQCTDAAhB-EFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABiQYBAAAAAYoGAQAAAAEYCAAAmxYAIAwAAOIVACANAADaFQAgEQAA2xUAIBwAAOEVACAlAADXFQAgJwAA4BUAICoAAOMVACAuAADUFQAgLwAA1RUAIDAAANYVACAxAADYFQAgMgAA2RUAIDQAANwVACA2AADeFQAgNwAA3xUAIDgAAOQVACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB0QYBAAAAAf4GAQAAAAGTBwEAAAABAgAAABoAIGIAAIAcACAgBgAA7RUAIAwAAPsVACANAADwFQAgEQAA8RUAIBwAAPgVACAlAADrFQAgJwAA9xUAICoAAPwVACAuAADoFQAgLwAA6RUAIDAAAOwVACAxAADuFQAgMgAA7xUAIDQAAPMVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAACCHAAgEAcAAO8PACAJAADwDwAgDQAA7A8AIBEAAO0PACAbAACgEAAgJgAA8Q8AIOEFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAcAGAQAAAAHBBgIAAAABwgYBAAAAAcMGAQAAAAECAAAANwAgYgAAhBwAIBgIAACbFgAgDAAA4hUAIA0AANoVACARAADbFQAgHAAA4RUAICUAANcVACAnAADgFQAgKgAA4xUAIC4AANQVACAvAADVFQAgMAAA1hUAIDEAANgVACAyAADZFQAgNAAA3BUAIDUAAN0VACA3AADfFQAgOAAA5BUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAcAGAQAAAAHRBgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAAhhwAICAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAAIgcACAPAwAA9Q4AIAcAAPMOACAJAAD0DgAgDQAA9g4AIBoAAPgOACAcAAD5DgAgIgAA-g4AIOEFAQAAAAHlBQEAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6QVAAAAAAeoFQAAAAAG2BgEAAAABAgAAAJ0BACBiAACKHAAgAwAAABgAIGIAAIYcACBjAACOHAAgGgAAABgAIAgAAJoWACAMAAC1FAAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDcAALIUACA4AAC3FAAgWwAAjhwAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhGAgAAJoWACAMAAC1FAAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDcAALIUACA4AAC3FAAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEDAAAAFgAgYgAAiBwAIGMAAJEcACAiAAAAFgAgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAgWwAAkRwAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhAwAAAFMAIGIAAIocACBjAACUHAAgEQAAAFMAIAMAAKUOACAHAACjDgAgCQAApA4AIA0AAKYOACAaAACoDgAgHAAAqQ4AICIAAKoOACBbAACUHAAg4QUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJMMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACG2BgEAkgwAIQ8DAAClDgAgBwAAow4AIAkAAKQOACANAACmDgAgGgAAqA4AIBwAAKkOACAiAACqDgAg4QUBAJIMACHlBQEAkwwAIeYFAQCSDAAh5wUBAJMMACHoBQEAkgwAIekFQACUDAAh6gVAAJQMACG2BgEAkgwAIQrhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAY0GAQAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBkAAAAABAwAAABgAIGIAAIAcACBjAACYHAAgGgAAABgAIAgAAJoWACAMAAC1FAAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNgAAsRQAIDcAALIUACA4AAC3FAAgWwAAmBwAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhGAgAAJoWACAMAAC1FAAgDQAArRQAIBEAAK4UACAcAAC0FAAgJQAAqhQAICcAALMUACAqAAC2FAAgLgAApxQAIC8AAKgUACAwAACpFAAgMQAAqxQAIDIAAKwUACA0AACvFAAgNgAAsRQAIDcAALIUACA4AAC3FAAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEDAAAAFgAgYgAAghwAIGMAAJscACAiAAAAFgAgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBIAACFEgAgWwAAmxwAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhAwAAADUAIGIAAIQcACBjAACeHAAgEgAAADUAIAcAAM0PACAJAADODwAgDQAAyg8AIBEAAMsPACAbAACfEAAgJgAAzw8AIFsAAJ4cACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHABgEAkwwAIcEGAgDIDwAhwgYBAJIMACHDBgEAkwwAIRAHAADNDwAgCQAAzg8AIA0AAMoPACARAADLDwAgGwAAnxAAICYAAM8PACDhBQEAkgwAIeYFAQCSDAAh5wUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHABgEAkwwAIcEGAgDIDwAhwgYBAJIMACHDBgEAkwwAIQrhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGSBgEAAAABkwYBAAAAAZUGAAAAlQYClgZAAAAAARgIAACbFgAgDAAA4hUAIA0AANoVACARAADbFQAgHAAA4RUAICUAANcVACAnAADgFQAgKgAA4xUAIC4AANQVACAvAADVFQAgMAAA1hUAIDEAANgVACAyAADZFQAgNQAA3RUAIDYAAN4VACA3AADfFQAgOAAA5BUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAcAGAQAAAAHRBgEAAAAB_gYBAAAAAZMHAQAAAAECAAAAGgAgYgAAoBwAICAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNQAA9BUAIDYAAPUVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAAKIcACAgBAAA-hcAIAUAAPsXACAGAAD8FwAgEAAA_RcAIBkAAP4XACA0AACBGAAgQAAA_xcAIEsAAIAYACBNAACDGAAgTgAAhBgAIE8AAIUYACBQAACGGAAgUQAAhxgAIFIAAIgYACBTAACJGAAgVAAAihgAIFUAAIsYACDhBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAECAAAA7AIAIGIAAKQcACAgBAAA-hcAIAUAAPsXACAGAAD8FwAgEAAA_RcAIBkAAP4XACBAAAD_FwAgSwAAgBgAIEwAAIIYACBNAACDGAAgTgAAhBgAIE8AAIUYACBQAACGGAAgUQAAhxgAIFIAAIgYACBTAACJGAAgVAAAihgAIFUAAIsYACDhBQEAAAAB5QUBAAAAAekFQAAAAAHqBUAAAAABugYBAAAAAe8GAQAAAAGsBwEAAAABrQcgAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAECAAAA7AIAIGIAAKYcACAM4QUBAAAAAeYFAQAAAAHnBQEAAAAB6QVAAAAAAeoFQAAAAAGSBgEAAAABzgYBAAAAAc8GAQAAAAHQBgAAhBEAINEGAQAAAAHSBgEAAAAB0wYBAAAAAQIAAADFBgAgYgAAqBwAIAMAAAAYACBiAACgHAAgYwAArBwAIBoAAAAYACAIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICUAAKoUACAnAACzFAAgKgAAthQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIFsAAKwcACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIRgIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICUAAKoUACAnAACzFAAgKgAAthQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhAwAAABYAIGIAAKIcACBjAACvHAAgIgAAABYAIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAAK8cACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_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-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEcAAP4VACBIAAD_FQAg4QUBAAAAAekFQAAAAAHqBUAAAAABlQYAAACABwO6BgEAAAABwAYBAAAAAf4GAQAAAAGBBwEAAAABAgAAAO8EACBiAAC8HAAgFgcAAOUNACAJAADiDQAgCgAA4w0AIAsAANwNACAOAADhDQAgDwAA3w0AIBAAAPIOACAZAADgDQAgGwAA5A0AICwAAN0NACDhBQEAAAAB5gUBAAAAAecFAQAAAAHpBUAAAAAB6gVAAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAY0GAQAAAAHCBgEAAAAB0gYBAAAAAZQHQAAAAAECAAAAKAAgYgAAvhwAIAMAAAAYACBiAAC6HAAgYwAAwhwAIBoAAAAYACAIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICUAAKoUACAnAACzFAAgKgAAthQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgOAAAtxQAIFsAAMIcACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIRgIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICUAAKoUACAnAACzFAAgKgAAthQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDEAAKsUACAyAACsFAAgNAAArxQAIDUAALAUACA2AACxFAAgOAAAtxQAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhAwAAABYAIGIAALwcACBjAADFHAAgIgAAABYAIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAAMUcACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAIQMAAAAmACBiAAC-HAAgYwAAyBwAIBgAAAAmACAHAACyDQAgCQAArw0AIAoAALANACALAACpDQAgDgAArg0AIA8AAKwNACAQAADwDgAgGQAArQ0AIBsAALENACAsAACqDQAgWwAAyBwAIOEFAQCSDAAh5gUBAJIMACHnBQEAkwwAIekFQACUDAAh6gVAAJQMACGJBgEAkgwAIYoGAQCSDAAhiwYBAJIMACGNBgEAkgwAIcIGAQCSDAAh0gYBAJMMACGUB0AAlAwAIRYHAACyDQAgCQAArw0AIAoAALANACALAACpDQAgDgAArg0AIA8AAKwNACAQAADwDgAgGQAArQ0AIBsAALENACAsAACqDQAg4QUBAJIMACHmBQEAkgwAIecFAQCTDAAh6QVAAJQMACHqBUAAlAwAIYkGAQCSDAAhigYBAJIMACGLBgEAkgwAIY0GAQCSDAAhwgYBAJIMACHSBgEAkwwAIZQHQACUDAAhE-EFAQAAAAHmBQEAAAAB5wUBAAAAAekFQAAAAAHqBUAAAAABnwYBAAAAAaAGCAAAAAGhBggAAAABogYIAAAAAaMGCAAAAAGkBggAAAABpQYIAAAAAaYGCAAAAAGnBggAAAABqAYIAAAAAakGCAAAAAGqBggAAAABqwYIAAAAAawGCAAAAAEYCAAAmxYAIAwAAOIVACANAADaFQAgEQAA2xUAIBwAAOEVACAlAADXFQAgJwAA4BUAICoAAOMVACAuAADUFQAgLwAA1RUAIDAAANYVACAxAADYFQAgMgAA2RUAIDQAANwVACA1AADdFQAgNgAA3hUAIDcAAN8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAHABgEAAAAB0QYBAAAAAf4GAQAAAAGTBwEAAAABAgAAABoAIGIAAMocACAPAwAA9Q4AIAcAAPMOACAJAAD0DgAgDQAA9g4AIBMAAPcOACAaAAD4DgAgHAAA-Q4AIOEFAQAAAAHlBQEAAAAB5gUBAAAAAecFAQAAAAHoBQEAAAAB6QVAAAAAAeoFQAAAAAG2BgEAAAABAgAAAJ0BACBiAADMHAAgIAQAAPoXACAFAAD7FwAgBgAA_BcAIBAAAP0XACAZAAD-FwAgNAAAgRgAIEAAAP8XACBLAACAGAAgTAAAghgAIE0AAIMYACBOAACEGAAgTwAAhRgAIFAAAIYYACBRAACHGAAgUgAAiBgAIFQAAIoYACBVAACLGAAg4QUBAAAAAeUFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHvBgEAAAABrAcBAAAAAa0HIAAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgcBAAAAAbMHAQAAAAG0BwEAAAABAgAAAOwCACBiAADOHAAgIAQAAPoXACAFAAD7FwAgBgAA_BcAIBAAAP0XACAZAAD-FwAgNAAAgRgAIEAAAP8XACBLAACAGAAgTAAAghgAIE0AAIMYACBOAACEGAAgTwAAhRgAIFAAAIYYACBRAACHGAAgUwAAiRgAIFQAAIoYACBVAACLGAAg4QUBAAAAAeUFAQAAAAHpBUAAAAAB6gVAAAAAAboGAQAAAAHvBgEAAAABrAcBAAAAAa0HIAAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgcBAAAAAbMHAQAAAAG0BwEAAAABAgAAAOwCACBiAADQHAAgIAYAAO0VACAMAAD7FQAgDQAA8BUAIBEAAPEVACAcAAD4FQAgJQAA6xUAICcAAPcVACAqAAD8FQAgLgAA6BUAIC8AAOkVACAwAADsFQAgMQAA7hUAIDIAAO8VACA0AADzFQAgNQAA9BUAIDYAAPUVACA3AAD2FQAgOgAA5xUAIDsAAOoVACA_AAD6FQAgQAAA8hUAIEEAAPkVACBGAAD9FQAgRwAA_hUAIOEFAQAAAAHpBUAAAAAB6gVAAAAAAZUGAAAAgAcDugYBAAAAAcAGAQAAAAH-BgEAAAABgQcBAAAAAQIAAADvBAAgYgAA0hwAICAGAADtFQAgDAAA-xUAIA0AAPAVACARAADxFQAgHAAA-BUAICUAAOsVACAnAAD3FQAgKgAA_BUAIC4AAOgVACAvAADpFQAgMAAA7BUAIDEAAO4VACAyAADvFQAgNAAA8xUAIDUAAPQVACA2AAD1FQAgNwAA9hUAIDoAAOcVACA7AADqFQAgPwAA-hUAIEAAAPIVACBBAAD5FQAgRgAA_RUAIEgAAP8VACDhBQEAAAAB6QVAAAAAAeoFQAAAAAGVBgAAAIAHA7oGAQAAAAHABgEAAAAB_gYBAAAAAYEHAQAAAAECAAAA7wQAIGIAANQcACADAAAAGAAgYgAAyhwAIGMAANgcACAaAAAAGAAgCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAICoAALYUACAuAACnFAAgLwAAqBQAIDAAAKkUACAxAACrFAAgMgAArBQAIDQAAK8UACA1AACwFAAgNgAAsRQAIDcAALIUACBbAADYHAAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhwAYBAJMMACHRBgEAkwwAIf4GAQCTDAAhkwcBAJIMACEYCAAAmhYAIAwAALUUACANAACtFAAgEQAArhQAIBwAALQUACAlAACqFAAgJwAAsxQAICoAALYUACAuAACnFAAgLwAAqBQAIDAAAKkUACAxAACrFAAgMgAArBQAIDQAAK8UACA1AACwFAAgNgAAsRQAIDcAALIUACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIQMAAABTACBiAADMHAAgYwAA2xwAIBEAAABTACADAAClDgAgBwAAow4AIAkAAKQOACANAACmDgAgEwAApw4AIBoAAKgOACAcAACpDgAgWwAA2xwAIOEFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCTDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhtgYBAJIMACEPAwAApQ4AIAcAAKMOACAJAACkDgAgDQAApg4AIBMAAKcOACAaAACoDgAgHAAAqQ4AIOEFAQCSDAAh5QUBAJMMACHmBQEAkgwAIecFAQCTDAAh6AUBAJIMACHpBUAAlAwAIeoFQACUDAAhtgYBAJIMACEDAAAAUQAgYgAAzhwAIGMAAN4cACAiAAAAUQAgBAAAwxYAIAUAAMQWACAGAADFFgAgEAAAxhYAIBkAAMcWACA0AADKFgAgQAAAyBYAIEsAAMkWACBMAADLFgAgTQAAzBYAIE4AAM0WACBPAADOFgAgUAAAzxYAIFEAANAWACBSAADRFgAgVAAA0xYAIFUAANQWACBbAADeHAAg4QUBAJIMACHlBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIe8GAQCSDAAhrAcBAJIMACGtByAA9A0AIa4HAQCTDAAhrwcBAJMMACGwBwEAkwwAIbEHAQCTDAAhsgcBAJMMACGzBwEAkwwAIbQHAQCSDAAhIAQAAMMWACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFQAANMWACBVAADUFgAg4QUBAJIMACHlBQEAkwwAIekFQACUDAAh6gVAAJQMACG6BgEAkgwAIe8GAQCSDAAhrAcBAJIMACGtByAA9A0AIa4HAQCTDAAhrwcBAJMMACGwBwEAkwwAIbEHAQCTDAAhsgcBAJMMACGzBwEAkwwAIbQHAQCSDAAhAwAAAFEAIGIAANAcACBjAADhHAAgIgAAAFEAIAQAAMMWACAFAADEFgAgBgAAxRYAIBAAAMYWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUwAA0hYAIFQAANMWACBVAADUFgAgWwAA4RwAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAISAEAADDFgAgBQAAxBYAIAYAAMUWACAQAADGFgAgGQAAxxYAIDQAAMoWACBAAADIFgAgSwAAyRYAIEwAAMsWACBNAADMFgAgTgAAzRYAIE8AAM4WACBQAADPFgAgUQAA0BYAIFMAANIWACBUAADTFgAgVQAA1BYAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAIQMAAAAWACBiAADSHAAgYwAA5BwAICIAAAAWACAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDEAAPQRACAyAAD1EQAgNAAA-REAIDUAAPoRACA2AAD7EQAgNwAA_BEAIDoAAO0RACA7AADwEQAgPwAAgBIAIEAAAPgRACBBAAD_EQAgRgAAgxIAIEcAAIQSACBbAADkHAAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAg4QUBAJIMACHpBUAAlAwAIeoFQACUDAAhlQYAANERgAcjugYBAJIMACHABgEAkwwAIf4GAQCTDAAhgQcBAJMMACEDAAAAFgAgYgAA1BwAIGMAAOccACAiAAAAFgAgBgAA8xEAIAwAAIESACANAAD2EQAgEQAA9xEAIBwAAP4RACAlAADxEQAgJwAA_REAICoAAIISACAuAADuEQAgLwAA7xEAIDAAAPIRACAxAAD0EQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBIAACFEgAgWwAA5xwAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMQAA9BEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgSAAAhRIAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIZUGAADREYAHI7oGAQCSDAAhwAYBAJMMACH-BgEAkwwAIYEHAQCTDAAhD-EFAQAAAAHpBUAAAAAB6gVAAAAAAY0GAQAAAAGZBgAAAPUGApsGQAAAAAGeBgEAAAAB8wYAAADzBgL1BgEAAAAB9gYBAAAAAfcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGAQAAAAH7BkAAAAABAwAAAFEAIGIAAKYbACBjAADrHAAgIgAAAFEAIAQAAMMWACAFAADEFgAgBgAAxRYAIBkAAMcWACA0AADKFgAgQAAAyBYAIEsAAMkWACBMAADLFgAgTQAAzBYAIE4AAM0WACBPAADOFgAgUAAAzxYAIFEAANAWACBSAADRFgAgUwAA0hYAIFQAANMWACBVAADUFgAgWwAA6xwAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAISAEAADDFgAgBQAAxBYAIAYAAMUWACAZAADHFgAgNAAAyhYAIEAAAMgWACBLAADJFgAgTAAAyxYAIE0AAMwWACBOAADNFgAgTwAAzhYAIFAAAM8WACBRAADQFgAgUgAA0RYAIFMAANIWACBUAADTFgAgVQAA1BYAIOEFAQCSDAAh5QUBAJMMACHpBUAAlAwAIeoFQACUDAAhugYBAJIMACHvBgEAkgwAIawHAQCSDAAhrQcgAPQNACGuBwEAkwwAIa8HAQCTDAAhsAcBAJMMACGxBwEAkwwAIbIHAQCTDAAhswcBAJMMACG0BwEAkgwAIQMAAAAYACBiAACoGwAgYwAA7hwAIBoAAAAYACAIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICUAAKoUACAnAACzFAAgKgAAthQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIFsAAO4cACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACHABgEAkwwAIdEGAQCTDAAh_gYBAJMMACGTBwEAkgwAIRgIAACaFgAgDAAAtRQAIA0AAK0UACARAACuFAAgHAAAtBQAICUAAKoUACAnAACzFAAgKgAAthQAIC4AAKcUACAvAACoFAAgMAAAqRQAIDIAAKwUACA0AACvFAAgNQAAsBQAIDYAALEUACA3AACyFAAgOAAAtxQAIOEFAQCSDAAh6QVAAJQMACHqBUAAlAwAIcAGAQCTDAAh0QYBAJMMACH-BgEAkwwAIZMHAQCSDAAhAwAAABYAIGIAAKobACBjAADxHAAgIgAAABYAIAYAAPMRACAMAACBEgAgDQAA9hEAIBEAAPcRACAcAAD-EQAgJQAA8REAICcAAP0RACAqAACCEgAgLgAA7hEAIC8AAO8RACAwAADyEQAgMgAA9REAIDQAAPkRACA1AAD6EQAgNgAA-xEAIDcAAPwRACA6AADtEQAgOwAA8BEAID8AAIASACBAAAD4EQAgQQAA_xEAIEYAAIMSACBHAACEEgAgSAAAhRIAIFsAAPEcACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAISAGAADzEQAgDAAAgRIAIA0AAPYRACARAAD3EQAgHAAA_hEAICUAAPERACAnAAD9EQAgKgAAghIAIC4AAO4RACAvAADvEQAgMAAA8hEAIDIAAPURACA0AAD5EQAgNQAA-hEAIDYAAPsRACA3AAD8EQAgOgAA7REAIDsAAPARACA_AACAEgAgQAAA-BEAIEEAAP8RACBGAACDEgAgRwAAhBIAIEgAAIUSACDhBQEAkgwAIekFQACUDAAh6gVAAJQMACGVBgAA0RGAByO6BgEAkgwAIcAGAQCTDAAh_gYBAJMMACGBBwEAkwwAIQIDAAIHAAYTBAYDBQoEBg0BEBEFFQA7GZ4CEzShAilAnwIuS6ACLkyiAilNpAI4TqUCFE-mAhRQqAI5UawCOlKtAhpTrgIaVK8CMlWwAjQBAwACAQMAAgoDAAIHAAYJAAgNkgILEZMCEBUANyKXAhoklAIRSZUCKUqWAiUaBs4BAQzoAQ0N0QELEdIBEBUANhzkARclzAEPJ-MBGCrpAQwuxgEJL8cBHTDNAQoxzwEFMtABEzTfASk14AERNuEBEjfiASU6FQc7ywEiP-cBL0DWAS5B5gExRu0BMkf4ARpI-QEaAwcXBhUALTkbCBMIHAcMsQENDZ8BCxGgARAVACwcsAEXJZoBDyevARgqsgEMLiAJL5gBHTCZAQoxmwEFMp4BEzSkASk1qgERNqsBEjeuASU4swEaBQcABgkACA2TAQsPJAoVACgGBwAGCQAICiUJDSkLEZABEBUAJwwHAAYJjAEICo0BCQstDA4ADw8AChAABRUAJhkAExsADiyIASQtigElBQeDAQYJhAEIKAANKQALKwAiBQd-Bgl_CAsuDBUAIRswDgYMNA0NcwsVACAceBclOA8ndxgIBwAGCWoIDTkLET0QFQAfGwAOJEIRJmwdBQcABgk-CA4ADw8AChAABQYHAAYJQwgOAA8QAAUVABwjRxIEBwAGCWgIEgARGQATCQMAAgcABglICA1JCxNKEhUAGxpOFBxYFyJeGgQWABUXAAIYUgIZVBMCFE8UFQAWARRQAAUHAAYJAAgZABMbAA4dABgFBwAGCQAIFQAZGwAOHFkXARxaAAcQYQUYXwIZYBMeAAYfAAYgAAIhYggFDWMAE2QAGmUAHGYAImcAASNpAAQHAAYJbQgVAB4lbg8BJW8AAw1wABFxACRyAAUMeQANewAcfQAlegAnfAABC4ABAAMHAAYVACMqgQEMASqCAQABKQALBAcABgmLAQgQAAUpAAsCC44BACyPAQACDZEBABGSAQACDZUBAA-UAQAGBwAGCakBCBCoAQUWACoYpwECMwACAhSlASkVACsBFKYBABEMwgEADboBABG7AQAcwQEAJbcBACfAAQAqwwEALrQBAC-1AQAwtgEAMbgBADK5AQA0vAEANb0BADa-AQA3vwEAOMQBAAE5xQEABQfYAQYVADA8AAI91wECP9wBLwIHAAY-3QEuAT_eAQABBwAGBQcABhUANUIAAkTxATNF9QE0AUMAMgIDAAJDADICRPYBAEX3AQAYBoACAAyNAgANgwIAEYQCAByLAgAl_gEAJ4oCACqOAgAu-wEAL_wBADD_AQAxgQIAMoICADSGAgA1hwIANogCADeJAgA6-gEAO_0BAD-MAgBAhQIARo8CAEeQAgBIkQIABg2YAgARmQIAIp0CACSaAgBJmwIASpwCAAEzAAIBFwACAQMAAhAEsQIABbICAAazAgAQtAIAGbUCADS4AgBAtgIAS7cCAEy5AgBOugIAT7sCAFG8AgBSvQIAU74CAFS_AgBVwAIAAAIDAAIHAAYCAwACBwAGAxUAQGgAQWkAQgAAAAMVAEBoAEFpAEIBKQALASkACwMVAEdoAEhpAEkAAAADFQBHaABIaQBJAAADFQBOaABPaQBQAAAAAxUATmgAT2kAUAEDAAIBAwACAxUAVWgAVmkAVwAAAAMVAFVoAFZpAFcBAwACAQMAAgMVAFxoAF1pAF4AAAADFQBcaABdaQBeAAAAAxUAZGgAZWkAZgAAAAMVAGRoAGVpAGYBAwACAQMAAgMVAGtoAGxpAG0AAAADFQBraABsaQBtAgcABgnpAwgCBwAGCe8DCAMVAHJoAHNpAHQAAAADFQByaABzaQB0AQcABgEHAAYFFQB5aAB8aQB96gEAeusBAHsAAAAAAAUVAHloAHxpAH3qAQB66wEAewMHAAYJAAgKlwQJAwcABgkACAqdBAkFFQCCAWgAhQFpAIYB6gEAgwHrAQCEAQAAAAAABRUAggFoAIUBaQCGAeoBAIMB6wEAhAEIBwAGCa8ECAqwBAkOAA8PAAoQAAUZABMbAA4IBwAGCbYECAq3BAkOAA8PAAoQAAUZABMbAA4DFQCLAWgAjAFpAI0BAAAAAxUAiwFoAIwBaQCNAQEIyQQHAQjPBAcDFQCSAWgAkwFpAJQBAAAAAxUAkgFoAJMBaQCUAQEH4QQGAQfnBAYDFQCZAWgAmgFpAJsBAAAAAxUAmQFoAJoBaQCbAQAAAxUAoAFoAKEBaQCiAQAAAAMVAKABaAChAWkAogEDB5IFBjwAAj2RBQIDB5kFBjwAAj2YBQIFFQCnAWgAqgFpAKsB6gEAqAHrAQCpAQAAAAAABRUApwFoAKoBaQCrAeoBAKgB6wEAqQEHEK0FBRirBQIZrAUTHgAGHwAGIAACIa4FCAcQtgUFGLQFAhm1BRMeAAYfAAYgAAIhtwUIAxUAsAFoALEBaQCyAQAAAAMVALABaACxAWkAsgECBwAGQgACAgcABkIAAgMVALcBaAC4AWkAuQEAAAADFQC3AWgAuAFpALkBAUMAMgFDADIDFQC-AWgAvwFpAMABAAAAAxUAvgFoAL8BaQDAAQIDAAJDADICAwACQwAyAxUAxQFoAMYBaQDHAQAAAAMVAMUBaADGAWkAxwEDBwAGCQAIGwAOAwcABgkACBsADgUVAMwBaADPAWkA0AHqAQDNAesBAM4BAAAAAAAFFQDMAWgAzwFpANAB6gEAzQHrAQDOAQUHAAYJAAgZABMbAA4dABgFBwAGCQAIGQATGwAOHQAYBRUA1QFoANgBaQDZAeoBANYB6wEA1wEAAAAAAAUVANUBaADYAWkA2QHqAQDWAesBANcBAQcABgEHAAYDFQDeAWgA3wFpAOABAAAAAxUA3gFoAN8BaQDgAQAAAxUA5QFoAOYBaQDnAQAAAAMVAOUBaADmAWkA5wEAAAMVAOwBaADtAWkA7gEAAAADFQDsAWgA7QFpAO4BAgcABgkACAIHAAYJAAgFFQDzAWgA9gFpAPcB6gEA9AHrAQD1AQAAAAAABRUA8wFoAPYBaQD3AeoBAPQB6wEA9QEFB5cHBgmYBwgoAA0pAAsrACIFB54HBgmfBwgoAA0pAAsrACIDFQD8AWgA_QFpAP4BAAAAAxUA_AFoAP0BaQD-AQMHsgcGCbMHCBuxBw4DB7oHBgm7BwgbuQcOAxUAgwJoAIQCaQCFAgAAAAMVAIMCaACEAmkAhQIEBwAGCc0HCBsADibOBx0EBwAGCdQHCBsADibVBx0FFQCKAmgAjQJpAI4C6gEAiwLrAQCMAgAAAAAABRUAigJoAI0CaQCOAuoBAIsC6wEAjAIAAAMVAJMCaACUAmkAlQIAAAADFQCTAmgAlAJpAJUCARcAAgEXAAIDFQCaAmgAmwJpAJwCAAAAAxUAmgJoAJsCaQCcAgQWABUXAAIYlwgCGZgIEwQWABUXAAIYnggCGZ8IEwMVAKECaACiAmkAowIAAAADFQChAmgAogJpAKMCAwMAAgcABgmxCAgDAwACBwAGCbcICAMVAKgCaACpAmkAqgIAAAADFQCoAmgAqQJpAKoCAgcABj7JCC4CBwAGPs8ILgUVAK8CaACyAmkAswLqAQCwAusBALECAAAAAAAFFQCvAmgAsgJpALMC6gEAsALrAQCxAgQHAAYJ4QgIEAAFKQALBAcABgnnCAgQAAUpAAsFFQC4AmgAuwJpALwC6gEAuQLrAQC6AgAAAAAABRUAuAJoALsCaQC8AuoBALkC6wEAugIGBwAGCfsICBD6CAUWACoY-QgCMwACBgcABgmDCQgQggkFFgAqGIEJAjMAAgMVAMECaADCAmkAwwIAAAADFQDBAmgAwgJpAMMCBAcABgmVCQgOAA8QAAUEBwAGCZsJCA4ADxAABQMVAMgCaADJAmkAygIAAAADFQDIAmgAyQJpAMoCBAcABgmtCQgSABEZABMEBwAGCbMJCBIAERkAEwMVAM8CaADQAmkA0QIAAAADFQDPAmgA0AJpANECBQcABgnFCQgOAA8PAAoQAAUFBwAGCcsJCA4ADw8AChAABQMVANYCaADXAmkA2AIAAAADFQDWAmgA1wJpANgCATMAAgEzAAIDFQDdAmgA3gJpAN8CAAAAAxUA3QJoAN4CaQDfAgMDAAIHAAYJAAgDAwACBwAGCQAIAxUA5AJoAOUCaQDmAgAAAAMVAOQCaADlAmkA5gJWAgFXwQIBWMICAVnDAgFaxAIBXMYCAV3IAjxeyQI9X8sCAWDNAjxhzgI-ZM8CAWXQAgFm0QI8atQCP2vVAkNs1gIkbdcCJG7YAiRv2QIkcNoCJHHcAiRy3gI8c98CRHThAiR14wI8duQCRXflAiR45gIkeecCPHrqAkZ76wJKfO0CAn3uAgJ-8AICf_ECAoAB8gICgQH0AgKCAfYCPIMB9wJLhAH5AgKFAfsCPIYB_AJMhwH9AgKIAf4CAokB_wI8igGCA02LAYMDUYwBhAMDjQGFAwOOAYYDA48BhwMDkAGIAwORAYoDA5IBjAM8kwGNA1KUAY8DA5UBkQM8lgGSA1OXAZMDA5gBlAMDmQGVAzyaAZgDVJsBmQNYnAGaAwSdAZsDBJ4BnAMEnwGdAwSgAZ4DBKEBoAMEogGiAzyjAaMDWaQBpQMEpQGnAzymAagDWqcBqQMEqAGqAwSpAasDPKoBrgNbqwGvA1-sAbEDYK0BsgNgrgG1A2CvAbYDYLABtwNgsQG5A2CyAbsDPLMBvANhtAG-A2C1AcADPLYBwQNitwHCA2C4AcMDYLkBxAM8ugHHA2O7AcgDZ7wByQM6vQHKAzq-AcsDOr8BzAM6wAHNAzrBAc8DOsIB0QM8wwHSA2jEAdQDOsUB1gM8xgHXA2nHAdgDOsgB2QM6yQHaAzzKAd0DassB3gNuzAHfAx3NAeADHc4B4QMdzwHiAx3QAeMDHdEB5QMd0gHnAzzTAegDb9QB6wMd1QHtAzzWAe4DcNcB8AMd2AHxAx3ZAfIDPNoB9QNx2wH2A3XcAfcDIt0B-AMi3gH5AyLfAfoDIuAB-wMi4QH9AyLiAf8DPOMBgAR25AGCBCLlAYQEPOYBhQR35wGGBCLoAYcEIukBiAQ87AGLBHjtAYwEfu4BjQQK7wGOBArwAY8ECvEBkAQK8gGRBArzAZMECvQBlQQ89QGWBH_2AZkECvcBmwQ8-AGcBIAB-QGeBAr6AZ8ECvsBoAQ8_AGjBIEB_QGkBIcB_gGlBAv_AaYEC4ACpwQLgQKoBAuCAqkEC4MCqwQLhAKtBDyFAq4EiAGGArIEC4cCtAQ8iAK1BIkBiQK4BAuKArkEC4sCugQ8jAK9BIoBjQK-BI4BjgK_BAiPAsAECJACwQQIkQLCBAiSAsMECJMCxQQIlALHBDyVAsgEjwGWAssECJcCzQQ8mALOBJABmQLQBAiaAtEECJsC0gQ8nALVBJEBnQLWBJUBngLXBAefAtgEB6AC2QQHoQLaBAeiAtsEB6MC3QQHpALfBDylAuAElgGmAuMEB6cC5QQ8qALmBJcBqQLoBAeqAukEB6sC6gQ8rALtBJgBrQLuBJwBrgLwBAavAvEEBrAC8wQGsQL0BAayAvUEBrMC9wQGtAL5BDy1AvoEnQG2AvwEBrcC_gQ8uAL_BJ4BuQKABQa6AoEFBrsCggU8vAKFBZ8BvQKGBaMBvgKHBS6_AogFLsACiQUuwQKKBS7CAosFLsMCjQUuxAKPBTzFApAFpAHGApQFLscClgU8yAKXBaUByQKaBS7KApsFLssCnAU8zAKfBaYBzQKgBawBzgKhBRrPAqIFGtACowUa0QKkBRrSAqUFGtMCpwUa1AKpBTzVAqoFrQHWArAFGtcCsgU82AKzBa4B2QK4BRraArkFGtsCugU83AK9Ba8B3QK-BbMB3gK_BTLfAsAFMuACwQUy4QLCBTLiAsMFMuMCxQUy5ALHBTzlAsgFtAHmAsoFMucCzAU86ALNBbUB6QLOBTLqAs8FMusC0AU87ALTBbYB7QLUBboB7gLVBTPvAtYFM_AC1wUz8QLYBTPyAtkFM_MC2wUz9ALdBTz1At4FuwH2AuAFM_cC4gU8-ALjBbwB-QLkBTP6AuUFM_sC5gU8_ALpBb0B_QLqBcEB_gLrBTT_AuwFNIAD7QU0gQPuBTSCA-8FNIMD8QU0hAPzBTyFA_QFwgGGA_YFNIcD-AU8iAP5BcMBiQP6BTSKA_sFNIsD_AU8jAP_BcQBjQOABsgBjgOBBhiPA4IGGJADgwYYkQOEBhiSA4UGGJMDhwYYlAOJBjyVA4oGyQGWA4wGGJcDjgY8mAOPBsoBmQOQBhiaA5EGGJsDkgY8nAOVBssBnQOWBtEBngOXBhefA5gGF6ADmQYXoQOaBheiA5sGF6MDnQYXpAOfBjylA6AG0gGmA6IGF6cDpAY8qAOlBtMBqQOmBheqA6cGF6sDqAY8rAOrBtQBrQOsBtoBrgOuBjGvA68GMbADsQYxsQOyBjGyA7MGMbMDtQYxtAO3Bjy1A7gG2wG2A7oGMbcDvAY8uAO9BtwBuQO-BjG6A78GMbsDwAY8vAPDBt0BvQPEBuEBvgPGBiq_A8cGKsADygYqwQPLBirCA8wGKsMDzgYqxAPQBjzFA9EG4gHGA9MGKscD1QY8yAPWBuMByQPXBirKA9gGKssD2QY8zAPcBuQBzQPdBugBzgPfBhXPA-AGFdAD4wYV0QPkBhXSA-UGFdMD5wYV1APpBjzVA-oG6QHWA-wGFdcD7gY82APvBuoB2QPwBhXaA_EGFdsD8gY83AP1BusB3QP2Bu8B3gP3BgnfA_gGCeAD-QYJ4QP6BgniA_sGCeMD_QYJ5AP_BjzlA4AH8AHmA4IHCecDhAc86AOFB_EB6QOGBwnqA4cHCesDiAc87AOLB_IB7QOMB_gB7gONBwzvA44HDPADjwcM8QOQBwzyA5EHDPMDkwcM9AOVBzz1A5YH-QH2A5oHDPcDnAc8-AOdB_oB-QOgBwz6A6EHDPsDogc8_AOlB_sB_QOmB_8B_gOnBw3_A6gHDYAEqQcNgQSqBw2CBKsHDYMErQcNhASvBzyFBLAHgAKGBLUHDYcEtwc8iAS4B4ECiQS8Bw2KBL0HDYsEvgc8jATBB4ICjQTCB4YCjgTDBw-PBMQHD5AExQcPkQTGBw-SBMcHD5MEyQcPlATLBzyVBMwHhwKWBNAHD5cE0gc8mATTB4gCmQTWBw-aBNcHD5sE2Ac8nATbB4kCnQTcB48CngTeBw6fBN8HDqAE4QcOoQTiBw6iBOMHDqME5QcOpATnBzylBOgHkAKmBOoHDqcE7Ac8qATtB5ECqQTuBw6qBO8HDqsE8Ac8rATzB5ICrQT0B5YCrgT2BzmvBPcHObAE-Qc5sQT6BzmyBPsHObME_Qc5tAT_Bzy1BIAIlwK2BIIIObcEhAg8uASFCJgCuQSGCDm6BIcIObsEiAg8vASLCJkCvQSMCJ0CvgSNCBS_BI4IFMAEjwgUwQSQCBTCBJEIFMMEkwgUxASVCDzFBJYIngLGBJoIFMcEnAg8yASdCJ8CyQSgCBTKBKEIFMsEogg8zASlCKACzQSmCKQCzgSnCBPPBKgIE9AEqQgT0QSqCBPSBKsIE9MErQgT1ASvCDzVBLAIpQLWBLMIE9cEtQg82AS2CKYC2QS4CBPaBLkIE9sEugg83AS9CKcC3QS-CKsC3gS_CC_fBMAIL-AEwQgv4QTCCC_iBMMIL-MExQgv5ATHCDzlBMgIrALmBMsIL-cEzQg86ATOCK0C6QTQCC_qBNEIL-sE0gg87ATVCK4C7QTWCLQC7gTXCCXvBNgIJfAE2Qgl8QTaCCXyBNsIJfME3Qgl9ATfCDz1BOAItQL2BOMIJfcE5Qg8-ATmCLYC-QToCCX6BOkIJfsE6gg8_ATtCLcC_QTuCL0C_gTvCCn_BPAIKYAF8QgpgQXyCCmCBfMIKYMF9QgphAX3CDyFBfgIvgKGBf0IKYcF_wg8iAWACb8CiQWECSmKBYUJKYsFhgk8jAWJCcACjQWKCcQCjgWLCRGPBYwJEZAFjQkRkQWOCRGSBY8JEZMFkQkRlAWTCTyVBZQJxQKWBZcJEZcFmQk8mAWaCcYCmQWcCRGaBZ0JEZsFngk8nAWhCccCnQWiCcsCngWjCRKfBaQJEqAFpQkSoQWmCRKiBacJEqMFqQkSpAWrCTylBawJzAKmBa8JEqcFsQk8qAWyCc0CqQW0CRKqBbUJEqsFtgk8rAW5Cc4CrQW6CdICrgW7CRCvBbwJELAFvQkQsQW-CRCyBb8JELMFwQkQtAXDCTy1BcQJ0wK2BccJELcFyQk8uAXKCdQCuQXMCRC6Bc0JELsFzgk8vAXRCdUCvQXSCdkCvgXUCTi_BdUJOMAF1wk4wQXYCTjCBdkJOMMF2wk4xAXdCTzFBd4J2gLGBeAJOMcF4gk8yAXjCdsCyQXkCTjKBeUJOMsF5gk8zAXpCdwCzQXqCeACzgXrCQXPBewJBdAF7QkF0QXuCQXSBe8JBdMF8QkF1AXzCTzVBfQJ4QLWBfYJBdcF-Ak82AX5CeIC2QX6CQXaBfsJBdsF_Ak83AX_CeMC3QWACucC"
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
    const teacherProfile = request.teacherProfile;
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
    throw createHttpError2(400, "Student profile is missing for this transfer request");
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
var AuthService = {
  registerUser,
  loginUser,
  getCurrentUserProfile,
  getAccountVerificationOtpStatus,
  resendAccountVerificationOtp,
  verifyAccountOtp,
  requestPasswordReset,
  resetPassword,
  changePassword
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
  changePassword: changePassword2
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
router3.post(
  "/password/forgot",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword
);
router3.post(
  "/password/reset",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);
router3.post(
  "/password/change",
  requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword
);
router3.get(
  "/access-status",
  requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  AuthController.getAccessStatus
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
    throw createHttpError6(
      400,
      "storeId, storePassword and baseUrl are required for SSLCommerz credential setup"
    );
  }
  let normalizedBaseUrl;
  try {
    normalizedBaseUrl = new URL(resolvedBaseUrl).toString().replace(/\/$/, "");
  } catch {
    throw createHttpError6(400, "baseUrl must be a valid URL");
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
  getSslCommerzCredential,
  upsertSslCommerzCredential,
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
  upsertSslCommerzCredentialSchema: z7.object({
    body: z7.object({
      storeId: z7.string("storeId must be a string").trim().min(2).max(120).optional(),
      storePassword: z7.string("storePassword must be a string").trim().min(4).max(200).optional(),
      baseUrl: z7.url("baseUrl must be a valid URL").trim().max(400).optional()
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
router6.get(
  "/payment-gateway/sslcommerz",
  requireAdminRole(),
  InstitutionAdminController.getSslCommerzCredential
);
router6.put(
  "/payment-gateway/sslcommerz",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.upsertSslCommerzCredentialSchema),
  InstitutionAdminController.upsertSslCommerzCredential
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
var DEFAULT_FRONTEND_BASE = "http://localhost:3000";
var SUBSCRIPTION_PAYMENT_STATUS_PENDING = "PENDING";
var SUBSCRIPTION_PAYMENT_STATUS_PAID = "PAID";
var SUBSCRIPTION_PAYMENT_STATUS_FAILED = "FAILED";
var SUBSCRIPTION_PAYMENT_STATUS_CANCELLED = "CANCELLED";
var INSTITUTION_SUBSCRIPTION_STATUS_ACTIVE = "ACTIVE";
var SUBSCRIPTION_PLAN_CONFIG = {
  MONTHLY: { months: 1, amount: 500, originalAmount: 500, label: "Monthly" },
  HALF_YEARLY: { months: 6, amount: 2800, originalAmount: 3e3, label: "Half Yearly" },
  YEARLY: { months: 12, amount: 5600, originalAmount: 6e3, label: "Yearly" }
};
function getFrontendBaseUrl() {
  const raw2 = process.env.FRONTEND_PUBLIC_URL?.trim() || process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() || DEFAULT_FRONTEND_BASE;
  return raw2.replace(/\/$/, "");
}
function getBackendBaseUrl() {
  const raw2 = process.env.BACKEND_PUBLIC_URL?.trim() || process.env.BASE_URL?.trim();
  if (!raw2) {
    throw createHttpError7(
      500,
      "Backend public URL is not configured. Set BACKEND_PUBLIC_URL in environment."
    );
  }
  return raw2.replace(/\/$/, "");
}
function getSslCommerzBaseUrl() {
  const envBaseUrl = process.env.SSLCOMMERZ_BASE_URL?.trim().replace(/\/$/, "");
  return envBaseUrl || "https://sandbox.sslcommerz.com";
}
function getSslCommerzCredentials() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePassword) {
    throw createHttpError7(
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
function buildSubscriptionRedirectUrl(status, tranId) {
  const frontendBase = getFrontendBaseUrl();
  const searchParams = new URLSearchParams({
    subscriptionPaymentStatus: status
  });
  if (tranId) {
    searchParams.set("tranId", tranId);
  }
  return `${frontendBase}/?${searchParams.toString()}`;
}
function toSafeUpper(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized ? normalized.toUpperCase() : fallback;
}
function readQueryValue4(value) {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : void 0;
  }
  return typeof value === "string" ? value : void 0;
}
function normalizeCallbackQuery(query) {
  return {
    tran_id: readQueryValue4(query.tran_id),
    val_id: readQueryValue4(query.val_id),
    status: readQueryValue4(query.status),
    bank_tran_id: readQueryValue4(query.bank_tran_id),
    card_type: readQueryValue4(query.card_type)
  };
}
function addMonths(value, months) {
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
  return Object.entries(SUBSCRIPTION_PLAN_CONFIG).map(([plan, config2]) => ({
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
    throw createHttpError7(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError7(400, "Only pending applications can receive subscription payments");
  }
  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID) {
    throw createHttpError7(400, "Subscription payment already completed for this application");
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
    throw createHttpError7(404, "User not found");
  }
  const selectedPlan = SUBSCRIPTION_PLAN_CONFIG[payload.plan];
  const amount = toMoneyNumber2(selectedPlan.amount);
  const currency = "BDT";
  const backendBaseUrl = getBackendBaseUrl();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl();
  const { storeId, storePassword } = getSslCommerzCredentials();
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
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PENDING,
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
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        subscriptionGatewayStatus: gatewayResponse?.status ?? "FAILED",
        subscriptionGatewayRawPayload: gatewayResponse ?? { httpStatus: response.status }
      }
    });
    const failureMessage = gatewayResponse?.failedreason?.trim() || gatewayResponse?.status?.trim() || "Unable to initialize SSLCommerz payment session";
    throw createHttpError7(502, failureMessage);
  }
  await prisma.institutionApplication.update({
    where: {
      id: application.id
    },
    data: {
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PENDING,
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
  const query = normalizeCallbackQuery(rawQuery);
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
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      await prisma.institutionApplication.update({
        where: {
          id: application.id
        },
        data: {
          subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_CANCELLED,
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
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      await prisma.institutionApplication.update({
        where: {
          id: application.id
        },
        data: {
          subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
          subscriptionGatewayStatus: query.status || "FAILED",
          subscriptionGatewayRawPayload: rawQuery
        }
      });
    }
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId)
    };
  }
  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID) {
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
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        subscriptionGatewayStatus: query.status || "FAILED",
        subscriptionGatewayRawPayload: rawQuery
      }
    });
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId)
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
  const isValidTransaction = validationData?.tran_id === application.subscriptionTranId;
  const isValidAmount = areMoneyValuesEqual(validationData?.amount, application.subscriptionAmount);
  const isValidCurrency = toSafeUpper(validationData?.currency_type, application.subscriptionCurrency) === toSafeUpper(application.subscriptionCurrency, "BDT");
  if (!validationResponse.ok || !isValidStatus || !isValidTransaction || !isValidAmount || !isValidCurrency) {
    await prisma.institutionApplication.update({
      where: {
        id: application.id
      },
      data: {
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
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
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PAID,
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
    const amount = toMoneyNumber2(payment.amount);
    if (existing) {
      existing.totalAmount = toMoneyNumber2(existing.totalAmount + amount);
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
      amount: toMoneyNumber2(payment.amount),
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
    throw createHttpError7(403, "Only institution admins can view institution payment details");
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
  if (payload.status === InstitutionApplicationStatus.APPROVED) {
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      throw createHttpError7(400, "Subscription payment is pending for this application");
    }
    if (!application.subscriptionPlan || !application.subscriptionMonths || !application.subscriptionAmount) {
      throw createHttpError7(400, "Subscription metadata is missing for this application");
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
    const subscriptionEndsAt = addMonths(subscriptionStartsAt, application.subscriptionMonths ?? 1);
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
  }),
  initiateSubscriptionPaymentSchema: z8.object({
    body: z8.object({
      plan: z8.enum(["MONTHLY", "HALF_YEARLY", "YEARLY"])
    })
  }),
  paymentCallbackQuerySchema: z8.object({
    query: z8.object({
      tran_id: z8.string().trim().min(1),
      val_id: z8.string().trim().optional(),
      status: z8.string().trim().optional(),
      bank_tran_id: z8.string().trim().optional(),
      card_type: z8.string().trim().optional()
    })
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
router7.get(
  "/pricing",
  InstitutionApplicationController.getSubscriptionPricing
);
router7.post(
  "/admin/:applicationId/subscription/initiate",
  requireAdminRole(),
  validateRequest(InstitutionApplicationValidation.initiateSubscriptionPaymentSchema),
  InstitutionApplicationController.initiateSubscriptionPayment
);
router7.get(
  "/admin/subscription/payment/success",
  InstitutionApplicationController.handleSubscriptionPaymentSuccessRedirect
);
router7.get(
  "/admin/subscription/payment/fail",
  InstitutionApplicationController.handleSubscriptionPaymentFailureRedirect
);
router7.get(
  "/admin/subscription/payment/cancel",
  InstitutionApplicationController.handleSubscriptionPaymentCancelRedirect
);
router7.post(
  "/admin/subscription/payment/success",
  InstitutionApplicationController.handleSubscriptionPaymentSuccessRedirect
);
router7.post(
  "/admin/subscription/payment/fail",
  InstitutionApplicationController.handleSubscriptionPaymentFailureRedirect
);
router7.post(
  "/admin/subscription/payment/cancel",
  InstitutionApplicationController.handleSubscriptionPaymentCancelRedirect
);
router7.get(
  "/superadmin/fee-payments",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.listInstitutionStudentPaymentsForSuperAdmin
);
router7.get(
  "/admin/fee-payments",
  requireAdminRole(),
  InstitutionApplicationController.listInstitutionStudentPaymentsForAdmin
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
var readQueryValue5 = (value) => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : void 0;
  }
  return typeof value === "string" ? value : void 0;
};
var listNotices2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await NoticeService.listNotices(user.id, {
    search: readQueryValue5(req.query.search)
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
var toPostingUpdateData = (payload) => ({
  title: payload.title?.trim(),
  location: payload.location?.trim() || void 0,
  summary: payload.summary?.trim(),
  details: payload.details?.map((item) => item.trim()).filter(Boolean)
});
var listTeacherJobPostsManaged = async (userId, search) => {
  const context = await resolveAdminContext(userId);
  const normalizedSearch = normalizeSearch5(search);
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
  const normalizedSearch = normalizeSearch5(search);
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
    throw createHttpError9(404, "Teacher job post not found");
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
    throw createHttpError9(404, "Student admission post not found");
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
    throw createHttpError9(404, "Teacher job post not found");
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
    throw createHttpError9(404, "Student admission post not found");
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
  getPostingOptions,
  listTeacherJobPostsManaged,
  listStudentAdmissionPostsManaged,
  updateTeacherJobPost,
  updateStudentAdmissionPost,
  deleteTeacherJobPost,
  deleteStudentAdmissionPost
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
var readQueryValue6 = (value) => {
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
  const result = await PostingService.getPostingOptions(user.id, readQueryValue6(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Posting options fetched successfully",
    data: result
  });
});
var listTeacherJobPostsManaged2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.listTeacherJobPostsManaged(user.id, readQueryValue6(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Managed teacher job posts fetched successfully",
    data: result
  });
});
var listStudentAdmissionPostsManaged2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await PostingService.listStudentAdmissionPostsManaged(user.id, readQueryValue6(req.query.search));
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
  listTeacherJobPostsManaged: listTeacherJobPostsManaged2,
  listStudentAdmissionPostsManaged: listStudentAdmissionPostsManaged2,
  updateTeacherJobPost: updateTeacherJobPost2,
  updateStudentAdmissionPost: updateStudentAdmissionPost2,
  deleteTeacherJobPost: deleteTeacherJobPost2,
  deleteStudentAdmissionPost: deleteStudentAdmissionPost2
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
var updatePostingSchema = z10.object({
  params: z10.object({
    postingId: uuidSchema4
  }),
  body: z10.object({
    title: z10.string("Title must be a string").trim().min(2).max(150).optional(),
    location: z10.string("Location must be a string").trim().min(2).max(150).optional(),
    summary: z10.string("Summary must be a string").trim().min(10).max(600).optional(),
    details: z10.array(z10.string("Detail must be a string").trim().min(2).max(300)).max(20).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var postingIdParamSchema = z10.object({
  params: z10.object({
    postingId: uuidSchema4
  })
});
var listManagedPostingSchema = z10.object({
  query: z10.object({
    search: z10.string("search must be a string").trim().max(120).optional()
  })
});
var listPublicPostingSchema = z10.object({
  query: z10.object({
    limit: z10.string("limit must be a number").regex(/^\d+$/, "limit must be a positive integer").optional()
  })
});
var PostingValidation = {
  createPostingSchema,
  updatePostingSchema,
  postingIdParamSchema,
  listPublicPostingSchema,
  listManagedPostingSchema
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
router9.get(
  "/teacher/manage",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.listManagedPostingSchema),
  PostingController.listTeacherJobPostsManaged
);
router9.get(
  "/student/manage",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.listManagedPostingSchema),
  PostingController.listStudentAdmissionPostsManaged
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
router9.patch(
  "/teacher/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.updatePostingSchema),
  PostingController.updateTeacherJobPost
);
router9.patch(
  "/student/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.updatePostingSchema),
  PostingController.updateStudentAdmissionPost
);
router9.delete(
  "/teacher/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.postingIdParamSchema),
  PostingController.deleteTeacherJobPost
);
router9.delete(
  "/student/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.postingIdParamSchema),
  PostingController.deleteStudentAdmissionPost
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
function toMoneyNumber3(value) {
  const numericValue = Number(value ?? 0);
  return Number(numericValue.toFixed(2));
}
function toSafeUpper2(value, fallbackValue) {
  const normalized = value?.trim().toUpperCase();
  return normalized || fallbackValue;
}
function areMoneyValuesEqual2(left, right) {
  return Math.abs(toMoneyNumber3(left) - toMoneyNumber3(right)) < 0.01;
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
    throw createHttpError11(
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
function normalizeCallbackQuery2(query) {
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
      toMoneyNumber3((paidBySemester.get(payment.semesterId) ?? 0) + toMoneyNumber3(payment.amount))
    );
  }
  const feeItems = feeConfigurations.map((configuration) => {
    const totalFeeAmount = toMoneyNumber3(configuration.totalFeeAmount);
    const monthlyFeeAmount = toMoneyNumber3(configuration.monthlyFeeAmount);
    const paidAmount = toMoneyNumber3(paidBySemester.get(configuration.semesterId) ?? 0);
    const dueAmount = Math.max(0, toMoneyNumber3(totalFeeAmount - paidAmount));
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
      totalConfiguredAmount: toMoneyNumber3(totalConfiguredAmount),
      totalPaidAmount: toMoneyNumber3(totalPaidAmount),
      totalDueAmount: toMoneyNumber3(Math.max(0, totalConfiguredAmount - totalPaidAmount))
    },
    feeItems,
    paymentHistory: successfulPayments.map((payment) => ({
      ...payment,
      amount: toMoneyNumber3(payment.amount)
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
  const totalFeeAmount = toMoneyNumber3(feeConfiguration.totalFeeAmount);
  const monthlyFeeAmount = toMoneyNumber3(feeConfiguration.monthlyFeeAmount);
  const paidAmount = toMoneyNumber3(
    successfulPayments.reduce((sum, item) => sum + toMoneyNumber3(item.amount), 0)
  );
  const dueAmount = toMoneyNumber3(Math.max(0, totalFeeAmount - paidAmount));
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
    requestedAmount = toMoneyNumber3(Math.min(dueAmount, monthlyFeeAmount * monthsCount));
    monthsCovered = monthsCount;
  } else {
    monthsCovered = Math.max(1, Math.ceil(dueAmount / Math.max(monthlyFeeAmount, 1)));
  }
  if (requestedAmount <= 0) {
    throw createHttpError11(400, "Invalid payment amount");
  }
  const transactionId = createTransactionId();
  const backendBaseUrl = getBackendPublicUrl();
  const { storeId, storePassword, baseUrl: sslCommerzBaseUrl } = await resolveSslCommerzConfigForInstitution(profile.institutionId);
  const currency = toSafeUpper2(feeConfiguration.currency, "BDT");
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
  const query = normalizeCallbackQuery2(rawQuery);
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
  const isValidAmount = areMoneyValuesEqual2(validationData?.amount, payment.amount);
  const isValidCurrency = toSafeUpper2(validationData?.currency_type, payment.currency) === toSafeUpper2(payment.currency, "BDT");
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
  const alreadyPaidAmount = toMoneyNumber3(
    successfulSemesterPayments.reduce(
      (sum, item) => sum + toMoneyNumber3(item.amount),
      0
    )
  );
  const currentAmount = toMoneyNumber3(payment.amount);
  const totalFeeAmount = toMoneyNumber3(payment.feeConfiguration.totalFeeAmount);
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
var readQueryValue7 = (value) => {
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
  const search = readQueryValue7(req.query.search);
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
  const search = readQueryValue7(req.query.search);
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
  const search = readQueryValue7(req.query.search);
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
var readParam7 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue8 = (value) => {
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
    readQueryValue8(req.query.search)
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
  const search = readQueryValue8(req.query.search);
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
var isPaymentGatewayCallbackPath = (path3) => path3.startsWith("/api/v1/student/fees/payment/") || path3.startsWith("/api/v1/institution-applications/admin/subscription/payment/");
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
