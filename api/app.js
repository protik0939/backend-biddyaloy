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
  "inlineSchema": 'model AdminDepartmentWorkspaceSelection {\n  id            String      @id @default(uuid())\n  userId        String\n  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)\n  departmentId  String\n  department    Department  @relation(fields: [departmentId], references: [id], onDelete: Cascade)\n  createdAt     DateTime    @default(now())\n  updatedAt     DateTime    @updatedAt\n\n  @@unique([userId, institutionId])\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("admin_department_workspace_selections")\n}\n\nmodel AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                              @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                             @default(false)\n  image                                String?\n  createdAt                            DateTime                            @default(now())\n  updatedAt                            DateTime                            @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]            @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]            @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]             @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]             @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[]       @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[]       @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n  requestedTransferRequests            InstitutionTransferRequest[]        @relation("TransferRequestRequesterUser")\n  reviewedTransferRequests             InstitutionTransferRequest[]        @relation("TransferRequestReviewerUser")\n  requestedInstitutionLeaveRequests    InstitutionLeaveRequest[]           @relation("InstitutionLeaveRequestRequester")\n  reviewedInstitutionLeaveRequests     InstitutionLeaveRequest[]           @relation("InstitutionLeaveRequestReviewer")\n  sentNotices                          Notice[]                            @relation("NoticeSenderUser")\n  readNotices                          NoticeRead[]\n  adminDepartmentWorkspaceSelections   AdminDepartmentWorkspaceSelection[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                           Program[]\n  batches                            Batch[]\n  courses                            Course[]\n  sections                           Section[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  transferRequestsAsTargetDepartment InstitutionTransferRequest[]\n  adminDepartmentWorkspaceSelections AdminDepartmentWorkspaceSelection[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum InstitutionSubscriptionPlan {\n  MONTHLY\n  HALF_YEARLY\n  YEARLY\n}\n\nenum InstitutionSubscriptionPaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionSubscriptionStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionTransferEntityType {\n  STUDENT\n  TEACHER\n}\n\nenum InstitutionTransferStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  CANCELLED\n}\n\nenum InstitutionLeaveRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum NoticeAudienceRole {\n  ADMIN\n  FACULTY\n  DEPARTMENT\n  TEACHER\n  STUDENT\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                                 String                                  @id @default(uuid())\n  name                               String\n  description                        String?\n  shortName                          String?\n  type                               InstitutionType?\n  institutionLogo                    String?\n  createdAt                          DateTime                                @default(now())\n  updatedAt                          DateTime                                @updatedAt\n  faculties                          Faculty[]\n  programs                           Program[]\n  batches                            Batch[]\n  classrooms                         ClassRoom[]\n  sections                           Section[]\n  courses                            Course[]\n  adminProfile                       AdminProfile[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  institutionApplications            InstitutionApplication[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  paymentGatewayCredential           InstitutionPaymentGatewayCredential?\n  renewalPayments                    InstitutionSubscriptionRenewalPayment[]\n  subscriptions                      InstitutionSubscription[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  notices                            Notice[]\n  leaveRequests                      InstitutionLeaveRequest[]\n  sourceTransferRequests             InstitutionTransferRequest[]            @relation("TransferRequestSourceInstitution")\n  targetTransferRequests             InstitutionTransferRequest[]            @relation("TransferRequestTargetInstitution")\n  adminDepartmentWorkspaceSelections AdminDepartmentWorkspaceSelection[]\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  subscriptionPlan              InstitutionSubscriptionPlan?\n  subscriptionAmount            Decimal?                             @db.Decimal(12, 2)\n  subscriptionCurrency          String                               @default("BDT")\n  subscriptionMonths            Int?\n  subscriptionPaymentStatus     InstitutionSubscriptionPaymentStatus @default(PENDING)\n  subscriptionTranId            String?                              @unique\n  subscriptionGatewayStatus     String?\n  subscriptionGatewaySessionKey String?                              @unique\n  subscriptionGatewayValId      String?\n  subscriptionGatewayBankTranId String?\n  subscriptionGatewayCardType   String?\n  subscriptionGatewayRawPayload Json?\n  subscriptionPaidAt            DateTime?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution?              @relation(fields: [institutionId], references: [id])\n  subscriptions InstitutionSubscription[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel InstitutionLeaveRequest {\n  id String @id @default(uuid())\n\n  requesterUserId String\n  requesterUser   User   @relation("InstitutionLeaveRequestRequester", fields: [requesterUserId], references: [id])\n\n  requesterRole UserRole\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  status InstitutionLeaveRequestStatus @default(PENDING)\n  reason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionLeaveRequestReviewer", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([requesterUserId, status])\n  @@index([institutionId, status])\n  @@map("institution_leave_requests")\n}\n\nmodel InstitutionTransferRequest {\n  id String @id @default(uuid())\n\n  entityType InstitutionTransferEntityType\n  status     InstitutionTransferStatus     @default(PENDING)\n\n  sourceInstitutionId String\n  sourceInstitution   Institution @relation("TransferRequestSourceInstitution", fields: [sourceInstitutionId], references: [id])\n\n  targetInstitutionId String\n  targetInstitution   Institution @relation("TransferRequestTargetInstitution", fields: [targetInstitutionId], references: [id])\n\n  requesterUserId String\n  requesterUser   User   @relation("TransferRequestRequesterUser", fields: [requesterUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TransferRequestReviewerUser", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  targetDepartmentId String?\n  targetDepartment   Department? @relation(fields: [targetDepartmentId], references: [id])\n\n  requestMessage  String?\n  responseMessage String?\n\n  requestedAt DateTime  @default(now())\n  reviewedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceInstitutionId, status])\n  @@index([targetInstitutionId, status])\n  @@index([requesterUserId])\n  @@index([studentProfileId])\n  @@index([teacherProfileId])\n  @@map("institution_transfer_requests")\n}\n\nmodel Notice {\n  id      String @id @default(uuid())\n  title   String\n  content String\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  senderUserId String\n  senderUser   User               @relation("NoticeSenderUser", fields: [senderUserId], references: [id])\n  senderRole   NoticeAudienceRole\n\n  recipients NoticeRecipientRole[]\n  reads      NoticeRead[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, createdAt])\n  @@index([senderUserId, createdAt])\n  @@map("notices")\n}\n\nmodel NoticeRecipientRole {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  role NoticeAudienceRole\n\n  createdAt DateTime @default(now())\n\n  @@unique([noticeId, role])\n  @@index([role])\n  @@map("notice_recipient_roles")\n}\n\nmodel NoticeRead {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  readAt DateTime @default(now())\n\n  @@unique([noticeId, userId])\n  @@index([userId, readAt])\n  @@map("notice_reads")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel InstitutionPaymentGatewayCredential {\n  id                               String      @id @default(uuid())\n  institutionId                    String      @unique\n  institution                      Institution @relation(fields: [institutionId], references: [id])\n  sslCommerzStoreIdEncrypted       String\n  sslCommerzStorePasswordEncrypted String\n  sslCommerzBaseUrlEncrypted       String\n  sslCommerzStoreIdHash            String\n  sslCommerzStorePasswordHash      String\n  sslCommerzBaseUrlHash            String\n  isActive                         Boolean     @default(true)\n  lastUpdatedByUserId              String?\n  createdAt                        DateTime    @default(now())\n  updatedAt                        DateTime    @updatedAt\n\n  @@index([institutionId, isActive])\n  @@map("institution_payment_gateway_credentials")\n}\n\nmodel InstitutionSubscriptionRenewalPayment {\n  id                String                               @id @default(uuid())\n  institutionId     String\n  institution       Institution                          @relation(fields: [institutionId], references: [id])\n  initiatedByUserId String\n  plan              InstitutionSubscriptionPlan\n  amount            Decimal                              @db.Decimal(12, 2)\n  currency          String                               @default("BDT")\n  monthsCovered     Int\n  status            InstitutionSubscriptionPaymentStatus @default(PENDING)\n  tranId            String                               @unique\n  gatewayStatus     String?\n  gatewaySessionKey String?                              @unique\n  gatewayValId      String?\n  gatewayBankTranId String?\n  gatewayCardType   String?\n  gatewayRawPayload Json?\n  paidAt            DateTime?\n  createdAt         DateTime                             @default(now())\n  updatedAt         DateTime                             @updatedAt\n\n  @@index([institutionId, status, createdAt])\n  @@index([initiatedByUserId, status])\n  @@map("institution_subscription_renewal_payments")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  semesterId String?\n  semester   Semester? @relation(fields: [semesterId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  startTime String\n  endTime   String\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@index([semesterId])\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  schedules           Schedule[]\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n  transferRequests      InstitutionTransferRequest[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel InstitutionSubscription {\n  id String @id @default(uuid())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  sourceApplicationId String?\n  sourceApplication   InstitutionApplication? @relation(fields: [sourceApplicationId], references: [id])\n\n  plan          InstitutionSubscriptionPlan\n  status        InstitutionSubscriptionStatus @default(ACTIVE)\n  amount        Decimal                       @db.Decimal(12, 2)\n  currency      String                        @default("BDT")\n  monthsCovered Int\n  startsAt      DateTime\n  endsAt        DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, status, endsAt])\n  @@index([sourceApplicationId])\n  @@map("institution_subscriptions")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n  transferRequests          InstitutionTransferRequest[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminDepartmentWorkspaceSelection":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminDepartmentWorkspaceSelectionToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminDepartmentWorkspaceSelectionToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"AdminDepartmentWorkspaceSelectionToDepartment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_department_workspace_selections"},"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"requestedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestRequesterUser"},{"name":"reviewedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestReviewerUser"},{"name":"requestedInstitutionLeaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionLeaveRequestRequester"},{"name":"reviewedInstitutionLeaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionLeaveRequestReviewer"},{"name":"sentNotices","kind":"object","type":"Notice","relationName":"NoticeSenderUser"},{"name":"readNotices","kind":"object","type":"NoticeRead","relationName":"NoticeReadToUser"},{"name":"adminDepartmentWorkspaceSelections","kind":"object","type":"AdminDepartmentWorkspaceSelection","relationName":"AdminDepartmentWorkspaceSelectionToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentToStudentFeePayment"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"DepartmentToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"DepartmentToRoutine"},{"name":"transferRequestsAsTargetDepartment","kind":"object","type":"InstitutionTransferRequest","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"adminDepartmentWorkspaceSelections","kind":"object","type":"AdminDepartmentWorkspaceSelection","relationName":"AdminDepartmentWorkspaceSelectionToDepartment"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"InstitutionToStudentFeePayment"},{"name":"paymentGatewayCredential","kind":"object","type":"InstitutionPaymentGatewayCredential","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"renewalPayments","kind":"object","type":"InstitutionSubscriptionRenewalPayment","relationName":"InstitutionToInstitutionSubscriptionRenewalPayment"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionToInstitutionSubscription"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"InstitutionToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"InstitutionToRoutine"},{"name":"notices","kind":"object","type":"Notice","relationName":"InstitutionToNotice"},{"name":"leaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionToInstitutionLeaveRequest"},{"name":"sourceTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestSourceInstitution"},{"name":"targetTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestTargetInstitution"},{"name":"adminDepartmentWorkspaceSelections","kind":"object","type":"AdminDepartmentWorkspaceSelection","relationName":"AdminDepartmentWorkspaceSelectionToInstitution"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"subscriptionPlan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"subscriptionAmount","kind":"scalar","type":"Decimal"},{"name":"subscriptionCurrency","kind":"scalar","type":"String"},{"name":"subscriptionMonths","kind":"scalar","type":"Int"},{"name":"subscriptionPaymentStatus","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"subscriptionTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayStatus","kind":"scalar","type":"String"},{"name":"subscriptionGatewaySessionKey","kind":"scalar","type":"String"},{"name":"subscriptionGatewayValId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayBankTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayCardType","kind":"scalar","type":"String"},{"name":"subscriptionGatewayRawPayload","kind":"scalar","type":"Json"},{"name":"subscriptionPaidAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"InstitutionLeaveRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"InstitutionLeaveRequestRequester"},{"name":"requesterRole","kind":"enum","type":"UserRole"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionLeaveRequest"},{"name":"status","kind":"enum","type":"InstitutionLeaveRequestStatus"},{"name":"reason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionLeaveRequestReviewer"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_leave_requests"},"InstitutionTransferRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"entityType","kind":"enum","type":"InstitutionTransferEntityType"},{"name":"status","kind":"enum","type":"InstitutionTransferStatus"},{"name":"sourceInstitutionId","kind":"scalar","type":"String"},{"name":"sourceInstitution","kind":"object","type":"Institution","relationName":"TransferRequestSourceInstitution"},{"name":"targetInstitutionId","kind":"scalar","type":"String"},{"name":"targetInstitution","kind":"object","type":"Institution","relationName":"TransferRequestTargetInstitution"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"TransferRequestRequesterUser"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TransferRequestReviewerUser"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"targetDepartmentId","kind":"scalar","type":"String"},{"name":"targetDepartment","kind":"object","type":"Department","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"requestMessage","kind":"scalar","type":"String"},{"name":"responseMessage","kind":"scalar","type":"String"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_transfer_requests"},"Notice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToNotice"},{"name":"senderUserId","kind":"scalar","type":"String"},{"name":"senderUser","kind":"object","type":"User","relationName":"NoticeSenderUser"},{"name":"senderRole","kind":"enum","type":"NoticeAudienceRole"},{"name":"recipients","kind":"object","type":"NoticeRecipientRole","relationName":"NoticeToNoticeRecipientRole"},{"name":"reads","kind":"object","type":"NoticeRead","relationName":"NoticeToNoticeRead"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notices"},"NoticeRecipientRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRecipientRole"},{"name":"role","kind":"enum","type":"NoticeAudienceRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_recipient_roles"},"NoticeRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRead"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NoticeReadToUser"},{"name":"readAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_reads"},"DepartmentSemesterFeeConfiguration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"totalFeeAmount","kind":"scalar","type":"Decimal"},{"name":"monthlyFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"}],"dbName":"department_semester_fee_configurations"},"StudentFeePayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentFeePayment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentFeePayment"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SemesterToStudentFeePayment"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentFeePaymentToStudentProfile"},{"name":"feeConfigurationId","kind":"scalar","type":"String"},{"name":"feeConfiguration","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"},{"name":"paymentMode","kind":"enum","type":"StudentFeePaymentMode"},{"name":"status","kind":"enum","type":"StudentFeePaymentStatus"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paymentInitiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_fee_payments"},"InstitutionPaymentGatewayCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"sslCommerzStoreIdEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStoreIdHash","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordHash","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlHash","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"lastUpdatedByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_payment_gateway_credentials"},"InstitutionSubscriptionRenewalPayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscriptionRenewalPayment"},{"name":"initiatedByUserId","kind":"scalar","type":"String"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscription_renewal_payments"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToRoutine"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"ScheduleToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSchedule"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSchedule"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"ScheduleToSemester"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"SemesterToStudentFeePayment"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"StudentFeePaymentToStudentProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"InstitutionSubscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscription"},{"name":"sourceApplicationId","kind":"scalar","type":"String"},{"name":"sourceApplication","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"endsAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscriptions"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","institution","faculty","department","program","routine","schedules","courseRegistrations","section","course","sectionTeacherAssignments","teacherProfile","classwork","classworkSubmissions","applications","_count","posting","studentUser","reviewerUser","studentProfile","admissionApplications","semester","feePayments","feeConfiguration","sourceInstitution","targetInstitution","requesterUser","targetDepartment","transferRequests","submissions","classworks","teacherUser","jobApplications","courseRegistration","marks","sections","batch","feeConfigurations","schedule","routines","classRoom","attendances","mark","programs","batches","courses","teacherProfiles","studentProfiles","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","transferRequestsAsTargetDepartment","adminDepartmentWorkspaceSelections","departments","faculties","classrooms","adminProfile","applicantUser","reviewedByUser","sourceApplication","subscriptions","institutionApplications","paymentGatewayCredential","renewalPayments","senderUser","notice","recipients","reads","notices","leaveRequests","sourceTransferRequests","targetTransferRequests","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","requestedTransferRequests","reviewedTransferRequests","requestedInstitutionLeaveRequests","reviewedInstitutionLeaveRequests","sentNotices","readNotices","AdminDepartmentWorkspaceSelection.findUnique","AdminDepartmentWorkspaceSelection.findUniqueOrThrow","AdminDepartmentWorkspaceSelection.findFirst","AdminDepartmentWorkspaceSelection.findFirstOrThrow","AdminDepartmentWorkspaceSelection.findMany","data","AdminDepartmentWorkspaceSelection.createOne","AdminDepartmentWorkspaceSelection.createMany","AdminDepartmentWorkspaceSelection.createManyAndReturn","AdminDepartmentWorkspaceSelection.updateOne","AdminDepartmentWorkspaceSelection.updateMany","AdminDepartmentWorkspaceSelection.updateManyAndReturn","create","update","AdminDepartmentWorkspaceSelection.upsertOne","AdminDepartmentWorkspaceSelection.deleteOne","AdminDepartmentWorkspaceSelection.deleteMany","having","_min","_max","AdminDepartmentWorkspaceSelection.groupBy","AdminDepartmentWorkspaceSelection.aggregate","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","InstitutionLeaveRequest.findUnique","InstitutionLeaveRequest.findUniqueOrThrow","InstitutionLeaveRequest.findFirst","InstitutionLeaveRequest.findFirstOrThrow","InstitutionLeaveRequest.findMany","InstitutionLeaveRequest.createOne","InstitutionLeaveRequest.createMany","InstitutionLeaveRequest.createManyAndReturn","InstitutionLeaveRequest.updateOne","InstitutionLeaveRequest.updateMany","InstitutionLeaveRequest.updateManyAndReturn","InstitutionLeaveRequest.upsertOne","InstitutionLeaveRequest.deleteOne","InstitutionLeaveRequest.deleteMany","InstitutionLeaveRequest.groupBy","InstitutionLeaveRequest.aggregate","InstitutionTransferRequest.findUnique","InstitutionTransferRequest.findUniqueOrThrow","InstitutionTransferRequest.findFirst","InstitutionTransferRequest.findFirstOrThrow","InstitutionTransferRequest.findMany","InstitutionTransferRequest.createOne","InstitutionTransferRequest.createMany","InstitutionTransferRequest.createManyAndReturn","InstitutionTransferRequest.updateOne","InstitutionTransferRequest.updateMany","InstitutionTransferRequest.updateManyAndReturn","InstitutionTransferRequest.upsertOne","InstitutionTransferRequest.deleteOne","InstitutionTransferRequest.deleteMany","InstitutionTransferRequest.groupBy","InstitutionTransferRequest.aggregate","Notice.findUnique","Notice.findUniqueOrThrow","Notice.findFirst","Notice.findFirstOrThrow","Notice.findMany","Notice.createOne","Notice.createMany","Notice.createManyAndReturn","Notice.updateOne","Notice.updateMany","Notice.updateManyAndReturn","Notice.upsertOne","Notice.deleteOne","Notice.deleteMany","Notice.groupBy","Notice.aggregate","NoticeRecipientRole.findUnique","NoticeRecipientRole.findUniqueOrThrow","NoticeRecipientRole.findFirst","NoticeRecipientRole.findFirstOrThrow","NoticeRecipientRole.findMany","NoticeRecipientRole.createOne","NoticeRecipientRole.createMany","NoticeRecipientRole.createManyAndReturn","NoticeRecipientRole.updateOne","NoticeRecipientRole.updateMany","NoticeRecipientRole.updateManyAndReturn","NoticeRecipientRole.upsertOne","NoticeRecipientRole.deleteOne","NoticeRecipientRole.deleteMany","NoticeRecipientRole.groupBy","NoticeRecipientRole.aggregate","NoticeRead.findUnique","NoticeRead.findUniqueOrThrow","NoticeRead.findFirst","NoticeRead.findFirstOrThrow","NoticeRead.findMany","NoticeRead.createOne","NoticeRead.createMany","NoticeRead.createManyAndReturn","NoticeRead.updateOne","NoticeRead.updateMany","NoticeRead.updateManyAndReturn","NoticeRead.upsertOne","NoticeRead.deleteOne","NoticeRead.deleteMany","NoticeRead.groupBy","NoticeRead.aggregate","DepartmentSemesterFeeConfiguration.findUnique","DepartmentSemesterFeeConfiguration.findUniqueOrThrow","DepartmentSemesterFeeConfiguration.findFirst","DepartmentSemesterFeeConfiguration.findFirstOrThrow","DepartmentSemesterFeeConfiguration.findMany","DepartmentSemesterFeeConfiguration.createOne","DepartmentSemesterFeeConfiguration.createMany","DepartmentSemesterFeeConfiguration.createManyAndReturn","DepartmentSemesterFeeConfiguration.updateOne","DepartmentSemesterFeeConfiguration.updateMany","DepartmentSemesterFeeConfiguration.updateManyAndReturn","DepartmentSemesterFeeConfiguration.upsertOne","DepartmentSemesterFeeConfiguration.deleteOne","DepartmentSemesterFeeConfiguration.deleteMany","DepartmentSemesterFeeConfiguration.groupBy","DepartmentSemesterFeeConfiguration.aggregate","StudentFeePayment.findUnique","StudentFeePayment.findUniqueOrThrow","StudentFeePayment.findFirst","StudentFeePayment.findFirstOrThrow","StudentFeePayment.findMany","StudentFeePayment.createOne","StudentFeePayment.createMany","StudentFeePayment.createManyAndReturn","StudentFeePayment.updateOne","StudentFeePayment.updateMany","StudentFeePayment.updateManyAndReturn","StudentFeePayment.upsertOne","StudentFeePayment.deleteOne","StudentFeePayment.deleteMany","StudentFeePayment.groupBy","StudentFeePayment.aggregate","InstitutionPaymentGatewayCredential.findUnique","InstitutionPaymentGatewayCredential.findUniqueOrThrow","InstitutionPaymentGatewayCredential.findFirst","InstitutionPaymentGatewayCredential.findFirstOrThrow","InstitutionPaymentGatewayCredential.findMany","InstitutionPaymentGatewayCredential.createOne","InstitutionPaymentGatewayCredential.createMany","InstitutionPaymentGatewayCredential.createManyAndReturn","InstitutionPaymentGatewayCredential.updateOne","InstitutionPaymentGatewayCredential.updateMany","InstitutionPaymentGatewayCredential.updateManyAndReturn","InstitutionPaymentGatewayCredential.upsertOne","InstitutionPaymentGatewayCredential.deleteOne","InstitutionPaymentGatewayCredential.deleteMany","InstitutionPaymentGatewayCredential.groupBy","InstitutionPaymentGatewayCredential.aggregate","InstitutionSubscriptionRenewalPayment.findUnique","InstitutionSubscriptionRenewalPayment.findUniqueOrThrow","InstitutionSubscriptionRenewalPayment.findFirst","InstitutionSubscriptionRenewalPayment.findFirstOrThrow","InstitutionSubscriptionRenewalPayment.findMany","InstitutionSubscriptionRenewalPayment.createOne","InstitutionSubscriptionRenewalPayment.createMany","InstitutionSubscriptionRenewalPayment.createManyAndReturn","InstitutionSubscriptionRenewalPayment.updateOne","InstitutionSubscriptionRenewalPayment.updateMany","InstitutionSubscriptionRenewalPayment.updateManyAndReturn","InstitutionSubscriptionRenewalPayment.upsertOne","InstitutionSubscriptionRenewalPayment.deleteOne","InstitutionSubscriptionRenewalPayment.deleteMany","InstitutionSubscriptionRenewalPayment.groupBy","InstitutionSubscriptionRenewalPayment.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","InstitutionSubscription.findUnique","InstitutionSubscription.findUniqueOrThrow","InstitutionSubscription.findFirst","InstitutionSubscription.findFirstOrThrow","InstitutionSubscription.findMany","InstitutionSubscription.createOne","InstitutionSubscription.createMany","InstitutionSubscription.createManyAndReturn","InstitutionSubscription.updateOne","InstitutionSubscription.updateMany","InstitutionSubscription.updateManyAndReturn","InstitutionSubscription.upsertOne","InstitutionSubscription.deleteOne","InstitutionSubscription.deleteMany","InstitutionSubscription.groupBy","InstitutionSubscription.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","sourceApplicationId","InstitutionSubscriptionPlan","plan","InstitutionSubscriptionStatus","amount","currency","monthsCovered","startsAt","endsAt","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","initiatedByUserId","InstitutionSubscriptionPaymentStatus","tranId","gatewayStatus","gatewaySessionKey","gatewayValId","gatewayBankTranId","gatewayCardType","gatewayRawPayload","paidAt","sslCommerzStoreIdEncrypted","sslCommerzStorePasswordEncrypted","sslCommerzBaseUrlEncrypted","sslCommerzStoreIdHash","sslCommerzStorePasswordHash","sslCommerzBaseUrlHash","isActive","lastUpdatedByUserId","feeConfigurationId","StudentFeePaymentMode","paymentMode","StudentFeePaymentStatus","gatewayName","paymentInitiatedAt","totalFeeAmount","monthlyFeeAmount","noticeId","readAt","NoticeAudienceRole","role","senderUserId","senderRole","InstitutionTransferEntityType","entityType","InstitutionTransferStatus","sourceInstitutionId","targetInstitutionId","requesterUserId","targetDepartmentId","requestMessage","responseMessage","requestedAt","UserRole","requesterRole","InstitutionLeaveRequestStatus","reason","reviewedByUserId","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","subscriptionPlan","subscriptionAmount","subscriptionCurrency","subscriptionMonths","subscriptionPaymentStatus","subscriptionTranId","subscriptionGatewayStatus","subscriptionGatewaySessionKey","subscriptionGatewayValId","subscriptionGatewayBankTranId","subscriptionGatewayCardType","subscriptionGatewayRawPayload","subscriptionPaidAt","InstitutionApplicationStatus","rejectionReason","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","accountStatus","date","AttendanceStatus","AdminRole","noticeId_userId","noticeId_role","courseRegistrationId_date","departmentId_semesterId","postingId_teacherUserId","postingId_studentUserId","classworkId_studentProfileId","sectionId_courseId","userId_institutionId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "_R6BA7AFDQMAAPYKACAGAAC6CwAgCAAAuwwAIJMGAAC6DAAwlAYAAMABABCVBgAAugwAMJYGAQAAAAGbBgEA8QoAIZwGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh-gcAAPsMACABAAAAAQAgDAMAAPYKACCTBgAA-gwAMJQGAAADABCVBgAA-gwAMJYGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh1wdAAPUKACHjBwEA8QoAIeQHAQDyCgAh5QcBAPIKACEDAwAA5w4AIOQHAAD8DAAg5QcAAPwMACAMAwAA9goAIJMGAAD6DAAwlAYAAAMAEJUGAAD6DAAwlgYBAAAAAZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIdcHQAD1CgAh4wcBAAAAAeQHAQDyCgAh5QcBAPIKACEDAAAAAwAgAQAABAAwAgAABQAgEQMAAPYKACCTBgAA-QwAMJQGAAAHABCVBgAA-QwAMJYGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh2gcBAPEKACHbBwEA8QoAIdwHAQDyCgAh3QcBAPIKACHeBwEA8goAId8HQACfDAAh4AdAAJ8MACHhBwEA8goAIeIHAQDyCgAhCAMAAOcOACDcBwAA_AwAIN0HAAD8DAAg3gcAAPwMACDfBwAA_AwAIOAHAAD8DAAg4QcAAPwMACDiBwAA_AwAIBEDAAD2CgAgkwYAAPkMADCUBgAABwAQlQYAAPkMADCWBgEAAAABnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh2gcBAPEKACHbBwEA8QoAIdwHAQDyCgAh3QcBAPIKACHeBwEA8goAId8HQACfDAAh4AdAAJ8MACHhBwEA8goAIeIHAQDyCgAhAwAAAAcAIAEAAAgAMAIAAAkAIAsDAAD2CgAgBgAAugsAIJMGAAD3DAAwlAYAAAsAEJUGAAD3DAAwlgYBAPEKACGbBgEA8QoAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIaYHAAD4DPIHIgIDAADnDgAgBgAAghIAIAsDAAD2CgAgBgAAugsAIJMGAAD3DAAwlAYAAAsAEJUGAAD3DAAwlgYBAAAAAZsGAQDxCgAhnQYBAAAAAZ4GQAD1CgAhnwZAAPUKACGmBwAA-AzyByIDAAAACwAgAQAADAAwAgAADQAgDAYAALcMACA7AAD2DAAgkwYAAPUMADCUBgAADwAQlQYAAPUMADCWBgEA8QoAIZsGAQDyCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhugcBAPIKACHNBwEA8QoAIQUGAACCEgAgOwAAkRoAIJsGAAD8DAAg9QYAAPwMACC6BwAA_AwAIAwGAAC3DAAgOwAA9gwAIJMGAAD1DAAwlAYAAA8AEJUGAAD1DAAwlgYBAAAAAZsGAQDyCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhugcBAPIKACHNBwEA8QoAIQMAAAAPACABAAAQADACAAARACAnCwAAngsAIAwAAKALACAPAADvCwAgGwAAogsAICgAAJ8LACAqAAChCwAgLAAA9wsAIDAAAOgLACAxAADpCwAgMgAA6wsAIDMAAO0LACA0AADuCwAgNQAAsQsAIDYAAPELACA3AADyCwAgOAAA8wsAIDoAAPsLACA8AADnCwAgPQAA6gsAID4AAOwLACBCAAD2CwAgQwAA8AsAIEQAAPQLACBFAAD1CwAgSgAA-AsAIEsAAPkLACBMAAD6CwAgTQAA-gsAIJMGAADlCwAwlAYAABMAEJUGAADlCwAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhygYAAOYLvAcj7wYBAPEKACH1BgEA8goAIboHAQDyCgAhvQcBAPIKACEBAAAAEwAgHQcAAPQMACALAACeCwAgDAAAoAsAIA8AAO8LACAbAACiCwAgKAAAnwsAICoAAKELACAsAAD3CwAgMAAA6AsAIDEAAOkLACAyAADrCwAgMwAA7QsAIDQAAO4LACA1AACxCwAgNgAA8QsAIDcAAPILACA4AADzCwAgOQAA-gsAIDoAAPsLACCTBgAA8wwAMJQGAAAVABCVBgAA8wwAMJYGAQDxCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhhgcBAPIKACG6BwEA8goAIc0HAQDxCgAhFgcAAJAaACALAACDEQAgDAAAhREAIA8AAMMXACAbAACHEQAgKAAAhBEAICoAAIYRACAsAADLFwAgMAAAvBcAIDEAAL0XACAyAAC_FwAgMwAAwRcAIDQAAMIXACA1AAD0EQAgNgAAxRcAIDcAAMYXACA4AADHFwAgOQAAzhcAIDoAAM8XACD1BgAA_AwAIIYHAAD8DAAgugcAAPwMACAdBwAA9AwAIAsAAJ4LACAMAACgCwAgDwAA7wsAIBsAAKILACAoAACfCwAgKgAAoQsAICwAAPcLACAwAADoCwAgMQAA6QsAIDIAAOsLACAzAADtCwAgNAAA7gsAIDUAALELACA2AADxCwAgNwAA8gsAIDgAAPMLACA5AAD6CwAgOgAA-wsAIJMGAADzDAAwlAYAABUAEJUGAADzDAAwlgYBAAAAAZ4GQAD1CgAhnwZAAPUKACH1BgEA8goAIYYHAQDyCgAhugcBAPIKACHNBwEA8QoAIQMAAAAVACABAAAWADACAAAXACABAAAADwAgEgYAALoLACAIAAC7DAAgDAAAoAsAIA4AAOsLACCTBgAA8gwAMJQGAAAaABCVBgAA8gwAMJYGAQDxCgAhmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHHBgEA8QoAIfUGAQDyCgAh_wYBAPIKACGAB0AAnwwAIYEHCADIDAAhggcIAMgMACEJBgAAghIAIAgAAP8ZACAMAACFEQAgDgAAvxcAIPUGAAD8DAAg_wYAAPwMACCABwAA_AwAIIEHAAD8DAAgggcAAPwMACASBgAAugsAIAgAALsMACAMAACgCwAgDgAA6wsAIJMGAADyDAAwlAYAABoAEJUGAADyDAAwlgYBAAAAAZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhxwYBAPEKACH1BgEA8goAIf8GAQDyCgAhgAdAAJ8MACGBBwgAyAwAIYIHCADIDAAhAwAAABoAIAEAABsAMAIAABwAIBIGAAC6CwAgCAAAuwwAIAkAAPAMACAMAACgCwAgDwAA7wsAIJMGAADxDAAwlAYAAB4AEJUGAADxDAAwlgYBAPEKACGbBgEA8QoAIZwGAQDxCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhgQcCALUMACGHBwEA8goAIc8HAQDxCgAh0AcBAPEKACEIBgAAghIAIAgAAP8ZACAJAACPGgAgDAAAhREAIA8AAMMXACD1BgAA_AwAIIEHAAD8DAAghwcAAPwMACASBgAAugsAIAgAALsMACAJAADwDAAgDAAAoAsAIA8AAO8LACCTBgAA8QwAMJQGAAAeABCVBgAA8QwAMJYGAQAAAAGbBgEA8QoAIZwGAQDxCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhgQcCALUMACGHBwEA8goAIc8HAQAAAAHQBwEA8QoAIQMAAAAeACABAAAfADACAAAgACABAAAAGgAgGgYAALoLACAIAAC9DAAgCQAA8AwAIAoAAPcLACANAADhDAAgDgAA5AwAIBAAAMkMACAYAADWDAAgGgAAxgwAIC4AAO4MACAvAADvDAAgkwYAAO0MADCUBgAAIwAQlQYAAO0MADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhvgYBAPEKACG_BgEA8QoAIcAGAQDxCgAhwgYBAPEKACH3BgEA8QoAIYcHAQDyCgAhzgdAAPUKACENBgAAghIAIAgAAP8ZACAJAACPGgAgCgAAyxcAIA0AAIgaACAOAACJGgAgEAAAghoAIBgAAIQaACAaAACBGgAgLgAAjRoAIC8AAI4aACCcBgAA_AwAIIcHAAD8DAAgGgYAALoLACAIAAC9DAAgCQAA8AwAIAoAAPcLACANAADhDAAgDgAA5AwAIBAAAMkMACAYAADWDAAgGgAAxgwAIC4AAO4MACAvAADvDAAgkwYAAO0MADCUBgAAIwAQlQYAAO0MADCWBgEAAAABmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACG-BgEA8QoAIb8GAQDxCgAhwAYBAPEKACHCBgEA8QoAIfcGAQDxCgAhhwcBAPIKACHOB0AA9QoAIQMAAAAjACABAAAkADACAAAlACATBgAAtwwAIAgAAL0MACAmAADDDAAgKwAA6wwAIC0AAOwMACCTBgAA6gwAMJQGAAAnABCVBgAA6gwAMJYGAQDxCgAhmwYBAPIKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHUBgEA8QoAIe8GAQDxCgAh9QYBAPIKACH8BgEA8goAIf0GAQDxCgAh_gYBAPEKACEJBgAAghIAIAgAAP8ZACAmAACAGgAgKwAAixoAIC0AAIwaACCbBgAA_AwAIJwGAAD8DAAg9QYAAPwMACD8BgAA_AwAIBMGAAC3DAAgCAAAvQwAICYAAMMMACArAADrDAAgLQAA7AwAIJMGAADqDAAwlAYAACcAEJUGAADqDAAwlgYBAAAAAZsGAQDyCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh1AYBAPEKACHvBgEA8QoAIfUGAQDyCgAh_AYBAPIKACH9BgEA8QoAIf4GAQDxCgAhAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACANCwAAngsAIAwAAKALACAbAACiCwAgKAAAnwsAICoAAKELACCTBgAAnQsAMJQGAAAsABCVBgAAnQsAMJYGAQDxCgAhmwYBAPEKACHvBgEA8QoAIfAGQAD1CgAh8QZAAPUKACEBAAAALAAgEgYAALcMACAIAAC9DAAgCgAA9wsAIBoAAOkMACCTBgAA5wwAMJQGAAAuABCVBgAA5wwAMJYGAQDxCgAhmwYBAPIKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHOBgAA6Az8BiLvBgEA8QoAIfUGAQDyCgAh9wYBAPIKACH5BgEA8QoAIfoGAQDxCgAhCAYAAIISACAIAAD_GQAgCgAAyxcAIBoAAIEaACCbBgAA_AwAIJwGAAD8DAAg9QYAAPwMACD3BgAA_AwAIBIGAAC3DAAgCAAAvQwAIAoAAPcLACAaAADpDAAgkwYAAOcMADCUBgAALgAQlQYAAOcMADCWBgEAAAABmwYBAPIKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHOBgAA6Az8BiLvBgEA8QoAIfUGAQDyCgAh9wYBAPIKACH5BgEA8QoAIfoGAQDxCgAhAwAAAC4AIAEAAC8AMAIAADAAIBQGAAC6CwAgCAAAvQwAIAwAAKALACAPAADvCwAgGgAAxgwAICMAAPELACApAADmDAAgkwYAAOUMADCUBgAAMgAQlQYAAOUMADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPEKACH1BgEA8goAIfYGAgC1DAAh9wYBAPEKACH4BgEA8goAIQsGAACCEgAgCAAA_xkAIAwAAIURACAPAADDFwAgGgAAgRoAICMAAMUXACApAACKGgAgnAYAAPwMACD1BgAA_AwAIPYGAAD8DAAg-AYAAPwMACAUBgAAugsAIAgAAL0MACAMAACgCwAgDwAA7wsAIBoAAMYMACAjAADxCwAgKQAA5gwAIJMGAADlDAAwlAYAADIAEJUGAADlDAAwlgYBAAAAAZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPEKACH1BgEA8goAIfYGAgC1DAAh9wYBAPEKACH4BgEA8goAIQMAAAAyACABAAAzADACAAA0ACADAAAAIwAgAQAAJAAwAgAAJQAgEAYAALoLACAIAAC9DAAgDQAA4QwAIA4AAOQMACAQAADJDAAgkwYAAOMMADCUBgAANwAQlQYAAOMMADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhvgYBAPEKACG_BgEA8QoAIcAGAQDxCgAhBgYAAIISACAIAAD_GQAgDQAAiBoAIA4AAIkaACAQAACCGgAgnAYAAPwMACARBgAAugsAIAgAAL0MACANAADhDAAgDgAA5AwAIBAAAMkMACCTBgAA4wwAMJQGAAA3ABCVBgAA4wwAMJYGAQAAAAGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIb4GAQDxCgAhvwYBAPEKACHABgEA8QoAIfkHAADiDAAgAwAAADcAIAEAADgAMAIAADkAIAMAAAAjACABAAAkADACAAAlACADAAAANwAgAQAAOAAwAgAAOQAgEwYAALoLACAIAAC9DAAgDQAA4QwAIBAAAMkMACAiAADyCwAgkwYAAN8MADCUBgAAPQAQlQYAAN8MADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhvgYBAPEKACHABgEA8QoAIccGAQDxCgAhyAYBAPIKACHKBgAA4AzKBiLLBkAAnwwAIQgGAACCEgAgCAAA_xkAIA0AAIgaACAQAACCGgAgIgAAxhcAIJwGAAD8DAAgyAYAAPwMACDLBgAA_AwAIBMGAAC6CwAgCAAAvQwAIA0AAOEMACAQAADJDAAgIgAA8gsAIJMGAADfDAAwlAYAAD0AEJUGAADfDAAwlgYBAAAAAZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhvgYBAPEKACHABgEA8QoAIccGAQDxCgAhyAYBAPIKACHKBgAA4AzKBiLLBkAAnwwAIQMAAAA9ACABAAA-ADACAAA_ACABAAAAFQAgEgYAALoLACAIAAC9DAAgEQAA3gwAIBgAANYMACCTBgAA3QwAMJQGAABCABCVBgAA3QwAMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHBBgEA8QoAIcIGAQDxCgAhwwYBAPIKACHEBgEA8goAIcUGAQDyCgAhxgZAAPUKACEIBgAAghIAIAgAAP8ZACARAACHGgAgGAAAhBoAIJwGAAD8DAAgwwYAAPwMACDEBgAA_AwAIMUGAAD8DAAgEwYAALoLACAIAAC9DAAgEQAA3gwAIBgAANYMACCTBgAA3QwAMJQGAABCABCVBgAA3QwAMJYGAQAAAAGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIcEGAQDxCgAhwgYBAPEKACHDBgEA8goAIcQGAQDyCgAhxQYBAPIKACHGBkAA9QoAIfgHAADcDAAgAwAAAEIAIAEAAEMAMAIAAEQAIAEAAAAVACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAAEIAIAEAAEMAMAIAAEQAIBMVAADbDAAgFgAA9goAIBcAAKAMACAYAADSDAAgkwYAANkMADCUBgAASQAQlQYAANkMADCWBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHCBgEA8goAIcwGAQDyCgAhzgYAANoM7QYizwYBAPIKACHQBkAAnwwAIdEGQAD1CgAh0gYBAPEKACHTBgEA8goAIe0GAQDxCgAhCRUAAIYaACAWAADnDgAgFwAA5w4AIBgAAIQaACDCBgAA_AwAIMwGAAD8DAAgzwYAAPwMACDQBgAA_AwAINMGAAD8DAAgFBUAANsMACAWAAD2CgAgFwAAoAwAIBgAANIMACCTBgAA2QwAMJQGAABJABCVBgAA2QwAMJYGAQAAAAGeBkAA9QoAIZ8GQAD1CgAhwgYBAPIKACHMBgEA8goAIc4GAADaDO0GIs8GAQDyCgAh0AZAAJ8MACHRBkAA9QoAIdIGAQDxCgAh0wYBAPIKACHtBgEA8QoAIfcHAADYDAAgAwAAAEkAIAEAAEoAMAIAAEsAIAMAAABJACABAABKADACAABLACABAAAASQAgJwQAAIwMACAFAACNDAAgEAAA7QsAIBgAAO4LACA1AACxCwAgOgAA-wsAID4AAOwLACBDAADwCwAgTgAA8AsAIE8AALELACBQAACODAAgUQAArgsAIFIAAK4LACBTAACPDAAgVAAAkAwAIFUAAPoLACBWAAD6CwAgVwAA-QsAIFgAAPkLACBZAAD4CwAgWgAAkQwAIJMGAACLDAAwlAYAAE8AEJUGAACLDAAwlgYBAPEKACGaBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8QoAIaYHAQDxCgAh5gcBAPEKACHnByAA9AoAIegHAQDyCgAh6QcBAPIKACHqBwEA8goAIesHAQDyCgAh7AcBAPIKACHtBwEA8goAIe4HAQDxCgAhAQAAAE8AIBMDAAD2CgAgBgAAugsAIAgAAL0MACAMAACgCwAgEgAA8gsAIBkAAK4LACAbAACiCwAgIQAA-gsAIJMGAAC8DAAwlAYAAFEAEJUGAAC8DAAwlgYBAPEKACGaBgEA8goAIZsGAQDxCgAhnAYBAPIKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHrBgEA8QoAIQEAAABRACAfBgAAugsAIAgAALsMACAYAADWDAAgGgAAxgwAIBwAANcMACCTBgAA0wwAMJQGAABTABCVBgAA0wwAMJYGAQDxCgAhmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHCBgEA8QoAIc4GAADVDJ8HIuYGEACrDAAh5wYBAPEKACHoBgIArAwAIfcGAQDxCgAhiwcBAPEKACGMBwEA8goAIY0HAQDyCgAhjgcBAPIKACGPBwEA8goAIZAHAQDyCgAhkQcAAK4MACCSB0AAnwwAIZsHAQDxCgAhnQcAANQMnQcinwcBAPEKACGgB0AA9QoAIQwGAACCEgAgCAAA_xkAIBgAAIQaACAaAACBGgAgHAAAhRoAIIwHAAD8DAAgjQcAAPwMACCOBwAA_AwAII8HAAD8DAAgkAcAAPwMACCRBwAA_AwAIJIHAAD8DAAgHwYAALoLACAIAAC7DAAgGAAA1gwAIBoAAMYMACAcAADXDAAgkwYAANMMADCUBgAAUwAQlQYAANMMADCWBgEAAAABmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHCBgEA8QoAIc4GAADVDJ8HIuYGEACrDAAh5wYBAPEKACHoBgIArAwAIfcGAQDxCgAhiwcBAAAAAYwHAQDyCgAhjQcBAAAAAY4HAQDyCgAhjwcBAPIKACGQBwEA8goAIZEHAACuDAAgkgdAAJ8MACGbBwEA8QoAIZ0HAADUDJ0HIp8HAQDxCgAhoAdAAPUKACEDAAAAUwAgAQAAVAAwAgAAVQAgAwAAAFMAIAEAAFQAMAIAAFUAIAEAAABTACAaEAAAzgwAIBcAAKAMACAYAADSDAAgHQAAugsAIB4AALoLACAfAAD2CgAgIAAAvQwAIJMGAADPDAAwlAYAAFkAEJUGAADPDAAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhwAYBAPIKACHCBgEA8goAIc4GAADRDKwHItAGQACfDAAh0wYBAPIKACGqBwAA0AyqByKsBwEA8QoAIa0HAQDxCgAhrgcBAPEKACGvBwEA8goAIbAHAQDyCgAhsQcBAPIKACGyB0AA9QoAIQ4QAACCGgAgFwAA5w4AIBgAAIQaACAdAACCEgAgHgAAghIAIB8AAOcOACAgAAD_GQAgwAYAAPwMACDCBgAA_AwAINAGAAD8DAAg0wYAAPwMACCvBwAA_AwAILAHAAD8DAAgsQcAAPwMACAaEAAAzgwAIBcAAKAMACAYAADSDAAgHQAAugsAIB4AALoLACAfAAD2CgAgIAAAvQwAIJMGAADPDAAwlAYAAFkAEJUGAADPDAAwlgYBAAAAAZ4GQAD1CgAhnwZAAPUKACHABgEA8goAIcIGAQDyCgAhzgYAANEMrAci0AZAAJ8MACHTBgEA8goAIaoHAADQDKoHIqwHAQDxCgAhrQcBAPEKACGuBwEA8QoAIa8HAQDyCgAhsAcBAPIKACGxBwEA8goAIbIHQAD1CgAhAwAAAFkAIAEAAFoAMAIAAFsAIAEAAABPACABAAAAUQAgFgMAAPYKACAGAAC6CwAgCAAAuwwAIAwAAKALACAPAADvCwAgIQAA-gsAICMAAPELACAlAACxCwAgJwAA8wsAIJMGAAC-DAAwlAYAAF8AEJUGAAC-DAAwlgYBAPEKACGXBgEA8QoAIZgGAQDxCgAhmQYBAPEKACGaBgEA8goAIZsGAQDxCgAhnAYBAPEKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACEBAAAAXwAgAQAAABUAIAEAAAAjACABAAAAQgAgAQAAAEkAIAEAAABTACABAAAAWQAgAQAAABUAIAEAAABCACAXBgAAugsAIAgAAL0MACAQAADODAAgFQAAzQwAIBcAAKAMACAkAAD2CgAgkwYAAMsMADCUBgAAaQAQlQYAAMsMADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhqwYBAPEKACHABgEA8goAIcwGAQDyCgAhzgYAAMwMzgYizwYBAPIKACHQBkAAnwwAIdEGQAD1CgAh0gYBAPEKACHTBgEA8goAIQwGAACCEgAgCAAA_xkAIBAAAIIaACAVAACDGgAgFwAA5w4AICQAAOcOACCcBgAA_AwAIMAGAAD8DAAgzAYAAPwMACDPBgAA_AwAINAGAAD8DAAg0wYAAPwMACAYBgAAugsAIAgAAL0MACAQAADODAAgFQAAzQwAIBcAAKAMACAkAAD2CgAgkwYAAMsMADCUBgAAaQAQlQYAAMsMADCWBgEAAAABmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACGrBgEA8QoAIcAGAQDyCgAhzAYBAPIKACHOBgAAzAzOBiLPBgEA8goAIdAGQACfDAAh0QZAAPUKACHSBgEA8QoAIdMGAQDyCgAh9gcAAMoMACADAAAAaQAgAQAAagAwAgAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIAEAAABpACABAAAATwAgAQAAAF8AIAEAAAAVACAbBgAAugsAIAgAAL0MACAQAADJDAAgJgAAwwwAIJMGAADHDAAwlAYAAHIAEJUGAADHDAAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIcAGAQDxCgAh1AYBAPEKACHVBggAyAwAIdYGCADIDAAh1wYIAMgMACHYBggAyAwAIdkGCADIDAAh2gYIAMgMACHbBggAyAwAIdwGCADIDAAh3QYIAMgMACHeBggAyAwAId8GCADIDAAh4AYIAMgMACHhBggAyAwAIRIGAACCEgAgCAAA_xkAIBAAAIIaACAmAACAGgAgnAYAAPwMACDVBgAA_AwAINYGAAD8DAAg1wYAAPwMACDYBgAA_AwAINkGAAD8DAAg2gYAAPwMACDbBgAA_AwAINwGAAD8DAAg3QYAAPwMACDeBgAA_AwAIN8GAAD8DAAg4AYAAPwMACDhBgAA_AwAIBsGAAC6CwAgCAAAvQwAIBAAAMkMACAmAADDDAAgkwYAAMcMADCUBgAAcgAQlQYAAMcMADCWBgEAAAABmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHABgEA8QoAIdQGAQAAAAHVBggAyAwAIdYGCADIDAAh1wYIAMgMACHYBggAyAwAIdkGCADIDAAh2gYIAMgMACHbBggAyAwAIdwGCADIDAAh3QYIAMgMACHeBggAyAwAId8GCADIDAAh4AYIAMgMACHhBggAyAwAIQMAAAByACABAABzADACAAB0ACABAAAAFQAgAwAAAFkAIAEAAFoAMAIAAFsAIAEAAAAjACABAAAANwAgAQAAAD0AIAEAAABpACABAAAAcgAgAQAAAFkAIAEAAAAVACADAAAAPQAgAQAAPgAwAgAAPwAgAQAAABUAIA0GAAC6CwAgCAAAvQwAICgAAJ8LACCTBgAAvwwAMJQGAACBAQAQlQYAAL8MADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPEKACH1BgEA8goAIQEAAACBAQAgAQAAABUAIAMAAAAyACABAAAzADACAAA0ACABAAAAMgAgAQAAACMAIAEAAAA3ACABAAAAPQAgAwAAACMAIAEAACQAMAIAACUAIBEGAAC6CwAgCAAAuwwAIBoAAMYMACAbAACiCwAgkwYAAMUMADCUBgAAigEAEJUGAADFDAAwlgYBAPEKACGbBgEA8QoAIZwGAQDxCgAhngZAAPUKACGfBkAA9QoAIecGAQDxCgAh9wYBAPEKACGZByAA9AoAIaEHEACrDAAhogcQAKsMACEEBgAAghIAIAgAAP8ZACAaAACBGgAgGwAAhxEAIBIGAAC6CwAgCAAAuwwAIBoAAMYMACAbAACiCwAgkwYAAMUMADCUBgAAigEAEJUGAADFDAAwlgYBAAAAAZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh5wYBAPEKACH3BgEA8QoAIZkHIAD0CgAhoQcQAKsMACGiBxAAqwwAIfUHAADEDAAgAwAAAIoBACABAACLAQAwAgAAjAEAIAMAAABTACABAABUADACAABVACABAAAALgAgAQAAADIAIAEAAAAjACABAAAAigEAIAEAAABTACABAAAAEwAgAQAAABUAIAEAAAAnACADAAAAJwAgAQAAKAAwAgAAKQAgAQAAACcAIAEAAAATACABAAAAFQAgCiYAAMMMACCTBgAAwQwAMJQGAACbAQAQlQYAAMEMADCWBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHOBgAAwgzxByLUBgEA8QoAIe8HQAD1CgAhASYAAIAaACALJgAAwwwAIJMGAADBDAAwlAYAAJsBABCVBgAAwQwAMJYGAQAAAAGeBkAA9QoAIZ8GQAD1CgAhzgYAAMIM8Qci1AYBAPEKACHvB0AA9QoAIfQHAADADAAgAwAAAJsBACABAACcAQAwAgAAnQEAIAEAAAByACABAAAAFQAgAQAAABoAIAEAAAAnACABAAAAmwEAIAMAAAA3ACABAAA4ADACAAA5ACABAAAAIwAgAQAAADcAIAMAAAAjACABAAAkADACAAAlACABAAAAHgAgAQAAACMAIAUGAACCEgAgCAAA_xkAICgAAIQRACCcBgAA_AwAIPUGAAD8DAAgDQYAALoLACAIAAC9DAAgKAAAnwsAIJMGAAC_DAAwlAYAAIEBABCVBgAAvwwAMJYGAQAAAAGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIe8GAQDxCgAh9QYBAPIKACEDAAAAgQEAIAEAAKoBADACAACrAQAgAwAAAB4AIAEAAB8AMAIAACAAIAMAAAAyACABAAAzADACAAA0ACAKAwAA5w4AIAYAAIISACAIAAD_GQAgDAAAhREAIA8AAMMXACAhAADOFwAgIwAAxRcAICUAAPQRACAnAADHFwAgmgYAAPwMACAWAwAA9goAIAYAALoLACAIAAC7DAAgDAAAoAsAIA8AAO8LACAhAAD6CwAgIwAA8QsAICUAALELACAnAADzCwAgkwYAAL4MADCUBgAAXwAQlQYAAL4MADCWBgEAAAABlwYBAAAAAZgGAQAAAAGZBgEA8QoAIZoGAQDyCgAhmwYBAPEKACGcBgEA8QoAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIQMAAABfACABAACvAQAwAgAAsAEAIAoDAADnDgAgBgAAghIAIAgAAP8ZACAMAACFEQAgEgAAxhcAIBkAAOMRACAbAACHEQAgIQAAzhcAIJoGAAD8DAAgnAYAAPwMACATAwAA9goAIAYAALoLACAIAAC9DAAgDAAAoAsAIBIAAPILACAZAACuCwAgGwAAogsAICEAAPoLACCTBgAAvAwAMJQGAABRABCVBgAAvAwAMJYGAQAAAAGaBgEA8goAIZsGAQDxCgAhnAYBAPIKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHrBgEAAAABAwAAAFEAIAEAALIBADACAACzAQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAA3ACABAAA4ADACAAA5ACADAAAAaQAgAQAAagAwAgAAawAgAwAAAD0AIAEAAD4AMAIAAD8AIAMAAABCACABAABDADACAABEACADAAAAcgAgAQAAcwAwAgAAdAAgAwAAAIoBACABAACLAQAwAgAAjAEAIAMAAABTACABAABUADACAABVACADAAAALgAgAQAALwAwAgAAMAAgAwAAACcAIAEAACgAMAIAACkAIAMAAABZACABAABaADACAABbACAMAwAA9goAIAYAALoLACAIAAC7DAAgkwYAALoMADCUBgAAwAEAEJUGAAC6DAAwlgYBAPEKACGbBgEA8QoAIZwGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhAwMAAOcOACAGAACCEgAgCAAA_xkAIAMAAADAAQAgAQAAwQEAMAIAAAEAIAEAAAAaACABAAAAgQEAIAEAAAAeACABAAAAMgAgAQAAAF8AIAEAAABRACABAAAAIwAgAQAAADcAIAEAAABpACABAAAAPQAgAQAAAEIAIAEAAAByACABAAAAigEAIAEAAABTACABAAAALgAgAQAAACcAIAEAAABZACABAAAAwAEAIAEAAAAVACADAAAAGgAgAQAAGwAwAgAAHAAgAwAAAIEBACABAACqAQAwAgAAqwEAIA4GAAC6CwAgLAAA9wsAIJMGAAC4DAAwlAYAANgBABCVBgAAuAwAMJYGAQDxCgAhmwYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPIKACHRBwEA8QoAIdIHAQDxCgAh0wcCAKwMACHVBwAAuQzVByIDBgAAghIAICwAAMsXACDvBgAA_AwAIA4GAAC6CwAgLAAA9wsAIJMGAAC4DAAwlAYAANgBABCVBgAAuAwAMJYGAQAAAAGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8goAIdEHAQDxCgAh0gcBAPEKACHTBwIArAwAIdUHAAC5DNUHIgMAAADYAQAgAQAA2QEAMAIAANoBACADAAAAMgAgAQAAMwAwAgAANAAgAwAAAB4AIAEAAB8AMAIAACAAIAMAAAALACABAAAMADACAAANACADAAAAXwAgAQAArwEAMAIAALABACADAAAAUQAgAQAAsgEAMAIAALMBACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAADcAIAEAADgAMAIAADkAICIGAAC3DAAgPwAA9goAIEAAAKAMACBCAAD2CwAgkwYAALIMADCUBgAA4wEAEJUGAACyDAAwlgYBAPEKACGbBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHOBgAAtgzMByLQBkAAnwwAIfUGAQDyCgAhtwcBAPIKACG4BwEA8QoAIbkHAQDxCgAhugcBAPIKACG8BwAA5gu8ByO9BwEA8goAIb4HAACzDOQGI78HEAC0DAAhwAcBAPEKACHBBwIAtQwAIcIHAACtDIsHIsMHAQDyCgAhxAcBAPIKACHFBwEA8goAIcYHAQDyCgAhxwcBAPIKACHIBwEA8goAIckHAACuDAAgygdAAJ8MACHMBwEA8goAIRcGAACCEgAgPwAA5w4AIEAAAOcOACBCAADKFwAgmwYAAPwMACDQBgAA_AwAIPUGAAD8DAAgtwcAAPwMACC6BwAA_AwAILwHAAD8DAAgvQcAAPwMACC-BwAA_AwAIL8HAAD8DAAgwQcAAPwMACDDBwAA_AwAIMQHAAD8DAAgxQcAAPwMACDGBwAA_AwAIMcHAAD8DAAgyAcAAPwMACDJBwAA_AwAIMoHAAD8DAAgzAcAAPwMACAiBgAAtwwAID8AAPYKACBAAACgDAAgQgAA9gsAIJMGAACyDAAwlAYAAOMBABCVBgAAsgwAMJYGAQAAAAGbBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHOBgAAtgzMByLQBkAAnwwAIfUGAQDyCgAhtwcBAPIKACG4BwEA8QoAIbkHAQDxCgAhugcBAPIKACG8BwAA5gu8ByO9BwEA8goAIb4HAACzDOQGI78HEAC0DAAhwAcBAPEKACHBBwIAtQwAIcIHAACtDIsHIsMHAQAAAAHEBwEA8goAIcUHAQAAAAHGBwEA8goAIccHAQDyCgAhyAcBAPIKACHJBwAArgwAIMoHQACfDAAhzAcBAPIKACEDAAAA4wEAIAEAAOQBADACAADlAQAgAQAAAE8AIAEAAAATACARBgAAugsAIEEAALEMACCTBgAArwwAMJQGAADpAQAQlQYAAK8MADCWBgEA8QoAIZsGAQDxCgAhngZAAPUKACGfBkAA9QoAIc4GAACwDOYGIuIGAQDyCgAh5AYAAKoM5AYi5gYQAKsMACHnBgEA8QoAIegGAgCsDAAh6QZAAPUKACHqBkAA9QoAIQMGAACCEgAgQQAA_hkAIOIGAAD8DAAgEQYAALoLACBBAACxDAAgkwYAAK8MADCUBgAA6QEAEJUGAACvDAAwlgYBAAAAAZsGAQDxCgAhngZAAPUKACGfBkAA9QoAIc4GAACwDOYGIuIGAQDyCgAh5AYAAKoM5AYi5gYQAKsMACHnBgEA8QoAIegGAgCsDAAh6QZAAPUKACHqBkAA9QoAIQMAAADpAQAgAQAA6gEAMAIAAOsBACABAAAA4wEAIAEAAADpAQAgAwAAAGkAIAEAAGoAMAIAAGsAIAMAAAA9ACABAAA-ADACAAA_ACADAAAAQgAgAQAAQwAwAgAARAAgAwAAAHIAIAEAAHMAMAIAAHQAIAMAAACKAQAgAQAAiwEAMAIAAIwBACADAAAAUwAgAQAAVAAwAgAAVQAgEAYAALoLACCTBgAAuQsAMJQGAAD1AQAQlQYAALkLADCWBgEA8QoAIZsGAQDxCgAhngZAAPUKACGfBkAA9QoAIZMHAQDxCgAhlAcBAPEKACGVBwEA8QoAIZYHAQDxCgAhlwcBAPEKACGYBwEA8QoAIZkHIAD0CgAhmgcBAPIKACEBAAAA9QEAIBYGAAC6CwAgkwYAAKkMADCUBgAA9wEAEJUGAACpDAAwlgYBAPEKACGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHOBgAArQyLByLkBgAAqgzkBiLmBhAAqwwAIecGAQDxCgAh6AYCAKwMACGJBwEA8QoAIYsHAQDxCgAhjAcBAPIKACGNBwEA8goAIY4HAQDyCgAhjwcBAPIKACGQBwEA8goAIZEHAACuDAAgkgdAAJ8MACEIBgAAghIAIIwHAAD8DAAgjQcAAPwMACCOBwAA_AwAII8HAAD8DAAgkAcAAPwMACCRBwAA_AwAIJIHAAD8DAAgFgYAALoLACCTBgAAqQwAMJQGAAD3AQAQlQYAAKkMADCWBgEAAAABmwYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhzgYAAK0Miwci5AYAAKoM5AYi5gYQAKsMACHnBgEA8QoAIegGAgCsDAAhiQcBAPEKACGLBwEAAAABjAcBAPIKACGNBwEAAAABjgcBAPIKACGPBwEA8goAIZAHAQDyCgAhkQcAAK4MACCSB0AAnwwAIQMAAAD3AQAgAQAA-AEAMAIAAPkBACADAAAA6QEAIAEAAOoBADACAADrAQAgAwAAAC4AIAEAAC8AMAIAADAAIAMAAAAnACABAAAoADACAAApACAPBgAAugsAIEYAAPYKACBIAACoDAAgSQAAkQwAIJMGAACnDAAwlAYAAP4BABCVBgAApwwAMJYGAQDxCgAhmwYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhxwYBAPEKACHIBgEA8QoAIacHAQDxCgAhqAcAAKYMpgciBAYAAIISACBGAADnDgAgSAAA_RkAIEkAAPAZACAPBgAAugsAIEYAAPYKACBIAACoDAAgSQAAkQwAIJMGAACnDAAwlAYAAP4BABCVBgAApwwAMJYGAQAAAAGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHHBgEA8QoAIcgGAQDxCgAhpwcBAPEKACGoBwAApgymByIDAAAA_gEAIAEAAP8BADACAACAAgAgCEcAAKMMACCTBgAApQwAMJQGAACCAgAQlQYAAKUMADCWBgEA8QoAIZ4GQAD1CgAhowcBAPEKACGmBwAApgymByIBRwAA_BkAIAlHAACjDAAgkwYAAKUMADCUBgAAggIAEJUGAAClDAAwlgYBAAAAAZ4GQAD1CgAhowcBAPEKACGmBwAApgymByLzBwAApAwAIAMAAACCAgAgAQAAgwIAMAIAAIQCACAJAwAA9goAIEcAAKMMACCTBgAAogwAMJQGAACGAgAQlQYAAKIMADCWBgEA8QoAIZ0GAQDxCgAhowcBAPEKACGkB0AA9QoAIQIDAADnDgAgRwAA_BkAIAoDAAD2CgAgRwAAowwAIJMGAACiDAAwlAYAAIYCABCVBgAAogwAMJYGAQAAAAGdBgEA8QoAIaMHAQDxCgAhpAdAAPUKACHyBwAAoQwAIAMAAACGAgAgAQAAhwIAMAIAAIgCACABAAAAggIAIAEAAACGAgAgEAYAALoLACAfAAD2CgAgQAAAoAwAIJMGAACcDAAwlAYAAIwCABCVBgAAnAwAMJYGAQDxCgAhmwYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhzgYAAJ4Mtgci0AZAAJ8MACGuBwEA8QoAIbQHAACdDLQHIrYHAQDyCgAhtwcBAPIKACEGBgAAghIAIB8AAOcOACBAAADnDgAg0AYAAPwMACC2BwAA_AwAILcHAAD8DAAgEAYAALoLACAfAAD2CgAgQAAAoAwAIJMGAACcDAAwlAYAAIwCABCVBgAAnAwAMJYGAQAAAAGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHOBgAAngy2ByLQBkAAnwwAIa4HAQDxCgAhtAcAAJ0MtAcitgcBAPIKACG3BwEA8goAIQMAAACMAgAgAQAAjQIAMAIAAI4CACABAAAATwAgAwAAAFkAIAEAAFoAMAIAAFsAIAMAAABZACABAABaADACAABbACADAAAAwAEAIAEAAMEBADACAAABACABAAAADwAgAQAAABoAIAEAAACBAQAgAQAAANgBACABAAAAMgAgAQAAAB4AIAEAAAALACABAAAAXwAgAQAAAFEAIAEAAAAjACABAAAANwAgAQAAAOMBACABAAAAaQAgAQAAAD0AIAEAAABCACABAAAAcgAgAQAAAIoBACABAAAAUwAgAQAAAPcBACABAAAA6QEAIAEAAAAuACABAAAAJwAgAQAAAP4BACABAAAAjAIAIAEAAABZACABAAAAWQAgAQAAAMABACADAAAAXwAgAQAArwEAMAIAALABACADAAAAUQAgAQAAsgEAMAIAALMBACADAAAA4wEAIAEAAOQBADACAADlAQAgAwAAAOMBACABAADkAQAwAgAA5QEAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgESQAAPYKACCTBgAA8AoAMJQGAAC1AgAQlQYAAPAKADCWBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACGrBgEA8QoAIawGAQDxCgAhrQYBAPEKACGuBgEA8QoAIa8GAQDyCgAhsAYAAOoKACCxBgAA6goAILIGAADzCgAgswYAAPMKACC0BiAA9AoAIQEAAAC1AgAgAwAAAEkAIAEAAEoAMAIAAEsAIAMAAABJACABAABKADACAABLACANFgAA9goAIJMGAACbCwAwlAYAALkCABCVBgAAmwsAMJYGAQDxCgAhngZAAPUKACGfBkAA9QoAIawGAQDxCgAhrQYBAPEKACGyBgAA8woAILQGIAD0CgAh7QYBAPEKACHuBgAA6goAIAEAAAC5AgAgCgMAAPYKACCTBgAAmwwAMJQGAAC7AgAQlQYAAJsMADCWBgEA8QoAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIdYHAQDxCgAh1wdAAPUKACEBAwAA5w4AIAoDAAD2CgAgkwYAAJsMADCUBgAAuwIAEJUGAACbDAAwlgYBAAAAAZ0GAQAAAAGeBkAA9QoAIZ8GQAD1CgAh1gcBAPEKACHXB0AA9QoAIQMAAAC7AgAgAQAAvAIAMAIAAL0CACADAAAAWQAgAQAAWgAwAgAAWwAgAwAAAFkAIAEAAFoAMAIAAFsAIAMAAACMAgAgAQAAjQIAMAIAAI4CACADAAAAjAIAIAEAAI0CADACAACOAgAgAwAAAP4BACABAAD_AQAwAgAAgAIAIAMAAACGAgAgAQAAhwIAMAIAAIgCACADAAAAwAEAIAEAAMEBADACAAABACABAAAAAwAgAQAAAAcAIAEAAAALACABAAAAXwAgAQAAAFEAIAEAAADjAQAgAQAAAOMBACABAAAAaQAgAQAAAGkAIAEAAABJACABAAAASQAgAQAAALsCACABAAAAWQAgAQAAAFkAIAEAAACMAgAgAQAAAIwCACABAAAA_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-gsAIFYAAPoLACBXAAD5CwAgWAAA-QsAIFkAAPgLACBaAACRDAAgkwYAAIsMADCUBgAATwAQlQYAAIsMADCWBgEAAAABmgYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPEKACGmBwEA8QoAIeYHAQAAAAHnByAA9AoAIegHAQDyCgAh6QcBAPIKACHqBwEA8goAIesHAQDyCgAh7AcBAPIKACHtBwEA8goAIe4HAQDxCgAhAQAAAJoDACABAAAAmgMAIBwEAADrGQAgBQAA7BkAIBAAAMEXACAYAADCFwAgNQAA9BEAIDoAAM8XACA-AADAFwAgQwAAxBcAIE4AAMQXACBPAAD0EQAgUAAA7RkAIFEAAOMRACBSAADjEQAgUwAA7hkAIFQAAO8ZACBVAADOFwAgVgAAzhcAIFcAAM0XACBYAADNFwAgWQAAzBcAIFoAAPAZACCaBgAA_AwAIOgHAAD8DAAg6QcAAPwMACDqBwAA_AwAIOsHAAD8DAAg7AcAAPwMACDtBwAA_AwAIAMAAABPACABAACdAwAwAgAAmgMAIAMAAABPACABAACdAwAwAgAAmgMAIAMAAABPACABAACdAwAwAgAAmgMAICQEAADWGQAgBQAA1xkAIBAAANkZACAYAADaGQAgNQAA3RkAIDoAAOoZACA-AADYGQAgQwAA2xkAIE4AANwZACBPAADeGQAgUAAA3xkAIFEAAOAZACBSAADhGQAgUwAA4hkAIFQAAOMZACBVAADkGQAgVgAA5RkAIFcAAOYZACBYAADnGQAgWQAA6BkAIFoAAOkZACCWBgEAAAABmgYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAaYHAQAAAAHmBwEAAAAB5wcgAAAAAegHAQAAAAHpBwEAAAAB6gcBAAAAAesHAQAAAAHsBwEAAAAB7QcBAAAAAe4HAQAAAAEBYAAAoQMAIA-WBgEAAAABmgYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAaYHAQAAAAHmBwEAAAAB5wcgAAAAAegHAQAAAAHpBwEAAAAB6gcBAAAAAesHAQAAAAHsBwEAAAAB7QcBAAAAAe4HAQAAAAEBYAAAowMAMAFgAACjAwAwJAQAAIEYACAFAACCGAAgEAAAhBgAIBgAAIUYACA1AACIGAAgOgAAlRgAID4AAIMYACBDAACGGAAgTgAAhxgAIE8AAIkYACBQAACKGAAgUQAAixgAIFIAAIwYACBTAACNGAAgVAAAjhgAIFUAAI8YACBWAACQGAAgVwAAkRgAIFgAAJIYACBZAACTGAAgWgAAlBgAIJYGAQCADQAhmgYBAIENACGeBkAAgg0AIZ8GQACCDQAh7wYBAIANACGmBwEAgA0AIeYHAQCADQAh5wcgAOIOACHoBwEAgQ0AIekHAQCBDQAh6gcBAIENACHrBwEAgQ0AIewHAQCBDQAh7QcBAIENACHuBwEAgA0AIQIAAACaAwAgYAAApgMAIA-WBgEAgA0AIZoGAQCBDQAhngZAAIINACGfBkAAgg0AIe8GAQCADQAhpgcBAIANACHmBwEAgA0AIecHIADiDgAh6AcBAIENACHpBwEAgQ0AIeoHAQCBDQAh6wcBAIENACHsBwEAgQ0AIe0HAQCBDQAh7gcBAIANACECAAAATwAgYAAAqAMAIAIAAABPACBgAACoAwAgAwAAAJoDACBnAAChAwAgaAAApgMAIAEAAACaAwAgAQAAAE8AIAoUAAD-FwAgbQAAgBgAIG4AAP8XACCaBgAA_AwAIOgHAAD8DAAg6QcAAPwMACDqBwAA_AwAIOsHAAD8DAAg7AcAAPwMACDtBwAA_AwAIBKTBgAAigwAMJQGAACvAwAQlQYAAIoMADCWBgEA3goAIZoGAQDfCgAhngZAAOAKACGfBkAA4AoAIe8GAQDeCgAhpgcBAN4KACHmBwEA3goAIecHIADsCgAh6AcBAN8KACHpBwEA3woAIeoHAQDfCgAh6wcBAN8KACHsBwEA3woAIe0HAQDfCgAh7gcBAN4KACEDAAAATwAgAQAArgMAMGwAAK8DACADAAAATwAgAQAAnQMAMAIAAJoDACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkDAAD9FwAglgYBAAAAAZ0GAQAAAAGeBkAAAAABnwZAAAAAAdcHQAAAAAHjBwEAAAAB5AcBAAAAAeUHAQAAAAEBYAAAtwMAIAiWBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAAB1wdAAAAAAeMHAQAAAAHkBwEAAAAB5QcBAAAAAQFgAAC5AwAwAWAAALkDADAJAwAA_BcAIJYGAQCADQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAh1wdAAIINACHjBwEAgA0AIeQHAQCBDQAh5QcBAIENACECAAAABQAgYAAAvAMAIAiWBgEAgA0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIdcHQACCDQAh4wcBAIANACHkBwEAgQ0AIeUHAQCBDQAhAgAAAAMAIGAAAL4DACACAAAAAwAgYAAAvgMAIAMAAAAFACBnAAC3AwAgaAAAvAMAIAEAAAAFACABAAAAAwAgBRQAAPkXACBtAAD7FwAgbgAA-hcAIOQHAAD8DAAg5QcAAPwMACALkwYAAIkMADCUBgAAxQMAEJUGAACJDAAwlgYBAN4KACGdBgEA3goAIZ4GQADgCgAhnwZAAOAKACHXB0AA4AoAIeMHAQDeCgAh5AcBAN8KACHlBwEA3woAIQMAAAADACABAADEAwAwbAAAxQMAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAAD4FwAglgYBAAAAAZ0GAQAAAAGeBkAAAAABnwZAAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwEAAAAB3wdAAAAAAeAHQAAAAAHhBwEAAAAB4gcBAAAAAQFgAADNAwAgDZYGAQAAAAGdBgEAAAABngZAAAAAAZ8GQAAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAAB3gcBAAAAAd8HQAAAAAHgB0AAAAAB4QcBAAAAAeIHAQAAAAEBYAAAzwMAMAFgAADPAwAwDgMAAPcXACCWBgEAgA0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIdoHAQCADQAh2wcBAIANACHcBwEAgQ0AId0HAQCBDQAh3gcBAIENACHfB0AAmA0AIeAHQACYDQAh4QcBAIENACHiBwEAgQ0AIQIAAAAJACBgAADSAwAgDZYGAQCADQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAh2gcBAIANACHbBwEAgA0AIdwHAQCBDQAh3QcBAIENACHeBwEAgQ0AId8HQACYDQAh4AdAAJgNACHhBwEAgQ0AIeIHAQCBDQAhAgAAAAcAIGAAANQDACACAAAABwAgYAAA1AMAIAMAAAAJACBnAADNAwAgaAAA0gMAIAEAAAAJACABAAAABwAgChQAAPQXACBtAAD2FwAgbgAA9RcAINwHAAD8DAAg3QcAAPwMACDeBwAA_AwAIN8HAAD8DAAg4AcAAPwMACDhBwAA_AwAIOIHAAD8DAAgEJMGAACIDAAwlAYAANsDABCVBgAAiAwAMJYGAQDeCgAhnQYBAN4KACGeBkAA4AoAIZ8GQADgCgAh2gcBAN4KACHbBwEA3goAIdwHAQDfCgAh3QcBAN8KACHeBwEA3woAId8HQAD7CgAh4AdAAPsKACHhBwEA3woAIeIHAQDfCgAhAwAAAAcAIAEAANoDADBsAADbAwAgAwAAAAcAIAEAAAgAMAIAAAkAIAmTBgAAhwwAMJQGAADhAwAQlQYAAIcMADCWBgEAAAABngZAAPUKACGfBkAA9QoAIdcHQAD1CgAh2AcBAPEKACHZBwEA8QoAIQEAAADeAwAgAQAAAN4DACAJkwYAAIcMADCUBgAA4QMAEJUGAACHDAAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh1wdAAPUKACHYBwEA8QoAIdkHAQDxCgAhAAMAAADhAwAgAQAA4gMAMAIAAN4DACADAAAA4QMAIAEAAOIDADACAADeAwAgAwAAAOEDACABAADiAwAwAgAA3gMAIAaWBgEAAAABngZAAAAAAZ8GQAAAAAHXB0AAAAAB2AcBAAAAAdkHAQAAAAEBYAAA5gMAIAaWBgEAAAABngZAAAAAAZ8GQAAAAAHXB0AAAAAB2AcBAAAAAdkHAQAAAAEBYAAA6AMAMAFgAADoAwAwBpYGAQCADQAhngZAAIINACGfBkAAgg0AIdcHQACCDQAh2AcBAIANACHZBwEAgA0AIQIAAADeAwAgYAAA6wMAIAaWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHXB0AAgg0AIdgHAQCADQAh2QcBAIANACECAAAA4QMAIGAAAO0DACACAAAA4QMAIGAAAO0DACADAAAA3gMAIGcAAOYDACBoAADrAwAgAQAAAN4DACABAAAA4QMAIAMUAADxFwAgbQAA8xcAIG4AAPIXACAJkwYAAIYMADCUBgAA9AMAEJUGAACGDAAwlgYBAN4KACGeBkAA4AoAIZ8GQADgCgAh1wdAAOAKACHYBwEA3goAIdkHAQDeCgAhAwAAAOEDACABAADzAwAwbAAA9AMAIAMAAADhAwAgAQAA4gMAMAIAAN4DACABAAAAvQIAIAEAAAC9AgAgAwAAALsCACABAAC8AgAwAgAAvQIAIAMAAAC7AgAgAQAAvAIAMAIAAL0CACADAAAAuwIAIAEAALwCADACAAC9AgAgBwMAAPAXACCWBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAAB1gcBAAAAAdcHQAAAAAEBYAAA_AMAIAaWBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAAB1gcBAAAAAdcHQAAAAAEBYAAA_gMAMAFgAAD-AwAwBwMAAO8XACCWBgEAgA0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIdYHAQCADQAh1wdAAIINACECAAAAvQIAIGAAAIEEACAGlgYBAIANACGdBgEAgA0AIZ4GQACCDQAhnwZAAIINACHWBwEAgA0AIdcHQACCDQAhAgAAALsCACBgAACDBAAgAgAAALsCACBgAACDBAAgAwAAAL0CACBnAAD8AwAgaAAAgQQAIAEAAAC9AgAgAQAAALsCACADFAAA7BcAIG0AAO4XACBuAADtFwAgCZMGAACFDAAwlAYAAIoEABCVBgAAhQwAMJYGAQDeCgAhnQYBAN4KACGeBkAA4AoAIZ8GQADgCgAh1gcBAN4KACHXB0AA4AoAIQMAAAC7AgAgAQAAiQQAMGwAAIoEACADAAAAuwIAIAEAALwCADACAAC9AgAgAQAAAKsBACABAAAAqwEAIAMAAACBAQAgAQAAqgEAMAIAAKsBACADAAAAgQEAIAEAAKoBADACAACrAQAgAwAAAIEBACABAACqAQAwAgAAqwEAIAoGAACAFwAgCAAArRUAICgAAK4VACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAe8GAQAAAAH1BgEAAAABAWAAAJIEACAHlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAQFgAACUBAAwAWAAAJQEADABAAAAFQAgCgYAAP4WACAIAAChFQAgKAAAohUAIJYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIfUGAQCBDQAhAgAAAKsBACBgAACYBAAgB5YGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIfUGAQCBDQAhAgAAAIEBACBgAACaBAAgAgAAAIEBACBgAACaBAAgAQAAABUAIAMAAACrAQAgZwAAkgQAIGgAAJgEACABAAAAqwEAIAEAAACBAQAgBRQAAOkXACBtAADrFwAgbgAA6hcAIJwGAAD8DAAg9QYAAPwMACAKkwYAAIQMADCUBgAAogQAEJUGAACEDAAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIe8GAQDeCgAh9QYBAN8KACEDAAAAgQEAIAEAAKEEADBsAACiBAAgAwAAAIEBACABAACqAQAwAgAAqwEAIAEAAADaAQAgAQAAANoBACADAAAA2AEAIAEAANkBADACAADaAQAgAwAAANgBACABAADZAQAwAgAA2gEAIAMAAADYAQAgAQAA2QEAMAIAANoBACALBgAA6BcAICwAAJUVACCWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAdEHAQAAAAHSBwEAAAAB0wcCAAAAAdUHAAAA1QcCAWAAAKoEACAJlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAe8GAQAAAAHRBwEAAAAB0gcBAAAAAdMHAgAAAAHVBwAAANUHAgFgAACsBAAwAWAAAKwEADALBgAA5xcAICwAAIoVACCWBgEAgA0AIZsGAQCADQAhngZAAIINACGfBkAAgg0AIe8GAQCBDQAh0QcBAIANACHSBwEAgA0AIdMHAgCJDwAh1QcAAIgV1QciAgAAANoBACBgAACvBAAgCZYGAQCADQAhmwYBAIANACGeBkAAgg0AIZ8GQACCDQAh7wYBAIENACHRBwEAgA0AIdIHAQCADQAh0wcCAIkPACHVBwAAiBXVByICAAAA2AEAIGAAALEEACACAAAA2AEAIGAAALEEACADAAAA2gEAIGcAAKoEACBoAACvBAAgAQAAANoBACABAAAA2AEAIAYUAADiFwAgbQAA5RcAIG4AAOQXACD_AQAA4xcAIIACAADmFwAg7wYAAPwMACAMkwYAAIAMADCUBgAAuAQAEJUGAACADAAwlgYBAN4KACGbBgEA3goAIZ4GQADgCgAhnwZAAOAKACHvBgEA3woAIdEHAQDeCgAh0gcBAN4KACHTBwIAjAsAIdUHAACBDNUHIgMAAADYAQAgAQAAtwQAMGwAALgEACADAAAA2AEAIAEAANkBADACAADaAQAgAQAAACAAIAEAAAAgACADAAAAHgAgAQAAHwAwAgAAIAAgAwAAAB4AIAEAAB8AMAIAACAAIAMAAAAeACABAAAfADACAAAgACAPBgAAyxEAIAgAAMwRACAJAAD0FAAgDAAAzREAIA8AAM4RACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAGBBwIAAAABhwcBAAAAAc8HAQAAAAHQBwEAAAABAWAAAMAEACAKlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABgQcCAAAAAYcHAQAAAAHPBwEAAAAB0AcBAAAAAQFgAADCBAAwAWAAAMIEADABAAAAGgAgDwYAALQRACAIAAC1EQAgCQAA8hQAIAwAALYRACAPAAC3EQAglgYBAIANACGbBgEAgA0AIZwGAQCADQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhgQcCALYQACGHBwEAgQ0AIc8HAQCADQAh0AcBAIANACECAAAAIAAgYAAAxgQAIAqWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGBBwIAthAAIYcHAQCBDQAhzwcBAIANACHQBwEAgA0AIQIAAAAeACBgAADIBAAgAgAAAB4AIGAAAMgEACABAAAAGgAgAwAAACAAIGcAAMAEACBoAADGBAAgAQAAACAAIAEAAAAeACAIFAAA3RcAIG0AAOAXACBuAADfFwAg_wEAAN4XACCAAgAA4RcAIPUGAAD8DAAggQcAAPwMACCHBwAA_AwAIA2TBgAA_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_AwAIIYHAAD8DAAgugcAAPwMACAKkwYAAP0LADCUBgAAggUAEJUGAAD9CwAwlgYBAN4KACGeBkAA4AoAIZ8GQADgCgAh9QYBAN8KACGGBwEA3woAIboHAQDfCgAhzQcBAN4KACEDAAAAFQAgAQAAgQUAMGwAAIIFACADAAAAFQAgAQAAFgAwAgAAFwAgAQAAABEAIAEAAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAMAAAAPACABAAAQADACAAARACAJBgAA1BcAIDsAAJ4XACCWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAAB9QYBAAAAAboHAQAAAAHNBwEAAAABAWAAAIoFACAHlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAG6BwEAAAABzQcBAAAAAQFgAACMBQAwAWAAAIwFADABAAAAEwAgCQYAANMXACA7AADGFQAglgYBAIANACGbBgEAgQ0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIboHAQCBDQAhzQcBAIANACECAAAAEQAgYAAAkAUAIAeWBgEAgA0AIZsGAQCBDQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhugcBAIENACHNBwEAgA0AIQIAAAAPACBgAACSBQAgAgAAAA8AIGAAAJIFACABAAAAEwAgAwAAABEAIGcAAIoFACBoAACQBQAgAQAAABEAIAEAAAAPACAGFAAA0BcAIG0AANIXACBuAADRFwAgmwYAAPwMACD1BgAA_AwAILoHAAD8DAAgCpMGAAD8CwAwlAYAAJoFABCVBgAA_AsAMJYGAQDeCgAhmwYBAN8KACGeBkAA4AoAIZ8GQADgCgAh9QYBAN8KACG6BwEA3woAIc0HAQDeCgAhAwAAAA8AIAEAAJkFADBsAACaBQAgAwAAAA8AIAEAABAAMAIAABEAICcLAACeCwAgDAAAoAsAIA8AAO8LACAbAACiCwAgKAAAnwsAICoAAKELACAsAAD3CwAgMAAA6AsAIDEAAOkLACAyAADrCwAgMwAA7QsAIDQAAO4LACA1AACxCwAgNgAA8QsAIDcAAPILACA4AADzCwAgOgAA-wsAIDwAAOcLACA9AADqCwAgPgAA7AsAIEIAAPYLACBDAADwCwAgRAAA9AsAIEUAAPULACBKAAD4CwAgSwAA-QsAIEwAAPoLACBNAAD6CwAgkwYAAOULADCUBgAAEwAQlQYAAOULADCWBgEAAAABngZAAPUKACGfBkAA9QoAIcoGAADmC7wHI-8GAQDxCgAh9QYBAPIKACG6BwEA8goAIb0HAQDyCgAhAQAAAJ0FACABAAAAnQUAICALAACDEQAgDAAAhREAIA8AAMMXACAbAACHEQAgKAAAhBEAICoAAIYRACAsAADLFwAgMAAAvBcAIDEAAL0XACAyAAC_FwAgMwAAwRcAIDQAAMIXACA1AAD0EQAgNgAAxRcAIDcAAMYXACA4AADHFwAgOgAAzxcAIDwAALsXACA9AAC-FwAgPgAAwBcAIEIAAMoXACBDAADEFwAgRAAAyBcAIEUAAMkXACBKAADMFwAgSwAAzRcAIEwAAM4XACBNAADOFwAgygYAAPwMACD1BgAA_AwAILoHAAD8DAAgvQcAAPwMACADAAAAEwAgAQAAoAUAMAIAAJ0FACADAAAAEwAgAQAAoAUAMAIAAJ0FACADAAAAEwAgAQAAoAUAMAIAAJ0FACAkCwAAtBcAIAwAAKgXACAPAACpFwAgGwAAsBcAICgAAKMXACAqAACvFwAgLAAAtRcAIDAAAKAXACAxAAChFwAgMgAApBcAIDMAAKYXACA0AACnFwAgNQAAqxcAIDYAAKwXACA3AACtFwAgOAAArhcAIDoAALoXACA8AACfFwAgPQAAohcAID4AAKUXACBCAACzFwAgQwAAqhcAIEQAALEXACBFAACyFwAgSgAAthcAIEsAALcXACBMAAC4FwAgTQAAuRcAIJYGAQAAAAGeBkAAAAABnwZAAAAAAcoGAAAAvAcD7wYBAAAAAfUGAQAAAAG6BwEAAAABvQcBAAAAAQFgAACkBQAgCJYGAQAAAAGeBkAAAAABnwZAAAAAAcoGAAAAvAcD7wYBAAAAAfUGAQAAAAG6BwEAAAABvQcBAAAAAQFgAACmBQAwAWAAAKYFADAkCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhAgAAAJ0FACBgAACpBQAgCJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhAgAAABMAIGAAAKsFACACAAAAEwAgYAAAqwUAIAMAAACdBQAgZwAApAUAIGgAAKkFACABAAAAnQUAIAEAAAATACAHFAAA6hIAIG0AAOwSACBuAADrEgAgygYAAPwMACD1BgAA_AwAILoHAAD8DAAgvQcAAPwMACALkwYAAOQLADCUBgAAsgUAEJUGAADkCwAwlgYBAN4KACGeBkAA4AoAIZ8GQADgCgAhygYAANgLvAcj7wYBAN4KACH1BgEA3woAIboHAQDfCgAhvQcBAN8KACEDAAAAEwAgAQAAsQUAMGwAALIFACADAAAAEwAgAQAAoAUAMAIAAJ0FACABAAAA5QEAIAEAAADlAQAgAwAAAOMBACABAADkAQAwAgAA5QEAIAMAAADjAQAgAQAA5AEAMAIAAOUBACADAAAA4wEAIAEAAOQBADACAADlAQAgHwYAAOgSACA_AADmEgAgQAAA5xIAIEIAAOkSACCWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAABzgYAAADMBwLQBkAAAAAB9QYBAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAboHAQAAAAG8BwAAALwHA70HAQAAAAG-BwAAAOQGA78HEAAAAAHABwEAAAABwQcCAAAAAcIHAAAAiwcCwwcBAAAAAcQHAQAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQeAAAAAAcoHQAAAAAHMBwEAAAABAWAAALoFACAblgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAAzAcC0AZAAAAAAfUGAQAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAG6BwEAAAABvAcAAAC8BwO9BwEAAAABvgcAAADkBgO_BxAAAAABwAcBAAAAAcEHAgAAAAHCBwAAAIsHAsMHAQAAAAHEBwEAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHgAAAAAHKB0AAAAABzAcBAAAAAQFgAAC8BQAwAWAAALwFADABAAAATwAgAQAAABMAIB8GAADYEgAgPwAA1hIAIEAAANcSACBCAADZEgAglgYBAIANACGbBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHOBgAA1RLMByLQBkAAmA0AIfUGAQCBDQAhtwcBAIENACG4BwEAgA0AIbkHAQCADQAhugcBAIENACG8BwAA0hK8ByO9BwEAgQ0AIb4HAADTEuQGI78HEADUEgAhwAcBAIANACHBBwIAthAAIcIHAAD6EYsHIsMHAQCBDQAhxAcBAIENACHFBwEAgQ0AIcYHAQCBDQAhxwcBAIENACHIBwEAgQ0AIckHgAAAAAHKB0AAmA0AIcwHAQCBDQAhAgAAAOUBACBgAADBBQAgG5YGAQCADQAhmwYBAIENACGeBkAAgg0AIZ8GQACCDQAhzgYAANUSzAci0AZAAJgNACH1BgEAgQ0AIbcHAQCBDQAhuAcBAIANACG5BwEAgA0AIboHAQCBDQAhvAcAANISvAcjvQcBAIENACG-BwAA0xLkBiO_BxAA1BIAIcAHAQCADQAhwQcCALYQACHCBwAA-hGLByLDBwEAgQ0AIcQHAQCBDQAhxQcBAIENACHGBwEAgQ0AIccHAQCBDQAhyAcBAIENACHJB4AAAAABygdAAJgNACHMBwEAgQ0AIQIAAADjAQAgYAAAwwUAIAIAAADjAQAgYAAAwwUAIAEAAABPACABAAAAEwAgAwAAAOUBACBnAAC6BQAgaAAAwQUAIAEAAADlAQAgAQAAAOMBACAYFAAAzRIAIG0AANASACBuAADPEgAg_wEAAM4SACCAAgAA0RIAIJsGAAD8DAAg0AYAAPwMACD1BgAA_AwAILcHAAD8DAAgugcAAPwMACC8BwAA_AwAIL0HAAD8DAAgvgcAAPwMACC_BwAA_AwAIMEHAAD8DAAgwwcAAPwMACDEBwAA_AwAIMUHAAD8DAAgxgcAAPwMACDHBwAA_AwAIMgHAAD8DAAgyQcAAPwMACDKBwAA_AwAIMwHAAD8DAAgHpMGAADXCwAwlAYAAMwFABCVBgAA1wsAMJYGAQDeCgAhmwYBAN8KACGeBkAA4AoAIZ8GQADgCgAhzgYAANsLzAci0AZAAPsKACH1BgEA3woAIbcHAQDfCgAhuAcBAN4KACG5BwEA3goAIboHAQDfCgAhvAcAANgLvAcjvQcBAN8KACG-BwAA2QvkBiO_BxAA2gsAIcAHAQDeCgAhwQcCAKQLACHCBwAAswuLByLDBwEA3woAIcQHAQDfCgAhxQcBAN8KACHGBwEA3woAIccHAQDfCgAhyAcBAN8KACHJBwAAtAsAIMoHQAD7CgAhzAcBAN8KACEDAAAA4wEAIAEAAMsFADBsAADMBQAgAwAAAOMBACABAADkAQAwAgAA5QEAIAEAAACOAgAgAQAAAI4CACADAAAAjAIAIAEAAI0CADACAACOAgAgAwAAAIwCACABAACNAgAwAgAAjgIAIAMAAACMAgAgAQAAjQIAMAIAAI4CACANBgAAyxIAIB8AAMoSACBAAADMEgAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAAtgcC0AZAAAAAAa4HAQAAAAG0BwAAALQHArYHAQAAAAG3BwEAAAABAWAAANQFACAKlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAAtgcC0AZAAAAAAa4HAQAAAAG0BwAAALQHArYHAQAAAAG3BwEAAAABAWAAANYFADABYAAA1gUAMAEAAABPACANBgAAyBIAIB8AAMcSACBAAADJEgAglgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACHOBgAAxhK2ByLQBkAAmA0AIa4HAQCADQAhtAcAAMUStAcitgcBAIENACG3BwEAgQ0AIQIAAACOAgAgYAAA2gUAIAqWBgEAgA0AIZsGAQCADQAhngZAAIINACGfBkAAgg0AIc4GAADGErYHItAGQACYDQAhrgcBAIANACG0BwAAxRK0ByK2BwEAgQ0AIbcHAQCBDQAhAgAAAIwCACBgAADcBQAgAgAAAIwCACBgAADcBQAgAQAAAE8AIAMAAACOAgAgZwAA1AUAIGgAANoFACABAAAAjgIAIAEAAACMAgAgBhQAAMISACBtAADEEgAgbgAAwxIAINAGAAD8DAAgtgcAAPwMACC3BwAA_AwAIA2TBgAA0AsAMJQGAADkBQAQlQYAANALADCWBgEA3goAIZsGAQDeCgAhngZAAOAKACGfBkAA4AoAIc4GAADSC7YHItAGQAD7CgAhrgcBAN4KACG0BwAA0Qu0ByK2BwEA3woAIbcHAQDfCgAhAwAAAIwCACABAADjBQAwbAAA5AUAIAMAAACMAgAgAQAAjQIAMAIAAI4CACABAAAAWwAgAQAAAFsAIAMAAABZACABAABaADACAABbACADAAAAWQAgAQAAWgAwAgAAWwAgAwAAAFkAIAEAAFoAMAIAAFsAIBcQAACjDwAgFwAApA0AIBgAAKUNACAdAAChDQAgHgAAog0AIB8AAKMNACAgAACmDQAglgYBAAAAAZ4GQAAAAAGfBkAAAAABwAYBAAAAAcIGAQAAAAHOBgAAAKwHAtAGQAAAAAHTBgEAAAABqgcAAACqBwKsBwEAAAABrQcBAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyB0AAAAABAWAAAOwFACAQlgYBAAAAAZ4GQAAAAAGfBkAAAAABwAYBAAAAAcIGAQAAAAHOBgAAAKwHAtAGQAAAAAHTBgEAAAABqgcAAACqBwKsBwEAAAABrQcBAAAAAa4HAQAAAAGvBwEAAAABsAcBAAAAAbEHAQAAAAGyB0AAAAABAWAAAO4FADABYAAA7gUAMAEAAABPACABAAAAUQAgAQAAAF8AIAEAAAAVACAXEAAAoQ8AIBcAAJ0NACAYAACeDQAgHQAAmg0AIB4AAJsNACAfAACcDQAgIAAAnw0AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcAGAQCBDQAhwgYBAIENACHOBgAAlw2sByLQBkAAmA0AIdMGAQCBDQAhqgcAAJYNqgcirAcBAIANACGtBwEAgA0AIa4HAQCADQAhrwcBAIENACGwBwEAgQ0AIbEHAQCBDQAhsgdAAIINACECAAAAWwAgYAAA9QUAIBCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHABgEAgQ0AIcIGAQCBDQAhzgYAAJcNrAci0AZAAJgNACHTBgEAgQ0AIaoHAACWDaoHIqwHAQCADQAhrQcBAIANACGuBwEAgA0AIa8HAQCBDQAhsAcBAIENACGxBwEAgQ0AIbIHQACCDQAhAgAAAFkAIGAAAPcFACACAAAAWQAgYAAA9wUAIAEAAABPACABAAAAUQAgAQAAAF8AIAEAAAAVACADAAAAWwAgZwAA7AUAIGgAAPUFACABAAAAWwAgAQAAAFkAIAoUAAC_EgAgbQAAwRIAIG4AAMASACDABgAA_AwAIMIGAAD8DAAg0AYAAPwMACDTBgAA_AwAIK8HAAD8DAAgsAcAAPwMACCxBwAA_AwAIBOTBgAAyQsAMJQGAACCBgAQlQYAAMkLADCWBgEA3goAIZ4GQADgCgAhnwZAAOAKACHABgEA3woAIcIGAQDfCgAhzgYAAMsLrAci0AZAAPsKACHTBgEA3woAIaoHAADKC6oHIqwHAQDeCgAhrQcBAN4KACGuBwEA3goAIa8HAQDfCgAhsAcBAN8KACGxBwEA3woAIbIHQADgCgAhAwAAAFkAIAEAAIEGADBsAACCBgAgAwAAAFkAIAEAAFoAMAIAAFsAIAEAAACAAgAgAQAAAIACACADAAAA_gEAIAEAAP8BADACAACAAgAgAwAAAP4BACABAAD_AQAwAgAAgAIAIAMAAAD-AQAgAQAA_wEAMAIAAIACACAMBgAAuxIAIEYAALwSACBIAAC9EgAgSQAAvhIAIJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHHBgEAAAAByAYBAAAAAacHAQAAAAGoBwAAAKYHAgFgAACKBgAgCJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHHBgEAAAAByAYBAAAAAacHAQAAAAGoBwAAAKYHAgFgAACMBgAwAWAAAIwGADAMBgAAnxIAIEYAAKASACBIAAChEgAgSQAAohIAIJYGAQCADQAhmwYBAIANACGeBkAAgg0AIZ8GQACCDQAhxwYBAIANACHIBgEAgA0AIacHAQCADQAhqAcAAJkSpgciAgAAAIACACBgAACPBgAgCJYGAQCADQAhmwYBAIANACGeBkAAgg0AIZ8GQACCDQAhxwYBAIANACHIBgEAgA0AIacHAQCADQAhqAcAAJkSpgciAgAAAP4BACBgAACRBgAgAgAAAP4BACBgAACRBgAgAwAAAIACACBnAACKBgAgaAAAjwYAIAEAAACAAgAgAQAAAP4BACADFAAAnBIAIG0AAJ4SACBuAACdEgAgC5MGAADICwAwlAYAAJgGABCVBgAAyAsAMJYGAQDeCgAhmwYBAN4KACGeBkAA4AoAIZ8GQADgCgAhxwYBAN4KACHIBgEA3goAIacHAQDeCgAhqAcAAMULpgciAwAAAP4BACABAACXBgAwbAAAmAYAIAMAAAD-AQAgAQAA_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_AQAAhBIAIIACAACHEgAgjAcAAPwMACCNBwAA_AwAII4HAAD8DAAgjwcAAPwMACCQBwAA_AwAIJEHAAD8DAAgkgcAAPwMACAakwYAALsLADCUBgAA8AYAEJUGAAC7CwAwlgYBAN4KACGbBgEA3goAIZwGAQDeCgAhngZAAOAKACGfBkAA4AoAIcIGAQDeCgAhzgYAAL0Lnwci5gYQAIsLACHnBgEA3goAIegGAgCMCwAh9wYBAN4KACGLBwEA3goAIYwHAQDfCgAhjQcBAN8KACGOBwEA3woAIY8HAQDfCgAhkAcBAN8KACGRBwAAtAsAIJIHQAD7CgAhmwcBAN4KACGdBwAAvAudByKfBwEA3goAIaAHQADgCgAhAwAAAFMAIAEAAO8GADBsAADwBgAgAwAAAFMAIAEAAFQAMAIAAFUAIBAGAAC6CwAgkwYAALkLADCUBgAA9QEAEJUGAAC5CwAwlgYBAAAAAZsGAQAAAAGeBkAA9QoAIZ8GQAD1CgAhkwcBAPEKACGUBwEA8QoAIZUHAQDxCgAhlgcBAPEKACGXBwEA8QoAIZgHAQDxCgAhmQcgAPQKACGaBwEA8goAIQEAAADzBgAgAQAAAPMGACACBgAAghIAIJoHAAD8DAAgAwAAAPUBACABAAD2BgAwAgAA8wYAIAMAAAD1AQAgAQAA9gYAMAIAAPMGACADAAAA9QEAIAEAAPYGADACAADzBgAgDQYAAIESACCWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAABkwcBAAAAAZQHAQAAAAGVBwEAAAABlgcBAAAAAZcHAQAAAAGYBwEAAAABmQcgAAAAAZoHAQAAAAEBYAAA-gYAIAyWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAABkwcBAAAAAZQHAQAAAAGVBwEAAAABlgcBAAAAAZcHAQAAAAGYBwEAAAABmQcgAAAAAZoHAQAAAAEBYAAA_AYAMAFgAAD8BgAwDQYAAIASACCWBgEAgA0AIZsGAQCADQAhngZAAIINACGfBkAAgg0AIZMHAQCADQAhlAcBAIANACGVBwEAgA0AIZYHAQCADQAhlwcBAIANACGYBwEAgA0AIZkHIADiDgAhmgcBAIENACECAAAA8wYAIGAAAP8GACAMlgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACGTBwEAgA0AIZQHAQCADQAhlQcBAIANACGWBwEAgA0AIZcHAQCADQAhmAcBAIANACGZByAA4g4AIZoHAQCBDQAhAgAAAPUBACBgAACBBwAgAgAAAPUBACBgAACBBwAgAwAAAPMGACBnAAD6BgAgaAAA_wYAIAEAAADzBgAgAQAAAPUBACAEFAAA_REAIG0AAP8RACBuAAD-EQAgmgcAAPwMACAPkwYAALgLADCUBgAAiAcAEJUGAAC4CwAwlgYBAN4KACGbBgEA3goAIZ4GQADgCgAhnwZAAOAKACGTBwEA3goAIZQHAQDeCgAhlQcBAN4KACGWBwEA3goAIZcHAQDeCgAhmAcBAN4KACGZByAA7AoAIZoHAQDfCgAhAwAAAPUBACABAACHBwAwbAAAiAcAIAMAAAD1AQAgAQAA9gYAMAIAAPMGACABAAAA-QEAIAEAAAD5AQAgAwAAAPcBACABAAD4AQAwAgAA-QEAIAMAAAD3AQAgAQAA-AEAMAIAAPkBACADAAAA9wEAIAEAAPgBADACAAD5AQAgEwYAAPwRACCWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAABzgYAAACLBwLkBgAAAOQGAuYGEAAAAAHnBgEAAAAB6AYCAAAAAYkHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOBwEAAAABjwcBAAAAAZAHAQAAAAGRB4AAAAABkgdAAAAAAQFgAACQBwAgEpYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAIsHAuQGAAAA5AYC5gYQAAAAAecGAQAAAAHoBgIAAAABiQcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HAQAAAAGPBwEAAAABkAcBAAAAAZEHgAAAAAGSB0AAAAABAWAAAJIHADABYAAAkgcAMBMGAAD7EQAglgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACHOBgAA-hGLByLkBgAAhg_kBiLmBhAAiA8AIecGAQCADQAh6AYCAIkPACGJBwEAgA0AIYsHAQCADQAhjAcBAIENACGNBwEAgQ0AIY4HAQCBDQAhjwcBAIENACGQBwEAgQ0AIZEHgAAAAAGSB0AAmA0AIQIAAAD5AQAgYAAAlQcAIBKWBgEAgA0AIZsGAQCADQAhngZAAIINACGfBkAAgg0AIc4GAAD6EYsHIuQGAACGD-QGIuYGEACIDwAh5wYBAIANACHoBgIAiQ8AIYkHAQCADQAhiwcBAIANACGMBwEAgQ0AIY0HAQCBDQAhjgcBAIENACGPBwEAgQ0AIZAHAQCBDQAhkQeAAAAAAZIHQACYDQAhAgAAAPcBACBgAACXBwAgAgAAAPcBACBgAACXBwAgAwAAAPkBACBnAACQBwAgaAAAlQcAIAEAAAD5AQAgAQAAAPcBACAMFAAA9REAIG0AAPgRACBuAAD3EQAg_wEAAPYRACCAAgAA-REAIIwHAAD8DAAgjQcAAPwMACCOBwAA_AwAII8HAAD8DAAgkAcAAPwMACCRBwAA_AwAIJIHAAD8DAAgFZMGAACyCwAwlAYAAJ4HABCVBgAAsgsAMJYGAQDeCgAhmwYBAN4KACGeBkAA4AoAIZ8GQADgCgAhzgYAALMLiwci5AYAAIkL5AYi5gYQAIsLACHnBgEA3goAIegGAgCMCwAhiQcBAN4KACGLBwEA3goAIYwHAQDfCgAhjQcBAN8KACGOBwEA3woAIY8HAQDfCgAhkAcBAN8KACGRBwAAtAsAIJIHQAD7CgAhAwAAAPcBACABAACdBwAwbAAAngcAIAMAAAD3AQAgAQAA-AEAMAIAAPkBACAQEwAAsQsAIJMGAACwCwAwlAYAAKQHABCVBgAAsAsAMJYGAQAAAAGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIccGAQDxCgAhgwcBAPIKACGEBwEA8QoAIYUHAADqCgAghgcBAPIKACGHBwEA8goAIYgHAQDxCgAhAQAAAKEHACABAAAAoQcAIBATAACxCwAgkwYAALALADCUBgAApAcAEJUGAACwCwAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIccGAQDxCgAhgwcBAPIKACGEBwEA8QoAIYUHAADqCgAghgcBAPIKACGHBwEA8goAIYgHAQDxCgAhBRMAAPQRACCcBgAA_AwAIIMHAAD8DAAghgcAAPwMACCHBwAA_AwAIAMAAACkBwAgAQAApQcAMAIAAKEHACADAAAApAcAIAEAAKUHADACAAChBwAgAwAAAKQHACABAAClBwAwAgAAoQcAIA0TAADzEQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHHBgEAAAABgwcBAAAAAYQHAQAAAAGFBwAA8hEAIIYHAQAAAAGHBwEAAAABiAcBAAAAAQFgAACpBwAgDJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABxwYBAAAAAYMHAQAAAAGEBwEAAAABhQcAAPIRACCGBwEAAAABhwcBAAAAAYgHAQAAAAEBYAAAqwcAMAFgAACrBwAwDRMAAOgRACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhxwYBAIANACGDBwEAgQ0AIYQHAQCADQAhhQcAAOcRACCGBwEAgQ0AIYcHAQCBDQAhiAcBAIANACECAAAAoQcAIGAAAK4HACAMlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIccGAQCADQAhgwcBAIENACGEBwEAgA0AIYUHAADnEQAghgcBAIENACGHBwEAgQ0AIYgHAQCADQAhAgAAAKQHACBgAACwBwAgAgAAAKQHACBgAACwBwAgAwAAAKEHACBnAACpBwAgaAAArgcAIAEAAAChBwAgAQAAAKQHACAHFAAA5BEAIG0AAOYRACBuAADlEQAgnAYAAPwMACCDBwAA_AwAIIYHAAD8DAAghwcAAPwMACAPkwYAAK8LADCUBgAAtwcAEJUGAACvCwAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIccGAQDeCgAhgwcBAN8KACGEBwEA3goAIYUHAADqCgAghgcBAN8KACGHBwEA3woAIYgHAQDeCgAhAwAAAKQHACABAAC2BwAwbAAAtwcAIAMAAACkBwAgAQAApQcAMAIAAKEHACAQEwAArgsAIJMGAACtCwAwlAYAAL0HABCVBgAArQsAMJYGAQAAAAGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIccGAQDxCgAhgwcBAPIKACGEBwEA8QoAIYUHAADqCgAghgcBAPIKACGHBwEA8goAIYgHAQDxCgAhAQAAALoHACABAAAAugcAIBATAACuCwAgkwYAAK0LADCUBgAAvQcAEJUGAACtCwAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIccGAQDxCgAhgwcBAPIKACGEBwEA8QoAIYUHAADqCgAghgcBAPIKACGHBwEA8goAIYgHAQDxCgAhBRMAAOMRACCcBgAA_AwAIIMHAAD8DAAghgcAAPwMACCHBwAA_AwAIAMAAAC9BwAgAQAAvgcAMAIAALoHACADAAAAvQcAIAEAAL4HADACAAC6BwAgAwAAAL0HACABAAC-BwAwAgAAugcAIA0TAADiEQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHHBgEAAAABgwcBAAAAAYQHAQAAAAGFBwAA4REAIIYHAQAAAAGHBwEAAAABiAcBAAAAAQFgAADCBwAgDJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABxwYBAAAAAYMHAQAAAAGEBwEAAAABhQcAAOERACCGBwEAAAABhwcBAAAAAYgHAQAAAAEBYAAAxAcAMAFgAADEBwAwDRMAANcRACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhxwYBAIANACGDBwEAgQ0AIYQHAQCADQAhhQcAANYRACCGBwEAgQ0AIYcHAQCBDQAhiAcBAIANACECAAAAugcAIGAAAMcHACAMlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIccGAQCADQAhgwcBAIENACGEBwEAgA0AIYUHAADWEQAghgcBAIENACGHBwEAgQ0AIYgHAQCADQAhAgAAAL0HACBgAADJBwAgAgAAAL0HACBgAADJBwAgAwAAALoHACBnAADCBwAgaAAAxwcAIAEAAAC6BwAgAQAAAL0HACAHFAAA0xEAIG0AANURACBuAADUEQAgnAYAAPwMACCDBwAA_AwAIIYHAAD8DAAghwcAAPwMACAPkwYAAKwLADCUBgAA0AcAEJUGAACsCwAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIccGAQDeCgAhgwcBAN8KACGEBwEA3goAIYUHAADqCgAghgcBAN8KACGHBwEA3woAIYgHAQDeCgAhAwAAAL0HACABAADPBwAwbAAA0AcAIAMAAAC9BwAgAQAAvgcAMAIAALoHACABAAAAHAAgAQAAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgAwAAABoAIAEAABsAMAIAABwAIA8GAADREQAgCAAA0hEAIAwAANARACAOAADPEQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHHBgEAAAAB9QYBAAAAAf8GAQAAAAGAB0AAAAABgQcIAAAAAYIHCAAAAAEBYAAA2AcAIAuWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAccGAQAAAAH1BgEAAAAB_wYBAAAAAYAHQAAAAAGBBwgAAAABggcIAAAAAQFgAADaBwAwAWAAANoHADAPBgAAnhEAIAgAAJ8RACAMAACdEQAgDgAAnBEAIJYGAQCADQAhmwYBAIANACGcBgEAgA0AIZ4GQACCDQAhnwZAAIINACHHBgEAgA0AIfUGAQCBDQAh_wYBAIENACGAB0AAmA0AIYEHCACxDQAhggcIALENACECAAAAHAAgYAAA3QcAIAuWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAhxwYBAIANACH1BgEAgQ0AIf8GAQCBDQAhgAdAAJgNACGBBwgAsQ0AIYIHCACxDQAhAgAAABoAIGAAAN8HACACAAAAGgAgYAAA3wcAIAMAAAAcACBnAADYBwAgaAAA3QcAIAEAAAAcACABAAAAGgAgChQAAJcRACBtAACaEQAgbgAAmREAIP8BAACYEQAggAIAAJsRACD1BgAA_AwAIP8GAAD8DAAggAcAAPwMACCBBwAA_AwAIIIHAAD8DAAgDpMGAACrCwAwlAYAAOYHABCVBgAAqwsAMJYGAQDeCgAhmwYBAN4KACGcBgEA3goAIZ4GQADgCgAhnwZAAOAKACHHBgEA3goAIfUGAQDfCgAh_wYBAN8KACGAB0AA-woAIYEHCACFCwAhggcIAIULACEDAAAAGgAgAQAA5QcAMGwAAOYHACADAAAAGgAgAQAAGwAwAgAAHAAgAQAAACkAIAEAAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAAnACABAAAoADACAAApACAQBgAAxw4AIAgAAMgOACAmAAD5EAAgKwAAxQ4AIC0AAMYOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAdQGAQAAAAHvBgEAAAAB9QYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAQFgAADuBwAgC5YGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB1AYBAAAAAe8GAQAAAAH1BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAABAWAAAPAHADABYAAA8AcAMAEAAAATACABAAAAFQAgEAYAAMIOACAIAADDDgAgJgAA9xAAICsAAMAOACAtAADBDgAglgYBAIANACGbBgEAgQ0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIdQGAQCADQAh7wYBAIANACH1BgEAgQ0AIfwGAQCBDQAh_QYBAIANACH-BgEAgA0AIQIAAAApACBgAAD1BwAgC5YGAQCADQAhmwYBAIENACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHUBgEAgA0AIe8GAQCADQAh9QYBAIENACH8BgEAgQ0AIf0GAQCADQAh_gYBAIANACECAAAAJwAgYAAA9wcAIAIAAAAnACBgAAD3BwAgAQAAABMAIAEAAAAVACADAAAAKQAgZwAA7gcAIGgAAPUHACABAAAAKQAgAQAAACcAIAcUAACUEQAgbQAAlhEAIG4AAJURACCbBgAA_AwAIJwGAAD8DAAg9QYAAPwMACD8BgAA_AwAIA6TBgAAqgsAMJQGAACACAAQlQYAAKoLADCWBgEA3goAIZsGAQDfCgAhnAYBAN8KACGeBkAA4AoAIZ8GQADgCgAh1AYBAN4KACHvBgEA3goAIfUGAQDfCgAh_AYBAN8KACH9BgEA3goAIf4GAQDeCgAhAwAAACcAIAEAAP8HADBsAACACAAgAwAAACcAIAEAACgAMAIAACkAIAEAAAAwACABAAAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgDwYAAPwQACAIAAD9EAAgCgAA-xAAIBoAAJMRACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA_AYC7wYBAAAAAfUGAQAAAAH3BgEAAAAB-QYBAAAAAfoGAQAAAAEBYAAAiAgAIAuWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA_AYC7wYBAAAAAfUGAQAAAAH3BgEAAAAB-QYBAAAAAfoGAQAAAAEBYAAAiggAMAFgAACKCAAwAQAAACwAIAEAAAATACABAAAAFQAgDwYAAO0QACAIAADuEAAgCgAA7BAAIBoAAJIRACCWBgEAgA0AIZsGAQCBDQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhzgYAAOoQ_AYi7wYBAIANACH1BgEAgQ0AIfcGAQCBDQAh-QYBAIANACH6BgEAgA0AIQIAAAAwACBgAACQCAAgC5YGAQCADQAhmwYBAIENACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHOBgAA6hD8BiLvBgEAgA0AIfUGAQCBDQAh9wYBAIENACH5BgEAgA0AIfoGAQCADQAhAgAAAC4AIGAAAJIIACACAAAALgAgYAAAkggAIAEAAAAsACABAAAAEwAgAQAAABUAIAMAAAAwACBnAACICAAgaAAAkAgAIAEAAAAwACABAAAALgAgBxQAAI8RACBtAACREQAgbgAAkBEAIJsGAAD8DAAgnAYAAPwMACD1BgAA_AwAIPcGAAD8DAAgDpMGAACmCwAwlAYAAJwIABCVBgAApgsAMJYGAQDeCgAhmwYBAN8KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACHOBgAApwv8BiLvBgEA3goAIfUGAQDfCgAh9wYBAN8KACH5BgEA3goAIfoGAQDeCgAhAwAAAC4AIAEAAJsIADBsAACcCAAgAwAAAC4AIAEAAC8AMAIAADAAIAEAAAA0ACABAAAANAAgAwAAADIAIAEAADMAMAIAADQAIAMAAAAyACABAAAzADACAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgEQYAAN0QACAIAADeEAAgDAAA2hAAIA8AANsQACAaAACOEQAgIwAA3BAAICkAAN8QACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAe8GAQAAAAH1BgEAAAAB9gYCAAAAAfcGAQAAAAH4BgEAAAABAWAAAKQIACAKlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfYGAgAAAAH3BgEAAAAB-AYBAAAAAQFgAACmCAAwAWAAAKYIADABAAAAFQAgAQAAAIEBACARBgAAuxAAIAgAALwQACAMAAC4EAAgDwAAuRAAIBoAAI0RACAjAAC6EAAgKQAAvRAAIJYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIfUGAQCBDQAh9gYCALYQACH3BgEAgA0AIfgGAQCBDQAhAgAAADQAIGAAAKsIACAKlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIe8GAQCADQAh9QYBAIENACH2BgIAthAAIfcGAQCADQAh-AYBAIENACECAAAAMgAgYAAArQgAIAIAAAAyACBgAACtCAAgAQAAABUAIAEAAACBAQAgAwAAADQAIGcAAKQIACBoAACrCAAgAQAAADQAIAEAAAAyACAJFAAAiBEAIG0AAIsRACBuAACKEQAg_wEAAIkRACCAAgAAjBEAIJwGAAD8DAAg9QYAAPwMACD2BgAA_AwAIPgGAAD8DAAgDZMGAACjCwAwlAYAALYIABCVBgAAowsAMJYGAQDeCgAhmwYBAN4KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACHvBgEA3goAIfUGAQDfCgAh9gYCAKQLACH3BgEA3goAIfgGAQDfCgAhAwAAADIAIAEAALUIADBsAAC2CAAgAwAAADIAIAEAADMAMAIAADQAIA0LAACeCwAgDAAAoAsAIBsAAKILACAoAACfCwAgKgAAoQsAIJMGAACdCwAwlAYAACwAEJUGAACdCwAwlgYBAAAAAZsGAQDxCgAh7wYBAPEKACHwBkAA9QoAIfEGQAD1CgAhAQAAALkIACABAAAAuQgAIAULAACDEQAgDAAAhREAIBsAAIcRACAoAACEEQAgKgAAhhEAIAMAAAAsACABAAC8CAAwAgAAuQgAIAMAAAAsACABAAC8CAAwAgAAuQgAIAMAAAAsACABAAC8CAAwAgAAuQgAIAoLAAD-EAAgDAAAgBEAIBsAAIIRACAoAAD_EAAgKgAAgREAIJYGAQAAAAGbBgEAAAAB7wYBAAAAAfAGQAAAAAHxBkAAAAABAWAAAMAIACAFlgYBAAAAAZsGAQAAAAHvBgEAAAAB8AZAAAAAAfEGQAAAAAEBYAAAwggAMAFgAADCCAAwCgsAAPgPACAMAAD6DwAgGwAA_A8AICgAAPkPACAqAAD7DwAglgYBAIANACGbBgEAgA0AIe8GAQCADQAh8AZAAIINACHxBkAAgg0AIQIAAAC5CAAgYAAAxQgAIAWWBgEAgA0AIZsGAQCADQAh7wYBAIANACHwBkAAgg0AIfEGQACCDQAhAgAAACwAIGAAAMcIACACAAAALAAgYAAAxwgAIAMAAAC5CAAgZwAAwAgAIGgAAMUIACABAAAAuQgAIAEAAAAsACADFAAA9Q8AIG0AAPcPACBuAAD2DwAgCJMGAACcCwAwlAYAAM4IABCVBgAAnAsAMJYGAQDeCgAhmwYBAN4KACHvBgEA3goAIfAGQADgCgAh8QZAAOAKACEDAAAALAAgAQAAzQgAMGwAAM4IACADAAAALAAgAQAAvAgAMAIAALkIACANFgAA9goAIJMGAACbCwAwlAYAALkCABCVBgAAmwsAMJYGAQAAAAGeBkAA9QoAIZ8GQAD1CgAhrAYBAPEKACGtBgEA8QoAIbIGAADzCgAgtAYgAPQKACHtBgEAAAAB7gYAAOoKACABAAAA0QgAIAEAAADRCAAgARYAAOcOACADAAAAuQIAIAEAANQIADACAADRCAAgAwAAALkCACABAADUCAAwAgAA0QgAIAMAAAC5AgAgAQAA1AgAMAIAANEIACAKFgAA9A8AIJYGAQAAAAGeBkAAAAABnwZAAAAAAawGAQAAAAGtBgEAAAABsgaAAAAAAbQGIAAAAAHtBgEAAAAB7gYAAPMPACABYAAA2AgAIAmWBgEAAAABngZAAAAAAZ8GQAAAAAGsBgEAAAABrQYBAAAAAbIGgAAAAAG0BiAAAAAB7QYBAAAAAe4GAADzDwAgAWAAANoIADABYAAA2ggAMAoWAADyDwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhrAYBAIANACGtBgEAgA0AIbIGgAAAAAG0BiAA4g4AIe0GAQCADQAh7gYAAPEPACACAAAA0QgAIGAAAN0IACAJlgYBAIANACGeBkAAgg0AIZ8GQACCDQAhrAYBAIANACGtBgEAgA0AIbIGgAAAAAG0BiAA4g4AIe0GAQCADQAh7gYAAPEPACACAAAAuQIAIGAAAN8IACACAAAAuQIAIGAAAN8IACADAAAA0QgAIGcAANgIACBoAADdCAAgAQAAANEIACABAAAAuQIAIAMUAADuDwAgbQAA8A8AIG4AAO8PACAMkwYAAJoLADCUBgAA5ggAEJUGAACaCwAwlgYBAN4KACGeBkAA4AoAIZ8GQADgCgAhrAYBAN4KACGtBgEA3goAIbIGAADrCgAgtAYgAOwKACHtBgEA3goAIe4GAADqCgAgAwAAALkCACABAADlCAAwbAAA5ggAIAMAAAC5AgAgAQAA1AgAMAIAANEIACABAAAASwAgAQAAAEsAIAMAAABJACABAABKADACAABLACADAAAASQAgAQAASgAwAgAASwAgAwAAAEkAIAEAAEoAMAIAAEsAIBAVAADKDwAgFgAAyw8AIBcAAMwPACAYAADtDwAglgYBAAAAAZ4GQAAAAAGfBkAAAAABwgYBAAAAAcwGAQAAAAHOBgAAAO0GAs8GAQAAAAHQBkAAAAAB0QZAAAAAAdIGAQAAAAHTBgEAAAAB7QYBAAAAAQFgAADuCAAgDJYGAQAAAAGeBkAAAAABnwZAAAAAAcIGAQAAAAHMBgEAAAABzgYAAADtBgLPBgEAAAAB0AZAAAAAAdEGQAAAAAHSBgEAAAAB0wYBAAAAAe0GAQAAAAEBYAAA8AgAMAFgAADwCAAwAQAAAE8AIAEAAABRACAQFQAAxg8AIBYAAMcPACAXAADIDwAgGAAA7A8AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcIGAQCBDQAhzAYBAIENACHOBgAAxA_tBiLPBgEAgQ0AIdAGQACYDQAh0QZAAIINACHSBgEAgA0AIdMGAQCBDQAh7QYBAIANACECAAAASwAgYAAA9QgAIAyWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHCBgEAgQ0AIcwGAQCBDQAhzgYAAMQP7QYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0gYBAIANACHTBgEAgQ0AIe0GAQCADQAhAgAAAEkAIGAAAPcIACACAAAASQAgYAAA9wgAIAEAAABPACABAAAAUQAgAwAAAEsAIGcAAO4IACBoAAD1CAAgAQAAAEsAIAEAAABJACAIFAAA6Q8AIG0AAOsPACBuAADqDwAgwgYAAPwMACDMBgAA_AwAIM8GAAD8DAAg0AYAAPwMACDTBgAA_AwAIA-TBgAAlgsAMJQGAACACQAQlQYAAJYLADCWBgEA3goAIZ4GQADgCgAhnwZAAOAKACHCBgEA3woAIcwGAQDfCgAhzgYAAJcL7QYizwYBAN8KACHQBkAA-woAIdEGQADgCgAh0gYBAN4KACHTBgEA3woAIe0GAQDeCgAhAwAAAEkAIAEAAP8IADBsAACACQAgAwAAAEkAIAEAAEoAMAIAAEsAIAEAAACzAQAgAQAAALMBACADAAAAUQAgAQAAsgEAMAIAALMBACADAAAAUQAgAQAAsgEAMAIAALMBACADAAAAUQAgAQAAsgEAMAIAALMBACAQAwAA4w8AIAYAAOEPACAIAADiDwAgDAAA5A8AIBIAAOUPACAZAADmDwAgGwAA5w8AICEAAOgPACCWBgEAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAAB6wYBAAAAAQFgAACICQAgCJYGAQAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAGdBgEAAAABngZAAAAAAZ8GQAAAAAHrBgEAAAABAWAAAIoJADABYAAAigkAMAEAAAAVACAQAwAAkw8AIAYAAJEPACAIAACSDwAgDAAAlA8AIBIAAJUPACAZAACWDwAgGwAAlw8AICEAAJgPACCWBgEAgA0AIZoGAQCBDQAhmwYBAIANACGcBgEAgQ0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIesGAQCADQAhAgAAALMBACBgAACOCQAgCJYGAQCADQAhmgYBAIENACGbBgEAgA0AIZwGAQCBDQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAh6wYBAIANACECAAAAUQAgYAAAkAkAIAIAAABRACBgAACQCQAgAQAAABUAIAMAAACzAQAgZwAAiAkAIGgAAI4JACABAAAAswEAIAEAAABRACAFFAAAjg8AIG0AAJAPACBuAACPDwAgmgYAAPwMACCcBgAA_AwAIAuTBgAAlQsAMJQGAACYCQAQlQYAAJULADCWBgEA3goAIZoGAQDfCgAhmwYBAN4KACGcBgEA3woAIZ0GAQDeCgAhngZAAOAKACGfBkAA4AoAIesGAQDeCgAhAwAAAFEAIAEAAJcJADBsAACYCQAgAwAAAFEAIAEAALIBADACAACzAQAgAQAAAOsBACABAAAA6wEAIAMAAADpAQAgAQAA6gEAMAIAAOsBACADAAAA6QEAIAEAAOoBADACAADrAQAgAwAAAOkBACABAADqAQAwAgAA6wEAIA4GAACMDwAgQQAAjQ8AIJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAOYGAuIGAQAAAAHkBgAAAOQGAuYGEAAAAAHnBgEAAAAB6AYCAAAAAekGQAAAAAHqBkAAAAABAWAAAKAJACAMlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA5gYC4gYBAAAAAeQGAAAA5AYC5gYQAAAAAecGAQAAAAHoBgIAAAAB6QZAAAAAAeoGQAAAAAEBYAAAogkAMAFgAACiCQAwAQAAAOMBACAOBgAAig8AIEEAAIsPACCWBgEAgA0AIZsGAQCADQAhngZAAIINACGfBkAAgg0AIc4GAACHD-YGIuIGAQCBDQAh5AYAAIYP5AYi5gYQAIgPACHnBgEAgA0AIegGAgCJDwAh6QZAAIINACHqBkAAgg0AIQIAAADrAQAgYAAApgkAIAyWBgEAgA0AIZsGAQCADQAhngZAAIINACGfBkAAgg0AIc4GAACHD-YGIuIGAQCBDQAh5AYAAIYP5AYi5gYQAIgPACHnBgEAgA0AIegGAgCJDwAh6QZAAIINACHqBkAAgg0AIQIAAADpAQAgYAAAqAkAIAIAAADpAQAgYAAAqAkAIAEAAADjAQAgAwAAAOsBACBnAACgCQAgaAAApgkAIAEAAADrAQAgAQAAAOkBACAGFAAAgQ8AIG0AAIQPACBuAACDDwAg_wEAAIIPACCAAgAAhQ8AIOIGAAD8DAAgD5MGAACICwAwlAYAALAJABCVBgAAiAsAMJYGAQDeCgAhmwYBAN4KACGeBkAA4AoAIZ8GQADgCgAhzgYAAIoL5gYi4gYBAN8KACHkBgAAiQvkBiLmBhAAiwsAIecGAQDeCgAh6AYCAIwLACHpBkAA4AoAIeoGQADgCgAhAwAAAOkBACABAACvCQAwbAAAsAkAIAMAAADpAQAgAQAA6gEAMAIAAOsBACABAAAAdAAgAQAAAHQAIAMAAAByACABAABzADACAAB0ACADAAAAcgAgAQAAcwAwAgAAdAAgAwAAAHIAIAEAAHMAMAIAAHQAIBgGAAC4DQAgCAAAuQ0AIBAAAKcOACAmAAC3DQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHABgEAAAAB1AYBAAAAAdUGCAAAAAHWBggAAAAB1wYIAAAAAdgGCAAAAAHZBggAAAAB2gYIAAAAAdsGCAAAAAHcBggAAAAB3QYIAAAAAd4GCAAAAAHfBggAAAAB4AYIAAAAAeEGCAAAAAEBYAAAuAkAIBSWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAcAGAQAAAAHUBgEAAAAB1QYIAAAAAdYGCAAAAAHXBggAAAAB2AYIAAAAAdkGCAAAAAHaBggAAAAB2wYIAAAAAdwGCAAAAAHdBggAAAAB3gYIAAAAAd8GCAAAAAHgBggAAAAB4QYIAAAAAQFgAAC6CQAwAWAAALoJADABAAAAFQAgGAYAALQNACAIAAC1DQAgEAAApg4AICYAALMNACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhwAYBAIANACHUBgEAgA0AIdUGCACxDQAh1gYIALENACHXBggAsQ0AIdgGCACxDQAh2QYIALENACHaBggAsQ0AIdsGCACxDQAh3AYIALENACHdBggAsQ0AId4GCACxDQAh3wYIALENACHgBggAsQ0AIeEGCACxDQAhAgAAAHQAIGAAAL4JACAUlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIcAGAQCADQAh1AYBAIANACHVBggAsQ0AIdYGCACxDQAh1wYIALENACHYBggAsQ0AIdkGCACxDQAh2gYIALENACHbBggAsQ0AIdwGCACxDQAh3QYIALENACHeBggAsQ0AId8GCACxDQAh4AYIALENACHhBggAsQ0AIQIAAAByACBgAADACQAgAgAAAHIAIGAAAMAJACABAAAAFQAgAwAAAHQAIGcAALgJACBoAAC-CQAgAQAAAHQAIAEAAAByACATFAAA_A4AIG0AAP8OACBuAAD-DgAg_wEAAP0OACCAAgAAgA8AIJwGAAD8DAAg1QYAAPwMACDWBgAA_AwAINcGAAD8DAAg2AYAAPwMACDZBgAA_AwAINoGAAD8DAAg2wYAAPwMACDcBgAA_AwAIN0GAAD8DAAg3gYAAPwMACDfBgAA_AwAIOAGAAD8DAAg4QYAAPwMACAXkwYAAIQLADCUBgAAyAkAEJUGAACECwAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIcAGAQDeCgAh1AYBAN4KACHVBggAhQsAIdYGCACFCwAh1wYIAIULACHYBggAhQsAIdkGCACFCwAh2gYIAIULACHbBggAhQsAIdwGCACFCwAh3QYIAIULACHeBggAhQsAId8GCACFCwAh4AYIAIULACHhBggAhQsAIQMAAAByACABAADHCQAwbAAAyAkAIAMAAAByACABAABzADACAAB0ACABAAAAawAgAQAAAGsAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIBQGAADPDQAgCAAA0A0AIBAAAPsOACAVAADMDQAgFwAAzg0AICQAAM0NACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAdMGAQAAAAEBYAAA0AkAIA6WBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAdMGAQAAAAEBYAAA0gkAMAFgAADSCQAwAQAAAE8AIAEAAABfACABAAAAFQAgFAYAAMkNACAIAADKDQAgEAAA-g4AIBUAAMYNACAXAADIDQAgJAAAxw0AIJYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACGrBgEAgA0AIcAGAQCBDQAhzAYBAIENACHOBgAAxA3OBiLPBgEAgQ0AIdAGQACYDQAh0QZAAIINACHSBgEAgA0AIdMGAQCBDQAhAgAAAGsAIGAAANgJACAOlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIasGAQCADQAhwAYBAIENACHMBgEAgQ0AIc4GAADEDc4GIs8GAQCBDQAh0AZAAJgNACHRBkAAgg0AIdIGAQCADQAh0wYBAIENACECAAAAaQAgYAAA2gkAIAIAAABpACBgAADaCQAgAQAAAE8AIAEAAABfACABAAAAFQAgAwAAAGsAIGcAANAJACBoAADYCQAgAQAAAGsAIAEAAABpACAJFAAA9w4AIG0AAPkOACBuAAD4DgAgnAYAAPwMACDABgAA_AwAIMwGAAD8DAAgzwYAAPwMACDQBgAA_AwAINMGAAD8DAAgEZMGAACACwAwlAYAAOQJABCVBgAAgAsAMJYGAQDeCgAhmwYBAN4KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACGrBgEA3goAIcAGAQDfCgAhzAYBAN8KACHOBgAAgQvOBiLPBgEA3woAIdAGQAD7CgAh0QZAAOAKACHSBgEA3goAIdMGAQDfCgAhAwAAAGkAIAEAAOMJADBsAADkCQAgAwAAAGkAIAEAAGoAMAIAAGsAIAEAAAA_ACABAAAAPwAgAwAAAD0AIAEAAD4AMAIAAD8AIAMAAAA9ACABAAA-ADACAAA_ACADAAAAPQAgAQAAPgAwAgAAPwAgEAYAAPUNACAIAAD2DQAgDQAA9A0AIBAAAPYOACAiAAD3DQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABwAYBAAAAAccGAQAAAAHIBgEAAAABygYAAADKBgLLBkAAAAABAWAAAOwJACALlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABwAYBAAAAAccGAQAAAAHIBgEAAAABygYAAADKBgLLBkAAAAABAWAAAO4JADABYAAA7gkAMAEAAAAVACAQBgAA3g0AIAgAAN8NACANAADdDQAgEAAA9Q4AICIAAOANACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACHABgEAgA0AIccGAQCADQAhyAYBAIENACHKBgAA2w3KBiLLBkAAmA0AIQIAAAA_ACBgAADyCQAgC5YGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIcAGAQCADQAhxwYBAIANACHIBgEAgQ0AIcoGAADbDcoGIssGQACYDQAhAgAAAD0AIGAAAPQJACACAAAAPQAgYAAA9AkAIAEAAAAVACADAAAAPwAgZwAA7AkAIGgAAPIJACABAAAAPwAgAQAAAD0AIAYUAADyDgAgbQAA9A4AIG4AAPMOACCcBgAA_AwAIMgGAAD8DAAgywYAAPwMACAOkwYAAPkKADCUBgAA_AkAEJUGAAD5CgAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIb4GAQDeCgAhwAYBAN4KACHHBgEA3goAIcgGAQDfCgAhygYAAPoKygYiywZAAPsKACEDAAAAPQAgAQAA-wkAMGwAAPwJACADAAAAPQAgAQAAPgAwAgAAPwAgAQAAAEQAIAEAAABEACADAAAAQgAgAQAAQwAwAgAARAAgAwAAAEIAIAEAAEMAMAIAAEQAIAMAAABCACABAABDADACAABEACAPBgAA8Q0AIAgAAPINACARAADxDgAgGAAA8A0AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwQYBAAAAAcIGAQAAAAHDBgEAAAABxAYBAAAAAcUGAQAAAAHGBkAAAAABAWAAAIQKACALlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHBBgEAAAABwgYBAAAAAcMGAQAAAAHEBgEAAAABxQYBAAAAAcYGQAAAAAEBYAAAhgoAMAFgAACGCgAwAQAAABUAIA8GAADtDQAgCAAA7g0AIBEAAPAOACAYAADsDQAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIcEGAQCADQAhwgYBAIANACHDBgEAgQ0AIcQGAQCBDQAhxQYBAIENACHGBkAAgg0AIQIAAABEACBgAACKCgAgC5YGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHBBgEAgA0AIcIGAQCADQAhwwYBAIENACHEBgEAgQ0AIcUGAQCBDQAhxgZAAIINACECAAAAQgAgYAAAjAoAIAIAAABCACBgAACMCgAgAQAAABUAIAMAAABEACBnAACECgAgaAAAigoAIAEAAABEACABAAAAQgAgBxQAAO0OACBtAADvDgAgbgAA7g4AIJwGAAD8DAAgwwYAAPwMACDEBgAA_AwAIMUGAAD8DAAgDpMGAAD4CgAwlAYAAJQKABCVBgAA-AoAMJYGAQDeCgAhmwYBAN4KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACHBBgEA3goAIcIGAQDeCgAhwwYBAN8KACHEBgEA3woAIcUGAQDfCgAhxgZAAOAKACEDAAAAQgAgAQAAkwoAMGwAAJQKACADAAAAQgAgAQAAQwAwAgAARAAgAQAAADkAIAEAAAA5ACADAAAANwAgAQAAOAAwAgAAOQAgAwAAADcAIAEAADgAMAIAADkAIAMAAAA3ACABAAA4ADACAAA5ACANBgAAig4AIAgAAIsOACANAACIDgAgDgAAiQ4AIBAAAOwOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAb4GAQAAAAG_BgEAAAABwAYBAAAAAQFgAACcCgAgCJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABAWAAAJ4KADABYAAAngoAMAEAAAAVACANBgAAhQ4AIAgAAIYOACANAACDDgAgDgAAhA4AIBAAAOsOACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACG_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_QwAIG0AAP8MACBuAAD-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-gsAIFYAAPoLACBXAAD5CwAgWAAA-QsAIFkAAPgLACBaAACRDAAgkwYAAIsMADCUBgAATwAQlQYAAIsMADCWBgEA8QoAIZoGAQDyCgAhngZAAPUKACGfBkAA9QoAIe8GAQDxCgAhpgcBAPEKACHmBwEA8QoAIecHIAD0CgAh6AcBAPIKACHpBwEA8goAIeoHAQDyCgAh6wcBAPIKACHsBwEA8goAIe0HAQDyCgAh7gcBAPEKACH7BwAATwAg_AcAAE8AIAuTBgAA9woAMJQGAACsCgAQlQYAAPcKADCWBgEA3goAIZsGAQDeCgAhnAYBAN8KACGeBkAA4AoAIZ8GQADgCgAhvgYBAN4KACG_BgEA3goAIcAGAQDeCgAhDpMGAAD4CgAwlAYAAJQKABCVBgAA-AoAMJYGAQDeCgAhmwYBAN4KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACHBBgEA3goAIcIGAQDeCgAhwwYBAN8KACHEBgEA3woAIcUGAQDfCgAhxgZAAOAKACEOkwYAAPkKADCUBgAA_AkAEJUGAAD5CgAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIb4GAQDeCgAhwAYBAN4KACHHBgEA3goAIcgGAQDfCgAhygYAAPoKygYiywZAAPsKACEHFAAA4goAIG0AAP8KACBuAAD_CgAgoAYAAADKBgKhBgAAAMoGCKIGAAAAygYIpwYAAP4KygYiCxQAAOUKACBtAAD9CgAgbgAA_QoAIKAGQAAAAAGhBkAAAAAFogZAAAAABaMGQAAAAAGkBkAAAAABpQZAAAAAAaYGQAAAAAGnBkAA_AoAIQsUAADlCgAgbQAA_QoAIG4AAP0KACCgBkAAAAABoQZAAAAABaIGQAAAAAWjBkAAAAABpAZAAAAAAaUGQAAAAAGmBkAAAAABpwZAAPwKACEIoAZAAAAAAaEGQAAAAAWiBkAAAAAFowZAAAAAAaQGQAAAAAGlBkAAAAABpgZAAAAAAacGQAD9CgAhBxQAAOIKACBtAAD_CgAgbgAA_woAIKAGAAAAygYCoQYAAADKBgiiBgAAAMoGCKcGAAD-CsoGIgSgBgAAAMoGAqEGAAAAygYIogYAAADKBginBgAA_wrKBiIRkwYAAIALADCUBgAA5AkAEJUGAACACwAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIasGAQDeCgAhwAYBAN8KACHMBgEA3woAIc4GAACBC84GIs8GAQDfCgAh0AZAAPsKACHRBkAA4AoAIdIGAQDeCgAh0wYBAN8KACEHFAAA4goAIG0AAIMLACBuAACDCwAgoAYAAADOBgKhBgAAAM4GCKIGAAAAzgYIpwYAAIILzgYiBxQAAOIKACBtAACDCwAgbgAAgwsAIKAGAAAAzgYCoQYAAADOBgiiBgAAAM4GCKcGAACCC84GIgSgBgAAAM4GAqEGAAAAzgYIogYAAADOBginBgAAgwvOBiIXkwYAAIQLADCUBgAAyAkAEJUGAACECwAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIcAGAQDeCgAh1AYBAN4KACHVBggAhQsAIdYGCACFCwAh1wYIAIULACHYBggAhQsAIdkGCACFCwAh2gYIAIULACHbBggAhQsAIdwGCACFCwAh3QYIAIULACHeBggAhQsAId8GCACFCwAh4AYIAIULACHhBggAhQsAIQ0UAADlCgAgbQAAhwsAIG4AAIcLACD_AQAAhwsAIIACAACHCwAgoAYIAAAAAaEGCAAAAAWiBggAAAAFowYIAAAAAaQGCAAAAAGlBggAAAABpgYIAAAAAacGCACGCwAhDRQAAOUKACBtAACHCwAgbgAAhwsAIP8BAACHCwAggAIAAIcLACCgBggAAAABoQYIAAAABaIGCAAAAAWjBggAAAABpAYIAAAAAaUGCAAAAAGmBggAAAABpwYIAIYLACEIoAYIAAAAAaEGCAAAAAWiBggAAAAFowYIAAAAAaQGCAAAAAGlBggAAAABpgYIAAAAAacGCACHCwAhD5MGAACICwAwlAYAALAJABCVBgAAiAsAMJYGAQDeCgAhmwYBAN4KACGeBkAA4AoAIZ8GQADgCgAhzgYAAIoL5gYi4gYBAN8KACHkBgAAiQvkBiLmBhAAiwsAIecGAQDeCgAh6AYCAIwLACHpBkAA4AoAIeoGQADgCgAhBxQAAOIKACBtAACUCwAgbgAAlAsAIKAGAAAA5AYCoQYAAADkBgiiBgAAAOQGCKcGAACTC-QGIgcUAADiCgAgbQAAkgsAIG4AAJILACCgBgAAAOYGAqEGAAAA5gYIogYAAADmBginBgAAkQvmBiINFAAA4goAIG0AAJALACBuAACQCwAg_wEAAJALACCAAgAAkAsAIKAGEAAAAAGhBhAAAAAEogYQAAAABKMGEAAAAAGkBhAAAAABpQYQAAAAAaYGEAAAAAGnBhAAjwsAIQ0UAADiCgAgbQAA4goAIG4AAOIKACD_AQAAjgsAIIACAADiCgAgoAYCAAAAAaEGAgAAAASiBgIAAAAEowYCAAAAAaQGAgAAAAGlBgIAAAABpgYCAAAAAacGAgCNCwAhDRQAAOIKACBtAADiCgAgbgAA4goAIP8BAACOCwAggAIAAOIKACCgBgIAAAABoQYCAAAABKIGAgAAAASjBgIAAAABpAYCAAAAAaUGAgAAAAGmBgIAAAABpwYCAI0LACEIoAYIAAAAAaEGCAAAAASiBggAAAAEowYIAAAAAaQGCAAAAAGlBggAAAABpgYIAAAAAacGCACOCwAhDRQAAOIKACBtAACQCwAgbgAAkAsAIP8BAACQCwAggAIAAJALACCgBhAAAAABoQYQAAAABKIGEAAAAASjBhAAAAABpAYQAAAAAaUGEAAAAAGmBhAAAAABpwYQAI8LACEIoAYQAAAAAaEGEAAAAASiBhAAAAAEowYQAAAAAaQGEAAAAAGlBhAAAAABpgYQAAAAAacGEACQCwAhBxQAAOIKACBtAACSCwAgbgAAkgsAIKAGAAAA5gYCoQYAAADmBgiiBgAAAOYGCKcGAACRC-YGIgSgBgAAAOYGAqEGAAAA5gYIogYAAADmBginBgAAkgvmBiIHFAAA4goAIG0AAJQLACBuAACUCwAgoAYAAADkBgKhBgAAAOQGCKIGAAAA5AYIpwYAAJML5AYiBKAGAAAA5AYCoQYAAADkBgiiBgAAAOQGCKcGAACUC-QGIguTBgAAlQsAMJQGAACYCQAQlQYAAJULADCWBgEA3goAIZoGAQDfCgAhmwYBAN4KACGcBgEA3woAIZ0GAQDeCgAhngZAAOAKACGfBkAA4AoAIesGAQDeCgAhD5MGAACWCwAwlAYAAIAJABCVBgAAlgsAMJYGAQDeCgAhngZAAOAKACGfBkAA4AoAIcIGAQDfCgAhzAYBAN8KACHOBgAAlwvtBiLPBgEA3woAIdAGQAD7CgAh0QZAAOAKACHSBgEA3goAIdMGAQDfCgAh7QYBAN4KACEHFAAA4goAIG0AAJkLACBuAACZCwAgoAYAAADtBgKhBgAAAO0GCKIGAAAA7QYIpwYAAJgL7QYiBxQAAOIKACBtAACZCwAgbgAAmQsAIKAGAAAA7QYCoQYAAADtBgiiBgAAAO0GCKcGAACYC-0GIgSgBgAAAO0GAqEGAAAA7QYIogYAAADtBginBgAAmQvtBiIMkwYAAJoLADCUBgAA5ggAEJUGAACaCwAwlgYBAN4KACGeBkAA4AoAIZ8GQADgCgAhrAYBAN4KACGtBgEA3goAIbIGAADrCgAgtAYgAOwKACHtBgEA3goAIe4GAADqCgAgDRYAAPYKACCTBgAAmwsAMJQGAAC5AgAQlQYAAJsLADCWBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACGsBgEA8QoAIa0GAQDxCgAhsgYAAPMKACC0BiAA9AoAIe0GAQDxCgAh7gYAAOoKACAIkwYAAJwLADCUBgAAzggAEJUGAACcCwAwlgYBAN4KACGbBgEA3goAIe8GAQDeCgAh8AZAAOAKACHxBkAA4AoAIQ0LAACeCwAgDAAAoAsAIBsAAKILACAoAACfCwAgKgAAoQsAIJMGAACdCwAwlAYAACwAEJUGAACdCwAwlgYBAPEKACGbBgEA8QoAIe8GAQDxCgAh8AZAAPUKACHxBkAA9QoAIQPyBgAALgAg8wYAAC4AIPQGAAAuACAD8gYAADIAIPMGAAAyACD0BgAAMgAgA_IGAAAjACDzBgAAIwAg9AYAACMAIAPyBgAAigEAIPMGAACKAQAg9AYAAIoBACAD8gYAAFMAIPMGAABTACD0BgAAUwAgDZMGAACjCwAwlAYAALYIABCVBgAAowsAMJYGAQDeCgAhmwYBAN4KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACHvBgEA3goAIfUGAQDfCgAh9gYCAKQLACH3BgEA3goAIfgGAQDfCgAhDRQAAOUKACBtAADlCgAgbgAA5QoAIP8BAACHCwAggAIAAOUKACCgBgIAAAABoQYCAAAABaIGAgAAAAWjBgIAAAABpAYCAAAAAaUGAgAAAAGmBgIAAAABpwYCAKULACENFAAA5QoAIG0AAOUKACBuAADlCgAg_wEAAIcLACCAAgAA5QoAIKAGAgAAAAGhBgIAAAAFogYCAAAABaMGAgAAAAGkBgIAAAABpQYCAAAAAaYGAgAAAAGnBgIApQsAIQ6TBgAApgsAMJQGAACcCAAQlQYAAKYLADCWBgEA3goAIZsGAQDfCgAhnAYBAN8KACGeBkAA4AoAIZ8GQADgCgAhzgYAAKcL_AYi7wYBAN4KACH1BgEA3woAIfcGAQDfCgAh-QYBAN4KACH6BgEA3goAIQcUAADiCgAgbQAAqQsAIG4AAKkLACCgBgAAAPwGAqEGAAAA_AYIogYAAAD8BginBgAAqAv8BiIHFAAA4goAIG0AAKkLACBuAACpCwAgoAYAAAD8BgKhBgAAAPwGCKIGAAAA_AYIpwYAAKgL_AYiBKAGAAAA_AYCoQYAAAD8BgiiBgAAAPwGCKcGAACpC_wGIg6TBgAAqgsAMJQGAACACAAQlQYAAKoLADCWBgEA3goAIZsGAQDfCgAhnAYBAN8KACGeBkAA4AoAIZ8GQADgCgAh1AYBAN4KACHvBgEA3goAIfUGAQDfCgAh_AYBAN8KACH9BgEA3goAIf4GAQDeCgAhDpMGAACrCwAwlAYAAOYHABCVBgAAqwsAMJYGAQDeCgAhmwYBAN4KACGcBgEA3goAIZ4GQADgCgAhnwZAAOAKACHHBgEA3goAIfUGAQDfCgAh_wYBAN8KACGAB0AA-woAIYEHCACFCwAhggcIAIULACEPkwYAAKwLADCUBgAA0AcAEJUGAACsCwAwlgYBAN4KACGbBgEA3goAIZwGAQDfCgAhngZAAOAKACGfBkAA4AoAIccGAQDeCgAhgwcBAN8KACGEBwEA3goAIYUHAADqCgAghgcBAN8KACGHBwEA3woAIYgHAQDeCgAhEBMAAK4LACCTBgAArQsAMJQGAAC9BwAQlQYAAK0LADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhxwYBAPEKACGDBwEA8goAIYQHAQDxCgAhhQcAAOoKACCGBwEA8goAIYcHAQDyCgAhiAcBAPEKACED8gYAAEkAIPMGAABJACD0BgAASQAgD5MGAACvCwAwlAYAALcHABCVBgAArwsAMJYGAQDeCgAhmwYBAN4KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACHHBgEA3goAIYMHAQDfCgAhhAcBAN4KACGFBwAA6goAIIYHAQDfCgAhhwcBAN8KACGIBwEA3goAIRATAACxCwAgkwYAALALADCUBgAApAcAEJUGAACwCwAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIccGAQDxCgAhgwcBAPIKACGEBwEA8QoAIYUHAADqCgAghgcBAPIKACGHBwEA8goAIYgHAQDxCgAhA_IGAABpACDzBgAAaQAg9AYAAGkAIBWTBgAAsgsAMJQGAACeBwAQlQYAALILADCWBgEA3goAIZsGAQDeCgAhngZAAOAKACGfBkAA4AoAIc4GAACzC4sHIuQGAACJC-QGIuYGEACLCwAh5wYBAN4KACHoBgIAjAsAIYkHAQDeCgAhiwcBAN4KACGMBwEA3woAIY0HAQDfCgAhjgcBAN8KACGPBwEA3woAIZAHAQDfCgAhkQcAALQLACCSB0AA-woAIQcUAADiCgAgbQAAtwsAIG4AALcLACCgBgAAAIsHAqEGAAAAiwcIogYAAACLBwinBgAAtguLByIPFAAA5QoAIG0AALULACBuAAC1CwAgoAaAAAAAAaMGgAAAAAGkBoAAAAABpQaAAAAAAaYGgAAAAAGnBoAAAAABtQYBAAAAAbYGAQAAAAG3BgEAAAABuAaAAAAAAbkGgAAAAAG6BoAAAAABDKAGgAAAAAGjBoAAAAABpAaAAAAAAaUGgAAAAAGmBoAAAAABpwaAAAAAAbUGAQAAAAG2BgEAAAABtwYBAAAAAbgGgAAAAAG5BoAAAAABugaAAAAAAQcUAADiCgAgbQAAtwsAIG4AALcLACCgBgAAAIsHAqEGAAAAiwcIogYAAACLBwinBgAAtguLByIEoAYAAACLBwKhBgAAAIsHCKIGAAAAiwcIpwYAALcLiwciD5MGAAC4CwAwlAYAAIgHABCVBgAAuAsAMJYGAQDeCgAhmwYBAN4KACGeBkAA4AoAIZ8GQADgCgAhkwcBAN4KACGUBwEA3goAIZUHAQDeCgAhlgcBAN4KACGXBwEA3goAIZgHAQDeCgAhmQcgAOwKACGaBwEA3woAIRAGAAC6CwAgkwYAALkLADCUBgAA9QEAEJUGAAC5CwAwlgYBAPEKACGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACGTBwEA8QoAIZQHAQDxCgAhlQcBAPEKACGWBwEA8QoAIZcHAQDxCgAhmAcBAPEKACGZByAA9AoAIZoHAQDyCgAhKQsAAJ4LACAMAACgCwAgDwAA7wsAIBsAAKILACAoAACfCwAgKgAAoQsAICwAAPcLACAwAADoCwAgMQAA6QsAIDIAAOsLACAzAADtCwAgNAAA7gsAIDUAALELACA2AADxCwAgNwAA8gsAIDgAAPMLACA6AAD7CwAgPAAA5wsAID0AAOoLACA-AADsCwAgQgAA9gsAIEMAAPALACBEAAD0CwAgRQAA9QsAIEoAAPgLACBLAAD5CwAgTAAA-gsAIE0AAPoLACCTBgAA5QsAMJQGAAATABCVBgAA5QsAMJYGAQDxCgAhngZAAPUKACGfBkAA9QoAIcoGAADmC7wHI-8GAQDxCgAh9QYBAPIKACG6BwEA8goAIb0HAQDyCgAh-wcAABMAIPwHAAATACAakwYAALsLADCUBgAA8AYAEJUGAAC7CwAwlgYBAN4KACGbBgEA3goAIZwGAQDeCgAhngZAAOAKACGfBkAA4AoAIcIGAQDeCgAhzgYAAL0Lnwci5gYQAIsLACHnBgEA3goAIegGAgCMCwAh9wYBAN4KACGLBwEA3goAIYwHAQDfCgAhjQcBAN8KACGOBwEA3woAIY8HAQDfCgAhkAcBAN8KACGRBwAAtAsAIJIHQAD7CgAhmwcBAN4KACGdBwAAvAudByKfBwEA3goAIaAHQADgCgAhBxQAAOIKACBtAADBCwAgbgAAwQsAIKAGAAAAnQcCoQYAAACdBwiiBgAAAJ0HCKcGAADAC50HIgcUAADiCgAgbQAAvwsAIG4AAL8LACCgBgAAAJ8HAqEGAAAAnwcIogYAAACfBwinBgAAvgufByIHFAAA4goAIG0AAL8LACBuAAC_CwAgoAYAAACfBwKhBgAAAJ8HCKIGAAAAnwcIpwYAAL4LnwciBKAGAAAAnwcCoQYAAACfBwiiBgAAAJ8HCKcGAAC_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_wEAAN8LACCAAgAA3wsAIKAGEAAAAAGhBhAAAAAFogYQAAAABaMGEAAAAAGkBhAAAAABpQYQAAAAAaYGEAAAAAGnBhAA3gsAIQigBhAAAAABoQYQAAAABaIGEAAAAAWjBhAAAAABpAYQAAAAAaUGEAAAAAGmBhAAAAABpwYQAN8LACEHFAAA5QoAIG0AAOELACBuAADhCwAgoAYAAADkBgOhBgAAAOQGCaIGAAAA5AYJpwYAAOAL5AYjBKAGAAAA5AYDoQYAAADkBgmiBgAAAOQGCacGAADhC-QGIwcUAADlCgAgbQAA4wsAIG4AAOMLACCgBgAAALwHA6EGAAAAvAcJogYAAAC8BwmnBgAA4gu8ByMEoAYAAAC8BwOhBgAAALwHCaIGAAAAvAcJpwYAAOMLvAcjC5MGAADkCwAwlAYAALIFABCVBgAA5AsAMJYGAQDeCgAhngZAAOAKACGfBkAA4AoAIcoGAADYC7wHI-8GAQDeCgAh9QYBAN8KACG6BwEA3woAIb0HAQDfCgAhJwsAAJ4LACAMAACgCwAgDwAA7wsAIBsAAKILACAoAACfCwAgKgAAoQsAICwAAPcLACAwAADoCwAgMQAA6QsAIDIAAOsLACAzAADtCwAgNAAA7gsAIDUAALELACA2AADxCwAgNwAA8gsAIDgAAPMLACA6AAD7CwAgPAAA5wsAID0AAOoLACA-AADsCwAgQgAA9gsAIEMAAPALACBEAAD0CwAgRQAA9QsAIEoAAPgLACBLAAD5CwAgTAAA-gsAIE0AAPoLACCTBgAA5QsAMJQGAAATABCVBgAA5QsAMJYGAQDxCgAhngZAAPUKACGfBkAA9QoAIcoGAADmC7wHI-8GAQDxCgAh9QYBAPIKACG6BwEA8goAIb0HAQDyCgAhBKAGAAAAvAcDoQYAAAC8BwmiBgAAALwHCacGAADjC7wHIwPyBgAADwAg8wYAAA8AIPQGAAAPACAD8gYAABoAIPMGAAAaACD0BgAAGgAgA_IGAACBAQAg8wYAAIEBACD0BgAAgQEAIAPyBgAA2AEAIPMGAADYAQAg9AYAANgBACAD8gYAAB4AIPMGAAAeACD0BgAAHgAgA_IGAAALACDzBgAACwAg9AYAAAsAIAPyBgAAXwAg8wYAAF8AIPQGAABfACAD8gYAAFEAIPMGAABRACD0BgAAUQAgA_IGAAA3ACDzBgAANwAg9AYAADcAIAPyBgAA4wEAIPMGAADjAQAg9AYAAOMBACAD8gYAAD0AIPMGAAA9ACD0BgAAPQAgA_IGAABCACDzBgAAQgAg9AYAAEIAIAPyBgAAcgAg8wYAAHIAIPQGAAByACASBgAAugsAIJMGAAC5CwAwlAYAAPUBABCVBgAAuQsAMJYGAQDxCgAhmwYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhkwcBAPEKACGUBwEA8QoAIZUHAQDxCgAhlgcBAPEKACGXBwEA8QoAIZgHAQDxCgAhmQcgAPQKACGaBwEA8goAIfsHAAD1AQAg_AcAAPUBACAD8gYAAPcBACDzBgAA9wEAIPQGAAD3AQAgA_IGAADpAQAg8wYAAOkBACD0BgAA6QEAIAPyBgAAJwAg8wYAACcAIPQGAAAnACAD8gYAAP4BACDzBgAA_gEAIPQGAAD-AQAgA_IGAACMAgAg8wYAAIwCACD0BgAAjAIAIAPyBgAAWQAg8wYAAFkAIPQGAABZACAD8gYAAMABACDzBgAAwAEAIPQGAADAAQAgCpMGAAD8CwAwlAYAAJoFABCVBgAA_AsAMJYGAQDeCgAhmwYBAN8KACGeBkAA4AoAIZ8GQADgCgAh9QYBAN8KACG6BwEA3woAIc0HAQDeCgAhCpMGAAD9CwAwlAYAAIIFABCVBgAA_QsAMJYGAQDeCgAhngZAAOAKACGfBkAA4AoAIfUGAQDfCgAhhgcBAN8KACG6BwEA3woAIc0HAQDeCgAhD5MGAAD-CwAwlAYAAOoEABCVBgAA_gsAMJYGAQDeCgAhmwYBAN4KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACG-BgEA3goAIb8GAQDeCgAhwAYBAN4KACHCBgEA3goAIfcGAQDeCgAhhwcBAN8KACHOB0AA4AoAIQ2TBgAA_wsAMJQGAADQBAAQlQYAAP8LADCWBgEA3goAIZsGAQDeCgAhnAYBAN4KACGeBkAA4AoAIZ8GQADgCgAh9QYBAN8KACGBBwIApAsAIYcHAQDfCgAhzwcBAN4KACHQBwEA3goAIQyTBgAAgAwAMJQGAAC4BAAQlQYAAIAMADCWBgEA3goAIZsGAQDeCgAhngZAAOAKACGfBkAA4AoAIe8GAQDfCgAh0QcBAN4KACHSBwEA3goAIdMHAgCMCwAh1QcAAIEM1QciBxQAAOIKACBtAACDDAAgbgAAgwwAIKAGAAAA1QcCoQYAAADVBwiiBgAAANUHCKcGAACCDNUHIgcUAADiCgAgbQAAgwwAIG4AAIMMACCgBgAAANUHAqEGAAAA1QcIogYAAADVBwinBgAAggzVByIEoAYAAADVBwKhBgAAANUHCKIGAAAA1QcIpwYAAIMM1QciCpMGAACEDAAwlAYAAKIEABCVBgAAhAwAMJYGAQDeCgAhmwYBAN4KACGcBgEA3woAIZ4GQADgCgAhnwZAAOAKACHvBgEA3goAIfUGAQDfCgAhCZMGAACFDAAwlAYAAIoEABCVBgAAhQwAMJYGAQDeCgAhnQYBAN4KACGeBkAA4AoAIZ8GQADgCgAh1gcBAN4KACHXB0AA4AoAIQmTBgAAhgwAMJQGAAD0AwAQlQYAAIYMADCWBgEA3goAIZ4GQADgCgAhnwZAAOAKACHXB0AA4AoAIdgHAQDeCgAh2QcBAN4KACEJkwYAAIcMADCUBgAA4QMAEJUGAACHDAAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh1wdAAPUKACHYBwEA8QoAIdkHAQDxCgAhEJMGAACIDAAwlAYAANsDABCVBgAAiAwAMJYGAQDeCgAhnQYBAN4KACGeBkAA4AoAIZ8GQADgCgAh2gcBAN4KACHbBwEA3goAIdwHAQDfCgAh3QcBAN8KACHeBwEA3woAId8HQAD7CgAh4AdAAPsKACHhBwEA3woAIeIHAQDfCgAhC5MGAACJDAAwlAYAAMUDABCVBgAAiQwAMJYGAQDeCgAhnQYBAN4KACGeBkAA4AoAIZ8GQADgCgAh1wdAAOAKACHjBwEA3goAIeQHAQDfCgAh5QcBAN8KACESkwYAAIoMADCUBgAArwMAEJUGAACKDAAwlgYBAN4KACGaBgEA3woAIZ4GQADgCgAhnwZAAOAKACHvBgEA3goAIaYHAQDeCgAh5gcBAN4KACHnByAA7AoAIegHAQDfCgAh6QcBAN8KACHqBwEA3woAIesHAQDfCgAh7AcBAN8KACHtBwEA3woAIe4HAQDeCgAhJwQAAIwMACAFAACNDAAgEAAA7QsAIBgAAO4LACA1AACxCwAgOgAA-wsAID4AAOwLACBDAADwCwAgTgAA8AsAIE8AALELACBQAACODAAgUQAArgsAIFIAAK4LACBTAACPDAAgVAAAkAwAIFUAAPoLACBWAAD6CwAgVwAA-QsAIFgAAPkLACBZAAD4CwAgWgAAkQwAIJMGAACLDAAwlAYAAE8AEJUGAACLDAAwlgYBAPEKACGaBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8QoAIaYHAQDxCgAh5gcBAPEKACHnByAA9AoAIegHAQDyCgAh6QcBAPIKACHqBwEA8goAIesHAQDyCgAh7AcBAPIKACHtBwEA8goAIe4HAQDxCgAhA_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_gEAEJUGAACnDAAwlgYBAPEKACGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHHBgEA8QoAIcgGAQDxCgAhpwcBAPEKACGoBwAApgymByL7BwAA_gEAIPwHAAD-AQAgAqMHAQAAAAGmBwAAAKYHAghHAACjDAAgkwYAAKUMADCUBgAAggIAEJUGAAClDAAwlgYBAPEKACGeBkAA9QoAIaMHAQDxCgAhpgcAAKYMpgciBKAGAAAApgcCoQYAAACmBwiiBgAAAKYHCKcGAADHC6YHIg8GAAC6CwAgRgAA9goAIEgAAKgMACBJAACRDAAgkwYAAKcMADCUBgAA_gEAEJUGAACnDAAwlgYBAPEKACGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHHBgEA8QoAIcgGAQDxCgAhpwcBAPEKACGoBwAApgymByID8gYAAIICACDzBgAAggIAIPQGAACCAgAgFgYAALoLACCTBgAAqQwAMJQGAAD3AQAQlQYAAKkMADCWBgEA8QoAIZsGAQDxCgAhngZAAPUKACGfBkAA9QoAIc4GAACtDIsHIuQGAACqDOQGIuYGEACrDAAh5wYBAPEKACHoBgIArAwAIYkHAQDxCgAhiwcBAPEKACGMBwEA8goAIY0HAQDyCgAhjgcBAPIKACGPBwEA8goAIZAHAQDyCgAhkQcAAK4MACCSB0AAnwwAIQSgBgAAAOQGAqEGAAAA5AYIogYAAADkBginBgAAlAvkBiIIoAYQAAAAAaEGEAAAAASiBhAAAAAEowYQAAAAAaQGEAAAAAGlBhAAAAABpgYQAAAAAacGEACQCwAhCKAGAgAAAAGhBgIAAAAEogYCAAAABKMGAgAAAAGkBgIAAAABpQYCAAAAAaYGAgAAAAGnBgIA4goAIQSgBgAAAIsHAqEGAAAAiwcIogYAAACLBwinBgAAtwuLByIMoAaAAAAAAaMGgAAAAAGkBoAAAAABpQaAAAAAAaYGgAAAAAGnBoAAAAABtQYBAAAAAbYGAQAAAAG3BgEAAAABuAaAAAAAAbkGgAAAAAG6BoAAAAABEQYAALoLACBBAACxDAAgkwYAAK8MADCUBgAA6QEAEJUGAACvDAAwlgYBAPEKACGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHOBgAAsAzmBiLiBgEA8goAIeQGAACqDOQGIuYGEACrDAAh5wYBAPEKACHoBgIArAwAIekGQAD1CgAh6gZAAPUKACEEoAYAAADmBgKhBgAAAOYGCKIGAAAA5gYIpwYAAJIL5gYiJAYAALcMACA_AAD2CgAgQAAAoAwAIEIAAPYLACCTBgAAsgwAMJQGAADjAQAQlQYAALIMADCWBgEA8QoAIZsGAQDyCgAhngZAAPUKACGfBkAA9QoAIc4GAAC2DMwHItAGQACfDAAh9QYBAPIKACG3BwEA8goAIbgHAQDxCgAhuQcBAPEKACG6BwEA8goAIbwHAADmC7wHI70HAQDyCgAhvgcAALMM5AYjvwcQALQMACHABwEA8QoAIcEHAgC1DAAhwgcAAK0MiwciwwcBAPIKACHEBwEA8goAIcUHAQDyCgAhxgcBAPIKACHHBwEA8goAIcgHAQDyCgAhyQcAAK4MACDKB0AAnwwAIcwHAQDyCgAh-wcAAOMBACD8BwAA4wEAICIGAAC3DAAgPwAA9goAIEAAAKAMACBCAAD2CwAgkwYAALIMADCUBgAA4wEAEJUGAACyDAAwlgYBAPEKACGbBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHOBgAAtgzMByLQBkAAnwwAIfUGAQDyCgAhtwcBAPIKACG4BwEA8QoAIbkHAQDxCgAhugcBAPIKACG8BwAA5gu8ByO9BwEA8goAIb4HAACzDOQGI78HEAC0DAAhwAcBAPEKACHBBwIAtQwAIcIHAACtDIsHIsMHAQDyCgAhxAcBAPIKACHFBwEA8goAIcYHAQDyCgAhxwcBAPIKACHIBwEA8goAIckHAACuDAAgygdAAJ8MACHMBwEA8goAIQSgBgAAAOQGA6EGAAAA5AYJogYAAADkBgmnBgAA4QvkBiMIoAYQAAAAAaEGEAAAAAWiBhAAAAAFowYQAAAAAaQGEAAAAAGlBhAAAAABpgYQAAAAAacGEADfCwAhCKAGAgAAAAGhBgIAAAAFogYCAAAABaMGAgAAAAGkBgIAAAABpQYCAAAAAaYGAgAAAAGnBgIA5QoAIQSgBgAAAMwHAqEGAAAAzAcIogYAAADMBwinBgAA3QvMByIpCwAAngsAIAwAAKALACAPAADvCwAgGwAAogsAICgAAJ8LACAqAAChCwAgLAAA9wsAIDAAAOgLACAxAADpCwAgMgAA6wsAIDMAAO0LACA0AADuCwAgNQAAsQsAIDYAAPELACA3AADyCwAgOAAA8wsAIDoAAPsLACA8AADnCwAgPQAA6gsAID4AAOwLACBCAAD2CwAgQwAA8AsAIEQAAPQLACBFAAD1CwAgSgAA-AsAIEsAAPkLACBMAAD6CwAgTQAA-gsAIJMGAADlCwAwlAYAABMAEJUGAADlCwAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhygYAAOYLvAcj7wYBAPEKACH1BgEA8goAIboHAQDyCgAhvQcBAPIKACH7BwAAEwAg_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-gsAICMAAPELACAlAACxCwAgJwAA8wsAIJMGAAC-DAAwlAYAAF8AEJUGAAC-DAAwlgYBAPEKACGXBgEA8QoAIZgGAQDxCgAhmQYBAPEKACGaBgEA8goAIZsGAQDxCgAhnAYBAPEKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACH7BwAAXwAg_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_wrKBiIWBgAAugsAIAgAAL0MACAMAACgCwAgDwAA7wsAIBoAAMYMACAjAADxCwAgKQAA5gwAIJMGAADlDAAwlAYAADIAEJUGAADlDAAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIe8GAQDxCgAh9QYBAPIKACH2BgIAtQwAIfcGAQDxCgAh-AYBAPIKACH7BwAAMgAg_AcAADIAIAK-BgEAAAABvwYBAAAAARAGAAC6CwAgCAAAvQwAIA0AAOEMACAOAADkDAAgEAAAyQwAIJMGAADjDAAwlAYAADcAEJUGAADjDAAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIb4GAQDxCgAhvwYBAPEKACHABgEA8QoAIRQGAAC6CwAgCAAAuwwAIAkAAPAMACAMAACgCwAgDwAA7wsAIJMGAADxDAAwlAYAAB4AEJUGAADxDAAwlgYBAPEKACGbBgEA8QoAIZwGAQDxCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhgQcCALUMACGHBwEA8goAIc8HAQDxCgAh0AcBAPEKACH7BwAAHgAg_AcAAB4AIBQGAAC6CwAgCAAAvQwAIAwAAKALACAPAADvCwAgGgAAxgwAICMAAPELACApAADmDAAgkwYAAOUMADCUBgAAMgAQlQYAAOUMADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPEKACH1BgEA8goAIfYGAgC1DAAh9wYBAPEKACH4BgEA8goAIQ8GAAC6CwAgCAAAvQwAICgAAJ8LACCTBgAAvwwAMJQGAACBAQAQlQYAAL8MADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPEKACH1BgEA8goAIfsHAACBAQAg_AcAAIEBACASBgAAtwwAIAgAAL0MACAKAAD3CwAgGgAA6QwAIJMGAADnDAAwlAYAAC4AEJUGAADnDAAwlgYBAPEKACGbBgEA8goAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIc4GAADoDPwGIu8GAQDxCgAh9QYBAPIKACH3BgEA8goAIfkGAQDxCgAh-gYBAPEKACEEoAYAAAD8BgKhBgAAAPwGCKIGAAAA_AYIpwYAAKkL_AYiDwsAAJ4LACAMAACgCwAgGwAAogsAICgAAJ8LACAqAAChCwAgkwYAAJ0LADCUBgAALAAQlQYAAJ0LADCWBgEA8QoAIZsGAQDxCgAh7wYBAPEKACHwBkAA9QoAIfEGQAD1CgAh-wcAACwAIPwHAAAsACATBgAAtwwAIAgAAL0MACAmAADDDAAgKwAA6wwAIC0AAOwMACCTBgAA6gwAMJQGAAAnABCVBgAA6gwAMJYGAQDxCgAhmwYBAPIKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHUBgEA8QoAIe8GAQDxCgAh9QYBAPIKACH8BgEA8goAIf0GAQDxCgAh_gYBAPEKACEUBgAAtwwAIAgAAL0MACAKAAD3CwAgGgAA6QwAIJMGAADnDAAwlAYAAC4AEJUGAADnDAAwlgYBAPEKACGbBgEA8goAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIc4GAADoDPwGIu8GAQDxCgAh9QYBAPIKACH3BgEA8goAIfkGAQDxCgAh-gYBAPEKACH7BwAALgAg_AcAAC4AIBAGAAC6CwAgLAAA9wsAIJMGAAC4DAAwlAYAANgBABCVBgAAuAwAMJYGAQDxCgAhmwYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPIKACHRBwEA8QoAIdIHAQDxCgAh0wcCAKwMACHVBwAAuQzVByL7BwAA2AEAIPwHAADYAQAgGgYAALoLACAIAAC9DAAgCQAA8AwAIAoAAPcLACANAADhDAAgDgAA5AwAIBAAAMkMACAYAADWDAAgGgAAxgwAIC4AAO4MACAvAADvDAAgkwYAAO0MADCUBgAAIwAQlQYAAO0MADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhvgYBAPEKACG_BgEA8QoAIcAGAQDxCgAhwgYBAPEKACH3BgEA8QoAIYcHAQDyCgAhzgdAAPUKACED8gYAAJsBACDzBgAAmwEAIPQGAACbAQAgHQYAALoLACAIAAC9DAAgEAAAyQwAICYAAMMMACCTBgAAxwwAMJQGAAByABCVBgAAxwwAMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHABgEA8QoAIdQGAQDxCgAh1QYIAMgMACHWBggAyAwAIdcGCADIDAAh2AYIAMgMACHZBggAyAwAIdoGCADIDAAh2wYIAMgMACHcBggAyAwAId0GCADIDAAh3gYIAMgMACHfBggAyAwAIeAGCADIDAAh4QYIAMgMACH7BwAAcgAg_AcAAHIAIBQGAAC6CwAgCAAAuwwAIAwAAKALACAOAADrCwAgkwYAAPIMADCUBgAAGgAQlQYAAPIMADCWBgEA8QoAIZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhxwYBAPEKACH1BgEA8goAIf8GAQDyCgAhgAdAAJ8MACGBBwgAyAwAIYIHCADIDAAh-wcAABoAIPwHAAAaACASBgAAugsAIAgAALsMACAJAADwDAAgDAAAoAsAIA8AAO8LACCTBgAA8QwAMJQGAAAeABCVBgAA8QwAMJYGAQDxCgAhmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACH1BgEA8goAIYEHAgC1DAAhhwcBAPIKACHPBwEA8QoAIdAHAQDxCgAhEgYAALoLACAIAAC7DAAgDAAAoAsAIA4AAOsLACCTBgAA8gwAMJQGAAAaABCVBgAA8gwAMJYGAQDxCgAhmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHHBgEA8QoAIfUGAQDyCgAh_wYBAPIKACGAB0AAnwwAIYEHCADIDAAhggcIAMgMACEdBwAA9AwAIAsAAJ4LACAMAACgCwAgDwAA7wsAIBsAAKILACAoAACfCwAgKgAAoQsAICwAAPcLACAwAADoCwAgMQAA6QsAIDIAAOsLACAzAADtCwAgNAAA7gsAIDUAALELACA2AADxCwAgNwAA8gsAIDgAAPMLACA5AAD6CwAgOgAA-wsAIJMGAADzDAAwlAYAABUAEJUGAADzDAAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh9QYBAPIKACGGBwEA8goAIboHAQDyCgAhzQcBAPEKACEOBgAAtwwAIDsAAPYMACCTBgAA9QwAMJQGAAAPABCVBgAA9QwAMJYGAQDxCgAhmwYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh9QYBAPIKACG6BwEA8goAIc0HAQDxCgAh-wcAAA8AIPwHAAAPACAMBgAAtwwAIDsAAPYMACCTBgAA9QwAMJQGAAAPABCVBgAA9QwAMJYGAQDxCgAhmwYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh9QYBAPIKACG6BwEA8goAIc0HAQDxCgAhA_IGAAAVACDzBgAAFQAg9AYAABUAIAsDAAD2CgAgBgAAugsAIJMGAAD3DAAwlAYAAAsAEJUGAAD3DAAwlgYBAPEKACGbBgEA8QoAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIaYHAAD4DPIHIgSgBgAAAPIHAqEGAAAA8gcIogYAAADyBwinBgAAmQzyByIRAwAA9goAIJMGAAD5DAAwlAYAAAcAEJUGAAD5DAAwlgYBAPEKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHaBwEA8QoAIdsHAQDxCgAh3AcBAPIKACHdBwEA8goAId4HAQDyCgAh3wdAAJ8MACHgB0AAnwwAIeEHAQDyCgAh4gcBAPIKACEMAwAA9goAIJMGAAD6DAAwlAYAAAMAEJUGAAD6DAAwlgYBAPEKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHXB0AA9QoAIeMHAQDxCgAh5AcBAPIKACHlBwEA8goAIQKbBgEAAAABnQYBAAAAAQAAAAABgAgBAAAAAQGACAEAAAABAYAIQAAAAAEFZwAAth0AIGgAAPweACD9BwAAtx0AIP4HAAD7HgAggwgAAJ0FACALZwAAjA4AMGgAAJEOADD9BwAAjQ4AMP4HAACODgAw_wcAAI8OACCACAAAkA4AMIEIAACQDgAwgggAAJAOADCDCAAAkA4AMIQIAACSDgAwhQgAAJMOADALZwAA-A0AMGgAAP0NADD9BwAA-Q0AMP4HAAD6DQAw_wcAAPsNACCACAAA_A0AMIEIAAD8DQAwgggAAPwNADCDCAAA_A0AMIQIAAD-DQAwhQgAAP8NADALZwAA0Q0AMGgAANYNADD9BwAA0g0AMP4HAADTDQAw_wcAANQNACCACAAA1Q0AMIEIAADVDQAwgggAANUNADCDCAAA1Q0AMIQIAADXDQAwhQgAANgNADALZwAAug0AMGgAAL8NADD9BwAAuw0AMP4HAAC8DQAw_wcAAL0NACCACAAAvg0AMIEIAAC-DQAwgggAAL4NADCDCAAAvg0AMIQIAADADQAwhQgAAMENADALZwAApw0AMGgAAKwNADD9BwAAqA0AMP4HAACpDQAw_wcAAKoNACCACAAAqw0AMIEIAACrDQAwgggAAKsNADCDCAAAqw0AMIQIAACtDQAwhQgAAK4NADALZwAAjA0AMGgAAJENADD9BwAAjQ0AMP4HAACODQAw_wcAAI8NACCACAAAkA0AMIEIAACQDQAwgggAAJANADCDCAAAkA0AMIQIAACSDQAwhQgAAJMNADAFZwAAtB0AIGgAAPkeACD9BwAAtR0AIP4HAAD4HgAggwgAABcAIAVnAACyHQAgaAAA9h4AIP0HAACzHQAg_gcAAPUeACCDCAAAmgMAIBUXAACkDQAgGAAApQ0AIB0AAKENACAeAACiDQAgHwAAow0AICAAAKYNACCWBgEAAAABngZAAAAAAZ8GQAAAAAHCBgEAAAABzgYAAACsBwLQBkAAAAAB0wYBAAAAAaoHAAAAqgcCrAcBAAAAAa0HAQAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgdAAAAAAQIAAABbACBnAACgDQAgAwAAAFsAIGcAAKANACBoAACZDQAgAWAAAPQeADAaEAAAzgwAIBcAAKAMACAYAADSDAAgHQAAugsAIB4AALoLACAfAAD2CgAgIAAAvQwAIJMGAADPDAAwlAYAAFkAEJUGAADPDAAwlgYBAAAAAZ4GQAD1CgAhnwZAAPUKACHABgEA8goAIcIGAQDyCgAhzgYAANEMrAci0AZAAJ8MACHTBgEA8goAIaoHAADQDKoHIqwHAQDxCgAhrQcBAPEKACGuBwEA8QoAIa8HAQDyCgAhsAcBAPIKACGxBwEA8goAIbIHQAD1CgAhAgAAAFsAIGAAAJkNACACAAAAlA0AIGAAAJUNACATkwYAAJMNADCUBgAAlA0AEJUGAACTDQAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhwAYBAPIKACHCBgEA8goAIc4GAADRDKwHItAGQACfDAAh0wYBAPIKACGqBwAA0AyqByKsBwEA8QoAIa0HAQDxCgAhrgcBAPEKACGvBwEA8goAIbAHAQDyCgAhsQcBAPIKACGyB0AA9QoAIROTBgAAkw0AMJQGAACUDQAQlQYAAJMNADCWBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHABgEA8goAIcIGAQDyCgAhzgYAANEMrAci0AZAAJ8MACHTBgEA8goAIaoHAADQDKoHIqwHAQDxCgAhrQcBAPEKACGuBwEA8QoAIa8HAQDyCgAhsAcBAPIKACGxBwEA8goAIbIHQAD1CgAhD5YGAQCADQAhngZAAIINACGfBkAAgg0AIcIGAQCBDQAhzgYAAJcNrAci0AZAAJgNACHTBgEAgQ0AIaoHAACWDaoHIqwHAQCADQAhrQcBAIANACGuBwEAgA0AIa8HAQCBDQAhsAcBAIENACGxBwEAgQ0AIbIHQACCDQAhAYAIAAAAqgcCAYAIAAAArAcCAYAIQAAAAAEVFwAAnQ0AIBgAAJ4NACAdAACaDQAgHgAAmw0AIB8AAJwNACAgAACfDQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhwgYBAIENACHOBgAAlw2sByLQBkAAmA0AIdMGAQCBDQAhqgcAAJYNqgcirAcBAIANACGtBwEAgA0AIa4HAQCADQAhrwcBAIENACGwBwEAgQ0AIbEHAQCBDQAhsgdAAIINACEFZwAA4B4AIGgAAPIeACD9BwAA4R4AIP4HAADxHgAggwgAAJ0FACAFZwAA3h4AIGgAAO8eACD9BwAA3x4AIP4HAADuHgAggwgAAJ0FACAFZwAA3B4AIGgAAOweACD9BwAA3R4AIP4HAADrHgAggwgAAJoDACAHZwAA2h4AIGgAAOkeACD9BwAA2x4AIP4HAADoHgAggQgAAE8AIIIIAABPACCDCAAAmgMAIAdnAADYHgAgaAAA5h4AIP0HAADZHgAg_gcAAOUeACCBCAAAUQAggggAAFEAIIMIAACzAQAgB2cAANYeACBoAADjHgAg_QcAANceACD-BwAA4h4AIIEIAAAVACCCCAAAFQAggwgAABcAIBUXAACkDQAgGAAApQ0AIB0AAKENACAeAACiDQAgHwAAow0AICAAAKYNACCWBgEAAAABngZAAAAAAZ8GQAAAAAHCBgEAAAABzgYAAACsBwLQBkAAAAAB0wYBAAAAAaoHAAAAqgcCrAcBAAAAAa0HAQAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgdAAAAAAQNnAADgHgAg_QcAAOEeACCDCAAAnQUAIANnAADeHgAg_QcAAN8eACCDCAAAnQUAIANnAADcHgAg_QcAAN0eACCDCAAAmgMAIANnAADaHgAg_QcAANseACCDCAAAmgMAIANnAADYHgAg_QcAANkeACCDCAAAswEAIANnAADWHgAg_QcAANceACCDCAAAFwAgFgYAALgNACAIAAC5DQAgJgAAtw0AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB1AYBAAAAAdUGCAAAAAHWBggAAAAB1wYIAAAAAdgGCAAAAAHZBggAAAAB2gYIAAAAAdsGCAAAAAHcBggAAAAB3QYIAAAAAd4GCAAAAAHfBggAAAAB4AYIAAAAAeEGCAAAAAECAAAAdAAgZwAAtg0AIAMAAAB0ACBnAAC2DQAgaAAAsg0AIAFgAADVHgAwGwYAALoLACAIAAC9DAAgEAAAyQwAICYAAMMMACCTBgAAxwwAMJQGAAByABCVBgAAxwwAMJYGAQAAAAGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIcAGAQDxCgAh1AYBAAAAAdUGCADIDAAh1gYIAMgMACHXBggAyAwAIdgGCADIDAAh2QYIAMgMACHaBggAyAwAIdsGCADIDAAh3AYIAMgMACHdBggAyAwAId4GCADIDAAh3wYIAMgMACHgBggAyAwAIeEGCADIDAAhAgAAAHQAIGAAALINACACAAAArw0AIGAAALANACAXkwYAAK4NADCUBgAArw0AEJUGAACuDQAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIcAGAQDxCgAh1AYBAPEKACHVBggAyAwAIdYGCADIDAAh1wYIAMgMACHYBggAyAwAIdkGCADIDAAh2gYIAMgMACHbBggAyAwAIdwGCADIDAAh3QYIAMgMACHeBggAyAwAId8GCADIDAAh4AYIAMgMACHhBggAyAwAIReTBgAArg0AMJQGAACvDQAQlQYAAK4NADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhwAYBAPEKACHUBgEA8QoAIdUGCADIDAAh1gYIAMgMACHXBggAyAwAIdgGCADIDAAh2QYIAMgMACHaBggAyAwAIdsGCADIDAAh3AYIAMgMACHdBggAyAwAId4GCADIDAAh3wYIAMgMACHgBggAyAwAIeEGCADIDAAhE5YGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHUBgEAgA0AIdUGCACxDQAh1gYIALENACHXBggAsQ0AIdgGCACxDQAh2QYIALENACHaBggAsQ0AIdsGCACxDQAh3AYIALENACHdBggAsQ0AId4GCACxDQAh3wYIALENACHgBggAsQ0AIeEGCACxDQAhBYAICAAAAAGGCAgAAAABhwgIAAAAAYgICAAAAAGJCAgAAAABFgYAALQNACAIAAC1DQAgJgAAsw0AIJYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHUBgEAgA0AIdUGCACxDQAh1gYIALENACHXBggAsQ0AIdgGCACxDQAh2QYIALENACHaBggAsQ0AIdsGCACxDQAh3AYIALENACHdBggAsQ0AId4GCACxDQAh3wYIALENACHgBggAsQ0AIeEGCACxDQAhBWcAAMoeACBoAADTHgAg_QcAAMseACD-BwAA0h4AIIMIAAAlACAFZwAAyB4AIGgAANAeACD9BwAAyR4AIP4HAADPHgAggwgAAJ0FACAHZwAAxh4AIGgAAM0eACD9BwAAxx4AIP4HAADMHgAggQgAABUAIIIIAAAVACCDCAAAFwAgFgYAALgNACAIAAC5DQAgJgAAtw0AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB1AYBAAAAAdUGCAAAAAHWBggAAAAB1wYIAAAAAdgGCAAAAAHZBggAAAAB2gYIAAAAAdsGCAAAAAHcBggAAAAB3QYIAAAAAd4GCAAAAAHfBggAAAAB4AYIAAAAAeEGCAAAAAEDZwAAyh4AIP0HAADLHgAggwgAACUAIANnAADIHgAg_QcAAMkeACCDCAAAnQUAIANnAADGHgAg_QcAAMceACCDCAAAFwAgEgYAAM8NACAIAADQDQAgFQAAzA0AIBcAAM4NACAkAADNDQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAGrBgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAdMGAQAAAAECAAAAawAgZwAAyw0AIAMAAABrACBnAADLDQAgaAAAxQ0AIAFgAADFHgAwGAYAALoLACAIAAC9DAAgEAAAzgwAIBUAAM0MACAXAACgDAAgJAAA9goAIJMGAADLDAAwlAYAAGkAEJUGAADLDAAwlgYBAAAAAZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhqwYBAPEKACHABgEA8goAIcwGAQDyCgAhzgYAAMwMzgYizwYBAPIKACHQBkAAnwwAIdEGQAD1CgAh0gYBAPEKACHTBgEA8goAIfYHAADKDAAgAgAAAGsAIGAAAMUNACACAAAAwg0AIGAAAMMNACARkwYAAMENADCUBgAAwg0AEJUGAADBDQAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIasGAQDxCgAhwAYBAPIKACHMBgEA8goAIc4GAADMDM4GIs8GAQDyCgAh0AZAAJ8MACHRBkAA9QoAIdIGAQDxCgAh0wYBAPIKACERkwYAAMENADCUBgAAwg0AEJUGAADBDQAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIasGAQDxCgAhwAYBAPIKACHMBgEA8goAIc4GAADMDM4GIs8GAQDyCgAh0AZAAJ8MACHRBkAA9QoAIdIGAQDxCgAh0wYBAPIKACENlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIasGAQCADQAhzAYBAIENACHOBgAAxA3OBiLPBgEAgQ0AIdAGQACYDQAh0QZAAIINACHSBgEAgA0AIdMGAQCBDQAhAYAIAAAAzgYCEgYAAMkNACAIAADKDQAgFQAAxg0AIBcAAMgNACAkAADHDQAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIasGAQCADQAhzAYBAIENACHOBgAAxA3OBiLPBgEAgQ0AIdAGQACYDQAh0QZAAIINACHSBgEAgA0AIdMGAQCBDQAhBWcAALQeACBoAADDHgAg_QcAALUeACD-BwAAwh4AIIMIAAChBwAgBWcAALIeACBoAADAHgAg_QcAALMeACD-BwAAvx4AIIMIAACaAwAgB2cAALAeACBoAAC9HgAg_QcAALEeACD-BwAAvB4AIIEIAABPACCCCAAATwAggwgAAJoDACAFZwAArh4AIGgAALoeACD9BwAArx4AIP4HAAC5HgAggwgAAJ0FACAHZwAArB4AIGgAALceACD9BwAArR4AIP4HAAC2HgAggQgAABUAIIIIAAAVACCDCAAAFwAgEgYAAM8NACAIAADQDQAgFQAAzA0AIBcAAM4NACAkAADNDQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAGrBgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAdMGAQAAAAEDZwAAtB4AIP0HAAC1HgAggwgAAKEHACADZwAAsh4AIP0HAACzHgAggwgAAJoDACADZwAAsB4AIP0HAACxHgAggwgAAJoDACADZwAArh4AIP0HAACvHgAggwgAAJ0FACADZwAArB4AIP0HAACtHgAggwgAABcAIA4GAAD1DQAgCAAA9g0AIA0AAPQNACAiAAD3DQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABxwYBAAAAAcgGAQAAAAHKBgAAAMoGAssGQAAAAAECAAAAPwAgZwAA8w0AIAMAAAA_ACBnAADzDQAgaAAA3A0AIAFgAACrHgAwEwYAALoLACAIAAC9DAAgDQAA4QwAIBAAAMkMACAiAADyCwAgkwYAAN8MADCUBgAAPQAQlQYAAN8MADCWBgEAAAABmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACG-BgEA8QoAIcAGAQDxCgAhxwYBAPEKACHIBgEA8goAIcoGAADgDMoGIssGQACfDAAhAgAAAD8AIGAAANwNACACAAAA2Q0AIGAAANoNACAOkwYAANgNADCUBgAA2Q0AEJUGAADYDQAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIb4GAQDxCgAhwAYBAPEKACHHBgEA8QoAIcgGAQDyCgAhygYAAOAMygYiywZAAJ8MACEOkwYAANgNADCUBgAA2Q0AEJUGAADYDQAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIb4GAQDxCgAhwAYBAPEKACHHBgEA8QoAIcgGAQDyCgAhygYAAOAMygYiywZAAJ8MACEKlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhxwYBAIANACHIBgEAgQ0AIcoGAADbDcoGIssGQACYDQAhAYAIAAAAygYCDgYAAN4NACAIAADfDQAgDQAA3Q0AICIAAOANACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACHHBgEAgA0AIcgGAQCBDQAhygYAANsNygYiywZAAJgNACEFZwAAkB4AIGgAAKkeACD9BwAAkR4AIP4HAACoHgAggwgAADQAIAVnAACOHgAgaAAAph4AIP0HAACPHgAg_gcAAKUeACCDCAAAnQUAIAdnAACMHgAgaAAAox4AIP0HAACNHgAg_gcAAKIeACCBCAAAFQAggggAABUAIIMIAAAXACALZwAA4Q0AMGgAAOYNADD9BwAA4g0AMP4HAADjDQAw_wcAAOQNACCACAAA5Q0AMIEIAADlDQAwgggAAOUNADCDCAAA5Q0AMIQIAADnDQAwhQgAAOgNADANBgAA8Q0AIAgAAPINACAYAADwDQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHCBgEAAAABwwYBAAAAAcQGAQAAAAHFBgEAAAABxgZAAAAAAQIAAABEACBnAADvDQAgAwAAAEQAIGcAAO8NACBoAADrDQAgAWAAAKEeADATBgAAugsAIAgAAL0MACARAADeDAAgGAAA1gwAIJMGAADdDAAwlAYAAEIAEJUGAADdDAAwlgYBAAAAAZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhwQYBAPEKACHCBgEA8QoAIcMGAQDyCgAhxAYBAPIKACHFBgEA8goAIcYGQAD1CgAh-AcAANwMACACAAAARAAgYAAA6w0AIAIAAADpDQAgYAAA6g0AIA6TBgAA6A0AMJQGAADpDQAQlQYAAOgNADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhwQYBAPEKACHCBgEA8QoAIcMGAQDyCgAhxAYBAPIKACHFBgEA8goAIcYGQAD1CgAhDpMGAADoDQAwlAYAAOkNABCVBgAA6A0AMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHBBgEA8QoAIcIGAQDxCgAhwwYBAPIKACHEBgEA8goAIcUGAQDyCgAhxgZAAPUKACEKlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIcIGAQCADQAhwwYBAIENACHEBgEAgQ0AIcUGAQCBDQAhxgZAAIINACENBgAA7Q0AIAgAAO4NACAYAADsDQAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIcIGAQCADQAhwwYBAIENACHEBgEAgQ0AIcUGAQCBDQAhxgZAAIINACEFZwAAlh4AIGgAAJ8eACD9BwAAlx4AIP4HAACeHgAggwgAALMBACAFZwAAlB4AIGgAAJweACD9BwAAlR4AIP4HAACbHgAggwgAAJ0FACAHZwAAkh4AIGgAAJkeACD9BwAAkx4AIP4HAACYHgAggQgAABUAIIIIAAAVACCDCAAAFwAgDQYAAPENACAIAADyDQAgGAAA8A0AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwgYBAAAAAcMGAQAAAAHEBgEAAAABxQYBAAAAAcYGQAAAAAEDZwAAlh4AIP0HAACXHgAggwgAALMBACADZwAAlB4AIP0HAACVHgAggwgAAJ0FACADZwAAkh4AIP0HAACTHgAggwgAABcAIA4GAAD1DQAgCAAA9g0AIA0AAPQNACAiAAD3DQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABxwYBAAAAAcgGAQAAAAHKBgAAAMoGAssGQAAAAAEDZwAAkB4AIP0HAACRHgAggwgAADQAIANnAACOHgAg_QcAAI8eACCDCAAAnQUAIANnAACMHgAg_QcAAI0eACCDCAAAFwAgBGcAAOENADD9BwAA4g0AMP8HAADkDQAggwgAAOUNADALBgAAig4AIAgAAIsOACANAACIDgAgDgAAiQ4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAECAAAAOQAgZwAAhw4AIAMAAAA5ACBnAACHDgAgaAAAgg4AIAFgAACLHgAwEQYAALoLACAIAAC9DAAgDQAA4QwAIA4AAOQMACAQAADJDAAgkwYAAOMMADCUBgAANwAQlQYAAOMMADCWBgEAAAABmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACG-BgEA8QoAIb8GAQDxCgAhwAYBAPEKACH5BwAA4gwAIAIAAAA5ACBgAACCDgAgAgAAAIAOACBgAACBDgAgC5MGAAD_DQAwlAYAAIAOABCVBgAA_w0AMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACG-BgEA8QoAIb8GAQDxCgAhwAYBAPEKACELkwYAAP8NADCUBgAAgA4AEJUGAAD_DQAwlgYBAPEKACGbBgEA8QoAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIb4GAQDxCgAhvwYBAPEKACHABgEA8QoAIQeWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACG_BgEAgA0AIQsGAACFDgAgCAAAhg4AIA0AAIMOACAOAACEDgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACEFZwAA_R0AIGgAAIkeACD9BwAA_h0AIP4HAACIHgAggwgAADQAIAVnAAD7HQAgaAAAhh4AIP0HAAD8HQAg_gcAAIUeACCDCAAAIAAgBWcAAPkdACBoAACDHgAg_QcAAPodACD-BwAAgh4AIIMIAACdBQAgB2cAAPcdACBoAACAHgAg_QcAAPgdACD-BwAA_x0AIIEIAAAVACCCCAAAFQAggwgAABcAIAsGAACKDgAgCAAAiw4AIA0AAIgOACAOAACJDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAAQNnAAD9HQAg_QcAAP4dACCDCAAANAAgA2cAAPsdACD9BwAA_B0AIIMIAAAgACADZwAA-R0AIP0HAAD6HQAggwgAAJ0FACADZwAA9x0AIP0HAAD4HQAggwgAABcAIBUGAADTDgAgCAAA0A4AIAkAANEOACAKAADKDgAgDQAAzw4AIA4AAM0OACAYAADODgAgGgAA0g4AIC4AAMsOACAvAADMDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAAcIGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAECAAAAJQAgZwAAyQ4AIAMAAAAlACBnAADJDgAgaAAAlg4AIAFgAAD2HQAwGgYAALoLACAIAAC9DAAgCQAA8AwAIAoAAPcLACANAADhDAAgDgAA5AwAIBAAAMkMACAYAADWDAAgGgAAxgwAIC4AAO4MACAvAADvDAAgkwYAAO0MADCUBgAAIwAQlQYAAO0MADCWBgEAAAABmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACG-BgEA8QoAIb8GAQDxCgAhwAYBAPEKACHCBgEA8QoAIfcGAQDxCgAhhwcBAPIKACHOB0AA9QoAIQIAAAAlACBgAACWDgAgAgAAAJQOACBgAACVDgAgD5MGAACTDgAwlAYAAJQOABCVBgAAkw4AMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACG-BgEA8QoAIb8GAQDxCgAhwAYBAPEKACHCBgEA8QoAIfcGAQDxCgAhhwcBAPIKACHOB0AA9QoAIQ-TBgAAkw4AMJQGAACUDgAQlQYAAJMOADCWBgEA8QoAIZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhvgYBAPEKACG_BgEA8QoAIcAGAQDxCgAhwgYBAPEKACH3BgEA8QoAIYcHAQDyCgAhzgdAAPUKACELlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHCBgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIRUGAACgDgAgCAAAnQ4AIAkAAJ4OACAKAACXDgAgDQAAnA4AIA4AAJoOACAYAACbDgAgGgAAnw4AIC4AAJgOACAvAACZDgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHCBgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIQtnAAC1DgAwaAAAug4AMP0HAAC2DgAw_gcAALcOADD_BwAAuA4AIIAIAAC5DgAwgQgAALkOADCCCAAAuQ4AMIMIAAC5DgAwhAgAALsOADCFCAAAvA4AMAtnAACoDgAwaAAArQ4AMP0HAACpDgAw_gcAAKoOADD_BwAAqw4AIIAIAACsDgAwgQgAAKwOADCCCAAArA4AMIMIAACsDgAwhAgAAK4OADCFCAAArw4AMAdnAAChDgAgaAAApA4AIP0HAACiDgAg_gcAAKMOACCBCAAAcgAggggAAHIAIIMIAAB0ACAFZwAAxB0AIGgAAPQdACD9BwAAxR0AIP4HAADzHQAggwgAACAAIAVnAADCHQAgaAAA8R0AIP0HAADDHQAg_gcAAPAdACCDCAAAswEAIAVnAADAHQAgaAAA7h0AIP0HAADBHQAg_gcAAO0dACCDCAAANAAgB2cAAL4dACBoAADrHQAg_QcAAL8dACD-BwAA6h0AIIEIAAAVACCCCAAAFQAggwgAABcAIAdnAAC8HQAgaAAA6B0AIP0HAAC9HQAg_gcAAOcdACCBCAAAGgAggggAABoAIIMIAAAcACAFZwAAuh0AIGgAAOUdACD9BwAAux0AIP4HAADkHQAggwgAALkIACAFZwAAuB0AIGgAAOIdACD9BwAAuR0AIP4HAADhHQAggwgAAJ0FACAWBgAAuA0AIAgAALkNACAQAACnDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHABgEAAAAB1QYIAAAAAdYGCAAAAAHXBggAAAAB2AYIAAAAAdkGCAAAAAHaBggAAAAB2wYIAAAAAdwGCAAAAAHdBggAAAAB3gYIAAAAAd8GCAAAAAHgBggAAAAB4QYIAAAAAQIAAAB0ACBnAAChDgAgAwAAAHIAIGcAAKEOACBoAAClDgAgGAAAAHIAIAYAALQNACAIAAC1DQAgEAAApg4AIGAAAKUOACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhwAYBAIANACHVBggAsQ0AIdYGCACxDQAh1wYIALENACHYBggAsQ0AIdkGCACxDQAh2gYIALENACHbBggAsQ0AIdwGCACxDQAh3QYIALENACHeBggAsQ0AId8GCACxDQAh4AYIALENACHhBggAsQ0AIRYGAAC0DQAgCAAAtQ0AIBAAAKYOACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhwAYBAIANACHVBggAsQ0AIdYGCACxDQAh1wYIALENACHYBggAsQ0AIdkGCACxDQAh2gYIALENACHbBggAsQ0AIdwGCACxDQAh3QYIALENACHeBggAsQ0AId8GCACxDQAh4AYIALENACHhBggAsQ0AIQVnAADcHQAgaAAA3x0AIP0HAADdHQAg_gcAAN4dACCDCAAAsAEAIANnAADcHQAg_QcAAN0dACCDCAAAsAEAIAWWBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAPEHAu8HQAAAAAECAAAAnQEAIGcAALQOACADAAAAnQEAIGcAALQOACBoAACzDgAgAWAAANsdADALJgAAwwwAIJMGAADBDAAwlAYAAJsBABCVBgAAwQwAMJYGAQAAAAGeBkAA9QoAIZ8GQAD1CgAhzgYAAMIM8Qci1AYBAPEKACHvB0AA9QoAIfQHAADADAAgAgAAAJ0BACBgAACzDgAgAgAAALAOACBgAACxDgAgCZMGAACvDgAwlAYAALAOABCVBgAArw4AMJYGAQDxCgAhngZAAPUKACGfBkAA9QoAIc4GAADCDPEHItQGAQDxCgAh7wdAAPUKACEJkwYAAK8OADCUBgAAsA4AEJUGAACvDgAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhzgYAAMIM8Qci1AYBAPEKACHvB0AA9QoAIQWWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHOBgAAsg7xByLvB0AAgg0AIQGACAAAAPEHAgWWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHOBgAAsg7xByLvB0AAgg0AIQWWBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAPEHAu8HQAAAAAEOBgAAxw4AIAgAAMgOACArAADFDgAgLQAAxg4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAfUGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAECAAAAKQAgZwAAxA4AIAMAAAApACBnAADEDgAgaAAAvw4AIAFgAADaHQAwEwYAALcMACAIAAC9DAAgJgAAwwwAICsAAOsMACAtAADsDAAgkwYAAOoMADCUBgAAJwAQlQYAAOoMADCWBgEAAAABmwYBAPIKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHUBgEA8QoAIe8GAQDxCgAh9QYBAPIKACH8BgEA8goAIf0GAQDxCgAh_gYBAPEKACECAAAAKQAgYAAAvw4AIAIAAAC9DgAgYAAAvg4AIA6TBgAAvA4AMJQGAAC9DgAQlQYAALwOADCWBgEA8QoAIZsGAQDyCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh1AYBAPEKACHvBgEA8QoAIfUGAQDyCgAh_AYBAPIKACH9BgEA8QoAIf4GAQDxCgAhDpMGAAC8DgAwlAYAAL0OABCVBgAAvA4AMJYGAQDxCgAhmwYBAPIKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHUBgEA8QoAIe8GAQDxCgAh9QYBAPIKACH8BgEA8goAIf0GAQDxCgAh_gYBAPEKACEKlgYBAIANACGbBgEAgQ0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIe8GAQCADQAh9QYBAIENACH8BgEAgQ0AIf0GAQCADQAh_gYBAIANACEOBgAAwg4AIAgAAMMOACArAADADgAgLQAAwQ4AIJYGAQCADQAhmwYBAIENACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIfUGAQCBDQAh_AYBAIENACH9BgEAgA0AIf4GAQCADQAhBWcAAMwdACBoAADYHQAg_QcAAM0dACD-BwAA1x0AIIMIAAAwACAFZwAAyh0AIGgAANUdACD9BwAAyx0AIP4HAADUHQAggwgAANoBACAHZwAAyB0AIGgAANIdACD9BwAAyR0AIP4HAADRHQAggQgAABMAIIIIAAATACCDCAAAnQUAIAdnAADGHQAgaAAAzx0AIP0HAADHHQAg_gcAAM4dACCBCAAAFQAggggAABUAIIMIAAAXACAOBgAAxw4AIAgAAMgOACArAADFDgAgLQAAxg4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAfUGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAEDZwAAzB0AIP0HAADNHQAggwgAADAAIANnAADKHQAg_QcAAMsdACCDCAAA2gEAIANnAADIHQAg_QcAAMkdACCDCAAAnQUAIANnAADGHQAg_QcAAMcdACCDCAAAFwAgFQYAANMOACAIAADQDgAgCQAA0Q4AIAoAAMoOACANAADPDgAgDgAAzQ4AIBgAAM4OACAaAADSDgAgLgAAyw4AIC8AAMwOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAb4GAQAAAAG_BgEAAAABwgYBAAAAAfcGAQAAAAGHBwEAAAABzgdAAAAAAQRnAAC1DgAw_QcAALYOADD_BwAAuA4AIIMIAAC5DgAwBGcAAKgOADD9BwAAqQ4AMP8HAACrDgAggwgAAKwOADADZwAAoQ4AIP0HAACiDgAggwgAAHQAIANnAADEHQAg_QcAAMUdACCDCAAAIAAgA2cAAMIdACD9BwAAwx0AIIMIAACzAQAgA2cAAMAdACD9BwAAwR0AIIMIAAA0ACADZwAAvh0AIP0HAAC_HQAggwgAABcAIANnAAC8HQAg_QcAAL0dACCDCAAAHAAgA2cAALodACD9BwAAux0AIIMIAAC5CAAgA2cAALgdACD9BwAAuR0AIIMIAACdBQAgA2cAALYdACD9BwAAtx0AIIMIAACdBQAgBGcAAIwOADD9BwAAjQ4AMP8HAACPDgAggwgAAJAOADAEZwAA-A0AMP0HAAD5DQAw_wcAAPsNACCDCAAA_A0AMARnAADRDQAw_QcAANINADD_BwAA1A0AIIMIAADVDQAwBGcAALoNADD9BwAAuw0AMP8HAAC9DQAggwgAAL4NADAEZwAApw0AMP0HAACoDQAw_wcAAKoNACCDCAAAqw0AMARnAACMDQAw_QcAAI0NADD_BwAAjw0AIIMIAACQDQAwA2cAALQdACD9BwAAtR0AIIMIAAAXACADZwAAsh0AIP0HAACzHQAggwgAAJoDACAAAAACgAgBAAAABIoIAQAAAAUCgAgBAAAABIoIAQAAAAUBgAggAAAAAQVnAACtHQAgaAAAsB0AIP0HAACuHQAg_gcAAK8dACCDCAAAmgMAIAGACAEAAAAEAYAIAQAAAAQDZwAArR0AIP0HAACuHQAggwgAAJoDACAcBAAA6xkAIAUAAOwZACAQAADBFwAgGAAAwhcAIDUAAPQRACA6AADPFwAgPgAAwBcAIEMAAMQXACBOAADEFwAgTwAA9BEAIFAAAO0ZACBRAADjEQAgUgAA4xEAIFMAAO4ZACBUAADvGQAgVQAAzhcAIFYAAM4XACBXAADNFwAgWAAAzRcAIFkAAMwXACBaAADwGQAgmgYAAPwMACDoBwAA_AwAIOkHAAD8DAAg6gcAAPwMACDrBwAA_AwAIOwHAAD8DAAg7QcAAPwMACAAAAAFZwAAqB0AIGgAAKsdACD9BwAAqR0AIP4HAACqHQAggwgAALABACADZwAAqB0AIP0HAACpHQAggwgAALABACAAAAAFZwAAox0AIGgAAKYdACD9BwAApB0AIP4HAAClHQAggwgAAD8AIANnAACjHQAg_QcAAKQdACCDCAAAPwAgAAAABWcAAJ4dACBoAAChHQAg_QcAAJ8dACD-BwAAoB0AIIMIAACwAQAgA2cAAJ4dACD9BwAAnx0AIIMIAACwAQAgAAAAB2cAAJkdACBoAACcHQAg_QcAAJodACD-BwAAmx0AIIEIAABfACCCCAAAXwAggwgAALABACADZwAAmR0AIP0HAACaHQAggwgAALABACAAAAAAAAAAAAAAAYAIAAAA5AYCAYAIAAAA5gYCBYAIEAAAAAGGCBAAAAABhwgQAAAAAYgIEAAAAAGJCBAAAAABBYAIAgAAAAGGCAIAAAABhwgCAAAAAYgIAgAAAAGJCAIAAAABBWcAAJEdACBoAACXHQAg_QcAAJIdACD-BwAAlh0AIIMIAACdBQAgB2cAAI8dACBoAACUHQAg_QcAAJAdACD-BwAAkx0AIIEIAADjAQAggggAAOMBACCDCAAA5QEAIANnAACRHQAg_QcAAJIdACCDCAAAnQUAIANnAACPHQAg_QcAAJAdACCDCAAA5QEAIAAAAAVnAADSHAAgaAAAjR0AIP0HAADTHAAg_gcAAIwdACCDCAAAnQUAIAdnAADQHAAgaAAAih0AIP0HAADRHAAg_gcAAIkdACCBCAAAFQAggggAABUAIIMIAAAXACAFZwAAzhwAIGgAAIcdACD9BwAAzxwAIP4HAACGHQAggwgAAJoDACALZwAA1g8AMGgAANoPADD9BwAA1w8AMP4HAADYDwAw_wcAANkPACCACAAAkA4AMIEIAACQDgAwgggAAJAOADCDCAAAkA4AMIQIAADbDwAwhQgAAJMOADALZwAAzQ8AMGgAANEPADD9BwAAzg8AMP4HAADPDwAw_wcAANAPACCACAAA5Q0AMIEIAADlDQAwgggAAOUNADCDCAAA5Q0AMIQIAADSDwAwhQgAAOgNADALZwAAug8AMGgAAL8PADD9BwAAuw8AMP4HAAC8DwAw_wcAAL0PACCACAAAvg8AMIEIAAC-DwAwgggAAL4PADCDCAAAvg8AMIQIAADADwAwhQgAAMEPADALZwAApA8AMGgAAKkPADD9BwAApQ8AMP4HAACmDwAw_wcAAKcPACCACAAAqA8AMIEIAACoDwAwgggAAKgPADCDCAAAqA8AMIQIAACqDwAwhQgAAKsPADALZwAAmQ8AMGgAAJ0PADD9BwAAmg8AMP4HAACbDwAw_wcAAJwPACCACAAAkA0AMIEIAACQDQAwgggAAJANADCDCAAAkA0AMIQIAACeDwAwhQgAAJMNADAVEAAAow8AIBcAAKQNACAdAAChDQAgHgAAog0AIB8AAKMNACAgAACmDQAglgYBAAAAAZ4GQAAAAAGfBkAAAAABwAYBAAAAAc4GAAAArAcC0AZAAAAAAdMGAQAAAAGqBwAAAKoHAqwHAQAAAAGtBwEAAAABrgcBAAAAAa8HAQAAAAGwBwEAAAABsQcBAAAAAbIHQAAAAAECAAAAWwAgZwAAog8AIAMAAABbACBnAACiDwAgaAAAoA8AIAFgAACFHQAwAgAAAFsAIGAAAKAPACACAAAAlA0AIGAAAJ8PACAPlgYBAIANACGeBkAAgg0AIZ8GQACCDQAhwAYBAIENACHOBgAAlw2sByLQBkAAmA0AIdMGAQCBDQAhqgcAAJYNqgcirAcBAIANACGtBwEAgA0AIa4HAQCADQAhrwcBAIENACGwBwEAgQ0AIbEHAQCBDQAhsgdAAIINACEVEAAAoQ8AIBcAAJ0NACAdAACaDQAgHgAAmw0AIB8AAJwNACAgAACfDQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhwAYBAIENACHOBgAAlw2sByLQBkAAmA0AIdMGAQCBDQAhqgcAAJYNqgcirAcBAIANACGtBwEAgA0AIa4HAQCADQAhrwcBAIENACGwBwEAgQ0AIbEHAQCBDQAhsgdAAIINACEHZwAAgB0AIGgAAIMdACD9BwAAgR0AIP4HAACCHQAggQgAAF8AIIIIAABfACCDCAAAsAEAIBUQAACjDwAgFwAApA0AIB0AAKENACAeAACiDQAgHwAAow0AICAAAKYNACCWBgEAAAABngZAAAAAAZ8GQAAAAAHABgEAAAABzgYAAACsBwLQBkAAAAAB0wYBAAAAAaoHAAAAqgcCrAcBAAAAAa0HAQAAAAGuBwEAAAABrwcBAAAAAbAHAQAAAAGxBwEAAAABsgdAAAAAAQNnAACAHQAg_QcAAIEdACCDCAAAsAEAIBoGAAC2DwAgCAAAtw8AIBoAALgPACAcAAC5DwAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAJ8HAuYGEAAAAAHnBgEAAAAB6AYCAAAAAfcGAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOBwEAAAABjwcBAAAAAZAHAQAAAAGRB4AAAAABkgdAAAAAAZsHAQAAAAGdBwAAAJ0HAp8HAQAAAAGgB0AAAAABAgAAAFUAIGcAALUPACADAAAAVQAgZwAAtQ8AIGgAALAPACABYAAA_xwAMB8GAAC6CwAgCAAAuwwAIBgAANYMACAaAADGDAAgHAAA1wwAIJMGAADTDAAwlAYAAFMAEJUGAADTDAAwlgYBAAAAAZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhwgYBAPEKACHOBgAA1QyfByLmBhAAqwwAIecGAQDxCgAh6AYCAKwMACH3BgEA8QoAIYsHAQAAAAGMBwEA8goAIY0HAQAAAAGOBwEA8goAIY8HAQDyCgAhkAcBAPIKACGRBwAArgwAIJIHQACfDAAhmwcBAPEKACGdBwAA1AydByKfBwEA8QoAIaAHQAD1CgAhAgAAAFUAIGAAALAPACACAAAArA8AIGAAAK0PACAakwYAAKsPADCUBgAArA8AEJUGAACrDwAwlgYBAPEKACGbBgEA8QoAIZwGAQDxCgAhngZAAPUKACGfBkAA9QoAIcIGAQDxCgAhzgYAANUMnwci5gYQAKsMACHnBgEA8QoAIegGAgCsDAAh9wYBAPEKACGLBwEA8QoAIYwHAQDyCgAhjQcBAPIKACGOBwEA8goAIY8HAQDyCgAhkAcBAPIKACGRBwAArgwAIJIHQACfDAAhmwcBAPEKACGdBwAA1AydByKfBwEA8QoAIaAHQAD1CgAhGpMGAACrDwAwlAYAAKwPABCVBgAAqw8AMJYGAQDxCgAhmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHCBgEA8QoAIc4GAADVDJ8HIuYGEACrDAAh5wYBAPEKACHoBgIArAwAIfcGAQDxCgAhiwcBAPEKACGMBwEA8goAIY0HAQDyCgAhjgcBAPIKACGPBwEA8goAIZAHAQDyCgAhkQcAAK4MACCSB0AAnwwAIZsHAQDxCgAhnQcAANQMnQcinwcBAPEKACGgB0AA9QoAIRaWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAhzgYAAK8Pnwci5gYQAIgPACHnBgEAgA0AIegGAgCJDwAh9wYBAIANACGLBwEAgA0AIYwHAQCBDQAhjQcBAIENACGOBwEAgQ0AIY8HAQCBDQAhkAcBAIENACGRB4AAAAABkgdAAJgNACGbBwEAgA0AIZ0HAACuD50HIp8HAQCADQAhoAdAAIINACEBgAgAAACdBwIBgAgAAACfBwIaBgAAsQ8AIAgAALIPACAaAACzDwAgHAAAtA8AIJYGAQCADQAhmwYBAIANACGcBgEAgA0AIZ4GQACCDQAhnwZAAIINACHOBgAArw-fByLmBhAAiA8AIecGAQCADQAh6AYCAIkPACH3BgEAgA0AIYsHAQCADQAhjAcBAIENACGNBwEAgQ0AIY4HAQCBDQAhjwcBAIENACGQBwEAgQ0AIZEHgAAAAAGSB0AAmA0AIZsHAQCADQAhnQcAAK4PnQcinwcBAIANACGgB0AAgg0AIQVnAADxHAAgaAAA_RwAIP0HAADyHAAg_gcAAPwcACCDCAAAnQUAIAVnAADvHAAgaAAA-hwAIP0HAADwHAAg_gcAAPkcACCDCAAAFwAgBWcAAO0cACBoAAD3HAAg_QcAAO4cACD-BwAA9hwAIIMIAAC5CAAgBWcAAOscACBoAAD0HAAg_QcAAOwcACD-BwAA8xwAIIMIAACMAQAgGgYAALYPACAIAAC3DwAgGgAAuA8AIBwAALkPACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAAnwcC5gYQAAAAAecGAQAAAAHoBgIAAAAB9wYBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HAQAAAAGPBwEAAAABkAcBAAAAAZEHgAAAAAGSB0AAAAABmwcBAAAAAZ0HAAAAnQcCnwcBAAAAAaAHQAAAAAEDZwAA8RwAIP0HAADyHAAggwgAAJ0FACADZwAA7xwAIP0HAADwHAAggwgAABcAIANnAADtHAAg_QcAAO4cACCDCAAAuQgAIANnAADrHAAg_QcAAOwcACCDCAAAjAEAIA4VAADKDwAgFgAAyw8AIBcAAMwPACCWBgEAAAABngZAAAAAAZ8GQAAAAAHMBgEAAAABzgYAAADtBgLPBgEAAAAB0AZAAAAAAdEGQAAAAAHSBgEAAAAB0wYBAAAAAe0GAQAAAAECAAAASwAgZwAAyQ8AIAMAAABLACBnAADJDwAgaAAAxQ8AIAFgAADqHAAwFBUAANsMACAWAAD2CgAgFwAAoAwAIBgAANIMACCTBgAA2QwAMJQGAABJABCVBgAA2QwAMJYGAQAAAAGeBkAA9QoAIZ8GQAD1CgAhwgYBAPIKACHMBgEA8goAIc4GAADaDO0GIs8GAQDyCgAh0AZAAJ8MACHRBkAA9QoAIdIGAQDxCgAh0wYBAPIKACHtBgEA8QoAIfcHAADYDAAgAgAAAEsAIGAAAMUPACACAAAAwg8AIGAAAMMPACAPkwYAAMEPADCUBgAAwg8AEJUGAADBDwAwlgYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhwgYBAPIKACHMBgEA8goAIc4GAADaDO0GIs8GAQDyCgAh0AZAAJ8MACHRBkAA9QoAIdIGAQDxCgAh0wYBAPIKACHtBgEA8QoAIQ-TBgAAwQ8AMJQGAADCDwAQlQYAAMEPADCWBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHCBgEA8goAIcwGAQDyCgAhzgYAANoM7QYizwYBAPIKACHQBkAAnwwAIdEGQAD1CgAh0gYBAPEKACHTBgEA8goAIe0GAQDxCgAhC5YGAQCADQAhngZAAIINACGfBkAAgg0AIcwGAQCBDQAhzgYAAMQP7QYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0gYBAIANACHTBgEAgQ0AIe0GAQCADQAhAYAIAAAA7QYCDhUAAMYPACAWAADHDwAgFwAAyA8AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcwGAQCBDQAhzgYAAMQP7QYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0gYBAIANACHTBgEAgQ0AIe0GAQCADQAhBWcAAN8cACBoAADoHAAg_QcAAOAcACD-BwAA5xwAIIMIAAC6BwAgBWcAAN0cACBoAADlHAAg_QcAAN4cACD-BwAA5BwAIIMIAACaAwAgB2cAANscACBoAADiHAAg_QcAANwcACD-BwAA4RwAIIEIAABPACCCCAAATwAggwgAAJoDACAOFQAAyg8AIBYAAMsPACAXAADMDwAglgYBAAAAAZ4GQAAAAAGfBkAAAAABzAYBAAAAAc4GAAAA7QYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAdMGAQAAAAHtBgEAAAABA2cAAN8cACD9BwAA4BwAIIMIAAC6BwAgA2cAAN0cACD9BwAA3hwAIIMIAACaAwAgA2cAANscACD9BwAA3BwAIIMIAACaAwAgDQYAAPENACAIAADyDQAgEQAA8Q4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwQYBAAAAAcMGAQAAAAHEBgEAAAABxQYBAAAAAcYGQAAAAAECAAAARAAgZwAA1Q8AIAMAAABEACBnAADVDwAgaAAA1A8AIAFgAADaHAAwAgAAAEQAIGAAANQPACACAAAA6Q0AIGAAANMPACAKlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIcEGAQCADQAhwwYBAIENACHEBgEAgQ0AIcUGAQCBDQAhxgZAAIINACENBgAA7Q0AIAgAAO4NACARAADwDgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIcEGAQCADQAhwwYBAIENACHEBgEAgQ0AIcUGAQCBDQAhxgZAAIINACENBgAA8Q0AIAgAAPINACARAADxDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHBBgEAAAABwwYBAAAAAcQGAQAAAAHFBgEAAAABxgZAAAAAARUGAADTDgAgCAAA0A4AIAkAANEOACAKAADKDgAgDQAAzw4AIA4AAM0OACAQAADgDwAgGgAA0g4AIC4AAMsOACAvAADMDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAAcAGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAECAAAAJQAgZwAA3w8AIAMAAAAlACBnAADfDwAgaAAA3Q8AIAFgAADZHAAwAgAAACUAIGAAAN0PACACAAAAlA4AIGAAANwPACALlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHABgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIRUGAACgDgAgCAAAnQ4AIAkAAJ4OACAKAACXDgAgDQAAnA4AIA4AAJoOACAQAADeDwAgGgAAnw4AIC4AAJgOACAvAACZDgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHABgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIQVnAADUHAAgaAAA1xwAIP0HAADVHAAg_gcAANYcACCDCAAAsAEAIBUGAADTDgAgCAAA0A4AIAkAANEOACAKAADKDgAgDQAAzw4AIA4AAM0OACAQAADgDwAgGgAA0g4AIC4AAMsOACAvAADMDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAAcAGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAEDZwAA1BwAIP0HAADVHAAggwgAALABACADZwAA0hwAIP0HAADTHAAggwgAAJ0FACADZwAA0BwAIP0HAADRHAAggwgAABcAIANnAADOHAAg_QcAAM8cACCDCAAAmgMAIARnAADWDwAw_QcAANcPADD_BwAA2Q8AIIMIAACQDgAwBGcAAM0PADD9BwAAzg8AMP8HAADQDwAggwgAAOUNADAEZwAAug8AMP0HAAC7DwAw_wcAAL0PACCDCAAAvg8AMARnAACkDwAw_QcAAKUPADD_BwAApw8AIIMIAACoDwAwBGcAAJkPADD9BwAAmg8AMP8HAACcDwAggwgAAJANADAAAAAHZwAAyRwAIGgAAMwcACD9BwAAyhwAIP4HAADLHAAggQgAAFEAIIIIAABRACCDCAAAswEAIANnAADJHAAg_QcAAMocACCDCAAAswEAIAAAAAKACAEAAAAEiggBAAAABQVnAADEHAAgaAAAxxwAIP0HAADFHAAg_gcAAMYcACCDCAAAmgMAIAGACAEAAAAEA2cAAMQcACD9BwAAxRwAIIMIAACaAwAgAAAAC2cAAOAQADBoAADlEAAw_QcAAOEQADD-BwAA4hAAMP8HAADjEAAggAgAAOQQADCBCAAA5BAAMIIIAADkEAAwgwgAAOQQADCECAAA5hAAMIUIAADnEAAwC2cAAKwQADBoAACxEAAw_QcAAK0QADD-BwAArhAAMP8HAACvEAAggAgAALAQADCBCAAAsBAAMIIIAACwEAAwgwgAALAQADCECAAAshAAMIUIAACzEAAwC2cAAKMQADBoAACnEAAw_QcAAKQQADD-BwAApRAAMP8HAACmEAAggAgAAJAOADCBCAAAkA4AMIIIAACQDgAwgwgAAJAOADCECAAAqBAAMIUIAACTDgAwC2cAAIgQADBoAACNEAAw_QcAAIkQADD-BwAAihAAMP8HAACLEAAggAgAAIwQADCBCAAAjBAAMIIIAACMEAAwgwgAAIwQADCECAAAjhAAMIUIAACPEAAwC2cAAP0PADBoAACBEAAw_QcAAP4PADD-BwAA_w8AMP8HAACAEAAggAgAAKgPADCBCAAAqA8AMIIIAACoDwAwgwgAAKgPADCECAAAghAAMIUIAACrDwAwGgYAALYPACAIAAC3DwAgGAAAhxAAIBwAALkPACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAcIGAQAAAAHOBgAAAJ8HAuYGEAAAAAHnBgEAAAAB6AYCAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HAQAAAAGPBwEAAAABkAcBAAAAAZEHgAAAAAGSB0AAAAABmwcBAAAAAZ0HAAAAnQcCnwcBAAAAAaAHQAAAAAECAAAAVQAgZwAAhhAAIAMAAABVACBnAACGEAAgaAAAhBAAIAFgAADDHAAwAgAAAFUAIGAAAIQQACACAAAArA8AIGAAAIMQACAWlgYBAIANACGbBgEAgA0AIZwGAQCADQAhngZAAIINACGfBkAAgg0AIcIGAQCADQAhzgYAAK8Pnwci5gYQAIgPACHnBgEAgA0AIegGAgCJDwAhiwcBAIANACGMBwEAgQ0AIY0HAQCBDQAhjgcBAIENACGPBwEAgQ0AIZAHAQCBDQAhkQeAAAAAAZIHQACYDQAhmwcBAIANACGdBwAArg-dByKfBwEAgA0AIaAHQACCDQAhGgYAALEPACAIAACyDwAgGAAAhRAAIBwAALQPACCWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAhwgYBAIANACHOBgAArw-fByLmBhAAiA8AIecGAQCADQAh6AYCAIkPACGLBwEAgA0AIYwHAQCBDQAhjQcBAIENACGOBwEAgQ0AIY8HAQCBDQAhkAcBAIENACGRB4AAAAABkgdAAJgNACGbBwEAgA0AIZ0HAACuD50HIp8HAQCADQAhoAdAAIINACEFZwAAvhwAIGgAAMEcACD9BwAAvxwAIP4HAADAHAAggwgAALMBACAaBgAAtg8AIAgAALcPACAYAACHEAAgHAAAuQ8AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwgYBAAAAAc4GAAAAnwcC5gYQAAAAAecGAQAAAAHoBgIAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAY8HAQAAAAGQBwEAAAABkQeAAAAAAZIHQAAAAAGbBwEAAAABnQcAAACdBwKfBwEAAAABoAdAAAAAAQNnAAC-HAAg_QcAAL8cACCDCAAAswEAIAwGAACgEAAgCAAAoRAAIBsAAKIQACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAecGAQAAAAGZByAAAAABoQcQAAAAAaIHEAAAAAECAAAAjAEAIGcAAJ8QACADAAAAjAEAIGcAAJ8QACBoAACSEAAgAWAAAL0cADASBgAAugsAIAgAALsMACAaAADGDAAgGwAAogsAIJMGAADFDAAwlAYAAIoBABCVBgAAxQwAMJYGAQAAAAGbBgEA8QoAIZwGAQDxCgAhngZAAPUKACGfBkAA9QoAIecGAQDxCgAh9wYBAPEKACGZByAA9AoAIaEHEACrDAAhogcQAKsMACH1BwAAxAwAIAIAAACMAQAgYAAAkhAAIAIAAACQEAAgYAAAkRAAIA2TBgAAjxAAMJQGAACQEAAQlQYAAI8QADCWBgEA8QoAIZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh5wYBAPEKACH3BgEA8QoAIZkHIAD0CgAhoQcQAKsMACGiBxAAqwwAIQ2TBgAAjxAAMJQGAACQEAAQlQYAAI8QADCWBgEA8QoAIZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh5wYBAPEKACH3BgEA8QoAIZkHIAD0CgAhoQcQAKsMACGiBxAAqwwAIQmWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAh5wYBAIANACGZByAA4g4AIaEHEACIDwAhogcQAIgPACEMBgAAkxAAIAgAAJQQACAbAACVEAAglgYBAIANACGbBgEAgA0AIZwGAQCADQAhngZAAIINACGfBkAAgg0AIecGAQCADQAhmQcgAOIOACGhBxAAiA8AIaIHEACIDwAhBWcAALQcACBoAAC7HAAg_QcAALUcACD-BwAAuhwAIIMIAACdBQAgBWcAALIcACBoAAC4HAAg_QcAALMcACD-BwAAtxwAIIMIAAAXACALZwAAlhAAMGgAAJoQADD9BwAAlxAAMP4HAACYEAAw_wcAAJkQACCACAAAqA8AMIEIAACoDwAwgggAAKgPADCDCAAAqA8AMIQIAACbEAAwhQgAAKsPADAaBgAAtg8AIAgAALcPACAYAACHEAAgGgAAuA8AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwgYBAAAAAc4GAAAAnwcC5gYQAAAAAecGAQAAAAHoBgIAAAAB9wYBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HAQAAAAGPBwEAAAABkAcBAAAAAZEHgAAAAAGSB0AAAAABnQcAAACdBwKfBwEAAAABoAdAAAAAAQIAAABVACBnAACeEAAgAwAAAFUAIGcAAJ4QACBoAACdEAAgAWAAALYcADACAAAAVQAgYAAAnRAAIAIAAACsDwAgYAAAnBAAIBaWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAhwgYBAIANACHOBgAArw-fByLmBhAAiA8AIecGAQCADQAh6AYCAIkPACH3BgEAgA0AIYsHAQCADQAhjAcBAIENACGNBwEAgQ0AIY4HAQCBDQAhjwcBAIENACGQBwEAgQ0AIZEHgAAAAAGSB0AAmA0AIZ0HAACuD50HIp8HAQCADQAhoAdAAIINACEaBgAAsQ8AIAgAALIPACAYAACFEAAgGgAAsw8AIJYGAQCADQAhmwYBAIANACGcBgEAgA0AIZ4GQACCDQAhnwZAAIINACHCBgEAgA0AIc4GAACvD58HIuYGEACIDwAh5wYBAIANACHoBgIAiQ8AIfcGAQCADQAhiwcBAIANACGMBwEAgQ0AIY0HAQCBDQAhjgcBAIENACGPBwEAgQ0AIZAHAQCBDQAhkQeAAAAAAZIHQACYDQAhnQcAAK4PnQcinwcBAIANACGgB0AAgg0AIRoGAAC2DwAgCAAAtw8AIBgAAIcQACAaAAC4DwAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHCBgEAAAABzgYAAACfBwLmBhAAAAAB5wYBAAAAAegGAgAAAAH3BgEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAY8HAQAAAAGQBwEAAAABkQeAAAAAAZIHQAAAAAGdBwAAAJ0HAp8HAQAAAAGgB0AAAAABDAYAAKAQACAIAAChEAAgGwAAohAAIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB5wYBAAAAAZkHIAAAAAGhBxAAAAABogcQAAAAAQNnAAC0HAAg_QcAALUcACCDCAAAnQUAIANnAACyHAAg_QcAALMcACCDCAAAFwAgBGcAAJYQADD9BwAAlxAAMP8HAACZEAAggwgAAKgPADAVBgAA0w4AIAgAANAOACAJAADRDgAgCgAAyg4AIA0AAM8OACAOAADNDgAgEAAA4A8AIBgAAM4OACAuAADLDgAgLwAAzA4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAYcHAQAAAAHOB0AAAAABAgAAACUAIGcAAKsQACADAAAAJQAgZwAAqxAAIGgAAKoQACABYAAAsRwAMAIAAAAlACBgAACqEAAgAgAAAJQOACBgAACpEAAgC5YGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIb8GAQCADQAhwAYBAIANACHCBgEAgA0AIYcHAQCBDQAhzgdAAIINACEVBgAAoA4AIAgAAJ0OACAJAACeDgAgCgAAlw4AIA0AAJwOACAOAACaDgAgEAAA3g8AIBgAAJsOACAuAACYDgAgLwAAmQ4AIJYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIb8GAQCADQAhwAYBAIANACHCBgEAgA0AIYcHAQCBDQAhzgdAAIINACEVBgAA0w4AIAgAANAOACAJAADRDgAgCgAAyg4AIA0AAM8OACAOAADNDgAgEAAA4A8AIBgAAM4OACAuAADLDgAgLwAAzA4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAYcHAQAAAAHOB0AAAAABDwYAAN0QACAIAADeEAAgDAAA2hAAIA8AANsQACAjAADcEAAgKQAA3xAAIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAfUGAQAAAAH2BgIAAAAB-AYBAAAAAQIAAAA0ACBnAADZEAAgAwAAADQAIGcAANkQACBoAAC3EAAgAWAAALAcADAUBgAAugsAIAgAAL0MACAMAACgCwAgDwAA7wsAIBoAAMYMACAjAADxCwAgKQAA5gwAIJMGAADlDAAwlAYAADIAEJUGAADlDAAwlgYBAAAAAZsGAQDxCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPEKACH1BgEA8goAIfYGAgC1DAAh9wYBAPEKACH4BgEA8goAIQIAAAA0ACBgAAC3EAAgAgAAALQQACBgAAC1EAAgDZMGAACzEAAwlAYAALQQABCVBgAAsxAAMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8QoAIfUGAQDyCgAh9gYCALUMACH3BgEA8QoAIfgGAQDyCgAhDZMGAACzEAAwlAYAALQQABCVBgAAsxAAMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8QoAIfUGAQDyCgAh9gYCALUMACH3BgEA8QoAIfgGAQDyCgAhCZYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIfUGAQCBDQAh9gYCALYQACH4BgEAgQ0AIQWACAIAAAABhggCAAAAAYcIAgAAAAGICAIAAAABiQgCAAAAAQ8GAAC7EAAgCAAAvBAAIAwAALgQACAPAAC5EAAgIwAAuhAAICkAAL0QACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAh7wYBAIANACH1BgEAgQ0AIfYGAgC2EAAh-AYBAIENACELZwAA0BAAMGgAANQQADD9BwAA0RAAMP4HAADSEAAw_wcAANMQACCACAAAkA4AMIEIAACQDgAwgggAAJAOADCDCAAAkA4AMIQIAADVEAAwhQgAAJMOADALZwAAxxAAMGgAAMsQADD9BwAAyBAAMP4HAADJEAAw_wcAAMoQACCACAAA_A0AMIEIAAD8DQAwgggAAPwNADCDCAAA_A0AMIQIAADMEAAwhQgAAP8NADALZwAAvhAAMGgAAMIQADD9BwAAvxAAMP4HAADAEAAw_wcAAMEQACCACAAA1Q0AMIEIAADVDQAwgggAANUNADCDCAAA1Q0AMIQIAADDEAAwhQgAANgNADAFZwAAohwAIGgAAK4cACD9BwAAoxwAIP4HAACtHAAggwgAAJ0FACAHZwAAoBwAIGgAAKscACD9BwAAoRwAIP4HAACqHAAggQgAABUAIIIIAAAVACCDCAAAFwAgB2cAAJ4cACBoAACoHAAg_QcAAJ8cACD-BwAApxwAIIEIAACBAQAggggAAIEBACCDCAAAqwEAIA4GAAD1DQAgCAAA9g0AIBAAAPYOACAiAAD3DQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHABgEAAAABxwYBAAAAAcgGAQAAAAHKBgAAAMoGAssGQAAAAAECAAAAPwAgZwAAxhAAIAMAAAA_ACBnAADGEAAgaAAAxRAAIAFgAACmHAAwAgAAAD8AIGAAAMUQACACAAAA2Q0AIGAAAMQQACAKlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIcAGAQCADQAhxwYBAIANACHIBgEAgQ0AIcoGAADbDcoGIssGQACYDQAhDgYAAN4NACAIAADfDQAgEAAA9Q4AICIAAOANACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhwAYBAIANACHHBgEAgA0AIcgGAQCBDQAhygYAANsNygYiywZAAJgNACEOBgAA9Q0AIAgAAPYNACAQAAD2DgAgIgAA9w0AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwAYBAAAAAccGAQAAAAHIBgEAAAABygYAAADKBgLLBkAAAAABCwYAAIoOACAIAACLDgAgDgAAiQ4AIBAAAOwOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAb8GAQAAAAHABgEAAAABAgAAADkAIGcAAM8QACADAAAAOQAgZwAAzxAAIGgAAM4QACABYAAApRwAMAIAAAA5ACBgAADOEAAgAgAAAIAOACBgAADNEAAgB5YGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG_BgEAgA0AIcAGAQCADQAhCwYAAIUOACAIAACGDgAgDgAAhA4AIBAAAOsOACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvwYBAIANACHABgEAgA0AIQsGAACKDgAgCAAAiw4AIA4AAIkOACAQAADsDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG_BgEAAAABwAYBAAAAARUGAADTDgAgCAAA0A4AIAkAANEOACAKAADKDgAgDgAAzQ4AIBAAAOAPACAYAADODgAgGgAA0g4AIC4AAMsOACAvAADMDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG_BgEAAAABwAYBAAAAAcIGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAECAAAAJQAgZwAA2BAAIAMAAAAlACBnAADYEAAgaAAA1xAAIAFgAACkHAAwAgAAACUAIGAAANcQACACAAAAlA4AIGAAANYQACALlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb8GAQCADQAhwAYBAIANACHCBgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIRUGAACgDgAgCAAAnQ4AIAkAAJ4OACAKAACXDgAgDgAAmg4AIBAAAN4PACAYAACbDgAgGgAAnw4AIC4AAJgOACAvAACZDgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb8GAQCADQAhwAYBAIANACHCBgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIRUGAADTDgAgCAAA0A4AIAkAANEOACAKAADKDgAgDgAAzQ4AIBAAAOAPACAYAADODgAgGgAA0g4AIC4AAMsOACAvAADMDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG_BgEAAAABwAYBAAAAAcIGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAEPBgAA3RAAIAgAAN4QACAMAADaEAAgDwAA2xAAICMAANwQACApAADfEAAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfYGAgAAAAH4BgEAAAABBGcAANAQADD9BwAA0RAAMP8HAADTEAAggwgAAJAOADAEZwAAxxAAMP0HAADIEAAw_wcAAMoQACCDCAAA_A0AMARnAAC-EAAw_QcAAL8QADD_BwAAwRAAIIMIAADVDQAwA2cAAKIcACD9BwAAoxwAIIMIAACdBQAgA2cAAKAcACD9BwAAoRwAIIMIAAAXACADZwAAnhwAIP0HAACfHAAggwgAAKsBACANBgAA_BAAIAgAAP0QACAKAAD7EAAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAPwGAu8GAQAAAAH1BgEAAAAB-QYBAAAAAfoGAQAAAAECAAAAMAAgZwAA-hAAIAMAAAAwACBnAAD6EAAgaAAA6xAAIAFgAACdHAAwEgYAALcMACAIAAC9DAAgCgAA9wsAIBoAAOkMACCTBgAA5wwAMJQGAAAuABCVBgAA5wwAMJYGAQAAAAGbBgEA8goAIZwGAQDyCgAhngZAAPUKACGfBkAA9QoAIc4GAADoDPwGIu8GAQDxCgAh9QYBAPIKACH3BgEA8goAIfkGAQDxCgAh-gYBAPEKACECAAAAMAAgYAAA6xAAIAIAAADoEAAgYAAA6RAAIA6TBgAA5xAAMJQGAADoEAAQlQYAAOcQADCWBgEA8QoAIZsGAQDyCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhzgYAAOgM_AYi7wYBAPEKACH1BgEA8goAIfcGAQDyCgAh-QYBAPEKACH6BgEA8QoAIQ6TBgAA5xAAMJQGAADoEAAQlQYAAOcQADCWBgEA8QoAIZsGAQDyCgAhnAYBAPIKACGeBkAA9QoAIZ8GQAD1CgAhzgYAAOgM_AYi7wYBAPEKACH1BgEA8goAIfcGAQDyCgAh-QYBAPEKACH6BgEA8QoAIQqWBgEAgA0AIZsGAQCBDQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhzgYAAOoQ_AYi7wYBAIANACH1BgEAgQ0AIfkGAQCADQAh-gYBAIANACEBgAgAAAD8BgINBgAA7RAAIAgAAO4QACAKAADsEAAglgYBAIANACGbBgEAgQ0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIc4GAADqEPwGIu8GAQCADQAh9QYBAIENACH5BgEAgA0AIfoGAQCADQAhC2cAAO8QADBoAADzEAAw_QcAAPAQADD-BwAA8RAAMP8HAADyEAAggAgAALkOADCBCAAAuQ4AMIIIAAC5DgAwgwgAALkOADCECAAA9BAAMIUIAAC8DgAwB2cAAI8cACBoAACbHAAg_QcAAJAcACD-BwAAmhwAIIEIAAATACCCCAAAEwAggwgAAJ0FACAHZwAAjRwAIGgAAJgcACD9BwAAjhwAIP4HAACXHAAggQgAABUAIIIIAAAVACCDCAAAFwAgDgYAAMcOACAIAADIDgAgJgAA-RAAIC0AAMYOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAdQGAQAAAAHvBgEAAAAB9QYBAAAAAfwGAQAAAAH-BgEAAAABAgAAACkAIGcAAPgQACADAAAAKQAgZwAA-BAAIGgAAPYQACABYAAAlhwAMAIAAAApACBgAAD2EAAgAgAAAL0OACBgAAD1EAAgCpYGAQCADQAhmwYBAIENACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHUBgEAgA0AIe8GAQCADQAh9QYBAIENACH8BgEAgQ0AIf4GAQCADQAhDgYAAMIOACAIAADDDgAgJgAA9xAAIC0AAMEOACCWBgEAgA0AIZsGAQCBDQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAh1AYBAIANACHvBgEAgA0AIfUGAQCBDQAh_AYBAIENACH-BgEAgA0AIQVnAACRHAAgaAAAlBwAIP0HAACSHAAg_gcAAJMcACCDCAAAJQAgDgYAAMcOACAIAADIDgAgJgAA-RAAIC0AAMYOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAdQGAQAAAAHvBgEAAAAB9QYBAAAAAfwGAQAAAAH-BgEAAAABA2cAAJEcACD9BwAAkhwAIIMIAAAlACANBgAA_BAAIAgAAP0QACAKAAD7EAAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAPwGAu8GAQAAAAH1BgEAAAAB-QYBAAAAAfoGAQAAAAEEZwAA7xAAMP0HAADwEAAw_wcAAPIQACCDCAAAuQ4AMANnAACPHAAg_QcAAJAcACCDCAAAnQUAIANnAACNHAAg_QcAAI4cACCDCAAAFwAgBGcAAOAQADD9BwAA4RAAMP8HAADjEAAggwgAAOQQADAEZwAArBAAMP0HAACtEAAw_wcAAK8QACCDCAAAsBAAMARnAACjEAAw_QcAAKQQADD_BwAAphAAIIMIAACQDgAwBGcAAIgQADD9BwAAiRAAMP8HAACLEAAggwgAAIwQADAEZwAA_Q8AMP0HAAD-DwAw_wcAAIAQACCDCAAAqA8AMAAAAAAAAAAAAAAFZwAAiBwAIGgAAIscACD9BwAAiRwAIP4HAACKHAAggwgAALkIACADZwAAiBwAIP0HAACJHAAggwgAALkIACAAAAAHZwAAgxwAIGgAAIYcACD9BwAAhBwAIP4HAACFHAAggQgAACwAIIIIAAAsACCDCAAAuQgAIANnAACDHAAg_QcAAIQcACCDCAAAuQgAIAAAAAAAAAAAC2cAAKkRADBoAACuEQAw_QcAAKoRADD-BwAAqxEAMP8HAACsEQAggAgAAK0RADCBCAAArREAMIIIAACtEQAwgwgAAK0RADCECAAArxEAMIUIAACwEQAwC2cAAKARADBoAACkEQAw_QcAAKERADD-BwAAohEAMP8HAACjEQAggAgAAJAOADCBCAAAkA4AMIIIAACQDgAwgwgAAJAOADCECAAApREAMIUIAACTDgAwBWcAAO0bACBoAACBHAAg_QcAAO4bACD-BwAAgBwAIIMIAACdBQAgBWcAAOsbACBoAAD-GwAg_QcAAOwbACD-BwAA_RsAIIMIAAAXACAVBgAA0w4AIAgAANAOACAKAADKDgAgDQAAzw4AIA4AAM0OACAQAADgDwAgGAAAzg4AIBoAANIOACAuAADLDgAgLwAAzA4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAfcGAQAAAAHOB0AAAAABAgAAACUAIGcAAKgRACADAAAAJQAgZwAAqBEAIGgAAKcRACABYAAA_BsAMAIAAAAlACBgAACnEQAgAgAAAJQOACBgAACmEQAgC5YGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIb8GAQCADQAhwAYBAIANACHCBgEAgA0AIfcGAQCADQAhzgdAAIINACEVBgAAoA4AIAgAAJ0OACAKAACXDgAgDQAAnA4AIA4AAJoOACAQAADeDwAgGAAAmw4AIBoAAJ8OACAuAACYDgAgLwAAmQ4AIJYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIb8GAQCADQAhwAYBAIANACHCBgEAgA0AIfcGAQCADQAhzgdAAIINACEVBgAA0w4AIAgAANAOACAKAADKDgAgDQAAzw4AIA4AAM0OACAQAADgDwAgGAAAzg4AIBoAANIOACAuAADLDgAgLwAAzA4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAfcGAQAAAAHOB0AAAAABDQYAAMsRACAIAADMEQAgDAAAzREAIA8AAM4RACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAGBBwIAAAABzwcBAAAAAdAHAQAAAAECAAAAIAAgZwAAyhEAIAMAAAAgACBnAADKEQAgaAAAsxEAIAFgAAD7GwAwEgYAALoLACAIAAC7DAAgCQAA8AwAIAwAAKALACAPAADvCwAgkwYAAPEMADCUBgAAHgAQlQYAAPEMADCWBgEAAAABmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACH1BgEA8goAIYEHAgC1DAAhhwcBAPIKACHPBwEAAAAB0AcBAPEKACECAAAAIAAgYAAAsxEAIAIAAACxEQAgYAAAshEAIA2TBgAAsBEAMJQGAACxEQAQlQYAALARADCWBgEA8QoAIZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh9QYBAPIKACGBBwIAtQwAIYcHAQDyCgAhzwcBAPEKACHQBwEA8QoAIQ2TBgAAsBEAMJQGAACxEQAQlQYAALARADCWBgEA8QoAIZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh9QYBAPIKACGBBwIAtQwAIYcHAQDyCgAhzwcBAPEKACHQBwEA8QoAIQmWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGBBwIAthAAIc8HAQCADQAh0AcBAIANACENBgAAtBEAIAgAALURACAMAAC2EQAgDwAAtxEAIJYGAQCADQAhmwYBAIANACGcBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYEHAgC2EAAhzwcBAIANACHQBwEAgA0AIQVnAADxGwAgaAAA-RsAIP0HAADyGwAg_gcAAPgbACCDCAAAnQUAIAVnAADvGwAgaAAA9hsAIP0HAADwGwAg_gcAAPUbACCDCAAAFwAgC2cAAMERADBoAADFEQAw_QcAAMIRADD-BwAAwxEAMP8HAADEEQAggAgAAJAOADCBCAAAkA4AMIIIAACQDgAwgwgAAJAOADCECAAAxhEAMIUIAACTDgAwC2cAALgRADBoAAC8EQAw_QcAALkRADD-BwAAuhEAMP8HAAC7EQAggAgAAPwNADCBCAAA_A0AMIIIAAD8DQAwgwgAAPwNADCECAAAvREAMIUIAAD_DQAwCwYAAIoOACAIAACLDgAgDQAAiA4AIBAAAOwOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAb4GAQAAAAHABgEAAAABAgAAADkAIGcAAMARACADAAAAOQAgZwAAwBEAIGgAAL8RACABYAAA9BsAMAIAAAA5ACBgAAC_EQAgAgAAAIAOACBgAAC-EQAgB5YGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIcAGAQCADQAhCwYAAIUOACAIAACGDgAgDQAAgw4AIBAAAOsOACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACHABgEAgA0AIQsGAACKDgAgCAAAiw4AIA0AAIgOACAQAADsDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABwAYBAAAAARUGAADTDgAgCAAA0A4AIAkAANEOACAKAADKDgAgDQAAzw4AIBAAAOAPACAYAADODgAgGgAA0g4AIC4AAMsOACAvAADMDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABwAYBAAAAAcIGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAECAAAAJQAgZwAAyREAIAMAAAAlACBnAADJEQAgaAAAyBEAIAFgAADzGwAwAgAAACUAIGAAAMgRACACAAAAlA4AIGAAAMcRACALlgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhwAYBAIANACHCBgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIRUGAACgDgAgCAAAnQ4AIAkAAJ4OACAKAACXDgAgDQAAnA4AIBAAAN4PACAYAACbDgAgGgAAnw4AIC4AAJgOACAvAACZDgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhwAYBAIANACHCBgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIRUGAADTDgAgCAAA0A4AIAkAANEOACAKAADKDgAgDQAAzw4AIBAAAOAPACAYAADODgAgGgAA0g4AIC4AAMsOACAvAADMDgAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABwAYBAAAAAcIGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAENBgAAyxEAIAgAAMwRACAMAADNEQAgDwAAzhEAIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB9QYBAAAAAYEHAgAAAAHPBwEAAAAB0AcBAAAAAQNnAADxGwAg_QcAAPIbACCDCAAAnQUAIANnAADvGwAg_QcAAPAbACCDCAAAFwAgBGcAAMERADD9BwAAwhEAMP8HAADEEQAggwgAAJAOADAEZwAAuBEAMP0HAAC5EQAw_wcAALsRACCDCAAA_A0AMARnAACpEQAw_QcAAKoRADD_BwAArBEAIIMIAACtEQAwBGcAAKARADD9BwAAoREAMP8HAACjEQAggwgAAJAOADADZwAA7RsAIP0HAADuGwAggwgAAJ0FACADZwAA6xsAIP0HAADsGwAggwgAABcAIAAAAAKACAEAAAAEiggBAAAABQtnAADYEQAwaAAA3BEAMP0HAADZEQAw_gcAANoRADD_BwAA2xEAIIAIAAC-DwAwgQgAAL4PADCCCAAAvg8AMIMIAAC-DwAwhAgAAN0RADCFCAAAwQ8AMA4WAADLDwAgFwAAzA8AIBgAAO0PACCWBgEAAAABngZAAAAAAZ8GQAAAAAHCBgEAAAABzAYBAAAAAc4GAAAA7QYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0wYBAAAAAe0GAQAAAAECAAAASwAgZwAA4BEAIAMAAABLACBnAADgEQAgaAAA3xEAIAFgAADqGwAwAgAAAEsAIGAAAN8RACACAAAAwg8AIGAAAN4RACALlgYBAIANACGeBkAAgg0AIZ8GQACCDQAhwgYBAIENACHMBgEAgQ0AIc4GAADED-0GIs8GAQCBDQAh0AZAAJgNACHRBkAAgg0AIdMGAQCBDQAh7QYBAIANACEOFgAAxw8AIBcAAMgPACAYAADsDwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhwgYBAIENACHMBgEAgQ0AIc4GAADED-0GIs8GAQCBDQAh0AZAAJgNACHRBkAAgg0AIdMGAQCBDQAh7QYBAIANACEOFgAAyw8AIBcAAMwPACAYAADtDwAglgYBAAAAAZ4GQAAAAAGfBkAAAAABwgYBAAAAAcwGAQAAAAHOBgAAAO0GAs8GAQAAAAHQBkAAAAAB0QZAAAAAAdMGAQAAAAHtBgEAAAABAYAIAQAAAAQEZwAA2BEAMP0HAADZEQAw_wcAANsRACCDCAAAvg8AMAAAAAACgAgBAAAABIoIAQAAAAULZwAA6REAMGgAAO0RADD9BwAA6hEAMP4HAADrEQAw_wcAAOwRACCACAAAvg0AMIEIAAC-DQAwgggAAL4NADCDCAAAvg0AMIQIAADuEQAwhQgAAMENADASBgAAzw0AIAgAANANACAQAAD7DgAgFwAAzg0AICQAAM0NACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0wYBAAAAAQIAAABrACBnAADxEQAgAwAAAGsAIGcAAPERACBoAADwEQAgAWAAAOkbADACAAAAawAgYAAA8BEAIAIAAADCDQAgYAAA7xEAIA2WBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhqwYBAIANACHABgEAgQ0AIcwGAQCBDQAhzgYAAMQNzgYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0wYBAIENACESBgAAyQ0AIAgAAMoNACAQAAD6DgAgFwAAyA0AICQAAMcNACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhqwYBAIANACHABgEAgQ0AIcwGAQCBDQAhzgYAAMQNzgYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0wYBAIENACESBgAAzw0AIAgAANANACAQAAD7DgAgFwAAzg0AICQAAM0NACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0wYBAAAAAQGACAEAAAAEBGcAAOkRADD9BwAA6hEAMP8HAADsEQAggwgAAL4NADAAAAAAAAABgAgAAACLBwIFZwAA5BsAIGgAAOcbACD9BwAA5RsAIP4HAADmGwAggwgAAJ0FACADZwAA5BsAIP0HAADlGwAggwgAAJ0FACAAAAAFZwAA3xsAIGgAAOIbACD9BwAA4BsAIP4HAADhGwAggwgAAJ0FACADZwAA3xsAIP0HAADgGwAggwgAAJ0FACAgCwAAgxEAIAwAAIURACAPAADDFwAgGwAAhxEAICgAAIQRACAqAACGEQAgLAAAyxcAIDAAALwXACAxAAC9FwAgMgAAvxcAIDMAAMEXACA0AADCFwAgNQAA9BEAIDYAAMUXACA3AADGFwAgOAAAxxcAIDoAAM8XACA8AAC7FwAgPQAAvhcAID4AAMAXACBCAADKFwAgQwAAxBcAIEQAAMgXACBFAADJFwAgSgAAzBcAIEsAAM0XACBMAADOFwAgTQAAzhcAIMoGAAD8DAAg9QYAAPwMACC6BwAA_AwAIL0HAAD8DAAgAAAAAAAAAAAAAAVnAADaGwAgaAAA3RsAIP0HAADbGwAg_gcAANwbACCDCAAAuQgAIANnAADaGwAg_QcAANsbACCDCAAAuQgAIAAAAAVnAADSGwAgaAAA2BsAIP0HAADTGwAg_gcAANcbACCDCAAAgAIAIAVnAADQGwAgaAAA1RsAIP0HAADRGwAg_gcAANQbACCDCAAAmgMAIANnAADSGwAg_QcAANMbACCDCAAAgAIAIANnAADQGwAg_QcAANEbACCDCAAAmgMAIAAAAAGACAAAAKYHAgVnAADLGwAgaAAAzhsAIP0HAADMGwAg_gcAAM0bACCDCAAAgAIAIANnAADLGwAg_QcAAMwbACCDCAAAgAIAIAAAAAVnAADBGwAgaAAAyRsAIP0HAADCGwAg_gcAAMgbACCDCAAAnQUAIAVnAAC_GwAgaAAAxhsAIP0HAADAGwAg_gcAAMUbACCDCAAAmgMAIAtnAACvEgAwaAAAtBIAMP0HAACwEgAw_gcAALESADD_BwAAshIAIIAIAACzEgAwgQgAALMSADCCCAAAsxIAMIMIAACzEgAwhAgAALUSADCFCAAAthIAMAtnAACjEgAwaAAAqBIAMP0HAACkEgAw_gcAAKUSADD_BwAAphIAIIAIAACnEgAwgQgAAKcSADCCCAAApxIAMIMIAACnEgAwhAgAAKkSADCFCAAAqhIAMAQDAACVEgAglgYBAAAAAZ0GAQAAAAGkB0AAAAABAgAAAIgCACBnAACuEgAgAwAAAIgCACBnAACuEgAgaAAArRIAIAFgAADEGwAwCgMAAPYKACBHAACjDAAgkwYAAKIMADCUBgAAhgIAEJUGAACiDAAwlgYBAAAAAZ0GAQDxCgAhowcBAPEKACGkB0AA9QoAIfIHAAChDAAgAgAAAIgCACBgAACtEgAgAgAAAKsSACBgAACsEgAgB5MGAACqEgAwlAYAAKsSABCVBgAAqhIAMJYGAQDxCgAhnQYBAPEKACGjBwEA8QoAIaQHQAD1CgAhB5MGAACqEgAwlAYAAKsSABCVBgAAqhIAMJYGAQDxCgAhnQYBAPEKACGjBwEA8QoAIaQHQAD1CgAhA5YGAQCADQAhnQYBAIANACGkB0AAgg0AIQQDAACTEgAglgYBAIANACGdBgEAgA0AIaQHQACCDQAhBAMAAJUSACCWBgEAAAABnQYBAAAAAaQHQAAAAAEDlgYBAAAAAZ4GQAAAAAGmBwAAAKYHAgIAAACEAgAgZwAAuhIAIAMAAACEAgAgZwAAuhIAIGgAALkSACABYAAAwxsAMAlHAACjDAAgkwYAAKUMADCUBgAAggIAEJUGAAClDAAwlgYBAAAAAZ4GQAD1CgAhowcBAPEKACGmBwAApgymByLzBwAApAwAIAIAAACEAgAgYAAAuRIAIAIAAAC3EgAgYAAAuBIAIAeTBgAAthIAMJQGAAC3EgAQlQYAALYSADCWBgEA8QoAIZ4GQAD1CgAhowcBAPEKACGmBwAApgymByIHkwYAALYSADCUBgAAtxIAEJUGAAC2EgAwlgYBAPEKACGeBkAA9QoAIaMHAQDxCgAhpgcAAKYMpgciA5YGAQCADQAhngZAAIINACGmBwAAmRKmByIDlgYBAIANACGeBkAAgg0AIaYHAACZEqYHIgOWBgEAAAABngZAAAAAAaYHAAAApgcCA2cAAMEbACD9BwAAwhsAIIMIAACdBQAgA2cAAL8bACD9BwAAwBsAIIMIAACaAwAgBGcAAK8SADD9BwAAsBIAMP8HAACyEgAggwgAALMSADAEZwAAoxIAMP0HAACkEgAw_wcAAKYSACCDCAAApxIAMAAAAAAAAAGACAAAALQHAgGACAAAALYHAgVnAAC0GwAgaAAAvRsAIP0HAAC1GwAg_gcAALwbACCDCAAAmgMAIAVnAACyGwAgaAAAuhsAIP0HAACzGwAg_gcAALkbACCDCAAAnQUAIAdnAACwGwAgaAAAtxsAIP0HAACxGwAg_gcAALYbACCBCAAATwAggggAAE8AIIMIAACaAwAgA2cAALQbACD9BwAAtRsAIIMIAACaAwAgA2cAALIbACD9BwAAsxsAIIMIAACdBQAgA2cAALAbACD9BwAAsRsAIIMIAACaAwAgAAAAAAABgAgAAAC8BwMBgAgAAADkBgMFgAgQAAAAAYYIEAAAAAGHCBAAAAABiAgQAAAAAYkIEAAAAAEBgAgAAADMBwIFZwAApBsAIGgAAK4bACD9BwAApRsAIP4HAACtGwAggwgAAJoDACAHZwAAohsAIGgAAKsbACD9BwAAoxsAIP4HAACqGwAggQgAAE8AIIIIAABPACCDCAAAmgMAIAdnAACgGwAgaAAAqBsAIP0HAAChGwAg_gcAAKcbACCBCAAAEwAggggAABMAIIMIAACdBQAgC2cAANoSADBoAADfEgAw_QcAANsSADD-BwAA3BIAMP8HAADdEgAggAgAAN4SADCBCAAA3hIAMIIIAADeEgAwgwgAAN4SADCECAAA4BIAMIUIAADhEgAwDAYAAIwPACCWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAABzgYAAADmBgLkBgAAAOQGAuYGEAAAAAHnBgEAAAAB6AYCAAAAAekGQAAAAAHqBkAAAAABAgAAAOsBACBnAADlEgAgAwAAAOsBACBnAADlEgAgaAAA5BIAIAFgAACmGwAwEQYAALoLACBBAACxDAAgkwYAAK8MADCUBgAA6QEAEJUGAACvDAAwlgYBAAAAAZsGAQDxCgAhngZAAPUKACGfBkAA9QoAIc4GAACwDOYGIuIGAQDyCgAh5AYAAKoM5AYi5gYQAKsMACHnBgEA8QoAIegGAgCsDAAh6QZAAPUKACHqBkAA9QoAIQIAAADrAQAgYAAA5BIAIAIAAADiEgAgYAAA4xIAIA-TBgAA4RIAMJQGAADiEgAQlQYAAOESADCWBgEA8QoAIZsGAQDxCgAhngZAAPUKACGfBkAA9QoAIc4GAACwDOYGIuIGAQDyCgAh5AYAAKoM5AYi5gYQAKsMACHnBgEA8QoAIegGAgCsDAAh6QZAAPUKACHqBkAA9QoAIQ-TBgAA4RIAMJQGAADiEgAQlQYAAOESADCWBgEA8QoAIZsGAQDxCgAhngZAAPUKACGfBkAA9QoAIc4GAACwDOYGIuIGAQDyCgAh5AYAAKoM5AYi5gYQAKsMACHnBgEA8QoAIegGAgCsDAAh6QZAAPUKACHqBkAA9QoAIQuWBgEAgA0AIZsGAQCADQAhngZAAIINACGfBkAAgg0AIc4GAACHD-YGIuQGAACGD-QGIuYGEACIDwAh5wYBAIANACHoBgIAiQ8AIekGQACCDQAh6gZAAIINACEMBgAAig8AIJYGAQCADQAhmwYBAIANACGeBkAAgg0AIZ8GQACCDQAhzgYAAIcP5gYi5AYAAIYP5AYi5gYQAIgPACHnBgEAgA0AIegGAgCJDwAh6QZAAIINACHqBkAAgg0AIQwGAACMDwAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA5gYC5AYAAADkBgLmBhAAAAAB5wYBAAAAAegGAgAAAAHpBkAAAAAB6gZAAAAAAQNnAACkGwAg_QcAAKUbACCDCAAAmgMAIANnAACiGwAg_QcAAKMbACCDCAAAmgMAIANnAACgGwAg_QcAAKEbACCDCAAAnQUAIARnAADaEgAw_QcAANsSADD_BwAA3RIAIIMIAADeEgAwAAAAC2cAALsVADBoAADAFQAw_QcAALwVADD-BwAAvRUAMP8HAAC-FQAggAgAAL8VADCBCAAAvxUAMIIIAAC_FQAwgwgAAL8VADCECAAAwRUAMIUIAADCFQAwC2cAAK8VADBoAAC0FQAw_QcAALAVADD-BwAAsRUAMP8HAACyFQAggAgAALMVADCBCAAAsxUAMIIIAACzFQAwgwgAALMVADCECAAAtRUAMIUIAAC2FQAwC2cAAJYVADBoAACbFQAw_QcAAJcVADD-BwAAmBUAMP8HAACZFQAggAgAAJoVADCBCAAAmhUAMIIIAACaFQAwgwgAAJoVADCECAAAnBUAMIUIAACdFQAwC2cAAP4UADBoAACDFQAw_QcAAP8UADD-BwAAgBUAMP8HAACBFQAggAgAAIIVADCBCAAAghUAMIIIAACCFQAwgwgAAIIVADCECAAAhBUAMIUIAACFFQAwC2cAAPUUADBoAAD5FAAw_QcAAPYUADD-BwAA9xQAMP8HAAD4FAAggAgAALAQADCBCAAAsBAAMIIIAACwEAAwgwgAALAQADCECAAA-hQAMIUIAACzEAAwC2cAAOoUADBoAADuFAAw_QcAAOsUADD-BwAA7BQAMP8HAADtFAAggAgAAK0RADCBCAAArREAMIIIAACtEQAwgwgAAK0RADCECAAA7xQAMIUIAACwEQAwC2cAANsUADBoAADgFAAw_QcAANwUADD-BwAA3RQAMP8HAADeFAAggAgAAN8UADCBCAAA3xQAMIIIAADfFAAwgwgAAN8UADCECAAA4RQAMIUIAADiFAAwC2cAAM8UADBoAADUFAAw_QcAANAUADD-BwAA0RQAMP8HAADSFAAggAgAANMUADCBCAAA0xQAMIIIAADTFAAwgwgAANMUADCECAAA1RQAMIUIAADWFAAwC2cAAMMUADBoAADIFAAw_QcAAMQUADD-BwAAxRQAMP8HAADGFAAggAgAAMcUADCBCAAAxxQAMIIIAADHFAAwgwgAAMcUADCECAAAyRQAMIUIAADKFAAwC2cAALoUADBoAAC-FAAw_QcAALsUADD-BwAAvBQAMP8HAAC9FAAggAgAAJAOADCBCAAAkA4AMIIIAACQDgAwgwgAAJAOADCECAAAvxQAMIUIAACTDgAwC2cAALEUADBoAAC1FAAw_QcAALIUADD-BwAAsxQAMP8HAAC0FAAggAgAAPwNADCBCAAA_A0AMIIIAAD8DQAwgwgAAPwNADCECAAAthQAMIUIAAD_DQAwC2cAAKUUADBoAACqFAAw_QcAAKYUADD-BwAApxQAMP8HAACoFAAggAgAAKkUADCBCAAAqRQAMIIIAACpFAAwgwgAAKkUADCECAAAqxQAMIUIAACsFAAwC2cAAJwUADBoAACgFAAw_QcAAJ0UADD-BwAAnhQAMP8HAACfFAAggAgAAL4NADCBCAAAvg0AMIIIAAC-DQAwgwgAAL4NADCECAAAoRQAMIUIAADBDQAwC2cAAJMUADBoAACXFAAw_QcAAJQUADD-BwAAlRQAMP8HAACWFAAggAgAANUNADCBCAAA1Q0AMIIIAADVDQAwgwgAANUNADCECAAAmBQAMIUIAADYDQAwC2cAAIoUADBoAACOFAAw_QcAAIsUADD-BwAAjBQAMP8HAACNFAAggAgAAOUNADCBCAAA5Q0AMIIIAADlDQAwgwgAAOUNADCECAAAjxQAMIUIAADoDQAwC2cAAIEUADBoAACFFAAw_QcAAIIUADD-BwAAgxQAMP8HAACEFAAggAgAAKsNADCBCAAAqw0AMIIIAACrDQAwgwgAAKsNADCECAAAhhQAMIUIAACuDQAwC2cAAPgTADBoAAD8EwAw_QcAAPkTADD-BwAA-hMAMP8HAAD7EwAggAgAAIwQADCBCAAAjBAAMIIIAACMEAAwgwgAAIwQADCECAAA_RMAMIUIAACPEAAwC2cAAO8TADBoAADzEwAw_QcAAPATADD-BwAA8RMAMP8HAADyEwAggAgAAKgPADCBCAAAqA8AMIIIAACoDwAwgwgAAKgPADCECAAA9BMAMIUIAACrDwAwB2cAAOoTACBoAADtEwAg_QcAAOsTACD-BwAA7BMAIIEIAAD1AQAggggAAPUBACCDCAAA8wYAIAtnAADeEwAwaAAA4xMAMP0HAADfEwAw_gcAAOATADD_BwAA4RMAIIAIAADiEwAwgQgAAOITADCCCAAA4hMAMIMIAADiEwAwhAgAAOQTADCFCAAA5RMAMAtnAADVEwAwaAAA2RMAMP0HAADWEwAw_gcAANcTADD_BwAA2BMAIIAIAADeEgAwgQgAAN4SADCCCAAA3hIAMIMIAADeEgAwhAgAANoTADCFCAAA4RIAMAtnAADMEwAwaAAA0BMAMP0HAADNEwAw_gcAAM4TADD_BwAAzxMAIIAIAADkEAAwgQgAAOQQADCCCAAA5BAAMIMIAADkEAAwhAgAANETADCFCAAA5xAAMAtnAADDEwAwaAAAxxMAMP0HAADEEwAw_gcAAMUTADD_BwAAxhMAIIAIAAC5DgAwgQgAALkOADCCCAAAuQ4AMIMIAAC5DgAwhAgAAMgTADCFCAAAvA4AMAtnAAC3EwAwaAAAvBMAMP0HAAC4EwAw_gcAALkTADD_BwAAuhMAIIAIAAC7EwAwgQgAALsTADCCCAAAuxMAMIMIAAC7EwAwhAgAAL0TADCFCAAAvhMAMAtnAACrEwAwaAAAsBMAMP0HAACsEwAw_gcAAK0TADD_BwAArhMAIIAIAACvEwAwgQgAAK8TADCCCAAArxMAMIMIAACvEwAwhAgAALETADCFCAAAshMAMAtnAACiEwAwaAAAphMAMP0HAACjEwAw_gcAAKQTADD_BwAApRMAIIAIAACQDQAwgQgAAJANADCCCAAAkA0AMIMIAACQDQAwhAgAAKcTADCFCAAAkw0AMAtnAACZEwAwaAAAnRMAMP0HAACaEwAw_gcAAJsTADD_BwAAnBMAIIAIAACQDQAwgQgAAJANADCCCAAAkA0AMIMIAACQDQAwhAgAAJ4TADCFCAAAkw0AMAtnAACJEwAwaAAAjhMAMP0HAACKEwAw_gcAAIsTADD_BwAAjBMAIIAIAACNEwAwgQgAAI0TADCCCAAAjRMAMIMIAACNEwAwhAgAAI8TADCFCAAAkBMAMAcDAACXEwAgCAAAmBMAIJYGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAABAgAAAAEAIGcAAJYTACADAAAAAQAgZwAAlhMAIGgAAJMTACABYAAAnxsAMA0DAAD2CgAgBgAAugsAIAgAALsMACCTBgAAugwAMJQGAADAAQAQlQYAALoMADCWBgEAAAABmwYBAPEKACGcBgEA8QoAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIfoHAAD7DAAgAgAAAAEAIGAAAJMTACACAAAAkRMAIGAAAJITACAJkwYAAJATADCUBgAAkRMAEJUGAACQEwAwlgYBAPEKACGbBgEA8QoAIZwGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhCZMGAACQEwAwlAYAAJETABCVBgAAkBMAMJYGAQDxCgAhmwYBAPEKACGcBgEA8QoAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIQWWBgEAgA0AIZwGAQCADQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAhBwMAAJQTACAIAACVEwAglgYBAIANACGcBgEAgA0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIQVnAACXGwAgaAAAnRsAIP0HAACYGwAg_gcAAJwbACCDCAAAmgMAIAVnAACVGwAgaAAAmhsAIP0HAACWGwAg_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_QYBAAAAAf4GAQAAAAECAAAAKQAgZwAAyxMAIAMAAAApACBnAADLEwAgaAAAyhMAIAFgAACQGwAwAgAAACkAIGAAAMoTACACAAAAvQ4AIGAAAMkTACAKlgYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHUBgEAgA0AIe8GAQCADQAh9QYBAIENACH8BgEAgQ0AIf0GAQCADQAh_gYBAIANACEOCAAAww4AICYAAPcQACArAADADgAgLQAAwQ4AIJYGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAh1AYBAIANACHvBgEAgA0AIfUGAQCBDQAh_AYBAIENACH9BgEAgA0AIf4GAQCADQAhDggAAMgOACAmAAD5EAAgKwAAxQ4AIC0AAMYOACCWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB1AYBAAAAAe8GAQAAAAH1BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAABDQgAAP0QACAKAAD7EAAgGgAAkxEAIJYGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAPwGAu8GAQAAAAH1BgEAAAAB9wYBAAAAAfkGAQAAAAH6BgEAAAABAgAAADAAIGcAANQTACADAAAAMAAgZwAA1BMAIGgAANMTACABYAAAjxsAMAIAAAAwACBgAADTEwAgAgAAAOgQACBgAADSEwAgCpYGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhzgYAAOoQ_AYi7wYBAIANACH1BgEAgQ0AIfcGAQCBDQAh-QYBAIANACH6BgEAgA0AIQ0IAADuEAAgCgAA7BAAIBoAAJIRACCWBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIc4GAADqEPwGIu8GAQCADQAh9QYBAIENACH3BgEAgQ0AIfkGAQCADQAh-gYBAIANACENCAAA_RAAIAoAAPsQACAaAACTEQAglgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA_AYC7wYBAAAAAfUGAQAAAAH3BgEAAAAB-QYBAAAAAfoGAQAAAAEMQQAAjQ8AIJYGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA5gYC4gYBAAAAAeQGAAAA5AYC5gYQAAAAAecGAQAAAAHoBgIAAAAB6QZAAAAAAeoGQAAAAAECAAAA6wEAIGcAAN0TACADAAAA6wEAIGcAAN0TACBoAADcEwAgAWAAAI4bADACAAAA6wEAIGAAANwTACACAAAA4hIAIGAAANsTACALlgYBAIANACGeBkAAgg0AIZ8GQACCDQAhzgYAAIcP5gYi4gYBAIENACHkBgAAhg_kBiLmBhAAiA8AIecGAQCADQAh6AYCAIkPACHpBkAAgg0AIeoGQACCDQAhDEEAAIsPACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHOBgAAhw_mBiLiBgEAgQ0AIeQGAACGD-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_xMAIAIAAACQEAAgYAAA_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_ACBnAACbFAAgAwAAAD8AIGcAAJsUACBoAACaFAAgAWAAAIgbADACAAAAPwAgYAAAmhQAIAIAAADZDQAgYAAAmRQAIAqWBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhwAYBAIANACHHBgEAgA0AIcgGAQCBDQAhygYAANsNygYiywZAAJgNACEOCAAA3w0AIA0AAN0NACAQAAD1DgAgIgAA4A0AIJYGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACHABgEAgA0AIccGAQCADQAhyAYBAIENACHKBgAA2w3KBiLLBkAAmA0AIQ4IAAD2DQAgDQAA9A0AIBAAAPYOACAiAAD3DQAglgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAb4GAQAAAAHABgEAAAABxwYBAAAAAcgGAQAAAAHKBgAAAMoGAssGQAAAAAESCAAA0A0AIBAAAPsOACAVAADMDQAgFwAAzg0AICQAAM0NACCWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABqwYBAAAAAcAGAQAAAAHMBgEAAAABzgYAAADOBgLPBgEAAAAB0AZAAAAAAdEGQAAAAAHSBgEAAAAB0wYBAAAAAQIAAABrACBnAACkFAAgAwAAAGsAIGcAAKQUACBoAACjFAAgAWAAAIcbADACAAAAawAgYAAAoxQAIAIAAADCDQAgYAAAohQAIA2WBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIasGAQCADQAhwAYBAIENACHMBgEAgQ0AIc4GAADEDc4GIs8GAQCBDQAh0AZAAJgNACHRBkAAgg0AIdIGAQCADQAh0wYBAIENACESCAAAyg0AIBAAAPoOACAVAADGDQAgFwAAyA0AICQAAMcNACCWBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIasGAQCADQAhwAYBAIENACHMBgEAgQ0AIc4GAADEDc4GIs8GAQCBDQAh0AZAAJgNACHRBkAAgg0AIdIGAQCADQAh0wYBAIENACESCAAA0A0AIBAAAPsOACAVAADMDQAgFwAAzg0AICQAAM0NACCWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABqwYBAAAAAcAGAQAAAAHMBgEAAAABzgYAAADOBgLPBgEAAAAB0AZAAAAAAdEGQAAAAAHSBgEAAAAB0wYBAAAAAR0_AADmEgAgQAAA5xIAIEIAAOkSACCWBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAMwHAtAGQAAAAAH1BgEAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABugcBAAAAAbwHAAAAvAcDvQcBAAAAAb4HAAAA5AYDvwcQAAAAAcAHAQAAAAHBBwIAAAABwgcAAACLBwLDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJB4AAAAABygdAAAAAAcwHAQAAAAECAAAA5QEAIGcAALAUACADAAAA5QEAIGcAALAUACBoAACvFAAgAWAAAIYbADAiBgAAtwwAID8AAPYKACBAAACgDAAgQgAA9gsAIJMGAACyDAAwlAYAAOMBABCVBgAAsgwAMJYGAQAAAAGbBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHOBgAAtgzMByLQBkAAnwwAIfUGAQDyCgAhtwcBAPIKACG4BwEA8QoAIbkHAQDxCgAhugcBAPIKACG8BwAA5gu8ByO9BwEA8goAIb4HAACzDOQGI78HEAC0DAAhwAcBAPEKACHBBwIAtQwAIcIHAACtDIsHIsMHAQAAAAHEBwEA8goAIcUHAQAAAAHGBwEA8goAIccHAQDyCgAhyAcBAPIKACHJBwAArgwAIMoHQACfDAAhzAcBAPIKACECAAAA5QEAIGAAAK8UACACAAAArRQAIGAAAK4UACAekwYAAKwUADCUBgAArRQAEJUGAACsFAAwlgYBAPEKACGbBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHOBgAAtgzMByLQBkAAnwwAIfUGAQDyCgAhtwcBAPIKACG4BwEA8QoAIbkHAQDxCgAhugcBAPIKACG8BwAA5gu8ByO9BwEA8goAIb4HAACzDOQGI78HEAC0DAAhwAcBAPEKACHBBwIAtQwAIcIHAACtDIsHIsMHAQDyCgAhxAcBAPIKACHFBwEA8goAIcYHAQDyCgAhxwcBAPIKACHIBwEA8goAIckHAACuDAAgygdAAJ8MACHMBwEA8goAIR6TBgAArBQAMJQGAACtFAAQlQYAAKwUADCWBgEA8QoAIZsGAQDyCgAhngZAAPUKACGfBkAA9QoAIc4GAAC2DMwHItAGQACfDAAh9QYBAPIKACG3BwEA8goAIbgHAQDxCgAhuQcBAPEKACG6BwEA8goAIbwHAADmC7wHI70HAQDyCgAhvgcAALMM5AYjvwcQALQMACHABwEA8QoAIcEHAgC1DAAhwgcAAK0MiwciwwcBAPIKACHEBwEA8goAIcUHAQDyCgAhxgcBAPIKACHHBwEA8goAIcgHAQDyCgAhyQcAAK4MACDKB0AAnwwAIcwHAQDyCgAhGpYGAQCADQAhngZAAIINACGfBkAAgg0AIc4GAADVEswHItAGQACYDQAh9QYBAIENACG3BwEAgQ0AIbgHAQCADQAhuQcBAIANACG6BwEAgQ0AIbwHAADSErwHI70HAQCBDQAhvgcAANMS5AYjvwcQANQSACHABwEAgA0AIcEHAgC2EAAhwgcAAPoRiwciwwcBAIENACHEBwEAgQ0AIcUHAQCBDQAhxgcBAIENACHHBwEAgQ0AIcgHAQCBDQAhyQeAAAAAAcoHQACYDQAhzAcBAIENACEdPwAA1hIAIEAAANcSACBCAADZEgAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhzgYAANUSzAci0AZAAJgNACH1BgEAgQ0AIbcHAQCBDQAhuAcBAIANACG5BwEAgA0AIboHAQCBDQAhvAcAANISvAcjvQcBAIENACG-BwAA0xLkBiO_BxAA1BIAIcAHAQCADQAhwQcCALYQACHCBwAA-hGLByLDBwEAgQ0AIcQHAQCBDQAhxQcBAIENACHGBwEAgQ0AIccHAQCBDQAhyAcBAIENACHJB4AAAAABygdAAJgNACHMBwEAgQ0AIR0_AADmEgAgQAAA5xIAIEIAAOkSACCWBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAMwHAtAGQAAAAAH1BgEAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABugcBAAAAAbwHAAAAvAcDvQcBAAAAAb4HAAAA5AYDvwcQAAAAAcAHAQAAAAHBBwIAAAABwgcAAACLBwLDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJB4AAAAABygdAAAAAAcwHAQAAAAELCAAAiw4AIA0AAIgOACAOAACJDgAgEAAA7A4AIJYGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAAcAGAQAAAAECAAAAOQAgZwAAuRQAIAMAAAA5ACBnAAC5FAAgaAAAuBQAIAFgAACFGwAwAgAAADkAIGAAALgUACACAAAAgA4AIGAAALcUACAHlgYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIb8GAQCADQAhwAYBAIANACELCAAAhg4AIA0AAIMOACAOAACEDgAgEAAA6w4AIJYGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACG_BgEAgA0AIcAGAQCADQAhCwgAAIsOACANAACIDgAgDgAAiQ4AIBAAAOwOACCWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABFQgAANAOACAJAADRDgAgCgAAyg4AIA0AAM8OACAOAADNDgAgEAAA4A8AIBgAAM4OACAaAADSDgAgLgAAyw4AIC8AAMwOACCWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAfcGAQAAAAGHBwEAAAABzgdAAAAAAQIAAAAlACBnAADCFAAgAwAAACUAIGcAAMIUACBoAADBFAAgAWAAAIQbADACAAAAJQAgYAAAwRQAIAIAAACUDgAgYAAAwBQAIAuWBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHABgEAgA0AIcIGAQCADQAh9wYBAIANACGHBwEAgQ0AIc4HQACCDQAhFQgAAJ0OACAJAACeDgAgCgAAlw4AIA0AAJwOACAOAACaDgAgEAAA3g8AIBgAAJsOACAaAACfDgAgLgAAmA4AIC8AAJkOACCWBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHABgEAgA0AIcIGAQCADQAh9wYBAIANACGHBwEAgQ0AIc4HQACCDQAhFQgAANAOACAJAADRDgAgCgAAyg4AIA0AAM8OACAOAADNDgAgEAAA4A8AIBgAAM4OACAaAADSDgAgLgAAyw4AIC8AAMwOACCWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAfcGAQAAAAGHBwEAAAABzgdAAAAAAQ4DAADjDwAgCAAA4g8AIAwAAOQPACASAADlDwAgGQAA5g8AIBsAAOcPACAhAADoDwAglgYBAAAAAZoGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAAB6wYBAAAAAQIAAACzAQAgZwAAzhQAIAMAAACzAQAgZwAAzhQAIGgAAM0UACABYAAAgxsAMBMDAAD2CgAgBgAAugsAIAgAAL0MACAMAACgCwAgEgAA8gsAIBkAAK4LACAbAACiCwAgIQAA-gsAIJMGAAC8DAAwlAYAAFEAEJUGAAC8DAAwlgYBAAAAAZoGAQDyCgAhmwYBAPEKACGcBgEA8goAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIesGAQAAAAECAAAAswEAIGAAAM0UACACAAAAyxQAIGAAAMwUACALkwYAAMoUADCUBgAAyxQAEJUGAADKFAAwlgYBAPEKACGaBgEA8goAIZsGAQDxCgAhnAYBAPIKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHrBgEA8QoAIQuTBgAAyhQAMJQGAADLFAAQlQYAAMoUADCWBgEA8QoAIZoGAQDyCgAhmwYBAPEKACGcBgEA8goAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIesGAQDxCgAhB5YGAQCADQAhmgYBAIENACGcBgEAgQ0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIesGAQCADQAhDgMAAJMPACAIAACSDwAgDAAAlA8AIBIAAJUPACAZAACWDwAgGwAAlw8AICEAAJgPACCWBgEAgA0AIZoGAQCBDQAhnAYBAIENACGdBgEAgA0AIZ4GQACCDQAhnwZAAIINACHrBgEAgA0AIQ4DAADjDwAgCAAA4g8AIAwAAOQPACASAADlDwAgGQAA5g8AIBsAAOcPACAhAADoDwAglgYBAAAAAZoGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAAB6wYBAAAAAREDAADcDgAgCAAA2w4AIAwAANUOACAPAADWDgAgIQAA2g4AICMAANcOACAlAADYDgAgJwAA2Q4AIJYGAQAAAAGXBgEAAAABmAYBAAAAAZkGAQAAAAGaBgEAAAABnAYBAAAAAZ0GAQAAAAGeBkAAAAABnwZAAAAAAQIAAACwAQAgZwAA2hQAIAMAAACwAQAgZwAA2hQAIGgAANkUACABYAAAghsAMBYDAAD2CgAgBgAAugsAIAgAALsMACAMAACgCwAgDwAA7wsAICEAAPoLACAjAADxCwAgJQAAsQsAICcAAPMLACCTBgAAvgwAMJQGAABfABCVBgAAvgwAMJYGAQAAAAGXBgEAAAABmAYBAAAAAZkGAQDxCgAhmgYBAPIKACGbBgEA8QoAIZwGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhAgAAALABACBgAADZFAAgAgAAANcUACBgAADYFAAgDZMGAADWFAAwlAYAANcUABCVBgAA1hQAMJYGAQDxCgAhlwYBAPEKACGYBgEA8QoAIZkGAQDxCgAhmgYBAPIKACGbBgEA8QoAIZwGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhDZMGAADWFAAwlAYAANcUABCVBgAA1hQAMJYGAQDxCgAhlwYBAPEKACGYBgEA8QoAIZkGAQDxCgAhmgYBAPIKACGbBgEA8QoAIZwGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhCZYGAQCADQAhlwYBAIANACGYBgEAgA0AIZkGAQCADQAhmgYBAIENACGcBgEAgA0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIREDAACLDQAgCAAAig0AIAwAAIQNACAPAACFDQAgIQAAiQ0AICMAAIYNACAlAACHDQAgJwAAiA0AIJYGAQCADQAhlwYBAIANACGYBgEAgA0AIZkGAQCADQAhmgYBAIENACGcBgEAgA0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIREDAADcDgAgCAAA2w4AIAwAANUOACAPAADWDgAgIQAA2g4AICMAANcOACAlAADYDgAgJwAA2Q4AIJYGAQAAAAGXBgEAAAABmAYBAAAAAZkGAQAAAAGaBgEAAAABnAYBAAAAAZ0GAQAAAAGeBkAAAAABnwZAAAAAAQYDAADpFAAglgYBAAAAAZ0GAQAAAAGeBkAAAAABnwZAAAAAAaYHAAAA8gcCAgAAAA0AIGcAAOgUACADAAAADQAgZwAA6BQAIGgAAOYUACABYAAAgRsAMAsDAAD2CgAgBgAAugsAIJMGAAD3DAAwlAYAAAsAEJUGAAD3DAAwlgYBAAAAAZsGAQDxCgAhnQYBAAAAAZ4GQAD1CgAhnwZAAPUKACGmBwAA-AzyByICAAAADQAgYAAA5hQAIAIAAADjFAAgYAAA5BQAIAmTBgAA4hQAMJQGAADjFAAQlQYAAOIUADCWBgEA8QoAIZsGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhpgcAAPgM8gciCZMGAADiFAAwlAYAAOMUABCVBgAA4hQAMJYGAQDxCgAhmwYBAPEKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACGmBwAA-AzyByIFlgYBAIANACGdBgEAgA0AIZ4GQACCDQAhnwZAAIINACGmBwAA5RTyByIBgAgAAADyBwIGAwAA5xQAIJYGAQCADQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAhpgcAAOUU8gciBWcAAPwaACBoAAD_GgAg_QcAAP0aACD-BwAA_hoAIIMIAACaAwAgBgMAAOkUACCWBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAABpgcAAADyBwIDZwAA_BoAIP0HAAD9GgAggwgAAJoDACANCAAAzBEAIAkAAPQUACAMAADNEQAgDwAAzhEAIJYGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABgQcCAAAAAYcHAQAAAAHPBwEAAAAB0AcBAAAAAQIAAAAgACBnAADzFAAgAwAAACAAIGcAAPMUACBoAADxFAAgAWAAAPsaADACAAAAIAAgYAAA8RQAIAIAAACxEQAgYAAA8BQAIAmWBgEAgA0AIZwGAQCADQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhgQcCALYQACGHBwEAgQ0AIc8HAQCADQAh0AcBAIANACENCAAAtREAIAkAAPIUACAMAAC2EQAgDwAAtxEAIJYGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGBBwIAthAAIYcHAQCBDQAhzwcBAIANACHQBwEAgA0AIQdnAAD2GgAgaAAA-RoAIP0HAAD3GgAg_gcAAPgaACCBCAAAGgAggggAABoAIIMIAAAcACANCAAAzBEAIAkAAPQUACAMAADNEQAgDwAAzhEAIJYGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABgQcCAAAAAYcHAQAAAAHPBwEAAAAB0AcBAAAAAQNnAAD2GgAg_QcAAPcaACCDCAAAHAAgDwgAAN4QACAMAADaEAAgDwAA2xAAIBoAAI4RACAjAADcEAAgKQAA3xAAIJYGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfYGAgAAAAH3BgEAAAAB-AYBAAAAAQIAAAA0ACBnAAD9FAAgAwAAADQAIGcAAP0UACBoAAD8FAAgAWAAAPUaADACAAAANAAgYAAA_BQAIAIAAAC0EAAgYAAA-xQAIAmWBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIe8GAQCADQAh9QYBAIENACH2BgIAthAAIfcGAQCADQAh-AYBAIENACEPCAAAvBAAIAwAALgQACAPAAC5EAAgGgAAjREAICMAALoQACApAAC9EAAglgYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIfUGAQCBDQAh9gYCALYQACH3BgEAgA0AIfgGAQCBDQAhDwgAAN4QACAMAADaEAAgDwAA2xAAIBoAAI4RACAjAADcEAAgKQAA3xAAIJYGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfYGAgAAAAH3BgEAAAAB-AYBAAAAAQksAACVFQAglgYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAdEHAQAAAAHSBwEAAAAB0wcCAAAAAdUHAAAA1QcCAgAAANoBACBnAACUFQAgAwAAANoBACBnAACUFQAgaAAAiRUAIAFgAAD0GgAwDgYAALoLACAsAAD3CwAgkwYAALgMADCUBgAA2AEAEJUGAAC4DAAwlgYBAAAAAZsGAQDxCgAhngZAAPUKACGfBkAA9QoAIe8GAQDyCgAh0QcBAPEKACHSBwEA8QoAIdMHAgCsDAAh1QcAALkM1QciAgAAANoBACBgAACJFQAgAgAAAIYVACBgAACHFQAgDJMGAACFFQAwlAYAAIYVABCVBgAAhRUAMJYGAQDxCgAhmwYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh7wYBAPIKACHRBwEA8QoAIdIHAQDxCgAh0wcCAKwMACHVBwAAuQzVByIMkwYAAIUVADCUBgAAhhUAEJUGAACFFQAwlgYBAPEKACGbBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8goAIdEHAQDxCgAh0gcBAPEKACHTBwIArAwAIdUHAAC5DNUHIgiWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHvBgEAgQ0AIdEHAQCADQAh0gcBAIANACHTBwIAiQ8AIdUHAACIFdUHIgGACAAAANUHAgksAACKFQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAh7wYBAIENACHRBwEAgA0AIdIHAQCADQAh0wcCAIkPACHVBwAAiBXVByILZwAAixUAMGgAAI8VADD9BwAAjBUAMP4HAACNFQAw_wcAAI4VACCACAAAuQ4AMIEIAAC5DgAwgggAALkOADCDCAAAuQ4AMIQIAACQFQAwhQgAALwOADAOBgAAxw4AIAgAAMgOACAmAAD5EAAgKwAAxQ4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB1AYBAAAAAe8GAQAAAAH1BgEAAAAB_AYBAAAAAf0GAQAAAAECAAAAKQAgZwAAkxUAIAMAAAApACBnAACTFQAgaAAAkhUAIAFgAADzGgAwAgAAACkAIGAAAJIVACACAAAAvQ4AIGAAAJEVACAKlgYBAIANACGbBgEAgQ0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIdQGAQCADQAh7wYBAIANACH1BgEAgQ0AIfwGAQCBDQAh_QYBAIANACEOBgAAwg4AIAgAAMMOACAmAAD3EAAgKwAAwA4AIJYGAQCADQAhmwYBAIENACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHUBgEAgA0AIe8GAQCADQAh9QYBAIENACH8BgEAgQ0AIf0GAQCADQAhDgYAAMcOACAIAADIDgAgJgAA-RAAICsAAMUOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAdQGAQAAAAHvBgEAAAAB9QYBAAAAAfwGAQAAAAH9BgEAAAABCSwAAJUVACCWBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB0QcBAAAAAdIHAQAAAAHTBwIAAAAB1QcAAADVBwIEZwAAixUAMP0HAACMFQAw_wcAAI4VACCDCAAAuQ4AMAgIAACtFQAgKAAArhUAIJYGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAQIAAACrAQAgZwAArBUAIAMAAACrAQAgZwAArBUAIGgAAKAVACABYAAA8hoAMA0GAAC6CwAgCAAAvQwAICgAAJ8LACCTBgAAvwwAMJQGAACBAQAQlQYAAL8MADCWBgEAAAABmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8QoAIfUGAQDyCgAhAgAAAKsBACBgAACgFQAgAgAAAJ4VACBgAACfFQAgCpMGAACdFQAwlAYAAJ4VABCVBgAAnRUAMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8QoAIfUGAQDyCgAhCpMGAACdFQAwlAYAAJ4VABCVBgAAnRUAMJYGAQDxCgAhmwYBAPEKACGcBgEA8goAIZ4GQAD1CgAhnwZAAPUKACHvBgEA8QoAIfUGAQDyCgAhBpYGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAh7wYBAIANACH1BgEAgQ0AIQgIAAChFQAgKAAAohUAIJYGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAh7wYBAIANACH1BgEAgQ0AIQdnAADsGgAgaAAA8BoAIP0HAADtGgAg_gcAAO8aACCBCAAAFQAggggAABUAIIMIAAAXACALZwAAoxUAMGgAAKcVADD9BwAApBUAMP4HAAClFQAw_wcAAKYVACCACAAAsBAAMIEIAACwEAAwgggAALAQADCDCAAAsBAAMIQIAACoFQAwhQgAALMQADAPBgAA3RAAIAgAAN4QACAMAADaEAAgDwAA2xAAIBoAAI4RACAjAADcEAAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfYGAgAAAAH3BgEAAAABAgAAADQAIGcAAKsVACADAAAANAAgZwAAqxUAIGgAAKoVACABYAAA7hoAMAIAAAA0ACBgAACqFQAgAgAAALQQACBgAACpFQAgCZYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIfUGAQCBDQAh9gYCALYQACH3BgEAgA0AIQ8GAAC7EAAgCAAAvBAAIAwAALgQACAPAAC5EAAgGgAAjREAICMAALoQACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAh7wYBAIANACH1BgEAgQ0AIfYGAgC2EAAh9wYBAIANACEPBgAA3RAAIAgAAN4QACAMAADaEAAgDwAA2xAAIBoAAI4RACAjAADcEAAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfYGAgAAAAH3BgEAAAABCAgAAK0VACAoAACuFQAglgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAe8GAQAAAAH1BgEAAAABA2cAAOwaACD9BwAA7RoAIIMIAAAXACAEZwAAoxUAMP0HAACkFQAw_wcAAKYVACCDCAAAsBAAMA0IAADSEQAgDAAA0BEAIA4AAM8RACCWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABxwYBAAAAAfUGAQAAAAH_BgEAAAABgAdAAAAAAYEHCAAAAAGCBwgAAAABAgAAABwAIGcAALoVACADAAAAHAAgZwAAuhUAIGgAALkVACABYAAA6xoAMBIGAAC6CwAgCAAAuwwAIAwAAKALACAOAADrCwAgkwYAAPIMADCUBgAAGgAQlQYAAPIMADCWBgEAAAABmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHHBgEA8QoAIfUGAQDyCgAh_wYBAPIKACGAB0AAnwwAIYEHCADIDAAhggcIAMgMACECAAAAHAAgYAAAuRUAIAIAAAC3FQAgYAAAuBUAIA6TBgAAthUAMJQGAAC3FQAQlQYAALYVADCWBgEA8QoAIZsGAQDxCgAhnAYBAPEKACGeBkAA9QoAIZ8GQAD1CgAhxwYBAPEKACH1BgEA8goAIf8GAQDyCgAhgAdAAJ8MACGBBwgAyAwAIYIHCADIDAAhDpMGAAC2FQAwlAYAALcVABCVBgAAthUAMJYGAQDxCgAhmwYBAPEKACGcBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHHBgEA8QoAIfUGAQDyCgAh_wYBAPIKACGAB0AAnwwAIYEHCADIDAAhggcIAMgMACEKlgYBAIANACGcBgEAgA0AIZ4GQACCDQAhnwZAAIINACHHBgEAgA0AIfUGAQCBDQAh_wYBAIENACGAB0AAmA0AIYEHCACxDQAhggcIALENACENCAAAnxEAIAwAAJ0RACAOAACcEQAglgYBAIANACGcBgEAgA0AIZ4GQACCDQAhnwZAAIINACHHBgEAgA0AIfUGAQCBDQAh_wYBAIENACGAB0AAmA0AIYEHCACxDQAhggcIALENACENCAAA0hEAIAwAANARACAOAADPEQAglgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAccGAQAAAAH1BgEAAAAB_wYBAAAAAYAHQAAAAAGBBwgAAAABggcIAAAAAQc7AACeFwAglgYBAAAAAZ4GQAAAAAGfBkAAAAAB9QYBAAAAAboHAQAAAAHNBwEAAAABAgAAABEAIGcAAJ0XACADAAAAEQAgZwAAnRcAIGgAAMUVACABYAAA6hoAMAwGAAC3DAAgOwAA9gwAIJMGAAD1DAAwlAYAAA8AEJUGAAD1DAAwlgYBAAAAAZsGAQDyCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhugcBAPIKACHNBwEA8QoAIQIAAAARACBgAADFFQAgAgAAAMMVACBgAADEFQAgCpMGAADCFQAwlAYAAMMVABCVBgAAwhUAMJYGAQDxCgAhmwYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh9QYBAPIKACG6BwEA8goAIc0HAQDxCgAhCpMGAADCFQAwlAYAAMMVABCVBgAAwhUAMJYGAQDxCgAhmwYBAPIKACGeBkAA9QoAIZ8GQAD1CgAh9QYBAPIKACG6BwEA8goAIc0HAQDxCgAhBpYGAQCADQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhugcBAIENACHNBwEAgA0AIQc7AADGFQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACG6BwEAgQ0AIc0HAQCADQAhC2cAAMcVADBoAADMFQAw_QcAAMgVADD-BwAAyRUAMP8HAADKFQAggAgAAMsVADCBCAAAyxUAMIIIAADLFQAwgwgAAMsVADCECAAAzRUAMIUIAADOFQAwGAsAAJkXACAMAACRFwAgDwAAkhcAIBsAAJgXACAoAACOFwAgKgAAlxcAICwAAJoXACAwAACLFwAgMQAAjBcAIDIAAI0XACAzAACPFwAgNAAAkBcAIDUAAJMXACA2AACUFwAgNwAAlRcAIDgAAJYXACA5AACbFwAgOgAAnBcAIJYGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAG6BwEAAAABzQcBAAAAAQIAAAAXACBnAACKFwAgAwAAABcAIGcAAIoXACBoAADRFQAgAWAAAOkaADAdBwAA9AwAIAsAAJ4LACAMAACgCwAgDwAA7wsAIBsAAKILACAoAACfCwAgKgAAoQsAICwAAPcLACAwAADoCwAgMQAA6QsAIDIAAOsLACAzAADtCwAgNAAA7gsAIDUAALELACA2AADxCwAgNwAA8gsAIDgAAPMLACA5AAD6CwAgOgAA-wsAIJMGAADzDAAwlAYAABUAEJUGAADzDAAwlgYBAAAAAZ4GQAD1CgAhnwZAAPUKACH1BgEA8goAIYYHAQDyCgAhugcBAPIKACHNBwEA8QoAIQIAAAAXACBgAADRFQAgAgAAAM8VACBgAADQFQAgCpMGAADOFQAwlAYAAM8VABCVBgAAzhUAMJYGAQDxCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhhgcBAPIKACG6BwEA8goAIc0HAQDxCgAhCpMGAADOFQAwlAYAAM8VABCVBgAAzhUAMJYGAQDxCgAhngZAAPUKACGfBkAA9QoAIfUGAQDyCgAhhgcBAPIKACG6BwEA8goAIc0HAQDxCgAhBpYGAQCADQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhugcBAIENACHNBwEAgA0AIRgLAADgFQAgDAAA2BUAIA8AANkVACAbAADfFQAgKAAA1RUAICoAAN4VACAsAADhFQAgMAAA0hUAIDEAANMVACAyAADUFQAgMwAA1hUAIDQAANcVACA1AADaFQAgNgAA2xUAIDcAANwVACA4AADdFQAgOQAA4hUAIDoAAOMVACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIboHAQCBDQAhzQcBAIANACELZwAAgRcAMGgAAIUXADD9BwAAghcAMP4HAACDFwAw_wcAAIQXACCACAAAsxUAMIEIAACzFQAwgggAALMVADCDCAAAsxUAMIQIAACGFwAwhQgAALYVADALZwAA9hYAMGgAAPoWADD9BwAA9xYAMP4HAAD4FgAw_wcAAPkWACCACAAAmhUAMIEIAACaFQAwgggAAJoVADCDCAAAmhUAMIQIAAD7FgAwhQgAAJ0VADALZwAA7RYAMGgAAPEWADD9BwAA7hYAMP4HAADvFgAw_wcAAPAWACCACAAArREAMIEIAACtEQAwgggAAK0RADCDCAAArREAMIQIAADyFgAwhQgAALARADALZwAA5BYAMGgAAOgWADD9BwAA5RYAMP4HAADmFgAw_wcAAOcWACCACAAAsBAAMIEIAACwEAAwgggAALAQADCDCAAAsBAAMIQIAADpFgAwhQgAALMQADALZwAA2xYAMGgAAN8WADD9BwAA3BYAMP4HAADdFgAw_wcAAN4WACCACAAA0xQAMIEIAADTFAAwgggAANMUADCDCAAA0xQAMIQIAADgFgAwhQgAANYUADALZwAA0hYAMGgAANYWADD9BwAA0xYAMP4HAADUFgAw_wcAANUWACCACAAAxxQAMIEIAADHFAAwgggAAMcUADCDCAAAxxQAMIQIAADXFgAwhQgAAMoUADALZwAAyRYAMGgAAM0WADD9BwAAyhYAMP4HAADLFgAw_wcAAMwWACCACAAAkA4AMIEIAACQDgAwgggAAJAOADCDCAAAkA4AMIQIAADOFgAwhQgAAJMOADALZwAAwBYAMGgAAMQWADD9BwAAwRYAMP4HAADCFgAw_wcAAMMWACCACAAA_A0AMIEIAAD8DQAwgggAAPwNADCDCAAA_A0AMIQIAADFFgAwhQgAAP8NADALZwAAtxYAMGgAALsWADD9BwAAuBYAMP4HAAC5FgAw_wcAALoWACCACAAAvg0AMIEIAAC-DQAwgggAAL4NADCDCAAAvg0AMIQIAAC8FgAwhQgAAMENADALZwAArhYAMGgAALIWADD9BwAArxYAMP4HAACwFgAw_wcAALEWACCACAAA1Q0AMIEIAADVDQAwgggAANUNADCDCAAA1Q0AMIQIAACzFgAwhQgAANgNADALZwAApRYAMGgAAKkWADD9BwAAphYAMP4HAACnFgAw_wcAAKgWACCACAAA5Q0AMIEIAADlDQAwgggAAOUNADCDCAAA5Q0AMIQIAACqFgAwhQgAAOgNADALZwAAnBYAMGgAAKAWADD9BwAAnRYAMP4HAACeFgAw_wcAAJ8WACCACAAAqw0AMIEIAACrDQAwgggAAKsNADCDCAAAqw0AMIQIAAChFgAwhQgAAK4NADALZwAAkxYAMGgAAJcWADD9BwAAlBYAMP4HAACVFgAw_wcAAJYWACCACAAAjBAAMIEIAACMEAAwgggAAIwQADCDCAAAjBAAMIQIAACYFgAwhQgAAI8QADALZwAAihYAMGgAAI4WADD9BwAAixYAMP4HAACMFgAw_wcAAI0WACCACAAAqA8AMIEIAACoDwAwgggAAKgPADCDCAAAqA8AMIQIAACPFgAwhQgAAKsPADALZwAAgRYAMGgAAIUWADD9BwAAghYAMP4HAACDFgAw_wcAAIQWACCACAAA5BAAMIEIAADkEAAwgggAAOQQADCDCAAA5BAAMIQIAACGFgAwhQgAAOcQADALZwAA-BUAMGgAAPwVADD9BwAA-RUAMP4HAAD6FQAw_wcAAPsVACCACAAAuQ4AMIEIAAC5DgAwgggAALkOADCDCAAAuQ4AMIQIAAD9FQAwhQgAALwOADALZwAA7xUAMGgAAPMVADD9BwAA8BUAMP4HAADxFQAw_wcAAPIVACCACAAAkA0AMIEIAACQDQAwgggAAJANADCDCAAAkA0AMIQIAAD0FQAwhQgAAJMNADALZwAA5BUAMGgAAOgVADD9BwAA5RUAMP4HAADmFQAw_wcAAOcVACCACAAAjRMAMIEIAACNEwAwgggAAI0TADCDCAAAjRMAMIQIAADpFQAwhQgAAJATADAHAwAAlxMAIAYAAO4VACCWBgEAAAABmwYBAAAAAZ0GAQAAAAGeBkAAAAABnwZAAAAAAQIAAAABACBnAADtFQAgAwAAAAEAIGcAAO0VACBoAADrFQAgAWAAAOgaADACAAAAAQAgYAAA6xUAIAIAAACREwAgYAAA6hUAIAWWBgEAgA0AIZsGAQCADQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAhBwMAAJQTACAGAADsFQAglgYBAIANACGbBgEAgA0AIZ0GAQCADQAhngZAAIINACGfBkAAgg0AIQVnAADjGgAgaAAA5hoAIP0HAADkGgAg_gcAAOUaACCDCAAAnQUAIAcDAACXEwAgBgAA7hUAIJYGAQAAAAGbBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAABA2cAAOMaACD9BwAA5BoAIIMIAACdBQAgFRAAAKMPACAXAACkDQAgGAAApQ0AIB0AAKENACAeAACiDQAgHwAAow0AIJYGAQAAAAGeBkAAAAABnwZAAAAAAcAGAQAAAAHCBgEAAAABzgYAAACsBwLQBkAAAAAB0wYBAAAAAaoHAAAAqgcCrAcBAAAAAa0HAQAAAAGuBwEAAAABsAcBAAAAAbEHAQAAAAGyB0AAAAABAgAAAFsAIGcAAPcVACADAAAAWwAgZwAA9xUAIGgAAPYVACABYAAA4hoAMAIAAABbACBgAAD2FQAgAgAAAJQNACBgAAD1FQAgD5YGAQCADQAhngZAAIINACGfBkAAgg0AIcAGAQCBDQAhwgYBAIENACHOBgAAlw2sByLQBkAAmA0AIdMGAQCBDQAhqgcAAJYNqgcirAcBAIANACGtBwEAgA0AIa4HAQCADQAhsAcBAIENACGxBwEAgQ0AIbIHQACCDQAhFRAAAKEPACAXAACdDQAgGAAAng0AIB0AAJoNACAeAACbDQAgHwAAnA0AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcAGAQCBDQAhwgYBAIENACHOBgAAlw2sByLQBkAAmA0AIdMGAQCBDQAhqgcAAJYNqgcirAcBAIANACGtBwEAgA0AIa4HAQCADQAhsAcBAIENACGxBwEAgQ0AIbIHQACCDQAhFRAAAKMPACAXAACkDQAgGAAApQ0AIB0AAKENACAeAACiDQAgHwAAow0AIJYGAQAAAAGeBkAAAAABnwZAAAAAAcAGAQAAAAHCBgEAAAABzgYAAACsBwLQBkAAAAAB0wYBAAAAAaoHAAAAqgcCrAcBAAAAAa0HAQAAAAGuBwEAAAABsAcBAAAAAbEHAQAAAAGyB0AAAAABDgYAAMcOACAmAAD5EAAgKwAAxQ4AIC0AAMYOACCWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAAB1AYBAAAAAe8GAQAAAAH1BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAABAgAAACkAIGcAAIAWACADAAAAKQAgZwAAgBYAIGgAAP8VACABYAAA4RoAMAIAAAApACBgAAD_FQAgAgAAAL0OACBgAAD-FQAgCpYGAQCADQAhmwYBAIENACGeBkAAgg0AIZ8GQACCDQAh1AYBAIANACHvBgEAgA0AIfUGAQCBDQAh_AYBAIENACH9BgEAgA0AIf4GAQCADQAhDgYAAMIOACAmAAD3EAAgKwAAwA4AIC0AAMEOACCWBgEAgA0AIZsGAQCBDQAhngZAAIINACGfBkAAgg0AIdQGAQCADQAh7wYBAIANACH1BgEAgQ0AIfwGAQCBDQAh_QYBAIANACH-BgEAgA0AIQ4GAADHDgAgJgAA-RAAICsAAMUOACAtAADGDgAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAdQGAQAAAAHvBgEAAAAB9QYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAQ0GAAD8EAAgCgAA-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_ACBnAAC2FgAgaAAAtRYAIAFgAADbGgAwAgAAAD8AIGAAALUWACACAAAA2Q0AIGAAALQWACAKlgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIcAGAQCADQAhxwYBAIANACHIBgEAgQ0AIcoGAADbDcoGIssGQACYDQAhDgYAAN4NACANAADdDQAgEAAA9Q4AICIAAOANACCWBgEAgA0AIZsGAQCADQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhwAYBAIANACHHBgEAgA0AIcgGAQCBDQAhygYAANsNygYiywZAAJgNACEOBgAA9Q0AIA0AAPQNACAQAAD2DgAgIgAA9w0AIJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABwAYBAAAAAccGAQAAAAHIBgEAAAABygYAAADKBgLLBkAAAAABEgYAAM8NACAQAAD7DgAgFQAAzA0AIBcAAM4NACAkAADNDQAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAdMGAQAAAAECAAAAawAgZwAAvxYAIAMAAABrACBnAAC_FgAgaAAAvhYAIAFgAADaGgAwAgAAAGsAIGAAAL4WACACAAAAwg0AIGAAAL0WACANlgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACGrBgEAgA0AIcAGAQCBDQAhzAYBAIENACHOBgAAxA3OBiLPBgEAgQ0AIdAGQACYDQAh0QZAAIINACHSBgEAgA0AIdMGAQCBDQAhEgYAAMkNACAQAAD6DgAgFQAAxg0AIBcAAMgNACAkAADHDQAglgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACGrBgEAgA0AIcAGAQCBDQAhzAYBAIENACHOBgAAxA3OBiLPBgEAgQ0AIdAGQACYDQAh0QZAAIINACHSBgEAgA0AIdMGAQCBDQAhEgYAAM8NACAQAAD7DgAgFQAAzA0AIBcAAM4NACAkAADNDQAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAdMGAQAAAAELBgAAig4AIA0AAIgOACAOAACJDgAgEAAA7A4AIJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAAcAGAQAAAAECAAAAOQAgZwAAyBYAIAMAAAA5ACBnAADIFgAgaAAAxxYAIAFgAADZGgAwAgAAADkAIGAAAMcWACACAAAAgA4AIGAAAMYWACAHlgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIb8GAQCADQAhwAYBAIANACELBgAAhQ4AIA0AAIMOACAOAACEDgAgEAAA6w4AIJYGAQCADQAhmwYBAIANACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACG_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_QcAAM8aACD-BwAA0BoAIIMIAACdBQAgCAYAAIAXACAoAACuFQAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAe8GAQAAAAH1BgEAAAABA2cAAM4aACD9BwAAzxoAIIMIAACdBQAgDQYAANERACAMAADQEQAgDgAAzxEAIJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHHBgEAAAAB9QYBAAAAAf8GAQAAAAGAB0AAAAABgQcIAAAAAYIHCAAAAAECAAAAHAAgZwAAiRcAIAMAAAAcACBnAACJFwAgaAAAiBcAIAFgAADNGgAwAgAAABwAIGAAAIgXACACAAAAtxUAIGAAAIcXACAKlgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACHHBgEAgA0AIfUGAQCBDQAh_wYBAIENACGAB0AAmA0AIYEHCACxDQAhggcIALENACENBgAAnhEAIAwAAJ0RACAOAACcEQAglgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACHHBgEAgA0AIfUGAQCBDQAh_wYBAIENACGAB0AAmA0AIYEHCACxDQAhggcIALENACENBgAA0REAIAwAANARACAOAADPEQAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAccGAQAAAAH1BgEAAAAB_wYBAAAAAYAHQAAAAAGBBwgAAAABggcIAAAAARgLAACZFwAgDAAAkRcAIA8AAJIXACAbAACYFwAgKAAAjhcAICoAAJcXACAsAACaFwAgMAAAixcAIDEAAIwXACAyAACNFwAgMwAAjxcAIDQAAJAXACA1AACTFwAgNgAAlBcAIDcAAJUXACA4AACWFwAgOQAAmxcAIDoAAJwXACCWBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABugcBAAAAAc0HAQAAAAEEZwAAgRcAMP0HAACCFwAw_wcAAIQXACCDCAAAsxUAMARnAAD2FgAw_QcAAPcWADD_BwAA-RYAIIMIAACaFQAwBGcAAO0WADD9BwAA7hYAMP8HAADwFgAggwgAAK0RADAEZwAA5BYAMP0HAADlFgAw_wcAAOcWACCDCAAAsBAAMARnAADbFgAw_QcAANwWADD_BwAA3hYAIIMIAADTFAAwBGcAANIWADD9BwAA0xYAMP8HAADVFgAggwgAAMcUADAEZwAAyRYAMP0HAADKFgAw_wcAAMwWACCDCAAAkA4AMARnAADAFgAw_QcAAMEWADD_BwAAwxYAIIMIAAD8DQAwBGcAALcWADD9BwAAuBYAMP8HAAC6FgAggwgAAL4NADAEZwAArhYAMP0HAACvFgAw_wcAALEWACCDCAAA1Q0AMARnAAClFgAw_QcAAKYWADD_BwAAqBYAIIMIAADlDQAwBGcAAJwWADD9BwAAnRYAMP8HAACfFgAggwgAAKsNADAEZwAAkxYAMP0HAACUFgAw_wcAAJYWACCDCAAAjBAAMARnAACKFgAw_QcAAIsWADD_BwAAjRYAIIMIAACoDwAwBGcAAIEWADD9BwAAghYAMP8HAACEFgAggwgAAOQQADAEZwAA-BUAMP0HAAD5FQAw_wcAAPsVACCDCAAAuQ4AMARnAADvFQAw_QcAAPAVADD_BwAA8hUAIIMIAACQDQAwBGcAAOQVADD9BwAA5RUAMP8HAADnFQAggwgAAI0TADAHOwAAnhcAIJYGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAG6BwEAAAABzQcBAAAAAQRnAADHFQAw_QcAAMgVADD_BwAAyhUAIIMIAADLFQAwBGcAALsVADD9BwAAvBUAMP8HAAC-FQAggwgAAL8VADAEZwAArxUAMP0HAACwFQAw_wcAALIVACCDCAAAsxUAMARnAACWFQAw_QcAAJcVADD_BwAAmRUAIIMIAACaFQAwBGcAAP4UADD9BwAA_xQAMP8HAACBFQAggwgAAIIVADAEZwAA9RQAMP0HAAD2FAAw_wcAAPgUACCDCAAAsBAAMARnAADqFAAw_QcAAOsUADD_BwAA7RQAIIMIAACtEQAwBGcAANsUADD9BwAA3BQAMP8HAADeFAAggwgAAN8UADAEZwAAzxQAMP0HAADQFAAw_wcAANIUACCDCAAA0xQAMARnAADDFAAw_QcAAMQUADD_BwAAxhQAIIMIAADHFAAwBGcAALoUADD9BwAAuxQAMP8HAAC9FAAggwgAAJAOADAEZwAAsRQAMP0HAACyFAAw_wcAALQUACCDCAAA_A0AMARnAAClFAAw_QcAAKYUADD_BwAAqBQAIIMIAACpFAAwBGcAAJwUADD9BwAAnRQAMP8HAACfFAAggwgAAL4NADAEZwAAkxQAMP0HAACUFAAw_wcAAJYUACCDCAAA1Q0AMARnAACKFAAw_QcAAIsUADD_BwAAjRQAIIMIAADlDQAwBGcAAIEUADD9BwAAghQAMP8HAACEFAAggwgAAKsNADAEZwAA-BMAMP0HAAD5EwAw_wcAAPsTACCDCAAAjBAAMARnAADvEwAw_QcAAPATADD_BwAA8hMAIIMIAACoDwAwA2cAAOoTACD9BwAA6xMAIIMIAADzBgAgBGcAAN4TADD9BwAA3xMAMP8HAADhEwAggwgAAOITADAEZwAA1RMAMP0HAADWEwAw_wcAANgTACCDCAAA3hIAMARnAADMEwAw_QcAAM0TADD_BwAAzxMAIIMIAADkEAAwBGcAAMMTADD9BwAAxBMAMP8HAADGEwAggwgAALkOADAEZwAAtxMAMP0HAAC4EwAw_wcAALoTACCDCAAAuxMAMARnAACrEwAw_QcAAKwTADD_BwAArhMAIIMIAACvEwAwBGcAAKITADD9BwAAoxMAMP8HAAClEwAggwgAAJANADAEZwAAmRMAMP0HAACaEwAw_wcAAJwTACCDCAAAkA0AMARnAACJEwAw_QcAAIoTADD_BwAAjBMAIIMIAACNEwAwAAAAAAAAAAAAAAAAAAIGAACCEgAgmgcAAPwMACAAAAAAAAAAAAAAB2cAAMgaACBoAADLGgAg_QcAAMkaACD-BwAAyhoAIIEIAAATACCCCAAAEwAggwgAAJ0FACADZwAAyBoAIP0HAADJGgAggwgAAJ0FACAAAAAHZwAAwxoAIGgAAMYaACD9BwAAxBoAIP4HAADFGgAggQgAAA8AIIIIAAAPACCDCAAAEQAgA2cAAMMaACD9BwAAxBoAIIMIAAARACAAAAAAAAAAAAAAAAAABWcAAL4aACBoAADBGgAg_QcAAL8aACD-BwAAwBoAIIMIAACdBQAgA2cAAL4aACD9BwAAvxoAIIMIAACdBQAgAAAAAAAABWcAALkaACBoAAC8GgAg_QcAALoaACD-BwAAuxoAIIMIAACaAwAgA2cAALkaACD9BwAAuhoAIIMIAACaAwAgAAAAAAAABWcAALQaACBoAAC3GgAg_QcAALUaACD-BwAAthoAIIMIAACaAwAgA2cAALQaACD9BwAAtRoAIIMIAACaAwAgAAAABWcAAK8aACBoAACyGgAg_QcAALAaACD-BwAAsRoAIIMIAACaAwAgA2cAAK8aACD9BwAAsBoAIIMIAACaAwAgAAAAC2cAAMoZADBoAADPGQAw_QcAAMsZADD-BwAAzBkAMP8HAADNGQAggAgAAM4ZADCBCAAAzhkAMIIIAADOGQAwgwgAAM4ZADCECAAA0BkAMIUIAADRGQAwC2cAAL4ZADBoAADDGQAw_QcAAL8ZADD-BwAAwBkAMP8HAADBGQAggAgAAMIZADCBCAAAwhkAMIIIAADCGQAwgwgAAMIZADCECAAAxBkAMIUIAADFGQAwC2cAALMZADBoAAC3GQAw_QcAALQZADD-BwAAtRkAMP8HAAC2GQAggAgAAN8UADCBCAAA3xQAMIIIAADfFAAwgwgAAN8UADCECAAAuBkAMIUIAADiFAAwC2cAAKoZADBoAACuGQAw_QcAAKsZADD-BwAArBkAMP8HAACtGQAggAgAANMUADCBCAAA0xQAMIIIAADTFAAwgwgAANMUADCECAAArxkAMIUIAADWFAAwC2cAAKEZADBoAAClGQAw_QcAAKIZADD-BwAAoxkAMP8HAACkGQAggAgAAMcUADCBCAAAxxQAMIIIAADHFAAwgwgAAMcUADCECAAAphkAMIUIAADKFAAwC2cAAJgZADBoAACcGQAw_QcAAJkZADD-BwAAmhkAMP8HAACbGQAggAgAAKkUADCBCAAAqRQAMIIIAACpFAAwgwgAAKkUADCECAAAnRkAMIUIAACsFAAwC2cAAI8ZADBoAACTGQAw_QcAAJAZADD-BwAAkRkAMP8HAACSGQAggAgAAKkUADCBCAAAqRQAMIIIAACpFAAwgwgAAKkUADCECAAAlBkAMIUIAACsFAAwC2cAAIYZADBoAACKGQAw_QcAAIcZADD-BwAAiBkAMP8HAACJGQAggAgAAL4NADCBCAAAvg0AMIIIAAC-DQAwgwgAAL4NADCECAAAixkAMIUIAADBDQAwC2cAAP0YADBoAACBGQAw_QcAAP4YADD-BwAA_xgAMP8HAACAGQAggAgAAL4NADCBCAAAvg0AMIIIAAC-DQAwgwgAAL4NADCECAAAghkAMIUIAADBDQAwB2cAAPgYACBoAAD7GAAg_QcAAPkYACD-BwAA-hgAIIEIAAC1AgAggggAALUCACCDCAAArwoAIAtnAADvGAAwaAAA8xgAMP0HAADwGAAw_gcAAPEYADD_BwAA8hgAIIAIAAC-DwAwgQgAAL4PADCCCAAAvg8AMIMIAAC-DwAwhAgAAPQYADCFCAAAwQ8AMAtnAADmGAAwaAAA6hgAMP0HAADnGAAw_gcAAOgYADD_BwAA6RgAIIAIAAC-DwAwgQgAAL4PADCCCAAAvg8AMIMIAAC-DwAwhAgAAOsYADCFCAAAwQ8AMAdnAADhGAAgaAAA5BgAIP0HAADiGAAg_gcAAOMYACCBCAAAuQIAIIIIAAC5AgAggwgAANEIACALZwAA1RgAMGgAANoYADD9BwAA1hgAMP4HAADXGAAw_wcAANgYACCACAAA2RgAMIEIAADZGAAwgggAANkYADCDCAAA2RgAMIQIAADbGAAwhQgAANwYADALZwAAzBgAMGgAANAYADD9BwAAzRgAMP4HAADOGAAw_wcAAM8YACCACAAAkA0AMIEIAACQDQAwgggAAJANADCDCAAAkA0AMIQIAADRGAAwhQgAAJMNADALZwAAwxgAMGgAAMcYADD9BwAAxBgAMP4HAADFGAAw_wcAAMYYACCACAAAkA0AMIEIAACQDQAwgggAAJANADCDCAAAkA0AMIQIAADIGAAwhQgAAJMNADALZwAAuhgAMGgAAL4YADD9BwAAuxgAMP4HAAC8GAAw_wcAAL0YACCACAAArxMAMIEIAACvEwAwgggAAK8TADCDCAAArxMAMIQIAAC_GAAwhQgAALITADALZwAAsRgAMGgAALUYADD9BwAAshgAMP4HAACzGAAw_wcAALQYACCACAAArxMAMIEIAACvEwAwgggAAK8TADCDCAAArxMAMIQIAAC2GAAwhQgAALITADALZwAAqBgAMGgAAKwYADD9BwAAqRgAMP4HAACqGAAw_wcAAKsYACCACAAAuxMAMIEIAAC7EwAwgggAALsTADCDCAAAuxMAMIQIAACtGAAwhQgAAL4TADALZwAAnxgAMGgAAKMYADD9BwAAoBgAMP4HAAChGAAw_wcAAKIYACCACAAApxIAMIEIAACnEgAwgggAAKcSADCDCAAApxIAMIQIAACkGAAwhQgAAKoSADALZwAAlhgAMGgAAJoYADD9BwAAlxgAMP4HAACYGAAw_wcAAJkYACCACAAAjRMAMIEIAACNEwAwgggAAI0TADCDCAAAjRMAMIQIAACbGAAwhQgAAJATADAHBgAA7hUAIAgAAJgTACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAQIAAAABACBnAACeGAAgAwAAAAEAIGcAAJ4YACBoAACdGAAgAWAAAK4aADACAAAAAQAgYAAAnRgAIAIAAACREwAgYAAAnBgAIAWWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAhBwYAAOwVACAIAACVEwAglgYBAIANACGbBgEAgA0AIZwGAQCADQAhngZAAIINACGfBkAAgg0AIQcGAADuFQAgCAAAmBMAIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABBEcAAJQSACCWBgEAAAABowcBAAAAAaQHQAAAAAECAAAAiAIAIGcAAKcYACADAAAAiAIAIGcAAKcYACBoAACmGAAgAWAAAK0aADACAAAAiAIAIGAAAKYYACACAAAAqxIAIGAAAKUYACADlgYBAIANACGjBwEAgA0AIaQHQACCDQAhBEcAAJISACCWBgEAgA0AIaMHAQCADQAhpAdAAIINACEERwAAlBIAIJYGAQAAAAGjBwEAAAABpAdAAAAAAQoGAAC7EgAgSAAAvRIAIEkAAL4SACCWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAABxwYBAAAAAcgGAQAAAAGoBwAAAKYHAgIAAACAAgAgZwAAsBgAIAMAAACAAgAgZwAAsBgAIGgAAK8YACABYAAArBoAMAIAAACAAgAgYAAArxgAIAIAAAC_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_tBiLPBgEAgQ0AIdAGQACYDQAh0QZAAIINACHSBgEAgA0AIdMGAQCBDQAhDhUAAMYPACAXAADIDwAgGAAA7A8AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcIGAQCBDQAhzAYBAIENACHOBgAAxA_tBiLPBgEAgQ0AIdAGQACYDQAh0QZAAIINACHSBgEAgA0AIdMGAQCBDQAhDhUAAMoPACAXAADMDwAgGAAA7Q8AIJYGAQAAAAGeBkAAAAABnwZAAAAAAcIGAQAAAAHMBgEAAAABzgYAAADtBgLPBgEAAAAB0AZAAAAAAdEGQAAAAAHSBgEAAAAB0wYBAAAAAQyWBgEAAAABngZAAAAAAZ8GQAAAAAGsBgEAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsAYAAOQOACCxBgAA5Q4AILIGgAAAAAGzBoAAAAABtAYgAAAAAQIAAACvCgAgZwAA-BgAIAMAAAC1AgAgZwAA-BgAIGgAAPwYACAOAAAAtQIAIGAAAPwYACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACGsBgEAgA0AIa0GAQCADQAhrgYBAIANACGvBgEAgQ0AIbAGAADgDgAgsQYAAOEOACCyBoAAAAABswaAAAAAAbQGIADiDgAhDJYGAQCADQAhngZAAIINACGfBkAAgg0AIawGAQCADQAhrQYBAIANACGuBgEAgA0AIa8GAQCBDQAhsAYAAOAOACCxBgAA4Q4AILIGgAAAAAGzBoAAAAABtAYgAOIOACESBgAAzw0AIAgAANANACAQAAD7DgAgFQAAzA0AICQAAM0NACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAQIAAABrACBnAACFGQAgAwAAAGsAIGcAAIUZACBoAACEGQAgAWAAAKQaADACAAAAawAgYAAAhBkAIAIAAADCDQAgYAAAgxkAIA2WBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhqwYBAIANACHABgEAgQ0AIcwGAQCBDQAhzgYAAMQNzgYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0gYBAIANACESBgAAyQ0AIAgAAMoNACAQAAD6DgAgFQAAxg0AICQAAMcNACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhqwYBAIANACHABgEAgQ0AIcwGAQCBDQAhzgYAAMQNzgYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0gYBAIANACESBgAAzw0AIAgAANANACAQAAD7DgAgFQAAzA0AICQAAM0NACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAARIGAADPDQAgCAAA0A0AIBAAAPsOACAVAADMDQAgFwAAzg0AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwAYBAAAAAcwGAQAAAAHOBgAAAM4GAs8GAQAAAAHQBkAAAAAB0QZAAAAAAdIGAQAAAAHTBgEAAAABAgAAAGsAIGcAAI4ZACADAAAAawAgZwAAjhkAIGgAAI0ZACABYAAAoxoAMAIAAABrACBgAACNGQAgAgAAAMINACBgAACMGQAgDZYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHABgEAgQ0AIcwGAQCBDQAhzgYAAMQNzgYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0gYBAIANACHTBgEAgQ0AIRIGAADJDQAgCAAAyg0AIBAAAPoOACAVAADGDQAgFwAAyA0AIJYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHABgEAgQ0AIcwGAQCBDQAhzgYAAMQNzgYizwYBAIENACHQBkAAmA0AIdEGQACCDQAh0gYBAIANACHTBgEAgQ0AIRIGAADPDQAgCAAA0A0AIBAAAPsOACAVAADMDQAgFwAAzg0AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwAYBAAAAAcwGAQAAAAHOBgAAAM4GAs8GAQAAAAHQBkAAAAAB0QZAAAAAAdIGAQAAAAHTBgEAAAABHQYAAOgSACA_AADmEgAgQgAA6RIAIJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAMwHAtAGQAAAAAH1BgEAAAABuAcBAAAAAbkHAQAAAAG6BwEAAAABvAcAAAC8BwO9BwEAAAABvgcAAADkBgO_BxAAAAABwAcBAAAAAcEHAgAAAAHCBwAAAIsHAsMHAQAAAAHEBwEAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHgAAAAAHKB0AAAAABzAcBAAAAAQIAAADlAQAgZwAAlxkAIAMAAADlAQAgZwAAlxkAIGgAAJYZACABYAAAohoAMAIAAADlAQAgYAAAlhkAIAIAAACtFAAgYAAAlRkAIBqWBgEAgA0AIZsGAQCBDQAhngZAAIINACGfBkAAgg0AIc4GAADVEswHItAGQACYDQAh9QYBAIENACG4BwEAgA0AIbkHAQCADQAhugcBAIENACG8BwAA0hK8ByO9BwEAgQ0AIb4HAADTEuQGI78HEADUEgAhwAcBAIANACHBBwIAthAAIcIHAAD6EYsHIsMHAQCBDQAhxAcBAIENACHFBwEAgQ0AIcYHAQCBDQAhxwcBAIENACHIBwEAgQ0AIckHgAAAAAHKB0AAmA0AIcwHAQCBDQAhHQYAANgSACA_AADWEgAgQgAA2RIAIJYGAQCADQAhmwYBAIENACGeBkAAgg0AIZ8GQACCDQAhzgYAANUSzAci0AZAAJgNACH1BgEAgQ0AIbgHAQCADQAhuQcBAIANACG6BwEAgQ0AIbwHAADSErwHI70HAQCBDQAhvgcAANMS5AYjvwcQANQSACHABwEAgA0AIcEHAgC2EAAhwgcAAPoRiwciwwcBAIENACHEBwEAgQ0AIcUHAQCBDQAhxgcBAIENACHHBwEAgQ0AIcgHAQCBDQAhyQeAAAAAAcoHQACYDQAhzAcBAIENACEdBgAA6BIAID8AAOYSACBCAADpEgAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAAzAcC0AZAAAAAAfUGAQAAAAG4BwEAAAABuQcBAAAAAboHAQAAAAG8BwAAALwHA70HAQAAAAG-BwAAAOQGA78HEAAAAAHABwEAAAABwQcCAAAAAcIHAAAAiwcCwwcBAAAAAcQHAQAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQeAAAAAAcoHQAAAAAHMBwEAAAABHQYAAOgSACBAAADnEgAgQgAA6RIAIJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAMwHAtAGQAAAAAH1BgEAAAABtwcBAAAAAbkHAQAAAAG6BwEAAAABvAcAAAC8BwO9BwEAAAABvgcAAADkBgO_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_QcAAJoaACCDCAAAnQUAIAyWBgEAAAABngZAAAAAAZ8GQAAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAAB3gcBAAAAAd8HQAAAAAHgB0AAAAAB4QcBAAAAAeIHAQAAAAECAAAACQAgZwAAyRkAIAMAAAAJACBnAADJGQAgaAAAyBkAIAFgAACYGgAwEQMAAPYKACCTBgAA-QwAMJQGAAAHABCVBgAA-QwAMJYGAQAAAAGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHaBwEA8QoAIdsHAQDxCgAh3AcBAPIKACHdBwEA8goAId4HAQDyCgAh3wdAAJ8MACHgB0AAnwwAIeEHAQDyCgAh4gcBAPIKACECAAAACQAgYAAAyBkAIAIAAADGGQAgYAAAxxkAIBCTBgAAxRkAMJQGAADGGQAQlQYAAMUZADCWBgEA8QoAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIdoHAQDxCgAh2wcBAPEKACHcBwEA8goAId0HAQDyCgAh3gcBAPIKACHfB0AAnwwAIeAHQACfDAAh4QcBAPIKACHiBwEA8goAIRCTBgAAxRkAMJQGAADGGQAQlQYAAMUZADCWBgEA8QoAIZ0GAQDxCgAhngZAAPUKACGfBkAA9QoAIdoHAQDxCgAh2wcBAPEKACHcBwEA8goAId0HAQDyCgAh3gcBAPIKACHfB0AAnwwAIeAHQACfDAAh4QcBAPIKACHiBwEA8goAIQyWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHaBwEAgA0AIdsHAQCADQAh3AcBAIENACHdBwEAgQ0AId4HAQCBDQAh3wdAAJgNACHgB0AAmA0AIeEHAQCBDQAh4gcBAIENACEMlgYBAIANACGeBkAAgg0AIZ8GQACCDQAh2gcBAIANACHbBwEAgA0AIdwHAQCBDQAh3QcBAIENACHeBwEAgQ0AId8HQACYDQAh4AdAAJgNACHhBwEAgQ0AIeIHAQCBDQAhDJYGAQAAAAGeBkAAAAABnwZAAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAHeBwEAAAAB3wdAAAAAAeAHQAAAAAHhBwEAAAAB4gcBAAAAAQeWBgEAAAABngZAAAAAAZ8GQAAAAAHXB0AAAAAB4wcBAAAAAeQHAQAAAAHlBwEAAAABAgAAAAUAIGcAANUZACADAAAABQAgZwAA1RkAIGgAANQZACABYAAAlxoAMAwDAAD2CgAgkwYAAPoMADCUBgAAAwAQlQYAAPoMADCWBgEAAAABnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh1wdAAPUKACHjBwEAAAAB5AcBAPIKACHlBwEA8goAIQIAAAAFACBgAADUGQAgAgAAANIZACBgAADTGQAgC5MGAADRGQAwlAYAANIZABCVBgAA0RkAMJYGAQDxCgAhnQYBAPEKACGeBkAA9QoAIZ8GQAD1CgAh1wdAAPUKACHjBwEA8QoAIeQHAQDyCgAh5QcBAPIKACELkwYAANEZADCUBgAA0hkAEJUGAADRGQAwlgYBAPEKACGdBgEA8QoAIZ4GQAD1CgAhnwZAAPUKACHXB0AA9QoAIeMHAQDxCgAh5AcBAPIKACHlBwEA8goAIQeWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHXB0AAgg0AIeMHAQCADQAh5AcBAIENACHlBwEAgQ0AIQeWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHXB0AAgg0AIeMHAQCADQAh5AcBAIENACHlBwEAgQ0AIQeWBgEAAAABngZAAAAAAZ8GQAAAAAHXB0AAAAAB4wcBAAAAAeQHAQAAAAHlBwEAAAABBGcAAMoZADD9BwAAyxkAMP8HAADNGQAggwgAAM4ZADAEZwAAvhkAMP0HAAC_GQAw_wcAAMEZACCDCAAAwhkAMARnAACzGQAw_QcAALQZADD_BwAAthkAIIMIAADfFAAwBGcAAKoZADD9BwAAqxkAMP8HAACtGQAggwgAANMUADAEZwAAoRkAMP0HAACiGQAw_wcAAKQZACCDCAAAxxQAMARnAACYGQAw_QcAAJkZADD_BwAAmxkAIIMIAACpFAAwBGcAAI8ZADD9BwAAkBkAMP8HAACSGQAggwgAAKkUADAEZwAAhhkAMP0HAACHGQAw_wcAAIkZACCDCAAAvg0AMARnAAD9GAAw_QcAAP4YADD_BwAAgBkAIIMIAAC-DQAwA2cAAPgYACD9BwAA-RgAIIMIAACvCgAgBGcAAO8YADD9BwAA8BgAMP8HAADyGAAggwgAAL4PADAEZwAA5hgAMP0HAADnGAAw_wcAAOkYACCDCAAAvg8AMANnAADhGAAg_QcAAOIYACCDCAAA0QgAIARnAADVGAAw_QcAANYYADD_BwAA2BgAIIMIAADZGAAwBGcAAMwYADD9BwAAzRgAMP8HAADPGAAggwgAAJANADAEZwAAwxgAMP0HAADEGAAw_wcAAMYYACCDCAAAkA0AMARnAAC6GAAw_QcAALsYADD_BwAAvRgAIIMIAACvEwAwBGcAALEYADD9BwAAshgAMP8HAAC0GAAggwgAAK8TADAEZwAAqBgAMP0HAACpGAAw_wcAAKsYACCDCAAAuxMAMARnAACfGAAw_QcAAKAYADD_BwAAohgAIIMIAACnEgAwBGcAAJYYADD9BwAAlxgAMP8HAACZGAAggwgAAI0TADAAAAIkAADnDgAgrwYAAPwMACABFgAA5w4AIAAAAAAABWcAAJIaACBoAACVGgAg_QcAAJMaACD-BwAAlBoAIIMIAAAlACADZwAAkhoAIP0HAACTGgAggwgAACUAIAAAAAAAAAQGAACCEgAgRgAA5w4AIEgAAP0ZACBJAADwGQAgABcGAACCEgAgPwAA5w4AIEAAAOcOACBCAADKFwAgmwYAAPwMACDQBgAA_AwAIPUGAAD8DAAgtwcAAPwMACC6BwAA_AwAILwHAAD8DAAgvQcAAPwMACC-BwAA_AwAIL8HAAD8DAAgwQcAAPwMACDDBwAA_AwAIMQHAAD8DAAgxQcAAPwMACDGBwAA_AwAIMcHAAD8DAAgyAcAAPwMACDJBwAA_AwAIMoHAAD8DAAgzAcAAPwMACAWBwAAkBoAIAsAAIMRACAMAACFEQAgDwAAwxcAIBsAAIcRACAoAACEEQAgKgAAhhEAICwAAMsXACAwAAC8FwAgMQAAvRcAIDIAAL8XACAzAADBFwAgNAAAwhcAIDUAAPQRACA2AADFFwAgNwAAxhcAIDgAAMcXACA5AADOFwAgOgAAzxcAIPUGAAD8DAAghgcAAPwMACC6BwAA_AwAIA0GAACCEgAgCAAA_xkAIAkAAI8aACAKAADLFwAgDQAAiBoAIA4AAIkaACAQAACCGgAgGAAAhBoAIBoAAIEaACAuAACNGgAgLwAAjhoAIJwGAAD8DAAghwcAAPwMACAFCwAAgxEAIAwAAIURACAbAACHEQAgKAAAhBEAICoAAIYRACAKAwAA5w4AIAYAAIISACAIAAD_GQAgDAAAhREAIA8AAMMXACAhAADOFwAgIwAAxRcAICUAAPQRACAnAADHFwAgmgYAAPwMACAFEwAA9BEAIJwGAAD8DAAggwcAAPwMACCGBwAA_AwAIIcHAAD8DAAgCgMAAOcOACAGAACCEgAgCAAA_xkAIAwAAIURACASAADGFwAgGQAA4xEAIBsAAIcRACAhAADOFwAgmgYAAPwMACCcBgAA_AwAIAQGAACCEgAgCAAA_xkAIBoAAIEaACAbAACHEQAgBRMAAOMRACCcBgAA_AwAIIMHAAD8DAAghgcAAPwMACCHBwAA_AwAIAgGAACCEgAgCAAA_xkAIA0AAIgaACAQAACCGgAgIgAAxhcAIJwGAAD8DAAgyAYAAPwMACDLBgAA_AwAIAsGAACCEgAgCAAA_xkAIAwAAIURACAPAADDFwAgGgAAgRoAICMAAMUXACApAACKGgAgnAYAAPwMACD1BgAA_AwAIPYGAAD8DAAg-AYAAPwMACAIBgAAghIAIAgAAP8ZACAJAACPGgAgDAAAhREAIA8AAMMXACD1BgAA_AwAIIEHAAD8DAAghwcAAPwMACAFBgAAghIAIAgAAP8ZACAoAACEEQAgnAYAAPwMACD1BgAA_AwAIAgGAACCEgAgCAAA_xkAIAoAAMsXACAaAACBGgAgmwYAAPwMACCcBgAA_AwAIPUGAAD8DAAg9wYAAPwMACADBgAAghIAICwAAMsXACDvBgAA_AwAIAASBgAAghIAIAgAAP8ZACAQAACCGgAgJgAAgBoAIJwGAAD8DAAg1QYAAPwMACDWBgAA_AwAINcGAAD8DAAg2AYAAPwMACDZBgAA_AwAINoGAAD8DAAg2wYAAPwMACDcBgAA_AwAIN0GAAD8DAAg3gYAAPwMACDfBgAA_AwAIOAGAAD8DAAg4QYAAPwMACAJBgAAghIAIAgAAP8ZACAMAACFEQAgDgAAvxcAIPUGAAD8DAAg_wYAAPwMACCABwAA_AwAIIEHAAD8DAAgggcAAPwMACAFBgAAghIAIDsAAJEaACCbBgAA_AwAIPUGAAD8DAAgugcAAPwMACAAFgYAANMOACAIAADQDgAgCQAA0Q4AIAoAAMoOACANAADPDgAgDgAAzQ4AIBAAAOAPACAYAADODgAgGgAA0g4AIC8AAMwOACCWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAb4GAQAAAAG_BgEAAAABwAYBAAAAAcIGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAECAAAAJQAgZwAAkhoAIAMAAAAjACBnAACSGgAgaAAAlhoAIBgAAAAjACAGAACgDgAgCAAAnQ4AIAkAAJ4OACAKAACXDgAgDQAAnA4AIA4AAJoOACAQAADeDwAgGAAAmw4AIBoAAJ8OACAvAACZDgAgYAAAlhoAIJYGAQCADQAhmwYBAIANACGcBgEAgQ0AIZ4GQACCDQAhnwZAAIINACG-BgEAgA0AIb8GAQCADQAhwAYBAIANACHCBgEAgA0AIfcGAQCADQAhhwcBAIENACHOB0AAgg0AIRYGAACgDgAgCAAAnQ4AIAkAAJ4OACAKAACXDgAgDQAAnA4AIA4AAJoOACAQAADeDwAgGAAAmw4AIBoAAJ8OACAvAACZDgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHABgEAgA0AIcIGAQCADQAh9wYBAIANACGHBwEAgQ0AIc4HQACCDQAhB5YGAQAAAAGeBkAAAAABnwZAAAAAAdcHQAAAAAHjBwEAAAAB5AcBAAAAAeUHAQAAAAEMlgYBAAAAAZ4GQAAAAAGfBkAAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAd4HAQAAAAHfB0AAAAAB4AdAAAAAAeEHAQAAAAHiBwEAAAABIwsAALQXACAMAACoFwAgDwAAqRcAIBsAALAXACAoAACjFwAgKgAArxcAICwAALUXACAwAACgFwAgMQAAoRcAIDIAAKQXACAzAACmFwAgNAAApxcAIDUAAKsXACA2AACsFwAgNwAArRcAIDgAAK4XACA6AAC6FwAgPAAAnxcAID0AAKIXACBCAACzFwAgQwAAqhcAIEQAALEXACBFAACyFwAgSgAAthcAIEsAALcXACBMAAC4FwAgTQAAuRcAIJYGAQAAAAGeBkAAAAABnwZAAAAAAcoGAAAAvAcD7wYBAAAAAfUGAQAAAAG6BwEAAAABvQcBAAAAAQIAAACdBQAgZwAAmRoAIAMAAAATACBnAACZGgAgaAAAnRoAICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAACdGgAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEFlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAaYHAAAA8gcCCZYGAQAAAAGXBgEAAAABmAYBAAAAAZkGAQAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAQeWBgEAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHrBgEAAAABGpYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAMwHAtAGQAAAAAH1BgEAAAABtwcBAAAAAbkHAQAAAAG6BwEAAAABvAcAAAC8BwO9BwEAAAABvgcAAADkBgO_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_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIGAAAMIaACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AISMLAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AIQgGAADUFwAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAG6BwEAAAABzQcBAAAAAQIAAAARACBnAADDGgAgAwAAAA8AIGcAAMMaACBoAADHGgAgCgAAAA8AIAYAANMXACBgAADHGgAglgYBAIANACGbBgEAgQ0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIboHAQCBDQAhzQcBAIANACEIBgAA0xcAIJYGAQCADQAhmwYBAIENACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACG6BwEAgQ0AIc0HAQCADQAhIwsAALQXACAMAACoFwAgDwAAqRcAIBsAALAXACAoAACjFwAgKgAArxcAICwAALUXACAwAACgFwAgMQAAoRcAIDIAAKQXACAzAACmFwAgNAAApxcAIDUAAKsXACA2AACsFwAgNwAArRcAIDgAAK4XACA6AAC6FwAgPQAAohcAID4AAKUXACBCAACzFwAgQwAAqhcAIEQAALEXACBFAACyFwAgSgAAthcAIEsAALcXACBMAAC4FwAgTQAAuRcAIJYGAQAAAAGeBkAAAAABnwZAAAAAAcoGAAAAvAcD7wYBAAAAAfUGAQAAAAG6BwEAAAABvQcBAAAAAQIAAACdBQAgZwAAyBoAIAMAAAATACBnAADIGgAgaAAAzBoAICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAADMGgAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEKlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAccGAQAAAAH1BgEAAAAB_wYBAAAAAYAHQAAAAAGBBwgAAAABggcIAAAAASMLAAC0FwAgDAAAqBcAIA8AAKkXACAbAACwFwAgKAAAoxcAICoAAK8XACAsAAC1FwAgMAAAoBcAIDIAAKQXACAzAACmFwAgNAAApxcAIDUAAKsXACA2AACsFwAgNwAArRcAIDgAAK4XACA6AAC6FwAgPAAAnxcAID0AAKIXACA-AAClFwAgQgAAsxcAIEMAAKoXACBEAACxFwAgRQAAshcAIEoAALYXACBLAAC3FwAgTAAAuBcAIE0AALkXACCWBgEAAAABngZAAAAAAZ8GQAAAAAHKBgAAALwHA-8GAQAAAAH1BgEAAAABugcBAAAAAb0HAQAAAAECAAAAnQUAIGcAAM4aACADAAAAEwAgZwAAzhoAIGgAANIaACAlAAAAEwAgCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAgYAAA0hoAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwsAAIITACAMAAD2EgAgDwAA9xIAIBsAAP4SACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhBpYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAQmWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAAB9QYBAAAAAYEHAgAAAAGHBwEAAAABzwcBAAAAAdAHAQAAAAEJlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAe8GAQAAAAH1BgEAAAAB9gYCAAAAAfcGAQAAAAH4BgEAAAABCZYGAQAAAAGXBgEAAAABmAYBAAAAAZkGAQAAAAGaBgEAAAABmwYBAAAAAZ0GAQAAAAGeBkAAAAABnwZAAAAAAQeWBgEAAAABmgYBAAAAAZsGAQAAAAGdBgEAAAABngZAAAAAAZ8GQAAAAAHrBgEAAAABC5YGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAAcAGAQAAAAHCBgEAAAAB9wYBAAAAAYcHAQAAAAHOB0AAAAABB5YGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAAcAGAQAAAAENlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAasGAQAAAAHABgEAAAABzAYBAAAAAc4GAAAAzgYCzwYBAAAAAdAGQAAAAAHRBkAAAAAB0gYBAAAAAdMGAQAAAAEKlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAb4GAQAAAAHABgEAAAABxwYBAAAAAcgGAQAAAAHKBgAAAMoGAssGQAAAAAEKlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAcEGAQAAAAHCBgEAAAABwwYBAAAAAcQGAQAAAAHFBgEAAAABxgZAAAAAAROWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAABwAYBAAAAAdQGAQAAAAHVBggAAAAB1gYIAAAAAdcGCAAAAAHYBggAAAAB2QYIAAAAAdoGCAAAAAHbBggAAAAB3AYIAAAAAd0GCAAAAAHeBggAAAAB3wYIAAAAAeAGCAAAAAHhBggAAAABCZYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHnBgEAAAAB9wYBAAAAAZkHIAAAAAGhBxAAAAABogcQAAAAARaWBgEAAAABmwYBAAAAAZ4GQAAAAAGfBkAAAAABwgYBAAAAAc4GAAAAnwcC5gYQAAAAAecGAQAAAAHoBgIAAAAB9wYBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HAQAAAAGPBwEAAAABkAcBAAAAAZEHgAAAAAGSB0AAAAABmwcBAAAAAZ0HAAAAnQcCnwcBAAAAAaAHQAAAAAEKlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA_AYC7wYBAAAAAfUGAQAAAAH3BgEAAAAB-QYBAAAAAfoGAQAAAAEKlgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAdQGAQAAAAHvBgEAAAAB9QYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAQ-WBgEAAAABngZAAAAAAZ8GQAAAAAHABgEAAAABwgYBAAAAAc4GAAAArAcC0AZAAAAAAdMGAQAAAAGqBwAAAKoHAqwHAQAAAAGtBwEAAAABrgcBAAAAAbAHAQAAAAGxBwEAAAABsgdAAAAAASMLAAC0FwAgDAAAqBcAIA8AAKkXACAbAACwFwAgKAAAoxcAICoAAK8XACAsAAC1FwAgMAAAoBcAIDEAAKEXACAyAACkFwAgMwAAphcAIDQAAKcXACA1AACrFwAgNgAArBcAIDcAAK0XACA4AACuFwAgPAAAnxcAID0AAKIXACA-AAClFwAgQgAAsxcAIEMAAKoXACBEAACxFwAgRQAAshcAIEoAALYXACBLAAC3FwAgTAAAuBcAIE0AALkXACCWBgEAAAABngZAAAAAAZ8GQAAAAAHKBgAAALwHA-8GAQAAAAH1BgEAAAABugcBAAAAAb0HAQAAAAECAAAAnQUAIGcAAOMaACADAAAAEwAgZwAA4xoAIGgAAOcaACAlAAAAEwAgCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAgYAAA5xoAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwsAAIITACAMAAD2EgAgDwAA9xIAIBsAAP4SACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhBZYGAQAAAAGbBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAABBpYGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAG6BwEAAAABzQcBAAAAAQaWBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABugcBAAAAAc0HAQAAAAEKlgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAccGAQAAAAH1BgEAAAAB_wYBAAAAAYAHQAAAAAGBBwgAAAABggcIAAAAARkHAADZFwAgCwAAmRcAIAwAAJEXACAPAACSFwAgGwAAmBcAICgAAI4XACAqAACXFwAgLAAAmhcAIDAAAIsXACAyAACNFwAgMwAAjxcAIDQAAJAXACA1AACTFwAgNgAAlBcAIDcAAJUXACA4AACWFwAgOQAAmxcAIDoAAJwXACCWBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABhgcBAAAAAboHAQAAAAHNBwEAAAABAgAAABcAIGcAAOwaACAJlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfYGAgAAAAH3BgEAAAABAwAAABUAIGcAAOwaACBoAADxGgAgGwAAABUAIAcAANgXACALAADgFQAgDAAA2BUAIA8AANkVACAbAADfFQAgKAAA1RUAICoAAN4VACAsAADhFQAgMAAA0hUAIDIAANQVACAzAADWFQAgNAAA1xUAIDUAANoVACA2AADbFQAgNwAA3BUAIDgAAN0VACA5AADiFQAgOgAA4xUAIGAAAPEaACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIRkHAADYFwAgCwAA4BUAIAwAANgVACAPAADZFQAgGwAA3xUAICgAANUVACAqAADeFQAgLAAA4RUAIDAAANIVACAyAADUFQAgMwAA1hUAIDQAANcVACA1AADaFQAgNgAA2xUAIDcAANwVACA4AADdFQAgOQAA4hUAIDoAAOMVACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIQaWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAfUGAQAAAAEKlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHUBgEAAAAB7wYBAAAAAfUGAQAAAAH8BgEAAAAB_QYBAAAAAQiWBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB0QcBAAAAAdIHAQAAAAHTBwIAAAAB1QcAAADVBwIJlgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAe8GAQAAAAH1BgEAAAAB9gYCAAAAAfcGAQAAAAH4BgEAAAABDgYAANERACAIAADSEQAgDAAA0BEAIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABxwYBAAAAAfUGAQAAAAH_BgEAAAABgAdAAAAAAYEHCAAAAAGCBwgAAAABAgAAABwAIGcAAPYaACADAAAAGgAgZwAA9hoAIGgAAPoaACAQAAAAGgAgBgAAnhEAIAgAAJ8RACAMAACdEQAgYAAA-hoAIJYGAQCADQAhmwYBAIANACGcBgEAgA0AIZ4GQACCDQAhnwZAAIINACHHBgEAgA0AIfUGAQCBDQAh_wYBAIENACGAB0AAmA0AIYEHCACxDQAhggcIALENACEOBgAAnhEAIAgAAJ8RACAMAACdEQAglgYBAIANACGbBgEAgA0AIZwGAQCADQAhngZAAIINACGfBkAAgg0AIccGAQCADQAh9QYBAIENACH_BgEAgQ0AIYAHQACYDQAhgQcIALENACGCBwgAsQ0AIQmWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB9QYBAAAAAYEHAgAAAAGHBwEAAAABzwcBAAAAAdAHAQAAAAEjBAAA1hkAIAUAANcZACAQAADZGQAgGAAA2hkAIDUAAN0ZACA6AADqGQAgQwAA2xkAIE4AANwZACBPAADeGQAgUAAA3xkAIFEAAOAZACBSAADhGQAgUwAA4hkAIFQAAOMZACBVAADkGQAgVgAA5RkAIFcAAOYZACBYAADnGQAgWQAA6BkAIFoAAOkZACCWBgEAAAABmgYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAaYHAQAAAAHmBwEAAAAB5wcgAAAAAegHAQAAAAHpBwEAAAAB6gcBAAAAAesHAQAAAAHsBwEAAAAB7QcBAAAAAe4HAQAAAAECAAAAmgMAIGcAAPwaACADAAAATwAgZwAA_BoAIGgAAIAbACAlAAAATwAgBAAAgRgAIAUAAIIYACAQAACEGAAgGAAAhRgAIDUAAIgYACA6AACVGAAgQwAAhhgAIE4AAIcYACBPAACJGAAgUAAAihgAIFEAAIsYACBSAACMGAAgUwAAjRgAIFQAAI4YACBVAACPGAAgVgAAkBgAIFcAAJEYACBYAACSGAAgWQAAkxgAIFoAAJQYACBgAACAGwAglgYBAIANACGaBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIaYHAQCADQAh5gcBAIANACHnByAA4g4AIegHAQCBDQAh6QcBAIENACHqBwEAgQ0AIesHAQCBDQAh7AcBAIENACHtBwEAgQ0AIe4HAQCADQAhIwQAAIEYACAFAACCGAAgEAAAhBgAIBgAAIUYACA1AACIGAAgOgAAlRgAIEMAAIYYACBOAACHGAAgTwAAiRgAIFAAAIoYACBRAACLGAAgUgAAjBgAIFMAAI0YACBUAACOGAAgVQAAjxgAIFYAAJAYACBXAACRGAAgWAAAkhgAIFkAAJMYACBaAACUGAAglgYBAIANACGaBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIaYHAQCADQAh5gcBAIANACHnByAA4g4AIegHAQCBDQAh6QcBAIENACHqBwEAgQ0AIesHAQCBDQAh7AcBAIENACHtBwEAgQ0AIe4HAQCADQAhBZYGAQAAAAGdBgEAAAABngZAAAAAAZ8GQAAAAAGmBwAAAPIHAgmWBgEAAAABlwYBAAAAAZgGAQAAAAGZBgEAAAABmgYBAAAAAZwGAQAAAAGdBgEAAAABngZAAAAAAZ8GQAAAAAEHlgYBAAAAAZoGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAAB6wYBAAAAAQuWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAfcGAQAAAAGHBwEAAAABzgdAAAAAAQeWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABGpYGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAAzAcC0AZAAAAAAfUGAQAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAG6BwEAAAABvAcAAAC8BwO9BwEAAAABvgcAAADkBgO_BxAAAAABwAcBAAAAAcEHAgAAAAHCBwAAAIsHAsMHAQAAAAHEBwEAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHgAAAAAHKB0AAAAABzAcBAAAAAQ2WBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABqwYBAAAAAcAGAQAAAAHMBgEAAAABzgYAAADOBgLPBgEAAAAB0AZAAAAAAdEGQAAAAAHSBgEAAAAB0wYBAAAAAQqWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAcAGAQAAAAHHBgEAAAAByAYBAAAAAcoGAAAAygYCywZAAAAAAQqWBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABwQYBAAAAAcIGAQAAAAHDBgEAAAABxAYBAAAAAcUGAQAAAAHGBkAAAAABE5YGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHABgEAAAAB1AYBAAAAAdUGCAAAAAHWBggAAAAB1wYIAAAAAdgGCAAAAAHZBggAAAAB2gYIAAAAAdsGCAAAAAHcBggAAAAB3QYIAAAAAd4GCAAAAAHfBggAAAAB4AYIAAAAAeEGCAAAAAEJlgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAecGAQAAAAH3BgEAAAABmQcgAAAAAaEHEAAAAAGiBxAAAAABFpYGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHCBgEAAAABzgYAAACfBwLmBhAAAAAB5wYBAAAAAegGAgAAAAH3BgEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAY8HAQAAAAGQBwEAAAABkQeAAAAAAZIHQAAAAAGbBwEAAAABnQcAAACdBwKfBwEAAAABoAdAAAAAARGWBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAIsHAuQGAAAA5AYC5gYQAAAAAecGAQAAAAHoBgIAAAABiQcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HAQAAAAGPBwEAAAABkAcBAAAAAZEHgAAAAAGSB0AAAAABC5YGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA5gYC4gYBAAAAAeQGAAAA5AYC5gYQAAAAAecGAQAAAAHoBgIAAAAB6QZAAAAAAeoGQAAAAAEKlgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAA_AYC7wYBAAAAAfUGAQAAAAH3BgEAAAAB-QYBAAAAAfoGAQAAAAEKlgYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAdQGAQAAAAHvBgEAAAAB9QYBAAAAAfwGAQAAAAH9BgEAAAAB_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_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAACpGwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEDAAAATwAgZwAAohsAIGgAAKwbACAlAAAATwAgBAAAgRgAIAUAAIIYACAQAACEGAAgGAAAhRgAIDUAAIgYACA6AACVGAAgPgAAgxgAIEMAAIYYACBPAACJGAAgUAAAihgAIFEAAIsYACBSAACMGAAgUwAAjRgAIFQAAI4YACBVAACPGAAgVgAAkBgAIFcAAJEYACBYAACSGAAgWQAAkxgAIFoAAJQYACBgAACsGwAglgYBAIANACGaBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIaYHAQCADQAh5gcBAIANACHnByAA4g4AIegHAQCBDQAh6QcBAIENACHqBwEAgQ0AIesHAQCBDQAh7AcBAIENACHtBwEAgQ0AIe4HAQCADQAhIwQAAIEYACAFAACCGAAgEAAAhBgAIBgAAIUYACA1AACIGAAgOgAAlRgAID4AAIMYACBDAACGGAAgTwAAiRgAIFAAAIoYACBRAACLGAAgUgAAjBgAIFMAAI0YACBUAACOGAAgVQAAjxgAIFYAAJAYACBXAACRGAAgWAAAkhgAIFkAAJMYACBaAACUGAAglgYBAIANACGaBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIaYHAQCADQAh5gcBAIANACHnByAA4g4AIegHAQCBDQAh6QcBAIENACHqBwEAgQ0AIesHAQCBDQAh7AcBAIENACHtBwEAgQ0AIe4HAQCADQAhAwAAAE8AIGcAAKQbACBoAACvGwAgJQAAAE8AIAQAAIEYACAFAACCGAAgEAAAhBgAIBgAAIUYACA1AACIGAAgOgAAlRgAID4AAIMYACBOAACHGAAgTwAAiRgAIFAAAIoYACBRAACLGAAgUgAAjBgAIFMAAI0YACBUAACOGAAgVQAAjxgAIFYAAJAYACBXAACRGAAgWAAAkhgAIFkAAJMYACBaAACUGAAgYAAArxsAIJYGAQCADQAhmgYBAIENACGeBkAAgg0AIZ8GQACCDQAh7wYBAIANACGmBwEAgA0AIeYHAQCADQAh5wcgAOIOACHoBwEAgQ0AIekHAQCBDQAh6gcBAIENACHrBwEAgQ0AIewHAQCBDQAh7QcBAIENACHuBwEAgA0AISMEAACBGAAgBQAAghgAIBAAAIQYACAYAACFGAAgNQAAiBgAIDoAAJUYACA-AACDGAAgTgAAhxgAIE8AAIkYACBQAACKGAAgUQAAixgAIFIAAIwYACBTAACNGAAgVAAAjhgAIFUAAI8YACBWAACQGAAgVwAAkRgAIFgAAJIYACBZAACTGAAgWgAAlBgAIJYGAQCADQAhmgYBAIENACGeBkAAgg0AIZ8GQACCDQAh7wYBAIANACGmBwEAgA0AIeYHAQCADQAh5wcgAOIOACHoBwEAgQ0AIekHAQCBDQAh6gcBAIENACHrBwEAgQ0AIewHAQCBDQAh7QcBAIENACHuBwEAgA0AISMEAADWGQAgBQAA1xkAIBAAANkZACAYAADaGQAgNQAA3RkAIDoAAOoZACA-AADYGQAgQwAA2xkAIE4AANwZACBPAADeGQAgUAAA3xkAIFEAAOAZACBSAADhGQAgUwAA4hkAIFQAAOMZACBVAADkGQAgVgAA5RkAIFcAAOYZACBZAADoGQAgWgAA6RkAIJYGAQAAAAGaBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAABpgcBAAAAAeYHAQAAAAHnByAAAAAB6AcBAAAAAekHAQAAAAHqBwEAAAAB6wcBAAAAAewHAQAAAAHtBwEAAAAB7gcBAAAAAQIAAACaAwAgZwAAsBsAICMLAAC0FwAgDAAAqBcAIA8AAKkXACAbAACwFwAgKAAAoxcAICoAAK8XACAsAAC1FwAgMAAAoBcAIDEAAKEXACAyAACkFwAgMwAAphcAIDQAAKcXACA1AACrFwAgNgAArBcAIDcAAK0XACA4AACuFwAgOgAAuhcAIDwAAJ8XACA9AACiFwAgPgAApRcAIEIAALMXACBDAACqFwAgRAAAsRcAIEUAALIXACBKAAC2FwAgTAAAuBcAIE0AALkXACCWBgEAAAABngZAAAAAAZ8GQAAAAAHKBgAAALwHA-8GAQAAAAH1BgEAAAABugcBAAAAAb0HAQAAAAECAAAAnQUAIGcAALIbACAjBAAA1hkAIAUAANcZACAQAADZGQAgGAAA2hkAIDUAAN0ZACA6AADqGQAgPgAA2BkAIEMAANsZACBOAADcGQAgTwAA3hkAIFAAAN8ZACBRAADgGQAgUgAA4RkAIFMAAOIZACBUAADjGQAgVQAA5BkAIFYAAOUZACBYAADnGQAgWQAA6BkAIFoAAOkZACCWBgEAAAABmgYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAaYHAQAAAAHmBwEAAAAB5wcgAAAAAegHAQAAAAHpBwEAAAAB6gcBAAAAAesHAQAAAAHsBwEAAAAB7QcBAAAAAe4HAQAAAAECAAAAmgMAIGcAALQbACADAAAATwAgZwAAsBsAIGgAALgbACAlAAAATwAgBAAAgRgAIAUAAIIYACAQAACEGAAgGAAAhRgAIDUAAIgYACA6AACVGAAgPgAAgxgAIEMAAIYYACBOAACHGAAgTwAAiRgAIFAAAIoYACBRAACLGAAgUgAAjBgAIFMAAI0YACBUAACOGAAgVQAAjxgAIFYAAJAYACBXAACRGAAgWQAAkxgAIFoAAJQYACBgAAC4GwAglgYBAIANACGaBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIaYHAQCADQAh5gcBAIANACHnByAA4g4AIegHAQCBDQAh6QcBAIENACHqBwEAgQ0AIesHAQCBDQAh7AcBAIENACHtBwEAgQ0AIe4HAQCADQAhIwQAAIEYACAFAACCGAAgEAAAhBgAIBgAAIUYACA1AACIGAAgOgAAlRgAID4AAIMYACBDAACGGAAgTgAAhxgAIE8AAIkYACBQAACKGAAgUQAAixgAIFIAAIwYACBTAACNGAAgVAAAjhgAIFUAAI8YACBWAACQGAAgVwAAkRgAIFkAAJMYACBaAACUGAAglgYBAIANACGaBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIaYHAQCADQAh5gcBAIANACHnByAA4g4AIegHAQCBDQAh6QcBAIENACHqBwEAgQ0AIesHAQCBDQAh7AcBAIENACHtBwEAgQ0AIe4HAQCADQAhAwAAABMAIGcAALIbACBoAAC7GwAgJQAAABMAIAsAAIITACAMAAD2EgAgDwAA9xIAIBsAAP4SACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBMAACGEwAgTQAAhxMAIGAAALsbACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AISMLAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_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_xIAIEUAAIATACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAADKGwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACELBgAAuxIAIEYAALwSACBJAAC-EgAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAccGAQAAAAHIBgEAAAABpwcBAAAAAagHAAAApgcCAgAAAIACACBnAADLGwAgAwAAAP4BACBnAADLGwAgaAAAzxsAIA0AAAD-AQAgBgAAnxIAIEYAAKASACBJAACiEgAgYAAAzxsAIJYGAQCADQAhmwYBAIANACGeBkAAgg0AIZ8GQACCDQAhxwYBAIANACHIBgEAgA0AIacHAQCADQAhqAcAAJkSpgciCwYAAJ8SACBGAACgEgAgSQAAohIAIJYGAQCADQAhmwYBAIANACGeBkAAgg0AIZ8GQACCDQAhxwYBAIANACHIBgEAgA0AIacHAQCADQAhqAcAAJkSpgciIwQAANYZACAFAADXGQAgEAAA2RkAIBgAANoZACA1AADdGQAgOgAA6hkAID4AANgZACBDAADbGQAgTgAA3BkAIE8AAN4ZACBQAADfGQAgUQAA4BkAIFIAAOEZACBTAADiGQAgVAAA4xkAIFUAAOQZACBWAADlGQAgVwAA5hkAIFgAAOcZACBZAADoGQAglgYBAAAAAZoGAQAAAAGeBkAAAAABnwZAAAAAAe8GAQAAAAGmBwEAAAAB5gcBAAAAAecHIAAAAAHoBwEAAAAB6QcBAAAAAeoHAQAAAAHrBwEAAAAB7AcBAAAAAe0HAQAAAAHuBwEAAAABAgAAAJoDACBnAADQGwAgCwYAALsSACBGAAC8EgAgSAAAvRIAIJYGAQAAAAGbBgEAAAABngZAAAAAAZ8GQAAAAAHHBgEAAAAByAYBAAAAAacHAQAAAAGoBwAAAKYHAgIAAACAAgAgZwAA0hsAIAMAAABPACBnAADQGwAgaAAA1hsAICUAAABPACAEAACBGAAgBQAAghgAIBAAAIQYACAYAACFGAAgNQAAiBgAIDoAAJUYACA-AACDGAAgQwAAhhgAIE4AAIcYACBPAACJGAAgUAAAihgAIFEAAIsYACBSAACMGAAgUwAAjRgAIFQAAI4YACBVAACPGAAgVgAAkBgAIFcAAJEYACBYAACSGAAgWQAAkxgAIGAAANYbACCWBgEAgA0AIZoGAQCBDQAhngZAAIINACGfBkAAgg0AIe8GAQCADQAhpgcBAIANACHmBwEAgA0AIecHIADiDgAh6AcBAIENACHpBwEAgQ0AIeoHAQCBDQAh6wcBAIENACHsBwEAgQ0AIe0HAQCBDQAh7gcBAIANACEjBAAAgRgAIAUAAIIYACAQAACEGAAgGAAAhRgAIDUAAIgYACA6AACVGAAgPgAAgxgAIEMAAIYYACBOAACHGAAgTwAAiRgAIFAAAIoYACBRAACLGAAgUgAAjBgAIFMAAI0YACBUAACOGAAgVQAAjxgAIFYAAJAYACBXAACRGAAgWAAAkhgAIFkAAJMYACCWBgEAgA0AIZoGAQCBDQAhngZAAIINACGfBkAAgg0AIe8GAQCADQAhpgcBAIANACHmBwEAgA0AIecHIADiDgAh6AcBAIENACHpBwEAgQ0AIeoHAQCBDQAh6wcBAIENACHsBwEAgQ0AIe0HAQCBDQAh7gcBAIANACEDAAAA_gEAIGcAANIbACBoAADZGwAgDQAAAP4BACAGAACfEgAgRgAAoBIAIEgAAKESACBgAADZGwAglgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACHHBgEAgA0AIcgGAQCADQAhpwcBAIANACGoBwAAmRKmByILBgAAnxIAIEYAAKASACBIAAChEgAglgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACHHBgEAgA0AIcgGAQCADQAhpwcBAIANACGoBwAAmRKmByIJCwAA_hAAIAwAAIARACAbAACCEQAgKAAA_xAAIJYGAQAAAAGbBgEAAAAB7wYBAAAAAfAGQAAAAAHxBkAAAAABAgAAALkIACBnAADaGwAgAwAAACwAIGcAANobACBoAADeGwAgCwAAACwAIAsAAPgPACAMAAD6DwAgGwAA_A8AICgAAPkPACBgAADeGwAglgYBAIANACGbBgEAgA0AIe8GAQCADQAh8AZAAIINACHxBkAAgg0AIQkLAAD4DwAgDAAA-g8AIBsAAPwPACAoAAD5DwAglgYBAIANACGbBgEAgA0AIe8GAQCADQAh8AZAAIINACHxBkAAgg0AISMLAAC0FwAgDAAAqBcAIA8AAKkXACAbAACwFwAgKAAAoxcAICoAAK8XACAsAAC1FwAgMAAAoBcAIDEAAKEXACAyAACkFwAgMwAAphcAIDQAAKcXACA1AACrFwAgNgAArBcAIDcAAK0XACA4AACuFwAgOgAAuhcAIDwAAJ8XACA9AACiFwAgPgAApRcAIEIAALMXACBDAACqFwAgRQAAshcAIEoAALYXACBLAAC3FwAgTAAAuBcAIE0AALkXACCWBgEAAAABngZAAAAAAZ8GQAAAAAHKBgAAALwHA-8GAQAAAAH1BgEAAAABugcBAAAAAb0HAQAAAAECAAAAnQUAIGcAAN8bACADAAAAEwAgZwAA3xsAIGgAAOMbACAlAAAAEwAgCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAgYAAA4xsAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwsAAIITACAMAAD2EgAgDwAA9xIAIBsAAP4SACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwsAALQXACAMAACoFwAgDwAAqRcAIBsAALAXACAoAACjFwAgKgAArxcAICwAALUXACAwAACgFwAgMQAAoRcAIDIAAKQXACAzAACmFwAgNAAApxcAIDUAAKsXACA2AACsFwAgNwAArRcAIDgAAK4XACA6AAC6FwAgPAAAnxcAID0AAKIXACA-AAClFwAgQgAAsxcAIEMAAKoXACBEAACxFwAgSgAAthcAIEsAALcXACBMAAC4FwAgTQAAuRcAIJYGAQAAAAGeBkAAAAABnwZAAAAAAcoGAAAAvAcD7wYBAAAAAfUGAQAAAAG6BwEAAAABvQcBAAAAAQIAAACdBQAgZwAA5BsAIAMAAAATACBnAADkGwAgaAAA6BsAICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAADoGwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_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-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAAD6GwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEJlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABgQcCAAAAAc8HAQAAAAHQBwEAAAABC5YGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAfcGAQAAAAHOB0AAAAABAwAAABUAIGcAAOsbACBoAAD_GwAgGwAAABUAIAcAANgXACALAADgFQAgDAAA2BUAIA8AANkVACAbAADfFQAgKAAA1RUAICoAAN4VACAsAADhFQAgMQAA0xUAIDIAANQVACAzAADWFQAgNAAA1xUAIDUAANoVACA2AADbFQAgNwAA3BUAIDgAAN0VACA5AADiFQAgOgAA4xUAIGAAAP8bACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIRkHAADYFwAgCwAA4BUAIAwAANgVACAPAADZFQAgGwAA3xUAICgAANUVACAqAADeFQAgLAAA4RUAIDEAANMVACAyAADUFQAgMwAA1hUAIDQAANcVACA1AADaFQAgNgAA2xUAIDcAANwVACA4AADdFQAgOQAA4hUAIDoAAOMVACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIQMAAAATACBnAADtGwAgaAAAghwAICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAACCHAAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEJDAAAgBEAIBsAAIIRACAoAAD_EAAgKgAAgREAIJYGAQAAAAGbBgEAAAAB7wYBAAAAAfAGQAAAAAHxBkAAAAABAgAAALkIACBnAACDHAAgAwAAACwAIGcAAIMcACBoAACHHAAgCwAAACwAIAwAAPoPACAbAAD8DwAgKAAA-Q8AICoAAPsPACBgAACHHAAglgYBAIANACGbBgEAgA0AIe8GAQCADQAh8AZAAIINACHxBkAAgg0AIQkMAAD6DwAgGwAA_A8AICgAAPkPACAqAAD7DwAglgYBAIANACGbBgEAgA0AIe8GAQCADQAh8AZAAIINACHxBkAAgg0AIQkLAAD-EAAgDAAAgBEAIBsAAIIRACAqAACBEQAglgYBAAAAAZsGAQAAAAHvBgEAAAAB8AZAAAAAAfEGQAAAAAECAAAAuQgAIGcAAIgcACADAAAALAAgZwAAiBwAIGgAAIwcACALAAAALAAgCwAA-A8AIAwAAPoPACAbAAD8DwAgKgAA-w8AIGAAAIwcACCWBgEAgA0AIZsGAQCADQAh7wYBAIANACHwBkAAgg0AIfEGQACCDQAhCQsAAPgPACAMAAD6DwAgGwAA_A8AICoAAPsPACCWBgEAgA0AIZsGAQCADQAh7wYBAIANACHwBkAAgg0AIfEGQACCDQAhGQcAANkXACAMAACRFwAgDwAAkhcAIBsAAJgXACAoAACOFwAgKgAAlxcAICwAAJoXACAwAACLFwAgMQAAjBcAIDIAAI0XACAzAACPFwAgNAAAkBcAIDUAAJMXACA2AACUFwAgNwAAlRcAIDgAAJYXACA5AACbFwAgOgAAnBcAIJYGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAGGBwEAAAABugcBAAAAAc0HAQAAAAECAAAAFwAgZwAAjRwAICMMAACoFwAgDwAAqRcAIBsAALAXACAoAACjFwAgKgAArxcAICwAALUXACAwAACgFwAgMQAAoRcAIDIAAKQXACAzAACmFwAgNAAApxcAIDUAAKsXACA2AACsFwAgNwAArRcAIDgAAK4XACA6AAC6FwAgPAAAnxcAID0AAKIXACA-AAClFwAgQgAAsxcAIEMAAKoXACBEAACxFwAgRQAAshcAIEoAALYXACBLAAC3FwAgTAAAuBcAIE0AALkXACCWBgEAAAABngZAAAAAAZ8GQAAAAAHKBgAAALwHA-8GAQAAAAH1BgEAAAABugcBAAAAAb0HAQAAAAECAAAAnQUAIGcAAI8cACAWBgAA0w4AIAgAANAOACAJAADRDgAgDQAAzw4AIA4AAM0OACAQAADgDwAgGAAAzg4AIBoAANIOACAuAADLDgAgLwAAzA4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAfcGAQAAAAGHBwEAAAABzgdAAAAAAQIAAAAlACBnAACRHAAgAwAAACMAIGcAAJEcACBoAACVHAAgGAAAACMAIAYAAKAOACAIAACdDgAgCQAAng4AIA0AAJwOACAOAACaDgAgEAAA3g8AIBgAAJsOACAaAACfDgAgLgAAmA4AIC8AAJkOACBgAACVHAAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHABgEAgA0AIcIGAQCADQAh9wYBAIANACGHBwEAgQ0AIc4HQACCDQAhFgYAAKAOACAIAACdDgAgCQAAng4AIA0AAJwOACAOAACaDgAgEAAA3g8AIBgAAJsOACAaAACfDgAgLgAAmA4AIC8AAJkOACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACG_BgEAgA0AIcAGAQCADQAhwgYBAIANACH3BgEAgA0AIYcHAQCBDQAhzgdAAIINACEKlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHUBgEAAAAB7wYBAAAAAfUGAQAAAAH8BgEAAAAB_gYBAAAAAQMAAAAVACBnAACNHAAgaAAAmRwAIBsAAAAVACAHAADYFwAgDAAA2BUAIA8AANkVACAbAADfFQAgKAAA1RUAICoAAN4VACAsAADhFQAgMAAA0hUAIDEAANMVACAyAADUFQAgMwAA1hUAIDQAANcVACA1AADaFQAgNgAA2xUAIDcAANwVACA4AADdFQAgOQAA4hUAIDoAAOMVACBgAACZHAAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGGBwEAgQ0AIboHAQCBDQAhzQcBAIANACEZBwAA2BcAIAwAANgVACAPAADZFQAgGwAA3xUAICgAANUVACAqAADeFQAgLAAA4RUAIDAAANIVACAxAADTFQAgMgAA1BUAIDMAANYVACA0AADXFQAgNQAA2hUAIDYAANsVACA3AADcFQAgOAAA3RUAIDkAAOIVACA6AADjFQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGGBwEAgQ0AIboHAQCBDQAhzQcBAIANACEDAAAAEwAgZwAAjxwAIGgAAJwcACAlAAAAEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAgYAAAnBwAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_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-EgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAACvHAAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEJlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfYGAgAAAAH4BgEAAAABC5YGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAb8GAQAAAAHABgEAAAABwgYBAAAAAYcHAQAAAAHOB0AAAAABGQcAANkXACALAACZFwAgDAAAkRcAIA8AAJIXACAbAACYFwAgKAAAjhcAICwAAJoXACAwAACLFwAgMQAAjBcAIDIAAI0XACAzAACPFwAgNAAAkBcAIDUAAJMXACA2AACUFwAgNwAAlRcAIDgAAJYXACA5AACbFwAgOgAAnBcAIJYGAQAAAAGeBkAAAAABnwZAAAAAAfUGAQAAAAGGBwEAAAABugcBAAAAAc0HAQAAAAECAAAAFwAgZwAAshwAICMLAAC0FwAgDAAAqBcAIA8AAKkXACAbAACwFwAgKAAAoxcAICwAALUXACAwAACgFwAgMQAAoRcAIDIAAKQXACAzAACmFwAgNAAApxcAIDUAAKsXACA2AACsFwAgNwAArRcAIDgAAK4XACA6AAC6FwAgPAAAnxcAID0AAKIXACA-AAClFwAgQgAAsxcAIEMAAKoXACBEAACxFwAgRQAAshcAIEoAALYXACBLAAC3FwAgTAAAuBcAIE0AALkXACCWBgEAAAABngZAAAAAAZ8GQAAAAAHKBgAAALwHA-8GAQAAAAH1BgEAAAABugcBAAAAAb0HAQAAAAECAAAAnQUAIGcAALQcACAWlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHCBgEAAAABzgYAAACfBwLmBhAAAAAB5wYBAAAAAegGAgAAAAH3BgEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgcBAAAAAY8HAQAAAAGQBwEAAAABkQeAAAAAAZIHQAAAAAGdBwAAAJ0HAp8HAQAAAAGgB0AAAAABAwAAABUAIGcAALIcACBoAAC5HAAgGwAAABUAIAcAANgXACALAADgFQAgDAAA2BUAIA8AANkVACAbAADfFQAgKAAA1RUAICwAAOEVACAwAADSFQAgMQAA0xUAIDIAANQVACAzAADWFQAgNAAA1xUAIDUAANoVACA2AADbFQAgNwAA3BUAIDgAAN0VACA5AADiFQAgOgAA4xUAIGAAALkcACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIRkHAADYFwAgCwAA4BUAIAwAANgVACAPAADZFQAgGwAA3xUAICgAANUVACAsAADhFQAgMAAA0hUAIDEAANMVACAyAADUFQAgMwAA1hUAIDQAANcVACA1AADaFQAgNgAA2xUAIDcAANwVACA4AADdFQAgOQAA4hUAIDoAAOMVACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIQMAAAATACBnAAC0HAAgaAAAvBwAICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAAC8HAAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_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-BwAIAsAAAAsACALAAD4DwAgDAAA-g8AICgAAPkPACAqAAD7DwAgYAAA-BwAIJYGAQCADQAhmwYBAIANACHvBgEAgA0AIfAGQACCDQAh8QZAAIINACEJCwAA-A8AIAwAAPoPACAoAAD5DwAgKgAA-w8AIJYGAQCADQAhmwYBAIANACHvBgEAgA0AIfAGQACCDQAh8QZAAIINACEDAAAAFQAgZwAA7xwAIGgAAPscACAbAAAAFQAgBwAA2BcAIAsAAOAVACAMAADYFQAgDwAA2RUAICgAANUVACAqAADeFQAgLAAA4RUAIDAAANIVACAxAADTFQAgMgAA1BUAIDMAANYVACA0AADXFQAgNQAA2hUAIDYAANsVACA3AADcFQAgOAAA3RUAIDkAAOIVACA6AADjFQAgYAAA-xwAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhhgcBAIENACG6BwEAgQ0AIc0HAQCADQAhGQcAANgXACALAADgFQAgDAAA2BUAIA8AANkVACAoAADVFQAgKgAA3hUAICwAAOEVACAwAADSFQAgMQAA0xUAIDIAANQVACAzAADWFQAgNAAA1xUAIDUAANoVACA2AADbFQAgNwAA3BUAIDgAAN0VACA5AADiFQAgOgAA4xUAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhhgcBAIENACG6BwEAgQ0AIc0HAQCADQAhAwAAABMAIGcAAPEcACBoAAD-HAAgJQAAABMAIAsAAIITACAMAAD2EgAgDwAA9xIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIGAAAP4cACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AISMLAACCEwAgDAAA9hIAIA8AAPcSACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_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-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAACOHQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEeBgAA6BIAID8AAOYSACBAAADnEgAglgYBAAAAAZsGAQAAAAGeBkAAAAABnwZAAAAAAc4GAAAAzAcC0AZAAAAAAfUGAQAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAG6BwEAAAABvAcAAAC8BwO9BwEAAAABvgcAAADkBgO_BxAAAAABwAcBAAAAAcEHAgAAAAHCBwAAAIsHAsMHAQAAAAHEBwEAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHgAAAAAHKB0AAAAABzAcBAAAAAQIAAADlAQAgZwAAjx0AICMLAAC0FwAgDAAAqBcAIA8AAKkXACAbAACwFwAgKAAAoxcAICoAAK8XACAsAAC1FwAgMAAAoBcAIDEAAKEXACAyAACkFwAgMwAAphcAIDQAAKcXACA1AACrFwAgNgAArBcAIDcAAK0XACA4AACuFwAgOgAAuhcAIDwAAJ8XACA9AACiFwAgPgAApRcAIEMAAKoXACBEAACxFwAgRQAAshcAIEoAALYXACBLAAC3FwAgTAAAuBcAIE0AALkXACCWBgEAAAABngZAAAAAAZ8GQAAAAAHKBgAAALwHA-8GAQAAAAH1BgEAAAABugcBAAAAAb0HAQAAAAECAAAAnQUAIGcAAJEdACADAAAA4wEAIGcAAI8dACBoAACVHQAgIAAAAOMBACAGAADYEgAgPwAA1hIAIEAAANcSACBgAACVHQAglgYBAIANACGbBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHOBgAA1RLMByLQBkAAmA0AIfUGAQCBDQAhtwcBAIENACG4BwEAgA0AIbkHAQCADQAhugcBAIENACG8BwAA0hK8ByO9BwEAgQ0AIb4HAADTEuQGI78HEADUEgAhwAcBAIANACHBBwIAthAAIcIHAAD6EYsHIsMHAQCBDQAhxAcBAIENACHFBwEAgQ0AIcYHAQCBDQAhxwcBAIENACHIBwEAgQ0AIckHgAAAAAHKB0AAmA0AIcwHAQCBDQAhHgYAANgSACA_AADWEgAgQAAA1xIAIJYGAQCADQAhmwYBAIENACGeBkAAgg0AIZ8GQACCDQAhzgYAANUSzAci0AZAAJgNACH1BgEAgQ0AIbcHAQCBDQAhuAcBAIANACG5BwEAgA0AIboHAQCBDQAhvAcAANISvAcjvQcBAIENACG-BwAA0xLkBiO_BxAA1BIAIcAHAQCADQAhwQcCALYQACHCBwAA-hGLByLDBwEAgQ0AIcQHAQCBDQAhxQcBAIENACHGBwEAgQ0AIccHAQCBDQAhyAcBAIENACHJB4AAAAABygdAAJgNACHMBwEAgQ0AIQMAAAATACBnAACRHQAgaAAAmB0AICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAACYHQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACESAwAA3A4AIAYAANQOACAIAADbDgAgDAAA1Q4AIA8AANYOACAhAADaDgAgIwAA1w4AICcAANkOACCWBgEAAAABlwYBAAAAAZgGAQAAAAGZBgEAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAABAgAAALABACBnAACZHQAgAwAAAF8AIGcAAJkdACBoAACdHQAgFAAAAF8AIAMAAIsNACAGAACDDQAgCAAAig0AIAwAAIQNACAPAACFDQAgIQAAiQ0AICMAAIYNACAnAACIDQAgYAAAnR0AIJYGAQCADQAhlwYBAIANACGYBgEAgA0AIZkGAQCADQAhmgYBAIENACGbBgEAgA0AIZwGAQCADQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAhEgMAAIsNACAGAACDDQAgCAAAig0AIAwAAIQNACAPAACFDQAgIQAAiQ0AICMAAIYNACAnAACIDQAglgYBAIANACGXBgEAgA0AIZgGAQCADQAhmQYBAIANACGaBgEAgQ0AIZsGAQCADQAhnAYBAIANACGdBgEAgA0AIZ4GQACCDQAhnwZAAIINACESAwAA3A4AIAYAANQOACAIAADbDgAgDAAA1Q4AIA8AANYOACAhAADaDgAgJQAA2A4AICcAANkOACCWBgEAAAABlwYBAAAAAZgGAQAAAAGZBgEAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAABAgAAALABACBnAACeHQAgAwAAAF8AIGcAAJ4dACBoAACiHQAgFAAAAF8AIAMAAIsNACAGAACDDQAgCAAAig0AIAwAAIQNACAPAACFDQAgIQAAiQ0AICUAAIcNACAnAACIDQAgYAAAoh0AIJYGAQCADQAhlwYBAIANACGYBgEAgA0AIZkGAQCADQAhmgYBAIENACGbBgEAgA0AIZwGAQCADQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAhEgMAAIsNACAGAACDDQAgCAAAig0AIAwAAIQNACAPAACFDQAgIQAAiQ0AICUAAIcNACAnAACIDQAglgYBAIANACGXBgEAgA0AIZgGAQCADQAhmQYBAIANACGaBgEAgQ0AIZsGAQCADQAhnAYBAIANACGdBgEAgA0AIZ4GQACCDQAhnwZAAIINACEPBgAA9Q0AIAgAAPYNACANAAD0DQAgEAAA9g4AIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAABvgYBAAAAAcAGAQAAAAHHBgEAAAAByAYBAAAAAcoGAAAAygYCywZAAAAAAQIAAAA_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_BAAIAgAAP0QACAaAACTEQAglgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAPwGAu8GAQAAAAH1BgEAAAAB9wYBAAAAAfkGAQAAAAH6BgEAAAABAgAAADAAIGcAAMwdACADAAAAFQAgZwAAxh0AIGgAANAdACAbAAAAFQAgBwAA2BcAIAsAAOAVACAMAADYFQAgDwAA2RUAIBsAAN8VACAoAADVFQAgKgAA3hUAIDAAANIVACAxAADTFQAgMgAA1BUAIDMAANYVACA0AADXFQAgNQAA2hUAIDYAANsVACA3AADcFQAgOAAA3RUAIDkAAOIVACA6AADjFQAgYAAA0B0AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhhgcBAIENACG6BwEAgQ0AIc0HAQCADQAhGQcAANgXACALAADgFQAgDAAA2BUAIA8AANkVACAbAADfFQAgKAAA1RUAICoAAN4VACAwAADSFQAgMQAA0xUAIDIAANQVACAzAADWFQAgNAAA1xUAIDUAANoVACA2AADbFQAgNwAA3BUAIDgAAN0VACA5AADiFQAgOgAA4xUAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIfUGAQCBDQAhhgcBAIENACG6BwEAgQ0AIc0HAQCADQAhAwAAABMAIGcAAMgdACBoAADTHQAgJQAAABMAIAsAAIITACAMAAD2EgAgDwAA9xIAIBsAAP4SACAoAADxEgAgKgAA_RIAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIGAAANMdACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AISMLAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AIQMAAADYAQAgZwAAyh0AIGgAANYdACAMAAAA2AEAIAYAAOcXACBgAADWHQAglgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACHvBgEAgQ0AIdEHAQCADQAh0gcBAIANACHTBwIAiQ8AIdUHAACIFdUHIgoGAADnFwAglgYBAIANACGbBgEAgA0AIZ4GQACCDQAhnwZAAIINACHvBgEAgQ0AIdEHAQCADQAh0gcBAIANACHTBwIAiQ8AIdUHAACIFdUHIgMAAAAuACBnAADMHQAgaAAA2R0AIBAAAAAuACAGAADtEAAgCAAA7hAAIBoAAJIRACBgAADZHQAglgYBAIANACGbBgEAgQ0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIc4GAADqEPwGIu8GAQCADQAh9QYBAIENACH3BgEAgQ0AIfkGAQCADQAh-gYBAIANACEOBgAA7RAAIAgAAO4QACAaAACSEQAglgYBAIANACGbBgEAgQ0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIc4GAADqEPwGIu8GAQCADQAh9QYBAIENACH3BgEAgQ0AIfkGAQCADQAh-gYBAIANACEKlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAHvBgEAAAAB9QYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAQWWBgEAAAABngZAAAAAAZ8GQAAAAAHOBgAAAPEHAu8HQAAAAAESAwAA3A4AIAYAANQOACAIAADbDgAgDAAA1Q4AIA8AANYOACAhAADaDgAgIwAA1w4AICUAANgOACCWBgEAAAABlwYBAAAAAZgGAQAAAAGZBgEAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAABAgAAALABACBnAADcHQAgAwAAAF8AIGcAANwdACBoAADgHQAgFAAAAF8AIAMAAIsNACAGAACDDQAgCAAAig0AIAwAAIQNACAPAACFDQAgIQAAiQ0AICMAAIYNACAlAACHDQAgYAAA4B0AIJYGAQCADQAhlwYBAIANACGYBgEAgA0AIZkGAQCADQAhmgYBAIENACGbBgEAgA0AIZwGAQCADQAhnQYBAIANACGeBkAAgg0AIZ8GQACCDQAhEgMAAIsNACAGAACDDQAgCAAAig0AIAwAAIQNACAPAACFDQAgIQAAiQ0AICMAAIYNACAlAACHDQAglgYBAIANACGXBgEAgA0AIZgGAQCADQAhmQYBAIANACGaBgEAgQ0AIZsGAQCADQAhnAYBAIANACGdBgEAgA0AIZ4GQACCDQAhnwZAAIINACEDAAAAEwAgZwAAuB0AIGgAAOMdACAlAAAAEwAgCwAAghMAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAgYAAA4x0AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwsAAIITACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhAwAAACwAIGcAALodACBoAADmHQAgCwAAACwAIAsAAPgPACAbAAD8DwAgKAAA-Q8AICoAAPsPACBgAADmHQAglgYBAIANACGbBgEAgA0AIe8GAQCADQAh8AZAAIINACHxBkAAgg0AIQkLAAD4DwAgGwAA_A8AICgAAPkPACAqAAD7DwAglgYBAIANACGbBgEAgA0AIe8GAQCADQAh8AZAAIINACHxBkAAgg0AIQMAAAAaACBnAAC8HQAgaAAA6R0AIBAAAAAaACAGAACeEQAgCAAAnxEAIA4AAJwRACBgAADpHQAglgYBAIANACGbBgEAgA0AIZwGAQCADQAhngZAAIINACGfBkAAgg0AIccGAQCADQAh9QYBAIENACH_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_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIGAAAIQeACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AISMLAACCEwAgDAAA9hIAIBsAAP4SACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AIQMAAAAeACBnAAD7HQAgaAAAhx4AIBAAAAAeACAGAAC0EQAgCAAAtREAIAkAAPIUACAMAAC2EQAgYAAAhx4AIJYGAQCADQAhmwYBAIANACGcBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYEHAgC2EAAhhwcBAIENACHPBwEAgA0AIdAHAQCADQAhDgYAALQRACAIAAC1EQAgCQAA8hQAIAwAALYRACCWBgEAgA0AIZsGAQCADQAhnAYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGBBwIAthAAIYcHAQCBDQAhzwcBAIANACHQBwEAgA0AIQMAAAAyACBnAAD9HQAgaAAAih4AIBIAAAAyACAGAAC7EAAgCAAAvBAAIAwAALgQACAaAACNEQAgIwAAuhAAICkAAL0QACBgAACKHgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIe8GAQCADQAh9QYBAIENACH2BgIAthAAIfcGAQCADQAh-AYBAIENACEQBgAAuxAAIAgAALwQACAMAAC4EAAgGgAAjREAICMAALoQACApAAC9EAAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIe8GAQCADQAh9QYBAIENACH2BgIAthAAIfcGAQCADQAh-AYBAIENACEHlgYBAAAAAZsGAQAAAAGcBgEAAAABngZAAAAAAZ8GQAAAAAG-BgEAAAABvwYBAAAAARkHAADZFwAgCwAAmRcAIAwAAJEXACAPAACSFwAgGwAAmBcAICgAAI4XACAqAACXFwAgLAAAmhcAIDAAAIsXACAxAACMFwAgMgAAjRcAIDMAAI8XACA0AACQFwAgNQAAkxcAIDcAAJUXACA4AACWFwAgOQAAmxcAIDoAAJwXACCWBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABhgcBAAAAAboHAQAAAAHNBwEAAAABAgAAABcAIGcAAIweACAjCwAAtBcAIAwAAKgXACAPAACpFwAgGwAAsBcAICgAAKMXACAqAACvFwAgLAAAtRcAIDAAAKAXACAxAAChFwAgMgAApBcAIDMAAKYXACA0AACnFwAgNQAAqxcAIDcAAK0XACA4AACuFwAgOgAAuhcAIDwAAJ8XACA9AACiFwAgPgAApRcAIEIAALMXACBDAACqFwAgRAAAsRcAIEUAALIXACBKAAC2FwAgSwAAtxcAIEwAALgXACBNAAC5FwAglgYBAAAAAZ4GQAAAAAGfBkAAAAABygYAAAC8BwPvBgEAAAAB9QYBAAAAAboHAQAAAAG9BwEAAAABAgAAAJ0FACBnAACOHgAgEAYAAN0QACAIAADeEAAgDAAA2hAAIA8AANsQACAaAACOEQAgKQAA3xAAIJYGAQAAAAGbBgEAAAABnAYBAAAAAZ4GQAAAAAGfBkAAAAAB7wYBAAAAAfUGAQAAAAH2BgIAAAAB9wYBAAAAAfgGAQAAAAECAAAANAAgZwAAkB4AIBkHAADZFwAgCwAAmRcAIAwAAJEXACAPAACSFwAgGwAAmBcAICgAAI4XACAqAACXFwAgLAAAmhcAIDAAAIsXACAxAACMFwAgMgAAjRcAIDMAAI8XACA0AACQFwAgNQAAkxcAIDYAAJQXACA4AACWFwAgOQAAmxcAIDoAAJwXACCWBgEAAAABngZAAAAAAZ8GQAAAAAH1BgEAAAABhgcBAAAAAboHAQAAAAHNBwEAAAABAgAAABcAIGcAAJIeACAjCwAAtBcAIAwAAKgXACAPAACpFwAgGwAAsBcAICgAAKMXACAqAACvFwAgLAAAtRcAIDAAAKAXACAxAAChFwAgMgAApBcAIDMAAKYXACA0AACnFwAgNQAAqxcAIDYAAKwXACA4AACuFwAgOgAAuhcAIDwAAJ8XACA9AACiFwAgPgAApRcAIEIAALMXACBDAACqFwAgRAAAsRcAIEUAALIXACBKAAC2FwAgSwAAtxcAIEwAALgXACBNAAC5FwAglgYBAAAAAZ4GQAAAAAGfBkAAAAABygYAAAC8BwPvBgEAAAAB9QYBAAAAAboHAQAAAAG9BwEAAAABAgAAAJ0FACBnAACUHgAgDwMAAOMPACAGAADhDwAgCAAA4g8AIAwAAOQPACAZAADmDwAgGwAA5w8AICEAAOgPACCWBgEAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GQAAAAAGfBkAAAAAB6wYBAAAAAQIAAACzAQAgZwAAlh4AIAMAAAAVACBnAACSHgAgaAAAmh4AIBsAAAAVACAHAADYFwAgCwAA4BUAIAwAANgVACAPAADZFQAgGwAA3xUAICgAANUVACAqAADeFQAgLAAA4RUAIDAAANIVACAxAADTFQAgMgAA1BUAIDMAANYVACA0AADXFQAgNQAA2hUAIDYAANsVACA4AADdFQAgOQAA4hUAIDoAAOMVACBgAACaHgAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGGBwEAgQ0AIboHAQCBDQAhzQcBAIANACEZBwAA2BcAIAsAAOAVACAMAADYFQAgDwAA2RUAIBsAAN8VACAoAADVFQAgKgAA3hUAICwAAOEVACAwAADSFQAgMQAA0xUAIDIAANQVACAzAADWFQAgNAAA1xUAIDUAANoVACA2AADbFQAgOAAA3RUAIDkAAOIVACA6AADjFQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGGBwEAgQ0AIboHAQCBDQAhzQcBAIANACEDAAAAEwAgZwAAlB4AIGgAAJ0eACAlAAAAEwAgCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAgYAAAnR4AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwsAAIITACAMAAD2EgAgDwAA9xIAIBsAAP4SACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhAwAAAFEAIGcAAJYeACBoAACgHgAgEQAAAFEAIAMAAJMPACAGAACRDwAgCAAAkg8AIAwAAJQPACAZAACWDwAgGwAAlw8AICEAAJgPACBgAACgHgAglgYBAIANACGaBgEAgQ0AIZsGAQCADQAhnAYBAIENACGdBgEAgA0AIZ4GQACCDQAhnwZAAIINACHrBgEAgA0AIQ8DAACTDwAgBgAAkQ8AIAgAAJIPACAMAACUDwAgGQAAlg8AIBsAAJcPACAhAACYDwAglgYBAIANACGaBgEAgQ0AIZsGAQCADQAhnAYBAIENACGdBgEAgA0AIZ4GQACCDQAhnwZAAIINACHrBgEAgA0AIQqWBgEAAAABmwYBAAAAAZwGAQAAAAGeBkAAAAABnwZAAAAAAcIGAQAAAAHDBgEAAAABxAYBAAAAAcUGAQAAAAHGBkAAAAABAwAAABUAIGcAAIweACBoAACkHgAgGwAAABUAIAcAANgXACALAADgFQAgDAAA2BUAIA8AANkVACAbAADfFQAgKAAA1RUAICoAAN4VACAsAADhFQAgMAAA0hUAIDEAANMVACAyAADUFQAgMwAA1hUAIDQAANcVACA1AADaFQAgNwAA3BUAIDgAAN0VACA5AADiFQAgOgAA4xUAIGAAAKQeACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIRkHAADYFwAgCwAA4BUAIAwAANgVACAPAADZFQAgGwAA3xUAICgAANUVACAqAADeFQAgLAAA4RUAIDAAANIVACAxAADTFQAgMgAA1BUAIDMAANYVACA0AADXFQAgNQAA2hUAIDcAANwVACA4AADdFQAgOQAA4hUAIDoAAOMVACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIQMAAAATACBnAACOHgAgaAAApx4AICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAACnHgAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_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_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAgYAAAux4AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwsAAIITACAMAAD2EgAgDwAA9xIAIBsAAP4SACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDYAAPoSACA3AAD7EgAgOAAA_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_BgEAAAABwAYBAAAAAcIGAQAAAAH3BgEAAAABhwcBAAAAAc4HQAAAAAECAAAAJQAgZwAAyh4AIAMAAAAVACBnAADGHgAgaAAAzh4AIBsAAAAVACAHAADYFwAgCwAA4BUAIAwAANgVACAPAADZFQAgGwAA3xUAICgAANUVACAqAADeFQAgLAAA4RUAIDAAANIVACAxAADTFQAgMgAA1BUAIDMAANYVACA0AADXFQAgNQAA2hUAIDYAANsVACA3AADcFQAgOQAA4hUAIDoAAOMVACBgAADOHgAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGGBwEAgQ0AIboHAQCBDQAhzQcBAIANACEZBwAA2BcAIAsAAOAVACAMAADYFQAgDwAA2RUAIBsAAN8VACAoAADVFQAgKgAA3hUAICwAAOEVACAwAADSFQAgMQAA0xUAIDIAANQVACAzAADWFQAgNAAA1xUAIDUAANoVACA2AADbFQAgNwAA3BUAIDkAAOIVACA6AADjFQAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAh9QYBAIENACGGBwEAgQ0AIboHAQCBDQAhzQcBAIANACEDAAAAEwAgZwAAyB4AIGgAANEeACAlAAAAEwAgCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAgYAAA0R4AIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhIwsAAIITACAMAAD2EgAgDwAA9xIAIBsAAP4SACAoAADxEgAgKgAA_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBMAACGEwAgTQAAhxMAIJYGAQCADQAhngZAAIINACGfBkAAgg0AIcoGAADSErwHI-8GAQCADQAh9QYBAIENACG6BwEAgQ0AIb0HAQCBDQAhAwAAACMAIGcAAMoeACBoAADUHgAgGAAAACMAIAYAAKAOACAIAACdDgAgCQAAng4AIAoAAJcOACANAACcDgAgDgAAmg4AIBAAAN4PACAYAACbDgAgGgAAnw4AIC4AAJgOACBgAADUHgAglgYBAIANACGbBgEAgA0AIZwGAQCBDQAhngZAAIINACGfBkAAgg0AIb4GAQCADQAhvwYBAIANACHABgEAgA0AIcIGAQCADQAh9wYBAIANACGHBwEAgQ0AIc4HQACCDQAhFgYAAKAOACAIAACdDgAgCQAAng4AIAoAAJcOACANAACcDgAgDgAAmg4AIBAAAN4PACAYAACbDgAgGgAAnw4AIC4AAJgOACCWBgEAgA0AIZsGAQCADQAhnAYBAIENACGeBkAAgg0AIZ8GQACCDQAhvgYBAIANACG_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_RIAICwAAIMTACAwAADuEgAgMQAA7xIAIDIAAPISACAzAAD0EgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIGAAAPAeACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AISMLAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACHKBgAA0hK8ByPvBgEAgA0AIfUGAQCBDQAhugcBAIENACG9BwEAgQ0AIQMAAAATACBnAADgHgAgaAAA8x4AICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgMwAA9BIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIE0AAIcTACBgAADzHgAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDMAAPQSACA0AAD1EgAgNQAA-RIAIDYAAPoSACA3AAD7EgAgOAAA_BIAIDoAAIgTACA8AADtEgAgPQAA8BIAID4AAPMSACBCAACBEwAgQwAA-BIAIEQAAP8SACBFAACAEwAgSgAAhBMAIEsAAIUTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEPlgYBAAAAAZ4GQAAAAAGfBkAAAAABwgYBAAAAAc4GAAAArAcC0AZAAAAAAdMGAQAAAAGqBwAAAKoHAqwHAQAAAAGtBwEAAAABrgcBAAAAAa8HAQAAAAGwBwEAAAABsQcBAAAAAbIHQAAAAAEDAAAATwAgZwAAsh0AIGgAAPceACAlAAAATwAgBAAAgRgAIAUAAIIYACAYAACFGAAgNQAAiBgAIDoAAJUYACA-AACDGAAgQwAAhhgAIE4AAIcYACBPAACJGAAgUAAAihgAIFEAAIsYACBSAACMGAAgUwAAjRgAIFQAAI4YACBVAACPGAAgVgAAkBgAIFcAAJEYACBYAACSGAAgWQAAkxgAIFoAAJQYACBgAAD3HgAglgYBAIANACGaBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIaYHAQCADQAh5gcBAIANACHnByAA4g4AIegHAQCBDQAh6QcBAIENACHqBwEAgQ0AIesHAQCBDQAh7AcBAIENACHtBwEAgQ0AIe4HAQCADQAhIwQAAIEYACAFAACCGAAgGAAAhRgAIDUAAIgYACA6AACVGAAgPgAAgxgAIEMAAIYYACBOAACHGAAgTwAAiRgAIFAAAIoYACBRAACLGAAgUgAAjBgAIFMAAI0YACBUAACOGAAgVQAAjxgAIFYAAJAYACBXAACRGAAgWAAAkhgAIFkAAJMYACBaAACUGAAglgYBAIANACGaBgEAgQ0AIZ4GQACCDQAhnwZAAIINACHvBgEAgA0AIaYHAQCADQAh5gcBAIANACHnByAA4g4AIegHAQCBDQAh6QcBAIENACHqBwEAgQ0AIesHAQCBDQAh7AcBAIENACHtBwEAgQ0AIe4HAQCADQAhAwAAABUAIGcAALQdACBoAAD6HgAgGwAAABUAIAcAANgXACALAADgFQAgDAAA2BUAIA8AANkVACAbAADfFQAgKAAA1RUAICoAAN4VACAsAADhFQAgMAAA0hUAIDEAANMVACAyAADUFQAgNAAA1xUAIDUAANoVACA2AADbFQAgNwAA3BUAIDgAAN0VACA5AADiFQAgOgAA4xUAIGAAAPoeACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIRkHAADYFwAgCwAA4BUAIAwAANgVACAPAADZFQAgGwAA3xUAICgAANUVACAqAADeFQAgLAAA4RUAIDAAANIVACAxAADTFQAgMgAA1BUAIDQAANcVACA1AADaFQAgNgAA2xUAIDcAANwVACA4AADdFQAgOQAA4hUAIDoAAOMVACCWBgEAgA0AIZ4GQACCDQAhnwZAAIINACH1BgEAgQ0AIYYHAQCBDQAhugcBAIENACHNBwEAgA0AIQMAAAATACBnAAC2HQAgaAAA_R4AICUAAAATACALAACCEwAgDAAA9hIAIA8AAPcSACAbAAD-EgAgKAAA8RIAICoAAP0SACAsAACDEwAgMAAA7hIAIDEAAO8SACAyAADyEgAgNAAA9RIAIDUAAPkSACA2AAD6EgAgNwAA-xIAIDgAAPwSACA6AACIEwAgPAAA7RIAID0AAPASACA-AADzEgAgQgAAgRMAIEMAAPgSACBEAAD_EgAgRQAAgBMAIEoAAIQTACBLAACFEwAgTAAAhhMAIE0AAIcTACBgAAD9HgAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEjCwAAghMAIAwAAPYSACAPAAD3EgAgGwAA_hIAICgAAPESACAqAAD9EgAgLAAAgxMAIDAAAO4SACAxAADvEgAgMgAA8hIAIDQAAPUSACA1AAD5EgAgNgAA-hIAIDcAAPsSACA4AAD8EgAgOgAAiBMAIDwAAO0SACA9AADwEgAgPgAA8xIAIEIAAIETACBDAAD4EgAgRAAA_xIAIEUAAIATACBKAACEEwAgSwAAhRMAIEwAAIYTACBNAACHEwAglgYBAIANACGeBkAAgg0AIZ8GQACCDQAhygYAANISvAcj7wYBAIANACH1BgEAgQ0AIboHAQCBDQAhvQcBAIENACEDAwACBgAGCAAIFgQGAwUKBBCvAhEUAD4YsAIUNbMCHjrFAgE-DgVDsQIwTrICME-0Ah5QtgI7UbcCFVK4AhVTugI8VL4CPVW_AhtWwAIbV8ECOVjCAjlZwwI1WsQCNwEDAAIBAwACAgMAAgYABh0L_AENDOEBCw_iARAUADob9AEYKNwBDyrzARks_QEMMNYBCTHXASMy3QEKM98BETTgARQ17wEeNvABEjfxARM48gEhOpMCATwSBz3bASg-3gEFQvsBMUPmATBE9gEzRfoBNEqBAjVLjwI5TJECG02SAhsDBhQGFAAvOxgIFAcZBwu9AQ0MtQELD7YBEBQALhu8ARgorgEPKrsBGSy-AQwwHQkxrAEjMq0BCjOxARE0tAEUNbcBHja4ARI3uQETOLoBITm_ARs6wgEBBQYABggACAynAQsOIQoUAC0GBgAGCAAICSIJDCYLD6QBEBQALAwGAAYIoAEICaEBCQoqDA0ADw4AChAAERQAKxgAFBoADi6eASovnwEhBQaZAQYImgEIJgALKwANLQAoBQaUAQYIlQEICisMFAAnGi0OBgsxDQyJAQsUACYbjgEYKDUPKo0BGQgGAAYIgAEIDDYLDzoQFAAlGgAOI38SKYIBIwUGAAYIfggNAA8OAAoQABEKAwACBgAGCAAIDDsLDzwQFAAiIXcbI0ASJWweJ3UhBgYABghBCA0ADxAAERQAHSJFEwQGAAYIZwgRABIYABQJAwACBgAGCEYIDEcLEkgTFAAcGUwVG1YYIVwbBBUAFhYAAhdQAhhSFAITTRUUABcBE04ABQYABggACBgAFBoADhwAGQUGAAYIAAgUABoaAA4bVxgBG1gABxBgERddAhheFB0ABh4ABh8AAiBhCAUMYgASYwAZZAAbZQAhZgABImgABgYABghxCBBwERUAHxdvAiQAAgITbR4UACABE24ABAYABgh2CBAAESYACwYMeAAPeQAhfQAjegAlewAnfAAEBgAGCIMBCBQAJCiEAQ8BKIUBAAMMhgEAD4cBACOIAQAFC48BAAyRAQAbkwEAKJABACqSAQABCpYBAAMGAAYUACkslwEMASyYAQABJgALAgqiAQAuowEAAgylAQAPpgEAAgypAQAOqAEAEgvRAQAMyQEAD8oBABvQAQAoxgEAKs8BACzSAQAwwwEAMcQBADLFAQAzxwEANMgBADXLAQA2zAEAN80BADjOAQA50wEAOtQBAAE71QEABQboAQYUADI_AAJA5wECQuwBMQIGAAZB7QEwAULuAQABBgAGAQYABgUGAAYUADhGAAJIhQI2SYkCNwFHADUCAwACRwA1AkiKAgBJiwIAAwYABh8AAkCQAgIbC6gCAAydAgAPngIAG6UCACiYAgAqpAIALKkCADCVAgAxlgIAMpkCADObAgA0nAIANaACADahAgA3ogIAOKMCADquAgA8lAIAPZcCAD6aAgBCpwIAQ58CAEWmAgBKqgIAS6sCAEysAgBNrQIAASQAAgEWAAIBAwACEwTGAgAFxwIAEMkCABjKAgA1zQIAOtgCAD7IAgBDywIATswCAE_OAgBRzwIAUtACAFTRAgBV0gIAVtMCAFfUAgBY1QIAWdYCAFrXAgAAAwMAAgYABggACAMDAAIGAAYIAAgDFABDbQBEbgBFAAAAAxQAQ20ARG4ARQIDAAIGAAYCAwACBgAGAxQASm0AS24ATAAAAAMUAEptAEtuAEwBJgALASYACwMUAFFtAFJuAFMAAAADFABRbQBSbgBTAAADFABYbQBZbgBaAAAAAxQAWG0AWW4AWgEDAAIBAwACAxQAX20AYG4AYQAAAAMUAF9tAGBuAGEBAwACAQMAAgMUAGZtAGduAGgAAAADFABmbQBnbgBoAAAAAxQAbm0Ab24AcAAAAAMUAG5tAG9uAHABAwACAQMAAgMUAHVtAHZuAHcAAAADFAB1bQB2bgB3AgYABgiXBAgCBgAGCJ0ECAMUAHxtAH1uAH4AAAADFAB8bQB9bgB-AQYABgEGAAYFFACDAW0AhgFuAIcB_wEAhAGAAgCFAQAAAAAABRQAgwFtAIYBbgCHAf8BAIQBgAIAhQEDBgAGCAAICcUECQMGAAYIAAgJywQJBRQAjAFtAI8BbgCQAf8BAI0BgAIAjgEAAAAAAAUUAIwBbQCPAW4AkAH_AQCNAYACAI4BCAYABgjdBAgJ3gQJDQAPDgAKEAARGAAUGgAOCAYABgjkBAgJ5QQJDQAPDgAKEAARGAAUGgAOAxQAlQFtAJYBbgCXAQAAAAMUAJUBbQCWAW4AlwEBB_cEBwEH_QQHAxQAnAFtAJ0BbgCeAQAAAAMUAJwBbQCdAW4AngEBBo8FBgEGlQUGAxQAowFtAKQBbgClAQAAAAMUAKMBbQCkAW4ApQEAAAMUAKoBbQCrAW4ArAEAAAADFACqAW0AqwFuAKwBAwbABQY_AAJAvwUCAwbHBQY_AAJAxgUCBRQAsQFtALQBbgC1Af8BALIBgAIAswEAAAAAAAUUALEBbQC0AW4AtQH_AQCyAYACALMBAwYABh8AAkDZBQIDBgAGHwACQN8FAgMUALoBbQC7AW4AvAEAAAADFAC6AW0AuwFuALwBBxDzBREX8QUCGPIFFB0ABh4ABh8AAiD0BQgHEPwFERf6BQIY-wUUHQAGHgAGHwACIP0FCAMUAMEBbQDCAW4AwwEAAAADFADBAW0AwgFuAMMBAgYABkYAAgIGAAZGAAIDFADIAW0AyQFuAMoBAAAAAxQAyAFtAMkBbgDKAQFHADUBRwA1AxQAzwFtANABbgDRAQAAAAMUAM8BbQDQAW4A0QECAwACRwA1AgMAAkcANQMUANYBbQDXAW4A2AEAAAADFADWAW0A1wFuANgBAwYABggACBoADgMGAAYIAAgaAA4FFADdAW0A4AFuAOEB_wEA3gGAAgDfAQAAAAAABRQA3QFtAOABbgDhAf8BAN4BgAIA3wEFBgAGCAAIGAAUGgAOHAAZBQYABggACBgAFBoADhwAGQUUAOYBbQDpAW4A6gH_AQDnAYACAOgBAAAAAAAFFADmAW0A6QFuAOoB_wEA5wGAAgDoAQEGAAYBBgAGAxQA7wFtAPABbgDxAQAAAAMUAO8BbQDwAW4A8QEBBgAGAQYABgUUAPYBbQD5AW4A-gH_AQD3AYACAPgBAAAAAAAFFAD2AW0A-QFuAPoB_wEA9wGAAgD4AQAAAxQA_wFtAIACbgCBAgAAAAMUAP8BbQCAAm4AgQIAAAMUAIYCbQCHAm4AiAIAAAADFACGAm0AhwJuAIgCAgYABggACAIGAAYIAAgFFACNAm0AkAJuAJEC_wEAjgKAAgCPAgAAAAAABRQAjQJtAJACbgCRAv8BAI4CgAIAjwIFBvMHBgj0BwgmAAsrAA0tACgFBvoHBgj7BwgmAAsrAA0tACgDFACWAm0AlwJuAJgCAAAAAxQAlgJtAJcCbgCYAgMGjggGCI8ICBqNCA4DBpYIBgiXCAgalQgOAxQAnQJtAJ4CbgCfAgAAAAMUAJ0CbQCeAm4AnwIEBgAGCKkICBoADimqCCMEBgAGCLAICBoADimxCCMFFACkAm0ApwJuAKgC_wEApQKAAgCmAgAAAAAABRQApAJtAKcCbgCoAv8BAKUCgAIApgIAAAMUAK0CbQCuAm4ArwIAAAADFACtAm0ArgJuAK8CARYAAgEWAAIDFAC0Am0AtQJuALYCAAAAAxQAtAJtALUCbgC2AgQVABYWAAIX8wgCGPQIFAQVABYWAAIX-ggCGPsIFAMUALsCbQC8Am4AvQIAAAADFAC7Am0AvAJuAL0CAwMAAgYABgiNCQgDAwACBgAGCJMJCAMUAMICbQDDAm4AxAIAAAADFADCAm0AwwJuAMQCAgYABkGlCTACBgAGQasJMAUUAMkCbQDMAm4AzQL_AQDKAoACAMsCAAAAAAAFFADJAm0AzAJuAM0C_wEAygKAAgDLAgQGAAYIvQkIEAARJgALBAYABgjDCQgQABEmAAsFFADSAm0A1QJuANYC_wEA0wKAAgDUAgAAAAAABRQA0gJtANUCbgDWAv8BANMCgAIA1AIGBgAGCNcJCBDWCREVAB8X1QkCJAACBgYABgjfCQgQ3gkRFQAfF90JAiQAAgMUANsCbQDcAm4A3QIAAAADFADbAm0A3AJuAN0CBAYABgjxCQgNAA8QABEEBgAGCPcJCA0ADxAAEQMUAOICbQDjAm4A5AIAAAADFADiAm0A4wJuAOQCBAYABgiJCggRABIYABQEBgAGCI8KCBEAEhgAFAMUAOkCbQDqAm4A6wIAAAADFADpAm0A6gJuAOsCBQYABgihCggNAA8OAAoQABEFBgAGCKcKCA0ADw4AChAAEQMUAPACbQDxAm4A8gIAAAADFADwAm0A8QJuAPICASQAAgEkAAIDFAD3Am0A-AJuAPkCAAAAAxQA9wJtAPgCbgD5AgMDAAIGAAYIAAgDAwACBgAGCAAIAxQA_gJtAP8CbgCAAwAAAAMUAP4CbQD_Am4AgANbAgFc2QIBXdoCAV7bAgFf3AIBYd4CAWLgAj9j4QJAZOMCAWXlAj9m5gJBaecCAWroAgFr6QI_b-wCQnDtAkZx7gIFcu8CBXPwAgV08QIFdfICBXb0AgV39gI_ePcCR3n5AgV6-wI_e_wCSHz9AgV9_gIFfv8CP3-CA0mAAYMDTYEBhAMqggGFAyqDAYYDKoQBhwMqhQGIAyqGAYoDKocBjAM_iAGNA06JAY8DKooBkQM_iwGSA0-MAZMDKo0BlAMqjgGVAz-PAZgDUJABmQNUkQGbAwKSAZwDApMBngMClAGfAwKVAaADApYBogMClwGkAz-YAaUDVZkBpwMCmgGpAz-bAaoDVpwBqwMCnQGsAwKeAa0DP58BsANXoAGxA1uhAbIDA6IBswMDowG0AwOkAbUDA6UBtgMDpgG4AwOnAboDP6gBuwNcqQG9AwOqAb8DP6sBwANdrAHBAwOtAcIDA64BwwM_rwHGA16wAccDYrEByAMEsgHJAwSzAcoDBLQBywMEtQHMAwS2Ac4DBLcB0AM_uAHRA2O5AdMDBLoB1QM_uwHWA2S8AdcDBL0B2AMEvgHZAz-_AdwDZcAB3QNpwQHfA2rCAeADasMB4wNqxAHkA2rFAeUDasYB5wNqxwHpAz_IAeoDa8kB7ANqygHuAz_LAe8DbMwB8ANqzQHxA2rOAfIDP88B9QNt0AH2A3HRAfcDPdIB-AM90wH5Az3UAfoDPdUB-wM91gH9Az3XAf8DP9gBgARy2QGCBD3aAYQEP9sBhQRz3AGGBD3dAYcEPd4BiAQ_3wGLBHTgAYwEeOEBjQQj4gGOBCPjAY8EI-QBkAQj5QGRBCPmAZMEI-cBlQQ_6AGWBHnpAZkEI-oBmwQ_6wGcBHrsAZ4EI-0BnwQj7gGgBD_vAaMEe_ABpAR_8QGlBCjyAaYEKPMBpwQo9AGoBCj1AakEKPYBqwQo9wGtBD_4Aa4EgAH5AbAEKPoBsgQ_-wGzBIEB_AG0BCj9AbUEKP4BtgQ_gQK5BIIBggK6BIgBgwK7BAqEArwECoUCvQQKhgK-BAqHAr8ECogCwQQKiQLDBD-KAsQEiQGLAscECowCyQQ_jQLKBIoBjgLMBAqPAs0ECpACzgQ_kQLRBIsBkgLSBJEBkwLTBAuUAtQEC5UC1QQLlgLWBAuXAtcEC5gC2QQLmQLbBD-aAtwEkgGbAuAEC5wC4gQ_nQLjBJMBngLmBAufAucEC6AC6AQ_oQLrBJQBogLsBJgBowLtBAikAu4ECKUC7wQIpgLwBAinAvEECKgC8wQIqQL1BD-qAvYEmQGrAvkECKwC-wQ_rQL8BJoBrgL-BAivAv8ECLACgAU_sQKDBZsBsgKEBZ8BswKFBQe0AoYFB7UChwUHtgKIBQe3AokFB7gCiwUHuQKNBT-6Ao4FoAG7ApEFB7wCkwU_vQKUBaEBvgKWBQe_ApcFB8ACmAU_wQKbBaIBwgKcBaYBwwKeBQbEAp8FBsUCoQUGxgKiBQbHAqMFBsgCpQUGyQKnBT_KAqgFpwHLAqoFBswCrAU_zQKtBagBzgKuBQbPAq8FBtACsAU_0QKzBakB0gK0Ba0B0wK1BTDUArYFMNUCtwUw1gK4BTDXArkFMNgCuwUw2QK9BT_aAr4FrgHbAsIFMNwCxAU_3QLFBa8B3gLIBTDfAskFMOACygU_4QLNBbAB4gLOBbYB4wLPBTnkAtAFOeUC0QU55gLSBTnnAtMFOegC1QU56QLXBT_qAtgFtwHrAtsFOewC3QU_7QLeBbgB7gLgBTnvAuEFOfAC4gU_8QLlBbkB8gLmBb0B8wLnBRv0AugFG_UC6QUb9gLqBRv3AusFG_gC7QUb-QLvBT_6AvAFvgH7AvYFG_wC-AU__QL5Bb8B_gL-BRv_Av8FG4ADgAY_gQODBsABggOEBsQBgwOFBjWEA4YGNYUDhwY1hgOIBjWHA4kGNYgDiwY1iQONBj-KA44GxQGLA5AGNYwDkgY_jQOTBsYBjgOUBjWPA5UGNZADlgY_kQOZBscBkgOaBssBkwObBjaUA5wGNpUDnQY2lgOeBjaXA58GNpgDoQY2mQOjBj-aA6QGzAGbA6YGNpwDqAY_nQOpBs0BngOqBjafA6sGNqADrAY_oQOvBs4BogOwBtIBowOxBjekA7IGN6UDswY3pgO0BjenA7UGN6gDtwY3qQO5Bj-qA7oG0wGrA7wGN6wDvgY_rQO_BtQBrgPABjevA8EGN7ADwgY_sQPFBtUBsgPGBtkBswPHBhm0A8gGGbUDyQYZtgPKBhm3A8sGGbgDzQYZuQPPBj-6A9AG2gG7A9IGGbwD1AY_vQPVBtsBvgPWBhm_A9cGGcAD2AY_wQPbBtwBwgPcBuIBwwPdBhjEA94GGMUD3wYYxgPgBhjHA-EGGMgD4wYYyQPlBj_KA-YG4wHLA-gGGMwD6gY_zQPrBuQBzgPsBhjPA-0GGNAD7gY_0QPxBuUB0gPyBusB0wP0BjPUA_UGM9UD9wYz1gP4BjPXA_kGM9gD-wYz2QP9Bj_aA_4G7AHbA4AHM9wDggc_3QODB-0B3gOEBzPfA4UHM-ADhgc_4QOJB-4B4gOKB_IB4wOLBzTkA4wHNOUDjQc05gOOBzTnA48HNOgDkQc06QOTBz_qA5QH8wHrA5YHNOwDmAc_7QOZB_QB7gOaBzTvA5sHNPADnAc_8QOfB_UB8gOgB_sB8wOiBx_0A6MHH_UDpgcf9gOnBx_3A6gHH_gDqgcf-QOsBz_6A60H_AH7A68HH_wDsQc__QOyB_0B_gOzBx__A7QHH4AEtQc_gQS4B_4BggS5B4ICgwS7BxaEBLwHFoUEvwcWhgTABxaHBMEHFogEwwcWiQTFBz-KBMYHgwKLBMgHFowEygc_jQTLB4QCjgTMBxaPBM0HFpAEzgc_kQTRB4UCkgTSB4kCkwTTBwmUBNQHCZUE1QcJlgTWBwmXBNcHCZgE2QcJmQTbBz-aBNwHigKbBN4HCZwE4Ac_nQThB4sCngTiBwmfBOMHCaAE5Ac_oQTnB4wCogToB5ICowTpBwykBOoHDKUE6wcMpgTsBwynBO0HDKgE7wcMqQTxBz-qBPIHkwKrBPYHDKwE-Ac_rQT5B5QCrgT8BwyvBP0HDLAE_gc_sQSBCJUCsgSCCJkCswSDCA20BIQIDbUEhQgNtgSGCA23BIcIDbgEiQgNuQSLCD-6BIwImgK7BJEIDbwEkwg_vQSUCJsCvgSYCA2_BJkIDcAEmgg_wQSdCJwCwgSeCKACwwSfCA_EBKAID8UEoQgPxgSiCA_HBKMID8gEpQgPyQSnCD_KBKgIoQLLBKwID8wErgg_zQSvCKICzgSyCA_PBLMID9AEtAg_0QS3CKMC0gS4CKkC0wS6CA7UBLsIDtUEvQgO1gS-CA7XBL8IDtgEwQgO2QTDCD_aBMQIqgLbBMYIDtwEyAg_3QTJCKsC3gTKCA7fBMsIDuAEzAg_4QTPCKwC4gTQCLAC4wTSCDzkBNMIPOUE1Qg85gTWCDznBNcIPOgE2Qg86QTbCD_qBNwIsQLrBN4IPOwE4Ag_7QThCLIC7gTiCDzvBOMIPPAE5Ag_8QTnCLMC8gToCLcC8wTpCBX0BOoIFfUE6wgV9gTsCBX3BO0IFfgE7wgV-QTxCD_6BPIIuAL7BPYIFfwE-Ag__QT5CLkC_gT8CBX_BP0IFYAF_gg_gQWBCboCggWCCb4CgwWDCRSEBYQJFIUFhQkUhgWGCRSHBYcJFIgFiQkUiQWLCT-KBYwJvwKLBY8JFIwFkQk_jQWSCcACjgWUCRSPBZUJFJAFlgk_kQWZCcECkgWaCcUCkwWbCTGUBZwJMZUFnQkxlgWeCTGXBZ8JMZgFoQkxmQWjCT-aBaQJxgKbBacJMZwFqQk_nQWqCccCngWsCTGfBa0JMaAFrgk_oQWxCcgCogWyCc4CowWzCSGkBbQJIaUFtQkhpgW2CSGnBbcJIagFuQkhqQW7CT-qBbwJzwKrBb8JIawFwQk_rQXCCdACrgXECSGvBcUJIbAFxgk_sQXJCdECsgXKCdcCswXLCR60BcwJHrUFzQketgXOCR63Bc8JHrgF0QkeuQXTCT-6BdQJ2AK7BdkJHrwF2wk_vQXcCdkCvgXgCR6_BeEJHsAF4gk_wQXlCdoCwgXmCd4CwwXnCRLEBegJEsUF6QkSxgXqCRLHBesJEsgF7QkSyQXvCT_KBfAJ3wLLBfMJEswF9Qk_zQX2CeACzgX4CRLPBfkJEtAF-gk_0QX9CeEC0gX-CeUC0wX_CRPUBYAKE9UFgQoT1gWCChPXBYMKE9gFhQoT2QWHCj_aBYgK5gLbBYsKE9wFjQo_3QWOCucC3gWQChPfBZEKE-AFkgo_4QWVCugC4gWWCuwC4wWXChDkBZgKEOUFmQoQ5gWaChDnBZsKEOgFnQoQ6QWfCj_qBaAK7QLrBaMKEOwFpQo_7QWmCu4C7gWoChDvBakKEPAFqgo_8QWtCu8C8gWuCvMC8wWwCjv0BbEKO_UFswo79gW0Cjv3BbUKO_gFtwo7-QW5Cj_6BboK9AL7BbwKO_wFvgo__QW_CvUC_gXACjv_BcEKO4AGwgo_gQbFCvYCggbGCvoCgwbHChGEBsgKEYUGyQoRhgbKChGHBssKEYgGzQoRiQbPCj-KBtAK-wKLBtIKEYwG1Ao_jQbVCvwCjgbWChGPBtcKEZAG2Ao_kQbbCv0CkgbcCoED"
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
function adminDepartmentWorkspaceSelectionDelegate() {
  return prisma.adminDepartmentWorkspaceSelection;
}
var FEE_PAYMENT_STATUS_SUCCESS = "SUCCESS";
async function saveAdminDepartmentWorkspaceSelection(userId, institutionId, departmentId) {
  await adminDepartmentWorkspaceSelectionDelegate().upsert({
    where: {
      userId_institutionId: {
        userId,
        institutionId
      }
    },
    create: {
      userId,
      institutionId,
      departmentId
    },
    update: {
      departmentId
    }
  });
}
async function clearAdminDepartmentWorkspaceSelection(userId, institutionId) {
  await adminDepartmentWorkspaceSelectionDelegate().deleteMany({
    where: {
      userId,
      institutionId
    }
  });
}
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
    if (isInstitutionAdmin || isFacultyAdmin) {
      await saveAdminDepartmentWorkspaceSelection(userId, adminProfile.institutionId, byId.id);
    }
    return {
      institutionId: adminProfile.institutionId,
      departmentId: byId.id
    };
  }
  if (isInstitutionAdmin || isFacultyAdmin) {
    const selectedWorkspace = await adminDepartmentWorkspaceSelectionDelegate().findFirst({
      where: {
        userId,
        institutionId: adminProfile.institutionId
      },
      select: {
        departmentId: true
      }
    });
    if (selectedWorkspace?.departmentId) {
      const selectedDepartment = await prisma.department.findFirst({
        where: {
          id: selectedWorkspace.departmentId,
          faculty: {
            institutionId: adminProfile.institutionId
          }
        },
        select: {
          id: true
        }
      });
      if (selectedDepartment?.id) {
        return {
          institutionId: adminProfile.institutionId,
          departmentId: selectedDepartment.id
        };
      }
      await clearAdminDepartmentWorkspaceSelection(userId, adminProfile.institutionId);
    }
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
    if (isInstitutionAdmin || isFacultyAdmin) {
      await saveAdminDepartmentWorkspaceSelection(
        userId,
        adminProfile.institutionId,
        departments[0].id
      );
    }
    if (isDepartmentAdmin || canAccessForUniversity || canAccessForNonUniversity) {
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
var listDepartmentWorkspaceOptions = async (userId) => {
  const context = await resolveAcademicInstitutionContext(userId);
  if (context.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError2(403, "Only institution admins can manage department workspace selection");
  }
  const departments = await prisma.department.findMany({
    where: {
      faculty: {
        institutionId: context.institutionId
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
    orderBy: [{ createdAt: "asc" }, { fullName: "asc" }]
  });
  if (departments.length === 0) {
    return {
      institutionId: context.institutionId,
      activeDepartmentId: null,
      departments: []
    };
  }
  const selectedWorkspace = await adminDepartmentWorkspaceSelectionDelegate().findFirst({
    where: {
      userId,
      institutionId: context.institutionId
    },
    select: {
      departmentId: true
    }
  });
  const selectedExists = Boolean(
    selectedWorkspace?.departmentId && departments.some((department) => department.id === selectedWorkspace.departmentId)
  );
  const activeDepartmentId = selectedExists ? selectedWorkspace.departmentId : departments[0].id;
  if (!selectedExists) {
    await saveAdminDepartmentWorkspaceSelection(userId, context.institutionId, activeDepartmentId);
  }
  return {
    institutionId: context.institutionId,
    activeDepartmentId,
    departments
  };
};
var setActiveDepartmentWorkspace = async (userId, payload) => {
  const context = await resolveAcademicInstitutionContext(userId);
  if (context.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError2(403, "Only institution admins can manage department workspace selection");
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
    throw createHttpError2(404, "Department not found for this institution");
  }
  await saveAdminDepartmentWorkspaceSelection(userId, context.institutionId, department.id);
  return {
    institutionId: context.institutionId,
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
  listDepartmentWorkspaceOptions,
  setActiveDepartmentWorkspace,
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
var listDepartmentWorkspaceOptions2 = catchAsync(async (_req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listDepartmentWorkspaceOptions(user.id);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Department workspace options fetched successfully",
    data: result
  });
});
var setActiveDepartmentWorkspace2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.setActiveDepartmentWorkspace(user.id, req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Active department workspace updated successfully",
    data: result
  });
});
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
  listDepartmentWorkspaceOptions: listDepartmentWorkspaceOptions2,
  setActiveDepartmentWorkspace: setActiveDepartmentWorkspace2,
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
  listDepartmentWorkspaceOptionsSchema: z2.object({
    query: z2.object({})
  }),
  setActiveDepartmentWorkspaceSchema: z2.object({
    body: z2.object({
      departmentId: uuidSchema2
    })
  }),
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
router2.get(
  "/workspace/department-options",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.listDepartmentWorkspaceOptionsSchema),
  DepartmentController.listDepartmentWorkspaceOptions
);
router2.put(
  "/workspace/department-selection",
  requireSessionRole(...departmentRoles),
  validateRequest(DepartmentValidation.setActiveDepartmentWorkspaceSchema),
  DepartmentController.setActiveDepartmentWorkspace
);
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
function createHttpError4(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
var requestInstitutionLeave = async (userId, userRole, payload) => {
  if (userRole !== "TEACHER" && userRole !== "STUDENT") {
    throw createHttpError4(403, "Only teacher or student can request institution leave");
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
    throw createHttpError4(400, "No institution assignment found for this account");
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
    throw createHttpError4(
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
    throw createHttpError4(404, "Institution leave request not found");
  }
  if (leaveRequest.status !== "PENDING") {
    throw createHttpError4(400, "Only pending leave requests can be reviewed");
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
import { z as z4 } from "zod";
var passwordSchema2 = z4.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(
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
var leaveInstitutionSchema = z4.object({
  body: z4.object({
    reason: z4.string("reason must be a string").trim().max(300).optional()
  })
});
var listInstitutionLeaveRequestsSchema = z4.object({
  query: z4.object({
    status: z4.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
  })
});
var reviewInstitutionLeaveRequestSchema = z4.object({
  params: z4.object({
    requestId: z4.uuid("Please provide a valid leave request id")
  }),
  body: z4.object({
    status: z4.enum(["APPROVED", "REJECTED"])
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
router3.post(
  "/leave-institution",
  requireSessionRole("TEACHER", "STUDENT"),
  validateRequest(AuthValidation.leaveInstitutionSchema),
  AuthController.leaveInstitution
);
router3.get(
  "/leave-institution/superadmin",
  requireSessionRole("SUPERADMIN"),
  validateRequest(AuthValidation.listInstitutionLeaveRequestsSchema),
  AuthController.listInstitutionLeaveRequests
);
router3.patch(
  "/leave-institution/superadmin/:requestId/review",
  requireSessionRole("SUPERADMIN"),
  validateRequest(AuthValidation.reviewInstitutionLeaveRequestSchema),
  AuthController.reviewInstitutionLeaveRequest
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
function createHttpError5(statusCode, message) {
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
    throw createHttpError5(403, "Only faculty-level admins can access this resource");
  }
  const canUseFacultyFeatures = adminProfile.role === AdminRole.FACULTYADMIN || adminProfile.role === AdminRole.INSTITUTIONADMIN;
  if (!canUseFacultyFeatures) {
    throw createHttpError5(403, "Only faculty-level admins can access this resource");
  }
  return adminProfile;
}
var updateFacultyDisplayName = async (userId, payload) => {
  const adminProfile = await resolveFacultyManagementContext(userId);
  const normalizedName = (payload.fullName ?? payload.name ?? "").trim();
  const hasFacultyMutation = Boolean(payload.fullName || payload.name || payload.shortName || payload.description) || Boolean(payload.facultyId);
  if (hasFacultyMutation && !normalizedName) {
    throw createHttpError5(400, "Full name is required when updating faculty details");
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
          throw createHttpError5(
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
        throw createHttpError5(404, "Faculty not found");
      }
      if (!targetFaculty.institutionId || targetFaculty.institutionId !== adminProfile.institutionId) {
        throw createHttpError5(403, "You can only update faculty under your institution");
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
      throw createHttpError5(404, "Faculty not found for this institution");
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
      throw createHttpError5(
        404,
        "No faculty found for this institution. Update faculty profile first"
      );
    }
    if (faculties.length > 1) {
      throw createHttpError5(400, "Multiple faculties found. Please provide facultyId");
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
function createHttpError6(statusCode, message) {
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
    throw createHttpError6(403, "Only institution admins can list institution options");
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
function createHttpError7(statusCode, message) {
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
    throw createHttpError7(403, "Only institution admins can manage semesters");
  }
  if (creatorAdminProfile.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError7(403, "Only institution admins can manage semesters");
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
    throw createHttpError7(
      400,
      "storeId, storePassword and baseUrl are required for SSLCommerz credential setup"
    );
  }
  let normalizedBaseUrl;
  try {
    normalizedBaseUrl = new URL(resolvedBaseUrl).toString().replace(/\/$/, "");
  } catch {
    throw createHttpError7(400, "baseUrl must be a valid URL");
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
    throw createHttpError7(400, "Invalid subscription plan selected");
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
    throw createHttpError7(404, "User not found");
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
    throw createHttpError7(502, failureMessage);
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
    throw createHttpError7(400, "Invalid startDate or endDate");
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate <= today) {
    throw createHttpError7(400, "startDate must be after today");
  }
  if (startDate >= endDate) {
    throw createHttpError7(400, "startDate must be before endDate");
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
    throw createHttpError7(404, "Semester not found for this institution");
  }
  let nextStartDate = existingSemester.startDate;
  let nextEndDate = existingSemester.endDate;
  if (payload.startDate) {
    const parsedStartDate = new Date(payload.startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw createHttpError7(400, "Invalid startDate");
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedStartDate <= today) {
      throw createHttpError7(400, "startDate must be after today");
    }
    nextStartDate = parsedStartDate;
  }
  if (payload.endDate) {
    const parsedEndDate = new Date(payload.endDate);
    if (Number.isNaN(parsedEndDate.getTime())) {
      throw createHttpError7(400, "Invalid endDate");
    }
    nextEndDate = parsedEndDate;
  }
  if (nextStartDate >= nextEndDate) {
    throw createHttpError7(400, "startDate must be before endDate");
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
    throw createHttpError7(404, "Semester not found for this institution");
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
    throw createHttpError7(403, "Only institution-level admins can view faculties");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, "DEPARTMENT")) {
    throw createHttpError7(403, "You are not allowed to view faculties for department creation");
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
    throw createHttpError7(403, "Only institution-level admins can create sub-admin accounts");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, payload.accountType)) {
    throw createHttpError7(
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
    throw createHttpError7(500, "Failed to create account");
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
        throw createHttpError7(404, "Faculty not found for this institution");
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
          throw createHttpError7(
            400,
            "Cannot create department without a faculty. Provide faculty fields first"
          );
        }
        if (faculties.length > 1) {
          throw createHttpError7(
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
  initiateSubscriptionRenewalSchema: z7.object({
    body: z7.object({
      plan: z7.enum(["MONTHLY", "HALF_YEARLY", "YEARLY"])
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
router6.post(
  "/subscription/renew/initiate",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.initiateSubscriptionRenewalSchema),
  InstitutionAdminController.initiateSubscriptionRenewal
);
router6.get(
  "/subscription/renew/payment/success",
  InstitutionAdminController.handleRenewalPaymentSuccess
);
router6.get(
  "/subscription/renew/payment/fail",
  InstitutionAdminController.handleRenewalPaymentFail
);
router6.get(
  "/subscription/renew/payment/cancel",
  InstitutionAdminController.handleRenewalPaymentCancel
);
router6.post(
  "/subscription/renew/payment/success",
  InstitutionAdminController.handleRenewalPaymentSuccess
);
router6.post(
  "/subscription/renew/payment/fail",
  InstitutionAdminController.handleRenewalPaymentFail
);
router6.post(
  "/subscription/renew/payment/cancel",
  InstitutionAdminController.handleRenewalPaymentCancel
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
function createHttpError8(statusCode, message) {
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
  const raw2 = process.env.FRONTEND_PUBLIC_URL?.trim() || process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() || DEFAULT_FRONTEND_BASE2;
  return raw2.replace(/\/$/, "");
}
function getBackendBaseUrl2() {
  const raw2 = process.env.BACKEND_PUBLIC_URL?.trim() || process.env.BASE_URL?.trim();
  if (!raw2) {
    throw createHttpError8(
      500,
      "Backend public URL is not configured. Set BACKEND_PUBLIC_URL in environment."
    );
  }
  return raw2.replace(/\/$/, "");
}
function getSslCommerzBaseUrl2() {
  const envBaseUrl = process.env.SSLCOMMERZ_BASE_URL?.trim().replace(/\/$/, "");
  return envBaseUrl || "https://sandbox.sslcommerz.com";
}
function getSslCommerzCredentials2() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  if (!storeId || !storePassword) {
    throw createHttpError8(
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
    throw createHttpError8(400, "You are already assigned to an institution");
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
    throw createHttpError8(400, "You already have a pending application");
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
    throw createHttpError8(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError8(400, "Only pending applications can receive subscription payments");
  }
  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
    throw createHttpError8(400, "Subscription payment already completed for this application");
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
    throw createHttpError8(404, "User not found");
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
    throw createHttpError8(502, failureMessage);
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
    throw createHttpError8(403, "Only institution admins can view institution payment details");
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
    throw createHttpError8(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError8(400, "Application already reviewed");
  }
  if (payload.status === InstitutionApplicationStatus.APPROVED) {
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
      throw createHttpError8(400, "Subscription payment is pending for this application");
    }
    if (!application.subscriptionPlan || !application.subscriptionMonths || !application.subscriptionAmount) {
      throw createHttpError8(400, "Subscription metadata is missing for this application");
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
function createHttpError9(statusCode, message) {
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
    throw createHttpError9(404, "User not found");
  }
  if (user.role === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { institutionId: true }
    });
    if (!teacherProfile?.institutionId) {
      throw createHttpError9(403, "Teacher is not assigned to any institution yet");
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
      throw createHttpError9(403, "Student is not assigned to any institution yet");
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
      throw createHttpError9(403, "Admin is not assigned to any institution");
    }
    const resolvedRole = adminProfile.role === AdminRole.FACULTYADMIN ? "FACULTY" : adminProfile.role === AdminRole.DEPARTMENTADMIN ? "DEPARTMENT" : "ADMIN";
    return {
      userId,
      institutionId: adminProfile.institutionId,
      role: resolvedRole
    };
  }
  throw createHttpError9(403, "Unsupported role for notices");
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
    throw createHttpError9(404, "Notice not found");
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
    throw createHttpError9(403, "Only admin, faculty, and department can send notices");
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
    throw createHttpError9(404, "Notice not found");
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
    throw createHttpError9(404, "Notice not found");
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
    throw createHttpError9(404, "Notice not found");
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
function createHttpError10(statusCode, message) {
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
    throw createHttpError10(403, "Only admin users under an institution can manage postings");
  }
  return adminProfile;
}
async function resolveScopedIds(userId, payload) {
  const context = await resolveAdminContext(userId);
  if (context.role === AdminRole.INSTITUTIONADMIN) {
    if (!payload.facultyId || !payload.departmentId) {
      throw createHttpError10(
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
      throw createHttpError10(404, "Faculty not found for this institution");
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
      throw createHttpError10(404, "Department not found under selected faculty");
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
      throw createHttpError10(400, "Faculty admin must provide departmentId");
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
      throw createHttpError10(404, "Department not found for this institution");
    }
    if (!department.facultyId) {
      throw createHttpError10(400, "Department is not assigned to a faculty");
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
      throw createHttpError10(404, "Department not found for this institution");
    }
    if (departments.length > 1) {
      throw createHttpError10(400, "Multiple departments found. Contact institution admin to resolve mapping");
    }
    return {
      institutionId: context.institutionId,
      facultyId: departments[0].facultyId,
      departmentId: departments[0].id,
      programId: null
    };
  }
  throw createHttpError10(403, "Unsupported admin role for posting management");
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
    throw createHttpError10(404, "Teacher job post not found");
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
    throw createHttpError10(404, "Student admission post not found");
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
    throw createHttpError10(404, "Teacher job post not found");
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
    throw createHttpError10(404, "Student admission post not found");
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
  throw createHttpError10(403, "Unsupported admin role for posting options");
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
  const result = await PostingService.getPostingOptions(user.id, readQueryValue7(req.query.search));
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Posting options fetched successfully",
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
function createHttpError11(statusCode, message) {
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
    throw createHttpError11(403, "No institution context found for this account");
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
function createHttpError12(statusCode, message) {
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
    throw createHttpError12(
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
    throw createHttpError12(404, "Student account not found");
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
    throw createHttpError12(403, "Student is not assigned to any institution yet");
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
    throw createHttpError12(404, "Classwork not found");
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
    throw createHttpError12(403, "You are not registered in this classwork section");
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
    throw createHttpError12(409, "Submission already exists. Please update it.");
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
    throw createHttpError12(404, "Submission not found");
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
    throw createHttpError12(404, "Submission not found");
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
    throw createHttpError12(409, "Application profile already exists. Use update instead.");
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
    throw createHttpError12(404, "Application profile not found");
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
    throw createHttpError12(404, "Application profile not found");
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
    throw createHttpError12(
      400,
      "Complete your application profile and upload required documents before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError12(400, "You are already assigned to an institution");
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
    throw createHttpError12(404, "Student admission posting not found");
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
    throw createHttpError12(409, "You already applied to this admission post");
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
    throw createHttpError12(403, "Student is not assigned to a department yet");
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
    throw createHttpError12(403, "Student is not assigned to a department yet");
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
    throw createHttpError12(404, "No fee configuration found for the selected semester/session");
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
    throw createHttpError12(409, "No due amount left for this semester/session");
  }
  const mode = payload.paymentMode;
  let requestedAmount = dueAmount;
  let monthsCovered = 0;
  if (mode === FEE_PAYMENT_MODE_MONTHLY) {
    const monthsCount = payload.monthsCount ?? 0;
    if (!monthsCount || monthsCount < 1) {
      throw createHttpError12(400, "monthsCount must be at least 1 for monthly payment");
    }
    requestedAmount = toMoneyNumber4(Math.min(dueAmount, monthlyFeeAmount * monthsCount));
    monthsCovered = monthsCount;
  } else {
    monthsCovered = Math.max(1, Math.ceil(dueAmount / Math.max(monthlyFeeAmount, 1)));
  }
  if (requestedAmount <= 0) {
    throw createHttpError12(400, "Invalid payment amount");
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
    throw createHttpError12(502, failureMessage);
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
function createHttpError13(statusCode, message) {
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
    throw createHttpError13(400, "Invalid date");
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
    throw createHttpError13(400, `${fieldName} cannot be negative`);
  }
  if (value > maxValue) {
    throw createHttpError13(400, `${fieldName} cannot exceed ${maxValue}`);
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
    throw createHttpError13(404, "User not found");
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
    throw createHttpError13(403, "Teacher is not assigned to any institution yet");
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
    throw createHttpError13(403, "Only institution admins can perform this action");
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
    throw createHttpError13(409, "Application profile already exists. Use update instead.");
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
    throw createHttpError13(404, "Application profile not found");
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
    throw createHttpError13(404, "Application profile not found");
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
    throw createHttpError13(
      400,
      "Complete your application profile (academic records, experiences, resume, and skills) before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError13(400, "You are already assigned to an institution");
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
    throw createHttpError13(404, "Teacher posting not found");
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
    throw createHttpError13(409, "You already applied to this posting");
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
      throw createHttpError13(403, "You are not assigned to this section");
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
    throw createHttpError13(403, "You are not assigned to this section");
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
    throw createHttpError13(404, "Classwork not found");
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
    throw createHttpError13(404, "Classwork not found");
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
    throw createHttpError13(404, "No students found for this section");
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
    throw createHttpError13(404, "No students found for this section");
  }
  const allowedRegistrationIds = new Set(registrations.map((item) => item.id));
  for (const item of payload.items) {
    if (!allowedRegistrationIds.has(item.courseRegistrationId)) {
      throw createHttpError13(400, "One or more attendance records are outside your assigned section");
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
    throw createHttpError13(404, "No students found for this section");
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
    throw createHttpError13(404, "Course registration not found for this teacher");
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
      throw createHttpError13(400, `${field} is not allowed for this course type`);
    }
    enforceMaxMark(value, max, field);
    dataToSave[field] = toTwoDecimals2(value);
  }
  if (Object.keys(dataToSave).length === 0) {
    throw createHttpError13(400, "No valid marks field provided for this course type");
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
    throw createHttpError13(404, "Application not found");
  }
  if (application.status === TeacherJobApplicationStatus.APPROVED || application.status === TeacherJobApplicationStatus.REJECTED) {
    throw createHttpError13(400, "Application has already been reviewed");
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
    throw createHttpError13(400, "departmentId is required to approve this application");
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
    throw createHttpError13(404, "Department not found for this institution");
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
      throw createHttpError13(400, "teacherInitial, teachersId and designation are required for approval");
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
