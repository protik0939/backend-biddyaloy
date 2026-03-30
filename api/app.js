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
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n  requestedTransferRequests            InstitutionTransferRequest[]  @relation("TransferRequestRequesterUser")\n  reviewedTransferRequests             InstitutionTransferRequest[]  @relation("TransferRequestReviewerUser")\n  sentNotices                          Notice[]                      @relation("NoticeSenderUser")\n  readNotices                          NoticeRead[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                           Program[]\n  batches                            Batch[]\n  courses                            Course[]\n  sections                           Section[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  transferRequestsAsTargetDepartment InstitutionTransferRequest[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum InstitutionSubscriptionPlan {\n  MONTHLY\n  HALF_YEARLY\n  YEARLY\n}\n\nenum InstitutionSubscriptionPaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionSubscriptionStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionTransferEntityType {\n  STUDENT\n  TEACHER\n}\n\nenum InstitutionTransferStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  CANCELLED\n}\n\nenum NoticeAudienceRole {\n  ADMIN\n  FACULTY\n  DEPARTMENT\n  TEACHER\n  STUDENT\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                                  @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                                @default(now())\n  updatedAt                   DateTime                                @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n  paymentGatewayCredential    InstitutionPaymentGatewayCredential?\n  renewalPayments             InstitutionSubscriptionRenewalPayment[]\n  subscriptions               InstitutionSubscription[]\n  schedules                   Schedule[]\n  routines                    Routine[]\n  notices                     Notice[]\n  sourceTransferRequests      InstitutionTransferRequest[]            @relation("TransferRequestSourceInstitution")\n  targetTransferRequests      InstitutionTransferRequest[]            @relation("TransferRequestTargetInstitution")\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  subscriptionPlan              InstitutionSubscriptionPlan?\n  subscriptionAmount            Decimal?                             @db.Decimal(12, 2)\n  subscriptionCurrency          String                               @default("BDT")\n  subscriptionMonths            Int?\n  subscriptionPaymentStatus     InstitutionSubscriptionPaymentStatus @default(PENDING)\n  subscriptionTranId            String?                              @unique\n  subscriptionGatewayStatus     String?\n  subscriptionGatewaySessionKey String?                              @unique\n  subscriptionGatewayValId      String?\n  subscriptionGatewayBankTranId String?\n  subscriptionGatewayCardType   String?\n  subscriptionGatewayRawPayload Json?\n  subscriptionPaidAt            DateTime?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution?              @relation(fields: [institutionId], references: [id])\n  subscriptions InstitutionSubscription[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel InstitutionTransferRequest {\n  id String @id @default(uuid())\n\n  entityType InstitutionTransferEntityType\n  status     InstitutionTransferStatus     @default(PENDING)\n\n  sourceInstitutionId String\n  sourceInstitution   Institution @relation("TransferRequestSourceInstitution", fields: [sourceInstitutionId], references: [id])\n\n  targetInstitutionId String\n  targetInstitution   Institution @relation("TransferRequestTargetInstitution", fields: [targetInstitutionId], references: [id])\n\n  requesterUserId String\n  requesterUser   User   @relation("TransferRequestRequesterUser", fields: [requesterUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TransferRequestReviewerUser", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  targetDepartmentId String?\n  targetDepartment   Department? @relation(fields: [targetDepartmentId], references: [id])\n\n  requestMessage  String?\n  responseMessage String?\n\n  requestedAt DateTime  @default(now())\n  reviewedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceInstitutionId, status])\n  @@index([targetInstitutionId, status])\n  @@index([requesterUserId])\n  @@index([studentProfileId])\n  @@index([teacherProfileId])\n  @@map("institution_transfer_requests")\n}\n\nmodel Notice {\n  id      String @id @default(uuid())\n  title   String\n  content String\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  senderUserId String\n  senderUser   User               @relation("NoticeSenderUser", fields: [senderUserId], references: [id])\n  senderRole   NoticeAudienceRole\n\n  recipients NoticeRecipientRole[]\n  reads      NoticeRead[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, createdAt])\n  @@index([senderUserId, createdAt])\n  @@map("notices")\n}\n\nmodel NoticeRecipientRole {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  role NoticeAudienceRole\n\n  createdAt DateTime @default(now())\n\n  @@unique([noticeId, role])\n  @@index([role])\n  @@map("notice_recipient_roles")\n}\n\nmodel NoticeRead {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  readAt DateTime @default(now())\n\n  @@unique([noticeId, userId])\n  @@index([userId, readAt])\n  @@map("notice_reads")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel InstitutionPaymentGatewayCredential {\n  id                               String      @id @default(uuid())\n  institutionId                    String      @unique\n  institution                      Institution @relation(fields: [institutionId], references: [id])\n  sslCommerzStoreIdEncrypted       String\n  sslCommerzStorePasswordEncrypted String\n  sslCommerzBaseUrlEncrypted       String\n  sslCommerzStoreIdHash            String\n  sslCommerzStorePasswordHash      String\n  sslCommerzBaseUrlHash            String\n  isActive                         Boolean     @default(true)\n  lastUpdatedByUserId              String?\n  createdAt                        DateTime    @default(now())\n  updatedAt                        DateTime    @updatedAt\n\n  @@index([institutionId, isActive])\n  @@map("institution_payment_gateway_credentials")\n}\n\nmodel InstitutionSubscriptionRenewalPayment {\n  id                String                               @id @default(uuid())\n  institutionId     String\n  institution       Institution                          @relation(fields: [institutionId], references: [id])\n  initiatedByUserId String\n  plan              InstitutionSubscriptionPlan\n  amount            Decimal                              @db.Decimal(12, 2)\n  currency          String                               @default("BDT")\n  monthsCovered     Int\n  status            InstitutionSubscriptionPaymentStatus @default(PENDING)\n  tranId            String                               @unique\n  gatewayStatus     String?\n  gatewaySessionKey String?                              @unique\n  gatewayValId      String?\n  gatewayBankTranId String?\n  gatewayCardType   String?\n  gatewayRawPayload Json?\n  paidAt            DateTime?\n  createdAt         DateTime                             @default(now())\n  updatedAt         DateTime                             @updatedAt\n\n  @@index([institutionId, status, createdAt])\n  @@index([initiatedByUserId, status])\n  @@map("institution_subscription_renewal_payments")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  semesterId String?\n  semester   Semester? @relation(fields: [semesterId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  startTime String\n  endTime   String\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@index([semesterId])\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  schedules           Schedule[]\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n  transferRequests      InstitutionTransferRequest[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel InstitutionSubscription {\n  id String @id @default(uuid())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  sourceApplicationId String?\n  sourceApplication   InstitutionApplication? @relation(fields: [sourceApplicationId], references: [id])\n\n  plan          InstitutionSubscriptionPlan\n  status        InstitutionSubscriptionStatus @default(ACTIVE)\n  amount        Decimal                       @db.Decimal(12, 2)\n  currency      String                        @default("BDT")\n  monthsCovered Int\n  startsAt      DateTime\n  endsAt        DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, status, endsAt])\n  @@index([sourceApplicationId])\n  @@map("institution_subscriptions")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n  transferRequests          InstitutionTransferRequest[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"requestedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestRequesterUser"},{"name":"reviewedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestReviewerUser"},{"name":"sentNotices","kind":"object","type":"Notice","relationName":"NoticeSenderUser"},{"name":"readNotices","kind":"object","type":"NoticeRead","relationName":"NoticeReadToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentToStudentFeePayment"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"DepartmentToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"DepartmentToRoutine"},{"name":"transferRequestsAsTargetDepartment","kind":"object","type":"InstitutionTransferRequest","relationName":"DepartmentToInstitutionTransferRequest"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"InstitutionToStudentFeePayment"},{"name":"paymentGatewayCredential","kind":"object","type":"InstitutionPaymentGatewayCredential","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"renewalPayments","kind":"object","type":"InstitutionSubscriptionRenewalPayment","relationName":"InstitutionToInstitutionSubscriptionRenewalPayment"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionToInstitutionSubscription"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"InstitutionToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"InstitutionToRoutine"},{"name":"notices","kind":"object","type":"Notice","relationName":"InstitutionToNotice"},{"name":"sourceTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestSourceInstitution"},{"name":"targetTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestTargetInstitution"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"subscriptionPlan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"subscriptionAmount","kind":"scalar","type":"Decimal"},{"name":"subscriptionCurrency","kind":"scalar","type":"String"},{"name":"subscriptionMonths","kind":"scalar","type":"Int"},{"name":"subscriptionPaymentStatus","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"subscriptionTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayStatus","kind":"scalar","type":"String"},{"name":"subscriptionGatewaySessionKey","kind":"scalar","type":"String"},{"name":"subscriptionGatewayValId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayBankTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayCardType","kind":"scalar","type":"String"},{"name":"subscriptionGatewayRawPayload","kind":"scalar","type":"Json"},{"name":"subscriptionPaidAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"InstitutionTransferRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"entityType","kind":"enum","type":"InstitutionTransferEntityType"},{"name":"status","kind":"enum","type":"InstitutionTransferStatus"},{"name":"sourceInstitutionId","kind":"scalar","type":"String"},{"name":"sourceInstitution","kind":"object","type":"Institution","relationName":"TransferRequestSourceInstitution"},{"name":"targetInstitutionId","kind":"scalar","type":"String"},{"name":"targetInstitution","kind":"object","type":"Institution","relationName":"TransferRequestTargetInstitution"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"TransferRequestRequesterUser"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TransferRequestReviewerUser"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"targetDepartmentId","kind":"scalar","type":"String"},{"name":"targetDepartment","kind":"object","type":"Department","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"requestMessage","kind":"scalar","type":"String"},{"name":"responseMessage","kind":"scalar","type":"String"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_transfer_requests"},"Notice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToNotice"},{"name":"senderUserId","kind":"scalar","type":"String"},{"name":"senderUser","kind":"object","type":"User","relationName":"NoticeSenderUser"},{"name":"senderRole","kind":"enum","type":"NoticeAudienceRole"},{"name":"recipients","kind":"object","type":"NoticeRecipientRole","relationName":"NoticeToNoticeRecipientRole"},{"name":"reads","kind":"object","type":"NoticeRead","relationName":"NoticeToNoticeRead"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notices"},"NoticeRecipientRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRecipientRole"},{"name":"role","kind":"enum","type":"NoticeAudienceRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_recipient_roles"},"NoticeRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRead"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NoticeReadToUser"},{"name":"readAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_reads"},"DepartmentSemesterFeeConfiguration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"totalFeeAmount","kind":"scalar","type":"Decimal"},{"name":"monthlyFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"}],"dbName":"department_semester_fee_configurations"},"StudentFeePayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentFeePayment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentFeePayment"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SemesterToStudentFeePayment"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentFeePaymentToStudentProfile"},{"name":"feeConfigurationId","kind":"scalar","type":"String"},{"name":"feeConfiguration","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"},{"name":"paymentMode","kind":"enum","type":"StudentFeePaymentMode"},{"name":"status","kind":"enum","type":"StudentFeePaymentStatus"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paymentInitiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_fee_payments"},"InstitutionPaymentGatewayCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"sslCommerzStoreIdEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStoreIdHash","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordHash","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlHash","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"lastUpdatedByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_payment_gateway_credentials"},"InstitutionSubscriptionRenewalPayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscriptionRenewalPayment"},{"name":"initiatedByUserId","kind":"scalar","type":"String"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscription_renewal_payments"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToRoutine"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"ScheduleToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSchedule"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSchedule"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"ScheduleToSemester"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"SemesterToStudentFeePayment"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"StudentFeePaymentToStudentProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"InstitutionSubscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscription"},{"name":"sourceApplicationId","kind":"scalar","type":"String"},{"name":"sourceApplication","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"endsAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscriptions"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","schedules","courseRegistrations","section","course","teacherProfile","sectionTeacherAssignments","classwork","classworkSubmissions","applications","_count","posting","studentUser","reviewerUser","studentProfile","admissionApplications","semester","feePayments","feeConfiguration","sourceInstitution","targetInstitution","requesterUser","targetDepartment","transferRequests","submissions","classworks","sections","batch","feeConfigurations","schedule","courseRegistration","routines","classRoom","attendances","mark","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","transferRequestsAsTargetDepartment","departments","faculties","classrooms","applicantUser","reviewedByUser","sourceApplication","subscriptions","institutionApplications","paymentGatewayCredential","renewalPayments","senderUser","notice","recipients","reads","notices","sourceTransferRequests","targetTransferRequests","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","requestedTransferRequests","reviewedTransferRequests","sentNotices","readNotices","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","InstitutionTransferRequest.findUnique","InstitutionTransferRequest.findUniqueOrThrow","InstitutionTransferRequest.findFirst","InstitutionTransferRequest.findFirstOrThrow","InstitutionTransferRequest.findMany","InstitutionTransferRequest.createOne","InstitutionTransferRequest.createMany","InstitutionTransferRequest.createManyAndReturn","InstitutionTransferRequest.updateOne","InstitutionTransferRequest.updateMany","InstitutionTransferRequest.updateManyAndReturn","InstitutionTransferRequest.upsertOne","InstitutionTransferRequest.deleteOne","InstitutionTransferRequest.deleteMany","InstitutionTransferRequest.groupBy","InstitutionTransferRequest.aggregate","Notice.findUnique","Notice.findUniqueOrThrow","Notice.findFirst","Notice.findFirstOrThrow","Notice.findMany","Notice.createOne","Notice.createMany","Notice.createManyAndReturn","Notice.updateOne","Notice.updateMany","Notice.updateManyAndReturn","Notice.upsertOne","Notice.deleteOne","Notice.deleteMany","Notice.groupBy","Notice.aggregate","NoticeRecipientRole.findUnique","NoticeRecipientRole.findUniqueOrThrow","NoticeRecipientRole.findFirst","NoticeRecipientRole.findFirstOrThrow","NoticeRecipientRole.findMany","NoticeRecipientRole.createOne","NoticeRecipientRole.createMany","NoticeRecipientRole.createManyAndReturn","NoticeRecipientRole.updateOne","NoticeRecipientRole.updateMany","NoticeRecipientRole.updateManyAndReturn","NoticeRecipientRole.upsertOne","NoticeRecipientRole.deleteOne","NoticeRecipientRole.deleteMany","NoticeRecipientRole.groupBy","NoticeRecipientRole.aggregate","NoticeRead.findUnique","NoticeRead.findUniqueOrThrow","NoticeRead.findFirst","NoticeRead.findFirstOrThrow","NoticeRead.findMany","NoticeRead.createOne","NoticeRead.createMany","NoticeRead.createManyAndReturn","NoticeRead.updateOne","NoticeRead.updateMany","NoticeRead.updateManyAndReturn","NoticeRead.upsertOne","NoticeRead.deleteOne","NoticeRead.deleteMany","NoticeRead.groupBy","NoticeRead.aggregate","DepartmentSemesterFeeConfiguration.findUnique","DepartmentSemesterFeeConfiguration.findUniqueOrThrow","DepartmentSemesterFeeConfiguration.findFirst","DepartmentSemesterFeeConfiguration.findFirstOrThrow","DepartmentSemesterFeeConfiguration.findMany","DepartmentSemesterFeeConfiguration.createOne","DepartmentSemesterFeeConfiguration.createMany","DepartmentSemesterFeeConfiguration.createManyAndReturn","DepartmentSemesterFeeConfiguration.updateOne","DepartmentSemesterFeeConfiguration.updateMany","DepartmentSemesterFeeConfiguration.updateManyAndReturn","DepartmentSemesterFeeConfiguration.upsertOne","DepartmentSemesterFeeConfiguration.deleteOne","DepartmentSemesterFeeConfiguration.deleteMany","DepartmentSemesterFeeConfiguration.groupBy","DepartmentSemesterFeeConfiguration.aggregate","StudentFeePayment.findUnique","StudentFeePayment.findUniqueOrThrow","StudentFeePayment.findFirst","StudentFeePayment.findFirstOrThrow","StudentFeePayment.findMany","StudentFeePayment.createOne","StudentFeePayment.createMany","StudentFeePayment.createManyAndReturn","StudentFeePayment.updateOne","StudentFeePayment.updateMany","StudentFeePayment.updateManyAndReturn","StudentFeePayment.upsertOne","StudentFeePayment.deleteOne","StudentFeePayment.deleteMany","StudentFeePayment.groupBy","StudentFeePayment.aggregate","InstitutionPaymentGatewayCredential.findUnique","InstitutionPaymentGatewayCredential.findUniqueOrThrow","InstitutionPaymentGatewayCredential.findFirst","InstitutionPaymentGatewayCredential.findFirstOrThrow","InstitutionPaymentGatewayCredential.findMany","InstitutionPaymentGatewayCredential.createOne","InstitutionPaymentGatewayCredential.createMany","InstitutionPaymentGatewayCredential.createManyAndReturn","InstitutionPaymentGatewayCredential.updateOne","InstitutionPaymentGatewayCredential.updateMany","InstitutionPaymentGatewayCredential.updateManyAndReturn","InstitutionPaymentGatewayCredential.upsertOne","InstitutionPaymentGatewayCredential.deleteOne","InstitutionPaymentGatewayCredential.deleteMany","InstitutionPaymentGatewayCredential.groupBy","InstitutionPaymentGatewayCredential.aggregate","InstitutionSubscriptionRenewalPayment.findUnique","InstitutionSubscriptionRenewalPayment.findUniqueOrThrow","InstitutionSubscriptionRenewalPayment.findFirst","InstitutionSubscriptionRenewalPayment.findFirstOrThrow","InstitutionSubscriptionRenewalPayment.findMany","InstitutionSubscriptionRenewalPayment.createOne","InstitutionSubscriptionRenewalPayment.createMany","InstitutionSubscriptionRenewalPayment.createManyAndReturn","InstitutionSubscriptionRenewalPayment.updateOne","InstitutionSubscriptionRenewalPayment.updateMany","InstitutionSubscriptionRenewalPayment.updateManyAndReturn","InstitutionSubscriptionRenewalPayment.upsertOne","InstitutionSubscriptionRenewalPayment.deleteOne","InstitutionSubscriptionRenewalPayment.deleteMany","InstitutionSubscriptionRenewalPayment.groupBy","InstitutionSubscriptionRenewalPayment.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","InstitutionSubscription.findUnique","InstitutionSubscription.findUniqueOrThrow","InstitutionSubscription.findFirst","InstitutionSubscription.findFirstOrThrow","InstitutionSubscription.findMany","InstitutionSubscription.createOne","InstitutionSubscription.createMany","InstitutionSubscription.createManyAndReturn","InstitutionSubscription.updateOne","InstitutionSubscription.updateMany","InstitutionSubscription.updateManyAndReturn","InstitutionSubscription.upsertOne","InstitutionSubscription.deleteOne","InstitutionSubscription.deleteMany","InstitutionSubscription.groupBy","InstitutionSubscription.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","sourceApplicationId","InstitutionSubscriptionPlan","plan","InstitutionSubscriptionStatus","amount","currency","monthsCovered","startsAt","endsAt","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","initiatedByUserId","InstitutionSubscriptionPaymentStatus","tranId","gatewayStatus","gatewaySessionKey","gatewayValId","gatewayBankTranId","gatewayCardType","gatewayRawPayload","paidAt","sslCommerzStoreIdEncrypted","sslCommerzStorePasswordEncrypted","sslCommerzBaseUrlEncrypted","sslCommerzStoreIdHash","sslCommerzStorePasswordHash","sslCommerzBaseUrlHash","isActive","lastUpdatedByUserId","feeConfigurationId","StudentFeePaymentMode","paymentMode","StudentFeePaymentStatus","gatewayName","paymentInitiatedAt","totalFeeAmount","monthlyFeeAmount","noticeId","readAt","NoticeAudienceRole","role","senderUserId","senderRole","InstitutionTransferEntityType","entityType","InstitutionTransferStatus","sourceInstitutionId","targetInstitutionId","requesterUserId","targetDepartmentId","requestMessage","responseMessage","requestedAt","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","subscriptionPlan","subscriptionAmount","subscriptionCurrency","subscriptionMonths","subscriptionPaymentStatus","subscriptionTranId","subscriptionGatewayStatus","subscriptionGatewaySessionKey","subscriptionGatewayValId","subscriptionGatewayBankTranId","subscriptionGatewayCardType","subscriptionGatewayRawPayload","subscriptionPaidAt","InstitutionApplicationStatus","rejectionReason","reviewedByUserId","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","accountStatus","date","AttendanceStatus","AdminRole","noticeId_userId","noticeId_role","postingId_teacherUserId","courseRegistrationId_date","departmentId_semesterId","postingId_studentUserId","classworkId_studentProfileId","sectionId_courseId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "qx3xApAFCwMAALUKACAHAAD5CgAg7wUAAKgMADDwBQAACwAQ8QUAAKgMADDyBQEAAAAB9wUBALAKACH5BQEAAAAB-gVAALQKACH7BUAAtAoAIYIHAACpDMoHIgEAAAABACAMAwAAtQoAIO8FAACrDAAw8AUAAAMAEPEFAACrDAAw8gUBALAKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACGvB0AAtAoAIbsHAQCwCgAhvAcBALEKACG9BwEAsQoAIQMDAACXDgAgvAcAAKwMACC9BwAArAwAIAwDAAC1CgAg7wUAAKsMADDwBQAAAwAQ8QUAAKsMADDyBQEAAAAB-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhrwdAALQKACG7BwEAAAABvAcBALEKACG9BwEAsQoAIQMAAAADACABAAAEADACAAAFACARAwAAtQoAIO8FAACqDAAw8AUAAAcAEPEFAACqDAAw8gUBALAKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACGyBwEAsAoAIbMHAQCwCgAhtAcBALEKACG1BwEAsQoAIbYHAQCxCgAhtwdAAN8LACG4B0AA3wsAIbkHAQCxCgAhugcBALEKACEIAwAAlw4AILQHAACsDAAgtQcAAKwMACC2BwAArAwAILcHAACsDAAguAcAAKwMACC5BwAArAwAILoHAACsDAAgEQMAALUKACDvBQAAqgwAMPAFAAAHABDxBQAAqgwAMPIFAQAAAAH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACGyBwEAsAoAIbMHAQCwCgAhtAcBALEKACG1BwEAsQoAIbYHAQCxCgAhtwdAAN8LACG4B0AA3wsAIbkHAQCxCgAhugcBALEKACEDAAAABwAgAQAACAAwAgAACQAgCwMAALUKACAHAAD5CgAg7wUAAKgMADDwBQAACwAQ8QUAAKgMADDyBQEAsAoAIfcFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhggcAAKkMygciAgMAAJcOACAHAACyEQAgAwAAAAsAIAEAAAwAMAIAAAEAIBYDAAC1CgAgBwAA-QoAIAkAAP0LACANAADfCgAgEQAApwsAICIAALELACAkAACpCwAgSgAA8AoAIEsAAKsLACDvBQAApwwAMPAFAAAOABDxBQAApwwAMPIFAQCwCgAh8wUBALAKACH0BQEAsAoAIfUFAQCwCgAh9gUBALEKACH3BQEAsAoAIfgFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhCgMAAJcOACAHAACyEQAgCQAA0xgAIA0AALUQACARAAC7FgAgIgAAxRYAICQAAL0WACBKAACkEQAgSwAAvxYAIPYFAACsDAAgFgMAALUKACAHAAD5CgAgCQAA_QsAIA0AAN8KACARAACnCwAgIgAAsQsAICQAAKkLACBKAADwCgAgSwAAqwsAIO8FAACnDAAw8AUAAA4AEPEFAACnDAAw8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUBALAKACH2BQEAsQoAIfcFAQCwCgAh-AUBALAKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACEDAAAADgAgAQAADwAwAgAAEAAgDAcAAOkLACA5AACmDAAg7wUAAKUMADDwBQAAEgAQ8QUAAKUMADDyBQEAsAoAIfcFAQCxCgAh-gVAALQKACH7BUAAtAoAIdEGAQCxCgAhkQcBALEKACGlBwEAsAoAIQUHAACyEQAgOQAA4xgAIPcFAACsDAAg0QYAAKwMACCRBwAArAwAIAwHAADpCwAgOQAApgwAIO8FAAClDAAw8AUAABIAEPEFAAClDAAw8gUBAAAAAfcFAQCxCgAh-gVAALQKACH7BUAAtAoAIdEGAQCxCgAhkQcBALEKACGlBwEAsAoAIQMAAAASACABAAATADACAAAUACAlBgAApAsAIAwAAN0KACANAADfCgAgEQAApwsAIBwAAOEKACAlAADeCgAgJwAA4AoAICoAAK8LACAuAACgCwAgLwAAoQsAIDAAAKMLACAxAAClCwAgMgAApgsAIDQAAPAKACA1AACpCwAgNgAAqgsAIDcAAKsLACA6AACfCwAgOwAAogsAID8AAK4LACBAAACoCwAgQQAArAsAIEIAAK0LACBHAACwCwAgSAAAsQsAIEkAALELACDvBQAAnQsAMPAFAAAWABDxBQAAnQsAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIaYGAACeC5MHI8sGAQCwCgAh0QYBALEKACGRBwEAsQoAIZQHAQCxCgAhAQAAABYAIBwIAACkDAAgDAAA3QoAIA0AAN8KACARAACnCwAgHAAA4QoAICUAAN4KACAnAADgCgAgKgAArwsAIC4AAKALACAvAAChCwAgMAAAowsAIDEAAKULACAyAACmCwAgNAAA8AoAIDUAAKkLACA2AACqCwAgNwAAqwsAIDgAALELACDvBQAAowwAMPAFAAAYABDxBQAAowwAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIdEGAQCxCgAh4gYBALEKACGRBwEAsQoAIaUHAQCwCgAhFQgAAOIYACAMAACzEAAgDQAAtRAAIBEAALsWACAcAAC3EAAgJQAAtBAAICcAALYQACAqAADDFgAgLgAAtBYAIC8AALUWACAwAAC3FgAgMQAAuRYAIDIAALoWACA0AACkEQAgNQAAvRYAIDYAAL4WACA3AAC_FgAgOAAAxRYAINEGAACsDAAg4gYAAKwMACCRBwAArAwAIBwIAACkDAAgDAAA3QoAIA0AAN8KACARAACnCwAgHAAA4QoAICUAAN4KACAnAADgCgAgKgAArwsAIC4AAKALACAvAAChCwAgMAAAowsAIDEAAKULACAyAACmCwAgNAAA8AoAIDUAAKkLACA2AACqCwAgNwAAqwsAIDgAALELACDvBQAAowwAMPAFAAAYABDxBQAAowwAMPIFAQAAAAH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACHiBgEAsQoAIZEHAQCxCgAhpQcBALAKACEDAAAAGAAgAQAAGQAwAgAAGgAgAQAAABIAIBIHAAD5CgAgCQAA_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_ACABAABAADACAABBACABAAAAGAAgEgcAAPkKACAJAADwCwAgEgAAjgwAIBkAAIYMACDvBQAAjQwAMPAFAABEABDxBQAAjQwAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGdBgEAsAoAIZ4GAQCwCgAhnwYBALEKACGgBgEAsQoAIaEGAQCxCgAhogZAALQKACEIBwAAshEAIAkAANMYACASAADZGAAgGQAA1hgAIPgFAACsDAAgnwYAAKwMACCgBgAArAwAIKEGAACsDAAgEwcAAPkKACAJAADwCwAgEgAAjgwAIBkAAIYMACDvBQAAjQwAMPAFAABEABDxBQAAjQwAMPIFAQAAAAH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIZ0GAQCwCgAhngYBALAKACGfBgEAsQoAIaAGAQCxCgAhoQYBALEKACGiBkAAtAoAIdAHAACMDAAgAwAAAEQAIAEAAEUAMAIAAEYAIAEAAAAYACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAAEQAIAEAAEUAMAIAAEYAIBMWAACLDAAgFwAAtQoAIBgAAOgLACAZAACCDAAg7wUAAIkMADDwBQAASwAQ8QUAAIkMADDyBQEAsAoAIfoFQAC0CgAh-wVAALQKACGeBgEAsQoAIagGAQCxCgAhqgYAAIoMyQYiqwYBALEKACGsBkAA3wsAIa0GQAC0CgAhrgYBALAKACGvBgEAsQoAIckGAQCwCgAhCRYAANgYACAXAACXDgAgGAAAlw4AIBkAANYYACCeBgAArAwAIKgGAACsDAAgqwYAAKwMACCsBgAArAwAIK8GAACsDAAgFBYAAIsMACAXAAC1CgAgGAAA6AsAIBkAAIIMACDvBQAAiQwAMPAFAABLABDxBQAAiQwAMPIFAQAAAAH6BUAAtAoAIfsFQAC0CgAhngYBALEKACGoBgEAsQoAIaoGAACKDMkGIqsGAQCxCgAhrAZAAN8LACGtBkAAtAoAIa4GAQCwCgAhrwYBALEKACHJBgEAsAoAIc8HAACIDAAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACABAAAASwAgJAQAAMILACAFAADDCwAgBgAApAsAIBAAAKULACAZAACmCwAgNAAA8AoAIEAAAKgLACBMAACoCwAgTQAA8AoAIE4AAMQLACBPAADtCgAgUAAA7QoAIFEAAMULACBSAADGCwAgUwAAsQsAIFQAALELACBVAACwCwAgVgAAxwsAIO8FAADBCwAw8AUAAFEAEPEFAADBCwAw8gUBALAKACH2BQEAsQoAIfoFQAC0CgAh-wVAALQKACHLBgEAsAoAIYIHAQCwCgAhvgcBALAKACG_ByAAswoAIcAHAQCxCgAhwQcBALEKACHCBwEAsQoAIcMHAQCxCgAhxAcBALEKACHFBwEAsQoAIcYHAQCwCgAhAQAAAFEAIBMDAAC1CgAgBwAA-QoAIAkAAPALACANAADfCgAgEwAAqgsAIBoAAO0KACAcAADhCgAgIgAAsQsAIO8FAAD2CwAw8AUAAFMAEPEFAAD2CwAw8gUBALAKACH2BQEAsQoAIfcFAQCwCgAh-AUBALEKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACHHBgEAsAoAIQEAAABTACAfBwAA-QoAIAkAAP0LACAZAACGDAAgGwAA_gsAIB0AAIcMACDvBQAAgwwAMPAFAABVABDxBQAAgwwAMPIFAQCwCgAh9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACGeBgEAsAoAIaoGAACFDPsGIsIGEADbCwAhwwYBALAKACHEBgIA3AsAIdMGAQCwCgAh5wYBALAKACHoBgEAsQoAIekGAQCxCgAh6gYBALEKACHrBgEAsQoAIewGAQCxCgAh7QYAAN4LACDuBkAA3wsAIfcGAQCwCgAh-QYAAIQM-QYi-wYBALAKACH8BkAAtAoAIQwHAACyEQAgCQAA0xgAIBkAANYYACAbAADVGAAgHQAA1xgAIOgGAACsDAAg6QYAAKwMACDqBgAArAwAIOsGAACsDAAg7AYAAKwMACDtBgAArAwAIO4GAACsDAAgHwcAAPkKACAJAAD9CwAgGQAAhgwAIBsAAP4LACAdAACHDAAg7wUAAIMMADDwBQAAVQAQ8QUAAIMMADDyBQEAAAAB9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACGeBgEAsAoAIaoGAACFDPsGIsIGEADbCwAhwwYBALAKACHEBgIA3AsAIdMGAQCwCgAh5wYBAAAAAegGAQCxCgAh6QYBAAAAAeoGAQCxCgAh6wYBALEKACHsBgEAsQoAIe0GAADeCwAg7gZAAN8LACH3BgEAsAoAIfkGAACEDPkGIvsGAQCwCgAh_AZAALQKACEDAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIAEAAABVACAaEAAA9QsAIBgAAOgLACAZAACCDAAgHgAA-QoAIB8AAPkKACAgAAC1CgAgIQAA8AsAIO8FAAD_CwAw8AUAAFsAEPEFAAD_CwAw8gUBALAKACH6BUAAtAoAIfsFQAC0CgAhnAYBALEKACGeBgEAsQoAIaoGAACBDIgHIqwGQADfCwAhrwYBALEKACGGBwAAgAyGByKIBwEAsAoAIYkHAQCwCgAhigcBALAKACGLBwEAsQoAIYwHAQCxCgAhjQcBALEKACGOB0AAtAoAIQ4QAADSGAAgGAAAlw4AIBkAANYYACAeAACyEQAgHwAAshEAICAAAJcOACAhAADTGAAgnAYAAKwMACCeBgAArAwAIKwGAACsDAAgrwYAAKwMACCLBwAArAwAIIwHAACsDAAgjQcAAKwMACAaEAAA9QsAIBgAAOgLACAZAACCDAAgHgAA-QoAIB8AAPkKACAgAAC1CgAgIQAA8AsAIO8FAAD_CwAw8AUAAFsAEPEFAAD_CwAw8gUBAAAAAfoFQAC0CgAh-wVAALQKACGcBgEAsQoAIZ4GAQCxCgAhqgYAAIEMiAcirAZAAN8LACGvBgEAsQoAIYYHAACADIYHIogHAQCwCgAhiQcBALAKACGKBwEAsAoAIYsHAQCxCgAhjAcBALEKACGNBwEAsQoAIY4HQAC0CgAhAwAAAFsAIAEAAFwAMAIAAF0AIAEAAABRACABAAAAUwAgAQAAAA4AIAEAAAAYACABAAAAJgAgAQAAAEQAIAEAAABLACABAAAAVQAgAQAAAFsAIAEAAAAYACABAAAARAAgAQAAABgAIA0HAAD5CgAgCQAA8AsAICUAAN4KACDvBQAA9wsAMPAFAABrABDxBQAA9wsAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACHLBgEAsAoAIdEGAQCxCgAhAQAAAGsAIAEAAAAYACADAAAANQAgAQAANgAwAgAANwAgAQAAADUAIAEAAAAmACABAAAAOgAgAQAAAD8AIAMAAAAmACABAAAnADACAAAoACARBwAA-QoAIAkAAP0LACAbAAD-CwAgHAAA4QoAIO8FAAD8CwAw8AUAAHQAEPEFAAD8CwAw8gUBALAKACH3BQEAsAoAIfgFAQCwCgAh-gVAALQKACH7BUAAtAoAIcMGAQCwCgAh0wYBALAKACH1BiAAswoAIf0GEADbCwAh_gYQANsLACEEBwAAshEAIAkAANMYACAbAADVGAAgHAAAtxAAIBIHAAD5CgAgCQAA_QsAIBsAAP4LACAcAADhCgAg7wUAAPwLADDwBQAAdAAQ8QUAAPwLADDyBQEAAAAB9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACHDBgEAsAoAIdMGAQCwCgAh9QYgALMKACH9BhAA2wsAIf4GEADbCwAhzgcAAPsLACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIAEAAAAxACABAAAANQAgAQAAACYAIAEAAAB0ACABAAAAVQAgAQAAABYAIAEAAAAYACABAAAAKgAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACABAAAAFgAgAQAAABgAIAopAADuCwAg7wUAAPkLADDwBQAAhQEAEPEFAAD5CwAw8gUBALAKACH6BUAAtAoAIfsFQAC0CgAhqgYAAPoLyQcisAYBALAKACHHB0AAtAoAIQEpAADRGAAgCykAAO4LACDvBQAA-QsAMPAFAACFAQAQ8QUAAPkLADDyBQEAAAAB-gVAALQKACH7BUAAtAoAIaoGAAD6C8kHIrAGAQCwCgAhxwdAALQKACHNBwAA-AsAIAMAAACFAQAgAQAAhgEAMAIAAIcBACAbBwAA-QoAIAkAAPALACAQAADvCwAgKQAA7gsAIO8FAADsCwAw8AUAAIkBABDxBQAA7AsAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGcBgEAsAoAIbAGAQCwCgAhsQYIAO0LACGyBggA7QsAIbMGCADtCwAhtAYIAO0LACG1BggA7QsAIbYGCADtCwAhtwYIAO0LACG4BggA7QsAIbkGCADtCwAhugYIAO0LACG7BggA7QsAIbwGCADtCwAhvQYIAO0LACEBAAAAiQEAIAEAAAAYACABAAAAGAAgAQAAAB0AIAEAAAAqACABAAAAhQEAIAMAAAA6ACABAAA7ADACAAA8ACABAAAAJgAgAQAAADoAIAMAAAAmACABAAAnADACAAAoACABAAAAIQAgAQAAACYAIAUHAACyEQAgCQAA0xgAICUAALQQACD4BQAArAwAINEGAACsDAAgDQcAAPkKACAJAADwCwAgJQAA3goAIO8FAAD3CwAw8AUAAGsAEPEFAAD3CwAw8gUBAAAAAfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhywYBALAKACHRBgEAsQoAIQMAAABrACABAACWAQAwAgAAlwEAIAMAAAAhACABAAAiADACAAAjACADAAAANQAgAQAANgAwAgAANwAgAwAAAA4AIAEAAA8AMAIAABAAIAoDAACXDgAgBwAAshEAIAkAANMYACANAAC1EAAgEwAAvhYAIBoAAJMRACAcAAC3EAAgIgAAxRYAIPYFAACsDAAg-AUAAKwMACATAwAAtQoAIAcAAPkKACAJAADwCwAgDQAA3woAIBMAAKoLACAaAADtCgAgHAAA4QoAICIAALELACDvBQAA9gsAMPAFAABTABDxBQAA9gsAMPIFAQAAAAH2BQEAsQoAIfcFAQCwCgAh-AUBALEKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACHHBgEAAAABAwAAAFMAIAEAAJwBADACAACdAQAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACAXBwAA-QoAIAkAAPALACAQAAD1CwAgFgAA9AsAIBgAAOgLACAzAAC1CgAg7wUAAPILADDwBQAAoQEAEPEFAADyCwAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIYcGAQCwCgAhnAYBALEKACGoBgEAsQoAIaoGAADzC6oGIqsGAQCxCgAhrAZAAN8LACGtBkAAtAoAIa4GAQCwCgAhrwYBALEKACEMBwAAshEAIAkAANMYACAQAADSGAAgFgAA1BgAIBgAAJcOACAzAACXDgAg-AUAAKwMACCcBgAArAwAIKgGAACsDAAgqwYAAKwMACCsBgAArAwAIK8GAACsDAAgGAcAAPkKACAJAADwCwAgEAAA9QsAIBYAAPQLACAYAADoCwAgMwAAtQoAIO8FAADyCwAw8AUAAKEBABDxBQAA8gsAMPIFAQAAAAH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIYcGAQCwCgAhnAYBALEKACGoBgEAsQoAIaoGAADzC6oGIqsGAQCxCgAhrAZAAN8LACGtBkAAtAoAIa4GAQCwCgAhrwYBALEKACHMBwAA8QsAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAQAAAKEBACABAAAAUQAgAQAAAA4AIAEAAAAYACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAEQAIAEAAEUAMAIAAEYAIBIHAACyEQAgCQAA0xgAIBAAANIYACApAADRGAAg-AUAAKwMACCxBgAArAwAILIGAACsDAAgswYAAKwMACC0BgAArAwAILUGAACsDAAgtgYAAKwMACC3BgAArAwAILgGAACsDAAguQYAAKwMACC6BgAArAwAILsGAACsDAAgvAYAAKwMACC9BgAArAwAIBsHAAD5CgAgCQAA8AsAIBAAAO8LACApAADuCwAg7wUAAOwLADDwBQAAiQEAEPEFAADsCwAw8gUBAAAAAfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhnAYBALAKACGwBgEAAAABsQYIAO0LACGyBggA7QsAIbMGCADtCwAhtAYIAO0LACG1BggA7QsAIbYGCADtCwAhtwYIAO0LACG4BggA7QsAIbkGCADtCwAhugYIAO0LACG7BggA7QsAIbwGCADtCwAhvQYIAO0LACEDAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAABVACABAABWADACAABXACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAACoAIAEAACsAMAIAACwAIAMAAABbACABAABcADACAABdACABAAAAHQAgAQAAAGsAIAEAAAAhACABAAAANQAgAQAAAA4AIAEAAABTACABAAAAJgAgAQAAADoAIAEAAAChAQAgAQAAAD8AIAEAAABEACABAAAAiQEAIAEAAAB0ACABAAAAVQAgAQAAADEAIAEAAAAqACABAAAAWwAgAQAAABgAIAMAAAAdACABAAAeADACAAAfACADAAAAawAgAQAAlgEAMAIAAJcBACAOBwAA-QoAICoAAK8LACDvBQAA6gsAMPAFAADIAQAQ8QUAAOoLADDyBQEAsAoAIfcFAQCwCgAh-gVAALQKACH7BUAAtAoAIcsGAQCxCgAhqQcBALAKACGqBwEAsAoAIasHAgDcCwAhrQcAAOsLrQciAwcAALIRACAqAADDFgAgywYAAKwMACAOBwAA-QoAICoAAK8LACDvBQAA6gsAMPAFAADIAQAQ8QUAAOoLADDyBQEAAAAB9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhywYBALEKACGpBwEAsAoAIaoHAQCwCgAhqwcCANwLACGtBwAA6wutByIDAAAAyAEAIAEAAMkBADACAADKAQAgAwAAADUAIAEAADYAMAIAADcAIAMAAAAhACABAAAiADACAAAjACADAAAACwAgAQAADAAwAgAAAQAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAAAmACABAAAnADACAAAoACADAAAAOgAgAQAAOwAwAgAAPAAgIgcAAOkLACA8AAC1CgAgPQAA6AsAID8AAK4LACDvBQAA4wsAMPAFAADTAQAQ8QUAAOMLADDyBQEAsAoAIfcFAQCxCgAh-gVAALQKACH7BUAAtAoAIaoGAADnC6MHIqwGQADfCwAh0QYBALEKACGPBwEAsAoAIZAHAQCwCgAhkQcBALEKACGTBwAAnguTByOUBwEAsQoAIZUHAADkC8AGI5YHEADlCwAhlwcBALAKACGYBwIA5gsAIZkHAADdC-cGIpoHAQCxCgAhmwcBALEKACGcBwEAsQoAIZ0HAQCxCgAhngcBALEKACGfBwEAsQoAIaAHAADeCwAgoQdAAN8LACGjBwEAsQoAIaQHAQCxCgAhFwcAALIRACA8AACXDgAgPQAAlw4AID8AAMIWACD3BQAArAwAIKwGAACsDAAg0QYAAKwMACCRBwAArAwAIJMHAACsDAAglAcAAKwMACCVBwAArAwAIJYHAACsDAAgmAcAAKwMACCaBwAArAwAIJsHAACsDAAgnAcAAKwMACCdBwAArAwAIJ4HAACsDAAgnwcAAKwMACCgBwAArAwAIKEHAACsDAAgowcAAKwMACCkBwAArAwAICIHAADpCwAgPAAAtQoAID0AAOgLACA_AACuCwAg7wUAAOMLADDwBQAA0wEAEPEFAADjCwAw8gUBAAAAAfcFAQCxCgAh-gVAALQKACH7BUAAtAoAIaoGAADnC6MHIqwGQADfCwAh0QYBALEKACGPBwEAsAoAIZAHAQCwCgAhkQcBALEKACGTBwAAnguTByOUBwEAsQoAIZUHAADkC8AGI5YHEADlCwAhlwcBALAKACGYBwIA5gsAIZkHAADdC-cGIpoHAQAAAAGbBwEAsQoAIZwHAQAAAAGdBwEAsQoAIZ4HAQCxCgAhnwcBALEKACGgBwAA3gsAIKEHQADfCwAhowcBALEKACGkBwEAsQoAIQMAAADTAQAgAQAA1AEAMAIAANUBACABAAAAUQAgAQAAABYAIBEHAAD5CgAgPgAA4gsAIO8FAADgCwAw8AUAANkBABDxBQAA4AsAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhqgYAAOELwgYivgYBALEKACHABgAA2gvABiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHFBkAAtAoAIcYGQAC0CgAhAwcAALIRACA-AADQGAAgvgYAAKwMACARBwAA-QoAID4AAOILACDvBQAA4AsAMPAFAADZAQAQ8QUAAOALADDyBQEAAAAB9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhqgYAAOELwgYivgYBALEKACHABgAA2gvABiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHFBkAAtAoAIcYGQAC0CgAhAwAAANkBACABAADaAQAwAgAA2wEAIAEAAADTAQAgAQAAANkBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAABEACABAABFADACAABGACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAABVACABAABWADACAABXACAQBwAA-QoAIO8FAAD4CgAw8AUAAOUBABDxBQAA-AoAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAh7wYBALAKACHwBgEAsAoAIfEGAQCwCgAh8gYBALAKACHzBgEAsAoAIfQGAQCwCgAh9QYgALMKACH2BgEAsQoAIQEAAADlAQAgFgcAAPkKACDvBQAA2QsAMPAFAADnAQAQ8QUAANkLADDyBQEAsAoAIfcFAQCwCgAh-gVAALQKACH7BUAAtAoAIaoGAADdC-cGIsAGAADaC8AGIsIGEADbCwAhwwYBALAKACHEBgIA3AsAIeUGAQCwCgAh5wYBALAKACHoBgEAsQoAIekGAQCxCgAh6gYBALEKACHrBgEAsQoAIewGAQCxCgAh7QYAAN4LACDuBkAA3wsAIQgHAACyEQAg6AYAAKwMACDpBgAArAwAIOoGAACsDAAg6wYAAKwMACDsBgAArAwAIO0GAACsDAAg7gYAAKwMACAWBwAA-QoAIO8FAADZCwAw8AUAAOcBABDxBQAA2QsAMPIFAQAAAAH3BQEAsAoAIfoFQAC0CgAh-wVAALQKACGqBgAA3QvnBiLABgAA2gvABiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHlBgEAsAoAIecGAQAAAAHoBgEAsQoAIekGAQAAAAHqBgEAsQoAIesGAQCxCgAh7AYBALEKACHtBgAA3gsAIO4GQADfCwAhAwAAAOcBACABAADoAQAwAgAA6QEAIAMAAADZAQAgAQAA2gEAMAIAANsBACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAACoAIAEAACsAMAIAACwAIA8HAAD5CgAgQwAAtQoAIEUAANgLACBGAADHCwAg7wUAANcLADDwBQAA7gEAEPEFAADXCwAw8gUBALAKACH3BQEAsAoAIfoFQAC0CgAh-wVAALQKACGjBgEAsAoAIaQGAQCwCgAhgwcBALAKACGEBwAA1guCByIEBwAAshEAIEMAAJcOACBFAADPGAAgRgAAxRgAIA8HAAD5CgAgQwAAtQoAIEUAANgLACBGAADHCwAg7wUAANcLADDwBQAA7gEAEPEFAADXCwAw8gUBAAAAAfcFAQCwCgAh-gVAALQKACH7BUAAtAoAIaMGAQCwCgAhpAYBALAKACGDBwEAsAoAIYQHAADWC4IHIgMAAADuAQAgAQAA7wEAMAIAAPABACAIRAAA0wsAIO8FAADVCwAw8AUAAPIBABDxBQAA1QsAMPIFAQCwCgAh-gVAALQKACH_BgEAsAoAIYIHAADWC4IHIgFEAADOGAAgCUQAANMLACDvBQAA1QsAMPAFAADyAQAQ8QUAANULADDyBQEAAAAB-gVAALQKACH_BgEAsAoAIYIHAADWC4IHIssHAADUCwAgAwAAAPIBACABAADzAQAwAgAA9AEAIAkDAAC1CgAgRAAA0wsAIO8FAADSCwAw8AUAAPYBABDxBQAA0gsAMPIFAQCwCgAh-QUBALAKACH_BgEAsAoAIYAHQAC0CgAhAgMAAJcOACBEAADOGAAgCgMAALUKACBEAADTCwAg7wUAANILADDwBQAA9gEAEPEFAADSCwAw8gUBAAAAAfkFAQCwCgAh_wYBALAKACGAB0AAtAoAIcoHAADRCwAgAwAAAPYBACABAAD3AQAwAgAA-AEAIAEAAADyAQAgAQAAAPYBACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAAASACABAAAAHQAgAQAAAGsAIAEAAADIAQAgAQAAADUAIAEAAAAhACABAAAACwAgAQAAAA4AIAEAAABTACABAAAAJgAgAQAAADoAIAEAAADTAQAgAQAAAKEBACABAAAAPwAgAQAAAEQAIAEAAACJAQAgAQAAAHQAIAEAAABVACABAAAA5wEAIAEAAADZAQAgAQAAADEAIAEAAAAqACABAAAA7gEAIAEAAABbACABAAAAWwAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAWwAgAQAAXAAwAgAAXQAgAQAAACYAIAEAAAA6ACABAAAAPwAgAQAAAKEBACABAAAAiQEAIAEAAABbACADAAAAUwAgAQAAnAEAMAIAAJ0BACADAAAA0wEAIAEAANQBADACAADVAQAgAwAAANMBACABAADUAQAwAgAA1QEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgETMAALUKACDvBQAArwoAMPAFAACoAgAQ8QUAAK8KADDyBQEAsAoAIfoFQAC0CgAh-wVAALQKACGHBgEAsAoAIYgGAQCwCgAhiQYBALAKACGKBgEAsAoAIYsGAQCxCgAhjAYAAKkKACCNBgAAqQoAII4GAACyCgAgjwYAALIKACCQBiAAswoAIQEAAACoAgAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACANFwAAtQoAIO8FAADaCgAw8AUAAKwCABDxBQAA2goAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIYgGAQCwCgAhiQYBALAKACGOBgAAsgoAIJAGIACzCgAhyQYBALAKACHKBgAAqQoAIAEAAACsAgAgCgMAALUKACDvBQAA0AsAMPAFAACuAgAQ8QUAANALADDyBQEAsAoAIfkFAQCwCgAh-gVAALQKACH7BUAAtAoAIa4HAQCwCgAhrwdAALQKACEBAwAAlw4AIAoDAAC1CgAg7wUAANALADDwBQAArgIAEPEFAADQCwAw8gUBAAAAAfkFAQAAAAH6BUAAtAoAIfsFQAC0CgAhrgcBALAKACGvB0AAtAoAIQMAAACuAgAgAQAArwIAMAIAALACACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAADuAQAgAQAA7wEAMAIAAPABACADAAAA9gEAIAEAAPcBADACAAD4AQAgAQAAAAMAIAEAAAAHACABAAAACwAgAQAAAA4AIAEAAABTACABAAAA0wEAIAEAAADTAQAgAQAAAKEBACABAAAAoQEAIAEAAABLACABAAAASwAgAQAAAK4CACABAAAAWwAgAQAAAFsAIAEAAADuAQAgAQAAAPYBACABAAAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACADAAAACwAgAQAADAAwAgAAAQAgCAMAAPATACAHAACVGAAg8gUBAAAAAfcFAQAAAAH5BQEAAAAB-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_GAAg8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAVwAAPgCACAP8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAVwAAPoCADABXAAA-gIAMCEEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACECAAAA8QIAIFwAAP0CACAP8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhAgAAAFEAIFwAAP8CACACAAAAUQAgXAAA_wIAIAMAAADxAgAgYwAA-AIAIGQAAP0CACABAAAA8QIAIAEAAABRACAKFQAA9BYAIGkAAPYWACBqAAD1FgAg9gUAAKwMACDABwAArAwAIMEHAACsDAAgwgcAAKwMACDDBwAArAwAIMQHAACsDAAgxQcAAKwMACAS7wUAAMALADDwBQAAhgMAEPEFAADACwAw8gUBAJ0KACH2BQEAngoAIfoFQACfCgAh-wVAAJ8KACHLBgEAnQoAIYIHAQCdCgAhvgcBAJ0KACG_ByAAqwoAIcAHAQCeCgAhwQcBAJ4KACHCBwEAngoAIcMHAQCeCgAhxAcBAJ4KACHFBwEAngoAIcYHAQCdCgAhAwAAAFEAIAEAAIUDADBoAACGAwAgAwAAAFEAIAEAAPQCADACAADxAgAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAA8xYAIPIFAQAAAAH5BQEAAAAB-gVAAAAAAfsFQAAAAAGvB0AAAAABuwcBAAAAAbwHAQAAAAG9BwEAAAABAVwAAI4DACAI8gUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAa8HQAAAAAG7BwEAAAABvAcBAAAAAb0HAQAAAAEBXAAAkAMAMAFcAACQAwAwCQMAAPIWACDyBQEAsAwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIa8HQACyDAAhuwcBALAMACG8BwEAsQwAIb0HAQCxDAAhAgAAAAUAIFwAAJMDACAI8gUBALAMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACGvB0AAsgwAIbsHAQCwDAAhvAcBALEMACG9BwEAsQwAIQIAAAADACBcAACVAwAgAgAAAAMAIFwAAJUDACADAAAABQAgYwAAjgMAIGQAAJMDACABAAAABQAgAQAAAAMAIAUVAADvFgAgaQAA8RYAIGoAAPAWACC8BwAArAwAIL0HAACsDAAgC-8FAAC_CwAw8AUAAJwDABDxBQAAvwsAMPIFAQCdCgAh-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_IFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAdEGAQAAAAEBXAAA6wMAMAFcAADrAwAwAQAAABgAIAoHAAD5FQAgCQAAqBQAICUAAKkUACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACHRBgEAsQwAIQIAAACXAQAgXAAA7wMAIAfyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACHRBgEAsQwAIQIAAABrACBcAADxAwAgAgAAAGsAIFwAAPEDACABAAAAGAAgAwAAAJcBACBjAADpAwAgZAAA7wMAIAEAAACXAQAgAQAAAGsAIAUVAADfFgAgaQAA4RYAIGoAAOAWACD4BQAArAwAINEGAACsDAAgCu8FAAC6CwAw8AUAAPkDABDxBQAAugsAMPIFAQCdCgAh9wUBAJ0KACH4BQEAngoAIfoFQACfCgAh-wVAAJ8KACHLBgEAnQoAIdEGAQCeCgAhAwAAAGsAIAEAAPgDADBoAAD5AwAgAwAAAGsAIAEAAJYBADACAACXAQAgAQAAAMoBACABAAAAygEAIAMAAADIAQAgAQAAyQEAMAIAAMoBACADAAAAyAEAIAEAAMkBADACAADKAQAgAwAAAMgBACABAADJAQAwAgAAygEAIAsHAADeFgAgKgAAnBQAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAABqQcBAAAAAaoHAQAAAAGrBwIAAAABrQcAAACtBwIBXAAAgQQAIAnyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAakHAQAAAAGqBwEAAAABqwcCAAAAAa0HAAAArQcCAVwAAIMEADABXAAAgwQAMAsHAADdFgAgKgAAkRQAIPIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhywYBALEMACGpBwEAsAwAIaoHAQCwDAAhqwcCALkOACGtBwAAjxStByICAAAAygEAIFwAAIYEACAJ8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACHLBgEAsQwAIakHAQCwDAAhqgcBALAMACGrBwIAuQ4AIa0HAACPFK0HIgIAAADIAQAgXAAAiAQAIAIAAADIAQAgXAAAiAQAIAMAAADKAQAgYwAAgQQAIGQAAIYEACABAAAAygEAIAEAAADIAQAgBhUAANgWACBpAADbFgAgagAA2hYAIOsBAADZFgAg7AEAANwWACDLBgAArAwAIAzvBQAAtgsAMPAFAACPBAAQ8QUAALYLADDyBQEAnQoAIfcFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIcsGAQCeCgAhqQcBAJ0KACGqBwEAnQoAIasHAgDLCgAhrQcAALcLrQciAwAAAMgBACABAACOBAAwaAAAjwQAIAMAAADIAQAgAQAAyQEAMAIAAMoBACABAAAAIwAgAQAAACMAIAMAAAAhACABAAAiADACAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIA8HAAD7EAAgCQAA_BAAIAoAAPsTACANAAD9EAAgEQAA_hAAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAd0GAgAAAAHjBgEAAAABpwcBAAAAAagHAQAAAAEBXAAAlwQAIAryBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHdBgIAAAAB4wYBAAAAAacHAQAAAAGoBwEAAAABAVwAAJkEADABXAAAmQQAMAEAAAAdACAPBwAA5BAAIAkAAOUQACAKAAD5EwAgDQAA5hAAIBEAAOcQACDyBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHdBgIA5g8AIeMGAQCxDAAhpwcBALAMACGoBwEAsAwAIQIAAAAjACBcAACdBAAgCvIFAQCwDAAh9wUBALAMACH4BQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAId0GAgDmDwAh4wYBALEMACGnBwEAsAwAIagHAQCwDAAhAgAAACEAIFwAAJ8EACACAAAAIQAgXAAAnwQAIAEAAAAdACADAAAAIwAgYwAAlwQAIGQAAJ0EACABAAAAIwAgAQAAACEAIAgVAADTFgAgaQAA1hYAIGoAANUWACDrAQAA1BYAIOwBAADXFgAg0QYAAKwMACDdBgAArAwAIOMGAACsDAAgDe8FAAC1CwAw8AUAAKcEABDxBQAAtQsAMPIFAQCdCgAh9wUBAJ0KACH4BQEAnQoAIfoFQACfCgAh-wVAAJ8KACHRBgEAngoAId0GAgDjCgAh4wYBAJ4KACGnBwEAnQoAIagHAQCdCgAhAwAAACEAIAEAAKYEADBoAACnBAAgAwAAACEAIAEAACIAMAIAACMAIAEAAAAoACABAAAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgFwcAAIMOACAJAACADgAgCgAAgQ4AIAsAAPoNACAOAAD_DQAgDwAA_Q0AIBAAAJAPACAZAAD-DQAgGwAAgg4AICwAAPsNACAtAAD8DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAGeBgEAAAAB0wYBAAAAAeMGAQAAAAGmB0AAAAABAVwAAK8EACAM8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAGeBgEAAAAB0wYBAAAAAeMGAQAAAAGmB0AAAAABAVwAALEEADABXAAAsQQAMAEAAAAYACABAAAAHQAgFwcAANANACAJAADNDQAgCgAAzg0AIAsAAMcNACAOAADMDQAgDwAAyg0AIBAAAI4PACAZAADLDQAgGwAAzw0AICwAAMgNACAtAADJDQAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIZ4GAQCwDAAh0wYBALAMACHjBgEAsQwAIaYHQACyDAAhAgAAACgAIFwAALYEACAM8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIZ4GAQCwDAAh0wYBALAMACHjBgEAsQwAIaYHQACyDAAhAgAAACYAIFwAALgEACACAAAAJgAgXAAAuAQAIAEAAAAYACABAAAAHQAgAwAAACgAIGMAAK8EACBkAAC2BAAgAQAAACgAIAEAAAAmACAFFQAA0BYAIGkAANIWACBqAADRFgAg-AUAAKwMACDjBgAArAwAIA_vBQAAtAsAMPAFAADBBAAQ8QUAALQLADDyBQEAnQoAIfcFAQCdCgAh-AUBAJ4KACH6BUAAnwoAIfsFQACfCgAhmgYBAJ0KACGbBgEAnQoAIZwGAQCdCgAhngYBAJ0KACHTBgEAnQoAIeMGAQCeCgAhpgdAAJ8KACEDAAAAJgAgAQAAwAQAMGgAAMEEACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAABoAIAEAAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACAZCAAAzxYAIAwAAJQWACANAACMFgAgEQAAjRYAIBwAAJMWACAlAACJFgAgJwAAkhYAICoAAJUWACAuAACGFgAgLwAAhxYAIDAAAIgWACAxAACKFgAgMgAAixYAIDQAAI4WACA1AACPFgAgNgAAkBYAIDcAAJEWACA4AACWFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAeIGAQAAAAGRBwEAAAABpQcBAAAAAQFcAADJBAAgB_IFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHiBgEAAAABkQcBAAAAAaUHAQAAAAEBXAAAywQAMAFcAADLBAAwAQAAABIAIBkIAADOFgAgDAAA5xQAIA0AAN8UACARAADgFAAgHAAA5hQAICUAANwUACAnAADlFAAgKgAA6BQAIC4AANkUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgNwAA5BQAIDgAAOkUACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAIeIGAQCxDAAhkQcBALEMACGlBwEAsAwAIQIAAAAaACBcAADPBAAgB_IFAQCwDAAh-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_AACOEgAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAowcCrAZAAAAAAdEGAQAAAAGPBwEAAAABkAcBAAAAAZEHAQAAAAGTBwAAAJMHA5QHAQAAAAGVBwAAAMAGA5YHEAAAAAGXBwEAAAABmAcCAAAAAZkHAAAA5wYCmgcBAAAAAZsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAeAAAAAAaEHQAAAAAGjBwEAAAABpAcBAAAAAQFcAACRBQAgG_IFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAKMHAqwGQAAAAAHRBgEAAAABjwcBAAAAAZAHAQAAAAGRBwEAAAABkwcAAACTBwOUBwEAAAABlQcAAADABgOWBxAAAAABlwcBAAAAAZgHAgAAAAGZBwAAAOcGApoHAQAAAAGbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHgAAAAAGhB0AAAAABowcBAAAAAaQHAQAAAAEBXAAAkwUAMAFcAACTBQAwAQAAAFEAIAEAAAAWACAfBwAA_REAIDwAAPsRACA9AAD8EQAgPwAA_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_wYBAAAAAYIHAAAAggcCAVwAAOEFADABXAAA4QUAMAVEAADKEQAg8gUBALAMACH6BUAAsgwAIf8GAQCwDAAhggcAAMkRggciAgAAAPQBACBcAADkBQAgBPIFAQCwDAAh-gVAALIMACH_BgEAsAwAIYIHAADJEYIHIgIAAADyAQAgXAAA5gUAIAIAAADyAQAgXAAA5gUAIAMAAAD0AQAgYwAA3wUAIGQAAOQFACABAAAA9AEAIAEAAADyAQAgAxUAAMYRACBpAADIEQAgagAAxxEAIAfvBQAAgwsAMPAFAADtBQAQ8QUAAIMLADDyBQEAnQoAIfoFQACfCgAh_wYBAJ0KACGCBwAAhAuCByIDAAAA8gEAIAEAAOwFADBoAADtBQAgAwAAAPIBACABAADzAQAwAgAA9AEAIAEAAAD4AQAgAQAAAPgBACADAAAA9gEAIAEAAPcBADACAAD4AQAgAwAAAPYBACABAAD3AQAwAgAA-AEAIAMAAAD2AQAgAQAA9wEAMAIAAPgBACAGAwAAxREAIEQAAMQRACDyBQEAAAAB-QUBAAAAAf8GAQAAAAGAB0AAAAABAVwAAPUFACAE8gUBAAAAAfkFAQAAAAH_BgEAAAABgAdAAAAAAQFcAAD3BQAwAVwAAPcFADAGAwAAwxEAIEQAAMIRACDyBQEAsAwAIfkFAQCwDAAh_wYBALAMACGAB0AAsgwAIQIAAAD4AQAgXAAA-gUAIATyBQEAsAwAIfkFAQCwDAAh_wYBALAMACGAB0AAsgwAIQIAAAD2AQAgXAAA_AUAIAIAAAD2AQAgXAAA_AUAIAMAAAD4AQAgYwAA9QUAIGQAAPoFACABAAAA-AEAIAEAAAD2AQAgAxUAAL8RACBpAADBEQAgagAAwBEAIAfvBQAAggsAMPAFAACDBgAQ8QUAAIILADDyBQEAnQoAIfkFAQCdCgAh_wYBAJ0KACGAB0AAnwoAIQMAAAD2AQAgAQAAggYAMGgAAIMGACADAAAA9gEAIAEAAPcBADACAAD4AQAgAQAAAHYAIAEAAAB2ACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAAB0ACABAAB1ADACAAB2ACAOBwAA0A8AIAkAANEPACAbAAC-EQAgHAAA0g8AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABwwYBAAAAAdMGAQAAAAH1BiAAAAAB_QYQAAAAAf4GEAAAAAEBXAAAiwYAIAryBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAcMGAQAAAAHTBgEAAAAB9QYgAAAAAf0GEAAAAAH-BhAAAAABAVwAAI0GADABXAAAjQYAMA4HAADDDwAgCQAAxA8AIBsAAL0RACAcAADFDwAg8gUBALAMACH3BQEAsAwAIfgFAQCwDAAh-gVAALIMACH7BUAAsgwAIcMGAQCwDAAh0wYBALAMACH1BiAAkg4AIf0GEAC4DgAh_gYQALgOACECAAAAdgAgXAAAkAYAIAryBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAhwwYBALAMACHTBgEAsAwAIfUGIACSDgAh_QYQALgOACH-BhAAuA4AIQIAAAB0ACBcAACSBgAgAgAAAHQAIFwAAJIGACADAAAAdgAgYwAAiwYAIGQAAJAGACABAAAAdgAgAQAAAHQAIAUVAAC4EQAgaQAAuxEAIGoAALoRACDrAQAAuREAIOwBAAC8EQAgDe8FAACBCwAw8AUAAJkGABDxBQAAgQsAMPIFAQCdCgAh9wUBAJ0KACH4BQEAnQoAIfoFQACfCgAh-wVAAJ8KACHDBgEAnQoAIdMGAQCdCgAh9QYgAKsKACH9BhAAygoAIf4GEADKCgAhAwAAAHQAIAEAAJgGADBoAACZBgAgAwAAAHQAIAEAAHUAMAIAAHYAIAEAAABXACABAAAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIAMAAABVACABAABWADACAABXACADAAAAVQAgAQAAVgAwAgAAVwAgHAcAAOYOACAJAADnDgAgGQAAtw8AIBsAAOgOACAdAADpDgAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqgYAAAD7BgLCBhAAAAABwwYBAAAAAcQGAgAAAAHTBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QaAAAAAAe4GQAAAAAH3BgEAAAAB-QYAAAD5BgL7BgEAAAAB_AZAAAAAAQFcAAChBgAgF_IFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABngYBAAAAAaoGAAAA-wYCwgYQAAAAAcMGAQAAAAHEBgIAAAAB0wYBAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GgAAAAAHuBkAAAAAB9wYBAAAAAfkGAAAA-QYC-wYBAAAAAfwGQAAAAAEBXAAAowYAMAFcAACjBgAwHAcAAOEOACAJAADiDgAgGQAAtQ8AIBsAAOMOACAdAADkDgAg8gUBALAMACH3BQEAsAwAIfgFAQCwDAAh-gVAALIMACH7BUAAsgwAIZ4GAQCwDAAhqgYAAN8O-wYiwgYQALgOACHDBgEAsAwAIcQGAgC5DgAh0wYBALAMACHnBgEAsAwAIegGAQCxDAAh6QYBALEMACHqBgEAsQwAIesGAQCxDAAh7AYBALEMACHtBoAAAAAB7gZAAMgMACH3BgEAsAwAIfkGAADeDvkGIvsGAQCwDAAh_AZAALIMACECAAAAVwAgXAAApgYAIBfyBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAhngYBALAMACGqBgAA3w77BiLCBhAAuA4AIcMGAQCwDAAhxAYCALkOACHTBgEAsAwAIecGAQCwDAAh6AYBALEMACHpBgEAsQwAIeoGAQCxDAAh6wYBALEMACHsBgEAsQwAIe0GgAAAAAHuBkAAyAwAIfcGAQCwDAAh-QYAAN4O-QYi-wYBALAMACH8BkAAsgwAIQIAAABVACBcAACoBgAgAgAAAFUAIFwAAKgGACADAAAAVwAgYwAAoQYAIGQAAKYGACABAAAAVwAgAQAAAFUAIAwVAACzEQAgaQAAthEAIGoAALURACDrAQAAtBEAIOwBAAC3EQAg6AYAAKwMACDpBgAArAwAIOoGAACsDAAg6wYAAKwMACDsBgAArAwAIO0GAACsDAAg7gYAAKwMACAa7wUAAPoKADDwBQAArwYAEPEFAAD6CgAw8gUBAJ0KACH3BQEAnQoAIfgFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIZ4GAQCdCgAhqgYAAPwK-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-QYAIBAUAADtCgAg7wUAAOwKADDwBQAA_AYAEPEFAADsCgAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIaMGAQCwCgAh3wYBALEKACHgBgEAsAoAIeEGAACpCgAg4gYBALEKACHjBgEAsQoAIeQGAQCwCgAhBRQAAJMRACD4BQAArAwAIN8GAACsDAAg4gYAAKwMACDjBgAArAwAIAMAAAD8BgAgAQAA_QYAMAIAAPkGACADAAAA_AYAIAEAAP0GADACAAD5BgAgAwAAAPwGACABAAD9BgAwAgAA-QYAIA0UAACSEQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGjBgEAAAAB3wYBAAAAAeAGAQAAAAHhBgAAkREAIOIGAQAAAAHjBgEAAAAB5AYBAAAAAQFcAACBBwAgDPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABowYBAAAAAd8GAQAAAAHgBgEAAAAB4QYAAJERACDiBgEAAAAB4wYBAAAAAeQGAQAAAAEBXAAAgwcAMAFcAACDBwAwDRQAAIcRACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhowYBALAMACHfBgEAsQwAIeAGAQCwDAAh4QYAAIYRACDiBgEAsQwAIeMGAQCxDAAh5AYBALAMACECAAAA-QYAIFwAAIYHACAM8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIaMGAQCwDAAh3wYBALEMACHgBgEAsAwAIeEGAACGEQAg4gYBALEMACHjBgEAsQwAIeQGAQCwDAAhAgAAAPwGACBcAACIBwAgAgAAAPwGACBcAACIBwAgAwAAAPkGACBjAACBBwAgZAAAhgcAIAEAAAD5BgAgAQAAAPwGACAHFQAAgxEAIGkAAIURACBqAACEEQAg-AUAAKwMACDfBgAArAwAIOIGAACsDAAg4wYAAKwMACAP7wUAAOsKADDwBQAAjwcAEPEFAADrCgAw8gUBAJ0KACH3BQEAnQoAIfgFAQCeCgAh-gVAAJ8KACH7BUAAnwoAIaMGAQCdCgAh3wYBAJ4KACHgBgEAnQoAIeEGAACpCgAg4gYBAJ4KACHjBgEAngoAIeQGAQCdCgAhAwAAAPwGACABAACOBwAwaAAAjwcAIAMAAAD8BgAgAQAA_QYAMAIAAPkGACABAAAAHwAgAQAAAB8AIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIA8HAACBEQAgCQAAghEAIA0AAIARACAPAAD_EAAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGjBgEAAAAB0QYBAAAAAdsGAQAAAAHcBkAAAAAB3QYIAAAAAd4GCAAAAAEBXAAAlwcAIAvyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAaMGAQAAAAHRBgEAAAAB2wYBAAAAAdwGQAAAAAHdBggAAAAB3gYIAAAAAQFcAACZBwAwAVwAAJkHADAPBwAAzhAAIAkAAM8QACANAADNEAAgDwAAzBAAIPIFAQCwDAAh9wUBALAMACH4BQEAsAwAIfoFQACyDAAh-wVAALIMACGjBgEAsAwAIdEGAQCxDAAh2wYBALEMACHcBkAAyAwAId0GCADhDAAh3gYIAOEMACECAAAAHwAgXAAAnAcAIAvyBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAhowYBALAMACHRBgEAsQwAIdsGAQCxDAAh3AZAAMgMACHdBggA4QwAId4GCADhDAAhAgAAAB0AIFwAAJ4HACACAAAAHQAgXAAAngcAIAMAAAAfACBjAACXBwAgZAAAnAcAIAEAAAAfACABAAAAHQAgChUAAMcQACBpAADKEAAgagAAyRAAIOsBAADIEAAg7AEAAMsQACDRBgAArAwAINsGAACsDAAg3AYAAKwMACDdBgAArAwAIN4GAACsDAAgDu8FAADqCgAw8AUAAKUHABDxBQAA6goAMPIFAQCdCgAh9wUBAJ0KACH4BQEAnQoAIfoFQACfCgAh-wVAAJ8KACGjBgEAnQoAIdEGAQCeCgAh2wYBAJ4KACHcBkAAugoAId0GCADECgAh3gYIAMQKACEDAAAAHQAgAQAApAcAMGgAAKUHACADAAAAHQAgAQAAHgAwAgAAHwAgAQAAACwAIAEAAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACAQBwAA9w0AIAkAAPgNACAoAAD1DQAgKQAAqRAAICsAAPYNACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAbAGAQAAAAHLBgEAAAAB0QYBAAAAAdgGAQAAAAHZBgEAAAAB2gYBAAAAAQFcAACtBwAgC_IFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABsAYBAAAAAcsGAQAAAAHRBgEAAAAB2AYBAAAAAdkGAQAAAAHaBgEAAAABAVwAAK8HADABXAAArwcAMAEAAAAWACABAAAAGAAgEAcAAPINACAJAADzDQAgKAAA8A0AICkAAKcQACArAADxDQAg8gUBALAMACH3BQEAsQwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIbAGAQCwDAAhywYBALAMACHRBgEAsQwAIdgGAQCxDAAh2QYBALAMACHaBgEAsAwAIQIAAAAsACBcAAC0BwAgC_IFAQCwDAAh9wUBALEMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGwBgEAsAwAIcsGAQCwDAAh0QYBALEMACHYBgEAsQwAIdkGAQCwDAAh2gYBALAMACECAAAAKgAgXAAAtgcAIAIAAAAqACBcAAC2BwAgAQAAABYAIAEAAAAYACADAAAALAAgYwAArQcAIGQAALQHACABAAAALAAgAQAAACoAIAcVAADEEAAgaQAAxhAAIGoAAMUQACD3BQAArAwAIPgFAACsDAAg0QYAAKwMACDYBgAArAwAIA7vBQAA6QoAMPAFAAC_BwAQ8QUAAOkKADDyBQEAnQoAIfcFAQCeCgAh-AUBAJ4KACH6BUAAnwoAIfsFQACfCgAhsAYBAJ0KACHLBgEAnQoAIdEGAQCeCgAh2AYBAJ4KACHZBgEAnQoAIdoGAQCdCgAhAwAAACoAIAEAAL4HADBoAAC_BwAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAzACABAAAAMwAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgDwcAAKwQACAJAACtEAAgCwAAqxAAIBsAAMMQACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAA2AYCywYBAAAAAdEGAQAAAAHTBgEAAAAB1QYBAAAAAdYGAQAAAAEBXAAAxwcAIAvyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAA2AYCywYBAAAAAdEGAQAAAAHTBgEAAAAB1QYBAAAAAdYGAQAAAAEBXAAAyQcAMAFcAADJBwAwAQAAAC8AIAEAAAAWACABAAAAGAAgDwcAAJ0QACAJAACeEAAgCwAAnBAAIBsAAMIQACDyBQEAsAwAIfcFAQCxDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhqgYAAJoQ2AYiywYBALAMACHRBgEAsQwAIdMGAQCxDAAh1QYBALAMACHWBgEAsAwAIQIAAAAzACBcAADPBwAgC_IFAQCwDAAh9wUBALEMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGqBgAAmhDYBiLLBgEAsAwAIdEGAQCxDAAh0wYBALEMACHVBgEAsAwAIdYGAQCwDAAhAgAAADEAIFwAANEHACACAAAAMQAgXAAA0QcAIAEAAAAvACABAAAAFgAgAQAAABgAIAMAAAAzACBjAADHBwAgZAAAzwcAIAEAAAAzACABAAAAMQAgBxUAAL8QACBpAADBEAAgagAAwBAAIPcFAACsDAAg-AUAAKwMACDRBgAArAwAINMGAACsDAAgDu8FAADlCgAw8AUAANsHABDxBQAA5QoAMPIFAQCdCgAh9wUBAJ4KACH4BQEAngoAIfoFQACfCgAh-wVAAJ8KACGqBgAA5grYBiLLBgEAnQoAIdEGAQCeCgAh0wYBAJ4KACHVBgEAnQoAIdYGAQCdCgAhAwAAADEAIAEAANoHADBoAADbBwAgAwAAADEAIAEAADIAMAIAADMAIAEAAAA3ACABAAAANwAgAwAAADUAIAEAADYAMAIAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgEQcAAI0QACAJAACOEAAgDQAAihAAIBEAAIsQACAbAAC-EAAgJAAAjBAAICYAAI8QACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAHRBgEAAAAB0gYCAAAAAdMGAQAAAAHUBgEAAAABAVwAAOMHACAK8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAAB0QYBAAAAAdIGAgAAAAHTBgEAAAAB1AYBAAAAAQFcAADlBwAwAVwAAOUHADABAAAAGAAgAQAAAGsAIBEHAADrDwAgCQAA7A8AIA0AAOgPACARAADpDwAgGwAAvRAAICQAAOoPACAmAADtDwAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAh0QYBALEMACHSBgIA5g8AIdMGAQCwDAAh1AYBALEMACECAAAANwAgXAAA6gcAIAryBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACHRBgEAsQwAIdIGAgDmDwAh0wYBALAMACHUBgEAsQwAIQIAAAA1ACBcAADsBwAgAgAAADUAIFwAAOwHACABAAAAGAAgAQAAAGsAIAMAAAA3ACBjAADjBwAgZAAA6gcAIAEAAAA3ACABAAAANQAgCRUAALgQACBpAAC7EAAgagAAuhAAIOsBAAC5EAAg7AEAALwQACD4BQAArAwAINEGAACsDAAg0gYAAKwMACDUBgAArAwAIA3vBQAA4goAMPAFAAD1BwAQ8QUAAOIKADDyBQEAnQoAIfcFAQCdCgAh-AUBAJ4KACH6BUAAnwoAIfsFQACfCgAhywYBAJ0KACHRBgEAngoAIdIGAgDjCgAh0wYBAJ0KACHUBgEAngoAIQMAAAA1ACABAAD0BwAwaAAA9QcAIAMAAAA1ACABAAA2ADACAAA3ACANDAAA3QoAIA0AAN8KACAcAADhCgAgJQAA3goAICcAAOAKACDvBQAA3AoAMPAFAAAvABDxBQAA3AoAMPIFAQAAAAH3BQEAsAoAIcsGAQCwCgAhzAZAALQKACHNBkAAtAoAIQEAAAD4BwAgAQAAAPgHACAFDAAAsxAAIA0AALUQACAcAAC3EAAgJQAAtBAAICcAALYQACADAAAALwAgAQAA-wcAMAIAAPgHACADAAAALwAgAQAA-wcAMAIAAPgHACADAAAALwAgAQAA-wcAMAIAAPgHACAKDAAArhAAIA0AALAQACAcAACyEAAgJQAArxAAICcAALEQACDyBQEAAAAB9wUBAAAAAcsGAQAAAAHMBkAAAAABzQZAAAAAAQFcAAD_BwAgBfIFAQAAAAH3BQEAAAABywYBAAAAAcwGQAAAAAHNBkAAAAABAVwAAIEIADABXAAAgQgAMAoMAACoDwAgDQAAqg8AIBwAAKwPACAlAACpDwAgJwAAqw8AIPIFAQCwDAAh9wUBALAMACHLBgEAsAwAIcwGQACyDAAhzQZAALIMACECAAAA-AcAIFwAAIQIACAF8gUBALAMACH3BQEAsAwAIcsGAQCwDAAhzAZAALIMACHNBkAAsgwAIQIAAAAvACBcAACGCAAgAgAAAC8AIFwAAIYIACADAAAA-AcAIGMAAP8HACBkAACECAAgAQAAAPgHACABAAAALwAgAxUAAKUPACBpAACnDwAgagAApg8AIAjvBQAA2woAMPAFAACNCAAQ8QUAANsKADDyBQEAnQoAIfcFAQCdCgAhywYBAJ0KACHMBkAAnwoAIc0GQACfCgAhAwAAAC8AIAEAAIwIADBoAACNCAAgAwAAAC8AIAEAAPsHADACAAD4BwAgDRcAALUKACDvBQAA2goAMPAFAACsAgAQ8QUAANoKADDyBQEAAAAB-gVAALQKACH7BUAAtAoAIYgGAQCwCgAhiQYBALAKACGOBgAAsgoAIJAGIACzCgAhyQYBAAAAAcoGAACpCgAgAQAAAJAIACABAAAAkAgAIAEXAACXDgAgAwAAAKwCACABAACTCAAwAgAAkAgAIAMAAACsAgAgAQAAkwgAMAIAAJAIACADAAAArAIAIAEAAJMIADACAACQCAAgChcAAKQPACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGIBgEAAAABiQYBAAAAAY4GgAAAAAGQBiAAAAAByQYBAAAAAcoGAACjDwAgAVwAAJcIACAJ8gUBAAAAAfoFQAAAAAH7BUAAAAABiAYBAAAAAYkGAQAAAAGOBoAAAAABkAYgAAAAAckGAQAAAAHKBgAAow8AIAFcAACZCAAwAVwAAJkIADAKFwAAog8AIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIYgGAQCwDAAhiQYBALAMACGOBoAAAAABkAYgAJIOACHJBgEAsAwAIcoGAAChDwAgAgAAAJAIACBcAACcCAAgCfIFAQCwDAAh-gVAALIMACH7BUAAsgwAIYgGAQCwDAAhiQYBALAMACGOBoAAAAABkAYgAJIOACHJBgEAsAwAIcoGAAChDwAgAgAAAKwCACBcAACeCAAgAgAAAKwCACBcAACeCAAgAwAAAJAIACBjAACXCAAgZAAAnAgAIAEAAACQCAAgAQAAAKwCACADFQAAng8AIGkAAKAPACBqAACfDwAgDO8FAADZCgAw8AUAAKUIABDxBQAA2QoAMPIFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIYgGAQCdCgAhiQYBAJ0KACGOBgAAqgoAIJAGIACrCgAhyQYBAJ0KACHKBgAAqQoAIAMAAACsAgAgAQAApAgAMGgAAKUIACADAAAArAIAIAEAAJMIADACAACQCAAgAQAAAE0AIAEAAABNACADAAAASwAgAQAATAAwAgAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACAQFgAA-g4AIBcAAPsOACAYAAD8DgAgGQAAnQ8AIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZ4GAQAAAAGoBgEAAAABqgYAAADJBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAAckGAQAAAAEBXAAArQgAIAzyBQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqAYBAAAAAaoGAAAAyQYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAAa8GAQAAAAHJBgEAAAABAVwAAK8IADABXAAArwgAMAEAAABRACABAAAAUwAgEBYAAPYOACAXAAD3DgAgGAAA-A4AIBkAAJwPACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGeBgEAsQwAIagGAQCxDAAhqgYAAPQOyQYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACGvBgEAsQwAIckGAQCwDAAhAgAAAE0AIFwAALQIACAM8gUBALAMACH6BUAAsgwAIfsFQACyDAAhngYBALEMACGoBgEAsQwAIaoGAAD0DskGIqsGAQCxDAAhrAZAAMgMACGtBkAAsgwAIa4GAQCwDAAhrwYBALEMACHJBgEAsAwAIQIAAABLACBcAAC2CAAgAgAAAEsAIFwAALYIACABAAAAUQAgAQAAAFMAIAMAAABNACBjAACtCAAgZAAAtAgAIAEAAABNACABAAAASwAgCBUAAJkPACBpAACbDwAgagAAmg8AIJ4GAACsDAAgqAYAAKwMACCrBgAArAwAIKwGAACsDAAgrwYAAKwMACAP7wUAANUKADDwBQAAvwgAEPEFAADVCgAw8gUBAJ0KACH6BUAAnwoAIfsFQACfCgAhngYBAJ4KACGoBgEAngoAIaoGAADWCskGIqsGAQCeCgAhrAZAALoKACGtBkAAnwoAIa4GAQCdCgAhrwYBAJ4KACHJBgEAnQoAIQMAAABLACABAAC-CAAwaAAAvwgAIAMAAABLACABAABMADACAABNACABAAAAnQEAIAEAAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAAFMAIAEAAJwBADACAACdAQAgEAMAAJMPACAHAACRDwAgCQAAkg8AIA0AAJQPACATAACVDwAgGgAAlg8AIBwAAJcPACAiAACYDwAg8gUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAccGAQAAAAEBXAAAxwgAIAjyBQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABxwYBAAAAAQFcAADJCAAwAVwAAMkIADABAAAAGAAgEAMAAMMOACAHAADBDgAgCQAAwg4AIA0AAMQOACATAADFDgAgGgAAxg4AIBwAAMcOACAiAADIDgAg8gUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALEMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACHHBgEAsAwAIQIAAACdAQAgXAAAzQgAIAjyBQEAsAwAIfYFAQCxDAAh9wUBALAMACH4BQEAsQwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIccGAQCwDAAhAgAAAFMAIFwAAM8IACACAAAAUwAgXAAAzwgAIAEAAAAYACADAAAAnQEAIGMAAMcIACBkAADNCAAgAQAAAJ0BACABAAAAUwAgBRUAAL4OACBpAADADgAgagAAvw4AIPYFAACsDAAg-AUAAKwMACAL7wUAANQKADDwBQAA1wgAEPEFAADUCgAw8gUBAJ0KACH2BQEAngoAIfcFAQCdCgAh-AUBAJ4KACH5BQEAnQoAIfoFQACfCgAh-wVAAJ8KACHHBgEAnQoAIQMAAABTACABAADWCAAwaAAA1wgAIAMAAABTACABAACcAQAwAgAAnQEAIAEAAADbAQAgAQAAANsBACADAAAA2QEAIAEAANoBADACAADbAQAgAwAAANkBACABAADaAQAwAgAA2wEAIAMAAADZAQAgAQAA2gEAMAIAANsBACAOBwAAvA4AID4AAL0OACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAADCBgK-BgEAAAABwAYAAADABgLCBhAAAAABwwYBAAAAAcQGAgAAAAHFBkAAAAABxgZAAAAAAQFcAADfCAAgDPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAMIGAr4GAQAAAAHABgAAAMAGAsIGEAAAAAHDBgEAAAABxAYCAAAAAcUGQAAAAAHGBkAAAAABAVwAAOEIADABXAAA4QgAMAEAAADTAQAgDgcAALoOACA-AAC7DgAg8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGqBgAAtw7CBiK-BgEAsQwAIcAGAAC2DsAGIsIGEAC4DgAhwwYBALAMACHEBgIAuQ4AIcUGQACyDAAhxgZAALIMACECAAAA2wEAIFwAAOUIACAM8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGqBgAAtw7CBiK-BgEAsQwAIcAGAAC2DsAGIsIGEAC4DgAhwwYBALAMACHEBgIAuQ4AIcUGQACyDAAhxgZAALIMACECAAAA2QEAIFwAAOcIACACAAAA2QEAIFwAAOcIACABAAAA0wEAIAMAAADbAQAgYwAA3wgAIGQAAOUIACABAAAA2wEAIAEAAADZAQAgBhUAALEOACBpAAC0DgAgagAAsw4AIOsBAACyDgAg7AEAALUOACC-BgAArAwAIA_vBQAAxwoAMPAFAADvCAAQ8QUAAMcKADDyBQEAnQoAIfcFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIaoGAADJCsIGIr4GAQCeCgAhwAYAAMgKwAYiwgYQAMoKACHDBgEAnQoAIcQGAgDLCgAhxQZAAJ8KACHGBkAAnwoAIQMAAADZAQAgAQAA7ggAMGgAAO8IACADAAAA2QEAIAEAANoBADACAADbAQAgAQAAAK0BACABAAAArQEAIAMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAIkBACABAACsAQAwAgAArQEAIBgHAADoDAAgCQAA6QwAIBAAANcNACApAADnDAAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABsAYBAAAAAbEGCAAAAAGyBggAAAABswYIAAAAAbQGCAAAAAG1BggAAAABtgYIAAAAAbcGCAAAAAG4BggAAAABuQYIAAAAAboGCAAAAAG7BggAAAABvAYIAAAAAb0GCAAAAAEBXAAA9wgAIBTyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGwBgEAAAABsQYIAAAAAbIGCAAAAAGzBggAAAABtAYIAAAAAbUGCAAAAAG2BggAAAABtwYIAAAAAbgGCAAAAAG5BggAAAABugYIAAAAAbsGCAAAAAG8BggAAAABvQYIAAAAAQFcAAD5CAAwAVwAAPkIADABAAAAGAAgGAcAAOQMACAJAADlDAAgEAAA1g0AICkAAOMMACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhnAYBALAMACGwBgEAsAwAIbEGCADhDAAhsgYIAOEMACGzBggA4QwAIbQGCADhDAAhtQYIAOEMACG2BggA4QwAIbcGCADhDAAhuAYIAOEMACG5BggA4QwAIboGCADhDAAhuwYIAOEMACG8BggA4QwAIb0GCADhDAAhAgAAAK0BACBcAAD9CAAgFPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGcBgEAsAwAIbAGAQCwDAAhsQYIAOEMACGyBggA4QwAIbMGCADhDAAhtAYIAOEMACG1BggA4QwAIbYGCADhDAAhtwYIAOEMACG4BggA4QwAIbkGCADhDAAhugYIAOEMACG7BggA4QwAIbwGCADhDAAhvQYIAOEMACECAAAAiQEAIFwAAP8IACACAAAAiQEAIFwAAP8IACABAAAAGAAgAwAAAK0BACBjAAD3CAAgZAAA_QgAIAEAAACtAQAgAQAAAIkBACATFQAArA4AIGkAAK8OACBqAACuDgAg6wEAAK0OACDsAQAAsA4AIPgFAACsDAAgsQYAAKwMACCyBgAArAwAILMGAACsDAAgtAYAAKwMACC1BgAArAwAILYGAACsDAAgtwYAAKwMACC4BgAArAwAILkGAACsDAAgugYAAKwMACC7BgAArAwAILwGAACsDAAgvQYAAKwMACAX7wUAAMMKADDwBQAAhwkAEPEFAADDCgAw8gUBAJ0KACH3BQEAnQoAIfgFAQCeCgAh-gVAAJ8KACH7BUAAnwoAIZwGAQCdCgAhsAYBAJ0KACGxBggAxAoAIbIGCADECgAhswYIAMQKACG0BggAxAoAIbUGCADECgAhtgYIAMQKACG3BggAxAoAIbgGCADECgAhuQYIAMQKACG6BggAxAoAIbsGCADECgAhvAYIAMQKACG9BggAxAoAIQMAAACJAQAgAQAAhgkAMGgAAIcJACADAAAAiQEAIAEAAKwBADACAACtAQAgAQAAAKMBACABAAAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAKEBACABAACiAQAwAgAAowEAIBQHAAD_DAAgCQAAgA0AIBAAAKsOACAWAAD8DAAgGAAA_gwAIDMAAP0MACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGcBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAAa8GAQAAAAEBXAAAjwkAIA7yBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGcBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAAa8GAQAAAAEBXAAAkQkAMAFcAACRCQAwAQAAAFEAIAEAAAAOACABAAAAGAAgFAcAAPkMACAJAAD6DAAgEAAAqg4AIBYAAPYMACAYAAD4DAAgMwAA9wwAIPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGHBgEAsAwAIZwGAQCxDAAhqAYBALEMACGqBgAA9AyqBiKrBgEAsQwAIawGQADIDAAhrQZAALIMACGuBgEAsAwAIa8GAQCxDAAhAgAAAKMBACBcAACXCQAgDvIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGHBgEAsAwAIZwGAQCxDAAhqAYBALEMACGqBgAA9AyqBiKrBgEAsQwAIawGQADIDAAhrQZAALIMACGuBgEAsAwAIa8GAQCxDAAhAgAAAKEBACBcAACZCQAgAgAAAKEBACBcAACZCQAgAQAAAFEAIAEAAAAOACABAAAAGAAgAwAAAKMBACBjAACPCQAgZAAAlwkAIAEAAACjAQAgAQAAAKEBACAJFQAApw4AIGkAAKkOACBqAACoDgAg-AUAAKwMACCcBgAArAwAIKgGAACsDAAgqwYAAKwMACCsBgAArAwAIK8GAACsDAAgEe8FAAC_CgAw8AUAAKMJABDxBQAAvwoAMPIFAQCdCgAh9wUBAJ0KACH4BQEAngoAIfoFQACfCgAh-wVAAJ8KACGHBgEAnQoAIZwGAQCeCgAhqAYBAJ4KACGqBgAAwAqqBiKrBgEAngoAIawGQAC6CgAhrQZAAJ8KACGuBgEAnQoAIa8GAQCeCgAhAwAAAKEBACABAACiCQAwaAAAowkAIAMAAAChAQAgAQAAogEAMAIAAKMBACABAAAAQQAgAQAAAEEAIAMAAAA_ACABAABAADACAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIBAHAAClDQAgCQAApg0AIA4AAKQNACAQAACmDgAgIwAApw0AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZwGAQAAAAGjBgEAAAABpAYBAAAAAaYGAAAApgYCpwZAAAAAAQFcAACrCQAgC_IFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZwGAQAAAAGjBgEAAAABpAYBAAAAAaYGAAAApgYCpwZAAAAAAQFcAACtCQAwAVwAAK0JADABAAAAGAAgEAcAAI4NACAJAACPDQAgDgAAjQ0AIBAAAKUOACAjAACQDQAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhnAYBALAMACGjBgEAsAwAIaQGAQCxDAAhpgYAAIsNpgYipwZAAMgMACECAAAAQQAgXAAAsQkAIAvyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGcBgEAsAwAIaMGAQCwDAAhpAYBALEMACGmBgAAiw2mBiKnBkAAyAwAIQIAAAA_ACBcAACzCQAgAgAAAD8AIFwAALMJACABAAAAGAAgAwAAAEEAIGMAAKsJACBkAACxCQAgAQAAAEEAIAEAAAA_ACAGFQAAog4AIGkAAKQOACBqAACjDgAg-AUAAKwMACCkBgAArAwAIKcGAACsDAAgDu8FAAC4CgAw8AUAALsJABDxBQAAuAoAMPIFAQCdCgAh9wUBAJ0KACH4BQEAngoAIfoFQACfCgAh-wVAAJ8KACGaBgEAnQoAIZwGAQCdCgAhowYBAJ0KACGkBgEAngoAIaYGAAC5CqYGIqcGQAC6CgAhAwAAAD8AIAEAALoJADBoAAC7CQAgAwAAAD8AIAEAAEAAMAIAAEEAIAEAAABGACABAAAARgAgAwAAAEQAIAEAAEUAMAIAAEYAIAMAAABEACABAABFADACAABGACADAAAARAAgAQAARQAwAgAARgAgDwcAAKENACAJAACiDQAgEgAAoQ4AIBkAAKANACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZ0GAQAAAAGeBgEAAAABnwYBAAAAAaAGAQAAAAGhBgEAAAABogZAAAAAAQFcAADDCQAgC_IFAQAAAAH3BQEAAAAB-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_AkAIAIAAACoAgAgXAAA_AkAIAMAAADuCQAgYwAA9QkAIGQAAPoJACABAAAA7gkAIAEAAACoAgAgBBUAAI0OACBpAACPDgAgagAAjg4AIIsGAACsDAAgEO8FAACoCgAw8AUAAIMKABDxBQAAqAoAMPIFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIYcGAQCdCgAhiAYBAJ0KACGJBgEAnQoAIYoGAQCdCgAhiwYBAJ4KACGMBgAAqQoAII0GAACpCgAgjgYAAKoKACCPBgAAqgoAIJAGIACrCgAhAwAAAKgCACABAACCCgAwaAAAgwoAIAMAAACoAgAgAQAA8QkAMAIAAO4JACABAAAAEAAgAQAAABAAIAMAAAAOACABAAAPADACAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIBMDAACMDgAgBwAAhA4AIAkAAIsOACANAACFDgAgEQAAhg4AICIAAIoOACAkAACHDgAgSgAAiA4AIEsAAIkOACDyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABAVwAAIsKACAK8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAQFcAACNCgAwAVwAAI0KADATAwAAuwwAIAcAALMMACAJAAC6DAAgDQAAtAwAIBEAALUMACAiAAC5DAAgJAAAtgwAIEoAALcMACBLAAC4DAAg8gUBALAMACHzBQEAsAwAIfQFAQCwDAAh9QUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALAMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACECAAAAEAAgXAAAkAoAIAryBQEAsAwAIfMFAQCwDAAh9AUBALAMACH1BQEAsAwAIfYFAQCxDAAh9wUBALAMACH4BQEAsAwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIQIAAAAOACBcAACSCgAgAgAAAA4AIFwAAJIKACADAAAAEAAgYwAAiwoAIGQAAJAKACABAAAAEAAgAQAAAA4AIAQVAACtDAAgaQAArwwAIGoAAK4MACD2BQAArAwAIA3vBQAAnAoAMPAFAACZCgAQ8QUAAJwKADDyBQEAnQoAIfMFAQCdCgAh9AUBAJ0KACH1BQEAnQoAIfYFAQCeCgAh9wUBAJ0KACH4BQEAnQoAIfkFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIQMAAAAOACABAACYCgAwaAAAmQoAIAMAAAAOACABAAAPADACAAAQACAN7wUAAJwKADDwBQAAmQoAEPEFAACcCgAw8gUBAJ0KACHzBQEAnQoAIfQFAQCdCgAh9QUBAJ0KACH2BQEAngoAIfcFAQCdCgAh-AUBAJ0KACH5BQEAnQoAIfoFQACfCgAh-wVAAJ8KACEOFQAAoQoAIGkAAKcKACBqAACnCgAg_AUBAAAAAf0FAQAAAAT-BQEAAAAE_wUBAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAYMGAQCmCgAhhAYBAAAAAYUGAQAAAAGGBgEAAAABDhUAAKQKACBpAAClCgAgagAApQoAIPwFAQAAAAH9BQEAAAAF_gUBAAAABf8FAQAAAAGABgEAAAABgQYBAAAAAYIGAQAAAAGDBgEAowoAIYQGAQAAAAGFBgEAAAABhgYBAAAAAQsVAAChCgAgaQAAogoAIGoAAKIKACD8BUAAAAAB_QVAAAAABP4FQAAAAAT_BUAAAAABgAZAAAAAAYEGQAAAAAGCBkAAAAABgwZAAKAKACELFQAAoQoAIGkAAKIKACBqAACiCgAg_AVAAAAAAf0FQAAAAAT-BUAAAAAE_wVAAAAAAYAGQAAAAAGBBkAAAAABggZAAAAAAYMGQACgCgAhCPwFAgAAAAH9BQIAAAAE_gUCAAAABP8FAgAAAAGABgIAAAABgQYCAAAAAYIGAgAAAAGDBgIAoQoAIQj8BUAAAAAB_QVAAAAABP4FQAAAAAT_BUAAAAABgAZAAAAAAYEGQAAAAAGCBkAAAAABgwZAAKIKACEOFQAApAoAIGkAAKUKACBqAAClCgAg_AUBAAAAAf0FAQAAAAX-BQEAAAAF_wUBAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAYMGAQCjCgAhhAYBAAAAAYUGAQAAAAGGBgEAAAABCPwFAgAAAAH9BQIAAAAF_gUCAAAABf8FAgAAAAGABgIAAAABgQYCAAAAAYIGAgAAAAGDBgIApAoAIQv8BQEAAAAB_QUBAAAABf4FAQAAAAX_BQEAAAABgAYBAAAAAYEGAQAAAAGCBgEAAAABgwYBAKUKACGEBgEAAAABhQYBAAAAAYYGAQAAAAEOFQAAoQoAIGkAAKcKACBqAACnCgAg_AUBAAAAAf0FAQAAAAT-BQEAAAAE_wUBAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAYMGAQCmCgAhhAYBAAAAAYUGAQAAAAGGBgEAAAABC_wFAQAAAAH9BQEAAAAE_gUBAAAABP8FAQAAAAGABgEAAAABgQYBAAAAAYIGAQAAAAGDBgEApwoAIYQGAQAAAAGFBgEAAAABhgYBAAAAARDvBQAAqAoAMPAFAACDCgAQ8QUAAKgKADDyBQEAnQoAIfoFQACfCgAh-wVAAJ8KACGHBgEAnQoAIYgGAQCdCgAhiQYBAJ0KACGKBgEAnQoAIYsGAQCeCgAhjAYAAKkKACCNBgAAqQoAII4GAACqCgAgjwYAAKoKACCQBiAAqwoAIQT8BQEAAAAFlwYBAAAAAZgGAQAAAASZBgEAAAAEDxUAAKEKACBpAACuCgAgagAArgoAIPwFgAAAAAH_BYAAAAABgAaAAAAAAYEGgAAAAAGCBoAAAAABgwaAAAAAAZEGAQAAAAGSBgEAAAABkwYBAAAAAZQGgAAAAAGVBoAAAAABlgaAAAAAAQUVAAChCgAgaQAArQoAIGoAAK0KACD8BSAAAAABgwYgAKwKACEFFQAAoQoAIGkAAK0KACBqAACtCgAg_AUgAAAAAYMGIACsCgAhAvwFIAAAAAGDBiAArQoAIQz8BYAAAAAB_wWAAAAAAYAGgAAAAAGBBoAAAAABggaAAAAAAYMGgAAAAAGRBgEAAAABkgYBAAAAAZMGAQAAAAGUBoAAAAABlQaAAAAAAZYGgAAAAAERMwAAtQoAIO8FAACvCgAw8AUAAKgCABDxBQAArwoAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIYcGAQCwCgAhiAYBALAKACGJBgEAsAoAIYoGAQCwCgAhiwYBALEKACGMBgAAqQoAII0GAACpCgAgjgYAALIKACCPBgAAsgoAIJAGIACzCgAhC_wFAQAAAAH9BQEAAAAE_gUBAAAABP8FAQAAAAGABgEAAAABgQYBAAAAAYIGAQAAAAGDBgEApwoAIYQGAQAAAAGFBgEAAAABhgYBAAAAAQv8BQEAAAAB_QUBAAAABf4FAQAAAAX_BQEAAAABgAYBAAAAAYEGAQAAAAGCBgEAAAABgwYBAKUKACGEBgEAAAABhQYBAAAAAYYGAQAAAAEM_AWAAAAAAf8FgAAAAAGABoAAAAABgQaAAAAAAYIGgAAAAAGDBoAAAAABkQYBAAAAAZIGAQAAAAGTBgEAAAABlAaAAAAAAZUGgAAAAAGWBoAAAAABAvwFIAAAAAGDBiAArQoAIQj8BUAAAAAB_QVAAAAABP4FQAAAAAT_BUAAAAABgAZAAAAAAYEGQAAAAAGCBkAAAAABgwZAAKIKACEmBAAAwgsAIAUAAMMLACAGAACkCwAgEAAApQsAIBkAAKYLACA0AADwCgAgQAAAqAsAIEwAAKgLACBNAADwCgAgTgAAxAsAIE8AAO0KACBQAADtCgAgUQAAxQsAIFIAAMYLACBTAACxCwAgVAAAsQsAIFUAALALACBWAADHCwAg7wUAAMELADDwBQAAUQAQ8QUAAMELADDyBQEAsAoAIfYFAQCxCgAh-gVAALQKACH7BUAAtAoAIcsGAQCwCgAhggcBALAKACG-BwEAsAoAIb8HIACzCgAhwAcBALEKACHBBwEAsQoAIcIHAQCxCgAhwwcBALEKACHEBwEAsQoAIcUHAQCxCgAhxgcBALAKACHSBwAAUQAg0wcAAFEAIAvvBQAAtgoAMPAFAADrCQAQ8QUAALYKADDyBQEAnQoAIfcFAQCdCgAh-AUBAJ4KACH6BUAAnwoAIfsFQACfCgAhmgYBAJ0KACGbBgEAnQoAIZwGAQCdCgAhDu8FAAC3CgAw8AUAANMJABDxBQAAtwoAMPIFAQCdCgAh9wUBAJ0KACH4BQEAngoAIfoFQACfCgAh-wVAAJ8KACGdBgEAnQoAIZ4GAQCdCgAhnwYBAJ4KACGgBgEAngoAIaEGAQCeCgAhogZAAJ8KACEO7wUAALgKADDwBQAAuwkAEPEFAAC4CgAw8gUBAJ0KACH3BQEAnQoAIfgFAQCeCgAh-gVAAJ8KACH7BUAAnwoAIZoGAQCdCgAhnAYBAJ0KACGjBgEAnQoAIaQGAQCeCgAhpgYAALkKpgYipwZAALoKACEHFQAAoQoAIGkAAL4KACBqAAC-CgAg_AUAAACmBgL9BQAAAKYGCP4FAAAApgYIgwYAAL0KpgYiCxUAAKQKACBpAAC8CgAgagAAvAoAIPwFQAAAAAH9BUAAAAAF_gVAAAAABf8FQAAAAAGABkAAAAABgQZAAAAAAYIGQAAAAAGDBkAAuwoAIQsVAACkCgAgaQAAvAoAIGoAALwKACD8BUAAAAAB_QVAAAAABf4FQAAAAAX_BUAAAAABgAZAAAAAAYEGQAAAAAGCBkAAAAABgwZAALsKACEI_AVAAAAAAf0FQAAAAAX-BUAAAAAF_wVAAAAAAYAGQAAAAAGBBkAAAAABggZAAAAAAYMGQAC8CgAhBxUAAKEKACBpAAC-CgAgagAAvgoAIPwFAAAApgYC_QUAAACmBgj-BQAAAKYGCIMGAAC9CqYGIgT8BQAAAKYGAv0FAAAApgYI_gUAAACmBgiDBgAAvgqmBiIR7wUAAL8KADDwBQAAowkAEPEFAAC_CgAw8gUBAJ0KACH3BQEAnQoAIfgFAQCeCgAh-gVAAJ8KACH7BUAAnwoAIYcGAQCdCgAhnAYBAJ4KACGoBgEAngoAIaoGAADACqoGIqsGAQCeCgAhrAZAALoKACGtBkAAnwoAIa4GAQCdCgAhrwYBAJ4KACEHFQAAoQoAIGkAAMIKACBqAADCCgAg_AUAAACqBgL9BQAAAKoGCP4FAAAAqgYIgwYAAMEKqgYiBxUAAKEKACBpAADCCgAgagAAwgoAIPwFAAAAqgYC_QUAAACqBgj-BQAAAKoGCIMGAADBCqoGIgT8BQAAAKoGAv0FAAAAqgYI_gUAAACqBgiDBgAAwgqqBiIX7wUAAMMKADDwBQAAhwkAEPEFAADDCgAw8gUBAJ0KACH3BQEAnQoAIfgFAQCeCgAh-gVAAJ8KACH7BUAAnwoAIZwGAQCdCgAhsAYBAJ0KACGxBggAxAoAIbIGCADECgAhswYIAMQKACG0BggAxAoAIbUGCADECgAhtgYIAMQKACG3BggAxAoAIbgGCADECgAhuQYIAMQKACG6BggAxAoAIbsGCADECgAhvAYIAMQKACG9BggAxAoAIQ0VAACkCgAgaQAAxgoAIGoAAMYKACDrAQAAxgoAIOwBAADGCgAg_AUIAAAAAf0FCAAAAAX-BQgAAAAF_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCADFCgAhDRUAAKQKACBpAADGCgAgagAAxgoAIOsBAADGCgAg7AEAAMYKACD8BQgAAAAB_QUIAAAABf4FCAAAAAX_BQgAAAABgAYIAAAAAYEGCAAAAAGCBggAAAABgwYIAMUKACEI_AUIAAAAAf0FCAAAAAX-BQgAAAAF_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCADGCgAhD-8FAADHCgAw8AUAAO8IABDxBQAAxwoAMPIFAQCdCgAh9wUBAJ0KACH6BUAAnwoAIfsFQACfCgAhqgYAAMkKwgYivgYBAJ4KACHABgAAyArABiLCBhAAygoAIcMGAQCdCgAhxAYCAMsKACHFBkAAnwoAIcYGQACfCgAhBxUAAKEKACBpAADTCgAgagAA0woAIPwFAAAAwAYC_QUAAADABgj-BQAAAMAGCIMGAADSCsAGIgcVAAChCgAgaQAA0QoAIGoAANEKACD8BQAAAMIGAv0FAAAAwgYI_gUAAADCBgiDBgAA0ArCBiINFQAAoQoAIGkAAM8KACBqAADPCgAg6wEAAM8KACDsAQAAzwoAIPwFEAAAAAH9BRAAAAAE_gUQAAAABP8FEAAAAAGABhAAAAABgQYQAAAAAYIGEAAAAAGDBhAAzgoAIQ0VAAChCgAgaQAAoQoAIGoAAKEKACDrAQAAzQoAIOwBAAChCgAg_AUCAAAAAf0FAgAAAAT-BQIAAAAE_wUCAAAAAYAGAgAAAAGBBgIAAAABggYCAAAAAYMGAgDMCgAhDRUAAKEKACBpAAChCgAgagAAoQoAIOsBAADNCgAg7AEAAKEKACD8BQIAAAAB_QUCAAAABP4FAgAAAAT_BQIAAAABgAYCAAAAAYEGAgAAAAGCBgIAAAABgwYCAMwKACEI_AUIAAAAAf0FCAAAAAT-BQgAAAAE_wUIAAAAAYAGCAAAAAGBBggAAAABggYIAAAAAYMGCADNCgAhDRUAAKEKACBpAADPCgAgagAAzwoAIOsBAADPCgAg7AEAAM8KACD8BRAAAAAB_QUQAAAABP4FEAAAAAT_BRAAAAABgAYQAAAAAYEGEAAAAAGCBhAAAAABgwYQAM4KACEI_AUQAAAAAf0FEAAAAAT-BRAAAAAE_wUQAAAAAYAGEAAAAAGBBhAAAAABggYQAAAAAYMGEADPCgAhBxUAAKEKACBpAADRCgAgagAA0QoAIPwFAAAAwgYC_QUAAADCBgj-BQAAAMIGCIMGAADQCsIGIgT8BQAAAMIGAv0FAAAAwgYI_gUAAADCBgiDBgAA0QrCBiIHFQAAoQoAIGkAANMKACBqAADTCgAg_AUAAADABgL9BQAAAMAGCP4FAAAAwAYIgwYAANIKwAYiBPwFAAAAwAYC_QUAAADABgj-BQAAAMAGCIMGAADTCsAGIgvvBQAA1AoAMPAFAADXCAAQ8QUAANQKADDyBQEAnQoAIfYFAQCeCgAh9wUBAJ0KACH4BQEAngoAIfkFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIccGAQCdCgAhD-8FAADVCgAw8AUAAL8IABDxBQAA1QoAMPIFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIZ4GAQCeCgAhqAYBAJ4KACGqBgAA1grJBiKrBgEAngoAIawGQAC6CgAhrQZAAJ8KACGuBgEAnQoAIa8GAQCeCgAhyQYBAJ0KACEHFQAAoQoAIGkAANgKACBqAADYCgAg_AUAAADJBgL9BQAAAMkGCP4FAAAAyQYIgwYAANcKyQYiBxUAAKEKACBpAADYCgAgagAA2AoAIPwFAAAAyQYC_QUAAADJBgj-BQAAAMkGCIMGAADXCskGIgT8BQAAAMkGAv0FAAAAyQYI_gUAAADJBgiDBgAA2ArJBiIM7wUAANkKADDwBQAApQgAEPEFAADZCgAw8gUBAJ0KACH6BUAAnwoAIfsFQACfCgAhiAYBAJ0KACGJBgEAnQoAIY4GAACqCgAgkAYgAKsKACHJBgEAnQoAIcoGAACpCgAgDRcAALUKACDvBQAA2goAMPAFAACsAgAQ8QUAANoKADDyBQEAsAoAIfoFQAC0CgAh-wVAALQKACGIBgEAsAoAIYkGAQCwCgAhjgYAALIKACCQBiAAswoAIckGAQCwCgAhygYAAKkKACAI7wUAANsKADDwBQAAjQgAEPEFAADbCgAw8gUBAJ0KACH3BQEAnQoAIcsGAQCdCgAhzAZAAJ8KACHNBkAAnwoAIQ0MAADdCgAgDQAA3woAIBwAAOEKACAlAADeCgAgJwAA4AoAIO8FAADcCgAw8AUAAC8AEPEFAADcCgAw8gUBALAKACH3BQEAsAoAIcsGAQCwCgAhzAZAALQKACHNBkAAtAoAIQPOBgAAMQAgzwYAADEAINAGAAAxACADzgYAADUAIM8GAAA1ACDQBgAANQAgA84GAAAmACDPBgAAJgAg0AYAACYAIAPOBgAAdAAgzwYAAHQAINAGAAB0ACADzgYAAFUAIM8GAABVACDQBgAAVQAgDe8FAADiCgAw8AUAAPUHABDxBQAA4goAMPIFAQCdCgAh9wUBAJ0KACH4BQEAngoAIfoFQACfCgAh-wVAAJ8KACHLBgEAnQoAIdEGAQCeCgAh0gYCAOMKACHTBgEAnQoAIdQGAQCeCgAhDRUAAKQKACBpAACkCgAgagAApAoAIOsBAADGCgAg7AEAAKQKACD8BQIAAAAB_QUCAAAABf4FAgAAAAX_BQIAAAABgAYCAAAAAYEGAgAAAAGCBgIAAAABgwYCAOQKACENFQAApAoAIGkAAKQKACBqAACkCgAg6wEAAMYKACDsAQAApAoAIPwFAgAAAAH9BQIAAAAF_gUCAAAABf8FAgAAAAGABgIAAAABgQYCAAAAAYIGAgAAAAGDBgIA5AoAIQ7vBQAA5QoAMPAFAADbBwAQ8QUAAOUKADDyBQEAnQoAIfcFAQCeCgAh-AUBAJ4KACH6BUAAnwoAIfsFQACfCgAhqgYAAOYK2AYiywYBAJ0KACHRBgEAngoAIdMGAQCeCgAh1QYBAJ0KACHWBgEAnQoAIQcVAAChCgAgaQAA6AoAIGoAAOgKACD8BQAAANgGAv0FAAAA2AYI_gUAAADYBgiDBgAA5wrYBiIHFQAAoQoAIGkAAOgKACBqAADoCgAg_AUAAADYBgL9BQAAANgGCP4FAAAA2AYIgwYAAOcK2AYiBPwFAAAA2AYC_QUAAADYBgj-BQAAANgGCIMGAADoCtgGIg7vBQAA6QoAMPAFAAC_BwAQ8QUAAOkKADDyBQEAnQoAIfcFAQCeCgAh-AUBAJ4KACH6BUAAnwoAIfsFQACfCgAhsAYBAJ0KACHLBgEAnQoAIdEGAQCeCgAh2AYBAJ4KACHZBgEAnQoAIdoGAQCdCgAhDu8FAADqCgAw8AUAAKUHABDxBQAA6goAMPIFAQCdCgAh9wUBAJ0KACH4BQEAnQoAIfoFQACfCgAh-wVAAJ8KACGjBgEAnQoAIdEGAQCeCgAh2wYBAJ4KACHcBkAAugoAId0GCADECgAh3gYIAMQKACEP7wUAAOsKADDwBQAAjwcAEPEFAADrCgAw8gUBAJ0KACH3BQEAnQoAIfgFAQCeCgAh-gVAAJ8KACH7BUAAnwoAIaMGAQCdCgAh3wYBAJ4KACHgBgEAnQoAIeEGAACpCgAg4gYBAJ4KACHjBgEAngoAIeQGAQCdCgAhEBQAAO0KACDvBQAA7AoAMPAFAAD8BgAQ8QUAAOwKADDyBQEAsAoAIfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhowYBALAKACHfBgEAsQoAIeAGAQCwCgAh4QYAAKkKACDiBgEAsQoAIeMGAQCxCgAh5AYBALAKACEDzgYAAEsAIM8GAABLACDQBgAASwAgD-8FAADuCgAw8AUAAPYGABDxBQAA7goAMPIFAQCdCgAh9wUBAJ0KACH4BQEAngoAIfoFQACfCgAh-wVAAJ8KACGjBgEAnQoAId8GAQCeCgAh4AYBAJ0KACHhBgAAqQoAIOIGAQCeCgAh4wYBAJ4KACHkBgEAnQoAIRAUAADwCgAg7wUAAO8KADDwBQAA4wYAEPEFAADvCgAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIaMGAQCwCgAh3wYBALEKACHgBgEAsAoAIeEGAACpCgAg4gYBALEKACHjBgEAsQoAIeQGAQCwCgAhA84GAAChAQAgzwYAAKEBACDQBgAAoQEAIBXvBQAA8QoAMPAFAADdBgAQ8QUAAPEKADDyBQEAnQoAIfcFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIaoGAADyCucGIsAGAADICsAGIsIGEADKCgAhwwYBAJ0KACHEBgIAywoAIeUGAQCdCgAh5wYBAJ0KACHoBgEAngoAIekGAQCeCgAh6gYBAJ4KACHrBgEAngoAIewGAQCeCgAh7QYAAPMKACDuBkAAugoAIQcVAAChCgAgaQAA9goAIGoAAPYKACD8BQAAAOcGAv0FAAAA5wYI_gUAAADnBgiDBgAA9QrnBiIPFQAApAoAIGkAAPQKACBqAAD0CgAg_AWAAAAAAf8FgAAAAAGABoAAAAABgQaAAAAAAYIGgAAAAAGDBoAAAAABkQYBAAAAAZIGAQAAAAGTBgEAAAABlAaAAAAAAZUGgAAAAAGWBoAAAAABDPwFgAAAAAH_BYAAAAABgAaAAAAAAYEGgAAAAAGCBoAAAAABgwaAAAAAAZEGAQAAAAGSBgEAAAABkwYBAAAAAZQGgAAAAAGVBoAAAAABlgaAAAAAAQcVAAChCgAgaQAA9goAIGoAAPYKACD8BQAAAOcGAv0FAAAA5wYI_gUAAADnBgiDBgAA9QrnBiIE_AUAAADnBgL9BQAAAOcGCP4FAAAA5wYIgwYAAPYK5wYiD-8FAAD3CgAw8AUAAMcGABDxBQAA9woAMPIFAQCdCgAh9wUBAJ0KACH6BUAAnwoAIfsFQACfCgAh7wYBAJ0KACHwBgEAnQoAIfEGAQCdCgAh8gYBAJ0KACHzBgEAnQoAIfQGAQCdCgAh9QYgAKsKACH2BgEAngoAIRAHAAD5CgAg7wUAAPgKADDwBQAA5QEAEPEFAAD4CgAw8gUBALAKACH3BQEAsAoAIfoFQAC0CgAh-wVAALQKACHvBgEAsAoAIfAGAQCwCgAh8QYBALAKACHyBgEAsAoAIfMGAQCwCgAh9AYBALAKACH1BiAAswoAIfYGAQCxCgAhJwYAAKQLACAMAADdCgAgDQAA3woAIBEAAKcLACAcAADhCgAgJQAA3goAICcAAOAKACAqAACvCwAgLgAAoAsAIC8AAKELACAwAACjCwAgMQAApQsAIDIAAKYLACA0AADwCgAgNQAAqQsAIDYAAKoLACA3AACrCwAgOgAAnwsAIDsAAKILACA_AACuCwAgQAAAqAsAIEEAAKwLACBCAACtCwAgRwAAsAsAIEgAALELACBJAACxCwAg7wUAAJ0LADDwBQAAFgAQ8QUAAJ0LADDyBQEAsAoAIfoFQAC0CgAh-wVAALQKACGmBgAAnguTByPLBgEAsAoAIdEGAQCxCgAhkQcBALEKACGUBwEAsQoAIdIHAAAWACDTBwAAFgAgGu8FAAD6CgAw8AUAAK8GABDxBQAA-goAMPIFAQCdCgAh9wUBAJ0KACH4BQEAnQoAIfoFQACfCgAh-wVAAJ8KACGeBgEAnQoAIaoGAAD8CvsGIsIGEADKCgAhwwYBAJ0KACHEBgIAywoAIdMGAQCdCgAh5wYBAJ0KACHoBgEAngoAIekGAQCeCgAh6gYBAJ4KACHrBgEAngoAIewGAQCeCgAh7QYAAPMKACDuBkAAugoAIfcGAQCdCgAh-QYAAPsK-QYi-wYBAJ0KACH8BkAAnwoAIQcVAAChCgAgaQAAgAsAIGoAAIALACD8BQAAAPkGAv0FAAAA-QYI_gUAAAD5BgiDBgAA_wr5BiIHFQAAoQoAIGkAAP4KACBqAAD-CgAg_AUAAAD7BgL9BQAAAPsGCP4FAAAA-wYIgwYAAP0K-wYiBxUAAKEKACBpAAD-CgAgagAA_goAIPwFAAAA-wYC_QUAAAD7Bgj-BQAAAPsGCIMGAAD9CvsGIgT8BQAAAPsGAv0FAAAA-wYI_gUAAAD7BgiDBgAA_gr7BiIHFQAAoQoAIGkAAIALACBqAACACwAg_AUAAAD5BgL9BQAAAPkGCP4FAAAA-QYIgwYAAP8K-QYiBPwFAAAA-QYC_QUAAAD5Bgj-BQAAAPkGCIMGAACAC_kGIg3vBQAAgQsAMPAFAACZBgAQ8QUAAIELADDyBQEAnQoAIfcFAQCdCgAh-AUBAJ0KACH6BUAAnwoAIfsFQACfCgAhwwYBAJ0KACHTBgEAnQoAIfUGIACrCgAh_QYQAMoKACH-BhAAygoAIQfvBQAAggsAMPAFAACDBgAQ8QUAAIILADDyBQEAnQoAIfkFAQCdCgAh_wYBAJ0KACGAB0AAnwoAIQfvBQAAgwsAMPAFAADtBQAQ8QUAAIMLADDyBQEAnQoAIfoFQACfCgAh_wYBAJ0KACGCBwAAhAuCByIHFQAAoQoAIGkAAIYLACBqAACGCwAg_AUAAACCBwL9BQAAAIIHCP4FAAAAggcIgwYAAIULggciBxUAAKEKACBpAACGCwAgagAAhgsAIPwFAAAAggcC_QUAAACCBwj-BQAAAIIHCIMGAACFC4IHIgT8BQAAAIIHAv0FAAAAggcI_gUAAACCBwiDBgAAhguCByIL7wUAAIcLADDwBQAA1wUAEPEFAACHCwAw8gUBAJ0KACH3BQEAnQoAIfoFQACfCgAh-wVAAJ8KACGjBgEAnQoAIaQGAQCdCgAhgwcBAJ0KACGEBwAAhAuCByIT7wUAAIgLADDwBQAAwQUAEPEFAACICwAw8gUBAJ0KACH6BUAAnwoAIfsFQACfCgAhnAYBAJ4KACGeBgEAngoAIaoGAACKC4gHIqwGQAC6CgAhrwYBAJ4KACGGBwAAiQuGByKIBwEAnQoAIYkHAQCdCgAhigcBAJ0KACGLBwEAngoAIYwHAQCeCgAhjQcBAJ4KACGOB0AAnwoAIQcVAAChCgAgaQAAjgsAIGoAAI4LACD8BQAAAIYHAv0FAAAAhgcI_gUAAACGBwiDBgAAjQuGByIHFQAAoQoAIGkAAIwLACBqAACMCwAg_AUAAACIBwL9BQAAAIgHCP4FAAAAiAcIgwYAAIsLiAciBxUAAKEKACBpAACMCwAgagAAjAsAIPwFAAAAiAcC_QUAAACIBwj-BQAAAIgHCIMGAACLC4gHIgT8BQAAAIgHAv0FAAAAiAcI_gUAAACIBwiDBgAAjAuIByIHFQAAoQoAIGkAAI4LACBqAACOCwAg_AUAAACGBwL9BQAAAIYHCP4FAAAAhgcIgwYAAI0LhgciBPwFAAAAhgcC_QUAAACGBwj-BQAAAIYHCIMGAACOC4YHIh7vBQAAjwsAMPAFAACjBQAQ8QUAAI8LADDyBQEAnQoAIfcFAQCeCgAh-gVAAJ8KACH7BUAAnwoAIaoGAACTC6MHIqwGQAC6CgAh0QYBAJ4KACGPBwEAnQoAIZAHAQCdCgAhkQcBAJ4KACGTBwAAkAuTByOUBwEAngoAIZUHAACRC8AGI5YHEACSCwAhlwcBAJ0KACGYBwIA4woAIZkHAADyCucGIpoHAQCeCgAhmwcBAJ4KACGcBwEAngoAIZ0HAQCeCgAhngcBAJ4KACGfBwEAngoAIaAHAADzCgAgoQdAALoKACGjBwEAngoAIaQHAQCeCgAhBxUAAKQKACBpAACbCwAgagAAmwsAIPwFAAAAkwcD_QUAAACTBwn-BQAAAJMHCYMGAACaC5MHIwcVAACkCgAgaQAAmQsAIGoAAJkLACD8BQAAAMAGA_0FAAAAwAYJ_gUAAADABgmDBgAAmAvABiMNFQAApAoAIGkAAJcLACBqAACXCwAg6wEAAJcLACDsAQAAlwsAIPwFEAAAAAH9BRAAAAAF_gUQAAAABf8FEAAAAAGABhAAAAABgQYQAAAAAYIGEAAAAAGDBhAAlgsAIQcVAAChCgAgaQAAlQsAIGoAAJULACD8BQAAAKMHAv0FAAAAowcI_gUAAACjBwiDBgAAlAujByIHFQAAoQoAIGkAAJULACBqAACVCwAg_AUAAACjBwL9BQAAAKMHCP4FAAAAowcIgwYAAJQLowciBPwFAAAAowcC_QUAAACjBwj-BQAAAKMHCIMGAACVC6MHIg0VAACkCgAgaQAAlwsAIGoAAJcLACDrAQAAlwsAIOwBAACXCwAg_AUQAAAAAf0FEAAAAAX-BRAAAAAF_wUQAAAAAYAGEAAAAAGBBhAAAAABggYQAAAAAYMGEACWCwAhCPwFEAAAAAH9BRAAAAAF_gUQAAAABf8FEAAAAAGABhAAAAABgQYQAAAAAYIGEAAAAAGDBhAAlwsAIQcVAACkCgAgaQAAmQsAIGoAAJkLACD8BQAAAMAGA_0FAAAAwAYJ_gUAAADABgmDBgAAmAvABiME_AUAAADABgP9BQAAAMAGCf4FAAAAwAYJgwYAAJkLwAYjBxUAAKQKACBpAACbCwAgagAAmwsAIPwFAAAAkwcD_QUAAACTBwn-BQAAAJMHCYMGAACaC5MHIwT8BQAAAJMHA_0FAAAAkwcJ_gUAAACTBwmDBgAAmwuTByML7wUAAJwLADDwBQAAiQUAEPEFAACcCwAw8gUBAJ0KACH6BUAAnwoAIfsFQACfCgAhpgYAAJALkwcjywYBAJ0KACHRBgEAngoAIZEHAQCeCgAhlAcBAJ4KACElBgAApAsAIAwAAN0KACANAADfCgAgEQAApwsAIBwAAOEKACAlAADeCgAgJwAA4AoAICoAAK8LACAuAACgCwAgLwAAoQsAIDAAAKMLACAxAAClCwAgMgAApgsAIDQAAPAKACA1AACpCwAgNgAAqgsAIDcAAKsLACA6AACfCwAgOwAAogsAID8AAK4LACBAAACoCwAgQQAArAsAIEIAAK0LACBHAACwCwAgSAAAsQsAIEkAALELACDvBQAAnQsAMPAFAAAWABDxBQAAnQsAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIaYGAACeC5MHI8sGAQCwCgAh0QYBALEKACGRBwEAsQoAIZQHAQCxCgAhBPwFAAAAkwcD_QUAAACTBwn-BQAAAJMHCYMGAACbC5MHIwPOBgAAEgAgzwYAABIAINAGAAASACADzgYAAB0AIM8GAAAdACDQBgAAHQAgA84GAABrACDPBgAAawAg0AYAAGsAIAPOBgAAyAEAIM8GAADIAQAg0AYAAMgBACADzgYAACEAIM8GAAAhACDQBgAAIQAgA84GAAALACDPBgAACwAg0AYAAAsAIAPOBgAADgAgzwYAAA4AINAGAAAOACADzgYAAFMAIM8GAABTACDQBgAAUwAgA84GAAA6ACDPBgAAOgAg0AYAADoAIAPOBgAA0wEAIM8GAADTAQAg0AYAANMBACADzgYAAD8AIM8GAAA_ACDQBgAAPwAgA84GAABEACDPBgAARAAg0AYAAEQAIAPOBgAAiQEAIM8GAACJAQAg0AYAAIkBACASBwAA-QoAIO8FAAD4CgAw8AUAAOUBABDxBQAA-AoAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAh7wYBALAKACHwBgEAsAoAIfEGAQCwCgAh8gYBALAKACHzBgEAsAoAIfQGAQCwCgAh9QYgALMKACH2BgEAsQoAIdIHAADlAQAg0wcAAOUBACADzgYAAOcBACDPBgAA5wEAINAGAADnAQAgA84GAADZAQAgzwYAANkBACDQBgAA2QEAIAPOBgAAKgAgzwYAACoAINAGAAAqACADzgYAAO4BACDPBgAA7gEAINAGAADuAQAgA84GAABbACDPBgAAWwAg0AYAAFsAIArvBQAAsgsAMPAFAADxBAAQ8QUAALILADDyBQEAnQoAIfcFAQCeCgAh-gVAAJ8KACH7BUAAnwoAIdEGAQCeCgAhkQcBAJ4KACGlBwEAnQoAIQrvBQAAswsAMPAFAADZBAAQ8QUAALMLADDyBQEAnQoAIfoFQACfCgAh-wVAAJ8KACHRBgEAngoAIeIGAQCeCgAhkQcBAJ4KACGlBwEAnQoAIQ_vBQAAtAsAMPAFAADBBAAQ8QUAALQLADDyBQEAnQoAIfcFAQCdCgAh-AUBAJ4KACH6BUAAnwoAIfsFQACfCgAhmgYBAJ0KACGbBgEAnQoAIZwGAQCdCgAhngYBAJ0KACHTBgEAnQoAIeMGAQCeCgAhpgdAAJ8KACEN7wUAALULADDwBQAApwQAEPEFAAC1CwAw8gUBAJ0KACH3BQEAnQoAIfgFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIdEGAQCeCgAh3QYCAOMKACHjBgEAngoAIacHAQCdCgAhqAcBAJ0KACEM7wUAALYLADDwBQAAjwQAEPEFAAC2CwAw8gUBAJ0KACH3BQEAnQoAIfoFQACfCgAh-wVAAJ8KACHLBgEAngoAIakHAQCdCgAhqgcBAJ0KACGrBwIAywoAIa0HAAC3C60HIgcVAAChCgAgaQAAuQsAIGoAALkLACD8BQAAAK0HAv0FAAAArQcI_gUAAACtBwiDBgAAuAutByIHFQAAoQoAIGkAALkLACBqAAC5CwAg_AUAAACtBwL9BQAAAK0HCP4FAAAArQcIgwYAALgLrQciBPwFAAAArQcC_QUAAACtBwj-BQAAAK0HCIMGAAC5C60HIgrvBQAAugsAMPAFAAD5AwAQ8QUAALoLADDyBQEAnQoAIfcFAQCdCgAh-AUBAJ4KACH6BUAAnwoAIfsFQACfCgAhywYBAJ0KACHRBgEAngoAIQnvBQAAuwsAMPAFAADhAwAQ8QUAALsLADDyBQEAnQoAIfkFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIa4HAQCdCgAhrwdAAJ8KACEJ7wUAALwLADDwBQAAywMAEPEFAAC8CwAw8gUBAJ0KACH6BUAAnwoAIfsFQACfCgAhrwdAAJ8KACGwBwEAnQoAIbEHAQCdCgAhCe8FAAC9CwAw8AUAALgDABDxBQAAvQsAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIa8HQAC0CgAhsAcBALAKACGxBwEAsAoAIRDvBQAAvgsAMPAFAACyAwAQ8QUAAL4LADDyBQEAnQoAIfkFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIbIHAQCdCgAhswcBAJ0KACG0BwEAngoAIbUHAQCeCgAhtgcBAJ4KACG3B0AAugoAIbgHQAC6CgAhuQcBAJ4KACG6BwEAngoAIQvvBQAAvwsAMPAFAACcAwAQ8QUAAL8LADDyBQEAnQoAIfkFAQCdCgAh-gVAAJ8KACH7BUAAnwoAIa8HQACfCgAhuwcBAJ0KACG8BwEAngoAIb0HAQCeCgAhEu8FAADACwAw8AUAAIYDABDxBQAAwAsAMPIFAQCdCgAh9gUBAJ4KACH6BUAAnwoAIfsFQACfCgAhywYBAJ0KACGCBwEAnQoAIb4HAQCdCgAhvwcgAKsKACHABwEAngoAIcEHAQCeCgAhwgcBAJ4KACHDBwEAngoAIcQHAQCeCgAhxQcBAJ4KACHGBwEAnQoAISQEAADCCwAgBQAAwwsAIAYAAKQLACAQAAClCwAgGQAApgsAIDQAAPAKACBAAACoCwAgTAAAqAsAIE0AAPAKACBOAADECwAgTwAA7QoAIFAAAO0KACBRAADFCwAgUgAAxgsAIFMAALELACBUAACxCwAgVQAAsAsAIFYAAMcLACDvBQAAwQsAMPAFAABRABDxBQAAwQsAMPIFAQCwCgAh9gUBALEKACH6BUAAtAoAIfsFQAC0CgAhywYBALAKACGCBwEAsAoAIb4HAQCwCgAhvwcgALMKACHABwEAsQoAIcEHAQCxCgAhwgcBALEKACHDBwEAsQoAIcQHAQCxCgAhxQcBALEKACHGBwEAsAoAIQPOBgAAAwAgzwYAAAMAINAGAAADACADzgYAAAcAIM8GAAAHACDQBgAABwAgEzMAALUKACDvBQAArwoAMPAFAACoAgAQ8QUAAK8KADDyBQEAsAoAIfoFQAC0CgAh-wVAALQKACGHBgEAsAoAIYgGAQCwCgAhiQYBALAKACGKBgEAsAoAIYsGAQCxCgAhjAYAAKkKACCNBgAAqQoAII4GAACyCgAgjwYAALIKACCQBiAAswoAIdIHAACoAgAg0wcAAKgCACAPFwAAtQoAIO8FAADaCgAw8AUAAKwCABDxBQAA2goAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIYgGAQCwCgAhiQYBALAKACGOBgAAsgoAIJAGIACzCgAhyQYBALAKACHKBgAAqQoAINIHAACsAgAg0wcAAKwCACADzgYAAK4CACDPBgAArgIAINAGAACuAgAgA84GAAD2AQAgzwYAAPYBACDQBgAA9gEAIAnvBQAAyAsAMPAFAADuAgAQ8QUAAMgLADDyBQEAnQoAIfoFQACfCgAh-wVAAJ8KACGqBgAAyQvJByKwBgEAnQoAIccHQACfCgAhBxUAAKEKACBpAADLCwAgagAAywsAIPwFAAAAyQcC_QUAAADJBwj-BQAAAMkHCIMGAADKC8kHIgcVAAChCgAgaQAAywsAIGoAAMsLACD8BQAAAMkHAv0FAAAAyQcI_gUAAADJBwiDBgAAygvJByIE_AUAAADJBwL9BQAAAMkHCP4FAAAAyQcIgwYAAMsLyQciCe8FAADMCwAw8AUAANgCABDxBQAAzAsAMPIFAQCdCgAh9wUBAJ0KACH5BQEAnQoAIfoFQACfCgAh-wVAAJ8KACGCBwAAzQvKByIHFQAAoQoAIGkAAM8LACBqAADPCwAg_AUAAADKBwL9BQAAAMoHCP4FAAAAygcIgwYAAM4LygciBxUAAKEKACBpAADPCwAgagAAzwsAIPwFAAAAygcC_QUAAADKBwj-BQAAAMoHCIMGAADOC8oHIgT8BQAAAMoHAv0FAAAAygcI_gUAAADKBwiDBgAAzwvKByIKAwAAtQoAIO8FAADQCwAw8AUAAK4CABDxBQAA0AsAMPIFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhrgcBALAKACGvB0AAtAoAIQL5BQEAAAAB_wYBAAAAAQkDAAC1CgAgRAAA0wsAIO8FAADSCwAw8AUAAPYBABDxBQAA0gsAMPIFAQCwCgAh-QUBALAKACH_BgEAsAoAIYAHQAC0CgAhEQcAAPkKACBDAAC1CgAgRQAA2AsAIEYAAMcLACDvBQAA1wsAMPAFAADuAQAQ8QUAANcLADDyBQEAsAoAIfcFAQCwCgAh-gVAALQKACH7BUAAtAoAIaMGAQCwCgAhpAYBALAKACGDBwEAsAoAIYQHAADWC4IHItIHAADuAQAg0wcAAO4BACAC_wYBAAAAAYIHAAAAggcCCEQAANMLACDvBQAA1QsAMPAFAADyAQAQ8QUAANULADDyBQEAsAoAIfoFQAC0CgAh_wYBALAKACGCBwAA1guCByIE_AUAAACCBwL9BQAAAIIHCP4FAAAAggcIgwYAAIYLggciDwcAAPkKACBDAAC1CgAgRQAA2AsAIEYAAMcLACDvBQAA1wsAMPAFAADuAQAQ8QUAANcLADDyBQEAsAoAIfcFAQCwCgAh-gVAALQKACH7BUAAtAoAIaMGAQCwCgAhpAYBALAKACGDBwEAsAoAIYQHAADWC4IHIgPOBgAA8gEAIM8GAADyAQAg0AYAAPIBACAWBwAA-QoAIO8FAADZCwAw8AUAAOcBABDxBQAA2QsAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhqgYAAN0L5wYiwAYAANoLwAYiwgYQANsLACHDBgEAsAoAIcQGAgDcCwAh5QYBALAKACHnBgEAsAoAIegGAQCxCgAh6QYBALEKACHqBgEAsQoAIesGAQCxCgAh7AYBALEKACHtBgAA3gsAIO4GQADfCwAhBPwFAAAAwAYC_QUAAADABgj-BQAAAMAGCIMGAADTCsAGIgj8BRAAAAAB_QUQAAAABP4FEAAAAAT_BRAAAAABgAYQAAAAAYEGEAAAAAGCBhAAAAABgwYQAM8KACEI_AUCAAAAAf0FAgAAAAT-BQIAAAAE_wUCAAAAAYAGAgAAAAGBBgIAAAABggYCAAAAAYMGAgChCgAhBPwFAAAA5wYC_QUAAADnBgj-BQAAAOcGCIMGAAD2CucGIgz8BYAAAAAB_wWAAAAAAYAGgAAAAAGBBoAAAAABggaAAAAAAYMGgAAAAAGRBgEAAAABkgYBAAAAAZMGAQAAAAGUBoAAAAABlQaAAAAAAZYGgAAAAAEI_AVAAAAAAf0FQAAAAAX-BUAAAAAF_wVAAAAAAYAGQAAAAAGBBkAAAAABggZAAAAAAYMGQAC8CgAhEQcAAPkKACA-AADiCwAg7wUAAOALADDwBQAA2QEAEPEFAADgCwAw8gUBALAKACH3BQEAsAoAIfoFQAC0CgAh-wVAALQKACGqBgAA4QvCBiK-BgEAsQoAIcAGAADaC8AGIsIGEADbCwAhwwYBALAKACHEBgIA3AsAIcUGQAC0CgAhxgZAALQKACEE_AUAAADCBgL9BQAAAMIGCP4FAAAAwgYIgwYAANEKwgYiJAcAAOkLACA8AAC1CgAgPQAA6AsAID8AAK4LACDvBQAA4wsAMPAFAADTAQAQ8QUAAOMLADDyBQEAsAoAIfcFAQCxCgAh-gVAALQKACH7BUAAtAoAIaoGAADnC6MHIqwGQADfCwAh0QYBALEKACGPBwEAsAoAIZAHAQCwCgAhkQcBALEKACGTBwAAnguTByOUBwEAsQoAIZUHAADkC8AGI5YHEADlCwAhlwcBALAKACGYBwIA5gsAIZkHAADdC-cGIpoHAQCxCgAhmwcBALEKACGcBwEAsQoAIZ0HAQCxCgAhngcBALEKACGfBwEAsQoAIaAHAADeCwAgoQdAAN8LACGjBwEAsQoAIaQHAQCxCgAh0gcAANMBACDTBwAA0wEAICIHAADpCwAgPAAAtQoAID0AAOgLACA_AACuCwAg7wUAAOMLADDwBQAA0wEAEPEFAADjCwAw8gUBALAKACH3BQEAsQoAIfoFQAC0CgAh-wVAALQKACGqBgAA5wujByKsBkAA3wsAIdEGAQCxCgAhjwcBALAKACGQBwEAsAoAIZEHAQCxCgAhkwcAAJ4LkwcjlAcBALEKACGVBwAA5AvABiOWBxAA5QsAIZcHAQCwCgAhmAcCAOYLACGZBwAA3QvnBiKaBwEAsQoAIZsHAQCxCgAhnAcBALEKACGdBwEAsQoAIZ4HAQCxCgAhnwcBALEKACGgBwAA3gsAIKEHQADfCwAhowcBALEKACGkBwEAsQoAIQT8BQAAAMAGA_0FAAAAwAYJ_gUAAADABgmDBgAAmQvABiMI_AUQAAAAAf0FEAAAAAX-BRAAAAAF_wUQAAAAAYAGEAAAAAGBBhAAAAABggYQAAAAAYMGEACXCwAhCPwFAgAAAAH9BQIAAAAF_gUCAAAABf8FAgAAAAGABgIAAAABgQYCAAAAAYIGAgAAAAGDBgIApAoAIQT8BQAAAKMHAv0FAAAAowcI_gUAAACjBwiDBgAAlQujByImBAAAwgsAIAUAAMMLACAGAACkCwAgEAAApQsAIBkAAKYLACA0AADwCgAgQAAAqAsAIEwAAKgLACBNAADwCgAgTgAAxAsAIE8AAO0KACBQAADtCgAgUQAAxQsAIFIAAMYLACBTAACxCwAgVAAAsQsAIFUAALALACBWAADHCwAg7wUAAMELADDwBQAAUQAQ8QUAAMELADDyBQEAsAoAIfYFAQCxCgAh-gVAALQKACH7BUAAtAoAIcsGAQCwCgAhggcBALAKACG-BwEAsAoAIb8HIACzCgAhwAcBALEKACHBBwEAsQoAIcIHAQCxCgAhwwcBALEKACHEBwEAsQoAIcUHAQCxCgAhxgcBALAKACHSBwAAUQAg0wcAAFEAICcGAACkCwAgDAAA3QoAIA0AAN8KACARAACnCwAgHAAA4QoAICUAAN4KACAnAADgCgAgKgAArwsAIC4AAKALACAvAAChCwAgMAAAowsAIDEAAKULACAyAACmCwAgNAAA8AoAIDUAAKkLACA2AACqCwAgNwAAqwsAIDoAAJ8LACA7AACiCwAgPwAArgsAIEAAAKgLACBBAACsCwAgQgAArQsAIEcAALALACBIAACxCwAgSQAAsQsAIO8FAACdCwAw8AUAABYAEPEFAACdCwAw8gUBALAKACH6BUAAtAoAIfsFQAC0CgAhpgYAAJ4LkwcjywYBALAKACHRBgEAsQoAIZEHAQCxCgAhlAcBALEKACHSBwAAFgAg0wcAABYAIA4HAAD5CgAgKgAArwsAIO8FAADqCwAw8AUAAMgBABDxBQAA6gsAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhywYBALEKACGpBwEAsAoAIaoHAQCwCgAhqwcCANwLACGtBwAA6wutByIE_AUAAACtBwL9BQAAAK0HCP4FAAAArQcIgwYAALkLrQciGwcAAPkKACAJAADwCwAgEAAA7wsAICkAAO4LACDvBQAA7AsAMPAFAACJAQAQ8QUAAOwLADDyBQEAsAoAIfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhnAYBALAKACGwBgEAsAoAIbEGCADtCwAhsgYIAO0LACGzBggA7QsAIbQGCADtCwAhtQYIAO0LACG2BggA7QsAIbcGCADtCwAhuAYIAO0LACG5BggA7QsAIboGCADtCwAhuwYIAO0LACG8BggA7QsAIb0GCADtCwAhCPwFCAAAAAH9BQgAAAAF_gUIAAAABf8FCAAAAAGABggAAAABgQYIAAAAAYIGCAAAAAGDBggAxgoAIRwHAAD5CgAgCQAA8AsAIAoAAKAMACALAACvCwAgDgAAkQwAIA8AAJQMACAQAADvCwAgGQAAhgwAIBsAAP4LACAsAACeDAAgLQAAnwwAIO8FAACdDAAw8AUAACYAEPEFAACdDAAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIZoGAQCwCgAhmwYBALAKACGcBgEAsAoAIZ4GAQCwCgAh0wYBALAKACHjBgEAsQoAIaYHQAC0CgAh0gcAACYAINMHAAAmACAYAwAAtQoAIAcAAPkKACAJAAD9CwAgDQAA3woAIBEAAKcLACAiAACxCwAgJAAAqQsAIEoAAPAKACBLAACrCwAg7wUAAKcMADDwBQAADgAQ8QUAAKcMADDyBQEAsAoAIfMFAQCwCgAh9AUBALAKACH1BQEAsAoAIfYFAQCxCgAh9wUBALAKACH4BQEAsAoAIfkFAQCwCgAh-gVAALQKACH7BUAAtAoAIdIHAAAOACDTBwAADgAgHggAAKQMACAMAADdCgAgDQAA3woAIBEAAKcLACAcAADhCgAgJQAA3goAICcAAOAKACAqAACvCwAgLgAAoAsAIC8AAKELACAwAACjCwAgMQAApQsAIDIAAKYLACA0AADwCgAgNQAAqQsAIDYAAKoLACA3AACrCwAgOAAAsQsAIO8FAACjDAAw8AUAABgAEPEFAACjDAAw8gUBALAKACH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACHiBgEAsQoAIZEHAQCxCgAhpQcBALAKACHSBwAAGAAg0wcAABgAIAKHBgEAAAABrgYBAAAAARcHAAD5CgAgCQAA8AsAIBAAAPULACAWAAD0CwAgGAAA6AsAIDMAALUKACDvBQAA8gsAMPAFAAChAQAQ8QUAAPILADDyBQEAsAoAIfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhhwYBALAKACGcBgEAsQoAIagGAQCxCgAhqgYAAPMLqgYiqwYBALEKACGsBkAA3wsAIa0GQAC0CgAhrgYBALAKACGvBgEAsQoAIQT8BQAAAKoGAv0FAAAAqgYI_gUAAACqBgiDBgAAwgqqBiISFAAA8AoAIO8FAADvCgAw8AUAAOMGABDxBQAA7woAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGjBgEAsAoAId8GAQCxCgAh4AYBALAKACHhBgAAqQoAIOIGAQCxCgAh4wYBALEKACHkBgEAsAoAIdIHAADjBgAg0wcAAOMGACAYAwAAtQoAIAcAAPkKACAJAAD9CwAgDQAA3woAIBEAAKcLACAiAACxCwAgJAAAqQsAIEoAAPAKACBLAACrCwAg7wUAAKcMADDwBQAADgAQ8QUAAKcMADDyBQEAsAoAIfMFAQCwCgAh9AUBALAKACH1BQEAsAoAIfYFAQCxCgAh9wUBALAKACH4BQEAsAoAIfkFAQCwCgAh-gVAALQKACH7BUAAtAoAIdIHAAAOACDTBwAADgAgEwMAALUKACAHAAD5CgAgCQAA8AsAIA0AAN8KACATAACqCwAgGgAA7QoAIBwAAOEKACAiAACxCwAg7wUAAPYLADDwBQAAUwAQ8QUAAPYLADDyBQEAsAoAIfYFAQCxCgAh9wUBALAKACH4BQEAsQoAIfkFAQCwCgAh-gVAALQKACH7BUAAtAoAIccGAQCwCgAhDQcAAPkKACAJAADwCwAgJQAA3goAIO8FAAD3CwAw8AUAAGsAEPEFAAD3CwAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIcsGAQCwCgAh0QYBALEKACECsAYBAAAAAccHQAAAAAEKKQAA7gsAIO8FAAD5CwAw8AUAAIUBABDxBQAA-QsAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIaoGAAD6C8kHIrAGAQCwCgAhxwdAALQKACEE_AUAAADJBwL9BQAAAMkHCP4FAAAAyQcIgwYAAMsLyQciAvgFAQAAAAHTBgEAAAABEQcAAPkKACAJAAD9CwAgGwAA_gsAIBwAAOEKACDvBQAA_AsAMPAFAAB0ABDxBQAA_AsAMPIFAQCwCgAh9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACHDBgEAsAoAIdMGAQCwCgAh9QYgALMKACH9BhAA2wsAIf4GEADbCwAhHggAAKQMACAMAADdCgAgDQAA3woAIBEAAKcLACAcAADhCgAgJQAA3goAICcAAOAKACAqAACvCwAgLgAAoAsAIC8AAKELACAwAACjCwAgMQAApQsAIDIAAKYLACA0AADwCgAgNQAAqQsAIDYAAKoLACA3AACrCwAgOAAAsQsAIO8FAACjDAAw8AUAABgAEPEFAACjDAAw8gUBALAKACH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACHiBgEAsQoAIZEHAQCxCgAhpQcBALAKACHSBwAAGAAg0wcAABgAIA8MAADdCgAgDQAA3woAIBwAAOEKACAlAADeCgAgJwAA4AoAIO8FAADcCgAw8AUAAC8AEPEFAADcCgAw8gUBALAKACH3BQEAsAoAIcsGAQCwCgAhzAZAALQKACHNBkAAtAoAIdIHAAAvACDTBwAALwAgGhAAAPULACAYAADoCwAgGQAAggwAIB4AAPkKACAfAAD5CgAgIAAAtQoAICEAAPALACDvBQAA_wsAMPAFAABbABDxBQAA_wsAMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIZwGAQCxCgAhngYBALEKACGqBgAAgQyIByKsBkAA3wsAIa8GAQCxCgAhhgcAAIAMhgciiAcBALAKACGJBwEAsAoAIYoHAQCwCgAhiwcBALEKACGMBwEAsQoAIY0HAQCxCgAhjgdAALQKACEE_AUAAACGBwL9BQAAAIYHCP4FAAAAhgcIgwYAAI4LhgciBPwFAAAAiAcC_QUAAACIBwj-BQAAAIgHCIMGAACMC4gHIhUDAAC1CgAgBwAA-QoAIAkAAPALACANAADfCgAgEwAAqgsAIBoAAO0KACAcAADhCgAgIgAAsQsAIO8FAAD2CwAw8AUAAFMAEPEFAAD2CwAw8gUBALAKACH2BQEAsQoAIfcFAQCwCgAh-AUBALEKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACHHBgEAsAoAIdIHAABTACDTBwAAUwAgHwcAAPkKACAJAAD9CwAgGQAAhgwAIBsAAP4LACAdAACHDAAg7wUAAIMMADDwBQAAVQAQ8QUAAIMMADDyBQEAsAoAIfcFAQCwCgAh-AUBALAKACH6BUAAtAoAIfsFQAC0CgAhngYBALAKACGqBgAAhQz7BiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHTBgEAsAoAIecGAQCwCgAh6AYBALEKACHpBgEAsQoAIeoGAQCxCgAh6wYBALEKACHsBgEAsQoAIe0GAADeCwAg7gZAAN8LACH3BgEAsAoAIfkGAACEDPkGIvsGAQCwCgAh_AZAALQKACEE_AUAAAD5BgL9BQAAAPkGCP4FAAAA-QYIgwYAAIAL-QYiBPwFAAAA-wYC_QUAAAD7Bgj-BQAAAPsGCIMGAAD-CvsGIhUDAAC1CgAgBwAA-QoAIAkAAPALACANAADfCgAgEwAAqgsAIBoAAO0KACAcAADhCgAgIgAAsQsAIO8FAAD2CwAw8AUAAFMAEPEFAAD2CwAw8gUBALAKACH2BQEAsQoAIfcFAQCwCgAh-AUBALEKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACHHBgEAsAoAIdIHAABTACDTBwAAUwAgEwcAAPkKACAJAAD9CwAgGwAA_gsAIBwAAOEKACDvBQAA_AsAMPAFAAB0ABDxBQAA_AsAMPIFAQCwCgAh9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACHDBgEAsAoAIdMGAQCwCgAh9QYgALMKACH9BhAA2wsAIf4GEADbCwAh0gcAAHQAINMHAAB0ACACrgYBAAAAAckGAQAAAAETFgAAiwwAIBcAALUKACAYAADoCwAgGQAAggwAIO8FAACJDAAw8AUAAEsAEPEFAACJDAAw8gUBALAKACH6BUAAtAoAIfsFQAC0CgAhngYBALEKACGoBgEAsQoAIaoGAACKDMkGIqsGAQCxCgAhrAZAAN8LACGtBkAAtAoAIa4GAQCwCgAhrwYBALEKACHJBgEAsAoAIQT8BQAAAMkGAv0FAAAAyQYI_gUAAADJBgiDBgAA2ArJBiISFAAA7QoAIO8FAADsCgAw8AUAAPwGABDxBQAA7AoAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGjBgEAsAoAId8GAQCxCgAh4AYBALAKACHhBgAAqQoAIOIGAQCxCgAh4wYBALEKACHkBgEAsAoAIdIHAAD8BgAg0wcAAPwGACACnQYBAAAAAZ4GAQAAAAESBwAA-QoAIAkAAPALACASAACODAAgGQAAhgwAIO8FAACNDAAw8AUAAEQAEPEFAACNDAAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIZ0GAQCwCgAhngYBALAKACGfBgEAsQoAIaAGAQCxCgAhoQYBALEKACGiBkAAtAoAIRUHAAD5CgAgCQAA8AsAIA4AAJEMACAQAADvCwAgIwAAqgsAIO8FAACPDAAw8AUAAD8AEPEFAACPDAAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIZoGAQCwCgAhnAYBALAKACGjBgEAsAoAIaQGAQCxCgAhpgYAAJAMpgYipwZAAN8LACHSBwAAPwAg0wcAAD8AIBMHAAD5CgAgCQAA8AsAIA4AAJEMACAQAADvCwAgIwAAqgsAIO8FAACPDAAw8AUAAD8AEPEFAACPDAAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIZoGAQCwCgAhnAYBALAKACGjBgEAsAoAIaQGAQCxCgAhpgYAAJAMpgYipwZAAN8LACEE_AUAAACmBgL9BQAAAKYGCP4FAAAApgYIgwYAAL4KpgYiFgcAAPkKACAJAADwCwAgDQAA3woAIBEAAKcLACAbAAD-CwAgJAAAqQsAICYAAJYMACDvBQAAlQwAMPAFAAA1ABDxBQAAlQwAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACHLBgEAsAoAIdEGAQCxCgAh0gYCAOYLACHTBgEAsAoAIdQGAQCxCgAh0gcAADUAINMHAAA1ACACmgYBAAAAAZsGAQAAAAEQBwAA-QoAIAkAAPALACAOAACRDAAgDwAAlAwAIBAAAO8LACDvBQAAkwwAMPAFAAA6ABDxBQAAkwwAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGaBgEAsAoAIZsGAQCwCgAhnAYBALAKACEUBwAA-QoAIAkAAP0LACAKAACgDAAgDQAA3woAIBEAAKcLACDvBQAAoQwAMPAFAAAhABDxBQAAoQwAMPIFAQCwCgAh9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACHRBgEAsQoAId0GAgDmCwAh4wYBALEKACGnBwEAsAoAIagHAQCwCgAh0gcAACEAINMHAAAhACAUBwAA-QoAIAkAAPALACANAADfCgAgEQAApwsAIBsAAP4LACAkAACpCwAgJgAAlgwAIO8FAACVDAAw8AUAADUAEPEFAACVDAAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIcsGAQCwCgAh0QYBALEKACHSBgIA5gsAIdMGAQCwCgAh1AYBALEKACEPBwAA-QoAIAkAAPALACAlAADeCgAg7wUAAPcLADDwBQAAawAQ8QUAAPcLADDyBQEAsAoAIfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhywYBALAKACHRBgEAsQoAIdIHAABrACDTBwAAawAgEgcAAOkLACAJAADwCwAgCwAArwsAIBsAAJkMACDvBQAAlwwAMPAFAAAxABDxBQAAlwwAMPIFAQCwCgAh9wUBALEKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGqBgAAmAzYBiLLBgEAsAoAIdEGAQCxCgAh0wYBALEKACHVBgEAsAoAIdYGAQCwCgAhBPwFAAAA2AYC_QUAAADYBgj-BQAAANgGCIMGAADoCtgGIg8MAADdCgAgDQAA3woAIBwAAOEKACAlAADeCgAgJwAA4AoAIO8FAADcCgAw8AUAAC8AEPEFAADcCgAw8gUBALAKACH3BQEAsAoAIcsGAQCwCgAhzAZAALQKACHNBkAAtAoAIdIHAAAvACDTBwAALwAgEwcAAOkLACAJAADwCwAgKAAAmwwAICkAAO4LACArAACcDAAg7wUAAJoMADDwBQAAKgAQ8QUAAJoMADDyBQEAsAoAIfcFAQCxCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhsAYBALAKACHLBgEAsAoAIdEGAQCxCgAh2AYBALEKACHZBgEAsAoAIdoGAQCwCgAhFAcAAOkLACAJAADwCwAgCwAArwsAIBsAAJkMACDvBQAAlwwAMPAFAAAxABDxBQAAlwwAMPIFAQCwCgAh9wUBALEKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGqBgAAmAzYBiLLBgEAsAoAIdEGAQCxCgAh0wYBALEKACHVBgEAsAoAIdYGAQCwCgAh0gcAADEAINMHAAAxACAQBwAA-QoAICoAAK8LACDvBQAA6gsAMPAFAADIAQAQ8QUAAOoLADDyBQEAsAoAIfcFAQCwCgAh-gVAALQKACH7BUAAtAoAIcsGAQCxCgAhqQcBALAKACGqBwEAsAoAIasHAgDcCwAhrQcAAOsLrQci0gcAAMgBACDTBwAAyAEAIBoHAAD5CgAgCQAA8AsAIAoAAKAMACALAACvCwAgDgAAkQwAIA8AAJQMACAQAADvCwAgGQAAhgwAIBsAAP4LACAsAACeDAAgLQAAnwwAIO8FAACdDAAw8AUAACYAEPEFAACdDAAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIZoGAQCwCgAhmwYBALAKACGcBgEAsAoAIZ4GAQCwCgAh0wYBALAKACHjBgEAsQoAIaYHQAC0CgAhA84GAACFAQAgzwYAAIUBACDQBgAAhQEAIB0HAAD5CgAgCQAA8AsAIBAAAO8LACApAADuCwAg7wUAAOwLADDwBQAAiQEAEPEFAADsCwAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIZwGAQCwCgAhsAYBALAKACGxBggA7QsAIbIGCADtCwAhswYIAO0LACG0BggA7QsAIbUGCADtCwAhtgYIAO0LACG3BggA7QsAIbgGCADtCwAhuQYIAO0LACG6BggA7QsAIbsGCADtCwAhvAYIAO0LACG9BggA7QsAIdIHAACJAQAg0wcAAIkBACAUBwAA-QoAIAkAAP0LACANAADfCgAgDwAAowsAIO8FAACiDAAw8AUAAB0AEPEFAACiDAAw8gUBALAKACH3BQEAsAoAIfgFAQCwCgAh-gVAALQKACH7BUAAtAoAIaMGAQCwCgAh0QYBALEKACHbBgEAsQoAIdwGQADfCwAh3QYIAO0LACHeBggA7QsAIdIHAAAdACDTBwAAHQAgEgcAAPkKACAJAAD9CwAgCgAAoAwAIA0AAN8KACARAACnCwAg7wUAAKEMADDwBQAAIQAQ8QUAAKEMADDyBQEAsAoAIfcFAQCwCgAh-AUBALAKACH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACHdBgIA5gsAIeMGAQCxCgAhpwcBALAKACGoBwEAsAoAIRIHAAD5CgAgCQAA_QsAIA0AAN8KACAPAACjCwAg7wUAAKIMADDwBQAAHQAQ8QUAAKIMADDyBQEAsAoAIfcFAQCwCgAh-AUBALAKACH6BUAAtAoAIfsFQAC0CgAhowYBALAKACHRBgEAsQoAIdsGAQCxCgAh3AZAAN8LACHdBggA7QsAId4GCADtCwAhHAgAAKQMACAMAADdCgAgDQAA3woAIBEAAKcLACAcAADhCgAgJQAA3goAICcAAOAKACAqAACvCwAgLgAAoAsAIC8AAKELACAwAACjCwAgMQAApQsAIDIAAKYLACA0AADwCgAgNQAAqQsAIDYAAKoLACA3AACrCwAgOAAAsQsAIO8FAACjDAAw8AUAABgAEPEFAACjDAAw8gUBALAKACH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACHiBgEAsQoAIZEHAQCxCgAhpQcBALAKACEOBwAA6QsAIDkAAKYMACDvBQAApQwAMPAFAAASABDxBQAApQwAMPIFAQCwCgAh9wUBALEKACH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACGRBwEAsQoAIaUHAQCwCgAh0gcAABIAINMHAAASACAMBwAA6QsAIDkAAKYMACDvBQAApQwAMPAFAAASABDxBQAApQwAMPIFAQCwCgAh9wUBALEKACH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACGRBwEAsQoAIaUHAQCwCgAhA84GAAAYACDPBgAAGAAg0AYAABgAIBYDAAC1CgAgBwAA-QoAIAkAAP0LACANAADfCgAgEQAApwsAICIAALELACAkAACpCwAgSgAA8AoAIEsAAKsLACDvBQAApwwAMPAFAAAOABDxBQAApwwAMPIFAQCwCgAh8wUBALAKACH0BQEAsAoAIfUFAQCwCgAh9gUBALEKACH3BQEAsAoAIfgFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhCwMAALUKACAHAAD5CgAg7wUAAKgMADDwBQAACwAQ8QUAAKgMADDyBQEAsAoAIfcFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhggcAAKkMygciBPwFAAAAygcC_QUAAADKBwj-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_IFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGwBgEAsAwAIbEGCADhDAAhsgYIAOEMACGzBggA4QwAIbQGCADhDAAhtQYIAOEMACG2BggA4QwAIbcGCADhDAAhuAYIAOEMACG5BggA4QwAIboGCADhDAAhuwYIAOEMACG8BggA4QwAIb0GCADhDAAhBdcHCAAAAAHdBwgAAAAB3gcIAAAAAd8HCAAAAAHgBwgAAAABFgcAAOQMACAJAADlDAAgKQAA4wwAIPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGwBgEAsAwAIbEGCADhDAAhsgYIAOEMACGzBggA4QwAIbQGCADhDAAhtQYIAOEMACG2BggA4QwAIbcGCADhDAAhuAYIAOEMACG5BggA4QwAIboGCADhDAAhuwYIAOEMACG8BggA4QwAIb0GCADhDAAhBWMAAPgcACBkAACBHQAg1AcAAPkcACDVBwAAgB0AINoHAAAoACAFYwAA9hwAIGQAAP4cACDUBwAA9xwAINUHAAD9HAAg2gcAAPQEACAHYwAA9BwAIGQAAPscACDUBwAA9RwAINUHAAD6HAAg2AcAABgAINkHAAAYACDaBwAAGgAgFgcAAOgMACAJAADpDAAgKQAA5wwAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABsAYBAAAAAbEGCAAAAAGyBggAAAABswYIAAAAAbQGCAAAAAG1BggAAAABtgYIAAAAAbcGCAAAAAG4BggAAAABuQYIAAAAAboGCAAAAAG7BggAAAABvAYIAAAAAb0GCAAAAAEDYwAA-BwAINQHAAD5HAAg2gcAACgAIANjAAD2HAAg1AcAAPccACDaBwAA9AQAIANjAAD0HAAg1AcAAPUcACDaBwAAGgAgEgcAAP8MACAJAACADQAgFgAA_AwAIBgAAP4MACAzAAD9DAAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGHBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAAa8GAQAAAAECAAAAowEAIGMAAPsMACADAAAAowEAIGMAAPsMACBkAAD1DAAgAVwAAPMcADAYBwAA-QoAIAkAAPALACAQAAD1CwAgFgAA9AsAIBgAAOgLACAzAAC1CgAg7wUAAPILADDwBQAAoQEAEPEFAADyCwAw8gUBAAAAAfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhhwYBALAKACGcBgEAsQoAIagGAQCxCgAhqgYAAPMLqgYiqwYBALEKACGsBkAA3wsAIa0GQAC0CgAhrgYBALAKACGvBgEAsQoAIcwHAADxCwAgAgAAAKMBACBcAAD1DAAgAgAAAPIMACBcAADzDAAgEe8FAADxDAAw8AUAAPIMABDxBQAA8QwAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGHBgEAsAoAIZwGAQCxCgAhqAYBALEKACGqBgAA8wuqBiKrBgEAsQoAIawGQADfCwAhrQZAALQKACGuBgEAsAoAIa8GAQCxCgAhEe8FAADxDAAw8AUAAPIMABDxBQAA8QwAMPIFAQCwCgAh9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGHBgEAsAoAIZwGAQCxCgAhqAYBALEKACGqBgAA8wuqBiKrBgEAsQoAIawGQADfCwAhrQZAALQKACGuBgEAsAoAIa8GAQCxCgAhDfIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGHBgEAsAwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACGvBgEAsQwAIQHXBwAAAKoGAhIHAAD5DAAgCQAA-gwAIBYAAPYMACAYAAD4DAAgMwAA9wwAIPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGHBgEAsAwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACGvBgEAsQwAIQVjAADiHAAgZAAA8RwAINQHAADjHAAg1QcAAPAcACDaBwAA4AYAIAVjAADgHAAgZAAA7hwAINQHAADhHAAg1QcAAO0cACDaBwAA8QIAIAdjAADeHAAgZAAA6xwAINQHAADfHAAg1QcAAOocACDYBwAAUQAg2QcAAFEAINoHAADxAgAgBWMAANwcACBkAADoHAAg1AcAAN0cACDVBwAA5xwAINoHAAD0BAAgB2MAANocACBkAADlHAAg1AcAANscACDVBwAA5BwAINgHAAAYACDZBwAAGAAg2gcAABoAIBIHAAD_DAAgCQAAgA0AIBYAAPwMACAYAAD-DAAgMwAA_QwAIPIFAQAAAAH3BQEAAAAB-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-g0AIA4AAP8NACAPAAD9DQAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_A0AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGeBgEAAAAB0wYBAAAAAeMGAQAAAAGmB0AAAAABAgAAACgAIGMAAPkNACADAAAAKAAgYwAA-Q0AIGQAAMYNACABXAAApBwAMBoHAAD5CgAgCQAA8AsAIAoAAKAMACALAACvCwAgDgAAkQwAIA8AAJQMACAQAADvCwAgGQAAhgwAIBsAAP4LACAsAACeDAAgLQAAnwwAIO8FAACdDAAw8AUAACYAEPEFAACdDAAw8gUBAAAAAfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhmgYBALAKACGbBgEAsAoAIZwGAQCwCgAhngYBALAKACHTBgEAsAoAIeMGAQCxCgAhpgdAALQKACECAAAAKAAgXAAAxg0AIAIAAADEDQAgXAAAxQ0AIA_vBQAAww0AMPAFAADEDQAQ8QUAAMMNADDyBQEAsAoAIfcFAQCwCgAh-AUBALEKACH6BUAAtAoAIfsFQAC0CgAhmgYBALAKACGbBgEAsAoAIZwGAQCwCgAhngYBALAKACHTBgEAsAoAIeMGAQCxCgAhpgdAALQKACEP7wUAAMMNADDwBQAAxA0AEPEFAADDDQAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIZoGAQCwCgAhmwYBALAKACGcBgEAsAoAIZ4GAQCwCgAh0wYBALAKACHjBgEAsQoAIaYHQAC0CgAhC_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-wVAALQKACGqBgAA-gvJByKwBgEAsAoAIccHQAC0CgAhzQcAAPgLACACAAAAhwEAIFwAAOMNACACAAAA4A0AIFwAAOENACAJ7wUAAN8NADDwBQAA4A0AEPEFAADfDQAw8gUBALAKACH6BUAAtAoAIfsFQAC0CgAhqgYAAPoLyQcisAYBALAKACHHB0AAtAoAIQnvBQAA3w0AMPAFAADgDQAQ8QUAAN8NADDyBQEAsAoAIfoFQAC0CgAh-wVAALQKACGqBgAA-gvJByKwBgEAsAoAIccHQAC0CgAhBfIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaoGAADiDckHIscHQACyDAAhAdcHAAAAyQcCBfIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaoGAADiDckHIscHQACyDAAhBfIFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAyQcCxwdAAAAAAQ4HAAD3DQAgCQAA-A0AICgAAPUNACArAAD2DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAAB0QYBAAAAAdgGAQAAAAHZBgEAAAAB2gYBAAAAAQIAAAAsACBjAAD0DQAgAwAAACwAIGMAAPQNACBkAADvDQAgAVwAAIgcADATBwAA6QsAIAkAAPALACAoAACbDAAgKQAA7gsAICsAAJwMACDvBQAAmgwAMPAFAAAqABDxBQAAmgwAMPIFAQAAAAH3BQEAsQoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIbAGAQCwCgAhywYBALAKACHRBgEAsQoAIdgGAQCxCgAh2QYBALAKACHaBgEAsAoAIQIAAAAsACBcAADvDQAgAgAAAO0NACBcAADuDQAgDu8FAADsDQAw8AUAAO0NABDxBQAA7A0AMPIFAQCwCgAh9wUBALEKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACGwBgEAsAoAIcsGAQCwCgAh0QYBALEKACHYBgEAsQoAIdkGAQCwCgAh2gYBALAKACEO7wUAAOwNADDwBQAA7Q0AEPEFAADsDQAw8gUBALAKACH3BQEAsQoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIbAGAQCwCgAhywYBALAKACHRBgEAsQoAIdgGAQCxCgAh2QYBALAKACHaBgEAsAoAIQryBQEAsAwAIfcFAQCxDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACHRBgEAsQwAIdgGAQCxDAAh2QYBALAMACHaBgEAsAwAIQ4HAADyDQAgCQAA8w0AICgAAPANACArAADxDQAg8gUBALAMACH3BQEAsQwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAh0QYBALEMACHYBgEAsQwAIdkGAQCwDAAh2gYBALAMACEFYwAA-hsAIGQAAIYcACDUBwAA-xsAINUHAACFHAAg2gcAADMAIAVjAAD4GwAgZAAAgxwAINQHAAD5GwAg1QcAAIIcACDaBwAAygEAIAdjAAD2GwAgZAAAgBwAINQHAAD3GwAg1QcAAP8bACDYBwAAFgAg2QcAABYAINoHAAD0BAAgB2MAAPQbACBkAAD9GwAg1AcAAPUbACDVBwAA_BsAINgHAAAYACDZBwAAGAAg2gcAABoAIA4HAAD3DQAgCQAA-A0AICgAAPUNACArAAD2DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAAB0QYBAAAAAdgGAQAAAAHZBgEAAAAB2gYBAAAAAQNjAAD6GwAg1AcAAPsbACDaBwAAMwAgA2MAAPgbACDUBwAA-RsAINoHAADKAQAgA2MAAPYbACDUBwAA9xsAINoHAAD0BAAgA2MAAPQbACDUBwAA9RsAINoHAAAaACAVBwAAgw4AIAkAAIAOACAKAACBDgAgCwAA-g0AIA4AAP8NACAPAAD9DQAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_A0AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGeBgEAAAAB0wYBAAAAAeMGAQAAAAGmB0AAAAABBGMAAOUNADDUBwAA5g0AMNYHAADoDQAg2gcAAOkNADAEYwAA2A0AMNQHAADZDQAw1gcAANsNACDaBwAA3A0AMANjAADRDQAg1AcAANINACDaBwAArQEAIANjAADyGwAg1AcAAPMbACDaBwAAIwAgA2MAAPAbACDUBwAA8RsAINoHAACdAQAgA2MAAO4bACDUBwAA7xsAINoHAAA3ACADYwAA7BsAINQHAADtGwAg2gcAABoAIANjAADqGwAg1AcAAOsbACDaBwAAHwAgA2MAAOgbACDUBwAA6RsAINoHAAD4BwAgA2MAAOYbACDUBwAA5xsAINoHAAD0BAAgA2MAAOQbACDUBwAA5RsAINoHAAD0BAAgBGMAALwNADDUBwAAvQ0AMNYHAAC_DQAg2gcAAMANADAEYwAAqA0AMNQHAACpDQAw1gcAAKsNACDaBwAArA0AMARjAACBDQAw1AcAAIINADDWBwAAhA0AINoHAACFDQAwBGMAAOoMADDUBwAA6wwAMNYHAADtDAAg2gcAAO4MADAEYwAA1wwAMNQHAADYDAAw1gcAANoMACDaBwAA2wwAMARjAAC8DAAw1AcAAL0MADDWBwAAvwwAINoHAADADAAwA2MAAOIbACDUBwAA4xsAINoHAAAaACADYwAA4BsAINQHAADhGwAg2gcAAPECACAAAAAC1wcBAAAABOEHAQAAAAUC1wcBAAAABOEHAQAAAAUB1wcgAAAAAQVjAADbGwAgZAAA3hsAINQHAADcGwAg1QcAAN0bACDaBwAA8QIAIAHXBwEAAAAEAdcHAQAAAAQDYwAA2xsAINQHAADcGwAg2gcAAPECACAZBAAAwBgAIAUAAMEYACAGAAC4FgAgEAAAuRYAIBkAALoWACA0AACkEQAgQAAAvBYAIEwAALwWACBNAACkEQAgTgAAwhgAIE8AAJMRACBQAACTEQAgUQAAwxgAIFIAAMQYACBTAADFFgAgVAAAxRYAIFUAAMQWACBWAADFGAAg9gUAAKwMACDABwAArAwAIMEHAACsDAAgwgcAAKwMACDDBwAArAwAIMQHAACsDAAgxQcAAKwMACAAAAAFYwAA1hsAIGQAANkbACDUBwAA1xsAINUHAADYGwAg2gcAABAAIANjAADWGwAg1AcAANcbACDaBwAAEAAgAAAABWMAANEbACBkAADUGwAg1AcAANIbACDVBwAA0xsAINoHAABBACADYwAA0RsAINQHAADSGwAg2gcAAEEAIAAAAAVjAADMGwAgZAAAzxsAINQHAADNGwAg1QcAAM4bACDaBwAAEAAgA2MAAMwbACDUBwAAzRsAINoHAAAQACAAAAAHYwAAxxsAIGQAAMobACDUBwAAyBsAINUHAADJGwAg2AcAAA4AINkHAAAOACDaBwAAEAAgA2MAAMcbACDUBwAAyBsAINoHAAAQACAAAAAAAAAAAAAAAdcHAAAAwAYCAdcHAAAAwgYCBdcHEAAAAAHdBxAAAAAB3gcQAAAAAd8HEAAAAAHgBxAAAAABBdcHAgAAAAHdBwIAAAAB3gcCAAAAAd8HAgAAAAHgBwIAAAABBWMAAL8bACBkAADFGwAg1AcAAMAbACDVBwAAxBsAINoHAAD0BAAgB2MAAL0bACBkAADCGwAg1AcAAL4bACDVBwAAwRsAINgHAADTAQAg2QcAANMBACDaBwAA1QEAIANjAAC_GwAg1AcAAMAbACDaBwAA9AQAIANjAAC9GwAg1AcAAL4bACDaBwAA1QEAIAAAAAVjAACAGwAgZAAAuxsAINQHAACBGwAg1QcAALobACDaBwAA9AQAIAdjAAD-GgAgZAAAuBsAINQHAAD_GgAg1QcAALcbACDYBwAAGAAg2QcAABgAINoHAAAaACAFYwAA_BoAIGQAALUbACDUBwAA_RoAINUHAAC0GwAg2gcAAPECACALYwAAhg8AMGQAAIoPADDUBwAAhw8AMNUHAACIDwAw1gcAAIkPACDXBwAAwA0AMNgHAADADQAw2QcAAMANADDaBwAAwA0AMNsHAACLDwAw3AcAAMMNADALYwAA_Q4AMGQAAIEPADDUBwAA_g4AMNUHAAD_DgAw1gcAAIAPACDXBwAAlQ0AMNgHAACVDQAw2QcAAJUNADDaBwAAlQ0AMNsHAACCDwAw3AcAAJgNADALYwAA6g4AMGQAAO8OADDUBwAA6w4AMNUHAADsDgAw1gcAAO0OACDXBwAA7g4AMNgHAADuDgAw2QcAAO4OADDaBwAA7g4AMNsHAADwDgAw3AcAAPEOADALYwAA1A4AMGQAANkOADDUBwAA1Q4AMNUHAADWDgAw1gcAANcOACDXBwAA2A4AMNgHAADYDgAw2QcAANgOADDaBwAA2A4AMNsHAADaDgAw3AcAANsOADALYwAAyQ4AMGQAAM0OADDUBwAAyg4AMNUHAADLDgAw1gcAAMwOACDXBwAAwAwAMNgHAADADAAw2QcAAMAMADDaBwAAwAwAMNsHAADODgAw3AcAAMMMADAVEAAA0w4AIBgAANQMACAeAADRDAAgHwAA0gwAICAAANMMACAhAADWDAAg8gUBAAAAAfoFQAAAAAH7BUAAAAABnAYBAAAAAaoGAAAAiAcCrAZAAAAAAa8GAQAAAAGGBwAAAIYHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAECAAAAXQAgYwAA0g4AIAMAAABdACBjAADSDgAgZAAA0A4AIAFcAACzGwAwAgAAAF0AIFwAANAOACACAAAAxAwAIFwAAM8OACAP8gUBALAMACH6BUAAsgwAIfsFQACyDAAhnAYBALEMACGqBgAAxwyIByKsBkAAyAwAIa8GAQCxDAAhhgcAAMYMhgciiAcBALAMACGJBwEAsAwAIYoHAQCwDAAhiwcBALEMACGMBwEAsQwAIY0HAQCxDAAhjgdAALIMACEVEAAA0Q4AIBgAAM0MACAeAADKDAAgHwAAywwAICAAAMwMACAhAADPDAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhnAYBALEMACGqBgAAxwyIByKsBkAAyAwAIa8GAQCxDAAhhgcAAMYMhgciiAcBALAMACGJBwEAsAwAIYoHAQCwDAAhiwcBALEMACGMBwEAsQwAIY0HAQCxDAAhjgdAALIMACEHYwAArhsAIGQAALEbACDUBwAArxsAINUHAACwGwAg2AcAAA4AINkHAAAOACDaBwAAEAAgFRAAANMOACAYAADUDAAgHgAA0QwAIB8AANIMACAgAADTDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGqBgAAAIgHAqwGQAAAAAGvBgEAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABA2MAAK4bACDUBwAArxsAINoHAAAQACAaBwAA5g4AIAkAAOcOACAbAADoDgAgHQAA6Q4AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAAD7BgLCBhAAAAABwwYBAAAAAcQGAgAAAAHTBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QaAAAAAAe4GQAAAAAH3BgEAAAAB-QYAAAD5BgL7BgEAAAAB_AZAAAAAAQIAAABXACBjAADlDgAgAwAAAFcAIGMAAOUOACBkAADgDgAgAVwAAK0bADAfBwAA-QoAIAkAAP0LACAZAACGDAAgGwAA_gsAIB0AAIcMACDvBQAAgwwAMPAFAABVABDxBQAAgwwAMPIFAQAAAAH3BQEAsAoAIfgFAQCwCgAh-gVAALQKACH7BUAAtAoAIZ4GAQCwCgAhqgYAAIUM-wYiwgYQANsLACHDBgEAsAoAIcQGAgDcCwAh0wYBALAKACHnBgEAAAAB6AYBALEKACHpBgEAAAAB6gYBALEKACHrBgEAsQoAIewGAQCxCgAh7QYAAN4LACDuBkAA3wsAIfcGAQCwCgAh-QYAAIQM-QYi-wYBALAKACH8BkAAtAoAIQIAAABXACBcAADgDgAgAgAAANwOACBcAADdDgAgGu8FAADbDgAw8AUAANwOABDxBQAA2w4AMPIFAQCwCgAh9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACGeBgEAsAoAIaoGAACFDPsGIsIGEADbCwAhwwYBALAKACHEBgIA3AsAIdMGAQCwCgAh5wYBALAKACHoBgEAsQoAIekGAQCxCgAh6gYBALEKACHrBgEAsQoAIewGAQCxCgAh7QYAAN4LACDuBkAA3wsAIfcGAQCwCgAh-QYAAIQM-QYi-wYBALAKACH8BkAAtAoAIRrvBQAA2w4AMPAFAADcDgAQ8QUAANsOADDyBQEAsAoAIfcFAQCwCgAh-AUBALAKACH6BUAAtAoAIfsFQAC0CgAhngYBALAKACGqBgAAhQz7BiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHTBgEAsAoAIecGAQCwCgAh6AYBALEKACHpBgEAsQoAIeoGAQCxCgAh6wYBALEKACHsBgEAsQoAIe0GAADeCwAg7gZAAN8LACH3BgEAsAoAIfkGAACEDPkGIvsGAQCwCgAh_AZAALQKACEW8gUBALAMACH3BQEAsAwAIfgFAQCwDAAh-gVAALIMACH7BUAAsgwAIaoGAADfDvsGIsIGEAC4DgAhwwYBALAMACHEBgIAuQ4AIdMGAQCwDAAh5wYBALAMACHoBgEAsQwAIekGAQCxDAAh6gYBALEMACHrBgEAsQwAIewGAQCxDAAh7QaAAAAAAe4GQADIDAAh9wYBALAMACH5BgAA3g75BiL7BgEAsAwAIfwGQACyDAAhAdcHAAAA-QYCAdcHAAAA-wYCGgcAAOEOACAJAADiDgAgGwAA4w4AIB0AAOQOACDyBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAhqgYAAN8O-wYiwgYQALgOACHDBgEAsAwAIcQGAgC5DgAh0wYBALAMACHnBgEAsAwAIegGAQCxDAAh6QYBALEMACHqBgEAsQwAIesGAQCxDAAh7AYBALEMACHtBoAAAAAB7gZAAMgMACH3BgEAsAwAIfkGAADeDvkGIvsGAQCwDAAh_AZAALIMACEFYwAAnxsAIGQAAKsbACDUBwAAoBsAINUHAACqGwAg2gcAAPQEACAFYwAAnRsAIGQAAKgbACDUBwAAnhsAINUHAACnGwAg2gcAABoAIAVjAACbGwAgZAAApRsAINQHAACcGwAg1QcAAKQbACDaBwAA-AcAIAVjAACZGwAgZAAAohsAINQHAACaGwAg1QcAAKEbACDaBwAAdgAgGgcAAOYOACAJAADnDgAgGwAA6A4AIB0AAOkOACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAA-wYCwgYQAAAAAcMGAQAAAAHEBgIAAAAB0wYBAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GgAAAAAHuBkAAAAAB9wYBAAAAAfkGAAAA-QYC-wYBAAAAAfwGQAAAAAEDYwAAnxsAINQHAACgGwAg2gcAAPQEACADYwAAnRsAINQHAACeGwAg2gcAABoAIANjAACbGwAg1AcAAJwbACDaBwAA-AcAIANjAACZGwAg1AcAAJobACDaBwAAdgAgDhYAAPoOACAXAAD7DgAgGAAA_A4AIPIFAQAAAAH6BUAAAAAB-wVAAAAAAagGAQAAAAGqBgAAAMkGAqsGAQAAAAGsBkAAAAABrQZAAAAAAa4GAQAAAAGvBgEAAAAByQYBAAAAAQIAAABNACBjAAD5DgAgAwAAAE0AIGMAAPkOACBkAAD1DgAgAVwAAJgbADAUFgAAiwwAIBcAALUKACAYAADoCwAgGQAAggwAIO8FAACJDAAw8AUAAEsAEPEFAACJDAAw8gUBAAAAAfoFQAC0CgAh-wVAALQKACGeBgEAsQoAIagGAQCxCgAhqgYAAIoMyQYiqwYBALEKACGsBkAA3wsAIa0GQAC0CgAhrgYBALAKACGvBgEAsQoAIckGAQCwCgAhzwcAAIgMACACAAAATQAgXAAA9Q4AIAIAAADyDgAgXAAA8w4AIA_vBQAA8Q4AMPAFAADyDgAQ8QUAAPEOADDyBQEAsAoAIfoFQAC0CgAh-wVAALQKACGeBgEAsQoAIagGAQCxCgAhqgYAAIoMyQYiqwYBALEKACGsBkAA3wsAIa0GQAC0CgAhrgYBALAKACGvBgEAsQoAIckGAQCwCgAhD-8FAADxDgAw8AUAAPIOABDxBQAA8Q4AMPIFAQCwCgAh-gVAALQKACH7BUAAtAoAIZ4GAQCxCgAhqAYBALEKACGqBgAAigzJBiKrBgEAsQoAIawGQADfCwAhrQZAALQKACGuBgEAsAoAIa8GAQCxCgAhyQYBALAKACEL8gUBALAMACH6BUAAsgwAIfsFQACyDAAhqAYBALEMACGqBgAA9A7JBiKrBgEAsQwAIawGQADIDAAhrQZAALIMACGuBgEAsAwAIa8GAQCxDAAhyQYBALAMACEB1wcAAADJBgIOFgAA9g4AIBcAAPcOACAYAAD4DgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhqAYBALEMACGqBgAA9A7JBiKrBgEAsQwAIawGQADIDAAhrQZAALIMACGuBgEAsAwAIa8GAQCxDAAhyQYBALAMACEFYwAAjRsAIGQAAJYbACDUBwAAjhsAINUHAACVGwAg2gcAAPkGACAFYwAAixsAIGQAAJMbACDUBwAAjBsAINUHAACSGwAg2gcAAPECACAHYwAAiRsAIGQAAJAbACDUBwAAihsAINUHAACPGwAg2AcAAFEAINkHAABRACDaBwAA8QIAIA4WAAD6DgAgFwAA-w4AIBgAAPwOACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGoBgEAAAABqgYAAADJBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAAckGAQAAAAEDYwAAjRsAINQHAACOGwAg2gcAAPkGACADYwAAixsAINQHAACMGwAg2gcAAPECACADYwAAiRsAINQHAACKGwAg2gcAAPECACANBwAAoQ0AIAkAAKINACASAAChDgAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGdBgEAAAABnwYBAAAAAaAGAQAAAAGhBgEAAAABogZAAAAAAQIAAABGACBjAACFDwAgAwAAAEYAIGMAAIUPACBkAACEDwAgAVwAAIgbADACAAAARgAgXAAAhA8AIAIAAACZDQAgXAAAgw8AIAryBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhnQYBALAMACGfBgEAsQwAIaAGAQCxDAAhoQYBALEMACGiBkAAsgwAIQ0HAACdDQAgCQAAng0AIBIAAKAOACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhnQYBALAMACGfBgEAsQwAIaAGAQCxDAAhoQYBALEMACGiBkAAsgwAIQ0HAAChDQAgCQAAog0AIBIAAKEOACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZ0GAQAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBkAAAAABFQcAAIMOACAJAACADgAgCgAAgQ4AIAsAAPoNACAOAAD_DQAgDwAA_Q0AIBAAAJAPACAbAACCDgAgLAAA-w0AIC0AAPwNACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGbBgEAAAABnAYBAAAAAdMGAQAAAAHjBgEAAAABpgdAAAAAAQIAAAAoACBjAACPDwAgAwAAACgAIGMAAI8PACBkAACNDwAgAVwAAIcbADACAAAAKAAgXAAAjQ8AIAIAAADEDQAgXAAAjA8AIAvyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGbBgEAsAwAIZwGAQCwDAAh0wYBALAMACHjBgEAsQwAIaYHQACyDAAhFQcAANANACAJAADNDQAgCgAAzg0AIAsAAMcNACAOAADMDQAgDwAAyg0AIBAAAI4PACAbAADPDQAgLAAAyA0AIC0AAMkNACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGbBgEAsAwAIZwGAQCwDAAh0wYBALAMACHjBgEAsQwAIaYHQACyDAAhBWMAAIIbACBkAACFGwAg1AcAAIMbACDVBwAAhBsAINoHAAAQACAVBwAAgw4AIAkAAIAOACAKAACBDgAgCwAA-g0AIA4AAP8NACAPAAD9DQAgEAAAkA8AIBsAAIIOACAsAAD7DQAgLQAA_A0AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAAB0wYBAAAAAeMGAQAAAAGmB0AAAAABA2MAAIIbACDUBwAAgxsAINoHAAAQACADYwAAgBsAINQHAACBGwAg2gcAAPQEACADYwAA_hoAINQHAAD_GgAg2gcAABoAIANjAAD8GgAg1AcAAP0aACDaBwAA8QIAIARjAACGDwAw1AcAAIcPADDWBwAAiQ8AINoHAADADQAwBGMAAP0OADDUBwAA_g4AMNYHAACADwAg2gcAAJUNADAEYwAA6g4AMNQHAADrDgAw1gcAAO0OACDaBwAA7g4AMARjAADUDgAw1AcAANUOADDWBwAA1w4AINoHAADYDgAwBGMAAMkOADDUBwAAyg4AMNYHAADMDgAg2gcAAMAMADAAAAAHYwAA9xoAIGQAAPoaACDUBwAA-BoAINUHAAD5GgAg2AcAAFMAINkHAABTACDaBwAAnQEAIANjAAD3GgAg1AcAAPgaACDaBwAAnQEAIAAAAALXBwEAAAAE4QcBAAAABQVjAADyGgAgZAAA9RoAINQHAADzGgAg1QcAAPQaACDaBwAA8QIAIAHXBwEAAAAEA2MAAPIaACDUBwAA8xoAINoHAADxAgAgAAAAC2MAAJAQADBkAACVEAAw1AcAAJEQADDVBwAAkhAAMNYHAACTEAAg1wcAAJQQADDYBwAAlBAAMNkHAACUEAAw2gcAAJQQADDbBwAAlhAAMNwHAACXEAAwC2MAANwPADBkAADhDwAw1AcAAN0PADDVBwAA3g8AMNYHAADfDwAg1wcAAOAPADDYBwAA4A8AMNkHAADgDwAw2gcAAOAPADDbBwAA4g8AMNwHAADjDwAwC2MAANMPADBkAADXDwAw1AcAANQPADDVBwAA1Q8AMNYHAADWDwAg1wcAAMANADDYBwAAwA0AMNkHAADADQAw2gcAAMANADDbBwAA2A8AMNwHAADDDQAwC2MAALgPADBkAAC9DwAw1AcAALkPADDVBwAAug8AMNYHAAC7DwAg1wcAALwPADDYBwAAvA8AMNkHAAC8DwAw2gcAALwPADDbBwAAvg8AMNwHAAC_DwAwC2MAAK0PADBkAACxDwAw1AcAAK4PADDVBwAArw8AMNYHAACwDwAg1wcAANgOADDYBwAA2A4AMNkHAADYDgAw2gcAANgOADDbBwAAsg8AMNwHAADbDgAwGgcAAOYOACAJAADnDgAgGQAAtw8AIB0AAOkOACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZ4GAQAAAAGqBgAAAPsGAsIGEAAAAAHDBgEAAAABxAYCAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GgAAAAAHuBkAAAAAB9wYBAAAAAfkGAAAA-QYC-wYBAAAAAfwGQAAAAAECAAAAVwAgYwAAtg8AIAMAAABXACBjAAC2DwAgZAAAtA8AIAFcAADxGgAwAgAAAFcAIFwAALQPACACAAAA3A4AIFwAALMPACAW8gUBALAMACH3BQEAsAwAIfgFAQCwDAAh-gVAALIMACH7BUAAsgwAIZ4GAQCwDAAhqgYAAN8O-wYiwgYQALgOACHDBgEAsAwAIcQGAgC5DgAh5wYBALAMACHoBgEAsQwAIekGAQCxDAAh6gYBALEMACHrBgEAsQwAIewGAQCxDAAh7QaAAAAAAe4GQADIDAAh9wYBALAMACH5BgAA3g75BiL7BgEAsAwAIfwGQACyDAAhGgcAAOEOACAJAADiDgAgGQAAtQ8AIB0AAOQOACDyBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAhngYBALAMACGqBgAA3w77BiLCBhAAuA4AIcMGAQCwDAAhxAYCALkOACHnBgEAsAwAIegGAQCxDAAh6QYBALEMACHqBgEAsQwAIesGAQCxDAAh7AYBALEMACHtBoAAAAAB7gZAAMgMACH3BgEAsAwAIfkGAADeDvkGIvsGAQCwDAAh_AZAALIMACEFYwAA7BoAIGQAAO8aACDUBwAA7RoAINUHAADuGgAg2gcAAJ0BACAaBwAA5g4AIAkAAOcOACAZAAC3DwAgHQAA6Q4AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABngYBAAAAAaoGAAAA-wYCwgYQAAAAAcMGAQAAAAHEBgIAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QaAAAAAAe4GQAAAAAH3BgEAAAAB-QYAAAD5BgL7BgEAAAAB_AZAAAAAAQNjAADsGgAg1AcAAO0aACDaBwAAnQEAIAwHAADQDwAgCQAA0Q8AIBwAANIPACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAcMGAQAAAAH1BiAAAAAB_QYQAAAAAf4GEAAAAAECAAAAdgAgYwAAzw8AIAMAAAB2ACBjAADPDwAgZAAAwg8AIAFcAADrGgAwEgcAAPkKACAJAAD9CwAgGwAA_gsAIBwAAOEKACDvBQAA_AsAMPAFAAB0ABDxBQAA_AsAMPIFAQAAAAH3BQEAsAoAIfgFAQCwCgAh-gVAALQKACH7BUAAtAoAIcMGAQCwCgAh0wYBALAKACH1BiAAswoAIf0GEADbCwAh_gYQANsLACHOBwAA-wsAIAIAAAB2ACBcAADCDwAgAgAAAMAPACBcAADBDwAgDe8FAAC_DwAw8AUAAMAPABDxBQAAvw8AMPIFAQCwCgAh9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACHDBgEAsAoAIdMGAQCwCgAh9QYgALMKACH9BhAA2wsAIf4GEADbCwAhDe8FAAC_DwAw8AUAAMAPABDxBQAAvw8AMPIFAQCwCgAh9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACHDBgEAsAoAIdMGAQCwCgAh9QYgALMKACH9BhAA2wsAIf4GEADbCwAhCfIFAQCwDAAh9wUBALAMACH4BQEAsAwAIfoFQACyDAAh-wVAALIMACHDBgEAsAwAIfUGIACSDgAh_QYQALgOACH-BhAAuA4AIQwHAADDDwAgCQAAxA8AIBwAAMUPACDyBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAhwwYBALAMACH1BiAAkg4AIf0GEAC4DgAh_gYQALgOACEFYwAA4hoAIGQAAOkaACDUBwAA4xoAINUHAADoGgAg2gcAAPQEACAFYwAA4BoAIGQAAOYaACDUBwAA4RoAINUHAADlGgAg2gcAABoAIAtjAADGDwAwZAAAyg8AMNQHAADHDwAw1QcAAMgPADDWBwAAyQ8AINcHAADYDgAw2AcAANgOADDZBwAA2A4AMNoHAADYDgAw2wcAAMsPADDcBwAA2w4AMBoHAADmDgAgCQAA5w4AIBkAALcPACAbAADoDgAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqgYAAAD7BgLCBhAAAAABwwYBAAAAAcQGAgAAAAHTBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QaAAAAAAe4GQAAAAAH5BgAAAPkGAvsGAQAAAAH8BkAAAAABAgAAAFcAIGMAAM4PACADAAAAVwAgYwAAzg8AIGQAAM0PACABXAAA5BoAMAIAAABXACBcAADNDwAgAgAAANwOACBcAADMDwAgFvIFAQCwDAAh9wUBALAMACH4BQEAsAwAIfoFQACyDAAh-wVAALIMACGeBgEAsAwAIaoGAADfDvsGIsIGEAC4DgAhwwYBALAMACHEBgIAuQ4AIdMGAQCwDAAh5wYBALAMACHoBgEAsQwAIekGAQCxDAAh6gYBALEMACHrBgEAsQwAIewGAQCxDAAh7QaAAAAAAe4GQADIDAAh-QYAAN4O-QYi-wYBALAMACH8BkAAsgwAIRoHAADhDgAgCQAA4g4AIBkAALUPACAbAADjDgAg8gUBALAMACH3BQEAsAwAIfgFAQCwDAAh-gVAALIMACH7BUAAsgwAIZ4GAQCwDAAhqgYAAN8O-wYiwgYQALgOACHDBgEAsAwAIcQGAgC5DgAh0wYBALAMACHnBgEAsAwAIegGAQCxDAAh6QYBALEMACHqBgEAsQwAIesGAQCxDAAh7AYBALEMACHtBoAAAAAB7gZAAMgMACH5BgAA3g75BiL7BgEAsAwAIfwGQACyDAAhGgcAAOYOACAJAADnDgAgGQAAtw8AIBsAAOgOACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZ4GAQAAAAGqBgAAAPsGAsIGEAAAAAHDBgEAAAABxAYCAAAAAdMGAQAAAAHnBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAHtBoAAAAAB7gZAAAAAAfkGAAAA-QYC-wYBAAAAAfwGQAAAAAEMBwAA0A8AIAkAANEPACAcAADSDwAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHDBgEAAAAB9QYgAAAAAf0GEAAAAAH-BhAAAAABA2MAAOIaACDUBwAA4xoAINoHAAD0BAAgA2MAAOAaACDUBwAA4RoAINoHAAAaACAEYwAAxg8AMNQHAADHDwAw1gcAAMkPACDaBwAA2A4AMBUHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAACQDwAgGQAA_g0AICwAAPsNACAtAAD8DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAGeBgEAAAAB4wYBAAAAAaYHQAAAAAECAAAAKAAgYwAA2w8AIAMAAAAoACBjAADbDwAgZAAA2g8AIAFcAADfGgAwAgAAACgAIFwAANoPACACAAAAxA0AIFwAANkPACAL8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIZ4GAQCwDAAh4wYBALEMACGmB0AAsgwAIRUHAADQDQAgCQAAzQ0AIAoAAM4NACALAADHDQAgDgAAzA0AIA8AAMoNACAQAACODwAgGQAAyw0AICwAAMgNACAtAADJDQAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIZ4GAQCwDAAh4wYBALEMACGmB0AAsgwAIRUHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAACQDwAgGQAA_g0AICwAAPsNACAtAAD8DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAGeBgEAAAAB4wYBAAAAAaYHQAAAAAEPBwAAjRAAIAkAAI4QACANAACKEAAgEQAAixAAICQAAIwQACAmAACPEAAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAAB0QYBAAAAAdIGAgAAAAHUBgEAAAABAgAAADcAIGMAAIkQACADAAAANwAgYwAAiRAAIGQAAOcPACABXAAA3hoAMBQHAAD5CgAgCQAA8AsAIA0AAN8KACARAACnCwAgGwAA_gsAICQAAKkLACAmAACWDAAg7wUAAJUMADDwBQAANQAQ8QUAAJUMADDyBQEAAAAB9wUBALAKACH4BQEAsQoAIfoFQAC0CgAh-wVAALQKACHLBgEAsAoAIdEGAQCxCgAh0gYCAOYLACHTBgEAsAoAIdQGAQCxCgAhAgAAADcAIFwAAOcPACACAAAA5A8AIFwAAOUPACAN7wUAAOMPADDwBQAA5A8AEPEFAADjDwAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIcsGAQCwCgAh0QYBALEKACHSBgIA5gsAIdMGAQCwCgAh1AYBALEKACEN7wUAAOMPADDwBQAA5A8AEPEFAADjDwAw8gUBALAKACH3BQEAsAoAIfgFAQCxCgAh-gVAALQKACH7BUAAtAoAIcsGAQCwCgAh0QYBALEKACHSBgIA5gsAIdMGAQCwCgAh1AYBALEKACEJ8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAh0QYBALEMACHSBgIA5g8AIdQGAQCxDAAhBdcHAgAAAAHdBwIAAAAB3gcCAAAAAd8HAgAAAAHgBwIAAAABDwcAAOsPACAJAADsDwAgDQAA6A8AIBEAAOkPACAkAADqDwAgJgAA7Q8AIPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIdEGAQCxDAAh0gYCAOYPACHUBgEAsQwAIQtjAACAEAAwZAAAhBAAMNQHAACBEAAw1QcAAIIQADDWBwAAgxAAINcHAADADQAw2AcAAMANADDZBwAAwA0AMNoHAADADQAw2wcAAIUQADDcBwAAww0AMAtjAAD3DwAwZAAA-w8AMNQHAAD4DwAw1QcAAPkPADDWBwAA-g8AINcHAACsDQAw2AcAAKwNADDZBwAArA0AMNoHAACsDQAw2wcAAPwPADDcBwAArw0AMAtjAADuDwAwZAAA8g8AMNQHAADvDwAw1QcAAPAPADDWBwAA8Q8AINcHAACFDQAw2AcAAIUNADDZBwAAhQ0AMNoHAACFDQAw2wcAAPMPADDcBwAAiA0AMAVjAADQGgAgZAAA3BoAINQHAADRGgAg1QcAANsaACDaBwAA9AQAIAdjAADOGgAgZAAA2RoAINQHAADPGgAg1QcAANgaACDYBwAAGAAg2QcAABgAINoHAAAaACAHYwAAzBoAIGQAANYaACDUBwAAzRoAINUHAADVGgAg2AcAAGsAINkHAABrACDaBwAAlwEAIA4HAAClDQAgCQAApg0AIBAAAKYOACAjAACnDQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABowYBAAAAAaQGAQAAAAGmBgAAAKYGAqcGQAAAAAECAAAAQQAgYwAA9g8AIAMAAABBACBjAAD2DwAgZAAA9Q8AIAFcAADUGgAwAgAAAEEAIFwAAPUPACACAAAAiQ0AIFwAAPQPACAK8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZwGAQCwDAAhowYBALAMACGkBgEAsQwAIaYGAACLDaYGIqcGQADIDAAhDgcAAI4NACAJAACPDQAgEAAApQ4AICMAAJANACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhnAYBALAMACGjBgEAsAwAIaQGAQCxDAAhpgYAAIsNpgYipwZAAMgMACEOBwAApQ0AIAkAAKYNACAQAACmDgAgIwAApw0AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABnAYBAAAAAaMGAQAAAAGkBgEAAAABpgYAAACmBgKnBkAAAAABCwcAALoNACAJAAC7DQAgDwAAuQ0AIBAAAJwOACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZsGAQAAAAGcBgEAAAABAgAAADwAIGMAAP8PACADAAAAPAAgYwAA_w8AIGQAAP4PACABXAAA0xoAMAIAAAA8ACBcAAD-DwAgAgAAALANACBcAAD9DwAgB_IFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGbBgEAsAwAIZwGAQCwDAAhCwcAALUNACAJAAC2DQAgDwAAtA0AIBAAAJsOACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmwYBALAMACGcBgEAsAwAIQsHAAC6DQAgCQAAuw0AIA8AALkNACAQAACcDgAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGbBgEAAAABnAYBAAAAARUHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDwAA_Q0AIBAAAJAPACAZAAD-DQAgGwAAgg4AICwAAPsNACAtAAD8DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGbBgEAAAABnAYBAAAAAZ4GAQAAAAHTBgEAAAAB4wYBAAAAAaYHQAAAAAECAAAAKAAgYwAAiBAAIAMAAAAoACBjAACIEAAgZAAAhxAAIAFcAADSGgAwAgAAACgAIFwAAIcQACACAAAAxA0AIFwAAIYQACAL8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZsGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAh4wYBALEMACGmB0AAsgwAIRUHAADQDQAgCQAAzQ0AIAoAAM4NACALAADHDQAgDwAAyg0AIBAAAI4PACAZAADLDQAgGwAAzw0AICwAAMgNACAtAADJDQAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZsGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAh4wYBALEMACGmB0AAsgwAIRUHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDwAA_Q0AIBAAAJAPACAZAAD-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_GgAgZAAAwhoAINQHAADAGgAg1QcAAMEaACDaBwAAKAAgDgcAAPcNACAJAAD4DQAgKQAAqRAAICsAAPYNACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAbAGAQAAAAHLBgEAAAAB0QYBAAAAAdgGAQAAAAHaBgEAAAABA2MAAL8aACDUBwAAwBoAINoHAAAoACANBwAArBAAIAkAAK0QACALAACrEAAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAANgGAssGAQAAAAHRBgEAAAAB1QYBAAAAAdYGAQAAAAEEYwAAnxAAMNQHAACgEAAw1gcAAKIQACDaBwAA6Q0AMANjAAC9GgAg1AcAAL4aACDaBwAA9AQAIANjAAC7GgAg1AcAALwaACDaBwAAGgAgBGMAAJAQADDUBwAAkRAAMNYHAACTEAAg2gcAAJQQADAEYwAA3A8AMNQHAADdDwAw1gcAAN8PACDaBwAA4A8AMARjAADTDwAw1AcAANQPADDWBwAA1g8AINoHAADADQAwBGMAALgPADDUBwAAuQ8AMNYHAAC7DwAg2gcAALwPADAEYwAArQ8AMNQHAACuDwAw1gcAALAPACDaBwAA2A4AMAAAAAAAAAAAAAAFYwAAthoAIGQAALkaACDUBwAAtxoAINUHAAC4GgAg2gcAAPgHACADYwAAthoAINQHAAC3GgAg2gcAAPgHACAAAAAHYwAAsRoAIGQAALQaACDUBwAAshoAINUHAACzGgAg2AcAAC8AINkHAAAvACDaBwAA-AcAIANjAACxGgAg1AcAALIaACDaBwAA-AcAIAAAAAAAAAAAC2MAANkQADBkAADeEAAw1AcAANoQADDVBwAA2xAAMNYHAADcEAAg1wcAAN0QADDYBwAA3RAAMNkHAADdEAAw2gcAAN0QADDbBwAA3xAAMNwHAADgEAAwC2MAANAQADBkAADUEAAw1AcAANEQADDVBwAA0hAAMNYHAADTEAAg1wcAAMANADDYBwAAwA0AMNkHAADADQAw2gcAAMANADDbBwAA1RAAMNwHAADDDQAwBWMAAJsaACBkAACvGgAg1AcAAJwaACDVBwAArhoAINoHAAD0BAAgBWMAAJkaACBkAACsGgAg1AcAAJoaACDVBwAAqxoAINoHAAAaACAVBwAAgw4AIAkAAIAOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAACQDwAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_A0AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABngYBAAAAAdMGAQAAAAGmB0AAAAABAgAAACgAIGMAANgQACADAAAAKAAgYwAA2BAAIGQAANcQACABXAAAqhoAMAIAAAAoACBcAADXEAAgAgAAAMQNACBcAADWEAAgC_IFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGaBgEAsAwAIZsGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAhpgdAALIMACEVBwAA0A0AIAkAAM0NACALAADHDQAgDgAAzA0AIA8AAMoNACAQAACODwAgGQAAyw0AIBsAAM8NACAsAADIDQAgLQAAyQ0AIPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGaBgEAsAwAIZsGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAhpgdAALIMACEVBwAAgw4AIAkAAIAOACALAAD6DQAgDgAA_w0AIA8AAP0NACAQAACQDwAgGQAA_g0AIBsAAIIOACAsAAD7DQAgLQAA_A0AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABngYBAAAAAdMGAQAAAAGmB0AAAAABDQcAAPsQACAJAAD8EAAgDQAA_RAAIBEAAP4QACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHdBgIAAAABpwcBAAAAAagHAQAAAAECAAAAIwAgYwAA-hAAIAMAAAAjACBjAAD6EAAgZAAA4xAAIAFcAACpGgAwEgcAAPkKACAJAAD9CwAgCgAAoAwAIA0AAN8KACARAACnCwAg7wUAAKEMADDwBQAAIQAQ8QUAAKEMADDyBQEAAAAB9wUBALAKACH4BQEAsAoAIfoFQAC0CgAh-wVAALQKACHRBgEAsQoAId0GAgDmCwAh4wYBALEKACGnBwEAAAABqAcBALAKACECAAAAIwAgXAAA4xAAIAIAAADhEAAgXAAA4hAAIA3vBQAA4BAAMPAFAADhEAAQ8QUAAOAQADDyBQEAsAoAIfcFAQCwCgAh-AUBALAKACH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACHdBgIA5gsAIeMGAQCxCgAhpwcBALAKACGoBwEAsAoAIQ3vBQAA4BAAMPAFAADhEAAQ8QUAAOAQADDyBQEAsAoAIfcFAQCwCgAh-AUBALAKACH6BUAAtAoAIfsFQAC0CgAh0QYBALEKACHdBgIA5gsAIeMGAQCxCgAhpwcBALAKACGoBwEAsAoAIQnyBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHdBgIA5g8AIacHAQCwDAAhqAcBALAMACENBwAA5BAAIAkAAOUQACANAADmEAAgEQAA5xAAIPIFAQCwDAAh9wUBALAMACH4BQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAId0GAgDmDwAhpwcBALAMACGoBwEAsAwAIQVjAACfGgAgZAAApxoAINQHAACgGgAg1QcAAKYaACDaBwAA9AQAIAVjAACdGgAgZAAApBoAINQHAACeGgAg1QcAAKMaACDaBwAAGgAgC2MAAPEQADBkAAD1EAAw1AcAAPIQADDVBwAA8xAAMNYHAAD0EAAg1wcAAMANADDYBwAAwA0AMNkHAADADQAw2gcAAMANADDbBwAA9hAAMNwHAADDDQAwC2MAAOgQADBkAADsEAAw1AcAAOkQADDVBwAA6hAAMNYHAADrEAAg1wcAAKwNADDYBwAArA0AMNkHAACsDQAw2gcAAKwNADDbBwAA7RAAMNwHAACvDQAwCwcAALoNACAJAAC7DQAgDgAAuA0AIBAAAJwOACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGcBgEAAAABAgAAADwAIGMAAPAQACADAAAAPAAgYwAA8BAAIGQAAO8QACABXAAAohoAMAIAAAA8ACBcAADvEAAgAgAAALANACBcAADuEAAgB_IFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGaBgEAsAwAIZwGAQCwDAAhCwcAALUNACAJAAC2DQAgDgAAsw0AIBAAAJsOACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGcBgEAsAwAIQsHAAC6DQAgCQAAuw0AIA4AALgNACAQAACcDgAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABnAYBAAAAARUHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIBAAAJAPACAZAAD-DQAgGwAAgg4AICwAAPsNACAtAAD8DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABnAYBAAAAAZ4GAQAAAAHTBgEAAAAB4wYBAAAAAaYHQAAAAAECAAAAKAAgYwAA-RAAIAMAAAAoACBjAAD5EAAgZAAA-BAAIAFcAAChGgAwAgAAACgAIFwAAPgQACACAAAAxA0AIFwAAPcQACAL8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAh4wYBALEMACGmB0AAsgwAIRUHAADQDQAgCQAAzQ0AIAoAAM4NACALAADHDQAgDgAAzA0AIBAAAI4PACAZAADLDQAgGwAAzw0AICwAAMgNACAtAADJDQAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAh4wYBALEMACGmB0AAsgwAIRUHAACDDgAgCQAAgA4AIAoAAIEOACALAAD6DQAgDgAA_w0AIBAAAJAPACAZAAD-DQAgGwAAgg4AICwAAPsNACAtAAD8DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABnAYBAAAAAZ4GAQAAAAHTBgEAAAAB4wYBAAAAAaYHQAAAAAENBwAA-xAAIAkAAPwQACANAAD9EAAgEQAA_hAAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAd0GAgAAAAGnBwEAAAABqAcBAAAAAQNjAACfGgAg1AcAAKAaACDaBwAA9AQAIANjAACdGgAg1AcAAJ4aACDaBwAAGgAgBGMAAPEQADDUBwAA8hAAMNYHAAD0EAAg2gcAAMANADAEYwAA6BAAMNQHAADpEAAw1gcAAOsQACDaBwAArA0AMARjAADZEAAw1AcAANoQADDWBwAA3BAAINoHAADdEAAwBGMAANAQADDUBwAA0RAAMNYHAADTEAAg2gcAAMANADADYwAAmxoAINQHAACcGgAg2gcAAPQEACADYwAAmRoAINQHAACaGgAg2gcAABoAIAAAAALXBwEAAAAE4QcBAAAABQtjAACIEQAwZAAAjBEAMNQHAACJEQAw1QcAAIoRADDWBwAAixEAINcHAADuDgAw2AcAAO4OADDZBwAA7g4AMNoHAADuDgAw2wcAAI0RADDcBwAA8Q4AMA4XAAD7DgAgGAAA_A4AIBkAAJ0PACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqAYBAAAAAaoGAAAAyQYCqwYBAAAAAawGQAAAAAGtBkAAAAABrwYBAAAAAckGAQAAAAECAAAATQAgYwAAkBEAIAMAAABNACBjAACQEQAgZAAAjxEAIAFcAACYGgAwAgAAAE0AIFwAAI8RACACAAAA8g4AIFwAAI4RACAL8gUBALAMACH6BUAAsgwAIfsFQACyDAAhngYBALEMACGoBgEAsQwAIaoGAAD0DskGIqsGAQCxDAAhrAZAAMgMACGtBkAAsgwAIa8GAQCxDAAhyQYBALAMACEOFwAA9w4AIBgAAPgOACAZAACcDwAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhngYBALEMACGoBgEAsQwAIaoGAAD0DskGIqsGAQCxDAAhrAZAAMgMACGtBkAAsgwAIa8GAQCxDAAhyQYBALAMACEOFwAA-w4AIBgAAPwOACAZAACdDwAg8gUBAAAAAfoFQAAAAAH7BUAAAAABngYBAAAAAagGAQAAAAGqBgAAAMkGAqsGAQAAAAGsBkAAAAABrQZAAAAAAa8GAQAAAAHJBgEAAAABAdcHAQAAAAQEYwAAiBEAMNQHAACJEQAw1gcAAIsRACDaBwAA7g4AMAAAAAAC1wcBAAAABOEHAQAAAAULYwAAmREAMGQAAJ0RADDUBwAAmhEAMNUHAACbEQAw1gcAAJwRACDXBwAA7gwAMNgHAADuDAAw2QcAAO4MADDaBwAA7gwAMNsHAACeEQAw3AcAAPEMADASBwAA_wwAIAkAAIANACAQAACrDgAgGAAA_gwAIDMAAP0MACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGcBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrwYBAAAAAQIAAACjAQAgYwAAoREAIAMAAACjAQAgYwAAoREAIGQAAKARACABXAAAlxoAMAIAAACjAQAgXAAAoBEAIAIAAADyDAAgXAAAnxEAIA3yBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhhwYBALAMACGcBgEAsQwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrwYBALEMACESBwAA-QwAIAkAAPoMACAQAACqDgAgGAAA-AwAIDMAAPcMACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhhwYBALAMACGcBgEAsQwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrwYBALEMACESBwAA_wwAIAkAAIANACAQAACrDgAgGAAA_gwAIDMAAP0MACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGcBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrwYBAAAAAQHXBwEAAAAEBGMAAJkRADDUBwAAmhEAMNYHAACcEQAg2gcAAO4MADAAAAAAAAAB1wcAAADnBgIFYwAAkhoAIGQAAJUaACDUBwAAkxoAINUHAACUGgAg2gcAAPQEACADYwAAkhoAINQHAACTGgAg2gcAAPQEACAAAAAFYwAAjRoAIGQAAJAaACDUBwAAjhoAINUHAACPGgAg2gcAAPQEACADYwAAjRoAINQHAACOGgAg2gcAAPQEACAeBgAAuBYAIAwAALMQACANAAC1EAAgEQAAuxYAIBwAALcQACAlAAC0EAAgJwAAthAAICoAAMMWACAuAAC0FgAgLwAAtRYAIDAAALcWACAxAAC5FgAgMgAAuhYAIDQAAKQRACA1AAC9FgAgNgAAvhYAIDcAAL8WACA6AACzFgAgOwAAthYAID8AAMIWACBAAAC8FgAgQQAAwBYAIEIAAMEWACBHAADEFgAgSAAAxRYAIEkAAMUWACCmBgAArAwAINEGAACsDAAgkQcAAKwMACCUBwAArAwAIAAAAAAAAAAAAAAFYwAAiBoAIGQAAIsaACDUBwAAiRoAINUHAACKGgAg2gcAAPgHACADYwAAiBoAINQHAACJGgAg2gcAAPgHACAAAAAFYwAAgBoAIGQAAIYaACDUBwAAgRoAINUHAACFGgAg2gcAAPABACAFYwAA_hkAIGQAAIMaACDUBwAA_xkAINUHAACCGgAg2gcAAPECACADYwAAgBoAINQHAACBGgAg2gcAAPABACADYwAA_hkAINQHAAD_GQAg2gcAAPECACAAAAAB1wcAAACCBwIFYwAA-RkAIGQAAPwZACDUBwAA-hkAINUHAAD7GQAg2gcAAPABACADYwAA-RkAINQHAAD6GQAg2gcAAPABACAAAAAFYwAA7xkAIGQAAPcZACDUBwAA8BkAINUHAAD2GQAg2gcAAPQEACAFYwAA7RkAIGQAAPQZACDUBwAA7hkAINUHAADzGQAg2gcAAPECACALYwAA3xEAMGQAAOQRADDUBwAA4BEAMNUHAADhEQAw1gcAAOIRACDXBwAA4xEAMNgHAADjEQAw2QcAAOMRADDaBwAA4xEAMNsHAADlEQAw3AcAAOYRADALYwAA0xEAMGQAANgRADDUBwAA1BEAMNUHAADVEQAw1gcAANYRACDXBwAA1xEAMNgHAADXEQAw2QcAANcRADDaBwAA1xEAMNsHAADZEQAw3AcAANoRADAEAwAAxREAIPIFAQAAAAH5BQEAAAABgAdAAAAAAQIAAAD4AQAgYwAA3hEAIAMAAAD4AQAgYwAA3hEAIGQAAN0RACABXAAA8hkAMAoDAAC1CgAgRAAA0wsAIO8FAADSCwAw8AUAAPYBABDxBQAA0gsAMPIFAQAAAAH5BQEAsAoAIf8GAQCwCgAhgAdAALQKACHKBwAA0QsAIAIAAAD4AQAgXAAA3REAIAIAAADbEQAgXAAA3BEAIAfvBQAA2hEAMPAFAADbEQAQ8QUAANoRADDyBQEAsAoAIfkFAQCwCgAh_wYBALAKACGAB0AAtAoAIQfvBQAA2hEAMPAFAADbEQAQ8QUAANoRADDyBQEAsAoAIfkFAQCwCgAh_wYBALAKACGAB0AAtAoAIQPyBQEAsAwAIfkFAQCwDAAhgAdAALIMACEEAwAAwxEAIPIFAQCwDAAh-QUBALAMACGAB0AAsgwAIQQDAADFEQAg8gUBAAAAAfkFAQAAAAGAB0AAAAABA_IFAQAAAAH6BUAAAAABggcAAACCBwICAAAA9AEAIGMAAOoRACADAAAA9AEAIGMAAOoRACBkAADpEQAgAVwAAPEZADAJRAAA0wsAIO8FAADVCwAw8AUAAPIBABDxBQAA1QsAMPIFAQAAAAH6BUAAtAoAIf8GAQCwCgAhggcAANYLggciywcAANQLACACAAAA9AEAIFwAAOkRACACAAAA5xEAIFwAAOgRACAH7wUAAOYRADDwBQAA5xEAEPEFAADmEQAw8gUBALAKACH6BUAAtAoAIf8GAQCwCgAhggcAANYLggciB-8FAADmEQAw8AUAAOcRABDxBQAA5hEAMPIFAQCwCgAh-gVAALQKACH_BgEAsAoAIYIHAADWC4IHIgPyBQEAsAwAIfoFQACyDAAhggcAAMkRggciA_IFAQCwDAAh-gVAALIMACGCBwAAyRGCByID8gUBAAAAAfoFQAAAAAGCBwAAAIIHAgNjAADvGQAg1AcAAPAZACDaBwAA9AQAIANjAADtGQAg1AcAAO4ZACDaBwAA8QIAIARjAADfEQAw1AcAAOARADDWBwAA4hEAINoHAADjEQAwBGMAANMRADDUBwAA1BEAMNYHAADWEQAg2gcAANcRADAAAAAAAAAAAAHXBwAAAJMHAwHXBwAAAMAGAwXXBxAAAAAB3QcQAAAAAd4HEAAAAAHfBxAAAAAB4AcQAAAAAQHXBwAAAKMHAgVjAADhGQAgZAAA6xkAINQHAADiGQAg1QcAAOoZACDaBwAA8QIAIAdjAADfGQAgZAAA6BkAINQHAADgGQAg1QcAAOcZACDYBwAAUQAg2QcAAFEAINoHAADxAgAgB2MAAN0ZACBkAADlGQAg1AcAAN4ZACDVBwAA5BkAINgHAAAWACDZBwAAFgAg2gcAAPQEACALYwAA_xEAMGQAAIQSADDUBwAAgBIAMNUHAACBEgAw1gcAAIISACDXBwAAgxIAMNgHAACDEgAw2QcAAIMSADDaBwAAgxIAMNsHAACFEgAw3AcAAIYSADAMBwAAvA4AIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAMIGAsAGAAAAwAYCwgYQAAAAAcMGAQAAAAHEBgIAAAABxQZAAAAAAcYGQAAAAAECAAAA2wEAIGMAAIoSACADAAAA2wEAIGMAAIoSACBkAACJEgAgAVwAAOMZADARBwAA-QoAID4AAOILACDvBQAA4AsAMPAFAADZAQAQ8QUAAOALADDyBQEAAAAB9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhqgYAAOELwgYivgYBALEKACHABgAA2gvABiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHFBkAAtAoAIcYGQAC0CgAhAgAAANsBACBcAACJEgAgAgAAAIcSACBcAACIEgAgD-8FAACGEgAw8AUAAIcSABDxBQAAhhIAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhqgYAAOELwgYivgYBALEKACHABgAA2gvABiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHFBkAAtAoAIcYGQAC0CgAhD-8FAACGEgAw8AUAAIcSABDxBQAAhhIAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhqgYAAOELwgYivgYBALEKACHABgAA2gvABiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHFBkAAtAoAIcYGQAC0CgAhC_IFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhqgYAALcOwgYiwAYAALYOwAYiwgYQALgOACHDBgEAsAwAIcQGAgC5DgAhxQZAALIMACHGBkAAsgwAIQwHAAC6DgAg8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGqBgAAtw7CBiLABgAAtg7ABiLCBhAAuA4AIcMGAQCwDAAhxAYCALkOACHFBkAAsgwAIcYGQACyDAAhDAcAALwOACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAADCBgLABgAAAMAGAsIGEAAAAAHDBgEAAAABxAYCAAAAAcUGQAAAAAHGBkAAAAABA2MAAOEZACDUBwAA4hkAINoHAADxAgAgA2MAAN8ZACDUBwAA4BkAINoHAADxAgAgA2MAAN0ZACDUBwAA3hkAINoHAAD0BAAgBGMAAP8RADDUBwAAgBIAMNYHAACCEgAg2gcAAIMSADAAAAALYwAAwhQAMGQAAMcUADDUBwAAwxQAMNUHAADEFAAw1gcAAMUUACDXBwAAxhQAMNgHAADGFAAw2QcAAMYUADDaBwAAxhQAMNsHAADIFAAw3AcAAMkUADALYwAAthQAMGQAALsUADDUBwAAtxQAMNUHAAC4FAAw1gcAALkUACDXBwAAuhQAMNgHAAC6FAAw2QcAALoUADDaBwAAuhQAMNsHAAC8FAAw3AcAAL0UADALYwAAnRQAMGQAAKIUADDUBwAAnhQAMNUHAACfFAAw1gcAAKAUACDXBwAAoRQAMNgHAAChFAAw2QcAAKEUADDaBwAAoRQAMNsHAACjFAAw3AcAAKQUADALYwAAhRQAMGQAAIoUADDUBwAAhhQAMNUHAACHFAAw1gcAAIgUACDXBwAAiRQAMNgHAACJFAAw2QcAAIkUADDaBwAAiRQAMNsHAACLFAAw3AcAAIwUADALYwAA_BMAMGQAAIAUADDUBwAA_RMAMNUHAAD-EwAw1gcAAP8TACDXBwAA4A8AMNgHAADgDwAw2QcAAOAPADDaBwAA4A8AMNsHAACBFAAw3AcAAOMPADALYwAA8RMAMGQAAPUTADDUBwAA8hMAMNUHAADzEwAw1gcAAPQTACDXBwAA3RAAMNgHAADdEAAw2QcAAN0QADDaBwAA3RAAMNsHAAD2EwAw3AcAAOAQADALYwAA4hMAMGQAAOcTADDUBwAA4xMAMNUHAADkEwAw1gcAAOUTACDXBwAA5hMAMNgHAADmEwAw2QcAAOYTADDaBwAA5hMAMNsHAADoEwAw3AcAAOkTADALYwAA1hMAMGQAANsTADDUBwAA1xMAMNUHAADYEwAw1gcAANkTACDXBwAA2hMAMNgHAADaEwAw2QcAANoTADDaBwAA2hMAMNsHAADcEwAw3AcAAN0TADALYwAAyhMAMGQAAM8TADDUBwAAyxMAMNUHAADMEwAw1gcAAM0TACDXBwAAzhMAMNgHAADOEwAw2QcAAM4TADDaBwAAzhMAMNsHAADQEwAw3AcAANETADALYwAAwRMAMGQAAMUTADDUBwAAwhMAMNUHAADDEwAw1gcAAMQTACDXBwAAwA0AMNgHAADADQAw2QcAAMANADDaBwAAwA0AMNsHAADGEwAw3AcAAMMNADALYwAAuBMAMGQAALwTADDUBwAAuRMAMNUHAAC6EwAw1gcAALsTACDXBwAArA0AMNgHAACsDQAw2QcAAKwNADDaBwAArA0AMNsHAAC9EwAw3AcAAK8NADALYwAArBMAMGQAALETADDUBwAArRMAMNUHAACuEwAw1gcAAK8TACDXBwAAsBMAMNgHAACwEwAw2QcAALATADDaBwAAsBMAMNsHAACyEwAw3AcAALMTADALYwAAoxMAMGQAAKcTADDUBwAApBMAMNUHAAClEwAw1gcAAKYTACDXBwAA7gwAMNgHAADuDAAw2QcAAO4MADDaBwAA7gwAMNsHAACoEwAw3AcAAPEMADALYwAAmhMAMGQAAJ4TADDUBwAAmxMAMNUHAACcEwAw1gcAAJ0TACDXBwAAhQ0AMNgHAACFDQAw2QcAAIUNADDaBwAAhQ0AMNsHAACfEwAw3AcAAIgNADALYwAAkRMAMGQAAJUTADDUBwAAkhMAMNUHAACTEwAw1gcAAJQTACDXBwAAlQ0AMNgHAACVDQAw2QcAAJUNADDaBwAAlQ0AMNsHAACWEwAw3AcAAJgNADALYwAAiBMAMGQAAIwTADDUBwAAiRMAMNUHAACKEwAw1gcAAIsTACDXBwAA2wwAMNgHAADbDAAw2QcAANsMADDaBwAA2wwAMNsHAACNEwAw3AcAAN4MADALYwAA_xIAMGQAAIMTADDUBwAAgBMAMNUHAACBEwAw1gcAAIITACDXBwAAvA8AMNgHAAC8DwAw2QcAALwPADDaBwAAvA8AMNsHAACEEwAw3AcAAL8PADALYwAA9hIAMGQAAPoSADDUBwAA9xIAMNUHAAD4EgAw1gcAAPkSACDXBwAA2A4AMNgHAADYDgAw2QcAANgOADDaBwAA2A4AMNsHAAD7EgAw3AcAANsOADAHYwAA8RIAIGQAAPQSACDUBwAA8hIAINUHAADzEgAg2AcAAOUBACDZBwAA5QEAINoHAACyBgAgC2MAAOUSADBkAADqEgAw1AcAAOYSADDVBwAA5xIAMNYHAADoEgAg1wcAAOkSADDYBwAA6RIAMNkHAADpEgAw2gcAAOkSADDbBwAA6xIAMNwHAADsEgAwC2MAANwSADBkAADgEgAw1AcAAN0SADDVBwAA3hIAMNYHAADfEgAg1wcAAIMSADDYBwAAgxIAMNkHAACDEgAw2gcAAIMSADDbBwAA4RIAMNwHAACGEgAwC2MAANMSADBkAADXEgAw1AcAANQSADDVBwAA1RIAMNYHAADWEgAg1wcAAJQQADDYBwAAlBAAMNkHAACUEAAw2gcAAJQQADDbBwAA2BIAMNwHAACXEAAwC2MAAMoSADBkAADOEgAw1AcAAMsSADDVBwAAzBIAMNYHAADNEgAg1wcAAOkNADDYBwAA6Q0AMNkHAADpDQAw2gcAAOkNADDbBwAAzxIAMNwHAADsDQAwC2MAAL4SADBkAADDEgAw1AcAAL8SADDVBwAAwBIAMNYHAADBEgAg1wcAAMISADDYBwAAwhIAMNkHAADCEgAw2gcAAMISADDbBwAAxBIAMNwHAADFEgAwC2MAALUSADBkAAC5EgAw1AcAALYSADDVBwAAtxIAMNYHAAC4EgAg1wcAAMAMADDYBwAAwAwAMNkHAADADAAw2gcAAMAMADDbBwAAuhIAMNwHAADDDAAwC2MAAKwSADBkAACwEgAw1AcAAK0SADDVBwAArhIAMNYHAACvEgAg1wcAAMAMADDYBwAAwAwAMNkHAADADAAw2gcAAMAMADDbBwAAsRIAMNwHAADDDAAwFRAAANMOACAYAADUDAAgGQAA1QwAIB4AANEMACAgAADTDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABrwYBAAAAAYYHAAAAhgcCiAcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABAgAAAF0AIGMAALQSACADAAAAXQAgYwAAtBIAIGQAALMSACABXAAA3BkAMAIAAABdACBcAACzEgAgAgAAAMQMACBcAACyEgAgD_IFAQCwDAAh-gVAALIMACH7BUAAsgwAIZwGAQCxDAAhngYBALEMACGqBgAAxwyIByKsBkAAyAwAIa8GAQCxDAAhhgcAAMYMhgciiAcBALAMACGKBwEAsAwAIYsHAQCxDAAhjAcBALEMACGNBwEAsQwAIY4HQACyDAAhFRAAANEOACAYAADNDAAgGQAAzgwAIB4AAMoMACAgAADMDAAgIQAAzwwAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIZwGAQCxDAAhngYBALEMACGqBgAAxwyIByKsBkAAyAwAIa8GAQCxDAAhhgcAAMYMhgciiAcBALAMACGKBwEAsAwAIYsHAQCxDAAhjAcBALEMACGNBwEAsQwAIY4HQACyDAAhFRAAANMOACAYAADUDAAgGQAA1QwAIB4AANEMACAgAADTDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABrwYBAAAAAYYHAAAAhgcCiAcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABFRAAANMOACAYAADUDAAgGQAA1QwAIB8AANIMACAgAADTDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABrwYBAAAAAYYHAAAAhgcCiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABAgAAAF0AIGMAAL0SACADAAAAXQAgYwAAvRIAIGQAALwSACABXAAA2xkAMAIAAABdACBcAAC8EgAgAgAAAMQMACBcAAC7EgAgD_IFAQCwDAAh-gVAALIMACH7BUAAsgwAIZwGAQCxDAAhngYBALEMACGqBgAAxwyIByKsBkAAyAwAIa8GAQCxDAAhhgcAAMYMhgciiQcBALAMACGKBwEAsAwAIYsHAQCxDAAhjAcBALEMACGNBwEAsQwAIY4HQACyDAAhFRAAANEOACAYAADNDAAgGQAAzgwAIB8AAMsMACAgAADMDAAgIQAAzwwAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIZwGAQCxDAAhngYBALEMACGqBgAAxwyIByKsBkAAyAwAIa8GAQCxDAAhhgcAAMYMhgciiQcBALAMACGKBwEAsAwAIYsHAQCxDAAhjAcBALEMACGNBwEAsQwAIY4HQACyDAAhFRAAANMOACAYAADUDAAgGQAA1QwAIB8AANIMACAgAADTDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABrwYBAAAAAYYHAAAAhgcCiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABCkMAAOwRACBFAADtEQAgRgAA7hEAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaMGAQAAAAGkBgEAAAABgwcBAAAAAYQHAAAAggcCAgAAAPABACBjAADJEgAgAwAAAPABACBjAADJEgAgZAAAyBIAIAFcAADaGQAwDwcAAPkKACBDAAC1CgAgRQAA2AsAIEYAAMcLACDvBQAA1wsAMPAFAADuAQAQ8QUAANcLADDyBQEAAAAB9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhowYBALAKACGkBgEAsAoAIYMHAQCwCgAhhAcAANYLggciAgAAAPABACBcAADIEgAgAgAAAMYSACBcAADHEgAgC-8FAADFEgAw8AUAAMYSABDxBQAAxRIAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhowYBALAKACGkBgEAsAoAIYMHAQCwCgAhhAcAANYLggciC-8FAADFEgAw8AUAAMYSABDxBQAAxRIAMPIFAQCwCgAh9wUBALAKACH6BUAAtAoAIfsFQAC0CgAhowYBALAKACGkBgEAsAoAIYMHAQCwCgAhhAcAANYLggciB_IFAQCwDAAh-gVAALIMACH7BUAAsgwAIaMGAQCwDAAhpAYBALAMACGDBwEAsAwAIYQHAADJEYIHIgpDAADQEQAgRQAA0REAIEYAANIRACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGjBgEAsAwAIaQGAQCwDAAhgwcBALAMACGEBwAAyRGCByIKQwAA7BEAIEUAAO0RACBGAADuEQAg8gUBAAAAAfoFQAAAAAH7BUAAAAABowYBAAAAAaQGAQAAAAGDBwEAAAABhAcAAACCBwIOCQAA-A0AICgAAPUNACApAACpEAAgKwAA9g0AIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGwBgEAAAABywYBAAAAAdEGAQAAAAHYBgEAAAAB2QYBAAAAAdoGAQAAAAECAAAALAAgYwAA0hIAIAMAAAAsACBjAADSEgAgZAAA0RIAIAFcAADZGQAwAgAAACwAIFwAANESACACAAAA7Q0AIFwAANASACAK8gUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGwBgEAsAwAIcsGAQCwDAAh0QYBALEMACHYBgEAsQwAIdkGAQCwDAAh2gYBALAMACEOCQAA8w0AICgAAPANACApAACnEAAgKwAA8Q0AIPIFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhsAYBALAMACHLBgEAsAwAIdEGAQCxDAAh2AYBALEMACHZBgEAsAwAIdoGAQCwDAAhDgkAAPgNACAoAAD1DQAgKQAAqRAAICsAAPYNACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABsAYBAAAAAcsGAQAAAAHRBgEAAAAB2AYBAAAAAdkGAQAAAAHaBgEAAAABDQkAAK0QACALAACrEAAgGwAAwxAAIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAANgGAssGAQAAAAHRBgEAAAAB0wYBAAAAAdUGAQAAAAHWBgEAAAABAgAAADMAIGMAANsSACADAAAAMwAgYwAA2xIAIGQAANoSACABXAAA2BkAMAIAAAAzACBcAADaEgAgAgAAAJgQACBcAADZEgAgCvIFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhqgYAAJoQ2AYiywYBALAMACHRBgEAsQwAIdMGAQCxDAAh1QYBALAMACHWBgEAsAwAIQ0JAACeEAAgCwAAnBAAIBsAAMIQACDyBQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIaoGAACaENgGIssGAQCwDAAh0QYBALEMACHTBgEAsQwAIdUGAQCwDAAh1gYBALAMACENCQAArRAAIAsAAKsQACAbAADDEAAg8gUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAA2AYCywYBAAAAAdEGAQAAAAHTBgEAAAAB1QYBAAAAAdYGAQAAAAEMPgAAvQ4AIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAwgYCvgYBAAAAAcAGAAAAwAYCwgYQAAAAAcMGAQAAAAHEBgIAAAABxQZAAAAAAcYGQAAAAAECAAAA2wEAIGMAAOQSACADAAAA2wEAIGMAAOQSACBkAADjEgAgAVwAANcZADACAAAA2wEAIFwAAOMSACACAAAAhxIAIFwAAOISACAL8gUBALAMACH6BUAAsgwAIfsFQACyDAAhqgYAALcOwgYivgYBALEMACHABgAAtg7ABiLCBhAAuA4AIcMGAQCwDAAhxAYCALkOACHFBkAAsgwAIcYGQACyDAAhDD4AALsOACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGqBgAAtw7CBiK-BgEAsQwAIcAGAAC2DsAGIsIGEAC4DgAhwwYBALAMACHEBgIAuQ4AIcUGQACyDAAhxgZAALIMACEMPgAAvQ4AIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAwgYCvgYBAAAAAcAGAAAAwAYCwgYQAAAAAcMGAQAAAAHEBgIAAAABxQZAAAAAAcYGQAAAAAER8gUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAADnBgLABgAAAMAGAsIGEAAAAAHDBgEAAAABxAYCAAAAAeUGAQAAAAHnBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAHtBoAAAAAB7gZAAAAAAQIAAADpAQAgYwAA8BIAIAMAAADpAQAgYwAA8BIAIGQAAO8SACABXAAA1hkAMBYHAAD5CgAg7wUAANkLADDwBQAA5wEAEPEFAADZCwAw8gUBAAAAAfcFAQCwCgAh-gVAALQKACH7BUAAtAoAIaoGAADdC-cGIsAGAADaC8AGIsIGEADbCwAhwwYBALAKACHEBgIA3AsAIeUGAQCwCgAh5wYBAAAAAegGAQCxCgAh6QYBAAAAAeoGAQCxCgAh6wYBALEKACHsBgEAsQoAIe0GAADeCwAg7gZAAN8LACECAAAA6QEAIFwAAO8SACACAAAA7RIAIFwAAO4SACAV7wUAAOwSADDwBQAA7RIAEPEFAADsEgAw8gUBALAKACH3BQEAsAoAIfoFQAC0CgAh-wVAALQKACGqBgAA3QvnBiLABgAA2gvABiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHlBgEAsAoAIecGAQCwCgAh6AYBALEKACHpBgEAsQoAIeoGAQCxCgAh6wYBALEKACHsBgEAsQoAIe0GAADeCwAg7gZAAN8LACEV7wUAAOwSADDwBQAA7RIAEPEFAADsEgAw8gUBALAKACH3BQEAsAoAIfoFQAC0CgAh-wVAALQKACGqBgAA3QvnBiLABgAA2gvABiLCBhAA2wsAIcMGAQCwCgAhxAYCANwLACHlBgEAsAoAIecGAQCwCgAh6AYBALEKACHpBgEAsQoAIeoGAQCxCgAh6wYBALEKACHsBgEAsQoAIe0GAADeCwAg7gZAAN8LACER8gUBALAMACH6BUAAsgwAIfsFQACyDAAhqgYAAKoR5wYiwAYAALYOwAYiwgYQALgOACHDBgEAsAwAIcQGAgC5DgAh5QYBALAMACHnBgEAsAwAIegGAQCxDAAh6QYBALEMACHqBgEAsQwAIesGAQCxDAAh7AYBALEMACHtBoAAAAAB7gZAAMgMACER8gUBALAMACH6BUAAsgwAIfsFQACyDAAhqgYAAKoR5wYiwAYAALYOwAYiwgYQALgOACHDBgEAsAwAIcQGAgC5DgAh5QYBALAMACHnBgEAsAwAIegGAQCxDAAh6QYBALEMACHqBgEAsQwAIesGAQCxDAAh7AYBALEMACHtBoAAAAAB7gZAAMgMACER8gUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAADnBgLABgAAAMAGAsIGEAAAAAHDBgEAAAABxAYCAAAAAeUGAQAAAAHnBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAHtBoAAAAAB7gZAAAAAAQvyBQEAAAAB-gVAAAAAAfsFQAAAAAHvBgEAAAAB8AYBAAAAAfEGAQAAAAHyBgEAAAAB8wYBAAAAAfQGAQAAAAH1BiAAAAAB9gYBAAAAAQIAAACyBgAgYwAA8RIAIAMAAADlAQAgYwAA8RIAIGQAAPUSACANAAAA5QEAIFwAAPUSACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACHvBgEAsAwAIfAGAQCwDAAh8QYBALAMACHyBgEAsAwAIfMGAQCwDAAh9AYBALAMACH1BiAAkg4AIfYGAQCxDAAhC_IFAQCwDAAh-gVAALIMACH7BUAAsgwAIe8GAQCwDAAh8AYBALAMACHxBgEAsAwAIfIGAQCwDAAh8wYBALAMACH0BgEAsAwAIfUGIACSDgAh9gYBALEMACEaCQAA5w4AIBkAALcPACAbAADoDgAgHQAA6Q4AIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqgYAAAD7BgLCBhAAAAABwwYBAAAAAcQGAgAAAAHTBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QaAAAAAAe4GQAAAAAH3BgEAAAAB-QYAAAD5BgL7BgEAAAAB_AZAAAAAAQIAAABXACBjAAD-EgAgAwAAAFcAIGMAAP4SACBkAAD9EgAgAVwAANUZADACAAAAVwAgXAAA_RIAIAIAAADcDgAgXAAA_BIAIBbyBQEAsAwAIfgFAQCwDAAh-gVAALIMACH7BUAAsgwAIZ4GAQCwDAAhqgYAAN8O-wYiwgYQALgOACHDBgEAsAwAIcQGAgC5DgAh0wYBALAMACHnBgEAsAwAIegGAQCxDAAh6QYBALEMACHqBgEAsQwAIesGAQCxDAAh7AYBALEMACHtBoAAAAAB7gZAAMgMACH3BgEAsAwAIfkGAADeDvkGIvsGAQCwDAAh_AZAALIMACEaCQAA4g4AIBkAALUPACAbAADjDgAgHQAA5A4AIPIFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAhngYBALAMACGqBgAA3w77BiLCBhAAuA4AIcMGAQCwDAAhxAYCALkOACHTBgEAsAwAIecGAQCwDAAh6AYBALEMACHpBgEAsQwAIeoGAQCxDAAh6wYBALEMACHsBgEAsQwAIe0GgAAAAAHuBkAAyAwAIfcGAQCwDAAh-QYAAN4O-QYi-wYBALAMACH8BkAAsgwAIRoJAADnDgAgGQAAtw8AIBsAAOgOACAdAADpDgAg8gUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZ4GAQAAAAGqBgAAAPsGAsIGEAAAAAHDBgEAAAABxAYCAAAAAdMGAQAAAAHnBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAHtBoAAAAAB7gZAAAAAAfcGAQAAAAH5BgAAAPkGAvsGAQAAAAH8BkAAAAABDAkAANEPACAbAAC-EQAgHAAA0g8AIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHDBgEAAAAB0wYBAAAAAfUGIAAAAAH9BhAAAAAB_gYQAAAAAQIAAAB2ACBjAACHEwAgAwAAAHYAIGMAAIcTACBkAACGEwAgAVwAANQZADACAAAAdgAgXAAAhhMAIAIAAADADwAgXAAAhRMAIAnyBQEAsAwAIfgFAQCwDAAh-gVAALIMACH7BUAAsgwAIcMGAQCwDAAh0wYBALAMACH1BiAAkg4AIf0GEAC4DgAh_gYQALgOACEMCQAAxA8AIBsAAL0RACAcAADFDwAg8gUBALAMACH4BQEAsAwAIfoFQACyDAAh-wVAALIMACHDBgEAsAwAIdMGAQCwDAAh9QYgAJIOACH9BhAAuA4AIf4GEAC4DgAhDAkAANEPACAbAAC-EQAgHAAA0g8AIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHDBgEAAAAB0wYBAAAAAfUGIAAAAAH9BhAAAAAB_gYQAAAAARYJAADpDAAgEAAA1w0AICkAAOcMACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABnAYBAAAAAbAGAQAAAAGxBggAAAABsgYIAAAAAbMGCAAAAAG0BggAAAABtQYIAAAAAbYGCAAAAAG3BggAAAABuAYIAAAAAbkGCAAAAAG6BggAAAABuwYIAAAAAbwGCAAAAAG9BggAAAABAgAAAK0BACBjAACQEwAgAwAAAK0BACBjAACQEwAgZAAAjxMAIAFcAADTGQAwAgAAAK0BACBcAACPEwAgAgAAAN8MACBcAACOEwAgE_IFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhnAYBALAMACGwBgEAsAwAIbEGCADhDAAhsgYIAOEMACGzBggA4QwAIbQGCADhDAAhtQYIAOEMACG2BggA4QwAIbcGCADhDAAhuAYIAOEMACG5BggA4QwAIboGCADhDAAhuwYIAOEMACG8BggA4QwAIb0GCADhDAAhFgkAAOUMACAQAADWDQAgKQAA4wwAIPIFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhnAYBALAMACGwBgEAsAwAIbEGCADhDAAhsgYIAOEMACGzBggA4QwAIbQGCADhDAAhtQYIAOEMACG2BggA4QwAIbcGCADhDAAhuAYIAOEMACG5BggA4QwAIboGCADhDAAhuwYIAOEMACG8BggA4QwAIb0GCADhDAAhFgkAAOkMACAQAADXDQAgKQAA5wwAIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABsAYBAAAAAbEGCAAAAAGyBggAAAABswYIAAAAAbQGCAAAAAG1BggAAAABtgYIAAAAAbcGCAAAAAG4BggAAAABuQYIAAAAAboGCAAAAAG7BggAAAABvAYIAAAAAb0GCAAAAAENCQAAog0AIBIAAKEOACAZAACgDQAg8gUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZ0GAQAAAAGeBgEAAAABnwYBAAAAAaAGAQAAAAGhBgEAAAABogZAAAAAAQIAAABGACBjAACZEwAgAwAAAEYAIGMAAJkTACBkAACYEwAgAVwAANIZADACAAAARgAgXAAAmBMAIAIAAACZDQAgXAAAlxMAIAryBQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZ0GAQCwDAAhngYBALAMACGfBgEAsQwAIaAGAQCxDAAhoQYBALEMACGiBkAAsgwAIQ0JAACeDQAgEgAAoA4AIBkAAJwNACDyBQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZ0GAQCwDAAhngYBALAMACGfBgEAsQwAIaAGAQCxDAAhoQYBALEMACGiBkAAsgwAIQ0JAACiDQAgEgAAoQ4AIBkAAKANACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBkAAAAABDgkAAKYNACAOAACkDQAgEAAApg4AICMAAKcNACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZwGAQAAAAGjBgEAAAABpAYBAAAAAaYGAAAApgYCpwZAAAAAAQIAAABBACBjAACiEwAgAwAAAEEAIGMAAKITACBkAAChEwAgAVwAANEZADACAAAAQQAgXAAAoRMAIAIAAACJDQAgXAAAoBMAIAryBQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhnAYBALAMACGjBgEAsAwAIaQGAQCxDAAhpgYAAIsNpgYipwZAAMgMACEOCQAAjw0AIA4AAI0NACAQAAClDgAgIwAAkA0AIPIFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGcBgEAsAwAIaMGAQCwDAAhpAYBALEMACGmBgAAiw2mBiKnBkAAyAwAIQ4JAACmDQAgDgAApA0AIBAAAKYOACAjAACnDQAg8gUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGcBgEAAAABowYBAAAAAaQGAQAAAAGmBgAAAKYGAqcGQAAAAAESCQAAgA0AIBAAAKsOACAWAAD8DAAgGAAA_gwAIDMAAP0MACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABhwYBAAAAAZwGAQAAAAGoBgEAAAABqgYAAACqBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAAQIAAACjAQAgYwAAqxMAIAMAAACjAQAgYwAAqxMAIGQAAKoTACABXAAA0BkAMAIAAACjAQAgXAAAqhMAIAIAAADyDAAgXAAAqRMAIA3yBQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIYcGAQCwDAAhnAYBALEMACGoBgEAsQwAIaoGAAD0DKoGIqsGAQCxDAAhrAZAAMgMACGtBkAAsgwAIa4GAQCwDAAhrwYBALEMACESCQAA-gwAIBAAAKoOACAWAAD2DAAgGAAA-AwAIDMAAPcMACDyBQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIYcGAQCwDAAhnAYBALEMACGoBgEAsQwAIaoGAAD0DKoGIqsGAQCxDAAhrAZAAMgMACGtBkAAsgwAIa4GAQCwDAAhrwYBALEMACESCQAAgA0AIBAAAKsOACAWAAD8DAAgGAAA_gwAIDMAAP0MACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABhwYBAAAAAZwGAQAAAAGoBgEAAAABqgYAAACqBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAAR08AACLEgAgPQAAjBIAID8AAI4SACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAKMHAqwGQAAAAAHRBgEAAAABjwcBAAAAAZAHAQAAAAGRBwEAAAABkwcAAACTBwOUBwEAAAABlQcAAADABgOWBxAAAAABlwcBAAAAAZgHAgAAAAGZBwAAAOcGApoHAQAAAAGbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHgAAAAAGhB0AAAAABowcBAAAAAaQHAQAAAAECAAAA1QEAIGMAALcTACADAAAA1QEAIGMAALcTACBkAAC2EwAgAVwAAM8ZADAiBwAA6QsAIDwAALUKACA9AADoCwAgPwAArgsAIO8FAADjCwAw8AUAANMBABDxBQAA4wsAMPIFAQAAAAH3BQEAsQoAIfoFQAC0CgAh-wVAALQKACGqBgAA5wujByKsBkAA3wsAIdEGAQCxCgAhjwcBALAKACGQBwEAsAoAIZEHAQCxCgAhkwcAAJ4LkwcjlAcBALEKACGVBwAA5AvABiOWBxAA5QsAIZcHAQCwCgAhmAcCAOYLACGZBwAA3QvnBiKaBwEAAAABmwcBALEKACGcBwEAAAABnQcBALEKACGeBwEAsQoAIZ8HAQCxCgAhoAcAAN4LACChB0AA3wsAIaMHAQCxCgAhpAcBALEKACECAAAA1QEAIFwAALYTACACAAAAtBMAIFwAALUTACAe7wUAALMTADDwBQAAtBMAEPEFAACzEwAw8gUBALAKACH3BQEAsQoAIfoFQAC0CgAh-wVAALQKACGqBgAA5wujByKsBkAA3wsAIdEGAQCxCgAhjwcBALAKACGQBwEAsAoAIZEHAQCxCgAhkwcAAJ4LkwcjlAcBALEKACGVBwAA5AvABiOWBxAA5QsAIZcHAQCwCgAhmAcCAOYLACGZBwAA3QvnBiKaBwEAsQoAIZsHAQCxCgAhnAcBALEKACGdBwEAsQoAIZ4HAQCxCgAhnwcBALEKACGgBwAA3gsAIKEHQADfCwAhowcBALEKACGkBwEAsQoAIR7vBQAAsxMAMPAFAAC0EwAQ8QUAALMTADDyBQEAsAoAIfcFAQCxCgAh-gVAALQKACH7BUAAtAoAIaoGAADnC6MHIqwGQADfCwAh0QYBALEKACGPBwEAsAoAIZAHAQCwCgAhkQcBALEKACGTBwAAnguTByOUBwEAsQoAIZUHAADkC8AGI5YHEADlCwAhlwcBALAKACGYBwIA5gsAIZkHAADdC-cGIpoHAQCxCgAhmwcBALEKACGcBwEAsQoAIZ0HAQCxCgAhngcBALEKACGfBwEAsQoAIaAHAADeCwAgoQdAAN8LACGjBwEAsQoAIaQHAQCxCgAhGvIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaoGAAD6EaMHIqwGQADIDAAh0QYBALEMACGPBwEAsAwAIZAHAQCwDAAhkQcBALEMACGTBwAA9xGTByOUBwEAsQwAIZUHAAD4EcAGI5YHEAD5EQAhlwcBALAMACGYBwIA5g8AIZkHAACqEecGIpoHAQCxDAAhmwcBALEMACGcBwEAsQwAIZ0HAQCxDAAhngcBALEMACGfBwEAsQwAIaAHgAAAAAGhB0AAyAwAIaMHAQCxDAAhpAcBALEMACEdPAAA-xEAID0AAPwRACA_AAD-EQAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhqgYAAPoRowcirAZAAMgMACHRBgEAsQwAIY8HAQCwDAAhkAcBALAMACGRBwEAsQwAIZMHAAD3EZMHI5QHAQCxDAAhlQcAAPgRwAYjlgcQAPkRACGXBwEAsAwAIZgHAgDmDwAhmQcAAKoR5wYimgcBALEMACGbBwEAsQwAIZwHAQCxDAAhnQcBALEMACGeBwEAsQwAIZ8HAQCxDAAhoAeAAAAAAaEHQADIDAAhowcBALEMACGkBwEAsQwAIR08AACLEgAgPQAAjBIAID8AAI4SACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAKMHAqwGQAAAAAHRBgEAAAABjwcBAAAAAZAHAQAAAAGRBwEAAAABkwcAAACTBwOUBwEAAAABlQcAAADABgOWBxAAAAABlwcBAAAAAZgHAgAAAAGZBwAAAOcGApoHAQAAAAGbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHgAAAAAGhB0AAAAABowcBAAAAAaQHAQAAAAELCQAAuw0AIA4AALgNACAPAAC5DQAgEAAAnA4AIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAECAAAAPAAgYwAAwBMAIAMAAAA8ACBjAADAEwAgZAAAvxMAIAFcAADOGQAwAgAAADwAIFwAAL8TACACAAAAsA0AIFwAAL4TACAH8gUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGaBgEAsAwAIZsGAQCwDAAhnAYBALAMACELCQAAtg0AIA4AALMNACAPAAC0DQAgEAAAmw4AIPIFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGbBgEAsAwAIZwGAQCwDAAhCwkAALsNACAOAAC4DQAgDwAAuQ0AIBAAAJwOACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABFQkAAIAOACAKAACBDgAgCwAA-g0AIA4AAP8NACAPAAD9DQAgEAAAkA8AIBkAAP4NACAbAACCDgAgLAAA-w0AIC0AAPwNACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABngYBAAAAAdMGAQAAAAHjBgEAAAABpgdAAAAAAQIAAAAoACBjAADJEwAgAwAAACgAIGMAAMkTACBkAADIEwAgAVwAAM0ZADACAAAAKAAgXAAAyBMAIAIAAADEDQAgXAAAxxMAIAvyBQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIZ4GAQCwDAAh0wYBALAMACHjBgEAsQwAIaYHQACyDAAhFQkAAM0NACAKAADODQAgCwAAxw0AIA4AAMwNACAPAADKDQAgEAAAjg8AIBkAAMsNACAbAADPDQAgLAAAyA0AIC0AAMkNACDyBQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIZ4GAQCwDAAh0wYBALAMACHjBgEAsQwAIaYHQACyDAAhFQkAAIAOACAKAACBDgAgCwAA-g0AIA4AAP8NACAPAAD9DQAgEAAAkA8AIBkAAP4NACAbAACCDgAgLAAA-w0AIC0AAPwNACDyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABngYBAAAAAdMGAQAAAAHjBgEAAAABpgdAAAAAAQ4DAACTDwAgCQAAkg8AIA0AAJQPACATAACVDwAgGgAAlg8AIBwAAJcPACAiAACYDwAg8gUBAAAAAfYFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABxwYBAAAAAQIAAACdAQAgYwAA1RMAIAMAAACdAQAgYwAA1RMAIGQAANQTACABXAAAzBkAMBMDAAC1CgAgBwAA-QoAIAkAAPALACANAADfCgAgEwAAqgsAIBoAAO0KACAcAADhCgAgIgAAsQsAIO8FAAD2CwAw8AUAAFMAEPEFAAD2CwAw8gUBAAAAAfYFAQCxCgAh9wUBALAKACH4BQEAsQoAIfkFAQCwCgAh-gVAALQKACH7BUAAtAoAIccGAQAAAAECAAAAnQEAIFwAANQTACACAAAA0hMAIFwAANMTACAL7wUAANETADDwBQAA0hMAEPEFAADREwAw8gUBALAKACH2BQEAsQoAIfcFAQCwCgAh-AUBALEKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACHHBgEAsAoAIQvvBQAA0RMAMPAFAADSEwAQ8QUAANETADDyBQEAsAoAIfYFAQCxCgAh9wUBALAKACH4BQEAsQoAIfkFAQCwCgAh-gVAALQKACH7BUAAtAoAIccGAQCwCgAhB_IFAQCwDAAh9gUBALEMACH4BQEAsQwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIccGAQCwDAAhDgMAAMMOACAJAADCDgAgDQAAxA4AIBMAAMUOACAaAADGDgAgHAAAxw4AICIAAMgOACDyBQEAsAwAIfYFAQCxDAAh-AUBALEMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACHHBgEAsAwAIQ4DAACTDwAgCQAAkg8AIA0AAJQPACATAACVDwAgGgAAlg8AIBwAAJcPACAiAACYDwAg8gUBAAAAAfYFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABxwYBAAAAAREDAACMDgAgCQAAiw4AIA0AAIUOACARAACGDgAgIgAAig4AICQAAIcOACBKAACIDgAgSwAAiQ4AIPIFAQAAAAHzBQEAAAAB9AUBAAAAAfUFAQAAAAH2BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAQIAAAAQACBjAADhEwAgAwAAABAAIGMAAOETACBkAADgEwAgAVwAAMsZADAWAwAAtQoAIAcAAPkKACAJAAD9CwAgDQAA3woAIBEAAKcLACAiAACxCwAgJAAAqQsAIEoAAPAKACBLAACrCwAg7wUAAKcMADDwBQAADgAQ8QUAAKcMADDyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BQEAsAoAIfYFAQCxCgAh9wUBALAKACH4BQEAsAoAIfkFAQCwCgAh-gVAALQKACH7BUAAtAoAIQIAAAAQACBcAADgEwAgAgAAAN4TACBcAADfEwAgDe8FAADdEwAw8AUAAN4TABDxBQAA3RMAMPIFAQCwCgAh8wUBALAKACH0BQEAsAoAIfUFAQCwCgAh9gUBALEKACH3BQEAsAoAIfgFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhDe8FAADdEwAw8AUAAN4TABDxBQAA3RMAMPIFAQCwCgAh8wUBALAKACH0BQEAsAoAIfUFAQCwCgAh9gUBALEKACH3BQEAsAoAIfgFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhCfIFAQCwDAAh8wUBALAMACH0BQEAsAwAIfUFAQCwDAAh9gUBALEMACH4BQEAsAwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIREDAAC7DAAgCQAAugwAIA0AALQMACARAAC1DAAgIgAAuQwAICQAALYMACBKAAC3DAAgSwAAuAwAIPIFAQCwDAAh8wUBALAMACH0BQEAsAwAIfUFAQCwDAAh9gUBALEMACH4BQEAsAwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIREDAACMDgAgCQAAiw4AIA0AAIUOACARAACGDgAgIgAAig4AICQAAIcOACBKAACIDgAgSwAAiQ4AIPIFAQAAAAHzBQEAAAAB9AUBAAAAAfUFAQAAAAH2BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAQYDAADwEwAg8gUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAYIHAAAAygcCAgAAAAEAIGMAAO8TACADAAAAAQAgYwAA7xMAIGQAAO0TACABXAAAyhkAMAsDAAC1CgAgBwAA-QoAIO8FAACoDAAw8AUAAAsAEPEFAACoDAAw8gUBAAAAAfcFAQCwCgAh-QUBAAAAAfoFQAC0CgAh-wVAALQKACGCBwAAqQzKByICAAAAAQAgXAAA7RMAIAIAAADqEwAgXAAA6xMAIAnvBQAA6RMAMPAFAADqEwAQ8QUAAOkTADDyBQEAsAoAIfcFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhggcAAKkMygciCe8FAADpEwAw8AUAAOoTABDxBQAA6RMAMPIFAQCwCgAh9wUBALAKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACGCBwAAqQzKByIF8gUBALAMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACGCBwAA7BPKByIB1wcAAADKBwIGAwAA7hMAIPIFAQCwDAAh-QUBALAMACH6BUAAsgwAIfsFQACyDAAhggcAAOwTygciBWMAAMUZACBkAADIGQAg1AcAAMYZACDVBwAAxxkAINoHAADxAgAgBgMAAPATACDyBQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABggcAAADKBwIDYwAAxRkAINQHAADGGQAg2gcAAPECACANCQAA_BAAIAoAAPsTACANAAD9EAAgEQAA_hAAIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAAB3QYCAAAAAeMGAQAAAAGnBwEAAAABqAcBAAAAAQIAAAAjACBjAAD6EwAgAwAAACMAIGMAAPoTACBkAAD4EwAgAVwAAMQZADACAAAAIwAgXAAA-BMAIAIAAADhEAAgXAAA9xMAIAnyBQEAsAwAIfgFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh3QYCAOYPACHjBgEAsQwAIacHAQCwDAAhqAcBALAMACENCQAA5RAAIAoAAPkTACANAADmEAAgEQAA5xAAIPIFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHdBgIA5g8AIeMGAQCxDAAhpwcBALAMACGoBwEAsAwAIQdjAAC_GQAgZAAAwhkAINQHAADAGQAg1QcAAMEZACDYBwAAHQAg2QcAAB0AINoHAAAfACANCQAA_BAAIAoAAPsTACANAAD9EAAgEQAA_hAAIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAAB3QYCAAAAAeMGAQAAAAGnBwEAAAABqAcBAAAAAQNjAAC_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_xAAIPIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGjBgEAAAAB0QYBAAAAAdsGAQAAAAHcBkAAAAAB3QYIAAAAAd4GCAAAAAECAAAAHwAgYwAAwRQAIAMAAAAfACBjAADBFAAgZAAAwBQAIAFcAAC0GQAwEgcAAPkKACAJAAD9CwAgDQAA3woAIA8AAKMLACDvBQAAogwAMPAFAAAdABDxBQAAogwAMPIFAQAAAAH3BQEAsAoAIfgFAQCwCgAh-gVAALQKACH7BUAAtAoAIaMGAQCwCgAh0QYBALEKACHbBgEAsQoAIdwGQADfCwAh3QYIAO0LACHeBggA7QsAIQIAAAAfACBcAADAFAAgAgAAAL4UACBcAAC_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_xUAINcHAAC6FAAw2AcAALoUADDZBwAAuhQAMNoHAAC6FAAw2wcAAIEWADDcBwAAvRQAMAtjAADxFQAwZAAA9RUAMNQHAADyFQAw1QcAAPMVADDWBwAA9BUAINcHAAChFAAw2AcAAKEUADDZBwAAoRQAMNoHAAChFAAw2wcAAPYVADDcBwAApBQAMAtjAADoFQAwZAAA7BUAMNQHAADpFQAw1QcAAOoVADDWBwAA6xUAINcHAADdEAAw2AcAAN0QADDZBwAA3RAAMNoHAADdEAAw2wcAAO0VADDcBwAA4BAAMAtjAADfFQAwZAAA4xUAMNQHAADgFQAw1QcAAOEVADDWBwAA4hUAINcHAADgDwAw2AcAAOAPADDZBwAA4A8AMNoHAADgDwAw2wcAAOQVADDcBwAA4w8AMAtjAADWFQAwZAAA2hUAMNQHAADXFQAw1QcAANgVADDWBwAA2RUAINcHAADaEwAw2AcAANoTADDZBwAA2hMAMNoHAADaEwAw2wcAANsVADDcBwAA3RMAMAtjAADNFQAwZAAA0RUAMNQHAADOFQAw1QcAAM8VADDWBwAA0BUAINcHAADOEwAw2AcAAM4TADDZBwAAzhMAMNoHAADOEwAw2wcAANIVADDcBwAA0RMAMAtjAADEFQAwZAAAyBUAMNQHAADFFQAw1QcAAMYVADDWBwAAxxUAINcHAADADQAw2AcAAMANADDZBwAAwA0AMNoHAADADQAw2wcAAMkVADDcBwAAww0AMAtjAAC7FQAwZAAAvxUAMNQHAAC8FQAw1QcAAL0VADDWBwAAvhUAINcHAACsDQAw2AcAAKwNADDZBwAArA0AMNoHAACsDQAw2wcAAMAVADDcBwAArw0AMAtjAACyFQAwZAAAthUAMNQHAACzFQAw1QcAALQVADDWBwAAtRUAINcHAADuDAAw2AcAAO4MADDZBwAA7gwAMNoHAADuDAAw2wcAALcVADDcBwAA8QwAMAtjAACpFQAwZAAArRUAMNQHAACqFQAw1QcAAKsVADDWBwAArBUAINcHAACFDQAw2AcAAIUNADDZBwAAhQ0AMNoHAACFDQAw2wcAAK4VADDcBwAAiA0AMAtjAACgFQAwZAAApBUAMNQHAAChFQAw1QcAAKIVADDWBwAAoxUAINcHAACVDQAw2AcAAJUNADDZBwAAlQ0AMNoHAACVDQAw2wcAAKUVADDcBwAAmA0AMAtjAACXFQAwZAAAmxUAMNQHAACYFQAw1QcAAJkVADDWBwAAmhUAINcHAADbDAAw2AcAANsMADDZBwAA2wwAMNoHAADbDAAw2wcAAJwVADDcBwAA3gwAMAtjAACOFQAwZAAAkhUAMNQHAACPFQAw1QcAAJAVADDWBwAAkRUAINcHAAC8DwAw2AcAALwPADDZBwAAvA8AMNoHAAC8DwAw2wcAAJMVADDcBwAAvw8AMAtjAACFFQAwZAAAiRUAMNQHAACGFQAw1QcAAIcVADDWBwAAiBUAINcHAADYDgAw2AcAANgOADDZBwAA2A4AMNoHAADYDgAw2wcAAIoVADDcBwAA2w4AMAtjAAD8FAAwZAAAgBUAMNQHAAD9FAAw1QcAAP4UADDWBwAA_xQAINcHAACUEAAw2AcAAJQQADDZBwAAlBAAMNoHAACUEAAw2wcAAIEVADDcBwAAlxAAMAtjAADzFAAwZAAA9xQAMNQHAAD0FAAw1QcAAPUUADDWBwAA9hQAINcHAADpDQAw2AcAAOkNADDZBwAA6Q0AMNoHAADpDQAw2wcAAPgUADDcBwAA7A0AMAtjAADqFAAwZAAA7hQAMNQHAADrFAAw1QcAAOwUADDWBwAA7RQAINcHAADADAAw2AcAAMAMADDZBwAAwAwAMNoHAADADAAw2wcAAO8UADDcBwAAwwwAMBUQAADTDgAgGAAA1AwAIBkAANUMACAeAADRDAAgHwAA0gwAICAAANMMACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABngYBAAAAAaoGAAAAiAcCrAZAAAAAAa8GAQAAAAGGBwAAAIYHAogHAQAAAAGJBwEAAAABigcBAAAAAYwHAQAAAAGNBwEAAAABjgdAAAAAAQIAAABdACBjAADyFAAgAwAAAF0AIGMAAPIUACBkAADxFAAgAVwAALEZADACAAAAXQAgXAAA8RQAIAIAAADEDAAgXAAA8BQAIA_yBQEAsAwAIfoFQACyDAAh-wVAALIMACGcBgEAsQwAIZ4GAQCxDAAhqgYAAMcMiAcirAZAAMgMACGvBgEAsQwAIYYHAADGDIYHIogHAQCwDAAhiQcBALAMACGKBwEAsAwAIYwHAQCxDAAhjQcBALEMACGOB0AAsgwAIRUQAADRDgAgGAAAzQwAIBkAAM4MACAeAADKDAAgHwAAywwAICAAAMwMACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGcBgEAsQwAIZ4GAQCxDAAhqgYAAMcMiAcirAZAAMgMACGvBgEAsQwAIYYHAADGDIYHIogHAQCwDAAhiQcBALAMACGKBwEAsAwAIYwHAQCxDAAhjQcBALEMACGOB0AAsgwAIRUQAADTDgAgGAAA1AwAIBkAANUMACAeAADRDAAgHwAA0gwAICAAANMMACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABngYBAAAAAaoGAAAAiAcCrAZAAAAAAa8GAQAAAAGGBwAAAIYHAogHAQAAAAGJBwEAAAABigcBAAAAAYwHAQAAAAGNBwEAAAABjgdAAAAAAQ4HAAD3DQAgKAAA9Q0AICkAAKkQACArAAD2DQAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAbAGAQAAAAHLBgEAAAAB0QYBAAAAAdgGAQAAAAHZBgEAAAAB2gYBAAAAAQIAAAAsACBjAAD7FAAgAwAAACwAIGMAAPsUACBkAAD6FAAgAVwAALAZADACAAAALAAgXAAA-hQAIAIAAADtDQAgXAAA-RQAIAryBQEAsAwAIfcFAQCxDAAh-gVAALIMACH7BUAAsgwAIbAGAQCwDAAhywYBALAMACHRBgEAsQwAIdgGAQCxDAAh2QYBALAMACHaBgEAsAwAIQ4HAADyDQAgKAAA8A0AICkAAKcQACArAADxDQAg8gUBALAMACH3BQEAsQwAIfoFQACyDAAh-wVAALIMACGwBgEAsAwAIcsGAQCwDAAh0QYBALEMACHYBgEAsQwAIdkGAQCwDAAh2gYBALAMACEOBwAA9w0AICgAAPUNACApAACpEAAgKwAA9g0AIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGwBgEAAAABywYBAAAAAdEGAQAAAAHYBgEAAAAB2QYBAAAAAdoGAQAAAAENBwAArBAAIAsAAKsQACAbAADDEAAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAA2AYCywYBAAAAAdEGAQAAAAHTBgEAAAAB1QYBAAAAAdYGAQAAAAECAAAAMwAgYwAAhBUAIAMAAAAzACBjAACEFQAgZAAAgxUAIAFcAACvGQAwAgAAADMAIFwAAIMVACACAAAAmBAAIFwAAIIVACAK8gUBALAMACH3BQEAsQwAIfoFQACyDAAh-wVAALIMACGqBgAAmhDYBiLLBgEAsAwAIdEGAQCxDAAh0wYBALEMACHVBgEAsAwAIdYGAQCwDAAhDQcAAJ0QACALAACcEAAgGwAAwhAAIPIFAQCwDAAh9wUBALEMACH6BUAAsgwAIfsFQACyDAAhqgYAAJoQ2AYiywYBALAMACHRBgEAsQwAIdMGAQCxDAAh1QYBALAMACHWBgEAsAwAIQ0HAACsEAAgCwAAqxAAIBsAAMMQACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAADYBgLLBgEAAAAB0QYBAAAAAdMGAQAAAAHVBgEAAAAB1gYBAAAAARoHAADmDgAgGQAAtw8AIBsAAOgOACAdAADpDgAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAZ4GAQAAAAGqBgAAAPsGAsIGEAAAAAHDBgEAAAABxAYCAAAAAdMGAQAAAAHnBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAHtBoAAAAAB7gZAAAAAAfcGAQAAAAH5BgAAAPkGAvsGAQAAAAH8BkAAAAABAgAAAFcAIGMAAI0VACADAAAAVwAgYwAAjRUAIGQAAIwVACABXAAArhkAMAIAAABXACBcAACMFQAgAgAAANwOACBcAACLFQAgFvIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhngYBALAMACGqBgAA3w77BiLCBhAAuA4AIcMGAQCwDAAhxAYCALkOACHTBgEAsAwAIecGAQCwDAAh6AYBALEMACHpBgEAsQwAIeoGAQCxDAAh6wYBALEMACHsBgEAsQwAIe0GgAAAAAHuBkAAyAwAIfcGAQCwDAAh-QYAAN4O-QYi-wYBALAMACH8BkAAsgwAIRoHAADhDgAgGQAAtQ8AIBsAAOMOACAdAADkDgAg8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGeBgEAsAwAIaoGAADfDvsGIsIGEAC4DgAhwwYBALAMACHEBgIAuQ4AIdMGAQCwDAAh5wYBALAMACHoBgEAsQwAIekGAQCxDAAh6gYBALEMACHrBgEAsQwAIewGAQCxDAAh7QaAAAAAAe4GQADIDAAh9wYBALAMACH5BgAA3g75BiL7BgEAsAwAIfwGQACyDAAhGgcAAOYOACAZAAC3DwAgGwAA6A4AIB0AAOkOACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABngYBAAAAAaoGAAAA-wYCwgYQAAAAAcMGAQAAAAHEBgIAAAAB0wYBAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GgAAAAAHuBkAAAAAB9wYBAAAAAfkGAAAA-QYC-wYBAAAAAfwGQAAAAAEMBwAA0A8AIBsAAL4RACAcAADSDwAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAcMGAQAAAAHTBgEAAAAB9QYgAAAAAf0GEAAAAAH-BhAAAAABAgAAAHYAIGMAAJYVACADAAAAdgAgYwAAlhUAIGQAAJUVACABXAAArRkAMAIAAAB2ACBcAACVFQAgAgAAAMAPACBcAACUFQAgCfIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhwwYBALAMACHTBgEAsAwAIfUGIACSDgAh_QYQALgOACH-BhAAuA4AIQwHAADDDwAgGwAAvREAIBwAAMUPACDyBQEAsAwAIfcFAQCwDAAh-gVAALIMACH7BUAAsgwAIcMGAQCwDAAh0wYBALAMACH1BiAAkg4AIf0GEAC4DgAh_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_DAAgEAAAqw4AIBYAAPwMACAYAAD-DAAgMwAA_QwAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGHBgEAAAABnAYBAAAAAagGAQAAAAGqBgAAAKoGAqsGAQAAAAGsBkAAAAABrQZAAAAAAa4GAQAAAAGvBgEAAAABAgAAAKMBACBjAAC6FQAgAwAAAKMBACBjAAC6FQAgZAAAuRUAIAFcAACpGQAwAgAAAKMBACBcAAC5FQAgAgAAAPIMACBcAAC4FQAgDfIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhhwYBALAMACGcBgEAsQwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACGvBgEAsQwAIRIHAAD5DAAgEAAAqg4AIBYAAPYMACAYAAD4DAAgMwAA9wwAIPIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhhwYBALAMACGcBgEAsQwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACGvBgEAsQwAIRIHAAD_DAAgEAAAqw4AIBYAAPwMACAYAAD-DAAgMwAA_QwAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGHBgEAAAABnAYBAAAAAagGAQAAAAGqBgAAAKoGAqsGAQAAAAGsBkAAAAABrQZAAAAAAa4GAQAAAAGvBgEAAAABCwcAALoNACAOAAC4DQAgDwAAuQ0AIBAAAJwOACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABAgAAADwAIGMAAMMVACADAAAAPAAgYwAAwxUAIGQAAMIVACABXAAAqBkAMAIAAAA8ACBcAADCFQAgAgAAALANACBcAADBFQAgB_IFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGbBgEAsAwAIZwGAQCwDAAhCwcAALUNACAOAACzDQAgDwAAtA0AIBAAAJsOACDyBQEAsAwAIfcFAQCwDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIQsHAAC6DQAgDgAAuA0AIA8AALkNACAQAACcDgAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGbBgEAAAABnAYBAAAAARUHAACDDgAgCgAAgQ4AIAsAAPoNACAOAAD_DQAgDwAA_Q0AIBAAAJAPACAZAAD-DQAgGwAAgg4AICwAAPsNACAtAAD8DQAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGbBgEAAAABnAYBAAAAAZ4GAQAAAAHTBgEAAAAB4wYBAAAAAaYHQAAAAAECAAAAKAAgYwAAzBUAIAMAAAAoACBjAADMFQAgZAAAyxUAIAFcAACnGQAwAgAAACgAIFwAAMsVACACAAAAxA0AIFwAAMoVACAL8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGaBgEAsAwAIZsGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAh4wYBALEMACGmB0AAsgwAIRUHAADQDQAgCgAAzg0AIAsAAMcNACAOAADMDQAgDwAAyg0AIBAAAI4PACAZAADLDQAgGwAAzw0AICwAAMgNACAtAADJDQAg8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGaBgEAsAwAIZsGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAh4wYBALEMACGmB0AAsgwAIRUHAACDDgAgCgAAgQ4AIAsAAPoNACAOAAD_DQAgDwAA_Q0AIBAAAJAPACAZAAD-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-xAAIAoAAPsTACANAAD9EAAgEQAA_hAAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAAB3QYCAAAAAeMGAQAAAAGnBwEAAAABqAcBAAAAAQIAAAAjACBjAADwFQAgAwAAACMAIGMAAPAVACBkAADvFQAgAVwAAKMZADACAAAAIwAgXAAA7xUAIAIAAADhEAAgXAAA7hUAIAnyBQEAsAwAIfcFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh3QYCAOYPACHjBgEAsQwAIacHAQCwDAAhqAcBALAMACENBwAA5BAAIAoAAPkTACANAADmEAAgEQAA5xAAIPIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHdBgIA5g8AIeMGAQCxDAAhpwcBALAMACGoBwEAsAwAIQ0HAAD7EAAgCgAA-xMAIA0AAP0QACARAAD-EAAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHdBgIAAAAB4wYBAAAAAacHAQAAAAGoBwEAAAABCAcAAPsVACAlAAC1FAAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAHRBgEAAAABAgAAAJcBACBjAAD6FQAgAwAAAJcBACBjAAD6FQAgZAAA-BUAIAFcAACiGQAwAgAAAJcBACBcAAD4FQAgAgAAAKUUACBcAAD3FQAgBvIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACHRBgEAsQwAIQgHAAD5FQAgJQAAqRQAIPIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACHRBgEAsQwAIQVjAACdGQAgZAAAoBkAINQHAACeGQAg1QcAAJ8ZACDaBwAA9AQAIAgHAAD7FQAgJQAAtRQAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAAB0QYBAAAAAQNjAACdGQAg1AcAAJ4ZACDaBwAA9AQAIA0HAACBEQAgDQAAgBEAIA8AAP8QACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABowYBAAAAAdEGAQAAAAHbBgEAAAAB3AZAAAAAAd0GCAAAAAHeBggAAAABAgAAAB8AIGMAAIQWACADAAAAHwAgYwAAhBYAIGQAAIMWACABXAAAnBkAMAIAAAAfACBcAACDFgAgAgAAAL4UACBcAACCFgAgCvIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhowYBALAMACHRBgEAsQwAIdsGAQCxDAAh3AZAAMgMACHdBggA4QwAId4GCADhDAAhDQcAAM4QACANAADNEAAgDwAAzBAAIPIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhowYBALAMACHRBgEAsQwAIdsGAQCxDAAh3AZAAMgMACHdBggA4QwAId4GCADhDAAhDQcAAIERACANAACAEQAgDwAA_xAAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGjBgEAAAAB0QYBAAAAAdsGAQAAAAHcBkAAAAAB3QYIAAAAAd4GCAAAAAEXDAAAlBYAIA0AAIwWACARAACNFgAgHAAAkxYAICUAAIkWACAnAACSFgAgKgAAlRYAIC4AAIYWACAvAACHFgAgMAAAiBYAIDEAAIoWACAyAACLFgAgNAAAjhYAIDUAAI8WACA2AACQFgAgNwAAkRYAIDgAAJYWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAABkQcBAAAAAaUHAQAAAAEEYwAA_BUAMNQHAAD9FQAw1gcAAP8VACDaBwAAuhQAMARjAADxFQAw1AcAAPIVADDWBwAA9BUAINoHAAChFAAwBGMAAOgVADDUBwAA6RUAMNYHAADrFQAg2gcAAN0QADAEYwAA3xUAMNQHAADgFQAw1gcAAOIVACDaBwAA4A8AMARjAADWFQAw1AcAANcVADDWBwAA2RUAINoHAADaEwAwBGMAAM0VADDUBwAAzhUAMNYHAADQFQAg2gcAAM4TADAEYwAAxBUAMNQHAADFFQAw1gcAAMcVACDaBwAAwA0AMARjAAC7FQAw1AcAALwVADDWBwAAvhUAINoHAACsDQAwBGMAALIVADDUBwAAsxUAMNYHAAC1FQAg2gcAAO4MADAEYwAAqRUAMNQHAACqFQAw1gcAAKwVACDaBwAAhQ0AMARjAACgFQAw1AcAAKEVADDWBwAAoxUAINoHAACVDQAwBGMAAJcVADDUBwAAmBUAMNYHAACaFQAg2gcAANsMADAEYwAAjhUAMNQHAACPFQAw1gcAAJEVACDaBwAAvA8AMARjAACFFQAw1AcAAIYVADDWBwAAiBUAINoHAADYDgAwBGMAAPwUADDUBwAA_RQAMNYHAAD_FAAg2gcAAJQQADAEYwAA8xQAMNQHAAD0FAAw1gcAAPYUACDaBwAA6Q0AMARjAADqFAAw1AcAAOsUADDWBwAA7RQAINoHAADADAAwBzkAAJgWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAABkQcBAAAAAaUHAQAAAAEEYwAAzhQAMNQHAADPFAAw1gcAANEUACDaBwAA0hQAMARjAADCFAAw1AcAAMMUADDWBwAAxRQAINoHAADGFAAwBGMAALYUADDUBwAAtxQAMNYHAAC5FAAg2gcAALoUADAEYwAAnRQAMNQHAACeFAAw1gcAAKAUACDaBwAAoRQAMARjAACFFAAw1AcAAIYUADDWBwAAiBQAINoHAACJFAAwBGMAAPwTADDUBwAA_RMAMNYHAAD_EwAg2gcAAOAPADAEYwAA8RMAMNQHAADyEwAw1gcAAPQTACDaBwAA3RAAMARjAADiEwAw1AcAAOMTADDWBwAA5RMAINoHAADmEwAwBGMAANYTADDUBwAA1xMAMNYHAADZEwAg2gcAANoTADAEYwAAyhMAMNQHAADLEwAw1gcAAM0TACDaBwAAzhMAMARjAADBEwAw1AcAAMITADDWBwAAxBMAINoHAADADQAwBGMAALgTADDUBwAAuRMAMNYHAAC7EwAg2gcAAKwNADAEYwAArBMAMNQHAACtEwAw1gcAAK8TACDaBwAAsBMAMARjAACjEwAw1AcAAKQTADDWBwAAphMAINoHAADuDAAwBGMAAJoTADDUBwAAmxMAMNYHAACdEwAg2gcAAIUNADAEYwAAkRMAMNQHAACSEwAw1gcAAJQTACDaBwAAlQ0AMARjAACIEwAw1AcAAIkTADDWBwAAixMAINoHAADbDAAwBGMAAP8SADDUBwAAgBMAMNYHAACCEwAg2gcAALwPADAEYwAA9hIAMNQHAAD3EgAw1gcAAPkSACDaBwAA2A4AMANjAADxEgAg1AcAAPISACDaBwAAsgYAIARjAADlEgAw1AcAAOYSADDWBwAA6BIAINoHAADpEgAwBGMAANwSADDUBwAA3RIAMNYHAADfEgAg2gcAAIMSADAEYwAA0xIAMNQHAADUEgAw1gcAANYSACDaBwAAlBAAMARjAADKEgAw1AcAAMsSADDWBwAAzRIAINoHAADpDQAwBGMAAL4SADDUBwAAvxIAMNYHAADBEgAg2gcAAMISADAEYwAAtRIAMNQHAAC2EgAw1gcAALgSACDaBwAAwAwAMARjAACsEgAw1AcAAK0SADDWBwAArxIAINoHAADADAAwAAAAAAAAAAAAAAAAAAIHAACyEQAg9gYAAKwMACAAAAAAAAAAAAdjAACXGQAgZAAAmhkAINQHAACYGQAg1QcAAJkZACDYBwAAFgAg2QcAABYAINoHAAD0BAAgA2MAAJcZACDUBwAAmBkAINoHAAD0BAAgAAAAB2MAAJIZACBkAACVGQAg1AcAAJMZACDVBwAAlBkAINgHAAASACDZBwAAEgAg2gcAABQAIANjAACSGQAg1AcAAJMZACDaBwAAFAAgAAAAAAAAAAAAAAAAAAVjAACNGQAgZAAAkBkAINQHAACOGQAg1QcAAI8ZACDaBwAA9AQAIANjAACNGQAg1AcAAI4ZACDaBwAA9AQAIAAAAAAAAAVjAACIGQAgZAAAixkAINQHAACJGQAg1QcAAIoZACDaBwAA8QIAIANjAACIGQAg1AcAAIkZACDaBwAA8QIAIAAAAAAAAAVjAACDGQAgZAAAhhkAINQHAACEGQAg1QcAAIUZACDaBwAA8QIAIANjAACDGQAg1AcAAIQZACDaBwAA8QIAIAAAAAVjAAD-GAAgZAAAgRkAINQHAAD_GAAg1QcAAIAZACDaBwAA8QIAIANjAAD-GAAg1AcAAP8YACDaBwAA8QIAIAAAAAtjAACiGAAwZAAApxgAMNQHAACjGAAw1QcAAKQYADDWBwAApRgAINcHAACmGAAw2AcAAKYYADDZBwAAphgAMNoHAACmGAAw2wcAAKgYADDcBwAAqRgAMAtjAACWGAAwZAAAmxgAMNQHAACXGAAw1QcAAJgYADDWBwAAmRgAINcHAACaGAAw2AcAAJoYADDZBwAAmhgAMNoHAACaGAAw2wcAAJwYADDcBwAAnRgAMAtjAACLGAAwZAAAjxgAMNQHAACMGAAw1QcAAI0YADDWBwAAjhgAINcHAADmEwAw2AcAAOYTADDZBwAA5hMAMNoHAADmEwAw2wcAAJAYADDcBwAA6RMAMAtjAACCGAAwZAAAhhgAMNQHAACDGAAw1QcAAIQYADDWBwAAhRgAINcHAADaEwAw2AcAANoTADDZBwAA2hMAMNoHAADaEwAw2wcAAIcYADDcBwAA3RMAMAtjAAD5FwAwZAAA_RcAMNQHAAD6FwAw1QcAAPsXADDWBwAA_BcAINcHAADOEwAw2AcAAM4TADDZBwAAzhMAMNoHAADOEwAw2wcAAP4XADDcBwAA0RMAMAtjAADwFwAwZAAA9BcAMNQHAADxFwAw1QcAAPIXADDWBwAA8xcAINcHAACwEwAw2AcAALATADDZBwAAsBMAMNoHAACwEwAw2wcAAPUXADDcBwAAsxMAMAtjAADnFwAwZAAA6xcAMNQHAADoFwAw1QcAAOkXADDWBwAA6hcAINcHAACwEwAw2AcAALATADDZBwAAsBMAMNoHAACwEwAw2wcAAOwXADDcBwAAsxMAMAtjAADeFwAwZAAA4hcAMNQHAADfFwAw1QcAAOAXADDWBwAA4RcAINcHAADuDAAw2AcAAO4MADDZBwAA7gwAMNoHAADuDAAw2wcAAOMXADDcBwAA8QwAMAtjAADVFwAwZAAA2RcAMNQHAADWFwAw1QcAANcXADDWBwAA2BcAINcHAADuDAAw2AcAAO4MADDZBwAA7gwAMNoHAADuDAAw2wcAANoXADDcBwAA8QwAMAdjAADQFwAgZAAA0xcAINQHAADRFwAg1QcAANIXACDYBwAAqAIAINkHAACoAgAg2gcAAO4JACALYwAAxxcAMGQAAMsXADDUBwAAyBcAMNUHAADJFwAw1gcAAMoXACDXBwAA7g4AMNgHAADuDgAw2QcAAO4OADDaBwAA7g4AMNsHAADMFwAw3AcAAPEOADALYwAAvhcAMGQAAMIXADDUBwAAvxcAMNUHAADAFwAw1gcAAMEXACDXBwAA7g4AMNgHAADuDgAw2QcAAO4OADDaBwAA7g4AMNsHAADDFwAw3AcAAPEOADAHYwAAuRcAIGQAALwXACDUBwAAuhcAINUHAAC7FwAg2AcAAKwCACDZBwAArAIAINoHAACQCAAgC2MAAK0XADBkAACyFwAw1AcAAK4XADDVBwAArxcAMNYHAACwFwAg1wcAALEXADDYBwAAsRcAMNkHAACxFwAw2gcAALEXADDbBwAAsxcAMNwHAAC0FwAwC2MAAKQXADBkAACoFwAw1AcAAKUXADDVBwAAphcAMNYHAACnFwAg1wcAAMAMADDYBwAAwAwAMNkHAADADAAw2gcAAMAMADDbBwAAqRcAMNwHAADDDAAwC2MAAJsXADBkAACfFwAw1AcAAJwXADDVBwAAnRcAMNYHAACeFwAg1wcAAMAMADDYBwAAwAwAMNkHAADADAAw2gcAAMAMADDbBwAAoBcAMNwHAADDDAAwC2MAAJIXADBkAACWFwAw1AcAAJMXADDVBwAAlBcAMNYHAACVFwAg1wcAAMISADDYBwAAwhIAMNkHAADCEgAw2gcAAMISADDbBwAAlxcAMNwHAADFEgAwC2MAAIkXADBkAACNFwAw1AcAAIoXADDVBwAAixcAMNYHAACMFwAg1wcAANcRADDYBwAA1xEAMNkHAADXEQAw2gcAANcRADDbBwAAjhcAMNwHAADaEQAwBEQAAMQRACDyBQEAAAAB_wYBAAAAAYAHQAAAAAECAAAA-AEAIGMAAJEXACADAAAA-AEAIGMAAJEXACBkAACQFwAgAVwAAP0YADACAAAA-AEAIFwAAJAXACACAAAA2xEAIFwAAI8XACAD8gUBALAMACH_BgEAsAwAIYAHQACyDAAhBEQAAMIRACDyBQEAsAwAIf8GAQCwDAAhgAdAALIMACEERAAAxBEAIPIFAQAAAAH_BgEAAAABgAdAAAAAAQoHAADrEQAgRQAA7REAIEYAAO4RACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABowYBAAAAAaQGAQAAAAGEBwAAAIIHAgIAAADwAQAgYwAAmhcAIAMAAADwAQAgYwAAmhcAIGQAAJkXACABXAAA_BgAMAIAAADwAQAgXAAAmRcAIAIAAADGEgAgXAAAmBcAIAfyBQEAsAwAIfcFAQCwDAAh-gVAALIMACH7BUAAsgwAIaMGAQCwDAAhpAYBALAMACGEBwAAyRGCByIKBwAAzxEAIEUAANERACBGAADSEQAg8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGjBgEAsAwAIaQGAQCwDAAhhAcAAMkRggciCgcAAOsRACBFAADtEQAgRgAA7hEAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGjBgEAAAABpAYBAAAAAYQHAAAAggcCFRAAANMOACAZAADVDAAgHgAA0QwAIB8AANIMACAgAADTDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABAgAAAF0AIGMAAKMXACADAAAAXQAgYwAAoxcAIGQAAKIXACABXAAA-xgAMAIAAABdACBcAACiFwAgAgAAAMQMACBcAAChFwAgD_IFAQCwDAAh-gVAALIMACH7BUAAsgwAIZwGAQCxDAAhngYBALEMACGqBgAAxwyIByKsBkAAyAwAIYYHAADGDIYHIogHAQCwDAAhiQcBALAMACGKBwEAsAwAIYsHAQCxDAAhjAcBALEMACGNBwEAsQwAIY4HQACyDAAhFRAAANEOACAZAADODAAgHgAAygwAIB8AAMsMACAgAADMDAAgIQAAzwwAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIZwGAQCxDAAhngYBALEMACGqBgAAxwyIByKsBkAAyAwAIYYHAADGDIYHIogHAQCwDAAhiQcBALAMACGKBwEAsAwAIYsHAQCxDAAhjAcBALEMACGNBwEAsQwAIY4HQACyDAAhFRAAANMOACAZAADVDAAgHgAA0QwAIB8AANIMACAgAADTDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABFRAAANMOACAYAADUDAAgGQAA1QwAIB4AANEMACAfAADSDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABrwYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABAgAAAF0AIGMAAKwXACADAAAAXQAgYwAArBcAIGQAAKsXACABXAAA-hgAMAIAAABdACBcAACrFwAgAgAAAMQMACBcAACqFwAgD_IFAQCwDAAh-gVAALIMACH7BUAAsgwAIZwGAQCxDAAhngYBALEMACGqBgAAxwyIByKsBkAAyAwAIa8GAQCxDAAhhgcAAMYMhgciiAcBALAMACGJBwEAsAwAIYsHAQCxDAAhjAcBALEMACGNBwEAsQwAIY4HQACyDAAhFRAAANEOACAYAADNDAAgGQAAzgwAIB4AAMoMACAfAADLDAAgIQAAzwwAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIZwGAQCxDAAhngYBALEMACGqBgAAxwyIByKsBkAAyAwAIa8GAQCxDAAhhgcAAMYMhgciiAcBALAMACGJBwEAsAwAIYsHAQCxDAAhjAcBALEMACGNBwEAsQwAIY4HQACyDAAhFRAAANMOACAYAADUDAAgGQAA1QwAIB4AANEMACAfAADSDAAgIQAA1gwAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABrwYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABBfIFAQAAAAH6BUAAAAAB-wVAAAAAAa4HAQAAAAGvB0AAAAABAgAAALACACBjAAC4FwAgAwAAALACACBjAAC4FwAgZAAAtxcAIAFcAAD5GAAwCgMAALUKACDvBQAA0AsAMPAFAACuAgAQ8QUAANALADDyBQEAAAAB-QUBAAAAAfoFQAC0CgAh-wVAALQKACGuBwEAsAoAIa8HQAC0CgAhAgAAALACACBcAAC3FwAgAgAAALUXACBcAAC2FwAgCe8FAAC0FwAw8AUAALUXABDxBQAAtBcAMPIFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhrgcBALAKACGvB0AAtAoAIQnvBQAAtBcAMPAFAAC1FwAQ8QUAALQXADDyBQEAsAoAIfkFAQCwCgAh-gVAALQKACH7BUAAtAoAIa4HAQCwCgAhrwdAALQKACEF8gUBALAMACH6BUAAsgwAIfsFQACyDAAhrgcBALAMACGvB0AAsgwAIQXyBQEAsAwAIfoFQACyDAAh-wVAALIMACGuBwEAsAwAIa8HQACyDAAhBfIFAQAAAAH6BUAAAAAB-wVAAAAAAa4HAQAAAAGvB0AAAAABCPIFAQAAAAH6BUAAAAAB-wVAAAAAAYgGAQAAAAGJBgEAAAABjgaAAAAAAZAGIAAAAAHKBgAAow8AIAIAAACQCAAgYwAAuRcAIAMAAACsAgAgYwAAuRcAIGQAAL0XACAKAAAArAIAIFwAAL0XACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGIBgEAsAwAIYkGAQCwDAAhjgaAAAAAAZAGIACSDgAhygYAAKEPACAI8gUBALAMACH6BUAAsgwAIfsFQACyDAAhiAYBALAMACGJBgEAsAwAIY4GgAAAAAGQBiAAkg4AIcoGAAChDwAgDhYAAPoOACAXAAD7DgAgGQAAnQ8AIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZ4GAQAAAAGoBgEAAAABqgYAAADJBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAAByQYBAAAAAQIAAABNACBjAADGFwAgAwAAAE0AIGMAAMYXACBkAADFFwAgAVwAAPgYADACAAAATQAgXAAAxRcAIAIAAADyDgAgXAAAxBcAIAvyBQEAsAwAIfoFQACyDAAh-wVAALIMACGeBgEAsQwAIagGAQCxDAAhqgYAAPQOyQYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACHJBgEAsAwAIQ4WAAD2DgAgFwAA9w4AIBkAAJwPACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGeBgEAsQwAIagGAQCxDAAhqgYAAPQOyQYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACHJBgEAsAwAIQ4WAAD6DgAgFwAA-w4AIBkAAJ0PACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqAYBAAAAAaoGAAAAyQYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAAckGAQAAAAEOFgAA-g4AIBgAAPwOACAZAACdDwAg8gUBAAAAAfoFQAAAAAH7BUAAAAABngYBAAAAAagGAQAAAAGqBgAAAMkGAqsGAQAAAAGsBkAAAAABrQZAAAAAAa4GAQAAAAGvBgEAAAABAgAAAE0AIGMAAM8XACADAAAATQAgYwAAzxcAIGQAAM4XACABXAAA9xgAMAIAAABNACBcAADOFwAgAgAAAPIOACBcAADNFwAgC_IFAQCwDAAh-gVAALIMACH7BUAAsgwAIZ4GAQCxDAAhqAYBALEMACGqBgAA9A7JBiKrBgEAsQwAIawGQADIDAAhrQZAALIMACGuBgEAsAwAIa8GAQCxDAAhDhYAAPYOACAYAAD4DgAgGQAAnA8AIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIZ4GAQCxDAAhqAYBALEMACGqBgAA9A7JBiKrBgEAsQwAIawGQADIDAAhrQZAALIMACGuBgEAsAwAIa8GAQCxDAAhDhYAAPoOACAYAAD8DgAgGQAAnQ8AIPIFAQAAAAH6BUAAAAAB-wVAAAAAAZ4GAQAAAAGoBgEAAAABqgYAAADJBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAAQzyBQEAAAAB-gVAAAAAAfsFQAAAAAGIBgEAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABjAYAAJQOACCNBgAAlQ4AII4GgAAAAAGPBoAAAAABkAYgAAAAAQIAAADuCQAgYwAA0BcAIAMAAACoAgAgYwAA0BcAIGQAANQXACAOAAAAqAIAIFwAANQXACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGIBgEAsAwAIYkGAQCwDAAhigYBALAMACGLBgEAsQwAIYwGAACQDgAgjQYAAJEOACCOBoAAAAABjwaAAAAAAZAGIACSDgAhDPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIYgGAQCwDAAhiQYBALAMACGKBgEAsAwAIYsGAQCxDAAhjAYAAJAOACCNBgAAkQ4AII4GgAAAAAGPBoAAAAABkAYgAJIOACESBwAA_wwAIAkAAIANACAQAACrDgAgFgAA_AwAIDMAAP0MACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGcBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAAQIAAACjAQAgYwAA3RcAIAMAAACjAQAgYwAA3RcAIGQAANwXACABXAAA9hgAMAIAAACjAQAgXAAA3BcAIAIAAADyDAAgXAAA2xcAIA3yBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhhwYBALAMACGcBgEAsQwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACESBwAA-QwAIAkAAPoMACAQAACqDgAgFgAA9gwAIDMAAPcMACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhhwYBALAMACGcBgEAsQwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACESBwAA_wwAIAkAAIANACAQAACrDgAgFgAA_AwAIDMAAP0MACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGcBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAARIHAAD_DAAgCQAAgA0AIBAAAKsOACAWAAD8DAAgGAAA_gwAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABnAYBAAAAAagGAQAAAAGqBgAAAKoGAqsGAQAAAAGsBkAAAAABrQZAAAAAAa4GAQAAAAGvBgEAAAABAgAAAKMBACBjAADmFwAgAwAAAKMBACBjAADmFwAgZAAA5RcAIAFcAAD1GAAwAgAAAKMBACBcAADlFwAgAgAAAPIMACBcAADkFwAgDfIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGcBgEAsQwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACGvBgEAsQwAIRIHAAD5DAAgCQAA-gwAIBAAAKoOACAWAAD2DAAgGAAA-AwAIPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGcBgEAsQwAIagGAQCxDAAhqgYAAPQMqgYiqwYBALEMACGsBkAAyAwAIa0GQACyDAAhrgYBALAMACGvBgEAsQwAIRIHAAD_DAAgCQAAgA0AIBAAAKsOACAWAAD8DAAgGAAA_gwAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABnAYBAAAAAagGAQAAAAGqBgAAAKoGAqsGAQAAAAGsBkAAAAABrQZAAAAAAa4GAQAAAAGvBgEAAAABHQcAAI0SACA8AACLEgAgPwAAjhIAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAKMHAqwGQAAAAAHRBgEAAAABjwcBAAAAAZAHAQAAAAGRBwEAAAABkwcAAACTBwOUBwEAAAABlQcAAADABgOWBxAAAAABlwcBAAAAAZgHAgAAAAGZBwAAAOcGApoHAQAAAAGbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHgAAAAAGhB0AAAAABowcBAAAAAQIAAADVAQAgYwAA7xcAIAMAAADVAQAgYwAA7xcAIGQAAO4XACABXAAA9BgAMAIAAADVAQAgXAAA7hcAIAIAAAC0EwAgXAAA7RcAIBryBQEAsAwAIfcFAQCxDAAh-gVAALIMACH7BUAAsgwAIaoGAAD6EaMHIqwGQADIDAAh0QYBALEMACGPBwEAsAwAIZAHAQCwDAAhkQcBALEMACGTBwAA9xGTByOUBwEAsQwAIZUHAAD4EcAGI5YHEAD5EQAhlwcBALAMACGYBwIA5g8AIZkHAACqEecGIpoHAQCxDAAhmwcBALEMACGcBwEAsQwAIZ0HAQCxDAAhngcBALEMACGfBwEAsQwAIaAHgAAAAAGhB0AAyAwAIaMHAQCxDAAhHQcAAP0RACA8AAD7EQAgPwAA_hEAIPIFAQCwDAAh9wUBALEMACH6BUAAsgwAIfsFQACyDAAhqgYAAPoRowcirAZAAMgMACHRBgEAsQwAIY8HAQCwDAAhkAcBALAMACGRBwEAsQwAIZMHAAD3EZMHI5QHAQCxDAAhlQcAAPgRwAYjlgcQAPkRACGXBwEAsAwAIZgHAgDmDwAhmQcAAKoR5wYimgcBALEMACGbBwEAsQwAIZwHAQCxDAAhnQcBALEMACGeBwEAsQwAIZ8HAQCxDAAhoAeAAAAAAaEHQADIDAAhowcBALEMACEdBwAAjRIAIDwAAIsSACA_AACOEgAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAowcCrAZAAAAAAdEGAQAAAAGPBwEAAAABkAcBAAAAAZEHAQAAAAGTBwAAAJMHA5QHAQAAAAGVBwAAAMAGA5YHEAAAAAGXBwEAAAABmAcCAAAAAZkHAAAA5wYCmgcBAAAAAZsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAeAAAAAAaEHQAAAAAGjBwEAAAABHQcAAI0SACA9AACMEgAgPwAAjhIAIPIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAKMHAqwGQAAAAAHRBgEAAAABkAcBAAAAAZEHAQAAAAGTBwAAAJMHA5QHAQAAAAGVBwAAAMAGA5YHEAAAAAGXBwEAAAABmAcCAAAAAZkHAAAA5wYCmgcBAAAAAZsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAeAAAAAAaEHQAAAAAGjBwEAAAABpAcBAAAAAQIAAADVAQAgYwAA-BcAIAMAAADVAQAgYwAA-BcAIGQAAPcXACABXAAA8xgAMAIAAADVAQAgXAAA9xcAIAIAAAC0EwAgXAAA9hcAIBryBQEAsAwAIfcFAQCxDAAh-gVAALIMACH7BUAAsgwAIaoGAAD6EaMHIqwGQADIDAAh0QYBALEMACGQBwEAsAwAIZEHAQCxDAAhkwcAAPcRkwcjlAcBALEMACGVBwAA-BHABiOWBxAA-REAIZcHAQCwDAAhmAcCAOYPACGZBwAAqhHnBiKaBwEAsQwAIZsHAQCxDAAhnAcBALEMACGdBwEAsQwAIZ4HAQCxDAAhnwcBALEMACGgB4AAAAABoQdAAMgMACGjBwEAsQwAIaQHAQCxDAAhHQcAAP0RACA9AAD8EQAgPwAA_hEAIPIFAQCwDAAh9wUBALEMACH6BUAAsgwAIfsFQACyDAAhqgYAAPoRowcirAZAAMgMACHRBgEAsQwAIZAHAQCwDAAhkQcBALEMACGTBwAA9xGTByOUBwEAsQwAIZUHAAD4EcAGI5YHEAD5EQAhlwcBALAMACGYBwIA5g8AIZkHAACqEecGIpoHAQCxDAAhmwcBALEMACGcBwEAsQwAIZ0HAQCxDAAhngcBALEMACGfBwEAsQwAIaAHgAAAAAGhB0AAyAwAIaMHAQCxDAAhpAcBALEMACEdBwAAjRIAID0AAIwSACA_AACOEgAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAowcCrAZAAAAAAdEGAQAAAAGQBwEAAAABkQcBAAAAAZMHAAAAkwcDlAcBAAAAAZUHAAAAwAYDlgcQAAAAAZcHAQAAAAGYBwIAAAABmQcAAADnBgKaBwEAAAABmwcBAAAAAZwHAQAAAAGdBwEAAAABngcBAAAAAZ8HAQAAAAGgB4AAAAABoQdAAAAAAaMHAQAAAAGkBwEAAAABDgcAAJEPACAJAACSDwAgDQAAlA8AIBMAAJUPACAaAACWDwAgHAAAlw8AICIAAJgPACDyBQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHHBgEAAAABAgAAAJ0BACBjAACBGAAgAwAAAJ0BACBjAACBGAAgZAAAgBgAIAFcAADyGAAwAgAAAJ0BACBcAACAGAAgAgAAANITACBcAAD_FwAgB_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-wVAAAAAAbIHAQAAAAGzBwEAAAABtAcBAAAAAbUHAQAAAAG2BwEAAAABtwdAAAAAAbgHQAAAAAG5BwEAAAABugcBAAAAAQfyBQEAAAAB-gVAAAAAAfsFQAAAAAGvB0AAAAABuwcBAAAAAbwHAQAAAAG9BwEAAAABAgAAAAUAIGMAAK0YACADAAAABQAgYwAArRgAIGQAAKwYACABXAAA6RgAMAwDAAC1CgAg7wUAAKsMADDwBQAAAwAQ8QUAAKsMADDyBQEAAAAB-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhrwdAALQKACG7BwEAAAABvAcBALEKACG9BwEAsQoAIQIAAAAFACBcAACsGAAgAgAAAKoYACBcAACrGAAgC-8FAACpGAAw8AUAAKoYABDxBQAAqRgAMPIFAQCwCgAh-QUBALAKACH6BUAAtAoAIfsFQAC0CgAhrwdAALQKACG7BwEAsAoAIbwHAQCxCgAhvQcBALEKACEL7wUAAKkYADDwBQAAqhgAEPEFAACpGAAw8gUBALAKACH5BQEAsAoAIfoFQAC0CgAh-wVAALQKACGvB0AAtAoAIbsHAQCwCgAhvAcBALEKACG9BwEAsQoAIQfyBQEAsAwAIfoFQACyDAAh-wVAALIMACGvB0AAsgwAIbsHAQCwDAAhvAcBALEMACG9BwEAsQwAIQfyBQEAsAwAIfoFQACyDAAh-wVAALIMACGvB0AAsgwAIbsHAQCwDAAhvAcBALEMACG9BwEAsQwAIQfyBQEAAAAB-gVAAAAAAfsFQAAAAAGvB0AAAAABuwcBAAAAAbwHAQAAAAG9BwEAAAABBGMAAKIYADDUBwAAoxgAMNYHAAClGAAg2gcAAKYYADAEYwAAlhgAMNQHAACXGAAw1gcAAJkYACDaBwAAmhgAMARjAACLGAAw1AcAAIwYADDWBwAAjhgAINoHAADmEwAwBGMAAIIYADDUBwAAgxgAMNYHAACFGAAg2gcAANoTADAEYwAA-RcAMNQHAAD6FwAw1gcAAPwXACDaBwAAzhMAMARjAADwFwAw1AcAAPEXADDWBwAA8xcAINoHAACwEwAwBGMAAOcXADDUBwAA6BcAMNYHAADqFwAg2gcAALATADAEYwAA3hcAMNQHAADfFwAw1gcAAOEXACDaBwAA7gwAMARjAADVFwAw1AcAANYXADDWBwAA2BcAINoHAADuDAAwA2MAANAXACDUBwAA0RcAINoHAADuCQAgBGMAAMcXADDUBwAAyBcAMNYHAADKFwAg2gcAAO4OADAEYwAAvhcAMNQHAAC_FwAw1gcAAMEXACDaBwAA7g4AMANjAAC5FwAg1AcAALoXACDaBwAAkAgAIARjAACtFwAw1AcAAK4XADDWBwAAsBcAINoHAACxFwAwBGMAAKQXADDUBwAApRcAMNYHAACnFwAg2gcAAMAMADAEYwAAmxcAMNQHAACcFwAw1gcAAJ4XACDaBwAAwAwAMARjAACSFwAw1AcAAJMXADDWBwAAlRcAINoHAADCEgAwBGMAAIkXADDUBwAAihcAMNYHAACMFwAg2gcAANcRADAAAAIzAACXDgAgiwYAAKwMACABFwAAlw4AIAAAAAAABWMAAOQYACBkAADnGAAg1AcAAOUYACDVBwAA5hgAINoHAAAoACADYwAA5BgAINQHAADlGAAg2gcAACgAIAAAAAQHAACyEQAgQwAAlw4AIEUAAM8YACBGAADFGAAgABcHAACyEQAgPAAAlw4AID0AAJcOACA_AADCFgAg9wUAAKwMACCsBgAArAwAINEGAACsDAAgkQcAAKwMACCTBwAArAwAIJQHAACsDAAglQcAAKwMACCWBwAArAwAIJgHAACsDAAgmgcAAKwMACCbBwAArAwAIJwHAACsDAAgnQcAAKwMACCeBwAArAwAIJ8HAACsDAAgoAcAAKwMACChBwAArAwAIKMHAACsDAAgpAcAAKwMACANBwAAshEAIAkAANMYACAKAADhGAAgCwAAwxYAIA4AANoYACAPAADbGAAgEAAA0hgAIBkAANYYACAbAADVGAAgLAAA3xgAIC0AAOAYACD4BQAArAwAIOMGAACsDAAgCgMAAJcOACAHAACyEQAgCQAA0xgAIA0AALUQACARAAC7FgAgIgAAxRYAICQAAL0WACBKAACkEQAgSwAAvxYAIPYFAACsDAAgFQgAAOIYACAMAACzEAAgDQAAtRAAIBEAALsWACAcAAC3EAAgJQAAtBAAICcAALYQACAqAADDFgAgLgAAtBYAIC8AALUWACAwAAC3FgAgMQAAuRYAIDIAALoWACA0AACkEQAgNQAAvRYAIDYAAL4WACA3AAC_FgAgOAAAxRYAINEGAACsDAAg4gYAAKwMACCRBwAArAwAIAUUAACkEQAg-AUAAKwMACDfBgAArAwAIOIGAACsDAAg4wYAAKwMACAFDAAAsxAAIA0AALUQACAcAAC3EAAgJQAAtBAAICcAALYQACAKAwAAlw4AIAcAALIRACAJAADTGAAgDQAAtRAAIBMAAL4WACAaAACTEQAgHAAAtxAAICIAAMUWACD2BQAArAwAIPgFAACsDAAgBAcAALIRACAJAADTGAAgGwAA1RgAIBwAALcQACAFFAAAkxEAIPgFAACsDAAg3wYAAKwMACDiBgAArAwAIOMGAACsDAAgCAcAALIRACAJAADTGAAgDgAA2hgAIBAAANIYACAjAAC-FgAg-AUAAKwMACCkBgAArAwAIKcGAACsDAAgCwcAALIRACAJAADTGAAgDQAAtRAAIBEAALsWACAbAADVGAAgJAAAvRYAICYAANwYACD4BQAArAwAINEGAACsDAAg0gYAAKwMACDUBgAArAwAIAgHAACyEQAgCQAA0xgAIAoAAOEYACANAAC1EAAgEQAAuxYAINEGAACsDAAg3QYAAKwMACDjBgAArAwAIAUHAACyEQAgCQAA0xgAICUAALQQACD4BQAArAwAINEGAACsDAAgCAcAALIRACAJAADTGAAgCwAAwxYAIBsAANUYACD3BQAArAwAIPgFAACsDAAg0QYAAKwMACDTBgAArAwAIAMHAACyEQAgKgAAwxYAIMsGAACsDAAgABIHAACyEQAgCQAA0xgAIBAAANIYACApAADRGAAg-AUAAKwMACCxBgAArAwAILIGAACsDAAgswYAAKwMACC0BgAArAwAILUGAACsDAAgtgYAAKwMACC3BgAArAwAILgGAACsDAAguQYAAKwMACC6BgAArAwAILsGAACsDAAgvAYAAKwMACC9BgAArAwAIAkHAACyEQAgCQAA0xgAIA0AALUQACAPAAC3FgAg0QYAAKwMACDbBgAArAwAINwGAACsDAAg3QYAAKwMACDeBgAArAwAIAUHAACyEQAgOQAA4xgAIPcFAACsDAAg0QYAAKwMACCRBwAArAwAIAAWBwAAgw4AIAkAAIAOACAKAACBDgAgCwAA-g0AIA4AAP8NACAPAAD9DQAgEAAAkA8AIBkAAP4NACAbAACCDgAgLQAA_A0AIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABngYBAAAAAdMGAQAAAAHjBgEAAAABpgdAAAAAAQIAAAAoACBjAADkGAAgAwAAACYAIGMAAOQYACBkAADoGAAgGAAAACYAIAcAANANACAJAADNDQAgCgAAzg0AIAsAAMcNACAOAADMDQAgDwAAyg0AIBAAAI4PACAZAADLDQAgGwAAzw0AIC0AAMkNACBcAADoGAAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIZ4GAQCwDAAh0wYBALAMACHjBgEAsQwAIaYHQACyDAAhFgcAANANACAJAADNDQAgCgAAzg0AIAsAAMcNACAOAADMDQAgDwAAyg0AIBAAAI4PACAZAADLDQAgGwAAzw0AIC0AAMkNACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGbBgEAsAwAIZwGAQCwDAAhngYBALAMACHTBgEAsAwAIeMGAQCxDAAhpgdAALIMACEH8gUBAAAAAfoFQAAAAAH7BUAAAAABrwdAAAAAAbsHAQAAAAG8BwEAAAABvQcBAAAAAQzyBQEAAAAB-gVAAAAAAfsFQAAAAAGyBwEAAAABswcBAAAAAbQHAQAAAAG1BwEAAAABtgcBAAAAAbcHQAAAAAG4B0AAAAABuQcBAAAAAboHAQAAAAEhDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDUAAKYWACA2AACnFgAgNwAAqBYAIDoAAJkWACA7AACcFgAgPwAArRYAIEAAAKQWACBBAACrFgAgQgAArBYAIEcAALAWACBIAACxFgAgSQAAshYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaYGAAAAkwcDywYBAAAAAdEGAQAAAAGRBwEAAAABlAcBAAAAAQIAAAD0BAAgYwAA6xgAIAMAAAAWACBjAADrGAAgZAAA7xgAICMAAAAWACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAgXAAA7xgAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhIQwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAIQXyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABggcAAADKBwIJ8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABB_IFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAccGAQAAAAEa8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAowcCrAZAAAAAAdEGAQAAAAGQBwEAAAABkQcBAAAAAZMHAAAAkwcDlAcBAAAAAZUHAAAAwAYDlgcQAAAAAZcHAQAAAAGYBwIAAAABmQcAAADnBgKaBwEAAAABmwcBAAAAAZwHAQAAAAGdBwEAAAABngcBAAAAAZ8HAQAAAAGgB4AAAAABoQdAAAAAAaMHAQAAAAGkBwEAAAABGvIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAKMHAqwGQAAAAAHRBgEAAAABjwcBAAAAAZAHAQAAAAGRBwEAAAABkwcAAACTBwOUBwEAAAABlQcAAADABgOWBxAAAAABlwcBAAAAAZgHAgAAAAGZBwAAAOcGApoHAQAAAAGbBwEAAAABnAcBAAAAAZ0HAQAAAAGeBwEAAAABnwcBAAAAAaAHgAAAAAGhB0AAAAABowcBAAAAAQ3yBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGoBgEAAAABqgYAAACqBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAAQ3yBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGcBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAAQvyBQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqAYBAAAAAaoGAAAAyQYCqwYBAAAAAawGQAAAAAGtBkAAAAABrgYBAAAAAa8GAQAAAAEL8gUBAAAAAfoFQAAAAAH7BUAAAAABngYBAAAAAagGAQAAAAGqBgAAAMkGAqsGAQAAAAGsBkAAAAABrQZAAAAAAa4GAQAAAAHJBgEAAAABBfIFAQAAAAH6BUAAAAAB-wVAAAAAAa4HAQAAAAGvB0AAAAABD_IFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABrwYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABD_IFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGeBgEAAAABqgYAAACIBwKsBkAAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABB_IFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGjBgEAAAABpAYBAAAAAYQHAAAAggcCA_IFAQAAAAH_BgEAAAABgAdAAAAAASAFAACvGAAgBgAAsBgAIBAAALEYACAZAACyGAAgNAAAtRgAIEAAALMYACBMAAC0GAAgTQAAthgAIE4AALcYACBPAAC4GAAgUAAAuRgAIFEAALoYACBSAAC7GAAgUwAAvBgAIFQAAL0YACBVAAC-GAAgVgAAvxgAIPIFAQAAAAH2BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAABggcBAAAAAb4HAQAAAAG_ByAAAAABwAcBAAAAAcEHAQAAAAHCBwEAAAABwwcBAAAAAcQHAQAAAAHFBwEAAAABxgcBAAAAAQIAAADxAgAgYwAA_hgAIAMAAABRACBjAAD-GAAgZAAAghkAICIAAABRACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgVgAAiBcAIFwAAIIZACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACEgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACEgBAAArhgAIAYAALAYACAQAACxGAAgGQAAshgAIDQAALUYACBAAACzGAAgTAAAtBgAIE0AALYYACBOAAC3GAAgTwAAuBgAIFAAALkYACBRAAC6GAAgUgAAuxgAIFMAALwYACBUAAC9GAAgVQAAvhgAIFYAAL8YACDyBQEAAAAB9gUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAYIHAQAAAAG-BwEAAAABvwcgAAAAAcAHAQAAAAHBBwEAAAABwgcBAAAAAcMHAQAAAAHEBwEAAAABxQcBAAAAAcYHAQAAAAECAAAA8QIAIGMAAIMZACADAAAAUQAgYwAAgxkAIGQAAIcZACAiAAAAUQAgBAAA9xYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACBcAACHGQAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhIAQAAPcWACAGAAD5FgAgEAAA-hYAIBkAAPsWACA0AAD-FgAgQAAA_BYAIEwAAP0WACBNAAD_FgAgTgAAgBcAIE8AAIEXACBQAACCFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhIAQAAK4YACAFAACvGAAgBgAAsBgAIBAAALEYACAZAACyGAAgNAAAtRgAIEAAALMYACBMAAC0GAAgTQAAthgAIE4AALcYACBPAAC4GAAgUAAAuRgAIFEAALoYACBTAAC8GAAgVAAAvRgAIFUAAL4YACBWAAC_GAAg8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAgAAAPECACBjAACIGQAgAwAAAFEAIGMAAIgZACBkAACMGQAgIgAAAFEAIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUAAAghcAIFEAAIMXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAgXAAAjBkAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgVgAAiBcAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISEGAACfFgAgDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDUAAKYWACA2AACnFgAgNwAAqBYAIDoAAJkWACA_AACtFgAgQAAApBYAIEEAAKsWACBCAACsFgAgRwAAsBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAACNGQAgAwAAABYAIGMAAI0ZACBkAACRGQAgIwAAABYAIAYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACBcAACRGQAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEhBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhCAcAAMoWACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAZEHAQAAAAGlBwEAAAABAgAAABQAIGMAAJIZACADAAAAEgAgYwAAkhkAIGQAAJYZACAKAAAAEgAgBwAAyRYAIFwAAJYZACDyBQEAsAwAIfcFAQCxDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAhkQcBALEMACGlBwEAsAwAIQgHAADJFgAg8gUBALAMACH3BQEAsQwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAIZEHAQCxDAAhpQcBALAMACEhBgAAnxYAIAwAAK4WACANAACiFgAgEQAAoxYAIBwAAKoWACAlAACdFgAgJwAAqRYAICoAAK8WACAuAACaFgAgLwAAmxYAIDAAAJ4WACAxAACgFgAgMgAAoRYAIDQAAKUWACA1AACmFgAgNgAApxYAIDcAAKgWACA7AACcFgAgPwAArRYAIEAAAKQWACBBAACrFgAgQgAArBYAIEcAALAWACBIAACxFgAgSQAAshYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaYGAAAAkwcDywYBAAAAAdEGAQAAAAGRBwEAAAABlAcBAAAAAQIAAAD0BAAgYwAAlxkAIAMAAAAWACBjAACXGQAgZAAAmxkAICMAAAAWACAGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAgXAAAmxkAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhIQYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAIQryBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABowYBAAAAAdEGAQAAAAHbBgEAAAAB3AZAAAAAAd0GCAAAAAHeBggAAAABIQYAAJ8WACAMAACuFgAgDQAAohYAIBEAAKMWACAcAACqFgAgJQAAnRYAICcAAKkWACAqAACvFgAgLgAAmhYAIDAAAJ4WACAxAACgFgAgMgAAoRYAIDQAAKUWACA1AACmFgAgNgAApxYAIDcAAKgWACA6AACZFgAgOwAAnBYAID8AAK0WACBAAACkFgAgQQAAqxYAIEIAAKwWACBHAACwFgAgSAAAsRYAIEkAALIWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGmBgAAAJMHA8sGAQAAAAHRBgEAAAABkQcBAAAAAZQHAQAAAAECAAAA9AQAIGMAAJ0ZACADAAAAFgAgYwAAnRkAIGQAAKEZACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAAKEZACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEG8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAHRBgEAAAABCfIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAAB3QYCAAAAAeMGAQAAAAGnBwEAAAABqAcBAAAAAQnyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAdEGAQAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAEJ8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABB_IFAQAAAAH2BQEAAAAB9wUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAccGAQAAAAEL8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGbBgEAAAABnAYBAAAAAZ4GAQAAAAHTBgEAAAAB4wYBAAAAAaYHQAAAAAEH8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGbBgEAAAABnAYBAAAAAQ3yBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABhwYBAAAAAZwGAQAAAAGoBgEAAAABqgYAAACqBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAAQryBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZwGAQAAAAGjBgEAAAABpAYBAAAAAaYGAAAApgYCpwZAAAAAAQryBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBkAAAAABE_IFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABsAYBAAAAAbEGCAAAAAGyBggAAAABswYIAAAAAbQGCAAAAAG1BggAAAABtgYIAAAAAbcGCAAAAAG4BggAAAABuQYIAAAAAboGCAAAAAG7BggAAAABvAYIAAAAAb0GCAAAAAEJ8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAcMGAQAAAAHTBgEAAAAB9QYgAAAAAf0GEAAAAAH-BhAAAAABFvIFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqgYAAAD7BgLCBhAAAAABwwYBAAAAAcQGAgAAAAHTBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QaAAAAAAe4GQAAAAAH3BgEAAAAB-QYAAAD5BgL7BgEAAAAB_AZAAAAAAQryBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAADYBgLLBgEAAAAB0QYBAAAAAdMGAQAAAAHVBgEAAAAB1gYBAAAAAQryBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABsAYBAAAAAcsGAQAAAAHRBgEAAAAB2AYBAAAAAdkGAQAAAAHaBgEAAAABD_IFAQAAAAH6BUAAAAAB-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-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACBcAADJGQAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhIAQAAPcWACAFAAD4FgAgEAAA-hYAIBkAAPsWACA0AAD-FgAgQAAA_BYAIEwAAP0WACBNAAD_FgAgTgAAgBcAIE8AAIEXACBQAACCFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhBfIFAQAAAAH5BQEAAAAB-gVAAAAAAfsFQAAAAAGCBwAAAMoHAgnyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BQEAAAAB9gUBAAAAAfgFAQAAAAH5BQEAAAAB-gVAAAAAAfsFQAAAAAEH8gUBAAAAAfYFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABxwYBAAAAAQvyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABngYBAAAAAdMGAQAAAAHjBgEAAAABpgdAAAAAAQfyBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABGvIFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAowcCrAZAAAAAAdEGAQAAAAGPBwEAAAABkAcBAAAAAZEHAQAAAAGTBwAAAJMHA5QHAQAAAAGVBwAAAMAGA5YHEAAAAAGXBwEAAAABmAcCAAAAAZkHAAAA5wYCmgcBAAAAAZsHAQAAAAGcBwEAAAABnQcBAAAAAZ4HAQAAAAGfBwEAAAABoAeAAAAAAaEHQAAAAAGjBwEAAAABpAcBAAAAAQ3yBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABhwYBAAAAAZwGAQAAAAGoBgEAAAABqgYAAACqBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAAQryBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZwGAQAAAAGjBgEAAAABpAYBAAAAAaYGAAAApgYCpwZAAAAAAQryBQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABnQYBAAAAAZ4GAQAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBkAAAAABE_IFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABsAYBAAAAAbEGCAAAAAGyBggAAAABswYIAAAAAbQGCAAAAAG1BggAAAABtgYIAAAAAbcGCAAAAAG4BggAAAABuQYIAAAAAboGCAAAAAG7BggAAAABvAYIAAAAAb0GCAAAAAEJ8gUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAcMGAQAAAAHTBgEAAAAB9QYgAAAAAf0GEAAAAAH-BhAAAAABFvIFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqgYAAAD7BgLCBhAAAAABwwYBAAAAAcQGAgAAAAHTBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QaAAAAAAe4GQAAAAAH3BgEAAAAB-QYAAAD5BgL7BgEAAAAB_AZAAAAAARHyBQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAOcGAsAGAAAAwAYCwgYQAAAAAcMGAQAAAAHEBgIAAAAB5QYBAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GgAAAAAHuBkAAAAABC_IFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAAwgYCvgYBAAAAAcAGAAAAwAYCwgYQAAAAAcMGAQAAAAHEBgIAAAABxQZAAAAAAcYGQAAAAAEK8gUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAaoGAAAA2AYCywYBAAAAAdEGAQAAAAHTBgEAAAAB1QYBAAAAAdYGAQAAAAEK8gUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAbAGAQAAAAHLBgEAAAAB0QYBAAAAAdgGAQAAAAHZBgEAAAAB2gYBAAAAAQfyBQEAAAAB-gVAAAAAAfsFQAAAAAGjBgEAAAABpAYBAAAAAYMHAQAAAAGEBwAAAIIHAg_yBQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABngYBAAAAAaoGAAAAiAcCrAZAAAAAAa8GAQAAAAGGBwAAAIYHAokHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgdAAAAAAQ_yBQEAAAAB-gVAAAAAAfsFQAAAAAGcBgEAAAABngYBAAAAAaoGAAAAiAcCrAZAAAAAAa8GAQAAAAGGBwAAAIYHAogHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgdAAAAAASEGAACfFgAgDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDUAAKYWACA2AACnFgAgNwAAqBYAIDoAAJkWACA7AACcFgAgPwAArRYAIEEAAKsWACBCAACsFgAgRwAAsBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAADdGQAgIAQAAK4YACAFAACvGAAgBgAAsBgAIBAAALEYACAZAACyGAAgNAAAtRgAIEAAALMYACBNAAC2GAAgTgAAtxgAIE8AALgYACBQAAC5GAAgUQAAuhgAIFIAALsYACBTAAC8GAAgVAAAvRgAIFUAAL4YACBWAAC_GAAg8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAgAAAPECACBjAADfGQAgIAQAAK4YACAFAACvGAAgBgAAsBgAIBAAALEYACAZAACyGAAgNAAAtRgAIEwAALQYACBNAAC2GAAgTgAAtxgAIE8AALgYACBQAAC5GAAgUQAAuhgAIFIAALsYACBTAAC8GAAgVAAAvRgAIFUAAL4YACBWAAC_GAAg8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAgAAAPECACBjAADhGQAgC_IFAQAAAAH3BQEAAAAB-gVAAAAAAfsFQAAAAAGqBgAAAMIGAsAGAAAAwAYCwgYQAAAAAcMGAQAAAAHEBgIAAAABxQZAAAAAAcYGQAAAAAEDAAAAFgAgYwAA3RkAIGQAAOYZACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAAOYZACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEDAAAAUQAgYwAA3xkAIGQAAOkZACAiAAAAUQAgBAAA9xYAIAUAAPgWACAGAAD5FgAgEAAA-hYAIBkAAPsWACA0AAD-FgAgQAAA_BYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACBcAADpGQAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBNAAD_FgAgTgAAgBcAIE8AAIEXACBQAACCFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhAwAAAFEAIGMAAOEZACBkAADsGQAgIgAAAFEAIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEwAAP0WACBNAAD_FgAgTgAAgBcAIE8AAIEXACBQAACCFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAgXAAA7BkAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgVgAAiBcAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAACuGAAgBQAArxgAIAYAALAYACAQAACxGAAgGQAAshgAIDQAALUYACBAAACzGAAgTAAAtBgAIE0AALYYACBOAAC3GAAgTwAAuBgAIFAAALkYACBRAAC6GAAgUgAAuxgAIFMAALwYACBUAAC9GAAgVgAAvxgAIPIFAQAAAAH2BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAABggcBAAAAAb4HAQAAAAG_ByAAAAABwAcBAAAAAcEHAQAAAAHCBwEAAAABwwcBAAAAAcQHAQAAAAHFBwEAAAABxgcBAAAAAQIAAADxAgAgYwAA7RkAICEGAACfFgAgDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDUAAKYWACA2AACnFgAgNwAAqBYAIDoAAJkWACA7AACcFgAgPwAArRYAIEAAAKQWACBBAACrFgAgQgAArBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAADvGQAgA_IFAQAAAAH6BUAAAAABggcAAACCBwID8gUBAAAAAfkFAQAAAAGAB0AAAAABAwAAAFEAIGMAAO0ZACBkAAD1GQAgIgAAAFEAIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFQAAIYXACBWAACIFwAgXAAA9RkAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVgAAiBcAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAIQMAAAAWACBjAADvGQAgZAAA-BkAICMAAAAWACAGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEgAAKoSACBJAACrEgAgXAAA-BkAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhIQYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgSAAAqhIAIEkAAKsSACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAIQsHAADrEQAgQwAA7BEAIEYAAO4RACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABowYBAAAAAaQGAQAAAAGDBwEAAAABhAcAAACCBwICAAAA8AEAIGMAAPkZACADAAAA7gEAIGMAAPkZACBkAAD9GQAgDQAAAO4BACAHAADPEQAgQwAA0BEAIEYAANIRACBcAAD9GQAg8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGjBgEAsAwAIaQGAQCwDAAhgwcBALAMACGEBwAAyRGCByILBwAAzxEAIEMAANARACBGAADSEQAg8gUBALAMACH3BQEAsAwAIfoFQACyDAAh-wVAALIMACGjBgEAsAwAIaQGAQCwDAAhgwcBALAMACGEBwAAyRGCByIgBAAArhgAIAUAAK8YACAGAACwGAAgEAAAsRgAIBkAALIYACA0AAC1GAAgQAAAsxgAIEwAALQYACBNAAC2GAAgTgAAtxgAIE8AALgYACBQAAC5GAAgUQAAuhgAIFIAALsYACBTAAC8GAAgVAAAvRgAIFUAAL4YACDyBQEAAAAB9gUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAYIHAQAAAAG-BwEAAAABvwcgAAAAAcAHAQAAAAHBBwEAAAABwgcBAAAAAcMHAQAAAAHEBwEAAAABxQcBAAAAAcYHAQAAAAECAAAA8QIAIGMAAP4ZACALBwAA6xEAIEMAAOwRACBFAADtEQAg8gUBAAAAAfcFAQAAAAH6BUAAAAAB-wVAAAAAAaMGAQAAAAGkBgEAAAABgwcBAAAAAYQHAAAAggcCAgAAAPABACBjAACAGgAgAwAAAFEAIGMAAP4ZACBkAACEGgAgIgAAAFEAIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgXAAAhBoAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAIQMAAADuAQAgYwAAgBoAIGQAAIcaACANAAAA7gEAIAcAAM8RACBDAADQEQAgRQAA0REAIFwAAIcaACDyBQEAsAwAIfcFAQCwDAAh-gVAALIMACH7BUAAsgwAIaMGAQCwDAAhpAYBALAMACGDBwEAsAwAIYQHAADJEYIHIgsHAADPEQAgQwAA0BEAIEUAANERACDyBQEAsAwAIfcFAQCwDAAh-gVAALIMACH7BUAAsgwAIaMGAQCwDAAhpAYBALAMACGDBwEAsAwAIYQHAADJEYIHIgkMAACuEAAgDQAAsBAAIBwAALIQACAlAACvEAAg8gUBAAAAAfcFAQAAAAHLBgEAAAABzAZAAAAAAc0GQAAAAAECAAAA-AcAIGMAAIgaACADAAAALwAgYwAAiBoAIGQAAIwaACALAAAALwAgDAAAqA8AIA0AAKoPACAcAACsDwAgJQAAqQ8AIFwAAIwaACDyBQEAsAwAIfcFAQCwDAAhywYBALAMACHMBkAAsgwAIc0GQACyDAAhCQwAAKgPACANAACqDwAgHAAArA8AICUAAKkPACDyBQEAsAwAIfcFAQCwDAAhywYBALAMACHMBkAAsgwAIc0GQACyDAAhIQYAAJ8WACAMAACuFgAgDQAAohYAIBEAAKMWACAcAACqFgAgJQAAnRYAICcAAKkWACAqAACvFgAgLgAAmhYAIC8AAJsWACAwAACeFgAgMQAAoBYAIDIAAKEWACA0AAClFgAgNQAAphYAIDYAAKcWACA3AACoFgAgOgAAmRYAIDsAAJwWACA_AACtFgAgQAAApBYAIEIAAKwWACBHAACwFgAgSAAAsRYAIEkAALIWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGmBgAAAJMHA8sGAQAAAAHRBgEAAAABkQcBAAAAAZQHAQAAAAECAAAA9AQAIGMAAI0aACADAAAAFgAgYwAAjRoAIGQAAJEaACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAAJEaACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEhBgAAnxYAIAwAAK4WACANAACiFgAgEQAAoxYAIBwAAKoWACAlAACdFgAgJwAAqRYAICoAAK8WACAuAACaFgAgLwAAmxYAIDAAAJ4WACAxAACgFgAgMgAAoRYAIDQAAKUWACA1AACmFgAgNgAApxYAIDcAAKgWACA6AACZFgAgOwAAnBYAID8AAK0WACBAAACkFgAgQQAAqxYAIEcAALAWACBIAACxFgAgSQAAshYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaYGAAAAkwcDywYBAAAAAdEGAQAAAAGRBwEAAAABlAcBAAAAAQIAAAD0BAAgYwAAkhoAIAMAAAAWACBjAACSGgAgZAAAlhoAICMAAAAWACAGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgRwAAqRIAIEgAAKoSACBJAACrEgAgXAAAlhoAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhIQYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBHAACpEgAgSAAAqhIAIEkAAKsSACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAIQ3yBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGcBgEAAAABqAYBAAAAAaoGAAAAqgYCqwYBAAAAAawGQAAAAAGtBkAAAAABrwYBAAAAAQvyBQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqAYBAAAAAaoGAAAAyQYCqwYBAAAAAawGQAAAAAGtBkAAAAABrwYBAAAAAckGAQAAAAEYCAAAzxYAIAwAAJQWACANAACMFgAgEQAAjRYAIBwAAJMWACAlAACJFgAgJwAAkhYAICoAAJUWACAvAACHFgAgMAAAiBYAIDEAAIoWACAyAACLFgAgNAAAjhYAIDUAAI8WACA2AACQFgAgNwAAkRYAIDgAAJYWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAAB4gYBAAAAAZEHAQAAAAGlBwEAAAABAgAAABoAIGMAAJkaACAhBgAAnxYAIAwAAK4WACANAACiFgAgEQAAoxYAIBwAAKoWACAlAACdFgAgJwAAqRYAICoAAK8WACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDUAAKYWACA2AACnFgAgNwAAqBYAIDoAAJkWACA7AACcFgAgPwAArRYAIEAAAKQWACBBAACrFgAgQgAArBYAIEcAALAWACBIAACxFgAgSQAAshYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaYGAAAAkwcDywYBAAAAAdEGAQAAAAGRBwEAAAABlAcBAAAAAQIAAAD0BAAgYwAAmxoAIBgIAADPFgAgDAAAlBYAIA0AAIwWACARAACNFgAgHAAAkxYAICUAAIkWACAnAACSFgAgKgAAlRYAIC4AAIYWACAvAACHFgAgMQAAihYAIDIAAIsWACA0AACOFgAgNQAAjxYAIDYAAJAWACA3AACRFgAgOAAAlhYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHiBgEAAAABkQcBAAAAAaUHAQAAAAECAAAAGgAgYwAAnRoAICEGAACfFgAgDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMQAAoBYAIDIAAKEWACA0AAClFgAgNQAAphYAIDYAAKcWACA3AACoFgAgOgAAmRYAIDsAAJwWACA_AACtFgAgQAAApBYAIEEAAKsWACBCAACsFgAgRwAAsBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAACfGgAgC_IFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZwGAQAAAAGeBgEAAAAB0wYBAAAAAeMGAQAAAAGmB0AAAAABB_IFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZwGAQAAAAEDAAAAGAAgYwAAnRoAIGQAAKUaACAaAAAAGAAgCAAAzhYAIAwAAOcUACANAADfFAAgEQAA4BQAIBwAAOYUACAlAADcFAAgJwAA5RQAICoAAOgUACAuAADZFAAgLwAA2hQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgNwAA5BQAIDgAAOkUACBcAAClGgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHiBgEAsQwAIZEHAQCxDAAhpQcBALAMACEYCAAAzhYAIAwAAOcUACANAADfFAAgEQAA4BQAIBwAAOYUACAlAADcFAAgJwAA5RQAICoAAOgUACAuAADZFAAgLwAA2hQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgNwAA5BQAIDgAAOkUACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAIeIGAQCxDAAhkQcBALEMACGlBwEAsAwAIQMAAAAWACBjAACfGgAgZAAAqBoAICMAAAAWACAGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAgXAAAqBoAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhIQYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAIQnyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHdBgIAAAABpwcBAAAAAagHAQAAAAEL8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAGeBgEAAAAB0wYBAAAAAaYHQAAAAAEDAAAAGAAgYwAAmRoAIGQAAK0aACAaAAAAGAAgCAAAzhYAIAwAAOcUACANAADfFAAgEQAA4BQAIBwAAOYUACAlAADcFAAgJwAA5RQAICoAAOgUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgNwAA5BQAIDgAAOkUACBcAACtGgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHiBgEAsQwAIZEHAQCxDAAhpQcBALAMACEYCAAAzhYAIAwAAOcUACANAADfFAAgEQAA4BQAIBwAAOYUACAlAADcFAAgJwAA5RQAICoAAOgUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgNwAA5BQAIDgAAOkUACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAIeIGAQCxDAAhkQcBALEMACGlBwEAsAwAIQMAAAAWACBjAACbGgAgZAAAsBoAICMAAAAWACAGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAgXAAAsBoAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhIQYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAIQkNAACwEAAgHAAAshAAICUAAK8QACAnAACxEAAg8gUBAAAAAfcFAQAAAAHLBgEAAAABzAZAAAAAAc0GQAAAAAECAAAA-AcAIGMAALEaACADAAAALwAgYwAAsRoAIGQAALUaACALAAAALwAgDQAAqg8AIBwAAKwPACAlAACpDwAgJwAAqw8AIFwAALUaACDyBQEAsAwAIfcFAQCwDAAhywYBALAMACHMBkAAsgwAIc0GQACyDAAhCQ0AAKoPACAcAACsDwAgJQAAqQ8AICcAAKsPACDyBQEAsAwAIfcFAQCwDAAhywYBALAMACHMBkAAsgwAIc0GQACyDAAhCQwAAK4QACANAACwEAAgHAAAshAAICcAALEQACDyBQEAAAAB9wUBAAAAAcsGAQAAAAHMBkAAAAABzQZAAAAAAQIAAAD4BwAgYwAAthoAIAMAAAAvACBjAAC2GgAgZAAAuhoAIAsAAAAvACAMAACoDwAgDQAAqg8AIBwAAKwPACAnAACrDwAgXAAAuhoAIPIFAQCwDAAh9wUBALAMACHLBgEAsAwAIcwGQACyDAAhzQZAALIMACEJDAAAqA8AIA0AAKoPACAcAACsDwAgJwAAqw8AIPIFAQCwDAAh9wUBALAMACHLBgEAsAwAIcwGQACyDAAhzQZAALIMACEYCAAAzxYAIA0AAIwWACARAACNFgAgHAAAkxYAICUAAIkWACAnAACSFgAgKgAAlRYAIC4AAIYWACAvAACHFgAgMAAAiBYAIDEAAIoWACAyAACLFgAgNAAAjhYAIDUAAI8WACA2AACQFgAgNwAAkRYAIDgAAJYWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAAB4gYBAAAAAZEHAQAAAAGlBwEAAAABAgAAABoAIGMAALsaACAhBgAAnxYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDUAAKYWACA2AACnFgAgNwAAqBYAIDoAAJkWACA7AACcFgAgPwAArRYAIEAAAKQWACBBAACrFgAgQgAArBYAIEcAALAWACBIAACxFgAgSQAAshYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaYGAAAAkwcDywYBAAAAAdEGAQAAAAGRBwEAAAABlAcBAAAAAQIAAAD0BAAgYwAAvRoAIBYHAACDDgAgCQAAgA4AIAoAAIEOACAOAAD_DQAgDwAA_Q0AIBAAAJAPACAZAAD-DQAgGwAAgg4AICwAAPsNACAtAAD8DQAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABmwYBAAAAAZwGAQAAAAGeBgEAAAAB0wYBAAAAAeMGAQAAAAGmB0AAAAABAgAAACgAIGMAAL8aACADAAAAJgAgYwAAvxoAIGQAAMMaACAYAAAAJgAgBwAA0A0AIAkAAM0NACAKAADODQAgDgAAzA0AIA8AAMoNACAQAACODwAgGQAAyw0AIBsAAM8NACAsAADIDQAgLQAAyQ0AIFwAAMMaACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGbBgEAsAwAIZwGAQCwDAAhngYBALAMACHTBgEAsAwAIeMGAQCxDAAhpgdAALIMACEWBwAA0A0AIAkAAM0NACAKAADODQAgDgAAzA0AIA8AAMoNACAQAACODwAgGQAAyw0AIBsAAM8NACAsAADIDQAgLQAAyQ0AIPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGaBgEAsAwAIZsGAQCwDAAhnAYBALAMACGeBgEAsAwAIdMGAQCwDAAh4wYBALEMACGmB0AAsgwAIQryBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAbAGAQAAAAHLBgEAAAAB0QYBAAAAAdgGAQAAAAHaBgEAAAABAwAAABgAIGMAALsaACBkAADHGgAgGgAAABgAIAgAAM4WACANAADfFAAgEQAA4BQAIBwAAOYUACAlAADcFAAgJwAA5RQAICoAAOgUACAuAADZFAAgLwAA2hQAIDAAANsUACAxAADdFAAgMgAA3hQAIDQAAOEUACA1AADiFAAgNgAA4xQAIDcAAOQUACA4AADpFAAgXAAAxxoAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh4gYBALEMACGRBwEAsQwAIaUHAQCwDAAhGAgAAM4WACANAADfFAAgEQAA4BQAIBwAAOYUACAlAADcFAAgJwAA5RQAICoAAOgUACAuAADZFAAgLwAA2hQAIDAAANsUACAxAADdFAAgMgAA3hQAIDQAAOEUACA1AADiFAAgNgAA4xQAIDcAAOQUACA4AADpFAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHiBgEAsQwAIZEHAQCxDAAhpQcBALAMACEDAAAAFgAgYwAAvRoAIGQAAMoaACAjAAAAFgAgBgAAmBIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAAMoaACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_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_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEJ8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAAB0QYBAAAAAdIGAgAAAAHUBgEAAAABC_IFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGcBgEAAAABngYBAAAAAeMGAQAAAAGmB0AAAAABGAgAAM8WACAMAACUFgAgDQAAjBYAIBEAAI0WACAcAACTFgAgJQAAiRYAICoAAJUWACAuAACGFgAgLwAAhxYAIDAAAIgWACAxAACKFgAgMgAAixYAIDQAAI4WACA1AACPFgAgNgAAkBYAIDcAAJEWACA4AACWFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAeIGAQAAAAGRBwEAAAABpQcBAAAAAQIAAAAaACBjAADgGgAgIQYAAJ8WACAMAACuFgAgDQAAohYAIBEAAKMWACAcAACqFgAgJQAAnRYAICoAAK8WACAuAACaFgAgLwAAmxYAIDAAAJ4WACAxAACgFgAgMgAAoRYAIDQAAKUWACA1AACmFgAgNgAApxYAIDcAAKgWACA6AACZFgAgOwAAnBYAID8AAK0WACBAAACkFgAgQQAAqxYAIEIAAKwWACBHAACwFgAgSAAAsRYAIEkAALIWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGmBgAAAJMHA8sGAQAAAAHRBgEAAAABkQcBAAAAAZQHAQAAAAECAAAA9AQAIGMAAOIaACAW8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqgYAAAD7BgLCBhAAAAABwwYBAAAAAcQGAgAAAAHTBgEAAAAB5wYBAAAAAegGAQAAAAHpBgEAAAAB6gYBAAAAAesGAQAAAAHsBgEAAAAB7QaAAAAAAe4GQAAAAAH5BgAAAPkGAvsGAQAAAAH8BkAAAAABAwAAABgAIGMAAOAaACBkAADnGgAgGgAAABgAIAgAAM4WACAMAADnFAAgDQAA3xQAIBEAAOAUACAcAADmFAAgJQAA3BQAICoAAOgUACAuAADZFAAgLwAA2hQAIDAAANsUACAxAADdFAAgMgAA3hQAIDQAAOEUACA1AADiFAAgNgAA4xQAIDcAAOQUACA4AADpFAAgXAAA5xoAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh4gYBALEMACGRBwEAsQwAIaUHAQCwDAAhGAgAAM4WACAMAADnFAAgDQAA3xQAIBEAAOAUACAcAADmFAAgJQAA3BQAICoAAOgUACAuAADZFAAgLwAA2hQAIDAAANsUACAxAADdFAAgMgAA3hQAIDQAAOEUACA1AADiFAAgNgAA4xQAIDcAAOQUACA4AADpFAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHiBgEAsQwAIZEHAQCxDAAhpQcBALAMACEDAAAAFgAgYwAA4hoAIGQAAOoaACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAAOoaACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEJ8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAHDBgEAAAAB9QYgAAAAAf0GEAAAAAH-BhAAAAABDwMAAJMPACAHAACRDwAgCQAAkg8AIA0AAJQPACATAACVDwAgGgAAlg8AICIAAJgPACDyBQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABxwYBAAAAAQIAAACdAQAgYwAA7BoAIAMAAABTACBjAADsGgAgZAAA8BoAIBEAAABTACADAADDDgAgBwAAwQ4AIAkAAMIOACANAADEDgAgEwAAxQ4AIBoAAMYOACAiAADIDgAgXAAA8BoAIPIFAQCwDAAh9gUBALEMACH3BQEAsAwAIfgFAQCxDAAh-QUBALAMACH6BUAAsgwAIfsFQACyDAAhxwYBALAMACEPAwAAww4AIAcAAMEOACAJAADCDgAgDQAAxA4AIBMAAMUOACAaAADGDgAgIgAAyA4AIPIFAQCwDAAh9gUBALEMACH3BQEAsAwAIfgFAQCxDAAh-QUBALAMACH6BUAAsgwAIfsFQACyDAAhxwYBALAMACEW8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGeBgEAAAABqgYAAAD7BgLCBhAAAAABwwYBAAAAAcQGAgAAAAHnBgEAAAAB6AYBAAAAAekGAQAAAAHqBgEAAAAB6wYBAAAAAewGAQAAAAHtBoAAAAAB7gZAAAAAAfcGAQAAAAH5BgAAAPkGAvsGAQAAAAH8BkAAAAABIAQAAK4YACAFAACvGAAgBgAAsBgAIBAAALEYACAZAACyGAAgNAAAtRgAIEAAALMYACBMAAC0GAAgTQAAthgAIE4AALcYACBPAAC4GAAgUAAAuRgAIFIAALsYACBTAAC8GAAgVAAAvRgAIFUAAL4YACBWAAC_GAAg8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAgAAAPECACBjAADyGgAgAwAAAFEAIGMAAPIaACBkAAD2GgAgIgAAAFEAIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUAAAghcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAgXAAA9hoAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBSAACEFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgVgAAiBcAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAIQ8DAACTDwAgBwAAkQ8AIAkAAJIPACANAACUDwAgEwAAlQ8AIBwAAJcPACAiAACYDwAg8gUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAccGAQAAAAECAAAAnQEAIGMAAPcaACADAAAAUwAgYwAA9xoAIGQAAPsaACARAAAAUwAgAwAAww4AIAcAAMEOACAJAADCDgAgDQAAxA4AIBMAAMUOACAcAADHDgAgIgAAyA4AIFwAAPsaACDyBQEAsAwAIfYFAQCxDAAh9wUBALAMACH4BQEAsQwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIccGAQCwDAAhDwMAAMMOACAHAADBDgAgCQAAwg4AIA0AAMQOACATAADFDgAgHAAAxw4AICIAAMgOACDyBQEAsAwAIfYFAQCxDAAh9wUBALAMACH4BQEAsQwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIccGAQCwDAAhIAQAAK4YACAFAACvGAAgBgAAsBgAIBAAALEYACA0AAC1GAAgQAAAsxgAIEwAALQYACBNAAC2GAAgTgAAtxgAIE8AALgYACBQAAC5GAAgUQAAuhgAIFIAALsYACBTAAC8GAAgVAAAvRgAIFUAAL4YACBWAAC_GAAg8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAgAAAPECACBjAAD8GgAgGAgAAM8WACAMAACUFgAgDQAAjBYAIBEAAI0WACAcAACTFgAgJQAAiRYAICcAAJIWACAqAACVFgAgLgAAhhYAIC8AAIcWACAwAACIFgAgMQAAihYAIDQAAI4WACA1AACPFgAgNgAAkBYAIDcAAJEWACA4AACWFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAeIGAQAAAAGRBwEAAAABpQcBAAAAAQIAAAAaACBjAAD-GgAgIQYAAJ8WACAMAACuFgAgDQAAohYAIBEAAKMWACAcAACqFgAgJQAAnRYAICcAAKkWACAqAACvFgAgLgAAmhYAIC8AAJsWACAwAACeFgAgMQAAoBYAIDQAAKUWACA1AACmFgAgNgAApxYAIDcAAKgWACA6AACZFgAgOwAAnBYAID8AAK0WACBAAACkFgAgQQAAqxYAIEIAAKwWACBHAACwFgAgSAAAsRYAIEkAALIWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGmBgAAAJMHA8sGAQAAAAHRBgEAAAABkQcBAAAAAZQHAQAAAAECAAAA9AQAIGMAAIAbACASAwAAjA4AIAcAAIQOACAJAACLDgAgEQAAhg4AICIAAIoOACAkAACHDgAgSgAAiA4AIEsAAIkOACDyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABAgAAABAAIGMAAIIbACADAAAADgAgYwAAghsAIGQAAIYbACAUAAAADgAgAwAAuwwAIAcAALMMACAJAAC6DAAgEQAAtQwAICIAALkMACAkAAC2DAAgSgAAtwwAIEsAALgMACBcAACGGwAg8gUBALAMACHzBQEAsAwAIfQFAQCwDAAh9QUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALAMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACESAwAAuwwAIAcAALMMACAJAAC6DAAgEQAAtQwAICIAALkMACAkAAC2DAAgSgAAtwwAIEsAALgMACDyBQEAsAwAIfMFAQCwDAAh9AUBALAMACH1BQEAsAwAIfYFAQCxDAAh9wUBALAMACH4BQEAsAwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIQvyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGbBgEAAAABnAYBAAAAAdMGAQAAAAHjBgEAAAABpgdAAAAAAQryBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZ0GAQAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBkAAAAABIAQAAK4YACAFAACvGAAgBgAAsBgAIBAAALEYACAZAACyGAAgNAAAtRgAIEAAALMYACBMAAC0GAAgTQAAthgAIE4AALcYACBPAAC4GAAgUQAAuhgAIFIAALsYACBTAAC8GAAgVAAAvRgAIFUAAL4YACBWAAC_GAAg8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAgAAAPECACBjAACJGwAgIAQAAK4YACAFAACvGAAgBgAAsBgAIBAAALEYACAZAACyGAAgNAAAtRgAIEAAALMYACBMAAC0GAAgTQAAthgAIE4AALcYACBQAAC5GAAgUQAAuhgAIFIAALsYACBTAAC8GAAgVAAAvRgAIFUAAL4YACBWAAC_GAAg8gUBAAAAAfYFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAGCBwEAAAABvgcBAAAAAb8HIAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAHDBwEAAAABxAcBAAAAAcUHAQAAAAHGBwEAAAABAgAAAPECACBjAACLGwAgDPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABowYBAAAAAd8GAQAAAAHgBgEAAAAB4QYAAJERACDiBgEAAAAB4wYBAAAAAeQGAQAAAAECAAAA-QYAIGMAAI0bACADAAAAUQAgYwAAiRsAIGQAAJEbACAiAAAAUQAgBAAA9xYAIAUAAPgWACAGAAD5FgAgEAAA-hYAIBkAAPsWACA0AAD-FgAgQAAA_BYAIEwAAP0WACBNAAD_FgAgTgAAgBcAIE8AAIEXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACBcAACRGwAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhAwAAAFEAIGMAAIsbACBkAACUGwAgIgAAAFEAIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBQAACCFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAgXAAAlBsAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgVgAAiBcAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAIQMAAAD8BgAgYwAAjRsAIGQAAJcbACAOAAAA_AYAIFwAAJcbACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhowYBALAMACHfBgEAsQwAIeAGAQCwDAAh4QYAAIYRACDiBgEAsQwAIeMGAQCxDAAh5AYBALAMACEM8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIaMGAQCwDAAh3wYBALEMACHgBgEAsAwAIeEGAACGEQAg4gYBALEMACHjBgEAsQwAIeQGAQCwDAAhC_IFAQAAAAH6BUAAAAAB-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-QYAAAD5BgL7BgEAAAAB_AZAAAAAARIDAACMDgAgBwAAhA4AIAkAAIsOACANAACFDgAgEQAAhg4AICQAAIcOACBKAACIDgAgSwAAiQ4AIPIFAQAAAAHzBQEAAAAB9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQEAAAAB-gVAAAAAAfsFQAAAAAECAAAAEAAgYwAArhsAIAMAAAAOACBjAACuGwAgZAAAshsAIBQAAAAOACADAAC7DAAgBwAAswwAIAkAALoMACANAAC0DAAgEQAAtQwAICQAALYMACBKAAC3DAAgSwAAuAwAIFwAALIbACDyBQEAsAwAIfMFAQCwDAAh9AUBALAMACH1BQEAsAwAIfYFAQCxDAAh9wUBALAMACH4BQEAsAwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIRIDAAC7DAAgBwAAswwAIAkAALoMACANAAC0DAAgEQAAtQwAICQAALYMACBKAAC3DAAgSwAAuAwAIPIFAQCwDAAh8wUBALAMACH0BQEAsAwAIfUFAQCwDAAh9gUBALEMACH3BQEAsAwAIfgFAQCwDAAh-QUBALAMACH6BUAAsgwAIfsFQACyDAAhD_IFAQAAAAH6BUAAAAAB-wVAAAAAAZwGAQAAAAGqBgAAAIgHAqwGQAAAAAGvBgEAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABAwAAAFEAIGMAAPwaACBkAAC2GwAgIgAAAFEAIAQAAPcWACAFAAD4FgAgBgAA-RYAIBAAAPoWACA0AAD-FgAgQAAA_BYAIEwAAP0WACBNAAD_FgAgTgAAgBcAIE8AAIEXACBQAACCFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAgXAAAthsAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_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_BEAIFwAAMMbACDyBQEAsAwAIfcFAQCxDAAh-gVAALIMACH7BUAAsgwAIaoGAAD6EaMHIqwGQADIDAAh0QYBALEMACGPBwEAsAwAIZAHAQCwDAAhkQcBALEMACGTBwAA9xGTByOUBwEAsQwAIZUHAAD4EcAGI5YHEAD5EQAhlwcBALAMACGYBwIA5g8AIZkHAACqEecGIpoHAQCxDAAhmwcBALEMACGcBwEAsQwAIZ0HAQCxDAAhngcBALEMACGfBwEAsQwAIaAHgAAAAAGhB0AAyAwAIaMHAQCxDAAhpAcBALEMACEeBwAA_REAIDwAAPsRACA9AAD8EQAg8gUBALAMACH3BQEAsQwAIfoFQACyDAAh-wVAALIMACGqBgAA-hGjByKsBkAAyAwAIdEGAQCxDAAhjwcBALAMACGQBwEAsAwAIZEHAQCxDAAhkwcAAPcRkwcjlAcBALEMACGVBwAA-BHABiOWBxAA-REAIZcHAQCwDAAhmAcCAOYPACGZBwAAqhHnBiKaBwEAsQwAIZsHAQCxDAAhnAcBALEMACGdBwEAsQwAIZ4HAQCxDAAhnwcBALEMACGgB4AAAAABoQdAAMgMACGjBwEAsQwAIaQHAQCxDAAhAwAAABYAIGMAAL8bACBkAADGGwAgIwAAABYAIAYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACBcAADGGwAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEhBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhEgMAAIwOACAHAACEDgAgCQAAiw4AIA0AAIUOACARAACGDgAgIgAAig4AICQAAIcOACBLAACJDgAg8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAQIAAAAQACBjAADHGwAgAwAAAA4AIGMAAMcbACBkAADLGwAgFAAAAA4AIAMAALsMACAHAACzDAAgCQAAugwAIA0AALQMACARAAC1DAAgIgAAuQwAICQAALYMACBLAAC4DAAgXAAAyxsAIPIFAQCwDAAh8wUBALAMACH0BQEAsAwAIfUFAQCwDAAh9gUBALEMACH3BQEAsAwAIfgFAQCwDAAh-QUBALAMACH6BUAAsgwAIfsFQACyDAAhEgMAALsMACAHAACzDAAgCQAAugwAIA0AALQMACARAAC1DAAgIgAAuQwAICQAALYMACBLAAC4DAAg8gUBALAMACHzBQEAsAwAIfQFAQCwDAAh9QUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALAMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACESAwAAjA4AIAcAAIQOACAJAACLDgAgDQAAhQ4AIBEAAIYOACAiAACKDgAgSgAAiA4AIEsAAIkOACDyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABAgAAABAAIGMAAMwbACADAAAADgAgYwAAzBsAIGQAANAbACAUAAAADgAgAwAAuwwAIAcAALMMACAJAAC6DAAgDQAAtAwAIBEAALUMACAiAAC5DAAgSgAAtwwAIEsAALgMACBcAADQGwAg8gUBALAMACHzBQEAsAwAIfQFAQCwDAAh9QUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALAMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACESAwAAuwwAIAcAALMMACAJAAC6DAAgDQAAtAwAIBEAALUMACAiAAC5DAAgSgAAtwwAIEsAALgMACDyBQEAsAwAIfMFAQCwDAAh9AUBALAMACH1BQEAsAwAIfYFAQCxDAAh9wUBALAMACH4BQEAsAwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAIQ8HAAClDQAgCQAApg0AIA4AAKQNACAQAACmDgAg8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABnAYBAAAAAaMGAQAAAAGkBgEAAAABpgYAAACmBgKnBkAAAAABAgAAAEEAIGMAANEbACADAAAAPwAgYwAA0RsAIGQAANUbACARAAAAPwAgBwAAjg0AIAkAAI8NACAOAACNDQAgEAAApQ4AIFwAANUbACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGcBgEAsAwAIaMGAQCwDAAhpAYBALEMACGmBgAAiw2mBiKnBkAAyAwAIQ8HAACODQAgCQAAjw0AIA4AAI0NACAQAAClDgAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhnAYBALAMACGjBgEAsAwAIaQGAQCxDAAhpgYAAIsNpgYipwZAAMgMACESAwAAjA4AIAcAAIQOACAJAACLDgAgDQAAhQ4AICIAAIoOACAkAACHDgAgSgAAiA4AIEsAAIkOACDyBQEAAAAB8wUBAAAAAfQFAQAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABAgAAABAAIGMAANYbACADAAAADgAgYwAA1hsAIGQAANobACAUAAAADgAgAwAAuwwAIAcAALMMACAJAAC6DAAgDQAAtAwAICIAALkMACAkAAC2DAAgSgAAtwwAIEsAALgMACBcAADaGwAg8gUBALAMACHzBQEAsAwAIfQFAQCwDAAh9QUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALAMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACESAwAAuwwAIAcAALMMACAJAAC6DAAgDQAAtAwAICIAALkMACAkAAC2DAAgSgAAtwwAIEsAALgMACDyBQEAsAwAIfMFAQCwDAAh9AUBALAMACH1BQEAsAwAIfYFAQCxDAAh9wUBALAMACH4BQEAsAwAIfkFAQCwDAAh-gVAALIMACH7BUAAsgwAISAEAACuGAAgBQAArxgAIAYAALAYACAQAACxGAAgGQAAshgAIDQAALUYACBAAACzGAAgTAAAtBgAIE0AALYYACBPAAC4GAAgUAAAuRgAIFEAALoYACBSAAC7GAAgUwAAvBgAIFQAAL0YACBVAAC-GAAgVgAAvxgAIPIFAQAAAAH2BQEAAAAB-gVAAAAAAfsFQAAAAAHLBgEAAAABggcBAAAAAb4HAQAAAAG_ByAAAAABwAcBAAAAAcEHAQAAAAHCBwEAAAABwwcBAAAAAcQHAQAAAAHFBwEAAAABxgcBAAAAAQIAAADxAgAgYwAA2xsAIAMAAABRACBjAADbGwAgZAAA3xsAICIAAABRACAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBPAACBFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgVgAAiBcAIFwAAN8bACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACEgBAAA9xYAIAUAAPgWACAGAAD5FgAgEAAA-hYAIBkAAPsWACA0AAD-FgAgQAAA_BYAIEwAAP0WACBNAAD_FgAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACEgBAAArhgAIAUAAK8YACAGAACwGAAgGQAAshgAIDQAALUYACBAAACzGAAgTAAAtBgAIE0AALYYACBOAAC3GAAgTwAAuBgAIFAAALkYACBRAAC6GAAgUgAAuxgAIFMAALwYACBUAAC9GAAgVQAAvhgAIFYAAL8YACDyBQEAAAAB9gUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAYIHAQAAAAG-BwEAAAABvwcgAAAAAcAHAQAAAAHBBwEAAAABwgcBAAAAAcMHAQAAAAHEBwEAAAABxQcBAAAAAcYHAQAAAAECAAAA8QIAIGMAAOAbACAYCAAAzxYAIAwAAJQWACANAACMFgAgEQAAjRYAIBwAAJMWACAlAACJFgAgJwAAkhYAICoAAJUWACAuAACGFgAgLwAAhxYAIDAAAIgWACAyAACLFgAgNAAAjhYAIDUAAI8WACA2AACQFgAgNwAAkRYAIDgAAJYWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAHRBgEAAAAB4gYBAAAAAZEHAQAAAAGlBwEAAAABAgAAABoAIGMAAOIbACAhBgAAnxYAIAwAAK4WACANAACiFgAgEQAAoxYAIBwAAKoWACAlAACdFgAgJwAAqRYAICoAAK8WACAuAACaFgAgLwAAmxYAIDAAAJ4WACAyAAChFgAgNAAApRYAIDUAAKYWACA2AACnFgAgNwAAqBYAIDoAAJkWACA7AACcFgAgPwAArRYAIEAAAKQWACBBAACrFgAgQgAArBYAIEcAALAWACBIAACxFgAgSQAAshYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAaYGAAAAkwcDywYBAAAAAdEGAQAAAAGRBwEAAAABlAcBAAAAAQIAAAD0BAAgYwAA5BsAICEGAACfFgAgDAAArhYAIBEAAKMWACAcAACqFgAgJQAAnRYAICcAAKkWACAqAACvFgAgLgAAmhYAIC8AAJsWACAwAACeFgAgMQAAoBYAIDIAAKEWACA0AAClFgAgNQAAphYAIDYAAKcWACA3AACoFgAgOgAAmRYAIDsAAJwWACA_AACtFgAgQAAApBYAIEEAAKsWACBCAACsFgAgRwAAsBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAADmGwAgCQwAAK4QACAcAACyEAAgJQAArxAAICcAALEQACDyBQEAAAAB9wUBAAAAAcsGAQAAAAHMBkAAAAABzQZAAAAAAQIAAAD4BwAgYwAA6BsAIA4HAACBEQAgCQAAghEAIA8AAP8QACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAaMGAQAAAAHRBgEAAAAB2wYBAAAAAdwGQAAAAAHdBggAAAAB3gYIAAAAAQIAAAAfACBjAADqGwAgGAgAAM8WACAMAACUFgAgEQAAjRYAIBwAAJMWACAlAACJFgAgJwAAkhYAICoAAJUWACAuAACGFgAgLwAAhxYAIDAAAIgWACAxAACKFgAgMgAAixYAIDQAAI4WACA1AACPFgAgNgAAkBYAIDcAAJEWACA4AACWFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAeIGAQAAAAGRBwEAAAABpQcBAAAAAQIAAAAaACBjAADsGwAgEAcAAI0QACAJAACOEAAgEQAAixAAIBsAAL4QACAkAACMEAAgJgAAjxAAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAdEGAQAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAECAAAANwAgYwAA7hsAIA8DAACTDwAgBwAAkQ8AIAkAAJIPACATAACVDwAgGgAAlg8AIBwAAJcPACAiAACYDwAg8gUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAccGAQAAAAECAAAAnQEAIGMAAPAbACAOBwAA-xAAIAkAAPwQACAKAAD7EwAgEQAA_hAAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAd0GAgAAAAHjBgEAAAABpwcBAAAAAagHAQAAAAECAAAAIwAgYwAA8hsAIBgIAADPFgAgDAAAlBYAIA0AAIwWACARAACNFgAgHAAAkxYAICUAAIkWACAnAACSFgAgLgAAhhYAIC8AAIcWACAwAACIFgAgMQAAihYAIDIAAIsWACA0AACOFgAgNQAAjxYAIDYAAJAWACA3AACRFgAgOAAAlhYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHiBgEAAAABkQcBAAAAAaUHAQAAAAECAAAAGgAgYwAA9BsAICEGAACfFgAgDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgLgAAmhYAIC8AAJsWACAwAACeFgAgMQAAoBYAIDIAAKEWACA0AAClFgAgNQAAphYAIDYAAKcWACA3AACoFgAgOgAAmRYAIDsAAJwWACA_AACtFgAgQAAApBYAIEEAAKsWACBCAACsFgAgRwAAsBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAAD2GwAgCgcAAN4WACDyBQEAAAAB9wUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAakHAQAAAAGqBwEAAAABqwcCAAAAAa0HAAAArQcCAgAAAMoBACBjAAD4GwAgDgcAAKwQACAJAACtEAAgGwAAwxAAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAADYBgLLBgEAAAAB0QYBAAAAAdMGAQAAAAHVBgEAAAAB1gYBAAAAAQIAAAAzACBjAAD6GwAgAwAAABgAIGMAAPQbACBkAAD-GwAgGgAAABgAIAgAAM4WACAMAADnFAAgDQAA3xQAIBEAAOAUACAcAADmFAAgJQAA3BQAICcAAOUUACAuAADZFAAgLwAA2hQAIDAAANsUACAxAADdFAAgMgAA3hQAIDQAAOEUACA1AADiFAAgNgAA4xQAIDcAAOQUACA4AADpFAAgXAAA_hsAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh4gYBALEMACGRBwEAsQwAIaUHAQCwDAAhGAgAAM4WACAMAADnFAAgDQAA3xQAIBEAAOAUACAcAADmFAAgJQAA3BQAICcAAOUUACAuAADZFAAgLwAA2hQAIDAAANsUACAxAADdFAAgMgAA3hQAIDQAAOEUACA1AADiFAAgNgAA4xQAIDcAAOQUACA4AADpFAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHiBgEAsQwAIZEHAQCxDAAhpQcBALAMACEDAAAAFgAgYwAA9hsAIGQAAIEcACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAAIEcACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEDAAAAyAEAIGMAAPgbACBkAACEHAAgDAAAAMgBACAHAADdFgAgXAAAhBwAIPIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhywYBALEMACGpBwEAsAwAIaoHAQCwDAAhqwcCALkOACGtBwAAjxStByIKBwAA3RYAIPIFAQCwDAAh9wUBALAMACH6BUAAsgwAIfsFQACyDAAhywYBALEMACGpBwEAsAwAIaoHAQCwDAAhqwcCALkOACGtBwAAjxStByIDAAAAMQAgYwAA-hsAIGQAAIccACAQAAAAMQAgBwAAnRAAIAkAAJ4QACAbAADCEAAgXAAAhxwAIPIFAQCwDAAh9wUBALEMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGqBgAAmhDYBiLLBgEAsAwAIdEGAQCxDAAh0wYBALEMACHVBgEAsAwAIdYGAQCwDAAhDgcAAJ0QACAJAACeEAAgGwAAwhAAIPIFAQCwDAAh9wUBALEMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGqBgAAmhDYBiLLBgEAsAwAIdEGAQCxDAAh0wYBALEMACHVBgEAsAwAIdYGAQCwDAAhCvIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAdEGAQAAAAHYBgEAAAAB2QYBAAAAAdoGAQAAAAEF8gUBAAAAAfoFQAAAAAH7BUAAAAABqgYAAADJBwLHB0AAAAABEgMAAIwOACAHAACEDgAgCQAAiw4AIA0AAIUOACARAACGDgAgIgAAig4AICQAAIcOACBKAACIDgAg8gUBAAAAAfMFAQAAAAH0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-wVAAAAAAQIAAAAQACBjAACKHAAgAwAAAA4AIGMAAIocACBkAACOHAAgFAAAAA4AIAMAALsMACAHAACzDAAgCQAAugwAIA0AALQMACARAAC1DAAgIgAAuQwAICQAALYMACBKAAC3DAAgXAAAjhwAIPIFAQCwDAAh8wUBALAMACH0BQEAsAwAIfUFAQCwDAAh9gUBALEMACH3BQEAsAwAIfgFAQCwDAAh-QUBALAMACH6BUAAsgwAIfsFQACyDAAhEgMAALsMACAHAACzDAAgCQAAugwAIA0AALQMACARAAC1DAAgIgAAuQwAICQAALYMACBKAAC3DAAg8gUBALAMACHzBQEAsAwAIfQFAQCwDAAh9QUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALAMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACEDAAAAFgAgYwAA5hsAIGQAAJEcACAjAAAAFgAgBgAAmBIAIAwAAKcSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAAJEcACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_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_IFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABmgYBAAAAAZsGAQAAAAGeBgEAAAAB0wYBAAAAAeMGAQAAAAGmB0AAAAABGAgAAM8WACAMAACUFgAgDQAAjBYAIBwAAJMWACAlAACJFgAgJwAAkhYAICoAAJUWACAuAACGFgAgLwAAhxYAIDAAAIgWACAxAACKFgAgMgAAixYAIDQAAI4WACA1AACPFgAgNgAAkBYAIDcAAJEWACA4AACWFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAeIGAQAAAAGRBwEAAAABpQcBAAAAAQIAAAAaACBjAAClHAAgIQYAAJ8WACAMAACuFgAgDQAAohYAIBwAAKoWACAlAACdFgAgJwAAqRYAICoAAK8WACAuAACaFgAgLwAAmxYAIDAAAJ4WACAxAACgFgAgMgAAoRYAIDQAAKUWACA1AACmFgAgNgAApxYAIDcAAKgWACA6AACZFgAgOwAAnBYAID8AAK0WACBAAACkFgAgQQAAqxYAIEIAAKwWACBHAACwFgAgSAAAsRYAIEkAALIWACDyBQEAAAAB-gVAAAAAAfsFQAAAAAGmBgAAAJMHA8sGAQAAAAHRBgEAAAABkQcBAAAAAZQHAQAAAAECAAAA9AQAIGMAAKccACAOBwAA-xAAIAkAAPwQACAKAAD7EwAgDQAA_RAAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAAB0QYBAAAAAd0GAgAAAAHjBgEAAAABpwcBAAAAAagHAQAAAAECAAAAIwAgYwAAqRwAIBAHAACNEAAgCQAAjhAAIA0AAIoQACAbAAC-EAAgJAAAjBAAICYAAI8QACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAcsGAQAAAAHRBgEAAAAB0gYCAAAAAdMGAQAAAAHUBgEAAAABAgAAADcAIGMAAKscACADAAAAGAAgYwAApRwAIGQAAK8cACAaAAAAGAAgCAAAzhYAIAwAAOcUACANAADfFAAgHAAA5hQAICUAANwUACAnAADlFAAgKgAA6BQAIC4AANkUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgNwAA5BQAIDgAAOkUACBcAACvHAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHiBgEAsQwAIZEHAQCxDAAhpQcBALAMACEYCAAAzhYAIAwAAOcUACANAADfFAAgHAAA5hQAICUAANwUACAnAADlFAAgKgAA6BQAIC4AANkUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgNwAA5BQAIDgAAOkUACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAIeIGAQCxDAAhkQcBALEMACGlBwEAsAwAIQMAAAAWACBjAACnHAAgZAAAshwAICMAAAAWACAGAACYEgAgDAAApxIAIA0AAJsSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAgXAAAshwAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhIQYAAJgSACAMAACnEgAgDQAAmxIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAIQMAAAAhACBjAACpHAAgZAAAtRwAIBAAAAAhACAHAADkEAAgCQAA5RAAIAoAAPkTACANAADmEAAgXAAAtRwAIPIFAQCwDAAh9wUBALAMACH4BQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAId0GAgDmDwAh4wYBALEMACGnBwEAsAwAIagHAQCwDAAhDgcAAOQQACAJAADlEAAgCgAA-RMAIA0AAOYQACDyBQEAsAwAIfcFAQCwDAAh-AUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHdBgIA5g8AIeMGAQCxDAAhpwcBALAMACGoBwEAsAwAIQMAAAA1ACBjAACrHAAgZAAAuBwAIBIAAAA1ACAHAADrDwAgCQAA7A8AIA0AAOgPACAbAAC9EAAgJAAA6g8AICYAAO0PACBcAAC4HAAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAh0QYBALEMACHSBgIA5g8AIdMGAQCwDAAh1AYBALEMACEQBwAA6w8AIAkAAOwPACANAADoDwAgGwAAvRAAICQAAOoPACAmAADtDwAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAh0QYBALEMACHSBgIA5g8AIdMGAQCwDAAh1AYBALEMACEH8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGaBgEAAAABmwYBAAAAARgIAADPFgAgDAAAlBYAIA0AAIwWACARAACNFgAgHAAAkxYAICUAAIkWACAnAACSFgAgKgAAlRYAIC4AAIYWACAvAACHFgAgMAAAiBYAIDEAAIoWACAyAACLFgAgNAAAjhYAIDYAAJAWACA3AACRFgAgOAAAlhYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHiBgEAAAABkQcBAAAAAaUHAQAAAAECAAAAGgAgYwAAuhwAICEGAACfFgAgDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDYAAKcWACA3AACoFgAgOgAAmRYAIDsAAJwWACA_AACtFgAgQAAApBYAIEEAAKsWACBCAACsFgAgRwAAsBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAAC8HAAgEAcAAI0QACAJAACOEAAgDQAAihAAIBEAAIsQACAbAAC-EAAgJgAAjxAAIPIFAQAAAAH3BQEAAAAB-AUBAAAAAfoFQAAAAAH7BUAAAAABywYBAAAAAdEGAQAAAAHSBgIAAAAB0wYBAAAAAdQGAQAAAAECAAAANwAgYwAAvhwAIBgIAADPFgAgDAAAlBYAIA0AAIwWACARAACNFgAgHAAAkxYAICUAAIkWACAnAACSFgAgKgAAlRYAIC4AAIYWACAvAACHFgAgMAAAiBYAIDEAAIoWACAyAACLFgAgNAAAjhYAIDUAAI8WACA3AACRFgAgOAAAlhYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHiBgEAAAABkQcBAAAAAaUHAQAAAAECAAAAGgAgYwAAwBwAICEGAACfFgAgDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDUAAKYWACA3AACoFgAgOgAAmRYAIDsAAJwWACA_AACtFgAgQAAApBYAIEEAAKsWACBCAACsFgAgRwAAsBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAADCHAAgDwMAAJMPACAHAACRDwAgCQAAkg8AIA0AAJQPACAaAACWDwAgHAAAlw8AICIAAJgPACDyBQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFQAAAAAH7BUAAAAABxwYBAAAAAQIAAACdAQAgYwAAxBwAIAMAAAAYACBjAADAHAAgZAAAyBwAIBoAAAAYACAIAADOFgAgDAAA5xQAIA0AAN8UACARAADgFAAgHAAA5hQAICUAANwUACAnAADlFAAgKgAA6BQAIC4AANkUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA3AADkFAAgOAAA6RQAIFwAAMgcACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAIeIGAQCxDAAhkQcBALEMACGlBwEAsAwAIRgIAADOFgAgDAAA5xQAIA0AAN8UACARAADgFAAgHAAA5hQAICUAANwUACAnAADlFAAgKgAA6BQAIC4AANkUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA3AADkFAAgOAAA6RQAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh4gYBALEMACGRBwEAsQwAIaUHAQCwDAAhAwAAABYAIGMAAMIcACBkAADLHAAgIwAAABYAIAYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACBcAADLHAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEhBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhAwAAAFMAIGMAAMQcACBkAADOHAAgEQAAAFMAIAMAAMMOACAHAADBDgAgCQAAwg4AIA0AAMQOACAaAADGDgAgHAAAxw4AICIAAMgOACBcAADOHAAg8gUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALEMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACHHBgEAsAwAIQ8DAADDDgAgBwAAwQ4AIAkAAMIOACANAADEDgAgGgAAxg4AIBwAAMcOACAiAADIDgAg8gUBALAMACH2BQEAsQwAIfcFAQCwDAAh-AUBALEMACH5BQEAsAwAIfoFQACyDAAh-wVAALIMACHHBgEAsAwAIQryBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZ4GAQAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBkAAAAABAwAAABgAIGMAALocACBkAADSHAAgGgAAABgAIAgAAM4WACAMAADnFAAgDQAA3xQAIBEAAOAUACAcAADmFAAgJQAA3BQAICcAAOUUACAqAADoFAAgLgAA2RQAIC8AANoUACAwAADbFAAgMQAA3RQAIDIAAN4UACA0AADhFAAgNgAA4xQAIDcAAOQUACA4AADpFAAgXAAA0hwAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh4gYBALEMACGRBwEAsQwAIaUHAQCwDAAhGAgAAM4WACAMAADnFAAgDQAA3xQAIBEAAOAUACAcAADmFAAgJQAA3BQAICcAAOUUACAqAADoFAAgLgAA2RQAIC8AANoUACAwAADbFAAgMQAA3RQAIDIAAN4UACA0AADhFAAgNgAA4xQAIDcAAOQUACA4AADpFAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHiBgEAsQwAIZEHAQCxDAAhpQcBALAMACEDAAAAFgAgYwAAvBwAIGQAANUcACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAANUcACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_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-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTgAAgBcAIE8AAIEXACBQAACCFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAgXAAA7BwAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE4AAIAXACBPAACBFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgVgAAiBcAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAIQMAAABRACBjAADgHAAgZAAA7xwAICIAAABRACAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFQAAIYXACBVAACHFwAgVgAAiBcAIFwAAO8cACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACEgBAAA9xYAIAUAAPgWACAGAAD5FgAgEAAA-hYAIBkAAPsWACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACEDAAAA4wYAIGMAAOIcACBkAADyHAAgDgAAAOMGACBcAADyHAAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIaMGAQCwDAAh3wYBALEMACHgBgEAsAwAIeEGAACXEQAg4gYBALEMACHjBgEAsQwAIeQGAQCwDAAhDPIFAQCwDAAh9wUBALAMACH4BQEAsQwAIfoFQACyDAAh-wVAALIMACGjBgEAsAwAId8GAQCxDAAh4AYBALAMACHhBgAAlxEAIOIGAQCxDAAh4wYBALEMACHkBgEAsAwAIQ3yBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAYcGAQAAAAGoBgEAAAABqgYAAACqBgKrBgEAAAABrAZAAAAAAa0GQAAAAAGuBgEAAAABrwYBAAAAARgIAADPFgAgDAAAlBYAIA0AAIwWACARAACNFgAgHAAAkxYAICUAAIkWACAnAACSFgAgKgAAlRYAIC4AAIYWACAvAACHFgAgMAAAiBYAIDEAAIoWACAyAACLFgAgNAAAjhYAIDUAAI8WACA2AACQFgAgOAAAlhYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHiBgEAAAABkQcBAAAAAaUHAQAAAAECAAAAGgAgYwAA9BwAICEGAACfFgAgDAAArhYAIA0AAKIWACARAACjFgAgHAAAqhYAICUAAJ0WACAnAACpFgAgKgAArxYAIC4AAJoWACAvAACbFgAgMAAAnhYAIDEAAKAWACAyAAChFgAgNAAApRYAIDUAAKYWACA2AACnFgAgOgAAmRYAIDsAAJwWACA_AACtFgAgQAAApBYAIEEAAKsWACBCAACsFgAgRwAAsBYAIEgAALEWACBJAACyFgAg8gUBAAAAAfoFQAAAAAH7BUAAAAABpgYAAACTBwPLBgEAAAAB0QYBAAAAAZEHAQAAAAGUBwEAAAABAgAAAPQEACBjAAD2HAAgFgcAAIMOACAJAACADgAgCgAAgQ4AIAsAAPoNACAOAAD_DQAgDwAA_Q0AIBAAAJAPACAZAAD-DQAgGwAAgg4AICwAAPsNACDyBQEAAAAB9wUBAAAAAfgFAQAAAAH6BUAAAAAB-wVAAAAAAZoGAQAAAAGbBgEAAAABnAYBAAAAAZ4GAQAAAAHTBgEAAAAB4wYBAAAAAaYHQAAAAAECAAAAKAAgYwAA-BwAIAMAAAAYACBjAAD0HAAgZAAA_BwAIBoAAAAYACAIAADOFgAgDAAA5xQAIA0AAN8UACARAADgFAAgHAAA5hQAICUAANwUACAnAADlFAAgKgAA6BQAIC4AANkUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgOAAA6RQAIFwAAPwcACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACHRBgEAsQwAIeIGAQCxDAAhkQcBALEMACGlBwEAsAwAIRgIAADOFgAgDAAA5xQAIA0AAN8UACARAADgFAAgHAAA5hQAICUAANwUACAnAADlFAAgKgAA6BQAIC4AANkUACAvAADaFAAgMAAA2xQAIDEAAN0UACAyAADeFAAgNAAA4RQAIDUAAOIUACA2AADjFAAgOAAA6RQAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh4gYBALEMACGRBwEAsQwAIaUHAQCwDAAhAwAAABYAIGMAAPYcACBkAAD_HAAgIwAAABYAIAYAAJgSACAMAACnEgAgDQAAmxIAIBEAAJwSACAcAACjEgAgJQAAlhIAICcAAKISACAqAACoEgAgLgAAkxIAIC8AAJQSACAwAACXEgAgMQAAmRIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIEkAAKsSACBcAAD_HAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEhBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIaYGAAD3EZMHI8sGAQCwDAAh0QYBALEMACGRBwEAsQwAIZQHAQCxDAAhAwAAACYAIGMAAPgcACBkAACCHQAgGAAAACYAIAcAANANACAJAADNDQAgCgAAzg0AIAsAAMcNACAOAADMDQAgDwAAyg0AIBAAAI4PACAZAADLDQAgGwAAzw0AICwAAMgNACBcAACCHQAg8gUBALAMACH3BQEAsAwAIfgFAQCxDAAh-gVAALIMACH7BUAAsgwAIZoGAQCwDAAhmwYBALAMACGcBgEAsAwAIZ4GAQCwDAAh0wYBALAMACHjBgEAsQwAIaYHQACyDAAhFgcAANANACAJAADNDQAgCgAAzg0AIAsAAMcNACAOAADMDQAgDwAAyg0AIBAAAI4PACAZAADLDQAgGwAAzw0AICwAAMgNACDyBQEAsAwAIfcFAQCwDAAh-AUBALEMACH6BUAAsgwAIfsFQACyDAAhmgYBALAMACGbBgEAsAwAIZwGAQCwDAAhngYBALAMACHTBgEAsAwAIeMGAQCxDAAhpgdAALIMACET8gUBAAAAAfcFAQAAAAH4BQEAAAAB-gVAAAAAAfsFQAAAAAGwBgEAAAABsQYIAAAAAbIGCAAAAAGzBggAAAABtAYIAAAAAbUGCAAAAAG2BggAAAABtwYIAAAAAbgGCAAAAAG5BggAAAABugYIAAAAAbsGCAAAAAG8BggAAAABvQYIAAAAARgIAADPFgAgDAAAlBYAIA0AAIwWACARAACNFgAgHAAAkxYAICUAAIkWACAnAACSFgAgKgAAlRYAIC4AAIYWACAvAACHFgAgMAAAiBYAIDEAAIoWACAyAACLFgAgNAAAjhYAIDUAAI8WACA2AACQFgAgNwAAkRYAIPIFAQAAAAH6BUAAAAAB-wVAAAAAAdEGAQAAAAHiBgEAAAABkQcBAAAAAaUHAQAAAAECAAAAGgAgYwAAhB0AIA8DAACTDwAgBwAAkQ8AIAkAAJIPACANAACUDwAgEwAAlQ8AIBoAAJYPACAcAACXDwAg8gUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BUAAAAAB-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-RYAIBAAAPoWACAZAAD7FgAgNAAA_hYAIEAAAPwWACBMAAD9FgAgTQAA_xYAIE4AAIAXACBPAACBFwAgUAAAghcAIFEAAIMXACBSAACEFwAgUwAAhRcAIFUAAIcXACBWAACIFwAgXAAAmB0AIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAISAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBVAACHFwAgVgAAiBcAIPIFAQCwDAAh9gUBALEMACH6BUAAsgwAIfsFQACyDAAhywYBALAMACGCBwEAsAwAIb4HAQCwDAAhvwcgAJIOACHABwEAsQwAIcEHAQCxDAAhwgcBALEMACHDBwEAsQwAIcQHAQCxDAAhxQcBALEMACHGBwEAsAwAIQMAAABRACBjAACKHQAgZAAAmx0AICIAAABRACAEAAD3FgAgBQAA-BYAIAYAAPkWACAQAAD6FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFQAAIYXACBVAACHFwAgVgAAiBcAIFwAAJsdACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACEgBAAA9xYAIAUAAPgWACAGAAD5FgAgEAAA-hYAIBkAAPsWACA0AAD-FgAgQAAA_BYAIEwAAP0WACBNAAD_FgAgTgAAgBcAIE8AAIEXACBQAACCFwAgUQAAgxcAIFIAAIQXACBUAACGFwAgVQAAhxcAIFYAAIgXACDyBQEAsAwAIfYFAQCxDAAh-gVAALIMACH7BUAAsgwAIcsGAQCwDAAhggcBALAMACG-BwEAsAwAIb8HIACSDgAhwAcBALEMACHBBwEAsQwAIcIHAQCxDAAhwwcBALEMACHEBwEAsQwAIcUHAQCxDAAhxgcBALAMACEDAAAAFgAgYwAAjB0AIGQAAJ4dACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSAAAqhIAIFwAAJ4dACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEDAAAAFgAgYwAAjh0AIGQAAKEdACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAxAACZEgAgMgAAmhIAIDQAAJ4SACA1AACfEgAgNgAAoBIAIDcAAKESACA6AACSEgAgOwAAlRIAID8AAKYSACBAAACdEgAgQQAApBIAIEIAAKUSACBHAACpEgAgSQAAqxIAIFwAAKEdACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDEAAJkSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBJAACrEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACEP8gUBAAAAAfoFQAAAAAH7BUAAAAABngYBAAAAAaoGAAAAiAcCrAZAAAAAAa8GAQAAAAGGBwAAAIYHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAEDAAAAUQAgYwAA4BsAIGQAAKUdACAiAAAAUQAgBAAA9xYAIAUAAPgWACAGAAD5FgAgGQAA-xYAIDQAAP4WACBAAAD8FgAgTAAA_RYAIE0AAP8WACBOAACAFwAgTwAAgRcAIFAAAIIXACBRAACDFwAgUgAAhBcAIFMAAIUXACBUAACGFwAgVQAAhxcAIFYAAIgXACBcAAClHQAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhIAQAAPcWACAFAAD4FgAgBgAA-RYAIBkAAPsWACA0AAD-FgAgQAAA_BYAIEwAAP0WACBNAAD_FgAgTgAAgBcAIE8AAIEXACBQAACCFwAgUQAAgxcAIFIAAIQXACBTAACFFwAgVAAAhhcAIFUAAIcXACBWAACIFwAg8gUBALAMACH2BQEAsQwAIfoFQACyDAAh-wVAALIMACHLBgEAsAwAIYIHAQCwDAAhvgcBALAMACG_ByAAkg4AIcAHAQCxDAAhwQcBALEMACHCBwEAsQwAIcMHAQCxDAAhxAcBALEMACHFBwEAsQwAIcYHAQCwDAAhAwAAABgAIGMAAOIbACBkAACoHQAgGgAAABgAIAgAAM4WACAMAADnFAAgDQAA3xQAIBEAAOAUACAcAADmFAAgJQAA3BQAICcAAOUUACAqAADoFAAgLgAA2RQAIC8AANoUACAwAADbFAAgMgAA3hQAIDQAAOEUACA1AADiFAAgNgAA4xQAIDcAAOQUACA4AADpFAAgXAAAqB0AIPIFAQCwDAAh-gVAALIMACH7BUAAsgwAIdEGAQCxDAAh4gYBALEMACGRBwEAsQwAIaUHAQCwDAAhGAgAAM4WACAMAADnFAAgDQAA3xQAIBEAAOAUACAcAADmFAAgJQAA3BQAICcAAOUUACAqAADoFAAgLgAA2RQAIC8AANoUACAwAADbFAAgMgAA3hQAIDQAAOEUACA1AADiFAAgNgAA4xQAIDcAAOQUACA4AADpFAAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAh0QYBALEMACHiBgEAsQwAIZEHAQCxDAAhpQcBALAMACEDAAAAFgAgYwAA5BsAIGQAAKsdACAjAAAAFgAgBgAAmBIAIAwAAKcSACANAACbEgAgEQAAnBIAIBwAAKMSACAlAACWEgAgJwAAohIAICoAAKgSACAuAACTEgAgLwAAlBIAIDAAAJcSACAyAACaEgAgNAAAnhIAIDUAAJ8SACA2AACgEgAgNwAAoRIAIDoAAJISACA7AACVEgAgPwAAphIAIEAAAJ0SACBBAACkEgAgQgAApRIAIEcAAKkSACBIAACqEgAgSQAAqxIAIFwAAKsdACDyBQEAsAwAIfoFQACyDAAh-wVAALIMACGmBgAA9xGTByPLBgEAsAwAIdEGAQCxDAAhkQcBALEMACGUBwEAsQwAISEGAACYEgAgDAAApxIAIA0AAJsSACARAACcEgAgHAAAoxIAICUAAJYSACAnAACiEgAgKgAAqBIAIC4AAJMSACAvAACUEgAgMAAAlxIAIDIAAJoSACA0AACeEgAgNQAAnxIAIDYAAKASACA3AAChEgAgOgAAkhIAIDsAAJUSACA_AACmEgAgQAAAnRIAIEEAAKQSACBCAAClEgAgRwAAqRIAIEgAAKoSACBJAACrEgAg8gUBALAMACH6BUAAsgwAIfsFQACyDAAhpgYAAPcRkwcjywYBALAMACHRBgEAsQwAIZEHAQCxDAAhlAcBALEMACECAwACBwAGEwQGAwUKBAYNARARBRUAPBmjAhM0pgIpQKQCLkylAi5NpwIpTqkCOU-qAhRQqwIUUa0COlKxAjtTsgIaVLMCGlW0AjNWtQI1AQMAAgEDAAIKAwACBwAGCQAIDZcCCxGYAhAVADginAIaJJkCEUqaAilLmwIlGwbOAQEM7AENDdEBCxHSARAVADcc5AEXJcwBDyfjARgq7QEMLsYBCS_HAR0wzQEKMc8BBTLQARM03wEpNeABETbhARI34gElOhUHO8sBIj_rAS9A1gEuQeYBMULqATJH8QEzSPwBGkn9ARoDBxcGFQAtORsIEwgcBwyxAQ0NnwELEaABEBUALBywARclmgEPJ68BGCqyAQwuIAkvmAEdMJkBCjGbAQUyngETNKQBKTWqARE2qwESN64BJTizARoFBwAGCQAIDZMBCw8kChUAKAYHAAYJAAgKJQkNKQsRkAEQFQAnDAcABgmMAQgKjQEJCy0MDgAPDwAKEAAFFQAmGQATGwAOLIgBJC2KASUFB4MBBgmEAQgoAA0pAAsrACIFB34GCX8ICy4MFQAhGzAOBgw0DQ1zCxUAIBx4FyU4Dyd3GAgHAAYJaggNOQsRPRAVAB8bAA4kQhEmbB0FBwAGCT4IDgAPDwAKEAAFBgcABglDCA4ADxAABRUAHCNHEgQHAAYJaAgSABEZABMJAwACBwAGCUgIDUkLE0oSFQAbGk4UHFgXIl4aBBYAFRcAAhhSAhlUEwIUTxQVABYBFFAABQcABgkACBkAExsADh0AGAUHAAYJAAgVABkbAA4cWRcBHFoABxBhBRhfAhlgEx4ABh8ABiAAAiFiCAUNYwATZAAaZQAcZgAiZwABI2kABAcABgltCBUAHiVuDwElbwADDXAAEXEAJHIABQx5AA17ABx9ACV6ACd8AAELgAEAAwcABhUAIyqBAQwBKoIBAAEpAAsEBwAGCYsBCBAABSkACwILjgEALI8BAAINkQEAEZIBAAINlQEAD5QBAAYHAAYJqQEIEKgBBRYAKhinAQIzAAICFKUBKRUAKwEUpgEAEQzCAQANugEAEbsBABzBAQAltwEAJ8ABACrDAQAutAEAL7UBADC2AQAxuAEAMrkBADS8AQA1vQEANr4BADe_AQA4xAEAATnFAQAFB9gBBhUAMDwAAj3XAQI_3AEvAgcABj7dAS4BP94BAAEHAAYBBwAGBQcABhUANkMAAkX1ATRG-QE1AUQAMwIDAAJEADMCRfoBAEb7AQAZBoQCAAySAgANhwIAEYgCAByPAgAlggIAJ44CACqTAgAu_wEAL4ACADCDAgAxhQIAMoYCADSKAgA1iwIANowCADeNAgA6_gEAO4ECAD-RAgBAiQIAQpACAEeUAgBIlQIASZYCAAYNnQIAEZ4CACKiAgAknwIASqACAEuhAgABMwACARcAAgEDAAIQBLYCAAW3AgAGuAIAELkCABm6AgA0vQIAQLsCAEy8AgBNvgIAT78CAFDAAgBSwQIAU8ICAFTDAgBVxAIAVsUCAAACAwACBwAGAgMAAgcABgMVAEFpAEJqAEMAAAADFQBBaQBCagBDASkACwEpAAsDFQBIaQBJagBKAAAAAxUASGkASWoASgAAAxUAT2kAUGoAUQAAAAMVAE9pAFBqAFEBAwACAQMAAgMVAFZpAFdqAFgAAAADFQBWaQBXagBYAQMAAgEDAAIDFQBdaQBeagBfAAAAAxUAXWkAXmoAXwAAAAMVAGVpAGZqAGcAAAADFQBlaQBmagBnAQMAAgEDAAIDFQBsaQBtagBuAAAAAxUAbGkAbWoAbgIHAAYJ7gMIAgcABgn0AwgDFQBzaQB0agB1AAAAAxUAc2kAdGoAdQEHAAYBBwAGBRUAemkAfWoAfusBAHvsAQB8AAAAAAAFFQB6aQB9agB-6wEAe-wBAHwDBwAGCQAICpwECQMHAAYJAAgKogQJBRUAgwFpAIYBagCHAesBAIQB7AEAhQEAAAAAAAUVAIMBaQCGAWoAhwHrAQCEAewBAIUBCAcABgm0BAgKtQQJDgAPDwAKEAAFGQATGwAOCAcABgm7BAgKvAQJDgAPDwAKEAAFGQATGwAOAxUAjAFpAI0BagCOAQAAAAMVAIwBaQCNAWoAjgEBCM4EBwEI1AQHAxUAkwFpAJQBagCVAQAAAAMVAJMBaQCUAWoAlQEBB-YEBgEH7AQGAxUAmgFpAJsBagCcAQAAAAMVAJoBaQCbAWoAnAEAAAMVAKEBaQCiAWoAowEAAAADFQChAWkAogFqAKMBAweXBQY8AAI9lgUCAweeBQY8AAI9nQUCBRUAqAFpAKsBagCsAesBAKkB7AEAqgEAAAAAAAUVAKgBaQCrAWoArAHrAQCpAewBAKoBBxCyBQUYsAUCGbEFEx4ABh8ABiAAAiGzBQgHELsFBRi5BQIZugUTHgAGHwAGIAACIbwFCAMVALEBaQCyAWoAswEAAAADFQCxAWkAsgFqALMBAgcABkMAAgIHAAZDAAIDFQC4AWkAuQFqALoBAAAAAxUAuAFpALkBagC6AQFEADMBRAAzAxUAvwFpAMABagDBAQAAAAMVAL8BaQDAAWoAwQECAwACRAAzAgMAAkQAMwMVAMYBaQDHAWoAyAEAAAADFQDGAWkAxwFqAMgBAwcABgkACBsADgMHAAYJAAgbAA4FFQDNAWkA0AFqANEB6wEAzgHsAQDPAQAAAAAABRUAzQFpANABagDRAesBAM4B7AEAzwEFBwAGCQAIGQATGwAOHQAYBQcABgkACBkAExsADh0AGAUVANYBaQDZAWoA2gHrAQDXAewBANgBAAAAAAAFFQDWAWkA2QFqANoB6wEA1wHsAQDYAQEHAAYBBwAGAxUA3wFpAOABagDhAQAAAAMVAN8BaQDgAWoA4QEBBwAGAQcABgUVAOYBaQDpAWoA6gHrAQDnAewBAOgBAAAAAAAFFQDmAWkA6QFqAOoB6wEA5wHsAQDoAQAAAxUA7wFpAPABagDxAQAAAAMVAO8BaQDwAWoA8QEAAAMVAPYBaQD3AWoA-AEAAAADFQD2AWkA9wFqAPgBAgcABgkACAIHAAYJAAgFFQD9AWkAgAJqAIEC6wEA_gHsAQD_AQAAAAAABRUA_QFpAIACagCBAusBAP4B7AEA_wEFB7IHBgmzBwgoAA0pAAsrACIFB7kHBgm6BwgoAA0pAAsrACIDFQCGAmkAhwJqAIgCAAAAAxUAhgJpAIcCagCIAgMHzQcGCc4HCBvMBw4DB9UHBgnWBwgb1AcOAxUAjQJpAI4CagCPAgAAAAMVAI0CaQCOAmoAjwIEBwAGCegHCBsADibpBx0EBwAGCe8HCBsADibwBx0FFQCUAmkAlwJqAJgC6wEAlQLsAQCWAgAAAAAABRUAlAJpAJcCagCYAusBAJUC7AEAlgIAAAMVAJ0CaQCeAmoAnwIAAAADFQCdAmkAngJqAJ8CARcAAgEXAAIDFQCkAmkApQJqAKYCAAAAAxUApAJpAKUCagCmAgQWABUXAAIYsggCGbMIEwQWABUXAAIYuQgCGboIEwMVAKsCaQCsAmoArQIAAAADFQCrAmkArAJqAK0CAwMAAgcABgnMCAgDAwACBwAGCdIICAMVALICaQCzAmoAtAIAAAADFQCyAmkAswJqALQCAgcABj7kCC4CBwAGPuoILgUVALkCaQC8AmoAvQLrAQC6AuwBALsCAAAAAAAFFQC5AmkAvAJqAL0C6wEAugLsAQC7AgQHAAYJ_AgIEAAFKQALBAcABgmCCQgQAAUpAAsFFQDCAmkAxQJqAMYC6wEAwwLsAQDEAgAAAAAABRUAwgJpAMUCagDGAusBAMMC7AEAxAIGBwAGCZYJCBCVCQUWACoYlAkCMwACBgcABgmeCQgQnQkFFgAqGJwJAjMAAgMVAMsCaQDMAmoAzQIAAAADFQDLAmkAzAJqAM0CBAcABgmwCQgOAA8QAAUEBwAGCbYJCA4ADxAABQMVANICaQDTAmoA1AIAAAADFQDSAmkA0wJqANQCBAcABgnICQgSABEZABMEBwAGCc4JCBIAERkAEwMVANkCaQDaAmoA2wIAAAADFQDZAmkA2gJqANsCBQcABgngCQgOAA8PAAoQAAUFBwAGCeYJCA4ADw8AChAABQMVAOACaQDhAmoA4gIAAAADFQDgAmkA4QJqAOICATMAAgEzAAIDFQDnAmkA6AJqAOkCAAAAAxUA5wJpAOgCagDpAgMDAAIHAAYJAAgDAwACBwAGCQAIAxUA7gJpAO8CagDwAgAAAAMVAO4CaQDvAmoA8AJXAgFYxgIBWccCAVrIAgFbyQIBXcsCAV7NAj1fzgI-YNACAWHSAj1i0wI_ZdQCAWbVAgFn1gI9a9kCQGzaAkRt2wIkbtwCJG_dAiRw3gIkcd8CJHLhAiRz4wI9dOQCRXXmAiR26AI9d-kCRnjqAiR56wIkeuwCPXvvAkd88AJLffICAn7zAgJ_9QICgAH2AgKBAfcCAoIB-QICgwH7Aj2EAfwCTIUB_gIChgGAAz2HAYEDTYgBggMCiQGDAwKKAYQDPYsBhwNOjAGIA1KNAYkDA44BigMDjwGLAwOQAYwDA5EBjQMDkgGPAwOTAZEDPZQBkgNTlQGUAwOWAZYDPZcBlwNUmAGYAwOZAZkDA5oBmgM9mwGdA1WcAZ4DWZ0BnwMEngGgAwSfAaEDBKABogMEoQGjAwSiAaUDBKMBpwM9pAGoA1qlAaoDBKYBrAM9pwGtA1uoAa4DBKkBrwMEqgGwAz2rAbMDXKwBtANgrQG2A2GuAbcDYa8BugNhsAG7A2GxAbwDYbIBvgNhswHAAz20AcEDYrUBwwNhtgHFAz23AcYDY7gBxwNhuQHIA2G6AckDPbsBzANkvAHNA2i9Ac4DO74BzwM7vwHQAzvAAdEDO8EB0gM7wgHUAzvDAdYDPcQB1wNpxQHZAzvGAdsDPccB3ANqyAHdAzvJAd4DO8oB3wM9ywHiA2vMAeMDb80B5AMdzgHlAx3PAeYDHdAB5wMd0QHoAx3SAeoDHdMB7AM91AHtA3DVAfADHdYB8gM91wHzA3HYAfUDHdkB9gMd2gH3Az3bAfoDctwB-wN23QH8AyLeAf0DIt8B_gMi4AH_AyLhAYAEIuIBggQi4wGEBD3kAYUEd-UBhwQi5gGJBD3nAYoEeOgBiwQi6QGMBCLqAY0EPe0BkAR57gGRBH_vAZIECvABkwQK8QGUBAryAZUECvMBlgQK9AGYBAr1AZoEPfYBmwSAAfcBngQK-AGgBD35AaEEgQH6AaMECvsBpAQK_AGlBD39AagEggH-AakEiAH_AaoEC4ACqwQLgQKsBAuCAq0EC4MCrgQLhAKwBAuFArIEPYYCswSJAYcCtwQLiAK5BD2JAroEigGKAr0EC4sCvgQLjAK_BD2NAsIEiwGOAsMEjwGPAsQECJACxQQIkQLGBAiSAscECJMCyAQIlALKBAiVAswEPZYCzQSQAZcC0AQImALSBD2ZAtMEkQGaAtUECJsC1gQInALXBD2dAtoEkgGeAtsElgGfAtwEB6AC3QQHoQLeBAeiAt8EB6MC4AQHpALiBAelAuQEPaYC5QSXAacC6AQHqALqBD2pAusEmAGqAu0EB6sC7gQHrALvBD2tAvIEmQGuAvMEnQGvAvUEBrAC9gQGsQL4BAayAvkEBrMC-gQGtAL8BAa1Av4EPbYC_wSeAbcCgQUGuAKDBT25AoQFnwG6AoUFBrsChgUGvAKHBT29AooFoAG-AosFpAG_AowFLsACjQUuwQKOBS7CAo8FLsMCkAUuxAKSBS7FApQFPcYClQWlAccCmQUuyAKbBT3JApwFpgHKAp8FLssCoAUuzAKhBT3NAqQFpwHOAqUFrQHPAqYFGtACpwUa0QKoBRrSAqkFGtMCqgUa1AKsBRrVAq4FPdYCrwWuAdcCtQUa2AK3BT3ZArgFrwHaAr0FGtsCvgUa3AK_BT3dAsIFsAHeAsMFtAHfAsQFM-ACxQUz4QLGBTPiAscFM-MCyAUz5ALKBTPlAswFPeYCzQW1AecCzwUz6ALRBT3pAtIFtgHqAtMFM-sC1AUz7ALVBT3tAtgFtwHuAtkFuwHvAtoFNPAC2wU08QLcBTTyAt0FNPMC3gU09ALgBTT1AuIFPfYC4wW8AfcC5QU0-ALnBT35AugFvQH6AukFNPsC6gU0_ALrBT39Au4FvgH-Au8FwgH_AvAFNYAD8QU1gQPyBTWCA_MFNYMD9AU1hAP2BTWFA_gFPYYD-QXDAYcD-wU1iAP9BT2JA_4FxAGKA_8FNYsDgAY1jAOBBj2NA4QGxQGOA4UGyQGPA4YGGJADhwYYkQOIBhiSA4kGGJMDigYYlAOMBhiVA44GPZYDjwbKAZcDkQYYmAOTBj2ZA5QGywGaA5UGGJsDlgYYnAOXBj2dA5oGzAGeA5sG0gGfA5wGF6ADnQYXoQOeBheiA58GF6MDoAYXpAOiBhelA6QGPaYDpQbTAacDpwYXqAOpBj2pA6oG1AGqA6sGF6sDrAYXrAOtBj2tA7AG1QGuA7EG2wGvA7MGMbADtAYxsQO2BjGyA7cGMbMDuAYxtAO6BjG1A7wGPbYDvQbcAbcDvwYxuAPBBj25A8IG3QG6A8MGMbsDxAYxvAPFBj29A8gG3gG-A8kG4gG_A8oGMsADywYywQPMBjLCA80GMsMDzgYyxAPQBjLFA9IGPcYD0wbjAccD1QYyyAPXBj3JA9gG5AHKA9kGMssD2gYyzAPbBj3NA94G5QHOA98G6wHPA-EGKtAD4gYq0QPlBirSA-YGKtMD5wYq1APpBirVA-sGPdYD7AbsAdcD7gYq2APwBj3ZA_EG7QHaA_IGKtsD8wYq3AP0Bj3dA_cG7gHeA_gG8gHfA_oGFeAD-wYV4QP-BhXiA_8GFeMDgAcV5AOCBxXlA4QHPeYDhQfzAecDhwcV6AOJBz3pA4oH9AHqA4sHFesDjAcV7AONBz3tA5AH9QHuA5EH-QHvA5IHCfADkwcJ8QOUBwnyA5UHCfMDlgcJ9AOYBwn1A5oHPfYDmwf6AfcDnQcJ-AOfBz35A6AH-wH6A6EHCfsDogcJ_AOjBz39A6YH_AH-A6cHggL_A6gHDIAEqQcMgQSqBwyCBKsHDIMErAcMhASuBwyFBLAHPYYEsQeDAocEtQcMiAS3Bz2JBLgHhAKKBLsHDIsEvAcMjAS9Bz2NBMAHhQKOBMEHiQKPBMIHDZAEwwcNkQTEBw2SBMUHDZMExgcNlATIBw2VBMoHPZYEyweKApcE0AcNmATSBz2ZBNMHiwKaBNcHDZsE2AcNnATZBz2dBNwHjAKeBN0HkAKfBN4HD6AE3wcPoQTgBw-iBOEHD6ME4gcPpATkBw-lBOYHPaYE5weRAqcE6wcPqATtBz2pBO4HkgKqBPEHD6sE8gcPrATzBz2tBPYHkwKuBPcHmQKvBPkHDrAE-gcOsQT8Bw6yBP0HDrME_gcOtASACA61BIIIPbYEgwiaArcEhQgOuASHCD25BIgImwK6BIkIDrsEiggOvASLCD29BI4InAK-BI8IoAK_BJEIOsAEkgg6wQSUCDrCBJUIOsMElgg6xASYCDrFBJoIPcYEmwihAscEnQg6yASfCD3JBKAIogLKBKEIOssEogg6zASjCD3NBKYIowLOBKcIpwLPBKgIFNAEqQgU0QSqCBTSBKsIFNMErAgU1ASuCBTVBLAIPdYEsQioAtcEtQgU2AS3CD3ZBLgIqQLaBLsIFNsEvAgU3AS9CD3dBMAIqgLeBMEIrgLfBMIIE-AEwwgT4QTECBPiBMUIE-MExggT5ATICBPlBMoIPeYEywivAucEzggT6ATQCD3pBNEIsALqBNMIE-sE1AgT7ATVCD3tBNgIsQLuBNkItQLvBNoIL_AE2wgv8QTcCC_yBN0IL_ME3ggv9ATgCC_1BOIIPfYE4wi2AvcE5ggv-AToCD35BOkItwL6BOsIL_sE7Agv_ATtCD39BPAIuAL-BPEIvgL_BPIIJYAF8wglgQX0CCWCBfUIJYMF9gglhAX4CCWFBfoIPYYF-wi_AocF_ggliAWACT2JBYEJwAKKBYMJJYsFhAkljAWFCT2NBYgJwQKOBYkJxwKPBYoJKZAFiwkpkQWMCSmSBY0JKZMFjgkplAWQCSmVBZIJPZYFkwnIApcFmAkpmAWaCT2ZBZsJyQKaBZ8JKZsFoAkpnAWhCT2dBaQJygKeBaUJzgKfBaYJEaAFpwkRoQWoCRGiBakJEaMFqgkRpAWsCRGlBa4JPaYFrwnPAqcFsgkRqAW0CT2pBbUJ0AKqBbcJEasFuAkRrAW5CT2tBbwJ0QKuBb0J1QKvBb4JErAFvwkSsQXACRKyBcEJErMFwgkStAXECRK1BcYJPbYFxwnWArcFygkSuAXMCT25Bc0J1wK6Bc8JErsF0AkSvAXRCT29BdQJ2AK-BdUJ3AK_BdYJEMAF1wkQwQXYCRDCBdkJEMMF2gkQxAXcCRDFBd4JPcYF3wndAscF4gkQyAXkCT3JBeUJ3gLKBecJEMsF6AkQzAXpCT3NBewJ3wLOBe0J4wLPBe8JOdAF8Ak50QXyCTnSBfMJOdMF9Ak51AX2CTnVBfgJPdYF-QnkAtcF-wk52AX9CT3ZBf4J5QLaBf8JOdsFgAo53AWBCj3dBYQK5gLeBYUK6gLfBYYKBeAFhwoF4QWICgXiBYkKBeMFigoF5AWMCgXlBY4KPeYFjwrrAucFkQoF6AWTCj3pBZQK7ALqBZUKBesFlgoF7AWXCj3tBZoK7QLuBZsK8QI"
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
    throw createHttpError6(
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
    throw createHttpError6(
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
var initiateSubscriptionRenewal = async (creatorUserId, payload) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const selectedPlan = SUBSCRIPTION_PLAN_CONFIG[payload.plan];
  if (!selectedPlan) {
    throw createHttpError6(400, "Invalid subscription plan selected");
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
    throw createHttpError6(404, "User not found");
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
    throw createHttpError6(502, failureMessage);
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
function createHttpError7(statusCode, message) {
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
    throw createHttpError7(
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
    throw createHttpError7(
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
    throw createHttpError7(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError7(400, "Only pending applications can receive subscription payments");
  }
  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
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
    throw createHttpError7(502, failureMessage);
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
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID2) {
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
  const totalFeeAmount = toMoneyNumber4(feeConfiguration.totalFeeAmount);
  const monthlyFeeAmount = toMoneyNumber4(feeConfiguration.monthlyFeeAmount);
  const paidAmount = toMoneyNumber4(
    successfulPayments.reduce((sum, item) => sum + toMoneyNumber4(item.amount), 0)
  );
  const dueAmount = toMoneyNumber4(Math.max(0, totalFeeAmount - paidAmount));
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
    requestedAmount = toMoneyNumber4(Math.min(dueAmount, monthlyFeeAmount * monthsCount));
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
