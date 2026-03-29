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
import { Router as Router10 } from "express";

// src/app/module/department/department.route.ts
import { Router } from "express";

// src/generated/prisma/enums.ts
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
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                    Program[]\n  batches                     Batch[]\n  courses                     Course[]\n  sections                    Section[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum StudentFeePaymentMode {\n  MONTHLY\n  FULL\n}\n\nenum StudentFeePaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                               @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                             @default(now())\n  updatedAt                   DateTime                             @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n  feeConfigurations           DepartmentSemesterFeeConfiguration[]\n  feePayments                 StudentFeePayment[]\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel DepartmentSemesterFeeConfiguration {\n  id               String      @id @default(uuid())\n  institutionId    String\n  institution      Institution @relation(fields: [institutionId], references: [id])\n  departmentId     String\n  department       Department  @relation(fields: [departmentId], references: [id])\n  semesterId       String\n  semester         Semester    @relation(fields: [semesterId], references: [id])\n  totalFeeAmount   Decimal     @db.Decimal(12, 2)\n  monthlyFeeAmount Decimal     @db.Decimal(12, 2)\n  currency         String      @default("BDT")\n  isActive         Boolean     @default(true)\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  feePayments StudentFeePayment[]\n\n  @@unique([departmentId, semesterId])\n  @@index([institutionId, departmentId])\n  @@index([semesterId])\n  @@map("department_semester_fee_configurations")\n}\n\nmodel StudentFeePayment {\n  id                 String                             @id @default(uuid())\n  institutionId      String\n  institution        Institution                        @relation(fields: [institutionId], references: [id])\n  departmentId       String\n  department         Department                         @relation(fields: [departmentId], references: [id])\n  semesterId         String\n  semester           Semester                           @relation(fields: [semesterId], references: [id])\n  studentProfileId   String\n  studentProfile     StudentProfile                     @relation(fields: [studentProfileId], references: [id])\n  feeConfigurationId String\n  feeConfiguration   DepartmentSemesterFeeConfiguration @relation(fields: [feeConfigurationId], references: [id])\n  paymentMode        StudentFeePaymentMode\n  status             StudentFeePaymentStatus            @default(INITIATED)\n  monthsCovered      Int\n  amount             Decimal                            @db.Decimal(12, 2)\n  currency           String                             @default("BDT")\n  gatewayName        String                             @default("SSLCOMMERZ")\n  tranId             String                             @unique\n  gatewaySessionKey  String?                            @unique\n  gatewayValId       String?\n  gatewayBankTranId  String?\n  gatewayCardType    String?\n  gatewayStatus      String?\n  gatewayRawPayload  Json?\n  paymentInitiatedAt DateTime                           @default(now())\n  paidAt             DateTime?\n  createdAt          DateTime                           @default(now())\n  updatedAt          DateTime                           @updatedAt\n\n  @@index([studentProfileId, semesterId])\n  @@index([departmentId, semesterId])\n  @@index([status])\n  @@map("student_fee_payments")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  startTime DateTime\n  endTime   DateTime\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String                               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n  feeConfigurations   DepartmentSemesterFeeConfiguration[]\n  feePayments         StudentFeePayment[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n  feePayments           StudentFeePayment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentToStudentFeePayment"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"InstitutionToStudentFeePayment"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"DepartmentSemesterFeeConfiguration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"DepartmentSemesterFeeConfigurationToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToDepartmentSemesterFeeConfiguration"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"totalFeeAmount","kind":"scalar","type":"Decimal"},{"name":"monthlyFeeAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"}],"dbName":"department_semester_fee_configurations"},"StudentFeePayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentFeePayment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentFeePayment"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SemesterToStudentFeePayment"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentFeePaymentToStudentProfile"},{"name":"feeConfigurationId","kind":"scalar","type":"String"},{"name":"feeConfiguration","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToStudentFeePayment"},{"name":"paymentMode","kind":"enum","type":"StudentFeePaymentMode"},{"name":"status","kind":"enum","type":"StudentFeePaymentStatus"},{"name":"monthsCovered","kind":"scalar","type":"Int"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"gatewayName","kind":"scalar","type":"String"},{"name":"tranId","kind":"scalar","type":"String"},{"name":"gatewaySessionKey","kind":"scalar","type":"String"},{"name":"gatewayValId","kind":"scalar","type":"String"},{"name":"gatewayBankTranId","kind":"scalar","type":"String"},{"name":"gatewayCardType","kind":"scalar","type":"String"},{"name":"gatewayStatus","kind":"scalar","type":"String"},{"name":"gatewayRawPayload","kind":"scalar","type":"Json"},{"name":"paymentInitiatedAt","kind":"scalar","type":"DateTime"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_fee_payments"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"},{"name":"feeConfigurations","kind":"object","type":"DepartmentSemesterFeeConfiguration","relationName":"DepartmentSemesterFeeConfigurationToSemester"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"SemesterToStudentFeePayment"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"feePayments","kind":"object","type":"StudentFeePayment","relationName":"StudentFeePaymentToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","_count","schedule","courseRegistration","routines","classRoom","attendances","teacherProfile","mark","course","courseRegistrations","section","sectionTeacherAssignments","classworks","sections","semester","studentProfile","feeConfiguration","feePayments","feeConfigurations","batch","submissions","classwork","classworkSubmissions","applications","posting","studentUser","reviewerUser","admissionApplications","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","departments","faculties","classrooms","applicantUser","reviewedByUser","institutionApplications","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","DepartmentSemesterFeeConfiguration.findUnique","DepartmentSemesterFeeConfiguration.findUniqueOrThrow","DepartmentSemesterFeeConfiguration.findFirst","DepartmentSemesterFeeConfiguration.findFirstOrThrow","DepartmentSemesterFeeConfiguration.findMany","DepartmentSemesterFeeConfiguration.createOne","DepartmentSemesterFeeConfiguration.createMany","DepartmentSemesterFeeConfiguration.createManyAndReturn","DepartmentSemesterFeeConfiguration.updateOne","DepartmentSemesterFeeConfiguration.updateMany","DepartmentSemesterFeeConfiguration.updateManyAndReturn","DepartmentSemesterFeeConfiguration.upsertOne","DepartmentSemesterFeeConfiguration.deleteOne","DepartmentSemesterFeeConfiguration.deleteMany","DepartmentSemesterFeeConfiguration.groupBy","DepartmentSemesterFeeConfiguration.aggregate","StudentFeePayment.findUnique","StudentFeePayment.findUniqueOrThrow","StudentFeePayment.findFirst","StudentFeePayment.findFirstOrThrow","StudentFeePayment.findMany","StudentFeePayment.createOne","StudentFeePayment.createMany","StudentFeePayment.createManyAndReturn","StudentFeePayment.updateOne","StudentFeePayment.updateMany","StudentFeePayment.updateManyAndReturn","StudentFeePayment.upsertOne","StudentFeePayment.deleteOne","StudentFeePayment.deleteMany","StudentFeePayment.groupBy","StudentFeePayment.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","feeConfigurationId","StudentFeePaymentMode","paymentMode","StudentFeePaymentStatus","monthsCovered","amount","currency","gatewayName","tranId","gatewaySessionKey","gatewayValId","gatewayBankTranId","gatewayCardType","gatewayStatus","gatewayRawPayload","paymentInitiatedAt","paidAt","totalFeeAmount","monthlyFeeAmount","isActive","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","InstitutionApplicationStatus","rejectionReason","reviewedByUserId","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","role","accountStatus","date","AttendanceStatus","AdminRole","postingId_teacherUserId","postingId_studentUserId","departmentId_semesterId","sectionId_courseId","classworkId_studentProfileId","courseRegistrationId_date","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "rhexAqAECwMAAL8IACAHAAC9CQAg6QQAAPcJADDqBAAACwAQ6wQAAPcJADDsBAEAAAAB8QQBALoIACHzBAEAAAAB9ARAAL4IACH1BEAAvggAIZQGAAD4CZkGIgEAAAABACAMAwAAvwgAIOkEAAD6CQAw6gQAAAMAEOsEAAD6CQAw7AQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACH9BUAAvggAIYkGAQC6CAAhigYBALsIACGLBgEAuwgAIQMDAADGCwAgigYAAPsJACCLBgAA-wkAIAwDAAC_CAAg6QQAAPoJADDqBAAAAwAQ6wQAAPoJADDsBAEAAAAB8wQBALoIACH0BEAAvggAIfUEQAC-CAAh_QVAAL4IACGJBgEAAAABigYBALsIACGLBgEAuwgAIQMAAAADACABAAAEADACAAAFACARAwAAvwgAIOkEAAD5CQAw6gQAAAcAEOsEAAD5CQAw7AQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACGABgEAuggAIYEGAQC6CAAhggYBALsIACGDBgEAuwgAIYQGAQC7CAAhhQZAALcJACGGBkAAtwkAIYcGAQC7CAAhiAYBALsIACEIAwAAxgsAIIIGAAD7CQAggwYAAPsJACCEBgAA-wkAIIUGAAD7CQAghgYAAPsJACCHBgAA-wkAIIgGAAD7CQAgEQMAAL8IACDpBAAA-QkAMOoEAAAHABDrBAAA-QkAMOwEAQAAAAHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACGABgEAuggAIYEGAQC6CAAhggYBALsIACGDBgEAuwgAIYQGAQC7CAAhhQZAALcJACGGBkAAtwkAIYcGAQC7CAAhiAYBALsIACEDAAAABwAgAQAACAAwAgAACQAgCwMAAL8IACAHAAC9CQAg6QQAAPcJADDqBAAACwAQ6wQAAPcJADDsBAEAuggAIfEEAQC6CAAh8wQBALoIACH0BEAAvggAIfUEQAC-CAAhlAYAAPgJmQYiAgMAAMYLACAHAADQEwAgAwAAAAsAIAEAAAwAMAIAAAEAIBUDAAC_CAAgBwAAvQkAIAkAANQJACAVAADbCAAgFwAAkgkAIBgAAJQJACA4AADvCAAgOQAAlgkAIOkEAAD2CQAw6gQAAA4AEOsEAAD2CQAw7AQBALoIACHtBAEAuggAIe4EAQC6CAAh7wQBALoIACHwBAEAuwgAIfEEAQC6CAAh8gQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACEJAwAAxgsAIAcAANATACAJAADTEwAgFQAAqw0AIBcAAPARACAYAADyEQAgOAAApw4AIDkAAPQRACDwBAAA-wkAIBUDAAC_CAAgBwAAvQkAIAkAANQJACAVAADbCAAgFwAAkgkAIBgAAJQJACA4AADvCAAgOQAAlgkAIOkEAAD2CQAw6gQAAA4AEOsEAAD2CQAw7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBALoIACHwBAEAuwgAIfEEAQC6CAAh8gQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACEDAAAADgAgAQAADwAwAgAAEAAgDAcAALkJACAyAAD1CQAg6QQAAPQJADDqBAAAEgAQ6wQAAPQJADDsBAEAuggAIfEEAQC7CAAh9ARAAL4IACH1BEAAvggAIcIFAQC7CAAh7AUBALsIACHzBQEAuggAIQUHAADQEwAgMgAA4xMAIPEEAAD7CQAgwgUAAPsJACDsBQAA-wkAIAwHAAC5CQAgMgAA9QkAIOkEAAD0CQAw6gQAABIAEOsEAAD0CQAw7AQBAAAAAfEEAQC7CAAh9ARAAL4IACH1BEAAvggAIcIFAQC7CAAh7AUBALsIACHzBQEAuggAIQMAAAASACABAAATADACAAAUACAdBgAAjwkAIBUAANsIACAXAACSCQAgGQAA2ggAIB0AAN0IACAeAADcCAAgKAAAiwkAICkAAIwJACAqAACOCQAgKwAAkAkAICwAAJEJACAuAADvCAAgLwAAlAkAIDAAAJUJACAxAACWCQAgMwAAigkAIDQAAI0JACA3AACTCQAg6QQAAIgJADDqBAAAFgAQ6wQAAIgJADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGgBQAAiQnuBSO8BQEAuggAIcIFAQC7CAAh7AUBALsIACHvBQEAuwgAIQEAAAAWACAZCAAA8wkAIBUAANsIACAXAACSCQAgGQAA2ggAIB0AAN0IACAeAADcCAAgKAAAiwkAICkAAIwJACAqAACOCQAgKwAAkAkAICwAAJEJACAuAADvCAAgLwAAlAkAIDAAAJUJACAxAACWCQAg6QQAAPIJADDqBAAAGAAQ6wQAAPIJADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACHCBQEAuwgAIdMFAQC7CAAh7AUBALsIACHzBQEAuggAIRIIAADiEwAgFQAAqw0AIBcAAPARACAZAACqDQAgHQAArQ0AIB4AAKwNACAoAADpEQAgKQAA6hEAICoAAOwRACArAADuEQAgLAAA7xEAIC4AAKcOACAvAADyEQAgMAAA8xEAIDEAAPQRACDCBQAA-wkAINMFAAD7CQAg7AUAAPsJACAZCAAA8wkAIBUAANsIACAXAACSCQAgGQAA2ggAIB0AAN0IACAeAADcCAAgKAAAiwkAICkAAIwJACAqAACOCQAgKwAAkAkAICwAAJEJACAuAADvCAAgLwAAlAkAIDAAAJUJACAxAACWCQAg6QQAAPIJADDqBAAAGAAQ6wQAAPIJADDsBAEAAAAB9ARAAL4IACH1BEAAvggAIcIFAQC7CAAh0wUBALsIACHsBQEAuwgAIfMFAQC6CAAhAwAAABgAIAEAABkAMAIAABoAIAEAAAASACASBwAAvQkAIAkAANQJACAUAACOCQAgFQAA2wgAIOkEAADxCQAw6gQAAB0AEOsEAADxCQAw7AQBALoIACHxBAEAuggAIfIEAQC6CAAh9ARAAL4IACH1BEAAvggAIZ0FAQC6CAAhwgUBALsIACHMBQEAuwgAIc0FQAC3CQAhzgUIAL8JACHPBQgAvwkAIQkHAADQEwAgCQAA0xMAIBQAAOwRACAVAACrDQAgwgUAAPsJACDMBQAA-wkAIM0FAAD7CQAgzgUAAPsJACDPBQAA-wkAIBIHAAC9CQAgCQAA1AkAIBQAAI4JACAVAADbCAAg6QQAAPEJADDqBAAAHQAQ6wQAAPEJADDsBAEAAAAB8QQBALoIACHyBAEAuggAIfQEQAC-CAAh9QRAAL4IACGdBQEAuggAIcIFAQC7CAAhzAUBALsIACHNBUAAtwkAIc4FCAC_CQAhzwUIAL8JACEDAAAAHQAgAQAAHgAwAgAAHwAgEgcAAL0JACAJAADUCQAgCgAA7wkAIBUAANsIACAXAACSCQAg6QQAAPAJADDqBAAAIQAQ6wQAAPAJADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHOBQIA2wkAIdQFAQC7CAAh9QUBALoIACH2BQEAuggAIQgHAADQEwAgCQAA0xMAIAoAAOETACAVAACrDQAgFwAA8BEAIMIFAAD7CQAgzgUAAPsJACDUBQAA-wkAIBIHAAC9CQAgCQAA1AkAIAoAAO8JACAVAADbCAAgFwAAkgkAIOkEAADwCQAw6gQAACEAEOsEAADwCQAw7AQBAAAAAfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHOBQIA2wkAIdQFAQC7CAAh9QUBAAAAAfYFAQC6CAAhAwAAACEAIAEAACIAMAIAACMAIAEAAAAdACAaBwAAvQkAIAkAAMIJACAKAADvCQAgCwAA5wgAIBEAAO0JACASAADBCQAgEwAA7gkAIBQAAOIJACAWAADfCQAgGgAA1QkAIBsAANYJACDpBAAA7AkAMOoEAAAmABDrBAAA7AkAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGUBQEAuggAIZUFAQC6CAAhlgUBALoIACGYBQEAuggAIcQFAQC6CAAh1AUBALsIACH0BUAAvggAIQ0HAADQEwAgCQAA0xMAIAoAAOETACALAADGDQAgEQAA3xMAIBIAANITACATAADgEwAgFAAA2xMAIBYAANoTACAaAADXEwAgGwAA1hMAIPIEAAD7CQAg1AUAAPsJACAaBwAAvQkAIAkAAMIJACAKAADvCQAgCwAA5wgAIBEAAO0JACASAADBCQAgEwAA7gkAIBQAAOIJACAWAADfCQAgGgAA1QkAIBsAANYJACDpBAAA7AkAMOoEAAAmABDrBAAA7AkAMOwEAQAAAAHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlQUBALoIACGWBQEAuggAIZgFAQC6CAAhxAUBALoIACHUBQEAuwgAIfQFQAC-CAAhAwAAACYAIAEAACcAMAIAACgAIA8NAADqCQAgDgAAwAkAIBAAAOsJACDpBAAA6QkAMOoEAAAqABDrBAAA6QkAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIaoFAQC6CAAhvAUBALoIACHCBQEAuwgAIckFAQC7CAAhygUBALoIACHLBQEAuggAIQUNAADdEwAgDgAA0RMAIBAAAN4TACDCBQAA-wkAIMkFAAD7CQAgDw0AAOoJACAOAADACQAgEAAA6wkAIOkEAADpCQAw6gQAACoAEOsEAADpCQAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGqBQEAuggAIbwFAQC6CAAhwgUBALsIACHJBQEAuwgAIcoFAQC6CAAhywUBALoIACEDAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACADAAAAKgAgAQAAKwAwAgAALAAgAQAAACoAIAoOAADACQAg6QQAAOcJADDqBAAAMgAQ6wQAAOcJADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGkBQAA6AmYBiKqBQEAuggAIZYGQAC-CAAhAQ4AANETACALDgAAwAkAIOkEAADnCQAw6gQAADIAEOsEAADnCQAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGkBQAA6AmYBiKqBQEAuggAIZYGQAC-CAAhngYAAOYJACADAAAAMgAgAQAAMwAwAgAANAAgGwcAAL0JACAJAADCCQAgDgAAwAkAIBIAAMEJACDpBAAAvgkAMOoEAAA2ABDrBAAAvgkAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGWBQEAuggAIaoFAQC6CAAhqwUIAL8JACGsBQgAvwkAIa0FCAC_CQAhrgUIAL8JACGvBQgAvwkAIbAFCAC_CQAhsQUIAL8JACGyBQgAvwkAIbMFCAC_CQAhtAUIAL8JACG1BQgAvwkAIbYFCAC_CQAhtwUIAL8JACEBAAAANgAgAQAAABgAIAEAAAAYACADAAAAJgAgAQAAJwAwAgAAKAAgEgcAAL0JACAJAADCCQAgGwAA1gkAICEAAOUJACDpBAAA5AkAMOoEAAA7ABDrBAAA5AkAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGXBQEAuggAIZgFAQC6CAAhmQUBALsIACGaBQEAuwgAIZsFAQC7CAAhnAVAAL4IACEIBwAA0BMAIAkAANMTACAbAADWEwAgIQAA3BMAIPIEAAD7CQAgmQUAAPsJACCaBQAA-wkAIJsFAAD7CQAgEwcAAL0JACAJAADCCQAgGwAA1gkAICEAAOUJACDpBAAA5AkAMOoEAAA7ABDrBAAA5AkAMOwEAQAAAAHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZcFAQC6CAAhmAUBALoIACGZBQEAuwgAIZoFAQC7CAAhmwUBALsIACGcBUAAvggAIZ0GAADjCQAgAwAAADsAIAEAADwAMAIAAD0AIAMAAAAmACABAAAnADACAAAoACAQBwAAvQkAIAkAAMIJACASAADBCQAgFAAA4gkAIBYAAN8JACDpBAAA4QkAMOoEAABAABDrBAAA4QkAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGUBQEAuggAIZUFAQC6CAAhlgUBALoIACEGBwAA0BMAIAkAANMTACASAADSEwAgFAAA2xMAIBYAANoTACDyBAAA-wkAIBEHAAC9CQAgCQAAwgkAIBIAAMEJACAUAADiCQAgFgAA3wkAIOkEAADhCQAw6gQAAEAAEOsEAADhCQAw7AQBAAAAAfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlAUBALoIACGVBQEAuggAIZYFAQC6CAAhnAYAAOAJACADAAAAQAAgAQAAQQAwAgAAQgAgAQAAABgAIBMHAAC9CQAgCQAAwgkAIBIAAMEJACAWAADfCQAgIAAAlQkAIOkEAADdCQAw6gQAAEUAEOsEAADdCQAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlgUBALoIACGdBQEAuggAIZ4FAQC7CAAhoAUAAN4JoAUioQVAALcJACEIBwAA0BMAIAkAANMTACASAADSEwAgFgAA2hMAICAAAPMRACDyBAAA-wkAIJ4FAAD7CQAgoQUAAPsJACATBwAAvQkAIAkAAMIJACASAADBCQAgFgAA3wkAICAAAJUJACDpBAAA3QkAMOoEAABFABDrBAAA3QkAMOwEAQAAAAHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlgUBALoIACGdBQEAuggAIZ4FAQC7CAAhoAUAAN4JoAUioQVAALcJACEDAAAARQAgAQAARgAwAgAARwAgAQAAABgAIBQHAAC9CQAgCQAAwgkAIBUAANsIACAXAACSCQAgGAAAlAkAIBoAANUJACAfAADcCQAg6QQAANoJADDqBAAASgAQ6wQAANoJADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIcMFAgDbCQAhxAUBALoIACHFBQEAuwgAIQsHAADQEwAgCQAA0xMAIBUAAKsNACAXAADwEQAgGAAA8hEAIBoAANcTACAfAADZEwAg8gQAAPsJACDCBQAA-wkAIMMFAAD7CQAgxQUAAPsJACAUBwAAvQkAIAkAAMIJACAVAADbCAAgFwAAkgkAIBgAAJQJACAaAADVCQAgHwAA3AkAIOkEAADaCQAw6gQAAEoAEOsEAADaCQAw7AQBAAAAAfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIcMFAgDbCQAhxAUBALoIACHFBQEAuwgAIQMAAABKACABAABLADACAABMACADAAAAJgAgAQAAJwAwAgAAKAAgEQcAAL0JACAJAADUCQAgGgAA1QkAIB0AAN0IACDpBAAA2QkAMOoEAABPABDrBAAA2QkAMOwEAQC6CAAh8QQBALoIACHyBAEAuggAIfQEQAC-CAAh9QRAAL4IACHEBQEAuggAIdwFAQC6CAAh5wUQANIJACHoBRAA0gkAIekFIAC9CAAhBAcAANATACAJAADTEwAgGgAA1xMAIB0AAK0NACASBwAAvQkAIAkAANQJACAaAADVCQAgHQAA3QgAIOkEAADZCQAw6gQAAE8AEOsEAADZCQAw7AQBAAAAAfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhxAUBALoIACHcBQEAuggAIecFEADSCQAh6AUQANIJACHpBSAAvQgAIZsGAADYCQAgAwAAAE8AIAEAAFAAMAIAAFEAIB8HAAC9CQAgCQAA1AkAIBoAANUJACAbAADWCQAgHAAA1wkAIOkEAADPCQAw6gQAAFMAEOsEAADPCQAw7AQBALoIACHxBAEAuggAIfIEAQC6CAAh9ARAAL4IACH1BEAAvggAIZgFAQC6CAAhpAUAANEJ2gUixAUBALoIACHWBQEAuggAIdgFAADQCdgFItoFAgC7CQAh2wUQANIJACHcBQEAuggAId0FAQC6CAAh3gUBALoIACHfBQEAuwgAIeAFAQC7CAAh4QUBALsIACHiBQEAuwgAIeMFAQC7CAAh5AUAANMJACDlBUAAvggAIeYFQAC3CQAhDAcAANATACAJAADTEwAgGgAA1xMAIBsAANYTACAcAADYEwAg3wUAAPsJACDgBQAA-wkAIOEFAAD7CQAg4gUAAPsJACDjBQAA-wkAIOQFAAD7CQAg5gUAAPsJACAfBwAAvQkAIAkAANQJACAaAADVCQAgGwAA1gkAIBwAANcJACDpBAAAzwkAMOoEAABTABDrBAAAzwkAMOwEAQAAAAHxBAEAuggAIfIEAQC6CAAh9ARAAL4IACH1BEAAvggAIZgFAQC6CAAhpAUAANEJ2gUixAUBALoIACHWBQEAuggAIdgFAADQCdgFItoFAgC7CQAh2wUQANIJACHcBQEAuggAId0FAQC6CAAh3gUBAAAAAd8FAQAAAAHgBQEAuwgAIeEFAQC7CAAh4gUBALsIACHjBQEAuwgAIeQFAADTCQAg5QVAAL4IACHmBUAAtwkAIQMAAABTACABAABUADACAABVACABAAAAUwAgAwAAAFMAIAEAAFQAMAIAAFUAIAEAAABKACABAAAAJgAgAQAAAE8AIAEAAABTACANBwAAvQkAIAkAAMIJACAZAADaCAAg6QQAAMkJADDqBAAAXQAQ6wQAAMkJADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIQEAAABdACABAAAAGAAgAwAAAEoAIAEAAEsAMAIAAEwAIAEAAABKACABAAAAJgAgAQAAAEAAIAEAAABFACABAAAAGAAgAwAAADsAIAEAADwAMAIAAD0AIAEAAAA7ACABAAAAGAAgExsAAM4JACAkAADNCQAgJQAAvwgAICYAALgJACDpBAAAywkAMOoEAABpABDrBAAAywkAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIZgFAQC7CAAhogUBALsIACGkBQAAzAm6BSKlBQEAuwgAIaYFQAC3CQAhpwVAAL4IACGoBQEAuggAIakFAQC7CAAhugUBALoIACEJGwAA1hMAICQAANUTACAlAADGCwAgJgAAxgsAIJgFAAD7CQAgogUAAPsJACClBQAA-wkAIKYFAAD7CQAgqQUAAPsJACAUGwAAzgkAICQAAM0JACAlAAC_CAAgJgAAuAkAIOkEAADLCQAw6gQAAGkAEOsEAADLCQAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGYBQEAuwgAIaIFAQC7CAAhpAUAAMwJugUipQUBALsIACGmBUAAtwkAIacFQAC-CAAhqAUBALoIACGpBQEAuwgAIboFAQC6CAAhmgYAAMoJACADAAAAaQAgAQAAagAwAgAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIAEAAABpACAgBAAApwkAIAUAAKgJACAGAACPCQAgEgAAkAkAIBsAAJEJACAuAADvCAAgNwAAkwkAIDoAAJMJACA7AADvCAAgPAAAqQkAID0AAOwIACA-AADsCAAgPwAAqgkAIEAAAKsJACDpBAAApgkAMOoEAABvABDrBAAApgkAMOwEAQC6CAAh8AQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACGMBgEAuggAIY0GIAC9CAAhjgYBALsIACGPBgEAuwgAIZAGAQC7CAAhkQYBALsIACGSBgEAuwgAIZMGAQC7CAAhlAYBALoIACGVBgEAuggAIQEAAABvACASAwAAvwgAIAcAAL0JACAJAADCCQAgFQAA2wgAIB0AAN0IACAiAACVCQAgJwAA7AgAIOkEAADICQAw6gQAAHEAEOsEAADICQAw7AQBALoIACHwBAEAuwgAIfEEAQC6CAAh8gQBALsIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACG4BQEAuggAIQEAAABxACADAAAAUwAgAQAAVAAwAgAAVQAgAQAAACYAIAEAAAA7ACABAAAAaQAgAQAAAFMAIAEAAAAYACABAAAAHQAgAQAAACoAIAEAAAAyACADAAAAQAAgAQAAQQAwAgAAQgAgAQAAACYAIAEAAABAACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAACEAIAEAAAAmACAFBwAA0BMAIAkAANMTACAZAACqDQAg8gQAAPsJACDCBQAA-wkAIA0HAAC9CQAgCQAAwgkAIBkAANoIACDpBAAAyQkAMOoEAABdABDrBAAAyQkAMOwEAQAAAAHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIbwFAQC6CAAhwgUBALsIACEDAAAAXQAgAQAAggEAMAIAAIMBACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAAEoAIAEAAEsAMAIAAEwAIAMAAAAOACABAAAPADACAAAQACAJAwAAxgsAIAcAANATACAJAADTEwAgFQAAqw0AIB0AAK0NACAiAADzEQAgJwAAlg4AIPAEAAD7CQAg8gQAAPsJACASAwAAvwgAIAcAAL0JACAJAADCCQAgFQAA2wgAIB0AAN0IACAiAACVCQAgJwAA7AgAIOkEAADICQAw6gQAAHEAEOsEAADICQAw7AQBAAAAAfAEAQC7CAAh8QQBALoIACHyBAEAuwgAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIbgFAQAAAAEDAAAAcQAgAQAAiAEAMAIAAIkBACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAAEAAIAEAAEEAMAIAAEIAIBcHAAC9CQAgCQAAwgkAIBIAAMcJACAkAADGCQAgJgAAuAkAIC0AAL8IACDpBAAAxAkAMOoEAACNAQAQ6wQAAMQJADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhgQUBALoIACGWBQEAuwgAIaIFAQC7CAAhpAUAAMUJpAUipQUBALsIACGmBUAAtwkAIacFQAC-CAAhqAUBALoIACGpBQEAuwgAIQwHAADQEwAgCQAA0xMAIBIAANITACAkAADUEwAgJgAAxgsAIC0AAMYLACDyBAAA-wkAIJYFAAD7CQAgogUAAPsJACClBQAA-wkAIKYFAAD7CQAgqQUAAPsJACAYBwAAvQkAIAkAAMIJACASAADHCQAgJAAAxgkAICYAALgJACAtAAC_CAAg6QQAAMQJADDqBAAAjQEAEOsEAADECQAw7AQBAAAAAfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhgQUBALoIACGWBQEAuwgAIaIFAQC7CAAhpAUAAMUJpAUipQUBALsIACGmBUAAtwkAIacFQAC-CAAhqAUBALoIACGpBQEAuwgAIZkGAADDCQAgAwAAAI0BACABAACOAQAwAgAAjwEAIAMAAACNAQAgAQAAjgEAMAIAAI8BACABAAAAjQEAIAEAAABvACABAAAADgAgAQAAABgAIAMAAABFACABAABGADACAABHACADAAAAOwAgAQAAPAAwAgAAPQAgEgcAANATACAJAADTEwAgDgAA0RMAIBIAANITACDyBAAA-wkAIKsFAAD7CQAgrAUAAPsJACCtBQAA-wkAIK4FAAD7CQAgrwUAAPsJACCwBQAA-wkAILEFAAD7CQAgsgUAAPsJACCzBQAA-wkAILQFAAD7CQAgtQUAAPsJACC2BQAA-wkAILcFAAD7CQAgGwcAAL0JACAJAADCCQAgDgAAwAkAIBIAAMEJACDpBAAAvgkAMOoEAAA2ABDrBAAAvgkAMOwEAQAAAAHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZYFAQC6CAAhqgUBAAAAAasFCAC_CQAhrAUIAL8JACGtBQgAvwkAIa4FCAC_CQAhrwUIAL8JACGwBQgAvwkAIbEFCAC_CQAhsgUIAL8JACGzBQgAvwkAIbQFCAC_CQAhtQUIAL8JACG2BQgAvwkAIbcFCAC_CQAhAwAAADYAIAEAAJgBADACAACZAQAgAwAAAE8AIAEAAFAAMAIAAFEAIAMAAABTACABAABUADACAABVACABAAAAHQAgAQAAAF0AIAEAAAAhACABAAAASgAgAQAAAA4AIAEAAABxACABAAAAJgAgAQAAAEAAIAEAAACNAQAgAQAAAEUAIAEAAAA7ACABAAAANgAgAQAAAE8AIAEAAABTACABAAAAGAAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAABdACABAACCAQAwAgAAgwEAIA4HAAC9CQAgDwAA5wgAIOkEAAC6CQAw6gQAAK4BABDrBAAAugkAMOwEAQC6CAAh8QQBALoIACH0BEAAvggAIfUEQAC-CAAhvAUBALsIACH3BQEAuggAIfgFAQC6CAAh-QUCALsJACH7BQAAvAn7BSIDBwAA0BMAIA8AAMYNACC8BQAA-wkAIA4HAAC9CQAgDwAA5wgAIOkEAAC6CQAw6gQAAK4BABDrBAAAugkAMOwEAQAAAAHxBAEAuggAIfQEQAC-CAAh9QRAAL4IACG8BQEAuwgAIfcFAQC6CAAh-AUBALoIACH5BQIAuwkAIfsFAAC8CfsFIgMAAACuAQAgAQAArwEAMAIAALABACADAAAASgAgAQAASwAwAgAATAAgAwAAACEAIAEAACIAMAIAACMAIAMAAAALACABAAAMADACAAABACADAAAADgAgAQAADwAwAgAAEAAgAwAAAHEAIAEAAIgBADACAACJAQAgAwAAACYAIAEAACcAMAIAACgAIAMAAABAACABAABBADACAABCACAUBwAAuQkAIDUAAL8IACA2AAC4CQAg6QQAALUJADDqBAAAuQEAEOsEAAC1CQAw7AQBALoIACHxBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGkBQAAtgnxBSKmBUAAtwkAIcIFAQC7CAAh6gUBALoIACHrBQEAuggAIewFAQC7CAAh7gUAAIkJ7gUj7wUBALsIACHxBQEAuwgAIfIFAQC7CAAhCwcAANATACA1AADGCwAgNgAAxgsAIPEEAAD7CQAgpgUAAPsJACDCBQAA-wkAIOwFAAD7CQAg7gUAAPsJACDvBQAA-wkAIPEFAAD7CQAg8gUAAPsJACAUBwAAuQkAIDUAAL8IACA2AAC4CQAg6QQAALUJADDqBAAAuQEAEOsEAAC1CQAw7AQBAAAAAfEEAQC7CAAh9ARAAL4IACH1BEAAvggAIaQFAAC2CfEFIqYFQAC3CQAhwgUBALsIACHqBQEAuggAIesFAQC6CAAh7AUBALsIACHuBQAAiQnuBSPvBQEAuwgAIfEFAQC7CAAh8gUBALsIACEDAAAAuQEAIAEAALoBADACAAC7AQAgAQAAAG8AIAEAAAAWACADAAAAjQEAIAEAAI4BADACAACPAQAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAAA7ACABAAA8ADACAAA9ACADAAAANgAgAQAAmAEAMAIAAJkBACADAAAATwAgAQAAUAAwAgAAUQAgAwAAAFMAIAEAAFQAMAIAAFUAIAEAAAASACABAAAAHQAgAQAAAF0AIAEAAACuAQAgAQAAAEoAIAEAAAAhACABAAAACwAgAQAAAA4AIAEAAABxACABAAAAJgAgAQAAAEAAIAEAAAC5AQAgAQAAAI0BACABAAAARQAgAQAAADsAIAEAAAA2ACABAAAATwAgAQAAAFMAIAMAAAAmACABAAAnADACAAAoACADAAAAQAAgAQAAQQAwAgAAQgAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAACNAQAgAQAAjgEAMAIAAI8BACADAAAANgAgAQAAmAEAMAIAAJkBACABAAAAJgAgAQAAAEAAIAEAAABFACABAAAAjQEAIAEAAAA2ACADAAAAcQAgAQAAiAEAMAIAAIkBACADAAAAuQEAIAEAALoBADACAAC7AQAgAwAAALkBACABAAC6AQAwAgAAuwEAIAMAAACNAQAgAQAAjgEAMAIAAI8BACADAAAAjQEAIAEAAI4BADACAACPAQAgES0AAL8IACDpBAAAuQgAMOoEAADmAQAQ6wQAALkIADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGBBQEAuggAIYIFAQC6CAAhgwUBALoIACGEBQEAuggAIYUFAQC7CAAhhgUAALMIACCHBQAAswgAIIgFAAC8CAAgiQUAALwIACCKBSAAvQgAIQEAAADmAQAgAwAAAGkAIAEAAGoAMAIAAGsAIAMAAABpACABAABqADACAABrACANJQAAvwgAIOkEAADXCAAw6gQAAOoBABDrBAAA1wgAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIYIFAQC6CAAhgwUBALoIACGIBQAAvAgAIIoFIAC9CAAhugUBALoIACG7BQAAswgAIAEAAADqAQAgCgMAAL8IACDpBAAAtAkAMOoEAADsAQAQ6wQAALQJADDsBAEAuggAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIfwFAQC6CAAh_QVAAL4IACEBAwAAxgsAIAoDAAC_CAAg6QQAALQJADDqBAAA7AEAEOsEAAC0CQAw7AQBAAAAAfMEAQAAAAH0BEAAvggAIfUEQAC-CAAh_AUBALoIACH9BUAAvggAIQMAAADsAQAgAQAA7QEAMAIAAO4BACABAAAAAwAgAQAAAAcAIAEAAAALACABAAAADgAgAQAAAHEAIAEAAAC5AQAgAQAAALkBACABAAAAjQEAIAEAAACNAQAgAQAAAGkAIAEAAABpACABAAAA7AEAIAEAAAABACADAAAACwAgAQAADAAwAgAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACAIAwAAzg8AIAcAAJwTACDsBAEAAAAB8QQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAZQGAAAAmQYCAUYAAIACACAG7AQBAAAAAfEEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAGUBgAAAJkGAgFGAACCAgAwAUYAAIICADAIAwAAzA8AIAcAAJoTACDsBAEA_wkAIfEEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhlAYAAMoPmQYiAgAAAAEAIEYAAIUCACAG7AQBAP8JACHxBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZQGAADKD5kGIgIAAAALACBGAACHAgAgAgAAAAsAIEYAAIcCACADAAAAAQAgTQAAgAIAIE4AAIUCACABAAAAAQAgAQAAAAsAIAMMAADNEwAgUwAAzxMAIFQAAM4TACAJ6QQAALAJADDqBAAAjgIAEOsEAACwCQAw7AQBAKcIACHxBAEApwgAIfMEAQCnCAAh9ARAAKkIACH1BEAAqQgAIZQGAACxCZkGIgMAAAALACABAACNAgAwUgAAjgIAIAMAAAALACABAAAMADACAAABACABAAAANAAgAQAAADQAIAMAAAAyACABAAAzADACAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAcOAADMEwAg7AQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAACYBgKqBQEAAAABlgZAAAAAAQFGAACWAgAgBuwEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAAmAYCqgUBAAAAAZYGQAAAAAEBRgAAmAIAMAFGAACYAgAwBw4AAMsTACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGkBQAAlguYBiKqBQEA_wkAIZYGQACBCgAhAgAAADQAIEYAAJsCACAG7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhpAUAAJYLmAYiqgUBAP8JACGWBkAAgQoAIQIAAAAyACBGAACdAgAgAgAAADIAIEYAAJ0CACADAAAANAAgTQAAlgIAIE4AAJsCACABAAAANAAgAQAAADIAIAMMAADIEwAgUwAAyhMAIFQAAMkTACAJ6QQAAKwJADDqBAAApAIAEOsEAACsCQAw7AQBAKcIACH0BEAAqQgAIfUEQACpCAAhpAUAAK0JmAYiqgUBAKcIACGWBkAAqQgAIQMAAAAyACABAACjAgAwUgAApAIAIAMAAAAyACABAAAzADACAAA0ACAgBAAApwkAIAUAAKgJACAGAACPCQAgEgAAkAkAIBsAAJEJACAuAADvCAAgNwAAkwkAIDoAAJMJACA7AADvCAAgPAAAqQkAID0AAOwIACA-AADsCAAgPwAAqgkAIEAAAKsJACDpBAAApgkAMOoEAABvABDrBAAApgkAMOwEAQAAAAHwBAEAuwgAIfQEQAC-CAAh9QRAAL4IACG8BQEAuggAIYwGAQAAAAGNBiAAvQgAIY4GAQC7CAAhjwYBALsIACGQBgEAuwgAIZEGAQC7CAAhkgYBALsIACGTBgEAuwgAIZQGAQC6CAAhlQYBALoIACEBAAAApwIAIAEAAACnAgAgFQQAAMMTACAFAADEEwAgBgAA7REAIBIAAO4RACAbAADvEQAgLgAApw4AIDcAAPERACA6AADxEQAgOwAApw4AIDwAAMUTACA9AACWDgAgPgAAlg4AID8AAMYTACBAAADHEwAg8AQAAPsJACCOBgAA-wkAII8GAAD7CQAgkAYAAPsJACCRBgAA-wkAIJIGAAD7CQAgkwYAAPsJACADAAAAbwAgAQAAqgIAMAIAAKcCACADAAAAbwAgAQAAqgIAMAIAAKcCACADAAAAbwAgAQAAqgIAMAIAAKcCACAdBAAAtRMAIAUAALYTACAGAAC3EwAgEgAAuBMAIBsAALkTACAuAAC8EwAgNwAAuhMAIDoAALsTACA7AAC9EwAgPAAAvhMAID0AAL8TACA-AADAEwAgPwAAwRMAIEAAAMITACDsBAEAAAAB8AQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAYwGAQAAAAGNBiAAAAABjgYBAAAAAY8GAQAAAAGQBgEAAAABkQYBAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAEBRgAArgIAIA_sBAEAAAAB8AQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAYwGAQAAAAGNBiAAAAABjgYBAAAAAY8GAQAAAAGQBgEAAAABkQYBAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAEBRgAAsAIAMAFGAACwAgAwHQQAAKYSACAFAACnEgAgBgAAqBIAIBIAAKkSACAbAACqEgAgLgAArRIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhAgAAAKcCACBGAACzAgAgD-wEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIQIAAABvACBGAAC1AgAgAgAAAG8AIEYAALUCACADAAAApwIAIE0AAK4CACBOAACzAgAgAQAAAKcCACABAAAAbwAgCgwAAKMSACBTAAClEgAgVAAApBIAIPAEAAD7CQAgjgYAAPsJACCPBgAA-wkAIJAGAAD7CQAgkQYAAPsJACCSBgAA-wkAIJMGAAD7CQAgEukEAAClCQAw6gQAALwCABDrBAAApQkAMOwEAQCnCAAh8AQBAKgIACH0BEAAqQgAIfUEQACpCAAhvAUBAKcIACGMBgEApwgAIY0GIAC1CAAhjgYBAKgIACGPBgEAqAgAIZAGAQCoCAAhkQYBAKgIACGSBgEAqAgAIZMGAQCoCAAhlAYBAKcIACGVBgEApwgAIQMAAABvACABAAC7AgAwUgAAvAIAIAMAAABvACABAACqAgAwAgAApwIAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAKISACDsBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAAB_QVAAAAAAYkGAQAAAAGKBgEAAAABiwYBAAAAAQFGAADEAgAgCOwEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAH9BUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABAUYAAMYCADABRgAAxgIAMAkDAAChEgAg7AQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACH9BUAAgQoAIYkGAQD_CQAhigYBAIAKACGLBgEAgAoAIQIAAAAFACBGAADJAgAgCOwEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAh_QVAAIEKACGJBgEA_wkAIYoGAQCACgAhiwYBAIAKACECAAAAAwAgRgAAywIAIAIAAAADACBGAADLAgAgAwAAAAUAIE0AAMQCACBOAADJAgAgAQAAAAUAIAEAAAADACAFDAAAnhIAIFMAAKASACBUAACfEgAgigYAAPsJACCLBgAA-wkAIAvpBAAApAkAMOoEAADSAgAQ6wQAAKQJADDsBAEApwgAIfMEAQCnCAAh9ARAAKkIACH1BEAAqQgAIf0FQACpCAAhiQYBAKcIACGKBgEAqAgAIYsGAQCoCAAhAwAAAAMAIAEAANECADBSAADSAgAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAAJ0SACDsBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABgAYBAAAAAYEGAQAAAAGCBgEAAAABgwYBAAAAAYQGAQAAAAGFBkAAAAABhgZAAAAAAYcGAQAAAAGIBgEAAAABAUYAANoCACAN7AQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAYMGAQAAAAGEBgEAAAABhQZAAAAAAYYGQAAAAAGHBgEAAAABiAYBAAAAAQFGAADcAgAwAUYAANwCADAOAwAAnBIAIOwEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhgAYBAP8JACGBBgEA_wkAIYIGAQCACgAhgwYBAIAKACGEBgEAgAoAIYUGQACoCgAhhgZAAKgKACGHBgEAgAoAIYgGAQCACgAhAgAAAAkAIEYAAN8CACAN7AQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACGABgEA_wkAIYEGAQD_CQAhggYBAIAKACGDBgEAgAoAIYQGAQCACgAhhQZAAKgKACGGBkAAqAoAIYcGAQCACgAhiAYBAIAKACECAAAABwAgRgAA4QIAIAIAAAAHACBGAADhAgAgAwAAAAkAIE0AANoCACBOAADfAgAgAQAAAAkAIAEAAAAHACAKDAAAmRIAIFMAAJsSACBUAACaEgAgggYAAPsJACCDBgAA-wkAIIQGAAD7CQAghQYAAPsJACCGBgAA-wkAIIcGAAD7CQAgiAYAAPsJACAQ6QQAAKMJADDqBAAA6AIAEOsEAACjCQAw7AQBAKcIACHzBAEApwgAIfQEQACpCAAh9QRAAKkIACGABgEApwgAIYEGAQCnCAAhggYBAKgIACGDBgEAqAgAIYQGAQCoCAAhhQZAAMQIACGGBkAAxAgAIYcGAQCoCAAhiAYBAKgIACEDAAAABwAgAQAA5wIAMFIAAOgCACADAAAABwAgAQAACAAwAgAACQAgCekEAACiCQAw6gQAAO4CABDrBAAAogkAMOwEAQAAAAH0BEAAvggAIfUEQAC-CAAh_QVAAL4IACH-BQEAuggAIf8FAQC6CAAhAQAAAOsCACABAAAA6wIAIAnpBAAAogkAMOoEAADuAgAQ6wQAAKIJADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACH9BUAAvggAIf4FAQC6CAAh_wUBALoIACEAAwAAAO4CACABAADvAgAwAgAA6wIAIAMAAADuAgAgAQAA7wIAMAIAAOsCACADAAAA7gIAIAEAAO8CADACAADrAgAgBuwEAQAAAAH0BEAAAAAB9QRAAAAAAf0FQAAAAAH-BQEAAAAB_wUBAAAAAQFGAADzAgAgBuwEAQAAAAH0BEAAAAAB9QRAAAAAAf0FQAAAAAH-BQEAAAAB_wUBAAAAAQFGAAD1AgAwAUYAAPUCADAG7AQBAP8JACH0BEAAgQoAIfUEQACBCgAh_QVAAIEKACH-BQEA_wkAIf8FAQD_CQAhAgAAAOsCACBGAAD4AgAgBuwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIf0FQACBCgAh_gUBAP8JACH_BQEA_wkAIQIAAADuAgAgRgAA-gIAIAIAAADuAgAgRgAA-gIAIAMAAADrAgAgTQAA8wIAIE4AAPgCACABAAAA6wIAIAEAAADuAgAgAwwAAJYSACBTAACYEgAgVAAAlxIAIAnpBAAAoQkAMOoEAACBAwAQ6wQAAKEJADDsBAEApwgAIfQEQACpCAAh9QRAAKkIACH9BUAAqQgAIf4FAQCnCAAh_wUBAKcIACEDAAAA7gIAIAEAAIADADBSAACBAwAgAwAAAO4CACABAADvAgAwAgAA6wIAIAEAAADuAQAgAQAAAO4BACADAAAA7AEAIAEAAO0BADACAADuAQAgAwAAAOwBACABAADtAQAwAgAA7gEAIAMAAADsAQAgAQAA7QEAMAIAAO4BACAHAwAAlRIAIOwEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAH8BQEAAAAB_QVAAAAAAQFGAACJAwAgBuwEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAH8BQEAAAAB_QVAAAAAAQFGAACLAwAwAUYAAIsDADAHAwAAlBIAIOwEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAh_AUBAP8JACH9BUAAgQoAIQIAAADuAQAgRgAAjgMAIAbsBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIfwFAQD_CQAh_QVAAIEKACECAAAA7AEAIEYAAJADACACAAAA7AEAIEYAAJADACADAAAA7gEAIE0AAIkDACBOAACOAwAgAQAAAO4BACABAAAA7AEAIAMMAACREgAgUwAAkxIAIFQAAJISACAJ6QQAAKAJADDqBAAAlwMAEOsEAACgCQAw7AQBAKcIACHzBAEApwgAIfQEQACpCAAh9QRAAKkIACH8BQEApwgAIf0FQACpCAAhAwAAAOwBACABAACWAwAwUgAAlwMAIAMAAADsAQAgAQAA7QEAMAIAAO4BACABAAAAgwEAIAEAAACDAQAgAwAAAF0AIAEAAIIBADACAACDAQAgAwAAAF0AIAEAAIIBADACAACDAQAgAwAAAF0AIAEAAIIBADACAACDAQAgCgcAALsRACAJAACSEAAgGQAAkxAAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAEBRgAAnwMAIAfsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABAUYAAKEDADABRgAAoQMAMAEAAAAYACAKBwAAuREAIAkAAIYQACAZAACHEAAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACECAAAAgwEAIEYAAKUDACAH7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACECAAAAXQAgRgAApwMAIAIAAABdACBGAACnAwAgAQAAABgAIAMAAACDAQAgTQAAnwMAIE4AAKUDACABAAAAgwEAIAEAAABdACAFDAAAjhIAIFMAAJASACBUAACPEgAg8gQAAPsJACDCBQAA-wkAIArpBAAAnwkAMOoEAACvAwAQ6wQAAJ8JADDsBAEApwgAIfEEAQCnCAAh8gQBAKgIACH0BEAAqQgAIfUEQACpCAAhvAUBAKcIACHCBQEAqAgAIQMAAABdACABAACuAwAwUgAArwMAIAMAAABdACABAACCAQAwAgAAgwEAIAEAAACwAQAgAQAAALABACADAAAArgEAIAEAAK8BADACAACwAQAgAwAAAK4BACABAACvAQAwAgAAsAEAIAMAAACuAQAgAQAArwEAMAIAALABACALBwAAjRIAIA8AAPoPACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAfcFAQAAAAH4BQEAAAAB-QUCAAAAAfsFAAAA-wUCAUYAALcDACAJ7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAgAAAAH7BQAAAPsFAgFGAAC5AwAwAUYAALkDADALBwAAjBIAIA8AAO8PACDsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbwFAQCACgAh9wUBAP8JACH4BQEA_wkAIfkFAgD2CwAh-wUAAO0P-wUiAgAAALABACBGAAC8AwAgCewEAQD_CQAh8QQBAP8JACH0BEAAgQoAIfUEQACBCgAhvAUBAIAKACH3BQEA_wkAIfgFAQD_CQAh-QUCAPYLACH7BQAA7Q_7BSICAAAArgEAIEYAAL4DACACAAAArgEAIEYAAL4DACADAAAAsAEAIE0AALcDACBOAAC8AwAgAQAAALABACABAAAArgEAIAYMAACHEgAgUwAAihIAIFQAAIkSACDVAQAAiBIAINYBAACLEgAgvAUAAPsJACAM6QQAAJsJADDqBAAAxQMAEOsEAACbCQAw7AQBAKcIACHxBAEApwgAIfQEQACpCAAh9QRAAKkIACG8BQEAqAgAIfcFAQCnCAAh-AUBAKcIACH5BQIA8wgAIfsFAACcCfsFIgMAAACuAQAgAQAAxAMAMFIAAMUDACADAAAArgEAIAEAAK8BADACAACwAQAgAQAAACMAIAEAAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAAhACABAAAiADACAAAjACAPBwAA_g0AIAkAAP8NACAKAADZDwAgFQAAgA4AIBcAAIEOACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHOBQIAAAAB1AUBAAAAAfUFAQAAAAH2BQEAAAABAUYAAM0DACAK7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAABzgUCAAAAAdQFAQAAAAH1BQEAAAAB9gUBAAAAAQFGAADPAwAwAUYAAM8DADABAAAAHQAgDwcAAOcNACAJAADoDQAgCgAA1w8AIBUAAOkNACAXAADqDQAg7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAhzgUCAPwMACHUBQEAgAoAIfUFAQD_CQAh9gUBAP8JACECAAAAIwAgRgAA0wMAIArsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHOBQIA_AwAIdQFAQCACgAh9QUBAP8JACH2BQEA_wkAIQIAAAAhACBGAADVAwAgAgAAACEAIEYAANUDACABAAAAHQAgAwAAACMAIE0AAM0DACBOAADTAwAgAQAAACMAIAEAAAAhACAIDAAAghIAIFMAAIUSACBUAACEEgAg1QEAAIMSACDWAQAAhhIAIMIFAAD7CQAgzgUAAPsJACDUBQAA-wkAIA3pBAAAmgkAMOoEAADdAwAQ6wQAAJoJADDsBAEApwgAIfEEAQCnCAAh8gQBAKcIACH0BEAAqQgAIfUEQACpCAAhwgUBAKgIACHOBQIA3wgAIdQFAQCoCAAh9QUBAKcIACH2BQEApwgAIQMAAAAhACABAADcAwAwUgAA3QMAIAMAAAAhACABAAAiADACAAAjACABAAAAKAAgAQAAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIBcHAACzCwAgCQAAsAsAIAoAALELACALAACqCwAgEQAAqwsAIBIAAKgMACATAACsCwAgFAAArQsAIBYAAK8LACAaAACyCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQFGAADlAwAgDOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQFGAADnAwAwAUYAAOcDADABAAAAGAAgAQAAAB0AIBcHAACECwAgCQAAgQsAIAoAAIILACALAAD7CgAgEQAA_AoAIBIAAKYMACATAAD9CgAgFAAA_goAIBYAAIALACAaAACDCwAgGwAA_woAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIQIAAAAoACBGAADsAwAgDOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIQIAAAAmACBGAADuAwAgAgAAACYAIEYAAO4DACABAAAAGAAgAQAAAB0AIAMAAAAoACBNAADlAwAgTgAA7AMAIAEAAAAoACABAAAAJgAgBQwAAP8RACBTAACBEgAgVAAAgBIAIPIEAAD7CQAg1AUAAPsJACAP6QQAAJkJADDqBAAA9wMAEOsEAACZCQAw7AQBAKcIACHxBAEApwgAIfIEAQCoCAAh9ARAAKkIACH1BEAAqQgAIZQFAQCnCAAhlQUBAKcIACGWBQEApwgAIZgFAQCnCAAhxAUBAKcIACHUBQEAqAgAIfQFQACpCAAhAwAAACYAIAEAAPYDADBSAAD3AwAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAaACABAAAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgFggAAP4RACAVAADMEQAgFwAAzREAIBkAAMkRACAdAADTEQAgHgAA0hEAICgAAMYRACApAADHEQAgKgAAyBEAICsAAMoRACAsAADLEQAgLgAAzhEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHTBQEAAAAB7AUBAAAAAfMFAQAAAAEBRgAA_wMAIAfsBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAAB0wUBAAAAAewFAQAAAAHzBQEAAAABAUYAAIEEADABRgAAgQQAMAEAAAASACAWCAAA_REAIBUAAL0QACAXAAC-EAAgGQAAuhAAIB0AAMQQACAeAADDEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACECAAAAGgAgRgAAhQQAIAfsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIQIAAAAYACBGAACHBAAgAgAAABgAIEYAAIcEACABAAAAEgAgAwAAABoAIE0AAP8DACBOAACFBAAgAQAAABoAIAEAAAAYACAGDAAA-hEAIFMAAPwRACBUAAD7EQAgwgUAAPsJACDTBQAA-wkAIOwFAAD7CQAgCukEAACYCQAw6gQAAI8EABDrBAAAmAkAMOwEAQCnCAAh9ARAAKkIACH1BEAAqQgAIcIFAQCoCAAh0wUBAKgIACHsBQEAqAgAIfMFAQCnCAAhAwAAABgAIAEAAI4EADBSAACPBAAgAwAAABgAIAEAABkAMAIAABoAIAEAAAAUACABAAAAFAAgAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgCQcAAPkRACAyAADVEQAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHsBQEAAAAB8wUBAAAAAQFGAACXBAAgB-wEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAAB7AUBAAAAAfMFAQAAAAEBRgAAmQQAMAFGAACZBAAwAQAAABYAIAkHAAD4EQAgMgAAqxAAIOwEAQD_CQAh8QQBAIAKACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHsBQEAgAoAIfMFAQD_CQAhAgAAABQAIEYAAJ0EACAH7AQBAP8JACHxBAEAgAoAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIewFAQCACgAh8wUBAP8JACECAAAAEgAgRgAAnwQAIAIAAAASACBGAACfBAAgAQAAABYAIAMAAAAUACBNAACXBAAgTgAAnQQAIAEAAAAUACABAAAAEgAgBgwAAPURACBTAAD3EQAgVAAA9hEAIPEEAAD7CQAgwgUAAPsJACDsBQAA-wkAIArpBAAAlwkAMOoEAACnBAAQ6wQAAJcJADDsBAEApwgAIfEEAQCoCAAh9ARAAKkIACH1BEAAqQgAIcIFAQCoCAAh7AUBAKgIACHzBQEApwgAIQMAAAASACABAACmBAAwUgAApwQAIAMAAAASACABAAATADACAAAUACAdBgAAjwkAIBUAANsIACAXAACSCQAgGQAA2ggAIB0AAN0IACAeAADcCAAgKAAAiwkAICkAAIwJACAqAACOCQAgKwAAkAkAICwAAJEJACAuAADvCAAgLwAAlAkAIDAAAJUJACAxAACWCQAgMwAAigkAIDQAAI0JACA3AACTCQAg6QQAAIgJADDqBAAAFgAQ6wQAAIgJADDsBAEAAAAB9ARAAL4IACH1BEAAvggAIaAFAACJCe4FI7wFAQC6CAAhwgUBALsIACHsBQEAuwgAIe8FAQC7CAAhAQAAAKoEACABAAAAqgQAIBYGAADtEQAgFQAAqw0AIBcAAPARACAZAACqDQAgHQAArQ0AIB4AAKwNACAoAADpEQAgKQAA6hEAICoAAOwRACArAADuEQAgLAAA7xEAIC4AAKcOACAvAADyEQAgMAAA8xEAIDEAAPQRACAzAADoEQAgNAAA6xEAIDcAAPERACCgBQAA-wkAIMIFAAD7CQAg7AUAAPsJACDvBQAA-wkAIAMAAAAWACABAACtBAAwAgAAqgQAIAMAAAAWACABAACtBAAwAgAAqgQAIAMAAAAWACABAACtBAAwAgAAqgQAIBoGAADcEQAgFQAA3xEAIBcAAOARACAZAADaEQAgHQAA5xEAIB4AAOYRACAoAADXEQAgKQAA2BEAICoAANsRACArAADdEQAgLAAA3hEAIC4AAOIRACAvAADjEQAgMAAA5BEAIDEAAOURACAzAADWEQAgNAAA2REAIDcAAOERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGgBQAAAO4FA7wFAQAAAAHCBQEAAAAB7AUBAAAAAe8FAQAAAAEBRgAAsQQAIAjsBAEAAAAB9ARAAAAAAfUEQAAAAAGgBQAAAO4FA7wFAQAAAAHCBQEAAAAB7AUBAAAAAe8FAQAAAAEBRgAAswQAMAFGAACzBAAwGgYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhAgAAAKoEACBGAAC2BAAgCOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhAgAAABYAIEYAALgEACACAAAAFgAgRgAAuAQAIAMAAACqBAAgTQAAsQQAIE4AALYEACABAAAAqgQAIAEAAAAWACAHDAAAvw4AIFMAAMEOACBUAADADgAgoAUAAPsJACDCBQAA-wkAIOwFAAD7CQAg7wUAAPsJACAL6QQAAIcJADDqBAAAvwQAEOsEAACHCQAw7AQBAKcIACH0BEAAqQgAIfUEQACpCAAhoAUAAIEJ7gUjvAUBAKcIACHCBQEAqAgAIewFAQCoCAAh7wUBAKgIACEDAAAAFgAgAQAAvgQAMFIAAL8EACADAAAAFgAgAQAArQQAMAIAAKoEACABAAAAuwEAIAEAAAC7AQAgAwAAALkBACABAAC6AQAwAgAAuwEAIAMAAAC5AQAgAQAAugEAMAIAALsBACADAAAAuQEAIAEAALoBADACAAC7AQAgEQcAAL4OACA1AAC8DgAgNgAAvQ4AIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGkBQAAAPEFAqYFQAAAAAHCBQEAAAAB6gUBAAAAAesFAQAAAAHsBQEAAAAB7gUAAADuBQPvBQEAAAAB8QUBAAAAAfIFAQAAAAEBRgAAxwQAIA7sBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAADxBQKmBUAAAAABwgUBAAAAAeoFAQAAAAHrBQEAAAAB7AUBAAAAAe4FAAAA7gUD7wUBAAAAAfEFAQAAAAHyBQEAAAABAUYAAMkEADABRgAAyQQAMAEAAABvACABAAAAFgAgEQcAALsOACA1AAC5DgAgNgAAug4AIOwEAQD_CQAh8QQBAIAKACH0BEAAgQoAIfUEQACBCgAhpAUAALgO8QUipgVAAKgKACHCBQEAgAoAIeoFAQD_CQAh6wUBAP8JACHsBQEAgAoAIe4FAAC3Du4FI-8FAQCACgAh8QUBAIAKACHyBQEAgAoAIQIAAAC7AQAgRgAAzgQAIA7sBAEA_wkAIfEEAQCACgAh9ARAAIEKACH1BEAAgQoAIaQFAAC4DvEFIqYFQACoCgAhwgUBAIAKACHqBQEA_wkAIesFAQD_CQAh7AUBAIAKACHuBQAAtw7uBSPvBQEAgAoAIfEFAQCACgAh8gUBAIAKACECAAAAuQEAIEYAANAEACACAAAAuQEAIEYAANAEACABAAAAbwAgAQAAABYAIAMAAAC7AQAgTQAAxwQAIE4AAM4EACABAAAAuwEAIAEAAAC5AQAgCwwAALQOACBTAAC2DgAgVAAAtQ4AIPEEAAD7CQAgpgUAAPsJACDCBQAA-wkAIOwFAAD7CQAg7gUAAPsJACDvBQAA-wkAIPEFAAD7CQAg8gUAAPsJACAR6QQAAIAJADDqBAAA2QQAEOsEAACACQAw7AQBAKcIACHxBAEAqAgAIfQEQACpCAAh9QRAAKkIACGkBQAAggnxBSKmBUAAxAgAIcIFAQCoCAAh6gUBAKcIACHrBQEApwgAIewFAQCoCAAh7gUAAIEJ7gUj7wUBAKgIACHxBQEAqAgAIfIFAQCoCAAhAwAAALkBACABAADYBAAwUgAA2QQAIAMAAAC5AQAgAQAAugEAMAIAALsBACABAAAAUQAgAQAAAFEAIAMAAABPACABAABQADACAABRACADAAAATwAgAQAAUAAwAgAAUQAgAwAAAE8AIAEAAFAAMAIAAFEAIA4HAADmDAAgCQAA5wwAIBoAALMOACAdAADoDAAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAHEBQEAAAAB3AUBAAAAAecFEAAAAAHoBRAAAAAB6QUgAAAAAQFGAADhBAAgCuwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABxAUBAAAAAdwFAQAAAAHnBRAAAAAB6AUQAAAAAekFIAAAAAEBRgAA4wQAMAFGAADjBAAwDgcAANkMACAJAADaDAAgGgAAsg4AIB0AANsMACDsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhxAUBAP8JACHcBQEA_wkAIecFEAD3CwAh6AUQAPcLACHpBSAAwQsAIQIAAABRACBGAADmBAAgCuwEAQD_CQAh8QQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACHEBQEA_wkAIdwFAQD_CQAh5wUQAPcLACHoBRAA9wsAIekFIADBCwAhAgAAAE8AIEYAAOgEACACAAAATwAgRgAA6AQAIAMAAABRACBNAADhBAAgTgAA5gQAIAEAAABRACABAAAATwAgBQwAAK0OACBTAACwDgAgVAAArw4AINUBAACuDgAg1gEAALEOACAN6QQAAP8IADDqBAAA7wQAEOsEAAD_CAAw7AQBAKcIACHxBAEApwgAIfIEAQCnCAAh9ARAAKkIACH1BEAAqQgAIcQFAQCnCAAh3AUBAKcIACHnBRAA9AgAIegFEAD0CAAh6QUgALUIACEDAAAATwAgAQAA7gQAMFIAAO8EACADAAAATwAgAQAAUAAwAgAAUQAgAQAAAFUAIAEAAABVACADAAAAUwAgAQAAVAAwAgAAVQAgAwAAAFMAIAEAAFQAMAIAAFUAIAMAAABTACABAABUADACAABVACAcBwAA_gsAIAkAAP8LACAaAACADAAgGwAAzQwAIBwAAIEMACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGkBQAAANoFAsQFAQAAAAHWBQEAAAAB2AUAAADYBQLaBQIAAAAB2wUQAAAAAdwFAQAAAAHdBQEAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AWAAAAAAeUFQAAAAAHmBUAAAAABAUYAAPcEACAX7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABpAUAAADaBQLEBQEAAAAB1gUBAAAAAdgFAAAA2AUC2gUCAAAAAdsFEAAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFgAAAAAHlBUAAAAAB5gVAAAAAAQFGAAD5BAAwAUYAAPkEADAcBwAA-QsAIAkAAPoLACAaAAD7CwAgGwAAywwAIBwAAPwLACDsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhmAUBAP8JACGkBQAA9QvaBSLEBQEA_wkAIdYFAQD_CQAh2AUAAPQL2AUi2gUCAPYLACHbBRAA9wsAIdwFAQD_CQAh3QUBAP8JACHeBQEA_wkAId8FAQCACgAh4AUBAIAKACHhBQEAgAoAIeIFAQCACgAh4wUBAIAKACHkBYAAAAAB5QVAAIEKACHmBUAAqAoAIQIAAABVACBGAAD8BAAgF-wEAQD_CQAh8QQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACGYBQEA_wkAIaQFAAD1C9oFIsQFAQD_CQAh1gUBAP8JACHYBQAA9AvYBSLaBQIA9gsAIdsFEAD3CwAh3AUBAP8JACHdBQEA_wkAId4FAQD_CQAh3wUBAIAKACHgBQEAgAoAIeEFAQCACgAh4gUBAIAKACHjBQEAgAoAIeQFgAAAAAHlBUAAgQoAIeYFQACoCgAhAgAAAFMAIEYAAP4EACACAAAAUwAgRgAA_gQAIAMAAABVACBNAAD3BAAgTgAA_AQAIAEAAABVACABAAAAUwAgDAwAAKgOACBTAACrDgAgVAAAqg4AINUBAACpDgAg1gEAAKwOACDfBQAA-wkAIOAFAAD7CQAg4QUAAPsJACDiBQAA-wkAIOMFAAD7CQAg5AUAAPsJACDmBQAA-wkAIBrpBAAA8AgAMOoEAACFBQAQ6wQAAPAIADDsBAEApwgAIfEEAQCnCAAh8gQBAKcIACH0BEAAqQgAIfUEQACpCAAhmAUBAKcIACGkBQAA8gjaBSLEBQEApwgAIdYFAQCnCAAh2AUAAPEI2AUi2gUCAPMIACHbBRAA9AgAIdwFAQCnCAAh3QUBAKcIACHeBQEApwgAId8FAQCoCAAh4AUBAKgIACHhBQEAqAgAIeIFAQCoCAAh4wUBAKgIACHkBQAA9QgAIOUFQACpCAAh5gVAAMQIACEDAAAAUwAgAQAAhAUAMFIAAIUFACADAAAAUwAgAQAAVAAwAgAAVQAgECMAAO8IACDpBAAA7ggAMOoEAACLBQAQ6wQAAO4IADDsBAEAAAAB8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGdBQEAuggAIdAFAQC7CAAh0QUBALoIACHSBQAAswgAINMFAQC7CAAh1AUBALsIACHVBQEAuggAIQEAAACIBQAgAQAAAIgFACAQIwAA7wgAIOkEAADuCAAw6gQAAIsFABDrBAAA7ggAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGdBQEAuggAIdAFAQC7CAAh0QUBALoIACHSBQAAswgAINMFAQC7CAAh1AUBALsIACHVBQEAuggAIQUjAACnDgAg8gQAAPsJACDQBQAA-wkAINMFAAD7CQAg1AUAAPsJACADAAAAiwUAIAEAAIwFADACAACIBQAgAwAAAIsFACABAACMBQAwAgAAiAUAIAMAAACLBQAgAQAAjAUAMAIAAIgFACANIwAApg4AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABnQUBAAAAAdAFAQAAAAHRBQEAAAAB0gUAAKUOACDTBQEAAAAB1AUBAAAAAdUFAQAAAAEBRgAAkAUAIAzsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZ0FAQAAAAHQBQEAAAAB0QUBAAAAAdIFAAClDgAg0wUBAAAAAdQFAQAAAAHVBQEAAAABAUYAAJIFADABRgAAkgUAMA0jAACbDgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZ0FAQD_CQAh0AUBAIAKACHRBQEA_wkAIdIFAACaDgAg0wUBAIAKACHUBQEAgAoAIdUFAQD_CQAhAgAAAIgFACBGAACVBQAgDOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGdBQEA_wkAIdAFAQCACgAh0QUBAP8JACHSBQAAmg4AINMFAQCACgAh1AUBAIAKACHVBQEA_wkAIQIAAACLBQAgRgAAlwUAIAIAAACLBQAgRgAAlwUAIAMAAACIBQAgTQAAkAUAIE4AAJUFACABAAAAiAUAIAEAAACLBQAgBwwAAJcOACBTAACZDgAgVAAAmA4AIPIEAAD7CQAg0AUAAPsJACDTBQAA-wkAINQFAAD7CQAgD-kEAADtCAAw6gQAAJ4FABDrBAAA7QgAMOwEAQCnCAAh8QQBAKcIACHyBAEAqAgAIfQEQACpCAAh9QRAAKkIACGdBQEApwgAIdAFAQCoCAAh0QUBAKcIACHSBQAAswgAINMFAQCoCAAh1AUBAKgIACHVBQEApwgAIQMAAACLBQAgAQAAnQUAMFIAAJ4FACADAAAAiwUAIAEAAIwFADACAACIBQAgECMAAOwIACDpBAAA6wgAMOoEAACkBQAQ6wQAAOsIADDsBAEAAAAB8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGdBQEAuggAIdAFAQC7CAAh0QUBALoIACHSBQAAswgAINMFAQC7CAAh1AUBALsIACHVBQEAuggAIQEAAAChBQAgAQAAAKEFACAQIwAA7AgAIOkEAADrCAAw6gQAAKQFABDrBAAA6wgAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGdBQEAuggAIdAFAQC7CAAh0QUBALoIACHSBQAAswgAINMFAQC7CAAh1AUBALsIACHVBQEAuggAIQUjAACWDgAg8gQAAPsJACDQBQAA-wkAINMFAAD7CQAg1AUAAPsJACADAAAApAUAIAEAAKUFADACAAChBQAgAwAAAKQFACABAAClBQAwAgAAoQUAIAMAAACkBQAgAQAApQUAMAIAAKEFACANIwAAlQ4AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABnQUBAAAAAdAFAQAAAAHRBQEAAAAB0gUAAJQOACDTBQEAAAAB1AUBAAAAAdUFAQAAAAEBRgAAqQUAIAzsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZ0FAQAAAAHQBQEAAAAB0QUBAAAAAdIFAACUDgAg0wUBAAAAAdQFAQAAAAHVBQEAAAABAUYAAKsFADABRgAAqwUAMA0jAACKDgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZ0FAQD_CQAh0AUBAIAKACHRBQEA_wkAIdIFAACJDgAg0wUBAIAKACHUBQEAgAoAIdUFAQD_CQAhAgAAAKEFACBGAACuBQAgDOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGdBQEA_wkAIdAFAQCACgAh0QUBAP8JACHSBQAAiQ4AINMFAQCACgAh1AUBAIAKACHVBQEA_wkAIQIAAACkBQAgRgAAsAUAIAIAAACkBQAgRgAAsAUAIAMAAAChBQAgTQAAqQUAIE4AAK4FACABAAAAoQUAIAEAAACkBQAgBwwAAIYOACBTAACIDgAgVAAAhw4AIPIEAAD7CQAg0AUAAPsJACDTBQAA-wkAINQFAAD7CQAgD-kEAADqCAAw6gQAALcFABDrBAAA6ggAMOwEAQCnCAAh8QQBAKcIACHyBAEAqAgAIfQEQACpCAAh9QRAAKkIACGdBQEApwgAIdAFAQCoCAAh0QUBAKcIACHSBQAAswgAINMFAQCoCAAh1AUBAKgIACHVBQEApwgAIQMAAACkBQAgAQAAtgUAMFIAALcFACADAAAApAUAIAEAAKUFADACAAChBQAgAQAAAB8AIAEAAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACAPBwAAhA4AIAkAAIUOACAUAACCDgAgFQAAgw4AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABnQUBAAAAAcIFAQAAAAHMBQEAAAABzQVAAAAAAc4FCAAAAAHPBQgAAAABAUYAAL8FACAL7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGdBQEAAAABwgUBAAAAAcwFAQAAAAHNBUAAAAABzgUIAAAAAc8FCAAAAAEBRgAAwQUAMAFGAADBBQAwDwcAANENACAJAADSDQAgFAAAzw0AIBUAANANACDsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhnQUBAP8JACHCBQEAgAoAIcwFAQCACgAhzQVAAKgKACHOBQgAlAoAIc8FCACUCgAhAgAAAB8AIEYAAMQFACAL7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZ0FAQD_CQAhwgUBAIAKACHMBQEAgAoAIc0FQACoCgAhzgUIAJQKACHPBQgAlAoAIQIAAAAdACBGAADGBQAgAgAAAB0AIEYAAMYFACADAAAAHwAgTQAAvwUAIE4AAMQFACABAAAAHwAgAQAAAB0AIAoMAADKDQAgUwAAzQ0AIFQAAMwNACDVAQAAyw0AINYBAADODQAgwgUAAPsJACDMBQAA-wkAIM0FAAD7CQAgzgUAAPsJACDPBQAA-wkAIA7pBAAA6QgAMOoEAADNBQAQ6wQAAOkIADDsBAEApwgAIfEEAQCnCAAh8gQBAKcIACH0BEAAqQgAIfUEQACpCAAhnQUBAKcIACHCBQEAqAgAIcwFAQCoCAAhzQVAAMQIACHOBQgAzggAIc8FCADOCAAhAwAAAB0AIAEAAMwFADBSAADNBQAgAwAAAB0AIAEAAB4AMAIAAB8AIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgDA0AAKcLACAOAADEDQAgEAAAqAsAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaoFAQAAAAG8BQEAAAABwgUBAAAAAckFAQAAAAHKBQEAAAABywUBAAAAAQFGAADVBQAgCewEAQAAAAH0BEAAAAAB9QRAAAAAAaoFAQAAAAG8BQEAAAABwgUBAAAAAckFAQAAAAHKBQEAAAABywUBAAAAAQFGAADXBQAwAUYAANcFADAMDQAApAsAIA4AAMINACAQAAClCwAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhqgUBAP8JACG8BQEA_wkAIcIFAQCACgAhyQUBAIAKACHKBQEA_wkAIcsFAQD_CQAhAgAAACwAIEYAANoFACAJ7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhqgUBAP8JACG8BQEA_wkAIcIFAQCACgAhyQUBAIAKACHKBQEA_wkAIcsFAQD_CQAhAgAAACoAIEYAANwFACACAAAAKgAgRgAA3AUAIAMAAAAsACBNAADVBQAgTgAA2gUAIAEAAAAsACABAAAAKgAgBQwAAMcNACBTAADJDQAgVAAAyA0AIMIFAAD7CQAgyQUAAPsJACAM6QQAAOgIADDqBAAA4wUAEOsEAADoCAAw7AQBAKcIACH0BEAAqQgAIfUEQACpCAAhqgUBAKcIACG8BQEApwgAIcIFAQCoCAAhyQUBAKgIACHKBQEApwgAIcsFAQCnCAAhAwAAACoAIAEAAOIFADBSAADjBQAgAwAAACoAIAEAACsAMAIAACwAIAwLAADnCAAg6QQAAOUIADDqBAAA6QUAEOsEAADlCAAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGkBQAA5gjJBSK8BQEAuggAIcIFAQC7CAAhxgVAAL4IACHHBUAAvggAIQEAAADmBQAgAQAAAOYFACAMCwAA5wgAIOkEAADlCAAw6gQAAOkFABDrBAAA5QgAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIaQFAADmCMkFIrwFAQC6CAAhwgUBALsIACHGBUAAvggAIccFQAC-CAAhAgsAAMYNACDCBQAA-wkAIAMAAADpBQAgAQAA6gUAMAIAAOYFACADAAAA6QUAIAEAAOoFADACAADmBQAgAwAAAOkFACABAADqBQAwAgAA5gUAIAkLAADFDQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAADJBQK8BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABAUYAAO4FACAI7AQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAADJBQK8BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABAUYAAPAFADABRgAA8AUAMAkLAAC5DQAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhpAUAALgNyQUivAUBAP8JACHCBQEAgAoAIcYFQACBCgAhxwVAAIEKACECAAAA5gUAIEYAAPMFACAI7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhpAUAALgNyQUivAUBAP8JACHCBQEAgAoAIcYFQACBCgAhxwVAAIEKACECAAAA6QUAIEYAAPUFACACAAAA6QUAIEYAAPUFACADAAAA5gUAIE0AAO4FACBOAADzBQAgAQAAAOYFACABAAAA6QUAIAQMAAC1DQAgUwAAtw0AIFQAALYNACDCBQAA-wkAIAvpBAAA4QgAMOoEAAD8BQAQ6wQAAOEIADDsBAEApwgAIfQEQACpCAAh9QRAAKkIACGkBQAA4gjJBSK8BQEApwgAIcIFAQCoCAAhxgVAAKkIACHHBUAAqQgAIQMAAADpBQAgAQAA-wUAMFIAAPwFACADAAAA6QUAIAEAAOoFADACAADmBQAgAQAAAEwAIAEAAABMACADAAAASgAgAQAASwAwAgAATAAgAwAAAEoAIAEAAEsAMAIAAEwAIAMAAABKACABAABLADACAABMACARBwAAow0AIAkAAKQNACAVAACgDQAgFwAAoQ0AIBgAAKINACAaAAC0DQAgHwAApQ0AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHDBQIAAAABxAUBAAAAAcUFAQAAAAEBRgAAhAYAIArsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABwwUCAAAAAcQFAQAAAAHFBQEAAAABAUYAAIYGADABRgAAhgYAMAEAAAAYACABAAAAXQAgEQcAAIENACAJAACCDQAgFQAA_gwAIBcAAP8MACAYAACADQAgGgAAsw0AIB8AAIMNACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACHCBQEAgAoAIcMFAgD8DAAhxAUBAP8JACHFBQEAgAoAIQIAAABMACBGAACLBgAgCuwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhwwUCAPwMACHEBQEA_wkAIcUFAQCACgAhAgAAAEoAIEYAAI0GACACAAAASgAgRgAAjQYAIAEAAAAYACABAAAAXQAgAwAAAEwAIE0AAIQGACBOAACLBgAgAQAAAEwAIAEAAABKACAJDAAArg0AIFMAALENACBUAACwDQAg1QEAAK8NACDWAQAAsg0AIPIEAAD7CQAgwgUAAPsJACDDBQAA-wkAIMUFAAD7CQAgDekEAADeCAAw6gQAAJYGABDrBAAA3ggAMOwEAQCnCAAh8QQBAKcIACHyBAEAqAgAIfQEQACpCAAh9QRAAKkIACG8BQEApwgAIcIFAQCoCAAhwwUCAN8IACHEBQEApwgAIcUFAQCoCAAhAwAAAEoAIAEAAJUGADBSAACWBgAgAwAAAEoAIAEAAEsAMAIAAEwAIAwVAADbCAAgGQAA2ggAIB0AAN0IACAeAADcCAAg6QQAANkIADDqBAAAnAYAEOsEAADZCAAw7AQBAAAAAfEEAQC6CAAhvAUBALoIACG9BUAAvggAIb4FQAC-CAAhAQAAAJkGACABAAAAmQYAIAwVAADbCAAgGQAA2ggAIB0AAN0IACAeAADcCAAg6QQAANkIADDqBAAAnAYAEOsEAADZCAAw7AQBALoIACHxBAEAuggAIbwFAQC6CAAhvQVAAL4IACG-BUAAvggAIQQVAACrDQAgGQAAqg0AIB0AAK0NACAeAACsDQAgAwAAAJwGACABAACdBgAwAgAAmQYAIAMAAACcBgAgAQAAnQYAMAIAAJkGACADAAAAnAYAIAEAAJ0GADACAACZBgAgCRUAAKcNACAZAACmDQAgHQAAqQ0AIB4AAKgNACDsBAEAAAAB8QQBAAAAAbwFAQAAAAG9BUAAAAABvgVAAAAAAQFGAAChBgAgBewEAQAAAAHxBAEAAAABvAUBAAAAAb0FQAAAAAG-BUAAAAABAUYAAKMGADABRgAAowYAMAkVAADADAAgGQAAvwwAIB0AAMIMACAeAADBDAAg7AQBAP8JACHxBAEA_wkAIbwFAQD_CQAhvQVAAIEKACG-BUAAgQoAIQIAAACZBgAgRgAApgYAIAXsBAEA_wkAIfEEAQD_CQAhvAUBAP8JACG9BUAAgQoAIb4FQACBCgAhAgAAAJwGACBGAACoBgAgAgAAAJwGACBGAACoBgAgAwAAAJkGACBNAAChBgAgTgAApgYAIAEAAACZBgAgAQAAAJwGACADDAAAvAwAIFMAAL4MACBUAAC9DAAgCOkEAADYCAAw6gQAAK8GABDrBAAA2AgAMOwEAQCnCAAh8QQBAKcIACG8BQEApwgAIb0FQACpCAAhvgVAAKkIACEDAAAAnAYAIAEAAK4GADBSAACvBgAgAwAAAJwGACABAACdBgAwAgAAmQYAIA0lAAC_CAAg6QQAANcIADDqBAAA6gEAEOsEAADXCAAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGCBQEAuggAIYMFAQC6CAAhiAUAALwIACCKBSAAvQgAIboFAQAAAAG7BQAAswgAIAEAAACyBgAgAQAAALIGACABJQAAxgsAIAMAAADqAQAgAQAAtQYAMAIAALIGACADAAAA6gEAIAEAALUGADACAACyBgAgAwAAAOoBACABAAC1BgAwAgAAsgYAIAolAAC7DAAg7AQBAAAAAfQEQAAAAAH1BEAAAAABggUBAAAAAYMFAQAAAAGIBYAAAAABigUgAAAAAboFAQAAAAG7BQAAugwAIAFGAAC5BgAgCewEAQAAAAH0BEAAAAAB9QRAAAAAAYIFAQAAAAGDBQEAAAABiAWAAAAAAYoFIAAAAAG6BQEAAAABuwUAALoMACABRgAAuwYAMAFGAAC7BgAwCiUAALkMACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGCBQEA_wkAIYMFAQD_CQAhiAWAAAAAAYoFIADBCwAhugUBAP8JACG7BQAAuAwAIAIAAACyBgAgRgAAvgYAIAnsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGCBQEA_wkAIYMFAQD_CQAhiAWAAAAAAYoFIADBCwAhugUBAP8JACG7BQAAuAwAIAIAAADqAQAgRgAAwAYAIAIAAADqAQAgRgAAwAYAIAMAAACyBgAgTQAAuQYAIE4AAL4GACABAAAAsgYAIAEAAADqAQAgAwwAALUMACBTAAC3DAAgVAAAtgwAIAzpBAAA1ggAMOoEAADHBgAQ6wQAANYIADDsBAEApwgAIfQEQACpCAAh9QRAAKkIACGCBQEApwgAIYMFAQCnCAAhiAUAALQIACCKBSAAtQgAIboFAQCnCAAhuwUAALMIACADAAAA6gEAIAEAAMYGADBSAADHBgAgAwAAAOoBACABAAC1BgAwAgAAsgYAIAEAAABrACABAAAAawAgAwAAAGkAIAEAAGoAMAIAAGsAIAMAAABpACABAABqADACAABrACADAAAAaQAgAQAAagAwAgAAawAgEBsAALQMACAkAACSDAAgJQAAkwwAICYAAJQMACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABogUBAAAAAaQFAAAAugUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAakFAQAAAAG6BQEAAAABAUYAAM8GACAM7AQBAAAAAfQEQAAAAAH1BEAAAAABmAUBAAAAAaIFAQAAAAGkBQAAALoFAqUFAQAAAAGmBUAAAAABpwVAAAAAAagFAQAAAAGpBQEAAAABugUBAAAAAQFGAADRBgAwAUYAANEGADABAAAAbwAgAQAAAHEAIBAbAACzDAAgJAAAjgwAICUAAI8MACAmAACQDAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhmAUBAIAKACGiBQEAgAoAIaQFAACMDLoFIqUFAQCACgAhpgVAAKgKACGnBUAAgQoAIagFAQD_CQAhqQUBAIAKACG6BQEA_wkAIQIAAABrACBGAADWBgAgDOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZgFAQCACgAhogUBAIAKACGkBQAAjAy6BSKlBQEAgAoAIaYFQACoCgAhpwVAAIEKACGoBQEA_wkAIakFAQCACgAhugUBAP8JACECAAAAaQAgRgAA2AYAIAIAAABpACBGAADYBgAgAQAAAG8AIAEAAABxACADAAAAawAgTQAAzwYAIE4AANYGACABAAAAawAgAQAAAGkAIAgMAACwDAAgUwAAsgwAIFQAALEMACCYBQAA-wkAIKIFAAD7CQAgpQUAAPsJACCmBQAA-wkAIKkFAAD7CQAgD-kEAADSCAAw6gQAAOEGABDrBAAA0ggAMOwEAQCnCAAh9ARAAKkIACH1BEAAqQgAIZgFAQCoCAAhogUBAKgIACGkBQAA0wi6BSKlBQEAqAgAIaYFQADECAAhpwVAAKkIACGoBQEApwgAIakFAQCoCAAhugUBAKcIACEDAAAAaQAgAQAA4AYAMFIAAOEGACADAAAAaQAgAQAAagAwAgAAawAgAQAAAIkBACABAAAAiQEAIAMAAABxACABAACIAQAwAgAAiQEAIAMAAABxACABAACIAQAwAgAAiQEAIAMAAABxACABAACIAQAwAgAAiQEAIA8DAACrDAAgBwAAqQwAIAkAAKoMACAVAACsDAAgHQAArwwAICIAAK0MACAnAACuDAAg7AQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAbgFAQAAAAEBRgAA6QYAIAjsBAEAAAAB8AQBAAAAAfEEAQAAAAHyBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABuAUBAAAAAQFGAADrBgAwAUYAAOsGADABAAAAGAAgDwMAAOULACAHAADjCwAgCQAA5AsAIBUAAOYLACAdAADpCwAgIgAA5wsAICcAAOgLACDsBAEA_wkAIfAEAQCACgAh8QQBAP8JACHyBAEAgAoAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbgFAQD_CQAhAgAAAIkBACBGAADvBgAgCOwEAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQCACgAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhuAUBAP8JACECAAAAcQAgRgAA8QYAIAIAAABxACBGAADxBgAgAQAAABgAIAMAAACJAQAgTQAA6QYAIE4AAO8GACABAAAAiQEAIAEAAABxACAFDAAA4AsAIFMAAOILACBUAADhCwAg8AQAAPsJACDyBAAA-wkAIAvpBAAA0QgAMOoEAAD5BgAQ6wQAANEIADDsBAEApwgAIfAEAQCoCAAh8QQBAKcIACHyBAEAqAgAIfMEAQCnCAAh9ARAAKkIACH1BEAAqQgAIbgFAQCnCAAhAwAAAHEAIAEAAPgGADBSAAD5BgAgAwAAAHEAIAEAAIgBADACAACJAQAgAQAAAJkBACABAAAAmQEAIAMAAAA2ACABAACYAQAwAgAAmQEAIAMAAAA2ACABAACYAQAwAgAAmQEAIAMAAAA2ACABAACYAQAwAgAAmQEAIBgHAACbCgAgCQAAnAoAIA4AAJoKACASAACLCwAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGWBQEAAAABqgUBAAAAAasFCAAAAAGsBQgAAAABrQUIAAAAAa4FCAAAAAGvBQgAAAABsAUIAAAAAbEFCAAAAAGyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIAAAAAbcFCAAAAAEBRgAAgQcAIBTsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZYFAQAAAAGqBQEAAAABqwUIAAAAAawFCAAAAAGtBQgAAAABrgUIAAAAAa8FCAAAAAGwBQgAAAABsQUIAAAAAbIFCAAAAAGzBQgAAAABtAUIAAAAAbUFCAAAAAG2BQgAAAABtwUIAAAAAQFGAACDBwAwAUYAAIMHADABAAAAGAAgGAcAAJcKACAJAACYCgAgDgAAlgoAIBIAAIoLACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlgUBAP8JACGqBQEA_wkAIasFCACUCgAhrAUIAJQKACGtBQgAlAoAIa4FCACUCgAhrwUIAJQKACGwBQgAlAoAIbEFCACUCgAhsgUIAJQKACGzBQgAlAoAIbQFCACUCgAhtQUIAJQKACG2BQgAlAoAIbcFCACUCgAhAgAAAJkBACBGAACHBwAgFOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGWBQEA_wkAIaoFAQD_CQAhqwUIAJQKACGsBQgAlAoAIa0FCACUCgAhrgUIAJQKACGvBQgAlAoAIbAFCACUCgAhsQUIAJQKACGyBQgAlAoAIbMFCACUCgAhtAUIAJQKACG1BQgAlAoAIbYFCACUCgAhtwUIAJQKACECAAAANgAgRgAAiQcAIAIAAAA2ACBGAACJBwAgAQAAABgAIAMAAACZAQAgTQAAgQcAIE4AAIcHACABAAAAmQEAIAEAAAA2ACATDAAA2wsAIFMAAN4LACBUAADdCwAg1QEAANwLACDWAQAA3wsAIPIEAAD7CQAgqwUAAPsJACCsBQAA-wkAIK0FAAD7CQAgrgUAAPsJACCvBQAA-wkAILAFAAD7CQAgsQUAAPsJACCyBQAA-wkAILMFAAD7CQAgtAUAAPsJACC1BQAA-wkAILYFAAD7CQAgtwUAAPsJACAX6QQAAM0IADDqBAAAkQcAEOsEAADNCAAw7AQBAKcIACHxBAEApwgAIfIEAQCoCAAh9ARAAKkIACH1BEAAqQgAIZYFAQCnCAAhqgUBAKcIACGrBQgAzggAIawFCADOCAAhrQUIAM4IACGuBQgAzggAIa8FCADOCAAhsAUIAM4IACGxBQgAzggAIbIFCADOCAAhswUIAM4IACG0BQgAzggAIbUFCADOCAAhtgUIAM4IACG3BQgAzggAIQMAAAA2ACABAACQBwAwUgAAkQcAIAMAAAA2ACABAACYAQAwAgAAmQEAIAEAAACPAQAgAQAAAI8BACADAAAAjQEAIAEAAI4BADACAACPAQAgAwAAAI0BACABAACOAQAwAgAAjwEAIAMAAACNAQAgAQAAjgEAMAIAAI8BACAUBwAAswoAIAkAALQKACASAADaCwAgJAAAsAoAICYAALIKACAtAACxCgAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGBBQEAAAABlgUBAAAAAaIFAQAAAAGkBQAAAKQFAqUFAQAAAAGmBUAAAAABpwVAAAAAAagFAQAAAAGpBQEAAAABAUYAAJkHACAO7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGBBQEAAAABlgUBAAAAAaIFAQAAAAGkBQAAAKQFAqUFAQAAAAGmBUAAAAABpwVAAAAAAagFAQAAAAGpBQEAAAABAUYAAJsHADABRgAAmwcAMAEAAABvACABAAAADgAgAQAAABgAIBQHAACtCgAgCQAArgoAIBIAANkLACAkAACqCgAgJgAArAoAIC0AAKsKACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhgQUBAP8JACGWBQEAgAoAIaIFAQCACgAhpAUAAKcKpAUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqAUBAP8JACGpBQEAgAoAIQIAAACPAQAgRgAAoQcAIA7sBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhgQUBAP8JACGWBQEAgAoAIaIFAQCACgAhpAUAAKcKpAUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqAUBAP8JACGpBQEAgAoAIQIAAACNAQAgRgAAowcAIAIAAACNAQAgRgAAowcAIAEAAABvACABAAAADgAgAQAAABgAIAMAAACPAQAgTQAAmQcAIE4AAKEHACABAAAAjwEAIAEAAACNAQAgCQwAANYLACBTAADYCwAgVAAA1wsAIPIEAAD7CQAglgUAAPsJACCiBQAA-wkAIKUFAAD7CQAgpgUAAPsJACCpBQAA-wkAIBHpBAAAyQgAMOoEAACtBwAQ6wQAAMkIADDsBAEApwgAIfEEAQCnCAAh8gQBAKgIACH0BEAAqQgAIfUEQACpCAAhgQUBAKcIACGWBQEAqAgAIaIFAQCoCAAhpAUAAMoIpAUipQUBAKgIACGmBUAAxAgAIacFQACpCAAhqAUBAKcIACGpBQEAqAgAIQMAAACNAQAgAQAArAcAMFIAAK0HACADAAAAjQEAIAEAAI4BADACAACPAQAgAQAAAEcAIAEAAABHACADAAAARQAgAQAARgAwAgAARwAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAABFACABAABGADACAABHACAQBwAA2QoAIAkAANoKACASAADVCwAgFgAA2AoAICAAANsKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABnQUBAAAAAZ4FAQAAAAGgBQAAAKAFAqEFQAAAAAEBRgAAtQcAIAvsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABnQUBAAAAAZ4FAQAAAAGgBQAAAKAFAqEFQAAAAAEBRgAAtwcAMAFGAAC3BwAwAQAAABgAIBAHAADCCgAgCQAAwwoAIBIAANQLACAWAADBCgAgIAAAxAoAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZYFAQD_CQAhnQUBAP8JACGeBQEAgAoAIaAFAAC_CqAFIqEFQACoCgAhAgAAAEcAIEYAALsHACAL7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlgUBAP8JACGdBQEA_wkAIZ4FAQCACgAhoAUAAL8KoAUioQVAAKgKACECAAAARQAgRgAAvQcAIAIAAABFACBGAAC9BwAgAQAAABgAIAMAAABHACBNAAC1BwAgTgAAuwcAIAEAAABHACABAAAARQAgBgwAANELACBTAADTCwAgVAAA0gsAIPIEAAD7CQAgngUAAPsJACChBQAA-wkAIA7pBAAAwggAMOoEAADFBwAQ6wQAAMIIADDsBAEApwgAIfEEAQCnCAAh8gQBAKgIACH0BEAAqQgAIfUEQACpCAAhlAUBAKcIACGWBQEApwgAIZ0FAQCnCAAhngUBAKgIACGgBQAAwwigBSKhBUAAxAgAIQMAAABFACABAADEBwAwUgAAxQcAIAMAAABFACABAABGADACAABHACABAAAAPQAgAQAAAD0AIAMAAAA7ACABAAA8ADACAAA9ACADAAAAOwAgAQAAPAAwAgAAPQAgAwAAADsAIAEAADwAMAIAAD0AIA8HAADVCgAgCQAA1goAIBsAANQKACAhAADQCwAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGXBQEAAAABmAUBAAAAAZkFAQAAAAGaBQEAAAABmwUBAAAAAZwFQAAAAAEBRgAAzQcAIAvsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZcFAQAAAAGYBQEAAAABmQUBAAAAAZoFAQAAAAGbBQEAAAABnAVAAAAAAQFGAADPBwAwAUYAAM8HADABAAAAGAAgDwcAANEKACAJAADSCgAgGwAA0AoAICEAAM8LACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlwUBAP8JACGYBQEA_wkAIZkFAQCACgAhmgUBAIAKACGbBQEAgAoAIZwFQACBCgAhAgAAAD0AIEYAANMHACAL7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZcFAQD_CQAhmAUBAP8JACGZBQEAgAoAIZoFAQCACgAhmwUBAIAKACGcBUAAgQoAIQIAAAA7ACBGAADVBwAgAgAAADsAIEYAANUHACABAAAAGAAgAwAAAD0AIE0AAM0HACBOAADTBwAgAQAAAD0AIAEAAAA7ACAHDAAAzAsAIFMAAM4LACBUAADNCwAg8gQAAPsJACCZBQAA-wkAIJoFAAD7CQAgmwUAAPsJACAO6QQAAMEIADDqBAAA3QcAEOsEAADBCAAw7AQBAKcIACHxBAEApwgAIfIEAQCoCAAh9ARAAKkIACH1BEAAqQgAIZcFAQCnCAAhmAUBAKcIACGZBQEAqAgAIZoFAQCoCAAhmwUBAKgIACGcBUAAqQgAIQMAAAA7ACABAADcBwAwUgAA3QcAIAMAAAA7ACABAAA8ADACAAA9ACABAAAAQgAgAQAAAEIAIAMAAABAACABAABBADACAABCACADAAAAQAAgAQAAQQAwAgAAQgAgAwAAAEAAIAEAAEEAMAIAAEIAIA0HAADuCgAgCQAA7woAIBIAAMsLACAUAADtCgAgFgAA7AoAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABAUYAAOUHACAI7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlQUBAAAAAZYFAQAAAAEBRgAA5wcAMAFGAADnBwAwAQAAABgAIA0HAADpCgAgCQAA6goAIBIAAMoLACAUAADoCgAgFgAA5woAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACECAAAAQgAgRgAA6wcAIAjsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIZYFAQD_CQAhAgAAAEAAIEYAAO0HACACAAAAQAAgRgAA7QcAIAEAAAAYACADAAAAQgAgTQAA5QcAIE4AAOsHACABAAAAQgAgAQAAAEAAIAQMAADHCwAgUwAAyQsAIFQAAMgLACDyBAAA-wkAIAvpBAAAwAgAMOoEAAD1BwAQ6wQAAMAIADDsBAEApwgAIfEEAQCnCAAh8gQBAKgIACH0BEAAqQgAIfUEQACpCAAhlAUBAKcIACGVBQEApwgAIZYFAQCnCAAhAwAAAEAAIAEAAPQHADBSAAD1BwAgAwAAAEAAIAEAAEEAMAIAAEIAIBEtAAC_CAAg6QQAALkIADDqBAAA5gEAEOsEAAC5CAAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGBBQEAAAABggUBALoIACGDBQEAuggAIYQFAQC6CAAhhQUBALsIACGGBQAAswgAIIcFAACzCAAgiAUAALwIACCJBQAAvAgAIIoFIAC9CAAhAQAAAPgHACABAAAA-AcAIAItAADGCwAghQUAAPsJACADAAAA5gEAIAEAAPsHADACAAD4BwAgAwAAAOYBACABAAD7BwAwAgAA-AcAIAMAAADmAQAgAQAA-wcAMAIAAPgHACAOLQAAxQsAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGCBQEAAAABgwUBAAAAAYQFAQAAAAGFBQEAAAABhgUAAMMLACCHBQAAxAsAIIgFgAAAAAGJBYAAAAABigUgAAAAAQFGAAD_BwAgDewEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGCBQEAAAABgwUBAAAAAYQFAQAAAAGFBQEAAAABhgUAAMMLACCHBQAAxAsAIIgFgAAAAAGJBYAAAAABigUgAAAAAQFGAACBCAAwAUYAAIEIADAOLQAAwgsAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIYEFAQD_CQAhggUBAP8JACGDBQEA_wkAIYQFAQD_CQAhhQUBAIAKACGGBQAAvwsAIIcFAADACwAgiAWAAAAAAYkFgAAAAAGKBSAAwQsAIQIAAAD4BwAgRgAAhAgAIA3sBAEA_wkAIfQEQACBCgAh9QRAAIEKACGBBQEA_wkAIYIFAQD_CQAhgwUBAP8JACGEBQEA_wkAIYUFAQCACgAhhgUAAL8LACCHBQAAwAsAIIgFgAAAAAGJBYAAAAABigUgAMELACECAAAA5gEAIEYAAIYIACACAAAA5gEAIEYAAIYIACADAAAA-AcAIE0AAP8HACBOAACECAAgAQAAAPgHACABAAAA5gEAIAQMAAC8CwAgUwAAvgsAIFQAAL0LACCFBQAA-wkAIBDpBAAAsggAMOoEAACNCAAQ6wQAALIIADDsBAEApwgAIfQEQACpCAAh9QRAAKkIACGBBQEApwgAIYIFAQCnCAAhgwUBAKcIACGEBQEApwgAIYUFAQCoCAAhhgUAALMIACCHBQAAswgAIIgFAAC0CAAgiQUAALQIACCKBSAAtQgAIQMAAADmAQAgAQAAjAgAMFIAAI0IACADAAAA5gEAIAEAAPsHADACAAD4BwAgAQAAABAAIAEAAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAAAOACABAAAPADACAAAQACASAwAAuwsAIAcAALQLACAJAAC6CwAgFQAAtQsAIBcAALYLACAYAAC3CwAgOAAAuAsAIDkAALkLACDsBAEAAAAB7QQBAAAAAe4EAQAAAAHvBAEAAAAB8AQBAAAAAfEEAQAAAAHyBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABAUYAAJUIACAK7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAQFGAACXCAAwAUYAAJcIADASAwAAiQoAIAcAAIIKACAJAACICgAgFQAAgwoAIBcAAIQKACAYAACFCgAgOAAAhgoAIDkAAIcKACDsBAEA_wkAIe0EAQD_CQAh7gQBAP8JACHvBAEA_wkAIfAEAQCACgAh8QQBAP8JACHyBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIQIAAAAQACBGAACaCAAgCuwEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhAgAAAA4AIEYAAJwIACACAAAADgAgRgAAnAgAIAMAAAAQACBNAACVCAAgTgAAmggAIAEAAAAQACABAAAADgAgBAwAAPwJACBTAAD-CQAgVAAA_QkAIPAEAAD7CQAgDekEAACmCAAw6gQAAKMIABDrBAAApggAMOwEAQCnCAAh7QQBAKcIACHuBAEApwgAIe8EAQCnCAAh8AQBAKgIACHxBAEApwgAIfIEAQCnCAAh8wQBAKcIACH0BEAAqQgAIfUEQACpCAAhAwAAAA4AIAEAAKIIADBSAACjCAAgAwAAAA4AIAEAAA8AMAIAABAAIA3pBAAApggAMOoEAACjCAAQ6wQAAKYIADDsBAEApwgAIe0EAQCnCAAh7gQBAKcIACHvBAEApwgAIfAEAQCoCAAh8QQBAKcIACHyBAEApwgAIfMEAQCnCAAh9ARAAKkIACH1BEAAqQgAIQ4MAACrCAAgUwAAsQgAIFQAALEIACD2BAEAAAAB9wQBAAAABPgEAQAAAAT5BAEAAAAB-gQBAAAAAfsEAQAAAAH8BAEAAAAB_QQBALAIACH-BAEAAAAB_wQBAAAAAYAFAQAAAAEODAAArggAIFMAAK8IACBUAACvCAAg9gQBAAAAAfcEAQAAAAX4BAEAAAAF-QQBAAAAAfoEAQAAAAH7BAEAAAAB_AQBAAAAAf0EAQCtCAAh_gQBAAAAAf8EAQAAAAGABQEAAAABCwwAAKsIACBTAACsCAAgVAAArAgAIPYEQAAAAAH3BEAAAAAE-ARAAAAABPkEQAAAAAH6BEAAAAAB-wRAAAAAAfwEQAAAAAH9BEAAqggAIQsMAACrCAAgUwAArAgAIFQAAKwIACD2BEAAAAAB9wRAAAAABPgEQAAAAAT5BEAAAAAB-gRAAAAAAfsEQAAAAAH8BEAAAAAB_QRAAKoIACEI9gQCAAAAAfcEAgAAAAT4BAIAAAAE-QQCAAAAAfoEAgAAAAH7BAIAAAAB_AQCAAAAAf0EAgCrCAAhCPYEQAAAAAH3BEAAAAAE-ARAAAAABPkEQAAAAAH6BEAAAAAB-wRAAAAAAfwEQAAAAAH9BEAArAgAIQ4MAACuCAAgUwAArwgAIFQAAK8IACD2BAEAAAAB9wQBAAAABfgEAQAAAAX5BAEAAAAB-gQBAAAAAfsEAQAAAAH8BAEAAAAB_QQBAK0IACH-BAEAAAAB_wQBAAAAAYAFAQAAAAEI9gQCAAAAAfcEAgAAAAX4BAIAAAAF-QQCAAAAAfoEAgAAAAH7BAIAAAAB_AQCAAAAAf0EAgCuCAAhC_YEAQAAAAH3BAEAAAAF-AQBAAAABfkEAQAAAAH6BAEAAAAB-wQBAAAAAfwEAQAAAAH9BAEArwgAIf4EAQAAAAH_BAEAAAABgAUBAAAAAQ4MAACrCAAgUwAAsQgAIFQAALEIACD2BAEAAAAB9wQBAAAABPgEAQAAAAT5BAEAAAAB-gQBAAAAAfsEAQAAAAH8BAEAAAAB_QQBALAIACH-BAEAAAAB_wQBAAAAAYAFAQAAAAEL9gQBAAAAAfcEAQAAAAT4BAEAAAAE-QQBAAAAAfoEAQAAAAH7BAEAAAAB_AQBAAAAAf0EAQCxCAAh_gQBAAAAAf8EAQAAAAGABQEAAAABEOkEAACyCAAw6gQAAI0IABDrBAAAsggAMOwEAQCnCAAh9ARAAKkIACH1BEAAqQgAIYEFAQCnCAAhggUBAKcIACGDBQEApwgAIYQFAQCnCAAhhQUBAKgIACGGBQAAswgAIIcFAACzCAAgiAUAALQIACCJBQAAtAgAIIoFIAC1CAAhBPYEAQAAAAWRBQEAAAABkgUBAAAABJMFAQAAAAQPDAAAqwgAIFMAALgIACBUAAC4CAAg9gSAAAAAAfkEgAAAAAH6BIAAAAAB-wSAAAAAAfwEgAAAAAH9BIAAAAABiwUBAAAAAYwFAQAAAAGNBQEAAAABjgWAAAAAAY8FgAAAAAGQBYAAAAABBQwAAKsIACBTAAC3CAAgVAAAtwgAIPYEIAAAAAH9BCAAtggAIQUMAACrCAAgUwAAtwgAIFQAALcIACD2BCAAAAAB_QQgALYIACEC9gQgAAAAAf0EIAC3CAAhDPYEgAAAAAH5BIAAAAAB-gSAAAAAAfsEgAAAAAH8BIAAAAAB_QSAAAAAAYsFAQAAAAGMBQEAAAABjQUBAAAAAY4FgAAAAAGPBYAAAAABkAWAAAAAAREtAAC_CAAg6QQAALkIADDqBAAA5gEAEOsEAAC5CAAw7AQBALoIACH0BEAAvggAIfUEQAC-CAAhgQUBALoIACGCBQEAuggAIYMFAQC6CAAhhAUBALoIACGFBQEAuwgAIYYFAACzCAAghwUAALMIACCIBQAAvAgAIIkFAAC8CAAgigUgAL0IACEL9gQBAAAAAfcEAQAAAAT4BAEAAAAE-QQBAAAAAfoEAQAAAAH7BAEAAAAB_AQBAAAAAf0EAQCxCAAh_gQBAAAAAf8EAQAAAAGABQEAAAABC_YEAQAAAAH3BAEAAAAF-AQBAAAABfkEAQAAAAH6BAEAAAAB-wQBAAAAAfwEAQAAAAH9BAEArwgAIf4EAQAAAAH_BAEAAAABgAUBAAAAAQz2BIAAAAAB-QSAAAAAAfoEgAAAAAH7BIAAAAAB_ASAAAAAAf0EgAAAAAGLBQEAAAABjAUBAAAAAY0FAQAAAAGOBYAAAAABjwWAAAAAAZAFgAAAAAEC9gQgAAAAAf0EIAC3CAAhCPYEQAAAAAH3BEAAAAAE-ARAAAAABPkEQAAAAAH6BEAAAAAB-wRAAAAAAfwEQAAAAAH9BEAArAgAISIEAACnCQAgBQAAqAkAIAYAAI8JACASAACQCQAgGwAAkQkAIC4AAO8IACA3AACTCQAgOgAAkwkAIDsAAO8IACA8AACpCQAgPQAA7AgAID4AAOwIACA_AACqCQAgQAAAqwkAIOkEAACmCQAw6gQAAG8AEOsEAACmCQAw7AQBALoIACHwBAEAuwgAIfQEQAC-CAAh9QRAAL4IACG8BQEAuggAIYwGAQC6CAAhjQYgAL0IACGOBgEAuwgAIY8GAQC7CAAhkAYBALsIACGRBgEAuwgAIZIGAQC7CAAhkwYBALsIACGUBgEAuggAIZUGAQC6CAAhnwYAAG8AIKAGAABvACAL6QQAAMAIADDqBAAA9QcAEOsEAADACAAw7AQBAKcIACHxBAEApwgAIfIEAQCoCAAh9ARAAKkIACH1BEAAqQgAIZQFAQCnCAAhlQUBAKcIACGWBQEApwgAIQ7pBAAAwQgAMOoEAADdBwAQ6wQAAMEIADDsBAEApwgAIfEEAQCnCAAh8gQBAKgIACH0BEAAqQgAIfUEQACpCAAhlwUBAKcIACGYBQEApwgAIZkFAQCoCAAhmgUBAKgIACGbBQEAqAgAIZwFQACpCAAhDukEAADCCAAw6gQAAMUHABDrBAAAwggAMOwEAQCnCAAh8QQBAKcIACHyBAEAqAgAIfQEQACpCAAh9QRAAKkIACGUBQEApwgAIZYFAQCnCAAhnQUBAKcIACGeBQEAqAgAIaAFAADDCKAFIqEFQADECAAhBwwAAKsIACBTAADICAAgVAAAyAgAIPYEAAAAoAUC9wQAAACgBQj4BAAAAKAFCP0EAADHCKAFIgsMAACuCAAgUwAAxggAIFQAAMYIACD2BEAAAAAB9wRAAAAABfgEQAAAAAX5BEAAAAAB-gRAAAAAAfsEQAAAAAH8BEAAAAAB_QRAAMUIACELDAAArggAIFMAAMYIACBUAADGCAAg9gRAAAAAAfcEQAAAAAX4BEAAAAAF-QRAAAAAAfoEQAAAAAH7BEAAAAAB_ARAAAAAAf0EQADFCAAhCPYEQAAAAAH3BEAAAAAF-ARAAAAABfkEQAAAAAH6BEAAAAAB-wRAAAAAAfwEQAAAAAH9BEAAxggAIQcMAACrCAAgUwAAyAgAIFQAAMgIACD2BAAAAKAFAvcEAAAAoAUI-AQAAACgBQj9BAAAxwigBSIE9gQAAACgBQL3BAAAAKAFCPgEAAAAoAUI_QQAAMgIoAUiEekEAADJCAAw6gQAAK0HABDrBAAAyQgAMOwEAQCnCAAh8QQBAKcIACHyBAEAqAgAIfQEQACpCAAh9QRAAKkIACGBBQEApwgAIZYFAQCoCAAhogUBAKgIACGkBQAAygikBSKlBQEAqAgAIaYFQADECAAhpwVAAKkIACGoBQEApwgAIakFAQCoCAAhBwwAAKsIACBTAADMCAAgVAAAzAgAIPYEAAAApAUC9wQAAACkBQj4BAAAAKQFCP0EAADLCKQFIgcMAACrCAAgUwAAzAgAIFQAAMwIACD2BAAAAKQFAvcEAAAApAUI-AQAAACkBQj9BAAAywikBSIE9gQAAACkBQL3BAAAAKQFCPgEAAAApAUI_QQAAMwIpAUiF-kEAADNCAAw6gQAAJEHABDrBAAAzQgAMOwEAQCnCAAh8QQBAKcIACHyBAEAqAgAIfQEQACpCAAh9QRAAKkIACGWBQEApwgAIaoFAQCnCAAhqwUIAM4IACGsBQgAzggAIa0FCADOCAAhrgUIAM4IACGvBQgAzggAIbAFCADOCAAhsQUIAM4IACGyBQgAzggAIbMFCADOCAAhtAUIAM4IACG1BQgAzggAIbYFCADOCAAhtwUIAM4IACENDAAArggAIFMAANAIACBUAADQCAAg1QEAANAIACDWAQAA0AgAIPYECAAAAAH3BAgAAAAF-AQIAAAABfkECAAAAAH6BAgAAAAB-wQIAAAAAfwECAAAAAH9BAgAzwgAIQ0MAACuCAAgUwAA0AgAIFQAANAIACDVAQAA0AgAINYBAADQCAAg9gQIAAAAAfcECAAAAAX4BAgAAAAF-QQIAAAAAfoECAAAAAH7BAgAAAAB_AQIAAAAAf0ECADPCAAhCPYECAAAAAH3BAgAAAAF-AQIAAAABfkECAAAAAH6BAgAAAAB-wQIAAAAAfwECAAAAAH9BAgA0AgAIQvpBAAA0QgAMOoEAAD5BgAQ6wQAANEIADDsBAEApwgAIfAEAQCoCAAh8QQBAKcIACHyBAEAqAgAIfMEAQCnCAAh9ARAAKkIACH1BEAAqQgAIbgFAQCnCAAhD-kEAADSCAAw6gQAAOEGABDrBAAA0ggAMOwEAQCnCAAh9ARAAKkIACH1BEAAqQgAIZgFAQCoCAAhogUBAKgIACGkBQAA0wi6BSKlBQEAqAgAIaYFQADECAAhpwVAAKkIACGoBQEApwgAIakFAQCoCAAhugUBAKcIACEHDAAAqwgAIFMAANUIACBUAADVCAAg9gQAAAC6BQL3BAAAALoFCPgEAAAAugUI_QQAANQIugUiBwwAAKsIACBTAADVCAAgVAAA1QgAIPYEAAAAugUC9wQAAAC6BQj4BAAAALoFCP0EAADUCLoFIgT2BAAAALoFAvcEAAAAugUI-AQAAAC6BQj9BAAA1Qi6BSIM6QQAANYIADDqBAAAxwYAEOsEAADWCAAw7AQBAKcIACH0BEAAqQgAIfUEQACpCAAhggUBAKcIACGDBQEApwgAIYgFAAC0CAAgigUgALUIACG6BQEApwgAIbsFAACzCAAgDSUAAL8IACDpBAAA1wgAMOoEAADqAQAQ6wQAANcIADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGCBQEAuggAIYMFAQC6CAAhiAUAALwIACCKBSAAvQgAIboFAQC6CAAhuwUAALMIACAI6QQAANgIADDqBAAArwYAEOsEAADYCAAw7AQBAKcIACHxBAEApwgAIbwFAQCnCAAhvQVAAKkIACG-BUAAqQgAIQwVAADbCAAgGQAA2ggAIB0AAN0IACAeAADcCAAg6QQAANkIADDqBAAAnAYAEOsEAADZCAAw7AQBALoIACHxBAEAuggAIbwFAQC6CAAhvQVAAL4IACG-BUAAvggAIQO_BQAASgAgwAUAAEoAIMEFAABKACADvwUAACYAIMAFAAAmACDBBQAAJgAgA78FAABPACDABQAATwAgwQUAAE8AIAO_BQAAUwAgwAUAAFMAIMEFAABTACAN6QQAAN4IADDqBAAAlgYAEOsEAADeCAAw7AQBAKcIACHxBAEApwgAIfIEAQCoCAAh9ARAAKkIACH1BEAAqQgAIbwFAQCnCAAhwgUBAKgIACHDBQIA3wgAIcQFAQCnCAAhxQUBAKgIACENDAAArggAIFMAAK4IACBUAACuCAAg1QEAANAIACDWAQAArggAIPYEAgAAAAH3BAIAAAAF-AQCAAAABfkEAgAAAAH6BAIAAAAB-wQCAAAAAfwEAgAAAAH9BAIA4AgAIQ0MAACuCAAgUwAArggAIFQAAK4IACDVAQAA0AgAINYBAACuCAAg9gQCAAAAAfcEAgAAAAX4BAIAAAAF-QQCAAAAAfoEAgAAAAH7BAIAAAAB_AQCAAAAAf0EAgDgCAAhC-kEAADhCAAw6gQAAPwFABDrBAAA4QgAMOwEAQCnCAAh9ARAAKkIACH1BEAAqQgAIaQFAADiCMkFIrwFAQCnCAAhwgUBAKgIACHGBUAAqQgAIccFQACpCAAhBwwAAKsIACBTAADkCAAgVAAA5AgAIPYEAAAAyQUC9wQAAADJBQj4BAAAAMkFCP0EAADjCMkFIgcMAACrCAAgUwAA5AgAIFQAAOQIACD2BAAAAMkFAvcEAAAAyQUI-AQAAADJBQj9BAAA4wjJBSIE9gQAAADJBQL3BAAAAMkFCPgEAAAAyQUI_QQAAOQIyQUiDAsAAOcIACDpBAAA5QgAMOoEAADpBQAQ6wQAAOUIADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGkBQAA5gjJBSK8BQEAuggAIcIFAQC7CAAhxgVAAL4IACHHBUAAvggAIQT2BAAAAMkFAvcEAAAAyQUI-AQAAADJBQj9BAAA5AjJBSIDvwUAACoAIMAFAAAqACDBBQAAKgAgDOkEAADoCAAw6gQAAOMFABDrBAAA6AgAMOwEAQCnCAAh9ARAAKkIACH1BEAAqQgAIaoFAQCnCAAhvAUBAKcIACHCBQEAqAgAIckFAQCoCAAhygUBAKcIACHLBQEApwgAIQ7pBAAA6QgAMOoEAADNBQAQ6wQAAOkIADDsBAEApwgAIfEEAQCnCAAh8gQBAKcIACH0BEAAqQgAIfUEQACpCAAhnQUBAKcIACHCBQEAqAgAIcwFAQCoCAAhzQVAAMQIACHOBQgAzggAIc8FCADOCAAhD-kEAADqCAAw6gQAALcFABDrBAAA6ggAMOwEAQCnCAAh8QQBAKcIACHyBAEAqAgAIfQEQACpCAAh9QRAAKkIACGdBQEApwgAIdAFAQCoCAAh0QUBAKcIACHSBQAAswgAINMFAQCoCAAh1AUBAKgIACHVBQEApwgAIRAjAADsCAAg6QQAAOsIADDqBAAApAUAEOsEAADrCAAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZ0FAQC6CAAh0AUBALsIACHRBQEAuggAIdIFAACzCAAg0wUBALsIACHUBQEAuwgAIdUFAQC6CAAhA78FAABpACDABQAAaQAgwQUAAGkAIA_pBAAA7QgAMOoEAACeBQAQ6wQAAO0IADDsBAEApwgAIfEEAQCnCAAh8gQBAKgIACH0BEAAqQgAIfUEQACpCAAhnQUBAKcIACHQBQEAqAgAIdEFAQCnCAAh0gUAALMIACDTBQEAqAgAIdQFAQCoCAAh1QUBAKcIACEQIwAA7wgAIOkEAADuCAAw6gQAAIsFABDrBAAA7ggAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGdBQEAuggAIdAFAQC7CAAh0QUBALoIACHSBQAAswgAINMFAQC7CAAh1AUBALsIACHVBQEAuggAIQO_BQAAjQEAIMAFAACNAQAgwQUAAI0BACAa6QQAAPAIADDqBAAAhQUAEOsEAADwCAAw7AQBAKcIACHxBAEApwgAIfIEAQCnCAAh9ARAAKkIACH1BEAAqQgAIZgFAQCnCAAhpAUAAPII2gUixAUBAKcIACHWBQEApwgAIdgFAADxCNgFItoFAgDzCAAh2wUQAPQIACHcBQEApwgAId0FAQCnCAAh3gUBAKcIACHfBQEAqAgAIeAFAQCoCAAh4QUBAKgIACHiBQEAqAgAIeMFAQCoCAAh5AUAAPUIACDlBUAAqQgAIeYFQADECAAhBwwAAKsIACBTAAD-CAAgVAAA_ggAIPYEAAAA2AUC9wQAAADYBQj4BAAAANgFCP0EAAD9CNgFIgcMAACrCAAgUwAA_AgAIFQAAPwIACD2BAAAANoFAvcEAAAA2gUI-AQAAADaBQj9BAAA-wjaBSINDAAAqwgAIFMAAKsIACBUAACrCAAg1QEAAPoIACDWAQAAqwgAIPYEAgAAAAH3BAIAAAAE-AQCAAAABPkEAgAAAAH6BAIAAAAB-wQCAAAAAfwEAgAAAAH9BAIA-QgAIQ0MAACrCAAgUwAA-AgAIFQAAPgIACDVAQAA-AgAINYBAAD4CAAg9gQQAAAAAfcEEAAAAAT4BBAAAAAE-QQQAAAAAfoEEAAAAAH7BBAAAAAB_AQQAAAAAf0EEAD3CAAhDwwAAK4IACBTAAD2CAAgVAAA9ggAIPYEgAAAAAH5BIAAAAAB-gSAAAAAAfsEgAAAAAH8BIAAAAAB_QSAAAAAAYsFAQAAAAGMBQEAAAABjQUBAAAAAY4FgAAAAAGPBYAAAAABkAWAAAAAAQz2BIAAAAAB-QSAAAAAAfoEgAAAAAH7BIAAAAAB_ASAAAAAAf0EgAAAAAGLBQEAAAABjAUBAAAAAY0FAQAAAAGOBYAAAAABjwWAAAAAAZAFgAAAAAENDAAAqwgAIFMAAPgIACBUAAD4CAAg1QEAAPgIACDWAQAA-AgAIPYEEAAAAAH3BBAAAAAE-AQQAAAABPkEEAAAAAH6BBAAAAAB-wQQAAAAAfwEEAAAAAH9BBAA9wgAIQj2BBAAAAAB9wQQAAAABPgEEAAAAAT5BBAAAAAB-gQQAAAAAfsEEAAAAAH8BBAAAAAB_QQQAPgIACENDAAAqwgAIFMAAKsIACBUAACrCAAg1QEAAPoIACDWAQAAqwgAIPYEAgAAAAH3BAIAAAAE-AQCAAAABPkEAgAAAAH6BAIAAAAB-wQCAAAAAfwEAgAAAAH9BAIA-QgAIQj2BAgAAAAB9wQIAAAABPgECAAAAAT5BAgAAAAB-gQIAAAAAfsECAAAAAH8BAgAAAAB_QQIAPoIACEHDAAAqwgAIFMAAPwIACBUAAD8CAAg9gQAAADaBQL3BAAAANoFCPgEAAAA2gUI_QQAAPsI2gUiBPYEAAAA2gUC9wQAAADaBQj4BAAAANoFCP0EAAD8CNoFIgcMAACrCAAgUwAA_ggAIFQAAP4IACD2BAAAANgFAvcEAAAA2AUI-AQAAADYBQj9BAAA_QjYBSIE9gQAAADYBQL3BAAAANgFCPgEAAAA2AUI_QQAAP4I2AUiDekEAAD_CAAw6gQAAO8EABDrBAAA_wgAMOwEAQCnCAAh8QQBAKcIACHyBAEApwgAIfQEQACpCAAh9QRAAKkIACHEBQEApwgAIdwFAQCnCAAh5wUQAPQIACHoBRAA9AgAIekFIAC1CAAhEekEAACACQAw6gQAANkEABDrBAAAgAkAMOwEAQCnCAAh8QQBAKgIACH0BEAAqQgAIfUEQACpCAAhpAUAAIIJ8QUipgVAAMQIACHCBQEAqAgAIeoFAQCnCAAh6wUBAKcIACHsBQEAqAgAIe4FAACBCe4FI-8FAQCoCAAh8QUBAKgIACHyBQEAqAgAIQcMAACuCAAgUwAAhgkAIFQAAIYJACD2BAAAAO4FA_cEAAAA7gUJ-AQAAADuBQn9BAAAhQnuBSMHDAAAqwgAIFMAAIQJACBUAACECQAg9gQAAADxBQL3BAAAAPEFCPgEAAAA8QUI_QQAAIMJ8QUiBwwAAKsIACBTAACECQAgVAAAhAkAIPYEAAAA8QUC9wQAAADxBQj4BAAAAPEFCP0EAACDCfEFIgT2BAAAAPEFAvcEAAAA8QUI-AQAAADxBQj9BAAAhAnxBSIHDAAArggAIFMAAIYJACBUAACGCQAg9gQAAADuBQP3BAAAAO4FCfgEAAAA7gUJ_QQAAIUJ7gUjBPYEAAAA7gUD9wQAAADuBQn4BAAAAO4FCf0EAACGCe4FIwvpBAAAhwkAMOoEAAC_BAAQ6wQAAIcJADDsBAEApwgAIfQEQACpCAAh9QRAAKkIACGgBQAAgQnuBSO8BQEApwgAIcIFAQCoCAAh7AUBAKgIACHvBQEAqAgAIR0GAACPCQAgFQAA2wgAIBcAAJIJACAZAADaCAAgHQAA3QgAIB4AANwIACAoAACLCQAgKQAAjAkAICoAAI4JACArAACQCQAgLAAAkQkAIC4AAO8IACAvAACUCQAgMAAAlQkAIDEAAJYJACAzAACKCQAgNAAAjQkAIDcAAJMJACDpBAAAiAkAMOoEAAAWABDrBAAAiAkAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIaAFAACJCe4FI7wFAQC6CAAhwgUBALsIACHsBQEAuwgAIe8FAQC7CAAhBPYEAAAA7gUD9wQAAADuBQn4BAAAAO4FCf0EAACGCe4FIwO_BQAAEgAgwAUAABIAIMEFAAASACADvwUAAB0AIMAFAAAdACDBBQAAHQAgA78FAABdACDABQAAXQAgwQUAAF0AIAO_BQAArgEAIMAFAACuAQAgwQUAAK4BACADvwUAACEAIMAFAAAhACDBBQAAIQAgA78FAAALACDABQAACwAgwQUAAAsAIAO_BQAADgAgwAUAAA4AIMEFAAAOACADvwUAAHEAIMAFAABxACDBBQAAcQAgA78FAABAACDABQAAQAAgwQUAAEAAIAO_BQAAuQEAIMAFAAC5AQAgwQUAALkBACADvwUAAEUAIMAFAABFACDBBQAARQAgA78FAAA7ACDABQAAOwAgwQUAADsAIAO_BQAANgAgwAUAADYAIMEFAAA2ACAK6QQAAJcJADDqBAAApwQAEOsEAACXCQAw7AQBAKcIACHxBAEAqAgAIfQEQACpCAAh9QRAAKkIACHCBQEAqAgAIewFAQCoCAAh8wUBAKcIACEK6QQAAJgJADDqBAAAjwQAEOsEAACYCQAw7AQBAKcIACH0BEAAqQgAIfUEQACpCAAhwgUBAKgIACHTBQEAqAgAIewFAQCoCAAh8wUBAKcIACEP6QQAAJkJADDqBAAA9wMAEOsEAACZCQAw7AQBAKcIACHxBAEApwgAIfIEAQCoCAAh9ARAAKkIACH1BEAAqQgAIZQFAQCnCAAhlQUBAKcIACGWBQEApwgAIZgFAQCnCAAhxAUBAKcIACHUBQEAqAgAIfQFQACpCAAhDekEAACaCQAw6gQAAN0DABDrBAAAmgkAMOwEAQCnCAAh8QQBAKcIACHyBAEApwgAIfQEQACpCAAh9QRAAKkIACHCBQEAqAgAIc4FAgDfCAAh1AUBAKgIACH1BQEApwgAIfYFAQCnCAAhDOkEAACbCQAw6gQAAMUDABDrBAAAmwkAMOwEAQCnCAAh8QQBAKcIACH0BEAAqQgAIfUEQACpCAAhvAUBAKgIACH3BQEApwgAIfgFAQCnCAAh-QUCAPMIACH7BQAAnAn7BSIHDAAAqwgAIFMAAJ4JACBUAACeCQAg9gQAAAD7BQL3BAAAAPsFCPgEAAAA-wUI_QQAAJ0J-wUiBwwAAKsIACBTAACeCQAgVAAAngkAIPYEAAAA-wUC9wQAAAD7BQj4BAAAAPsFCP0EAACdCfsFIgT2BAAAAPsFAvcEAAAA-wUI-AQAAAD7BQj9BAAAngn7BSIK6QQAAJ8JADDqBAAArwMAEOsEAACfCQAw7AQBAKcIACHxBAEApwgAIfIEAQCoCAAh9ARAAKkIACH1BEAAqQgAIbwFAQCnCAAhwgUBAKgIACEJ6QQAAKAJADDqBAAAlwMAEOsEAACgCQAw7AQBAKcIACHzBAEApwgAIfQEQACpCAAh9QRAAKkIACH8BQEApwgAIf0FQACpCAAhCekEAAChCQAw6gQAAIEDABDrBAAAoQkAMOwEAQCnCAAh9ARAAKkIACH1BEAAqQgAIf0FQACpCAAh_gUBAKcIACH_BQEApwgAIQnpBAAAogkAMOoEAADuAgAQ6wQAAKIJADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACH9BUAAvggAIf4FAQC6CAAh_wUBALoIACEQ6QQAAKMJADDqBAAA6AIAEOsEAACjCQAw7AQBAKcIACHzBAEApwgAIfQEQACpCAAh9QRAAKkIACGABgEApwgAIYEGAQCnCAAhggYBAKgIACGDBgEAqAgAIYQGAQCoCAAhhQZAAMQIACGGBkAAxAgAIYcGAQCoCAAhiAYBAKgIACEL6QQAAKQJADDqBAAA0gIAEOsEAACkCQAw7AQBAKcIACHzBAEApwgAIfQEQACpCAAh9QRAAKkIACH9BUAAqQgAIYkGAQCnCAAhigYBAKgIACGLBgEAqAgAIRLpBAAApQkAMOoEAAC8AgAQ6wQAAKUJADDsBAEApwgAIfAEAQCoCAAh9ARAAKkIACH1BEAAqQgAIbwFAQCnCAAhjAYBAKcIACGNBiAAtQgAIY4GAQCoCAAhjwYBAKgIACGQBgEAqAgAIZEGAQCoCAAhkgYBAKgIACGTBgEAqAgAIZQGAQCnCAAhlQYBAKcIACEgBAAApwkAIAUAAKgJACAGAACPCQAgEgAAkAkAIBsAAJEJACAuAADvCAAgNwAAkwkAIDoAAJMJACA7AADvCAAgPAAAqQkAID0AAOwIACA-AADsCAAgPwAAqgkAIEAAAKsJACDpBAAApgkAMOoEAABvABDrBAAApgkAMOwEAQC6CAAh8AQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACGMBgEAuggAIY0GIAC9CAAhjgYBALsIACGPBgEAuwgAIZAGAQC7CAAhkQYBALsIACGSBgEAuwgAIZMGAQC7CAAhlAYBALoIACGVBgEAuggAIQO_BQAAAwAgwAUAAAMAIMEFAAADACADvwUAAAcAIMAFAAAHACDBBQAABwAgEy0AAL8IACDpBAAAuQgAMOoEAADmAQAQ6wQAALkIADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGBBQEAuggAIYIFAQC6CAAhgwUBALoIACGEBQEAuggAIYUFAQC7CAAhhgUAALMIACCHBQAAswgAIIgFAAC8CAAgiQUAALwIACCKBSAAvQgAIZ8GAADmAQAgoAYAAOYBACAPJQAAvwgAIOkEAADXCAAw6gQAAOoBABDrBAAA1wgAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIYIFAQC6CAAhgwUBALoIACGIBQAAvAgAIIoFIAC9CAAhugUBALoIACG7BQAAswgAIJ8GAADqAQAgoAYAAOoBACADvwUAAOwBACDABQAA7AEAIMEFAADsAQAgCekEAACsCQAw6gQAAKQCABDrBAAArAkAMOwEAQCnCAAh9ARAAKkIACH1BEAAqQgAIaQFAACtCZgGIqoFAQCnCAAhlgZAAKkIACEHDAAAqwgAIFMAAK8JACBUAACvCQAg9gQAAACYBgL3BAAAAJgGCPgEAAAAmAYI_QQAAK4JmAYiBwwAAKsIACBTAACvCQAgVAAArwkAIPYEAAAAmAYC9wQAAACYBgj4BAAAAJgGCP0EAACuCZgGIgT2BAAAAJgGAvcEAAAAmAYI-AQAAACYBgj9BAAArwmYBiIJ6QQAALAJADDqBAAAjgIAEOsEAACwCQAw7AQBAKcIACHxBAEApwgAIfMEAQCnCAAh9ARAAKkIACH1BEAAqQgAIZQGAACxCZkGIgcMAACrCAAgUwAAswkAIFQAALMJACD2BAAAAJkGAvcEAAAAmQYI-AQAAACZBgj9BAAAsgmZBiIHDAAAqwgAIFMAALMJACBUAACzCQAg9gQAAACZBgL3BAAAAJkGCPgEAAAAmQYI_QQAALIJmQYiBPYEAAAAmQYC9wQAAACZBgj4BAAAAJkGCP0EAACzCZkGIgoDAAC_CAAg6QQAALQJADDqBAAA7AEAEOsEAAC0CQAw7AQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACH8BQEAuggAIf0FQAC-CAAhFAcAALkJACA1AAC_CAAgNgAAuAkAIOkEAAC1CQAw6gQAALkBABDrBAAAtQkAMOwEAQC6CAAh8QQBALsIACH0BEAAvggAIfUEQAC-CAAhpAUAALYJ8QUipgVAALcJACHCBQEAuwgAIeoFAQC6CAAh6wUBALoIACHsBQEAuwgAIe4FAACJCe4FI-8FAQC7CAAh8QUBALsIACHyBQEAuwgAIQT2BAAAAPEFAvcEAAAA8QUI-AQAAADxBQj9BAAAhAnxBSII9gRAAAAAAfcEQAAAAAX4BEAAAAAF-QRAAAAAAfoEQAAAAAH7BEAAAAAB_ARAAAAAAf0EQADGCAAhIgQAAKcJACAFAACoCQAgBgAAjwkAIBIAAJAJACAbAACRCQAgLgAA7wgAIDcAAJMJACA6AACTCQAgOwAA7wgAIDwAAKkJACA9AADsCAAgPgAA7AgAID8AAKoJACBAAACrCQAg6QQAAKYJADDqBAAAbwAQ6wQAAKYJADDsBAEAuggAIfAEAQC7CAAh9ARAAL4IACH1BEAAvggAIbwFAQC6CAAhjAYBALoIACGNBiAAvQgAIY4GAQC7CAAhjwYBALsIACGQBgEAuwgAIZEGAQC7CAAhkgYBALsIACGTBgEAuwgAIZQGAQC6CAAhlQYBALoIACGfBgAAbwAgoAYAAG8AIB8GAACPCQAgFQAA2wgAIBcAAJIJACAZAADaCAAgHQAA3QgAIB4AANwIACAoAACLCQAgKQAAjAkAICoAAI4JACArAACQCQAgLAAAkQkAIC4AAO8IACAvAACUCQAgMAAAlQkAIDEAAJYJACAzAACKCQAgNAAAjQkAIDcAAJMJACDpBAAAiAkAMOoEAAAWABDrBAAAiAkAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIaAFAACJCe4FI7wFAQC6CAAhwgUBALsIACHsBQEAuwgAIe8FAQC7CAAhnwYAABYAIKAGAAAWACAOBwAAvQkAIA8AAOcIACDpBAAAugkAMOoEAACuAQAQ6wQAALoJADDsBAEAuggAIfEEAQC6CAAh9ARAAL4IACH1BEAAvggAIbwFAQC7CAAh9wUBALoIACH4BQEAuggAIfkFAgC7CQAh-wUAALwJ-wUiCPYEAgAAAAH3BAIAAAAE-AQCAAAABPkEAgAAAAH6BAIAAAAB-wQCAAAAAfwEAgAAAAH9BAIAqwgAIQT2BAAAAPsFAvcEAAAA-wUI-AQAAAD7BQj9BAAAngn7BSIfBgAAjwkAIBUAANsIACAXAACSCQAgGQAA2ggAIB0AAN0IACAeAADcCAAgKAAAiwkAICkAAIwJACAqAACOCQAgKwAAkAkAICwAAJEJACAuAADvCAAgLwAAlAkAIDAAAJUJACAxAACWCQAgMwAAigkAIDQAAI0JACA3AACTCQAg6QQAAIgJADDqBAAAFgAQ6wQAAIgJADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGgBQAAiQnuBSO8BQEAuggAIcIFAQC7CAAh7AUBALsIACHvBQEAuwgAIZ8GAAAWACCgBgAAFgAgGwcAAL0JACAJAADCCQAgDgAAwAkAIBIAAMEJACDpBAAAvgkAMOoEAAA2ABDrBAAAvgkAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGWBQEAuggAIaoFAQC6CAAhqwUIAL8JACGsBQgAvwkAIa0FCAC_CQAhrgUIAL8JACGvBQgAvwkAIbAFCAC_CQAhsQUIAL8JACGyBQgAvwkAIbMFCAC_CQAhtAUIAL8JACG1BQgAvwkAIbYFCAC_CQAhtwUIAL8JACEI9gQIAAAAAfcECAAAAAX4BAgAAAAF-QQIAAAAAfoECAAAAAH7BAgAAAAB_AQIAAAAAf0ECADQCAAhHAcAAL0JACAJAADCCQAgCgAA7wkAIAsAAOcIACARAADtCQAgEgAAwQkAIBMAAO4JACAUAADiCQAgFgAA3wkAIBoAANUJACAbAADWCQAg6QQAAOwJADDqBAAAJgAQ6wQAAOwJADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlAUBALoIACGVBQEAuggAIZYFAQC6CAAhmAUBALoIACHEBQEAuggAIdQFAQC7CAAh9AVAAL4IACGfBgAAJgAgoAYAACYAIBcDAAC_CAAgBwAAvQkAIAkAANQJACAVAADbCAAgFwAAkgkAIBgAAJQJACA4AADvCAAgOQAAlgkAIOkEAAD2CQAw6gQAAA4AEOsEAAD2CQAw7AQBALoIACHtBAEAuggAIe4EAQC6CAAh7wQBALoIACHwBAEAuwgAIfEEAQC6CAAh8gQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACGfBgAADgAgoAYAAA4AIBsIAADzCQAgFQAA2wgAIBcAAJIJACAZAADaCAAgHQAA3QgAIB4AANwIACAoAACLCQAgKQAAjAkAICoAAI4JACArAACQCQAgLAAAkQkAIC4AAO8IACAvAACUCQAgMAAAlQkAIDEAAJYJACDpBAAA8gkAMOoEAAAYABDrBAAA8gkAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIcIFAQC7CAAh0wUBALsIACHsBQEAuwgAIfMFAQC6CAAhnwYAABgAIKAGAAAYACACgQUBAAAAAagFAQAAAAEXBwAAvQkAIAkAAMIJACASAADHCQAgJAAAxgkAICYAALgJACAtAAC_CAAg6QQAAMQJADDqBAAAjQEAEOsEAADECQAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIYEFAQC6CAAhlgUBALsIACGiBQEAuwgAIaQFAADFCaQFIqUFAQC7CAAhpgVAALcJACGnBUAAvggAIagFAQC6CAAhqQUBALsIACEE9gQAAACkBQL3BAAAAKQFCPgEAAAApAUI_QQAAMwIpAUiEiMAAO8IACDpBAAA7ggAMOoEAACLBQAQ6wQAAO4IADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhnQUBALoIACHQBQEAuwgAIdEFAQC6CAAh0gUAALMIACDTBQEAuwgAIdQFAQC7CAAh1QUBALoIACGfBgAAiwUAIKAGAACLBQAgFwMAAL8IACAHAAC9CQAgCQAA1AkAIBUAANsIACAXAACSCQAgGAAAlAkAIDgAAO8IACA5AACWCQAg6QQAAPYJADDqBAAADgAQ6wQAAPYJADDsBAEAuggAIe0EAQC6CAAh7gQBALoIACHvBAEAuggAIfAEAQC7CAAh8QQBALoIACHyBAEAuggAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIZ8GAAAOACCgBgAADgAgEgMAAL8IACAHAAC9CQAgCQAAwgkAIBUAANsIACAdAADdCAAgIgAAlQkAICcAAOwIACDpBAAAyAkAMOoEAABxABDrBAAAyAkAMOwEAQC6CAAh8AQBALsIACHxBAEAuggAIfIEAQC7CAAh8wQBALoIACH0BEAAvggAIfUEQAC-CAAhuAUBALoIACENBwAAvQkAIAkAAMIJACAZAADaCAAg6QQAAMkJADDqBAAAXQAQ6wQAAMkJADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIQKoBQEAAAABugUBAAAAARMbAADOCQAgJAAAzQkAICUAAL8IACAmAAC4CQAg6QQAAMsJADDqBAAAaQAQ6wQAAMsJADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGYBQEAuwgAIaIFAQC7CAAhpAUAAMwJugUipQUBALsIACGmBUAAtwkAIacFQAC-CAAhqAUBALoIACGpBQEAuwgAIboFAQC6CAAhBPYEAAAAugUC9wQAAAC6BQj4BAAAALoFCP0EAADVCLoFIhIjAADsCAAg6QQAAOsIADDqBAAApAUAEOsEAADrCAAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZ0FAQC6CAAh0AUBALsIACHRBQEAuggAIdIFAACzCAAg0wUBALsIACHUBQEAuwgAIdUFAQC6CAAhnwYAAKQFACCgBgAApAUAIBQDAAC_CAAgBwAAvQkAIAkAAMIJACAVAADbCAAgHQAA3QgAICIAAJUJACAnAADsCAAg6QQAAMgJADDqBAAAcQAQ6wQAAMgJADDsBAEAuggAIfAEAQC7CAAh8QQBALoIACHyBAEAuwgAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIbgFAQC6CAAhnwYAAHEAIKAGAABxACAfBwAAvQkAIAkAANQJACAaAADVCQAgGwAA1gkAIBwAANcJACDpBAAAzwkAMOoEAABTABDrBAAAzwkAMOwEAQC6CAAh8QQBALoIACHyBAEAuggAIfQEQAC-CAAh9QRAAL4IACGYBQEAuggAIaQFAADRCdoFIsQFAQC6CAAh1gUBALoIACHYBQAA0AnYBSLaBQIAuwkAIdsFEADSCQAh3AUBALoIACHdBQEAuggAId4FAQC6CAAh3wUBALsIACHgBQEAuwgAIeEFAQC7CAAh4gUBALsIACHjBQEAuwgAIeQFAADTCQAg5QVAAL4IACHmBUAAtwkAIQT2BAAAANgFAvcEAAAA2AUI-AQAAADYBQj9BAAA_gjYBSIE9gQAAADaBQL3BAAAANoFCPgEAAAA2gUI_QQAAPwI2gUiCPYEEAAAAAH3BBAAAAAE-AQQAAAABPkEEAAAAAH6BBAAAAAB-wQQAAAAAfwEEAAAAAH9BBAA-AgAIQz2BIAAAAAB-QSAAAAAAfoEgAAAAAH7BIAAAAAB_ASAAAAAAf0EgAAAAAGLBQEAAAABjAUBAAAAAY0FAQAAAAGOBYAAAAABjwWAAAAAAZAFgAAAAAEbCAAA8wkAIBUAANsIACAXAACSCQAgGQAA2ggAIB0AAN0IACAeAADcCAAgKAAAiwkAICkAAIwJACAqAACOCQAgKwAAkAkAICwAAJEJACAuAADvCAAgLwAAlAkAIDAAAJUJACAxAACWCQAg6QQAAPIJADDqBAAAGAAQ6wQAAPIJADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACHCBQEAuwgAIdMFAQC7CAAh7AUBALsIACHzBQEAuggAIZ8GAAAYACCgBgAAGAAgDhUAANsIACAZAADaCAAgHQAA3QgAIB4AANwIACDpBAAA2QgAMOoEAACcBgAQ6wQAANkIADDsBAEAuggAIfEEAQC6CAAhvAUBALoIACG9BUAAvggAIb4FQAC-CAAhnwYAAJwGACCgBgAAnAYAIBQDAAC_CAAgBwAAvQkAIAkAAMIJACAVAADbCAAgHQAA3QgAICIAAJUJACAnAADsCAAg6QQAAMgJADDqBAAAcQAQ6wQAAMgJADDsBAEAuggAIfAEAQC7CAAh8QQBALoIACHyBAEAuwgAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIbgFAQC6CAAhnwYAAHEAIKAGAABxACATBwAAvQkAIAkAANQJACAaAADVCQAgHQAA3QgAIOkEAADZCQAw6gQAAE8AEOsEAADZCQAw7AQBALoIACHxBAEAuggAIfIEAQC6CAAh9ARAAL4IACH1BEAAvggAIcQFAQC6CAAh3AUBALoIACHnBRAA0gkAIegFEADSCQAh6QUgAL0IACGfBgAATwAgoAYAAE8AIALyBAEAAAABxAUBAAAAAREHAAC9CQAgCQAA1AkAIBoAANUJACAdAADdCAAg6QQAANkJADDqBAAATwAQ6wQAANkJADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhxAUBALoIACHcBQEAuggAIecFEADSCQAh6AUQANIJACHpBSAAvQgAIRQHAAC9CQAgCQAAwgkAIBUAANsIACAXAACSCQAgGAAAlAkAIBoAANUJACAfAADcCQAg6QQAANoJADDqBAAASgAQ6wQAANoJADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIcMFAgDbCQAhxAUBALoIACHFBQEAuwgAIQj2BAIAAAAB9wQCAAAABfgEAgAAAAX5BAIAAAAB-gQCAAAAAfsEAgAAAAH8BAIAAAAB_QQCAK4IACEPBwAAvQkAIAkAAMIJACAZAADaCAAg6QQAAMkJADDqBAAAXQAQ6wQAAMkJADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIZ8GAABdACCgBgAAXQAgEwcAAL0JACAJAADCCQAgEgAAwQkAIBYAAN8JACAgAACVCQAg6QQAAN0JADDqBAAARQAQ6wQAAN0JADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlAUBALoIACGWBQEAuggAIZ0FAQC6CAAhngUBALsIACGgBQAA3gmgBSKhBUAAtwkAIQT2BAAAAKAFAvcEAAAAoAUI-AQAAACgBQj9BAAAyAigBSIWBwAAvQkAIAkAAMIJACAVAADbCAAgFwAAkgkAIBgAAJQJACAaAADVCQAgHwAA3AkAIOkEAADaCQAw6gQAAEoAEOsEAADaCQAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIbwFAQC6CAAhwgUBALsIACHDBQIA2wkAIcQFAQC6CAAhxQUBALsIACGfBgAASgAgoAYAAEoAIAKUBQEAAAABlQUBAAAAARAHAAC9CQAgCQAAwgkAIBIAAMEJACAUAADiCQAgFgAA3wkAIOkEAADhCQAw6gQAAEAAEOsEAADhCQAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlQUBALoIACGWBQEAuggAIRQHAAC9CQAgCQAA1AkAIAoAAO8JACAVAADbCAAgFwAAkgkAIOkEAADwCQAw6gQAACEAEOsEAADwCQAw7AQBALoIACHxBAEAuggAIfIEAQC6CAAh9ARAAL4IACH1BEAAvggAIcIFAQC7CAAhzgUCANsJACHUBQEAuwgAIfUFAQC6CAAh9gUBALoIACGfBgAAIQAgoAYAACEAIAKXBQEAAAABmAUBAAAAARIHAAC9CQAgCQAAwgkAIBsAANYJACAhAADlCQAg6QQAAOQJADDqBAAAOwAQ6wQAAOQJADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlwUBALoIACGYBQEAuggAIZkFAQC7CAAhmgUBALsIACGbBQEAuwgAIZwFQAC-CAAhFQcAAL0JACAJAADCCQAgEgAAwQkAIBYAAN8JACAgAACVCQAg6QQAAN0JADDqBAAARQAQ6wQAAN0JADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlAUBALoIACGWBQEAuggAIZ0FAQC6CAAhngUBALsIACGgBQAA3gmgBSKhBUAAtwkAIZ8GAABFACCgBgAARQAgAqoFAQAAAAGWBkAAAAABCg4AAMAJACDpBAAA5wkAMOoEAAAyABDrBAAA5wkAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIaQFAADoCZgGIqoFAQC6CAAhlgZAAL4IACEE9gQAAACYBgL3BAAAAJgGCPgEAAAAmAYI_QQAAK8JmAYiDw0AAOoJACAOAADACQAgEAAA6wkAIOkEAADpCQAw6gQAACoAEOsEAADpCQAw7AQBALoIACH0BEAAvggAIfUEQAC-CAAhqgUBALoIACG8BQEAuggAIcIFAQC7CAAhyQUBALsIACHKBQEAuggAIcsFAQC6CAAhDgsAAOcIACDpBAAA5QgAMOoEAADpBQAQ6wQAAOUIADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGkBQAA5gjJBSK8BQEAuggAIcIFAQC7CAAhxgVAAL4IACHHBUAAvggAIZ8GAADpBQAgoAYAAOkFACAQBwAAvQkAIA8AAOcIACDpBAAAugkAMOoEAACuAQAQ6wQAALoJADDsBAEAuggAIfEEAQC6CAAh9ARAAL4IACH1BEAAvggAIbwFAQC7CAAh9wUBALoIACH4BQEAuggAIfkFAgC7CQAh-wUAALwJ-wUinwYAAK4BACCgBgAArgEAIBoHAAC9CQAgCQAAwgkAIAoAAO8JACALAADnCAAgEQAA7QkAIBIAAMEJACATAADuCQAgFAAA4gkAIBYAAN8JACAaAADVCQAgGwAA1gkAIOkEAADsCQAw6gQAACYAEOsEAADsCQAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlQUBALoIACGWBQEAuggAIZgFAQC6CAAhxAUBALoIACHUBQEAuwgAIfQFQAC-CAAhA78FAAAyACDABQAAMgAgwQUAADIAIB0HAAC9CQAgCQAAwgkAIA4AAMAJACASAADBCQAg6QQAAL4JADDqBAAANgAQ6wQAAL4JADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlgUBALoIACGqBQEAuggAIasFCAC_CQAhrAUIAL8JACGtBQgAvwkAIa4FCAC_CQAhrwUIAL8JACGwBQgAvwkAIbEFCAC_CQAhsgUIAL8JACGzBQgAvwkAIbQFCAC_CQAhtQUIAL8JACG2BQgAvwkAIbcFCAC_CQAhnwYAADYAIKAGAAA2ACAUBwAAvQkAIAkAANQJACAUAACOCQAgFQAA2wgAIOkEAADxCQAw6gQAAB0AEOsEAADxCQAw7AQBALoIACHxBAEAuggAIfIEAQC6CAAh9ARAAL4IACH1BEAAvggAIZ0FAQC6CAAhwgUBALsIACHMBQEAuwgAIc0FQAC3CQAhzgUIAL8JACHPBQgAvwkAIZ8GAAAdACCgBgAAHQAgEgcAAL0JACAJAADUCQAgCgAA7wkAIBUAANsIACAXAACSCQAg6QQAAPAJADDqBAAAIQAQ6wQAAPAJADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHOBQIA2wkAIdQFAQC7CAAh9QUBALoIACH2BQEAuggAIRIHAAC9CQAgCQAA1AkAIBQAAI4JACAVAADbCAAg6QQAAPEJADDqBAAAHQAQ6wQAAPEJADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhnQUBALoIACHCBQEAuwgAIcwFAQC7CAAhzQVAALcJACHOBQgAvwkAIc8FCAC_CQAhGQgAAPMJACAVAADbCAAgFwAAkgkAIBkAANoIACAdAADdCAAgHgAA3AgAICgAAIsJACApAACMCQAgKgAAjgkAICsAAJAJACAsAACRCQAgLgAA7wgAIC8AAJQJACAwAACVCQAgMQAAlgkAIOkEAADyCQAw6gQAABgAEOsEAADyCQAw7AQBALoIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHTBQEAuwgAIewFAQC7CAAh8wUBALoIACEOBwAAuQkAIDIAAPUJACDpBAAA9AkAMOoEAAASABDrBAAA9AkAMOwEAQC6CAAh8QQBALsIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHsBQEAuwgAIfMFAQC6CAAhnwYAABIAIKAGAAASACAMBwAAuQkAIDIAAPUJACDpBAAA9AkAMOoEAAASABDrBAAA9AkAMOwEAQC6CAAh8QQBALsIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHsBQEAuwgAIfMFAQC6CAAhA78FAAAYACDABQAAGAAgwQUAABgAIBUDAAC_CAAgBwAAvQkAIAkAANQJACAVAADbCAAgFwAAkgkAIBgAAJQJACA4AADvCAAgOQAAlgkAIOkEAAD2CQAw6gQAAA4AEOsEAAD2CQAw7AQBALoIACHtBAEAuggAIe4EAQC6CAAh7wQBALoIACHwBAEAuwgAIfEEAQC6CAAh8gQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACELAwAAvwgAIAcAAL0JACDpBAAA9wkAMOoEAAALABDrBAAA9wkAMOwEAQC6CAAh8QQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACGUBgAA-AmZBiIE9gQAAACZBgL3BAAAAJkGCPgEAAAAmQYI_QQAALMJmQYiEQMAAL8IACDpBAAA-QkAMOoEAAAHABDrBAAA-QkAMOwEAQC6CAAh8wQBALoIACH0BEAAvggAIfUEQAC-CAAhgAYBALoIACGBBgEAuggAIYIGAQC7CAAhgwYBALsIACGEBgEAuwgAIYUGQAC3CQAhhgZAALcJACGHBgEAuwgAIYgGAQC7CAAhDAMAAL8IACDpBAAA-gkAMOoEAAADABDrBAAA-gkAMOwEAQC6CAAh8wQBALoIACH0BEAAvggAIfUEQAC-CAAh_QVAAL4IACGJBgEAuggAIYoGAQC7CAAhiwYBALsIACEAAAAAAaQGAQAAAAEBpAYBAAAAAQGkBkAAAAABBU0AAJAWACBOAACtFwAgoQYAAJEWACCiBgAArBcAIKcGAACqBAAgC00AAPAKADBOAAD1CgAwoQYAAPEKADCiBgAA8goAMKMGAADzCgAgpAYAAPQKADClBgAA9AoAMKYGAAD0CgAwpwYAAPQKADCoBgAA9goAMKkGAAD3CgAwC00AANwKADBOAADhCgAwoQYAAN0KADCiBgAA3goAMKMGAADfCgAgpAYAAOAKADClBgAA4AoAMKYGAADgCgAwpwYAAOAKADCoBgAA4goAMKkGAADjCgAwC00AALUKADBOAAC6CgAwoQYAALYKADCiBgAAtwoAMKMGAAC4CgAgpAYAALkKADClBgAAuQoAMKYGAAC5CgAwpwYAALkKADCoBgAAuwoAMKkGAAC8CgAwC00AAJ0KADBOAACiCgAwoQYAAJ4KADCiBgAAnwoAMKMGAACgCgAgpAYAAKEKADClBgAAoQoAMKYGAAChCgAwpwYAAKEKADCoBgAAowoAMKkGAACkCgAwC00AAIoKADBOAACPCgAwoQYAAIsKADCiBgAAjAoAMKMGAACNCgAgpAYAAI4KADClBgAAjgoAMKYGAACOCgAwpwYAAI4KADCoBgAAkAoAMKkGAACRCgAwBU0AAI4WACBOAACqFwAgoQYAAI8WACCiBgAAqRcAIKcGAAAaACAFTQAAjBYAIE4AAKcXACChBgAAjRYAIKIGAACmFwAgpwYAAKcCACAWBwAAmwoAIAkAAJwKACAOAACaCgAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGqBQEAAAABqwUIAAAAAawFCAAAAAGtBQgAAAABrgUIAAAAAa8FCAAAAAGwBQgAAAABsQUIAAAAAbIFCAAAAAGzBQgAAAABtAUIAAAAAbUFCAAAAAG2BQgAAAABtwUIAAAAAQIAAACZAQAgTQAAmQoAIAMAAACZAQAgTQAAmQoAIE4AAJUKACABRgAApRcAMBsHAAC9CQAgCQAAwgkAIA4AAMAJACASAADBCQAg6QQAAL4JADDqBAAANgAQ6wQAAL4JADDsBAEAAAAB8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGWBQEAuggAIaoFAQAAAAGrBQgAvwkAIawFCAC_CQAhrQUIAL8JACGuBQgAvwkAIa8FCAC_CQAhsAUIAL8JACGxBQgAvwkAIbIFCAC_CQAhswUIAL8JACG0BQgAvwkAIbUFCAC_CQAhtgUIAL8JACG3BQgAvwkAIQIAAACZAQAgRgAAlQoAIAIAAACSCgAgRgAAkwoAIBfpBAAAkQoAMOoEAACSCgAQ6wQAAJEKADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlgUBALoIACGqBQEAuggAIasFCAC_CQAhrAUIAL8JACGtBQgAvwkAIa4FCAC_CQAhrwUIAL8JACGwBQgAvwkAIbEFCAC_CQAhsgUIAL8JACGzBQgAvwkAIbQFCAC_CQAhtQUIAL8JACG2BQgAvwkAIbcFCAC_CQAhF-kEAACRCgAw6gQAAJIKABDrBAAAkQoAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGWBQEAuggAIaoFAQC6CAAhqwUIAL8JACGsBQgAvwkAIa0FCAC_CQAhrgUIAL8JACGvBQgAvwkAIbAFCAC_CQAhsQUIAL8JACGyBQgAvwkAIbMFCAC_CQAhtAUIAL8JACG1BQgAvwkAIbYFCAC_CQAhtwUIAL8JACET7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIaoFAQD_CQAhqwUIAJQKACGsBQgAlAoAIa0FCACUCgAhrgUIAJQKACGvBQgAlAoAIbAFCACUCgAhsQUIAJQKACGyBQgAlAoAIbMFCACUCgAhtAUIAJQKACG1BQgAlAoAIbYFCACUCgAhtwUIAJQKACEFpAYIAAAAAasGCAAAAAGsBggAAAABrQYIAAAAAa4GCAAAAAEWBwAAlwoAIAkAAJgKACAOAACWCgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIaoFAQD_CQAhqwUIAJQKACGsBQgAlAoAIa0FCACUCgAhrgUIAJQKACGvBQgAlAoAIbAFCACUCgAhsQUIAJQKACGyBQgAlAoAIbMFCACUCgAhtAUIAJQKACG1BQgAlAoAIbYFCACUCgAhtwUIAJQKACEFTQAAmhcAIE4AAKMXACChBgAAmxcAIKIGAACiFwAgpwYAACgAIAVNAACYFwAgTgAAoBcAIKEGAACZFwAgogYAAJ8XACCnBgAAqgQAIAdNAACWFwAgTgAAnRcAIKEGAACXFwAgogYAAJwXACClBgAAGAAgpgYAABgAIKcGAAAaACAWBwAAmwoAIAkAAJwKACAOAACaCgAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGqBQEAAAABqwUIAAAAAawFCAAAAAGtBQgAAAABrgUIAAAAAa8FCAAAAAGwBQgAAAABsQUIAAAAAbIFCAAAAAGzBQgAAAABtAUIAAAAAbUFCAAAAAG2BQgAAAABtwUIAAAAAQNNAACaFwAgoQYAAJsXACCnBgAAKAAgA00AAJgXACChBgAAmRcAIKcGAACqBAAgA00AAJYXACChBgAAlxcAIKcGAAAaACASBwAAswoAIAkAALQKACAkAACwCgAgJgAAsgoAIC0AALEKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGiBQEAAAABpAUAAACkBQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABqQUBAAAAAQIAAACPAQAgTQAArwoAIAMAAACPAQAgTQAArwoAIE4AAKkKACABRgAAlRcAMBgHAAC9CQAgCQAAwgkAIBIAAMcJACAkAADGCQAgJgAAuAkAIC0AAL8IACDpBAAAxAkAMOoEAACNAQAQ6wQAAMQJADDsBAEAAAAB8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGBBQEAuggAIZYFAQC7CAAhogUBALsIACGkBQAAxQmkBSKlBQEAuwgAIaYFQAC3CQAhpwVAAL4IACGoBQEAuggAIakFAQC7CAAhmQYAAMMJACACAAAAjwEAIEYAAKkKACACAAAApQoAIEYAAKYKACAR6QQAAKQKADDqBAAApQoAEOsEAACkCgAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIYEFAQC6CAAhlgUBALsIACGiBQEAuwgAIaQFAADFCaQFIqUFAQC7CAAhpgVAALcJACGnBUAAvggAIagFAQC6CAAhqQUBALsIACER6QQAAKQKADDqBAAApQoAEOsEAACkCgAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIYEFAQC6CAAhlgUBALsIACGiBQEAuwgAIaQFAADFCaQFIqUFAQC7CAAhpgVAALcJACGnBUAAvggAIagFAQC6CAAhqQUBALsIACEN7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIYEFAQD_CQAhogUBAIAKACGkBQAApwqkBSKlBQEAgAoAIaYFQACoCgAhpwVAAIEKACGoBQEA_wkAIakFAQCACgAhAaQGAAAApAUCAaQGQAAAAAESBwAArQoAIAkAAK4KACAkAACqCgAgJgAArAoAIC0AAKsKACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhgQUBAP8JACGiBQEAgAoAIaQFAACnCqQFIqUFAQCACgAhpgVAAKgKACGnBUAAgQoAIagFAQD_CQAhqQUBAIAKACEFTQAAhBcAIE4AAJMXACChBgAAhRcAIKIGAACSFwAgpwYAAIgFACAFTQAAghcAIE4AAJAXACChBgAAgxcAIKIGAACPFwAgpwYAAKcCACAHTQAAgBcAIE4AAI0XACChBgAAgRcAIKIGAACMFwAgpQYAAG8AIKYGAABvACCnBgAApwIAIAVNAAD-FgAgTgAAihcAIKEGAAD_FgAgogYAAIkXACCnBgAAqgQAIAdNAAD8FgAgTgAAhxcAIKEGAAD9FgAgogYAAIYXACClBgAAGAAgpgYAABgAIKcGAAAaACASBwAAswoAIAkAALQKACAkAACwCgAgJgAAsgoAIC0AALEKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGiBQEAAAABpAUAAACkBQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABqQUBAAAAAQNNAACEFwAgoQYAAIUXACCnBgAAiAUAIANNAACCFwAgoQYAAIMXACCnBgAApwIAIANNAACAFwAgoQYAAIEXACCnBgAApwIAIANNAAD-FgAgoQYAAP8WACCnBgAAqgQAIANNAAD8FgAgoQYAAP0WACCnBgAAGgAgDgcAANkKACAJAADaCgAgFgAA2AoAICAAANsKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGdBQEAAAABngUBAAAAAaAFAAAAoAUCoQVAAAAAAQIAAABHACBNAADXCgAgAwAAAEcAIE0AANcKACBOAADACgAgAUYAAPsWADATBwAAvQkAIAkAAMIJACASAADBCQAgFgAA3wkAICAAAJUJACDpBAAA3QkAMOoEAABFABDrBAAA3QkAMOwEAQAAAAHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlgUBALoIACGdBQEAuggAIZ4FAQC7CAAhoAUAAN4JoAUioQVAALcJACECAAAARwAgRgAAwAoAIAIAAAC9CgAgRgAAvgoAIA7pBAAAvAoAMOoEAAC9CgAQ6wQAALwKADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlAUBALoIACGWBQEAuggAIZ0FAQC6CAAhngUBALsIACGgBQAA3gmgBSKhBUAAtwkAIQ7pBAAAvAoAMOoEAAC9CgAQ6wQAALwKADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlAUBALoIACGWBQEAuggAIZ0FAQC6CAAhngUBALsIACGgBQAA3gmgBSKhBUAAtwkAIQrsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGdBQEA_wkAIZ4FAQCACgAhoAUAAL8KoAUioQVAAKgKACEBpAYAAACgBQIOBwAAwgoAIAkAAMMKACAWAADBCgAgIAAAxAoAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZ0FAQD_CQAhngUBAIAKACGgBQAAvwqgBSKhBUAAqAoAIQVNAADgFgAgTgAA-RYAIKEGAADhFgAgogYAAPgWACCnBgAATAAgBU0AAN4WACBOAAD2FgAgoQYAAN8WACCiBgAA9RYAIKcGAACqBAAgB00AANwWACBOAADzFgAgoQYAAN0WACCiBgAA8hYAIKUGAAAYACCmBgAAGAAgpwYAABoAIAtNAADFCgAwTgAAygoAMKEGAADGCgAwogYAAMcKADCjBgAAyAoAIKQGAADJCgAwpQYAAMkKADCmBgAAyQoAMKcGAADJCgAwqAYAAMsKADCpBgAAzAoAMA0HAADVCgAgCQAA1goAIBsAANQKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGZBQEAAAABmgUBAAAAAZsFAQAAAAGcBUAAAAABAgAAAD0AIE0AANMKACADAAAAPQAgTQAA0woAIE4AAM8KACABRgAA8RYAMBMHAAC9CQAgCQAAwgkAIBsAANYJACAhAADlCQAg6QQAAOQJADDqBAAAOwAQ6wQAAOQJADDsBAEAAAAB8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGXBQEAuggAIZgFAQC6CAAhmQUBALsIACGaBQEAuwgAIZsFAQC7CAAhnAVAAL4IACGdBgAA4wkAIAIAAAA9ACBGAADPCgAgAgAAAM0KACBGAADOCgAgDukEAADMCgAw6gQAAM0KABDrBAAAzAoAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGXBQEAuggAIZgFAQC6CAAhmQUBALsIACGaBQEAuwgAIZsFAQC7CAAhnAVAAL4IACEO6QQAAMwKADDqBAAAzQoAEOsEAADMCgAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZcFAQC6CAAhmAUBALoIACGZBQEAuwgAIZoFAQC7CAAhmwUBALsIACGcBUAAvggAIQrsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhmAUBAP8JACGZBQEAgAoAIZoFAQCACgAhmwUBAIAKACGcBUAAgQoAIQ0HAADRCgAgCQAA0goAIBsAANAKACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhmAUBAP8JACGZBQEAgAoAIZoFAQCACgAhmwUBAIAKACGcBUAAgQoAIQVNAADmFgAgTgAA7xYAIKEGAADnFgAgogYAAO4WACCnBgAAiQEAIAVNAADkFgAgTgAA7BYAIKEGAADlFgAgogYAAOsWACCnBgAAqgQAIAdNAADiFgAgTgAA6RYAIKEGAADjFgAgogYAAOgWACClBgAAGAAgpgYAABgAIKcGAAAaACANBwAA1QoAIAkAANYKACAbAADUCgAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABmQUBAAAAAZoFAQAAAAGbBQEAAAABnAVAAAAAAQNNAADmFgAgoQYAAOcWACCnBgAAiQEAIANNAADkFgAgoQYAAOUWACCnBgAAqgQAIANNAADiFgAgoQYAAOMWACCnBgAAGgAgDgcAANkKACAJAADaCgAgFgAA2AoAICAAANsKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGdBQEAAAABngUBAAAAAaAFAAAAoAUCoQVAAAAAAQNNAADgFgAgoQYAAOEWACCnBgAATAAgA00AAN4WACChBgAA3xYAIKcGAACqBAAgA00AANwWACChBgAA3RYAIKcGAAAaACAETQAAxQoAMKEGAADGCgAwowYAAMgKACCnBgAAyQoAMAsHAADuCgAgCQAA7woAIBQAAO0KACAWAADsCgAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlQUBAAAAAQIAAABCACBNAADrCgAgAwAAAEIAIE0AAOsKACBOAADmCgAgAUYAANsWADARBwAAvQkAIAkAAMIJACASAADBCQAgFAAA4gkAIBYAAN8JACDpBAAA4QkAMOoEAABAABDrBAAA4QkAMOwEAQAAAAHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlQUBALoIACGWBQEAuggAIZwGAADgCQAgAgAAAEIAIEYAAOYKACACAAAA5AoAIEYAAOUKACAL6QQAAOMKADDqBAAA5AoAEOsEAADjCgAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlQUBALoIACGWBQEAuggAIQvpBAAA4woAMOoEAADkCgAQ6wQAAOMKADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhlAUBALoIACGVBQEAuggAIZYFAQC6CAAhB-wEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhCwcAAOkKACAJAADqCgAgFAAA6AoAIBYAAOcKACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIQVNAADNFgAgTgAA2RYAIKEGAADOFgAgogYAANgWACCnBgAATAAgBU0AAMsWACBOAADWFgAgoQYAAMwWACCiBgAA1RYAIKcGAAAjACAFTQAAyRYAIE4AANMWACChBgAAyhYAIKIGAADSFgAgpwYAAKoEACAHTQAAxxYAIE4AANAWACChBgAAyBYAIKIGAADPFgAgpQYAABgAIKYGAAAYACCnBgAAGgAgCwcAAO4KACAJAADvCgAgFAAA7QoAIBYAAOwKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGVBQEAAAABA00AAM0WACChBgAAzhYAIKcGAABMACADTQAAyxYAIKEGAADMFgAgpwYAACMAIANNAADJFgAgoQYAAMoWACCnBgAAqgQAIANNAADHFgAgoQYAAMgWACCnBgAAGgAgFQcAALMLACAJAACwCwAgCgAAsQsAIAsAAKoLACARAACrCwAgEwAArAsAIBQAAK0LACAWAACvCwAgGgAAsgsAIBsAAK4LACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGVBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQIAAAAoACBNAACpCwAgAwAAACgAIE0AAKkLACBOAAD6CgAgAUYAAMYWADAaBwAAvQkAIAkAAMIJACAKAADvCQAgCwAA5wgAIBEAAO0JACASAADBCQAgEwAA7gkAIBQAAOIJACAWAADfCQAgGgAA1QkAIBsAANYJACDpBAAA7AkAMOoEAAAmABDrBAAA7AkAMOwEAQAAAAHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlQUBALoIACGWBQEAuggAIZgFAQC6CAAhxAUBALoIACHUBQEAuwgAIfQFQAC-CAAhAgAAACgAIEYAAPoKACACAAAA-AoAIEYAAPkKACAP6QQAAPcKADDqBAAA-AoAEOsEAAD3CgAw7AQBALoIACHxBAEAuggAIfIEAQC7CAAh9ARAAL4IACH1BEAAvggAIZQFAQC6CAAhlQUBALoIACGWBQEAuggAIZgFAQC6CAAhxAUBALoIACHUBQEAuwgAIfQFQAC-CAAhD-kEAAD3CgAw6gQAAPgKABDrBAAA9woAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGUBQEAuggAIZUFAQC6CAAhlgUBALoIACGYBQEAuggAIcQFAQC6CAAh1AUBALsIACH0BUAAvggAIQvsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIZgFAQD_CQAhxAUBAP8JACHUBQEAgAoAIfQFQACBCgAhFQcAAIQLACAJAACBCwAgCgAAggsAIAsAAPsKACARAAD8CgAgEwAA_QoAIBQAAP4KACAWAACACwAgGgAAgwsAIBsAAP8KACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIZgFAQD_CQAhxAUBAP8JACHUBQEAgAoAIfQFQACBCgAhC00AAJkLADBOAACeCwAwoQYAAJoLADCiBgAAmwsAMKMGAACcCwAgpAYAAJ0LADClBgAAnQsAMKYGAACdCwAwpwYAAJ0LADCoBgAAnwsAMKkGAACgCwAwC00AAIwLADBOAACRCwAwoQYAAI0LADCiBgAAjgsAMKMGAACPCwAgpAYAAJALADClBgAAkAsAMKYGAACQCwAwpwYAAJALADCoBgAAkgsAMKkGAACTCwAwB00AAIULACBOAACICwAgoQYAAIYLACCiBgAAhwsAIKUGAAA2ACCmBgAANgAgpwYAAJkBACAFTQAAnhYAIE4AAMQWACChBgAAnxYAIKIGAADDFgAgpwYAACMAIAVNAACcFgAgTgAAwRYAIKEGAACdFgAgogYAAMAWACCnBgAAiQEAIAVNAACaFgAgTgAAvhYAIKEGAACbFgAgogYAAL0WACCnBgAATAAgB00AAJgWACBOAAC7FgAgoQYAAJkWACCiBgAAuhYAIKUGAAAYACCmBgAAGAAgpwYAABoAIAdNAACWFgAgTgAAuBYAIKEGAACXFgAgogYAALcWACClBgAAHQAgpgYAAB0AIKcGAAAfACAFTQAAlBYAIE4AALUWACChBgAAlRYAIKIGAAC0FgAgpwYAAJkGACAFTQAAkhYAIE4AALIWACChBgAAkxYAIKIGAACxFgAgpwYAAKoEACAWBwAAmwoAIAkAAJwKACASAACLCwAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGWBQEAAAABqwUIAAAAAawFCAAAAAGtBQgAAAABrgUIAAAAAa8FCAAAAAGwBQgAAAABsQUIAAAAAbIFCAAAAAGzBQgAAAABtAUIAAAAAbUFCAAAAAG2BQgAAAABtwUIAAAAAQIAAACZAQAgTQAAhQsAIAMAAAA2ACBNAACFCwAgTgAAiQsAIBgAAAA2ACAHAACXCgAgCQAAmAoAIBIAAIoLACBGAACJCwAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZYFAQD_CQAhqwUIAJQKACGsBQgAlAoAIa0FCACUCgAhrgUIAJQKACGvBQgAlAoAIbAFCACUCgAhsQUIAJQKACGyBQgAlAoAIbMFCACUCgAhtAUIAJQKACG1BQgAlAoAIbYFCACUCgAhtwUIAJQKACEWBwAAlwoAIAkAAJgKACASAACKCwAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZYFAQD_CQAhqwUIAJQKACGsBQgAlAoAIa0FCACUCgAhrgUIAJQKACGvBQgAlAoAIbAFCACUCgAhsQUIAJQKACGyBQgAlAoAIbMFCACUCgAhtAUIAJQKACG1BQgAlAoAIbYFCACUCgAhtwUIAJQKACEFTQAArBYAIE4AAK8WACChBgAArRYAIKIGAACuFgAgpwYAABAAIANNAACsFgAgoQYAAK0WACCnBgAAEAAgBewEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAAmAYClgZAAAAAAQIAAAA0ACBNAACYCwAgAwAAADQAIE0AAJgLACBOAACXCwAgAUYAAKsWADALDgAAwAkAIOkEAADnCQAw6gQAADIAEOsEAADnCQAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGkBQAA6AmYBiKqBQEAuggAIZYGQAC-CAAhngYAAOYJACACAAAANAAgRgAAlwsAIAIAAACUCwAgRgAAlQsAIAnpBAAAkwsAMOoEAACUCwAQ6wQAAJMLADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGkBQAA6AmYBiKqBQEAuggAIZYGQAC-CAAhCekEAACTCwAw6gQAAJQLABDrBAAAkwsAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIaQFAADoCZgGIqoFAQC6CAAhlgZAAL4IACEF7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhpAUAAJYLmAYilgZAAIEKACEBpAYAAACYBgIF7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhpAUAAJYLmAYilgZAAIEKACEF7AQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAACYBgKWBkAAAAABCg0AAKcLACAQAACoCwAg7AQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHJBQEAAAABygUBAAAAAcsFAQAAAAECAAAALAAgTQAApgsAIAMAAAAsACBNAACmCwAgTgAAowsAIAFGAACqFgAwDw0AAOoJACAOAADACQAgEAAA6wkAIOkEAADpCQAw6gQAACoAEOsEAADpCQAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGqBQEAuggAIbwFAQC6CAAhwgUBALsIACHJBQEAuwgAIcoFAQC6CAAhywUBALoIACECAAAALAAgRgAAowsAIAIAAAChCwAgRgAAogsAIAzpBAAAoAsAMOoEAAChCwAQ6wQAAKALADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGqBQEAuggAIbwFAQC6CAAhwgUBALsIACHJBQEAuwgAIcoFAQC6CAAhywUBALoIACEM6QQAAKALADDqBAAAoQsAEOsEAACgCwAw7AQBALoIACH0BEAAvggAIfUEQAC-CAAhqgUBALoIACG8BQEAuggAIcIFAQC7CAAhyQUBALsIACHKBQEAuggAIcsFAQC6CAAhCOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACHJBQEAgAoAIcoFAQD_CQAhywUBAP8JACEKDQAApAsAIBAAAKULACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhyQUBAIAKACHKBQEA_wkAIcsFAQD_CQAhBU0AAKIWACBOAACoFgAgoQYAAKMWACCiBgAApxYAIKcGAADmBQAgBU0AAKAWACBOAAClFgAgoQYAAKEWACCiBgAApBYAIKcGAACwAQAgCg0AAKcLACAQAACoCwAg7AQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHJBQEAAAABygUBAAAAAcsFAQAAAAEDTQAAohYAIKEGAACjFgAgpwYAAOYFACADTQAAoBYAIKEGAAChFgAgpwYAALABACAVBwAAswsAIAkAALALACAKAACxCwAgCwAAqgsAIBEAAKsLACATAACsCwAgFAAArQsAIBYAAK8LACAaAACyCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGYBQEAAAABxAUBAAAAAdQFAQAAAAH0BUAAAAABBE0AAJkLADChBgAAmgsAMKMGAACcCwAgpwYAAJ0LADAETQAAjAsAMKEGAACNCwAwowYAAI8LACCnBgAAkAsAMANNAACFCwAgoQYAAIYLACCnBgAAmQEAIANNAACeFgAgoQYAAJ8WACCnBgAAIwAgA00AAJwWACChBgAAnRYAIKcGAACJAQAgA00AAJoWACChBgAAmxYAIKcGAABMACADTQAAmBYAIKEGAACZFgAgpwYAABoAIANNAACWFgAgoQYAAJcWACCnBgAAHwAgA00AAJQWACChBgAAlRYAIKcGAACZBgAgA00AAJIWACChBgAAkxYAIKcGAACqBAAgA00AAJAWACChBgAAkRYAIKcGAACqBAAgBE0AAPAKADChBgAA8QoAMKMGAADzCgAgpwYAAPQKADAETQAA3AoAMKEGAADdCgAwowYAAN8KACCnBgAA4AoAMARNAAC1CgAwoQYAALYKADCjBgAAuAoAIKcGAAC5CgAwBE0AAJ0KADChBgAAngoAMKMGAACgCgAgpwYAAKEKADAETQAAigoAMKEGAACLCgAwowYAAI0KACCnBgAAjgoAMANNAACOFgAgoQYAAI8WACCnBgAAGgAgA00AAIwWACChBgAAjRYAIKcGAACnAgAgAAAAAqQGAQAAAASqBgEAAAAFAqQGAQAAAASqBgEAAAAFAaQGIAAAAAEFTQAAhxYAIE4AAIoWACChBgAAiBYAIKIGAACJFgAgpwYAAKcCACABpAYBAAAABAGkBgEAAAAEA00AAIcWACChBgAAiBYAIKcGAACnAgAgFQQAAMMTACAFAADEEwAgBgAA7REAIBIAAO4RACAbAADvEQAgLgAApw4AIDcAAPERACA6AADxEQAgOwAApw4AIDwAAMUTACA9AACWDgAgPgAAlg4AID8AAMYTACBAAADHEwAg8AQAAPsJACCOBgAA-wkAII8GAAD7CQAgkAYAAPsJACCRBgAA-wkAIJIGAAD7CQAgkwYAAPsJACAAAAAFTQAAghYAIE4AAIUWACChBgAAgxYAIKIGAACEFgAgpwYAABAAIANNAACCFgAgoQYAAIMWACCnBgAAEAAgAAAABU0AAP0VACBOAACAFgAgoQYAAP4VACCiBgAA_xUAIKcGAABHACADTQAA_RUAIKEGAAD-FQAgpwYAAEcAIAAAAAVNAAD4FQAgTgAA-xUAIKEGAAD5FQAgogYAAPoVACCnBgAAEAAgA00AAPgVACChBgAA-RUAIKcGAAAQACAAAAAHTQAA8xUAIE4AAPYVACChBgAA9BUAIKIGAAD1FQAgpQYAAA4AIKYGAAAOACCnBgAAEAAgA00AAPMVACChBgAA9BUAIKcGAAAQACAAAAAAAAAAAAVNAAC8FQAgTgAA8RUAIKEGAAC9FQAgogYAAPAVACCnBgAAqgQAIAdNAAC6FQAgTgAA7hUAIKEGAAC7FQAgogYAAO0VACClBgAAGAAgpgYAABgAIKcGAAAaACAFTQAAuBUAIE4AAOsVACChBgAAuRUAIKIGAADqFQAgpwYAAKcCACALTQAAngwAME4AAKIMADChBgAAnwwAMKIGAACgDAAwowYAAKEMACCkBgAA9AoAMKUGAAD0CgAwpgYAAPQKADCnBgAA9AoAMKgGAACjDAAwqQYAAPcKADALTQAAlQwAME4AAJkMADChBgAAlgwAMKIGAACXDAAwowYAAJgMACCkBgAAyQoAMKUGAADJCgAwpgYAAMkKADCnBgAAyQoAMKgGAACaDAAwqQYAAMwKADALTQAAggwAME4AAIcMADChBgAAgwwAMKIGAACEDAAwowYAAIUMACCkBgAAhgwAMKUGAACGDAAwpgYAAIYMADCnBgAAhgwAMKgGAACIDAAwqQYAAIkMADALTQAA6gsAME4AAO8LADChBgAA6wsAMKIGAADsCwAwowYAAO0LACCkBgAA7gsAMKUGAADuCwAwpgYAAO4LADCnBgAA7gsAMKgGAADwCwAwqQYAAPELADAaBwAA_gsAIAkAAP8LACAaAACADAAgHAAAgQwAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAADaBQLEBQEAAAAB1gUBAAAAAdgFAAAA2AUC2gUCAAAAAdsFEAAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFgAAAAAHlBUAAAAAB5gVAAAAAAQIAAABVACBNAAD9CwAgAwAAAFUAIE0AAP0LACBOAAD4CwAgAUYAAOkVADAfBwAAvQkAIAkAANQJACAaAADVCQAgGwAA1gkAIBwAANcJACDpBAAAzwkAMOoEAABTABDrBAAAzwkAMOwEAQAAAAHxBAEAuggAIfIEAQC6CAAh9ARAAL4IACH1BEAAvggAIZgFAQC6CAAhpAUAANEJ2gUixAUBALoIACHWBQEAuggAIdgFAADQCdgFItoFAgC7CQAh2wUQANIJACHcBQEAuggAId0FAQC6CAAh3gUBAAAAAd8FAQAAAAHgBQEAuwgAIeEFAQC7CAAh4gUBALsIACHjBQEAuwgAIeQFAADTCQAg5QVAAL4IACHmBUAAtwkAIQIAAABVACBGAAD4CwAgAgAAAPILACBGAADzCwAgGukEAADxCwAw6gQAAPILABDrBAAA8QsAMOwEAQC6CAAh8QQBALoIACHyBAEAuggAIfQEQAC-CAAh9QRAAL4IACGYBQEAuggAIaQFAADRCdoFIsQFAQC6CAAh1gUBALoIACHYBQAA0AnYBSLaBQIAuwkAIdsFEADSCQAh3AUBALoIACHdBQEAuggAId4FAQC6CAAh3wUBALsIACHgBQEAuwgAIeEFAQC7CAAh4gUBALsIACHjBQEAuwgAIeQFAADTCQAg5QVAAL4IACHmBUAAtwkAIRrpBAAA8QsAMOoEAADyCwAQ6wQAAPELADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhmAUBALoIACGkBQAA0QnaBSLEBQEAuggAIdYFAQC6CAAh2AUAANAJ2AUi2gUCALsJACHbBRAA0gkAIdwFAQC6CAAh3QUBALoIACHeBQEAuggAId8FAQC7CAAh4AUBALsIACHhBQEAuwgAIeIFAQC7CAAh4wUBALsIACHkBQAA0wkAIOUFQAC-CAAh5gVAALcJACEW7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaQFAAD1C9oFIsQFAQD_CQAh1gUBAP8JACHYBQAA9AvYBSLaBQIA9gsAIdsFEAD3CwAh3AUBAP8JACHdBQEA_wkAId4FAQD_CQAh3wUBAIAKACHgBQEAgAoAIeEFAQCACgAh4gUBAIAKACHjBQEAgAoAIeQFgAAAAAHlBUAAgQoAIeYFQACoCgAhAaQGAAAA2AUCAaQGAAAA2gUCBaQGAgAAAAGrBgIAAAABrAYCAAAAAa0GAgAAAAGuBgIAAAABBaQGEAAAAAGrBhAAAAABrAYQAAAAAa0GEAAAAAGuBhAAAAABGgcAAPkLACAJAAD6CwAgGgAA-wsAIBwAAPwLACDsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhpAUAAPUL2gUixAUBAP8JACHWBQEA_wkAIdgFAAD0C9gFItoFAgD2CwAh2wUQAPcLACHcBQEA_wkAId0FAQD_CQAh3gUBAP8JACHfBQEAgAoAIeAFAQCACgAh4QUBAIAKACHiBQEAgAoAIeMFAQCACgAh5AWAAAAAAeUFQACBCgAh5gVAAKgKACEFTQAA2xUAIE4AAOcVACChBgAA3BUAIKIGAADmFQAgpwYAAKoEACAFTQAA2RUAIE4AAOQVACChBgAA2hUAIKIGAADjFQAgpwYAABoAIAVNAADXFQAgTgAA4RUAIKEGAADYFQAgogYAAOAVACCnBgAAmQYAIAVNAADVFQAgTgAA3hUAIKEGAADWFQAgogYAAN0VACCnBgAAUQAgGgcAAP4LACAJAAD_CwAgGgAAgAwAIBwAAIEMACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA2gUCxAUBAAAAAdYFAQAAAAHYBQAAANgFAtoFAgAAAAHbBRAAAAAB3AUBAAAAAd0FAQAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBYAAAAAB5QVAAAAAAeYFQAAAAAEDTQAA2xUAIKEGAADcFQAgpwYAAKoEACADTQAA2RUAIKEGAADaFQAgpwYAABoAIANNAADXFQAgoQYAANgVACCnBgAAmQYAIANNAADVFQAgoQYAANYVACCnBgAAUQAgDiQAAJIMACAlAACTDAAgJgAAlAwAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaIFAQAAAAGkBQAAALoFAqUFAQAAAAGmBUAAAAABpwVAAAAAAagFAQAAAAGpBQEAAAABugUBAAAAAQIAAABrACBNAACRDAAgAwAAAGsAIE0AAJEMACBOAACNDAAgAUYAANQVADAUGwAAzgkAICQAAM0JACAlAAC_CAAgJgAAuAkAIOkEAADLCQAw6gQAAGkAEOsEAADLCQAw7AQBAAAAAfQEQAC-CAAh9QRAAL4IACGYBQEAuwgAIaIFAQC7CAAhpAUAAMwJugUipQUBALsIACGmBUAAtwkAIacFQAC-CAAhqAUBALoIACGpBQEAuwgAIboFAQC6CAAhmgYAAMoJACACAAAAawAgRgAAjQwAIAIAAACKDAAgRgAAiwwAIA_pBAAAiQwAMOoEAACKDAAQ6wQAAIkMADDsBAEAuggAIfQEQAC-CAAh9QRAAL4IACGYBQEAuwgAIaIFAQC7CAAhpAUAAMwJugUipQUBALsIACGmBUAAtwkAIacFQAC-CAAhqAUBALoIACGpBQEAuwgAIboFAQC6CAAhD-kEAACJDAAw6gQAAIoMABDrBAAAiQwAMOwEAQC6CAAh9ARAAL4IACH1BEAAvggAIZgFAQC7CAAhogUBALsIACGkBQAAzAm6BSKlBQEAuwgAIaYFQAC3CQAhpwVAAL4IACGoBQEAuggAIakFAQC7CAAhugUBALoIACEL7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhogUBAIAKACGkBQAAjAy6BSKlBQEAgAoAIaYFQACoCgAhpwVAAIEKACGoBQEA_wkAIakFAQCACgAhugUBAP8JACEBpAYAAAC6BQIOJAAAjgwAICUAAI8MACAmAACQDAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhogUBAIAKACGkBQAAjAy6BSKlBQEAgAoAIaYFQACoCgAhpwVAAIEKACGoBQEA_wkAIakFAQCACgAhugUBAP8JACEFTQAAyRUAIE4AANIVACChBgAAyhUAIKIGAADRFQAgpwYAAKEFACAFTQAAxxUAIE4AAM8VACChBgAAyBUAIKIGAADOFQAgpwYAAKcCACAHTQAAxRUAIE4AAMwVACChBgAAxhUAIKIGAADLFQAgpQYAAG8AIKYGAABvACCnBgAApwIAIA4kAACSDAAgJQAAkwwAICYAAJQMACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGiBQEAAAABpAUAAAC6BQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABqQUBAAAAAboFAQAAAAEDTQAAyRUAIKEGAADKFQAgpwYAAKEFACADTQAAxxUAIKEGAADIFQAgpwYAAKcCACADTQAAxRUAIKEGAADGFQAgpwYAAKcCACANBwAA1QoAIAkAANYKACAhAADQCwAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGXBQEAAAABmQUBAAAAAZoFAQAAAAGbBQEAAAABnAVAAAAAAQIAAAA9ACBNAACdDAAgAwAAAD0AIE0AAJ0MACBOAACcDAAgAUYAAMQVADACAAAAPQAgRgAAnAwAIAIAAADNCgAgRgAAmwwAIArsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlwUBAP8JACGZBQEAgAoAIZoFAQCACgAhmwUBAIAKACGcBUAAgQoAIQ0HAADRCgAgCQAA0goAICEAAM8LACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlwUBAP8JACGZBQEAgAoAIZoFAQCACgAhmwUBAIAKACGcBUAAgQoAIQ0HAADVCgAgCQAA1goAICEAANALACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZcFAQAAAAGZBQEAAAABmgUBAAAAAZsFAQAAAAGcBUAAAAABFQcAALMLACAJAACwCwAgCgAAsQsAIAsAAKoLACARAACrCwAgEgAAqAwAIBMAAKwLACAUAACtCwAgFgAArwsAIBoAALILACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGVBQEAAAABlgUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQIAAAAoACBNAACnDAAgAwAAACgAIE0AAKcMACBOAAClDAAgAUYAAMMVADACAAAAKAAgRgAApQwAIAIAAAD4CgAgRgAApAwAIAvsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIZYFAQD_CQAhxAUBAP8JACHUBQEAgAoAIfQFQACBCgAhFQcAAIQLACAJAACBCwAgCgAAggsAIAsAAPsKACARAAD8CgAgEgAApgwAIBMAAP0KACAUAAD-CgAgFgAAgAsAIBoAAIMLACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIZYFAQD_CQAhxAUBAP8JACHUBQEAgAoAIfQFQACBCgAhBU0AAL4VACBOAADBFQAgoQYAAL8VACCiBgAAwBUAIKcGAAAQACAVBwAAswsAIAkAALALACAKAACxCwAgCwAAqgsAIBEAAKsLACASAACoDAAgEwAArAsAIBQAAK0LACAWAACvCwAgGgAAsgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABxAUBAAAAAdQFAQAAAAH0BUAAAAABA00AAL4VACChBgAAvxUAIKcGAAAQACADTQAAvBUAIKEGAAC9FQAgpwYAAKoEACADTQAAuhUAIKEGAAC7FQAgpwYAABoAIANNAAC4FQAgoQYAALkVACCnBgAApwIAIARNAACeDAAwoQYAAJ8MADCjBgAAoQwAIKcGAAD0CgAwBE0AAJUMADChBgAAlgwAMKMGAACYDAAgpwYAAMkKADAETQAAggwAMKEGAACDDAAwowYAAIUMACCnBgAAhgwAMARNAADqCwAwoQYAAOsLADCjBgAA7QsAIKcGAADuCwAwAAAAB00AALMVACBOAAC2FQAgoQYAALQVACCiBgAAtRUAIKUGAABxACCmBgAAcQAgpwYAAIkBACADTQAAsxUAIKEGAAC0FQAgpwYAAIkBACAAAAACpAYBAAAABKoGAQAAAAUFTQAArhUAIE4AALEVACChBgAArxUAIKIGAACwFQAgpwYAAKcCACABpAYBAAAABANNAACuFQAgoQYAAK8VACCnBgAApwIAIAAAAAtNAADyDAAwTgAA9wwAMKEGAADzDAAwogYAAPQMADCjBgAA9QwAIKQGAAD2DAAwpQYAAPYMADCmBgAA9gwAMKcGAAD2DAAwqAYAAPgMADCpBgAA-QwAMAtNAADpDAAwTgAA7QwAMKEGAADqDAAwogYAAOsMADCjBgAA7AwAIKQGAAD0CgAwpQYAAPQKADCmBgAA9AoAMKcGAAD0CgAwqAYAAO4MADCpBgAA9woAMAtNAADODAAwTgAA0wwAMKEGAADPDAAwogYAANAMADCjBgAA0QwAIKQGAADSDAAwpQYAANIMADCmBgAA0gwAMKcGAADSDAAwqAYAANQMADCpBgAA1QwAMAtNAADDDAAwTgAAxwwAMKEGAADEDAAwogYAAMUMADCjBgAAxgwAIKQGAADuCwAwpQYAAO4LADCmBgAA7gsAMKcGAADuCwAwqAYAAMgMADCpBgAA8QsAMBoHAAD-CwAgCQAA_wsAIBsAAM0MACAcAACBDAAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABpAUAAADaBQLWBQEAAAAB2AUAAADYBQLaBQIAAAAB2wUQAAAAAdwFAQAAAAHdBQEAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AWAAAAAAeUFQAAAAAHmBUAAAAABAgAAAFUAIE0AAMwMACADAAAAVQAgTQAAzAwAIE4AAMoMACABRgAArRUAMAIAAABVACBGAADKDAAgAgAAAPILACBGAADJDAAgFuwEAQD_CQAh8QQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACGYBQEA_wkAIaQFAAD1C9oFItYFAQD_CQAh2AUAAPQL2AUi2gUCAPYLACHbBRAA9wsAIdwFAQD_CQAh3QUBAP8JACHeBQEA_wkAId8FAQCACgAh4AUBAIAKACHhBQEAgAoAIeIFAQCACgAh4wUBAIAKACHkBYAAAAAB5QVAAIEKACHmBUAAqAoAIRoHAAD5CwAgCQAA-gsAIBsAAMsMACAcAAD8CwAg7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZgFAQD_CQAhpAUAAPUL2gUi1gUBAP8JACHYBQAA9AvYBSLaBQIA9gsAIdsFEAD3CwAh3AUBAP8JACHdBQEA_wkAId4FAQD_CQAh3wUBAIAKACHgBQEAgAoAIeEFAQCACgAh4gUBAIAKACHjBQEAgAoAIeQFgAAAAAHlBUAAgQoAIeYFQACoCgAhBU0AAKgVACBOAACrFQAgoQYAAKkVACCiBgAAqhUAIKcGAACJAQAgGgcAAP4LACAJAAD_CwAgGwAAzQwAIBwAAIEMACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGkBQAAANoFAtYFAQAAAAHYBQAAANgFAtoFAgAAAAHbBRAAAAAB3AUBAAAAAd0FAQAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBYAAAAAB5QVAAAAAAeYFQAAAAAEDTQAAqBUAIKEGAACpFQAgpwYAAIkBACAMBwAA5gwAIAkAAOcMACAdAADoDAAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAHcBQEAAAAB5wUQAAAAAegFEAAAAAHpBSAAAAABAgAAAFEAIE0AAOUMACADAAAAUQAgTQAA5QwAIE4AANgMACABRgAApxUAMBIHAAC9CQAgCQAA1AkAIBoAANUJACAdAADdCAAg6QQAANkJADDqBAAATwAQ6wQAANkJADDsBAEAAAAB8QQBALoIACHyBAEAuggAIfQEQAC-CAAh9QRAAL4IACHEBQEAuggAIdwFAQC6CAAh5wUQANIJACHoBRAA0gkAIekFIAC9CAAhmwYAANgJACACAAAAUQAgRgAA2AwAIAIAAADWDAAgRgAA1wwAIA3pBAAA1QwAMOoEAADWDAAQ6wQAANUMADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhxAUBALoIACHcBQEAuggAIecFEADSCQAh6AUQANIJACHpBSAAvQgAIQ3pBAAA1QwAMOoEAADWDAAQ6wQAANUMADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhxAUBALoIACHcBQEAuggAIecFEADSCQAh6AUQANIJACHpBSAAvQgAIQnsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAh3AUBAP8JACHnBRAA9wsAIegFEAD3CwAh6QUgAMELACEMBwAA2QwAIAkAANoMACAdAADbDAAg7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIdwFAQD_CQAh5wUQAPcLACHoBRAA9wsAIekFIADBCwAhBU0AAJ4VACBOAAClFQAgoQYAAJ8VACCiBgAApBUAIKcGAACqBAAgBU0AAJwVACBOAACiFQAgoQYAAJ0VACCiBgAAoRUAIKcGAAAaACALTQAA3AwAME4AAOAMADChBgAA3QwAMKIGAADeDAAwowYAAN8MACCkBgAA7gsAMKUGAADuCwAwpgYAAO4LADCnBgAA7gsAMKgGAADhDAAwqQYAAPELADAaBwAA_gsAIAkAAP8LACAaAACADAAgGwAAzQwAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABmAUBAAAAAaQFAAAA2gUCxAUBAAAAAdgFAAAA2AUC2gUCAAAAAdsFEAAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFgAAAAAHlBUAAAAAB5gVAAAAAAQIAAABVACBNAADkDAAgAwAAAFUAIE0AAOQMACBOAADjDAAgAUYAAKAVADACAAAAVQAgRgAA4wwAIAIAAADyCwAgRgAA4gwAIBbsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhmAUBAP8JACGkBQAA9QvaBSLEBQEA_wkAIdgFAAD0C9gFItoFAgD2CwAh2wUQAPcLACHcBQEA_wkAId0FAQD_CQAh3gUBAP8JACHfBQEAgAoAIeAFAQCACgAh4QUBAIAKACHiBQEAgAoAIeMFAQCACgAh5AWAAAAAAeUFQACBCgAh5gVAAKgKACEaBwAA-QsAIAkAAPoLACAaAAD7CwAgGwAAywwAIOwEAQD_CQAh8QQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACGYBQEA_wkAIaQFAAD1C9oFIsQFAQD_CQAh2AUAAPQL2AUi2gUCAPYLACHbBRAA9wsAIdwFAQD_CQAh3QUBAP8JACHeBQEA_wkAId8FAQCACgAh4AUBAIAKACHhBQEAgAoAIeIFAQCACgAh4wUBAIAKACHkBYAAAAAB5QVAAIEKACHmBUAAqAoAIRoHAAD-CwAgCQAA_wsAIBoAAIAMACAbAADNDAAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABpAUAAADaBQLEBQEAAAAB2AUAAADYBQLaBQIAAAAB2wUQAAAAAdwFAQAAAAHdBQEAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AWAAAAAAeUFQAAAAAHmBUAAAAABDAcAAOYMACAJAADnDAAgHQAA6AwAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAAB3AUBAAAAAecFEAAAAAHoBRAAAAAB6QUgAAAAAQNNAACeFQAgoQYAAJ8VACCnBgAAqgQAIANNAACcFQAgoQYAAJ0VACCnBgAAGgAgBE0AANwMADChBgAA3QwAMKMGAADfDAAgpwYAAO4LADAVBwAAswsAIAkAALALACAKAACxCwAgCwAAqgsAIBEAAKsLACASAACoDAAgEwAArAsAIBQAAK0LACAWAACvCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAdQFAQAAAAH0BUAAAAABAgAAACgAIE0AAPEMACADAAAAKAAgTQAA8QwAIE4AAPAMACABRgAAmxUAMAIAAAAoACBGAADwDAAgAgAAAPgKACBGAADvDAAgC-wEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIdQFAQCACgAh9AVAAIEKACEVBwAAhAsAIAkAAIELACAKAACCCwAgCwAA-woAIBEAAPwKACASAACmDAAgEwAA_QoAIBQAAP4KACAWAACACwAgGwAA_woAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIdQFAQCACgAh9AVAAIEKACEVBwAAswsAIAkAALALACAKAACxCwAgCwAAqgsAIBEAAKsLACASAACoDAAgEwAArAsAIBQAAK0LACAWAACvCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAdQFAQAAAAH0BUAAAAABDwcAAKMNACAJAACkDQAgFQAAoA0AIBcAAKENACAYAACiDQAgHwAApQ0AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHDBQIAAAABxQUBAAAAAQIAAABMACBNAACfDQAgAwAAAEwAIE0AAJ8NACBOAAD9DAAgAUYAAJoVADAUBwAAvQkAIAkAAMIJACAVAADbCAAgFwAAkgkAIBgAAJQJACAaAADVCQAgHwAA3AkAIOkEAADaCQAw6gQAAEoAEOsEAADaCQAw7AQBAAAAAfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIcMFAgDbCQAhxAUBALoIACHFBQEAuwgAIQIAAABMACBGAAD9DAAgAgAAAPoMACBGAAD7DAAgDekEAAD5DAAw6gQAAPoMABDrBAAA-QwAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACG8BQEAuggAIcIFAQC7CAAhwwUCANsJACHEBQEAuggAIcUFAQC7CAAhDekEAAD5DAAw6gQAAPoMABDrBAAA-QwAMOwEAQC6CAAh8QQBALoIACHyBAEAuwgAIfQEQAC-CAAh9QRAAL4IACG8BQEAuggAIcIFAQC7CAAhwwUCANsJACHEBQEAuggAIcUFAQC7CAAhCewEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhwwUCAPwMACHFBQEAgAoAIQWkBgIAAAABqwYCAAAAAawGAgAAAAGtBgIAAAABrgYCAAAAAQ8HAACBDQAgCQAAgg0AIBUAAP4MACAXAAD_DAAgGAAAgA0AIB8AAIMNACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACHCBQEAgAoAIcMFAgD8DAAhxQUBAIAKACELTQAAlg0AME4AAJoNADChBgAAlw0AMKIGAACYDQAwowYAAJkNACCkBgAA9AoAMKUGAAD0CgAwpgYAAPQKADCnBgAA9AoAMKgGAACbDQAwqQYAAPcKADALTQAAjQ0AME4AAJENADChBgAAjg0AMKIGAACPDQAwowYAAJANACCkBgAA4AoAMKUGAADgCgAwpgYAAOAKADCnBgAA4AoAMKgGAACSDQAwqQYAAOMKADALTQAAhA0AME4AAIgNADChBgAAhQ0AMKIGAACGDQAwowYAAIcNACCkBgAAuQoAMKUGAAC5CgAwpgYAALkKADCnBgAAuQoAMKgGAACJDQAwqQYAALwKADAFTQAAjBUAIE4AAJgVACChBgAAjRUAIKIGAACXFQAgpwYAAKoEACAHTQAAihUAIE4AAJUVACChBgAAixUAIKIGAACUFQAgpQYAABgAIKYGAAAYACCnBgAAGgAgB00AAIgVACBOAACSFQAgoQYAAIkVACCiBgAAkRUAIKUGAABdACCmBgAAXQAgpwYAAIMBACAOBwAA2QoAIAkAANoKACASAADVCwAgIAAA2woAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlgUBAAAAAZ0FAQAAAAGeBQEAAAABoAUAAACgBQKhBUAAAAABAgAAAEcAIE0AAIwNACADAAAARwAgTQAAjA0AIE4AAIsNACABRgAAkBUAMAIAAABHACBGAACLDQAgAgAAAL0KACBGAACKDQAgCuwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGWBQEA_wkAIZ0FAQD_CQAhngUBAIAKACGgBQAAvwqgBSKhBUAAqAoAIQ4HAADCCgAgCQAAwwoAIBIAANQLACAgAADECgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZYFAQD_CQAhnQUBAP8JACGeBQEAgAoAIaAFAAC_CqAFIqEFQACoCgAhDgcAANkKACAJAADaCgAgEgAA1QsAICAAANsKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZYFAQAAAAGdBQEAAAABngUBAAAAAaAFAAAAoAUCoQVAAAAAAQsHAADuCgAgCQAA7woAIBIAAMsLACAUAADtCgAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGVBQEAAAABlgUBAAAAAQIAAABCACBNAACVDQAgAwAAAEIAIE0AAJUNACBOAACUDQAgAUYAAI8VADACAAAAQgAgRgAAlA0AIAIAAADkCgAgRgAAkw0AIAfsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlQUBAP8JACGWBQEA_wkAIQsHAADpCgAgCQAA6goAIBIAAMoLACAUAADoCgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZUFAQD_CQAhlgUBAP8JACELBwAA7goAIAkAAO8KACASAADLCwAgFAAA7QoAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlQUBAAAAAZYFAQAAAAEVBwAAswsAIAkAALALACAKAACxCwAgCwAAqgsAIBEAAKsLACASAACoDAAgEwAArAsAIBQAAK0LACAaAACyCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlQUBAAAAAZYFAQAAAAGYBQEAAAABxAUBAAAAAdQFAQAAAAH0BUAAAAABAgAAACgAIE0AAJ4NACADAAAAKAAgTQAAng0AIE4AAJ0NACABRgAAjhUAMAIAAAAoACBGAACdDQAgAgAAAPgKACBGAACcDQAgC-wEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGVBQEA_wkAIZYFAQD_CQAhmAUBAP8JACHEBQEA_wkAIdQFAQCACgAh9AVAAIEKACEVBwAAhAsAIAkAAIELACAKAACCCwAgCwAA-woAIBEAAPwKACASAACmDAAgEwAA_QoAIBQAAP4KACAaAACDCwAgGwAA_woAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGVBQEA_wkAIZYFAQD_CQAhmAUBAP8JACHEBQEA_wkAIdQFAQCACgAh9AVAAIEKACEVBwAAswsAIAkAALALACAKAACxCwAgCwAAqgsAIBEAAKsLACASAACoDAAgEwAArAsAIBQAAK0LACAaAACyCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlQUBAAAAAZYFAQAAAAGYBQEAAAABxAUBAAAAAdQFAQAAAAH0BUAAAAABDwcAAKMNACAJAACkDQAgFQAAoA0AIBcAAKENACAYAACiDQAgHwAApQ0AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHDBQIAAAABxQUBAAAAAQRNAACWDQAwoQYAAJcNADCjBgAAmQ0AIKcGAAD0CgAwBE0AAI0NADChBgAAjg0AMKMGAACQDQAgpwYAAOAKADAETQAAhA0AMKEGAACFDQAwowYAAIcNACCnBgAAuQoAMANNAACMFQAgoQYAAI0VACCnBgAAqgQAIANNAACKFQAgoQYAAIsVACCnBgAAGgAgA00AAIgVACChBgAAiRUAIKcGAACDAQAgBE0AAPIMADChBgAA8wwAMKMGAAD1DAAgpwYAAPYMADAETQAA6QwAMKEGAADqDAAwowYAAOwMACCnBgAA9AoAMARNAADODAAwoQYAAM8MADCjBgAA0QwAIKcGAADSDAAwBE0AAMMMADChBgAAxAwAMKMGAADGDAAgpwYAAO4LADAAAAAAAAAAAAAFTQAAgxUAIE4AAIYVACChBgAAhBUAIKIGAACFFQAgpwYAAJkGACADTQAAgxUAIKEGAACEFQAgpwYAAJkGACAAAAABpAYAAADJBQILTQAAug0AME4AAL4NADChBgAAuw0AMKIGAAC8DQAwowYAAL0NACCkBgAAnQsAMKUGAACdCwAwpgYAAJ0LADCnBgAAnQsAMKgGAAC_DQAwqQYAAKALADAKDgAAxA0AIBAAAKgLACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGqBQEAAAABvAUBAAAAAcIFAQAAAAHJBQEAAAABywUBAAAAAQIAAAAsACBNAADDDQAgAwAAACwAIE0AAMMNACBOAADBDQAgAUYAAIIVADACAAAALAAgRgAAwQ0AIAIAAAChCwAgRgAAwA0AIAjsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGqBQEA_wkAIbwFAQD_CQAhwgUBAIAKACHJBQEAgAoAIcsFAQD_CQAhCg4AAMINACAQAAClCwAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhqgUBAP8JACG8BQEA_wkAIcIFAQCACgAhyQUBAIAKACHLBQEA_wkAIQVNAAD9FAAgTgAAgBUAIKEGAAD-FAAgogYAAP8UACCnBgAAKAAgCg4AAMQNACAQAACoCwAg7AQBAAAAAfQEQAAAAAH1BEAAAAABqgUBAAAAAbwFAQAAAAHCBQEAAAAByQUBAAAAAcsFAQAAAAEDTQAA_RQAIKEGAAD-FAAgpwYAACgAIARNAAC6DQAwoQYAALsNADCjBgAAvQ0AIKcGAACdCwAwAAAAAAAAAAAAC00AANwNADBOAADhDQAwoQYAAN0NADCiBgAA3g0AMKMGAADfDQAgpAYAAOANADClBgAA4A0AMKYGAADgDQAwpwYAAOANADCoBgAA4g0AMKkGAADjDQAwC00AANMNADBOAADXDQAwoQYAANQNADCiBgAA1Q0AMKMGAADWDQAgpAYAAPQKADClBgAA9AoAMKYGAAD0CgAwpwYAAPQKADCoBgAA2A0AMKkGAAD3CgAwBU0AAOcUACBOAAD7FAAgoQYAAOgUACCiBgAA-hQAIKcGAACqBAAgBU0AAOUUACBOAAD4FAAgoQYAAOYUACCiBgAA9xQAIKcGAAAaACAVBwAAswsAIAkAALALACALAACqCwAgEQAAqwsAIBIAAKgMACATAACsCwAgFAAArQsAIBYAAK8LACAaAACyCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAH0BUAAAAABAgAAACgAIE0AANsNACADAAAAKAAgTQAA2w0AIE4AANoNACABRgAA9hQAMAIAAAAoACBGAADaDQAgAgAAAPgKACBGAADZDQAgC-wEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh9AVAAIEKACEVBwAAhAsAIAkAAIELACALAAD7CgAgEQAA_AoAIBIAAKYMACATAAD9CgAgFAAA_goAIBYAAIALACAaAACDCwAgGwAA_woAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh9AVAAIEKACEVBwAAswsAIAkAALALACALAACqCwAgEQAAqwsAIBIAAKgMACATAACsCwAgFAAArQsAIBYAAK8LACAaAACyCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAH0BUAAAAABDQcAAP4NACAJAAD_DQAgFQAAgA4AIBcAAIEOACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHOBQIAAAAB9QUBAAAAAfYFAQAAAAECAAAAIwAgTQAA_Q0AIAMAAAAjACBNAAD9DQAgTgAA5g0AIAFGAAD1FAAwEgcAAL0JACAJAADUCQAgCgAA7wkAIBUAANsIACAXAACSCQAg6QQAAPAJADDqBAAAIQAQ6wQAAPAJADDsBAEAAAAB8QQBALoIACHyBAEAuggAIfQEQAC-CAAh9QRAAL4IACHCBQEAuwgAIc4FAgDbCQAh1AUBALsIACH1BQEAAAAB9gUBALoIACECAAAAIwAgRgAA5g0AIAIAAADkDQAgRgAA5Q0AIA3pBAAA4w0AMOoEAADkDQAQ6wQAAOMNADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHOBQIA2wkAIdQFAQC7CAAh9QUBALoIACH2BQEAuggAIQ3pBAAA4w0AMOoEAADkDQAQ6wQAAOMNADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHOBQIA2wkAIdQFAQC7CAAh9QUBALoIACH2BQEAuggAIQnsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHOBQIA_AwAIfUFAQD_CQAh9gUBAP8JACENBwAA5w0AIAkAAOgNACAVAADpDQAgFwAA6g0AIOwEAQD_CQAh8QQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIc4FAgD8DAAh9QUBAP8JACH2BQEA_wkAIQVNAADrFAAgTgAA8xQAIKEGAADsFAAgogYAAPIUACCnBgAAqgQAIAVNAADpFAAgTgAA8BQAIKEGAADqFAAgogYAAO8UACCnBgAAGgAgC00AAPQNADBOAAD4DQAwoQYAAPUNADCiBgAA9g0AMKMGAAD3DQAgpAYAAPQKADClBgAA9AoAMKYGAAD0CgAwpwYAAPQKADCoBgAA-Q0AMKkGAAD3CgAwC00AAOsNADBOAADvDQAwoQYAAOwNADCiBgAA7Q0AMKMGAADuDQAgpAYAAOAKADClBgAA4AoAMKYGAADgCgAwpwYAAOAKADCoBgAA8A0AMKkGAADjCgAwCwcAAO4KACAJAADvCgAgEgAAywsAIBYAAOwKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABAgAAAEIAIE0AAPMNACADAAAAQgAgTQAA8w0AIE4AAPINACABRgAA7hQAMAIAAABCACBGAADyDQAgAgAAAOQKACBGAADxDQAgB-wEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZYFAQD_CQAhCwcAAOkKACAJAADqCgAgEgAAygsAIBYAAOcKACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGWBQEA_wkAIQsHAADuCgAgCQAA7woAIBIAAMsLACAWAADsCgAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlgUBAAAAARUHAACzCwAgCQAAsAsAIAoAALELACALAACqCwAgEQAAqwsAIBIAAKgMACATAACsCwAgFgAArwsAIBoAALILACAbAACuCwAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlgUBAAAAAZgFAQAAAAHEBQEAAAAB1AUBAAAAAfQFQAAAAAECAAAAKAAgTQAA_A0AIAMAAAAoACBNAAD8DQAgTgAA-w0AIAFGAADtFAAwAgAAACgAIEYAAPsNACACAAAA-AoAIEYAAPoNACAL7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIRUHAACECwAgCQAAgQsAIAoAAIILACALAAD7CgAgEQAA_AoAIBIAAKYMACATAAD9CgAgFgAAgAsAIBoAAIMLACAbAAD_CgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIRUHAACzCwAgCQAAsAsAIAoAALELACALAACqCwAgEQAAqwsAIBIAAKgMACATAACsCwAgFgAArwsAIBoAALILACAbAACuCwAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlgUBAAAAAZgFAQAAAAHEBQEAAAAB1AUBAAAAAfQFQAAAAAENBwAA_g0AIAkAAP8NACAVAACADgAgFwAAgQ4AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABwgUBAAAAAc4FAgAAAAH1BQEAAAAB9gUBAAAAAQNNAADrFAAgoQYAAOwUACCnBgAAqgQAIANNAADpFAAgoQYAAOoUACCnBgAAGgAgBE0AAPQNADChBgAA9Q0AMKMGAAD3DQAgpwYAAPQKADAETQAA6w0AMKEGAADsDQAwowYAAO4NACCnBgAA4AoAMARNAADcDQAwoQYAAN0NADCjBgAA3w0AIKcGAADgDQAwBE0AANMNADChBgAA1A0AMKMGAADWDQAgpwYAAPQKADADTQAA5xQAIKEGAADoFAAgpwYAAKoEACADTQAA5RQAIKEGAADmFAAgpwYAABoAIAAAAAKkBgEAAAAEqgYBAAAABQtNAACLDgAwTgAAjw4AMKEGAACMDgAwogYAAI0OADCjBgAAjg4AIKQGAACGDAAwpQYAAIYMADCmBgAAhgwAMKcGAACGDAAwqAYAAJAOADCpBgAAiQwAMA4bAAC0DAAgJQAAkwwAICYAAJQMACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABogUBAAAAAaQFAAAAugUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqQUBAAAAAboFAQAAAAECAAAAawAgTQAAkw4AIAMAAABrACBNAACTDgAgTgAAkg4AIAFGAADkFAAwAgAAAGsAIEYAAJIOACACAAAAigwAIEYAAJEOACAL7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhmAUBAIAKACGiBQEAgAoAIaQFAACMDLoFIqUFAQCACgAhpgVAAKgKACGnBUAAgQoAIakFAQCACgAhugUBAP8JACEOGwAAswwAICUAAI8MACAmAACQDAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhmAUBAIAKACGiBQEAgAoAIaQFAACMDLoFIqUFAQCACgAhpgVAAKgKACGnBUAAgQoAIakFAQCACgAhugUBAP8JACEOGwAAtAwAICUAAJMMACAmAACUDAAg7AQBAAAAAfQEQAAAAAH1BEAAAAABmAUBAAAAAaIFAQAAAAGkBQAAALoFAqUFAQAAAAGmBUAAAAABpwVAAAAAAakFAQAAAAG6BQEAAAABAaQGAQAAAAQETQAAiw4AMKEGAACMDgAwowYAAI4OACCnBgAAhgwAMAAAAAACpAYBAAAABKoGAQAAAAULTQAAnA4AME4AAKAOADChBgAAnQ4AMKIGAACeDgAwowYAAJ8OACCkBgAAoQoAMKUGAAChCgAwpgYAAKEKADCnBgAAoQoAMKgGAAChDgAwqQYAAKQKADASBwAAswoAIAkAALQKACASAADaCwAgJgAAsgoAIC0AALEKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGWBQEAAAABogUBAAAAAaQFAAAApAUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqQUBAAAAAQIAAACPAQAgTQAApA4AIAMAAACPAQAgTQAApA4AIE4AAKMOACABRgAA4xQAMAIAAACPAQAgRgAAow4AIAIAAAClCgAgRgAAog4AIA3sBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhgQUBAP8JACGWBQEAgAoAIaIFAQCACgAhpAUAAKcKpAUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqQUBAIAKACESBwAArQoAIAkAAK4KACASAADZCwAgJgAArAoAIC0AAKsKACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhgQUBAP8JACGWBQEAgAoAIaIFAQCACgAhpAUAAKcKpAUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqQUBAIAKACESBwAAswoAIAkAALQKACASAADaCwAgJgAAsgoAIC0AALEKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGWBQEAAAABogUBAAAAAaQFAAAApAUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqQUBAAAAAQGkBgEAAAAEBE0AAJwOADChBgAAnQ4AMKMGAACfDgAgpwYAAKEKADAAAAAAAAAAAAAAAAVNAADeFAAgTgAA4RQAIKEGAADfFAAgogYAAOAUACCnBgAAmQYAIANNAADeFAAgoQYAAN8UACCnBgAAmQYAIAAAAAGkBgAAAO4FAwGkBgAAAPEFAgVNAADTFAAgTgAA3BQAIKEGAADUFAAgogYAANsUACCnBgAApwIAIAdNAADRFAAgTgAA2RQAIKEGAADSFAAgogYAANgUACClBgAAbwAgpgYAAG8AIKcGAACnAgAgB00AAM8UACBOAADWFAAgoQYAANAUACCiBgAA1RQAIKUGAAAWACCmBgAAFgAgpwYAAKoEACADTQAA0xQAIKEGAADUFAAgpwYAAKcCACADTQAA0RQAIKEGAADSFAAgpwYAAKcCACADTQAAzxQAIKEGAADQFAAgpwYAAKoEACAAAAALTQAAoBAAME4AAKUQADChBgAAoRAAMKIGAACiEAAwowYAAKMQACCkBgAApBAAMKUGAACkEAAwpgYAAKQQADCnBgAApBAAMKgGAACmEAAwqQYAAKcQADALTQAAlBAAME4AAJkQADChBgAAlRAAMKIGAACWEAAwowYAAJcQACCkBgAAmBAAMKUGAACYEAAwpgYAAJgQADCnBgAAmBAAMKgGAACaEAAwqQYAAJsQADALTQAA-w8AME4AAIAQADChBgAA_A8AMKIGAAD9DwAwowYAAP4PACCkBgAA_w8AMKUGAAD_DwAwpgYAAP8PADCnBgAA_w8AMKgGAACBEAAwqQYAAIIQADALTQAA4w8AME4AAOgPADChBgAA5A8AMKIGAADlDwAwowYAAOYPACCkBgAA5w8AMKUGAADnDwAwpgYAAOcPADCnBgAA5w8AMKgGAADpDwAwqQYAAOoPADALTQAA2g8AME4AAN4PADChBgAA2w8AMKIGAADcDwAwowYAAN0PACCkBgAA9gwAMKUGAAD2DAAwpgYAAPYMADCnBgAA9gwAMKgGAADfDwAwqQYAAPkMADALTQAAzw8AME4AANMPADChBgAA0A8AMKIGAADRDwAwowYAANIPACCkBgAA4A0AMKUGAADgDQAwpgYAAOANADCnBgAA4A0AMKgGAADUDwAwqQYAAOMNADALTQAAwA8AME4AAMUPADChBgAAwQ8AMKIGAADCDwAwowYAAMMPACCkBgAAxA8AMKUGAADEDwAwpgYAAMQPADCnBgAAxA8AMKgGAADGDwAwqQYAAMcPADALTQAAtA8AME4AALkPADChBgAAtQ8AMKIGAAC2DwAwowYAALcPACCkBgAAuA8AMKUGAAC4DwAwpgYAALgPADCnBgAAuA8AMKgGAAC6DwAwqQYAALsPADALTQAAqA8AME4AAK0PADChBgAAqQ8AMKIGAACqDwAwowYAAKsPACCkBgAArA8AMKUGAACsDwAwpgYAAKwPADCnBgAArA8AMKgGAACuDwAwqQYAAK8PADALTQAAnw8AME4AAKMPADChBgAAoA8AMKIGAAChDwAwowYAAKIPACCkBgAA9AoAMKUGAAD0CgAwpgYAAPQKADCnBgAA9AoAMKgGAACkDwAwqQYAAPcKADALTQAAlg8AME4AAJoPADChBgAAlw8AMKIGAACYDwAwowYAAJkPACCkBgAA4AoAMKUGAADgCgAwpgYAAOAKADCnBgAA4AoAMKgGAACbDwAwqQYAAOMKADALTQAAig8AME4AAI8PADChBgAAiw8AMKIGAACMDwAwowYAAI0PACCkBgAAjg8AMKUGAACODwAwpgYAAI4PADCnBgAAjg8AMKgGAACQDwAwqQYAAJEPADALTQAAgQ8AME4AAIUPADChBgAAgg8AMKIGAACDDwAwowYAAIQPACCkBgAAoQoAMKUGAAChCgAwpgYAAKEKADCnBgAAoQoAMKgGAACGDwAwqQYAAKQKADALTQAA-A4AME4AAPwOADChBgAA-Q4AMKIGAAD6DgAwowYAAPsOACCkBgAAuQoAMKUGAAC5CgAwpgYAALkKADCnBgAAuQoAMKgGAAD9DgAwqQYAALwKADALTQAA7w4AME4AAPMOADChBgAA8A4AMKIGAADxDgAwowYAAPIOACCkBgAAyQoAMKUGAADJCgAwpgYAAMkKADCnBgAAyQoAMKgGAAD0DgAwqQYAAMwKADALTQAA5g4AME4AAOoOADChBgAA5w4AMKIGAADoDgAwowYAAOkOACCkBgAAjgoAMKUGAACOCgAwpgYAAI4KADCnBgAAjgoAMKgGAADrDgAwqQYAAJEKADALTQAA3Q4AME4AAOEOADChBgAA3g4AMKIGAADfDgAwowYAAOAOACCkBgAA0gwAMKUGAADSDAAwpgYAANIMADCnBgAA0gwAMKgGAADiDgAwqQYAANUMADALTQAA1A4AME4AANgOADChBgAA1Q4AMKIGAADWDgAwowYAANcOACCkBgAA7gsAMKUGAADuCwAwpgYAAO4LADCnBgAA7gsAMKgGAADZDgAwqQYAAPELADAaCQAA_wsAIBoAAIAMACAbAADNDAAgHAAAgQwAIOwEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABpAUAAADaBQLEBQEAAAAB1gUBAAAAAdgFAAAA2AUC2gUCAAAAAdsFEAAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFgAAAAAHlBUAAAAAB5gVAAAAAAQIAAABVACBNAADcDgAgAwAAAFUAIE0AANwOACBOAADbDgAgAUYAAM4UADACAAAAVQAgRgAA2w4AIAIAAADyCwAgRgAA2g4AIBbsBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZgFAQD_CQAhpAUAAPUL2gUixAUBAP8JACHWBQEA_wkAIdgFAAD0C9gFItoFAgD2CwAh2wUQAPcLACHcBQEA_wkAId0FAQD_CQAh3gUBAP8JACHfBQEAgAoAIeAFAQCACgAh4QUBAIAKACHiBQEAgAoAIeMFAQCACgAh5AWAAAAAAeUFQACBCgAh5gVAAKgKACEaCQAA-gsAIBoAAPsLACAbAADLDAAgHAAA_AsAIOwEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhmAUBAP8JACGkBQAA9QvaBSLEBQEA_wkAIdYFAQD_CQAh2AUAAPQL2AUi2gUCAPYLACHbBRAA9wsAIdwFAQD_CQAh3QUBAP8JACHeBQEA_wkAId8FAQCACgAh4AUBAIAKACHhBQEAgAoAIeIFAQCACgAh4wUBAIAKACHkBYAAAAAB5QVAAIEKACHmBUAAqAoAIRoJAAD_CwAgGgAAgAwAIBsAAM0MACAcAACBDAAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGkBQAAANoFAsQFAQAAAAHWBQEAAAAB2AUAAADYBQLaBQIAAAAB2wUQAAAAAdwFAQAAAAHdBQEAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AWAAAAAAeUFQAAAAAHmBUAAAAABDAkAAOcMACAaAACzDgAgHQAA6AwAIOwEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAHEBQEAAAAB3AUBAAAAAecFEAAAAAHoBRAAAAAB6QUgAAAAAQIAAABRACBNAADlDgAgAwAAAFEAIE0AAOUOACBOAADkDgAgAUYAAM0UADACAAAAUQAgRgAA5A4AIAIAAADWDAAgRgAA4w4AIAnsBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcQFAQD_CQAh3AUBAP8JACHnBRAA9wsAIegFEAD3CwAh6QUgAMELACEMCQAA2gwAIBoAALIOACAdAADbDAAg7AQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACHEBQEA_wkAIdwFAQD_CQAh5wUQAPcLACHoBRAA9wsAIekFIADBCwAhDAkAAOcMACAaAACzDgAgHQAA6AwAIOwEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAHEBQEAAAAB3AUBAAAAAecFEAAAAAHoBRAAAAAB6QUgAAAAARYJAACcCgAgDgAAmgoAIBIAAIsLACDsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlgUBAAAAAaoFAQAAAAGrBQgAAAABrAUIAAAAAa0FCAAAAAGuBQgAAAABrwUIAAAAAbAFCAAAAAGxBQgAAAABsgUIAAAAAbMFCAAAAAG0BQgAAAABtQUIAAAAAbYFCAAAAAG3BQgAAAABAgAAAJkBACBNAADuDgAgAwAAAJkBACBNAADuDgAgTgAA7Q4AIAFGAADMFAAwAgAAAJkBACBGAADtDgAgAgAAAJIKACBGAADsDgAgE-wEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlgUBAP8JACGqBQEA_wkAIasFCACUCgAhrAUIAJQKACGtBQgAlAoAIa4FCACUCgAhrwUIAJQKACGwBQgAlAoAIbEFCACUCgAhsgUIAJQKACGzBQgAlAoAIbQFCACUCgAhtQUIAJQKACG2BQgAlAoAIbcFCACUCgAhFgkAAJgKACAOAACWCgAgEgAAigsAIOwEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlgUBAP8JACGqBQEA_wkAIasFCACUCgAhrAUIAJQKACGtBQgAlAoAIa4FCACUCgAhrwUIAJQKACGwBQgAlAoAIbEFCACUCgAhsgUIAJQKACGzBQgAlAoAIbQFCACUCgAhtQUIAJQKACG2BQgAlAoAIbcFCACUCgAhFgkAAJwKACAOAACaCgAgEgAAiwsAIOwEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGWBQEAAAABqgUBAAAAAasFCAAAAAGsBQgAAAABrQUIAAAAAa4FCAAAAAGvBQgAAAABsAUIAAAAAbEFCAAAAAGyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIAAAAAbcFCAAAAAENCQAA1goAIBsAANQKACAhAADQCwAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZcFAQAAAAGYBQEAAAABmQUBAAAAAZoFAQAAAAGbBQEAAAABnAVAAAAAAQIAAAA9ACBNAAD3DgAgAwAAAD0AIE0AAPcOACBOAAD2DgAgAUYAAMsUADACAAAAPQAgRgAA9g4AIAIAAADNCgAgRgAA9Q4AIArsBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZcFAQD_CQAhmAUBAP8JACGZBQEAgAoAIZoFAQCACgAhmwUBAIAKACGcBUAAgQoAIQ0JAADSCgAgGwAA0AoAICEAAM8LACDsBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZcFAQD_CQAhmAUBAP8JACGZBQEAgAoAIZoFAQCACgAhmwUBAIAKACGcBUAAgQoAIQ0JAADWCgAgGwAA1AoAICEAANALACDsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlwUBAAAAAZgFAQAAAAGZBQEAAAABmgUBAAAAAZsFAQAAAAGcBUAAAAABDgkAANoKACASAADVCwAgFgAA2AoAICAAANsKACDsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZYFAQAAAAGdBQEAAAABngUBAAAAAaAFAAAAoAUCoQVAAAAAAQIAAABHACBNAACADwAgAwAAAEcAIE0AAIAPACBOAAD_DgAgAUYAAMoUADACAAAARwAgRgAA_w4AIAIAAAC9CgAgRgAA_g4AIArsBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlgUBAP8JACGdBQEA_wkAIZ4FAQCACgAhoAUAAL8KoAUioQVAAKgKACEOCQAAwwoAIBIAANQLACAWAADBCgAgIAAAxAoAIOwEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGWBQEA_wkAIZ0FAQD_CQAhngUBAIAKACGgBQAAvwqgBSKhBUAAqAoAIQ4JAADaCgAgEgAA1QsAIBYAANgKACAgAADbCgAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABnQUBAAAAAZ4FAQAAAAGgBQAAAKAFAqEFQAAAAAESCQAAtAoAIBIAANoLACAkAACwCgAgJgAAsgoAIC0AALEKACDsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABgQUBAAAAAZYFAQAAAAGiBQEAAAABpAUAAACkBQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABqQUBAAAAAQIAAACPAQAgTQAAiQ8AIAMAAACPAQAgTQAAiQ8AIE4AAIgPACABRgAAyRQAMAIAAACPAQAgRgAAiA8AIAIAAAClCgAgRgAAhw8AIA3sBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIYEFAQD_CQAhlgUBAIAKACGiBQEAgAoAIaQFAACnCqQFIqUFAQCACgAhpgVAAKgKACGnBUAAgQoAIagFAQD_CQAhqQUBAIAKACESCQAArgoAIBIAANkLACAkAACqCgAgJgAArAoAIC0AAKsKACDsBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIYEFAQD_CQAhlgUBAIAKACGiBQEAgAoAIaQFAACnCqQFIqUFAQCACgAhpgVAAKgKACGnBUAAgQoAIagFAQD_CQAhqQUBAIAKACESCQAAtAoAIBIAANoLACAkAACwCgAgJgAAsgoAIC0AALEKACDsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABgQUBAAAAAZYFAQAAAAGiBQEAAAABpAUAAACkBQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABqQUBAAAAAQ81AAC8DgAgNgAAvQ4AIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA8QUCpgVAAAAAAcIFAQAAAAHqBQEAAAAB6wUBAAAAAewFAQAAAAHuBQAAAO4FA-8FAQAAAAHxBQEAAAAB8gUBAAAAAQIAAAC7AQAgTQAAlQ8AIAMAAAC7AQAgTQAAlQ8AIE4AAJQPACABRgAAyBQAMBQHAAC5CQAgNQAAvwgAIDYAALgJACDpBAAAtQkAMOoEAAC5AQAQ6wQAALUJADDsBAEAAAAB8QQBALsIACH0BEAAvggAIfUEQAC-CAAhpAUAALYJ8QUipgVAALcJACHCBQEAuwgAIeoFAQC6CAAh6wUBALoIACHsBQEAuwgAIe4FAACJCe4FI-8FAQC7CAAh8QUBALsIACHyBQEAuwgAIQIAAAC7AQAgRgAAlA8AIAIAAACSDwAgRgAAkw8AIBHpBAAAkQ8AMOoEAACSDwAQ6wQAAJEPADDsBAEAuggAIfEEAQC7CAAh9ARAAL4IACH1BEAAvggAIaQFAAC2CfEFIqYFQAC3CQAhwgUBALsIACHqBQEAuggAIesFAQC6CAAh7AUBALsIACHuBQAAiQnuBSPvBQEAuwgAIfEFAQC7CAAh8gUBALsIACER6QQAAJEPADDqBAAAkg8AEOsEAACRDwAw7AQBALoIACHxBAEAuwgAIfQEQAC-CAAh9QRAAL4IACGkBQAAtgnxBSKmBUAAtwkAIcIFAQC7CAAh6gUBALoIACHrBQEAuggAIewFAQC7CAAh7gUAAIkJ7gUj7wUBALsIACHxBQEAuwgAIfIFAQC7CAAhDewEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaQFAAC4DvEFIqYFQACoCgAhwgUBAIAKACHqBQEA_wkAIesFAQD_CQAh7AUBAIAKACHuBQAAtw7uBSPvBQEAgAoAIfEFAQCACgAh8gUBAIAKACEPNQAAuQ4AIDYAALoOACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGkBQAAuA7xBSKmBUAAqAoAIcIFAQCACgAh6gUBAP8JACHrBQEA_wkAIewFAQCACgAh7gUAALcO7gUj7wUBAIAKACHxBQEAgAoAIfIFAQCACgAhDzUAALwOACA2AAC9DgAg7AQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAADxBQKmBUAAAAABwgUBAAAAAeoFAQAAAAHrBQEAAAAB7AUBAAAAAe4FAAAA7gUD7wUBAAAAAfEFAQAAAAHyBQEAAAABCwkAAO8KACASAADLCwAgFAAA7QoAIBYAAOwKACDsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABAgAAAEIAIE0AAJ4PACADAAAAQgAgTQAAng8AIE4AAJ0PACABRgAAxxQAMAIAAABCACBGAACdDwAgAgAAAOQKACBGAACcDwAgB-wEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIZYFAQD_CQAhCwkAAOoKACASAADKCwAgFAAA6AoAIBYAAOcKACDsBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlQUBAP8JACGWBQEA_wkAIQsJAADvCgAgEgAAywsAIBQAAO0KACAWAADsCgAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGVBQEAAAABlgUBAAAAARUJAACwCwAgCgAAsQsAIAsAAKoLACARAACrCwAgEgAAqAwAIBMAAKwLACAUAACtCwAgFgAArwsAIBoAALILACAbAACuCwAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGVBQEAAAABlgUBAAAAAZgFAQAAAAHEBQEAAAAB1AUBAAAAAfQFQAAAAAECAAAAKAAgTQAApw8AIAMAAAAoACBNAACnDwAgTgAApg8AIAFGAADGFAAwAgAAACgAIEYAAKYPACACAAAA-AoAIEYAAKUPACAL7AQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIRUJAACBCwAgCgAAggsAIAsAAPsKACARAAD8CgAgEgAApgwAIBMAAP0KACAUAAD-CgAgFgAAgAsAIBoAAIMLACAbAAD_CgAg7AQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIRUJAACwCwAgCgAAsQsAIAsAAKoLACARAACrCwAgEgAAqAwAIBMAAKwLACAUAACtCwAgFgAArwsAIBoAALILACAbAACuCwAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGVBQEAAAABlgUBAAAAAZgFAQAAAAHEBQEAAAAB1AUBAAAAAfQFQAAAAAENAwAAqwwAIAkAAKoMACAVAACsDAAgHQAArwwAICIAAK0MACAnAACuDAAg7AQBAAAAAfAEAQAAAAHyBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABuAUBAAAAAQIAAACJAQAgTQAAsw8AIAMAAACJAQAgTQAAsw8AIE4AALIPACABRgAAxRQAMBIDAAC_CAAgBwAAvQkAIAkAAMIJACAVAADbCAAgHQAA3QgAICIAAJUJACAnAADsCAAg6QQAAMgJADDqBAAAcQAQ6wQAAMgJADDsBAEAAAAB8AQBALsIACHxBAEAuggAIfIEAQC7CAAh8wQBALoIACH0BEAAvggAIfUEQAC-CAAhuAUBAAAAAQIAAACJAQAgRgAAsg8AIAIAAACwDwAgRgAAsQ8AIAvpBAAArw8AMOoEAACwDwAQ6wQAAK8PADDsBAEAuggAIfAEAQC7CAAh8QQBALoIACHyBAEAuwgAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIbgFAQC6CAAhC-kEAACvDwAw6gQAALAPABDrBAAArw8AMOwEAQC6CAAh8AQBALsIACHxBAEAuggAIfIEAQC7CAAh8wQBALoIACH0BEAAvggAIfUEQAC-CAAhuAUBALoIACEH7AQBAP8JACHwBAEAgAoAIfIEAQCACgAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhuAUBAP8JACENAwAA5QsAIAkAAOQLACAVAADmCwAgHQAA6QsAICIAAOcLACAnAADoCwAg7AQBAP8JACHwBAEAgAoAIfIEAQCACgAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhuAUBAP8JACENAwAAqwwAIAkAAKoMACAVAACsDAAgHQAArwwAICIAAK0MACAnAACuDAAg7AQBAAAAAfAEAQAAAAHyBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABuAUBAAAAARADAAC7CwAgCQAAugsAIBUAALULACAXAAC2CwAgGAAAtwsAIDgAALgLACA5AAC5CwAg7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHyBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABAgAAABAAIE0AAL8PACADAAAAEAAgTQAAvw8AIE4AAL4PACABRgAAxBQAMBUDAAC_CAAgBwAAvQkAIAkAANQJACAVAADbCAAgFwAAkgkAIBgAAJQJACA4AADvCAAgOQAAlgkAIOkEAAD2CQAw6gQAAA4AEOsEAAD2CQAw7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBALoIACHwBAEAuwgAIfEEAQC6CAAh8gQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACECAAAAEAAgRgAAvg8AIAIAAAC8DwAgRgAAvQ8AIA3pBAAAuw8AMOoEAAC8DwAQ6wQAALsPADDsBAEAuggAIe0EAQC6CAAh7gQBALoIACHvBAEAuggAIfAEAQC7CAAh8QQBALoIACHyBAEAuggAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIQ3pBAAAuw8AMOoEAAC8DwAQ6wQAALsPADDsBAEAuggAIe0EAQC6CAAh7gQBALoIACHvBAEAuggAIfAEAQC7CAAh8QQBALoIACHyBAEAuggAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIQnsBAEA_wkAIe0EAQD_CQAh7gQBAP8JACHvBAEA_wkAIfAEAQCACgAh8gQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACEQAwAAiQoAIAkAAIgKACAVAACDCgAgFwAAhAoAIBgAAIUKACA4AACGCgAgOQAAhwoAIOwEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHyBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIRADAAC7CwAgCQAAugsAIBUAALULACAXAAC2CwAgGAAAtwsAIDgAALgLACA5AAC5CwAg7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHyBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABBgMAAM4PACDsBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABlAYAAACZBgICAAAAAQAgTQAAzQ8AIAMAAAABACBNAADNDwAgTgAAyw8AIAFGAADDFAAwCwMAAL8IACAHAAC9CQAg6QQAAPcJADDqBAAACwAQ6wQAAPcJADDsBAEAAAAB8QQBALoIACHzBAEAAAAB9ARAAL4IACH1BEAAvggAIZQGAAD4CZkGIgIAAAABACBGAADLDwAgAgAAAMgPACBGAADJDwAgCekEAADHDwAw6gQAAMgPABDrBAAAxw8AMOwEAQC6CAAh8QQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACGUBgAA-AmZBiIJ6QQAAMcPADDqBAAAyA8AEOsEAADHDwAw7AQBALoIACHxBAEAuggAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIZQGAAD4CZkGIgXsBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZQGAADKD5kGIgGkBgAAAJkGAgYDAADMDwAg7AQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACGUBgAAyg-ZBiIFTQAAvhQAIE4AAMEUACChBgAAvxQAIKIGAADAFAAgpwYAAKcCACAGAwAAzg8AIOwEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAGUBgAAAJkGAgNNAAC-FAAgoQYAAL8UACCnBgAApwIAIA0JAAD_DQAgCgAA2Q8AIBUAAIAOACAXAACBDgAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHOBQIAAAAB1AUBAAAAAfUFAQAAAAH2BQEAAAABAgAAACMAIE0AANgPACADAAAAIwAgTQAA2A8AIE4AANYPACABRgAAvRQAMAIAAAAjACBGAADWDwAgAgAAAOQNACBGAADVDwAgCewEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHOBQIA_AwAIdQFAQCACgAh9QUBAP8JACH2BQEA_wkAIQ0JAADoDQAgCgAA1w8AIBUAAOkNACAXAADqDQAg7AQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIc4FAgD8DAAh1AUBAIAKACH1BQEA_wkAIfYFAQD_CQAhB00AALgUACBOAAC7FAAgoQYAALkUACCiBgAAuhQAIKUGAAAdACCmBgAAHQAgpwYAAB8AIA0JAAD_DQAgCgAA2Q8AIBUAAIAOACAXAACBDgAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHOBQIAAAAB1AUBAAAAAfUFAQAAAAH2BQEAAAABA00AALgUACChBgAAuRQAIKcGAAAfACAPCQAApA0AIBUAAKANACAXAAChDQAgGAAAog0AIBoAALQNACAfAAClDQAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABwwUCAAAAAcQFAQAAAAHFBQEAAAABAgAAAEwAIE0AAOIPACADAAAATAAgTQAA4g8AIE4AAOEPACABRgAAtxQAMAIAAABMACBGAADhDwAgAgAAAPoMACBGAADgDwAgCewEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACHCBQEAgAoAIcMFAgD8DAAhxAUBAP8JACHFBQEAgAoAIQ8JAACCDQAgFQAA_gwAIBcAAP8MACAYAACADQAgGgAAsw0AIB8AAIMNACDsBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACHDBQIA_AwAIcQFAQD_CQAhxQUBAIAKACEPCQAApA0AIBUAAKANACAXAAChDQAgGAAAog0AIBoAALQNACAfAAClDQAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABwwUCAAAAAcQFAQAAAAHFBQEAAAABCQ8AAPoPACDsBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQIAAAAB-wUAAAD7BQICAAAAsAEAIE0AAPkPACADAAAAsAEAIE0AAPkPACBOAADuDwAgAUYAALYUADAOBwAAvQkAIA8AAOcIACDpBAAAugkAMOoEAACuAQAQ6wQAALoJADDsBAEAAAAB8QQBALoIACH0BEAAvggAIfUEQAC-CAAhvAUBALsIACH3BQEAuggAIfgFAQC6CAAh-QUCALsJACH7BQAAvAn7BSICAAAAsAEAIEYAAO4PACACAAAA6w8AIEYAAOwPACAM6QQAAOoPADDqBAAA6w8AEOsEAADqDwAw7AQBALoIACHxBAEAuggAIfQEQAC-CAAh9QRAAL4IACG8BQEAuwgAIfcFAQC6CAAh-AUBALoIACH5BQIAuwkAIfsFAAC8CfsFIgzpBAAA6g8AMOoEAADrDwAQ6wQAAOoPADDsBAEAuggAIfEEAQC6CAAh9ARAAL4IACH1BEAAvggAIbwFAQC7CAAh9wUBALoIACH4BQEAuggAIfkFAgC7CQAh-wUAALwJ-wUiCOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbwFAQCACgAh9wUBAP8JACH4BQEA_wkAIfkFAgD2CwAh-wUAAO0P-wUiAaQGAAAA-wUCCQ8AAO8PACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACG8BQEAgAoAIfcFAQD_CQAh-AUBAP8JACH5BQIA9gsAIfsFAADtD_sFIgtNAADwDwAwTgAA9A8AMKEGAADxDwAwogYAAPIPADCjBgAA8w8AIKQGAACdCwAwpQYAAJ0LADCmBgAAnQsAMKcGAACdCwAwqAYAAPUPADCpBgAAoAsAMAoNAACnCwAgDgAAxA0AIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaoFAQAAAAG8BQEAAAABwgUBAAAAAckFAQAAAAHKBQEAAAABAgAAACwAIE0AAPgPACADAAAALAAgTQAA-A8AIE4AAPcPACABRgAAtRQAMAIAAAAsACBGAAD3DwAgAgAAAKELACBGAAD2DwAgCOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaoFAQD_CQAhvAUBAP8JACHCBQEAgAoAIckFAQCACgAhygUBAP8JACEKDQAApAsAIA4AAMINACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGqBQEA_wkAIbwFAQD_CQAhwgUBAIAKACHJBQEAgAoAIcoFAQD_CQAhCg0AAKcLACAOAADEDQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABqgUBAAAAAbwFAQAAAAHCBQEAAAAByQUBAAAAAcoFAQAAAAEJDwAA-g8AIOwEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAH3BQEAAAAB-AUBAAAAAfkFAgAAAAH7BQAAAPsFAgRNAADwDwAwoQYAAPEPADCjBgAA8w8AIKcGAACdCwAwCAkAAJIQACAZAACTEAAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABAgAAAIMBACBNAACREAAgAwAAAIMBACBNAACREAAgTgAAhRAAIAFGAAC0FAAwDQcAAL0JACAJAADCCQAgGQAA2ggAIOkEAADJCQAw6gQAAF0AEOsEAADJCQAw7AQBAAAAAfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIQIAAACDAQAgRgAAhRAAIAIAAACDEAAgRgAAhBAAIArpBAAAghAAMOoEAACDEAAQ6wQAAIIQADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIQrpBAAAghAAMOoEAACDEAAQ6wQAAIIQADDsBAEAuggAIfEEAQC6CAAh8gQBALsIACH0BEAAvggAIfUEQAC-CAAhvAUBALoIACHCBQEAuwgAIQbsBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACEICQAAhhAAIBkAAIcQACDsBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACEHTQAArhQAIE4AALIUACChBgAArxQAIKIGAACxFAAgpQYAABgAIKYGAAAYACCnBgAAGgAgC00AAIgQADBOAACMEAAwoQYAAIkQADCiBgAAihAAMKMGAACLEAAgpAYAAPYMADClBgAA9gwAMKYGAAD2DAAwpwYAAPYMADCoBgAAjRAAMKkGAAD5DAAwDwcAAKMNACAJAACkDQAgFQAAoA0AIBcAAKENACAYAACiDQAgGgAAtA0AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHDBQIAAAABxAUBAAAAAQIAAABMACBNAACQEAAgAwAAAEwAIE0AAJAQACBOAACPEAAgAUYAALAUADACAAAATAAgRgAAjxAAIAIAAAD6DAAgRgAAjhAAIAnsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACHCBQEAgAoAIcMFAgD8DAAhxAUBAP8JACEPBwAAgQ0AIAkAAIINACAVAAD-DAAgFwAA_wwAIBgAAIANACAaAACzDQAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACHDBQIA_AwAIcQFAQD_CQAhDwcAAKMNACAJAACkDQAgFQAAoA0AIBcAAKENACAYAACiDQAgGgAAtA0AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHDBQIAAAABxAUBAAAAAQgJAACSEAAgGQAAkxAAIOwEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABwgUBAAAAAQNNAACuFAAgoQYAAK8UACCnBgAAGgAgBE0AAIgQADChBgAAiRAAMKMGAACLEAAgpwYAAPYMADANCQAAhQ4AIBQAAIIOACAVAACDDgAg7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZ0FAQAAAAHCBQEAAAABzAUBAAAAAc0FQAAAAAHOBQgAAAABzwUIAAAAAQIAAAAfACBNAACfEAAgAwAAAB8AIE0AAJ8QACBOAACeEAAgAUYAAK0UADASBwAAvQkAIAkAANQJACAUAACOCQAgFQAA2wgAIOkEAADxCQAw6gQAAB0AEOsEAADxCQAw7AQBAAAAAfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhnQUBALoIACHCBQEAuwgAIcwFAQC7CAAhzQVAALcJACHOBQgAvwkAIc8FCAC_CQAhAgAAAB8AIEYAAJ4QACACAAAAnBAAIEYAAJ0QACAO6QQAAJsQADDqBAAAnBAAEOsEAACbEAAw7AQBALoIACHxBAEAuggAIfIEAQC6CAAh9ARAAL4IACH1BEAAvggAIZ0FAQC6CAAhwgUBALsIACHMBQEAuwgAIc0FQAC3CQAhzgUIAL8JACHPBQgAvwkAIQ7pBAAAmxAAMOoEAACcEAAQ6wQAAJsQADDsBAEAuggAIfEEAQC6CAAh8gQBALoIACH0BEAAvggAIfUEQAC-CAAhnQUBALoIACHCBQEAuwgAIcwFAQC7CAAhzQVAALcJACHOBQgAvwkAIc8FCAC_CQAhCuwEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhnQUBAP8JACHCBQEAgAoAIcwFAQCACgAhzQVAAKgKACHOBQgAlAoAIc8FCACUCgAhDQkAANINACAUAADPDQAgFQAA0A0AIOwEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhnQUBAP8JACHCBQEAgAoAIcwFAQCACgAhzQVAAKgKACHOBQgAlAoAIc8FCACUCgAhDQkAAIUOACAUAACCDgAgFQAAgw4AIOwEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGdBQEAAAABwgUBAAAAAcwFAQAAAAHNBUAAAAABzgUIAAAAAc8FCAAAAAEHMgAA1REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHsBQEAAAAB8wUBAAAAAQIAAAAUACBNAADUEQAgAwAAABQAIE0AANQRACBOAACqEAAgAUYAAKwUADAMBwAAuQkAIDIAAPUJACDpBAAA9AkAMOoEAAASABDrBAAA9AkAMOwEAQAAAAHxBAEAuwgAIfQEQAC-CAAh9QRAAL4IACHCBQEAuwgAIewFAQC7CAAh8wUBALoIACECAAAAFAAgRgAAqhAAIAIAAACoEAAgRgAAqRAAIArpBAAApxAAMOoEAACoEAAQ6wQAAKcQADDsBAEAuggAIfEEAQC7CAAh9ARAAL4IACH1BEAAvggAIcIFAQC7CAAh7AUBALsIACHzBQEAuggAIQrpBAAApxAAMOoEAACoEAAQ6wQAAKcQADDsBAEAuggAIfEEAQC7CAAh9ARAAL4IACH1BEAAvggAIcIFAQC7CAAh7AUBALsIACHzBQEAuggAIQbsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIewFAQCACgAh8wUBAP8JACEHMgAAqxAAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh7AUBAIAKACHzBQEA_wkAIQtNAACsEAAwTgAAsRAAMKEGAACtEAAwogYAAK4QADCjBgAArxAAIKQGAACwEAAwpQYAALAQADCmBgAAsBAAMKcGAACwEAAwqAYAALIQADCpBgAAsxAAMBQVAADMEQAgFwAAzREAIBkAAMkRACAdAADTEQAgHgAA0hEAICgAAMYRACApAADHEQAgKgAAyBEAICsAAMoRACAsAADLEQAgLgAAzhEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHsBQEAAAAB8wUBAAAAAQIAAAAaACBNAADFEQAgAwAAABoAIE0AAMURACBOAAC2EAAgAUYAAKsUADAZCAAA8wkAIBUAANsIACAXAACSCQAgGQAA2ggAIB0AAN0IACAeAADcCAAgKAAAiwkAICkAAIwJACAqAACOCQAgKwAAkAkAICwAAJEJACAuAADvCAAgLwAAlAkAIDAAAJUJACAxAACWCQAg6QQAAPIJADDqBAAAGAAQ6wQAAPIJADDsBAEAAAAB9ARAAL4IACH1BEAAvggAIcIFAQC7CAAh0wUBALsIACHsBQEAuwgAIfMFAQC6CAAhAgAAABoAIEYAALYQACACAAAAtBAAIEYAALUQACAK6QQAALMQADDqBAAAtBAAEOsEAACzEAAw7AQBALoIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHTBQEAuwgAIewFAQC7CAAh8wUBALoIACEK6QQAALMQADDqBAAAtBAAEOsEAACzEAAw7AQBALoIACH0BEAAvggAIfUEQAC-CAAhwgUBALsIACHTBQEAuwgAIewFAQC7CAAh8wUBALoIACEG7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHsBQEAgAoAIfMFAQD_CQAhFBUAAL0QACAXAAC-EAAgGQAAuhAAIB0AAMQQACAeAADDEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHsBQEAgAoAIfMFAQD_CQAhC00AALwRADBOAADAEQAwoQYAAL0RADCiBgAAvhEAMKMGAAC_EQAgpAYAAJgQADClBgAAmBAAMKYGAACYEAAwpwYAAJgQADCoBgAAwREAMKkGAACbEAAwC00AALERADBOAAC1EQAwoQYAALIRADCiBgAAsxEAMKMGAAC0EQAgpAYAAP8PADClBgAA_w8AMKYGAAD_DwAwpwYAAP8PADCoBgAAthEAMKkGAACCEAAwC00AAKgRADBOAACsEQAwoQYAAKkRADCiBgAAqhEAMKMGAACrEQAgpAYAAOANADClBgAA4A0AMKYGAADgDQAwpwYAAOANADCoBgAArREAMKkGAADjDQAwC00AAJ8RADBOAACjEQAwoQYAAKARADCiBgAAoREAMKMGAACiEQAgpAYAAPYMADClBgAA9gwAMKYGAAD2DAAwpwYAAPYMADCoBgAApBEAMKkGAAD5DAAwC00AAJYRADBOAACaEQAwoQYAAJcRADCiBgAAmBEAMKMGAACZEQAgpAYAALgPADClBgAAuA8AMKYGAAC4DwAwpwYAALgPADCoBgAAmxEAMKkGAAC7DwAwC00AAI0RADBOAACREQAwoQYAAI4RADCiBgAAjxEAMKMGAACQEQAgpAYAAKwPADClBgAArA8AMKYGAACsDwAwpwYAAKwPADCoBgAAkhEAMKkGAACvDwAwC00AAIQRADBOAACIEQAwoQYAAIURADCiBgAAhhEAMKMGAACHEQAgpAYAAPQKADClBgAA9AoAMKYGAAD0CgAwpwYAAPQKADCoBgAAiREAMKkGAAD3CgAwC00AAPsQADBOAAD_EAAwoQYAAPwQADCiBgAA_RAAMKMGAAD-EAAgpAYAAOAKADClBgAA4AoAMKYGAADgCgAwpwYAAOAKADCoBgAAgBEAMKkGAADjCgAwC00AAPIQADBOAAD2EAAwoQYAAPMQADCiBgAA9BAAMKMGAAD1EAAgpAYAAKEKADClBgAAoQoAMKYGAAChCgAwpwYAAKEKADCoBgAA9xAAMKkGAACkCgAwC00AAOkQADBOAADtEAAwoQYAAOoQADCiBgAA6xAAMKMGAADsEAAgpAYAALkKADClBgAAuQoAMKYGAAC5CgAwpwYAALkKADCoBgAA7hAAMKkGAAC8CgAwC00AAOAQADBOAADkEAAwoQYAAOEQADCiBgAA4hAAMKMGAADjEAAgpAYAAMkKADClBgAAyQoAMKYGAADJCgAwpwYAAMkKADCoBgAA5RAAMKkGAADMCgAwC00AANcQADBOAADbEAAwoQYAANgQADCiBgAA2RAAMKMGAADaEAAgpAYAAI4KADClBgAAjgoAMKYGAACOCgAwpwYAAI4KADCoBgAA3BAAMKkGAACRCgAwC00AAM4QADBOAADSEAAwoQYAAM8QADCiBgAA0BAAMKMGAADREAAgpAYAANIMADClBgAA0gwAMKYGAADSDAAwpwYAANIMADCoBgAA0xAAMKkGAADVDAAwC00AAMUQADBOAADJEAAwoQYAAMYQADCiBgAAxxAAMKMGAADIEAAgpAYAAO4LADClBgAA7gsAMKYGAADuCwAwpwYAAO4LADCoBgAAyhAAMKkGAADxCwAwGgcAAP4LACAaAACADAAgGwAAzQwAIBwAAIEMACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABmAUBAAAAAaQFAAAA2gUCxAUBAAAAAdYFAQAAAAHYBQAAANgFAtoFAgAAAAHbBRAAAAAB3AUBAAAAAd0FAQAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBYAAAAAB5QVAAAAAAeYFQAAAAAECAAAAVQAgTQAAzRAAIAMAAABVACBNAADNEAAgTgAAzBAAIAFGAACqFAAwAgAAAFUAIEYAAMwQACACAAAA8gsAIEYAAMsQACAW7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGYBQEA_wkAIaQFAAD1C9oFIsQFAQD_CQAh1gUBAP8JACHYBQAA9AvYBSLaBQIA9gsAIdsFEAD3CwAh3AUBAP8JACHdBQEA_wkAId4FAQD_CQAh3wUBAIAKACHgBQEAgAoAIeEFAQCACgAh4gUBAIAKACHjBQEAgAoAIeQFgAAAAAHlBUAAgQoAIeYFQACoCgAhGgcAAPkLACAaAAD7CwAgGwAAywwAIBwAAPwLACDsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZgFAQD_CQAhpAUAAPUL2gUixAUBAP8JACHWBQEA_wkAIdgFAAD0C9gFItoFAgD2CwAh2wUQAPcLACHcBQEA_wkAId0FAQD_CQAh3gUBAP8JACHfBQEAgAoAIeAFAQCACgAh4QUBAIAKACHiBQEAgAoAIeMFAQCACgAh5AWAAAAAAeUFQACBCgAh5gVAAKgKACEaBwAA_gsAIBoAAIAMACAbAADNDAAgHAAAgQwAIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABpAUAAADaBQLEBQEAAAAB1gUBAAAAAdgFAAAA2AUC2gUCAAAAAdsFEAAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFgAAAAAHlBUAAAAAB5gVAAAAAAQwHAADmDAAgGgAAsw4AIB0AAOgMACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABxAUBAAAAAdwFAQAAAAHnBRAAAAAB6AUQAAAAAekFIAAAAAECAAAAUQAgTQAA1hAAIAMAAABRACBNAADWEAAgTgAA1RAAIAFGAACpFAAwAgAAAFEAIEYAANUQACACAAAA1gwAIEYAANQQACAJ7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACHEBQEA_wkAIdwFAQD_CQAh5wUQAPcLACHoBRAA9wsAIekFIADBCwAhDAcAANkMACAaAACyDgAgHQAA2wwAIOwEAQD_CQAh8QQBAP8JACH0BEAAgQoAIfUEQACBCgAhxAUBAP8JACHcBQEA_wkAIecFEAD3CwAh6AUQAPcLACHpBSAAwQsAIQwHAADmDAAgGgAAsw4AIB0AAOgMACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABxAUBAAAAAdwFAQAAAAHnBRAAAAAB6AUQAAAAAekFIAAAAAEWBwAAmwoAIA4AAJoKACASAACLCwAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAZYFAQAAAAGqBQEAAAABqwUIAAAAAawFCAAAAAGtBQgAAAABrgUIAAAAAa8FCAAAAAGwBQgAAAABsQUIAAAAAbIFCAAAAAGzBQgAAAABtAUIAAAAAbUFCAAAAAG2BQgAAAABtwUIAAAAAQIAAACZAQAgTQAA3xAAIAMAAACZAQAgTQAA3xAAIE4AAN4QACABRgAAqBQAMAIAAACZAQAgRgAA3hAAIAIAAACSCgAgRgAA3RAAIBPsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZYFAQD_CQAhqgUBAP8JACGrBQgAlAoAIawFCACUCgAhrQUIAJQKACGuBQgAlAoAIa8FCACUCgAhsAUIAJQKACGxBQgAlAoAIbIFCACUCgAhswUIAJQKACG0BQgAlAoAIbUFCACUCgAhtgUIAJQKACG3BQgAlAoAIRYHAACXCgAgDgAAlgoAIBIAAIoLACDsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZYFAQD_CQAhqgUBAP8JACGrBQgAlAoAIawFCACUCgAhrQUIAJQKACGuBQgAlAoAIa8FCACUCgAhsAUIAJQKACGxBQgAlAoAIbIFCACUCgAhswUIAJQKACG0BQgAlAoAIbUFCACUCgAhtgUIAJQKACG3BQgAlAoAIRYHAACbCgAgDgAAmgoAIBIAAIsLACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABlgUBAAAAAaoFAQAAAAGrBQgAAAABrAUIAAAAAa0FCAAAAAGuBQgAAAABrwUIAAAAAbAFCAAAAAGxBQgAAAABsgUIAAAAAbMFCAAAAAG0BQgAAAABtQUIAAAAAbYFCAAAAAG3BQgAAAABDQcAANUKACAbAADUCgAgIQAA0AsAIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGXBQEAAAABmAUBAAAAAZkFAQAAAAGaBQEAAAABmwUBAAAAAZwFQAAAAAECAAAAPQAgTQAA6BAAIAMAAAA9ACBNAADoEAAgTgAA5xAAIAFGAACnFAAwAgAAAD0AIEYAAOcQACACAAAAzQoAIEYAAOYQACAK7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGXBQEA_wkAIZgFAQD_CQAhmQUBAIAKACGaBQEAgAoAIZsFAQCACgAhnAVAAIEKACENBwAA0QoAIBsAANAKACAhAADPCwAg7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGXBQEA_wkAIZgFAQD_CQAhmQUBAIAKACGaBQEAgAoAIZsFAQCACgAhnAVAAIEKACENBwAA1QoAIBsAANQKACAhAADQCwAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAZcFAQAAAAGYBQEAAAABmQUBAAAAAZoFAQAAAAGbBQEAAAABnAVAAAAAAQ4HAADZCgAgEgAA1QsAIBYAANgKACAgAADbCgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABnQUBAAAAAZ4FAQAAAAGgBQAAAKAFAqEFQAAAAAECAAAARwAgTQAA8RAAIAMAAABHACBNAADxEAAgTgAA8BAAIAFGAACmFAAwAgAAAEcAIEYAAPAQACACAAAAvQoAIEYAAO8QACAK7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZYFAQD_CQAhnQUBAP8JACGeBQEAgAoAIaAFAAC_CqAFIqEFQACoCgAhDgcAAMIKACASAADUCwAgFgAAwQoAICAAAMQKACDsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlgUBAP8JACGdBQEA_wkAIZ4FAQCACgAhoAUAAL8KoAUioQVAAKgKACEOBwAA2QoAIBIAANULACAWAADYCgAgIAAA2woAIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlgUBAAAAAZ0FAQAAAAGeBQEAAAABoAUAAACgBQKhBUAAAAABEgcAALMKACASAADaCwAgJAAAsAoAICYAALIKACAtAACxCgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGWBQEAAAABogUBAAAAAaQFAAAApAUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAakFAQAAAAECAAAAjwEAIE0AAPoQACADAAAAjwEAIE0AAPoQACBOAAD5EAAgAUYAAKUUADACAAAAjwEAIEYAAPkQACACAAAApQoAIEYAAPgQACAN7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGBBQEA_wkAIZYFAQCACgAhogUBAIAKACGkBQAApwqkBSKlBQEAgAoAIaYFQACoCgAhpwVAAIEKACGoBQEA_wkAIakFAQCACgAhEgcAAK0KACASAADZCwAgJAAAqgoAICYAAKwKACAtAACrCgAg7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGBBQEA_wkAIZYFAQCACgAhogUBAIAKACGkBQAApwqkBSKlBQEAgAoAIaYFQACoCgAhpwVAAIEKACGoBQEA_wkAIakFAQCACgAhEgcAALMKACASAADaCwAgJAAAsAoAICYAALIKACAtAACxCgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGWBQEAAAABogUBAAAAAaQFAAAApAUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAakFAQAAAAELBwAA7goAIBIAAMsLACAUAADtCgAgFgAA7AoAIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlQUBAAAAAZYFAQAAAAECAAAAQgAgTQAAgxEAIAMAAABCACBNAACDEQAgTgAAghEAIAFGAACkFAAwAgAAAEIAIEYAAIIRACACAAAA5AoAIEYAAIERACAH7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACELBwAA6QoAIBIAAMoLACAUAADoCgAgFgAA5woAIOwEAQD_CQAh8QQBAP8JACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIZYFAQD_CQAhCwcAAO4KACASAADLCwAgFAAA7QoAIBYAAOwKACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABFQcAALMLACAKAACxCwAgCwAAqgsAIBEAAKsLACASAACoDAAgEwAArAsAIBQAAK0LACAWAACvCwAgGgAAsgsAIBsAAK4LACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQIAAAAoACBNAACMEQAgAwAAACgAIE0AAIwRACBOAACLEQAgAUYAAKMUADACAAAAKAAgRgAAixEAIAIAAAD4CgAgRgAAihEAIAvsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlQUBAP8JACGWBQEA_wkAIZgFAQD_CQAhxAUBAP8JACHUBQEAgAoAIfQFQACBCgAhFQcAAIQLACAKAACCCwAgCwAA-woAIBEAAPwKACASAACmDAAgEwAA_QoAIBQAAP4KACAWAACACwAgGgAAgwsAIBsAAP8KACDsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlQUBAP8JACGWBQEA_wkAIZgFAQD_CQAhxAUBAP8JACHUBQEAgAoAIfQFQACBCgAhFQcAALMLACAKAACxCwAgCwAAqgsAIBEAAKsLACASAACoDAAgEwAArAsAIBQAAK0LACAWAACvCwAgGgAAsgsAIBsAAK4LACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQ0DAACrDAAgBwAAqQwAIBUAAKwMACAdAACvDAAgIgAArQwAICcAAK4MACDsBAEAAAAB8AQBAAAAAfEEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAG4BQEAAAABAgAAAIkBACBNAACVEQAgAwAAAIkBACBNAACVEQAgTgAAlBEAIAFGAACiFAAwAgAAAIkBACBGAACUEQAgAgAAALAPACBGAACTEQAgB-wEAQD_CQAh8AQBAIAKACHxBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbgFAQD_CQAhDQMAAOULACAHAADjCwAgFQAA5gsAIB0AAOkLACAiAADnCwAgJwAA6AsAIOwEAQD_CQAh8AQBAIAKACHxBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbgFAQD_CQAhDQMAAKsMACAHAACpDAAgFQAArAwAIB0AAK8MACAiAACtDAAgJwAArgwAIOwEAQAAAAHwBAEAAAAB8QQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAbgFAQAAAAEQAwAAuwsAIAcAALQLACAVAAC1CwAgFwAAtgsAIBgAALcLACA4AAC4CwAgOQAAuQsAIOwEAQAAAAHtBAEAAAAB7gQBAAAAAe8EAQAAAAHwBAEAAAAB8QQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAQIAAAAQACBNAACeEQAgAwAAABAAIE0AAJ4RACBOAACdEQAgAUYAAKEUADACAAAAEAAgRgAAnREAIAIAAAC8DwAgRgAAnBEAIAnsBAEA_wkAIe0EAQD_CQAh7gQBAP8JACHvBAEA_wkAIfAEAQCACgAh8QQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACEQAwAAiQoAIAcAAIIKACAVAACDCgAgFwAAhAoAIBgAAIUKACA4AACGCgAgOQAAhwoAIOwEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHxBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIRADAAC7CwAgBwAAtAsAIBUAALULACAXAAC2CwAgGAAAtwsAIDgAALgLACA5AAC5CwAg7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHxBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABDwcAAKMNACAVAACgDQAgFwAAoQ0AIBgAAKINACAaAAC0DQAgHwAApQ0AIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABwgUBAAAAAcMFAgAAAAHEBQEAAAABxQUBAAAAAQIAAABMACBNAACnEQAgAwAAAEwAIE0AAKcRACBOAACmEQAgAUYAAKAUADACAAAATAAgRgAAphEAIAIAAAD6DAAgRgAApREAIAnsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACHDBQIA_AwAIcQFAQD_CQAhxQUBAIAKACEPBwAAgQ0AIBUAAP4MACAXAAD_DAAgGAAAgA0AIBoAALMNACAfAACDDQAg7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhwwUCAPwMACHEBQEA_wkAIcUFAQCACgAhDwcAAKMNACAVAACgDQAgFwAAoQ0AIBgAAKINACAaAAC0DQAgHwAApQ0AIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABwgUBAAAAAcMFAgAAAAHEBQEAAAABxQUBAAAAAQ0HAAD-DQAgCgAA2Q8AIBUAAIAOACAXAACBDgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHOBQIAAAAB1AUBAAAAAfUFAQAAAAH2BQEAAAABAgAAACMAIE0AALARACADAAAAIwAgTQAAsBEAIE4AAK8RACABRgAAnxQAMAIAAAAjACBGAACvEQAgAgAAAOQNACBGAACuEQAgCewEAQD_CQAh8QQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHOBQIA_AwAIdQFAQCACgAh9QUBAP8JACH2BQEA_wkAIQ0HAADnDQAgCgAA1w8AIBUAAOkNACAXAADqDQAg7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIc4FAgD8DAAh1AUBAIAKACH1BQEA_wkAIfYFAQD_CQAhDQcAAP4NACAKAADZDwAgFQAAgA4AIBcAAIEOACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABwgUBAAAAAc4FAgAAAAHUBQEAAAAB9QUBAAAAAfYFAQAAAAEIBwAAuxEAIBkAAJMQACDsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAECAAAAgwEAIE0AALoRACADAAAAgwEAIE0AALoRACBOAAC4EQAgAUYAAJ4UADACAAAAgwEAIEYAALgRACACAAAAgxAAIEYAALcRACAG7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhCAcAALkRACAZAACHEAAg7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhBU0AAJkUACBOAACcFAAgoQYAAJoUACCiBgAAmxQAIKcGAACqBAAgCAcAALsRACAZAACTEAAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABA00AAJkUACChBgAAmhQAIKcGAACqBAAgDQcAAIQOACAUAACCDgAgFQAAgw4AIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGdBQEAAAABwgUBAAAAAcwFAQAAAAHNBUAAAAABzgUIAAAAAc8FCAAAAAECAAAAHwAgTQAAxBEAIAMAAAAfACBNAADEEQAgTgAAwxEAIAFGAACYFAAwAgAAAB8AIEYAAMMRACACAAAAnBAAIEYAAMIRACAK7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGdBQEA_wkAIcIFAQCACgAhzAUBAIAKACHNBUAAqAoAIc4FCACUCgAhzwUIAJQKACENBwAA0Q0AIBQAAM8NACAVAADQDQAg7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGdBQEA_wkAIcIFAQCACgAhzAUBAIAKACHNBUAAqAoAIc4FCACUCgAhzwUIAJQKACENBwAAhA4AIBQAAIIOACAVAACDDgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAZ0FAQAAAAHCBQEAAAABzAUBAAAAAc0FQAAAAAHOBQgAAAABzwUIAAAAARQVAADMEQAgFwAAzREAIBkAAMkRACAdAADTEQAgHgAA0hEAICgAAMYRACApAADHEQAgKgAAyBEAICsAAMoRACAsAADLEQAgLgAAzhEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHsBQEAAAAB8wUBAAAAAQRNAAC8EQAwoQYAAL0RADCjBgAAvxEAIKcGAACYEAAwBE0AALERADChBgAAshEAMKMGAAC0EQAgpwYAAP8PADAETQAAqBEAMKEGAACpEQAwowYAAKsRACCnBgAA4A0AMARNAACfEQAwoQYAAKARADCjBgAAohEAIKcGAAD2DAAwBE0AAJYRADChBgAAlxEAMKMGAACZEQAgpwYAALgPADAETQAAjREAMKEGAACOEQAwowYAAJARACCnBgAArA8AMARNAACEEQAwoQYAAIURADCjBgAAhxEAIKcGAAD0CgAwBE0AAPsQADChBgAA_BAAMKMGAAD-EAAgpwYAAOAKADAETQAA8hAAMKEGAADzEAAwowYAAPUQACCnBgAAoQoAMARNAADpEAAwoQYAAOoQADCjBgAA7BAAIKcGAAC5CgAwBE0AAOAQADChBgAA4RAAMKMGAADjEAAgpwYAAMkKADAETQAA1xAAMKEGAADYEAAwowYAANoQACCnBgAAjgoAMARNAADOEAAwoQYAAM8QADCjBgAA0RAAIKcGAADSDAAwBE0AAMUQADChBgAAxhAAMKMGAADIEAAgpwYAAO4LADAHMgAA1REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHsBQEAAAAB8wUBAAAAAQRNAACsEAAwoQYAAK0QADCjBgAArxAAIKcGAACwEAAwBE0AAKAQADChBgAAoRAAMKMGAACjEAAgpwYAAKQQADAETQAAlBAAMKEGAACVEAAwowYAAJcQACCnBgAAmBAAMARNAAD7DwAwoQYAAPwPADCjBgAA_g8AIKcGAAD_DwAwBE0AAOMPADChBgAA5A8AMKMGAADmDwAgpwYAAOcPADAETQAA2g8AMKEGAADbDwAwowYAAN0PACCnBgAA9gwAMARNAADPDwAwoQYAANAPADCjBgAA0g8AIKcGAADgDQAwBE0AAMAPADChBgAAwQ8AMKMGAADDDwAgpwYAAMQPADAETQAAtA8AMKEGAAC1DwAwowYAALcPACCnBgAAuA8AMARNAACoDwAwoQYAAKkPADCjBgAAqw8AIKcGAACsDwAwBE0AAJ8PADChBgAAoA8AMKMGAACiDwAgpwYAAPQKADAETQAAlg8AMKEGAACXDwAwowYAAJkPACCnBgAA4AoAMARNAACKDwAwoQYAAIsPADCjBgAAjQ8AIKcGAACODwAwBE0AAIEPADChBgAAgg8AMKMGAACEDwAgpwYAAKEKADAETQAA-A4AMKEGAAD5DgAwowYAAPsOACCnBgAAuQoAMARNAADvDgAwoQYAAPAOADCjBgAA8g4AIKcGAADJCgAwBE0AAOYOADChBgAA5w4AMKMGAADpDgAgpwYAAI4KADAETQAA3Q4AMKEGAADeDgAwowYAAOAOACCnBgAA0gwAMARNAADUDgAwoQYAANUOADCjBgAA1w4AIKcGAADuCwAwAAAAAAAAAAAAAAAAAAAAAAdNAACTFAAgTgAAlhQAIKEGAACUFAAgogYAAJUUACClBgAAFgAgpgYAABYAIKcGAACqBAAgA00AAJMUACChBgAAlBQAIKcGAACqBAAgAAAAB00AAI4UACBOAACRFAAgoQYAAI8UACCiBgAAkBQAIKUGAAASACCmBgAAEgAgpwYAABQAIANNAACOFAAgoQYAAI8UACCnBgAAFAAgAAAAAAAAAAAAAAAAAAVNAACJFAAgTgAAjBQAIKEGAACKFAAgogYAAIsUACCnBgAAqgQAIANNAACJFAAgoQYAAIoUACCnBgAAqgQAIAAAAAAAAAVNAACEFAAgTgAAhxQAIKEGAACFFAAgogYAAIYUACCnBgAApwIAIANNAACEFAAgoQYAAIUUACCnBgAApwIAIAAAAAAAAAVNAAD_EwAgTgAAghQAIKEGAACAFAAgogYAAIEUACCnBgAApwIAIANNAAD_EwAgoQYAAIAUACCnBgAApwIAIAAAAAVNAAD6EwAgTgAA_RMAIKEGAAD7EwAgogYAAPwTACCnBgAApwIAIANNAAD6EwAgoQYAAPsTACCnBgAApwIAIAAAAAtNAACpEwAwTgAArhMAMKEGAACqEwAwogYAAKsTADCjBgAArBMAIKQGAACtEwAwpQYAAK0TADCmBgAArRMAMKcGAACtEwAwqAYAAK8TADCpBgAAsBMAMAtNAACdEwAwTgAAohMAMKEGAACeEwAwogYAAJ8TADCjBgAAoBMAIKQGAAChEwAwpQYAAKETADCmBgAAoRMAMKcGAAChEwAwqAYAAKMTADCpBgAApBMAMAtNAACSEwAwTgAAlhMAMKEGAACTEwAwogYAAJQTADCjBgAAlRMAIKQGAADEDwAwpQYAAMQPADCmBgAAxA8AMKcGAADEDwAwqAYAAJcTADCpBgAAxw8AMAtNAACJEwAwTgAAjRMAMKEGAACKEwAwogYAAIsTADCjBgAAjBMAIKQGAAC4DwAwpQYAALgPADCmBgAAuA8AMKcGAAC4DwAwqAYAAI4TADCpBgAAuw8AMAtNAACAEwAwTgAAhBMAMKEGAACBEwAwogYAAIITADCjBgAAgxMAIKQGAACsDwAwpQYAAKwPADCmBgAArA8AMKcGAACsDwAwqAYAAIUTADCpBgAArw8AMAtNAAD3EgAwTgAA-xIAMKEGAAD4EgAwogYAAPkSADCjBgAA-hIAIKQGAACODwAwpQYAAI4PADCmBgAAjg8AMKcGAACODwAwqAYAAPwSADCpBgAAkQ8AMAtNAADuEgAwTgAA8hIAMKEGAADvEgAwogYAAPASADCjBgAA8RIAIKQGAACODwAwpQYAAI4PADCmBgAAjg8AMKcGAACODwAwqAYAAPMSADCpBgAAkQ8AMAtNAADlEgAwTgAA6RIAMKEGAADmEgAwogYAAOcSADCjBgAA6BIAIKQGAAChCgAwpQYAAKEKADCmBgAAoQoAMKcGAAChCgAwqAYAAOoSADCpBgAApAoAMAtNAADcEgAwTgAA4BIAMKEGAADdEgAwogYAAN4SADCjBgAA3xIAIKQGAAChCgAwpQYAAKEKADCmBgAAoQoAMKcGAAChCgAwqAYAAOESADCpBgAApAoAMAdNAADXEgAgTgAA2hIAIKEGAADYEgAgogYAANkSACClBgAA5gEAIKYGAADmAQAgpwYAAPgHACALTQAAzhIAME4AANISADChBgAAzxIAMKIGAADQEgAwowYAANESACCkBgAAhgwAMKUGAACGDAAwpgYAAIYMADCnBgAAhgwAMKgGAADTEgAwqQYAAIkMADALTQAAxRIAME4AAMkSADChBgAAxhIAMKIGAADHEgAwowYAAMgSACCkBgAAhgwAMKUGAACGDAAwpgYAAIYMADCnBgAAhgwAMKgGAADKEgAwqQYAAIkMADAHTQAAwBIAIE4AAMMSACChBgAAwRIAIKIGAADCEgAgpQYAAOoBACCmBgAA6gEAIKcGAACyBgAgC00AALQSADBOAAC5EgAwoQYAALUSADCiBgAAthIAMKMGAAC3EgAgpAYAALgSADClBgAAuBIAMKYGAAC4EgAwpwYAALgSADCoBgAAuhIAMKkGAAC7EgAwBewEAQAAAAH0BEAAAAAB9QRAAAAAAfwFAQAAAAH9BUAAAAABAgAAAO4BACBNAAC_EgAgAwAAAO4BACBNAAC_EgAgTgAAvhIAIAFGAAD5EwAwCgMAAL8IACDpBAAAtAkAMOoEAADsAQAQ6wQAALQJADDsBAEAAAAB8wQBAAAAAfQEQAC-CAAh9QRAAL4IACH8BQEAuggAIf0FQAC-CAAhAgAAAO4BACBGAAC-EgAgAgAAALwSACBGAAC9EgAgCekEAAC7EgAw6gQAALwSABDrBAAAuxIAMOwEAQC6CAAh8wQBALoIACH0BEAAvggAIfUEQAC-CAAh_AUBALoIACH9BUAAvggAIQnpBAAAuxIAMOoEAAC8EgAQ6wQAALsSADDsBAEAuggAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIfwFAQC6CAAh_QVAAL4IACEF7AQBAP8JACH0BEAAgQoAIfUEQACBCgAh_AUBAP8JACH9BUAAgQoAIQXsBAEA_wkAIfQEQACBCgAh9QRAAIEKACH8BQEA_wkAIf0FQACBCgAhBewEAQAAAAH0BEAAAAAB9QRAAAAAAfwFAQAAAAH9BUAAAAABCOwEAQAAAAH0BEAAAAAB9QRAAAAAAYIFAQAAAAGDBQEAAAABiAWAAAAAAYoFIAAAAAG7BQAAugwAIAIAAACyBgAgTQAAwBIAIAMAAADqAQAgTQAAwBIAIE4AAMQSACAKAAAA6gEAIEYAAMQSACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGCBQEA_wkAIYMFAQD_CQAhiAWAAAAAAYoFIADBCwAhuwUAALgMACAI7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhggUBAP8JACGDBQEA_wkAIYgFgAAAAAGKBSAAwQsAIbsFAAC4DAAgDhsAALQMACAkAACSDAAgJQAAkwwAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGiBQEAAAABpAUAAAC6BQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABugUBAAAAAQIAAABrACBNAADNEgAgAwAAAGsAIE0AAM0SACBOAADMEgAgAUYAAPgTADACAAAAawAgRgAAzBIAIAIAAACKDAAgRgAAyxIAIAvsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGYBQEAgAoAIaIFAQCACgAhpAUAAIwMugUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqAUBAP8JACG6BQEA_wkAIQ4bAACzDAAgJAAAjgwAICUAAI8MACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGYBQEAgAoAIaIFAQCACgAhpAUAAIwMugUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqAUBAP8JACG6BQEA_wkAIQ4bAAC0DAAgJAAAkgwAICUAAJMMACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABogUBAAAAAaQFAAAAugUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAboFAQAAAAEOGwAAtAwAICQAAJIMACAmAACUDAAg7AQBAAAAAfQEQAAAAAH1BEAAAAABmAUBAAAAAaIFAQAAAAGkBQAAALoFAqUFAQAAAAGmBUAAAAABpwVAAAAAAagFAQAAAAGpBQEAAAABAgAAAGsAIE0AANYSACADAAAAawAgTQAA1hIAIE4AANUSACABRgAA9xMAMAIAAABrACBGAADVEgAgAgAAAIoMACBGAADUEgAgC-wEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZgFAQCACgAhogUBAIAKACGkBQAAjAy6BSKlBQEAgAoAIaYFQACoCgAhpwVAAIEKACGoBQEA_wkAIakFAQCACgAhDhsAALMMACAkAACODAAgJgAAkAwAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZgFAQCACgAhogUBAIAKACGkBQAAjAy6BSKlBQEAgAoAIaYFQACoCgAhpwVAAIEKACGoBQEA_wkAIakFAQCACgAhDhsAALQMACAkAACSDAAgJgAAlAwAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGiBQEAAAABpAUAAAC6BQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABqQUBAAAAAQzsBAEAAAAB9ARAAAAAAfUEQAAAAAGCBQEAAAABgwUBAAAAAYQFAQAAAAGFBQEAAAABhgUAAMMLACCHBQAAxAsAIIgFgAAAAAGJBYAAAAABigUgAAAAAQIAAAD4BwAgTQAA1xIAIAMAAADmAQAgTQAA1xIAIE4AANsSACAOAAAA5gEAIEYAANsSACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGCBQEA_wkAIYMFAQD_CQAhhAUBAP8JACGFBQEAgAoAIYYFAAC_CwAghwUAAMALACCIBYAAAAABiQWAAAAAAYoFIADBCwAhDOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIYIFAQD_CQAhgwUBAP8JACGEBQEA_wkAIYUFAQCACgAhhgUAAL8LACCHBQAAwAsAIIgFgAAAAAGJBYAAAAABigUgAMELACESBwAAswoAIAkAALQKACASAADaCwAgJAAAsAoAIC0AALEKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGWBQEAAAABogUBAAAAAaQFAAAApAUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAQIAAACPAQAgTQAA5BIAIAMAAACPAQAgTQAA5BIAIE4AAOMSACABRgAA9hMAMAIAAACPAQAgRgAA4xIAIAIAAAClCgAgRgAA4hIAIA3sBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhgQUBAP8JACGWBQEAgAoAIaIFAQCACgAhpAUAAKcKpAUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqAUBAP8JACESBwAArQoAIAkAAK4KACASAADZCwAgJAAAqgoAIC0AAKsKACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhgQUBAP8JACGWBQEAgAoAIaIFAQCACgAhpAUAAKcKpAUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqAUBAP8JACESBwAAswoAIAkAALQKACASAADaCwAgJAAAsAoAIC0AALEKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGWBQEAAAABogUBAAAAAaQFAAAApAUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAARIHAACzCgAgCQAAtAoAIBIAANoLACAkAACwCgAgJgAAsgoAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlgUBAAAAAaIFAQAAAAGkBQAAAKQFAqUFAQAAAAGmBUAAAAABpwVAAAAAAagFAQAAAAGpBQEAAAABAgAAAI8BACBNAADtEgAgAwAAAI8BACBNAADtEgAgTgAA7BIAIAFGAAD1EwAwAgAAAI8BACBGAADsEgAgAgAAAKUKACBGAADrEgAgDewEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGWBQEAgAoAIaIFAQCACgAhpAUAAKcKpAUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqAUBAP8JACGpBQEAgAoAIRIHAACtCgAgCQAArgoAIBIAANkLACAkAACqCgAgJgAArAoAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGWBQEAgAoAIaIFAQCACgAhpAUAAKcKpAUipQUBAIAKACGmBUAAqAoAIacFQACBCgAhqAUBAP8JACGpBQEAgAoAIRIHAACzCgAgCQAAtAoAIBIAANoLACAkAACwCgAgJgAAsgoAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlgUBAAAAAaIFAQAAAAGkBQAAAKQFAqUFAQAAAAGmBUAAAAABpwVAAAAAAagFAQAAAAGpBQEAAAABDwcAAL4OACA1AAC8DgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA8QUCpgVAAAAAAcIFAQAAAAHqBQEAAAAB6wUBAAAAAewFAQAAAAHuBQAAAO4FA-8FAQAAAAHxBQEAAAABAgAAALsBACBNAAD2EgAgAwAAALsBACBNAAD2EgAgTgAA9RIAIAFGAAD0EwAwAgAAALsBACBGAAD1EgAgAgAAAJIPACBGAAD0EgAgDewEAQD_CQAh8QQBAIAKACH0BEAAgQoAIfUEQACBCgAhpAUAALgO8QUipgVAAKgKACHCBQEAgAoAIeoFAQD_CQAh6wUBAP8JACHsBQEAgAoAIe4FAAC3Du4FI-8FAQCACgAh8QUBAIAKACEPBwAAuw4AIDUAALkOACDsBAEA_wkAIfEEAQCACgAh9ARAAIEKACH1BEAAgQoAIaQFAAC4DvEFIqYFQACoCgAhwgUBAIAKACHqBQEA_wkAIesFAQD_CQAh7AUBAIAKACHuBQAAtw7uBSPvBQEAgAoAIfEFAQCACgAhDwcAAL4OACA1AAC8DgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA8QUCpgVAAAAAAcIFAQAAAAHqBQEAAAAB6wUBAAAAAewFAQAAAAHuBQAAAO4FA-8FAQAAAAHxBQEAAAABDwcAAL4OACA2AAC9DgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA8QUCpgVAAAAAAcIFAQAAAAHrBQEAAAAB7AUBAAAAAe4FAAAA7gUD7wUBAAAAAfEFAQAAAAHyBQEAAAABAgAAALsBACBNAAD_EgAgAwAAALsBACBNAAD_EgAgTgAA_hIAIAFGAADzEwAwAgAAALsBACBGAAD-EgAgAgAAAJIPACBGAAD9EgAgDewEAQD_CQAh8QQBAIAKACH0BEAAgQoAIfUEQACBCgAhpAUAALgO8QUipgVAAKgKACHCBQEAgAoAIesFAQD_CQAh7AUBAIAKACHuBQAAtw7uBSPvBQEAgAoAIfEFAQCACgAh8gUBAIAKACEPBwAAuw4AIDYAALoOACDsBAEA_wkAIfEEAQCACgAh9ARAAIEKACH1BEAAgQoAIaQFAAC4DvEFIqYFQACoCgAhwgUBAIAKACHrBQEA_wkAIewFAQCACgAh7gUAALcO7gUj7wUBAIAKACHxBQEAgAoAIfIFAQCACgAhDwcAAL4OACA2AAC9DgAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA8QUCpgVAAAAAAcIFAQAAAAHrBQEAAAAB7AUBAAAAAe4FAAAA7gUD7wUBAAAAAfEFAQAAAAHyBQEAAAABDQcAAKkMACAJAACqDAAgFQAArAwAIB0AAK8MACAiAACtDAAgJwAArgwAIOwEAQAAAAHwBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAbgFAQAAAAECAAAAiQEAIE0AAIgTACADAAAAiQEAIE0AAIgTACBOAACHEwAgAUYAAPITADACAAAAiQEAIEYAAIcTACACAAAAsA8AIEYAAIYTACAH7AQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhuAUBAP8JACENBwAA4wsAIAkAAOQLACAVAADmCwAgHQAA6QsAICIAAOcLACAnAADoCwAg7AQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhuAUBAP8JACENBwAAqQwAIAkAAKoMACAVAACsDAAgHQAArwwAICIAAK0MACAnAACuDAAg7AQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABuAUBAAAAARAHAAC0CwAgCQAAugsAIBUAALULACAXAAC2CwAgGAAAtwsAIDgAALgLACA5AAC5CwAg7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABAgAAABAAIE0AAJETACADAAAAEAAgTQAAkRMAIE4AAJATACABRgAA8RMAMAIAAAAQACBGAACQEwAgAgAAALwPACBGAACPEwAgCewEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIRAHAACCCgAgCQAAiAoAIBUAAIMKACAXAACECgAgGAAAhQoAIDgAAIYKACA5AACHCgAg7AQBAP8JACHtBAEA_wkAIe4EAQD_CQAh7wQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhEAcAALQLACAJAAC6CwAgFQAAtQsAIBcAALYLACAYAAC3CwAgOAAAuAsAIDkAALkLACDsBAEAAAAB7QQBAAAAAe4EAQAAAAHvBAEAAAAB8AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAEGBwAAnBMAIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGUBgAAAJkGAgIAAAABACBNAACbEwAgAwAAAAEAIE0AAJsTACBOAACZEwAgAUYAAPATADACAAAAAQAgRgAAmRMAIAIAAADIDwAgRgAAmBMAIAXsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZQGAADKD5kGIgYHAACaEwAg7AQBAP8JACHxBAEA_wkAIfQEQACBCgAh9QRAAIEKACGUBgAAyg-ZBiIFTQAA6xMAIE4AAO4TACChBgAA7BMAIKIGAADtEwAgpwYAAKoEACAGBwAAnBMAIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGUBgAAAJkGAgNNAADrEwAgoQYAAOwTACCnBgAAqgQAIAzsBAEAAAAB9ARAAAAAAfUEQAAAAAGABgEAAAABgQYBAAAAAYIGAQAAAAGDBgEAAAABhAYBAAAAAYUGQAAAAAGGBkAAAAABhwYBAAAAAYgGAQAAAAECAAAACQAgTQAAqBMAIAMAAAAJACBNAACoEwAgTgAApxMAIAFGAADqEwAwEQMAAL8IACDpBAAA-QkAMOoEAAAHABDrBAAA-QkAMOwEAQAAAAHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACGABgEAuggAIYEGAQC6CAAhggYBALsIACGDBgEAuwgAIYQGAQC7CAAhhQZAALcJACGGBkAAtwkAIYcGAQC7CAAhiAYBALsIACECAAAACQAgRgAApxMAIAIAAAClEwAgRgAAphMAIBDpBAAApBMAMOoEAAClEwAQ6wQAAKQTADDsBAEAuggAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIYAGAQC6CAAhgQYBALoIACGCBgEAuwgAIYMGAQC7CAAhhAYBALsIACGFBkAAtwkAIYYGQAC3CQAhhwYBALsIACGIBgEAuwgAIRDpBAAApBMAMOoEAAClEwAQ6wQAAKQTADDsBAEAuggAIfMEAQC6CAAh9ARAAL4IACH1BEAAvggAIYAGAQC6CAAhgQYBALoIACGCBgEAuwgAIYMGAQC7CAAhhAYBALsIACGFBkAAtwkAIYYGQAC3CQAhhwYBALsIACGIBgEAuwgAIQzsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGABgEA_wkAIYEGAQD_CQAhggYBAIAKACGDBgEAgAoAIYQGAQCACgAhhQZAAKgKACGGBkAAqAoAIYcGAQCACgAhiAYBAIAKACEM7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhgAYBAP8JACGBBgEA_wkAIYIGAQCACgAhgwYBAIAKACGEBgEAgAoAIYUGQACoCgAhhgZAAKgKACGHBgEAgAoAIYgGAQCACgAhDOwEAQAAAAH0BEAAAAAB9QRAAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAYMGAQAAAAGEBgEAAAABhQZAAAAAAYYGQAAAAAGHBgEAAAABiAYBAAAAAQfsBAEAAAAB9ARAAAAAAfUEQAAAAAH9BUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABAgAAAAUAIE0AALQTACADAAAABQAgTQAAtBMAIE4AALMTACABRgAA6RMAMAwDAAC_CAAg6QQAAPoJADDqBAAAAwAQ6wQAAPoJADDsBAEAAAAB8wQBALoIACH0BEAAvggAIfUEQAC-CAAh_QVAAL4IACGJBgEAAAABigYBALsIACGLBgEAuwgAIQIAAAAFACBGAACzEwAgAgAAALETACBGAACyEwAgC-kEAACwEwAw6gQAALETABDrBAAAsBMAMOwEAQC6CAAh8wQBALoIACH0BEAAvggAIfUEQAC-CAAh_QVAAL4IACGJBgEAuggAIYoGAQC7CAAhiwYBALsIACEL6QQAALATADDqBAAAsRMAEOsEAACwEwAw7AQBALoIACHzBAEAuggAIfQEQAC-CAAh9QRAAL4IACH9BUAAvggAIYkGAQC6CAAhigYBALsIACGLBgEAuwgAIQfsBAEA_wkAIfQEQACBCgAh9QRAAIEKACH9BUAAgQoAIYkGAQD_CQAhigYBAIAKACGLBgEAgAoAIQfsBAEA_wkAIfQEQACBCgAh9QRAAIEKACH9BUAAgQoAIYkGAQD_CQAhigYBAIAKACGLBgEAgAoAIQfsBAEAAAAB9ARAAAAAAfUEQAAAAAH9BUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABBE0AAKkTADChBgAAqhMAMKMGAACsEwAgpwYAAK0TADAETQAAnRMAMKEGAACeEwAwowYAAKATACCnBgAAoRMAMARNAACSEwAwoQYAAJMTADCjBgAAlRMAIKcGAADEDwAwBE0AAIkTADChBgAAihMAMKMGAACMEwAgpwYAALgPADAETQAAgBMAMKEGAACBEwAwowYAAIMTACCnBgAArA8AMARNAAD3EgAwoQYAAPgSADCjBgAA-hIAIKcGAACODwAwBE0AAO4SADChBgAA7xIAMKMGAADxEgAgpwYAAI4PADAETQAA5RIAMKEGAADmEgAwowYAAOgSACCnBgAAoQoAMARNAADcEgAwoQYAAN0SADCjBgAA3xIAIKcGAAChCgAwA00AANcSACChBgAA2BIAIKcGAAD4BwAgBE0AAM4SADChBgAAzxIAMKMGAADREgAgpwYAAIYMADAETQAAxRIAMKEGAADGEgAwowYAAMgSACCnBgAAhgwAMANNAADAEgAgoQYAAMESACCnBgAAsgYAIARNAAC0EgAwoQYAALUSADCjBgAAtxIAIKcGAAC4EgAwAAACLQAAxgsAIIUFAAD7CQAgASUAAMYLACAAAAAABU0AAOQTACBOAADnEwAgoQYAAOUTACCiBgAA5hMAIKcGAAAoACADTQAA5BMAIKEGAADlEwAgpwYAACgAIAAAABYGAADtEQAgFQAAqw0AIBcAAPARACAZAACqDQAgHQAArQ0AIB4AAKwNACAoAADpEQAgKQAA6hEAICoAAOwRACArAADuEQAgLAAA7xEAIC4AAKcOACAvAADyEQAgMAAA8xEAIDEAAPQRACAzAADoEQAgNAAA6xEAIDcAAPERACCgBQAA-wkAIMIFAAD7CQAg7AUAAPsJACDvBQAA-wkAIA0HAADQEwAgCQAA0xMAIAoAAOETACALAADGDQAgEQAA3xMAIBIAANITACATAADgEwAgFAAA2xMAIBYAANoTACAaAADXEwAgGwAA1hMAIPIEAAD7CQAg1AUAAPsJACAJAwAAxgsAIAcAANATACAJAADTEwAgFQAAqw0AIBcAAPARACAYAADyEQAgOAAApw4AIDkAAPQRACDwBAAA-wkAIBIIAADiEwAgFQAAqw0AIBcAAPARACAZAACqDQAgHQAArQ0AIB4AAKwNACAoAADpEQAgKQAA6hEAICoAAOwRACArAADuEQAgLAAA7xEAIC4AAKcOACAvAADyEQAgMAAA8xEAIDEAAPQRACDCBQAA-wkAINMFAAD7CQAg7AUAAPsJACAFIwAApw4AIPIEAAD7CQAg0AUAAPsJACDTBQAA-wkAINQFAAD7CQAgBSMAAJYOACDyBAAA-wkAINAFAAD7CQAg0wUAAPsJACDUBQAA-wkAIAkDAADGCwAgBwAA0BMAIAkAANMTACAVAACrDQAgHQAArQ0AICIAAPMRACAnAACWDgAg8AQAAPsJACDyBAAA-wkAIAQVAACrDQAgGQAAqg0AIB0AAK0NACAeAACsDQAgBAcAANATACAJAADTEwAgGgAA1xMAIB0AAK0NACAFBwAA0BMAIAkAANMTACAZAACqDQAg8gQAAPsJACDCBQAA-wkAIAsHAADQEwAgCQAA0xMAIBUAAKsNACAXAADwEQAgGAAA8hEAIBoAANcTACAfAADZEwAg8gQAAPsJACDCBQAA-wkAIMMFAAD7CQAgxQUAAPsJACAIBwAA0BMAIAkAANMTACAKAADhEwAgFQAAqw0AIBcAAPARACDCBQAA-wkAIM4FAAD7CQAg1AUAAPsJACAIBwAA0BMAIAkAANMTACASAADSEwAgFgAA2hMAICAAAPMRACDyBAAA-wkAIJ4FAAD7CQAgoQUAAPsJACACCwAAxg0AIMIFAAD7CQAgAwcAANATACAPAADGDQAgvAUAAPsJACAAEgcAANATACAJAADTEwAgDgAA0RMAIBIAANITACDyBAAA-wkAIKsFAAD7CQAgrAUAAPsJACCtBQAA-wkAIK4FAAD7CQAgrwUAAPsJACCwBQAA-wkAILEFAAD7CQAgsgUAAPsJACCzBQAA-wkAILQFAAD7CQAgtQUAAPsJACC2BQAA-wkAILcFAAD7CQAgCQcAANATACAJAADTEwAgFAAA7BEAIBUAAKsNACDCBQAA-wkAIMwFAAD7CQAgzQUAAPsJACDOBQAA-wkAIM8FAAD7CQAgBQcAANATACAyAADjEwAg8QQAAPsJACDCBQAA-wkAIOwFAAD7CQAgABYHAACzCwAgCQAAsAsAIAoAALELACALAACqCwAgEgAAqAwAIBMAAKwLACAUAACtCwAgFgAArwsAIBoAALILACAbAACuCwAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlQUBAAAAAZYFAQAAAAGYBQEAAAABxAUBAAAAAdQFAQAAAAH0BUAAAAABAgAAACgAIE0AAOQTACADAAAAJgAgTQAA5BMAIE4AAOgTACAYAAAAJgAgBwAAhAsAIAkAAIELACAKAACCCwAgCwAA-woAIBIAAKYMACATAAD9CgAgFAAA_goAIBYAAIALACAaAACDCwAgGwAA_woAIEYAAOgTACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGVBQEA_wkAIZYFAQD_CQAhmAUBAP8JACHEBQEA_wkAIdQFAQCACgAh9AVAAIEKACEWBwAAhAsAIAkAAIELACAKAACCCwAgCwAA-woAIBIAAKYMACATAAD9CgAgFAAA_goAIBYAAIALACAaAACDCwAgGwAA_woAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIQfsBAEAAAAB9ARAAAAAAfUEQAAAAAH9BUAAAAABiQYBAAAAAYoGAQAAAAGLBgEAAAABDOwEAQAAAAH0BEAAAAAB9QRAAAAAAYAGAQAAAAGBBgEAAAABggYBAAAAAYMGAQAAAAGEBgEAAAABhQZAAAAAAYYGQAAAAAGHBgEAAAABiAYBAAAAARkVAADfEQAgFwAA4BEAIBkAANoRACAdAADnEQAgHgAA5hEAICgAANcRACApAADYEQAgKgAA2xEAICsAAN0RACAsAADeEQAgLgAA4hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDMAANYRACA0AADZEQAgNwAA4REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAA6xMAIAMAAAAWACBNAADrEwAgTgAA7xMAIBsAAAAWACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIEYAAO8TACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIRkVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhBewEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGUBgAAAJkGAgnsBAEAAAAB7QQBAAAAAe4EAQAAAAHvBAEAAAAB8AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAEH7AQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABuAUBAAAAAQ3sBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAADxBQKmBUAAAAABwgUBAAAAAesFAQAAAAHsBQEAAAAB7gUAAADuBQPvBQEAAAAB8QUBAAAAAfIFAQAAAAEN7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA8QUCpgVAAAAAAcIFAQAAAAHqBQEAAAAB6wUBAAAAAewFAQAAAAHuBQAAAO4FA-8FAQAAAAHxBQEAAAABDewEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlgUBAAAAAaIFAQAAAAGkBQAAAKQFAqUFAQAAAAGmBUAAAAABpwVAAAAAAagFAQAAAAGpBQEAAAABDewEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABgQUBAAAAAZYFAQAAAAGiBQEAAAABpAUAAACkBQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABC-wEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGiBQEAAAABpAUAAAC6BQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABqQUBAAAAAQvsBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABogUBAAAAAaQFAAAAugUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAboFAQAAAAEF7AQBAAAAAfQEQAAAAAH1BEAAAAAB_AUBAAAAAf0FQAAAAAEcBQAAthMAIAYAALcTACASAAC4EwAgGwAAuRMAIC4AALwTACA3AAC6EwAgOgAAuxMAIDsAAL0TACA8AAC-EwAgPQAAvxMAID4AAMATACA_AADBEwAgQAAAwhMAIOwEAQAAAAHwBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABjAYBAAAAAY0GIAAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBgEAAAABkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAQIAAACnAgAgTQAA-hMAIAMAAABvACBNAAD6EwAgTgAA_hMAIB4AAABvACAFAACnEgAgBgAAqBIAIBIAAKkSACAbAACqEgAgLgAArRIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAgRgAA_hMAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIRwFAACnEgAgBgAAqBIAIBIAAKkSACAbAACqEgAgLgAArRIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhHAQAALUTACAGAAC3EwAgEgAAuBMAIBsAALkTACAuAAC8EwAgNwAAuhMAIDoAALsTACA7AAC9EwAgPAAAvhMAID0AAL8TACA-AADAEwAgPwAAwRMAIEAAAMITACDsBAEAAAAB8AQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAYwGAQAAAAGNBiAAAAABjgYBAAAAAY8GAQAAAAGQBgEAAAABkQYBAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAECAAAApwIAIE0AAP8TACADAAAAbwAgTQAA_xMAIE4AAIMUACAeAAAAbwAgBAAAphIAIAYAAKgSACASAACpEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIEYAAIMUACDsBAEA_wkAIfAEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhjAYBAP8JACGNBiAAwQsAIY4GAQCACgAhjwYBAIAKACGQBgEAgAoAIZEGAQCACgAhkgYBAIAKACGTBgEAgAoAIZQGAQD_CQAhlQYBAP8JACEcBAAAphIAIAYAAKgSACASAACpEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIRwEAAC1EwAgBQAAthMAIAYAALcTACASAAC4EwAgGwAAuRMAIC4AALwTACA3AAC6EwAgOgAAuxMAIDsAAL0TACA8AAC-EwAgPQAAvxMAID4AAMATACA_AADBEwAg7AQBAAAAAfAEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAGMBgEAAAABjQYgAAAAAY4GAQAAAAGPBgEAAAABkAYBAAAAAZEGAQAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABAgAAAKcCACBNAACEFAAgAwAAAG8AIE0AAIQUACBOAACIFAAgHgAAAG8AIAQAAKYSACAFAACnEgAgBgAAqBIAIBIAAKkSACAbAACqEgAgLgAArRIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBGAACIFAAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhHAQAAKYSACAFAACnEgAgBgAAqBIAIBIAAKkSACAbAACqEgAgLgAArRIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACDsBAEA_wkAIfAEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhjAYBAP8JACGNBiAAwQsAIY4GAQCACgAhjwYBAIAKACGQBgEAgAoAIZEGAQCACgAhkgYBAIAKACGTBgEAgAoAIZQGAQD_CQAhlQYBAP8JACEZBgAA3BEAIBUAAN8RACAXAADgEQAgGQAA2hEAIB0AAOcRACAeAADmEQAgKAAA1xEAICkAANgRACAqAADbEQAgKwAA3REAICwAAN4RACAuAADiEQAgLwAA4xEAIDAAAOQRACAxAADlEQAgMwAA1hEAIDcAAOERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGgBQAAAO4FA7wFAQAAAAHCBQEAAAAB7AUBAAAAAe8FAQAAAAECAAAAqgQAIE0AAIkUACADAAAAFgAgTQAAiRQAIE4AAI0UACAbAAAAFgAgBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDcAAM0OACBGAACNFAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEZBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDcAAM0OACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIQgHAAD5EQAg7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHsBQEAAAAB8wUBAAAAAQIAAAAUACBNAACOFAAgAwAAABIAIE0AAI4UACBOAACSFAAgCgAAABIAIAcAAPgRACBGAACSFAAg7AQBAP8JACHxBAEAgAoAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIewFAQCACgAh8wUBAP8JACEIBwAA-BEAIOwEAQD_CQAh8QQBAIAKACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHsBQEAgAoAIfMFAQD_CQAhGQYAANwRACAVAADfEQAgFwAA4BEAIBkAANoRACAdAADnEQAgHgAA5hEAICgAANcRACApAADYEQAgKgAA2xEAICsAAN0RACAsAADeEQAgLgAA4hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDQAANkRACA3AADhEQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABoAUAAADuBQO8BQEAAAABwgUBAAAAAewFAQAAAAHvBQEAAAABAgAAAKoEACBNAACTFAAgAwAAABYAIE0AAJMUACBOAACXFAAgGwAAABYAIAYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDQAAMUOACA3AADNDgAgRgAAlxQAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhGQYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDQAAMUOACA3AADNDgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEK7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAZ0FAQAAAAHCBQEAAAABzAUBAAAAAc0FQAAAAAHOBQgAAAABzwUIAAAAARkGAADcEQAgFQAA3xEAIBcAAOARACAZAADaEQAgHQAA5xEAIB4AAOYRACAoAADXEQAgKgAA2xEAICsAAN0RACAsAADeEQAgLgAA4hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDMAANYRACA0AADZEQAgNwAA4REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAAmRQAIAMAAAAWACBNAACZFAAgTgAAnRQAIBsAAAAWACAGAADIDgAgFQAAyw4AIBcAAMwOACAZAADGDgAgHQAA0w4AIB4AANIOACAoAADDDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIEYAAJ0UACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIRkGAADIDgAgFQAAyw4AIBcAAMwOACAZAADGDgAgHQAA0w4AIB4AANIOACAoAADDDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhBuwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABwgUBAAAAAQnsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABwgUBAAAAAc4FAgAAAAHUBQEAAAAB9QUBAAAAAfYFAQAAAAEJ7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABwwUCAAAAAcQFAQAAAAHFBQEAAAABCewEAQAAAAHtBAEAAAAB7gQBAAAAAe8EAQAAAAHwBAEAAAAB8QQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAQfsBAEAAAAB8AQBAAAAAfEEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAG4BQEAAAABC-wEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlQUBAAAAAZYFAQAAAAGYBQEAAAABxAUBAAAAAdQFAQAAAAH0BUAAAAABB-wEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlQUBAAAAAZYFAQAAAAEN7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAYEFAQAAAAGWBQEAAAABogUBAAAAAaQFAAAApAUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAakFAQAAAAEK7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABnQUBAAAAAZ4FAQAAAAGgBQAAAKAFAqEFQAAAAAEK7AQBAAAAAfEEAQAAAAH0BEAAAAAB9QRAAAAAAZcFAQAAAAGYBQEAAAABmQUBAAAAAZoFAQAAAAGbBQEAAAABnAVAAAAAARPsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABlgUBAAAAAaoFAQAAAAGrBQgAAAABrAUIAAAAAa0FCAAAAAGuBQgAAAABrwUIAAAAAbAFCAAAAAGxBQgAAAABsgUIAAAAAbMFCAAAAAG0BQgAAAABtQUIAAAAAbYFCAAAAAG3BQgAAAABCewEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAHEBQEAAAAB3AUBAAAAAecFEAAAAAHoBRAAAAAB6QUgAAAAARbsBAEAAAAB8QQBAAAAAfQEQAAAAAH1BEAAAAABmAUBAAAAAaQFAAAA2gUCxAUBAAAAAdYFAQAAAAHYBQAAANgFAtoFAgAAAAHbBRAAAAAB3AUBAAAAAd0FAQAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBYAAAAAB5QVAAAAAAeYFQAAAAAEG7AQBAAAAAfQEQAAAAAH1BEAAAAABwgUBAAAAAewFAQAAAAHzBQEAAAABBuwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHsBQEAAAAB8wUBAAAAAQrsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABnQUBAAAAAcIFAQAAAAHMBQEAAAABzQVAAAAAAc4FCAAAAAHPBQgAAAABFQgAAP4RACAVAADMEQAgFwAAzREAIBkAAMkRACAdAADTEQAgHgAA0hEAICgAAMYRACAqAADIEQAgKwAAyhEAICwAAMsRACAuAADOEQAgLwAAzxEAIDAAANARACAxAADREQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABwgUBAAAAAdMFAQAAAAHsBQEAAAAB8wUBAAAAAQIAAAAaACBNAACuFAAgCewEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHDBQIAAAABxAUBAAAAAQMAAAAYACBNAACuFAAgTgAAsxQAIBcAAAAYACAIAAD9EQAgFQAAvRAAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKgAAuRAAICsAALsQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgMQAAwhAAIEYAALMUACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIRUIAAD9EQAgFQAAvRAAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKgAAuRAAICsAALsQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgMQAAwhAAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhBuwEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABwgUBAAAAAQjsBAEAAAAB9ARAAAAAAfUEQAAAAAGqBQEAAAABvAUBAAAAAcIFAQAAAAHJBQEAAAABygUBAAAAAQjsBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQIAAAAB-wUAAAD7BQIJ7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABwwUCAAAAAcQFAQAAAAHFBQEAAAABDgcAAIQOACAJAACFDgAgFQAAgw4AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABnQUBAAAAAcIFAQAAAAHMBQEAAAABzQVAAAAAAc4FCAAAAAHPBQgAAAABAgAAAB8AIE0AALgUACADAAAAHQAgTQAAuBQAIE4AALwUACAQAAAAHQAgBwAA0Q0AIAkAANINACAVAADQDQAgRgAAvBQAIOwEAQD_CQAh8QQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACGdBQEA_wkAIcIFAQCACgAhzAUBAIAKACHNBUAAqAoAIc4FCACUCgAhzwUIAJQKACEOBwAA0Q0AIAkAANINACAVAADQDQAg7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIZ0FAQD_CQAhwgUBAIAKACHMBQEAgAoAIc0FQACoCgAhzgUIAJQKACHPBQgAlAoAIQnsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABwgUBAAAAAc4FAgAAAAHUBQEAAAAB9QUBAAAAAfYFAQAAAAEcBAAAtRMAIAUAALYTACASAAC4EwAgGwAAuRMAIC4AALwTACA3AAC6EwAgOgAAuxMAIDsAAL0TACA8AAC-EwAgPQAAvxMAID4AAMATACA_AADBEwAgQAAAwhMAIOwEAQAAAAHwBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABjAYBAAAAAY0GIAAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBgEAAAABkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAQIAAACnAgAgTQAAvhQAIAMAAABvACBNAAC-FAAgTgAAwhQAIB4AAABvACAEAACmEgAgBQAApxIAIBIAAKkSACAbAACqEgAgLgAArRIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAgRgAAwhQAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIRwEAACmEgAgBQAApxIAIBIAAKkSACAbAACqEgAgLgAArRIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhBewEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAGUBgAAAJkGAgnsBAEAAAAB7QQBAAAAAe4EAQAAAAHvBAEAAAAB8AQBAAAAAfIEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAEH7AQBAAAAAfAEAQAAAAHyBAEAAAAB8wQBAAAAAfQEQAAAAAH1BEAAAAABuAUBAAAAAQvsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQfsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABDewEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA8QUCpgVAAAAAAcIFAQAAAAHqBQEAAAAB6wUBAAAAAewFAQAAAAHuBQAAAO4FA-8FAQAAAAHxBQEAAAAB8gUBAAAAAQ3sBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABgQUBAAAAAZYFAQAAAAGiBQEAAAABpAUAAACkBQKlBQEAAAABpgVAAAAAAacFQAAAAAGoBQEAAAABqQUBAAAAAQrsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZYFAQAAAAGdBQEAAAABngUBAAAAAaAFAAAAoAUCoQVAAAAAAQrsBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlwUBAAAAAZgFAQAAAAGZBQEAAAABmgUBAAAAAZsFAQAAAAGcBUAAAAABE-wEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGWBQEAAAABqgUBAAAAAasFCAAAAAGsBQgAAAABrQUIAAAAAa4FCAAAAAGvBQgAAAABsAUIAAAAAbEFCAAAAAGyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIAAAAAbcFCAAAAAEJ7AQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAcQFAQAAAAHcBQEAAAAB5wUQAAAAAegFEAAAAAHpBSAAAAABFuwEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABpAUAAADaBQLEBQEAAAAB1gUBAAAAAdgFAAAA2AUC2gUCAAAAAdsFEAAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAHfBQEAAAAB4AUBAAAAAeEFAQAAAAHiBQEAAAAB4wUBAAAAAeQFgAAAAAHlBUAAAAAB5gVAAAAAARkGAADcEQAgFQAA3xEAIBcAAOARACAZAADaEQAgHQAA5xEAIB4AAOYRACAoAADXEQAgKQAA2BEAICoAANsRACArAADdEQAgLAAA3hEAIC4AAOIRACAvAADjEQAgMAAA5BEAIDEAAOURACAzAADWEQAgNAAA2REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAAzxQAIBwEAAC1EwAgBQAAthMAIAYAALcTACASAAC4EwAgGwAAuRMAIC4AALwTACA3AAC6EwAgOwAAvRMAIDwAAL4TACA9AAC_EwAgPgAAwBMAID8AAMETACBAAADCEwAg7AQBAAAAAfAEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAGMBgEAAAABjQYgAAAAAY4GAQAAAAGPBgEAAAABkAYBAAAAAZEGAQAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABAgAAAKcCACBNAADRFAAgHAQAALUTACAFAAC2EwAgBgAAtxMAIBIAALgTACAbAAC5EwAgLgAAvBMAIDoAALsTACA7AAC9EwAgPAAAvhMAID0AAL8TACA-AADAEwAgPwAAwRMAIEAAAMITACDsBAEAAAAB8AQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAYwGAQAAAAGNBiAAAAABjgYBAAAAAY8GAQAAAAGQBgEAAAABkQYBAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAECAAAApwIAIE0AANMUACADAAAAFgAgTQAAzxQAIE4AANcUACAbAAAAFgAgBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACBGAADXFAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEZBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIQMAAABvACBNAADRFAAgTgAA2hQAIB4AAABvACAEAACmEgAgBQAApxIAIAYAAKgSACASAACpEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAgRgAA2hQAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIRwEAACmEgAgBQAApxIAIAYAAKgSACASAACpEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhAwAAAG8AIE0AANMUACBOAADdFAAgHgAAAG8AIAQAAKYSACAFAACnEgAgBgAAqBIAIBIAAKkSACAbAACqEgAgLgAArRIAIDoAAKwSACA7AACuEgAgPAAArxIAID0AALASACA-AACxEgAgPwAAshIAIEAAALMSACBGAADdFAAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhHAQAAKYSACAFAACnEgAgBgAAqBIAIBIAAKkSACAbAACqEgAgLgAArRIAIDoAAKwSACA7AACuEgAgPAAArxIAID0AALASACA-AACxEgAgPwAAshIAIEAAALMSACDsBAEA_wkAIfAEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhjAYBAP8JACGNBiAAwQsAIY4GAQCACgAhjwYBAIAKACGQBgEAgAoAIZEGAQCACgAhkgYBAIAKACGTBgEAgAoAIZQGAQD_CQAhlQYBAP8JACEIFQAApw0AIBkAAKYNACAdAACpDQAg7AQBAAAAAfEEAQAAAAG8BQEAAAABvQVAAAAAAb4FQAAAAAECAAAAmQYAIE0AAN4UACADAAAAnAYAIE0AAN4UACBOAADiFAAgCgAAAJwGACAVAADADAAgGQAAvwwAIB0AAMIMACBGAADiFAAg7AQBAP8JACHxBAEA_wkAIbwFAQD_CQAhvQVAAIEKACG-BUAAgQoAIQgVAADADAAgGQAAvwwAIB0AAMIMACDsBAEA_wkAIfEEAQD_CQAhvAUBAP8JACG9BUAAgQoAIb4FQACBCgAhDewEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABgQUBAAAAAZYFAQAAAAGiBQEAAAABpAUAAACkBQKlBQEAAAABpgVAAAAAAacFQAAAAAGpBQEAAAABC-wEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGiBQEAAAABpAUAAAC6BQKlBQEAAAABpgVAAAAAAacFQAAAAAGpBQEAAAABugUBAAAAARUIAAD-EQAgFQAAzBEAIBcAAM0RACAZAADJEQAgHQAA0xEAIB4AANIRACApAADHEQAgKgAAyBEAICsAAMoRACAsAADLEQAgLgAAzhEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHTBQEAAAAB7AUBAAAAAfMFAQAAAAECAAAAGgAgTQAA5RQAIBkGAADcEQAgFQAA3xEAIBcAAOARACAZAADaEQAgHQAA5xEAIB4AAOYRACApAADYEQAgKgAA2xEAICsAAN0RACAsAADeEQAgLgAA4hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDMAANYRACA0AADZEQAgNwAA4REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAA5xQAIBUIAAD-EQAgFQAAzBEAIBcAAM0RACAZAADJEQAgHQAA0xEAIB4AANIRACAoAADGEQAgKQAAxxEAICsAAMoRACAsAADLEQAgLgAAzhEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHTBQEAAAAB7AUBAAAAAfMFAQAAAAECAAAAGgAgTQAA6RQAIBkGAADcEQAgFQAA3xEAIBcAAOARACAZAADaEQAgHQAA5xEAIB4AAOYRACAoAADXEQAgKQAA2BEAICsAAN0RACAsAADeEQAgLgAA4hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDMAANYRACA0AADZEQAgNwAA4REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAA6xQAIAvsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQfsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABAwAAABgAIE0AAOkUACBOAADxFAAgFwAAABgAIAgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAdAADEEAAgHgAAwxAAICgAALcQACApAAC4EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAgRgAA8RQAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhFQgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAdAADEEAAgHgAAwxAAICgAALcQACApAAC4EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEDAAAAFgAgTQAA6xQAIE4AAPQUACAbAAAAFgAgBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACArAADJDgAgLAAAyg4AIC4AAM4OACAvAADPDgAgMAAA0A4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACBGAAD0FAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEZBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACArAADJDgAgLAAAyg4AIC4AAM4OACAvAADPDgAgMAAA0A4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIQnsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHOBQIAAAAB9QUBAAAAAfYFAQAAAAEL7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlQUBAAAAAZYFAQAAAAGYBQEAAAABxAUBAAAAAfQFQAAAAAEDAAAAGAAgTQAA5RQAIE4AAPkUACAXAAAAGAAgCAAA_REAIBUAAL0QACAXAAC-EAAgGQAAuhAAIB0AAMQQACAeAADDEAAgKQAAuBAAICoAALkQACArAAC7EAAgLAAAvBAAIC4AAL8QACAvAADAEAAgMAAAwRAAIDEAAMIQACBGAAD5FAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEVCAAA_REAIBUAAL0QACAXAAC-EAAgGQAAuhAAIB0AAMQQACAeAADDEAAgKQAAuBAAICoAALkQACArAAC7EAAgLAAAvBAAIC4AAL8QACAvAADAEAAgMAAAwRAAIDEAAMIQACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIQMAAAAWACBNAADnFAAgTgAA_BQAIBsAAAAWACAGAADIDgAgFQAAyw4AIBcAAMwOACAZAADGDgAgHQAA0w4AIB4AANIOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIEYAAPwUACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIRkGAADIDgAgFQAAyw4AIBcAAMwOACAZAADGDgAgHQAA0w4AIB4AANIOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLgAAzg4AIC8AAM8OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhFgcAALMLACAJAACwCwAgCgAAsQsAIBEAAKsLACASAACoDAAgEwAArAsAIBQAAK0LACAWAACvCwAgGgAAsgsAIBsAAK4LACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGVBQEAAAABlgUBAAAAAZgFAQAAAAHEBQEAAAAB1AUBAAAAAfQFQAAAAAECAAAAKAAgTQAA_RQAIAMAAAAmACBNAAD9FAAgTgAAgRUAIBgAAAAmACAHAACECwAgCQAAgQsAIAoAAIILACARAAD8CgAgEgAApgwAIBMAAP0KACAUAAD-CgAgFgAAgAsAIBoAAIMLACAbAAD_CgAgRgAAgRUAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIRYHAACECwAgCQAAgQsAIAoAAIILACARAAD8CgAgEgAApgwAIBMAAP0KACAUAAD-CgAgFgAAgAsAIBoAAIMLACAbAAD_CgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlQUBAP8JACGWBQEA_wkAIZgFAQD_CQAhxAUBAP8JACHUBQEAgAoAIfQFQACBCgAhCOwEAQAAAAH0BEAAAAAB9QRAAAAAAaoFAQAAAAG8BQEAAAABwgUBAAAAAckFAQAAAAHLBQEAAAABCBUAAKcNACAdAACpDQAgHgAAqA0AIOwEAQAAAAHxBAEAAAABvAUBAAAAAb0FQAAAAAG-BUAAAAABAgAAAJkGACBNAACDFQAgAwAAAJwGACBNAACDFQAgTgAAhxUAIAoAAACcBgAgFQAAwAwAIB0AAMIMACAeAADBDAAgRgAAhxUAIOwEAQD_CQAh8QQBAP8JACG8BQEA_wkAIb0FQACBCgAhvgVAAIEKACEIFQAAwAwAIB0AAMIMACAeAADBDAAg7AQBAP8JACHxBAEA_wkAIbwFAQD_CQAhvQVAAIEKACG-BUAAgQoAIQkHAAC7EQAgCQAAkhAAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAECAAAAgwEAIE0AAIgVACAVCAAA_hEAIBUAAMwRACAXAADNEQAgHQAA0xEAIB4AANIRACAoAADGEQAgKQAAxxEAICoAAMgRACArAADKEQAgLAAAyxEAIC4AAM4RACAvAADPEQAgMAAA0BEAIDEAANERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAAB0wUBAAAAAewFAQAAAAHzBQEAAAABAgAAABoAIE0AAIoVACAZBgAA3BEAIBUAAN8RACAXAADgEQAgHQAA5xEAIB4AAOYRACAoAADXEQAgKQAA2BEAICoAANsRACArAADdEQAgLAAA3hEAIC4AAOIRACAvAADjEQAgMAAA5BEAIDEAAOURACAzAADWEQAgNAAA2REAIDcAAOERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGgBQAAAO4FA7wFAQAAAAHCBQEAAAAB7AUBAAAAAe8FAQAAAAECAAAAqgQAIE0AAIwVACAL7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGVBQEAAAABlgUBAAAAAZgFAQAAAAHEBQEAAAAB1AUBAAAAAfQFQAAAAAEH7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGVBQEAAAABlgUBAAAAAQrsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZYFAQAAAAGdBQEAAAABngUBAAAAAaAFAAAAoAUCoQVAAAAAAQMAAABdACBNAACIFQAgTgAAkxUAIAsAAABdACAHAAC5EQAgCQAAhhAAIEYAAJMVACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACHCBQEAgAoAIQkHAAC5EQAgCQAAhhAAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhAwAAABgAIE0AAIoVACBOAACWFQAgFwAAABgAIAgAAP0RACAVAAC9EAAgFwAAvhAAIB0AAMQQACAeAADDEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAgRgAAlhUAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhFQgAAP0RACAVAAC9EAAgFwAAvhAAIB0AAMQQACAeAADDEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEDAAAAFgAgTQAAjBUAIE4AAJkVACAbAAAAFgAgBgAAyA4AIBUAAMsOACAXAADMDgAgHQAA0w4AIB4AANIOACAoAADDDgAgKQAAxA4AICoAAMcOACArAADJDgAgLAAAyg4AIC4AAM4OACAvAADPDgAgMAAA0A4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACBGAACZFQAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEZBgAAyA4AIBUAAMsOACAXAADMDgAgHQAA0w4AIB4AANIOACAoAADDDgAgKQAAxA4AICoAAMcOACArAADJDgAgLAAAyg4AIC4AAM4OACAvAADPDgAgMAAA0A4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIQnsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAABwwUCAAAAAcUFAQAAAAEL7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGUBQEAAAABlQUBAAAAAZYFAQAAAAGYBQEAAAAB1AUBAAAAAfQFQAAAAAEVCAAA_hEAIBUAAMwRACAXAADNEQAgGQAAyREAIB0AANMRACAoAADGEQAgKQAAxxEAICoAAMgRACArAADKEQAgLAAAyxEAIC4AAM4RACAvAADPEQAgMAAA0BEAIDEAANERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAAB0wUBAAAAAewFAQAAAAHzBQEAAAABAgAAABoAIE0AAJwVACAZBgAA3BEAIBUAAN8RACAXAADgEQAgGQAA2hEAIB0AAOcRACAoAADXEQAgKQAA2BEAICoAANsRACArAADdEQAgLAAA3hEAIC4AAOIRACAvAADjEQAgMAAA5BEAIDEAAOURACAzAADWEQAgNAAA2REAIDcAAOERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGgBQAAAO4FA7wFAQAAAAHCBQEAAAAB7AUBAAAAAe8FAQAAAAECAAAAqgQAIE0AAJ4VACAW7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGYBQEAAAABpAUAAADaBQLEBQEAAAAB2AUAAADYBQLaBQIAAAAB2wUQAAAAAdwFAQAAAAHdBQEAAAAB3gUBAAAAAd8FAQAAAAHgBQEAAAAB4QUBAAAAAeIFAQAAAAHjBQEAAAAB5AWAAAAAAeUFQAAAAAHmBUAAAAABAwAAABgAIE0AAJwVACBOAACjFQAgFwAAABgAIAgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAdAADEEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAgRgAAoxUAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhFQgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAdAADEEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEDAAAAFgAgTQAAnhUAIE4AAKYVACAbAAAAFgAgBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAoAADDDgAgKQAAxA4AICoAAMcOACArAADJDgAgLAAAyg4AIC4AAM4OACAvAADPDgAgMAAA0A4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACBGAACmFQAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEZBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAoAADDDgAgKQAAxA4AICoAAMcOACArAADJDgAgLAAAyg4AIC4AAM4OACAvAADPDgAgMAAA0A4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIQnsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAdwFAQAAAAHnBRAAAAAB6AUQAAAAAekFIAAAAAEOAwAAqwwAIAcAAKkMACAJAACqDAAgFQAArAwAICIAAK0MACAnAACuDAAg7AQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAbgFAQAAAAECAAAAiQEAIE0AAKgVACADAAAAcQAgTQAAqBUAIE4AAKwVACAQAAAAcQAgAwAA5QsAIAcAAOMLACAJAADkCwAgFQAA5gsAICIAAOcLACAnAADoCwAgRgAArBUAIOwEAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQCACgAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhuAUBAP8JACEOAwAA5QsAIAcAAOMLACAJAADkCwAgFQAA5gsAICIAAOcLACAnAADoCwAg7AQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAIAKACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACG4BQEA_wkAIRbsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZgFAQAAAAGkBQAAANoFAtYFAQAAAAHYBQAAANgFAtoFAgAAAAHbBRAAAAAB3AUBAAAAAd0FAQAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBYAAAAAB5QVAAAAAAeYFQAAAAAEcBAAAtRMAIAUAALYTACAGAAC3EwAgEgAAuBMAIBsAALkTACAuAAC8EwAgNwAAuhMAIDoAALsTACA7AAC9EwAgPAAAvhMAID0AAL8TACA-AADAEwAgQAAAwhMAIOwEAQAAAAHwBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABjAYBAAAAAY0GIAAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBgEAAAABkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAQIAAACnAgAgTQAArhUAIAMAAABvACBNAACuFQAgTgAAshUAIB4AAABvACAEAACmEgAgBQAApxIAIAYAAKgSACASAACpEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPQAAsBIAID4AALESACBAAACzEgAgRgAAshUAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIRwEAACmEgAgBQAApxIAIAYAAKgSACASAACpEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPQAAsBIAID4AALESACBAAACzEgAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhDgMAAKsMACAHAACpDAAgCQAAqgwAIBUAAKwMACAdAACvDAAgIgAArQwAIOwEAQAAAAHwBAEAAAAB8QQBAAAAAfIEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAG4BQEAAAABAgAAAIkBACBNAACzFQAgAwAAAHEAIE0AALMVACBOAAC3FQAgEAAAAHEAIAMAAOULACAHAADjCwAgCQAA5AsAIBUAAOYLACAdAADpCwAgIgAA5wsAIEYAALcVACDsBAEA_wkAIfAEAQCACgAh8QQBAP8JACHyBAEAgAoAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbgFAQD_CQAhDgMAAOULACAHAADjCwAgCQAA5AsAIBUAAOYLACAdAADpCwAgIgAA5wsAIOwEAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQCACgAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhuAUBAP8JACEcBAAAtRMAIAUAALYTACAGAAC3EwAgEgAAuBMAIC4AALwTACA3AAC6EwAgOgAAuxMAIDsAAL0TACA8AAC-EwAgPQAAvxMAID4AAMATACA_AADBEwAgQAAAwhMAIOwEAQAAAAHwBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABjAYBAAAAAY0GIAAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBgEAAAABkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAQIAAACnAgAgTQAAuBUAIBUIAAD-EQAgFQAAzBEAIBcAAM0RACAZAADJEQAgHQAA0xEAIB4AANIRACAoAADGEQAgKQAAxxEAICoAAMgRACArAADKEQAgLgAAzhEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHTBQEAAAAB7AUBAAAAAfMFAQAAAAECAAAAGgAgTQAAuhUAIBkGAADcEQAgFQAA3xEAIBcAAOARACAZAADaEQAgHQAA5xEAIB4AAOYRACAoAADXEQAgKQAA2BEAICoAANsRACArAADdEQAgLgAA4hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDMAANYRACA0AADZEQAgNwAA4REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAAvBUAIBEDAAC7CwAgBwAAtAsAIAkAALoLACAXAAC2CwAgGAAAtwsAIDgAALgLACA5AAC5CwAg7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAQIAAAAQACBNAAC-FQAgAwAAAA4AIE0AAL4VACBOAADCFQAgEwAAAA4AIAMAAIkKACAHAACCCgAgCQAAiAoAIBcAAIQKACAYAACFCgAgOAAAhgoAIDkAAIcKACBGAADCFQAg7AQBAP8JACHtBAEA_wkAIe4EAQD_CQAh7wQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACERAwAAiQoAIAcAAIIKACAJAACICgAgFwAAhAoAIBgAAIUKACA4AACGCgAgOQAAhwoAIOwEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhC-wEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABxAUBAAAAAdQFAQAAAAH0BUAAAAABCuwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlwUBAAAAAZkFAQAAAAGaBQEAAAABmwUBAAAAAZwFQAAAAAEcBAAAtRMAIAUAALYTACAGAAC3EwAgEgAAuBMAIBsAALkTACAuAAC8EwAgNwAAuhMAIDoAALsTACA7AAC9EwAgPAAAvhMAID0AAL8TACA_AADBEwAgQAAAwhMAIOwEAQAAAAHwBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABjAYBAAAAAY0GIAAAAAGOBgEAAAABjwYBAAAAAZAGAQAAAAGRBgEAAAABkgYBAAAAAZMGAQAAAAGUBgEAAAABlQYBAAAAAQIAAACnAgAgTQAAxRUAIBwEAAC1EwAgBQAAthMAIAYAALcTACASAAC4EwAgGwAAuRMAIC4AALwTACA3AAC6EwAgOgAAuxMAIDsAAL0TACA8AAC-EwAgPgAAwBMAID8AAMETACBAAADCEwAg7AQBAAAAAfAEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAGMBgEAAAABjQYgAAAAAY4GAQAAAAGPBgEAAAABkAYBAAAAAZEGAQAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABAgAAAKcCACBNAADHFQAgDOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABnQUBAAAAAdAFAQAAAAHRBQEAAAAB0gUAAJQOACDTBQEAAAAB1AUBAAAAAdUFAQAAAAECAAAAoQUAIE0AAMkVACADAAAAbwAgTQAAxRUAIE4AAM0VACAeAAAAbwAgBAAAphIAIAUAAKcSACAGAACoEgAgEgAAqRIAIBsAAKoSACAuAACtEgAgNwAAqxIAIDoAAKwSACA7AACuEgAgPAAArxIAID0AALASACA_AACyEgAgQAAAsxIAIEYAAM0VACDsBAEA_wkAIfAEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhjAYBAP8JACGNBiAAwQsAIY4GAQCACgAhjwYBAIAKACGQBgEAgAoAIZEGAQCACgAhkgYBAIAKACGTBgEAgAoAIZQGAQD_CQAhlQYBAP8JACEcBAAAphIAIAUAAKcSACAGAACoEgAgEgAAqRIAIBsAAKoSACAuAACtEgAgNwAAqxIAIDoAAKwSACA7AACuEgAgPAAArxIAID0AALASACA_AACyEgAgQAAAsxIAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIQMAAABvACBNAADHFQAgTgAA0BUAIB4AAABvACAEAACmEgAgBQAApxIAIAYAAKgSACASAACpEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPgAAsRIAID8AALISACBAAACzEgAgRgAA0BUAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIRwEAACmEgAgBQAApxIAIAYAAKgSACASAACpEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPgAAsRIAID8AALISACBAAACzEgAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhAwAAAKQFACBNAADJFQAgTgAA0xUAIA4AAACkBQAgRgAA0xUAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGdBQEA_wkAIdAFAQCACgAh0QUBAP8JACHSBQAAiQ4AINMFAQCACgAh1AUBAIAKACHVBQEA_wkAIQzsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhnQUBAP8JACHQBQEAgAoAIdEFAQD_CQAh0gUAAIkOACDTBQEAgAoAIdQFAQCACgAh1QUBAP8JACEL7AQBAAAAAfQEQAAAAAH1BEAAAAABogUBAAAAAaQFAAAAugUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAakFAQAAAAG6BQEAAAABDQcAAOYMACAJAADnDAAgGgAAsw4AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABxAUBAAAAAdwFAQAAAAHnBRAAAAAB6AUQAAAAAekFIAAAAAECAAAAUQAgTQAA1RUAIAgVAACnDQAgGQAApg0AIB4AAKgNACDsBAEAAAAB8QQBAAAAAbwFAQAAAAG9BUAAAAABvgVAAAAAAQIAAACZBgAgTQAA1xUAIBUIAAD-EQAgFQAAzBEAIBcAAM0RACAZAADJEQAgHgAA0hEAICgAAMYRACApAADHEQAgKgAAyBEAICsAAMoRACAsAADLEQAgLgAAzhEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHTBQEAAAAB7AUBAAAAAfMFAQAAAAECAAAAGgAgTQAA2RUAIBkGAADcEQAgFQAA3xEAIBcAAOARACAZAADaEQAgHgAA5hEAICgAANcRACApAADYEQAgKgAA2xEAICsAAN0RACAsAADeEQAgLgAA4hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDMAANYRACA0AADZEQAgNwAA4REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAA2xUAIAMAAABPACBNAADVFQAgTgAA3xUAIA8AAABPACAHAADZDAAgCQAA2gwAIBoAALIOACBGAADfFQAg7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcQFAQD_CQAh3AUBAP8JACHnBRAA9wsAIegFEAD3CwAh6QUgAMELACENBwAA2QwAIAkAANoMACAaAACyDgAg7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcQFAQD_CQAh3AUBAP8JACHnBRAA9wsAIegFEAD3CwAh6QUgAMELACEDAAAAnAYAIE0AANcVACBOAADiFQAgCgAAAJwGACAVAADADAAgGQAAvwwAIB4AAMEMACBGAADiFQAg7AQBAP8JACHxBAEA_wkAIbwFAQD_CQAhvQVAAIEKACG-BUAAgQoAIQgVAADADAAgGQAAvwwAIB4AAMEMACDsBAEA_wkAIfEEAQD_CQAhvAUBAP8JACG9BUAAgQoAIb4FQACBCgAhAwAAABgAIE0AANkVACBOAADlFQAgFwAAABgAIAgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAeAADDEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAgRgAA5RUAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhFQgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAeAADDEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgLwAAwBAAIDAAAMEQACAxAADCEAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEDAAAAFgAgTQAA2xUAIE4AAOgVACAbAAAAFgAgBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB4AANIOACAoAADDDgAgKQAAxA4AICoAAMcOACArAADJDgAgLAAAyg4AIC4AAM4OACAvAADPDgAgMAAA0A4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACBGAADoFQAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEZBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB4AANIOACAoAADDDgAgKQAAxA4AICoAAMcOACArAADJDgAgLAAAyg4AIC4AAM4OACAvAADPDgAgMAAA0A4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIRbsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAA2gUCxAUBAAAAAdYFAQAAAAHYBQAAANgFAtoFAgAAAAHbBRAAAAAB3AUBAAAAAd0FAQAAAAHeBQEAAAAB3wUBAAAAAeAFAQAAAAHhBQEAAAAB4gUBAAAAAeMFAQAAAAHkBYAAAAAB5QVAAAAAAeYFQAAAAAEDAAAAbwAgTQAAuBUAIE4AAOwVACAeAAAAbwAgBAAAphIAIAUAAKcSACAGAACoEgAgEgAAqRIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIEYAAOwVACDsBAEA_wkAIfAEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhjAYBAP8JACGNBiAAwQsAIY4GAQCACgAhjwYBAIAKACGQBgEAgAoAIZEGAQCACgAhkgYBAIAKACGTBgEAgAoAIZQGAQD_CQAhlQYBAP8JACEcBAAAphIAIAUAAKcSACAGAACoEgAgEgAAqRIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIQMAAAAYACBNAAC6FQAgTgAA7xUAIBcAAAAYACAIAAD9EQAgFQAAvRAAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKQAAuBAAICoAALkQACArAAC7EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgMQAAwhAAIEYAAO8VACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIRUIAAD9EQAgFQAAvRAAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKQAAuBAAICoAALkQACArAAC7EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgMQAAwhAAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhAwAAABYAIE0AALwVACBOAADyFQAgGwAAABYAIAYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAgRgAA8hUAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhGQYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACERAwAAuwsAIAcAALQLACAJAAC6CwAgFQAAtQsAIBcAALYLACAYAAC3CwAgOQAAuQsAIOwEAQAAAAHtBAEAAAAB7gQBAAAAAe8EAQAAAAHwBAEAAAAB8QQBAAAAAfIEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAECAAAAEAAgTQAA8xUAIAMAAAAOACBNAADzFQAgTgAA9xUAIBMAAAAOACADAACJCgAgBwAAggoAIAkAAIgKACAVAACDCgAgFwAAhAoAIBgAAIUKACA5AACHCgAgRgAA9xUAIOwEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhEQMAAIkKACAHAACCCgAgCQAAiAoAIBUAAIMKACAXAACECgAgGAAAhQoAIDkAAIcKACDsBAEA_wkAIe0EAQD_CQAh7gQBAP8JACHvBAEA_wkAIfAEAQCACgAh8QQBAP8JACHyBAEA_wkAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIREDAAC7CwAgBwAAtAsAIAkAALoLACAVAAC1CwAgFwAAtgsAIDgAALgLACA5AAC5CwAg7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAQIAAAAQACBNAAD4FQAgAwAAAA4AIE0AAPgVACBOAAD8FQAgEwAAAA4AIAMAAIkKACAHAACCCgAgCQAAiAoAIBUAAIMKACAXAACECgAgOAAAhgoAIDkAAIcKACBGAAD8FQAg7AQBAP8JACHtBAEA_wkAIe4EAQD_CQAh7wQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACERAwAAiQoAIAcAAIIKACAJAACICgAgFQAAgwoAIBcAAIQKACA4AACGCgAgOQAAhwoAIOwEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhDwcAANkKACAJAADaCgAgEgAA1QsAIBYAANgKACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGWBQEAAAABnQUBAAAAAZ4FAQAAAAGgBQAAAKAFAqEFQAAAAAECAAAARwAgTQAA_RUAIAMAAABFACBNAAD9FQAgTgAAgRYAIBEAAABFACAHAADCCgAgCQAAwwoAIBIAANQLACAWAADBCgAgRgAAgRYAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZYFAQD_CQAhnQUBAP8JACGeBQEAgAoAIaAFAAC_CqAFIqEFQACoCgAhDwcAAMIKACAJAADDCgAgEgAA1AsAIBYAAMEKACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhlAUBAP8JACGWBQEA_wkAIZ0FAQD_CQAhngUBAIAKACGgBQAAvwqgBSKhBUAAqAoAIREDAAC7CwAgBwAAtAsAIAkAALoLACAVAAC1CwAgGAAAtwsAIDgAALgLACA5AAC5CwAg7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAQIAAAAQACBNAACCFgAgAwAAAA4AIE0AAIIWACBOAACGFgAgEwAAAA4AIAMAAIkKACAHAACCCgAgCQAAiAoAIBUAAIMKACAYAACFCgAgOAAAhgoAIDkAAIcKACBGAACGFgAg7AQBAP8JACHtBAEA_wkAIe4EAQD_CQAh7wQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACERAwAAiQoAIAcAAIIKACAJAACICgAgFQAAgwoAIBgAAIUKACA4AACGCgAgOQAAhwoAIOwEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhHAQAALUTACAFAAC2EwAgBgAAtxMAIBIAALgTACAbAAC5EwAgLgAAvBMAIDcAALoTACA6AAC7EwAgOwAAvRMAID0AAL8TACA-AADAEwAgPwAAwRMAIEAAAMITACDsBAEAAAAB8AQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAYwGAQAAAAGNBiAAAAABjgYBAAAAAY8GAQAAAAGQBgEAAAABkQYBAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAECAAAApwIAIE0AAIcWACADAAAAbwAgTQAAhxYAIE4AAIsWACAeAAAAbwAgBAAAphIAIAUAAKcSACAGAACoEgAgEgAAqRIAIBsAAKoSACAuAACtEgAgNwAAqxIAIDoAAKwSACA7AACuEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIEYAAIsWACDsBAEA_wkAIfAEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhjAYBAP8JACGNBiAAwQsAIY4GAQCACgAhjwYBAIAKACGQBgEAgAoAIZEGAQCACgAhkgYBAIAKACGTBgEAgAoAIZQGAQD_CQAhlQYBAP8JACEcBAAAphIAIAUAAKcSACAGAACoEgAgEgAAqRIAIBsAAKoSACAuAACtEgAgNwAAqxIAIDoAAKwSACA7AACuEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIRwEAAC1EwAgBQAAthMAIAYAALcTACAbAAC5EwAgLgAAvBMAIDcAALoTACA6AAC7EwAgOwAAvRMAIDwAAL4TACA9AAC_EwAgPgAAwBMAID8AAMETACBAAADCEwAg7AQBAAAAAfAEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAGMBgEAAAABjQYgAAAAAY4GAQAAAAGPBgEAAAABkAYBAAAAAZEGAQAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABAgAAAKcCACBNAACMFgAgFQgAAP4RACAVAADMEQAgFwAAzREAIBkAAMkRACAdAADTEQAgHgAA0hEAICgAAMYRACApAADHEQAgKgAAyBEAICwAAMsRACAuAADOEQAgLwAAzxEAIDAAANARACAxAADREQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABwgUBAAAAAdMFAQAAAAHsBQEAAAAB8wUBAAAAAQIAAAAaACBNAACOFgAgGQYAANwRACAVAADfEQAgFwAA4BEAIBkAANoRACAdAADnEQAgHgAA5hEAICgAANcRACApAADYEQAgKgAA2xEAICwAAN4RACAuAADiEQAgLwAA4xEAIDAAAOQRACAxAADlEQAgMwAA1hEAIDQAANkRACA3AADhEQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABoAUAAADuBQO8BQEAAAABwgUBAAAAAewFAQAAAAHvBQEAAAABAgAAAKoEACBNAACQFgAgGQYAANwRACAXAADgEQAgGQAA2hEAIB0AAOcRACAeAADmEQAgKAAA1xEAICkAANgRACAqAADbEQAgKwAA3REAICwAAN4RACAuAADiEQAgLwAA4xEAIDAAAOQRACAxAADlEQAgMwAA1hEAIDQAANkRACA3AADhEQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABoAUAAADuBQO8BQEAAAABwgUBAAAAAewFAQAAAAHvBQEAAAABAgAAAKoEACBNAACSFgAgCBkAAKYNACAdAACpDQAgHgAAqA0AIOwEAQAAAAHxBAEAAAABvAUBAAAAAb0FQAAAAAG-BUAAAAABAgAAAJkGACBNAACUFgAgDgcAAIQOACAJAACFDgAgFAAAgg4AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABnQUBAAAAAcIFAQAAAAHMBQEAAAABzQVAAAAAAc4FCAAAAAHPBQgAAAABAgAAAB8AIE0AAJYWACAVCAAA_hEAIBcAAM0RACAZAADJEQAgHQAA0xEAIB4AANIRACAoAADGEQAgKQAAxxEAICoAAMgRACArAADKEQAgLAAAyxEAIC4AAM4RACAvAADPEQAgMAAA0BEAIDEAANERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAAB0wUBAAAAAewFAQAAAAHzBQEAAAABAgAAABoAIE0AAJgWACAQBwAAow0AIAkAAKQNACAXAAChDQAgGAAAog0AIBoAALQNACAfAAClDQAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABwgUBAAAAAcMFAgAAAAHEBQEAAAABxQUBAAAAAQIAAABMACBNAACaFgAgDgMAAKsMACAHAACpDAAgCQAAqgwAIB0AAK8MACAiAACtDAAgJwAArgwAIOwEAQAAAAHwBAEAAAAB8QQBAAAAAfIEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAG4BQEAAAABAgAAAIkBACBNAACcFgAgDgcAAP4NACAJAAD_DQAgCgAA2Q8AIBcAAIEOACDsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHOBQIAAAAB1AUBAAAAAfUFAQAAAAH2BQEAAAABAgAAACMAIE0AAJ4WACAKBwAAjRIAIOwEAQAAAAHxBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAAB9wUBAAAAAfgFAQAAAAH5BQIAAAAB-wUAAAD7BQICAAAAsAEAIE0AAKAWACAI7AQBAAAAAfQEQAAAAAH1BEAAAAABpAUAAADJBQK8BQEAAAABwgUBAAAAAcYFQAAAAAHHBUAAAAABAgAAAOYFACBNAACiFgAgAwAAAK4BACBNAACgFgAgTgAAphYAIAwAAACuAQAgBwAAjBIAIEYAAKYWACDsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbwFAQCACgAh9wUBAP8JACH4BQEA_wkAIfkFAgD2CwAh-wUAAO0P-wUiCgcAAIwSACDsBAEA_wkAIfEEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbwFAQCACgAh9wUBAP8JACH4BQEA_wkAIfkFAgD2CwAh-wUAAO0P-wUiAwAAAOkFACBNAACiFgAgTgAAqRYAIAoAAADpBQAgRgAAqRYAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaQFAAC4DckFIrwFAQD_CQAhwgUBAIAKACHGBUAAgQoAIccFQACBCgAhCOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaQFAAC4DckFIrwFAQD_CQAhwgUBAIAKACHGBUAAgQoAIccFQACBCgAhCOwEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAHCBQEAAAAByQUBAAAAAcoFAQAAAAHLBQEAAAABBewEAQAAAAH0BEAAAAAB9QRAAAAAAaQFAAAAmAYClgZAAAAAAREDAAC7CwAgBwAAtAsAIAkAALoLACAVAAC1CwAgFwAAtgsAIBgAALcLACA4AAC4CwAg7AQBAAAAAe0EAQAAAAHuBAEAAAAB7wQBAAAAAfAEAQAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH0BEAAAAAB9QRAAAAAAQIAAAAQACBNAACsFgAgAwAAAA4AIE0AAKwWACBOAACwFgAgEwAAAA4AIAMAAIkKACAHAACCCgAgCQAAiAoAIBUAAIMKACAXAACECgAgGAAAhQoAIDgAAIYKACBGAACwFgAg7AQBAP8JACHtBAEA_wkAIe4EAQD_CQAh7wQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAP8JACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACERAwAAiQoAIAcAAIIKACAJAACICgAgFQAAgwoAIBcAAIQKACAYAACFCgAgOAAAhgoAIOwEAQD_CQAh7QQBAP8JACHuBAEA_wkAIe8EAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQD_CQAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhAwAAABYAIE0AAJIWACBOAACzFgAgGwAAABYAIAYAAMgOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAgRgAAsxYAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhGQYAAMgOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEDAAAAnAYAIE0AAJQWACBOAAC2FgAgCgAAAJwGACAZAAC_DAAgHQAAwgwAIB4AAMEMACBGAAC2FgAg7AQBAP8JACHxBAEA_wkAIbwFAQD_CQAhvQVAAIEKACG-BUAAgQoAIQgZAAC_DAAgHQAAwgwAIB4AAMEMACDsBAEA_wkAIfEEAQD_CQAhvAUBAP8JACG9BUAAgQoAIb4FQACBCgAhAwAAAB0AIE0AAJYWACBOAAC5FgAgEAAAAB0AIAcAANENACAJAADSDQAgFAAAzw0AIEYAALkWACDsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhnQUBAP8JACHCBQEAgAoAIcwFAQCACgAhzQVAAKgKACHOBQgAlAoAIc8FCACUCgAhDgcAANENACAJAADSDQAgFAAAzw0AIOwEAQD_CQAh8QQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACGdBQEA_wkAIcIFAQCACgAhzAUBAIAKACHNBUAAqAoAIc4FCACUCgAhzwUIAJQKACEDAAAAGAAgTQAAmBYAIE4AALwWACAXAAAAGAAgCAAA_REAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKQAAuBAAICoAALkQACArAAC7EAAgLAAAvBAAIC4AAL8QACAvAADAEAAgMAAAwRAAIDEAAMIQACBGAAC8FgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEVCAAA_REAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKQAAuBAAICoAALkQACArAAC7EAAgLAAAvBAAIC4AAL8QACAvAADAEAAgMAAAwRAAIDEAAMIQACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIQMAAABKACBNAACaFgAgTgAAvxYAIBIAAABKACAHAACBDQAgCQAAgg0AIBcAAP8MACAYAACADQAgGgAAsw0AIB8AAIMNACBGAAC_FgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACHDBQIA_AwAIcQFAQD_CQAhxQUBAIAKACEQBwAAgQ0AIAkAAIINACAXAAD_DAAgGAAAgA0AIBoAALMNACAfAACDDQAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhwgUBAIAKACHDBQIA_AwAIcQFAQD_CQAhxQUBAIAKACEDAAAAcQAgTQAAnBYAIE4AAMIWACAQAAAAcQAgAwAA5QsAIAcAAOMLACAJAADkCwAgHQAA6QsAICIAAOcLACAnAADoCwAgRgAAwhYAIOwEAQD_CQAh8AQBAIAKACHxBAEA_wkAIfIEAQCACgAh8wQBAP8JACH0BEAAgQoAIfUEQACBCgAhuAUBAP8JACEOAwAA5QsAIAcAAOMLACAJAADkCwAgHQAA6QsAICIAAOcLACAnAADoCwAg7AQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAIAKACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACG4BQEA_wkAIQMAAAAhACBNAACeFgAgTgAAxRYAIBAAAAAhACAHAADnDQAgCQAA6A0AIAoAANcPACAXAADqDQAgRgAAxRYAIOwEAQD_CQAh8QQBAP8JACHyBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIc4FAgD8DAAh1AUBAIAKACH1BQEA_wkAIfYFAQD_CQAhDgcAAOcNACAJAADoDQAgCgAA1w8AIBcAAOoNACDsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHOBQIA_AwAIdQFAQCACgAh9QUBAP8JACH2BQEA_wkAIQvsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGVBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAARUIAAD-EQAgFQAAzBEAIBkAAMkRACAdAADTEQAgHgAA0hEAICgAAMYRACApAADHEQAgKgAAyBEAICsAAMoRACAsAADLEQAgLgAAzhEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHTBQEAAAAB7AUBAAAAAfMFAQAAAAECAAAAGgAgTQAAxxYAIBkGAADcEQAgFQAA3xEAIBkAANoRACAdAADnEQAgHgAA5hEAICgAANcRACApAADYEQAgKgAA2xEAICsAAN0RACAsAADeEQAgLgAA4hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDMAANYRACA0AADZEQAgNwAA4REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAAyRYAIA4HAAD-DQAgCQAA_w0AIAoAANkPACAVAACADgAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAABzgUCAAAAAdQFAQAAAAH1BQEAAAAB9gUBAAAAAQIAAAAjACBNAADLFgAgEAcAAKMNACAJAACkDQAgFQAAoA0AIBgAAKINACAaAAC0DQAgHwAApQ0AIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAcIFAQAAAAHDBQIAAAABxAUBAAAAAcUFAQAAAAECAAAATAAgTQAAzRYAIAMAAAAYACBNAADHFgAgTgAA0RYAIBcAAAAYACAIAAD9EQAgFQAAvRAAIBkAALoQACAdAADEEAAgHgAAwxAAICgAALcQACApAAC4EAAgKgAAuRAAICsAALsQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgMQAAwhAAIEYAANEWACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIRUIAAD9EQAgFQAAvRAAIBkAALoQACAdAADEEAAgHgAAwxAAICgAALcQACApAAC4EAAgKgAAuRAAICsAALsQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgMQAAwhAAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhAwAAABYAIE0AAMkWACBOAADUFgAgGwAAABYAIAYAAMgOACAVAADLDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAgRgAA1BYAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhGQYAAMgOACAVAADLDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEDAAAAIQAgTQAAyxYAIE4AANcWACAQAAAAIQAgBwAA5w0AIAkAAOgNACAKAADXDwAgFQAA6Q0AIEYAANcWACDsBAEA_wkAIfEEAQD_CQAh8gQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHOBQIA_AwAIdQFAQCACgAh9QUBAP8JACH2BQEA_wkAIQ4HAADnDQAgCQAA6A0AIAoAANcPACAVAADpDQAg7AQBAP8JACHxBAEA_wkAIfIEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAhzgUCAPwMACHUBQEAgAoAIfUFAQD_CQAh9gUBAP8JACEDAAAASgAgTQAAzRYAIE4AANoWACASAAAASgAgBwAAgQ0AIAkAAIINACAVAAD-DAAgGAAAgA0AIBoAALMNACAfAACDDQAgRgAA2hYAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhwwUCAPwMACHEBQEA_wkAIcUFAQCACgAhEAcAAIENACAJAACCDQAgFQAA_gwAIBgAAIANACAaAACzDQAgHwAAgw0AIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIcIFAQCACgAhwwUCAPwMACHEBQEA_wkAIcUFAQCACgAhB-wEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAEVCAAA_hEAIBUAAMwRACAXAADNEQAgGQAAyREAIB0AANMRACAeAADSEQAgKAAAxhEAICkAAMcRACAqAADIEQAgKwAAyhEAICwAAMsRACAuAADOEQAgMAAA0BEAIDEAANERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAAB0wUBAAAAAewFAQAAAAHzBQEAAAABAgAAABoAIE0AANwWACAZBgAA3BEAIBUAAN8RACAXAADgEQAgGQAA2hEAIB0AAOcRACAeAADmEQAgKAAA1xEAICkAANgRACAqAADbEQAgKwAA3REAICwAAN4RACAuAADiEQAgMAAA5BEAIDEAAOURACAzAADWEQAgNAAA2REAIDcAAOERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGgBQAAAO4FA7wFAQAAAAHCBQEAAAAB7AUBAAAAAe8FAQAAAAECAAAAqgQAIE0AAN4WACAQBwAAow0AIAkAAKQNACAVAACgDQAgFwAAoQ0AIBoAALQNACAfAAClDQAg7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAG8BQEAAAABwgUBAAAAAcMFAgAAAAHEBQEAAAABxQUBAAAAAQIAAABMACBNAADgFgAgFQgAAP4RACAVAADMEQAgFwAAzREAIBkAAMkRACAdAADTEQAgHgAA0hEAICgAAMYRACApAADHEQAgKgAAyBEAICsAAMoRACAsAADLEQAgLgAAzhEAIC8AAM8RACAxAADREQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABwgUBAAAAAdMFAQAAAAHsBQEAAAAB8wUBAAAAAQIAAAAaACBNAADiFgAgGQYAANwRACAVAADfEQAgFwAA4BEAIBkAANoRACAdAADnEQAgHgAA5hEAICgAANcRACApAADYEQAgKgAA2xEAICsAAN0RACAsAADeEQAgLgAA4hEAIC8AAOMRACAxAADlEQAgMwAA1hEAIDQAANkRACA3AADhEQAg7AQBAAAAAfQEQAAAAAH1BEAAAAABoAUAAADuBQO8BQEAAAABwgUBAAAAAewFAQAAAAHvBQEAAAABAgAAAKoEACBNAADkFgAgDgMAAKsMACAHAACpDAAgCQAAqgwAIBUAAKwMACAdAACvDAAgJwAArgwAIOwEAQAAAAHwBAEAAAAB8QQBAAAAAfIEAQAAAAHzBAEAAAAB9ARAAAAAAfUEQAAAAAG4BQEAAAABAgAAAIkBACBNAADmFgAgAwAAABgAIE0AAOIWACBOAADqFgAgFwAAABgAIAgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAdAADEEAAgHgAAwxAAICgAALcQACApAAC4EAAgKgAAuRAAICsAALsQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAxAADCEAAgRgAA6hYAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhFQgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAdAADEEAAgHgAAwxAAICgAALcQACApAAC4EAAgKgAAuRAAICsAALsQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAxAADCEAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEDAAAAFgAgTQAA5BYAIE4AAO0WACAbAAAAFgAgBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACBGAADtFgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEZBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDEAANEOACAzAADCDgAgNAAAxQ4AIDcAAM0OACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIQMAAABxACBNAADmFgAgTgAA8BYAIBAAAABxACADAADlCwAgBwAA4wsAIAkAAOQLACAVAADmCwAgHQAA6QsAICcAAOgLACBGAADwFgAg7AQBAP8JACHwBAEAgAoAIfEEAQD_CQAh8gQBAIAKACHzBAEA_wkAIfQEQACBCgAh9QRAAIEKACG4BQEA_wkAIQ4DAADlCwAgBwAA4wsAIAkAAOQLACAVAADmCwAgHQAA6QsAICcAAOgLACDsBAEA_wkAIfAEAQCACgAh8QQBAP8JACHyBAEAgAoAIfMEAQD_CQAh9ARAAIEKACH1BEAAgQoAIbgFAQD_CQAhCuwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABmAUBAAAAAZkFAQAAAAGaBQEAAAABmwUBAAAAAZwFQAAAAAEDAAAAGAAgTQAA3BYAIE4AAPQWACAXAAAAGAAgCAAA_REAIBUAAL0QACAXAAC-EAAgGQAAuhAAIB0AAMQQACAeAADDEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgMAAAwRAAIDEAAMIQACBGAAD0FgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEVCAAA_REAIBUAAL0QACAXAAC-EAAgGQAAuhAAIB0AAMQQACAeAADDEAAgKAAAtxAAICkAALgQACAqAAC5EAAgKwAAuxAAICwAALwQACAuAAC_EAAgMAAAwRAAIDEAAMIQACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIQMAAAAWACBNAADeFgAgTgAA9xYAIBsAAAAWACAGAADIDgAgFQAAyw4AIBcAAMwOACAZAADGDgAgHQAA0w4AIB4AANIOACAoAADDDgAgKQAAxA4AICoAAMcOACArAADJDgAgLAAAyg4AIC4AAM4OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIEYAAPcWACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIRkGAADIDgAgFQAAyw4AIBcAAMwOACAZAADGDgAgHQAA0w4AIB4AANIOACAoAADDDgAgKQAAxA4AICoAAMcOACArAADJDgAgLAAAyg4AIC4AAM4OACAwAADQDgAgMQAA0Q4AIDMAAMIOACA0AADFDgAgNwAAzQ4AIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhAwAAAEoAIE0AAOAWACBOAAD6FgAgEgAAAEoAIAcAAIENACAJAACCDQAgFQAA_gwAIBcAAP8MACAaAACzDQAgHwAAgw0AIEYAAPoWACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACHCBQEAgAoAIcMFAgD8DAAhxAUBAP8JACHFBQEAgAoAIRAHAACBDQAgCQAAgg0AIBUAAP4MACAXAAD_DAAgGgAAsw0AIB8AAIMNACDsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACHCBQEAgAoAIcMFAgD8DAAhxAUBAP8JACHFBQEAgAoAIQrsBAEAAAAB8QQBAAAAAfIEAQAAAAH0BEAAAAAB9QRAAAAAAZQFAQAAAAGdBQEAAAABngUBAAAAAaAFAAAAoAUCoQVAAAAAARUIAAD-EQAgFQAAzBEAIBcAAM0RACAZAADJEQAgHQAA0xEAIB4AANIRACAoAADGEQAgKQAAxxEAICoAAMgRACArAADKEQAgLAAAyxEAIC8AAM8RACAwAADQEQAgMQAA0REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAcIFAQAAAAHTBQEAAAAB7AUBAAAAAfMFAQAAAAECAAAAGgAgTQAA_BYAIBkGAADcEQAgFQAA3xEAIBcAAOARACAZAADaEQAgHQAA5xEAIB4AAOYRACAoAADXEQAgKQAA2BEAICoAANsRACArAADdEQAgLAAA3hEAIC8AAOMRACAwAADkEQAgMQAA5REAIDMAANYRACA0AADZEQAgNwAA4REAIOwEAQAAAAH0BEAAAAAB9QRAAAAAAaAFAAAA7gUDvAUBAAAAAcIFAQAAAAHsBQEAAAAB7wUBAAAAAQIAAACqBAAgTQAA_hYAIBwEAAC1EwAgBQAAthMAIAYAALcTACASAAC4EwAgGwAAuRMAIC4AALwTACA3AAC6EwAgOgAAuxMAIDwAAL4TACA9AAC_EwAgPgAAwBMAID8AAMETACBAAADCEwAg7AQBAAAAAfAEAQAAAAH0BEAAAAAB9QRAAAAAAbwFAQAAAAGMBgEAAAABjQYgAAAAAY4GAQAAAAGPBgEAAAABkAYBAAAAAZEGAQAAAAGSBgEAAAABkwYBAAAAAZQGAQAAAAGVBgEAAAABAgAAAKcCACBNAACAFwAgHAQAALUTACAFAAC2EwAgBgAAtxMAIBIAALgTACAbAAC5EwAgNwAAuhMAIDoAALsTACA7AAC9EwAgPAAAvhMAID0AAL8TACA-AADAEwAgPwAAwRMAIEAAAMITACDsBAEAAAAB8AQBAAAAAfQEQAAAAAH1BEAAAAABvAUBAAAAAYwGAQAAAAGNBiAAAAABjgYBAAAAAY8GAQAAAAGQBgEAAAABkQYBAAAAAZIGAQAAAAGTBgEAAAABlAYBAAAAAZUGAQAAAAECAAAApwIAIE0AAIIXACAM7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGdBQEAAAAB0AUBAAAAAdEFAQAAAAHSBQAApQ4AINMFAQAAAAHUBQEAAAAB1QUBAAAAAQIAAACIBQAgTQAAhBcAIAMAAAAYACBNAAD8FgAgTgAAiBcAIBcAAAAYACAIAAD9EQAgFQAAvRAAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKQAAuBAAICoAALkQACArAAC7EAAgLAAAvBAAIC8AAMAQACAwAADBEAAgMQAAwhAAIEYAAIgXACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIRUIAAD9EQAgFQAAvRAAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKQAAuBAAICoAALkQACArAAC7EAAgLAAAvBAAIC8AAMAQACAwAADBEAAgMQAAwhAAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhAwAAABYAIE0AAP4WACBOAACLFwAgGwAAABYAIAYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAgRgAAixcAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhGQYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICsAAMkOACAsAADKDgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEDAAAAbwAgTQAAgBcAIE4AAI4XACAeAAAAbwAgBAAAphIAIAUAAKcSACAGAACoEgAgEgAAqRIAIBsAAKoSACAuAACtEgAgNwAAqxIAIDoAAKwSACA8AACvEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIEYAAI4XACDsBAEA_wkAIfAEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhjAYBAP8JACGNBiAAwQsAIY4GAQCACgAhjwYBAIAKACGQBgEAgAoAIZEGAQCACgAhkgYBAIAKACGTBgEAgAoAIZQGAQD_CQAhlQYBAP8JACEcBAAAphIAIAUAAKcSACAGAACoEgAgEgAAqRIAIBsAAKoSACAuAACtEgAgNwAAqxIAIDoAAKwSACA8AACvEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIQMAAABvACBNAACCFwAgTgAAkRcAIB4AAABvACAEAACmEgAgBQAApxIAIAYAAKgSACASAACpEgAgGwAAqhIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAgRgAAkRcAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIRwEAACmEgAgBQAApxIAIAYAAKgSACASAACpEgAgGwAAqhIAIDcAAKsSACA6AACsEgAgOwAArhIAIDwAAK8SACA9AACwEgAgPgAAsRIAID8AALISACBAAACzEgAg7AQBAP8JACHwBAEAgAoAIfQEQACBCgAh9QRAAIEKACG8BQEA_wkAIYwGAQD_CQAhjQYgAMELACGOBgEAgAoAIY8GAQCACgAhkAYBAIAKACGRBgEAgAoAIZIGAQCACgAhkwYBAIAKACGUBgEA_wkAIZUGAQD_CQAhAwAAAIsFACBNAACEFwAgTgAAlBcAIA4AAACLBQAgRgAAlBcAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGdBQEA_wkAIdAFAQCACgAh0QUBAP8JACHSBQAAmg4AINMFAQCACgAh1AUBAIAKACHVBQEA_wkAIQzsBAEA_wkAIfEEAQD_CQAh8gQBAIAKACH0BEAAgQoAIfUEQACBCgAhnQUBAP8JACHQBQEAgAoAIdEFAQD_CQAh0gUAAJoOACDTBQEAgAoAIdQFAQCACgAh1QUBAP8JACEN7AQBAAAAAfEEAQAAAAHyBAEAAAAB9ARAAAAAAfUEQAAAAAGBBQEAAAABogUBAAAAAaQFAAAApAUCpQUBAAAAAaYFQAAAAAGnBUAAAAABqAUBAAAAAakFAQAAAAEVCAAA_hEAIBUAAMwRACAXAADNEQAgGQAAyREAIB0AANMRACAeAADSEQAgKAAAxhEAICkAAMcRACAqAADIEQAgKwAAyhEAICwAAMsRACAuAADOEQAgLwAAzxEAIDAAANARACDsBAEAAAAB9ARAAAAAAfUEQAAAAAHCBQEAAAAB0wUBAAAAAewFAQAAAAHzBQEAAAABAgAAABoAIE0AAJYXACAZBgAA3BEAIBUAAN8RACAXAADgEQAgGQAA2hEAIB0AAOcRACAeAADmEQAgKAAA1xEAICkAANgRACAqAADbEQAgKwAA3REAICwAAN4RACAuAADiEQAgLwAA4xEAIDAAAOQRACAzAADWEQAgNAAA2REAIDcAAOERACDsBAEAAAAB9ARAAAAAAfUEQAAAAAGgBQAAAO4FA7wFAQAAAAHCBQEAAAAB7AUBAAAAAe8FAQAAAAECAAAAqgQAIE0AAJgXACAWBwAAswsAIAkAALALACAKAACxCwAgCwAAqgsAIBEAAKsLACASAACoDAAgFAAArQsAIBYAAK8LACAaAACyCwAgGwAArgsAIOwEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABlAUBAAAAAZUFAQAAAAGWBQEAAAABmAUBAAAAAcQFAQAAAAHUBQEAAAAB9AVAAAAAAQIAAAAoACBNAACaFwAgAwAAABgAIE0AAJYXACBOAACeFwAgFwAAABgAIAgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAdAADEEAAgHgAAwxAAICgAALcQACApAAC4EAAgKgAAuRAAICsAALsQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgRgAAnhcAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhFQgAAP0RACAVAAC9EAAgFwAAvhAAIBkAALoQACAdAADEEAAgHgAAwxAAICgAALcQACApAAC4EAAgKgAAuRAAICsAALsQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAwAADBEAAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhwgUBAIAKACHTBQEAgAoAIewFAQCACgAh8wUBAP8JACEDAAAAFgAgTQAAmBcAIE4AAKEXACAbAAAAFgAgBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAzAADCDgAgNAAAxQ4AIDcAAM0OACBGAAChFwAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACEZBgAAyA4AIBUAAMsOACAXAADMDgAgGQAAxg4AIB0AANMOACAeAADSDgAgKAAAww4AICkAAMQOACAqAADHDgAgKwAAyQ4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAzAADCDgAgNAAAxQ4AIDcAAM0OACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACGgBQAAtw7uBSO8BQEA_wkAIcIFAQCACgAh7AUBAIAKACHvBQEAgAoAIQMAAAAmACBNAACaFwAgTgAApBcAIBgAAAAmACAHAACECwAgCQAAgQsAIAoAAIILACALAAD7CgAgEQAA_AoAIBIAAKYMACAUAAD-CgAgFgAAgAsAIBoAAIMLACAbAAD_CgAgRgAApBcAIOwEAQD_CQAh8QQBAP8JACHyBAEAgAoAIfQEQACBCgAh9QRAAIEKACGUBQEA_wkAIZUFAQD_CQAhlgUBAP8JACGYBQEA_wkAIcQFAQD_CQAh1AUBAIAKACH0BUAAgQoAIRYHAACECwAgCQAAgQsAIAoAAIILACALAAD7CgAgEQAA_AoAIBIAAKYMACAUAAD-CgAgFgAAgAsAIBoAAIMLACAbAAD_CgAg7AQBAP8JACHxBAEA_wkAIfIEAQCACgAh9ARAAIEKACH1BEAAgQoAIZQFAQD_CQAhlQUBAP8JACGWBQEA_wkAIZgFAQD_CQAhxAUBAP8JACHUBQEAgAoAIfQFQACBCgAhE-wEAQAAAAHxBAEAAAAB8gQBAAAAAfQEQAAAAAH1BEAAAAABqgUBAAAAAasFCAAAAAGsBQgAAAABrQUIAAAAAa4FCAAAAAGvBQgAAAABsAUIAAAAAbEFCAAAAAGyBQgAAAABswUIAAAAAbQFCAAAAAG1BQgAAAABtgUIAAAAAbcFCAAAAAEDAAAAbwAgTQAAjBYAIE4AAKgXACAeAAAAbwAgBAAAphIAIAUAAKcSACAGAACoEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIEYAAKgXACDsBAEA_wkAIfAEAQCACgAh9ARAAIEKACH1BEAAgQoAIbwFAQD_CQAhjAYBAP8JACGNBiAAwQsAIY4GAQCACgAhjwYBAIAKACGQBgEAgAoAIZEGAQCACgAhkgYBAIAKACGTBgEAgAoAIZQGAQD_CQAhlQYBAP8JACEcBAAAphIAIAUAAKcSACAGAACoEgAgGwAAqhIAIC4AAK0SACA3AACrEgAgOgAArBIAIDsAAK4SACA8AACvEgAgPQAAsBIAID4AALESACA_AACyEgAgQAAAsxIAIOwEAQD_CQAh8AQBAIAKACH0BEAAgQoAIfUEQACBCgAhvAUBAP8JACGMBgEA_wkAIY0GIADBCwAhjgYBAIAKACGPBgEAgAoAIZAGAQCACgAhkQYBAIAKACGSBgEAgAoAIZMGAQCACgAhlAYBAP8JACGVBgEA_wkAIQMAAAAYACBNAACOFgAgTgAAqxcAIBcAAAAYACAIAAD9EQAgFQAAvRAAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKQAAuBAAICoAALkQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgMQAAwhAAIEYAAKsXACDsBAEA_wkAIfQEQACBCgAh9QRAAIEKACHCBQEAgAoAIdMFAQCACgAh7AUBAIAKACHzBQEA_wkAIRUIAAD9EQAgFQAAvRAAIBcAAL4QACAZAAC6EAAgHQAAxBAAIB4AAMMQACAoAAC3EAAgKQAAuBAAICoAALkQACAsAAC8EAAgLgAAvxAAIC8AAMAQACAwAADBEAAgMQAAwhAAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIcIFAQCACgAh0wUBAIAKACHsBQEAgAoAIfMFAQD_CQAhAwAAABYAIE0AAJAWACBOAACuFwAgGwAAABYAIAYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAgRgAArhcAIOwEAQD_CQAh9ARAAIEKACH1BEAAgQoAIaAFAAC3Du4FI7wFAQD_CQAhwgUBAIAKACHsBQEAgAoAIe8FAQCACgAhGQYAAMgOACAVAADLDgAgFwAAzA4AIBkAAMYOACAdAADTDgAgHgAA0g4AICgAAMMOACApAADEDgAgKgAAxw4AICwAAMoOACAuAADODgAgLwAAzw4AIDAAANAOACAxAADRDgAgMwAAwg4AIDQAAMUOACA3AADNDgAg7AQBAP8JACH0BEAAgQoAIfUEQACBCgAhoAUAALcO7gUjvAUBAP8JACHCBQEAgAoAIewFAQCACgAh7wUBAIAKACECAwACBwAGDwQGAwUKBAYNAQwAMxIRBRvhARMu5AEoN-IBLTrjAS075QEoPOcBMD3oASE-6QEhP-sBMUDvATIBAwACAQMAAgkDAAIHAAYJAAgMAC8V1wELF9gBFxjZARU42gEoOdsBEhMGtAEBDAAuFbcBCxe4ARcZsgEWHcQBGh7DARkorAEJKa0BHSqzAQortQEFLLYBEy6_ASgvwAEVMMEBFDHCARIzFQc0sQEPN7wBLQMHFwYMACwyGwgQCBwHDAArFYsBCxeMARcZhgEWHZwBGh6bARkoIAkphAEdKoUBCiuHAQUsigETLpABKC-WARUwlwEUMZoBEgUHAAYJAAgMACcUJAoVfwsGBwAGCQAICiUJDAAmFSkLF3wXDAcABgl4CAp5CQstDAwAJRE1ERIABRM3EhQAChYAFhoAGBsAEwMNAA0OAAsQAA8CCy4MDAAOAQsvAAMHAAYMABAPMAwBDzEAAQ4ACwQHAAYJOAgOAAsSAAUIAwACBwAGCTkIDAAkFToLHXMaIj4UJ2whBAcABgloCBsAEyEAFQYHAAYJZQgMACASAAUWABYgZhQIBwAGCUkIDAAfFT8LF0MXGEgVGgAYH14dBQcABglECBIABRQAChYAFgUMABwVTgsZTRYdWBoeUhkFBwAGCQAIDAAbGgAYHVYaBQcABgkACBoAGBsAExwAGQEdVwAEFVoAGVkAHVwAHlsABAcABglfCAwAHhlgFgEZYQADFWIAF2MAGGQAASBnAAQbchMkACIlAAImcAICDAAjI20hASNuAAQVdAAddwAidQAndgACC3oAEXsAAhV9ABd-AAIUgAEAFYEBAAYHAAYJlQEIEpQBBSQAKSaTAQItAAICDAAqI5EBKAEjkgEADhWjAQAXpAEAGaABAB2qAQAeqQEAKJ0BACmeAQAqnwEAK6EBACyiAQAupQEAL6YBADCnAQAxqAEAATKrAQADB74BBjUAAja9AQISBssBABXOAQAXzwEAGckBAB3WAQAe1QEAKMYBACnHAQAqygEAK8wBACzNAQAu0QEAL9IBADDTAQAx1AEAM8UBADTIAQA30AEABRXcAQAX3QEAGN4BADjfAQA54AEAAS0AAgElAAIBAwACDATwAQAF8QEABvIBABLzAQAb9AEALvcBADf1AQA69gEAO_gBAD35AQA--gEAQPsBAAACAwACBwAGAgMAAgcABgMMADhTADlUADoAAAADDAA4UwA5VAA6AQ4ACwEOAAsDDAA_UwBAVABBAAAAAwwAP1MAQFQAQQAAAwwARlMAR1QASAAAAAMMAEZTAEdUAEgBAwACAQMAAgMMAE1TAE5UAE8AAAADDABNUwBOVABPAQMAAgEDAAIDDABUUwBVVABWAAAAAwwAVFMAVVQAVgAAAAMMAFxTAF1UAF4AAAADDABcUwBdVABeAQMAAgEDAAIDDABjUwBkVABlAAAAAwwAY1MAZFQAZQIHAAYJpAMIAgcABgmqAwgDDABqUwBrVABsAAAAAwwAalMAa1QAbAEHAAYBBwAGBQwAcVMAdFQAddUBAHLWAQBzAAAAAAAFDABxUwB0VAB11QEActYBAHMDBwAGCQAICtIDCQMHAAYJAAgK2AMJBQwAelMAfVQAftUBAHvWAQB8AAAAAAAFDAB6UwB9VAB-1QEAe9YBAHwIBwAGCeoDCArrAwkSAAUUAAoWABYaABgbABMIBwAGCfEDCAryAwkSAAUUAAoWABYaABgbABMDDACDAVMAhAFUAIUBAAAAAwwAgwFTAIQBVACFAQEIhAQHAQiKBAcDDACKAVMAiwFUAIwBAAAAAwwAigFTAIsBVACMAQEHnAQGAQeiBAYDDACRAVMAkgFUAJMBAAAAAwwAkQFTAJIBVACTAQAAAwwAmAFTAJkBVACaAQAAAAMMAJgBUwCZAVQAmgEDB80EBjUAAjbMBAIDB9QEBjUAAjbTBAIDDACfAVMAoAFUAKEBAAAAAwwAnwFTAKABVAChAQMHAAYJAAgaABgDBwAGCQAIGgAYBQwApgFTAKkBVACqAdUBAKcB1gEAqAEAAAAAAAUMAKYBUwCpAVQAqgHVAQCnAdYBAKgBBQcABgkACBoAGBsAExwAGQUHAAYJAAgaABgbABMcABkFDACvAVMAsgFUALMB1QEAsAHWAQCxAQAAAAAABQwArwFTALIBVACzAdUBALAB1gEAsQEAAAMMALgBUwC5AVQAugEAAAADDAC4AVMAuQFUALoBAAADDAC_AVMAwAFUAMEBAAAAAwwAvwFTAMABVADBAQIHAAYJAAgCBwAGCQAIBQwAxgFTAMkBVADKAdUBAMcB1gEAyAEAAAAAAAUMAMYBUwDJAVQAygHVAQDHAdYBAMgBAw0ADQ4ACxAADwMNAA0OAAsQAA8DDADPAVMA0AFUANEBAAAAAwwAzwFTANABVADRAQAAAwwA1gFTANcBVADYAQAAAAMMANYBUwDXAVQA2AEEBwAGCYkGCBoAGB-KBh0EBwAGCZAGCBoAGB-RBh0FDADdAVMA4AFUAOEB1QEA3gHWAQDfAQAAAAAABQwA3QFTAOABVADhAdUBAN4B1gEA3wEAAAMMAOYBUwDnAVQA6AEAAAADDADmAVMA5wFUAOgBASUAAgElAAIDDADtAVMA7gFUAO8BAAAAAwwA7QFTAO4BVADvAQQb1QYTJAAiJQACJtQGAgQb3AYTJAAiJQACJtsGAgMMAPQBUwD1AVQA9gEAAAADDAD0AVMA9QFUAPYBAwMAAgcABgnuBggDAwACBwAGCfQGCAMMAPsBUwD8AVQA_QEAAAADDAD7AVMA_AFUAP0BBAcABgmGBwgOAAsSAAUEBwAGCYwHCA4ACxIABQUMAIICUwCFAlQAhgLVAQCDAtYBAIQCAAAAAAAFDACCAlMAhQJUAIYC1QEAgwLWAQCEAgYHAAYJoAcIEp8HBSQAKSaeBwItAAIGBwAGCagHCBKnBwUkACkmpgcCLQACAwwAiwJTAIwCVACNAgAAAAMMAIsCUwCMAlQAjQIEBwAGCboHCBIABRYAFgQHAAYJwAcIEgAFFgAWAwwAkgJTAJMCVACUAgAAAAMMAJICUwCTAlQAlAIEBwAGCdIHCBsAEyEAFQQHAAYJ2AcIGwATIQAVAwwAmQJTAJoCVACbAgAAAAMMAJkCUwCaAlQAmwIFBwAGCeoHCBIABRQAChYAFgUHAAYJ8AcIEgAFFAAKFgAWAwwAoAJTAKECVACiAgAAAAMMAKACUwChAlQAogIBLQACAS0AAgMMAKcCUwCoAlQAqQIAAAADDACnAlMAqAJUAKkCAwMAAgcABgkACAMDAAIHAAYJAAgDDACuAlMArwJUALACAAAAAwwArgJTAK8CVACwAkECAUL8AQFD_QEBRP4BAUX_AQFHgQIBSIMCNEmEAjVKhgIBS4gCNEyJAjZPigIBUIsCAVGMAjRVjwI3VpACO1eRAhFYkgIRWZMCEVqUAhFblQIRXJcCEV2ZAjRemgI8X5wCEWCeAjRhnwI9YqACEWOhAhFkogI0ZaUCPmamAkJnqAICaKkCAmmrAgJqrAICa60CAmyvAgJtsQI0brICQ2-0AgJwtgI0cbcCRHK4AgJzuQICdLoCNHW9AkV2vgJJd78CA3jAAgN5wQIDesICA3vDAgN8xQIDfccCNH7IAkp_ygIDgAHMAjSBAc0CS4IBzgIDgwHPAgOEAdACNIUB0wJMhgHUAlCHAdUCBIgB1gIEiQHXAgSKAdgCBIsB2QIEjAHbAgSNAd0CNI4B3gJRjwHgAgSQAeICNJEB4wJSkgHkAgSTAeUCBJQB5gI0lQHpAlOWAeoCV5cB7AJYmAHtAliZAfACWJoB8QJYmwHyAlicAfQCWJ0B9gI0ngH3AlmfAfkCWKAB-wI0oQH8AlqiAf0CWKMB_gJYpAH_AjSlAYIDW6YBgwNfpwGEAzKoAYUDMqkBhgMyqgGHAzKrAYgDMqwBigMyrQGMAzSuAY0DYK8BjwMysAGRAzSxAZIDYbIBkwMyswGUAzK0AZUDNLUBmANitgGZA2a3AZoDHbgBmwMduQGcAx26AZ0DHbsBngMdvAGgAx29AaIDNL4BowNnvwGmAx3AAagDNMEBqQNowgGrAx3DAawDHcQBrQM0xQGwA2nGAbEDbccBsgMPyAGzAw_JAbQDD8oBtQMPywG2Aw_MAbgDD80BugM0zgG7A27PAb0DD9ABvwM00QHAA2_SAcEDD9MBwgMP1AHDAzTXAcYDcNgBxwN22QHIAwraAckDCtsBygMK3AHLAwrdAcwDCt4BzgMK3wHQAzTgAdEDd-EB1AMK4gHWAzTjAdcDeOQB2QMK5QHaAwrmAdsDNOcB3gN56AHfA3_pAeADC-oB4QML6wHiAwvsAeMDC-0B5AML7gHmAwvvAegDNPAB6QOAAfEB7QML8gHvAzTzAfADgQH0AfMDC_UB9AML9gH1AzT3AfgDggH4AfkDhgH5AfoDCPoB-wMI-wH8Awj8Af0DCP0B_gMI_gGABAj_AYIENIACgwSHAYEChgQIggKIBDSDAokEiAGEAosECIUCjAQIhgKNBDSHApAEiQGIApEEjQGJApIEB4oCkwQHiwKUBAeMApUEB40ClgQHjgKYBAePApoENJACmwSOAZECngQHkgKgBDSTAqEEjwGUAqMEB5UCpAQHlgKlBDSXAqgEkAGYAqkElAGZAqsEBpoCrAQGmwKuBAacAq8EBp0CsAQGngKyBAafArQENKACtQSVAaECtwQGogK5BDSjAroElgGkArsEBqUCvAQGpgK9BDSnAsAElwGoAsEEmwGpAsIELaoCwwQtqwLEBC2sAsUELa0CxgQtrgLIBC2vAsoENLACywScAbECzwQtsgLRBDSzAtIEnQG0AtUELbUC1gQttgLXBDS3AtoEngG4AtsEogG5AtwEGboC3QQZuwLeBBm8At8EGb0C4AQZvgLiBBm_AuQENMAC5QSjAcEC5wQZwgLpBDTDAuoEpAHEAusEGcUC7AQZxgLtBDTHAvAEpQHIAvEEqwHJAvIEGsoC8wQaywL0BBrMAvUEGs0C9gQazgL4BBrPAvoENNAC-wSsAdEC_QQa0gL_BDTTAoAFrQHUAoEFGtUCggUa1gKDBTTXAoYFrgHYAocFtAHZAokFKdoCigUp2wKNBSncAo4FKd0CjwUp3gKRBSnfApMFNOAClAW1AeEClgUp4gKYBTTjApkFtgHkApoFKeUCmwUp5gKcBTTnAp8FtwHoAqAFuwHpAqIFIuoCowUi6wKmBSLsAqcFIu0CqAUi7gKqBSLvAqwFNPACrQW8AfECrwUi8gKxBTTzArIFvQH0ArMFIvUCtAUi9gK1BTT3ArgFvgH4ArkFwgH5AroFCfoCuwUJ-wK8BQn8Ar0FCf0CvgUJ_gLABQn_AsIFNIADwwXDAYEDxQUJggPHBTSDA8gFxAGEA8kFCYUDygUJhgPLBTSHA84FxQGIA88FywGJA9AFDIoD0QUMiwPSBQyMA9MFDI0D1AUMjgPWBQyPA9gFNJAD2QXMAZED2wUMkgPdBTSTA94FzQGUA98FDJUD4AUMlgPhBTSXA-QFzgGYA-UF0gGZA-cFDZoD6AUNmwPrBQ2cA-wFDZ0D7QUNngPvBQ2fA_EFNKAD8gXTAaED9AUNogP2BTSjA_cF1AGkA_gFDaUD-QUNpgP6BTSnA_0F1QGoA_4F2QGpA_8FFqoDgAYWqwOBBhasA4IGFq0DgwYWrgOFBhavA4cGNLADiAbaAbEDjAYWsgOOBjSzA48G2wG0A5IGFrUDkwYWtgOUBjS3A5cG3AG4A5gG4gG5A5oGGLoDmwYYuwOeBhi8A58GGL0DoAYYvgOiBhi_A6QGNMADpQbjAcEDpwYYwgOpBjTDA6oG5AHEA6sGGMUDrAYYxgOtBjTHA7AG5QHIA7EG6QHJA7MGMcoDtAYxywO2BjHMA7cGMc0DuAYxzgO6BjHPA7wGNNADvQbqAdEDvwYx0gPBBjTTA8IG6wHUA8MGMdUDxAYx1gPFBjTXA8gG7AHYA8kG8AHZA8oGIdoDywYh2wPMBiHcA80GId0DzgYh3gPQBiHfA9IGNOAD0wbxAeED1wYh4gPZBjTjA9oG8gHkA90GIeUD3gYh5gPfBjTnA-IG8wHoA-MG9wHpA-QGE-oD5QYT6wPmBhPsA-cGE-0D6AYT7gPqBhPvA-wGNPAD7Qb4AfED8AYT8gPyBjTzA_MG-QH0A_UGE_UD9gYT9gP3BjT3A_oG-gH4A_sG_gH5A_wGEvoD_QYS-wP-BhL8A_8GEv0DgAcS_gOCBxL_A4QHNIAEhQf_AYEEiAcSggSKBzSDBIsHgAKEBI0HEoUEjgcShgSPBzSHBJIHgQKIBJMHhwKJBJQHKIoElQcoiwSWByiMBJcHKI0EmAcojgSaByiPBJwHNJAEnQeIApEEogcokgSkBzSTBKUHiQKUBKkHKJUEqgcolgSrBzSXBK4HigKYBK8HjgKZBLAHFZoEsQcVmwSyBxWcBLMHFZ0EtAcVngS2BxWfBLgHNKAEuQePAqEEvAcVogS-BzSjBL8HkAKkBMEHFaUEwgcVpgTDBzSnBMYHkQKoBMcHlQKpBMgHFKoEyQcUqwTKBxSsBMsHFK0EzAcUrgTOBxSvBNAHNLAE0QeWArEE1AcUsgTWBzSzBNcHlwK0BNkHFLUE2gcUtgTbBzS3BN4HmAK4BN8HnAK5BOAHF7oE4QcXuwTiBxe8BOMHF70E5AcXvgTmBxe_BOgHNMAE6QedAsEE7AcXwgTuBzTDBO8HngLEBPEHF8UE8gcXxgTzBzTHBPYHnwLIBPcHowLJBPkHMMoE-gcwywT8BzDMBP0HMM0E_gcwzgSACDDPBIIINNAEgwikAtEEhQgw0gSHCDTTBIgIpQLUBIkIMNUEiggw1gSLCDTXBI4IpgLYBI8IqgLZBJAIBdoEkQgF2wSSCAXcBJMIBd0ElAgF3gSWCAXfBJgINOAEmQirAuEEmwgF4gSdCDTjBJ4IrALkBJ8IBeUEoAgF5gShCDTnBKQIrQLoBKUIsQI"
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
function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch(search) {
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
    throw createHttpError(403, "Only department admins can access this resource");
  }
  const institution = await prisma.institution.findUnique({
    where: {
      id: adminProfile.institutionId
    },
    select: {
      type: true
    }
  });
  const isInstitutionAdminNonUniversity = adminProfile.role === AdminRole.INSTITUTIONADMIN && Boolean(institution?.type) && institution?.type !== InstitutionType.UNIVERSITY;
  if (adminProfile.role !== AdminRole.DEPARTMENTADMIN) {
    if (!isInstitutionAdminNonUniversity) {
      throw createHttpError(403, "Only department admins can access this resource");
    }
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
      throw createHttpError(404, "Department not found for this institution");
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
    if (isInstitutionAdminNonUniversity) {
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
    throw createHttpError(
      404,
      "No department found for this institution. Ask faculty admin to create one first"
    );
  }
  if (departments.length > 1) {
    if (isInstitutionAdminNonUniversity) {
      return {
        institutionId: adminProfile.institutionId,
        departmentId: departments[0].id
      };
    }
    throw createHttpError(400, "Multiple departments found. Please provide departmentId");
  }
  return {
    institutionId: adminProfile.institutionId,
    departmentId: departments[0].id
  };
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
    throw createHttpError(403, "Only department admins can access this resource");
  }
  const normalizedFullName = payload.fullName?.trim();
  const normalizedShortName = payload.shortName?.trim() || null;
  const normalizedDescription = payload.description?.trim() || null;
  const hasDepartmentMutation = Boolean(payload.fullName || payload.shortName || payload.description) || Boolean(payload.departmentId);
  const savedDepartment = await prisma.$transaction(async (trx) => {
    let nextDepartment = null;
    if (hasDepartmentMutation) {
      if (!normalizedFullName) {
        throw createHttpError(400, "Department full name is required when updating department details");
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
          throw createHttpError(
            404,
            "No faculty found for this institution. Ask faculty admin to create a faculty first"
          );
        }
        if (faculties.length > 1) {
          throw createHttpError(
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
            throw createHttpError(404, "Department not found for this institution");
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
          throw createHttpError(400, "Multiple departments found. Please provide departmentId");
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
  const normalizedSearch = normalizeSearch(search);
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
    throw createHttpError(400, "endDate must be greater than startDate");
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
    throw createHttpError(404, "Semester not found");
  }
  const nextStartDate = payload.startDate ? new Date(payload.startDate) : semester.startDate;
  const nextEndDate = payload.endDate ? new Date(payload.endDate) : semester.endDate;
  if (nextEndDate.getTime() <= nextStartDate.getTime()) {
    throw createHttpError(400, "endDate must be greater than startDate");
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
var listBatches = async (userId, departmentId, search) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);
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
    throw createHttpError(404, "Batch not found");
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
    throw createHttpError(404, "Batch not found");
  }
  const sectionCount = await prisma.section.count({
    where: {
      batchId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    }
  });
  if (sectionCount > 0) {
    throw createHttpError(409, "Cannot delete batch with assigned sections");
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
  const normalizedSearch = normalizeSearch(search);
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
    throw createHttpError(404, "Semester not found for this institution");
  }
  if (!batch) {
    throw createHttpError(404, "Batch not found for this department");
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
    throw createHttpError(404, "Section not found");
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
      throw createHttpError(404, "Semester not found for this institution");
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
      throw createHttpError(404, "Batch not found for this department");
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
    throw createHttpError(404, "Section not found");
  }
  const registrationCount = await prisma.courseRegistration.count({
    where: {
      sectionId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    }
  });
  if (registrationCount > 0) {
    throw createHttpError(409, "Cannot delete section with course registrations");
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
  const normalizedSearch = normalizeSearch(search);
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
    throw createHttpError(404, "Program not found");
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
  const normalizedSearch = normalizeSearch(search);
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
      throw createHttpError(404, "Program not found for this department");
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
    throw createHttpError(404, "Course not found");
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
      throw createHttpError(404, "Program not found for this department");
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
    throw createHttpError(404, "Course not found");
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
var listCourseRegistrations = async (userId, departmentId, search) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);
  return prisma.courseRegistration.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
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
  const normalizedSearch = normalizeSearch(search);
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
    throw createHttpError(404, "Course not found for this department");
  }
  if (!section) {
    throw createHttpError(404, "Section not found for this department");
  }
  if (!teacher) {
    throw createHttpError(404, "Teacher not found for this department");
  }
  if (!semester) {
    throw createHttpError(404, "Semester not found for this institution");
  }
  if (section.semesterId !== payload.semesterId) {
    throw createHttpError(400, "Selected section does not belong to the selected semester");
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
    throw createHttpError(404, "Course not found for this department");
  }
  if (!student) {
    throw createHttpError(404, "Student not found for this department");
  }
  if (!section) {
    throw createHttpError(404, "Section not found for this department");
  }
  if (!semester) {
    throw createHttpError(404, "Semester not found for this institution");
  }
  if (section.semesterId !== payload.semesterId) {
    throw createHttpError(400, "Selected section does not belong to the selected semester");
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
      throw createHttpError(404, "Program not found for this department");
    }
  }
  if (course.programId && course.programId !== resolvedProgramId) {
    throw createHttpError(400, "Selected course does not belong to the selected program");
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
    throw createHttpError(
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
    throw createHttpError(409, "Student is already registered for this course in the selected semester");
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
    throw createHttpError(404, "Course registration not found");
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
    throw createHttpError(404, "Course not found for this department");
  }
  if (!student) {
    throw createHttpError(404, "Student not found for this department");
  }
  if (!section) {
    throw createHttpError(404, "Section not found for this department");
  }
  if (!semester) {
    throw createHttpError(404, "Semester not found for this institution");
  }
  if (section.semesterId !== nextSemesterId) {
    throw createHttpError(400, "Selected section does not belong to the selected semester");
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
      throw createHttpError(404, "Program not found for this department");
    }
  }
  if (course.programId && course.programId !== resolvedProgramId) {
    throw createHttpError(400, "Selected course does not belong to the selected program");
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
    throw createHttpError(
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
    throw createHttpError(409, "Student is already registered for this course in the selected semester");
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
    throw createHttpError(404, "Course registration not found");
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
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);
  return prisma.teacherProfile.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
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
    throw createHttpError(500, "Failed to create teacher account");
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
  const context = await resolveDepartmentContext(userId);
  const teacher = await prisma.teacherProfile.findFirst({
    where: {
      id: teacherProfileId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true,
      userId: true
    }
  });
  if (!teacher) {
    throw createHttpError(404, "Teacher not found");
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
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);
  return prisma.studentProfile.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
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
    throw createHttpError(500, "Failed to create student account");
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
  const context = await resolveDepartmentContext(userId);
  const student = await prisma.studentProfile.findFirst({
    where: {
      id: studentProfileId,
      institutionId: context.institutionId,
      departmentId: context.departmentId
    },
    select: {
      id: true,
      userId: true
    }
  });
  if (!student) {
    throw createHttpError(404, "Student not found");
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
    throw createHttpError(404, "Student admission application not found");
  }
  if (application.status === StudentAdmissionApplicationStatus.APPROVED || application.status === StudentAdmissionApplicationStatus.REJECTED) {
    throw createHttpError(400, "Application has already been reviewed");
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
    throw createHttpError(400, "studentsId is required for approval");
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
    throw createHttpError(400, "monthlyFeeAmount cannot exceed totalFeeAmount");
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
    throw createHttpError(404, "Semester not found for this institution");
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
    throw createHttpError(404, "Student not found for this department");
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
  createCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration,
  listTeachers,
  createTeacher,
  updateTeacher,
  listStudents,
  createStudent,
  updateStudent,
  getDashboardSummary,
  listStudentAdmissionApplications,
  reviewStudentAdmissionApplication,
  upsertFeeConfiguration,
  listFeeConfigurations,
  getStudentPaymentInfoByStudentId
};

// src/app/module/department/department.controller.ts
var readParam = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue = (value) => {
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
  const result = await DepartmentService.listSemesters(user.id, readQueryValue(req.query.search));
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
var updateSemester2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateSemester(
    user.id,
    readParam(req.params.semesterId),
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
    readQueryValue(req.query.search)
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
  const result = await DepartmentService.updateBatch(user.id, readParam(req.params.batchId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Batch updated successfully",
    data: result
  });
});
var deleteBatch2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.deleteBatch(user.id, readParam(req.params.batchId));
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
    readQueryValue(req.query.search)
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
    readParam(req.params.sectionId),
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
  const result = await DepartmentService.deleteSection(user.id, readParam(req.params.sectionId));
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
    readQueryValue(req.query.search)
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
    readParam(req.params.programId),
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
    readQueryValue(req.query.search)
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
    readParam(req.params.courseId),
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
  const result = await DepartmentService.deleteCourse(user.id, readParam(req.params.courseId));
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
    readQueryValue(req.query.search)
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
    readQueryValue(req.query.search)
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
var updateCourseRegistration2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.updateCourseRegistration(
    user.id,
    readParam(req.params.courseRegistrationId),
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
    readParam(req.params.courseRegistrationId)
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
    readQueryValue(req.query.search)
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
    readParam(req.params.teacherProfileId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teacher updated successfully",
    data: result
  });
});
var listStudents2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await DepartmentService.listStudents(
    user.id,
    req.query.departmentId,
    readQueryValue(req.query.search)
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
    readParam(req.params.studentProfileId),
    req.body
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student updated successfully",
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
    readParam(req.params.applicationId),
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
    readParam(req.params.studentsId),
    semesterId
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Student payment info fetched successfully",
    data: result
  });
});
var DepartmentController = {
  getDepartmentProfile: getDepartmentProfile2,
  getDashboardSummary: getDashboardSummary2,
  updateDepartmentProfile: updateDepartmentProfile2,
  listSemesters: listSemesters2,
  createSemester: createSemester2,
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
  updateCourseRegistration: updateCourseRegistration2,
  deleteCourseRegistration: deleteCourseRegistration2,
  listTeachers: listTeachers2,
  createTeacher: createTeacher2,
  updateTeacher: updateTeacher2,
  listStudents: listStudents2,
  createStudent: createStudent2,
  updateStudent: updateStudent2,
  listStudentAdmissionApplications: listStudentAdmissionApplications2,
  reviewStudentAdmissionApplication: reviewStudentAdmissionApplication2,
  listFeeConfigurations: listFeeConfigurations2,
  upsertFeeConfiguration: upsertFeeConfiguration2,
  getStudentPaymentInfoByStudentId: getStudentPaymentInfoByStudentId2
};

// src/app/module/department/department.validation.ts
import { z } from "zod";
var uuidSchema = z.uuid("Please provide a valid id");
var passwordSchema = z.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
var DepartmentValidation = {
  updateDepartmentProfileSchema: z.object({
    body: z.object({
      fullName: z.string("Full name must be a string").trim().min(2).max(120).optional(),
      shortName: z.string("Short name must be a string").trim().min(2).max(30).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema.optional(),
      name: z.string("name must be a string").trim().min(2).max(120).optional(),
      image: z.url("image must be a valid URL").trim().optional(),
      contactNo: z.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createSemesterSchema: z.object({
    body: z.object({
      name: z.string("Semester name is required").trim().min(2).max(80),
      startDate: z.iso.datetime("startDate must be a valid ISO datetime"),
      endDate: z.iso.datetime("endDate must be a valid ISO datetime")
    })
  }),
  updateSemesterSchema: z.object({
    params: z.object({
      semesterId: uuidSchema
    }),
    body: z.object({
      name: z.string("Semester name must be a string").trim().min(2).max(80).optional(),
      startDate: z.iso.datetime("startDate must be a valid ISO datetime").optional(),
      endDate: z.iso.datetime("endDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createBatchSchema: z.object({
    body: z.object({
      name: z.string("Batch name is required").trim().min(1).max(80),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema.optional()
    })
  }),
  updateBatchSchema: z.object({
    params: z.object({
      batchId: uuidSchema
    }),
    body: z.object({
      name: z.string("Batch name must be a string").trim().min(1).max(80).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteBatchSchema: z.object({
    params: z.object({
      batchId: uuidSchema
    })
  }),
  createSectionSchema: z.object({
    body: z.object({
      name: z.string("Section name is required").trim().min(1).max(80),
      semesterId: uuidSchema,
      batchId: uuidSchema,
      sectionCapacity: z.number().int().positive().max(500).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      departmentId: uuidSchema.optional()
    })
  }),
  updateSectionSchema: z.object({
    params: z.object({
      sectionId: uuidSchema
    }),
    body: z.object({
      name: z.string("Section name must be a string").trim().min(1).max(80).optional(),
      semesterId: uuidSchema.optional(),
      batchId: uuidSchema.optional(),
      sectionCapacity: z.number().int().positive().max(500).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteSectionSchema: z.object({
    params: z.object({
      sectionId: uuidSchema
    })
  }),
  createProgramSchema: z.object({
    body: z.object({
      title: z.string("Program title is required").trim().min(2).max(120),
      shortTitle: z.string("Short title must be a string").trim().min(2).max(30).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z.number().positive().max(500).optional(),
      cost: z.number().nonnegative().max(1e8).optional(),
      departmentId: uuidSchema.optional()
    })
  }),
  updateProgramSchema: z.object({
    params: z.object({
      programId: uuidSchema
    }),
    body: z.object({
      title: z.string("Program title must be a string").trim().min(2).max(120).optional(),
      shortTitle: z.string("Short title must be a string").trim().min(2).max(30).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z.number().positive().max(500).optional(),
      cost: z.number().nonnegative().max(1e8).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createCourseSchema: z.object({
    body: z.object({
      courseCode: z.string("Course code is required").trim().min(2).max(30),
      courseTitle: z.string("Course title is required").trim().min(2).max(120),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z.number().int().positive().max(500).optional(),
      programId: uuidSchema.optional()
    })
  }),
  updateCourseSchema: z.object({
    params: z.object({
      courseId: uuidSchema
    }),
    body: z.object({
      courseCode: z.string("Course code must be a string").trim().min(2).max(30).optional(),
      courseTitle: z.string("Course title must be a string").trim().min(2).max(120).optional(),
      description: z.string("Description must be a string").trim().min(3).max(500).optional(),
      credits: z.number().int().positive().max(500).optional(),
      programId: uuidSchema.optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteCourseSchema: z.object({
    params: z.object({
      courseId: uuidSchema
    })
  }),
  createCourseRegistrationSchema: z.object({
    body: z.object({
      courseId: uuidSchema,
      studentProfileId: uuidSchema,
      sectionId: uuidSchema,
      programId: uuidSchema.optional(),
      semesterId: uuidSchema,
      departmentId: uuidSchema.optional(),
      registrationDate: z.iso.datetime("registrationDate must be a valid ISO datetime").optional()
    })
  }),
  updateCourseRegistrationSchema: z.object({
    params: z.object({
      courseRegistrationId: uuidSchema
    }),
    body: z.object({
      courseId: uuidSchema.optional(),
      studentProfileId: uuidSchema.optional(),
      sectionId: uuidSchema.optional(),
      programId: uuidSchema.optional(),
      semesterId: uuidSchema.optional(),
      registrationDate: z.iso.datetime("registrationDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  deleteCourseRegistrationSchema: z.object({
    params: z.object({
      courseRegistrationId: uuidSchema
    })
  }),
  upsertSectionCourseTeacherAssignmentSchema: z.object({
    body: z.object({
      sectionId: uuidSchema,
      courseId: uuidSchema,
      teacherProfileId: uuidSchema,
      semesterId: uuidSchema,
      departmentId: uuidSchema.optional()
    })
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
      departmentId: uuidSchema.optional()
    })
  }),
  updateTeacherSchema: z.object({
    params: z.object({
      teacherProfileId: uuidSchema
    }),
    body: z.object({
      designation: z.string("Designation must be a string").trim().min(2).max(80).optional(),
      bio: z.string("Bio must be a string").trim().max(500).optional(),
      accountStatus: z.enum(AccountStatus).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createStudentSchema: z.object({
    body: z.object({
      name: z.string("Name is required").trim().min(2).max(60),
      email: z.email("Please provide a valid email").toLowerCase().trim(),
      password: passwordSchema,
      studentsId: z.string("Student id is required").trim().min(2).max(50),
      bio: z.string("Bio must be a string").trim().max(500).optional(),
      departmentId: uuidSchema.optional()
    })
  }),
  updateStudentSchema: z.object({
    params: z.object({
      studentProfileId: uuidSchema
    }),
    body: z.object({
      bio: z.string("Bio must be a string").trim().max(500).optional(),
      accountStatus: z.enum(AccountStatus).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  listStudentAdmissionApplicationsSchema: z.object({
    query: z.object({
      status: z.enum(["PENDING", "SHORTLISTED", "APPROVED", "REJECTED"]).optional()
    })
  }),
  reviewStudentAdmissionApplicationSchema: z.object({
    params: z.object({
      applicationId: uuidSchema
    }),
    body: z.object({
      status: z.enum(["SHORTLISTED", "APPROVED", "REJECTED"]),
      responseMessage: z.string("responseMessage must be a string").trim().max(1200).optional(),
      rejectionReason: z.string("rejectionReason must be a string").trim().max(1200).optional(),
      studentsId: z.string("studentsId must be a string").trim().min(2).max(50).optional(),
      bio: z.string("bio must be a string").trim().max(1200).optional()
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
  upsertFeeConfigurationSchema: z.object({
    body: z.object({
      semesterId: uuidSchema,
      totalFeeAmount: z.number().positive().max(1e8),
      monthlyFeeAmount: z.number().positive().max(1e8),
      currency: z.string().trim().min(3).max(10).optional()
    })
  }),
  listFeeConfigurationsSchema: z.object({
    query: z.object({
      semesterId: uuidSchema.optional()
    })
  }),
  getStudentPaymentInfoSchema: z.object({
    params: z.object({
      studentsId: z.string("studentsId must be a string").trim().min(2).max(50)
    }),
    query: z.object({
      semesterId: uuidSchema.optional()
    })
  })
};

// src/app/module/department/department.route.ts
var router = Router();
router.get("/profile", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.getDepartmentProfile);
router.get(
  "/dashboard-summary",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  DepartmentController.getDashboardSummary
);
router.patch(
  "/profile",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateDepartmentProfileSchema),
  DepartmentController.updateDepartmentProfile
);
router.get("/semesters", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listSemesters);
router.post(
  "/semesters",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createSemesterSchema),
  DepartmentController.createSemester
);
router.patch(
  "/semesters/:semesterId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateSemesterSchema),
  DepartmentController.updateSemester
);
router.get("/batches", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listBatches);
router.post(
  "/batches",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createBatchSchema),
  DepartmentController.createBatch
);
router.patch(
  "/batches/:batchId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateBatchSchema),
  DepartmentController.updateBatch
);
router.delete(
  "/batches/:batchId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.deleteBatchSchema),
  DepartmentController.deleteBatch
);
router.get("/sections", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listSections);
router.post(
  "/sections",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createSectionSchema),
  DepartmentController.createSection
);
router.patch(
  "/sections/:sectionId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateSectionSchema),
  DepartmentController.updateSection
);
router.delete(
  "/sections/:sectionId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.deleteSectionSchema),
  DepartmentController.deleteSection
);
router.get("/programs", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listPrograms);
router.post(
  "/programs",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createProgramSchema),
  DepartmentController.createProgram
);
router.patch(
  "/programs/:programId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateProgramSchema),
  DepartmentController.updateProgram
);
router.get("/courses", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listCourses);
router.post(
  "/courses",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createCourseSchema),
  DepartmentController.createCourse
);
router.patch(
  "/courses/:courseId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateCourseSchema),
  DepartmentController.updateCourse
);
router.delete(
  "/courses/:courseId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.deleteCourseSchema),
  DepartmentController.deleteCourse
);
router.get(
  "/course-registrations",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  DepartmentController.listCourseRegistrations
);
router.get(
  "/course-teacher-assignments",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  DepartmentController.listSectionCourseTeacherAssignments
);
router.post(
  "/course-teacher-assignments",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.upsertSectionCourseTeacherAssignmentSchema),
  DepartmentController.upsertSectionCourseTeacherAssignment
);
router.post(
  "/course-registrations",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createCourseRegistrationSchema),
  DepartmentController.createCourseRegistration
);
router.patch(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateCourseRegistrationSchema),
  DepartmentController.updateCourseRegistration
);
router.delete(
  "/course-registrations/:courseRegistrationId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.deleteCourseRegistrationSchema),
  DepartmentController.deleteCourseRegistration
);
router.get("/teachers", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listTeachers);
router.post(
  "/teachers",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createTeacherSchema),
  DepartmentController.createTeacher
);
router.patch(
  "/teachers/:teacherProfileId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateTeacherSchema),
  DepartmentController.updateTeacher
);
router.get("/students", requireSessionRole("ADMIN", "DEPARTMENT"), DepartmentController.listStudents);
router.post(
  "/students",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.createStudentSchema),
  DepartmentController.createStudent
);
router.patch(
  "/students/:studentProfileId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.updateStudentSchema),
  DepartmentController.updateStudent
);
router.get(
  "/student-applications",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.listStudentAdmissionApplicationsSchema),
  DepartmentController.listStudentAdmissionApplications
);
router.patch(
  "/student-applications/:applicationId/review",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.reviewStudentAdmissionApplicationSchema),
  DepartmentController.reviewStudentAdmissionApplication
);
router.get(
  "/fees/configurations",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.listFeeConfigurationsSchema),
  DepartmentController.listFeeConfigurations
);
router.post(
  "/fees/configurations",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.upsertFeeConfigurationSchema),
  DepartmentController.upsertFeeConfiguration
);
router.get(
  "/fees/students/:studentsId",
  requireSessionRole("ADMIN", "DEPARTMENT"),
  validateRequest(DepartmentValidation.getStudentPaymentInfoSchema),
  DepartmentController.getStudentPaymentInfoByStudentId
);
var DepartmentRouter = router;

// src/app/module/apply/apply.validation.ts
import z2 from "zod";
var ApplyForInstitutionValidationSchema = {
  applyForInstitutionSchema: z2.object({
    name: z2.string().min(1, "Name is required"),
    email: z2.string().email("Invalid email address"),
    password: z2.string().min(6, "Password must be at least 6 characters long"),
    instituteName: z2.string().min(1, "Institute name is required"),
    instituteShortname: z2.string().min(1, "Institute shortname is required"),
    description: z2.string().min(1, "Description is required"),
    instituteType: z2.enum(
      [
        InstitutionType.COLLEGE,
        InstitutionType.SCHOOL,
        InstitutionType.UNIVERSITY,
        InstitutionType.TRAINING_CENTER,
        InstitutionType.OTHER
      ],
      "Invalid institute type"
    ),
    instituteLogo: z2.string().min(1, "Institute logo is required")
  })
};

// src/app/module/auth/auth.route.ts
import { Router as Router2 } from "express";

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
function createHttpError2(statusCode, message) {
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
    throw createHttpError2(404, "User account not found");
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
        throw createHttpError2(
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
    throw createHttpError2(400, "Account is already verified");
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
    throw createHttpError2(400, "OTP has expired. Please request a new code");
  }
  if (otpRecord.expiresAt.getTime() <= Date.now()) {
    await prisma.emailOtp.deleteMany({
      where: {
        userId: user.id
      }
    });
    throw createHttpError2(400, "OTP has expired. Please request a new code");
  }
  if (otpRecord.otpHash !== hashOtp(otpCode)) {
    throw createHttpError2(400, "Invalid OTP code");
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
import { z as z3 } from "zod";
var passwordSchema2 = z3.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
  /[^A-Za-z0-9]/,
  "Password must contain at least one special character"
);
var emailSchema = z3.email("Please provide a valid email address").toLowerCase().trim();
var registerSchema = z3.object({
  body: z3.object({
    name: z3.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(60, "Name must not exceed 60 characters").regex(
      /^[a-zA-Z\s'-]+$/,
      "Name must only contain letters, spaces, hyphens or apostrophes"
    ),
    email: emailSchema,
    password: passwordSchema2,
    role: z3.enum([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.SUPERADMIN], {
      message: `Invalid role. Must be one of: ${UserRole.SUPERADMIN}, ${UserRole.ADMIN}, ${UserRole.TEACHER}, ${UserRole.STUDENT}`
    }).optional(),
    adminRole: z3.enum([AdminRole.DEPARTMENTADMIN, AdminRole.INSTITUTIONADMIN, AdminRole.FACULTYADMIN], {
      message: `Invalid admin role. Must be one of: ${AdminRole.DEPARTMENTADMIN}, ${AdminRole.INSTITUTIONADMIN}, ${AdminRole.FACULTYADMIN}`
    }).optional(),
    institutionId: z3.string().optional()
  })
});
var loginSchema = z3.object({
  body: z3.object({
    email: emailSchema,
    password: z3.string("Password is required").min(1, "Password is required")
  })
});
var otpBaseSchema = z3.object({
  body: z3.object({
    email: emailSchema
  })
});
var verifyOtpSchema = z3.object({
  body: z3.object({
    email: emailSchema,
    otp: z3.string("OTP is required").trim().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
  })
});
var changePasswordSchema = z3.object({
  body: z3.object({
    currentPassword: z3.string("Current password is required").min(1, "Current password is required"),
    newPassword: passwordSchema2,
    confirmNewPassword: z3.string("Please confirm your new password").min(1, "Please confirm your new password")
  })
}).refine((data) => data.body.newPassword === data.body.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["body", "confirmNewPassword"]
}).refine((data) => data.body.currentPassword !== data.body.newPassword, {
  message: "New password must be different from the current password",
  path: ["body", "newPassword"]
});
var forgotPasswordSchema = z3.object({
  body: z3.object({
    email: emailSchema
  })
});
var resetPasswordSchema = z3.object({
  body: z3.object({
    token: z3.string("Reset token is required").min(1, "Reset token is required"),
    newPassword: passwordSchema2,
    confirmNewPassword: z3.string("Please confirm your new password").min(1, "Please confirm your new password")
  })
}).refine((data) => data.body.newPassword === data.body.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["body", "confirmNewPassword"]
});
var verifyEmailSchema = z3.object({
  body: z3.object({
    token: z3.string("Verification token is required").min(1, "Verification token is required")
  })
});
var refreshTokenSchema = z3.object({
  cookies: z3.object({
    refreshToken: z3.string("Refresh token is required").min(1, "Refresh token is required")
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
var router2 = Router2();
router2.post("/register", validateRequest(AuthValidation.registerSchema), AuthController.registerUser);
router2.post("/apply", validateRequest(ApplyForInstitutionValidationSchema.applyForInstitutionSchema));
router2.post("/login", validateRequest(AuthValidation.loginSchema), AuthController.loginUser);
router2.post(
  "/otp/status",
  validateRequest(AuthValidation.otpBaseSchema),
  AuthController.getOtpStatus
);
router2.post(
  "/otp/resend",
  validateRequest(AuthValidation.otpBaseSchema),
  AuthController.resendOtp
);
router2.post(
  "/otp/verify",
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthController.verifyOtp
);
router2.get(
  "/me",
  requireSessionRole("SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"),
  AuthController.getCurrentUserProfile
);
var AuthRoutes = router2;

// src/app/module/facultyProfile/facultyProfile.route.ts
import { Router as Router3 } from "express";

// src/app/module/facultyProfile/facultyProfile.service.ts
function createHttpError3(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
var updateFacultyDisplayName = async (userId, payload) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (adminProfile?.role !== AdminRole.FACULTYADMIN) {
    throw createHttpError3(403, "Only faculty admins can update faculty display name");
  }
  const normalizedName = (payload.fullName ?? payload.name ?? "").trim();
  const hasFacultyMutation = Boolean(payload.fullName || payload.name || payload.shortName || payload.description) || Boolean(payload.facultyId);
  if (hasFacultyMutation && !normalizedName) {
    throw createHttpError3(400, "Full name is required when updating faculty details");
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
          throw createHttpError3(
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
        throw createHttpError3(404, "Faculty not found");
      }
      if (!targetFaculty.institutionId || targetFaculty.institutionId !== adminProfile.institutionId) {
        throw createHttpError3(403, "You can only update faculty under your institution");
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
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (adminProfile?.role !== AdminRole.FACULTYADMIN) {
    throw createHttpError3(403, "Only faculty admins can view faculty profile");
  }
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
      institutionLogo: true
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
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId
    },
    select: {
      role: true,
      institutionId: true
    }
  });
  if (adminProfile?.role !== AdminRole.FACULTYADMIN) {
    throw createHttpError3(403, "Only faculty admins can create departments");
  }
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
      throw createHttpError3(404, "Faculty not found for this institution");
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
      throw createHttpError3(
        404,
        "No faculty found for this institution. Update faculty profile first"
      );
    }
    if (faculties.length > 1) {
      throw createHttpError3(400, "Multiple faculties found. Please provide facultyId");
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
import { z as z4 } from "zod";
var FacultyProfileValidation = {
  createDepartmentSchema: z4.object({
    body: z4.object({
      fullName: z4.string("Department full name is required").trim().min(2, "Department full name must be at least 2 characters long").max(120, "Department full name must not exceed 120 characters"),
      shortName: z4.string("Department short name must be a string").trim().min(2, "Department short name must be at least 2 characters long").max(30, "Department short name must not exceed 30 characters").optional(),
      description: z4.string("Department description must be a string").trim().min(3, "Department description must be at least 3 characters long").max(500, "Department description must not exceed 500 characters").optional(),
      facultyId: z4.uuid("Please provide a valid faculty id").optional()
    })
  }),
  updateFacultyDisplayNameSchema: z4.object({
    body: z4.object({
      name: z4.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(80, "Name must not exceed 80 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Name must only contain letters, spaces, hyphens or apostrophes"
      ).optional(),
      fullName: z4.string("Full name is required").trim().min(2, "Full name must be at least 2 characters long").max(80, "Full name must not exceed 80 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Full name must only contain letters, spaces, hyphens or apostrophes"
      ).optional(),
      facultyId: z4.uuid("Please provide a valid faculty id").optional(),
      shortName: z4.string("Short name must be a string").trim().min(2, "Short name must be at least 2 characters long").max(30, "Short name must not exceed 30 characters").optional(),
      description: z4.string("Description must be a string").trim().min(3, "Description must be at least 3 characters long").max(500, "Description must not exceed 500 characters").optional(),
      image: z4.url("image must be a valid URL").trim().optional(),
      contactNo: z4.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z4.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z4.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z4.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z4.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  })
};

// src/app/module/facultyProfile/facultyProfile.route.ts
var router3 = Router3();
router3.get(
  "/profile",
  requireSessionRole("ADMIN", "FACULTY"),
  FacultyProfileController.getFacultyProfileDetails
);
router3.patch(
  "/profile/name",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(FacultyProfileValidation.updateFacultyDisplayNameSchema),
  FacultyProfileController.updateFacultyDisplayName
);
router3.post(
  "/departments",
  requireSessionRole("ADMIN", "FACULTY"),
  validateRequest(FacultyProfileValidation.createDepartmentSchema),
  FacultyProfileController.createDepartment
);
var FacultyProfileRouter = router3;

// src/app/module/institute/institute.route.ts
import { Router as Router4 } from "express";

// src/app/module/institute/interface.validation.ts
import z5 from "zod";
var createInstitutionSchema = z5.object({
  body: z5.object({
    name: z5.string("Institution name is required").min(1, "Institution name is required"),
    description: z5.string("Institution description is required").min(1, "Institution description is required"),
    shortName: z5.string("Institution short name is required").min(1, "Institution short name is required"),
    type: z5.enum([InstitutionType.UNIVERSITY, InstitutionType.COLLEGE, InstitutionType.SCHOOL, InstitutionType.TRAINING_CENTER, InstitutionType.OTHER], {
      message: `Invalid institution type. Must be one of: ${InstitutionType.UNIVERSITY}, ${InstitutionType.COLLEGE}, ${InstitutionType.SCHOOL}, ${InstitutionType.TRAINING_CENTER}, ${InstitutionType.OTHER}`
    }),
    institutionLogo: z5.string("Institution logo is required").min(1, "Institution logo is required")
  })
});
var InstituteValidation = {
  createInstitutionSchema
};

// src/app/module/institute/institute.service.ts
var createInstitution = async (payload) => {
  const data = await prisma.institution.create({
    data: payload
  });
  if (!data) {
    throw new Error("Failed to create institution");
  }
  return data;
};
var InstituteService = {
  createInstitution
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
var InstituteController = {
  createInstitution: createInstitution2
};

// src/app/module/institute/institute.route.ts
var router4 = Router4();
router4.post("/create", validateRequest(InstituteValidation.createInstitutionSchema), InstituteController.createInstitution);
var InstituteRoutes = router4;

// src/app/module/institutionAdmin/institutionAdmin.route.ts
import { Router as Router5 } from "express";

// src/app/module/institutionAdmin/institutionAdmin.service.ts
function createHttpError4(statusCode, message) {
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
function normalizeSearch2(search) {
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
    throw createHttpError4(403, "Only institution admins can manage semesters");
  }
  if (creatorAdminProfile.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError4(403, "Only institution admins can manage semesters");
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
    throw createHttpError4(400, "Invalid startDate or endDate");
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate <= today) {
    throw createHttpError4(400, "startDate must be after today");
  }
  if (startDate >= endDate) {
    throw createHttpError4(400, "startDate must be before endDate");
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
    throw createHttpError4(404, "Semester not found for this institution");
  }
  let nextStartDate = existingSemester.startDate;
  let nextEndDate = existingSemester.endDate;
  if (payload.startDate) {
    const parsedStartDate = new Date(payload.startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw createHttpError4(400, "Invalid startDate");
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedStartDate <= today) {
      throw createHttpError4(400, "startDate must be after today");
    }
    nextStartDate = parsedStartDate;
  }
  if (payload.endDate) {
    const parsedEndDate = new Date(payload.endDate);
    if (Number.isNaN(parsedEndDate.getTime())) {
      throw createHttpError4(400, "Invalid endDate");
    }
    nextEndDate = parsedEndDate;
  }
  if (nextStartDate >= nextEndDate) {
    throw createHttpError4(400, "startDate must be before endDate");
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
    throw createHttpError4(404, "Semester not found for this institution");
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
    throw createHttpError4(403, "Only institution-level admins can view faculties");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, "DEPARTMENT")) {
    throw createHttpError4(403, "You are not allowed to view faculties for department creation");
  }
  const normalizedSearch = normalizeSearch2(search);
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
    throw createHttpError4(403, "Only institution-level admins can create sub-admin accounts");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, payload.accountType)) {
    throw createHttpError4(
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
    throw createHttpError4(500, "Failed to create account");
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
        throw createHttpError4(404, "Faculty not found for this institution");
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
          throw createHttpError4(
            400,
            "Cannot create department without a faculty. Provide faculty fields first"
          );
        }
        if (faculties.length > 1) {
          throw createHttpError4(
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
var readParam2 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue2 = (value) => {
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
    readQueryValue2(req.query.search)
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
var deleteSemester2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await InstitutionAdminService.deleteSemester(
    user.id,
    readParam2(req.params.semesterId)
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
import { z as z6 } from "zod";
var passwordSchema3 = z6.string("Password is required").min(8, "Password must be at least 8 characters long").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
var InstitutionAdminValidation = {
  semesterParamsSchema: z6.object({
    params: z6.object({
      semesterId: z6.uuid("Please provide a valid semester id")
    })
  }),
  createSemesterSchema: z6.object({
    body: z6.object({
      name: z6.string("Semester name is required").trim().min(2).max(80),
      startDate: z6.iso.datetime("startDate must be a valid ISO datetime"),
      endDate: z6.iso.datetime("endDate must be a valid ISO datetime")
    })
  }),
  updateSemesterSchema: z6.object({
    params: z6.object({
      semesterId: z6.uuid("Please provide a valid semester id")
    }),
    body: z6.object({
      name: z6.string("Semester name must be a string").trim().min(2).max(80).optional(),
      startDate: z6.iso.datetime("startDate must be a valid ISO datetime").optional(),
      endDate: z6.iso.datetime("endDate must be a valid ISO datetime").optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  updateProfileSchema: z6.object({
    body: z6.object({
      name: z6.string("name must be a string").trim().min(2).max(120).optional(),
      image: z6.url("image must be a valid URL").trim().optional(),
      contactNo: z6.string("contactNo must be a string").trim().max(30).optional(),
      presentAddress: z6.string("presentAddress must be a string").trim().max(300).optional(),
      permanentAddress: z6.string("permanentAddress must be a string").trim().max(300).optional(),
      bloodGroup: z6.string("bloodGroup must be a string").trim().max(10).optional(),
      gender: z6.string("gender must be a string").trim().max(20).optional()
    }).refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required"
    })
  }),
  createSubAdminSchema: z6.object({
    body: z6.object({
      name: z6.string("Name is required").trim().min(2, "Name must be at least 2 characters long").max(60, "Name must not exceed 60 characters").regex(
        /^[a-zA-Z\s'-]+$/,
        "Name must only contain letters, spaces, hyphens or apostrophes"
      ),
      email: z6.email("Please provide a valid email address").toLowerCase().trim(),
      password: passwordSchema3,
      accountType: z6.enum(["FACULTY", "DEPARTMENT"]),
      facultyId: z6.uuid("Please provide a valid faculty id").optional(),
      facultyFullName: z6.string("Faculty full name must be a string").trim().min(2, "Faculty full name must be at least 2 characters long").max(120, "Faculty full name must not exceed 120 characters").optional(),
      facultyShortName: z6.string("Faculty short name must be a string").trim().min(2, "Faculty short name must be at least 2 characters long").max(30, "Faculty short name must not exceed 30 characters").optional(),
      facultyDescription: z6.string("Faculty description must be a string").trim().min(3, "Faculty description must be at least 3 characters long").max(500, "Faculty description must not exceed 500 characters").optional(),
      departmentFullName: z6.string("Department full name must be a string").trim().min(2, "Department full name must be at least 2 characters long").max(120, "Department full name must not exceed 120 characters").optional(),
      departmentShortName: z6.string("Department short name must be a string").trim().min(2, "Department short name must be at least 2 characters long").max(30, "Department short name must not exceed 30 characters").optional(),
      departmentDescription: z6.string("Department description must be a string").trim().min(3, "Department description must be at least 3 characters long").max(500, "Department description must not exceed 500 characters").optional()
    })
  })
};

// src/app/module/institutionAdmin/institutionAdmin.route.ts
var router5 = Router5();
router5.get(
  "/dashboard-summary",
  requireAdminRole(),
  InstitutionAdminController.getDashboardSummary
);
router5.patch(
  "/profile",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.updateProfileSchema),
  InstitutionAdminController.updateProfile
);
router5.get("/faculties", requireAdminRole(), InstitutionAdminController.listFaculties);
router5.get("/semesters", requireAdminRole(), InstitutionAdminController.listSemesters);
router5.post(
  "/semesters",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.createSemesterSchema),
  InstitutionAdminController.createSemester
);
router5.patch(
  "/semesters/:semesterId",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.updateSemesterSchema),
  InstitutionAdminController.updateSemester
);
router5.delete(
  "/semesters/:semesterId",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.semesterParamsSchema),
  InstitutionAdminController.deleteSemester
);
router5.post(
  "/sub-admins",
  requireAdminRole(),
  validateRequest(InstitutionAdminValidation.createSubAdminSchema),
  InstitutionAdminController.createSubAdminAccount
);
var InstitutionAdminRouter = router5;

// src/app/module/institutionApplication/institutionApplication.route.ts
import { Router as Router6 } from "express";

// src/app/module/institutionApplication/institutionApplication.service.ts
function createHttpError5(statusCode, message) {
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
    throw createHttpError5(400, "You are already assigned to an institution");
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
    throw createHttpError5(400, "You already have a pending application");
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
    throw createHttpError5(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError5(400, "Application already reviewed");
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
import z7 from "zod";
var InstitutionApplicationValidation = {
  createSchema: z7.object({
    body: z7.object({
      institutionName: z7.string().min(2, "Institution name is required"),
      description: z7.string().max(500, "Description is too long").optional(),
      shortName: z7.string().min(2, "Short name must be at least 2 characters").max(50, "Short name is too long").optional(),
      institutionType: z7.enum([
        InstitutionType.SCHOOL,
        InstitutionType.COLLEGE,
        InstitutionType.UNIVERSITY,
        InstitutionType.TRAINING_CENTER,
        InstitutionType.OTHER
      ]),
      institutionLogo: z7.string().url("Institution logo must be a valid URL").optional()
    })
  }),
  reviewSchema: z7.object({
    body: z7.object({
      status: z7.enum([
        InstitutionApplicationStatus.APPROVED,
        InstitutionApplicationStatus.REJECTED
      ]),
      rejectionReason: z7.string().max(500, "Rejection reason is too long").optional()
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
var router6 = Router6();
router6.post(
  "/admin/apply",
  requireAdminRole(),
  validateRequest(InstitutionApplicationValidation.createSchema),
  InstitutionApplicationController.create
);
router6.get(
  "/admin/my-applications",
  requireAdminRole(),
  InstitutionApplicationController.myApplications
);
router6.get(
  "/superadmin",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.listForSuperAdmin
);
router6.get(
  "/superadmin-summary",
  requireSessionRole("SUPERADMIN"),
  InstitutionApplicationController.getSuperAdminSummary
);
router6.patch(
  "/superadmin/:applicationId/review",
  requireSessionRole("SUPERADMIN"),
  validateRequest(InstitutionApplicationValidation.reviewSchema),
  InstitutionApplicationController.review
);
var InstitutionApplicationRouter = router6;

// src/app/module/posting/posting.route.ts
import { Router as Router7 } from "express";

// src/app/module/posting/posting.service.ts
function createHttpError6(statusCode, message) {
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
    throw createHttpError6(403, "Only admin users under an institution can manage postings");
  }
  return adminProfile;
}
async function resolveScopedIds(userId, payload) {
  const context = await resolveAdminContext(userId);
  if (context.role === AdminRole.INSTITUTIONADMIN) {
    if (!payload.facultyId || !payload.departmentId) {
      throw createHttpError6(
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
      throw createHttpError6(404, "Faculty not found for this institution");
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
      throw createHttpError6(404, "Department not found under selected faculty");
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
      throw createHttpError6(400, "Faculty admin must provide departmentId");
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
      throw createHttpError6(404, "Department not found for this institution");
    }
    if (!department.facultyId) {
      throw createHttpError6(400, "Department is not assigned to a faculty");
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
      throw createHttpError6(404, "Department not found for this institution");
    }
    if (departments.length > 1) {
      throw createHttpError6(400, "Multiple departments found. Contact institution admin to resolve mapping");
    }
    return {
      institutionId: context.institutionId,
      facultyId: departments[0].facultyId,
      departmentId: departments[0].id,
      programId: null
    };
  }
  throw createHttpError6(403, "Unsupported admin role for posting management");
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
  throw createHttpError6(403, "Unsupported admin role for posting options");
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
var readQueryValue3 = (value) => {
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
  const result = await PostingService.getPostingOptions(user.id, readQueryValue3(req.query.search));
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
import { z as z8 } from "zod";
var uuidSchema2 = z8.uuid("Please provide a valid id");
var createPostingSchema = z8.object({
  body: z8.object({
    title: z8.string("Title is required").trim().min(2).max(150),
    location: z8.string("Location must be a string").trim().min(2).max(150).optional(),
    summary: z8.string("Summary is required").trim().min(10).max(600),
    details: z8.array(z8.string("Detail must be a string").trim().min(2).max(300)).max(20).optional(),
    facultyId: uuidSchema2.optional(),
    departmentId: uuidSchema2.optional()
  })
});
var listPublicPostingSchema = z8.object({
  query: z8.object({
    limit: z8.string("limit must be a number").regex(/^\d+$/, "limit must be a positive integer").optional()
  })
});
var PostingValidation = {
  createPostingSchema,
  listPublicPostingSchema
};

// src/app/module/posting/posting.route.ts
var router7 = Router7();
router7.get(
  "/teacher/public",
  validateRequest(PostingValidation.listPublicPostingSchema),
  PostingController.listTeacherJobPostsPublic
);
router7.get(
  "/student/public",
  validateRequest(PostingValidation.listPublicPostingSchema),
  PostingController.listStudentAdmissionPostsPublic
);
router7.get(
  "/options",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  PostingController.getPostingOptions
);
router7.post(
  "/teacher",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.createPostingSchema),
  PostingController.createTeacherJobPost
);
router7.post(
  "/student",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.createPostingSchema),
  PostingController.createStudentAdmissionPost
);
var PostingRouter = router7;

// src/app/module/student/student.route.ts
import { Router as Router8 } from "express";

// src/app/module/student/student.service.ts
var LAB_MARKS_MAX = {
  attendance: 10
};
var THEORY_MARKS_MAX = {
  attendance: 7
};
function createHttpError7(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch4(search) {
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
    throw createHttpError7(
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
    throw createHttpError7(404, "Student account not found");
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
    throw createHttpError7(403, "Student is not assigned to any institution yet");
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
  const normalizedSearch = normalizeSearch4(query.search);
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
  const normalizedSearch = normalizeSearch4(query.search);
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
    throw createHttpError7(404, "Classwork not found");
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
    throw createHttpError7(403, "You are not registered in this classwork section");
  }
  return {
    classwork,
    registration
  };
};
var listSubmissions = async (userId, query) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const normalizedSearch = normalizeSearch4(query.search);
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
    throw createHttpError7(409, "Submission already exists. Please update it.");
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
    throw createHttpError7(404, "Submission not found");
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
    throw createHttpError7(404, "Submission not found");
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
    throw createHttpError7(409, "Application profile already exists. Use update instead.");
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
    throw createHttpError7(404, "Application profile not found");
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
    throw createHttpError7(404, "Application profile not found");
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
    throw createHttpError7(
      400,
      "Complete your application profile and upload required documents before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError7(400, "You are already assigned to an institution");
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
    throw createHttpError7(404, "Student admission posting not found");
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
    throw createHttpError7(409, "You already applied to this admission post");
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
    throw createHttpError7(403, "Student is not assigned to a department yet");
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
    throw createHttpError7(403, "Student is not assigned to a department yet");
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
    throw createHttpError7(404, "No fee configuration found for the selected semester/session");
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
    throw createHttpError7(409, "No due amount left for this semester/session");
  }
  const mode = payload.paymentMode;
  let requestedAmount = dueAmount;
  let monthsCovered = 0;
  if (mode === FEE_PAYMENT_MODE_MONTHLY) {
    const monthsCount = payload.monthsCount ?? 0;
    if (!monthsCount || monthsCount < 1) {
      throw createHttpError7(400, "monthsCount must be at least 1 for monthly payment");
    }
    requestedAmount = toMoneyNumber2(Math.min(dueAmount, monthlyFeeAmount * monthsCount));
    monthsCovered = monthsCount;
  } else {
    monthsCovered = Math.max(1, Math.ceil(dueAmount / Math.max(monthlyFeeAmount, 1)));
  }
  if (requestedAmount <= 0) {
    throw createHttpError7(400, "Invalid payment amount");
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
    throw createHttpError7(502, failureMessage);
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
var readParam3 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue4 = (value) => {
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
    readParam3(req.params.postingId),
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
  const search = readQueryValue4(req.query.search);
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
  const search = readQueryValue4(req.query.search);
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
  const search = readQueryValue4(req.query.search);
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
  const result = await StudentService.updateSubmission(user.id, readParam3(req.params.submissionId), req.body);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Submission updated successfully",
    data: result
  });
});
var deleteSubmission2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const result = await StudentService.deleteSubmission(user.id, readParam3(req.params.submissionId));
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
var handleFeePaymentSuccessRedirect = catchAsync(async (req, res) => {
  const result = await StudentService.handleFeeGatewayCallback(
    "success",
    req.query
  );
  res.redirect(302, result.redirectUrl);
});
var handleFeePaymentFailureRedirect = catchAsync(async (req, res) => {
  const result = await StudentService.handleFeeGatewayCallback(
    "failed",
    req.query
  );
  res.redirect(302, result.redirectUrl);
});
var handleFeePaymentCancelRedirect = catchAsync(async (req, res) => {
  const result = await StudentService.handleFeeGatewayCallback(
    "cancelled",
    req.query
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
import { z as z9 } from "zod";
var uuidSchema3 = z9.uuid("Please provide a valid id");
var classworkTypeSchema = z9.enum(["TASK", "ASSIGNMENT", "QUIZ", "NOTICE"]);
var studentAcademicRecordSchema = z9.object({
  examName: z9.string("examName is required").trim().min(2).max(120),
  institute: z9.string("institute is required").trim().min(2).max(180),
  result: z9.string("result is required").trim().min(1).max(60),
  year: z9.number("year must be a number").int().min(1950).max(2100)
});
var createStudentApplicationProfileSchema = z9.object({
  body: z9.object({
    headline: z9.string("headline is required").trim().min(2).max(180),
    about: z9.string("about is required").trim().min(20).max(5e3),
    documentUrls: z9.array(z9.url("document URL must be valid").trim()).min(1),
    academicRecords: z9.array(studentAcademicRecordSchema).min(1)
  })
});
var updateStudentApplicationProfileSchema = z9.object({
  body: z9.object({
    headline: z9.string("headline must be a string").trim().min(2).max(180).optional(),
    about: z9.string("about must be a string").trim().min(20).max(5e3).optional(),
    documentUrls: z9.array(z9.url("document URL must be valid").trim()).optional(),
    academicRecords: z9.array(studentAcademicRecordSchema).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var createAdmissionApplicationSchema = z9.object({
  params: z9.object({
    postingId: uuidSchema3
  }),
  body: z9.object({
    coverLetter: z9.string("coverLetter must be a string").trim().max(2500).optional()
  })
});
var listTimelineSchema = z9.object({
  query: z9.object({
    semesterId: uuidSchema3.optional(),
    type: classworkTypeSchema.optional()
  })
});
var listRegisteredCoursesSchema = z9.object({
  query: z9.object({
    semesterId: uuidSchema3.optional()
  })
});
var listResultsSchema = z9.object({
  query: z9.object({
    semesterId: uuidSchema3
  })
});
var createSubmissionSchema = z9.object({
  body: z9.object({
    classworkId: uuidSchema3,
    responseText: z9.string("responseText must be a string").trim().max(5e3, "responseText must be at most 5000 characters").optional(),
    attachmentUrl: z9.url("attachmentUrl must be a valid URL").trim().optional(),
    attachmentName: z9.string("attachmentName must be a string").trim().max(200, "attachmentName must be at most 200 characters").optional()
  }).refine((value) => Boolean(value.responseText?.trim()) || Boolean(value.attachmentUrl?.trim()), {
    message: "responseText or attachmentUrl is required"
  })
});
var updateSubmissionSchema = z9.object({
  params: z9.object({
    submissionId: uuidSchema3
  }),
  body: z9.object({
    responseText: z9.string("responseText must be a string").trim().max(5e3, "responseText must be at most 5000 characters").optional(),
    attachmentUrl: z9.url("attachmentUrl must be a valid URL").trim().optional(),
    attachmentName: z9.string("attachmentName must be a string").trim().max(200, "attachmentName must be at most 200 characters").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var deleteSubmissionSchema = z9.object({
  params: z9.object({
    submissionId: uuidSchema3
  })
});
var listSubmissionsSchema = z9.object({
  query: z9.object({
    classworkId: uuidSchema3.optional(),
    semesterId: uuidSchema3.optional()
  })
});
var updateProfileSchema = z9.object({
  body: z9.object({
    name: z9.string("name must be a string").trim().min(2).max(120).optional(),
    image: z9.url("image must be a valid URL").trim().optional(),
    bio: z9.string("bio must be a string").trim().max(1200).optional(),
    contactNo: z9.string("contactNo must be a string").trim().max(30).optional(),
    presentAddress: z9.string("presentAddress must be a string").trim().max(300).optional(),
    permanentAddress: z9.string("permanentAddress must be a string").trim().max(300).optional(),
    bloodGroup: z9.string("bloodGroup must be a string").trim().max(10).optional(),
    gender: z9.string("gender must be a string").trim().max(20).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var initiateFeePaymentSchema = z9.object({
  body: z9.object({
    semesterId: uuidSchema3,
    paymentMode: z9.enum(["MONTHLY", "FULL"]),
    monthsCount: z9.number().int().positive().max(12).optional()
  }).refine(
    (value) => value.paymentMode === "MONTHLY" ? Boolean(value.monthsCount) : true,
    {
      path: ["monthsCount"],
      message: "monthsCount is required when paymentMode is MONTHLY"
    }
  )
});
var feeGatewayCallbackSchema = z9.object({
  query: z9.object({
    tran_id: z9.string().trim().min(3),
    val_id: z9.string().trim().min(1).optional(),
    amount: z9.string().trim().min(1).optional(),
    currency: z9.string().trim().min(1).optional(),
    status: z9.string().trim().min(1).optional()
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
var router8 = Router8();
router8.get("/profile", requireSessionRole("STUDENT"), StudentController.getProfileOverview);
router8.get(
  "/application-profile",
  requireSessionRole("STUDENT"),
  StudentController.getApplicationProfile
);
router8.post(
  "/application-profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createStudentApplicationProfileSchema),
  StudentController.createApplicationProfile
);
router8.patch(
  "/application-profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateStudentApplicationProfileSchema),
  StudentController.updateApplicationProfile
);
router8.delete(
  "/application-profile",
  requireSessionRole("STUDENT"),
  StudentController.deleteApplicationProfile
);
router8.post(
  "/admission-applications/:postingId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createAdmissionApplicationSchema),
  StudentController.applyToAdmissionPosting
);
router8.get(
  "/admission-applications",
  requireSessionRole("STUDENT"),
  StudentController.listMyAdmissionApplications
);
router8.patch(
  "/profile",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateProfileSchema),
  StudentController.updateProfile
);
router8.get(
  "/timeline",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listTimelineSchema),
  StudentController.listTimeline
);
router8.get(
  "/registered-courses",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listRegisteredCoursesSchema),
  StudentController.listRegisteredCourses
);
router8.get(
  "/results",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listResultsSchema),
  StudentController.listResults
);
router8.get(
  "/submissions",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.listSubmissionsSchema),
  StudentController.listSubmissions
);
router8.post(
  "/submissions",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.createSubmissionSchema),
  StudentController.createSubmission
);
router8.patch(
  "/submissions/:submissionId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.updateSubmissionSchema),
  StudentController.updateSubmission
);
router8.delete(
  "/submissions/:submissionId",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.deleteSubmissionSchema),
  StudentController.deleteSubmission
);
router8.get("/fees/payment/success", StudentController.handleFeePaymentSuccessRedirect);
router8.get("/fees/payment/fail", StudentController.handleFeePaymentFailureRedirect);
router8.get("/fees/payment/cancel", StudentController.handleFeePaymentCancelRedirect);
router8.get("/fees", requireSessionRole("STUDENT"), StudentController.getFeeOverview);
router8.post(
  "/fees/initiate",
  requireSessionRole("STUDENT"),
  validateRequest(StudentValidation.initiateFeePaymentSchema),
  StudentController.initiateFeePayment
);
var StudentRouter = router8;

// src/app/module/teacher/teacher.route.ts
import { Router as Router9 } from "express";

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
function createHttpError8(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function normalizeSearch5(search) {
  const value = search?.trim();
  return value || void 0;
}
function normalizeDateToMidnight(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError8(400, "Invalid date");
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
    throw createHttpError8(400, `${fieldName} cannot be negative`);
  }
  if (value > maxValue) {
    throw createHttpError8(400, `${fieldName} cannot exceed ${maxValue}`);
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
    throw createHttpError8(404, "User not found");
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
    throw createHttpError8(403, "Teacher is not assigned to any institution yet");
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
    throw createHttpError8(403, "Only institution admins can perform this action");
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
    throw createHttpError8(409, "Application profile already exists. Use update instead.");
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
    throw createHttpError8(404, "Application profile not found");
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
    throw createHttpError8(404, "Application profile not found");
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
    throw createHttpError8(
      400,
      "Complete your application profile (academic records, experiences, resume, and skills) before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError8(400, "You are already assigned to an institution");
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
    throw createHttpError8(404, "Teacher posting not found");
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
    throw createHttpError8(409, "You already applied to this posting");
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
  const normalizedSearch = normalizeSearch5(search);
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
var listClassworks = async (userId, query) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const normalizedSearch = normalizeSearch5(query.search);
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
      throw createHttpError8(403, "You are not assigned to this section");
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
    throw createHttpError8(403, "You are not assigned to this section");
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
    throw createHttpError8(404, "Classwork not found");
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
    throw createHttpError8(404, "Classwork not found");
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
    throw createHttpError8(404, "No students found for this section");
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
    throw createHttpError8(404, "No students found for this section");
  }
  const allowedRegistrationIds = new Set(registrations.map((item) => item.id));
  for (const item of payload.items) {
    if (!allowedRegistrationIds.has(item.courseRegistrationId)) {
      throw createHttpError8(400, "One or more attendance records are outside your assigned section");
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
    throw createHttpError8(404, "No students found for this section");
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
    throw createHttpError8(404, "Course registration not found for this teacher");
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
      throw createHttpError8(400, `${field} is not allowed for this course type`);
    }
    enforceMaxMark(value, max, field);
    dataToSave[field] = toTwoDecimals2(value);
  }
  if (Object.keys(dataToSave).length === 0) {
    throw createHttpError8(400, "No valid marks field provided for this course type");
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
    throw createHttpError8(404, "Application not found");
  }
  if (application.status === TeacherJobApplicationStatus.APPROVED || application.status === TeacherJobApplicationStatus.REJECTED) {
    throw createHttpError8(400, "Application has already been reviewed");
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
    throw createHttpError8(400, "departmentId is required to approve this application");
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
    throw createHttpError8(404, "Department not found for this institution");
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
      throw createHttpError8(400, "teacherInitial, teachersId and designation are required for approval");
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
var readParam4 = (value) => Array.isArray(value) ? value[0] : value ?? "";
var readQueryValue5 = (value) => {
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
    readParam4(req.params.postingId),
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
    readQueryValue5(req.query.search)
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Sections fetched successfully",
    data: result
  });
});
var listClassworks2 = catchAsync(async (req, res) => {
  const user = res.locals.authUser;
  const sectionId = typeof req.query.sectionId === "string" ? req.query.sectionId : void 0;
  const type = typeof req.query.type === "string" ? req.query.type : void 0;
  const search = readQueryValue5(req.query.search);
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
    readParam4(req.params.classworkId),
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
  const result = await TeacherService.deleteClasswork(user.id, readParam4(req.params.classworkId));
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
    readParam4(req.params.courseRegistrationId),
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
    readParam4(req.params.applicationId),
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
import { z as z10 } from "zod";
var uuidSchema4 = z10.uuid("Please provide a valid id");
var classworkTypeSchema2 = z10.enum(["TASK", "ASSIGNMENT", "QUIZ", "NOTICE"]);
var attendanceStatusSchema = z10.enum(["PRESENT", "ABSENT"]);
var markFieldSchema = z10.number("Mark must be a number").min(0, "Mark cannot be negative").max(100, "Mark cannot exceed 100");
var createJobApplicationSchema = z10.object({
  params: z10.object({
    postingId: uuidSchema4
  }),
  body: z10.object({
    coverLetter: z10.string("Cover letter must be a string").trim().min(10, "Cover letter must be at least 10 characters").max(2500, "Cover letter must not exceed 2500 characters").optional()
  })
});
var academicRecordSchema = z10.object({
  degree: z10.string("degree is required").trim().min(2).max(120),
  institute: z10.string("institute is required").trim().min(2).max(180),
  result: z10.string("result is required").trim().min(1).max(60),
  year: z10.number("year must be a number").int().min(1950).max(2100)
});
var experienceRecordSchema = z10.object({
  organization: z10.string("organization is required").trim().min(2).max(180),
  title: z10.string("title is required").trim().min(2).max(120),
  startDate: z10.iso.datetime("startDate must be a valid ISO datetime"),
  endDate: z10.iso.datetime("endDate must be a valid ISO datetime").optional(),
  responsibilities: z10.string("responsibilities must be a string").trim().max(2e3).optional()
});
var createTeacherApplicationProfileSchema = z10.object({
  body: z10.object({
    headline: z10.string("headline is required").trim().min(2).max(180),
    about: z10.string("about is required").trim().min(20).max(5e3),
    resumeUrl: z10.url("resumeUrl must be a valid URL").trim(),
    portfolioUrl: z10.url("portfolioUrl must be a valid URL").trim().optional(),
    skills: z10.array(z10.string("skill must be a string").trim().min(1).max(60)).min(1, "At least one skill is required"),
    certifications: z10.array(z10.string("certification must be a string").trim().min(1).max(120)).optional(),
    academicRecords: z10.array(academicRecordSchema).min(1, "At least one academic record is required"),
    experiences: z10.array(experienceRecordSchema).min(1, "At least one experience record is required")
  })
});
var updateTeacherApplicationProfileSchema = z10.object({
  body: z10.object({
    headline: z10.string("headline must be a string").trim().min(2).max(180).optional(),
    about: z10.string("about must be a string").trim().min(20).max(5e3).optional(),
    resumeUrl: z10.url("resumeUrl must be a valid URL").trim().optional(),
    portfolioUrl: z10.url("portfolioUrl must be a valid URL").trim().optional(),
    skills: z10.array(z10.string("skill must be a string").trim().min(1).max(60)).optional(),
    certifications: z10.array(z10.string("certification must be a string").trim().min(1).max(120)).optional(),
    academicRecords: z10.array(academicRecordSchema).optional(),
    experiences: z10.array(experienceRecordSchema).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var updateProfileSchema2 = z10.object({
  body: z10.object({
    name: z10.string("name must be a string").trim().min(2).max(120).optional(),
    image: z10.url("image must be a valid URL").trim().optional(),
    bio: z10.string("bio must be a string").trim().max(1200).optional(),
    designation: z10.string("designation must be a string").trim().min(2).max(80).optional(),
    contactNo: z10.string("contactNo must be a string").trim().max(30).optional(),
    presentAddress: z10.string("presentAddress must be a string").trim().max(300).optional(),
    permanentAddress: z10.string("permanentAddress must be a string").trim().max(300).optional(),
    bloodGroup: z10.string("bloodGroup must be a string").trim().max(10).optional(),
    gender: z10.string("gender must be a string").trim().max(20).optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var listClassworksSchema = z10.object({
  query: z10.object({
    sectionId: uuidSchema4.optional(),
    type: classworkTypeSchema2.optional(),
    search: z10.string("search must be a string").trim().max(120).optional()
  })
});
var createClassworkSchema = z10.object({
  body: z10.object({
    sectionId: uuidSchema4,
    type: classworkTypeSchema2,
    title: z10.string("Title is required").trim().min(2).max(180),
    content: z10.string("Content must be a string").trim().max(3e3, "Content must not exceed 3000 characters").optional(),
    dueAt: z10.iso.datetime("dueAt must be a valid ISO datetime").optional()
  })
});
var updateClassworkSchema = z10.object({
  params: z10.object({
    classworkId: uuidSchema4
  }),
  body: z10.object({
    type: classworkTypeSchema2.optional(),
    title: z10.string("Title must be a string").trim().min(2).max(180).optional(),
    content: z10.string("Content must be a string").trim().max(3e3, "Content must not exceed 3000 characters").optional(),
    dueAt: z10.iso.datetime("dueAt must be a valid ISO datetime").optional()
  }).refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});
var deleteClassworkSchema = z10.object({
  params: z10.object({
    classworkId: uuidSchema4
  })
});
var getSectionAttendanceSchema = z10.object({
  query: z10.object({
    sectionId: uuidSchema4,
    date: z10.iso.datetime("date must be a valid ISO datetime")
  })
});
var upsertSectionAttendanceSchema = z10.object({
  body: z10.object({
    sectionId: uuidSchema4,
    date: z10.iso.datetime("date must be a valid ISO datetime"),
    items: z10.array(
      z10.object({
        courseRegistrationId: uuidSchema4,
        status: attendanceStatusSchema
      })
    ).min(1, "At least one attendance item is required")
  })
});
var listSectionMarksSchema = z10.object({
  query: z10.object({
    sectionId: uuidSchema4
  })
});
var upsertMarkSchema = z10.object({
  params: z10.object({
    courseRegistrationId: uuidSchema4
  }),
  body: z10.object({
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
var listTeacherJobApplicationsSchema = z10.object({
  query: z10.object({
    status: z10.enum(["PENDING", "SHORTLISTED", "APPROVED", "REJECTED"]).optional()
  })
});
var reviewTeacherJobApplicationSchema = z10.object({
  params: z10.object({
    applicationId: uuidSchema4
  }),
  body: z10.object({
    status: z10.enum(["SHORTLISTED", "APPROVED", "REJECTED"]),
    responseMessage: z10.string("responseMessage must be a string").trim().max(1200).optional(),
    rejectionReason: z10.string("rejectionReason must be a string").trim().max(1200).optional(),
    teacherInitial: z10.string("teacherInitial must be a string").trim().min(2).max(15).optional(),
    teachersId: z10.string("teachersId must be a string").trim().min(2).max(30).optional(),
    designation: z10.string("designation must be a string").trim().min(2).max(80).optional(),
    bio: z10.string("bio must be a string").trim().max(1200).optional(),
    departmentId: uuidSchema4.optional()
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
var router9 = Router9();
router9.get("/profile", requireSessionRole("TEACHER"), TeacherController.getProfileOverview);
router9.patch(
  "/profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateProfileSchema),
  TeacherController.updateProfile
);
router9.get(
  "/application-profile",
  requireSessionRole("TEACHER"),
  TeacherController.getApplicationProfile
);
router9.post(
  "/application-profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createTeacherApplicationProfileSchema),
  TeacherController.createApplicationProfile
);
router9.patch(
  "/application-profile",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateTeacherApplicationProfileSchema),
  TeacherController.updateApplicationProfile
);
router9.delete(
  "/application-profile",
  requireSessionRole("TEACHER"),
  TeacherController.deleteApplicationProfile
);
router9.post(
  "/job-applications/:postingId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createJobApplicationSchema),
  TeacherController.applyToTeacherJobPosting
);
router9.get(
  "/job-applications",
  requireSessionRole("TEACHER"),
  TeacherController.listMyJobApplications
);
router9.get(
  "/sections",
  requireSessionRole("TEACHER"),
  TeacherController.listAssignedSectionsWithStudents
);
router9.get(
  "/classworks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.listClassworksSchema),
  TeacherController.listClassworks
);
router9.post(
  "/classworks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.createClassworkSchema),
  TeacherController.createClasswork
);
router9.patch(
  "/classworks/:classworkId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.updateClassworkSchema),
  TeacherController.updateClasswork
);
router9.delete(
  "/classworks/:classworkId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.deleteClassworkSchema),
  TeacherController.deleteClasswork
);
router9.get(
  "/attendance",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.getSectionAttendanceSchema),
  TeacherController.getSectionAttendanceForDay
);
router9.post(
  "/attendance",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.upsertSectionAttendanceSchema),
  TeacherController.upsertSectionAttendanceForDay
);
router9.get(
  "/marks",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.listSectionMarksSchema),
  TeacherController.listSectionMarks
);
router9.post(
  "/marks/:courseRegistrationId",
  requireSessionRole("TEACHER"),
  validateRequest(TeacherValidation.upsertMarkSchema),
  TeacherController.upsertSectionMark
);
router9.get(
  "/applications",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(TeacherValidation.listTeacherJobApplicationsSchema),
  TeacherController.listTeacherApplicationsForAdmin
);
router9.patch(
  "/applications/:applicationId/review",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(TeacherValidation.reviewTeacherJobApplicationSchema),
  TeacherController.reviewTeacherApplication
);
var TeacherRouter = router9;

// src/app/routes/index.ts
var router10 = Router10();
router10.use("/auth", AuthRoutes);
router10.use("/department", DepartmentRouter);
router10.use("/faculty", FacultyProfileRouter);
router10.use("/institute", InstituteRoutes);
router10.use("/institution-applications", InstitutionApplicationRouter);
router10.use("/institution-admin", InstitutionAdminRouter);
router10.use("/postings", PostingRouter);
router10.use("/teacher", TeacherRouter);
router10.use("/student", StudentRouter);
var IndexRouters = router10;

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
