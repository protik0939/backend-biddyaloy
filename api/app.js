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
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n  requestedTransferRequests            InstitutionTransferRequest[]  @relation("TransferRequestRequesterUser")\n  reviewedTransferRequests             InstitutionTransferRequest[]  @relation("TransferRequestReviewerUser")\n  requestedInstitutionLeaveRequests    InstitutionLeaveRequest[]     @relation("InstitutionLeaveRequestRequester")\n  reviewedInstitutionLeaveRequests     InstitutionLeaveRequest[]     @relation("InstitutionLeaveRequestReviewer")\n  sentNotices                          Notice[]                      @relation("NoticeSenderUser")\n  readNotices                          NoticeRead[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                           Program[]\n  batches                            Batch[]\n  courses                            Course[]\n  sections                           Section[]\n  teacherProfiles                    TeacherProfile[]\n  studentProfiles                    StudentProfile[]\n  courseRegistrations                CourseRegistration[]\n  sectionTeacherAssignments          SectionCourseTeacherAssignment[]\n  teacherJobApplications             TeacherJobApplication[]\n  teacherClassworks                  TeacherClasswork[]\n  studentClassworkSubmissions        StudentClassworkSubmission[]\n  teacherMarks                       TeacherMark[]\n  feeConfigurations                  DepartmentSemesterFeeConfiguration[]\n  feePayments                        StudentFeePayment[]\n  schedules                          Schedule[]\n  routines                           Routine[]\n  transferRequestsAsTargetDepartment InstitutionTransferRequest[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum InstitutionSubscriptionPlan {\n  MONTHLY\n  HALF_YEARLY\n  YEARLY\n}\n\nenum InstitutionSubscriptionPaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionSubscriptionStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nenum InstitutionTransferEntityType {\n  STUDENT\n  TEACHER\n}\n\nenum InstitutionTransferStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  CANCELLED\n}\n\nenum InstitutionLeaveRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum NoticeAudienceRole {\n  ADMIN\n  FACULTY\n  DEPARTMENT\n  TEACHER\n  STUDENT\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                               @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                             @default(now())\n  updatedAt                   DateTime                             @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n  paymentGatewayCredential    InstitutionPaymentGatewayCredential?\n  subscriptions               InstitutionSubscription[]\n  schedules                   Schedule[]\n  routines                    Routine[]\n  notices                     Notice[]\n  leaveRequests               InstitutionLeaveRequest[]\n  sourceTransferRequests      InstitutionTransferRequest[]         @relation("TransferRequestSourceInstitution")\n  targetTransferRequests      InstitutionTransferRequest[]         @relation("TransferRequestTargetInstitution")\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  subscriptionPlan              InstitutionSubscriptionPlan?\n  subscriptionAmount            Decimal?                             @db.Decimal(12, 2)\n  subscriptionCurrency          String                               @default("BDT")\n  subscriptionMonths            Int?\n  subscriptionPaymentStatus     InstitutionSubscriptionPaymentStatus @default(PENDING)\n  subscriptionTranId            String?                              @unique\n  subscriptionGatewayStatus     String?\n  subscriptionGatewaySessionKey String?                              @unique\n  subscriptionGatewayValId      String?\n  subscriptionGatewayBankTranId String?\n  subscriptionGatewayCardType   String?\n  subscriptionGatewayRawPayload Json?\n  subscriptionPaidAt            DateTime?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution?              @relation(fields: [institutionId], references: [id])\n  subscriptions InstitutionSubscription[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel InstitutionLeaveRequest {\n  id String @id @default(uuid())\n\n  requesterUserId String\n  requesterUser   User   @relation("InstitutionLeaveRequestRequester", fields: [requesterUserId], references: [id])\n\n  requesterRole UserRole\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  status InstitutionLeaveRequestStatus @default(PENDING)\n  reason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionLeaveRequestReviewer", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([requesterUserId, status])\n  @@index([institutionId, status])\n  @@map("institution_leave_requests")\n}\n\nmodel InstitutionTransferRequest {\n  id String @id @default(uuid())\n\n  entityType InstitutionTransferEntityType\n  status     InstitutionTransferStatus     @default(PENDING)\n\n  sourceInstitutionId String\n  sourceInstitution   Institution @relation("TransferRequestSourceInstitution", fields: [sourceInstitutionId], references: [id])\n\n  targetInstitutionId String\n  targetInstitution   Institution @relation("TransferRequestTargetInstitution", fields: [targetInstitutionId], references: [id])\n\n  requesterUserId String\n  requesterUser   User   @relation("TransferRequestRequesterUser", fields: [requesterUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TransferRequestReviewerUser", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  targetDepartmentId String?\n  targetDepartment   Department? @relation(fields: [targetDepartmentId], references: [id])\n\n  requestMessage  String?\n  responseMessage String?\n\n  requestedAt DateTime  @default(now())\n  reviewedAt  DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceInstitutionId, status])\n  @@index([targetInstitutionId, status])\n  @@index([requesterUserId])\n  @@index([studentProfileId])\n  @@index([teacherProfileId])\n  @@map("institution_transfer_requests")\n}\n\nmodel Notice {\n  id      String @id @default(uuid())\n  title   String\n  content String\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  senderUserId String\n  senderUser   User               @relation("NoticeSenderUser", fields: [senderUserId], references: [id])\n  senderRole   NoticeAudienceRole\n\n  recipients NoticeRecipientRole[]\n  reads      NoticeRead[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, createdAt])\n  @@index([senderUserId, createdAt])\n  @@map("notices")\n}\n\nmodel NoticeRecipientRole {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  role NoticeAudienceRole\n\n  createdAt DateTime @default(now())\n\n  @@unique([noticeId, role])\n  @@index([role])\n  @@map("notice_recipient_roles")\n}\n\nmodel NoticeRead {\n  id String @id @default(uuid())\n\n  noticeId String\n  notice   Notice @relation(fields: [noticeId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  readAt DateTime @default(now())\n\n  @@unique([noticeId, userId])\n  @@index([userId, readAt])\n  @@map("notice_reads")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel InstitutionPaymentGatewayCredential {\n  id                               String      @id @default(uuid())\n  institutionId                    String      @unique\n  institution                      Institution @relation(fields: [institutionId], references: [id])\n  sslCommerzStoreIdEncrypted       String\n  sslCommerzStorePasswordEncrypted String\n  sslCommerzBaseUrlEncrypted       String\n  sslCommerzStoreIdHash            String\n  sslCommerzStorePasswordHash      String\n  sslCommerzBaseUrlHash            String\n  isActive                         Boolean     @default(true)\n  lastUpdatedByUserId              String?\n  createdAt                        DateTime    @default(now())\n  updatedAt                        DateTime    @updatedAt\n\n  @@index([institutionId, isActive])\n  @@map("institution_payment_gateway_credentials")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  semesterId String?\n  semester   Semester? @relation(fields: [semesterId], references: [id])\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  startTime String\n  endTime   String\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId])\n  @@index([departmentId])\n  @@index([semesterId])\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  schedules           Schedule[]\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n  transferRequests      InstitutionTransferRequest[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel InstitutionSubscription {\n  id String @id @default(uuid())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  sourceApplicationId String?\n  sourceApplication   InstitutionApplication? @relation(fields: [sourceApplicationId], references: [id])\n\n  plan          InstitutionSubscriptionPlan\n  status        InstitutionSubscriptionStatus @default(ACTIVE)\n  amount        Decimal                       @db.Decimal(12, 2)\n  currency      String                        @default("BDT")\n  monthsCovered Int\n  startsAt      DateTime\n  endsAt        DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([institutionId, status, endsAt])\n  @@index([sourceApplicationId])\n  @@map("institution_subscriptions")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n  transferRequests          InstitutionTransferRequest[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"requestedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestRequesterUser"},{"name":"reviewedTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestReviewerUser"},{"name":"requestedInstitutionLeaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionLeaveRequestRequester"},{"name":"reviewedInstitutionLeaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionLeaveRequestReviewer"},{"name":"sentNotices","kind":"object","type":"Notice","relationName":"NoticeSenderUser"},{"name":"readNotices","kind":"object","type":"NoticeRead","relationName":"NoticeReadToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentToStudentFeePayment"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"DepartmentToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"DepartmentToRoutine"},{"name":"transferRequestsAsTargetDepartment","kind":"object","type":"InstitutionTransferRequest","relationName":"DepartmentToInstitutionTransferRequest"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"InstitutionToStudentFeePayment"},{"name":"paymentGatewayCredential","kind":"object","type":"InstitutionPaymentGatewayCredential","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionToInstitutionSubscription"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"InstitutionToSchedule"},{"name":"routines","kind":"object","type":"Routine","relationName":"InstitutionToRoutine"},{"name":"notices","kind":"object","type":"Notice","relationName":"InstitutionToNotice"},{"name":"leaveRequests","kind":"object","type":"InstitutionLeaveRequest","relationName":"InstitutionToInstitutionLeaveRequest"},{"name":"sourceTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestSourceInstitution"},{"name":"targetTransferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"TransferRequestTargetInstitution"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"subscriptionPlan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"subscriptionAmount","kind":"scalar","type":"Decimal"},{"name":"subscriptionCurrency","kind":"scalar","type":"String"},{"name":"subscriptionMonths","kind":"scalar","type":"Int"},{"name":"subscriptionPaymentStatus","kind":"enum","type":"InstitutionSubscriptionPaymentStatus"},{"name":"subscriptionTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayStatus","kind":"scalar","type":"String"},{"name":"subscriptionGatewaySessionKey","kind":"scalar","type":"String"},{"name":"subscriptionGatewayValId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayBankTranId","kind":"scalar","type":"String"},{"name":"subscriptionGatewayCardType","kind":"scalar","type":"String"},{"name":"subscriptionGatewayRawPayload","kind":"scalar","type":"Json"},{"name":"subscriptionPaidAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"subscriptions","kind":"object","type":"InstitutionSubscription","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"InstitutionLeaveRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"InstitutionLeaveRequestRequester"},{"name":"requesterRole","kind":"enum","type":"UserRole"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionLeaveRequest"},{"name":"status","kind":"enum","type":"InstitutionLeaveRequestStatus"},{"name":"reason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionLeaveRequestReviewer"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_leave_requests"},"InstitutionTransferRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"entityType","kind":"enum","type":"InstitutionTransferEntityType"},{"name":"status","kind":"enum","type":"InstitutionTransferStatus"},{"name":"sourceInstitutionId","kind":"scalar","type":"String"},{"name":"sourceInstitution","kind":"object","type":"Institution","relationName":"TransferRequestSourceInstitution"},{"name":"targetInstitutionId","kind":"scalar","type":"String"},{"name":"targetInstitution","kind":"object","type":"Institution","relationName":"TransferRequestTargetInstitution"},{"name":"requesterUserId","kind":"scalar","type":"String"},{"name":"requesterUser","kind":"object","type":"User","relationName":"TransferRequestRequesterUser"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TransferRequestReviewerUser"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"targetDepartmentId","kind":"scalar","type":"String"},{"name":"targetDepartment","kind":"object","type":"Department","relationName":"DepartmentToInstitutionTransferRequest"},{"name":"requestMessage","kind":"scalar","type":"String"},{"name":"responseMessage","kind":"scalar","type":"String"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_transfer_requests"},"Notice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToNotice"},{"name":"senderUserId","kind":"scalar","type":"String"},{"name":"senderUser","kind":"object","type":"User","relationName":"NoticeSenderUser"},{"name":"senderRole","kind":"enum","type":"NoticeAudienceRole"},{"name":"recipients","kind":"object","type":"NoticeRecipientRole","relationName":"NoticeToNoticeRecipientRole"},{"name":"reads","kind":"object","type":"NoticeRead","relationName":"NoticeToNoticeRead"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"notices"},"NoticeRecipientRole":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRecipientRole"},{"name":"role","kind":"enum","type":"NoticeAudienceRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_recipient_roles"},"NoticeRead":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"noticeId","kind":"scalar","type":"String"},{"name":"notice","kind":"object","type":"Notice","relationName":"NoticeToNoticeRead"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NoticeReadToUser"},{"name":"readAt","kind":"scalar","type":"DateTime"}],"dbName":"notice_reads"},"DepartmentSemesterFeeConfiguration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"totalFeeAmount","kind":"scalar","type":"Decimal"},{"name":"monthlyFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"}],"dbName":"department_semester_fee_configurations"},"StudentFeePayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentFeePayment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentFeePayment"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SemesterToStudentFeePayment"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentFeePaymentToStudentProfile"},{"name":"feeConfigurationId","kind":"scalar","type":"String"},{"name":"feeConfiguration","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"},{"name":"paymentMode","kind":"enum","type":"StudentFeePaymentMode"},{"name":"status","kind":"enum","type":"StudentFeePaymentStatus"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paymentInitiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_fee_payments"},"InstitutionPaymentGatewayCredential":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionPaymentGatewayCredential"},{"name":"sslCommerzStoreIdEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlEncrypted","kind":"scalar","type":"String"},{"name":"sslCommerzStoreIdHash","kind":"scalar","type":"String"},{"name":"sslCommerzStorePasswordHash","kind":"scalar","type":"String"},{"name":"sslCommerzBaseUrlHash","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"lastUpdatedByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_payment_gateway_credentials"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToRoutine"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"ScheduleToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSchedule"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSchedule"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"ScheduleToSemester"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"SemesterToStudentFeePayment"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"StudentFeePaymentToStudentProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"InstitutionSubscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionSubscription"},{"name":"sourceApplicationId","kind":"scalar","type":"String"},{"name":"sourceApplication","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationToInstitutionSubscription"},{"name":"plan","kind":"enum","type":"InstitutionSubscriptionPlan"},{"name":"status","kind":"enum","type":"InstitutionSubscriptionStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"endsAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_subscriptions"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"transferRequests","kind":"object","type":"InstitutionTransferRequest","relationName":"InstitutionTransferRequestToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","schedules","courseRegistrations","section","course","teacherProfile","sectionTeacherAssignments","classwork","classworkSubmissions","applications","_count","posting","studentUser","reviewerUser","studentProfile","admissionApplications","semester","feePayments","feeConfiguration","sourceInstitution","targetInstitution","requesterUser","targetDepartment","transferRequests","submissions","classworks","sections","batch","feeConfigurations","schedule","courseRegistration","routines","classRoom","attendances","mark","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","transferRequestsAsTargetDepartment","departments","faculties","classrooms","applicantUser","reviewedByUser","sourceApplication","subscriptions","institutionApplications","paymentGatewayCredential","senderUser","notice","recipients","reads","notices","leaveRequests","sourceTransferRequests","targetTransferRequests","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","requestedTransferRequests","reviewedTransferRequests","requestedInstitutionLeaveRequests","reviewedInstitutionLeaveRequests","sentNotices","readNotices","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","InstitutionLeaveRequest.findUnique","InstitutionLeaveRequest.findUniqueOrThrow","InstitutionLeaveRequest.findFirst","InstitutionLeaveRequest.findFirstOrThrow","InstitutionLeaveRequest.findMany","InstitutionLeaveRequest.createOne","InstitutionLeaveRequest.createMany","InstitutionLeaveRequest.createManyAndReturn","InstitutionLeaveRequest.updateOne","InstitutionLeaveRequest.updateMany","InstitutionLeaveRequest.updateManyAndReturn","InstitutionLeaveRequest.upsertOne","InstitutionLeaveRequest.deleteOne","InstitutionLeaveRequest.deleteMany","InstitutionLeaveRequest.groupBy","InstitutionLeaveRequest.aggregate","InstitutionTransferRequest.findUnique","InstitutionTransferRequest.findUniqueOrThrow","InstitutionTransferRequest.findFirst","InstitutionTransferRequest.findFirstOrThrow","InstitutionTransferRequest.findMany","InstitutionTransferRequest.createOne","InstitutionTransferRequest.createMany","InstitutionTransferRequest.createManyAndReturn","InstitutionTransferRequest.updateOne","InstitutionTransferRequest.updateMany","InstitutionTransferRequest.updateManyAndReturn","InstitutionTransferRequest.upsertOne","InstitutionTransferRequest.deleteOne","InstitutionTransferRequest.deleteMany","InstitutionTransferRequest.groupBy","InstitutionTransferRequest.aggregate","Notice.findUnique","Notice.findUniqueOrThrow","Notice.findFirst","Notice.findFirstOrThrow","Notice.findMany","Notice.createOne","Notice.createMany","Notice.createManyAndReturn","Notice.updateOne","Notice.updateMany","Notice.updateManyAndReturn","Notice.upsertOne","Notice.deleteOne","Notice.deleteMany","Notice.groupBy","Notice.aggregate","NoticeRecipientRole.findUnique","NoticeRecipientRole.findUniqueOrThrow","NoticeRecipientRole.findFirst","NoticeRecipientRole.findFirstOrThrow","NoticeRecipientRole.findMany","NoticeRecipientRole.createOne","NoticeRecipientRole.createMany","NoticeRecipientRole.createManyAndReturn","NoticeRecipientRole.updateOne","NoticeRecipientRole.updateMany","NoticeRecipientRole.updateManyAndReturn","NoticeRecipientRole.upsertOne","NoticeRecipientRole.deleteOne","NoticeRecipientRole.deleteMany","NoticeRecipientRole.groupBy","NoticeRecipientRole.aggregate","NoticeRead.findUnique","NoticeRead.findUniqueOrThrow","NoticeRead.findFirst","NoticeRead.findFirstOrThrow","NoticeRead.findMany","NoticeRead.createOne","NoticeRead.createMany","NoticeRead.createManyAndReturn","NoticeRead.updateOne","NoticeRead.updateMany","NoticeRead.updateManyAndReturn","NoticeRead.upsertOne","NoticeRead.deleteOne","NoticeRead.deleteMany","NoticeRead.groupBy","NoticeRead.aggregate","DepartmentSemesterFeeConfiguration.findUnique","DepartmentSemesterFeeConfiguration.findUniqueOrThrow","DepartmentSemesterFeeConfiguration.findFirst","DepartmentSemesterFeeConfiguration.findFirstOrThrow","DepartmentSemesterFeeConfiguration.findMany","DepartmentSemesterFeeConfiguration.createOne","DepartmentSemesterFeeConfiguration.createMany","DepartmentSemesterFeeConfiguration.createManyAndReturn","DepartmentSemesterFeeConfiguration.updateOne","DepartmentSemesterFeeConfiguration.updateMany","DepartmentSemesterFeeConfiguration.updateManyAndReturn","DepartmentSemesterFeeConfiguration.upsertOne","DepartmentSemesterFeeConfiguration.deleteOne","DepartmentSemesterFeeConfiguration.deleteMany","DepartmentSemesterFeeConfiguration.groupBy","DepartmentSemesterFeeConfiguration.aggregate","StudentFeePayment.findUnique","StudentFeePayment.findUniqueOrThrow","StudentFeePayment.findFirst","StudentFeePayment.findFirstOrThrow","StudentFeePayment.findMany","StudentFeePayment.createOne","StudentFeePayment.createMany","StudentFeePayment.createManyAndReturn","StudentFeePayment.updateOne","StudentFeePayment.updateMany","StudentFeePayment.updateManyAndReturn","StudentFeePayment.upsertOne","StudentFeePayment.deleteOne","StudentFeePayment.deleteMany","StudentFeePayment.groupBy","StudentFeePayment.aggregate","InstitutionPaymentGatewayCredential.findUnique","InstitutionPaymentGatewayCredential.findUniqueOrThrow","InstitutionPaymentGatewayCredential.findFirst","InstitutionPaymentGatewayCredential.findFirstOrThrow","InstitutionPaymentGatewayCredential.findMany","InstitutionPaymentGatewayCredential.createOne","InstitutionPaymentGatewayCredential.createMany","InstitutionPaymentGatewayCredential.createManyAndReturn","InstitutionPaymentGatewayCredential.updateOne","InstitutionPaymentGatewayCredential.updateMany","InstitutionPaymentGatewayCredential.updateManyAndReturn","InstitutionPaymentGatewayCredential.upsertOne","InstitutionPaymentGatewayCredential.deleteOne","InstitutionPaymentGatewayCredential.deleteMany","InstitutionPaymentGatewayCredential.groupBy","InstitutionPaymentGatewayCredential.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","InstitutionSubscription.findUnique","InstitutionSubscription.findUniqueOrThrow","InstitutionSubscription.findFirst","InstitutionSubscription.findFirstOrThrow","InstitutionSubscription.findMany","InstitutionSubscription.createOne","InstitutionSubscription.createMany","InstitutionSubscription.createManyAndReturn","InstitutionSubscription.updateOne","InstitutionSubscription.updateMany","InstitutionSubscription.updateManyAndReturn","InstitutionSubscription.upsertOne","InstitutionSubscription.deleteOne","InstitutionSubscription.deleteMany","InstitutionSubscription.groupBy","InstitutionSubscription.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","sourceApplicationId","InstitutionSubscriptionPlan","plan","InstitutionSubscriptionStatus","amount","currency","monthsCovered","startsAt","endsAt","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","sslCommerzStoreIdEncrypted","sslCommerzStorePasswordEncrypted","sslCommerzBaseUrlEncrypted","sslCommerzStoreIdHash","sslCommerzStorePasswordHash","sslCommerzBaseUrlHash","isActive","lastUpdatedByUserId","feeConfigurationId","StudentFeePaymentMode","paymentMode","StudentFeePaymentStatus","gatewayName","tranId","gatewaySessionKey","gatewayValId","gatewayBankTranId","gatewayCardType","gatewayStatus","gatewayRawPayload","paymentInitiatedAt","paidAt","totalFeeAmount","monthlyFeeAmount","noticeId","readAt","NoticeAudienceRole","role","senderUserId","senderRole","InstitutionTransferEntityType","entityType","InstitutionTransferStatus","sourceInstitutionId","targetInstitutionId","requesterUserId","targetDepartmentId","requestMessage","responseMessage","requestedAt","UserRole","requesterRole","InstitutionLeaveRequestStatus","reason","reviewedByUserId","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","subscriptionPlan","subscriptionAmount","subscriptionCurrency","subscriptionMonths","InstitutionSubscriptionPaymentStatus","subscriptionPaymentStatus","subscriptionTranId","subscriptionGatewayStatus","subscriptionGatewaySessionKey","subscriptionGatewayValId","subscriptionGatewayBankTranId","subscriptionGatewayCardType","subscriptionGatewayRawPayload","subscriptionPaidAt","InstitutionApplicationStatus","rejectionReason","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","accountStatus","date","AttendanceStatus","AdminRole","noticeId_userId","noticeId_role","postingId_teacherUserId","courseRegistrationId_date","departmentId_semesterId","postingId_studentUserId","classworkId_studentProfileId","sectionId_courseId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "4B3vApAFCwMAALwKACAHAAD6CgAg8QUAALcMADDyBQAACwAQ8wUAALcMADD0BQEAAAAB-QUBALcKACH7BQEAAAAB_AVAALsKACH9BUAAuwoAIYIHAAC4DM8HIgEAAAABACAMAwAAvAoAIPEFAAC6DAAw8gUAAAMAEPMFAAC6DAAw9AUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACG0B0AAuwoAIcAHAQC3CgAhwQcBALgKACHCBwEAuAoAIQMDAACmDgAgwQcAALsMACDCBwAAuwwAIAwDAAC8CgAg8QUAALoMADDyBQAAAwAQ8wUAALoMADD0BQEAAAAB-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhtAdAALsKACHABwEAAAABwQcBALgKACHCBwEAuAoAIQMAAAADACABAAAEADACAAAFACARAwAAvAoAIPEFAAC5DAAw8gUAAAcAEPMFAAC5DAAw9AUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACG3BwEAtwoAIbgHAQC3CgAhuQcBALgKACG6BwEAuAoAIbsHAQC4CgAhvAdAAOELACG9B0AA4QsAIb4HAQC4CgAhvwcBALgKACEIAwAApg4AILkHAAC7DAAgugcAALsMACC7BwAAuwwAILwHAAC7DAAgvQcAALsMACC-BwAAuwwAIL8HAAC7DAAgEQMAALwKACDxBQAAuQwAMPIFAAAHABDzBQAAuQwAMPQFAQAAAAH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACG3BwEAtwoAIbgHAQC3CgAhuQcBALgKACG6BwEAuAoAIbsHAQC4CgAhvAdAAOELACG9B0AA4QsAIb4HAQC4CgAhvwcBALgKACEDAAAABwAgAQAACAAwAgAACQAgCwMAALwKACAHAAD6CgAg8QUAALcMADDyBQAACwAQ8wUAALcMADD0BQEAtwoAIfkFAQC3CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhggcAALgMzwciAgMAAKYOACAHAAC5EQAgAwAAAAsAIAEAAAwAMAIAAAEAIBYDAAC8CgAgBwAA-goAIAkAAIwMACANAADmCgAgEQAAtAsAICIAAL4LACAkAAC2CwAgSgAA9woAIEsAALgLACDxBQAAtgwAMPIFAAAOABDzBQAAtgwAMPQFAQC3CgAh9QUBALcKACH2BQEAtwoAIfcFAQC3CgAh-AUBALgKACH5BQEAtwoAIfoFAQC3CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhCgMAAKYOACAHAAC5EQAgCQAA_BgAIA0AAMQQACARAADOFgAgIgAA2BYAICQAANAWACBKAACzEQAgSwAA0hYAIPgFAAC7DAAgFgMAALwKACAHAAD6CgAgCQAAjAwAIA0AAOYKACARAAC0CwAgIgAAvgsAICQAALYLACBKAAD3CgAgSwAAuAsAIPEFAAC2DAAw8gUAAA4AEPMFAAC2DAAw9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBALcKACH4BQEAuAoAIfkFAQC3CgAh-gUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACEDAAAADgAgAQAADwAwAgAAEAAgDAcAAPgLACA5AAC1DAAg8QUAALQMADDyBQAAEgAQ8wUAALQMADD0BQEAtwoAIfkFAQC4CgAh_AVAALsKACH9BUAAuwoAIdMGAQC4CgAhlgcBALgKACGqBwEAtwoAIQUHAAC5EQAgOQAAjBkAIPkFAAC7DAAg0wYAALsMACCWBwAAuwwAIAwHAAD4CwAgOQAAtQwAIPEFAAC0DAAw8gUAABIAEPMFAAC0DAAw9AUBAAAAAfkFAQC4CgAh_AVAALsKACH9BUAAuwoAIdMGAQC4CgAhlgcBALgKACGqBwEAtwoAIQMAAAASACABAAATADACAAAUACAlBgAAsQsAIAwAAOQKACANAADmCgAgEQAAtAsAIBwAAOgKACAlAADlCgAgJwAA5woAICoAALsLACAuAACtCwAgLwAArgsAIDAAALALACAxAACyCwAgMgAAswsAIDQAAPcKACA1AAC2CwAgNgAAtwsAIDcAALgLACA6AACsCwAgOwAArwsAID8AALoLACBAAAC1CwAgQQAAuQsAIEYAALwLACBHAAC9CwAgSAAAvgsAIEkAAL4LACDxBQAAqgsAMPIFAAAWABDzBQAAqgsAMPQFAQC3CgAh_AVAALsKACH9BUAAuwoAIagGAACrC5gHI80GAQC3CgAh0wYBALgKACGWBwEAuAoAIZkHAQC4CgAhAQAAABYAIBwIAACzDAAgDAAA5AoAIA0AAOYKACARAAC0CwAgHAAA6AoAICUAAOUKACAnAADnCgAgKgAAuwsAIC4AAK0LACAvAACuCwAgMAAAsAsAIDEAALILACAyAACzCwAgNAAA9woAIDUAALYLACA2AAC3CwAgNwAAuAsAIDgAAL4LACDxBQAAsgwAMPIFAAAYABDzBQAAsgwAMPQFAQC3CgAh_AVAALsKACH9BUAAuwoAIdMGAQC4CgAh5AYBALgKACGWBwEAuAoAIaoHAQC3CgAhFQgAAIsZACAMAADCEAAgDQAAxBAAIBEAAM4WACAcAADGEAAgJQAAwxAAICcAAMUQACAqAADVFgAgLgAAxxYAIC8AAMgWACAwAADKFgAgMQAAzBYAIDIAAM0WACA0AACzEQAgNQAA0BYAIDYAANEWACA3AADSFgAgOAAA2BYAINMGAAC7DAAg5AYAALsMACCWBwAAuwwAIBwIAACzDAAgDAAA5AoAIA0AAOYKACARAAC0CwAgHAAA6AoAICUAAOUKACAnAADnCgAgKgAAuwsAIC4AAK0LACAvAACuCwAgMAAAsAsAIDEAALILACAyAACzCwAgNAAA9woAIDUAALYLACA2AAC3CwAgNwAAuAsAIDgAAL4LACDxBQAAsgwAMPIFAAAYABDzBQAAsgwAMPQFAQAAAAH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACHkBgEAuAoAIZYHAQC4CgAhqgcBALcKACEDAAAAGAAgAQAAGQAwAgAAGgAgAQAAABIAIBIHAAD6CgAgCQAAjAwAIA0AAOYKACAPAACwCwAg8QUAALEMADDyBQAAHQAQ8wUAALEMADD0BQEAtwoAIfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAhpQYBALcKACHTBgEAuAoAId0GAQC4CgAh3gZAAOELACHfBggA_AsAIeAGCAD8CwAhCQcAALkRACAJAAD8GAAgDQAAxBAAIA8AAMoWACDTBgAAuwwAIN0GAAC7DAAg3gYAALsMACDfBgAAuwwAIOAGAAC7DAAgEgcAAPoKACAJAACMDAAgDQAA5goAIA8AALALACDxBQAAsQwAMPIFAAAdABDzBQAAsQwAMPQFAQAAAAH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIaUGAQC3CgAh0wYBALgKACHdBgEAuAoAId4GQADhCwAh3wYIAPwLACHgBggA_AsAIQMAAAAdACABAAAeADACAAAfACASBwAA-goAIAkAAIwMACAKAACvDAAgDQAA5goAIBEAALQLACDxBQAAsAwAMPIFAAAhABDzBQAAsAwAMPQFAQC3CgAh-QUBALcKACH6BQEAtwoAIfwFQAC7CgAh_QVAALsKACHTBgEAuAoAId8GAgD0CwAh5QYBALgKACGsBwEAtwoAIa0HAQC3CgAhCAcAALkRACAJAAD8GAAgCgAAihkAIA0AAMQQACARAADOFgAg0wYAALsMACDfBgAAuwwAIOUGAAC7DAAgEgcAAPoKACAJAACMDAAgCgAArwwAIA0AAOYKACARAAC0CwAg8QUAALAMADDyBQAAIQAQ8wUAALAMADD0BQEAAAAB-QUBALcKACH6BQEAtwoAIfwFQAC7CgAh_QVAALsKACHTBgEAuAoAId8GAgD0CwAh5QYBALgKACGsBwEAAAABrQcBALcKACEDAAAAIQAgAQAAIgAwAgAAIwAgAQAAAB0AIBoHAAD6CgAgCQAA_wsAIAoAAK8MACALAAC7CwAgDgAAoAwAIA8AAKMMACAQAAD-CwAgGQAAlQwAIBsAAI0MACAsAACtDAAgLQAArgwAIPEFAACsDAAw8gUAACYAEPMFAACsDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZwGAQC3CgAhnQYBALcKACGeBgEAtwoAIaAGAQC3CgAh1QYBALcKACHlBgEAuAoAIasHQAC7CgAhDQcAALkRACAJAAD8GAAgCgAAihkAIAsAANUWACAOAACDGQAgDwAAhBkAIBAAAPsYACAZAAD_GAAgGwAA_hgAICwAAIgZACAtAACJGQAg-gUAALsMACDlBgAAuwwAIBoHAAD6CgAgCQAA_wsAIAoAAK8MACALAAC7CwAgDgAAoAwAIA8AAKMMACAQAAD-CwAgGQAAlQwAIBsAAI0MACAsAACtDAAgLQAArgwAIPEFAACsDAAw8gUAACYAEPMFAACsDAAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnAYBALcKACGdBgEAtwoAIZ4GAQC3CgAhoAYBALcKACHVBgEAtwoAIeUGAQC4CgAhqwdAALsKACEDAAAAJgAgAQAAJwAwAgAAKAAgEwcAAPgLACAJAAD_CwAgKAAAqgwAICkAAP0LACArAACrDAAg8QUAAKkMADDyBQAAKgAQ8wUAAKkMADD0BQEAtwoAIfkFAQC4CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhsgYBALcKACHNBgEAtwoAIdMGAQC4CgAh2gYBALgKACHbBgEAtwoAIdwGAQC3CgAhCQcAALkRACAJAAD8GAAgKAAAhhkAICkAAPoYACArAACHGQAg-QUAALsMACD6BQAAuwwAINMGAAC7DAAg2gYAALsMACATBwAA-AsAIAkAAP8LACAoAACqDAAgKQAA_QsAICsAAKsMACDxBQAAqQwAMPIFAAAqABDzBQAAqQwAMPQFAQAAAAH5BQEAuAoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIbIGAQC3CgAhzQYBALcKACHTBgEAuAoAIdoGAQC4CgAh2wYBALcKACHcBgEAtwoAIQMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgDQwAAOQKACANAADmCgAgHAAA6AoAICUAAOUKACAnAADnCgAg8QUAAOMKADDyBQAALwAQ8wUAAOMKADD0BQEAtwoAIfkFAQC3CgAhzQYBALcKACHOBkAAuwoAIc8GQAC7CgAhAQAAAC8AIBIHAAD4CwAgCQAA_wsAIAsAALsLACAbAACoDAAg8QUAAKYMADDyBQAAMQAQ8wUAAKYMADD0BQEAtwoAIfkFAQC4CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhrAYAAKcM2gYizQYBALcKACHTBgEAuAoAIdUGAQC4CgAh1wYBALcKACHYBgEAtwoAIQgHAAC5EQAgCQAA_BgAIAsAANUWACAbAAD-GAAg-QUAALsMACD6BQAAuwwAINMGAAC7DAAg1QYAALsMACASBwAA-AsAIAkAAP8LACALAAC7CwAgGwAAqAwAIPEFAACmDAAw8gUAADEAEPMFAACmDAAw9AUBAAAAAfkFAQC4CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhrAYAAKcM2gYizQYBALcKACHTBgEAuAoAIdUGAQC4CgAh1wYBALcKACHYBgEAtwoAIQMAAAAxACABAAAyADACAAAzACAUBwAA-goAIAkAAP8LACANAADmCgAgEQAAtAsAIBsAAI0MACAkAAC2CwAgJgAApQwAIPEFAACkDAAw8gUAADUAEPMFAACkDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAh0wYBALgKACHUBgIA9AsAIdUGAQC3CgAh1gYBALgKACELBwAAuREAIAkAAPwYACANAADEEAAgEQAAzhYAIBsAAP4YACAkAADQFgAgJgAAhRkAIPoFAAC7DAAg0wYAALsMACDUBgAAuwwAINYGAAC7DAAgFAcAAPoKACAJAAD_CwAgDQAA5goAIBEAALQLACAbAACNDAAgJAAAtgsAICYAAKUMACDxBQAApAwAMPIFAAA1ABDzBQAApAwAMPQFAQAAAAH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAh0wYBALgKACHUBgIA9AsAIdUGAQC3CgAh1gYBALgKACEDAAAANQAgAQAANgAwAgAANwAgAwAAACYAIAEAACcAMAIAACgAIBAHAAD6CgAgCQAA_wsAIA4AAKAMACAPAACjDAAgEAAA_gsAIPEFAACiDAAw8gUAADoAEPMFAACiDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZwGAQC3CgAhnQYBALcKACGeBgEAtwoAIQYHAAC5EQAgCQAA_BgAIA4AAIMZACAPAACEGQAgEAAA-xgAIPoFAAC7DAAgEQcAAPoKACAJAAD_CwAgDgAAoAwAIA8AAKMMACAQAAD-CwAg8QUAAKIMADDyBQAAOgAQ8wUAAKIMADD0BQEAAAAB-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGcBgEAtwoAIZ0GAQC3CgAhngYBALcKACHWBwAAoQwAIAMAAAA6ACABAAA7ADACAAA8ACABAAAAGAAgEwcAAPoKACAJAAD_CwAgDgAAoAwAIBAAAP4LACAjAAC3CwAg8QUAAJ4MADDyBQAAPwAQ8wUAAJ4MADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnAYBALcKACGeBgEAtwoAIaUGAQC3CgAhpgYBALgKACGoBgAAnwyoBiKpBkAA4QsAIQgHAAC5EQAgCQAA_BgAIA4AAIMZACAQAAD7GAAgIwAA0RYAIPoFAAC7DAAgpgYAALsMACCpBgAAuwwAIBMHAAD6CgAgCQAA_wsAIA4AAKAMACAQAAD-CwAgIwAAtwsAIPEFAACeDAAw8gUAAD8AEPMFAACeDAAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnAYBALcKACGeBgEAtwoAIaUGAQC3CgAhpgYBALgKACGoBgAAnwyoBiKpBkAA4QsAIQMAAAA_ACABAABAADACAABBACABAAAAGAAgEgcAAPoKACAJAAD_CwAgEgAAnQwAIBkAAJUMACDxBQAAnAwAMPIFAABEABDzBQAAnAwAMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGfBgEAtwoAIaAGAQC3CgAhoQYBALgKACGiBgEAuAoAIaMGAQC4CgAhpAZAALsKACEIBwAAuREAIAkAAPwYACASAACCGQAgGQAA_xgAIPoFAAC7DAAgoQYAALsMACCiBgAAuwwAIKMGAAC7DAAgEwcAAPoKACAJAAD_CwAgEgAAnQwAIBkAAJUMACDxBQAAnAwAMPIFAABEABDzBQAAnAwAMPQFAQAAAAH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZ8GAQC3CgAhoAYBALcKACGhBgEAuAoAIaIGAQC4CgAhowYBALgKACGkBkAAuwoAIdUHAACbDAAgAwAAAEQAIAEAAEUAMAIAAEYAIAEAAAAYACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAAEQAIAEAAEUAMAIAAEYAIBMWAACaDAAgFwAAvAoAIBgAAOILACAZAACRDAAg8QUAAJgMADDyBQAASwAQ8wUAAJgMADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGgBgEAuAoAIaoGAQC4CgAhrAYAAJkMywYirQYBALgKACGuBkAA4QsAIa8GQAC7CgAhsAYBALcKACGxBgEAuAoAIcsGAQC3CgAhCRYAAIEZACAXAACmDgAgGAAApg4AIBkAAP8YACCgBgAAuwwAIKoGAAC7DAAgrQYAALsMACCuBgAAuwwAILEGAAC7DAAgFBYAAJoMACAXAAC8CgAgGAAA4gsAIBkAAJEMACDxBQAAmAwAMPIFAABLABDzBQAAmAwAMPQFAQAAAAH8BUAAuwoAIf0FQAC7CgAhoAYBALgKACGqBgEAuAoAIawGAACZDMsGIq0GAQC4CgAhrgZAAOELACGvBkAAuwoAIbAGAQC3CgAhsQYBALgKACHLBgEAtwoAIdQHAACXDAAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACABAAAASwAgJgQAAM8LACAFAADQCwAgBgAAsQsAIBAAALILACAZAACzCwAgNAAA9woAIEAAALULACBMAAC1CwAgTQAA9woAIE4AANELACBPAAD0CgAgUAAA9AoAIFEAANILACBSAADTCwAgUwAAvgsAIFQAAL4LACBVAAC9CwAgVgAAvQsAIFcAALwLACBYAADUCwAg8QUAAM4LADDyBQAAUQAQ8wUAAM4LADD0BQEAtwoAIfgFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAhggcBALcKACHDBwEAtwoAIcQHIAC6CgAhxQcBALgKACHGBwEAuAoAIccHAQC4CgAhyAcBALgKACHJBwEAuAoAIcoHAQC4CgAhywcBALcKACEBAAAAUQAgEwMAALwKACAHAAD6CgAgCQAA_wsAIA0AAOYKACATAAC3CwAgGgAA9AoAIBwAAOgKACAiAAC-CwAg8QUAAIUMADDyBQAAUwAQ8wUAAIUMADD0BQEAtwoAIfgFAQC4CgAh-QUBALcKACH6BQEAuAoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIckGAQC3CgAhAQAAAFMAIB8HAAD6CgAgCQAAjAwAIBkAAJUMACAbAACNDAAgHQAAlgwAIPEFAACSDAAw8gUAAFUAEPMFAACSDAAw9AUBALcKACH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIaAGAQC3CgAhrAYAAJQM8wYixAYQAO4LACHFBgEAtwoAIcYGAgDvCwAh1QYBALcKACHvBgEAtwoAIfEGAACTDPEGIvMGAQC3CgAh9AYBALcKACH1BgEAuAoAIfYGAQC4CgAh9wYBALgKACH4BgEAuAoAIfkGAQC4CgAh-gYAAPYLACD7BkAAuwoAIfwGQADhCwAhDAcAALkRACAJAAD8GAAgGQAA_xgAIBsAAP4YACAdAACAGQAg9QYAALsMACD2BgAAuwwAIPcGAAC7DAAg-AYAALsMACD5BgAAuwwAIPoGAAC7DAAg_AYAALsMACAfBwAA-goAIAkAAIwMACAZAACVDAAgGwAAjQwAIB0AAJYMACDxBQAAkgwAMPIFAABVABDzBQAAkgwAMPQFAQAAAAH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIaAGAQC3CgAhrAYAAJQM8wYixAYQAO4LACHFBgEAtwoAIcYGAgDvCwAh1QYBALcKACHvBgEAtwoAIfEGAACTDPEGIvMGAQC3CgAh9AYBAAAAAfUGAQAAAAH2BgEAuAoAIfcGAQC4CgAh-AYBALgKACH5BgEAuAoAIfoGAAD2CwAg-wZAALsKACH8BkAA4QsAIQMAAABVACABAABWADACAABXACADAAAAVQAgAQAAVgAwAgAAVwAgAQAAAFUAIBoQAACEDAAgGAAA4gsAIBkAAJEMACAeAAD6CgAgHwAA-goAICAAALwKACAhAAD_CwAg8QUAAI4MADDyBQAAWwAQ8wUAAI4MADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGeBgEAuAoAIaAGAQC4CgAhrAYAAJAMiAcirgZAAOELACGxBgEAuAoAIYYHAACPDIYHIogHAQC3CgAhiQcBALcKACGKBwEAtwoAIYsHAQC4CgAhjAcBALgKACGNBwEAuAoAIY4HQAC7CgAhDhAAAPsYACAYAACmDgAgGQAA_xgAIB4AALkRACAfAAC5EQAgIAAApg4AICEAAPwYACCeBgAAuwwAIKAGAAC7DAAgrgYAALsMACCxBgAAuwwAIIsHAAC7DAAgjAcAALsMACCNBwAAuwwAIBoQAACEDAAgGAAA4gsAIBkAAJEMACAeAAD6CgAgHwAA-goAICAAALwKACAhAAD_CwAg8QUAAI4MADDyBQAAWwAQ8wUAAI4MADD0BQEAAAAB_AVAALsKACH9BUAAuwoAIZ4GAQC4CgAhoAYBALgKACGsBgAAkAyIByKuBkAA4QsAIbEGAQC4CgAhhgcAAI8MhgciiAcBALcKACGJBwEAtwoAIYoHAQC3CgAhiwcBALgKACGMBwEAuAoAIY0HAQC4CgAhjgdAALsKACEDAAAAWwAgAQAAXAAwAgAAXQAgAQAAAFEAIAEAAABTACABAAAADgAgAQAAABgAIAEAAAAmACABAAAARAAgAQAAAEsAIAEAAABVACABAAAAWwAgAQAAABgAIAEAAABEACABAAAAGAAgDQcAAPoKACAJAAD_CwAgJQAA5QoAIPEFAACGDAAw8gUAAGsAEPMFAACGDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAh0wYBALgKACEBAAAAawAgAQAAABgAIAMAAAA1ACABAAA2ADACAAA3ACABAAAANQAgAQAAACYAIAEAAAA6ACABAAAAPwAgAwAAACYAIAEAACcAMAIAACgAIBEHAAD6CgAgCQAAjAwAIBsAAI0MACAcAADoCgAg8QUAAIsMADDyBQAAdAAQ8wUAAIsMADD0BQEAtwoAIfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAhxQYBALcKACHVBgEAtwoAIe0GIAC6CgAh_QYQAO4LACH-BhAA7gsAIQQHAAC5EQAgCQAA_BgAIBsAAP4YACAcAADGEAAgEgcAAPoKACAJAACMDAAgGwAAjQwAIBwAAOgKACDxBQAAiwwAMPIFAAB0ABDzBQAAiwwAMPQFAQAAAAH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIcUGAQC3CgAh1QYBALcKACHtBiAAugoAIf0GEADuCwAh_gYQAO4LACHTBwAAigwAIAMAAAB0ACABAAB1ADACAAB2ACADAAAAVQAgAQAAVgAwAgAAVwAgAQAAADEAIAEAAAA1ACABAAAAJgAgAQAAAHQAIAEAAABVACABAAAAFgAgAQAAABgAIAEAAAAqACADAAAAKgAgAQAAKwAwAgAALAAgAQAAACoAIAEAAAAWACABAAAAGAAgCikAAP0LACDxBQAAiAwAMPIFAACFAQAQ8wUAAIgMADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAAiQzOByKyBgEAtwoAIcwHQAC7CgAhASkAAPoYACALKQAA_QsAIPEFAACIDAAw8gUAAIUBABDzBQAAiAwAMPQFAQAAAAH8BUAAuwoAIf0FQAC7CgAhrAYAAIkMzgcisgYBALcKACHMB0AAuwoAIdIHAACHDAAgAwAAAIUBACABAACGAQAwAgAAhwEAIBsHAAD6CgAgCQAA_wsAIBAAAP4LACApAAD9CwAg8QUAAPsLADDyBQAAiQEAEPMFAAD7CwAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZ4GAQC3CgAhsgYBALcKACGzBggA_AsAIbQGCAD8CwAhtQYIAPwLACG2BggA_AsAIbcGCAD8CwAhuAYIAPwLACG5BggA_AsAIboGCAD8CwAhuwYIAPwLACG8BggA_AsAIb0GCAD8CwAhvgYIAPwLACG_BggA_AsAIQEAAACJAQAgAQAAABgAIAEAAAAYACABAAAAHQAgAQAAACoAIAEAAACFAQAgAwAAADoAIAEAADsAMAIAADwAIAEAAAAmACABAAAAOgAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAhACABAAAAJgAgBQcAALkRACAJAAD8GAAgJQAAwxAAIPoFAAC7DAAg0wYAALsMACANBwAA-goAIAkAAP8LACAlAADlCgAg8QUAAIYMADDyBQAAawAQ8wUAAIYMADD0BQEAAAAB-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACHNBgEAtwoAIdMGAQC4CgAhAwAAAGsAIAEAAJYBADACAACXAQAgAwAAACEAIAEAACIAMAIAACMAIAMAAAA1ACABAAA2ADACAAA3ACADAAAADgAgAQAADwAwAgAAEAAgCgMAAKYOACAHAAC5EQAgCQAA_BgAIA0AAMQQACATAADRFgAgGgAAohEAIBwAAMYQACAiAADYFgAg-AUAALsMACD6BQAAuwwAIBMDAAC8CgAgBwAA-goAIAkAAP8LACANAADmCgAgEwAAtwsAIBoAAPQKACAcAADoCgAgIgAAvgsAIPEFAACFDAAw8gUAAFMAEPMFAACFDAAw9AUBAAAAAfgFAQC4CgAh-QUBALcKACH6BQEAuAoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIckGAQAAAAEDAAAAUwAgAQAAnAEAMAIAAJ0BACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAADoAIAEAADsAMAIAADwAIBcHAAD6CgAgCQAA_wsAIBAAAIQMACAWAACDDAAgGAAA4gsAIDMAALwKACDxBQAAgQwAMPIFAAChAQAQ8wUAAIEMADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhiQYBALcKACGeBgEAuAoAIaoGAQC4CgAhrAYAAIIMrAYirQYBALgKACGuBkAA4QsAIa8GQAC7CgAhsAYBALcKACGxBgEAuAoAIQwHAAC5EQAgCQAA_BgAIBAAAPsYACAWAAD9GAAgGAAApg4AIDMAAKYOACD6BQAAuwwAIJ4GAAC7DAAgqgYAALsMACCtBgAAuwwAIK4GAAC7DAAgsQYAALsMACAYBwAA-goAIAkAAP8LACAQAACEDAAgFgAAgwwAIBgAAOILACAzAAC8CgAg8QUAAIEMADDyBQAAoQEAEPMFAACBDAAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhiQYBALcKACGeBgEAuAoAIaoGAQC4CgAhrAYAAIIMrAYirQYBALgKACGuBkAA4QsAIa8GQAC7CgAhsAYBALcKACGxBgEAuAoAIdEHAACADAAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACABAAAAoQEAIAEAAABRACABAAAADgAgAQAAABgAIAMAAAA_ACABAABAADACAABBACADAAAARAAgAQAARQAwAgAARgAgEgcAALkRACAJAAD8GAAgEAAA-xgAICkAAPoYACD6BQAAuwwAILMGAAC7DAAgtAYAALsMACC1BgAAuwwAILYGAAC7DAAgtwYAALsMACC4BgAAuwwAILkGAAC7DAAgugYAALsMACC7BgAAuwwAILwGAAC7DAAgvQYAALsMACC-BgAAuwwAIL8GAAC7DAAgGwcAAPoKACAJAAD_CwAgEAAA_gsAICkAAP0LACDxBQAA-wsAMPIFAACJAQAQ8wUAAPsLADD0BQEAAAAB-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGeBgEAtwoAIbIGAQAAAAGzBggA_AsAIbQGCAD8CwAhtQYIAPwLACG2BggA_AsAIbcGCAD8CwAhuAYIAPwLACG5BggA_AsAIboGCAD8CwAhuwYIAPwLACG8BggA_AsAIb0GCAD8CwAhvgYIAPwLACG_BggA_AsAIQMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIAMAAAAxACABAAAyADACAAAzACADAAAAKgAgAQAAKwAwAgAALAAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAAAdACABAAAAawAgAQAAACEAIAEAAAA1ACABAAAADgAgAQAAAFMAIAEAAAAmACABAAAAOgAgAQAAAKEBACABAAAAPwAgAQAAAEQAIAEAAACJAQAgAQAAAHQAIAEAAABVACABAAAAMQAgAQAAACoAIAEAAABbACABAAAAGAAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAABrACABAACWAQAwAgAAlwEAIA4HAAD6CgAgKgAAuwsAIPEFAAD5CwAw8gUAAMgBABDzBQAA-QsAMPQFAQC3CgAh-QUBALcKACH8BUAAuwoAIf0FQAC7CgAhzQYBALgKACGuBwEAtwoAIa8HAQC3CgAhsAcCAO8LACGyBwAA-guyByIDBwAAuREAICoAANUWACDNBgAAuwwAIA4HAAD6CgAgKgAAuwsAIPEFAAD5CwAw8gUAAMgBABDzBQAA-QsAMPQFAQAAAAH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACHNBgEAuAoAIa4HAQC3CgAhrwcBALcKACGwBwIA7wsAIbIHAAD6C7IHIgMAAADIAQAgAQAAyQEAMAIAAMoBACADAAAANQAgAQAANgAwAgAANwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAALACABAAAMADACAAABACADAAAADgAgAQAADwAwAgAAEAAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAACYAIAEAACcAMAIAACgAIAMAAAA6ACABAAA7ADACAAA8ACAiBwAA-AsAIDwAALwKACA9AADiCwAgPwAAugsAIPEFAADxCwAw8gUAANMBABDzBQAA8QsAMPQFAQC3CgAh-QUBALgKACH8BUAAuwoAIf0FQAC7CgAhrAYAAPcLqQcirgZAAOELACHTBgEAuAoAIZMHAQC4CgAhlAcBALcKACGVBwEAtwoAIZYHAQC4CgAhmAcAAKsLmAcjmQcBALgKACGaBwAA8gvCBiObBxAA8wsAIZwHAQC3CgAhnQcCAPQLACGfBwAA9QufByKgBwEAuAoAIaEHAQC4CgAhogcBALgKACGjBwEAuAoAIaQHAQC4CgAhpQcBALgKACGmBwAA9gsAIKcHQADhCwAhqQcBALgKACEXBwAAuREAIDwAAKYOACA9AACmDgAgPwAA1BYAIPkFAAC7DAAgrgYAALsMACDTBgAAuwwAIJMHAAC7DAAglgcAALsMACCYBwAAuwwAIJkHAAC7DAAgmgcAALsMACCbBwAAuwwAIJ0HAAC7DAAgoAcAALsMACChBwAAuwwAIKIHAAC7DAAgowcAALsMACCkBwAAuwwAIKUHAAC7DAAgpgcAALsMACCnBwAAuwwAIKkHAAC7DAAgIgcAAPgLACA8AAC8CgAgPQAA4gsAID8AALoLACDxBQAA8QsAMPIFAADTAQAQ8wUAAPELADD0BQEAAAAB-QUBALgKACH8BUAAuwoAIf0FQAC7CgAhrAYAAPcLqQcirgZAAOELACHTBgEAuAoAIZMHAQC4CgAhlAcBALcKACGVBwEAtwoAIZYHAQC4CgAhmAcAAKsLmAcjmQcBALgKACGaBwAA8gvCBiObBxAA8wsAIZwHAQC3CgAhnQcCAPQLACGfBwAA9QufByKgBwEAAAABoQcBALgKACGiBwEAAAABowcBALgKACGkBwEAuAoAIaUHAQC4CgAhpgcAAPYLACCnB0AA4QsAIakHAQC4CgAhAwAAANMBACABAADUAQAwAgAA1QEAIAEAAABRACABAAAAFgAgEQcAAPoKACA-AADwCwAg8QUAAOsLADDyBQAA2QEAEPMFAADrCwAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA7QvEBiLABgEAuAoAIcIGAADsC8IGIsQGEADuCwAhxQYBALcKACHGBgIA7wsAIccGQAC7CgAhyAZAALsKACEDBwAAuREAID4AAPkYACDABgAAuwwAIBEHAAD6CgAgPgAA8AsAIPEFAADrCwAw8gUAANkBABDzBQAA6wsAMPQFAQAAAAH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA7QvEBiLABgEAuAoAIcIGAADsC8IGIsQGEADuCwAhxQYBALcKACHGBgIA7wsAIccGQAC7CgAhyAZAALsKACEDAAAA2QEAIAEAANoBADACAADbAQAgAQAAANMBACABAAAA2QEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAEQAIAEAAEUAMAIAAEYAIAMAAACJAQAgAQAArAEAMAIAAK0BACADAAAAdAAgAQAAdQAwAgAAdgAgAwAAAFUAIAEAAFYAMAIAAFcAIBAHAAD6CgAg8QUAAPkKADDyBQAA5QEAEPMFAAD5CgAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACHnBgEAtwoAIegGAQC3CgAh6QYBALcKACHqBgEAtwoAIesGAQC3CgAh7AYBALcKACHtBiAAugoAIe4GAQC4CgAhAQAAAOUBACADAAAA2QEAIAEAANoBADACAADbAQAgAwAAADEAIAEAADIAMAIAADMAIAMAAAAqACABAAArADACAAAsACAPBwAA-goAIEIAALwKACBEAADqCwAgRQAA1AsAIPEFAADpCwAw8gUAAOoBABDzBQAA6QsAMPQFAQC3CgAh-QUBALcKACH8BUAAuwoAIf0FQAC7CgAhpQYBALcKACGmBgEAtwoAIYMHAQC3CgAhhAcAAOgLggciBAcAALkRACBCAACmDgAgRAAA-BgAIEUAAO4YACAPBwAA-goAIEIAALwKACBEAADqCwAgRQAA1AsAIPEFAADpCwAw8gUAAOoBABDzBQAA6QsAMPQFAQAAAAH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIaYGAQC3CgAhgwcBALcKACGEBwAA6AuCByIDAAAA6gEAIAEAAOsBADACAADsAQAgCEMAAOULACDxBQAA5wsAMPIFAADuAQAQ8wUAAOcLADD0BQEAtwoAIfwFQAC7CgAh_wYBALcKACGCBwAA6AuCByIBQwAA9xgAIAlDAADlCwAg8QUAAOcLADDyBQAA7gEAEPMFAADnCwAw9AUBAAAAAfwFQAC7CgAh_wYBALcKACGCBwAA6AuCByLQBwAA5gsAIAMAAADuAQAgAQAA7wEAMAIAAPABACAJAwAAvAoAIEMAAOULACDxBQAA5AsAMPIFAADyAQAQ8wUAAOQLADD0BQEAtwoAIfsFAQC3CgAh_wYBALcKACGAB0AAuwoAIQIDAACmDgAgQwAA9xgAIAoDAAC8CgAgQwAA5QsAIPEFAADkCwAw8gUAAPIBABDzBQAA5AsAMPQFAQAAAAH7BQEAtwoAIf8GAQC3CgAhgAdAALsKACHPBwAA4wsAIAMAAADyAQAgAQAA8wEAMAIAAPQBACABAAAA7gEAIAEAAADyAQAgEAcAAPoKACAgAAC8CgAgPQAA4gsAIPEFAADeCwAw8gUAAPgBABDzBQAA3gsAMPQFAQC3CgAh-QUBALcKACH8BUAAuwoAIf0FQAC7CgAhrAYAAOALkgcirgZAAOELACGKBwEAtwoAIZAHAADfC5AHIpIHAQC4CgAhkwcBALgKACEGBwAAuREAICAAAKYOACA9AACmDgAgrgYAALsMACCSBwAAuwwAIJMHAAC7DAAgEAcAAPoKACAgAAC8CgAgPQAA4gsAIPEFAADeCwAw8gUAAPgBABDzBQAA3gsAMPQFAQAAAAH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA4AuSByKuBkAA4QsAIYoHAQC3CgAhkAcAAN8LkAcikgcBALgKACGTBwEAuAoAIQMAAAD4AQAgAQAA-QEAMAIAAPoBACABAAAAUQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACABAAAAEgAgAQAAAB0AIAEAAABrACABAAAAyAEAIAEAAAA1ACABAAAAIQAgAQAAAAsAIAEAAAAOACABAAAAUwAgAQAAACYAIAEAAAA6ACABAAAA0wEAIAEAAAChAQAgAQAAAD8AIAEAAABEACABAAAAiQEAIAEAAAB0ACABAAAAVQAgAQAAANkBACABAAAAMQAgAQAAACoAIAEAAADqAQAgAQAAAPgBACABAAAAWwAgAQAAAFsAIAMAAAAmACABAAAnADACAAAoACADAAAAOgAgAQAAOwAwAgAAPAAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAAChAQAgAQAAogEAMAIAAKMBACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAFsAIAEAAFwAMAIAAF0AIAEAAAAmACABAAAAOgAgAQAAAD8AIAEAAAChAQAgAQAAAIkBACABAAAAWwAgAwAAAFMAIAEAAJwBADACAACdAQAgAwAAANMBACABAADUAQAwAgAA1QEAIAMAAADTAQAgAQAA1AEAMAIAANUBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAKEBACABAACiAQAwAgAAowEAIBEzAAC8CgAg8QUAALYKADDyBQAAqQIAEPMFAAC2CgAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhiQYBALcKACGKBgEAtwoAIYsGAQC3CgAhjAYBALcKACGNBgEAuAoAIY4GAACwCgAgjwYAALAKACCQBgAAuQoAIJEGAAC5CgAgkgYgALoKACEBAAAAqQIAIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgDRcAALwKACDxBQAA4QoAMPIFAACtAgAQ8wUAAOEKADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGKBgEAtwoAIYsGAQC3CgAhkAYAALkKACCSBiAAugoAIcsGAQC3CgAhzAYAALAKACABAAAArQIAIAoDAAC8CgAg8QUAAN0LADDyBQAArwIAEPMFAADdCwAw9AUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACGzBwEAtwoAIbQHQAC7CgAhAQMAAKYOACAKAwAAvAoAIPEFAADdCwAw8gUAAK8CABDzBQAA3QsAMPQFAQAAAAH7BQEAAAAB_AVAALsKACH9BUAAuwoAIbMHAQC3CgAhtAdAALsKACEDAAAArwIAIAEAALACADACAACxAgAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACADAAAA-AEAIAEAAPkBADACAAD6AQAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAMAAADqAQAgAQAA6wEAMAIAAOwBACADAAAA8gEAIAEAAPMBADACAAD0AQAgAQAAAAMAIAEAAAAHACABAAAACwAgAQAAAA4AIAEAAABTACABAAAA0wEAIAEAAADTAQAgAQAAAKEBACABAAAAoQEAIAEAAABLACABAAAASwAgAQAAAK8CACABAAAAWwAgAQAAAFsAIAEAAAD4AQAgAQAAAPgBACABAAAA6gEAIAEAAADyAQAgAQAAAAEAIAMAAAALACABAAAMADACAAABACADAAAACwAgAQAADAAwAgAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAgDAACDFAAgBwAAvBgAIPQFAQAAAAH5BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABggcAAADPBwIBXgAAzwIAIAb0BQEAAAAB-QUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAYIHAAAAzwcCAV4AANECADABXgAA0QIAMAgDAACBFAAgBwAAuhgAIPQFAQC_DAAh-QUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACGCBwAA_xPPByICAAAAAQAgXgAA1AIAIAb0BQEAvwwAIfkFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhggcAAP8TzwciAgAAAAsAIF4AANYCACACAAAACwAgXgAA1gIAIAMAAAABACBlAADPAgAgZgAA1AIAIAEAAAABACABAAAACwAgAxUAAPQYACBrAAD2GAAgbAAA9RgAIAnxBQAA2QsAMPIFAADdAgAQ8wUAANkLADD0BQEApAoAIfkFAQCkCgAh-wUBAKQKACH8BUAApgoAIf0FQACmCgAhggcAANoLzwciAwAAAAsAIAEAANwCADBqAADdAgAgAwAAAAsAIAEAAAwAMAIAAAEAIAEAAACHAQAgAQAAAIcBACADAAAAhQEAIAEAAIYBADACAACHAQAgAwAAAIUBACABAACGAQAwAgAAhwEAIAMAAACFAQAgAQAAhgEAMAIAAIcBACAHKQAA8xgAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAzgcCsgYBAAAAAcwHQAAAAAEBXgAA5QIAIAb0BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAM4HArIGAQAAAAHMB0AAAAABAV4AAOcCADABXgAA5wIAMAcpAADyGAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAPENzgcisgYBAL8MACHMB0AAwQwAIQIAAACHAQAgXgAA6gIAIAb0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGsBgAA8Q3OByKyBgEAvwwAIcwHQADBDAAhAgAAAIUBACBeAADsAgAgAgAAAIUBACBeAADsAgAgAwAAAIcBACBlAADlAgAgZgAA6gIAIAEAAACHAQAgAQAAAIUBACADFQAA7xgAIGsAAPEYACBsAADwGAAgCfEFAADVCwAw8gUAAPMCABDzBQAA1QsAMPQFAQCkCgAh_AVAAKYKACH9BUAApgoAIawGAADWC84HIrIGAQCkCgAhzAdAAKYKACEDAAAAhQEAIAEAAPICADBqAADzAgAgAwAAAIUBACABAACGAQAwAgAAhwEAICYEAADPCwAgBQAA0AsAIAYAALELACAQAACyCwAgGQAAswsAIDQAAPcKACBAAAC1CwAgTAAAtQsAIE0AAPcKACBOAADRCwAgTwAA9AoAIFAAAPQKACBRAADSCwAgUgAA0wsAIFMAAL4LACBUAAC-CwAgVQAAvQsAIFYAAL0LACBXAAC8CwAgWAAA1AsAIPEFAADOCwAw8gUAAFEAEPMFAADOCwAw9AUBAAAAAfgFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAhggcBALcKACHDBwEAAAABxAcgALoKACHFBwEAuAoAIcYHAQC4CgAhxwcBALgKACHIBwEAuAoAIckHAQC4CgAhygcBALgKACHLBwEAtwoAIQEAAAD2AgAgAQAAAPYCACAbBAAA6RgAIAUAAOoYACAGAADLFgAgEAAAzBYAIBkAAM0WACA0AACzEQAgQAAAzxYAIEwAAM8WACBNAACzEQAgTgAA6xgAIE8AAKIRACBQAACiEQAgUQAA7BgAIFIAAO0YACBTAADYFgAgVAAA2BYAIFUAANcWACBWAADXFgAgVwAA1hYAIFgAAO4YACD4BQAAuwwAIMUHAAC7DAAgxgcAALsMACDHBwAAuwwAIMgHAAC7DAAgyQcAALsMACDKBwAAuwwAIAMAAABRACABAAD5AgAwAgAA9gIAIAMAAABRACABAAD5AgAwAgAA9gIAIAMAAABRACABAAD5AgAwAgAA9gIAICMEAADVGAAgBQAA1hgAIAYAANcYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE0AAN0YACBOAADeGAAgTwAA3xgAIFAAAOAYACBRAADhGAAgUgAA4hgAIFMAAOMYACBUAADkGAAgVQAA5RgAIFYAAOYYACBXAADnGAAgWAAA6BgAIPQFAQAAAAH4BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABggcBAAAAAcMHAQAAAAHEByAAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAQFeAAD9AgAgD_QFAQAAAAH4BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABggcBAAAAAcMHAQAAAAHEByAAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAQFeAAD_AgAwAV4AAP8CADAjBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACECAAAA9gIAIF4AAIIDACAP9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhAgAAAFEAIF4AAIQDACACAAAAUQAgXgAAhAMAIAMAAAD2AgAgZQAA_QIAIGYAAIIDACABAAAA9gIAIAEAAABRACAKFQAAhxcAIGsAAIkXACBsAACIFwAg-AUAALsMACDFBwAAuwwAIMYHAAC7DAAgxwcAALsMACDIBwAAuwwAIMkHAAC7DAAgygcAALsMACAS8QUAAM0LADDyBQAAiwMAEPMFAADNCwAw9AUBAKQKACH4BQEApQoAIfwFQACmCgAh_QVAAKYKACHNBgEApAoAIYIHAQCkCgAhwwcBAKQKACHEByAAsgoAIcUHAQClCgAhxgcBAKUKACHHBwEApQoAIcgHAQClCgAhyQcBAKUKACHKBwEApQoAIcsHAQCkCgAhAwAAAFEAIAEAAIoDADBqAACLAwAgAwAAAFEAIAEAAPkCADACAAD2AgAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAAhhcAIPQFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAG0B0AAAAABwAcBAAAAAcEHAQAAAAHCBwEAAAABAV4AAJMDACAI9AUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAbQHQAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAEBXgAAlQMAMAFeAACVAwAwCQMAAIUXACD0BQEAvwwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIbQHQADBDAAhwAcBAL8MACHBBwEAwAwAIcIHAQDADAAhAgAAAAUAIF4AAJgDACAI9AUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACG0B0AAwQwAIcAHAQC_DAAhwQcBAMAMACHCBwEAwAwAIQIAAAADACBeAACaAwAgAgAAAAMAIF4AAJoDACADAAAABQAgZQAAkwMAIGYAAJgDACABAAAABQAgAQAAAAMAIAUVAACCFwAgawAAhBcAIGwAAIMXACDBBwAAuwwAIMIHAAC7DAAgC_EFAADMCwAw8gUAAKEDABDzBQAAzAsAMPQFAQCkCgAh-wUBAKQKACH8BUAApgoAIf0FQACmCgAhtAdAAKYKACHABwEApAoAIcEHAQClCgAhwgcBAKUKACEDAAAAAwAgAQAAoAMAMGoAAKEDACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAAgRcAIPQFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAG6BwEAAAABuwcBAAAAAbwHQAAAAAG9B0AAAAABvgcBAAAAAb8HAQAAAAEBXgAAqQMAIA30BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABugcBAAAAAbsHAQAAAAG8B0AAAAABvQdAAAAAAb4HAQAAAAG_BwEAAAABAV4AAKsDADABXgAAqwMAMA4DAACAFwAg9AUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACG3BwEAvwwAIbgHAQC_DAAhuQcBAMAMACG6BwEAwAwAIbsHAQDADAAhvAdAANcMACG9B0AA1wwAIb4HAQDADAAhvwcBAMAMACECAAAACQAgXgAArgMAIA30BQEAvwwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIbcHAQC_DAAhuAcBAL8MACG5BwEAwAwAIboHAQDADAAhuwcBAMAMACG8B0AA1wwAIb0HQADXDAAhvgcBAMAMACG_BwEAwAwAIQIAAAAHACBeAACwAwAgAgAAAAcAIF4AALADACADAAAACQAgZQAAqQMAIGYAAK4DACABAAAACQAgAQAAAAcAIAoVAAD9FgAgawAA_xYAIGwAAP4WACC5BwAAuwwAILoHAAC7DAAguwcAALsMACC8BwAAuwwAIL0HAAC7DAAgvgcAALsMACC_BwAAuwwAIBDxBQAAywsAMPIFAAC3AwAQ8wUAAMsLADD0BQEApAoAIfsFAQCkCgAh_AVAAKYKACH9BUAApgoAIbcHAQCkCgAhuAcBAKQKACG5BwEApQoAIboHAQClCgAhuwcBAKUKACG8B0AAwQoAIb0HQADBCgAhvgcBAKUKACG_BwEApQoAIQMAAAAHACABAAC2AwAwagAAtwMAIAMAAAAHACABAAAIADACAAAJACAJ8QUAAMoLADDyBQAAvQMAEPMFAADKCwAw9AUBAAAAAfwFQAC7CgAh_QVAALsKACG0B0AAuwoAIbUHAQC3CgAhtgcBALcKACEBAAAAugMAIAEAAAC6AwAgCfEFAADKCwAw8gUAAL0DABDzBQAAygsAMPQFAQC3CgAh_AVAALsKACH9BUAAuwoAIbQHQAC7CgAhtQcBALcKACG2BwEAtwoAIQADAAAAvQMAIAEAAL4DADACAAC6AwAgAwAAAL0DACABAAC-AwAwAgAAugMAIAMAAAC9AwAgAQAAvgMAMAIAALoDACAG9AUBAAAAAfwFQAAAAAH9BUAAAAABtAdAAAAAAbUHAQAAAAG2BwEAAAABAV4AAMIDACAG9AUBAAAAAfwFQAAAAAH9BUAAAAABtAdAAAAAAbUHAQAAAAG2BwEAAAABAV4AAMQDADABXgAAxAMAMAb0BQEAvwwAIfwFQADBDAAh_QVAAMEMACG0B0AAwQwAIbUHAQC_DAAhtgcBAL8MACECAAAAugMAIF4AAMcDACAG9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhtAdAAMEMACG1BwEAvwwAIbYHAQC_DAAhAgAAAL0DACBeAADJAwAgAgAAAL0DACBeAADJAwAgAwAAALoDACBlAADCAwAgZgAAxwMAIAEAAAC6AwAgAQAAAL0DACADFQAA-hYAIGsAAPwWACBsAAD7FgAgCfEFAADJCwAw8gUAANADABDzBQAAyQsAMPQFAQCkCgAh_AVAAKYKACH9BUAApgoAIbQHQACmCgAhtQcBAKQKACG2BwEApAoAIQMAAAC9AwAgAQAAzwMAMGoAANADACADAAAAvQMAIAEAAL4DADACAAC6AwAgAQAAALECACABAAAAsQIAIAMAAACvAgAgAQAAsAIAMAIAALECACADAAAArwIAIAEAALACADACAACxAgAgAwAAAK8CACABAACwAgAwAgAAsQIAIAcDAAD5FgAg9AUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAbMHAQAAAAG0B0AAAAABAV4AANgDACAG9AUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAbMHAQAAAAG0B0AAAAABAV4AANoDADABXgAA2gMAMAcDAAD4FgAg9AUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACGzBwEAvwwAIbQHQADBDAAhAgAAALECACBeAADdAwAgBvQFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhswcBAL8MACG0B0AAwQwAIQIAAACvAgAgXgAA3wMAIAIAAACvAgAgXgAA3wMAIAMAAACxAgAgZQAA2AMAIGYAAN0DACABAAAAsQIAIAEAAACvAgAgAxUAAPUWACBrAAD3FgAgbAAA9hYAIAnxBQAAyAsAMPIFAADmAwAQ8wUAAMgLADD0BQEApAoAIfsFAQCkCgAh_AVAAKYKACH9BUAApgoAIbMHAQCkCgAhtAdAAKYKACEDAAAArwIAIAEAAOUDADBqAADmAwAgAwAAAK8CACABAACwAgAwAgAAsQIAIAEAAACXAQAgAQAAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACADAAAAawAgAQAAlgEAMAIAAJcBACAKBwAAjhYAIAkAAMcUACAlAADIFAAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAQFeAADuAwAgB_QFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAdMGAQAAAAEBXgAA8AMAMAFeAADwAwAwAQAAABgAIAoHAACMFgAgCQAAuxQAICUAALwUACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIQIAAACXAQAgXgAA9AMAIAf0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIQIAAABrACBeAAD2AwAgAgAAAGsAIF4AAPYDACABAAAAGAAgAwAAAJcBACBlAADuAwAgZgAA9AMAIAEAAACXAQAgAQAAAGsAIAUVAADyFgAgawAA9BYAIGwAAPMWACD6BQAAuwwAINMGAAC7DAAgCvEFAADHCwAw8gUAAP4DABDzBQAAxwsAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACHNBgEApAoAIdMGAQClCgAhAwAAAGsAIAEAAP0DADBqAAD-AwAgAwAAAGsAIAEAAJYBADACAACXAQAgAQAAAMoBACABAAAAygEAIAMAAADIAQAgAQAAyQEAMAIAAMoBACADAAAAyAEAIAEAAMkBADACAADKAQAgAwAAAMgBACABAADJAQAwAgAAygEAIAsHAADxFgAgKgAArxQAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABrgcBAAAAAa8HAQAAAAGwBwIAAAABsgcAAACyBwIBXgAAhgQAIAn0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAa4HAQAAAAGvBwEAAAABsAcCAAAAAbIHAAAAsgcCAV4AAIgEADABXgAAiAQAMAsHAADwFgAgKgAApBQAIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhzQYBAMAMACGuBwEAvwwAIa8HAQC_DAAhsAcCAMgOACGyBwAAohSyByICAAAAygEAIF4AAIsEACAJ9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHNBgEAwAwAIa4HAQC_DAAhrwcBAL8MACGwBwIAyA4AIbIHAACiFLIHIgIAAADIAQAgXgAAjQQAIAIAAADIAQAgXgAAjQQAIAMAAADKAQAgZQAAhgQAIGYAAIsEACABAAAAygEAIAEAAADIAQAgBhUAAOsWACBrAADuFgAgbAAA7RYAIO0BAADsFgAg7gEAAO8WACDNBgAAuwwAIAzxBQAAwwsAMPIFAACUBAAQ8wUAAMMLADD0BQEApAoAIfkFAQCkCgAh_AVAAKYKACH9BUAApgoAIc0GAQClCgAhrgcBAKQKACGvBwEApAoAIbAHAgDSCgAhsgcAAMQLsgciAwAAAMgBACABAACTBAAwagAAlAQAIAMAAADIAQAgAQAAyQEAMAIAAMoBACABAAAAIwAgAQAAACMAIAMAAAAhACABAAAiADACAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIA8HAACKEQAgCQAAixEAIAoAAI4UACANAACMEQAgEQAAjREAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAd8GAgAAAAHlBgEAAAABrAcBAAAAAa0HAQAAAAEBXgAAnAQAIAr0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHfBgIAAAAB5QYBAAAAAawHAQAAAAGtBwEAAAABAV4AAJ4EADABXgAAngQAMAEAAAAdACAPBwAA8xAAIAkAAPQQACAKAACMFAAgDQAA9RAAIBEAAPYQACD0BQEAvwwAIfkFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHfBgIA9Q8AIeUGAQDADAAhrAcBAL8MACGtBwEAvwwAIQIAAAAjACBeAACiBAAgCvQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAId8GAgD1DwAh5QYBAMAMACGsBwEAvwwAIa0HAQC_DAAhAgAAACEAIF4AAKQEACACAAAAIQAgXgAApAQAIAEAAAAdACADAAAAIwAgZQAAnAQAIGYAAKIEACABAAAAIwAgAQAAACEAIAgVAADmFgAgawAA6RYAIGwAAOgWACDtAQAA5xYAIO4BAADqFgAg0wYAALsMACDfBgAAuwwAIOUGAAC7DAAgDfEFAADCCwAw8gUAAKwEABDzBQAAwgsAMPQFAQCkCgAh-QUBAKQKACH6BQEApAoAIfwFQACmCgAh_QVAAKYKACHTBgEApQoAId8GAgDqCgAh5QYBAKUKACGsBwEApAoAIa0HAQCkCgAhAwAAACEAIAEAAKsEADBqAACsBAAgAwAAACEAIAEAACIAMAIAACMAIAEAAAAoACABAAAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgFwcAAJIOACAJAACPDgAgCgAAkA4AIAsAAIkOACAOAACODgAgDwAAjA4AIBAAAJ8PACAZAACNDgAgGwAAkQ4AICwAAIoOACAtAACLDgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABAV4AALQEACAM9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABAV4AALYEADABXgAAtgQAMAEAAAAYACABAAAAHQAgFwcAAN8NACAJAADcDQAgCgAA3Q0AIAsAANYNACAOAADbDQAgDwAA2Q0AIBAAAJ0PACAZAADaDQAgGwAA3g0AICwAANcNACAtAADYDQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhAgAAACgAIF4AALsEACAM9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhAgAAACYAIF4AAL0EACACAAAAJgAgXgAAvQQAIAEAAAAYACABAAAAHQAgAwAAACgAIGUAALQEACBmAAC7BAAgAQAAACgAIAEAAAAmACAFFQAA4xYAIGsAAOUWACBsAADkFgAg-gUAALsMACDlBgAAuwwAIA_xBQAAwQsAMPIFAADGBAAQ8wUAAMELADD0BQEApAoAIfkFAQCkCgAh-gUBAKUKACH8BUAApgoAIf0FQACmCgAhnAYBAKQKACGdBgEApAoAIZ4GAQCkCgAhoAYBAKQKACHVBgEApAoAIeUGAQClCgAhqwdAAKYKACEDAAAAJgAgAQAAxQQAMGoAAMYEACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAABoAIAEAAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACAZCAAA4hYAIAwAAKcWACANAACfFgAgEQAAoBYAIBwAAKYWACAlAACcFgAgJwAApRYAICoAAKgWACAuAACZFgAgLwAAmhYAIDAAAJsWACAxAACdFgAgMgAAnhYAIDQAAKEWACA1AACiFgAgNgAAoxYAIDcAAKQWACA4AACpFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAeQGAQAAAAGWBwEAAAABqgcBAAAAAQFeAADOBAAgB_QFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHkBgEAAAABlgcBAAAAAaoHAQAAAAEBXgAA0AQAMAFeAADQBAAwAQAAABIAIBkIAADhFgAgDAAA-hQAIA0AAPIUACARAADzFAAgHAAA-RQAICUAAO8UACAnAAD4FAAgKgAA-xQAIC4AAOwUACAvAADtFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIQIAAAAaACBeAADUBAAgB_QFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhAgAAABgAIF4AANYEACACAAAAGAAgXgAA1gQAIAEAAAASACADAAAAGgAgZQAAzgQAIGYAANQEACABAAAAGgAgAQAAABgAIAYVAADeFgAgawAA4BYAIGwAAN8WACDTBgAAuwwAIOQGAAC7DAAglgcAALsMACAK8QUAAMALADDyBQAA3gQAEPMFAADACwAw9AUBAKQKACH8BUAApgoAIf0FQACmCgAh0wYBAKUKACHkBgEApQoAIZYHAQClCgAhqgcBAKQKACEDAAAAGAAgAQAA3QQAMGoAAN4EACADAAAAGAAgAQAAGQAwAgAAGgAgAQAAABQAIAEAAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACAJBwAA3RYAIDkAAKsWACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAZYHAQAAAAGqBwEAAAABAV4AAOYEACAH9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAGWBwEAAAABqgcBAAAAAQFeAADoBAAwAV4AAOgEADABAAAAFgAgCQcAANwWACA5AADgFAAg9AUBAL8MACH5BQEAwAwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIZYHAQDADAAhqgcBAL8MACECAAAAFAAgXgAA7AQAIAf0BQEAvwwAIfkFAQDADAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAhlgcBAMAMACGqBwEAvwwAIQIAAAASACBeAADuBAAgAgAAABIAIF4AAO4EACABAAAAFgAgAwAAABQAIGUAAOYEACBmAADsBAAgAQAAABQAIAEAAAASACAGFQAA2RYAIGsAANsWACBsAADaFgAg-QUAALsMACDTBgAAuwwAIJYHAAC7DAAgCvEFAAC_CwAw8gUAAPYEABDzBQAAvwsAMPQFAQCkCgAh-QUBAKUKACH8BUAApgoAIf0FQACmCgAh0wYBAKUKACGWBwEApQoAIaoHAQCkCgAhAwAAABIAIAEAAPUEADBqAAD2BAAgAwAAABIAIAEAABMAMAIAABQAICUGAACxCwAgDAAA5AoAIA0AAOYKACARAAC0CwAgHAAA6AoAICUAAOUKACAnAADnCgAgKgAAuwsAIC4AAK0LACAvAACuCwAgMAAAsAsAIDEAALILACAyAACzCwAgNAAA9woAIDUAALYLACA2AAC3CwAgNwAAuAsAIDoAAKwLACA7AACvCwAgPwAAugsAIEAAALULACBBAAC5CwAgRgAAvAsAIEcAAL0LACBIAAC-CwAgSQAAvgsAIPEFAACqCwAw8gUAABYAEPMFAACqCwAw9AUBAAAAAfwFQAC7CgAh_QVAALsKACGoBgAAqwuYByPNBgEAtwoAIdMGAQC4CgAhlgcBALgKACGZBwEAuAoAIQEAAAD5BAAgAQAAAPkEACAeBgAAyxYAIAwAAMIQACANAADEEAAgEQAAzhYAIBwAAMYQACAlAADDEAAgJwAAxRAAICoAANUWACAuAADHFgAgLwAAyBYAIDAAAMoWACAxAADMFgAgMgAAzRYAIDQAALMRACA1AADQFgAgNgAA0RYAIDcAANIWACA6AADGFgAgOwAAyRYAID8AANQWACBAAADPFgAgQQAA0xYAIEYAANYWACBHAADXFgAgSAAA2BYAIEkAANgWACCoBgAAuwwAINMGAAC7DAAglgcAALsMACCZBwAAuwwAIAMAAAAWACABAAD8BAAwAgAA-QQAIAMAAAAWACABAAD8BAAwAgAA-QQAIAMAAAAWACABAAD8BAAwAgAA-QQAICIGAACyFgAgDAAAwBYAIA0AALUWACARAAC2FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQFeAACABQAgCPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQFeAACCBQAwAV4AAIIFADAiBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQIAAAD5BAAgXgAAhQUAIAj0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQIAAAAWACBeAACHBQAgAgAAABYAIF4AAIcFACADAAAA-QQAIGUAAIAFACBmAACFBQAgAQAAAPkEACABAAAAFgAgBxUAAKISACBrAACkEgAgbAAAoxIAIKgGAAC7DAAg0wYAALsMACCWBwAAuwwAIJkHAAC7DAAgC_EFAACpCwAw8gUAAI4FABDzBQAAqQsAMPQFAQCkCgAh_AVAAKYKACH9BUAApgoAIagGAACaC5gHI80GAQCkCgAh0wYBAKUKACGWBwEApQoAIZkHAQClCgAhAwAAABYAIAEAAI0FADBqAACOBQAgAwAAABYAIAEAAPwEADACAAD5BAAgAQAAANUBACABAAAA1QEAIAMAAADTAQAgAQAA1AEAMAIAANUBACADAAAA0wEAIAEAANQBADACAADVAQAgAwAAANMBACABAADUAQAwAgAA1QEAIB8HAACgEgAgPAAAnhIAID0AAJ8SACA_AAChEgAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAqQcCrgZAAAAAAdMGAQAAAAGTBwEAAAABlAcBAAAAAZUHAQAAAAGWBwEAAAABmAcAAACYBwOZBwEAAAABmgcAAADCBgObBxAAAAABnAcBAAAAAZ0HAgAAAAGfBwAAAJ8HAqAHAQAAAAGhBwEAAAABogcBAAAAAaMHAQAAAAGkBwEAAAABpQcBAAAAAaYHgAAAAAGnB0AAAAABqQcBAAAAAQFeAACWBQAgG_QFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAKkHAq4GQAAAAAHTBgEAAAABkwcBAAAAAZQHAQAAAAGVBwEAAAABlgcBAAAAAZgHAAAAmAcDmQcBAAAAAZoHAAAAwgYDmwcQAAAAAZwHAQAAAAGdBwIAAAABnwcAAACfBwKgBwEAAAABoQcBAAAAAaIHAQAAAAGjBwEAAAABpAcBAAAAAaUHAQAAAAGmB4AAAAABpwdAAAAAAakHAQAAAAEBXgAAmAUAMAFeAACYBQAwAQAAAFEAIAEAAAAWACAfBwAAkBIAIDwAAI4SACA9AACPEgAgPwAAkRIAIPQFAQC_DAAh-QUBAMAMACH8BUAAwQwAIf0FQADBDAAhrAYAAI0SqQcirgZAANcMACHTBgEAwAwAIZMHAQDADAAhlAcBAL8MACGVBwEAvwwAIZYHAQDADAAhmAcAAIkSmAcjmQcBAMAMACGaBwAAihLCBiObBxAAixIAIZwHAQC_DAAhnQcCAPUPACGfBwAAjBKfByKgBwEAwAwAIaEHAQDADAAhogcBAMAMACGjBwEAwAwAIaQHAQDADAAhpQcBAMAMACGmB4AAAAABpwdAANcMACGpBwEAwAwAIQIAAADVAQAgXgAAnQUAIBv0BQEAvwwAIfkFAQDADAAh_AVAAMEMACH9BUAAwQwAIawGAACNEqkHIq4GQADXDAAh0wYBAMAMACGTBwEAwAwAIZQHAQC_DAAhlQcBAL8MACGWBwEAwAwAIZgHAACJEpgHI5kHAQDADAAhmgcAAIoSwgYjmwcQAIsSACGcBwEAvwwAIZ0HAgD1DwAhnwcAAIwSnwcioAcBAMAMACGhBwEAwAwAIaIHAQDADAAhowcBAMAMACGkBwEAwAwAIaUHAQDADAAhpgeAAAAAAacHQADXDAAhqQcBAMAMACECAAAA0wEAIF4AAJ8FACACAAAA0wEAIF4AAJ8FACABAAAAUQAgAQAAABYAIAMAAADVAQAgZQAAlgUAIGYAAJ0FACABAAAA1QEAIAEAAADTAQAgGBUAAIQSACBrAACHEgAgbAAAhhIAIO0BAACFEgAg7gEAAIgSACD5BQAAuwwAIK4GAAC7DAAg0wYAALsMACCTBwAAuwwAIJYHAAC7DAAgmAcAALsMACCZBwAAuwwAIJoHAAC7DAAgmwcAALsMACCdBwAAuwwAIKAHAAC7DAAgoQcAALsMACCiBwAAuwwAIKMHAAC7DAAgpAcAALsMACClBwAAuwwAIKYHAAC7DAAgpwcAALsMACCpBwAAuwwAIB7xBQAAmQsAMPIFAACoBQAQ8wUAAJkLADD0BQEApAoAIfkFAQClCgAh_AVAAKYKACH9BUAApgoAIawGAACeC6kHIq4GQADBCgAh0wYBAKUKACGTBwEApQoAIZQHAQCkCgAhlQcBAKQKACGWBwEApQoAIZgHAACaC5gHI5kHAQClCgAhmgcAAJsLwgYjmwcQAJwLACGcBwEApAoAIZ0HAgDqCgAhnwcAAJ0LnwcioAcBAKUKACGhBwEApQoAIaIHAQClCgAhowcBAKUKACGkBwEApQoAIaUHAQClCgAhpgcAAP4KACCnB0AAwQoAIakHAQClCgAhAwAAANMBACABAACnBQAwagAAqAUAIAMAAADTAQAgAQAA1AEAMAIAANUBACABAAAA-gEAIAEAAAD6AQAgAwAAAPgBACABAAD5AQAwAgAA-gEAIAMAAAD4AQAgAQAA-QEAMAIAAPoBACADAAAA-AEAIAEAAPkBADACAAD6AQAgDQcAAIISACAgAACBEgAgPQAAgxIAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAJIHAq4GQAAAAAGKBwEAAAABkAcAAACQBwKSBwEAAAABkwcBAAAAAQFeAACwBQAgCvQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAJIHAq4GQAAAAAGKBwEAAAABkAcAAACQBwKSBwEAAAABkwcBAAAAAQFeAACyBQAwAV4AALIFADABAAAAUQAgDQcAAP8RACAgAAD-EQAgPQAAgBIAIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAP0RkgcirgZAANcMACGKBwEAvwwAIZAHAAD8EZAHIpIHAQDADAAhkwcBAMAMACECAAAA-gEAIF4AALYFACAK9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGsBgAA_RGSByKuBkAA1wwAIYoHAQC_DAAhkAcAAPwRkAcikgcBAMAMACGTBwEAwAwAIQIAAAD4AQAgXgAAuAUAIAIAAAD4AQAgXgAAuAUAIAEAAABRACADAAAA-gEAIGUAALAFACBmAAC2BQAgAQAAAPoBACABAAAA-AEAIAYVAAD5EQAgawAA-xEAIGwAAPoRACCuBgAAuwwAIJIHAAC7DAAgkwcAALsMACAN8QUAAJILADDyBQAAwAUAEPMFAACSCwAw9AUBAKQKACH5BQEApAoAIfwFQACmCgAh_QVAAKYKACGsBgAAlAuSByKuBkAAwQoAIYoHAQCkCgAhkAcAAJMLkAcikgcBAKUKACGTBwEApQoAIQMAAAD4AQAgAQAAvwUAMGoAAMAFACADAAAA-AEAIAEAAPkBADACAAD6AQAgAQAAAF0AIAEAAABdACADAAAAWwAgAQAAXAAwAgAAXQAgAwAAAFsAIAEAAFwAMAIAAF0AIAMAAABbACABAABcADACAABdACAXEAAA4g4AIBgAAOMMACAZAADkDAAgHgAA4AwAIB8AAOEMACAgAADiDAAgIQAA5QwAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGgBgEAAAABrAYAAACIBwKuBkAAAAABsQYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgdAAAAAAQFeAADIBQAgEPQFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGgBgEAAAABrAYAAACIBwKuBkAAAAABsQYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgdAAAAAAQFeAADKBQAwAV4AAMoFADABAAAAUQAgAQAAAFMAIAEAAAAOACABAAAAGAAgFxAAAOAOACAYAADcDAAgGQAA3QwAIB4AANkMACAfAADaDAAgIAAA2wwAICEAAN4MACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGeBgEAwAwAIaAGAQDADAAhrAYAANYMiAcirgZAANcMACGxBgEAwAwAIYYHAADVDIYHIogHAQC_DAAhiQcBAL8MACGKBwEAvwwAIYsHAQDADAAhjAcBAMAMACGNBwEAwAwAIY4HQADBDAAhAgAAAF0AIF4AANEFACAQ9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKIBwEAvwwAIYkHAQC_DAAhigcBAL8MACGLBwEAwAwAIYwHAQDADAAhjQcBAMAMACGOB0AAwQwAIQIAAABbACBeAADTBQAgAgAAAFsAIF4AANMFACABAAAAUQAgAQAAAFMAIAEAAAAOACABAAAAGAAgAwAAAF0AIGUAAMgFACBmAADRBQAgAQAAAF0AIAEAAABbACAKFQAA9hEAIGsAAPgRACBsAAD3EQAgngYAALsMACCgBgAAuwwAIK4GAAC7DAAgsQYAALsMACCLBwAAuwwAIIwHAAC7DAAgjQcAALsMACAT8QUAAIsLADDyBQAA3gUAEPMFAACLCwAw9AUBAKQKACH8BUAApgoAIf0FQACmCgAhngYBAKUKACGgBgEApQoAIawGAACNC4gHIq4GQADBCgAhsQYBAKUKACGGBwAAjAuGByKIBwEApAoAIYkHAQCkCgAhigcBAKQKACGLBwEApQoAIYwHAQClCgAhjQcBAKUKACGOB0AApgoAIQMAAABbACABAADdBQAwagAA3gUAIAMAAABbACABAABcADACAABdACABAAAA7AEAIAEAAADsAQAgAwAAAOoBACABAADrAQAwAgAA7AEAIAMAAADqAQAgAQAA6wEAMAIAAOwBACADAAAA6gEAIAEAAOsBADACAADsAQAgDAcAAPIRACBCAADzEQAgRAAA9BEAIEUAAPURACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAaYGAQAAAAGDBwEAAAABhAcAAACCBwIBXgAA5gUAIAj0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAaYGAQAAAAGDBwEAAAABhAcAAACCBwIBXgAA6AUAMAFeAADoBQAwDAcAANYRACBCAADXEQAgRAAA2BEAIEUAANkRACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAhpgYBAL8MACGDBwEAvwwAIYQHAADQEYIHIgIAAADsAQAgXgAA6wUAIAj0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAhpgYBAL8MACGDBwEAvwwAIYQHAADQEYIHIgIAAADqAQAgXgAA7QUAIAIAAADqAQAgXgAA7QUAIAMAAADsAQAgZQAA5gUAIGYAAOsFACABAAAA7AEAIAEAAADqAQAgAxUAANMRACBrAADVEQAgbAAA1BEAIAvxBQAAigsAMPIFAAD0BQAQ8wUAAIoLADD0BQEApAoAIfkFAQCkCgAh_AVAAKYKACH9BUAApgoAIaUGAQCkCgAhpgYBAKQKACGDBwEApAoAIYQHAACHC4IHIgMAAADqAQAgAQAA8wUAMGoAAPQFACADAAAA6gEAIAEAAOsBADACAADsAQAgAQAAAPABACABAAAA8AEAIAMAAADuAQAgAQAA7wEAMAIAAPABACADAAAA7gEAIAEAAO8BADACAADwAQAgAwAAAO4BACABAADvAQAwAgAA8AEAIAVDAADSEQAg9AUBAAAAAfwFQAAAAAH_BgEAAAABggcAAACCBwIBXgAA_AUAIAT0BQEAAAAB_AVAAAAAAf8GAQAAAAGCBwAAAIIHAgFeAAD-BQAwAV4AAP4FADAFQwAA0REAIPQFAQC_DAAh_AVAAMEMACH_BgEAvwwAIYIHAADQEYIHIgIAAADwAQAgXgAAgQYAIAT0BQEAvwwAIfwFQADBDAAh_wYBAL8MACGCBwAA0BGCByICAAAA7gEAIF4AAIMGACACAAAA7gEAIF4AAIMGACADAAAA8AEAIGUAAPwFACBmAACBBgAgAQAAAPABACABAAAA7gEAIAMVAADNEQAgawAAzxEAIGwAAM4RACAH8QUAAIYLADDyBQAAigYAEPMFAACGCwAw9AUBAKQKACH8BUAApgoAIf8GAQCkCgAhggcAAIcLggciAwAAAO4BACABAACJBgAwagAAigYAIAMAAADuAQAgAQAA7wEAMAIAAPABACABAAAA9AEAIAEAAAD0AQAgAwAAAPIBACABAADzAQAwAgAA9AEAIAMAAADyAQAgAQAA8wEAMAIAAPQBACADAAAA8gEAIAEAAPMBADACAAD0AQAgBgMAAMwRACBDAADLEQAg9AUBAAAAAfsFAQAAAAH_BgEAAAABgAdAAAAAAQFeAACSBgAgBPQFAQAAAAH7BQEAAAAB_wYBAAAAAYAHQAAAAAEBXgAAlAYAMAFeAACUBgAwBgMAAMoRACBDAADJEQAg9AUBAL8MACH7BQEAvwwAIf8GAQC_DAAhgAdAAMEMACECAAAA9AEAIF4AAJcGACAE9AUBAL8MACH7BQEAvwwAIf8GAQC_DAAhgAdAAMEMACECAAAA8gEAIF4AAJkGACACAAAA8gEAIF4AAJkGACADAAAA9AEAIGUAAJIGACBmAACXBgAgAQAAAPQBACABAAAA8gEAIAMVAADGEQAgawAAyBEAIGwAAMcRACAH8QUAAIULADDyBQAAoAYAEPMFAACFCwAw9AUBAKQKACH7BQEApAoAIf8GAQCkCgAhgAdAAKYKACEDAAAA8gEAIAEAAJ8GADBqAACgBgAgAwAAAPIBACABAADzAQAwAgAA9AEAIAEAAAB2ACABAAAAdgAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAAB0ACABAAB1ADACAAB2ACADAAAAdAAgAQAAdQAwAgAAdgAgDgcAAN8PACAJAADgDwAgGwAAxREAIBwAAOEPACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAcUGAQAAAAHVBgEAAAAB7QYgAAAAAf0GEAAAAAH-BhAAAAABAV4AAKgGACAK9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHFBgEAAAAB1QYBAAAAAe0GIAAAAAH9BhAAAAAB_gYQAAAAAQFeAACqBgAwAV4AAKoGADAOBwAA0g8AIAkAANMPACAbAADEEQAgHAAA1A8AIPQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACHFBgEAvwwAIdUGAQC_DAAh7QYgAKEOACH9BhAAxw4AIf4GEADHDgAhAgAAAHYAIF4AAK0GACAK9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIcUGAQC_DAAh1QYBAL8MACHtBiAAoQ4AIf0GEADHDgAh_gYQAMcOACECAAAAdAAgXgAArwYAIAIAAAB0ACBeAACvBgAgAwAAAHYAIGUAAKgGACBmAACtBgAgAQAAAHYAIAEAAAB0ACAFFQAAvxEAIGsAAMIRACBsAADBEQAg7QEAAMARACDuAQAAwxEAIA3xBQAAhAsAMPIFAAC2BgAQ8wUAAIQLADD0BQEApAoAIfkFAQCkCgAh-gUBAKQKACH8BUAApgoAIf0FQACmCgAhxQYBAKQKACHVBgEApAoAIe0GIACyCgAh_QYQANEKACH-BhAA0QoAIQMAAAB0ACABAAC1BgAwagAAtgYAIAMAAAB0ACABAAB1ADACAAB2ACABAAAAVwAgAQAAAFcAIAMAAABVACABAABWADACAABXACADAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIBwHAAD1DgAgCQAA9g4AIBkAAMYPACAbAAD3DgAgHQAA-A4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAawGAAAA8wYCxAYQAAAAAcUGAQAAAAHGBgIAAAAB1QYBAAAAAe8GAQAAAAHxBgAAAPEGAvMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAH3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BoAAAAAB-wZAAAAAAfwGQAAAAAEBXgAAvgYAIBf0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAaAGAQAAAAGsBgAAAPMGAsQGEAAAAAHFBgEAAAABxgYCAAAAAdUGAQAAAAHvBgEAAAAB8QYAAADxBgLzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gaAAAAAAfsGQAAAAAH8BkAAAAABAV4AAMAGADABXgAAwAYAMBwHAADwDgAgCQAA8Q4AIBkAAMQPACAbAADyDgAgHQAA8w4AIPQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACGgBgEAvwwAIawGAADuDvMGIsQGEADHDgAhxQYBAL8MACHGBgIAyA4AIdUGAQC_DAAh7wYBAL8MACHxBgAA7Q7xBiLzBgEAvwwAIfQGAQC_DAAh9QYBAMAMACH2BgEAwAwAIfcGAQDADAAh-AYBAMAMACH5BgEAwAwAIfoGgAAAAAH7BkAAwQwAIfwGQADXDAAhAgAAAFcAIF4AAMMGACAX9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaAGAQC_DAAhrAYAAO4O8wYixAYQAMcOACHFBgEAvwwAIcYGAgDIDgAh1QYBAL8MACHvBgEAvwwAIfEGAADtDvEGIvMGAQC_DAAh9AYBAL8MACH1BgEAwAwAIfYGAQDADAAh9wYBAMAMACH4BgEAwAwAIfkGAQDADAAh-gaAAAAAAfsGQADBDAAh_AZAANcMACECAAAAVQAgXgAAxQYAIAIAAABVACBeAADFBgAgAwAAAFcAIGUAAL4GACBmAADDBgAgAQAAAFcAIAEAAABVACAMFQAAuhEAIGsAAL0RACBsAAC8EQAg7QEAALsRACDuAQAAvhEAIPUGAAC7DAAg9gYAALsMACD3BgAAuwwAIPgGAAC7DAAg-QYAALsMACD6BgAAuwwAIPwGAAC7DAAgGvEFAAD7CgAw8gUAAMwGABDzBQAA-woAMPQFAQCkCgAh-QUBAKQKACH6BQEApAoAIfwFQACmCgAh_QVAAKYKACGgBgEApAoAIawGAAD9CvMGIsQGEADRCgAhxQYBAKQKACHGBgIA0goAIdUGAQCkCgAh7wYBAKQKACHxBgAA_ArxBiLzBgEApAoAIfQGAQCkCgAh9QYBAKUKACH2BgEApQoAIfcGAQClCgAh-AYBAKUKACH5BgEApQoAIfoGAAD-CgAg-wZAAKYKACH8BkAAwQoAIQMAAABVACABAADLBgAwagAAzAYAIAMAAABVACABAABWADACAABXACAQBwAA-goAIPEFAAD5CgAw8gUAAOUBABDzBQAA-QoAMPQFAQAAAAH5BQEAAAAB_AVAALsKACH9BUAAuwoAIecGAQC3CgAh6AYBALcKACHpBgEAtwoAIeoGAQC3CgAh6wYBALcKACHsBgEAtwoAIe0GIAC6CgAh7gYBALgKACEBAAAAzwYAIAEAAADPBgAgAgcAALkRACDuBgAAuwwAIAMAAADlAQAgAQAA0gYAMAIAAM8GACADAAAA5QEAIAEAANIGADACAADPBgAgAwAAAOUBACABAADSBgAwAgAAzwYAIA0HAAC4EQAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GIAAAAAHuBgEAAAABAV4AANYGACAM9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GIAAAAAHuBgEAAAABAV4AANgGADABXgAA2AYAMA0HAAC3EQAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHnBgEAvwwAIegGAQC_DAAh6QYBAL8MACHqBgEAvwwAIesGAQC_DAAh7AYBAL8MACHtBiAAoQ4AIe4GAQDADAAhAgAAAM8GACBeAADbBgAgDPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAh5wYBAL8MACHoBgEAvwwAIekGAQC_DAAh6gYBAL8MACHrBgEAvwwAIewGAQC_DAAh7QYgAKEOACHuBgEAwAwAIQIAAADlAQAgXgAA3QYAIAIAAADlAQAgXgAA3QYAIAMAAADPBgAgZQAA1gYAIGYAANsGACABAAAAzwYAIAEAAADlAQAgBBUAALQRACBrAAC2EQAgbAAAtREAIO4GAAC7DAAgD_EFAAD4CgAw8gUAAOQGABDzBQAA-AoAMPQFAQCkCgAh-QUBAKQKACH8BUAApgoAIf0FQACmCgAh5wYBAKQKACHoBgEApAoAIekGAQCkCgAh6gYBAKQKACHrBgEApAoAIewGAQCkCgAh7QYgALIKACHuBgEApQoAIQMAAADlAQAgAQAA4wYAMGoAAOQGACADAAAA5QEAIAEAANIGADACAADPBgAgEBQAAPcKACDxBQAA9goAMPIFAADqBgAQ8wUAAPYKADD0BQEAAAAB-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIeEGAQC4CgAh4gYBALcKACHjBgAAsAoAIOQGAQC4CgAh5QYBALgKACHmBgEAtwoAIQEAAADnBgAgAQAAAOcGACAQFAAA9woAIPEFAAD2CgAw8gUAAOoGABDzBQAA9goAMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIeEGAQC4CgAh4gYBALcKACHjBgAAsAoAIOQGAQC4CgAh5QYBALgKACHmBgEAtwoAIQUUAACzEQAg-gUAALsMACDhBgAAuwwAIOQGAAC7DAAg5QYAALsMACADAAAA6gYAIAEAAOsGADACAADnBgAgAwAAAOoGACABAADrBgAwAgAA5wYAIAMAAADqBgAgAQAA6wYAMAIAAOcGACANFAAAshEAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAeEGAQAAAAHiBgEAAAAB4wYAALERACDkBgEAAAAB5QYBAAAAAeYGAQAAAAEBXgAA7wYAIAz0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAaUGAQAAAAHhBgEAAAAB4gYBAAAAAeMGAACxEQAg5AYBAAAAAeUGAQAAAAHmBgEAAAABAV4AAPEGADABXgAA8QYAMA0UAACnEQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAh4QYBAMAMACHiBgEAvwwAIeMGAACmEQAg5AYBAMAMACHlBgEAwAwAIeYGAQC_DAAhAgAAAOcGACBeAAD0BgAgDPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGlBgEAvwwAIeEGAQDADAAh4gYBAL8MACHjBgAAphEAIOQGAQDADAAh5QYBAMAMACHmBgEAvwwAIQIAAADqBgAgXgAA9gYAIAIAAADqBgAgXgAA9gYAIAMAAADnBgAgZQAA7wYAIGYAAPQGACABAAAA5wYAIAEAAADqBgAgBxUAAKMRACBrAAClEQAgbAAApBEAIPoFAAC7DAAg4QYAALsMACDkBgAAuwwAIOUGAAC7DAAgD_EFAAD1CgAw8gUAAP0GABDzBQAA9QoAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACGlBgEApAoAIeEGAQClCgAh4gYBAKQKACHjBgAAsAoAIOQGAQClCgAh5QYBAKUKACHmBgEApAoAIQMAAADqBgAgAQAA_AYAMGoAAP0GACADAAAA6gYAIAEAAOsGADACAADnBgAgEBQAAPQKACDxBQAA8woAMPIFAACDBwAQ8wUAAPMKADD0BQEAAAAB-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIeEGAQC4CgAh4gYBALcKACHjBgAAsAoAIOQGAQC4CgAh5QYBALgKACHmBgEAtwoAIQEAAACABwAgAQAAAIAHACAQFAAA9AoAIPEFAADzCgAw8gUAAIMHABDzBQAA8woAMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIeEGAQC4CgAh4gYBALcKACHjBgAAsAoAIOQGAQC4CgAh5QYBALgKACHmBgEAtwoAIQUUAACiEQAg-gUAALsMACDhBgAAuwwAIOQGAAC7DAAg5QYAALsMACADAAAAgwcAIAEAAIQHADACAACABwAgAwAAAIMHACABAACEBwAwAgAAgAcAIAMAAACDBwAgAQAAhAcAMAIAAIAHACANFAAAoREAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAeEGAQAAAAHiBgEAAAAB4wYAAKARACDkBgEAAAAB5QYBAAAAAeYGAQAAAAEBXgAAiAcAIAz0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAaUGAQAAAAHhBgEAAAAB4gYBAAAAAeMGAACgEQAg5AYBAAAAAeUGAQAAAAHmBgEAAAABAV4AAIoHADABXgAAigcAMA0UAACWEQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAh4QYBAMAMACHiBgEAvwwAIeMGAACVEQAg5AYBAMAMACHlBgEAwAwAIeYGAQC_DAAhAgAAAIAHACBeAACNBwAgDPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGlBgEAvwwAIeEGAQDADAAh4gYBAL8MACHjBgAAlREAIOQGAQDADAAh5QYBAMAMACHmBgEAvwwAIQIAAACDBwAgXgAAjwcAIAIAAACDBwAgXgAAjwcAIAMAAACABwAgZQAAiAcAIGYAAI0HACABAAAAgAcAIAEAAACDBwAgBxUAAJIRACBrAACUEQAgbAAAkxEAIPoFAAC7DAAg4QYAALsMACDkBgAAuwwAIOUGAAC7DAAgD_EFAADyCgAw8gUAAJYHABDzBQAA8goAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACGlBgEApAoAIeEGAQClCgAh4gYBAKQKACHjBgAAsAoAIOQGAQClCgAh5QYBAKUKACHmBgEApAoAIQMAAACDBwAgAQAAlQcAMGoAAJYHACADAAAAgwcAIAEAAIQHADACAACABwAgAQAAAB8AIAEAAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACAPBwAAkBEAIAkAAJERACANAACPEQAgDwAAjhEAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAdMGAQAAAAHdBgEAAAAB3gZAAAAAAd8GCAAAAAHgBggAAAABAV4AAJ4HACAL9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAAB0wYBAAAAAd0GAQAAAAHeBkAAAAAB3wYIAAAAAeAGCAAAAAEBXgAAoAcAMAFeAACgBwAwDwcAAN0QACAJAADeEAAgDQAA3BAAIA8AANsQACD0BQEAvwwAIfkFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACHTBgEAwAwAId0GAQDADAAh3gZAANcMACHfBggA8AwAIeAGCADwDAAhAgAAAB8AIF4AAKMHACAL9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAh0wYBAMAMACHdBgEAwAwAId4GQADXDAAh3wYIAPAMACHgBggA8AwAIQIAAAAdACBeAAClBwAgAgAAAB0AIF4AAKUHACADAAAAHwAgZQAAngcAIGYAAKMHACABAAAAHwAgAQAAAB0AIAoVAADWEAAgawAA2RAAIGwAANgQACDtAQAA1xAAIO4BAADaEAAg0wYAALsMACDdBgAAuwwAIN4GAAC7DAAg3wYAALsMACDgBgAAuwwAIA7xBQAA8QoAMPIFAACsBwAQ8wUAAPEKADD0BQEApAoAIfkFAQCkCgAh-gUBAKQKACH8BUAApgoAIf0FQACmCgAhpQYBAKQKACHTBgEApQoAId0GAQClCgAh3gZAAMEKACHfBggAywoAIeAGCADLCgAhAwAAAB0AIAEAAKsHADBqAACsBwAgAwAAAB0AIAEAAB4AMAIAAB8AIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgEAcAAIYOACAJAACHDgAgKAAAhA4AICkAALgQACArAACFDgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGyBgEAAAABzQYBAAAAAdMGAQAAAAHaBgEAAAAB2wYBAAAAAdwGAQAAAAEBXgAAtAcAIAv0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAbIGAQAAAAHNBgEAAAAB0wYBAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAQFeAAC2BwAwAV4AALYHADABAAAAFgAgAQAAABgAIBAHAACBDgAgCQAAgg4AICgAAP8NACApAAC2EAAgKwAAgA4AIPQFAQC_DAAh-QUBAMAMACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGyBgEAvwwAIc0GAQC_DAAh0wYBAMAMACHaBgEAwAwAIdsGAQC_DAAh3AYBAL8MACECAAAALAAgXgAAuwcAIAv0BQEAvwwAIfkFAQDADAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhsgYBAL8MACHNBgEAvwwAIdMGAQDADAAh2gYBAMAMACHbBgEAvwwAIdwGAQC_DAAhAgAAACoAIF4AAL0HACACAAAAKgAgXgAAvQcAIAEAAAAWACABAAAAGAAgAwAAACwAIGUAALQHACBmAAC7BwAgAQAAACwAIAEAAAAqACAHFQAA0xAAIGsAANUQACBsAADUEAAg-QUAALsMACD6BQAAuwwAINMGAAC7DAAg2gYAALsMACAO8QUAAPAKADDyBQAAxgcAEPMFAADwCgAw9AUBAKQKACH5BQEApQoAIfoFAQClCgAh_AVAAKYKACH9BUAApgoAIbIGAQCkCgAhzQYBAKQKACHTBgEApQoAIdoGAQClCgAh2wYBAKQKACHcBgEApAoAIQMAAAAqACABAADFBwAwagAAxgcAIAMAAAAqACABAAArADACAAAsACABAAAAMwAgAQAAADMAIAMAAAAxACABAAAyADACAAAzACADAAAAMQAgAQAAMgAwAgAAMwAgAwAAADEAIAEAADIAMAIAADMAIA8HAAC7EAAgCQAAvBAAIAsAALoQACAbAADSEAAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAANoGAs0GAQAAAAHTBgEAAAAB1QYBAAAAAdcGAQAAAAHYBgEAAAABAV4AAM4HACAL9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAANoGAs0GAQAAAAHTBgEAAAAB1QYBAAAAAdcGAQAAAAHYBgEAAAABAV4AANAHADABXgAA0AcAMAEAAAAvACABAAAAFgAgAQAAABgAIA8HAACsEAAgCQAArRAAIAsAAKsQACAbAADREAAg9AUBAL8MACH5BQEAwAwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIawGAACpENoGIs0GAQC_DAAh0wYBAMAMACHVBgEAwAwAIdcGAQC_DAAh2AYBAL8MACECAAAAMwAgXgAA1gcAIAv0BQEAvwwAIfkFAQDADAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhrAYAAKkQ2gYizQYBAL8MACHTBgEAwAwAIdUGAQDADAAh1wYBAL8MACHYBgEAvwwAIQIAAAAxACBeAADYBwAgAgAAADEAIF4AANgHACABAAAALwAgAQAAABYAIAEAAAAYACADAAAAMwAgZQAAzgcAIGYAANYHACABAAAAMwAgAQAAADEAIAcVAADOEAAgawAA0BAAIGwAAM8QACD5BQAAuwwAIPoFAAC7DAAg0wYAALsMACDVBgAAuwwAIA7xBQAA7AoAMPIFAADiBwAQ8wUAAOwKADD0BQEApAoAIfkFAQClCgAh-gUBAKUKACH8BUAApgoAIf0FQACmCgAhrAYAAO0K2gYizQYBAKQKACHTBgEApQoAIdUGAQClCgAh1wYBAKQKACHYBgEApAoAIQMAAAAxACABAADhBwAwagAA4gcAIAMAAAAxACABAAAyADACAAAzACABAAAANwAgAQAAADcAIAMAAAA1ACABAAA2ADACAAA3ACADAAAANQAgAQAANgAwAgAANwAgAwAAADUAIAEAADYAMAIAADcAIBEHAACcEAAgCQAAnRAAIA0AAJkQACARAACaEAAgGwAAzRAAICQAAJsQACAmAACeEAAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdQGAgAAAAHVBgEAAAAB1gYBAAAAAQFeAADqBwAgCvQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAdMGAQAAAAHUBgIAAAAB1QYBAAAAAdYGAQAAAAEBXgAA7AcAMAFeAADsBwAwAQAAABgAIAEAAABrACARBwAA-g8AIAkAAPsPACANAAD3DwAgEQAA-A8AIBsAAMwQACAkAAD5DwAgJgAA_A8AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIdMGAQDADAAh1AYCAPUPACHVBgEAvwwAIdYGAQDADAAhAgAAADcAIF4AAPEHACAK9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACHUBgIA9Q8AIdUGAQC_DAAh1gYBAMAMACECAAAANQAgXgAA8wcAIAIAAAA1ACBeAADzBwAgAQAAABgAIAEAAABrACADAAAANwAgZQAA6gcAIGYAAPEHACABAAAANwAgAQAAADUAIAkVAADHEAAgawAAyhAAIGwAAMkQACDtAQAAyBAAIO4BAADLEAAg-gUAALsMACDTBgAAuwwAINQGAAC7DAAg1gYAALsMACAN8QUAAOkKADDyBQAA_AcAEPMFAADpCgAw9AUBAKQKACH5BQEApAoAIfoFAQClCgAh_AVAAKYKACH9BUAApgoAIc0GAQCkCgAh0wYBAKUKACHUBgIA6goAIdUGAQCkCgAh1gYBAKUKACEDAAAANQAgAQAA-wcAMGoAAPwHACADAAAANQAgAQAANgAwAgAANwAgDQwAAOQKACANAADmCgAgHAAA6AoAICUAAOUKACAnAADnCgAg8QUAAOMKADDyBQAALwAQ8wUAAOMKADD0BQEAAAAB-QUBALcKACHNBgEAtwoAIc4GQAC7CgAhzwZAALsKACEBAAAA_wcAIAEAAAD_BwAgBQwAAMIQACANAADEEAAgHAAAxhAAICUAAMMQACAnAADFEAAgAwAAAC8AIAEAAIIIADACAAD_BwAgAwAAAC8AIAEAAIIIADACAAD_BwAgAwAAAC8AIAEAAIIIADACAAD_BwAgCgwAAL0QACANAAC_EAAgHAAAwRAAICUAAL4QACAnAADAEAAg9AUBAAAAAfkFAQAAAAHNBgEAAAABzgZAAAAAAc8GQAAAAAEBXgAAhggAIAX0BQEAAAAB-QUBAAAAAc0GAQAAAAHOBkAAAAABzwZAAAAAAQFeAACICAAwAV4AAIgIADAKDAAAtw8AIA0AALkPACAcAAC7DwAgJQAAuA8AICcAALoPACD0BQEAvwwAIfkFAQC_DAAhzQYBAL8MACHOBkAAwQwAIc8GQADBDAAhAgAAAP8HACBeAACLCAAgBfQFAQC_DAAh-QUBAL8MACHNBgEAvwwAIc4GQADBDAAhzwZAAMEMACECAAAALwAgXgAAjQgAIAIAAAAvACBeAACNCAAgAwAAAP8HACBlAACGCAAgZgAAiwgAIAEAAAD_BwAgAQAAAC8AIAMVAAC0DwAgawAAtg8AIGwAALUPACAI8QUAAOIKADDyBQAAlAgAEPMFAADiCgAw9AUBAKQKACH5BQEApAoAIc0GAQCkCgAhzgZAAKYKACHPBkAApgoAIQMAAAAvACABAACTCAAwagAAlAgAIAMAAAAvACABAACCCAAwAgAA_wcAIA0XAAC8CgAg8QUAAOEKADDyBQAArQIAEPMFAADhCgAw9AUBAAAAAfwFQAC7CgAh_QVAALsKACGKBgEAtwoAIYsGAQC3CgAhkAYAALkKACCSBiAAugoAIcsGAQAAAAHMBgAAsAoAIAEAAACXCAAgAQAAAJcIACABFwAApg4AIAMAAACtAgAgAQAAmggAMAIAAJcIACADAAAArQIAIAEAAJoIADACAACXCAAgAwAAAK0CACABAACaCAAwAgAAlwgAIAoXAACzDwAg9AUBAAAAAfwFQAAAAAH9BUAAAAABigYBAAAAAYsGAQAAAAGQBoAAAAABkgYgAAAAAcsGAQAAAAHMBgAAsg8AIAFeAACeCAAgCfQFAQAAAAH8BUAAAAAB_QVAAAAAAYoGAQAAAAGLBgEAAAABkAaAAAAAAZIGIAAAAAHLBgEAAAABzAYAALIPACABXgAAoAgAMAFeAACgCAAwChcAALEPACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGKBgEAvwwAIYsGAQC_DAAhkAaAAAAAAZIGIAChDgAhywYBAL8MACHMBgAAsA8AIAIAAACXCAAgXgAAowgAIAn0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGKBgEAvwwAIYsGAQC_DAAhkAaAAAAAAZIGIAChDgAhywYBAL8MACHMBgAAsA8AIAIAAACtAgAgXgAApQgAIAIAAACtAgAgXgAApQgAIAMAAACXCAAgZQAAnggAIGYAAKMIACABAAAAlwgAIAEAAACtAgAgAxUAAK0PACBrAACvDwAgbAAArg8AIAzxBQAA4AoAMPIFAACsCAAQ8wUAAOAKADD0BQEApAoAIfwFQACmCgAh_QVAAKYKACGKBgEApAoAIYsGAQCkCgAhkAYAALEKACCSBiAAsgoAIcsGAQCkCgAhzAYAALAKACADAAAArQIAIAEAAKsIADBqAACsCAAgAwAAAK0CACABAACaCAAwAgAAlwgAIAEAAABNACABAAAATQAgAwAAAEsAIAEAAEwAMAIAAE0AIAMAAABLACABAABMADACAABNACADAAAASwAgAQAATAAwAgAATQAgEBYAAIkPACAXAACKDwAgGAAAiw8AIBkAAKwPACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABqgYBAAAAAawGAAAAywYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAHLBgEAAAABAV4AALQIACAM9AUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAaoGAQAAAAGsBgAAAMsGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABywYBAAAAAQFeAAC2CAAwAV4AALYIADABAAAAUQAgAQAAAFMAIBAWAACFDwAgFwAAhg8AIBgAAIcPACAZAACrDwAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhoAYBAMAMACGqBgEAwAwAIawGAACDD8sGIq0GAQDADAAhrgZAANcMACGvBkAAwQwAIbAGAQC_DAAhsQYBAMAMACHLBgEAvwwAIQIAAABNACBeAAC7CAAgDPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaAGAQDADAAhqgYBAMAMACGsBgAAgw_LBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIbEGAQDADAAhywYBAL8MACECAAAASwAgXgAAvQgAIAIAAABLACBeAAC9CAAgAQAAAFEAIAEAAABTACADAAAATQAgZQAAtAgAIGYAALsIACABAAAATQAgAQAAAEsAIAgVAACoDwAgawAAqg8AIGwAAKkPACCgBgAAuwwAIKoGAAC7DAAgrQYAALsMACCuBgAAuwwAILEGAAC7DAAgD_EFAADcCgAw8gUAAMYIABDzBQAA3AoAMPQFAQCkCgAh_AVAAKYKACH9BUAApgoAIaAGAQClCgAhqgYBAKUKACGsBgAA3QrLBiKtBgEApQoAIa4GQADBCgAhrwZAAKYKACGwBgEApAoAIbEGAQClCgAhywYBAKQKACEDAAAASwAgAQAAxQgAMGoAAMYIACADAAAASwAgAQAATAAwAgAATQAgAQAAAJ0BACABAAAAnQEAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAABTACABAACcAQAwAgAAnQEAIAMAAABTACABAACcAQAwAgAAnQEAIBADAACiDwAgBwAAoA8AIAkAAKEPACANAACjDwAgEwAApA8AIBoAAKUPACAcAACmDwAgIgAApw8AIPQFAQAAAAH4BQEAAAAB-QUBAAAAAfoFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAHJBgEAAAABAV4AAM4IACAI9AUBAAAAAfgFAQAAAAH5BQEAAAAB-gUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAckGAQAAAAEBXgAA0AgAMAFeAADQCAAwAQAAABgAIBADAADSDgAgBwAA0A4AIAkAANEOACANAADTDgAgEwAA1A4AIBoAANUOACAcAADWDgAgIgAA1w4AIPQFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQDADAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhyQYBAL8MACECAAAAnQEAIF4AANQIACAI9AUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-gUBAMAMACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACHJBgEAvwwAIQIAAABTACBeAADWCAAgAgAAAFMAIF4AANYIACABAAAAGAAgAwAAAJ0BACBlAADOCAAgZgAA1AgAIAEAAACdAQAgAQAAAFMAIAUVAADNDgAgawAAzw4AIGwAAM4OACD4BQAAuwwAIPoFAAC7DAAgC_EFAADbCgAw8gUAAN4IABDzBQAA2woAMPQFAQCkCgAh-AUBAKUKACH5BQEApAoAIfoFAQClCgAh-wUBAKQKACH8BUAApgoAIf0FQACmCgAhyQYBAKQKACEDAAAAUwAgAQAA3QgAMGoAAN4IACADAAAAUwAgAQAAnAEAMAIAAJ0BACABAAAA2wEAIAEAAADbAQAgAwAAANkBACABAADaAQAwAgAA2wEAIAMAAADZAQAgAQAA2gEAMAIAANsBACADAAAA2QEAIAEAANoBADACAADbAQAgDgcAAMsOACA-AADMDgAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAxAYCwAYBAAAAAcIGAAAAwgYCxAYQAAAAAcUGAQAAAAHGBgIAAAABxwZAAAAAAcgGQAAAAAEBXgAA5ggAIAz0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAADEBgLABgEAAAABwgYAAADCBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHHBkAAAAAByAZAAAAAAQFeAADoCAAwAV4AAOgIADABAAAA0wEAIA4HAADJDgAgPgAAyg4AIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAMYOxAYiwAYBAMAMACHCBgAAxQ7CBiLEBhAAxw4AIcUGAQC_DAAhxgYCAMgOACHHBkAAwQwAIcgGQADBDAAhAgAAANsBACBeAADsCAAgDPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAMYOxAYiwAYBAMAMACHCBgAAxQ7CBiLEBhAAxw4AIcUGAQC_DAAhxgYCAMgOACHHBkAAwQwAIcgGQADBDAAhAgAAANkBACBeAADuCAAgAgAAANkBACBeAADuCAAgAQAAANMBACADAAAA2wEAIGUAAOYIACBmAADsCAAgAQAAANsBACABAAAA2QEAIAYVAADADgAgawAAww4AIGwAAMIOACDtAQAAwQ4AIO4BAADEDgAgwAYAALsMACAP8QUAAM4KADDyBQAA9ggAEPMFAADOCgAw9AUBAKQKACH5BQEApAoAIfwFQACmCgAh_QVAAKYKACGsBgAA0ArEBiLABgEApQoAIcIGAADPCsIGIsQGEADRCgAhxQYBAKQKACHGBgIA0goAIccGQACmCgAhyAZAAKYKACEDAAAA2QEAIAEAAPUIADBqAAD2CAAgAwAAANkBACABAADaAQAwAgAA2wEAIAEAAACtAQAgAQAAAK0BACADAAAAiQEAIAEAAKwBADACAACtAQAgAwAAAIkBACABAACsAQAwAgAArQEAIAMAAACJAQAgAQAArAEAMAIAAK0BACAYBwAA9wwAIAkAAPgMACAQAADmDQAgKQAA9gwAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAbIGAQAAAAGzBggAAAABtAYIAAAAAbUGCAAAAAG2BggAAAABtwYIAAAAAbgGCAAAAAG5BggAAAABugYIAAAAAbsGCAAAAAG8BggAAAABvQYIAAAAAb4GCAAAAAG_BggAAAABAV4AAP4IACAU9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGeBgEAAAABsgYBAAAAAbMGCAAAAAG0BggAAAABtQYIAAAAAbYGCAAAAAG3BggAAAABuAYIAAAAAbkGCAAAAAG6BggAAAABuwYIAAAAAbwGCAAAAAG9BggAAAABvgYIAAAAAb8GCAAAAAEBXgAAgAkAMAFeAACACQAwAQAAABgAIBgHAADzDAAgCQAA9AwAIBAAAOUNACApAADyDAAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZ4GAQC_DAAhsgYBAL8MACGzBggA8AwAIbQGCADwDAAhtQYIAPAMACG2BggA8AwAIbcGCADwDAAhuAYIAPAMACG5BggA8AwAIboGCADwDAAhuwYIAPAMACG8BggA8AwAIb0GCADwDAAhvgYIAPAMACG_BggA8AwAIQIAAACtAQAgXgAAhAkAIBT0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhngYBAL8MACGyBgEAvwwAIbMGCADwDAAhtAYIAPAMACG1BggA8AwAIbYGCADwDAAhtwYIAPAMACG4BggA8AwAIbkGCADwDAAhugYIAPAMACG7BggA8AwAIbwGCADwDAAhvQYIAPAMACG-BggA8AwAIb8GCADwDAAhAgAAAIkBACBeAACGCQAgAgAAAIkBACBeAACGCQAgAQAAABgAIAMAAACtAQAgZQAA_ggAIGYAAIQJACABAAAArQEAIAEAAACJAQAgExUAALsOACBrAAC-DgAgbAAAvQ4AIO0BAAC8DgAg7gEAAL8OACD6BQAAuwwAILMGAAC7DAAgtAYAALsMACC1BgAAuwwAILYGAAC7DAAgtwYAALsMACC4BgAAuwwAILkGAAC7DAAgugYAALsMACC7BgAAuwwAILwGAAC7DAAgvQYAALsMACC-BgAAuwwAIL8GAAC7DAAgF_EFAADKCgAw8gUAAI4JABDzBQAAygoAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACGeBgEApAoAIbIGAQCkCgAhswYIAMsKACG0BggAywoAIbUGCADLCgAhtgYIAMsKACG3BggAywoAIbgGCADLCgAhuQYIAMsKACG6BggAywoAIbsGCADLCgAhvAYIAMsKACG9BggAywoAIb4GCADLCgAhvwYIAMsKACEDAAAAiQEAIAEAAI0JADBqAACOCQAgAwAAAIkBACABAACsAQAwAgAArQEAIAEAAACjAQAgAQAAAKMBACADAAAAoQEAIAEAAKIBADACAACjAQAgAwAAAKEBACABAACiAQAwAgAAowEAIAMAAAChAQAgAQAAogEAMAIAAKMBACAUBwAAjg0AIAkAAI8NACAQAAC6DgAgFgAAiw0AIBgAAI0NACAzAACMDQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGJBgEAAAABngYBAAAAAaoGAQAAAAGsBgAAAKwGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABAV4AAJYJACAO9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGJBgEAAAABngYBAAAAAaoGAQAAAAGsBgAAAKwGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABAV4AAJgJADABXgAAmAkAMAEAAABRACABAAAADgAgAQAAABgAIBQHAACIDQAgCQAAiQ0AIBAAALkOACAWAACFDQAgGAAAhw0AIDMAAIYNACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhiQYBAL8MACGeBgEAwAwAIaoGAQDADAAhrAYAAIMNrAYirQYBAMAMACGuBkAA1wwAIa8GQADBDAAhsAYBAL8MACGxBgEAwAwAIQIAAACjAQAgXgAAngkAIA70BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhiQYBAL8MACGeBgEAwAwAIaoGAQDADAAhrAYAAIMNrAYirQYBAMAMACGuBkAA1wwAIa8GQADBDAAhsAYBAL8MACGxBgEAwAwAIQIAAAChAQAgXgAAoAkAIAIAAAChAQAgXgAAoAkAIAEAAABRACABAAAADgAgAQAAABgAIAMAAACjAQAgZQAAlgkAIGYAAJ4JACABAAAAowEAIAEAAAChAQAgCRUAALYOACBrAAC4DgAgbAAAtw4AIPoFAAC7DAAgngYAALsMACCqBgAAuwwAIK0GAAC7DAAgrgYAALsMACCxBgAAuwwAIBHxBQAAxgoAMPIFAACqCQAQ8wUAAMYKADD0BQEApAoAIfkFAQCkCgAh-gUBAKUKACH8BUAApgoAIf0FQACmCgAhiQYBAKQKACGeBgEApQoAIaoGAQClCgAhrAYAAMcKrAYirQYBAKUKACGuBkAAwQoAIa8GQACmCgAhsAYBAKQKACGxBgEApQoAIQMAAAChAQAgAQAAqQkAMGoAAKoJACADAAAAoQEAIAEAAKIBADACAACjAQAgAQAAAEEAIAEAAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAAA_ACABAABAADACAABBACAQBwAAtA0AIAkAALUNACAOAACzDQAgEAAAtQ4AICMAALYNACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGeBgEAAAABpQYBAAAAAaYGAQAAAAGoBgAAAKgGAqkGQAAAAAEBXgAAsgkAIAv0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGeBgEAAAABpQYBAAAAAaYGAQAAAAGoBgAAAKgGAqkGQAAAAAEBXgAAtAkAMAFeAAC0CQAwAQAAABgAIBAHAACdDQAgCQAAng0AIA4AAJwNACAQAAC0DgAgIwAAnw0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ4GAQC_DAAhpQYBAL8MACGmBgEAwAwAIagGAACaDagGIqkGQADXDAAhAgAAAEEAIF4AALgJACAL9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhngYBAL8MACGlBgEAvwwAIaYGAQDADAAhqAYAAJoNqAYiqQZAANcMACECAAAAPwAgXgAAugkAIAIAAAA_ACBeAAC6CQAgAQAAABgAIAMAAABBACBlAACyCQAgZgAAuAkAIAEAAABBACABAAAAPwAgBhUAALEOACBrAACzDgAgbAAAsg4AIPoFAAC7DAAgpgYAALsMACCpBgAAuwwAIA7xBQAAvwoAMPIFAADCCQAQ8wUAAL8KADD0BQEApAoAIfkFAQCkCgAh-gUBAKUKACH8BUAApgoAIf0FQACmCgAhnAYBAKQKACGeBgEApAoAIaUGAQCkCgAhpgYBAKUKACGoBgAAwAqoBiKpBkAAwQoAIQMAAAA_ACABAADBCQAwagAAwgkAIAMAAAA_ACABAABAADACAABBACABAAAARgAgAQAAAEYAIAMAAABEACABAABFADACAABGACADAAAARAAgAQAARQAwAgAARgAgAwAAAEQAIAEAAEUAMAIAAEYAIA8HAACwDQAgCQAAsQ0AIBIAALAOACAZAACvDQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBgEAAAABowYBAAAAAaQGQAAAAAEBXgAAygkAIAv0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ8GAQAAAAGgBgEAAAABoQYBAAAAAaIGAQAAAAGjBgEAAAABpAZAAAAAAQFeAADMCQAwAV4AAMwJADABAAAAGAAgDwcAAKwNACAJAACtDQAgEgAArw4AIBkAAKsNACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnwYBAL8MACGgBgEAvwwAIaEGAQDADAAhogYBAMAMACGjBgEAwAwAIaQGQADBDAAhAgAAAEYAIF4AANAJACAL9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZ8GAQC_DAAhoAYBAL8MACGhBgEAwAwAIaIGAQDADAAhowYBAMAMACGkBkAAwQwAIQIAAABEACBeAADSCQAgAgAAAEQAIF4AANIJACABAAAAGAAgAwAAAEYAIGUAAMoJACBmAADQCQAgAQAAAEYAIAEAAABEACAHFQAArA4AIGsAAK4OACBsAACtDgAg-gUAALsMACChBgAAuwwAIKIGAAC7DAAgowYAALsMACAO8QUAAL4KADDyBQAA2gkAEPMFAAC-CgAw9AUBAKQKACH5BQEApAoAIfoFAQClCgAh_AVAAKYKACH9BUAApgoAIZ8GAQCkCgAhoAYBAKQKACGhBgEApQoAIaIGAQClCgAhowYBAKUKACGkBkAApgoAIQMAAABEACABAADZCQAwagAA2gkAIAMAAABEACABAABFADACAABGACABAAAAPAAgAQAAADwAIAMAAAA6ACABAAA7ADACAAA8ACADAAAAOgAgAQAAOwAwAgAAPAAgAwAAADoAIAEAADsAMAIAADwAIA0HAADJDQAgCQAAyg0AIA4AAMcNACAPAADIDQAgEAAAqw4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABAV4AAOIJACAI9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAEBXgAA5AkAMAFeAADkCQAwAQAAABgAIA0HAADEDQAgCQAAxQ0AIA4AAMINACAPAADDDQAgEAAAqg4AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhngYBAL8MACECAAAAPAAgXgAA6AkAIAj0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhAgAAADoAIF4AAOoJACACAAAAOgAgXgAA6gkAIAEAAAAYACADAAAAPAAgZQAA4gkAIGYAAOgJACABAAAAPAAgAQAAADoAIAQVAACnDgAgawAAqQ4AIGwAAKgOACD6BQAAuwwAIAvxBQAAvQoAMPIFAADyCQAQ8wUAAL0KADD0BQEApAoAIfkFAQCkCgAh-gUBAKUKACH8BUAApgoAIf0FQACmCgAhnAYBAKQKACGdBgEApAoAIZ4GAQCkCgAhAwAAADoAIAEAAPEJADBqAADyCQAgAwAAADoAIAEAADsAMAIAADwAIBEzAAC8CgAg8QUAALYKADDyBQAAqQIAEPMFAAC2CgAw9AUBAAAAAfwFQAC7CgAh_QVAALsKACGJBgEAAAABigYBALcKACGLBgEAtwoAIYwGAQC3CgAhjQYBALgKACGOBgAAsAoAII8GAACwCgAgkAYAALkKACCRBgAAuQoAIJIGIAC6CgAhAQAAAPUJACABAAAA9QkAIAIzAACmDgAgjQYAALsMACADAAAAqQIAIAEAAPgJADACAAD1CQAgAwAAAKkCACABAAD4CQAwAgAA9QkAIAMAAACpAgAgAQAA-AkAMAIAAPUJACAOMwAApQ4AIPQFAQAAAAH8BUAAAAAB_QVAAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBgEAAAABjgYAAKMOACCPBgAApA4AIJAGgAAAAAGRBoAAAAABkgYgAAAAAQFeAAD8CQAgDfQFAQAAAAH8BUAAAAAB_QVAAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAYwGAQAAAAGNBgEAAAABjgYAAKMOACCPBgAApA4AIJAGgAAAAAGRBoAAAAABkgYgAAAAAQFeAAD-CQAwAV4AAP4JADAOMwAAog4AIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIYkGAQC_DAAhigYBAL8MACGLBgEAvwwAIYwGAQC_DAAhjQYBAMAMACGOBgAAnw4AII8GAACgDgAgkAaAAAAAAZEGgAAAAAGSBiAAoQ4AIQIAAAD1CQAgXgAAgQoAIA30BQEAvwwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIYoGAQC_DAAhiwYBAL8MACGMBgEAvwwAIY0GAQDADAAhjgYAAJ8OACCPBgAAoA4AIJAGgAAAAAGRBoAAAAABkgYgAKEOACECAAAAqQIAIF4AAIMKACACAAAAqQIAIF4AAIMKACADAAAA9QkAIGUAAPwJACBmAACBCgAgAQAAAPUJACABAAAAqQIAIAQVAACcDgAgawAAng4AIGwAAJ0OACCNBgAAuwwAIBDxBQAArwoAMPIFAACKCgAQ8wUAAK8KADD0BQEApAoAIfwFQACmCgAh_QVAAKYKACGJBgEApAoAIYoGAQCkCgAhiwYBAKQKACGMBgEApAoAIY0GAQClCgAhjgYAALAKACCPBgAAsAoAIJAGAACxCgAgkQYAALEKACCSBiAAsgoAIQMAAACpAgAgAQAAiQoAMGoAAIoKACADAAAAqQIAIAEAAPgJADACAAD1CQAgAQAAABAAIAEAAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAAAOACABAAAPADACAAAQACATAwAAmw4AIAcAAJMOACAJAACaDgAgDQAAlA4AIBEAAJUOACAiAACZDgAgJAAAlg4AIEoAAJcOACBLAACYDgAg9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQEAAAAB-gUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAQFeAACSCgAgCvQFAQAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAEBXgAAlAoAMAFeAACUCgAwEwMAAMoMACAHAADCDAAgCQAAyQwAIA0AAMMMACARAADEDAAgIgAAyAwAICQAAMUMACBKAADGDAAgSwAAxwwAIPQFAQC_DAAh9QUBAL8MACH2BQEAvwwAIfcFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhAgAAABAAIF4AAJcKACAK9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-gUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACECAAAADgAgXgAAmQoAIAIAAAAOACBeAACZCgAgAwAAABAAIGUAAJIKACBmAACXCgAgAQAAABAAIAEAAAAOACAEFQAAvAwAIGsAAL4MACBsAAC9DAAg-AUAALsMACAN8QUAAKMKADDyBQAAoAoAEPMFAACjCgAw9AUBAKQKACH1BQEApAoAIfYFAQCkCgAh9wUBAKQKACH4BQEApQoAIfkFAQCkCgAh-gUBAKQKACH7BQEApAoAIfwFQACmCgAh_QVAAKYKACEDAAAADgAgAQAAnwoAMGoAAKAKACADAAAADgAgAQAADwAwAgAAEAAgDfEFAACjCgAw8gUAAKAKABDzBQAAowoAMPQFAQCkCgAh9QUBAKQKACH2BQEApAoAIfcFAQCkCgAh-AUBAKUKACH5BQEApAoAIfoFAQCkCgAh-wUBAKQKACH8BUAApgoAIf0FQACmCgAhDhUAAKgKACBrAACuCgAgbAAArgoAIP4FAQAAAAH_BQEAAAAEgAYBAAAABIEGAQAAAAGCBgEAAAABgwYBAAAAAYQGAQAAAAGFBgEArQoAIYYGAQAAAAGHBgEAAAABiAYBAAAAAQ4VAACrCgAgawAArAoAIGwAAKwKACD-BQEAAAAB_wUBAAAABYAGAQAAAAWBBgEAAAABggYBAAAAAYMGAQAAAAGEBgEAAAABhQYBAKoKACGGBgEAAAABhwYBAAAAAYgGAQAAAAELFQAAqAoAIGsAAKkKACBsAACpCgAg_gVAAAAAAf8FQAAAAASABkAAAAAEgQZAAAAAAYIGQAAAAAGDBkAAAAABhAZAAAAAAYUGQACnCgAhCxUAAKgKACBrAACpCgAgbAAAqQoAIP4FQAAAAAH_BUAAAAAEgAZAAAAABIEGQAAAAAGCBkAAAAABgwZAAAAAAYQGQAAAAAGFBkAApwoAIQj-BQIAAAAB_wUCAAAABIAGAgAAAASBBgIAAAABggYCAAAAAYMGAgAAAAGEBgIAAAABhQYCAKgKACEI_gVAAAAAAf8FQAAAAASABkAAAAAEgQZAAAAAAYIGQAAAAAGDBkAAAAABhAZAAAAAAYUGQACpCgAhDhUAAKsKACBrAACsCgAgbAAArAoAIP4FAQAAAAH_BQEAAAAFgAYBAAAABYEGAQAAAAGCBgEAAAABgwYBAAAAAYQGAQAAAAGFBgEAqgoAIYYGAQAAAAGHBgEAAAABiAYBAAAAAQj-BQIAAAAB_wUCAAAABYAGAgAAAAWBBgIAAAABggYCAAAAAYMGAgAAAAGEBgIAAAABhQYCAKsKACEL_gUBAAAAAf8FAQAAAAWABgEAAAAFgQYBAAAAAYIGAQAAAAGDBgEAAAABhAYBAAAAAYUGAQCsCgAhhgYBAAAAAYcGAQAAAAGIBgEAAAABDhUAAKgKACBrAACuCgAgbAAArgoAIP4FAQAAAAH_BQEAAAAEgAYBAAAABIEGAQAAAAGCBgEAAAABgwYBAAAAAYQGAQAAAAGFBgEArQoAIYYGAQAAAAGHBgEAAAABiAYBAAAAAQv-BQEAAAAB_wUBAAAABIAGAQAAAASBBgEAAAABggYBAAAAAYMGAQAAAAGEBgEAAAABhQYBAK4KACGGBgEAAAABhwYBAAAAAYgGAQAAAAEQ8QUAAK8KADDyBQAAigoAEPMFAACvCgAw9AUBAKQKACH8BUAApgoAIf0FQACmCgAhiQYBAKQKACGKBgEApAoAIYsGAQCkCgAhjAYBAKQKACGNBgEApQoAIY4GAACwCgAgjwYAALAKACCQBgAAsQoAIJEGAACxCgAgkgYgALIKACEE_gUBAAAABZkGAQAAAAGaBgEAAAAEmwYBAAAABA8VAACoCgAgawAAtQoAIGwAALUKACD-BYAAAAABgQaAAAAAAYIGgAAAAAGDBoAAAAABhAaAAAAAAYUGgAAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAGWBoAAAAABlwaAAAAAAZgGgAAAAAEFFQAAqAoAIGsAALQKACBsAAC0CgAg_gUgAAAAAYUGIACzCgAhBRUAAKgKACBrAAC0CgAgbAAAtAoAIP4FIAAAAAGFBiAAswoAIQL-BSAAAAABhQYgALQKACEM_gWAAAAAAYEGgAAAAAGCBoAAAAABgwaAAAAAAYQGgAAAAAGFBoAAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgaAAAAAAZcGgAAAAAGYBoAAAAABETMAALwKACDxBQAAtgoAMPIFAACpAgAQ8wUAALYKADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGJBgEAtwoAIYoGAQC3CgAhiwYBALcKACGMBgEAtwoAIY0GAQC4CgAhjgYAALAKACCPBgAAsAoAIJAGAAC5CgAgkQYAALkKACCSBiAAugoAIQv-BQEAAAAB_wUBAAAABIAGAQAAAASBBgEAAAABggYBAAAAAYMGAQAAAAGEBgEAAAABhQYBAK4KACGGBgEAAAABhwYBAAAAAYgGAQAAAAEL_gUBAAAAAf8FAQAAAAWABgEAAAAFgQYBAAAAAYIGAQAAAAGDBgEAAAABhAYBAAAAAYUGAQCsCgAhhgYBAAAAAYcGAQAAAAGIBgEAAAABDP4FgAAAAAGBBoAAAAABggaAAAAAAYMGgAAAAAGEBoAAAAABhQaAAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAZYGgAAAAAGXBoAAAAABmAaAAAAAAQL-BSAAAAABhQYgALQKACEI_gVAAAAAAf8FQAAAAASABkAAAAAEgQZAAAAAAYIGQAAAAAGDBkAAAAABhAZAAAAAAYUGQACpCgAhKAQAAM8LACAFAADQCwAgBgAAsQsAIBAAALILACAZAACzCwAgNAAA9woAIEAAALULACBMAAC1CwAgTQAA9woAIE4AANELACBPAAD0CgAgUAAA9AoAIFEAANILACBSAADTCwAgUwAAvgsAIFQAAL4LACBVAAC9CwAgVgAAvQsAIFcAALwLACBYAADUCwAg8QUAAM4LADDyBQAAUQAQ8wUAAM4LADD0BQEAtwoAIfgFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAhggcBALcKACHDBwEAtwoAIcQHIAC6CgAhxQcBALgKACHGBwEAuAoAIccHAQC4CgAhyAcBALgKACHJBwEAuAoAIcoHAQC4CgAhywcBALcKACHXBwAAUQAg2AcAAFEAIAvxBQAAvQoAMPIFAADyCQAQ8wUAAL0KADD0BQEApAoAIfkFAQCkCgAh-gUBAKUKACH8BUAApgoAIf0FQACmCgAhnAYBAKQKACGdBgEApAoAIZ4GAQCkCgAhDvEFAAC-CgAw8gUAANoJABDzBQAAvgoAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACGfBgEApAoAIaAGAQCkCgAhoQYBAKUKACGiBgEApQoAIaMGAQClCgAhpAZAAKYKACEO8QUAAL8KADDyBQAAwgkAEPMFAAC_CgAw9AUBAKQKACH5BQEApAoAIfoFAQClCgAh_AVAAKYKACH9BUAApgoAIZwGAQCkCgAhngYBAKQKACGlBgEApAoAIaYGAQClCgAhqAYAAMAKqAYiqQZAAMEKACEHFQAAqAoAIGsAAMUKACBsAADFCgAg_gUAAACoBgL_BQAAAKgGCIAGAAAAqAYIhQYAAMQKqAYiCxUAAKsKACBrAADDCgAgbAAAwwoAIP4FQAAAAAH_BUAAAAAFgAZAAAAABYEGQAAAAAGCBkAAAAABgwZAAAAAAYQGQAAAAAGFBkAAwgoAIQsVAACrCgAgawAAwwoAIGwAAMMKACD-BUAAAAAB_wVAAAAABYAGQAAAAAWBBkAAAAABggZAAAAAAYMGQAAAAAGEBkAAAAABhQZAAMIKACEI_gVAAAAAAf8FQAAAAAWABkAAAAAFgQZAAAAAAYIGQAAAAAGDBkAAAAABhAZAAAAAAYUGQADDCgAhBxUAAKgKACBrAADFCgAgbAAAxQoAIP4FAAAAqAYC_wUAAACoBgiABgAAAKgGCIUGAADECqgGIgT-BQAAAKgGAv8FAAAAqAYIgAYAAACoBgiFBgAAxQqoBiIR8QUAAMYKADDyBQAAqgkAEPMFAADGCgAw9AUBAKQKACH5BQEApAoAIfoFAQClCgAh_AVAAKYKACH9BUAApgoAIYkGAQCkCgAhngYBAKUKACGqBgEApQoAIawGAADHCqwGIq0GAQClCgAhrgZAAMEKACGvBkAApgoAIbAGAQCkCgAhsQYBAKUKACEHFQAAqAoAIGsAAMkKACBsAADJCgAg_gUAAACsBgL_BQAAAKwGCIAGAAAArAYIhQYAAMgKrAYiBxUAAKgKACBrAADJCgAgbAAAyQoAIP4FAAAArAYC_wUAAACsBgiABgAAAKwGCIUGAADICqwGIgT-BQAAAKwGAv8FAAAArAYIgAYAAACsBgiFBgAAyQqsBiIX8QUAAMoKADDyBQAAjgkAEPMFAADKCgAw9AUBAKQKACH5BQEApAoAIfoFAQClCgAh_AVAAKYKACH9BUAApgoAIZ4GAQCkCgAhsgYBAKQKACGzBggAywoAIbQGCADLCgAhtQYIAMsKACG2BggAywoAIbcGCADLCgAhuAYIAMsKACG5BggAywoAIboGCADLCgAhuwYIAMsKACG8BggAywoAIb0GCADLCgAhvgYIAMsKACG_BggAywoAIQ0VAACrCgAgawAAzQoAIGwAAM0KACDtAQAAzQoAIO4BAADNCgAg_gUIAAAAAf8FCAAAAAWABggAAAAFgQYIAAAAAYIGCAAAAAGDBggAAAABhAYIAAAAAYUGCADMCgAhDRUAAKsKACBrAADNCgAgbAAAzQoAIO0BAADNCgAg7gEAAM0KACD-BQgAAAAB_wUIAAAABYAGCAAAAAWBBggAAAABggYIAAAAAYMGCAAAAAGEBggAAAABhQYIAMwKACEI_gUIAAAAAf8FCAAAAAWABggAAAAFgQYIAAAAAYIGCAAAAAGDBggAAAABhAYIAAAAAYUGCADNCgAhD_EFAADOCgAw8gUAAPYIABDzBQAAzgoAMPQFAQCkCgAh-QUBAKQKACH8BUAApgoAIf0FQACmCgAhrAYAANAKxAYiwAYBAKUKACHCBgAAzwrCBiLEBhAA0QoAIcUGAQCkCgAhxgYCANIKACHHBkAApgoAIcgGQACmCgAhBxUAAKgKACBrAADaCgAgbAAA2goAIP4FAAAAwgYC_wUAAADCBgiABgAAAMIGCIUGAADZCsIGIgcVAACoCgAgawAA2AoAIGwAANgKACD-BQAAAMQGAv8FAAAAxAYIgAYAAADEBgiFBgAA1wrEBiINFQAAqAoAIGsAANYKACBsAADWCgAg7QEAANYKACDuAQAA1goAIP4FEAAAAAH_BRAAAAAEgAYQAAAABIEGEAAAAAGCBhAAAAABgwYQAAAAAYQGEAAAAAGFBhAA1QoAIQ0VAACoCgAgawAAqAoAIGwAAKgKACDtAQAA1AoAIO4BAACoCgAg_gUCAAAAAf8FAgAAAASABgIAAAAEgQYCAAAAAYIGAgAAAAGDBgIAAAABhAYCAAAAAYUGAgDTCgAhDRUAAKgKACBrAACoCgAgbAAAqAoAIO0BAADUCgAg7gEAAKgKACD-BQIAAAAB_wUCAAAABIAGAgAAAASBBgIAAAABggYCAAAAAYMGAgAAAAGEBgIAAAABhQYCANMKACEI_gUIAAAAAf8FCAAAAASABggAAAAEgQYIAAAAAYIGCAAAAAGDBggAAAABhAYIAAAAAYUGCADUCgAhDRUAAKgKACBrAADWCgAgbAAA1goAIO0BAADWCgAg7gEAANYKACD-BRAAAAAB_wUQAAAABIAGEAAAAASBBhAAAAABggYQAAAAAYMGEAAAAAGEBhAAAAABhQYQANUKACEI_gUQAAAAAf8FEAAAAASABhAAAAAEgQYQAAAAAYIGEAAAAAGDBhAAAAABhAYQAAAAAYUGEADWCgAhBxUAAKgKACBrAADYCgAgbAAA2AoAIP4FAAAAxAYC_wUAAADEBgiABgAAAMQGCIUGAADXCsQGIgT-BQAAAMQGAv8FAAAAxAYIgAYAAADEBgiFBgAA2ArEBiIHFQAAqAoAIGsAANoKACBsAADaCgAg_gUAAADCBgL_BQAAAMIGCIAGAAAAwgYIhQYAANkKwgYiBP4FAAAAwgYC_wUAAADCBgiABgAAAMIGCIUGAADaCsIGIgvxBQAA2woAMPIFAADeCAAQ8wUAANsKADD0BQEApAoAIfgFAQClCgAh-QUBAKQKACH6BQEApQoAIfsFAQCkCgAh_AVAAKYKACH9BUAApgoAIckGAQCkCgAhD_EFAADcCgAw8gUAAMYIABDzBQAA3AoAMPQFAQCkCgAh_AVAAKYKACH9BUAApgoAIaAGAQClCgAhqgYBAKUKACGsBgAA3QrLBiKtBgEApQoAIa4GQADBCgAhrwZAAKYKACGwBgEApAoAIbEGAQClCgAhywYBAKQKACEHFQAAqAoAIGsAAN8KACBsAADfCgAg_gUAAADLBgL_BQAAAMsGCIAGAAAAywYIhQYAAN4KywYiBxUAAKgKACBrAADfCgAgbAAA3woAIP4FAAAAywYC_wUAAADLBgiABgAAAMsGCIUGAADeCssGIgT-BQAAAMsGAv8FAAAAywYIgAYAAADLBgiFBgAA3wrLBiIM8QUAAOAKADDyBQAArAgAEPMFAADgCgAw9AUBAKQKACH8BUAApgoAIf0FQACmCgAhigYBAKQKACGLBgEApAoAIZAGAACxCgAgkgYgALIKACHLBgEApAoAIcwGAACwCgAgDRcAALwKACDxBQAA4QoAMPIFAACtAgAQ8wUAAOEKADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGKBgEAtwoAIYsGAQC3CgAhkAYAALkKACCSBiAAugoAIcsGAQC3CgAhzAYAALAKACAI8QUAAOIKADDyBQAAlAgAEPMFAADiCgAw9AUBAKQKACH5BQEApAoAIc0GAQCkCgAhzgZAAKYKACHPBkAApgoAIQ0MAADkCgAgDQAA5goAIBwAAOgKACAlAADlCgAgJwAA5woAIPEFAADjCgAw8gUAAC8AEPMFAADjCgAw9AUBALcKACH5BQEAtwoAIc0GAQC3CgAhzgZAALsKACHPBkAAuwoAIQPQBgAAMQAg0QYAADEAINIGAAAxACAD0AYAADUAINEGAAA1ACDSBgAANQAgA9AGAAAmACDRBgAAJgAg0gYAACYAIAPQBgAAdAAg0QYAAHQAINIGAAB0ACAD0AYAAFUAINEGAABVACDSBgAAVQAgDfEFAADpCgAw8gUAAPwHABDzBQAA6QoAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACHNBgEApAoAIdMGAQClCgAh1AYCAOoKACHVBgEApAoAIdYGAQClCgAhDRUAAKsKACBrAACrCgAgbAAAqwoAIO0BAADNCgAg7gEAAKsKACD-BQIAAAAB_wUCAAAABYAGAgAAAAWBBgIAAAABggYCAAAAAYMGAgAAAAGEBgIAAAABhQYCAOsKACENFQAAqwoAIGsAAKsKACBsAACrCgAg7QEAAM0KACDuAQAAqwoAIP4FAgAAAAH_BQIAAAAFgAYCAAAABYEGAgAAAAGCBgIAAAABgwYCAAAAAYQGAgAAAAGFBgIA6woAIQ7xBQAA7AoAMPIFAADiBwAQ8wUAAOwKADD0BQEApAoAIfkFAQClCgAh-gUBAKUKACH8BUAApgoAIf0FQACmCgAhrAYAAO0K2gYizQYBAKQKACHTBgEApQoAIdUGAQClCgAh1wYBAKQKACHYBgEApAoAIQcVAACoCgAgawAA7woAIGwAAO8KACD-BQAAANoGAv8FAAAA2gYIgAYAAADaBgiFBgAA7graBiIHFQAAqAoAIGsAAO8KACBsAADvCgAg_gUAAADaBgL_BQAAANoGCIAGAAAA2gYIhQYAAO4K2gYiBP4FAAAA2gYC_wUAAADaBgiABgAAANoGCIUGAADvCtoGIg7xBQAA8AoAMPIFAADGBwAQ8wUAAPAKADD0BQEApAoAIfkFAQClCgAh-gUBAKUKACH8BUAApgoAIf0FQACmCgAhsgYBAKQKACHNBgEApAoAIdMGAQClCgAh2gYBAKUKACHbBgEApAoAIdwGAQCkCgAhDvEFAADxCgAw8gUAAKwHABDzBQAA8QoAMPQFAQCkCgAh-QUBAKQKACH6BQEApAoAIfwFQACmCgAh_QVAAKYKACGlBgEApAoAIdMGAQClCgAh3QYBAKUKACHeBkAAwQoAId8GCADLCgAh4AYIAMsKACEP8QUAAPIKADDyBQAAlgcAEPMFAADyCgAw9AUBAKQKACH5BQEApAoAIfoFAQClCgAh_AVAAKYKACH9BUAApgoAIaUGAQCkCgAh4QYBAKUKACHiBgEApAoAIeMGAACwCgAg5AYBAKUKACHlBgEApQoAIeYGAQCkCgAhEBQAAPQKACDxBQAA8woAMPIFAACDBwAQ8wUAAPMKADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhpQYBALcKACHhBgEAuAoAIeIGAQC3CgAh4wYAALAKACDkBgEAuAoAIeUGAQC4CgAh5gYBALcKACED0AYAAEsAINEGAABLACDSBgAASwAgD_EFAAD1CgAw8gUAAP0GABDzBQAA9QoAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACGlBgEApAoAIeEGAQClCgAh4gYBAKQKACHjBgAAsAoAIOQGAQClCgAh5QYBAKUKACHmBgEApAoAIRAUAAD3CgAg8QUAAPYKADDyBQAA6gYAEPMFAAD2CgAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIaUGAQC3CgAh4QYBALgKACHiBgEAtwoAIeMGAACwCgAg5AYBALgKACHlBgEAuAoAIeYGAQC3CgAhA9AGAAChAQAg0QYAAKEBACDSBgAAoQEAIA_xBQAA-AoAMPIFAADkBgAQ8wUAAPgKADD0BQEApAoAIfkFAQCkCgAh_AVAAKYKACH9BUAApgoAIecGAQCkCgAh6AYBAKQKACHpBgEApAoAIeoGAQCkCgAh6wYBAKQKACHsBgEApAoAIe0GIACyCgAh7gYBAKUKACEQBwAA-goAIPEFAAD5CgAw8gUAAOUBABDzBQAA-QoAMPQFAQC3CgAh-QUBALcKACH8BUAAuwoAIf0FQAC7CgAh5wYBALcKACHoBgEAtwoAIekGAQC3CgAh6gYBALcKACHrBgEAtwoAIewGAQC3CgAh7QYgALoKACHuBgEAuAoAIScGAACxCwAgDAAA5AoAIA0AAOYKACARAAC0CwAgHAAA6AoAICUAAOUKACAnAADnCgAgKgAAuwsAIC4AAK0LACAvAACuCwAgMAAAsAsAIDEAALILACAyAACzCwAgNAAA9woAIDUAALYLACA2AAC3CwAgNwAAuAsAIDoAAKwLACA7AACvCwAgPwAAugsAIEAAALULACBBAAC5CwAgRgAAvAsAIEcAAL0LACBIAAC-CwAgSQAAvgsAIPEFAACqCwAw8gUAABYAEPMFAACqCwAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhqAYAAKsLmAcjzQYBALcKACHTBgEAuAoAIZYHAQC4CgAhmQcBALgKACHXBwAAFgAg2AcAABYAIBrxBQAA-woAMPIFAADMBgAQ8wUAAPsKADD0BQEApAoAIfkFAQCkCgAh-gUBAKQKACH8BUAApgoAIf0FQACmCgAhoAYBAKQKACGsBgAA_QrzBiLEBhAA0QoAIcUGAQCkCgAhxgYCANIKACHVBgEApAoAIe8GAQCkCgAh8QYAAPwK8QYi8wYBAKQKACH0BgEApAoAIfUGAQClCgAh9gYBAKUKACH3BgEApQoAIfgGAQClCgAh-QYBAKUKACH6BgAA_goAIPsGQACmCgAh_AZAAMEKACEHFQAAqAoAIGsAAIMLACBsAACDCwAg_gUAAADxBgL_BQAAAPEGCIAGAAAA8QYIhQYAAIIL8QYiBxUAAKgKACBrAACBCwAgbAAAgQsAIP4FAAAA8wYC_wUAAADzBgiABgAAAPMGCIUGAACAC_MGIg8VAACrCgAgawAA_woAIGwAAP8KACD-BYAAAAABgQaAAAAAAYIGgAAAAAGDBoAAAAABhAaAAAAAAYUGgAAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAGWBoAAAAABlwaAAAAAAZgGgAAAAAEM_gWAAAAAAYEGgAAAAAGCBoAAAAABgwaAAAAAAYQGgAAAAAGFBoAAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgaAAAAAAZcGgAAAAAGYBoAAAAABBxUAAKgKACBrAACBCwAgbAAAgQsAIP4FAAAA8wYC_wUAAADzBgiABgAAAPMGCIUGAACAC_MGIgT-BQAAAPMGAv8FAAAA8wYIgAYAAADzBgiFBgAAgQvzBiIHFQAAqAoAIGsAAIMLACBsAACDCwAg_gUAAADxBgL_BQAAAPEGCIAGAAAA8QYIhQYAAIIL8QYiBP4FAAAA8QYC_wUAAADxBgiABgAAAPEGCIUGAACDC_EGIg3xBQAAhAsAMPIFAAC2BgAQ8wUAAIQLADD0BQEApAoAIfkFAQCkCgAh-gUBAKQKACH8BUAApgoAIf0FQACmCgAhxQYBAKQKACHVBgEApAoAIe0GIACyCgAh_QYQANEKACH-BhAA0QoAIQfxBQAAhQsAMPIFAACgBgAQ8wUAAIULADD0BQEApAoAIfsFAQCkCgAh_wYBAKQKACGAB0AApgoAIQfxBQAAhgsAMPIFAACKBgAQ8wUAAIYLADD0BQEApAoAIfwFQACmCgAh_wYBAKQKACGCBwAAhwuCByIHFQAAqAoAIGsAAIkLACBsAACJCwAg_gUAAACCBwL_BQAAAIIHCIAGAAAAggcIhQYAAIgLggciBxUAAKgKACBrAACJCwAgbAAAiQsAIP4FAAAAggcC_wUAAACCBwiABgAAAIIHCIUGAACIC4IHIgT-BQAAAIIHAv8FAAAAggcIgAYAAACCBwiFBgAAiQuCByIL8QUAAIoLADDyBQAA9AUAEPMFAACKCwAw9AUBAKQKACH5BQEApAoAIfwFQACmCgAh_QVAAKYKACGlBgEApAoAIaYGAQCkCgAhgwcBAKQKACGEBwAAhwuCByIT8QUAAIsLADDyBQAA3gUAEPMFAACLCwAw9AUBAKQKACH8BUAApgoAIf0FQACmCgAhngYBAKUKACGgBgEApQoAIawGAACNC4gHIq4GQADBCgAhsQYBAKUKACGGBwAAjAuGByKIBwEApAoAIYkHAQCkCgAhigcBAKQKACGLBwEApQoAIYwHAQClCgAhjQcBAKUKACGOB0AApgoAIQcVAACoCgAgawAAkQsAIGwAAJELACD-BQAAAIYHAv8FAAAAhgcIgAYAAACGBwiFBgAAkAuGByIHFQAAqAoAIGsAAI8LACBsAACPCwAg_gUAAACIBwL_BQAAAIgHCIAGAAAAiAcIhQYAAI4LiAciBxUAAKgKACBrAACPCwAgbAAAjwsAIP4FAAAAiAcC_wUAAACIBwiABgAAAIgHCIUGAACOC4gHIgT-BQAAAIgHAv8FAAAAiAcIgAYAAACIBwiFBgAAjwuIByIHFQAAqAoAIGsAAJELACBsAACRCwAg_gUAAACGBwL_BQAAAIYHCIAGAAAAhgcIhQYAAJALhgciBP4FAAAAhgcC_wUAAACGBwiABgAAAIYHCIUGAACRC4YHIg3xBQAAkgsAMPIFAADABQAQ8wUAAJILADD0BQEApAoAIfkFAQCkCgAh_AVAAKYKACH9BUAApgoAIawGAACUC5IHIq4GQADBCgAhigcBAKQKACGQBwAAkwuQByKSBwEApQoAIZMHAQClCgAhBxUAAKgKACBrAACYCwAgbAAAmAsAIP4FAAAAkAcC_wUAAACQBwiABgAAAJAHCIUGAACXC5AHIgcVAACoCgAgawAAlgsAIGwAAJYLACD-BQAAAJIHAv8FAAAAkgcIgAYAAACSBwiFBgAAlQuSByIHFQAAqAoAIGsAAJYLACBsAACWCwAg_gUAAACSBwL_BQAAAJIHCIAGAAAAkgcIhQYAAJULkgciBP4FAAAAkgcC_wUAAACSBwiABgAAAJIHCIUGAACWC5IHIgcVAACoCgAgawAAmAsAIGwAAJgLACD-BQAAAJAHAv8FAAAAkAcIgAYAAACQBwiFBgAAlwuQByIE_gUAAACQBwL_BQAAAJAHCIAGAAAAkAcIhQYAAJgLkAciHvEFAACZCwAw8gUAAKgFABDzBQAAmQsAMPQFAQCkCgAh-QUBAKUKACH8BUAApgoAIf0FQACmCgAhrAYAAJ4LqQcirgZAAMEKACHTBgEApQoAIZMHAQClCgAhlAcBAKQKACGVBwEApAoAIZYHAQClCgAhmAcAAJoLmAcjmQcBAKUKACGaBwAAmwvCBiObBxAAnAsAIZwHAQCkCgAhnQcCAOoKACGfBwAAnQufByKgBwEApQoAIaEHAQClCgAhogcBAKUKACGjBwEApQoAIaQHAQClCgAhpQcBAKUKACGmBwAA_goAIKcHQADBCgAhqQcBAKUKACEHFQAAqwoAIGsAAKgLACBsAACoCwAg_gUAAACYBwP_BQAAAJgHCYAGAAAAmAcJhQYAAKcLmAcjBxUAAKsKACBrAACmCwAgbAAApgsAIP4FAAAAwgYD_wUAAADCBgmABgAAAMIGCYUGAAClC8IGIw0VAACrCgAgawAApAsAIGwAAKQLACDtAQAApAsAIO4BAACkCwAg_gUQAAAAAf8FEAAAAAWABhAAAAAFgQYQAAAAAYIGEAAAAAGDBhAAAAABhAYQAAAAAYUGEACjCwAhBxUAAKgKACBrAACiCwAgbAAAogsAIP4FAAAAnwcC_wUAAACfBwiABgAAAJ8HCIUGAAChC58HIgcVAACoCgAgawAAoAsAIGwAAKALACD-BQAAAKkHAv8FAAAAqQcIgAYAAACpBwiFBgAAnwupByIHFQAAqAoAIGsAAKALACBsAACgCwAg_gUAAACpBwL_BQAAAKkHCIAGAAAAqQcIhQYAAJ8LqQciBP4FAAAAqQcC_wUAAACpBwiABgAAAKkHCIUGAACgC6kHIgcVAACoCgAgawAAogsAIGwAAKILACD-BQAAAJ8HAv8FAAAAnwcIgAYAAACfBwiFBgAAoQufByIE_gUAAACfBwL_BQAAAJ8HCIAGAAAAnwcIhQYAAKILnwciDRUAAKsKACBrAACkCwAgbAAApAsAIO0BAACkCwAg7gEAAKQLACD-BRAAAAAB_wUQAAAABYAGEAAAAAWBBhAAAAABggYQAAAAAYMGEAAAAAGEBhAAAAABhQYQAKMLACEI_gUQAAAAAf8FEAAAAAWABhAAAAAFgQYQAAAAAYIGEAAAAAGDBhAAAAABhAYQAAAAAYUGEACkCwAhBxUAAKsKACBrAACmCwAgbAAApgsAIP4FAAAAwgYD_wUAAADCBgmABgAAAMIGCYUGAAClC8IGIwT-BQAAAMIGA_8FAAAAwgYJgAYAAADCBgmFBgAApgvCBiMHFQAAqwoAIGsAAKgLACBsAACoCwAg_gUAAACYBwP_BQAAAJgHCYAGAAAAmAcJhQYAAKcLmAcjBP4FAAAAmAcD_wUAAACYBwmABgAAAJgHCYUGAACoC5gHIwvxBQAAqQsAMPIFAACOBQAQ8wUAAKkLADD0BQEApAoAIfwFQACmCgAh_QVAAKYKACGoBgAAmguYByPNBgEApAoAIdMGAQClCgAhlgcBAKUKACGZBwEApQoAISUGAACxCwAgDAAA5AoAIA0AAOYKACARAAC0CwAgHAAA6AoAICUAAOUKACAnAADnCgAgKgAAuwsAIC4AAK0LACAvAACuCwAgMAAAsAsAIDEAALILACAyAACzCwAgNAAA9woAIDUAALYLACA2AAC3CwAgNwAAuAsAIDoAAKwLACA7AACvCwAgPwAAugsAIEAAALULACBBAAC5CwAgRgAAvAsAIEcAAL0LACBIAAC-CwAgSQAAvgsAIPEFAACqCwAw8gUAABYAEPMFAACqCwAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhqAYAAKsLmAcjzQYBALcKACHTBgEAuAoAIZYHAQC4CgAhmQcBALgKACEE_gUAAACYBwP_BQAAAJgHCYAGAAAAmAcJhQYAAKgLmAcjA9AGAAASACDRBgAAEgAg0gYAABIAIAPQBgAAHQAg0QYAAB0AINIGAAAdACAD0AYAAGsAINEGAABrACDSBgAAawAgA9AGAADIAQAg0QYAAMgBACDSBgAAyAEAIAPQBgAAIQAg0QYAACEAINIGAAAhACAD0AYAAAsAINEGAAALACDSBgAACwAgA9AGAAAOACDRBgAADgAg0gYAAA4AIAPQBgAAUwAg0QYAAFMAINIGAABTACAD0AYAADoAINEGAAA6ACDSBgAAOgAgA9AGAADTAQAg0QYAANMBACDSBgAA0wEAIAPQBgAAPwAg0QYAAD8AINIGAAA_ACAD0AYAAEQAINEGAABEACDSBgAARAAgA9AGAACJAQAg0QYAAIkBACDSBgAAiQEAIBIHAAD6CgAg8QUAAPkKADDyBQAA5QEAEPMFAAD5CgAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACHnBgEAtwoAIegGAQC3CgAh6QYBALcKACHqBgEAtwoAIesGAQC3CgAh7AYBALcKACHtBiAAugoAIe4GAQC4CgAh1wcAAOUBACDYBwAA5QEAIAPQBgAA2QEAINEGAADZAQAg0gYAANkBACAD0AYAACoAINEGAAAqACDSBgAAKgAgA9AGAADqAQAg0QYAAOoBACDSBgAA6gEAIAPQBgAA-AEAINEGAAD4AQAg0gYAAPgBACAD0AYAAFsAINEGAABbACDSBgAAWwAgCvEFAAC_CwAw8gUAAPYEABDzBQAAvwsAMPQFAQCkCgAh-QUBAKUKACH8BUAApgoAIf0FQACmCgAh0wYBAKUKACGWBwEApQoAIaoHAQCkCgAhCvEFAADACwAw8gUAAN4EABDzBQAAwAsAMPQFAQCkCgAh_AVAAKYKACH9BUAApgoAIdMGAQClCgAh5AYBAKUKACGWBwEApQoAIaoHAQCkCgAhD_EFAADBCwAw8gUAAMYEABDzBQAAwQsAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACGcBgEApAoAIZ0GAQCkCgAhngYBAKQKACGgBgEApAoAIdUGAQCkCgAh5QYBAKUKACGrB0AApgoAIQ3xBQAAwgsAMPIFAACsBAAQ8wUAAMILADD0BQEApAoAIfkFAQCkCgAh-gUBAKQKACH8BUAApgoAIf0FQACmCgAh0wYBAKUKACHfBgIA6goAIeUGAQClCgAhrAcBAKQKACGtBwEApAoAIQzxBQAAwwsAMPIFAACUBAAQ8wUAAMMLADD0BQEApAoAIfkFAQCkCgAh_AVAAKYKACH9BUAApgoAIc0GAQClCgAhrgcBAKQKACGvBwEApAoAIbAHAgDSCgAhsgcAAMQLsgciBxUAAKgKACBrAADGCwAgbAAAxgsAIP4FAAAAsgcC_wUAAACyBwiABgAAALIHCIUGAADFC7IHIgcVAACoCgAgawAAxgsAIGwAAMYLACD-BQAAALIHAv8FAAAAsgcIgAYAAACyBwiFBgAAxQuyByIE_gUAAACyBwL_BQAAALIHCIAGAAAAsgcIhQYAAMYLsgciCvEFAADHCwAw8gUAAP4DABDzBQAAxwsAMPQFAQCkCgAh-QUBAKQKACH6BQEApQoAIfwFQACmCgAh_QVAAKYKACHNBgEApAoAIdMGAQClCgAhCfEFAADICwAw8gUAAOYDABDzBQAAyAsAMPQFAQCkCgAh-wUBAKQKACH8BUAApgoAIf0FQACmCgAhswcBAKQKACG0B0AApgoAIQnxBQAAyQsAMPIFAADQAwAQ8wUAAMkLADD0BQEApAoAIfwFQACmCgAh_QVAAKYKACG0B0AApgoAIbUHAQCkCgAhtgcBAKQKACEJ8QUAAMoLADDyBQAAvQMAEPMFAADKCwAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhtAdAALsKACG1BwEAtwoAIbYHAQC3CgAhEPEFAADLCwAw8gUAALcDABDzBQAAywsAMPQFAQCkCgAh-wUBAKQKACH8BUAApgoAIf0FQACmCgAhtwcBAKQKACG4BwEApAoAIbkHAQClCgAhugcBAKUKACG7BwEApQoAIbwHQADBCgAhvQdAAMEKACG-BwEApQoAIb8HAQClCgAhC_EFAADMCwAw8gUAAKEDABDzBQAAzAsAMPQFAQCkCgAh-wUBAKQKACH8BUAApgoAIf0FQACmCgAhtAdAAKYKACHABwEApAoAIcEHAQClCgAhwgcBAKUKACES8QUAAM0LADDyBQAAiwMAEPMFAADNCwAw9AUBAKQKACH4BQEApQoAIfwFQACmCgAh_QVAAKYKACHNBgEApAoAIYIHAQCkCgAhwwcBAKQKACHEByAAsgoAIcUHAQClCgAhxgcBAKUKACHHBwEApQoAIcgHAQClCgAhyQcBAKUKACHKBwEApQoAIcsHAQCkCgAhJgQAAM8LACAFAADQCwAgBgAAsQsAIBAAALILACAZAACzCwAgNAAA9woAIEAAALULACBMAAC1CwAgTQAA9woAIE4AANELACBPAAD0CgAgUAAA9AoAIFEAANILACBSAADTCwAgUwAAvgsAIFQAAL4LACBVAAC9CwAgVgAAvQsAIFcAALwLACBYAADUCwAg8QUAAM4LADDyBQAAUQAQ8wUAAM4LADD0BQEAtwoAIfgFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAhggcBALcKACHDBwEAtwoAIcQHIAC6CgAhxQcBALgKACHGBwEAuAoAIccHAQC4CgAhyAcBALgKACHJBwEAuAoAIcoHAQC4CgAhywcBALcKACED0AYAAAMAINEGAAADACDSBgAAAwAgA9AGAAAHACDRBgAABwAg0gYAAAcAIBMzAAC8CgAg8QUAALYKADDyBQAAqQIAEPMFAAC2CgAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhiQYBALcKACGKBgEAtwoAIYsGAQC3CgAhjAYBALcKACGNBgEAuAoAIY4GAACwCgAgjwYAALAKACCQBgAAuQoAIJEGAAC5CgAgkgYgALoKACHXBwAAqQIAINgHAACpAgAgDxcAALwKACDxBQAA4QoAMPIFAACtAgAQ8wUAAOEKADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGKBgEAtwoAIYsGAQC3CgAhkAYAALkKACCSBiAAugoAIcsGAQC3CgAhzAYAALAKACDXBwAArQIAINgHAACtAgAgA9AGAACvAgAg0QYAAK8CACDSBgAArwIAIAPQBgAA8gEAINEGAADyAQAg0gYAAPIBACAJ8QUAANULADDyBQAA8wIAEPMFAADVCwAw9AUBAKQKACH8BUAApgoAIf0FQACmCgAhrAYAANYLzgcisgYBAKQKACHMB0AApgoAIQcVAACoCgAgawAA2AsAIGwAANgLACD-BQAAAM4HAv8FAAAAzgcIgAYAAADOBwiFBgAA1wvOByIHFQAAqAoAIGsAANgLACBsAADYCwAg_gUAAADOBwL_BQAAAM4HCIAGAAAAzgcIhQYAANcLzgciBP4FAAAAzgcC_wUAAADOBwiABgAAAM4HCIUGAADYC84HIgnxBQAA2QsAMPIFAADdAgAQ8wUAANkLADD0BQEApAoAIfkFAQCkCgAh-wUBAKQKACH8BUAApgoAIf0FQACmCgAhggcAANoLzwciBxUAAKgKACBrAADcCwAgbAAA3AsAIP4FAAAAzwcC_wUAAADPBwiABgAAAM8HCIUGAADbC88HIgcVAACoCgAgawAA3AsAIGwAANwLACD-BQAAAM8HAv8FAAAAzwcIgAYAAADPBwiFBgAA2wvPByIE_gUAAADPBwL_BQAAAM8HCIAGAAAAzwcIhQYAANwLzwciCgMAALwKACDxBQAA3QsAMPIFAACvAgAQ8wUAAN0LADD0BQEAtwoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIbMHAQC3CgAhtAdAALsKACEQBwAA-goAICAAALwKACA9AADiCwAg8QUAAN4LADDyBQAA-AEAEPMFAADeCwAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA4AuSByKuBkAA4QsAIYoHAQC3CgAhkAcAAN8LkAcikgcBALgKACGTBwEAuAoAIQT-BQAAAJAHAv8FAAAAkAcIgAYAAACQBwiFBgAAmAuQByIE_gUAAACSBwL_BQAAAJIHCIAGAAAAkgcIhQYAAJYLkgciCP4FQAAAAAH_BUAAAAAFgAZAAAAABYEGQAAAAAGCBkAAAAABgwZAAAAAAYQGQAAAAAGFBkAAwwoAISgEAADPCwAgBQAA0AsAIAYAALELACAQAACyCwAgGQAAswsAIDQAAPcKACBAAAC1CwAgTAAAtQsAIE0AAPcKACBOAADRCwAgTwAA9AoAIFAAAPQKACBRAADSCwAgUgAA0wsAIFMAAL4LACBUAAC-CwAgVQAAvQsAIFYAAL0LACBXAAC8CwAgWAAA1AsAIPEFAADOCwAw8gUAAFEAEPMFAADOCwAw9AUBALcKACH4BQEAuAoAIfwFQAC7CgAh_QVAALsKACHNBgEAtwoAIYIHAQC3CgAhwwcBALcKACHEByAAugoAIcUHAQC4CgAhxgcBALgKACHHBwEAuAoAIcgHAQC4CgAhyQcBALgKACHKBwEAuAoAIcsHAQC3CgAh1wcAAFEAINgHAABRACAC-wUBAAAAAf8GAQAAAAEJAwAAvAoAIEMAAOULACDxBQAA5AsAMPIFAADyAQAQ8wUAAOQLADD0BQEAtwoAIfsFAQC3CgAh_wYBALcKACGAB0AAuwoAIREHAAD6CgAgQgAAvAoAIEQAAOoLACBFAADUCwAg8QUAAOkLADDyBQAA6gEAEPMFAADpCwAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIaYGAQC3CgAhgwcBALcKACGEBwAA6AuCByLXBwAA6gEAINgHAADqAQAgAv8GAQAAAAGCBwAAAIIHAghDAADlCwAg8QUAAOcLADDyBQAA7gEAEPMFAADnCwAw9AUBALcKACH8BUAAuwoAIf8GAQC3CgAhggcAAOgLggciBP4FAAAAggcC_wUAAACCBwiABgAAAIIHCIUGAACJC4IHIg8HAAD6CgAgQgAAvAoAIEQAAOoLACBFAADUCwAg8QUAAOkLADDyBQAA6gEAEPMFAADpCwAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIaYGAQC3CgAhgwcBALcKACGEBwAA6AuCByID0AYAAO4BACDRBgAA7gEAINIGAADuAQAgEQcAAPoKACA-AADwCwAg8QUAAOsLADDyBQAA2QEAEPMFAADrCwAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA7QvEBiLABgEAuAoAIcIGAADsC8IGIsQGEADuCwAhxQYBALcKACHGBgIA7wsAIccGQAC7CgAhyAZAALsKACEE_gUAAADCBgL_BQAAAMIGCIAGAAAAwgYIhQYAANoKwgYiBP4FAAAAxAYC_wUAAADEBgiABgAAAMQGCIUGAADYCsQGIgj-BRAAAAAB_wUQAAAABIAGEAAAAASBBhAAAAABggYQAAAAAYMGEAAAAAGEBhAAAAABhQYQANYKACEI_gUCAAAAAf8FAgAAAASABgIAAAAEgQYCAAAAAYIGAgAAAAGDBgIAAAABhAYCAAAAAYUGAgCoCgAhJAcAAPgLACA8AAC8CgAgPQAA4gsAID8AALoLACDxBQAA8QsAMPIFAADTAQAQ8wUAAPELADD0BQEAtwoAIfkFAQC4CgAh_AVAALsKACH9BUAAuwoAIawGAAD3C6kHIq4GQADhCwAh0wYBALgKACGTBwEAuAoAIZQHAQC3CgAhlQcBALcKACGWBwEAuAoAIZgHAACrC5gHI5kHAQC4CgAhmgcAAPILwgYjmwcQAPMLACGcBwEAtwoAIZ0HAgD0CwAhnwcAAPULnwcioAcBALgKACGhBwEAuAoAIaIHAQC4CgAhowcBALgKACGkBwEAuAoAIaUHAQC4CgAhpgcAAPYLACCnB0AA4QsAIakHAQC4CgAh1wcAANMBACDYBwAA0wEAICIHAAD4CwAgPAAAvAoAID0AAOILACA_AAC6CwAg8QUAAPELADDyBQAA0wEAEPMFAADxCwAw9AUBALcKACH5BQEAuAoAIfwFQAC7CgAh_QVAALsKACGsBgAA9wupByKuBkAA4QsAIdMGAQC4CgAhkwcBALgKACGUBwEAtwoAIZUHAQC3CgAhlgcBALgKACGYBwAAqwuYByOZBwEAuAoAIZoHAADyC8IGI5sHEADzCwAhnAcBALcKACGdBwIA9AsAIZ8HAAD1C58HIqAHAQC4CgAhoQcBALgKACGiBwEAuAoAIaMHAQC4CgAhpAcBALgKACGlBwEAuAoAIaYHAAD2CwAgpwdAAOELACGpBwEAuAoAIQT-BQAAAMIGA_8FAAAAwgYJgAYAAADCBgmFBgAApgvCBiMI_gUQAAAAAf8FEAAAAAWABhAAAAAFgQYQAAAAAYIGEAAAAAGDBhAAAAABhAYQAAAAAYUGEACkCwAhCP4FAgAAAAH_BQIAAAAFgAYCAAAABYEGAgAAAAGCBgIAAAABgwYCAAAAAYQGAgAAAAGFBgIAqwoAIQT-BQAAAJ8HAv8FAAAAnwcIgAYAAACfBwiFBgAAogufByIM_gWAAAAAAYEGgAAAAAGCBoAAAAABgwaAAAAAAYQGgAAAAAGFBoAAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABlgaAAAAAAZcGgAAAAAGYBoAAAAABBP4FAAAAqQcC_wUAAACpBwiABgAAAKkHCIUGAACgC6kHIicGAACxCwAgDAAA5AoAIA0AAOYKACARAAC0CwAgHAAA6AoAICUAAOUKACAnAADnCgAgKgAAuwsAIC4AAK0LACAvAACuCwAgMAAAsAsAIDEAALILACAyAACzCwAgNAAA9woAIDUAALYLACA2AAC3CwAgNwAAuAsAIDoAAKwLACA7AACvCwAgPwAAugsAIEAAALULACBBAAC5CwAgRgAAvAsAIEcAAL0LACBIAAC-CwAgSQAAvgsAIPEFAACqCwAw8gUAABYAEPMFAACqCwAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhqAYAAKsLmAcjzQYBALcKACHTBgEAuAoAIZYHAQC4CgAhmQcBALgKACHXBwAAFgAg2AcAABYAIA4HAAD6CgAgKgAAuwsAIPEFAAD5CwAw8gUAAMgBABDzBQAA-QsAMPQFAQC3CgAh-QUBALcKACH8BUAAuwoAIf0FQAC7CgAhzQYBALgKACGuBwEAtwoAIa8HAQC3CgAhsAcCAO8LACGyBwAA-guyByIE_gUAAACyBwL_BQAAALIHCIAGAAAAsgcIhQYAAMYLsgciGwcAAPoKACAJAAD_CwAgEAAA_gsAICkAAP0LACDxBQAA-wsAMPIFAACJAQAQ8wUAAPsLADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhngYBALcKACGyBgEAtwoAIbMGCAD8CwAhtAYIAPwLACG1BggA_AsAIbYGCAD8CwAhtwYIAPwLACG4BggA_AsAIbkGCAD8CwAhugYIAPwLACG7BggA_AsAIbwGCAD8CwAhvQYIAPwLACG-BggA_AsAIb8GCAD8CwAhCP4FCAAAAAH_BQgAAAAFgAYIAAAABYEGCAAAAAGCBggAAAABgwYIAAAAAYQGCAAAAAGFBggAzQoAIRwHAAD6CgAgCQAA_wsAIAoAAK8MACALAAC7CwAgDgAAoAwAIA8AAKMMACAQAAD-CwAgGQAAlQwAIBsAAI0MACAsAACtDAAgLQAArgwAIPEFAACsDAAw8gUAACYAEPMFAACsDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZwGAQC3CgAhnQYBALcKACGeBgEAtwoAIaAGAQC3CgAh1QYBALcKACHlBgEAuAoAIasHQAC7CgAh1wcAACYAINgHAAAmACAYAwAAvAoAIAcAAPoKACAJAACMDAAgDQAA5goAIBEAALQLACAiAAC-CwAgJAAAtgsAIEoAAPcKACBLAAC4CwAg8QUAALYMADDyBQAADgAQ8wUAALYMADD0BQEAtwoAIfUFAQC3CgAh9gUBALcKACH3BQEAtwoAIfgFAQC4CgAh-QUBALcKACH6BQEAtwoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIdcHAAAOACDYBwAADgAgHggAALMMACAMAADkCgAgDQAA5goAIBEAALQLACAcAADoCgAgJQAA5QoAICcAAOcKACAqAAC7CwAgLgAArQsAIC8AAK4LACAwAACwCwAgMQAAsgsAIDIAALMLACA0AAD3CgAgNQAAtgsAIDYAALcLACA3AAC4CwAgOAAAvgsAIPEFAACyDAAw8gUAABgAEPMFAACyDAAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACHkBgEAuAoAIZYHAQC4CgAhqgcBALcKACHXBwAAGAAg2AcAABgAIAKJBgEAAAABsAYBAAAAARcHAAD6CgAgCQAA_wsAIBAAAIQMACAWAACDDAAgGAAA4gsAIDMAALwKACDxBQAAgQwAMPIFAAChAQAQ8wUAAIEMADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhiQYBALcKACGeBgEAuAoAIaoGAQC4CgAhrAYAAIIMrAYirQYBALgKACGuBkAA4QsAIa8GQAC7CgAhsAYBALcKACGxBgEAuAoAIQT-BQAAAKwGAv8FAAAArAYIgAYAAACsBgiFBgAAyQqsBiISFAAA9woAIPEFAAD2CgAw8gUAAOoGABDzBQAA9goAMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIeEGAQC4CgAh4gYBALcKACHjBgAAsAoAIOQGAQC4CgAh5QYBALgKACHmBgEAtwoAIdcHAADqBgAg2AcAAOoGACAYAwAAvAoAIAcAAPoKACAJAACMDAAgDQAA5goAIBEAALQLACAiAAC-CwAgJAAAtgsAIEoAAPcKACBLAAC4CwAg8QUAALYMADDyBQAADgAQ8wUAALYMADD0BQEAtwoAIfUFAQC3CgAh9gUBALcKACH3BQEAtwoAIfgFAQC4CgAh-QUBALcKACH6BQEAtwoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIdcHAAAOACDYBwAADgAgEwMAALwKACAHAAD6CgAgCQAA_wsAIA0AAOYKACATAAC3CwAgGgAA9AoAIBwAAOgKACAiAAC-CwAg8QUAAIUMADDyBQAAUwAQ8wUAAIUMADD0BQEAtwoAIfgFAQC4CgAh-QUBALcKACH6BQEAuAoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIckGAQC3CgAhDQcAAPoKACAJAAD_CwAgJQAA5QoAIPEFAACGDAAw8gUAAGsAEPMFAACGDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAh0wYBALgKACECsgYBAAAAAcwHQAAAAAEKKQAA_QsAIPEFAACIDAAw8gUAAIUBABDzBQAAiAwAMPQFAQC3CgAh_AVAALsKACH9BUAAuwoAIawGAACJDM4HIrIGAQC3CgAhzAdAALsKACEE_gUAAADOBwL_BQAAAM4HCIAGAAAAzgcIhQYAANgLzgciAvoFAQAAAAHVBgEAAAABEQcAAPoKACAJAACMDAAgGwAAjQwAIBwAAOgKACDxBQAAiwwAMPIFAAB0ABDzBQAAiwwAMPQFAQC3CgAh-QUBALcKACH6BQEAtwoAIfwFQAC7CgAh_QVAALsKACHFBgEAtwoAIdUGAQC3CgAh7QYgALoKACH9BhAA7gsAIf4GEADuCwAhHggAALMMACAMAADkCgAgDQAA5goAIBEAALQLACAcAADoCgAgJQAA5QoAICcAAOcKACAqAAC7CwAgLgAArQsAIC8AAK4LACAwAACwCwAgMQAAsgsAIDIAALMLACA0AAD3CgAgNQAAtgsAIDYAALcLACA3AAC4CwAgOAAAvgsAIPEFAACyDAAw8gUAABgAEPMFAACyDAAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACHkBgEAuAoAIZYHAQC4CgAhqgcBALcKACHXBwAAGAAg2AcAABgAIA8MAADkCgAgDQAA5goAIBwAAOgKACAlAADlCgAgJwAA5woAIPEFAADjCgAw8gUAAC8AEPMFAADjCgAw9AUBALcKACH5BQEAtwoAIc0GAQC3CgAhzgZAALsKACHPBkAAuwoAIdcHAAAvACDYBwAALwAgGhAAAIQMACAYAADiCwAgGQAAkQwAIB4AAPoKACAfAAD6CgAgIAAAvAoAICEAAP8LACDxBQAAjgwAMPIFAABbABDzBQAAjgwAMPQFAQC3CgAh_AVAALsKACH9BUAAuwoAIZ4GAQC4CgAhoAYBALgKACGsBgAAkAyIByKuBkAA4QsAIbEGAQC4CgAhhgcAAI8MhgciiAcBALcKACGJBwEAtwoAIYoHAQC3CgAhiwcBALgKACGMBwEAuAoAIY0HAQC4CgAhjgdAALsKACEE_gUAAACGBwL_BQAAAIYHCIAGAAAAhgcIhQYAAJELhgciBP4FAAAAiAcC_wUAAACIBwiABgAAAIgHCIUGAACPC4gHIhUDAAC8CgAgBwAA-goAIAkAAP8LACANAADmCgAgEwAAtwsAIBoAAPQKACAcAADoCgAgIgAAvgsAIPEFAACFDAAw8gUAAFMAEPMFAACFDAAw9AUBALcKACH4BQEAuAoAIfkFAQC3CgAh-gUBALgKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACHJBgEAtwoAIdcHAABTACDYBwAAUwAgHwcAAPoKACAJAACMDAAgGQAAlQwAIBsAAI0MACAdAACWDAAg8QUAAJIMADDyBQAAVQAQ8wUAAJIMADD0BQEAtwoAIfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAhoAYBALcKACGsBgAAlAzzBiLEBhAA7gsAIcUGAQC3CgAhxgYCAO8LACHVBgEAtwoAIe8GAQC3CgAh8QYAAJMM8QYi8wYBALcKACH0BgEAtwoAIfUGAQC4CgAh9gYBALgKACH3BgEAuAoAIfgGAQC4CgAh-QYBALgKACH6BgAA9gsAIPsGQAC7CgAh_AZAAOELACEE_gUAAADxBgL_BQAAAPEGCIAGAAAA8QYIhQYAAIML8QYiBP4FAAAA8wYC_wUAAADzBgiABgAAAPMGCIUGAACBC_MGIhUDAAC8CgAgBwAA-goAIAkAAP8LACANAADmCgAgEwAAtwsAIBoAAPQKACAcAADoCgAgIgAAvgsAIPEFAACFDAAw8gUAAFMAEPMFAACFDAAw9AUBALcKACH4BQEAuAoAIfkFAQC3CgAh-gUBALgKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACHJBgEAtwoAIdcHAABTACDYBwAAUwAgEwcAAPoKACAJAACMDAAgGwAAjQwAIBwAAOgKACDxBQAAiwwAMPIFAAB0ABDzBQAAiwwAMPQFAQC3CgAh-QUBALcKACH6BQEAtwoAIfwFQAC7CgAh_QVAALsKACHFBgEAtwoAIdUGAQC3CgAh7QYgALoKACH9BhAA7gsAIf4GEADuCwAh1wcAAHQAINgHAAB0ACACsAYBAAAAAcsGAQAAAAETFgAAmgwAIBcAALwKACAYAADiCwAgGQAAkQwAIPEFAACYDAAw8gUAAEsAEPMFAACYDAAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhoAYBALgKACGqBgEAuAoAIawGAACZDMsGIq0GAQC4CgAhrgZAAOELACGvBkAAuwoAIbAGAQC3CgAhsQYBALgKACHLBgEAtwoAIQT-BQAAAMsGAv8FAAAAywYIgAYAAADLBgiFBgAA3wrLBiISFAAA9AoAIPEFAADzCgAw8gUAAIMHABDzBQAA8woAMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGlBgEAtwoAIeEGAQC4CgAh4gYBALcKACHjBgAAsAoAIOQGAQC4CgAh5QYBALgKACHmBgEAtwoAIdcHAACDBwAg2AcAAIMHACACnwYBAAAAAaAGAQAAAAESBwAA-goAIAkAAP8LACASAACdDAAgGQAAlQwAIPEFAACcDAAw8gUAAEQAEPMFAACcDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZ8GAQC3CgAhoAYBALcKACGhBgEAuAoAIaIGAQC4CgAhowYBALgKACGkBkAAuwoAIRUHAAD6CgAgCQAA_wsAIA4AAKAMACAQAAD-CwAgIwAAtwsAIPEFAACeDAAw8gUAAD8AEPMFAACeDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZwGAQC3CgAhngYBALcKACGlBgEAtwoAIaYGAQC4CgAhqAYAAJ8MqAYiqQZAAOELACHXBwAAPwAg2AcAAD8AIBMHAAD6CgAgCQAA_wsAIA4AAKAMACAQAAD-CwAgIwAAtwsAIPEFAACeDAAw8gUAAD8AEPMFAACeDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZwGAQC3CgAhngYBALcKACGlBgEAtwoAIaYGAQC4CgAhqAYAAJ8MqAYiqQZAAOELACEE_gUAAACoBgL_BQAAAKgGCIAGAAAAqAYIhQYAAMUKqAYiFgcAAPoKACAJAAD_CwAgDQAA5goAIBEAALQLACAbAACNDAAgJAAAtgsAICYAAKUMACDxBQAApAwAMPIFAAA1ABDzBQAApAwAMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACHNBgEAtwoAIdMGAQC4CgAh1AYCAPQLACHVBgEAtwoAIdYGAQC4CgAh1wcAADUAINgHAAA1ACACnAYBAAAAAZ0GAQAAAAEQBwAA-goAIAkAAP8LACAOAACgDAAgDwAAowwAIBAAAP4LACDxBQAAogwAMPIFAAA6ABDzBQAAogwAMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGcBgEAtwoAIZ0GAQC3CgAhngYBALcKACEUBwAA-goAIAkAAIwMACAKAACvDAAgDQAA5goAIBEAALQLACDxBQAAsAwAMPIFAAAhABDzBQAAsAwAMPQFAQC3CgAh-QUBALcKACH6BQEAtwoAIfwFQAC7CgAh_QVAALsKACHTBgEAuAoAId8GAgD0CwAh5QYBALgKACGsBwEAtwoAIa0HAQC3CgAh1wcAACEAINgHAAAhACAUBwAA-goAIAkAAP8LACANAADmCgAgEQAAtAsAIBsAAI0MACAkAAC2CwAgJgAApQwAIPEFAACkDAAw8gUAADUAEPMFAACkDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAh0wYBALgKACHUBgIA9AsAIdUGAQC3CgAh1gYBALgKACEPBwAA-goAIAkAAP8LACAlAADlCgAg8QUAAIYMADDyBQAAawAQ8wUAAIYMADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhzQYBALcKACHTBgEAuAoAIdcHAABrACDYBwAAawAgEgcAAPgLACAJAAD_CwAgCwAAuwsAIBsAAKgMACDxBQAApgwAMPIFAAAxABDzBQAApgwAMPQFAQC3CgAh-QUBALgKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGsBgAApwzaBiLNBgEAtwoAIdMGAQC4CgAh1QYBALgKACHXBgEAtwoAIdgGAQC3CgAhBP4FAAAA2gYC_wUAAADaBgiABgAAANoGCIUGAADvCtoGIg8MAADkCgAgDQAA5goAIBwAAOgKACAlAADlCgAgJwAA5woAIPEFAADjCgAw8gUAAC8AEPMFAADjCgAw9AUBALcKACH5BQEAtwoAIc0GAQC3CgAhzgZAALsKACHPBkAAuwoAIdcHAAAvACDYBwAALwAgEwcAAPgLACAJAAD_CwAgKAAAqgwAICkAAP0LACArAACrDAAg8QUAAKkMADDyBQAAKgAQ8wUAAKkMADD0BQEAtwoAIfkFAQC4CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhsgYBALcKACHNBgEAtwoAIdMGAQC4CgAh2gYBALgKACHbBgEAtwoAIdwGAQC3CgAhFAcAAPgLACAJAAD_CwAgCwAAuwsAIBsAAKgMACDxBQAApgwAMPIFAAAxABDzBQAApgwAMPQFAQC3CgAh-QUBALgKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGsBgAApwzaBiLNBgEAtwoAIdMGAQC4CgAh1QYBALgKACHXBgEAtwoAIdgGAQC3CgAh1wcAADEAINgHAAAxACAQBwAA-goAICoAALsLACDxBQAA-QsAMPIFAADIAQAQ8wUAAPkLADD0BQEAtwoAIfkFAQC3CgAh_AVAALsKACH9BUAAuwoAIc0GAQC4CgAhrgcBALcKACGvBwEAtwoAIbAHAgDvCwAhsgcAAPoLsgci1wcAAMgBACDYBwAAyAEAIBoHAAD6CgAgCQAA_wsAIAoAAK8MACALAAC7CwAgDgAAoAwAIA8AAKMMACAQAAD-CwAgGQAAlQwAIBsAAI0MACAsAACtDAAgLQAArgwAIPEFAACsDAAw8gUAACYAEPMFAACsDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZwGAQC3CgAhnQYBALcKACGeBgEAtwoAIaAGAQC3CgAh1QYBALcKACHlBgEAuAoAIasHQAC7CgAhA9AGAACFAQAg0QYAAIUBACDSBgAAhQEAIB0HAAD6CgAgCQAA_wsAIBAAAP4LACApAAD9CwAg8QUAAPsLADDyBQAAiQEAEPMFAAD7CwAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZ4GAQC3CgAhsgYBALcKACGzBggA_AsAIbQGCAD8CwAhtQYIAPwLACG2BggA_AsAIbcGCAD8CwAhuAYIAPwLACG5BggA_AsAIboGCAD8CwAhuwYIAPwLACG8BggA_AsAIb0GCAD8CwAhvgYIAPwLACG_BggA_AsAIdcHAACJAQAg2AcAAIkBACAUBwAA-goAIAkAAIwMACANAADmCgAgDwAAsAsAIPEFAACxDAAw8gUAAB0AEPMFAACxDAAw9AUBALcKACH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIaUGAQC3CgAh0wYBALgKACHdBgEAuAoAId4GQADhCwAh3wYIAPwLACHgBggA_AsAIdcHAAAdACDYBwAAHQAgEgcAAPoKACAJAACMDAAgCgAArwwAIA0AAOYKACARAAC0CwAg8QUAALAMADDyBQAAIQAQ8wUAALAMADD0BQEAtwoAIfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACHfBgIA9AsAIeUGAQC4CgAhrAcBALcKACGtBwEAtwoAIRIHAAD6CgAgCQAAjAwAIA0AAOYKACAPAACwCwAg8QUAALEMADDyBQAAHQAQ8wUAALEMADD0BQEAtwoAIfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAhpQYBALcKACHTBgEAuAoAId0GAQC4CgAh3gZAAOELACHfBggA_AsAIeAGCAD8CwAhHAgAALMMACAMAADkCgAgDQAA5goAIBEAALQLACAcAADoCgAgJQAA5QoAICcAAOcKACAqAAC7CwAgLgAArQsAIC8AAK4LACAwAACwCwAgMQAAsgsAIDIAALMLACA0AAD3CgAgNQAAtgsAIDYAALcLACA3AAC4CwAgOAAAvgsAIPEFAACyDAAw8gUAABgAEPMFAACyDAAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACHkBgEAuAoAIZYHAQC4CgAhqgcBALcKACEOBwAA-AsAIDkAALUMACDxBQAAtAwAMPIFAAASABDzBQAAtAwAMPQFAQC3CgAh-QUBALgKACH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACGWBwEAuAoAIaoHAQC3CgAh1wcAABIAINgHAAASACAMBwAA-AsAIDkAALUMACDxBQAAtAwAMPIFAAASABDzBQAAtAwAMPQFAQC3CgAh-QUBALgKACH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACGWBwEAuAoAIaoHAQC3CgAhA9AGAAAYACDRBgAAGAAg0gYAABgAIBYDAAC8CgAgBwAA-goAIAkAAIwMACANAADmCgAgEQAAtAsAICIAAL4LACAkAAC2CwAgSgAA9woAIEsAALgLACDxBQAAtgwAMPIFAAAOABDzBQAAtgwAMPQFAQC3CgAh9QUBALcKACH2BQEAtwoAIfcFAQC3CgAh-AUBALgKACH5BQEAtwoAIfoFAQC3CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhCwMAALwKACAHAAD6CgAg8QUAALcMADDyBQAACwAQ8wUAALcMADD0BQEAtwoAIfkFAQC3CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhggcAALgMzwciBP4FAAAAzwcC_wUAAADPBwiABgAAAM8HCIUGAADcC88HIhEDAAC8CgAg8QUAALkMADDyBQAABwAQ8wUAALkMADD0BQEAtwoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIbcHAQC3CgAhuAcBALcKACG5BwEAuAoAIboHAQC4CgAhuwcBALgKACG8B0AA4QsAIb0HQADhCwAhvgcBALgKACG_BwEAuAoAIQwDAAC8CgAg8QUAALoMADDyBQAAAwAQ8wUAALoMADD0BQEAtwoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIbQHQAC7CgAhwAcBALcKACHBBwEAuAoAIcIHAQC4CgAhAAAAAAHcBwEAAAABAdwHAQAAAAEB3AdAAAAAAQVlAACZHAAgZgAA3x0AINkHAACaHAAg2gcAAN4dACDfBwAA-QQAIAtlAADLDQAwZgAA0A0AMNkHAADMDQAw2gcAAM0NADDbBwAAzg0AINwHAADPDQAw3QcAAM8NADDeBwAAzw0AMN8HAADPDQAw4AcAANENADDhBwAA0g0AMAtlAAC3DQAwZgAAvA0AMNkHAAC4DQAw2gcAALkNADDbBwAAug0AINwHAAC7DQAw3QcAALsNADDeBwAAuw0AMN8HAAC7DQAw4AcAAL0NADDhBwAAvg0AMAtlAACQDQAwZgAAlQ0AMNkHAACRDQAw2gcAAJINADDbBwAAkw0AINwHAACUDQAw3QcAAJQNADDeBwAAlA0AMN8HAACUDQAw4AcAAJYNADDhBwAAlw0AMAtlAAD5DAAwZgAA_gwAMNkHAAD6DAAw2gcAAPsMADDbBwAA_AwAINwHAAD9DAAw3QcAAP0MADDeBwAA_QwAMN8HAAD9DAAw4AcAAP8MADDhBwAAgA0AMAtlAADmDAAwZgAA6wwAMNkHAADnDAAw2gcAAOgMADDbBwAA6QwAINwHAADqDAAw3QcAAOoMADDeBwAA6gwAMN8HAADqDAAw4AcAAOwMADDhBwAA7QwAMAtlAADLDAAwZgAA0AwAMNkHAADMDAAw2gcAAM0MADDbBwAAzgwAINwHAADPDAAw3QcAAM8MADDeBwAAzwwAMN8HAADPDAAw4AcAANEMADDhBwAA0gwAMAVlAACXHAAgZgAA3B0AINkHAACYHAAg2gcAANsdACDfBwAAGgAgBWUAAJUcACBmAADZHQAg2QcAAJYcACDaBwAA2B0AIN8HAAD2AgAgFRgAAOMMACAZAADkDAAgHgAA4AwAIB8AAOEMACAgAADiDAAgIQAA5QwAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABAgAAAF0AIGUAAN8MACADAAAAXQAgZQAA3wwAIGYAANgMACABXgAA1x0AMBoQAACEDAAgGAAA4gsAIBkAAJEMACAeAAD6CgAgHwAA-goAICAAALwKACAhAAD_CwAg8QUAAI4MADDyBQAAWwAQ8wUAAI4MADD0BQEAAAAB_AVAALsKACH9BUAAuwoAIZ4GAQC4CgAhoAYBALgKACGsBgAAkAyIByKuBkAA4QsAIbEGAQC4CgAhhgcAAI8MhgciiAcBALcKACGJBwEAtwoAIYoHAQC3CgAhiwcBALgKACGMBwEAuAoAIY0HAQC4CgAhjgdAALsKACECAAAAXQAgXgAA2AwAIAIAAADTDAAgXgAA1AwAIBPxBQAA0gwAMPIFAADTDAAQ8wUAANIMADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGeBgEAuAoAIaAGAQC4CgAhrAYAAJAMiAcirgZAAOELACGxBgEAuAoAIYYHAACPDIYHIogHAQC3CgAhiQcBALcKACGKBwEAtwoAIYsHAQC4CgAhjAcBALgKACGNBwEAuAoAIY4HQAC7CgAhE_EFAADSDAAw8gUAANMMABDzBQAA0gwAMPQFAQC3CgAh_AVAALsKACH9BUAAuwoAIZ4GAQC4CgAhoAYBALgKACGsBgAAkAyIByKuBkAA4QsAIbEGAQC4CgAhhgcAAI8MhgciiAcBALcKACGJBwEAtwoAIYoHAQC3CgAhiwcBALgKACGMBwEAuAoAIY0HAQC4CgAhjgdAALsKACEP9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhoAYBAMAMACGsBgAA1gyIByKuBkAA1wwAIbEGAQDADAAhhgcAANUMhgciiAcBAL8MACGJBwEAvwwAIYoHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEB3AcAAACGBwIB3AcAAACIBwIB3AdAAAAAARUYAADcDAAgGQAA3QwAIB4AANkMACAfAADaDAAgIAAA2wwAICEAAN4MACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKIBwEAvwwAIYkHAQC_DAAhigcBAL8MACGLBwEAwAwAIYwHAQDADAAhjQcBAMAMACGOB0AAwQwAIQVlAADDHQAgZgAA1R0AINkHAADEHQAg2gcAANQdACDfBwAA-QQAIAVlAADBHQAgZgAA0h0AINkHAADCHQAg2gcAANEdACDfBwAA-QQAIAVlAAC_HQAgZgAAzx0AINkHAADAHQAg2gcAAM4dACDfBwAA9gIAIAdlAAC9HQAgZgAAzB0AINkHAAC-HQAg2gcAAMsdACDdBwAAUQAg3gcAAFEAIN8HAAD2AgAgB2UAALsdACBmAADJHQAg2QcAALwdACDaBwAAyB0AIN0HAABTACDeBwAAUwAg3wcAAJ0BACAHZQAAuR0AIGYAAMYdACDZBwAAuh0AINoHAADFHQAg3QcAABgAIN4HAAAYACDfBwAAGgAgFRgAAOMMACAZAADkDAAgHgAA4AwAIB8AAOEMACAgAADiDAAgIQAA5QwAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABA2UAAMMdACDZBwAAxB0AIN8HAAD5BAAgA2UAAMEdACDZBwAAwh0AIN8HAAD5BAAgA2UAAL8dACDZBwAAwB0AIN8HAAD2AgAgA2UAAL0dACDZBwAAvh0AIN8HAAD2AgAgA2UAALsdACDZBwAAvB0AIN8HAACdAQAgA2UAALkdACDZBwAAuh0AIN8HAAAaACAWBwAA9wwAIAkAAPgMACApAAD2DAAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGyBgEAAAABswYIAAAAAbQGCAAAAAG1BggAAAABtgYIAAAAAbcGCAAAAAG4BggAAAABuQYIAAAAAboGCAAAAAG7BggAAAABvAYIAAAAAb0GCAAAAAG-BggAAAABvwYIAAAAAQIAAACtAQAgZQAA9QwAIAMAAACtAQAgZQAA9QwAIGYAAPEMACABXgAAuB0AMBsHAAD6CgAgCQAA_wsAIBAAAP4LACApAAD9CwAg8QUAAPsLADDyBQAAiQEAEPMFAAD7CwAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhngYBALcKACGyBgEAAAABswYIAPwLACG0BggA_AsAIbUGCAD8CwAhtgYIAPwLACG3BggA_AsAIbgGCAD8CwAhuQYIAPwLACG6BggA_AsAIbsGCAD8CwAhvAYIAPwLACG9BggA_AsAIb4GCAD8CwAhvwYIAPwLACECAAAArQEAIF4AAPEMACACAAAA7gwAIF4AAO8MACAX8QUAAO0MADDyBQAA7gwAEPMFAADtDAAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZ4GAQC3CgAhsgYBALcKACGzBggA_AsAIbQGCAD8CwAhtQYIAPwLACG2BggA_AsAIbcGCAD8CwAhuAYIAPwLACG5BggA_AsAIboGCAD8CwAhuwYIAPwLACG8BggA_AsAIb0GCAD8CwAhvgYIAPwLACG_BggA_AsAIRfxBQAA7QwAMPIFAADuDAAQ8wUAAO0MADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhngYBALcKACGyBgEAtwoAIbMGCAD8CwAhtAYIAPwLACG1BggA_AsAIbYGCAD8CwAhtwYIAPwLACG4BggA_AsAIbkGCAD8CwAhugYIAPwLACG7BggA_AsAIbwGCAD8CwAhvQYIAPwLACG-BggA_AsAIb8GCAD8CwAhE_QFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGyBgEAvwwAIbMGCADwDAAhtAYIAPAMACG1BggA8AwAIbYGCADwDAAhtwYIAPAMACG4BggA8AwAIbkGCADwDAAhugYIAPAMACG7BggA8AwAIbwGCADwDAAhvQYIAPAMACG-BggA8AwAIb8GCADwDAAhBdwHCAAAAAHiBwgAAAAB4wcIAAAAAeQHCAAAAAHlBwgAAAABFgcAAPMMACAJAAD0DAAgKQAA8gwAIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGyBgEAvwwAIbMGCADwDAAhtAYIAPAMACG1BggA8AwAIbYGCADwDAAhtwYIAPAMACG4BggA8AwAIbkGCADwDAAhugYIAPAMACG7BggA8AwAIbwGCADwDAAhvQYIAPAMACG-BggA8AwAIb8GCADwDAAhBWUAAK0dACBmAAC2HQAg2QcAAK4dACDaBwAAtR0AIN8HAAAoACAFZQAAqx0AIGYAALMdACDZBwAArB0AINoHAACyHQAg3wcAAPkEACAHZQAAqR0AIGYAALAdACDZBwAAqh0AINoHAACvHQAg3QcAABgAIN4HAAAYACDfBwAAGgAgFgcAAPcMACAJAAD4DAAgKQAA9gwAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABsgYBAAAAAbMGCAAAAAG0BggAAAABtQYIAAAAAbYGCAAAAAG3BggAAAABuAYIAAAAAbkGCAAAAAG6BggAAAABuwYIAAAAAbwGCAAAAAG9BggAAAABvgYIAAAAAb8GCAAAAAEDZQAArR0AINkHAACuHQAg3wcAACgAIANlAACrHQAg2QcAAKwdACDfBwAA-QQAIANlAACpHQAg2QcAAKodACDfBwAAGgAgEgcAAI4NACAJAACPDQAgFgAAiw0AIBgAAI0NACAzAACMDQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGJBgEAAAABqgYBAAAAAawGAAAArAYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAECAAAAowEAIGUAAIoNACADAAAAowEAIGUAAIoNACBmAACEDQAgAV4AAKgdADAYBwAA-goAIAkAAP8LACAQAACEDAAgFgAAgwwAIBgAAOILACAzAAC8CgAg8QUAAIEMADDyBQAAoQEAEPMFAACBDAAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhiQYBALcKACGeBgEAuAoAIaoGAQC4CgAhrAYAAIIMrAYirQYBALgKACGuBkAA4QsAIa8GQAC7CgAhsAYBALcKACGxBgEAuAoAIdEHAACADAAgAgAAAKMBACBeAACEDQAgAgAAAIENACBeAACCDQAgEfEFAACADQAw8gUAAIENABDzBQAAgA0AMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGJBgEAtwoAIZ4GAQC4CgAhqgYBALgKACGsBgAAggysBiKtBgEAuAoAIa4GQADhCwAhrwZAALsKACGwBgEAtwoAIbEGAQC4CgAhEfEFAACADQAw8gUAAIENABDzBQAAgA0AMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGJBgEAtwoAIZ4GAQC4CgAhqgYBALgKACGsBgAAggysBiKtBgEAuAoAIa4GQADhCwAhrwZAALsKACGwBgEAtwoAIbEGAQC4CgAhDfQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIaoGAQDADAAhrAYAAIMNrAYirQYBAMAMACGuBkAA1wwAIa8GQADBDAAhsAYBAL8MACGxBgEAwAwAIQHcBwAAAKwGAhIHAACIDQAgCQAAiQ0AIBYAAIUNACAYAACHDQAgMwAAhg0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIaoGAQDADAAhrAYAAIMNrAYirQYBAMAMACGuBkAA1wwAIa8GQADBDAAhsAYBAL8MACGxBgEAwAwAIQVlAACXHQAgZgAAph0AINkHAACYHQAg2gcAAKUdACDfBwAA5wYAIAVlAACVHQAgZgAAox0AINkHAACWHQAg2gcAAKIdACDfBwAA9gIAIAdlAACTHQAgZgAAoB0AINkHAACUHQAg2gcAAJ8dACDdBwAAUQAg3gcAAFEAIN8HAAD2AgAgBWUAAJEdACBmAACdHQAg2QcAAJIdACDaBwAAnB0AIN8HAAD5BAAgB2UAAI8dACBmAACaHQAg2QcAAJAdACDaBwAAmR0AIN0HAAAYACDeBwAAGAAg3wcAABoAIBIHAACODQAgCQAAjw0AIBYAAIsNACAYAACNDQAgMwAAjA0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABiQYBAAAAAaoGAQAAAAGsBgAAAKwGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABA2UAAJcdACDZBwAAmB0AIN8HAADnBgAgA2UAAJUdACDZBwAAlh0AIN8HAAD2AgAgA2UAAJMdACDZBwAAlB0AIN8HAAD2AgAgA2UAAJEdACDZBwAAkh0AIN8HAAD5BAAgA2UAAI8dACDZBwAAkB0AIN8HAAAaACAOBwAAtA0AIAkAALUNACAOAACzDQAgIwAAtg0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAaUGAQAAAAGmBgEAAAABqAYAAACoBgKpBkAAAAABAgAAAEEAIGUAALINACADAAAAQQAgZQAAsg0AIGYAAJsNACABXgAAjh0AMBMHAAD6CgAgCQAA_wsAIA4AAKAMACAQAAD-CwAgIwAAtwsAIPEFAACeDAAw8gUAAD8AEPMFAACeDAAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnAYBALcKACGeBgEAtwoAIaUGAQC3CgAhpgYBALgKACGoBgAAnwyoBiKpBkAA4QsAIQIAAABBACBeAACbDQAgAgAAAJgNACBeAACZDQAgDvEFAACXDQAw8gUAAJgNABDzBQAAlw0AMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGcBgEAtwoAIZ4GAQC3CgAhpQYBALcKACGmBgEAuAoAIagGAACfDKgGIqkGQADhCwAhDvEFAACXDQAw8gUAAJgNABDzBQAAlw0AMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGcBgEAtwoAIZ4GAQC3CgAhpQYBALcKACGmBgEAuAoAIagGAACfDKgGIqkGQADhCwAhCvQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIaUGAQC_DAAhpgYBAMAMACGoBgAAmg2oBiKpBkAA1wwAIQHcBwAAAKgGAg4HAACdDQAgCQAAng0AIA4AAJwNACAjAACfDQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhpQYBAL8MACGmBgEAwAwAIagGAACaDagGIqkGQADXDAAhBWUAAPMcACBmAACMHQAg2QcAAPQcACDaBwAAix0AIN8HAAA3ACAFZQAA8RwAIGYAAIkdACDZBwAA8hwAINoHAACIHQAg3wcAAPkEACAHZQAA7xwAIGYAAIYdACDZBwAA8BwAINoHAACFHQAg3QcAABgAIN4HAAAYACDfBwAAGgAgC2UAAKANADBmAAClDQAw2QcAAKENADDaBwAAog0AMNsHAACjDQAg3AcAAKQNADDdBwAApA0AMN4HAACkDQAw3wcAAKQNADDgBwAApg0AMOEHAACnDQAwDQcAALANACAJAACxDQAgGQAArw0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAaEGAQAAAAGiBgEAAAABowYBAAAAAaQGQAAAAAECAAAARgAgZQAArg0AIAMAAABGACBlAACuDQAgZgAAqg0AIAFeAACEHQAwEwcAAPoKACAJAAD_CwAgEgAAnQwAIBkAAJUMACDxBQAAnAwAMPIFAABEABDzBQAAnAwAMPQFAQAAAAH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZ8GAQC3CgAhoAYBALcKACGhBgEAuAoAIaIGAQC4CgAhowYBALgKACGkBkAAuwoAIdUHAACbDAAgAgAAAEYAIF4AAKoNACACAAAAqA0AIF4AAKkNACAO8QUAAKcNADDyBQAAqA0AEPMFAACnDQAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZ8GAQC3CgAhoAYBALcKACGhBgEAuAoAIaIGAQC4CgAhowYBALgKACGkBkAAuwoAIQ7xBQAApw0AMPIFAACoDQAQ8wUAAKcNADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnwYBALcKACGgBgEAtwoAIaEGAQC4CgAhogYBALgKACGjBgEAuAoAIaQGQAC7CgAhCvQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGgBgEAvwwAIaEGAQDADAAhogYBAMAMACGjBgEAwAwAIaQGQADBDAAhDQcAAKwNACAJAACtDQAgGQAAqw0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGgBgEAvwwAIaEGAQDADAAhogYBAMAMACGjBgEAwAwAIaQGQADBDAAhBWUAAPkcACBmAACCHQAg2QcAAPocACDaBwAAgR0AIN8HAACdAQAgBWUAAPccACBmAAD_HAAg2QcAAPgcACDaBwAA_hwAIN8HAAD5BAAgB2UAAPUcACBmAAD8HAAg2QcAAPYcACDaBwAA-xwAIN0HAAAYACDeBwAAGAAg3wcAABoAIA0HAACwDQAgCQAAsQ0AIBkAAK8NACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAaAGAQAAAAGhBgEAAAABogYBAAAAAaMGAQAAAAGkBkAAAAABA2UAAPkcACDZBwAA-hwAIN8HAACdAQAgA2UAAPccACDZBwAA-BwAIN8HAAD5BAAgA2UAAPUcACDZBwAA9hwAIN8HAAAaACAOBwAAtA0AIAkAALUNACAOAACzDQAgIwAAtg0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAaUGAQAAAAGmBgEAAAABqAYAAACoBgKpBkAAAAABA2UAAPMcACDZBwAA9BwAIN8HAAA3ACADZQAA8RwAINkHAADyHAAg3wcAAPkEACADZQAA7xwAINkHAADwHAAg3wcAABoAIARlAACgDQAw2QcAAKENADDbBwAAow0AIN8HAACkDQAwCwcAAMkNACAJAADKDQAgDgAAxw0AIA8AAMgNACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGdBgEAAAABAgAAADwAIGUAAMYNACADAAAAPAAgZQAAxg0AIGYAAMENACABXgAA7hwAMBEHAAD6CgAgCQAA_wsAIA4AAKAMACAPAACjDAAgEAAA_gsAIPEFAACiDAAw8gUAADoAEPMFAACiDAAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnAYBALcKACGdBgEAtwoAIZ4GAQC3CgAh1gcAAKEMACACAAAAPAAgXgAAwQ0AIAIAAAC_DQAgXgAAwA0AIAvxBQAAvg0AMPIFAAC_DQAQ8wUAAL4NADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnAYBALcKACGdBgEAtwoAIZ4GAQC3CgAhC_EFAAC-DQAw8gUAAL8NABDzBQAAvg0AMPQFAQC3CgAh-QUBALcKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGcBgEAtwoAIZ0GAQC3CgAhngYBALcKACEH9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACELBwAAxA0AIAkAAMUNACAOAADCDQAgDwAAww0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhBWUAAOAcACBmAADsHAAg2QcAAOEcACDaBwAA6xwAIN8HAAA3ACAFZQAA3hwAIGYAAOkcACDZBwAA3xwAINoHAADoHAAg3wcAACMAIAVlAADcHAAgZgAA5hwAINkHAADdHAAg2gcAAOUcACDfBwAA-QQAIAdlAADaHAAgZgAA4xwAINkHAADbHAAg2gcAAOIcACDdBwAAGAAg3gcAABgAIN8HAAAaACALBwAAyQ0AIAkAAMoNACAOAADHDQAgDwAAyA0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAEDZQAA4BwAINkHAADhHAAg3wcAADcAIANlAADeHAAg2QcAAN8cACDfBwAAIwAgA2UAANwcACDZBwAA3RwAIN8HAAD5BAAgA2UAANocACDZBwAA2xwAIN8HAAAaACAVBwAAkg4AIAkAAI8OACAKAACQDgAgCwAAiQ4AIA4AAI4OACAPAACMDgAgGQAAjQ4AIBsAAJEOACAsAACKDgAgLQAAiw4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGgBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABAgAAACgAIGUAAIgOACADAAAAKAAgZQAAiA4AIGYAANUNACABXgAA2RwAMBoHAAD6CgAgCQAA_wsAIAoAAK8MACALAAC7CwAgDgAAoAwAIA8AAKMMACAQAAD-CwAgGQAAlQwAIBsAAI0MACAsAACtDAAgLQAArgwAIPEFAACsDAAw8gUAACYAEPMFAACsDAAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnAYBALcKACGdBgEAtwoAIZ4GAQC3CgAhoAYBALcKACHVBgEAtwoAIeUGAQC4CgAhqwdAALsKACECAAAAKAAgXgAA1Q0AIAIAAADTDQAgXgAA1A0AIA_xBQAA0g0AMPIFAADTDQAQ8wUAANINADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhnAYBALcKACGdBgEAtwoAIZ4GAQC3CgAhoAYBALcKACHVBgEAtwoAIeUGAQC4CgAhqwdAALsKACEP8QUAANINADDyBQAA0w0AEPMFAADSDQAw9AUBALcKACH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIZwGAQC3CgAhnQYBALcKACGeBgEAtwoAIaAGAQC3CgAh1QYBALcKACHlBgEAuAoAIasHQAC7CgAhC_QFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhoAYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACEVBwAA3w0AIAkAANwNACAKAADdDQAgCwAA1g0AIA4AANsNACAPAADZDQAgGQAA2g0AIBsAAN4NACAsAADXDQAgLQAA2A0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhoAYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACELZQAA9A0AMGYAAPkNADDZBwAA9Q0AMNoHAAD2DQAw2wcAAPcNACDcBwAA-A0AMN0HAAD4DQAw3gcAAPgNADDfBwAA-A0AMOAHAAD6DQAw4QcAAPsNADALZQAA5w0AMGYAAOwNADDZBwAA6A0AMNoHAADpDQAw2wcAAOoNACDcBwAA6w0AMN0HAADrDQAw3gcAAOsNADDfBwAA6w0AMOAHAADtDQAw4QcAAO4NADAHZQAA4A0AIGYAAOMNACDZBwAA4Q0AINoHAADiDQAg3QcAAIkBACDeBwAAiQEAIN8HAACtAQAgBWUAAKccACBmAADXHAAg2QcAAKgcACDaBwAA1hwAIN8HAAAjACAFZQAApRwAIGYAANQcACDZBwAAphwAINoHAADTHAAg3wcAAJ0BACAFZQAAoxwAIGYAANEcACDZBwAApBwAINoHAADQHAAg3wcAADcAIAdlAAChHAAgZgAAzhwAINkHAACiHAAg2gcAAM0cACDdBwAAGAAg3gcAABgAIN8HAAAaACAHZQAAnxwAIGYAAMscACDZBwAAoBwAINoHAADKHAAg3QcAAB0AIN4HAAAdACDfBwAAHwAgBWUAAJ0cACBmAADIHAAg2QcAAJ4cACDaBwAAxxwAIN8HAAD_BwAgBWUAAJscACBmAADFHAAg2QcAAJwcACDaBwAAxBwAIN8HAAD5BAAgFgcAAPcMACAJAAD4DAAgEAAA5g0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAbMGCAAAAAG0BggAAAABtQYIAAAAAbYGCAAAAAG3BggAAAABuAYIAAAAAbkGCAAAAAG6BggAAAABuwYIAAAAAbwGCAAAAAG9BggAAAABvgYIAAAAAb8GCAAAAAECAAAArQEAIGUAAOANACADAAAAiQEAIGUAAOANACBmAADkDQAgGAAAAIkBACAHAADzDAAgCQAA9AwAIBAAAOUNACBeAADkDQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZ4GAQC_DAAhswYIAPAMACG0BggA8AwAIbUGCADwDAAhtgYIAPAMACG3BggA8AwAIbgGCADwDAAhuQYIAPAMACG6BggA8AwAIbsGCADwDAAhvAYIAPAMACG9BggA8AwAIb4GCADwDAAhvwYIAPAMACEWBwAA8wwAIAkAAPQMACAQAADlDQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZ4GAQC_DAAhswYIAPAMACG0BggA8AwAIbUGCADwDAAhtgYIAPAMACG3BggA8AwAIbgGCADwDAAhuQYIAPAMACG6BggA8AwAIbsGCADwDAAhvAYIAPAMACG9BggA8AwAIb4GCADwDAAhvwYIAPAMACEFZQAAvxwAIGYAAMIcACDZBwAAwBwAINoHAADBHAAg3wcAABAAIANlAAC_HAAg2QcAAMAcACDfBwAAEAAgBfQFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAzgcCzAdAAAAAAQIAAACHAQAgZQAA8w0AIAMAAACHAQAgZQAA8w0AIGYAAPINACABXgAAvhwAMAspAAD9CwAg8QUAAIgMADDyBQAAhQEAEPMFAACIDAAw9AUBAAAAAfwFQAC7CgAh_QVAALsKACGsBgAAiQzOByKyBgEAtwoAIcwHQAC7CgAh0gcAAIcMACACAAAAhwEAIF4AAPINACACAAAA7w0AIF4AAPANACAJ8QUAAO4NADDyBQAA7w0AEPMFAADuDQAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhrAYAAIkMzgcisgYBALcKACHMB0AAuwoAIQnxBQAA7g0AMPIFAADvDQAQ8wUAAO4NADD0BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAAiQzOByKyBgEAtwoAIcwHQAC7CgAhBfQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIawGAADxDc4HIswHQADBDAAhAdwHAAAAzgcCBfQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIawGAADxDc4HIswHQADBDAAhBfQFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAzgcCzAdAAAAAAQ4HAACGDgAgCQAAhw4AICgAAIQOACArAACFDgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAQIAAAAsACBlAACDDgAgAwAAACwAIGUAAIMOACBmAAD-DQAgAV4AAL0cADATBwAA-AsAIAkAAP8LACAoAACqDAAgKQAA_QsAICsAAKsMACDxBQAAqQwAMPIFAAAqABDzBQAAqQwAMPQFAQAAAAH5BQEAuAoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIbIGAQC3CgAhzQYBALcKACHTBgEAuAoAIdoGAQC4CgAh2wYBALcKACHcBgEAtwoAIQIAAAAsACBeAAD-DQAgAgAAAPwNACBeAAD9DQAgDvEFAAD7DQAw8gUAAPwNABDzBQAA-w0AMPQFAQC3CgAh-QUBALgKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGyBgEAtwoAIc0GAQC3CgAh0wYBALgKACHaBgEAuAoAIdsGAQC3CgAh3AYBALcKACEO8QUAAPsNADDyBQAA_A0AEPMFAAD7DQAw9AUBALcKACH5BQEAuAoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIbIGAQC3CgAhzQYBALcKACHTBgEAuAoAIdoGAQC4CgAh2wYBALcKACHcBgEAtwoAIQr0BQEAvwwAIfkFAQDADAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIdoGAQDADAAh2wYBAL8MACHcBgEAvwwAIQ4HAACBDgAgCQAAgg4AICgAAP8NACArAACADgAg9AUBAL8MACH5BQEAwAwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACHaBgEAwAwAIdsGAQC_DAAh3AYBAL8MACEFZQAArxwAIGYAALscACDZBwAAsBwAINoHAAC6HAAg3wcAADMAIAVlAACtHAAgZgAAuBwAINkHAACuHAAg2gcAALccACDfBwAAygEAIAdlAACrHAAgZgAAtRwAINkHAACsHAAg2gcAALQcACDdBwAAFgAg3gcAABYAIN8HAAD5BAAgB2UAAKkcACBmAACyHAAg2QcAAKocACDaBwAAsRwAIN0HAAAYACDeBwAAGAAg3wcAABoAIA4HAACGDgAgCQAAhw4AICgAAIQOACArAACFDgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAQNlAACvHAAg2QcAALAcACDfBwAAMwAgA2UAAK0cACDZBwAArhwAIN8HAADKAQAgA2UAAKscACDZBwAArBwAIN8HAAD5BAAgA2UAAKkcACDZBwAAqhwAIN8HAAAaACAVBwAAkg4AIAkAAI8OACAKAACQDgAgCwAAiQ4AIA4AAI4OACAPAACMDgAgGQAAjQ4AIBsAAJEOACAsAACKDgAgLQAAiw4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGgBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABBGUAAPQNADDZBwAA9Q0AMNsHAAD3DQAg3wcAAPgNADAEZQAA5w0AMNkHAADoDQAw2wcAAOoNACDfBwAA6w0AMANlAADgDQAg2QcAAOENACDfBwAArQEAIANlAACnHAAg2QcAAKgcACDfBwAAIwAgA2UAAKUcACDZBwAAphwAIN8HAACdAQAgA2UAAKMcACDZBwAApBwAIN8HAAA3ACADZQAAoRwAINkHAACiHAAg3wcAABoAIANlAACfHAAg2QcAAKAcACDfBwAAHwAgA2UAAJ0cACDZBwAAnhwAIN8HAAD_BwAgA2UAAJscACDZBwAAnBwAIN8HAAD5BAAgA2UAAJkcACDZBwAAmhwAIN8HAAD5BAAgBGUAAMsNADDZBwAAzA0AMNsHAADODQAg3wcAAM8NADAEZQAAtw0AMNkHAAC4DQAw2wcAALoNACDfBwAAuw0AMARlAACQDQAw2QcAAJENADDbBwAAkw0AIN8HAACUDQAwBGUAAPkMADDZBwAA-gwAMNsHAAD8DAAg3wcAAP0MADAEZQAA5gwAMNkHAADnDAAw2wcAAOkMACDfBwAA6gwAMARlAADLDAAw2QcAAMwMADDbBwAAzgwAIN8HAADPDAAwA2UAAJccACDZBwAAmBwAIN8HAAAaACADZQAAlRwAINkHAACWHAAg3wcAAPYCACAAAAAC3AcBAAAABOYHAQAAAAUC3AcBAAAABOYHAQAAAAUB3AcgAAAAAQVlAACQHAAgZgAAkxwAINkHAACRHAAg2gcAAJIcACDfBwAA9gIAIAHcBwEAAAAEAdwHAQAAAAQDZQAAkBwAINkHAACRHAAg3wcAAPYCACAbBAAA6RgAIAUAAOoYACAGAADLFgAgEAAAzBYAIBkAAM0WACA0AACzEQAgQAAAzxYAIEwAAM8WACBNAACzEQAgTgAA6xgAIE8AAKIRACBQAACiEQAgUQAA7BgAIFIAAO0YACBTAADYFgAgVAAA2BYAIFUAANcWACBWAADXFgAgVwAA1hYAIFgAAO4YACD4BQAAuwwAIMUHAAC7DAAgxgcAALsMACDHBwAAuwwAIMgHAAC7DAAgyQcAALsMACDKBwAAuwwAIAAAAAVlAACLHAAgZgAAjhwAINkHAACMHAAg2gcAAI0cACDfBwAAEAAgA2UAAIscACDZBwAAjBwAIN8HAAAQACAAAAAFZQAAhhwAIGYAAIkcACDZBwAAhxwAINoHAACIHAAg3wcAAEEAIANlAACGHAAg2QcAAIccACDfBwAAQQAgAAAABWUAAIEcACBmAACEHAAg2QcAAIIcACDaBwAAgxwAIN8HAAAQACADZQAAgRwAINkHAACCHAAg3wcAABAAIAAAAAdlAAD8GwAgZgAA_xsAINkHAAD9GwAg2gcAAP4bACDdBwAADgAg3gcAAA4AIN8HAAAQACADZQAA_BsAINkHAAD9GwAg3wcAABAAIAAAAAAAAAAAAAAB3AcAAADCBgIB3AcAAADEBgIF3AcQAAAAAeIHEAAAAAHjBxAAAAAB5AcQAAAAAeUHEAAAAAEF3AcCAAAAAeIHAgAAAAHjBwIAAAAB5AcCAAAAAeUHAgAAAAEFZQAA9BsAIGYAAPobACDZBwAA9RsAINoHAAD5GwAg3wcAAPkEACAHZQAA8hsAIGYAAPcbACDZBwAA8xsAINoHAAD2GwAg3QcAANMBACDeBwAA0wEAIN8HAADVAQAgA2UAAPQbACDZBwAA9RsAIN8HAAD5BAAgA2UAAPIbACDZBwAA8xsAIN8HAADVAQAgAAAABWUAALUbACBmAADwGwAg2QcAALYbACDaBwAA7xsAIN8HAAD5BAAgB2UAALMbACBmAADtGwAg2QcAALQbACDaBwAA7BsAIN0HAAAYACDeBwAAGAAg3wcAABoAIAVlAACxGwAgZgAA6hsAINkHAACyGwAg2gcAAOkbACDfBwAA9gIAIAtlAACVDwAwZgAAmQ8AMNkHAACWDwAw2gcAAJcPADDbBwAAmA8AINwHAADPDQAw3QcAAM8NADDeBwAAzw0AMN8HAADPDQAw4AcAAJoPADDhBwAA0g0AMAtlAACMDwAwZgAAkA8AMNkHAACNDwAw2gcAAI4PADDbBwAAjw8AINwHAACkDQAw3QcAAKQNADDeBwAApA0AMN8HAACkDQAw4AcAAJEPADDhBwAApw0AMAtlAAD5DgAwZgAA_g4AMNkHAAD6DgAw2gcAAPsOADDbBwAA_A4AINwHAAD9DgAw3QcAAP0OADDeBwAA_Q4AMN8HAAD9DgAw4AcAAP8OADDhBwAAgA8AMAtlAADjDgAwZgAA6A4AMNkHAADkDgAw2gcAAOUOADDbBwAA5g4AINwHAADnDgAw3QcAAOcOADDeBwAA5w4AMN8HAADnDgAw4AcAAOkOADDhBwAA6g4AMAtlAADYDgAwZgAA3A4AMNkHAADZDgAw2gcAANoOADDbBwAA2w4AINwHAADPDAAw3QcAAM8MADDeBwAAzwwAMN8HAADPDAAw4AcAAN0OADDhBwAA0gwAMBUQAADiDgAgGAAA4wwAIB4AAOAMACAfAADhDAAgIAAA4gwAICEAAOUMACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGeBgEAAAABrAYAAACIBwKuBkAAAAABsQYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgdAAAAAAQIAAABdACBlAADhDgAgAwAAAF0AIGUAAOEOACBmAADfDgAgAV4AAOgbADACAAAAXQAgXgAA3w4AIAIAAADTDAAgXgAA3g4AIA_0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGeBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKIBwEAvwwAIYkHAQC_DAAhigcBAL8MACGLBwEAwAwAIYwHAQDADAAhjQcBAMAMACGOB0AAwQwAIRUQAADgDgAgGAAA3AwAIB4AANkMACAfAADaDAAgIAAA2wwAICEAAN4MACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGeBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKIBwEAvwwAIYkHAQC_DAAhigcBAL8MACGLBwEAwAwAIYwHAQDADAAhjQcBAMAMACGOB0AAwQwAIQdlAADjGwAgZgAA5hsAINkHAADkGwAg2gcAAOUbACDdBwAADgAg3gcAAA4AIN8HAAAQACAVEAAA4g4AIBgAAOMMACAeAADgDAAgHwAA4QwAICAAAOIMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAawGAAAAiAcCrgZAAAAAAbEGAQAAAAGGBwAAAIYHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAEDZQAA4xsAINkHAADkGwAg3wcAABAAIBoHAAD1DgAgCQAA9g4AIBsAAPcOACAdAAD4DgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAPMGAsQGEAAAAAHFBgEAAAABxgYCAAAAAdUGAQAAAAHvBgEAAAAB8QYAAADxBgLzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gaAAAAAAfsGQAAAAAH8BkAAAAABAgAAAFcAIGUAAPQOACADAAAAVwAgZQAA9A4AIGYAAO8OACABXgAA4hsAMB8HAAD6CgAgCQAAjAwAIBkAAJUMACAbAACNDAAgHQAAlgwAIPEFAACSDAAw8gUAAFUAEPMFAACSDAAw9AUBAAAAAfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAhoAYBALcKACGsBgAAlAzzBiLEBhAA7gsAIcUGAQC3CgAhxgYCAO8LACHVBgEAtwoAIe8GAQC3CgAh8QYAAJMM8QYi8wYBALcKACH0BgEAAAAB9QYBAAAAAfYGAQC4CgAh9wYBALgKACH4BgEAuAoAIfkGAQC4CgAh-gYAAPYLACD7BkAAuwoAIfwGQADhCwAhAgAAAFcAIF4AAO8OACACAAAA6w4AIF4AAOwOACAa8QUAAOoOADDyBQAA6w4AEPMFAADqDgAw9AUBALcKACH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIaAGAQC3CgAhrAYAAJQM8wYixAYQAO4LACHFBgEAtwoAIcYGAgDvCwAh1QYBALcKACHvBgEAtwoAIfEGAACTDPEGIvMGAQC3CgAh9AYBALcKACH1BgEAuAoAIfYGAQC4CgAh9wYBALgKACH4BgEAuAoAIfkGAQC4CgAh-gYAAPYLACD7BkAAuwoAIfwGQADhCwAhGvEFAADqDgAw8gUAAOsOABDzBQAA6g4AMPQFAQC3CgAh-QUBALcKACH6BQEAtwoAIfwFQAC7CgAh_QVAALsKACGgBgEAtwoAIawGAACUDPMGIsQGEADuCwAhxQYBALcKACHGBgIA7wsAIdUGAQC3CgAh7wYBALcKACHxBgAAkwzxBiLzBgEAtwoAIfQGAQC3CgAh9QYBALgKACH2BgEAuAoAIfcGAQC4CgAh-AYBALgKACH5BgEAuAoAIfoGAAD2CwAg-wZAALsKACH8BkAA4QsAIRb0BQEAvwwAIfkFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAO4O8wYixAYQAMcOACHFBgEAvwwAIcYGAgDIDgAh1QYBAL8MACHvBgEAvwwAIfEGAADtDvEGIvMGAQC_DAAh9AYBAL8MACH1BgEAwAwAIfYGAQDADAAh9wYBAMAMACH4BgEAwAwAIfkGAQDADAAh-gaAAAAAAfsGQADBDAAh_AZAANcMACEB3AcAAADxBgIB3AcAAADzBgIaBwAA8A4AIAkAAPEOACAbAADyDgAgHQAA8w4AIPQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACGsBgAA7g7zBiLEBhAAxw4AIcUGAQC_DAAhxgYCAMgOACHVBgEAvwwAIe8GAQC_DAAh8QYAAO0O8QYi8wYBAL8MACH0BgEAvwwAIfUGAQDADAAh9gYBAMAMACH3BgEAwAwAIfgGAQDADAAh-QYBAMAMACH6BoAAAAAB-wZAAMEMACH8BkAA1wwAIQVlAADUGwAgZgAA4BsAINkHAADVGwAg2gcAAN8bACDfBwAA-QQAIAVlAADSGwAgZgAA3RsAINkHAADTGwAg2gcAANwbACDfBwAAGgAgBWUAANAbACBmAADaGwAg2QcAANEbACDaBwAA2RsAIN8HAAD_BwAgBWUAAM4bACBmAADXGwAg2QcAAM8bACDaBwAA1hsAIN8HAAB2ACAaBwAA9Q4AIAkAAPYOACAbAAD3DgAgHQAA-A4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAADzBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHVBgEAAAAB7wYBAAAAAfEGAAAA8QYC8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAfcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGgAAAAAH7BkAAAAAB_AZAAAAAAQNlAADUGwAg2QcAANUbACDfBwAA-QQAIANlAADSGwAg2QcAANMbACDfBwAAGgAgA2UAANAbACDZBwAA0RsAIN8HAAD_BwAgA2UAAM4bACDZBwAAzxsAIN8HAAB2ACAOFgAAiQ8AIBcAAIoPACAYAACLDwAg9AUBAAAAAfwFQAAAAAH9BUAAAAABqgYBAAAAAawGAAAAywYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAHLBgEAAAABAgAAAE0AIGUAAIgPACADAAAATQAgZQAAiA8AIGYAAIQPACABXgAAzRsAMBQWAACaDAAgFwAAvAoAIBgAAOILACAZAACRDAAg8QUAAJgMADDyBQAASwAQ8wUAAJgMADD0BQEAAAAB_AVAALsKACH9BUAAuwoAIaAGAQC4CgAhqgYBALgKACGsBgAAmQzLBiKtBgEAuAoAIa4GQADhCwAhrwZAALsKACGwBgEAtwoAIbEGAQC4CgAhywYBALcKACHUBwAAlwwAIAIAAABNACBeAACEDwAgAgAAAIEPACBeAACCDwAgD_EFAACADwAw8gUAAIEPABDzBQAAgA8AMPQFAQC3CgAh_AVAALsKACH9BUAAuwoAIaAGAQC4CgAhqgYBALgKACGsBgAAmQzLBiKtBgEAuAoAIa4GQADhCwAhrwZAALsKACGwBgEAtwoAIbEGAQC4CgAhywYBALcKACEP8QUAAIAPADDyBQAAgQ8AEPMFAACADwAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAhoAYBALgKACGqBgEAuAoAIawGAACZDMsGIq0GAQC4CgAhrgZAAOELACGvBkAAuwoAIbAGAQC3CgAhsQYBALgKACHLBgEAtwoAIQv0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGqBgEAwAwAIawGAACDD8sGIq0GAQDADAAhrgZAANcMACGvBkAAwQwAIbAGAQC_DAAhsQYBAMAMACHLBgEAvwwAIQHcBwAAAMsGAg4WAACFDwAgFwAAhg8AIBgAAIcPACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGqBgEAwAwAIawGAACDD8sGIq0GAQDADAAhrgZAANcMACGvBkAAwQwAIbAGAQC_DAAhsQYBAMAMACHLBgEAvwwAIQVlAADCGwAgZgAAyxsAINkHAADDGwAg2gcAAMobACDfBwAAgAcAIAVlAADAGwAgZgAAyBsAINkHAADBGwAg2gcAAMcbACDfBwAA9gIAIAdlAAC-GwAgZgAAxRsAINkHAAC_GwAg2gcAAMQbACDdBwAAUQAg3gcAAFEAIN8HAAD2AgAgDhYAAIkPACAXAACKDwAgGAAAiw8AIPQFAQAAAAH8BUAAAAAB_QVAAAAAAaoGAQAAAAGsBgAAAMsGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABywYBAAAAAQNlAADCGwAg2QcAAMMbACDfBwAAgAcAIANlAADAGwAg2QcAAMEbACDfBwAA9gIAIANlAAC-GwAg2QcAAL8bACDfBwAA9gIAIA0HAACwDQAgCQAAsQ0AIBIAALAOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ8GAQAAAAGhBgEAAAABogYBAAAAAaMGAQAAAAGkBkAAAAABAgAAAEYAIGUAAJQPACADAAAARgAgZQAAlA8AIGYAAJMPACABXgAAvRsAMAIAAABGACBeAACTDwAgAgAAAKgNACBeAACSDwAgCvQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGfBgEAvwwAIaEGAQDADAAhogYBAMAMACGjBgEAwAwAIaQGQADBDAAhDQcAAKwNACAJAACtDQAgEgAArw4AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGfBgEAvwwAIaEGAQDADAAhogYBAMAMACGjBgEAwAwAIaQGQADBDAAhDQcAALANACAJAACxDQAgEgAAsA4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnwYBAAAAAaEGAQAAAAGiBgEAAAABowYBAAAAAaQGQAAAAAEVBwAAkg4AIAkAAI8OACAKAACQDgAgCwAAiQ4AIA4AAI4OACAPAACMDgAgEAAAnw8AIBsAAJEOACAsAACKDgAgLQAAiw4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABAgAAACgAIGUAAJ4PACADAAAAKAAgZQAAng8AIGYAAJwPACABXgAAvBsAMAIAAAAoACBeAACcDwAgAgAAANMNACBeAACbDwAgC_QFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhngYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACEVBwAA3w0AIAkAANwNACAKAADdDQAgCwAA1g0AIA4AANsNACAPAADZDQAgEAAAnQ8AIBsAAN4NACAsAADXDQAgLQAA2A0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhngYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACEFZQAAtxsAIGYAALobACDZBwAAuBsAINoHAAC5GwAg3wcAABAAIBUHAACSDgAgCQAAjw4AIAoAAJAOACALAACJDgAgDgAAjg4AIA8AAIwOACAQAACfDwAgGwAAkQ4AICwAAIoOACAtAACLDgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAHVBgEAAAAB5QYBAAAAAasHQAAAAAEDZQAAtxsAINkHAAC4GwAg3wcAABAAIANlAAC1GwAg2QcAALYbACDfBwAA-QQAIANlAACzGwAg2QcAALQbACDfBwAAGgAgA2UAALEbACDZBwAAshsAIN8HAAD2AgAgBGUAAJUPADDZBwAAlg8AMNsHAACYDwAg3wcAAM8NADAEZQAAjA8AMNkHAACNDwAw2wcAAI8PACDfBwAApA0AMARlAAD5DgAw2QcAAPoOADDbBwAA_A4AIN8HAAD9DgAwBGUAAOMOADDZBwAA5A4AMNsHAADmDgAg3wcAAOcOADAEZQAA2A4AMNkHAADZDgAw2wcAANsOACDfBwAAzwwAMAAAAAdlAACsGwAgZgAArxsAINkHAACtGwAg2gcAAK4bACDdBwAAUwAg3gcAAFMAIN8HAACdAQAgA2UAAKwbACDZBwAArRsAIN8HAACdAQAgAAAAAtwHAQAAAATmBwEAAAAFBWUAAKcbACBmAACqGwAg2QcAAKgbACDaBwAAqRsAIN8HAAD2AgAgAdwHAQAAAAQDZQAApxsAINkHAACoGwAg3wcAAPYCACAAAAALZQAAnxAAMGYAAKQQADDZBwAAoBAAMNoHAAChEAAw2wcAAKIQACDcBwAAoxAAMN0HAACjEAAw3gcAAKMQADDfBwAAoxAAMOAHAAClEAAw4QcAAKYQADALZQAA6w8AMGYAAPAPADDZBwAA7A8AMNoHAADtDwAw2wcAAO4PACDcBwAA7w8AMN0HAADvDwAw3gcAAO8PADDfBwAA7w8AMOAHAADxDwAw4QcAAPIPADALZQAA4g8AMGYAAOYPADDZBwAA4w8AMNoHAADkDwAw2wcAAOUPACDcBwAAzw0AMN0HAADPDQAw3gcAAM8NADDfBwAAzw0AMOAHAADnDwAw4QcAANINADALZQAAxw8AMGYAAMwPADDZBwAAyA8AMNoHAADJDwAw2wcAAMoPACDcBwAAyw8AMN0HAADLDwAw3gcAAMsPADDfBwAAyw8AMOAHAADNDwAw4QcAAM4PADALZQAAvA8AMGYAAMAPADDZBwAAvQ8AMNoHAAC-DwAw2wcAAL8PACDcBwAA5w4AMN0HAADnDgAw3gcAAOcOADDfBwAA5w4AMOAHAADBDwAw4QcAAOoOADAaBwAA9Q4AIAkAAPYOACAZAADGDwAgHQAA-A4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAawGAAAA8wYCxAYQAAAAAcUGAQAAAAHGBgIAAAAB7wYBAAAAAfEGAAAA8QYC8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAfcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGgAAAAAH7BkAAAAAB_AZAAAAAAQIAAABXACBlAADFDwAgAwAAAFcAIGUAAMUPACBmAADDDwAgAV4AAKYbADACAAAAVwAgXgAAww8AIAIAAADrDgAgXgAAwg8AIBb0BQEAvwwAIfkFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAhoAYBAL8MACGsBgAA7g7zBiLEBhAAxw4AIcUGAQC_DAAhxgYCAMgOACHvBgEAvwwAIfEGAADtDvEGIvMGAQC_DAAh9AYBAL8MACH1BgEAwAwAIfYGAQDADAAh9wYBAMAMACH4BgEAwAwAIfkGAQDADAAh-gaAAAAAAfsGQADBDAAh_AZAANcMACEaBwAA8A4AIAkAAPEOACAZAADEDwAgHQAA8w4AIPQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACGgBgEAvwwAIawGAADuDvMGIsQGEADHDgAhxQYBAL8MACHGBgIAyA4AIe8GAQC_DAAh8QYAAO0O8QYi8wYBAL8MACH0BgEAvwwAIfUGAQDADAAh9gYBAMAMACH3BgEAwAwAIfgGAQDADAAh-QYBAMAMACH6BoAAAAAB-wZAAMEMACH8BkAA1wwAIQVlAAChGwAgZgAApBsAINkHAACiGwAg2gcAAKMbACDfBwAAnQEAIBoHAAD1DgAgCQAA9g4AIBkAAMYPACAdAAD4DgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABrAYAAADzBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHvBgEAAAAB8QYAAADxBgLzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gaAAAAAAfsGQAAAAAH8BkAAAAABA2UAAKEbACDZBwAAohsAIN8HAACdAQAgDAcAAN8PACAJAADgDwAgHAAA4Q8AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABxQYBAAAAAe0GIAAAAAH9BhAAAAAB_gYQAAAAAQIAAAB2ACBlAADeDwAgAwAAAHYAIGUAAN4PACBmAADRDwAgAV4AAKAbADASBwAA-goAIAkAAIwMACAbAACNDAAgHAAA6AoAIPEFAACLDAAw8gUAAHQAEPMFAACLDAAw9AUBAAAAAfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAhxQYBALcKACHVBgEAtwoAIe0GIAC6CgAh_QYQAO4LACH-BhAA7gsAIdMHAACKDAAgAgAAAHYAIF4AANEPACACAAAAzw8AIF4AANAPACAN8QUAAM4PADDyBQAAzw8AEPMFAADODwAw9AUBALcKACH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIcUGAQC3CgAh1QYBALcKACHtBiAAugoAIf0GEADuCwAh_gYQAO4LACEN8QUAAM4PADDyBQAAzw8AEPMFAADODwAw9AUBALcKACH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIcUGAQC3CgAh1QYBALcKACHtBiAAugoAIf0GEADuCwAh_gYQAO4LACEJ9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIcUGAQC_DAAh7QYgAKEOACH9BhAAxw4AIf4GEADHDgAhDAcAANIPACAJAADTDwAgHAAA1A8AIPQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACHFBgEAvwwAIe0GIAChDgAh_QYQAMcOACH-BhAAxw4AIQVlAACXGwAgZgAAnhsAINkHAACYGwAg2gcAAJ0bACDfBwAA-QQAIAVlAACVGwAgZgAAmxsAINkHAACWGwAg2gcAAJobACDfBwAAGgAgC2UAANUPADBmAADZDwAw2QcAANYPADDaBwAA1w8AMNsHAADYDwAg3AcAAOcOADDdBwAA5w4AMN4HAADnDgAw3wcAAOcOADDgBwAA2g8AMOEHAADqDgAwGgcAAPUOACAJAAD2DgAgGQAAxg8AIBsAAPcOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAaAGAQAAAAGsBgAAAPMGAsQGEAAAAAHFBgEAAAABxgYCAAAAAdUGAQAAAAHxBgAAAPEGAvMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAH3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BoAAAAAB-wZAAAAAAfwGQAAAAAECAAAAVwAgZQAA3Q8AIAMAAABXACBlAADdDwAgZgAA3A8AIAFeAACZGwAwAgAAAFcAIF4AANwPACACAAAA6w4AIF4AANsPACAW9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaAGAQC_DAAhrAYAAO4O8wYixAYQAMcOACHFBgEAvwwAIcYGAgDIDgAh1QYBAL8MACHxBgAA7Q7xBiLzBgEAvwwAIfQGAQC_DAAh9QYBAMAMACH2BgEAwAwAIfcGAQDADAAh-AYBAMAMACH5BgEAwAwAIfoGgAAAAAH7BkAAwQwAIfwGQADXDAAhGgcAAPAOACAJAADxDgAgGQAAxA8AIBsAAPIOACD0BQEAvwwAIfkFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAhoAYBAL8MACGsBgAA7g7zBiLEBhAAxw4AIcUGAQC_DAAhxgYCAMgOACHVBgEAvwwAIfEGAADtDvEGIvMGAQC_DAAh9AYBAL8MACH1BgEAwAwAIfYGAQDADAAh9wYBAMAMACH4BgEAwAwAIfkGAQDADAAh-gaAAAAAAfsGQADBDAAh_AZAANcMACEaBwAA9Q4AIAkAAPYOACAZAADGDwAgGwAA9w4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAawGAAAA8wYCxAYQAAAAAcUGAQAAAAHGBgIAAAAB1QYBAAAAAfEGAAAA8QYC8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAfcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGgAAAAAH7BkAAAAAB_AZAAAAAAQwHAADfDwAgCQAA4A8AIBwAAOEPACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAcUGAQAAAAHtBiAAAAAB_QYQAAAAAf4GEAAAAAEDZQAAlxsAINkHAACYGwAg3wcAAPkEACADZQAAlRsAINkHAACWGwAg3wcAABoAIARlAADVDwAw2QcAANYPADDbBwAA2A8AIN8HAADnDgAwFQcAAJIOACAJAACPDgAgCgAAkA4AIAsAAIkOACAOAACODgAgDwAAjA4AIBAAAJ8PACAZAACNDgAgLAAAig4AIC0AAIsOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGdBgEAAAABngYBAAAAAaAGAQAAAAHlBgEAAAABqwdAAAAAAQIAAAAoACBlAADqDwAgAwAAACgAIGUAAOoPACBmAADpDwAgAV4AAJQbADACAAAAKAAgXgAA6Q8AIAIAAADTDQAgXgAA6A8AIAv0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhoAYBAL8MACHlBgEAwAwAIasHQADBDAAhFQcAAN8NACAJAADcDQAgCgAA3Q0AIAsAANYNACAOAADbDQAgDwAA2Q0AIBAAAJ0PACAZAADaDQAgLAAA1w0AIC0AANgNACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhoAYBAL8MACHlBgEAwAwAIasHQADBDAAhFQcAAJIOACAJAACPDgAgCgAAkA4AIAsAAIkOACAOAACODgAgDwAAjA4AIBAAAJ8PACAZAACNDgAgLAAAig4AIC0AAIsOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGdBgEAAAABngYBAAAAAaAGAQAAAAHlBgEAAAABqwdAAAAAAQ8HAACcEAAgCQAAnRAAIA0AAJkQACARAACaEAAgJAAAmxAAICYAAJ4QACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAAB1AYCAAAAAdYGAQAAAAECAAAANwAgZQAAmBAAIAMAAAA3ACBlAACYEAAgZgAA9g8AIAFeAACTGwAwFAcAAPoKACAJAAD_CwAgDQAA5goAIBEAALQLACAbAACNDAAgJAAAtgsAICYAAKUMACDxBQAApAwAMPIFAAA1ABDzBQAApAwAMPQFAQAAAAH5BQEAtwoAIfoFAQC4CgAh_AVAALsKACH9BUAAuwoAIc0GAQC3CgAh0wYBALgKACHUBgIA9AsAIdUGAQC3CgAh1gYBALgKACECAAAANwAgXgAA9g8AIAIAAADzDwAgXgAA9A8AIA3xBQAA8g8AMPIFAADzDwAQ8wUAAPIPADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhzQYBALcKACHTBgEAuAoAIdQGAgD0CwAh1QYBALcKACHWBgEAuAoAIQ3xBQAA8g8AMPIFAADzDwAQ8wUAAPIPADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhzQYBALcKACHTBgEAuAoAIdQGAgD0CwAh1QYBALcKACHWBgEAuAoAIQn0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIdQGAgD1DwAh1gYBAMAMACEF3AcCAAAAAeIHAgAAAAHjBwIAAAAB5AcCAAAAAeUHAgAAAAEPBwAA-g8AIAkAAPsPACANAAD3DwAgEQAA-A8AICQAAPkPACAmAAD8DwAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACHUBgIA9Q8AIdYGAQDADAAhC2UAAI8QADBmAACTEAAw2QcAAJAQADDaBwAAkRAAMNsHAACSEAAg3AcAAM8NADDdBwAAzw0AMN4HAADPDQAw3wcAAM8NADDgBwAAlBAAMOEHAADSDQAwC2UAAIYQADBmAACKEAAw2QcAAIcQADDaBwAAiBAAMNsHAACJEAAg3AcAALsNADDdBwAAuw0AMN4HAAC7DQAw3wcAALsNADDgBwAAixAAMOEHAAC-DQAwC2UAAP0PADBmAACBEAAw2QcAAP4PADDaBwAA_w8AMNsHAACAEAAg3AcAAJQNADDdBwAAlA0AMN4HAACUDQAw3wcAAJQNADDgBwAAghAAMOEHAACXDQAwBWUAAIUbACBmAACRGwAg2QcAAIYbACDaBwAAkBsAIN8HAAD5BAAgB2UAAIMbACBmAACOGwAg2QcAAIQbACDaBwAAjRsAIN0HAAAYACDeBwAAGAAg3wcAABoAIAdlAACBGwAgZgAAixsAINkHAACCGwAg2gcAAIobACDdBwAAawAg3gcAAGsAIN8HAACXAQAgDgcAALQNACAJAAC1DQAgEAAAtQ4AICMAALYNACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGlBgEAAAABpgYBAAAAAagGAAAAqAYCqQZAAAAAAQIAAABBACBlAACFEAAgAwAAAEEAIGUAAIUQACBmAACEEAAgAV4AAIkbADACAAAAQQAgXgAAhBAAIAIAAACYDQAgXgAAgxAAIAr0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhngYBAL8MACGlBgEAvwwAIaYGAQDADAAhqAYAAJoNqAYiqQZAANcMACEOBwAAnQ0AIAkAAJ4NACAQAAC0DgAgIwAAnw0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGeBgEAvwwAIaUGAQC_DAAhpgYBAMAMACGoBgAAmg2oBiKpBkAA1wwAIQ4HAAC0DQAgCQAAtQ0AIBAAALUOACAjAAC2DQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGeBgEAAAABpQYBAAAAAaYGAQAAAAGoBgAAAKgGAqkGQAAAAAELBwAAyQ0AIAkAAMoNACAPAADIDQAgEAAAqw4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnQYBAAAAAZ4GAQAAAAECAAAAPAAgZQAAjhAAIAMAAAA8ACBlAACOEAAgZgAAjRAAIAFeAACIGwAwAgAAADwAIF4AAI0QACACAAAAvw0AIF4AAIwQACAH9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZ0GAQC_DAAhngYBAL8MACELBwAAxA0AIAkAAMUNACAPAADDDQAgEAAAqg4AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGdBgEAvwwAIZ4GAQC_DAAhCwcAAMkNACAJAADKDQAgDwAAyA0AIBAAAKsOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ0GAQAAAAGeBgEAAAABFQcAAJIOACAJAACPDgAgCgAAkA4AIAsAAIkOACAPAACMDgAgEAAAnw8AIBkAAI0OACAbAACRDgAgLAAAig4AIC0AAIsOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ0GAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQIAAAAoACBlAACXEAAgAwAAACgAIGUAAJcQACBmAACWEAAgAV4AAIcbADACAAAAKAAgXgAAlhAAIAIAAADTDQAgXgAAlRAAIAv0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhFQcAAN8NACAJAADcDQAgCgAA3Q0AIAsAANYNACAPAADZDQAgEAAAnQ8AIBkAANoNACAbAADeDQAgLAAA1w0AIC0AANgNACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhFQcAAJIOACAJAACPDgAgCgAAkA4AIAsAAIkOACAPAACMDgAgEAAAnw8AIBkAAI0OACAbAACRDgAgLAAAig4AIC0AAIsOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ0GAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQ8HAACcEAAgCQAAnRAAIA0AAJkQACARAACaEAAgJAAAmxAAICYAAJ4QACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAAB1AYCAAAAAdYGAQAAAAEEZQAAjxAAMNkHAACQEAAw2wcAAJIQACDfBwAAzw0AMARlAACGEAAw2QcAAIcQADDbBwAAiRAAIN8HAAC7DQAwBGUAAP0PADDZBwAA_g8AMNsHAACAEAAg3wcAAJQNADADZQAAhRsAINkHAACGGwAg3wcAAPkEACADZQAAgxsAINkHAACEGwAg3wcAABoAIANlAACBGwAg2QcAAIIbACDfBwAAlwEAIA0HAAC7EAAgCQAAvBAAIAsAALoQACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAA2gYCzQYBAAAAAdMGAQAAAAHXBgEAAAAB2AYBAAAAAQIAAAAzACBlAAC5EAAgAwAAADMAIGUAALkQACBmAACqEAAgAV4AAIAbADASBwAA-AsAIAkAAP8LACALAAC7CwAgGwAAqAwAIPEFAACmDAAw8gUAADEAEPMFAACmDAAw9AUBAAAAAfkFAQC4CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhrAYAAKcM2gYizQYBALcKACHTBgEAuAoAIdUGAQC4CgAh1wYBALcKACHYBgEAtwoAIQIAAAAzACBeAACqEAAgAgAAAKcQACBeAACoEAAgDvEFAACmEAAw8gUAAKcQABDzBQAAphAAMPQFAQC3CgAh-QUBALgKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGsBgAApwzaBiLNBgEAtwoAIdMGAQC4CgAh1QYBALgKACHXBgEAtwoAIdgGAQC3CgAhDvEFAACmEAAw8gUAAKcQABDzBQAAphAAMPQFAQC3CgAh-QUBALgKACH6BQEAuAoAIfwFQAC7CgAh_QVAALsKACGsBgAApwzaBiLNBgEAtwoAIdMGAQC4CgAh1QYBALgKACHXBgEAtwoAIdgGAQC3CgAhCvQFAQC_DAAh-QUBAMAMACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGsBgAAqRDaBiLNBgEAvwwAIdMGAQDADAAh1wYBAL8MACHYBgEAvwwAIQHcBwAAANoGAg0HAACsEAAgCQAArRAAIAsAAKsQACD0BQEAvwwAIfkFAQDADAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhrAYAAKkQ2gYizQYBAL8MACHTBgEAwAwAIdcGAQC_DAAh2AYBAL8MACELZQAArhAAMGYAALIQADDZBwAArxAAMNoHAACwEAAw2wcAALEQACDcBwAA-A0AMN0HAAD4DQAw3gcAAPgNADDfBwAA-A0AMOAHAACzEAAw4QcAAPsNADAHZQAA8hoAIGYAAP4aACDZBwAA8xoAINoHAAD9GgAg3QcAABYAIN4HAAAWACDfBwAA-QQAIAdlAADwGgAgZgAA-xoAINkHAADxGgAg2gcAAPoaACDdBwAAGAAg3gcAABgAIN8HAAAaACAOBwAAhg4AIAkAAIcOACApAAC4EAAgKwAAhQ4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABsgYBAAAAAc0GAQAAAAHTBgEAAAAB2gYBAAAAAdwGAQAAAAECAAAALAAgZQAAtxAAIAMAAAAsACBlAAC3EAAgZgAAtRAAIAFeAAD5GgAwAgAAACwAIF4AALUQACACAAAA_A0AIF4AALQQACAK9AUBAL8MACH5BQEAwAwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIbIGAQC_DAAhzQYBAL8MACHTBgEAwAwAIdoGAQDADAAh3AYBAL8MACEOBwAAgQ4AIAkAAIIOACApAAC2EAAgKwAAgA4AIPQFAQC_DAAh-QUBAMAMACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGyBgEAvwwAIc0GAQC_DAAh0wYBAMAMACHaBgEAwAwAIdwGAQC_DAAhBWUAAPQaACBmAAD3GgAg2QcAAPUaACDaBwAA9hoAIN8HAAAoACAOBwAAhg4AIAkAAIcOACApAAC4EAAgKwAAhQ4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABsgYBAAAAAc0GAQAAAAHTBgEAAAAB2gYBAAAAAdwGAQAAAAEDZQAA9BoAINkHAAD1GgAg3wcAACgAIA0HAAC7EAAgCQAAvBAAIAsAALoQACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAA2gYCzQYBAAAAAdMGAQAAAAHXBgEAAAAB2AYBAAAAAQRlAACuEAAw2QcAAK8QADDbBwAAsRAAIN8HAAD4DQAwA2UAAPIaACDZBwAA8xoAIN8HAAD5BAAgA2UAAPAaACDZBwAA8RoAIN8HAAAaACAEZQAAnxAAMNkHAACgEAAw2wcAAKIQACDfBwAAoxAAMARlAADrDwAw2QcAAOwPADDbBwAA7g8AIN8HAADvDwAwBGUAAOIPADDZBwAA4w8AMNsHAADlDwAg3wcAAM8NADAEZQAAxw8AMNkHAADIDwAw2wcAAMoPACDfBwAAyw8AMARlAAC8DwAw2QcAAL0PADDbBwAAvw8AIN8HAADnDgAwAAAAAAAAAAAAAAVlAADrGgAgZgAA7hoAINkHAADsGgAg2gcAAO0aACDfBwAA_wcAIANlAADrGgAg2QcAAOwaACDfBwAA_wcAIAAAAAdlAADmGgAgZgAA6RoAINkHAADnGgAg2gcAAOgaACDdBwAALwAg3gcAAC8AIN8HAAD_BwAgA2UAAOYaACDZBwAA5xoAIN8HAAD_BwAgAAAAAAAAAAALZQAA6BAAMGYAAO0QADDZBwAA6RAAMNoHAADqEAAw2wcAAOsQACDcBwAA7BAAMN0HAADsEAAw3gcAAOwQADDfBwAA7BAAMOAHAADuEAAw4QcAAO8QADALZQAA3xAAMGYAAOMQADDZBwAA4BAAMNoHAADhEAAw2wcAAOIQACDcBwAAzw0AMN0HAADPDQAw3gcAAM8NADDfBwAAzw0AMOAHAADkEAAw4QcAANINADAFZQAA0BoAIGYAAOQaACDZBwAA0RoAINoHAADjGgAg3wcAAPkEACAFZQAAzhoAIGYAAOEaACDZBwAAzxoAINoHAADgGgAg3wcAABoAIBUHAACSDgAgCQAAjw4AIAsAAIkOACAOAACODgAgDwAAjA4AIBAAAJ8PACAZAACNDgAgGwAAkQ4AICwAAIoOACAtAACLDgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAasHQAAAAAECAAAAKAAgZQAA5xAAIAMAAAAoACBlAADnEAAgZgAA5hAAIAFeAADfGgAwAgAAACgAIF4AAOYQACACAAAA0w0AIF4AAOUQACAL9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACGrB0AAwQwAIRUHAADfDQAgCQAA3A0AIAsAANYNACAOAADbDQAgDwAA2Q0AIBAAAJ0PACAZAADaDQAgGwAA3g0AICwAANcNACAtAADYDQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACGrB0AAwQwAIRUHAACSDgAgCQAAjw4AIAsAAIkOACAOAACODgAgDwAAjA4AIBAAAJ8PACAZAACNDgAgGwAAkQ4AICwAAIoOACAtAACLDgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAasHQAAAAAENBwAAihEAIAkAAIsRACANAACMEQAgEQAAjREAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAd8GAgAAAAGsBwEAAAABrQcBAAAAAQIAAAAjACBlAACJEQAgAwAAACMAIGUAAIkRACBmAADyEAAgAV4AAN4aADASBwAA-goAIAkAAIwMACAKAACvDAAgDQAA5goAIBEAALQLACDxBQAAsAwAMPIFAAAhABDzBQAAsAwAMPQFAQAAAAH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIdMGAQC4CgAh3wYCAPQLACHlBgEAuAoAIawHAQAAAAGtBwEAtwoAIQIAAAAjACBeAADyEAAgAgAAAPAQACBeAADxEAAgDfEFAADvEAAw8gUAAPAQABDzBQAA7xAAMPQFAQC3CgAh-QUBALcKACH6BQEAtwoAIfwFQAC7CgAh_QVAALsKACHTBgEAuAoAId8GAgD0CwAh5QYBALgKACGsBwEAtwoAIa0HAQC3CgAhDfEFAADvEAAw8gUAAPAQABDzBQAA7xAAMPQFAQC3CgAh-QUBALcKACH6BQEAtwoAIfwFQAC7CgAh_QVAALsKACHTBgEAuAoAId8GAgD0CwAh5QYBALgKACGsBwEAtwoAIa0HAQC3CgAhCfQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAId8GAgD1DwAhrAcBAL8MACGtBwEAvwwAIQ0HAADzEAAgCQAA9BAAIA0AAPUQACARAAD2EAAg9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh3wYCAPUPACGsBwEAvwwAIa0HAQC_DAAhBWUAANQaACBmAADcGgAg2QcAANUaACDaBwAA2xoAIN8HAAD5BAAgBWUAANIaACBmAADZGgAg2QcAANMaACDaBwAA2BoAIN8HAAAaACALZQAAgBEAMGYAAIQRADDZBwAAgREAMNoHAACCEQAw2wcAAIMRACDcBwAAzw0AMN0HAADPDQAw3gcAAM8NADDfBwAAzw0AMOAHAACFEQAw4QcAANINADALZQAA9xAAMGYAAPsQADDZBwAA-BAAMNoHAAD5EAAw2wcAAPoQACDcBwAAuw0AMN0HAAC7DQAw3gcAALsNADDfBwAAuw0AMOAHAAD8EAAw4QcAAL4NADALBwAAyQ0AIAkAAMoNACAOAADHDQAgEAAAqw4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ4GAQAAAAECAAAAPAAgZQAA_xAAIAMAAAA8ACBlAAD_EAAgZgAA_hAAIAFeAADXGgAwAgAAADwAIF4AAP4QACACAAAAvw0AIF4AAP0QACAH9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhngYBAL8MACELBwAAxA0AIAkAAMUNACAOAADCDQAgEAAAqg4AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ4GAQC_DAAhCwcAAMkNACAJAADKDQAgDgAAxw0AIBAAAKsOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGeBgEAAAABFQcAAJIOACAJAACPDgAgCgAAkA4AIAsAAIkOACAOAACODgAgEAAAnw8AIBkAAI0OACAbAACRDgAgLAAAig4AIC0AAIsOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQIAAAAoACBlAACIEQAgAwAAACgAIGUAAIgRACBmAACHEQAgAV4AANYaADACAAAAKAAgXgAAhxEAIAIAAADTDQAgXgAAhhEAIAv0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhFQcAAN8NACAJAADcDQAgCgAA3Q0AIAsAANYNACAOAADbDQAgEAAAnQ8AIBkAANoNACAbAADeDQAgLAAA1w0AIC0AANgNACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhFQcAAJIOACAJAACPDgAgCgAAkA4AIAsAAIkOACAOAACODgAgEAAAnw8AIBkAAI0OACAbAACRDgAgLAAAig4AIC0AAIsOACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQ0HAACKEQAgCQAAixEAIA0AAIwRACARAACNEQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB3wYCAAAAAawHAQAAAAGtBwEAAAABA2UAANQaACDZBwAA1RoAIN8HAAD5BAAgA2UAANIaACDZBwAA0xoAIN8HAAAaACAEZQAAgBEAMNkHAACBEQAw2wcAAIMRACDfBwAAzw0AMARlAAD3EAAw2QcAAPgQADDbBwAA-hAAIN8HAAC7DQAwBGUAAOgQADDZBwAA6RAAMNsHAADrEAAg3wcAAOwQADAEZQAA3xAAMNkHAADgEAAw2wcAAOIQACDfBwAAzw0AMANlAADQGgAg2QcAANEaACDfBwAA-QQAIANlAADOGgAg2QcAAM8aACDfBwAAGgAgAAAAAtwHAQAAAATmBwEAAAAFC2UAAJcRADBmAACbEQAw2QcAAJgRADDaBwAAmREAMNsHAACaEQAg3AcAAP0OADDdBwAA_Q4AMN4HAAD9DgAw3wcAAP0OADDgBwAAnBEAMOEHAACADwAwDhcAAIoPACAYAACLDwAgGQAArA8AIPQFAQAAAAH8BUAAAAAB_QVAAAAAAaAGAQAAAAGqBgEAAAABrAYAAADLBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGxBgEAAAABywYBAAAAAQIAAABNACBlAACfEQAgAwAAAE0AIGUAAJ8RACBmAACeEQAgAV4AAM0aADACAAAATQAgXgAAnhEAIAIAAACBDwAgXgAAnREAIAv0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGgBgEAwAwAIaoGAQDADAAhrAYAAIMPywYirQYBAMAMACGuBkAA1wwAIa8GQADBDAAhsQYBAMAMACHLBgEAvwwAIQ4XAACGDwAgGAAAhw8AIBkAAKsPACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGgBgEAwAwAIaoGAQDADAAhrAYAAIMPywYirQYBAMAMACGuBkAA1wwAIa8GQADBDAAhsQYBAMAMACHLBgEAvwwAIQ4XAACKDwAgGAAAiw8AIBkAAKwPACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABqgYBAAAAAawGAAAAywYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsQYBAAAAAcsGAQAAAAEB3AcBAAAABARlAACXEQAw2QcAAJgRADDbBwAAmhEAIN8HAAD9DgAwAAAAAALcBwEAAAAE5gcBAAAABQtlAACoEQAwZgAArBEAMNkHAACpEQAw2gcAAKoRADDbBwAAqxEAINwHAAD9DAAw3QcAAP0MADDeBwAA_QwAMN8HAAD9DAAw4AcAAK0RADDhBwAAgA0AMBIHAACODQAgCQAAjw0AIBAAALoOACAYAACNDQAgMwAAjA0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABiQYBAAAAAZ4GAQAAAAGqBgEAAAABrAYAAACsBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGxBgEAAAABAgAAAKMBACBlAACwEQAgAwAAAKMBACBlAACwEQAgZgAArxEAIAFeAADMGgAwAgAAAKMBACBeAACvEQAgAgAAAIENACBeAACuEQAgDfQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIZ4GAQDADAAhqgYBAMAMACGsBgAAgw2sBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGxBgEAwAwAIRIHAACIDQAgCQAAiQ0AIBAAALkOACAYAACHDQAgMwAAhg0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIZ4GAQDADAAhqgYBAMAMACGsBgAAgw2sBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGxBgEAwAwAIRIHAACODQAgCQAAjw0AIBAAALoOACAYAACNDQAgMwAAjA0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABiQYBAAAAAZ4GAQAAAAGqBgEAAAABrAYAAACsBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGxBgEAAAABAdwHAQAAAAQEZQAAqBEAMNkHAACpEQAw2wcAAKsRACDfBwAA_QwAMAAAAAAFZQAAxxoAIGYAAMoaACDZBwAAyBoAINoHAADJGgAg3wcAAPkEACADZQAAxxoAINkHAADIGgAg3wcAAPkEACAeBgAAyxYAIAwAAMIQACANAADEEAAgEQAAzhYAIBwAAMYQACAlAADDEAAgJwAAxRAAICoAANUWACAuAADHFgAgLwAAyBYAIDAAAMoWACAxAADMFgAgMgAAzRYAIDQAALMRACA1AADQFgAgNgAA0RYAIDcAANIWACA6AADGFgAgOwAAyRYAID8AANQWACBAAADPFgAgQQAA0xYAIEYAANYWACBHAADXFgAgSAAA2BYAIEkAANgWACCoBgAAuwwAINMGAAC7DAAglgcAALsMACCZBwAAuwwAIAAAAAAAAAAAAAAFZQAAwhoAIGYAAMUaACDZBwAAwxoAINoHAADEGgAg3wcAAP8HACADZQAAwhoAINkHAADDGgAg3wcAAP8HACAAAAAFZQAAuhoAIGYAAMAaACDZBwAAuxoAINoHAAC_GgAg3wcAAOwBACAFZQAAuBoAIGYAAL0aACDZBwAAuRoAINoHAAC8GgAg3wcAAPYCACADZQAAuhoAINkHAAC7GgAg3wcAAOwBACADZQAAuBoAINkHAAC5GgAg3wcAAPYCACAAAAAB3AcAAACCBwIFZQAAsxoAIGYAALYaACDZBwAAtBoAINoHAAC1GgAg3wcAAOwBACADZQAAsxoAINkHAAC0GgAg3wcAAOwBACAAAAAFZQAAqRoAIGYAALEaACDZBwAAqhoAINoHAACwGgAg3wcAAPkEACAFZQAApxoAIGYAAK4aACDZBwAAqBoAINoHAACtGgAg3wcAAPYCACALZQAA5hEAMGYAAOsRADDZBwAA5xEAMNoHAADoEQAw2wcAAOkRACDcBwAA6hEAMN0HAADqEQAw3gcAAOoRADDfBwAA6hEAMOAHAADsEQAw4QcAAO0RADALZQAA2hEAMGYAAN8RADDZBwAA2xEAMNoHAADcEQAw2wcAAN0RACDcBwAA3hEAMN0HAADeEQAw3gcAAN4RADDfBwAA3hEAMOAHAADgEQAw4QcAAOERADAEAwAAzBEAIPQFAQAAAAH7BQEAAAABgAdAAAAAAQIAAAD0AQAgZQAA5REAIAMAAAD0AQAgZQAA5REAIGYAAOQRACABXgAArBoAMAoDAAC8CgAgQwAA5QsAIPEFAADkCwAw8gUAAPIBABDzBQAA5AsAMPQFAQAAAAH7BQEAtwoAIf8GAQC3CgAhgAdAALsKACHPBwAA4wsAIAIAAAD0AQAgXgAA5BEAIAIAAADiEQAgXgAA4xEAIAfxBQAA4REAMPIFAADiEQAQ8wUAAOERADD0BQEAtwoAIfsFAQC3CgAh_wYBALcKACGAB0AAuwoAIQfxBQAA4REAMPIFAADiEQAQ8wUAAOERADD0BQEAtwoAIfsFAQC3CgAh_wYBALcKACGAB0AAuwoAIQP0BQEAvwwAIfsFAQC_DAAhgAdAAMEMACEEAwAAyhEAIPQFAQC_DAAh-wUBAL8MACGAB0AAwQwAIQQDAADMEQAg9AUBAAAAAfsFAQAAAAGAB0AAAAABA_QFAQAAAAH8BUAAAAABggcAAACCBwICAAAA8AEAIGUAAPERACADAAAA8AEAIGUAAPERACBmAADwEQAgAV4AAKsaADAJQwAA5QsAIPEFAADnCwAw8gUAAO4BABDzBQAA5wsAMPQFAQAAAAH8BUAAuwoAIf8GAQC3CgAhggcAAOgLggci0AcAAOYLACACAAAA8AEAIF4AAPARACACAAAA7hEAIF4AAO8RACAH8QUAAO0RADDyBQAA7hEAEPMFAADtEQAw9AUBALcKACH8BUAAuwoAIf8GAQC3CgAhggcAAOgLggciB_EFAADtEQAw8gUAAO4RABDzBQAA7REAMPQFAQC3CgAh_AVAALsKACH_BgEAtwoAIYIHAADoC4IHIgP0BQEAvwwAIfwFQADBDAAhggcAANARggciA_QFAQC_DAAh_AVAAMEMACGCBwAA0BGCByID9AUBAAAAAfwFQAAAAAGCBwAAAIIHAgNlAACpGgAg2QcAAKoaACDfBwAA-QQAIANlAACnGgAg2QcAAKgaACDfBwAA9gIAIARlAADmEQAw2QcAAOcRADDbBwAA6REAIN8HAADqEQAwBGUAANoRADDZBwAA2xEAMNsHAADdEQAg3wcAAN4RADAAAAAAAAAB3AcAAACQBwIB3AcAAACSBwIFZQAAnBoAIGYAAKUaACDZBwAAnRoAINoHAACkGgAg3wcAAPYCACAFZQAAmhoAIGYAAKIaACDZBwAAmxoAINoHAAChGgAg3wcAAPkEACAHZQAAmBoAIGYAAJ8aACDZBwAAmRoAINoHAACeGgAg3QcAAFEAIN4HAABRACDfBwAA9gIAIANlAACcGgAg2QcAAJ0aACDfBwAA9gIAIANlAACaGgAg2QcAAJsaACDfBwAA-QQAIANlAACYGgAg2QcAAJkaACDfBwAA9gIAIAAAAAAAAdwHAAAAmAcDAdwHAAAAwgYDBdwHEAAAAAHiBxAAAAAB4wcQAAAAAeQHEAAAAAHlBxAAAAABAdwHAAAAnwcCAdwHAAAAqQcCBWUAAIwaACBmAACWGgAg2QcAAI0aACDaBwAAlRoAIN8HAAD2AgAgB2UAAIoaACBmAACTGgAg2QcAAIsaACDaBwAAkhoAIN0HAABRACDeBwAAUQAg3wcAAPYCACAHZQAAiBoAIGYAAJAaACDZBwAAiRoAINoHAACPGgAg3QcAABYAIN4HAAAWACDfBwAA-QQAIAtlAACSEgAwZgAAlxIAMNkHAACTEgAw2gcAAJQSADDbBwAAlRIAINwHAACWEgAw3QcAAJYSADDeBwAAlhIAMN8HAACWEgAw4AcAAJgSADDhBwAAmRIAMAwHAADLDgAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAxAYCwgYAAADCBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHHBkAAAAAByAZAAAAAAQIAAADbAQAgZQAAnRIAIAMAAADbAQAgZQAAnRIAIGYAAJwSACABXgAAjhoAMBEHAAD6CgAgPgAA8AsAIPEFAADrCwAw8gUAANkBABDzBQAA6wsAMPQFAQAAAAH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA7QvEBiLABgEAuAoAIcIGAADsC8IGIsQGEADuCwAhxQYBALcKACHGBgIA7wsAIccGQAC7CgAhyAZAALsKACECAAAA2wEAIF4AAJwSACACAAAAmhIAIF4AAJsSACAP8QUAAJkSADDyBQAAmhIAEPMFAACZEgAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA7QvEBiLABgEAuAoAIcIGAADsC8IGIsQGEADuCwAhxQYBALcKACHGBgIA7wsAIccGQAC7CgAhyAZAALsKACEP8QUAAJkSADDyBQAAmhIAEPMFAACZEgAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA7QvEBiLABgEAuAoAIcIGAADsC8IGIsQGEADuCwAhxQYBALcKACHGBgIA7wsAIccGQAC7CgAhyAZAALsKACEL9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGsBgAAxg7EBiLCBgAAxQ7CBiLEBhAAxw4AIcUGAQC_DAAhxgYCAMgOACHHBkAAwQwAIcgGQADBDAAhDAcAAMkOACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIawGAADGDsQGIsIGAADFDsIGIsQGEADHDgAhxQYBAL8MACHGBgIAyA4AIccGQADBDAAhyAZAAMEMACEMBwAAyw4AIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAMQGAsIGAAAAwgYCxAYQAAAAAcUGAQAAAAHGBgIAAAABxwZAAAAAAcgGQAAAAAEDZQAAjBoAINkHAACNGgAg3wcAAPYCACADZQAAihoAINkHAACLGgAg3wcAAPYCACADZQAAiBoAINkHAACJGgAg3wcAAPkEACAEZQAAkhIAMNkHAACTEgAw2wcAAJUSACDfBwAAlhIAMAAAAAtlAADVFAAwZgAA2hQAMNkHAADWFAAw2gcAANcUADDbBwAA2BQAINwHAADZFAAw3QcAANkUADDeBwAA2RQAMN8HAADZFAAw4AcAANsUADDhBwAA3BQAMAtlAADJFAAwZgAAzhQAMNkHAADKFAAw2gcAAMsUADDbBwAAzBQAINwHAADNFAAw3QcAAM0UADDeBwAAzRQAMN8HAADNFAAw4AcAAM8UADDhBwAA0BQAMAtlAACwFAAwZgAAtRQAMNkHAACxFAAw2gcAALIUADDbBwAAsxQAINwHAAC0FAAw3QcAALQUADDeBwAAtBQAMN8HAAC0FAAw4AcAALYUADDhBwAAtxQAMAtlAACYFAAwZgAAnRQAMNkHAACZFAAw2gcAAJoUADDbBwAAmxQAINwHAACcFAAw3QcAAJwUADDeBwAAnBQAMN8HAACcFAAw4AcAAJ4UADDhBwAAnxQAMAtlAACPFAAwZgAAkxQAMNkHAACQFAAw2gcAAJEUADDbBwAAkhQAINwHAADvDwAw3QcAAO8PADDeBwAA7w8AMN8HAADvDwAw4AcAAJQUADDhBwAA8g8AMAtlAACEFAAwZgAAiBQAMNkHAACFFAAw2gcAAIYUADDbBwAAhxQAINwHAADsEAAw3QcAAOwQADDeBwAA7BAAMN8HAADsEAAw4AcAAIkUADDhBwAA7xAAMAtlAAD1EwAwZgAA-hMAMNkHAAD2EwAw2gcAAPcTADDbBwAA-BMAINwHAAD5EwAw3QcAAPkTADDeBwAA-RMAMN8HAAD5EwAw4AcAAPsTADDhBwAA_BMAMAtlAADpEwAwZgAA7hMAMNkHAADqEwAw2gcAAOsTADDbBwAA7BMAINwHAADtEwAw3QcAAO0TADDeBwAA7RMAMN8HAADtEwAw4AcAAO8TADDhBwAA8BMAMAtlAADdEwAwZgAA4hMAMNkHAADeEwAw2gcAAN8TADDbBwAA4BMAINwHAADhEwAw3QcAAOETADDeBwAA4RMAMN8HAADhEwAw4AcAAOMTADDhBwAA5BMAMAtlAADUEwAwZgAA2BMAMNkHAADVEwAw2gcAANYTADDbBwAA1xMAINwHAADPDQAw3QcAAM8NADDeBwAAzw0AMN8HAADPDQAw4AcAANkTADDhBwAA0g0AMAtlAADLEwAwZgAAzxMAMNkHAADMEwAw2gcAAM0TADDbBwAAzhMAINwHAAC7DQAw3QcAALsNADDeBwAAuw0AMN8HAAC7DQAw4AcAANATADDhBwAAvg0AMAtlAAC_EwAwZgAAxBMAMNkHAADAEwAw2gcAAMETADDbBwAAwhMAINwHAADDEwAw3QcAAMMTADDeBwAAwxMAMN8HAADDEwAw4AcAAMUTADDhBwAAxhMAMAtlAAC2EwAwZgAAuhMAMNkHAAC3EwAw2gcAALgTADDbBwAAuRMAINwHAAD9DAAw3QcAAP0MADDeBwAA_QwAMN8HAAD9DAAw4AcAALsTADDhBwAAgA0AMAtlAACtEwAwZgAAsRMAMNkHAACuEwAw2gcAAK8TADDbBwAAsBMAINwHAACUDQAw3QcAAJQNADDeBwAAlA0AMN8HAACUDQAw4AcAALITADDhBwAAlw0AMAtlAACkEwAwZgAAqBMAMNkHAAClEwAw2gcAAKYTADDbBwAApxMAINwHAACkDQAw3QcAAKQNADDeBwAApA0AMN8HAACkDQAw4AcAAKkTADDhBwAApw0AMAtlAACbEwAwZgAAnxMAMNkHAACcEwAw2gcAAJ0TADDbBwAAnhMAINwHAADqDAAw3QcAAOoMADDeBwAA6gwAMN8HAADqDAAw4AcAAKATADDhBwAA7QwAMAtlAACSEwAwZgAAlhMAMNkHAACTEwAw2gcAAJQTADDbBwAAlRMAINwHAADLDwAw3QcAAMsPADDeBwAAyw8AMN8HAADLDwAw4AcAAJcTADDhBwAAzg8AMAtlAACJEwAwZgAAjRMAMNkHAACKEwAw2gcAAIsTADDbBwAAjBMAINwHAADnDgAw3QcAAOcOADDeBwAA5w4AMN8HAADnDgAw4AcAAI4TADDhBwAA6g4AMAdlAACEEwAgZgAAhxMAINkHAACFEwAg2gcAAIYTACDdBwAA5QEAIN4HAADlAQAg3wcAAM8GACALZQAA-xIAMGYAAP8SADDZBwAA_BIAMNoHAAD9EgAw2wcAAP4SACDcBwAAlhIAMN0HAACWEgAw3gcAAJYSADDfBwAAlhIAMOAHAACAEwAw4QcAAJkSADALZQAA8hIAMGYAAPYSADDZBwAA8xIAMNoHAAD0EgAw2wcAAPUSACDcBwAAoxAAMN0HAACjEAAw3gcAAKMQADDfBwAAoxAAMOAHAAD3EgAw4QcAAKYQADALZQAA6RIAMGYAAO0SADDZBwAA6hIAMNoHAADrEgAw2wcAAOwSACDcBwAA-A0AMN0HAAD4DQAw3gcAAPgNADDfBwAA-A0AMOAHAADuEgAw4QcAAPsNADALZQAA3RIAMGYAAOISADDZBwAA3hIAMNoHAADfEgAw2wcAAOASACDcBwAA4RIAMN0HAADhEgAw3gcAAOESADDfBwAA4RIAMOAHAADjEgAw4QcAAOQSADALZQAA0RIAMGYAANYSADDZBwAA0hIAMNoHAADTEgAw2wcAANQSACDcBwAA1RIAMN0HAADVEgAw3gcAANUSADDfBwAA1RIAMOAHAADXEgAw4QcAANgSADALZQAAyBIAMGYAAMwSADDZBwAAyRIAMNoHAADKEgAw2wcAAMsSACDcBwAAzwwAMN0HAADPDAAw3gcAAM8MADDfBwAAzwwAMOAHAADNEgAw4QcAANIMADALZQAAvxIAMGYAAMMSADDZBwAAwBIAMNoHAADBEgAw2wcAAMISACDcBwAAzwwAMN0HAADPDAAw3gcAAM8MADDfBwAAzwwAMOAHAADEEgAw4QcAANIMADAVEAAA4g4AIBgAAOMMACAZAADkDAAgHgAA4AwAICAAAOIMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKIBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAECAAAAXQAgZQAAxxIAIAMAAABdACBlAADHEgAgZgAAxhIAIAFeAACHGgAwAgAAAF0AIF4AAMYSACACAAAA0wwAIF4AAMUSACAP9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKIBwEAvwwAIYoHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEVEAAA4A4AIBgAANwMACAZAADdDAAgHgAA2QwAICAAANsMACAhAADeDAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKIBwEAvwwAIYoHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEVEAAA4g4AIBgAAOMMACAZAADkDAAgHgAA4AwAICAAAOIMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKIBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAEVEAAA4g4AIBgAAOMMACAZAADkDAAgHwAA4QwAICAAAOIMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAECAAAAXQAgZQAA0BIAIAMAAABdACBlAADQEgAgZgAAzxIAIAFeAACGGgAwAgAAAF0AIF4AAM8SACACAAAA0wwAIF4AAM4SACAP9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKJBwEAvwwAIYoHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEVEAAA4A4AIBgAANwMACAZAADdDAAgHwAA2gwAICAAANsMACAhAADeDAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKJBwEAvwwAIYoHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEVEAAA4g4AIBgAAOMMACAZAADkDAAgHwAA4QwAICAAAOIMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAELIAAAgRIAID0AAIMSACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAJIHAq4GQAAAAAGKBwEAAAABkAcAAACQBwKSBwEAAAABkwcBAAAAAQIAAAD6AQAgZQAA3BIAIAMAAAD6AQAgZQAA3BIAIGYAANsSACABXgAAhRoAMBAHAAD6CgAgIAAAvAoAID0AAOILACDxBQAA3gsAMPIFAAD4AQAQ8wUAAN4LADD0BQEAAAAB-QUBALcKACH8BUAAuwoAIf0FQAC7CgAhrAYAAOALkgcirgZAAOELACGKBwEAtwoAIZAHAADfC5AHIpIHAQC4CgAhkwcBALgKACECAAAA-gEAIF4AANsSACACAAAA2RIAIF4AANoSACAN8QUAANgSADDyBQAA2RIAEPMFAADYEgAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACGsBgAA4AuSByKuBkAA4QsAIYoHAQC3CgAhkAcAAN8LkAcikgcBALgKACGTBwEAuAoAIQ3xBQAA2BIAMPIFAADZEgAQ8wUAANgSADD0BQEAtwoAIfkFAQC3CgAh_AVAALsKACH9BUAAuwoAIawGAADgC5IHIq4GQADhCwAhigcBALcKACGQBwAA3wuQByKSBwEAuAoAIZMHAQC4CgAhCfQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIawGAAD9EZIHIq4GQADXDAAhigcBAL8MACGQBwAA_BGQByKSBwEAwAwAIZMHAQDADAAhCyAAAP4RACA9AACAEgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAP0RkgcirgZAANcMACGKBwEAvwwAIZAHAAD8EZAHIpIHAQDADAAhkwcBAMAMACELIAAAgRIAID0AAIMSACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAJIHAq4GQAAAAAGKBwEAAAABkAcAAACQBwKSBwEAAAABkwcBAAAAAQpCAADzEQAgRAAA9BEAIEUAAPURACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAABpgYBAAAAAYMHAQAAAAGEBwAAAIIHAgIAAADsAQAgZQAA6BIAIAMAAADsAQAgZQAA6BIAIGYAAOcSACABXgAAhBoAMA8HAAD6CgAgQgAAvAoAIEQAAOoLACBFAADUCwAg8QUAAOkLADDyBQAA6gEAEPMFAADpCwAw9AUBAAAAAfkFAQC3CgAh_AVAALsKACH9BUAAuwoAIaUGAQC3CgAhpgYBALcKACGDBwEAtwoAIYQHAADoC4IHIgIAAADsAQAgXgAA5xIAIAIAAADlEgAgXgAA5hIAIAvxBQAA5BIAMPIFAADlEgAQ8wUAAOQSADD0BQEAtwoAIfkFAQC3CgAh_AVAALsKACH9BUAAuwoAIaUGAQC3CgAhpgYBALcKACGDBwEAtwoAIYQHAADoC4IHIgvxBQAA5BIAMPIFAADlEgAQ8wUAAOQSADD0BQEAtwoAIfkFAQC3CgAh_AVAALsKACH9BUAAuwoAIaUGAQC3CgAhpgYBALcKACGDBwEAtwoAIYQHAADoC4IHIgf0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGlBgEAvwwAIaYGAQC_DAAhgwcBAL8MACGEBwAA0BGCByIKQgAA1xEAIEQAANgRACBFAADZEQAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACGmBgEAvwwAIYMHAQC_DAAhhAcAANARggciCkIAAPMRACBEAAD0EQAgRQAA9REAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAaUGAQAAAAGmBgEAAAABgwcBAAAAAYQHAAAAggcCDgkAAIcOACAoAACEDgAgKQAAuBAAICsAAIUOACD0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABsgYBAAAAAc0GAQAAAAHTBgEAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAABAgAAACwAIGUAAPESACADAAAALAAgZQAA8RIAIGYAAPASACABXgAAgxoAMAIAAAAsACBeAADwEgAgAgAAAPwNACBeAADvEgAgCvQFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhsgYBAL8MACHNBgEAvwwAIdMGAQDADAAh2gYBAMAMACHbBgEAvwwAIdwGAQC_DAAhDgkAAIIOACAoAAD_DQAgKQAAthAAICsAAIAOACD0BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIbIGAQC_DAAhzQYBAL8MACHTBgEAwAwAIdoGAQDADAAh2wYBAL8MACHcBgEAvwwAIQ4JAACHDgAgKAAAhA4AICkAALgQACArAACFDgAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAbIGAQAAAAHNBgEAAAAB0wYBAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAQ0JAAC8EAAgCwAAuhAAIBsAANIQACD0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAADaBgLNBgEAAAAB0wYBAAAAAdUGAQAAAAHXBgEAAAAB2AYBAAAAAQIAAAAzACBlAAD6EgAgAwAAADMAIGUAAPoSACBmAAD5EgAgAV4AAIIaADACAAAAMwAgXgAA-RIAIAIAAACnEAAgXgAA-BIAIAr0BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIawGAACpENoGIs0GAQC_DAAh0wYBAMAMACHVBgEAwAwAIdcGAQC_DAAh2AYBAL8MACENCQAArRAAIAsAAKsQACAbAADREAAg9AUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGsBgAAqRDaBiLNBgEAvwwAIdMGAQDADAAh1QYBAMAMACHXBgEAvwwAIdgGAQC_DAAhDQkAALwQACALAAC6EAAgGwAA0hAAIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAANoGAs0GAQAAAAHTBgEAAAAB1QYBAAAAAdcGAQAAAAHYBgEAAAABDD4AAMwOACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAMQGAsAGAQAAAAHCBgAAAMIGAsQGEAAAAAHFBgEAAAABxgYCAAAAAccGQAAAAAHIBkAAAAABAgAAANsBACBlAACDEwAgAwAAANsBACBlAACDEwAgZgAAghMAIAFeAACBGgAwAgAAANsBACBeAACCEwAgAgAAAJoSACBeAACBEwAgC_QFAQC_DAAh_AVAAMEMACH9BUAAwQwAIawGAADGDsQGIsAGAQDADAAhwgYAAMUOwgYixAYQAMcOACHFBgEAvwwAIcYGAgDIDgAhxwZAAMEMACHIBkAAwQwAIQw-AADKDgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAMYOxAYiwAYBAMAMACHCBgAAxQ7CBiLEBhAAxw4AIcUGAQC_DAAhxgYCAMgOACHHBkAAwQwAIcgGQADBDAAhDD4AAMwOACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAMQGAsAGAQAAAAHCBgAAAMIGAsQGEAAAAAHFBgEAAAABxgYCAAAAAccGQAAAAAHIBkAAAAABC_QFAQAAAAH8BUAAAAAB_QVAAAAAAecGAQAAAAHoBgEAAAAB6QYBAAAAAeoGAQAAAAHrBgEAAAAB7AYBAAAAAe0GIAAAAAHuBgEAAAABAgAAAM8GACBlAACEEwAgAwAAAOUBACBlAACEEwAgZgAAiBMAIA0AAADlAQAgXgAAiBMAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIecGAQC_DAAh6AYBAL8MACHpBgEAvwwAIeoGAQC_DAAh6wYBAL8MACHsBgEAvwwAIe0GIAChDgAh7gYBAMAMACEL9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh5wYBAL8MACHoBgEAvwwAIekGAQC_DAAh6gYBAL8MACHrBgEAvwwAIewGAQC_DAAh7QYgAKEOACHuBgEAwAwAIRoJAAD2DgAgGQAAxg8AIBsAAPcOACAdAAD4DgAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAaAGAQAAAAGsBgAAAPMGAsQGEAAAAAHFBgEAAAABxgYCAAAAAdUGAQAAAAHvBgEAAAAB8QYAAADxBgLzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gaAAAAAAfsGQAAAAAH8BkAAAAABAgAAAFcAIGUAAJETACADAAAAVwAgZQAAkRMAIGYAAJATACABXgAAgBoAMAIAAABXACBeAACQEwAgAgAAAOsOACBeAACPEwAgFvQFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAhoAYBAL8MACGsBgAA7g7zBiLEBhAAxw4AIcUGAQC_DAAhxgYCAMgOACHVBgEAvwwAIe8GAQC_DAAh8QYAAO0O8QYi8wYBAL8MACH0BgEAvwwAIfUGAQDADAAh9gYBAMAMACH3BgEAwAwAIfgGAQDADAAh-QYBAMAMACH6BoAAAAAB-wZAAMEMACH8BkAA1wwAIRoJAADxDgAgGQAAxA8AIBsAAPIOACAdAADzDgAg9AUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACGgBgEAvwwAIawGAADuDvMGIsQGEADHDgAhxQYBAL8MACHGBgIAyA4AIdUGAQC_DAAh7wYBAL8MACHxBgAA7Q7xBiLzBgEAvwwAIfQGAQC_DAAh9QYBAMAMACH2BgEAwAwAIfcGAQDADAAh-AYBAMAMACH5BgEAwAwAIfoGgAAAAAH7BkAAwQwAIfwGQADXDAAhGgkAAPYOACAZAADGDwAgGwAA9w4AIB0AAPgOACD0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAawGAAAA8wYCxAYQAAAAAcUGAQAAAAHGBgIAAAAB1QYBAAAAAe8GAQAAAAHxBgAAAPEGAvMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAH3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BoAAAAAB-wZAAAAAAfwGQAAAAAEMCQAA4A8AIBsAAMURACAcAADhDwAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAcUGAQAAAAHVBgEAAAAB7QYgAAAAAf0GEAAAAAH-BhAAAAABAgAAAHYAIGUAAJoTACADAAAAdgAgZQAAmhMAIGYAAJkTACABXgAA_xkAMAIAAAB2ACBeAACZEwAgAgAAAM8PACBeAACYEwAgCfQFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAhxQYBAL8MACHVBgEAvwwAIe0GIAChDgAh_QYQAMcOACH-BhAAxw4AIQwJAADTDwAgGwAAxBEAIBwAANQPACD0BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIcUGAQC_DAAh1QYBAL8MACHtBiAAoQ4AIf0GEADHDgAh_gYQAMcOACEMCQAA4A8AIBsAAMURACAcAADhDwAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAcUGAQAAAAHVBgEAAAAB7QYgAAAAAf0GEAAAAAH-BhAAAAABFgkAAPgMACAQAADmDQAgKQAA9gwAIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGeBgEAAAABsgYBAAAAAbMGCAAAAAG0BggAAAABtQYIAAAAAbYGCAAAAAG3BggAAAABuAYIAAAAAbkGCAAAAAG6BggAAAABuwYIAAAAAbwGCAAAAAG9BggAAAABvgYIAAAAAb8GCAAAAAECAAAArQEAIGUAAKMTACADAAAArQEAIGUAAKMTACBmAACiEwAgAV4AAP4ZADACAAAArQEAIF4AAKITACACAAAA7gwAIF4AAKETACAT9AUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGeBgEAvwwAIbIGAQC_DAAhswYIAPAMACG0BggA8AwAIbUGCADwDAAhtgYIAPAMACG3BggA8AwAIbgGCADwDAAhuQYIAPAMACG6BggA8AwAIbsGCADwDAAhvAYIAPAMACG9BggA8AwAIb4GCADwDAAhvwYIAPAMACEWCQAA9AwAIBAAAOUNACApAADyDAAg9AUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGeBgEAvwwAIbIGAQC_DAAhswYIAPAMACG0BggA8AwAIbUGCADwDAAhtgYIAPAMACG3BggA8AwAIbgGCADwDAAhuQYIAPAMACG6BggA8AwAIbsGCADwDAAhvAYIAPAMACG9BggA8AwAIb4GCADwDAAhvwYIAPAMACEWCQAA-AwAIBAAAOYNACApAAD2DAAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGyBgEAAAABswYIAAAAAbQGCAAAAAG1BggAAAABtgYIAAAAAbcGCAAAAAG4BggAAAABuQYIAAAAAboGCAAAAAG7BggAAAABvAYIAAAAAb0GCAAAAAG-BggAAAABvwYIAAAAAQ0JAACxDQAgEgAAsA4AIBkAAK8NACD0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnwYBAAAAAaAGAQAAAAGhBgEAAAABogYBAAAAAaMGAQAAAAGkBkAAAAABAgAAAEYAIGUAAKwTACADAAAARgAgZQAArBMAIGYAAKsTACABXgAA_RkAMAIAAABGACBeAACrEwAgAgAAAKgNACBeAACqEwAgCvQFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnwYBAL8MACGgBgEAvwwAIaEGAQDADAAhogYBAMAMACGjBgEAwAwAIaQGQADBDAAhDQkAAK0NACASAACvDgAgGQAAqw0AIPQFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnwYBAL8MACGgBgEAvwwAIaEGAQDADAAhogYBAMAMACGjBgEAwAwAIaQGQADBDAAhDQkAALENACASAACwDgAgGQAArw0AIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBgEAAAABowYBAAAAAaQGQAAAAAEOCQAAtQ0AIA4AALMNACAQAAC1DgAgIwAAtg0AIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABngYBAAAAAaUGAQAAAAGmBgEAAAABqAYAAACoBgKpBkAAAAABAgAAAEEAIGUAALUTACADAAAAQQAgZQAAtRMAIGYAALQTACABXgAA_BkAMAIAAABBACBeAAC0EwAgAgAAAJgNACBeAACzEwAgCvQFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGeBgEAvwwAIaUGAQC_DAAhpgYBAMAMACGoBgAAmg2oBiKpBkAA1wwAIQ4JAACeDQAgDgAAnA0AIBAAALQOACAjAACfDQAg9AUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ4GAQC_DAAhpQYBAL8MACGmBgEAwAwAIagGAACaDagGIqkGQADXDAAhDgkAALUNACAOAACzDQAgEAAAtQ4AICMAALYNACD0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ4GAQAAAAGlBgEAAAABpgYBAAAAAagGAAAAqAYCqQZAAAAAARIJAACPDQAgEAAAug4AIBYAAIsNACAYAACNDQAgMwAAjA0AIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGJBgEAAAABngYBAAAAAaoGAQAAAAGsBgAAAKwGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABAgAAAKMBACBlAAC-EwAgAwAAAKMBACBlAAC-EwAgZgAAvRMAIAFeAAD7GQAwAgAAAKMBACBeAAC9EwAgAgAAAIENACBeAAC8EwAgDfQFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhiQYBAL8MACGeBgEAwAwAIaoGAQDADAAhrAYAAIMNrAYirQYBAMAMACGuBkAA1wwAIa8GQADBDAAhsAYBAL8MACGxBgEAwAwAIRIJAACJDQAgEAAAuQ4AIBYAAIUNACAYAACHDQAgMwAAhg0AIPQFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhiQYBAL8MACGeBgEAwAwAIaoGAQDADAAhrAYAAIMNrAYirQYBAMAMACGuBkAA1wwAIa8GQADBDAAhsAYBAL8MACGxBgEAwAwAIRIJAACPDQAgEAAAug4AIBYAAIsNACAYAACNDQAgMwAAjA0AIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGJBgEAAAABngYBAAAAAaoGAQAAAAGsBgAAAKwGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABHTwAAJ4SACA9AACfEgAgPwAAoRIAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAqQcCrgZAAAAAAdMGAQAAAAGTBwEAAAABlAcBAAAAAZUHAQAAAAGWBwEAAAABmAcAAACYBwOZBwEAAAABmgcAAADCBgObBxAAAAABnAcBAAAAAZ0HAgAAAAGfBwAAAJ8HAqAHAQAAAAGhBwEAAAABogcBAAAAAaMHAQAAAAGkBwEAAAABpQcBAAAAAaYHgAAAAAGnB0AAAAABqQcBAAAAAQIAAADVAQAgZQAAyhMAIAMAAADVAQAgZQAAyhMAIGYAAMkTACABXgAA-hkAMCIHAAD4CwAgPAAAvAoAID0AAOILACA_AAC6CwAg8QUAAPELADDyBQAA0wEAEPMFAADxCwAw9AUBAAAAAfkFAQC4CgAh_AVAALsKACH9BUAAuwoAIawGAAD3C6kHIq4GQADhCwAh0wYBALgKACGTBwEAuAoAIZQHAQC3CgAhlQcBALcKACGWBwEAuAoAIZgHAACrC5gHI5kHAQC4CgAhmgcAAPILwgYjmwcQAPMLACGcBwEAtwoAIZ0HAgD0CwAhnwcAAPULnwcioAcBAAAAAaEHAQC4CgAhogcBAAAAAaMHAQC4CgAhpAcBALgKACGlBwEAuAoAIaYHAAD2CwAgpwdAAOELACGpBwEAuAoAIQIAAADVAQAgXgAAyRMAIAIAAADHEwAgXgAAyBMAIB7xBQAAxhMAMPIFAADHEwAQ8wUAAMYTADD0BQEAtwoAIfkFAQC4CgAh_AVAALsKACH9BUAAuwoAIawGAAD3C6kHIq4GQADhCwAh0wYBALgKACGTBwEAuAoAIZQHAQC3CgAhlQcBALcKACGWBwEAuAoAIZgHAACrC5gHI5kHAQC4CgAhmgcAAPILwgYjmwcQAPMLACGcBwEAtwoAIZ0HAgD0CwAhnwcAAPULnwcioAcBALgKACGhBwEAuAoAIaIHAQC4CgAhowcBALgKACGkBwEAuAoAIaUHAQC4CgAhpgcAAPYLACCnB0AA4QsAIakHAQC4CgAhHvEFAADGEwAw8gUAAMcTABDzBQAAxhMAMPQFAQC3CgAh-QUBALgKACH8BUAAuwoAIf0FQAC7CgAhrAYAAPcLqQcirgZAAOELACHTBgEAuAoAIZMHAQC4CgAhlAcBALcKACGVBwEAtwoAIZYHAQC4CgAhmAcAAKsLmAcjmQcBALgKACGaBwAA8gvCBiObBxAA8wsAIZwHAQC3CgAhnQcCAPQLACGfBwAA9QufByKgBwEAuAoAIaEHAQC4CgAhogcBALgKACGjBwEAuAoAIaQHAQC4CgAhpQcBALgKACGmBwAA9gsAIKcHQADhCwAhqQcBALgKACEa9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAI0SqQcirgZAANcMACHTBgEAwAwAIZMHAQDADAAhlAcBAL8MACGVBwEAvwwAIZYHAQDADAAhmAcAAIkSmAcjmQcBAMAMACGaBwAAihLCBiObBxAAixIAIZwHAQC_DAAhnQcCAPUPACGfBwAAjBKfByKgBwEAwAwAIaEHAQDADAAhogcBAMAMACGjBwEAwAwAIaQHAQDADAAhpQcBAMAMACGmB4AAAAABpwdAANcMACGpBwEAwAwAIR08AACOEgAgPQAAjxIAID8AAJESACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGsBgAAjRKpByKuBkAA1wwAIdMGAQDADAAhkwcBAMAMACGUBwEAvwwAIZUHAQC_DAAhlgcBAMAMACGYBwAAiRKYByOZBwEAwAwAIZoHAACKEsIGI5sHEACLEgAhnAcBAL8MACGdBwIA9Q8AIZ8HAACMEp8HIqAHAQDADAAhoQcBAMAMACGiBwEAwAwAIaMHAQDADAAhpAcBAMAMACGlBwEAwAwAIaYHgAAAAAGnB0AA1wwAIakHAQDADAAhHTwAAJ4SACA9AACfEgAgPwAAoRIAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAqQcCrgZAAAAAAdMGAQAAAAGTBwEAAAABlAcBAAAAAZUHAQAAAAGWBwEAAAABmAcAAACYBwOZBwEAAAABmgcAAADCBgObBxAAAAABnAcBAAAAAZ0HAgAAAAGfBwAAAJ8HAqAHAQAAAAGhBwEAAAABogcBAAAAAaMHAQAAAAGkBwEAAAABpQcBAAAAAaYHgAAAAAGnB0AAAAABqQcBAAAAAQsJAADKDQAgDgAAxw0AIA8AAMgNACAQAACrDgAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGdBgEAAAABngYBAAAAAQIAAAA8ACBlAADTEwAgAwAAADwAIGUAANMTACBmAADSEwAgAV4AAPkZADACAAAAPAAgXgAA0hMAIAIAAAC_DQAgXgAA0RMAIAf0BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACGeBgEAvwwAIQsJAADFDQAgDgAAwg0AIA8AAMMNACAQAACqDgAg9AUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhngYBAL8MACELCQAAyg0AIA4AAMcNACAPAADIDQAgEAAAqw4AIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAEVCQAAjw4AIAoAAJAOACALAACJDgAgDgAAjg4AIA8AAIwOACAQAACfDwAgGQAAjQ4AIBsAAJEOACAsAACKDgAgLQAAiw4AIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABAgAAACgAIGUAANwTACADAAAAKAAgZQAA3BMAIGYAANsTACABXgAA-BkAMAIAAAAoACBeAADbEwAgAgAAANMNACBeAADaEwAgC_QFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhoAYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACEVCQAA3A0AIAoAAN0NACALAADWDQAgDgAA2w0AIA8AANkNACAQAACdDwAgGQAA2g0AIBsAAN4NACAsAADXDQAgLQAA2A0AIPQFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhoAYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACEVCQAAjw4AIAoAAJAOACALAACJDgAgDgAAjg4AIA8AAIwOACAQAACfDwAgGQAAjQ4AIBsAAJEOACAsAACKDgAgLQAAiw4AIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABDgMAAKIPACAJAAChDwAgDQAAow8AIBMAAKQPACAaAAClDwAgHAAApg8AICIAAKcPACD0BQEAAAAB-AUBAAAAAfoFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAHJBgEAAAABAgAAAJ0BACBlAADoEwAgAwAAAJ0BACBlAADoEwAgZgAA5xMAIAFeAAD3GQAwEwMAALwKACAHAAD6CgAgCQAA_wsAIA0AAOYKACATAAC3CwAgGgAA9AoAIBwAAOgKACAiAAC-CwAg8QUAAIUMADDyBQAAUwAQ8wUAAIUMADD0BQEAAAAB-AUBALgKACH5BQEAtwoAIfoFAQC4CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhyQYBAAAAAQIAAACdAQAgXgAA5xMAIAIAAADlEwAgXgAA5hMAIAvxBQAA5BMAMPIFAADlEwAQ8wUAAOQTADD0BQEAtwoAIfgFAQC4CgAh-QUBALcKACH6BQEAuAoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIckGAQC3CgAhC_EFAADkEwAw8gUAAOUTABDzBQAA5BMAMPQFAQC3CgAh-AUBALgKACH5BQEAtwoAIfoFAQC4CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhyQYBALcKACEH9AUBAL8MACH4BQEAwAwAIfoFAQDADAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhyQYBAL8MACEOAwAA0g4AIAkAANEOACANAADTDgAgEwAA1A4AIBoAANUOACAcAADWDgAgIgAA1w4AIPQFAQC_DAAh-AUBAMAMACH6BQEAwAwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIckGAQC_DAAhDgMAAKIPACAJAAChDwAgDQAAow8AIBMAAKQPACAaAAClDwAgHAAApg8AICIAAKcPACD0BQEAAAAB-AUBAAAAAfoFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAHJBgEAAAABEQMAAJsOACAJAACaDgAgDQAAlA4AIBEAAJUOACAiAACZDgAgJAAAlg4AIEoAAJcOACBLAACYDgAg9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABAgAAABAAIGUAAPQTACADAAAAEAAgZQAA9BMAIGYAAPMTACABXgAA9hkAMBYDAAC8CgAgBwAA-goAIAkAAIwMACANAADmCgAgEQAAtAsAICIAAL4LACAkAAC2CwAgSgAA9woAIEsAALgLACDxBQAAtgwAMPIFAAAOABDzBQAAtgwAMPQFAQAAAAH1BQEAAAAB9gUBAAAAAfcFAQC3CgAh-AUBALgKACH5BQEAtwoAIfoFAQC3CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhAgAAABAAIF4AAPMTACACAAAA8RMAIF4AAPITACAN8QUAAPATADDyBQAA8RMAEPMFAADwEwAw9AUBALcKACH1BQEAtwoAIfYFAQC3CgAh9wUBALcKACH4BQEAuAoAIfkFAQC3CgAh-gUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACEN8QUAAPATADDyBQAA8RMAEPMFAADwEwAw9AUBALcKACH1BQEAtwoAIfYFAQC3CgAh9wUBALcKACH4BQEAuAoAIfkFAQC3CgAh-gUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACEJ9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfoFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhEQMAAMoMACAJAADJDAAgDQAAwwwAIBEAAMQMACAiAADIDAAgJAAAxQwAIEoAAMYMACBLAADHDAAg9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfoFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhEQMAAJsOACAJAACaDgAgDQAAlA4AIBEAAJUOACAiAACZDgAgJAAAlg4AIEoAAJcOACBLAACYDgAg9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABBgMAAIMUACD0BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABggcAAADPBwICAAAAAQAgZQAAghQAIAMAAAABACBlAACCFAAgZgAAgBQAIAFeAAD1GQAwCwMAALwKACAHAAD6CgAg8QUAALcMADDyBQAACwAQ8wUAALcMADD0BQEAAAAB-QUBALcKACH7BQEAAAAB_AVAALsKACH9BUAAuwoAIYIHAAC4DM8HIgIAAAABACBeAACAFAAgAgAAAP0TACBeAAD-EwAgCfEFAAD8EwAw8gUAAP0TABDzBQAA_BMAMPQFAQC3CgAh-QUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACGCBwAAuAzPByIJ8QUAAPwTADDyBQAA_RMAEPMFAAD8EwAw9AUBALcKACH5BQEAtwoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIYIHAAC4DM8HIgX0BQEAvwwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIYIHAAD_E88HIgHcBwAAAM8HAgYDAACBFAAg9AUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACGCBwAA_xPPByIFZQAA8BkAIGYAAPMZACDZBwAA8RkAINoHAADyGQAg3wcAAPYCACAGAwAAgxQAIPQFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAGCBwAAAM8HAgNlAADwGQAg2QcAAPEZACDfBwAA9gIAIA0JAACLEQAgCgAAjhQAIA0AAIwRACARAACNEQAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHfBgIAAAAB5QYBAAAAAawHAQAAAAGtBwEAAAABAgAAACMAIGUAAI0UACADAAAAIwAgZQAAjRQAIGYAAIsUACABXgAA7xkAMAIAAAAjACBeAACLFAAgAgAAAPAQACBeAACKFAAgCfQFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHfBgIA9Q8AIeUGAQDADAAhrAcBAL8MACGtBwEAvwwAIQ0JAAD0EAAgCgAAjBQAIA0AAPUQACARAAD2EAAg9AUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAId8GAgD1DwAh5QYBAMAMACGsBwEAvwwAIa0HAQC_DAAhB2UAAOoZACBmAADtGQAg2QcAAOsZACDaBwAA7BkAIN0HAAAdACDeBwAAHQAg3wcAAB8AIA0JAACLEQAgCgAAjhQAIA0AAIwRACARAACNEQAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHfBgIAAAAB5QYBAAAAAawHAQAAAAGtBwEAAAABA2UAAOoZACDZBwAA6xkAIN8HAAAfACAPCQAAnRAAIA0AAJkQACARAACaEAAgGwAAzRAAICQAAJsQACAmAACeEAAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAAB1AYCAAAAAdUGAQAAAAHWBgEAAAABAgAAADcAIGUAAJcUACADAAAANwAgZQAAlxQAIGYAAJYUACABXgAA6RkAMAIAAAA3ACBeAACWFAAgAgAAAPMPACBeAACVFAAgCfQFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIdQGAgD1DwAh1QYBAL8MACHWBgEAwAwAIQ8JAAD7DwAgDQAA9w8AIBEAAPgPACAbAADMEAAgJAAA-Q8AICYAAPwPACD0BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACHUBgIA9Q8AIdUGAQC_DAAh1gYBAMAMACEPCQAAnRAAIA0AAJkQACARAACaEAAgGwAAzRAAICQAAJsQACAmAACeEAAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAAB1AYCAAAAAdUGAQAAAAHWBgEAAAABCSoAAK8UACD0BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABrgcBAAAAAa8HAQAAAAGwBwIAAAABsgcAAACyBwICAAAAygEAIGUAAK4UACADAAAAygEAIGUAAK4UACBmAACjFAAgAV4AAOgZADAOBwAA-goAICoAALsLACDxBQAA-QsAMPIFAADIAQAQ8wUAAPkLADD0BQEAAAAB-QUBALcKACH8BUAAuwoAIf0FQAC7CgAhzQYBALgKACGuBwEAtwoAIa8HAQC3CgAhsAcCAO8LACGyBwAA-guyByICAAAAygEAIF4AAKMUACACAAAAoBQAIF4AAKEUACAM8QUAAJ8UADDyBQAAoBQAEPMFAACfFAAw9AUBALcKACH5BQEAtwoAIfwFQAC7CgAh_QVAALsKACHNBgEAuAoAIa4HAQC3CgAhrwcBALcKACGwBwIA7wsAIbIHAAD6C7IHIgzxBQAAnxQAMPIFAACgFAAQ8wUAAJ8UADD0BQEAtwoAIfkFAQC3CgAh_AVAALsKACH9BUAAuwoAIc0GAQC4CgAhrgcBALcKACGvBwEAtwoAIbAHAgDvCwAhsgcAAPoLsgciCPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIc0GAQDADAAhrgcBAL8MACGvBwEAvwwAIbAHAgDIDgAhsgcAAKIUsgciAdwHAAAAsgcCCSoAAKQUACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHNBgEAwAwAIa4HAQC_DAAhrwcBAL8MACGwBwIAyA4AIbIHAACiFLIHIgtlAAClFAAwZgAAqRQAMNkHAACmFAAw2gcAAKcUADDbBwAAqBQAINwHAAD4DQAw3QcAAPgNADDeBwAA-A0AMN8HAAD4DQAw4AcAAKoUADDhBwAA-w0AMA4HAACGDgAgCQAAhw4AICgAAIQOACApAAC4EAAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGyBgEAAAABzQYBAAAAAdMGAQAAAAHaBgEAAAAB2wYBAAAAAQIAAAAsACBlAACtFAAgAwAAACwAIGUAAK0UACBmAACsFAAgAV4AAOcZADACAAAALAAgXgAArBQAIAIAAAD8DQAgXgAAqxQAIAr0BQEAvwwAIfkFAQDADAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhsgYBAL8MACHNBgEAvwwAIdMGAQDADAAh2gYBAMAMACHbBgEAvwwAIQ4HAACBDgAgCQAAgg4AICgAAP8NACApAAC2EAAg9AUBAL8MACH5BQEAwAwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIbIGAQC_DAAhzQYBAL8MACHTBgEAwAwAIdoGAQDADAAh2wYBAL8MACEOBwAAhg4AIAkAAIcOACAoAACEDgAgKQAAuBAAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABsgYBAAAAAc0GAQAAAAHTBgEAAAAB2gYBAAAAAdsGAQAAAAEJKgAArxQAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAGuBwEAAAABrwcBAAAAAbAHAgAAAAGyBwAAALIHAgRlAAClFAAw2QcAAKYUADDbBwAAqBQAIN8HAAD4DQAwCAkAAMcUACAlAADIFAAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAABAgAAAJcBACBlAADGFAAgAwAAAJcBACBlAADGFAAgZgAAuhQAIAFeAADmGQAwDQcAAPoKACAJAAD_CwAgJQAA5QoAIPEFAACGDAAw8gUAAGsAEPMFAACGDAAw9AUBAAAAAfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhzQYBALcKACHTBgEAuAoAIQIAAACXAQAgXgAAuhQAIAIAAAC4FAAgXgAAuRQAIArxBQAAtxQAMPIFAAC4FAAQ8wUAALcUADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhzQYBALcKACHTBgEAuAoAIQrxBQAAtxQAMPIFAAC4FAAQ8wUAALcUADD0BQEAtwoAIfkFAQC3CgAh-gUBALgKACH8BUAAuwoAIf0FQAC7CgAhzQYBALcKACHTBgEAuAoAIQb0BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACEICQAAuxQAICUAALwUACD0BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACEHZQAA4BkAIGYAAOQZACDZBwAA4RkAINoHAADjGQAg3QcAABgAIN4HAAAYACDfBwAAGgAgC2UAAL0UADBmAADBFAAw2QcAAL4UADDaBwAAvxQAMNsHAADAFAAg3AcAAO8PADDdBwAA7w8AMN4HAADvDwAw3wcAAO8PADDgBwAAwhQAMOEHAADyDwAwDwcAAJwQACAJAACdEAAgDQAAmRAAIBEAAJoQACAbAADNEAAgJAAAmxAAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAdMGAQAAAAHUBgIAAAAB1QYBAAAAAQIAAAA3ACBlAADFFAAgAwAAADcAIGUAAMUUACBmAADEFAAgAV4AAOIZADACAAAANwAgXgAAxBQAIAIAAADzDwAgXgAAwxQAIAn0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIdQGAgD1DwAh1QYBAL8MACEPBwAA-g8AIAkAAPsPACANAAD3DwAgEQAA-A8AIBsAAMwQACAkAAD5DwAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACHUBgIA9Q8AIdUGAQC_DAAhDwcAAJwQACAJAACdEAAgDQAAmRAAIBEAAJoQACAbAADNEAAgJAAAmxAAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAdMGAQAAAAHUBgIAAAAB1QYBAAAAAQgJAADHFAAgJQAAyBQAIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAQNlAADgGQAg2QcAAOEZACDfBwAAGgAgBGUAAL0UADDZBwAAvhQAMNsHAADAFAAg3wcAAO8PADANCQAAkREAIA0AAI8RACAPAACOEQAg9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAaUGAQAAAAHTBgEAAAAB3QYBAAAAAd4GQAAAAAHfBggAAAAB4AYIAAAAAQIAAAAfACBlAADUFAAgAwAAAB8AIGUAANQUACBmAADTFAAgAV4AAN8ZADASBwAA-goAIAkAAIwMACANAADmCgAgDwAAsAsAIPEFAACxDAAw8gUAAB0AEPMFAACxDAAw9AUBAAAAAfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAhpQYBALcKACHTBgEAuAoAId0GAQC4CgAh3gZAAOELACHfBggA_AsAIeAGCAD8CwAhAgAAAB8AIF4AANMUACACAAAA0RQAIF4AANIUACAO8QUAANAUADDyBQAA0RQAEPMFAADQFAAw9AUBALcKACH5BQEAtwoAIfoFAQC3CgAh_AVAALsKACH9BUAAuwoAIaUGAQC3CgAh0wYBALgKACHdBgEAuAoAId4GQADhCwAh3wYIAPwLACHgBggA_AsAIQ7xBQAA0BQAMPIFAADRFAAQ8wUAANAUADD0BQEAtwoAIfkFAQC3CgAh-gUBALcKACH8BUAAuwoAIf0FQAC7CgAhpQYBALcKACHTBgEAuAoAId0GAQC4CgAh3gZAAOELACHfBggA_AsAIeAGCAD8CwAhCvQFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACHTBgEAwAwAId0GAQDADAAh3gZAANcMACHfBggA8AwAIeAGCADwDAAhDQkAAN4QACANAADcEAAgDwAA2xAAIPQFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACHTBgEAwAwAId0GAQDADAAh3gZAANcMACHfBggA8AwAIeAGCADwDAAhDQkAAJERACANAACPEQAgDwAAjhEAIPQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAAB0wYBAAAAAd0GAQAAAAHeBkAAAAAB3wYIAAAAAeAGCAAAAAEHOQAAqxYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAUACBlAACqFgAgAwAAABQAIGUAAKoWACBmAADfFAAgAV4AAN4ZADAMBwAA-AsAIDkAALUMACDxBQAAtAwAMPIFAAASABDzBQAAtAwAMPQFAQAAAAH5BQEAuAoAIfwFQAC7CgAh_QVAALsKACHTBgEAuAoAIZYHAQC4CgAhqgcBALcKACECAAAAFAAgXgAA3xQAIAIAAADdFAAgXgAA3hQAIArxBQAA3BQAMPIFAADdFAAQ8wUAANwUADD0BQEAtwoAIfkFAQC4CgAh_AVAALsKACH9BUAAuwoAIdMGAQC4CgAhlgcBALgKACGqBwEAtwoAIQrxBQAA3BQAMPIFAADdFAAQ8wUAANwUADD0BQEAtwoAIfkFAQC4CgAh_AVAALsKACH9BUAAuwoAIdMGAQC4CgAhlgcBALgKACGqBwEAtwoAIQb0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIZYHAQDADAAhqgcBAL8MACEHOQAA4BQAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAhlgcBAMAMACGqBwEAvwwAIQtlAADhFAAwZgAA5hQAMNkHAADiFAAw2gcAAOMUADDbBwAA5BQAINwHAADlFAAw3QcAAOUUADDeBwAA5RQAMN8HAADlFAAw4AcAAOcUADDhBwAA6BQAMBcMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJQAAnBYAICcAAKUWACAqAACoFgAgLgAAmRYAIC8AAJoWACAwAACbFgAgMQAAnRYAIDIAAJ4WACA0AAChFgAgNQAAohYAIDYAAKMWACA3AACkFgAgOAAAqRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAaACBlAACYFgAgAwAAABoAIGUAAJgWACBmAADrFAAgAV4AAN0ZADAcCAAAswwAIAwAAOQKACANAADmCgAgEQAAtAsAIBwAAOgKACAlAADlCgAgJwAA5woAICoAALsLACAuAACtCwAgLwAArgsAIDAAALALACAxAACyCwAgMgAAswsAIDQAAPcKACA1AAC2CwAgNgAAtwsAIDcAALgLACA4AAC-CwAg8QUAALIMADDyBQAAGAAQ8wUAALIMADD0BQEAAAAB_AVAALsKACH9BUAAuwoAIdMGAQC4CgAh5AYBALgKACGWBwEAuAoAIaoHAQC3CgAhAgAAABoAIF4AAOsUACACAAAA6RQAIF4AAOoUACAK8QUAAOgUADDyBQAA6RQAEPMFAADoFAAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACHkBgEAuAoAIZYHAQC4CgAhqgcBALcKACEK8QUAAOgUADDyBQAA6RQAEPMFAADoFAAw9AUBALcKACH8BUAAuwoAIf0FQAC7CgAh0wYBALgKACHkBgEAuAoAIZYHAQC4CgAhqgcBALcKACEG9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACGWBwEAwAwAIaoHAQC_DAAhFwwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACGWBwEAwAwAIaoHAQC_DAAhC2UAAI8WADBmAACTFgAw2QcAAJAWADDaBwAAkRYAMNsHAACSFgAg3AcAAM0UADDdBwAAzRQAMN4HAADNFAAw3wcAAM0UADDgBwAAlBYAMOEHAADQFAAwC2UAAIQWADBmAACIFgAw2QcAAIUWADDaBwAAhhYAMNsHAACHFgAg3AcAALQUADDdBwAAtBQAMN4HAAC0FAAw3wcAALQUADDgBwAAiRYAMOEHAAC3FAAwC2UAAPsVADBmAAD_FQAw2QcAAPwVADDaBwAA_RUAMNsHAAD-FQAg3AcAAOwQADDdBwAA7BAAMN4HAADsEAAw3wcAAOwQADDgBwAAgBYAMOEHAADvEAAwC2UAAPIVADBmAAD2FQAw2QcAAPMVADDaBwAA9BUAMNsHAAD1FQAg3AcAAO8PADDdBwAA7w8AMN4HAADvDwAw3wcAAO8PADDgBwAA9xUAMOEHAADyDwAwC2UAAOkVADBmAADtFQAw2QcAAOoVADDaBwAA6xUAMNsHAADsFQAg3AcAAO0TADDdBwAA7RMAMN4HAADtEwAw3wcAAO0TADDgBwAA7hUAMOEHAADwEwAwC2UAAOAVADBmAADkFQAw2QcAAOEVADDaBwAA4hUAMNsHAADjFQAg3AcAAOETADDdBwAA4RMAMN4HAADhEwAw3wcAAOETADDgBwAA5RUAMOEHAADkEwAwC2UAANcVADBmAADbFQAw2QcAANgVADDaBwAA2RUAMNsHAADaFQAg3AcAAM8NADDdBwAAzw0AMN4HAADPDQAw3wcAAM8NADDgBwAA3BUAMOEHAADSDQAwC2UAAM4VADBmAADSFQAw2QcAAM8VADDaBwAA0BUAMNsHAADRFQAg3AcAALsNADDdBwAAuw0AMN4HAAC7DQAw3wcAALsNADDgBwAA0xUAMOEHAAC-DQAwC2UAAMUVADBmAADJFQAw2QcAAMYVADDaBwAAxxUAMNsHAADIFQAg3AcAAP0MADDdBwAA_QwAMN4HAAD9DAAw3wcAAP0MADDgBwAAyhUAMOEHAACADQAwC2UAALwVADBmAADAFQAw2QcAAL0VADDaBwAAvhUAMNsHAAC_FQAg3AcAAJQNADDdBwAAlA0AMN4HAACUDQAw3wcAAJQNADDgBwAAwRUAMOEHAACXDQAwC2UAALMVADBmAAC3FQAw2QcAALQVADDaBwAAtRUAMNsHAAC2FQAg3AcAAKQNADDdBwAApA0AMN4HAACkDQAw3wcAAKQNADDgBwAAuBUAMOEHAACnDQAwC2UAAKoVADBmAACuFQAw2QcAAKsVADDaBwAArBUAMNsHAACtFQAg3AcAAOoMADDdBwAA6gwAMN4HAADqDAAw3wcAAOoMADDgBwAArxUAMOEHAADtDAAwC2UAAKEVADBmAAClFQAw2QcAAKIVADDaBwAAoxUAMNsHAACkFQAg3AcAAMsPADDdBwAAyw8AMN4HAADLDwAw3wcAAMsPADDgBwAAphUAMOEHAADODwAwC2UAAJgVADBmAACcFQAw2QcAAJkVADDaBwAAmhUAMNsHAACbFQAg3AcAAOcOADDdBwAA5w4AMN4HAADnDgAw3wcAAOcOADDgBwAAnRUAMOEHAADqDgAwC2UAAI8VADBmAACTFQAw2QcAAJAVADDaBwAAkRUAMNsHAACSFQAg3AcAAKMQADDdBwAAoxAAMN4HAACjEAAw3wcAAKMQADDgBwAAlBUAMOEHAACmEAAwC2UAAIYVADBmAACKFQAw2QcAAIcVADDaBwAAiBUAMNsHAACJFQAg3AcAAPgNADDdBwAA-A0AMN4HAAD4DQAw3wcAAPgNADDgBwAAixUAMOEHAAD7DQAwC2UAAP0UADBmAACBFQAw2QcAAP4UADDaBwAA_xQAMNsHAACAFQAg3AcAAM8MADDdBwAAzwwAMN4HAADPDAAw3wcAAM8MADDgBwAAghUAMOEHAADSDAAwFRAAAOIOACAYAADjDAAgGQAA5AwAIB4AAOAMACAfAADhDAAgIAAA4gwAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGgBgEAAAABrAYAAACIBwKuBkAAAAABsQYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGKBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABAgAAAF0AIGUAAIUVACADAAAAXQAgZQAAhRUAIGYAAIQVACABXgAA3BkAMAIAAABdACBeAACEFQAgAgAAANMMACBeAACDFQAgD_QFAQC_DAAh_AVAAMEMACH9BUAAwQwAIZ4GAQDADAAhoAYBAMAMACGsBgAA1gyIByKuBkAA1wwAIbEGAQDADAAhhgcAANUMhgciiAcBAL8MACGJBwEAvwwAIYoHAQC_DAAhjAcBAMAMACGNBwEAwAwAIY4HQADBDAAhFRAAAOAOACAYAADcDAAgGQAA3QwAIB4AANkMACAfAADaDAAgIAAA2wwAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIZ4GAQDADAAhoAYBAMAMACGsBgAA1gyIByKuBkAA1wwAIbEGAQDADAAhhgcAANUMhgciiAcBAL8MACGJBwEAvwwAIYoHAQC_DAAhjAcBAMAMACGNBwEAwAwAIY4HQADBDAAhFRAAAOIOACAYAADjDAAgGQAA5AwAIB4AAOAMACAfAADhDAAgIAAA4gwAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGgBgEAAAABrAYAAACIBwKuBkAAAAABsQYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGKBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABDgcAAIYOACAoAACEDgAgKQAAuBAAICsAAIUOACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABsgYBAAAAAc0GAQAAAAHTBgEAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAABAgAAACwAIGUAAI4VACADAAAALAAgZQAAjhUAIGYAAI0VACABXgAA2xkAMAIAAAAsACBeAACNFQAgAgAAAPwNACBeAACMFQAgCvQFAQC_DAAh-QUBAMAMACH8BUAAwQwAIf0FQADBDAAhsgYBAL8MACHNBgEAvwwAIdMGAQDADAAh2gYBAMAMACHbBgEAvwwAIdwGAQC_DAAhDgcAAIEOACAoAAD_DQAgKQAAthAAICsAAIAOACD0BQEAvwwAIfkFAQDADAAh_AVAAMEMACH9BUAAwQwAIbIGAQC_DAAhzQYBAL8MACHTBgEAwAwAIdoGAQDADAAh2wYBAL8MACHcBgEAvwwAIQ4HAACGDgAgKAAAhA4AICkAALgQACArAACFDgAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAbIGAQAAAAHNBgEAAAAB0wYBAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAQ0HAAC7EAAgCwAAuhAAIBsAANIQACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAADaBgLNBgEAAAAB0wYBAAAAAdUGAQAAAAHXBgEAAAAB2AYBAAAAAQIAAAAzACBlAACXFQAgAwAAADMAIGUAAJcVACBmAACWFQAgAV4AANoZADACAAAAMwAgXgAAlhUAIAIAAACnEAAgXgAAlRUAIAr0BQEAvwwAIfkFAQDADAAh_AVAAMEMACH9BUAAwQwAIawGAACpENoGIs0GAQC_DAAh0wYBAMAMACHVBgEAwAwAIdcGAQC_DAAh2AYBAL8MACENBwAArBAAIAsAAKsQACAbAADREAAg9AUBAL8MACH5BQEAwAwAIfwFQADBDAAh_QVAAMEMACGsBgAAqRDaBiLNBgEAvwwAIdMGAQDADAAh1QYBAMAMACHXBgEAvwwAIdgGAQC_DAAhDQcAALsQACALAAC6EAAgGwAA0hAAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAANoGAs0GAQAAAAHTBgEAAAAB1QYBAAAAAdcGAQAAAAHYBgEAAAABGgcAAPUOACAZAADGDwAgGwAA9w4AIB0AAPgOACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAawGAAAA8wYCxAYQAAAAAcUGAQAAAAHGBgIAAAAB1QYBAAAAAe8GAQAAAAHxBgAAAPEGAvMGAQAAAAH0BgEAAAAB9QYBAAAAAfYGAQAAAAH3BgEAAAAB-AYBAAAAAfkGAQAAAAH6BoAAAAAB-wZAAAAAAfwGQAAAAAECAAAAVwAgZQAAoBUAIAMAAABXACBlAACgFQAgZgAAnxUAIAFeAADZGQAwAgAAAFcAIF4AAJ8VACACAAAA6w4AIF4AAJ4VACAW9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGgBgEAvwwAIawGAADuDvMGIsQGEADHDgAhxQYBAL8MACHGBgIAyA4AIdUGAQC_DAAh7wYBAL8MACHxBgAA7Q7xBiLzBgEAvwwAIfQGAQC_DAAh9QYBAMAMACH2BgEAwAwAIfcGAQDADAAh-AYBAMAMACH5BgEAwAwAIfoGgAAAAAH7BkAAwQwAIfwGQADXDAAhGgcAAPAOACAZAADEDwAgGwAA8g4AIB0AAPMOACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaAGAQC_DAAhrAYAAO4O8wYixAYQAMcOACHFBgEAvwwAIcYGAgDIDgAh1QYBAL8MACHvBgEAvwwAIfEGAADtDvEGIvMGAQC_DAAh9AYBAL8MACH1BgEAwAwAIfYGAQDADAAh9wYBAMAMACH4BgEAwAwAIfkGAQDADAAh-gaAAAAAAfsGQADBDAAh_AZAANcMACEaBwAA9Q4AIBkAAMYPACAbAAD3DgAgHQAA-A4AIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABrAYAAADzBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHVBgEAAAAB7wYBAAAAAfEGAAAA8QYC8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAfcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGgAAAAAH7BkAAAAAB_AZAAAAAAQwHAADfDwAgGwAAxREAIBwAAOEPACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABxQYBAAAAAdUGAQAAAAHtBiAAAAAB_QYQAAAAAf4GEAAAAAECAAAAdgAgZQAAqRUAIAMAAAB2ACBlAACpFQAgZgAAqBUAIAFeAADYGQAwAgAAAHYAIF4AAKgVACACAAAAzw8AIF4AAKcVACAJ9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHFBgEAvwwAIdUGAQC_DAAh7QYgAKEOACH9BhAAxw4AIf4GEADHDgAhDAcAANIPACAbAADEEQAgHAAA1A8AIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhxQYBAL8MACHVBgEAvwwAIe0GIAChDgAh_QYQAMcOACH-BhAAxw4AIQwHAADfDwAgGwAAxREAIBwAAOEPACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABxQYBAAAAAdUGAQAAAAHtBiAAAAAB_QYQAAAAAf4GEAAAAAEWBwAA9wwAIBAAAOYNACApAAD2DAAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGyBgEAAAABswYIAAAAAbQGCAAAAAG1BggAAAABtgYIAAAAAbcGCAAAAAG4BggAAAABuQYIAAAAAboGCAAAAAG7BggAAAABvAYIAAAAAb0GCAAAAAG-BggAAAABvwYIAAAAAQIAAACtAQAgZQAAshUAIAMAAACtAQAgZQAAshUAIGYAALEVACABXgAA1xkAMAIAAACtAQAgXgAAsRUAIAIAAADuDAAgXgAAsBUAIBP0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIZ4GAQC_DAAhsgYBAL8MACGzBggA8AwAIbQGCADwDAAhtQYIAPAMACG2BggA8AwAIbcGCADwDAAhuAYIAPAMACG5BggA8AwAIboGCADwDAAhuwYIAPAMACG8BggA8AwAIb0GCADwDAAhvgYIAPAMACG_BggA8AwAIRYHAADzDAAgEAAA5Q0AICkAAPIMACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIZ4GAQC_DAAhsgYBAL8MACGzBggA8AwAIbQGCADwDAAhtQYIAPAMACG2BggA8AwAIbcGCADwDAAhuAYIAPAMACG5BggA8AwAIboGCADwDAAhuwYIAPAMACG8BggA8AwAIb0GCADwDAAhvgYIAPAMACG_BggA8AwAIRYHAAD3DAAgEAAA5g0AICkAAPYMACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAbIGAQAAAAGzBggAAAABtAYIAAAAAbUGCAAAAAG2BggAAAABtwYIAAAAAbgGCAAAAAG5BggAAAABugYIAAAAAbsGCAAAAAG8BggAAAABvQYIAAAAAb4GCAAAAAG_BggAAAABDQcAALANACASAACwDgAgGQAArw0AIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGfBgEAAAABoAYBAAAAAaEGAQAAAAGiBgEAAAABowYBAAAAAaQGQAAAAAECAAAARgAgZQAAuxUAIAMAAABGACBlAAC7FQAgZgAAuhUAIAFeAADWGQAwAgAAAEYAIF4AALoVACACAAAAqA0AIF4AALkVACAK9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGfBgEAvwwAIaAGAQC_DAAhoQYBAMAMACGiBgEAwAwAIaMGAQDADAAhpAZAAMEMACENBwAArA0AIBIAAK8OACAZAACrDQAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGfBgEAvwwAIaAGAQC_DAAhoQYBAMAMACGiBgEAwAwAIaMGAQDADAAhpAZAAMEMACENBwAAsA0AIBIAALAOACAZAACvDQAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAZ8GAQAAAAGgBgEAAAABoQYBAAAAAaIGAQAAAAGjBgEAAAABpAZAAAAAAQ4HAAC0DQAgDgAAsw0AIBAAALUOACAjAAC2DQAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGeBgEAAAABpQYBAAAAAaYGAQAAAAGoBgAAAKgGAqkGQAAAAAECAAAAQQAgZQAAxBUAIAMAAABBACBlAADEFQAgZgAAwxUAIAFeAADVGQAwAgAAAEEAIF4AAMMVACACAAAAmA0AIF4AAMIVACAK9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ4GAQC_DAAhpQYBAL8MACGmBgEAwAwAIagGAACaDagGIqkGQADXDAAhDgcAAJ0NACAOAACcDQAgEAAAtA4AICMAAJ8NACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhngYBAL8MACGlBgEAvwwAIaYGAQDADAAhqAYAAJoNqAYiqQZAANcMACEOBwAAtA0AIA4AALMNACAQAAC1DgAgIwAAtg0AIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABngYBAAAAAaUGAQAAAAGmBgEAAAABqAYAAACoBgKpBkAAAAABEgcAAI4NACAQAAC6DgAgFgAAiw0AIBgAAI0NACAzAACMDQAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAYkGAQAAAAGeBgEAAAABqgYBAAAAAawGAAAArAYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAECAAAAowEAIGUAAM0VACADAAAAowEAIGUAAM0VACBmAADMFQAgAV4AANQZADACAAAAowEAIF4AAMwVACACAAAAgQ0AIF4AAMsVACAN9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIZ4GAQDADAAhqgYBAMAMACGsBgAAgw2sBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIbEGAQDADAAhEgcAAIgNACAQAAC5DgAgFgAAhQ0AIBgAAIcNACAzAACGDQAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIZ4GAQDADAAhqgYBAMAMACGsBgAAgw2sBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIbEGAQDADAAhEgcAAI4NACAQAAC6DgAgFgAAiw0AIBgAAI0NACAzAACMDQAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAYkGAQAAAAGeBgEAAAABqgYBAAAAAawGAAAArAYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAELBwAAyQ0AIA4AAMcNACAPAADIDQAgEAAAqw4AIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAECAAAAPAAgZQAA1hUAIAMAAAA8ACBlAADWFQAgZgAA1RUAIAFeAADTGQAwAgAAADwAIF4AANUVACACAAAAvw0AIF4AANQVACAH9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhngYBAL8MACELBwAAxA0AIA4AAMINACAPAADDDQAgEAAAqg4AIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhCwcAAMkNACAOAADHDQAgDwAAyA0AIBAAAKsOACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABFQcAAJIOACAKAACQDgAgCwAAiQ4AIA4AAI4OACAPAACMDgAgEAAAnw8AIBkAAI0OACAbAACRDgAgLAAAig4AIC0AAIsOACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQIAAAAoACBlAADfFQAgAwAAACgAIGUAAN8VACBmAADeFQAgAV4AANIZADACAAAAKAAgXgAA3hUAIAIAAADTDQAgXgAA3RUAIAv0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhFQcAAN8NACAKAADdDQAgCwAA1g0AIA4AANsNACAPAADZDQAgEAAAnQ8AIBkAANoNACAbAADeDQAgLAAA1w0AIC0AANgNACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhFQcAAJIOACAKAACQDgAgCwAAiQ4AIA4AAI4OACAPAACMDgAgEAAAnw8AIBkAAI0OACAbAACRDgAgLAAAig4AIC0AAIsOACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQ4DAACiDwAgBwAAoA8AIA0AAKMPACATAACkDwAgGgAApQ8AIBwAAKYPACAiAACnDwAg9AUBAAAAAfgFAQAAAAH5BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAAByQYBAAAAAQIAAACdAQAgZQAA6BUAIAMAAACdAQAgZQAA6BUAIGYAAOcVACABXgAA0RkAMAIAAACdAQAgXgAA5xUAIAIAAADlEwAgXgAA5hUAIAf0BQEAvwwAIfgFAQDADAAh-QUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACHJBgEAvwwAIQ4DAADSDgAgBwAA0A4AIA0AANMOACATAADUDgAgGgAA1Q4AIBwAANYOACAiAADXDgAg9AUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhyQYBAL8MACEOAwAAog8AIAcAAKAPACANAACjDwAgEwAApA8AIBoAAKUPACAcAACmDwAgIgAApw8AIPQFAQAAAAH4BQEAAAAB-QUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAckGAQAAAAERAwAAmw4AIAcAAJMOACANAACUDgAgEQAAlQ4AICIAAJkOACAkAACWDgAgSgAAlw4AIEsAAJgOACD0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAECAAAAEAAgZQAA8RUAIAMAAAAQACBlAADxFQAgZgAA8BUAIAFeAADQGQAwAgAAABAAIF4AAPAVACACAAAA8RMAIF4AAO8VACAJ9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhEQMAAMoMACAHAADCDAAgDQAAwwwAIBEAAMQMACAiAADIDAAgJAAAxQwAIEoAAMYMACBLAADHDAAg9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhEQMAAJsOACAHAACTDgAgDQAAlA4AIBEAAJUOACAiAACZDgAgJAAAlg4AIEoAAJcOACBLAACYDgAg9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABDwcAAJwQACANAACZEAAgEQAAmhAAIBsAAM0QACAkAACbEAAgJgAAnhAAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdQGAgAAAAHVBgEAAAAB1gYBAAAAAQIAAAA3ACBlAAD6FQAgAwAAADcAIGUAAPoVACBmAAD5FQAgAV4AAM8ZADACAAAANwAgXgAA-RUAIAIAAADzDwAgXgAA-BUAIAn0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACHUBgIA9Q8AIdUGAQC_DAAh1gYBAMAMACEPBwAA-g8AIA0AAPcPACARAAD4DwAgGwAAzBAAICQAAPkPACAmAAD8DwAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIdMGAQDADAAh1AYCAPUPACHVBgEAvwwAIdYGAQDADAAhDwcAAJwQACANAACZEAAgEQAAmhAAIBsAAM0QACAkAACbEAAgJgAAnhAAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdQGAgAAAAHVBgEAAAAB1gYBAAAAAQ0HAACKEQAgCgAAjhQAIA0AAIwRACARAACNEQAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHfBgIAAAAB5QYBAAAAAawHAQAAAAGtBwEAAAABAgAAACMAIGUAAIMWACADAAAAIwAgZQAAgxYAIGYAAIIWACABXgAAzhkAMAIAAAAjACBeAACCFgAgAgAAAPAQACBeAACBFgAgCfQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHfBgIA9Q8AIeUGAQDADAAhrAcBAL8MACGtBwEAvwwAIQ0HAADzEAAgCgAAjBQAIA0AAPUQACARAAD2EAAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAId8GAgD1DwAh5QYBAMAMACGsBwEAvwwAIa0HAQC_DAAhDQcAAIoRACAKAACOFAAgDQAAjBEAIBEAAI0RACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAd8GAgAAAAHlBgEAAAABrAcBAAAAAa0HAQAAAAEIBwAAjhYAICUAAMgUACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAdMGAQAAAAECAAAAlwEAIGUAAI0WACADAAAAlwEAIGUAAI0WACBmAACLFgAgAV4AAM0ZADACAAAAlwEAIF4AAIsWACACAAAAuBQAIF4AAIoWACAG9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIdMGAQDADAAhCAcAAIwWACAlAAC8FAAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIdMGAQDADAAhBWUAAMgZACBmAADLGQAg2QcAAMkZACDaBwAAyhkAIN8HAAD5BAAgCAcAAI4WACAlAADIFAAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAABA2UAAMgZACDZBwAAyRkAIN8HAAD5BAAgDQcAAJARACANAACPEQAgDwAAjhEAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAAB0wYBAAAAAd0GAQAAAAHeBkAAAAAB3wYIAAAAAeAGCAAAAAECAAAAHwAgZQAAlxYAIAMAAAAfACBlAACXFgAgZgAAlhYAIAFeAADHGQAwAgAAAB8AIF4AAJYWACACAAAA0RQAIF4AAJUWACAK9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGlBgEAvwwAIdMGAQDADAAh3QYBAMAMACHeBkAA1wwAId8GCADwDAAh4AYIAPAMACENBwAA3RAAIA0AANwQACAPAADbEAAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACGlBgEAvwwAIdMGAQDADAAh3QYBAMAMACHeBkAA1wwAId8GCADwDAAh4AYIAPAMACENBwAAkBEAIA0AAI8RACAPAACOEQAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAaUGAQAAAAHTBgEAAAAB3QYBAAAAAd4GQAAAAAHfBggAAAAB4AYIAAAAARcMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJQAAnBYAICcAAKUWACAqAACoFgAgLgAAmRYAIC8AAJoWACAwAACbFgAgMQAAnRYAIDIAAJ4WACA0AAChFgAgNQAAohYAIDYAAKMWACA3AACkFgAgOAAAqRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAGWBwEAAAABqgcBAAAAAQRlAACPFgAw2QcAAJAWADDbBwAAkhYAIN8HAADNFAAwBGUAAIQWADDZBwAAhRYAMNsHAACHFgAg3wcAALQUADAEZQAA-xUAMNkHAAD8FQAw2wcAAP4VACDfBwAA7BAAMARlAADyFQAw2QcAAPMVADDbBwAA9RUAIN8HAADvDwAwBGUAAOkVADDZBwAA6hUAMNsHAADsFQAg3wcAAO0TADAEZQAA4BUAMNkHAADhFQAw2wcAAOMVACDfBwAA4RMAMARlAADXFQAw2QcAANgVADDbBwAA2hUAIN8HAADPDQAwBGUAAM4VADDZBwAAzxUAMNsHAADRFQAg3wcAALsNADAEZQAAxRUAMNkHAADGFQAw2wcAAMgVACDfBwAA_QwAMARlAAC8FQAw2QcAAL0VADDbBwAAvxUAIN8HAACUDQAwBGUAALMVADDZBwAAtBUAMNsHAAC2FQAg3wcAAKQNADAEZQAAqhUAMNkHAACrFQAw2wcAAK0VACDfBwAA6gwAMARlAAChFQAw2QcAAKIVADDbBwAApBUAIN8HAADLDwAwBGUAAJgVADDZBwAAmRUAMNsHAACbFQAg3wcAAOcOADAEZQAAjxUAMNkHAACQFQAw2wcAAJIVACDfBwAAoxAAMARlAACGFQAw2QcAAIcVADDbBwAAiRUAIN8HAAD4DQAwBGUAAP0UADDZBwAA_hQAMNsHAACAFQAg3wcAAM8MADAHOQAAqxYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAGWBwEAAAABqgcBAAAAAQRlAADhFAAw2QcAAOIUADDbBwAA5BQAIN8HAADlFAAwBGUAANUUADDZBwAA1hQAMNsHAADYFAAg3wcAANkUADAEZQAAyRQAMNkHAADKFAAw2wcAAMwUACDfBwAAzRQAMARlAACwFAAw2QcAALEUADDbBwAAsxQAIN8HAAC0FAAwBGUAAJgUADDZBwAAmRQAMNsHAACbFAAg3wcAAJwUADAEZQAAjxQAMNkHAACQFAAw2wcAAJIUACDfBwAA7w8AMARlAACEFAAw2QcAAIUUADDbBwAAhxQAIN8HAADsEAAwBGUAAPUTADDZBwAA9hMAMNsHAAD4EwAg3wcAAPkTADAEZQAA6RMAMNkHAADqEwAw2wcAAOwTACDfBwAA7RMAMARlAADdEwAw2QcAAN4TADDbBwAA4BMAIN8HAADhEwAwBGUAANQTADDZBwAA1RMAMNsHAADXEwAg3wcAAM8NADAEZQAAyxMAMNkHAADMEwAw2wcAAM4TACDfBwAAuw0AMARlAAC_EwAw2QcAAMATADDbBwAAwhMAIN8HAADDEwAwBGUAALYTADDZBwAAtxMAMNsHAAC5EwAg3wcAAP0MADAEZQAArRMAMNkHAACuEwAw2wcAALATACDfBwAAlA0AMARlAACkEwAw2QcAAKUTADDbBwAApxMAIN8HAACkDQAwBGUAAJsTADDZBwAAnBMAMNsHAACeEwAg3wcAAOoMADAEZQAAkhMAMNkHAACTEwAw2wcAAJUTACDfBwAAyw8AMARlAACJEwAw2QcAAIoTADDbBwAAjBMAIN8HAADnDgAwA2UAAIQTACDZBwAAhRMAIN8HAADPBgAgBGUAAPsSADDZBwAA_BIAMNsHAAD-EgAg3wcAAJYSADAEZQAA8hIAMNkHAADzEgAw2wcAAPUSACDfBwAAoxAAMARlAADpEgAw2QcAAOoSADDbBwAA7BIAIN8HAAD4DQAwBGUAAN0SADDZBwAA3hIAMNsHAADgEgAg3wcAAOESADAEZQAA0RIAMNkHAADSEgAw2wcAANQSACDfBwAA1RIAMARlAADIEgAw2QcAAMkSADDbBwAAyxIAIN8HAADPDAAwBGUAAL8SADDZBwAAwBIAMNsHAADCEgAg3wcAAM8MADAAAAAAAAAAAAAAAAAAAgcAALkRACDuBgAAuwwAIAAAAAAAAAAAB2UAAMIZACBmAADFGQAg2QcAAMMZACDaBwAAxBkAIN0HAAAWACDeBwAAFgAg3wcAAPkEACADZQAAwhkAINkHAADDGQAg3wcAAPkEACAAAAAHZQAAvRkAIGYAAMAZACDZBwAAvhkAINoHAAC_GQAg3QcAABIAIN4HAAASACDfBwAAFAAgA2UAAL0ZACDZBwAAvhkAIN8HAAAUACAAAAAAAAAAAAAAAAAABWUAALgZACBmAAC7GQAg2QcAALkZACDaBwAAuhkAIN8HAAD5BAAgA2UAALgZACDZBwAAuRkAIN8HAAD5BAAgAAAAAAAABWUAALMZACBmAAC2GQAg2QcAALQZACDaBwAAtRkAIN8HAAD2AgAgA2UAALMZACDZBwAAtBkAIN8HAAD2AgAgAAAAAAAABWUAAK4ZACBmAACxGQAg2QcAAK8ZACDaBwAAsBkAIN8HAAD2AgAgA2UAAK4ZACDZBwAArxkAIN8HAAD2AgAgAAAABWUAAKkZACBmAACsGQAg2QcAAKoZACDaBwAAqxkAIN8HAAD2AgAgA2UAAKkZACDZBwAAqhkAIN8HAAD2AgAgAAAAC2UAAMkYADBmAADOGAAw2QcAAMoYADDaBwAAyxgAMNsHAADMGAAg3AcAAM0YADDdBwAAzRgAMN4HAADNGAAw3wcAAM0YADDgBwAAzxgAMOEHAADQGAAwC2UAAL0YADBmAADCGAAw2QcAAL4YADDaBwAAvxgAMNsHAADAGAAg3AcAAMEYADDdBwAAwRgAMN4HAADBGAAw3wcAAMEYADDgBwAAwxgAMOEHAADEGAAwC2UAALIYADBmAAC2GAAw2QcAALMYADDaBwAAtBgAMNsHAAC1GAAg3AcAAPkTADDdBwAA-RMAMN4HAAD5EwAw3wcAAPkTADDgBwAAtxgAMOEHAAD8EwAwC2UAAKkYADBmAACtGAAw2QcAAKoYADDaBwAAqxgAMNsHAACsGAAg3AcAAO0TADDdBwAA7RMAMN4HAADtEwAw3wcAAO0TADDgBwAArhgAMOEHAADwEwAwC2UAAKAYADBmAACkGAAw2QcAAKEYADDaBwAAohgAMNsHAACjGAAg3AcAAOETADDdBwAA4RMAMN4HAADhEwAw3wcAAOETADDgBwAApRgAMOEHAADkEwAwC2UAAJcYADBmAACbGAAw2QcAAJgYADDaBwAAmRgAMNsHAACaGAAg3AcAAMMTADDdBwAAwxMAMN4HAADDEwAw3wcAAMMTADDgBwAAnBgAMOEHAADGEwAwC2UAAI4YADBmAACSGAAw2QcAAI8YADDaBwAAkBgAMNsHAACRGAAg3AcAAMMTADDdBwAAwxMAMN4HAADDEwAw3wcAAMMTADDgBwAAkxgAMOEHAADGEwAwC2UAAIUYADBmAACJGAAw2QcAAIYYADDaBwAAhxgAMNsHAACIGAAg3AcAAP0MADDdBwAA_QwAMN4HAAD9DAAw3wcAAP0MADDgBwAAihgAMOEHAACADQAwC2UAAPwXADBmAACAGAAw2QcAAP0XADDaBwAA_hcAMNsHAAD_FwAg3AcAAP0MADDdBwAA_QwAMN4HAAD9DAAw3wcAAP0MADDgBwAAgRgAMOEHAACADQAwB2UAAPcXACBmAAD6FwAg2QcAAPgXACDaBwAA-RcAIN0HAACpAgAg3gcAAKkCACDfBwAA9QkAIAtlAADuFwAwZgAA8hcAMNkHAADvFwAw2gcAAPAXADDbBwAA8RcAINwHAAD9DgAw3QcAAP0OADDeBwAA_Q4AMN8HAAD9DgAw4AcAAPMXADDhBwAAgA8AMAtlAADlFwAwZgAA6RcAMNkHAADmFwAw2gcAAOcXADDbBwAA6BcAINwHAAD9DgAw3QcAAP0OADDeBwAA_Q4AMN8HAAD9DgAw4AcAAOoXADDhBwAAgA8AMAdlAADgFwAgZgAA4xcAINkHAADhFwAg2gcAAOIXACDdBwAArQIAIN4HAACtAgAg3wcAAJcIACALZQAA1BcAMGYAANkXADDZBwAA1RcAMNoHAADWFwAw2wcAANcXACDcBwAA2BcAMN0HAADYFwAw3gcAANgXADDfBwAA2BcAMOAHAADaFwAw4QcAANsXADALZQAAyxcAMGYAAM8XADDZBwAAzBcAMNoHAADNFwAw2wcAAM4XACDcBwAAzwwAMN0HAADPDAAw3gcAAM8MADDfBwAAzwwAMOAHAADQFwAw4QcAANIMADALZQAAwhcAMGYAAMYXADDZBwAAwxcAMNoHAADEFwAw2wcAAMUXACDcBwAAzwwAMN0HAADPDAAw3gcAAM8MADDfBwAAzwwAMOAHAADHFwAw4QcAANIMADALZQAAuRcAMGYAAL0XADDZBwAAuhcAMNoHAAC7FwAw2wcAALwXACDcBwAA1RIAMN0HAADVEgAw3gcAANUSADDfBwAA1RIAMOAHAAC-FwAw4QcAANgSADALZQAAsBcAMGYAALQXADDZBwAAsRcAMNoHAACyFwAw2wcAALMXACDcBwAA1RIAMN0HAADVEgAw3gcAANUSADDfBwAA1RIAMOAHAAC1FwAw4QcAANgSADALZQAApxcAMGYAAKsXADDZBwAAqBcAMNoHAACpFwAw2wcAAKoXACDcBwAA4RIAMN0HAADhEgAw3gcAAOESADDfBwAA4RIAMOAHAACsFwAw4QcAAOQSADALZQAAnhcAMGYAAKIXADDZBwAAnxcAMNoHAACgFwAw2wcAAKEXACDcBwAA3hEAMN0HAADeEQAw3gcAAN4RADDfBwAA3hEAMOAHAACjFwAw4QcAAOERADAEQwAAyxEAIPQFAQAAAAH_BgEAAAABgAdAAAAAAQIAAAD0AQAgZQAAphcAIAMAAAD0AQAgZQAAphcAIGYAAKUXACABXgAAqBkAMAIAAAD0AQAgXgAApRcAIAIAAADiEQAgXgAApBcAIAP0BQEAvwwAIf8GAQC_DAAhgAdAAMEMACEEQwAAyREAIPQFAQC_DAAh_wYBAL8MACGAB0AAwQwAIQRDAADLEQAg9AUBAAAAAf8GAQAAAAGAB0AAAAABCgcAAPIRACBEAAD0EQAgRQAA9REAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAABpgYBAAAAAYQHAAAAggcCAgAAAOwBACBlAACvFwAgAwAAAOwBACBlAACvFwAgZgAArhcAIAFeAACnGQAwAgAAAOwBACBeAACuFwAgAgAAAOUSACBeAACtFwAgB_QFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACGmBgEAvwwAIYQHAADQEYIHIgoHAADWEQAgRAAA2BEAIEUAANkRACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAhpgYBAL8MACGEBwAA0BGCByIKBwAA8hEAIEQAAPQRACBFAAD1EQAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAaUGAQAAAAGmBgEAAAABhAcAAACCBwILBwAAghIAICAAAIESACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAACSBwKuBkAAAAABigcBAAAAAZAHAAAAkAcCkgcBAAAAAQIAAAD6AQAgZQAAuBcAIAMAAAD6AQAgZQAAuBcAIGYAALcXACABXgAAphkAMAIAAAD6AQAgXgAAtxcAIAIAAADZEgAgXgAAthcAIAn0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIawGAAD9EZIHIq4GQADXDAAhigcBAL8MACGQBwAA_BGQByKSBwEAwAwAIQsHAAD_EQAgIAAA_hEAIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAP0RkgcirgZAANcMACGKBwEAvwwAIZAHAAD8EZAHIpIHAQDADAAhCwcAAIISACAgAACBEgAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAkgcCrgZAAAAAAYoHAQAAAAGQBwAAAJAHApIHAQAAAAELBwAAghIAID0AAIMSACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAACSBwKuBkAAAAABkAcAAACQBwKSBwEAAAABkwcBAAAAAQIAAAD6AQAgZQAAwRcAIAMAAAD6AQAgZQAAwRcAIGYAAMAXACABXgAApRkAMAIAAAD6AQAgXgAAwBcAIAIAAADZEgAgXgAAvxcAIAn0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIawGAAD9EZIHIq4GQADXDAAhkAcAAPwRkAcikgcBAMAMACGTBwEAwAwAIQsHAAD_EQAgPQAAgBIAIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhrAYAAP0RkgcirgZAANcMACGQBwAA_BGQByKSBwEAwAwAIZMHAQDADAAhCwcAAIISACA9AACDEgAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAkgcCrgZAAAAAAZAHAAAAkAcCkgcBAAAAAZMHAQAAAAEVEAAA4g4AIBkAAOQMACAeAADgDAAgHwAA4QwAICAAAOIMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGGBwAAAIYHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAECAAAAXQAgZQAAyhcAIAMAAABdACBlAADKFwAgZgAAyRcAIAFeAACkGQAwAgAAAF0AIF4AAMkXACACAAAA0wwAIF4AAMgXACAP9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhhgcAANUMhgciiAcBAL8MACGJBwEAvwwAIYoHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEVEAAA4A4AIBkAAN0MACAeAADZDAAgHwAA2gwAICAAANsMACAhAADeDAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhhgcAANUMhgciiAcBAL8MACGJBwEAvwwAIYoHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEVEAAA4g4AIBkAAOQMACAeAADgDAAgHwAA4QwAICAAAOIMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGGBwAAAIYHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAEVEAAA4g4AIBgAAOMMACAZAADkDAAgHgAA4AwAIB8AAOEMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAECAAAAXQAgZQAA0xcAIAMAAABdACBlAADTFwAgZgAA0hcAIAFeAACjGQAwAgAAAF0AIF4AANIXACACAAAA0wwAIF4AANEXACAP9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKIBwEAvwwAIYkHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEVEAAA4A4AIBgAANwMACAZAADdDAAgHgAA2QwAIB8AANoMACAhAADeDAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhngYBAMAMACGgBgEAwAwAIawGAADWDIgHIq4GQADXDAAhsQYBAMAMACGGBwAA1QyGByKIBwEAvwwAIYkHAQC_DAAhiwcBAMAMACGMBwEAwAwAIY0HAQDADAAhjgdAAMEMACEVEAAA4g4AIBgAAOMMACAZAADkDAAgHgAA4AwAIB8AAOEMACAhAADlDAAg9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAEF9AUBAAAAAfwFQAAAAAH9BUAAAAABswcBAAAAAbQHQAAAAAECAAAAsQIAIGUAAN8XACADAAAAsQIAIGUAAN8XACBmAADeFwAgAV4AAKIZADAKAwAAvAoAIPEFAADdCwAw8gUAAK8CABDzBQAA3QsAMPQFAQAAAAH7BQEAAAAB_AVAALsKACH9BUAAuwoAIbMHAQC3CgAhtAdAALsKACECAAAAsQIAIF4AAN4XACACAAAA3BcAIF4AAN0XACAJ8QUAANsXADDyBQAA3BcAEPMFAADbFwAw9AUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACGzBwEAtwoAIbQHQAC7CgAhCfEFAADbFwAw8gUAANwXABDzBQAA2xcAMPQFAQC3CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhswcBALcKACG0B0AAuwoAIQX0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGzBwEAvwwAIbQHQADBDAAhBfQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIbMHAQC_DAAhtAdAAMEMACEF9AUBAAAAAfwFQAAAAAH9BUAAAAABswcBAAAAAbQHQAAAAAEI9AUBAAAAAfwFQAAAAAH9BUAAAAABigYBAAAAAYsGAQAAAAGQBoAAAAABkgYgAAAAAcwGAACyDwAgAgAAAJcIACBlAADgFwAgAwAAAK0CACBlAADgFwAgZgAA5BcAIAoAAACtAgAgXgAA5BcAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIYoGAQC_DAAhiwYBAL8MACGQBoAAAAABkgYgAKEOACHMBgAAsA8AIAj0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGKBgEAvwwAIYsGAQC_DAAhkAaAAAAAAZIGIAChDgAhzAYAALAPACAOFgAAiQ8AIBcAAIoPACAZAACsDwAg9AUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAaoGAQAAAAGsBgAAAMsGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAHLBgEAAAABAgAAAE0AIGUAAO0XACADAAAATQAgZQAA7RcAIGYAAOwXACABXgAAoRkAMAIAAABNACBeAADsFwAgAgAAAIEPACBeAADrFwAgC_QFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaAGAQDADAAhqgYBAMAMACGsBgAAgw_LBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIcsGAQC_DAAhDhYAAIUPACAXAACGDwAgGQAAqw8AIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaAGAQDADAAhqgYBAMAMACGsBgAAgw_LBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIcsGAQC_DAAhDhYAAIkPACAXAACKDwAgGQAArA8AIPQFAQAAAAH8BUAAAAAB_QVAAAAAAaAGAQAAAAGqBgEAAAABrAYAAADLBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGwBgEAAAABywYBAAAAAQ4WAACJDwAgGAAAiw8AIBkAAKwPACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABqgYBAAAAAawGAAAAywYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAECAAAATQAgZQAA9hcAIAMAAABNACBlAAD2FwAgZgAA9RcAIAFeAACgGQAwAgAAAE0AIF4AAPUXACACAAAAgQ8AIF4AAPQXACAL9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhoAYBAMAMACGqBgEAwAwAIawGAACDD8sGIq0GAQDADAAhrgZAANcMACGvBkAAwQwAIbAGAQC_DAAhsQYBAMAMACEOFgAAhQ8AIBgAAIcPACAZAACrDwAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhoAYBAMAMACGqBgEAwAwAIawGAACDD8sGIq0GAQDADAAhrgZAANcMACGvBkAAwQwAIbAGAQC_DAAhsQYBAMAMACEOFgAAiQ8AIBgAAIsPACAZAACsDwAg9AUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAaoGAQAAAAGsBgAAAMsGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABDPQFAQAAAAH8BUAAAAAB_QVAAAAAAYoGAQAAAAGLBgEAAAABjAYBAAAAAY0GAQAAAAGOBgAAow4AII8GAACkDgAgkAaAAAAAAZEGgAAAAAGSBiAAAAABAgAAAPUJACBlAAD3FwAgAwAAAKkCACBlAAD3FwAgZgAA-xcAIA4AAACpAgAgXgAA-xcAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIYoGAQC_DAAhiwYBAL8MACGMBgEAvwwAIY0GAQDADAAhjgYAAJ8OACCPBgAAoA4AIJAGgAAAAAGRBoAAAAABkgYgAKEOACEM9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhigYBAL8MACGLBgEAvwwAIYwGAQC_DAAhjQYBAMAMACGOBgAAnw4AII8GAACgDgAgkAaAAAAAAZEGgAAAAAGSBiAAoQ4AIRIHAACODQAgCQAAjw0AIBAAALoOACAWAACLDQAgMwAAjA0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABiQYBAAAAAZ4GAQAAAAGqBgEAAAABrAYAAACsBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGwBgEAAAABAgAAAKMBACBlAACEGAAgAwAAAKMBACBlAACEGAAgZgAAgxgAIAFeAACfGQAwAgAAAKMBACBeAACDGAAgAgAAAIENACBeAACCGAAgDfQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIZ4GAQDADAAhqgYBAMAMACGsBgAAgw2sBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIRIHAACIDQAgCQAAiQ0AIBAAALkOACAWAACFDQAgMwAAhg0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGJBgEAvwwAIZ4GAQDADAAhqgYBAMAMACGsBgAAgw2sBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIRIHAACODQAgCQAAjw0AIBAAALoOACAWAACLDQAgMwAAjA0AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABiQYBAAAAAZ4GAQAAAAGqBgEAAAABrAYAAACsBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGwBgEAAAABEgcAAI4NACAJAACPDQAgEAAAug4AIBYAAIsNACAYAACNDQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGeBgEAAAABqgYBAAAAAawGAAAArAYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAECAAAAowEAIGUAAI0YACADAAAAowEAIGUAAI0YACBmAACMGAAgAV4AAJ4ZADACAAAAowEAIF4AAIwYACACAAAAgQ0AIF4AAIsYACAN9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZ4GAQDADAAhqgYBAMAMACGsBgAAgw2sBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIbEGAQDADAAhEgcAAIgNACAJAACJDQAgEAAAuQ4AIBYAAIUNACAYAACHDQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZ4GAQDADAAhqgYBAMAMACGsBgAAgw2sBiKtBgEAwAwAIa4GQADXDAAhrwZAAMEMACGwBgEAvwwAIbEGAQDADAAhEgcAAI4NACAJAACPDQAgEAAAug4AIBYAAIsNACAYAACNDQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGeBgEAAAABqgYBAAAAAawGAAAArAYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAEdBwAAoBIAIDwAAJ4SACA_AAChEgAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAqQcCrgZAAAAAAdMGAQAAAAGUBwEAAAABlQcBAAAAAZYHAQAAAAGYBwAAAJgHA5kHAQAAAAGaBwAAAMIGA5sHEAAAAAGcBwEAAAABnQcCAAAAAZ8HAAAAnwcCoAcBAAAAAaEHAQAAAAGiBwEAAAABowcBAAAAAaQHAQAAAAGlBwEAAAABpgeAAAAAAacHQAAAAAGpBwEAAAABAgAAANUBACBlAACWGAAgAwAAANUBACBlAACWGAAgZgAAlRgAIAFeAACdGQAwAgAAANUBACBeAACVGAAgAgAAAMcTACBeAACUGAAgGvQFAQC_DAAh-QUBAMAMACH8BUAAwQwAIf0FQADBDAAhrAYAAI0SqQcirgZAANcMACHTBgEAwAwAIZQHAQC_DAAhlQcBAL8MACGWBwEAwAwAIZgHAACJEpgHI5kHAQDADAAhmgcAAIoSwgYjmwcQAIsSACGcBwEAvwwAIZ0HAgD1DwAhnwcAAIwSnwcioAcBAMAMACGhBwEAwAwAIaIHAQDADAAhowcBAMAMACGkBwEAwAwAIaUHAQDADAAhpgeAAAAAAacHQADXDAAhqQcBAMAMACEdBwAAkBIAIDwAAI4SACA_AACREgAg9AUBAL8MACH5BQEAwAwAIfwFQADBDAAh_QVAAMEMACGsBgAAjRKpByKuBkAA1wwAIdMGAQDADAAhlAcBAL8MACGVBwEAvwwAIZYHAQDADAAhmAcAAIkSmAcjmQcBAMAMACGaBwAAihLCBiObBxAAixIAIZwHAQC_DAAhnQcCAPUPACGfBwAAjBKfByKgBwEAwAwAIaEHAQDADAAhogcBAMAMACGjBwEAwAwAIaQHAQDADAAhpQcBAMAMACGmB4AAAAABpwdAANcMACGpBwEAwAwAIR0HAACgEgAgPAAAnhIAID8AAKESACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAACpBwKuBkAAAAAB0wYBAAAAAZQHAQAAAAGVBwEAAAABlgcBAAAAAZgHAAAAmAcDmQcBAAAAAZoHAAAAwgYDmwcQAAAAAZwHAQAAAAGdBwIAAAABnwcAAACfBwKgBwEAAAABoQcBAAAAAaIHAQAAAAGjBwEAAAABpAcBAAAAAaUHAQAAAAGmB4AAAAABpwdAAAAAAakHAQAAAAEdBwAAoBIAID0AAJ8SACA_AAChEgAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAqQcCrgZAAAAAAdMGAQAAAAGTBwEAAAABlQcBAAAAAZYHAQAAAAGYBwAAAJgHA5kHAQAAAAGaBwAAAMIGA5sHEAAAAAGcBwEAAAABnQcCAAAAAZ8HAAAAnwcCoAcBAAAAAaEHAQAAAAGiBwEAAAABowcBAAAAAaQHAQAAAAGlBwEAAAABpgeAAAAAAacHQAAAAAGpBwEAAAABAgAAANUBACBlAACfGAAgAwAAANUBACBlAACfGAAgZgAAnhgAIAFeAACcGQAwAgAAANUBACBeAACeGAAgAgAAAMcTACBeAACdGAAgGvQFAQC_DAAh-QUBAMAMACH8BUAAwQwAIf0FQADBDAAhrAYAAI0SqQcirgZAANcMACHTBgEAwAwAIZMHAQDADAAhlQcBAL8MACGWBwEAwAwAIZgHAACJEpgHI5kHAQDADAAhmgcAAIoSwgYjmwcQAIsSACGcBwEAvwwAIZ0HAgD1DwAhnwcAAIwSnwcioAcBAMAMACGhBwEAwAwAIaIHAQDADAAhowcBAMAMACGkBwEAwAwAIaUHAQDADAAhpgeAAAAAAacHQADXDAAhqQcBAMAMACEdBwAAkBIAID0AAI8SACA_AACREgAg9AUBAL8MACH5BQEAwAwAIfwFQADBDAAh_QVAAMEMACGsBgAAjRKpByKuBkAA1wwAIdMGAQDADAAhkwcBAMAMACGVBwEAvwwAIZYHAQDADAAhmAcAAIkSmAcjmQcBAMAMACGaBwAAihLCBiObBxAAixIAIZwHAQC_DAAhnQcCAPUPACGfBwAAjBKfByKgBwEAwAwAIaEHAQDADAAhogcBAMAMACGjBwEAwAwAIaQHAQDADAAhpQcBAMAMACGmB4AAAAABpwdAANcMACGpBwEAwAwAIR0HAACgEgAgPQAAnxIAID8AAKESACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAACpBwKuBkAAAAAB0wYBAAAAAZMHAQAAAAGVBwEAAAABlgcBAAAAAZgHAAAAmAcDmQcBAAAAAZoHAAAAwgYDmwcQAAAAAZwHAQAAAAGdBwIAAAABnwcAAACfBwKgBwEAAAABoQcBAAAAAaIHAQAAAAGjBwEAAAABpAcBAAAAAaUHAQAAAAGmB4AAAAABpwdAAAAAAakHAQAAAAEOBwAAoA8AIAkAAKEPACANAACjDwAgEwAApA8AIBoAAKUPACAcAACmDwAgIgAApw8AIPQFAQAAAAH4BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAckGAQAAAAECAAAAnQEAIGUAAKgYACADAAAAnQEAIGUAAKgYACBmAACnGAAgAV4AAJsZADACAAAAnQEAIF4AAKcYACACAAAA5RMAIF4AAKYYACAH9AUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhyQYBAL8MACEOBwAA0A4AIAkAANEOACANAADTDgAgEwAA1A4AIBoAANUOACAcAADWDgAgIgAA1w4AIPQFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIckGAQC_DAAhDgcAAKAPACAJAAChDwAgDQAAow8AIBMAAKQPACAaAAClDwAgHAAApg8AICIAAKcPACD0BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHJBgEAAAABEQcAAJMOACAJAACaDgAgDQAAlA4AIBEAAJUOACAiAACZDgAgJAAAlg4AIEoAAJcOACBLAACYDgAg9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABAgAAABAAIGUAALEYACADAAAAEAAgZQAAsRgAIGYAALAYACABXgAAmhkAMAIAAAAQACBeAACwGAAgAgAAAPETACBeAACvGAAgCfQFAQC_DAAh9QUBAL8MACH2BQEAvwwAIfcFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIREHAADCDAAgCQAAyQwAIA0AAMMMACARAADEDAAgIgAAyAwAICQAAMUMACBKAADGDAAgSwAAxwwAIPQFAQC_DAAh9QUBAL8MACH2BQEAvwwAIfcFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIREHAACTDgAgCQAAmg4AIA0AAJQOACARAACVDgAgIgAAmQ4AICQAAJYOACBKAACXDgAgSwAAmA4AIPQFAQAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAQYHAAC8GAAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAYIHAAAAzwcCAgAAAAEAIGUAALsYACADAAAAAQAgZQAAuxgAIGYAALkYACABXgAAmRkAMAIAAAABACBeAAC5GAAgAgAAAP0TACBeAAC4GAAgBfQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhggcAAP8TzwciBgcAALoYACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIYIHAAD_E88HIgVlAACUGQAgZgAAlxkAINkHAACVGQAg2gcAAJYZACDfBwAA-QQAIAYHAAC8GAAg9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAYIHAAAAzwcCA2UAAJQZACDZBwAAlRkAIN8HAAD5BAAgDPQFAQAAAAH8BUAAAAAB_QVAAAAAAbcHAQAAAAG4BwEAAAABuQcBAAAAAboHAQAAAAG7BwEAAAABvAdAAAAAAb0HQAAAAAG-BwEAAAABvwcBAAAAAQIAAAAJACBlAADIGAAgAwAAAAkAIGUAAMgYACBmAADHGAAgAV4AAJMZADARAwAAvAoAIPEFAAC5DAAw8gUAAAcAEPMFAAC5DAAw9AUBAAAAAfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIbcHAQC3CgAhuAcBALcKACG5BwEAuAoAIboHAQC4CgAhuwcBALgKACG8B0AA4QsAIb0HQADhCwAhvgcBALgKACG_BwEAuAoAIQIAAAAJACBeAADHGAAgAgAAAMUYACBeAADGGAAgEPEFAADEGAAw8gUAAMUYABDzBQAAxBgAMPQFAQC3CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhtwcBALcKACG4BwEAtwoAIbkHAQC4CgAhugcBALgKACG7BwEAuAoAIbwHQADhCwAhvQdAAOELACG-BwEAuAoAIb8HAQC4CgAhEPEFAADEGAAw8gUAAMUYABDzBQAAxBgAMPQFAQC3CgAh-wUBALcKACH8BUAAuwoAIf0FQAC7CgAhtwcBALcKACG4BwEAtwoAIbkHAQC4CgAhugcBALgKACG7BwEAuAoAIbwHQADhCwAhvQdAAOELACG-BwEAuAoAIb8HAQC4CgAhDPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIbcHAQC_DAAhuAcBAL8MACG5BwEAwAwAIboHAQDADAAhuwcBAMAMACG8B0AA1wwAIb0HQADXDAAhvgcBAMAMACG_BwEAwAwAIQz0BQEAvwwAIfwFQADBDAAh_QVAAMEMACG3BwEAvwwAIbgHAQC_DAAhuQcBAMAMACG6BwEAwAwAIbsHAQDADAAhvAdAANcMACG9B0AA1wwAIb4HAQDADAAhvwcBAMAMACEM9AUBAAAAAfwFQAAAAAH9BUAAAAABtwcBAAAAAbgHAQAAAAG5BwEAAAABugcBAAAAAbsHAQAAAAG8B0AAAAABvQdAAAAAAb4HAQAAAAG_BwEAAAABB_QFAQAAAAH8BUAAAAAB_QVAAAAAAbQHQAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAECAAAABQAgZQAA1BgAIAMAAAAFACBlAADUGAAgZgAA0xgAIAFeAACSGQAwDAMAALwKACDxBQAAugwAMPIFAAADABDzBQAAugwAMPQFAQAAAAH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACG0B0AAuwoAIcAHAQAAAAHBBwEAuAoAIcIHAQC4CgAhAgAAAAUAIF4AANMYACACAAAA0RgAIF4AANIYACAL8QUAANAYADDyBQAA0RgAEPMFAADQGAAw9AUBALcKACH7BQEAtwoAIfwFQAC7CgAh_QVAALsKACG0B0AAuwoAIcAHAQC3CgAhwQcBALgKACHCBwEAuAoAIQvxBQAA0BgAMPIFAADRGAAQ8wUAANAYADD0BQEAtwoAIfsFAQC3CgAh_AVAALsKACH9BUAAuwoAIbQHQAC7CgAhwAcBALcKACHBBwEAuAoAIcIHAQC4CgAhB_QFAQC_DAAh_AVAAMEMACH9BUAAwQwAIbQHQADBDAAhwAcBAL8MACHBBwEAwAwAIcIHAQDADAAhB_QFAQC_DAAh_AVAAMEMACH9BUAAwQwAIbQHQADBDAAhwAcBAL8MACHBBwEAwAwAIcIHAQDADAAhB_QFAQAAAAH8BUAAAAAB_QVAAAAAAbQHQAAAAAHABwEAAAABwQcBAAAAAcIHAQAAAAEEZQAAyRgAMNkHAADKGAAw2wcAAMwYACDfBwAAzRgAMARlAAC9GAAw2QcAAL4YADDbBwAAwBgAIN8HAADBGAAwBGUAALIYADDZBwAAsxgAMNsHAAC1GAAg3wcAAPkTADAEZQAAqRgAMNkHAACqGAAw2wcAAKwYACDfBwAA7RMAMARlAACgGAAw2QcAAKEYADDbBwAAoxgAIN8HAADhEwAwBGUAAJcYADDZBwAAmBgAMNsHAACaGAAg3wcAAMMTADAEZQAAjhgAMNkHAACPGAAw2wcAAJEYACDfBwAAwxMAMARlAACFGAAw2QcAAIYYADDbBwAAiBgAIN8HAAD9DAAwBGUAAPwXADDZBwAA_RcAMNsHAAD_FwAg3wcAAP0MADADZQAA9xcAINkHAAD4FwAg3wcAAPUJACAEZQAA7hcAMNkHAADvFwAw2wcAAPEXACDfBwAA_Q4AMARlAADlFwAw2QcAAOYXADDbBwAA6BcAIN8HAAD9DgAwA2UAAOAXACDZBwAA4RcAIN8HAACXCAAgBGUAANQXADDZBwAA1RcAMNsHAADXFwAg3wcAANgXADAEZQAAyxcAMNkHAADMFwAw2wcAAM4XACDfBwAAzwwAMARlAADCFwAw2QcAAMMXADDbBwAAxRcAIN8HAADPDAAwBGUAALkXADDZBwAAuhcAMNsHAAC8FwAg3wcAANUSADAEZQAAsBcAMNkHAACxFwAw2wcAALMXACDfBwAA1RIAMARlAACnFwAw2QcAAKgXADDbBwAAqhcAIN8HAADhEgAwBGUAAJ4XADDZBwAAnxcAMNsHAAChFwAg3wcAAN4RADAAAAIzAACmDgAgjQYAALsMACABFwAApg4AIAAAAAAABWUAAI0ZACBmAACQGQAg2QcAAI4ZACDaBwAAjxkAIN8HAAAoACADZQAAjRkAINkHAACOGQAg3wcAACgAIAAAAAQHAAC5EQAgQgAApg4AIEQAAPgYACBFAADuGAAgABcHAAC5EQAgPAAApg4AID0AAKYOACA_AADUFgAg-QUAALsMACCuBgAAuwwAINMGAAC7DAAgkwcAALsMACCWBwAAuwwAIJgHAAC7DAAgmQcAALsMACCaBwAAuwwAIJsHAAC7DAAgnQcAALsMACCgBwAAuwwAIKEHAAC7DAAgogcAALsMACCjBwAAuwwAIKQHAAC7DAAgpQcAALsMACCmBwAAuwwAIKcHAAC7DAAgqQcAALsMACANBwAAuREAIAkAAPwYACAKAACKGQAgCwAA1RYAIA4AAIMZACAPAACEGQAgEAAA-xgAIBkAAP8YACAbAAD-GAAgLAAAiBkAIC0AAIkZACD6BQAAuwwAIOUGAAC7DAAgCgMAAKYOACAHAAC5EQAgCQAA_BgAIA0AAMQQACARAADOFgAgIgAA2BYAICQAANAWACBKAACzEQAgSwAA0hYAIPgFAAC7DAAgFQgAAIsZACAMAADCEAAgDQAAxBAAIBEAAM4WACAcAADGEAAgJQAAwxAAICcAAMUQACAqAADVFgAgLgAAxxYAIC8AAMgWACAwAADKFgAgMQAAzBYAIDIAAM0WACA0AACzEQAgNQAA0BYAIDYAANEWACA3AADSFgAgOAAA2BYAINMGAAC7DAAg5AYAALsMACCWBwAAuwwAIAUUAACzEQAg-gUAALsMACDhBgAAuwwAIOQGAAC7DAAg5QYAALsMACAFDAAAwhAAIA0AAMQQACAcAADGEAAgJQAAwxAAICcAAMUQACAKAwAApg4AIAcAALkRACAJAAD8GAAgDQAAxBAAIBMAANEWACAaAACiEQAgHAAAxhAAICIAANgWACD4BQAAuwwAIPoFAAC7DAAgBAcAALkRACAJAAD8GAAgGwAA_hgAIBwAAMYQACAFFAAAohEAIPoFAAC7DAAg4QYAALsMACDkBgAAuwwAIOUGAAC7DAAgCAcAALkRACAJAAD8GAAgDgAAgxkAIBAAAPsYACAjAADRFgAg-gUAALsMACCmBgAAuwwAIKkGAAC7DAAgCwcAALkRACAJAAD8GAAgDQAAxBAAIBEAAM4WACAbAAD-GAAgJAAA0BYAICYAAIUZACD6BQAAuwwAINMGAAC7DAAg1AYAALsMACDWBgAAuwwAIAgHAAC5EQAgCQAA_BgAIAoAAIoZACANAADEEAAgEQAAzhYAINMGAAC7DAAg3wYAALsMACDlBgAAuwwAIAUHAAC5EQAgCQAA_BgAICUAAMMQACD6BQAAuwwAINMGAAC7DAAgCAcAALkRACAJAAD8GAAgCwAA1RYAIBsAAP4YACD5BQAAuwwAIPoFAAC7DAAg0wYAALsMACDVBgAAuwwAIAMHAAC5EQAgKgAA1RYAIM0GAAC7DAAgABIHAAC5EQAgCQAA_BgAIBAAAPsYACApAAD6GAAg-gUAALsMACCzBgAAuwwAILQGAAC7DAAgtQYAALsMACC2BgAAuwwAILcGAAC7DAAguAYAALsMACC5BgAAuwwAILoGAAC7DAAguwYAALsMACC8BgAAuwwAIL0GAAC7DAAgvgYAALsMACC_BgAAuwwAIAkHAAC5EQAgCQAA_BgAIA0AAMQQACAPAADKFgAg0wYAALsMACDdBgAAuwwAIN4GAAC7DAAg3wYAALsMACDgBgAAuwwAIAUHAAC5EQAgOQAAjBkAIPkFAAC7DAAg0wYAALsMACCWBwAAuwwAIAAWBwAAkg4AIAkAAI8OACAKAACQDgAgCwAAiQ4AIA4AAI4OACAPAACMDgAgEAAAnw8AIBkAAI0OACAbAACRDgAgLQAAiw4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQIAAAAoACBlAACNGQAgAwAAACYAIGUAAI0ZACBmAACRGQAgGAAAACYAIAcAAN8NACAJAADcDQAgCgAA3Q0AIAsAANYNACAOAADbDQAgDwAA2Q0AIBAAAJ0PACAZAADaDQAgGwAA3g0AIC0AANgNACBeAACRGQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhnQYBAL8MACGeBgEAvwwAIaAGAQC_DAAh1QYBAL8MACHlBgEAwAwAIasHQADBDAAhFgcAAN8NACAJAADcDQAgCgAA3Q0AIAsAANYNACAOAADbDQAgDwAA2Q0AIBAAAJ0PACAZAADaDQAgGwAA3g0AIC0AANgNACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhoAYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACEH9AUBAAAAAfwFQAAAAAH9BUAAAAABtAdAAAAAAcAHAQAAAAHBBwEAAAABwgcBAAAAAQz0BQEAAAAB_AVAAAAAAf0FQAAAAAG3BwEAAAABuAcBAAAAAbkHAQAAAAG6BwEAAAABuwcBAAAAAbwHQAAAAAG9B0AAAAABvgcBAAAAAb8HAQAAAAEhDAAAwBYAIA0AALUWACARAAC2FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAAlBkAIAMAAAAWACBlAACUGQAgZgAAmBkAICMAAAAWACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAAmBkAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQX0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABggcAAADPBwIJ9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABB_QFAQAAAAH4BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAckGAQAAAAEa9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAqQcCrgZAAAAAAdMGAQAAAAGTBwEAAAABlQcBAAAAAZYHAQAAAAGYBwAAAJgHA5kHAQAAAAGaBwAAAMIGA5sHEAAAAAGcBwEAAAABnQcCAAAAAZ8HAAAAnwcCoAcBAAAAAaEHAQAAAAGiBwEAAAABowcBAAAAAaQHAQAAAAGlBwEAAAABpgeAAAAAAacHQAAAAAGpBwEAAAABGvQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAKkHAq4GQAAAAAHTBgEAAAABlAcBAAAAAZUHAQAAAAGWBwEAAAABmAcAAACYBwOZBwEAAAABmgcAAADCBgObBxAAAAABnAcBAAAAAZ0HAgAAAAGfBwAAAJ8HAqAHAQAAAAGhBwEAAAABogcBAAAAAaMHAQAAAAGkBwEAAAABpQcBAAAAAaYHgAAAAAGnB0AAAAABqQcBAAAAAQ30BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGqBgEAAAABrAYAAACsBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGwBgEAAAABsQYBAAAAAQ30BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAYkGAQAAAAGeBgEAAAABqgYBAAAAAawGAAAArAYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAQv0BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABqgYBAAAAAawGAAAAywYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAEL9AUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAaoGAQAAAAGsBgAAAMsGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAHLBgEAAAABBfQFAQAAAAH8BUAAAAAB_QVAAAAAAbMHAQAAAAG0B0AAAAABD_QFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGgBgEAAAABrAYAAACIBwKuBkAAAAABsQYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABD_QFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGgBgEAAAABrAYAAACIBwKuBkAAAAABhgcAAACGBwKIBwEAAAABiQcBAAAAAYoHAQAAAAGLBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABCfQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAJIHAq4GQAAAAAGQBwAAAJAHApIHAQAAAAGTBwEAAAABCfQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAJIHAq4GQAAAAAGKBwEAAAABkAcAAACQBwKSBwEAAAABB_QFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAABpgYBAAAAAYQHAAAAggcCA_QFAQAAAAH_BgEAAAABgAdAAAAAASIFAADWGAAgBgAA1xgAIBAAANgYACAZAADZGAAgNAAA3BgAIEAAANoYACBMAADbGAAgTQAA3RgAIE4AAN4YACBPAADfGAAgUAAA4BgAIFEAAOEYACBSAADiGAAgUwAA4xgAIFQAAOQYACBVAADlGAAgVgAA5hgAIFcAAOcYACBYAADoGAAg9AUBAAAAAfgFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAGCBwEAAAABwwcBAAAAAcQHIAAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABAgAAAPYCACBlAACpGQAgAwAAAFEAIGUAAKkZACBmAACtGQAgJAAAAFEAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACBeAACtGQAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhIgUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAA1RgAIAYAANcYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE0AAN0YACBOAADeGAAgTwAA3xgAIFAAAOAYACBRAADhGAAgUgAA4hgAIFMAAOMYACBUAADkGAAgVQAA5RgAIFYAAOYYACBXAADnGAAgWAAA6BgAIPQFAQAAAAH4BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABggcBAAAAAcMHAQAAAAHEByAAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAQIAAAD2AgAgZQAArhkAIAMAAABRACBlAACuGQAgZgAAshkAICQAAABRACAEAACKFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAgXgAAshkAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISIEAACKFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhIgQAANUYACAFAADWGAAgBgAA1xgAIBAAANgYACAZAADZGAAgNAAA3BgAIEAAANoYACBMAADbGAAgTQAA3RgAIE4AAN4YACBPAADfGAAgUAAA4BgAIFEAAOEYACBTAADjGAAgVAAA5BgAIFUAAOUYACBWAADmGAAgVwAA5xgAIFgAAOgYACD0BQEAAAAB-AUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAYIHAQAAAAHDBwEAAAABxAcgAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAECAAAA9gIAIGUAALMZACADAAAAUQAgZQAAsxkAIGYAALcZACAkAAAAUQAgBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIF4AALcZACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISEGAACyFgAgDAAAwBYAIA0AALUWACARAAC2FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA_AAC_FgAgQAAAtxYAIEEAAL4WACBGAADCFgAgRwAAwxYAIEgAAMQWACBJAADFFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAABqAYAAACYBwPNBgEAAAAB0wYBAAAAAZYHAQAAAAGZBwEAAAABAgAAAPkEACBlAAC4GQAgAwAAABYAIGUAALgZACBmAAC8GQAgIwAAABYAIAYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACBeAAC8GQAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEhBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhCAcAAN0WACD0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAZYHAQAAAAGqBwEAAAABAgAAABQAIGUAAL0ZACADAAAAEgAgZQAAvRkAIGYAAMEZACAKAAAAEgAgBwAA3BYAIF4AAMEZACD0BQEAvwwAIfkFAQDADAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAhlgcBAMAMACGqBwEAvwwAIQgHAADcFgAg9AUBAL8MACH5BQEAwAwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIZYHAQDADAAhqgcBAL8MACEhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAAwhkAIAMAAAAWACBlAADCGQAgZgAAxhkAICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAAxhkAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQr0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAdMGAQAAAAHdBgEAAAAB3gZAAAAAAd8GCAAAAAHgBggAAAABIQYAALIWACAMAADAFgAgDQAAtRYAIBEAALYWACAcAAC9FgAgJQAAsBYAICcAALwWACAqAADBFgAgLgAArRYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIEkAAMUWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGoBgAAAJgHA80GAQAAAAHTBgEAAAABlgcBAAAAAZkHAQAAAAECAAAA-QQAIGUAAMgZACADAAAAFgAgZQAAyBkAIGYAAMwZACAjAAAAFgAgBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIF4AAMwZACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAISEGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEG9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAABCfQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB3wYCAAAAAeUGAQAAAAGsBwEAAAABrQcBAAAAAQn0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAdMGAQAAAAHUBgIAAAAB1QYBAAAAAdYGAQAAAAEJ9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABB_QFAQAAAAH4BQEAAAAB-QUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAckGAQAAAAEL9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGdBgEAAAABngYBAAAAAaAGAQAAAAHVBgEAAAAB5QYBAAAAAasHQAAAAAEH9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGdBgEAAAABngYBAAAAAQ30BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABiQYBAAAAAZ4GAQAAAAGqBgEAAAABrAYAAACsBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGwBgEAAAABsQYBAAAAAQr0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ4GAQAAAAGlBgEAAAABpgYBAAAAAagGAAAAqAYCqQZAAAAAAQr0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABnwYBAAAAAaAGAQAAAAGhBgEAAAABogYBAAAAAaMGAQAAAAGkBkAAAAABE_QFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGeBgEAAAABsgYBAAAAAbMGCAAAAAG0BggAAAABtQYIAAAAAbYGCAAAAAG3BggAAAABuAYIAAAAAbkGCAAAAAG6BggAAAABuwYIAAAAAbwGCAAAAAG9BggAAAABvgYIAAAAAb8GCAAAAAEJ9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAcUGAQAAAAHVBgEAAAAB7QYgAAAAAf0GEAAAAAH-BhAAAAABFvQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABrAYAAADzBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHVBgEAAAAB7wYBAAAAAfEGAAAA8QYC8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAfcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGgAAAAAH7BkAAAAAB_AZAAAAAAQr0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAADaBgLNBgEAAAAB0wYBAAAAAdUGAQAAAAHXBgEAAAAB2AYBAAAAAQr0BQEAAAAB-QUBAAAAAfwFQAAAAAH9BUAAAAABsgYBAAAAAc0GAQAAAAHTBgEAAAAB2gYBAAAAAdsGAQAAAAHcBgEAAAABD_QFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGgBgEAAAABrAYAAACIBwKuBkAAAAABsQYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGKBwEAAAABjAcBAAAAAY0HAQAAAAGOB0AAAAABBvQFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAGWBwEAAAABqgcBAAAAAQb0BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAABlgcBAAAAAaoHAQAAAAEK9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAaUGAQAAAAHTBgEAAAAB3QYBAAAAAd4GQAAAAAHfBggAAAAB4AYIAAAAARgIAADiFgAgDAAApxYAIA0AAJ8WACARAACgFgAgHAAAphYAICUAAJwWACAnAAClFgAgKgAAqBYAIC4AAJkWACAwAACbFgAgMQAAnRYAIDIAAJ4WACA0AAChFgAgNQAAohYAIDYAAKMWACA3AACkFgAgOAAAqRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHkBgEAAAABlgcBAAAAAaoHAQAAAAECAAAAGgAgZQAA4BkAIAn0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAAB1AYCAAAAAdUGAQAAAAEDAAAAGAAgZQAA4BkAIGYAAOUZACAaAAAAGAAgCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACBeAADlGQAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEYCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIQb0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAdMGAQAAAAEK9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGyBgEAAAABzQYBAAAAAdMGAQAAAAHaBgEAAAAB2wYBAAAAAQj0BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABrgcBAAAAAa8HAQAAAAGwBwIAAAABsgcAAACyBwIJ9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAAB1AYCAAAAAdUGAQAAAAHWBgEAAAABDgcAAJARACAJAACREQAgDQAAjxEAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAdMGAQAAAAHdBgEAAAAB3gZAAAAAAd8GCAAAAAHgBggAAAABAgAAAB8AIGUAAOoZACADAAAAHQAgZQAA6hkAIGYAAO4ZACAQAAAAHQAgBwAA3RAAIAkAAN4QACANAADcEAAgXgAA7hkAIPQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACGlBgEAvwwAIdMGAQDADAAh3QYBAMAMACHeBkAA1wwAId8GCADwDAAh4AYIAPAMACEOBwAA3RAAIAkAAN4QACANAADcEAAg9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAh0wYBAMAMACHdBgEAwAwAId4GQADXDAAh3wYIAPAMACHgBggA8AwAIQn0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAd8GAgAAAAHlBgEAAAABrAcBAAAAAa0HAQAAAAEiBAAA1RgAIAUAANYYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE0AAN0YACBOAADeGAAgTwAA3xgAIFAAAOAYACBRAADhGAAgUgAA4hgAIFMAAOMYACBUAADkGAAgVQAA5RgAIFYAAOYYACBXAADnGAAgWAAA6BgAIPQFAQAAAAH4BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABggcBAAAAAcMHAQAAAAHEByAAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAQIAAAD2AgAgZQAA8BkAIAMAAABRACBlAADwGQAgZgAA9BkAICQAAABRACAEAACKFwAgBQAAixcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAgXgAA9BkAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISIEAACKFwAgBQAAixcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhBfQFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAGCBwAAAM8HAgn0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfoFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAEH9AUBAAAAAfgFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAAByQYBAAAAAQv0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQf0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABGvQFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAqQcCrgZAAAAAAdMGAQAAAAGTBwEAAAABlAcBAAAAAZUHAQAAAAGWBwEAAAABmAcAAACYBwOZBwEAAAABmgcAAADCBgObBxAAAAABnAcBAAAAAZ0HAgAAAAGfBwAAAJ8HAqAHAQAAAAGhBwEAAAABogcBAAAAAaMHAQAAAAGkBwEAAAABpQcBAAAAAaYHgAAAAAGnB0AAAAABqQcBAAAAAQ30BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABiQYBAAAAAZ4GAQAAAAGqBgEAAAABrAYAAACsBgKtBgEAAAABrgZAAAAAAa8GQAAAAAGwBgEAAAABsQYBAAAAAQr0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ4GAQAAAAGlBgEAAAABpgYBAAAAAagGAAAAqAYCqQZAAAAAAQr0BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnwYBAAAAAaAGAQAAAAGhBgEAAAABogYBAAAAAaMGAQAAAAGkBkAAAAABE_QFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGeBgEAAAABsgYBAAAAAbMGCAAAAAG0BggAAAABtQYIAAAAAbYGCAAAAAG3BggAAAABuAYIAAAAAbkGCAAAAAG6BggAAAABuwYIAAAAAbwGCAAAAAG9BggAAAABvgYIAAAAAb8GCAAAAAEJ9AUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAcUGAQAAAAHVBgEAAAAB7QYgAAAAAf0GEAAAAAH-BhAAAAABFvQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABrAYAAADzBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHVBgEAAAAB7wYBAAAAAfEGAAAA8QYC8wYBAAAAAfQGAQAAAAH1BgEAAAAB9gYBAAAAAfcGAQAAAAH4BgEAAAAB-QYBAAAAAfoGgAAAAAH7BkAAAAAB_AZAAAAAAQv0BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAMQGAsAGAQAAAAHCBgAAAMIGAsQGEAAAAAHFBgEAAAABxgYCAAAAAccGQAAAAAHIBkAAAAABCvQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAANoGAs0GAQAAAAHTBgEAAAAB1QYBAAAAAdcGAQAAAAHYBgEAAAABCvQFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGyBgEAAAABzQYBAAAAAdMGAQAAAAHaBgEAAAAB2wYBAAAAAdwGAQAAAAEH9AUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAaYGAQAAAAGDBwEAAAABhAcAAACCBwIJ9AUBAAAAAfwFQAAAAAH9BUAAAAABrAYAAACSBwKuBkAAAAABigcBAAAAAZAHAAAAkAcCkgcBAAAAAZMHAQAAAAEP9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAEP9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAaAGAQAAAAGsBgAAAIgHAq4GQAAAAAGxBgEAAAABhgcAAACGBwKIBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAEhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAAiBoAICIEAADVGAAgBQAA1hgAIAYAANcYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTQAA3RgAIE4AAN4YACBPAADfGAAgUAAA4BgAIFEAAOEYACBSAADiGAAgUwAA4xgAIFQAAOQYACBVAADlGAAgVgAA5hgAIFcAAOcYACBYAADoGAAg9AUBAAAAAfgFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAGCBwEAAAABwwcBAAAAAcQHIAAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABAgAAAPYCACBlAACKGgAgIgQAANUYACAFAADWGAAgBgAA1xgAIBAAANgYACAZAADZGAAgNAAA3BgAIEwAANsYACBNAADdGAAgTgAA3hgAIE8AAN8YACBQAADgGAAgUQAA4RgAIFIAAOIYACBTAADjGAAgVAAA5BgAIFUAAOUYACBWAADmGAAgVwAA5xgAIFgAAOgYACD0BQEAAAAB-AUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAYIHAQAAAAHDBwEAAAABxAcgAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAECAAAA9gIAIGUAAIwaACAL9AUBAAAAAfkFAQAAAAH8BUAAAAAB_QVAAAAAAawGAAAAxAYCwgYAAADCBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHHBkAAAAAByAZAAAAAAQMAAAAWACBlAACIGgAgZgAAkRoAICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAAkRoAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQMAAABRACBlAACKGgAgZgAAlBoAICQAAABRACAEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAgXgAAlBoAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISIEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhAwAAAFEAIGUAAIwaACBmAACXGgAgJAAAAFEAIAQAAIoXACAFAACLFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACBeAACXGgAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhIgQAAIoXACAFAACLFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAA1RgAIAUAANYYACAGAADXGAAgEAAA2BgAIBkAANkYACA0AADcGAAgQAAA2hgAIEwAANsYACBNAADdGAAgTgAA3hgAIE8AAN8YACBQAADgGAAgUQAA4RgAIFIAAOIYACBTAADjGAAgVAAA5BgAIFUAAOUYACBXAADnGAAgWAAA6BgAIPQFAQAAAAH4BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABggcBAAAAAcMHAQAAAAHEByAAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAQIAAAD2AgAgZQAAmBoAICEGAACyFgAgDAAAwBYAIA0AALUWACARAAC2FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEgAAMQWACBJAADFFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAABqAYAAACYBwPNBgEAAAAB0wYBAAAAAZYHAQAAAAGZBwEAAAABAgAAAPkEACBlAACaGgAgIgQAANUYACAFAADWGAAgBgAA1xgAIBAAANgYACAZAADZGAAgNAAA3BgAIEAAANoYACBMAADbGAAgTQAA3RgAIE4AAN4YACBPAADfGAAgUAAA4BgAIFEAAOEYACBSAADiGAAgUwAA4xgAIFQAAOQYACBWAADmGAAgVwAA5xgAIFgAAOgYACD0BQEAAAAB-AUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAYIHAQAAAAHDBwEAAAABxAcgAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAECAAAA9gIAIGUAAJwaACADAAAAUQAgZQAAmBoAIGYAAKAaACAkAAAAUQAgBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBXAACcFwAgWAAAnRcAIF4AAKAaACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBXAACcFwAgWAAAnRcAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAIQMAAAAWACBlAACaGgAgZgAAoxoAICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEgAAL0SACBJAAC-EgAgXgAAoxoAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQMAAABRACBlAACcGgAgZgAAphoAICQAAABRACAEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVgAAmxcAIFcAAJwXACBYAACdFwAgXgAAphoAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISIEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVgAAmxcAIFcAAJwXACBYAACdFwAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhIgQAANUYACAFAADWGAAgBgAA1xgAIBAAANgYACAZAADZGAAgNAAA3BgAIEAAANoYACBMAADbGAAgTQAA3RgAIE4AAN4YACBPAADfGAAgUAAA4BgAIFEAAOEYACBSAADiGAAgUwAA4xgAIFQAAOQYACBVAADlGAAgVgAA5hgAIFgAAOgYACD0BQEAAAAB-AUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAYIHAQAAAAHDBwEAAAABxAcgAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAECAAAA9gIAIGUAAKcaACAhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAAqRoAIAP0BQEAAAAB_AVAAAAAAYIHAAAAggcCA_QFAQAAAAH7BQEAAAABgAdAAAAAAQMAAABRACBlAACnGgAgZgAArxoAICQAAABRACAEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBYAACdFwAgXgAArxoAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISIEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBYAACdFwAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhAwAAABYAIGUAAKkaACBmAACyGgAgIwAAABYAIAYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBHAAC8EgAgSAAAvRIAIEkAAL4SACBeAACyGgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEhBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhCwcAAPIRACBCAADzEQAgRQAA9REAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAABpgYBAAAAAYMHAQAAAAGEBwAAAIIHAgIAAADsAQAgZQAAsxoAIAMAAADqAQAgZQAAsxoAIGYAALcaACANAAAA6gEAIAcAANYRACBCAADXEQAgRQAA2REAIF4AALcaACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAhpgYBAL8MACGDBwEAvwwAIYQHAADQEYIHIgsHAADWEQAgQgAA1xEAIEUAANkRACD0BQEAvwwAIfkFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAhpgYBAL8MACGDBwEAvwwAIYQHAADQEYIHIiIEAADVGAAgBQAA1hgAIAYAANcYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE0AAN0YACBOAADeGAAgTwAA3xgAIFAAAOAYACBRAADhGAAgUgAA4hgAIFMAAOMYACBUAADkGAAgVQAA5RgAIFYAAOYYACBXAADnGAAg9AUBAAAAAfgFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAGCBwEAAAABwwcBAAAAAcQHIAAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABAgAAAPYCACBlAAC4GgAgCwcAAPIRACBCAADzEQAgRAAA9BEAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAABpgYBAAAAAYMHAQAAAAGEBwAAAIIHAgIAAADsAQAgZQAAuhoAIAMAAABRACBlAAC4GgAgZgAAvhoAICQAAABRACAEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgXgAAvhoAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISIEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhAwAAAOoBACBlAAC6GgAgZgAAwRoAIA0AAADqAQAgBwAA1hEAIEIAANcRACBEAADYEQAgXgAAwRoAIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACGmBgEAvwwAIYMHAQC_DAAhhAcAANARggciCwcAANYRACBCAADXEQAgRAAA2BEAIPQFAQC_DAAh-QUBAL8MACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACGmBgEAvwwAIYMHAQC_DAAhhAcAANARggciCQwAAL0QACANAAC_EAAgHAAAwRAAICUAAL4QACD0BQEAAAAB-QUBAAAAAc0GAQAAAAHOBkAAAAABzwZAAAAAAQIAAAD_BwAgZQAAwhoAIAMAAAAvACBlAADCGgAgZgAAxhoAIAsAAAAvACAMAAC3DwAgDQAAuQ8AIBwAALsPACAlAAC4DwAgXgAAxhoAIPQFAQC_DAAh-QUBAL8MACHNBgEAvwwAIc4GQADBDAAhzwZAAMEMACEJDAAAtw8AIA0AALkPACAcAAC7DwAgJQAAuA8AIPQFAQC_DAAh-QUBAL8MACHNBgEAvwwAIc4GQADBDAAhzwZAAMEMACEhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAAxxoAIAMAAAAWACBlAADHGgAgZgAAyxoAICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAAyxoAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQ30BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAYkGAQAAAAGeBgEAAAABqgYBAAAAAawGAAAArAYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsQYBAAAAAQv0BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABqgYBAAAAAawGAAAAywYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsQYBAAAAAcsGAQAAAAEYCAAA4hYAIAwAAKcWACANAACfFgAgEQAAoBYAIBwAAKYWACAlAACcFgAgJwAApRYAICoAAKgWACAvAACaFgAgMAAAmxYAIDEAAJ0WACAyAACeFgAgNAAAoRYAIDUAAKIWACA2AACjFgAgNwAApBYAIDgAAKkWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB5AYBAAAAAZYHAQAAAAGqBwEAAAABAgAAABoAIGUAAM4aACAhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAA0BoAIBgIAADiFgAgDAAApxYAIA0AAJ8WACARAACgFgAgHAAAphYAICUAAJwWACAnAAClFgAgKgAAqBYAIC4AAJkWACAvAACaFgAgMQAAnRYAIDIAAJ4WACA0AAChFgAgNQAAohYAIDYAAKMWACA3AACkFgAgOAAAqRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHkBgEAAAABlgcBAAAAAaoHAQAAAAECAAAAGgAgZQAA0hoAICEGAACyFgAgDAAAwBYAIA0AALUWACARAAC2FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMQAAsxYAIDIAALQWACA0AAC4FgAgNQAAuRYAIDYAALoWACA3AAC7FgAgOgAArBYAIDsAAK8WACA_AAC_FgAgQAAAtxYAIEEAAL4WACBGAADCFgAgRwAAwxYAIEgAAMQWACBJAADFFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAABqAYAAACYBwPNBgEAAAAB0wYBAAAAAZYHAQAAAAGZBwEAAAABAgAAAPkEACBlAADUGgAgC_QFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABB_QFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ4GAQAAAAEDAAAAGAAgZQAA0hoAIGYAANoaACAaAAAAGAAgCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACBeAADaGgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEYCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIQMAAAAWACBlAADUGgAgZgAA3RoAICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAA3RoAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQn0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHfBgIAAAABrAcBAAAAAa0HAQAAAAEL9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAasHQAAAAAEDAAAAGAAgZQAAzhoAIGYAAOIaACAaAAAAGAAgCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAvAADtFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACBeAADiGgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEYCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAvAADtFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIQMAAAAWACBlAADQGgAgZgAA5RoAICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAA5RoAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQkNAAC_EAAgHAAAwRAAICUAAL4QACAnAADAEAAg9AUBAAAAAfkFAQAAAAHNBgEAAAABzgZAAAAAAc8GQAAAAAECAAAA_wcAIGUAAOYaACADAAAALwAgZQAA5hoAIGYAAOoaACALAAAALwAgDQAAuQ8AIBwAALsPACAlAAC4DwAgJwAAug8AIF4AAOoaACD0BQEAvwwAIfkFAQC_DAAhzQYBAL8MACHOBkAAwQwAIc8GQADBDAAhCQ0AALkPACAcAAC7DwAgJQAAuA8AICcAALoPACD0BQEAvwwAIfkFAQC_DAAhzQYBAL8MACHOBkAAwQwAIc8GQADBDAAhCQwAAL0QACANAAC_EAAgHAAAwRAAICcAAMAQACD0BQEAAAAB-QUBAAAAAc0GAQAAAAHOBkAAAAABzwZAAAAAAQIAAAD_BwAgZQAA6xoAIAMAAAAvACBlAADrGgAgZgAA7xoAIAsAAAAvACAMAAC3DwAgDQAAuQ8AIBwAALsPACAnAAC6DwAgXgAA7xoAIPQFAQC_DAAh-QUBAL8MACHNBgEAvwwAIc4GQADBDAAhzwZAAMEMACEJDAAAtw8AIA0AALkPACAcAAC7DwAgJwAAug8AIPQFAQC_DAAh-QUBAL8MACHNBgEAvwwAIc4GQADBDAAhzwZAAMEMACEYCAAA4hYAIA0AAJ8WACARAACgFgAgHAAAphYAICUAAJwWACAnAAClFgAgKgAAqBYAIC4AAJkWACAvAACaFgAgMAAAmxYAIDEAAJ0WACAyAACeFgAgNAAAoRYAIDUAAKIWACA2AACjFgAgNwAApBYAIDgAAKkWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB5AYBAAAAAZYHAQAAAAGqBwEAAAABAgAAABoAIGUAAPAaACAhBgAAshYAIA0AALUWACARAAC2FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAA8hoAIBYHAACSDgAgCQAAjw4AIAoAAJAOACAOAACODgAgDwAAjA4AIBAAAJ8PACAZAACNDgAgGwAAkQ4AICwAAIoOACAtAACLDgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAZ4GAQAAAAGgBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABAgAAACgAIGUAAPQaACADAAAAJgAgZQAA9BoAIGYAAPgaACAYAAAAJgAgBwAA3w0AIAkAANwNACAKAADdDQAgDgAA2w0AIA8AANkNACAQAACdDwAgGQAA2g0AIBsAAN4NACAsAADXDQAgLQAA2A0AIF4AAPgaACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhoAYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACEWBwAA3w0AIAkAANwNACAKAADdDQAgDgAA2w0AIA8AANkNACAQAACdDwAgGQAA2g0AIBsAAN4NACAsAADXDQAgLQAA2A0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhngYBAL8MACGgBgEAvwwAIdUGAQC_DAAh5QYBAMAMACGrB0AAwQwAIQr0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAbIGAQAAAAHNBgEAAAAB0wYBAAAAAdoGAQAAAAHcBgEAAAABAwAAABgAIGUAAPAaACBmAAD8GgAgGgAAABgAIAgAAOEWACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAgXgAA_BoAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhGAgAAOEWACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEDAAAAFgAgZQAA8hoAIGYAAP8aACAjAAAAFgAgBgAAqxIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIF4AAP8aACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAISEGAACrEgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEK9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAANoGAs0GAQAAAAHTBgEAAAAB1wYBAAAAAdgGAQAAAAEJBwAAjhYAIAkAAMcUACD0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAHTBgEAAAABAgAAAJcBACBlAACBGwAgGAgAAOIWACAMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJwAApRYAICoAAKgWACAuAACZFgAgLwAAmhYAIDAAAJsWACAxAACdFgAgMgAAnhYAIDQAAKEWACA1AACiFgAgNgAAoxYAIDcAAKQWACA4AACpFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAeQGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAaACBlAACDGwAgIQYAALIWACAMAADAFgAgDQAAtRYAIBEAALYWACAcAAC9FgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIEkAAMUWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGoBgAAAJgHA80GAQAAAAHTBgEAAAABlgcBAAAAAZkHAQAAAAECAAAA-QQAIGUAAIUbACAL9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGdBgEAAAABngYBAAAAAaAGAQAAAAHVBgEAAAAB5QYBAAAAAasHQAAAAAEH9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGdBgEAAAABngYBAAAAAQr0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZ4GAQAAAAGlBgEAAAABpgYBAAAAAagGAAAAqAYCqQZAAAAAAQMAAABrACBlAACBGwAgZgAAjBsAIAsAAABrACAHAACMFgAgCQAAuxQAIF4AAIwbACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIQkHAACMFgAgCQAAuxQAIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIdMGAQDADAAhAwAAABgAIGUAAIMbACBmAACPGwAgGgAAABgAIAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAgXgAAjxsAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhGAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEDAAAAFgAgZQAAhRsAIGYAAJIbACAjAAAAFgAgBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIF4AAJIbACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAISEGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEJ9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdQGAgAAAAHWBgEAAAABC_QFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABoAYBAAAAAeUGAQAAAAGrB0AAAAABGAgAAOIWACAMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJQAAnBYAICoAAKgWACAuAACZFgAgLwAAmhYAIDAAAJsWACAxAACdFgAgMgAAnhYAIDQAAKEWACA1AACiFgAgNgAAoxYAIDcAAKQWACA4AACpFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAeQGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAaACBlAACVGwAgIQYAALIWACAMAADAFgAgDQAAtRYAIBEAALYWACAcAAC9FgAgJQAAsBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIEkAAMUWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGoBgAAAJgHA80GAQAAAAHTBgEAAAABlgcBAAAAAZkHAQAAAAECAAAA-QQAIGUAAJcbACAW9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABrAYAAADzBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHVBgEAAAAB8QYAAADxBgLzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gaAAAAAAfsGQAAAAAH8BkAAAAABAwAAABgAIGUAAJUbACBmAACcGwAgGgAAABgAIAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAgXgAAnBsAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhGAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEDAAAAFgAgZQAAlxsAIGYAAJ8bACAjAAAAFgAgBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIF4AAJ8bACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAISEGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEJ9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHFBgEAAAAB7QYgAAAAAf0GEAAAAAH-BhAAAAABDwMAAKIPACAHAACgDwAgCQAAoQ8AIA0AAKMPACATAACkDwAgGgAApQ8AICIAAKcPACD0BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAAByQYBAAAAAQIAAACdAQAgZQAAoRsAIAMAAABTACBlAAChGwAgZgAApRsAIBEAAABTACADAADSDgAgBwAA0A4AIAkAANEOACANAADTDgAgEwAA1A4AIBoAANUOACAiAADXDgAgXgAApRsAIPQFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQDADAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhyQYBAL8MACEPAwAA0g4AIAcAANAOACAJAADRDgAgDQAA0w4AIBMAANQOACAaAADVDgAgIgAA1w4AIPQFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQDADAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhyQYBAL8MACEW9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABrAYAAADzBgLEBhAAAAABxQYBAAAAAcYGAgAAAAHvBgEAAAAB8QYAAADxBgLzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gaAAAAAAfsGQAAAAAH8BkAAAAABIgQAANUYACAFAADWGAAgBgAA1xgAIBAAANgYACAZAADZGAAgNAAA3BgAIEAAANoYACBMAADbGAAgTQAA3RgAIE4AAN4YACBPAADfGAAgUAAA4BgAIFIAAOIYACBTAADjGAAgVAAA5BgAIFUAAOUYACBWAADmGAAgVwAA5xgAIFgAAOgYACD0BQEAAAAB-AUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAYIHAQAAAAHDBwEAAAABxAcgAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAECAAAA9gIAIGUAAKcbACADAAAAUQAgZQAApxsAIGYAAKsbACAkAAAAUQAgBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIF4AAKsbACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAIQ8DAACiDwAgBwAAoA8AIAkAAKEPACANAACjDwAgEwAApA8AIBwAAKYPACAiAACnDwAg9AUBAAAAAfgFAQAAAAH5BQEAAAAB-gUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAckGAQAAAAECAAAAnQEAIGUAAKwbACADAAAAUwAgZQAArBsAIGYAALAbACARAAAAUwAgAwAA0g4AIAcAANAOACAJAADRDgAgDQAA0w4AIBMAANQOACAcAADWDgAgIgAA1w4AIF4AALAbACD0BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAwAwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIckGAQC_DAAhDwMAANIOACAHAADQDgAgCQAA0Q4AIA0AANMOACATAADUDgAgHAAA1g4AICIAANcOACD0BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAwAwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIckGAQC_DAAhIgQAANUYACAFAADWGAAgBgAA1xgAIBAAANgYACA0AADcGAAgQAAA2hgAIEwAANsYACBNAADdGAAgTgAA3hgAIE8AAN8YACBQAADgGAAgUQAA4RgAIFIAAOIYACBTAADjGAAgVAAA5BgAIFUAAOUYACBWAADmGAAgVwAA5xgAIFgAAOgYACD0BQEAAAAB-AUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAYIHAQAAAAHDBwEAAAABxAcgAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAECAAAA9gIAIGUAALEbACAYCAAA4hYAIAwAAKcWACANAACfFgAgEQAAoBYAIBwAAKYWACAlAACcFgAgJwAApRYAICoAAKgWACAuAACZFgAgLwAAmhYAIDAAAJsWACAxAACdFgAgNAAAoRYAIDUAAKIWACA2AACjFgAgNwAApBYAIDgAAKkWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB5AYBAAAAAZYHAQAAAAGqBwEAAAABAgAAABoAIGUAALMbACAhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAAtRsAIBIDAACbDgAgBwAAkw4AIAkAAJoOACARAACVDgAgIgAAmQ4AICQAAJYOACBKAACXDgAgSwAAmA4AIPQFAQAAAAH1BQEAAAAB9gUBAAAAAfcFAQAAAAH4BQEAAAAB-QUBAAAAAfoFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAECAAAAEAAgZQAAtxsAIAMAAAAOACBlAAC3GwAgZgAAuxsAIBQAAAAOACADAADKDAAgBwAAwgwAIAkAAMkMACARAADEDAAgIgAAyAwAICQAAMUMACBKAADGDAAgSwAAxwwAIF4AALsbACD0BQEAvwwAIfUFAQC_DAAh9gUBAL8MACH3BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAvwwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIRIDAADKDAAgBwAAwgwAIAkAAMkMACARAADEDAAgIgAAyAwAICQAAMUMACBKAADGDAAgSwAAxwwAIPQFAQC_DAAh9QUBAL8MACH2BQEAvwwAIfcFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhC_QFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAAB1QYBAAAAAeUGAQAAAAGrB0AAAAABCvQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnwYBAAAAAaEGAQAAAAGiBgEAAAABowYBAAAAAaQGQAAAAAEiBAAA1RgAIAUAANYYACAGAADXGAAgEAAA2BgAIBkAANkYACA0AADcGAAgQAAA2hgAIEwAANsYACBNAADdGAAgTgAA3hgAIE8AAN8YACBRAADhGAAgUgAA4hgAIFMAAOMYACBUAADkGAAgVQAA5RgAIFYAAOYYACBXAADnGAAgWAAA6BgAIPQFAQAAAAH4BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABggcBAAAAAcMHAQAAAAHEByAAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAQIAAAD2AgAgZQAAvhsAICIEAADVGAAgBQAA1hgAIAYAANcYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE0AAN0YACBOAADeGAAgUAAA4BgAIFEAAOEYACBSAADiGAAgUwAA4xgAIFQAAOQYACBVAADlGAAgVgAA5hgAIFcAAOcYACBYAADoGAAg9AUBAAAAAfgFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAGCBwEAAAABwwcBAAAAAcQHIAAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABAgAAAPYCACBlAADAGwAgDPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAeEGAQAAAAHiBgEAAAAB4wYAAKARACDkBgEAAAAB5QYBAAAAAeYGAQAAAAECAAAAgAcAIGUAAMIbACADAAAAUQAgZQAAvhsAIGYAAMYbACAkAAAAUQAgBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIF4AAMYbACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAIQMAAABRACBlAADAGwAgZgAAyRsAICQAAABRACAEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAgXgAAyRsAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISIEAACKFwAgBQAAixcAIAYAAIwXACAQAACNFwAgGQAAjhcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhAwAAAIMHACBlAADCGwAgZgAAzBsAIA4AAACDBwAgXgAAzBsAIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGlBgEAvwwAIeEGAQDADAAh4gYBAL8MACHjBgAAlREAIOQGAQDADAAh5QYBAMAMACHmBgEAvwwAIQz0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACHhBgEAwAwAIeIGAQC_DAAh4wYAAJURACDkBgEAwAwAIeUGAQDADAAh5gYBAL8MACEL9AUBAAAAAfwFQAAAAAH9BUAAAAABqgYBAAAAAawGAAAAywYCrQYBAAAAAa4GQAAAAAGvBkAAAAABsAYBAAAAAbEGAQAAAAHLBgEAAAABDQcAAN8PACAJAADgDwAgGwAAxREAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABxQYBAAAAAdUGAQAAAAHtBiAAAAAB_QYQAAAAAf4GEAAAAAECAAAAdgAgZQAAzhsAIAkMAAC9EAAgDQAAvxAAICUAAL4QACAnAADAEAAg9AUBAAAAAfkFAQAAAAHNBgEAAAABzgZAAAAAAc8GQAAAAAECAAAA_wcAIGUAANAbACAYCAAA4hYAIAwAAKcWACANAACfFgAgEQAAoBYAICUAAJwWACAnAAClFgAgKgAAqBYAIC4AAJkWACAvAACaFgAgMAAAmxYAIDEAAJ0WACAyAACeFgAgNAAAoRYAIDUAAKIWACA2AACjFgAgNwAApBYAIDgAAKkWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB5AYBAAAAAZYHAQAAAAGqBwEAAAABAgAAABoAIGUAANIbACAhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAA1BsAIAMAAAB0ACBlAADOGwAgZgAA2BsAIA8AAAB0ACAHAADSDwAgCQAA0w8AIBsAAMQRACBeAADYGwAg9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIcUGAQC_DAAh1QYBAL8MACHtBiAAoQ4AIf0GEADHDgAh_gYQAMcOACENBwAA0g8AIAkAANMPACAbAADEEQAg9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIcUGAQC_DAAh1QYBAL8MACHtBiAAoQ4AIf0GEADHDgAh_gYQAMcOACEDAAAALwAgZQAA0BsAIGYAANsbACALAAAALwAgDAAAtw8AIA0AALkPACAlAAC4DwAgJwAAug8AIF4AANsbACD0BQEAvwwAIfkFAQC_DAAhzQYBAL8MACHOBkAAwQwAIc8GQADBDAAhCQwAALcPACANAAC5DwAgJQAAuA8AICcAALoPACD0BQEAvwwAIfkFAQC_DAAhzQYBAL8MACHOBkAAwQwAIc8GQADBDAAhAwAAABgAIGUAANIbACBmAADeGwAgGgAAABgAIAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAgXgAA3hsAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhGAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEDAAAAFgAgZQAA1BsAIGYAAOEbACAjAAAAFgAgBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIF4AAOEbACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAISEGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEW9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAPMGAsQGEAAAAAHFBgEAAAABxgYCAAAAAdUGAQAAAAHvBgEAAAAB8QYAAADxBgLzBgEAAAAB9AYBAAAAAfUGAQAAAAH2BgEAAAAB9wYBAAAAAfgGAQAAAAH5BgEAAAAB-gaAAAAAAfsGQAAAAAH8BkAAAAABEgMAAJsOACAHAACTDgAgCQAAmg4AIA0AAJQOACARAACVDgAgJAAAlg4AIEoAAJcOACBLAACYDgAg9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQEAAAAB-gUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAQIAAAAQACBlAADjGwAgAwAAAA4AIGUAAOMbACBmAADnGwAgFAAAAA4AIAMAAMoMACAHAADCDAAgCQAAyQwAIA0AAMMMACARAADEDAAgJAAAxQwAIEoAAMYMACBLAADHDAAgXgAA5xsAIPQFAQC_DAAh9QUBAL8MACH2BQEAvwwAIfcFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhEgMAAMoMACAHAADCDAAgCQAAyQwAIA0AAMMMACARAADEDAAgJAAAxQwAIEoAAMYMACBLAADHDAAg9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-gUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACEP9AUBAAAAAfwFQAAAAAH9BUAAAAABngYBAAAAAawGAAAAiAcCrgZAAAAAAbEGAQAAAAGGBwAAAIYHAogHAQAAAAGJBwEAAAABigcBAAAAAYsHAQAAAAGMBwEAAAABjQcBAAAAAY4HQAAAAAEDAAAAUQAgZQAAsRsAIGYAAOsbACAkAAAAUQAgBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIF4AAOsbACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIDQAAJEXACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAIQMAAAAYACBlAACzGwAgZgAA7hsAIBoAAAAYACAIAADhFgAgDAAA-hQAIA0AAPIUACARAADzFAAgHAAA-RQAICUAAO8UACAnAAD4FAAgKgAA-xQAIC4AAOwUACAvAADtFAAgMAAA7hQAIDEAAPAUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgOAAA_BQAIF4AAO4bACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIRgIAADhFgAgDAAA-hQAIA0AAPIUACARAADzFAAgHAAA-RQAICUAAO8UACAnAAD4FAAgKgAA-xQAIC4AAOwUACAvAADtFAAgMAAA7hQAIDEAAPAUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgOAAA_BQAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhAwAAABYAIGUAALUbACBmAADxGwAgIwAAABYAIAYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACBeAADxGwAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEhBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhHgcAAKASACA8AACeEgAgPQAAnxIAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAKkHAq4GQAAAAAHTBgEAAAABkwcBAAAAAZQHAQAAAAGVBwEAAAABlgcBAAAAAZgHAAAAmAcDmQcBAAAAAZoHAAAAwgYDmwcQAAAAAZwHAQAAAAGdBwIAAAABnwcAAACfBwKgBwEAAAABoQcBAAAAAaIHAQAAAAGjBwEAAAABpAcBAAAAAaUHAQAAAAGmB4AAAAABpwdAAAAAAakHAQAAAAECAAAA1QEAIGUAAPIbACAhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAA9BsAIAMAAADTAQAgZQAA8hsAIGYAAPgbACAgAAAA0wEAIAcAAJASACA8AACOEgAgPQAAjxIAIF4AAPgbACD0BQEAvwwAIfkFAQDADAAh_AVAAMEMACH9BUAAwQwAIawGAACNEqkHIq4GQADXDAAh0wYBAMAMACGTBwEAwAwAIZQHAQC_DAAhlQcBAL8MACGWBwEAwAwAIZgHAACJEpgHI5kHAQDADAAhmgcAAIoSwgYjmwcQAIsSACGcBwEAvwwAIZ0HAgD1DwAhnwcAAIwSnwcioAcBAMAMACGhBwEAwAwAIaIHAQDADAAhowcBAMAMACGkBwEAwAwAIaUHAQDADAAhpgeAAAAAAacHQADXDAAhqQcBAMAMACEeBwAAkBIAIDwAAI4SACA9AACPEgAg9AUBAL8MACH5BQEAwAwAIfwFQADBDAAh_QVAAMEMACGsBgAAjRKpByKuBkAA1wwAIdMGAQDADAAhkwcBAMAMACGUBwEAvwwAIZUHAQC_DAAhlgcBAMAMACGYBwAAiRKYByOZBwEAwAwAIZoHAACKEsIGI5sHEACLEgAhnAcBAL8MACGdBwIA9Q8AIZ8HAACMEp8HIqAHAQDADAAhoQcBAMAMACGiBwEAwAwAIaMHAQDADAAhpAcBAMAMACGlBwEAwAwAIaYHgAAAAAGnB0AA1wwAIakHAQDADAAhAwAAABYAIGUAAPQbACBmAAD7GwAgIwAAABYAIAYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACBeAAD7GwAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEhBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhEgMAAJsOACAHAACTDgAgCQAAmg4AIA0AAJQOACARAACVDgAgIgAAmQ4AICQAAJYOACBLAACYDgAg9AUBAAAAAfUFAQAAAAH2BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQEAAAAB-gUBAAAAAfsFAQAAAAH8BUAAAAAB_QVAAAAAAQIAAAAQACBlAAD8GwAgAwAAAA4AIGUAAPwbACBmAACAHAAgFAAAAA4AIAMAAMoMACAHAADCDAAgCQAAyQwAIA0AAMMMACARAADEDAAgIgAAyAwAICQAAMUMACBLAADHDAAgXgAAgBwAIPQFAQC_DAAh9QUBAL8MACH2BQEAvwwAIfcFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQC_DAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhEgMAAMoMACAHAADCDAAgCQAAyQwAIA0AAMMMACARAADEDAAgIgAAyAwAICQAAMUMACBLAADHDAAg9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-gUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACESAwAAmw4AIAcAAJMOACAJAACaDgAgDQAAlA4AIBEAAJUOACAiAACZDgAgSgAAlw4AIEsAAJgOACD0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABAgAAABAAIGUAAIEcACADAAAADgAgZQAAgRwAIGYAAIUcACAUAAAADgAgAwAAygwAIAcAAMIMACAJAADJDAAgDQAAwwwAIBEAAMQMACAiAADIDAAgSgAAxgwAIEsAAMcMACBeAACFHAAg9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-gUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACESAwAAygwAIAcAAMIMACAJAADJDAAgDQAAwwwAIBEAAMQMACAiAADIDAAgSgAAxgwAIEsAAMcMACD0BQEAvwwAIfUFAQC_DAAh9gUBAL8MACH3BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAvwwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIQ8HAAC0DQAgCQAAtQ0AIA4AALMNACAQAAC1DgAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABngYBAAAAAaUGAQAAAAGmBgEAAAABqAYAAACoBgKpBkAAAAABAgAAAEEAIGUAAIYcACADAAAAPwAgZQAAhhwAIGYAAIocACARAAAAPwAgBwAAnQ0AIAkAAJ4NACAOAACcDQAgEAAAtA4AIF4AAIocACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGeBgEAvwwAIaUGAQC_DAAhpgYBAMAMACGoBgAAmg2oBiKpBkAA1wwAIQ8HAACdDQAgCQAAng0AIA4AAJwNACAQAAC0DgAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIZwGAQC_DAAhngYBAL8MACGlBgEAvwwAIaYGAQDADAAhqAYAAJoNqAYiqQZAANcMACESAwAAmw4AIAcAAJMOACAJAACaDgAgDQAAlA4AICIAAJkOACAkAACWDgAgSgAAlw4AIEsAAJgOACD0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABAgAAABAAIGUAAIscACADAAAADgAgZQAAixwAIGYAAI8cACAUAAAADgAgAwAAygwAIAcAAMIMACAJAADJDAAgDQAAwwwAICIAAMgMACAkAADFDAAgSgAAxgwAIEsAAMcMACBeAACPHAAg9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-gUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACESAwAAygwAIAcAAMIMACAJAADJDAAgDQAAwwwAICIAAMgMACAkAADFDAAgSgAAxgwAIEsAAMcMACD0BQEAvwwAIfUFAQC_DAAh9gUBAL8MACH3BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAvwwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAISIEAADVGAAgBQAA1hgAIAYAANcYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE0AAN0YACBPAADfGAAgUAAA4BgAIFEAAOEYACBSAADiGAAgUwAA4xgAIFQAAOQYACBVAADlGAAgVgAA5hgAIFcAAOcYACBYAADoGAAg9AUBAAAAAfgFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAGCBwEAAAABwwcBAAAAAcQHIAAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABAgAAAPYCACBlAACQHAAgAwAAAFEAIGUAAJAcACBmAACUHAAgJAAAAFEAIAQAAIoXACAFAACLFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACBeAACUHAAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhIgQAAIoXACAFAACLFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAA1RgAIAUAANYYACAGAADXGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE0AAN0YACBOAADeGAAgTwAA3xgAIFAAAOAYACBRAADhGAAgUgAA4hgAIFMAAOMYACBUAADkGAAgVQAA5RgAIFYAAOYYACBXAADnGAAgWAAA6BgAIPQFAQAAAAH4BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABggcBAAAAAcMHAQAAAAHEByAAAAABxQcBAAAAAcYHAQAAAAHHBwEAAAAByAcBAAAAAckHAQAAAAHKBwEAAAABywcBAAAAAQIAAAD2AgAgZQAAlRwAIBgIAADiFgAgDAAApxYAIA0AAJ8WACARAACgFgAgHAAAphYAICUAAJwWACAnAAClFgAgKgAAqBYAIC4AAJkWACAvAACaFgAgMAAAmxYAIDIAAJ4WACA0AAChFgAgNQAAohYAIDYAAKMWACA3AACkFgAgOAAAqRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAdMGAQAAAAHkBgEAAAABlgcBAAAAAaoHAQAAAAECAAAAGgAgZQAAlxwAICEGAACyFgAgDAAAwBYAIA0AALUWACARAAC2FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDIAALQWACA0AAC4FgAgNQAAuRYAIDYAALoWACA3AAC7FgAgOgAArBYAIDsAAK8WACA_AAC_FgAgQAAAtxYAIEEAAL4WACBGAADCFgAgRwAAwxYAIEgAAMQWACBJAADFFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAABqAYAAACYBwPNBgEAAAAB0wYBAAAAAZYHAQAAAAGZBwEAAAABAgAAAPkEACBlAACZHAAgIQYAALIWACAMAADAFgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIEkAAMUWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGoBgAAAJgHA80GAQAAAAHTBgEAAAABlgcBAAAAAZkHAQAAAAECAAAA-QQAIGUAAJscACAJDAAAvRAAIBwAAMEQACAlAAC-EAAgJwAAwBAAIPQFAQAAAAH5BQEAAAABzQYBAAAAAc4GQAAAAAHPBkAAAAABAgAAAP8HACBlAACdHAAgDgcAAJARACAJAACREQAgDwAAjhEAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABpQYBAAAAAdMGAQAAAAHdBgEAAAAB3gZAAAAAAd8GCAAAAAHgBggAAAABAgAAAB8AIGUAAJ8cACAYCAAA4hYAIAwAAKcWACARAACgFgAgHAAAphYAICUAAJwWACAnAAClFgAgKgAAqBYAIC4AAJkWACAvAACaFgAgMAAAmxYAIDEAAJ0WACAyAACeFgAgNAAAoRYAIDUAAKIWACA2AACjFgAgNwAApBYAIDgAAKkWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB5AYBAAAAAZYHAQAAAAGqBwEAAAABAgAAABoAIGUAAKEcACAQBwAAnBAAIAkAAJ0QACARAACaEAAgGwAAzRAAICQAAJsQACAmAACeEAAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdQGAgAAAAHVBgEAAAAB1gYBAAAAAQIAAAA3ACBlAACjHAAgDwMAAKIPACAHAACgDwAgCQAAoQ8AIBMAAKQPACAaAAClDwAgHAAApg8AICIAAKcPACD0BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAAByQYBAAAAAQIAAACdAQAgZQAApRwAIA4HAACKEQAgCQAAixEAIAoAAI4UACARAACNEQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB3wYCAAAAAeUGAQAAAAGsBwEAAAABrQcBAAAAAQIAAAAjACBlAACnHAAgGAgAAOIWACAMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJQAAnBYAICcAAKUWACAuAACZFgAgLwAAmhYAIDAAAJsWACAxAACdFgAgMgAAnhYAIDQAAKEWACA1AACiFgAgNgAAoxYAIDcAAKQWACA4AACpFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAeQGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAaACBlAACpHAAgIQYAALIWACAMAADAFgAgDQAAtRYAIBEAALYWACAcAAC9FgAgJQAAsBYAICcAALwWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIEkAAMUWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGoBgAAAJgHA80GAQAAAAHTBgEAAAABlgcBAAAAAZkHAQAAAAECAAAA-QQAIGUAAKscACAKBwAA8RYAIPQFAQAAAAH5BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAABrgcBAAAAAa8HAQAAAAGwBwIAAAABsgcAAACyBwICAAAAygEAIGUAAK0cACAOBwAAuxAAIAkAALwQACAbAADSEAAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAANoGAs0GAQAAAAHTBgEAAAAB1QYBAAAAAdcGAQAAAAHYBgEAAAABAgAAADMAIGUAAK8cACADAAAAGAAgZQAAqRwAIGYAALMcACAaAAAAGAAgCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAIC4AAOwUACAvAADtFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACBeAACzHAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEYCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAIC4AAOwUACAvAADtFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNAAA9BQAIDUAAPUUACA2AAD2FAAgNwAA9xQAIDgAAPwUACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIQMAAAAWACBlAACrHAAgZgAAthwAICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAAthwAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQMAAADIAQAgZQAArRwAIGYAALkcACAMAAAAyAEAIAcAAPAWACBeAAC5HAAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHNBgEAwAwAIa4HAQC_DAAhrwcBAL8MACGwBwIAyA4AIbIHAACiFLIHIgoHAADwFgAg9AUBAL8MACH5BQEAvwwAIfwFQADBDAAh_QVAAMEMACHNBgEAwAwAIa4HAQC_DAAhrwcBAL8MACGwBwIAyA4AIbIHAACiFLIHIgMAAAAxACBlAACvHAAgZgAAvBwAIBAAAAAxACAHAACsEAAgCQAArRAAIBsAANEQACBeAAC8HAAg9AUBAL8MACH5BQEAwAwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIawGAACpENoGIs0GAQC_DAAh0wYBAMAMACHVBgEAwAwAIdcGAQC_DAAh2AYBAL8MACEOBwAArBAAIAkAAK0QACAbAADREAAg9AUBAL8MACH5BQEAwAwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIawGAACpENoGIs0GAQC_DAAh0wYBAMAMACHVBgEAwAwAIdcGAQC_DAAh2AYBAL8MACEK9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdoGAQAAAAHbBgEAAAAB3AYBAAAAAQX0BQEAAAAB_AVAAAAAAf0FQAAAAAGsBgAAAM4HAswHQAAAAAESAwAAmw4AIAcAAJMOACAJAACaDgAgDQAAlA4AIBEAAJUOACAiAACZDgAgJAAAlg4AIEoAAJcOACD0BQEAAAAB9QUBAAAAAfYFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAABAgAAABAAIGUAAL8cACADAAAADgAgZQAAvxwAIGYAAMMcACAUAAAADgAgAwAAygwAIAcAAMIMACAJAADJDAAgDQAAwwwAIBEAAMQMACAiAADIDAAgJAAAxQwAIEoAAMYMACBeAADDHAAg9AUBAL8MACH1BQEAvwwAIfYFAQC_DAAh9wUBAL8MACH4BQEAwAwAIfkFAQC_DAAh-gUBAL8MACH7BQEAvwwAIfwFQADBDAAh_QVAAMEMACESAwAAygwAIAcAAMIMACAJAADJDAAgDQAAwwwAIBEAAMQMACAiAADIDAAgJAAAxQwAIEoAAMYMACD0BQEAvwwAIfUFAQC_DAAh9gUBAL8MACH3BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAvwwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIQMAAAAWACBlAACbHAAgZgAAxhwAICMAAAAWACAGAACrEgAgDAAAuRIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAAxhwAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQMAAAAvACBlAACdHAAgZgAAyRwAIAsAAAAvACAMAAC3DwAgHAAAuw8AICUAALgPACAnAAC6DwAgXgAAyRwAIPQFAQC_DAAh-QUBAL8MACHNBgEAvwwAIc4GQADBDAAhzwZAAMEMACEJDAAAtw8AIBwAALsPACAlAAC4DwAgJwAAug8AIPQFAQC_DAAh-QUBAL8MACHNBgEAvwwAIc4GQADBDAAhzwZAAMEMACEDAAAAHQAgZQAAnxwAIGYAAMwcACAQAAAAHQAgBwAA3RAAIAkAAN4QACAPAADbEAAgXgAAzBwAIPQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACGlBgEAvwwAIdMGAQDADAAh3QYBAMAMACHeBkAA1wwAId8GCADwDAAh4AYIAPAMACEOBwAA3RAAIAkAAN4QACAPAADbEAAg9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAh0wYBAMAMACHdBgEAwAwAId4GQADXDAAh3wYIAPAMACHgBggA8AwAIQMAAAAYACBlAAChHAAgZgAAzxwAIBoAAAAYACAIAADhFgAgDAAA-hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgOAAA_BQAIF4AAM8cACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIRgIAADhFgAgDAAA-hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgOAAA_BQAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhAwAAADUAIGUAAKMcACBmAADSHAAgEgAAADUAIAcAAPoPACAJAAD7DwAgEQAA-A8AIBsAAMwQACAkAAD5DwAgJgAA_A8AIF4AANIcACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIdQGAgD1DwAh1QYBAL8MACHWBgEAwAwAIRAHAAD6DwAgCQAA-w8AIBEAAPgPACAbAADMEAAgJAAA-Q8AICYAAPwPACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIdQGAgD1DwAh1QYBAL8MACHWBgEAwAwAIQMAAABTACBlAAClHAAgZgAA1RwAIBEAAABTACADAADSDgAgBwAA0A4AIAkAANEOACATAADUDgAgGgAA1Q4AIBwAANYOACAiAADXDgAgXgAA1RwAIPQFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQDADAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhyQYBAL8MACEPAwAA0g4AIAcAANAOACAJAADRDgAgEwAA1A4AIBoAANUOACAcAADWDgAgIgAA1w4AIPQFAQC_DAAh-AUBAMAMACH5BQEAvwwAIfoFAQDADAAh-wUBAL8MACH8BUAAwQwAIf0FQADBDAAhyQYBAL8MACEDAAAAIQAgZQAApxwAIGYAANgcACAQAAAAIQAgBwAA8xAAIAkAAPQQACAKAACMFAAgEQAA9hAAIF4AANgcACD0BQEAvwwAIfkFAQC_DAAh-gUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHfBgIA9Q8AIeUGAQDADAAhrAcBAL8MACGtBwEAvwwAIQ4HAADzEAAgCQAA9BAAIAoAAIwUACARAAD2EAAg9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh3wYCAPUPACHlBgEAwAwAIawHAQC_DAAhrQcBAL8MACEL9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABnQYBAAAAAaAGAQAAAAHVBgEAAAAB5QYBAAAAAasHQAAAAAEYCAAA4hYAIAwAAKcWACANAACfFgAgHAAAphYAICUAAJwWACAnAAClFgAgKgAAqBYAIC4AAJkWACAvAACaFgAgMAAAmxYAIDEAAJ0WACAyAACeFgAgNAAAoRYAIDUAAKIWACA2AACjFgAgNwAApBYAIDgAAKkWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB5AYBAAAAAZYHAQAAAAGqBwEAAAABAgAAABoAIGUAANocACAhBgAAshYAIAwAAMAWACANAAC1FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAA3BwAIA4HAACKEQAgCQAAixEAIAoAAI4UACANAACMEQAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB3wYCAAAAAeUGAQAAAAGsBwEAAAABrQcBAAAAAQIAAAAjACBlAADeHAAgEAcAAJwQACAJAACdEAAgDQAAmRAAIBsAAM0QACAkAACbEAAgJgAAnhAAIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAdMGAQAAAAHUBgIAAAAB1QYBAAAAAdYGAQAAAAECAAAANwAgZQAA4BwAIAMAAAAYACBlAADaHAAgZgAA5BwAIBoAAAAYACAIAADhFgAgDAAA-hQAIA0AAPIUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgOAAA_BQAIF4AAOQcACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIRgIAADhFgAgDAAA-hQAIA0AAPIUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgOAAA_BQAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhAwAAABYAIGUAANwcACBmAADnHAAgIwAAABYAIAYAAKsSACAMAAC5EgAgDQAArhIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACBeAADnHAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEhBgAAqxIAIAwAALkSACANAACuEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhAwAAACEAIGUAAN4cACBmAADqHAAgEAAAACEAIAcAAPMQACAJAAD0EAAgCgAAjBQAIA0AAPUQACBeAADqHAAg9AUBAL8MACH5BQEAvwwAIfoFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh3wYCAPUPACHlBgEAwAwAIawHAQC_DAAhrQcBAL8MACEOBwAA8xAAIAkAAPQQACAKAACMFAAgDQAA9RAAIPQFAQC_DAAh-QUBAL8MACH6BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAId8GAgD1DwAh5QYBAMAMACGsBwEAvwwAIa0HAQC_DAAhAwAAADUAIGUAAOAcACBmAADtHAAgEgAAADUAIAcAAPoPACAJAAD7DwAgDQAA9w8AIBsAAMwQACAkAAD5DwAgJgAA_A8AIF4AAO0cACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIdQGAgD1DwAh1QYBAL8MACHWBgEAwAwAIRAHAAD6DwAgCQAA-w8AIA0AAPcPACAbAADMEAAgJAAA-Q8AICYAAPwPACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACHTBgEAwAwAIdQGAgD1DwAh1QYBAL8MACHWBgEAwAwAIQf0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAZwGAQAAAAGdBgEAAAABGAgAAOIWACAMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJQAAnBYAICcAAKUWACAqAACoFgAgLgAAmRYAIC8AAJoWACAwAACbFgAgMQAAnRYAIDIAAJ4WACA0AAChFgAgNgAAoxYAIDcAAKQWACA4AACpFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAeQGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAaACBlAADvHAAgIQYAALIWACAMAADAFgAgDQAAtRYAIBEAALYWACAcAAC9FgAgJQAAsBYAICcAALwWACAqAADBFgAgLgAArRYAIC8AAK4WACAwAACxFgAgMQAAsxYAIDIAALQWACA0AAC4FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIEkAAMUWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGoBgAAAJgHA80GAQAAAAHTBgEAAAABlgcBAAAAAZkHAQAAAAECAAAA-QQAIGUAAPEcACAQBwAAnBAAIAkAAJ0QACANAACZEAAgEQAAmhAAIBsAAM0QACAmAACeEAAg9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAHNBgEAAAAB0wYBAAAAAdQGAgAAAAHVBgEAAAAB1gYBAAAAAQIAAAA3ACBlAADzHAAgGAgAAOIWACAMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJQAAnBYAICcAAKUWACAqAACoFgAgLgAAmRYAIC8AAJoWACAwAACbFgAgMQAAnRYAIDIAAJ4WACA0AAChFgAgNQAAohYAIDcAAKQWACA4AACpFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAeQGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAaACBlAAD1HAAgIQYAALIWACAMAADAFgAgDQAAtRYAIBEAALYWACAcAAC9FgAgJQAAsBYAICcAALwWACAqAADBFgAgLgAArRYAIC8AAK4WACAwAACxFgAgMQAAsxYAIDIAALQWACA0AAC4FgAgNQAAuRYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIEkAAMUWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGoBgAAAJgHA80GAQAAAAHTBgEAAAABlgcBAAAAAZkHAQAAAAECAAAA-QQAIGUAAPccACAPAwAAog8AIAcAAKAPACAJAAChDwAgDQAAow8AIBoAAKUPACAcAACmDwAgIgAApw8AIPQFAQAAAAH4BQEAAAAB-QUBAAAAAfoFAQAAAAH7BQEAAAAB_AVAAAAAAf0FQAAAAAHJBgEAAAABAgAAAJ0BACBlAAD5HAAgAwAAABgAIGUAAPUcACBmAAD9HAAgGgAAABgAIAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDcAAPcUACA4AAD8FAAgXgAA_RwAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhGAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDcAAPcUACA4AAD8FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEDAAAAFgAgZQAA9xwAIGYAAIAdACAjAAAAFgAgBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIF4AAIAdACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAISEGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEDAAAAUwAgZQAA-RwAIGYAAIMdACARAAAAUwAgAwAA0g4AIAcAANAOACAJAADRDgAgDQAA0w4AIBoAANUOACAcAADWDgAgIgAA1w4AIF4AAIMdACD0BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAwAwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIckGAQC_DAAhDwMAANIOACAHAADQDgAgCQAA0Q4AIA0AANMOACAaAADVDgAgHAAA1g4AICIAANcOACD0BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAwAwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIckGAQC_DAAhCvQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABoAYBAAAAAaEGAQAAAAGiBgEAAAABowYBAAAAAaQGQAAAAAEDAAAAGAAgZQAA7xwAIGYAAIcdACAaAAAAGAAgCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA2AAD2FAAgNwAA9xQAIDgAAPwUACBeAACHHQAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEYCAAA4RYAIAwAAPoUACANAADyFAAgEQAA8xQAIBwAAPkUACAlAADvFAAgJwAA-BQAICoAAPsUACAuAADsFAAgLwAA7RQAIDAAAO4UACAxAADwFAAgMgAA8RQAIDQAAPQUACA2AAD2FAAgNwAA9xQAIDgAAPwUACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIQMAAAAWACBlAADxHAAgZgAAih0AICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAgXgAAih0AIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQMAAAA1ACBlAADzHAAgZgAAjR0AIBIAAAA1ACAHAAD6DwAgCQAA-w8AIA0AAPcPACARAAD4DwAgGwAAzBAAICYAAPwPACBeAACNHQAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACHUBgIA9Q8AIdUGAQC_DAAh1gYBAMAMACEQBwAA-g8AIAkAAPsPACANAAD3DwAgEQAA-A8AIBsAAMwQACAmAAD8DwAg9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAh0wYBAMAMACHUBgIA9Q8AIdUGAQC_DAAh1gYBAMAMACEK9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGcBgEAAAABpQYBAAAAAaYGAQAAAAGoBgAAAKgGAqkGQAAAAAEYCAAA4hYAIAwAAKcWACANAACfFgAgEQAAoBYAIBwAAKYWACAlAACcFgAgJwAApRYAICoAAKgWACAuAACZFgAgLwAAmhYAIDAAAJsWACAxAACdFgAgMgAAnhYAIDUAAKIWACA2AACjFgAgNwAApBYAIDgAAKkWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAHTBgEAAAAB5AYBAAAAAZYHAQAAAAGqBwEAAAABAgAAABoAIGUAAI8dACAhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBIAADEFgAgSQAAxRYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAAkR0AICIEAADVGAAgBQAA1hgAIAYAANcYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE4AAN4YACBPAADfGAAgUAAA4BgAIFEAAOEYACBSAADiGAAgUwAA4xgAIFQAAOQYACBVAADlGAAgVgAA5hgAIFcAAOcYACBYAADoGAAg9AUBAAAAAfgFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAGCBwEAAAABwwcBAAAAAcQHIAAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABAgAAAPYCACBlAACTHQAgIgQAANUYACAFAADWGAAgBgAA1xgAIBAAANgYACAZAADZGAAgQAAA2hgAIEwAANsYACBNAADdGAAgTgAA3hgAIE8AAN8YACBQAADgGAAgUQAA4RgAIFIAAOIYACBTAADjGAAgVAAA5BgAIFUAAOUYACBWAADmGAAgVwAA5xgAIFgAAOgYACD0BQEAAAAB-AUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAYIHAQAAAAHDBwEAAAABxAcgAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAECAAAA9gIAIGUAAJUdACAM9AUBAAAAAfkFAQAAAAH6BQEAAAAB_AVAAAAAAf0FQAAAAAGlBgEAAAAB4QYBAAAAAeIGAQAAAAHjBgAAsREAIOQGAQAAAAHlBgEAAAAB5gYBAAAAAQIAAADnBgAgZQAAlx0AIAMAAAAYACBlAACPHQAgZgAAmx0AIBoAAAAYACAIAADhFgAgDAAA-hQAIA0AAPIUACARAADzFAAgHAAA-RQAICUAAO8UACAnAAD4FAAgKgAA-xQAIC4AAOwUACAvAADtFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgOAAA_BQAIF4AAJsdACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACHTBgEAwAwAIeQGAQDADAAhlgcBAMAMACGqBwEAvwwAIRgIAADhFgAgDAAA-hQAIA0AAPIUACARAADzFAAgHAAA-RQAICUAAO8UACAnAAD4FAAgKgAA-xQAIC4AAOwUACAvAADtFAAgMAAA7hQAIDEAAPAUACAyAADxFAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgOAAA_BQAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhAwAAABYAIGUAAJEdACBmAACeHQAgIwAAABYAIAYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA1AACyEgAgNgAAsxIAIDcAALQSACA6AAClEgAgOwAAqBIAID8AALgSACBAAACwEgAgQQAAtxIAIEYAALsSACBHAAC8EgAgSAAAvRIAIEkAAL4SACBeAACeHQAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEhBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhAwAAAFEAIGUAAJMdACBmAAChHQAgJAAAAFEAIAQAAIoXACAFAACLFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACBeAAChHQAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhIgQAAIoXACAFAACLFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBTAACYFwAgVAAAmRcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEDAAAAUQAgZQAAlR0AIGYAAKQdACAkAAAAUQAgBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIF4AAKQdACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACBAAACPFwAgTAAAkBcAIE0AAJIXACBOAACTFwAgTwAAlBcAIFAAAJUXACBRAACWFwAgUgAAlxcAIFMAAJgXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAIQMAAADqBgAgZQAAlx0AIGYAAKcdACAOAAAA6gYAIF4AAKcdACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhpQYBAL8MACHhBgEAwAwAIeIGAQC_DAAh4wYAAKYRACDkBgEAwAwAIeUGAQDADAAh5gYBAL8MACEM9AUBAL8MACH5BQEAvwwAIfoFAQDADAAh_AVAAMEMACH9BUAAwQwAIaUGAQC_DAAh4QYBAMAMACHiBgEAvwwAIeMGAACmEQAg5AYBAMAMACHlBgEAwAwAIeYGAQC_DAAhDfQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABiQYBAAAAAaoGAQAAAAGsBgAAAKwGAq0GAQAAAAGuBkAAAAABrwZAAAAAAbAGAQAAAAGxBgEAAAABGAgAAOIWACAMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJQAAnBYAICcAAKUWACAqAACoFgAgLgAAmRYAIC8AAJoWACAwAACbFgAgMQAAnRYAIDIAAJ4WACA0AAChFgAgNQAAohYAIDYAAKMWACA4AACpFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAeQGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAaACBlAACpHQAgIQYAALIWACAMAADAFgAgDQAAtRYAIBEAALYWACAcAAC9FgAgJQAAsBYAICcAALwWACAqAADBFgAgLgAArRYAIC8AAK4WACAwAACxFgAgMQAAsxYAIDIAALQWACA0AAC4FgAgNQAAuRYAIDYAALoWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIEkAAMUWACD0BQEAAAAB_AVAAAAAAf0FQAAAAAGoBgAAAJgHA80GAQAAAAHTBgEAAAABlgcBAAAAAZkHAQAAAAECAAAA-QQAIGUAAKsdACAWBwAAkg4AIAkAAI8OACAKAACQDgAgCwAAiQ4AIA4AAI4OACAPAACMDgAgEAAAnw8AIBkAAI0OACAbAACRDgAgLAAAig4AIPQFAQAAAAH5BQEAAAAB-gUBAAAAAfwFQAAAAAH9BUAAAAABnAYBAAAAAZ0GAQAAAAGeBgEAAAABoAYBAAAAAdUGAQAAAAHlBgEAAAABqwdAAAAAAQIAAAAoACBlAACtHQAgAwAAABgAIGUAAKkdACBmAACxHQAgGgAAABgAIAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA4AAD8FAAgXgAAsR0AIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhGAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA4AAD8FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEDAAAAFgAgZQAAqx0AIGYAALQdACAjAAAAFgAgBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAxAACsEgAgMgAArRIAIDQAALESACA1AACyEgAgNgAAsxIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIF4AALQdACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAISEGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACEDAAAAJgAgZQAArR0AIGYAALcdACAYAAAAJgAgBwAA3w0AIAkAANwNACAKAADdDQAgCwAA1g0AIA4AANsNACAPAADZDQAgEAAAnQ8AIBkAANoNACAbAADeDQAgLAAA1w0AIF4AALcdACD0BQEAvwwAIfkFAQC_DAAh-gUBAMAMACH8BUAAwQwAIf0FQADBDAAhnAYBAL8MACGdBgEAvwwAIZ4GAQC_DAAhoAYBAL8MACHVBgEAvwwAIeUGAQDADAAhqwdAAMEMACEWBwAA3w0AIAkAANwNACAKAADdDQAgCwAA1g0AIA4AANsNACAPAADZDQAgEAAAnQ8AIBkAANoNACAbAADeDQAgLAAA1w0AIPQFAQC_DAAh-QUBAL8MACH6BQEAwAwAIfwFQADBDAAh_QVAAMEMACGcBgEAvwwAIZ0GAQC_DAAhngYBAL8MACGgBgEAvwwAIdUGAQC_DAAh5QYBAMAMACGrB0AAwQwAIRP0BQEAAAAB-QUBAAAAAfoFAQAAAAH8BUAAAAAB_QVAAAAAAbIGAQAAAAGzBggAAAABtAYIAAAAAbUGCAAAAAG2BggAAAABtwYIAAAAAbgGCAAAAAG5BggAAAABugYIAAAAAbsGCAAAAAG8BggAAAABvQYIAAAAAb4GCAAAAAG_BggAAAABGAgAAOIWACAMAACnFgAgDQAAnxYAIBEAAKAWACAcAACmFgAgJQAAnBYAICcAAKUWACAqAACoFgAgLgAAmRYAIC8AAJoWACAwAACbFgAgMQAAnRYAIDIAAJ4WACA0AAChFgAgNQAAohYAIDYAAKMWACA3AACkFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAAB0wYBAAAAAeQGAQAAAAGWBwEAAAABqgcBAAAAAQIAAAAaACBlAAC5HQAgDwMAAKIPACAHAACgDwAgCQAAoQ8AIA0AAKMPACATAACkDwAgGgAApQ8AIBwAAKYPACD0BQEAAAAB-AUBAAAAAfkFAQAAAAH6BQEAAAAB-wUBAAAAAfwFQAAAAAH9BUAAAAAByQYBAAAAAQIAAACdAQAgZQAAux0AICIEAADVGAAgBQAA1hgAIAYAANcYACAQAADYGAAgGQAA2RgAIDQAANwYACBAAADaGAAgTAAA2xgAIE0AAN0YACBOAADeGAAgTwAA3xgAIFAAAOAYACBRAADhGAAgUgAA4hgAIFMAAOMYACBVAADlGAAgVgAA5hgAIFcAAOcYACBYAADoGAAg9AUBAAAAAfgFAQAAAAH8BUAAAAAB_QVAAAAAAc0GAQAAAAGCBwEAAAABwwcBAAAAAcQHIAAAAAHFBwEAAAABxgcBAAAAAccHAQAAAAHIBwEAAAAByQcBAAAAAcoHAQAAAAHLBwEAAAABAgAAAPYCACBlAAC9HQAgIgQAANUYACAFAADWGAAgBgAA1xgAIBAAANgYACAZAADZGAAgNAAA3BgAIEAAANoYACBMAADbGAAgTQAA3RgAIE4AAN4YACBPAADfGAAgUAAA4BgAIFEAAOEYACBSAADiGAAgVAAA5BgAIFUAAOUYACBWAADmGAAgVwAA5xgAIFgAAOgYACD0BQEAAAAB-AUBAAAAAfwFQAAAAAH9BUAAAAABzQYBAAAAAYIHAQAAAAHDBwEAAAABxAcgAAAAAcUHAQAAAAHGBwEAAAABxwcBAAAAAcgHAQAAAAHJBwEAAAABygcBAAAAAcsHAQAAAAECAAAA9gIAIGUAAL8dACAhBgAAshYAIAwAAMAWACANAAC1FgAgEQAAthYAIBwAAL0WACAlAACwFgAgJwAAvBYAICoAAMEWACAuAACtFgAgLwAArhYAIDAAALEWACAxAACzFgAgMgAAtBYAIDQAALgWACA1AAC5FgAgNgAAuhYAIDcAALsWACA6AACsFgAgOwAArxYAID8AAL8WACBAAAC3FgAgQQAAvhYAIEYAAMIWACBHAADDFgAgSAAAxBYAIPQFAQAAAAH8BUAAAAAB_QVAAAAAAagGAAAAmAcDzQYBAAAAAdMGAQAAAAGWBwEAAAABmQcBAAAAAQIAAAD5BAAgZQAAwR0AICEGAACyFgAgDAAAwBYAIA0AALUWACARAAC2FgAgHAAAvRYAICUAALAWACAnAAC8FgAgKgAAwRYAIC4AAK0WACAvAACuFgAgMAAAsRYAIDEAALMWACAyAAC0FgAgNAAAuBYAIDUAALkWACA2AAC6FgAgNwAAuxYAIDoAAKwWACA7AACvFgAgPwAAvxYAIEAAALcWACBBAAC-FgAgRgAAwhYAIEcAAMMWACBJAADFFgAg9AUBAAAAAfwFQAAAAAH9BUAAAAABqAYAAACYBwPNBgEAAAAB0wYBAAAAAZYHAQAAAAGZBwEAAAABAgAAAPkEACBlAADDHQAgAwAAABgAIGUAALkdACBmAADHHQAgGgAAABgAIAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA3AAD3FAAgXgAAxx0AIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhGAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMQAA8BQAIDIAAPEUACA0AAD0FAAgNQAA9RQAIDYAAPYUACA3AAD3FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEDAAAAUwAgZQAAux0AIGYAAModACARAAAAUwAgAwAA0g4AIAcAANAOACAJAADRDgAgDQAA0w4AIBMAANQOACAaAADVDgAgHAAA1g4AIF4AAModACD0BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAwAwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIckGAQC_DAAhDwMAANIOACAHAADQDgAgCQAA0Q4AIA0AANMOACATAADUDgAgGgAA1Q4AIBwAANYOACD0BQEAvwwAIfgFAQDADAAh-QUBAL8MACH6BQEAwAwAIfsFAQC_DAAh_AVAAMEMACH9BUAAwQwAIckGAQC_DAAhAwAAAFEAIGUAAL0dACBmAADNHQAgJAAAAFEAIAQAAIoXACAFAACLFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACBeAADNHQAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhIgQAAIoXACAFAACLFwAgBgAAjBcAIBAAAI0XACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFUAAJoXACBWAACbFwAgVwAAnBcAIFgAAJ0XACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEDAAAAUQAgZQAAvx0AIGYAANAdACAkAAAAUQAgBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIF4AANAdACD0BQEAvwwAIfgFAQDADAAh_AVAAMEMACH9BUAAwQwAIc0GAQC_DAAhggcBAL8MACHDBwEAvwwAIcQHIAChDgAhxQcBAMAMACHGBwEAwAwAIccHAQDADAAhyAcBAMAMACHJBwEAwAwAIcoHAQDADAAhywcBAL8MACEiBAAAihcAIAUAAIsXACAGAACMFwAgEAAAjRcAIBkAAI4XACA0AACRFwAgQAAAjxcAIEwAAJAXACBNAACSFwAgTgAAkxcAIE8AAJQXACBQAACVFwAgUQAAlhcAIFIAAJcXACBUAACZFwAgVQAAmhcAIFYAAJsXACBXAACcFwAgWAAAnRcAIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAIQMAAAAWACBlAADBHQAgZgAA0x0AICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgXgAA0x0AIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQMAAAAWACBlAADDHQAgZgAA1h0AICMAAAAWACAGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDEAAKwSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBJAAC-EgAgXgAA1h0AIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIagGAACJEpgHI80GAQC_DAAh0wYBAMAMACGWBwEAwAwAIZkHAQDADAAhIQYAAKsSACAMAAC5EgAgDQAArhIAIBEAAK8SACAcAAC2EgAgJQAAqRIAICcAALUSACAqAAC6EgAgLgAAphIAIC8AAKcSACAwAACqEgAgMQAArBIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEkAAL4SACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAIQ_0BQEAAAAB_AVAAAAAAf0FQAAAAAGgBgEAAAABrAYAAACIBwKuBkAAAAABsQYBAAAAAYYHAAAAhgcCiAcBAAAAAYkHAQAAAAGKBwEAAAABiwcBAAAAAYwHAQAAAAGNBwEAAAABjgdAAAAAAQMAAABRACBlAACVHAAgZgAA2h0AICQAAABRACAEAACKFwAgBQAAixcAIAYAAIwXACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAgXgAA2h0AIPQFAQC_DAAh-AUBAMAMACH8BUAAwQwAIf0FQADBDAAhzQYBAL8MACGCBwEAvwwAIcMHAQC_DAAhxAcgAKEOACHFBwEAwAwAIcYHAQDADAAhxwcBAMAMACHIBwEAwAwAIckHAQDADAAhygcBAMAMACHLBwEAvwwAISIEAACKFwAgBQAAixcAIAYAAIwXACAZAACOFwAgNAAAkRcAIEAAAI8XACBMAACQFwAgTQAAkhcAIE4AAJMXACBPAACUFwAgUAAAlRcAIFEAAJYXACBSAACXFwAgUwAAmBcAIFQAAJkXACBVAACaFwAgVgAAmxcAIFcAAJwXACBYAACdFwAg9AUBAL8MACH4BQEAwAwAIfwFQADBDAAh_QVAAMEMACHNBgEAvwwAIYIHAQC_DAAhwwcBAL8MACHEByAAoQ4AIcUHAQDADAAhxgcBAMAMACHHBwEAwAwAIcgHAQDADAAhyQcBAMAMACHKBwEAwAwAIcsHAQC_DAAhAwAAABgAIGUAAJccACBmAADdHQAgGgAAABgAIAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAgXgAA3R0AIPQFAQC_DAAh_AVAAMEMACH9BUAAwQwAIdMGAQDADAAh5AYBAMAMACGWBwEAwAwAIaoHAQC_DAAhGAgAAOEWACAMAAD6FAAgDQAA8hQAIBEAAPMUACAcAAD5FAAgJQAA7xQAICcAAPgUACAqAAD7FAAgLgAA7BQAIC8AAO0UACAwAADuFAAgMgAA8RQAIDQAAPQUACA1AAD1FAAgNgAA9hQAIDcAAPcUACA4AAD8FAAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAh0wYBAMAMACHkBgEAwAwAIZYHAQDADAAhqgcBAL8MACEDAAAAFgAgZQAAmRwAIGYAAOAdACAjAAAAFgAgBgAAqxIAIAwAALkSACANAACuEgAgEQAArxIAIBwAALYSACAlAACpEgAgJwAAtRIAICoAALoSACAuAACmEgAgLwAApxIAIDAAAKoSACAyAACtEgAgNAAAsRIAIDUAALISACA2AACzEgAgNwAAtBIAIDoAAKUSACA7AACoEgAgPwAAuBIAIEAAALASACBBAAC3EgAgRgAAuxIAIEcAALwSACBIAAC9EgAgSQAAvhIAIF4AAOAdACD0BQEAvwwAIfwFQADBDAAh_QVAAMEMACGoBgAAiRKYByPNBgEAvwwAIdMGAQDADAAhlgcBAMAMACGZBwEAwAwAISEGAACrEgAgDAAAuRIAIA0AAK4SACARAACvEgAgHAAAthIAICUAAKkSACAnAAC1EgAgKgAAuhIAIC4AAKYSACAvAACnEgAgMAAAqhIAIDIAAK0SACA0AACxEgAgNQAAshIAIDYAALMSACA3AAC0EgAgOgAApRIAIDsAAKgSACA_AAC4EgAgQAAAsBIAIEEAALcSACBGAAC7EgAgRwAAvBIAIEgAAL0SACBJAAC-EgAg9AUBAL8MACH8BUAAwQwAIf0FQADBDAAhqAYAAIkSmAcjzQYBAL8MACHTBgEAwAwAIZYHAQDADAAhmQcBAMAMACECAwACBwAGFQQGAwUKBAYNARARBRUAPBmkAhM0pwIpQKUCLkymAi5NqAIpTqoCOU-rAhRQrAIUUa4COlKyAjtTswIaVLQCGlW1AjZWtgI2V7cCMli4AjQBAwACAQMAAgoDAAIHAAYJAAgNmAILEZkCEBUAOCKdAhokmgIRSpsCKUucAiUbBs4BAQzoAQ0N0QELEdIBEBUANxzkARclzAEPJ-MBGCrpAQwuxgEJL8cBHTDNAQoxzwEFMtABEzTfASk14AERNuEBEjfiASU6FQc7ywEiP-cBL0DWAS5B5gExRu0BMkf7ATZI_QEaSf4BGgMHFwYVAC05GwgTCBwHDLEBDQ2fAQsRoAEQFQAsHLABFyWaAQ8nrwEYKrIBDC4gCS-YAR0wmQEKMZsBBTKeARM0pAEpNaoBETarARI3rgElOLMBGgUHAAYJAAgNkwELDyQKFQAoBgcABgkACAolCQ0pCxGQARAVACcMBwAGCYwBCAqNAQkLLQwOAA8PAAoQAAUVACYZABMbAA4siAEkLYoBJQUHgwEGCYQBCCgADSkACysAIgUHfgYJfwgLLgwVACEbMA4GDDQNDXMLFQAgHHgXJTgPJ3cYCAcABglqCA05CxE9EBUAHxsADiRCESZsHQUHAAYJPggOAA8PAAoQAAUGBwAGCUMIDgAPEAAFFQAcI0cSBAcABgloCBIAERkAEwkDAAIHAAYJSAgNSQsTShIVABsaThQcWBciXhoEFgAVFwACGFICGVQTAhRPFBUAFgEUUAAFBwAGCQAIGQATGwAOHQAYBQcABgkACBUAGRsADhxZFwEcWgAHEGEFGF8CGWATHgAGHwAGIAACIWIIBQ1jABNkABplABxmACJnAAEjaQAEBwAGCW0IFQAeJW4PASVvAAMNcAARcQAkcgAFDHkADXsAHH0AJXoAJ3wAAQuAAQADBwAGFQAjKoEBDAEqggEAASkACwQHAAYJiwEIEAAFKQALAguOAQAsjwEAAg2RAQARkgEAAg2VAQAPlAEABgcABgmpAQgQqAEFFgAqGKcBAjMAAgIUpQEpFQArARSmAQARDMIBAA26AQARuwEAHMEBACW3AQAnwAEAKsMBAC60AQAvtQEAMLYBADG4AQAyuQEANLwBADW9AQA2vgEAN78BADjEAQABOcUBAAUH2AEGFQAwPAACPdcBAj_cAS8CBwAGPt0BLgE_3gEAAQcABgUHAAYVADVCAAJE8QEzRfUBNAFDADICAwACQwAyAkT2AQBF9wEAAwcABiAAAj38AQIZBoUCAAySAgANiAIAEYkCAByQAgAlgwIAJ48CACqTAgAugAIAL4ECADCEAgAxhgIAMocCADSLAgA1jAIANo0CADeOAgA6_wEAO4ICAD-RAgBAigIARpQCAEeVAgBIlgIASZcCAAYNngIAEZ8CACKjAgAkoAIASqECAEuiAgABMwACARcAAgEDAAISBLkCAAW6AgAGuwIAELwCABm9AgA0wAIAQL4CAEy_AgBNwQIAT8ICAFDDAgBSxAIAU8UCAFTGAgBVxwIAVsgCAFfJAgBYygIAAAIDAAIHAAYCAwACBwAGAxUAQWsAQmwAQwAAAAMVAEFrAEJsAEMBKQALASkACwMVAEhrAElsAEoAAAADFQBIawBJbABKAAADFQBPawBQbABRAAAAAxUAT2sAUGwAUQEDAAIBAwACAxUAVmsAV2wAWAAAAAMVAFZrAFdsAFgBAwACAQMAAgMVAF1rAF5sAF8AAAADFQBdawBebABfAAAAAxUAZWsAZmwAZwAAAAMVAGVrAGZsAGcBAwACAQMAAgMVAGxrAG1sAG4AAAADFQBsawBtbABuAgcABgnzAwgCBwAGCfkDCAMVAHNrAHRsAHUAAAADFQBzawB0bAB1AQcABgEHAAYFFQB6awB9bAB-7QEAe-4BAHwAAAAAAAUVAHprAH1sAH7tAQB77gEAfAMHAAYJAAgKoQQJAwcABgkACAqnBAkFFQCDAWsAhgFsAIcB7QEAhAHuAQCFAQAAAAAABRUAgwFrAIYBbACHAe0BAIQB7gEAhQEIBwAGCbkECAq6BAkOAA8PAAoQAAUZABMbAA4IBwAGCcAECArBBAkOAA8PAAoQAAUZABMbAA4DFQCMAWsAjQFsAI4BAAAAAxUAjAFrAI0BbACOAQEI0wQHAQjZBAcDFQCTAWsAlAFsAJUBAAAAAxUAkwFrAJQBbACVAQEH6wQGAQfxBAYDFQCaAWsAmwFsAJwBAAAAAxUAmgFrAJsBbACcAQAAAxUAoQFrAKIBbACjAQAAAAMVAKEBawCiAWwAowEDB5wFBjwAAj2bBQIDB6MFBjwAAj2iBQIFFQCoAWsAqwFsAKwB7QEAqQHuAQCqAQAAAAAABRUAqAFrAKsBbACsAe0BAKkB7gEAqgEDBwAGIAACPbUFAgMHAAYgAAI9uwUCAxUAsQFrALIBbACzAQAAAAMVALEBawCyAWwAswEHEM8FBRjNBQIZzgUTHgAGHwAGIAACIdAFCAcQ2AUFGNYFAhnXBRMeAAYfAAYgAAIh2QUIAxUAuAFrALkBbAC6AQAAAAMVALgBawC5AWwAugECBwAGQgACAgcABkIAAgMVAL8BawDAAWwAwQEAAAADFQC_AWsAwAFsAMEBAUMAMgFDADIDFQDGAWsAxwFsAMgBAAAAAxUAxgFrAMcBbADIAQIDAAJDADICAwACQwAyAxUAzQFrAM4BbADPAQAAAAMVAM0BawDOAWwAzwEDBwAGCQAIGwAOAwcABgkACBsADgUVANQBawDXAWwA2AHtAQDVAe4BANYBAAAAAAAFFQDUAWsA1wFsANgB7QEA1QHuAQDWAQUHAAYJAAgZABMbAA4dABgFBwAGCQAIGQATGwAOHQAYBRUA3QFrAOABbADhAe0BAN4B7gEA3wEAAAAAAAUVAN0BawDgAWwA4QHtAQDeAe4BAN8BAQcABgEHAAYDFQDmAWsA5wFsAOgBAAAAAxUA5gFrAOcBbADoAQAAAxUA7QFrAO4BbADvAQAAAAMVAO0BawDuAWwA7wEAAAMVAPQBawD1AWwA9gEAAAADFQD0AWsA9QFsAPYBAgcABgkACAIHAAYJAAgFFQD7AWsA_gFsAP8B7QEA_AHuAQD9AQAAAAAABRUA-wFrAP4BbAD_Ae0BAPwB7gEA_QEFB7kHBgm6BwgoAA0pAAsrACIFB8AHBgnBBwgoAA0pAAsrACIDFQCEAmsAhQJsAIYCAAAAAxUAhAJrAIUCbACGAgMH1AcGCdUHCBvTBw4DB9wHBgndBwgb2wcOAxUAiwJrAIwCbACNAgAAAAMVAIsCawCMAmwAjQIEBwAGCe8HCBsADibwBx0EBwAGCfYHCBsADib3Bx0FFQCSAmsAlQJsAJYC7QEAkwLuAQCUAgAAAAAABRUAkgJrAJUCbACWAu0BAJMC7gEAlAIAAAMVAJsCawCcAmwAnQIAAAADFQCbAmsAnAJsAJ0CARcAAgEXAAIDFQCiAmsAowJsAKQCAAAAAxUAogJrAKMCbACkAgQWABUXAAIYuQgCGboIEwQWABUXAAIYwAgCGcEIEwMVAKkCawCqAmwAqwIAAAADFQCpAmsAqgJsAKsCAwMAAgcABgnTCAgDAwACBwAGCdkICAMVALACawCxAmwAsgIAAAADFQCwAmsAsQJsALICAgcABj7rCC4CBwAGPvEILgUVALcCawC6AmwAuwLtAQC4Au4BALkCAAAAAAAFFQC3AmsAugJsALsC7QEAuALuAQC5AgQHAAYJgwkIEAAFKQALBAcABgmJCQgQAAUpAAsFFQDAAmsAwwJsAMQC7QEAwQLuAQDCAgAAAAAABRUAwAJrAMMCbADEAu0BAMEC7gEAwgIGBwAGCZ0JCBCcCQUWACoYmwkCMwACBgcABgmlCQgQpAkFFgAqGKMJAjMAAgMVAMkCawDKAmwAywIAAAADFQDJAmsAygJsAMsCBAcABgm3CQgOAA8QAAUEBwAGCb0JCA4ADxAABQMVANACawDRAmwA0gIAAAADFQDQAmsA0QJsANICBAcABgnPCQgSABEZABMEBwAGCdUJCBIAERkAEwMVANcCawDYAmwA2QIAAAADFQDXAmsA2AJsANkCBQcABgnnCQgOAA8PAAoQAAUFBwAGCe0JCA4ADw8AChAABQMVAN4CawDfAmwA4AIAAAADFQDeAmsA3wJsAOACATMAAgEzAAIDFQDlAmsA5gJsAOcCAAAAAxUA5QJrAOYCbADnAgMDAAIHAAYJAAgDAwACBwAGCQAIAxUA7AJrAO0CbADuAgAAAAMVAOwCawDtAmwA7gJZAgFaywIBW8wCAVzNAgFdzgIBX9ACAWDSAj1h0wI-YtUCAWPXAj1k2AI_Z9kCAWjaAgFp2wI9bd4CQG7fAkRv4AIkcOECJHHiAiRy4wIkc-QCJHTmAiR16AI9dukCRXfrAiR47QI9ee4CRnrvAiR78AIkfPECPX30Akd-9QJLf_cCAoAB-AICgQH6AgKCAfsCAoMB_AIChAH-AgKFAYADPYYBgQNMhwGDAwKIAYUDPYkBhgNNigGHAwKLAYgDAowBiQM9jQGMA06OAY0DUo8BjgMDkAGPAwORAZADA5IBkQMDkwGSAwOUAZQDA5UBlgM9lgGXA1OXAZkDA5gBmwM9mQGcA1SaAZ0DA5sBngMDnAGfAz2dAaIDVZ4BowNZnwGkAwSgAaUDBKEBpgMEogGnAwSjAagDBKQBqgMEpQGsAz2mAa0DWqcBrwMEqAGxAz2pAbIDW6oBswMEqwG0AwSsAbUDPa0BuANcrgG5A2CvAbsDYbABvANhsQG_A2GyAcADYbMBwQNhtAHDA2G1AcUDPbYBxgNitwHIA2G4AcoDPbkBywNjugHMA2G7Ac0DYbwBzgM9vQHRA2S-AdIDaL8B0wM7wAHUAzvBAdUDO8IB1gM7wwHXAzvEAdkDO8UB2wM9xgHcA2nHAd4DO8gB4AM9yQHhA2rKAeIDO8sB4wM7zAHkAz3NAecDa84B6ANvzwHpAx3QAeoDHdEB6wMd0gHsAx3TAe0DHdQB7wMd1QHxAz3WAfIDcNcB9QMd2AH3Az3ZAfgDcdoB-gMd2wH7Ax3cAfwDPd0B_wNy3gGABHbfAYEEIuABggQi4QGDBCLiAYQEIuMBhQQi5AGHBCLlAYkEPeYBigR35wGMBCLoAY4EPekBjwR46gGQBCLrAZEEIuwBkgQ97wGVBHnwAZYEf_EBlwQK8gGYBArzAZkECvQBmgQK9QGbBAr2AZ0ECvcBnwQ9-AGgBIAB-QGjBAr6AaUEPfsBpgSBAfwBqAQK_QGpBAr-AaoEPf8BrQSCAYACrgSIAYECrwQLggKwBAuDArEEC4QCsgQLhQKzBAuGArUEC4cCtwQ9iAK4BIkBiQK8BAuKAr4EPYsCvwSKAYwCwgQLjQLDBAuOAsQEPY8CxwSLAZACyASPAZECyQQIkgLKBAiTAssECJQCzAQIlQLNBAiWAs8ECJcC0QQ9mALSBJABmQLVBAiaAtcEPZsC2ASRAZwC2gQInQLbBAieAtwEPZ8C3wSSAaAC4ASWAaEC4QQHogLiBAejAuMEB6QC5AQHpQLlBAemAucEB6cC6QQ9qALqBJcBqQLtBAeqAu8EPasC8ASYAawC8gQHrQLzBAeuAvQEPa8C9wSZAbAC-ASdAbEC-gQGsgL7BAazAv0EBrQC_gQGtQL_BAa2AoEFBrcCgwU9uAKEBZ4BuQKGBQa6AogFPbsCiQWfAbwCigUGvQKLBQa-AowFPb8CjwWgAcACkAWkAcECkQUuwgKSBS7DApMFLsQClAUuxQKVBS7GApcFLscCmQU9yAKaBaUByQKeBS7KAqAFPcsCoQWmAcwCpAUuzQKlBS7OAqYFPc8CqQWnAdACqgWtAdECqwU20gKsBTbTAq0FNtQCrgU21QKvBTbWArEFNtcCswU92AK0Ba4B2QK3BTbaArkFPdsCugWvAdwCvAU23QK9BTbeAr4FPd8CwQWwAeACwgW0AeECwwUa4gLEBRrjAsUFGuQCxgUa5QLHBRrmAskFGucCywU96ALMBbUB6QLSBRrqAtQFPesC1QW2AewC2gUa7QLbBRruAtwFPe8C3wW3AfAC4AW7AfEC4QUy8gLiBTLzAuMFMvQC5AUy9QLlBTL2AucFMvcC6QU9-ALqBbwB-QLsBTL6Au4FPfsC7wW9AfwC8AUy_QLxBTL-AvIFPf8C9QW-AYAD9gXCAYED9wUzggP4BTODA_kFM4QD-gUzhQP7BTOGA_0FM4cD_wU9iAOABsMBiQOCBjOKA4QGPYsDhQbEAYwDhgYzjQOHBjOOA4gGPY8DiwbFAZADjAbJAZEDjQY0kgOOBjSTA48GNJQDkAY0lQORBjSWA5MGNJcDlQY9mAOWBsoBmQOYBjSaA5oGPZsDmwbLAZwDnAY0nQOdBjSeA54GPZ8DoQbMAaADogbQAaEDowYYogOkBhijA6UGGKQDpgYYpQOnBhimA6kGGKcDqwY9qAOsBtEBqQOuBhiqA7AGPasDsQbSAawDsgYYrQOzBhiuA7QGPa8DtwbTAbADuAbZAbEDuQYXsgO6BhezA7sGF7QDvAYXtQO9Bhe2A78GF7cDwQY9uAPCBtoBuQPEBhe6A8YGPbsDxwbbAbwDyAYXvQPJBhe-A8oGPb8DzQbcAcADzgbiAcED0AYxwgPRBjHDA9MGMcQD1AYxxQPVBjHGA9cGMccD2QY9yAPaBuMByQPcBjHKA94GPcsD3wbkAcwD4AYxzQPhBjHOA-IGPc8D5QblAdAD5gbpAdED6AYq0gPpBirTA-wGKtQD7QYq1QPuBirWA_AGKtcD8gY92APzBuoB2QP1BiraA_cGPdsD-AbrAdwD-QYq3QP6BireA_sGPd8D_gbsAeAD_wbwAeEDgQcV4gOCBxXjA4UHFeQDhgcV5QOHBxXmA4kHFecDiwc96AOMB_EB6QOOBxXqA5AHPesDkQfyAewDkgcV7QOTBxXuA5QHPe8DlwfzAfADmAf3AfEDmQcJ8gOaBwnzA5sHCfQDnAcJ9QOdBwn2A58HCfcDoQc9-AOiB_gB-QOkBwn6A6YHPfsDpwf5AfwDqAcJ_QOpBwn-A6oHPf8DrQf6AYAErgeAAoEErwcMggSwBwyDBLEHDIQEsgcMhQSzBwyGBLUHDIcEtwc9iAS4B4ECiQS8BwyKBL4HPYsEvweCAowEwgcMjQTDBwyOBMQHPY8ExweDApAEyAeHApEEyQcNkgTKBw2TBMsHDZQEzAcNlQTNBw2WBM8HDZcE0Qc9mATSB4gCmQTXBw2aBNkHPZsE2geJApwE3gcNnQTfBw2eBOAHPZ8E4weKAqAE5AeOAqEE5QcPogTmBw-jBOcHD6QE6AcPpQTpBw-mBOsHD6cE7Qc9qATuB48CqQTyBw-qBPQHPasE9QeQAqwE-AcPrQT5Bw-uBPoHPa8E_QeRArAE_geXArEEgAgOsgSBCA6zBIMIDrQEhAgOtQSFCA62BIcIDrcEiQg9uASKCJgCuQSMCA66BI4IPbsEjwiZArwEkAgOvQSRCA6-BJIIPb8ElQiaAsAElgieAsEEmAg6wgSZCDrDBJsIOsQEnAg6xQSdCDrGBJ8IOscEoQg9yASiCJ8CyQSkCDrKBKYIPcsEpwigAswEqAg6zQSpCDrOBKoIPc8ErQihAtAErgilAtEErwgU0gSwCBTTBLEIFNQEsggU1QSzCBTWBLUIFNcEtwg92AS4CKYC2QS8CBTaBL4IPdsEvwinAtwEwggU3QTDCBTeBMQIPd8ExwioAuAEyAisAuEEyQgT4gTKCBPjBMsIE-QEzAgT5QTNCBPmBM8IE-cE0Qg96ATSCK0C6QTVCBPqBNcIPesE2AiuAuwE2ggT7QTbCBPuBNwIPe8E3wivAvAE4AizAvEE4Qgv8gTiCC_zBOMIL_QE5Agv9QTlCC_2BOcIL_cE6Qg9-ATqCLQC-QTtCC_6BO8IPfsE8Ai1AvwE8ggv_QTzCC_-BPQIPf8E9wi2AoAF-Ai8AoEF-QglggX6CCWDBfsIJYQF_AglhQX9CCWGBf8IJYcFgQk9iAWCCb0CiQWFCSWKBYcJPYsFiAm-AowFigkljQWLCSWOBYwJPY8Fjwm_ApAFkAnFApEFkQkpkgWSCSmTBZMJKZQFlAkplQWVCSmWBZcJKZcFmQk9mAWaCcYCmQWfCSmaBaEJPZsFognHApwFpgkpnQWnCSmeBagJPZ8FqwnIAqAFrAnMAqEFrQkRogWuCRGjBa8JEaQFsAkRpQWxCRGmBbMJEacFtQk9qAW2Cc0CqQW5CRGqBbsJPasFvAnOAqwFvgkRrQW_CRGuBcAJPa8FwwnPArAFxAnTArEFxQkSsgXGCRKzBccJErQFyAkStQXJCRK2BcsJErcFzQk9uAXOCdQCuQXRCRK6BdMJPbsF1AnVArwF1gkSvQXXCRK-BdgJPb8F2wnWAsAF3AnaAsEF3QkQwgXeCRDDBd8JEMQF4AkQxQXhCRDGBeMJEMcF5Qk9yAXmCdsCyQXpCRDKBesJPcsF7AncAswF7gkQzQXvCRDOBfAJPc8F8wndAtAF9AnhAtEF9gk50gX3CTnTBfkJOdQF-gk51QX7CTnWBf0JOdcF_wk92AWACuIC2QWCCjnaBYQKPdsFhQrjAtwFhgo53QWHCjneBYgKPd8FiwrkAuAFjAroAuEFjQoF4gWOCgXjBY8KBeQFkAoF5QWRCgXmBZMKBecFlQo96AWWCukC6QWYCgXqBZoKPesFmwrqAuwFnAoF7QWdCgXuBZ4KPe8FoQrrAvAFogrvAg"
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
function createHttpError8(statusCode, message) {
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
    throw createHttpError8(
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
    throw createHttpError8(
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
    throw createHttpError8(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError8(400, "Only pending applications can receive subscription payments");
  }
  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID) {
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
    throw createHttpError8(502, failureMessage);
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
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
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
  const totalFeeAmount = toMoneyNumber3(feeConfiguration.totalFeeAmount);
  const monthlyFeeAmount = toMoneyNumber3(feeConfiguration.monthlyFeeAmount);
  const paidAmount = toMoneyNumber3(
    successfulPayments.reduce((sum, item) => sum + toMoneyNumber3(item.amount), 0)
  );
  const dueAmount = toMoneyNumber3(Math.max(0, totalFeeAmount - paidAmount));
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
    requestedAmount = toMoneyNumber3(Math.min(dueAmount, monthlyFeeAmount * monthsCount));
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
