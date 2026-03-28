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
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n  emailOtps                            EmailOtp[]\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel EmailOtp {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  otpHash   String\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@index([expiresAt])\n  @@map("email_otps")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                    Program[]\n  batches                     Batch[]\n  courses                     Course[]\n  sections                    Section[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                           @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                         @default(now())\n  updatedAt                   DateTime                         @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  startTime DateTime\n  endTime   DateTime\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"emailOtps","kind":"object","type":"EmailOtp","relationName":"EmailOtpToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"EmailOtp":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"EmailOtpToUser"},{"name":"otpHash","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"email_otps"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","_count","schedule","courseRegistration","routines","classRoom","attendances","teacherProfile","mark","course","courseRegistrations","section","sectionTeacherAssignments","classworks","sections","semester","batch","submissions","classwork","studentProfile","classworkSubmissions","applications","posting","studentUser","reviewerUser","admissionApplications","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","departments","faculties","classrooms","applicantUser","reviewedByUser","institutionApplications","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","emailOtps","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","EmailOtp.findUnique","EmailOtp.findUniqueOrThrow","EmailOtp.findFirst","EmailOtp.findFirstOrThrow","EmailOtp.findMany","EmailOtp.createOne","EmailOtp.createMany","EmailOtp.createManyAndReturn","EmailOtp.updateOne","EmailOtp.updateMany","EmailOtp.updateManyAndReturn","EmailOtp.upsertOne","EmailOtp.deleteOne","EmailOtp.deleteMany","EmailOtp.groupBy","EmailOtp.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","InstitutionApplicationStatus","rejectionReason","reviewedByUserId","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","otpHash","expiresAt","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","role","accountStatus","date","AttendanceStatus","AdminRole","postingId_teacherUserId","postingId_studentUserId","sectionId_courseId","classworkId_studentProfileId","courseRegistrationId_date","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "pxWcAoAECwMAAP0HACAHAADsCAAgxgQAAJ4JADDHBAAACwAQyAQAAJ4JADDJBAEAAAABzgQBAPgHACHQBAEAAAAB0QRAAPwHACHSBEAA_AcAId0FAACfCeIFIgEAAAABACAMAwAA_QcAIMYEAAChCQAwxwQAAAMAEMgEAAChCQAwyQQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHGBUAA_AcAIdIFAQD4BwAh0wUBAPkHACHUBQEA-QcAIQMDAADtCgAg0wUAAKIJACDUBQAAogkAIAwDAAD9BwAgxgQAAKEJADDHBAAAAwAQyAQAAKEJADDJBAEAAAAB0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhxgVAAPwHACHSBQEAAAAB0wUBAPkHACHUBQEA-QcAIQMAAAADACABAAAEADACAAAFACARAwAA_QcAIMYEAACgCQAwxwQAAAcAEMgEAACgCQAwyQQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHJBQEA-AcAIcoFAQD4BwAhywUBAPkHACHMBQEA-QcAIc0FAQD5BwAhzgVAAOYIACHPBUAA5ggAIdAFAQD5BwAh0QUBAPkHACEIAwAA7QoAIMsFAACiCQAgzAUAAKIJACDNBQAAogkAIM4FAACiCQAgzwUAAKIJACDQBQAAogkAINEFAACiCQAgEQMAAP0HACDGBAAAoAkAMMcEAAAHABDIBAAAoAkAMMkEAQAAAAHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHJBQEA-AcAIcoFAQD4BwAhywUBAPkHACHMBQEA-QcAIc0FAQD5BwAhzgVAAOYIACHPBUAA5ggAIdAFAQD5BwAh0QUBAPkHACEDAAAABwAgAQAACAAwAgAACQAgCwMAAP0HACAHAADsCAAgxgQAAJ4JADDHBAAACwAQyAQAAJ4JADDJBAEA-AcAIc4EAQD4BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAh3QUAAJ8J4gUiAgMAAO0KACAHAAD6EQAgAwAAAAsAIAEAAAwAMAIAAAEAIBUDAAD9BwAgBwAA7AgAIAkAAJcJACAVAACZCAAgFwAAvggAIBgAAMAIACA1AACrCAAgNgAAwggAIMYEAACdCQAwxwQAAA4AEMgEAACdCQAwyQQBAPgHACHKBAEA-AcAIcsEAQD4BwAhzAQBAPgHACHNBAEA-QcAIc4EAQD4BwAhzwQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACEJAwAA7QoAIAcAAPoRACAJAAD9EQAgFQAAjgwAIBcAAJoQACAYAACcEAAgNQAAiA0AIDYAAJ4QACDNBAAAogkAIBUDAAD9BwAgBwAA7AgAIAkAAJcJACAVAACZCAAgFwAAvggAIBgAAMAIACA1AACrCAAgNgAAwggAIMYEAACdCQAwxwQAAA4AEMgEAACdCQAwyQQBAAAAAcoEAQAAAAHLBAEAAAABzAQBAPgHACHNBAEA-QcAIc4EAQD4BwAhzwQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACEDAAAADgAgAQAADwAwAgAAEAAgDAcAAOgIACAvAACcCQAgxgQAAJsJADDHBAAAEgAQyAQAAJsJADDJBAEA-AcAIc4EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhtQUBAPkHACG8BQEA-AcAIQUHAAD6EQAgLwAAjBIAIM4EAACiCQAgnwUAAKIJACC1BQAAogkAIAwHAADoCAAgLwAAnAkAIMYEAACbCQAwxwQAABIAEMgEAACbCQAwyQQBAAAAAc4EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhtQUBAPkHACG8BQEA-AcAIQMAAAASACABAAATADACAAAUACAbBgAAuwgAIBUAAJkIACAXAAC-CAAgGQAAmAgAICUAALcIACAmAAC4CAAgJwAAuggAICgAALwIACApAAC9CAAgKwAAqwgAICwAAMAIACAtAADBCAAgLgAAwggAIDAAALYIACAxAAC5CAAgNAAAvwgAIMYEAAC0CAAwxwQAABYAEMgEAAC0CAAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAh_QQAALUItwUjmQUBAPgHACGfBQEA-QcAIbUFAQD5BwAhuAUBAPkHACEBAAAAFgAgFwgAAJoJACAVAACZCAAgFwAAvggAIBkAAJgIACAlAAC3CAAgJgAAuAgAICcAALoIACAoAAC8CAAgKQAAvQgAICsAAKsIACAsAADACAAgLQAAwQgAIC4AAMIIACDGBAAAmQkAMMcEAAAYABDIBAAAmQkAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhsAUBAPkHACG1BQEA-QcAIbwFAQD4BwAhEAgAAIsSACAVAACODAAgFwAAmhAAIBkAAI0MACAlAACTEAAgJgAAlBAAICcAAJYQACAoAACYEAAgKQAAmRAAICsAAIgNACAsAACcEAAgLQAAnRAAIC4AAJ4QACCfBQAAogkAILAFAACiCQAgtQUAAKIJACAXCAAAmgkAIBUAAJkIACAXAAC-CAAgGQAAmAgAICUAALcIACAmAAC4CAAgJwAAuggAICgAALwIACApAAC9CAAgKwAAqwgAICwAAMAIACAtAADBCAAgLgAAwggAIMYEAACZCQAwxwQAABgAEMgEAACZCQAwyQQBAAAAAdEEQAD8BwAh0gRAAPwHACGfBQEA-QcAIbAFAQD5BwAhtQUBAPkHACG8BQEA-AcAIQMAAAAYACABAAAZADACAAAaACABAAAAEgAgEgcAAOwIACAJAACXCQAgFAAAuggAIBUAAJkIACDGBAAAmAkAMMcEAAAdABDIBAAAmAkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-AcAIdEEQAD8BwAh0gRAAPwHACH6BAEA-AcAIZ8FAQD5BwAhqQUBAPkHACGqBUAA5ggAIasFCADuCAAhrAUIAO4IACEJBwAA-hEAIAkAAP0RACAUAACWEAAgFQAAjgwAIJ8FAACiCQAgqQUAAKIJACCqBQAAogkAIKsFAACiCQAgrAUAAKIJACASBwAA7AgAIAkAAJcJACAUAAC6CAAgFQAAmQgAIMYEAACYCQAwxwQAAB0AEMgEAACYCQAwyQQBAAAAAc4EAQD4BwAhzwQBAPgHACHRBEAA_AcAIdIEQAD8BwAh-gQBAPgHACGfBQEA-QcAIakFAQD5BwAhqgVAAOYIACGrBQgA7ggAIawFCADuCAAhAwAAAB0AIAEAAB4AMAIAAB8AIBIHAADsCAAgCQAAlwkAIAoAAJUJACAVAACZCAAgFwAAvggAIMYEAACWCQAwxwQAACEAEMgEAACWCQAwyQQBAPgHACHOBAEA-AcAIc8EAQD4BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhqwUCAP8IACGxBQEA-QcAIb4FAQD4BwAhvwUBAPgHACEIBwAA-hEAIAkAAP0RACAKAACKEgAgFQAAjgwAIBcAAJoQACCfBQAAogkAIKsFAACiCQAgsQUAAKIJACASBwAA7AgAIAkAAJcJACAKAACVCQAgFQAAmQgAIBcAAL4IACDGBAAAlgkAMMcEAAAhABDIBAAAlgkAMMkEAQAAAAHOBAEA-AcAIc8EAQD4BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhqwUCAP8IACGxBQEA-QcAIb4FAQAAAAG_BQEA-AcAIQMAAAAhACABAAAiADACAAAjACABAAAAHQAgGgcAAOwIACAJAADxCAAgCgAAlQkAIAsAAKMIACARAACTCQAgEgAA8AgAIBMAAJQJACAUAACHCQAgFgAAhAkAIBoAAIAJACAeAACLCQAgxgQAAJIJADDHBAAAJgAQyAQAAJIJADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8QQBAPgHACHyBAEA-AcAIfMEAQD4BwAh9QQBAPgHACGhBQEA-AcAIbEFAQD5BwAhvQVAAPwHACENBwAA-hEAIAkAAP0RACAKAACKEgAgCwAApwwAIBEAAIgSACASAAD8EQAgEwAAiRIAIBQAAIQSACAWAACDEgAgGgAAgRIAIB4AAIASACDPBAAAogkAILEFAACiCQAgGgcAAOwIACAJAADxCAAgCgAAlQkAIAsAAKMIACARAACTCQAgEgAA8AgAIBMAAJQJACAUAACHCQAgFgAAhAkAIBoAAIAJACAeAACLCQAgxgQAAJIJADDHBAAAJgAQyAQAAJIJADDJBAEAAAABzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHxBAEA-AcAIfIEAQD4BwAh8wQBAPgHACH1BAEA-AcAIaEFAQD4BwAhsQUBAPkHACG9BUAA_AcAIQMAAAAmACABAAAnADACAAAoACAPDQAAkAkAIA4AAO8IACAQAACRCQAgxgQAAI8JADDHBAAAKgAQyAQAAI8JADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGHBQEA-AcAIZkFAQD4BwAhnwUBAPkHACGmBQEA-QcAIacFAQD4BwAhqAUBAPgHACEFDQAAhhIAIA4AAPsRACAQAACHEgAgnwUAAKIJACCmBQAAogkAIA8NAACQCQAgDgAA7wgAIBAAAJEJACDGBAAAjwkAMMcEAAAqABDIBAAAjwkAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAhhwUBAPgHACGZBQEA-AcAIZ8FAQD5BwAhpgUBAPkHACGnBQEA-AcAIagFAQD4BwAhAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACABAAAAKgAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACAKDgAA7wgAIMYEAACNCQAwxwQAADIAEMgEAACNCQAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAhgQUAAI4J4QUihwUBAPgHACHfBUAA_AcAIQEOAAD7EQAgCw4AAO8IACDGBAAAjQkAMMcEAAAyABDIBAAAjQkAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAhgQUAAI4J4QUihwUBAPgHACHfBUAA_AcAIeYFAACMCQAgAwAAADIAIAEAADMAMAIAADQAIBsHAADsCAAgCQAA8QgAIA4AAO8IACASAADwCAAgxgQAAO0IADDHBAAANgAQyAQAAO0IADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8wQBAPgHACGHBQEA-AcAIYgFCADuCAAhiQUIAO4IACGKBQgA7ggAIYsFCADuCAAhjAUIAO4IACGNBQgA7ggAIY4FCADuCAAhjwUIAO4IACGQBQgA7ggAIZEFCADuCAAhkgUIAO4IACGTBQgA7ggAIZQFCADuCAAhAQAAADYAIAEAAAAYACABAAAAGAAgAwAAACYAIAEAACcAMAIAACgAIBIHAADsCAAgCQAA8QgAIB0AAIoJACAeAACLCQAgxgQAAIkJADDHBAAAOwAQyAQAAIkJADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh9AQBAPgHACH1BAEA-AcAIfYEAQD5BwAh9wQBAPkHACH4BAEA-QcAIfkEQAD8BwAhCAcAAPoRACAJAAD9EQAgHQAAhRIAIB4AAIASACDPBAAAogkAIPYEAACiCQAg9wQAAKIJACD4BAAAogkAIBMHAADsCAAgCQAA8QgAIB0AAIoJACAeAACLCQAgxgQAAIkJADDHBAAAOwAQyAQAAIkJADDJBAEAAAABzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACH0BAEA-AcAIfUEAQD4BwAh9gQBAPkHACH3BAEA-QcAIfgEAQD5BwAh-QRAAPwHACHlBQAAiAkAIAMAAAA7ACABAAA8ADACAAA9ACADAAAAJgAgAQAAJwAwAgAAKAAgEAcAAOwIACAJAADxCAAgEgAA8AgAIBQAAIcJACAWAACECQAgxgQAAIYJADDHBAAAQAAQyAQAAIYJADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8QQBAPgHACHyBAEA-AcAIfMEAQD4BwAhBgcAAPoRACAJAAD9EQAgEgAA_BEAIBQAAIQSACAWAACDEgAgzwQAAKIJACARBwAA7AgAIAkAAPEIACASAADwCAAgFAAAhwkAIBYAAIQJACDGBAAAhgkAMMcEAABAABDIBAAAhgkAMMkEAQAAAAHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfEEAQD4BwAh8gQBAPgHACHzBAEA-AcAIeQFAACFCQAgAwAAAEAAIAEAAEEAMAIAAEIAIAEAAAAYACATBwAA7AgAIAkAAPEIACASAADwCAAgFgAAhAkAIBwAAMEIACDGBAAAggkAMMcEAABFABDIBAAAggkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHxBAEA-AcAIfMEAQD4BwAh-gQBAPgHACH7BAEA-QcAIf0EAACDCf0EIv4EQADmCAAhCAcAAPoRACAJAAD9EQAgEgAA_BEAIBYAAIMSACAcAACdEAAgzwQAAKIJACD7BAAAogkAIP4EAACiCQAgEwcAAOwIACAJAADxCAAgEgAA8AgAIBYAAIQJACAcAADBCAAgxgQAAIIJADDHBAAARQAQyAQAAIIJADDJBAEAAAABzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHxBAEA-AcAIfMEAQD4BwAh-gQBAPgHACH7BAEA-QcAIf0EAACDCf0EIv4EQADmCAAhAwAAAEUAIAEAAEYAMAIAAEcAIAEAAAAYACAUBwAA7AgAIAkAAPEIACAVAACZCAAgFwAAvggAIBgAAMAIACAaAACACQAgGwAAgQkAIMYEAAD-CAAwxwQAAEoAEMgEAAD-CAAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZkFAQD4BwAhnwUBAPkHACGgBQIA_wgAIaEFAQD4BwAhogUBAPkHACELBwAA-hEAIAkAAP0RACAVAACODAAgFwAAmhAAIBgAAJwQACAaAACBEgAgGwAAghIAIM8EAACiCQAgnwUAAKIJACCgBQAAogkAIKIFAACiCQAgFAcAAOwIACAJAADxCAAgFQAAmQgAIBcAAL4IACAYAADACAAgGgAAgAkAIBsAAIEJACDGBAAA_ggAMMcEAABKABDIBAAA_ggAMMkEAQAAAAHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZkFAQD4BwAhnwUBAPkHACGgBQIA_wgAIaEFAQD4BwAhogUBAPkHACEDAAAASgAgAQAASwAwAgAATAAgAwAAACYAIAEAACcAMAIAACgAIAEAAABKACABAAAAJgAgDQcAAOwIACAJAADxCAAgGQAAmAgAIMYEAAD4CAAwxwQAAFEAEMgEAAD4CAAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZkFAQD4BwAhnwUBAPkHACEBAAAAUQAgAQAAABgAIAMAAABKACABAABLADACAABMACABAAAASgAgAQAAACYAIAEAAABAACABAAAARQAgAQAAABgAIAMAAAA7ACABAAA8ADACAAA9ACABAAAAOwAgAQAAABgAIBMeAAD9CAAgIQAA_AgAICIAAP0HACAjAADnCAAgxgQAAPoIADDHBAAAXQAQyAQAAPoIADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACH1BAEA-QcAIf8EAQD5BwAhgQUAAPsIlwUiggUBAPkHACGDBUAA5ggAIYQFQAD8BwAhhQUBAPgHACGGBQEA-QcAIZcFAQD4BwAhCR4AAIASACAhAAD_EQAgIgAA7QoAICMAAO0KACD1BAAAogkAIP8EAACiCQAgggUAAKIJACCDBQAAogkAIIYFAACiCQAgFB4AAP0IACAhAAD8CAAgIgAA_QcAICMAAOcIACDGBAAA-ggAMMcEAABdABDIBAAA-ggAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAh9QQBAPkHACH_BAEA-QcAIYEFAAD7CJcFIoIFAQD5BwAhgwVAAOYIACGEBUAA_AcAIYUFAQD4BwAhhgUBAPkHACGXBQEA-AcAIeMFAAD5CAAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACABAAAAXQAgIAQAANYIACAFAADXCAAgBgAAuwgAIBIAALwIACAeAAC9CAAgKwAAqwgAIDQAAL8IACA3AAC_CAAgOAAAqwgAIDkAANgIACA6AACoCAAgOwAAqAgAIDwAANkIACA9AADaCAAgxgQAANUIADDHBAAAYwAQyAQAANUIADDJBAEA-AcAIc0EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZkFAQD4BwAh1QUBAPgHACHWBSAA-wcAIdcFAQD5BwAh2AUBAPkHACHZBQEA-QcAIdoFAQD5BwAh2wUBAPkHACHcBQEA-QcAId0FAQD4BwAh3gUBAPgHACEBAAAAYwAgEQMAAP0HACAHAADsCAAgCQAA8QgAIBUAAJkIACAfAADBCAAgJAAAqAgAIMYEAAD3CAAwxwQAAGUAEMgEAAD3CAAwyQQBAPgHACHNBAEA-QcAIc4EAQD4BwAhzwQBAPkHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGVBQEA-AcAIQEAAABlACABAAAAJgAgAQAAADsAIAEAAABdACABAAAAGAAgAQAAAB0AIAEAAAAqACABAAAAMgAgAwAAAEAAIAEAAEEAMAIAAEIAIAEAAAAmACABAAAAQAAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAhACABAAAAJgAgBQcAAPoRACAJAAD9EQAgGQAAjQwAIM8EAACiCQAgnwUAAKIJACANBwAA7AgAIAkAAPEIACAZAACYCAAgxgQAAPgIADDHBAAAUQAQyAQAAPgIADDJBAEAAAABzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGZBQEA-AcAIZ8FAQD5BwAhAwAAAFEAIAEAAHQAMAIAAHUAIAMAAAAhACABAAAiADACAAAjACADAAAASgAgAQAASwAwAgAATAAgAwAAAA4AIAEAAA8AMAIAABAAIAgDAADtCgAgBwAA-hEAIAkAAP0RACAVAACODAAgHwAAnRAAICQAAPcMACDNBAAAogkAIM8EAACiCQAgEQMAAP0HACAHAADsCAAgCQAA8QgAIBUAAJkIACAfAADBCAAgJAAAqAgAIMYEAAD3CAAwxwQAAGUAEMgEAAD3CAAwyQQBAAAAAc0EAQD5BwAhzgQBAPgHACHPBAEA-QcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIZUFAQAAAAEDAAAAZQAgAQAAegAwAgAAewAgAwAAACYAIAEAACcAMAIAACgAIAMAAABAACABAABBADACAABCACAXBwAA7AgAIAkAAPEIACASAAD2CAAgIQAA9QgAICMAAOcIACAqAAD9BwAgxgQAAPMIADDHBAAAfwAQyAQAAPMIADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh3gQBAPgHACHzBAEA-QcAIf8EAQD5BwAhgQUAAPQIgQUiggUBAPkHACGDBUAA5ggAIYQFQAD8BwAhhQUBAPgHACGGBQEA-QcAIQwHAAD6EQAgCQAA_REAIBIAAPwRACAhAAD-EQAgIwAA7QoAICoAAO0KACDPBAAAogkAIPMEAACiCQAg_wQAAKIJACCCBQAAogkAIIMFAACiCQAghgUAAKIJACAYBwAA7AgAIAkAAPEIACASAAD2CAAgIQAA9QgAICMAAOcIACAqAAD9BwAgxgQAAPMIADDHBAAAfwAQyAQAAPMIADDJBAEAAAABzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHeBAEA-AcAIfMEAQD5BwAh_wQBAPkHACGBBQAA9AiBBSKCBQEA-QcAIYMFQADmCAAhhAVAAPwHACGFBQEA-AcAIYYFAQD5BwAh4gUAAPIIACADAAAAfwAgAQAAgAEAMAIAAIEBACADAAAAfwAgAQAAgAEAMAIAAIEBACABAAAAfwAgAQAAAGMAIAEAAAAOACABAAAAGAAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAAA7ACABAAA8ADACAAA9ACASBwAA-hEAIAkAAP0RACAOAAD7EQAgEgAA_BEAIM8EAACiCQAgiAUAAKIJACCJBQAAogkAIIoFAACiCQAgiwUAAKIJACCMBQAAogkAII0FAACiCQAgjgUAAKIJACCPBQAAogkAIJAFAACiCQAgkQUAAKIJACCSBQAAogkAIJMFAACiCQAglAUAAKIJACAbBwAA7AgAIAkAAPEIACAOAADvCAAgEgAA8AgAIMYEAADtCAAwxwQAADYAEMgEAADtCAAwyQQBAAAAAc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8wQBAPgHACGHBQEAAAABiAUIAO4IACGJBQgA7ggAIYoFCADuCAAhiwUIAO4IACGMBQgA7ggAIY0FCADuCAAhjgUIAO4IACGPBQgA7ggAIZAFCADuCAAhkQUIAO4IACGSBQgA7ggAIZMFCADuCAAhlAUIAO4IACEDAAAANgAgAQAAigEAMAIAAIsBACABAAAAHQAgAQAAAFEAIAEAAAAhACABAAAASgAgAQAAAA4AIAEAAABlACABAAAAJgAgAQAAAEAAIAEAAAB_ACABAAAARQAgAQAAADsAIAEAAAA2ACABAAAAGAAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAABRACABAAB0ADACAAB1ACAOBwAA7AgAIA8AAKMIACDGBAAA6QgAMMcEAACcAQAQyAQAAOkIADDJBAEA-AcAIc4EAQD4BwAh0QRAAPwHACHSBEAA_AcAIZkFAQD5BwAhwAUBAPgHACHBBQEA-AcAIcIFAgDqCAAhxAUAAOsIxAUiAwcAAPoRACAPAACnDAAgmQUAAKIJACAOBwAA7AgAIA8AAKMIACDGBAAA6QgAMMcEAACcAQAQyAQAAOkIADDJBAEAAAABzgQBAPgHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPkHACHABQEA-AcAIcEFAQD4BwAhwgUCAOoIACHEBQAA6wjEBSIDAAAAnAEAIAEAAJ0BADACAACeAQAgAwAAAEoAIAEAAEsAMAIAAEwAIAMAAAAhACABAAAiADACAAAjACADAAAACwAgAQAADAAwAgAAAQAgAwAAAA4AIAEAAA8AMAIAABAAIAMAAABlACABAAB6ADACAAB7ACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAAEAAIAEAAEEAMAIAAEIAIBQHAADoCAAgMgAA_QcAIDMAAOcIACDGBAAA5AgAMMcEAACnAQAQyAQAAOQIADDJBAEA-AcAIc4EAQD5BwAh0QRAAPwHACHSBEAA_AcAIYEFAADlCLoFIoMFQADmCAAhnwUBAPkHACGzBQEA-AcAIbQFAQD4BwAhtQUBAPkHACG3BQAAtQi3BSO4BQEA-QcAIboFAQD5BwAhuwUBAPkHACELBwAA-hEAIDIAAO0KACAzAADtCgAgzgQAAKIJACCDBQAAogkAIJ8FAACiCQAgtQUAAKIJACC3BQAAogkAILgFAACiCQAgugUAAKIJACC7BQAAogkAIBQHAADoCAAgMgAA_QcAIDMAAOcIACDGBAAA5AgAMMcEAACnAQAQyAQAAOQIADDJBAEAAAABzgQBAPkHACHRBEAA_AcAIdIEQAD8BwAhgQUAAOUIugUigwVAAOYIACGfBQEA-QcAIbMFAQD4BwAhtAUBAPgHACG1BQEA-QcAIbcFAAC1CLcFI7gFAQD5BwAhugUBAPkHACG7BQEA-QcAIQMAAACnAQAgAQAAqAEAMAIAAKkBACABAAAAYwAgAQAAABYAIAMAAAB_ACABAACAAQAwAgAAgQEAIAMAAABFACABAABGADACAABHACADAAAAOwAgAQAAPAAwAgAAPQAgAwAAADYAIAEAAIoBADACAACLAQAgAQAAABIAIAEAAAAdACABAAAAUQAgAQAAAJwBACABAAAASgAgAQAAACEAIAEAAAALACABAAAADgAgAQAAAGUAIAEAAAAmACABAAAAQAAgAQAAAKcBACABAAAAfwAgAQAAAEUAIAEAAAA7ACABAAAANgAgAwAAACYAIAEAACcAMAIAACgAIAMAAABAACABAABBADACAABCACADAAAARQAgAQAARgAwAgAARwAgAwAAAH8AIAEAAIABADACAACBAQAgAwAAADYAIAEAAIoBADACAACLAQAgAQAAACYAIAEAAABAACABAAAARQAgAQAAAH8AIAEAAAA2ACADAAAAZQAgAQAAegAwAgAAewAgAwAAAKcBACABAACoAQAwAgAAqQEAIAMAAACnAQAgAQAAqAEAMAIAAKkBACADAAAAfwAgAQAAgAEAMAIAAIEBACADAAAAfwAgAQAAgAEAMAIAAIEBACARKgAA_QcAIMYEAAD3BwAwxwQAANABABDIBAAA9wcAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAId4EAQD4BwAh3wQBAPgHACHgBAEA-AcAIeEEAQD4BwAh4gQBAPkHACHjBAAA8QcAIOQEAADxBwAg5QQAAPoHACDmBAAA-gcAIOcEIAD7BwAhAQAAANABACADAAAAXQAgAQAAXgAwAgAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIA0iAAD9BwAgxgQAAJUIADDHBAAA1AEAEMgEAACVCAAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAh3wQBAPgHACHgBAEA-AcAIeUEAAD6BwAg5wQgAPsHACGXBQEA-AcAIZgFAADxBwAgAQAAANQBACAKAwAA_QcAIMYEAADjCAAwxwQAANYBABDIBAAA4wgAMMkEAQD4BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhxQUBAPgHACHGBUAA_AcAIQEDAADtCgAgCgMAAP0HACDGBAAA4wgAMMcEAADWAQAQyAQAAOMIADDJBAEAAAAB0AQBAAAAAdEEQAD8BwAh0gRAAPwHACHFBQEA-AcAIcYFQAD8BwAhAwAAANYBACABAADXAQAwAgAA2AEAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAOACABAAAAZQAgAQAAAKcBACABAAAApwEAIAEAAAB_ACABAAAAfwAgAQAAAF0AIAEAAABdACABAAAA1gEAIAEAAAABACADAAAACwAgAQAADAAwAgAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACAIAwAAjw4AIAcAAMYRACDJBAEAAAABzgQBAAAAAdAEAQAAAAHRBEAAAAAB0gRAAAAAAd0FAAAA4gUCAUMAAOoBACAGyQQBAAAAAc4EAQAAAAHQBAEAAAAB0QRAAAAAAdIEQAAAAAHdBQAAAOIFAgFDAADsAQAwAUMAAOwBADAIAwAAjQ4AIAcAAMQRACDJBAEApgkAIc4EAQCmCQAh0AQBAKYJACHRBEAAqAkAIdIEQACoCQAh3QUAAIsO4gUiAgAAAAEAIEMAAO8BACAGyQQBAKYJACHOBAEApgkAIdAEAQCmCQAh0QRAAKgJACHSBEAAqAkAId0FAACLDuIFIgIAAAALACBDAADxAQAgAgAAAAsAIEMAAPEBACADAAAAAQAgSgAA6gEAIEsAAO8BACABAAAAAQAgAQAAAAsAIAMMAAD3EQAgUAAA-REAIFEAAPgRACAJxgQAAN8IADDHBAAA-AEAEMgEAADfCAAwyQQBAOUHACHOBAEA5QcAIdAEAQDlBwAh0QRAAOcHACHSBEAA5wcAId0FAADgCOIFIgMAAAALACABAAD3AQAwTwAA-AEAIAMAAAALACABAAAMADACAAABACABAAAANAAgAQAAADQAIAMAAAAyACABAAAzADACAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAcOAAD2EQAgyQQBAAAAAdEEQAAAAAHSBEAAAAABgQUAAADhBQKHBQEAAAAB3wVAAAAAAQFDAACAAgAgBskEAQAAAAHRBEAAAAAB0gRAAAAAAYEFAAAA4QUChwUBAAAAAd8FQAAAAAEBQwAAggIAMAFDAACCAgAwBw4AAPURACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGBBQAAvQrhBSKHBQEApgkAId8FQACoCQAhAgAAADQAIEMAAIUCACAGyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhgQUAAL0K4QUihwUBAKYJACHfBUAAqAkAIQIAAAAyACBDAACHAgAgAgAAADIAIEMAAIcCACADAAAANAAgSgAAgAIAIEsAAIUCACABAAAANAAgAQAAADIAIAMMAADyEQAgUAAA9BEAIFEAAPMRACAJxgQAANsIADDHBAAAjgIAEMgEAADbCAAwyQQBAOUHACHRBEAA5wcAIdIEQADnBwAhgQUAANwI4QUihwUBAOUHACHfBUAA5wcAIQMAAAAyACABAACNAgAwTwAAjgIAIAMAAAAyACABAAAzADACAAA0ACAgBAAA1ggAIAUAANcIACAGAAC7CAAgEgAAvAgAIB4AAL0IACArAACrCAAgNAAAvwgAIDcAAL8IACA4AACrCAAgOQAA2AgAIDoAAKgIACA7AACoCAAgPAAA2QgAID0AANoIACDGBAAA1QgAMMcEAABjABDIBAAA1QgAMMkEAQAAAAHNBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGZBQEA-AcAIdUFAQAAAAHWBSAA-wcAIdcFAQD5BwAh2AUBAPkHACHZBQEA-QcAIdoFAQD5BwAh2wUBAPkHACHcBQEA-QcAId0FAQD4BwAh3gUBAPgHACEBAAAAkQIAIAEAAACRAgAgFQQAAO0RACAFAADuEQAgBgAAlxAAIBIAAJgQACAeAACZEAAgKwAAiA0AIDQAAJsQACA3AACbEAAgOAAAiA0AIDkAAO8RACA6AAD3DAAgOwAA9wwAIDwAAPARACA9AADxEQAgzQQAAKIJACDXBQAAogkAINgFAACiCQAg2QUAAKIJACDaBQAAogkAINsFAACiCQAg3AUAAKIJACADAAAAYwAgAQAAlAIAMAIAAJECACADAAAAYwAgAQAAlAIAMAIAAJECACADAAAAYwAgAQAAlAIAMAIAAJECACAdBAAA3xEAIAUAAOARACAGAADhEQAgEgAA4hEAIB4AAOMRACArAADmEQAgNAAA5BEAIDcAAOURACA4AADnEQAgOQAA6BEAIDoAAOkRACA7AADqEQAgPAAA6xEAID0AAOwRACDJBAEAAAABzQQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAdUFAQAAAAHWBSAAAAAB1wUBAAAAAdgFAQAAAAHZBQEAAAAB2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAEBQwAAmAIAIA_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hAgAAAAkAIEMAAMkCACANyQQBAKYJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACHJBQEApgkAIcoFAQCmCQAhywUBAKcJACHMBQEApwkAIc0FAQCnCQAhzgVAAM8JACHPBUAAzwkAIdAFAQCnCQAh0QUBAKcJACECAAAABwAgQwAAywIAIAIAAAAHACBDAADLAgAgAwAAAAkAIEoAAMQCACBLAADJAgAgAQAAAAkAIAEAAAAHACAKDAAAwxAAIFAAAMUQACBRAADEEAAgywUAAKIJACDMBQAAogkAIM0FAACiCQAgzgUAAKIJACDPBQAAogkAINAFAACiCQAg0QUAAKIJACAQxgQAANIIADDHBAAA0gIAEMgEAADSCAAwyQQBAOUHACHQBAEA5QcAIdEEQADnBwAh0gRAAOcHACHJBQEA5QcAIcoFAQDlBwAhywUBAOYHACHMBQEA5gcAIc0FAQDmBwAhzgVAAIIIACHPBUAAgggAIdAFAQDmBwAh0QUBAOYHACEDAAAABwAgAQAA0QIAME8AANICACADAAAABwAgAQAACAAwAgAACQAgCcYEAADRCAAwxwQAANgCABDIBAAA0QgAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAhxgVAAPwHACHHBQEA-AcAIcgFAQD4BwAhAQAAANUCACABAAAA1QIAIAnGBAAA0QgAMMcEAADYAgAQyAQAANEIADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHGBUAA_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_BQEAAAABAUMAALkDADABQwAAuQMAMAEAAAAdACAPBwAAyAwAIAkAAMkMACAKAACYDgAgFQAAygwAIBcAAMsMACDJBAEApgkAIc4EAQCmCQAhzwQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGrBQIA4QsAIbEFAQCnCQAhvgUBAKYJACG_BQEApgkAIQIAAAAjACBDAAC9AwAgCskEAQCmCQAhzgQBAKYJACHPBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIasFAgDhCwAhsQUBAKcJACG-BQEApgkAIb8FAQCmCQAhAgAAACEAIEMAAL8DACACAAAAIQAgQwAAvwMAIAEAAAAdACADAAAAIwAgSgAAtwMAIEsAAL0DACABAAAAIwAgAQAAACEAIAgMAACsEAAgUAAArxAAIFEAAK4QACDSAQAArRAAINMBAACwEAAgnwUAAKIJACCrBQAAogkAILEFAACiCQAgDcYEAADGCAAwxwQAAMcDABDIBAAAxggAMMkEAQDlBwAhzgQBAOUHACHPBAEA5QcAIdEEQADnBwAh0gRAAOcHACGfBQEA5gcAIasFAgCbCAAhsQUBAOYHACG-BQEA5QcAIb8FAQDlBwAhAwAAACEAIAEAAMYDADBPAADHAwAgAwAAACEAIAEAACIAMAIAACMAIAEAAAAoACABAAAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgFwcAANoKACAJAADXCgAgCgAA2AoAIAsAANEKACARAADSCgAgEgAAtgsAIBMAANMKACAUAADUCgAgFgAA1goAIBoAANkKACAeAADVCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABAUMAAM8DACAMyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABAUMAANEDADABQwAA0QMAMAEAAAAYACABAAAAHQAgFwcAAKsKACAJAACoCgAgCgAAqQoAIAsAAKIKACARAACjCgAgEgAAtAsAIBMAAKQKACAUAAClCgAgFgAApwoAIBoAAKoKACAeAACmCgAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfEEAQCmCQAh8gQBAKYJACHzBAEApgkAIfUEAQCmCQAhoQUBAKYJACGxBQEApwkAIb0FQACoCQAhAgAAACgAIEMAANYDACAMyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfEEAQCmCQAh8gQBAKYJACHzBAEApgkAIfUEAQCmCQAhoQUBAKYJACGxBQEApwkAIb0FQACoCQAhAgAAACYAIEMAANgDACACAAAAJgAgQwAA2AMAIAEAAAAYACABAAAAHQAgAwAAACgAIEoAAM8DACBLAADWAwAgAQAAACgAIAEAAAAmACAFDAAAqRAAIFAAAKsQACBRAACqEAAgzwQAAKIJACCxBQAAogkAIA_GBAAAxQgAMMcEAADhAwAQyAQAAMUIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOYHACHRBEAA5wcAIdIEQADnBwAh8QQBAOUHACHyBAEA5QcAIfMEAQDlBwAh9QQBAOUHACGhBQEA5QcAIbEFAQDmBwAhvQVAAOcHACEDAAAAJgAgAQAA4AMAME8AAOEDACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAABoAIAEAAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACAUCAAAqBAAIBUAAPoPACAXAAD7DwAgGQAA9w8AICUAAPQPACAmAAD1DwAgJwAA9g8AICgAAPgPACApAAD5DwAgKwAA_A8AICwAAP0PACAtAAD-DwAgLgAA_w8AIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGwBQEAAAABtQUBAAAAAbwFAQAAAAEBQwAA6QMAIAfJBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABsAUBAAAAAbUFAQAAAAG8BQEAAAABAUMAAOsDADABQwAA6wMAMAEAAAASACAUCAAApxAAIBUAAP8OACAXAACADwAgGQAA_A4AICUAAPkOACAmAAD6DgAgJwAA-w4AICgAAP0OACApAAD-DgAgKwAAgQ8AICwAAIIPACAtAACDDwAgLgAAhA8AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhsAUBAKcJACG1BQEApwkAIbwFAQCmCQAhAgAAABoAIEMAAO8DACAHyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGwBQEApwkAIbUFAQCnCQAhvAUBAKYJACECAAAAGAAgQwAA8QMAIAIAAAAYACBDAADxAwAgAQAAABIAIAMAAAAaACBKAADpAwAgSwAA7wMAIAEAAAAaACABAAAAGAAgBgwAAKQQACBQAACmEAAgUQAApRAAIJ8FAACiCQAgsAUAAKIJACC1BQAAogkAIArGBAAAxAgAMMcEAAD5AwAQyAQAAMQIADDJBAEA5QcAIdEEQADnBwAh0gRAAOcHACGfBQEA5gcAIbAFAQDmBwAhtQUBAOYHACG8BQEA5QcAIQMAAAAYACABAAD4AwAwTwAA-QMAIAMAAAAYACABAAAZADACAAAaACABAAAAFAAgAQAAABQAIAMAAAASACABAAATADACAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgAwAAABIAIAEAABMAMAIAABQAIAkHAACjEAAgLwAAgRAAIMkEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABtQUBAAAAAbwFAQAAAAEBQwAAgQQAIAfJBAEAAAABzgQBAAAAAdEEQAAAAAHSBEAAAAABnwUBAAAAAbUFAQAAAAG8BQEAAAABAUMAAIMEADABQwAAgwQAMAEAAAAWACAJBwAAohAAIC8AAO0OACDJBAEApgkAIc4EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhtQUBAKcJACG8BQEApgkAIQIAAAAUACBDAACHBAAgB8kEAQCmCQAhzgQBAKcJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACG1BQEApwkAIbwFAQCmCQAhAgAAABIAIEMAAIkEACACAAAAEgAgQwAAiQQAIAEAAAAWACADAAAAFAAgSgAAgQQAIEsAAIcEACABAAAAFAAgAQAAABIAIAYMAACfEAAgUAAAoRAAIFEAAKAQACDOBAAAogkAIJ8FAACiCQAgtQUAAKIJACAKxgQAAMMIADDHBAAAkQQAEMgEAADDCAAwyQQBAOUHACHOBAEA5gcAIdEEQADnBwAh0gRAAOcHACGfBQEA5gcAIbUFAQDmBwAhvAUBAOUHACEDAAAAEgAgAQAAkAQAME8AAJEEACADAAAAEgAgAQAAEwAwAgAAFAAgGwYAALsIACAVAACZCAAgFwAAvggAIBkAAJgIACAlAAC3CAAgJgAAuAgAICcAALoIACAoAAC8CAAgKQAAvQgAICsAAKsIACAsAADACAAgLQAAwQgAIC4AAMIIACAwAAC2CAAgMQAAuQgAIDQAAL8IACDGBAAAtAgAMMcEAAAWABDIBAAAtAgAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAh_QQAALUItwUjmQUBAPgHACGfBQEA-QcAIbUFAQD5BwAhuAUBAPkHACEBAAAAlAQAIAEAAACUBAAgFAYAAJcQACAVAACODAAgFwAAmhAAIBkAAI0MACAlAACTEAAgJgAAlBAAICcAAJYQACAoAACYEAAgKQAAmRAAICsAAIgNACAsAACcEAAgLQAAnRAAIC4AAJ4QACAwAACSEAAgMQAAlRAAIDQAAJsQACD9BAAAogkAIJ8FAACiCQAgtQUAAKIJACC4BQAAogkAIAMAAAAWACABAACXBAAwAgAAlAQAIAMAAAAWACABAACXBAAwAgAAlAQAIAMAAAAWACABAACXBAAwAgAAlAQAIBgGAACIEAAgFQAAixAAIBcAAIwQACAZAACGEAAgJQAAgxAAICYAAIQQACAnAACHEAAgKAAAiRAAICkAAIoQACArAACOEAAgLAAAjxAAIC0AAJAQACAuAACREAAgMAAAghAAIDEAAIUQACA0AACNEAAgyQQBAAAAAdEEQAAAAAHSBEAAAAAB_QQAAAC3BQOZBQEAAAABnwUBAAAAAbUFAQAAAAG4BQEAAAABAUMAAJsEACAIyQQBAAAAAdEEQAAAAAHSBEAAAAAB_QQAAAC3BQOZBQEAAAABnwUBAAAAAbUFAQAAAAG4BQEAAAABAUMAAJ0EADABQwAAnQQAMBgGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJQAAmA0AICYAAJkNACAnAACcDQAgKAAAng0AICkAAJ8NACArAACjDQAgLAAApA0AIC0AAKUNACAuAACmDQAgMAAAlw0AIDEAAJoNACA0AACiDQAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACECAAAAlAQAIEMAAKAEACAIyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACECAAAAFgAgQwAAogQAIAIAAAAWACBDAACiBAAgAwAAAJQEACBKAACbBAAgSwAAoAQAIAEAAACUBAAgAQAAABYAIAcMAACUDQAgUAAAlg0AIFEAAJUNACD9BAAAogkAIJ8FAACiCQAgtQUAAKIJACC4BQAAogkAIAvGBAAAswgAMMcEAACpBAAQyAQAALMIADDJBAEA5QcAIdEEQADnBwAh0gRAAOcHACH9BAAArQi3BSOZBQEA5QcAIZ8FAQDmBwAhtQUBAOYHACG4BQEA5gcAIQMAAAAWACABAACoBAAwTwAAqQQAIAMAAAAWACABAACXBAAwAgAAlAQAIAEAAACpAQAgAQAAAKkBACADAAAApwEAIAEAAKgBADACAACpAQAgAwAAAKcBACABAACoAQAwAgAAqQEAIAMAAACnAQAgAQAAqAEAMAIAAKkBACARBwAAkw0AIDIAAJENACAzAACSDQAgyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAYEFAAAAugUCgwVAAAAAAZ8FAQAAAAGzBQEAAAABtAUBAAAAAbUFAQAAAAG3BQAAALcFA7gFAQAAAAG6BQEAAAABuwUBAAAAAQFDAACxBAAgDskEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAGBBQAAALoFAoMFQAAAAAGfBQEAAAABswUBAAAAAbQFAQAAAAG1BQEAAAABtwUAAAC3BQO4BQEAAAABugUBAAAAAbsFAQAAAAEBQwAAswQAMAFDAACzBAAwAQAAAGMAIAEAAAAWACARBwAAkA0AIDIAAI4NACAzAACPDQAgyQQBAKYJACHOBAEApwkAIdEEQACoCQAh0gRAAKgJACGBBQAAjQ26BSKDBUAAzwkAIZ8FAQCnCQAhswUBAKYJACG0BQEApgkAIbUFAQCnCQAhtwUAAIwNtwUjuAUBAKcJACG6BQEApwkAIbsFAQCnCQAhAgAAAKkBACBDAAC4BAAgDskEAQCmCQAhzgQBAKcJACHRBEAAqAkAIdIEQACoCQAhgQUAAI0NugUigwVAAM8JACGfBQEApwkAIbMFAQCmCQAhtAUBAKYJACG1BQEApwkAIbcFAACMDbcFI7gFAQCnCQAhugUBAKcJACG7BQEApwkAIQIAAACnAQAgQwAAugQAIAIAAACnAQAgQwAAugQAIAEAAABjACABAAAAFgAgAwAAAKkBACBKAACxBAAgSwAAuAQAIAEAAACpAQAgAQAAAKcBACALDAAAiQ0AIFAAAIsNACBRAACKDQAgzgQAAKIJACCDBQAAogkAIJ8FAACiCQAgtQUAAKIJACC3BQAAogkAILgFAACiCQAgugUAAKIJACC7BQAAogkAIBHGBAAArAgAMMcEAADDBAAQyAQAAKwIADDJBAEA5QcAIc4EAQDmBwAh0QRAAOcHACHSBEAA5wcAIYEFAACuCLoFIoMFQACCCAAhnwUBAOYHACGzBQEA5QcAIbQFAQDlBwAhtQUBAOYHACG3BQAArQi3BSO4BQEA5gcAIboFAQDmBwAhuwUBAOYHACEDAAAApwEAIAEAAMIEADBPAADDBAAgAwAAAKcBACABAACoAQAwAgAAqQEAIBAgAACrCAAgxgQAAKoIADDHBAAAyQQAEMgEAACqCAAwyQQBAAAAAc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh-gQBAPgHACGtBQEA-QcAIa4FAQD4BwAhrwUAAPEHACCwBQEA-QcAIbEFAQD5BwAhsgUBAPgHACEBAAAAxgQAIAEAAADGBAAgECAAAKsIACDGBAAAqggAMMcEAADJBAAQyAQAAKoIADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh-gQBAPgHACGtBQEA-QcAIa4FAQD4BwAhrwUAAPEHACCwBQEA-QcAIbEFAQD5BwAhsgUBAPgHACEFIAAAiA0AIM8EAACiCQAgrQUAAKIJACCwBQAAogkAILEFAACiCQAgAwAAAMkEACABAADKBAAwAgAAxgQAIAMAAADJBAAgAQAAygQAMAIAAMYEACADAAAAyQQAIAEAAMoEADACAADGBAAgDSAAAIcNACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGtBQEAAAABrgUBAAAAAa8FAACGDQAgsAUBAAAAAbEFAQAAAAGyBQEAAAABAUMAAM4EACAMyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAH6BAEAAAABrQUBAAAAAa4FAQAAAAGvBQAAhg0AILAFAQAAAAGxBQEAAAABsgUBAAAAAQFDAADQBAAwAUMAANAEADANIAAA_AwAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACH6BAEApgkAIa0FAQCnCQAhrgUBAKYJACGvBQAA-wwAILAFAQCnCQAhsQUBAKcJACGyBQEApgkAIQIAAADGBAAgQwAA0wQAIAzJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh-gQBAKYJACGtBQEApwkAIa4FAQCmCQAhrwUAAPsMACCwBQEApwkAIbEFAQCnCQAhsgUBAKYJACECAAAAyQQAIEMAANUEACACAAAAyQQAIEMAANUEACADAAAAxgQAIEoAAM4EACBLAADTBAAgAQAAAMYEACABAAAAyQQAIAcMAAD4DAAgUAAA-gwAIFEAAPkMACDPBAAAogkAIK0FAACiCQAgsAUAAKIJACCxBQAAogkAIA_GBAAAqQgAMMcEAADcBAAQyAQAAKkIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOYHACHRBEAA5wcAIdIEQADnBwAh-gQBAOUHACGtBQEA5gcAIa4FAQDlBwAhrwUAAPEHACCwBQEA5gcAIbEFAQDmBwAhsgUBAOUHACEDAAAAyQQAIAEAANsEADBPAADcBAAgAwAAAMkEACABAADKBAAwAgAAxgQAIBAgAACoCAAgxgQAAKcIADDHBAAA4gQAEMgEAACnCAAwyQQBAAAAAc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh-gQBAPgHACGtBQEA-QcAIa4FAQD4BwAhrwUAAPEHACCwBQEA-QcAIbEFAQD5BwAhsgUBAPgHACEBAAAA3wQAIAEAAADfBAAgECAAAKgIACDGBAAApwgAMMcEAADiBAAQyAQAAKcIADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh-gQBAPgHACGtBQEA-QcAIa4FAQD4BwAhrwUAAPEHACCwBQEA-QcAIbEFAQD5BwAhsgUBAPgHACEFIAAA9wwAIM8EAACiCQAgrQUAAKIJACCwBQAAogkAILEFAACiCQAgAwAAAOIEACABAADjBAAwAgAA3wQAIAMAAADiBAAgAQAA4wQAMAIAAN8EACADAAAA4gQAIAEAAOMEADACAADfBAAgDSAAAPYMACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGtBQEAAAABrgUBAAAAAa8FAAD1DAAgsAUBAAAAAbEFAQAAAAGyBQEAAAABAUMAAOcEACAMyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAH6BAEAAAABrQUBAAAAAa4FAQAAAAGvBQAA9QwAILAFAQAAAAGxBQEAAAABsgUBAAAAAQFDAADpBAAwAUMAAOkEADANIAAA6wwAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACH6BAEApgkAIa0FAQCnCQAhrgUBAKYJACGvBQAA6gwAILAFAQCnCQAhsQUBAKcJACGyBQEApgkAIQIAAADfBAAgQwAA7AQAIAzJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh-gQBAKYJACGtBQEApwkAIa4FAQCmCQAhrwUAAOoMACCwBQEApwkAIbEFAQCnCQAhsgUBAKYJACECAAAA4gQAIEMAAO4EACACAAAA4gQAIEMAAO4EACADAAAA3wQAIEoAAOcEACBLAADsBAAgAQAAAN8EACABAAAA4gQAIAcMAADnDAAgUAAA6QwAIFEAAOgMACDPBAAAogkAIK0FAACiCQAgsAUAAKIJACCxBQAAogkAIA_GBAAApggAMMcEAAD1BAAQyAQAAKYIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOYHACHRBEAA5wcAIdIEQADnBwAh-gQBAOUHACGtBQEA5gcAIa4FAQDlBwAhrwUAAPEHACCwBQEA5gcAIbEFAQDmBwAhsgUBAOUHACEDAAAA4gQAIAEAAPQEADBPAAD1BAAgAwAAAOIEACABAADjBAAwAgAA3wQAIAEAAAAfACABAAAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgDwcAAOUMACAJAADmDAAgFAAA4wwAIBUAAOQMACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGfBQEAAAABqQUBAAAAAaoFQAAAAAGrBQgAAAABrAUIAAAAAQFDAAD9BAAgC8kEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB-gQBAAAAAZ8FAQAAAAGpBQEAAAABqgVAAAAAAasFCAAAAAGsBQgAAAABAUMAAP8EADABQwAA_wQAMA8HAACyDAAgCQAAswwAIBQAALAMACAVAACxDAAgyQQBAKYJACHOBAEApgkAIc8EAQCmCQAh0QRAAKgJACHSBEAAqAkAIfoEAQCmCQAhnwUBAKcJACGpBQEApwkAIaoFQADPCQAhqwUIALsJACGsBQgAuwkAIQIAAAAfACBDAACCBQAgC8kEAQCmCQAhzgQBAKYJACHPBAEApgkAIdEEQACoCQAh0gRAAKgJACH6BAEApgkAIZ8FAQCnCQAhqQUBAKcJACGqBUAAzwkAIasFCAC7CQAhrAUIALsJACECAAAAHQAgQwAAhAUAIAIAAAAdACBDAACEBQAgAwAAAB8AIEoAAP0EACBLAACCBQAgAQAAAB8AIAEAAAAdACAKDAAAqwwAIFAAAK4MACBRAACtDAAg0gEAAKwMACDTAQAArwwAIJ8FAACiCQAgqQUAAKIJACCqBQAAogkAIKsFAACiCQAgrAUAAKIJACAOxgQAAKUIADDHBAAAiwUAEMgEAAClCAAwyQQBAOUHACHOBAEA5QcAIc8EAQDlBwAh0QRAAOcHACHSBEAA5wcAIfoEAQDlBwAhnwUBAOYHACGpBQEA5gcAIaoFQACCCAAhqwUIAIwIACGsBQgAjAgAIQMAAAAdACABAACKBQAwTwAAiwUAIAMAAAAdACABAAAeADACAAAfACABAAAALAAgAQAAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAwNAADOCgAgDgAApQwAIBAAAM8KACDJBAEAAAAB0QRAAAAAAdIEQAAAAAGHBQEAAAABmQUBAAAAAZ8FAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAEBQwAAkwUAIAnJBAEAAAAB0QRAAAAAAdIEQAAAAAGHBQEAAAABmQUBAAAAAZ8FAQAAAAGmBQEAAAABpwUBAAAAAagFAQAAAAEBQwAAlQUAMAFDAACVBQAwDA0AAMsKACAOAACjDAAgEAAAzAoAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIYcFAQCmCQAhmQUBAKYJACGfBQEApwkAIaYFAQCnCQAhpwUBAKYJACGoBQEApgkAIQIAAAAsACBDAACYBQAgCckEAQCmCQAh0QRAAKgJACHSBEAAqAkAIYcFAQCmCQAhmQUBAKYJACGfBQEApwkAIaYFAQCnCQAhpwUBAKYJACGoBQEApgkAIQIAAAAqACBDAACaBQAgAgAAACoAIEMAAJoFACADAAAALAAgSgAAkwUAIEsAAJgFACABAAAALAAgAQAAACoAIAUMAACoDAAgUAAAqgwAIFEAAKkMACCfBQAAogkAIKYFAACiCQAgDMYEAACkCAAwxwQAAKEFABDIBAAApAgAMMkEAQDlBwAh0QRAAOcHACHSBEAA5wcAIYcFAQDlBwAhmQUBAOUHACGfBQEA5gcAIaYFAQDmBwAhpwUBAOUHACGoBQEA5QcAIQMAAAAqACABAACgBQAwTwAAoQUAIAMAAAAqACABAAArADACAAAsACAMCwAAowgAIMYEAAChCAAwxwQAAKcFABDIBAAAoQgAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAhgQUAAKIIpgUimQUBAPgHACGfBQEA-QcAIaMFQAD8BwAhpAVAAPwHACEBAAAApAUAIAEAAACkBQAgDAsAAKMIACDGBAAAoQgAMMcEAACnBQAQyAQAAKEIADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGBBQAAogimBSKZBQEA-AcAIZ8FAQD5BwAhowVAAPwHACGkBUAA_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-AcAIZkFAQD4BwAhmgVAAPwHACGbBUAA_AcAIQIVAACODAAgGQAAjQwAIAMAAADaBQAgAQAA2wUAMAIAANcFACADAAAA2gUAIAEAANsFADACAADXBQAgAwAAANoFACABAADbBQAwAgAA1wUAIAcVAACMDAAgGQAAiwwAIMkEAQAAAAHOBAEAAAABmQUBAAAAAZoFQAAAAAGbBUAAAAABAUMAAN8FACAFyQQBAAAAAc4EAQAAAAGZBQEAAAABmgVAAAAAAZsFQAAAAAEBQwAA4QUAMAFDAADhBQAwBxUAAM0LACAZAADMCwAgyQQBAKYJACHOBAEApgkAIZkFAQCmCQAhmgVAAKgJACGbBUAAqAkAIQIAAADXBQAgQwAA5AUAIAXJBAEApgkAIc4EAQCmCQAhmQUBAKYJACGaBUAAqAkAIZsFQACoCQAhAgAAANoFACBDAADmBQAgAgAAANoFACBDAADmBQAgAwAAANcFACBKAADfBQAgSwAA5AUAIAEAAADXBQAgAQAAANoFACADDAAAyQsAIFAAAMsLACBRAADKCwAgCMYEAACWCAAwxwQAAO0FABDIBAAAlggAMMkEAQDlBwAhzgQBAOUHACGZBQEA5QcAIZoFQADnBwAhmwVAAOcHACEDAAAA2gUAIAEAAOwFADBPAADtBQAgAwAAANoFACABAADbBQAwAgAA1wUAIA0iAAD9BwAgxgQAAJUIADDHBAAA1AEAEMgEAACVCAAwyQQBAAAAAdEEQAD8BwAh0gRAAPwHACHfBAEA-AcAIeAEAQD4BwAh5QQAAPoHACDnBCAA-wcAIZcFAQAAAAGYBQAA8QcAIAEAAADwBQAgAQAAAPAFACABIgAA7QoAIAMAAADUAQAgAQAA8wUAMAIAAPAFACADAAAA1AEAIAEAAPMFADACAADwBQAgAwAAANQBACABAADzBQAwAgAA8AUAIAoiAADICwAgyQQBAAAAAdEEQAAAAAHSBEAAAAAB3wQBAAAAAeAEAQAAAAHlBIAAAAAB5wQgAAAAAZcFAQAAAAGYBQAAxwsAIAFDAAD3BQAgCckEAQAAAAHRBEAAAAAB0gRAAAAAAd8EAQAAAAHgBAEAAAAB5QSAAAAAAecEIAAAAAGXBQEAAAABmAUAAMcLACABQwAA-QUAMAFDAAD5BQAwCiIAAMYLACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACHfBAEApgkAIeAEAQCmCQAh5QSAAAAAAecEIADoCgAhlwUBAKYJACGYBQAAxQsAIAIAAADwBQAgQwAA_AUAIAnJBAEApgkAIdEEQACoCQAh0gRAAKgJACHfBAEApgkAIeAEAQCmCQAh5QSAAAAAAecEIADoCgAhlwUBAKYJACGYBQAAxQsAIAIAAADUAQAgQwAA_gUAIAIAAADUAQAgQwAA_gUAIAMAAADwBQAgSgAA9wUAIEsAAPwFACABAAAA8AUAIAEAAADUAQAgAwwAAMILACBQAADECwAgUQAAwwsAIAzGBAAAlAgAMMcEAACFBgAQyAQAAJQIADDJBAEA5QcAIdEEQADnBwAh0gRAAOcHACHfBAEA5QcAIeAEAQDlBwAh5QQAAPIHACDnBCAA8wcAIZcFAQDlBwAhmAUAAPEHACADAAAA1AEAIAEAAIQGADBPAACFBgAgAwAAANQBACABAADzBQAwAgAA8AUAIAEAAABfACABAAAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgEB4AAMELACAhAACgCwAgIgAAoQsAICMAAKILACDJBAEAAAAB0QRAAAAAAdIEQAAAAAH1BAEAAAAB_wQBAAAAAYEFAAAAlwUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAYYFAQAAAAGXBQEAAAABAUMAAI0GACAMyQQBAAAAAdEEQAAAAAHSBEAAAAAB9QQBAAAAAf8EAQAAAAGBBQAAAJcFAoIFAQAAAAGDBUAAAAABhAVAAAAAAYUFAQAAAAGGBQEAAAABlwUBAAAAAQFDAACPBgAwAUMAAI8GADABAAAAYwAgAQAAAGUAIBAeAADACwAgIQAAnAsAICIAAJ0LACAjAACeCwAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh9QQBAKcJACH_BAEApwkAIYEFAACaC5cFIoIFAQCnCQAhgwVAAM8JACGEBUAAqAkAIYUFAQCmCQAhhgUBAKcJACGXBQEApgkAIQIAAABfACBDAACUBgAgDMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIfUEAQCnCQAh_wQBAKcJACGBBQAAmguXBSKCBQEApwkAIYMFQADPCQAhhAVAAKgJACGFBQEApgkAIYYFAQCnCQAhlwUBAKYJACECAAAAXQAgQwAAlgYAIAIAAABdACBDAACWBgAgAQAAAGMAIAEAAABlACADAAAAXwAgSgAAjQYAIEsAAJQGACABAAAAXwAgAQAAAF0AIAgMAAC9CwAgUAAAvwsAIFEAAL4LACD1BAAAogkAIP8EAACiCQAgggUAAKIJACCDBQAAogkAIIYFAACiCQAgD8YEAACQCAAwxwQAAJ8GABDIBAAAkAgAMMkEAQDlBwAh0QRAAOcHACHSBEAA5wcAIfUEAQDmBwAh_wQBAOYHACGBBQAAkQiXBSKCBQEA5gcAIYMFQACCCAAhhAVAAOcHACGFBQEA5QcAIYYFAQDmBwAhlwUBAOUHACEDAAAAXQAgAQAAngYAME8AAJ8GACADAAAAXQAgAQAAXgAwAgAAXwAgAQAAAHsAIAEAAAB7ACADAAAAZQAgAQAAegAwAgAAewAgAwAAAGUAIAEAAHoAMAIAAHsAIAMAAABlACABAAB6ADACAAB7ACAOAwAAuQsAIAcAALcLACAJAAC4CwAgFQAAugsAIB8AALsLACAkAAC8CwAgyQQBAAAAAc0EAQAAAAHOBAEAAAABzwQBAAAAAdAEAQAAAAHRBEAAAAAB0gRAAAAAAZUFAQAAAAEBQwAApwYAIAjJBAEAAAABzQQBAAAAAc4EAQAAAAHPBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAABlQUBAAAAAQFDAACpBgAwAUMAAKkGADABAAAAGAAgDgMAAIwLACAHAACKCwAgCQAAiwsAIBUAAI0LACAfAACOCwAgJAAAjwsAIMkEAQCmCQAhzQQBAKcJACHOBAEApgkAIc8EAQCnCQAh0AQBAKYJACHRBEAAqAkAIdIEQACoCQAhlQUBAKYJACECAAAAewAgQwAArQYAIAjJBAEApgkAIc0EAQCnCQAhzgQBAKYJACHPBAEApwkAIdAEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZUFAQCmCQAhAgAAAGUAIEMAAK8GACACAAAAZQAgQwAArwYAIAEAAAAYACADAAAAewAgSgAApwYAIEsAAK0GACABAAAAewAgAQAAAGUAIAUMAACHCwAgUAAAiQsAIFEAAIgLACDNBAAAogkAIM8EAACiCQAgC8YEAACPCAAwxwQAALcGABDIBAAAjwgAMMkEAQDlBwAhzQQBAOYHACHOBAEA5QcAIc8EAQDmBwAh0AQBAOUHACHRBEAA5wcAIdIEQADnBwAhlQUBAOUHACEDAAAAZQAgAQAAtgYAME8AALcGACADAAAAZQAgAQAAegAwAgAAewAgAQAAAIsBACABAAAAiwEAIAMAAAA2ACABAACKAQAwAgAAiwEAIAMAAAA2ACABAACKAQAwAgAAiwEAIAMAAAA2ACABAACKAQAwAgAAiwEAIBgHAADCCQAgCQAAwwkAIA4AAMEJACASAACyCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHzBAEAAAABhwUBAAAAAYgFCAAAAAGJBQgAAAABigUIAAAAAYsFCAAAAAGMBQgAAAABjQUIAAAAAY4FCAAAAAGPBQgAAAABkAUIAAAAAZEFCAAAAAGSBQgAAAABkwUIAAAAAZQFCAAAAAEBQwAAvwYAIBTJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfMEAQAAAAGHBQEAAAABiAUIAAAAAYkFCAAAAAGKBQgAAAABiwUIAAAAAYwFCAAAAAGNBQgAAAABjgUIAAAAAY8FCAAAAAGQBQgAAAABkQUIAAAAAZIFCAAAAAGTBQgAAAABlAUIAAAAAQFDAADBBgAwAUMAAMEGADABAAAAGAAgGAcAAL4JACAJAAC_CQAgDgAAvQkAIBIAALEKACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8wQBAKYJACGHBQEApgkAIYgFCAC7CQAhiQUIALsJACGKBQgAuwkAIYsFCAC7CQAhjAUIALsJACGNBQgAuwkAIY4FCAC7CQAhjwUIALsJACGQBQgAuwkAIZEFCAC7CQAhkgUIALsJACGTBQgAuwkAIZQFCAC7CQAhAgAAAIsBACBDAADFBgAgFMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHzBAEApgkAIYcFAQCmCQAhiAUIALsJACGJBQgAuwkAIYoFCAC7CQAhiwUIALsJACGMBQgAuwkAIY0FCAC7CQAhjgUIALsJACGPBQgAuwkAIZAFCAC7CQAhkQUIALsJACGSBQgAuwkAIZMFCAC7CQAhlAUIALsJACECAAAANgAgQwAAxwYAIAIAAAA2ACBDAADHBgAgAQAAABgAIAMAAACLAQAgSgAAvwYAIEsAAMUGACABAAAAiwEAIAEAAAA2ACATDAAAggsAIFAAAIULACBRAACECwAg0gEAAIMLACDTAQAAhgsAIM8EAACiCQAgiAUAAKIJACCJBQAAogkAIIoFAACiCQAgiwUAAKIJACCMBQAAogkAII0FAACiCQAgjgUAAKIJACCPBQAAogkAIJAFAACiCQAgkQUAAKIJACCSBQAAogkAIJMFAACiCQAglAUAAKIJACAXxgQAAIsIADDHBAAAzwYAEMgEAACLCAAwyQQBAOUHACHOBAEA5QcAIc8EAQDmBwAh0QRAAOcHACHSBEAA5wcAIfMEAQDlBwAhhwUBAOUHACGIBQgAjAgAIYkFCACMCAAhigUIAIwIACGLBQgAjAgAIYwFCACMCAAhjQUIAIwIACGOBQgAjAgAIY8FCACMCAAhkAUIAIwIACGRBQgAjAgAIZIFCACMCAAhkwUIAIwIACGUBQgAjAgAIQMAAAA2ACABAADOBgAwTwAAzwYAIAMAAAA2ACABAACKAQAwAgAAiwEAIAEAAACBAQAgAQAAAIEBACADAAAAfwAgAQAAgAEAMAIAAIEBACADAAAAfwAgAQAAgAEAMAIAAIEBACADAAAAfwAgAQAAgAEAMAIAAIEBACAUBwAA2gkAIAkAANsJACASAACBCwAgIQAA1wkAICMAANkJACAqAADYCQAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHeBAEAAAAB8wQBAAAAAf8EAQAAAAGBBQAAAIEFAoIFAQAAAAGDBUAAAAABhAVAAAAAAYUFAQAAAAGGBQEAAAABAUMAANcGACAOyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHeBAEAAAAB8wQBAAAAAf8EAQAAAAGBBQAAAIEFAoIFAQAAAAGDBUAAAAABhAVAAAAAAYUFAQAAAAGGBQEAAAABAUMAANkGADABQwAA2QYAMAEAAABjACABAAAADgAgAQAAABgAIBQHAADUCQAgCQAA1QkAIBIAAIALACAhAADRCQAgIwAA0wkAICoAANIJACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh3gQBAKYJACHzBAEApwkAIf8EAQCnCQAhgQUAAM4JgQUiggUBAKcJACGDBUAAzwkAIYQFQACoCQAhhQUBAKYJACGGBQEApwkAIQIAAACBAQAgQwAA3wYAIA7JBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh3gQBAKYJACHzBAEApwkAIf8EAQCnCQAhgQUAAM4JgQUiggUBAKcJACGDBUAAzwkAIYQFQACoCQAhhQUBAKYJACGGBQEApwkAIQIAAAB_ACBDAADhBgAgAgAAAH8AIEMAAOEGACABAAAAYwAgAQAAAA4AIAEAAAAYACADAAAAgQEAIEoAANcGACBLAADfBgAgAQAAAIEBACABAAAAfwAgCQwAAP0KACBQAAD_CgAgUQAA_goAIM8EAACiCQAg8wQAAKIJACD_BAAAogkAIIIFAACiCQAggwUAAKIJACCGBQAAogkAIBHGBAAAhwgAMMcEAADrBgAQyAQAAIcIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOYHACHRBEAA5wcAIdIEQADnBwAh3gQBAOUHACHzBAEA5gcAIf8EAQDmBwAhgQUAAIgIgQUiggUBAOYHACGDBUAAgggAIYQFQADnBwAhhQUBAOUHACGGBQEA5gcAIQMAAAB_ACABAADqBgAwTwAA6wYAIAMAAAB_ACABAACAAQAwAgAAgQEAIAEAAABHACABAAAARwAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAABFACABAABGADACAABHACADAAAARQAgAQAARgAwAgAARwAgEAcAAIAKACAJAACBCgAgEgAA_AoAIBYAAP8JACAcAACCCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8wQBAAAAAfoEAQAAAAH7BAEAAAAB_QQAAAD9BAL-BEAAAAABAUMAAPMGACALyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8wQBAAAAAfoEAQAAAAH7BAEAAAAB_QQAAAD9BAL-BEAAAAABAUMAAPUGADABQwAA9QYAMAEAAAAYACAQBwAA6QkAIAkAAOoJACASAAD7CgAgFgAA6AkAIBwAAOsJACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8QQBAKYJACHzBAEApgkAIfoEAQCmCQAh-wQBAKcJACH9BAAA5gn9BCL-BEAAzwkAIQIAAABHACBDAAD5BgAgC8kEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfMEAQCmCQAh-gQBAKYJACH7BAEApwkAIf0EAADmCf0EIv4EQADPCQAhAgAAAEUAIEMAAPsGACACAAAARQAgQwAA-wYAIAEAAAAYACADAAAARwAgSgAA8wYAIEsAAPkGACABAAAARwAgAQAAAEUAIAYMAAD4CgAgUAAA-goAIFEAAPkKACDPBAAAogkAIPsEAACiCQAg_gQAAKIJACAOxgQAAIAIADDHBAAAgwcAEMgEAACACAAwyQQBAOUHACHOBAEA5QcAIc8EAQDmBwAh0QRAAOcHACHSBEAA5wcAIfEEAQDlBwAh8wQBAOUHACH6BAEA5QcAIfsEAQDmBwAh_QQAAIEI_QQi_gRAAIIIACEDAAAARQAgAQAAggcAME8AAIMHACADAAAARQAgAQAARgAwAgAARwAgAQAAAD0AIAEAAAA9ACADAAAAOwAgAQAAPAAwAgAAPQAgAwAAADsAIAEAADwAMAIAAD0AIAMAAAA7ACABAAA8ADACAAA9ACAPBwAA_AkAIAkAAP0JACAdAAD3CgAgHgAA-wkAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB9AQBAAAAAfUEAQAAAAH2BAEAAAAB9wQBAAAAAfgEAQAAAAH5BEAAAAABAUMAAIsHACALyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAH0BAEAAAAB9QQBAAAAAfYEAQAAAAH3BAEAAAAB-AQBAAAAAfkEQAAAAAEBQwAAjQcAMAFDAACNBwAwAQAAABgAIA8HAAD4CQAgCQAA-QkAIB0AAPYKACAeAAD3CQAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfQEAQCmCQAh9QQBAKYJACH2BAEApwkAIfcEAQCnCQAh-AQBAKcJACH5BEAAqAkAIQIAAAA9ACBDAACRBwAgC8kEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACH0BAEApgkAIfUEAQCmCQAh9gQBAKcJACH3BAEApwkAIfgEAQCnCQAh-QRAAKgJACECAAAAOwAgQwAAkwcAIAIAAAA7ACBDAACTBwAgAQAAABgAIAMAAAA9ACBKAACLBwAgSwAAkQcAIAEAAAA9ACABAAAAOwAgBwwAAPMKACBQAAD1CgAgUQAA9AoAIM8EAACiCQAg9gQAAKIJACD3BAAAogkAIPgEAACiCQAgDsYEAAD_BwAwxwQAAJsHABDIBAAA_wcAMMkEAQDlBwAhzgQBAOUHACHPBAEA5gcAIdEEQADnBwAh0gRAAOcHACH0BAEA5QcAIfUEAQDlBwAh9gQBAOYHACH3BAEA5gcAIfgEAQDmBwAh-QRAAOcHACEDAAAAOwAgAQAAmgcAME8AAJsHACADAAAAOwAgAQAAPAAwAgAAPQAgAQAAAEIAIAEAAABCACADAAAAQAAgAQAAQQAwAgAAQgAgAwAAAEAAIAEAAEEAMAIAAEIAIAMAAABAACABAABBADACAABCACANBwAAlQoAIAkAAJYKACASAADyCgAgFAAAlAoAIBYAAJMKACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHyBAEAAAAB8wQBAAAAAQFDAACjBwAgCMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfIEAQAAAAHzBAEAAAABAUMAAKUHADABQwAApQcAMAEAAAAYACANBwAAkAoAIAkAAJEKACASAADxCgAgFAAAjwoAIBYAAI4KACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8QQBAKYJACHyBAEApgkAIfMEAQCmCQAhAgAAAEIAIEMAAKkHACAIyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfEEAQCmCQAh8gQBAKYJACHzBAEApgkAIQIAAABAACBDAACrBwAgAgAAAEAAIEMAAKsHACABAAAAGAAgAwAAAEIAIEoAAKMHACBLAACpBwAgAQAAAEIAIAEAAABAACAEDAAA7goAIFAAAPAKACBRAADvCgAgzwQAAKIJACALxgQAAP4HADDHBAAAswcAEMgEAAD-BwAwyQQBAOUHACHOBAEA5QcAIc8EAQDmBwAh0QRAAOcHACHSBEAA5wcAIfEEAQDlBwAh8gQBAOUHACHzBAEA5QcAIQMAAABAACABAACyBwAwTwAAswcAIAMAAABAACABAABBADACAABCACARKgAA_QcAIMYEAAD3BwAwxwQAANABABDIBAAA9wcAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAh3gQBAAAAAd8EAQD4BwAh4AQBAPgHACHhBAEA-AcAIeIEAQD5BwAh4wQAAPEHACDkBAAA8QcAIOUEAAD6BwAg5gQAAPoHACDnBCAA-wcAIQEAAAC2BwAgAQAAALYHACACKgAA7QoAIOIEAACiCQAgAwAAANABACABAAC5BwAwAgAAtgcAIAMAAADQAQAgAQAAuQcAMAIAALYHACADAAAA0AEAIAEAALkHADACAAC2BwAgDioAAOwKACDJBAEAAAAB0QRAAAAAAdIEQAAAAAHeBAEAAAAB3wQBAAAAAeAEAQAAAAHhBAEAAAAB4gQBAAAAAeMEAADqCgAg5AQAAOsKACDlBIAAAAAB5gSAAAAAAecEIAAAAAEBQwAAvQcAIA3JBAEAAAAB0QRAAAAAAdIEQAAAAAHeBAEAAAAB3wQBAAAAAeAEAQAAAAHhBAEAAAAB4gQBAAAAAeMEAADqCgAg5AQAAOsKACDlBIAAAAAB5gSAAAAAAecEIAAAAAEBQwAAvwcAMAFDAAC_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_QcAIMYEAAD3BwAwxwQAANABABDIBAAA9wcAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAId4EAQD4BwAh3wQBAPgHACHgBAEA-AcAIeEEAQD4BwAh4gQBAPkHACHjBAAA8QcAIOQEAADxBwAg5QQAAPoHACDmBAAA-gcAIOcEIAD7BwAhC9MEAQAAAAHUBAEAAAAE1QQBAAAABNYEAQAAAAHXBAEAAAAB2AQBAAAAAdkEAQAAAAHaBAEA7wcAIdsEAQAAAAHcBAEAAAAB3QQBAAAAAQvTBAEAAAAB1AQBAAAABdUEAQAAAAXWBAEAAAAB1wQBAAAAAdgEAQAAAAHZBAEAAAAB2gQBAO0HACHbBAEAAAAB3AQBAAAAAd0EAQAAAAEM0wSAAAAAAdYEgAAAAAHXBIAAAAAB2ASAAAAAAdkEgAAAAAHaBIAAAAAB6AQBAAAAAekEAQAAAAHqBAEAAAAB6wSAAAAAAewEgAAAAAHtBIAAAAABAtMEIAAAAAHaBCAA9QcAIQjTBEAAAAAB1ARAAAAABNUEQAAAAATWBEAAAAAB1wRAAAAAAdgEQAAAAAHZBEAAAAAB2gRAAOoHACEiBAAA1ggAIAUAANcIACAGAAC7CAAgEgAAvAgAIB4AAL0IACArAACrCAAgNAAAvwgAIDcAAL8IACA4AACrCAAgOQAA2AgAIDoAAKgIACA7AACoCAAgPAAA2QgAID0AANoIACDGBAAA1QgAMMcEAABjABDIBAAA1QgAMMkEAQD4BwAhzQQBAPkHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPgHACHVBQEA-AcAIdYFIAD7BwAh1wUBAPkHACHYBQEA-QcAIdkFAQD5BwAh2gUBAPkHACHbBQEA-QcAIdwFAQD5BwAh3QUBAPgHACHeBQEA-AcAIecFAABjACDoBQAAYwAgC8YEAAD-BwAwxwQAALMHABDIBAAA_gcAMMkEAQDlBwAhzgQBAOUHACHPBAEA5gcAIdEEQADnBwAh0gRAAOcHACHxBAEA5QcAIfIEAQDlBwAh8wQBAOUHACEOxgQAAP8HADDHBAAAmwcAEMgEAAD_BwAwyQQBAOUHACHOBAEA5QcAIc8EAQDmBwAh0QRAAOcHACHSBEAA5wcAIfQEAQDlBwAh9QQBAOUHACH2BAEA5gcAIfcEAQDmBwAh-AQBAOYHACH5BEAA5wcAIQ7GBAAAgAgAMMcEAACDBwAQyAQAAIAIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOYHACHRBEAA5wcAIdIEQADnBwAh8QQBAOUHACHzBAEA5QcAIfoEAQDlBwAh-wQBAOYHACH9BAAAgQj9BCL-BEAAgggAIQcMAADpBwAgUAAAhggAIFEAAIYIACDTBAAAAP0EAtQEAAAA_QQI1QQAAAD9BAjaBAAAhQj9BCILDAAA7AcAIFAAAIQIACBRAACECAAg0wRAAAAAAdQEQAAAAAXVBEAAAAAF1gRAAAAAAdcEQAAAAAHYBEAAAAAB2QRAAAAAAdoEQACDCAAhCwwAAOwHACBQAACECAAgUQAAhAgAINMEQAAAAAHUBEAAAAAF1QRAAAAABdYEQAAAAAHXBEAAAAAB2ARAAAAAAdkEQAAAAAHaBEAAgwgAIQjTBEAAAAAB1ARAAAAABdUEQAAAAAXWBEAAAAAB1wRAAAAAAdgEQAAAAAHZBEAAAAAB2gRAAIQIACEHDAAA6QcAIFAAAIYIACBRAACGCAAg0wQAAAD9BALUBAAAAP0ECNUEAAAA_QQI2gQAAIUI_QQiBNMEAAAA_QQC1AQAAAD9BAjVBAAAAP0ECNoEAACGCP0EIhHGBAAAhwgAMMcEAADrBgAQyAQAAIcIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOYHACHRBEAA5wcAIdIEQADnBwAh3gQBAOUHACHzBAEA5gcAIf8EAQDmBwAhgQUAAIgIgQUiggUBAOYHACGDBUAAgggAIYQFQADnBwAhhQUBAOUHACGGBQEA5gcAIQcMAADpBwAgUAAAiggAIFEAAIoIACDTBAAAAIEFAtQEAAAAgQUI1QQAAACBBQjaBAAAiQiBBSIHDAAA6QcAIFAAAIoIACBRAACKCAAg0wQAAACBBQLUBAAAAIEFCNUEAAAAgQUI2gQAAIkIgQUiBNMEAAAAgQUC1AQAAACBBQjVBAAAAIEFCNoEAACKCIEFIhfGBAAAiwgAMMcEAADPBgAQyAQAAIsIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOYHACHRBEAA5wcAIdIEQADnBwAh8wQBAOUHACGHBQEA5QcAIYgFCACMCAAhiQUIAIwIACGKBQgAjAgAIYsFCACMCAAhjAUIAIwIACGNBQgAjAgAIY4FCACMCAAhjwUIAIwIACGQBQgAjAgAIZEFCACMCAAhkgUIAIwIACGTBQgAjAgAIZQFCACMCAAhDQwAAOwHACBQAACOCAAgUQAAjggAINIBAACOCAAg0wEAAI4IACDTBAgAAAAB1AQIAAAABdUECAAAAAXWBAgAAAAB1wQIAAAAAdgECAAAAAHZBAgAAAAB2gQIAI0IACENDAAA7AcAIFAAAI4IACBRAACOCAAg0gEAAI4IACDTAQAAjggAINMECAAAAAHUBAgAAAAF1QQIAAAABdYECAAAAAHXBAgAAAAB2AQIAAAAAdkECAAAAAHaBAgAjQgAIQjTBAgAAAAB1AQIAAAABdUECAAAAAXWBAgAAAAB1wQIAAAAAdgECAAAAAHZBAgAAAAB2gQIAI4IACELxgQAAI8IADDHBAAAtwYAEMgEAACPCAAwyQQBAOUHACHNBAEA5gcAIc4EAQDlBwAhzwQBAOYHACHQBAEA5QcAIdEEQADnBwAh0gRAAOcHACGVBQEA5QcAIQ_GBAAAkAgAMMcEAACfBgAQyAQAAJAIADDJBAEA5QcAIdEEQADnBwAh0gRAAOcHACH1BAEA5gcAIf8EAQDmBwAhgQUAAJEIlwUiggUBAOYHACGDBUAAgggAIYQFQADnBwAhhQUBAOUHACGGBQEA5gcAIZcFAQDlBwAhBwwAAOkHACBQAACTCAAgUQAAkwgAINMEAAAAlwUC1AQAAACXBQjVBAAAAJcFCNoEAACSCJcFIgcMAADpBwAgUAAAkwgAIFEAAJMIACDTBAAAAJcFAtQEAAAAlwUI1QQAAACXBQjaBAAAkgiXBSIE0wQAAACXBQLUBAAAAJcFCNUEAAAAlwUI2gQAAJMIlwUiDMYEAACUCAAwxwQAAIUGABDIBAAAlAgAMMkEAQDlBwAh0QRAAOcHACHSBEAA5wcAId8EAQDlBwAh4AQBAOUHACHlBAAA8gcAIOcEIADzBwAhlwUBAOUHACGYBQAA8QcAIA0iAAD9BwAgxgQAAJUIADDHBAAA1AEAEMgEAACVCAAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAh3wQBAPgHACHgBAEA-AcAIeUEAAD6BwAg5wQgAPsHACGXBQEA-AcAIZgFAADxBwAgCMYEAACWCAAwxwQAAO0FABDIBAAAlggAMMkEAQDlBwAhzgQBAOUHACGZBQEA5QcAIZoFQADnBwAhmwVAAOcHACEKFQAAmQgAIBkAAJgIACDGBAAAlwgAMMcEAADaBQAQyAQAAJcIADDJBAEA-AcAIc4EAQD4BwAhmQUBAPgHACGaBUAA_AcAIZsFQAD8BwAhA5wFAABKACCdBQAASgAgngUAAEoAIAOcBQAAJgAgnQUAACYAIJ4FAAAmACANxgQAAJoIADDHBAAA1AUAEMgEAACaCAAwyQQBAOUHACHOBAEA5QcAIc8EAQDmBwAh0QRAAOcHACHSBEAA5wcAIZkFAQDlBwAhnwUBAOYHACGgBQIAmwgAIaEFAQDlBwAhogUBAOYHACENDAAA7AcAIFAAAOwHACBRAADsBwAg0gEAAI4IACDTAQAA7AcAINMEAgAAAAHUBAIAAAAF1QQCAAAABdYEAgAAAAHXBAIAAAAB2AQCAAAAAdkEAgAAAAHaBAIAnAgAIQ0MAADsBwAgUAAA7AcAIFEAAOwHACDSAQAAjggAINMBAADsBwAg0wQCAAAAAdQEAgAAAAXVBAIAAAAF1gQCAAAAAdcEAgAAAAHYBAIAAAAB2QQCAAAAAdoEAgCcCAAhC8YEAACdCAAwxwQAALoFABDIBAAAnQgAMMkEAQDlBwAh0QRAAOcHACHSBEAA5wcAIYEFAACeCKYFIpkFAQDlBwAhnwUBAOYHACGjBUAA5wcAIaQFQADnBwAhBwwAAOkHACBQAACgCAAgUQAAoAgAINMEAAAApgUC1AQAAACmBQjVBAAAAKYFCNoEAACfCKYFIgcMAADpBwAgUAAAoAgAIFEAAKAIACDTBAAAAKYFAtQEAAAApgUI1QQAAACmBQjaBAAAnwimBSIE0wQAAACmBQLUBAAAAKYFCNUEAAAApgUI2gQAAKAIpgUiDAsAAKMIACDGBAAAoQgAMMcEAACnBQAQyAQAAKEIADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGBBQAAogimBSKZBQEA-AcAIZ8FAQD5BwAhowVAAPwHACGkBUAA_AcAIQTTBAAAAKYFAtQEAAAApgUI1QQAAACmBQjaBAAAoAimBSIDnAUAACoAIJ0FAAAqACCeBQAAKgAgDMYEAACkCAAwxwQAAKEFABDIBAAApAgAMMkEAQDlBwAh0QRAAOcHACHSBEAA5wcAIYcFAQDlBwAhmQUBAOUHACGfBQEA5gcAIaYFAQDmBwAhpwUBAOUHACGoBQEA5QcAIQ7GBAAApQgAMMcEAACLBQAQyAQAAKUIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOUHACHRBEAA5wcAIdIEQADnBwAh-gQBAOUHACGfBQEA5gcAIakFAQDmBwAhqgVAAIIIACGrBQgAjAgAIawFCACMCAAhD8YEAACmCAAwxwQAAPUEABDIBAAApggAMMkEAQDlBwAhzgQBAOUHACHPBAEA5gcAIdEEQADnBwAh0gRAAOcHACH6BAEA5QcAIa0FAQDmBwAhrgUBAOUHACGvBQAA8QcAILAFAQDmBwAhsQUBAOYHACGyBQEA5QcAIRAgAACoCAAgxgQAAKcIADDHBAAA4gQAEMgEAACnCAAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfoEAQD4BwAhrQUBAPkHACGuBQEA-AcAIa8FAADxBwAgsAUBAPkHACGxBQEA-QcAIbIFAQD4BwAhA5wFAABdACCdBQAAXQAgngUAAF0AIA_GBAAAqQgAMMcEAADcBAAQyAQAAKkIADDJBAEA5QcAIc4EAQDlBwAhzwQBAOYHACHRBEAA5wcAIdIEQADnBwAh-gQBAOUHACGtBQEA5gcAIa4FAQDlBwAhrwUAAPEHACCwBQEA5gcAIbEFAQDmBwAhsgUBAOUHACEQIAAAqwgAIMYEAACqCAAwxwQAAMkEABDIBAAAqggAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACH6BAEA-AcAIa0FAQD5BwAhrgUBAPgHACGvBQAA8QcAILAFAQD5BwAhsQUBAPkHACGyBQEA-AcAIQOcBQAAfwAgnQUAAH8AIJ4FAAB_ACARxgQAAKwIADDHBAAAwwQAEMgEAACsCAAwyQQBAOUHACHOBAEA5gcAIdEEQADnBwAh0gRAAOcHACGBBQAArgi6BSKDBUAAgggAIZ8FAQDmBwAhswUBAOUHACG0BQEA5QcAIbUFAQDmBwAhtwUAAK0ItwUjuAUBAOYHACG6BQEA5gcAIbsFAQDmBwAhBwwAAOwHACBQAACyCAAgUQAAsggAINMEAAAAtwUD1AQAAAC3BQnVBAAAALcFCdoEAACxCLcFIwcMAADpBwAgUAAAsAgAIFEAALAIACDTBAAAALoFAtQEAAAAugUI1QQAAAC6BQjaBAAArwi6BSIHDAAA6QcAIFAAALAIACBRAACwCAAg0wQAAAC6BQLUBAAAALoFCNUEAAAAugUI2gQAAK8IugUiBNMEAAAAugUC1AQAAAC6BQjVBAAAALoFCNoEAACwCLoFIgcMAADsBwAgUAAAsggAIFEAALIIACDTBAAAALcFA9QEAAAAtwUJ1QQAAAC3BQnaBAAAsQi3BSME0wQAAAC3BQPUBAAAALcFCdUEAAAAtwUJ2gQAALIItwUjC8YEAACzCAAwxwQAAKkEABDIBAAAswgAMMkEAQDlBwAh0QRAAOcHACHSBEAA5wcAIf0EAACtCLcFI5kFAQDlBwAhnwUBAOYHACG1BQEA5gcAIbgFAQDmBwAhGwYAALsIACAVAACZCAAgFwAAvggAIBkAAJgIACAlAAC3CAAgJgAAuAgAICcAALoIACAoAAC8CAAgKQAAvQgAICsAAKsIACAsAADACAAgLQAAwQgAIC4AAMIIACAwAAC2CAAgMQAAuQgAIDQAAL8IACDGBAAAtAgAMMcEAAAWABDIBAAAtAgAMMkEAQD4BwAh0QRAAPwHACHSBEAA_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_AcAIcYFQAD8BwAhxwUBAPgHACHIBQEA-AcAIRDGBAAA0ggAMMcEAADSAgAQyAQAANIIADDJBAEA5QcAIdAEAQDlBwAh0QRAAOcHACHSBEAA5wcAIckFAQDlBwAhygUBAOUHACHLBQEA5gcAIcwFAQDmBwAhzQUBAOYHACHOBUAAgggAIc8FQACCCAAh0AUBAOYHACHRBQEA5gcAIQvGBAAA0wgAMMcEAAC8AgAQyAQAANMIADDJBAEA5QcAIdAEAQDlBwAh0QRAAOcHACHSBEAA5wcAIcYFQADnBwAh0gUBAOUHACHTBQEA5gcAIdQFAQDmBwAhEsYEAADUCAAwxwQAAKYCABDIBAAA1AgAMMkEAQDlBwAhzQQBAOYHACHRBEAA5wcAIdIEQADnBwAhmQUBAOUHACHVBQEA5QcAIdYFIADzBwAh1wUBAOYHACHYBQEA5gcAIdkFAQDmBwAh2gUBAOYHACHbBQEA5gcAIdwFAQDmBwAh3QUBAOUHACHeBQEA5QcAISAEAADWCAAgBQAA1wgAIAYAALsIACASAAC8CAAgHgAAvQgAICsAAKsIACA0AAC_CAAgNwAAvwgAIDgAAKsIACA5AADYCAAgOgAAqAgAIDsAAKgIACA8AADZCAAgPQAA2ggAIMYEAADVCAAwxwQAAGMAEMgEAADVCAAwyQQBAPgHACHNBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGZBQEA-AcAIdUFAQD4BwAh1gUgAPsHACHXBQEA-QcAIdgFAQD5BwAh2QUBAPkHACHaBQEA-QcAIdsFAQD5BwAh3AUBAPkHACHdBQEA-AcAId4FAQD4BwAhA5wFAAADACCdBQAAAwAgngUAAAMAIAOcBQAABwAgnQUAAAcAIJ4FAAAHACATKgAA_QcAIMYEAAD3BwAwxwQAANABABDIBAAA9wcAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAId4EAQD4BwAh3wQBAPgHACHgBAEA-AcAIeEEAQD4BwAh4gQBAPkHACHjBAAA8QcAIOQEAADxBwAg5QQAAPoHACDmBAAA-gcAIOcEIAD7BwAh5wUAANABACDoBQAA0AEAIA8iAAD9BwAgxgQAAJUIADDHBAAA1AEAEMgEAACVCAAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAh3wQBAPgHACHgBAEA-AcAIeUEAAD6BwAg5wQgAPsHACGXBQEA-AcAIZgFAADxBwAg5wUAANQBACDoBQAA1AEAIAOcBQAA1gEAIJ0FAADWAQAgngUAANYBACAJxgQAANsIADDHBAAAjgIAEMgEAADbCAAwyQQBAOUHACHRBEAA5wcAIdIEQADnBwAhgQUAANwI4QUihwUBAOUHACHfBUAA5wcAIQcMAADpBwAgUAAA3ggAIFEAAN4IACDTBAAAAOEFAtQEAAAA4QUI1QQAAADhBQjaBAAA3QjhBSIHDAAA6QcAIFAAAN4IACBRAADeCAAg0wQAAADhBQLUBAAAAOEFCNUEAAAA4QUI2gQAAN0I4QUiBNMEAAAA4QUC1AQAAADhBQjVBAAAAOEFCNoEAADeCOEFIgnGBAAA3wgAMMcEAAD4AQAQyAQAAN8IADDJBAEA5QcAIc4EAQDlBwAh0AQBAOUHACHRBEAA5wcAIdIEQADnBwAh3QUAAOAI4gUiBwwAAOkHACBQAADiCAAgUQAA4ggAINMEAAAA4gUC1AQAAADiBQjVBAAAAOIFCNoEAADhCOIFIgcMAADpBwAgUAAA4ggAIFEAAOIIACDTBAAAAOIFAtQEAAAA4gUI1QQAAADiBQjaBAAA4QjiBSIE0wQAAADiBQLUBAAAAOIFCNUEAAAA4gUI2gQAAOII4gUiCgMAAP0HACDGBAAA4wgAMMcEAADWAQAQyAQAAOMIADDJBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIcUFAQD4BwAhxgVAAPwHACEUBwAA6AgAIDIAAP0HACAzAADnCAAgxgQAAOQIADDHBAAApwEAEMgEAADkCAAwyQQBAPgHACHOBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGBBQAA5Qi6BSKDBUAA5ggAIZ8FAQD5BwAhswUBAPgHACG0BQEA-AcAIbUFAQD5BwAhtwUAALUItwUjuAUBAPkHACG6BQEA-QcAIbsFAQD5BwAhBNMEAAAAugUC1AQAAAC6BQjVBAAAALoFCNoEAACwCLoFIgjTBEAAAAAB1ARAAAAABdUEQAAAAAXWBEAAAAAB1wRAAAAAAdgEQAAAAAHZBEAAAAAB2gRAAIQIACEiBAAA1ggAIAUAANcIACAGAAC7CAAgEgAAvAgAIB4AAL0IACArAACrCAAgNAAAvwgAIDcAAL8IACA4AACrCAAgOQAA2AgAIDoAAKgIACA7AACoCAAgPAAA2QgAID0AANoIACDGBAAA1QgAMMcEAABjABDIBAAA1QgAMMkEAQD4BwAhzQQBAPkHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPgHACHVBQEA-AcAIdYFIAD7BwAh1wUBAPkHACHYBQEA-QcAIdkFAQD5BwAh2gUBAPkHACHbBQEA-QcAIdwFAQD5BwAh3QUBAPgHACHeBQEA-AcAIecFAABjACDoBQAAYwAgHQYAALsIACAVAACZCAAgFwAAvggAIBkAAJgIACAlAAC3CAAgJgAAuAgAICcAALoIACAoAAC8CAAgKQAAvQgAICsAAKsIACAsAADACAAgLQAAwQgAIC4AAMIIACAwAAC2CAAgMQAAuQgAIDQAAL8IACDGBAAAtAgAMMcEAAAWABDIBAAAtAgAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAIf0EAAC1CLcFI5kFAQD4BwAhnwUBAPkHACG1BQEA-QcAIbgFAQD5BwAh5wUAABYAIOgFAAAWACAOBwAA7AgAIA8AAKMIACDGBAAA6QgAMMcEAACcAQAQyAQAAOkIADDJBAEA-AcAIc4EAQD4BwAh0QRAAPwHACHSBEAA_AcAIZkFAQD5BwAhwAUBAPgHACHBBQEA-AcAIcIFAgDqCAAhxAUAAOsIxAUiCNMEAgAAAAHUBAIAAAAE1QQCAAAABNYEAgAAAAHXBAIAAAAB2AQCAAAAAdkEAgAAAAHaBAIA6QcAIQTTBAAAAMQFAtQEAAAAxAUI1QQAAADEBQjaBAAAywjEBSIdBgAAuwgAIBUAAJkIACAXAAC-CAAgGQAAmAgAICUAALcIACAmAAC4CAAgJwAAuggAICgAALwIACApAAC9CAAgKwAAqwgAICwAAMAIACAtAADBCAAgLgAAwggAIDAAALYIACAxAAC5CAAgNAAAvwgAIMYEAAC0CAAwxwQAABYAEMgEAAC0CAAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAh_QQAALUItwUjmQUBAPgHACGfBQEA-QcAIbUFAQD5BwAhuAUBAPkHACHnBQAAFgAg6AUAABYAIBsHAADsCAAgCQAA8QgAIA4AAO8IACASAADwCAAgxgQAAO0IADDHBAAANgAQyAQAAO0IADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8wQBAPgHACGHBQEA-AcAIYgFCADuCAAhiQUIAO4IACGKBQgA7ggAIYsFCADuCAAhjAUIAO4IACGNBQgA7ggAIY4FCADuCAAhjwUIAO4IACGQBQgA7ggAIZEFCADuCAAhkgUIAO4IACGTBQgA7ggAIZQFCADuCAAhCNMECAAAAAHUBAgAAAAF1QQIAAAABdYECAAAAAHXBAgAAAAB2AQIAAAAAdkECAAAAAHaBAgAjggAIRwHAADsCAAgCQAA8QgAIAoAAJUJACALAACjCAAgEQAAkwkAIBIAAPAIACATAACUCQAgFAAAhwkAIBYAAIQJACAaAACACQAgHgAAiwkAIMYEAACSCQAwxwQAACYAEMgEAACSCQAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfEEAQD4BwAh8gQBAPgHACHzBAEA-AcAIfUEAQD4BwAhoQUBAPgHACGxBQEA-QcAIb0FQAD8BwAh5wUAACYAIOgFAAAmACAXAwAA_QcAIAcAAOwIACAJAACXCQAgFQAAmQgAIBcAAL4IACAYAADACAAgNQAAqwgAIDYAAMIIACDGBAAAnQkAMMcEAAAOABDIBAAAnQkAMMkEAQD4BwAhygQBAPgHACHLBAEA-AcAIcwEAQD4BwAhzQQBAPkHACHOBAEA-AcAIc8EAQD4BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAh5wUAAA4AIOgFAAAOACAZCAAAmgkAIBUAAJkIACAXAAC-CAAgGQAAmAgAICUAALcIACAmAAC4CAAgJwAAuggAICgAALwIACApAAC9CAAgKwAAqwgAICwAAMAIACAtAADBCAAgLgAAwggAIMYEAACZCQAwxwQAABgAEMgEAACZCQAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAhnwUBAPkHACGwBQEA-QcAIbUFAQD5BwAhvAUBAPgHACHnBQAAGAAg6AUAABgAIALeBAEAAAABhQUBAAAAARcHAADsCAAgCQAA8QgAIBIAAPYIACAhAAD1CAAgIwAA5wgAICoAAP0HACDGBAAA8wgAMMcEAAB_ABDIBAAA8wgAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHeBAEA-AcAIfMEAQD5BwAh_wQBAPkHACGBBQAA9AiBBSKCBQEA-QcAIYMFQADmCAAhhAVAAPwHACGFBQEA-AcAIYYFAQD5BwAhBNMEAAAAgQUC1AQAAACBBQjVBAAAAIEFCNoEAACKCIEFIhIgAACrCAAgxgQAAKoIADDHBAAAyQQAEMgEAACqCAAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfoEAQD4BwAhrQUBAPkHACGuBQEA-AcAIa8FAADxBwAgsAUBAPkHACGxBQEA-QcAIbIFAQD4BwAh5wUAAMkEACDoBQAAyQQAIBcDAAD9BwAgBwAA7AgAIAkAAJcJACAVAACZCAAgFwAAvggAIBgAAMAIACA1AACrCAAgNgAAwggAIMYEAACdCQAwxwQAAA4AEMgEAACdCQAwyQQBAPgHACHKBAEA-AcAIcsEAQD4BwAhzAQBAPgHACHNBAEA-QcAIc4EAQD4BwAhzwQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHnBQAADgAg6AUAAA4AIBEDAAD9BwAgBwAA7AgAIAkAAPEIACAVAACZCAAgHwAAwQgAICQAAKgIACDGBAAA9wgAMMcEAABlABDIBAAA9wgAMMkEAQD4BwAhzQQBAPkHACHOBAEA-AcAIc8EAQD5BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhlQUBAPgHACENBwAA7AgAIAkAAPEIACAZAACYCAAgxgQAAPgIADDHBAAAUQAQyAQAAPgIADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPgHACGfBQEA-QcAIQKFBQEAAAABlwUBAAAAARMeAAD9CAAgIQAA_AgAICIAAP0HACAjAADnCAAgxgQAAPoIADDHBAAAXQAQyAQAAPoIADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACH1BAEA-QcAIf8EAQD5BwAhgQUAAPsIlwUiggUBAPkHACGDBUAA5ggAIYQFQAD8BwAhhQUBAPgHACGGBQEA-QcAIZcFAQD4BwAhBNMEAAAAlwUC1AQAAACXBQjVBAAAAJcFCNoEAACTCJcFIhIgAACoCAAgxgQAAKcIADDHBAAA4gQAEMgEAACnCAAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfoEAQD4BwAhrQUBAPkHACGuBQEA-AcAIa8FAADxBwAgsAUBAPkHACGxBQEA-QcAIbIFAQD4BwAh5wUAAOIEACDoBQAA4gQAIBMDAAD9BwAgBwAA7AgAIAkAAPEIACAVAACZCAAgHwAAwQgAICQAAKgIACDGBAAA9wgAMMcEAABlABDIBAAA9wgAMMkEAQD4BwAhzQQBAPkHACHOBAEA-AcAIc8EAQD5BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhlQUBAPgHACHnBQAAZQAg6AUAAGUAIBQHAADsCAAgCQAA8QgAIBUAAJkIACAXAAC-CAAgGAAAwAgAIBoAAIAJACAbAACBCQAgxgQAAP4IADDHBAAASgAQyAQAAP4IADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPgHACGfBQEA-QcAIaAFAgD_CAAhoQUBAPgHACGiBQEA-QcAIQjTBAIAAAAB1AQCAAAABdUEAgAAAAXWBAIAAAAB1wQCAAAAAdgEAgAAAAHZBAIAAAAB2gQCAOwHACEMFQAAmQgAIBkAAJgIACDGBAAAlwgAMMcEAADaBQAQyAQAAJcIADDJBAEA-AcAIc4EAQD4BwAhmQUBAPgHACGaBUAA_AcAIZsFQAD8BwAh5wUAANoFACDoBQAA2gUAIA8HAADsCAAgCQAA8QgAIBkAAJgIACDGBAAA-AgAMMcEAABRABDIBAAA-AgAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGZBQEA-AcAIZ8FAQD5BwAh5wUAAFEAIOgFAABRACATBwAA7AgAIAkAAPEIACASAADwCAAgFgAAhAkAIBwAAMEIACDGBAAAggkAMMcEAABFABDIBAAAggkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHxBAEA-AcAIfMEAQD4BwAh-gQBAPgHACH7BAEA-QcAIf0EAACDCf0EIv4EQADmCAAhBNMEAAAA_QQC1AQAAAD9BAjVBAAAAP0ECNoEAACGCP0EIhYHAADsCAAgCQAA8QgAIBUAAJkIACAXAAC-CAAgGAAAwAgAIBoAAIAJACAbAACBCQAgxgQAAP4IADDHBAAASgAQyAQAAP4IADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPgHACGfBQEA-QcAIaAFAgD_CAAhoQUBAPgHACGiBQEA-QcAIecFAABKACDoBQAASgAgAvEEAQAAAAHyBAEAAAABEAcAAOwIACAJAADxCAAgEgAA8AgAIBQAAIcJACAWAACECQAgxgQAAIYJADDHBAAAQAAQyAQAAIYJADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8QQBAPgHACHyBAEA-AcAIfMEAQD4BwAhFAcAAOwIACAJAACXCQAgCgAAlQkAIBUAAJkIACAXAAC-CAAgxgQAAJYJADDHBAAAIQAQyAQAAJYJADDJBAEA-AcAIc4EAQD4BwAhzwQBAPgHACHRBEAA_AcAIdIEQAD8BwAhnwUBAPkHACGrBQIA_wgAIbEFAQD5BwAhvgUBAPgHACG_BQEA-AcAIecFAAAhACDoBQAAIQAgAvQEAQAAAAH1BAEAAAABEgcAAOwIACAJAADxCAAgHQAAigkAIB4AAIsJACDGBAAAiQkAMMcEAAA7ABDIBAAAiQkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACH0BAEA-AcAIfUEAQD4BwAh9gQBAPkHACH3BAEA-QcAIfgEAQD5BwAh-QRAAPwHACEVBwAA7AgAIAkAAPEIACASAADwCAAgFgAAhAkAIBwAAMEIACDGBAAAggkAMMcEAABFABDIBAAAggkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHxBAEA-AcAIfMEAQD4BwAh-gQBAPgHACH7BAEA-QcAIf0EAACDCf0EIv4EQADmCAAh5wUAAEUAIOgFAABFACATAwAA_QcAIAcAAOwIACAJAADxCAAgFQAAmQgAIB8AAMEIACAkAACoCAAgxgQAAPcIADDHBAAAZQAQyAQAAPcIADDJBAEA-AcAIc0EAQD5BwAhzgQBAPgHACHPBAEA-QcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIZUFAQD4BwAh5wUAAGUAIOgFAABlACAChwUBAAAAAd8FQAAAAAEKDgAA7wgAIMYEAACNCQAwxwQAADIAEMgEAACNCQAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAhgQUAAI4J4QUihwUBAPgHACHfBUAA_AcAIQTTBAAAAOEFAtQEAAAA4QUI1QQAAADhBQjaBAAA3gjhBSIPDQAAkAkAIA4AAO8IACAQAACRCQAgxgQAAI8JADDHBAAAKgAQyAQAAI8JADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGHBQEA-AcAIZkFAQD4BwAhnwUBAPkHACGmBQEA-QcAIacFAQD4BwAhqAUBAPgHACEOCwAAowgAIMYEAAChCAAwxwQAAKcFABDIBAAAoQgAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAIYEFAACiCKYFIpkFAQD4BwAhnwUBAPkHACGjBUAA_AcAIaQFQAD8BwAh5wUAAKcFACDoBQAApwUAIBAHAADsCAAgDwAAowgAIMYEAADpCAAwxwQAAJwBABDIBAAA6QgAMMkEAQD4BwAhzgQBAPgHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPkHACHABQEA-AcAIcEFAQD4BwAhwgUCAOoIACHEBQAA6wjEBSLnBQAAnAEAIOgFAACcAQAgGgcAAOwIACAJAADxCAAgCgAAlQkAIAsAAKMIACARAACTCQAgEgAA8AgAIBMAAJQJACAUAACHCQAgFgAAhAkAIBoAAIAJACAeAACLCQAgxgQAAJIJADDHBAAAJgAQyAQAAJIJADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8QQBAPgHACHyBAEA-AcAIfMEAQD4BwAh9QQBAPgHACGhBQEA-AcAIbEFAQD5BwAhvQVAAPwHACEDnAUAADIAIJ0FAAAyACCeBQAAMgAgHQcAAOwIACAJAADxCAAgDgAA7wgAIBIAAPAIACDGBAAA7QgAMMcEAAA2ABDIBAAA7QgAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHzBAEA-AcAIYcFAQD4BwAhiAUIAO4IACGJBQgA7ggAIYoFCADuCAAhiwUIAO4IACGMBQgA7ggAIY0FCADuCAAhjgUIAO4IACGPBQgA7ggAIZAFCADuCAAhkQUIAO4IACGSBQgA7ggAIZMFCADuCAAhlAUIAO4IACHnBQAANgAg6AUAADYAIBQHAADsCAAgCQAAlwkAIBQAALoIACAVAACZCAAgxgQAAJgJADDHBAAAHQAQyAQAAJgJADDJBAEA-AcAIc4EAQD4BwAhzwQBAPgHACHRBEAA_AcAIdIEQAD8BwAh-gQBAPgHACGfBQEA-QcAIakFAQD5BwAhqgVAAOYIACGrBQgA7ggAIawFCADuCAAh5wUAAB0AIOgFAAAdACASBwAA7AgAIAkAAJcJACAKAACVCQAgFQAAmQgAIBcAAL4IACDGBAAAlgkAMMcEAAAhABDIBAAAlgkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGfBQEA-QcAIasFAgD_CAAhsQUBAPkHACG-BQEA-AcAIb8FAQD4BwAhGQgAAJoJACAVAACZCAAgFwAAvggAIBkAAJgIACAlAAC3CAAgJgAAuAgAICcAALoIACAoAAC8CAAgKQAAvQgAICsAAKsIACAsAADACAAgLQAAwQgAIC4AAMIIACDGBAAAmQkAMMcEAAAYABDIBAAAmQkAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhsAUBAPkHACG1BQEA-QcAIbwFAQD4BwAh5wUAABgAIOgFAAAYACASBwAA7AgAIAkAAJcJACAUAAC6CAAgFQAAmQgAIMYEAACYCQAwxwQAAB0AEMgEAACYCQAwyQQBAPgHACHOBAEA-AcAIc8EAQD4BwAh0QRAAPwHACHSBEAA_AcAIfoEAQD4BwAhnwUBAPkHACGpBQEA-QcAIaoFQADmCAAhqwUIAO4IACGsBQgA7ggAIRcIAACaCQAgFQAAmQgAIBcAAL4IACAZAACYCAAgJQAAtwgAICYAALgIACAnAAC6CAAgKAAAvAgAICkAAL0IACArAACrCAAgLAAAwAgAIC0AAMEIACAuAADCCAAgxgQAAJkJADDHBAAAGAAQyAQAAJkJADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGfBQEA-QcAIbAFAQD5BwAhtQUBAPkHACG8BQEA-AcAIQ4HAADoCAAgLwAAnAkAIMYEAACbCQAwxwQAABIAEMgEAACbCQAwyQQBAPgHACHOBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGfBQEA-QcAIbUFAQD5BwAhvAUBAPgHACHnBQAAEgAg6AUAABIAIAwHAADoCAAgLwAAnAkAIMYEAACbCQAwxwQAABIAEMgEAACbCQAwyQQBAPgHACHOBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGfBQEA-QcAIbUFAQD5BwAhvAUBAPgHACEDnAUAABgAIJ0FAAAYACCeBQAAGAAgFQMAAP0HACAHAADsCAAgCQAAlwkAIBUAAJkIACAXAAC-CAAgGAAAwAgAIDUAAKsIACA2AADCCAAgxgQAAJ0JADDHBAAADgAQyAQAAJ0JADDJBAEA-AcAIcoEAQD4BwAhywQBAPgHACHMBAEA-AcAIc0EAQD5BwAhzgQBAPgHACHPBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIQsDAAD9BwAgBwAA7AgAIMYEAACeCQAwxwQAAAsAEMgEAACeCQAwyQQBAPgHACHOBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAId0FAACfCeIFIgTTBAAAAOIFAtQEAAAA4gUI1QQAAADiBQjaBAAA4gjiBSIRAwAA_QcAIMYEAACgCQAwxwQAAAcAEMgEAACgCQAwyQQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHJBQEA-AcAIcoFAQD4BwAhywUBAPkHACHMBQEA-QcAIc0FAQD5BwAhzgVAAOYIACHPBUAA5ggAIdAFAQD5BwAh0QUBAPkHACEMAwAA_QcAIMYEAAChCQAwxwQAAAMAEMgEAAChCQAwyQQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHGBUAA_AcAIdIFAQD4BwAh0wUBAPkHACHUBQEA-QcAIQAAAAAB7AUBAAAAAQHsBQEAAAABAewFQAAAAAEFSgAAiRQAIEsAAKYVACDpBQAAihQAIOoFAAClFQAg7wUAAJQEACALSgAAlwoAMEsAAJwKADDpBQAAmAoAMOoFAACZCgAw6wUAAJoKACDsBQAAmwoAMO0FAACbCgAw7gUAAJsKADDvBQAAmwoAMPAFAACdCgAw8QUAAJ4KADALSgAAgwoAMEsAAIgKADDpBQAAhAoAMOoFAACFCgAw6wUAAIYKACDsBQAAhwoAMO0FAACHCgAw7gUAAIcKADDvBQAAhwoAMPAFAACJCgAw8QUAAIoKADALSgAA3AkAMEsAAOEJADDpBQAA3QkAMOoFAADeCQAw6wUAAN8JACDsBQAA4AkAMO0FAADgCQAw7gUAAOAJADDvBQAA4AkAMPAFAADiCQAw8QUAAOMJADALSgAAxAkAMEsAAMkJADDpBQAAxQkAMOoFAADGCQAw6wUAAMcJACDsBQAAyAkAMO0FAADICQAw7gUAAMgJADDvBQAAyAkAMPAFAADKCQAw8QUAAMsJADALSgAAsQkAMEsAALYJADDpBQAAsgkAMOoFAACzCQAw6wUAALQJACDsBQAAtQkAMO0FAAC1CQAw7gUAALUJADDvBQAAtQkAMPAFAAC3CQAw8QUAALgJADAFSgAAhxQAIEsAAKMVACDpBQAAiBQAIOoFAACiFQAg7wUAABoAIAVKAACFFAAgSwAAoBUAIOkFAACGFAAg6gUAAJ8VACDvBQAAkQIAIBYHAADCCQAgCQAAwwkAIA4AAMEJACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAYcFAQAAAAGIBQgAAAABiQUIAAAAAYoFCAAAAAGLBQgAAAABjAUIAAAAAY0FCAAAAAGOBQgAAAABjwUIAAAAAZAFCAAAAAGRBQgAAAABkgUIAAAAAZMFCAAAAAGUBQgAAAABAgAAAIsBACBKAADACQAgAwAAAIsBACBKAADACQAgSwAAvAkAIAFDAACeFQAwGwcAAOwIACAJAADxCAAgDgAA7wgAIBIAAPAIACDGBAAA7QgAMMcEAAA2ABDIBAAA7QgAMMkEAQAAAAHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfMEAQD4BwAhhwUBAAAAAYgFCADuCAAhiQUIAO4IACGKBQgA7ggAIYsFCADuCAAhjAUIAO4IACGNBQgA7ggAIY4FCADuCAAhjwUIAO4IACGQBQgA7ggAIZEFCADuCAAhkgUIAO4IACGTBQgA7ggAIZQFCADuCAAhAgAAAIsBACBDAAC8CQAgAgAAALkJACBDAAC6CQAgF8YEAAC4CQAwxwQAALkJABDIBAAAuAkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHzBAEA-AcAIYcFAQD4BwAhiAUIAO4IACGJBQgA7ggAIYoFCADuCAAhiwUIAO4IACGMBQgA7ggAIY0FCADuCAAhjgUIAO4IACGPBQgA7ggAIZAFCADuCAAhkQUIAO4IACGSBQgA7ggAIZMFCADuCAAhlAUIAO4IACEXxgQAALgJADDHBAAAuQkAEMgEAAC4CQAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfMEAQD4BwAhhwUBAPgHACGIBQgA7ggAIYkFCADuCAAhigUIAO4IACGLBQgA7ggAIYwFCADuCAAhjQUIAO4IACGOBQgA7ggAIY8FCADuCAAhkAUIAO4IACGRBQgA7ggAIZIFCADuCAAhkwUIAO4IACGUBQgA7ggAIRPJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhhwUBAKYJACGIBQgAuwkAIYkFCAC7CQAhigUIALsJACGLBQgAuwkAIYwFCAC7CQAhjQUIALsJACGOBQgAuwkAIY8FCAC7CQAhkAUIALsJACGRBQgAuwkAIZIFCAC7CQAhkwUIALsJACGUBQgAuwkAIQXsBQgAAAAB8gUIAAAAAfMFCAAAAAH0BQgAAAAB9QUIAAAAARYHAAC-CQAgCQAAvwkAIA4AAL0JACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhhwUBAKYJACGIBQgAuwkAIYkFCAC7CQAhigUIALsJACGLBQgAuwkAIYwFCAC7CQAhjQUIALsJACGOBQgAuwkAIY8FCAC7CQAhkAUIALsJACGRBQgAuwkAIZIFCAC7CQAhkwUIALsJACGUBQgAuwkAIQVKAACTFQAgSwAAnBUAIOkFAACUFQAg6gUAAJsVACDvBQAAKAAgBUoAAJEVACBLAACZFQAg6QUAAJIVACDqBQAAmBUAIO8FAACUBAAgB0oAAI8VACBLAACWFQAg6QUAAJAVACDqBQAAlRUAIO0FAAAYACDuBQAAGAAg7wUAABoAIBYHAADCCQAgCQAAwwkAIA4AAMEJACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAYcFAQAAAAGIBQgAAAABiQUIAAAAAYoFCAAAAAGLBQgAAAABjAUIAAAAAY0FCAAAAAGOBQgAAAABjwUIAAAAAZAFCAAAAAGRBQgAAAABkgUIAAAAAZMFCAAAAAGUBQgAAAABA0oAAJMVACDpBQAAlBUAIO8FAAAoACADSgAAkRUAIOkFAACSFQAg7wUAAJQEACADSgAAjxUAIOkFAACQFQAg7wUAABoAIBIHAADaCQAgCQAA2wkAICEAANcJACAjAADZCQAgKgAA2AkAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB3gQBAAAAAf8EAQAAAAGBBQAAAIEFAoIFAQAAAAGDBUAAAAABhAVAAAAAAYUFAQAAAAGGBQEAAAABAgAAAIEBACBKAADWCQAgAwAAAIEBACBKAADWCQAgSwAA0AkAIAFDAACOFQAwGAcAAOwIACAJAADxCAAgEgAA9ggAICEAAPUIACAjAADnCAAgKgAA_QcAIMYEAADzCAAwxwQAAH8AEMgEAADzCAAwyQQBAAAAAc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh3gQBAPgHACHzBAEA-QcAIf8EAQD5BwAhgQUAAPQIgQUiggUBAPkHACGDBUAA5ggAIYQFQAD8BwAhhQUBAPgHACGGBQEA-QcAIeIFAADyCAAgAgAAAIEBACBDAADQCQAgAgAAAMwJACBDAADNCQAgEcYEAADLCQAwxwQAAMwJABDIBAAAywkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHeBAEA-AcAIfMEAQD5BwAh_wQBAPkHACGBBQAA9AiBBSKCBQEA-QcAIYMFQADmCAAhhAVAAPwHACGFBQEA-AcAIYYFAQD5BwAhEcYEAADLCQAwxwQAAMwJABDIBAAAywkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHeBAEA-AcAIfMEAQD5BwAh_wQBAPkHACGBBQAA9AiBBSKCBQEA-QcAIYMFQADmCAAhhAVAAPwHACGFBQEA-AcAIYYFAQD5BwAhDckEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHeBAEApgkAIf8EAQCnCQAhgQUAAM4JgQUiggUBAKcJACGDBUAAzwkAIYQFQACoCQAhhQUBAKYJACGGBQEApwkAIQHsBQAAAIEFAgHsBUAAAAABEgcAANQJACAJAADVCQAgIQAA0QkAICMAANMJACAqAADSCQAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAId4EAQCmCQAh_wQBAKcJACGBBQAAzgmBBSKCBQEApwkAIYMFQADPCQAhhAVAAKgJACGFBQEApgkAIYYFAQCnCQAhBUoAAP0UACBLAACMFQAg6QUAAP4UACDqBQAAixUAIO8FAADGBAAgBUoAAPsUACBLAACJFQAg6QUAAPwUACDqBQAAiBUAIO8FAACRAgAgB0oAAPkUACBLAACGFQAg6QUAAPoUACDqBQAAhRUAIO0FAABjACDuBQAAYwAg7wUAAJECACAFSgAA9xQAIEsAAIMVACDpBQAA-BQAIOoFAACCFQAg7wUAAJQEACAHSgAA9RQAIEsAAIAVACDpBQAA9hQAIOoFAAD_FAAg7QUAABgAIO4FAAAYACDvBQAAGgAgEgcAANoJACAJAADbCQAgIQAA1wkAICMAANkJACAqAADYCQAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHeBAEAAAAB_wQBAAAAAYEFAAAAgQUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAYYFAQAAAAEDSgAA_RQAIOkFAAD-FAAg7wUAAMYEACADSgAA-xQAIOkFAAD8FAAg7wUAAJECACADSgAA-RQAIOkFAAD6FAAg7wUAAJECACADSgAA9xQAIOkFAAD4FAAg7wUAAJQEACADSgAA9RQAIOkFAAD2FAAg7wUAABoAIA4HAACACgAgCQAAgQoAIBYAAP8JACAcAACCCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB-gQBAAAAAfsEAQAAAAH9BAAAAP0EAv4EQAAAAAECAAAARwAgSgAA_gkAIAMAAABHACBKAAD-CQAgSwAA5wkAIAFDAAD0FAAwEwcAAOwIACAJAADxCAAgEgAA8AgAIBYAAIQJACAcAADBCAAgxgQAAIIJADDHBAAARQAQyAQAAIIJADDJBAEAAAABzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHxBAEA-AcAIfMEAQD4BwAh-gQBAPgHACH7BAEA-QcAIf0EAACDCf0EIv4EQADmCAAhAgAAAEcAIEMAAOcJACACAAAA5AkAIEMAAOUJACAOxgQAAOMJADDHBAAA5AkAEMgEAADjCQAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfEEAQD4BwAh8wQBAPgHACH6BAEA-AcAIfsEAQD5BwAh_QQAAIMJ_QQi_gRAAOYIACEOxgQAAOMJADDHBAAA5AkAEMgEAADjCQAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfEEAQD4BwAh8wQBAPgHACH6BAEA-AcAIfsEAQD5BwAh_QQAAIMJ_QQi_gRAAOYIACEKyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfEEAQCmCQAh-gQBAKYJACH7BAEApwkAIf0EAADmCf0EIv4EQADPCQAhAewFAAAA_QQCDgcAAOkJACAJAADqCQAgFgAA6AkAIBwAAOsJACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8QQBAKYJACH6BAEApgkAIfsEAQCnCQAh_QQAAOYJ_QQi_gRAAM8JACEFSgAA2RQAIEsAAPIUACDpBQAA2hQAIOoFAADxFAAg7wUAAEwAIAVKAADXFAAgSwAA7xQAIOkFAADYFAAg6gUAAO4UACDvBQAAlAQAIAdKAADVFAAgSwAA7BQAIOkFAADWFAAg6gUAAOsUACDtBQAAGAAg7gUAABgAIO8FAAAaACALSgAA7AkAMEsAAPEJADDpBQAA7QkAMOoFAADuCQAw6wUAAO8JACDsBQAA8AkAMO0FAADwCQAw7gUAAPAJADDvBQAA8AkAMPAFAADyCQAw8QUAAPMJADANBwAA_AkAIAkAAP0JACAeAAD7CQAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAH1BAEAAAAB9gQBAAAAAfcEAQAAAAH4BAEAAAAB-QRAAAAAAQIAAAA9ACBKAAD6CQAgAwAAAD0AIEoAAPoJACBLAAD2CQAgAUMAAOoUADATBwAA7AgAIAkAAPEIACAdAACKCQAgHgAAiwkAIMYEAACJCQAwxwQAADsAEMgEAACJCQAwyQQBAAAAAc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh9AQBAPgHACH1BAEA-AcAIfYEAQD5BwAh9wQBAPkHACH4BAEA-QcAIfkEQAD8BwAh5QUAAIgJACACAAAAPQAgQwAA9gkAIAIAAAD0CQAgQwAA9QkAIA7GBAAA8wkAMMcEAAD0CQAQyAQAAPMJADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh9AQBAPgHACH1BAEA-AcAIfYEAQD5BwAh9wQBAPkHACH4BAEA-QcAIfkEQAD8BwAhDsYEAADzCQAwxwQAAPQJABDIBAAA8wkAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACH0BAEA-AcAIfUEAQD4BwAh9gQBAPkHACH3BAEA-QcAIfgEAQD5BwAh-QRAAPwHACEKyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfUEAQCmCQAh9gQBAKcJACH3BAEApwkAIfgEAQCnCQAh-QRAAKgJACENBwAA-AkAIAkAAPkJACAeAAD3CQAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfUEAQCmCQAh9gQBAKcJACH3BAEApwkAIfgEAQCnCQAh-QRAAKgJACEFSgAA3xQAIEsAAOgUACDpBQAA4BQAIOoFAADnFAAg7wUAAHsAIAVKAADdFAAgSwAA5RQAIOkFAADeFAAg6gUAAOQUACDvBQAAlAQAIAdKAADbFAAgSwAA4hQAIOkFAADcFAAg6gUAAOEUACDtBQAAGAAg7gUAABgAIO8FAAAaACANBwAA_AkAIAkAAP0JACAeAAD7CQAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAH1BAEAAAAB9gQBAAAAAfcEAQAAAAH4BAEAAAAB-QRAAAAAAQNKAADfFAAg6QUAAOAUACDvBQAAewAgA0oAAN0UACDpBQAA3hQAIO8FAACUBAAgA0oAANsUACDpBQAA3BQAIO8FAAAaACAOBwAAgAoAIAkAAIEKACAWAAD_CQAgHAAAggoAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfoEAQAAAAH7BAEAAAAB_QQAAAD9BAL-BEAAAAABA0oAANkUACDpBQAA2hQAIO8FAABMACADSgAA1xQAIOkFAADYFAAg7wUAAJQEACADSgAA1RQAIOkFAADWFAAg7wUAABoAIARKAADsCQAw6QUAAO0JADDrBQAA7wkAIO8FAADwCQAwCwcAAJUKACAJAACWCgAgFAAAlAoAIBYAAJMKACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHyBAEAAAABAgAAAEIAIEoAAJIKACADAAAAQgAgSgAAkgoAIEsAAI0KACABQwAA1BQAMBEHAADsCAAgCQAA8QgAIBIAAPAIACAUAACHCQAgFgAAhAkAIMYEAACGCQAwxwQAAEAAEMgEAACGCQAwyQQBAAAAAc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8QQBAPgHACHyBAEA-AcAIfMEAQD4BwAh5AUAAIUJACACAAAAQgAgQwAAjQoAIAIAAACLCgAgQwAAjAoAIAvGBAAAigoAMMcEAACLCgAQyAQAAIoKADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8QQBAPgHACHyBAEA-AcAIfMEAQD4BwAhC8YEAACKCgAwxwQAAIsKABDIBAAAigoAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACHxBAEA-AcAIfIEAQD4BwAh8wQBAPgHACEHyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfEEAQCmCQAh8gQBAKYJACELBwAAkAoAIAkAAJEKACAUAACPCgAgFgAAjgoAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAhBUoAAMYUACBLAADSFAAg6QUAAMcUACDqBQAA0RQAIO8FAABMACAFSgAAxBQAIEsAAM8UACDpBQAAxRQAIOoFAADOFAAg7wUAACMAIAVKAADCFAAgSwAAzBQAIOkFAADDFAAg6gUAAMsUACDvBQAAlAQAIAdKAADAFAAgSwAAyRQAIOkFAADBFAAg6gUAAMgUACDtBQAAGAAg7gUAABgAIO8FAAAaACALBwAAlQoAIAkAAJYKACAUAACUCgAgFgAAkwoAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfIEAQAAAAEDSgAAxhQAIOkFAADHFAAg7wUAAEwAIANKAADEFAAg6QUAAMUUACDvBQAAIwAgA0oAAMIUACDpBQAAwxQAIO8FAACUBAAgA0oAAMAUACDpBQAAwRQAIO8FAAAaACAVBwAA2goAIAkAANcKACAKAADYCgAgCwAA0QoAIBEAANIKACATAADTCgAgFAAA1AoAIBYAANYKACAaAADZCgAgHgAA1QoAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfIEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABAgAAACgAIEoAANAKACADAAAAKAAgSgAA0AoAIEsAAKEKACABQwAAvxQAMBoHAADsCAAgCQAA8QgAIAoAAJUJACALAACjCAAgEQAAkwkAIBIAAPAIACATAACUCQAgFAAAhwkAIBYAAIQJACAaAACACQAgHgAAiwkAIMYEAACSCQAwxwQAACYAEMgEAACSCQAwyQQBAAAAAc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8QQBAPgHACHyBAEA-AcAIfMEAQD4BwAh9QQBAPgHACGhBQEA-AcAIbEFAQD5BwAhvQVAAPwHACECAAAAKAAgQwAAoQoAIAIAAACfCgAgQwAAoAoAIA_GBAAAngoAMMcEAACfCgAQyAQAAJ4KADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAh8QQBAPgHACHyBAEA-AcAIfMEAQD4BwAh9QQBAPgHACGhBQEA-AcAIbEFAQD5BwAhvQVAAPwHACEPxgQAAJ4KADDHBAAAnwoAEMgEAACeCgAwyQQBAPgHACHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIfEEAQD4BwAh8gQBAPgHACHzBAEA-AcAIfUEAQD4BwAhoQUBAPgHACGxBQEA-QcAIb0FQAD8BwAhC8kEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh9QQBAKYJACGhBQEApgkAIbEFAQCnCQAhvQVAAKgJACEVBwAAqwoAIAkAAKgKACAKAACpCgAgCwAAogoAIBEAAKMKACATAACkCgAgFAAApQoAIBYAAKcKACAaAACqCgAgHgAApgoAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh9QQBAKYJACGhBQEApgkAIbEFAQCnCQAhvQVAAKgJACELSgAAwAoAMEsAAMUKADDpBQAAwQoAMOoFAADCCgAw6wUAAMMKACDsBQAAxAoAMO0FAADECgAw7gUAAMQKADDvBQAAxAoAMPAFAADGCgAw8QUAAMcKADALSgAAswoAMEsAALgKADDpBQAAtAoAMOoFAAC1CgAw6wUAALYKACDsBQAAtwoAMO0FAAC3CgAw7gUAALcKADDvBQAAtwoAMPAFAAC5CgAw8QUAALoKADAHSgAArAoAIEsAAK8KACDpBQAArQoAIOoFAACuCgAg7QUAADYAIO4FAAA2ACDvBQAAiwEAIAVKAACXFAAgSwAAvRQAIOkFAACYFAAg6gUAALwUACDvBQAAIwAgBUoAAJUUACBLAAC6FAAg6QUAAJYUACDqBQAAuRQAIO8FAAB7ACAFSgAAkxQAIEsAALcUACDpBQAAlBQAIOoFAAC2FAAg7wUAAEwAIAdKAACRFAAgSwAAtBQAIOkFAACSFAAg6gUAALMUACDtBQAAGAAg7gUAABgAIO8FAAAaACAHSgAAjxQAIEsAALEUACDpBQAAkBQAIOoFAACwFAAg7QUAAB0AIO4FAAAdACDvBQAAHwAgBUoAAI0UACBLAACuFAAg6QUAAI4UACDqBQAArRQAIO8FAADXBQAgBUoAAIsUACBLAACrFAAg6QUAAIwUACDqBQAAqhQAIO8FAACUBAAgFgcAAMIJACAJAADDCQAgEgAAsgoAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8wQBAAAAAYgFCAAAAAGJBQgAAAABigUIAAAAAYsFCAAAAAGMBQgAAAABjQUIAAAAAY4FCAAAAAGPBQgAAAABkAUIAAAAAZEFCAAAAAGSBQgAAAABkwUIAAAAAZQFCAAAAAECAAAAiwEAIEoAAKwKACADAAAANgAgSgAArAoAIEsAALAKACAYAAAANgAgBwAAvgkAIAkAAL8JACASAACxCgAgQwAAsAoAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHzBAEApgkAIYgFCAC7CQAhiQUIALsJACGKBQgAuwkAIYsFCAC7CQAhjAUIALsJACGNBQgAuwkAIY4FCAC7CQAhjwUIALsJACGQBQgAuwkAIZEFCAC7CQAhkgUIALsJACGTBQgAuwkAIZQFCAC7CQAhFgcAAL4JACAJAAC_CQAgEgAAsQoAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHzBAEApgkAIYgFCAC7CQAhiQUIALsJACGKBQgAuwkAIYsFCAC7CQAhjAUIALsJACGNBQgAuwkAIY4FCAC7CQAhjwUIALsJACGQBQgAuwkAIZEFCAC7CQAhkgUIALsJACGTBQgAuwkAIZQFCAC7CQAhBUoAAKUUACBLAACoFAAg6QUAAKYUACDqBQAApxQAIO8FAAAQACADSgAApRQAIOkFAACmFAAg7wUAABAAIAXJBAEAAAAB0QRAAAAAAdIEQAAAAAGBBQAAAOEFAt8FQAAAAAECAAAANAAgSgAAvwoAIAMAAAA0ACBKAAC_CgAgSwAAvgoAIAFDAACkFAAwCw4AAO8IACDGBAAAjQkAMMcEAAAyABDIBAAAjQkAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAhgQUAAI4J4QUihwUBAPgHACHfBUAA_AcAIeYFAACMCQAgAgAAADQAIEMAAL4KACACAAAAuwoAIEMAALwKACAJxgQAALoKADDHBAAAuwoAEMgEAAC6CgAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAhgQUAAI4J4QUihwUBAPgHACHfBUAA_AcAIQnGBAAAugoAMMcEAAC7CgAQyAQAALoKADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGBBQAAjgnhBSKHBQEA-AcAId8FQAD8BwAhBckEAQCmCQAh0QRAAKgJACHSBEAAqAkAIYEFAAC9CuEFIt8FQACoCQAhAewFAAAA4QUCBckEAQCmCQAh0QRAAKgJACHSBEAAqAkAIYEFAAC9CuEFIt8FQACoCQAhBckEAQAAAAHRBEAAAAAB0gRAAAAAAYEFAAAA4QUC3wVAAAAAAQoNAADOCgAgEAAAzwoAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABpgUBAAAAAacFAQAAAAGoBQEAAAABAgAAACwAIEoAAM0KACADAAAALAAgSgAAzQoAIEsAAMoKACABQwAAoxQAMA8NAACQCQAgDgAA7wgAIBAAAJEJACDGBAAAjwkAMMcEAAAqABDIBAAAjwkAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAhhwUBAPgHACGZBQEA-AcAIZ8FAQD5BwAhpgUBAPkHACGnBQEA-AcAIagFAQD4BwAhAgAAACwAIEMAAMoKACACAAAAyAoAIEMAAMkKACAMxgQAAMcKADDHBAAAyAoAEMgEAADHCgAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAhhwUBAPgHACGZBQEA-AcAIZ8FAQD5BwAhpgUBAPkHACGnBQEA-AcAIagFAQD4BwAhDMYEAADHCgAwxwQAAMgKABDIBAAAxwoAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAIYcFAQD4BwAhmQUBAPgHACGfBQEA-QcAIaYFAQD5BwAhpwUBAPgHACGoBQEA-AcAIQjJBAEApgkAIdEEQACoCQAh0gRAAKgJACGZBQEApgkAIZ8FAQCnCQAhpgUBAKcJACGnBQEApgkAIagFAQCmCQAhCg0AAMsKACAQAADMCgAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaYFAQCnCQAhpwUBAKYJACGoBQEApgkAIQVKAACbFAAgSwAAoRQAIOkFAACcFAAg6gUAAKAUACDvBQAApAUAIAVKAACZFAAgSwAAnhQAIOkFAACaFAAg6gUAAJ0UACDvBQAAngEAIAoNAADOCgAgEAAAzwoAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABpgUBAAAAAacFAQAAAAGoBQEAAAABA0oAAJsUACDpBQAAnBQAIO8FAACkBQAgA0oAAJkUACDpBQAAmhQAIO8FAACeAQAgFQcAANoKACAJAADXCgAgCgAA2AoAIAsAANEKACARAADSCgAgEwAA0woAIBQAANQKACAWAADWCgAgGgAA2QoAIB4AANUKACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHyBAEAAAAB9QQBAAAAAaEFAQAAAAGxBQEAAAABvQVAAAAAAQRKAADACgAw6QUAAMEKADDrBQAAwwoAIO8FAADECgAwBEoAALMKADDpBQAAtAoAMOsFAAC2CgAg7wUAALcKADADSgAArAoAIOkFAACtCgAg7wUAAIsBACADSgAAlxQAIOkFAACYFAAg7wUAACMAIANKAACVFAAg6QUAAJYUACDvBQAAewAgA0oAAJMUACDpBQAAlBQAIO8FAABMACADSgAAkRQAIOkFAACSFAAg7wUAABoAIANKAACPFAAg6QUAAJAUACDvBQAAHwAgA0oAAI0UACDpBQAAjhQAIO8FAADXBQAgA0oAAIsUACDpBQAAjBQAIO8FAACUBAAgA0oAAIkUACDpBQAAihQAIO8FAACUBAAgBEoAAJcKADDpBQAAmAoAMOsFAACaCgAg7wUAAJsKADAESgAAgwoAMOkFAACECgAw6wUAAIYKACDvBQAAhwoAMARKAADcCQAw6QUAAN0JADDrBQAA3wkAIO8FAADgCQAwBEoAAMQJADDpBQAAxQkAMOsFAADHCQAg7wUAAMgJADAESgAAsQkAMOkFAACyCQAw6wUAALQJACDvBQAAtQkAMANKAACHFAAg6QUAAIgUACDvBQAAGgAgA0oAAIUUACDpBQAAhhQAIO8FAACRAgAgAAAAAuwFAQAAAAT2BQEAAAAFAuwFAQAAAAT2BQEAAAAFAewFIAAAAAEFSgAAgBQAIEsAAIMUACDpBQAAgRQAIOoFAACCFAAg7wUAAJECACAB7AUBAAAABAHsBQEAAAAEA0oAAIAUACDpBQAAgRQAIO8FAACRAgAgFQQAAO0RACAFAADuEQAgBgAAlxAAIBIAAJgQACAeAACZEAAgKwAAiA0AIDQAAJsQACA3AACbEAAgOAAAiA0AIDkAAO8RACA6AAD3DAAgOwAA9wwAIDwAAPARACA9AADxEQAgzQQAAKIJACDXBQAAogkAINgFAACiCQAg2QUAAKIJACDaBQAAogkAINsFAACiCQAg3AUAAKIJACAAAAAFSgAA-xMAIEsAAP4TACDpBQAA_BMAIOoFAAD9EwAg7wUAABAAIANKAAD7EwAg6QUAAPwTACDvBQAAEAAgAAAABUoAAPYTACBLAAD5EwAg6QUAAPcTACDqBQAA-BMAIO8FAABHACADSgAA9hMAIOkFAAD3EwAg7wUAAEcAIAAAAAVKAADxEwAgSwAA9BMAIOkFAADyEwAg6gUAAPMTACDvBQAAEAAgA0oAAPETACDpBQAA8hMAIO8FAAAQACAAAAAHSgAA7BMAIEsAAO8TACDpBQAA7RMAIOoFAADuEwAg7QUAAA4AIO4FAAAOACDvBQAAEAAgA0oAAOwTACDpBQAA7RMAIO8FAAAQACAAAAAAAAAAAAVKAADKEwAgSwAA6hMAIOkFAADLEwAg6gUAAOkTACDvBQAAlAQAIAdKAADIEwAgSwAA5xMAIOkFAADJEwAg6gUAAOYTACDtBQAAGAAg7gUAABgAIO8FAAAaACAFSgAAxhMAIEsAAOQTACDpBQAAxxMAIOoFAADjEwAg7wUAAJECACALSgAArAsAMEsAALALADDpBQAArQsAMOoFAACuCwAw6wUAAK8LACDsBQAAmwoAMO0FAACbCgAw7gUAAJsKADDvBQAAmwoAMPAFAACxCwAw8QUAAJ4KADALSgAAowsAMEsAAKcLADDpBQAApAsAMOoFAAClCwAw6wUAAKYLACDsBQAA8AkAMO0FAADwCQAw7gUAAPAJADDvBQAA8AkAMPAFAACoCwAw8QUAAPMJADALSgAAkAsAMEsAAJULADDpBQAAkQsAMOoFAACSCwAw6wUAAJMLACDsBQAAlAsAMO0FAACUCwAw7gUAAJQLADDvBQAAlAsAMPAFAACWCwAw8QUAAJcLADAOIQAAoAsAICIAAKELACAjAACiCwAgyQQBAAAAAdEEQAAAAAHSBEAAAAAB_wQBAAAAAYEFAAAAlwUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAYYFAQAAAAGXBQEAAAABAgAAAF8AIEoAAJ8LACADAAAAXwAgSgAAnwsAIEsAAJsLACABQwAA4hMAMBQeAAD9CAAgIQAA_AgAICIAAP0HACAjAADnCAAgxgQAAPoIADDHBAAAXQAQyAQAAPoIADDJBAEAAAAB0QRAAPwHACHSBEAA_AcAIfUEAQD5BwAh_wQBAPkHACGBBQAA-wiXBSKCBQEA-QcAIYMFQADmCAAhhAVAAPwHACGFBQEA-AcAIYYFAQD5BwAhlwUBAPgHACHjBQAA-QgAIAIAAABfACBDAACbCwAgAgAAAJgLACBDAACZCwAgD8YEAACXCwAwxwQAAJgLABDIBAAAlwsAMMkEAQD4BwAh0QRAAPwHACHSBEAA_AcAIfUEAQD5BwAh_wQBAPkHACGBBQAA-wiXBSKCBQEA-QcAIYMFQADmCAAhhAVAAPwHACGFBQEA-AcAIYYFAQD5BwAhlwUBAPgHACEPxgQAAJcLADDHBAAAmAsAEMgEAACXCwAwyQQBAPgHACHRBEAA_AcAIdIEQAD8BwAh9QQBAPkHACH_BAEA-QcAIYEFAAD7CJcFIoIFAQD5BwAhgwVAAOYIACGEBUAA_AcAIYUFAQD4BwAhhgUBAPkHACGXBQEA-AcAIQvJBAEApgkAIdEEQACoCQAh0gRAAKgJACH_BAEApwkAIYEFAACaC5cFIoIFAQCnCQAhgwVAAM8JACGEBUAAqAkAIYUFAQCmCQAhhgUBAKcJACGXBQEApgkAIQHsBQAAAJcFAg4hAACcCwAgIgAAnQsAICMAAJ4LACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH_BAEApwkAIYEFAACaC5cFIoIFAQCnCQAhgwVAAM8JACGEBUAAqAkAIYUFAQCmCQAhhgUBAKcJACGXBQEApgkAIQVKAADXEwAgSwAA4BMAIOkFAADYEwAg6gUAAN8TACDvBQAA3wQAIAVKAADVEwAgSwAA3RMAIOkFAADWEwAg6gUAANwTACDvBQAAkQIAIAdKAADTEwAgSwAA2hMAIOkFAADUEwAg6gUAANkTACDtBQAAYwAg7gUAAGMAIO8FAACRAgAgDiEAAKALACAiAAChCwAgIwAAogsAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAf8EAQAAAAGBBQAAAJcFAoIFAQAAAAGDBUAAAAABhAVAAAAAAYUFAQAAAAGGBQEAAAABlwUBAAAAAQNKAADXEwAg6QUAANgTACDvBQAA3wQAIANKAADVEwAg6QUAANYTACDvBQAAkQIAIANKAADTEwAg6QUAANQTACDvBQAAkQIAIA0HAAD8CQAgCQAA_QkAIB0AAPcKACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfQEAQAAAAH2BAEAAAAB9wQBAAAAAfgEAQAAAAH5BEAAAAABAgAAAD0AIEoAAKsLACADAAAAPQAgSgAAqwsAIEsAAKoLACABQwAA0hMAMAIAAAA9ACBDAACqCwAgAgAAAPQJACBDAACpCwAgCskEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACH0BAEApgkAIfYEAQCnCQAh9wQBAKcJACH4BAEApwkAIfkEQACoCQAhDQcAAPgJACAJAAD5CQAgHQAA9goAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACH0BAEApgkAIfYEAQCnCQAh9wQBAKcJACH4BAEApwkAIfkEQACoCQAhDQcAAPwJACAJAAD9CQAgHQAA9woAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB9AQBAAAAAfYEAQAAAAH3BAEAAAAB-AQBAAAAAfkEQAAAAAEVBwAA2goAIAkAANcKACAKAADYCgAgCwAA0QoAIBEAANIKACASAAC2CwAgEwAA0woAIBQAANQKACAWAADWCgAgGgAA2QoAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfIEAQAAAAHzBAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABAgAAACgAIEoAALULACADAAAAKAAgSgAAtQsAIEsAALMLACABQwAA0RMAMAIAAAAoACBDAACzCwAgAgAAAJ8KACBDAACyCwAgC8kEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh8wQBAKYJACGhBQEApgkAIbEFAQCnCQAhvQVAAKgJACEVBwAAqwoAIAkAAKgKACAKAACpCgAgCwAAogoAIBEAAKMKACASAAC0CwAgEwAApAoAIBQAAKUKACAWAACnCgAgGgAAqgoAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh8wQBAKYJACGhBQEApgkAIbEFAQCnCQAhvQVAAKgJACEFSgAAzBMAIEsAAM8TACDpBQAAzRMAIOoFAADOEwAg7wUAABAAIBUHAADaCgAgCQAA1woAIAoAANgKACALAADRCgAgEQAA0goAIBIAALYLACATAADTCgAgFAAA1AoAIBYAANYKACAaAADZCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAGhBQEAAAABsQUBAAAAAb0FQAAAAAEDSgAAzBMAIOkFAADNEwAg7wUAABAAIANKAADKEwAg6QUAAMsTACDvBQAAlAQAIANKAADIEwAg6QUAAMkTACDvBQAAGgAgA0oAAMYTACDpBQAAxxMAIO8FAACRAgAgBEoAAKwLADDpBQAArQsAMOsFAACvCwAg7wUAAJsKADAESgAAowsAMOkFAACkCwAw6wUAAKYLACDvBQAA8AkAMARKAACQCwAw6QUAAJELADDrBQAAkwsAIO8FAACUCwAwAAAAB0oAAMETACBLAADEEwAg6QUAAMITACDqBQAAwxMAIO0FAABlACDuBQAAZQAg7wUAAHsAIANKAADBEwAg6QUAAMITACDvBQAAewAgAAAAAuwFAQAAAAT2BQEAAAAFBUoAALwTACBLAAC_EwAg6QUAAL0TACDqBQAAvhMAIO8FAACRAgAgAewFAQAAAAQDSgAAvBMAIOkFAAC9EwAg7wUAAJECACAAAAALSgAA1wsAMEsAANwLADDpBQAA2AsAMOoFAADZCwAw6wUAANoLACDsBQAA2wsAMO0FAADbCwAw7gUAANsLADDvBQAA2wsAMPAFAADdCwAw8QUAAN4LADALSgAAzgsAMEsAANILADDpBQAAzwsAMOoFAADQCwAw6wUAANELACDsBQAAmwoAMO0FAACbCgAw7gUAAJsKADDvBQAAmwoAMPAFAADTCwAw8QUAAJ4KADAVBwAA2goAIAkAANcKACAKAADYCgAgCwAA0QoAIBEAANIKACASAAC2CwAgEwAA0woAIBQAANQKACAWAADWCgAgHgAA1QoAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfIEAQAAAAHzBAEAAAAB9QQBAAAAAbEFAQAAAAG9BUAAAAABAgAAACgAIEoAANYLACADAAAAKAAgSgAA1gsAIEsAANULACABQwAAuxMAMAIAAAAoACBDAADVCwAgAgAAAJ8KACBDAADUCwAgC8kEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh8wQBAKYJACH1BAEApgkAIbEFAQCnCQAhvQVAAKgJACEVBwAAqwoAIAkAAKgKACAKAACpCgAgCwAAogoAIBEAAKMKACASAAC0CwAgEwAApAoAIBQAAKUKACAWAACnCgAgHgAApgoAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh8wQBAKYJACH1BAEApgkAIbEFAQCnCQAhvQVAAKgJACEVBwAA2goAIAkAANcKACAKAADYCgAgCwAA0QoAIBEAANIKACASAAC2CwAgEwAA0woAIBQAANQKACAWAADWCgAgHgAA1QoAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfIEAQAAAAHzBAEAAAAB9QQBAAAAAbEFAQAAAAG9BUAAAAABDwcAAIgMACAJAACJDAAgFQAAhQwAIBcAAIYMACAYAACHDAAgGwAAigwAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAZ8FAQAAAAGgBQIAAAABogUBAAAAAQIAAABMACBKAACEDAAgAwAAAEwAIEoAAIQMACBLAADiCwAgAUMAALoTADAUBwAA7AgAIAkAAPEIACAVAACZCAAgFwAAvggAIBgAAMAIACAaAACACQAgGwAAgQkAIMYEAAD-CAAwxwQAAEoAEMgEAAD-CAAwyQQBAAAAAc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPgHACGfBQEA-QcAIaAFAgD_CAAhoQUBAPgHACGiBQEA-QcAIQIAAABMACBDAADiCwAgAgAAAN8LACBDAADgCwAgDcYEAADeCwAwxwQAAN8LABDIBAAA3gsAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGZBQEA-AcAIZ8FAQD5BwAhoAUCAP8IACGhBQEA-AcAIaIFAQD5BwAhDcYEAADeCwAwxwQAAN8LABDIBAAA3gsAMMkEAQD4BwAhzgQBAPgHACHPBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGZBQEA-AcAIZ8FAQD5BwAhoAUCAP8IACGhBQEA-AcAIaIFAQD5BwAhCckEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACGZBQEApgkAIZ8FAQCnCQAhoAUCAOELACGiBQEApwkAIQXsBQIAAAAB8gUCAAAAAfMFAgAAAAH0BQIAAAAB9QUCAAAAAQ8HAADmCwAgCQAA5wsAIBUAAOMLACAXAADkCwAgGAAA5QsAIBsAAOgLACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaAFAgDhCwAhogUBAKcJACELSgAA-wsAMEsAAP8LADDpBQAA_AsAMOoFAAD9CwAw6wUAAP4LACDsBQAAmwoAMO0FAACbCgAw7gUAAJsKADDvBQAAmwoAMPAFAACADAAw8QUAAJ4KADALSgAA8gsAMEsAAPYLADDpBQAA8wsAMOoFAAD0CwAw6wUAAPULACDsBQAAhwoAMO0FAACHCgAw7gUAAIcKADDvBQAAhwoAMPAFAAD3CwAw8QUAAIoKADALSgAA6QsAMEsAAO0LADDpBQAA6gsAMOoFAADrCwAw6wUAAOwLACDsBQAA4AkAMO0FAADgCQAw7gUAAOAJADDvBQAA4AkAMPAFAADuCwAw8QUAAOMJADAFSgAArBMAIEsAALgTACDpBQAArRMAIOoFAAC3EwAg7wUAAJQEACAHSgAAqhMAIEsAALUTACDpBQAAqxMAIOoFAAC0EwAg7QUAABgAIO4FAAAYACDvBQAAGgAgB0oAAKgTACBLAACyEwAg6QUAAKkTACDqBQAAsRMAIO0FAABRACDuBQAAUQAg7wUAAHUAIA4HAACACgAgCQAAgQoAIBIAAPwKACAcAACCCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHzBAEAAAAB-gQBAAAAAfsEAQAAAAH9BAAAAP0EAv4EQAAAAAECAAAARwAgSgAA8QsAIAMAAABHACBKAADxCwAgSwAA8AsAIAFDAACwEwAwAgAAAEcAIEMAAPALACACAAAA5AkAIEMAAO8LACAKyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfMEAQCmCQAh-gQBAKYJACH7BAEApwkAIf0EAADmCf0EIv4EQADPCQAhDgcAAOkJACAJAADqCQAgEgAA-woAIBwAAOsJACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8wQBAKYJACH6BAEApgkAIfsEAQCnCQAh_QQAAOYJ_QQi_gRAAM8JACEOBwAAgAoAIAkAAIEKACASAAD8CgAgHAAAggoAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8wQBAAAAAfoEAQAAAAH7BAEAAAAB_QQAAAD9BAL-BEAAAAABCwcAAJUKACAJAACWCgAgEgAA8goAIBQAAJQKACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfIEAQAAAAHzBAEAAAABAgAAAEIAIEoAAPoLACADAAAAQgAgSgAA-gsAIEsAAPkLACABQwAArxMAMAIAAABCACBDAAD5CwAgAgAAAIsKACBDAAD4CwAgB8kEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHyBAEApgkAIfMEAQCmCQAhCwcAAJAKACAJAACRCgAgEgAA8QoAIBQAAI8KACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8gQBAKYJACHzBAEApgkAIQsHAACVCgAgCQAAlgoAIBIAAPIKACAUAACUCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHyBAEAAAAB8wQBAAAAARUHAADaCgAgCQAA1woAIAoAANgKACALAADRCgAgEQAA0goAIBIAALYLACATAADTCgAgFAAA1AoAIBoAANkKACAeAADVCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHyBAEAAAAB8wQBAAAAAfUEAQAAAAGhBQEAAAABsQUBAAAAAb0FQAAAAAECAAAAKAAgSgAAgwwAIAMAAAAoACBKAACDDAAgSwAAggwAIAFDAACuEwAwAgAAACgAIEMAAIIMACACAAAAnwoAIEMAAIEMACALyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfIEAQCmCQAh8wQBAKYJACH1BAEApgkAIaEFAQCmCQAhsQUBAKcJACG9BUAAqAkAIRUHAACrCgAgCQAAqAoAIAoAAKkKACALAACiCgAgEQAAowoAIBIAALQLACATAACkCgAgFAAApQoAIBoAAKoKACAeAACmCgAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfIEAQCmCQAh8wQBAKYJACH1BAEApgkAIaEFAQCmCQAhsQUBAKcJACG9BUAAqAkAIRUHAADaCgAgCQAA1woAIAoAANgKACALAADRCgAgEQAA0goAIBIAALYLACATAADTCgAgFAAA1AoAIBoAANkKACAeAADVCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHyBAEAAAAB8wQBAAAAAfUEAQAAAAGhBQEAAAABsQUBAAAAAb0FQAAAAAEPBwAAiAwAIAkAAIkMACAVAACFDAAgFwAAhgwAIBgAAIcMACAbAACKDAAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAABnwUBAAAAAaAFAgAAAAGiBQEAAAABBEoAAPsLADDpBQAA_AsAMOsFAAD-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_BQEAAAABAgAAACMAIEoAAN4MACADAAAAIwAgSgAA3gwAIEsAAMcMACABQwAAlRMAMBIHAADsCAAgCQAAlwkAIAoAAJUJACAVAACZCAAgFwAAvggAIMYEAACWCQAwxwQAACEAEMgEAACWCQAwyQQBAAAAAc4EAQD4BwAhzwQBAPgHACHRBEAA_AcAIdIEQAD8BwAhnwUBAPkHACGrBQIA_wgAIbEFAQD5BwAhvgUBAAAAAb8FAQD4BwAhAgAAACMAIEMAAMcMACACAAAAxQwAIEMAAMYMACANxgQAAMQMADDHBAAAxQwAEMgEAADEDAAwyQQBAPgHACHOBAEA-AcAIc8EAQD4BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhqwUCAP8IACGxBQEA-QcAIb4FAQD4BwAhvwUBAPgHACENxgQAAMQMADDHBAAAxQwAEMgEAADEDAAwyQQBAPgHACHOBAEA-AcAIc8EAQD4BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhqwUCAP8IACGxBQEA-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_wQBAKcJACGBBQAAmguXBSKCBQEApwkAIYMFQADPCQAhhAVAAKgJACGGBQEApwkAIZcFAQCmCQAhDh4AAMALACAiAACdCwAgIwAAngsAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIfUEAQCnCQAh_wQBAKcJACGBBQAAmguXBSKCBQEApwkAIYMFQADPCQAhhAVAAKgJACGGBQEApwkAIZcFAQCmCQAhDh4AAMELACAiAAChCwAgIwAAogsAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAfUEAQAAAAH_BAEAAAABgQUAAACXBQKCBQEAAAABgwVAAAAAAYQFQAAAAAGGBQEAAAABlwUBAAAAAQHsBQEAAAAEBEoAAOwMADDpBQAA7QwAMOsFAADvDAAg7wUAAJQLADAAAAAAAuwFAQAAAAT2BQEAAAAFC0oAAP0MADBLAACBDQAw6QUAAP4MADDqBQAA_wwAMOsFAACADQAg7AUAAMgJADDtBQAAyAkAMO4FAADICQAw7wUAAMgJADDwBQAAgg0AMPEFAADLCQAwEgcAANoJACAJAADbCQAgEgAAgQsAICMAANkJACAqAADYCQAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHeBAEAAAAB8wQBAAAAAf8EAQAAAAGBBQAAAIEFAoIFAQAAAAGDBUAAAAABhAVAAAAAAYYFAQAAAAECAAAAgQEAIEoAAIUNACADAAAAgQEAIEoAAIUNACBLAACEDQAgAUMAAIMTADACAAAAgQEAIEMAAIQNACACAAAAzAkAIEMAAIMNACANyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAId4EAQCmCQAh8wQBAKcJACH_BAEApwkAIYEFAADOCYEFIoIFAQCnCQAhgwVAAM8JACGEBUAAqAkAIYYFAQCnCQAhEgcAANQJACAJAADVCQAgEgAAgAsAICMAANMJACAqAADSCQAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAId4EAQCmCQAh8wQBAKcJACH_BAEApwkAIYEFAADOCYEFIoIFAQCnCQAhgwVAAM8JACGEBUAAqAkAIYYFAQCnCQAhEgcAANoJACAJAADbCQAgEgAAgQsAICMAANkJACAqAADYCQAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHeBAEAAAAB8wQBAAAAAf8EAQAAAAGBBQAAAIEFAoIFAQAAAAGDBUAAAAABhAVAAAAAAYYFAQAAAAEB7AUBAAAABARKAAD9DAAw6QUAAP4MADDrBQAAgA0AIO8FAADICQAwAAAAAAHsBQAAALcFAwHsBQAAALoFAgVKAAD4EgAgSwAAgRMAIOkFAAD5EgAg6gUAAIATACDvBQAAkQIAIAdKAAD2EgAgSwAA_hIAIOkFAAD3EgAg6gUAAP0SACDtBQAAYwAg7gUAAGMAIO8FAACRAgAgB0oAAPQSACBLAAD7EgAg6QUAAPUSACDqBQAA-hIAIO0FAAAWACDuBQAAFgAg7wUAAJQEACADSgAA-BIAIOkFAAD5EgAg7wUAAJECACADSgAA9hIAIOkFAAD3EgAg7wUAAJECACADSgAA9BIAIOkFAAD1EgAg7wUAAJQEACAAAAALSgAA4g4AMEsAAOcOADDpBQAA4w4AMOoFAADkDgAw6wUAAOUOACDsBQAA5g4AMO0FAADmDgAw7gUAAOYOADDvBQAA5g4AMPAFAADoDgAw8QUAAOkOADALSgAA1g4AMEsAANsOADDpBQAA1w4AMOoFAADYDgAw6wUAANkOACDsBQAA2g4AMO0FAADaDgAw7gUAANoOADDvBQAA2g4AMPAFAADcDgAw8QUAAN0OADALSgAAvQ4AMEsAAMIOADDpBQAAvg4AMOoFAAC_DgAw6wUAAMAOACDsBQAAwQ4AMO0FAADBDgAw7gUAAMEOADDvBQAAwQ4AMPAFAADDDgAw8QUAAMQOADALSgAApA4AMEsAAKkOADDpBQAApQ4AMOoFAACmDgAw6wUAAKcOACDsBQAAqA4AMO0FAACoDgAw7gUAAKgOADDvBQAAqA4AMPAFAACqDgAw8QUAAKsOADALSgAAmw4AMEsAAJ8OADDpBQAAnA4AMOoFAACdDgAw6wUAAJ4OACDsBQAA2wsAMO0FAADbCwAw7gUAANsLADDvBQAA2wsAMPAFAACgDgAw8QUAAN4LADALSgAAkA4AMEsAAJQOADDpBQAAkQ4AMOoFAACSDgAw6wUAAJMOACDsBQAAwQwAMO0FAADBDAAw7gUAAMEMADDvBQAAwQwAMPAFAACVDgAw8QUAAMQMADALSgAAgQ4AMEsAAIYOADDpBQAAgg4AMOoFAACDDgAw6wUAAIQOACDsBQAAhQ4AMO0FAACFDgAw7gUAAIUOADDvBQAAhQ4AMPAFAACHDgAw8QUAAIgOADALSgAA9Q0AMEsAAPoNADDpBQAA9g0AMOoFAAD3DQAw6wUAAPgNACDsBQAA-Q0AMO0FAAD5DQAw7gUAAPkNADDvBQAA-Q0AMPAFAAD7DQAw8QUAAPwNADALSgAA6Q0AMEsAAO4NADDpBQAA6g0AMOoFAADrDQAw6wUAAOwNACDsBQAA7Q0AMO0FAADtDQAw7gUAAO0NADDvBQAA7Q0AMPAFAADvDQAw8QUAAPANADALSgAA4A0AMEsAAOQNADDpBQAA4Q0AMOoFAADiDQAw6wUAAOMNACDsBQAAmwoAMO0FAACbCgAw7gUAAJsKADDvBQAAmwoAMPAFAADlDQAw8QUAAJ4KADALSgAA1w0AMEsAANsNADDpBQAA2A0AMOoFAADZDQAw6wUAANoNACDsBQAAhwoAMO0FAACHCgAw7gUAAIcKADDvBQAAhwoAMPAFAADcDQAw8QUAAIoKADALSgAAyw0AMEsAANANADDpBQAAzA0AMOoFAADNDQAw6wUAAM4NACDsBQAAzw0AMO0FAADPDQAw7gUAAM8NADDvBQAAzw0AMPAFAADRDQAw8QUAANINADALSgAAwg0AMEsAAMYNADDpBQAAww0AMOoFAADEDQAw6wUAAMUNACDsBQAAyAkAMO0FAADICQAw7gUAAMgJADDvBQAAyAkAMPAFAADHDQAw8QUAAMsJADALSgAAuQ0AMEsAAL0NADDpBQAAug0AMOoFAAC7DQAw6wUAALwNACDsBQAA4AkAMO0FAADgCQAw7gUAAOAJADDvBQAA4AkAMPAFAAC-DQAw8QUAAOMJADALSgAAsA0AMEsAALQNADDpBQAAsQ0AMOoFAACyDQAw6wUAALMNACDsBQAA8AkAMO0FAADwCQAw7gUAAPAJADDvBQAA8AkAMPAFAAC1DQAw8QUAAPMJADALSgAApw0AMEsAAKsNADDpBQAAqA0AMOoFAACpDQAw6wUAAKoNACDsBQAAtQkAMO0FAAC1CQAw7gUAALUJADDvBQAAtQkAMPAFAACsDQAw8QUAALgJADAWCQAAwwkAIA4AAMEJACASAACyCgAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfMEAQAAAAGHBQEAAAABiAUIAAAAAYkFCAAAAAGKBQgAAAABiwUIAAAAAYwFCAAAAAGNBQgAAAABjgUIAAAAAY8FCAAAAAGQBQgAAAABkQUIAAAAAZIFCAAAAAGTBQgAAAABlAUIAAAAAQIAAACLAQAgSgAArw0AIAMAAACLAQAgSgAArw0AIEsAAK4NACABQwAA8xIAMAIAAACLAQAgQwAArg0AIAIAAAC5CQAgQwAArQ0AIBPJBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfMEAQCmCQAhhwUBAKYJACGIBQgAuwkAIYkFCAC7CQAhigUIALsJACGLBQgAuwkAIYwFCAC7CQAhjQUIALsJACGOBQgAuwkAIY8FCAC7CQAhkAUIALsJACGRBQgAuwkAIZIFCAC7CQAhkwUIALsJACGUBQgAuwkAIRYJAAC_CQAgDgAAvQkAIBIAALEKACDJBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfMEAQCmCQAhhwUBAKYJACGIBQgAuwkAIYkFCAC7CQAhigUIALsJACGLBQgAuwkAIYwFCAC7CQAhjQUIALsJACGOBQgAuwkAIY8FCAC7CQAhkAUIALsJACGRBQgAuwkAIZIFCAC7CQAhkwUIALsJACGUBQgAuwkAIRYJAADDCQAgDgAAwQkAIBIAALIKACDJBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8wQBAAAAAYcFAQAAAAGIBQgAAAABiQUIAAAAAYoFCAAAAAGLBQgAAAABjAUIAAAAAY0FCAAAAAGOBQgAAAABjwUIAAAAAZAFCAAAAAGRBQgAAAABkgUIAAAAAZMFCAAAAAGUBQgAAAABDQkAAP0JACAdAAD3CgAgHgAA-wkAIMkEAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAH0BAEAAAAB9QQBAAAAAfYEAQAAAAH3BAEAAAAB-AQBAAAAAfkEQAAAAAECAAAAPQAgSgAAuA0AIAMAAAA9ACBKAAC4DQAgSwAAtw0AIAFDAADyEgAwAgAAAD0AIEMAALcNACACAAAA9AkAIEMAALYNACAKyQQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACH0BAEApgkAIfUEAQCmCQAh9gQBAKcJACH3BAEApwkAIfgEAQCnCQAh-QRAAKgJACENCQAA-QkAIB0AAPYKACAeAAD3CQAgyQQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACH0BAEApgkAIfUEAQCmCQAh9gQBAKcJACH3BAEApwkAIfgEAQCnCQAh-QRAAKgJACENCQAA_QkAIB0AAPcKACAeAAD7CQAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfQEAQAAAAH1BAEAAAAB9gQBAAAAAfcEAQAAAAH4BAEAAAAB-QRAAAAAAQ4JAACBCgAgEgAA_AoAIBYAAP8JACAcAACCCgAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHzBAEAAAAB-gQBAAAAAfsEAQAAAAH9BAAAAP0EAv4EQAAAAAECAAAARwAgSgAAwQ0AIAMAAABHACBKAADBDQAgSwAAwA0AIAFDAADxEgAwAgAAAEcAIEMAAMANACACAAAA5AkAIEMAAL8NACAKyQQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfMEAQCmCQAh-gQBAKYJACH7BAEApwkAIf0EAADmCf0EIv4EQADPCQAhDgkAAOoJACASAAD7CgAgFgAA6AkAIBwAAOsJACDJBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfEEAQCmCQAh8wQBAKYJACH6BAEApgkAIfsEAQCnCQAh_QQAAOYJ_QQi_gRAAM8JACEOCQAAgQoAIBIAAPwKACAWAAD_CQAgHAAAggoAIMkEAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8wQBAAAAAfoEAQAAAAH7BAEAAAAB_QQAAAD9BAL-BEAAAAABEgkAANsJACASAACBCwAgIQAA1wkAICMAANkJACAqAADYCQAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAd4EAQAAAAHzBAEAAAAB_wQBAAAAAYEFAAAAgQUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAYYFAQAAAAECAAAAgQEAIEoAAMoNACADAAAAgQEAIEoAAMoNACBLAADJDQAgAUMAAPASADACAAAAgQEAIEMAAMkNACACAAAAzAkAIEMAAMgNACANyQQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHeBAEApgkAIfMEAQCnCQAh_wQBAKcJACGBBQAAzgmBBSKCBQEApwkAIYMFQADPCQAhhAVAAKgJACGFBQEApgkAIYYFAQCnCQAhEgkAANUJACASAACACwAgIQAA0QkAICMAANMJACAqAADSCQAgyQQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHeBAEApgkAIfMEAQCnCQAh_wQBAKcJACGBBQAAzgmBBSKCBQEApwkAIYMFQADPCQAhhAVAAKgJACGFBQEApgkAIYYFAQCnCQAhEgkAANsJACASAACBCwAgIQAA1wkAICMAANkJACAqAADYCQAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAd4EAQAAAAHzBAEAAAAB_wQBAAAAAYEFAAAAgQUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAYYFAQAAAAEPMgAAkQ0AIDMAAJINACDJBAEAAAAB0QRAAAAAAdIEQAAAAAGBBQAAALoFAoMFQAAAAAGfBQEAAAABswUBAAAAAbQFAQAAAAG1BQEAAAABtwUAAAC3BQO4BQEAAAABugUBAAAAAbsFAQAAAAECAAAAqQEAIEoAANYNACADAAAAqQEAIEoAANYNACBLAADVDQAgAUMAAO8SADAUBwAA6AgAIDIAAP0HACAzAADnCAAgxgQAAOQIADDHBAAApwEAEMgEAADkCAAwyQQBAAAAAc4EAQD5BwAh0QRAAPwHACHSBEAA_AcAIYEFAADlCLoFIoMFQADmCAAhnwUBAPkHACGzBQEA-AcAIbQFAQD4BwAhtQUBAPkHACG3BQAAtQi3BSO4BQEA-QcAIboFAQD5BwAhuwUBAPkHACECAAAAqQEAIEMAANUNACACAAAA0w0AIEMAANQNACARxgQAANINADDHBAAA0w0AEMgEAADSDQAwyQQBAPgHACHOBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGBBQAA5Qi6BSKDBUAA5ggAIZ8FAQD5BwAhswUBAPgHACG0BQEA-AcAIbUFAQD5BwAhtwUAALUItwUjuAUBAPkHACG6BQEA-QcAIbsFAQD5BwAhEcYEAADSDQAwxwQAANMNABDIBAAA0g0AMMkEAQD4BwAhzgQBAPkHACHRBEAA_AcAIdIEQAD8BwAhgQUAAOUIugUigwVAAOYIACGfBQEA-QcAIbMFAQD4BwAhtAUBAPgHACG1BQEA-QcAIbcFAAC1CLcFI7gFAQD5BwAhugUBAPkHACG7BQEA-QcAIQ3JBAEApgkAIdEEQACoCQAh0gRAAKgJACGBBQAAjQ26BSKDBUAAzwkAIZ8FAQCnCQAhswUBAKYJACG0BQEApgkAIbUFAQCnCQAhtwUAAIwNtwUjuAUBAKcJACG6BQEApwkAIbsFAQCnCQAhDzIAAI4NACAzAACPDQAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhgQUAAI0NugUigwVAAM8JACGfBQEApwkAIbMFAQCmCQAhtAUBAKYJACG1BQEApwkAIbcFAACMDbcFI7gFAQCnCQAhugUBAKcJACG7BQEApwkAIQ8yAACRDQAgMwAAkg0AIMkEAQAAAAHRBEAAAAAB0gRAAAAAAYEFAAAAugUCgwVAAAAAAZ8FAQAAAAGzBQEAAAABtAUBAAAAAbUFAQAAAAG3BQAAALcFA7gFAQAAAAG6BQEAAAABuwUBAAAAAQsJAACWCgAgEgAA8goAIBQAAJQKACAWAACTCgAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHyBAEAAAAB8wQBAAAAAQIAAABCACBKAADfDQAgAwAAAEIAIEoAAN8NACBLAADeDQAgAUMAAO4SADACAAAAQgAgQwAA3g0AIAIAAACLCgAgQwAA3Q0AIAfJBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfEEAQCmCQAh8gQBAKYJACHzBAEApgkAIQsJAACRCgAgEgAA8QoAIBQAAI8KACAWAACOCgAgyQQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh8wQBAKYJACELCQAAlgoAIBIAAPIKACAUAACUCgAgFgAAkwoAIMkEAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAEVCQAA1woAIAoAANgKACALAADRCgAgEQAA0goAIBIAALYLACATAADTCgAgFAAA1AoAIBYAANYKACAaAADZCgAgHgAA1QoAIMkEAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABAgAAACgAIEoAAOgNACADAAAAKAAgSgAA6A0AIEsAAOcNACABQwAA7RIAMAIAAAAoACBDAADnDQAgAgAAAJ8KACBDAADmDQAgC8kEAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8QQBAKYJACHyBAEApgkAIfMEAQCmCQAh9QQBAKYJACGhBQEApgkAIbEFAQCnCQAhvQVAAKgJACEVCQAAqAoAIAoAAKkKACALAACiCgAgEQAAowoAIBIAALQLACATAACkCgAgFAAApQoAIBYAAKcKACAaAACqCgAgHgAApgoAIMkEAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8QQBAKYJACHyBAEApgkAIfMEAQCmCQAh9QQBAKYJACGhBQEApgkAIbEFAQCnCQAhvQVAAKgJACEVCQAA1woAIAoAANgKACALAADRCgAgEQAA0goAIBIAALYLACATAADTCgAgFAAA1AoAIBYAANYKACAaAADZCgAgHgAA1QoAIMkEAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABDAMAALkLACAJAAC4CwAgFQAAugsAIB8AALsLACAkAAC8CwAgyQQBAAAAAc0EAQAAAAHPBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAABlQUBAAAAAQIAAAB7ACBKAAD0DQAgAwAAAHsAIEoAAPQNACBLAADzDQAgAUMAAOwSADARAwAA_QcAIAcAAOwIACAJAADxCAAgFQAAmQgAIB8AAMEIACAkAACoCAAgxgQAAPcIADDHBAAAZQAQyAQAAPcIADDJBAEAAAABzQQBAPkHACHOBAEA-AcAIc8EAQD5BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhlQUBAAAAAQIAAAB7ACBDAADzDQAgAgAAAPENACBDAADyDQAgC8YEAADwDQAwxwQAAPENABDIBAAA8A0AMMkEAQD4BwAhzQQBAPkHACHOBAEA-AcAIc8EAQD5BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhlQUBAPgHACELxgQAAPANADDHBAAA8Q0AEMgEAADwDQAwyQQBAPgHACHNBAEA-QcAIc4EAQD4BwAhzwQBAPkHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGVBQEA-AcAIQfJBAEApgkAIc0EAQCnCQAhzwQBAKcJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACGVBQEApgkAIQwDAACMCwAgCQAAiwsAIBUAAI0LACAfAACOCwAgJAAAjwsAIMkEAQCmCQAhzQQBAKcJACHPBAEApwkAIdAEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZUFAQCmCQAhDAMAALkLACAJAAC4CwAgFQAAugsAIB8AALsLACAkAAC8CwAgyQQBAAAAAc0EAQAAAAHPBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAABlQUBAAAAARADAADiCgAgCQAA4QoAIBUAANwKACAXAADdCgAgGAAA3goAIDUAAN8KACA2AADgCgAgyQQBAAAAAcoEAQAAAAHLBAEAAAABzAQBAAAAAc0EAQAAAAHPBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAABAgAAABAAIEoAAIAOACADAAAAEAAgSgAAgA4AIEsAAP8NACABQwAA6xIAMBUDAAD9BwAgBwAA7AgAIAkAAJcJACAVAACZCAAgFwAAvggAIBgAAMAIACA1AACrCAAgNgAAwggAIMYEAACdCQAwxwQAAA4AEMgEAACdCQAwyQQBAAAAAcoEAQAAAAHLBAEAAAABzAQBAPgHACHNBAEA-QcAIc4EAQD4BwAhzwQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACECAAAAEAAgQwAA_w0AIAIAAAD9DQAgQwAA_g0AIA3GBAAA_A0AMMcEAAD9DQAQyAQAAPwNADDJBAEA-AcAIcoEAQD4BwAhywQBAPgHACHMBAEA-AcAIc0EAQD5BwAhzgQBAPgHACHPBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIQ3GBAAA_A0AMMcEAAD9DQAQyAQAAPwNADDJBAEA-AcAIcoEAQD4BwAhywQBAPgHACHMBAEA-AcAIc0EAQD5BwAhzgQBAPgHACHPBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIQnJBAEApgkAIcoEAQCmCQAhywQBAKYJACHMBAEApgkAIc0EAQCnCQAhzwQBAKYJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACEQAwAAsAkAIAkAAK8JACAVAACqCQAgFwAAqwkAIBgAAKwJACA1AACtCQAgNgAArgkAIMkEAQCmCQAhygQBAKYJACHLBAEApgkAIcwEAQCmCQAhzQQBAKcJACHPBAEApgkAIdAEAQCmCQAh0QRAAKgJACHSBEAAqAkAIRADAADiCgAgCQAA4QoAIBUAANwKACAXAADdCgAgGAAA3goAIDUAAN8KACA2AADgCgAgyQQBAAAAAcoEAQAAAAHLBAEAAAABzAQBAAAAAc0EAQAAAAHPBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAABBgMAAI8OACDJBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAAB3QUAAADiBQICAAAAAQAgSgAAjg4AIAMAAAABACBKAACODgAgSwAAjA4AIAFDAADqEgAwCwMAAP0HACAHAADsCAAgxgQAAJ4JADDHBAAACwAQyAQAAJ4JADDJBAEAAAABzgQBAPgHACHQBAEAAAAB0QRAAPwHACHSBEAA_AcAId0FAACfCeIFIgIAAAABACBDAACMDgAgAgAAAIkOACBDAACKDgAgCcYEAACIDgAwxwQAAIkOABDIBAAAiA4AMMkEAQD4BwAhzgQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHdBQAAnwniBSIJxgQAAIgOADDHBAAAiQ4AEMgEAACIDgAwyQQBAPgHACHOBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAId0FAACfCeIFIgXJBAEApgkAIdAEAQCmCQAh0QRAAKgJACHSBEAAqAkAId0FAACLDuIFIgHsBQAAAOIFAgYDAACNDgAgyQQBAKYJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACHdBQAAiw7iBSIFSgAA5RIAIEsAAOgSACDpBQAA5hIAIOoFAADnEgAg7wUAAJECACAGAwAAjw4AIMkEAQAAAAHQBAEAAAAB0QRAAAAAAdIEQAAAAAHdBQAAAOIFAgNKAADlEgAg6QUAAOYSACDvBQAAkQIAIA0JAADgDAAgCgAAmg4AIBUAAOEMACAXAADiDAAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGrBQIAAAABsQUBAAAAAb4FAQAAAAG_BQEAAAABAgAAACMAIEoAAJkOACADAAAAIwAgSgAAmQ4AIEsAAJcOACABQwAA5BIAMAIAAAAjACBDAACXDgAgAgAAAMUMACBDAACWDgAgCckEAQCmCQAhzwQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGrBQIA4QsAIbEFAQCnCQAhvgUBAKYJACG_BQEApgkAIQ0JAADJDAAgCgAAmA4AIBUAAMoMACAXAADLDAAgyQQBAKYJACHPBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIasFAgDhCwAhsQUBAKcJACG-BQEApgkAIb8FAQCmCQAhB0oAAN8SACBLAADiEgAg6QUAAOASACDqBQAA4RIAIO0FAAAdACDuBQAAHQAg7wUAAB8AIA0JAADgDAAgCgAAmg4AIBUAAOEMACAXAADiDAAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGrBQIAAAABsQUBAAAAAb4FAQAAAAG_BQEAAAABA0oAAN8SACDpBQAA4BIAIO8FAAAfACAPCQAAiQwAIBUAAIUMACAXAACGDAAgGAAAhwwAIBoAAJUMACAbAACKDAAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABoAUCAAAAAaEFAQAAAAGiBQEAAAABAgAAAEwAIEoAAKMOACADAAAATAAgSgAAow4AIEsAAKIOACABQwAA3hIAMAIAAABMACBDAACiDgAgAgAAAN8LACBDAAChDgAgCckEAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaAFAgDhCwAhoQUBAKYJACGiBQEApwkAIQ8JAADnCwAgFQAA4wsAIBcAAOQLACAYAADlCwAgGgAAlAwAIBsAAOgLACDJBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAhnwUBAKcJACGgBQIA4QsAIaEFAQCmCQAhogUBAKcJACEPCQAAiQwAIBUAAIUMACAXAACGDAAgGAAAhwwAIBoAAJUMACAbAACKDAAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABoAUCAAAAAaEFAQAAAAGiBQEAAAABCQ8AALwOACDJBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAABwAUBAAAAAcEFAQAAAAHCBQIAAAABxAUAAADEBQICAAAAngEAIEoAALsOACADAAAAngEAIEoAALsOACBLAACwDgAgAUMAAN0SADAOBwAA7AgAIA8AAKMIACDGBAAA6QgAMMcEAACcAQAQyAQAAOkIADDJBAEAAAABzgQBAPgHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPkHACHABQEA-AcAIcEFAQD4BwAhwgUCAOoIACHEBQAA6wjEBSICAAAAngEAIEMAALAOACACAAAArA4AIEMAAK0OACAMxgQAAKsOADDHBAAArA4AEMgEAACrDgAwyQQBAPgHACHOBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGZBQEA-QcAIcAFAQD4BwAhwQUBAPgHACHCBQIA6ggAIcQFAADrCMQFIgzGBAAAqw4AMMcEAACsDgAQyAQAAKsOADDJBAEA-AcAIc4EAQD4BwAh0QRAAPwHACHSBEAA_AcAIZkFAQD5BwAhwAUBAPgHACHBBQEA-AcAIcIFAgDqCAAhxAUAAOsIxAUiCMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCnCQAhwAUBAKYJACHBBQEApgkAIcIFAgCuDgAhxAUAAK8OxAUiBewFAgAAAAHyBQIAAAAB8wUCAAAAAfQFAgAAAAH1BQIAAAABAewFAAAAxAUCCQ8AALEOACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGZBQEApwkAIcAFAQCmCQAhwQUBAKYJACHCBQIArg4AIcQFAACvDsQFIgtKAACyDgAwSwAAtg4AMOkFAACzDgAw6gUAALQOADDrBQAAtQ4AIOwFAADECgAw7QUAAMQKADDuBQAAxAoAMO8FAADECgAw8AUAALcOADDxBQAAxwoAMAoNAADOCgAgDgAApQwAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAYcFAQAAAAGZBQEAAAABnwUBAAAAAaYFAQAAAAGnBQEAAAABAgAAACwAIEoAALoOACADAAAALAAgSgAAug4AIEsAALkOACABQwAA3BIAMAIAAAAsACBDAAC5DgAgAgAAAMgKACBDAAC4DgAgCMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIYcFAQCmCQAhmQUBAKYJACGfBQEApwkAIaYFAQCnCQAhpwUBAKYJACEKDQAAywoAIA4AAKMMACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGHBQEApgkAIZkFAQCmCQAhnwUBAKcJACGmBQEApwkAIacFAQCmCQAhCg0AAM4KACAOAAClDAAgyQQBAAAAAdEEQAAAAAHSBEAAAAABhwUBAAAAAZkFAQAAAAGfBQEAAAABpgUBAAAAAacFAQAAAAEJDwAAvA4AIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAHABQEAAAABwQUBAAAAAcIFAgAAAAHEBQAAAMQFAgRKAACyDgAw6QUAALMOADDrBQAAtQ4AIO8FAADECgAwCAkAANQOACAZAADVDgAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABAgAAAHUAIEoAANMOACADAAAAdQAgSgAA0w4AIEsAAMcOACABQwAA2xIAMA0HAADsCAAgCQAA8QgAIBkAAJgIACDGBAAA-AgAMMcEAABRABDIBAAA-AgAMMkEAQAAAAHOBAEA-AcAIc8EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZkFAQD4BwAhnwUBAPkHACECAAAAdQAgQwAAxw4AIAIAAADFDgAgQwAAxg4AIArGBAAAxA4AMMcEAADFDgAQyAQAAMQOADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPgHACGfBQEA-QcAIQrGBAAAxA4AMMcEAADFDgAQyAQAAMQOADDJBAEA-AcAIc4EAQD4BwAhzwQBAPkHACHRBEAA_AcAIdIEQAD8BwAhmQUBAPgHACGfBQEA-QcAIQbJBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAhnwUBAKcJACEICQAAyA4AIBkAAMkOACDJBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAhnwUBAKcJACEHSgAA1RIAIEsAANkSACDpBQAA1hIAIOoFAADYEgAg7QUAABgAIO4FAAAYACDvBQAAGgAgC0oAAMoOADBLAADODgAw6QUAAMsOADDqBQAAzA4AMOsFAADNDgAg7AUAANsLADDtBQAA2wsAMO4FAADbCwAw7wUAANsLADDwBQAAzw4AMPEFAADeCwAwDwcAAIgMACAJAACJDAAgFQAAhQwAIBcAAIYMACAYAACHDAAgGgAAlQwAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAZ8FAQAAAAGgBQIAAAABoQUBAAAAAQIAAABMACBKAADSDgAgAwAAAEwAIEoAANIOACBLAADRDgAgAUMAANcSADACAAAATAAgQwAA0Q4AIAIAAADfCwAgQwAA0A4AIAnJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaAFAgDhCwAhoQUBAKYJACEPBwAA5gsAIAkAAOcLACAVAADjCwAgFwAA5AsAIBgAAOULACAaAACUDAAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAhnwUBAKcJACGgBQIA4QsAIaEFAQCmCQAhDwcAAIgMACAJAACJDAAgFQAAhQwAIBcAAIYMACAYAACHDAAgGgAAlQwAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAZ8FAQAAAAGgBQIAAAABoQUBAAAAAQgJAADUDgAgGQAA1Q4AIMkEAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAABnwUBAAAAAQNKAADVEgAg6QUAANYSACDvBQAAGgAgBEoAAMoOADDpBQAAyw4AMOsFAADNDgAg7wUAANsLADANCQAA5gwAIBQAAOMMACAVAADkDAAgyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGfBQEAAAABqQUBAAAAAaoFQAAAAAGrBQgAAAABrAUIAAAAAQIAAAAfACBKAADhDgAgAwAAAB8AIEoAAOEOACBLAADgDgAgAUMAANQSADASBwAA7AgAIAkAAJcJACAUAAC6CAAgFQAAmQgAIMYEAACYCQAwxwQAAB0AEMgEAACYCQAwyQQBAAAAAc4EAQD4BwAhzwQBAPgHACHRBEAA_AcAIdIEQAD8BwAh-gQBAPgHACGfBQEA-QcAIakFAQD5BwAhqgVAAOYIACGrBQgA7ggAIawFCADuCAAhAgAAAB8AIEMAAOAOACACAAAA3g4AIEMAAN8OACAOxgQAAN0OADDHBAAA3g4AEMgEAADdDgAwyQQBAPgHACHOBAEA-AcAIc8EAQD4BwAh0QRAAPwHACHSBEAA_AcAIfoEAQD4BwAhnwUBAPkHACGpBQEA-QcAIaoFQADmCAAhqwUIAO4IACGsBQgA7ggAIQ7GBAAA3Q4AMMcEAADeDgAQyAQAAN0OADDJBAEA-AcAIc4EAQD4BwAhzwQBAPgHACHRBEAA_AcAIdIEQAD8BwAh-gQBAPgHACGfBQEA-QcAIakFAQD5BwAhqgVAAOYIACGrBQgA7ggAIawFCADuCAAhCskEAQCmCQAhzwQBAKYJACHRBEAAqAkAIdIEQACoCQAh-gQBAKYJACGfBQEApwkAIakFAQCnCQAhqgVAAM8JACGrBQgAuwkAIawFCAC7CQAhDQkAALMMACAUAACwDAAgFQAAsQwAIMkEAQCmCQAhzwQBAKYJACHRBEAAqAkAIdIEQACoCQAh-gQBAKYJACGfBQEApwkAIakFAQCnCQAhqgVAAM8JACGrBQgAuwkAIawFCAC7CQAhDQkAAOYMACAUAADjDAAgFQAA5AwAIMkEAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAH6BAEAAAABnwUBAAAAAakFAQAAAAGqBUAAAAABqwUIAAAAAawFCAAAAAEHLwAAgRAAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAG1BQEAAAABvAUBAAAAAQIAAAAUACBKAACAEAAgAwAAABQAIEoAAIAQACBLAADsDgAgAUMAANMSADAMBwAA6AgAIC8AAJwJACDGBAAAmwkAMMcEAAASABDIBAAAmwkAMMkEAQAAAAHOBAEA-QcAIdEEQAD8BwAh0gRAAPwHACGfBQEA-QcAIbUFAQD5BwAhvAUBAPgHACECAAAAFAAgQwAA7A4AIAIAAADqDgAgQwAA6w4AIArGBAAA6Q4AMMcEAADqDgAQyAQAAOkOADDJBAEA-AcAIc4EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhtQUBAPkHACG8BQEA-AcAIQrGBAAA6Q4AMMcEAADqDgAQyAQAAOkOADDJBAEA-AcAIc4EAQD5BwAh0QRAAPwHACHSBEAA_AcAIZ8FAQD5BwAhtQUBAPkHACG8BQEA-AcAIQbJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbUFAQCnCQAhvAUBAKYJACEHLwAA7Q4AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhtQUBAKcJACG8BQEApgkAIQtKAADuDgAwSwAA8w4AMOkFAADvDgAw6gUAAPAOADDrBQAA8Q4AIOwFAADyDgAw7QUAAPIOADDuBQAA8g4AMO8FAADyDgAw8AUAAPQOADDxBQAA9Q4AMBIVAAD6DwAgFwAA-w8AIBkAAPcPACAlAAD0DwAgJgAA9Q8AICcAAPYPACAoAAD4DwAgKQAA-Q8AICsAAPwPACAsAAD9DwAgLQAA_g8AIC4AAP8PACDJBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABtQUBAAAAAbwFAQAAAAECAAAAGgAgSgAA8w8AIAMAAAAaACBKAADzDwAgSwAA-A4AIAFDAADSEgAwFwgAAJoJACAVAACZCAAgFwAAvggAIBkAAJgIACAlAAC3CAAgJgAAuAgAICcAALoIACAoAAC8CAAgKQAAvQgAICsAAKsIACAsAADACAAgLQAAwQgAIC4AAMIIACDGBAAAmQkAMMcEAAAYABDIBAAAmQkAMMkEAQAAAAHRBEAA_AcAIdIEQAD8BwAhnwUBAPkHACGwBQEA-QcAIbUFAQD5BwAhvAUBAPgHACECAAAAGgAgQwAA-A4AIAIAAAD2DgAgQwAA9w4AIArGBAAA9Q4AMMcEAAD2DgAQyAQAAPUOADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGfBQEA-QcAIbAFAQD5BwAhtQUBAPkHACG8BQEA-AcAIQrGBAAA9Q4AMMcEAAD2DgAQyAQAAPUOADDJBAEA-AcAIdEEQAD8BwAh0gRAAPwHACGfBQEA-QcAIbAFAQD5BwAhtQUBAPkHACG8BQEA-AcAIQbJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbUFAQCnCQAhvAUBAKYJACESFQAA_w4AIBcAAIAPACAZAAD8DgAgJQAA-Q4AICYAAPoOACAnAAD7DgAgKAAA_Q4AICkAAP4OACArAACBDwAgLAAAgg8AIC0AAIMPACAuAACEDwAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACG1BQEApwkAIbwFAQCmCQAhC0oAAOoPADBLAADuDwAw6QUAAOsPADDqBQAA7A8AMOsFAADtDwAg7AUAANoOADDtBQAA2g4AMO4FAADaDgAw7wUAANoOADDwBQAA7w8AMPEFAADdDgAwC0oAAN8PADBLAADjDwAw6QUAAOAPADDqBQAA4Q8AMOsFAADiDwAg7AUAAMEOADDtBQAAwQ4AMO4FAADBDgAw7wUAAMEOADDwBQAA5A8AMPEFAADEDgAwC0oAANYPADBLAADaDwAw6QUAANcPADDqBQAA2A8AMOsFAADZDwAg7AUAAMEMADDtBQAAwQwAMO4FAADBDAAw7wUAAMEMADDwBQAA2w8AMPEFAADEDAAwC0oAAM0PADBLAADRDwAw6QUAAM4PADDqBQAAzw8AMOsFAADQDwAg7AUAANsLADDtBQAA2wsAMO4FAADbCwAw7wUAANsLADDwBQAA0g8AMPEFAADeCwAwC0oAAMQPADBLAADIDwAw6QUAAMUPADDqBQAAxg8AMOsFAADHDwAg7AUAAPkNADDtBQAA-Q0AMO4FAAD5DQAw7wUAAPkNADDwBQAAyQ8AMPEFAAD8DQAwC0oAALsPADBLAAC_DwAw6QUAALwPADDqBQAAvQ8AMOsFAAC-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_CQAgHAAAggoAIMkEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8wQBAAAAAfoEAQAAAAH7BAEAAAAB_QQAAAD9BAL-BEAAAAABAgAAAEcAIEoAAJ8PACADAAAARwAgSgAAnw8AIEsAAJ4PACABQwAAzxIAMAIAAABHACBDAACeDwAgAgAAAOQJACBDAACdDwAgCskEAQCmCQAhzgQBAKYJACHRBEAAqAkAIdIEQACoCQAh8QQBAKYJACHzBAEApgkAIfoEAQCmCQAh-wQBAKcJACH9BAAA5gn9BCL-BEAAzwkAIQ4HAADpCQAgEgAA-woAIBYAAOgJACAcAADrCQAgyQQBAKYJACHOBAEApgkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfMEAQCmCQAh-gQBAKYJACH7BAEApwkAIf0EAADmCf0EIv4EQADPCQAhDgcAAIAKACASAAD8CgAgFgAA_wkAIBwAAIIKACDJBAEAAAABzgQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfMEAQAAAAH6BAEAAAAB-wQBAAAAAf0EAAAA_QQC_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_Q0AIEMAAMoPACAJyQQBAKYJACHKBAEApgkAIcsEAQCmCQAhzAQBAKYJACHNBAEApwkAIc4EAQCmCQAh0AQBAKYJACHRBEAAqAkAIdIEQACoCQAhEAMAALAJACAHAACpCQAgFQAAqgkAIBcAAKsJACAYAACsCQAgNQAArQkAIDYAAK4JACDJBAEApgkAIcoEAQCmCQAhywQBAKYJACHMBAEApgkAIc0EAQCnCQAhzgQBAKYJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACEQAwAA4goAIAcAANsKACAVAADcCgAgFwAA3QoAIBgAAN4KACA1AADfCgAgNgAA4AoAIMkEAQAAAAHKBAEAAAABywQBAAAAAcwEAQAAAAHNBAEAAAABzgQBAAAAAdAEAQAAAAHRBEAAAAAB0gRAAAAAAQ8HAACIDAAgFQAAhQwAIBcAAIYMACAYAACHDAAgGgAAlQwAIBsAAIoMACDJBAEAAAABzgQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAZ8FAQAAAAGgBQIAAAABoQUBAAAAAaIFAQAAAAECAAAATAAgSgAA1Q8AIAMAAABMACBKAADVDwAgSwAA1A8AIAFDAADJEgAwAgAAAEwAIEMAANQPACACAAAA3wsAIEMAANMPACAJyQQBAKYJACHOBAEApgkAIdEEQACoCQAh0gRAAKgJACGZBQEApgkAIZ8FAQCnCQAhoAUCAOELACGhBQEApgkAIaIFAQCnCQAhDwcAAOYLACAVAADjCwAgFwAA5AsAIBgAAOULACAaAACUDAAgGwAA6AsAIMkEAQCmCQAhzgQBAKYJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaAFAgDhCwAhoQUBAKYJACGiBQEApwkAIQ8HAACIDAAgFQAAhQwAIBcAAIYMACAYAACHDAAgGgAAlQwAIBsAAIoMACDJBAEAAAABzgQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAZ8FAQAAAAGgBQIAAAABoQUBAAAAAaIFAQAAAAENBwAA3wwAIAoAAJoOACAVAADhDAAgFwAA4gwAIMkEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABqwUCAAAAAbEFAQAAAAG-BQEAAAABvwUBAAAAAQIAAAAjACBKAADeDwAgAwAAACMAIEoAAN4PACBLAADdDwAgAUMAAMgSADACAAAAIwAgQwAA3Q8AIAIAAADFDAAgQwAA3A8AIAnJBAEApgkAIc4EAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhqwUCAOELACGxBQEApwkAIb4FAQCmCQAhvwUBAKYJACENBwAAyAwAIAoAAJgOACAVAADKDAAgFwAAywwAIMkEAQCmCQAhzgQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGrBQIA4QsAIbEFAQCnCQAhvgUBAKYJACG_BQEApgkAIQ0HAADfDAAgCgAAmg4AIBUAAOEMACAXAADiDAAgyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGrBQIAAAABsQUBAAAAAb4FAQAAAAG_BQEAAAABCAcAAOkPACAZAADVDgAgyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABAgAAAHUAIEoAAOgPACADAAAAdQAgSgAA6A8AIEsAAOYPACABQwAAxxIAMAIAAAB1ACBDAADmDwAgAgAAAMUOACBDAADlDwAgBskEAQCmCQAhzgQBAKYJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIQgHAADnDwAgGQAAyQ4AIMkEAQCmCQAhzgQBAKYJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIQVKAADCEgAgSwAAxRIAIOkFAADDEgAg6gUAAMQSACDvBQAAlAQAIAgHAADpDwAgGQAA1Q4AIMkEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAABnwUBAAAAAQNKAADCEgAg6QUAAMMSACDvBQAAlAQAIA0HAADlDAAgFAAA4wwAIBUAAOQMACDJBAEAAAABzgQBAAAAAdEEQAAAAAHSBEAAAAAB-gQBAAAAAZ8FAQAAAAGpBQEAAAABqgVAAAAAAasFCAAAAAGsBQgAAAABAgAAAB8AIEoAAPIPACADAAAAHwAgSgAA8g8AIEsAAPEPACABQwAAwRIAMAIAAAAfACBDAADxDwAgAgAAAN4OACBDAADwDwAgCskEAQCmCQAhzgQBAKYJACHRBEAAqAkAIdIEQACoCQAh-gQBAKYJACGfBQEApwkAIakFAQCnCQAhqgVAAM8JACGrBQgAuwkAIawFCAC7CQAhDQcAALIMACAUAACwDAAgFQAAsQwAIMkEAQCmCQAhzgQBAKYJACHRBEAAqAkAIdIEQACoCQAh-gQBAKYJACGfBQEApwkAIakFAQCnCQAhqgVAAM8JACGrBQgAuwkAIawFCAC7CQAhDQcAAOUMACAUAADjDAAgFQAA5AwAIMkEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAH6BAEAAAABnwUBAAAAAakFAQAAAAGqBUAAAAABqwUIAAAAAawFCAAAAAESFQAA-g8AIBcAAPsPACAZAAD3DwAgJQAA9A8AICYAAPUPACAnAAD2DwAgKAAA-A8AICkAAPkPACArAAD8DwAgLAAA_Q8AIC0AAP4PACAuAAD_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-Q0AMO8FAAD5DQAw8AUAALgRADDxBQAA_A0AMAtKAACqEQAwSwAArhEAMOkFAACrEQAw6gUAAKwRADDrBQAArREAIOwFAADtDQAw7QUAAO0NADDuBQAA7Q0AMO8FAADtDQAw8AUAAK8RADDxBQAA8A0AMAtKAAChEQAwSwAApREAMOkFAACiEQAw6gUAAKMRADDrBQAApBEAIOwFAADPDQAw7QUAAM8NADDuBQAAzw0AMO8FAADPDQAw8AUAAKYRADDxBQAA0g0AMAtKAACYEQAwSwAAnBEAMOkFAACZEQAw6gUAAJoRADDrBQAAmxEAIOwFAADPDQAw7QUAAM8NADDuBQAAzw0AMO8FAADPDQAw8AUAAJ0RADDxBQAA0g0AMAtKAACPEQAwSwAAkxEAMOkFAACQEQAw6gUAAJERADDrBQAAkhEAIOwFAADICQAw7QUAAMgJADDuBQAAyAkAMO8FAADICQAw8AUAAJQRADDxBQAAywkAMAtKAACGEQAwSwAAihEAMOkFAACHEQAw6gUAAIgRADDrBQAAiREAIOwFAADICQAw7QUAAMgJADDuBQAAyAkAMO8FAADICQAw8AUAAIsRADDxBQAAywkAMAdKAACBEQAgSwAAhBEAIOkFAACCEQAg6gUAAIMRACDtBQAA0AEAIO4FAADQAQAg7wUAALYHACALSgAA-BAAMEsAAPwQADDpBQAA-RAAMOoFAAD6EAAw6wUAAPsQACDsBQAAlAsAMO0FAACUCwAw7gUAAJQLADDvBQAAlAsAMPAFAAD9EAAw8QUAAJcLADALSgAA7xAAMEsAAPMQADDpBQAA8BAAMOoFAADxEAAw6wUAAPIQACDsBQAAlAsAMO0FAACUCwAw7gUAAJQLADDvBQAAlAsAMPAFAAD0EAAw8QUAAJcLADAHSgAA6hAAIEsAAO0QACDpBQAA6xAAIOoFAADsEAAg7QUAANQBACDuBQAA1AEAIO8FAADwBQAgC0oAAN4QADBLAADjEAAw6QUAAN8QADDqBQAA4BAAMOsFAADhEAAg7AUAAOIQADDtBQAA4hAAMO4FAADiEAAw7wUAAOIQADDwBQAA5BAAMPEFAADlEAAwBckEAQAAAAHRBEAAAAAB0gRAAAAAAcUFAQAAAAHGBUAAAAABAgAAANgBACBKAADpEAAgAwAAANgBACBKAADpEAAgSwAA6BAAIAFDAACiEgAwCgMAAP0HACDGBAAA4wgAMMcEAADWAQAQyAQAAOMIADDJBAEAAAAB0AQBAAAAAdEEQAD8BwAh0gRAAPwHACHFBQEA-AcAIcYFQAD8BwAhAgAAANgBACBDAADoEAAgAgAAAOYQACBDAADnEAAgCcYEAADlEAAwxwQAAOYQABDIBAAA5RAAMMkEAQD4BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhxQUBAPgHACHGBUAA_AcAIQnGBAAA5RAAMMcEAADmEAAQyAQAAOUQADDJBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIcUFAQD4BwAhxgVAAPwHACEFyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhxQUBAKYJACHGBUAAqAkAIQXJBAEApgkAIdEEQACoCQAh0gRAAKgJACHFBQEApgkAIcYFQACoCQAhBckEAQAAAAHRBEAAAAAB0gRAAAAAAcUFAQAAAAHGBUAAAAABCMkEAQAAAAHRBEAAAAAB0gRAAAAAAd8EAQAAAAHgBAEAAAAB5QSAAAAAAecEIAAAAAGYBQAAxwsAIAIAAADwBQAgSgAA6hAAIAMAAADUAQAgSgAA6hAAIEsAAO4QACAKAAAA1AEAIEMAAO4QACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACHfBAEApgkAIeAEAQCmCQAh5QSAAAAAAecEIADoCgAhmAUAAMULACAIyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh3wQBAKYJACHgBAEApgkAIeUEgAAAAAHnBCAA6AoAIZgFAADFCwAgDh4AAMELACAhAACgCwAgIgAAoQsAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAfUEAQAAAAH_BAEAAAABgQUAAACXBQKCBQEAAAABgwVAAAAAAYQFQAAAAAGFBQEAAAABlwUBAAAAAQIAAABfACBKAAD3EAAgAwAAAF8AIEoAAPcQACBLAAD2EAAgAUMAAKESADACAAAAXwAgQwAA9hAAIAIAAACYCwAgQwAA9RAAIAvJBAEApgkAIdEEQACoCQAh0gRAAKgJACH1BAEApwkAIf8EAQCnCQAhgQUAAJoLlwUiggUBAKcJACGDBUAAzwkAIYQFQACoCQAhhQUBAKYJACGXBQEApgkAIQ4eAADACwAgIQAAnAsAICIAAJ0LACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH1BAEApwkAIf8EAQCnCQAhgQUAAJoLlwUiggUBAKcJACGDBUAAzwkAIYQFQACoCQAhhQUBAKYJACGXBQEApgkAIQ4eAADBCwAgIQAAoAsAICIAAKELACDJBAEAAAAB0QRAAAAAAdIEQAAAAAH1BAEAAAAB_wQBAAAAAYEFAAAAlwUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAZcFAQAAAAEOHgAAwQsAICEAAKALACAjAACiCwAgyQQBAAAAAdEEQAAAAAHSBEAAAAAB9QQBAAAAAf8EAQAAAAGBBQAAAJcFAoIFAQAAAAGDBUAAAAABhAVAAAAAAYUFAQAAAAGGBQEAAAABAgAAAF8AIEoAAIARACADAAAAXwAgSgAAgBEAIEsAAP8QACABQwAAoBIAMAIAAABfACBDAAD_EAAgAgAAAJgLACBDAAD-EAAgC8kEAQCmCQAh0QRAAKgJACHSBEAAqAkAIfUEAQCnCQAh_wQBAKcJACGBBQAAmguXBSKCBQEApwkAIYMFQADPCQAhhAVAAKgJACGFBQEApgkAIYYFAQCnCQAhDh4AAMALACAhAACcCwAgIwAAngsAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIfUEAQCnCQAh_wQBAKcJACGBBQAAmguXBSKCBQEApwkAIYMFQADPCQAhhAVAAKgJACGFBQEApgkAIYYFAQCnCQAhDh4AAMELACAhAACgCwAgIwAAogsAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAfUEAQAAAAH_BAEAAAABgQUAAACXBQKCBQEAAAABgwVAAAAAAYQFQAAAAAGFBQEAAAABhgUBAAAAAQzJBAEAAAAB0QRAAAAAAdIEQAAAAAHfBAEAAAAB4AQBAAAAAeEEAQAAAAHiBAEAAAAB4wQAAOoKACDkBAAA6woAIOUEgAAAAAHmBIAAAAAB5wQgAAAAAQIAAAC2BwAgSgAAgREAIAMAAADQAQAgSgAAgREAIEsAAIURACAOAAAA0AEAIEMAAIURACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACHfBAEApgkAIeAEAQCmCQAh4QQBAKYJACHiBAEApwkAIeMEAADmCgAg5AQAAOcKACDlBIAAAAAB5gSAAAAAAecEIADoCgAhDMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAId8EAQCmCQAh4AQBAKYJACHhBAEApgkAIeIEAQCnCQAh4wQAAOYKACDkBAAA5woAIOUEgAAAAAHmBIAAAAAB5wQgAOgKACESBwAA2gkAIAkAANsJACASAACBCwAgIQAA1wkAICoAANgJACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAd4EAQAAAAHzBAEAAAAB_wQBAAAAAYEFAAAAgQUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAQIAAACBAQAgSgAAjhEAIAMAAACBAQAgSgAAjhEAIEsAAI0RACABQwAAnxIAMAIAAACBAQAgQwAAjREAIAIAAADMCQAgQwAAjBEAIA3JBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh3gQBAKYJACHzBAEApwkAIf8EAQCnCQAhgQUAAM4JgQUiggUBAKcJACGDBUAAzwkAIYQFQACoCQAhhQUBAKYJACESBwAA1AkAIAkAANUJACASAACACwAgIQAA0QkAICoAANIJACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh3gQBAKYJACHzBAEApwkAIf8EAQCnCQAhgQUAAM4JgQUiggUBAKcJACGDBUAAzwkAIYQFQACoCQAhhQUBAKYJACESBwAA2gkAIAkAANsJACASAACBCwAgIQAA1wkAICoAANgJACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAd4EAQAAAAHzBAEAAAAB_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-AcAIdEEQAD8BwAh0gRAAPwHACHJBQEA-AcAIcoFAQD4BwAhywUBAPkHACHMBQEA-QcAIc0FAQD5BwAhzgVAAOYIACHPBUAA5ggAIdAFAQD5BwAh0QUBAPkHACECAAAACQAgQwAA0REAIAIAAADPEQAgQwAA0BEAIBDGBAAAzhEAMMcEAADPEQAQyAQAAM4RADDJBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIckFAQD4BwAhygUBAPgHACHLBQEA-QcAIcwFAQD5BwAhzQUBAPkHACHOBUAA5ggAIc8FQADmCAAh0AUBAPkHACHRBQEA-QcAIRDGBAAAzhEAMMcEAADPEQAQyAQAAM4RADDJBAEA-AcAIdAEAQD4BwAh0QRAAPwHACHSBEAA_AcAIckFAQD4BwAhygUBAPgHACHLBQEA-QcAIcwFAQD5BwAhzQUBAPkHACHOBUAA5ggAIc8FQADmCAAh0AUBAPkHACHRBQEA-QcAIQzJBAEApgkAIdEEQACoCQAh0gRAAKgJACHJBQEApgkAIcoFAQCmCQAhywUBAKcJACHMBQEApwkAIc0FAQCnCQAhzgVAAM8JACHPBUAAzwkAIdAFAQCnCQAh0QUBAKcJACEMyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhyQUBAKYJACHKBQEApgkAIcsFAQCnCQAhzAUBAKcJACHNBQEApwkAIc4FQADPCQAhzwVAAM8JACHQBQEApwkAIdEFAQCnCQAhDMkEAQAAAAHRBEAAAAAB0gRAAAAAAckFAQAAAAHKBQEAAAABywUBAAAAAcwFAQAAAAHNBQEAAAABzgVAAAAAAc8FQAAAAAHQBQEAAAAB0QUBAAAAAQfJBAEAAAAB0QRAAAAAAdIEQAAAAAHGBUAAAAAB0gUBAAAAAdMFAQAAAAHUBQEAAAABAgAAAAUAIEoAAN4RACADAAAABQAgSgAA3hEAIEsAAN0RACABQwAAkhIAMAwDAAD9BwAgxgQAAKEJADDHBAAAAwAQyAQAAKEJADDJBAEAAAAB0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhxgVAAPwHACHSBQEAAAAB0wUBAPkHACHUBQEA-QcAIQIAAAAFACBDAADdEQAgAgAAANsRACBDAADcEQAgC8YEAADaEQAwxwQAANsRABDIBAAA2hEAMMkEAQD4BwAh0AQBAPgHACHRBEAA_AcAIdIEQAD8BwAhxgVAAPwHACHSBQEA-AcAIdMFAQD5BwAh1AUBAPkHACELxgQAANoRADDHBAAA2xEAEMgEAADaEQAwyQQBAPgHACHQBAEA-AcAIdEEQAD8BwAh0gRAAPwHACHGBUAA_AcAIdIFAQD4BwAh0wUBAPkHACHUBQEA-QcAIQfJBAEApgkAIdEEQACoCQAh0gRAAKgJACHGBUAAqAkAIdIFAQCmCQAh0wUBAKcJACHUBQEApwkAIQfJBAEApgkAIdEEQACoCQAh0gRAAKgJACHGBUAAqAkAIdIFAQCmCQAh0wUBAKcJACHUBQEApwkAIQfJBAEAAAAB0QRAAAAAAdIEQAAAAAHGBUAAAAAB0gUBAAAAAdMFAQAAAAHUBQEAAAABBEoAANMRADDpBQAA1BEAMOsFAADWEQAg7wUAANcRADAESgAAxxEAMOkFAADIEQAw6wUAAMoRACDvBQAAyxEAMARKAAC8EQAw6QUAAL0RADDrBQAAvxEAIO8FAACFDgAwBEoAALMRADDpBQAAtBEAMOsFAAC2EQAg7wUAAPkNADAESgAAqhEAMOkFAACrEQAw6wUAAK0RACDvBQAA7Q0AMARKAAChEQAw6QUAAKIRADDrBQAApBEAIO8FAADPDQAwBEoAAJgRADDpBQAAmREAMOsFAACbEQAg7wUAAM8NADAESgAAjxEAMOkFAACQEQAw6wUAAJIRACDvBQAAyAkAMARKAACGEQAw6QUAAIcRADDrBQAAiREAIO8FAADICQAwA0oAAIERACDpBQAAghEAIO8FAAC2BwAgBEoAAPgQADDpBQAA-RAAMOsFAAD7EAAg7wUAAJQLADAESgAA7xAAMOkFAADwEAAw6wUAAPIQACDvBQAAlAsAMANKAADqEAAg6QUAAOsQACDvBQAA8AUAIARKAADeEAAw6QUAAN8QADDrBQAA4RAAIO8FAADiEAAwAAACKgAA7QoAIOIEAACiCQAgASIAAO0KACAAAAAABUoAAI0SACBLAACQEgAg6QUAAI4SACDqBQAAjxIAIO8FAAAoACADSgAAjRIAIOkFAACOEgAg7wUAACgAIAAAABQGAACXEAAgFQAAjgwAIBcAAJoQACAZAACNDAAgJQAAkxAAICYAAJQQACAnAACWEAAgKAAAmBAAICkAAJkQACArAACIDQAgLAAAnBAAIC0AAJ0QACAuAACeEAAgMAAAkhAAIDEAAJUQACA0AACbEAAg_QQAAKIJACCfBQAAogkAILUFAACiCQAguAUAAKIJACANBwAA-hEAIAkAAP0RACAKAACKEgAgCwAApwwAIBEAAIgSACASAAD8EQAgEwAAiRIAIBQAAIQSACAWAACDEgAgGgAAgRIAIB4AAIASACDPBAAAogkAILEFAACiCQAgCQMAAO0KACAHAAD6EQAgCQAA_REAIBUAAI4MACAXAACaEAAgGAAAnBAAIDUAAIgNACA2AACeEAAgzQQAAKIJACAQCAAAixIAIBUAAI4MACAXAACaEAAgGQAAjQwAICUAAJMQACAmAACUEAAgJwAAlhAAICgAAJgQACApAACZEAAgKwAAiA0AICwAAJwQACAtAACdEAAgLgAAnhAAIJ8FAACiCQAgsAUAAKIJACC1BQAAogkAIAUgAACIDQAgzwQAAKIJACCtBQAAogkAILAFAACiCQAgsQUAAKIJACAFIAAA9wwAIM8EAACiCQAgrQUAAKIJACCwBQAAogkAILEFAACiCQAgCAMAAO0KACAHAAD6EQAgCQAA_REAIBUAAI4MACAfAACdEAAgJAAA9wwAIM0EAACiCQAgzwQAAKIJACACFQAAjgwAIBkAAI0MACAFBwAA-hEAIAkAAP0RACAZAACNDAAgzwQAAKIJACCfBQAAogkAIAsHAAD6EQAgCQAA_REAIBUAAI4MACAXAACaEAAgGAAAnBAAIBoAAIESACAbAACCEgAgzwQAAKIJACCfBQAAogkAIKAFAACiCQAgogUAAKIJACAIBwAA-hEAIAkAAP0RACAKAACKEgAgFQAAjgwAIBcAAJoQACCfBQAAogkAIKsFAACiCQAgsQUAAKIJACAIBwAA-hEAIAkAAP0RACASAAD8EQAgFgAAgxIAIBwAAJ0QACDPBAAAogkAIPsEAACiCQAg_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_BAEAAAABgQUAAACBBQKCBQEAAAABgwVAAAAAAYQFQAAAAAGFBQEAAAABC8kEAQAAAAHRBEAAAAAB0gRAAAAAAfUEAQAAAAH_BAEAAAABgQUAAACXBQKCBQEAAAABgwVAAAAAAYQFQAAAAAGFBQEAAAABhgUBAAAAAQvJBAEAAAAB0QRAAAAAAdIEQAAAAAH1BAEAAAAB_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_QQAAAC3BQOZBQEAAAABnwUBAAAAAbUFAQAAAAG4BQEAAAABAgAAAJQEACBKAACyEgAgAwAAABYAIEoAALISACBLAAC2EgAgGQAAABYAIAYAAJ0NACAVAACgDQAgFwAAoQ0AIBkAAJsNACAlAACYDQAgJgAAmQ0AICcAAJwNACAoAACeDQAgKQAAnw0AICsAAKMNACAsAACkDQAgLQAApQ0AIC4AAKYNACAwAACXDQAgNAAAog0AIEMAALYSACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH9BAAAjA23BSOZBQEApgkAIZ8FAQCnCQAhtQUBAKcJACG4BQEApwkAIRcGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJQAAmA0AICYAAJkNACAnAACcDQAgKAAAng0AICkAAJ8NACArAACjDQAgLAAApA0AIC0AAKUNACAuAACmDQAgMAAAlw0AIDQAAKINACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH9BAAAjA23BSOZBQEApgkAIZ8FAQCnCQAhtQUBAKcJACG4BQEApwkAIQgHAACjEAAgyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAG1BQEAAAABvAUBAAAAAQIAAAAUACBKAAC3EgAgAwAAABIAIEoAALcSACBLAAC7EgAgCgAAABIAIAcAAKIQACBDAAC7EgAgyQQBAKYJACHOBAEApwkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbUFAQCnCQAhvAUBAKYJACEIBwAAohAAIMkEAQCmCQAhzgQBAKcJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACG1BQEApwkAIbwFAQCmCQAhFwYAAIgQACAVAACLEAAgFwAAjBAAIBkAAIYQACAlAACDEAAgJgAAhBAAICcAAIcQACAoAACJEAAgKQAAihAAICsAAI4QACAsAACPEAAgLQAAkBAAIC4AAJEQACAxAACFEAAgNAAAjRAAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAf0EAAAAtwUDmQUBAAAAAZ8FAQAAAAG1BQEAAAABuAUBAAAAAQIAAACUBAAgSgAAvBIAIAMAAAAWACBKAAC8EgAgSwAAwBIAIBkAAAAWACAGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJQAAmA0AICYAAJkNACAnAACcDQAgKAAAng0AICkAAJ8NACArAACjDQAgLAAApA0AIC0AAKUNACAuAACmDQAgMQAAmg0AIDQAAKINACBDAADAEgAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACEXBgAAnQ0AIBUAAKANACAXAAChDQAgGQAAmw0AICUAAJgNACAmAACZDQAgJwAAnA0AICgAAJ4NACApAACfDQAgKwAAow0AICwAAKQNACAtAAClDQAgLgAApg0AIDEAAJoNACA0AACiDQAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACEKyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGfBQEAAAABqQUBAAAAAaoFQAAAAAGrBQgAAAABrAUIAAAAARcGAACIEAAgFQAAixAAIBcAAIwQACAZAACGEAAgJQAAgxAAICcAAIcQACAoAACJEAAgKQAAihAAICsAAI4QACAsAACPEAAgLQAAkBAAIC4AAJEQACAwAACCEAAgMQAAhRAAIDQAAI0QACDJBAEAAAAB0QRAAAAAAdIEQAAAAAH9BAAAALcFA5kFAQAAAAGfBQEAAAABtQUBAAAAAbgFAQAAAAECAAAAlAQAIEoAAMISACADAAAAFgAgSgAAwhIAIEsAAMYSACAZAAAAFgAgBgAAnQ0AIBUAAKANACAXAAChDQAgGQAAmw0AICUAAJgNACAnAACcDQAgKAAAng0AICkAAJ8NACArAACjDQAgLAAApA0AIC0AAKUNACAuAACmDQAgMAAAlw0AIDEAAJoNACA0AACiDQAgQwAAxhIAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIf0EAACMDbcFI5kFAQCmCQAhnwUBAKcJACG1BQEApwkAIbgFAQCnCQAhFwYAAJ0NACAVAACgDQAgFwAAoQ0AIBkAAJsNACAlAACYDQAgJwAAnA0AICgAAJ4NACApAACfDQAgKwAAow0AICwAAKQNACAtAAClDQAgLgAApg0AIDAAAJcNACAxAACaDQAgNAAAog0AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIf0EAACMDbcFI5kFAQCmCQAhnwUBAKcJACG1BQEApwkAIbgFAQCnCQAhBskEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAABnwUBAAAAAQnJBAEAAAABzgQBAAAAAdEEQAAAAAHSBEAAAAABnwUBAAAAAasFAgAAAAGxBQEAAAABvgUBAAAAAb8FAQAAAAEJyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABoAUCAAAAAaEFAQAAAAGiBQEAAAABCckEAQAAAAHKBAEAAAABywQBAAAAAcwEAQAAAAHNBAEAAAABzgQBAAAAAdAEAQAAAAHRBEAAAAAB0gRAAAAAAQfJBAEAAAABzQQBAAAAAc4EAQAAAAHQBAEAAAAB0QRAAAAAAdIEQAAAAAGVBQEAAAABC8kEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABB8kEAQAAAAHOBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAENyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAd4EAQAAAAHzBAEAAAAB_wQBAAAAAYEFAAAAgQUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAYYFAQAAAAEKyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHzBAEAAAAB-gQBAAAAAfsEAQAAAAH9BAAAAP0EAv4EQAAAAAEKyQQBAAAAAc4EAQAAAAHRBEAAAAAB0gRAAAAAAfQEAQAAAAH1BAEAAAAB9gQBAAAAAfcEAQAAAAH4BAEAAAAB-QRAAAAAARPJBAEAAAABzgQBAAAAAdEEQAAAAAHSBEAAAAAB8wQBAAAAAYcFAQAAAAGIBQgAAAABiQUIAAAAAYoFCAAAAAGLBQgAAAABjAUIAAAAAY0FCAAAAAGOBQgAAAABjwUIAAAAAZAFCAAAAAGRBQgAAAABkgUIAAAAAZMFCAAAAAGUBQgAAAABBskEAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAG1BQEAAAABvAUBAAAAAQbJBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABtQUBAAAAAbwFAQAAAAEKyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGfBQEAAAABqQUBAAAAAaoFQAAAAAGrBQgAAAABrAUIAAAAARMIAACoEAAgFQAA-g8AIBcAAPsPACAZAAD3DwAgJQAA9A8AICcAAPYPACAoAAD4DwAgKQAA-Q8AICsAAPwPACAsAAD9DwAgLQAA_g8AIC4AAP8PACDJBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABsAUBAAAAAbUFAQAAAAG8BQEAAAABAgAAABoAIEoAANUSACAJyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAABnwUBAAAAAaAFAgAAAAGhBQEAAAABAwAAABgAIEoAANUSACBLAADaEgAgFQAAABgAIAgAAKcQACAVAAD_DgAgFwAAgA8AIBkAAPwOACAlAAD5DgAgJwAA-w4AICgAAP0OACApAAD-DgAgKwAAgQ8AICwAAIIPACAtAACDDwAgLgAAhA8AIEMAANoSACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIRMIAACnEAAgFQAA_w4AIBcAAIAPACAZAAD8DgAgJQAA-Q4AICcAAPsOACAoAAD9DgAgKQAA_g4AICsAAIEPACAsAACCDwAgLQAAgw8AIC4AAIQPACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIQbJBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAZ8FAQAAAAEIyQQBAAAAAdEEQAAAAAHSBEAAAAABhwUBAAAAAZkFAQAAAAGfBQEAAAABpgUBAAAAAacFAQAAAAEIyQQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAcAFAQAAAAHBBQEAAAABwgUCAAAAAcQFAAAAxAUCCckEAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAABnwUBAAAAAaAFAgAAAAGhBQEAAAABogUBAAAAAQ4HAADlDAAgCQAA5gwAIBUAAOQMACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGfBQEAAAABqQUBAAAAAaoFQAAAAAGrBQgAAAABrAUIAAAAAQIAAAAfACBKAADfEgAgAwAAAB0AIEoAAN8SACBLAADjEgAgEAAAAB0AIAcAALIMACAJAACzDAAgFQAAsQwAIEMAAOMSACDJBAEApgkAIc4EAQCmCQAhzwQBAKYJACHRBEAAqAkAIdIEQACoCQAh-gQBAKYJACGfBQEApwkAIakFAQCnCQAhqgVAAM8JACGrBQgAuwkAIawFCAC7CQAhDgcAALIMACAJAACzDAAgFQAAsQwAIMkEAQCmCQAhzgQBAKYJACHPBAEApgkAIdEEQACoCQAh0gRAAKgJACH6BAEApgkAIZ8FAQCnCQAhqQUBAKcJACGqBUAAzwkAIasFCAC7CQAhrAUIALsJACEJyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGrBQIAAAABsQUBAAAAAb4FAQAAAAG_BQEAAAABHAQAAN8RACAFAADgEQAgEgAA4hEAIB4AAOMRACArAADmEQAgNAAA5BEAIDcAAOURACA4AADnEQAgOQAA6BEAIDoAAOkRACA7AADqEQAgPAAA6xEAID0AAOwRACDJBAEAAAABzQQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAdUFAQAAAAHWBSAAAAAB1wUBAAAAAdgFAQAAAAHZBQEAAAAB2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAECAAAAkQIAIEoAAOUSACADAAAAYwAgSgAA5RIAIEsAAOkSACAeAAAAYwAgBAAA0BAAIAUAANEQACASAADTEAAgHgAA1BAAICsAANcQACA0AADVEAAgNwAA1hAAIDgAANgQACA5AADZEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIEMAAOkSACDJBAEApgkAIc0EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAh1QUBAKYJACHWBSAA6AoAIdcFAQCnCQAh2AUBAKcJACHZBQEApwkAIdoFAQCnCQAh2wUBAKcJACHcBQEApwkAId0FAQCmCQAh3gUBAKYJACEcBAAA0BAAIAUAANEQACASAADTEAAgHgAA1BAAICsAANcQACA0AADVEAAgNwAA1hAAIDgAANgQACA5AADZEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIMkEAQCmCQAhzQQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACHVBQEApgkAIdYFIADoCgAh1wUBAKcJACHYBQEApwkAIdkFAQCnCQAh2gUBAKcJACHbBQEApwkAIdwFAQCnCQAh3QUBAKYJACHeBQEApgkAIQXJBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAAB3QUAAADiBQIJyQQBAAAAAcoEAQAAAAHLBAEAAAABzAQBAAAAAc0EAQAAAAHPBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAABB8kEAQAAAAHNBAEAAAABzwQBAAAAAdAEAQAAAAHRBEAAAAAB0gRAAAAAAZUFAQAAAAELyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHyBAEAAAAB8wQBAAAAAfUEAQAAAAGhBQEAAAABsQUBAAAAAb0FQAAAAAEHyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHyBAEAAAAB8wQBAAAAAQ3JBAEAAAAB0QRAAAAAAdIEQAAAAAGBBQAAALoFAoMFQAAAAAGfBQEAAAABswUBAAAAAbQFAQAAAAG1BQEAAAABtwUAAAC3BQO4BQEAAAABugUBAAAAAbsFAQAAAAENyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAd4EAQAAAAHzBAEAAAAB_wQBAAAAAYEFAAAAgQUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAYYFAQAAAAEKyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHzBAEAAAAB-gQBAAAAAfsEAQAAAAH9BAAAAP0EAv4EQAAAAAEKyQQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfQEAQAAAAH1BAEAAAAB9gQBAAAAAfcEAQAAAAH4BAEAAAAB-QRAAAAAARPJBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8wQBAAAAAYcFAQAAAAGIBQgAAAABiQUIAAAAAYoFCAAAAAGLBQgAAAABjAUIAAAAAY0FCAAAAAGOBQgAAAABjwUIAAAAAZAFCAAAAAGRBQgAAAABkgUIAAAAAZMFCAAAAAGUBQgAAAABFwYAAIgQACAVAACLEAAgFwAAjBAAIBkAAIYQACAlAACDEAAgJgAAhBAAICcAAIcQACAoAACJEAAgKQAAihAAICsAAI4QACAsAACPEAAgLQAAkBAAIC4AAJEQACAwAACCEAAgMQAAhRAAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAf0EAAAAtwUDmQUBAAAAAZ8FAQAAAAG1BQEAAAABuAUBAAAAAQIAAACUBAAgSgAA9BIAIBwEAADfEQAgBQAA4BEAIAYAAOERACASAADiEQAgHgAA4xEAICsAAOYRACA0AADkEQAgOAAA5xEAIDkAAOgRACA6AADpEQAgOwAA6hEAIDwAAOsRACA9AADsEQAgyQQBAAAAAc0EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAHVBQEAAAAB1gUgAAAAAdcFAQAAAAHYBQEAAAAB2QUBAAAAAdoFAQAAAAHbBQEAAAAB3AUBAAAAAd0FAQAAAAHeBQEAAAABAgAAAJECACBKAAD2EgAgHAQAAN8RACAFAADgEQAgBgAA4REAIBIAAOIRACAeAADjEQAgKwAA5hEAIDcAAOURACA4AADnEQAgOQAA6BEAIDoAAOkRACA7AADqEQAgPAAA6xEAID0AAOwRACDJBAEAAAABzQQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAdUFAQAAAAHWBSAAAAAB1wUBAAAAAdgFAQAAAAHZBQEAAAAB2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAECAAAAkQIAIEoAAPgSACADAAAAFgAgSgAA9BIAIEsAAPwSACAZAAAAFgAgBgAAnQ0AIBUAAKANACAXAAChDQAgGQAAmw0AICUAAJgNACAmAACZDQAgJwAAnA0AICgAAJ4NACApAACfDQAgKwAAow0AICwAAKQNACAtAAClDQAgLgAApg0AIDAAAJcNACAxAACaDQAgQwAA_BIAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIf0EAACMDbcFI5kFAQCmCQAhnwUBAKcJACG1BQEApwkAIbgFAQCnCQAhFwYAAJ0NACAVAACgDQAgFwAAoQ0AIBkAAJsNACAlAACYDQAgJgAAmQ0AICcAAJwNACAoAACeDQAgKQAAnw0AICsAAKMNACAsAACkDQAgLQAApQ0AIC4AAKYNACAwAACXDQAgMQAAmg0AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIf0EAACMDbcFI5kFAQCmCQAhnwUBAKcJACG1BQEApwkAIbgFAQCnCQAhAwAAAGMAIEoAAPYSACBLAAD_EgAgHgAAAGMAIAQAANAQACAFAADREAAgBgAA0hAAIBIAANMQACAeAADUEAAgKwAA1xAAIDQAANUQACA4AADYEAAgOQAA2RAAIDoAANoQACA7AADbEAAgPAAA3BAAID0AAN0QACBDAAD_EgAgyQQBAKYJACHNBAEApwkAIdEEQACoCQAh0gRAAKgJACGZBQEApgkAIdUFAQCmCQAh1gUgAOgKACHXBQEApwkAIdgFAQCnCQAh2QUBAKcJACHaBQEApwkAIdsFAQCnCQAh3AUBAKcJACHdBQEApgkAId4FAQCmCQAhHAQAANAQACAFAADREAAgBgAA0hAAIBIAANMQACAeAADUEAAgKwAA1xAAIDQAANUQACA4AADYEAAgOQAA2RAAIDoAANoQACA7AADbEAAgPAAA3BAAID0AAN0QACDJBAEApgkAIc0EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAh1QUBAKYJACHWBSAA6AoAIdcFAQCnCQAh2AUBAKcJACHZBQEApwkAIdoFAQCnCQAh2wUBAKcJACHcBQEApwkAId0FAQCmCQAh3gUBAKYJACEDAAAAYwAgSgAA-BIAIEsAAIITACAeAAAAYwAgBAAA0BAAIAUAANEQACAGAADSEAAgEgAA0xAAIB4AANQQACArAADXEAAgNwAA1hAAIDgAANgQACA5AADZEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIEMAAIITACDJBAEApgkAIc0EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAh1QUBAKYJACHWBSAA6AoAIdcFAQCnCQAh2AUBAKcJACHZBQEApwkAIdoFAQCnCQAh2wUBAKcJACHcBQEApwkAId0FAQCmCQAh3gUBAKYJACEcBAAA0BAAIAUAANEQACAGAADSEAAgEgAA0xAAIB4AANQQACArAADXEAAgNwAA1hAAIDgAANgQACA5AADZEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIMkEAQCmCQAhzQQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACHVBQEApgkAIdYFIADoCgAh1wUBAKcJACHYBQEApwkAIdkFAQCnCQAh2gUBAKcJACHbBQEApwkAIdwFAQCnCQAh3QUBAKYJACHeBQEApgkAIQ3JBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAd4EAQAAAAHzBAEAAAAB_wQBAAAAAYEFAAAAgQUCggUBAAAAAYMFQAAAAAGEBUAAAAABhgUBAAAAAQvJBAEAAAAB0QRAAAAAAdIEQAAAAAH1BAEAAAAB_wQBAAAAAYEFAAAAlwUCggUBAAAAAYMFQAAAAAGEBUAAAAABhgUBAAAAAZcFAQAAAAETCAAAqBAAIBUAAPoPACAXAAD7DwAgGQAA9w8AICYAAPUPACAnAAD2DwAgKAAA-A8AICkAAPkPACArAAD8DwAgLAAA_Q8AIC0AAP4PACAuAAD_DwAgyQQBAAAAAdEEQAAAAAHSBEAAAAABnwUBAAAAAbAFAQAAAAG1BQEAAAABvAUBAAAAAQIAAAAaACBKAACFEwAgFwYAAIgQACAVAACLEAAgFwAAjBAAIBkAAIYQACAmAACEEAAgJwAAhxAAICgAAIkQACApAACKEAAgKwAAjhAAICwAAI8QACAtAACQEAAgLgAAkRAAIDAAAIIQACAxAACFEAAgNAAAjRAAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAf0EAAAAtwUDmQUBAAAAAZ8FAQAAAAG1BQEAAAABuAUBAAAAAQIAAACUBAAgSgAAhxMAIBMIAACoEAAgFQAA-g8AIBcAAPsPACAZAAD3DwAgJQAA9A8AICYAAPUPACAoAAD4DwAgKQAA-Q8AICsAAPwPACAsAAD9DwAgLQAA_g8AIC4AAP8PACDJBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABsAUBAAAAAbUFAQAAAAG8BQEAAAABAgAAABoAIEoAAIkTACAXBgAAiBAAIBUAAIsQACAXAACMEAAgGQAAhhAAICUAAIMQACAmAACEEAAgKAAAiRAAICkAAIoQACArAACOEAAgLAAAjxAAIC0AAJAQACAuAACREAAgMAAAghAAIDEAAIUQACA0AACNEAAgyQQBAAAAAdEEQAAAAAHSBEAAAAAB_QQAAAC3BQOZBQEAAAABnwUBAAAAAbUFAQAAAAG4BQEAAAABAgAAAJQEACBKAACLEwAgC8kEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABB8kEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8QQBAAAAAfMEAQAAAAEDAAAAGAAgSgAAiRMAIEsAAJETACAVAAAAGAAgCAAApxAAIBUAAP8OACAXAACADwAgGQAA_A4AICUAAPkOACAmAAD6DgAgKAAA_Q4AICkAAP4OACArAACBDwAgLAAAgg8AIC0AAIMPACAuAACEDwAgQwAAkRMAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhsAUBAKcJACG1BQEApwkAIbwFAQCmCQAhEwgAAKcQACAVAAD_DgAgFwAAgA8AIBkAAPwOACAlAAD5DgAgJgAA-g4AICgAAP0OACApAAD-DgAgKwAAgQ8AICwAAIIPACAtAACDDwAgLgAAhA8AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhsAUBAKcJACG1BQEApwkAIbwFAQCmCQAhAwAAABYAIEoAAIsTACBLAACUEwAgGQAAABYAIAYAAJ0NACAVAACgDQAgFwAAoQ0AIBkAAJsNACAlAACYDQAgJgAAmQ0AICgAAJ4NACApAACfDQAgKwAAow0AICwAAKQNACAtAAClDQAgLgAApg0AIDAAAJcNACAxAACaDQAgNAAAog0AIEMAAJQTACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH9BAAAjA23BSOZBQEApgkAIZ8FAQCnCQAhtQUBAKcJACG4BQEApwkAIRcGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJQAAmA0AICYAAJkNACAoAACeDQAgKQAAnw0AICsAAKMNACAsAACkDQAgLQAApQ0AIC4AAKYNACAwAACXDQAgMQAAmg0AIDQAAKINACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH9BAAAjA23BSOZBQEApgkAIZ8FAQCnCQAhtQUBAKcJACG4BQEApwkAIQnJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGrBQIAAAABvgUBAAAAAb8FAQAAAAELyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAb0FQAAAAAEDAAAAGAAgSgAAhRMAIEsAAJkTACAVAAAAGAAgCAAApxAAIBUAAP8OACAXAACADwAgGQAA_A4AICYAAPoOACAnAAD7DgAgKAAA_Q4AICkAAP4OACArAACBDwAgLAAAgg8AIC0AAIMPACAuAACEDwAgQwAAmRMAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhsAUBAKcJACG1BQEApwkAIbwFAQCmCQAhEwgAAKcQACAVAAD_DgAgFwAAgA8AIBkAAPwOACAmAAD6DgAgJwAA-w4AICgAAP0OACApAAD-DgAgKwAAgQ8AICwAAIIPACAtAACDDwAgLgAAhA8AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhsAUBAKcJACG1BQEApwkAIbwFAQCmCQAhAwAAABYAIEoAAIcTACBLAACcEwAgGQAAABYAIAYAAJ0NACAVAACgDQAgFwAAoQ0AIBkAAJsNACAmAACZDQAgJwAAnA0AICgAAJ4NACApAACfDQAgKwAAow0AICwAAKQNACAtAAClDQAgLgAApg0AIDAAAJcNACAxAACaDQAgNAAAog0AIEMAAJwTACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH9BAAAjA23BSOZBQEApgkAIZ8FAQCnCQAhtQUBAKcJACG4BQEApwkAIRcGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJgAAmQ0AICcAAJwNACAoAACeDQAgKQAAnw0AICsAAKMNACAsAACkDQAgLQAApQ0AIC4AAKYNACAwAACXDQAgMQAAmg0AIDQAAKINACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH9BAAAjA23BSOZBQEApgkAIZ8FAQCnCQAhtQUBAKcJACG4BQEApwkAIRYHAADaCgAgCQAA1woAIAoAANgKACARAADSCgAgEgAAtgsAIBMAANMKACAUAADUCgAgFgAA1goAIBoAANkKACAeAADVCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABAgAAACgAIEoAAJ0TACADAAAAJgAgSgAAnRMAIEsAAKETACAYAAAAJgAgBwAAqwoAIAkAAKgKACAKAACpCgAgEQAAowoAIBIAALQLACATAACkCgAgFAAApQoAIBYAAKcKACAaAACqCgAgHgAApgoAIEMAAKETACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8QQBAKYJACHyBAEApgkAIfMEAQCmCQAh9QQBAKYJACGhBQEApgkAIbEFAQCnCQAhvQVAAKgJACEWBwAAqwoAIAkAAKgKACAKAACpCgAgEQAAowoAIBIAALQLACATAACkCgAgFAAApQoAIBYAAKcKACAaAACqCgAgHgAApgoAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh8wQBAKYJACH1BAEApgkAIaEFAQCmCQAhsQUBAKcJACG9BUAAqAkAIQjJBAEAAAAB0QRAAAAAAdIEQAAAAAGHBQEAAAABmQUBAAAAAZ8FAQAAAAGmBQEAAAABqAUBAAAAAQYVAACMDAAgyQQBAAAAAc4EAQAAAAGZBQEAAAABmgVAAAAAAZsFQAAAAAECAAAA1wUAIEoAAKMTACADAAAA2gUAIEoAAKMTACBLAACnEwAgCAAAANoFACAVAADNCwAgQwAApxMAIMkEAQCmCQAhzgQBAKYJACGZBQEApgkAIZoFQACoCQAhmwVAAKgJACEGFQAAzQsAIMkEAQCmCQAhzgQBAKYJACGZBQEApgkAIZoFQACoCQAhmwVAAKgJACEJBwAA6Q8AIAkAANQOACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABAgAAAHUAIEoAAKgTACATCAAAqBAAIBUAAPoPACAXAAD7DwAgJQAA9A8AICYAAPUPACAnAAD2DwAgKAAA-A8AICkAAPkPACArAAD8DwAgLAAA_Q8AIC0AAP4PACAuAAD_DwAgyQQBAAAAAdEEQAAAAAHSBEAAAAABnwUBAAAAAbAFAQAAAAG1BQEAAAABvAUBAAAAAQIAAAAaACBKAACqEwAgFwYAAIgQACAVAACLEAAgFwAAjBAAICUAAIMQACAmAACEEAAgJwAAhxAAICgAAIkQACApAACKEAAgKwAAjhAAICwAAI8QACAtAACQEAAgLgAAkRAAIDAAAIIQACAxAACFEAAgNAAAjRAAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAf0EAAAAtwUDmQUBAAAAAZ8FAQAAAAG1BQEAAAABuAUBAAAAAQIAAACUBAAgSgAArBMAIAvJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfIEAQAAAAHzBAEAAAAB9QQBAAAAAaEFAQAAAAGxBQEAAAABvQVAAAAAAQfJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfIEAQAAAAHzBAEAAAABCskEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAAB8wQBAAAAAfoEAQAAAAH7BAEAAAAB_QQAAAD9BAL-BEAAAAABAwAAAFEAIEoAAKgTACBLAACzEwAgCwAAAFEAIAcAAOcPACAJAADIDgAgQwAAsxMAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACGZBQEApgkAIZ8FAQCnCQAhCQcAAOcPACAJAADIDgAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAhnwUBAKcJACEDAAAAGAAgSgAAqhMAIEsAALYTACAVAAAAGAAgCAAApxAAIBUAAP8OACAXAACADwAgJQAA-Q4AICYAAPoOACAnAAD7DgAgKAAA_Q4AICkAAP4OACArAACBDwAgLAAAgg8AIC0AAIMPACAuAACEDwAgQwAAthMAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhsAUBAKcJACG1BQEApwkAIbwFAQCmCQAhEwgAAKcQACAVAAD_DgAgFwAAgA8AICUAAPkOACAmAAD6DgAgJwAA-w4AICgAAP0OACApAAD-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_A8AICwAAP0PACAtAAD-DwAgLgAA_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_DgAgFwAAgA8AIBkAAPwOACAlAAD5DgAgJgAA-g4AICcAAPsOACAoAAD9DgAgKwAAgQ8AICwAAIIPACAtAACDDwAgLgAAhA8AIEMAAOgTACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIRMIAACnEAAgFQAA_w4AIBcAAIAPACAZAAD8DgAgJQAA-Q4AICYAAPoOACAnAAD7DgAgKAAA_Q4AICsAAIEPACAsAACCDwAgLQAAgw8AIC4AAIQPACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIQMAAAAWACBKAADKEwAgSwAA6xMAIBkAAAAWACAGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJQAAmA0AICYAAJkNACAnAACcDQAgKAAAng0AICsAAKMNACAsAACkDQAgLQAApQ0AIC4AAKYNACAwAACXDQAgMQAAmg0AIDQAAKINACBDAADrEwAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACEXBgAAnQ0AIBUAAKANACAXAAChDQAgGQAAmw0AICUAAJgNACAmAACZDQAgJwAAnA0AICgAAJ4NACArAACjDQAgLAAApA0AIC0AAKUNACAuAACmDQAgMAAAlw0AIDEAAJoNACA0AACiDQAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACERAwAA4goAIAcAANsKACAJAADhCgAgFQAA3AoAIBcAAN0KACAYAADeCgAgNgAA4AoAIMkEAQAAAAHKBAEAAAABywQBAAAAAcwEAQAAAAHNBAEAAAABzgQBAAAAAc8EAQAAAAHQBAEAAAAB0QRAAAAAAdIEQAAAAAECAAAAEAAgSgAA7BMAIAMAAAAOACBKAADsEwAgSwAA8BMAIBMAAAAOACADAACwCQAgBwAAqQkAIAkAAK8JACAVAACqCQAgFwAAqwkAIBgAAKwJACA2AACuCQAgQwAA8BMAIMkEAQCmCQAhygQBAKYJACHLBAEApgkAIcwEAQCmCQAhzQQBAKcJACHOBAEApgkAIc8EAQCmCQAh0AQBAKYJACHRBEAAqAkAIdIEQACoCQAhEQMAALAJACAHAACpCQAgCQAArwkAIBUAAKoJACAXAACrCQAgGAAArAkAIDYAAK4JACDJBAEApgkAIcoEAQCmCQAhywQBAKYJACHMBAEApgkAIc0EAQCnCQAhzgQBAKYJACHPBAEApgkAIdAEAQCmCQAh0QRAAKgJACHSBEAAqAkAIREDAADiCgAgBwAA2woAIAkAAOEKACAVAADcCgAgFwAA3QoAIDUAAN8KACA2AADgCgAgyQQBAAAAAcoEAQAAAAHLBAEAAAABzAQBAAAAAc0EAQAAAAHOBAEAAAABzwQBAAAAAdAEAQAAAAHRBEAAAAAB0gRAAAAAAQIAAAAQACBKAADxEwAgAwAAAA4AIEoAAPETACBLAAD1EwAgEwAAAA4AIAMAALAJACAHAACpCQAgCQAArwkAIBUAAKoJACAXAACrCQAgNQAArQkAIDYAAK4JACBDAAD1EwAgyQQBAKYJACHKBAEApgkAIcsEAQCmCQAhzAQBAKYJACHNBAEApwkAIc4EAQCmCQAhzwQBAKYJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACERAwAAsAkAIAcAAKkJACAJAACvCQAgFQAAqgkAIBcAAKsJACA1AACtCQAgNgAArgkAIMkEAQCmCQAhygQBAKYJACHLBAEApgkAIcwEAQCmCQAhzQQBAKcJACHOBAEApgkAIc8EAQCmCQAh0AQBAKYJACHRBEAAqAkAIdIEQACoCQAhDwcAAIAKACAJAACBCgAgEgAA_AoAIBYAAP8JACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHzBAEAAAAB-gQBAAAAAfsEAQAAAAH9BAAAAP0EAv4EQAAAAAECAAAARwAgSgAA9hMAIAMAAABFACBKAAD2EwAgSwAA-hMAIBEAAABFACAHAADpCQAgCQAA6gkAIBIAAPsKACAWAADoCQAgQwAA-hMAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfMEAQCmCQAh-gQBAKYJACH7BAEApwkAIf0EAADmCf0EIv4EQADPCQAhDwcAAOkJACAJAADqCQAgEgAA-woAIBYAAOgJACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh8QQBAKYJACHzBAEApgkAIfoEAQCmCQAh-wQBAKcJACH9BAAA5gn9BCL-BEAAzwkAIREDAADiCgAgBwAA2woAIAkAAOEKACAVAADcCgAgGAAA3goAIDUAAN8KACA2AADgCgAgyQQBAAAAAcoEAQAAAAHLBAEAAAABzAQBAAAAAc0EAQAAAAHOBAEAAAABzwQBAAAAAdAEAQAAAAHRBEAAAAAB0gRAAAAAAQIAAAAQACBKAAD7EwAgAwAAAA4AIEoAAPsTACBLAAD_EwAgEwAAAA4AIAMAALAJACAHAACpCQAgCQAArwkAIBUAAKoJACAYAACsCQAgNQAArQkAIDYAAK4JACBDAAD_EwAgyQQBAKYJACHKBAEApgkAIcsEAQCmCQAhzAQBAKYJACHNBAEApwkAIc4EAQCmCQAhzwQBAKYJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACERAwAAsAkAIAcAAKkJACAJAACvCQAgFQAAqgkAIBgAAKwJACA1AACtCQAgNgAArgkAIMkEAQCmCQAhygQBAKYJACHLBAEApgkAIcwEAQCmCQAhzQQBAKcJACHOBAEApgkAIc8EAQCmCQAh0AQBAKYJACHRBEAAqAkAIdIEQACoCQAhHAQAAN8RACAFAADgEQAgBgAA4REAIBIAAOIRACAeAADjEQAgKwAA5hEAIDQAAOQRACA3AADlEQAgOAAA5xEAIDoAAOkRACA7AADqEQAgPAAA6xEAID0AAOwRACDJBAEAAAABzQQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAdUFAQAAAAHWBSAAAAAB1wUBAAAAAdgFAQAAAAHZBQEAAAAB2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAECAAAAkQIAIEoAAIAUACADAAAAYwAgSgAAgBQAIEsAAIQUACAeAAAAYwAgBAAA0BAAIAUAANEQACAGAADSEAAgEgAA0xAAIB4AANQQACArAADXEAAgNAAA1RAAIDcAANYQACA4AADYEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIEMAAIQUACDJBAEApgkAIc0EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAh1QUBAKYJACHWBSAA6AoAIdcFAQCnCQAh2AUBAKcJACHZBQEApwkAIdoFAQCnCQAh2wUBAKcJACHcBQEApwkAId0FAQCmCQAh3gUBAKYJACEcBAAA0BAAIAUAANEQACAGAADSEAAgEgAA0xAAIB4AANQQACArAADXEAAgNAAA1RAAIDcAANYQACA4AADYEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIMkEAQCmCQAhzQQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACHVBQEApgkAIdYFIADoCgAh1wUBAKcJACHYBQEApwkAIdkFAQCnCQAh2gUBAKcJACHbBQEApwkAIdwFAQCnCQAh3QUBAKYJACHeBQEApgkAIRwEAADfEQAgBQAA4BEAIAYAAOERACAeAADjEQAgKwAA5hEAIDQAAOQRACA3AADlEQAgOAAA5xEAIDkAAOgRACA6AADpEQAgOwAA6hEAIDwAAOsRACA9AADsEQAgyQQBAAAAAc0EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAHVBQEAAAAB1gUgAAAAAdcFAQAAAAHYBQEAAAAB2QUBAAAAAdoFAQAAAAHbBQEAAAAB3AUBAAAAAd0FAQAAAAHeBQEAAAABAgAAAJECACBKAACFFAAgEwgAAKgQACAVAAD6DwAgFwAA-w8AIBkAAPcPACAlAAD0DwAgJgAA9Q8AICcAAPYPACApAAD5DwAgKwAA_A8AICwAAP0PACAtAAD-DwAgLgAA_w8AIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGwBQEAAAABtQUBAAAAAbwFAQAAAAECAAAAGgAgSgAAhxQAIBcGAACIEAAgFQAAixAAIBcAAIwQACAZAACGEAAgJQAAgxAAICYAAIQQACAnAACHEAAgKQAAihAAICsAAI4QACAsAACPEAAgLQAAkBAAIC4AAJEQACAwAACCEAAgMQAAhRAAIDQAAI0QACDJBAEAAAAB0QRAAAAAAdIEQAAAAAH9BAAAALcFA5kFAQAAAAGfBQEAAAABtQUBAAAAAbgFAQAAAAECAAAAlAQAIEoAAIkUACAXBgAAiBAAIBcAAIwQACAZAACGEAAgJQAAgxAAICYAAIQQACAnAACHEAAgKAAAiRAAICkAAIoQACArAACOEAAgLAAAjxAAIC0AAJAQACAuAACREAAgMAAAghAAIDEAAIUQACA0AACNEAAgyQQBAAAAAdEEQAAAAAHSBEAAAAAB_QQAAAC3BQOZBQEAAAABnwUBAAAAAbUFAQAAAAG4BQEAAAABAgAAAJQEACBKAACLFAAgBhkAAIsMACDJBAEAAAABzgQBAAAAAZkFAQAAAAGaBUAAAAABmwVAAAAAAQIAAADXBQAgSgAAjRQAIA4HAADlDAAgCQAA5gwAIBQAAOMMACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGfBQEAAAABqQUBAAAAAaoFQAAAAAGrBQgAAAABrAUIAAAAAQIAAAAfACBKAACPFAAgEwgAAKgQACAXAAD7DwAgGQAA9w8AICUAAPQPACAmAAD1DwAgJwAA9g8AICgAAPgPACApAAD5DwAgKwAA_A8AICwAAP0PACAtAAD-DwAgLgAA_w8AIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGwBQEAAAABtQUBAAAAAbwFAQAAAAECAAAAGgAgSgAAkRQAIBAHAACIDAAgCQAAiQwAIBcAAIYMACAYAACHDAAgGgAAlQwAIBsAAIoMACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZkFAQAAAAGfBQEAAAABoAUCAAAAAaEFAQAAAAGiBQEAAAABAgAAAEwAIEoAAJMUACANAwAAuQsAIAcAALcLACAJAAC4CwAgHwAAuwsAICQAALwLACDJBAEAAAABzQQBAAAAAc4EAQAAAAHPBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAABlQUBAAAAAQIAAAB7ACBKAACVFAAgDgcAAN8MACAJAADgDAAgCgAAmg4AIBcAAOIMACDJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGrBQIAAAABsQUBAAAAAb4FAQAAAAG_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_A4AICUAAPkOACAmAAD6DgAgJwAA-w4AICgAAP0OACApAAD-DgAgKwAAgQ8AICwAAIIPACAtAACDDwAgLgAAhA8AIEMAALUUACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIRMIAACnEAAgFwAAgA8AIBkAAPwOACAlAAD5DgAgJgAA-g4AICcAAPsOACAoAAD9DgAgKQAA_g4AICsAAIEPACAsAACCDwAgLQAAgw8AIC4AAIQPACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIQMAAABKACBKAACTFAAgSwAAuBQAIBIAAABKACAHAADmCwAgCQAA5wsAIBcAAOQLACAYAADlCwAgGgAAlAwAIBsAAOgLACBDAAC4FAAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAhnwUBAKcJACGgBQIA4QsAIaEFAQCmCQAhogUBAKcJACEQBwAA5gsAIAkAAOcLACAXAADkCwAgGAAA5QsAIBoAAJQMACAbAADoCwAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAhnwUBAKcJACGgBQIA4QsAIaEFAQCmCQAhogUBAKcJACEDAAAAZQAgSgAAlRQAIEsAALsUACAPAAAAZQAgAwAAjAsAIAcAAIoLACAJAACLCwAgHwAAjgsAICQAAI8LACBDAAC7FAAgyQQBAKYJACHNBAEApwkAIc4EAQCmCQAhzwQBAKcJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACGVBQEApgkAIQ0DAACMCwAgBwAAigsAIAkAAIsLACAfAACOCwAgJAAAjwsAIMkEAQCmCQAhzQQBAKcJACHOBAEApgkAIc8EAQCnCQAh0AQBAKYJACHRBEAAqAkAIdIEQACoCQAhlQUBAKYJACEDAAAAIQAgSgAAlxQAIEsAAL4UACAQAAAAIQAgBwAAyAwAIAkAAMkMACAKAACYDgAgFwAAywwAIEMAAL4UACDJBAEApgkAIc4EAQCmCQAhzwQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGrBQIA4QsAIbEFAQCnCQAhvgUBAKYJACG_BQEApgkAIQ4HAADIDAAgCQAAyQwAIAoAAJgOACAXAADLDAAgyQQBAKYJACHOBAEApgkAIc8EAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhqwUCAOELACGxBQEApwkAIb4FAQCmCQAhvwUBAKYJACELyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfUEAQAAAAGhBQEAAAABsQUBAAAAAb0FQAAAAAETCAAAqBAAIBUAAPoPACAZAAD3DwAgJQAA9A8AICYAAPUPACAnAAD2DwAgKAAA-A8AICkAAPkPACArAAD8DwAgLAAA_Q8AIC0AAP4PACAuAAD_DwAgyQQBAAAAAdEEQAAAAAHSBEAAAAABnwUBAAAAAbAFAQAAAAG1BQEAAAABvAUBAAAAAQIAAAAaACBKAADAFAAgFwYAAIgQACAVAACLEAAgGQAAhhAAICUAAIMQACAmAACEEAAgJwAAhxAAICgAAIkQACApAACKEAAgKwAAjhAAICwAAI8QACAtAACQEAAgLgAAkRAAIDAAAIIQACAxAACFEAAgNAAAjRAAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAf0EAAAAtwUDmQUBAAAAAZ8FAQAAAAG1BQEAAAABuAUBAAAAAQIAAACUBAAgSgAAwhQAIA4HAADfDAAgCQAA4AwAIAoAAJoOACAVAADhDAAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABqwUCAAAAAbEFAQAAAAG-BQEAAAABvwUBAAAAAQIAAAAjACBKAADEFAAgEAcAAIgMACAJAACJDAAgFQAAhQwAIBgAAIcMACAaAACVDAAgGwAAigwAIMkEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAZ8FAQAAAAGgBQIAAAABoQUBAAAAAaIFAQAAAAECAAAATAAgSgAAxhQAIAMAAAAYACBKAADAFAAgSwAAyhQAIBUAAAAYACAIAACnEAAgFQAA_w4AIBkAAPwOACAlAAD5DgAgJgAA-g4AICcAAPsOACAoAAD9DgAgKQAA_g4AICsAAIEPACAsAACCDwAgLQAAgw8AIC4AAIQPACBDAADKFAAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGwBQEApwkAIbUFAQCnCQAhvAUBAKYJACETCAAApxAAIBUAAP8OACAZAAD8DgAgJQAA-Q4AICYAAPoOACAnAAD7DgAgKAAA_Q4AICkAAP4OACArAACBDwAgLAAAgg8AIC0AAIMPACAuAACEDwAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGwBQEApwkAIbUFAQCnCQAhvAUBAKYJACEDAAAAFgAgSgAAwhQAIEsAAM0UACAZAAAAFgAgBgAAnQ0AIBUAAKANACAZAACbDQAgJQAAmA0AICYAAJkNACAnAACcDQAgKAAAng0AICkAAJ8NACArAACjDQAgLAAApA0AIC0AAKUNACAuAACmDQAgMAAAlw0AIDEAAJoNACA0AACiDQAgQwAAzRQAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIf0EAACMDbcFI5kFAQCmCQAhnwUBAKcJACG1BQEApwkAIbgFAQCnCQAhFwYAAJ0NACAVAACgDQAgGQAAmw0AICUAAJgNACAmAACZDQAgJwAAnA0AICgAAJ4NACApAACfDQAgKwAAow0AICwAAKQNACAtAAClDQAgLgAApg0AIDAAAJcNACAxAACaDQAgNAAAog0AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIf0EAACMDbcFI5kFAQCmCQAhnwUBAKcJACG1BQEApwkAIbgFAQCnCQAhAwAAACEAIEoAAMQUACBLAADQFAAgEAAAACEAIAcAAMgMACAJAADJDAAgCgAAmA4AIBUAAMoMACBDAADQFAAgyQQBAKYJACHOBAEApgkAIc8EAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhqwUCAOELACGxBQEApwkAIb4FAQCmCQAhvwUBAKYJACEOBwAAyAwAIAkAAMkMACAKAACYDgAgFQAAygwAIMkEAQCmCQAhzgQBAKYJACHPBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIasFAgDhCwAhsQUBAKcJACG-BQEApgkAIb8FAQCmCQAhAwAAAEoAIEoAAMYUACBLAADTFAAgEgAAAEoAIAcAAOYLACAJAADnCwAgFQAA4wsAIBgAAOULACAaAACUDAAgGwAA6AsAIEMAANMUACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaAFAgDhCwAhoQUBAKYJACGiBQEApwkAIRAHAADmCwAgCQAA5wsAIBUAAOMLACAYAADlCwAgGgAAlAwAIBsAAOgLACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaAFAgDhCwAhoQUBAKYJACGiBQEApwkAIQfJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAHyBAEAAAABEwgAAKgQACAVAAD6DwAgFwAA-w8AIBkAAPcPACAlAAD0DwAgJgAA9Q8AICcAAPYPACAoAAD4DwAgKQAA-Q8AICsAAPwPACAtAAD-DwAgLgAA_w8AIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGwBQEAAAABtQUBAAAAAbwFAQAAAAECAAAAGgAgSgAA1RQAIBcGAACIEAAgFQAAixAAIBcAAIwQACAZAACGEAAgJQAAgxAAICYAAIQQACAnAACHEAAgKAAAiRAAICkAAIoQACArAACOEAAgLQAAkBAAIC4AAJEQACAwAACCEAAgMQAAhRAAIDQAAI0QACDJBAEAAAAB0QRAAAAAAdIEQAAAAAH9BAAAALcFA5kFAQAAAAGfBQEAAAABtQUBAAAAAbgFAQAAAAECAAAAlAQAIEoAANcUACAQBwAAiAwAIAkAAIkMACAVAACFDAAgFwAAhgwAIBoAAJUMACAbAACKDAAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAABnwUBAAAAAaAFAgAAAAGhBQEAAAABogUBAAAAAQIAAABMACBKAADZFAAgEwgAAKgQACAVAAD6DwAgFwAA-w8AIBkAAPcPACAlAAD0DwAgJgAA9Q8AICcAAPYPACAoAAD4DwAgKQAA-Q8AICsAAPwPACAsAAD9DwAgLgAA_w8AIMkEAQAAAAHRBEAAAAAB0gRAAAAAAZ8FAQAAAAGwBQEAAAABtQUBAAAAAbwFAQAAAAECAAAAGgAgSgAA2xQAIBcGAACIEAAgFQAAixAAIBcAAIwQACAZAACGEAAgJQAAgxAAICYAAIQQACAnAACHEAAgKAAAiRAAICkAAIoQACArAACOEAAgLAAAjxAAIC4AAJEQACAwAACCEAAgMQAAhRAAIDQAAI0QACDJBAEAAAAB0QRAAAAAAdIEQAAAAAH9BAAAALcFA5kFAQAAAAGfBQEAAAABtQUBAAAAAbgFAQAAAAECAAAAlAQAIEoAAN0UACANAwAAuQsAIAcAALcLACAJAAC4CwAgFQAAugsAICQAALwLACDJBAEAAAABzQQBAAAAAc4EAQAAAAHPBAEAAAAB0AQBAAAAAdEEQAAAAAHSBEAAAAABlQUBAAAAAQIAAAB7ACBKAADfFAAgAwAAABgAIEoAANsUACBLAADjFAAgFQAAABgAIAgAAKcQACAVAAD_DgAgFwAAgA8AIBkAAPwOACAlAAD5DgAgJgAA-g4AICcAAPsOACAoAAD9DgAgKQAA_g4AICsAAIEPACAsAACCDwAgLgAAhA8AIEMAAOMUACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIRMIAACnEAAgFQAA_w4AIBcAAIAPACAZAAD8DgAgJQAA-Q4AICYAAPoOACAnAAD7DgAgKAAA_Q4AICkAAP4OACArAACBDwAgLAAAgg8AIC4AAIQPACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIQMAAAAWACBKAADdFAAgSwAA5hQAIBkAAAAWACAGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJQAAmA0AICYAAJkNACAnAACcDQAgKAAAng0AICkAAJ8NACArAACjDQAgLAAApA0AIC4AAKYNACAwAACXDQAgMQAAmg0AIDQAAKINACBDAADmFAAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACEXBgAAnQ0AIBUAAKANACAXAAChDQAgGQAAmw0AICUAAJgNACAmAACZDQAgJwAAnA0AICgAAJ4NACApAACfDQAgKwAAow0AICwAAKQNACAuAACmDQAgMAAAlw0AIDEAAJoNACA0AACiDQAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACEDAAAAZQAgSgAA3xQAIEsAAOkUACAPAAAAZQAgAwAAjAsAIAcAAIoLACAJAACLCwAgFQAAjQsAICQAAI8LACBDAADpFAAgyQQBAKYJACHNBAEApwkAIc4EAQCmCQAhzwQBAKcJACHQBAEApgkAIdEEQACoCQAh0gRAAKgJACGVBQEApgkAIQ0DAACMCwAgBwAAigsAIAkAAIsLACAVAACNCwAgJAAAjwsAIMkEAQCmCQAhzQQBAKcJACHOBAEApgkAIc8EAQCnCQAh0AQBAKYJACHRBEAAqAkAIdIEQACoCQAhlQUBAKYJACEKyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAH1BAEAAAAB9gQBAAAAAfcEAQAAAAH4BAEAAAAB-QRAAAAAAQMAAAAYACBKAADVFAAgSwAA7RQAIBUAAAAYACAIAACnEAAgFQAA_w4AIBcAAIAPACAZAAD8DgAgJQAA-Q4AICYAAPoOACAnAAD7DgAgKAAA_Q4AICkAAP4OACArAACBDwAgLQAAgw8AIC4AAIQPACBDAADtFAAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGwBQEApwkAIbUFAQCnCQAhvAUBAKYJACETCAAApxAAIBUAAP8OACAXAACADwAgGQAA_A4AICUAAPkOACAmAAD6DgAgJwAA-w4AICgAAP0OACApAAD-DgAgKwAAgQ8AIC0AAIMPACAuAACEDwAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGwBQEApwkAIbUFAQCnCQAhvAUBAKYJACEDAAAAFgAgSgAA1xQAIEsAAPAUACAZAAAAFgAgBgAAnQ0AIBUAAKANACAXAAChDQAgGQAAmw0AICUAAJgNACAmAACZDQAgJwAAnA0AICgAAJ4NACApAACfDQAgKwAAow0AIC0AAKUNACAuAACmDQAgMAAAlw0AIDEAAJoNACA0AACiDQAgQwAA8BQAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIf0EAACMDbcFI5kFAQCmCQAhnwUBAKcJACG1BQEApwkAIbgFAQCnCQAhFwYAAJ0NACAVAACgDQAgFwAAoQ0AIBkAAJsNACAlAACYDQAgJgAAmQ0AICcAAJwNACAoAACeDQAgKQAAnw0AICsAAKMNACAtAAClDQAgLgAApg0AIDAAAJcNACAxAACaDQAgNAAAog0AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIf0EAACMDbcFI5kFAQCmCQAhnwUBAKcJACG1BQEApwkAIbgFAQCnCQAhAwAAAEoAIEoAANkUACBLAADzFAAgEgAAAEoAIAcAAOYLACAJAADnCwAgFQAA4wsAIBcAAOQLACAaAACUDAAgGwAA6AsAIEMAAPMUACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaAFAgDhCwAhoQUBAKYJACGiBQEApwkAIRAHAADmCwAgCQAA5wsAIBUAAOMLACAXAADkCwAgGgAAlAwAIBsAAOgLACDJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACGfBQEApwkAIaAFAgDhCwAhoQUBAKYJACGiBQEApwkAIQrJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfEEAQAAAAH6BAEAAAAB-wQBAAAAAf0EAAAA_QQC_gRAAAAAARMIAACoEAAgFQAA-g8AIBcAAPsPACAZAAD3DwAgJQAA9A8AICYAAPUPACAnAAD2DwAgKAAA-A8AICkAAPkPACAsAAD9DwAgLQAA_g8AIC4AAP8PACDJBAEAAAAB0QRAAAAAAdIEQAAAAAGfBQEAAAABsAUBAAAAAbUFAQAAAAG8BQEAAAABAgAAABoAIEoAAPUUACAXBgAAiBAAIBUAAIsQACAXAACMEAAgGQAAhhAAICUAAIMQACAmAACEEAAgJwAAhxAAICgAAIkQACApAACKEAAgLAAAjxAAIC0AAJAQACAuAACREAAgMAAAghAAIDEAAIUQACA0AACNEAAgyQQBAAAAAdEEQAAAAAHSBEAAAAAB_QQAAAC3BQOZBQEAAAABnwUBAAAAAbUFAQAAAAG4BQEAAAABAgAAAJQEACBKAAD3FAAgHAQAAN8RACAFAADgEQAgBgAA4REAIBIAAOIRACAeAADjEQAgKwAA5hEAIDQAAOQRACA3AADlEQAgOQAA6BEAIDoAAOkRACA7AADqEQAgPAAA6xEAID0AAOwRACDJBAEAAAABzQQBAAAAAdEEQAAAAAHSBEAAAAABmQUBAAAAAdUFAQAAAAHWBSAAAAAB1wUBAAAAAdgFAQAAAAHZBQEAAAAB2gUBAAAAAdsFAQAAAAHcBQEAAAAB3QUBAAAAAd4FAQAAAAECAAAAkQIAIEoAAPkUACAcBAAA3xEAIAUAAOARACAGAADhEQAgEgAA4hEAIB4AAOMRACA0AADkEQAgNwAA5REAIDgAAOcRACA5AADoEQAgOgAA6REAIDsAAOoRACA8AADrEQAgPQAA7BEAIMkEAQAAAAHNBAEAAAAB0QRAAAAAAdIEQAAAAAGZBQEAAAAB1QUBAAAAAdYFIAAAAAHXBQEAAAAB2AUBAAAAAdkFAQAAAAHaBQEAAAAB2wUBAAAAAdwFAQAAAAHdBQEAAAAB3gUBAAAAAQIAAACRAgAgSgAA-xQAIAzJBAEAAAABzgQBAAAAAc8EAQAAAAHRBEAAAAAB0gRAAAAAAfoEAQAAAAGtBQEAAAABrgUBAAAAAa8FAACGDQAgsAUBAAAAAbEFAQAAAAGyBQEAAAABAgAAAMYEACBKAAD9FAAgAwAAABgAIEoAAPUUACBLAACBFQAgFQAAABgAIAgAAKcQACAVAAD_DgAgFwAAgA8AIBkAAPwOACAlAAD5DgAgJgAA-g4AICcAAPsOACAoAAD9DgAgKQAA_g4AICwAAIIPACAtAACDDwAgLgAAhA8AIEMAAIEVACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIRMIAACnEAAgFQAA_w4AIBcAAIAPACAZAAD8DgAgJQAA-Q4AICYAAPoOACAnAAD7DgAgKAAA_Q4AICkAAP4OACAsAACCDwAgLQAAgw8AIC4AAIQPACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACGfBQEApwkAIbAFAQCnCQAhtQUBAKcJACG8BQEApgkAIQMAAAAWACBKAAD3FAAgSwAAhBUAIBkAAAAWACAGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJQAAmA0AICYAAJkNACAnAACcDQAgKAAAng0AICkAAJ8NACAsAACkDQAgLQAApQ0AIC4AAKYNACAwAACXDQAgMQAAmg0AIDQAAKINACBDAACEFQAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACEXBgAAnQ0AIBUAAKANACAXAAChDQAgGQAAmw0AICUAAJgNACAmAACZDQAgJwAAnA0AICgAAJ4NACApAACfDQAgLAAApA0AIC0AAKUNACAuAACmDQAgMAAAlw0AIDEAAJoNACA0AACiDQAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAh_QQAAIwNtwUjmQUBAKYJACGfBQEApwkAIbUFAQCnCQAhuAUBAKcJACEDAAAAYwAgSgAA-RQAIEsAAIcVACAeAAAAYwAgBAAA0BAAIAUAANEQACAGAADSEAAgEgAA0xAAIB4AANQQACArAADXEAAgNAAA1RAAIDcAANYQACA5AADZEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIEMAAIcVACDJBAEApgkAIc0EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAh1QUBAKYJACHWBSAA6AoAIdcFAQCnCQAh2AUBAKcJACHZBQEApwkAIdoFAQCnCQAh2wUBAKcJACHcBQEApwkAId0FAQCmCQAh3gUBAKYJACEcBAAA0BAAIAUAANEQACAGAADSEAAgEgAA0xAAIB4AANQQACArAADXEAAgNAAA1RAAIDcAANYQACA5AADZEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIMkEAQCmCQAhzQQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACHVBQEApgkAIdYFIADoCgAh1wUBAKcJACHYBQEApwkAIdkFAQCnCQAh2gUBAKcJACHbBQEApwkAIdwFAQCnCQAh3QUBAKYJACHeBQEApgkAIQMAAABjACBKAAD7FAAgSwAAihUAIB4AAABjACAEAADQEAAgBQAA0RAAIAYAANIQACASAADTEAAgHgAA1BAAIDQAANUQACA3AADWEAAgOAAA2BAAIDkAANkQACA6AADaEAAgOwAA2xAAIDwAANwQACA9AADdEAAgQwAAihUAIMkEAQCmCQAhzQQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACHVBQEApgkAIdYFIADoCgAh1wUBAKcJACHYBQEApwkAIdkFAQCnCQAh2gUBAKcJACHbBQEApwkAIdwFAQCnCQAh3QUBAKYJACHeBQEApgkAIRwEAADQEAAgBQAA0RAAIAYAANIQACASAADTEAAgHgAA1BAAIDQAANUQACA3AADWEAAgOAAA2BAAIDkAANkQACA6AADaEAAgOwAA2xAAIDwAANwQACA9AADdEAAgyQQBAKYJACHNBAEApwkAIdEEQACoCQAh0gRAAKgJACGZBQEApgkAIdUFAQCmCQAh1gUgAOgKACHXBQEApwkAIdgFAQCnCQAh2QUBAKcJACHaBQEApwkAIdsFAQCnCQAh3AUBAKcJACHdBQEApgkAId4FAQCmCQAhAwAAAMkEACBKAAD9FAAgSwAAjRUAIA4AAADJBAAgQwAAjRUAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACH6BAEApgkAIa0FAQCnCQAhrgUBAKYJACGvBQAA-wwAILAFAQCnCQAhsQUBAKcJACGyBQEApgkAIQzJBAEApgkAIc4EAQCmCQAhzwQBAKcJACHRBEAAqAkAIdIEQACoCQAh-gQBAKYJACGtBQEApwkAIa4FAQCmCQAhrwUAAPsMACCwBQEApwkAIbEFAQCnCQAhsgUBAKYJACENyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHeBAEAAAAB_wQBAAAAAYEFAAAAgQUCggUBAAAAAYMFQAAAAAGEBUAAAAABhQUBAAAAAYYFAQAAAAETCAAAqBAAIBUAAPoPACAXAAD7DwAgGQAA9w8AICUAAPQPACAmAAD1DwAgJwAA9g8AICgAAPgPACApAAD5DwAgKwAA_A8AICwAAP0PACAtAAD-DwAgyQQBAAAAAdEEQAAAAAHSBEAAAAABnwUBAAAAAbAFAQAAAAG1BQEAAAABvAUBAAAAAQIAAAAaACBKAACPFQAgFwYAAIgQACAVAACLEAAgFwAAjBAAIBkAAIYQACAlAACDEAAgJgAAhBAAICcAAIcQACAoAACJEAAgKQAAihAAICsAAI4QACAsAACPEAAgLQAAkBAAIDAAAIIQACAxAACFEAAgNAAAjRAAIMkEAQAAAAHRBEAAAAAB0gRAAAAAAf0EAAAAtwUDmQUBAAAAAZ8FAQAAAAG1BQEAAAABuAUBAAAAAQIAAACUBAAgSgAAkRUAIBYHAADaCgAgCQAA1woAIAoAANgKACALAADRCgAgEQAA0goAIBIAALYLACAUAADUCgAgFgAA1goAIBoAANkKACAeAADVCgAgyQQBAAAAAc4EAQAAAAHPBAEAAAAB0QRAAAAAAdIEQAAAAAHxBAEAAAAB8gQBAAAAAfMEAQAAAAH1BAEAAAABoQUBAAAAAbEFAQAAAAG9BUAAAAABAgAAACgAIEoAAJMVACADAAAAGAAgSgAAjxUAIEsAAJcVACAVAAAAGAAgCAAApxAAIBUAAP8OACAXAACADwAgGQAA_A4AICUAAPkOACAmAAD6DgAgJwAA-w4AICgAAP0OACApAAD-DgAgKwAAgQ8AICwAAIIPACAtAACDDwAgQwAAlxUAIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhsAUBAKcJACG1BQEApwkAIbwFAQCmCQAhEwgAAKcQACAVAAD_DgAgFwAAgA8AIBkAAPwOACAlAAD5DgAgJgAA-g4AICcAAPsOACAoAAD9DgAgKQAA_g4AICsAAIEPACAsAACCDwAgLQAAgw8AIMkEAQCmCQAh0QRAAKgJACHSBEAAqAkAIZ8FAQCnCQAhsAUBAKcJACG1BQEApwkAIbwFAQCmCQAhAwAAABYAIEoAAJEVACBLAACaFQAgGQAAABYAIAYAAJ0NACAVAACgDQAgFwAAoQ0AIBkAAJsNACAlAACYDQAgJgAAmQ0AICcAAJwNACAoAACeDQAgKQAAnw0AICsAAKMNACAsAACkDQAgLQAApQ0AIDAAAJcNACAxAACaDQAgNAAAog0AIEMAAJoVACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH9BAAAjA23BSOZBQEApgkAIZ8FAQCnCQAhtQUBAKcJACG4BQEApwkAIRcGAACdDQAgFQAAoA0AIBcAAKENACAZAACbDQAgJQAAmA0AICYAAJkNACAnAACcDQAgKAAAng0AICkAAJ8NACArAACjDQAgLAAApA0AIC0AAKUNACAwAACXDQAgMQAAmg0AIDQAAKINACDJBAEApgkAIdEEQACoCQAh0gRAAKgJACH9BAAAjA23BSOZBQEApgkAIZ8FAQCnCQAhtQUBAKcJACG4BQEApwkAIQMAAAAmACBKAACTFQAgSwAAnRUAIBgAAAAmACAHAACrCgAgCQAAqAoAIAoAAKkKACALAACiCgAgEQAAowoAIBIAALQLACAUAAClCgAgFgAApwoAIBoAAKoKACAeAACmCgAgQwAAnRUAIMkEAQCmCQAhzgQBAKYJACHPBAEApwkAIdEEQACoCQAh0gRAAKgJACHxBAEApgkAIfIEAQCmCQAh8wQBAKYJACH1BAEApgkAIaEFAQCmCQAhsQUBAKcJACG9BUAAqAkAIRYHAACrCgAgCQAAqAoAIAoAAKkKACALAACiCgAgEQAAowoAIBIAALQLACAUAAClCgAgFgAApwoAIBoAAKoKACAeAACmCgAgyQQBAKYJACHOBAEApgkAIc8EAQCnCQAh0QRAAKgJACHSBEAAqAkAIfEEAQCmCQAh8gQBAKYJACHzBAEApgkAIfUEAQCmCQAhoQUBAKYJACGxBQEApwkAIb0FQACoCQAhE8kEAQAAAAHOBAEAAAABzwQBAAAAAdEEQAAAAAHSBEAAAAABhwUBAAAAAYgFCAAAAAGJBQgAAAABigUIAAAAAYsFCAAAAAGMBQgAAAABjQUIAAAAAY4FCAAAAAGPBQgAAAABkAUIAAAAAZEFCAAAAAGSBQgAAAABkwUIAAAAAZQFCAAAAAEDAAAAYwAgSgAAhRQAIEsAAKEVACAeAAAAYwAgBAAA0BAAIAUAANEQACAGAADSEAAgHgAA1BAAICsAANcQACA0AADVEAAgNwAA1hAAIDgAANgQACA5AADZEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIEMAAKEVACDJBAEApgkAIc0EAQCnCQAh0QRAAKgJACHSBEAAqAkAIZkFAQCmCQAh1QUBAKYJACHWBSAA6AoAIdcFAQCnCQAh2AUBAKcJACHZBQEApwkAIdoFAQCnCQAh2wUBAKcJACHcBQEApwkAId0FAQCmCQAh3gUBAKYJACEcBAAA0BAAIAUAANEQACAGAADSEAAgHgAA1BAAICsAANcQACA0AADVEAAgNwAA1hAAIDgAANgQACA5AADZEAAgOgAA2hAAIDsAANsQACA8AADcEAAgPQAA3RAAIMkEAQCmCQAhzQQBAKcJACHRBEAAqAkAIdIEQACoCQAhmQUBAKYJACHVBQEApgkAIdYFIADoCgAh1wUBAKcJACHYBQEApwkAIdkFAQCnCQAh2gUBAKcJACHbBQEApwkAIdwFAQCnCQAh3QUBAKYJACHeBQEApgkAIQMAAAAYACBKAACHFAAgSwAApBUAIBUAAAAYACAIAACnEAAgFQAA_w4AIBcAAIAPACAZAAD8DgAgJQAA-Q4AICYAAPoOACAnAAD7DgAgKQAA_g4AICsAAIEPACAsAACCDwAgLQAAgw8AIC4AAIQPACBDAACkFQAgyQQBAKYJACHRBEAAqAkAIdIEQACoCQAhnwUBAKcJACGwBQEApwkAIbUFAQCnCQAhvAUBAKYJACETCAAApxAAIBUAAP8OACAXAACADwAgGQAA_A4AICUAAPkOACAmAAD6DgAgJwAA-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-QGAioAAgMMAPYBUAD3AVEA-AEAAAADDAD2AVAA9wFRAPgBBAcABgn4BggSAAUWABYEBwAGCf4GCBIABRYAFgMMAP0BUAD-AVEA_wEAAAADDAD9AVAA_gFRAP8BBAcABgmQBwgdABUeABMEBwAGCZYHCB0AFR4AEwMMAIQCUACFAlEAhgIAAAADDACEAlAAhQJRAIYCBQcABgmoBwgSAAUUAAoWABYFBwAGCa4HCBIABRQAChYAFgMMAIsCUACMAlEAjQIAAAADDACLAlAAjAJRAI0CASoAAgEqAAIDDACSAlAAkwJRAJQCAAAAAwwAkgJQAJMCUQCUAgMDAAIHAAYJAAgDAwACBwAGCQAIAwwAmQJQAJoCUQCbAgAAAAMMAJkCUACaAlEAmwI-AgE_5gEBQOcBAUHoAQFC6QEBROsBAUXtATFG7gEyR_ABAUjyATFJ8wEzTPQBAU31AQFO9gExUvkBNFP6AThU-wERVfwBEVb9ARFX_gERWP8BEVmBAhFagwIxW4QCOVyGAhFdiAIxXokCOl-KAhFgiwIRYYwCMWKPAjtjkAI_ZJICAmWTAgJmlQICZ5YCAmiXAgJpmQICapsCMWucAkBsngICbaACMW6hAkFvogICcKMCAnGkAjFypwJCc6gCRnSpAgN1qgIDdqsCA3esAgN4rQIDea8CA3qxAjF7sgJHfLQCA322AjF-twJIf7gCA4ABuQIDgQG6AjGCAb0CSYMBvgJNhAG_AgSFAcACBIYBwQIEhwHCAgSIAcMCBIkBxQIEigHHAjGLAcgCTowBygIEjQHMAjGOAc0CT48BzgIEkAHPAgSRAdACMZIB0wJQkwHUAlSUAdYCVZUB1wJVlgHaAlWXAdsCVZgB3AJVmQHeAlWaAeACMZsB4QJWnAHjAlWdAeUCMZ4B5gJXnwHnAlWgAegCVaEB6QIxogHsAlijAe0CXKQB7gIvpQHvAi-mAfACL6cB8QIvqAHyAi-pAfQCL6oB9gIxqwH3Al2sAfkCL60B-wIxrgH8Al6vAf0CL7AB_gIvsQH_AjGyAYIDX7MBgwNjtAGEAxq1AYUDGrYBhgMatwGHAxq4AYgDGrkBigMaugGMAzG7AY0DZLwBkAMavQGSAzG-AZMDZb8BlQMawAGWAxrBAZcDMcIBmgNmwwGbA2rEAZwDD8UBnQMPxgGeAw_HAZ8DD8gBoAMPyQGiAw_KAaQDMcsBpQNrzAGnAw_NAakDMc4BqgNszwGrAw_QAawDD9EBrQMx1AGwA23VAbEDc9YBsgMK1wGzAwrYAbQDCtkBtQMK2gG2AwrbAbgDCtwBugMx3QG7A3TeAb4DCt8BwAMx4AHBA3XhAcMDCuIBxAMK4wHFAzHkAcgDduUByQN85gHKAwvnAcsDC-gBzAML6QHNAwvqAc4DC-sB0AML7AHSAzHtAdMDfe4B1wML7wHZAzHwAdoDfvEB3QML8gHeAwvzAd8DMfQB4gN_9QHjA4MB9gHkAwj3AeUDCPgB5gMI-QHnAwj6AegDCPsB6gMI_AHsAzH9Ae0DhAH-AfADCP8B8gMxgALzA4UBgQL1AwiCAvYDCIMC9wMxhAL6A4YBhQL7A4oBhgL8AweHAv0DB4gC_gMHiQL_AweKAoAEB4sCggQHjAKEBDGNAoUEiwGOAogEB48CigQxkAKLBIwBkQKNBAeSAo4EB5MCjwQxlAKSBI0BlQKTBJEBlgKVBAaXApYEBpgCmAQGmQKZBAaaApoEBpsCnAQGnAKeBDGdAp8EkgGeAqEEBp8CowQxoAKkBJMBoQKlBAaiAqYEBqMCpwQxpAKqBJQBpQKrBJgBpgKsBCqnAq0EKqgCrgQqqQKvBCqqArAEKqsCsgQqrAK0BDGtArUEmQGuArkEKq8CuwQxsAK8BJoBsQK_BCqyAsAEKrMCwQQxtALEBJsBtQLFBJ8BtgLHBCa3AsgEJrgCywQmuQLMBCa6As0EJrsCzwQmvALRBDG9AtIEoAG-AtQEJr8C1gQxwALXBKEBwQLYBCbCAtkEJsMC2gQxxALdBKIBxQLeBKYBxgLgBB_HAuEEH8gC5AQfyQLlBB_KAuYEH8sC6AQfzALqBDHNAusEpwHOAu0EH88C7wQx0ALwBKgB0QLxBB_SAvIEH9MC8wQx1AL2BKkB1QL3BK0B1gL4BAnXAvkECdgC-gQJ2QL7BAnaAvwECdsC_gQJ3AKABTHdAoEFrgHeAoMFCd8ChQUx4AKGBa8B4QKHBQniAogFCeMCiQUx5AKMBbAB5QKNBbYB5gKOBQznAo8FDOgCkAUM6QKRBQzqApIFDOsClAUM7AKWBTHtApcFtwHuApkFDO8CmwUx8AKcBbgB8QKdBQzyAp4FDPMCnwUx9AKiBbkB9QKjBb0B9gKlBQ33AqYFDfgCqQUN-QKqBQ36AqsFDfsCrQUN_AKvBTH9ArAFvgH-ArIFDf8CtAUxgAO1Bb8BgQO2BQ2CA7cFDYMDuAUxhAO7BcABhQO8BcQBhgO9BRaHA74FFogDvwUWiQPABRaKA8EFFosDwwUWjAPFBTGNA8YFxQGOA8oFFo8DzAUxkAPNBcYBkQPQBRaSA9EFFpMD0gUxlAPVBccBlQPWBc0BlgPYBRiXA9kFGJgD3AUYmQPdBRiaA94FGJsD4AUYnAPiBTGdA-MFzgGeA-UFGJ8D5wUxoAPoBc8BoQPpBRiiA-oFGKMD6wUxpAPuBdABpQPvBdQBpgPxBS6nA_IFLqgD9AUuqQP1BS6qA_YFLqsD-AUurAP6BTGtA_sF1QGuA_0FLq8D_wUxsAOABtYBsQOBBi6yA4IGLrMDgwYxtAOGBtcBtQOHBtsBtgOIBh63A4kGHrgDigYeuQOLBh66A4wGHrsDjgYevAOQBjG9A5EG3AG-A5UGHr8DlwYxwAOYBt0BwQObBh7CA5wGHsMDnQYxxAOgBt4BxQOhBuIBxgOiBhPHA6MGE8gDpAYTyQOlBhPKA6YGE8sDqAYTzAOqBjHNA6sG4wHOA64GE88DsAYx0AOxBuQB0QOzBhPSA7QGE9MDtQYx1AO4BuUB1QO5BukB1gO6BhLXA7sGEtgDvAYS2QO9BhLaA74GEtsDwAYS3APCBjHdA8MG6gHeA8YGEt8DyAYx4APJBusB4QPLBhLiA8wGEuMDzQYx5APQBuwB5QPRBvIB5gPSBiXnA9MGJegD1AYl6QPVBiXqA9YGJesD2AYl7APaBjHtA9sG8wHuA-AGJe8D4gYx8APjBvQB8QPnBiXyA-gGJfMD6QYx9APsBvUB9QPtBvkB9gPuBhX3A-8GFfgD8AYV-QPxBhX6A_IGFfsD9AYV_AP2BjH9A_cG-gH-A_oGFf8D_AYxgAT9BvsBgQT_BhWCBIAHFYMEgQcxhASEB_wBhQSFB4AChgSGBxSHBIcHFIgEiAcUiQSJBxSKBIoHFIsEjAcUjASOBzGNBI8HgQKOBJIHFI8ElAcxkASVB4ICkQSXBxSSBJgHFJMEmQcxlAScB4MClQSdB4cClgSeBxeXBJ8HF5gEoAcXmQShBxeaBKIHF5sEpAcXnASmBzGdBKcHiAKeBKoHF58ErAcxoAStB4kCoQSvBxeiBLAHF6MEsQcxpAS0B4oCpQS1B44CpgS3By2nBLgHLagEugctqQS7By2qBLwHLasEvgctrATABzGtBMEHjwKuBMMHLa8ExQcxsATGB5ACsQTHBy2yBMgHLbMEyQcxtATMB5ECtQTNB5UCtgTOBwW3BM8HBbgE0AcFuQTRBwW6BNIHBbsE1AcFvATWBzG9BNcHlgK-BNkHBb8E2wcxwATcB5cCwQTdBwXCBN4HBcME3wcxxATiB5gCxQTjB5wC"
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
  reviewStudentAdmissionApplication
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
  reviewStudentAdmissionApplication: reviewStudentAdmissionApplication2
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
var getFeePlaceholder = async () => {
  return {
    status: "COMING_SOON",
    message: "Fee payment module will be available soon."
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
  getFeePlaceholder
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
var getFeePlaceholder2 = catchAsync(async (_req, res) => {
  const result = await StudentService.getFeePlaceholder();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Fee module status fetched successfully",
    data: result
  });
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
  getFeePlaceholder: getFeePlaceholder2
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
  updateProfileSchema
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
router8.get("/fees", requireSessionRole("STUDENT"), StudentController.getFeePlaceholder);
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
var corsOptions = {
  origin: (origin, callback) => {
    if (!origin || originPolicy.isAllowedOrigin(origin)) {
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
  const origin = req.headers.origin;
  if (!origin || originPolicy.isAllowedOrigin(origin)) {
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
