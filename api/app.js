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
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n  requestedTransferRequests            InstitutionTransferRequest[]  @relation("TransferRequestRequesterUser")\n  reviewedTransferRequests             InstitutionTransferRequest[]  @relation("TransferRequestReviewerUser")\n  requestedInstitutionLeaveRequests    InstitutionLeaveRequest[]     @relation("InstitutionLeaveRequestRequester")\n  reviewedInstitutionLeaveRequests     InstitutionLeaveRequest[]     @relation("InstitutionLeaveRequestReviewer")\n  sentNotices                          Notice[]                      @relation("NoticeSenderUser")\n  readNotices                          NoticeRead[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                           Program[]\n  batches                            Batch[]\n  courses                            Course[]\n  sections                           Section[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  transferRequestsAsTargetDepartment InstitutionTransferRequest[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum InstitutionSubscriptionPlan {\n  MONTHLY\n  HALF_YEARLY\n  YEARLY\n}\n\nenum InstitutionSubscriptionPaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionSubscriptionStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionTransferEntityType {\n  STUDENT\n  TEACHER\n}\n\nenum InstitutionTransferStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  CANCELLED\n}\n\nenum InstitutionLeaveRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum NoticeAudienceRole {\n  ADMIN\n  FACULTY\n  DEPARTMENT\n  TEACHER\n  STUDENT\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                                  @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                                @default(now())\n  updatedAt                   DateTime                                @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n  paymentGatewayCredential    InstitutionPaymentGatewayCredential?\n  renewalPayments             InstitutionSubscriptionRenewalPayment[]\n  subscriptions               InstitutionSubscription[]\n  schedules                   Schedule[]\n  routines                    Routine[]\n  notices                     Notice[]\n  leaveRequests               InstitutionLeaveRequest[]\n  sourceTransferRequests      InstitutionTransferRequest[]            @relation("TransferRequestSourceInstitution")\n  targetTransferRequests      InstitutionTransferRequest[]            @relation("TransferRequestTargetInstitution")\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  subscriptionPlan              InstitutionSubscriptionPlan?\n  subscriptionAmount            Decimal?                             @db.Decimal(12, 2)\n  subscriptionCurrency          String                               @default("BDT")\n  subscriptionMonths            Int?\n  subscriptionPaymentStatus     InstitutionSubscriptionPaymentStatus @default(PENDING)\n  subscriptionTranId            String?                              @unique\n  subscriptionGatewayStatus     String?\n  subscriptionGatewaySessionKey String?                              @unique\n  subscriptionGatewayValId      String?\n  subscriptionGatewayBankTranId String?\n  subscriptionGatewayCardType   String?\n  subscriptionGatewayRawPayload Json?\n  subscriptionPaidAt            DateTime?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution?              @relation(fields: [institutionId], references: [id])\n  subscriptions InstitutionSubscription[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel InstitutionLeaveRequest {\n  id String @id @default(uuid())\n\n  requesterUserId String\n  requesterUser   User   @relation("InstitutionLeaveRequestRequester", fields: [requesterUserId], references: [id])\n\n  requesterRole UserRole\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  status InstitutionLeaveRequestStatus @default(PENDING)\n  reason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionLeaveRequestReviewer", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([requesterUserId, status])\n  @@index([institutionId, status])\n  @@map("institution_leave_requests")\n}\n\nmodel InstitutionTransferRequest {\n  id String @id @default(uuid())\n\n  entityType InstitutionTransferEntityType\n  status     InstitutionTransferStatus     @default(PENDING)\n\n  sourceInstitutionId String\n  sourceInstitution   Institution @relation("TransferRequestSourceInstitution", fields: [sourceInstitutionId], references: [id])\n\n  targetInstitutionId String\n  targetInstitution   Institution @relation("TransferRequestTargetInstitution", fields: [targetInstitutionId], references: [id])\n\n  requesterUserId String\n  requesterUser   User   @relation("TransferRequestRequesterUser", fields: [requesterUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TransferRequestReviewerUser", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  targetDepartmentId String?\n  targetDepartment   Department? @relation(fields: [targetDepartmentId], references: [id])\n\n  requestMessage  String?\n  responseMessage String?\n\n  requestedAt DateTime  @default(now())\n  reviewedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceInstitutionId, status])\n  @@index([targetInstitutionId, status])\n  @@index([requesterUserId])\n  @@index([studentProfileId])\n  @@index([teacherProfileId])\n  @@map("institution_transfer_requests")\n}\n\nmodel Notice {\n  id      String @id @default(uuid())\n  title   String\n  content String\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  senderUserId String\n  senderUser   User               @relation("NoticeSenderUser", fields: [senderUserId], references: [id])\n  senderRole   NoticeAudienceRole\n\n  recipients NoticeRecipientRole[]\n  reads      NoticeRead[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, createdAt])\n  @@index([senderUserId, createdAt])\n  @@map("notices")\n}\n\nmodel NoticeRecipientRole {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  role NoticeAudienceRole\n\n  createdAt DateTime @default(now())\n\n  @@unique([noticeId, role])\n  @@index([role])\n  @@map("notice_recipient_roles")\n}\n\nmodel NoticeRead {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  readAt DateTime @default(now())\n\n  @@unique([noticeId, userId])\n  @@index([userId, readAt])\n  @@map("notice_reads")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel InstitutionPaymentGatewayCredential {\n  id                               String      @id @default(uuid())\n  institutionId                    String      @unique\n  institution                      Institution @relation(fields: [institutionId], references: [id])\n  sslCommerzStoreIdEncrypted       String\n  sslCommerzStorePasswordEncrypted String\n  sslCommerzBaseUrlEncrypted       String\n  sslCommerzStoreIdHash            String\n  sslCommerzStorePasswordHash      String\n  sslCommerzBaseUrlHash            String\n  isActive                         Boolean     @default(true)\n  lastUpdatedByUserId              String?\n  createdAt                        DateTime    @default(now())\n  updatedAt                        DateTime    @updatedAt\n\n  @@index([institutionId, isActive])\n  @@map("institution_payment_gateway_credentials")\n}\n\nmodel InstitutionSubscriptionRenewalPayment {\n  id                String                               @id @default(uuid())\n  institutionId     String\n  institution       Institution                          @relation(fields: [institutionId], references: [id])\n  initiatedByUserId String\n  plan              InstitutionSubscriptionPlan\n  amount            Decimal                              @db.Decimal(12, 2)\n  currency          String                               @default("BDT")\n  monthsCovered     Int\n  status            InstitutionSubscriptionPaymentStatus @default(PENDING)\n  tranId            String                               @unique\n  gatewayStatus     String?\n  gatewaySessionKey String?                              @unique\n  gatewayValId      String?\n  gatewayBankTranId String?\n  gatewayCardType   String?\n  gatewayRawPayload Json?\n  paidAt            DateTime?\n  createdAt         DateTime                             @default(now())\n  updatedAt         DateTime                             @updatedAt\n\n  @@index([institutionId, status, createdAt])\n  @@index([initiatedByUserId, status])\n  @@map("institution_subscription_renewal_payments")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  semesterId String?\n  semester   Semester? @relation(fields: [semesterId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  startTime String\n  endTime   String\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@index([semesterId])\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  schedules           Schedule[]\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n  transferRequests      InstitutionTransferRequest[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel InstitutionSubscription {\n  id String @id @default(uuid())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  sourceApplicationId String?\n  sourceApplication   InstitutionApplication? @relation(fields: [sourceApplicationId], references: [id])\n\n  plan          InstitutionSubscriptionPlan\n  status        InstitutionSubscriptionStatus @default(ACTIVE)\n  amount        Decimal                       @db.Decimal(12, 2)\n  currency      String                        @default("BDT")\n  monthsCovered Int\n  startsAt      DateTime\n  endsAt        DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, status, endsAt])\n  @@index([sourceApplicationId])\n  @@map("institution_subscriptions")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n  transferRequests          InstitutionTransferRequest[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
  graph: "mh75AqAFCwMAANcKACAHAACbCwAgggYAANUMADCDBgAACwAQhAYAANUMADCFBgEAAAABigYBANIKACGMBgEAAAABjQZAANYKACGOBkAA1goAIZUHAADWDOEHIgEAAAABACAMAwAA1woAIIIGAADYDAAwgwYAAAMAEIQGAADYDAAwhQYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHGB0AA1goAIdIHAQDSCgAh0wcBANMKACHUBwEA0woAIQMDAADEDgAg0wcAANkMACDUBwAA2QwAIAwDAADXCgAgggYAANgMADCDBgAAAwAQhAYAANgMADCFBgEAAAABjAYBANIKACGNBkAA1goAIY4GQADWCgAhxgdAANYKACHSBwEAAAAB0wcBANMKACHUBwEA0woAIQMAAAADACABAAAEADACAAAFACARAwAA1woAIIIGAADXDAAwgwYAAAcAEIQGAADXDAAwhQYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHJBwEA0goAIcoHAQDSCgAhywcBANMKACHMBwEA0woAIc0HAQDTCgAhzgdAAP4LACHPB0AA_gsAIdAHAQDTCgAh0QcBANMKACEIAwAAxA4AIMsHAADZDAAgzAcAANkMACDNBwAA2QwAIM4HAADZDAAgzwcAANkMACDQBwAA2QwAINEHAADZDAAgEQMAANcKACCCBgAA1wwAMIMGAAAHABCEBgAA1wwAMIUGAQAAAAGMBgEA0goAIY0GQADWCgAhjgZAANYKACHJBwEA0goAIcoHAQDSCgAhywcBANMKACHMBwEA0woAIc0HAQDTCgAhzgdAAP4LACHPB0AA_gsAIdAHAQDTCgAh0QcBANMKACEDAAAABwAgAQAACAAwAgAACQAgCwMAANcKACAHAACbCwAgggYAANUMADCDBgAACwAQhAYAANUMADCFBgEA0goAIYoGAQDSCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAhlQcAANYM4QciAgMAAMQOACAHAADfEQAgAwAAAAsAIAEAAAwAMAIAAAEAIBYDAADXCgAgBwAAmwsAIAkAAKoMACANAACBCwAgEQAA0AsAICIAANsLACAkAADSCwAgSwAAkgsAIEwAANQLACCCBgAA1AwAMIMGAAAOABCEBgAA1AwAMIUGAQDSCgAhhgYBANIKACGHBgEA0goAIYgGAQDSCgAhiQYBANMKACGKBgEA0goAIYsGAQDSCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAhCgMAAMQOACAHAADfEQAgCQAAsBkAIA0AAOIQACARAACBFwAgIgAAjBcAICQAAIMXACBLAADREQAgTAAAhRcAIIkGAADZDAAgFgMAANcKACAHAACbCwAgCQAAqgwAIA0AAIELACARAADQCwAgIgAA2wsAICQAANILACBLAACSCwAgTAAA1AsAIIIGAADUDAAwgwYAAA4AEIQGAADUDAAwhQYBAAAAAYYGAQAAAAGHBgEAAAABiAYBANIKACGJBgEA0woAIYoGAQDSCgAhiwYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACEDAAAADgAgAQAADwAwAgAAEAAgDAcAAJYMACA5AADTDAAgggYAANIMADCDBgAAEgAQhAYAANIMADCFBgEA0goAIYoGAQDTCgAhjQZAANYKACGOBkAA1goAIeQGAQDTCgAhqQcBANMKACG8BwEA0goAIQUHAADfEQAgOQAAwBkAIIoGAADZDAAg5AYAANkMACCpBwAA2QwAIAwHAACWDAAgOQAA0wwAIIIGAADSDAAwgwYAABIAEIQGAADSDAAwhQYBAAAAAYoGAQDTCgAhjQZAANYKACGOBkAA1goAIeQGAQDTCgAhqQcBANMKACG8BwEA0goAIQMAAAASACABAAATADACAAAUACAmBgAAzQsAIAwAAP8KACANAACBCwAgEQAA0AsAIBwAAIMLACAlAACACwAgJwAAggsAICoAANgLACAuAADJCwAgLwAAygsAIDAAAMwLACAxAADOCwAgMgAAzwsAIDQAAJILACA1AADSCwAgNgAA0wsAIDcAANQLACA6AADICwAgOwAAywsAID8AANcLACBAAADRCwAgQQAA1QsAIEIAANYLACBHAADZCwAgSAAA2gsAIEkAANsLACBKAADbCwAgggYAAMYLADCDBgAAFgAQhAYAAMYLADCFBgEA0goAIY0GQADWCgAhjgZAANYKACG5BgAAxwurByPeBgEA0goAIeQGAQDTCgAhqQcBANMKACGsBwEA0woAIQEAAAAWACAcCAAA0QwAIAwAAP8KACANAACBCwAgEQAA0AsAIBwAAIMLACAlAACACwAgJwAAggsAICoAANgLACAuAADJCwAgLwAAygsAIDAAAMwLACAxAADOCwAgMgAAzwsAIDQAAJILACA1AADSCwAgNgAA0wsAIDcAANQLACA4AADbCwAgggYAANAMADCDBgAAGAAQhAYAANAMADCFBgEA0goAIY0GQADWCgAhjgZAANYKACHkBgEA0woAIfUGAQDTCgAhqQcBANMKACG8BwEA0goAIRUIAAC_GQAgDAAA4BAAIA0AAOIQACARAACBFwAgHAAA5BAAICUAAOEQACAnAADjEAAgKgAAiRcAIC4AAPoWACAvAAD7FgAgMAAA_RYAIDEAAP8WACAyAACAFwAgNAAA0REAIDUAAIMXACA2AACEFwAgNwAAhRcAIDgAAIwXACDkBgAA2QwAIPUGAADZDAAgqQcAANkMACAcCAAA0QwAIAwAAP8KACANAACBCwAgEQAA0AsAIBwAAIMLACAlAACACwAgJwAAggsAICoAANgLACAuAADJCwAgLwAAygsAIDAAAMwLACAxAADOCwAgMgAAzwsAIDQAAJILACA1AADSCwAgNgAA0wsAIDcAANQLACA4AADbCwAgggYAANAMADCDBgAAGAAQhAYAANAMADCFBgEAAAABjQZAANYKACGOBkAA1goAIeQGAQDTCgAh9QYBANMKACGpBwEA0woAIbwHAQDSCgAhAwAAABgAIAEAABkAMAIAABoAIAEAAAASACASBwAAmwsAIAkAAKoMACANAACBCwAgDwAAzAsAIIIGAADPDAAwgwYAAB0AEIQGAADPDAAwhQYBANIKACGKBgEA0goAIYsGAQDSCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAh5AYBANMKACHuBgEA0woAIe8GQAD-CwAh8AYIAJoMACHxBggAmgwAIQkHAADfEQAgCQAAsBkAIA0AAOIQACAPAAD9FgAg5AYAANkMACDuBgAA2QwAIO8GAADZDAAg8AYAANkMACDxBgAA2QwAIBIHAACbCwAgCQAAqgwAIA0AAIELACAPAADMCwAgggYAAM8MADCDBgAAHQAQhAYAAM8MADCFBgEAAAABigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACG2BgEA0goAIeQGAQDTCgAh7gYBANMKACHvBkAA_gsAIfAGCACaDAAh8QYIAJoMACEDAAAAHQAgAQAAHgAwAgAAHwAgEgcAAJsLACAJAACqDAAgCgAAzQwAIA0AAIELACARAADQCwAgggYAAM4MADCDBgAAIQAQhAYAAM4MADCFBgEA0goAIYoGAQDSCgAhiwYBANIKACGNBkAA1goAIY4GQADWCgAh5AYBANMKACHwBgIAlAwAIfYGAQDTCgAhvgcBANIKACG_BwEA0goAIQgHAADfEQAgCQAAsBkAIAoAAL4ZACANAADiEAAgEQAAgRcAIOQGAADZDAAg8AYAANkMACD2BgAA2QwAIBIHAACbCwAgCQAAqgwAIAoAAM0MACANAACBCwAgEQAA0AsAIIIGAADODAAwgwYAACEAEIQGAADODAAwhQYBAAAAAYoGAQDSCgAhiwYBANIKACGNBkAA1goAIY4GQADWCgAh5AYBANMKACHwBgIAlAwAIfYGAQDTCgAhvgcBAAAAAb8HAQDSCgAhAwAAACEAIAEAACIAMAIAACMAIAEAAAAdACAaBwAAmwsAIAkAAJ0MACAKAADNDAAgCwAA2AsAIA4AAL4MACAPAADBDAAgEAAAnAwAIBkAALMMACAbAACrDAAgLAAAywwAIC0AAMwMACCCBgAAygwAMIMGAAAmABCEBgAAygwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGtBgEA0goAIa4GAQDSCgAhrwYBANIKACGxBgEA0goAIeYGAQDSCgAh9gYBANMKACG9B0AA1goAIQ0HAADfEQAgCQAAsBkAIAoAAL4ZACALAACJFwAgDgAAtxkAIA8AALgZACAQAACvGQAgGQAAsxkAIBsAALIZACAsAAC8GQAgLQAAvRkAIIsGAADZDAAg9gYAANkMACAaBwAAmwsAIAkAAJ0MACAKAADNDAAgCwAA2AsAIA4AAL4MACAPAADBDAAgEAAAnAwAIBkAALMMACAbAACrDAAgLAAAywwAIC0AAMwMACCCBgAAygwAMIMGAAAmABCEBgAAygwAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa0GAQDSCgAhrgYBANIKACGvBgEA0goAIbEGAQDSCgAh5gYBANIKACH2BgEA0woAIb0HQADWCgAhAwAAACYAIAEAACcAMAIAACgAIBMHAACWDAAgCQAAnQwAICgAAMgMACApAACbDAAgKwAAyQwAIIIGAADHDAAwgwYAACoAEIQGAADHDAAwhQYBANIKACGKBgEA0woAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIcMGAQDSCgAh3gYBANIKACHkBgEA0woAIesGAQDTCgAh7AYBANIKACHtBgEA0goAIQkHAADfEQAgCQAAsBkAICgAALoZACApAACuGQAgKwAAuxkAIIoGAADZDAAgiwYAANkMACDkBgAA2QwAIOsGAADZDAAgEwcAAJYMACAJAACdDAAgKAAAyAwAICkAAJsMACArAADJDAAgggYAAMcMADCDBgAAKgAQhAYAAMcMADCFBgEAAAABigYBANMKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHDBgEA0goAId4GAQDSCgAh5AYBANMKACHrBgEA0woAIewGAQDSCgAh7QYBANIKACEDAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIA0MAAD_CgAgDQAAgQsAIBwAAIMLACAlAACACwAgJwAAggsAIIIGAAD-CgAwgwYAAC8AEIQGAAD-CgAwhQYBANIKACGKBgEA0goAId4GAQDSCgAh3wZAANYKACHgBkAA1goAIQEAAAAvACASBwAAlgwAIAkAAJ0MACALAADYCwAgGwAAxgwAIIIGAADEDAAwgwYAADEAEIQGAADEDAAwhQYBANIKACGKBgEA0woAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIb0GAADFDOsGIt4GAQDSCgAh5AYBANMKACHmBgEA0woAIegGAQDSCgAh6QYBANIKACEIBwAA3xEAIAkAALAZACALAACJFwAgGwAAshkAIIoGAADZDAAgiwYAANkMACDkBgAA2QwAIOYGAADZDAAgEgcAAJYMACAJAACdDAAgCwAA2AsAIBsAAMYMACCCBgAAxAwAMIMGAAAxABCEBgAAxAwAMIUGAQAAAAGKBgEA0woAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIb0GAADFDOsGIt4GAQDSCgAh5AYBANMKACHmBgEA0woAIegGAQDSCgAh6QYBANIKACEDAAAAMQAgAQAAMgAwAgAAMwAgFAcAAJsLACAJAACdDAAgDQAAgQsAIBEAANALACAbAACrDAAgJAAA0gsAICYAAMMMACCCBgAAwgwAMIMGAAA1ABCEBgAAwgwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHeBgEA0goAIeQGAQDTCgAh5QYCAJQMACHmBgEA0goAIecGAQDTCgAhCwcAAN8RACAJAACwGQAgDQAA4hAAIBEAAIEXACAbAACyGQAgJAAAgxcAICYAALkZACCLBgAA2QwAIOQGAADZDAAg5QYAANkMACDnBgAA2QwAIBQHAACbCwAgCQAAnQwAIA0AAIELACARAADQCwAgGwAAqwwAICQAANILACAmAADDDAAgggYAAMIMADCDBgAANQAQhAYAAMIMADCFBgEAAAABigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHeBgEA0goAIeQGAQDTCgAh5QYCAJQMACHmBgEA0goAIecGAQDTCgAhAwAAADUAIAEAADYAMAIAADcAIAMAAAAmACABAAAnADACAAAoACAQBwAAmwsAIAkAAJ0MACAOAAC-DAAgDwAAwQwAIBAAAJwMACCCBgAAwAwAMIMGAAA6ABCEBgAAwAwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGtBgEA0goAIa4GAQDSCgAhrwYBANIKACEGBwAA3xEAIAkAALAZACAOAAC3GQAgDwAAuBkAIBAAAK8ZACCLBgAA2QwAIBEHAACbCwAgCQAAnQwAIA4AAL4MACAPAADBDAAgEAAAnAwAIIIGAADADAAwgwYAADoAEIQGAADADAAwhQYBAAAAAYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhrQYBANIKACGuBgEA0goAIa8GAQDSCgAh6AcAAL8MACADAAAAOgAgAQAAOwAwAgAAPAAgAQAAABgAIBMHAACbCwAgCQAAnQwAIA4AAL4MACAQAACcDAAgIwAA0wsAIIIGAAC8DAAwgwYAAD8AEIQGAAC8DAAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa0GAQDSCgAhrwYBANIKACG2BgEA0goAIbcGAQDTCgAhuQYAAL0MuQYiugZAAP4LACEIBwAA3xEAIAkAALAZACAOAAC3GQAgEAAArxkAICMAAIQXACCLBgAA2QwAILcGAADZDAAgugYAANkMACATBwAAmwsAIAkAAJ0MACAOAAC-DAAgEAAAnAwAICMAANMLACCCBgAAvAwAMIMGAAA_ABCEBgAAvAwAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa0GAQDSCgAhrwYBANIKACG2BgEA0goAIbcGAQDTCgAhuQYAAL0MuQYiugZAAP4LACEDAAAAPwAgAQAAQAAwAgAAQQAgAQAAABgAIBIHAACbCwAgCQAAnQwAIBIAALsMACAZAACzDAAgggYAALoMADCDBgAARAAQhAYAALoMADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhsAYBANIKACGxBgEA0goAIbIGAQDTCgAhswYBANMKACG0BgEA0woAIbUGQADWCgAhCAcAAN8RACAJAACwGQAgEgAAthkAIBkAALMZACCLBgAA2QwAILIGAADZDAAgswYAANkMACC0BgAA2QwAIBMHAACbCwAgCQAAnQwAIBIAALsMACAZAACzDAAgggYAALoMADCDBgAARAAQhAYAALoMADCFBgEAAAABigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGwBgEA0goAIbEGAQDSCgAhsgYBANMKACGzBgEA0woAIbQGAQDTCgAhtQZAANYKACHnBwAAuQwAIAMAAABEACABAABFADACAABGACABAAAAGAAgAwAAACYAIAEAACcAMAIAACgAIAMAAABEACABAABFADACAABGACATFgAAuAwAIBcAANcKACAYAAD_CwAgGQAArwwAIIIGAAC2DAAwgwYAAEsAEIQGAAC2DAAwhQYBANIKACGNBkAA1goAIY4GQADWCgAhsQYBANMKACG7BgEA0woAIb0GAAC3DNwGIr4GAQDTCgAhvwZAAP4LACHABkAA1goAIcEGAQDSCgAhwgYBANMKACHcBgEA0goAIQkWAAC1GQAgFwAAxA4AIBgAAMQOACAZAACzGQAgsQYAANkMACC7BgAA2QwAIL4GAADZDAAgvwYAANkMACDCBgAA2QwAIBQWAAC4DAAgFwAA1woAIBgAAP8LACAZAACvDAAgggYAALYMADCDBgAASwAQhAYAALYMADCFBgEAAAABjQZAANYKACGOBkAA1goAIbEGAQDTCgAhuwYBANMKACG9BgAAtwzcBiK-BgEA0woAIb8GQAD-CwAhwAZAANYKACHBBgEA0goAIcIGAQDTCgAh3AYBANIKACHmBwAAtQwAIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgAQAAAEsAICYEAADsCwAgBQAA7QsAIAYAAM0LACAQAADOCwAgGQAAzwsAIDQAAJILACBAAADRCwAgTQAA0QsAIE4AAJILACBPAADuCwAgUAAAjwsAIFEAAI8LACBSAADvCwAgUwAA8AsAIFQAANsLACBVAADbCwAgVgAA2gsAIFcAANoLACBYAADZCwAgWQAA8QsAIIIGAADrCwAwgwYAAFEAEIQGAADrCwAwhQYBANIKACGJBgEA0woAIY0GQADWCgAhjgZAANYKACHeBgEA0goAIZUHAQDSCgAh1QcBANIKACHWByAA1QoAIdcHAQDTCgAh2AcBANMKACHZBwEA0woAIdoHAQDTCgAh2wcBANMKACHcBwEA0woAId0HAQDSCgAhAQAAAFEAIBMDAADXCgAgBwAAmwsAIAkAAJ0MACANAACBCwAgEwAA0wsAIBoAAI8LACAcAACDCwAgIgAA2wsAIIIGAACjDAAwgwYAAFMAEIQGAACjDAAwhQYBANIKACGJBgEA0woAIYoGAQDSCgAhiwYBANMKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHaBgEA0goAIQEAAABTACAfBwAAmwsAIAkAAKoMACAZAACzDAAgGwAAqwwAIB0AALQMACCCBgAAsAwAMIMGAABVABCEBgAAsAwAMIUGAQDSCgAhigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACGxBgEA0goAIb0GAACyDI4HItUGEACKDAAh1gYBANIKACHXBgIAiwwAIeYGAQDSCgAh-gYBANIKACH7BgEA0woAIfwGAQDTCgAh_QYBANMKACH-BgEA0woAIf8GAQDTCgAhgAcAAI0MACCBB0AA_gsAIYoHAQDSCgAhjAcAALEMjAcijgcBANIKACGPB0AA1goAIQwHAADfEQAgCQAAsBkAIBkAALMZACAbAACyGQAgHQAAtBkAIPsGAADZDAAg_AYAANkMACD9BgAA2QwAIP4GAADZDAAg_wYAANkMACCABwAA2QwAIIEHAADZDAAgHwcAAJsLACAJAACqDAAgGQAAswwAIBsAAKsMACAdAAC0DAAgggYAALAMADCDBgAAVQAQhAYAALAMADCFBgEAAAABigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACGxBgEA0goAIb0GAACyDI4HItUGEACKDAAh1gYBANIKACHXBgIAiwwAIeYGAQDSCgAh-gYBAAAAAfsGAQDTCgAh_AYBAAAAAf0GAQDTCgAh_gYBANMKACH_BgEA0woAIYAHAACNDAAggQdAAP4LACGKBwEA0goAIYwHAACxDIwHIo4HAQDSCgAhjwdAANYKACEDAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIAEAAABVACAaEAAAogwAIBgAAP8LACAZAACvDAAgHgAAmwsAIB8AAJsLACAgAADXCgAgIQAAnQwAIIIGAACsDAAwgwYAAFsAEIQGAACsDAAwhQYBANIKACGNBkAA1goAIY4GQADWCgAhrwYBANMKACGxBgEA0woAIb0GAACuDJsHIr8GQAD-CwAhwgYBANMKACGZBwAArQyZByKbBwEA0goAIZwHAQDSCgAhnQcBANIKACGeBwEA0woAIZ8HAQDTCgAhoAcBANMKACGhB0AA1goAIQ4QAACvGQAgGAAAxA4AIBkAALMZACAeAADfEQAgHwAA3xEAICAAAMQOACAhAACwGQAgrwYAANkMACCxBgAA2QwAIL8GAADZDAAgwgYAANkMACCeBwAA2QwAIJ8HAADZDAAgoAcAANkMACAaEAAAogwAIBgAAP8LACAZAACvDAAgHgAAmwsAIB8AAJsLACAgAADXCgAgIQAAnQwAIIIGAACsDAAwgwYAAFsAEIQGAACsDAAwhQYBAAAAAY0GQADWCgAhjgZAANYKACGvBgEA0woAIbEGAQDTCgAhvQYAAK4MmwcivwZAAP4LACHCBgEA0woAIZkHAACtDJkHIpsHAQDSCgAhnAcBANIKACGdBwEA0goAIZ4HAQDTCgAhnwcBANMKACGgBwEA0woAIaEHQADWCgAhAwAAAFsAIAEAAFwAMAIAAF0AIAEAAABRACABAAAAUwAgAQAAAA4AIAEAAAAYACABAAAAJgAgAQAAAEQAIAEAAABLACABAAAAVQAgAQAAAFsAIAEAAAAYACABAAAARAAgAQAAABgAIA0HAACbCwAgCQAAnQwAICUAAIALACCCBgAApAwAMIMGAABrABCEBgAApAwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHeBgEA0goAIeQGAQDTCgAhAQAAAGsAIAEAAAAYACADAAAANQAgAQAANgAwAgAANwAgAQAAADUAIAEAAAAmACABAAAAOgAgAQAAAD8AIAMAAAAmACABAAAnADACAAAoACARBwAAmwsAIAkAAKoMACAbAACrDAAgHAAAgwsAIIIGAACpDAAwgwYAAHQAEIQGAACpDAAwhQYBANIKACGKBgEA0goAIYsGAQDSCgAhjQZAANYKACGOBkAA1goAIdYGAQDSCgAh5gYBANIKACGIByAA1QoAIZAHEACKDAAhkQcQAIoMACEEBwAA3xEAIAkAALAZACAbAACyGQAgHAAA5BAAIBIHAACbCwAgCQAAqgwAIBsAAKsMACAcAACDCwAgggYAAKkMADCDBgAAdAAQhAYAAKkMADCFBgEAAAABigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACHWBgEA0goAIeYGAQDSCgAhiAcgANUKACGQBxAAigwAIZEHEACKDAAh5QcAAKgMACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIAEAAAAxACABAAAANQAgAQAAACYAIAEAAAB0ACABAAAAVQAgAQAAABYAIAEAAAAYACABAAAAKgAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACABAAAAFgAgAQAAABgAIAopAACbDAAgggYAAKYMADCDBgAAhQEAEIQGAACmDAAwhQYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAKcM4AciwwYBANIKACHeB0AA1goAIQEpAACuGQAgCykAAJsMACCCBgAApgwAMIMGAACFAQAQhAYAAKYMADCFBgEAAAABjQZAANYKACGOBkAA1goAIb0GAACnDOAHIsMGAQDSCgAh3gdAANYKACHkBwAApQwAIAMAAACFAQAgAQAAhgEAMAIAAIcBACAbBwAAmwsAIAkAAJ0MACAQAACcDAAgKQAAmwwAIIIGAACZDAAwgwYAAIkBABCEBgAAmQwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGvBgEA0goAIcMGAQDSCgAhxAYIAJoMACHFBggAmgwAIcYGCACaDAAhxwYIAJoMACHIBggAmgwAIckGCACaDAAhygYIAJoMACHLBggAmgwAIcwGCACaDAAhzQYIAJoMACHOBggAmgwAIc8GCACaDAAh0AYIAJoMACEBAAAAiQEAIAEAAAAYACABAAAAGAAgAQAAAB0AIAEAAAAqACABAAAAhQEAIAMAAAA6ACABAAA7ADACAAA8ACABAAAAJgAgAQAAADoAIAMAAAAmACABAAAnADACAAAoACABAAAAIQAgAQAAACYAIAUHAADfEQAgCQAAsBkAICUAAOEQACCLBgAA2QwAIOQGAADZDAAgDQcAAJsLACAJAACdDAAgJQAAgAsAIIIGAACkDAAwgwYAAGsAEIQGAACkDAAwhQYBAAAAAYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAh3gYBANIKACHkBgEA0woAIQMAAABrACABAACWAQAwAgAAlwEAIAMAAAAhACABAAAiADACAAAjACADAAAANQAgAQAANgAwAgAANwAgAwAAAA4AIAEAAA8AMAIAABAAIAoDAADEDgAgBwAA3xEAIAkAALAZACANAADiEAAgEwAAhBcAIBoAAMARACAcAADkEAAgIgAAjBcAIIkGAADZDAAgiwYAANkMACATAwAA1woAIAcAAJsLACAJAACdDAAgDQAAgQsAIBMAANMLACAaAACPCwAgHAAAgwsAICIAANsLACCCBgAAowwAMIMGAABTABCEBgAAowwAMIUGAQAAAAGJBgEA0woAIYoGAQDSCgAhiwYBANMKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHaBgEAAAABAwAAAFMAIAEAAJwBADACAACdAQAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACAXBwAAmwsAIAkAAJ0MACAQAACiDAAgFgAAoQwAIBgAAP8LACAzAADXCgAgggYAAJ8MADCDBgAAoQEAEIQGAACfDAAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIZoGAQDSCgAhrwYBANMKACG7BgEA0woAIb0GAACgDL0GIr4GAQDTCgAhvwZAAP4LACHABkAA1goAIcEGAQDSCgAhwgYBANMKACEMBwAA3xEAIAkAALAZACAQAACvGQAgFgAAsRkAIBgAAMQOACAzAADEDgAgiwYAANkMACCvBgAA2QwAILsGAADZDAAgvgYAANkMACC_BgAA2QwAIMIGAADZDAAgGAcAAJsLACAJAACdDAAgEAAAogwAIBYAAKEMACAYAAD_CwAgMwAA1woAIIIGAACfDAAwgwYAAKEBABCEBgAAnwwAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIZoGAQDSCgAhrwYBANMKACG7BgEA0woAIb0GAACgDL0GIr4GAQDTCgAhvwZAAP4LACHABkAA1goAIcEGAQDSCgAhwgYBANMKACHjBwAAngwAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAQAAAKEBACABAAAAUQAgAQAAAA4AIAEAAAAYACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAEQAIAEAAEUAMAIAAEYAIBIHAADfEQAgCQAAsBkAIBAAAK8ZACApAACuGQAgiwYAANkMACDEBgAA2QwAIMUGAADZDAAgxgYAANkMACDHBgAA2QwAIMgGAADZDAAgyQYAANkMACDKBgAA2QwAIMsGAADZDAAgzAYAANkMACDNBgAA2QwAIM4GAADZDAAgzwYAANkMACDQBgAA2QwAIBsHAACbCwAgCQAAnQwAIBAAAJwMACApAACbDAAgggYAAJkMADCDBgAAiQEAEIQGAACZDAAwhQYBAAAAAYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhrwYBANIKACHDBgEAAAABxAYIAJoMACHFBggAmgwAIcYGCACaDAAhxwYIAJoMACHIBggAmgwAIckGCACaDAAhygYIAJoMACHLBggAmgwAIcwGCACaDAAhzQYIAJoMACHOBggAmgwAIc8GCACaDAAh0AYIAJoMACEDAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAABVACABAABWADACAABXACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAACoAIAEAACsAMAIAACwAIAMAAABbACABAABcADACAABdACABAAAAHQAgAQAAAGsAIAEAAAAhACABAAAANQAgAQAAAA4AIAEAAABTACABAAAAJgAgAQAAADoAIAEAAAChAQAgAQAAAD8AIAEAAABEACABAAAAiQEAIAEAAAB0ACABAAAAVQAgAQAAADEAIAEAAAAqACABAAAAWwAgAQAAABgAIAMAAAAdACABAAAeADACAAAfACADAAAAawAgAQAAlgEAMAIAAJcBACAOBwAAmwsAICoAANgLACCCBgAAlwwAMIMGAADIAQAQhAYAAJcMADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAId4GAQDTCgAhwAcBANIKACHBBwEA0goAIcIHAgCLDAAhxAcAAJgMxAciAwcAAN8RACAqAACJFwAg3gYAANkMACAOBwAAmwsAICoAANgLACCCBgAAlwwAMIMGAADIAQAQhAYAAJcMADCFBgEAAAABigYBANIKACGNBkAA1goAIY4GQADWCgAh3gYBANMKACHABwEA0goAIcEHAQDSCgAhwgcCAIsMACHEBwAAmAzEByIDAAAAyAEAIAEAAMkBADACAADKAQAgAwAAADUAIAEAADYAMAIAADcAIAMAAAAhACABAAAiADACAAAjACADAAAACwAgAQAADAAwAgAAAQAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAAAmACABAAAnADACAAAoACADAAAAOgAgAQAAOwAwAgAAPAAgIgcAAJYMACA8AADXCgAgPQAA_wsAID8AANcLACCCBgAAkQwAMIMGAADTAQAQhAYAAJEMADCFBgEA0goAIYoGAQDTCgAhjQZAANYKACGOBkAA1goAIb0GAACVDLsHIr8GQAD-CwAh5AYBANMKACGmBwEA0woAIacHAQDSCgAhqAcBANIKACGpBwEA0woAIasHAADHC6sHI6wHAQDTCgAhrQcAAJIM0wYjrgcQAJMMACGvBwEA0goAIbAHAgCUDAAhsQcAAIwM-gYisgcBANMKACGzBwEA0woAIbQHAQDTCgAhtQcBANMKACG2BwEA0woAIbcHAQDTCgAhuAcAAI0MACC5B0AA_gsAIbsHAQDTCgAhFwcAAN8RACA8AADEDgAgPQAAxA4AID8AAIgXACCKBgAA2QwAIL8GAADZDAAg5AYAANkMACCmBwAA2QwAIKkHAADZDAAgqwcAANkMACCsBwAA2QwAIK0HAADZDAAgrgcAANkMACCwBwAA2QwAILIHAADZDAAgswcAANkMACC0BwAA2QwAILUHAADZDAAgtgcAANkMACC3BwAA2QwAILgHAADZDAAguQcAANkMACC7BwAA2QwAICIHAACWDAAgPAAA1woAID0AAP8LACA_AADXCwAgggYAAJEMADCDBgAA0wEAEIQGAACRDAAwhQYBAAAAAYoGAQDTCgAhjQZAANYKACGOBkAA1goAIb0GAACVDLsHIr8GQAD-CwAh5AYBANMKACGmBwEA0woAIacHAQDSCgAhqAcBANIKACGpBwEA0woAIasHAADHC6sHI6wHAQDTCgAhrQcAAJIM0wYjrgcQAJMMACGvBwEA0goAIbAHAgCUDAAhsQcAAIwM-gYisgcBAAAAAbMHAQDTCgAhtAcBAAAAAbUHAQDTCgAhtgcBANMKACG3BwEA0woAIbgHAACNDAAguQdAAP4LACG7BwEA0woAIQMAAADTAQAgAQAA1AEAMAIAANUBACABAAAAUQAgAQAAABYAIBEHAACbCwAgPgAAkAwAIIIGAACODAAwgwYAANkBABCEBgAAjgwAMIUGAQDSCgAhigYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAI8M1QYi0QYBANMKACHTBgAAiQzTBiLVBhAAigwAIdYGAQDSCgAh1wYCAIsMACHYBkAA1goAIdkGQADWCgAhAwcAAN8RACA-AACtGQAg0QYAANkMACARBwAAmwsAID4AAJAMACCCBgAAjgwAMIMGAADZAQAQhAYAAI4MADCFBgEAAAABigYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAI8M1QYi0QYBANMKACHTBgAAiQzTBiLVBhAAigwAIdYGAQDSCgAh1wYCAIsMACHYBkAA1goAIdkGQADWCgAhAwAAANkBACABAADaAQAwAgAA2wEAIAEAAADTAQAgAQAAANkBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAABEACABAABFADACAABGACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAABVACABAABWADACAABXACAQBwAAmwsAIIIGAACaCwAwgwYAAOUBABCEBgAAmgsAMIUGAQDSCgAhigYBANIKACGNBkAA1goAIY4GQADWCgAhggcBANIKACGDBwEA0goAIYQHAQDSCgAhhQcBANIKACGGBwEA0goAIYcHAQDSCgAhiAcgANUKACGJBwEA0woAIQEAAADlAQAgFgcAAJsLACCCBgAAiAwAMIMGAADnAQAQhAYAAIgMADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAIb0GAACMDPoGItMGAACJDNMGItUGEACKDAAh1gYBANIKACHXBgIAiwwAIfgGAQDSCgAh-gYBANIKACH7BgEA0woAIfwGAQDTCgAh_QYBANMKACH-BgEA0woAIf8GAQDTCgAhgAcAAI0MACCBB0AA_gsAIQgHAADfEQAg-wYAANkMACD8BgAA2QwAIP0GAADZDAAg_gYAANkMACD_BgAA2QwAIIAHAADZDAAggQcAANkMACAWBwAAmwsAIIIGAACIDAAwgwYAAOcBABCEBgAAiAwAMIUGAQAAAAGKBgEA0goAIY0GQADWCgAhjgZAANYKACG9BgAAjAz6BiLTBgAAiQzTBiLVBhAAigwAIdYGAQDSCgAh1wYCAIsMACH4BgEA0goAIfoGAQAAAAH7BgEA0woAIfwGAQAAAAH9BgEA0woAIf4GAQDTCgAh_wYBANMKACGABwAAjQwAIIEHQAD-CwAhAwAAAOcBACABAADoAQAwAgAA6QEAIAMAAADZAQAgAQAA2gEAMAIAANsBACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAACoAIAEAACsAMAIAACwAIA8HAACbCwAgQwAA1woAIEUAAIcMACBGAADxCwAgggYAAIYMADCDBgAA7gEAEIQGAACGDAAwhQYBANIKACGKBgEA0goAIY0GQADWCgAhjgZAANYKACG2BgEA0goAIbcGAQDSCgAhlgcBANIKACGXBwAAhQyVByIEBwAA3xEAIEMAAMQOACBFAACsGQAgRgAAohkAIA8HAACbCwAgQwAA1woAIEUAAIcMACBGAADxCwAgggYAAIYMADCDBgAA7gEAEIQGAACGDAAwhQYBAAAAAYoGAQDSCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAhtwYBANIKACGWBwEA0goAIZcHAACFDJUHIgMAAADuAQAgAQAA7wEAMAIAAPABACAIRAAAggwAIIIGAACEDAAwgwYAAPIBABCEBgAAhAwAMIUGAQDSCgAhjQZAANYKACGSBwEA0goAIZUHAACFDJUHIgFEAACrGQAgCUQAAIIMACCCBgAAhAwAMIMGAADyAQAQhAYAAIQMADCFBgEAAAABjQZAANYKACGSBwEA0goAIZUHAACFDJUHIuIHAACDDAAgAwAAAPIBACABAADzAQAwAgAA9AEAIAkDAADXCgAgRAAAggwAIIIGAACBDAAwgwYAAPYBABCEBgAAgQwAMIUGAQDSCgAhjAYBANIKACGSBwEA0goAIZMHQADWCgAhAgMAAMQOACBEAACrGQAgCgMAANcKACBEAACCDAAgggYAAIEMADCDBgAA9gEAEIQGAACBDAAwhQYBAAAAAYwGAQDSCgAhkgcBANIKACGTB0AA1goAIeEHAACADAAgAwAAAPYBACABAAD3AQAwAgAA-AEAIAEAAADyAQAgAQAAAPYBACAQBwAAmwsAICAAANcKACA9AAD_CwAgggYAAPsLADCDBgAA_AEAEIQGAAD7CwAwhQYBANIKACGKBgEA0goAIY0GQADWCgAhjgZAANYKACG9BgAA_QulByK_BkAA_gsAIZ0HAQDSCgAhowcAAPwLowcipQcBANMKACGmBwEA0woAIQYHAADfEQAgIAAAxA4AID0AAMQOACC_BgAA2QwAIKUHAADZDAAgpgcAANkMACAQBwAAmwsAICAAANcKACA9AAD_CwAgggYAAPsLADCDBgAA_AEAEIQGAAD7CwAwhQYBAAAAAYoGAQDSCgAhjQZAANYKACGOBkAA1goAIb0GAAD9C6UHIr8GQAD-CwAhnQcBANIKACGjBwAA_AujByKlBwEA0woAIaYHAQDTCgAhAwAAAPwBACABAAD9AQAwAgAA_gEAIAEAAABRACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAAASACABAAAAHQAgAQAAAGsAIAEAAADIAQAgAQAAADUAIAEAAAAhACABAAAACwAgAQAAAA4AIAEAAABTACABAAAAJgAgAQAAADoAIAEAAADTAQAgAQAAAKEBACABAAAAPwAgAQAAAEQAIAEAAACJAQAgAQAAAHQAIAEAAABVACABAAAA5wEAIAEAAADZAQAgAQAAADEAIAEAAAAqACABAAAA7gEAIAEAAAD8AQAgAQAAAFsAIAEAAABbACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA_ACABAABAADACAABBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAIkBACABAACsAQAwAgAArQEAIAMAAABbACABAABcADACAABdACABAAAAJgAgAQAAADoAIAEAAAA_ACABAAAAoQEAIAEAAACJAQAgAQAAAFsAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAADTAQAgAQAA1AEAMAIAANUBACADAAAA0wEAIAEAANQBADACAADVAQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACARMwAA1woAIIIGAADRCgAwgwYAAK4CABCEBgAA0QoAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIZoGAQDSCgAhmwYBANIKACGcBgEA0goAIZ0GAQDSCgAhngYBANMKACGfBgAAywoAIKAGAADLCgAgoQYAANQKACCiBgAA1AoAIKMGIADVCgAhAQAAAK4CACADAAAASwAgAQAATAAwAgAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIA0XAADXCgAgggYAAPwKADCDBgAAsgIAEIQGAAD8CgAwhQYBANIKACGNBkAA1goAIY4GQADWCgAhmwYBANIKACGcBgEA0goAIaEGAADUCgAgowYgANUKACHcBgEA0goAId0GAADLCgAgAQAAALICACAKAwAA1woAIIIGAAD6CwAwgwYAALQCABCEBgAA-gsAMIUGAQDSCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAhxQcBANIKACHGB0AA1goAIQEDAADEDgAgCgMAANcKACCCBgAA-gsAMIMGAAC0AgAQhAYAAPoLADCFBgEAAAABjAYBAAAAAY0GQADWCgAhjgZAANYKACHFBwEA0goAIcYHQADWCgAhAwAAALQCACABAAC1AgAwAgAAtgIAIAMAAABbACABAABcADACAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAPwBACABAAD9AQAwAgAA_gEAIAMAAAD8AQAgAQAA_QEAMAIAAP4BACADAAAA7gEAIAEAAO8BADACAADwAQAgAwAAAPYBACABAAD3AQAwAgAA-AEAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAOACABAAAAUwAgAQAAANMBACABAAAA0wEAIAEAAAChAQAgAQAAAKEBACABAAAASwAgAQAAAEsAIAEAAAC0AgAgAQAAAFsAIAEAAABbACABAAAA_AEAIAEAAAD8AQAgAQAAAO4BACABAAAA9gEAIAEAAAABACADAAAACwAgAQAADAAwAgAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACAIAwAAtRQAIAcAAPAYACCFBgEAAAABigYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAZUHAAAA4QcCAV8AANQCACAGhQYBAAAAAYoGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAGVBwAAAOEHAgFfAADWAgAwAV8AANYCADAIAwAAsxQAIAcAAO4YACCFBgEA3QwAIYoGAQDdDAAhjAYBAN0MACGNBkAA3wwAIY4GQADfDAAhlQcAALEU4QciAgAAAAEAIF8AANkCACAGhQYBAN0MACGKBgEA3QwAIYwGAQDdDAAhjQZAAN8MACGOBkAA3wwAIZUHAACxFOEHIgIAAAALACBfAADbAgAgAgAAAAsAIF8AANsCACADAAAAAQAgZgAA1AIAIGcAANkCACABAAAAAQAgAQAAAAsAIAMVAACoGQAgbAAAqhkAIG0AAKkZACAJggYAAPYLADCDBgAA4gIAEIQGAAD2CwAwhQYBAL8KACGKBgEAvwoAIYwGAQC_CgAhjQZAAMEKACGOBkAAwQoAIZUHAAD3C-EHIgMAAAALACABAADhAgAwawAA4gIAIAMAAAALACABAAAMADACAAABACABAAAAhwEAIAEAAACHAQAgAwAAAIUBACABAACGAQAwAgAAhwEAIAMAAACFAQAgAQAAhgEAMAIAAIcBACADAAAAhQEAIAEAAIYBADACAACHAQAgBykAAKcZACCFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAOAHAsMGAQAAAAHeB0AAAAABAV8AAOoCACAGhQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADgBwLDBgEAAAAB3gdAAAAAAQFfAADsAgAwAV8AAOwCADAHKQAAphkAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIb0GAACPDuAHIsMGAQDdDAAh3gdAAN8MACECAAAAhwEAIF8AAO8CACAGhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhvQYAAI8O4AciwwYBAN0MACHeB0AA3wwAIQIAAACFAQAgXwAA8QIAIAIAAACFAQAgXwAA8QIAIAMAAACHAQAgZgAA6gIAIGcAAO8CACABAAAAhwEAIAEAAACFAQAgAxUAAKMZACBsAAClGQAgbQAApBkAIAmCBgAA8gsAMIMGAAD4AgAQhAYAAPILADCFBgEAvwoAIY0GQADBCgAhjgZAAMEKACG9BgAA8wvgByLDBgEAvwoAId4HQADBCgAhAwAAAIUBACABAAD3AgAwawAA-AIAIAMAAACFAQAgAQAAhgEAMAIAAIcBACAmBAAA7AsAIAUAAO0LACAGAADNCwAgEAAAzgsAIBkAAM8LACA0AACSCwAgQAAA0QsAIE0AANELACBOAACSCwAgTwAA7gsAIFAAAI8LACBRAACPCwAgUgAA7wsAIFMAAPALACBUAADbCwAgVQAA2wsAIFYAANoLACBXAADaCwAgWAAA2QsAIFkAAPELACCCBgAA6wsAMIMGAABRABCEBgAA6wsAMIUGAQAAAAGJBgEA0woAIY0GQADWCgAhjgZAANYKACHeBgEA0goAIZUHAQDSCgAh1QcBAAAAAdYHIADVCgAh1wcBANMKACHYBwEA0woAIdkHAQDTCgAh2gcBANMKACHbBwEA0woAIdwHAQDTCgAh3QcBANIKACEBAAAA-wIAIAEAAAD7AgAgGwQAAJ0ZACAFAACeGQAgBgAA_hYAIBAAAP8WACAZAACAFwAgNAAA0REAIEAAAIIXACBNAACCFwAgTgAA0REAIE8AAJ8ZACBQAADAEQAgUQAAwBEAIFIAAKAZACBTAAChGQAgVAAAjBcAIFUAAIwXACBWAACLFwAgVwAAixcAIFgAAIoXACBZAACiGQAgiQYAANkMACDXBwAA2QwAINgHAADZDAAg2QcAANkMACDaBwAA2QwAINsHAADZDAAg3AcAANkMACADAAAAUQAgAQAA_gIAMAIAAPsCACADAAAAUQAgAQAA_gIAMAIAAPsCACADAAAAUQAgAQAA_gIAMAIAAPsCACAjBAAAiRkAIAUAAIoZACAGAACLGQAgEAAAjBkAIBkAAI0ZACA0AACQGQAgQAAAjhkAIE0AAI8ZACBOAACRGQAgTwAAkhkAIFAAAJMZACBRAACUGQAgUgAAlRkAIFMAAJYZACBUAACXGQAgVQAAmBkAIFYAAJkZACBXAACaGQAgWAAAmxkAIFkAAJwZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAEBXwAAggMAIA-FBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAEBXwAAhAMAMAFfAACEAwAwIwQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBWAADOFwAgVwAAzxcAIFgAANAXACBZAADRFwAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhAgAAAPsCACBfAACHAwAgD4UGAQDdDAAhiQYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACGVBwEA3QwAIdUHAQDdDAAh1gcgAL8OACHXBwEA3gwAIdgHAQDeDAAh2QcBAN4MACHaBwEA3gwAIdsHAQDeDAAh3AcBAN4MACHdBwEA3QwAIQIAAABRACBfAACJAwAgAgAAAFEAIF8AAIkDACADAAAA-wIAIGYAAIIDACBnAACHAwAgAQAAAPsCACABAAAAUQAgChUAALsXACBsAAC9FwAgbQAAvBcAIIkGAADZDAAg1wcAANkMACDYBwAA2QwAINkHAADZDAAg2gcAANkMACDbBwAA2QwAINwHAADZDAAgEoIGAADqCwAwgwYAAJADABCEBgAA6gsAMIUGAQC_CgAhiQYBAMAKACGNBkAAwQoAIY4GQADBCgAh3gYBAL8KACGVBwEAvwoAIdUHAQC_CgAh1gcgAM0KACHXBwEAwAoAIdgHAQDACgAh2QcBAMAKACHaBwEAwAoAIdsHAQDACgAh3AcBAMAKACHdBwEAvwoAIQMAAABRACABAACPAwAwawAAkAMAIAMAAABRACABAAD-AgAwAgAA-wIAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAALoXACCFBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAABxgdAAAAAAdIHAQAAAAHTBwEAAAAB1AcBAAAAAQFfAACYAwAgCIUGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHGB0AAAAAB0gcBAAAAAdMHAQAAAAHUBwEAAAABAV8AAJoDADABXwAAmgMAMAkDAAC5FwAghQYBAN0MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACHGB0AA3wwAIdIHAQDdDAAh0wcBAN4MACHUBwEA3gwAIQIAAAAFACBfAACdAwAgCIUGAQDdDAAhjAYBAN0MACGNBkAA3wwAIY4GQADfDAAhxgdAAN8MACHSBwEA3QwAIdMHAQDeDAAh1AcBAN4MACECAAAAAwAgXwAAnwMAIAIAAAADACBfAACfAwAgAwAAAAUAIGYAAJgDACBnAACdAwAgAQAAAAUAIAEAAAADACAFFQAAthcAIGwAALgXACBtAAC3FwAg0wcAANkMACDUBwAA2QwAIAuCBgAA6QsAMIMGAACmAwAQhAYAAOkLADCFBgEAvwoAIYwGAQC_CgAhjQZAAMEKACGOBkAAwQoAIcYHQADBCgAh0gcBAL8KACHTBwEAwAoAIdQHAQDACgAhAwAAAAMAIAEAAKUDADBrAACmAwAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAALUXACCFBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABzAcBAAAAAc0HAQAAAAHOB0AAAAABzwdAAAAAAdAHAQAAAAHRBwEAAAABAV8AAK4DACANhQYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAcwHAQAAAAHNBwEAAAABzgdAAAAAAc8HQAAAAAHQBwEAAAAB0QcBAAAAAQFfAACwAwAwAV8AALADADAOAwAAtBcAIIUGAQDdDAAhjAYBAN0MACGNBkAA3wwAIY4GQADfDAAhyQcBAN0MACHKBwEA3QwAIcsHAQDeDAAhzAcBAN4MACHNBwEA3gwAIc4HQAD1DAAhzwdAAPUMACHQBwEA3gwAIdEHAQDeDAAhAgAAAAkAIF8AALMDACANhQYBAN0MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACHJBwEA3QwAIcoHAQDdDAAhywcBAN4MACHMBwEA3gwAIc0HAQDeDAAhzgdAAPUMACHPB0AA9QwAIdAHAQDeDAAh0QcBAN4MACECAAAABwAgXwAAtQMAIAIAAAAHACBfAAC1AwAgAwAAAAkAIGYAAK4DACBnAACzAwAgAQAAAAkAIAEAAAAHACAKFQAAsRcAIGwAALMXACBtAACyFwAgywcAANkMACDMBwAA2QwAIM0HAADZDAAgzgcAANkMACDPBwAA2QwAINAHAADZDAAg0QcAANkMACAQggYAAOgLADCDBgAAvAMAEIQGAADoCwAwhQYBAL8KACGMBgEAvwoAIY0GQADBCgAhjgZAAMEKACHJBwEAvwoAIcoHAQC_CgAhywcBAMAKACHMBwEAwAoAIc0HAQDACgAhzgdAANwKACHPB0AA3AoAIdAHAQDACgAh0QcBAMAKACEDAAAABwAgAQAAuwMAMGsAALwDACADAAAABwAgAQAACAAwAgAACQAgCYIGAADnCwAwgwYAAMIDABCEBgAA5wsAMIUGAQAAAAGNBkAA1goAIY4GQADWCgAhxgdAANYKACHHBwEA0goAIcgHAQDSCgAhAQAAAL8DACABAAAAvwMAIAmCBgAA5wsAMIMGAADCAwAQhAYAAOcLADCFBgEA0goAIY0GQADWCgAhjgZAANYKACHGB0AA1goAIccHAQDSCgAhyAcBANIKACEAAwAAAMIDACABAADDAwAwAgAAvwMAIAMAAADCAwAgAQAAwwMAMAIAAL8DACADAAAAwgMAIAEAAMMDADACAAC_AwAgBoUGAQAAAAGNBkAAAAABjgZAAAAAAcYHQAAAAAHHBwEAAAAByAcBAAAAAQFfAADHAwAgBoUGAQAAAAGNBkAAAAABjgZAAAAAAcYHQAAAAAHHBwEAAAAByAcBAAAAAQFfAADJAwAwAV8AAMkDADAGhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhxgdAAN8MACHHBwEA3QwAIcgHAQDdDAAhAgAAAL8DACBfAADMAwAgBoUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIcYHQADfDAAhxwcBAN0MACHIBwEA3QwAIQIAAADCAwAgXwAAzgMAIAIAAADCAwAgXwAAzgMAIAMAAAC_AwAgZgAAxwMAIGcAAMwDACABAAAAvwMAIAEAAADCAwAgAxUAAK4XACBsAACwFwAgbQAArxcAIAmCBgAA5gsAMIMGAADVAwAQhAYAAOYLADCFBgEAvwoAIY0GQADBCgAhjgZAAMEKACHGB0AAwQoAIccHAQC_CgAhyAcBAL8KACEDAAAAwgMAIAEAANQDADBrAADVAwAgAwAAAMIDACABAADDAwAwAgAAvwMAIAEAAAC2AgAgAQAAALYCACADAAAAtAIAIAEAALUCADACAAC2AgAgAwAAALQCACABAAC1AgAwAgAAtgIAIAMAAAC0AgAgAQAAtQIAMAIAALYCACAHAwAArRcAIIUGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHFBwEAAAABxgdAAAAAAQFfAADdAwAgBoUGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHFBwEAAAABxgdAAAAAAQFfAADfAwAwAV8AAN8DADAHAwAArBcAIIUGAQDdDAAhjAYBAN0MACGNBkAA3wwAIY4GQADfDAAhxQcBAN0MACHGB0AA3wwAIQIAAAC2AgAgXwAA4gMAIAaFBgEA3QwAIYwGAQDdDAAhjQZAAN8MACGOBkAA3wwAIcUHAQDdDAAhxgdAAN8MACECAAAAtAIAIF8AAOQDACACAAAAtAIAIF8AAOQDACADAAAAtgIAIGYAAN0DACBnAADiAwAgAQAAALYCACABAAAAtAIAIAMVAACpFwAgbAAAqxcAIG0AAKoXACAJggYAAOULADCDBgAA6wMAEIQGAADlCwAwhQYBAL8KACGMBgEAvwoAIY0GQADBCgAhjgZAAMEKACHFBwEAvwoAIcYHQADBCgAhAwAAALQCACABAADqAwAwawAA6wMAIAMAAAC0AgAgAQAAtQIAMAIAALYCACABAAAAlwEAIAEAAACXAQAgAwAAAGsAIAEAAJYBADACAACXAQAgAwAAAGsAIAEAAJYBADACAACXAQAgAwAAAGsAIAEAAJYBADACAACXAQAgCgcAAMAWACAJAAD5FAAgJQAA-hQAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAEBXwAA8wMAIAeFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAABAV8AAPUDADABXwAA9QMAMAEAAAAYACAKBwAAvhYAIAkAAO0UACAlAADuFAAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAh5AYBAN4MACECAAAAlwEAIF8AAPkDACAHhQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAh5AYBAN4MACECAAAAawAgXwAA-wMAIAIAAABrACBfAAD7AwAgAQAAABgAIAMAAACXAQAgZgAA8wMAIGcAAPkDACABAAAAlwEAIAEAAABrACAFFQAAphcAIGwAAKgXACBtAACnFwAgiwYAANkMACDkBgAA2QwAIAqCBgAA5AsAMIMGAACDBAAQhAYAAOQLADCFBgEAvwoAIYoGAQC_CgAhiwYBAMAKACGNBkAAwQoAIY4GQADBCgAh3gYBAL8KACHkBgEAwAoAIQMAAABrACABAACCBAAwawAAgwQAIAMAAABrACABAACWAQAwAgAAlwEAIAEAAADKAQAgAQAAAMoBACADAAAAyAEAIAEAAMkBADACAADKAQAgAwAAAMgBACABAADJAQAwAgAAygEAIAMAAADIAQAgAQAAyQEAMAIAAMoBACALBwAApRcAICoAAOEUACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAcAHAQAAAAHBBwEAAAABwgcCAAAAAcQHAAAAxAcCAV8AAIsEACAJhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHABwEAAAABwQcBAAAAAcIHAgAAAAHEBwAAAMQHAgFfAACNBAAwAV8AAI0EADALBwAApBcAICoAANYUACCFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAId4GAQDeDAAhwAcBAN0MACHBBwEA3QwAIcIHAgDmDgAhxAcAANQUxAciAgAAAMoBACBfAACQBAAgCYUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAh3gYBAN4MACHABwEA3QwAIcEHAQDdDAAhwgcCAOYOACHEBwAA1BTEByICAAAAyAEAIF8AAJIEACACAAAAyAEAIF8AAJIEACADAAAAygEAIGYAAIsEACBnAACQBAAgAQAAAMoBACABAAAAyAEAIAYVAACfFwAgbAAAohcAIG0AAKEXACDuAQAAoBcAIO8BAACjFwAg3gYAANkMACAMggYAAOALADCDBgAAmQQAEIQGAADgCwAwhQYBAL8KACGKBgEAvwoAIY0GQADBCgAhjgZAAMEKACHeBgEAwAoAIcAHAQC_CgAhwQcBAL8KACHCBwIA7QoAIcQHAADhC8QHIgMAAADIAQAgAQAAmAQAMGsAAJkEACADAAAAyAEAIAEAAMkBADACAADKAQAgAQAAACMAIAEAAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAAhACABAAAiADACAAAjACAPBwAAqBEAIAkAAKkRACAKAADAFAAgDQAAqhEAIBEAAKsRACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAAB9gYBAAAAAb4HAQAAAAG_BwEAAAABAV8AAKEEACAKhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB8AYCAAAAAfYGAQAAAAG-BwEAAAABvwcBAAAAAQFfAACjBAAwAV8AAKMEADABAAAAHQAgDwcAAJERACAJAACSEQAgCgAAvhQAIA0AAJMRACARAACUEQAghQYBAN0MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIeQGAQDeDAAh8AYCAJMQACH2BgEA3gwAIb4HAQDdDAAhvwcBAN0MACECAAAAIwAgXwAApwQAIAqFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACHwBgIAkxAAIfYGAQDeDAAhvgcBAN0MACG_BwEA3QwAIQIAAAAhACBfAACpBAAgAgAAACEAIF8AAKkEACABAAAAHQAgAwAAACMAIGYAAKEEACBnAACnBAAgAQAAACMAIAEAAAAhACAIFQAAmhcAIGwAAJ0XACBtAACcFwAg7gEAAJsXACDvAQAAnhcAIOQGAADZDAAg8AYAANkMACD2BgAA2QwAIA2CBgAA3wsAMIMGAACxBAAQhAYAAN8LADCFBgEAvwoAIYoGAQC_CgAhiwYBAL8KACGNBkAAwQoAIY4GQADBCgAh5AYBAMAKACHwBgIAhQsAIfYGAQDACgAhvgcBAL8KACG_BwEAvwoAIQMAAAAhACABAACwBAAwawAAsQQAIAMAAAAhACABAAAiADACAAAjACABAAAAKAAgAQAAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIBcHAACwDgAgCQAArQ4AIAoAAK4OACALAACnDgAgDgAArA4AIA8AAKoOACAQAAC9DwAgGQAAqw4AIBsAAK8OACAsAACoDgAgLQAAqQ4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQFfAAC5BAAgDIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQFfAAC7BAAwAV8AALsEADABAAAAGAAgAQAAAB0AIBcHAAD9DQAgCQAA-g0AIAoAAPsNACALAAD0DQAgDgAA-Q0AIA8AAPcNACAQAAC7DwAgGQAA-A0AIBsAAPwNACAsAAD1DQAgLQAA9g0AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAh9gYBAN4MACG9B0AA3wwAIQIAAAAoACBfAADABAAgDIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAh9gYBAN4MACG9B0AA3wwAIQIAAAAmACBfAADCBAAgAgAAACYAIF8AAMIEACABAAAAGAAgAQAAAB0AIAMAAAAoACBmAAC5BAAgZwAAwAQAIAEAAAAoACABAAAAJgAgBRUAAJcXACBsAACZFwAgbQAAmBcAIIsGAADZDAAg9gYAANkMACAPggYAAN4LADCDBgAAywQAEIQGAADeCwAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAIa0GAQC_CgAhrgYBAL8KACGvBgEAvwoAIbEGAQC_CgAh5gYBAL8KACH2BgEAwAoAIb0HQADBCgAhAwAAACYAIAEAAMoEADBrAADLBAAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAaACABAAAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgGQgAAJYXACAMAADZFgAgDQAA0RYAIBEAANIWACAcAADYFgAgJQAAzhYAICcAANcWACAqAADaFgAgLgAAyxYAIC8AAMwWACAwAADNFgAgMQAAzxYAIDIAANAWACA0AADTFgAgNQAA1BYAIDYAANUWACA3AADWFgAgOAAA2xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAEBXwAA0wQAIAeFBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB9QYBAAAAAakHAQAAAAG8BwEAAAABAV8AANUEADABXwAA1QQAMAEAAAASACAZCAAAlRcAIAwAAKwVACANAACkFQAgEQAApRUAIBwAAKsVACAlAAChFQAgJwAAqhUAICoAAK0VACAuAACeFQAgLwAAnxUAIDAAAKAVACAxAACiFQAgMgAAoxUAIDQAAKYVACA1AACnFQAgNgAAqBUAIDcAAKkVACA4AACuFQAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACH1BgEA3gwAIakHAQDeDAAhvAcBAN0MACECAAAAGgAgXwAA2QQAIAeFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfUGAQDeDAAhqQcBAN4MACG8BwEA3QwAIQIAAAAYACBfAADbBAAgAgAAABgAIF8AANsEACABAAAAEgAgAwAAABoAIGYAANMEACBnAADZBAAgAQAAABoAIAEAAAAYACAGFQAAkhcAIGwAAJQXACBtAACTFwAg5AYAANkMACD1BgAA2QwAIKkHAADZDAAgCoIGAADdCwAwgwYAAOMEABCEBgAA3QsAMIUGAQC_CgAhjQZAAMEKACGOBkAAwQoAIeQGAQDACgAh9QYBAMAKACGpBwEAwAoAIbwHAQC_CgAhAwAAABgAIAEAAOIEADBrAADjBAAgAwAAABgAIAEAABkAMAIAABoAIAEAAAAUACABAAAAFAAgAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgCQcAAJEXACA5AADdFgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAGpBwEAAAABvAcBAAAAAQFfAADrBAAgB4UGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAABqQcBAAAAAbwHAQAAAAEBXwAA7QQAMAFfAADtBAAwAQAAABYAIAkHAACQFwAgOQAAkhUAIIUGAQDdDAAhigYBAN4MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACGpBwEA3gwAIbwHAQDdDAAhAgAAABQAIF8AAPEEACAHhQYBAN0MACGKBgEA3gwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIakHAQDeDAAhvAcBAN0MACECAAAAEgAgXwAA8wQAIAIAAAASACBfAADzBAAgAQAAABYAIAMAAAAUACBmAADrBAAgZwAA8QQAIAEAAAAUACABAAAAEgAgBhUAAI0XACBsAACPFwAgbQAAjhcAIIoGAADZDAAg5AYAANkMACCpBwAA2QwAIAqCBgAA3AsAMIMGAAD7BAAQhAYAANwLADCFBgEAvwoAIYoGAQDACgAhjQZAAMEKACGOBkAAwQoAIeQGAQDACgAhqQcBAMAKACG8BwEAvwoAIQMAAAASACABAAD6BAAwawAA-wQAIAMAAAASACABAAATADACAAAUACAmBgAAzQsAIAwAAP8KACANAACBCwAgEQAA0AsAIBwAAIMLACAlAACACwAgJwAAggsAICoAANgLACAuAADJCwAgLwAAygsAIDAAAMwLACAxAADOCwAgMgAAzwsAIDQAAJILACA1AADSCwAgNgAA0wsAIDcAANQLACA6AADICwAgOwAAywsAID8AANcLACBAAADRCwAgQQAA1QsAIEIAANYLACBHAADZCwAgSAAA2gsAIEkAANsLACBKAADbCwAgggYAAMYLADCDBgAAFgAQhAYAAMYLADCFBgEAAAABjQZAANYKACGOBkAA1goAIbkGAADHC6sHI94GAQDSCgAh5AYBANMKACGpBwEA0woAIawHAQDTCgAhAQAAAP4EACABAAAA_gQAIB8GAAD-FgAgDAAA4BAAIA0AAOIQACARAACBFwAgHAAA5BAAICUAAOEQACAnAADjEAAgKgAAiRcAIC4AAPoWACAvAAD7FgAgMAAA_RYAIDEAAP8WACAyAACAFwAgNAAA0REAIDUAAIMXACA2AACEFwAgNwAAhRcAIDoAAPkWACA7AAD8FgAgPwAAiBcAIEAAAIIXACBBAACGFwAgQgAAhxcAIEcAAIoXACBIAACLFwAgSQAAjBcAIEoAAIwXACC5BgAA2QwAIOQGAADZDAAgqQcAANkMACCsBwAA2QwAIAMAAAAWACABAACBBQAwAgAA_gQAIAMAAAAWACABAACBBQAwAgAA_gQAIAMAAAAWACABAACBBQAwAgAA_gQAICMGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEAAAOkWACBBAADwFgAgQgAA8RYAIEcAAPUWACBIAAD2FgAgSQAA9xYAIEoAAPgWACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAEBXwAAhQUAIAiFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAEBXwAAhwUAMAFfAACHBQAwIwYAANASACAMAADfEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhAgAAAP4EACBfAACKBQAgCIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhAgAAABYAIF8AAIwFACACAAAAFgAgXwAAjAUAIAMAAAD-BAAgZgAAhQUAIGcAAIoFACABAAAA_gQAIAEAAAAWACAHFQAAxxIAIGwAAMkSACBtAADIEgAguQYAANkMACDkBgAA2QwAIKkHAADZDAAgrAcAANkMACALggYAAMULADCDBgAAkwUAEIQGAADFCwAwhQYBAL8KACGNBkAAwQoAIY4GQADBCgAhuQYAALkLqwcj3gYBAL8KACHkBgEAwAoAIakHAQDACgAhrAcBAMAKACEDAAAAFgAgAQAAkgUAMGsAAJMFACADAAAAFgAgAQAAgQUAMAIAAP4EACABAAAA1QEAIAEAAADVAQAgAwAAANMBACABAADUAQAwAgAA1QEAIAMAAADTAQAgAQAA1AEAMAIAANUBACADAAAA0wEAIAEAANQBADACAADVAQAgHwcAAMUSACA8AADDEgAgPQAAxBIAID8AAMYSACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAC7BwK_BkAAAAAB5AYBAAAAAaYHAQAAAAGnBwEAAAABqAcBAAAAAakHAQAAAAGrBwAAAKsHA6wHAQAAAAGtBwAAANMGA64HEAAAAAGvBwEAAAABsAcCAAAAAbEHAAAA-gYCsgcBAAAAAbMHAQAAAAG0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAeAAAAAAbkHQAAAAAG7BwEAAAABAV8AAJsFACAbhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABpwcBAAAAAagHAQAAAAGpBwEAAAABqwcAAACrBwOsBwEAAAABrQcAAADTBgOuBxAAAAABrwcBAAAAAbAHAgAAAAGxBwAAAPoGArIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHgAAAAAG5B0AAAAABuwcBAAAAAQFfAACdBQAwAV8AAJ0FADABAAAAUQAgAQAAABYAIB8HAAC1EgAgPAAAsxIAID0AALQSACA_AAC2EgAghQYBAN0MACGKBgEA3gwAIY0GQADfDAAhjgZAAN8MACG9BgAAshK7ByK_BkAA9QwAIeQGAQDeDAAhpgcBAN4MACGnBwEA3QwAIagHAQDdDAAhqQcBAN4MACGrBwAArxKrByOsBwEA3gwAIa0HAACwEtMGI64HEACxEgAhrwcBAN0MACGwBwIAkxAAIbEHAADXEfoGIrIHAQDeDAAhswcBAN4MACG0BwEA3gwAIbUHAQDeDAAhtgcBAN4MACG3BwEA3gwAIbgHgAAAAAG5B0AA9QwAIbsHAQDeDAAhAgAAANUBACBfAACiBQAgG4UGAQDdDAAhigYBAN4MACGNBkAA3wwAIY4GQADfDAAhvQYAALISuwcivwZAAPUMACHkBgEA3gwAIaYHAQDeDAAhpwcBAN0MACGoBwEA3QwAIakHAQDeDAAhqwcAAK8SqwcjrAcBAN4MACGtBwAAsBLTBiOuBxAAsRIAIa8HAQDdDAAhsAcCAJMQACGxBwAA1xH6BiKyBwEA3gwAIbMHAQDeDAAhtAcBAN4MACG1BwEA3gwAIbYHAQDeDAAhtwcBAN4MACG4B4AAAAABuQdAAPUMACG7BwEA3gwAIQIAAADTAQAgXwAApAUAIAIAAADTAQAgXwAApAUAIAEAAABRACABAAAAFgAgAwAAANUBACBmAACbBQAgZwAAogUAIAEAAADVAQAgAQAAANMBACAYFQAAqhIAIGwAAK0SACBtAACsEgAg7gEAAKsSACDvAQAArhIAIIoGAADZDAAgvwYAANkMACDkBgAA2QwAIKYHAADZDAAgqQcAANkMACCrBwAA2QwAIKwHAADZDAAgrQcAANkMACCuBwAA2QwAILAHAADZDAAgsgcAANkMACCzBwAA2QwAILQHAADZDAAgtQcAANkMACC2BwAA2QwAILcHAADZDAAguAcAANkMACC5BwAA2QwAILsHAADZDAAgHoIGAAC4CwAwgwYAAK0FABCEBgAAuAsAMIUGAQC_CgAhigYBAMAKACGNBkAAwQoAIY4GQADBCgAhvQYAALwLuwcivwZAANwKACHkBgEAwAoAIaYHAQDACgAhpwcBAL8KACGoBwEAvwoAIakHAQDACgAhqwcAALkLqwcjrAcBAMAKACGtBwAAugvTBiOuBxAAuwsAIa8HAQC_CgAhsAcCAIULACGxBwAAlAv6BiKyBwEAwAoAIbMHAQDACgAhtAcBAMAKACG1BwEAwAoAIbYHAQDACgAhtwcBAMAKACG4BwAAlQsAILkHQADcCgAhuwcBAMAKACEDAAAA0wEAIAEAAKwFADBrAACtBQAgAwAAANMBACABAADUAQAwAgAA1QEAIAEAAAD-AQAgAQAAAP4BACADAAAA_AEAIAEAAP0BADACAAD-AQAgAwAAAPwBACABAAD9AQAwAgAA_gEAIAMAAAD8AQAgAQAA_QEAMAIAAP4BACANBwAAqBIAICAAAKcSACA9AACpEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAApQcCvwZAAAAAAZ0HAQAAAAGjBwAAAKMHAqUHAQAAAAGmBwEAAAABAV8AALUFACAKhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAApQcCvwZAAAAAAZ0HAQAAAAGjBwAAAKMHAqUHAQAAAAGmBwEAAAABAV8AALcFADABXwAAtwUAMAEAAABRACANBwAApRIAICAAAKQSACA9AACmEgAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAAoxKlByK_BkAA9QwAIZ0HAQDdDAAhowcAAKISowcipQcBAN4MACGmBwEA3gwAIQIAAAD-AQAgXwAAuwUAIAqFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAIb0GAACjEqUHIr8GQAD1DAAhnQcBAN0MACGjBwAAohKjByKlBwEA3gwAIaYHAQDeDAAhAgAAAPwBACBfAAC9BQAgAgAAAPwBACBfAAC9BQAgAQAAAFEAIAMAAAD-AQAgZgAAtQUAIGcAALsFACABAAAA_gEAIAEAAAD8AQAgBhUAAJ8SACBsAAChEgAgbQAAoBIAIL8GAADZDAAgpQcAANkMACCmBwAA2QwAIA2CBgAAsQsAMIMGAADFBQAQhAYAALELADCFBgEAvwoAIYoGAQC_CgAhjQZAAMEKACGOBkAAwQoAIb0GAACzC6UHIr8GQADcCgAhnQcBAL8KACGjBwAAsgujByKlBwEAwAoAIaYHAQDACgAhAwAAAPwBACABAADEBQAwawAAxQUAIAMAAAD8AQAgAQAA_QEAMAIAAP4BACABAAAAXQAgAQAAAF0AIAMAAABbACABAABcADACAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIBcQAACADwAgGAAAgQ0AIBkAAIINACAeAAD-DAAgHwAA_wwAICAAAIANACAhAACDDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAV8AAM0FACAQhQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAV8AAM8FADABXwAAzwUAMAEAAABRACABAAAAUwAgAQAAAA4AIAEAAAAYACAXEAAA_g4AIBgAAPoMACAZAAD7DAAgHgAA9wwAIB8AAPgMACAgAAD5DAAgIQAA_AwAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIa8GAQDeDAAhsQYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcimwcBAN0MACGcBwEA3QwAIZ0HAQDdDAAhngcBAN4MACGfBwEA3gwAIaAHAQDeDAAhoQdAAN8MACECAAAAXQAgXwAA1gUAIBCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACGvBgEA3gwAIbEGAQDeDAAhvQYAAPQMmwcivwZAAPUMACHCBgEA3gwAIZkHAADzDJkHIpsHAQDdDAAhnAcBAN0MACGdBwEA3QwAIZ4HAQDeDAAhnwcBAN4MACGgBwEA3gwAIaEHQADfDAAhAgAAAFsAIF8AANgFACACAAAAWwAgXwAA2AUAIAEAAABRACABAAAAUwAgAQAAAA4AIAEAAAAYACADAAAAXQAgZgAAzQUAIGcAANYFACABAAAAXQAgAQAAAFsAIAoVAACcEgAgbAAAnhIAIG0AAJ0SACCvBgAA2QwAILEGAADZDAAgvwYAANkMACDCBgAA2QwAIJ4HAADZDAAgnwcAANkMACCgBwAA2QwAIBOCBgAAqgsAMIMGAADjBQAQhAYAAKoLADCFBgEAvwoAIY0GQADBCgAhjgZAAMEKACGvBgEAwAoAIbEGAQDACgAhvQYAAKwLmwcivwZAANwKACHCBgEAwAoAIZkHAACrC5kHIpsHAQC_CgAhnAcBAL8KACGdBwEAvwoAIZ4HAQDACgAhnwcBAMAKACGgBwEAwAoAIaEHQADBCgAhAwAAAFsAIAEAAOIFADBrAADjBQAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAADwAQAgAQAAAPABACADAAAA7gEAIAEAAO8BADACAADwAQAgAwAAAO4BACABAADvAQAwAgAA8AEAIAMAAADuAQAgAQAA7wEAMAIAAPABACAMBwAAmBIAIEMAAJkSACBFAACaEgAgRgAAmxIAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZYHAQAAAAGXBwAAAJUHAgFfAADrBQAgCIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZYHAQAAAAGXBwAAAJUHAgFfAADtBQAwAV8AAO0FADAMBwAA_BEAIEMAAP0RACBFAAD-EQAgRgAA_xEAIIUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACG3BgEA3QwAIZYHAQDdDAAhlwcAAPYRlQciAgAAAPABACBfAADwBQAgCIUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACG3BgEA3QwAIZYHAQDdDAAhlwcAAPYRlQciAgAAAO4BACBfAADyBQAgAgAAAO4BACBfAADyBQAgAwAAAPABACBmAADrBQAgZwAA8AUAIAEAAADwAQAgAQAAAO4BACADFQAA-REAIGwAAPsRACBtAAD6EQAgC4IGAACpCwAwgwYAAPkFABCEBgAAqQsAMIUGAQC_CgAhigYBAL8KACGNBkAAwQoAIY4GQADBCgAhtgYBAL8KACG3BgEAvwoAIZYHAQC_CgAhlwcAAKYLlQciAwAAAO4BACABAAD4BQAwawAA-QUAIAMAAADuAQAgAQAA7wEAMAIAAPABACABAAAA9AEAIAEAAAD0AQAgAwAAAPIBACABAADzAQAwAgAA9AEAIAMAAADyAQAgAQAA8wEAMAIAAPQBACADAAAA8gEAIAEAAPMBADACAAD0AQAgBUQAAPgRACCFBgEAAAABjQZAAAAAAZIHAQAAAAGVBwAAAJUHAgFfAACBBgAgBIUGAQAAAAGNBkAAAAABkgcBAAAAAZUHAAAAlQcCAV8AAIMGADABXwAAgwYAMAVEAAD3EQAghQYBAN0MACGNBkAA3wwAIZIHAQDdDAAhlQcAAPYRlQciAgAAAPQBACBfAACGBgAgBIUGAQDdDAAhjQZAAN8MACGSBwEA3QwAIZUHAAD2EZUHIgIAAADyAQAgXwAAiAYAIAIAAADyAQAgXwAAiAYAIAMAAAD0AQAgZgAAgQYAIGcAAIYGACABAAAA9AEAIAEAAADyAQAgAxUAAPMRACBsAAD1EQAgbQAA9BEAIAeCBgAApQsAMIMGAACPBgAQhAYAAKULADCFBgEAvwoAIY0GQADBCgAhkgcBAL8KACGVBwAApguVByIDAAAA8gEAIAEAAI4GADBrAACPBgAgAwAAAPIBACABAADzAQAwAgAA9AEAIAEAAAD4AQAgAQAAAPgBACADAAAA9gEAIAEAAPcBADACAAD4AQAgAwAAAPYBACABAAD3AQAwAgAA-AEAIAMAAAD2AQAgAQAA9wEAMAIAAPgBACAGAwAA8hEAIEQAAPERACCFBgEAAAABjAYBAAAAAZIHAQAAAAGTB0AAAAABAV8AAJcGACAEhQYBAAAAAYwGAQAAAAGSBwEAAAABkwdAAAAAAQFfAACZBgAwAV8AAJkGADAGAwAA8BEAIEQAAO8RACCFBgEA3QwAIYwGAQDdDAAhkgcBAN0MACGTB0AA3wwAIQIAAAD4AQAgXwAAnAYAIASFBgEA3QwAIYwGAQDdDAAhkgcBAN0MACGTB0AA3wwAIQIAAAD2AQAgXwAAngYAIAIAAAD2AQAgXwAAngYAIAMAAAD4AQAgZgAAlwYAIGcAAJwGACABAAAA-AEAIAEAAAD2AQAgAxUAAOwRACBsAADuEQAgbQAA7REAIAeCBgAApAsAMIMGAAClBgAQhAYAAKQLADCFBgEAvwoAIYwGAQC_CgAhkgcBAL8KACGTB0AAwQoAIQMAAAD2AQAgAQAApAYAMGsAAKUGACADAAAA9gEAIAEAAPcBADACAAD4AQAgAQAAAHYAIAEAAAB2ACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAAB0ACABAAB1ADACAAB2ACAOBwAA_Q8AIAkAAP4PACAbAADrEQAgHAAA_w8AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB1gYBAAAAAeYGAQAAAAGIByAAAAABkAcQAAAAAZEHEAAAAAEBXwAArQYAIAqFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdYGAQAAAAHmBgEAAAABiAcgAAAAAZAHEAAAAAGRBxAAAAABAV8AAK8GADABXwAArwYAMA4HAADwDwAgCQAA8Q8AIBsAAOoRACAcAADyDwAghQYBAN0MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIdYGAQDdDAAh5gYBAN0MACGIByAAvw4AIZAHEADlDgAhkQcQAOUOACECAAAAdgAgXwAAsgYAIAqFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAh1gYBAN0MACHmBgEA3QwAIYgHIAC_DgAhkAcQAOUOACGRBxAA5Q4AIQIAAAB0ACBfAAC0BgAgAgAAAHQAIF8AALQGACADAAAAdgAgZgAArQYAIGcAALIGACABAAAAdgAgAQAAAHQAIAUVAADlEQAgbAAA6BEAIG0AAOcRACDuAQAA5hEAIO8BAADpEQAgDYIGAACjCwAwgwYAALsGABCEBgAAowsAMIUGAQC_CgAhigYBAL8KACGLBgEAvwoAIY0GQADBCgAhjgZAAMEKACHWBgEAvwoAIeYGAQC_CgAhiAcgAM0KACGQBxAA7AoAIZEHEADsCgAhAwAAAHQAIAEAALoGADBrAAC7BgAgAwAAAHQAIAEAAHUAMAIAAHYAIAEAAABXACABAAAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIAMAAABVACABAABWADACAABXACADAAAAVQAgAQAAVgAwAgAAVwAgHAcAAJMPACAJAACUDwAgGQAA5A8AIBsAAJUPACAdAACWDwAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAAQFfAADDBgAgF4UGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEBXwAAxQYAMAFfAADFBgAwHAcAAI4PACAJAACPDwAgGQAA4g8AIBsAAJAPACAdAACRDwAghQYBAN0MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbEGAQDdDAAhvQYAAIwPjgci1QYQAOUOACHWBgEA3QwAIdcGAgDmDgAh5gYBAN0MACH6BgEA3QwAIfsGAQDeDAAh_AYBAN4MACH9BgEA3gwAIf4GAQDeDAAh_wYBAN4MACGAB4AAAAABgQdAAPUMACGKBwEA3QwAIYwHAACLD4wHIo4HAQDdDAAhjwdAAN8MACECAAAAVwAgXwAAyAYAIBeFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN0MACG9BgAAjA-OByLVBhAA5Q4AIdYGAQDdDAAh1wYCAOYOACHmBgEA3QwAIfoGAQDdDAAh-wYBAN4MACH8BgEA3gwAIf0GAQDeDAAh_gYBAN4MACH_BgEA3gwAIYAHgAAAAAGBB0AA9QwAIYoHAQDdDAAhjAcAAIsPjAcijgcBAN0MACGPB0AA3wwAIQIAAABVACBfAADKBgAgAgAAAFUAIF8AAMoGACADAAAAVwAgZgAAwwYAIGcAAMgGACABAAAAVwAgAQAAAFUAIAwVAADgEQAgbAAA4xEAIG0AAOIRACDuAQAA4REAIO8BAADkEQAg-wYAANkMACD8BgAA2QwAIP0GAADZDAAg_gYAANkMACD_BgAA2QwAIIAHAADZDAAggQcAANkMACAaggYAAJwLADCDBgAA0QYAEIQGAACcCwAwhQYBAL8KACGKBgEAvwoAIYsGAQC_CgAhjQZAAMEKACGOBkAAwQoAIbEGAQC_CgAhvQYAAJ4Ljgci1QYQAOwKACHWBgEAvwoAIdcGAgDtCgAh5gYBAL8KACH6BgEAvwoAIfsGAQDACgAh_AYBAMAKACH9BgEAwAoAIf4GAQDACgAh_wYBAMAKACGABwAAlQsAIIEHQADcCgAhigcBAL8KACGMBwAAnQuMByKOBwEAvwoAIY8HQADBCgAhAwAAAFUAIAEAANAGADBrAADRBgAgAwAAAFUAIAEAAFYAMAIAAFcAIBAHAACbCwAgggYAAJoLADCDBgAA5QEAEIQGAACaCwAwhQYBAAAAAYoGAQAAAAGNBkAA1goAIY4GQADWCgAhggcBANIKACGDBwEA0goAIYQHAQDSCgAhhQcBANIKACGGBwEA0goAIYcHAQDSCgAhiAcgANUKACGJBwEA0woAIQEAAADUBgAgAQAAANQGACACBwAA3xEAIIkHAADZDAAgAwAAAOUBACABAADXBgAwAgAA1AYAIAMAAADlAQAgAQAA1wYAMAIAANQGACADAAAA5QEAIAEAANcGADACAADUBgAgDQcAAN4RACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABggcBAAAAAYMHAQAAAAGEBwEAAAABhQcBAAAAAYYHAQAAAAGHBwEAAAABiAcgAAAAAYkHAQAAAAEBXwAA2wYAIAyFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABggcBAAAAAYMHAQAAAAGEBwEAAAABhQcBAAAAAYYHAQAAAAGHBwEAAAABiAcgAAAAAYkHAQAAAAEBXwAA3QYAMAFfAADdBgAwDQcAAN0RACCFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAIYIHAQDdDAAhgwcBAN0MACGEBwEA3QwAIYUHAQDdDAAhhgcBAN0MACGHBwEA3QwAIYgHIAC_DgAhiQcBAN4MACECAAAA1AYAIF8AAOAGACAMhQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACGCBwEA3QwAIYMHAQDdDAAhhAcBAN0MACGFBwEA3QwAIYYHAQDdDAAhhwcBAN0MACGIByAAvw4AIYkHAQDeDAAhAgAAAOUBACBfAADiBgAgAgAAAOUBACBfAADiBgAgAwAAANQGACBmAADbBgAgZwAA4AYAIAEAAADUBgAgAQAAAOUBACAEFQAA2hEAIGwAANwRACBtAADbEQAgiQcAANkMACAPggYAAJkLADCDBgAA6QYAEIQGAACZCwAwhQYBAL8KACGKBgEAvwoAIY0GQADBCgAhjgZAAMEKACGCBwEAvwoAIYMHAQC_CgAhhAcBAL8KACGFBwEAvwoAIYYHAQC_CgAhhwcBAL8KACGIByAAzQoAIYkHAQDACgAhAwAAAOUBACABAADoBgAwawAA6QYAIAMAAADlAQAgAQAA1wYAMAIAANQGACABAAAA6QEAIAEAAADpAQAgAwAAAOcBACABAADoAQAwAgAA6QEAIAMAAADnAQAgAQAA6AEAMAIAAOkBACADAAAA5wEAIAEAAOgBADACAADpAQAgEwcAANkRACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAD6BgLTBgAAANMGAtUGEAAAAAHWBgEAAAAB1wYCAAAAAfgGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGAB4AAAAABgQdAAAAAAQFfAADxBgAgEoUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAPoGAtMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-AYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABAV8AAPMGADABXwAA8wYAMBMHAADYEQAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAA1xH6BiLTBgAA4w7TBiLVBhAA5Q4AIdYGAQDdDAAh1wYCAOYOACH4BgEA3QwAIfoGAQDdDAAh-wYBAN4MACH8BgEA3gwAIf0GAQDeDAAh_gYBAN4MACH_BgEA3gwAIYAHgAAAAAGBB0AA9QwAIQIAAADpAQAgXwAA9gYAIBKFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAIb0GAADXEfoGItMGAADjDtMGItUGEADlDgAh1gYBAN0MACHXBgIA5g4AIfgGAQDdDAAh-gYBAN0MACH7BgEA3gwAIfwGAQDeDAAh_QYBAN4MACH-BgEA3gwAIf8GAQDeDAAhgAeAAAAAAYEHQAD1DAAhAgAAAOcBACBfAAD4BgAgAgAAAOcBACBfAAD4BgAgAwAAAOkBACBmAADxBgAgZwAA9gYAIAEAAADpAQAgAQAAAOcBACAMFQAA0hEAIGwAANURACBtAADUEQAg7gEAANMRACDvAQAA1hEAIPsGAADZDAAg_AYAANkMACD9BgAA2QwAIP4GAADZDAAg_wYAANkMACCABwAA2QwAIIEHAADZDAAgFYIGAACTCwAwgwYAAP8GABCEBgAAkwsAMIUGAQC_CgAhigYBAL8KACGNBkAAwQoAIY4GQADBCgAhvQYAAJQL-gYi0wYAAOoK0wYi1QYQAOwKACHWBgEAvwoAIdcGAgDtCgAh-AYBAL8KACH6BgEAvwoAIfsGAQDACgAh_AYBAMAKACH9BgEAwAoAIf4GAQDACgAh_wYBAMAKACGABwAAlQsAIIEHQADcCgAhAwAAAOcBACABAAD-BgAwawAA_wYAIAMAAADnAQAgAQAA6AEAMAIAAOkBACAQFAAAkgsAIIIGAACRCwAwgwYAAIUHABCEBgAAkQsAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAh8gYBANMKACHzBgEA0goAIfQGAADLCgAg9QYBANMKACH2BgEA0woAIfcGAQDSCgAhAQAAAIIHACABAAAAggcAIBAUAACSCwAgggYAAJELADCDBgAAhQcAEIQGAACRCwAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAh8gYBANMKACHzBgEA0goAIfQGAADLCgAg9QYBANMKACH2BgEA0woAIfcGAQDSCgAhBRQAANERACCLBgAA2QwAIPIGAADZDAAg9QYAANkMACD2BgAA2QwAIAMAAACFBwAgAQAAhgcAMAIAAIIHACADAAAAhQcAIAEAAIYHADACAACCBwAgAwAAAIUHACABAACGBwAwAgAAggcAIA0UAADQEQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB8gYBAAAAAfMGAQAAAAH0BgAAzxEAIPUGAQAAAAH2BgEAAAAB9wYBAAAAAQFfAACKBwAgDIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAfIGAQAAAAHzBgEAAAAB9AYAAM8RACD1BgEAAAAB9gYBAAAAAfcGAQAAAAEBXwAAjAcAMAFfAACMBwAwDRQAAMURACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACHyBgEA3gwAIfMGAQDdDAAh9AYAAMQRACD1BgEA3gwAIfYGAQDeDAAh9wYBAN0MACECAAAAggcAIF8AAI8HACAMhQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIbYGAQDdDAAh8gYBAN4MACHzBgEA3QwAIfQGAADEEQAg9QYBAN4MACH2BgEA3gwAIfcGAQDdDAAhAgAAAIUHACBfAACRBwAgAgAAAIUHACBfAACRBwAgAwAAAIIHACBmAACKBwAgZwAAjwcAIAEAAACCBwAgAQAAAIUHACAHFQAAwREAIGwAAMMRACBtAADCEQAgiwYAANkMACDyBgAA2QwAIPUGAADZDAAg9gYAANkMACAPggYAAJALADCDBgAAmAcAEIQGAACQCwAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAIbYGAQC_CgAh8gYBAMAKACHzBgEAvwoAIfQGAADLCgAg9QYBAMAKACH2BgEAwAoAIfcGAQC_CgAhAwAAAIUHACABAACXBwAwawAAmAcAIAMAAACFBwAgAQAAhgcAMAIAAIIHACAQFAAAjwsAIIIGAACOCwAwgwYAAJ4HABCEBgAAjgsAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAh8gYBANMKACHzBgEA0goAIfQGAADLCgAg9QYBANMKACH2BgEA0woAIfcGAQDSCgAhAQAAAJsHACABAAAAmwcAIBAUAACPCwAgggYAAI4LADCDBgAAngcAEIQGAACOCwAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAh8gYBANMKACHzBgEA0goAIfQGAADLCgAg9QYBANMKACH2BgEA0woAIfcGAQDSCgAhBRQAAMARACCLBgAA2QwAIPIGAADZDAAg9QYAANkMACD2BgAA2QwAIAMAAACeBwAgAQAAnwcAMAIAAJsHACADAAAAngcAIAEAAJ8HADACAACbBwAgAwAAAJ4HACABAACfBwAwAgAAmwcAIA0UAAC_EQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB8gYBAAAAAfMGAQAAAAH0BgAAvhEAIPUGAQAAAAH2BgEAAAAB9wYBAAAAAQFfAACjBwAgDIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAfIGAQAAAAHzBgEAAAAB9AYAAL4RACD1BgEAAAAB9gYBAAAAAfcGAQAAAAEBXwAApQcAMAFfAAClBwAwDRQAALQRACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACHyBgEA3gwAIfMGAQDdDAAh9AYAALMRACD1BgEA3gwAIfYGAQDeDAAh9wYBAN0MACECAAAAmwcAIF8AAKgHACAMhQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIbYGAQDdDAAh8gYBAN4MACHzBgEA3QwAIfQGAACzEQAg9QYBAN4MACH2BgEA3gwAIfcGAQDdDAAhAgAAAJ4HACBfAACqBwAgAgAAAJ4HACBfAACqBwAgAwAAAJsHACBmAACjBwAgZwAAqAcAIAEAAACbBwAgAQAAAJ4HACAHFQAAsBEAIGwAALIRACBtAACxEQAgiwYAANkMACDyBgAA2QwAIPUGAADZDAAg9gYAANkMACAPggYAAI0LADCDBgAAsQcAEIQGAACNCwAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAIbYGAQC_CgAh8gYBAMAKACHzBgEAvwoAIfQGAADLCgAg9QYBAMAKACH2BgEAwAoAIfcGAQC_CgAhAwAAAJ4HACABAACwBwAwawAAsQcAIAMAAACeBwAgAQAAnwcAMAIAAJsHACABAAAAHwAgAQAAAB8AIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIA8HAACuEQAgCQAArxEAIA0AAK0RACAPAACsEQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB5AYBAAAAAe4GAQAAAAHvBkAAAAAB8AYIAAAAAfEGCAAAAAEBXwAAuQcAIAuFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAHkBgEAAAAB7gYBAAAAAe8GQAAAAAHwBggAAAAB8QYIAAAAAQFfAAC7BwAwAV8AALsHADAPBwAA-xAAIAkAAPwQACANAAD6EAAgDwAA-RAAIIUGAQDdDAAhigYBAN0MACGLBgEA3QwAIY0GQADfDAAhjgZAAN8MACG2BgEA3QwAIeQGAQDeDAAh7gYBAN4MACHvBkAA9QwAIfAGCACODQAh8QYIAI4NACECAAAAHwAgXwAAvgcAIAuFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACHkBgEA3gwAIe4GAQDeDAAh7wZAAPUMACHwBggAjg0AIfEGCACODQAhAgAAAB0AIF8AAMAHACACAAAAHQAgXwAAwAcAIAMAAAAfACBmAAC5BwAgZwAAvgcAIAEAAAAfACABAAAAHQAgChUAAPQQACBsAAD3EAAgbQAA9hAAIO4BAAD1EAAg7wEAAPgQACDkBgAA2QwAIO4GAADZDAAg7wYAANkMACDwBgAA2QwAIPEGAADZDAAgDoIGAACMCwAwgwYAAMcHABCEBgAAjAsAMIUGAQC_CgAhigYBAL8KACGLBgEAvwoAIY0GQADBCgAhjgZAAMEKACG2BgEAvwoAIeQGAQDACgAh7gYBAMAKACHvBkAA3AoAIfAGCADmCgAh8QYIAOYKACEDAAAAHQAgAQAAxgcAMGsAAMcHACADAAAAHQAgAQAAHgAwAgAAHwAgAQAAACwAIAEAAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACAQBwAApA4AIAkAAKUOACAoAACiDgAgKQAA1hAAICsAAKMOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAcMGAQAAAAHeBgEAAAAB5AYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQFfAADPBwAgC4UGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABwwYBAAAAAd4GAQAAAAHkBgEAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAABAV8AANEHADABXwAA0QcAMAEAAAAWACABAAAAGAAgEAcAAJ8OACAJAACgDgAgKAAAnQ4AICkAANQQACArAACeDgAghQYBAN0MACGKBgEA3gwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIcMGAQDdDAAh3gYBAN0MACHkBgEA3gwAIesGAQDeDAAh7AYBAN0MACHtBgEA3QwAIQIAAAAsACBfAADWBwAgC4UGAQDdDAAhigYBAN4MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHDBgEA3QwAId4GAQDdDAAh5AYBAN4MACHrBgEA3gwAIewGAQDdDAAh7QYBAN0MACECAAAAKgAgXwAA2AcAIAIAAAAqACBfAADYBwAgAQAAABYAIAEAAAAYACADAAAALAAgZgAAzwcAIGcAANYHACABAAAALAAgAQAAACoAIAcVAADxEAAgbAAA8xAAIG0AAPIQACCKBgAA2QwAIIsGAADZDAAg5AYAANkMACDrBgAA2QwAIA6CBgAAiwsAMIMGAADhBwAQhAYAAIsLADCFBgEAvwoAIYoGAQDACgAhiwYBAMAKACGNBkAAwQoAIY4GQADBCgAhwwYBAL8KACHeBgEAvwoAIeQGAQDACgAh6wYBAMAKACHsBgEAvwoAIe0GAQC_CgAhAwAAACoAIAEAAOAHADBrAADhBwAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAzACABAAAAMwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgDwcAANkQACAJAADaEAAgCwAA2BAAIBsAAPAQACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA6wYC3gYBAAAAAeQGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAEBXwAA6QcAIAuFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA6wYC3gYBAAAAAeQGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAEBXwAA6wcAMAFfAADrBwAwAQAAAC8AIAEAAAAWACABAAAAGAAgDwcAAMoQACAJAADLEAAgCwAAyRAAIBsAAO8QACCFBgEA3QwAIYoGAQDeDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhvQYAAMcQ6wYi3gYBAN0MACHkBgEA3gwAIeYGAQDeDAAh6AYBAN0MACHpBgEA3QwAIQIAAAAzACBfAADxBwAgC4UGAQDdDAAhigYBAN4MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACG9BgAAxxDrBiLeBgEA3QwAIeQGAQDeDAAh5gYBAN4MACHoBgEA3QwAIekGAQDdDAAhAgAAADEAIF8AAPMHACACAAAAMQAgXwAA8wcAIAEAAAAvACABAAAAFgAgAQAAABgAIAMAAAAzACBmAADpBwAgZwAA8QcAIAEAAAAzACABAAAAMQAgBxUAAOwQACBsAADuEAAgbQAA7RAAIIoGAADZDAAgiwYAANkMACDkBgAA2QwAIOYGAADZDAAgDoIGAACHCwAwgwYAAP0HABCEBgAAhwsAMIUGAQC_CgAhigYBAMAKACGLBgEAwAoAIY0GQADBCgAhjgZAAMEKACG9BgAAiAvrBiLeBgEAvwoAIeQGAQDACgAh5gYBAMAKACHoBgEAvwoAIekGAQC_CgAhAwAAADEAIAEAAPwHADBrAAD9BwAgAwAAADEAIAEAADIAMAIAADMAIAEAAAA3ACABAAAANwAgAwAAADUAIAEAADYAMAIAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgEQcAALoQACAJAAC7EAAgDQAAtxAAIBEAALgQACAbAADrEAAgJAAAuRAAICYAALwQACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAAB5QYCAAAAAeYGAQAAAAHnBgEAAAABAV8AAIUIACAKhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAeUGAgAAAAHmBgEAAAAB5wYBAAAAAQFfAACHCAAwAV8AAIcIADABAAAAGAAgAQAAAGsAIBEHAACYEAAgCQAAmRAAIA0AAJUQACARAACWEAAgGwAA6hAAICQAAJcQACAmAACaEAAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAh5AYBAN4MACHlBgIAkxAAIeYGAQDdDAAh5wYBAN4MACECAAAANwAgXwAAjAgAIAqFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACHkBgEA3gwAIeUGAgCTEAAh5gYBAN0MACHnBgEA3gwAIQIAAAA1ACBfAACOCAAgAgAAADUAIF8AAI4IACABAAAAGAAgAQAAAGsAIAMAAAA3ACBmAACFCAAgZwAAjAgAIAEAAAA3ACABAAAANQAgCRUAAOUQACBsAADoEAAgbQAA5xAAIO4BAADmEAAg7wEAAOkQACCLBgAA2QwAIOQGAADZDAAg5QYAANkMACDnBgAA2QwAIA2CBgAAhAsAMIMGAACXCAAQhAYAAIQLADCFBgEAvwoAIYoGAQC_CgAhiwYBAMAKACGNBkAAwQoAIY4GQADBCgAh3gYBAL8KACHkBgEAwAoAIeUGAgCFCwAh5gYBAL8KACHnBgEAwAoAIQMAAAA1ACABAACWCAAwawAAlwgAIAMAAAA1ACABAAA2ADACAAA3ACANDAAA_woAIA0AAIELACAcAACDCwAgJQAAgAsAICcAAIILACCCBgAA_goAMIMGAAAvABCEBgAA_goAMIUGAQAAAAGKBgEA0goAId4GAQDSCgAh3wZAANYKACHgBkAA1goAIQEAAACaCAAgAQAAAJoIACAFDAAA4BAAIA0AAOIQACAcAADkEAAgJQAA4RAAICcAAOMQACADAAAALwAgAQAAnQgAMAIAAJoIACADAAAALwAgAQAAnQgAMAIAAJoIACADAAAALwAgAQAAnQgAMAIAAJoIACAKDAAA2xAAIA0AAN0QACAcAADfEAAgJQAA3BAAICcAAN4QACCFBgEAAAABigYBAAAAAd4GAQAAAAHfBkAAAAAB4AZAAAAAAQFfAAChCAAgBYUGAQAAAAGKBgEAAAAB3gYBAAAAAd8GQAAAAAHgBkAAAAABAV8AAKMIADABXwAAowgAMAoMAADVDwAgDQAA1w8AIBwAANkPACAlAADWDwAgJwAA2A8AIIUGAQDdDAAhigYBAN0MACHeBgEA3QwAId8GQADfDAAh4AZAAN8MACECAAAAmggAIF8AAKYIACAFhQYBAN0MACGKBgEA3QwAId4GAQDdDAAh3wZAAN8MACHgBkAA3wwAIQIAAAAvACBfAACoCAAgAgAAAC8AIF8AAKgIACADAAAAmggAIGYAAKEIACBnAACmCAAgAQAAAJoIACABAAAALwAgAxUAANIPACBsAADUDwAgbQAA0w8AIAiCBgAA_QoAMIMGAACvCAAQhAYAAP0KADCFBgEAvwoAIYoGAQC_CgAh3gYBAL8KACHfBkAAwQoAIeAGQADBCgAhAwAAAC8AIAEAAK4IADBrAACvCAAgAwAAAC8AIAEAAJ0IADACAACaCAAgDRcAANcKACCCBgAA_AoAMIMGAACyAgAQhAYAAPwKADCFBgEAAAABjQZAANYKACGOBkAA1goAIZsGAQDSCgAhnAYBANIKACGhBgAA1AoAIKMGIADVCgAh3AYBAAAAAd0GAADLCgAgAQAAALIIACABAAAAsggAIAEXAADEDgAgAwAAALICACABAAC1CAAwAgAAsggAIAMAAACyAgAgAQAAtQgAMAIAALIIACADAAAAsgIAIAEAALUIADACAACyCAAgChcAANEPACCFBgEAAAABjQZAAAAAAY4GQAAAAAGbBgEAAAABnAYBAAAAAaEGgAAAAAGjBiAAAAAB3AYBAAAAAd0GAADQDwAgAV8AALkIACAJhQYBAAAAAY0GQAAAAAGOBkAAAAABmwYBAAAAAZwGAQAAAAGhBoAAAAABowYgAAAAAdwGAQAAAAHdBgAA0A8AIAFfAAC7CAAwAV8AALsIADAKFwAAzw8AIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIZsGAQDdDAAhnAYBAN0MACGhBoAAAAABowYgAL8OACHcBgEA3QwAId0GAADODwAgAgAAALIIACBfAAC-CAAgCYUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIZsGAQDdDAAhnAYBAN0MACGhBoAAAAABowYgAL8OACHcBgEA3QwAId0GAADODwAgAgAAALICACBfAADACAAgAgAAALICACBfAADACAAgAwAAALIIACBmAAC5CAAgZwAAvggAIAEAAACyCAAgAQAAALICACADFQAAyw8AIGwAAM0PACBtAADMDwAgDIIGAAD7CgAwgwYAAMcIABCEBgAA-woAMIUGAQC_CgAhjQZAAMEKACGOBkAAwQoAIZsGAQC_CgAhnAYBAL8KACGhBgAAzAoAIKMGIADNCgAh3AYBAL8KACHdBgAAywoAIAMAAACyAgAgAQAAxggAMGsAAMcIACADAAAAsgIAIAEAALUIADACAACyCAAgAQAAAE0AIAEAAABNACADAAAASwAgAQAATAAwAgAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACAQFgAApw8AIBcAAKgPACAYAACpDwAgGQAAyg8AIIUGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG7BgEAAAABvQYAAADcBgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABwgYBAAAAAdwGAQAAAAEBXwAAzwgAIAyFBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABuwYBAAAAAb0GAAAA3AYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAHcBgEAAAABAV8AANEIADABXwAA0QgAMAEAAABRACABAAAAUwAgEBYAAKMPACAXAACkDwAgGAAApQ8AIBkAAMkPACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACGxBgEA3gwAIbsGAQDeDAAhvQYAAKEP3AYivgYBAN4MACG_BkAA9QwAIcAGQADfDAAhwQYBAN0MACHCBgEA3gwAIdwGAQDdDAAhAgAAAE0AIF8AANYIACAMhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN4MACG7BgEA3gwAIb0GAAChD9wGIr4GAQDeDAAhvwZAAPUMACHABkAA3wwAIcEGAQDdDAAhwgYBAN4MACHcBgEA3QwAIQIAAABLACBfAADYCAAgAgAAAEsAIF8AANgIACABAAAAUQAgAQAAAFMAIAMAAABNACBmAADPCAAgZwAA1ggAIAEAAABNACABAAAASwAgCBUAAMYPACBsAADIDwAgbQAAxw8AILEGAADZDAAguwYAANkMACC-BgAA2QwAIL8GAADZDAAgwgYAANkMACAPggYAAPcKADCDBgAA4QgAEIQGAAD3CgAwhQYBAL8KACGNBkAAwQoAIY4GQADBCgAhsQYBAMAKACG7BgEAwAoAIb0GAAD4CtwGIr4GAQDACgAhvwZAANwKACHABkAAwQoAIcEGAQC_CgAhwgYBAMAKACHcBgEAvwoAIQMAAABLACABAADgCAAwawAA4QgAIAMAAABLACABAABMADACAABNACABAAAAnQEAIAEAAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgEAMAAMAPACAHAAC-DwAgCQAAvw8AIA0AAMEPACATAADCDwAgGgAAww8AIBwAAMQPACAiAADFDwAghQYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAEBXwAA6QgAIAiFBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAAB2gYBAAAAAQFfAADrCAAwAV8AAOsIADABAAAAGAAgEAMAAPAOACAHAADuDgAgCQAA7w4AIA0AAPEOACATAADyDgAgGgAA8w4AIBwAAPQOACAiAAD1DgAghQYBAN0MACGJBgEA3gwAIYoGAQDdDAAhiwYBAN4MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACHaBgEA3QwAIQIAAACdAQAgXwAA7wgAIAiFBgEA3QwAIYkGAQDeDAAhigYBAN0MACGLBgEA3gwAIYwGAQDdDAAhjQZAAN8MACGOBkAA3wwAIdoGAQDdDAAhAgAAAFMAIF8AAPEIACACAAAAUwAgXwAA8QgAIAEAAAAYACADAAAAnQEAIGYAAOkIACBnAADvCAAgAQAAAJ0BACABAAAAUwAgBRUAAOsOACBsAADtDgAgbQAA7A4AIIkGAADZDAAgiwYAANkMACALggYAAPYKADCDBgAA-QgAEIQGAAD2CgAwhQYBAL8KACGJBgEAwAoAIYoGAQC_CgAhiwYBAMAKACGMBgEAvwoAIY0GQADBCgAhjgZAAMEKACHaBgEAvwoAIQMAAABTACABAAD4CAAwawAA-QgAIAMAAABTACABAACcAQAwAgAAnQEAIAEAAADbAQAgAQAAANsBACADAAAA2QEAIAEAANoBADACAADbAQAgAwAAANkBACABAADaAQAwAgAA2wEAIAMAAADZAQAgAQAA2gEAMAIAANsBACAOBwAA6Q4AID4AAOoOACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADVBgLRBgEAAAAB0wYAAADTBgLVBhAAAAAB1gYBAAAAAdcGAgAAAAHYBkAAAAAB2QZAAAAAAQFfAACBCQAgDIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAANUGAtEGAQAAAAHTBgAAANMGAtUGEAAAAAHWBgEAAAAB1wYCAAAAAdgGQAAAAAHZBkAAAAABAV8AAIMJADABXwAAgwkAMAEAAADTAQAgDgcAAOcOACA-AADoDgAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAA5A7VBiLRBgEA3gwAIdMGAADjDtMGItUGEADlDgAh1gYBAN0MACHXBgIA5g4AIdgGQADfDAAh2QZAAN8MACECAAAA2wEAIF8AAIcJACAMhQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAA5A7VBiLRBgEA3gwAIdMGAADjDtMGItUGEADlDgAh1gYBAN0MACHXBgIA5g4AIdgGQADfDAAh2QZAAN8MACECAAAA2QEAIF8AAIkJACACAAAA2QEAIF8AAIkJACABAAAA0wEAIAMAAADbAQAgZgAAgQkAIGcAAIcJACABAAAA2wEAIAEAAADZAQAgBhUAAN4OACBsAADhDgAgbQAA4A4AIO4BAADfDgAg7wEAAOIOACDRBgAA2QwAIA-CBgAA6QoAMIMGAACRCQAQhAYAAOkKADCFBgEAvwoAIYoGAQC_CgAhjQZAAMEKACGOBkAAwQoAIb0GAADrCtUGItEGAQDACgAh0wYAAOoK0wYi1QYQAOwKACHWBgEAvwoAIdcGAgDtCgAh2AZAAMEKACHZBkAAwQoAIQMAAADZAQAgAQAAkAkAMGsAAJEJACADAAAA2QEAIAEAANoBADACAADbAQAgAQAAAK0BACABAAAArQEAIAMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAIkBACABAACsAQAwAgAArQEAIBgHAACVDQAgCQAAlg0AIBAAAIQOACApAACUDQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABwwYBAAAAAcQGCAAAAAHFBggAAAABxgYIAAAAAccGCAAAAAHIBggAAAAByQYIAAAAAcoGCAAAAAHLBggAAAABzAYIAAAAAc0GCAAAAAHOBggAAAABzwYIAAAAAdAGCAAAAAEBXwAAmQkAIBSFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAHDBgEAAAABxAYIAAAAAcUGCAAAAAHGBggAAAABxwYIAAAAAcgGCAAAAAHJBggAAAABygYIAAAAAcsGCAAAAAHMBggAAAABzQYIAAAAAc4GCAAAAAHPBggAAAAB0AYIAAAAAQFfAACbCQAwAV8AAJsJADABAAAAGAAgGAcAAJENACAJAACSDQAgEAAAgw4AICkAAJANACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrwYBAN0MACHDBgEA3QwAIcQGCACODQAhxQYIAI4NACHGBggAjg0AIccGCACODQAhyAYIAI4NACHJBggAjg0AIcoGCACODQAhywYIAI4NACHMBggAjg0AIc0GCACODQAhzgYIAI4NACHPBggAjg0AIdAGCACODQAhAgAAAK0BACBfAACfCQAgFIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGvBgEA3QwAIcMGAQDdDAAhxAYIAI4NACHFBggAjg0AIcYGCACODQAhxwYIAI4NACHIBggAjg0AIckGCACODQAhygYIAI4NACHLBggAjg0AIcwGCACODQAhzQYIAI4NACHOBggAjg0AIc8GCACODQAh0AYIAI4NACECAAAAiQEAIF8AAKEJACACAAAAiQEAIF8AAKEJACABAAAAGAAgAwAAAK0BACBmAACZCQAgZwAAnwkAIAEAAACtAQAgAQAAAIkBACATFQAA2Q4AIGwAANwOACBtAADbDgAg7gEAANoOACDvAQAA3Q4AIIsGAADZDAAgxAYAANkMACDFBgAA2QwAIMYGAADZDAAgxwYAANkMACDIBgAA2QwAIMkGAADZDAAgygYAANkMACDLBgAA2QwAIMwGAADZDAAgzQYAANkMACDOBgAA2QwAIM8GAADZDAAg0AYAANkMACAXggYAAOUKADCDBgAAqQkAEIQGAADlCgAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAIa8GAQC_CgAhwwYBAL8KACHEBggA5goAIcUGCADmCgAhxgYIAOYKACHHBggA5goAIcgGCADmCgAhyQYIAOYKACHKBggA5goAIcsGCADmCgAhzAYIAOYKACHNBggA5goAIc4GCADmCgAhzwYIAOYKACHQBggA5goAIQMAAACJAQAgAQAAqAkAMGsAAKkJACADAAAAiQEAIAEAAKwBADACAACtAQAgAQAAAKMBACABAAAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAKEBACABAACiAQAwAgAAowEAIBQHAACsDQAgCQAArQ0AIBAAANgOACAWAACpDQAgGAAAqw0AIDMAAKoNACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAEBXwAAsQkAIA6FBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAEBXwAAswkAMAFfAACzCQAwAQAAAFEAIAEAAAAOACABAAAAGAAgFAcAAKYNACAJAACnDQAgEAAA1w4AIBYAAKMNACAYAAClDQAgMwAApA0AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGaBgEA3QwAIa8GAQDeDAAhuwYBAN4MACG9BgAAoQ29BiK-BgEA3gwAIb8GQAD1DAAhwAZAAN8MACHBBgEA3QwAIcIGAQDeDAAhAgAAAKMBACBfAAC5CQAgDoUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGaBgEA3QwAIa8GAQDeDAAhuwYBAN4MACG9BgAAoQ29BiK-BgEA3gwAIb8GQAD1DAAhwAZAAN8MACHBBgEA3QwAIcIGAQDeDAAhAgAAAKEBACBfAAC7CQAgAgAAAKEBACBfAAC7CQAgAQAAAFEAIAEAAAAOACABAAAAGAAgAwAAAKMBACBmAACxCQAgZwAAuQkAIAEAAACjAQAgAQAAAKEBACAJFQAA1A4AIGwAANYOACBtAADVDgAgiwYAANkMACCvBgAA2QwAILsGAADZDAAgvgYAANkMACC_BgAA2QwAIMIGAADZDAAgEYIGAADhCgAwgwYAAMUJABCEBgAA4QoAMIUGAQC_CgAhigYBAL8KACGLBgEAwAoAIY0GQADBCgAhjgZAAMEKACGaBgEAvwoAIa8GAQDACgAhuwYBAMAKACG9BgAA4gq9BiK-BgEAwAoAIb8GQADcCgAhwAZAAMEKACHBBgEAvwoAIcIGAQDACgAhAwAAAKEBACABAADECQAwawAAxQkAIAMAAAChAQAgAQAAogEAMAIAAKMBACABAAAAQQAgAQAAAEEAIAMAAAA_ACABAABAADACAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIBAHAADSDQAgCQAA0w0AIA4AANENACAQAADTDgAgIwAA1A0AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa8GAQAAAAG2BgEAAAABtwYBAAAAAbkGAAAAuQYCugZAAAAAAQFfAADNCQAgC4UGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa8GAQAAAAG2BgEAAAABtwYBAAAAAbkGAAAAuQYCugZAAAAAAQFfAADPCQAwAV8AAM8JADABAAAAGAAgEAcAALsNACAJAAC8DQAgDgAAug0AIBAAANIOACAjAAC9DQAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrwYBAN0MACG2BgEA3QwAIbcGAQDeDAAhuQYAALgNuQYiugZAAPUMACECAAAAQQAgXwAA0wkAIAuFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACGvBgEA3QwAIbYGAQDdDAAhtwYBAN4MACG5BgAAuA25BiK6BkAA9QwAIQIAAAA_ACBfAADVCQAgAgAAAD8AIF8AANUJACABAAAAGAAgAwAAAEEAIGYAAM0JACBnAADTCQAgAQAAAEEAIAEAAAA_ACAGFQAAzw4AIGwAANEOACBtAADQDgAgiwYAANkMACC3BgAA2QwAILoGAADZDAAgDoIGAADaCgAwgwYAAN0JABCEBgAA2goAMIUGAQC_CgAhigYBAL8KACGLBgEAwAoAIY0GQADBCgAhjgZAAMEKACGtBgEAvwoAIa8GAQC_CgAhtgYBAL8KACG3BgEAwAoAIbkGAADbCrkGIroGQADcCgAhAwAAAD8AIAEAANwJADBrAADdCQAgAwAAAD8AIAEAAEAAMAIAAEEAIAEAAABGACABAAAARgAgAwAAAEQAIAEAAEUAMAIAAEYAIAMAAABEACABAABFADACAABGACADAAAARAAgAQAARQAwAgAARgAgDwcAAM4NACAJAADPDQAgEgAAzg4AIBkAAM0NACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbAGAQAAAAGxBgEAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQZAAAAAAQFfAADlCQAgC4UGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsAYBAAAAAbEGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BkAAAAABAV8AAOcJADABXwAA5wkAMAEAAAAYACAPBwAAyg0AIAkAAMsNACASAADNDgAgGQAAyQ0AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGwBgEA3QwAIbEGAQDdDAAhsgYBAN4MACGzBgEA3gwAIbQGAQDeDAAhtQZAAN8MACECAAAARgAgXwAA6wkAIAuFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhsAYBAN0MACGxBgEA3QwAIbIGAQDeDAAhswYBAN4MACG0BgEA3gwAIbUGQADfDAAhAgAAAEQAIF8AAO0JACACAAAARAAgXwAA7QkAIAEAAAAYACADAAAARgAgZgAA5QkAIGcAAOsJACABAAAARgAgAQAAAEQAIAcVAADKDgAgbAAAzA4AIG0AAMsOACCLBgAA2QwAILIGAADZDAAgswYAANkMACC0BgAA2QwAIA6CBgAA2QoAMIMGAAD1CQAQhAYAANkKADCFBgEAvwoAIYoGAQC_CgAhiwYBAMAKACGNBkAAwQoAIY4GQADBCgAhsAYBAL8KACGxBgEAvwoAIbIGAQDACgAhswYBAMAKACG0BgEAwAoAIbUGQADBCgAhAwAAAEQAIAEAAPQJADBrAAD1CQAgAwAAAEQAIAEAAEUAMAIAAEYAIAEAAAA8ACABAAAAPAAgAwAAADoAIAEAADsAMAIAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgDQcAAOcNACAJAADoDQAgDgAA5Q0AIA8AAOYNACAQAADJDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAEBXwAA_QkAIAiFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABrwYBAAAAAQFfAAD_CQAwAV8AAP8JADABAAAAGAAgDQcAAOINACAJAADjDQAgDgAA4A0AIA8AAOENACAQAADIDgAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrgYBAN0MACGvBgEA3QwAIQIAAAA8ACBfAACDCgAgCIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhrwYBAN0MACECAAAAOgAgXwAAhQoAIAIAAAA6ACBfAACFCgAgAQAAABgAIAMAAAA8ACBmAAD9CQAgZwAAgwoAIAEAAAA8ACABAAAAOgAgBBUAAMUOACBsAADHDgAgbQAAxg4AIIsGAADZDAAgC4IGAADYCgAwgwYAAI0KABCEBgAA2AoAMIUGAQC_CgAhigYBAL8KACGLBgEAwAoAIY0GQADBCgAhjgZAAMEKACGtBgEAvwoAIa4GAQC_CgAhrwYBAL8KACEDAAAAOgAgAQAAjAoAMGsAAI0KACADAAAAOgAgAQAAOwAwAgAAPAAgETMAANcKACCCBgAA0QoAMIMGAACuAgAQhAYAANEKADCFBgEAAAABjQZAANYKACGOBkAA1goAIZoGAQAAAAGbBgEA0goAIZwGAQDSCgAhnQYBANIKACGeBgEA0woAIZ8GAADLCgAgoAYAAMsKACChBgAA1AoAIKIGAADUCgAgowYgANUKACEBAAAAkAoAIAEAAACQCgAgAjMAAMQOACCeBgAA2QwAIAMAAACuAgAgAQAAkwoAMAIAAJAKACADAAAArgIAIAEAAJMKADACAACQCgAgAwAAAK4CACABAACTCgAwAgAAkAoAIA4zAADDDgAghQYBAAAAAY0GQAAAAAGOBkAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgAAwQ4AIKAGAADCDgAgoQaAAAAAAaIGgAAAAAGjBiAAAAABAV8AAJcKACANhQYBAAAAAY0GQAAAAAGOBkAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGfBgAAwQ4AIKAGAADCDgAgoQaAAAAAAaIGgAAAAAGjBiAAAAABAV8AAJkKADABXwAAmQoAMA4zAADADgAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhmgYBAN0MACGbBgEA3QwAIZwGAQDdDAAhnQYBAN0MACGeBgEA3gwAIZ8GAAC9DgAgoAYAAL4OACChBoAAAAABogaAAAAAAaMGIAC_DgAhAgAAAJAKACBfAACcCgAgDYUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIZoGAQDdDAAhmwYBAN0MACGcBgEA3QwAIZ0GAQDdDAAhngYBAN4MACGfBgAAvQ4AIKAGAAC-DgAgoQaAAAAAAaIGgAAAAAGjBiAAvw4AIQIAAACuAgAgXwAAngoAIAIAAACuAgAgXwAAngoAIAMAAACQCgAgZgAAlwoAIGcAAJwKACABAAAAkAoAIAEAAACuAgAgBBUAALoOACBsAAC8DgAgbQAAuw4AIJ4GAADZDAAgEIIGAADKCgAwgwYAAKUKABCEBgAAygoAMIUGAQC_CgAhjQZAAMEKACGOBkAAwQoAIZoGAQC_CgAhmwYBAL8KACGcBgEAvwoAIZ0GAQC_CgAhngYBAMAKACGfBgAAywoAIKAGAADLCgAgoQYAAMwKACCiBgAAzAoAIKMGIADNCgAhAwAAAK4CACABAACkCgAwawAApQoAIAMAAACuAgAgAQAAkwoAMAIAAJAKACABAAAAEAAgAQAAABAAIAMAAAAOACABAAAPADACAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIBMDAAC5DgAgBwAAsQ4AIAkAALgOACANAACyDgAgEQAAsw4AICIAALcOACAkAAC0DgAgSwAAtQ4AIEwAALYOACCFBgEAAAABhgYBAAAAAYcGAQAAAAGIBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAABAV8AAK0KACAKhQYBAAAAAYYGAQAAAAGHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAQFfAACvCgAwAV8AAK8KADATAwAA6AwAIAcAAOAMACAJAADnDAAgDQAA4QwAIBEAAOIMACAiAADmDAAgJAAA4wwAIEsAAOQMACBMAADlDAAghQYBAN0MACGGBgEA3QwAIYcGAQDdDAAhiAYBAN0MACGJBgEA3gwAIYoGAQDdDAAhiwYBAN0MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACECAAAAEAAgXwAAsgoAIAqFBgEA3QwAIYYGAQDdDAAhhwYBAN0MACGIBgEA3QwAIYkGAQDeDAAhigYBAN0MACGLBgEA3QwAIYwGAQDdDAAhjQZAAN8MACGOBkAA3wwAIQIAAAAOACBfAAC0CgAgAgAAAA4AIF8AALQKACADAAAAEAAgZgAArQoAIGcAALIKACABAAAAEAAgAQAAAA4AIAQVAADaDAAgbAAA3AwAIG0AANsMACCJBgAA2QwAIA2CBgAAvgoAMIMGAAC7CgAQhAYAAL4KADCFBgEAvwoAIYYGAQC_CgAhhwYBAL8KACGIBgEAvwoAIYkGAQDACgAhigYBAL8KACGLBgEAvwoAIYwGAQC_CgAhjQZAAMEKACGOBkAAwQoAIQMAAAAOACABAAC6CgAwawAAuwoAIAMAAAAOACABAAAPADACAAAQACANggYAAL4KADCDBgAAuwoAEIQGAAC-CgAwhQYBAL8KACGGBgEAvwoAIYcGAQC_CgAhiAYBAL8KACGJBgEAwAoAIYoGAQC_CgAhiwYBAL8KACGMBgEAvwoAIY0GQADBCgAhjgZAAMEKACEOFQAAwwoAIGwAAMkKACBtAADJCgAgjwYBAAAAAZAGAQAAAASRBgEAAAAEkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAZYGAQDICgAhlwYBAAAAAZgGAQAAAAGZBgEAAAABDhUAAMYKACBsAADHCgAgbQAAxwoAII8GAQAAAAGQBgEAAAAFkQYBAAAABZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAGWBgEAxQoAIZcGAQAAAAGYBgEAAAABmQYBAAAAAQsVAADDCgAgbAAAxAoAIG0AAMQKACCPBkAAAAABkAZAAAAABJEGQAAAAASSBkAAAAABkwZAAAAAAZQGQAAAAAGVBkAAAAABlgZAAMIKACELFQAAwwoAIGwAAMQKACBtAADECgAgjwZAAAAAAZAGQAAAAASRBkAAAAAEkgZAAAAAAZMGQAAAAAGUBkAAAAABlQZAAAAAAZYGQADCCgAhCI8GAgAAAAGQBgIAAAAEkQYCAAAABJIGAgAAAAGTBgIAAAABlAYCAAAAAZUGAgAAAAGWBgIAwwoAIQiPBkAAAAABkAZAAAAABJEGQAAAAASSBkAAAAABkwZAAAAAAZQGQAAAAAGVBkAAAAABlgZAAMQKACEOFQAAxgoAIGwAAMcKACBtAADHCgAgjwYBAAAAAZAGAQAAAAWRBgEAAAAFkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAZYGAQDFCgAhlwYBAAAAAZgGAQAAAAGZBgEAAAABCI8GAgAAAAGQBgIAAAAFkQYCAAAABZIGAgAAAAGTBgIAAAABlAYCAAAAAZUGAgAAAAGWBgIAxgoAIQuPBgEAAAABkAYBAAAABZEGAQAAAAWSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgYBAMcKACGXBgEAAAABmAYBAAAAAZkGAQAAAAEOFQAAwwoAIGwAAMkKACBtAADJCgAgjwYBAAAAAZAGAQAAAASRBgEAAAAEkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAZYGAQDICgAhlwYBAAAAAZgGAQAAAAGZBgEAAAABC48GAQAAAAGQBgEAAAAEkQYBAAAABJIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAGWBgEAyQoAIZcGAQAAAAGYBgEAAAABmQYBAAAAARCCBgAAygoAMIMGAAClCgAQhAYAAMoKADCFBgEAvwoAIY0GQADBCgAhjgZAAMEKACGaBgEAvwoAIZsGAQC_CgAhnAYBAL8KACGdBgEAvwoAIZ4GAQDACgAhnwYAAMsKACCgBgAAywoAIKEGAADMCgAgogYAAMwKACCjBiAAzQoAIQSPBgEAAAAFqgYBAAAAAasGAQAAAASsBgEAAAAEDxUAAMMKACBsAADQCgAgbQAA0AoAII8GgAAAAAGSBoAAAAABkwaAAAAAAZQGgAAAAAGVBoAAAAABlgaAAAAAAaQGAQAAAAGlBgEAAAABpgYBAAAAAacGgAAAAAGoBoAAAAABqQaAAAAAAQUVAADDCgAgbAAAzwoAIG0AAM8KACCPBiAAAAABlgYgAM4KACEFFQAAwwoAIGwAAM8KACBtAADPCgAgjwYgAAAAAZYGIADOCgAhAo8GIAAAAAGWBiAAzwoAIQyPBoAAAAABkgaAAAAAAZMGgAAAAAGUBoAAAAABlQaAAAAAAZYGgAAAAAGkBgEAAAABpQYBAAAAAaYGAQAAAAGnBoAAAAABqAaAAAAAAakGgAAAAAERMwAA1woAIIIGAADRCgAwgwYAAK4CABCEBgAA0QoAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIZoGAQDSCgAhmwYBANIKACGcBgEA0goAIZ0GAQDSCgAhngYBANMKACGfBgAAywoAIKAGAADLCgAgoQYAANQKACCiBgAA1AoAIKMGIADVCgAhC48GAQAAAAGQBgEAAAAEkQYBAAAABJIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAGWBgEAyQoAIZcGAQAAAAGYBgEAAAABmQYBAAAAAQuPBgEAAAABkAYBAAAABZEGAQAAAAWSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgYBAMcKACGXBgEAAAABmAYBAAAAAZkGAQAAAAEMjwaAAAAAAZIGgAAAAAGTBoAAAAABlAaAAAAAAZUGgAAAAAGWBoAAAAABpAYBAAAAAaUGAQAAAAGmBgEAAAABpwaAAAAAAagGgAAAAAGpBoAAAAABAo8GIAAAAAGWBiAAzwoAIQiPBkAAAAABkAZAAAAABJEGQAAAAASSBkAAAAABkwZAAAAAAZQGQAAAAAGVBkAAAAABlgZAAMQKACEoBAAA7AsAIAUAAO0LACAGAADNCwAgEAAAzgsAIBkAAM8LACA0AACSCwAgQAAA0QsAIE0AANELACBOAACSCwAgTwAA7gsAIFAAAI8LACBRAACPCwAgUgAA7wsAIFMAAPALACBUAADbCwAgVQAA2wsAIFYAANoLACBXAADaCwAgWAAA2QsAIFkAAPELACCCBgAA6wsAMIMGAABRABCEBgAA6wsAMIUGAQDSCgAhiQYBANMKACGNBkAA1goAIY4GQADWCgAh3gYBANIKACGVBwEA0goAIdUHAQDSCgAh1gcgANUKACHXBwEA0woAIdgHAQDTCgAh2QcBANMKACHaBwEA0woAIdsHAQDTCgAh3AcBANMKACHdBwEA0goAIekHAABRACDqBwAAUQAgC4IGAADYCgAwgwYAAI0KABCEBgAA2AoAMIUGAQC_CgAhigYBAL8KACGLBgEAwAoAIY0GQADBCgAhjgZAAMEKACGtBgEAvwoAIa4GAQC_CgAhrwYBAL8KACEOggYAANkKADCDBgAA9QkAEIQGAADZCgAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAIbAGAQC_CgAhsQYBAL8KACGyBgEAwAoAIbMGAQDACgAhtAYBAMAKACG1BkAAwQoAIQ6CBgAA2goAMIMGAADdCQAQhAYAANoKADCFBgEAvwoAIYoGAQC_CgAhiwYBAMAKACGNBkAAwQoAIY4GQADBCgAhrQYBAL8KACGvBgEAvwoAIbYGAQC_CgAhtwYBAMAKACG5BgAA2wq5BiK6BkAA3AoAIQcVAADDCgAgbAAA4AoAIG0AAOAKACCPBgAAALkGApAGAAAAuQYIkQYAAAC5BgiWBgAA3wq5BiILFQAAxgoAIGwAAN4KACBtAADeCgAgjwZAAAAAAZAGQAAAAAWRBkAAAAAFkgZAAAAAAZMGQAAAAAGUBkAAAAABlQZAAAAAAZYGQADdCgAhCxUAAMYKACBsAADeCgAgbQAA3goAII8GQAAAAAGQBkAAAAAFkQZAAAAABZIGQAAAAAGTBkAAAAABlAZAAAAAAZUGQAAAAAGWBkAA3QoAIQiPBkAAAAABkAZAAAAABZEGQAAAAAWSBkAAAAABkwZAAAAAAZQGQAAAAAGVBkAAAAABlgZAAN4KACEHFQAAwwoAIGwAAOAKACBtAADgCgAgjwYAAAC5BgKQBgAAALkGCJEGAAAAuQYIlgYAAN8KuQYiBI8GAAAAuQYCkAYAAAC5BgiRBgAAALkGCJYGAADgCrkGIhGCBgAA4QoAMIMGAADFCQAQhAYAAOEKADCFBgEAvwoAIYoGAQC_CgAhiwYBAMAKACGNBkAAwQoAIY4GQADBCgAhmgYBAL8KACGvBgEAwAoAIbsGAQDACgAhvQYAAOIKvQYivgYBAMAKACG_BkAA3AoAIcAGQADBCgAhwQYBAL8KACHCBgEAwAoAIQcVAADDCgAgbAAA5AoAIG0AAOQKACCPBgAAAL0GApAGAAAAvQYIkQYAAAC9BgiWBgAA4wq9BiIHFQAAwwoAIGwAAOQKACBtAADkCgAgjwYAAAC9BgKQBgAAAL0GCJEGAAAAvQYIlgYAAOMKvQYiBI8GAAAAvQYCkAYAAAC9BgiRBgAAAL0GCJYGAADkCr0GIheCBgAA5QoAMIMGAACpCQAQhAYAAOUKADCFBgEAvwoAIYoGAQC_CgAhiwYBAMAKACGNBkAAwQoAIY4GQADBCgAhrwYBAL8KACHDBgEAvwoAIcQGCADmCgAhxQYIAOYKACHGBggA5goAIccGCADmCgAhyAYIAOYKACHJBggA5goAIcoGCADmCgAhywYIAOYKACHMBggA5goAIc0GCADmCgAhzgYIAOYKACHPBggA5goAIdAGCADmCgAhDRUAAMYKACBsAADoCgAgbQAA6AoAIO4BAADoCgAg7wEAAOgKACCPBggAAAABkAYIAAAABZEGCAAAAAWSBggAAAABkwYIAAAAAZQGCAAAAAGVBggAAAABlgYIAOcKACENFQAAxgoAIGwAAOgKACBtAADoCgAg7gEAAOgKACDvAQAA6AoAII8GCAAAAAGQBggAAAAFkQYIAAAABZIGCAAAAAGTBggAAAABlAYIAAAAAZUGCAAAAAGWBggA5woAIQiPBggAAAABkAYIAAAABZEGCAAAAAWSBggAAAABkwYIAAAAAZQGCAAAAAGVBggAAAABlgYIAOgKACEPggYAAOkKADCDBgAAkQkAEIQGAADpCgAwhQYBAL8KACGKBgEAvwoAIY0GQADBCgAhjgZAAMEKACG9BgAA6wrVBiLRBgEAwAoAIdMGAADqCtMGItUGEADsCgAh1gYBAL8KACHXBgIA7QoAIdgGQADBCgAh2QZAAMEKACEHFQAAwwoAIGwAAPUKACBtAAD1CgAgjwYAAADTBgKQBgAAANMGCJEGAAAA0wYIlgYAAPQK0wYiBxUAAMMKACBsAADzCgAgbQAA8woAII8GAAAA1QYCkAYAAADVBgiRBgAAANUGCJYGAADyCtUGIg0VAADDCgAgbAAA8QoAIG0AAPEKACDuAQAA8QoAIO8BAADxCgAgjwYQAAAAAZAGEAAAAASRBhAAAAAEkgYQAAAAAZMGEAAAAAGUBhAAAAABlQYQAAAAAZYGEADwCgAhDRUAAMMKACBsAADDCgAgbQAAwwoAIO4BAADvCgAg7wEAAMMKACCPBgIAAAABkAYCAAAABJEGAgAAAASSBgIAAAABkwYCAAAAAZQGAgAAAAGVBgIAAAABlgYCAO4KACENFQAAwwoAIGwAAMMKACBtAADDCgAg7gEAAO8KACDvAQAAwwoAII8GAgAAAAGQBgIAAAAEkQYCAAAABJIGAgAAAAGTBgIAAAABlAYCAAAAAZUGAgAAAAGWBgIA7goAIQiPBggAAAABkAYIAAAABJEGCAAAAASSBggAAAABkwYIAAAAAZQGCAAAAAGVBggAAAABlgYIAO8KACENFQAAwwoAIGwAAPEKACBtAADxCgAg7gEAAPEKACDvAQAA8QoAII8GEAAAAAGQBhAAAAAEkQYQAAAABJIGEAAAAAGTBhAAAAABlAYQAAAAAZUGEAAAAAGWBhAA8AoAIQiPBhAAAAABkAYQAAAABJEGEAAAAASSBhAAAAABkwYQAAAAAZQGEAAAAAGVBhAAAAABlgYQAPEKACEHFQAAwwoAIGwAAPMKACBtAADzCgAgjwYAAADVBgKQBgAAANUGCJEGAAAA1QYIlgYAAPIK1QYiBI8GAAAA1QYCkAYAAADVBgiRBgAAANUGCJYGAADzCtUGIgcVAADDCgAgbAAA9QoAIG0AAPUKACCPBgAAANMGApAGAAAA0wYIkQYAAADTBgiWBgAA9ArTBiIEjwYAAADTBgKQBgAAANMGCJEGAAAA0wYIlgYAAPUK0wYiC4IGAAD2CgAwgwYAAPkIABCEBgAA9goAMIUGAQC_CgAhiQYBAMAKACGKBgEAvwoAIYsGAQDACgAhjAYBAL8KACGNBkAAwQoAIY4GQADBCgAh2gYBAL8KACEPggYAAPcKADCDBgAA4QgAEIQGAAD3CgAwhQYBAL8KACGNBkAAwQoAIY4GQADBCgAhsQYBAMAKACG7BgEAwAoAIb0GAAD4CtwGIr4GAQDACgAhvwZAANwKACHABkAAwQoAIcEGAQC_CgAhwgYBAMAKACHcBgEAvwoAIQcVAADDCgAgbAAA-goAIG0AAPoKACCPBgAAANwGApAGAAAA3AYIkQYAAADcBgiWBgAA-QrcBiIHFQAAwwoAIGwAAPoKACBtAAD6CgAgjwYAAADcBgKQBgAAANwGCJEGAAAA3AYIlgYAAPkK3AYiBI8GAAAA3AYCkAYAAADcBgiRBgAAANwGCJYGAAD6CtwGIgyCBgAA-woAMIMGAADHCAAQhAYAAPsKADCFBgEAvwoAIY0GQADBCgAhjgZAAMEKACGbBgEAvwoAIZwGAQC_CgAhoQYAAMwKACCjBiAAzQoAIdwGAQC_CgAh3QYAAMsKACANFwAA1woAIIIGAAD8CgAwgwYAALICABCEBgAA_AoAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIZsGAQDSCgAhnAYBANIKACGhBgAA1AoAIKMGIADVCgAh3AYBANIKACHdBgAAywoAIAiCBgAA_QoAMIMGAACvCAAQhAYAAP0KADCFBgEAvwoAIYoGAQC_CgAh3gYBAL8KACHfBkAAwQoAIeAGQADBCgAhDQwAAP8KACANAACBCwAgHAAAgwsAICUAAIALACAnAACCCwAgggYAAP4KADCDBgAALwAQhAYAAP4KADCFBgEA0goAIYoGAQDSCgAh3gYBANIKACHfBkAA1goAIeAGQADWCgAhA-EGAAAxACDiBgAAMQAg4wYAADEAIAPhBgAANQAg4gYAADUAIOMGAAA1ACAD4QYAACYAIOIGAAAmACDjBgAAJgAgA-EGAAB0ACDiBgAAdAAg4wYAAHQAIAPhBgAAVQAg4gYAAFUAIOMGAABVACANggYAAIQLADCDBgAAlwgAEIQGAACECwAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAId4GAQC_CgAh5AYBAMAKACHlBgIAhQsAIeYGAQC_CgAh5wYBAMAKACENFQAAxgoAIGwAAMYKACBtAADGCgAg7gEAAOgKACDvAQAAxgoAII8GAgAAAAGQBgIAAAAFkQYCAAAABZIGAgAAAAGTBgIAAAABlAYCAAAAAZUGAgAAAAGWBgIAhgsAIQ0VAADGCgAgbAAAxgoAIG0AAMYKACDuAQAA6AoAIO8BAADGCgAgjwYCAAAAAZAGAgAAAAWRBgIAAAAFkgYCAAAAAZMGAgAAAAGUBgIAAAABlQYCAAAAAZYGAgCGCwAhDoIGAACHCwAwgwYAAP0HABCEBgAAhwsAMIUGAQC_CgAhigYBAMAKACGLBgEAwAoAIY0GQADBCgAhjgZAAMEKACG9BgAAiAvrBiLeBgEAvwoAIeQGAQDACgAh5gYBAMAKACHoBgEAvwoAIekGAQC_CgAhBxUAAMMKACBsAACKCwAgbQAAigsAII8GAAAA6wYCkAYAAADrBgiRBgAAAOsGCJYGAACJC-sGIgcVAADDCgAgbAAAigsAIG0AAIoLACCPBgAAAOsGApAGAAAA6wYIkQYAAADrBgiWBgAAiQvrBiIEjwYAAADrBgKQBgAAAOsGCJEGAAAA6wYIlgYAAIoL6wYiDoIGAACLCwAwgwYAAOEHABCEBgAAiwsAMIUGAQC_CgAhigYBAMAKACGLBgEAwAoAIY0GQADBCgAhjgZAAMEKACHDBgEAvwoAId4GAQC_CgAh5AYBAMAKACHrBgEAwAoAIewGAQC_CgAh7QYBAL8KACEOggYAAIwLADCDBgAAxwcAEIQGAACMCwAwhQYBAL8KACGKBgEAvwoAIYsGAQC_CgAhjQZAAMEKACGOBkAAwQoAIbYGAQC_CgAh5AYBAMAKACHuBgEAwAoAIe8GQADcCgAh8AYIAOYKACHxBggA5goAIQ-CBgAAjQsAMIMGAACxBwAQhAYAAI0LADCFBgEAvwoAIYoGAQC_CgAhiwYBAMAKACGNBkAAwQoAIY4GQADBCgAhtgYBAL8KACHyBgEAwAoAIfMGAQC_CgAh9AYAAMsKACD1BgEAwAoAIfYGAQDACgAh9wYBAL8KACEQFAAAjwsAIIIGAACOCwAwgwYAAJ4HABCEBgAAjgsAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACG2BgEA0goAIfIGAQDTCgAh8wYBANIKACH0BgAAywoAIPUGAQDTCgAh9gYBANMKACH3BgEA0goAIQPhBgAASwAg4gYAAEsAIOMGAABLACAPggYAAJALADCDBgAAmAcAEIQGAACQCwAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAIbYGAQC_CgAh8gYBAMAKACHzBgEAvwoAIfQGAADLCgAg9QYBAMAKACH2BgEAwAoAIfcGAQC_CgAhEBQAAJILACCCBgAAkQsAMIMGAACFBwAQhAYAAJELADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhtgYBANIKACHyBgEA0woAIfMGAQDSCgAh9AYAAMsKACD1BgEA0woAIfYGAQDTCgAh9wYBANIKACED4QYAAKEBACDiBgAAoQEAIOMGAAChAQAgFYIGAACTCwAwgwYAAP8GABCEBgAAkwsAMIUGAQC_CgAhigYBAL8KACGNBkAAwQoAIY4GQADBCgAhvQYAAJQL-gYi0wYAAOoK0wYi1QYQAOwKACHWBgEAvwoAIdcGAgDtCgAh-AYBAL8KACH6BgEAvwoAIfsGAQDACgAh_AYBAMAKACH9BgEAwAoAIf4GAQDACgAh_wYBAMAKACGABwAAlQsAIIEHQADcCgAhBxUAAMMKACBsAACYCwAgbQAAmAsAII8GAAAA-gYCkAYAAAD6BgiRBgAAAPoGCJYGAACXC_oGIg8VAADGCgAgbAAAlgsAIG0AAJYLACCPBoAAAAABkgaAAAAAAZMGgAAAAAGUBoAAAAABlQaAAAAAAZYGgAAAAAGkBgEAAAABpQYBAAAAAaYGAQAAAAGnBoAAAAABqAaAAAAAAakGgAAAAAEMjwaAAAAAAZIGgAAAAAGTBoAAAAABlAaAAAAAAZUGgAAAAAGWBoAAAAABpAYBAAAAAaUGAQAAAAGmBgEAAAABpwaAAAAAAagGgAAAAAGpBoAAAAABBxUAAMMKACBsAACYCwAgbQAAmAsAII8GAAAA-gYCkAYAAAD6BgiRBgAAAPoGCJYGAACXC_oGIgSPBgAAAPoGApAGAAAA-gYIkQYAAAD6BgiWBgAAmAv6BiIPggYAAJkLADCDBgAA6QYAEIQGAACZCwAwhQYBAL8KACGKBgEAvwoAIY0GQADBCgAhjgZAAMEKACGCBwEAvwoAIYMHAQC_CgAhhAcBAL8KACGFBwEAvwoAIYYHAQC_CgAhhwcBAL8KACGIByAAzQoAIYkHAQDACgAhEAcAAJsLACCCBgAAmgsAMIMGAADlAQAQhAYAAJoLADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAIYIHAQDSCgAhgwcBANIKACGEBwEA0goAIYUHAQDSCgAhhgcBANIKACGHBwEA0goAIYgHIADVCgAhiQcBANMKACEoBgAAzQsAIAwAAP8KACANAACBCwAgEQAA0AsAIBwAAIMLACAlAACACwAgJwAAggsAICoAANgLACAuAADJCwAgLwAAygsAIDAAAMwLACAxAADOCwAgMgAAzwsAIDQAAJILACA1AADSCwAgNgAA0wsAIDcAANQLACA6AADICwAgOwAAywsAID8AANcLACBAAADRCwAgQQAA1QsAIEIAANYLACBHAADZCwAgSAAA2gsAIEkAANsLACBKAADbCwAgggYAAMYLADCDBgAAFgAQhAYAAMYLADCFBgEA0goAIY0GQADWCgAhjgZAANYKACG5BgAAxwurByPeBgEA0goAIeQGAQDTCgAhqQcBANMKACGsBwEA0woAIekHAAAWACDqBwAAFgAgGoIGAACcCwAwgwYAANEGABCEBgAAnAsAMIUGAQC_CgAhigYBAL8KACGLBgEAvwoAIY0GQADBCgAhjgZAAMEKACGxBgEAvwoAIb0GAACeC44HItUGEADsCgAh1gYBAL8KACHXBgIA7QoAIeYGAQC_CgAh-gYBAL8KACH7BgEAwAoAIfwGAQDACgAh_QYBAMAKACH-BgEAwAoAIf8GAQDACgAhgAcAAJULACCBB0AA3AoAIYoHAQC_CgAhjAcAAJ0LjAcijgcBAL8KACGPB0AAwQoAIQcVAADDCgAgbAAAogsAIG0AAKILACCPBgAAAIwHApAGAAAAjAcIkQYAAACMBwiWBgAAoQuMByIHFQAAwwoAIGwAAKALACBtAACgCwAgjwYAAACOBwKQBgAAAI4HCJEGAAAAjgcIlgYAAJ8LjgciBxUAAMMKACBsAACgCwAgbQAAoAsAII8GAAAAjgcCkAYAAACOBwiRBgAAAI4HCJYGAACfC44HIgSPBgAAAI4HApAGAAAAjgcIkQYAAACOBwiWBgAAoAuOByIHFQAAwwoAIGwAAKILACBtAACiCwAgjwYAAACMBwKQBgAAAIwHCJEGAAAAjAcIlgYAAKELjAciBI8GAAAAjAcCkAYAAACMBwiRBgAAAIwHCJYGAACiC4wHIg2CBgAAowsAMIMGAAC7BgAQhAYAAKMLADCFBgEAvwoAIYoGAQC_CgAhiwYBAL8KACGNBkAAwQoAIY4GQADBCgAh1gYBAL8KACHmBgEAvwoAIYgHIADNCgAhkAcQAOwKACGRBxAA7AoAIQeCBgAApAsAMIMGAAClBgAQhAYAAKQLADCFBgEAvwoAIYwGAQC_CgAhkgcBAL8KACGTB0AAwQoAIQeCBgAApQsAMIMGAACPBgAQhAYAAKULADCFBgEAvwoAIY0GQADBCgAhkgcBAL8KACGVBwAApguVByIHFQAAwwoAIGwAAKgLACBtAACoCwAgjwYAAACVBwKQBgAAAJUHCJEGAAAAlQcIlgYAAKcLlQciBxUAAMMKACBsAACoCwAgbQAAqAsAII8GAAAAlQcCkAYAAACVBwiRBgAAAJUHCJYGAACnC5UHIgSPBgAAAJUHApAGAAAAlQcIkQYAAACVBwiWBgAAqAuVByILggYAAKkLADCDBgAA-QUAEIQGAACpCwAwhQYBAL8KACGKBgEAvwoAIY0GQADBCgAhjgZAAMEKACG2BgEAvwoAIbcGAQC_CgAhlgcBAL8KACGXBwAApguVByITggYAAKoLADCDBgAA4wUAEIQGAACqCwAwhQYBAL8KACGNBkAAwQoAIY4GQADBCgAhrwYBAMAKACGxBgEAwAoAIb0GAACsC5sHIr8GQADcCgAhwgYBAMAKACGZBwAAqwuZByKbBwEAvwoAIZwHAQC_CgAhnQcBAL8KACGeBwEAwAoAIZ8HAQDACgAhoAcBAMAKACGhB0AAwQoAIQcVAADDCgAgbAAAsAsAIG0AALALACCPBgAAAJkHApAGAAAAmQcIkQYAAACZBwiWBgAArwuZByIHFQAAwwoAIGwAAK4LACBtAACuCwAgjwYAAACbBwKQBgAAAJsHCJEGAAAAmwcIlgYAAK0LmwciBxUAAMMKACBsAACuCwAgbQAArgsAII8GAAAAmwcCkAYAAACbBwiRBgAAAJsHCJYGAACtC5sHIgSPBgAAAJsHApAGAAAAmwcIkQYAAACbBwiWBgAArgubByIHFQAAwwoAIGwAALALACBtAACwCwAgjwYAAACZBwKQBgAAAJkHCJEGAAAAmQcIlgYAAK8LmQciBI8GAAAAmQcCkAYAAACZBwiRBgAAAJkHCJYGAACwC5kHIg2CBgAAsQsAMIMGAADFBQAQhAYAALELADCFBgEAvwoAIYoGAQC_CgAhjQZAAMEKACGOBkAAwQoAIb0GAACzC6UHIr8GQADcCgAhnQcBAL8KACGjBwAAsgujByKlBwEAwAoAIaYHAQDACgAhBxUAAMMKACBsAAC3CwAgbQAAtwsAII8GAAAAowcCkAYAAACjBwiRBgAAAKMHCJYGAAC2C6MHIgcVAADDCgAgbAAAtQsAIG0AALULACCPBgAAAKUHApAGAAAApQcIkQYAAAClBwiWBgAAtAulByIHFQAAwwoAIGwAALULACBtAAC1CwAgjwYAAAClBwKQBgAAAKUHCJEGAAAApQcIlgYAALQLpQciBI8GAAAApQcCkAYAAAClBwiRBgAAAKUHCJYGAAC1C6UHIgcVAADDCgAgbAAAtwsAIG0AALcLACCPBgAAAKMHApAGAAAAowcIkQYAAACjBwiWBgAAtgujByIEjwYAAACjBwKQBgAAAKMHCJEGAAAAowcIlgYAALcLowciHoIGAAC4CwAwgwYAAK0FABCEBgAAuAsAMIUGAQC_CgAhigYBAMAKACGNBkAAwQoAIY4GQADBCgAhvQYAALwLuwcivwZAANwKACHkBgEAwAoAIaYHAQDACgAhpwcBAL8KACGoBwEAvwoAIakHAQDACgAhqwcAALkLqwcjrAcBAMAKACGtBwAAugvTBiOuBxAAuwsAIa8HAQC_CgAhsAcCAIULACGxBwAAlAv6BiKyBwEAwAoAIbMHAQDACgAhtAcBAMAKACG1BwEAwAoAIbYHAQDACgAhtwcBAMAKACG4BwAAlQsAILkHQADcCgAhuwcBAMAKACEHFQAAxgoAIGwAAMQLACBtAADECwAgjwYAAACrBwOQBgAAAKsHCZEGAAAAqwcJlgYAAMMLqwcjBxUAAMYKACBsAADCCwAgbQAAwgsAII8GAAAA0wYDkAYAAADTBgmRBgAAANMGCZYGAADBC9MGIw0VAADGCgAgbAAAwAsAIG0AAMALACDuAQAAwAsAIO8BAADACwAgjwYQAAAAAZAGEAAAAAWRBhAAAAAFkgYQAAAAAZMGEAAAAAGUBhAAAAABlQYQAAAAAZYGEAC_CwAhBxUAAMMKACBsAAC-CwAgbQAAvgsAII8GAAAAuwcCkAYAAAC7BwiRBgAAALsHCJYGAAC9C7sHIgcVAADDCgAgbAAAvgsAIG0AAL4LACCPBgAAALsHApAGAAAAuwcIkQYAAAC7BwiWBgAAvQu7ByIEjwYAAAC7BwKQBgAAALsHCJEGAAAAuwcIlgYAAL4LuwciDRUAAMYKACBsAADACwAgbQAAwAsAIO4BAADACwAg7wEAAMALACCPBhAAAAABkAYQAAAABZEGEAAAAAWSBhAAAAABkwYQAAAAAZQGEAAAAAGVBhAAAAABlgYQAL8LACEIjwYQAAAAAZAGEAAAAAWRBhAAAAAFkgYQAAAAAZMGEAAAAAGUBhAAAAABlQYQAAAAAZYGEADACwAhBxUAAMYKACBsAADCCwAgbQAAwgsAII8GAAAA0wYDkAYAAADTBgmRBgAAANMGCZYGAADBC9MGIwSPBgAAANMGA5AGAAAA0wYJkQYAAADTBgmWBgAAwgvTBiMHFQAAxgoAIGwAAMQLACBtAADECwAgjwYAAACrBwOQBgAAAKsHCZEGAAAAqwcJlgYAAMMLqwcjBI8GAAAAqwcDkAYAAACrBwmRBgAAAKsHCZYGAADEC6sHIwuCBgAAxQsAMIMGAACTBQAQhAYAAMULADCFBgEAvwoAIY0GQADBCgAhjgZAAMEKACG5BgAAuQurByPeBgEAvwoAIeQGAQDACgAhqQcBAMAKACGsBwEAwAoAISYGAADNCwAgDAAA_woAIA0AAIELACARAADQCwAgHAAAgwsAICUAAIALACAnAACCCwAgKgAA2AsAIC4AAMkLACAvAADKCwAgMAAAzAsAIDEAAM4LACAyAADPCwAgNAAAkgsAIDUAANILACA2AADTCwAgNwAA1AsAIDoAAMgLACA7AADLCwAgPwAA1wsAIEAAANELACBBAADVCwAgQgAA1gsAIEcAANkLACBIAADaCwAgSQAA2wsAIEoAANsLACCCBgAAxgsAMIMGAAAWABCEBgAAxgsAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIbkGAADHC6sHI94GAQDSCgAh5AYBANMKACGpBwEA0woAIawHAQDTCgAhBI8GAAAAqwcDkAYAAACrBwmRBgAAAKsHCZYGAADEC6sHIwPhBgAAEgAg4gYAABIAIOMGAAASACAD4QYAAB0AIOIGAAAdACDjBgAAHQAgA-EGAABrACDiBgAAawAg4wYAAGsAIAPhBgAAyAEAIOIGAADIAQAg4wYAAMgBACAD4QYAACEAIOIGAAAhACDjBgAAIQAgA-EGAAALACDiBgAACwAg4wYAAAsAIAPhBgAADgAg4gYAAA4AIOMGAAAOACAD4QYAAFMAIOIGAABTACDjBgAAUwAgA-EGAAA6ACDiBgAAOgAg4wYAADoAIAPhBgAA0wEAIOIGAADTAQAg4wYAANMBACAD4QYAAD8AIOIGAAA_ACDjBgAAPwAgA-EGAABEACDiBgAARAAg4wYAAEQAIAPhBgAAiQEAIOIGAACJAQAg4wYAAIkBACASBwAAmwsAIIIGAACaCwAwgwYAAOUBABCEBgAAmgsAMIUGAQDSCgAhigYBANIKACGNBkAA1goAIY4GQADWCgAhggcBANIKACGDBwEA0goAIYQHAQDSCgAhhQcBANIKACGGBwEA0goAIYcHAQDSCgAhiAcgANUKACGJBwEA0woAIekHAADlAQAg6gcAAOUBACAD4QYAAOcBACDiBgAA5wEAIOMGAADnAQAgA-EGAADZAQAg4gYAANkBACDjBgAA2QEAIAPhBgAAKgAg4gYAACoAIOMGAAAqACAD4QYAAO4BACDiBgAA7gEAIOMGAADuAQAgA-EGAAD8AQAg4gYAAPwBACDjBgAA_AEAIAPhBgAAWwAg4gYAAFsAIOMGAABbACAKggYAANwLADCDBgAA-wQAEIQGAADcCwAwhQYBAL8KACGKBgEAwAoAIY0GQADBCgAhjgZAAMEKACHkBgEAwAoAIakHAQDACgAhvAcBAL8KACEKggYAAN0LADCDBgAA4wQAEIQGAADdCwAwhQYBAL8KACGNBkAAwQoAIY4GQADBCgAh5AYBAMAKACH1BgEAwAoAIakHAQDACgAhvAcBAL8KACEPggYAAN4LADCDBgAAywQAEIQGAADeCwAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAIa0GAQC_CgAhrgYBAL8KACGvBgEAvwoAIbEGAQC_CgAh5gYBAL8KACH2BgEAwAoAIb0HQADBCgAhDYIGAADfCwAwgwYAALEEABCEBgAA3wsAMIUGAQC_CgAhigYBAL8KACGLBgEAvwoAIY0GQADBCgAhjgZAAMEKACHkBgEAwAoAIfAGAgCFCwAh9gYBAMAKACG-BwEAvwoAIb8HAQC_CgAhDIIGAADgCwAwgwYAAJkEABCEBgAA4AsAMIUGAQC_CgAhigYBAL8KACGNBkAAwQoAIY4GQADBCgAh3gYBAMAKACHABwEAvwoAIcEHAQC_CgAhwgcCAO0KACHEBwAA4QvEByIHFQAAwwoAIGwAAOMLACBtAADjCwAgjwYAAADEBwKQBgAAAMQHCJEGAAAAxAcIlgYAAOILxAciBxUAAMMKACBsAADjCwAgbQAA4wsAII8GAAAAxAcCkAYAAADEBwiRBgAAAMQHCJYGAADiC8QHIgSPBgAAAMQHApAGAAAAxAcIkQYAAADEBwiWBgAA4wvEByIKggYAAOQLADCDBgAAgwQAEIQGAADkCwAwhQYBAL8KACGKBgEAvwoAIYsGAQDACgAhjQZAAMEKACGOBkAAwQoAId4GAQC_CgAh5AYBAMAKACEJggYAAOULADCDBgAA6wMAEIQGAADlCwAwhQYBAL8KACGMBgEAvwoAIY0GQADBCgAhjgZAAMEKACHFBwEAvwoAIcYHQADBCgAhCYIGAADmCwAwgwYAANUDABCEBgAA5gsAMIUGAQC_CgAhjQZAAMEKACGOBkAAwQoAIcYHQADBCgAhxwcBAL8KACHIBwEAvwoAIQmCBgAA5wsAMIMGAADCAwAQhAYAAOcLADCFBgEA0goAIY0GQADWCgAhjgZAANYKACHGB0AA1goAIccHAQDSCgAhyAcBANIKACEQggYAAOgLADCDBgAAvAMAEIQGAADoCwAwhQYBAL8KACGMBgEAvwoAIY0GQADBCgAhjgZAAMEKACHJBwEAvwoAIcoHAQC_CgAhywcBAMAKACHMBwEAwAoAIc0HAQDACgAhzgdAANwKACHPB0AA3AoAIdAHAQDACgAh0QcBAMAKACELggYAAOkLADCDBgAApgMAEIQGAADpCwAwhQYBAL8KACGMBgEAvwoAIY0GQADBCgAhjgZAAMEKACHGB0AAwQoAIdIHAQC_CgAh0wcBAMAKACHUBwEAwAoAIRKCBgAA6gsAMIMGAACQAwAQhAYAAOoLADCFBgEAvwoAIYkGAQDACgAhjQZAAMEKACGOBkAAwQoAId4GAQC_CgAhlQcBAL8KACHVBwEAvwoAIdYHIADNCgAh1wcBAMAKACHYBwEAwAoAIdkHAQDACgAh2gcBAMAKACHbBwEAwAoAIdwHAQDACgAh3QcBAL8KACEmBAAA7AsAIAUAAO0LACAGAADNCwAgEAAAzgsAIBkAAM8LACA0AACSCwAgQAAA0QsAIE0AANELACBOAACSCwAgTwAA7gsAIFAAAI8LACBRAACPCwAgUgAA7wsAIFMAAPALACBUAADbCwAgVQAA2wsAIFYAANoLACBXAADaCwAgWAAA2QsAIFkAAPELACCCBgAA6wsAMIMGAABRABCEBgAA6wsAMIUGAQDSCgAhiQYBANMKACGNBkAA1goAIY4GQADWCgAh3gYBANIKACGVBwEA0goAIdUHAQDSCgAh1gcgANUKACHXBwEA0woAIdgHAQDTCgAh2QcBANMKACHaBwEA0woAIdsHAQDTCgAh3AcBANMKACHdBwEA0goAIQPhBgAAAwAg4gYAAAMAIOMGAAADACAD4QYAAAcAIOIGAAAHACDjBgAABwAgEzMAANcKACCCBgAA0QoAMIMGAACuAgAQhAYAANEKADCFBgEA0goAIY0GQADWCgAhjgZAANYKACGaBgEA0goAIZsGAQDSCgAhnAYBANIKACGdBgEA0goAIZ4GAQDTCgAhnwYAAMsKACCgBgAAywoAIKEGAADUCgAgogYAANQKACCjBiAA1QoAIekHAACuAgAg6gcAAK4CACAPFwAA1woAIIIGAAD8CgAwgwYAALICABCEBgAA_AoAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIZsGAQDSCgAhnAYBANIKACGhBgAA1AoAIKMGIADVCgAh3AYBANIKACHdBgAAywoAIOkHAACyAgAg6gcAALICACAD4QYAALQCACDiBgAAtAIAIOMGAAC0AgAgA-EGAAD2AQAg4gYAAPYBACDjBgAA9gEAIAmCBgAA8gsAMIMGAAD4AgAQhAYAAPILADCFBgEAvwoAIY0GQADBCgAhjgZAAMEKACG9BgAA8wvgByLDBgEAvwoAId4HQADBCgAhBxUAAMMKACBsAAD1CwAgbQAA9QsAII8GAAAA4AcCkAYAAADgBwiRBgAAAOAHCJYGAAD0C-AHIgcVAADDCgAgbAAA9QsAIG0AAPULACCPBgAAAOAHApAGAAAA4AcIkQYAAADgBwiWBgAA9AvgByIEjwYAAADgBwKQBgAAAOAHCJEGAAAA4AcIlgYAAPUL4AciCYIGAAD2CwAwgwYAAOICABCEBgAA9gsAMIUGAQC_CgAhigYBAL8KACGMBgEAvwoAIY0GQADBCgAhjgZAAMEKACGVBwAA9wvhByIHFQAAwwoAIGwAAPkLACBtAAD5CwAgjwYAAADhBwKQBgAAAOEHCJEGAAAA4QcIlgYAAPgL4QciBxUAAMMKACBsAAD5CwAgbQAA-QsAII8GAAAA4QcCkAYAAADhBwiRBgAAAOEHCJYGAAD4C-EHIgSPBgAAAOEHApAGAAAA4QcIkQYAAADhBwiWBgAA-QvhByIKAwAA1woAIIIGAAD6CwAwgwYAALQCABCEBgAA-gsAMIUGAQDSCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAhxQcBANIKACHGB0AA1goAIRAHAACbCwAgIAAA1woAID0AAP8LACCCBgAA-wsAMIMGAAD8AQAQhAYAAPsLADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAIb0GAAD9C6UHIr8GQAD-CwAhnQcBANIKACGjBwAA_AujByKlBwEA0woAIaYHAQDTCgAhBI8GAAAAowcCkAYAAACjBwiRBgAAAKMHCJYGAAC3C6MHIgSPBgAAAKUHApAGAAAApQcIkQYAAAClBwiWBgAAtQulByIIjwZAAAAAAZAGQAAAAAWRBkAAAAAFkgZAAAAAAZMGQAAAAAGUBkAAAAABlQZAAAAAAZYGQADeCgAhKAQAAOwLACAFAADtCwAgBgAAzQsAIBAAAM4LACAZAADPCwAgNAAAkgsAIEAAANELACBNAADRCwAgTgAAkgsAIE8AAO4LACBQAACPCwAgUQAAjwsAIFIAAO8LACBTAADwCwAgVAAA2wsAIFUAANsLACBWAADaCwAgVwAA2gsAIFgAANkLACBZAADxCwAgggYAAOsLADCDBgAAUQAQhAYAAOsLADCFBgEA0goAIYkGAQDTCgAhjQZAANYKACGOBkAA1goAId4GAQDSCgAhlQcBANIKACHVBwEA0goAIdYHIADVCgAh1wcBANMKACHYBwEA0woAIdkHAQDTCgAh2gcBANMKACHbBwEA0woAIdwHAQDTCgAh3QcBANIKACHpBwAAUQAg6gcAAFEAIAKMBgEAAAABkgcBAAAAAQkDAADXCgAgRAAAggwAIIIGAACBDAAwgwYAAPYBABCEBgAAgQwAMIUGAQDSCgAhjAYBANIKACGSBwEA0goAIZMHQADWCgAhEQcAAJsLACBDAADXCgAgRQAAhwwAIEYAAPELACCCBgAAhgwAMIMGAADuAQAQhAYAAIYMADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAhtwYBANIKACGWBwEA0goAIZcHAACFDJUHIukHAADuAQAg6gcAAO4BACACkgcBAAAAAZUHAAAAlQcCCEQAAIIMACCCBgAAhAwAMIMGAADyAQAQhAYAAIQMADCFBgEA0goAIY0GQADWCgAhkgcBANIKACGVBwAAhQyVByIEjwYAAACVBwKQBgAAAJUHCJEGAAAAlQcIlgYAAKgLlQciDwcAAJsLACBDAADXCgAgRQAAhwwAIEYAAPELACCCBgAAhgwAMIMGAADuAQAQhAYAAIYMADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAhtwYBANIKACGWBwEA0goAIZcHAACFDJUHIgPhBgAA8gEAIOIGAADyAQAg4wYAAPIBACAWBwAAmwsAIIIGAACIDAAwgwYAAOcBABCEBgAAiAwAMIUGAQDSCgAhigYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAIwM-gYi0wYAAIkM0wYi1QYQAIoMACHWBgEA0goAIdcGAgCLDAAh-AYBANIKACH6BgEA0goAIfsGAQDTCgAh_AYBANMKACH9BgEA0woAIf4GAQDTCgAh_wYBANMKACGABwAAjQwAIIEHQAD-CwAhBI8GAAAA0wYCkAYAAADTBgiRBgAAANMGCJYGAAD1CtMGIgiPBhAAAAABkAYQAAAABJEGEAAAAASSBhAAAAABkwYQAAAAAZQGEAAAAAGVBhAAAAABlgYQAPEKACEIjwYCAAAAAZAGAgAAAASRBgIAAAAEkgYCAAAAAZMGAgAAAAGUBgIAAAABlQYCAAAAAZYGAgDDCgAhBI8GAAAA-gYCkAYAAAD6BgiRBgAAAPoGCJYGAACYC_oGIgyPBoAAAAABkgaAAAAAAZMGgAAAAAGUBoAAAAABlQaAAAAAAZYGgAAAAAGkBgEAAAABpQYBAAAAAaYGAQAAAAGnBoAAAAABqAaAAAAAAakGgAAAAAERBwAAmwsAID4AAJAMACCCBgAAjgwAMIMGAADZAQAQhAYAAI4MADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAIb0GAACPDNUGItEGAQDTCgAh0wYAAIkM0wYi1QYQAIoMACHWBgEA0goAIdcGAgCLDAAh2AZAANYKACHZBkAA1goAIQSPBgAAANUGApAGAAAA1QYIkQYAAADVBgiWBgAA8wrVBiIkBwAAlgwAIDwAANcKACA9AAD_CwAgPwAA1wsAIIIGAACRDAAwgwYAANMBABCEBgAAkQwAMIUGAQDSCgAhigYBANMKACGNBkAA1goAIY4GQADWCgAhvQYAAJUMuwcivwZAAP4LACHkBgEA0woAIaYHAQDTCgAhpwcBANIKACGoBwEA0goAIakHAQDTCgAhqwcAAMcLqwcjrAcBANMKACGtBwAAkgzTBiOuBxAAkwwAIa8HAQDSCgAhsAcCAJQMACGxBwAAjAz6BiKyBwEA0woAIbMHAQDTCgAhtAcBANMKACG1BwEA0woAIbYHAQDTCgAhtwcBANMKACG4BwAAjQwAILkHQAD-CwAhuwcBANMKACHpBwAA0wEAIOoHAADTAQAgIgcAAJYMACA8AADXCgAgPQAA_wsAID8AANcLACCCBgAAkQwAMIMGAADTAQAQhAYAAJEMADCFBgEA0goAIYoGAQDTCgAhjQZAANYKACGOBkAA1goAIb0GAACVDLsHIr8GQAD-CwAh5AYBANMKACGmBwEA0woAIacHAQDSCgAhqAcBANIKACGpBwEA0woAIasHAADHC6sHI6wHAQDTCgAhrQcAAJIM0wYjrgcQAJMMACGvBwEA0goAIbAHAgCUDAAhsQcAAIwM-gYisgcBANMKACGzBwEA0woAIbQHAQDTCgAhtQcBANMKACG2BwEA0woAIbcHAQDTCgAhuAcAAI0MACC5B0AA_gsAIbsHAQDTCgAhBI8GAAAA0wYDkAYAAADTBgmRBgAAANMGCZYGAADCC9MGIwiPBhAAAAABkAYQAAAABZEGEAAAAAWSBhAAAAABkwYQAAAAAZQGEAAAAAGVBhAAAAABlgYQAMALACEIjwYCAAAAAZAGAgAAAAWRBgIAAAAFkgYCAAAAAZMGAgAAAAGUBgIAAAABlQYCAAAAAZYGAgDGCgAhBI8GAAAAuwcCkAYAAAC7BwiRBgAAALsHCJYGAAC-C7sHIigGAADNCwAgDAAA_woAIA0AAIELACARAADQCwAgHAAAgwsAICUAAIALACAnAACCCwAgKgAA2AsAIC4AAMkLACAvAADKCwAgMAAAzAsAIDEAAM4LACAyAADPCwAgNAAAkgsAIDUAANILACA2AADTCwAgNwAA1AsAIDoAAMgLACA7AADLCwAgPwAA1wsAIEAAANELACBBAADVCwAgQgAA1gsAIEcAANkLACBIAADaCwAgSQAA2wsAIEoAANsLACCCBgAAxgsAMIMGAAAWABCEBgAAxgsAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIbkGAADHC6sHI94GAQDSCgAh5AYBANMKACGpBwEA0woAIawHAQDTCgAh6QcAABYAIOoHAAAWACAOBwAAmwsAICoAANgLACCCBgAAlwwAMIMGAADIAQAQhAYAAJcMADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAId4GAQDTCgAhwAcBANIKACHBBwEA0goAIcIHAgCLDAAhxAcAAJgMxAciBI8GAAAAxAcCkAYAAADEBwiRBgAAAMQHCJYGAADjC8QHIhsHAACbCwAgCQAAnQwAIBAAAJwMACApAACbDAAgggYAAJkMADCDBgAAiQEAEIQGAACZDAAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa8GAQDSCgAhwwYBANIKACHEBggAmgwAIcUGCACaDAAhxgYIAJoMACHHBggAmgwAIcgGCACaDAAhyQYIAJoMACHKBggAmgwAIcsGCACaDAAhzAYIAJoMACHNBggAmgwAIc4GCACaDAAhzwYIAJoMACHQBggAmgwAIQiPBggAAAABkAYIAAAABZEGCAAAAAWSBggAAAABkwYIAAAAAZQGCAAAAAGVBggAAAABlgYIAOgKACEcBwAAmwsAIAkAAJ0MACAKAADNDAAgCwAA2AsAIA4AAL4MACAPAADBDAAgEAAAnAwAIBkAALMMACAbAACrDAAgLAAAywwAIC0AAMwMACCCBgAAygwAMIMGAAAmABCEBgAAygwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGtBgEA0goAIa4GAQDSCgAhrwYBANIKACGxBgEA0goAIeYGAQDSCgAh9gYBANMKACG9B0AA1goAIekHAAAmACDqBwAAJgAgGAMAANcKACAHAACbCwAgCQAAqgwAIA0AAIELACARAADQCwAgIgAA2wsAICQAANILACBLAACSCwAgTAAA1AsAIIIGAADUDAAwgwYAAA4AEIQGAADUDAAwhQYBANIKACGGBgEA0goAIYcGAQDSCgAhiAYBANIKACGJBgEA0woAIYoGAQDSCgAhiwYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHpBwAADgAg6gcAAA4AIB4IAADRDAAgDAAA_woAIA0AAIELACARAADQCwAgHAAAgwsAICUAAIALACAnAACCCwAgKgAA2AsAIC4AAMkLACAvAADKCwAgMAAAzAsAIDEAAM4LACAyAADPCwAgNAAAkgsAIDUAANILACA2AADTCwAgNwAA1AsAIDgAANsLACCCBgAA0AwAMIMGAAAYABCEBgAA0AwAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIeQGAQDTCgAh9QYBANMKACGpBwEA0woAIbwHAQDSCgAh6QcAABgAIOoHAAAYACACmgYBAAAAAcEGAQAAAAEXBwAAmwsAIAkAAJ0MACAQAACiDAAgFgAAoQwAIBgAAP8LACAzAADXCgAgggYAAJ8MADCDBgAAoQEAEIQGAACfDAAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIZoGAQDSCgAhrwYBANMKACG7BgEA0woAIb0GAACgDL0GIr4GAQDTCgAhvwZAAP4LACHABkAA1goAIcEGAQDSCgAhwgYBANMKACEEjwYAAAC9BgKQBgAAAL0GCJEGAAAAvQYIlgYAAOQKvQYiEhQAAJILACCCBgAAkQsAMIMGAACFBwAQhAYAAJELADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhtgYBANIKACHyBgEA0woAIfMGAQDSCgAh9AYAAMsKACD1BgEA0woAIfYGAQDTCgAh9wYBANIKACHpBwAAhQcAIOoHAACFBwAgGAMAANcKACAHAACbCwAgCQAAqgwAIA0AAIELACARAADQCwAgIgAA2wsAICQAANILACBLAACSCwAgTAAA1AsAIIIGAADUDAAwgwYAAA4AEIQGAADUDAAwhQYBANIKACGGBgEA0goAIYcGAQDSCgAhiAYBANIKACGJBgEA0woAIYoGAQDSCgAhiwYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHpBwAADgAg6gcAAA4AIBMDAADXCgAgBwAAmwsAIAkAAJ0MACANAACBCwAgEwAA0wsAIBoAAI8LACAcAACDCwAgIgAA2wsAIIIGAACjDAAwgwYAAFMAEIQGAACjDAAwhQYBANIKACGJBgEA0woAIYoGAQDSCgAhiwYBANMKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHaBgEA0goAIQ0HAACbCwAgCQAAnQwAICUAAIALACCCBgAApAwAMIMGAABrABCEBgAApAwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHeBgEA0goAIeQGAQDTCgAhAsMGAQAAAAHeB0AAAAABCikAAJsMACCCBgAApgwAMIMGAACFAQAQhAYAAKYMADCFBgEA0goAIY0GQADWCgAhjgZAANYKACG9BgAApwzgByLDBgEA0goAId4HQADWCgAhBI8GAAAA4AcCkAYAAADgBwiRBgAAAOAHCJYGAAD1C-AHIgKLBgEAAAAB5gYBAAAAAREHAACbCwAgCQAAqgwAIBsAAKsMACAcAACDCwAgggYAAKkMADCDBgAAdAAQhAYAAKkMADCFBgEA0goAIYoGAQDSCgAhiwYBANIKACGNBkAA1goAIY4GQADWCgAh1gYBANIKACHmBgEA0goAIYgHIADVCgAhkAcQAIoMACGRBxAAigwAIR4IAADRDAAgDAAA_woAIA0AAIELACARAADQCwAgHAAAgwsAICUAAIALACAnAACCCwAgKgAA2AsAIC4AAMkLACAvAADKCwAgMAAAzAsAIDEAAM4LACAyAADPCwAgNAAAkgsAIDUAANILACA2AADTCwAgNwAA1AsAIDgAANsLACCCBgAA0AwAMIMGAAAYABCEBgAA0AwAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIeQGAQDTCgAh9QYBANMKACGpBwEA0woAIbwHAQDSCgAh6QcAABgAIOoHAAAYACAPDAAA_woAIA0AAIELACAcAACDCwAgJQAAgAsAICcAAIILACCCBgAA_goAMIMGAAAvABCEBgAA_goAMIUGAQDSCgAhigYBANIKACHeBgEA0goAId8GQADWCgAh4AZAANYKACHpBwAALwAg6gcAAC8AIBoQAACiDAAgGAAA_wsAIBkAAK8MACAeAACbCwAgHwAAmwsAICAAANcKACAhAACdDAAgggYAAKwMADCDBgAAWwAQhAYAAKwMADCFBgEA0goAIY0GQADWCgAhjgZAANYKACGvBgEA0woAIbEGAQDTCgAhvQYAAK4MmwcivwZAAP4LACHCBgEA0woAIZkHAACtDJkHIpsHAQDSCgAhnAcBANIKACGdBwEA0goAIZ4HAQDTCgAhnwcBANMKACGgBwEA0woAIaEHQADWCgAhBI8GAAAAmQcCkAYAAACZBwiRBgAAAJkHCJYGAACwC5kHIgSPBgAAAJsHApAGAAAAmwcIkQYAAACbBwiWBgAArgubByIVAwAA1woAIAcAAJsLACAJAACdDAAgDQAAgQsAIBMAANMLACAaAACPCwAgHAAAgwsAICIAANsLACCCBgAAowwAMIMGAABTABCEBgAAowwAMIUGAQDSCgAhiQYBANMKACGKBgEA0goAIYsGAQDTCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAh2gYBANIKACHpBwAAUwAg6gcAAFMAIB8HAACbCwAgCQAAqgwAIBkAALMMACAbAACrDAAgHQAAtAwAIIIGAACwDAAwgwYAAFUAEIQGAACwDAAwhQYBANIKACGKBgEA0goAIYsGAQDSCgAhjQZAANYKACGOBkAA1goAIbEGAQDSCgAhvQYAALIMjgci1QYQAIoMACHWBgEA0goAIdcGAgCLDAAh5gYBANIKACH6BgEA0goAIfsGAQDTCgAh_AYBANMKACH9BgEA0woAIf4GAQDTCgAh_wYBANMKACGABwAAjQwAIIEHQAD-CwAhigcBANIKACGMBwAAsQyMByKOBwEA0goAIY8HQADWCgAhBI8GAAAAjAcCkAYAAACMBwiRBgAAAIwHCJYGAACiC4wHIgSPBgAAAI4HApAGAAAAjgcIkQYAAACOBwiWBgAAoAuOByIVAwAA1woAIAcAAJsLACAJAACdDAAgDQAAgQsAIBMAANMLACAaAACPCwAgHAAAgwsAICIAANsLACCCBgAAowwAMIMGAABTABCEBgAAowwAMIUGAQDSCgAhiQYBANMKACGKBgEA0goAIYsGAQDTCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAh2gYBANIKACHpBwAAUwAg6gcAAFMAIBMHAACbCwAgCQAAqgwAIBsAAKsMACAcAACDCwAgggYAAKkMADCDBgAAdAAQhAYAAKkMADCFBgEA0goAIYoGAQDSCgAhiwYBANIKACGNBkAA1goAIY4GQADWCgAh1gYBANIKACHmBgEA0goAIYgHIADVCgAhkAcQAIoMACGRBxAAigwAIekHAAB0ACDqBwAAdAAgAsEGAQAAAAHcBgEAAAABExYAALgMACAXAADXCgAgGAAA_wsAIBkAAK8MACCCBgAAtgwAMIMGAABLABCEBgAAtgwAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIbEGAQDTCgAhuwYBANMKACG9BgAAtwzcBiK-BgEA0woAIb8GQAD-CwAhwAZAANYKACHBBgEA0goAIcIGAQDTCgAh3AYBANIKACEEjwYAAADcBgKQBgAAANwGCJEGAAAA3AYIlgYAAPoK3AYiEhQAAI8LACCCBgAAjgsAMIMGAACeBwAQhAYAAI4LADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhtgYBANIKACHyBgEA0woAIfMGAQDSCgAh9AYAAMsKACD1BgEA0woAIfYGAQDTCgAh9wYBANIKACHpBwAAngcAIOoHAACeBwAgArAGAQAAAAGxBgEAAAABEgcAAJsLACAJAACdDAAgEgAAuwwAIBkAALMMACCCBgAAugwAMIMGAABEABCEBgAAugwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGwBgEA0goAIbEGAQDSCgAhsgYBANMKACGzBgEA0woAIbQGAQDTCgAhtQZAANYKACEVBwAAmwsAIAkAAJ0MACAOAAC-DAAgEAAAnAwAICMAANMLACCCBgAAvAwAMIMGAAA_ABCEBgAAvAwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGtBgEA0goAIa8GAQDSCgAhtgYBANIKACG3BgEA0woAIbkGAAC9DLkGIroGQAD-CwAh6QcAAD8AIOoHAAA_ACATBwAAmwsAIAkAAJ0MACAOAAC-DAAgEAAAnAwAICMAANMLACCCBgAAvAwAMIMGAAA_ABCEBgAAvAwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGtBgEA0goAIa8GAQDSCgAhtgYBANIKACG3BgEA0woAIbkGAAC9DLkGIroGQAD-CwAhBI8GAAAAuQYCkAYAAAC5BgiRBgAAALkGCJYGAADgCrkGIhYHAACbCwAgCQAAnQwAIA0AAIELACARAADQCwAgGwAAqwwAICQAANILACAmAADDDAAgggYAAMIMADCDBgAANQAQhAYAAMIMADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAh3gYBANIKACHkBgEA0woAIeUGAgCUDAAh5gYBANIKACHnBgEA0woAIekHAAA1ACDqBwAANQAgAq0GAQAAAAGuBgEAAAABEAcAAJsLACAJAACdDAAgDgAAvgwAIA8AAMEMACAQAACcDAAgggYAAMAMADCDBgAAOgAQhAYAAMAMADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhrQYBANIKACGuBgEA0goAIa8GAQDSCgAhFAcAAJsLACAJAACqDAAgCgAAzQwAIA0AAIELACARAADQCwAgggYAAM4MADCDBgAAIQAQhAYAAM4MADCFBgEA0goAIYoGAQDSCgAhiwYBANIKACGNBkAA1goAIY4GQADWCgAh5AYBANMKACHwBgIAlAwAIfYGAQDTCgAhvgcBANIKACG_BwEA0goAIekHAAAhACDqBwAAIQAgFAcAAJsLACAJAACdDAAgDQAAgQsAIBEAANALACAbAACrDAAgJAAA0gsAICYAAMMMACCCBgAAwgwAMIMGAAA1ABCEBgAAwgwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHeBgEA0goAIeQGAQDTCgAh5QYCAJQMACHmBgEA0goAIecGAQDTCgAhDwcAAJsLACAJAACdDAAgJQAAgAsAIIIGAACkDAAwgwYAAGsAEIQGAACkDAAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAId4GAQDSCgAh5AYBANMKACHpBwAAawAg6gcAAGsAIBIHAACWDAAgCQAAnQwAIAsAANgLACAbAADGDAAgggYAAMQMADCDBgAAMQAQhAYAAMQMADCFBgEA0goAIYoGAQDTCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhvQYAAMUM6wYi3gYBANIKACHkBgEA0woAIeYGAQDTCgAh6AYBANIKACHpBgEA0goAIQSPBgAAAOsGApAGAAAA6wYIkQYAAADrBgiWBgAAigvrBiIPDAAA_woAIA0AAIELACAcAACDCwAgJQAAgAsAICcAAIILACCCBgAA_goAMIMGAAAvABCEBgAA_goAMIUGAQDSCgAhigYBANIKACHeBgEA0goAId8GQADWCgAh4AZAANYKACHpBwAALwAg6gcAAC8AIBMHAACWDAAgCQAAnQwAICgAAMgMACApAACbDAAgKwAAyQwAIIIGAADHDAAwgwYAACoAEIQGAADHDAAwhQYBANIKACGKBgEA0woAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIcMGAQDSCgAh3gYBANIKACHkBgEA0woAIesGAQDTCgAh7AYBANIKACHtBgEA0goAIRQHAACWDAAgCQAAnQwAIAsAANgLACAbAADGDAAgggYAAMQMADCDBgAAMQAQhAYAAMQMADCFBgEA0goAIYoGAQDTCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhvQYAAMUM6wYi3gYBANIKACHkBgEA0woAIeYGAQDTCgAh6AYBANIKACHpBgEA0goAIekHAAAxACDqBwAAMQAgEAcAAJsLACAqAADYCwAgggYAAJcMADCDBgAAyAEAEIQGAACXDAAwhQYBANIKACGKBgEA0goAIY0GQADWCgAhjgZAANYKACHeBgEA0woAIcAHAQDSCgAhwQcBANIKACHCBwIAiwwAIcQHAACYDMQHIukHAADIAQAg6gcAAMgBACAaBwAAmwsAIAkAAJ0MACAKAADNDAAgCwAA2AsAIA4AAL4MACAPAADBDAAgEAAAnAwAIBkAALMMACAbAACrDAAgLAAAywwAIC0AAMwMACCCBgAAygwAMIMGAAAmABCEBgAAygwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGtBgEA0goAIa4GAQDSCgAhrwYBANIKACGxBgEA0goAIeYGAQDSCgAh9gYBANMKACG9B0AA1goAIQPhBgAAhQEAIOIGAACFAQAg4wYAAIUBACAdBwAAmwsAIAkAAJ0MACAQAACcDAAgKQAAmwwAIIIGAACZDAAwgwYAAIkBABCEBgAAmQwAMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGvBgEA0goAIcMGAQDSCgAhxAYIAJoMACHFBggAmgwAIcYGCACaDAAhxwYIAJoMACHIBggAmgwAIckGCACaDAAhygYIAJoMACHLBggAmgwAIcwGCACaDAAhzQYIAJoMACHOBggAmgwAIc8GCACaDAAh0AYIAJoMACHpBwAAiQEAIOoHAACJAQAgFAcAAJsLACAJAACqDAAgDQAAgQsAIA8AAMwLACCCBgAAzwwAMIMGAAAdABCEBgAAzwwAMIUGAQDSCgAhigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACG2BgEA0goAIeQGAQDTCgAh7gYBANMKACHvBkAA_gsAIfAGCACaDAAh8QYIAJoMACHpBwAAHQAg6gcAAB0AIBIHAACbCwAgCQAAqgwAIAoAAM0MACANAACBCwAgEQAA0AsAIIIGAADODAAwgwYAACEAEIQGAADODAAwhQYBANIKACGKBgEA0goAIYsGAQDSCgAhjQZAANYKACGOBkAA1goAIeQGAQDTCgAh8AYCAJQMACH2BgEA0woAIb4HAQDSCgAhvwcBANIKACESBwAAmwsAIAkAAKoMACANAACBCwAgDwAAzAsAIIIGAADPDAAwgwYAAB0AEIQGAADPDAAwhQYBANIKACGKBgEA0goAIYsGAQDSCgAhjQZAANYKACGOBkAA1goAIbYGAQDSCgAh5AYBANMKACHuBgEA0woAIe8GQAD-CwAh8AYIAJoMACHxBggAmgwAIRwIAADRDAAgDAAA_woAIA0AAIELACARAADQCwAgHAAAgwsAICUAAIALACAnAACCCwAgKgAA2AsAIC4AAMkLACAvAADKCwAgMAAAzAsAIDEAAM4LACAyAADPCwAgNAAAkgsAIDUAANILACA2AADTCwAgNwAA1AsAIDgAANsLACCCBgAA0AwAMIMGAAAYABCEBgAA0AwAMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIeQGAQDTCgAh9QYBANMKACGpBwEA0woAIbwHAQDSCgAhDgcAAJYMACA5AADTDAAgggYAANIMADCDBgAAEgAQhAYAANIMADCFBgEA0goAIYoGAQDTCgAhjQZAANYKACGOBkAA1goAIeQGAQDTCgAhqQcBANMKACG8BwEA0goAIekHAAASACDqBwAAEgAgDAcAAJYMACA5AADTDAAgggYAANIMADCDBgAAEgAQhAYAANIMADCFBgEA0goAIYoGAQDTCgAhjQZAANYKACGOBkAA1goAIeQGAQDTCgAhqQcBANMKACG8BwEA0goAIQPhBgAAGAAg4gYAABgAIOMGAAAYACAWAwAA1woAIAcAAJsLACAJAACqDAAgDQAAgQsAIBEAANALACAiAADbCwAgJAAA0gsAIEsAAJILACBMAADUCwAgggYAANQMADCDBgAADgAQhAYAANQMADCFBgEA0goAIYYGAQDSCgAhhwYBANIKACGIBgEA0goAIYkGAQDTCgAhigYBANIKACGLBgEA0goAIYwGAQDSCgAhjQZAANYKACGOBkAA1goAIQsDAADXCgAgBwAAmwsAIIIGAADVDAAwgwYAAAsAEIQGAADVDAAwhQYBANIKACGKBgEA0goAIYwGAQDSCgAhjQZAANYKACGOBkAA1goAIZUHAADWDOEHIgSPBgAAAOEHApAGAAAA4QcIkQYAAADhBwiWBgAA-QvhByIRAwAA1woAIIIGAADXDAAwgwYAAAcAEIQGAADXDAAwhQYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHJBwEA0goAIcoHAQDSCgAhywcBANMKACHMBwEA0woAIc0HAQDTCgAhzgdAAP4LACHPB0AA_gsAIdAHAQDTCgAh0QcBANMKACEMAwAA1woAIIIGAADYDAAwgwYAAAMAEIQGAADYDAAwhQYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHGB0AA1goAIdIHAQDSCgAh0wcBANMKACHUBwEA0woAIQAAAAAB7gcBAAAAAQHuBwEAAAABAe4HQAAAAAEFZgAA0xwAIGcAAJkeACDrBwAA1BwAIOwHAACYHgAg8QcAAP4EACALZgAA6Q0AMGcAAO4NADDrBwAA6g0AMOwHAADrDQAw7QcAAOwNACDuBwAA7Q0AMO8HAADtDQAw8AcAAO0NADDxBwAA7Q0AMPIHAADvDQAw8wcAAPANADALZgAA1Q0AMGcAANoNADDrBwAA1g0AMOwHAADXDQAw7QcAANgNACDuBwAA2Q0AMO8HAADZDQAw8AcAANkNADDxBwAA2Q0AMPIHAADbDQAw8wcAANwNADALZgAArg0AMGcAALMNADDrBwAArw0AMOwHAACwDQAw7QcAALENACDuBwAAsg0AMO8HAACyDQAw8AcAALINADDxBwAAsg0AMPIHAAC0DQAw8wcAALUNADALZgAAlw0AMGcAAJwNADDrBwAAmA0AMOwHAACZDQAw7QcAAJoNACDuBwAAmw0AMO8HAACbDQAw8AcAAJsNADDxBwAAmw0AMPIHAACdDQAw8wcAAJ4NADALZgAAhA0AMGcAAIkNADDrBwAAhQ0AMOwHAACGDQAw7QcAAIcNACDuBwAAiA0AMO8HAACIDQAw8AcAAIgNADDxBwAAiA0AMPIHAACKDQAw8wcAAIsNADALZgAA6QwAMGcAAO4MADDrBwAA6gwAMOwHAADrDAAw7QcAAOwMACDuBwAA7QwAMO8HAADtDAAw8AcAAO0MADDxBwAA7QwAMPIHAADvDAAw8wcAAPAMADAFZgAA0RwAIGcAAJYeACDrBwAA0hwAIOwHAACVHgAg8QcAABoAIAVmAADPHAAgZwAAkx4AIOsHAADQHAAg7AcAAJIeACDxBwAA-wIAIBUYAACBDQAgGQAAgg0AIB4AAP4MACAfAAD_DAAgIAAAgA0AICEAAIMNACCFBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZwHAQAAAAGdBwEAAAABngcBAAAAAZ8HAQAAAAGgBwEAAAABoQdAAAAAAQIAAABdACBmAAD9DAAgAwAAAF0AIGYAAP0MACBnAAD2DAAgAV8AAJEeADAaEAAAogwAIBgAAP8LACAZAACvDAAgHgAAmwsAIB8AAJsLACAgAADXCgAgIQAAnQwAIIIGAACsDAAwgwYAAFsAEIQGAACsDAAwhQYBAAAAAY0GQADWCgAhjgZAANYKACGvBgEA0woAIbEGAQDTCgAhvQYAAK4MmwcivwZAAP4LACHCBgEA0woAIZkHAACtDJkHIpsHAQDSCgAhnAcBANIKACGdBwEA0goAIZ4HAQDTCgAhnwcBANMKACGgBwEA0woAIaEHQADWCgAhAgAAAF0AIF8AAPYMACACAAAA8QwAIF8AAPIMACATggYAAPAMADCDBgAA8QwAEIQGAADwDAAwhQYBANIKACGNBkAA1goAIY4GQADWCgAhrwYBANMKACGxBgEA0woAIb0GAACuDJsHIr8GQAD-CwAhwgYBANMKACGZBwAArQyZByKbBwEA0goAIZwHAQDSCgAhnQcBANIKACGeBwEA0woAIZ8HAQDTCgAhoAcBANMKACGhB0AA1goAIROCBgAA8AwAMIMGAADxDAAQhAYAAPAMADCFBgEA0goAIY0GQADWCgAhjgZAANYKACGvBgEA0woAIbEGAQDTCgAhvQYAAK4MmwcivwZAAP4LACHCBgEA0woAIZkHAACtDJkHIpsHAQDSCgAhnAcBANIKACGdBwEA0goAIZ4HAQDTCgAhnwcBANMKACGgBwEA0woAIaEHQADWCgAhD4UGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbEGAQDeDAAhvQYAAPQMmwcivwZAAPUMACHCBgEA3gwAIZkHAADzDJkHIpsHAQDdDAAhnAcBAN0MACGdBwEA3QwAIZ4HAQDeDAAhnwcBAN4MACGgBwEA3gwAIaEHQADfDAAhAe4HAAAAmQcCAe4HAAAAmwcCAe4HQAAAAAEVGAAA-gwAIBkAAPsMACAeAAD3DAAgHwAA-AwAICAAAPkMACAhAAD8DAAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcimwcBAN0MACGcBwEA3QwAIZ0HAQDdDAAhngcBAN4MACGfBwEA3gwAIaAHAQDeDAAhoQdAAN8MACEFZgAA_R0AIGcAAI8eACDrBwAA_h0AIOwHAACOHgAg8QcAAP4EACAFZgAA-x0AIGcAAIweACDrBwAA_B0AIOwHAACLHgAg8QcAAP4EACAFZgAA-R0AIGcAAIkeACDrBwAA-h0AIOwHAACIHgAg8QcAAPsCACAHZgAA9x0AIGcAAIYeACDrBwAA-B0AIOwHAACFHgAg7wcAAFEAIPAHAABRACDxBwAA-wIAIAdmAAD1HQAgZwAAgx4AIOsHAAD2HQAg7AcAAIIeACDvBwAAUwAg8AcAAFMAIPEHAACdAQAgB2YAAPMdACBnAACAHgAg6wcAAPQdACDsBwAA_x0AIO8HAAAYACDwBwAAGAAg8QcAABoAIBUYAACBDQAgGQAAgg0AIB4AAP4MACAfAAD_DAAgIAAAgA0AICEAAIMNACCFBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZwHAQAAAAGdBwEAAAABngcBAAAAAZ8HAQAAAAGgBwEAAAABoQdAAAAAAQNmAAD9HQAg6wcAAP4dACDxBwAA_gQAIANmAAD7HQAg6wcAAPwdACDxBwAA_gQAIANmAAD5HQAg6wcAAPodACDxBwAA-wIAIANmAAD3HQAg6wcAAPgdACDxBwAA-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_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABAgAAAKMBACBmAACoDQAgAwAAAKMBACBmAACoDQAgZwAAog0AIAFfAADiHQAwGAcAAJsLACAJAACdDAAgEAAAogwAIBYAAKEMACAYAAD_CwAgMwAA1woAIIIGAACfDAAwgwYAAKEBABCEBgAAnwwAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIZoGAQDSCgAhrwYBANMKACG7BgEA0woAIb0GAACgDL0GIr4GAQDTCgAhvwZAAP4LACHABkAA1goAIcEGAQDSCgAhwgYBANMKACHjBwAAngwAIAIAAACjAQAgXwAAog0AIAIAAACfDQAgXwAAoA0AIBGCBgAAng0AMIMGAACfDQAQhAYAAJ4NADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhmgYBANIKACGvBgEA0woAIbsGAQDTCgAhvQYAAKAMvQYivgYBANMKACG_BkAA_gsAIcAGQADWCgAhwQYBANIKACHCBgEA0woAIRGCBgAAng0AMIMGAACfDQAQhAYAAJ4NADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhmgYBANIKACGvBgEA0woAIbsGAQDTCgAhvQYAAKAMvQYivgYBANMKACG_BkAA_gsAIcAGQADWCgAhwQYBANIKACHCBgEA0woAIQ2FBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhmgYBAN0MACG7BgEA3gwAIb0GAAChDb0GIr4GAQDeDAAhvwZAAPUMACHABkAA3wwAIcEGAQDdDAAhwgYBAN4MACEB7gcAAAC9BgISBwAApg0AIAkAAKcNACAWAACjDQAgGAAApQ0AIDMAAKQNACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhmgYBAN0MACG7BgEA3gwAIb0GAAChDb0GIr4GAQDeDAAhvwZAAPUMACHABkAA3wwAIcEGAQDdDAAhwgYBAN4MACEFZgAA0R0AIGcAAOAdACDrBwAA0h0AIOwHAADfHQAg8QcAAIIHACAFZgAAzx0AIGcAAN0dACDrBwAA0B0AIOwHAADcHQAg8QcAAPsCACAHZgAAzR0AIGcAANodACDrBwAAzh0AIOwHAADZHQAg7wcAAFEAIPAHAABRACDxBwAA-wIAIAVmAADLHQAgZwAA1x0AIOsHAADMHQAg7AcAANYdACDxBwAA_gQAIAdmAADJHQAgZwAA1B0AIOsHAADKHQAg7AcAANMdACDvBwAAGAAg8AcAABgAIPEHAAAaACASBwAArA0AIAkAAK0NACAWAACpDQAgGAAAqw0AIDMAAKoNACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAG7BgEAAAABvQYAAAC9BgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABwgYBAAAAAQNmAADRHQAg6wcAANIdACDxBwAAggcAIANmAADPHQAg6wcAANAdACDxBwAA-wIAIANmAADNHQAg6wcAAM4dACDxBwAA-wIAIANmAADLHQAg6wcAAMwdACDxBwAA_gQAIANmAADJHQAg6wcAAModACDxBwAAGgAgDgcAANINACAJAADTDQAgDgAA0Q0AICMAANQNACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAG2BgEAAAABtwYBAAAAAbkGAAAAuQYCugZAAAAAAQIAAABBACBmAADQDQAgAwAAAEEAIGYAANANACBnAAC5DQAgAV8AAMgdADATBwAAmwsAIAkAAJ0MACAOAAC-DAAgEAAAnAwAICMAANMLACCCBgAAvAwAMIMGAAA_ABCEBgAAvAwAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa0GAQDSCgAhrwYBANIKACG2BgEA0goAIbcGAQDTCgAhuQYAAL0MuQYiugZAAP4LACECAAAAQQAgXwAAuQ0AIAIAAAC2DQAgXwAAtw0AIA6CBgAAtQ0AMIMGAAC2DQAQhAYAALUNADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhrQYBANIKACGvBgEA0goAIbYGAQDSCgAhtwYBANMKACG5BgAAvQy5BiK6BkAA_gsAIQ6CBgAAtQ0AMIMGAAC2DQAQhAYAALUNADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhrQYBANIKACGvBgEA0goAIbYGAQDSCgAhtwYBANMKACG5BgAAvQy5BiK6BkAA_gsAIQqFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACG2BgEA3QwAIbcGAQDeDAAhuQYAALgNuQYiugZAAPUMACEB7gcAAAC5BgIOBwAAuw0AIAkAALwNACAOAAC6DQAgIwAAvQ0AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIbYGAQDdDAAhtwYBAN4MACG5BgAAuA25BiK6BkAA9QwAIQVmAACtHQAgZwAAxh0AIOsHAACuHQAg7AcAAMUdACDxBwAANwAgBWYAAKsdACBnAADDHQAg6wcAAKwdACDsBwAAwh0AIPEHAAD-BAAgB2YAAKkdACBnAADAHQAg6wcAAKodACDsBwAAvx0AIO8HAAAYACDwBwAAGAAg8QcAABoAIAtmAAC-DQAwZwAAww0AMOsHAAC_DQAw7AcAAMANADDtBwAAwQ0AIO4HAADCDQAw7wcAAMINADDwBwAAwg0AMPEHAADCDQAw8gcAAMQNADDzBwAAxQ0AMA0HAADODQAgCQAAzw0AIBkAAM0NACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BkAAAAABAgAAAEYAIGYAAMwNACADAAAARgAgZgAAzA0AIGcAAMgNACABXwAAvh0AMBMHAACbCwAgCQAAnQwAIBIAALsMACAZAACzDAAgggYAALoMADCDBgAARAAQhAYAALoMADCFBgEAAAABigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGwBgEA0goAIbEGAQDSCgAhsgYBANMKACGzBgEA0woAIbQGAQDTCgAhtQZAANYKACHnBwAAuQwAIAIAAABGACBfAADIDQAgAgAAAMYNACBfAADHDQAgDoIGAADFDQAwgwYAAMYNABCEBgAAxQ0AMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGwBgEA0goAIbEGAQDSCgAhsgYBANMKACGzBgEA0woAIbQGAQDTCgAhtQZAANYKACEOggYAAMUNADCDBgAAxg0AEIQGAADFDQAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIbAGAQDSCgAhsQYBANIKACGyBgEA0woAIbMGAQDTCgAhtAYBANMKACG1BkAA1goAIQqFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhsQYBAN0MACGyBgEA3gwAIbMGAQDeDAAhtAYBAN4MACG1BkAA3wwAIQ0HAADKDQAgCQAAyw0AIBkAAMkNACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhsQYBAN0MACGyBgEA3gwAIbMGAQDeDAAhtAYBAN4MACG1BkAA3wwAIQVmAACzHQAgZwAAvB0AIOsHAAC0HQAg7AcAALsdACDxBwAAnQEAIAVmAACxHQAgZwAAuR0AIOsHAACyHQAg7AcAALgdACDxBwAA_gQAIAdmAACvHQAgZwAAth0AIOsHAACwHQAg7AcAALUdACDvBwAAGAAg8AcAABgAIPEHAAAaACANBwAAzg0AIAkAAM8NACAZAADNDQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABsgYBAAAAAbMGAQAAAAG0BgEAAAABtQZAAAAAAQNmAACzHQAg6wcAALQdACDxBwAAnQEAIANmAACxHQAg6wcAALIdACDxBwAA_gQAIANmAACvHQAg6wcAALAdACDxBwAAGgAgDgcAANINACAJAADTDQAgDgAA0Q0AICMAANQNACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAG2BgEAAAABtwYBAAAAAbkGAAAAuQYCugZAAAAAAQNmAACtHQAg6wcAAK4dACDxBwAANwAgA2YAAKsdACDrBwAArB0AIPEHAAD-BAAgA2YAAKkdACDrBwAAqh0AIPEHAAAaACAEZgAAvg0AMOsHAAC_DQAw7QcAAMENACDxBwAAwg0AMAsHAADnDQAgCQAA6A0AIA4AAOUNACAPAADmDQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAQIAAAA8ACBmAADkDQAgAwAAADwAIGYAAOQNACBnAADfDQAgAV8AAKgdADARBwAAmwsAIAkAAJ0MACAOAAC-DAAgDwAAwQwAIBAAAJwMACCCBgAAwAwAMIMGAAA6ABCEBgAAwAwAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa0GAQDSCgAhrgYBANIKACGvBgEA0goAIegHAAC_DAAgAgAAADwAIF8AAN8NACACAAAA3Q0AIF8AAN4NACALggYAANwNADCDBgAA3Q0AEIQGAADcDQAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa0GAQDSCgAhrgYBANIKACGvBgEA0goAIQuCBgAA3A0AMIMGAADdDQAQhAYAANwNADCFBgEA0goAIYoGAQDSCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhrQYBANIKACGuBgEA0goAIa8GAQDSCgAhB4UGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhCwcAAOINACAJAADjDQAgDgAA4A0AIA8AAOENACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACGuBgEA3QwAIQVmAACaHQAgZwAAph0AIOsHAACbHQAg7AcAAKUdACDxBwAANwAgBWYAAJgdACBnAACjHQAg6wcAAJkdACDsBwAAoh0AIPEHAAAjACAFZgAAlh0AIGcAAKAdACDrBwAAlx0AIOwHAACfHQAg8QcAAP4EACAHZgAAlB0AIGcAAJ0dACDrBwAAlR0AIOwHAACcHQAg7wcAABgAIPAHAAAYACDxBwAAGgAgCwcAAOcNACAJAADoDQAgDgAA5Q0AIA8AAOYNACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABA2YAAJodACDrBwAAmx0AIPEHAAA3ACADZgAAmB0AIOsHAACZHQAg8QcAACMAIANmAACWHQAg6wcAAJcdACDxBwAA_gQAIANmAACUHQAg6wcAAJUdACDxBwAAGgAgFQcAALAOACAJAACtDgAgCgAArg4AIAsAAKcOACAOAACsDgAgDwAAqg4AIBkAAKsOACAbAACvDgAgLAAAqA4AIC0AAKkOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQIAAAAoACBmAACmDgAgAwAAACgAIGYAAKYOACBnAADzDQAgAV8AAJMdADAaBwAAmwsAIAkAAJ0MACAKAADNDAAgCwAA2AsAIA4AAL4MACAPAADBDAAgEAAAnAwAIBkAALMMACAbAACrDAAgLAAAywwAIC0AAMwMACCCBgAAygwAMIMGAAAmABCEBgAAygwAMIUGAQAAAAGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa0GAQDSCgAhrgYBANIKACGvBgEA0goAIbEGAQDSCgAh5gYBANIKACH2BgEA0woAIb0HQADWCgAhAgAAACgAIF8AAPMNACACAAAA8Q0AIF8AAPINACAPggYAAPANADCDBgAA8Q0AEIQGAADwDQAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAIa0GAQDSCgAhrgYBANIKACGvBgEA0goAIbEGAQDSCgAh5gYBANIKACH2BgEA0woAIb0HQADWCgAhD4IGAADwDQAwgwYAAPENABCEBgAA8A0AMIUGAQDSCgAhigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACGtBgEA0goAIa4GAQDSCgAhrwYBANIKACGxBgEA0goAIeYGAQDSCgAh9gYBANMKACG9B0AA1goAIQuFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACGuBgEA3QwAIbEGAQDdDAAh5gYBAN0MACH2BgEA3gwAIb0HQADfDAAhFQcAAP0NACAJAAD6DQAgCgAA-w0AIAsAAPQNACAOAAD5DQAgDwAA9w0AIBkAAPgNACAbAAD8DQAgLAAA9Q0AIC0AAPYNACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACGuBgEA3QwAIbEGAQDdDAAh5gYBAN0MACH2BgEA3gwAIb0HQADfDAAhC2YAAJIOADBnAACXDgAw6wcAAJMOADDsBwAAlA4AMO0HAACVDgAg7gcAAJYOADDvBwAAlg4AMPAHAACWDgAw8QcAAJYOADDyBwAAmA4AMPMHAACZDgAwC2YAAIUOADBnAACKDgAw6wcAAIYOADDsBwAAhw4AMO0HAACIDgAg7gcAAIkOADDvBwAAiQ4AMPAHAACJDgAw8QcAAIkOADDyBwAAiw4AMPMHAACMDgAwB2YAAP4NACBnAACBDgAg6wcAAP8NACDsBwAAgA4AIO8HAACJAQAg8AcAAIkBACDxBwAArQEAIAVmAADhHAAgZwAAkR0AIOsHAADiHAAg7AcAAJAdACDxBwAAIwAgBWYAAN8cACBnAACOHQAg6wcAAOAcACDsBwAAjR0AIPEHAACdAQAgBWYAAN0cACBnAACLHQAg6wcAAN4cACDsBwAAih0AIPEHAAA3ACAHZgAA2xwAIGcAAIgdACDrBwAA3BwAIOwHAACHHQAg7wcAABgAIPAHAAAYACDxBwAAGgAgB2YAANkcACBnAACFHQAg6wcAANocACDsBwAAhB0AIO8HAAAdACDwBwAAHQAg8QcAAB8AIAVmAADXHAAgZwAAgh0AIOsHAADYHAAg7AcAAIEdACDxBwAAmggAIAVmAADVHAAgZwAA_xwAIOsHAADWHAAg7AcAAP4cACDxBwAA_gQAIBYHAACVDQAgCQAAlg0AIBAAAIQOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAHEBggAAAABxQYIAAAAAcYGCAAAAAHHBggAAAAByAYIAAAAAckGCAAAAAHKBggAAAABywYIAAAAAcwGCAAAAAHNBggAAAABzgYIAAAAAc8GCAAAAAHQBggAAAABAgAAAK0BACBmAAD-DQAgAwAAAIkBACBmAAD-DQAgZwAAgg4AIBgAAACJAQAgBwAAkQ0AIAkAAJINACAQAACDDgAgXwAAgg4AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGvBgEA3QwAIcQGCACODQAhxQYIAI4NACHGBggAjg0AIccGCACODQAhyAYIAI4NACHJBggAjg0AIcoGCACODQAhywYIAI4NACHMBggAjg0AIc0GCACODQAhzgYIAI4NACHPBggAjg0AIdAGCACODQAhFgcAAJENACAJAACSDQAgEAAAgw4AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGvBgEA3QwAIcQGCACODQAhxQYIAI4NACHGBggAjg0AIccGCACODQAhyAYIAI4NACHJBggAjg0AIcoGCACODQAhywYIAI4NACHMBggAjg0AIc0GCACODQAhzgYIAI4NACHPBggAjg0AIdAGCACODQAhBWYAAPkcACBnAAD8HAAg6wcAAPocACDsBwAA-xwAIPEHAAAQACADZgAA-RwAIOsHAAD6HAAg8QcAABAAIAWFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAOAHAt4HQAAAAAECAAAAhwEAIGYAAJEOACADAAAAhwEAIGYAAJEOACBnAACQDgAgAV8AAPgcADALKQAAmwwAIIIGAACmDAAwgwYAAIUBABCEBgAApgwAMIUGAQAAAAGNBkAA1goAIY4GQADWCgAhvQYAAKcM4AciwwYBANIKACHeB0AA1goAIeQHAAClDAAgAgAAAIcBACBfAACQDgAgAgAAAI0OACBfAACODgAgCYIGAACMDgAwgwYAAI0OABCEBgAAjA4AMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIb0GAACnDOAHIsMGAQDSCgAh3gdAANYKACEJggYAAIwOADCDBgAAjQ4AEIQGAACMDgAwhQYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAKcM4AciwwYBANIKACHeB0AA1goAIQWFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAAjw7gByLeB0AA3wwAIQHuBwAAAOAHAgWFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAAjw7gByLeB0AA3wwAIQWFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAOAHAt4HQAAAAAEOBwAApA4AIAkAAKUOACAoAACiDgAgKwAAow4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAECAAAALAAgZgAAoQ4AIAMAAAAsACBmAAChDgAgZwAAnA4AIAFfAAD3HAAwEwcAAJYMACAJAACdDAAgKAAAyAwAICkAAJsMACArAADJDAAgggYAAMcMADCDBgAAKgAQhAYAAMcMADCFBgEAAAABigYBANMKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHDBgEA0goAId4GAQDSCgAh5AYBANMKACHrBgEA0woAIewGAQDSCgAh7QYBANIKACECAAAALAAgXwAAnA4AIAIAAACaDgAgXwAAmw4AIA6CBgAAmQ4AMIMGAACaDgAQhAYAAJkOADCFBgEA0goAIYoGAQDTCgAhiwYBANMKACGNBkAA1goAIY4GQADWCgAhwwYBANIKACHeBgEA0goAIeQGAQDTCgAh6wYBANMKACHsBgEA0goAIe0GAQDSCgAhDoIGAACZDgAwgwYAAJoOABCEBgAAmQ4AMIUGAQDSCgAhigYBANMKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHDBgEA0goAId4GAQDSCgAh5AYBANMKACHrBgEA0woAIewGAQDSCgAh7QYBANIKACEKhQYBAN0MACGKBgEA3gwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAh5AYBAN4MACHrBgEA3gwAIewGAQDdDAAh7QYBAN0MACEOBwAAnw4AIAkAAKAOACAoAACdDgAgKwAAng4AIIUGAQDdDAAhigYBAN4MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAh6wYBAN4MACHsBgEA3QwAIe0GAQDdDAAhBWYAAOkcACBnAAD1HAAg6wcAAOocACDsBwAA9BwAIPEHAAAzACAFZgAA5xwAIGcAAPIcACDrBwAA6BwAIOwHAADxHAAg8QcAAMoBACAHZgAA5RwAIGcAAO8cACDrBwAA5hwAIOwHAADuHAAg7wcAABYAIPAHAAAWACDxBwAA_gQAIAdmAADjHAAgZwAA7BwAIOsHAADkHAAg7AcAAOscACDvBwAAGAAg8AcAABgAIPEHAAAaACAOBwAApA4AIAkAAKUOACAoAACiDgAgKwAAow4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAEDZgAA6RwAIOsHAADqHAAg8QcAADMAIANmAADnHAAg6wcAAOgcACDxBwAAygEAIANmAADlHAAg6wcAAOYcACDxBwAA_gQAIANmAADjHAAg6wcAAOQcACDxBwAAGgAgFQcAALAOACAJAACtDgAgCgAArg4AIAsAAKcOACAOAACsDgAgDwAAqg4AIBkAAKsOACAbAACvDgAgLAAAqA4AIC0AAKkOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQRmAACSDgAw6wcAAJMOADDtBwAAlQ4AIPEHAACWDgAwBGYAAIUOADDrBwAAhg4AMO0HAACIDgAg8QcAAIkOADADZgAA_g0AIOsHAAD_DQAg8QcAAK0BACADZgAA4RwAIOsHAADiHAAg8QcAACMAIANmAADfHAAg6wcAAOAcACDxBwAAnQEAIANmAADdHAAg6wcAAN4cACDxBwAANwAgA2YAANscACDrBwAA3BwAIPEHAAAaACADZgAA2RwAIOsHAADaHAAg8QcAAB8AIANmAADXHAAg6wcAANgcACDxBwAAmggAIANmAADVHAAg6wcAANYcACDxBwAA_gQAIANmAADTHAAg6wcAANQcACDxBwAA_gQAIARmAADpDQAw6wcAAOoNADDtBwAA7A0AIPEHAADtDQAwBGYAANUNADDrBwAA1g0AMO0HAADYDQAg8QcAANkNADAEZgAArg0AMOsHAACvDQAw7QcAALENACDxBwAAsg0AMARmAACXDQAw6wcAAJgNADDtBwAAmg0AIPEHAACbDQAwBGYAAIQNADDrBwAAhQ0AMO0HAACHDQAg8QcAAIgNADAEZgAA6QwAMOsHAADqDAAw7QcAAOwMACDxBwAA7QwAMANmAADRHAAg6wcAANIcACDxBwAAGgAgA2YAAM8cACDrBwAA0BwAIPEHAAD7AgAgAAAAAu4HAQAAAAT4BwEAAAAFAu4HAQAAAAT4BwEAAAAFAe4HIAAAAAEFZgAAyhwAIGcAAM0cACDrBwAAyxwAIOwHAADMHAAg8QcAAPsCACAB7gcBAAAABAHuBwEAAAAEA2YAAMocACDrBwAAyxwAIPEHAAD7AgAgGwQAAJ0ZACAFAACeGQAgBgAA_hYAIBAAAP8WACAZAACAFwAgNAAA0REAIEAAAIIXACBNAACCFwAgTgAA0REAIE8AAJ8ZACBQAADAEQAgUQAAwBEAIFIAAKAZACBTAAChGQAgVAAAjBcAIFUAAIwXACBWAACLFwAgVwAAixcAIFgAAIoXACBZAACiGQAgiQYAANkMACDXBwAA2QwAINgHAADZDAAg2QcAANkMACDaBwAA2QwAINsHAADZDAAg3AcAANkMACAAAAAFZgAAxRwAIGcAAMgcACDrBwAAxhwAIOwHAADHHAAg8QcAABAAIANmAADFHAAg6wcAAMYcACDxBwAAEAAgAAAABWYAAMAcACBnAADDHAAg6wcAAMEcACDsBwAAwhwAIPEHAABBACADZgAAwBwAIOsHAADBHAAg8QcAAEEAIAAAAAVmAAC7HAAgZwAAvhwAIOsHAAC8HAAg7AcAAL0cACDxBwAAEAAgA2YAALscACDrBwAAvBwAIPEHAAAQACAAAAAHZgAAthwAIGcAALkcACDrBwAAtxwAIOwHAAC4HAAg7wcAAA4AIPAHAAAOACDxBwAAEAAgA2YAALYcACDrBwAAtxwAIPEHAAAQACAAAAAAAAAAAAAAAe4HAAAA0wYCAe4HAAAA1QYCBe4HEAAAAAH0BxAAAAAB9QcQAAAAAfYHEAAAAAH3BxAAAAABBe4HAgAAAAH0BwIAAAAB9QcCAAAAAfYHAgAAAAH3BwIAAAABBWYAAK4cACBnAAC0HAAg6wcAAK8cACDsBwAAsxwAIPEHAAD-BAAgB2YAAKwcACBnAACxHAAg6wcAAK0cACDsBwAAsBwAIO8HAADTAQAg8AcAANMBACDxBwAA1QEAIANmAACuHAAg6wcAAK8cACDxBwAA_gQAIANmAACsHAAg6wcAAK0cACDxBwAA1QEAIAAAAAVmAADvGwAgZwAAqhwAIOsHAADwGwAg7AcAAKkcACDxBwAA_gQAIAdmAADtGwAgZwAApxwAIOsHAADuGwAg7AcAAKYcACDvBwAAGAAg8AcAABgAIPEHAAAaACAFZgAA6xsAIGcAAKQcACDrBwAA7BsAIOwHAACjHAAg8QcAAPsCACALZgAAsw8AMGcAALcPADDrBwAAtA8AMOwHAAC1DwAw7QcAALYPACDuBwAA7Q0AMO8HAADtDQAw8AcAAO0NADDxBwAA7Q0AMPIHAAC4DwAw8wcAAPANADALZgAAqg8AMGcAAK4PADDrBwAAqw8AMOwHAACsDwAw7QcAAK0PACDuBwAAwg0AMO8HAADCDQAw8AcAAMINADDxBwAAwg0AMPIHAACvDwAw8wcAAMUNADALZgAAlw8AMGcAAJwPADDrBwAAmA8AMOwHAACZDwAw7QcAAJoPACDuBwAAmw8AMO8HAACbDwAw8AcAAJsPADDxBwAAmw8AMPIHAACdDwAw8wcAAJ4PADALZgAAgQ8AMGcAAIYPADDrBwAAgg8AMOwHAACDDwAw7QcAAIQPACDuBwAAhQ8AMO8HAACFDwAw8AcAAIUPADDxBwAAhQ8AMPIHAACHDwAw8wcAAIgPADALZgAA9g4AMGcAAPoOADDrBwAA9w4AMOwHAAD4DgAw7QcAAPkOACDuBwAA7QwAMO8HAADtDAAw8AcAAO0MADDxBwAA7QwAMPIHAAD7DgAw8wcAAPAMADAVEAAAgA8AIBgAAIENACAeAAD-DAAgHwAA_wwAICAAAIANACAhAACDDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAb0GAAAAmwcCvwZAAAAAAcIGAQAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAECAAAAXQAgZgAA_w4AIAMAAABdACBmAAD_DgAgZwAA_Q4AIAFfAACiHAAwAgAAAF0AIF8AAP0OACACAAAA8QwAIF8AAPwOACAPhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhrwYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcimwcBAN0MACGcBwEA3QwAIZ0HAQDdDAAhngcBAN4MACGfBwEA3gwAIaAHAQDeDAAhoQdAAN8MACEVEAAA_g4AIBgAAPoMACAeAAD3DAAgHwAA-AwAICAAAPkMACAhAAD8DAAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhrwYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcimwcBAN0MACGcBwEA3QwAIZ0HAQDdDAAhngcBAN4MACGfBwEA3gwAIaAHAQDeDAAhoQdAAN8MACEHZgAAnRwAIGcAAKAcACDrBwAAnhwAIOwHAACfHAAg7wcAAA4AIPAHAAAOACDxBwAAEAAgFRAAAIAPACAYAACBDQAgHgAA_gwAIB8AAP8MACAgAACADQAgIQAAgw0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABA2YAAJ0cACDrBwAAnhwAIPEHAAAQACAaBwAAkw8AIAkAAJQPACAbAACVDwAgHQAAlg8AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAAQIAAABXACBmAACSDwAgAwAAAFcAIGYAAJIPACBnAACNDwAgAV8AAJwcADAfBwAAmwsAIAkAAKoMACAZAACzDAAgGwAAqwwAIB0AALQMACCCBgAAsAwAMIMGAABVABCEBgAAsAwAMIUGAQAAAAGKBgEA0goAIYsGAQDSCgAhjQZAANYKACGOBkAA1goAIbEGAQDSCgAhvQYAALIMjgci1QYQAIoMACHWBgEA0goAIdcGAgCLDAAh5gYBANIKACH6BgEAAAAB-wYBANMKACH8BgEAAAAB_QYBANMKACH-BgEA0woAIf8GAQDTCgAhgAcAAI0MACCBB0AA_gsAIYoHAQDSCgAhjAcAALEMjAcijgcBANIKACGPB0AA1goAIQIAAABXACBfAACNDwAgAgAAAIkPACBfAACKDwAgGoIGAACIDwAwgwYAAIkPABCEBgAAiA8AMIUGAQDSCgAhigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACGxBgEA0goAIb0GAACyDI4HItUGEACKDAAh1gYBANIKACHXBgIAiwwAIeYGAQDSCgAh-gYBANIKACH7BgEA0woAIfwGAQDTCgAh_QYBANMKACH-BgEA0woAIf8GAQDTCgAhgAcAAI0MACCBB0AA_gsAIYoHAQDSCgAhjAcAALEMjAcijgcBANIKACGPB0AA1goAIRqCBgAAiA8AMIMGAACJDwAQhAYAAIgPADCFBgEA0goAIYoGAQDSCgAhiwYBANIKACGNBkAA1goAIY4GQADWCgAhsQYBANIKACG9BgAAsgyOByLVBhAAigwAIdYGAQDSCgAh1wYCAIsMACHmBgEA0goAIfoGAQDSCgAh-wYBANMKACH8BgEA0woAIf0GAQDTCgAh_gYBANMKACH_BgEA0woAIYAHAACNDAAggQdAAP4LACGKBwEA0goAIYwHAACxDIwHIo4HAQDSCgAhjwdAANYKACEWhQYBAN0MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIb0GAACMD44HItUGEADlDgAh1gYBAN0MACHXBgIA5g4AIeYGAQDdDAAh-gYBAN0MACH7BgEA3gwAIfwGAQDeDAAh_QYBAN4MACH-BgEA3gwAIf8GAQDeDAAhgAeAAAAAAYEHQAD1DAAhigcBAN0MACGMBwAAiw-MByKOBwEA3QwAIY8HQADfDAAhAe4HAAAAjAcCAe4HAAAAjgcCGgcAAI4PACAJAACPDwAgGwAAkA8AIB0AAJEPACCFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAhvQYAAIwPjgci1QYQAOUOACHWBgEA3QwAIdcGAgDmDgAh5gYBAN0MACH6BgEA3QwAIfsGAQDeDAAh_AYBAN4MACH9BgEA3gwAIf4GAQDeDAAh_wYBAN4MACGAB4AAAAABgQdAAPUMACGKBwEA3QwAIYwHAACLD4wHIo4HAQDdDAAhjwdAAN8MACEFZgAAjhwAIGcAAJocACDrBwAAjxwAIOwHAACZHAAg8QcAAP4EACAFZgAAjBwAIGcAAJccACDrBwAAjRwAIOwHAACWHAAg8QcAABoAIAVmAACKHAAgZwAAlBwAIOsHAACLHAAg7AcAAJMcACDxBwAAmggAIAVmAACIHAAgZwAAkRwAIOsHAACJHAAg7AcAAJAcACDxBwAAdgAgGgcAAJMPACAJAACUDwAgGwAAlQ8AIB0AAJYPACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEDZgAAjhwAIOsHAACPHAAg8QcAAP4EACADZgAAjBwAIOsHAACNHAAg8QcAABoAIANmAACKHAAg6wcAAIscACDxBwAAmggAIANmAACIHAAg6wcAAIkcACDxBwAAdgAgDhYAAKcPACAXAACoDwAgGAAAqQ8AIIUGAQAAAAGNBkAAAAABjgZAAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAAB3AYBAAAAAQIAAABNACBmAACmDwAgAwAAAE0AIGYAAKYPACBnAACiDwAgAV8AAIccADAUFgAAuAwAIBcAANcKACAYAAD_CwAgGQAArwwAIIIGAAC2DAAwgwYAAEsAEIQGAAC2DAAwhQYBAAAAAY0GQADWCgAhjgZAANYKACGxBgEA0woAIbsGAQDTCgAhvQYAALcM3AYivgYBANMKACG_BkAA_gsAIcAGQADWCgAhwQYBANIKACHCBgEA0woAIdwGAQDSCgAh5gcAALUMACACAAAATQAgXwAAog8AIAIAAACfDwAgXwAAoA8AIA-CBgAAng8AMIMGAACfDwAQhAYAAJ4PADCFBgEA0goAIY0GQADWCgAhjgZAANYKACGxBgEA0woAIbsGAQDTCgAhvQYAALcM3AYivgYBANMKACG_BkAA_gsAIcAGQADWCgAhwQYBANIKACHCBgEA0woAIdwGAQDSCgAhD4IGAACeDwAwgwYAAJ8PABCEBgAAng8AMIUGAQDSCgAhjQZAANYKACGOBkAA1goAIbEGAQDTCgAhuwYBANMKACG9BgAAtwzcBiK-BgEA0woAIb8GQAD-CwAhwAZAANYKACHBBgEA0goAIcIGAQDTCgAh3AYBANIKACELhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuwYBAN4MACG9BgAAoQ_cBiK-BgEA3gwAIb8GQAD1DAAhwAZAAN8MACHBBgEA3QwAIcIGAQDeDAAh3AYBAN0MACEB7gcAAADcBgIOFgAAow8AIBcAAKQPACAYAAClDwAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuwYBAN4MACG9BgAAoQ_cBiK-BgEA3gwAIb8GQAD1DAAhwAZAAN8MACHBBgEA3QwAIcIGAQDeDAAh3AYBAN0MACEFZgAA_BsAIGcAAIUcACDrBwAA_RsAIOwHAACEHAAg8QcAAJsHACAFZgAA-hsAIGcAAIIcACDrBwAA-xsAIOwHAACBHAAg8QcAAPsCACAHZgAA-BsAIGcAAP8bACDrBwAA-RsAIOwHAAD-GwAg7wcAAFEAIPAHAABRACDxBwAA-wIAIA4WAACnDwAgFwAAqA8AIBgAAKkPACCFBgEAAAABjQZAAAAAAY4GQAAAAAG7BgEAAAABvQYAAADcBgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABwgYBAAAAAdwGAQAAAAEDZgAA_BsAIOsHAAD9GwAg8QcAAJsHACADZgAA-hsAIOsHAAD7GwAg8QcAAPsCACADZgAA-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_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAECAAAAVwAgZgAA4w8AIAMAAABXACBmAADjDwAgZwAA4Q8AIAFfAADgGwAwAgAAAFcAIF8AAOEPACACAAAAiQ8AIF8AAOAPACAWhQYBAN0MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbEGAQDdDAAhvQYAAIwPjgci1QYQAOUOACHWBgEA3QwAIdcGAgDmDgAh-gYBAN0MACH7BgEA3gwAIfwGAQDeDAAh_QYBAN4MACH-BgEA3gwAIf8GAQDeDAAhgAeAAAAAAYEHQAD1DAAhigcBAN0MACGMBwAAiw-MByKOBwEA3QwAIY8HQADfDAAhGgcAAI4PACAJAACPDwAgGQAA4g8AIB0AAJEPACCFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN0MACG9BgAAjA-OByLVBhAA5Q4AIdYGAQDdDAAh1wYCAOYOACH6BgEA3QwAIfsGAQDeDAAh_AYBAN4MACH9BgEA3gwAIf4GAQDeDAAh_wYBAN4MACGAB4AAAAABgQdAAPUMACGKBwEA3QwAIYwHAACLD4wHIo4HAQDdDAAhjwdAAN8MACEFZgAA2xsAIGcAAN4bACDrBwAA3BsAIOwHAADdGwAg8QcAAJ0BACAaBwAAkw8AIAkAAJQPACAZAADkDwAgHQAAlg8AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAAQNmAADbGwAg6wcAANwbACDxBwAAnQEAIAwHAAD9DwAgCQAA_g8AIBwAAP8PACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdYGAQAAAAGIByAAAAABkAcQAAAAAZEHEAAAAAECAAAAdgAgZgAA_A8AIAMAAAB2ACBmAAD8DwAgZwAA7w8AIAFfAADaGwAwEgcAAJsLACAJAACqDAAgGwAAqwwAIBwAAIMLACCCBgAAqQwAMIMGAAB0ABCEBgAAqQwAMIUGAQAAAAGKBgEA0goAIYsGAQDSCgAhjQZAANYKACGOBkAA1goAIdYGAQDSCgAh5gYBANIKACGIByAA1QoAIZAHEACKDAAhkQcQAIoMACHlBwAAqAwAIAIAAAB2ACBfAADvDwAgAgAAAO0PACBfAADuDwAgDYIGAADsDwAwgwYAAO0PABCEBgAA7A8AMIUGAQDSCgAhigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACHWBgEA0goAIeYGAQDSCgAhiAcgANUKACGQBxAAigwAIZEHEACKDAAhDYIGAADsDwAwgwYAAO0PABCEBgAA7A8AMIUGAQDSCgAhigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACHWBgEA0goAIeYGAQDSCgAhiAcgANUKACGQBxAAigwAIZEHEACKDAAhCYUGAQDdDAAhigYBAN0MACGLBgEA3QwAIY0GQADfDAAhjgZAAN8MACHWBgEA3QwAIYgHIAC_DgAhkAcQAOUOACGRBxAA5Q4AIQwHAADwDwAgCQAA8Q8AIBwAAPIPACCFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAh1gYBAN0MACGIByAAvw4AIZAHEADlDgAhkQcQAOUOACEFZgAA0RsAIGcAANgbACDrBwAA0hsAIOwHAADXGwAg8QcAAP4EACAFZgAAzxsAIGcAANUbACDrBwAA0BsAIOwHAADUGwAg8QcAABoAIAtmAADzDwAwZwAA9w8AMOsHAAD0DwAw7AcAAPUPADDtBwAA9g8AIO4HAACFDwAw7wcAAIUPADDwBwAAhQ8AMPEHAACFDwAw8gcAAPgPADDzBwAAiA8AMBoHAACTDwAgCQAAlA8AIBkAAOQPACAbAACVDwAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGMBwAAAIwHAo4HAQAAAAGPB0AAAAABAgAAAFcAIGYAAPsPACADAAAAVwAgZgAA-w8AIGcAAPoPACABXwAA0xsAMAIAAABXACBfAAD6DwAgAgAAAIkPACBfAAD5DwAgFoUGAQDdDAAhigYBAN0MACGLBgEA3QwAIY0GQADfDAAhjgZAAN8MACGxBgEA3QwAIb0GAACMD44HItUGEADlDgAh1gYBAN0MACHXBgIA5g4AIeYGAQDdDAAh-gYBAN0MACH7BgEA3gwAIfwGAQDeDAAh_QYBAN4MACH-BgEA3gwAIf8GAQDeDAAhgAeAAAAAAYEHQAD1DAAhjAcAAIsPjAcijgcBAN0MACGPB0AA3wwAIRoHAACODwAgCQAAjw8AIBkAAOIPACAbAACQDwAghQYBAN0MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbEGAQDdDAAhvQYAAIwPjgci1QYQAOUOACHWBgEA3QwAIdcGAgDmDgAh5gYBAN0MACH6BgEA3QwAIfsGAQDeDAAh_AYBAN4MACH9BgEA3gwAIf4GAQDeDAAh_wYBAN4MACGAB4AAAAABgQdAAPUMACGMBwAAiw-MByKOBwEA3QwAIY8HQADfDAAhGgcAAJMPACAJAACUDwAgGQAA5A8AIBsAAJUPACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG9BgAAAI4HAtUGEAAAAAHWBgEAAAAB1wYCAAAAAeYGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGAB4AAAAABgQdAAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEMBwAA_Q8AIAkAAP4PACAcAAD_DwAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHWBgEAAAABiAcgAAAAAZAHEAAAAAGRBxAAAAABA2YAANEbACDrBwAA0hsAIPEHAAD-BAAgA2YAAM8bACDrBwAA0BsAIPEHAAAaACAEZgAA8w8AMOsHAAD0DwAw7QcAAPYPACDxBwAAhQ8AMBUHAACwDgAgCQAArQ4AIAoAAK4OACALAACnDgAgDgAArA4AIA8AAKoOACAQAAC9DwAgGQAAqw4AICwAAKgOACAtAACpDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB9gYBAAAAAb0HQAAAAAECAAAAKAAgZgAAiBAAIAMAAAAoACBmAACIEAAgZwAAhxAAIAFfAADOGwAwAgAAACgAIF8AAIcQACACAAAA8Q0AIF8AAIYQACALhQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrgYBAN0MACGvBgEA3QwAIbEGAQDdDAAh9gYBAN4MACG9B0AA3wwAIRUHAAD9DQAgCQAA-g0AIAoAAPsNACALAAD0DQAgDgAA-Q0AIA8AAPcNACAQAAC7DwAgGQAA-A0AICwAAPUNACAtAAD2DQAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrgYBAN0MACGvBgEA3QwAIbEGAQDdDAAh9gYBAN4MACG9B0AA3wwAIRUHAACwDgAgCQAArQ4AIAoAAK4OACALAACnDgAgDgAArA4AIA8AAKoOACAQAAC9DwAgGQAAqw4AICwAAKgOACAtAACpDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB9gYBAAAAAb0HQAAAAAEPBwAAuhAAIAkAALsQACANAAC3EAAgEQAAuBAAICQAALkQACAmAAC8EAAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAeUGAgAAAAHnBgEAAAABAgAAADcAIGYAALYQACADAAAANwAgZgAAthAAIGcAAJQQACABXwAAzRsAMBQHAACbCwAgCQAAnQwAIA0AAIELACARAADQCwAgGwAAqwwAICQAANILACAmAADDDAAgggYAAMIMADCDBgAANQAQhAYAAMIMADCFBgEAAAABigYBANIKACGLBgEA0woAIY0GQADWCgAhjgZAANYKACHeBgEA0goAIeQGAQDTCgAh5QYCAJQMACHmBgEA0goAIecGAQDTCgAhAgAAADcAIF8AAJQQACACAAAAkRAAIF8AAJIQACANggYAAJAQADCDBgAAkRAAEIQGAACQEAAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAId4GAQDSCgAh5AYBANMKACHlBgIAlAwAIeYGAQDSCgAh5wYBANMKACENggYAAJAQADCDBgAAkRAAEIQGAACQEAAwhQYBANIKACGKBgEA0goAIYsGAQDTCgAhjQZAANYKACGOBkAA1goAId4GAQDSCgAh5AYBANMKACHlBgIAlAwAIeYGAQDSCgAh5wYBANMKACEJhQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAh5AYBAN4MACHlBgIAkxAAIecGAQDeDAAhBe4HAgAAAAH0BwIAAAAB9QcCAAAAAfYHAgAAAAH3BwIAAAABDwcAAJgQACAJAACZEAAgDQAAlRAAIBEAAJYQACAkAACXEAAgJgAAmhAAIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAh5QYCAJMQACHnBgEA3gwAIQtmAACtEAAwZwAAsRAAMOsHAACuEAAw7AcAAK8QADDtBwAAsBAAIO4HAADtDQAw7wcAAO0NADDwBwAA7Q0AMPEHAADtDQAw8gcAALIQADDzBwAA8A0AMAtmAACkEAAwZwAAqBAAMOsHAAClEAAw7AcAAKYQADDtBwAApxAAIO4HAADZDQAw7wcAANkNADDwBwAA2Q0AMPEHAADZDQAw8gcAAKkQADDzBwAA3A0AMAtmAACbEAAwZwAAnxAAMOsHAACcEAAw7AcAAJ0QADDtBwAAnhAAIO4HAACyDQAw7wcAALINADDwBwAAsg0AMPEHAACyDQAw8gcAAKAQADDzBwAAtQ0AMAVmAAC_GwAgZwAAyxsAIOsHAADAGwAg7AcAAMobACDxBwAA_gQAIAdmAAC9GwAgZwAAyBsAIOsHAAC-GwAg7AcAAMcbACDvBwAAGAAg8AcAABgAIPEHAAAaACAHZgAAuxsAIGcAAMUbACDrBwAAvBsAIOwHAADEGwAg7wcAAGsAIPAHAABrACDxBwAAlwEAIA4HAADSDQAgCQAA0w0AIBAAANMOACAjAADUDQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABtgYBAAAAAbcGAQAAAAG5BgAAALkGAroGQAAAAAECAAAAQQAgZgAAoxAAIAMAAABBACBmAACjEAAgZwAAohAAIAFfAADDGwAwAgAAAEEAIF8AAKIQACACAAAAtg0AIF8AAKEQACAKhQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa8GAQDdDAAhtgYBAN0MACG3BgEA3gwAIbkGAAC4DbkGIroGQAD1DAAhDgcAALsNACAJAAC8DQAgEAAA0g4AICMAAL0NACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrwYBAN0MACG2BgEA3QwAIbcGAQDeDAAhuQYAALgNuQYiugZAAPUMACEOBwAA0g0AIAkAANMNACAQAADTDgAgIwAA1A0AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbYGAQAAAAG3BgEAAAABuQYAAAC5BgK6BkAAAAABCwcAAOcNACAJAADoDQAgDwAA5g0AIBAAAMkOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa4GAQAAAAGvBgEAAAABAgAAADwAIGYAAKwQACADAAAAPAAgZgAArBAAIGcAAKsQACABXwAAwhsAMAIAAAA8ACBfAACrEAAgAgAAAN0NACBfAACqEAAgB4UGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGuBgEA3QwAIa8GAQDdDAAhCwcAAOINACAJAADjDQAgDwAA4Q0AIBAAAMgOACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrgYBAN0MACGvBgEA3QwAIQsHAADnDQAgCQAA6A0AIA8AAOYNACAQAADJDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGuBgEAAAABrwYBAAAAARUHAACwDgAgCQAArQ4AIAoAAK4OACALAACnDgAgDwAAqg4AIBAAAL0PACAZAACrDgAgGwAArw4AICwAAKgOACAtAACpDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGuBgEAAAABrwYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAECAAAAKAAgZgAAtRAAIAMAAAAoACBmAAC1EAAgZwAAtBAAIAFfAADBGwAwAgAAACgAIF8AALQQACACAAAA8Q0AIF8AALMQACALhQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa4GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAh9gYBAN4MACG9B0AA3wwAIRUHAAD9DQAgCQAA-g0AIAoAAPsNACALAAD0DQAgDwAA9w0AIBAAALsPACAZAAD4DQAgGwAA_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_gQAIANmAACqGwAg6wcAAKsbACDxBwAAGgAgBGYAAL0QADDrBwAAvhAAMO0HAADAEAAg8QcAAMEQADAEZgAAiRAAMOsHAACKEAAw7QcAAIwQACDxBwAAjRAAMARmAACAEAAw6wcAAIEQADDtBwAAgxAAIPEHAADtDQAwBGYAAOUPADDrBwAA5g8AMO0HAADoDwAg8QcAAOkPADAEZgAA2g8AMOsHAADbDwAw7QcAAN0PACDxBwAAhQ8AMAAAAAAAAAAAAAAFZgAApRsAIGcAAKgbACDrBwAAphsAIOwHAACnGwAg8QcAAJoIACADZgAApRsAIOsHAACmGwAg8QcAAJoIACAAAAAHZgAAoBsAIGcAAKMbACDrBwAAoRsAIOwHAACiGwAg7wcAAC8AIPAHAAAvACDxBwAAmggAIANmAACgGwAg6wcAAKEbACDxBwAAmggAIAAAAAAAAAAAC2YAAIYRADBnAACLEQAw6wcAAIcRADDsBwAAiBEAMO0HAACJEQAg7gcAAIoRADDvBwAAihEAMPAHAACKEQAw8QcAAIoRADDyBwAAjBEAMPMHAACNEQAwC2YAAP0QADBnAACBEQAw6wcAAP4QADDsBwAA_xAAMO0HAACAEQAg7gcAAO0NADDvBwAA7Q0AMPAHAADtDQAw8QcAAO0NADDyBwAAghEAMPMHAADwDQAwBWYAAIobACBnAACeGwAg6wcAAIsbACDsBwAAnRsAIPEHAAD-BAAgBWYAAIgbACBnAACbGwAg6wcAAIkbACDsBwAAmhsAIPEHAAAaACAVBwAAsA4AIAkAAK0OACALAACnDgAgDgAArA4AIA8AAKoOACAQAAC9DwAgGQAAqw4AIBsAAK8OACAsAACoDgAgLQAAqQ4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAG9B0AAAAABAgAAACgAIGYAAIURACADAAAAKAAgZgAAhREAIGcAAIQRACABXwAAmRsAMAIAAAAoACBfAACEEQAgAgAAAPENACBfAACDEQAgC4UGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAhvQdAAN8MACEVBwAA_Q0AIAkAAPoNACALAAD0DQAgDgAA-Q0AIA8AAPcNACAQAAC7DwAgGQAA-A0AIBsAAPwNACAsAAD1DQAgLQAA9g0AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAhvQdAAN8MACEVBwAAsA4AIAkAAK0OACALAACnDgAgDgAArA4AIA8AAKoOACAQAAC9DwAgGQAAqw4AIBsAAK8OACAsAACoDgAgLQAAqQ4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAG9B0AAAAABDQcAAKgRACAJAACpEQAgDQAAqhEAIBEAAKsRACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAABvgcBAAAAAb8HAQAAAAECAAAAIwAgZgAApxEAIAMAAAAjACBmAACnEQAgZwAAkBEAIAFfAACYGwAwEgcAAJsLACAJAACqDAAgCgAAzQwAIA0AAIELACARAADQCwAgggYAAM4MADCDBgAAIQAQhAYAAM4MADCFBgEAAAABigYBANIKACGLBgEA0goAIY0GQADWCgAhjgZAANYKACHkBgEA0woAIfAGAgCUDAAh9gYBANMKACG-BwEAAAABvwcBANIKACECAAAAIwAgXwAAkBEAIAIAAACOEQAgXwAAjxEAIA2CBgAAjREAMIMGAACOEQAQhAYAAI0RADCFBgEA0goAIYoGAQDSCgAhiwYBANIKACGNBkAA1goAIY4GQADWCgAh5AYBANMKACHwBgIAlAwAIfYGAQDTCgAhvgcBANIKACG_BwEA0goAIQ2CBgAAjREAMIMGAACOEQAQhAYAAI0RADCFBgEA0goAIYoGAQDSCgAhiwYBANIKACGNBkAA1goAIY4GQADWCgAh5AYBANMKACHwBgIAlAwAIfYGAQDTCgAhvgcBANIKACG_BwEA0goAIQmFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACHwBgIAkxAAIb4HAQDdDAAhvwcBAN0MACENBwAAkREAIAkAAJIRACANAACTEQAgEQAAlBEAIIUGAQDdDAAhigYBAN0MACGLBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfAGAgCTEAAhvgcBAN0MACG_BwEA3QwAIQVmAACOGwAgZwAAlhsAIOsHAACPGwAg7AcAAJUbACDxBwAA_gQAIAVmAACMGwAgZwAAkxsAIOsHAACNGwAg7AcAAJIbACDxBwAAGgAgC2YAAJ4RADBnAACiEQAw6wcAAJ8RADDsBwAAoBEAMO0HAAChEQAg7gcAAO0NADDvBwAA7Q0AMPAHAADtDQAw8QcAAO0NADDyBwAAoxEAMPMHAADwDQAwC2YAAJURADBnAACZEQAw6wcAAJYRADDsBwAAlxEAMO0HAACYEQAg7gcAANkNADDvBwAA2Q0AMPAHAADZDQAw8QcAANkNADDyBwAAmhEAMPMHAADcDQAwCwcAAOcNACAJAADoDQAgDgAA5Q0AIBAAAMkOACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGvBgEAAAABAgAAADwAIGYAAJ0RACADAAAAPAAgZgAAnREAIGcAAJwRACABXwAAkRsAMAIAAAA8ACBfAACcEQAgAgAAAN0NACBfAACbEQAgB4UGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa8GAQDdDAAhCwcAAOINACAJAADjDQAgDgAA4A0AIBAAAMgOACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACGvBgEA3QwAIQsHAADnDQAgCQAA6A0AIA4AAOUNACAQAADJDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrwYBAAAAARUHAACwDgAgCQAArQ4AIAoAAK4OACALAACnDgAgDgAArA4AIBAAAL0PACAZAACrDgAgGwAArw4AICwAAKgOACAtAACpDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrwYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAECAAAAKAAgZgAAphEAIAMAAAAoACBmAACmEQAgZwAApREAIAFfAACQGwAwAgAAACgAIF8AAKURACACAAAA8Q0AIF8AAKQRACALhQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAh9gYBAN4MACG9B0AA3wwAIRUHAAD9DQAgCQAA-g0AIAoAAPsNACALAAD0DQAgDgAA-Q0AIBAAALsPACAZAAD4DQAgGwAA_A0AICwAAPUNACAtAAD2DQAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAh9gYBAN4MACG9B0AA3wwAIRUHAACwDgAgCQAArQ4AIAoAAK4OACALAACnDgAgDgAArA4AIBAAAL0PACAZAACrDgAgGwAArw4AICwAAKgOACAtAACpDgAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrwYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAENBwAAqBEAIAkAAKkRACANAACqEQAgEQAAqxEAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfAGAgAAAAG-BwEAAAABvwcBAAAAAQNmAACOGwAg6wcAAI8bACDxBwAA_gQAIANmAACMGwAg6wcAAI0bACDxBwAAGgAgBGYAAJ4RADDrBwAAnxEAMO0HAAChEQAg8QcAAO0NADAEZgAAlREAMOsHAACWEQAw7QcAAJgRACDxBwAA2Q0AMARmAACGEQAw6wcAAIcRADDtBwAAiREAIPEHAACKEQAwBGYAAP0QADDrBwAA_hAAMO0HAACAEQAg8QcAAO0NADADZgAAihsAIOsHAACLGwAg8QcAAP4EACADZgAAiBsAIOsHAACJGwAg8QcAABoAIAAAAALuBwEAAAAE-AcBAAAABQtmAAC1EQAwZwAAuREAMOsHAAC2EQAw7AcAALcRADDtBwAAuBEAIO4HAACbDwAw7wcAAJsPADDwBwAAmw8AMPEHAACbDwAw8gcAALoRADDzBwAAng8AMA4XAACoDwAgGAAAqQ8AIBkAAMoPACCFBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABuwYBAAAAAb0GAAAA3AYCvgYBAAAAAb8GQAAAAAHABkAAAAABwgYBAAAAAdwGAQAAAAECAAAATQAgZgAAvREAIAMAAABNACBmAAC9EQAgZwAAvBEAIAFfAACHGwAwAgAAAE0AIF8AALwRACACAAAAnw8AIF8AALsRACALhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN4MACG7BgEA3gwAIb0GAAChD9wGIr4GAQDeDAAhvwZAAPUMACHABkAA3wwAIcIGAQDeDAAh3AYBAN0MACEOFwAApA8AIBgAAKUPACAZAADJDwAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN4MACG7BgEA3gwAIb0GAAChD9wGIr4GAQDeDAAhvwZAAPUMACHABkAA3wwAIcIGAQDeDAAh3AYBAN0MACEOFwAAqA8AIBgAAKkPACAZAADKDwAghQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcIGAQAAAAHcBgEAAAABAe4HAQAAAAQEZgAAtREAMOsHAAC2EQAw7QcAALgRACDxBwAAmw8AMAAAAAAC7gcBAAAABPgHAQAAAAULZgAAxhEAMGcAAMoRADDrBwAAxxEAMOwHAADIEQAw7QcAAMkRACDuBwAAmw0AMO8HAACbDQAw8AcAAJsNADDxBwAAmw0AMPIHAADLEQAw8wcAAJ4NADASBwAArA0AIAkAAK0NACAQAADYDgAgGAAAqw0AIDMAAKoNACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwgYBAAAAAQIAAACjAQAgZgAAzhEAIAMAAACjAQAgZgAAzhEAIGcAAM0RACABXwAAhhsAMAIAAACjAQAgXwAAzREAIAIAAACfDQAgXwAAzBEAIA2FBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhmgYBAN0MACGvBgEA3gwAIbsGAQDeDAAhvQYAAKENvQYivgYBAN4MACG_BkAA9QwAIcAGQADfDAAhwgYBAN4MACESBwAApg0AIAkAAKcNACAQAADXDgAgGAAApQ0AIDMAAKQNACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhmgYBAN0MACGvBgEA3gwAIbsGAQDeDAAhvQYAAKENvQYivgYBAN4MACG_BkAA9QwAIcAGQADfDAAhwgYBAN4MACESBwAArA0AIAkAAK0NACAQAADYDgAgGAAAqw0AIDMAAKoNACCFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwgYBAAAAAQHuBwEAAAAEBGYAAMYRADDrBwAAxxEAMO0HAADJEQAg8QcAAJsNADAAAAAAAAAB7gcAAAD6BgIFZgAAgRsAIGcAAIQbACDrBwAAghsAIOwHAACDGwAg8QcAAP4EACADZgAAgRsAIOsHAACCGwAg8QcAAP4EACAAAAAFZgAA_BoAIGcAAP8aACDrBwAA_RoAIOwHAAD-GgAg8QcAAP4EACADZgAA_BoAIOsHAAD9GgAg8QcAAP4EACAfBgAA_hYAIAwAAOAQACANAADiEAAgEQAAgRcAIBwAAOQQACAlAADhEAAgJwAA4xAAICoAAIkXACAuAAD6FgAgLwAA-xYAIDAAAP0WACAxAAD_FgAgMgAAgBcAIDQAANERACA1AACDFwAgNgAAhBcAIDcAAIUXACA6AAD5FgAgOwAA_BYAID8AAIgXACBAAACCFwAgQQAAhhcAIEIAAIcXACBHAACKFwAgSAAAixcAIEkAAIwXACBKAACMFwAguQYAANkMACDkBgAA2QwAIKkHAADZDAAgrAcAANkMACAAAAAAAAAAAAAABWYAAPcaACBnAAD6GgAg6wcAAPgaACDsBwAA-RoAIPEHAACaCAAgA2YAAPcaACDrBwAA-BoAIPEHAACaCAAgAAAABWYAAO8aACBnAAD1GgAg6wcAAPAaACDsBwAA9BoAIPEHAADwAQAgBWYAAO0aACBnAADyGgAg6wcAAO4aACDsBwAA8RoAIPEHAAD7AgAgA2YAAO8aACDrBwAA8BoAIPEHAADwAQAgA2YAAO0aACDrBwAA7hoAIPEHAAD7AgAgAAAAAe4HAAAAlQcCBWYAAOgaACBnAADrGgAg6wcAAOkaACDsBwAA6hoAIPEHAADwAQAgA2YAAOgaACDrBwAA6RoAIPEHAADwAQAgAAAABWYAAN4aACBnAADmGgAg6wcAAN8aACDsBwAA5RoAIPEHAAD-BAAgBWYAANwaACBnAADjGgAg6wcAAN0aACDsBwAA4hoAIPEHAAD7AgAgC2YAAIwSADBnAACREgAw6wcAAI0SADDsBwAAjhIAMO0HAACPEgAg7gcAAJASADDvBwAAkBIAMPAHAACQEgAw8QcAAJASADDyBwAAkhIAMPMHAACTEgAwC2YAAIASADBnAACFEgAw6wcAAIESADDsBwAAghIAMO0HAACDEgAg7gcAAIQSADDvBwAAhBIAMPAHAACEEgAw8QcAAIQSADDyBwAAhhIAMPMHAACHEgAwBAMAAPIRACCFBgEAAAABjAYBAAAAAZMHQAAAAAECAAAA-AEAIGYAAIsSACADAAAA-AEAIGYAAIsSACBnAACKEgAgAV8AAOEaADAKAwAA1woAIEQAAIIMACCCBgAAgQwAMIMGAAD2AQAQhAYAAIEMADCFBgEAAAABjAYBANIKACGSBwEA0goAIZMHQADWCgAh4QcAAIAMACACAAAA-AEAIF8AAIoSACACAAAAiBIAIF8AAIkSACAHggYAAIcSADCDBgAAiBIAEIQGAACHEgAwhQYBANIKACGMBgEA0goAIZIHAQDSCgAhkwdAANYKACEHggYAAIcSADCDBgAAiBIAEIQGAACHEgAwhQYBANIKACGMBgEA0goAIZIHAQDSCgAhkwdAANYKACEDhQYBAN0MACGMBgEA3QwAIZMHQADfDAAhBAMAAPARACCFBgEA3QwAIYwGAQDdDAAhkwdAAN8MACEEAwAA8hEAIIUGAQAAAAGMBgEAAAABkwdAAAAAAQOFBgEAAAABjQZAAAAAAZUHAAAAlQcCAgAAAPQBACBmAACXEgAgAwAAAPQBACBmAACXEgAgZwAAlhIAIAFfAADgGgAwCUQAAIIMACCCBgAAhAwAMIMGAADyAQAQhAYAAIQMADCFBgEAAAABjQZAANYKACGSBwEA0goAIZUHAACFDJUHIuIHAACDDAAgAgAAAPQBACBfAACWEgAgAgAAAJQSACBfAACVEgAgB4IGAACTEgAwgwYAAJQSABCEBgAAkxIAMIUGAQDSCgAhjQZAANYKACGSBwEA0goAIZUHAACFDJUHIgeCBgAAkxIAMIMGAACUEgAQhAYAAJMSADCFBgEA0goAIY0GQADWCgAhkgcBANIKACGVBwAAhQyVByIDhQYBAN0MACGNBkAA3wwAIZUHAAD2EZUHIgOFBgEA3QwAIY0GQADfDAAhlQcAAPYRlQciA4UGAQAAAAGNBkAAAAABlQcAAACVBwIDZgAA3hoAIOsHAADfGgAg8QcAAP4EACADZgAA3BoAIOsHAADdGgAg8QcAAPsCACAEZgAAjBIAMOsHAACNEgAw7QcAAI8SACDxBwAAkBIAMARmAACAEgAw6wcAAIESADDtBwAAgxIAIPEHAACEEgAwAAAAAAAAAe4HAAAAowcCAe4HAAAApQcCBWYAANEaACBnAADaGgAg6wcAANIaACDsBwAA2RoAIPEHAAD7AgAgBWYAAM8aACBnAADXGgAg6wcAANAaACDsBwAA1hoAIPEHAAD-BAAgB2YAAM0aACBnAADUGgAg6wcAAM4aACDsBwAA0xoAIO8HAABRACDwBwAAUQAg8QcAAPsCACADZgAA0RoAIOsHAADSGgAg8QcAAPsCACADZgAAzxoAIOsHAADQGgAg8QcAAP4EACADZgAAzRoAIOsHAADOGgAg8QcAAPsCACAAAAAAAAHuBwAAAKsHAwHuBwAAANMGAwXuBxAAAAAB9AcQAAAAAfUHEAAAAAH2BxAAAAAB9wcQAAAAAQHuBwAAALsHAgVmAADBGgAgZwAAyxoAIOsHAADCGgAg7AcAAMoaACDxBwAA-wIAIAdmAAC_GgAgZwAAyBoAIOsHAADAGgAg7AcAAMcaACDvBwAAUQAg8AcAAFEAIPEHAAD7AgAgB2YAAL0aACBnAADFGgAg6wcAAL4aACDsBwAAxBoAIO8HAAAWACDwBwAAFgAg8QcAAP4EACALZgAAtxIAMGcAALwSADDrBwAAuBIAMOwHAAC5EgAw7QcAALoSACDuBwAAuxIAMO8HAAC7EgAw8AcAALsSADDxBwAAuxIAMPIHAAC9EgAw8wcAAL4SADAMBwAA6Q4AIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAANUGAtMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB2AZAAAAAAdkGQAAAAAECAAAA2wEAIGYAAMISACADAAAA2wEAIGYAAMISACBnAADBEgAgAV8AAMMaADARBwAAmwsAID4AAJAMACCCBgAAjgwAMIMGAADZAQAQhAYAAI4MADCFBgEAAAABigYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAI8M1QYi0QYBANMKACHTBgAAiQzTBiLVBhAAigwAIdYGAQDSCgAh1wYCAIsMACHYBkAA1goAIdkGQADWCgAhAgAAANsBACBfAADBEgAgAgAAAL8SACBfAADAEgAgD4IGAAC-EgAwgwYAAL8SABCEBgAAvhIAMIUGAQDSCgAhigYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAI8M1QYi0QYBANMKACHTBgAAiQzTBiLVBhAAigwAIdYGAQDSCgAh1wYCAIsMACHYBkAA1goAIdkGQADWCgAhD4IGAAC-EgAwgwYAAL8SABCEBgAAvhIAMIUGAQDSCgAhigYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAI8M1QYi0QYBANMKACHTBgAAiQzTBiLVBhAAigwAIdYGAQDSCgAh1wYCAIsMACHYBkAA1goAIdkGQADWCgAhC4UGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhvQYAAOQO1QYi0wYAAOMO0wYi1QYQAOUOACHWBgEA3QwAIdcGAgDmDgAh2AZAAN8MACHZBkAA3wwAIQwHAADnDgAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAA5A7VBiLTBgAA4w7TBiLVBhAA5Q4AIdYGAQDdDAAh1wYCAOYOACHYBkAA3wwAIdkGQADfDAAhDAcAAOkOACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADVBgLTBgAAANMGAtUGEAAAAAHWBgEAAAAB1wYCAAAAAdgGQAAAAAHZBkAAAAABA2YAAMEaACDrBwAAwhoAIPEHAAD7AgAgA2YAAL8aACDrBwAAwBoAIPEHAAD7AgAgA2YAAL0aACDrBwAAvhoAIPEHAAD-BAAgBGYAALcSADDrBwAAuBIAMO0HAAC6EgAg8QcAALsSADAAAAALZgAAhxUAMGcAAIwVADDrBwAAiBUAMOwHAACJFQAw7QcAAIoVACDuBwAAixUAMO8HAACLFQAw8AcAAIsVADDxBwAAixUAMPIHAACNFQAw8wcAAI4VADALZgAA-xQAMGcAAIAVADDrBwAA_BQAMOwHAAD9FAAw7QcAAP4UACDuBwAA_xQAMO8HAAD_FAAw8AcAAP8UADDxBwAA_xQAMPIHAACBFQAw8wcAAIIVADALZgAA4hQAMGcAAOcUADDrBwAA4xQAMOwHAADkFAAw7QcAAOUUACDuBwAA5hQAMO8HAADmFAAw8AcAAOYUADDxBwAA5hQAMPIHAADoFAAw8wcAAOkUADALZgAAyhQAMGcAAM8UADDrBwAAyxQAMOwHAADMFAAw7QcAAM0UACDuBwAAzhQAMO8HAADOFAAw8AcAAM4UADDxBwAAzhQAMPIHAADQFAAw8wcAANEUADALZgAAwRQAMGcAAMUUADDrBwAAwhQAMOwHAADDFAAw7QcAAMQUACDuBwAAjRAAMO8HAACNEAAw8AcAAI0QADDxBwAAjRAAMPIHAADGFAAw8wcAAJAQADALZgAAthQAMGcAALoUADDrBwAAtxQAMOwHAAC4FAAw7QcAALkUACDuBwAAihEAMO8HAACKEQAw8AcAAIoRADDxBwAAihEAMPIHAAC7FAAw8wcAAI0RADALZgAApxQAMGcAAKwUADDrBwAAqBQAMOwHAACpFAAw7QcAAKoUACDuBwAAqxQAMO8HAACrFAAw8AcAAKsUADDxBwAAqxQAMPIHAACtFAAw8wcAAK4UADALZgAAmxQAMGcAAKAUADDrBwAAnBQAMOwHAACdFAAw7QcAAJ4UACDuBwAAnxQAMO8HAACfFAAw8AcAAJ8UADDxBwAAnxQAMPIHAAChFAAw8wcAAKIUADALZgAAjxQAMGcAAJQUADDrBwAAkBQAMOwHAACRFAAw7QcAAJIUACDuBwAAkxQAMO8HAACTFAAw8AcAAJMUADDxBwAAkxQAMPIHAACVFAAw8wcAAJYUADALZgAAhhQAMGcAAIoUADDrBwAAhxQAMOwHAACIFAAw7QcAAIkUACDuBwAA7Q0AMO8HAADtDQAw8AcAAO0NADDxBwAA7Q0AMPIHAACLFAAw8wcAAPANADALZgAA_RMAMGcAAIEUADDrBwAA_hMAMOwHAAD_EwAw7QcAAIAUACDuBwAA2Q0AMO8HAADZDQAw8AcAANkNADDxBwAA2Q0AMPIHAACCFAAw8wcAANwNADALZgAA8RMAMGcAAPYTADDrBwAA8hMAMOwHAADzEwAw7QcAAPQTACDuBwAA9RMAMO8HAAD1EwAw8AcAAPUTADDxBwAA9RMAMPIHAAD3EwAw8wcAAPgTADALZgAA6BMAMGcAAOwTADDrBwAA6RMAMOwHAADqEwAw7QcAAOsTACDuBwAAmw0AMO8HAACbDQAw8AcAAJsNADDxBwAAmw0AMPIHAADtEwAw8wcAAJ4NADALZgAA3xMAMGcAAOMTADDrBwAA4BMAMOwHAADhEwAw7QcAAOITACDuBwAAsg0AMO8HAACyDQAw8AcAALINADDxBwAAsg0AMPIHAADkEwAw8wcAALUNADALZgAA1hMAMGcAANoTADDrBwAA1xMAMOwHAADYEwAw7QcAANkTACDuBwAAwg0AMO8HAADCDQAw8AcAAMINADDxBwAAwg0AMPIHAADbEwAw8wcAAMUNADALZgAAzRMAMGcAANETADDrBwAAzhMAMOwHAADPEwAw7QcAANATACDuBwAAiA0AMO8HAACIDQAw8AcAAIgNADDxBwAAiA0AMPIHAADSEwAw8wcAAIsNADALZgAAxBMAMGcAAMgTADDrBwAAxRMAMOwHAADGEwAw7QcAAMcTACDuBwAA6Q8AMO8HAADpDwAw8AcAAOkPADDxBwAA6Q8AMPIHAADJEwAw8wcAAOwPADALZgAAuxMAMGcAAL8TADDrBwAAvBMAMOwHAAC9EwAw7QcAAL4TACDuBwAAhQ8AMO8HAACFDwAw8AcAAIUPADDxBwAAhQ8AMPIHAADAEwAw8wcAAIgPADAHZgAAthMAIGcAALkTACDrBwAAtxMAIOwHAAC4EwAg7wcAAOUBACDwBwAA5QEAIPEHAADUBgAgC2YAAKoTADBnAACvEwAw6wcAAKsTADDsBwAArBMAMO0HAACtEwAg7gcAAK4TADDvBwAArhMAMPAHAACuEwAw8QcAAK4TADDyBwAAsBMAMPMHAACxEwAwC2YAAKETADBnAAClEwAw6wcAAKITADDsBwAAoxMAMO0HAACkEwAg7gcAALsSADDvBwAAuxIAMPAHAAC7EgAw8QcAALsSADDyBwAAphMAMPMHAAC-EgAwC2YAAJgTADBnAACcEwAw6wcAAJkTADDsBwAAmhMAMO0HAACbEwAg7gcAAMEQADDvBwAAwRAAMPAHAADBEAAw8QcAAMEQADDyBwAAnRMAMPMHAADEEAAwC2YAAI8TADBnAACTEwAw6wcAAJATADDsBwAAkRMAMO0HAACSEwAg7gcAAJYOADDvBwAAlg4AMPAHAACWDgAw8QcAAJYOADDyBwAAlBMAMPMHAACZDgAwC2YAAIMTADBnAACIEwAw6wcAAIQTADDsBwAAhRMAMO0HAACGEwAg7gcAAIcTADDvBwAAhxMAMPAHAACHEwAw8QcAAIcTADDyBwAAiRMAMPMHAACKEwAwC2YAAPcSADBnAAD8EgAw6wcAAPgSADDsBwAA-RIAMO0HAAD6EgAg7gcAAPsSADDvBwAA-xIAMPAHAAD7EgAw8QcAAPsSADDyBwAA_RIAMPMHAAD-EgAwC2YAAO4SADBnAADyEgAw6wcAAO8SADDsBwAA8BIAMO0HAADxEgAg7gcAAO0MADDvBwAA7QwAMPAHAADtDAAw8QcAAO0MADDyBwAA8xIAMPMHAADwDAAwC2YAAOUSADBnAADpEgAw6wcAAOYSADDsBwAA5xIAMO0HAADoEgAg7gcAAO0MADDvBwAA7QwAMPAHAADtDAAw8QcAAO0MADDyBwAA6hIAMPMHAADwDAAwFRAAAIAPACAYAACBDQAgGQAAgg0AIB4AAP4MACAgAACADQAgIQAAgw0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAgAAAF0AIGYAAO0SACADAAAAXQAgZgAA7RIAIGcAAOwSACABXwAAvBoAMAIAAABdACBfAADsEgAgAgAAAPEMACBfAADrEgAgD4UGAQDdDAAhjQZAAN8MACGOBkAA3wwAIa8GAQDeDAAhsQYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcimwcBAN0MACGdBwEA3QwAIZ4HAQDeDAAhnwcBAN4MACGgBwEA3gwAIaEHQADfDAAhFRAAAP4OACAYAAD6DAAgGQAA-wwAIB4AAPcMACAgAAD5DAAgIQAA_AwAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIa8GAQDeDAAhsQYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcimwcBAN0MACGdBwEA3QwAIZ4HAQDeDAAhnwcBAN4MACGgBwEA3gwAIaEHQADfDAAhFRAAAIAPACAYAACBDQAgGQAAgg0AIB4AAP4MACAgAACADQAgIQAAgw0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABFRAAAIAPACAYAACBDQAgGQAAgg0AIB8AAP8MACAgAACADQAgIQAAgw0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAgAAAF0AIGYAAPYSACADAAAAXQAgZgAA9hIAIGcAAPUSACABXwAAuxoAMAIAAABdACBfAAD1EgAgAgAAAPEMACBfAAD0EgAgD4UGAQDdDAAhjQZAAN8MACGOBkAA3wwAIa8GAQDeDAAhsQYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcinAcBAN0MACGdBwEA3QwAIZ4HAQDeDAAhnwcBAN4MACGgBwEA3gwAIaEHQADfDAAhFRAAAP4OACAYAAD6DAAgGQAA-wwAIB8AAPgMACAgAAD5DAAgIQAA_AwAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIa8GAQDeDAAhsQYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcinAcBAN0MACGdBwEA3QwAIZ4HAQDeDAAhnwcBAN4MACGgBwEA3gwAIaEHQADfDAAhFRAAAIAPACAYAACBDQAgGQAAgg0AIB8AAP8MACAgAACADQAgIQAAgw0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABCyAAAKcSACA9AACpEgAghQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABnQcBAAAAAaMHAAAAowcCpQcBAAAAAaYHAQAAAAECAAAA_gEAIGYAAIITACADAAAA_gEAIGYAAIITACBnAACBEwAgAV8AALoaADAQBwAAmwsAICAAANcKACA9AAD_CwAgggYAAPsLADCDBgAA_AEAEIQGAAD7CwAwhQYBAAAAAYoGAQDSCgAhjQZAANYKACGOBkAA1goAIb0GAAD9C6UHIr8GQAD-CwAhnQcBANIKACGjBwAA_AujByKlBwEA0woAIaYHAQDTCgAhAgAAAP4BACBfAACBEwAgAgAAAP8SACBfAACAEwAgDYIGAAD-EgAwgwYAAP8SABCEBgAA_hIAMIUGAQDSCgAhigYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAP0LpQcivwZAAP4LACGdBwEA0goAIaMHAAD8C6MHIqUHAQDTCgAhpgcBANMKACENggYAAP4SADCDBgAA_xIAEIQGAAD-EgAwhQYBANIKACGKBgEA0goAIY0GQADWCgAhjgZAANYKACG9BgAA_QulByK_BkAA_gsAIZ0HAQDSCgAhowcAAPwLowcipQcBANMKACGmBwEA0woAIQmFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAAoxKlByK_BkAA9QwAIZ0HAQDdDAAhowcAAKISowcipQcBAN4MACGmBwEA3gwAIQsgAACkEgAgPQAAphIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIb0GAACjEqUHIr8GQAD1DAAhnQcBAN0MACGjBwAAohKjByKlBwEA3gwAIaYHAQDeDAAhCyAAAKcSACA9AACpEgAghQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABnQcBAAAAAaMHAAAAowcCpQcBAAAAAaYHAQAAAAEKQwAAmRIAIEUAAJoSACBGAACbEgAghQYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAbcGAQAAAAGWBwEAAAABlwcAAACVBwICAAAA8AEAIGYAAI4TACADAAAA8AEAIGYAAI4TACBnAACNEwAgAV8AALkaADAPBwAAmwsAIEMAANcKACBFAACHDAAgRgAA8QsAIIIGAACGDAAwgwYAAO4BABCEBgAAhgwAMIUGAQAAAAGKBgEA0goAIY0GQADWCgAhjgZAANYKACG2BgEA0goAIbcGAQDSCgAhlgcBANIKACGXBwAAhQyVByICAAAA8AEAIF8AAI0TACACAAAAixMAIF8AAIwTACALggYAAIoTADCDBgAAixMAEIQGAACKEwAwhQYBANIKACGKBgEA0goAIY0GQADWCgAhjgZAANYKACG2BgEA0goAIbcGAQDSCgAhlgcBANIKACGXBwAAhQyVByILggYAAIoTADCDBgAAixMAEIQGAACKEwAwhQYBANIKACGKBgEA0goAIY0GQADWCgAhjgZAANYKACG2BgEA0goAIbcGAQDSCgAhlgcBANIKACGXBwAAhQyVByIHhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACG3BgEA3QwAIZYHAQDdDAAhlwcAAPYRlQciCkMAAP0RACBFAAD-EQAgRgAA_xEAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbYGAQDdDAAhtwYBAN0MACGWBwEA3QwAIZcHAAD2EZUHIgpDAACZEgAgRQAAmhIAIEYAAJsSACCFBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZYHAQAAAAGXBwAAAJUHAg4JAAClDgAgKAAAog4AICkAANYQACArAACjDgAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAcMGAQAAAAHeBgEAAAAB5AYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQIAAAAsACBmAACXEwAgAwAAACwAIGYAAJcTACBnAACWEwAgAV8AALgaADACAAAALAAgXwAAlhMAIAIAAACaDgAgXwAAlRMAIAqFBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIcMGAQDdDAAh3gYBAN0MACHkBgEA3gwAIesGAQDeDAAh7AYBAN0MACHtBgEA3QwAIQ4JAACgDgAgKAAAnQ4AICkAANQQACArAACeDgAghQYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHDBgEA3QwAId4GAQDdDAAh5AYBAN4MACHrBgEA3gwAIewGAQDdDAAh7QYBAN0MACEOCQAApQ4AICgAAKIOACApAADWEAAgKwAAow4AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHDBgEAAAAB3gYBAAAAAeQGAQAAAAHrBgEAAAAB7AYBAAAAAe0GAQAAAAENCQAA2hAAIAsAANgQACAbAADwEAAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA6wYC3gYBAAAAAeQGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAECAAAAMwAgZgAAoBMAIAMAAAAzACBmAACgEwAgZwAAnxMAIAFfAAC3GgAwAgAAADMAIF8AAJ8TACACAAAAxRAAIF8AAJ4TACAKhQYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACG9BgAAxxDrBiLeBgEA3QwAIeQGAQDeDAAh5gYBAN4MACHoBgEA3QwAIekGAQDdDAAhDQkAAMsQACALAADJEAAgGwAA7xAAIIUGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhvQYAAMcQ6wYi3gYBAN0MACHkBgEA3gwAIeYGAQDeDAAh6AYBAN0MACHpBgEA3QwAIQ0JAADaEAAgCwAA2BAAIBsAAPAQACCFBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADrBgLeBgEAAAAB5AYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAQw-AADqDgAghQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADVBgLRBgEAAAAB0wYAAADTBgLVBhAAAAAB1gYBAAAAAdcGAgAAAAHYBkAAAAAB2QZAAAAAAQIAAADbAQAgZgAAqRMAIAMAAADbAQAgZgAAqRMAIGcAAKgTACABXwAAthoAMAIAAADbAQAgXwAAqBMAIAIAAAC_EgAgXwAApxMAIAuFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAA5A7VBiLRBgEA3gwAIdMGAADjDtMGItUGEADlDgAh1gYBAN0MACHXBgIA5g4AIdgGQADfDAAh2QZAAN8MACEMPgAA6A4AIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIb0GAADkDtUGItEGAQDeDAAh0wYAAOMO0wYi1QYQAOUOACHWBgEA3QwAIdcGAgDmDgAh2AZAAN8MACHZBkAA3wwAIQw-AADqDgAghQYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADVBgLRBgEAAAAB0wYAAADTBgLVBhAAAAAB1gYBAAAAAdcGAgAAAAHYBkAAAAAB2QZAAAAAARGFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAPoGAtMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-AYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABAgAAAOkBACBmAAC1EwAgAwAAAOkBACBmAAC1EwAgZwAAtBMAIAFfAAC1GgAwFgcAAJsLACCCBgAAiAwAMIMGAADnAQAQhAYAAIgMADCFBgEAAAABigYBANIKACGNBkAA1goAIY4GQADWCgAhvQYAAIwM-gYi0wYAAIkM0wYi1QYQAIoMACHWBgEA0goAIdcGAgCLDAAh-AYBANIKACH6BgEAAAAB-wYBANMKACH8BgEAAAAB_QYBANMKACH-BgEA0woAIf8GAQDTCgAhgAcAAI0MACCBB0AA_gsAIQIAAADpAQAgXwAAtBMAIAIAAACyEwAgXwAAsxMAIBWCBgAAsRMAMIMGAACyEwAQhAYAALETADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAIb0GAACMDPoGItMGAACJDNMGItUGEACKDAAh1gYBANIKACHXBgIAiwwAIfgGAQDSCgAh-gYBANIKACH7BgEA0woAIfwGAQDTCgAh_QYBANMKACH-BgEA0woAIf8GAQDTCgAhgAcAAI0MACCBB0AA_gsAIRWCBgAAsRMAMIMGAACyEwAQhAYAALETADCFBgEA0goAIYoGAQDSCgAhjQZAANYKACGOBkAA1goAIb0GAACMDPoGItMGAACJDNMGItUGEACKDAAh1gYBANIKACHXBgIAiwwAIfgGAQDSCgAh-gYBANIKACH7BgEA0woAIfwGAQDTCgAh_QYBANMKACH-BgEA0woAIf8GAQDTCgAhgAcAAI0MACCBB0AA_gsAIRGFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAA1xH6BiLTBgAA4w7TBiLVBhAA5Q4AIdYGAQDdDAAh1wYCAOYOACH4BgEA3QwAIfoGAQDdDAAh-wYBAN4MACH8BgEA3gwAIf0GAQDeDAAh_gYBAN4MACH_BgEA3gwAIYAHgAAAAAGBB0AA9QwAIRGFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAA1xH6BiLTBgAA4w7TBiLVBhAA5Q4AIdYGAQDdDAAh1wYCAOYOACH4BgEA3QwAIfoGAQDdDAAh-wYBAN4MACH8BgEA3gwAIf0GAQDeDAAh_gYBAN4MACH_BgEA3gwAIYAHgAAAAAGBB0AA9QwAIRGFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAPoGAtMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-AYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABC4UGAQAAAAGNBkAAAAABjgZAAAAAAYIHAQAAAAGDBwEAAAABhAcBAAAAAYUHAQAAAAGGBwEAAAABhwcBAAAAAYgHIAAAAAGJBwEAAAABAgAAANQGACBmAAC2EwAgAwAAAOUBACBmAAC2EwAgZwAAuhMAIA0AAADlAQAgXwAAuhMAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIYIHAQDdDAAhgwcBAN0MACGEBwEA3QwAIYUHAQDdDAAhhgcBAN0MACGHBwEA3QwAIYgHIAC_DgAhiQcBAN4MACELhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhggcBAN0MACGDBwEA3QwAIYQHAQDdDAAhhQcBAN0MACGGBwEA3QwAIYcHAQDdDAAhiAcgAL8OACGJBwEA3gwAIRoJAACUDwAgGQAA5A8AIBsAAJUPACAdAACWDwAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG9BgAAAI4HAtUGEAAAAAHWBgEAAAAB1wYCAAAAAeYGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGAB4AAAAABgQdAAAAAAYoHAQAAAAGMBwAAAIwHAo4HAQAAAAGPB0AAAAABAgAAAFcAIGYAAMMTACADAAAAVwAgZgAAwxMAIGcAAMITACABXwAAtBoAMAIAAABXACBfAADCEwAgAgAAAIkPACBfAADBEwAgFoUGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN0MACG9BgAAjA-OByLVBhAA5Q4AIdYGAQDdDAAh1wYCAOYOACHmBgEA3QwAIfoGAQDdDAAh-wYBAN4MACH8BgEA3gwAIf0GAQDeDAAh_gYBAN4MACH_BgEA3gwAIYAHgAAAAAGBB0AA9QwAIYoHAQDdDAAhjAcAAIsPjAcijgcBAN0MACGPB0AA3wwAIRoJAACPDwAgGQAA4g8AIBsAAJAPACAdAACRDwAghQYBAN0MACGLBgEA3QwAIY0GQADfDAAhjgZAAN8MACGxBgEA3QwAIb0GAACMD44HItUGEADlDgAh1gYBAN0MACHXBgIA5g4AIeYGAQDdDAAh-gYBAN0MACH7BgEA3gwAIfwGAQDeDAAh_QYBAN4MACH-BgEA3gwAIf8GAQDeDAAhgAeAAAAAAYEHQAD1DAAhigcBAN0MACGMBwAAiw-MByKOBwEA3QwAIY8HQADfDAAhGgkAAJQPACAZAADkDwAgGwAAlQ8AIB0AAJYPACCFBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEMCQAA_g8AIBsAAOsRACAcAAD_DwAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdYGAQAAAAHmBgEAAAABiAcgAAAAAZAHEAAAAAGRBxAAAAABAgAAAHYAIGYAAMwTACADAAAAdgAgZgAAzBMAIGcAAMsTACABXwAAsxoAMAIAAAB2ACBfAADLEwAgAgAAAO0PACBfAADKEwAgCYUGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAh1gYBAN0MACHmBgEA3QwAIYgHIAC_DgAhkAcQAOUOACGRBxAA5Q4AIQwJAADxDwAgGwAA6hEAIBwAAPIPACCFBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIdYGAQDdDAAh5gYBAN0MACGIByAAvw4AIZAHEADlDgAhkQcQAOUOACEMCQAA_g8AIBsAAOsRACAcAAD_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_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABAgAAAKMBACBmAADwEwAgAwAAAKMBACBmAADwEwAgZwAA7xMAIAFfAACvGgAwAgAAAKMBACBfAADvEwAgAgAAAJ8NACBfAADuEwAgDYUGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhmgYBAN0MACGvBgEA3gwAIbsGAQDeDAAhvQYAAKENvQYivgYBAN4MACG_BkAA9QwAIcAGQADfDAAhwQYBAN0MACHCBgEA3gwAIRIJAACnDQAgEAAA1w4AIBYAAKMNACAYAAClDQAgMwAApA0AIIUGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhmgYBAN0MACGvBgEA3gwAIbsGAQDeDAAhvQYAAKENvQYivgYBAN4MACG_BkAA9QwAIcAGQADfDAAhwQYBAN0MACHCBgEA3gwAIRIJAACtDQAgEAAA2A4AIBYAAKkNACAYAACrDQAgMwAAqg0AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGaBgEAAAABrwYBAAAAAbsGAQAAAAG9BgAAAL0GAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHCBgEAAAABHTwAAMMSACA9AADEEgAgPwAAxhIAIIUGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABpwcBAAAAAagHAQAAAAGpBwEAAAABqwcAAACrBwOsBwEAAAABrQcAAADTBgOuBxAAAAABrwcBAAAAAbAHAgAAAAGxBwAAAPoGArIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHgAAAAAG5B0AAAAABuwcBAAAAAQIAAADVAQAgZgAA_BMAIAMAAADVAQAgZgAA_BMAIGcAAPsTACABXwAArhoAMCIHAACWDAAgPAAA1woAID0AAP8LACA_AADXCwAgggYAAJEMADCDBgAA0wEAEIQGAACRDAAwhQYBAAAAAYoGAQDTCgAhjQZAANYKACGOBkAA1goAIb0GAACVDLsHIr8GQAD-CwAh5AYBANMKACGmBwEA0woAIacHAQDSCgAhqAcBANIKACGpBwEA0woAIasHAADHC6sHI6wHAQDTCgAhrQcAAJIM0wYjrgcQAJMMACGvBwEA0goAIbAHAgCUDAAhsQcAAIwM-gYisgcBAAAAAbMHAQDTCgAhtAcBAAAAAbUHAQDTCgAhtgcBANMKACG3BwEA0woAIbgHAACNDAAguQdAAP4LACG7BwEA0woAIQIAAADVAQAgXwAA-xMAIAIAAAD5EwAgXwAA-hMAIB6CBgAA-BMAMIMGAAD5EwAQhAYAAPgTADCFBgEA0goAIYoGAQDTCgAhjQZAANYKACGOBkAA1goAIb0GAACVDLsHIr8GQAD-CwAh5AYBANMKACGmBwEA0woAIacHAQDSCgAhqAcBANIKACGpBwEA0woAIasHAADHC6sHI6wHAQDTCgAhrQcAAJIM0wYjrgcQAJMMACGvBwEA0goAIbAHAgCUDAAhsQcAAIwM-gYisgcBANMKACGzBwEA0woAIbQHAQDTCgAhtQcBANMKACG2BwEA0woAIbcHAQDTCgAhuAcAAI0MACC5B0AA_gsAIbsHAQDTCgAhHoIGAAD4EwAwgwYAAPkTABCEBgAA-BMAMIUGAQDSCgAhigYBANMKACGNBkAA1goAIY4GQADWCgAhvQYAAJUMuwcivwZAAP4LACHkBgEA0woAIaYHAQDTCgAhpwcBANIKACGoBwEA0goAIakHAQDTCgAhqwcAAMcLqwcjrAcBANMKACGtBwAAkgzTBiOuBxAAkwwAIa8HAQDSCgAhsAcCAJQMACGxBwAAjAz6BiKyBwEA0woAIbMHAQDTCgAhtAcBANMKACG1BwEA0woAIbYHAQDTCgAhtwcBANMKACG4BwAAjQwAILkHQAD-CwAhuwcBANMKACEahQYBAN0MACGNBkAA3wwAIY4GQADfDAAhvQYAALISuwcivwZAAPUMACHkBgEA3gwAIaYHAQDeDAAhpwcBAN0MACGoBwEA3QwAIakHAQDeDAAhqwcAAK8SqwcjrAcBAN4MACGtBwAAsBLTBiOuBxAAsRIAIa8HAQDdDAAhsAcCAJMQACGxBwAA1xH6BiKyBwEA3gwAIbMHAQDeDAAhtAcBAN4MACG1BwEA3gwAIbYHAQDeDAAhtwcBAN4MACG4B4AAAAABuQdAAPUMACG7BwEA3gwAIR08AACzEgAgPQAAtBIAID8AALYSACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG9BgAAshK7ByK_BkAA9QwAIeQGAQDeDAAhpgcBAN4MACGnBwEA3QwAIagHAQDdDAAhqQcBAN4MACGrBwAArxKrByOsBwEA3gwAIa0HAACwEtMGI64HEACxEgAhrwcBAN0MACGwBwIAkxAAIbEHAADXEfoGIrIHAQDeDAAhswcBAN4MACG0BwEA3gwAIbUHAQDeDAAhtgcBAN4MACG3BwEA3gwAIbgHgAAAAAG5B0AA9QwAIbsHAQDeDAAhHTwAAMMSACA9AADEEgAgPwAAxhIAIIUGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABpwcBAAAAAagHAQAAAAGpBwEAAAABqwcAAACrBwOsBwEAAAABrQcAAADTBgOuBxAAAAABrwcBAAAAAbAHAgAAAAGxBwAAAPoGArIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHgAAAAAG5B0AAAAABuwcBAAAAAQsJAADoDQAgDgAA5Q0AIA8AAOYNACAQAADJDgAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABrwYBAAAAAQIAAAA8ACBmAACFFAAgAwAAADwAIGYAAIUUACBnAACEFAAgAV8AAK0aADACAAAAPAAgXwAAhBQAIAIAAADdDQAgXwAAgxQAIAeFBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrgYBAN0MACGvBgEA3QwAIQsJAADjDQAgDgAA4A0AIA8AAOENACAQAADIDgAghQYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhrwYBAN0MACELCQAA6A0AIA4AAOUNACAPAADmDQAgEAAAyQ4AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAEVCQAArQ4AIAoAAK4OACALAACnDgAgDgAArA4AIA8AAKoOACAQAAC9DwAgGQAAqw4AIBsAAK8OACAsAACoDgAgLQAAqQ4AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB5gYBAAAAAfYGAQAAAAG9B0AAAAABAgAAACgAIGYAAI4UACADAAAAKAAgZgAAjhQAIGcAAI0UACABXwAArBoAMAIAAAAoACBfAACNFAAgAgAAAPENACBfAACMFAAgC4UGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACGuBgEA3QwAIa8GAQDdDAAhsQYBAN0MACHmBgEA3QwAIfYGAQDeDAAhvQdAAN8MACEVCQAA-g0AIAoAAPsNACALAAD0DQAgDgAA-Q0AIA8AAPcNACAQAAC7DwAgGQAA-A0AIBsAAPwNACAsAAD1DQAgLQAA9g0AIIUGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACGuBgEA3QwAIa8GAQDdDAAhsQYBAN0MACHmBgEA3QwAIfYGAQDeDAAhvQdAAN8MACEVCQAArQ4AIAoAAK4OACALAACnDgAgDgAArA4AIA8AAKoOACAQAAC9DwAgGQAAqw4AIBsAAK8OACAsAACoDgAgLQAAqQ4AIIUGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGtBgEAAAABrgYBAAAAAa8GAQAAAAGxBgEAAAAB5gYBAAAAAfYGAQAAAAG9B0AAAAABDgMAAMAPACAJAAC_DwAgDQAAwQ8AIBMAAMIPACAaAADDDwAgHAAAxA8AICIAAMUPACCFBgEAAAABiQYBAAAAAYsGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHaBgEAAAABAgAAAJ0BACBmAACaFAAgAwAAAJ0BACBmAACaFAAgZwAAmRQAIAFfAACrGgAwEwMAANcKACAHAACbCwAgCQAAnQwAIA0AAIELACATAADTCwAgGgAAjwsAIBwAAIMLACAiAADbCwAgggYAAKMMADCDBgAAUwAQhAYAAKMMADCFBgEAAAABiQYBANMKACGKBgEA0goAIYsGAQDTCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAh2gYBAAAAAQIAAACdAQAgXwAAmRQAIAIAAACXFAAgXwAAmBQAIAuCBgAAlhQAMIMGAACXFAAQhAYAAJYUADCFBgEA0goAIYkGAQDTCgAhigYBANIKACGLBgEA0woAIYwGAQDSCgAhjQZAANYKACGOBkAA1goAIdoGAQDSCgAhC4IGAACWFAAwgwYAAJcUABCEBgAAlhQAMIUGAQDSCgAhiQYBANMKACGKBgEA0goAIYsGAQDTCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAh2gYBANIKACEHhQYBAN0MACGJBgEA3gwAIYsGAQDeDAAhjAYBAN0MACGNBkAA3wwAIY4GQADfDAAh2gYBAN0MACEOAwAA8A4AIAkAAO8OACANAADxDgAgEwAA8g4AIBoAAPMOACAcAAD0DgAgIgAA9Q4AIIUGAQDdDAAhiQYBAN4MACGLBgEA3gwAIYwGAQDdDAAhjQZAAN8MACGOBkAA3wwAIdoGAQDdDAAhDgMAAMAPACAJAAC_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_BwEAAAABAgAAACMAIGYAAL8UACADAAAAIwAgZgAAvxQAIGcAAL0UACABXwAAoxoAMAIAAAAjACBfAAC9FAAgAgAAAI4RACBfAAC8FAAgCYUGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACHwBgIAkxAAIfYGAQDeDAAhvgcBAN0MACG_BwEA3QwAIQ0JAACSEQAgCgAAvhQAIA0AAJMRACARAACUEQAghQYBAN0MACGLBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfAGAgCTEAAh9gYBAN4MACG-BwEA3QwAIb8HAQDdDAAhB2YAAJ4aACBnAAChGgAg6wcAAJ8aACDsBwAAoBoAIO8HAAAdACDwBwAAHQAg8QcAAB8AIA0JAACpEQAgCgAAwBQAIA0AAKoRACARAACrEQAghQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAHwBgIAAAAB9gYBAAAAAb4HAQAAAAG_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AcBAAAAAQIAAAAaACBmAADKFgAgAwAAABoAIGYAAMoWACBnAACdFQAgAV8AAJEaADAcCAAA0QwAIAwAAP8KACANAACBCwAgEQAA0AsAIBwAAIMLACAlAACACwAgJwAAggsAICoAANgLACAuAADJCwAgLwAAygsAIDAAAMwLACAxAADOCwAgMgAAzwsAIDQAAJILACA1AADSCwAgNgAA0wsAIDcAANQLACA4AADbCwAgggYAANAMADCDBgAAGAAQhAYAANAMADCFBgEAAAABjQZAANYKACGOBkAA1goAIeQGAQDTCgAh9QYBANMKACGpBwEA0woAIbwHAQDSCgAhAgAAABoAIF8AAJ0VACACAAAAmxUAIF8AAJwVACAKggYAAJoVADCDBgAAmxUAEIQGAACaFQAwhQYBANIKACGNBkAA1goAIY4GQADWCgAh5AYBANMKACH1BgEA0woAIakHAQDTCgAhvAcBANIKACEKggYAAJoVADCDBgAAmxUAEIQGAACaFQAwhQYBANIKACGNBkAA1goAIY4GQADWCgAh5AYBANMKACH1BgEA0woAIakHAQDTCgAhvAcBANIKACEGhQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACGpBwEA3gwAIbwHAQDdDAAhFwwAAKwVACANAACkFQAgEQAApRUAIBwAAKsVACAlAAChFQAgJwAAqhUAICoAAK0VACAuAACeFQAgLwAAnxUAIDAAAKAVACAxAACiFQAgMgAAoxUAIDQAAKYVACA1AACnFQAgNgAAqBUAIDcAAKkVACA4AACuFQAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACGpBwEA3gwAIbwHAQDdDAAhC2YAAMEWADBnAADFFgAw6wcAAMIWADDsBwAAwxYAMO0HAADEFgAg7gcAAP8UADDvBwAA_xQAMPAHAAD_FAAw8QcAAP8UADDyBwAAxhYAMPMHAACCFQAwC2YAALYWADBnAAC6FgAw6wcAALcWADDsBwAAuBYAMO0HAAC5FgAg7gcAAOYUADDvBwAA5hQAMPAHAADmFAAw8QcAAOYUADDyBwAAuxYAMPMHAADpFAAwC2YAAK0WADBnAACxFgAw6wcAAK4WADDsBwAArxYAMO0HAACwFgAg7gcAAIoRADDvBwAAihEAMPAHAACKEQAw8QcAAIoRADDyBwAAshYAMPMHAACNEQAwC2YAAKQWADBnAACoFgAw6wcAAKUWADDsBwAAphYAMO0HAACnFgAg7gcAAI0QADDvBwAAjRAAMPAHAACNEAAw8QcAAI0QADDyBwAAqRYAMPMHAACQEAAwC2YAAJsWADBnAACfFgAw6wcAAJwWADDsBwAAnRYAMO0HAACeFgAg7gcAAJ8UADDvBwAAnxQAMPAHAACfFAAw8QcAAJ8UADDyBwAAoBYAMPMHAACiFAAwC2YAAJIWADBnAACWFgAw6wcAAJMWADDsBwAAlBYAMO0HAACVFgAg7gcAAJMUADDvBwAAkxQAMPAHAACTFAAw8QcAAJMUADDyBwAAlxYAMPMHAACWFAAwC2YAAIkWADBnAACNFgAw6wcAAIoWADDsBwAAixYAMO0HAACMFgAg7gcAAO0NADDvBwAA7Q0AMPAHAADtDQAw8QcAAO0NADDyBwAAjhYAMPMHAADwDQAwC2YAAIAWADBnAACEFgAw6wcAAIEWADDsBwAAghYAMO0HAACDFgAg7gcAANkNADDvBwAA2Q0AMPAHAADZDQAw8QcAANkNADDyBwAAhRYAMPMHAADcDQAwC2YAAPcVADBnAAD7FQAw6wcAAPgVADDsBwAA-RUAMO0HAAD6FQAg7gcAAJsNADDvBwAAmw0AMPAHAACbDQAw8QcAAJsNADDyBwAA_BUAMPMHAACeDQAwC2YAAO4VADBnAADyFQAw6wcAAO8VADDsBwAA8BUAMO0HAADxFQAg7gcAALINADDvBwAAsg0AMPAHAACyDQAw8QcAALINADDyBwAA8xUAMPMHAAC1DQAwC2YAAOUVADBnAADpFQAw6wcAAOYVADDsBwAA5xUAMO0HAADoFQAg7gcAAMINADDvBwAAwg0AMPAHAADCDQAw8QcAAMINADDyBwAA6hUAMPMHAADFDQAwC2YAANwVADBnAADgFQAw6wcAAN0VADDsBwAA3hUAMO0HAADfFQAg7gcAAIgNADDvBwAAiA0AMPAHAACIDQAw8QcAAIgNADDyBwAA4RUAMPMHAACLDQAwC2YAANMVADBnAADXFQAw6wcAANQVADDsBwAA1RUAMO0HAADWFQAg7gcAAOkPADDvBwAA6Q8AMPAHAADpDwAw8QcAAOkPADDyBwAA2BUAMPMHAADsDwAwC2YAAMoVADBnAADOFQAw6wcAAMsVADDsBwAAzBUAMO0HAADNFQAg7gcAAIUPADDvBwAAhQ8AMPAHAACFDwAw8QcAAIUPADDyBwAAzxUAMPMHAACIDwAwC2YAAMEVADBnAADFFQAw6wcAAMIVADDsBwAAwxUAMO0HAADEFQAg7gcAAMEQADDvBwAAwRAAMPAHAADBEAAw8QcAAMEQADDyBwAAxhUAMPMHAADEEAAwC2YAALgVADBnAAC8FQAw6wcAALkVADDsBwAAuhUAMO0HAAC7FQAg7gcAAJYOADDvBwAAlg4AMPAHAACWDgAw8QcAAJYOADDyBwAAvRUAMPMHAACZDgAwC2YAAK8VADBnAACzFQAw6wcAALAVADDsBwAAsRUAMO0HAACyFQAg7gcAAO0MADDvBwAA7QwAMPAHAADtDAAw8QcAAO0MADDyBwAAtBUAMPMHAADwDAAwFRAAAIAPACAYAACBDQAgGQAAgg0AIB4AAP4MACAfAAD_DAAgIAAAgA0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZwHAQAAAAGdBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAgAAAF0AIGYAALcVACADAAAAXQAgZgAAtxUAIGcAALYVACABXwAAkBoAMAIAAABdACBfAAC2FQAgAgAAAPEMACBfAAC1FQAgD4UGAQDdDAAhjQZAAN8MACGOBkAA3wwAIa8GAQDeDAAhsQYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcimwcBAN0MACGcBwEA3QwAIZ0HAQDdDAAhnwcBAN4MACGgBwEA3gwAIaEHQADfDAAhFRAAAP4OACAYAAD6DAAgGQAA-wwAIB4AAPcMACAfAAD4DAAgIAAA-QwAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIa8GAQDeDAAhsQYBAN4MACG9BgAA9AybByK_BkAA9QwAIcIGAQDeDAAhmQcAAPMMmQcimwcBAN0MACGcBwEA3QwAIZ0HAQDdDAAhnwcBAN4MACGgBwEA3gwAIaEHQADfDAAhFRAAAIAPACAYAACBDQAgGQAAgg0AIB4AAP4MACAfAAD_DAAgIAAAgA0AIIUGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZwHAQAAAAGdBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABDgcAAKQOACAoAACiDgAgKQAA1hAAICsAAKMOACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABwwYBAAAAAd4GAQAAAAHkBgEAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAABAgAAACwAIGYAAMAVACADAAAALAAgZgAAwBUAIGcAAL8VACABXwAAjxoAMAIAAAAsACBfAAC_FQAgAgAAAJoOACBfAAC-FQAgCoUGAQDdDAAhigYBAN4MACGNBkAA3wwAIY4GQADfDAAhwwYBAN0MACHeBgEA3QwAIeQGAQDeDAAh6wYBAN4MACHsBgEA3QwAIe0GAQDdDAAhDgcAAJ8OACAoAACdDgAgKQAA1BAAICsAAJ4OACCFBgEA3QwAIYoGAQDeDAAhjQZAAN8MACGOBkAA3wwAIcMGAQDdDAAh3gYBAN0MACHkBgEA3gwAIesGAQDeDAAh7AYBAN0MACHtBgEA3QwAIQ4HAACkDgAgKAAAog4AICkAANYQACArAACjDgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAcMGAQAAAAHeBgEAAAAB5AYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQ0HAADZEAAgCwAA2BAAIBsAAPAQACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADrBgLeBgEAAAAB5AYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAQIAAAAzACBmAADJFQAgAwAAADMAIGYAAMkVACBnAADIFQAgAV8AAI4aADACAAAAMwAgXwAAyBUAIAIAAADFEAAgXwAAxxUAIAqFBgEA3QwAIYoGAQDeDAAhjQZAAN8MACGOBkAA3wwAIb0GAADHEOsGIt4GAQDdDAAh5AYBAN4MACHmBgEA3gwAIegGAQDdDAAh6QYBAN0MACENBwAAyhAAIAsAAMkQACAbAADvEAAghQYBAN0MACGKBgEA3gwAIY0GQADfDAAhjgZAAN8MACG9BgAAxxDrBiLeBgEA3QwAIeQGAQDeDAAh5gYBAN4MACHoBgEA3QwAIekGAQDdDAAhDQcAANkQACALAADYEAAgGwAA8BAAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAOsGAt4GAQAAAAHkBgEAAAAB5gYBAAAAAegGAQAAAAHpBgEAAAABGgcAAJMPACAZAADkDwAgGwAAlQ8AIB0AAJYPACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB5gYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAECAAAAVwAgZgAA0hUAIAMAAABXACBmAADSFQAgZwAA0RUAIAFfAACNGgAwAgAAAFcAIF8AANEVACACAAAAiQ8AIF8AANAVACAWhQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACGxBgEA3QwAIb0GAACMD44HItUGEADlDgAh1gYBAN0MACHXBgIA5g4AIeYGAQDdDAAh-gYBAN0MACH7BgEA3gwAIfwGAQDeDAAh_QYBAN4MACH-BgEA3gwAIf8GAQDeDAAhgAeAAAAAAYEHQAD1DAAhigcBAN0MACGMBwAAiw-MByKOBwEA3QwAIY8HQADfDAAhGgcAAI4PACAZAADiDwAgGwAAkA8AIB0AAJEPACCFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbEGAQDdDAAhvQYAAIwPjgci1QYQAOUOACHWBgEA3QwAIdcGAgDmDgAh5gYBAN0MACH6BgEA3QwAIfsGAQDeDAAh_AYBAN4MACH9BgEA3gwAIf4GAQDeDAAh_wYBAN4MACGAB4AAAAABgQdAAPUMACGKBwEA3QwAIYwHAACLD4wHIo4HAQDdDAAhjwdAAN8MACEaBwAAkw8AIBkAAOQPACAbAACVDwAgHQAAlg8AIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAAQwHAAD9DwAgGwAA6xEAIBwAAP8PACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB1gYBAAAAAeYGAQAAAAGIByAAAAABkAcQAAAAAZEHEAAAAAECAAAAdgAgZgAA2xUAIAMAAAB2ACBmAADbFQAgZwAA2hUAIAFfAACMGgAwAgAAAHYAIF8AANoVACACAAAA7Q8AIF8AANkVACAJhQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACHWBgEA3QwAIeYGAQDdDAAhiAcgAL8OACGQBxAA5Q4AIZEHEADlDgAhDAcAAPAPACAbAADqEQAgHAAA8g8AIIUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAh1gYBAN0MACHmBgEA3QwAIYgHIAC_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_BwEAAAABAgAAACMAIGYAALUWACADAAAAIwAgZgAAtRYAIGcAALQWACABXwAAghoAMAIAAAAjACBfAAC0FgAgAgAAAI4RACBfAACzFgAgCYUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACHwBgIAkxAAIfYGAQDeDAAhvgcBAN0MACG_BwEA3QwAIQ0HAACREQAgCgAAvhQAIA0AAJMRACARAACUEQAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfAGAgCTEAAh9gYBAN4MACG-BwEA3QwAIb8HAQDdDAAhDQcAAKgRACAKAADAFAAgDQAAqhEAIBEAAKsRACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAfAGAgAAAAH2BgEAAAABvgcBAAAAAb8HAQAAAAEIBwAAwBYAICUAAPoUACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAECAAAAlwEAIGYAAL8WACADAAAAlwEAIGYAAL8WACBnAAC9FgAgAV8AAIEaADACAAAAlwEAIF8AAL0WACACAAAA6hQAIF8AALwWACAGhQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAhCAcAAL4WACAlAADuFAAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAhBWYAAPwZACBnAAD_GQAg6wcAAP0ZACDsBwAA_hkAIPEHAAD-BAAgCAcAAMAWACAlAAD6FAAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAABA2YAAPwZACDrBwAA_RkAIPEHAAD-BAAgDQcAAK4RACANAACtEQAgDwAArBEAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAAB5AYBAAAAAe4GAQAAAAHvBkAAAAAB8AYIAAAAAfEGCAAAAAECAAAAHwAgZgAAyRYAIAMAAAAfACBmAADJFgAgZwAAyBYAIAFfAAD7GQAwAgAAAB8AIF8AAMgWACACAAAAgxUAIF8AAMcWACAKhQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG2BgEA3QwAIeQGAQDeDAAh7gYBAN4MACHvBkAA9QwAIfAGCACODQAh8QYIAI4NACENBwAA-xAAIA0AAPoQACAPAAD5EAAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG2BgEA3QwAIeQGAQDeDAAh7gYBAN4MACHvBkAA9QwAIfAGCACODQAh8QYIAI4NACENBwAArhEAIA0AAK0RACAPAACsEQAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAHkBgEAAAAB7gYBAAAAAe8GQAAAAAHwBggAAAAB8QYIAAAAARcMAADZFgAgDQAA0RYAIBEAANIWACAcAADYFgAgJQAAzhYAICcAANcWACAqAADaFgAgLgAAyxYAIC8AAMwWACAwAADNFgAgMQAAzxYAIDIAANAWACA0AADTFgAgNQAA1BYAIDYAANUWACA3AADWFgAgOAAA2xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAGpBwEAAAABvAcBAAAAAQRmAADBFgAw6wcAAMIWADDtBwAAxBYAIPEHAAD_FAAwBGYAALYWADDrBwAAtxYAMO0HAAC5FgAg8QcAAOYUADAEZgAArRYAMOsHAACuFgAw7QcAALAWACDxBwAAihEAMARmAACkFgAw6wcAAKUWADDtBwAApxYAIPEHAACNEAAwBGYAAJsWADDrBwAAnBYAMO0HAACeFgAg8QcAAJ8UADAEZgAAkhYAMOsHAACTFgAw7QcAAJUWACDxBwAAkxQAMARmAACJFgAw6wcAAIoWADDtBwAAjBYAIPEHAADtDQAwBGYAAIAWADDrBwAAgRYAMO0HAACDFgAg8QcAANkNADAEZgAA9xUAMOsHAAD4FQAw7QcAAPoVACDxBwAAmw0AMARmAADuFQAw6wcAAO8VADDtBwAA8RUAIPEHAACyDQAwBGYAAOUVADDrBwAA5hUAMO0HAADoFQAg8QcAAMINADAEZgAA3BUAMOsHAADdFQAw7QcAAN8VACDxBwAAiA0AMARmAADTFQAw6wcAANQVADDtBwAA1hUAIPEHAADpDwAwBGYAAMoVADDrBwAAyxUAMO0HAADNFQAg8QcAAIUPADAEZgAAwRUAMOsHAADCFQAw7QcAAMQVACDxBwAAwRAAMARmAAC4FQAw6wcAALkVADDtBwAAuxUAIPEHAACWDgAwBGYAAK8VADDrBwAAsBUAMO0HAACyFQAg8QcAAO0MADAHOQAA3RYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAGpBwEAAAABvAcBAAAAAQRmAACTFQAw6wcAAJQVADDtBwAAlhUAIPEHAACXFQAwBGYAAIcVADDrBwAAiBUAMO0HAACKFQAg8QcAAIsVADAEZgAA-xQAMOsHAAD8FAAw7QcAAP4UACDxBwAA_xQAMARmAADiFAAw6wcAAOMUADDtBwAA5RQAIPEHAADmFAAwBGYAAMoUADDrBwAAyxQAMO0HAADNFAAg8QcAAM4UADAEZgAAwRQAMOsHAADCFAAw7QcAAMQUACDxBwAAjRAAMARmAAC2FAAw6wcAALcUADDtBwAAuRQAIPEHAACKEQAwBGYAAKcUADDrBwAAqBQAMO0HAACqFAAg8QcAAKsUADAEZgAAmxQAMOsHAACcFAAw7QcAAJ4UACDxBwAAnxQAMARmAACPFAAw6wcAAJAUADDtBwAAkhQAIPEHAACTFAAwBGYAAIYUADDrBwAAhxQAMO0HAACJFAAg8QcAAO0NADAEZgAA_RMAMOsHAAD-EwAw7QcAAIAUACDxBwAA2Q0AMARmAADxEwAw6wcAAPITADDtBwAA9BMAIPEHAAD1EwAwBGYAAOgTADDrBwAA6RMAMO0HAADrEwAg8QcAAJsNADAEZgAA3xMAMOsHAADgEwAw7QcAAOITACDxBwAAsg0AMARmAADWEwAw6wcAANcTADDtBwAA2RMAIPEHAADCDQAwBGYAAM0TADDrBwAAzhMAMO0HAADQEwAg8QcAAIgNADAEZgAAxBMAMOsHAADFEwAw7QcAAMcTACDxBwAA6Q8AMARmAAC7EwAw6wcAALwTADDtBwAAvhMAIPEHAACFDwAwA2YAALYTACDrBwAAtxMAIPEHAADUBgAgBGYAAKoTADDrBwAAqxMAMO0HAACtEwAg8QcAAK4TADAEZgAAoRMAMOsHAACiEwAw7QcAAKQTACDxBwAAuxIAMARmAACYEwAw6wcAAJkTADDtBwAAmxMAIPEHAADBEAAwBGYAAI8TADDrBwAAkBMAMO0HAACSEwAg8QcAAJYOADAEZgAAgxMAMOsHAACEEwAw7QcAAIYTACDxBwAAhxMAMARmAAD3EgAw6wcAAPgSADDtBwAA-hIAIPEHAAD7EgAwBGYAAO4SADDrBwAA7xIAMO0HAADxEgAg8QcAAO0MADAEZgAA5RIAMOsHAADmEgAw7QcAAOgSACDxBwAA7QwAMAAAAAAAAAAAAAAAAAACBwAA3xEAIIkHAADZDAAgAAAAAAAAAAAAB2YAAPYZACBnAAD5GQAg6wcAAPcZACDsBwAA-BkAIO8HAAAWACDwBwAAFgAg8QcAAP4EACADZgAA9hkAIOsHAAD3GQAg8QcAAP4EACAAAAAHZgAA8RkAIGcAAPQZACDrBwAA8hkAIOwHAADzGQAg7wcAABIAIPAHAAASACDxBwAAFAAgA2YAAPEZACDrBwAA8hkAIPEHAAAUACAAAAAAAAAAAAAAAAAABWYAAOwZACBnAADvGQAg6wcAAO0ZACDsBwAA7hkAIPEHAAD-BAAgA2YAAOwZACDrBwAA7RkAIPEHAAD-BAAgAAAAAAAABWYAAOcZACBnAADqGQAg6wcAAOgZACDsBwAA6RkAIPEHAAD7AgAgA2YAAOcZACDrBwAA6BkAIPEHAAD7AgAgAAAAAAAABWYAAOIZACBnAADlGQAg6wcAAOMZACDsBwAA5BkAIPEHAAD7AgAgA2YAAOIZACDrBwAA4xkAIPEHAAD7AgAgAAAABWYAAN0ZACBnAADgGQAg6wcAAN4ZACDsBwAA3xkAIPEHAAD7AgAgA2YAAN0ZACDrBwAA3hkAIPEHAAD7AgAgAAAAC2YAAP0YADBnAACCGQAw6wcAAP4YADDsBwAA_xgAMO0HAACAGQAg7gcAAIEZADDvBwAAgRkAMPAHAACBGQAw8QcAAIEZADDyBwAAgxkAMPMHAACEGQAwC2YAAPEYADBnAAD2GAAw6wcAAPIYADDsBwAA8xgAMO0HAAD0GAAg7gcAAPUYADDvBwAA9RgAMPAHAAD1GAAw8QcAAPUYADDyBwAA9xgAMPMHAAD4GAAwC2YAAOYYADBnAADqGAAw6wcAAOcYADDsBwAA6BgAMO0HAADpGAAg7gcAAKsUADDvBwAAqxQAMPAHAACrFAAw8QcAAKsUADDyBwAA6xgAMPMHAACuFAAwC2YAAN0YADBnAADhGAAw6wcAAN4YADDsBwAA3xgAMO0HAADgGAAg7gcAAJ8UADDvBwAAnxQAMPAHAACfFAAw8QcAAJ8UADDyBwAA4hgAMPMHAACiFAAwC2YAANQYADBnAADYGAAw6wcAANUYADDsBwAA1hgAMO0HAADXGAAg7gcAAJMUADDvBwAAkxQAMPAHAACTFAAw8QcAAJMUADDyBwAA2RgAMPMHAACWFAAwC2YAAMsYADBnAADPGAAw6wcAAMwYADDsBwAAzRgAMO0HAADOGAAg7gcAAPUTADDvBwAA9RMAMPAHAAD1EwAw8QcAAPUTADDyBwAA0BgAMPMHAAD4EwAwC2YAAMIYADBnAADGGAAw6wcAAMMYADDsBwAAxBgAMO0HAADFGAAg7gcAAPUTADDvBwAA9RMAMPAHAAD1EwAw8QcAAPUTADDyBwAAxxgAMPMHAAD4EwAwC2YAALkYADBnAAC9GAAw6wcAALoYADDsBwAAuxgAMO0HAAC8GAAg7gcAAJsNADDvBwAAmw0AMPAHAACbDQAw8QcAAJsNADDyBwAAvhgAMPMHAACeDQAwC2YAALAYADBnAAC0GAAw6wcAALEYADDsBwAAshgAMO0HAACzGAAg7gcAAJsNADDvBwAAmw0AMPAHAACbDQAw8QcAAJsNADDyBwAAtRgAMPMHAACeDQAwB2YAAKsYACBnAACuGAAg6wcAAKwYACDsBwAArRgAIO8HAACuAgAg8AcAAK4CACDxBwAAkAoAIAtmAACiGAAwZwAAphgAMOsHAACjGAAw7AcAAKQYADDtBwAApRgAIO4HAACbDwAw7wcAAJsPADDwBwAAmw8AMPEHAACbDwAw8gcAAKcYADDzBwAAng8AMAtmAACZGAAwZwAAnRgAMOsHAACaGAAw7AcAAJsYADDtBwAAnBgAIO4HAACbDwAw7wcAAJsPADDwBwAAmw8AMPEHAACbDwAw8gcAAJ4YADDzBwAAng8AMAdmAACUGAAgZwAAlxgAIOsHAACVGAAg7AcAAJYYACDvBwAAsgIAIPAHAACyAgAg8QcAALIIACALZgAAiBgAMGcAAI0YADDrBwAAiRgAMOwHAACKGAAw7QcAAIsYACDuBwAAjBgAMO8HAACMGAAw8AcAAIwYADDxBwAAjBgAMPIHAACOGAAw8wcAAI8YADALZgAA_xcAMGcAAIMYADDrBwAAgBgAMOwHAACBGAAw7QcAAIIYACDuBwAA7QwAMO8HAADtDAAw8AcAAO0MADDxBwAA7QwAMPIHAACEGAAw8wcAAPAMADALZgAA9hcAMGcAAPoXADDrBwAA9xcAMOwHAAD4FwAw7QcAAPkXACDuBwAA7QwAMO8HAADtDAAw8AcAAO0MADDxBwAA7QwAMPIHAAD7FwAw8wcAAPAMADALZgAA7RcAMGcAAPEXADDrBwAA7hcAMOwHAADvFwAw7QcAAPAXACDuBwAA-xIAMO8HAAD7EgAw8AcAAPsSADDxBwAA-xIAMPIHAADyFwAw8wcAAP4SADALZgAA5BcAMGcAAOgXADDrBwAA5RcAMOwHAADmFwAw7QcAAOcXACDuBwAA-xIAMO8HAAD7EgAw8AcAAPsSADDxBwAA-xIAMPIHAADpFwAw8wcAAP4SADALZgAA2xcAMGcAAN8XADDrBwAA3BcAMOwHAADdFwAw7QcAAN4XACDuBwAAhxMAMO8HAACHEwAw8AcAAIcTADDxBwAAhxMAMPIHAADgFwAw8wcAAIoTADALZgAA0hcAMGcAANYXADDrBwAA0xcAMOwHAADUFwAw7QcAANUXACDuBwAAhBIAMO8HAACEEgAw8AcAAIQSADDxBwAAhBIAMPIHAADXFwAw8wcAAIcSADAERAAA8REAIIUGAQAAAAGSBwEAAAABkwdAAAAAAQIAAAD4AQAgZgAA2hcAIAMAAAD4AQAgZgAA2hcAIGcAANkXACABXwAA3BkAMAIAAAD4AQAgXwAA2RcAIAIAAACIEgAgXwAA2BcAIAOFBgEA3QwAIZIHAQDdDAAhkwdAAN8MACEERAAA7xEAIIUGAQDdDAAhkgcBAN0MACGTB0AA3wwAIQREAADxEQAghQYBAAAAAZIHAQAAAAGTB0AAAAABCgcAAJgSACBFAACaEgAgRgAAmxIAIIUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZcHAAAAlQcCAgAAAPABACBmAADjFwAgAwAAAPABACBmAADjFwAgZwAA4hcAIAFfAADbGQAwAgAAAPABACBfAADiFwAgAgAAAIsTACBfAADhFwAgB4UGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACG3BgEA3QwAIZcHAAD2EZUHIgoHAAD8EQAgRQAA_hEAIEYAAP8RACCFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbYGAQDdDAAhtwYBAN0MACGXBwAA9hGVByIKBwAAmBIAIEUAAJoSACBGAACbEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAG3BgEAAAABlwcAAACVBwILBwAAqBIAICAAAKcSACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABnQcBAAAAAaMHAAAAowcCpQcBAAAAAQIAAAD-AQAgZgAA7BcAIAMAAAD-AQAgZgAA7BcAIGcAAOsXACABXwAA2hkAMAIAAAD-AQAgXwAA6xcAIAIAAAD_EgAgXwAA6hcAIAmFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAIb0GAACjEqUHIr8GQAD1DAAhnQcBAN0MACGjBwAAohKjByKlBwEA3gwAIQsHAAClEgAgIAAApBIAIIUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhvQYAAKMSpQcivwZAAPUMACGdBwEA3QwAIaMHAACiEqMHIqUHAQDeDAAhCwcAAKgSACAgAACnEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAApQcCvwZAAAAAAZ0HAQAAAAGjBwAAAKMHAqUHAQAAAAELBwAAqBIAID0AAKkSACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAClBwK_BkAAAAABowcAAACjBwKlBwEAAAABpgcBAAAAAQIAAAD-AQAgZgAA9RcAIAMAAAD-AQAgZgAA9RcAIGcAAPQXACABXwAA2RkAMAIAAAD-AQAgXwAA9BcAIAIAAAD_EgAgXwAA8xcAIAmFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAIb0GAACjEqUHIr8GQAD1DAAhowcAAKISowcipQcBAN4MACGmBwEA3gwAIQsHAAClEgAgPQAAphIAIIUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhvQYAAKMSpQcivwZAAPUMACGjBwAAohKjByKlBwEA3gwAIaYHAQDeDAAhCwcAAKgSACA9AACpEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAApQcCvwZAAAAAAaMHAAAAowcCpQcBAAAAAaYHAQAAAAEVEAAAgA8AIBkAAIINACAeAAD-DAAgHwAA_wwAICAAAIANACAhAACDDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAECAAAAXQAgZgAA_hcAIAMAAABdACBmAAD-FwAgZwAA_RcAIAFfAADYGQAwAgAAAF0AIF8AAP0XACACAAAA8QwAIF8AAPwXACAPhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhrwYBAN4MACGxBgEA3gwAIb0GAAD0DJsHIr8GQAD1DAAhmQcAAPMMmQcimwcBAN0MACGcBwEA3QwAIZ0HAQDdDAAhngcBAN4MACGfBwEA3gwAIaAHAQDeDAAhoQdAAN8MACEVEAAA_g4AIBkAAPsMACAeAAD3DAAgHwAA-AwAICAAAPkMACAhAAD8DAAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhrwYBAN4MACGxBgEA3gwAIb0GAAD0DJsHIr8GQAD1DAAhmQcAAPMMmQcimwcBAN0MACGcBwEA3QwAIZ0HAQDdDAAhngcBAN4MACGfBwEA3gwAIaAHAQDeDAAhoQdAAN8MACEVEAAAgA8AIBkAAIINACAeAAD-DAAgHwAA_wwAICAAAIANACAhAACDDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAGZBwAAAJkHApsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAEVEAAAgA8AIBgAAIENACAZAACCDQAgHgAA_gwAIB8AAP8MACAhAACDDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAECAAAAXQAgZgAAhxgAIAMAAABdACBmAACHGAAgZwAAhhgAIAFfAADXGQAwAgAAAF0AIF8AAIYYACACAAAA8QwAIF8AAIUYACAPhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhrwYBAN4MACGxBgEA3gwAIb0GAAD0DJsHIr8GQAD1DAAhwgYBAN4MACGZBwAA8wyZByKbBwEA3QwAIZwHAQDdDAAhngcBAN4MACGfBwEA3gwAIaAHAQDeDAAhoQdAAN8MACEVEAAA_g4AIBgAAPoMACAZAAD7DAAgHgAA9wwAIB8AAPgMACAhAAD8DAAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhrwYBAN4MACGxBgEA3gwAIb0GAAD0DJsHIr8GQAD1DAAhwgYBAN4MACGZBwAA8wyZByKbBwEA3QwAIZwHAQDdDAAhngcBAN4MACGfBwEA3gwAIaAHAQDeDAAhoQdAAN8MACEVEAAAgA8AIBgAAIENACAZAACCDQAgHgAA_gwAIB8AAP8MACAhAACDDQAghQYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ4HAQAAAAGfBwEAAAABoAcBAAAAAaEHQAAAAAEFhQYBAAAAAY0GQAAAAAGOBkAAAAABxQcBAAAAAcYHQAAAAAECAAAAtgIAIGYAAJMYACADAAAAtgIAIGYAAJMYACBnAACSGAAgAV8AANYZADAKAwAA1woAIIIGAAD6CwAwgwYAALQCABCEBgAA-gsAMIUGAQAAAAGMBgEAAAABjQZAANYKACGOBkAA1goAIcUHAQDSCgAhxgdAANYKACECAAAAtgIAIF8AAJIYACACAAAAkBgAIF8AAJEYACAJggYAAI8YADCDBgAAkBgAEIQGAACPGAAwhQYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHFBwEA0goAIcYHQADWCgAhCYIGAACPGAAwgwYAAJAYABCEBgAAjxgAMIUGAQDSCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAhxQcBANIKACHGB0AA1goAIQWFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHFBwEA3QwAIcYHQADfDAAhBYUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIcUHAQDdDAAhxgdAAN8MACEFhQYBAAAAAY0GQAAAAAGOBkAAAAABxQcBAAAAAcYHQAAAAAEIhQYBAAAAAY0GQAAAAAGOBkAAAAABmwYBAAAAAZwGAQAAAAGhBoAAAAABowYgAAAAAd0GAADQDwAgAgAAALIIACBmAACUGAAgAwAAALICACBmAACUGAAgZwAAmBgAIAoAAACyAgAgXwAAmBgAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIZsGAQDdDAAhnAYBAN0MACGhBoAAAAABowYgAL8OACHdBgAAzg8AIAiFBgEA3QwAIY0GQADfDAAhjgZAAN8MACGbBgEA3QwAIZwGAQDdDAAhoQaAAAAAAaMGIAC_DgAh3QYAAM4PACAOFgAApw8AIBcAAKgPACAZAADKDwAghQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHcBgEAAAABAgAAAE0AIGYAAKEYACADAAAATQAgZgAAoRgAIGcAAKAYACABXwAA1RkAMAIAAABNACBfAACgGAAgAgAAAJ8PACBfAACfGAAgC4UGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbEGAQDeDAAhuwYBAN4MACG9BgAAoQ_cBiK-BgEA3gwAIb8GQAD1DAAhwAZAAN8MACHBBgEA3QwAIdwGAQDdDAAhDhYAAKMPACAXAACkDwAgGQAAyQ8AIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbEGAQDeDAAhuwYBAN4MACG9BgAAoQ_cBiK-BgEA3gwAIb8GQAD1DAAhwAZAAN8MACHBBgEA3QwAIdwGAQDdDAAhDhYAAKcPACAXAACoDwAgGQAAyg8AIIUGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG7BgEAAAABvQYAAADcBgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAAB3AYBAAAAAQ4WAACnDwAgGAAAqQ8AIBkAAMoPACCFBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABuwYBAAAAAb0GAAAA3AYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAECAAAATQAgZgAAqhgAIAMAAABNACBmAACqGAAgZwAAqRgAIAFfAADUGQAwAgAAAE0AIF8AAKkYACACAAAAnw8AIF8AAKgYACALhQYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN4MACG7BgEA3gwAIb0GAAChD9wGIr4GAQDeDAAhvwZAAPUMACHABkAA3wwAIcEGAQDdDAAhwgYBAN4MACEOFgAAow8AIBgAAKUPACAZAADJDwAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhsQYBAN4MACG7BgEA3gwAIb0GAAChD9wGIr4GAQDeDAAhvwZAAPUMACHABkAA3wwAIcEGAQDdDAAhwgYBAN4MACEOFgAApw8AIBgAAKkPACAZAADKDwAghQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_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_AADGEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGnBwEAAAABqAcBAAAAAakHAQAAAAGrBwAAAKsHA6wHAQAAAAGtBwAAANMGA64HEAAAAAGvBwEAAAABsAcCAAAAAbEHAAAA-gYCsgcBAAAAAbMHAQAAAAG0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAeAAAAAAbkHQAAAAAG7BwEAAAABAgAAANUBACBmAADKGAAgAwAAANUBACBmAADKGAAgZwAAyRgAIAFfAADRGQAwAgAAANUBACBfAADJGAAgAgAAAPkTACBfAADIGAAgGoUGAQDdDAAhigYBAN4MACGNBkAA3wwAIY4GQADfDAAhvQYAALISuwcivwZAAPUMACHkBgEA3gwAIacHAQDdDAAhqAcBAN0MACGpBwEA3gwAIasHAACvEqsHI6wHAQDeDAAhrQcAALAS0wYjrgcQALESACGvBwEA3QwAIbAHAgCTEAAhsQcAANcR-gYisgcBAN4MACGzBwEA3gwAIbQHAQDeDAAhtQcBAN4MACG2BwEA3gwAIbcHAQDeDAAhuAeAAAAAAbkHQAD1DAAhuwcBAN4MACEdBwAAtRIAIDwAALMSACA_AAC2EgAghQYBAN0MACGKBgEA3gwAIY0GQADfDAAhjgZAAN8MACG9BgAAshK7ByK_BkAA9QwAIeQGAQDeDAAhpwcBAN0MACGoBwEA3QwAIakHAQDeDAAhqwcAAK8SqwcjrAcBAN4MACGtBwAAsBLTBiOuBxAAsRIAIa8HAQDdDAAhsAcCAJMQACGxBwAA1xH6BiKyBwEA3gwAIbMHAQDeDAAhtAcBAN4MACG1BwEA3gwAIbYHAQDeDAAhtwcBAN4MACG4B4AAAAABuQdAAPUMACG7BwEA3gwAIR0HAADFEgAgPAAAwxIAID8AAMYSACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAC7BwK_BkAAAAAB5AYBAAAAAacHAQAAAAGoBwEAAAABqQcBAAAAAasHAAAAqwcDrAcBAAAAAa0HAAAA0wYDrgcQAAAAAa8HAQAAAAGwBwIAAAABsQcAAAD6BgKyBwEAAAABswcBAAAAAbQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4B4AAAAABuQdAAAAAAbsHAQAAAAEdBwAAxRIAID0AAMQSACA_AADGEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABqAcBAAAAAakHAQAAAAGrBwAAAKsHA6wHAQAAAAGtBwAAANMGA64HEAAAAAGvBwEAAAABsAcCAAAAAbEHAAAA-gYCsgcBAAAAAbMHAQAAAAG0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAeAAAAAAbkHQAAAAAG7BwEAAAABAgAAANUBACBmAADTGAAgAwAAANUBACBmAADTGAAgZwAA0hgAIAFfAADQGQAwAgAAANUBACBfAADSGAAgAgAAAPkTACBfAADRGAAgGoUGAQDdDAAhigYBAN4MACGNBkAA3wwAIY4GQADfDAAhvQYAALISuwcivwZAAPUMACHkBgEA3gwAIaYHAQDeDAAhqAcBAN0MACGpBwEA3gwAIasHAACvEqsHI6wHAQDeDAAhrQcAALAS0wYjrgcQALESACGvBwEA3QwAIbAHAgCTEAAhsQcAANcR-gYisgcBAN4MACGzBwEA3gwAIbQHAQDeDAAhtQcBAN4MACG2BwEA3gwAIbcHAQDeDAAhuAeAAAAAAbkHQAD1DAAhuwcBAN4MACEdBwAAtRIAID0AALQSACA_AAC2EgAghQYBAN0MACGKBgEA3gwAIY0GQADfDAAhjgZAAN8MACG9BgAAshK7ByK_BkAA9QwAIeQGAQDeDAAhpgcBAN4MACGoBwEA3QwAIakHAQDeDAAhqwcAAK8SqwcjrAcBAN4MACGtBwAAsBLTBiOuBxAAsRIAIa8HAQDdDAAhsAcCAJMQACGxBwAA1xH6BiKyBwEA3gwAIbMHAQDeDAAhtAcBAN4MACG1BwEA3gwAIbYHAQDeDAAhtwcBAN4MACG4B4AAAAABuQdAAPUMACG7BwEA3gwAIR0HAADFEgAgPQAAxBIAID8AAMYSACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAAC7BwK_BkAAAAAB5AYBAAAAAaYHAQAAAAGoBwEAAAABqQcBAAAAAasHAAAAqwcDrAcBAAAAAa0HAAAA0wYDrgcQAAAAAa8HAQAAAAGwBwIAAAABsQcAAAD6BgKyBwEAAAABswcBAAAAAbQHAQAAAAG1BwEAAAABtgcBAAAAAbcHAQAAAAG4B4AAAAABuQdAAAAAAbsHAQAAAAEOBwAAvg8AIAkAAL8PACANAADBDwAgEwAAwg8AIBoAAMMPACAcAADEDwAgIgAAxQ8AIIUGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAECAAAAnQEAIGYAANwYACADAAAAnQEAIGYAANwYACBnAADbGAAgAV8AAM8ZADACAAAAnQEAIF8AANsYACACAAAAlxQAIF8AANoYACAHhQYBAN0MACGJBgEA3gwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAh2gYBAN0MACEOBwAA7g4AIAkAAO8OACANAADxDgAgEwAA8g4AIBoAAPMOACAcAAD0DgAgIgAA9Q4AIIUGAQDdDAAhiQYBAN4MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIdoGAQDdDAAhDgcAAL4PACAJAAC_DwAgDQAAwQ8AIBMAAMIPACAaAADDDwAgHAAAxA8AICIAAMUPACCFBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHaBgEAAAABEQcAALEOACAJAAC4DgAgDQAAsg4AIBEAALMOACAiAAC3DgAgJAAAtA4AIEsAALUOACBMAAC2DgAghQYBAAAAAYYGAQAAAAGHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABAgAAABAAIGYAAOUYACADAAAAEAAgZgAA5RgAIGcAAOQYACABXwAAzhkAMAIAAAAQACBfAADkGAAgAgAAAKMUACBfAADjGAAgCYUGAQDdDAAhhgYBAN0MACGHBgEA3QwAIYgGAQDdDAAhiQYBAN4MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIREHAADgDAAgCQAA5wwAIA0AAOEMACARAADiDAAgIgAA5gwAICQAAOMMACBLAADkDAAgTAAA5QwAIIUGAQDdDAAhhgYBAN0MACGHBgEA3QwAIYgGAQDdDAAhiQYBAN4MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIREHAACxDgAgCQAAuA4AIA0AALIOACARAACzDgAgIgAAtw4AICQAALQOACBLAAC1DgAgTAAAtg4AIIUGAQAAAAGGBgEAAAABhwYBAAAAAYgGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAQYHAADwGAAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAZUHAAAA4QcCAgAAAAEAIGYAAO8YACADAAAAAQAgZgAA7xgAIGcAAO0YACABXwAAzRkAMAIAAAABACBfAADtGAAgAgAAAK8UACBfAADsGAAgBYUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhlQcAALEU4QciBgcAAO4YACCFBgEA3QwAIYoGAQDdDAAhjQZAAN8MACGOBkAA3wwAIZUHAACxFOEHIgVmAADIGQAgZwAAyxkAIOsHAADJGQAg7AcAAMoZACDxBwAA_gQAIAYHAADwGAAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAZUHAAAA4QcCA2YAAMgZACDrBwAAyRkAIPEHAAD-BAAgDIUGAQAAAAGNBkAAAAABjgZAAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAcwHAQAAAAHNBwEAAAABzgdAAAAAAc8HQAAAAAHQBwEAAAAB0QcBAAAAAQIAAAAJACBmAAD8GAAgAwAAAAkAIGYAAPwYACBnAAD7GAAgAV8AAMcZADARAwAA1woAIIIGAADXDAAwgwYAAAcAEIQGAADXDAAwhQYBAAAAAYwGAQDSCgAhjQZAANYKACGOBkAA1goAIckHAQDSCgAhygcBANIKACHLBwEA0woAIcwHAQDTCgAhzQcBANMKACHOB0AA_gsAIc8HQAD-CwAh0AcBANMKACHRBwEA0woAIQIAAAAJACBfAAD7GAAgAgAAAPkYACBfAAD6GAAgEIIGAAD4GAAwgwYAAPkYABCEBgAA-BgAMIUGAQDSCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAhyQcBANIKACHKBwEA0goAIcsHAQDTCgAhzAcBANMKACHNBwEA0woAIc4HQAD-CwAhzwdAAP4LACHQBwEA0woAIdEHAQDTCgAhEIIGAAD4GAAwgwYAAPkYABCEBgAA-BgAMIUGAQDSCgAhjAYBANIKACGNBkAA1goAIY4GQADWCgAhyQcBANIKACHKBwEA0goAIcsHAQDTCgAhzAcBANMKACHNBwEA0woAIc4HQAD-CwAhzwdAAP4LACHQBwEA0woAIdEHAQDTCgAhDIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIckHAQDdDAAhygcBAN0MACHLBwEA3gwAIcwHAQDeDAAhzQcBAN4MACHOB0AA9QwAIc8HQAD1DAAh0AcBAN4MACHRBwEA3gwAIQyFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHJBwEA3QwAIcoHAQDdDAAhywcBAN4MACHMBwEA3gwAIc0HAQDeDAAhzgdAAPUMACHPB0AA9QwAIdAHAQDeDAAh0QcBAN4MACEMhQYBAAAAAY0GQAAAAAGOBkAAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABzAcBAAAAAc0HAQAAAAHOB0AAAAABzwdAAAAAAdAHAQAAAAHRBwEAAAABB4UGAQAAAAGNBkAAAAABjgZAAAAAAcYHQAAAAAHSBwEAAAAB0wcBAAAAAdQHAQAAAAECAAAABQAgZgAAiBkAIAMAAAAFACBmAACIGQAgZwAAhxkAIAFfAADGGQAwDAMAANcKACCCBgAA2AwAMIMGAAADABCEBgAA2AwAMIUGAQAAAAGMBgEA0goAIY0GQADWCgAhjgZAANYKACHGB0AA1goAIdIHAQAAAAHTBwEA0woAIdQHAQDTCgAhAgAAAAUAIF8AAIcZACACAAAAhRkAIF8AAIYZACALggYAAIQZADCDBgAAhRkAEIQGAACEGQAwhQYBANIKACGMBgEA0goAIY0GQADWCgAhjgZAANYKACHGB0AA1goAIdIHAQDSCgAh0wcBANMKACHUBwEA0woAIQuCBgAAhBkAMIMGAACFGQAQhAYAAIQZADCFBgEA0goAIYwGAQDSCgAhjQZAANYKACGOBkAA1goAIcYHQADWCgAh0gcBANIKACHTBwEA0woAIdQHAQDTCgAhB4UGAQDdDAAhjQZAAN8MACGOBkAA3wwAIcYHQADfDAAh0gcBAN0MACHTBwEA3gwAIdQHAQDeDAAhB4UGAQDdDAAhjQZAAN8MACGOBkAA3wwAIcYHQADfDAAh0gcBAN0MACHTBwEA3gwAIdQHAQDeDAAhB4UGAQAAAAGNBkAAAAABjgZAAAAAAcYHQAAAAAHSBwEAAAAB0wcBAAAAAdQHAQAAAAEEZgAA_RgAMOsHAAD-GAAw7QcAAIAZACDxBwAAgRkAMARmAADxGAAw6wcAAPIYADDtBwAA9BgAIPEHAAD1GAAwBGYAAOYYADDrBwAA5xgAMO0HAADpGAAg8QcAAKsUADAEZgAA3RgAMOsHAADeGAAw7QcAAOAYACDxBwAAnxQAMARmAADUGAAw6wcAANUYADDtBwAA1xgAIPEHAACTFAAwBGYAAMsYADDrBwAAzBgAMO0HAADOGAAg8QcAAPUTADAEZgAAwhgAMOsHAADDGAAw7QcAAMUYACDxBwAA9RMAMARmAAC5GAAw6wcAALoYADDtBwAAvBgAIPEHAACbDQAwBGYAALAYADDrBwAAsRgAMO0HAACzGAAg8QcAAJsNADADZgAAqxgAIOsHAACsGAAg8QcAAJAKACAEZgAAohgAMOsHAACjGAAw7QcAAKUYACDxBwAAmw8AMARmAACZGAAw6wcAAJoYADDtBwAAnBgAIPEHAACbDwAwA2YAAJQYACDrBwAAlRgAIPEHAACyCAAgBGYAAIgYADDrBwAAiRgAMO0HAACLGAAg8QcAAIwYADAEZgAA_xcAMOsHAACAGAAw7QcAAIIYACDxBwAA7QwAMARmAAD2FwAw6wcAAPcXADDtBwAA-RcAIPEHAADtDAAwBGYAAO0XADDrBwAA7hcAMO0HAADwFwAg8QcAAPsSADAEZgAA5BcAMOsHAADlFwAw7QcAAOcXACDxBwAA-xIAMARmAADbFwAw6wcAANwXADDtBwAA3hcAIPEHAACHEwAwBGYAANIXADDrBwAA0xcAMO0HAADVFwAg8QcAAIQSADAAAAIzAADEDgAgngYAANkMACABFwAAxA4AIAAAAAAABWYAAMEZACBnAADEGQAg6wcAAMIZACDsBwAAwxkAIPEHAAAoACADZgAAwRkAIOsHAADCGQAg8QcAACgAIAAAAAQHAADfEQAgQwAAxA4AIEUAAKwZACBGAACiGQAgABcHAADfEQAgPAAAxA4AID0AAMQOACA_AACIFwAgigYAANkMACC_BgAA2QwAIOQGAADZDAAgpgcAANkMACCpBwAA2QwAIKsHAADZDAAgrAcAANkMACCtBwAA2QwAIK4HAADZDAAgsAcAANkMACCyBwAA2QwAILMHAADZDAAgtAcAANkMACC1BwAA2QwAILYHAADZDAAgtwcAANkMACC4BwAA2QwAILkHAADZDAAguwcAANkMACANBwAA3xEAIAkAALAZACAKAAC-GQAgCwAAiRcAIA4AALcZACAPAAC4GQAgEAAArxkAIBkAALMZACAbAACyGQAgLAAAvBkAIC0AAL0ZACCLBgAA2QwAIPYGAADZDAAgCgMAAMQOACAHAADfEQAgCQAAsBkAIA0AAOIQACARAACBFwAgIgAAjBcAICQAAIMXACBLAADREQAgTAAAhRcAIIkGAADZDAAgFQgAAL8ZACAMAADgEAAgDQAA4hAAIBEAAIEXACAcAADkEAAgJQAA4RAAICcAAOMQACAqAACJFwAgLgAA-hYAIC8AAPsWACAwAAD9FgAgMQAA_xYAIDIAAIAXACA0AADREQAgNQAAgxcAIDYAAIQXACA3AACFFwAgOAAAjBcAIOQGAADZDAAg9QYAANkMACCpBwAA2QwAIAUUAADREQAgiwYAANkMACDyBgAA2QwAIPUGAADZDAAg9gYAANkMACAFDAAA4BAAIA0AAOIQACAcAADkEAAgJQAA4RAAICcAAOMQACAKAwAAxA4AIAcAAN8RACAJAACwGQAgDQAA4hAAIBMAAIQXACAaAADAEQAgHAAA5BAAICIAAIwXACCJBgAA2QwAIIsGAADZDAAgBAcAAN8RACAJAACwGQAgGwAAshkAIBwAAOQQACAFFAAAwBEAIIsGAADZDAAg8gYAANkMACD1BgAA2QwAIPYGAADZDAAgCAcAAN8RACAJAACwGQAgDgAAtxkAIBAAAK8ZACAjAACEFwAgiwYAANkMACC3BgAA2QwAILoGAADZDAAgCwcAAN8RACAJAACwGQAgDQAA4hAAIBEAAIEXACAbAACyGQAgJAAAgxcAICYAALkZACCLBgAA2QwAIOQGAADZDAAg5QYAANkMACDnBgAA2QwAIAgHAADfEQAgCQAAsBkAIAoAAL4ZACANAADiEAAgEQAAgRcAIOQGAADZDAAg8AYAANkMACD2BgAA2QwAIAUHAADfEQAgCQAAsBkAICUAAOEQACCLBgAA2QwAIOQGAADZDAAgCAcAAN8RACAJAACwGQAgCwAAiRcAIBsAALIZACCKBgAA2QwAIIsGAADZDAAg5AYAANkMACDmBgAA2QwAIAMHAADfEQAgKgAAiRcAIN4GAADZDAAgABIHAADfEQAgCQAAsBkAIBAAAK8ZACApAACuGQAgiwYAANkMACDEBgAA2QwAIMUGAADZDAAgxgYAANkMACDHBgAA2QwAIMgGAADZDAAgyQYAANkMACDKBgAA2QwAIMsGAADZDAAgzAYAANkMACDNBgAA2QwAIM4GAADZDAAgzwYAANkMACDQBgAA2QwAIAkHAADfEQAgCQAAsBkAIA0AAOIQACAPAAD9FgAg5AYAANkMACDuBgAA2QwAIO8GAADZDAAg8AYAANkMACDxBgAA2QwAIAUHAADfEQAgOQAAwBkAIIoGAADZDAAg5AYAANkMACCpBwAA2QwAIAAWBwAAsA4AIAkAAK0OACAKAACuDgAgCwAApw4AIA4AAKwOACAPAACqDgAgEAAAvQ8AIBkAAKsOACAbAACvDgAgLQAAqQ4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQIAAAAoACBmAADBGQAgAwAAACYAIGYAAMEZACBnAADFGQAgGAAAACYAIAcAAP0NACAJAAD6DQAgCgAA-w0AIAsAAPQNACAOAAD5DQAgDwAA9w0AIBAAALsPACAZAAD4DQAgGwAA_A0AIC0AAPYNACBfAADFGQAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrgYBAN0MACGvBgEA3QwAIbEGAQDdDAAh5gYBAN0MACH2BgEA3gwAIb0HQADfDAAhFgcAAP0NACAJAAD6DQAgCgAA-w0AIAsAAPQNACAOAAD5DQAgDwAA9w0AIBAAALsPACAZAAD4DQAgGwAA_A0AIC0AAPYNACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAhrQYBAN0MACGuBgEA3QwAIa8GAQDdDAAhsQYBAN0MACHmBgEA3QwAIfYGAQDeDAAhvQdAAN8MACEHhQYBAAAAAY0GQAAAAAGOBkAAAAABxgdAAAAAAdIHAQAAAAHTBwEAAAAB1AcBAAAAAQyFBgEAAAABjQZAAAAAAY4GQAAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAHMBwEAAAABzQcBAAAAAc4HQAAAAAHPB0AAAAAB0AcBAAAAAdEHAQAAAAEiDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEAAAOkWACBBAADwFgAgQgAA8RYAIEcAAPUWACBIAAD2FgAgSQAA9xYAIEoAAPgWACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAA_gQAIGYAAMgZACADAAAAFgAgZgAAyBkAIGcAAMwZACAkAAAAFgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBIAADiEgAgSQAA4xIAIEoAAOQSACBfAADMGQAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuQYAAK8Sqwcj3gYBAN0MACHkBgEA3gwAIakHAQDeDAAhrAcBAN4MACEiDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBIAADiEgAgSQAA4xIAIEoAAOQSACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAIQWFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABlQcAAADhBwIJhQYBAAAAAYYGAQAAAAGHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABB4UGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAEahQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAAuwcCvwZAAAAAAeQGAQAAAAGmBwEAAAABqAcBAAAAAakHAQAAAAGrBwAAAKsHA6wHAQAAAAGtBwAAANMGA64HEAAAAAGvBwEAAAABsAcCAAAAAbEHAAAA-gYCsgcBAAAAAbMHAQAAAAG0BwEAAAABtQcBAAAAAbYHAQAAAAG3BwEAAAABuAeAAAAAAbkHQAAAAAG7BwEAAAABGoUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAALsHAr8GQAAAAAHkBgEAAAABpwcBAAAAAagHAQAAAAGpBwEAAAABqwcAAACrBwOsBwEAAAABrQcAAADTBgOuBxAAAAABrwcBAAAAAbAHAgAAAAGxBwAAAPoGArIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwcBAAAAAbgHgAAAAAG5B0AAAAABuwcBAAAAAQ2FBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAG7BgEAAAABvQYAAAC9BgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABwgYBAAAAAQ2FBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAZoGAQAAAAGvBgEAAAABuwYBAAAAAb0GAAAAvQYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAQuFBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABuwYBAAAAAb0GAAAA3AYCvgYBAAAAAb8GQAAAAAHABkAAAAABwQYBAAAAAcIGAQAAAAELhQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_BkAAAAABwAZAAAAAAcEGAQAAAAHcBgEAAAABBYUGAQAAAAGNBkAAAAABjgZAAAAAAcUHAQAAAAHGB0AAAAABD4UGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABwgYBAAAAAZkHAAAAmQcCmwcBAAAAAZwHAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABD4UGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_BkAAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABCYUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAKUHAr8GQAAAAAGjBwAAAKMHAqUHAQAAAAGmBwEAAAABCYUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAKUHAr8GQAAAAAGdBwEAAAABowcAAACjBwKlBwEAAAABB4UGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZcHAAAAlQcCA4UGAQAAAAGSBwEAAAABkwdAAAAAASIFAACKGQAgBgAAixkAIBAAAIwZACAZAACNGQAgNAAAkBkAIEAAAI4ZACBNAACPGQAgTgAAkRkAIE8AAJIZACBQAACTGQAgUQAAlBkAIFIAAJUZACBTAACWGQAgVAAAlxkAIFUAAJgZACBWAACZGQAgVwAAmhkAIFgAAJsZACBZAACcGQAghQYBAAAAAYkGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAGVBwEAAAAB1QcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAABAgAAAPsCACBmAADdGQAgAwAAAFEAIGYAAN0ZACBnAADhGQAgJAAAAFEAIAUAAL8XACAGAADAFwAgEAAAwRcAIBkAAMIXACA0AADFFwAgQAAAwxcAIE0AAMQXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACBfAADhGQAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgUAAL8XACAGAADAFwAgEAAAwRcAIBkAAMIXACA0AADFFwAgQAAAwxcAIE0AAMQXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEiBAAAiRkAIAYAAIsZACAQAACMGQAgGQAAjRkAIDQAAJAZACBAAACOGQAgTQAAjxkAIE4AAJEZACBPAACSGQAgUAAAkxkAIFEAAJQZACBSAACVGQAgUwAAlhkAIFQAAJcZACBVAACYGQAgVgAAmRkAIFcAAJoZACBYAACbGQAgWQAAnBkAIIUGAQAAAAGJBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAABlQcBAAAAAdUHAQAAAAHWByAAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAQIAAAD7AgAgZgAA4hkAIAMAAABRACBmAADiGQAgZwAA5hkAICQAAABRACAEAAC-FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBWAADOFwAgVwAAzxcAIFgAANAXACBZAADRFwAgXwAA5hkAIIUGAQDdDAAhiQYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACGVBwEA3QwAIdUHAQDdDAAh1gcgAL8OACHXBwEA3gwAIdgHAQDeDAAh2QcBAN4MACHaBwEA3gwAIdsHAQDeDAAh3AcBAN4MACHdBwEA3QwAISIEAAC-FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBWAADOFwAgVwAAzxcAIFgAANAXACBZAADRFwAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgQAAIkZACAFAACKGQAgBgAAixkAIBAAAIwZACAZAACNGQAgNAAAkBkAIEAAAI4ZACBNAACPGQAgTgAAkRkAIE8AAJIZACBQAACTGQAgUQAAlBkAIFIAAJUZACBUAACXGQAgVQAAmBkAIFYAAJkZACBXAACaGQAgWAAAmxkAIFkAAJwZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAECAAAA-wIAIGYAAOcZACADAAAAUQAgZgAA5xkAIGcAAOsZACAkAAAAUQAgBAAAvhcAIAUAAL8XACAGAADAFwAgEAAAwRcAIBkAAMIXACA0AADFFwAgQAAAwxcAIE0AAMQXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFQAAMwXACBVAADNFwAgVgAAzhcAIFcAAM8XACBYAADQFwAgWQAA0RcAIF8AAOsZACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEiBAAAvhcAIAUAAL8XACAGAADAFwAgEAAAwRcAIBkAAMIXACA0AADFFwAgQAAAwxcAIE0AAMQXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFQAAMwXACBVAADNFwAgVgAAzhcAIFcAAM8XACBYAADQFwAgWQAA0RcAIIUGAQDdDAAhiQYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACGVBwEA3QwAIdUHAQDdDAAh1gcgAL8OACHXBwEA3gwAIdgHAQDeDAAh2QcBAN4MACHaBwEA3gwAIdsHAQDeDAAh3AcBAN4MACHdBwEA3QwAISIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA_AADyFgAgQAAA6RYAIEEAAPAWACBCAADxFgAgRwAA9RYAIEgAAPYWACBJAAD3FgAgSgAA-BYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAA7BkAIAMAAAAWACBmAADsGQAgZwAA8BkAICQAAAAWACAGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AAPAZACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhCAcAAJEXACCFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB5AYBAAAAAakHAQAAAAG8BwEAAAABAgAAABQAIGYAAPEZACADAAAAEgAgZgAA8RkAIGcAAPUZACAKAAAAEgAgBwAAkBcAIF8AAPUZACCFBgEA3QwAIYoGAQDeDAAhjQZAAN8MACGOBkAA3wwAIeQGAQDeDAAhqQcBAN4MACG8BwEA3QwAIQgHAACQFwAghQYBAN0MACGKBgEA3gwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIakHAQDeDAAhvAcBAN0MACEiBgAA5BYAIAwAAPMWACANAADnFgAgEQAA6BYAIBwAAO8WACAlAADiFgAgJwAA7hYAICoAAPQWACAuAADfFgAgLwAA4BYAIDAAAOMWACAxAADlFgAgMgAA5hYAIDQAAOoWACA1AADrFgAgNgAA7BYAIDcAAO0WACA7AADhFgAgPwAA8hYAIEAAAOkWACBBAADwFgAgQgAA8RYAIEcAAPUWACBIAAD2FgAgSQAA9xYAIEoAAPgWACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAA_gQAIGYAAPYZACADAAAAFgAgZgAA9hkAIGcAAPoZACAkAAAAFgAgBgAA0BIAIAwAAN8SACANAADTEgAgEQAA1BIAIBwAANsSACAlAADOEgAgJwAA2hIAICoAAOASACAuAADLEgAgLwAAzBIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDcAANkSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBIAADiEgAgSQAA4xIAIEoAAOQSACBfAAD6GQAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuQYAAK8Sqwcj3gYBAN0MACHkBgEA3gwAIakHAQDeDAAhrAcBAN4MACEiBgAA0BIAIAwAAN8SACANAADTEgAgEQAA1BIAIBwAANsSACAlAADOEgAgJwAA2hIAICoAAOASACAuAADLEgAgLwAAzBIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDcAANkSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBIAADiEgAgSQAA4xIAIEoAAOQSACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAIQqFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABtgYBAAAAAeQGAQAAAAHuBgEAAAAB7wZAAAAAAfAGCAAAAAHxBggAAAABIgYAAOQWACAMAADzFgAgDQAA5xYAIBEAAOgWACAcAADvFgAgJQAA4hYAICcAAO4WACAqAAD0FgAgLgAA3xYAIDAAAOMWACAxAADlFgAgMgAA5hYAIDQAAOoWACA1AADrFgAgNgAA7BYAIDcAAO0WACA6AADeFgAgOwAA4RYAID8AAPIWACBAAADpFgAgQQAA8BYAIEIAAPEWACBHAAD1FgAgSAAA9hYAIEkAAPcWACBKAAD4FgAghQYBAAAAAY0GQAAAAAGOBkAAAAABuQYAAACrBwPeBgEAAAAB5AYBAAAAAakHAQAAAAGsBwEAAAABAgAAAP4EACBmAAD8GQAgAwAAABYAIGYAAPwZACBnAACAGgAgJAAAABYAIAYAANASACAMAADfEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDcAANkSACA6AADKEgAgOwAAzRIAID8AAN4SACBAAADVEgAgQQAA3BIAIEIAAN0SACBHAADhEgAgSAAA4hIAIEkAAOMSACBKAADkEgAgXwAAgBoAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhIgYAANASACAMAADfEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDcAANkSACA6AADKEgAgOwAAzRIAID8AAN4SACBAAADVEgAgQQAA3BIAIEIAAN0SACBHAADhEgAgSAAA4hIAIEkAAOMSACBKAADkEgAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuQYAAK8Sqwcj3gYBAN0MACHkBgEA3gwAIakHAQDeDAAhrAcBAN4MACEGhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAHkBgEAAAABCYUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB8AYCAAAAAfYGAQAAAAG-BwEAAAABvwcBAAAAAQmFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHlBgIAAAAB5gYBAAAAAecGAQAAAAEJhQYBAAAAAYYGAQAAAAGHBgEAAAABiAYBAAAAAYkGAQAAAAGKBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAABB4UGAQAAAAGJBgEAAAABigYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAELhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABrwYBAAAAAbEGAQAAAAHmBgEAAAAB9gYBAAAAAb0HQAAAAAEHhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABrwYBAAAAAQ2FBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABmgYBAAAAAa8GAQAAAAG7BgEAAAABvQYAAAC9BgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABwgYBAAAAAQqFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa8GAQAAAAG2BgEAAAABtwYBAAAAAbkGAAAAuQYCugZAAAAAAQqFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABsAYBAAAAAbEGAQAAAAGyBgEAAAABswYBAAAAAbQGAQAAAAG1BkAAAAABE4UGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABwwYBAAAAAcQGCAAAAAHFBggAAAABxgYIAAAAAccGCAAAAAHIBggAAAAByQYIAAAAAcoGCAAAAAHLBggAAAABzAYIAAAAAc0GCAAAAAHOBggAAAABzwYIAAAAAdAGCAAAAAEJhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAdYGAQAAAAHmBgEAAAABiAcgAAAAAZAHEAAAAAGRBxAAAAABFoUGAQAAAAGKBgEAAAABjQZAAAAAAY4GQAAAAAGxBgEAAAABvQYAAACOBwLVBhAAAAAB1gYBAAAAAdcGAgAAAAHmBgEAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAAQqFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADrBgLeBgEAAAAB5AYBAAAAAeYGAQAAAAHoBgEAAAAB6QYBAAAAAQqFBgEAAAABigYBAAAAAY0GQAAAAAGOBkAAAAABwwYBAAAAAd4GAQAAAAHkBgEAAAAB6wYBAAAAAewGAQAAAAHtBgEAAAABD4UGAQAAAAGNBkAAAAABjgZAAAAAAa8GAQAAAAGxBgEAAAABvQYAAACbBwK_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-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAARGFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAPoGAtMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-AYBAAAAAfoGAQAAAAH7BgEAAAAB_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABC4UGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA1QYC0QYBAAAAAdMGAAAA0wYC1QYQAAAAAdYGAQAAAAHXBgIAAAAB2AZAAAAAAdkGQAAAAAEKhQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA6wYC3gYBAAAAAeQGAQAAAAHmBgEAAAAB6AYBAAAAAekGAQAAAAEKhQYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAcMGAQAAAAHeBgEAAAAB5AYBAAAAAesGAQAAAAHsBgEAAAAB7QYBAAAAAQeFBgEAAAABjQZAAAAAAY4GQAAAAAG2BgEAAAABtwYBAAAAAZYHAQAAAAGXBwAAAJUHAgmFBgEAAAABjQZAAAAAAY4GQAAAAAG9BgAAAKUHAr8GQAAAAAGdBwEAAAABowcAAACjBwKlBwEAAAABpgcBAAAAAQ-FBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABsQYBAAAAAb0GAAAAmwcCvwZAAAAAAcIGAQAAAAGZBwAAAJkHApwHAQAAAAGdBwEAAAABngcBAAAAAZ8HAQAAAAGgBwEAAAABoQdAAAAAAQ-FBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABsQYBAAAAAb0GAAAAmwcCvwZAAAAAAcIGAQAAAAGZBwAAAJkHApsHAQAAAAGdBwEAAAABngcBAAAAAZ8HAQAAAAGgBwEAAAABoQdAAAAAASIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEEAAPAWACBCAADxFgAgRwAA9RYAIEgAAPYWACBJAAD3FgAgSgAA-BYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAAvRoAICIEAACJGQAgBQAAihkAIAYAAIsZACAQAACMGQAgGQAAjRkAIDQAAJAZACBAAACOGQAgTgAAkRkAIE8AAJIZACBQAACTGQAgUQAAlBkAIFIAAJUZACBTAACWGQAgVAAAlxkAIFUAAJgZACBWAACZGQAgVwAAmhkAIFgAAJsZACBZAACcGQAghQYBAAAAAYkGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAGVBwEAAAAB1QcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAABAgAAAPsCACBmAAC_GgAgIgQAAIkZACAFAACKGQAgBgAAixkAIBAAAIwZACAZAACNGQAgNAAAkBkAIE0AAI8ZACBOAACRGQAgTwAAkhkAIFAAAJMZACBRAACUGQAgUgAAlRkAIFMAAJYZACBUAACXGQAgVQAAmBkAIFYAAJkZACBXAACaGQAgWAAAmxkAIFkAAJwZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAECAAAA-wIAIGYAAMEaACALhQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAb0GAAAA1QYC0wYAAADTBgLVBhAAAAAB1gYBAAAAAdcGAgAAAAHYBkAAAAAB2QZAAAAAAQMAAAAWACBmAAC9GgAgZwAAxhoAICQAAAAWACAGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AAMYaACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhAwAAAFEAIGYAAL8aACBnAADJGgAgJAAAAFEAIAQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACBfAADJGgAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEDAAAAUQAgZgAAwRoAIGcAAMwaACAkAAAAUQAgBAAAvhcAIAUAAL8XACAGAADAFwAgEAAAwRcAIBkAAMIXACA0AADFFwAgTQAAxBcAIE4AAMYXACBPAADHFwAgUAAAyBcAIFEAAMkXACBSAADKFwAgUwAAyxcAIFQAAMwXACBVAADNFwAgVgAAzhcAIFcAAM8XACBYAADQFwAgWQAA0RcAIF8AAMwaACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEiBAAAvhcAIAUAAL8XACAGAADAFwAgEAAAwRcAIBkAAMIXACA0AADFFwAgTQAAxBcAIE4AAMYXACBPAADHFwAgUAAAyBcAIFEAAMkXACBSAADKFwAgUwAAyxcAIFQAAMwXACBVAADNFwAgVgAAzhcAIFcAAM8XACBYAADQFwAgWQAA0RcAIIUGAQDdDAAhiQYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACGVBwEA3QwAIdUHAQDdDAAh1gcgAL8OACHXBwEA3gwAIdgHAQDeDAAh2QcBAN4MACHaBwEA3gwAIdsHAQDeDAAh3AcBAN4MACHdBwEA3QwAISIEAACJGQAgBQAAihkAIAYAAIsZACAQAACMGQAgGQAAjRkAIDQAAJAZACBAAACOGQAgTQAAjxkAIE4AAJEZACBPAACSGQAgUAAAkxkAIFEAAJQZACBSAACVGQAgUwAAlhkAIFQAAJcZACBVAACYGQAgVgAAmRkAIFgAAJsZACBZAACcGQAghQYBAAAAAYkGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAGVBwEAAAAB1QcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAABAgAAAPsCACBmAADNGgAgIgYAAOQWACAMAADzFgAgDQAA5xYAIBEAAOgWACAcAADvFgAgJQAA4hYAICcAAO4WACAqAAD0FgAgLgAA3xYAIC8AAOAWACAwAADjFgAgMQAA5RYAIDIAAOYWACA0AADqFgAgNQAA6xYAIDYAAOwWACA3AADtFgAgOgAA3hYAIDsAAOEWACA_AADyFgAgQAAA6RYAIEEAAPAWACBCAADxFgAgRwAA9RYAIEkAAPcWACBKAAD4FgAghQYBAAAAAY0GQAAAAAGOBkAAAAABuQYAAACrBwPeBgEAAAAB5AYBAAAAAakHAQAAAAGsBwEAAAABAgAAAP4EACBmAADPGgAgIgQAAIkZACAFAACKGQAgBgAAixkAIBAAAIwZACAZAACNGQAgNAAAkBkAIEAAAI4ZACBNAACPGQAgTgAAkRkAIE8AAJIZACBQAACTGQAgUQAAlBkAIFIAAJUZACBTAACWGQAgVAAAlxkAIFUAAJgZACBXAACaGQAgWAAAmxkAIFkAAJwZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAECAAAA-wIAIGYAANEaACADAAAAUQAgZgAAzRoAIGcAANUaACAkAAAAUQAgBAAAvhcAIAUAAL8XACAGAADAFwAgEAAAwRcAIBkAAMIXACA0AADFFwAgQAAAwxcAIE0AAMQXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBYAADQFwAgWQAA0RcAIF8AANUaACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEiBAAAvhcAIAUAAL8XACAGAADAFwAgEAAAwRcAIBkAAMIXACA0AADFFwAgQAAAwxcAIE0AAMQXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBYAADQFwAgWQAA0RcAIIUGAQDdDAAhiQYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACGVBwEA3QwAIdUHAQDdDAAh1gcgAL8OACHXBwEA3gwAIdgHAQDeDAAh2QcBAN4MACHaBwEA3gwAIdsHAQDeDAAh3AcBAN4MACHdBwEA3QwAIQMAAAAWACBmAADPGgAgZwAA2BoAICQAAAAWACAGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBJAADjEgAgSgAA5BIAIF8AANgaACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhAwAAAFEAIGYAANEaACBnAADbGgAgJAAAAFEAIAQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBXAADPFwAgWAAA0BcAIFkAANEXACBfAADbGgAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBXAADPFwAgWAAA0BcAIFkAANEXACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEiBAAAiRkAIAUAAIoZACAGAACLGQAgEAAAjBkAIBkAAI0ZACA0AACQGQAgQAAAjhkAIE0AAI8ZACBOAACRGQAgTwAAkhkAIFAAAJMZACBRAACUGQAgUgAAlRkAIFMAAJYZACBUAACXGQAgVQAAmBkAIFYAAJkZACBXAACaGQAgWQAAnBkAIIUGAQAAAAGJBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAABlQcBAAAAAdUHAQAAAAHWByAAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAQIAAAD7AgAgZgAA3BoAICIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEAAAOkWACBBAADwFgAgQgAA8RYAIEgAAPYWACBJAAD3FgAgSgAA-BYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAA3hoAIAOFBgEAAAABjQZAAAAAAZUHAAAAlQcCA4UGAQAAAAGMBgEAAAABkwdAAAAAAQMAAABRACBmAADcGgAgZwAA5BoAICQAAABRACAEAAC-FwAgBQAAvxcAIAYAAMAXACAQAADBFwAgGQAAwhcAIDQAAMUXACBAAADDFwAgTQAAxBcAIE4AAMYXACBPAADHFwAgUAAAyBcAIFEAAMkXACBSAADKFwAgUwAAyxcAIFQAAMwXACBVAADNFwAgVgAAzhcAIFcAAM8XACBZAADRFwAgXwAA5BoAIIUGAQDdDAAhiQYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACGVBwEA3QwAIdUHAQDdDAAh1gcgAL8OACHXBwEA3gwAIdgHAQDeDAAh2QcBAN4MACHaBwEA3gwAIdsHAQDeDAAh3AcBAN4MACHdBwEA3QwAISIEAAC-FwAgBQAAvxcAIAYAAMAXACAQAADBFwAgGQAAwhcAIDQAAMUXACBAAADDFwAgTQAAxBcAIE4AAMYXACBPAADHFwAgUAAAyBcAIFEAAMkXACBSAADKFwAgUwAAyxcAIFQAAMwXACBVAADNFwAgVgAAzhcAIFcAAM8XACBZAADRFwAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhAwAAABYAIGYAAN4aACBnAADnGgAgJAAAABYAIAYAANASACAMAADfEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgSAAA4hIAIEkAAOMSACBKAADkEgAgXwAA5xoAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhIgYAANASACAMAADfEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgSAAA4hIAIEkAAOMSACBKAADkEgAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuQYAAK8Sqwcj3gYBAN0MACHkBgEA3gwAIakHAQDeDAAhrAcBAN4MACELBwAAmBIAIEMAAJkSACBGAACbEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAG3BgEAAAABlgcBAAAAAZcHAAAAlQcCAgAAAPABACBmAADoGgAgAwAAAO4BACBmAADoGgAgZwAA7BoAIA0AAADuAQAgBwAA_BEAIEMAAP0RACBGAAD_EQAgXwAA7BoAIIUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACG3BgEA3QwAIZYHAQDdDAAhlwcAAPYRlQciCwcAAPwRACBDAAD9EQAgRgAA_xEAIIUGAQDdDAAhigYBAN0MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACG3BgEA3QwAIZYHAQDdDAAhlwcAAPYRlQciIgQAAIkZACAFAACKGQAgBgAAixkAIBAAAIwZACAZAACNGQAgNAAAkBkAIEAAAI4ZACBNAACPGQAgTgAAkRkAIE8AAJIZACBQAACTGQAgUQAAlBkAIFIAAJUZACBTAACWGQAgVAAAlxkAIFUAAJgZACBWAACZGQAgVwAAmhkAIFgAAJsZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAECAAAA-wIAIGYAAO0aACALBwAAmBIAIEMAAJkSACBFAACaEgAghQYBAAAAAYoGAQAAAAGNBkAAAAABjgZAAAAAAbYGAQAAAAG3BgEAAAABlgcBAAAAAZcHAAAAlQcCAgAAAPABACBmAADvGgAgAwAAAFEAIGYAAO0aACBnAADzGgAgJAAAAFEAIAQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBWAADOFwAgVwAAzxcAIFgAANAXACBfAADzGgAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBWAADOFwAgVwAAzxcAIFgAANAXACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEDAAAA7gEAIGYAAO8aACBnAAD2GgAgDQAAAO4BACAHAAD8EQAgQwAA_REAIEUAAP4RACBfAAD2GgAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG2BgEA3QwAIbcGAQDdDAAhlgcBAN0MACGXBwAA9hGVByILBwAA_BEAIEMAAP0RACBFAAD-EQAghQYBAN0MACGKBgEA3QwAIY0GQADfDAAhjgZAAN8MACG2BgEA3QwAIbcGAQDdDAAhlgcBAN0MACGXBwAA9hGVByIJDAAA2xAAIA0AAN0QACAcAADfEAAgJQAA3BAAIIUGAQAAAAGKBgEAAAAB3gYBAAAAAd8GQAAAAAHgBkAAAAABAgAAAJoIACBmAAD3GgAgAwAAAC8AIGYAAPcaACBnAAD7GgAgCwAAAC8AIAwAANUPACANAADXDwAgHAAA2Q8AICUAANYPACBfAAD7GgAghQYBAN0MACGKBgEA3QwAId4GAQDdDAAh3wZAAN8MACHgBkAA3wwAIQkMAADVDwAgDQAA1w8AIBwAANkPACAlAADWDwAghQYBAN0MACGKBgEA3QwAId4GAQDdDAAh3wZAAN8MACHgBkAA3wwAISIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEAAAOkWACBCAADxFgAgRwAA9RYAIEgAAPYWACBJAAD3FgAgSgAA-BYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAA_BoAIAMAAAAWACBmAAD8GgAgZwAAgBsAICQAAAAWACAGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AAIAbACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhIgYAAOQWACAMAADzFgAgDQAA5xYAIBEAAOgWACAcAADvFgAgJQAA4hYAICcAAO4WACAqAAD0FgAgLgAA3xYAIC8AAOAWACAwAADjFgAgMQAA5RYAIDIAAOYWACA0AADqFgAgNQAA6xYAIDYAAOwWACA3AADtFgAgOgAA3hYAIDsAAOEWACA_AADyFgAgQAAA6RYAIEEAAPAWACBHAAD1FgAgSAAA9hYAIEkAAPcWACBKAAD4FgAghQYBAAAAAY0GQAAAAAGOBkAAAAABuQYAAACrBwPeBgEAAAAB5AYBAAAAAakHAQAAAAGsBwEAAAABAgAAAP4EACBmAACBGwAgAwAAABYAIGYAAIEbACBnAACFGwAgJAAAABYAIAYAANASACAMAADfEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBHAADhEgAgSAAA4hIAIEkAAOMSACBKAADkEgAgXwAAhRsAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhIgYAANASACAMAADfEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBHAADhEgAgSAAA4hIAIEkAAOMSACBKAADkEgAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuQYAAK8Sqwcj3gYBAN0MACHkBgEA3gwAIakHAQDeDAAhrAcBAN4MACENhQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAGaBgEAAAABrwYBAAAAAbsGAQAAAAG9BgAAAL0GAr4GAQAAAAG_BkAAAAABwAZAAAAAAcIGAQAAAAELhQYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAbsGAQAAAAG9BgAAANwGAr4GAQAAAAG_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_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AAJcbACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_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_A0AICwAAPUNACAtAAD2DQAgXwAAshsAIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAh9gYBAN4MACG9B0AA3wwAIRYHAAD9DQAgCQAA-g0AIAoAAPsNACAOAAD5DQAgDwAA9w0AIBAAALsPACAZAAD4DQAgGwAA_A0AICwAAPUNACAtAAD2DQAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrgYBAN0MACGvBgEA3QwAIbEGAQDdDAAh5gYBAN0MACH2BgEA3gwAIb0HQADfDAAhCoUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABwwYBAAAAAd4GAQAAAAHkBgEAAAAB6wYBAAAAAe0GAQAAAAEDAAAAGAAgZgAAqhsAIGcAALYbACAaAAAAGAAgCAAAlRcAIA0AAKQVACARAAClFQAgHAAAqxUAICUAAKEVACAnAACqFQAgKgAArRUAIC4AAJ4VACAvAACfFQAgMAAAoBUAIDEAAKIVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIDgAAK4VACBfAAC2GwAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACH1BgEA3gwAIakHAQDeDAAhvAcBAN0MACEYCAAAlRcAIA0AAKQVACARAAClFQAgHAAAqxUAICUAAKEVACAnAACqFQAgKgAArRUAIC4AAJ4VACAvAACfFQAgMAAAoBUAIDEAAKIVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIDgAAK4VACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfUGAQDeDAAhqQcBAN4MACG8BwEA3QwAIQMAAAAWACBmAACsGwAgZwAAuRsAICQAAAAWACAGAADQEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AALkbACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDQAA0xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhCoUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABvQYAAADrBgLeBgEAAAAB5AYBAAAAAegGAQAAAAHpBgEAAAABCQcAAMAWACAJAAD5FAAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAAB5AYBAAAAAQIAAACXAQAgZgAAuxsAIBgIAACWFwAgDAAA2RYAIA0AANEWACARAADSFgAgHAAA2BYAICcAANcWACAqAADaFgAgLgAAyxYAIC8AAMwWACAwAADNFgAgMQAAzxYAIDIAANAWACA0AADTFgAgNQAA1BYAIDYAANUWACA3AADWFgAgOAAA2xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGgAgZgAAvRsAICIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICcAAO4WACAqAAD0FgAgLgAA3xYAIC8AAOAWACAwAADjFgAgMQAA5RYAIDIAAOYWACA0AADqFgAgNQAA6xYAIDYAAOwWACA3AADtFgAgOgAA3hYAIDsAAOEWACA_AADyFgAgQAAA6RYAIEEAAPAWACBCAADxFgAgRwAA9RYAIEgAAPYWACBJAAD3FgAgSgAA-BYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAAvxsAIAuFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQeFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa4GAQAAAAGvBgEAAAABCoUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrwYBAAAAAbYGAQAAAAG3BgEAAAABuQYAAAC5BgK6BkAAAAABAwAAAGsAIGYAALsbACBnAADGGwAgCwAAAGsAIAcAAL4WACAJAADtFAAgXwAAxhsAIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAhCQcAAL4WACAJAADtFAAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAh5AYBAN4MACEDAAAAGAAgZgAAvRsAIGcAAMkbACAaAAAAGAAgCAAAlRcAIAwAAKwVACANAACkFQAgEQAApRUAIBwAAKsVACAnAACqFQAgKgAArRUAIC4AAJ4VACAvAACfFQAgMAAAoBUAIDEAAKIVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIDgAAK4VACBfAADJGwAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACH1BgEA3gwAIakHAQDeDAAhvAcBAN0MACEYCAAAlRcAIAwAAKwVACANAACkFQAgEQAApRUAIBwAAKsVACAnAACqFQAgKgAArRUAIC4AAJ4VACAvAACfFQAgMAAAoBUAIDEAAKIVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIDgAAK4VACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfUGAQDeDAAhqQcBAN4MACG8BwEA3QwAIQMAAAAWACBmAAC_GwAgZwAAzBsAICQAAAAWACAGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AAMwbACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhCYUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHlBgIAAAAB5wYBAAAAAQuFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABrwYBAAAAAbEGAQAAAAH2BgEAAAABvQdAAAAAARgIAACWFwAgDAAA2RYAIA0AANEWACARAADSFgAgHAAA2BYAICUAAM4WACAqAADaFgAgLgAAyxYAIC8AAMwWACAwAADNFgAgMQAAzxYAIDIAANAWACA0AADTFgAgNQAA1BYAIDYAANUWACA3AADWFgAgOAAA2xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGgAgZgAAzxsAICIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAqAAD0FgAgLgAA3xYAIC8AAOAWACAwAADjFgAgMQAA5RYAIDIAAOYWACA0AADqFgAgNQAA6xYAIDYAAOwWACA3AADtFgAgOgAA3hYAIDsAAOEWACA_AADyFgAgQAAA6RYAIEEAAPAWACBCAADxFgAgRwAA9RYAIEgAAPYWACBJAAD3FgAgSgAA-BYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAA0RsAIBaFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG9BgAAAI4HAtUGEAAAAAHWBgEAAAAB1wYCAAAAAeYGAQAAAAH6BgEAAAAB-wYBAAAAAfwGAQAAAAH9BgEAAAAB_gYBAAAAAf8GAQAAAAGAB4AAAAABgQdAAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAEDAAAAGAAgZgAAzxsAIGcAANYbACAaAAAAGAAgCAAAlRcAIAwAAKwVACANAACkFQAgEQAApRUAIBwAAKsVACAlAAChFQAgKgAArRUAIC4AAJ4VACAvAACfFQAgMAAAoBUAIDEAAKIVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIDgAAK4VACBfAADWGwAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACH1BgEA3gwAIakHAQDeDAAhvAcBAN0MACEYCAAAlRcAIAwAAKwVACANAACkFQAgEQAApRUAIBwAAKsVACAlAAChFQAgKgAArRUAIC4AAJ4VACAvAACfFQAgMAAAoBUAIDEAAKIVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIDgAAK4VACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfUGAQDeDAAhqQcBAN4MACG8BwEA3QwAIQMAAAAWACBmAADRGwAgZwAA2RsAICQAAAAWACAGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AANkbACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhCYUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB1gYBAAAAAYgHIAAAAAGQBxAAAAABkQcQAAAAAQ8DAADADwAgBwAAvg8AIAkAAL8PACANAADBDwAgEwAAwg8AIBoAAMMPACAiAADFDwAghQYBAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBkAAAAABjgZAAAAAAdoGAQAAAAECAAAAnQEAIGYAANsbACADAAAAUwAgZgAA2xsAIGcAAN8bACARAAAAUwAgAwAA8A4AIAcAAO4OACAJAADvDgAgDQAA8Q4AIBMAAPIOACAaAADzDgAgIgAA9Q4AIF8AAN8bACCFBgEA3QwAIYkGAQDeDAAhigYBAN0MACGLBgEA3gwAIYwGAQDdDAAhjQZAAN8MACGOBkAA3wwAIdoGAQDdDAAhDwMAAPAOACAHAADuDgAgCQAA7w4AIA0AAPEOACATAADyDgAgGgAA8w4AICIAAPUOACCFBgEA3QwAIYkGAQDeDAAhigYBAN0MACGLBgEA3gwAIYwGAQDdDAAhjQZAAN8MACGOBkAA3wwAIdoGAQDdDAAhFoUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABsQYBAAAAAb0GAAAAjgcC1QYQAAAAAdYGAQAAAAHXBgIAAAAB-gYBAAAAAfsGAQAAAAH8BgEAAAAB_QYBAAAAAf4GAQAAAAH_BgEAAAABgAeAAAAAAYEHQAAAAAGKBwEAAAABjAcAAACMBwKOBwEAAAABjwdAAAAAASIEAACJGQAgBQAAihkAIAYAAIsZACAQAACMGQAgGQAAjRkAIDQAAJAZACBAAACOGQAgTQAAjxkAIE4AAJEZACBPAACSGQAgUAAAkxkAIFEAAJQZACBTAACWGQAgVAAAlxkAIFUAAJgZACBWAACZGQAgVwAAmhkAIFgAAJsZACBZAACcGQAghQYBAAAAAYkGAQAAAAGNBkAAAAABjgZAAAAAAd4GAQAAAAGVBwEAAAAB1QcBAAAAAdYHIAAAAAHXBwEAAAAB2AcBAAAAAdkHAQAAAAHaBwEAAAAB2wcBAAAAAdwHAQAAAAHdBwEAAAABAgAAAPsCACBmAADhGwAgAwAAAFEAIGYAAOEbACBnAADlGwAgJAAAAFEAIAQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACBfAADlGwAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEPAwAAwA8AIAcAAL4PACAJAAC_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_BsAIAMAAABRACBmAAD4GwAgZwAAgBwAICQAAABRACAEAAC-FwAgBQAAvxcAIAYAAMAXACAQAADBFwAgGQAAwhcAIDQAAMUXACBAAADDFwAgTQAAxBcAIE4AAMYXACBPAADHFwAgUAAAyBcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBWAADOFwAgVwAAzxcAIFgAANAXACBZAADRFwAgXwAAgBwAIIUGAQDdDAAhiQYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACGVBwEA3QwAIdUHAQDdDAAh1gcgAL8OACHXBwEA3gwAIdgHAQDeDAAh2QcBAN4MACHaBwEA3gwAIdsHAQDeDAAh3AcBAN4MACHdBwEA3QwAISIEAAC-FwAgBQAAvxcAIAYAAMAXACAQAADBFwAgGQAAwhcAIDQAAMUXACBAAADDFwAgTQAAxBcAIE4AAMYXACBPAADHFwAgUAAAyBcAIFIAAMoXACBTAADLFwAgVAAAzBcAIFUAAM0XACBWAADOFwAgVwAAzxcAIFgAANAXACBZAADRFwAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhAwAAAFEAIGYAAPobACBnAACDHAAgJAAAAFEAIAQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACBfAACDHAAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEDAAAAngcAIGYAAPwbACBnAACGHAAgDgAAAJ4HACBfAACGHAAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIbYGAQDdDAAh8gYBAN4MACHzBgEA3QwAIfQGAACzEQAg9QYBAN4MACH2BgEA3gwAIfcGAQDdDAAhDIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACG2BgEA3QwAIfIGAQDeDAAh8wYBAN0MACH0BgAAsxEAIPUGAQDeDAAh9gYBAN4MACH3BgEA3QwAIQuFBgEAAAABjQZAAAAAAY4GQAAAAAG7BgEAAAABvQYAAADcBgK-BgEAAAABvwZAAAAAAcAGQAAAAAHBBgEAAAABwgYBAAAAAdwGAQAAAAENBwAA_Q8AIAkAAP4PACAbAADrEQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHWBgEAAAAB5gYBAAAAAYgHIAAAAAGQBxAAAAABkQcQAAAAAQIAAAB2ACBmAACIHAAgCQwAANsQACANAADdEAAgJQAA3BAAICcAAN4QACCFBgEAAAABigYBAAAAAd4GAQAAAAHfBkAAAAAB4AZAAAAAAQIAAACaCAAgZgAAihwAIBgIAACWFwAgDAAA2RYAIA0AANEWACARAADSFgAgJQAAzhYAICcAANcWACAqAADaFgAgLgAAyxYAIC8AAMwWACAwAADNFgAgMQAAzxYAIDIAANAWACA0AADTFgAgNQAA1BYAIDYAANUWACA3AADWFgAgOAAA2xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGgAgZgAAjBwAICIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgJQAA4hYAICcAAO4WACAqAAD0FgAgLgAA3xYAIC8AAOAWACAwAADjFgAgMQAA5RYAIDIAAOYWACA0AADqFgAgNQAA6xYAIDYAAOwWACA3AADtFgAgOgAA3hYAIDsAAOEWACA_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_AYBAAAAAf0GAQAAAAH-BgEAAAAB_wYBAAAAAYAHgAAAAAGBB0AAAAABigcBAAAAAYwHAAAAjAcCjgcBAAAAAY8HQAAAAAESAwAAuQ4AIAcAALEOACAJAAC4DgAgDQAAsg4AIBEAALMOACAkAAC0DgAgSwAAtQ4AIEwAALYOACCFBgEAAAABhgYBAAAAAYcGAQAAAAGIBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjAYBAAAAAY0GQAAAAAGOBkAAAAABAgAAABAAIGYAAJ0cACADAAAADgAgZgAAnRwAIGcAAKEcACAUAAAADgAgAwAA6AwAIAcAAOAMACAJAADnDAAgDQAA4QwAIBEAAOIMACAkAADjDAAgSwAA5AwAIEwAAOUMACBfAAChHAAghQYBAN0MACGGBgEA3QwAIYcGAQDdDAAhiAYBAN0MACGJBgEA3gwAIYoGAQDdDAAhiwYBAN0MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACESAwAA6AwAIAcAAOAMACAJAADnDAAgDQAA4QwAIBEAAOIMACAkAADjDAAgSwAA5AwAIEwAAOUMACCFBgEA3QwAIYYGAQDdDAAhhwYBAN0MACGIBgEA3QwAIYkGAQDeDAAhigYBAN0MACGLBgEA3QwAIYwGAQDdDAAhjQZAAN8MACGOBkAA3wwAIQ-FBgEAAAABjQZAAAAAAY4GQAAAAAGvBgEAAAABvQYAAACbBwK_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_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_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_gQAIGYAANMcACAiBgAA5BYAIAwAAPMWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEAAAOkWACBBAADwFgAgQgAA8RYAIEcAAPUWACBIAAD2FgAgSQAA9xYAIEoAAPgWACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAA_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_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AAIAdACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIBEAANQSACAcAADbEgAgJQAAzhIAICcAANoSACAqAADgEgAgLgAAyxIAIC8AAMwSACAwAADPEgAgMQAA0RIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhAwAAAC8AIGYAANccACBnAACDHQAgCwAAAC8AIAwAANUPACAcAADZDwAgJQAA1g8AICcAANgPACBfAACDHQAghQYBAN0MACGKBgEA3QwAId4GAQDdDAAh3wZAAN8MACHgBkAA3wwAIQkMAADVDwAgHAAA2Q8AICUAANYPACAnAADYDwAghQYBAN0MACGKBgEA3QwAId4GAQDdDAAh3wZAAN8MACHgBkAA3wwAIQMAAAAdACBmAADZHAAgZwAAhh0AIBAAAAAdACAHAAD7EAAgCQAA_BAAIA8AAPkQACBfAACGHQAghQYBAN0MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbYGAQDdDAAh5AYBAN4MACHuBgEA3gwAIe8GQAD1DAAh8AYIAI4NACHxBggAjg0AIQ4HAAD7EAAgCQAA_BAAIA8AAPkQACCFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAhtgYBAN0MACHkBgEA3gwAIe4GAQDeDAAh7wZAAPUMACHwBggAjg0AIfEGCACODQAhAwAAABgAIGYAANscACBnAACJHQAgGgAAABgAIAgAAJUXACAMAACsFQAgEQAApRUAIBwAAKsVACAlAAChFQAgJwAAqhUAICoAAK0VACAuAACeFQAgLwAAnxUAIDAAAKAVACAxAACiFQAgMgAAoxUAIDQAAKYVACA1AACnFQAgNgAAqBUAIDcAAKkVACA4AACuFQAgXwAAiR0AIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIeQGAQDeDAAh9QYBAN4MACGpBwEA3gwAIbwHAQDdDAAhGAgAAJUXACAMAACsFQAgEQAApRUAIBwAAKsVACAlAAChFQAgJwAAqhUAICoAAK0VACAuAACeFQAgLwAAnxUAIDAAAKAVACAxAACiFQAgMgAAoxUAIDQAAKYVACA1AACnFQAgNgAAqBUAIDcAAKkVACA4AACuFQAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACH1BgEA3gwAIakHAQDeDAAhvAcBAN0MACEDAAAANQAgZgAA3RwAIGcAAIwdACASAAAANQAgBwAAmBAAIAkAAJkQACARAACWEAAgGwAA6hAAICQAAJcQACAmAACaEAAgXwAAjB0AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAh5QYCAJMQACHmBgEA3QwAIecGAQDeDAAhEAcAAJgQACAJAACZEAAgEQAAlhAAIBsAAOoQACAkAACXEAAgJgAAmhAAIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAh5QYCAJMQACHmBgEA3QwAIecGAQDeDAAhAwAAAFMAIGYAAN8cACBnAACPHQAgEQAAAFMAIAMAAPAOACAHAADuDgAgCQAA7w4AIBMAAPIOACAaAADzDgAgHAAA9A4AICIAAPUOACBfAACPHQAghQYBAN0MACGJBgEA3gwAIYoGAQDdDAAhiwYBAN4MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACHaBgEA3QwAIQ8DAADwDgAgBwAA7g4AIAkAAO8OACATAADyDgAgGgAA8w4AIBwAAPQOACAiAAD1DgAghQYBAN0MACGJBgEA3gwAIYoGAQDdDAAhiwYBAN4MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACHaBgEA3QwAIQMAAAAhACBmAADhHAAgZwAAkh0AIBAAAAAhACAHAACREQAgCQAAkhEAIAoAAL4UACARAACUEQAgXwAAkh0AIIUGAQDdDAAhigYBAN0MACGLBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfAGAgCTEAAh9gYBAN4MACG-BwEA3QwAIb8HAQDdDAAhDgcAAJERACAJAACSEQAgCgAAvhQAIBEAAJQRACCFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACHwBgIAkxAAIfYGAQDeDAAhvgcBAN0MACG_BwEA3QwAIQuFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAGuBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAARgIAACWFwAgDAAA2RYAIA0AANEWACAcAADYFgAgJQAAzhYAICcAANcWACAqAADaFgAgLgAAyxYAIC8AAMwWACAwAADNFgAgMQAAzxYAIDIAANAWACA0AADTFgAgNQAA1BYAIDYAANUWACA3AADWFgAgOAAA2xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGgAgZgAAlB0AICIGAADkFgAgDAAA8xYAIA0AAOcWACAcAADvFgAgJQAA4hYAICcAAO4WACAqAAD0FgAgLgAA3xYAIC8AAOAWACAwAADjFgAgMQAA5RYAIDIAAOYWACA0AADqFgAgNQAA6xYAIDYAAOwWACA3AADtFgAgOgAA3hYAIDsAAOEWACA_AADyFgAgQAAA6RYAIEEAAPAWACBCAADxFgAgRwAA9RYAIEgAAPYWACBJAAD3FgAgSgAA-BYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAAlh0AIA4HAACoEQAgCQAAqREAIAoAAMAUACANAACqEQAghQYBAAAAAYoGAQAAAAGLBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB8AYCAAAAAfYGAQAAAAG-BwEAAAABvwcBAAAAAQIAAAAjACBmAACYHQAgEAcAALoQACAJAAC7EAAgDQAAtxAAIBsAAOsQACAkAAC5EAAgJgAAvBAAIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAeQGAQAAAAHlBgIAAAAB5gYBAAAAAecGAQAAAAECAAAANwAgZgAAmh0AIAMAAAAYACBmAACUHQAgZwAAnh0AIBoAAAAYACAIAACVFwAgDAAArBUAIA0AAKQVACAcAACrFQAgJQAAoRUAICcAAKoVACAqAACtFQAgLgAAnhUAIC8AAJ8VACAwAACgFQAgMQAAohUAIDIAAKMVACA0AACmFQAgNQAApxUAIDYAAKgVACA3AACpFQAgOAAArhUAIF8AAJ4dACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfUGAQDeDAAhqQcBAN4MACG8BwEA3QwAIRgIAACVFwAgDAAArBUAIA0AAKQVACAcAACrFQAgJQAAoRUAICcAAKoVACAqAACtFQAgLgAAnhUAIC8AAJ8VACAwAACgFQAgMQAAohUAIDIAAKMVACA0AACmFQAgNQAApxUAIDYAAKgVACA3AACpFQAgOAAArhUAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIeQGAQDeDAAh9QYBAN4MACGpBwEA3gwAIbwHAQDdDAAhAwAAABYAIGYAAJYdACBnAAChHQAgJAAAABYAIAYAANASACAMAADfEgAgDQAA0xIAIBwAANsSACAlAADOEgAgJwAA2hIAICoAAOASACAuAADLEgAgLwAAzBIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDcAANkSACA6AADKEgAgOwAAzRIAID8AAN4SACBAAADVEgAgQQAA3BIAIEIAAN0SACBHAADhEgAgSAAA4hIAIEkAAOMSACBKAADkEgAgXwAAoR0AIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhIgYAANASACAMAADfEgAgDQAA0xIAIBwAANsSACAlAADOEgAgJwAA2hIAICoAAOASACAuAADLEgAgLwAAzBIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDcAANkSACA6AADKEgAgOwAAzRIAID8AAN4SACBAAADVEgAgQQAA3BIAIEIAAN0SACBHAADhEgAgSAAA4hIAIEkAAOMSACBKAADkEgAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuQYAAK8Sqwcj3gYBAN0MACHkBgEA3gwAIakHAQDeDAAhrAcBAN4MACEDAAAAIQAgZgAAmB0AIGcAAKQdACAQAAAAIQAgBwAAkREAIAkAAJIRACAKAAC-FAAgDQAAkxEAIF8AAKQdACCFBgEA3QwAIYoGAQDdDAAhiwYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACHwBgIAkxAAIfYGAQDeDAAhvgcBAN0MACG_BwEA3QwAIQ4HAACREQAgCQAAkhEAIAoAAL4UACANAACTEQAghQYBAN0MACGKBgEA3QwAIYsGAQDdDAAhjQZAAN8MACGOBkAA3wwAIeQGAQDeDAAh8AYCAJMQACH2BgEA3gwAIb4HAQDdDAAhvwcBAN0MACEDAAAANQAgZgAAmh0AIGcAAKcdACASAAAANQAgBwAAmBAAIAkAAJkQACANAACVEAAgGwAA6hAAICQAAJcQACAmAACaEAAgXwAApx0AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAh5QYCAJMQACHmBgEA3QwAIecGAQDeDAAhEAcAAJgQACAJAACZEAAgDQAAlRAAIBsAAOoQACAkAACXEAAgJgAAmhAAIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIeQGAQDeDAAh5QYCAJMQACHmBgEA3QwAIecGAQDeDAAhB4UGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAEYCAAAlhcAIAwAANkWACANAADRFgAgEQAA0hYAIBwAANgWACAlAADOFgAgJwAA1xYAICoAANoWACAuAADLFgAgLwAAzBYAIDAAAM0WACAxAADPFgAgMgAA0BYAIDQAANMWACA2AADVFgAgNwAA1hYAIDgAANsWACCFBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB9QYBAAAAAakHAQAAAAG8BwEAAAABAgAAABoAIGYAAKkdACAiBgAA5BYAIAwAAPMWACANAADnFgAgEQAA6BYAIBwAAO8WACAlAADiFgAgJwAA7hYAICoAAPQWACAuAADfFgAgLwAA4BYAIDAAAOMWACAxAADlFgAgMgAA5hYAIDQAAOoWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEAAAOkWACBBAADwFgAgQgAA8RYAIEcAAPUWACBIAAD2FgAgSQAA9xYAIEoAAPgWACCFBgEAAAABjQZAAAAAAY4GQAAAAAG5BgAAAKsHA94GAQAAAAHkBgEAAAABqQcBAAAAAawHAQAAAAECAAAA_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_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AAMQdACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhAwAAADUAIGYAAK0dACBnAADHHQAgEgAAADUAIAcAAJgQACAJAACZEAAgDQAAlRAAIBEAAJYQACAbAADqEAAgJgAAmhAAIF8AAMcdACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACHkBgEA3gwAIeUGAgCTEAAh5gYBAN0MACHnBgEA3gwAIRAHAACYEAAgCQAAmRAAIA0AAJUQACARAACWEAAgGwAA6hAAICYAAJoQACCFBgEA3QwAIYoGAQDdDAAhiwYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACHkBgEA3gwAIeUGAgCTEAAh5gYBAN0MACHnBgEA3gwAIQqFBgEAAAABigYBAAAAAYsGAQAAAAGNBkAAAAABjgZAAAAAAa0GAQAAAAG2BgEAAAABtwYBAAAAAbkGAAAAuQYCugZAAAAAARgIAACWFwAgDAAA2RYAIA0AANEWACARAADSFgAgHAAA2BYAICUAAM4WACAnAADXFgAgKgAA2hYAIC4AAMsWACAvAADMFgAgMAAAzRYAIDEAAM8WACAyAADQFgAgNQAA1BYAIDYAANUWACA3AADWFgAgOAAA2xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAeQGAQAAAAH1BgEAAAABqQcBAAAAAbwHAQAAAAECAAAAGgAgZgAAyR0AICIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNQAA6xYAIDYAAOwWACA3AADtFgAgOgAA3hYAIDsAAOEWACA_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_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_gQAIGYAAOUdACAWBwAAsA4AIAkAAK0OACAKAACuDgAgCwAApw4AIA4AAKwOACAPAACqDgAgEAAAvQ8AIBkAAKsOACAbAACvDgAgLAAAqA4AIIUGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABrQYBAAAAAa4GAQAAAAGvBgEAAAABsQYBAAAAAeYGAQAAAAH2BgEAAAABvQdAAAAAAQIAAAAoACBmAADnHQAgAwAAABgAIGYAAOMdACBnAADrHQAgGgAAABgAIAgAAJUXACAMAACsFQAgDQAApBUAIBEAAKUVACAcAACrFQAgJQAAoRUAICcAAKoVACAqAACtFQAgLgAAnhUAIC8AAJ8VACAwAACgFQAgMQAAohUAIDIAAKMVACA0AACmFQAgNQAApxUAIDYAAKgVACA4AACuFQAgXwAA6x0AIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIeQGAQDeDAAh9QYBAN4MACGpBwEA3gwAIbwHAQDdDAAhGAgAAJUXACAMAACsFQAgDQAApBUAIBEAAKUVACAcAACrFQAgJQAAoRUAICcAAKoVACAqAACtFQAgLgAAnhUAIC8AAJ8VACAwAACgFQAgMQAAohUAIDIAAKMVACA0AACmFQAgNQAApxUAIDYAAKgVACA4AACuFQAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACH1BgEA3gwAIakHAQDeDAAhvAcBAN0MACEDAAAAFgAgZgAA5R0AIGcAAO4dACAkAAAAFgAgBgAA0BIAIAwAAN8SACANAADTEgAgEQAA1BIAIBwAANsSACAlAADOEgAgJwAA2hIAICoAAOASACAuAADLEgAgLwAAzBIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBIAADiEgAgSQAA4xIAIEoAAOQSACBfAADuHQAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuQYAAK8Sqwcj3gYBAN0MACHkBgEA3gwAIakHAQDeDAAhrAcBAN4MACEiBgAA0BIAIAwAAN8SACANAADTEgAgEQAA1BIAIBwAANsSACAlAADOEgAgJwAA2hIAICoAAOASACAuAADLEgAgLwAAzBIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBIAADiEgAgSQAA4xIAIEoAAOQSACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAIQMAAAAmACBmAADnHQAgZwAA8R0AIBgAAAAmACAHAAD9DQAgCQAA-g0AIAoAAPsNACALAAD0DQAgDgAA-Q0AIA8AAPcNACAQAAC7DwAgGQAA-A0AIBsAAPwNACAsAAD1DQAgXwAA8R0AIIUGAQDdDAAhigYBAN0MACGLBgEA3gwAIY0GQADfDAAhjgZAAN8MACGtBgEA3QwAIa4GAQDdDAAhrwYBAN0MACGxBgEA3QwAIeYGAQDdDAAh9gYBAN4MACG9B0AA3wwAIRYHAAD9DQAgCQAA-g0AIAoAAPsNACALAAD0DQAgDgAA-Q0AIA8AAPcNACAQAAC7DwAgGQAA-A0AIBsAAPwNACAsAAD1DQAghQYBAN0MACGKBgEA3QwAIYsGAQDeDAAhjQZAAN8MACGOBkAA3wwAIa0GAQDdDAAhrgYBAN0MACGvBgEA3QwAIbEGAQDdDAAh5gYBAN0MACH2BgEA3gwAIb0HQADfDAAhE4UGAQAAAAGKBgEAAAABiwYBAAAAAY0GQAAAAAGOBkAAAAABwwYBAAAAAcQGCAAAAAHFBggAAAABxgYIAAAAAccGCAAAAAHIBggAAAAByQYIAAAAAcoGCAAAAAHLBggAAAABzAYIAAAAAc0GCAAAAAHOBggAAAABzwYIAAAAAdAGCAAAAAEYCAAAlhcAIAwAANkWACANAADRFgAgEQAA0hYAIBwAANgWACAlAADOFgAgJwAA1xYAICoAANoWACAuAADLFgAgLwAAzBYAIDAAAM0WACAxAADPFgAgMgAA0BYAIDQAANMWACA1AADUFgAgNgAA1RYAIDcAANYWACCFBgEAAAABjQZAAAAAAY4GQAAAAAHkBgEAAAAB9QYBAAAAAakHAQAAAAG8BwEAAAABAgAAABoAIGYAAPMdACAPAwAAwA8AIAcAAL4PACAJAAC_DwAgDQAAwQ8AIBMAAMIPACAaAADDDwAgHAAAxA8AIIUGAQAAAAGJBgEAAAABigYBAAAAAYsGAQAAAAGMBgEAAAABjQZAAAAAAY4GQAAAAAHaBgEAAAABAgAAAJ0BACBmAAD1HQAgIgQAAIkZACAFAACKGQAgBgAAixkAIBAAAIwZACAZAACNGQAgNAAAkBkAIEAAAI4ZACBNAACPGQAgTgAAkRkAIE8AAJIZACBQAACTGQAgUQAAlBkAIFIAAJUZACBTAACWGQAgVAAAlxkAIFYAAJkZACBXAACaGQAgWAAAmxkAIFkAAJwZACCFBgEAAAABiQYBAAAAAY0GQAAAAAGOBkAAAAAB3gYBAAAAAZUHAQAAAAHVBwEAAAAB1gcgAAAAAdcHAQAAAAHYBwEAAAAB2QcBAAAAAdoHAQAAAAHbBwEAAAAB3AcBAAAAAd0HAQAAAAECAAAA-wIAIGYAAPcdACAiBAAAiRkAIAUAAIoZACAGAACLGQAgEAAAjBkAIBkAAI0ZACA0AACQGQAgQAAAjhkAIE0AAI8ZACBOAACRGQAgTwAAkhkAIFAAAJMZACBRAACUGQAgUgAAlRkAIFMAAJYZACBVAACYGQAgVgAAmRkAIFcAAJoZACBYAACbGQAgWQAAnBkAIIUGAQAAAAGJBgEAAAABjQZAAAAAAY4GQAAAAAHeBgEAAAABlQcBAAAAAdUHAQAAAAHWByAAAAAB1wcBAAAAAdgHAQAAAAHZBwEAAAAB2gcBAAAAAdsHAQAAAAHcBwEAAAAB3QcBAAAAAQIAAAD7AgAgZgAA-R0AICIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEAAAOkWACBBAADwFgAgQgAA8RYAIEcAAPUWACBIAAD2FgAgSQAA9xYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAA-x0AICIGAADkFgAgDAAA8xYAIA0AAOcWACARAADoFgAgHAAA7xYAICUAAOIWACAnAADuFgAgKgAA9BYAIC4AAN8WACAvAADgFgAgMAAA4xYAIDEAAOUWACAyAADmFgAgNAAA6hYAIDUAAOsWACA2AADsFgAgNwAA7RYAIDoAAN4WACA7AADhFgAgPwAA8hYAIEAAAOkWACBBAADwFgAgQgAA8RYAIEcAAPUWACBIAAD2FgAgSgAA-BYAIIUGAQAAAAGNBkAAAAABjgZAAAAAAbkGAAAAqwcD3gYBAAAAAeQGAQAAAAGpBwEAAAABrAcBAAAAAQIAAAD-BAAgZgAA_R0AIAMAAAAYACBmAADzHQAgZwAAgR4AIBoAAAAYACAIAACVFwAgDAAArBUAIA0AAKQVACARAAClFQAgHAAAqxUAICUAAKEVACAnAACqFQAgKgAArRUAIC4AAJ4VACAvAACfFQAgMAAAoBUAIDEAAKIVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIF8AAIEeACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfUGAQDeDAAhqQcBAN4MACG8BwEA3QwAIRgIAACVFwAgDAAArBUAIA0AAKQVACARAAClFQAgHAAAqxUAICUAAKEVACAnAACqFQAgKgAArRUAIC4AAJ4VACAvAACfFQAgMAAAoBUAIDEAAKIVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIeQGAQDeDAAh9QYBAN4MACGpBwEA3gwAIbwHAQDdDAAhAwAAAFMAIGYAAPUdACBnAACEHgAgEQAAAFMAIAMAAPAOACAHAADuDgAgCQAA7w4AIA0AAPEOACATAADyDgAgGgAA8w4AIBwAAPQOACBfAACEHgAghQYBAN0MACGJBgEA3gwAIYoGAQDdDAAhiwYBAN4MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACHaBgEA3QwAIQ8DAADwDgAgBwAA7g4AIAkAAO8OACANAADxDgAgEwAA8g4AIBoAAPMOACAcAAD0DgAghQYBAN0MACGJBgEA3gwAIYoGAQDdDAAhiwYBAN4MACGMBgEA3QwAIY0GQADfDAAhjgZAAN8MACHaBgEA3QwAIQMAAABRACBmAAD3HQAgZwAAhx4AICQAAABRACAEAAC-FwAgBQAAvxcAIAYAAMAXACAQAADBFwAgGQAAwhcAIDQAAMUXACBAAADDFwAgTQAAxBcAIE4AAMYXACBPAADHFwAgUAAAyBcAIFEAAMkXACBSAADKFwAgUwAAyxcAIFQAAMwXACBWAADOFwAgVwAAzxcAIFgAANAXACBZAADRFwAgXwAAhx4AIIUGAQDdDAAhiQYBAN4MACGNBkAA3wwAIY4GQADfDAAh3gYBAN0MACGVBwEA3QwAIdUHAQDdDAAh1gcgAL8OACHXBwEA3gwAIdgHAQDeDAAh2QcBAN4MACHaBwEA3gwAIdsHAQDeDAAh3AcBAN4MACHdBwEA3QwAISIEAAC-FwAgBQAAvxcAIAYAAMAXACAQAADBFwAgGQAAwhcAIDQAAMUXACBAAADDFwAgTQAAxBcAIE4AAMYXACBPAADHFwAgUAAAyBcAIFEAAMkXACBSAADKFwAgUwAAyxcAIFQAAMwXACBWAADOFwAgVwAAzxcAIFgAANAXACBZAADRFwAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhAwAAAFEAIGYAAPkdACBnAACKHgAgJAAAAFEAIAQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACBfAACKHgAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgQAAL4XACAFAAC_FwAgBgAAwBcAIBAAAMEXACAZAADCFwAgNAAAxRcAIEAAAMMXACBNAADEFwAgTgAAxhcAIE8AAMcXACBQAADIFwAgUQAAyRcAIFIAAMoXACBTAADLFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEDAAAAFgAgZgAA-x0AIGcAAI0eACAkAAAAFgAgBgAA0BIAIAwAAN8SACANAADTEgAgEQAA1BIAIBwAANsSACAlAADOEgAgJwAA2hIAICoAAOASACAuAADLEgAgLwAAzBIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDcAANkSACA6AADKEgAgOwAAzRIAID8AAN4SACBAAADVEgAgQQAA3BIAIEIAAN0SACBHAADhEgAgSAAA4hIAIEkAAOMSACBfAACNHgAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAhuQYAAK8Sqwcj3gYBAN0MACHkBgEA3gwAIakHAQDeDAAhrAcBAN4MACEiBgAA0BIAIAwAAN8SACANAADTEgAgEQAA1BIAIBwAANsSACAlAADOEgAgJwAA2hIAICoAAOASACAuAADLEgAgLwAAzBIAIDAAAM8SACAxAADREgAgMgAA0hIAIDQAANYSACA1AADXEgAgNgAA2BIAIDcAANkSACA6AADKEgAgOwAAzRIAID8AAN4SACBAAADVEgAgQQAA3BIAIEIAAN0SACBHAADhEgAgSAAA4hIAIEkAAOMSACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAIQMAAAAWACBmAAD9HQAgZwAAkB4AICQAAAAWACAGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBIAADiEgAgSgAA5BIAIF8AAJAeACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDEAANESACAyAADSEgAgNAAA1hIAIDUAANcSACA2AADYEgAgNwAA2RIAIDoAAMoSACA7AADNEgAgPwAA3hIAIEAAANUSACBBAADcEgAgQgAA3RIAIEcAAOESACBIAADiEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhD4UGAQAAAAGNBkAAAAABjgZAAAAAAbEGAQAAAAG9BgAAAJsHAr8GQAAAAAHCBgEAAAABmQcAAACZBwKbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHAQAAAAGhB0AAAAABAwAAAFEAIGYAAM8cACBnAACUHgAgJAAAAFEAIAQAAL4XACAFAAC_FwAgBgAAwBcAIBkAAMIXACA0AADFFwAgQAAAwxcAIE0AAMQXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACBfAACUHgAghQYBAN0MACGJBgEA3gwAIY0GQADfDAAhjgZAAN8MACHeBgEA3QwAIZUHAQDdDAAh1QcBAN0MACHWByAAvw4AIdcHAQDeDAAh2AcBAN4MACHZBwEA3gwAIdoHAQDeDAAh2wcBAN4MACHcBwEA3gwAId0HAQDdDAAhIgQAAL4XACAFAAC_FwAgBgAAwBcAIBkAAMIXACA0AADFFwAgQAAAwxcAIE0AAMQXACBOAADGFwAgTwAAxxcAIFAAAMgXACBRAADJFwAgUgAAyhcAIFMAAMsXACBUAADMFwAgVQAAzRcAIFYAAM4XACBXAADPFwAgWAAA0BcAIFkAANEXACCFBgEA3QwAIYkGAQDeDAAhjQZAAN8MACGOBkAA3wwAId4GAQDdDAAhlQcBAN0MACHVBwEA3QwAIdYHIAC_DgAh1wcBAN4MACHYBwEA3gwAIdkHAQDeDAAh2gcBAN4MACHbBwEA3gwAIdwHAQDeDAAh3QcBAN0MACEDAAAAGAAgZgAA0RwAIGcAAJceACAaAAAAGAAgCAAAlRcAIAwAAKwVACANAACkFQAgEQAApRUAIBwAAKsVACAlAAChFQAgJwAAqhUAICoAAK0VACAuAACeFQAgLwAAnxUAIDAAAKAVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIDgAAK4VACBfAACXHgAghQYBAN0MACGNBkAA3wwAIY4GQADfDAAh5AYBAN4MACH1BgEA3gwAIakHAQDeDAAhvAcBAN0MACEYCAAAlRcAIAwAAKwVACANAACkFQAgEQAApRUAIBwAAKsVACAlAAChFQAgJwAAqhUAICoAAK0VACAuAACeFQAgLwAAnxUAIDAAAKAVACAyAACjFQAgNAAAphUAIDUAAKcVACA2AACoFQAgNwAAqRUAIDgAAK4VACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACHkBgEA3gwAIfUGAQDeDAAhqQcBAN4MACG8BwEA3QwAIQMAAAAWACBmAADTHAAgZwAAmh4AICQAAAAWACAGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIF8AAJoeACCFBgEA3QwAIY0GQADfDAAhjgZAAN8MACG5BgAArxKrByPeBgEA3QwAIeQGAQDeDAAhqQcBAN4MACGsBwEA3gwAISIGAADQEgAgDAAA3xIAIA0AANMSACARAADUEgAgHAAA2xIAICUAAM4SACAnAADaEgAgKgAA4BIAIC4AAMsSACAvAADMEgAgMAAAzxIAIDIAANISACA0AADWEgAgNQAA1xIAIDYAANgSACA3AADZEgAgOgAAyhIAIDsAAM0SACA_AADeEgAgQAAA1RIAIEEAANwSACBCAADdEgAgRwAA4RIAIEgAAOISACBJAADjEgAgSgAA5BIAIIUGAQDdDAAhjQZAAN8MACGOBkAA3wwAIbkGAACvEqsHI94GAQDdDAAh5AYBAN4MACGpBwEA3gwAIawHAQDeDAAhAgMAAgcABhUEBgMFCgQGDQEQEQUVAD0ZqQITNKwCKUCqAi5NqwIuTq0CKU-vAjpQsAIUUbECFFKzAjtTtwI8VLgCGlW5AhpWugI3V7sCN1i8AjNZvQI1AQMAAgEDAAIKAwACBwAGCQAIDZ0CCxGeAhAVADkiogIaJJ8CEUugAilMoQIlHAbOAQEM7AENDdEBCxHSARAVADgc5AEXJcwBDyfjARgq7QEMLsYBCS_HAR0wzQEKMc8BBTLQARM03wEpNeABETbhARI34gElOhUHO8sBIj_rAS9A1gEuQeYBMULqATJH8QEzSP8BN0mBAhpKggIaAwcXBhUALTkbCBMIHAcMsQENDZ8BCxGgARAVACwcsAEXJZoBDyevARgqsgEMLiAJL5gBHTCZAQoxmwEFMp4BEzSkASk1qgERNqsBEjeuASU4swEaBQcABgkACA2TAQsPJAoVACgGBwAGCQAICiUJDSkLEZABEBUAJwwHAAYJjAEICo0BCQstDA4ADw8AChAABRUAJhkAExsADiyIASQtigElBQeDAQYJhAEIKAANKQALKwAiBQd-Bgl_CAsuDBUAIRswDgYMNA0NcwsVACAceBclOA8ndxgIBwAGCWoIDTkLET0QFQAfGwAOJEIRJmwdBQcABgk-CA4ADw8AChAABQYHAAYJQwgOAA8QAAUVABwjRxIEBwAGCWgIEgARGQATCQMAAgcABglICA1JCxNKEhUAGxpOFBxYFyJeGgQWABUXAAIYUgIZVBMCFE8UFQAWARRQAAUHAAYJAAgZABMbAA4dABgFBwAGCQAIFQAZGwAOHFkXARxaAAcQYQUYXwIZYBMeAAYfAAYgAAIhYggFDWMAE2QAGmUAHGYAImcAASNpAAQHAAYJbQgVAB4lbg8BJW8AAw1wABFxACRyAAUMeQANewAcfQAlegAnfAABC4ABAAMHAAYVACMqgQEMASqCAQABKQALBAcABgmLAQgQAAUpAAsCC44BACyPAQACDZEBABGSAQACDZUBAA-UAQAGBwAGCakBCBCoAQUWACoYpwECMwACAhSlASkVACsBFKYBABEMwgEADboBABG7AQAcwQEAJbcBACfAAQAqwwEALrQBAC-1AQAwtgEAMbgBADK5AQA0vAEANb0BADa-AQA3vwEAOMQBAAE5xQEABQfYAQYVADA8AAI91wECP9wBLwIHAAY-3QEuAT_eAQABBwAGAQcABgUHAAYVADZDAAJF9QE0RvkBNQFEADMCAwACRAAzAkX6AQBG-wEAAwcABiAAAj2AAgIaBokCAAyXAgANjAIAEY0CAByUAgAlhwIAJ5MCACqYAgAuhAIAL4UCADCIAgAxigIAMosCADSPAgA1kAIANpECADeSAgA6gwIAO4YCAD-WAgBAjgIAQpUCAEeZAgBImgIASZsCAEqcAgAGDaMCABGkAgAiqAIAJKUCAEumAgBMpwIAATMAAgEXAAIBAwACEgS-AgAFvwIABsACABDBAgAZwgIANMUCAEDDAgBNxAIATsYCAFDHAgBRyAIAU8kCAFTKAgBVywIAVswCAFfNAgBYzgIAWc8CAAACAwACBwAGAgMAAgcABgMVAEJsAENtAEQAAAADFQBCbABDbQBEASkACwEpAAsDFQBJbABKbQBLAAAAAxUASWwASm0ASwAAAxUAUGwAUW0AUgAAAAMVAFBsAFFtAFIBAwACAQMAAgMVAFdsAFhtAFkAAAADFQBXbABYbQBZAQMAAgEDAAIDFQBebABfbQBgAAAAAxUAXmwAX20AYAAAAAMVAGZsAGdtAGgAAAADFQBmbABnbQBoAQMAAgEDAAIDFQBtbABubQBvAAAAAxUAbWwAbm0AbwIHAAYJ-AMIAgcABgn-AwgDFQB0bAB1bQB2AAAAAxUAdGwAdW0AdgEHAAYBBwAGBRUAe2wAfm0Af-4BAHzvAQB9AAAAAAAFFQB7bAB-bQB_7gEAfO8BAH0DBwAGCQAICqYECQMHAAYJAAgKrAQJBRUAhAFsAIcBbQCIAe4BAIUB7wEAhgEAAAAAAAUVAIQBbACHAW0AiAHuAQCFAe8BAIYBCAcABgm-BAgKvwQJDgAPDwAKEAAFGQATGwAOCAcABgnFBAgKxgQJDgAPDwAKEAAFGQATGwAOAxUAjQFsAI4BbQCPAQAAAAMVAI0BbACOAW0AjwEBCNgEBwEI3gQHAxUAlAFsAJUBbQCWAQAAAAMVAJQBbACVAW0AlgEBB_AEBgEH9gQGAxUAmwFsAJwBbQCdAQAAAAMVAJsBbACcAW0AnQEAAAMVAKIBbACjAW0ApAEAAAADFQCiAWwAowFtAKQBAwehBQY8AAI9oAUCAweoBQY8AAI9pwUCBRUAqQFsAKwBbQCtAe4BAKoB7wEAqwEAAAAAAAUVAKkBbACsAW0ArQHuAQCqAe8BAKsBAwcABiAAAj26BQIDBwAGIAACPcAFAgMVALIBbACzAW0AtAEAAAADFQCyAWwAswFtALQBBxDUBQUY0gUCGdMFEx4ABh8ABiAAAiHVBQgHEN0FBRjbBQIZ3AUTHgAGHwAGIAACId4FCAMVALkBbAC6AW0AuwEAAAADFQC5AWwAugFtALsBAgcABkMAAgIHAAZDAAIDFQDAAWwAwQFtAMIBAAAAAxUAwAFsAMEBbQDCAQFEADMBRAAzAxUAxwFsAMgBbQDJAQAAAAMVAMcBbADIAW0AyQECAwACRAAzAgMAAkQAMwMVAM4BbADPAW0A0AEAAAADFQDOAWwAzwFtANABAwcABgkACBsADgMHAAYJAAgbAA4FFQDVAWwA2AFtANkB7gEA1gHvAQDXAQAAAAAABRUA1QFsANgBbQDZAe4BANYB7wEA1wEFBwAGCQAIGQATGwAOHQAYBQcABgkACBkAExsADh0AGAUVAN4BbADhAW0A4gHuAQDfAe8BAOABAAAAAAAFFQDeAWwA4QFtAOIB7gEA3wHvAQDgAQEHAAYBBwAGAxUA5wFsAOgBbQDpAQAAAAMVAOcBbADoAW0A6QEBBwAGAQcABgUVAO4BbADxAW0A8gHuAQDvAe8BAPABAAAAAAAFFQDuAWwA8QFtAPIB7gEA7wHvAQDwAQAAAxUA9wFsAPgBbQD5AQAAAAMVAPcBbAD4AW0A-QEAAAMVAP4BbAD_AW0AgAIAAAADFQD-AWwA_wFtAIACAgcABgkACAIHAAYJAAgFFQCFAmwAiAJtAIkC7gEAhgLvAQCHAgAAAAAABRUAhQJsAIgCbQCJAu4BAIYC7wEAhwIFB9QHBgnVBwgoAA0pAAsrACIFB9sHBgncBwgoAA0pAAsrACIDFQCOAmwAjwJtAJACAAAAAxUAjgJsAI8CbQCQAgMH7wcGCfAHCBvuBw4DB_cHBgn4Bwgb9gcOAxUAlQJsAJYCbQCXAgAAAAMVAJUCbACWAm0AlwIEBwAGCYoICBsADiaLCB0EBwAGCZEICBsADiaSCB0FFQCcAmwAnwJtAKAC7gEAnQLvAQCeAgAAAAAABRUAnAJsAJ8CbQCgAu4BAJ0C7wEAngIAAAMVAKUCbACmAm0ApwIAAAADFQClAmwApgJtAKcCARcAAgEXAAIDFQCsAmwArQJtAK4CAAAAAxUArAJsAK0CbQCuAgQWABUXAAIY1AgCGdUIEwQWABUXAAIY2wgCGdwIEwMVALMCbAC0Am0AtQIAAAADFQCzAmwAtAJtALUCAwMAAgcABgnuCAgDAwACBwAGCfQICAMVALoCbAC7Am0AvAIAAAADFQC6AmwAuwJtALwCAgcABj6GCS4CBwAGPowJLgUVAMECbADEAm0AxQLuAQDCAu8BAMMCAAAAAAAFFQDBAmwAxAJtAMUC7gEAwgLvAQDDAgQHAAYJngkIEAAFKQALBAcABgmkCQgQAAUpAAsFFQDKAmwAzQJtAM4C7gEAywLvAQDMAgAAAAAABRUAygJsAM0CbQDOAu4BAMsC7wEAzAIGBwAGCbgJCBC3CQUWACoYtgkCMwACBgcABgnACQgQvwkFFgAqGL4JAjMAAgMVANMCbADUAm0A1QIAAAADFQDTAmwA1AJtANUCBAcABgnSCQgOAA8QAAUEBwAGCdgJCA4ADxAABQMVANoCbADbAm0A3AIAAAADFQDaAmwA2wJtANwCBAcABgnqCQgSABEZABMEBwAGCfAJCBIAERkAEwMVAOECbADiAm0A4wIAAAADFQDhAmwA4gJtAOMCBQcABgmCCggOAA8PAAoQAAUFBwAGCYgKCA4ADw8AChAABQMVAOgCbADpAm0A6gIAAAADFQDoAmwA6QJtAOoCATMAAgEzAAIDFQDvAmwA8AJtAPECAAAAAxUA7wJsAPACbQDxAgMDAAIHAAYJAAgDAwACBwAGCQAIAxUA9gJsAPcCbQD4AgAAAAMVAPYCbAD3Am0A-AJaAgFb0AIBXNECAV3SAgFe0wIBYNUCAWHXAj5i2AI_Y9oCAWTcAj5l3QJAaN4CAWnfAgFq4AI-buMCQW_kAkVw5QIkceYCJHLnAiRz6AIkdOkCJHXrAiR27QI-d-4CRnjwAiR58gI-evMCR3v0AiR89QIkffYCPn75Akh_-gJMgAH8AgKBAf0CAoIB_wICgwGAAwKEAYEDAoUBgwMChgGFAz6HAYYDTYgBiAMCiQGKAz6KAYsDTosBjAMCjAGNAwKNAY4DPo4BkQNPjwGSA1OQAZMDA5EBlAMDkgGVAwOTAZYDA5QBlwMDlQGZAwOWAZsDPpcBnANUmAGeAwOZAaADPpoBoQNVmwGiAwOcAaMDA50BpAM-ngGnA1afAagDWqABqQMEoQGqAwSiAasDBKMBrAMEpAGtAwSlAa8DBKYBsQM-pwGyA1uoAbQDBKkBtgM-qgG3A1yrAbgDBKwBuQMErQG6Az6uAb0DXa8BvgNhsAHAA2KxAcEDYrIBxANiswHFA2K0AcYDYrUByANitgHKAz63AcsDY7gBzQNiuQHPAz66AdADZLsB0QNivAHSA2K9AdMDPr4B1gNlvwHXA2nAAdgDPMEB2QM8wgHaAzzDAdsDPMQB3AM8xQHeAzzGAeADPscB4QNqyAHjAzzJAeUDPsoB5gNrywHnAzzMAegDPM0B6QM-zgHsA2zPAe0DcNAB7gMd0QHvAx3SAfADHdMB8QMd1AHyAx3VAfQDHdYB9gM-1wH3A3HYAfoDHdkB_AM-2gH9A3LbAf8DHdwBgAQd3QGBBD7eAYQEc98BhQR34AGGBCLhAYcEIuIBiAQi4wGJBCLkAYoEIuUBjAQi5gGOBD7nAY8EeOgBkQQi6QGTBD7qAZQEeesBlQQi7AGWBCLtAZcEPvABmgR68QGbBIAB8gGcBArzAZ0ECvQBngQK9QGfBAr2AaAECvcBogQK-AGkBD75AaUEgQH6AagECvsBqgQ-_AGrBIIB_QGtBAr-Aa4ECv8BrwQ-gAKyBIMBgQKzBIkBggK0BAuDArUEC4QCtgQLhQK3BAuGArgEC4cCugQLiAK8BD6JAr0EigGKAsEEC4sCwwQ-jALEBIsBjQLHBAuOAsgEC48CyQQ-kALMBIwBkQLNBJABkgLOBAiTAs8ECJQC0AQIlQLRBAiWAtIECJcC1AQImALWBD6ZAtcEkQGaAtoECJsC3AQ-nALdBJIBnQLfBAieAuAECJ8C4QQ-oALkBJMBoQLlBJcBogLmBAejAucEB6QC6AQHpQLpBAemAuoEB6cC7AQHqALuBD6pAu8EmAGqAvIEB6sC9AQ-rAL1BJkBrQL3BAeuAvgEB68C-QQ-sAL8BJoBsQL9BJ4BsgL_BAazAoAFBrQCggUGtQKDBQa2AoQFBrcChgUGuAKIBT65AokFnwG6AosFBrsCjQU-vAKOBaABvQKPBQa-ApAFBr8CkQU-wAKUBaEBwQKVBaUBwgKWBS7DApcFLsQCmAUuxQKZBS7GApoFLscCnAUuyAKeBT7JAp8FpgHKAqMFLssCpQU-zAKmBacBzQKpBS7OAqoFLs8CqwU-0AKuBagB0QKvBa4B0gKwBTfTArEFN9QCsgU31QKzBTfWArQFN9cCtgU32AK4BT7ZArkFrwHaArwFN9sCvgU-3AK_BbAB3QLBBTfeAsIFN98CwwU-4ALGBbEB4QLHBbUB4gLIBRrjAskFGuQCygUa5QLLBRrmAswFGucCzgUa6ALQBT7pAtEFtgHqAtcFGusC2QU-7ALaBbcB7QLfBRruAuAFGu8C4QU-8ALkBbgB8QLlBbwB8gLmBTPzAucFM_QC6AUz9QLpBTP2AuoFM_cC7AUz-ALuBT75Au8FvQH6AvEFM_sC8wU-_AL0Bb4B_QL1BTP-AvYFM_8C9wU-gAP6Bb8BgQP7BcMBggP8BTSDA_0FNIQD_gU0hQP_BTSGA4AGNIcDggY0iAOEBj6JA4UGxAGKA4cGNIsDiQY-jAOKBsUBjQOLBjSOA4wGNI8DjQY-kAOQBsYBkQORBsoBkgOSBjWTA5MGNZQDlAY1lQOVBjWWA5YGNZcDmAY1mAOaBj6ZA5sGywGaA50GNZsDnwY-nAOgBswBnQOhBjWeA6IGNZ8DowY-oAOmBs0BoQOnBtEBogOoBhijA6kGGKQDqgYYpQOrBhimA6wGGKcDrgYYqAOwBj6pA7EG0gGqA7MGGKsDtQY-rAO2BtMBrQO3BhiuA7gGGK8DuQY-sAO8BtQBsQO9BtoBsgO-BhezA78GF7QDwAYXtQPBBhe2A8IGF7cDxAYXuAPGBj65A8cG2wG6A8kGF7sDywY-vAPMBtwBvQPNBhe-A84GF78DzwY-wAPSBt0BwQPTBuMBwgPVBjHDA9YGMcQD2AYxxQPZBjHGA9oGMccD3AYxyAPeBj7JA98G5AHKA-EGMcsD4wY-zAPkBuUBzQPlBjHOA-YGMc8D5wY-0APqBuYB0QPrBuoB0gPsBjLTA-0GMtQD7gYy1QPvBjLWA_AGMtcD8gYy2AP0Bj7ZA_UG6wHaA_cGMtsD-QY-3AP6BuwB3QP7BjLeA_wGMt8D_QY-4AOAB-0B4QOBB_MB4gODByrjA4QHKuQDhwcq5QOIByrmA4kHKucDiwcq6AONBz7pA44H9AHqA5AHKusDkgc-7AOTB_UB7QOUByruA5UHKu8Dlgc-8AOZB_YB8QOaB_oB8gOcBxXzA50HFfQDoAcV9QOhBxX2A6IHFfcDpAcV-AOmBz75A6cH-wH6A6kHFfsDqwc-_AOsB_wB_QOtBxX-A64HFf8Drwc-gASyB_0BgQSzB4ECggS0BwmDBLUHCYQEtgcJhQS3BwmGBLgHCYcEugcJiAS8Bz6JBL0HggKKBL8HCYsEwQc-jATCB4MCjQTDBwmOBMQHCY8ExQc-kATIB4QCkQTJB4oCkgTKBwyTBMsHDJQEzAcMlQTNBwyWBM4HDJcE0AcMmATSBz6ZBNMHiwKaBNcHDJsE2Qc-nATaB4wCnQTdBwyeBN4HDJ8E3wc-oATiB40CoQTjB5ECogTkBw2jBOUHDaQE5gcNpQTnBw2mBOgHDacE6gcNqATsBz6pBO0HkgKqBPIHDasE9Ac-rAT1B5MCrQT5Bw2uBPoHDa8E-wc-sAT-B5QCsQT_B5gCsgSACA-zBIEID7QEgggPtQSDCA-2BIQID7cEhggPuASICD65BIkImQK6BI0ID7sEjwg-vASQCJoCvQSTCA--BJQID78ElQg-wASYCJsCwQSZCKECwgSbCA7DBJwIDsQEnggOxQSfCA7GBKAIDscEoggOyASkCD7JBKUIogLKBKcIDssEqQg-zASqCKMCzQSrCA7OBKwIDs8ErQg-0ASwCKQC0QSxCKgC0gSzCDvTBLQIO9QEtgg71QS3CDvWBLgIO9cEugg72AS8CD7ZBL0IqQLaBL8IO9sEwQg-3ATCCKoC3QTDCDveBMQIO98ExQg-4ATICKsC4QTJCK8C4gTKCBTjBMsIFOQEzAgU5QTNCBTmBM4IFOcE0AgU6ATSCD7pBNMIsALqBNcIFOsE2Qg-7ATaCLEC7QTdCBTuBN4IFO8E3wg-8ATiCLIC8QTjCLYC8gTkCBPzBOUIE_QE5ggT9QTnCBP2BOgIE_cE6ggT-ATsCD75BO0ItwL6BPAIE_sE8gg-_ATzCLgC_QT1CBP-BPYIE_8E9wg-gAX6CLkCgQX7CL0CggX8CC-DBf0IL4QF_ggvhQX_CC-GBYAJL4cFggkviAWECT6JBYUJvgKKBYgJL4sFigk-jAWLCb8CjQWNCS-OBY4JL48Fjwk-kAWSCcACkQWTCcYCkgWUCSWTBZUJJZQFlgkllQWXCSWWBZgJJZcFmgklmAWcCT6ZBZ0JxwKaBaAJJZsFogk-nAWjCcgCnQWlCSWeBaYJJZ8Fpwk-oAWqCckCoQWrCc8CogWsCSmjBa0JKaQFrgkppQWvCSmmBbAJKacFsgkpqAW0CT6pBbUJ0AKqBboJKasFvAk-rAW9CdECrQXBCSmuBcIJKa8Fwwk-sAXGCdICsQXHCdYCsgXICRGzBckJEbQFygkRtQXLCRG2BcwJEbcFzgkRuAXQCT65BdEJ1wK6BdQJEbsF1gk-vAXXCdgCvQXZCRG-BdoJEb8F2wk-wAXeCdkCwQXfCd0CwgXgCRLDBeEJEsQF4gkSxQXjCRLGBeQJEscF5gkSyAXoCT7JBekJ3gLKBewJEssF7gk-zAXvCd8CzQXxCRLOBfIJEs8F8wk-0AX2CeAC0QX3CeQC0gX4CRDTBfkJENQF-gkQ1QX7CRDWBfwJENcF_gkQ2AWACj7ZBYEK5QLaBYQKENsFhgo-3AWHCuYC3QWJChDeBYoKEN8Fiwo-4AWOCucC4QWPCusC4gWRCjrjBZIKOuQFlAo65QWVCjrmBZYKOucFmAo66AWaCj7pBZsK7ALqBZ0KOusFnwo-7AWgCu0C7QWhCjruBaIKOu8Fowo-8AWmCu4C8QWnCvIC8gWoCgXzBakKBfQFqgoF9QWrCgX2BawKBfcFrgoF-AWwCj75BbEK8wL6BbMKBfsFtQo-_AW2CvQC_QW3CgX-BbgKBf8FuQo-gAa8CvUCgQa9CvkC"
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
function createHttpError4(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
var requestInstitutionLeave = async (userId, userRole, payload) => {
  if (userRole !== "ADMIN" && userRole !== "TEACHER" && userRole !== "STUDENT") {
    throw createHttpError4(403, "Only admin, teacher, or student can request institution leave");
  }
  let context = null;
  if (userRole === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId
      },
      select: {
        institutionId: true
      }
    });
    context = adminProfile?.institutionId ? { institutionId: adminProfile.institutionId } : null;
  }
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
  requestInstitutionLeave
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
  leaveInstitution
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
var AuthValidation = {
  registerSchema,
  loginSchema,
  otpBaseSchema,
  verifyOtpSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  leaveInstitutionSchema,
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
  requireSessionRole("ADMIN", "TEACHER", "STUDENT"),
  validateRequest(AuthValidation.leaveInstitutionSchema),
  AuthController.leaveInstitution
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
    req.query
  );
  res.redirect(result.redirectUrl);
});
var handleRenewalPaymentFail = catchAsync(async (req, res) => {
  const result = await InstitutionAdminService.handleSubscriptionRenewalPaymentCallback(
    "failed",
    req.query
  );
  res.redirect(result.redirectUrl);
});
var handleRenewalPaymentCancel = catchAsync(async (req, res) => {
  const result = await InstitutionAdminService.handleSubscriptionRenewalPaymentCallback(
    "cancelled",
    req.query
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
