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
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n  requestedTransferRequests            InstitutionTransferRequest[]  @relation("TransferRequestRequesterUser")\n  reviewedTransferRequests             InstitutionTransferRequest[]  @relation("TransferRequestReviewerUser")\n  requestedInstitutionLeaveRequests    InstitutionLeaveRequest[]     @relation("InstitutionLeaveRequestRequester")\n  reviewedInstitutionLeaveRequests     InstitutionLeaveRequest[]     @relation("InstitutionLeaveRequestReviewer")\n  sentNotices                          Notice[]                      @relation("NoticeSenderUser")\n  readNotices                          NoticeRead[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                           Program[]\n  batches                            Batch[]\n  courses                            Course[]\n  sections                           Section[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  transferRequestsAsTargetDepartment InstitutionTransferRequest[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum InstitutionSubscriptionPlan {\n  MONTHLY\n  HALF_YEARLY\n  YEARLY\n}\n\nenum InstitutionSubscriptionPaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionSubscriptionStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionTransferEntityType {\n  STUDENT\n  TEACHER\n}\n\nenum InstitutionTransferStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  CANCELLED\n}\n\nenum InstitutionLeaveRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum NoticeAudienceRole {\n  ADMIN\n  FACULTY\n  DEPARTMENT\n  TEACHER\n  STUDENT\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                                  @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                                @default(now())\n  updatedAt                   DateTime                                @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n  paymentGatewayCredential    InstitutionPaymentGatewayCredential?\n  renewalPayments             InstitutionSubscriptionRenewalPayment[]\n  subscriptions               InstitutionSubscription[]\n  schedules                   Schedule[]\n  routines                    Routine[]\n  notices                     Notice[]\n  leaveRequests               InstitutionLeaveRequest[]\n  sourceTransferRequests      InstitutionTransferRequest[]            @relation("TransferRequestSourceInstitution")\n  targetTransferRequests      InstitutionTransferRequest[]            @relation("TransferRequestTargetInstitution")\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  subscriptionPlan              InstitutionSubscriptionPlan?\n  subscriptionAmount            Decimal?                             @db.Decimal(12, 2)\n  subscriptionCurrency          String                               @default("BDT")\n  subscriptionMonths            Int?\n  subscriptionPaymentStatus     InstitutionSubscriptionPaymentStatus @default(PENDING)\n  subscriptionTranId            String?                              @unique\n  subscriptionGatewayStatus     String?\n  subscriptionGatewaySessionKey String?                              @unique\n  subscriptionGatewayValId      String?\n  subscriptionGatewayBankTranId String?\n  subscriptionGatewayCardType   String?\n  subscriptionGatewayRawPayload Json?\n  subscriptionPaidAt            DateTime?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution?              @relation(fields: [institutionId], references: [id])\n  subscriptions InstitutionSubscription[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel InstitutionLeaveRequest {\n  id String @id @default(uuid())\n\n  requesterUserId String\n  requesterUser   User   @relation("InstitutionLeaveRequestRequester", fields: [requesterUserId], references: [id])\n\n  requesterRole UserRole\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  status InstitutionLeaveRequestStatus @default(PENDING)\n  reason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionLeaveRequestReviewer", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([requesterUserId, status])\n  @@index([institutionId, status])\n  @@map("institution_leave_requests")\n}\n\nmodel InstitutionTransferRequest {\n  id String @id @default(uuid())\n\n  entityType InstitutionTransferEntityType\n  status     InstitutionTransferStatus     @default(PENDING)\n\n  sourceInstitutionId String\n  sourceInstitution   Institution @relation("TransferRequestSourceInstitution", fields: [sourceInstitutionId], references: [id])\n\n  targetInstitutionId String\n  targetInstitution   Institution @relation("TransferRequestTargetInstitution", fields: [targetInstitutionId], references: [id])\n\n  requesterUserId String\n  requesterUser   User   @relation("TransferRequestRequesterUser", fields: [requesterUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TransferRequestReviewerUser", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  targetDepartmentId String?\n  targetDepartment   Department? @relation(fields: [targetDepartmentId], references: [id])\n\n  requestMessage  String?\n  responseMessage String?\n\n  requestedAt DateTime  @default(now())\n  reviewedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceInstitutionId, status])\n  @@index([targetInstitutionId, status])\n  @@index([requesterUserId])\n  @@index([studentProfileId])\n  @@index([teacherProfileId])\n  @@map("institution_transfer_requests")\n}\n\nmodel Notice {\n  id      String @id @default(uuid())\n  title   String\n  content String\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  senderUserId String\n  senderUser   User               @relation("NoticeSenderUser", fields: [senderUserId], references: [id])\n  senderRole   NoticeAudienceRole\n\n  recipients NoticeRecipientRole[]\n  reads      NoticeRead[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, createdAt])\n  @@index([senderUserId, createdAt])\n  @@map("notices")\n}\n\nmodel NoticeRecipientRole {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  role NoticeAudienceRole\n\n  createdAt DateTime @default(now())\n\n  @@unique([noticeId, role])\n  @@index([role])\n  @@map("notice_recipient_roles")\n}\n\nmodel NoticeRead {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  readAt DateTime @default(now())\n\n  @@unique([noticeId, userId])\n  @@index([userId, readAt])\n  @@map("notice_reads")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel InstitutionPaymentGatewayCredential {\n  id                               String      @id @default(uuid())\n  institutionId                    String      @unique\n  institution                      Institution @relation(fields: [institutionId], references: [id])\n  sslCommerzStoreIdEncrypted       String\n  sslCommerzStorePasswordEncrypted String\n  sslCommerzBaseUrlEncrypted       String\n  sslCommerzStoreIdHash            String\n  sslCommerzStorePasswordHash      String\n  sslCommerzBaseUrlHash            String\n  isActive                         Boolean     @default(true)\n  lastUpdatedByUserId              String?\n  createdAt                        DateTime    @default(now())\n  updatedAt                        DateTime    @updatedAt\n\n  @@index([institutionId, isActive])\n  @@map("institution_payment_gateway_credentials")\n}\n\nmodel InstitutionSubscriptionRenewalPayment {\n  id                String                               @id @default(uuid())\n  institutionId     String\n  institution       Institution                          @relation(fields: [institutionId], references: [id])\n  initiatedByUserId String\n  plan              InstitutionSubscriptionPlan\n  amount            Decimal                              @db.Decimal(12, 2)\n  currency          String                               @default("BDT")\n  monthsCovered     Int\n  status            InstitutionSubscriptionPaymentStatus @default(PENDING)\n  tranId            String                               @unique\n  gatewayStatus     String?\n  gatewaySessionKey String?                              @unique\n  gatewayValId      String?\n  gatewayBankTranId String?\n  gatewayCardType   String?\n  gatewayRawPayload Json?\n  paidAt            DateTime?\n  createdAt         DateTime                             @default(now())\n  updatedAt         DateTime                             @updatedAt\n\n  @@index([institutionId, status, createdAt])\n  @@index([initiatedByUserId, status])\n  @@map("institution_subscription_renewal_payments")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  semesterId String?\n  semester   Semester? @relation(fields: [semesterId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  startTime String\n  endTime   String\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@index([semesterId])\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  schedules           Schedule[]\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n  transferRequests      InstitutionTransferRequest[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel InstitutionSubscription {\n  id String @id @default(uuid())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  sourceApplicationId String?\n  sourceApplication   InstitutionApplication? @relation(fields: [sourceApplicationId], references: [id])\n\n  plan          InstitutionSubscriptionPlan\n  status        InstitutionSubscriptionStatus @default(ACTIVE)\n  amount        Decimal                       @db.Decimal(12, 2)\n  currency      String                        @default("BDT")\n  monthsCovered Int\n  startsAt      DateTime\n  endsAt        DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, status, endsAt])\n  @@index([sourceApplicationId])\n  @@map("institution_subscriptions")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String?\n  institution               Institution?                     @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n  transferRequests          InstitutionTransferRequest[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"requestedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestRequesterUser"},{"name":"reviewedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestReviewerUser"},{"name":"requestedInstitutionLeaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionLeaveRequestRequester"},{"name":"reviewedInstitutionLeaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionLeaveRequestReviewer"},{"name":"sentNotices","kind":"object","type":"Notice","relationName":"NoticeSenderUser"},{"name":"readNotices","kind":"object","type":"NoticeRead","relationName":"NoticeReadToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentToStudentFeePayment"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"DepartmentToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"DepartmentToRoutine"},{"name":"transferRequestsAsTargetDepartment","kind":"object","type":"InstitutionTransferRequest","relationName":"DepartmentToInstitutionTransferRequest"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"InstitutionToStudentFeePayment"},{"name":"paymentGatewayCredential","kind":"object","type":"InstitutionPaymentGatewayCredential","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"renewalPayments","kind":"object","type":"InstitutionSubscriptionRenewalPayment","relationName":"InstitutionToInstitutionSubscriptionRenewalPayment"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionToInstitutionSubscription"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"InstitutionToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"InstitutionToRoutine"},{"name":"notices","kind":"object","type":"Notice","relationName":"InstitutionToNotice"},{"name":"leaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionToInstitutionLeaveRequest"},{"name":"sourceTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestSourceInstitution"},{"name":"targetTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestTargetInstitution"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"subscriptionPlan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"subscriptionAmount","kind":"scalar","type":"Decimal"},{"name":"subscriptionCurrency","kind":"scalar","type":"String"},{"name":"subscriptionMonths","kind":"scalar","type":"Int"},{"name":"subscriptionPaymentStatus","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"subscriptionTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayStatus","kind":"scalar","type":"String"},{"name":"subscriptionGatewaySessionKey","kind":"scalar","type":"String"},{"name":"subscriptionGatewayValId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayBankTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayCardType","kind":"scalar","type":"String"},{"name":"subscriptionGatewayRawPayload","kind":"scalar","type":"Json"},{"name":"subscriptionPaidAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"InstitutionLeaveRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"InstitutionLeaveRequestRequester"},{"name":"requesterRole","kind":"enum","type":"UserRole"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionLeaveRequest"},{"name":"status","kind":"enum","type":"InstitutionLeaveRequestStatus"},{"name":"reason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionLeaveRequestReviewer"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_leave_requests"},"InstitutionTransferRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"entityType","kind":"enum","type":"InstitutionTransferEntityType"},{"name":"status","kind":"enum","type":"InstitutionTransferStatus"},{"name":"sourceInstitutionId","kind":"scalar","type":"String"},{"name":"sourceInstitution","kind":"object","type":"Institution","relationName":"TransferRequestSourceInstitution"},{"name":"targetInstitutionId","kind":"scalar","type":"String"},{"name":"targetInstitution","kind":"object","type":"Institution","relationName":"TransferRequestTargetInstitution"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"TransferRequestRequesterUser"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TransferRequestReviewerUser"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"targetDepartmentId","kind":"scalar","type":"String"},{"name":"targetDepartment","kind":"object","type":"Department","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"requestMessage","kind":"scalar","type":"String"},{"name":"responseMessage","kind":"scalar","type":"String"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_transfer_requests"},"Notice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToNotice"},{"name":"senderUserId","kind":"scalar","type":"String"},{"name":"senderUser","kind":"object","type":"User","relationName":"NoticeSenderUser"},{"name":"senderRole","kind":"enum","type":"NoticeAudienceRole"},{"name":"recipients","kind":"object","type":"NoticeRecipientRole","relationName":"NoticeToNoticeRecipientRole"},{"name":"reads","kind":"object","type":"NoticeRead","relationName":"NoticeToNoticeRead"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notices"},"NoticeRecipientRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRecipientRole"},{"name":"role","kind":"enum","type":"NoticeAudienceRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_recipient_roles"},"NoticeRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRead"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NoticeReadToUser"},{"name":"readAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_reads"},"DepartmentSemesterFeeConfiguration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"totalFeeAmount","kind":"scalar","type":"Decimal"},{"name":"monthlyFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"}],"dbName":"department_semester_fee_configurations"},"StudentFeePayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentFeePayment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentFeePayment"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SemesterToStudentFeePayment"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentFeePaymentToStudentProfile"},{"name":"feeConfigurationId","kind":"scalar","type":"String"},{"name":"feeConfiguration","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"},{"name":"paymentMode","kind":"enum","type":"StudentFeePaymentMode"},{"name":"status","kind":"enum","type":"StudentFeePaymentStatus"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paymentInitiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_fee_payments"},"InstitutionPaymentGatewayCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"sslCommerzStoreIdEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStoreIdHash","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordHash","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlHash","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"lastUpdatedByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_payment_gateway_credentials"},"InstitutionSubscriptionRenewalPayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscriptionRenewalPayment"},{"name":"initiatedByUserId","kind":"scalar","type":"String"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscription_renewal_payments"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToRoutine"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"ScheduleToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSchedule"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSchedule"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"ScheduleToSemester"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"SemesterToStudentFeePayment"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"StudentFeePaymentToStudentProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"InstitutionSubscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscription"},{"name":"sourceApplicationId","kind":"scalar","type":"String"},{"name":"sourceApplication","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"endsAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscriptions"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","schedules","courseRegistrations","section","course","teacherProfile","sectionTeacherAssignments","classwork","classworkSubmissions","applications","_count","posting","studentUser","reviewerUser","studentProfile","admissionApplications","semester","feePayments","feeConfiguration","sourceInstitution","targetInstitution","requesterUser","targetDepartment","transferRequests","submissions","classworks","sections","batch","feeConfigurations","schedule","courseRegistration","routines","classRoom","attendances","mark","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","transferRequestsAsTargetDepartment","departments","faculties","classrooms","applicantUser","reviewedByUser","sourceApplication","subscriptions","institutionApplications","paymentGatewayCredential","renewalPayments","senderUser","notice","recipients","reads","notices","leaveRequests","sourceTransferRequests","targetTransferRequests","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","requestedTransferRequests","reviewedTransferRequests","requestedInstitutionLeaveRequests","reviewedInstitutionLeaveRequests","sentNotices","readNotices","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","InstitutionLeaveRequest.findUnique","InstitutionLeaveRequest.findUniqueOrThrow","InstitutionLeaveRequest.findFirst","InstitutionLeaveRequest.findFirstOrThrow","InstitutionLeaveRequest.findMany","InstitutionLeaveRequest.createOne","InstitutionLeaveRequest.createMany","InstitutionLeaveRequest.createManyAndReturn","InstitutionLeaveRequest.updateOne","InstitutionLeaveRequest.updateMany","InstitutionLeaveRequest.updateManyAndReturn","InstitutionLeaveRequest.upsertOne","InstitutionLeaveRequest.deleteOne","InstitutionLeaveRequest.deleteMany","InstitutionLeaveRequest.groupBy","InstitutionLeaveRequest.aggregate","InstitutionTransferRequest.findUnique","InstitutionTransferRequest.findUniqueOrThrow","InstitutionTransferRequest.findFirst","InstitutionTransferRequest.findFirstOrThrow","InstitutionTransferRequest.findMany","InstitutionTransferRequest.createOne","InstitutionTransferRequest.createMany","InstitutionTransferRequest.createManyAndReturn","InstitutionTransferRequest.updateOne","InstitutionTransferRequest.updateMany","InstitutionTransferRequest.updateManyAndReturn","InstitutionTransferRequest.upsertOne","InstitutionTransferRequest.deleteOne","InstitutionTransferRequest.deleteMany","InstitutionTransferRequest.groupBy","InstitutionTransferRequest.aggregate","Notice.findUnique","Notice.findUniqueOrThrow","Notice.findFirst","Notice.findFirstOrThrow","Notice.findMany","Notice.createOne","Notice.createMany","Notice.createManyAndReturn","Notice.updateOne","Notice.updateMany","Notice.updateManyAndReturn","Notice.upsertOne","Notice.deleteOne","Notice.deleteMany","Notice.groupBy","Notice.aggregate","NoticeRecipientRole.findUnique","NoticeRecipientRole.findUniqueOrThrow","NoticeRecipientRole.findFirst","NoticeRecipientRole.findFirstOrThrow","NoticeRecipientRole.findMany","NoticeRecipientRole.createOne","NoticeRecipientRole.createMany","NoticeRecipientRole.createManyAndReturn","NoticeRecipientRole.updateOne","NoticeRecipientRole.updateMany","NoticeRecipientRole.updateManyAndReturn","NoticeRecipientRole.upsertOne","NoticeRecipientRole.deleteOne","NoticeRecipientRole.deleteMany","NoticeRecipientRole.groupBy","NoticeRecipientRole.aggregate","NoticeRead.findUnique","NoticeRead.findUniqueOrThrow","NoticeRead.findFirst","NoticeRead.findFirstOrThrow","NoticeRead.findMany","NoticeRead.createOne","NoticeRead.createMany","NoticeRead.createManyAndReturn","NoticeRead.updateOne","NoticeRead.updateMany","NoticeRead.updateManyAndReturn","NoticeRead.upsertOne","NoticeRead.deleteOne","NoticeRead.deleteMany","NoticeRead.groupBy","NoticeRead.aggregate","DepartmentSemesterFeeConfiguration.findUnique","DepartmentSemesterFeeConfiguration.findUniqueOrThrow","DepartmentSemesterFeeConfiguration.findFirst","DepartmentSemesterFeeConfiguration.findFirstOrThrow","DepartmentSemesterFeeConfiguration.findMany","DepartmentSemesterFeeConfiguration.createOne","DepartmentSemesterFeeConfiguration.createMany","DepartmentSemesterFeeConfiguration.createManyAndReturn","DepartmentSemesterFeeConfiguration.updateOne","DepartmentSemesterFeeConfiguration.updateMany","DepartmentSemesterFeeConfiguration.updateManyAndReturn","DepartmentSemesterFeeConfiguration.upsertOne","DepartmentSemesterFeeConfiguration.deleteOne","DepartmentSemesterFeeConfiguration.deleteMany","DepartmentSemesterFeeConfiguration.groupBy","DepartmentSemesterFeeConfiguration.aggregate","StudentFeePayment.findUnique","StudentFeePayment.findUniqueOrThrow","StudentFeePayment.findFirst","StudentFeePayment.findFirstOrThrow","StudentFeePayment.findMany","StudentFeePayment.createOne","StudentFeePayment.createMany","StudentFeePayment.createManyAndReturn","StudentFeePayment.updateOne","StudentFeePayment.updateMany","StudentFeePayment.updateManyAndReturn","StudentFeePayment.upsertOne","StudentFeePayment.deleteOne","StudentFeePayment.deleteMany","StudentFeePayment.groupBy","StudentFeePayment.aggregate","InstitutionPaymentGatewayCredential.findUnique","InstitutionPaymentGatewayCredential.findUniqueOrThrow","InstitutionPaymentGatewayCredential.findFirst","InstitutionPaymentGatewayCredential.findFirstOrThrow","InstitutionPaymentGatewayCredential.findMany","InstitutionPaymentGatewayCredential.createOne","InstitutionPaymentGatewayCredential.createMany","InstitutionPaymentGatewayCredential.createManyAndReturn","InstitutionPaymentGatewayCredential.updateOne","InstitutionPaymentGatewayCredential.updateMany","InstitutionPaymentGatewayCredential.updateManyAndReturn","InstitutionPaymentGatewayCredential.upsertOne","InstitutionPaymentGatewayCredential.deleteOne","InstitutionPaymentGatewayCredential.deleteMany","InstitutionPaymentGatewayCredential.groupBy","InstitutionPaymentGatewayCredential.aggregate","InstitutionSubscriptionRenewalPayment.findUnique","InstitutionSubscriptionRenewalPayment.findUniqueOrThrow","InstitutionSubscriptionRenewalPayment.findFirst","InstitutionSubscriptionRenewalPayment.findFirstOrThrow","InstitutionSubscriptionRenewalPayment.findMany","InstitutionSubscriptionRenewalPayment.createOne","InstitutionSubscriptionRenewalPayment.createMany","InstitutionSubscriptionRenewalPayment.createManyAndReturn","InstitutionSubscriptionRenewalPayment.updateOne","InstitutionSubscriptionRenewalPayment.updateMany","InstitutionSubscriptionRenewalPayment.updateManyAndReturn","InstitutionSubscriptionRenewalPayment.upsertOne","InstitutionSubscriptionRenewalPayment.deleteOne","InstitutionSubscriptionRenewalPayment.deleteMany","InstitutionSubscriptionRenewalPayment.groupBy","InstitutionSubscriptionRenewalPayment.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","InstitutionSubscription.findUnique","InstitutionSubscription.findUniqueOrThrow","InstitutionSubscription.findFirst","InstitutionSubscription.findFirstOrThrow","InstitutionSubscription.findMany","InstitutionSubscription.createOne","InstitutionSubscription.createMany","InstitutionSubscription.createManyAndReturn","InstitutionSubscription.updateOne","InstitutionSubscription.updateMany","InstitutionSubscription.updateManyAndReturn","InstitutionSubscription.upsertOne","InstitutionSubscription.deleteOne","InstitutionSubscription.deleteMany","InstitutionSubscription.groupBy","InstitutionSubscription.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","sourceApplicationId","InstitutionSubscriptionPlan","plan","InstitutionSubscriptionStatus","amount","currency","monthsCovered","startsAt","endsAt","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","initiatedByUserId","InstitutionSubscriptionPaymentStatus","tranId","gatewayStatus","gatewaySessionKey","gatewayValId","gatewayBankTranId","gatewayCardType","gatewayRawPayload","paidAt","sslCommerzStoreIdEncrypted","sslCommerzStorePasswordEncrypted","sslCommerzBaseUrlEncrypted","sslCommerzStoreIdHash","sslCommerzStorePasswordHash","sslCommerzBaseUrlHash","isActive","lastUpdatedByUserId","feeConfigurationId","StudentFeePaymentMode","paymentMode","StudentFeePaymentStatus","gatewayName","paymentInitiatedAt","totalFeeAmount","monthlyFeeAmount","noticeId","readAt","NoticeAudienceRole","role","senderUserId","senderRole","InstitutionTransferEntityType","entityType","InstitutionTransferStatus","sourceInstitutionId","targetInstitutionId","requesterUserId","targetDepartmentId","requestMessage","responseMessage","requestedAt","UserRole","requesterRole","InstitutionLeaveRequestStatus","reason","reviewedByUserId","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","subscriptionPlan","subscriptionAmount","subscriptionCurrency","subscriptionMonths","subscriptionPaymentStatus","subscriptionTranId","subscriptionGatewayStatus","subscriptionGatewaySessionKey","subscriptionGatewayValId","subscriptionGatewayBankTranId","subscriptionGatewayCardType","subscriptionGatewayRawPayload","subscriptionPaidAt","InstitutionApplicationStatus","rejectionReason","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","accountStatus","date","AttendanceStatus","AdminRole","noticeId_userId","noticeId_role","postingId_teacherUserId","courseRegistrationId_date","departmentId_semesterId","postingId_studentUserId","classworkId_studentProfileId","sectionId_courseId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "oB75AqAFCwMAAN0KACAHAAChCwAgggYAANsMADCDBgAACwAQhAYAANsMADCFBgEAAAABigYBANgKACGMBgEAAAABjQZAANwKACGOBkAA3AoAIZUHAADcDOEHIgEAAAABACAMAwAA3QoAIIIGAADeDAAwgwYAAAMAEIQGAADeDAAwhQYBANgKACGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHGB0AA3AoAIdIHAQDYCgAh0wcBANkKACHUBwEA2QoAIQMDAADKDgAg0wcAAN8MACDUBwAA3wwAIAwDAADdCgAgggYAAN4MADCDBgAAAwAQhAYAAN4MADCFBgEAAAABjAYBANgKACGNBkAA3AoAIY4GQADcCgAhxgdAANwKACHSBwEAAAAB0wcBANkKACHUBwEA2QoAIQMAAAADACABAAAEADACAAAFACARAwAA3QoAIIIGAADdDAAwgwYAAAcAEIQGAADdDAAwhQYBANgKACGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHJBwEA2AoAIcoHAQDYCgAhywcBANkKACHMBwEA2QoAIc0HAQDZCgAhzgdAAIQMACHPB0AAhAwAIdAHAQDZCgAh0QcBANkKACEIAwAAyg4AIMsHAADfDAAgzAcAAN8MACDNBwAA3wwAIM4HAADfDAAgzwcAAN8MACDQBwAA3wwAINEHAADfDAAgEQMAAN0KACCCBgAA3QwAMIMGAAAHABCEBgAA3QwAMIUGAQAAAAGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHJBwEA2AoAIcoHAQDYCgAhywcBANkKACHMBwEA2QoAIc0HAQDZCgAhzgdAAIQMACHPB0AAhAwAIdAHAQDZCgAh0QcBANkKACEDAAAABwAgAQAACAAwAgAACQAgCwMAAN0KACAHAAChCwAgggYAANsMADCDBgAACwAQhAYAANsMADCFBgEA2AoAIYoGAQDYCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAhlQcAANwM4QciAgMAAMoOACAHAADlEQAgAwAAAAsAIAEAAAwAMAIAAAEAIBYDAADdCgAgBwAAnAwAIAkAALAMACANAACHCwAgEQAA1gsAICIAAOELACAkAADYCwAgSwAAmAsAIEwAANoLACCCBgAA2gwAMIMGAAAOABCEBgAA2gwAMIUGAQDYCgAhhgYBANgKACGHBgEA2AoAIYgGAQDYCgAhiQYBANkKACGKBgEA2QoAIYsGAQDYCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAhCwMAAMoOACAHAADlEQAgCQAAthkAIA0AAOgQACARAACHFwAgIgAAkhcAICQAAIkXACBLAADXEQAgTAAAixcAIIkGAADfDAAgigYAAN8MACAWAwAA3QoAIAcAAJwMACAJAACwDAAgDQAAhwsAIBEAANYLACAiAADhCwAgJAAA2AsAIEsAAJgLACBMAADaCwAgggYAANoMADCDBgAADgAQhAYAANoMADCFBgEAAAABhgYBAAAAAYcGAQAAAAGIBgEA2AoAIYkGAQDZCgAhigYBANkKACGLBgEA2AoAIYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIQMAAAAOACABAAAPADACAAAQACAmBgAA0wsAIAwAAIULACANAACHCwAgEQAA1gsAIBwAAIkLACAlAACGCwAgJwAAiAsAICoAAN4LACAuAADPCwAgLwAA0AsAIDAAANILACAxAADUCwAgMgAA1QsAIDQAAJgLACA1AADYCwAgNgAA2QsAIDcAANoLACA6AADOCwAgOwAA0QsAID8AAN0LACBAAADXCwAgQQAA2wsAIEIAANwLACBHAADfCwAgSAAA4AsAIEkAAOELACBKAADhCwAgggYAAMwLADCDBgAAEgAQhAYAAMwLADCFBgEA2AoAIY0GQADcCgAhjgZAANwKACG5BgAAzQurByPeBgEA2AoAIeQGAQDZCgAhqQcBANkKACGsBwEA2QoAIQEAAAASACAMBwAAnAwAIDkAANkMACCCBgAA2AwAMIMGAAAUABCEBgAA2AwAMIUGAQDYCgAhigYBANkKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACGpBwEA2QoAIbwHAQDYCgAhBQcAAOURACA5AADGGQAgigYAAN8MACDkBgAA3wwAIKkHAADfDAAgDAcAAJwMACA5AADZDAAgggYAANgMADCDBgAAFAAQhAYAANgMADCFBgEAAAABigYBANkKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACGpBwEA2QoAIbwHAQDYCgAhAwAAABQAIAEAABUAMAIAABYAIAEAAAASACAcCAAA1wwAIAwAAIULACANAACHCwAgEQAA1gsAIBwAAIkLACAlAACGCwAgJwAAiAsAICoAAN4LACAuAADPCwAgLwAA0AsAIDAAANILACAxAADUCwAgMgAA1QsAIDQAAJgLACA1AADYCwAgNgAA2QsAIDcAANoLACA4AADhCwAgggYAANYMADCDBgAAGQAQhAYAANYMADCFBgEA2AoAIY0GQADcCgAhjgZAANwKACHkBgEA2QoAIfUGAQDZCgAhqQcBANkKACG8BwEA2AoAIRUIAADFGQAgDAAA5hAAIA0AAOgQACARAACHFwAgHAAA6hAAICUAAOcQACAnAADpEAAgKgAAjxcAIC4AAIAXACAvAACBFwAgMAAAgxcAIDEAAIUXACAyAACGFwAgNAAA1xEAIDUAAIkXACA2AACKFwAgNwAAixcAIDgAAJIXACDkBgAA3wwAIPUGAADfDAAgqQcAAN8MACAcCAAA1wwAIAwAAIULACANAACHCwAgEQAA1gsAIBwAAIkLACAlAACGCwAgJwAAiAsAICoAAN4LACAuAADPCwAgLwAA0AsAIDAAANILACAxAADUCwAgMgAA1QsAIDQAAJgLACA1AADYCwAgNgAA2QsAIDcAANoLACA4AADhCwAgggYAANYMADCDBgAAGQAQhAYAANYMADCFBgEAAAABjQZAANwKACGOBkAA3AoAIeQGAQDZCgAh9QYBANkKACGpBwEA2QoAIbwHAQDYCgAhAwAAABkAIAEAABoAMAIAABsAIAEAAAAUACASBwAAoQsAIAkAALAMACANAACHCwAgDwAA0gsAIIIGAADVDAAwgwYAAB4AEIQGAADVDAAwhQYBANgKACGKBgEA2AoAIYsGAQDYCgAhjQZAANwKACGOBkAA3AoAIbYGAQDYCgAh5AYBANkKACHuBgEA2QoAIe8GQACEDAAh8AYIAKAMACHxBggAoAwAIQkHAADlEQAgCQAAthkAIA0AAOgQACAPAACDFwAg5AYAAN8MACDuBgAA3wwAIO8GAADfDAAg8AYAAN8MACDxBgAA3wwAIBIHAAChCwAgCQAAsAwAIA0AAIcLACAPAADSCwAgggYAANUMADCDBgAAHgAQhAYAANUMADCFBgEAAAABigYBANgKACGLBgEA2AoAIY0GQADcCgAhjgZAANwKACG2BgEA2AoAIeQGAQDZCgAh7gYBANkKACHvBkAAhAwAIfAGCACgDAAh8QYIAKAMACEDAAAAHgAgAQAAHwAwAgAAIAAgEgcAAKELACAJAACwDAAgCgAA0wwAIA0AAIcLACARAADWCwAgggYAANQMADCDBgAAIgAQhAYAANQMADCFBgEA2AoAIYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACHwBgIAmgwAIfYGAQDZCgAhvgcBANgKACG_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AIQMACEDAAAAQAAgAQAAQQAwAgAAQgAgAQAAABkAIBIHAAChCwAgCQAAowwAIBIAAMEMACAZAAC5DAAgggYAAMAMADCDBgAARQAQhAYAAMAMADCFBgEA2AoAIYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAhsAYBANgKACGxBgEA2AoAIbIGAQDZCgAhswYBANkKACG0BgEA2QoAIbUGQADcCgAhCAcAAOURACAJAAC2GQAgEgAAvBkAIBkAALkZACCLBgAA3wwAILIGAADfDAAgswYAAN8MACC0BgAA3wwAIBMHAAChCwAgCQAAowwAIBIAAMEMACAZAAC5DAAgggYAAMAMADCDBgAARQAQhAYAAMAMADCFBgEAAAABigYBANgKACGLBgEA2QoAIY0GQADcCgAhjgZAANwKACGwBgEA2AoAIbEGAQDYCgAhsgYBANkKACGzBgEA2QoAIbQGAQDZCgAhtQZAANwKACHnBwAAvwwAIAMAAABFACABAABGADACAABHACABAAAAEgAgAQAAABkAIAMAAAAnACABAAAoADACAAApACADAAAARQAgAQAARgAwAgAARwAgExYAAL4MACAXAADdCgAgGAAAhQwAIBkAALUMACCCBgAAvAwAMIMGAABNABCEBgAAvAwAMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIbEGAQDZCgAhuwYBANkKACG9BgAAvQzcBiK-BgEA2QoAIb8GQACEDAAhwAZAANwKACHBBgEA2AoAIcIGAQDZCgAh3AYBANgKACEJFgAAuxkAIBcAAMoOACAYAADKDgAgGQAAuRkAILEGAADfDAAguwYAAN8MACC-BgAA3wwAIL8GAADfDAAgwgYAAN8MACAUFgAAvgwAIBcAAN0KACAYAACFDAAgGQAAtQwAIIIGAAC8DAAwgwYAAE0AEIQGAAC8DAAwhQYBAAAAAY0GQADcCgAhjgZAANwKACGxBgEA2QoAIbsGAQDZCgAhvQYAAL0M3AYivgYBANkKACG_BkAAhAwAIcAGQADcCgAhwQYBANgKACHCBgEA2QoAIdwGAQDYCgAh5gcAALsMACADAAAATQAgAQAATgAwAgAATwAgAwAAAE0AIAEAAE4AMAIAAE8AIAEAAABNACAmBAAA8gsAIAUAAPMLACAGAADTCwAgEAAA1AsAIBkAANULACA0AACYCwAgQAAA1wsAIE0AANcLACBOAACYCwAgTwAA9AsAIFAAAJULACBRAACVCwAgUgAA9QsAIFMAAPYLACBUAADhCwAgVQAA4QsAIFYAAOALACBXAADgCwAgWAAA3wsAIFkAAPcLACCCBgAA8QsAMIMGAABTABCEBgAA8QsAMIUGAQDYCgAhiQYBANkKACGNBkAA3AoAIY4GQADcCgAh3gYBANgKACGVBwEA2AoAIdUHAQDYCgAh1gcgANsKACHXBwEA2QoAIdgHAQDZCgAh2QcBANkKACHaBwEA2QoAIdsHAQDZCgAh3AcBANkKACHdBwEA2AoAIQEAAABTACATAwAA3QoAIAcAAJwMACAJAACjDAAgDQAAhwsAIBMAANkLACAaAACVCwAgHAAAiQsAICIAAOELACCCBgAAqQwAMIMGAABVABCEBgAAqQwAMIUGAQDYCgAhiQYBANkKACGKBgEA2QoAIYsGAQDZCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAh2gYBANgKACEBAAAAVQAgHwcAAKELACAJAACwDAAgGQAAuQwAIBsAALEMACAdAAC6DAAgggYAALYMADCDBgAAVwAQhAYAALYMADCFBgEA2AoAIYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAhsQYBANgKACG9BgAAuAyOByLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACHmBgEA2AoAIfoGAQDYCgAh-wYBANkKACH8BgEA2QoAIf0GAQDZCgAh_gYBANkKACH_BgEA2QoAIYAHAACTDAAggQdAAIQMACGKBwEA2AoAIYwHAAC3DIwHIo4HAQDYCgAhjwdAANwKACEMBwAA5REAIAkAALYZACAZAAC5GQAgGwAAuBkAIB0AALoZACD7BgAA3wwAIPwGAADfDAAg_QYAAN8MACD-BgAA3wwAIP8GAADfDAAggAcAAN8MACCBBwAA3wwAIB8HAAChCwAgCQAAsAwAIBkAALkMACAbAACxDAAgHQAAugwAIIIGAAC2DAAwgwYAAFcAEIQGAAC2DAAwhQYBAAAAAYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAhsQYBANgKACG9BgAAuAyOByLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACHmBgEA2AoAIfoGAQAAAAH7BgEA2QoAIfwGAQAAAAH9BgEA2QoAIf4GAQDZCgAh_wYBANkKACGABwAAkwwAIIEHQACEDAAhigcBANgKACGMBwAAtwyMByKOBwEA2AoAIY8HQADcCgAhAwAAAFcAIAEAAFgAMAIAAFkAIAMAAABXACABAABYADACAABZACABAAAAVwAgGhAAAKgMACAYAACFDAAgGQAAtQwAIB4AAKELACAfAAChCwAgIAAA3QoAICEAAKMMACCCBgAAsgwAMIMGAABdABCEBgAAsgwAMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIa8GAQDZCgAhsQYBANkKACG9BgAAtAybByK_BkAAhAwAIcIGAQDZCgAhmQcAALMMmQcimwcBANgKACGcBwEA2AoAIZ0HAQDYCgAhngcBANkKACGfBwEA2QoAIaAHAQDZCgAhoQdAANwKACEOEAAAtRkAIBgAAMoOACAZAAC5GQAgHgAA5REAIB8AAOURACAgAADKDgAgIQAAthkAIK8GAADfDAAgsQYAAN8MACC_BgAA3wwAIMIGAADfDAAgngcAAN8MACCfBwAA3wwAIKAHAADfDAAgGhAAAKgMACAYAACFDAAgGQAAtQwAIB4AAKELACAfAAChCwAgIAAA3QoAICEAAKMMACCCBgAAsgwAMIMGAABdABCEBgAAsgwAMIUGAQAAAAGNBkAA3AoAIY4GQADcCgAhrwYBANkKACGxBgEA2QoAIb0GAAC0DJsHIr8GQACEDAAhwgYBANkKACGZBwAAswyZByKbBwEA2AoAIZwHAQDYCgAhnQcBANgKACGeBwEA2QoAIZ8HAQDZCgAhoAcBANkKACGhB0AA3AoAIQMAAABdACABAABeADACAABfACABAAAAUwAgAQAAAFUAIAEAAAAOACABAAAAGQAgAQAAACcAIAEAAABFACABAAAATQAgAQAAAFcAIAEAAABdACABAAAAGQAgAQAAAEUAIAEAAAAZACANBwAAoQsAIAkAAKMMACAlAACGCwAgggYAAKoMADCDBgAAbQAQhAYAAKoMADCFBgEA2AoAIYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAh3gYBANgKACHkBgEA2QoAIQEAAABtACABAAAAGQAgAwAAADYAIAEAADcAMAIAADgAIAEAAAA2ACABAAAAJwAgAQAAADsAIAEAAABAACADAAAAJwAgAQAAKAAwAgAAKQAgEQcAAKELACAJAACwDAAgGwAAsQwAIBwAAIkLACCCBgAArwwAMIMGAAB2ABCEBgAArwwAMIUGAQDYCgAhigYBANgKACGLBgEA2AoAIY0GQADcCgAhjgZAANwKACHWBgEA2AoAIeYGAQDYCgAhiAcgANsKACGQBxAAkAwAIZEHEACQDAAhBAcAAOURACAJAAC2GQAgGwAAuBkAIBwAAOoQACASBwAAoQsAIAkAALAMACAbAACxDAAgHAAAiQsAIIIGAACvDAAwgwYAAHYAEIQGAACvDAAwhQYBAAAAAYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAh1gYBANgKACHmBgEA2AoAIYgHIADbCgAhkAcQAJAMACGRBxAAkAwAIeUHAACuDAAgAwAAAHYAIAEAAHcAMAIAAHgAIAMAAABXACABAABYADACAABZACABAAAAMgAgAQAAADYAIAEAAAAnACABAAAAdgAgAQAAAFcAIAEAAAASACABAAAAGQAgAQAAACsAIAMAAAArACABAAAsADACAAAtACABAAAAKwAgAQAAABIAIAEAAAAZACAKKQAAoQwAIIIGAACsDAAwgwYAAIcBABCEBgAArAwAMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIb0GAACtDOAHIsMGAQDYCgAh3gdAANwKACEBKQAAtBkAIAspAAChDAAgggYAAKwMADCDBgAAhwEAEIQGAACsDAAwhQYBAAAAAY0GQADcCgAhjgZAANwKACG9BgAArQzgByLDBgEA2AoAId4HQADcCgAh5AcAAKsMACADAAAAhwEAIAEAAIgBADACAACJAQAgGwcAAKELACAJAACjDAAgEAAAogwAICkAAKEMACCCBgAAnwwAMIMGAACLAQAQhAYAAJ8MADCFBgEA2AoAIYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAhrwYBANgKACHDBgEA2AoAIcQGCACgDAAhxQYIAKAMACHGBggAoAwAIccGCACgDAAhyAYIAKAMACHJBggAoAwAIcoGCACgDAAhywYIAKAMACHMBggAoAwAIc0GCACgDAAhzgYIAKAMACHPBggAoAwAIdAGCACgDAAhAQAAAIsBACABAAAAGQAgAQAAABkAIAEAAAAeACABAAAAKwAgAQAAAIcBACADAAAAOwAgAQAAPAAwAgAAPQAgAQAAACcAIAEAAAA7ACADAAAAJwAgAQAAKAAwAgAAKQAgAQAAACIAIAEAAAAnACAFBwAA5REAIAkAALYZACAlAADnEAAgiwYAAN8MACDkBgAA3wwAIA0HAAChCwAgCQAAowwAICUAAIYLACCCBgAAqgwAMIMGAABtABCEBgAAqgwAMIUGAQAAAAGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAId4GAQDYCgAh5AYBANkKACEDAAAAbQAgAQAAmAEAMAIAAJkBACADAAAAIgAgAQAAIwAwAgAAJAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAAOACABAAAPADACAAAQACALAwAAyg4AIAcAAOURACAJAAC2GQAgDQAA6BAAIBMAAIoXACAaAADGEQAgHAAA6hAAICIAAJIXACCJBgAA3wwAIIoGAADfDAAgiwYAAN8MACATAwAA3QoAIAcAAJwMACAJAACjDAAgDQAAhwsAIBMAANkLACAaAACVCwAgHAAAiQsAICIAAOELACCCBgAAqQwAMIMGAABVABCEBgAAqQwAMIUGAQAAAAGJBgEA2QoAIYoGAQDZCgAhiwYBANkKACGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHaBgEAAAABAwAAAFUAIAEAAJ4BADACAACfAQAgAwAAACcAIAEAACgAMAIAACkAIAMAAAA7ACABAAA8ADACAAA9ACAXBwAAoQsAIAkAAKMMACAQAACoDAAgFgAApwwAIBgAAIUMACAzAADdCgAgggYAAKUMADCDBgAAowEAEIQGAAClDAAwhQYBANgKACGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIZoGAQDYCgAhrwYBANkKACG7BgEA2QoAIb0GAACmDL0GIr4GAQDZCgAhvwZAAIQMACHABkAA3AoAIcEGAQDYCgAhwgYBANkKACEMBwAA5REAIAkAALYZACAQAAC1GQAgFgAAtxkAIBgAAMoOACAzAADKDgAgiwYAAN8MACCvBgAA3wwAILsGAADfDAAgvgYAAN8MACC_BgAA3wwAIMIGAADfDAAgGAcAAKELACAJAACjDAAgEAAAqAwAIBYAAKcMACAYAACFDAAgMwAA3QoAIIIGAAClDAAwgwYAAKMBABCEBgAApQwAMIUGAQAAAAGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIZoGAQDYCgAhrwYBANkKACG7BgEA2QoAIb0GAACmDL0GIr4GAQDZCgAhvwZAAIQMACHABkAA3AoAIcEGAQDYCgAhwgYBANkKACHjBwAApAwAIAMAAACjAQAgAQAApAEAMAIAAKUBACADAAAAowEAIAEAAKQBADACAAClAQAgAQAAAKMBACABAAAAUwAgAQAAAA4AIAEAAAAZACADAAAAQAAgAQAAQQAwAgAAQgAgAwAAAEUAIAEAAEYAMAIAAEcAIBIHAADlEQAgCQAAthkAIBAAALUZACApAAC0GQAgiwYAAN8MACDEBgAA3wwAIMUGAADfDAAgxgYAAN8MACDHBgAA3wwAIMgGAADfDAAgyQYAAN8MACDKBgAA3wwAIMsGAADfDAAgzAYAAN8MACDNBgAA3wwAIM4GAADfDAAgzwYAAN8MACDQBgAA3wwAIBsHAAChCwAgCQAAowwAIBAAAKIMACApAAChDAAgggYAAJ8MADCDBgAAiwEAEIQGAACfDAAwhQYBAAAAAYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAhrwYBANgKACHDBgEAAAABxAYIAKAMACHFBggAoAwAIcYGCACgDAAhxwYIAKAMACHIBggAoAwAIckGCACgDAAhygYIAKAMACHLBggAoAwAIcwGCACgDAAhzQYIAKAMACHOBggAoAwAIc8GCACgDAAh0AYIAKAMACEDAAAAiwEAIAEAAK4BADACAACvAQAgAwAAAHYAIAEAAHcAMAIAAHgAIAMAAABXACABAABYADACAABZACADAAAAMgAgAQAAMwAwAgAANAAgAwAAACsAIAEAACwAMAIAAC0AIAMAAABdACABAABeADACAABfACABAAAAHgAgAQAAAG0AIAEAAAAiACABAAAANgAgAQAAAA4AIAEAAABVACABAAAAJwAgAQAAADsAIAEAAACjAQAgAQAAAEAAIAEAAABFACABAAAAiwEAIAEAAAB2ACABAAAAVwAgAQAAADIAIAEAAAArACABAAAAXQAgAQAAABkAIAMAAAAeACABAAAfADACAAAgACADAAAAbQAgAQAAmAEAMAIAAJkBACAOBwAAoQsAICoAAN4LACCCBgAAnQwAMIMGAADKAQAQhAYAAJ0MADCFBgEA2AoAIYoGAQDYCgAhjQZAANwKACGOBkAA3AoAId4GAQDZCgAhwAcBANgKACHBBwEA2AoAIcIHAgCRDAAhxAcAAJ4MxAciAwcAAOURACAqAACPFwAg3gYAAN8MACAOBwAAoQsAICoAAN4LACCCBgAAnQwAMIMGAADKAQAQhAYAAJ0MADCFBgEAAAABigYBANgKACGNBkAA3AoAIY4GQADcCgAh3gYBANkKACHABwEA2AoAIcEHAQDYCgAhwgcCAJEMACHEBwAAngzEByIDAAAAygEAIAEAAMsBADACAADMAQAgAwAAADYAIAEAADcAMAIAADgAIAMAAAAiACABAAAjADACAAAkACADAAAACwAgAQAADAAwAgAAAQAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAABVACABAACeAQAwAgAAnwEAIAMAAAAnACABAAAoADACAAApACADAAAAOwAgAQAAPAAwAgAAPQAgIgcAAJwMACA8AADdCgAgPQAAhQwAID8AAN0LACCCBgAAlwwAMIMGAADVAQAQhAYAAJcMADCFBgEA2AoAIYoGAQDZCgAhjQZAANwKACGOBkAA3AoAIb0GAACbDLsHIr8GQACEDAAh5AYBANkKACGmBwEA2QoAIacHAQDYCgAhqAcBANgKACGpBwEA2QoAIasHAADNC6sHI6wHAQDZCgAhrQcAAJgM0wYjrgcQAJkMACGvBwEA2AoAIbAHAgCaDAAhsQcAAJIM-gYisgcBANkKACGzBwEA2QoAIbQHAQDZCgAhtQcBANkKACG2BwEA2QoAIbcHAQDZCgAhuAcAAJMMACC5B0AAhAwAIbsHAQDZCgAhFwcAAOURACA8AADKDgAgPQAAyg4AID8AAI4XACCKBgAA3wwAIL8GAADfDAAg5AYAAN8MACCmBwAA3wwAIKkHAADfDAAgqwcAAN8MACCsBwAA3wwAIK0HAADfDAAgrgcAAN8MACCwBwAA3wwAILIHAADfDAAgswcAAN8MACC0BwAA3wwAILUHAADfDAAgtgcAAN8MACC3BwAA3wwAILgHAADfDAAguQcAAN8MACC7BwAA3wwAICIHAACcDAAgPAAA3QoAID0AAIUMACA_AADdCwAgggYAAJcMADCDBgAA1QEAEIQGAACXDAAwhQYBAAAAAYoGAQDZCgAhjQZAANwKACGOBkAA3AoAIb0GAACbDLsHIr8GQACEDAAh5AYBANkKACGmBwEA2QoAIacHAQDYCgAhqAcBANgKACGpBwEA2QoAIasHAADNC6sHI6wHAQDZCgAhrQcAAJgM0wYjrgcQAJkMACGvBwEA2AoAIbAHAgCaDAAhsQcAAJIM-gYisgcBAAAAAbMHAQDZCgAhtAcBAAAAAbUHAQDZCgAhtgcBANkKACG3BwEA2QoAIbgHAACTDAAguQdAAIQMACG7BwEA2QoAIQMAAADVAQAgAQAA1gEAMAIAANcBACABAAAAUwAgAQAAABIAIBEHAAChCwAgPgAAlgwAIIIGAACUDAAwgwYAANsBABCEBgAAlAwAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAhvQYAAJUM1QYi0QYBANkKACHTBgAAjwzTBiLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACHYBkAA3AoAIdkGQADcCgAhAwcAAOURACA-AACzGQAg0QYAAN8MACARBwAAoQsAID4AAJYMACCCBgAAlAwAMIMGAADbAQAQhAYAAJQMADCFBgEAAAABigYBANgKACGNBkAA3AoAIY4GQADcCgAhvQYAAJUM1QYi0QYBANkKACHTBgAAjwzTBiLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACHYBkAA3AoAIdkGQADcCgAhAwAAANsBACABAADcAQAwAgAA3QEAIAEAAADVAQAgAQAAANsBACADAAAAowEAIAEAAKQBADACAAClAQAgAwAAAEAAIAEAAEEAMAIAAEIAIAMAAABFACABAABGADACAABHACADAAAAiwEAIAEAAK4BADACAACvAQAgAwAAAHYAIAEAAHcAMAIAAHgAIAMAAABXACABAABYADACAABZACAQBwAAoQsAIIIGAACgCwAwgwYAAOcBABCEBgAAoAsAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAhggcBANgKACGDBwEA2AoAIYQHAQDYCgAhhQcBANgKACGGBwEA2AoAIYcHAQDYCgAhiAcgANsKACGJBwEA2QoAIQEAAADnAQAgFgcAAKELACCCBgAAjgwAMIMGAADpAQAQhAYAAI4MADCFBgEA2AoAIYoGAQDYCgAhjQZAANwKACGOBkAA3AoAIb0GAACSDPoGItMGAACPDNMGItUGEACQDAAh1gYBANgKACHXBgIAkQwAIfgGAQDYCgAh-gYBANgKACH7BgEA2QoAIfwGAQDZCgAh_QYBANkKACH-BgEA2QoAIf8GAQDZCgAhgAcAAJMMACCBB0AAhAwAIQgHAADlEQAg-wYAAN8MACD8BgAA3wwAIP0GAADfDAAg_gYAAN8MACD_BgAA3wwAIIAHAADfDAAggQcAAN8MACAWBwAAoQsAIIIGAACODAAwgwYAAOkBABCEBgAAjgwAMIUGAQAAAAGKBgEA2AoAIY0GQADcCgAhjgZAANwKACG9BgAAkgz6BiLTBgAAjwzTBiLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACH4BgEA2AoAIfoGAQAAAAH7BgEA2QoAIfwGAQAAAAH9BgEA2QoAIf4GAQDZCgAh_wYBANkKACGABwAAkwwAIIEHQACEDAAhAwAAAOkBACABAADqAQAwAgAA6wEAIAMAAADbAQAgAQAA3AEAMAIAAN0BACADAAAAMgAgAQAAMwAwAgAANAAgAwAAACsAIAEAACwAMAIAAC0AIA8HAAChCwAgQwAA3QoAIEUAAI0MACBGAAD3CwAgggYAAIwMADCDBgAA8AEAEIQGAACMDAAwhQYBANgKACGKBgEA2AoAIY0GQADcCgAhjgZAANwKACG2BgEA2AoAIbcGAQDYCgAhlgcBANgKACGXBwAAiwyVByIEBwAA5REAIEMAAMoOACBFAACyGQAgRgAAqBkAIA8HAAChCwAgQwAA3QoAIEUAAI0MACBGAAD3CwAgggYAAIwMADCDBgAA8AEAEIQGAACMDAAwhQYBAAAAAYoGAQDYCgAhjQZAANwKACGOBkAA3AoAIbYGAQDYCgAhtwYBANgKACGWBwEA2AoAIZcHAACLDJUHIgMAAADwAQAgAQAA8QEAMAIAAPIBACAIRAAAiAwAIIIGAACKDAAwgwYAAPQBABCEBgAAigwAMIUGAQDYCgAhjQZAANwKACGSBwEA2AoAIZUHAACLDJUHIgFEAACxGQAgCUQAAIgMACCCBgAAigwAMIMGAAD0AQAQhAYAAIoMADCFBgEAAAABjQZAANwKACGSBwEA2AoAIZUHAACLDJUHIuIHAACJDAAgAwAAAPQBACABAAD1AQAwAgAA9gEAIAkDAADdCgAgRAAAiAwAIIIGAACHDAAwgwYAAPgBABCEBgAAhwwAMIUGAQDYCgAhjAYBANgKACGSBwEA2AoAIZMHQADcCgAhAgMAAMoOACBEAACxGQAgCgMAAN0KACBEAACIDAAgggYAAIcMADCDBgAA-AEAEIQGAACHDAAwhQYBAAAAAYwGAQDYCgAhkgcBANgKACGTB0AA3AoAIeEHAACGDAAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAEAAAD0AQAgAQAAAPgBACAQBwAAoQsAICAAAN0KACA9AACFDAAgggYAAIEMADCDBgAA_gEAEIQGAACBDAAwhQYBANgKACGKBgEA2AoAIY0GQADcCgAhjgZAANwKACG9BgAAgwylByK_BkAAhAwAIZ0HAQDYCgAhowcAAIIMowcipQcBANkKACGmBwEA2QoAIQYHAADlEQAgIAAAyg4AID0AAMoOACC_BgAA3wwAIKUHAADfDAAgpgcAAN8MACAQBwAAoQsAICAAAN0KACA9AACFDAAgggYAAIEMADCDBgAA_gEAEIQGAACBDAAwhQYBAAAAAYoGAQDYCgAhjQZAANwKACGOBkAA3AoAIb0GAACDDKUHIr8GQACEDAAhnQcBANgKACGjBwAAggyjByKlBwEA2QoAIaYHAQDZCgAhAwAAAP4BACABAAD_AQAwAgAAgAIAIAEAAABTACADAAAAXQAgAQAAXgAwAgAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAEAAAAUACABAAAAHgAgAQAAAG0AIAEAAADKAQAgAQAAADYAIAEAAAAiACABAAAACwAgAQAAAA4AIAEAAABVACABAAAAJwAgAQAAADsAIAEAAADVAQAgAQAAAKMBACABAAAAQAAgAQAAAEUAIAEAAACLAQAgAQAAAHYAIAEAAABXACABAAAA6QEAIAEAAADbAQAgAQAAADIAIAEAAAArACABAAAA8AEAIAEAAAD-AQAgAQAAAF0AIAEAAABdACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAADsAIAEAADwAMAIAAD0AIAMAAABAACABAABBADACAABCACADAAAAowEAIAEAAKQBADACAAClAQAgAwAAAIsBACABAACuAQAwAgAArwEAIAMAAABdACABAABeADACAABfACABAAAAJwAgAQAAADsAIAEAAABAACABAAAAowEAIAEAAACLAQAgAQAAAF0AIAMAAABVACABAACeAQAwAgAAnwEAIAMAAADVAQAgAQAA1gEAMAIAANcBACADAAAA1QEAIAEAANYBADACAADXAQAgAwAAAKMBACABAACkAQAwAgAApQEAIAMAAACjAQAgAQAApAEAMAIAAKUBACARMwAA3QoAIIIGAADXCgAwgwYAALACABCEBgAA1woAMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIZoGAQDYCgAhmwYBANgKACGcBgEA2AoAIZ0GAQDYCgAhngYBANkKACGfBgAA0QoAIKAGAADRCgAgoQYAANoKACCiBgAA2goAIKMGIADbCgAhAQAAALACACADAAAATQAgAQAATgAwAgAATwAgAwAAAE0AIAEAAE4AMAIAAE8AIA0XAADdCgAgggYAAIILADCDBgAAtAIAEIQGAACCCwAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAhmwYBANgKACGcBgEA2AoAIaEGAADaCgAgowYgANsKACHcBgEA2AoAId0GAADRCgAgAQAAALQCACAKAwAA3QoAIIIGAACADAAwgwYAALYCABCEBgAAgAwAMIUGAQDYCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAhxQcBANgKACHGB0AA3AoAIQEDAADKDgAgCgMAAN0KACCCBgAAgAwAMIMGAAC2AgAQhAYAAIAMADCFBgEAAAABjAYBAAAAAY0GQADcCgAhjgZAANwKACHFBwEA2AoAIcYHQADcCgAhAwAAALYCACABAAC3AgAwAgAAuAIAIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgAwAAAP4BACABAAD_AQAwAgAAgAIAIAMAAAD-AQAgAQAA_wEAMAIAAIACACADAAAA8AEAIAEAAPEBADACAADyAQAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAOACABAAAAVQAgAQAAANUBACABAAAA1QEAIAEAAACjAQAgAQAAAKMBACABAAAATQAgAQAAAE0AIAEAAAC2AgAgAQAAAF0AIAEAAABdACABAAAA_gEAIAEAAAD-AQAgAQAAAPABACABAAAA-AEAIAEAAAABACADAAAACwAgAQAADAAwAgAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACAIAwAAuxQAIAcAAPYYACCFBgEAAAABigYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAZUHAAAA4QcCAV8AANYCACAGhQYBAAAAAYoGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAGVBwAAAOEHAgFfAADYAgAwAV8AANgCADAIAwAAuRQAIAcAAPQYACCFBgEA4wwAIYoGAQDjDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAhlQcAALcU4QciAgAAAAEAIF8AANsCACAGhQYBAOMMACGKBgEA4wwAIYwGAQDjDAAhjQZAAOUMACGOBkAA5QwAIZUHAAC3FOEHIgIAAAALACBfAADdAgAgAgAAAAsAIF8AAN0CACADAAAAAQAgZgAA1gIAIGcAANsCACABAAAAAQAgAQAAAAsAIAMVAACuGQAgbAAAsBkAIG0AAK8ZACAJggYAAPwLADCDBgAA5AIAEIQGAAD8CwAwhQYBAMUKACGKBgEAxQoAIYwGAQDFCgAhjQZAAMcKACGOBkAAxwoAIZUHAAD9C-EHIgMAAAALACABAADjAgAwawAA5AIAIAMAAAALACABAAAMADACAAABACABAAAAiQEAIAEAAACJAQAgAwAAAIcBACABAACIAQAwAgAAiQEAIAMAAACHAQAgAQAAiAEAMAIAAIkBACADAAAAhwEAIAEAAIgBADACAACJAQAgBykAAK0ZACCFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAOAHAsMGAQAAAAHeB0AAAAABAV8AAOwCACAGhQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADgBwLDBgEAAAAB3gdAAAAAAQFfAADuAgAwAV8AAO4CADAHKQAArBkAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIb0GAACVDuAHIsMGAQDjDAAh3gdAAOUMACECAAAAiQEAIF8AAPECACAGhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhvQYAAJUO4AciwwYBAOMMACHeB0AA5QwAIQIAAACHAQAgXwAA8wIAIAIAAACHAQAgXwAA8wIAIAMAAACJAQAgZgAA7AIAIGcAAPECACABAAAAiQEAIAEAAACHAQAgAxUAAKkZACBsAACrGQAgbQAAqhkAIAmCBgAA-AsAMIMGAAD6AgAQhAYAAPgLADCFBgEAxQoAIY0GQADHCgAhjgZAAMcKACG9BgAA-QvgByLDBgEAxQoAId4HQADHCgAhAwAAAIcBACABAAD5AgAwawAA-gIAIAMAAACHAQAgAQAAiAEAMAIAAIkBACAmBAAA8gsAIAUAAPMLACAGAADTCwAgEAAA1AsAIBkAANULACA0AACYCwAgQAAA1wsAIE0AANcLACBOAACYCwAgTwAA9AsAIFAAAJULACBRAACVCwAgUgAA9QsAIFMAAPYLACBUAADhCwAgVQAA4QsAIFYAAOALACBXAADgCwAgWAAA3wsAIFkAAPcLACCCBgAA8QsAMIMGAABTABCEBgAA8QsAMIUGAQAAAAGJBgEA2QoAIY0GQADcCgAhjgZAANwKACHeBgEA2AoAIZUHAQDYCgAh1QcBAAAAAdYHIADbCgAh1wcBANkKACHYBwEA2QoAIdkHAQDZCgAh2gcBANkKACHbBwEA2QoAIdwHAQDZCgAh3QcBANgKACEBAAAA_QIAIAEAAAD9AgAgGwQAAKMZACAFAACkGQAgBgAAhBcAIBAAAIUXACAZAACGFwAgNAAA1xEAIEAAAIgXACBNAACIFwAgTgAA1xEAIE8AAKUZACBQAADGEQAgUQAAxhEAIFIAAKYZACBTAACnGQAgVAAAkhcAIFUAAJIXACBWAACRFwAgVwAAkRcAIFgAAJAXACBZAACoGQAgiQYAAN8MACDXBwAA3wwAINgHAADfDAAg2QcAAN8MACDaBwAA3wwAINsHAADfDAAg3AcAAN8MACADAAAAUwAgAQAAgAMAMAIAAP0CACADAAAAUwAgAQAAgAMAMAIAAP0CACADAAAAUwAgAQAAgAMAMAIAAP0CACAjBAAAjxkAIAUAAJAZACAGAACRGQAgEAAAkhkAIBkAAJMZACA0AACWGQAgQAAAlBkAIE0AAJUZACBOAACXGQAgTwAAmBkAIFAAAJkZACBRAACaGQAgUgAAmxkAIFMAAJwZACBUAACdGQAgVQAAnhkAIFYAAJ8ZACBXAACgGQAgWAAAoRkAIFkAAKIZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAEBXwAAhAMAIA-FBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAEBXwAAhgMAMAFfAACGAwAwIwQAAMQXACAFAADFFwAgBgAAxhcAIBAAAMcXACAZAADIFwAgNAAAyxcAIEAAAMkXACBNAADKFwAgTgAAzBcAIE8AAM0XACBQAADOFwAgUQAAzxcAIFIAANAXACBTAADRFwAgVAAA0hcAIFUAANMXACBWAADUFwAgVwAA1RcAIFgAANYXACBZAADXFwAghQYBAOMMACGJBgEA5AwAIY0GQADlDAAhjgZAAOUMACHeBgEA4wwAIZUHAQDjDAAh1QcBAOMMACHWByAAxQ4AIdcHAQDkDAAh2AcBAOQMACHZBwEA5AwAIdoHAQDkDAAh2wcBAOQMACHcBwEA5AwAId0HAQDjDAAhAgAAAP0CACBfAACJAwAgD4UGAQDjDAAhiQYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACGVBwEA4wwAIdUHAQDjDAAh1gcgAMUOACHXBwEA5AwAIdgHAQDkDAAh2QcBAOQMACHaBwEA5AwAIdsHAQDkDAAh3AcBAOQMACHdBwEA4wwAIQIAAABTACBfAACLAwAgAgAAAFMAIF8AAIsDACADAAAA_QIAIGYAAIQDACBnAACJAwAgAQAAAP0CACABAAAAUwAgChUAAMEXACBsAADDFwAgbQAAwhcAIIkGAADfDAAg1wcAAN8MACDYBwAA3wwAINkHAADfDAAg2gcAAN8MACDbBwAA3wwAINwHAADfDAAgEoIGAADwCwAwgwYAAJIDABCEBgAA8AsAMIUGAQDFCgAhiQYBAMYKACGNBkAAxwoAIY4GQADHCgAh3gYBAMUKACGVBwEAxQoAIdUHAQDFCgAh1gcgANMKACHXBwEAxgoAIdgHAQDGCgAh2QcBAMYKACHaBwEAxgoAIdsHAQDGCgAh3AcBAMYKACHdBwEAxQoAIQMAAABTACABAACRAwAwawAAkgMAIAMAAABTACABAACAAwAwAgAA_QIAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAMAXACCFBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAABxgdAAAAAAdIHAQAAAAHTBwEAAAAB1AcBAAAAAQFfAACaAwAgCIUGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHGB0AAAAAB0gcBAAAAAdMHAQAAAAHUBwEAAAABAV8AAJwDADABXwAAnAMAMAkDAAC_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_FAAgJQAAgBUAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAEBXwAA9QMAIAeFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAABAV8AAPcDADABXwAA9wMAMAEAAAAZACAKBwAAxBYAIAkAAPMUACAlAAD0FAAghQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAh5AYBAOQMACECAAAAmQEAIF8AAPsDACAHhQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAh5AYBAOQMACECAAAAbQAgXwAA_QMAIAIAAABtACBfAAD9AwAgAQAAABkAIAMAAACZAQAgZgAA9QMAIGcAAPsDACABAAAAmQEAIAEAAABtACAFFQAArBcAIGwAAK4XACBtAACtFwAgiwYAAN8MACDkBgAA3wwAIAqCBgAA6gsAMIMGAACFBAAQhAYAAOoLADCFBgEAxQoAIYoGAQDFCgAhiwYBAMYKACGNBkAAxwoAIY4GQADHCgAh3gYBAMUKACHkBgEAxgoAIQMAAABtACABAACEBAAwawAAhQQAIAMAAABtACABAACYAQAwAgAAmQEAIAEAAADMAQAgAQAAAMwBACADAAAAygEAIAEAAMsBADACAADMAQAgAwAAAMoBACABAADLAQAwAgAAzAEAIAMAAADKAQAgAQAAywEAMAIAAMwBACALBwAAqxcAICoAAOcUACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAcAHAQAAAAHBBwEAAAABwgcCAAAAAcQHAAAAxAcCAV8AAI0EACAJhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHABwEAAAABwQcBAAAAAcIHAgAAAAHEBwAAAMQHAgFfAACPBAAwAV8AAI8EADALBwAAqhcAICoAANwUACCFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAId4GAQDkDAAhwAcBAOMMACHBBwEA4wwAIcIHAgDsDgAhxAcAANoUxAciAgAAAMwBACBfAACSBAAgCYUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAh3gYBAOQMACHABwEA4wwAIcEHAQDjDAAhwgcCAOwOACHEBwAA2hTEByICAAAAygEAIF8AAJQEACACAAAAygEAIF8AAJQEACADAAAAzAEAIGYAAI0EACBnAACSBAAgAQAAAMwBACABAAAAygEAIAYVAAClFwAgbAAAqBcAIG0AAKcXACDuAQAAphcAIO8BAACpFwAg3gYAAN8MACAMggYAAOYLADCDBgAAmwQAEIQGAADmCwAwhQYBAMUKACGKBgEAxQoAIY0GQADHCgAhjgZAAMcKACHeBgEAxgoAIcAHAQDFCgAhwQcBAMUKACHCBwIA8woAIcQHAADnC8QHIgMAAADKAQAgAQAAmgQAMGsAAJsEACADAAAAygEAIAEAAMsBADACAADMAQAgAQAAACQAIAEAAAAkACADAAAAIgAgAQAAIwAwAgAAJAAgAwAAACIAIAEAACMAMAIAACQAIAMAAAAiACABAAAjADACAAAkACAPBwAArhEAIAkAAK8RACAKAADGFAAgDQAAsBEAIBEAALERACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAAB9gYBAAAAAb4HAQAAAAG_BwEAAAABAV8AAKMEACAKhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB8AYCAAAAAfYGAQAAAAG-BwEAAAABvwcBAAAAAQFfAAClBAAwAV8AAKUEADABAAAAHgAgDwcAAJcRACAJAACYEQAgCgAAxBQAIA0AAJkRACARAACaEQAghQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh8AYCAJkQACH2BgEA5AwAIb4HAQDjDAAhvwcBAOMMACECAAAAJAAgXwAAqQQAIAqFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACHwBgIAmRAAIfYGAQDkDAAhvgcBAOMMACG_BwEA4wwAIQIAAAAiACBfAACrBAAgAgAAACIAIF8AAKsEACABAAAAHgAgAwAAACQAIGYAAKMEACBnAACpBAAgAQAAACQAIAEAAAAiACAIFQAAoBcAIGwAAKMXACBtAACiFwAg7gEAAKEXACDvAQAApBcAIOQGAADfDAAg8AYAAN8MACD2BgAA3wwAIA2CBgAA5QsAMIMGAACzBAAQhAYAAOULADCFBgEAxQoAIYoGAQDFCgAhiwYBAMUKACGNBkAAxwoAIY4GQADHCgAh5AYBAMYKACHwBgIAiwsAIfYGAQDGCgAhvgcBAMUKACG_BwEAxQoAIQMAAAAiACABAACyBAAwawAAswQAIAMAAAAiACABAAAjADACAAAkACABAAAAKQAgAQAAACkAIAMAAAAnACABAAAoADACAAApACADAAAAJwAgAQAAKAAwAgAAKQAgAwAAACcAIAEAACgAMAIAACkAIBcHAAC2DgAgCQAAsw4AIAoAALQOACALAACtDgAgDgAAsg4AIA8AALAOACAQAADDDwAgGQAAsQ4AIBsAALUOACAsAACuDgAgLQAArw4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQFfAAC7BAAgDIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQFfAAC9BAAwAV8AAL0EADABAAAAGQAgAQAAAB4AIBcHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAADBDwAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_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_QQAIAMAAAAUACABAAAVADACAAAWACAmBgAA0wsAIAwAAIULACANAACHCwAgEQAA1gsAIBwAAIkLACAlAACGCwAgJwAAiAsAICoAAN4LACAuAADPCwAgLwAA0AsAIDAAANILACAxAADUCwAgMgAA1QsAIDQAAJgLACA1AADYCwAgNgAA2QsAIDcAANoLACA6AADOCwAgOwAA0QsAID8AAN0LACBAAADXCwAgQQAA2wsAIEIAANwLACBHAADfCwAgSAAA4AsAIEkAAOELACBKAADhCwAgggYAAMwLADCDBgAAEgAQhAYAAMwLADCFBgEAAAABjQZAANwKACGOBkAA3AoAIbkGAADNC6sHI94GAQDYCgAh5AYBANkKACGpBwEA2QoAIawHAQDZCgAhAQAAAIAFACABAAAAgAUAIB8GAACEFwAgDAAA5hAAIA0AAOgQACARAACHFwAgHAAA6hAAICUAAOcQACAnAADpEAAgKgAAjxcAIC4AAIAXACAvAACBFwAgMAAAgxcAIDEAAIUXACAyAACGFwAgNAAA1xEAIDUAAIkXACA2AACKFwAgNwAAixcAIDoAAP8WACA7AACCFwAgPwAAjhcAIEAAAIgXACBBAACMFwAgQgAAjRcAIEcAAJAXACBIAACRFwAgSQAAkhcAIEoAAJIXACC5BgAA3wwAIOQGAADfDAAgqQcAAN8MACCsBwAA3wwAIAMAAAASACABAACDBQAwAgAAgAUAIAMAAAASACABAACDBQAwAgAAgAUAIAMAAAASACABAACDBQAwAgAAgAUAICMGAADqFgAgDAAA-RYAIA0AAO0WACARAADuFgAgHAAA9RYAICUAAOgWACAnAAD0FgAgKgAA-hYAIC4AAOUWACAvAADmFgAgMAAA6RYAIDEAAOsWACAyAADsFgAgNAAA8BYAIDUAAPEWACA2AADyFgAgNwAA8xYAIDoAAOQWACA7AADnFgAgPwAA-BYAIEAAAO8WACBBAAD2FgAgQgAA9xYAIEcAAPsWACBIAAD8FgAgSQAA_RYAIEoAAP4WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAEBXwAAhwUAIAiFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAEBXwAAiQUAMAFfAACJBQAwIwYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhAgAAAIAFACBfAACMBQAgCIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhAgAAABIAIF8AAI4FACACAAAAEgAgXwAAjgUAIAMAAACABQAgZgAAhwUAIGcAAIwFACABAAAAgAUAIAEAAAASACAHFQAAzRIAIGwAAM8SACBtAADOEgAguQYAAN8MACDkBgAA3wwAIKkHAADfDAAgrAcAAN8MACALggYAAMsLADCDBgAAlQUAEIQGAADLCwAwhQYBAMUKACGNBkAAxwoAIY4GQADHCgAhuQYAAL8Lqwcj3gYBAMUKACHkBgEAxgoAIakHAQDGCgAhrAcBAMYKACEDAAAAEgAgAQAAlAUAMGsAAJUFACADAAAAEgAgAQAAgwUAMAIAAIAFACABAAAA1wEAIAEAAADXAQAgAwAAANUBACABAADWAQAwAgAA1wEAIAMAAADVAQAgAQAA1gEAMAIAANcBACADAAAA1QEAIAEAANYBADACAADXAQAgHwcAAMsSACA8AADJEgAgPQAAyhIAID8AAMwSACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAC7BwK_BkAAAAAB5AYBAAAAAaYHAQAAAAGnBwEAAAABqAcBAAAAAakHAQAAAAGrBwAAAKsHA6wHAQAAAAGtBwAAANMGA64HEAAAAAGvBwEAAAABsAcCAAAAAbEHAAAA-gYCsgcBAAAAAbMHAQAAAAG0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAeAAAAAAbkHQAAAAAG7BwEAAAABAV8AAJ0FACAbhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABpwcBAAAAAagHAQAAAAGpBwEAAAABqwcAAACrBwOsBwEAAAABrQcAAADTBgOuBxAAAAABrwcBAAAAAbAHAgAAAAGxBwAAAPoGArIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHgAAAAAG5B0AAAAABuwcBAAAAAQFfAACfBQAwAV8AAJ8FADABAAAAUwAgAQAAABIAIB8HAAC7EgAgPAAAuRIAID0AALoSACA_AAC8EgAghQYBAOMMACGKBgEA5AwAIY0GQADlDAAhjgZAAOUMACG9BgAAuBK7ByK_BkAA-wwAIeQGAQDkDAAhpgcBAOQMACGnBwEA4wwAIagHAQDjDAAhqQcBAOQMACGrBwAAtRKrByOsBwEA5AwAIa0HAAC2EtMGI64HEAC3EgAhrwcBAOMMACGwBwIAmRAAIbEHAADdEfoGIrIHAQDkDAAhswcBAOQMACG0BwEA5AwAIbUHAQDkDAAhtgcBAOQMACG3BwEA5AwAIbgHgAAAAAG5B0AA-wwAIbsHAQDkDAAhAgAAANcBACBfAACkBQAgG4UGAQDjDAAhigYBAOQMACGNBkAA5QwAIY4GQADlDAAhvQYAALgSuwcivwZAAPsMACHkBgEA5AwAIaYHAQDkDAAhpwcBAOMMACGoBwEA4wwAIakHAQDkDAAhqwcAALUSqwcjrAcBAOQMACGtBwAAthLTBiOuBxAAtxIAIa8HAQDjDAAhsAcCAJkQACGxBwAA3RH6BiKyBwEA5AwAIbMHAQDkDAAhtAcBAOQMACG1BwEA5AwAIbYHAQDkDAAhtwcBAOQMACG4B4AAAAABuQdAAPsMACG7BwEA5AwAIQIAAADVAQAgXwAApgUAIAIAAADVAQAgXwAApgUAIAEAAABTACABAAAAEgAgAwAAANcBACBmAACdBQAgZwAApAUAIAEAAADXAQAgAQAAANUBACAYFQAAsBIAIGwAALMSACBtAACyEgAg7gEAALESACDvAQAAtBIAIIoGAADfDAAgvwYAAN8MACDkBgAA3wwAIKYHAADfDAAgqQcAAN8MACCrBwAA3wwAIKwHAADfDAAgrQcAAN8MACCuBwAA3wwAILAHAADfDAAgsgcAAN8MACCzBwAA3wwAILQHAADfDAAgtQcAAN8MACC2BwAA3wwAILcHAADfDAAguAcAAN8MACC5BwAA3wwAILsHAADfDAAgHoIGAAC-CwAwgwYAAK8FABCEBgAAvgsAMIUGAQDFCgAhigYBAMYKACGNBkAAxwoAIY4GQADHCgAhvQYAAMILuwcivwZAAOIKACHkBgEAxgoAIaYHAQDGCgAhpwcBAMUKACGoBwEAxQoAIakHAQDGCgAhqwcAAL8LqwcjrAcBAMYKACGtBwAAwAvTBiOuBxAAwQsAIa8HAQDFCgAhsAcCAIsLACGxBwAAmgv6BiKyBwEAxgoAIbMHAQDGCgAhtAcBAMYKACG1BwEAxgoAIbYHAQDGCgAhtwcBAMYKACG4BwAAmwsAILkHQADiCgAhuwcBAMYKACEDAAAA1QEAIAEAAK4FADBrAACvBQAgAwAAANUBACABAADWAQAwAgAA1wEAIAEAAACAAgAgAQAAAIACACADAAAA_gEAIAEAAP8BADACAACAAgAgAwAAAP4BACABAAD_AQAwAgAAgAIAIAMAAAD-AQAgAQAA_wEAMAIAAIACACANBwAArhIAICAAAK0SACA9AACvEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAApQcCvwZAAAAAAZ0HAQAAAAGjBwAAAKMHAqUHAQAAAAGmBwEAAAABAV8AALcFACAKhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAApQcCvwZAAAAAAZ0HAQAAAAGjBwAAAKMHAqUHAQAAAAGmBwEAAAABAV8AALkFADABXwAAuQUAMAEAAABTACANBwAAqxIAICAAAKoSACA9AACsEgAghQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACG9BgAAqRKlByK_BkAA-wwAIZ0HAQDjDAAhowcAAKgSowcipQcBAOQMACGmBwEA5AwAIQIAAACAAgAgXwAAvQUAIAqFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAIb0GAACpEqUHIr8GQAD7DAAhnQcBAOMMACGjBwAAqBKjByKlBwEA5AwAIaYHAQDkDAAhAgAAAP4BACBfAAC_BQAgAgAAAP4BACBfAAC_BQAgAQAAAFMAIAMAAACAAgAgZgAAtwUAIGcAAL0FACABAAAAgAIAIAEAAAD-AQAgBhUAAKUSACBsAACnEgAgbQAAphIAIL8GAADfDAAgpQcAAN8MACCmBwAA3wwAIA2CBgAAtwsAMIMGAADHBQAQhAYAALcLADCFBgEAxQoAIYoGAQDFCgAhjQZAAMcKACGOBkAAxwoAIb0GAAC5C6UHIr8GQADiCgAhnQcBAMUKACGjBwAAuAujByKlBwEAxgoAIaYHAQDGCgAhAwAAAP4BACABAADGBQAwawAAxwUAIAMAAAD-AQAgAQAA_wEAMAIAAIACACABAAAAXwAgAQAAAF8AIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIBcQAACGDwAgGAAAhw0AIBkAAIgNACAeAACEDQAgHwAAhQ0AICAAAIYNACAhAACJDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAV8AAM8FACAQhQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAV8AANEFADABXwAA0QUAMAEAAABTACABAAAAVQAgAQAAAA4AIAEAAAAZACAXEAAAhA8AIBgAAIANACAZAACBDQAgHgAA_QwAIB8AAP4MACAgAAD_DAAgIQAAgg0AIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhsQYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcimwcBAOMMACGcBwEA4wwAIZ0HAQDjDAAhngcBAOQMACGfBwEA5AwAIaAHAQDkDAAhoQdAAOUMACECAAAAXwAgXwAA2AUAIBCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACGvBgEA5AwAIbEGAQDkDAAhvQYAAPoMmwcivwZAAPsMACHCBgEA5AwAIZkHAAD5DJkHIpsHAQDjDAAhnAcBAOMMACGdBwEA4wwAIZ4HAQDkDAAhnwcBAOQMACGgBwEA5AwAIaEHQADlDAAhAgAAAF0AIF8AANoFACACAAAAXQAgXwAA2gUAIAEAAABTACABAAAAVQAgAQAAAA4AIAEAAAAZACADAAAAXwAgZgAAzwUAIGcAANgFACABAAAAXwAgAQAAAF0AIAoVAACiEgAgbAAApBIAIG0AAKMSACCvBgAA3wwAILEGAADfDAAgvwYAAN8MACDCBgAA3wwAIJ4HAADfDAAgnwcAAN8MACCgBwAA3wwAIBOCBgAAsAsAMIMGAADlBQAQhAYAALALADCFBgEAxQoAIY0GQADHCgAhjgZAAMcKACGvBgEAxgoAIbEGAQDGCgAhvQYAALILmwcivwZAAOIKACHCBgEAxgoAIZkHAACxC5kHIpsHAQDFCgAhnAcBAMUKACGdBwEAxQoAIZ4HAQDGCgAhnwcBAMYKACGgBwEAxgoAIaEHQADHCgAhAwAAAF0AIAEAAOQFADBrAADlBQAgAwAAAF0AIAEAAF4AMAIAAF8AIAEAAADyAQAgAQAAAPIBACADAAAA8AEAIAEAAPEBADACAADyAQAgAwAAAPABACABAADxAQAwAgAA8gEAIAMAAADwAQAgAQAA8QEAMAIAAPIBACAMBwAAnhIAIEMAAJ8SACBFAACgEgAgRgAAoRIAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZYHAQAAAAGXBwAAAJUHAgFfAADtBQAgCIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZYHAQAAAAGXBwAAAJUHAgFfAADvBQAwAV8AAO8FADAMBwAAghIAIEMAAIMSACBFAACEEgAgRgAAhRIAIIUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACG3BgEA4wwAIZYHAQDjDAAhlwcAAPwRlQciAgAAAPIBACBfAADyBQAgCIUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACG3BgEA4wwAIZYHAQDjDAAhlwcAAPwRlQciAgAAAPABACBfAAD0BQAgAgAAAPABACBfAAD0BQAgAwAAAPIBACBmAADtBQAgZwAA8gUAIAEAAADyAQAgAQAAAPABACADFQAA_xEAIGwAAIESACBtAACAEgAgC4IGAACvCwAwgwYAAPsFABCEBgAArwsAMIUGAQDFCgAhigYBAMUKACGNBkAAxwoAIY4GQADHCgAhtgYBAMUKACG3BgEAxQoAIZYHAQDFCgAhlwcAAKwLlQciAwAAAPABACABAAD6BQAwawAA-wUAIAMAAADwAQAgAQAA8QEAMAIAAPIBACABAAAA9gEAIAEAAAD2AQAgAwAAAPQBACABAAD1AQAwAgAA9gEAIAMAAAD0AQAgAQAA9QEAMAIAAPYBACADAAAA9AEAIAEAAPUBADACAAD2AQAgBUQAAP4RACCFBgEAAAABjQZAAAAAAZIHAQAAAAGVBwAAAJUHAgFfAACDBgAgBIUGAQAAAAGNBkAAAAABkgcBAAAAAZUHAAAAlQcCAV8AAIUGADABXwAAhQYAMAVEAAD9EQAghQYBAOMMACGNBkAA5QwAIZIHAQDjDAAhlQcAAPwRlQciAgAAAPYBACBfAACIBgAgBIUGAQDjDAAhjQZAAOUMACGSBwEA4wwAIZUHAAD8EZUHIgIAAAD0AQAgXwAAigYAIAIAAAD0AQAgXwAAigYAIAMAAAD2AQAgZgAAgwYAIGcAAIgGACABAAAA9gEAIAEAAAD0AQAgAxUAAPkRACBsAAD7EQAgbQAA-hEAIAeCBgAAqwsAMIMGAACRBgAQhAYAAKsLADCFBgEAxQoAIY0GQADHCgAhkgcBAMUKACGVBwAArAuVByIDAAAA9AEAIAEAAJAGADBrAACRBgAgAwAAAPQBACABAAD1AQAwAgAA9gEAIAEAAAD6AQAgAQAAAPoBACADAAAA-AEAIAEAAPkBADACAAD6AQAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAMAAAD4AQAgAQAA-QEAMAIAAPoBACAGAwAA-BEAIEQAAPcRACCFBgEAAAABjAYBAAAAAZIHAQAAAAGTB0AAAAABAV8AAJkGACAEhQYBAAAAAYwGAQAAAAGSBwEAAAABkwdAAAAAAQFfAACbBgAwAV8AAJsGADAGAwAA9hEAIEQAAPURACCFBgEA4wwAIYwGAQDjDAAhkgcBAOMMACGTB0AA5QwAIQIAAAD6AQAgXwAAngYAIASFBgEA4wwAIYwGAQDjDAAhkgcBAOMMACGTB0AA5QwAIQIAAAD4AQAgXwAAoAYAIAIAAAD4AQAgXwAAoAYAIAMAAAD6AQAgZgAAmQYAIGcAAJ4GACABAAAA-gEAIAEAAAD4AQAgAxUAAPIRACBsAAD0EQAgbQAA8xEAIAeCBgAAqgsAMIMGAACnBgAQhAYAAKoLADCFBgEAxQoAIYwGAQDFCgAhkgcBAMUKACGTB0AAxwoAIQMAAAD4AQAgAQAApgYAMGsAAKcGACADAAAA-AEAIAEAAPkBADACAAD6AQAgAQAAAHgAIAEAAAB4ACADAAAAdgAgAQAAdwAwAgAAeAAgAwAAAHYAIAEAAHcAMAIAAHgAIAMAAAB2ACABAAB3ADACAAB4ACAOBwAAgxAAIAkAAIQQACAbAADxEQAgHAAAhRAAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB1gYBAAAAAeYGAQAAAAGIByAAAAABkAcQAAAAAZEHEAAAAAEBXwAArwYAIAqFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdYGAQAAAAHmBgEAAAABiAcgAAAAAZAHEAAAAAGRBxAAAAABAV8AALEGADABXwAAsQYAMA4HAAD2DwAgCQAA9w8AIBsAAPARACAcAAD4DwAghQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIdYGAQDjDAAh5gYBAOMMACGIByAAxQ4AIZAHEADrDgAhkQcQAOsOACECAAAAeAAgXwAAtAYAIAqFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAh1gYBAOMMACHmBgEA4wwAIYgHIADFDgAhkAcQAOsOACGRBxAA6w4AIQIAAAB2ACBfAAC2BgAgAgAAAHYAIF8AALYGACADAAAAeAAgZgAArwYAIGcAALQGACABAAAAeAAgAQAAAHYAIAUVAADrEQAgbAAA7hEAIG0AAO0RACDuAQAA7BEAIO8BAADvEQAgDYIGAACpCwAwgwYAAL0GABCEBgAAqQsAMIUGAQDFCgAhigYBAMUKACGLBgEAxQoAIY0GQADHCgAhjgZAAMcKACHWBgEAxQoAIeYGAQDFCgAhiAcgANMKACGQBxAA8goAIZEHEADyCgAhAwAAAHYAIAEAALwGADBrAAC9BgAgAwAAAHYAIAEAAHcAMAIAAHgAIAEAAABZACABAAAAWQAgAwAAAFcAIAEAAFgAMAIAAFkAIAMAAABXACABAABYADACAABZACADAAAAVwAgAQAAWAAwAgAAWQAgHAcAAJkPACAJAACaDwAgGQAA6g8AIBsAAJsPACAdAACcDwAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAAQFfAADFBgAgF4UGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEBXwAAxwYAMAFfAADHBgAwHAcAAJQPACAJAACVDwAgGQAA6A8AIBsAAJYPACAdAACXDwAghQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbEGAQDjDAAhvQYAAJIPjgci1QYQAOsOACHWBgEA4wwAIdcGAgDsDgAh5gYBAOMMACH6BgEA4wwAIfsGAQDkDAAh_AYBAOQMACH9BgEA5AwAIf4GAQDkDAAh_wYBAOQMACGAB4AAAAABgQdAAPsMACGKBwEA4wwAIYwHAACRD4wHIo4HAQDjDAAhjwdAAOUMACECAAAAWQAgXwAAygYAIBeFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAhsQYBAOMMACG9BgAAkg-OByLVBhAA6w4AIdYGAQDjDAAh1wYCAOwOACHmBgEA4wwAIfoGAQDjDAAh-wYBAOQMACH8BgEA5AwAIf0GAQDkDAAh_gYBAOQMACH_BgEA5AwAIYAHgAAAAAGBB0AA-wwAIYoHAQDjDAAhjAcAAJEPjAcijgcBAOMMACGPB0AA5QwAIQIAAABXACBfAADMBgAgAgAAAFcAIF8AAMwGACADAAAAWQAgZgAAxQYAIGcAAMoGACABAAAAWQAgAQAAAFcAIAwVAADmEQAgbAAA6REAIG0AAOgRACDuAQAA5xEAIO8BAADqEQAg-wYAAN8MACD8BgAA3wwAIP0GAADfDAAg_gYAAN8MACD_BgAA3wwAIIAHAADfDAAggQcAAN8MACAaggYAAKILADCDBgAA0wYAEIQGAACiCwAwhQYBAMUKACGKBgEAxQoAIYsGAQDFCgAhjQZAAMcKACGOBkAAxwoAIbEGAQDFCgAhvQYAAKQLjgci1QYQAPIKACHWBgEAxQoAIdcGAgDzCgAh5gYBAMUKACH6BgEAxQoAIfsGAQDGCgAh_AYBAMYKACH9BgEAxgoAIf4GAQDGCgAh_wYBAMYKACGABwAAmwsAIIEHQADiCgAhigcBAMUKACGMBwAAowuMByKOBwEAxQoAIY8HQADHCgAhAwAAAFcAIAEAANIGADBrAADTBgAgAwAAAFcAIAEAAFgAMAIAAFkAIBAHAAChCwAgggYAAKALADCDBgAA5wEAEIQGAACgCwAwhQYBAAAAAYoGAQAAAAGNBkAA3AoAIY4GQADcCgAhggcBANgKACGDBwEA2AoAIYQHAQDYCgAhhQcBANgKACGGBwEA2AoAIYcHAQDYCgAhiAcgANsKACGJBwEA2QoAIQEAAADWBgAgAQAAANYGACACBwAA5REAIIkHAADfDAAgAwAAAOcBACABAADZBgAwAgAA1gYAIAMAAADnAQAgAQAA2QYAMAIAANYGACADAAAA5wEAIAEAANkGADACAADWBgAgDQcAAOQRACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABggcBAAAAAYMHAQAAAAGEBwEAAAABhQcBAAAAAYYHAQAAAAGHBwEAAAABiAcgAAAAAYkHAQAAAAEBXwAA3QYAIAyFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABggcBAAAAAYMHAQAAAAGEBwEAAAABhQcBAAAAAYYHAQAAAAGHBwEAAAABiAcgAAAAAYkHAQAAAAEBXwAA3wYAMAFfAADfBgAwDQcAAOMRACCFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAIYIHAQDjDAAhgwcBAOMMACGEBwEA4wwAIYUHAQDjDAAhhgcBAOMMACGHBwEA4wwAIYgHIADFDgAhiQcBAOQMACECAAAA1gYAIF8AAOIGACAMhQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACGCBwEA4wwAIYMHAQDjDAAhhAcBAOMMACGFBwEA4wwAIYYHAQDjDAAhhwcBAOMMACGIByAAxQ4AIYkHAQDkDAAhAgAAAOcBACBfAADkBgAgAgAAAOcBACBfAADkBgAgAwAAANYGACBmAADdBgAgZwAA4gYAIAEAAADWBgAgAQAAAOcBACAEFQAA4BEAIGwAAOIRACBtAADhEQAgiQcAAN8MACAPggYAAJ8LADCDBgAA6wYAEIQGAACfCwAwhQYBAMUKACGKBgEAxQoAIY0GQADHCgAhjgZAAMcKACGCBwEAxQoAIYMHAQDFCgAhhAcBAMUKACGFBwEAxQoAIYYHAQDFCgAhhwcBAMUKACGIByAA0woAIYkHAQDGCgAhAwAAAOcBACABAADqBgAwawAA6wYAIAMAAADnAQAgAQAA2QYAMAIAANYGACABAAAA6wEAIAEAAADrAQAgAwAAAOkBACABAADqAQAwAgAA6wEAIAMAAADpAQAgAQAA6gEAMAIAAOsBACADAAAA6QEAIAEAAOoBADACAADrAQAgEwcAAN8RACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAD6BgLTBgAAANMGAtUGEAAAAAHWBgEAAAAB1wYCAAAAAfgGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGAB4AAAAABgQdAAAAAAQFfAADzBgAgEoUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAPoGAtMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-AYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABAV8AAPUGADABXwAA9QYAMBMHAADeEQAghQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACG9BgAA3RH6BiLTBgAA6Q7TBiLVBhAA6w4AIdYGAQDjDAAh1wYCAOwOACH4BgEA4wwAIfoGAQDjDAAh-wYBAOQMACH8BgEA5AwAIf0GAQDkDAAh_gYBAOQMACH_BgEA5AwAIYAHgAAAAAGBB0AA-wwAIQIAAADrAQAgXwAA-AYAIBKFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAIb0GAADdEfoGItMGAADpDtMGItUGEADrDgAh1gYBAOMMACHXBgIA7A4AIfgGAQDjDAAh-gYBAOMMACH7BgEA5AwAIfwGAQDkDAAh_QYBAOQMACH-BgEA5AwAIf8GAQDkDAAhgAeAAAAAAYEHQAD7DAAhAgAAAOkBACBfAAD6BgAgAgAAAOkBACBfAAD6BgAgAwAAAOsBACBmAADzBgAgZwAA-AYAIAEAAADrAQAgAQAAAOkBACAMFQAA2BEAIGwAANsRACBtAADaEQAg7gEAANkRACDvAQAA3BEAIPsGAADfDAAg_AYAAN8MACD9BgAA3wwAIP4GAADfDAAg_wYAAN8MACCABwAA3wwAIIEHAADfDAAgFYIGAACZCwAwgwYAAIEHABCEBgAAmQsAMIUGAQDFCgAhigYBAMUKACGNBkAAxwoAIY4GQADHCgAhvQYAAJoL-gYi0wYAAPAK0wYi1QYQAPIKACHWBgEAxQoAIdcGAgDzCgAh-AYBAMUKACH6BgEAxQoAIfsGAQDGCgAh_AYBAMYKACH9BgEAxgoAIf4GAQDGCgAh_wYBAMYKACGABwAAmwsAIIEHQADiCgAhAwAAAOkBACABAACABwAwawAAgQcAIAMAAADpAQAgAQAA6gEAMAIAAOsBACAQFAAAmAsAIIIGAACXCwAwgwYAAIcHABCEBgAAlwsAMIUGAQAAAAGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIbYGAQDYCgAh8gYBANkKACHzBgEA2AoAIfQGAADRCgAg9QYBANkKACH2BgEA2QoAIfcGAQDYCgAhAQAAAIQHACABAAAAhAcAIBAUAACYCwAgggYAAJcLADCDBgAAhwcAEIQGAACXCwAwhQYBANgKACGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIbYGAQDYCgAh8gYBANkKACHzBgEA2AoAIfQGAADRCgAg9QYBANkKACH2BgEA2QoAIfcGAQDYCgAhBRQAANcRACCLBgAA3wwAIPIGAADfDAAg9QYAAN8MACD2BgAA3wwAIAMAAACHBwAgAQAAiAcAMAIAAIQHACADAAAAhwcAIAEAAIgHADACAACEBwAgAwAAAIcHACABAACIBwAwAgAAhAcAIA0UAADWEQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB8gYBAAAAAfMGAQAAAAH0BgAA1REAIPUGAQAAAAH2BgEAAAAB9wYBAAAAAQFfAACMBwAgDIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAfIGAQAAAAHzBgEAAAAB9AYAANURACD1BgEAAAAB9gYBAAAAAfcGAQAAAAEBXwAAjgcAMAFfAACOBwAwDRQAAMsRACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACHyBgEA5AwAIfMGAQDjDAAh9AYAAMoRACD1BgEA5AwAIfYGAQDkDAAh9wYBAOMMACECAAAAhAcAIF8AAJEHACAMhQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIbYGAQDjDAAh8gYBAOQMACHzBgEA4wwAIfQGAADKEQAg9QYBAOQMACH2BgEA5AwAIfcGAQDjDAAhAgAAAIcHACBfAACTBwAgAgAAAIcHACBfAACTBwAgAwAAAIQHACBmAACMBwAgZwAAkQcAIAEAAACEBwAgAQAAAIcHACAHFQAAxxEAIGwAAMkRACBtAADIEQAgiwYAAN8MACDyBgAA3wwAIPUGAADfDAAg9gYAAN8MACAPggYAAJYLADCDBgAAmgcAEIQGAACWCwAwhQYBAMUKACGKBgEAxQoAIYsGAQDGCgAhjQZAAMcKACGOBkAAxwoAIbYGAQDFCgAh8gYBAMYKACHzBgEAxQoAIfQGAADRCgAg9QYBAMYKACH2BgEAxgoAIfcGAQDFCgAhAwAAAIcHACABAACZBwAwawAAmgcAIAMAAACHBwAgAQAAiAcAMAIAAIQHACAQFAAAlQsAIIIGAACUCwAwgwYAAKAHABCEBgAAlAsAMIUGAQAAAAGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIbYGAQDYCgAh8gYBANkKACHzBgEA2AoAIfQGAADRCgAg9QYBANkKACH2BgEA2QoAIfcGAQDYCgAhAQAAAJ0HACABAAAAnQcAIBAUAACVCwAgggYAAJQLADCDBgAAoAcAEIQGAACUCwAwhQYBANgKACGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIbYGAQDYCgAh8gYBANkKACHzBgEA2AoAIfQGAADRCgAg9QYBANkKACH2BgEA2QoAIfcGAQDYCgAhBRQAAMYRACCLBgAA3wwAIPIGAADfDAAg9QYAAN8MACD2BgAA3wwAIAMAAACgBwAgAQAAoQcAMAIAAJ0HACADAAAAoAcAIAEAAKEHADACAACdBwAgAwAAAKAHACABAAChBwAwAgAAnQcAIA0UAADFEQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB8gYBAAAAAfMGAQAAAAH0BgAAxBEAIPUGAQAAAAH2BgEAAAAB9wYBAAAAAQFfAAClBwAgDIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAfIGAQAAAAHzBgEAAAAB9AYAAMQRACD1BgEAAAAB9gYBAAAAAfcGAQAAAAEBXwAApwcAMAFfAACnBwAwDRQAALoRACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACHyBgEA5AwAIfMGAQDjDAAh9AYAALkRACD1BgEA5AwAIfYGAQDkDAAh9wYBAOMMACECAAAAnQcAIF8AAKoHACAMhQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIbYGAQDjDAAh8gYBAOQMACHzBgEA4wwAIfQGAAC5EQAg9QYBAOQMACH2BgEA5AwAIfcGAQDjDAAhAgAAAKAHACBfAACsBwAgAgAAAKAHACBfAACsBwAgAwAAAJ0HACBmAAClBwAgZwAAqgcAIAEAAACdBwAgAQAAAKAHACAHFQAAthEAIGwAALgRACBtAAC3EQAgiwYAAN8MACDyBgAA3wwAIPUGAADfDAAg9gYAAN8MACAPggYAAJMLADCDBgAAswcAEIQGAACTCwAwhQYBAMUKACGKBgEAxQoAIYsGAQDGCgAhjQZAAMcKACGOBkAAxwoAIbYGAQDFCgAh8gYBAMYKACHzBgEAxQoAIfQGAADRCgAg9QYBAMYKACH2BgEAxgoAIfcGAQDFCgAhAwAAAKAHACABAACyBwAwawAAswcAIAMAAACgBwAgAQAAoQcAMAIAAJ0HACABAAAAIAAgAQAAACAAIAMAAAAeACABAAAfADACAAAgACADAAAAHgAgAQAAHwAwAgAAIAAgAwAAAB4AIAEAAB8AMAIAACAAIA8HAAC0EQAgCQAAtREAIA0AALMRACAPAACyEQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB5AYBAAAAAe4GAQAAAAHvBkAAAAAB8AYIAAAAAfEGCAAAAAEBXwAAuwcAIAuFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAHkBgEAAAAB7gYBAAAAAe8GQAAAAAHwBggAAAAB8QYIAAAAAQFfAAC9BwAwAV8AAL0HADAPBwAAgREAIAkAAIIRACANAACAEQAgDwAA_xAAIIUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACG2BgEA4wwAIeQGAQDkDAAh7gYBAOQMACHvBkAA-wwAIfAGCACUDQAh8QYIAJQNACECAAAAIAAgXwAAwAcAIAuFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACHkBgEA5AwAIe4GAQDkDAAh7wZAAPsMACHwBggAlA0AIfEGCACUDQAhAgAAAB4AIF8AAMIHACACAAAAHgAgXwAAwgcAIAMAAAAgACBmAAC7BwAgZwAAwAcAIAEAAAAgACABAAAAHgAgChUAAPoQACBsAAD9EAAgbQAA_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_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_BkAA-wwAIcAGQADlDAAhwQYBAOMMACHCBgEA5AwAIdwGAQDjDAAhAgAAAE8AIF8AANgIACAMhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhsQYBAOQMACG7BgEA5AwAIb0GAACnD9wGIr4GAQDkDAAhvwZAAPsMACHABkAA5QwAIcEGAQDjDAAhwgYBAOQMACHcBgEA4wwAIQIAAABNACBfAADaCAAgAgAAAE0AIF8AANoIACABAAAAUwAgAQAAAFUAIAMAAABPACBmAADRCAAgZwAA2AgAIAEAAABPACABAAAATQAgCBUAAMwPACBsAADODwAgbQAAzQ8AILEGAADfDAAguwYAAN8MACC-BgAA3wwAIL8GAADfDAAgwgYAAN8MACAPggYAAP0KADCDBgAA4wgAEIQGAAD9CgAwhQYBAMUKACGNBkAAxwoAIY4GQADHCgAhsQYBAMYKACG7BgEAxgoAIb0GAAD-CtwGIr4GAQDGCgAhvwZAAOIKACHABkAAxwoAIcEGAQDFCgAhwgYBAMYKACHcBgEAxQoAIQMAAABNACABAADiCAAwawAA4wgAIAMAAABNACABAABOADACAABPACABAAAAnwEAIAEAAACfAQAgAwAAAFUAIAEAAJ4BADACAACfAQAgAwAAAFUAIAEAAJ4BADACAACfAQAgAwAAAFUAIAEAAJ4BADACAACfAQAgEAMAAMYPACAHAADEDwAgCQAAxQ8AIA0AAMcPACATAADIDwAgGgAAyQ8AIBwAAMoPACAiAADLDwAghQYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAEBXwAA6wgAIAiFBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAAB2gYBAAAAAQFfAADtCAAwAV8AAO0IADABAAAAEgAgAQAAABkAIBADAAD2DgAgBwAA9A4AIAkAAPUOACANAAD3DgAgEwAA-A4AIBoAAPkOACAcAAD6DgAgIgAA-w4AIIUGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDkDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAh2gYBAOMMACECAAAAnwEAIF8AAPIIACAIhQYBAOMMACGJBgEA5AwAIYoGAQDkDAAhiwYBAOQMACGMBgEA4wwAIY0GQADlDAAhjgZAAOUMACHaBgEA4wwAIQIAAABVACBfAAD0CAAgAgAAAFUAIF8AAPQIACABAAAAEgAgAQAAABkAIAMAAACfAQAgZgAA6wgAIGcAAPIIACABAAAAnwEAIAEAAABVACAGFQAA8Q4AIGwAAPMOACBtAADyDgAgiQYAAN8MACCKBgAA3wwAIIsGAADfDAAgC4IGAAD8CgAwgwYAAP0IABCEBgAA_AoAMIUGAQDFCgAhiQYBAMYKACGKBgEAxgoAIYsGAQDGCgAhjAYBAMUKACGNBkAAxwoAIY4GQADHCgAh2gYBAMUKACEDAAAAVQAgAQAA_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_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABAV8AALUJACAOhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGaBgEAAAABrwYBAAAAAbsGAQAAAAG9BgAAAL0GAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABAV8AALcJADABXwAAtwkAMAEAAABTACABAAAADgAgAQAAABkAIBQHAACsDQAgCQAArQ0AIBAAAN0OACAWAACpDQAgGAAAqw0AIDMAAKoNACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhmgYBAOMMACGvBgEA5AwAIbsGAQDkDAAhvQYAAKcNvQYivgYBAOQMACG_BkAA-wwAIcAGQADlDAAhwQYBAOMMACHCBgEA5AwAIQIAAAClAQAgXwAAvQkAIA6FBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhmgYBAOMMACGvBgEA5AwAIbsGAQDkDAAhvQYAAKcNvQYivgYBAOQMACG_BkAA-wwAIcAGQADlDAAhwQYBAOMMACHCBgEA5AwAIQIAAACjAQAgXwAAvwkAIAIAAACjAQAgXwAAvwkAIAEAAABTACABAAAADgAgAQAAABkAIAMAAAClAQAgZgAAtQkAIGcAAL0JACABAAAApQEAIAEAAACjAQAgCRUAANoOACBsAADcDgAgbQAA2w4AIIsGAADfDAAgrwYAAN8MACC7BgAA3wwAIL4GAADfDAAgvwYAAN8MACDCBgAA3wwAIBGCBgAA5woAMIMGAADJCQAQhAYAAOcKADCFBgEAxQoAIYoGAQDFCgAhiwYBAMYKACGNBkAAxwoAIY4GQADHCgAhmgYBAMUKACGvBgEAxgoAIbsGAQDGCgAhvQYAAOgKvQYivgYBAMYKACG_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-wrTBiILggYAAPwKADCDBgAA_QgAEIQGAAD8CgAwhQYBAMUKACGJBgEAxgoAIYoGAQDGCgAhiwYBAMYKACGMBgEAxQoAIY0GQADHCgAhjgZAAMcKACHaBgEAxQoAIQ-CBgAA_QoAMIMGAADjCAAQhAYAAP0KADCFBgEAxQoAIY0GQADHCgAhjgZAAMcKACGxBgEAxgoAIbsGAQDGCgAhvQYAAP4K3AYivgYBAMYKACG_BkAA4goAIcAGQADHCgAhwQYBAMUKACHCBgEAxgoAIdwGAQDFCgAhBxUAAMkKACBsAACACwAgbQAAgAsAII8GAAAA3AYCkAYAAADcBgiRBgAAANwGCJYGAAD_CtwGIgcVAADJCgAgbAAAgAsAIG0AAIALACCPBgAAANwGApAGAAAA3AYIkQYAAADcBgiWBgAA_wrcBiIEjwYAAADcBgKQBgAAANwGCJEGAAAA3AYIlgYAAIAL3AYiDIIGAACBCwAwgwYAAMkIABCEBgAAgQsAMIUGAQDFCgAhjQZAAMcKACGOBkAAxwoAIZsGAQDFCgAhnAYBAMUKACGhBgAA0goAIKMGIADTCgAh3AYBAMUKACHdBgAA0QoAIA0XAADdCgAgggYAAIILADCDBgAAtAIAEIQGAACCCwAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAhmwYBANgKACGcBgEA2AoAIaEGAADaCgAgowYgANsKACHcBgEA2AoAId0GAADRCgAgCIIGAACDCwAwgwYAALEIABCEBgAAgwsAMIUGAQDFCgAhigYBAMUKACHeBgEAxQoAId8GQADHCgAh4AZAAMcKACENDAAAhQsAIA0AAIcLACAcAACJCwAgJQAAhgsAICcAAIgLACCCBgAAhAsAMIMGAAAwABCEBgAAhAsAMIUGAQDYCgAhigYBANgKACHeBgEA2AoAId8GQADcCgAh4AZAANwKACED4QYAADIAIOIGAAAyACDjBgAAMgAgA-EGAAA2ACDiBgAANgAg4wYAADYAIAPhBgAAJwAg4gYAACcAIOMGAAAnACAD4QYAAHYAIOIGAAB2ACDjBgAAdgAgA-EGAABXACDiBgAAVwAg4wYAAFcAIA2CBgAAigsAMIMGAACZCAAQhAYAAIoLADCFBgEAxQoAIYoGAQDFCgAhiwYBAMYKACGNBkAAxwoAIY4GQADHCgAh3gYBAMUKACHkBgEAxgoAIeUGAgCLCwAh5gYBAMUKACHnBgEAxgoAIQ0VAADMCgAgbAAAzAoAIG0AAMwKACDuAQAA7goAIO8BAADMCgAgjwYCAAAAAZAGAgAAAAWRBgIAAAAFkgYCAAAAAZMGAgAAAAGUBgIAAAABlQYCAAAAAZYGAgCMCwAhDRUAAMwKACBsAADMCgAgbQAAzAoAIO4BAADuCgAg7wEAAMwKACCPBgIAAAABkAYCAAAABZEGAgAAAAWSBgIAAAABkwYCAAAAAZQGAgAAAAGVBgIAAAABlgYCAIwLACEOggYAAI0LADCDBgAA_wcAEIQGAACNCwAwhQYBAMUKACGKBgEAxgoAIYsGAQDGCgAhjQZAAMcKACGOBkAAxwoAIb0GAACOC-sGIt4GAQDFCgAh5AYBAMYKACHmBgEAxgoAIegGAQDFCgAh6QYBAMUKACEHFQAAyQoAIGwAAJALACBtAACQCwAgjwYAAADrBgKQBgAAAOsGCJEGAAAA6wYIlgYAAI8L6wYiBxUAAMkKACBsAACQCwAgbQAAkAsAII8GAAAA6wYCkAYAAADrBgiRBgAAAOsGCJYGAACPC-sGIgSPBgAAAOsGApAGAAAA6wYIkQYAAADrBgiWBgAAkAvrBiIOggYAAJELADCDBgAA4wcAEIQGAACRCwAwhQYBAMUKACGKBgEAxgoAIYsGAQDGCgAhjQZAAMcKACGOBkAAxwoAIcMGAQDFCgAh3gYBAMUKACHkBgEAxgoAIesGAQDGCgAh7AYBAMUKACHtBgEAxQoAIQ6CBgAAkgsAMIMGAADJBwAQhAYAAJILADCFBgEAxQoAIYoGAQDFCgAhiwYBAMUKACGNBkAAxwoAIY4GQADHCgAhtgYBAMUKACHkBgEAxgoAIe4GAQDGCgAh7wZAAOIKACHwBggA7AoAIfEGCADsCgAhD4IGAACTCwAwgwYAALMHABCEBgAAkwsAMIUGAQDFCgAhigYBAMUKACGLBgEAxgoAIY0GQADHCgAhjgZAAMcKACG2BgEAxQoAIfIGAQDGCgAh8wYBAMUKACH0BgAA0QoAIPUGAQDGCgAh9gYBAMYKACH3BgEAxQoAIRAUAACVCwAgggYAAJQLADCDBgAAoAcAEIQGAACUCwAwhQYBANgKACGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIbYGAQDYCgAh8gYBANkKACHzBgEA2AoAIfQGAADRCgAg9QYBANkKACH2BgEA2QoAIfcGAQDYCgAhA-EGAABNACDiBgAATQAg4wYAAE0AIA-CBgAAlgsAMIMGAACaBwAQhAYAAJYLADCFBgEAxQoAIYoGAQDFCgAhiwYBAMYKACGNBkAAxwoAIY4GQADHCgAhtgYBAMUKACHyBgEAxgoAIfMGAQDFCgAh9AYAANEKACD1BgEAxgoAIfYGAQDGCgAh9wYBAMUKACEQFAAAmAsAIIIGAACXCwAwgwYAAIcHABCEBgAAlwsAMIUGAQDYCgAhigYBANgKACGLBgEA2QoAIY0GQADcCgAhjgZAANwKACG2BgEA2AoAIfIGAQDZCgAh8wYBANgKACH0BgAA0QoAIPUGAQDZCgAh9gYBANkKACH3BgEA2AoAIQPhBgAAowEAIOIGAACjAQAg4wYAAKMBACAVggYAAJkLADCDBgAAgQcAEIQGAACZCwAwhQYBAMUKACGKBgEAxQoAIY0GQADHCgAhjgZAAMcKACG9BgAAmgv6BiLTBgAA8ArTBiLVBhAA8goAIdYGAQDFCgAh1wYCAPMKACH4BgEAxQoAIfoGAQDFCgAh-wYBAMYKACH8BgEAxgoAIf0GAQDGCgAh_gYBAMYKACH_BgEAxgoAIYAHAACbCwAggQdAAOIKACEHFQAAyQoAIGwAAJ4LACBtAACeCwAgjwYAAAD6BgKQBgAAAPoGCJEGAAAA-gYIlgYAAJ0L-gYiDxUAAMwKACBsAACcCwAgbQAAnAsAII8GgAAAAAGSBoAAAAABkwaAAAAAAZQGgAAAAAGVBoAAAAABlgaAAAAAAaQGAQAAAAGlBgEAAAABpgYBAAAAAacGgAAAAAGoBoAAAAABqQaAAAAAAQyPBoAAAAABkgaAAAAAAZMGgAAAAAGUBoAAAAABlQaAAAAAAZYGgAAAAAGkBgEAAAABpQYBAAAAAaYGAQAAAAGnBoAAAAABqAaAAAAAAakGgAAAAAEHFQAAyQoAIGwAAJ4LACBtAACeCwAgjwYAAAD6BgKQBgAAAPoGCJEGAAAA-gYIlgYAAJ0L-gYiBI8GAAAA-gYCkAYAAAD6BgiRBgAAAPoGCJYGAACeC_oGIg-CBgAAnwsAMIMGAADrBgAQhAYAAJ8LADCFBgEAxQoAIYoGAQDFCgAhjQZAAMcKACGOBkAAxwoAIYIHAQDFCgAhgwcBAMUKACGEBwEAxQoAIYUHAQDFCgAhhgcBAMUKACGHBwEAxQoAIYgHIADTCgAhiQcBAMYKACEQBwAAoQsAIIIGAACgCwAwgwYAAOcBABCEBgAAoAsAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAhggcBANgKACGDBwEA2AoAIYQHAQDYCgAhhQcBANgKACGGBwEA2AoAIYcHAQDYCgAhiAcgANsKACGJBwEA2QoAISgGAADTCwAgDAAAhQsAIA0AAIcLACARAADWCwAgHAAAiQsAICUAAIYLACAnAACICwAgKgAA3gsAIC4AAM8LACAvAADQCwAgMAAA0gsAIDEAANQLACAyAADVCwAgNAAAmAsAIDUAANgLACA2AADZCwAgNwAA2gsAIDoAAM4LACA7AADRCwAgPwAA3QsAIEAAANcLACBBAADbCwAgQgAA3AsAIEcAAN8LACBIAADgCwAgSQAA4QsAIEoAAOELACCCBgAAzAsAMIMGAAASABCEBgAAzAsAMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIbkGAADNC6sHI94GAQDYCgAh5AYBANkKACGpBwEA2QoAIawHAQDZCgAh6QcAABIAIOoHAAASACAaggYAAKILADCDBgAA0wYAEIQGAACiCwAwhQYBAMUKACGKBgEAxQoAIYsGAQDFCgAhjQZAAMcKACGOBkAAxwoAIbEGAQDFCgAhvQYAAKQLjgci1QYQAPIKACHWBgEAxQoAIdcGAgDzCgAh5gYBAMUKACH6BgEAxQoAIfsGAQDGCgAh_AYBAMYKACH9BgEAxgoAIf4GAQDGCgAh_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_BkAA4goAIeQGAQDGCgAhpgcBAMYKACGnBwEAxQoAIagHAQDFCgAhqQcBAMYKACGrBwAAvwurByOsBwEAxgoAIa0HAADAC9MGI64HEADBCwAhrwcBAMUKACGwBwIAiwsAIbEHAACaC_oGIrIHAQDGCgAhswcBAMYKACG0BwEAxgoAIbUHAQDGCgAhtgcBAMYKACG3BwEAxgoAIbgHAACbCwAguQdAAOIKACG7BwEAxgoAIQcVAADMCgAgbAAAygsAIG0AAMoLACCPBgAAAKsHA5AGAAAAqwcJkQYAAACrBwmWBgAAyQurByMHFQAAzAoAIGwAAMgLACBtAADICwAgjwYAAADTBgOQBgAAANMGCZEGAAAA0wYJlgYAAMcL0wYjDRUAAMwKACBsAADGCwAgbQAAxgsAIO4BAADGCwAg7wEAAMYLACCPBhAAAAABkAYQAAAABZEGEAAAAAWSBhAAAAABkwYQAAAAAZQGEAAAAAGVBhAAAAABlgYQAMULACEHFQAAyQoAIGwAAMQLACBtAADECwAgjwYAAAC7BwKQBgAAALsHCJEGAAAAuwcIlgYAAMMLuwciBxUAAMkKACBsAADECwAgbQAAxAsAII8GAAAAuwcCkAYAAAC7BwiRBgAAALsHCJYGAADDC7sHIgSPBgAAALsHApAGAAAAuwcIkQYAAAC7BwiWBgAAxAu7ByINFQAAzAoAIGwAAMYLACBtAADGCwAg7gEAAMYLACDvAQAAxgsAII8GEAAAAAGQBhAAAAAFkQYQAAAABZIGEAAAAAGTBhAAAAABlAYQAAAAAZUGEAAAAAGWBhAAxQsAIQiPBhAAAAABkAYQAAAABZEGEAAAAAWSBhAAAAABkwYQAAAAAZQGEAAAAAGVBhAAAAABlgYQAMYLACEHFQAAzAoAIGwAAMgLACBtAADICwAgjwYAAADTBgOQBgAAANMGCZEGAAAA0wYJlgYAAMcL0wYjBI8GAAAA0wYDkAYAAADTBgmRBgAAANMGCZYGAADIC9MGIwcVAADMCgAgbAAAygsAIG0AAMoLACCPBgAAAKsHA5AGAAAAqwcJkQYAAACrBwmWBgAAyQurByMEjwYAAACrBwOQBgAAAKsHCZEGAAAAqwcJlgYAAMoLqwcjC4IGAADLCwAwgwYAAJUFABCEBgAAywsAMIUGAQDFCgAhjQZAAMcKACGOBkAAxwoAIbkGAAC_C6sHI94GAQDFCgAh5AYBAMYKACGpBwEAxgoAIawHAQDGCgAhJgYAANMLACAMAACFCwAgDQAAhwsAIBEAANYLACAcAACJCwAgJQAAhgsAICcAAIgLACAqAADeCwAgLgAAzwsAIC8AANALACAwAADSCwAgMQAA1AsAIDIAANULACA0AACYCwAgNQAA2AsAIDYAANkLACA3AADaCwAgOgAAzgsAIDsAANELACA_AADdCwAgQAAA1wsAIEEAANsLACBCAADcCwAgRwAA3wsAIEgAAOALACBJAADhCwAgSgAA4QsAIIIGAADMCwAwgwYAABIAEIQGAADMCwAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAhuQYAAM0Lqwcj3gYBANgKACHkBgEA2QoAIakHAQDZCgAhrAcBANkKACEEjwYAAACrBwOQBgAAAKsHCZEGAAAAqwcJlgYAAMoLqwcjA-EGAAAUACDiBgAAFAAg4wYAABQAIAPhBgAAHgAg4gYAAB4AIOMGAAAeACAD4QYAAG0AIOIGAABtACDjBgAAbQAgA-EGAADKAQAg4gYAAMoBACDjBgAAygEAIAPhBgAAIgAg4gYAACIAIOMGAAAiACAD4QYAAAsAIOIGAAALACDjBgAACwAgA-EGAAAOACDiBgAADgAg4wYAAA4AIAPhBgAAVQAg4gYAAFUAIOMGAABVACAD4QYAADsAIOIGAAA7ACDjBgAAOwAgA-EGAADVAQAg4gYAANUBACDjBgAA1QEAIAPhBgAAQAAg4gYAAEAAIOMGAABAACAD4QYAAEUAIOIGAABFACDjBgAARQAgA-EGAACLAQAg4gYAAIsBACDjBgAAiwEAIBIHAAChCwAgggYAAKALADCDBgAA5wEAEIQGAACgCwAwhQYBANgKACGKBgEA2AoAIY0GQADcCgAhjgZAANwKACGCBwEA2AoAIYMHAQDYCgAhhAcBANgKACGFBwEA2AoAIYYHAQDYCgAhhwcBANgKACGIByAA2woAIYkHAQDZCgAh6QcAAOcBACDqBwAA5wEAIAPhBgAA6QEAIOIGAADpAQAg4wYAAOkBACAD4QYAANsBACDiBgAA2wEAIOMGAADbAQAgA-EGAAArACDiBgAAKwAg4wYAACsAIAPhBgAA8AEAIOIGAADwAQAg4wYAAPABACAD4QYAAP4BACDiBgAA_gEAIOMGAAD-AQAgA-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-EHIgcVAADJCgAgbAAA_wsAIG0AAP8LACCPBgAAAOEHApAGAAAA4QcIkQYAAADhBwiWBgAA_gvhByIHFQAAyQoAIGwAAP8LACBtAAD_CwAgjwYAAADhBwKQBgAAAOEHCJEGAAAA4QcIlgYAAP4L4QciBI8GAAAA4QcCkAYAAADhBwiRBgAAAOEHCJYGAAD_C-EHIgoDAADdCgAgggYAAIAMADCDBgAAtgIAEIQGAACADAAwhQYBANgKACGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHFBwEA2AoAIcYHQADcCgAhEAcAAKELACAgAADdCgAgPQAAhQwAIIIGAACBDAAwgwYAAP4BABCEBgAAgQwAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAhvQYAAIMMpQcivwZAAIQMACGdBwEA2AoAIaMHAACCDKMHIqUHAQDZCgAhpgcBANkKACEEjwYAAACjBwKQBgAAAKMHCJEGAAAAowcIlgYAAL0LowciBI8GAAAApQcCkAYAAAClBwiRBgAAAKUHCJYGAAC7C6UHIgiPBkAAAAABkAZAAAAABZEGQAAAAAWSBkAAAAABkwZAAAAAAZQGQAAAAAGVBkAAAAABlgZAAOQKACEoBAAA8gsAIAUAAPMLACAGAADTCwAgEAAA1AsAIBkAANULACA0AACYCwAgQAAA1wsAIE0AANcLACBOAACYCwAgTwAA9AsAIFAAAJULACBRAACVCwAgUgAA9QsAIFMAAPYLACBUAADhCwAgVQAA4QsAIFYAAOALACBXAADgCwAgWAAA3wsAIFkAAPcLACCCBgAA8QsAMIMGAABTABCEBgAA8QsAMIUGAQDYCgAhiQYBANkKACGNBkAA3AoAIY4GQADcCgAh3gYBANgKACGVBwEA2AoAIdUHAQDYCgAh1gcgANsKACHXBwEA2QoAIdgHAQDZCgAh2QcBANkKACHaBwEA2QoAIdsHAQDZCgAh3AcBANkKACHdBwEA2AoAIekHAABTACDqBwAAUwAgAowGAQAAAAGSBwEAAAABCQMAAN0KACBEAACIDAAgggYAAIcMADCDBgAA-AEAEIQGAACHDAAwhQYBANgKACGMBgEA2AoAIZIHAQDYCgAhkwdAANwKACERBwAAoQsAIEMAAN0KACBFAACNDAAgRgAA9wsAIIIGAACMDAAwgwYAAPABABCEBgAAjAwAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAhtgYBANgKACG3BgEA2AoAIZYHAQDYCgAhlwcAAIsMlQci6QcAAPABACDqBwAA8AEAIAKSBwEAAAABlQcAAACVBwIIRAAAiAwAIIIGAACKDAAwgwYAAPQBABCEBgAAigwAMIUGAQDYCgAhjQZAANwKACGSBwEA2AoAIZUHAACLDJUHIgSPBgAAAJUHApAGAAAAlQcIkQYAAACVBwiWBgAArguVByIPBwAAoQsAIEMAAN0KACBFAACNDAAgRgAA9wsAIIIGAACMDAAwgwYAAPABABCEBgAAjAwAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAhtgYBANgKACG3BgEA2AoAIZYHAQDYCgAhlwcAAIsMlQciA-EGAAD0AQAg4gYAAPQBACDjBgAA9AEAIBYHAAChCwAgggYAAI4MADCDBgAA6QEAEIQGAACODAAwhQYBANgKACGKBgEA2AoAIY0GQADcCgAhjgZAANwKACG9BgAAkgz6BiLTBgAAjwzTBiLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACH4BgEA2AoAIfoGAQDYCgAh-wYBANkKACH8BgEA2QoAIf0GAQDZCgAh_gYBANkKACH_BgEA2QoAIYAHAACTDAAggQdAAIQMACEEjwYAAADTBgKQBgAAANMGCJEGAAAA0wYIlgYAAPsK0wYiCI8GEAAAAAGQBhAAAAAEkQYQAAAABJIGEAAAAAGTBhAAAAABlAYQAAAAAZUGEAAAAAGWBhAA9woAIQiPBgIAAAABkAYCAAAABJEGAgAAAASSBgIAAAABkwYCAAAAAZQGAgAAAAGVBgIAAAABlgYCAMkKACEEjwYAAAD6BgKQBgAAAPoGCJEGAAAA-gYIlgYAAJ4L-gYiDI8GgAAAAAGSBoAAAAABkwaAAAAAAZQGgAAAAAGVBoAAAAABlgaAAAAAAaQGAQAAAAGlBgEAAAABpgYBAAAAAacGgAAAAAGoBoAAAAABqQaAAAAAAREHAAChCwAgPgAAlgwAIIIGAACUDAAwgwYAANsBABCEBgAAlAwAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAhvQYAAJUM1QYi0QYBANkKACHTBgAAjwzTBiLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACHYBkAA3AoAIdkGQADcCgAhBI8GAAAA1QYCkAYAAADVBgiRBgAAANUGCJYGAAD5CtUGIiQHAACcDAAgPAAA3QoAID0AAIUMACA_AADdCwAgggYAAJcMADCDBgAA1QEAEIQGAACXDAAwhQYBANgKACGKBgEA2QoAIY0GQADcCgAhjgZAANwKACG9BgAAmwy7ByK_BkAAhAwAIeQGAQDZCgAhpgcBANkKACGnBwEA2AoAIagHAQDYCgAhqQcBANkKACGrBwAAzQurByOsBwEA2QoAIa0HAACYDNMGI64HEACZDAAhrwcBANgKACGwBwIAmgwAIbEHAACSDPoGIrIHAQDZCgAhswcBANkKACG0BwEA2QoAIbUHAQDZCgAhtgcBANkKACG3BwEA2QoAIbgHAACTDAAguQdAAIQMACG7BwEA2QoAIekHAADVAQAg6gcAANUBACAiBwAAnAwAIDwAAN0KACA9AACFDAAgPwAA3QsAIIIGAACXDAAwgwYAANUBABCEBgAAlwwAMIUGAQDYCgAhigYBANkKACGNBkAA3AoAIY4GQADcCgAhvQYAAJsMuwcivwZAAIQMACHkBgEA2QoAIaYHAQDZCgAhpwcBANgKACGoBwEA2AoAIakHAQDZCgAhqwcAAM0LqwcjrAcBANkKACGtBwAAmAzTBiOuBxAAmQwAIa8HAQDYCgAhsAcCAJoMACGxBwAAkgz6BiKyBwEA2QoAIbMHAQDZCgAhtAcBANkKACG1BwEA2QoAIbYHAQDZCgAhtwcBANkKACG4BwAAkwwAILkHQACEDAAhuwcBANkKACEEjwYAAADTBgOQBgAAANMGCZEGAAAA0wYJlgYAAMgL0wYjCI8GEAAAAAGQBhAAAAAFkQYQAAAABZIGEAAAAAGTBhAAAAABlAYQAAAAAZUGEAAAAAGWBhAAxgsAIQiPBgIAAAABkAYCAAAABZEGAgAAAAWSBgIAAAABkwYCAAAAAZQGAgAAAAGVBgIAAAABlgYCAMwKACEEjwYAAAC7BwKQBgAAALsHCJEGAAAAuwcIlgYAAMQLuwciKAYAANMLACAMAACFCwAgDQAAhwsAIBEAANYLACAcAACJCwAgJQAAhgsAICcAAIgLACAqAADeCwAgLgAAzwsAIC8AANALACAwAADSCwAgMQAA1AsAIDIAANULACA0AACYCwAgNQAA2AsAIDYAANkLACA3AADaCwAgOgAAzgsAIDsAANELACA_AADdCwAgQAAA1wsAIEEAANsLACBCAADcCwAgRwAA3wsAIEgAAOALACBJAADhCwAgSgAA4QsAIIIGAADMCwAwgwYAABIAEIQGAADMCwAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAhuQYAAM0Lqwcj3gYBANgKACHkBgEA2QoAIakHAQDZCgAhrAcBANkKACHpBwAAEgAg6gcAABIAIA4HAAChCwAgKgAA3gsAIIIGAACdDAAwgwYAAMoBABCEBgAAnQwAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAh3gYBANkKACHABwEA2AoAIcEHAQDYCgAhwgcCAJEMACHEBwAAngzEByIEjwYAAADEBwKQBgAAAMQHCJEGAAAAxAcIlgYAAOkLxAciGwcAAKELACAJAACjDAAgEAAAogwAICkAAKEMACCCBgAAnwwAMIMGAACLAQAQhAYAAJ8MADCFBgEA2AoAIYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAhrwYBANgKACHDBgEA2AoAIcQGCACgDAAhxQYIAKAMACHGBggAoAwAIccGCACgDAAhyAYIAKAMACHJBggAoAwAIcoGCACgDAAhywYIAKAMACHMBggAoAwAIc0GCACgDAAhzgYIAKAMACHPBggAoAwAIdAGCACgDAAhCI8GCAAAAAGQBggAAAAFkQYIAAAABZIGCAAAAAGTBggAAAABlAYIAAAAAZUGCAAAAAGWBggA7goAIRwHAAChCwAgCQAAowwAIAoAANMMACALAADeCwAgDgAAxAwAIA8AAMcMACAQAACiDAAgGQAAuQwAIBsAALEMACAsAADRDAAgLQAA0gwAIIIGAADQDAAwgwYAACcAEIQGAADQDAAwhQYBANgKACGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIa0GAQDYCgAhrgYBANgKACGvBgEA2AoAIbEGAQDYCgAh5gYBANgKACH2BgEA2QoAIb0HQADcCgAh6QcAACcAIOoHAAAnACAYAwAA3QoAIAcAAJwMACAJAACwDAAgDQAAhwsAIBEAANYLACAiAADhCwAgJAAA2AsAIEsAAJgLACBMAADaCwAgggYAANoMADCDBgAADgAQhAYAANoMADCFBgEA2AoAIYYGAQDYCgAhhwYBANgKACGIBgEA2AoAIYkGAQDZCgAhigYBANkKACGLBgEA2AoAIYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIekHAAAOACDqBwAADgAgHggAANcMACAMAACFCwAgDQAAhwsAIBEAANYLACAcAACJCwAgJQAAhgsAICcAAIgLACAqAADeCwAgLgAAzwsAIC8AANALACAwAADSCwAgMQAA1AsAIDIAANULACA0AACYCwAgNQAA2AsAIDYAANkLACA3AADaCwAgOAAA4QsAIIIGAADWDAAwgwYAABkAEIQGAADWDAAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACH1BgEA2QoAIakHAQDZCgAhvAcBANgKACHpBwAAGQAg6gcAABkAIAKaBgEAAAABwQYBAAAAARcHAAChCwAgCQAAowwAIBAAAKgMACAWAACnDAAgGAAAhQwAIDMAAN0KACCCBgAApQwAMIMGAACjAQAQhAYAAKUMADCFBgEA2AoAIYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAhmgYBANgKACGvBgEA2QoAIbsGAQDZCgAhvQYAAKYMvQYivgYBANkKACG_BkAAhAwAIcAGQADcCgAhwQYBANgKACHCBgEA2QoAIQSPBgAAAL0GApAGAAAAvQYIkQYAAAC9BgiWBgAA6gq9BiISFAAAmAsAIIIGAACXCwAwgwYAAIcHABCEBgAAlwsAMIUGAQDYCgAhigYBANgKACGLBgEA2QoAIY0GQADcCgAhjgZAANwKACG2BgEA2AoAIfIGAQDZCgAh8wYBANgKACH0BgAA0QoAIPUGAQDZCgAh9gYBANkKACH3BgEA2AoAIekHAACHBwAg6gcAAIcHACAYAwAA3QoAIAcAAJwMACAJAACwDAAgDQAAhwsAIBEAANYLACAiAADhCwAgJAAA2AsAIEsAAJgLACBMAADaCwAgggYAANoMADCDBgAADgAQhAYAANoMADCFBgEA2AoAIYYGAQDYCgAhhwYBANgKACGIBgEA2AoAIYkGAQDZCgAhigYBANkKACGLBgEA2AoAIYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIekHAAAOACDqBwAADgAgEwMAAN0KACAHAACcDAAgCQAAowwAIA0AAIcLACATAADZCwAgGgAAlQsAIBwAAIkLACAiAADhCwAgggYAAKkMADCDBgAAVQAQhAYAAKkMADCFBgEA2AoAIYkGAQDZCgAhigYBANkKACGLBgEA2QoAIYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIdoGAQDYCgAhDQcAAKELACAJAACjDAAgJQAAhgsAIIIGAACqDAAwgwYAAG0AEIQGAACqDAAwhQYBANgKACGKBgEA2AoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAId4GAQDYCgAh5AYBANkKACECwwYBAAAAAd4HQAAAAAEKKQAAoQwAIIIGAACsDAAwgwYAAIcBABCEBgAArAwAMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIb0GAACtDOAHIsMGAQDYCgAh3gdAANwKACEEjwYAAADgBwKQBgAAAOAHCJEGAAAA4AcIlgYAAPsL4AciAosGAQAAAAHmBgEAAAABEQcAAKELACAJAACwDAAgGwAAsQwAIBwAAIkLACCCBgAArwwAMIMGAAB2ABCEBgAArwwAMIUGAQDYCgAhigYBANgKACGLBgEA2AoAIY0GQADcCgAhjgZAANwKACHWBgEA2AoAIeYGAQDYCgAhiAcgANsKACGQBxAAkAwAIZEHEACQDAAhHggAANcMACAMAACFCwAgDQAAhwsAIBEAANYLACAcAACJCwAgJQAAhgsAICcAAIgLACAqAADeCwAgLgAAzwsAIC8AANALACAwAADSCwAgMQAA1AsAIDIAANULACA0AACYCwAgNQAA2AsAIDYAANkLACA3AADaCwAgOAAA4QsAIIIGAADWDAAwgwYAABkAEIQGAADWDAAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACH1BgEA2QoAIakHAQDZCgAhvAcBANgKACHpBwAAGQAg6gcAABkAIA8MAACFCwAgDQAAhwsAIBwAAIkLACAlAACGCwAgJwAAiAsAIIIGAACECwAwgwYAADAAEIQGAACECwAwhQYBANgKACGKBgEA2AoAId4GAQDYCgAh3wZAANwKACHgBkAA3AoAIekHAAAwACDqBwAAMAAgGhAAAKgMACAYAACFDAAgGQAAtQwAIB4AAKELACAfAAChCwAgIAAA3QoAICEAAKMMACCCBgAAsgwAMIMGAABdABCEBgAAsgwAMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIa8GAQDZCgAhsQYBANkKACG9BgAAtAybByK_BkAAhAwAIcIGAQDZCgAhmQcAALMMmQcimwcBANgKACGcBwEA2AoAIZ0HAQDYCgAhngcBANkKACGfBwEA2QoAIaAHAQDZCgAhoQdAANwKACEEjwYAAACZBwKQBgAAAJkHCJEGAAAAmQcIlgYAALYLmQciBI8GAAAAmwcCkAYAAACbBwiRBgAAAJsHCJYGAAC0C5sHIhUDAADdCgAgBwAAnAwAIAkAAKMMACANAACHCwAgEwAA2QsAIBoAAJULACAcAACJCwAgIgAA4QsAIIIGAACpDAAwgwYAAFUAEIQGAACpDAAwhQYBANgKACGJBgEA2QoAIYoGAQDZCgAhiwYBANkKACGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHaBgEA2AoAIekHAABVACDqBwAAVQAgHwcAAKELACAJAACwDAAgGQAAuQwAIBsAALEMACAdAAC6DAAgggYAALYMADCDBgAAVwAQhAYAALYMADCFBgEA2AoAIYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAhsQYBANgKACG9BgAAuAyOByLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACHmBgEA2AoAIfoGAQDYCgAh-wYBANkKACH8BgEA2QoAIf0GAQDZCgAh_gYBANkKACH_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_BwEA2AoAIRIHAAChCwAgCQAAsAwAIA0AAIcLACAPAADSCwAgggYAANUMADCDBgAAHgAQhAYAANUMADCFBgEA2AoAIYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAhtgYBANgKACHkBgEA2QoAIe4GAQDZCgAh7wZAAIQMACHwBggAoAwAIfEGCACgDAAhHAgAANcMACAMAACFCwAgDQAAhwsAIBEAANYLACAcAACJCwAgJQAAhgsAICcAAIgLACAqAADeCwAgLgAAzwsAIC8AANALACAwAADSCwAgMQAA1AsAIDIAANULACA0AACYCwAgNQAA2AsAIDYAANkLACA3AADaCwAgOAAA4QsAIIIGAADWDAAwgwYAABkAEIQGAADWDAAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACH1BgEA2QoAIakHAQDZCgAhvAcBANgKACEOBwAAnAwAIDkAANkMACCCBgAA2AwAMIMGAAAUABCEBgAA2AwAMIUGAQDYCgAhigYBANkKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACGpBwEA2QoAIbwHAQDYCgAh6QcAABQAIOoHAAAUACAMBwAAnAwAIDkAANkMACCCBgAA2AwAMIMGAAAUABCEBgAA2AwAMIUGAQDYCgAhigYBANkKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACGpBwEA2QoAIbwHAQDYCgAhA-EGAAAZACDiBgAAGQAg4wYAABkAIBYDAADdCgAgBwAAnAwAIAkAALAMACANAACHCwAgEQAA1gsAICIAAOELACAkAADYCwAgSwAAmAsAIEwAANoLACCCBgAA2gwAMIMGAAAOABCEBgAA2gwAMIUGAQDYCgAhhgYBANgKACGHBgEA2AoAIYgGAQDYCgAhiQYBANkKACGKBgEA2QoAIYsGAQDYCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAhCwMAAN0KACAHAAChCwAgggYAANsMADCDBgAACwAQhAYAANsMADCFBgEA2AoAIYoGAQDYCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAhlQcAANwM4QciBI8GAAAA4QcCkAYAAADhBwiRBgAAAOEHCJYGAAD_C-EHIhEDAADdCgAgggYAAN0MADCDBgAABwAQhAYAAN0MADCFBgEA2AoAIYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIckHAQDYCgAhygcBANgKACHLBwEA2QoAIcwHAQDZCgAhzQcBANkKACHOB0AAhAwAIc8HQACEDAAh0AcBANkKACHRBwEA2QoAIQwDAADdCgAgggYAAN4MADCDBgAAAwAQhAYAAN4MADCFBgEA2AoAIYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIcYHQADcCgAh0gcBANgKACHTBwEA2QoAIdQHAQDZCgAhAAAAAAHuBwEAAAABAe4HAQAAAAEB7gdAAAAAAQdmAADZHAAgZwAAnx4AIOsHAADaHAAg7AcAAJ4eACDvBwAAEgAg8AcAABIAIPEHAACABQAgC2YAAO8NADBnAAD0DQAw6wcAAPANADDsBwAA8Q0AMO0HAADyDQAg7gcAAPMNADDvBwAA8w0AMPAHAADzDQAw8QcAAPMNADDyBwAA9Q0AMPMHAAD2DQAwC2YAANsNADBnAADgDQAw6wcAANwNADDsBwAA3Q0AMO0HAADeDQAg7gcAAN8NADDvBwAA3w0AMPAHAADfDQAw8QcAAN8NADDyBwAA4Q0AMPMHAADiDQAwC2YAALQNADBnAAC5DQAw6wcAALUNADDsBwAAtg0AMO0HAAC3DQAg7gcAALgNADDvBwAAuA0AMPAHAAC4DQAw8QcAALgNADDyBwAAug0AMPMHAAC7DQAwC2YAAJ0NADBnAACiDQAw6wcAAJ4NADDsBwAAnw0AMO0HAACgDQAg7gcAAKENADDvBwAAoQ0AMPAHAAChDQAw8QcAAKENADDyBwAAow0AMPMHAACkDQAwC2YAAIoNADBnAACPDQAw6wcAAIsNADDsBwAAjA0AMO0HAACNDQAg7gcAAI4NADDvBwAAjg0AMPAHAACODQAw8QcAAI4NADDyBwAAkA0AMPMHAACRDQAwC2YAAO8MADBnAAD0DAAw6wcAAPAMADDsBwAA8QwAMO0HAADyDAAg7gcAAPMMADDvBwAA8wwAMPAHAADzDAAw8QcAAPMMADDyBwAA9QwAMPMHAAD2DAAwBWYAANccACBnAACcHgAg6wcAANgcACDsBwAAmx4AIPEHAAAbACAFZgAA1RwAIGcAAJkeACDrBwAA1hwAIOwHAACYHgAg8QcAAP0CACAVGAAAhw0AIBkAAIgNACAeAACEDQAgHwAAhQ0AICAAAIYNACAhAACJDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAmwcCvwZAAAAAAcIGAQAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAECAAAAXwAgZgAAgw0AIAMAAABfACBmAACDDQAgZwAA_AwAIAFfAACXHgAwGhAAAKgMACAYAACFDAAgGQAAtQwAIB4AAKELACAfAAChCwAgIAAA3QoAICEAAKMMACCCBgAAsgwAMIMGAABdABCEBgAAsgwAMIUGAQAAAAGNBkAA3AoAIY4GQADcCgAhrwYBANkKACGxBgEA2QoAIb0GAAC0DJsHIr8GQACEDAAhwgYBANkKACGZBwAAswyZByKbBwEA2AoAIZwHAQDYCgAhnQcBANgKACGeBwEA2QoAIZ8HAQDZCgAhoAcBANkKACGhB0AA3AoAIQIAAABfACBfAAD8DAAgAgAAAPcMACBfAAD4DAAgE4IGAAD2DAAwgwYAAPcMABCEBgAA9gwAMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIa8GAQDZCgAhsQYBANkKACG9BgAAtAybByK_BkAAhAwAIcIGAQDZCgAhmQcAALMMmQcimwcBANgKACGcBwEA2AoAIZ0HAQDYCgAhngcBANkKACGfBwEA2QoAIaAHAQDZCgAhoQdAANwKACETggYAAPYMADCDBgAA9wwAEIQGAAD2DAAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAhrwYBANkKACGxBgEA2QoAIb0GAAC0DJsHIr8GQACEDAAhwgYBANkKACGZBwAAswyZByKbBwEA2AoAIZwHAQDYCgAhnQcBANgKACGeBwEA2QoAIZ8HAQDZCgAhoAcBANkKACGhB0AA3AoAIQ-FBgEA4wwAIY0GQADlDAAhjgZAAOUMACGxBgEA5AwAIb0GAAD6DJsHIr8GQAD7DAAhwgYBAOQMACGZBwAA-QyZByKbBwEA4wwAIZwHAQDjDAAhnQcBAOMMACGeBwEA5AwAIZ8HAQDkDAAhoAcBAOQMACGhB0AA5QwAIQHuBwAAAJkHAgHuBwAAAJsHAgHuB0AAAAABFRgAAIANACAZAACBDQAgHgAA_QwAIB8AAP4MACAgAAD_DAAgIQAAgg0AIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbEGAQDkDAAhvQYAAPoMmwcivwZAAPsMACHCBgEA5AwAIZkHAAD5DJkHIpsHAQDjDAAhnAcBAOMMACGdBwEA4wwAIZ4HAQDkDAAhnwcBAOQMACGgBwEA5AwAIaEHQADlDAAhBWYAAIMeACBnAACVHgAg6wcAAIQeACDsBwAAlB4AIPEHAACABQAgBWYAAIEeACBnAACSHgAg6wcAAIIeACDsBwAAkR4AIPEHAACABQAgBWYAAP8dACBnAACPHgAg6wcAAIAeACDsBwAAjh4AIPEHAAD9AgAgB2YAAP0dACBnAACMHgAg6wcAAP4dACDsBwAAix4AIO8HAABTACDwBwAAUwAg8QcAAP0CACAHZgAA-x0AIGcAAIkeACDrBwAA_B0AIOwHAACIHgAg7wcAAFUAIPAHAABVACDxBwAAnwEAIAdmAAD5HQAgZwAAhh4AIOsHAAD6HQAg7AcAAIUeACDvBwAAGQAg8AcAABkAIPEHAAAbACAVGAAAhw0AIBkAAIgNACAeAACEDQAgHwAAhQ0AICAAAIYNACAhAACJDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAmwcCvwZAAAAAAcIGAQAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAEDZgAAgx4AIOsHAACEHgAg8QcAAIAFACADZgAAgR4AIOsHAACCHgAg8QcAAIAFACADZgAA_x0AIOsHAACAHgAg8QcAAP0CACADZgAA_R0AIOsHAAD-HQAg8QcAAP0CACADZgAA-x0AIOsHAAD8HQAg8QcAAJ8BACADZgAA-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_w0AIA8AAP0NACAZAAD-DQAgGwAAgg4AICwAAPsNACAtAAD8DQAghQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIa0GAQDjDAAhrgYBAOMMACGxBgEA4wwAIeYGAQDjDAAh9gYBAOQMACG9B0AA5QwAIQtmAACYDgAwZwAAnQ4AMOsHAACZDgAw7AcAAJoOADDtBwAAmw4AIO4HAACcDgAw7wcAAJwOADDwBwAAnA4AMPEHAACcDgAw8gcAAJ4OADDzBwAAnw4AMAtmAACLDgAwZwAAkA4AMOsHAACMDgAw7AcAAI0OADDtBwAAjg4AIO4HAACPDgAw7wcAAI8OADDwBwAAjw4AMPEHAACPDgAw8gcAAJEOADDzBwAAkg4AMAdmAACEDgAgZwAAhw4AIOsHAACFDgAg7AcAAIYOACDvBwAAiwEAIPAHAACLAQAg8QcAAK8BACAFZgAA5xwAIGcAAJcdACDrBwAA6BwAIOwHAACWHQAg8QcAACQAIAVmAADlHAAgZwAAlB0AIOsHAADmHAAg7AcAAJMdACDxBwAAnwEAIAVmAADjHAAgZwAAkR0AIOsHAADkHAAg7AcAAJAdACDxBwAAOAAgB2YAAOEcACBnAACOHQAg6wcAAOIcACDsBwAAjR0AIO8HAAAZACDwBwAAGQAg8QcAABsAIAdmAADfHAAgZwAAix0AIOsHAADgHAAg7AcAAIodACDvBwAAHgAg8AcAAB4AIPEHAAAgACAFZgAA3RwAIGcAAIgdACDrBwAA3hwAIOwHAACHHQAg8QcAAJwIACAFZgAA2xwAIGcAAIUdACDrBwAA3BwAIOwHAACEHQAg8QcAAIAFACAWBwAAmw0AIAkAAJwNACAQAACKDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABxAYIAAAAAcUGCAAAAAHGBggAAAABxwYIAAAAAcgGCAAAAAHJBggAAAABygYIAAAAAcsGCAAAAAHMBggAAAABzQYIAAAAAc4GCAAAAAHPBggAAAAB0AYIAAAAAQIAAACvAQAgZgAAhA4AIAMAAACLAQAgZgAAhA4AIGcAAIgOACAYAAAAiwEAIAcAAJcNACAJAACYDQAgEAAAiQ4AIF8AAIgOACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrwYBAOMMACHEBggAlA0AIcUGCACUDQAhxgYIAJQNACHHBggAlA0AIcgGCACUDQAhyQYIAJQNACHKBggAlA0AIcsGCACUDQAhzAYIAJQNACHNBggAlA0AIc4GCACUDQAhzwYIAJQNACHQBggAlA0AIRYHAACXDQAgCQAAmA0AIBAAAIkOACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrwYBAOMMACHEBggAlA0AIcUGCACUDQAhxgYIAJQNACHHBggAlA0AIcgGCACUDQAhyQYIAJQNACHKBggAlA0AIcsGCACUDQAhzAYIAJQNACHNBggAlA0AIc4GCACUDQAhzwYIAJQNACHQBggAlA0AIQVmAAD_HAAgZwAAgh0AIOsHAACAHQAg7AcAAIEdACDxBwAAEAAgA2YAAP8cACDrBwAAgB0AIPEHAAAQACAFhQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADgBwLeB0AAAAABAgAAAIkBACBmAACXDgAgAwAAAIkBACBmAACXDgAgZwAAlg4AIAFfAAD-HAAwCykAAKEMACCCBgAArAwAMIMGAACHAQAQhAYAAKwMADCFBgEAAAABjQZAANwKACGOBkAA3AoAIb0GAACtDOAHIsMGAQDYCgAh3gdAANwKACHkBwAAqwwAIAIAAACJAQAgXwAAlg4AIAIAAACTDgAgXwAAlA4AIAmCBgAAkg4AMIMGAACTDgAQhAYAAJIOADCFBgEA2AoAIY0GQADcCgAhjgZAANwKACG9BgAArQzgByLDBgEA2AoAId4HQADcCgAhCYIGAACSDgAwgwYAAJMOABCEBgAAkg4AMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIb0GAACtDOAHIsMGAQDYCgAh3gdAANwKACEFhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhvQYAAJUO4Aci3gdAAOUMACEB7gcAAADgBwIFhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhvQYAAJUO4Aci3gdAAOUMACEFhQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADgBwLeB0AAAAABDgcAAKoOACAJAACrDgAgKAAAqA4AICsAAKkOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAABAgAAAC0AIGYAAKcOACADAAAALQAgZgAApw4AIGcAAKIOACABXwAA_RwAMBMHAACcDAAgCQAAowwAICgAAM4MACApAAChDAAgKwAAzwwAIIIGAADNDAAwgwYAACsAEIQGAADNDAAwhQYBAAAAAYoGAQDZCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAhwwYBANgKACHeBgEA2AoAIeQGAQDZCgAh6wYBANkKACHsBgEA2AoAIe0GAQDYCgAhAgAAAC0AIF8AAKIOACACAAAAoA4AIF8AAKEOACAOggYAAJ8OADCDBgAAoA4AEIQGAACfDgAwhQYBANgKACGKBgEA2QoAIYsGAQDZCgAhjQZAANwKACGOBkAA3AoAIcMGAQDYCgAh3gYBANgKACHkBgEA2QoAIesGAQDZCgAh7AYBANgKACHtBgEA2AoAIQ6CBgAAnw4AMIMGAACgDgAQhAYAAJ8OADCFBgEA2AoAIYoGAQDZCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAhwwYBANgKACHeBgEA2AoAIeQGAQDZCgAh6wYBANkKACHsBgEA2AoAIe0GAQDYCgAhCoUGAQDjDAAhigYBAOQMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACHeBgEA4wwAIeQGAQDkDAAh6wYBAOQMACHsBgEA4wwAIe0GAQDjDAAhDgcAAKUOACAJAACmDgAgKAAAow4AICsAAKQOACCFBgEA4wwAIYoGAQDkDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACHkBgEA5AwAIesGAQDkDAAh7AYBAOMMACHtBgEA4wwAIQVmAADvHAAgZwAA-xwAIOsHAADwHAAg7AcAAPocACDxBwAANAAgBWYAAO0cACBnAAD4HAAg6wcAAO4cACDsBwAA9xwAIPEHAADMAQAgB2YAAOscACBnAAD1HAAg6wcAAOwcACDsBwAA9BwAIO8HAAASACDwBwAAEgAg8QcAAIAFACAHZgAA6RwAIGcAAPIcACDrBwAA6hwAIOwHAADxHAAg7wcAABkAIPAHAAAZACDxBwAAGwAgDgcAAKoOACAJAACrDgAgKAAAqA4AICsAAKkOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAABA2YAAO8cACDrBwAA8BwAIPEHAAA0ACADZgAA7RwAIOsHAADuHAAg8QcAAMwBACADZgAA6xwAIOsHAADsHAAg8QcAAIAFACADZgAA6RwAIOsHAADqHAAg8QcAABsAIBUHAAC2DgAgCQAAsw4AIAoAALQOACALAACtDgAgDgAAsg4AIA8AALAOACAZAACxDgAgGwAAtQ4AICwAAK4OACAtAACvDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAEEZgAAmA4AMOsHAACZDgAw7QcAAJsOACDxBwAAnA4AMARmAACLDgAw6wcAAIwOADDtBwAAjg4AIPEHAACPDgAwA2YAAIQOACDrBwAAhQ4AIPEHAACvAQAgA2YAAOccACDrBwAA6BwAIPEHAAAkACADZgAA5RwAIOsHAADmHAAg8QcAAJ8BACADZgAA4xwAIOsHAADkHAAg8QcAADgAIANmAADhHAAg6wcAAOIcACDxBwAAGwAgA2YAAN8cACDrBwAA4BwAIPEHAAAgACADZgAA3RwAIOsHAADeHAAg8QcAAJwIACADZgAA2xwAIOsHAADcHAAg8QcAAIAFACADZgAA2RwAIOsHAADaHAAg8QcAAIAFACAEZgAA7w0AMOsHAADwDQAw7QcAAPINACDxBwAA8w0AMARmAADbDQAw6wcAANwNADDtBwAA3g0AIPEHAADfDQAwBGYAALQNADDrBwAAtQ0AMO0HAAC3DQAg8QcAALgNADAEZgAAnQ0AMOsHAACeDQAw7QcAAKANACDxBwAAoQ0AMARmAACKDQAw6wcAAIsNADDtBwAAjQ0AIPEHAACODQAwBGYAAO8MADDrBwAA8AwAMO0HAADyDAAg8QcAAPMMADADZgAA1xwAIOsHAADYHAAg8QcAABsAIANmAADVHAAg6wcAANYcACDxBwAA_QIAIAAAAALuBwEAAAAE-AcBAAAABQLuBwEAAAAE-AcBAAAABQHuByAAAAABBWYAANAcACBnAADTHAAg6wcAANEcACDsBwAA0hwAIPEHAAD9AgAgAe4HAQAAAAQB7gcBAAAABANmAADQHAAg6wcAANEcACDxBwAA_QIAIBsEAACjGQAgBQAApBkAIAYAAIQXACAQAACFFwAgGQAAhhcAIDQAANcRACBAAACIFwAgTQAAiBcAIE4AANcRACBPAAClGQAgUAAAxhEAIFEAAMYRACBSAACmGQAgUwAApxkAIFQAAJIXACBVAACSFwAgVgAAkRcAIFcAAJEXACBYAACQFwAgWQAAqBkAIIkGAADfDAAg1wcAAN8MACDYBwAA3wwAINkHAADfDAAg2gcAAN8MACDbBwAA3wwAINwHAADfDAAgAAAABWYAAMscACBnAADOHAAg6wcAAMwcACDsBwAAzRwAIPEHAAAQACADZgAAyxwAIOsHAADMHAAg8QcAABAAIAAAAAVmAADGHAAgZwAAyRwAIOsHAADHHAAg7AcAAMgcACDxBwAAQgAgA2YAAMYcACDrBwAAxxwAIPEHAABCACAAAAAFZgAAwRwAIGcAAMQcACDrBwAAwhwAIOwHAADDHAAg8QcAABAAIANmAADBHAAg6wcAAMIcACDxBwAAEAAgAAAAB2YAALwcACBnAAC_HAAg6wcAAL0cACDsBwAAvhwAIO8HAAAOACDwBwAADgAg8QcAABAAIANmAAC8HAAg6wcAAL0cACDxBwAAEAAgAAAAAAAAAAAAAAHuBwAAANMGAgHuBwAAANUGAgXuBxAAAAAB9AcQAAAAAfUHEAAAAAH2BxAAAAAB9wcQAAAAAQXuBwIAAAAB9AcCAAAAAfUHAgAAAAH2BwIAAAAB9wcCAAAAAQVmAAC0HAAgZwAAuhwAIOsHAAC1HAAg7AcAALkcACDxBwAAgAUAIAdmAACyHAAgZwAAtxwAIOsHAACzHAAg7AcAALYcACDvBwAA1QEAIPAHAADVAQAg8QcAANcBACADZgAAtBwAIOsHAAC1HAAg8QcAAIAFACADZgAAshwAIOsHAACzHAAg8QcAANcBACAAAAAHZgAA9RsAIGcAALAcACDrBwAA9hsAIOwHAACvHAAg7wcAABIAIPAHAAASACDxBwAAgAUAIAdmAADzGwAgZwAArRwAIOsHAAD0GwAg7AcAAKwcACDvBwAAGQAg8AcAABkAIPEHAAAbACAFZgAA8RsAIGcAAKocACDrBwAA8hsAIOwHAACpHAAg8QcAAP0CACALZgAAuQ8AMGcAAL0PADDrBwAAug8AMOwHAAC7DwAw7QcAALwPACDuBwAA8w0AMO8HAADzDQAw8AcAAPMNADDxBwAA8w0AMPIHAAC-DwAw8wcAAPYNADALZgAAsA8AMGcAALQPADDrBwAAsQ8AMOwHAACyDwAw7QcAALMPACDuBwAAyA0AMO8HAADIDQAw8AcAAMgNADDxBwAAyA0AMPIHAAC1DwAw8wcAAMsNADALZgAAnQ8AMGcAAKIPADDrBwAAng8AMOwHAACfDwAw7QcAAKAPACDuBwAAoQ8AMO8HAAChDwAw8AcAAKEPADDxBwAAoQ8AMPIHAACjDwAw8wcAAKQPADALZgAAhw8AMGcAAIwPADDrBwAAiA8AMOwHAACJDwAw7QcAAIoPACDuBwAAiw8AMO8HAACLDwAw8AcAAIsPADDxBwAAiw8AMPIHAACNDwAw8wcAAI4PADALZgAA_A4AMGcAAIAPADDrBwAA_Q4AMOwHAAD-DgAw7QcAAP8OACDuBwAA8wwAMO8HAADzDAAw8AcAAPMMADDxBwAA8wwAMPIHAACBDwAw8wcAAPYMADAVEAAAhg8AIBgAAIcNACAeAACEDQAgHwAAhQ0AICAAAIYNACAhAACJDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAb0GAAAAmwcCvwZAAAAAAcIGAQAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAECAAAAXwAgZgAAhQ8AIAMAAABfACBmAACFDwAgZwAAgw8AIAFfAACoHAAwAgAAAF8AIF8AAIMPACACAAAA9wwAIF8AAIIPACAPhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhrwYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcimwcBAOMMACGcBwEA4wwAIZ0HAQDjDAAhngcBAOQMACGfBwEA5AwAIaAHAQDkDAAhoQdAAOUMACEVEAAAhA8AIBgAAIANACAeAAD9DAAgHwAA_gwAICAAAP8MACAhAACCDQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhrwYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcimwcBAOMMACGcBwEA4wwAIZ0HAQDjDAAhngcBAOQMACGfBwEA5AwAIaAHAQDkDAAhoQdAAOUMACEHZgAAoxwAIGcAAKYcACDrBwAApBwAIOwHAAClHAAg7wcAAA4AIPAHAAAOACDxBwAAEAAgFRAAAIYPACAYAACHDQAgHgAAhA0AIB8AAIUNACAgAACGDQAgIQAAiQ0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABA2YAAKMcACDrBwAApBwAIPEHAAAQACAaBwAAmQ8AIAkAAJoPACAbAACbDwAgHQAAnA8AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAAQIAAABZACBmAACYDwAgAwAAAFkAIGYAAJgPACBnAACTDwAgAV8AAKIcADAfBwAAoQsAIAkAALAMACAZAAC5DAAgGwAAsQwAIB0AALoMACCCBgAAtgwAMIMGAABXABCEBgAAtgwAMIUGAQAAAAGKBgEA2AoAIYsGAQDYCgAhjQZAANwKACGOBkAA3AoAIbEGAQDYCgAhvQYAALgMjgci1QYQAJAMACHWBgEA2AoAIdcGAgCRDAAh5gYBANgKACH6BgEAAAAB-wYBANkKACH8BgEAAAAB_QYBANkKACH-BgEA2QoAIf8GAQDZCgAhgAcAAJMMACCBB0AAhAwAIYoHAQDYCgAhjAcAALcMjAcijgcBANgKACGPB0AA3AoAIQIAAABZACBfAACTDwAgAgAAAI8PACBfAACQDwAgGoIGAACODwAwgwYAAI8PABCEBgAAjg8AMIUGAQDYCgAhigYBANgKACGLBgEA2AoAIY0GQADcCgAhjgZAANwKACGxBgEA2AoAIb0GAAC4DI4HItUGEACQDAAh1gYBANgKACHXBgIAkQwAIeYGAQDYCgAh-gYBANgKACH7BgEA2QoAIfwGAQDZCgAh_QYBANkKACH-BgEA2QoAIf8GAQDZCgAhgAcAAJMMACCBB0AAhAwAIYoHAQDYCgAhjAcAALcMjAcijgcBANgKACGPB0AA3AoAIRqCBgAAjg8AMIMGAACPDwAQhAYAAI4PADCFBgEA2AoAIYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAhsQYBANgKACG9BgAAuAyOByLVBhAAkAwAIdYGAQDYCgAh1wYCAJEMACHmBgEA2AoAIfoGAQDYCgAh-wYBANkKACH8BgEA2QoAIf0GAQDZCgAh_gYBANkKACH_BgEA2QoAIYAHAACTDAAggQdAAIQMACGKBwEA2AoAIYwHAAC3DIwHIo4HAQDYCgAhjwdAANwKACEWhQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIb0GAACSD44HItUGEADrDgAh1gYBAOMMACHXBgIA7A4AIeYGAQDjDAAh-gYBAOMMACH7BgEA5AwAIfwGAQDkDAAh_QYBAOQMACH-BgEA5AwAIf8GAQDkDAAhgAeAAAAAAYEHQAD7DAAhigcBAOMMACGMBwAAkQ-MByKOBwEA4wwAIY8HQADlDAAhAe4HAAAAjAcCAe4HAAAAjgcCGgcAAJQPACAJAACVDwAgGwAAlg8AIB0AAJcPACCFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAhvQYAAJIPjgci1QYQAOsOACHWBgEA4wwAIdcGAgDsDgAh5gYBAOMMACH6BgEA4wwAIfsGAQDkDAAh_AYBAOQMACH9BgEA5AwAIf4GAQDkDAAh_wYBAOQMACGAB4AAAAABgQdAAPsMACGKBwEA4wwAIYwHAACRD4wHIo4HAQDjDAAhjwdAAOUMACEFZgAAlBwAIGcAAKAcACDrBwAAlRwAIOwHAACfHAAg8QcAAIAFACAFZgAAkhwAIGcAAJ0cACDrBwAAkxwAIOwHAACcHAAg8QcAABsAIAVmAACQHAAgZwAAmhwAIOsHAACRHAAg7AcAAJkcACDxBwAAnAgAIAVmAACOHAAgZwAAlxwAIOsHAACPHAAg7AcAAJYcACDxBwAAeAAgGgcAAJkPACAJAACaDwAgGwAAmw8AIB0AAJwPACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEDZgAAlBwAIOsHAACVHAAg8QcAAIAFACADZgAAkhwAIOsHAACTHAAg8QcAABsAIANmAACQHAAg6wcAAJEcACDxBwAAnAgAIANmAACOHAAg6wcAAI8cACDxBwAAeAAgDhYAAK0PACAXAACuDwAgGAAArw8AIIUGAQAAAAGNBkAAAAABjgZAAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAAB3AYBAAAAAQIAAABPACBmAACsDwAgAwAAAE8AIGYAAKwPACBnAACoDwAgAV8AAI0cADAUFgAAvgwAIBcAAN0KACAYAACFDAAgGQAAtQwAIIIGAAC8DAAwgwYAAE0AEIQGAAC8DAAwhQYBAAAAAY0GQADcCgAhjgZAANwKACGxBgEA2QoAIbsGAQDZCgAhvQYAAL0M3AYivgYBANkKACG_BkAAhAwAIcAGQADcCgAhwQYBANgKACHCBgEA2QoAIdwGAQDYCgAh5gcAALsMACACAAAATwAgXwAAqA8AIAIAAAClDwAgXwAApg8AIA-CBgAApA8AMIMGAAClDwAQhAYAAKQPADCFBgEA2AoAIY0GQADcCgAhjgZAANwKACGxBgEA2QoAIbsGAQDZCgAhvQYAAL0M3AYivgYBANkKACG_BkAAhAwAIcAGQADcCgAhwQYBANgKACHCBgEA2QoAIdwGAQDYCgAhD4IGAACkDwAwgwYAAKUPABCEBgAApA8AMIUGAQDYCgAhjQZAANwKACGOBkAA3AoAIbEGAQDZCgAhuwYBANkKACG9BgAAvQzcBiK-BgEA2QoAIb8GQACEDAAhwAZAANwKACHBBgEA2AoAIcIGAQDZCgAh3AYBANgKACELhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuwYBAOQMACG9BgAApw_cBiK-BgEA5AwAIb8GQAD7DAAhwAZAAOUMACHBBgEA4wwAIcIGAQDkDAAh3AYBAOMMACEB7gcAAADcBgIOFgAAqQ8AIBcAAKoPACAYAACrDwAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuwYBAOQMACG9BgAApw_cBiK-BgEA5AwAIb8GQAD7DAAhwAZAAOUMACHBBgEA4wwAIcIGAQDkDAAh3AYBAOMMACEFZgAAghwAIGcAAIscACDrBwAAgxwAIOwHAACKHAAg8QcAAJ0HACAFZgAAgBwAIGcAAIgcACDrBwAAgRwAIOwHAACHHAAg8QcAAP0CACAHZgAA_hsAIGcAAIUcACDrBwAA_xsAIOwHAACEHAAg7wcAAFMAIPAHAABTACDxBwAA_QIAIA4WAACtDwAgFwAArg8AIBgAAK8PACCFBgEAAAABjQZAAAAAAY4GQAAAAAG7BgEAAAABvQYAAADcBgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABwgYBAAAAAdwGAQAAAAEDZgAAghwAIOsHAACDHAAg8QcAAJ0HACADZgAAgBwAIOsHAACBHAAg8QcAAP0CACADZgAA_hsAIOsHAAD_GwAg8QcAAP0CACANBwAA1A0AIAkAANUNACASAADUDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGwBgEAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQZAAAAAAQIAAABHACBmAAC4DwAgAwAAAEcAIGYAALgPACBnAAC3DwAgAV8AAP0bADACAAAARwAgXwAAtw8AIAIAAADMDQAgXwAAtg8AIAqFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhsAYBAOMMACGyBgEA5AwAIbMGAQDkDAAhtAYBAOQMACG1BkAA5QwAIQ0HAADQDQAgCQAA0Q0AIBIAANMOACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhsAYBAOMMACGyBgEA5AwAIbMGAQDkDAAhtAYBAOQMACG1BkAA5QwAIQ0HAADUDQAgCQAA1Q0AIBIAANQOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbAGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BkAAAAABFQcAALYOACAJAACzDgAgCgAAtA4AIAsAAK0OACAOAACyDgAgDwAAsA4AIBAAAMMPACAbAAC1DgAgLAAArg4AIC0AAK8OACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABrwYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQIAAAApACBmAADCDwAgAwAAACkAIGYAAMIPACBnAADADwAgAV8AAPwbADACAAAAKQAgXwAAwA8AIAIAAAD3DQAgXwAAvw8AIAuFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrQYBAOMMACGuBgEA4wwAIa8GAQDjDAAh5gYBAOMMACH2BgEA5AwAIb0HQADlDAAhFQcAAIMOACAJAACADgAgCgAAgQ4AIAsAAPoNACAOAAD_DQAgDwAA_Q0AIBAAAMEPACAbAACCDgAgLAAA-w0AIC0AAPwNACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrQYBAOMMACGuBgEA4wwAIa8GAQDjDAAh5gYBAOMMACH2BgEA5AwAIb0HQADlDAAhBWYAAPcbACBnAAD6GwAg6wcAAPgbACDsBwAA-RsAIPEHAAAQACAVBwAAtg4AIAkAALMOACAKAAC0DgAgCwAArQ4AIA4AALIOACAPAACwDgAgEAAAww8AIBsAALUOACAsAACuDgAgLQAArw4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAAB5gYBAAAAAfYGAQAAAAG9B0AAAAABA2YAAPcbACDrBwAA-BsAIPEHAAAQACADZgAA9RsAIOsHAAD2GwAg8QcAAIAFACADZgAA8xsAIOsHAAD0GwAg8QcAABsAIANmAADxGwAg6wcAAPIbACDxBwAA_QIAIARmAAC5DwAw6wcAALoPADDtBwAAvA8AIPEHAADzDQAwBGYAALAPADDrBwAAsQ8AMO0HAACzDwAg8QcAAMgNADAEZgAAnQ8AMOsHAACeDwAw7QcAAKAPACDxBwAAoQ8AMARmAACHDwAw6wcAAIgPADDtBwAAig8AIPEHAACLDwAwBGYAAPwOADDrBwAA_Q4AMO0HAAD_DgAg8QcAAPMMADAAAAAHZgAA7BsAIGcAAO8bACDrBwAA7RsAIOwHAADuGwAg7wcAAFUAIPAHAABVACDxBwAAnwEAIANmAADsGwAg6wcAAO0bACDxBwAAnwEAIAAAAALuBwEAAAAE-AcBAAAABQVmAADnGwAgZwAA6hsAIOsHAADoGwAg7AcAAOkbACDxBwAA_QIAIAHuBwEAAAAEA2YAAOcbACDrBwAA6BsAIPEHAAD9AgAgAAAAC2YAAMMQADBnAADIEAAw6wcAAMQQADDsBwAAxRAAMO0HAADGEAAg7gcAAMcQADDvBwAAxxAAMPAHAADHEAAw8QcAAMcQADDyBwAAyRAAMPMHAADKEAAwC2YAAI8QADBnAACUEAAw6wcAAJAQADDsBwAAkRAAMO0HAACSEAAg7gcAAJMQADDvBwAAkxAAMPAHAACTEAAw8QcAAJMQADDyBwAAlRAAMPMHAACWEAAwC2YAAIYQADBnAACKEAAw6wcAAIcQADDsBwAAiBAAMO0HAACJEAAg7gcAAPMNADDvBwAA8w0AMPAHAADzDQAw8QcAAPMNADDyBwAAixAAMPMHAAD2DQAwC2YAAOsPADBnAADwDwAw6wcAAOwPADDsBwAA7Q8AMO0HAADuDwAg7gcAAO8PADDvBwAA7w8AMPAHAADvDwAw8QcAAO8PADDyBwAA8Q8AMPMHAADyDwAwC2YAAOAPADBnAADkDwAw6wcAAOEPADDsBwAA4g8AMO0HAADjDwAg7gcAAIsPADDvBwAAiw8AMPAHAACLDwAw8QcAAIsPADDyBwAA5Q8AMPMHAACODwAwGgcAAJkPACAJAACaDwAgGQAA6g8AIB0AAJwPACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG9BgAAAI4HAtUGEAAAAAHWBgEAAAAB1wYCAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAECAAAAWQAgZgAA6Q8AIAMAAABZACBmAADpDwAgZwAA5w8AIAFfAADmGwAwAgAAAFkAIF8AAOcPACACAAAAjw8AIF8AAOYPACAWhQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbEGAQDjDAAhvQYAAJIPjgci1QYQAOsOACHWBgEA4wwAIdcGAgDsDgAh-gYBAOMMACH7BgEA5AwAIfwGAQDkDAAh_QYBAOQMACH-BgEA5AwAIf8GAQDkDAAhgAeAAAAAAYEHQAD7DAAhigcBAOMMACGMBwAAkQ-MByKOBwEA4wwAIY8HQADlDAAhGgcAAJQPACAJAACVDwAgGQAA6A8AIB0AAJcPACCFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAhsQYBAOMMACG9BgAAkg-OByLVBhAA6w4AIdYGAQDjDAAh1wYCAOwOACH6BgEA4wwAIfsGAQDkDAAh_AYBAOQMACH9BgEA5AwAIf4GAQDkDAAh_wYBAOQMACGAB4AAAAABgQdAAPsMACGKBwEA4wwAIYwHAACRD4wHIo4HAQDjDAAhjwdAAOUMACEFZgAA4RsAIGcAAOQbACDrBwAA4hsAIOwHAADjGwAg8QcAAJ8BACAaBwAAmQ8AIAkAAJoPACAZAADqDwAgHQAAnA8AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAAQNmAADhGwAg6wcAAOIbACDxBwAAnwEAIAwHAACDEAAgCQAAhBAAIBwAAIUQACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdYGAQAAAAGIByAAAAABkAcQAAAAAZEHEAAAAAECAAAAeAAgZgAAghAAIAMAAAB4ACBmAACCEAAgZwAA9Q8AIAFfAADgGwAwEgcAAKELACAJAACwDAAgGwAAsQwAIBwAAIkLACCCBgAArwwAMIMGAAB2ABCEBgAArwwAMIUGAQAAAAGKBgEA2AoAIYsGAQDYCgAhjQZAANwKACGOBkAA3AoAIdYGAQDYCgAh5gYBANgKACGIByAA2woAIZAHEACQDAAhkQcQAJAMACHlBwAArgwAIAIAAAB4ACBfAAD1DwAgAgAAAPMPACBfAAD0DwAgDYIGAADyDwAwgwYAAPMPABCEBgAA8g8AMIUGAQDYCgAhigYBANgKACGLBgEA2AoAIY0GQADcCgAhjgZAANwKACHWBgEA2AoAIeYGAQDYCgAhiAcgANsKACGQBxAAkAwAIZEHEACQDAAhDYIGAADyDwAwgwYAAPMPABCEBgAA8g8AMIUGAQDYCgAhigYBANgKACGLBgEA2AoAIY0GQADcCgAhjgZAANwKACHWBgEA2AoAIeYGAQDYCgAhiAcgANsKACGQBxAAkAwAIZEHEACQDAAhCYUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACHWBgEA4wwAIYgHIADFDgAhkAcQAOsOACGRBxAA6w4AIQwHAAD2DwAgCQAA9w8AIBwAAPgPACCFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAh1gYBAOMMACGIByAAxQ4AIZAHEADrDgAhkQcQAOsOACEFZgAA1xsAIGcAAN4bACDrBwAA2BsAIOwHAADdGwAg8QcAAIAFACAFZgAA1RsAIGcAANsbACDrBwAA1hsAIOwHAADaGwAg8QcAABsAIAtmAAD5DwAwZwAA_Q8AMOsHAAD6DwAw7AcAAPsPADDtBwAA_A8AIO4HAACLDwAw7wcAAIsPADDwBwAAiw8AMPEHAACLDwAw8gcAAP4PADDzBwAAjg8AMBoHAACZDwAgCQAAmg8AIBkAAOoPACAbAACbDwAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGMBwAAAIwHAo4HAQAAAAGPB0AAAAABAgAAAFkAIGYAAIEQACADAAAAWQAgZgAAgRAAIGcAAIAQACABXwAA2RsAMAIAAABZACBfAACAEAAgAgAAAI8PACBfAAD_DwAgFoUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACGxBgEA4wwAIb0GAACSD44HItUGEADrDgAh1gYBAOMMACHXBgIA7A4AIeYGAQDjDAAh-gYBAOMMACH7BgEA5AwAIfwGAQDkDAAh_QYBAOQMACH-BgEA5AwAIf8GAQDkDAAhgAeAAAAAAYEHQAD7DAAhjAcAAJEPjAcijgcBAOMMACGPB0AA5QwAIRoHAACUDwAgCQAAlQ8AIBkAAOgPACAbAACWDwAghQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbEGAQDjDAAhvQYAAJIPjgci1QYQAOsOACHWBgEA4wwAIdcGAgDsDgAh5gYBAOMMACH6BgEA4wwAIfsGAQDkDAAh_AYBAOQMACH9BgEA5AwAIf4GAQDkDAAh_wYBAOQMACGAB4AAAAABgQdAAPsMACGMBwAAkQ-MByKOBwEA4wwAIY8HQADlDAAhGgcAAJkPACAJAACaDwAgGQAA6g8AIBsAAJsPACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG9BgAAAI4HAtUGEAAAAAHWBgEAAAAB1wYCAAAAAeYGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGAB4AAAAABgQdAAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEMBwAAgxAAIAkAAIQQACAcAACFEAAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHWBgEAAAABiAcgAAAAAZAHEAAAAAGRBxAAAAABA2YAANcbACDrBwAA2BsAIPEHAACABQAgA2YAANUbACDrBwAA1hsAIPEHAAAbACAEZgAA-Q8AMOsHAAD6DwAw7QcAAPwPACDxBwAAiw8AMBUHAAC2DgAgCQAAsw4AIAoAALQOACALAACtDgAgDgAAsg4AIA8AALAOACAQAADDDwAgGQAAsQ4AICwAAK4OACAtAACvDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB9gYBAAAAAb0HQAAAAAECAAAAKQAgZgAAjhAAIAMAAAApACBmAACOEAAgZwAAjRAAIAFfAADUGwAwAgAAACkAIF8AAI0QACACAAAA9w0AIF8AAIwQACALhQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIa0GAQDjDAAhrgYBAOMMACGvBgEA4wwAIbEGAQDjDAAh9gYBAOQMACG9B0AA5QwAIRUHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAADBDwAgGQAA_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_Q0AIBAAAMEPACAZAAD-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_w0AIA8AAP0NACAQAADBDwAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_A0AIIUGAQDjDAAhigYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACGtBgEA4wwAIa4GAQDjDAAhrwYBAOMMACGxBgEA4wwAIeYGAQDjDAAhvQdAAOUMACEVBwAAtg4AIAkAALMOACALAACtDgAgDgAAsg4AIA8AALAOACAQAADDDwAgGQAAsQ4AIBsAALUOACAsAACuDgAgLQAArw4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAG9B0AAAAABDQcAAK4RACAJAACvEQAgDQAAsBEAIBEAALERACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAABvgcBAAAAAb8HAQAAAAECAAAAJAAgZgAArREAIAMAAAAkACBmAACtEQAgZwAAlhEAIAFfAACeGwAwEgcAAKELACAJAACwDAAgCgAA0wwAIA0AAIcLACARAADWCwAgggYAANQMADCDBgAAIgAQhAYAANQMADCFBgEAAAABigYBANgKACGLBgEA2AoAIY0GQADcCgAhjgZAANwKACHkBgEA2QoAIfAGAgCaDAAh9gYBANkKACG-BwEAAAABvwcBANgKACECAAAAJAAgXwAAlhEAIAIAAACUEQAgXwAAlREAIA2CBgAAkxEAMIMGAACUEQAQhAYAAJMRADCFBgEA2AoAIYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACHwBgIAmgwAIfYGAQDZCgAhvgcBANgKACG_BwEA2AoAIQ2CBgAAkxEAMIMGAACUEQAQhAYAAJMRADCFBgEA2AoAIYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACHwBgIAmgwAIfYGAQDZCgAhvgcBANgKACG_BwEA2AoAIQmFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACHwBgIAmRAAIb4HAQDjDAAhvwcBAOMMACENBwAAlxEAIAkAAJgRACANAACZEQAgEQAAmhEAIIUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfAGAgCZEAAhvgcBAOMMACG_BwEA4wwAIQVmAACUGwAgZwAAnBsAIOsHAACVGwAg7AcAAJsbACDxBwAAgAUAIAVmAACSGwAgZwAAmRsAIOsHAACTGwAg7AcAAJgbACDxBwAAGwAgC2YAAKQRADBnAACoEQAw6wcAAKURADDsBwAAphEAMO0HAACnEQAg7gcAAPMNADDvBwAA8w0AMPAHAADzDQAw8QcAAPMNADDyBwAAqREAMPMHAAD2DQAwC2YAAJsRADBnAACfEQAw6wcAAJwRADDsBwAAnREAMO0HAACeEQAg7gcAAN8NADDvBwAA3w0AMPAHAADfDQAw8QcAAN8NADDyBwAAoBEAMPMHAADiDQAwCwcAAO0NACAJAADuDQAgDgAA6w0AIBAAAM8OACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGvBgEAAAABAgAAAD0AIGYAAKMRACADAAAAPQAgZgAAoxEAIGcAAKIRACABXwAAlxsAMAIAAAA9ACBfAACiEQAgAgAAAOMNACBfAAChEQAgB4UGAQDjDAAhigYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACGtBgEA4wwAIa8GAQDjDAAhCwcAAOgNACAJAADpDQAgDgAA5g0AIBAAAM4OACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrQYBAOMMACGvBgEA4wwAIQsHAADtDQAgCQAA7g0AIA4AAOsNACAQAADPDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrwYBAAAAARUHAAC2DgAgCQAAsw4AIAoAALQOACALAACtDgAgDgAAsg4AIBAAAMMPACAZAACxDgAgGwAAtQ4AICwAAK4OACAtAACvDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrwYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAECAAAAKQAgZgAArBEAIAMAAAApACBmAACsEQAgZwAAqxEAIAFfAACWGwAwAgAAACkAIF8AAKsRACACAAAA9w0AIF8AAKoRACALhQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIa0GAQDjDAAhrwYBAOMMACGxBgEA4wwAIeYGAQDjDAAh9gYBAOQMACG9B0AA5QwAIRUHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIBAAAMEPACAZAAD-DQAgGwAAgg4AICwAAPsNACAtAAD8DQAghQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIa0GAQDjDAAhrwYBAOMMACGxBgEA4wwAIeYGAQDjDAAh9gYBAOQMACG9B0AA5QwAIRUHAAC2DgAgCQAAsw4AIAoAALQOACALAACtDgAgDgAAsg4AIBAAAMMPACAZAACxDgAgGwAAtQ4AICwAAK4OACAtAACvDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrwYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAENBwAArhEAIAkAAK8RACANAACwEQAgEQAAsREAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfAGAgAAAAG-BwEAAAABvwcBAAAAAQNmAACUGwAg6wcAAJUbACDxBwAAgAUAIANmAACSGwAg6wcAAJMbACDxBwAAGwAgBGYAAKQRADDrBwAApREAMO0HAACnEQAg8QcAAPMNADAEZgAAmxEAMOsHAACcEQAw7QcAAJ4RACDxBwAA3w0AMARmAACMEQAw6wcAAI0RADDtBwAAjxEAIPEHAACQEQAwBGYAAIMRADDrBwAAhBEAMO0HAACGEQAg8QcAAPMNADADZgAAkBsAIOsHAACRGwAg8QcAAIAFACADZgAAjhsAIOsHAACPGwAg8QcAABsAIAAAAALuBwEAAAAE-AcBAAAABQtmAAC7EQAwZwAAvxEAMOsHAAC8EQAw7AcAAL0RADDtBwAAvhEAIO4HAAChDwAw7wcAAKEPADDwBwAAoQ8AMPEHAAChDwAw8gcAAMARADDzBwAApA8AMA4XAACuDwAgGAAArw8AIBkAANAPACCFBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABuwYBAAAAAb0GAAAA3AYCvgYBAAAAAb8GQAAAAAHABkAAAAABwgYBAAAAAdwGAQAAAAECAAAATwAgZgAAwxEAIAMAAABPACBmAADDEQAgZwAAwhEAIAFfAACNGwAwAgAAAE8AIF8AAMIRACACAAAApQ8AIF8AAMERACALhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhsQYBAOQMACG7BgEA5AwAIb0GAACnD9wGIr4GAQDkDAAhvwZAAPsMACHABkAA5QwAIcIGAQDkDAAh3AYBAOMMACEOFwAAqg8AIBgAAKsPACAZAADPDwAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhsQYBAOQMACG7BgEA5AwAIb0GAACnD9wGIr4GAQDkDAAhvwZAAPsMACHABkAA5QwAIcIGAQDkDAAh3AYBAOMMACEOFwAArg8AIBgAAK8PACAZAADQDwAghQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcIGAQAAAAHcBgEAAAABAe4HAQAAAAQEZgAAuxEAMOsHAAC8EQAw7QcAAL4RACDxBwAAoQ8AMAAAAAAC7gcBAAAABPgHAQAAAAULZgAAzBEAMGcAANARADDrBwAAzREAMOwHAADOEQAw7QcAAM8RACDuBwAAoQ0AMO8HAAChDQAw8AcAAKENADDxBwAAoQ0AMPIHAADREQAw8wcAAKQNADASBwAAsg0AIAkAALMNACAQAADeDgAgGAAAsQ0AIDMAALANACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwgYBAAAAAQIAAAClAQAgZgAA1BEAIAMAAAClAQAgZgAA1BEAIGcAANMRACABXwAAjBsAMAIAAAClAQAgXwAA0xEAIAIAAAClDQAgXwAA0hEAIA2FBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhmgYBAOMMACGvBgEA5AwAIbsGAQDkDAAhvQYAAKcNvQYivgYBAOQMACG_BkAA-wwAIcAGQADlDAAhwgYBAOQMACESBwAArA0AIAkAAK0NACAQAADdDgAgGAAAqw0AIDMAAKoNACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhmgYBAOMMACGvBgEA5AwAIbsGAQDkDAAhvQYAAKcNvQYivgYBAOQMACG_BkAA-wwAIcAGQADlDAAhwgYBAOQMACESBwAAsg0AIAkAALMNACAQAADeDgAgGAAAsQ0AIDMAALANACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwgYBAAAAAQHuBwEAAAAEBGYAAMwRADDrBwAAzREAMO0HAADPEQAg8QcAAKENADAAAAAAAAAB7gcAAAD6BgIFZgAAhxsAIGcAAIobACDrBwAAiBsAIOwHAACJGwAg8QcAAIAFACADZgAAhxsAIOsHAACIGwAg8QcAAIAFACAAAAAFZgAAghsAIGcAAIUbACDrBwAAgxsAIOwHAACEGwAg8QcAAIAFACADZgAAghsAIOsHAACDGwAg8QcAAIAFACAfBgAAhBcAIAwAAOYQACANAADoEAAgEQAAhxcAIBwAAOoQACAlAADnEAAgJwAA6RAAICoAAI8XACAuAACAFwAgLwAAgRcAIDAAAIMXACAxAACFFwAgMgAAhhcAIDQAANcRACA1AACJFwAgNgAAihcAIDcAAIsXACA6AAD_FgAgOwAAghcAID8AAI4XACBAAACIFwAgQQAAjBcAIEIAAI0XACBHAACQFwAgSAAAkRcAIEkAAJIXACBKAACSFwAguQYAAN8MACDkBgAA3wwAIKkHAADfDAAgrAcAAN8MACAAAAAAAAAAAAAABWYAAP0aACBnAACAGwAg6wcAAP4aACDsBwAA_xoAIPEHAACcCAAgA2YAAP0aACDrBwAA_hoAIPEHAACcCAAgAAAABWYAAPUaACBnAAD7GgAg6wcAAPYaACDsBwAA-hoAIPEHAADyAQAgBWYAAPMaACBnAAD4GgAg6wcAAPQaACDsBwAA9xoAIPEHAAD9AgAgA2YAAPUaACDrBwAA9hoAIPEHAADyAQAgA2YAAPMaACDrBwAA9BoAIPEHAAD9AgAgAAAAAe4HAAAAlQcCBWYAAO4aACBnAADxGgAg6wcAAO8aACDsBwAA8BoAIPEHAADyAQAgA2YAAO4aACDrBwAA7xoAIPEHAADyAQAgAAAABWYAAOQaACBnAADsGgAg6wcAAOUaACDsBwAA6xoAIPEHAACABQAgBWYAAOIaACBnAADpGgAg6wcAAOMaACDsBwAA6BoAIPEHAAD9AgAgC2YAAJISADBnAACXEgAw6wcAAJMSADDsBwAAlBIAMO0HAACVEgAg7gcAAJYSADDvBwAAlhIAMPAHAACWEgAw8QcAAJYSADDyBwAAmBIAMPMHAACZEgAwC2YAAIYSADBnAACLEgAw6wcAAIcSADDsBwAAiBIAMO0HAACJEgAg7gcAAIoSADDvBwAAihIAMPAHAACKEgAw8QcAAIoSADDyBwAAjBIAMPMHAACNEgAwBAMAAPgRACCFBgEAAAABjAYBAAAAAZMHQAAAAAECAAAA-gEAIGYAAJESACADAAAA-gEAIGYAAJESACBnAACQEgAgAV8AAOcaADAKAwAA3QoAIEQAAIgMACCCBgAAhwwAMIMGAAD4AQAQhAYAAIcMADCFBgEAAAABjAYBANgKACGSBwEA2AoAIZMHQADcCgAh4QcAAIYMACACAAAA-gEAIF8AAJASACACAAAAjhIAIF8AAI8SACAHggYAAI0SADCDBgAAjhIAEIQGAACNEgAwhQYBANgKACGMBgEA2AoAIZIHAQDYCgAhkwdAANwKACEHggYAAI0SADCDBgAAjhIAEIQGAACNEgAwhQYBANgKACGMBgEA2AoAIZIHAQDYCgAhkwdAANwKACEDhQYBAOMMACGMBgEA4wwAIZMHQADlDAAhBAMAAPYRACCFBgEA4wwAIYwGAQDjDAAhkwdAAOUMACEEAwAA-BEAIIUGAQAAAAGMBgEAAAABkwdAAAAAAQOFBgEAAAABjQZAAAAAAZUHAAAAlQcCAgAAAPYBACBmAACdEgAgAwAAAPYBACBmAACdEgAgZwAAnBIAIAFfAADmGgAwCUQAAIgMACCCBgAAigwAMIMGAAD0AQAQhAYAAIoMADCFBgEAAAABjQZAANwKACGSBwEA2AoAIZUHAACLDJUHIuIHAACJDAAgAgAAAPYBACBfAACcEgAgAgAAAJoSACBfAACbEgAgB4IGAACZEgAwgwYAAJoSABCEBgAAmRIAMIUGAQDYCgAhjQZAANwKACGSBwEA2AoAIZUHAACLDJUHIgeCBgAAmRIAMIMGAACaEgAQhAYAAJkSADCFBgEA2AoAIY0GQADcCgAhkgcBANgKACGVBwAAiwyVByIDhQYBAOMMACGNBkAA5QwAIZUHAAD8EZUHIgOFBgEA4wwAIY0GQADlDAAhlQcAAPwRlQciA4UGAQAAAAGNBkAAAAABlQcAAACVBwIDZgAA5BoAIOsHAADlGgAg8QcAAIAFACADZgAA4hoAIOsHAADjGgAg8QcAAP0CACAEZgAAkhIAMOsHAACTEgAw7QcAAJUSACDxBwAAlhIAMARmAACGEgAw6wcAAIcSADDtBwAAiRIAIPEHAACKEgAwAAAAAAAAAe4HAAAAowcCAe4HAAAApQcCBWYAANcaACBnAADgGgAg6wcAANgaACDsBwAA3xoAIPEHAAD9AgAgBWYAANUaACBnAADdGgAg6wcAANYaACDsBwAA3BoAIPEHAACABQAgB2YAANMaACBnAADaGgAg6wcAANQaACDsBwAA2RoAIO8HAABTACDwBwAAUwAg8QcAAP0CACADZgAA1xoAIOsHAADYGgAg8QcAAP0CACADZgAA1RoAIOsHAADWGgAg8QcAAIAFACADZgAA0xoAIOsHAADUGgAg8QcAAP0CACAAAAAAAAHuBwAAAKsHAwHuBwAAANMGAwXuBxAAAAAB9AcQAAAAAfUHEAAAAAH2BxAAAAAB9wcQAAAAAQHuBwAAALsHAgVmAADHGgAgZwAA0RoAIOsHAADIGgAg7AcAANAaACDxBwAA_QIAIAdmAADFGgAgZwAAzhoAIOsHAADGGgAg7AcAAM0aACDvBwAAUwAg8AcAAFMAIPEHAAD9AgAgB2YAAMMaACBnAADLGgAg6wcAAMQaACDsBwAAyhoAIO8HAAASACDwBwAAEgAg8QcAAIAFACALZgAAvRIAMGcAAMISADDrBwAAvhIAMOwHAAC_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-BMAMOwHAAD5EwAw7QcAAPoTACDuBwAA-xMAMO8HAAD7EwAw8AcAAPsTADDxBwAA-xMAMPIHAAD9EwAw8wcAAP4TADALZgAA7hMAMGcAAPITADDrBwAA7xMAMOwHAADwEwAw7QcAAPETACDuBwAAoQ0AMO8HAAChDQAw8AcAAKENADDxBwAAoQ0AMPIHAADzEwAw8wcAAKQNADALZgAA5RMAMGcAAOkTADDrBwAA5hMAMOwHAADnEwAw7QcAAOgTACDuBwAAuA0AMO8HAAC4DQAw8AcAALgNADDxBwAAuA0AMPIHAADqEwAw8wcAALsNADALZgAA3BMAMGcAAOATADDrBwAA3RMAMOwHAADeEwAw7QcAAN8TACDuBwAAyA0AMO8HAADIDQAw8AcAAMgNADDxBwAAyA0AMPIHAADhEwAw8wcAAMsNADALZgAA0xMAMGcAANcTADDrBwAA1BMAMOwHAADVEwAw7QcAANYTACDuBwAAjg0AMO8HAACODQAw8AcAAI4NADDxBwAAjg0AMPIHAADYEwAw8wcAAJENADALZgAAyhMAMGcAAM4TADDrBwAAyxMAMOwHAADMEwAw7QcAAM0TACDuBwAA7w8AMO8HAADvDwAw8AcAAO8PADDxBwAA7w8AMPIHAADPEwAw8wcAAPIPADALZgAAwRMAMGcAAMUTADDrBwAAwhMAMOwHAADDEwAw7QcAAMQTACDuBwAAiw8AMO8HAACLDwAw8AcAAIsPADDxBwAAiw8AMPIHAADGEwAw8wcAAI4PADAHZgAAvBMAIGcAAL8TACDrBwAAvRMAIOwHAAC-EwAg7wcAAOcBACDwBwAA5wEAIPEHAADWBgAgC2YAALATADBnAAC1EwAw6wcAALETADDsBwAAshMAMO0HAACzEwAg7gcAALQTADDvBwAAtBMAMPAHAAC0EwAw8QcAALQTADDyBwAAthMAMPMHAAC3EwAwC2YAAKcTADBnAACrEwAw6wcAAKgTADDsBwAAqRMAMO0HAACqEwAg7gcAAMESADDvBwAAwRIAMPAHAADBEgAw8QcAAMESADDyBwAArBMAMPMHAADEEgAwC2YAAJ4TADBnAACiEwAw6wcAAJ8TADDsBwAAoBMAMO0HAAChEwAg7gcAAMcQADDvBwAAxxAAMPAHAADHEAAw8QcAAMcQADDyBwAAoxMAMPMHAADKEAAwC2YAAJUTADBnAACZEwAw6wcAAJYTADDsBwAAlxMAMO0HAACYEwAg7gcAAJwOADDvBwAAnA4AMPAHAACcDgAw8QcAAJwOADDyBwAAmhMAMPMHAACfDgAwC2YAAIkTADBnAACOEwAw6wcAAIoTADDsBwAAixMAMO0HAACMEwAg7gcAAI0TADDvBwAAjRMAMPAHAACNEwAw8QcAAI0TADDyBwAAjxMAMPMHAACQEwAwC2YAAP0SADBnAACCEwAw6wcAAP4SADDsBwAA_xIAMO0HAACAEwAg7gcAAIETADDvBwAAgRMAMPAHAACBEwAw8QcAAIETADDyBwAAgxMAMPMHAACEEwAwC2YAAPQSADBnAAD4EgAw6wcAAPUSADDsBwAA9hIAMO0HAAD3EgAg7gcAAPMMADDvBwAA8wwAMPAHAADzDAAw8QcAAPMMADDyBwAA-RIAMPMHAAD2DAAwC2YAAOsSADBnAADvEgAw6wcAAOwSADDsBwAA7RIAMO0HAADuEgAg7gcAAPMMADDvBwAA8wwAMPAHAADzDAAw8QcAAPMMADDyBwAA8BIAMPMHAAD2DAAwFRAAAIYPACAYAACHDQAgGQAAiA0AIB4AAIQNACAgAACGDQAgIQAAiQ0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAgAAAF8AIGYAAPMSACADAAAAXwAgZgAA8xIAIGcAAPISACABXwAAwhoAMAIAAABfACBfAADyEgAgAgAAAPcMACBfAADxEgAgD4UGAQDjDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhsQYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcimwcBAOMMACGdBwEA4wwAIZ4HAQDkDAAhnwcBAOQMACGgBwEA5AwAIaEHQADlDAAhFRAAAIQPACAYAACADQAgGQAAgQ0AIB4AAP0MACAgAAD_DAAgIQAAgg0AIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhsQYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcimwcBAOMMACGdBwEA4wwAIZ4HAQDkDAAhnwcBAOQMACGgBwEA5AwAIaEHQADlDAAhFRAAAIYPACAYAACHDQAgGQAAiA0AIB4AAIQNACAgAACGDQAgIQAAiQ0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABFRAAAIYPACAYAACHDQAgGQAAiA0AIB8AAIUNACAgAACGDQAgIQAAiQ0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAgAAAF8AIGYAAPwSACADAAAAXwAgZgAA_BIAIGcAAPsSACABXwAAwRoAMAIAAABfACBfAAD7EgAgAgAAAPcMACBfAAD6EgAgD4UGAQDjDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhsQYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcinAcBAOMMACGdBwEA4wwAIZ4HAQDkDAAhnwcBAOQMACGgBwEA5AwAIaEHQADlDAAhFRAAAIQPACAYAACADQAgGQAAgQ0AIB8AAP4MACAgAAD_DAAgIQAAgg0AIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhsQYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcinAcBAOMMACGdBwEA4wwAIZ4HAQDkDAAhnwcBAOQMACGgBwEA5AwAIaEHQADlDAAhFRAAAIYPACAYAACHDQAgGQAAiA0AIB8AAIUNACAgAACGDQAgIQAAiQ0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABCyAAAK0SACA9AACvEgAghQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABnQcBAAAAAaMHAAAAowcCpQcBAAAAAaYHAQAAAAECAAAAgAIAIGYAAIgTACADAAAAgAIAIGYAAIgTACBnAACHEwAgAV8AAMAaADAQBwAAoQsAICAAAN0KACA9AACFDAAgggYAAIEMADCDBgAA_gEAEIQGAACBDAAwhQYBAAAAAYoGAQDYCgAhjQZAANwKACGOBkAA3AoAIb0GAACDDKUHIr8GQACEDAAhnQcBANgKACGjBwAAggyjByKlBwEA2QoAIaYHAQDZCgAhAgAAAIACACBfAACHEwAgAgAAAIUTACBfAACGEwAgDYIGAACEEwAwgwYAAIUTABCEBgAAhBMAMIUGAQDYCgAhigYBANgKACGNBkAA3AoAIY4GQADcCgAhvQYAAIMMpQcivwZAAIQMACGdBwEA2AoAIaMHAACCDKMHIqUHAQDZCgAhpgcBANkKACENggYAAIQTADCDBgAAhRMAEIQGAACEEwAwhQYBANgKACGKBgEA2AoAIY0GQADcCgAhjgZAANwKACG9BgAAgwylByK_BkAAhAwAIZ0HAQDYCgAhowcAAIIMowcipQcBANkKACGmBwEA2QoAIQmFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG9BgAAqRKlByK_BkAA-wwAIZ0HAQDjDAAhowcAAKgSowcipQcBAOQMACGmBwEA5AwAIQsgAACqEgAgPQAArBIAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIb0GAACpEqUHIr8GQAD7DAAhnQcBAOMMACGjBwAAqBKjByKlBwEA5AwAIaYHAQDkDAAhCyAAAK0SACA9AACvEgAghQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABnQcBAAAAAaMHAAAAowcCpQcBAAAAAaYHAQAAAAEKQwAAnxIAIEUAAKASACBGAAChEgAghQYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAbcGAQAAAAGWBwEAAAABlwcAAACVBwICAAAA8gEAIGYAAJQTACADAAAA8gEAIGYAAJQTACBnAACTEwAgAV8AAL8aADAPBwAAoQsAIEMAAN0KACBFAACNDAAgRgAA9wsAIIIGAACMDAAwgwYAAPABABCEBgAAjAwAMIUGAQAAAAGKBgEA2AoAIY0GQADcCgAhjgZAANwKACG2BgEA2AoAIbcGAQDYCgAhlgcBANgKACGXBwAAiwyVByICAAAA8gEAIF8AAJMTACACAAAAkRMAIF8AAJITACALggYAAJATADCDBgAAkRMAEIQGAACQEwAwhQYBANgKACGKBgEA2AoAIY0GQADcCgAhjgZAANwKACG2BgEA2AoAIbcGAQDYCgAhlgcBANgKACGXBwAAiwyVByILggYAAJATADCDBgAAkRMAEIQGAACQEwAwhQYBANgKACGKBgEA2AoAIY0GQADcCgAhjgZAANwKACG2BgEA2AoAIbcGAQDYCgAhlgcBANgKACGXBwAAiwyVByIHhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACG3BgEA4wwAIZYHAQDjDAAhlwcAAPwRlQciCkMAAIMSACBFAACEEgAgRgAAhRIAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbYGAQDjDAAhtwYBAOMMACGWBwEA4wwAIZcHAAD8EZUHIgpDAACfEgAgRQAAoBIAIEYAAKESACCFBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZYHAQAAAAGXBwAAAJUHAg4JAACrDgAgKAAAqA4AICkAANwQACArAACpDgAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAcMGAQAAAAHeBgEAAAAB5AYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQIAAAAtACBmAACdEwAgAwAAAC0AIGYAAJ0TACBnAACcEwAgAV8AAL4aADACAAAALQAgXwAAnBMAIAIAAACgDgAgXwAAmxMAIAqFBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIcMGAQDjDAAh3gYBAOMMACHkBgEA5AwAIesGAQDkDAAh7AYBAOMMACHtBgEA4wwAIQ4JAACmDgAgKAAAow4AICkAANoQACArAACkDgAghQYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACHDBgEA4wwAId4GAQDjDAAh5AYBAOQMACHrBgEA5AwAIewGAQDjDAAh7QYBAOMMACEOCQAAqw4AICgAAKgOACApAADcEAAgKwAAqQ4AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHDBgEAAAAB3gYBAAAAAeQGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAENCQAA4BAAIAsAAN4QACAbAAD2EAAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA6wYC3gYBAAAAAeQGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAECAAAANAAgZgAAphMAIAMAAAA0ACBmAACmEwAgZwAApRMAIAFfAAC9GgAwAgAAADQAIF8AAKUTACACAAAAyxAAIF8AAKQTACAKhQYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACG9BgAAzRDrBiLeBgEA4wwAIeQGAQDkDAAh5gYBAOQMACHoBgEA4wwAIekGAQDjDAAhDQkAANEQACALAADPEAAgGwAA9RAAIIUGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhvQYAAM0Q6wYi3gYBAOMMACHkBgEA5AwAIeYGAQDkDAAh6AYBAOMMACHpBgEA4wwAIQ0JAADgEAAgCwAA3hAAIBsAAPYQACCFBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADrBgLeBgEAAAAB5AYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAQw-AADwDgAghQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADVBgLRBgEAAAAB0wYAAADTBgLVBhAAAAAB1gYBAAAAAdcGAgAAAAHYBkAAAAAB2QZAAAAAAQIAAADdAQAgZgAArxMAIAMAAADdAQAgZgAArxMAIGcAAK4TACABXwAAvBoAMAIAAADdAQAgXwAArhMAIAIAAADFEgAgXwAArRMAIAuFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG9BgAA6g7VBiLRBgEA5AwAIdMGAADpDtMGItUGEADrDgAh1gYBAOMMACHXBgIA7A4AIdgGQADlDAAh2QZAAOUMACEMPgAA7g4AIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIb0GAADqDtUGItEGAQDkDAAh0wYAAOkO0wYi1QYQAOsOACHWBgEA4wwAIdcGAgDsDgAh2AZAAOUMACHZBkAA5QwAIQw-AADwDgAghQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADVBgLRBgEAAAAB0wYAAADTBgLVBhAAAAAB1gYBAAAAAdcGAgAAAAHYBkAAAAAB2QZAAAAAARGFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAPoGAtMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-AYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABAgAAAOsBACBmAAC7EwAgAwAAAOsBACBmAAC7EwAgZwAAuhMAIAFfAAC7GgAwFgcAAKELACCCBgAAjgwAMIMGAADpAQAQhAYAAI4MADCFBgEAAAABigYBANgKACGNBkAA3AoAIY4GQADcCgAhvQYAAJIM-gYi0wYAAI8M0wYi1QYQAJAMACHWBgEA2AoAIdcGAgCRDAAh-AYBANgKACH6BgEAAAAB-wYBANkKACH8BgEAAAAB_QYBANkKACH-BgEA2QoAIf8GAQDZCgAhgAcAAJMMACCBB0AAhAwAIQIAAADrAQAgXwAAuhMAIAIAAAC4EwAgXwAAuRMAIBWCBgAAtxMAMIMGAAC4EwAQhAYAALcTADCFBgEA2AoAIYoGAQDYCgAhjQZAANwKACGOBkAA3AoAIb0GAACSDPoGItMGAACPDNMGItUGEACQDAAh1gYBANgKACHXBgIAkQwAIfgGAQDYCgAh-gYBANgKACH7BgEA2QoAIfwGAQDZCgAh_QYBANkKACH-BgEA2QoAIf8GAQDZCgAhgAcAAJMMACCBB0AAhAwAIRWCBgAAtxMAMIMGAAC4EwAQhAYAALcTADCFBgEA2AoAIYoGAQDYCgAhjQZAANwKACGOBkAA3AoAIb0GAACSDPoGItMGAACPDNMGItUGEACQDAAh1gYBANgKACHXBgIAkQwAIfgGAQDYCgAh-gYBANgKACH7BgEA2QoAIfwGAQDZCgAh_QYBANkKACH-BgEA2QoAIf8GAQDZCgAhgAcAAJMMACCBB0AAhAwAIRGFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG9BgAA3RH6BiLTBgAA6Q7TBiLVBhAA6w4AIdYGAQDjDAAh1wYCAOwOACH4BgEA4wwAIfoGAQDjDAAh-wYBAOQMACH8BgEA5AwAIf0GAQDkDAAh_gYBAOQMACH_BgEA5AwAIYAHgAAAAAGBB0AA-wwAIRGFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG9BgAA3RH6BiLTBgAA6Q7TBiLVBhAA6w4AIdYGAQDjDAAh1wYCAOwOACH4BgEA4wwAIfoGAQDjDAAh-wYBAOQMACH8BgEA5AwAIf0GAQDkDAAh_gYBAOQMACH_BgEA5AwAIYAHgAAAAAGBB0AA-wwAIRGFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAPoGAtMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-AYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABC4UGAQAAAAGNBkAAAAABjgZAAAAAAYIHAQAAAAGDBwEAAAABhAcBAAAAAYUHAQAAAAGGBwEAAAABhwcBAAAAAYgHIAAAAAGJBwEAAAABAgAAANYGACBmAAC8EwAgAwAAAOcBACBmAAC8EwAgZwAAwBMAIA0AAADnAQAgXwAAwBMAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIYIHAQDjDAAhgwcBAOMMACGEBwEA4wwAIYUHAQDjDAAhhgcBAOMMACGHBwEA4wwAIYgHIADFDgAhiQcBAOQMACELhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhggcBAOMMACGDBwEA4wwAIYQHAQDjDAAhhQcBAOMMACGGBwEA4wwAIYcHAQDjDAAhiAcgAMUOACGJBwEA5AwAIRoJAACaDwAgGQAA6g8AIBsAAJsPACAdAACcDwAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG9BgAAAI4HAtUGEAAAAAHWBgEAAAAB1wYCAAAAAeYGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGAB4AAAAABgQdAAAAAAYoHAQAAAAGMBwAAAIwHAo4HAQAAAAGPB0AAAAABAgAAAFkAIGYAAMkTACADAAAAWQAgZgAAyRMAIGcAAMgTACABXwAAuhoAMAIAAABZACBfAADIEwAgAgAAAI8PACBfAADHEwAgFoUGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAhsQYBAOMMACG9BgAAkg-OByLVBhAA6w4AIdYGAQDjDAAh1wYCAOwOACHmBgEA4wwAIfoGAQDjDAAh-wYBAOQMACH8BgEA5AwAIf0GAQDkDAAh_gYBAOQMACH_BgEA5AwAIYAHgAAAAAGBB0AA-wwAIYoHAQDjDAAhjAcAAJEPjAcijgcBAOMMACGPB0AA5QwAIRoJAACVDwAgGQAA6A8AIBsAAJYPACAdAACXDwAghQYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACGxBgEA4wwAIb0GAACSD44HItUGEADrDgAh1gYBAOMMACHXBgIA7A4AIeYGAQDjDAAh-gYBAOMMACH7BgEA5AwAIfwGAQDkDAAh_QYBAOQMACH-BgEA5AwAIf8GAQDkDAAhgAeAAAAAAYEHQAD7DAAhigcBAOMMACGMBwAAkQ-MByKOBwEA4wwAIY8HQADlDAAhGgkAAJoPACAZAADqDwAgGwAAmw8AIB0AAJwPACCFBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_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_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABAgAAAKUBACBmAAD2EwAgAwAAAKUBACBmAAD2EwAgZwAA9RMAIAFfAAC1GgAwAgAAAKUBACBfAAD1EwAgAgAAAKUNACBfAAD0EwAgDYUGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhmgYBAOMMACGvBgEA5AwAIbsGAQDkDAAhvQYAAKcNvQYivgYBAOQMACG_BkAA-wwAIcAGQADlDAAhwQYBAOMMACHCBgEA5AwAIRIJAACtDQAgEAAA3Q4AIBYAAKkNACAYAACrDQAgMwAAqg0AIIUGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhmgYBAOMMACGvBgEA5AwAIbsGAQDkDAAhvQYAAKcNvQYivgYBAOQMACG_BkAA-wwAIcAGQADlDAAhwQYBAOMMACHCBgEA5AwAIRIJAACzDQAgEAAA3g4AIBYAAK8NACAYAACxDQAgMwAAsA0AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGaBgEAAAABrwYBAAAAAbsGAQAAAAG9BgAAAL0GAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABHTwAAMkSACA9AADKEgAgPwAAzBIAIIUGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABpwcBAAAAAagHAQAAAAGpBwEAAAABqwcAAACrBwOsBwEAAAABrQcAAADTBgOuBxAAAAABrwcBAAAAAbAHAgAAAAGxBwAAAPoGArIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHgAAAAAG5B0AAAAABuwcBAAAAAQIAAADXAQAgZgAAghQAIAMAAADXAQAgZgAAghQAIGcAAIEUACABXwAAtBoAMCIHAACcDAAgPAAA3QoAID0AAIUMACA_AADdCwAgggYAAJcMADCDBgAA1QEAEIQGAACXDAAwhQYBAAAAAYoGAQDZCgAhjQZAANwKACGOBkAA3AoAIb0GAACbDLsHIr8GQACEDAAh5AYBANkKACGmBwEA2QoAIacHAQDYCgAhqAcBANgKACGpBwEA2QoAIasHAADNC6sHI6wHAQDZCgAhrQcAAJgM0wYjrgcQAJkMACGvBwEA2AoAIbAHAgCaDAAhsQcAAJIM-gYisgcBAAAAAbMHAQDZCgAhtAcBAAAAAbUHAQDZCgAhtgcBANkKACG3BwEA2QoAIbgHAACTDAAguQdAAIQMACG7BwEA2QoAIQIAAADXAQAgXwAAgRQAIAIAAAD_EwAgXwAAgBQAIB6CBgAA_hMAMIMGAAD_EwAQhAYAAP4TADCFBgEA2AoAIYoGAQDZCgAhjQZAANwKACGOBkAA3AoAIb0GAACbDLsHIr8GQACEDAAh5AYBANkKACGmBwEA2QoAIacHAQDYCgAhqAcBANgKACGpBwEA2QoAIasHAADNC6sHI6wHAQDZCgAhrQcAAJgM0wYjrgcQAJkMACGvBwEA2AoAIbAHAgCaDAAhsQcAAJIM-gYisgcBANkKACGzBwEA2QoAIbQHAQDZCgAhtQcBANkKACG2BwEA2QoAIbcHAQDZCgAhuAcAAJMMACC5B0AAhAwAIbsHAQDZCgAhHoIGAAD-EwAwgwYAAP8TABCEBgAA_hMAMIUGAQDYCgAhigYBANkKACGNBkAA3AoAIY4GQADcCgAhvQYAAJsMuwcivwZAAIQMACHkBgEA2QoAIaYHAQDZCgAhpwcBANgKACGoBwEA2AoAIakHAQDZCgAhqwcAAM0LqwcjrAcBANkKACGtBwAAmAzTBiOuBxAAmQwAIa8HAQDYCgAhsAcCAJoMACGxBwAAkgz6BiKyBwEA2QoAIbMHAQDZCgAhtAcBANkKACG1BwEA2QoAIbYHAQDZCgAhtwcBANkKACG4BwAAkwwAILkHQACEDAAhuwcBANkKACEahQYBAOMMACGNBkAA5QwAIY4GQADlDAAhvQYAALgSuwcivwZAAPsMACHkBgEA5AwAIaYHAQDkDAAhpwcBAOMMACGoBwEA4wwAIakHAQDkDAAhqwcAALUSqwcjrAcBAOQMACGtBwAAthLTBiOuBxAAtxIAIa8HAQDjDAAhsAcCAJkQACGxBwAA3RH6BiKyBwEA5AwAIbMHAQDkDAAhtAcBAOQMACG1BwEA5AwAIbYHAQDkDAAhtwcBAOQMACG4B4AAAAABuQdAAPsMACG7BwEA5AwAIR08AAC5EgAgPQAAuhIAID8AALwSACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG9BgAAuBK7ByK_BkAA-wwAIeQGAQDkDAAhpgcBAOQMACGnBwEA4wwAIagHAQDjDAAhqQcBAOQMACGrBwAAtRKrByOsBwEA5AwAIa0HAAC2EtMGI64HEAC3EgAhrwcBAOMMACGwBwIAmRAAIbEHAADdEfoGIrIHAQDkDAAhswcBAOQMACG0BwEA5AwAIbUHAQDkDAAhtgcBAOQMACG3BwEA5AwAIbgHgAAAAAG5B0AA-wwAIbsHAQDkDAAhHTwAAMkSACA9AADKEgAgPwAAzBIAIIUGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABpwcBAAAAAagHAQAAAAGpBwEAAAABqwcAAACrBwOsBwEAAAABrQcAAADTBgOuBxAAAAABrwcBAAAAAbAHAgAAAAGxBwAAAPoGArIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHgAAAAAG5B0AAAAABuwcBAAAAAQsJAADuDQAgDgAA6w0AIA8AAOwNACAQAADPDgAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABrwYBAAAAAQIAAAA9ACBmAACLFAAgAwAAAD0AIGYAAIsUACBnAACKFAAgAV8AALMaADACAAAAPQAgXwAAihQAIAIAAADjDQAgXwAAiRQAIAeFBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIa0GAQDjDAAhrgYBAOMMACGvBgEA4wwAIQsJAADpDQAgDgAA5g0AIA8AAOcNACAQAADODgAghQYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACGtBgEA4wwAIa4GAQDjDAAhrwYBAOMMACELCQAA7g0AIA4AAOsNACAPAADsDQAgEAAAzw4AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAEVCQAAsw4AIAoAALQOACALAACtDgAgDgAAsg4AIA8AALAOACAQAADDDwAgGQAAsQ4AIBsAALUOACAsAACuDgAgLQAArw4AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB5gYBAAAAAfYGAQAAAAG9B0AAAAABAgAAACkAIGYAAJQUACADAAAAKQAgZgAAlBQAIGcAAJMUACABXwAAshoAMAIAAAApACBfAACTFAAgAgAAAPcNACBfAACSFAAgC4UGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrQYBAOMMACGuBgEA4wwAIa8GAQDjDAAhsQYBAOMMACHmBgEA4wwAIfYGAQDkDAAhvQdAAOUMACEVCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAADBDwAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_A0AIIUGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrQYBAOMMACGuBgEA4wwAIa8GAQDjDAAhsQYBAOMMACHmBgEA4wwAIfYGAQDkDAAhvQdAAOUMACEVCQAAsw4AIAoAALQOACALAACtDgAgDgAAsg4AIA8AALAOACAQAADDDwAgGQAAsQ4AIBsAALUOACAsAACuDgAgLQAArw4AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB5gYBAAAAAfYGAQAAAAG9B0AAAAABDgMAAMYPACAJAADFDwAgDQAAxw8AIBMAAMgPACAaAADJDwAgHAAAyg8AICIAAMsPACCFBgEAAAABiQYBAAAAAYsGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHaBgEAAAABAgAAAJ8BACBmAACgFAAgAwAAAJ8BACBmAACgFAAgZwAAnxQAIAFfAACxGgAwEwMAAN0KACAHAACcDAAgCQAAowwAIA0AAIcLACATAADZCwAgGgAAlQsAIBwAAIkLACAiAADhCwAgggYAAKkMADCDBgAAVQAQhAYAAKkMADCFBgEAAAABiQYBANkKACGKBgEA2QoAIYsGAQDZCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAh2gYBAAAAAQIAAACfAQAgXwAAnxQAIAIAAACdFAAgXwAAnhQAIAuCBgAAnBQAMIMGAACdFAAQhAYAAJwUADCFBgEA2AoAIYkGAQDZCgAhigYBANkKACGLBgEA2QoAIYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIdoGAQDYCgAhC4IGAACcFAAwgwYAAJ0UABCEBgAAnBQAMIUGAQDYCgAhiQYBANkKACGKBgEA2QoAIYsGAQDZCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAh2gYBANgKACEHhQYBAOMMACGJBgEA5AwAIYsGAQDkDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAh2gYBAOMMACEOAwAA9g4AIAkAAPUOACANAAD3DgAgEwAA-A4AIBoAAPkOACAcAAD6DgAgIgAA-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_QIAIA0JAACvEQAgCgAAxhQAIA0AALARACARAACxEQAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAAB9gYBAAAAAb4HAQAAAAG_BwEAAAABAgAAACQAIGYAAMUUACADAAAAJAAgZgAAxRQAIGcAAMMUACABXwAAqRoAMAIAAAAkACBfAADDFAAgAgAAAJQRACBfAADCFAAgCYUGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACHwBgIAmRAAIfYGAQDkDAAhvgcBAOMMACG_BwEA4wwAIQ0JAACYEQAgCgAAxBQAIA0AAJkRACARAACaEQAghQYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfAGAgCZEAAh9gYBAOQMACG-BwEA4wwAIb8HAQDjDAAhB2YAAKQaACBnAACnGgAg6wcAAKUaACDsBwAAphoAIO8HAAAeACDwBwAAHgAg8QcAACAAIA0JAACvEQAgCgAAxhQAIA0AALARACARAACxEQAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAAB9gYBAAAAAb4HAQAAAAG_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-FAAgAwAAAJkBACBmAAD-FAAgZwAA8hQAIAFfAACgGgAwDQcAAKELACAJAACjDAAgJQAAhgsAIIIGAACqDAAwgwYAAG0AEIQGAACqDAAwhQYBAAAAAYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAh3gYBANgKACHkBgEA2QoAIQIAAACZAQAgXwAA8hQAIAIAAADwFAAgXwAA8RQAIAqCBgAA7xQAMIMGAADwFAAQhAYAAO8UADCFBgEA2AoAIYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAh3gYBANgKACHkBgEA2QoAIQqCBgAA7xQAMIMGAADwFAAQhAYAAO8UADCFBgEA2AoAIYoGAQDYCgAhiwYBANkKACGNBkAA3AoAIY4GQADcCgAh3gYBANgKACHkBgEA2QoAIQaFBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAh5AYBAOQMACEICQAA8xQAICUAAPQUACCFBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAh5AYBAOQMACEHZgAAmhoAIGcAAJ4aACDrBwAAmxoAIOwHAACdGgAg7wcAABkAIPAHAAAZACDxBwAAGwAgC2YAAPUUADBnAAD5FAAw6wcAAPYUADDsBwAA9xQAMO0HAAD4FAAg7gcAAJMQADDvBwAAkxAAMPAHAACTEAAw8QcAAJMQADDyBwAA-hQAMPMHAACWEAAwDwcAAMAQACAJAADBEAAgDQAAvRAAIBEAAL4QACAbAADxEAAgJAAAvxAAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHlBgIAAAAB5gYBAAAAAQIAAAA4ACBmAAD9FAAgAwAAADgAIGYAAP0UACBnAAD8FAAgAV8AAJwaADACAAAAOAAgXwAA_BQAIAIAAACXEAAgXwAA-xQAIAmFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACHkBgEA5AwAIeUGAgCZEAAh5gYBAOMMACEPBwAAnhAAIAkAAJ8QACANAACbEAAgEQAAnBAAIBsAAPAQACAkAACdEAAghQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAh5AYBAOQMACHlBgIAmRAAIeYGAQDjDAAhDwcAAMAQACAJAADBEAAgDQAAvRAAIBEAAL4QACAbAADxEAAgJAAAvxAAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHlBgIAAAAB5gYBAAAAAQgJAAD_FAAgJQAAgBUAIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAQNmAACaGgAg6wcAAJsaACDxBwAAGwAgBGYAAPUUADDrBwAA9hQAMO0HAAD4FAAg8QcAAJMQADANCQAAtREAIA0AALMRACAPAACyEQAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAHkBgEAAAAB7gYBAAAAAe8GQAAAAAHwBggAAAAB8QYIAAAAAQIAAAAgACBmAACMFQAgAwAAACAAIGYAAIwVACBnAACLFQAgAV8AAJkaADASBwAAoQsAIAkAALAMACANAACHCwAgDwAA0gsAIIIGAADVDAAwgwYAAB4AEIQGAADVDAAwhQYBAAAAAYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAhtgYBANgKACHkBgEA2QoAIe4GAQDZCgAh7wZAAIQMACHwBggAoAwAIfEGCACgDAAhAgAAACAAIF8AAIsVACACAAAAiRUAIF8AAIoVACAOggYAAIgVADCDBgAAiRUAEIQGAACIFQAwhQYBANgKACGKBgEA2AoAIYsGAQDYCgAhjQZAANwKACGOBkAA3AoAIbYGAQDYCgAh5AYBANkKACHuBgEA2QoAIe8GQACEDAAh8AYIAKAMACHxBggAoAwAIQ6CBgAAiBUAMIMGAACJFQAQhAYAAIgVADCFBgEA2AoAIYoGAQDYCgAhiwYBANgKACGNBkAA3AoAIY4GQADcCgAhtgYBANgKACHkBgEA2QoAIe4GAQDZCgAh7wZAAIQMACHwBggAoAwAIfEGCACgDAAhCoUGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACHkBgEA5AwAIe4GAQDkDAAh7wZAAPsMACHwBggAlA0AIfEGCACUDQAhDQkAAIIRACANAACAEQAgDwAA_xAAIIUGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACHkBgEA5AwAIe4GAQDkDAAh7wZAAPsMACHwBggAlA0AIfEGCACUDQAhDQkAALURACANAACzEQAgDwAAshEAIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB5AYBAAAAAe4GAQAAAAHvBkAAAAAB8AYIAAAAAfEGCAAAAAEHOQAA4xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAGpBwEAAAABvAcBAAAAAQIAAAAWACBmAADiFgAgAwAAABYAIGYAAOIWACBnAACXFQAgAV8AAJgaADAMBwAAnAwAIDkAANkMACCCBgAA2AwAMIMGAAAUABCEBgAA2AwAMIUGAQAAAAGKBgEA2QoAIY0GQADcCgAhjgZAANwKACHkBgEA2QoAIakHAQDZCgAhvAcBANgKACECAAAAFgAgXwAAlxUAIAIAAACVFQAgXwAAlhUAIAqCBgAAlBUAMIMGAACVFQAQhAYAAJQVADCFBgEA2AoAIYoGAQDZCgAhjQZAANwKACGOBkAA3AoAIeQGAQDZCgAhqQcBANkKACG8BwEA2AoAIQqCBgAAlBUAMIMGAACVFQAQhAYAAJQVADCFBgEA2AoAIYoGAQDZCgAhjQZAANwKACGOBkAA3AoAIeQGAQDZCgAhqQcBANkKACG8BwEA2AoAIQaFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIakHAQDkDAAhvAcBAOMMACEHOQAAmBUAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAhqQcBAOQMACG8BwEA4wwAIQtmAACZFQAwZwAAnhUAMOsHAACaFQAw7AcAAJsVADDtBwAAnBUAIO4HAACdFQAw7wcAAJ0VADDwBwAAnRUAMPEHAACdFQAw8gcAAJ8VADDzBwAAoBUAMBcMAADfFgAgDQAA1xYAIBEAANgWACAcAADeFgAgJQAA1BYAICcAAN0WACAqAADgFgAgLgAA0RYAIC8AANIWACAwAADTFgAgMQAA1RYAIDIAANYWACA0AADZFgAgNQAA2hYAIDYAANsWACA3AADcFgAgOAAA4RYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAGpBwEAAAABvAcBAAAAAQIAAAAbACBmAADQFgAgAwAAABsAIGYAANAWACBnAACjFQAgAV8AAJcaADAcCAAA1wwAIAwAAIULACANAACHCwAgEQAA1gsAIBwAAIkLACAlAACGCwAgJwAAiAsAICoAAN4LACAuAADPCwAgLwAA0AsAIDAAANILACAxAADUCwAgMgAA1QsAIDQAAJgLACA1AADYCwAgNgAA2QsAIDcAANoLACA4AADhCwAgggYAANYMADCDBgAAGQAQhAYAANYMADCFBgEAAAABjQZAANwKACGOBkAA3AoAIeQGAQDZCgAh9QYBANkKACGpBwEA2QoAIbwHAQDYCgAhAgAAABsAIF8AAKMVACACAAAAoRUAIF8AAKIVACAKggYAAKAVADCDBgAAoRUAEIQGAACgFQAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACH1BgEA2QoAIakHAQDZCgAhvAcBANgKACEKggYAAKAVADCDBgAAoRUAEIQGAACgFQAwhQYBANgKACGNBkAA3AoAIY4GQADcCgAh5AYBANkKACH1BgEA2QoAIakHAQDZCgAhvAcBANgKACEGhQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACGpBwEA5AwAIbwHAQDjDAAhFwwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACGpBwEA5AwAIbwHAQDjDAAhC2YAAMcWADBnAADLFgAw6wcAAMgWADDsBwAAyRYAMO0HAADKFgAg7gcAAIUVADDvBwAAhRUAMPAHAACFFQAw8QcAAIUVADDyBwAAzBYAMPMHAACIFQAwC2YAALwWADBnAADAFgAw6wcAAL0WADDsBwAAvhYAMO0HAAC_FgAg7gcAAOwUADDvBwAA7BQAMPAHAADsFAAw8QcAAOwUADDyBwAAwRYAMPMHAADvFAAwC2YAALMWADBnAAC3FgAw6wcAALQWADDsBwAAtRYAMO0HAAC2FgAg7gcAAJARADDvBwAAkBEAMPAHAACQEQAw8QcAAJARADDyBwAAuBYAMPMHAACTEQAwC2YAAKoWADBnAACuFgAw6wcAAKsWADDsBwAArBYAMO0HAACtFgAg7gcAAJMQADDvBwAAkxAAMPAHAACTEAAw8QcAAJMQADDyBwAArxYAMPMHAACWEAAwC2YAAKEWADBnAAClFgAw6wcAAKIWADDsBwAAoxYAMO0HAACkFgAg7gcAAKUUADDvBwAApRQAMPAHAAClFAAw8QcAAKUUADDyBwAAphYAMPMHAACoFAAwC2YAAJgWADBnAACcFgAw6wcAAJkWADDsBwAAmhYAMO0HAACbFgAg7gcAAJkUADDvBwAAmRQAMPAHAACZFAAw8QcAAJkUADDyBwAAnRYAMPMHAACcFAAwC2YAAI8WADBnAACTFgAw6wcAAJAWADDsBwAAkRYAMO0HAACSFgAg7gcAAPMNADDvBwAA8w0AMPAHAADzDQAw8QcAAPMNADDyBwAAlBYAMPMHAAD2DQAwC2YAAIYWADBnAACKFgAw6wcAAIcWADDsBwAAiBYAMO0HAACJFgAg7gcAAN8NADDvBwAA3w0AMPAHAADfDQAw8QcAAN8NADDyBwAAixYAMPMHAADiDQAwC2YAAP0VADBnAACBFgAw6wcAAP4VADDsBwAA_xUAMO0HAACAFgAg7gcAAKENADDvBwAAoQ0AMPAHAAChDQAw8QcAAKENADDyBwAAghYAMPMHAACkDQAwC2YAAPQVADBnAAD4FQAw6wcAAPUVADDsBwAA9hUAMO0HAAD3FQAg7gcAALgNADDvBwAAuA0AMPAHAAC4DQAw8QcAALgNADDyBwAA-RUAMPMHAAC7DQAwC2YAAOsVADBnAADvFQAw6wcAAOwVADDsBwAA7RUAMO0HAADuFQAg7gcAAMgNADDvBwAAyA0AMPAHAADIDQAw8QcAAMgNADDyBwAA8BUAMPMHAADLDQAwC2YAAOIVADBnAADmFQAw6wcAAOMVADDsBwAA5BUAMO0HAADlFQAg7gcAAI4NADDvBwAAjg0AMPAHAACODQAw8QcAAI4NADDyBwAA5xUAMPMHAACRDQAwC2YAANkVADBnAADdFQAw6wcAANoVADDsBwAA2xUAMO0HAADcFQAg7gcAAO8PADDvBwAA7w8AMPAHAADvDwAw8QcAAO8PADDyBwAA3hUAMPMHAADyDwAwC2YAANAVADBnAADUFQAw6wcAANEVADDsBwAA0hUAMO0HAADTFQAg7gcAAIsPADDvBwAAiw8AMPAHAACLDwAw8QcAAIsPADDyBwAA1RUAMPMHAACODwAwC2YAAMcVADBnAADLFQAw6wcAAMgVADDsBwAAyRUAMO0HAADKFQAg7gcAAMcQADDvBwAAxxAAMPAHAADHEAAw8QcAAMcQADDyBwAAzBUAMPMHAADKEAAwC2YAAL4VADBnAADCFQAw6wcAAL8VADDsBwAAwBUAMO0HAADBFQAg7gcAAJwOADDvBwAAnA4AMPAHAACcDgAw8QcAAJwOADDyBwAAwxUAMPMHAACfDgAwC2YAALUVADBnAAC5FQAw6wcAALYVADDsBwAAtxUAMO0HAAC4FQAg7gcAAPMMADDvBwAA8wwAMPAHAADzDAAw8QcAAPMMADDyBwAAuhUAMPMHAAD2DAAwFRAAAIYPACAYAACHDQAgGQAAiA0AIB4AAIQNACAfAACFDQAgIAAAhg0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZwHAQAAAAGdBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAgAAAF8AIGYAAL0VACADAAAAXwAgZgAAvRUAIGcAALwVACABXwAAlhoAMAIAAABfACBfAAC8FQAgAgAAAPcMACBfAAC7FQAgD4UGAQDjDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhsQYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcimwcBAOMMACGcBwEA4wwAIZ0HAQDjDAAhnwcBAOQMACGgBwEA5AwAIaEHQADlDAAhFRAAAIQPACAYAACADQAgGQAAgQ0AIB4AAP0MACAfAAD-DAAgIAAA_wwAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhsQYBAOQMACG9BgAA-gybByK_BkAA-wwAIcIGAQDkDAAhmQcAAPkMmQcimwcBAOMMACGcBwEA4wwAIZ0HAQDjDAAhnwcBAOQMACGgBwEA5AwAIaEHQADlDAAhFRAAAIYPACAYAACHDQAgGQAAiA0AIB4AAIQNACAfAACFDQAgIAAAhg0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZwHAQAAAAGdBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABDgcAAKoOACAoAACoDgAgKQAA3BAAICsAAKkOACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABwwYBAAAAAd4GAQAAAAHkBgEAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAABAgAAAC0AIGYAAMYVACADAAAALQAgZgAAxhUAIGcAAMUVACABXwAAlRoAMAIAAAAtACBfAADFFQAgAgAAAKAOACBfAADEFQAgCoUGAQDjDAAhigYBAOQMACGNBkAA5QwAIY4GQADlDAAhwwYBAOMMACHeBgEA4wwAIeQGAQDkDAAh6wYBAOQMACHsBgEA4wwAIe0GAQDjDAAhDgcAAKUOACAoAACjDgAgKQAA2hAAICsAAKQOACCFBgEA4wwAIYoGAQDkDAAhjQZAAOUMACGOBkAA5QwAIcMGAQDjDAAh3gYBAOMMACHkBgEA5AwAIesGAQDkDAAh7AYBAOMMACHtBgEA4wwAIQ4HAACqDgAgKAAAqA4AICkAANwQACArAACpDgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAcMGAQAAAAHeBgEAAAAB5AYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQ0HAADfEAAgCwAA3hAAIBsAAPYQACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADrBgLeBgEAAAAB5AYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAQIAAAA0ACBmAADPFQAgAwAAADQAIGYAAM8VACBnAADOFQAgAV8AAJQaADACAAAANAAgXwAAzhUAIAIAAADLEAAgXwAAzRUAIAqFBgEA4wwAIYoGAQDkDAAhjQZAAOUMACGOBkAA5QwAIb0GAADNEOsGIt4GAQDjDAAh5AYBAOQMACHmBgEA5AwAIegGAQDjDAAh6QYBAOMMACENBwAA0BAAIAsAAM8QACAbAAD1EAAghQYBAOMMACGKBgEA5AwAIY0GQADlDAAhjgZAAOUMACG9BgAAzRDrBiLeBgEA4wwAIeQGAQDkDAAh5gYBAOQMACHoBgEA4wwAIekGAQDjDAAhDQcAAN8QACALAADeEAAgGwAA9hAAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAOsGAt4GAQAAAAHkBgEAAAAB5gYBAAAAAegGAQAAAAHpBgEAAAABGgcAAJkPACAZAADqDwAgGwAAmw8AIB0AAJwPACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAECAAAAWQAgZgAA2BUAIAMAAABZACBmAADYFQAgZwAA1xUAIAFfAACTGgAwAgAAAFkAIF8AANcVACACAAAAjw8AIF8AANYVACAWhQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACGxBgEA4wwAIb0GAACSD44HItUGEADrDgAh1gYBAOMMACHXBgIA7A4AIeYGAQDjDAAh-gYBAOMMACH7BgEA5AwAIfwGAQDkDAAh_QYBAOQMACH-BgEA5AwAIf8GAQDkDAAhgAeAAAAAAYEHQAD7DAAhigcBAOMMACGMBwAAkQ-MByKOBwEA4wwAIY8HQADlDAAhGgcAAJQPACAZAADoDwAgGwAAlg8AIB0AAJcPACCFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbEGAQDjDAAhvQYAAJIPjgci1QYQAOsOACHWBgEA4wwAIdcGAgDsDgAh5gYBAOMMACH6BgEA4wwAIfsGAQDkDAAh_AYBAOQMACH9BgEA5AwAIf4GAQDkDAAh_wYBAOQMACGAB4AAAAABgQdAAPsMACGKBwEA4wwAIYwHAACRD4wHIo4HAQDjDAAhjwdAAOUMACEaBwAAmQ8AIBkAAOoPACAbAACbDwAgHQAAnA8AIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_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_BUAIAMAAABCACBmAAD8FQAgZwAA-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_EAAgJgAAwhAAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAeUGAgAAAAHmBgEAAAAB5wYBAAAAAQIAAAA4ACBmAACyFgAgAwAAADgAIGYAALIWACBnAACxFgAgAV8AAIkaADACAAAAOAAgXwAAsRYAIAIAAACXEAAgXwAAsBYAIAmFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAh5AYBAOQMACHlBgIAmRAAIeYGAQDjDAAh5wYBAOQMACEPBwAAnhAAIA0AAJsQACARAACcEAAgGwAA8BAAICQAAJ0QACAmAACgEAAghQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACHeBgEA4wwAIeQGAQDkDAAh5QYCAJkQACHmBgEA4wwAIecGAQDkDAAhDwcAAMAQACANAAC9EAAgEQAAvhAAIBsAAPEQACAkAAC_EAAgJgAAwhAAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAeUGAgAAAAHmBgEAAAAB5wYBAAAAAQ0HAACuEQAgCgAAxhQAIA0AALARACARAACxEQAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAAB9gYBAAAAAb4HAQAAAAG_BwEAAAABAgAAACQAIGYAALsWACADAAAAJAAgZgAAuxYAIGcAALoWACABXwAAiBoAMAIAAAAkACBfAAC6FgAgAgAAAJQRACBfAAC5FgAgCYUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACHwBgIAmRAAIfYGAQDkDAAhvgcBAOMMACG_BwEA4wwAIQ0HAACXEQAgCgAAxBQAIA0AAJkRACARAACaEQAghQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfAGAgCZEAAh9gYBAOQMACG-BwEA4wwAIb8HAQDjDAAhDQcAAK4RACAKAADGFAAgDQAAsBEAIBEAALERACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfAGAgAAAAH2BgEAAAABvgcBAAAAAb8HAQAAAAEIBwAAxhYAICUAAIAVACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAECAAAAmQEAIGYAAMUWACADAAAAmQEAIGYAAMUWACBnAADDFgAgAV8AAIcaADACAAAAmQEAIF8AAMMWACACAAAA8BQAIF8AAMIWACAGhQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACHeBgEA4wwAIeQGAQDkDAAhCAcAAMQWACAlAAD0FAAghQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACHeBgEA4wwAIeQGAQDkDAAhBWYAAIIaACBnAACFGgAg6wcAAIMaACDsBwAAhBoAIPEHAACABQAgCAcAAMYWACAlAACAFQAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAABA2YAAIIaACDrBwAAgxoAIPEHAACABQAgDQcAALQRACANAACzEQAgDwAAshEAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB5AYBAAAAAe4GAQAAAAHvBkAAAAAB8AYIAAAAAfEGCAAAAAECAAAAIAAgZgAAzxYAIAMAAAAgACBmAADPFgAgZwAAzhYAIAFfAACBGgAwAgAAACAAIF8AAM4WACACAAAAiRUAIF8AAM0WACAKhQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACG2BgEA4wwAIeQGAQDkDAAh7gYBAOQMACHvBkAA-wwAIfAGCACUDQAh8QYIAJQNACENBwAAgREAIA0AAIARACAPAAD_EAAghQYBAOMMACGKBgEA4wwAIY0GQADlDAAhjgZAAOUMACG2BgEA4wwAIeQGAQDkDAAh7gYBAOQMACHvBkAA-wwAIfAGCACUDQAh8QYIAJQNACENBwAAtBEAIA0AALMRACAPAACyEQAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAHkBgEAAAAB7gYBAAAAAe8GQAAAAAHwBggAAAAB8QYIAAAAARcMAADfFgAgDQAA1xYAIBEAANgWACAcAADeFgAgJQAA1BYAICcAAN0WACAqAADgFgAgLgAA0RYAIC8AANIWACAwAADTFgAgMQAA1RYAIDIAANYWACA0AADZFgAgNQAA2hYAIDYAANsWACA3AADcFgAgOAAA4RYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAGpBwEAAAABvAcBAAAAAQRmAADHFgAw6wcAAMgWADDtBwAAyhYAIPEHAACFFQAwBGYAALwWADDrBwAAvRYAMO0HAAC_FgAg8QcAAOwUADAEZgAAsxYAMOsHAAC0FgAw7QcAALYWACDxBwAAkBEAMARmAACqFgAw6wcAAKsWADDtBwAArRYAIPEHAACTEAAwBGYAAKEWADDrBwAAohYAMO0HAACkFgAg8QcAAKUUADAEZgAAmBYAMOsHAACZFgAw7QcAAJsWACDxBwAAmRQAMARmAACPFgAw6wcAAJAWADDtBwAAkhYAIPEHAADzDQAwBGYAAIYWADDrBwAAhxYAMO0HAACJFgAg8QcAAN8NADAEZgAA_RUAMOsHAAD-FQAw7QcAAIAWACDxBwAAoQ0AMARmAAD0FQAw6wcAAPUVADDtBwAA9xUAIPEHAAC4DQAwBGYAAOsVADDrBwAA7BUAMO0HAADuFQAg8QcAAMgNADAEZgAA4hUAMOsHAADjFQAw7QcAAOUVACDxBwAAjg0AMARmAADZFQAw6wcAANoVADDtBwAA3BUAIPEHAADvDwAwBGYAANAVADDrBwAA0RUAMO0HAADTFQAg8QcAAIsPADAEZgAAxxUAMOsHAADIFQAw7QcAAMoVACDxBwAAxxAAMARmAAC-FQAw6wcAAL8VADDtBwAAwRUAIPEHAACcDgAwBGYAALUVADDrBwAAthUAMO0HAAC4FQAg8QcAAPMMADAHOQAA4xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAGpBwEAAAABvAcBAAAAAQRmAACZFQAw6wcAAJoVADDtBwAAnBUAIPEHAACdFQAwBGYAAI0VADDrBwAAjhUAMO0HAACQFQAg8QcAAJEVADAEZgAAgRUAMOsHAACCFQAw7QcAAIQVACDxBwAAhRUAMARmAADoFAAw6wcAAOkUADDtBwAA6xQAIPEHAADsFAAwBGYAANAUADDrBwAA0RQAMO0HAADTFAAg8QcAANQUADAEZgAAxxQAMOsHAADIFAAw7QcAAMoUACDxBwAAkxAAMARmAAC8FAAw6wcAAL0UADDtBwAAvxQAIPEHAACQEQAwBGYAAK0UADDrBwAArhQAMO0HAACwFAAg8QcAALEUADAEZgAAoRQAMOsHAACiFAAw7QcAAKQUACDxBwAApRQAMARmAACVFAAw6wcAAJYUADDtBwAAmBQAIPEHAACZFAAwBGYAAIwUADDrBwAAjRQAMO0HAACPFAAg8QcAAPMNADAEZgAAgxQAMOsHAACEFAAw7QcAAIYUACDxBwAA3w0AMARmAAD3EwAw6wcAAPgTADDtBwAA-hMAIPEHAAD7EwAwBGYAAO4TADDrBwAA7xMAMO0HAADxEwAg8QcAAKENADAEZgAA5RMAMOsHAADmEwAw7QcAAOgTACDxBwAAuA0AMARmAADcEwAw6wcAAN0TADDtBwAA3xMAIPEHAADIDQAwBGYAANMTADDrBwAA1BMAMO0HAADWEwAg8QcAAI4NADAEZgAAyhMAMOsHAADLEwAw7QcAAM0TACDxBwAA7w8AMARmAADBEwAw6wcAAMITADDtBwAAxBMAIPEHAACLDwAwA2YAALwTACDrBwAAvRMAIPEHAADWBgAgBGYAALATADDrBwAAsRMAMO0HAACzEwAg8QcAALQTADAEZgAApxMAMOsHAACoEwAw7QcAAKoTACDxBwAAwRIAMARmAACeEwAw6wcAAJ8TADDtBwAAoRMAIPEHAADHEAAwBGYAAJUTADDrBwAAlhMAMO0HAACYEwAg8QcAAJwOADAEZgAAiRMAMOsHAACKEwAw7QcAAIwTACDxBwAAjRMAMARmAAD9EgAw6wcAAP4SADDtBwAAgBMAIPEHAACBEwAwBGYAAPQSADDrBwAA9RIAMO0HAAD3EgAg8QcAAPMMADAEZgAA6xIAMOsHAADsEgAw7QcAAO4SACDxBwAA8wwAMAAAAAAAAAAAAAAAAAACBwAA5REAIIkHAADfDAAgAAAAAAAAAAAAB2YAAPwZACBnAAD_GQAg6wcAAP0ZACDsBwAA_hkAIO8HAAASACDwBwAAEgAg8QcAAIAFACADZgAA_BkAIOsHAAD9GQAg8QcAAIAFACAAAAAHZgAA9xkAIGcAAPoZACDrBwAA-BkAIOwHAAD5GQAg7wcAABQAIPAHAAAUACDxBwAAFgAgA2YAAPcZACDrBwAA-BkAIPEHAAAWACAAAAAAAAAAAAAAAAAABWYAAPIZACBnAAD1GQAg6wcAAPMZACDsBwAA9BkAIPEHAACABQAgA2YAAPIZACDrBwAA8xkAIPEHAACABQAgAAAAAAAABWYAAO0ZACBnAADwGQAg6wcAAO4ZACDsBwAA7xkAIPEHAAD9AgAgA2YAAO0ZACDrBwAA7hkAIPEHAAD9AgAgAAAAAAAABWYAAOgZACBnAADrGQAg6wcAAOkZACDsBwAA6hkAIPEHAAD9AgAgA2YAAOgZACDrBwAA6RkAIPEHAAD9AgAgAAAABWYAAOMZACBnAADmGQAg6wcAAOQZACDsBwAA5RkAIPEHAAD9AgAgA2YAAOMZACDrBwAA5BkAIPEHAAD9AgAgAAAAC2YAAIMZADBnAACIGQAw6wcAAIQZADDsBwAAhRkAMO0HAACGGQAg7gcAAIcZADDvBwAAhxkAMPAHAACHGQAw8QcAAIcZADDyBwAAiRkAMPMHAACKGQAwC2YAAPcYADBnAAD8GAAw6wcAAPgYADDsBwAA-RgAMO0HAAD6GAAg7gcAAPsYADDvBwAA-xgAMPAHAAD7GAAw8QcAAPsYADDyBwAA_RgAMPMHAAD-GAAwC2YAAOwYADBnAADwGAAw6wcAAO0YADDsBwAA7hgAMO0HAADvGAAg7gcAALEUADDvBwAAsRQAMPAHAACxFAAw8QcAALEUADDyBwAA8RgAMPMHAAC0FAAwC2YAAOMYADBnAADnGAAw6wcAAOQYADDsBwAA5RgAMO0HAADmGAAg7gcAAKUUADDvBwAApRQAMPAHAAClFAAw8QcAAKUUADDyBwAA6BgAMPMHAACoFAAwC2YAANoYADBnAADeGAAw6wcAANsYADDsBwAA3BgAMO0HAADdGAAg7gcAAJkUADDvBwAAmRQAMPAHAACZFAAw8QcAAJkUADDyBwAA3xgAMPMHAACcFAAwC2YAANEYADBnAADVGAAw6wcAANIYADDsBwAA0xgAMO0HAADUGAAg7gcAAPsTADDvBwAA-xMAMPAHAAD7EwAw8QcAAPsTADDyBwAA1hgAMPMHAAD-EwAwC2YAAMgYADBnAADMGAAw6wcAAMkYADDsBwAAyhgAMO0HAADLGAAg7gcAAPsTADDvBwAA-xMAMPAHAAD7EwAw8QcAAPsTADDyBwAAzRgAMPMHAAD-EwAwC2YAAL8YADBnAADDGAAw6wcAAMAYADDsBwAAwRgAMO0HAADCGAAg7gcAAKENADDvBwAAoQ0AMPAHAAChDQAw8QcAAKENADDyBwAAxBgAMPMHAACkDQAwC2YAALYYADBnAAC6GAAw6wcAALcYADDsBwAAuBgAMO0HAAC5GAAg7gcAAKENADDvBwAAoQ0AMPAHAAChDQAw8QcAAKENADDyBwAAuxgAMPMHAACkDQAwB2YAALEYACBnAAC0GAAg6wcAALIYACDsBwAAsxgAIO8HAACwAgAg8AcAALACACDxBwAAlAoAIAtmAACoGAAwZwAArBgAMOsHAACpGAAw7AcAAKoYADDtBwAAqxgAIO4HAAChDwAw7wcAAKEPADDwBwAAoQ8AMPEHAAChDwAw8gcAAK0YADDzBwAApA8AMAtmAACfGAAwZwAAoxgAMOsHAACgGAAw7AcAAKEYADDtBwAAohgAIO4HAAChDwAw7wcAAKEPADDwBwAAoQ8AMPEHAAChDwAw8gcAAKQYADDzBwAApA8AMAdmAACaGAAgZwAAnRgAIOsHAACbGAAg7AcAAJwYACDvBwAAtAIAIPAHAAC0AgAg8QcAALQIACALZgAAjhgAMGcAAJMYADDrBwAAjxgAMOwHAACQGAAw7QcAAJEYACDuBwAAkhgAMO8HAACSGAAw8AcAAJIYADDxBwAAkhgAMPIHAACUGAAw8wcAAJUYADALZgAAhRgAMGcAAIkYADDrBwAAhhgAMOwHAACHGAAw7QcAAIgYACDuBwAA8wwAMO8HAADzDAAw8AcAAPMMADDxBwAA8wwAMPIHAACKGAAw8wcAAPYMADALZgAA_BcAMGcAAIAYADDrBwAA_RcAMOwHAAD-FwAw7QcAAP8XACDuBwAA8wwAMO8HAADzDAAw8AcAAPMMADDxBwAA8wwAMPIHAACBGAAw8wcAAPYMADALZgAA8xcAMGcAAPcXADDrBwAA9BcAMOwHAAD1FwAw7QcAAPYXACDuBwAAgRMAMO8HAACBEwAw8AcAAIETADDxBwAAgRMAMPIHAAD4FwAw8wcAAIQTADALZgAA6hcAMGcAAO4XADDrBwAA6xcAMOwHAADsFwAw7QcAAO0XACDuBwAAgRMAMO8HAACBEwAw8AcAAIETADDxBwAAgRMAMPIHAADvFwAw8wcAAIQTADALZgAA4RcAMGcAAOUXADDrBwAA4hcAMOwHAADjFwAw7QcAAOQXACDuBwAAjRMAMO8HAACNEwAw8AcAAI0TADDxBwAAjRMAMPIHAADmFwAw8wcAAJATADALZgAA2BcAMGcAANwXADDrBwAA2RcAMOwHAADaFwAw7QcAANsXACDuBwAAihIAMO8HAACKEgAw8AcAAIoSADDxBwAAihIAMPIHAADdFwAw8wcAAI0SADAERAAA9xEAIIUGAQAAAAGSBwEAAAABkwdAAAAAAQIAAAD6AQAgZgAA4BcAIAMAAAD6AQAgZgAA4BcAIGcAAN8XACABXwAA4hkAMAIAAAD6AQAgXwAA3xcAIAIAAACOEgAgXwAA3hcAIAOFBgEA4wwAIZIHAQDjDAAhkwdAAOUMACEERAAA9REAIIUGAQDjDAAhkgcBAOMMACGTB0AA5QwAIQREAAD3EQAghQYBAAAAAZIHAQAAAAGTB0AAAAABCgcAAJ4SACBFAACgEgAgRgAAoRIAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZcHAAAAlQcCAgAAAPIBACBmAADpFwAgAwAAAPIBACBmAADpFwAgZwAA6BcAIAFfAADhGQAwAgAAAPIBACBfAADoFwAgAgAAAJETACBfAADnFwAgB4UGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACG3BgEA4wwAIZcHAAD8EZUHIgoHAACCEgAgRQAAhBIAIEYAAIUSACCFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbYGAQDjDAAhtwYBAOMMACGXBwAA_BGVByIKBwAAnhIAIEUAAKASACBGAAChEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAG3BgEAAAABlwcAAACVBwILBwAArhIAICAAAK0SACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABnQcBAAAAAaMHAAAAowcCpQcBAAAAAQIAAACAAgAgZgAA8hcAIAMAAACAAgAgZgAA8hcAIGcAAPEXACABXwAA4BkAMAIAAACAAgAgXwAA8RcAIAIAAACFEwAgXwAA8BcAIAmFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAIb0GAACpEqUHIr8GQAD7DAAhnQcBAOMMACGjBwAAqBKjByKlBwEA5AwAIQsHAACrEgAgIAAAqhIAIIUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAhvQYAAKkSpQcivwZAAPsMACGdBwEA4wwAIaMHAACoEqMHIqUHAQDkDAAhCwcAAK4SACAgAACtEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAApQcCvwZAAAAAAZ0HAQAAAAGjBwAAAKMHAqUHAQAAAAELBwAArhIAID0AAK8SACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABowcAAACjBwKlBwEAAAABpgcBAAAAAQIAAACAAgAgZgAA-xcAIAMAAACAAgAgZgAA-xcAIGcAAPoXACABXwAA3xkAMAIAAACAAgAgXwAA-hcAIAIAAACFEwAgXwAA-RcAIAmFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAIb0GAACpEqUHIr8GQAD7DAAhowcAAKgSowcipQcBAOQMACGmBwEA5AwAIQsHAACrEgAgPQAArBIAIIUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAhvQYAAKkSpQcivwZAAPsMACGjBwAAqBKjByKlBwEA5AwAIaYHAQDkDAAhCwcAAK4SACA9AACvEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAApQcCvwZAAAAAAaMHAAAAowcCpQcBAAAAAaYHAQAAAAEVEAAAhg8AIBkAAIgNACAeAACEDQAgHwAAhQ0AICAAAIYNACAhAACJDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAECAAAAXwAgZgAAhBgAIAMAAABfACBmAACEGAAgZwAAgxgAIAFfAADeGQAwAgAAAF8AIF8AAIMYACACAAAA9wwAIF8AAIIYACAPhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhrwYBAOQMACGxBgEA5AwAIb0GAAD6DJsHIr8GQAD7DAAhmQcAAPkMmQcimwcBAOMMACGcBwEA4wwAIZ0HAQDjDAAhngcBAOQMACGfBwEA5AwAIaAHAQDkDAAhoQdAAOUMACEVEAAAhA8AIBkAAIENACAeAAD9DAAgHwAA_gwAICAAAP8MACAhAACCDQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhrwYBAOQMACGxBgEA5AwAIb0GAAD6DJsHIr8GQAD7DAAhmQcAAPkMmQcimwcBAOMMACGcBwEA4wwAIZ0HAQDjDAAhngcBAOQMACGfBwEA5AwAIaAHAQDkDAAhoQdAAOUMACEVEAAAhg8AIBkAAIgNACAeAACEDQAgHwAAhQ0AICAAAIYNACAhAACJDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAEVEAAAhg8AIBgAAIcNACAZAACIDQAgHgAAhA0AIB8AAIUNACAhAACJDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAECAAAAXwAgZgAAjRgAIAMAAABfACBmAACNGAAgZwAAjBgAIAFfAADdGQAwAgAAAF8AIF8AAIwYACACAAAA9wwAIF8AAIsYACAPhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhrwYBAOQMACGxBgEA5AwAIb0GAAD6DJsHIr8GQAD7DAAhwgYBAOQMACGZBwAA-QyZByKbBwEA4wwAIZwHAQDjDAAhngcBAOQMACGfBwEA5AwAIaAHAQDkDAAhoQdAAOUMACEVEAAAhA8AIBgAAIANACAZAACBDQAgHgAA_QwAIB8AAP4MACAhAACCDQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhrwYBAOQMACGxBgEA5AwAIb0GAAD6DJsHIr8GQAD7DAAhwgYBAOQMACGZBwAA-QyZByKbBwEA4wwAIZwHAQDjDAAhngcBAOQMACGfBwEA5AwAIaAHAQDkDAAhoQdAAOUMACEVEAAAhg8AIBgAAIcNACAZAACIDQAgHgAAhA0AIB8AAIUNACAhAACJDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAEFhQYBAAAAAY0GQAAAAAGOBkAAAAABxQcBAAAAAcYHQAAAAAECAAAAuAIAIGYAAJkYACADAAAAuAIAIGYAAJkYACBnAACYGAAgAV8AANwZADAKAwAA3QoAIIIGAACADAAwgwYAALYCABCEBgAAgAwAMIUGAQAAAAGMBgEAAAABjQZAANwKACGOBkAA3AoAIcUHAQDYCgAhxgdAANwKACECAAAAuAIAIF8AAJgYACACAAAAlhgAIF8AAJcYACAJggYAAJUYADCDBgAAlhgAEIQGAACVGAAwhQYBANgKACGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHFBwEA2AoAIcYHQADcCgAhCYIGAACVGAAwgwYAAJYYABCEBgAAlRgAMIUGAQDYCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAhxQcBANgKACHGB0AA3AoAIQWFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHFBwEA4wwAIcYHQADlDAAhBYUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIcUHAQDjDAAhxgdAAOUMACEFhQYBAAAAAY0GQAAAAAGOBkAAAAABxQcBAAAAAcYHQAAAAAEIhQYBAAAAAY0GQAAAAAGOBkAAAAABmwYBAAAAAZwGAQAAAAGhBoAAAAABowYgAAAAAd0GAADWDwAgAgAAALQIACBmAACaGAAgAwAAALQCACBmAACaGAAgZwAAnhgAIAoAAAC0AgAgXwAAnhgAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIZsGAQDjDAAhnAYBAOMMACGhBoAAAAABowYgAMUOACHdBgAA1A8AIAiFBgEA4wwAIY0GQADlDAAhjgZAAOUMACGbBgEA4wwAIZwGAQDjDAAhoQaAAAAAAaMGIADFDgAh3QYAANQPACAOFgAArQ8AIBcAAK4PACAZAADQDwAghQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHcBgEAAAABAgAAAE8AIGYAAKcYACADAAAATwAgZgAApxgAIGcAAKYYACABXwAA2xkAMAIAAABPACBfAACmGAAgAgAAAKUPACBfAAClGAAgC4UGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbEGAQDkDAAhuwYBAOQMACG9BgAApw_cBiK-BgEA5AwAIb8GQAD7DAAhwAZAAOUMACHBBgEA4wwAIdwGAQDjDAAhDhYAAKkPACAXAACqDwAgGQAAzw8AIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbEGAQDkDAAhuwYBAOQMACG9BgAApw_cBiK-BgEA5AwAIb8GQAD7DAAhwAZAAOUMACHBBgEA4wwAIdwGAQDjDAAhDhYAAK0PACAXAACuDwAgGQAA0A8AIIUGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG7BgEAAAABvQYAAADcBgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAAB3AYBAAAAAQ4WAACtDwAgGAAArw8AIBkAANAPACCFBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABuwYBAAAAAb0GAAAA3AYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAECAAAATwAgZgAAsBgAIAMAAABPACBmAACwGAAgZwAArxgAIAFfAADaGQAwAgAAAE8AIF8AAK8YACACAAAApQ8AIF8AAK4YACALhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhsQYBAOQMACG7BgEA5AwAIb0GAACnD9wGIr4GAQDkDAAhvwZAAPsMACHABkAA5QwAIcEGAQDjDAAhwgYBAOQMACEOFgAAqQ8AIBgAAKsPACAZAADPDwAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhsQYBAOQMACG7BgEA5AwAIb0GAACnD9wGIr4GAQDkDAAhvwZAAPsMACHABkAA5QwAIcEGAQDjDAAhwgYBAOQMACEOFgAArQ8AIBgAAK8PACAZAADQDwAghQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABDIUGAQAAAAGNBkAAAAABjgZAAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgAAxw4AIKAGAADIDgAgoQaAAAAAAaIGgAAAAAGjBiAAAAABAgAAAJQKACBmAACxGAAgAwAAALACACBmAACxGAAgZwAAtRgAIA4AAACwAgAgXwAAtRgAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIZsGAQDjDAAhnAYBAOMMACGdBgEA4wwAIZ4GAQDkDAAhnwYAAMMOACCgBgAAxA4AIKEGgAAAAAGiBoAAAAABowYgAMUOACEMhQYBAOMMACGNBkAA5QwAIY4GQADlDAAhmwYBAOMMACGcBgEA4wwAIZ0GAQDjDAAhngYBAOQMACGfBgAAww4AIKAGAADEDgAgoQaAAAAAAaIGgAAAAAGjBiAAxQ4AIRIHAACyDQAgCQAAsw0AIBAAAN4OACAWAACvDQAgMwAAsA0AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABmgYBAAAAAa8GAQAAAAG7BgEAAAABvQYAAAC9BgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABAgAAAKUBACBmAAC-GAAgAwAAAKUBACBmAAC-GAAgZwAAvRgAIAFfAADZGQAwAgAAAKUBACBfAAC9GAAgAgAAAKUNACBfAAC8GAAgDYUGAQDjDAAhigYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACGaBgEA4wwAIa8GAQDkDAAhuwYBAOQMACG9BgAApw29BiK-BgEA5AwAIb8GQAD7DAAhwAZAAOUMACHBBgEA4wwAIRIHAACsDQAgCQAArQ0AIBAAAN0OACAWAACpDQAgMwAAqg0AIIUGAQDjDAAhigYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACGaBgEA4wwAIa8GAQDkDAAhuwYBAOQMACG9BgAApw29BiK-BgEA5AwAIb8GQAD7DAAhwAZAAOUMACHBBgEA4wwAIRIHAACyDQAgCQAAsw0AIBAAAN4OACAWAACvDQAgMwAAsA0AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABmgYBAAAAAa8GAQAAAAG7BgEAAAABvQYAAAC9BgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABEgcAALINACAJAACzDQAgEAAA3g4AIBYAAK8NACAYAACxDQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAECAAAApQEAIGYAAMcYACADAAAApQEAIGYAAMcYACBnAADGGAAgAV8AANgZADACAAAApQEAIF8AAMYYACACAAAApQ0AIF8AAMUYACANhQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhuwYBAOQMACG9BgAApw29BiK-BgEA5AwAIb8GQAD7DAAhwAZAAOUMACHBBgEA4wwAIcIGAQDkDAAhEgcAAKwNACAJAACtDQAgEAAA3Q4AIBYAAKkNACAYAACrDQAghQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIa8GAQDkDAAhuwYBAOQMACG9BgAApw29BiK-BgEA5AwAIb8GQAD7DAAhwAZAAOUMACHBBgEA4wwAIcIGAQDkDAAhEgcAALINACAJAACzDQAgEAAA3g4AIBYAAK8NACAYAACxDQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAEdBwAAyxIAIDwAAMkSACA_AADMEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGnBwEAAAABqAcBAAAAAakHAQAAAAGrBwAAAKsHA6wHAQAAAAGtBwAAANMGA64HEAAAAAGvBwEAAAABsAcCAAAAAbEHAAAA-gYCsgcBAAAAAbMHAQAAAAG0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAeAAAAAAbkHQAAAAAG7BwEAAAABAgAAANcBACBmAADQGAAgAwAAANcBACBmAADQGAAgZwAAzxgAIAFfAADXGQAwAgAAANcBACBfAADPGAAgAgAAAP8TACBfAADOGAAgGoUGAQDjDAAhigYBAOQMACGNBkAA5QwAIY4GQADlDAAhvQYAALgSuwcivwZAAPsMACHkBgEA5AwAIacHAQDjDAAhqAcBAOMMACGpBwEA5AwAIasHAAC1EqsHI6wHAQDkDAAhrQcAALYS0wYjrgcQALcSACGvBwEA4wwAIbAHAgCZEAAhsQcAAN0R-gYisgcBAOQMACGzBwEA5AwAIbQHAQDkDAAhtQcBAOQMACG2BwEA5AwAIbcHAQDkDAAhuAeAAAAAAbkHQAD7DAAhuwcBAOQMACEdBwAAuxIAIDwAALkSACA_AAC8EgAghQYBAOMMACGKBgEA5AwAIY0GQADlDAAhjgZAAOUMACG9BgAAuBK7ByK_BkAA-wwAIeQGAQDkDAAhpwcBAOMMACGoBwEA4wwAIakHAQDkDAAhqwcAALUSqwcjrAcBAOQMACGtBwAAthLTBiOuBxAAtxIAIa8HAQDjDAAhsAcCAJkQACGxBwAA3RH6BiKyBwEA5AwAIbMHAQDkDAAhtAcBAOQMACG1BwEA5AwAIbYHAQDkDAAhtwcBAOQMACG4B4AAAAABuQdAAPsMACG7BwEA5AwAIR0HAADLEgAgPAAAyRIAID8AAMwSACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAC7BwK_BkAAAAAB5AYBAAAAAacHAQAAAAGoBwEAAAABqQcBAAAAAasHAAAAqwcDrAcBAAAAAa0HAAAA0wYDrgcQAAAAAa8HAQAAAAGwBwIAAAABsQcAAAD6BgKyBwEAAAABswcBAAAAAbQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4B4AAAAABuQdAAAAAAbsHAQAAAAEdBwAAyxIAID0AAMoSACA_AADMEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABqAcBAAAAAakHAQAAAAGrBwAAAKsHA6wHAQAAAAGtBwAAANMGA64HEAAAAAGvBwEAAAABsAcCAAAAAbEHAAAA-gYCsgcBAAAAAbMHAQAAAAG0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAeAAAAAAbkHQAAAAAG7BwEAAAABAgAAANcBACBmAADZGAAgAwAAANcBACBmAADZGAAgZwAA2BgAIAFfAADWGQAwAgAAANcBACBfAADYGAAgAgAAAP8TACBfAADXGAAgGoUGAQDjDAAhigYBAOQMACGNBkAA5QwAIY4GQADlDAAhvQYAALgSuwcivwZAAPsMACHkBgEA5AwAIaYHAQDkDAAhqAcBAOMMACGpBwEA5AwAIasHAAC1EqsHI6wHAQDkDAAhrQcAALYS0wYjrgcQALcSACGvBwEA4wwAIbAHAgCZEAAhsQcAAN0R-gYisgcBAOQMACGzBwEA5AwAIbQHAQDkDAAhtQcBAOQMACG2BwEA5AwAIbcHAQDkDAAhuAeAAAAAAbkHQAD7DAAhuwcBAOQMACEdBwAAuxIAID0AALoSACA_AAC8EgAghQYBAOMMACGKBgEA5AwAIY0GQADlDAAhjgZAAOUMACG9BgAAuBK7ByK_BkAA-wwAIeQGAQDkDAAhpgcBAOQMACGoBwEA4wwAIakHAQDkDAAhqwcAALUSqwcjrAcBAOQMACGtBwAAthLTBiOuBxAAtxIAIa8HAQDjDAAhsAcCAJkQACGxBwAA3RH6BiKyBwEA5AwAIbMHAQDkDAAhtAcBAOQMACG1BwEA5AwAIbYHAQDkDAAhtwcBAOQMACG4B4AAAAABuQdAAPsMACG7BwEA5AwAIR0HAADLEgAgPQAAyhIAID8AAMwSACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAC7BwK_BkAAAAAB5AYBAAAAAaYHAQAAAAGoBwEAAAABqQcBAAAAAasHAAAAqwcDrAcBAAAAAa0HAAAA0wYDrgcQAAAAAa8HAQAAAAGwBwIAAAABsQcAAAD6BgKyBwEAAAABswcBAAAAAbQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4B4AAAAABuQdAAAAAAbsHAQAAAAEOBwAAxA8AIAkAAMUPACANAADHDwAgEwAAyA8AIBoAAMkPACAcAADKDwAgIgAAyw8AIIUGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAECAAAAnwEAIGYAAOIYACADAAAAnwEAIGYAAOIYACBnAADhGAAgAV8AANUZADACAAAAnwEAIF8AAOEYACACAAAAnRQAIF8AAOAYACAHhQYBAOMMACGJBgEA5AwAIYoGAQDkDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAh2gYBAOMMACEOBwAA9A4AIAkAAPUOACANAAD3DgAgEwAA-A4AIBoAAPkOACAcAAD6DgAgIgAA-w4AIIUGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIdoGAQDjDAAhDgcAAMQPACAJAADFDwAgDQAAxw8AIBMAAMgPACAaAADJDwAgHAAAyg8AICIAAMsPACCFBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHaBgEAAAABEQcAALcOACAJAAC-DgAgDQAAuA4AIBEAALkOACAiAAC9DgAgJAAAug4AIEsAALsOACBMAAC8DgAghQYBAAAAAYYGAQAAAAGHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABAgAAABAAIGYAAOsYACADAAAAEAAgZgAA6xgAIGcAAOoYACABXwAA1BkAMAIAAAAQACBfAADqGAAgAgAAAKkUACBfAADpGAAgCYUGAQDjDAAhhgYBAOMMACGHBgEA4wwAIYgGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIREHAADmDAAgCQAA7QwAIA0AAOcMACARAADoDAAgIgAA7AwAICQAAOkMACBLAADqDAAgTAAA6wwAIIUGAQDjDAAhhgYBAOMMACGHBgEA4wwAIYgGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIREHAAC3DgAgCQAAvg4AIA0AALgOACARAAC5DgAgIgAAvQ4AICQAALoOACBLAAC7DgAgTAAAvA4AIIUGAQAAAAGGBgEAAAABhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAQYHAAD2GAAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAZUHAAAA4QcCAgAAAAEAIGYAAPUYACADAAAAAQAgZgAA9RgAIGcAAPMYACABXwAA0xkAMAIAAAABACBfAADzGAAgAgAAALUUACBfAADyGAAgBYUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAhlQcAALcU4QciBgcAAPQYACCFBgEA4wwAIYoGAQDjDAAhjQZAAOUMACGOBkAA5QwAIZUHAAC3FOEHIgVmAADOGQAgZwAA0RkAIOsHAADPGQAg7AcAANAZACDxBwAAgAUAIAYHAAD2GAAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAZUHAAAA4QcCA2YAAM4ZACDrBwAAzxkAIPEHAACABQAgDIUGAQAAAAGNBkAAAAABjgZAAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAcwHAQAAAAHNBwEAAAABzgdAAAAAAc8HQAAAAAHQBwEAAAAB0QcBAAAAAQIAAAAJACBmAACCGQAgAwAAAAkAIGYAAIIZACBnAACBGQAgAV8AAM0ZADARAwAA3QoAIIIGAADdDAAwgwYAAAcAEIQGAADdDAAwhQYBAAAAAYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIckHAQDYCgAhygcBANgKACHLBwEA2QoAIcwHAQDZCgAhzQcBANkKACHOB0AAhAwAIc8HQACEDAAh0AcBANkKACHRBwEA2QoAIQIAAAAJACBfAACBGQAgAgAAAP8YACBfAACAGQAgEIIGAAD-GAAwgwYAAP8YABCEBgAA_hgAMIUGAQDYCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAhyQcBANgKACHKBwEA2AoAIcsHAQDZCgAhzAcBANkKACHNBwEA2QoAIc4HQACEDAAhzwdAAIQMACHQBwEA2QoAIdEHAQDZCgAhEIIGAAD-GAAwgwYAAP8YABCEBgAA_hgAMIUGAQDYCgAhjAYBANgKACGNBkAA3AoAIY4GQADcCgAhyQcBANgKACHKBwEA2AoAIcsHAQDZCgAhzAcBANkKACHNBwEA2QoAIc4HQACEDAAhzwdAAIQMACHQBwEA2QoAIdEHAQDZCgAhDIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIckHAQDjDAAhygcBAOMMACHLBwEA5AwAIcwHAQDkDAAhzQcBAOQMACHOB0AA-wwAIc8HQAD7DAAh0AcBAOQMACHRBwEA5AwAIQyFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHJBwEA4wwAIcoHAQDjDAAhywcBAOQMACHMBwEA5AwAIc0HAQDkDAAhzgdAAPsMACHPB0AA-wwAIdAHAQDkDAAh0QcBAOQMACEMhQYBAAAAAY0GQAAAAAGOBkAAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABzAcBAAAAAc0HAQAAAAHOB0AAAAABzwdAAAAAAdAHAQAAAAHRBwEAAAABB4UGAQAAAAGNBkAAAAABjgZAAAAAAcYHQAAAAAHSBwEAAAAB0wcBAAAAAdQHAQAAAAECAAAABQAgZgAAjhkAIAMAAAAFACBmAACOGQAgZwAAjRkAIAFfAADMGQAwDAMAAN0KACCCBgAA3gwAMIMGAAADABCEBgAA3gwAMIUGAQAAAAGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHGB0AA3AoAIdIHAQAAAAHTBwEA2QoAIdQHAQDZCgAhAgAAAAUAIF8AAI0ZACACAAAAixkAIF8AAIwZACALggYAAIoZADCDBgAAixkAEIQGAACKGQAwhQYBANgKACGMBgEA2AoAIY0GQADcCgAhjgZAANwKACHGB0AA3AoAIdIHAQDYCgAh0wcBANkKACHUBwEA2QoAIQuCBgAAihkAMIMGAACLGQAQhAYAAIoZADCFBgEA2AoAIYwGAQDYCgAhjQZAANwKACGOBkAA3AoAIcYHQADcCgAh0gcBANgKACHTBwEA2QoAIdQHAQDZCgAhB4UGAQDjDAAhjQZAAOUMACGOBkAA5QwAIcYHQADlDAAh0gcBAOMMACHTBwEA5AwAIdQHAQDkDAAhB4UGAQDjDAAhjQZAAOUMACGOBkAA5QwAIcYHQADlDAAh0gcBAOMMACHTBwEA5AwAIdQHAQDkDAAhB4UGAQAAAAGNBkAAAAABjgZAAAAAAcYHQAAAAAHSBwEAAAAB0wcBAAAAAdQHAQAAAAEEZgAAgxkAMOsHAACEGQAw7QcAAIYZACDxBwAAhxkAMARmAAD3GAAw6wcAAPgYADDtBwAA-hgAIPEHAAD7GAAwBGYAAOwYADDrBwAA7RgAMO0HAADvGAAg8QcAALEUADAEZgAA4xgAMOsHAADkGAAw7QcAAOYYACDxBwAApRQAMARmAADaGAAw6wcAANsYADDtBwAA3RgAIPEHAACZFAAwBGYAANEYADDrBwAA0hgAMO0HAADUGAAg8QcAAPsTADAEZgAAyBgAMOsHAADJGAAw7QcAAMsYACDxBwAA-xMAMARmAAC_GAAw6wcAAMAYADDtBwAAwhgAIPEHAAChDQAwBGYAALYYADDrBwAAtxgAMO0HAAC5GAAg8QcAAKENADADZgAAsRgAIOsHAACyGAAg8QcAAJQKACAEZgAAqBgAMOsHAACpGAAw7QcAAKsYACDxBwAAoQ8AMARmAACfGAAw6wcAAKAYADDtBwAAohgAIPEHAAChDwAwA2YAAJoYACDrBwAAmxgAIPEHAAC0CAAgBGYAAI4YADDrBwAAjxgAMO0HAACRGAAg8QcAAJIYADAEZgAAhRgAMOsHAACGGAAw7QcAAIgYACDxBwAA8wwAMARmAAD8FwAw6wcAAP0XADDtBwAA_xcAIPEHAADzDAAwBGYAAPMXADDrBwAA9BcAMO0HAAD2FwAg8QcAAIETADAEZgAA6hcAMOsHAADrFwAw7QcAAO0XACDxBwAAgRMAMARmAADhFwAw6wcAAOIXADDtBwAA5BcAIPEHAACNEwAwBGYAANgXADDrBwAA2RcAMO0HAADbFwAg8QcAAIoSADAAAAIzAADKDgAgngYAAN8MACABFwAAyg4AIAAAAAAABWYAAMcZACBnAADKGQAg6wcAAMgZACDsBwAAyRkAIPEHAAApACADZgAAxxkAIOsHAADIGQAg8QcAACkAIAAAAAQHAADlEQAgQwAAyg4AIEUAALIZACBGAACoGQAgABcHAADlEQAgPAAAyg4AID0AAMoOACA_AACOFwAgigYAAN8MACC_BgAA3wwAIOQGAADfDAAgpgcAAN8MACCpBwAA3wwAIKsHAADfDAAgrAcAAN8MACCtBwAA3wwAIK4HAADfDAAgsAcAAN8MACCyBwAA3wwAILMHAADfDAAgtAcAAN8MACC1BwAA3wwAILYHAADfDAAgtwcAAN8MACC4BwAA3wwAILkHAADfDAAguwcAAN8MACANBwAA5REAIAkAALYZACAKAADEGQAgCwAAjxcAIA4AAL0ZACAPAAC-GQAgEAAAtRkAIBkAALkZACAbAAC4GQAgLAAAwhkAIC0AAMMZACCLBgAA3wwAIPYGAADfDAAgCwMAAMoOACAHAADlEQAgCQAAthkAIA0AAOgQACARAACHFwAgIgAAkhcAICQAAIkXACBLAADXEQAgTAAAixcAIIkGAADfDAAgigYAAN8MACAVCAAAxRkAIAwAAOYQACANAADoEAAgEQAAhxcAIBwAAOoQACAlAADnEAAgJwAA6RAAICoAAI8XACAuAACAFwAgLwAAgRcAIDAAAIMXACAxAACFFwAgMgAAhhcAIDQAANcRACA1AACJFwAgNgAAihcAIDcAAIsXACA4AACSFwAg5AYAAN8MACD1BgAA3wwAIKkHAADfDAAgBRQAANcRACCLBgAA3wwAIPIGAADfDAAg9QYAAN8MACD2BgAA3wwAIAUMAADmEAAgDQAA6BAAIBwAAOoQACAlAADnEAAgJwAA6RAAIAsDAADKDgAgBwAA5REAIAkAALYZACANAADoEAAgEwAAihcAIBoAAMYRACAcAADqEAAgIgAAkhcAIIkGAADfDAAgigYAAN8MACCLBgAA3wwAIAQHAADlEQAgCQAAthkAIBsAALgZACAcAADqEAAgBRQAAMYRACCLBgAA3wwAIPIGAADfDAAg9QYAAN8MACD2BgAA3wwAIAgHAADlEQAgCQAAthkAIA4AAL0ZACAQAAC1GQAgIwAAihcAIIsGAADfDAAgtwYAAN8MACC6BgAA3wwAIAsHAADlEQAgCQAAthkAIA0AAOgQACARAACHFwAgGwAAuBkAICQAAIkXACAmAAC_GQAgiwYAAN8MACDkBgAA3wwAIOUGAADfDAAg5wYAAN8MACAIBwAA5REAIAkAALYZACAKAADEGQAgDQAA6BAAIBEAAIcXACDkBgAA3wwAIPAGAADfDAAg9gYAAN8MACAFBwAA5REAIAkAALYZACAlAADnEAAgiwYAAN8MACDkBgAA3wwAIAgHAADlEQAgCQAAthkAIAsAAI8XACAbAAC4GQAgigYAAN8MACCLBgAA3wwAIOQGAADfDAAg5gYAAN8MACADBwAA5REAICoAAI8XACDeBgAA3wwAIAASBwAA5REAIAkAALYZACAQAAC1GQAgKQAAtBkAIIsGAADfDAAgxAYAAN8MACDFBgAA3wwAIMYGAADfDAAgxwYAAN8MACDIBgAA3wwAIMkGAADfDAAgygYAAN8MACDLBgAA3wwAIMwGAADfDAAgzQYAAN8MACDOBgAA3wwAIM8GAADfDAAg0AYAAN8MACAJBwAA5REAIAkAALYZACANAADoEAAgDwAAgxcAIOQGAADfDAAg7gYAAN8MACDvBgAA3wwAIPAGAADfDAAg8QYAAN8MACAFBwAA5REAIDkAAMYZACCKBgAA3wwAIOQGAADfDAAgqQcAAN8MACAAFgcAALYOACAJAACzDgAgCgAAtA4AIAsAAK0OACAOAACyDgAgDwAAsA4AIBAAAMMPACAZAACxDgAgGwAAtQ4AIC0AAK8OACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABrwYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAECAAAAKQAgZgAAxxkAIAMAAAAnACBmAADHGQAgZwAAyxkAIBgAAAAnACAHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAADBDwAgGQAA_g0AIBsAAIIOACAtAAD8DQAgXwAAyxkAIIUGAQDjDAAhigYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACGtBgEA4wwAIa4GAQDjDAAhrwYBAOMMACGxBgEA4wwAIeYGAQDjDAAh9gYBAOQMACG9B0AA5QwAIRYHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAADBDwAgGQAA_g0AIBsAAIIOACAtAAD8DQAghQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIa0GAQDjDAAhrgYBAOMMACGvBgEA4wwAIbEGAQDjDAAh5gYBAOMMACH2BgEA5AwAIb0HQADlDAAhB4UGAQAAAAGNBkAAAAABjgZAAAAAAcYHQAAAAAHSBwEAAAAB0wcBAAAAAdQHAQAAAAEMhQYBAAAAAY0GQAAAAAGOBkAAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABzAcBAAAAAc0HAQAAAAHOB0AAAAABzwdAAAAAAdAHAQAAAAHRBwEAAAABIgwAAPkWACANAADtFgAgEQAA7hYAIBwAAPUWACAlAADoFgAgJwAA9BYAICoAAPoWACAuAADlFgAgLwAA5hYAIDAAAOkWACAxAADrFgAgMgAA7BYAIDQAAPAWACA1AADxFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBHAAD7FgAgSAAA_BYAIEkAAP0WACBKAAD-FgAghQYBAAAAAY0GQAAAAAGOBkAAAAABuQYAAACrBwPeBgEAAAAB5AYBAAAAAakHAQAAAAGsBwEAAAABAgAAAIAFACBmAADOGQAgAwAAABIAIGYAAM4ZACBnAADSGQAgJAAAABIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAgXwAA0hkAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhIgwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEFhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAZUHAAAA4QcCCYUGAQAAAAGGBgEAAAABhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAQeFBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHaBgEAAAABGoUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAALsHAr8GQAAAAAHkBgEAAAABpgcBAAAAAagHAQAAAAGpBwEAAAABqwcAAACrBwOsBwEAAAABrQcAAADTBgOuBxAAAAABrwcBAAAAAbAHAgAAAAGxBwAAAPoGArIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHgAAAAAG5B0AAAAABuwcBAAAAARqFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAC7BwK_BkAAAAAB5AYBAAAAAacHAQAAAAGoBwEAAAABqQcBAAAAAasHAAAAqwcDrAcBAAAAAa0HAAAA0wYDrgcQAAAAAa8HAQAAAAGwBwIAAAABsQcAAAD6BgKyBwEAAAABswcBAAAAAbQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4B4AAAAABuQdAAAAAAbsHAQAAAAENhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAENhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGaBgEAAAABrwYBAAAAAbsGAQAAAAG9BgAAAL0GAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAELhQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABC4UGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG7BgEAAAABvQYAAADcBgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAAB3AYBAAAAAQWFBgEAAAABjQZAAAAAAY4GQAAAAAHFBwEAAAABxgdAAAAAAQ-FBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABsQYBAAAAAb0GAAAAmwcCvwZAAAAAAcIGAQAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABngcBAAAAAZ8HAQAAAAGgBwEAAAABoQdAAAAAAQ-FBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABsQYBAAAAAb0GAAAAmwcCvwZAAAAAAZkHAAAAmQcCmwcBAAAAAZwHAQAAAAGdBwEAAAABngcBAAAAAZ8HAQAAAAGgBwEAAAABoQdAAAAAAQmFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABowcAAACjBwKlBwEAAAABpgcBAAAAAQmFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABnQcBAAAAAaMHAAAAowcCpQcBAAAAAQeFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAbcGAQAAAAGXBwAAAJUHAgOFBgEAAAABkgcBAAAAAZMHQAAAAAEiBQAAkBkAIAYAAJEZACAQAACSGQAgGQAAkxkAIDQAAJYZACBAAACUGQAgTQAAlRkAIE4AAJcZACBPAACYGQAgUAAAmRkAIFEAAJoZACBSAACbGQAgUwAAnBkAIFQAAJ0ZACBVAACeGQAgVgAAnxkAIFcAAKAZACBYAAChGQAgWQAAohkAIIUGAQAAAAGJBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAABlQcBAAAAAdUHAQAAAAHWByAAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAQIAAAD9AgAgZgAA4xkAIAMAAABTACBmAADjGQAgZwAA5xkAICQAAABTACAFAADFFwAgBgAAxhcAIBAAAMcXACAZAADIFwAgNAAAyxcAIEAAAMkXACBNAADKFwAgTgAAzBcAIE8AAM0XACBQAADOFwAgUQAAzxcAIFIAANAXACBTAADRFwAgVAAA0hcAIFUAANMXACBWAADUFwAgVwAA1RcAIFgAANYXACBZAADXFwAgXwAA5xkAIIUGAQDjDAAhiQYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACGVBwEA4wwAIdUHAQDjDAAh1gcgAMUOACHXBwEA5AwAIdgHAQDkDAAh2QcBAOQMACHaBwEA5AwAIdsHAQDkDAAh3AcBAOQMACHdBwEA4wwAISIFAADFFwAgBgAAxhcAIBAAAMcXACAZAADIFwAgNAAAyxcAIEAAAMkXACBNAADKFwAgTgAAzBcAIE8AAM0XACBQAADOFwAgUQAAzxcAIFIAANAXACBTAADRFwAgVAAA0hcAIFUAANMXACBWAADUFwAgVwAA1RcAIFgAANYXACBZAADXFwAghQYBAOMMACGJBgEA5AwAIY0GQADlDAAhjgZAAOUMACHeBgEA4wwAIZUHAQDjDAAh1QcBAOMMACHWByAAxQ4AIdcHAQDkDAAh2AcBAOQMACHZBwEA5AwAIdoHAQDkDAAh2wcBAOQMACHcBwEA5AwAId0HAQDjDAAhIgQAAI8ZACAGAACRGQAgEAAAkhkAIBkAAJMZACA0AACWGQAgQAAAlBkAIE0AAJUZACBOAACXGQAgTwAAmBkAIFAAAJkZACBRAACaGQAgUgAAmxkAIFMAAJwZACBUAACdGQAgVQAAnhkAIFYAAJ8ZACBXAACgGQAgWAAAoRkAIFkAAKIZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAECAAAA_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_RYAIEoAAP4WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAAgAUAIGYAAPIZACADAAAAEgAgZgAA8hkAIGcAAPYZACAkAAAAEgAgBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACBfAAD2GQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEiBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAIQgHAACXFwAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAGpBwEAAAABvAcBAAAAAQIAAAAWACBmAAD3GQAgAwAAABQAIGYAAPcZACBnAAD7GQAgCgAAABQAIAcAAJYXACBfAAD7GQAghQYBAOMMACGKBgEA5AwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIakHAQDkDAAhvAcBAOMMACEIBwAAlhcAIIUGAQDjDAAhigYBAOQMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACGpBwEA5AwAIbwHAQDjDAAhIgYAAOoWACAMAAD5FgAgDQAA7RYAIBEAAO4WACAcAAD1FgAgJQAA6BYAICcAAPQWACAqAAD6FgAgLgAA5RYAIC8AAOYWACAwAADpFgAgMQAA6xYAIDIAAOwWACA0AADwFgAgNQAA8RYAIDYAAPIWACA3AADzFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBHAAD7FgAgSAAA_BYAIEkAAP0WACBKAAD-FgAghQYBAAAAAY0GQAAAAAGOBkAAAAABuQYAAACrBwPeBgEAAAAB5AYBAAAAAakHAQAAAAGsBwEAAAABAgAAAIAFACBmAAD8GQAgAwAAABIAIGYAAPwZACBnAACAGgAgJAAAABIAIAYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAgXwAAgBoAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhIgYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEKhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAHkBgEAAAAB7gYBAAAAAe8GQAAAAAHwBggAAAAB8QYIAAAAASIGAADqFgAgDAAA-RYAIA0AAO0WACARAADuFgAgHAAA9RYAICUAAOgWACAnAAD0FgAgKgAA-hYAIC4AAOUWACAwAADpFgAgMQAA6xYAIDIAAOwWACA0AADwFgAgNQAA8RYAIDYAAPIWACA3AADzFgAgOgAA5BYAIDsAAOcWACA_AAD4FgAgQAAA7xYAIEEAAPYWACBCAAD3FgAgRwAA-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAAghoAIAMAAAASACBmAACCGgAgZwAAhhoAICQAAAASACAGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIF8AAIYaACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAISIGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhBoUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAQmFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfAGAgAAAAH2BgEAAAABvgcBAAAAAb8HAQAAAAEJhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAAB5QYCAAAAAeYGAQAAAAHnBgEAAAABCYUGAQAAAAGGBgEAAAABhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAQeFBgEAAAABiQYBAAAAAYoGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHaBgEAAAABC4UGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB5gYBAAAAAfYGAQAAAAG9B0AAAAABB4UGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAENhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAEKhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGvBgEAAAABtgYBAAAAAbcGAQAAAAG5BgAAALkGAroGQAAAAAEKhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAbAGAQAAAAGxBgEAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQZAAAAAAROFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAcMGAQAAAAHEBggAAAABxQYIAAAAAcYGCAAAAAHHBggAAAAByAYIAAAAAckGCAAAAAHKBggAAAABywYIAAAAAcwGCAAAAAHNBggAAAABzgYIAAAAAc8GCAAAAAHQBggAAAABCYUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAHWBgEAAAAB5gYBAAAAAYgHIAAAAAGQBxAAAAABkQcQAAAAARaFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEKhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA6wYC3gYBAAAAAeQGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAEKhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAcMGAQAAAAHeBgEAAAAB5AYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQ-FBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABsQYBAAAAAb0GAAAAmwcCvwZAAAAAAcIGAQAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ8HAQAAAAGgBwEAAAABoQdAAAAAAQaFBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAABqQcBAAAAAbwHAQAAAAEGhQYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAakHAQAAAAG8BwEAAAABCoUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB5AYBAAAAAe4GAQAAAAHvBkAAAAAB8AYIAAAAAfEGCAAAAAEYCAAAnBcAIAwAAN8WACANAADXFgAgEQAA2BYAIBwAAN4WACAlAADUFgAgJwAA3RYAICoAAOAWACAuAADRFgAgMAAA0xYAIDEAANUWACAyAADWFgAgNAAA2RYAIDUAANoWACA2AADbFgAgNwAA3BYAIDgAAOEWACCFBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB9QYBAAAAAakHAQAAAAG8BwEAAAABAgAAABsAIGYAAJoaACAJhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAeUGAgAAAAHmBgEAAAABAwAAABkAIGYAAJoaACBnAACfGgAgGgAAABkAIAgAAJsXACAMAACyFQAgDQAAqhUAIBEAAKsVACAcAACxFQAgJQAApxUAICcAALAVACAqAACzFQAgLgAApBUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAgXwAAnxoAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh9QYBAOQMACGpBwEA5AwAIbwHAQDjDAAhGAgAAJsXACAMAACyFQAgDQAAqhUAIBEAAKsVACAcAACxFQAgJQAApxUAICcAALAVACAqAACzFQAgLgAApBUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEGhQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAABCoUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABwwYBAAAAAd4GAQAAAAHkBgEAAAAB6wYBAAAAAewGAQAAAAEIhQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAcAHAQAAAAHBBwEAAAABwgcCAAAAAcQHAAAAxAcCCYUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAeUGAgAAAAHmBgEAAAAB5wYBAAAAAQ4HAAC0EQAgCQAAtREAIA0AALMRACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAHkBgEAAAAB7gYBAAAAAe8GQAAAAAHwBggAAAAB8QYIAAAAAQIAAAAgACBmAACkGgAgAwAAAB4AIGYAAKQaACBnAACoGgAgEAAAAB4AIAcAAIERACAJAACCEQAgDQAAgBEAIF8AAKgaACCFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACHkBgEA5AwAIe4GAQDkDAAh7wZAAPsMACHwBggAlA0AIfEGCACUDQAhDgcAAIERACAJAACCEQAgDQAAgBEAIIUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACG2BgEA4wwAIeQGAQDkDAAh7gYBAOQMACHvBkAA-wwAIfAGCACUDQAh8QYIAJQNACEJhQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAAB9gYBAAAAAb4HAQAAAAG_BwEAAAABIgQAAI8ZACAFAACQGQAgEAAAkhkAIBkAAJMZACA0AACWGQAgQAAAlBkAIE0AAJUZACBOAACXGQAgTwAAmBkAIFAAAJkZACBRAACaGQAgUgAAmxkAIFMAAJwZACBUAACdGQAgVQAAnhkAIFYAAJ8ZACBXAACgGQAgWAAAoRkAIFkAAKIZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAECAAAA_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_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAERhQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAD6BgLTBgAAANMGAtUGEAAAAAHWBgEAAAAB1wYCAAAAAfgGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGAB4AAAAABgQdAAAAAAQuFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAANUGAtEGAQAAAAHTBgAAANMGAtUGEAAAAAHWBgEAAAAB1wYCAAAAAdgGQAAAAAHZBkAAAAABCoUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAOsGAt4GAQAAAAHkBgEAAAAB5gYBAAAAAegGAQAAAAHpBgEAAAABCoUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHDBgEAAAAB3gYBAAAAAeQGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAEHhQYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAbcGAQAAAAGWBwEAAAABlwcAAACVBwIJhQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABnQcBAAAAAaMHAAAAowcCpQcBAAAAAaYHAQAAAAEPhQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAEPhQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAEiBgAA6hYAIAwAAPkWACANAADtFgAgEQAA7hYAIBwAAPUWACAlAADoFgAgJwAA9BYAICoAAPoWACAuAADlFgAgLwAA5hYAIDAAAOkWACAxAADrFgAgMgAA7BYAIDQAAPAWACA1AADxFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBBAAD2FgAgQgAA9xYAIEcAAPsWACBIAAD8FgAgSQAA_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_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_QIAIGYAAOIaACAiBgAA6hYAIAwAAPkWACANAADtFgAgEQAA7hYAIBwAAPUWACAlAADoFgAgJwAA9BYAICoAAPoWACAuAADlFgAgLwAA5hYAIDAAAOkWACAxAADrFgAgMgAA7BYAIDQAAPAWACA1AADxFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBIAAD8FgAgSQAA_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_BoAIA0AAADwAQAgBwAAghIAIEMAAIMSACBFAACEEgAgXwAA_BoAIIUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACG3BgEA4wwAIZYHAQDjDAAhlwcAAPwRlQciCwcAAIISACBDAACDEgAgRQAAhBIAIIUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACG3BgEA4wwAIZYHAQDjDAAhlwcAAPwRlQciCQwAAOEQACANAADjEAAgHAAA5RAAICUAAOIQACCFBgEAAAABigYBAAAAAd4GAQAAAAHfBkAAAAAB4AZAAAAAAQIAAACcCAAgZgAA_RoAIAMAAAAwACBmAAD9GgAgZwAAgRsAIAsAAAAwACAMAADbDwAgDQAA3Q8AIBwAAN8PACAlAADcDwAgXwAAgRsAIIUGAQDjDAAhigYBAOMMACHeBgEA4wwAId8GQADlDAAh4AZAAOUMACEJDAAA2w8AIA0AAN0PACAcAADfDwAgJQAA3A8AIIUGAQDjDAAhigYBAOMMACHeBgEA4wwAId8GQADlDAAh4AZAAOUMACEiBgAA6hYAIAwAAPkWACANAADtFgAgEQAA7hYAIBwAAPUWACAlAADoFgAgJwAA9BYAICoAAPoWACAuAADlFgAgLwAA5hYAIDAAAOkWACAxAADrFgAgMgAA7BYAIDQAAPAWACA1AADxFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQgAA9xYAIEcAAPsWACBIAAD8FgAgSQAA_RYAIEoAAP4WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAAgAUAIGYAAIIbACADAAAAEgAgZgAAghsAIGcAAIYbACAkAAAAEgAgBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACBfAACGGwAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEiBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAISIGAADqFgAgDAAA-RYAIA0AAO0WACARAADuFgAgHAAA9RYAICUAAOgWACAnAAD0FgAgKgAA-hYAIC4AAOUWACAvAADmFgAgMAAA6RYAIDEAAOsWACAyAADsFgAgNAAA8BYAIDUAAPEWACA2AADyFgAgNwAA8xYAIDoAAOQWACA7AADnFgAgPwAA-BYAIEAAAO8WACBBAAD2FgAgRwAA-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAAhxsAIAMAAAASACBmAACHGwAgZwAAixsAICQAAAASACAGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIF8AAIsbACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAISIGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhDYUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABmgYBAAAAAa8GAQAAAAG7BgEAAAABvQYAAAC9BgK-BgEAAAABvwZAAAAAAcAGQAAAAAHCBgEAAAABC4UGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG7BgEAAAABvQYAAADcBgK-BgEAAAABvwZAAAAAAcAGQAAAAAHCBgEAAAAB3AYBAAAAARgIAACcFwAgDAAA3xYAIA0AANcWACARAADYFgAgHAAA3hYAICUAANQWACAnAADdFgAgKgAA4BYAIC8AANIWACAwAADTFgAgMQAA1RYAIDIAANYWACA0AADZFgAgNQAA2hYAIDYAANsWACA3AADcFgAgOAAA4RYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGwAgZgAAjhsAICIGAADqFgAgDAAA-RYAIA0AAO0WACARAADuFgAgHAAA9RYAICUAAOgWACAnAAD0FgAgKgAA-hYAIC8AAOYWACAwAADpFgAgMQAA6xYAIDIAAOwWACA0AADwFgAgNQAA8RYAIDYAAPIWACA3AADzFgAgOgAA5BYAIDsAAOcWACA_AAD4FgAgQAAA7xYAIEEAAPYWACBCAAD3FgAgRwAA-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAAkBsAIBgIAACcFwAgDAAA3xYAIA0AANcWACARAADYFgAgHAAA3hYAICUAANQWACAnAADdFgAgKgAA4BYAIC4AANEWACAvAADSFgAgMQAA1RYAIDIAANYWACA0AADZFgAgNQAA2hYAIDYAANsWACA3AADcFgAgOAAA4RYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGwAgZgAAkhsAICIGAADqFgAgDAAA-RYAIA0AAO0WACARAADuFgAgHAAA9RYAICUAAOgWACAnAAD0FgAgKgAA-hYAIC4AAOUWACAvAADmFgAgMQAA6xYAIDIAAOwWACA0AADwFgAgNQAA8RYAIDYAAPIWACA3AADzFgAgOgAA5BYAIDsAAOcWACA_AAD4FgAgQAAA7xYAIEEAAPYWACBCAAD3FgAgRwAA-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAAlBsAIAuFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQeFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGvBgEAAAABAwAAABkAIGYAAJIbACBnAACaGwAgGgAAABkAIAgAAJsXACAMAACyFQAgDQAAqhUAIBEAAKsVACAcAACxFQAgJQAApxUAICcAALAVACAqAACzFQAgLgAApBUAIC8AAKUVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAgXwAAmhsAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh9QYBAOQMACGpBwEA5AwAIbwHAQDjDAAhGAgAAJsXACAMAACyFQAgDQAAqhUAIBEAAKsVACAcAACxFQAgJQAApxUAICcAALAVACAqAACzFQAgLgAApBUAIC8AAKUVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEDAAAAEgAgZgAAlBsAIGcAAJ0bACAkAAAAEgAgBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACBfAACdGwAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEiBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAIQmFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAABvgcBAAAAAb8HAQAAAAELhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB5gYBAAAAAb0HQAAAAAEDAAAAGQAgZgAAjhsAIGcAAKIbACAaAAAAGQAgCAAAmxcAIAwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAvAAClFQAgMAAAphUAIDEAAKgVACAyAACpFQAgNAAArBUAIDUAAK0VACA2AACuFQAgNwAArxUAIDgAALQVACBfAACiGwAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEYCAAAmxcAIAwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAvAAClFQAgMAAAphUAIDEAAKgVACAyAACpFQAgNAAArBUAIDUAAK0VACA2AACuFQAgNwAArxUAIDgAALQVACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfUGAQDkDAAhqQcBAOQMACG8BwEA4wwAIQMAAAASACBmAACQGwAgZwAApRsAICQAAAASACAGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIF8AAKUbACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAISIGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhCQ0AAOMQACAcAADlEAAgJQAA4hAAICcAAOQQACCFBgEAAAABigYBAAAAAd4GAQAAAAHfBkAAAAAB4AZAAAAAAQIAAACcCAAgZgAAphsAIAMAAAAwACBmAACmGwAgZwAAqhsAIAsAAAAwACANAADdDwAgHAAA3w8AICUAANwPACAnAADeDwAgXwAAqhsAIIUGAQDjDAAhigYBAOMMACHeBgEA4wwAId8GQADlDAAh4AZAAOUMACEJDQAA3Q8AIBwAAN8PACAlAADcDwAgJwAA3g8AIIUGAQDjDAAhigYBAOMMACHeBgEA4wwAId8GQADlDAAh4AZAAOUMACEJDAAA4RAAIA0AAOMQACAcAADlEAAgJwAA5BAAIIUGAQAAAAGKBgEAAAAB3gYBAAAAAd8GQAAAAAHgBkAAAAABAgAAAJwIACBmAACrGwAgAwAAADAAIGYAAKsbACBnAACvGwAgCwAAADAAIAwAANsPACANAADdDwAgHAAA3w8AICcAAN4PACBfAACvGwAghQYBAOMMACGKBgEA4wwAId4GAQDjDAAh3wZAAOUMACHgBkAA5QwAIQkMAADbDwAgDQAA3Q8AIBwAAN8PACAnAADeDwAghQYBAOMMACGKBgEA4wwAId4GAQDjDAAh3wZAAOUMACHgBkAA5QwAIRgIAACcFwAgDQAA1xYAIBEAANgWACAcAADeFgAgJQAA1BYAICcAAN0WACAqAADgFgAgLgAA0RYAIC8AANIWACAwAADTFgAgMQAA1RYAIDIAANYWACA0AADZFgAgNQAA2hYAIDYAANsWACA3AADcFgAgOAAA4RYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGwAgZgAAsBsAICIGAADqFgAgDQAA7RYAIBEAAO4WACAcAAD1FgAgJQAA6BYAICcAAPQWACAqAAD6FgAgLgAA5RYAIC8AAOYWACAwAADpFgAgMQAA6xYAIDIAAOwWACA0AADwFgAgNQAA8RYAIDYAAPIWACA3AADzFgAgOgAA5BYAIDsAAOcWACA_AAD4FgAgQAAA7xYAIEEAAPYWACBCAAD3FgAgRwAA-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAAshsAIBYHAAC2DgAgCQAAsw4AIAoAALQOACAOAACyDgAgDwAAsA4AIBAAAMMPACAZAACxDgAgGwAAtQ4AICwAAK4OACAtAACvDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB5gYBAAAAAfYGAQAAAAG9B0AAAAABAgAAACkAIGYAALQbACADAAAAJwAgZgAAtBsAIGcAALgbACAYAAAAJwAgBwAAgw4AIAkAAIAOACAKAACBDgAgDgAA_w0AIA8AAP0NACAQAADBDwAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_A0AIF8AALgbACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrQYBAOMMACGuBgEA4wwAIa8GAQDjDAAhsQYBAOMMACHmBgEA4wwAIfYGAQDkDAAhvQdAAOUMACEWBwAAgw4AIAkAAIAOACAKAACBDgAgDgAA_w0AIA8AAP0NACAQAADBDwAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_A0AIIUGAQDjDAAhigYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACGtBgEA4wwAIa4GAQDjDAAhrwYBAOMMACGxBgEA4wwAIeYGAQDjDAAh9gYBAOQMACG9B0AA5QwAIQqFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAcMGAQAAAAHeBgEAAAAB5AYBAAAAAesGAQAAAAHtBgEAAAABAwAAABkAIGYAALAbACBnAAC8GwAgGgAAABkAIAgAAJsXACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAgXwAAvBsAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh9QYBAOQMACGpBwEA5AwAIbwHAQDjDAAhGAgAAJsXACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEDAAAAEgAgZgAAshsAIGcAAL8bACAkAAAAEgAgBgAA1hIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACBfAAC_GwAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEiBgAA1hIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAIQqFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA6wYC3gYBAAAAAeQGAQAAAAHoBgEAAAAB6QYBAAAAAQkHAADGFgAgCQAA_xQAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAECAAAAmQEAIGYAAMEbACAYCAAAnBcAIAwAAN8WACANAADXFgAgEQAA2BYAIBwAAN4WACAnAADdFgAgKgAA4BYAIC4AANEWACAvAADSFgAgMAAA0xYAIDEAANUWACAyAADWFgAgNAAA2RYAIDUAANoWACA2AADbFgAgNwAA3BYAIDgAAOEWACCFBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB9QYBAAAAAakHAQAAAAG8BwEAAAABAgAAABsAIGYAAMMbACAiBgAA6hYAIAwAAPkWACANAADtFgAgEQAA7hYAIBwAAPUWACAnAAD0FgAgKgAA-hYAIC4AAOUWACAvAADmFgAgMAAA6RYAIDEAAOsWACAyAADsFgAgNAAA8BYAIDUAAPEWACA2AADyFgAgNwAA8xYAIDoAAOQWACA7AADnFgAgPwAA-BYAIEAAAO8WACBBAAD2FgAgQgAA9xYAIEcAAPsWACBIAAD8FgAgSQAA_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_RYAIEoAAP4WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAAgAUAIGYAANcbACAWhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGMBwAAAIwHAo4HAQAAAAGPB0AAAAABAwAAABkAIGYAANUbACBnAADcGwAgGgAAABkAIAgAAJsXACAMAACyFQAgDQAAqhUAIBEAAKsVACAcAACxFQAgJQAApxUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAgXwAA3BsAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh9QYBAOQMACGpBwEA5AwAIbwHAQDjDAAhGAgAAJsXACAMAACyFQAgDQAAqhUAIBEAAKsVACAcAACxFQAgJQAApxUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACA4AAC0FQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEDAAAAEgAgZgAA1xsAIGcAAN8bACAkAAAAEgAgBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACBfAADfGwAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEiBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAIQmFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdYGAQAAAAGIByAAAAABkAcQAAAAAZEHEAAAAAEPAwAAxg8AIAcAAMQPACAJAADFDwAgDQAAxw8AIBMAAMgPACAaAADJDwAgIgAAyw8AIIUGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHaBgEAAAABAgAAAJ8BACBmAADhGwAgAwAAAFUAIGYAAOEbACBnAADlGwAgEQAAAFUAIAMAAPYOACAHAAD0DgAgCQAA9Q4AIA0AAPcOACATAAD4DgAgGgAA-Q4AICIAAPsOACBfAADlGwAghQYBAOMMACGJBgEA5AwAIYoGAQDkDAAhiwYBAOQMACGMBgEA4wwAIY0GQADlDAAhjgZAAOUMACHaBgEA4wwAIQ8DAAD2DgAgBwAA9A4AIAkAAPUOACANAAD3DgAgEwAA-A4AIBoAAPkOACAiAAD7DgAghQYBAOMMACGJBgEA5AwAIYoGAQDkDAAhiwYBAOQMACGMBgEA4wwAIY0GQADlDAAhjgZAAOUMACHaBgEA4wwAIRaFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG9BgAAAI4HAtUGEAAAAAHWBgEAAAAB1wYCAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_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_AAD4FgAgQAAA7xYAIEEAAPYWACBCAAD3FgAgRwAA-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAA9RsAIBIDAAC_DgAgBwAAtw4AIAkAAL4OACARAAC5DgAgIgAAvQ4AICQAALoOACBLAAC7DgAgTAAAvA4AIIUGAQAAAAGGBgEAAAABhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAECAAAAEAAgZgAA9xsAIAMAAAAOACBmAAD3GwAgZwAA-xsAIBQAAAAOACADAADuDAAgBwAA5gwAIAkAAO0MACARAADoDAAgIgAA7AwAICQAAOkMACBLAADqDAAgTAAA6wwAIF8AAPsbACCFBgEA4wwAIYYGAQDjDAAhhwYBAOMMACGIBgEA4wwAIYkGAQDkDAAhigYBAOQMACGLBgEA4wwAIYwGAQDjDAAhjQZAAOUMACGOBkAA5QwAIRIDAADuDAAgBwAA5gwAIAkAAO0MACARAADoDAAgIgAA7AwAICQAAOkMACBLAADqDAAgTAAA6wwAIIUGAQDjDAAhhgYBAOMMACGHBgEA4wwAIYgGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDjDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAhC4UGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAAB5gYBAAAAAfYGAQAAAAG9B0AAAAABCoUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsAYBAAAAAbIGAQAAAAGzBgEAAAABtAYBAAAAAbUGQAAAAAEiBAAAjxkAIAUAAJAZACAGAACRGQAgEAAAkhkAIBkAAJMZACA0AACWGQAgQAAAlBkAIE0AAJUZACBOAACXGQAgTwAAmBkAIFAAAJkZACBSAACbGQAgUwAAnBkAIFQAAJ0ZACBVAACeGQAgVgAAnxkAIFcAAKAZACBYAAChGQAgWQAAohkAIIUGAQAAAAGJBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAABlQcBAAAAAdUHAQAAAAHWByAAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAQIAAAD9AgAgZgAA_hsAICIEAACPGQAgBQAAkBkAIAYAAJEZACAQAACSGQAgGQAAkxkAIDQAAJYZACBAAACUGQAgTQAAlRkAIE4AAJcZACBPAACYGQAgUQAAmhkAIFIAAJsZACBTAACcGQAgVAAAnRkAIFUAAJ4ZACBWAACfGQAgVwAAoBkAIFgAAKEZACBZAACiGQAghQYBAAAAAYkGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAGVBwEAAAAB1QcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAABAgAAAP0CACBmAACAHAAgDIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAfIGAQAAAAHzBgEAAAAB9AYAAMQRACD1BgEAAAAB9gYBAAAAAfcGAQAAAAECAAAAnQcAIGYAAIIcACADAAAAUwAgZgAA_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_RYAIEoAAP4WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAAgAUAIGYAAJQcACADAAAAdgAgZgAAjhwAIGcAAJgcACAPAAAAdgAgBwAA9g8AIAkAAPcPACAbAADwEQAgXwAAmBwAIIUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACHWBgEA4wwAIeYGAQDjDAAhiAcgAMUOACGQBxAA6w4AIZEHEADrDgAhDQcAAPYPACAJAAD3DwAgGwAA8BEAIIUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACHWBgEA4wwAIeYGAQDjDAAhiAcgAMUOACGQBxAA6w4AIZEHEADrDgAhAwAAADAAIGYAAJAcACBnAACbHAAgCwAAADAAIAwAANsPACANAADdDwAgJQAA3A8AICcAAN4PACBfAACbHAAghQYBAOMMACGKBgEA4wwAId4GAQDjDAAh3wZAAOUMACHgBkAA5QwAIQkMAADbDwAgDQAA3Q8AICUAANwPACAnAADeDwAghQYBAOMMACGKBgEA4wwAId4GAQDjDAAh3wZAAOUMACHgBkAA5QwAIQMAAAAZACBmAACSHAAgZwAAnhwAIBoAAAAZACAIAACbFwAgDAAAshUAIA0AAKoVACARAACrFQAgJQAApxUAICcAALAVACAqAACzFQAgLgAApBUAIC8AAKUVACAwAACmFQAgMQAAqBUAIDIAAKkVACA0AACsFQAgNQAArRUAIDYAAK4VACA3AACvFQAgOAAAtBUAIF8AAJ4cACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfUGAQDkDAAhqQcBAOQMACG8BwEA4wwAIRgIAACbFwAgDAAAshUAIA0AAKoVACARAACrFQAgJQAApxUAICcAALAVACAqAACzFQAgLgAApBUAIC8AAKUVACAwAACmFQAgMQAAqBUAIDIAAKkVACA0AACsFQAgNQAArRUAIDYAAK4VACA3AACvFQAgOAAAtBUAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh9QYBAOQMACGpBwEA5AwAIbwHAQDjDAAhAwAAABIAIGYAAJQcACBnAAChHAAgJAAAABIAIAYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAgXwAAoRwAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhIgYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEWhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAI4HAtUGEAAAAAHWBgEAAAAB1wYCAAAAAeYGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_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-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAAtBwAIAMAAADVAQAgZgAAshwAIGcAALgcACAgAAAA1QEAIAcAALsSACA8AAC5EgAgPQAAuhIAIF8AALgcACCFBgEA4wwAIYoGAQDkDAAhjQZAAOUMACGOBkAA5QwAIb0GAAC4ErsHIr8GQAD7DAAh5AYBAOQMACGmBwEA5AwAIacHAQDjDAAhqAcBAOMMACGpBwEA5AwAIasHAAC1EqsHI6wHAQDkDAAhrQcAALYS0wYjrgcQALcSACGvBwEA4wwAIbAHAgCZEAAhsQcAAN0R-gYisgcBAOQMACGzBwEA5AwAIbQHAQDkDAAhtQcBAOQMACG2BwEA5AwAIbcHAQDkDAAhuAeAAAAAAbkHQAD7DAAhuwcBAOQMACEeBwAAuxIAIDwAALkSACA9AAC6EgAghQYBAOMMACGKBgEA5AwAIY0GQADlDAAhjgZAAOUMACG9BgAAuBK7ByK_BkAA-wwAIeQGAQDkDAAhpgcBAOQMACGnBwEA4wwAIagHAQDjDAAhqQcBAOQMACGrBwAAtRKrByOsBwEA5AwAIa0HAAC2EtMGI64HEAC3EgAhrwcBAOMMACGwBwIAmRAAIbEHAADdEfoGIrIHAQDkDAAhswcBAOQMACG0BwEA5AwAIbUHAQDkDAAhtgcBAOQMACG3BwEA5AwAIbgHgAAAAAG5B0AA-wwAIbsHAQDkDAAhAwAAABIAIGYAALQcACBnAAC7HAAgJAAAABIAIAYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAgXwAAuxwAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhIgYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACESAwAAvw4AIAcAALcOACAJAAC-DgAgDQAAuA4AIBEAALkOACAiAAC9DgAgJAAAug4AIEwAALwOACCFBgEAAAABhgYBAAAAAYcGAQAAAAGIBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAABAgAAABAAIGYAALwcACADAAAADgAgZgAAvBwAIGcAAMAcACAUAAAADgAgAwAA7gwAIAcAAOYMACAJAADtDAAgDQAA5wwAIBEAAOgMACAiAADsDAAgJAAA6QwAIEwAAOsMACBfAADAHAAghQYBAOMMACGGBgEA4wwAIYcGAQDjDAAhiAYBAOMMACGJBgEA5AwAIYoGAQDkDAAhiwYBAOMMACGMBgEA4wwAIY0GQADlDAAhjgZAAOUMACESAwAA7gwAIAcAAOYMACAJAADtDAAgDQAA5wwAIBEAAOgMACAiAADsDAAgJAAA6QwAIEwAAOsMACCFBgEA4wwAIYYGAQDjDAAhhwYBAOMMACGIBgEA4wwAIYkGAQDkDAAhigYBAOQMACGLBgEA4wwAIYwGAQDjDAAhjQZAAOUMACGOBkAA5QwAIRIDAAC_DgAgBwAAtw4AIAkAAL4OACANAAC4DgAgEQAAuQ4AICIAAL0OACBLAAC7DgAgTAAAvA4AIIUGAQAAAAGGBgEAAAABhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAECAAAAEAAgZgAAwRwAIAMAAAAOACBmAADBHAAgZwAAxRwAIBQAAAAOACADAADuDAAgBwAA5gwAIAkAAO0MACANAADnDAAgEQAA6AwAICIAAOwMACBLAADqDAAgTAAA6wwAIF8AAMUcACCFBgEA4wwAIYYGAQDjDAAhhwYBAOMMACGIBgEA4wwAIYkGAQDkDAAhigYBAOQMACGLBgEA4wwAIYwGAQDjDAAhjQZAAOUMACGOBkAA5QwAIRIDAADuDAAgBwAA5gwAIAkAAO0MACANAADnDAAgEQAA6AwAICIAAOwMACBLAADqDAAgTAAA6wwAIIUGAQDjDAAhhgYBAOMMACGHBgEA4wwAIYgGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDjDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAhDwcAANgNACAJAADZDQAgDgAA1w0AIBAAANkOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGvBgEAAAABtgYBAAAAAbcGAQAAAAG5BgAAALkGAroGQAAAAAECAAAAQgAgZgAAxhwAIAMAAABAACBmAADGHAAgZwAAyhwAIBEAAABAACAHAADBDQAgCQAAwg0AIA4AAMANACAQAADYDgAgXwAAyhwAIIUGAQDjDAAhigYBAOMMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACGtBgEA4wwAIa8GAQDjDAAhtgYBAOMMACG3BgEA5AwAIbkGAAC-DbkGIroGQAD7DAAhDwcAAMENACAJAADCDQAgDgAAwA0AIBAAANgOACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhrQYBAOMMACGvBgEA4wwAIbYGAQDjDAAhtwYBAOQMACG5BgAAvg25BiK6BkAA-wwAIRIDAAC_DgAgBwAAtw4AIAkAAL4OACANAAC4DgAgIgAAvQ4AICQAALoOACBLAAC7DgAgTAAAvA4AIIUGAQAAAAGGBgEAAAABhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAECAAAAEAAgZgAAyxwAIAMAAAAOACBmAADLHAAgZwAAzxwAIBQAAAAOACADAADuDAAgBwAA5gwAIAkAAO0MACANAADnDAAgIgAA7AwAICQAAOkMACBLAADqDAAgTAAA6wwAIF8AAM8cACCFBgEA4wwAIYYGAQDjDAAhhwYBAOMMACGIBgEA4wwAIYkGAQDkDAAhigYBAOQMACGLBgEA4wwAIYwGAQDjDAAhjQZAAOUMACGOBkAA5QwAIRIDAADuDAAgBwAA5gwAIAkAAO0MACANAADnDAAgIgAA7AwAICQAAOkMACBLAADqDAAgTAAA6wwAIIUGAQDjDAAhhgYBAOMMACGHBgEA4wwAIYgGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDjDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAhIgQAAI8ZACAFAACQGQAgBgAAkRkAIBAAAJIZACAZAACTGQAgNAAAlhkAIEAAAJQZACBNAACVGQAgTgAAlxkAIFAAAJkZACBRAACaGQAgUgAAmxkAIFMAAJwZACBUAACdGQAgVQAAnhkAIFYAAJ8ZACBXAACgGQAgWAAAoRkAIFkAAKIZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAECAAAA_QIAIGYAANAcACADAAAAUwAgZgAA0BwAIGcAANQcACAkAAAAUwAgBAAAxBcAIAUAAMUXACAGAADGFwAgEAAAxxcAIBkAAMgXACA0AADLFwAgQAAAyRcAIE0AAMoXACBOAADMFwAgUAAAzhcAIFEAAM8XACBSAADQFwAgUwAA0RcAIFQAANIXACBVAADTFwAgVgAA1BcAIFcAANUXACBYAADWFwAgWQAA1xcAIF8AANQcACCFBgEA4wwAIYkGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAhlQcBAOMMACHVBwEA4wwAIdYHIADFDgAh1wcBAOQMACHYBwEA5AwAIdkHAQDkDAAh2gcBAOQMACHbBwEA5AwAIdwHAQDkDAAh3QcBAOMMACEiBAAAxBcAIAUAAMUXACAGAADGFwAgEAAAxxcAIBkAAMgXACA0AADLFwAgQAAAyRcAIE0AAMoXACBOAADMFwAgUAAAzhcAIFEAAM8XACBSAADQFwAgUwAA0RcAIFQAANIXACBVAADTFwAgVgAA1BcAIFcAANUXACBYAADWFwAgWQAA1xcAIIUGAQDjDAAhiQYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACGVBwEA4wwAIdUHAQDjDAAh1gcgAMUOACHXBwEA5AwAIdgHAQDkDAAh2QcBAOQMACHaBwEA5AwAIdsHAQDkDAAh3AcBAOQMACHdBwEA4wwAISIEAACPGQAgBQAAkBkAIAYAAJEZACAZAACTGQAgNAAAlhkAIEAAAJQZACBNAACVGQAgTgAAlxkAIE8AAJgZACBQAACZGQAgUQAAmhkAIFIAAJsZACBTAACcGQAgVAAAnRkAIFUAAJ4ZACBWAACfGQAgVwAAoBkAIFgAAKEZACBZAACiGQAghQYBAAAAAYkGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAGVBwEAAAAB1QcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAABAgAAAP0CACBmAADVHAAgGAgAAJwXACAMAADfFgAgDQAA1xYAIBEAANgWACAcAADeFgAgJQAA1BYAICcAAN0WACAqAADgFgAgLgAA0RYAIC8AANIWACAwAADTFgAgMgAA1hYAIDQAANkWACA1AADaFgAgNgAA2xYAIDcAANwWACA4AADhFgAghQYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfUGAQAAAAGpBwEAAAABvAcBAAAAAQIAAAAbACBmAADXHAAgIgYAAOoWACAMAAD5FgAgDQAA7RYAIBEAAO4WACAcAAD1FgAgJQAA6BYAICcAAPQWACAqAAD6FgAgLgAA5RYAIC8AAOYWACAwAADpFgAgMgAA7BYAIDQAAPAWACA1AADxFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBHAAD7FgAgSAAA_BYAIEkAAP0WACBKAAD-FgAghQYBAAAAAY0GQAAAAAGOBkAAAAABuQYAAACrBwPeBgEAAAAB5AYBAAAAAakHAQAAAAGsBwEAAAABAgAAAIAFACBmAADZHAAgIgYAAOoWACAMAAD5FgAgEQAA7hYAIBwAAPUWACAlAADoFgAgJwAA9BYAICoAAPoWACAuAADlFgAgLwAA5hYAIDAAAOkWACAxAADrFgAgMgAA7BYAIDQAAPAWACA1AADxFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBHAAD7FgAgSAAA_BYAIEkAAP0WACBKAAD-FgAghQYBAAAAAY0GQAAAAAGOBkAAAAABuQYAAACrBwPeBgEAAAAB5AYBAAAAAakHAQAAAAGsBwEAAAABAgAAAIAFACBmAADbHAAgCQwAAOEQACAcAADlEAAgJQAA4hAAICcAAOQQACCFBgEAAAABigYBAAAAAd4GAQAAAAHfBkAAAAAB4AZAAAAAAQIAAACcCAAgZgAA3RwAIA4HAAC0EQAgCQAAtREAIA8AALIRACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAHkBgEAAAAB7gYBAAAAAe8GQAAAAAHwBggAAAAB8QYIAAAAAQIAAAAgACBmAADfHAAgGAgAAJwXACAMAADfFgAgEQAA2BYAIBwAAN4WACAlAADUFgAgJwAA3RYAICoAAOAWACAuAADRFgAgLwAA0hYAIDAAANMWACAxAADVFgAgMgAA1hYAIDQAANkWACA1AADaFgAgNgAA2xYAIDcAANwWACA4AADhFgAghQYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfUGAQAAAAGpBwEAAAABvAcBAAAAAQIAAAAbACBmAADhHAAgEAcAAMAQACAJAADBEAAgEQAAvhAAIBsAAPEQACAkAAC_EAAgJgAAwhAAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHlBgIAAAAB5gYBAAAAAecGAQAAAAECAAAAOAAgZgAA4xwAIA8DAADGDwAgBwAAxA8AIAkAAMUPACATAADIDwAgGgAAyQ8AIBwAAMoPACAiAADLDwAghQYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAECAAAAnwEAIGYAAOUcACAOBwAArhEAIAkAAK8RACAKAADGFAAgEQAAsREAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfAGAgAAAAH2BgEAAAABvgcBAAAAAb8HAQAAAAECAAAAJAAgZgAA5xwAIBgIAACcFwAgDAAA3xYAIA0AANcWACARAADYFgAgHAAA3hYAICUAANQWACAnAADdFgAgLgAA0RYAIC8AANIWACAwAADTFgAgMQAA1RYAIDIAANYWACA0AADZFgAgNQAA2hYAIDYAANsWACA3AADcFgAgOAAA4RYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGwAgZgAA6RwAICIGAADqFgAgDAAA-RYAIA0AAO0WACARAADuFgAgHAAA9RYAICUAAOgWACAnAAD0FgAgLgAA5RYAIC8AAOYWACAwAADpFgAgMQAA6xYAIDIAAOwWACA0AADwFgAgNQAA8RYAIDYAAPIWACA3AADzFgAgOgAA5BYAIDsAAOcWACA_AAD4FgAgQAAA7xYAIEEAAPYWACBCAAD3FgAgRwAA-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAA6xwAIAoHAACrFwAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHABwEAAAABwQcBAAAAAcIHAgAAAAHEBwAAAMQHAgIAAADMAQAgZgAA7RwAIA4HAADfEAAgCQAA4BAAIBsAAPYQACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA6wYC3gYBAAAAAeQGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAECAAAANAAgZgAA7xwAIAMAAAAZACBmAADpHAAgZwAA8xwAIBoAAAAZACAIAACbFwAgDAAAshUAIA0AAKoVACARAACrFQAgHAAAsRUAICUAAKcVACAnAACwFQAgLgAApBUAIC8AAKUVACAwAACmFQAgMQAAqBUAIDIAAKkVACA0AACsFQAgNQAArRUAIDYAAK4VACA3AACvFQAgOAAAtBUAIF8AAPMcACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfUGAQDkDAAhqQcBAOQMACG8BwEA4wwAIRgIAACbFwAgDAAAshUAIA0AAKoVACARAACrFQAgHAAAsRUAICUAAKcVACAnAACwFQAgLgAApBUAIC8AAKUVACAwAACmFQAgMQAAqBUAIDIAAKkVACA0AACsFQAgNQAArRUAIDYAAK4VACA3AACvFQAgOAAAtBUAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh9QYBAOQMACGpBwEA5AwAIbwHAQDjDAAhAwAAABIAIGYAAOscACBnAAD2HAAgJAAAABIAIAYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAgXwAA9hwAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhIgYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEkAAOkSACBKAADqEgAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEDAAAAygEAIGYAAO0cACBnAAD5HAAgDAAAAMoBACAHAACqFwAgXwAA-RwAIIUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAh3gYBAOQMACHABwEA4wwAIcEHAQDjDAAhwgcCAOwOACHEBwAA2hTEByIKBwAAqhcAIIUGAQDjDAAhigYBAOMMACGNBkAA5QwAIY4GQADlDAAh3gYBAOQMACHABwEA4wwAIcEHAQDjDAAhwgcCAOwOACHEBwAA2hTEByIDAAAAMgAgZgAA7xwAIGcAAPwcACAQAAAAMgAgBwAA0BAAIAkAANEQACAbAAD1EAAgXwAA_BwAIIUGAQDjDAAhigYBAOQMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACG9BgAAzRDrBiLeBgEA4wwAIeQGAQDkDAAh5gYBAOQMACHoBgEA4wwAIekGAQDjDAAhDgcAANAQACAJAADREAAgGwAA9RAAIIUGAQDjDAAhigYBAOQMACGLBgEA5AwAIY0GQADlDAAhjgZAAOUMACG9BgAAzRDrBiLeBgEA4wwAIeQGAQDkDAAh5gYBAOQMACHoBgEA4wwAIekGAQDjDAAhCoUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAEFhQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADgBwLeB0AAAAABEgMAAL8OACAHAAC3DgAgCQAAvg4AIA0AALgOACARAAC5DgAgIgAAvQ4AICQAALoOACBLAAC7DgAghQYBAAAAAYYGAQAAAAGHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAQIAAAAQACBmAAD_HAAgAwAAAA4AIGYAAP8cACBnAACDHQAgFAAAAA4AIAMAAO4MACAHAADmDAAgCQAA7QwAIA0AAOcMACARAADoDAAgIgAA7AwAICQAAOkMACBLAADqDAAgXwAAgx0AIIUGAQDjDAAhhgYBAOMMACGHBgEA4wwAIYgGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDjDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAhEgMAAO4MACAHAADmDAAgCQAA7QwAIA0AAOcMACARAADoDAAgIgAA7AwAICQAAOkMACBLAADqDAAghQYBAOMMACGGBgEA4wwAIYcGAQDjDAAhiAYBAOMMACGJBgEA5AwAIYoGAQDkDAAhiwYBAOMMACGMBgEA4wwAIY0GQADlDAAhjgZAAOUMACEDAAAAEgAgZgAA2xwAIGcAAIYdACAkAAAAEgAgBgAA1hIAIAwAAOUSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACBfAACGHQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEiBgAA1hIAIAwAAOUSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA2AADeEgAgNwAA3xIAIDoAANASACA7AADTEgAgPwAA5BIAIEAAANsSACBBAADiEgAgQgAA4xIAIEcAAOcSACBIAADoEgAgSQAA6RIAIEoAAOoSACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAIQMAAAAwACBmAADdHAAgZwAAiR0AIAsAAAAwACAMAADbDwAgHAAA3w8AICUAANwPACAnAADeDwAgXwAAiR0AIIUGAQDjDAAhigYBAOMMACHeBgEA4wwAId8GQADlDAAh4AZAAOUMACEJDAAA2w8AIBwAAN8PACAlAADcDwAgJwAA3g8AIIUGAQDjDAAhigYBAOMMACHeBgEA4wwAId8GQADlDAAh4AZAAOUMACEDAAAAHgAgZgAA3xwAIGcAAIwdACAQAAAAHgAgBwAAgREAIAkAAIIRACAPAAD_EAAgXwAAjB0AIIUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACG2BgEA4wwAIeQGAQDkDAAh7gYBAOQMACHvBkAA-wwAIfAGCACUDQAh8QYIAJQNACEOBwAAgREAIAkAAIIRACAPAAD_EAAghQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbYGAQDjDAAh5AYBAOQMACHuBgEA5AwAIe8GQAD7DAAh8AYIAJQNACHxBggAlA0AIQMAAAAZACBmAADhHAAgZwAAjx0AIBoAAAAZACAIAACbFwAgDAAAshUAIBEAAKsVACAcAACxFQAgJQAApxUAICcAALAVACAqAACzFQAgLgAApBUAIC8AAKUVACAwAACmFQAgMQAAqBUAIDIAAKkVACA0AACsFQAgNQAArRUAIDYAAK4VACA3AACvFQAgOAAAtBUAIF8AAI8dACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfUGAQDkDAAhqQcBAOQMACG8BwEA4wwAIRgIAACbFwAgDAAAshUAIBEAAKsVACAcAACxFQAgJQAApxUAICcAALAVACAqAACzFQAgLgAApBUAIC8AAKUVACAwAACmFQAgMQAAqBUAIDIAAKkVACA0AACsFQAgNQAArRUAIDYAAK4VACA3AACvFQAgOAAAtBUAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh9QYBAOQMACGpBwEA5AwAIbwHAQDjDAAhAwAAADYAIGYAAOMcACBnAACSHQAgEgAAADYAIAcAAJ4QACAJAACfEAAgEQAAnBAAIBsAAPAQACAkAACdEAAgJgAAoBAAIF8AAJIdACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACHkBgEA5AwAIeUGAgCZEAAh5gYBAOMMACHnBgEA5AwAIRAHAACeEAAgCQAAnxAAIBEAAJwQACAbAADwEAAgJAAAnRAAICYAAKAQACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACHkBgEA5AwAIeUGAgCZEAAh5gYBAOMMACHnBgEA5AwAIQMAAABVACBmAADlHAAgZwAAlR0AIBEAAABVACADAAD2DgAgBwAA9A4AIAkAAPUOACATAAD4DgAgGgAA-Q4AIBwAAPoOACAiAAD7DgAgXwAAlR0AIIUGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDkDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAh2gYBAOMMACEPAwAA9g4AIAcAAPQOACAJAAD1DgAgEwAA-A4AIBoAAPkOACAcAAD6DgAgIgAA-w4AIIUGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDkDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAh2gYBAOMMACEDAAAAIgAgZgAA5xwAIGcAAJgdACAQAAAAIgAgBwAAlxEAIAkAAJgRACAKAADEFAAgEQAAmhEAIF8AAJgdACCFBgEA4wwAIYoGAQDjDAAhiwYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACHwBgIAmRAAIfYGAQDkDAAhvgcBAOMMACG_BwEA4wwAIQ4HAACXEQAgCQAAmBEAIAoAAMQUACARAACaEQAghQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh8AYCAJkQACH2BgEA5AwAIb4HAQDjDAAhvwcBAOMMACELhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAEYCAAAnBcAIAwAAN8WACANAADXFgAgHAAA3hYAICUAANQWACAnAADdFgAgKgAA4BYAIC4AANEWACAvAADSFgAgMAAA0xYAIDEAANUWACAyAADWFgAgNAAA2RYAIDUAANoWACA2AADbFgAgNwAA3BYAIDgAAOEWACCFBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB9QYBAAAAAakHAQAAAAG8BwEAAAABAgAAABsAIGYAAJodACAiBgAA6hYAIAwAAPkWACANAADtFgAgHAAA9RYAICUAAOgWACAnAAD0FgAgKgAA-hYAIC4AAOUWACAvAADmFgAgMAAA6RYAIDEAAOsWACAyAADsFgAgNAAA8BYAIDUAAPEWACA2AADyFgAgNwAA8xYAIDoAAOQWACA7AADnFgAgPwAA-BYAIEAAAO8WACBBAAD2FgAgQgAA9xYAIEcAAPsWACBIAAD8FgAgSQAA_RYAIEoAAP4WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAAgAUAIGYAAJwdACAOBwAArhEAIAkAAK8RACAKAADGFAAgDQAAsBEAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfAGAgAAAAH2BgEAAAABvgcBAAAAAb8HAQAAAAECAAAAJAAgZgAAnh0AIBAHAADAEAAgCQAAwRAAIA0AAL0QACAbAADxEAAgJAAAvxAAICYAAMIQACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAAB5QYCAAAAAeYGAQAAAAHnBgEAAAABAgAAADgAIGYAAKAdACADAAAAGQAgZgAAmh0AIGcAAKQdACAaAAAAGQAgCAAAmxcAIAwAALIVACANAACqFQAgHAAAsRUAICUAAKcVACAnAACwFQAgKgAAsxUAIC4AAKQVACAvAAClFQAgMAAAphUAIDEAAKgVACAyAACpFQAgNAAArBUAIDUAAK0VACA2AACuFQAgNwAArxUAIDgAALQVACBfAACkHQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEYCAAAmxcAIAwAALIVACANAACqFQAgHAAAsRUAICUAAKcVACAnAACwFQAgKgAAsxUAIC4AAKQVACAvAAClFQAgMAAAphUAIDEAAKgVACAyAACpFQAgNAAArBUAIDUAAK0VACA2AACuFQAgNwAArxUAIDgAALQVACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfUGAQDkDAAhqQcBAOQMACG8BwEA4wwAIQMAAAASACBmAACcHQAgZwAApx0AICQAAAASACAGAADWEgAgDAAA5RIAIA0AANkSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIF8AAKcdACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAISIGAADWEgAgDAAA5RIAIA0AANkSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhAwAAACIAIGYAAJ4dACBnAACqHQAgEAAAACIAIAcAAJcRACAJAACYEQAgCgAAxBQAIA0AAJkRACBfAACqHQAghQYBAOMMACGKBgEA4wwAIYsGAQDjDAAhjQZAAOUMACGOBkAA5QwAIeQGAQDkDAAh8AYCAJkQACH2BgEA5AwAIb4HAQDjDAAhvwcBAOMMACEOBwAAlxEAIAkAAJgRACAKAADEFAAgDQAAmREAIIUGAQDjDAAhigYBAOMMACGLBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfAGAgCZEAAh9gYBAOQMACG-BwEA4wwAIb8HAQDjDAAhAwAAADYAIGYAAKAdACBnAACtHQAgEgAAADYAIAcAAJ4QACAJAACfEAAgDQAAmxAAIBsAAPAQACAkAACdEAAgJgAAoBAAIF8AAK0dACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACHkBgEA5AwAIeUGAgCZEAAh5gYBAOMMACHnBgEA5AwAIRAHAACeEAAgCQAAnxAAIA0AAJsQACAbAADwEAAgJAAAnRAAICYAAKAQACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACHkBgEA5AwAIeUGAgCZEAAh5gYBAOMMACHnBgEA5AwAIQeFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABGAgAAJwXACAMAADfFgAgDQAA1xYAIBEAANgWACAcAADeFgAgJQAA1BYAICcAAN0WACAqAADgFgAgLgAA0RYAIC8AANIWACAwAADTFgAgMQAA1RYAIDIAANYWACA0AADZFgAgNgAA2xYAIDcAANwWACA4AADhFgAghQYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfUGAQAAAAGpBwEAAAABvAcBAAAAAQIAAAAbACBmAACvHQAgIgYAAOoWACAMAAD5FgAgDQAA7RYAIBEAAO4WACAcAAD1FgAgJQAA6BYAICcAAPQWACAqAAD6FgAgLgAA5RYAIC8AAOYWACAwAADpFgAgMQAA6xYAIDIAAOwWACA0AADwFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBHAAD7FgAgSAAA_BYAIEkAAP0WACBKAAD-FgAghQYBAAAAAY0GQAAAAAGOBkAAAAABuQYAAACrBwPeBgEAAAAB5AYBAAAAAakHAQAAAAGsBwEAAAABAgAAAIAFACBmAACxHQAgEAcAAMAQACAJAADBEAAgDQAAvRAAIBEAAL4QACAbAADxEAAgJgAAwhAAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHlBgIAAAAB5gYBAAAAAecGAQAAAAECAAAAOAAgZgAAsx0AIBgIAACcFwAgDAAA3xYAIA0AANcWACARAADYFgAgHAAA3hYAICUAANQWACAnAADdFgAgKgAA4BYAIC4AANEWACAvAADSFgAgMAAA0xYAIDEAANUWACAyAADWFgAgNAAA2RYAIDUAANoWACA3AADcFgAgOAAA4RYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGwAgZgAAtR0AICIGAADqFgAgDAAA-RYAIA0AAO0WACARAADuFgAgHAAA9RYAICUAAOgWACAnAAD0FgAgKgAA-hYAIC4AAOUWACAvAADmFgAgMAAA6RYAIDEAAOsWACAyAADsFgAgNAAA8BYAIDUAAPEWACA3AADzFgAgOgAA5BYAIDsAAOcWACA_AAD4FgAgQAAA7xYAIEEAAPYWACBCAAD3FgAgRwAA-xYAIEgAAPwWACBJAAD9FgAgSgAA_hYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAACABQAgZgAAtx0AIA8DAADGDwAgBwAAxA8AIAkAAMUPACANAADHDwAgGgAAyQ8AIBwAAMoPACAiAADLDwAghQYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAECAAAAnwEAIGYAALkdACADAAAAGQAgZgAAtR0AIGcAAL0dACAaAAAAGQAgCAAAmxcAIAwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNwAArxUAIDgAALQVACBfAAC9HQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEYCAAAmxcAIAwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNwAArxUAIDgAALQVACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfUGAQDkDAAhqQcBAOQMACG8BwEA4wwAIQMAAAASACBmAAC3HQAgZwAAwB0AICQAAAASACAGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIF8AAMAdACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAISIGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNAAA3BIAIDUAAN0SACA3AADfEgAgOgAA0BIAIDsAANMSACA_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_RYAIEoAAP4WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAAgAUAIGYAANEdACAiBAAAjxkAIAUAAJAZACAGAACRGQAgEAAAkhkAIBkAAJMZACA0AACWGQAgQAAAlBkAIE0AAJUZACBPAACYGQAgUAAAmRkAIFEAAJoZACBSAACbGQAgUwAAnBkAIFQAAJ0ZACBVAACeGQAgVgAAnxkAIFcAAKAZACBYAAChGQAgWQAAohkAIIUGAQAAAAGJBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAABlQcBAAAAAdUHAQAAAAHWByAAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAQIAAAD9AgAgZgAA0x0AICIEAACPGQAgBQAAkBkAIAYAAJEZACAQAACSGQAgGQAAkxkAIEAAAJQZACBNAACVGQAgTgAAlxkAIE8AAJgZACBQAACZGQAgUQAAmhkAIFIAAJsZACBTAACcGQAgVAAAnRkAIFUAAJ4ZACBWAACfGQAgVwAAoBkAIFgAAKEZACBZAACiGQAghQYBAAAAAYkGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAGVBwEAAAAB1QcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAABAgAAAP0CACBmAADVHQAgDIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAfIGAQAAAAHzBgEAAAAB9AYAANURACD1BgEAAAAB9gYBAAAAAfcGAQAAAAECAAAAhAcAIGYAANcdACADAAAAGQAgZgAAzx0AIGcAANsdACAaAAAAGQAgCAAAmxcAIAwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDUAAK0VACA2AACuFQAgNwAArxUAIDgAALQVACBfAADbHQAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEYCAAAmxcAIAwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDUAAK0VACA2AACuFQAgNwAArxUAIDgAALQVACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfUGAQDkDAAhqQcBAOQMACG8BwEA4wwAIQMAAAASACBmAADRHQAgZwAA3h0AICQAAAASACAGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIF8AAN4dACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAISIGAADWEgAgDAAA5RIAIA0AANkSACARAADaEgAgHAAA4RIAICUAANQSACAnAADgEgAgKgAA5hIAIC4AANESACAvAADSEgAgMAAA1RIAIDEAANcSACAyAADYEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgSgAA6hIAIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhAwAAAFMAIGYAANMdACBnAADhHQAgJAAAAFMAIAQAAMQXACAFAADFFwAgBgAAxhcAIBAAAMcXACAZAADIFwAgNAAAyxcAIEAAAMkXACBNAADKFwAgTwAAzRcAIFAAAM4XACBRAADPFwAgUgAA0BcAIFMAANEXACBUAADSFwAgVQAA0xcAIFYAANQXACBXAADVFwAgWAAA1hcAIFkAANcXACBfAADhHQAghQYBAOMMACGJBgEA5AwAIY0GQADlDAAhjgZAAOUMACHeBgEA4wwAIZUHAQDjDAAh1QcBAOMMACHWByAAxQ4AIdcHAQDkDAAh2AcBAOQMACHZBwEA5AwAIdoHAQDkDAAh2wcBAOQMACHcBwEA5AwAId0HAQDjDAAhIgQAAMQXACAFAADFFwAgBgAAxhcAIBAAAMcXACAZAADIFwAgNAAAyxcAIEAAAMkXACBNAADKFwAgTwAAzRcAIFAAAM4XACBRAADPFwAgUgAA0BcAIFMAANEXACBUAADSFwAgVQAA0xcAIFYAANQXACBXAADVFwAgWAAA1hcAIFkAANcXACCFBgEA4wwAIYkGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAhlQcBAOMMACHVBwEA4wwAIdYHIADFDgAh1wcBAOQMACHYBwEA5AwAIdkHAQDkDAAh2gcBAOQMACHbBwEA5AwAIdwHAQDkDAAh3QcBAOMMACEDAAAAUwAgZgAA1R0AIGcAAOQdACAkAAAAUwAgBAAAxBcAIAUAAMUXACAGAADGFwAgEAAAxxcAIBkAAMgXACBAAADJFwAgTQAAyhcAIE4AAMwXACBPAADNFwAgUAAAzhcAIFEAAM8XACBSAADQFwAgUwAA0RcAIFQAANIXACBVAADTFwAgVgAA1BcAIFcAANUXACBYAADWFwAgWQAA1xcAIF8AAOQdACCFBgEA4wwAIYkGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAhlQcBAOMMACHVBwEA4wwAIdYHIADFDgAh1wcBAOQMACHYBwEA5AwAIdkHAQDkDAAh2gcBAOQMACHbBwEA5AwAIdwHAQDkDAAh3QcBAOMMACEiBAAAxBcAIAUAAMUXACAGAADGFwAgEAAAxxcAIBkAAMgXACBAAADJFwAgTQAAyhcAIE4AAMwXACBPAADNFwAgUAAAzhcAIFEAAM8XACBSAADQFwAgUwAA0RcAIFQAANIXACBVAADTFwAgVgAA1BcAIFcAANUXACBYAADWFwAgWQAA1xcAIIUGAQDjDAAhiQYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACGVBwEA4wwAIdUHAQDjDAAh1gcgAMUOACHXBwEA5AwAIdgHAQDkDAAh2QcBAOQMACHaBwEA5AwAIdsHAQDkDAAh3AcBAOQMACHdBwEA4wwAIQMAAACHBwAgZgAA1x0AIGcAAOcdACAOAAAAhwcAIF8AAOcdACCFBgEA4wwAIYoGAQDjDAAhiwYBAOQMACGNBkAA5QwAIY4GQADlDAAhtgYBAOMMACHyBgEA5AwAIfMGAQDjDAAh9AYAAMoRACD1BgEA5AwAIfYGAQDkDAAh9wYBAOMMACEMhQYBAOMMACGKBgEA4wwAIYsGAQDkDAAhjQZAAOUMACGOBkAA5QwAIbYGAQDjDAAh8gYBAOQMACHzBgEA4wwAIfQGAADKEQAg9QYBAOQMACH2BgEA5AwAIfcGAQDjDAAhDYUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABmgYBAAAAAbsGAQAAAAG9BgAAAL0GAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABGAgAAJwXACAMAADfFgAgDQAA1xYAIBEAANgWACAcAADeFgAgJQAA1BYAICcAAN0WACAqAADgFgAgLgAA0RYAIC8AANIWACAwAADTFgAgMQAA1RYAIDIAANYWACA0AADZFgAgNQAA2hYAIDYAANsWACA4AADhFgAghQYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfUGAQAAAAGpBwEAAAABvAcBAAAAAQIAAAAbACBmAADpHQAgIgYAAOoWACAMAAD5FgAgDQAA7RYAIBEAAO4WACAcAAD1FgAgJQAA6BYAICcAAPQWACAqAAD6FgAgLgAA5RYAIC8AAOYWACAwAADpFgAgMQAA6xYAIDIAAOwWACA0AADwFgAgNQAA8RYAIDYAAPIWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBHAAD7FgAgSAAA_BYAIEkAAP0WACBKAAD-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_QIAIGYAAP8dACAiBgAA6hYAIAwAAPkWACANAADtFgAgEQAA7hYAIBwAAPUWACAlAADoFgAgJwAA9BYAICoAAPoWACAuAADlFgAgLwAA5hYAIDAAAOkWACAxAADrFgAgMgAA7BYAIDQAAPAWACA1AADxFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBHAAD7FgAgSAAA_BYAIEkAAP0WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAAgAUAIGYAAIEeACAiBgAA6hYAIAwAAPkWACANAADtFgAgEQAA7hYAIBwAAPUWACAlAADoFgAgJwAA9BYAICoAAPoWACAuAADlFgAgLwAA5hYAIDAAAOkWACAxAADrFgAgMgAA7BYAIDQAAPAWACA1AADxFgAgNgAA8hYAIDcAAPMWACA6AADkFgAgOwAA5xYAID8AAPgWACBAAADvFgAgQQAA9hYAIEIAAPcWACBHAAD7FgAgSAAA_BYAIEoAAP4WACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAAgAUAIGYAAIMeACADAAAAGQAgZgAA-R0AIGcAAIceACAaAAAAGQAgCAAAmxcAIAwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACBfAACHHgAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAh5AYBAOQMACH1BgEA5AwAIakHAQDkDAAhvAcBAOMMACEYCAAAmxcAIAwAALIVACANAACqFQAgEQAAqxUAIBwAALEVACAlAACnFQAgJwAAsBUAICoAALMVACAuAACkFQAgLwAApRUAIDAAAKYVACAxAACoFQAgMgAAqRUAIDQAAKwVACA1AACtFQAgNgAArhUAIDcAAK8VACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACHkBgEA5AwAIfUGAQDkDAAhqQcBAOQMACG8BwEA4wwAIQMAAABVACBmAAD7HQAgZwAAih4AIBEAAABVACADAAD2DgAgBwAA9A4AIAkAAPUOACANAAD3DgAgEwAA-A4AIBoAAPkOACAcAAD6DgAgXwAAih4AIIUGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDkDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAh2gYBAOMMACEPAwAA9g4AIAcAAPQOACAJAAD1DgAgDQAA9w4AIBMAAPgOACAaAAD5DgAgHAAA-g4AIIUGAQDjDAAhiQYBAOQMACGKBgEA5AwAIYsGAQDkDAAhjAYBAOMMACGNBkAA5QwAIY4GQADlDAAh2gYBAOMMACEDAAAAUwAgZgAA_R0AIGcAAI0eACAkAAAAUwAgBAAAxBcAIAUAAMUXACAGAADGFwAgEAAAxxcAIBkAAMgXACA0AADLFwAgQAAAyRcAIE0AAMoXACBOAADMFwAgTwAAzRcAIFAAAM4XACBRAADPFwAgUgAA0BcAIFMAANEXACBUAADSFwAgVgAA1BcAIFcAANUXACBYAADWFwAgWQAA1xcAIF8AAI0eACCFBgEA4wwAIYkGAQDkDAAhjQZAAOUMACGOBkAA5QwAId4GAQDjDAAhlQcBAOMMACHVBwEA4wwAIdYHIADFDgAh1wcBAOQMACHYBwEA5AwAIdkHAQDkDAAh2gcBAOQMACHbBwEA5AwAIdwHAQDkDAAh3QcBAOMMACEiBAAAxBcAIAUAAMUXACAGAADGFwAgEAAAxxcAIBkAAMgXACA0AADLFwAgQAAAyRcAIE0AAMoXACBOAADMFwAgTwAAzRcAIFAAAM4XACBRAADPFwAgUgAA0BcAIFMAANEXACBUAADSFwAgVgAA1BcAIFcAANUXACBYAADWFwAgWQAA1xcAIIUGAQDjDAAhiQYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACGVBwEA4wwAIdUHAQDjDAAh1gcgAMUOACHXBwEA5AwAIdgHAQDkDAAh2QcBAOQMACHaBwEA5AwAIdsHAQDkDAAh3AcBAOQMACHdBwEA4wwAIQMAAABTACBmAAD_HQAgZwAAkB4AICQAAABTACAEAADEFwAgBQAAxRcAIAYAAMYXACAQAADHFwAgGQAAyBcAIDQAAMsXACBAAADJFwAgTQAAyhcAIE4AAMwXACBPAADNFwAgUAAAzhcAIFEAAM8XACBSAADQFwAgUwAA0RcAIFUAANMXACBWAADUFwAgVwAA1RcAIFgAANYXACBZAADXFwAgXwAAkB4AIIUGAQDjDAAhiQYBAOQMACGNBkAA5QwAIY4GQADlDAAh3gYBAOMMACGVBwEA4wwAIdUHAQDjDAAh1gcgAMUOACHXBwEA5AwAIdgHAQDkDAAh2QcBAOQMACHaBwEA5AwAIdsHAQDkDAAh3AcBAOQMACHdBwEA4wwAISIEAADEFwAgBQAAxRcAIAYAAMYXACAQAADHFwAgGQAAyBcAIDQAAMsXACBAAADJFwAgTQAAyhcAIE4AAMwXACBPAADNFwAgUAAAzhcAIFEAAM8XACBSAADQFwAgUwAA0RcAIFUAANMXACBWAADUFwAgVwAA1RcAIFgAANYXACBZAADXFwAghQYBAOMMACGJBgEA5AwAIY0GQADlDAAhjgZAAOUMACHeBgEA4wwAIZUHAQDjDAAh1QcBAOMMACHWByAAxQ4AIdcHAQDkDAAh2AcBAOQMACHZBwEA5AwAIdoHAQDkDAAh2wcBAOQMACHcBwEA5AwAId0HAQDjDAAhAwAAABIAIGYAAIEeACBnAACTHgAgJAAAABIAIAYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAgXwAAkx4AIIUGAQDjDAAhjQZAAOUMACGOBkAA5QwAIbkGAAC1EqsHI94GAQDjDAAh5AYBAOQMACGpBwEA5AwAIawHAQDkDAAhIgYAANYSACAMAADlEgAgDQAA2RIAIBEAANoSACAcAADhEgAgJQAA1BIAICcAAOASACAqAADmEgAgLgAA0RIAIC8AANISACAwAADVEgAgMQAA1xIAIDIAANgSACA0AADcEgAgNQAA3RIAIDYAAN4SACA3AADfEgAgOgAA0BIAIDsAANMSACA_AADkEgAgQAAA2xIAIEEAAOISACBCAADjEgAgRwAA5xIAIEgAAOgSACBJAADpEgAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEDAAAAEgAgZgAAgx4AIGcAAJYeACAkAAAAEgAgBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEoAAOoSACBfAACWHgAghQYBAOMMACGNBkAA5QwAIY4GQADlDAAhuQYAALUSqwcj3gYBAOMMACHkBgEA5AwAIakHAQDkDAAhrAcBAOQMACEiBgAA1hIAIAwAAOUSACANAADZEgAgEQAA2hIAIBwAAOESACAlAADUEgAgJwAA4BIAICoAAOYSACAuAADREgAgLwAA0hIAIDAAANUSACAxAADXEgAgMgAA2BIAIDQAANwSACA1AADdEgAgNgAA3hIAIDcAAN8SACA6AADQEgAgOwAA0xIAID8AAOQSACBAAADbEgAgQQAA4hIAIEIAAOMSACBHAADnEgAgSAAA6BIAIEoAAOoSACCFBgEA4wwAIY0GQADlDAAhjgZAAOUMACG5BgAAtRKrByPeBgEA4wwAIeQGAQDkDAAhqQcBAOQMACGsBwEA5AwAIQ-FBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACbBwK_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-QBJToXBzvNASI_7QEvQNgBLkHoATFC7AEyR_MBM0iBAjdJgwIaSoQCGgMHGAYVAC05HAgTCB0HDLMBDQ2hAQsRogEQFQAsHLIBFyWcAQ8nsQEYKrQBDC4hCS-aAR0wmwEKMZ0BBTKgARM0pgEpNawBETatARI3sAElOLUBGgUHAAYJAAgNlQELDyUKFQAoBgcABgkACAomCQ0qCxGSARAVACcMBwAGCY4BCAqPAQkLLgwOAA8PAAoQAAUVACYZABMbAA4sigEkLYwBJQUHhQEGCYYBCCgADSkACysAIgUHgAEGCYEBCAsvDBUAIRsxDgYMNQ0NdQsVACAcehclOQ8neRgIBwAGCWwIDToLET4QFQAfGwAOJEMRJm4dBQcABgk_CA4ADw8AChAABQYHAAYJRAgOAA8QAAUVABwjSBIEBwAGCWoIEgARGQATCQMAAgdJBglKCA1LCxNMEhUAGxpQFBxaFyJgGgQWABUXAAIYVAIZVhMCFFEUFQAWARRSAAUHAAYJAAgZABMbAA4dABgFBwAGCQAIFQAZGwAOHFsXARxcAAcQYwUYYQIZYhMeAAYfAAYgAAIhZAgFDWUAE2YAGmcAHGgAImkAASNrAAQHAAYJbwgVAB4lcA8BJXEAAw1yABFzACR0AAUMewANfQAcfwAlfAAnfgABC4IBAAMHAAYVACMqgwEMASqEAQABKQALBAcABgmNAQgQAAUpAAsCC5ABACyRAQACDZMBABGUAQACDZcBAA-WAQAGBwAGCasBCBCqAQUWACoYqQECMwACAhSnASkVACsBFKgBABEMxAEADbwBABG9AQAcwwEAJbkBACfCAQAqxQEALrYBAC-3AQAwuAEAMboBADK7AQA0vgEANb8BADbAAQA3wQEAOMYBAAE5xwEABQfaAQYVADA8AAI92QECP94BLwIHAAY-3wEuAT_gAQABBwAGAQcABgUHAAYVADZDAAJF9wE0RvsBNQFEADMCAwACRAAzAkX8AQBG_QEAAwcABiAAAj2CAgIaBosCAAyZAgANjgIAEY8CAByWAgAliQIAJ5UCACqaAgAuhgIAL4cCADCKAgAxjAIAMo0CADSRAgA1kgIANpMCADeUAgA6hQIAO4gCAD-YAgBAkAIAQpcCAEebAgBInAIASZ0CAEqeAgAGDaUCABGmAgAiqgIAJKcCAEuoAgBMqQIAATMAAgEXAAIBAwACEgTAAgAFwQIABsICABDDAgAZxAIANMcCAEDFAgBNxgIATsgCAFDJAgBRygIAU8sCAFTMAgBVzQIAVs4CAFfPAgBY0AIAWdECAAACAwACBwAGAgMAAgcABgMVAEJsAENtAEQAAAADFQBCbABDbQBEASkACwEpAAsDFQBJbABKbQBLAAAAAxUASWwASm0ASwAAAxUAUGwAUW0AUgAAAAMVAFBsAFFtAFIBAwACAQMAAgMVAFdsAFhtAFkAAAADFQBXbABYbQBZAQMAAgEDAAIDFQBebABfbQBgAAAAAxUAXmwAX20AYAAAAAMVAGZsAGdtAGgAAAADFQBmbABnbQBoAQMAAgEDAAIDFQBtbABubQBvAAAAAxUAbWwAbm0AbwIHAAYJ-gMIAgcABgmABAgDFQB0bAB1bQB2AAAAAxUAdGwAdW0AdgEHAAYBBwAGBRUAe2wAfm0Af-4BAHzvAQB9AAAAAAAFFQB7bAB-bQB_7gEAfO8BAH0DBwAGCQAICqgECQMHAAYJAAgKrgQJBRUAhAFsAIcBbQCIAe4BAIUB7wEAhgEAAAAAAAUVAIQBbACHAW0AiAHuAQCFAe8BAIYBCAcABgnABAgKwQQJDgAPDwAKEAAFGQATGwAOCAcABgnHBAgKyAQJDgAPDwAKEAAFGQATGwAOAxUAjQFsAI4BbQCPAQAAAAMVAI0BbACOAW0AjwEBCNoEBwEI4AQHAxUAlAFsAJUBbQCWAQAAAAMVAJQBbACVAW0AlgEBB_IEBgEH-AQGAxUAmwFsAJwBbQCdAQAAAAMVAJsBbACcAW0AnQEAAAMVAKIBbACjAW0ApAEAAAADFQCiAWwAowFtAKQBAwejBQY8AAI9ogUCAweqBQY8AAI9qQUCBRUAqQFsAKwBbQCtAe4BAKoB7wEAqwEAAAAAAAUVAKkBbACsAW0ArQHuAQCqAe8BAKsBAwcABiAAAj28BQIDBwAGIAACPcIFAgMVALIBbACzAW0AtAEAAAADFQCyAWwAswFtALQBBxDWBQUY1AUCGdUFEx4ABh8ABiAAAiHXBQgHEN8FBRjdBQIZ3gUTHgAGHwAGIAACIeAFCAMVALkBbAC6AW0AuwEAAAADFQC5AWwAugFtALsBAgcABkMAAgIHAAZDAAIDFQDAAWwAwQFtAMIBAAAAAxUAwAFsAMEBbQDCAQFEADMBRAAzAxUAxwFsAMgBbQDJAQAAAAMVAMcBbADIAW0AyQECAwACRAAzAgMAAkQAMwMVAM4BbADPAW0A0AEAAAADFQDOAWwAzwFtANABAwcABgkACBsADgMHAAYJAAgbAA4FFQDVAWwA2AFtANkB7gEA1gHvAQDXAQAAAAAABRUA1QFsANgBbQDZAe4BANYB7wEA1wEFBwAGCQAIGQATGwAOHQAYBQcABgkACBkAExsADh0AGAUVAN4BbADhAW0A4gHuAQDfAe8BAOABAAAAAAAFFQDeAWwA4QFtAOIB7gEA3wHvAQDgAQEHAAYBBwAGAxUA5wFsAOgBbQDpAQAAAAMVAOcBbADoAW0A6QEBBwAGAQcABgUVAO4BbADxAW0A8gHuAQDvAe8BAPABAAAAAAAFFQDuAWwA8QFtAPIB7gEA7wHvAQDwAQAAAxUA9wFsAPgBbQD5AQAAAAMVAPcBbAD4AW0A-QEAAAMVAP4BbAD_AW0AgAIAAAADFQD-AWwA_wFtAIACAgcABgkACAIHAAYJAAgFFQCFAmwAiAJtAIkC7gEAhgLvAQCHAgAAAAAABRUAhQJsAIgCbQCJAu4BAIYC7wEAhwIFB9YHBgnXBwgoAA0pAAsrACIFB90HBgneBwgoAA0pAAsrACIDFQCOAmwAjwJtAJACAAAAAxUAjgJsAI8CbQCQAgMH8QcGCfIHCBvwBw4DB_kHBgn6Bwgb-AcOAxUAlQJsAJYCbQCXAgAAAAMVAJUCbACWAm0AlwIEBwAGCYwICBsADiaNCB0EBwAGCZMICBsADiaUCB0FFQCcAmwAnwJtAKAC7gEAnQLvAQCeAgAAAAAABRUAnAJsAJ8CbQCgAu4BAJ0C7wEAngIAAAMVAKUCbACmAm0ApwIAAAADFQClAmwApgJtAKcCARcAAgEXAAIDFQCsAmwArQJtAK4CAAAAAxUArAJsAK0CbQCuAgQWABUXAAIY1ggCGdcIEwQWABUXAAIY3QgCGd4IEwMVALMCbAC0Am0AtQIAAAADFQCzAmwAtAJtALUCAwMAAgfwCAYJ8QgIAwMAAgf3CAYJ-AgIAxUAugJsALsCbQC8AgAAAAMVALoCbAC7Am0AvAICBwAGPooJLgIHAAY-kAkuBRUAwQJsAMQCbQDFAu4BAMIC7wEAwwIAAAAAAAUVAMECbADEAm0AxQLuAQDCAu8BAMMCBAcABgmiCQgQAAUpAAsEBwAGCagJCBAABSkACwUVAMoCbADNAm0AzgLuAQDLAu8BAMwCAAAAAAAFFQDKAmwAzQJtAM4C7gEAywLvAQDMAgYHAAYJvAkIELsJBRYAKhi6CQIzAAIGBwAGCcQJCBDDCQUWACoYwgkCMwACAxUA0wJsANQCbQDVAgAAAAMVANMCbADUAm0A1QIEBwAGCdYJCA4ADxAABQQHAAYJ3AkIDgAPEAAFAxUA2gJsANsCbQDcAgAAAAMVANoCbADbAm0A3AIEBwAGCe4JCBIAERkAEwQHAAYJ9AkIEgARGQATAxUA4QJsAOICbQDjAgAAAAMVAOECbADiAm0A4wIFBwAGCYYKCA4ADw8AChAABQUHAAYJjAoIDgAPDwAKEAAFAxUA6AJsAOkCbQDqAgAAAAMVAOgCbADpAm0A6gIBMwACATMAAgMVAO8CbADwAm0A8QIAAAADFQDvAmwA8AJtAPECAwMAAge2CgYJAAgDAwACB7wKBgkACAMVAPYCbAD3Am0A-AIAAAADFQD2AmwA9wJtAPgCWgIBW9ICAVzTAgFd1AIBXtUCAWDXAgFh2QI-YtoCP2PcAgFk3gI-Zd8CQGjgAgFp4QIBauICPm7lAkFv5gJFcOcCJHHoAiRy6QIkc-oCJHTrAiR17QIkdu8CPnfwAkZ48gIkefQCPnr1Akd79gIkfPcCJH34Aj5--wJIf_wCTIAB_gICgQH_AgKCAYEDAoMBggMChAGDAwKFAYUDAoYBhwM-hwGIA02IAYoDAokBjAM-igGNA06LAY4DAowBjwMCjQGQAz6OAZMDT48BlANTkAGVAwORAZYDA5IBlwMDkwGYAwOUAZkDA5UBmwMDlgGdAz6XAZ4DVJgBoAMDmQGiAz6aAaMDVZsBpAMDnAGlAwOdAaYDPp4BqQNWnwGqA1qgAasDBKEBrAMEogGtAwSjAa4DBKQBrwMEpQGxAwSmAbMDPqcBtANbqAG2AwSpAbgDPqoBuQNcqwG6AwSsAbsDBK0BvAM-rgG_A12vAcADYbABwgNisQHDA2KyAcYDYrMBxwNitAHIA2K1AcoDYrYBzAM-twHNA2O4Ac8DYrkB0QM-ugHSA2S7AdMDYrwB1ANivQHVAz6-AdgDZb8B2QNpwAHaAzzBAdsDPMIB3AM8wwHdAzzEAd4DPMUB4AM8xgHiAz7HAeMDasgB5QM8yQHnAz7KAegDa8sB6QM8zAHqAzzNAesDPs4B7gNszwHvA3DQAfADHdEB8QMd0gHyAx3TAfMDHdQB9AMd1QH2Ax3WAfgDPtcB-QNx2AH8Ax3ZAf4DPtoB_wNy2wGBBB3cAYIEHd0BgwQ-3gGGBHPfAYcEd-ABiAQi4QGJBCLiAYoEIuMBiwQi5AGMBCLlAY4EIuYBkAQ-5wGRBHjoAZMEIukBlQQ-6gGWBHnrAZcEIuwBmAQi7QGZBD7wAZwEevEBnQSAAfIBngQK8wGfBAr0AaAECvUBoQQK9gGiBAr3AaQECvgBpgQ--QGnBIEB-gGqBAr7AawEPvwBrQSCAf0BrwQK_gGwBAr_AbEEPoACtASDAYECtQSJAYICtgQLgwK3BAuEArgEC4UCuQQLhgK6BAuHArwEC4gCvgQ-iQK_BIoBigLDBAuLAsUEPowCxgSLAY0CyQQLjgLKBAuPAssEPpACzgSMAZECzwSQAZIC0AQIkwLRBAiUAtIECJUC0wQIlgLUBAiXAtYECJgC2AQ-mQLZBJEBmgLcBAibAt4EPpwC3wSSAZ0C4QQIngLiBAifAuMEPqAC5gSTAaEC5wSXAaIC6AQHowLpBAekAuoEB6UC6wQHpgLsBAenAu4EB6gC8AQ-qQLxBJgBqgL0BAerAvYEPqwC9wSZAa0C-QQHrgL6BAevAvsEPrAC_gSaAbEC_wSeAbICgQUGswKCBQa0AoQFBrUChQUGtgKGBQa3AogFBrgCigU-uQKLBZ8BugKNBQa7Ao8FPrwCkAWgAb0CkQUGvgKSBQa_ApMFPsAClgWhAcEClwWlAcICmAUuwwKZBS7EApoFLsUCmwUuxgKcBS7HAp4FLsgCoAU-yQKhBaYBygKlBS7LAqcFPswCqAWnAc0CqwUuzgKsBS7PAq0FPtACsAWoAdECsQWuAdICsgU30wKzBTfUArQFN9UCtQU31gK2BTfXArgFN9gCugU-2QK7Ba8B2gK-BTfbAsAFPtwCwQWwAd0CwwU33gLEBTffAsUFPuACyAWxAeECyQW1AeICygUa4wLLBRrkAswFGuUCzQUa5gLOBRrnAtAFGugC0gU-6QLTBbYB6gLZBRrrAtsFPuwC3AW3Ae0C4QUa7gLiBRrvAuMFPvAC5gW4AfEC5wW8AfIC6AUz8wLpBTP0AuoFM_UC6wUz9gLsBTP3Au4FM_gC8AU--QLxBb0B-gLzBTP7AvUFPvwC9gW-Af0C9wUz_gL4BTP_AvkFPoAD_AW_AYED_QXDAYID_gU0gwP_BTSEA4AGNIUDgQY0hgOCBjSHA4QGNIgDhgY-iQOHBsQBigOJBjSLA4sGPowDjAbFAY0DjQY0jgOOBjSPA48GPpADkgbGAZEDkwbKAZIDlAY1kwOVBjWUA5YGNZUDlwY1lgOYBjWXA5oGNZgDnAY-mQOdBssBmgOfBjWbA6EGPpwDogbMAZ0DowY1ngOkBjWfA6UGPqADqAbNAaEDqQbRAaIDqgYYowOrBhikA6wGGKUDrQYYpgOuBhinA7AGGKgDsgY-qQOzBtIBqgO1BhirA7cGPqwDuAbTAa0DuQYYrgO6BhivA7sGPrADvgbUAbEDvwbaAbIDwAYXswPBBhe0A8IGF7UDwwYXtgPEBhe3A8YGF7gDyAY-uQPJBtsBugPLBhe7A80GPrwDzgbcAb0DzwYXvgPQBhe_A9EGPsAD1AbdAcED1QbjAcID1wYxwwPYBjHEA9oGMcUD2wYxxgPcBjHHA94GMcgD4AY-yQPhBuQBygPjBjHLA-UGPswD5gblAc0D5wYxzgPoBjHPA-kGPtAD7AbmAdED7QbqAdID7gYy0wPvBjLUA_AGMtUD8QYy1gPyBjLXA_QGMtgD9gY-2QP3BusB2gP5BjLbA_sGPtwD_AbsAd0D_QYy3gP-BjLfA_8GPuADggftAeEDgwfzAeIDhQcq4wOGByrkA4kHKuUDigcq5gOLByrnA40HKugDjwc-6QOQB_QB6gOSByrrA5QHPuwDlQf1Ae0Dlgcq7gOXByrvA5gHPvADmwf2AfEDnAf6AfIDngcV8wOfBxX0A6IHFfUDowcV9gOkBxX3A6YHFfgDqAc--QOpB_sB-gOrBxX7A60HPvwDrgf8Af0DrwcV_gOwBxX_A7EHPoAEtAf9AYEEtQeBAoIEtgcJgwS3BwmEBLgHCYUEuQcJhgS6BwmHBLwHCYgEvgc-iQS_B4ICigTBBwmLBMMHPowExAeDAo0ExQcJjgTGBwmPBMcHPpAEygeEApEEyweKApIEzAcMkwTNBwyUBM4HDJUEzwcMlgTQBwyXBNIHDJgE1Ac-mQTVB4sCmgTZBwybBNsHPpwE3AeMAp0E3wcMngTgBwyfBOEHPqAE5AeNAqEE5QeRAqIE5gcNowTnBw2kBOgHDaUE6QcNpgTqBw2nBOwHDagE7gc-qQTvB5ICqgT0Bw2rBPYHPqwE9weTAq0E-wcNrgT8Bw2vBP0HPrAEgAiUArEEgQiYArIEgggPswSDCA-0BIQID7UEhQgPtgSGCA-3BIgID7gEigg-uQSLCJkCugSPCA-7BJEIPrwEkgiaAr0ElQgPvgSWCA-_BJcIPsAEmgibAsEEmwihAsIEnQgOwwSeCA7EBKAIDsUEoQgOxgSiCA7HBKQIDsgEpgg-yQSnCKICygSpCA7LBKsIPswErAijAs0ErQgOzgSuCA7PBK8IPtAEsgikAtEEswioAtIEtQg70wS2CDvUBLgIO9UEuQg71gS6CDvXBLwIO9gEvgg-2QS_CKkC2gTBCDvbBMMIPtwExAiqAt0ExQg73gTGCDvfBMcIPuAEygirAuEEywivAuIEzAgU4wTNCBTkBM4IFOUEzwgU5gTQCBTnBNIIFOgE1Ag-6QTVCLAC6gTZCBTrBNsIPuwE3AixAu0E3wgU7gTgCBTvBOEIPvAE5AiyAvEE5Qi2AvIE5ggT8wTnCBP0BOgIE_UE6QgT9gTqCBP3BOwIE_gE7gg--QTvCLcC-gTzCBP7BPUIPvwE9gi4Av0E-QgT_gT6CBP_BPsIPoAF_gi5AoEF_wi9AoIFgAkvgwWBCS-EBYIJL4UFgwkvhgWECS-HBYYJL4gFiAk-iQWJCb4CigWMCS-LBY4JPowFjwm_Ao0FkQkvjgWSCS-PBZMJPpAFlgnAApEFlwnGApIFmAklkwWZCSWUBZoJJZUFmwkllgWcCSWXBZ4JJZgFoAk-mQWhCccCmgWkCSWbBaYJPpwFpwnIAp0FqQklngWqCSWfBasJPqAFrgnJAqEFrwnPAqIFsAkpowWxCSmkBbIJKaUFswkppgW0CSmnBbYJKagFuAk-qQW5CdACqgW-CSmrBcAJPqwFwQnRAq0FxQkprgXGCSmvBccJPrAFygnSArEFywnWArIFzAkRswXNCRG0Bc4JEbUFzwkRtgXQCRG3BdIJEbgF1Ak-uQXVCdcCugXYCRG7BdoJPrwF2wnYAr0F3QkRvgXeCRG_Bd8JPsAF4gnZAsEF4wndAsIF5AkSwwXlCRLEBeYJEsUF5wkSxgXoCRLHBeoJEsgF7Ak-yQXtCd4CygXwCRLLBfIJPswF8wnfAs0F9QkSzgX2CRLPBfcJPtAF-gngAtEF-wnkAtIF_AkQ0wX9CRDUBf4JENUF_wkQ1gWAChDXBYIKENgFhAo-2QWFCuUC2gWIChDbBYoKPtwFiwrmAt0FjQoQ3gWOChDfBY8KPuAFkgrnAuEFkwrrAuIFlQo64wWWCjrkBZgKOuUFmQo65gWaCjrnBZwKOugFngo-6QWfCuwC6gWhCjrrBaMKPuwFpArtAu0FpQo67gWmCjrvBacKPvAFqgruAvEFqwryAvIFrAoF8wWtCgX0Ba4KBfUFrwoF9gWwCgX3BbIKBfgFtAo--QW1CvMC-gW4CgX7BboKPvwFuwr0Av0FvQoF_gW-CgX_Bb8KPoAGwgr1AoEGwwr5Ag"
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
      status: true,
      requesterRole: true,
      requesterUserId: true,
      institutionId: true
    }
  });
  if (!leaveRequest) {
    throw createHttpError4(404, "Institution leave request not found");
  }
  if (leaveRequest.status !== "PENDING") {
    throw createHttpError4(400, "Only pending leave requests can be reviewed");
  }
  return prisma.$transaction(async (trx) => {
    const reviewedRequest = await trx.institutionLeaveRequest.update({
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
    if (payload.status === "APPROVED") {
      if (leaveRequest.requesterRole === "TEACHER") {
        const teacherProfile = await trx.teacherProfile.findFirst({
          where: {
            userId: leaveRequest.requesterUserId,
            institutionId: leaveRequest.institutionId
          },
          select: {
            id: true
          },
          orderBy: {
            createdAt: "desc"
          }
        });
        if (teacherProfile?.id) {
          await trx.teacherProfile.update({
            where: {
              id: teacherProfile.id
            },
            data: {
              institutionId: null
            }
          });
        }
      }
      if (leaveRequest.requesterRole === "STUDENT") {
        const studentProfile = await trx.studentProfile.findFirst({
          where: {
            userId: leaveRequest.requesterUserId,
            institutionId: leaveRequest.institutionId
          },
          select: {
            id: true
          },
          orderBy: {
            createdAt: "desc"
          }
        });
        if (studentProfile?.id) {
          await trx.studentProfile.update({
            where: {
              id: studentProfile.id
            },
            data: {
              institutionId: null
            }
          });
        }
      }
    }
    return reviewedRequest;
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
