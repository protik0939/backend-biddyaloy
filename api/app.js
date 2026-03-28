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
  "inlineSchema": 'model AdminProfile {\n  id     String    @id @default(uuid())\n  role   AdminRole\n  userId String\n  user   User      @relation(fields: [userId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId])\n  @@map("admin_profiles")\n}\n\nmodel Attendance {\n  id     String           @id @default(uuid())\n  date   DateTime\n  status AttendanceStatus\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseRegistrationId, date])\n  @@map("attendances")\n}\n\nmodel User {\n  id                                   String                        @id\n  name                                 String\n  email                                String\n  emailVerified                        Boolean                       @default(false)\n  image                                String?\n  createdAt                            DateTime                      @default(now())\n  updatedAt                            DateTime                      @updatedAt\n  sessions                             Session[]\n  accounts                             Account[]\n  adminProfile                         AdminProfile[]\n  teacherProfile                       TeacherProfile[]\n  studentProfile                       StudentProfile[]\n  institutionApplications              InstitutionApplication[]      @relation("InstitutionApplicationApplicant")\n  reviewedInstitutionApplications      InstitutionApplication[]      @relation("InstitutionApplicationReviewedBy")\n  teacherJobApplications               TeacherJobApplication[]       @relation("TeacherJobApplicationApplicant")\n  reviewedTeacherJobApplications       TeacherJobApplication[]       @relation("TeacherJobApplicationReviewer")\n  teacherApplicationProfile            TeacherApplicationProfile?\n  studentAdmissionApplications         StudentAdmissionApplication[] @relation("StudentAdmissionApplicant")\n  reviewedStudentAdmissionApplications StudentAdmissionApplication[] @relation("StudentAdmissionReviewer")\n  studentApplicationProfile            StudentApplicationProfile?\n\n  contactNo        String?\n  presentAddress   String?\n  permanentAddress String?\n  bloodGroup       String?\n  gender           String?\n\n  bio String?\n\n  role String\n\n  accountStatus String @default("PENDING")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Batch {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  sections Section[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("batches")\n}\n\nmodel ClassRoom {\n  id       String        @id @default(uuid())\n  name     String?\n  roomNo   String\n  floor    String\n  capacity Int\n  roomType ClassRoomType\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  routines  Routine[]\n\n  @@map("classrooms")\n}\n\nmodel Course {\n  id          String  @id @default(uuid())\n  courseCode  String  @unique\n  courseTitle String\n  description String?\n  credits     Int?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CourseRegistration {\n  id          String       @id @default(uuid())\n  routine     Routine[]\n  attendances Attendance[]\n  mark        TeacherMark?\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  programId String?\n  program   Program? @relation(fields: [programId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  registrationDate DateTime @default(now())\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("course_registrations")\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  facultyId String?\n  faculty   Faculty? @relation(fields: [facultyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  programs                    Program[]\n  batches                     Batch[]\n  courses                     Course[]\n  sections                    Section[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n\n  @@map("departments")\n}\n\nenum ClassRoomType {\n  LAB\n  LECTURE\n  SEMINAR\n  LIBRARY\n  TEACHER_ROOM\n  STUDENT_LOUNGE\n  ADMIN_OFFICE\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AccountStatus {\n  PENDING\n  ACTIVE\n  DEACTIVATED\n  BANNED\n  DELETIONPENDING\n  DELETED\n}\n\nenum InstitutionType {\n  SCHOOL\n  COLLEGE\n  UNIVERSITY\n  TRAINING_CENTER\n  OTHER\n}\n\nenum ProgramType {\n  PRIMARY\n  LOWER_SECONDARY\n  SECONDARY\n  HIGHER_SECONDARY\n  DIPLOMA\n  BACHELOR\n  MASTERS\n  PHD\n  CERTIFICATE\n}\n\nenum AdminRole {\n  INSTITUTIONADMIN\n  DEPARTMENTADMIN\n  FACULTYADMIN\n}\n\nenum SlotStatus {\n  CLASS_SLOT\n  BREAK_SLOT\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n}\n\nenum UserRole {\n  SUPERADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum InstitutionApplicationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum TeacherJobApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nenum TeacherClassworkType {\n  TASK\n  ASSIGNMENT\n  QUIZ\n  NOTICE\n}\n\nenum StudentAdmissionApplicationStatus {\n  PENDING\n  SHORTLISTED\n  APPROVED\n  REJECTED\n}\n\nmodel Faculty {\n  id          String  @id @default(uuid())\n  fullName    String\n  shortName   String?\n  description String?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  departments Department[]\n\n  @@map("faculties")\n}\n\nmodel Institution {\n  id                          String                           @id @default(uuid())\n  name                        String\n  description                 String?\n  shortName                   String?\n  type                        InstitutionType?\n  institutionLogo             String?\n  createdAt                   DateTime                         @default(now())\n  updatedAt                   DateTime                         @updatedAt\n  faculties                   Faculty[]\n  programs                    Program[]\n  batches                     Batch[]\n  classrooms                  ClassRoom[]\n  sections                    Section[]\n  courses                     Course[]\n  adminProfile                AdminProfile[]\n  teacherProfiles             TeacherProfile[]\n  studentProfiles             StudentProfile[]\n  courseRegistrations         CourseRegistration[]\n  sectionTeacherAssignments   SectionCourseTeacherAssignment[]\n  institutionApplications     InstitutionApplication[]\n  teacherJobApplications      TeacherJobApplication[]\n  teacherClassworks           TeacherClasswork[]\n  studentClassworkSubmissions StudentClassworkSubmission[]\n  teacherMarks                TeacherMark[]\n\n  @@map("institutions")\n}\n\nmodel InstitutionApplication {\n  id String @id @default(uuid())\n\n  applicantUserId String\n  applicantUser   User   @relation("InstitutionApplicationApplicant", fields: [applicantUserId], references: [id])\n\n  institutionName String\n  description     String?\n  shortName       String?\n  institutionType InstitutionType?\n  institutionLogo String?\n\n  status          InstitutionApplicationStatus @default(PENDING)\n  rejectionReason String?\n\n  reviewedByUserId String?\n  reviewedByUser   User?     @relation("InstitutionApplicationReviewedBy", fields: [reviewedByUserId], references: [id])\n  reviewedAt       DateTime?\n\n  institutionId String?\n  institution   Institution? @relation(fields: [institutionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([applicantUserId])\n  @@index([status])\n  @@map("institution_applications")\n}\n\nmodel TeacherJobPost {\n  id              String                  @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    TeacherJobApplication[]\n  createdAt       DateTime                @default(now())\n  updatedAt       DateTime                @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("teacher_job_posts")\n}\n\nmodel StudentAdmissionPost {\n  id              String                        @id @default(uuid())\n  title           String\n  location        String?\n  summary         String\n  details         String[]\n  institutionId   String\n  facultyId       String?\n  departmentId    String?\n  programId       String?\n  createdByUserId String\n  applications    StudentAdmissionApplication[]\n  createdAt       DateTime                      @default(now())\n  updatedAt       DateTime                      @updatedAt\n\n  @@index([institutionId])\n  @@index([facultyId])\n  @@index([departmentId])\n  @@index([programId])\n  @@index([createdAt])\n  @@map("student_admission_posts")\n}\n\nmodel Program {\n  id                  String               @id @default(uuid())\n  title               String\n  shortTitle          String?\n  description         String?\n  duration            DateTime?\n  credits             Float?\n  cost                Float?\n  course              Course[]\n  courseRegistrations CourseRegistration[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("programs")\n}\n\nmodel Routine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  version     String?\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  courseRegistrationId String\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  classRoomId String\n  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("routines")\n}\n\nmodel Schedule {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  routine     Routine[]\n\n  startTime DateTime\n  endTime   DateTime\n\n  status SlotStatus @default(CLASS_SLOT)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Section {\n  id                        String                           @id @default(uuid())\n  name                      String\n  description               String?\n  sectionCapacity           Int?\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  semesterId String\n  semester   Semester @relation(fields: [semesterId], references: [id])\n\n  batchId String?\n  batch   Batch?  @relation(fields: [batchId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("sections")\n}\n\nmodel Semester {\n  id                  String               @id @default(uuid())\n  name                String\n  startDate           DateTime\n  endDate             DateTime\n  institutionId       String\n  sections            Section[]\n  courseRegistrations CourseRegistration[]\n}\n\nmodel StudentApplicationProfile {\n  id String @id @default(uuid())\n\n  studentUserId String @unique\n  studentUser   User   @relation(fields: [studentUserId], references: [id])\n\n  headline        String\n  about           String\n  documentUrls    String[]\n  academicRecords Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_application_profiles")\n}\n\nmodel StudentAdmissionApplication {\n  id String @id @default(uuid())\n\n  coverLetter         String?\n  status              StudentAdmissionApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                          @default(now())\n\n  postingId String\n  posting   StudentAdmissionPost @relation(fields: [postingId], references: [id])\n\n  studentUserId String\n  studentUser   User   @relation("StudentAdmissionApplicant", fields: [studentUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("StudentAdmissionReviewer", fields: [reviewerUserId], references: [id])\n\n  studentProfileId String?\n  studentProfile   StudentProfile? @relation(fields: [studentProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, studentUserId])\n  @@index([studentUserId])\n  @@index([status])\n  @@map("student_admission_applications")\n}\n\nmodel StudentProfile {\n  id         String  @id @default(uuid())\n  studentsId String  @unique\n  bio        String?\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  courseRegistrations   CourseRegistration[]\n  classworkSubmissions  StudentClassworkSubmission[]\n  admissionApplications StudentAdmissionApplication[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("student_profiles")\n}\n\nmodel TeacherMark {\n  id String @id @default(uuid())\n\n  courseRegistrationId String             @unique\n  courseRegistration   CourseRegistration @relation(fields: [courseRegistrationId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  labReport     Float?\n  labTask       Float?\n  project       Float?\n  projectReport Float?\n  presentation  Float?\n  labEvaluation Float?\n  viva          Float?\n\n  quiz1      Float?\n  quiz2      Float?\n  quiz3      Float?\n  assignment Float?\n  midterm    Float?\n  finalExam  Float?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("teacher_marks")\n}\n\nmodel TeacherJobApplication {\n  id                  String                      @id @default(uuid())\n  coverLetter         String?\n  status              TeacherJobApplicationStatus @default(PENDING)\n  institutionResponse String?\n  reviewedAt          DateTime?\n  appliedAt           DateTime                    @default(now())\n\n  postingId String\n  posting   TeacherJobPost @relation(fields: [postingId], references: [id])\n\n  teacherUserId String\n  teacherUser   User   @relation("TeacherJobApplicationApplicant", fields: [teacherUserId], references: [id])\n\n  reviewerUserId String?\n  reviewerUser   User?   @relation("TeacherJobApplicationReviewer", fields: [reviewerUserId], references: [id])\n\n  teacherProfileId String?\n  teacherProfile   TeacherProfile? @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([postingId, teacherUserId])\n  @@index([teacherUserId])\n  @@index([institutionId, status])\n  @@map("teacher_job_applications")\n}\n\nmodel TeacherClasswork {\n  id      String               @id @default(uuid())\n  title   String\n  content String?\n  type    TeacherClassworkType\n  dueAt   DateTime?\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  submissions StudentClassworkSubmission[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([teacherProfileId, createdAt])\n  @@index([sectionId, type])\n  @@map("teacher_classworks")\n}\n\nmodel StudentClassworkSubmission {\n  id String @id @default(uuid())\n\n  classworkId String\n  classwork   TeacherClasswork @relation(fields: [classworkId], references: [id])\n\n  studentProfileId String\n  studentProfile   StudentProfile @relation(fields: [studentProfileId], references: [id])\n\n  responseText   String?\n  attachmentUrl  String?\n  attachmentName String?\n  submittedAt    DateTime @default(now())\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([classworkId, studentProfileId])\n  @@index([studentProfileId, submittedAt])\n  @@index([institutionId])\n  @@map("student_classwork_submissions")\n}\n\nmodel SectionCourseTeacherAssignment {\n  id String @id @default(uuid())\n\n  sectionId String\n  section   Section @relation(fields: [sectionId], references: [id])\n\n  courseId String\n  course   Course @relation(fields: [courseId], references: [id])\n\n  teacherProfileId String\n  teacherProfile   TeacherProfile @relation(fields: [teacherProfileId], references: [id])\n\n  institutionId String\n  institution   Institution @relation(fields: [institutionId], references: [id])\n\n  departmentId String?\n  department   Department? @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sectionId, courseId])\n  @@index([teacherProfileId, createdAt])\n  @@index([institutionId])\n  @@map("section_course_teacher_assignments")\n}\n\nmodel TeacherApplicationProfile {\n  id String @id @default(uuid())\n\n  teacherUserId String @unique\n  teacherUser   User   @relation(fields: [teacherUserId], references: [id])\n\n  headline     String\n  about        String\n  resumeUrl    String\n  portfolioUrl String?\n\n  skills          String[]\n  certifications  String[]\n  academicRecords Json\n  experiences     Json\n\n  isComplete Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_application_profiles")\n}\n\nmodel TeacherProfile {\n  id                        String                           @id @default(uuid())\n  teacherInitial            String                           @unique\n  teachersId                String                           @unique\n  designation               String\n  bio                       String?\n  institutionId             String\n  institution               Institution                      @relation(fields: [institutionId], references: [id])\n  courseRegistrations       CourseRegistration[]\n  sectionTeacherAssignments SectionCourseTeacherAssignment[]\n  classworks                TeacherClasswork[]\n  jobApplications           TeacherJobApplication[]\n  marks                     TeacherMark[]\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("teacher_profiles")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"AdminRole"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"AdminProfileToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profiles"},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"AttendanceToCourseRegistration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"attendances"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationApplicant"},{"name":"reviewedInstitutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionApplicationReviewedBy"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewedTeacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherApplicationProfile","kind":"object","type":"TeacherApplicationProfile","relationName":"TeacherApplicationProfileToUser"},{"name":"studentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicant"},{"name":"reviewedStudentAdmissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionReviewer"},{"name":"studentApplicationProfile","kind":"object","type":"StudentApplicationProfile","relationName":"StudentApplicationProfileToUser"},{"name":"contactNo","kind":"scalar","type":"String"},{"name":"presentAddress","kind":"scalar","type":"String"},{"name":"permanentAddress","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"accountStatus","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"BatchToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"BatchToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"batches"},"ClassRoom":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"roomNo","kind":"scalar","type":"String"},{"name":"floor","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"roomType","kind":"enum","type":"ClassRoomType"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"ClassRoomToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"routines","kind":"object","type":"Routine","relationName":"ClassRoomToRoutine"}],"dbName":"classrooms"},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseCode","kind":"scalar","type":"String"},{"name":"courseTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credits","kind":"scalar","type":"Int"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseToInstitution"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseToCourseRegistration"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CourseRegistration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"CourseRegistrationToRoutine"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToCourseRegistration"},{"name":"mark","kind":"object","type":"TeacherMark","relationName":"CourseRegistrationToTeacherMark"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseRegistration"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"CourseRegistrationToStudentProfile"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"CourseRegistrationToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseRegistrationToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseRegistrationToProgram"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseRegistrationToSemester"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"CourseRegistrationToInstitution"},{"name":"registrationDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"course_registrations"},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"faculty","kind":"object","type":"Faculty","relationName":"DepartmentToFaculty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"programs","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToDepartment"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"sections","kind":"object","type":"Section","relationName":"DepartmentToSection"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"DepartmentToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToDepartment"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"DepartmentToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"DepartmentToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"DepartmentToTeacherMark"}],"dbName":"departments"},"Faculty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"FacultyToInstitution"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"departments","kind":"object","type":"Department","relationName":"DepartmentToFaculty"}],"dbName":"faculties"},"Institution":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"faculties","kind":"object","type":"Faculty","relationName":"FacultyToInstitution"},{"name":"programs","kind":"object","type":"Program","relationName":"InstitutionToProgram"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToInstitution"},{"name":"classrooms","kind":"object","type":"ClassRoom","relationName":"ClassRoomToInstitution"},{"name":"sections","kind":"object","type":"Section","relationName":"InstitutionToSection"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToInstitution"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToInstitution"},{"name":"teacherProfiles","kind":"object","type":"TeacherProfile","relationName":"InstitutionToTeacherProfile"},{"name":"studentProfiles","kind":"object","type":"StudentProfile","relationName":"InstitutionToStudentProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToInstitution"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"institutionApplications","kind":"object","type":"InstitutionApplication","relationName":"InstitutionToInstitutionApplication"},{"name":"teacherJobApplications","kind":"object","type":"TeacherJobApplication","relationName":"InstitutionToTeacherJobApplication"},{"name":"teacherClassworks","kind":"object","type":"TeacherClasswork","relationName":"InstitutionToTeacherClasswork"},{"name":"studentClassworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"teacherMarks","kind":"object","type":"TeacherMark","relationName":"InstitutionToTeacherMark"}],"dbName":"institutions"},"InstitutionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"applicantUserId","kind":"scalar","type":"String"},{"name":"applicantUser","kind":"object","type":"User","relationName":"InstitutionApplicationApplicant"},{"name":"institutionName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortName","kind":"scalar","type":"String"},{"name":"institutionType","kind":"enum","type":"InstitutionType"},{"name":"institutionLogo","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InstitutionApplicationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"reviewedByUserId","kind":"scalar","type":"String"},{"name":"reviewedByUser","kind":"object","type":"User","relationName":"InstitutionApplicationReviewedBy"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToInstitutionApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"institution_applications"},"TeacherJobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_posts"},"StudentAdmissionPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"summary","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"facultyId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"applications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_posts"},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"shortTitle","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"DateTime"},{"name":"credits","kind":"scalar","type":"Float"},{"name":"cost","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToProgram"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToProgram"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"programs"},"Routine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"version","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"RoutineToSchedule"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToRoutine"},{"name":"classRoomId","kind":"scalar","type":"String"},{"name":"classRoom","kind":"object","type":"ClassRoom","relationName":"ClassRoomToRoutine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"routines"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"routine","kind":"object","type":"Routine","relationName":"RoutineToSchedule"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"schedules"},"Section":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sectionCapacity","kind":"scalar","type":"Int"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSection"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"SectionToTeacherClasswork"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSection"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSection"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"SectionToSemester"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sections"},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"sections","kind":"object","type":"Section","relationName":"SectionToSemester"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToSemester"}],"dbName":null},"StudentApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"documentUrls","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_application_profiles"},"StudentAdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"StudentAdmissionApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"StudentAdmissionPost","relationName":"StudentAdmissionApplicationToStudentAdmissionPost"},{"name":"studentUserId","kind":"scalar","type":"String"},{"name":"studentUser","kind":"object","type":"User","relationName":"StudentAdmissionApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"StudentAdmissionReviewer"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_admission_applications"},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentsId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToStudentProfile"},{"name":"classworkSubmissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"admissionApplications","kind":"object","type":"StudentAdmissionApplication","relationName":"StudentAdmissionApplicationToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_profiles"},"TeacherMark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseRegistrationId","kind":"scalar","type":"String"},{"name":"courseRegistration","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherMark"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherMarkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherMark"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherMark"},{"name":"labReport","kind":"scalar","type":"Float"},{"name":"labTask","kind":"scalar","type":"Float"},{"name":"project","kind":"scalar","type":"Float"},{"name":"projectReport","kind":"scalar","type":"Float"},{"name":"presentation","kind":"scalar","type":"Float"},{"name":"labEvaluation","kind":"scalar","type":"Float"},{"name":"viva","kind":"scalar","type":"Float"},{"name":"quiz1","kind":"scalar","type":"Float"},{"name":"quiz2","kind":"scalar","type":"Float"},{"name":"quiz3","kind":"scalar","type":"Float"},{"name":"assignment","kind":"scalar","type":"Float"},{"name":"midterm","kind":"scalar","type":"Float"},{"name":"finalExam","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_marks"},"TeacherJobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"coverLetter","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TeacherJobApplicationStatus"},{"name":"institutionResponse","kind":"scalar","type":"String"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"appliedAt","kind":"scalar","type":"DateTime"},{"name":"postingId","kind":"scalar","type":"String"},{"name":"posting","kind":"object","type":"TeacherJobPost","relationName":"TeacherJobApplicationToTeacherJobPost"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherJobApplicationApplicant"},{"name":"reviewerUserId","kind":"scalar","type":"String"},{"name":"reviewerUser","kind":"object","type":"User","relationName":"TeacherJobApplicationReviewer"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherJobApplication"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherJobApplication"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_job_applications"},"TeacherClasswork":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"TeacherClassworkType"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToTeacherClasswork"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"TeacherClassworkToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherClasswork"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherClasswork"},{"name":"submissions","kind":"object","type":"StudentClassworkSubmission","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_classworks"},"StudentClassworkSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"classworkId","kind":"scalar","type":"String"},{"name":"classwork","kind":"object","type":"TeacherClasswork","relationName":"StudentClassworkSubmissionToTeacherClasswork"},{"name":"studentProfileId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentClassworkSubmissionToStudentProfile"},{"name":"responseText","kind":"scalar","type":"String"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"attachmentName","kind":"scalar","type":"String"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToStudentClassworkSubmission"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentClassworkSubmission"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classwork_submissions"},"SectionCourseTeacherAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sectionId","kind":"scalar","type":"String"},{"name":"section","kind":"object","type":"Section","relationName":"SectionToSectionCourseTeacherAssignment"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToSectionCourseTeacherAssignment"},{"name":"teacherProfileId","kind":"scalar","type":"String"},{"name":"teacherProfile","kind":"object","type":"TeacherProfile","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToSectionCourseTeacherAssignment"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToSectionCourseTeacherAssignment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"section_course_teacher_assignments"},"TeacherApplicationProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherUserId","kind":"scalar","type":"String"},{"name":"teacherUser","kind":"object","type":"User","relationName":"TeacherApplicationProfileToUser"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"resumeUrl","kind":"scalar","type":"String"},{"name":"portfolioUrl","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"certifications","kind":"scalar","type":"String"},{"name":"academicRecords","kind":"scalar","type":"Json"},{"name":"experiences","kind":"scalar","type":"Json"},{"name":"isComplete","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_application_profiles"},"TeacherProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"teacherInitial","kind":"scalar","type":"String"},{"name":"teachersId","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"institutionId","kind":"scalar","type":"String"},{"name":"institution","kind":"object","type":"Institution","relationName":"InstitutionToTeacherProfile"},{"name":"courseRegistrations","kind":"object","type":"CourseRegistration","relationName":"CourseRegistrationToTeacherProfile"},{"name":"sectionTeacherAssignments","kind":"object","type":"SectionCourseTeacherAssignment","relationName":"SectionCourseTeacherAssignmentToTeacherProfile"},{"name":"classworks","kind":"object","type":"TeacherClasswork","relationName":"TeacherClassworkToTeacherProfile"},{"name":"jobApplications","kind":"object","type":"TeacherJobApplication","relationName":"TeacherJobApplicationToTeacherProfile"},{"name":"marks","kind":"object","type":"TeacherMark","relationName":"TeacherMarkToTeacherProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToTeacherProfile"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"teacher_profiles"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","adminProfile","institution","faculty","department","program","routine","_count","schedule","courseRegistration","routines","classRoom","attendances","teacherProfile","mark","course","courseRegistrations","section","sectionTeacherAssignments","classworks","sections","semester","batch","submissions","classwork","studentProfile","classworkSubmissions","applications","posting","studentUser","reviewerUser","admissionApplications","programs","batches","courses","teacherProfiles","studentProfiles","teacherUser","teacherJobApplications","teacherClassworks","studentClassworkSubmissions","teacherMarks","departments","faculties","classrooms","applicantUser","reviewedByUser","institutionApplications","jobApplications","marks","reviewedInstitutionApplications","reviewedTeacherJobApplications","teacherApplicationProfile","studentAdmissionApplications","reviewedStudentAdmissionApplications","studentApplicationProfile","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","data","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","create","update","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","having","_min","_max","AdminProfile.groupBy","AdminProfile.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","ClassRoom.findUnique","ClassRoom.findUniqueOrThrow","ClassRoom.findFirst","ClassRoom.findFirstOrThrow","ClassRoom.findMany","ClassRoom.createOne","ClassRoom.createMany","ClassRoom.createManyAndReturn","ClassRoom.updateOne","ClassRoom.updateMany","ClassRoom.updateManyAndReturn","ClassRoom.upsertOne","ClassRoom.deleteOne","ClassRoom.deleteMany","_avg","_sum","ClassRoom.groupBy","ClassRoom.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseRegistration.findUnique","CourseRegistration.findUniqueOrThrow","CourseRegistration.findFirst","CourseRegistration.findFirstOrThrow","CourseRegistration.findMany","CourseRegistration.createOne","CourseRegistration.createMany","CourseRegistration.createManyAndReturn","CourseRegistration.updateOne","CourseRegistration.updateMany","CourseRegistration.updateManyAndReturn","CourseRegistration.upsertOne","CourseRegistration.deleteOne","CourseRegistration.deleteMany","CourseRegistration.groupBy","CourseRegistration.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Faculty.findUnique","Faculty.findUniqueOrThrow","Faculty.findFirst","Faculty.findFirstOrThrow","Faculty.findMany","Faculty.createOne","Faculty.createMany","Faculty.createManyAndReturn","Faculty.updateOne","Faculty.updateMany","Faculty.updateManyAndReturn","Faculty.upsertOne","Faculty.deleteOne","Faculty.deleteMany","Faculty.groupBy","Faculty.aggregate","Institution.findUnique","Institution.findUniqueOrThrow","Institution.findFirst","Institution.findFirstOrThrow","Institution.findMany","Institution.createOne","Institution.createMany","Institution.createManyAndReturn","Institution.updateOne","Institution.updateMany","Institution.updateManyAndReturn","Institution.upsertOne","Institution.deleteOne","Institution.deleteMany","Institution.groupBy","Institution.aggregate","InstitutionApplication.findUnique","InstitutionApplication.findUniqueOrThrow","InstitutionApplication.findFirst","InstitutionApplication.findFirstOrThrow","InstitutionApplication.findMany","InstitutionApplication.createOne","InstitutionApplication.createMany","InstitutionApplication.createManyAndReturn","InstitutionApplication.updateOne","InstitutionApplication.updateMany","InstitutionApplication.updateManyAndReturn","InstitutionApplication.upsertOne","InstitutionApplication.deleteOne","InstitutionApplication.deleteMany","InstitutionApplication.groupBy","InstitutionApplication.aggregate","TeacherJobPost.findUnique","TeacherJobPost.findUniqueOrThrow","TeacherJobPost.findFirst","TeacherJobPost.findFirstOrThrow","TeacherJobPost.findMany","TeacherJobPost.createOne","TeacherJobPost.createMany","TeacherJobPost.createManyAndReturn","TeacherJobPost.updateOne","TeacherJobPost.updateMany","TeacherJobPost.updateManyAndReturn","TeacherJobPost.upsertOne","TeacherJobPost.deleteOne","TeacherJobPost.deleteMany","TeacherJobPost.groupBy","TeacherJobPost.aggregate","StudentAdmissionPost.findUnique","StudentAdmissionPost.findUniqueOrThrow","StudentAdmissionPost.findFirst","StudentAdmissionPost.findFirstOrThrow","StudentAdmissionPost.findMany","StudentAdmissionPost.createOne","StudentAdmissionPost.createMany","StudentAdmissionPost.createManyAndReturn","StudentAdmissionPost.updateOne","StudentAdmissionPost.updateMany","StudentAdmissionPost.updateManyAndReturn","StudentAdmissionPost.upsertOne","StudentAdmissionPost.deleteOne","StudentAdmissionPost.deleteMany","StudentAdmissionPost.groupBy","StudentAdmissionPost.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Routine.findUnique","Routine.findUniqueOrThrow","Routine.findFirst","Routine.findFirstOrThrow","Routine.findMany","Routine.createOne","Routine.createMany","Routine.createManyAndReturn","Routine.updateOne","Routine.updateMany","Routine.updateManyAndReturn","Routine.upsertOne","Routine.deleteOne","Routine.deleteMany","Routine.groupBy","Routine.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Section.findUnique","Section.findUniqueOrThrow","Section.findFirst","Section.findFirstOrThrow","Section.findMany","Section.createOne","Section.createMany","Section.createManyAndReturn","Section.updateOne","Section.updateMany","Section.updateManyAndReturn","Section.upsertOne","Section.deleteOne","Section.deleteMany","Section.groupBy","Section.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentApplicationProfile.findUnique","StudentApplicationProfile.findUniqueOrThrow","StudentApplicationProfile.findFirst","StudentApplicationProfile.findFirstOrThrow","StudentApplicationProfile.findMany","StudentApplicationProfile.createOne","StudentApplicationProfile.createMany","StudentApplicationProfile.createManyAndReturn","StudentApplicationProfile.updateOne","StudentApplicationProfile.updateMany","StudentApplicationProfile.updateManyAndReturn","StudentApplicationProfile.upsertOne","StudentApplicationProfile.deleteOne","StudentApplicationProfile.deleteMany","StudentApplicationProfile.groupBy","StudentApplicationProfile.aggregate","StudentAdmissionApplication.findUnique","StudentAdmissionApplication.findUniqueOrThrow","StudentAdmissionApplication.findFirst","StudentAdmissionApplication.findFirstOrThrow","StudentAdmissionApplication.findMany","StudentAdmissionApplication.createOne","StudentAdmissionApplication.createMany","StudentAdmissionApplication.createManyAndReturn","StudentAdmissionApplication.updateOne","StudentAdmissionApplication.updateMany","StudentAdmissionApplication.updateManyAndReturn","StudentAdmissionApplication.upsertOne","StudentAdmissionApplication.deleteOne","StudentAdmissionApplication.deleteMany","StudentAdmissionApplication.groupBy","StudentAdmissionApplication.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","TeacherMark.findUnique","TeacherMark.findUniqueOrThrow","TeacherMark.findFirst","TeacherMark.findFirstOrThrow","TeacherMark.findMany","TeacherMark.createOne","TeacherMark.createMany","TeacherMark.createManyAndReturn","TeacherMark.updateOne","TeacherMark.updateMany","TeacherMark.updateManyAndReturn","TeacherMark.upsertOne","TeacherMark.deleteOne","TeacherMark.deleteMany","TeacherMark.groupBy","TeacherMark.aggregate","TeacherJobApplication.findUnique","TeacherJobApplication.findUniqueOrThrow","TeacherJobApplication.findFirst","TeacherJobApplication.findFirstOrThrow","TeacherJobApplication.findMany","TeacherJobApplication.createOne","TeacherJobApplication.createMany","TeacherJobApplication.createManyAndReturn","TeacherJobApplication.updateOne","TeacherJobApplication.updateMany","TeacherJobApplication.updateManyAndReturn","TeacherJobApplication.upsertOne","TeacherJobApplication.deleteOne","TeacherJobApplication.deleteMany","TeacherJobApplication.groupBy","TeacherJobApplication.aggregate","TeacherClasswork.findUnique","TeacherClasswork.findUniqueOrThrow","TeacherClasswork.findFirst","TeacherClasswork.findFirstOrThrow","TeacherClasswork.findMany","TeacherClasswork.createOne","TeacherClasswork.createMany","TeacherClasswork.createManyAndReturn","TeacherClasswork.updateOne","TeacherClasswork.updateMany","TeacherClasswork.updateManyAndReturn","TeacherClasswork.upsertOne","TeacherClasswork.deleteOne","TeacherClasswork.deleteMany","TeacherClasswork.groupBy","TeacherClasswork.aggregate","StudentClassworkSubmission.findUnique","StudentClassworkSubmission.findUniqueOrThrow","StudentClassworkSubmission.findFirst","StudentClassworkSubmission.findFirstOrThrow","StudentClassworkSubmission.findMany","StudentClassworkSubmission.createOne","StudentClassworkSubmission.createMany","StudentClassworkSubmission.createManyAndReturn","StudentClassworkSubmission.updateOne","StudentClassworkSubmission.updateMany","StudentClassworkSubmission.updateManyAndReturn","StudentClassworkSubmission.upsertOne","StudentClassworkSubmission.deleteOne","StudentClassworkSubmission.deleteMany","StudentClassworkSubmission.groupBy","StudentClassworkSubmission.aggregate","SectionCourseTeacherAssignment.findUnique","SectionCourseTeacherAssignment.findUniqueOrThrow","SectionCourseTeacherAssignment.findFirst","SectionCourseTeacherAssignment.findFirstOrThrow","SectionCourseTeacherAssignment.findMany","SectionCourseTeacherAssignment.createOne","SectionCourseTeacherAssignment.createMany","SectionCourseTeacherAssignment.createManyAndReturn","SectionCourseTeacherAssignment.updateOne","SectionCourseTeacherAssignment.updateMany","SectionCourseTeacherAssignment.updateManyAndReturn","SectionCourseTeacherAssignment.upsertOne","SectionCourseTeacherAssignment.deleteOne","SectionCourseTeacherAssignment.deleteMany","SectionCourseTeacherAssignment.groupBy","SectionCourseTeacherAssignment.aggregate","TeacherApplicationProfile.findUnique","TeacherApplicationProfile.findUniqueOrThrow","TeacherApplicationProfile.findFirst","TeacherApplicationProfile.findFirstOrThrow","TeacherApplicationProfile.findMany","TeacherApplicationProfile.createOne","TeacherApplicationProfile.createMany","TeacherApplicationProfile.createManyAndReturn","TeacherApplicationProfile.updateOne","TeacherApplicationProfile.updateMany","TeacherApplicationProfile.updateManyAndReturn","TeacherApplicationProfile.upsertOne","TeacherApplicationProfile.deleteOne","TeacherApplicationProfile.deleteMany","TeacherApplicationProfile.groupBy","TeacherApplicationProfile.aggregate","TeacherProfile.findUnique","TeacherProfile.findUniqueOrThrow","TeacherProfile.findFirst","TeacherProfile.findFirstOrThrow","TeacherProfile.findMany","TeacherProfile.createOne","TeacherProfile.createMany","TeacherProfile.createManyAndReturn","TeacherProfile.updateOne","TeacherProfile.updateMany","TeacherProfile.updateManyAndReturn","TeacherProfile.upsertOne","TeacherProfile.deleteOne","TeacherProfile.deleteMany","TeacherProfile.groupBy","TeacherProfile.aggregate","AND","OR","NOT","id","teacherInitial","teachersId","designation","bio","institutionId","departmentId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","teacherUserId","headline","about","resumeUrl","portfolioUrl","skills","certifications","academicRecords","experiences","isComplete","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","has","hasEvery","hasSome","sectionId","courseId","teacherProfileId","classworkId","studentProfileId","responseText","attachmentUrl","attachmentName","submittedAt","title","content","TeacherClassworkType","type","dueAt","coverLetter","TeacherJobApplicationStatus","status","institutionResponse","reviewedAt","appliedAt","postingId","reviewerUserId","courseRegistrationId","labReport","labTask","project","projectReport","presentation","labEvaluation","viva","quiz1","quiz2","quiz3","assignment","midterm","finalExam","studentsId","StudentAdmissionApplicationStatus","studentUserId","documentUrls","name","startDate","endDate","every","some","none","description","sectionCapacity","semesterId","batchId","startTime","endTime","SlotStatus","version","scheduleId","classRoomId","shortTitle","duration","credits","cost","location","summary","details","facultyId","programId","createdByUserId","applicantUserId","institutionName","shortName","InstitutionType","institutionType","institutionLogo","InstitutionApplicationStatus","rejectionReason","reviewedByUserId","fullName","registrationDate","courseCode","courseTitle","roomNo","floor","capacity","ClassRoomType","roomType","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","contactNo","presentAddress","permanentAddress","bloodGroup","gender","role","accountStatus","date","AttendanceStatus","AdminRole","postingId_teacherUserId","postingId_studentUserId","sectionId_courseId","classworkId_studentProfileId","courseRegistrationId_date","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "7xSUAvADCwMAAOIHACAHAADOCAAgtQQAAIAJADC2BAAACwAQtwQAAIAJADC4BAEAAAABvQQBAN0HACG_BAEAAAABwARAAOEHACHBBEAA4QcAIcsFAACBCdAFIgEAAAABACAMAwAA4gcAILUEAACDCQAwtgQAAAMAELcEAACDCQAwuAQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACG2BUAA4QcAIcAFAQDdBwAhwQUBAN4HACHCBQEA3gcAIQMDAADPCgAgwQUAAIQJACDCBQAAhAkAIAwDAADiBwAgtQQAAIMJADC2BAAAAwAQtwQAAIMJADC4BAEAAAABvwQBAN0HACHABEAA4QcAIcEEQADhBwAhtgVAAOEHACHABQEAAAABwQUBAN4HACHCBQEA3gcAIQMAAAADACABAAAEADACAAAFACARAwAA4gcAILUEAACCCQAwtgQAAAcAELcEAACCCQAwuAQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACG3BQEA3QcAIbgFAQDdBwAhuQUBAN4HACG6BQEA3gcAIbsFAQDeBwAhvAVAAMgIACG9BUAAyAgAIb4FAQDeBwAhvwUBAN4HACEIAwAAzwoAILkFAACECQAgugUAAIQJACC7BQAAhAkAILwFAACECQAgvQUAAIQJACC-BQAAhAkAIL8FAACECQAgEQMAAOIHACC1BAAAggkAMLYEAAAHABC3BAAAggkAMLgEAQAAAAG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACG3BQEA3QcAIbgFAQDdBwAhuQUBAN4HACG6BQEA3gcAIbsFAQDeBwAhvAVAAMgIACG9BUAAyAgAIb4FAQDeBwAhvwUBAN4HACEDAAAABwAgAQAACAAwAgAACQAgCwMAAOIHACAHAADOCAAgtQQAAIAJADC2BAAACwAQtwQAAIAJADC4BAEA3QcAIb0EAQDdBwAhvwQBAN0HACHABEAA4QcAIcEEQADhBwAhywUAAIEJ0AUiAgMAAM8KACAHAADIEQAgAwAAAAsAIAEAAAwAMAIAAAEAIBUDAADiBwAgBwAAzggAIAkAAPkIACAVAAD-BwAgFwAAowgAIBgAAKUIACA1AACQCAAgNgAApwgAILUEAAD_CAAwtgQAAA4AELcEAAD_CAAwuAQBAN0HACG5BAEA3QcAIboEAQDdBwAhuwQBAN0HACG8BAEA3gcAIb0EAQDdBwAhvgQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACEJAwAAzwoAIAcAAMgRACAJAADLEQAgFQAA8AsAIBcAAPwPACAYAAD-DwAgNQAA6gwAIDYAAIAQACC8BAAAhAkAIBUDAADiBwAgBwAAzggAIAkAAPkIACAVAAD-BwAgFwAAowgAIBgAAKUIACA1AACQCAAgNgAApwgAILUEAAD_CAAwtgQAAA4AELcEAAD_CAAwuAQBAAAAAbkEAQAAAAG6BAEAAAABuwQBAN0HACG8BAEA3gcAIb0EAQDdBwAhvgQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACEDAAAADgAgAQAADwAwAgAAEAAgDAcAAMoIACAvAAD-CAAgtQQAAP0IADC2BAAAEgAQtwQAAP0IADC4BAEA3QcAIb0EAQDeBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhpAUBAN4HACGrBQEA3QcAIQUHAADIEQAgLwAA2hEAIL0EAACECQAgjgUAAIQJACCkBQAAhAkAIAwHAADKCAAgLwAA_ggAILUEAAD9CAAwtgQAABIAELcEAAD9CAAwuAQBAAAAAb0EAQDeBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhpAUBAN4HACGrBQEA3QcAIQMAAAASACABAAATADACAAAUACAbBgAAoAgAIBUAAP4HACAXAACjCAAgGQAA_QcAICUAAJwIACAmAACdCAAgJwAAnwgAICgAAKEIACApAACiCAAgKwAAkAgAICwAAKUIACAtAACmCAAgLgAApwgAIDAAAJsIACAxAACeCAAgNAAApAgAILUEAACZCAAwtgQAABYAELcEAACZCAAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAh7AQAAJoIpgUjiAUBAN0HACGOBQEA3gcAIaQFAQDeBwAhpwUBAN4HACEBAAAAFgAgFwgAAPwIACAVAAD-BwAgFwAAowgAIBkAAP0HACAlAACcCAAgJgAAnQgAICcAAJ8IACAoAAChCAAgKQAAoggAICsAAJAIACAsAAClCAAgLQAApggAIC4AAKcIACC1BAAA-wgAMLYEAAAYABC3BAAA-wgAMLgEAQDdBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhnwUBAN4HACGkBQEA3gcAIasFAQDdBwAhEAgAANkRACAVAADwCwAgFwAA_A8AIBkAAO8LACAlAAD1DwAgJgAA9g8AICcAAPgPACAoAAD6DwAgKQAA-w8AICsAAOoMACAsAAD-DwAgLQAA_w8AIC4AAIAQACCOBQAAhAkAIJ8FAACECQAgpAUAAIQJACAXCAAA_AgAIBUAAP4HACAXAACjCAAgGQAA_QcAICUAAJwIACAmAACdCAAgJwAAnwgAICgAAKEIACApAACiCAAgKwAAkAgAICwAAKUIACAtAACmCAAgLgAApwgAILUEAAD7CAAwtgQAABgAELcEAAD7CAAwuAQBAAAAAcAEQADhBwAhwQRAAOEHACGOBQEA3gcAIZ8FAQDeBwAhpAUBAN4HACGrBQEA3QcAIQMAAAAYACABAAAZADACAAAaACABAAAAEgAgEgcAAM4IACAJAAD5CAAgFAAAnwgAIBUAAP4HACC1BAAA-ggAMLYEAAAdABC3BAAA-ggAMLgEAQDdBwAhvQQBAN0HACG-BAEA3QcAIcAEQADhBwAhwQRAAOEHACHpBAEA3QcAIY4FAQDeBwAhmAUBAN4HACGZBUAAyAgAIZoFCADQCAAhmwUIANAIACEJBwAAyBEAIAkAAMsRACAUAAD4DwAgFQAA8AsAII4FAACECQAgmAUAAIQJACCZBQAAhAkAIJoFAACECQAgmwUAAIQJACASBwAAzggAIAkAAPkIACAUAACfCAAgFQAA_gcAILUEAAD6CAAwtgQAAB0AELcEAAD6CAAwuAQBAAAAAb0EAQDdBwAhvgQBAN0HACHABEAA4QcAIcEEQADhBwAh6QQBAN0HACGOBQEA3gcAIZgFAQDeBwAhmQVAAMgIACGaBQgA0AgAIZsFCADQCAAhAwAAAB0AIAEAAB4AMAIAAB8AIBIHAADOCAAgCQAA-QgAIAoAAPcIACAVAAD-BwAgFwAAowgAILUEAAD4CAAwtgQAACEAELcEAAD4CAAwuAQBAN0HACG9BAEA3QcAIb4EAQDdBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhmgUCAOEIACGgBQEA3gcAIa0FAQDdBwAhrgUBAN0HACEIBwAAyBEAIAkAAMsRACAKAADYEQAgFQAA8AsAIBcAAPwPACCOBQAAhAkAIJoFAACECQAgoAUAAIQJACASBwAAzggAIAkAAPkIACAKAAD3CAAgFQAA_gcAIBcAAKMIACC1BAAA-AgAMLYEAAAhABC3BAAA-AgAMLgEAQAAAAG9BAEA3QcAIb4EAQDdBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhmgUCAOEIACGgBQEA3gcAIa0FAQAAAAGuBQEA3QcAIQMAAAAhACABAAAiADACAAAjACABAAAAHQAgGgcAAM4IACAJAADTCAAgCgAA9wgAIAsAAIgIACARAAD1CAAgEgAA0ggAIBMAAPYIACAUAADpCAAgFgAA5ggAIBoAAOIIACAeAADtCAAgtQQAAPQIADC2BAAAJgAQtwQAAPQIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4AQBAN0HACHhBAEA3QcAIeIEAQDdBwAh5AQBAN0HACGQBQEA3QcAIaAFAQDeBwAhrAVAAOEHACENBwAAyBEAIAkAAMsRACAKAADYEQAgCwAAiQwAIBEAANYRACASAADKEQAgEwAA1xEAIBQAANIRACAWAADREQAgGgAAzxEAIB4AAM4RACC-BAAAhAkAIKAFAACECQAgGgcAAM4IACAJAADTCAAgCgAA9wgAIAsAAIgIACARAAD1CAAgEgAA0ggAIBMAAPYIACAUAADpCAAgFgAA5ggAIBoAAOIIACAeAADtCAAgtQQAAPQIADC2BAAAJgAQtwQAAPQIADC4BAEAAAABvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHgBAEA3QcAIeEEAQDdBwAh4gQBAN0HACHkBAEA3QcAIZAFAQDdBwAhoAUBAN4HACGsBUAA4QcAIQMAAAAmACABAAAnADACAAAoACAPDQAA8ggAIA4AANEIACAQAADzCAAgtQQAAPEIADC2BAAAKgAQtwQAAPEIADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACH2BAEA3QcAIYgFAQDdBwAhjgUBAN4HACGVBQEA3gcAIZYFAQDdBwAhlwUBAN0HACEFDQAA1BEAIA4AAMkRACAQAADVEQAgjgUAAIQJACCVBQAAhAkAIA8NAADyCAAgDgAA0QgAIBAAAPMIACC1BAAA8QgAMLYEAAAqABC3BAAA8QgAMLgEAQAAAAHABEAA4QcAIcEEQADhBwAh9gQBAN0HACGIBQEA3QcAIY4FAQDeBwAhlQUBAN4HACGWBQEA3QcAIZcFAQDdBwAhAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACABAAAAKgAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACAKDgAA0QgAILUEAADvCAAwtgQAADIAELcEAADvCAAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAh8AQAAPAIzwUi9gQBAN0HACHNBUAA4QcAIQEOAADJEQAgCw4AANEIACC1BAAA7wgAMLYEAAAyABC3BAAA7wgAMLgEAQAAAAHABEAA4QcAIcEEQADhBwAh8AQAAPAIzwUi9gQBAN0HACHNBUAA4QcAIdQFAADuCAAgAwAAADIAIAEAADMAMAIAADQAIBsHAADOCAAgCQAA0wgAIA4AANEIACASAADSCAAgtQQAAM8IADC2BAAANgAQtwQAAM8IADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4gQBAN0HACH2BAEA3QcAIfcECADQCAAh-AQIANAIACH5BAgA0AgAIfoECADQCAAh-wQIANAIACH8BAgA0AgAIf0ECADQCAAh_gQIANAIACH_BAgA0AgAIYAFCADQCAAhgQUIANAIACGCBQgA0AgAIYMFCADQCAAhAQAAADYAIAEAAAAYACABAAAAGAAgAwAAACYAIAEAACcAMAIAACgAIBIHAADOCAAgCQAA0wgAIB0AAOwIACAeAADtCAAgtQQAAOsIADC2BAAAOwAQtwQAAOsIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4wQBAN0HACHkBAEA3QcAIeUEAQDeBwAh5gQBAN4HACHnBAEA3gcAIegEQADhBwAhCAcAAMgRACAJAADLEQAgHQAA0xEAIB4AAM4RACC-BAAAhAkAIOUEAACECQAg5gQAAIQJACDnBAAAhAkAIBMHAADOCAAgCQAA0wgAIB0AAOwIACAeAADtCAAgtQQAAOsIADC2BAAAOwAQtwQAAOsIADC4BAEAAAABvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHjBAEA3QcAIeQEAQDdBwAh5QQBAN4HACHmBAEA3gcAIecEAQDeBwAh6ARAAOEHACHTBQAA6ggAIAMAAAA7ACABAAA8ADACAAA9ACADAAAAJgAgAQAAJwAwAgAAKAAgEAcAAM4IACAJAADTCAAgEgAA0ggAIBQAAOkIACAWAADmCAAgtQQAAOgIADC2BAAAQAAQtwQAAOgIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4AQBAN0HACHhBAEA3QcAIeIEAQDdBwAhBgcAAMgRACAJAADLEQAgEgAAyhEAIBQAANIRACAWAADREQAgvgQAAIQJACARBwAAzggAIAkAANMIACASAADSCAAgFAAA6QgAIBYAAOYIACC1BAAA6AgAMLYEAABAABC3BAAA6AgAMLgEAQAAAAG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIeAEAQDdBwAh4QQBAN0HACHiBAEA3QcAIdIFAADnCAAgAwAAAEAAIAEAAEEAMAIAAEIAIAEAAAAYACATBwAAzggAIAkAANMIACASAADSCAAgFgAA5ggAIBwAAKYIACC1BAAA5AgAMLYEAABFABC3BAAA5AgAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHgBAEA3QcAIeIEAQDdBwAh6QQBAN0HACHqBAEA3gcAIewEAADlCOwEIu0EQADICAAhCAcAAMgRACAJAADLEQAgEgAAyhEAIBYAANERACAcAAD_DwAgvgQAAIQJACDqBAAAhAkAIO0EAACECQAgEwcAAM4IACAJAADTCAAgEgAA0ggAIBYAAOYIACAcAACmCAAgtQQAAOQIADC2BAAARQAQtwQAAOQIADC4BAEAAAABvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHgBAEA3QcAIeIEAQDdBwAh6QQBAN0HACHqBAEA3gcAIewEAADlCOwEIu0EQADICAAhAwAAAEUAIAEAAEYAMAIAAEcAIAEAAAAYACAUBwAAzggAIAkAANMIACAVAAD-BwAgFwAAowgAIBgAAKUIACAaAADiCAAgGwAA4wgAILUEAADgCAAwtgQAAEoAELcEAADgCAAwuAQBAN0HACG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhjgUBAN4HACGPBQIA4QgAIZAFAQDdBwAhkQUBAN4HACELBwAAyBEAIAkAAMsRACAVAADwCwAgFwAA_A8AIBgAAP4PACAaAADPEQAgGwAA0BEAIL4EAACECQAgjgUAAIQJACCPBQAAhAkAIJEFAACECQAgFAcAAM4IACAJAADTCAAgFQAA_gcAIBcAAKMIACAYAAClCAAgGgAA4ggAIBsAAOMIACC1BAAA4AgAMLYEAABKABC3BAAA4AgAMLgEAQAAAAG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhjgUBAN4HACGPBQIA4QgAIZAFAQDdBwAhkQUBAN4HACEDAAAASgAgAQAASwAwAgAATAAgAwAAACYAIAEAACcAMAIAACgAIAEAAABKACABAAAAJgAgDQcAAM4IACAJAADTCAAgGQAA_QcAILUEAADaCAAwtgQAAFEAELcEAADaCAAwuAQBAN0HACG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhjgUBAN4HACEBAAAAUQAgAQAAABgAIAMAAABKACABAABLADACAABMACABAAAASgAgAQAAACYAIAEAAABAACABAAAARQAgAQAAABgAIAMAAAA7ACABAAA8ADACAAA9ACABAAAAOwAgAQAAABgAIBMeAADfCAAgIQAA3ggAICIAAOIHACAjAADJCAAgtQQAANwIADC2BAAAXQAQtwQAANwIADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACHkBAEA3gcAIe4EAQDeBwAh8AQAAN0IhgUi8QQBAN4HACHyBEAAyAgAIfMEQADhBwAh9AQBAN0HACH1BAEA3gcAIYYFAQDdBwAhCR4AAM4RACAhAADNEQAgIgAAzwoAICMAAM8KACDkBAAAhAkAIO4EAACECQAg8QQAAIQJACDyBAAAhAkAIPUEAACECQAgFB4AAN8IACAhAADeCAAgIgAA4gcAICMAAMkIACC1BAAA3AgAMLYEAABdABC3BAAA3AgAMLgEAQAAAAHABEAA4QcAIcEEQADhBwAh5AQBAN4HACHuBAEA3gcAIfAEAADdCIYFIvEEAQDeBwAh8gRAAMgIACHzBEAA4QcAIfQEAQDdBwAh9QQBAN4HACGGBQEA3QcAIdEFAADbCAAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACABAAAAXQAgHwQAALoIACAFAAC7CAAgBgAAoAgAIBIAAKEIACAeAACiCAAgKwAAkAgAIDQAAKQIACA3AACkCAAgOAAAkAgAIDkAALwIACA6AACNCAAgOwAAjQgAIDwAAL0IACC1BAAAuQgAMLYEAABjABC3BAAAuQgAMLgEAQDdBwAhvAQBAN4HACHABEAA4QcAIcEEQADhBwAhiAUBAN0HACHDBQEA3QcAIcQFIADgBwAhxQUBAN4HACHGBQEA3gcAIccFAQDeBwAhyAUBAN4HACHJBQEA3gcAIcoFAQDeBwAhywUBAN0HACHMBQEA3QcAIQEAAABjACARAwAA4gcAIAcAAM4IACAJAADTCAAgFQAA_gcAIB8AAKYIACAkAACNCAAgtQQAANkIADC2BAAAZQAQtwQAANkIADC4BAEA3QcAIbwEAQDeBwAhvQQBAN0HACG-BAEA3gcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIYQFAQDdBwAhAQAAAGUAIAEAAAAmACABAAAAOwAgAQAAAF0AIAEAAAAYACABAAAAHQAgAQAAACoAIAEAAAAyACADAAAAQAAgAQAAQQAwAgAAQgAgAQAAACYAIAEAAABAACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAACEAIAEAAAAmACAFBwAAyBEAIAkAAMsRACAZAADvCwAgvgQAAIQJACCOBQAAhAkAIA0HAADOCAAgCQAA0wgAIBkAAP0HACC1BAAA2ggAMLYEAABRABC3BAAA2ggAMLgEAQAAAAG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhjgUBAN4HACEDAAAAUQAgAQAAdAAwAgAAdQAgAwAAACEAIAEAACIAMAIAACMAIAMAAABKACABAABLADACAABMACADAAAADgAgAQAADwAwAgAAEAAgCAMAAM8KACAHAADIEQAgCQAAyxEAIBUAAPALACAfAAD_DwAgJAAA2QwAILwEAACECQAgvgQAAIQJACARAwAA4gcAIAcAAM4IACAJAADTCAAgFQAA_gcAIB8AAKYIACAkAACNCAAgtQQAANkIADC2BAAAZQAQtwQAANkIADC4BAEAAAABvAQBAN4HACG9BAEA3QcAIb4EAQDeBwAhvwQBAN0HACHABEAA4QcAIcEEQADhBwAhhAUBAAAAAQMAAABlACABAAB6ADACAAB7ACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAAEAAIAEAAEEAMAIAAEIAIBcHAADOCAAgCQAA0wgAIBIAANgIACAhAADXCAAgIwAAyQgAICoAAOIHACC1BAAA1QgAMLYEAAB_ABC3BAAA1QgAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHNBAEA3QcAIeIEAQDeBwAh7gQBAN4HACHwBAAA1gjwBCLxBAEA3gcAIfIEQADICAAh8wRAAOEHACH0BAEA3QcAIfUEAQDeBwAhDAcAAMgRACAJAADLEQAgEgAAyhEAICEAAMwRACAjAADPCgAgKgAAzwoAIL4EAACECQAg4gQAAIQJACDuBAAAhAkAIPEEAACECQAg8gQAAIQJACD1BAAAhAkAIBgHAADOCAAgCQAA0wgAIBIAANgIACAhAADXCAAgIwAAyQgAICoAAOIHACC1BAAA1QgAMLYEAAB_ABC3BAAA1QgAMLgEAQAAAAG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIc0EAQDdBwAh4gQBAN4HACHuBAEA3gcAIfAEAADWCPAEIvEEAQDeBwAh8gRAAMgIACHzBEAA4QcAIfQEAQDdBwAh9QQBAN4HACHQBQAA1AgAIAMAAAB_ACABAACAAQAwAgAAgQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIAEAAAB_ACABAAAAYwAgAQAAAA4AIAEAAAAYACADAAAARQAgAQAARgAwAgAARwAgAwAAADsAIAEAADwAMAIAAD0AIBIHAADIEQAgCQAAyxEAIA4AAMkRACASAADKEQAgvgQAAIQJACD3BAAAhAkAIPgEAACECQAg-QQAAIQJACD6BAAAhAkAIPsEAACECQAg_AQAAIQJACD9BAAAhAkAIP4EAACECQAg_wQAAIQJACCABQAAhAkAIIEFAACECQAgggUAAIQJACCDBQAAhAkAIBsHAADOCAAgCQAA0wgAIA4AANEIACASAADSCAAgtQQAAM8IADC2BAAANgAQtwQAAM8IADC4BAEAAAABvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHiBAEA3QcAIfYEAQAAAAH3BAgA0AgAIfgECADQCAAh-QQIANAIACH6BAgA0AgAIfsECADQCAAh_AQIANAIACH9BAgA0AgAIf4ECADQCAAh_wQIANAIACGABQgA0AgAIYEFCADQCAAhggUIANAIACGDBQgA0AgAIQMAAAA2ACABAACKAQAwAgAAiwEAIAEAAAAdACABAAAAUQAgAQAAACEAIAEAAABKACABAAAADgAgAQAAAGUAIAEAAAAmACABAAAAQAAgAQAAAH8AIAEAAABFACABAAAAOwAgAQAAADYAIAEAAAAYACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAFEAIAEAAHQAMAIAAHUAIA4HAADOCAAgDwAAiAgAILUEAADLCAAwtgQAAJwBABC3BAAAywgAMLgEAQDdBwAhvQQBAN0HACHABEAA4QcAIcEEQADhBwAhiAUBAN4HACGvBQEA3QcAIbAFAQDdBwAhsQUCAMwIACGzBQAAzQizBSIDBwAAyBEAIA8AAIkMACCIBQAAhAkAIA4HAADOCAAgDwAAiAgAILUEAADLCAAwtgQAAJwBABC3BAAAywgAMLgEAQAAAAG9BAEA3QcAIcAEQADhBwAhwQRAAOEHACGIBQEA3gcAIa8FAQDdBwAhsAUBAN0HACGxBQIAzAgAIbMFAADNCLMFIgMAAACcAQAgAQAAnQEAMAIAAJ4BACADAAAASgAgAQAASwAwAgAATAAgAwAAACEAIAEAACIAMAIAACMAIAMAAAALACABAAAMADACAAABACADAAAADgAgAQAADwAwAgAAEAAgAwAAAGUAIAEAAHoAMAIAAHsAIAMAAAAmACABAAAnADACAAAoACADAAAAQAAgAQAAQQAwAgAAQgAgFAcAAMoIACAyAADiBwAgMwAAyQgAILUEAADGCAAwtgQAAKcBABC3BAAAxggAMLgEAQDdBwAhvQQBAN4HACHABEAA4QcAIcEEQADhBwAh8AQAAMcIqQUi8gRAAMgIACGOBQEA3gcAIaIFAQDdBwAhowUBAN0HACGkBQEA3gcAIaYFAACaCKYFI6cFAQDeBwAhqQUBAN4HACGqBQEA3gcAIQsHAADIEQAgMgAAzwoAIDMAAM8KACC9BAAAhAkAIPIEAACECQAgjgUAAIQJACCkBQAAhAkAIKYFAACECQAgpwUAAIQJACCpBQAAhAkAIKoFAACECQAgFAcAAMoIACAyAADiBwAgMwAAyQgAILUEAADGCAAwtgQAAKcBABC3BAAAxggAMLgEAQAAAAG9BAEA3gcAIcAEQADhBwAhwQRAAOEHACHwBAAAxwipBSLyBEAAyAgAIY4FAQDeBwAhogUBAN0HACGjBQEA3QcAIaQFAQDeBwAhpgUAAJoIpgUjpwUBAN4HACGpBQEA3gcAIaoFAQDeBwAhAwAAAKcBACABAACoAQAwAgAAqQEAIAEAAABjACABAAAAFgAgAwAAAH8AIAEAAIABADACAACBAQAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAAA7ACABAAA8ADACAAA9ACADAAAANgAgAQAAigEAMAIAAIsBACABAAAAEgAgAQAAAB0AIAEAAABRACABAAAAnAEAIAEAAABKACABAAAAIQAgAQAAAAsAIAEAAAAOACABAAAAZQAgAQAAACYAIAEAAABAACABAAAApwEAIAEAAAB_ACABAAAARQAgAQAAADsAIAEAAAA2ACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAAEAAIAEAAEEAMAIAAEIAIAMAAABFACABAABGADACAABHACADAAAAfwAgAQAAgAEAMAIAAIEBACADAAAANgAgAQAAigEAMAIAAIsBACABAAAAJgAgAQAAAEAAIAEAAABFACABAAAAfwAgAQAAADYAIAMAAABlACABAAB6ADACAAB7ACADAAAApwEAIAEAAKgBADACAACpAQAgAwAAAKcBACABAACoAQAwAgAAqQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIBEqAADiBwAgtQQAANwHADC2BAAA0AEAELcEAADcBwAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAhzQQBAN0HACHOBAEA3QcAIc8EAQDdBwAh0AQBAN0HACHRBAEA3gcAIdIEAADWBwAg0wQAANYHACDUBAAA3wcAINUEAADfBwAg1gQgAOAHACEBAAAA0AEAIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgDSIAAOIHACC1BAAA-gcAMLYEAADUAQAQtwQAAPoHADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACHOBAEA3QcAIc8EAQDdBwAh1AQAAN8HACDWBCAA4AcAIYYFAQDdBwAhhwUAANYHACABAAAA1AEAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAOACABAAAAZQAgAQAAAKcBACABAAAApwEAIAEAAAB_ACABAAAAfwAgAQAAAF0AIAEAAABdACABAAAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACADAAAACwAgAQAADAAwAgAAAQAgCAMAAPENACAHAACWEQAguAQBAAAAAb0EAQAAAAG_BAEAAAABwARAAAAAAcEEQAAAAAHLBQAAANAFAgFCAADlAQAgBrgEAQAAAAG9BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABywUAAADQBQIBQgAA5wEAMAFCAADnAQAwCAMAAO8NACAHAACUEQAguAQBAIgJACG9BAEAiAkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIcsFAADtDdAFIgIAAAABACBCAADqAQAgBrgEAQCICQAhvQQBAIgJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACHLBQAA7Q3QBSICAAAACwAgQgAA7AEAIAIAAAALACBCAADsAQAgAwAAAAEAIEkAAOUBACBKAADqAQAgAQAAAAEAIAEAAAALACADDAAAxREAIE8AAMcRACBQAADGEQAgCbUEAADCCAAwtgQAAPMBABC3BAAAwggAMLgEAQDKBwAhvQQBAMoHACG_BAEAygcAIcAEQADMBwAhwQRAAMwHACHLBQAAwwjQBSIDAAAACwAgAQAA8gEAME4AAPMBACADAAAACwAgAQAADAAwAgAAAQAgAQAAADQAIAEAAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAMAAAAyACABAAAzADACAAA0ACAHDgAAxBEAILgEAQAAAAHABEAAAAABwQRAAAAAAfAEAAAAzwUC9gQBAAAAAc0FQAAAAAEBQgAA-wEAIAa4BAEAAAABwARAAAAAAcEEQAAAAAHwBAAAAM8FAvYEAQAAAAHNBUAAAAABAUIAAP0BADABQgAA_QEAMAcOAADDEQAguAQBAIgJACHABEAAigkAIcEEQACKCQAh8AQAAJ8KzwUi9gQBAIgJACHNBUAAigkAIQIAAAA0ACBCAACAAgAgBrgEAQCICQAhwARAAIoJACHBBEAAigkAIfAEAACfCs8FIvYEAQCICQAhzQVAAIoJACECAAAAMgAgQgAAggIAIAIAAAAyACBCAACCAgAgAwAAADQAIEkAAPsBACBKAACAAgAgAQAAADQAIAEAAAAyACADDAAAwBEAIE8AAMIRACBQAADBEQAgCbUEAAC-CAAwtgQAAIkCABC3BAAAvggAMLgEAQDKBwAhwARAAMwHACHBBEAAzAcAIfAEAAC_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_BAEAAAABwARAAAAAAcEEQAAAAAG2BUAAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABAUIAAKsCADABQgAAqwIAMAkDAACoEAAguAQBAIgJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACG2BUAAigkAIcAFAQCICQAhwQUBAIkJACHCBQEAiQkAIQIAAAAFACBCAACuAgAgCLgEAQCICQAhvwQBAIgJACHABEAAigkAIcEEQACKCQAhtgVAAIoJACHABQEAiAkAIcEFAQCJCQAhwgUBAIkJACECAAAAAwAgQgAAsAIAIAIAAAADACBCAACwAgAgAwAAAAUAIEkAAKkCACBKAACuAgAgAQAAAAUAIAEAAAADACAFDAAApRAAIE8AAKcQACBQAACmEAAgwQUAAIQJACDCBQAAhAkAIAu1BAAAtwgAMLYEAAC3AgAQtwQAALcIADC4BAEAygcAIb8EAQDKBwAhwARAAMwHACHBBEAAzAcAIbYFQADMBwAhwAUBAMoHACHBBQEAywcAIcIFAQDLBwAhAwAAAAMAIAEAALYCADBOAAC3AgAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAAKQQACC4BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABtwUBAAAAAbgFAQAAAAG5BQEAAAABugUBAAAAAbsFAQAAAAG8BUAAAAABvQVAAAAAAb4FAQAAAAG_BQEAAAABAUIAAL8CACANuAQBAAAAAb8EAQAAAAHABEAAAAABwQRAAAAAAbcFAQAAAAG4BQEAAAABuQUBAAAAAboFAQAAAAG7BQEAAAABvAVAAAAAAb0FQAAAAAG-BQEAAAABvwUBAAAAAQFCAADBAgAwAUIAAMECADAOAwAAoxAAILgEAQCICQAhvwQBAIgJACHABEAAigkAIcEEQACKCQAhtwUBAIgJACG4BQEAiAkAIbkFAQCJCQAhugUBAIkJACG7BQEAiQkAIbwFQACxCQAhvQVAALEJACG-BQEAiQkAIb8FAQCJCQAhAgAAAAkAIEIAAMQCACANuAQBAIgJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACG3BQEAiAkAIbgFAQCICQAhuQUBAIkJACG6BQEAiQkAIbsFAQCJCQAhvAVAALEJACG9BUAAsQkAIb4FAQCJCQAhvwUBAIkJACECAAAABwAgQgAAxgIAIAIAAAAHACBCAADGAgAgAwAAAAkAIEkAAL8CACBKAADEAgAgAQAAAAkAIAEAAAAHACAKDAAAoBAAIE8AAKIQACBQAAChEAAguQUAAIQJACC6BQAAhAkAILsFAACECQAgvAUAAIQJACC9BQAAhAkAIL4FAACECQAgvwUAAIQJACAQtQQAALYIADC2BAAAzQIAELcEAAC2CAAwuAQBAMoHACG_BAEAygcAIcAEQADMBwAhwQRAAMwHACG3BQEAygcAIbgFAQDKBwAhuQUBAMsHACG6BQEAywcAIbsFAQDLBwAhvAVAAOcHACG9BUAA5wcAIb4FAQDLBwAhvwUBAMsHACEDAAAABwAgAQAAzAIAME4AAM0CACADAAAABwAgAQAACAAwAgAACQAgCbUEAAC1CAAwtgQAANMCABC3BAAAtQgAMLgEAQAAAAHABEAA4QcAIcEEQADhBwAhtAUBAN0HACG1BQEA3QcAIbYFQADhBwAhAQAAANACACABAAAA0AIAIAm1BAAAtQgAMLYEAADTAgAQtwQAALUIADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACG0BQEA3QcAIbUFAQDdBwAhtgVAAOEHACEAAwAAANMCACABAADUAgAwAgAA0AIAIAMAAADTAgAgAQAA1AIAMAIAANACACADAAAA0wIAIAEAANQCADACAADQAgAgBrgEAQAAAAHABEAAAAABwQRAAAAAAbQFAQAAAAG1BQEAAAABtgVAAAAAAQFCAADYAgAgBrgEAQAAAAHABEAAAAABwQRAAAAAAbQFAQAAAAG1BQEAAAABtgVAAAAAAQFCAADaAgAwAUIAANoCADAGuAQBAIgJACHABEAAigkAIcEEQACKCQAhtAUBAIgJACG1BQEAiAkAIbYFQACKCQAhAgAAANACACBCAADdAgAgBrgEAQCICQAhwARAAIoJACHBBEAAigkAIbQFAQCICQAhtQUBAIgJACG2BUAAigkAIQIAAADTAgAgQgAA3wIAIAIAAADTAgAgQgAA3wIAIAMAAADQAgAgSQAA2AIAIEoAAN0CACABAAAA0AIAIAEAAADTAgAgAwwAAJ0QACBPAACfEAAgUAAAnhAAIAm1BAAAtAgAMLYEAADmAgAQtwQAALQIADC4BAEAygcAIcAEQADMBwAhwQRAAMwHACG0BQEAygcAIbUFAQDKBwAhtgVAAMwHACEDAAAA0wIAIAEAAOUCADBOAADmAgAgAwAAANMCACABAADUAgAwAgAA0AIAIAEAAAB1ACABAAAAdQAgAwAAAFEAIAEAAHQAMAIAAHUAIAMAAABRACABAAB0ADACAAB1ACADAAAAUQAgAQAAdAAwAgAAdQAgCgcAAMsPACAJAAC2DgAgGQAAtw4AILgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAABiAUBAAAAAY4FAQAAAAEBQgAA7gIAIAe4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAYgFAQAAAAGOBQEAAAABAUIAAPACADABQgAA8AIAMAEAAAAYACAKBwAAyQ8AIAkAAKoOACAZAACrDgAguAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIYgFAQCICQAhjgUBAIkJACECAAAAdQAgQgAA9AIAIAe4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAhiAUBAIgJACGOBQEAiQkAIQIAAABRACBCAAD2AgAgAgAAAFEAIEIAAPYCACABAAAAGAAgAwAAAHUAIEkAAO4CACBKAAD0AgAgAQAAAHUAIAEAAABRACAFDAAAmhAAIE8AAJwQACBQAACbEAAgvgQAAIQJACCOBQAAhAkAIAq1BAAAswgAMLYEAAD-AgAQtwQAALMIADC4BAEAygcAIb0EAQDKBwAhvgQBAMsHACHABEAAzAcAIcEEQADMBwAhiAUBAMoHACGOBQEAywcAIQMAAABRACABAAD9AgAwTgAA_gIAIAMAAABRACABAAB0ADACAAB1ACABAAAAngEAIAEAAACeAQAgAwAAAJwBACABAACdAQAwAgAAngEAIAMAAACcAQAgAQAAnQEAMAIAAJ4BACADAAAAnAEAIAEAAJ0BADACAACeAQAgCwcAAJkQACAPAACeDgAguAQBAAAAAb0EAQAAAAHABEAAAAABwQRAAAAAAYgFAQAAAAGvBQEAAAABsAUBAAAAAbEFAgAAAAGzBQAAALMFAgFCAACGAwAgCbgEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAGIBQEAAAABrwUBAAAAAbAFAQAAAAGxBQIAAAABswUAAACzBQIBQgAAiAMAMAFCAACIAwAwCwcAAJgQACAPAACTDgAguAQBAIgJACG9BAEAiAkAIcAEQACKCQAhwQRAAIoJACGIBQEAiQkAIa8FAQCICQAhsAUBAIgJACGxBQIAkA4AIbMFAACRDrMFIgIAAACeAQAgQgAAiwMAIAm4BAEAiAkAIb0EAQCICQAhwARAAIoJACHBBEAAigkAIYgFAQCJCQAhrwUBAIgJACGwBQEAiAkAIbEFAgCQDgAhswUAAJEOswUiAgAAAJwBACBCAACNAwAgAgAAAJwBACBCAACNAwAgAwAAAJ4BACBJAACGAwAgSgAAiwMAIAEAAACeAQAgAQAAAJwBACAGDAAAkxAAIE8AAJYQACBQAACVEAAgwQEAAJQQACDCAQAAlxAAIIgFAACECQAgDLUEAACsCAAwtgQAAJQDABC3BAAArAgAMLgEAQDKBwAhvQQBAMoHACHABEAAzAcAIcEEQADMBwAhiAUBAMsHACGvBQEAygcAIbAFAQDKBwAhsQUCAK0IACGzBQAArgizBSIDAAAAnAEAIAEAAJMDADBOAACUAwAgAwAAAJwBACABAACdAQAwAgAAngEAIAEAAAAjACABAAAAIwAgAwAAACEAIAEAACIAMAIAACMAIAMAAAAhACABAAAiADACAAAjACADAAAAIQAgAQAAIgAwAgAAIwAgDwcAAMEMACAJAADCDAAgCgAA_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_QcAICUAAJwIACAmAACdCAAgJwAAnwgAICgAAKEIACApAACiCAAgKwAAkAgAICwAAKUIACAtAACmCAAgLgAApwgAIDAAAJsIACAxAACeCAAgNAAApAgAILUEAACZCAAwtgQAABYAELcEAACZCAAwuAQBAAAAAcAEQADhBwAhwQRAAOEHACHsBAAAmgimBSOIBQEA3QcAIY4FAQDeBwAhpAUBAN4HACGnBQEA3gcAIQEAAAD5AwAgAQAAAPkDACAUBgAA-Q8AIBUAAPALACAXAAD8DwAgGQAA7wsAICUAAPUPACAmAAD2DwAgJwAA-A8AICgAAPoPACApAAD7DwAgKwAA6gwAICwAAP4PACAtAAD_DwAgLgAAgBAAIDAAAPQPACAxAAD3DwAgNAAA_Q8AIOwEAACECQAgjgUAAIQJACCkBQAAhAkAIKcFAACECQAgAwAAABYAIAEAAPwDADACAAD5AwAgAwAAABYAIAEAAPwDADACAAD5AwAgAwAAABYAIAEAAPwDADACAAD5AwAgGAYAAOoPACAVAADtDwAgFwAA7g8AIBkAAOgPACAlAADlDwAgJgAA5g8AICcAAOkPACAoAADrDwAgKQAA7A8AICsAAPAPACAsAADxDwAgLQAA8g8AIC4AAPMPACAwAADkDwAgMQAA5w8AIDQAAO8PACC4BAEAAAABwARAAAAAAcEEQAAAAAHsBAAAAKYFA4gFAQAAAAGOBQEAAAABpAUBAAAAAacFAQAAAAEBQgAAgAQAIAi4BAEAAAABwARAAAAAAcEEQAAAAAHsBAAAAKYFA4gFAQAAAAGOBQEAAAABpAUBAAAAAacFAQAAAAEBQgAAggQAMAFCAACCBAAwGAYAAP8MACAVAACCDQAgFwAAgw0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_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_wQAIAMAAAAsACBJAAD4BAAgSgAA_QQAIAEAAAAsACABAAAAKgAgBQwAAIoMACBPAACMDAAgUAAAiwwAII4FAACECQAglQUAAIQJACAMtQQAAIkIADC2BAAAhgUAELcEAACJCAAwuAQBAMoHACHABEAAzAcAIcEEQADMBwAh9gQBAMoHACGIBQEAygcAIY4FAQDLBwAhlQUBAMsHACGWBQEAygcAIZcFAQDKBwAhAwAAACoAIAEAAIUFADBOAACGBQAgAwAAACoAIAEAACsAMAIAACwAIAwLAACICAAgtQQAAIYIADC2BAAAjAUAELcEAACGCAAwuAQBAAAAAcAEQADhBwAhwQRAAOEHACHwBAAAhwiVBSKIBQEA3QcAIY4FAQDeBwAhkgVAAOEHACGTBUAA4QcAIQEAAACJBQAgAQAAAIkFACAMCwAAiAgAILUEAACGCAAwtgQAAIwFABC3BAAAhggAMLgEAQDdBwAhwARAAOEHACHBBEAA4QcAIfAEAACHCJUFIogFAQDdBwAhjgUBAN4HACGSBUAA4QcAIZMFQADhBwAhAgsAAIkMACCOBQAAhAkAIAMAAACMBQAgAQAAjQUAMAIAAIkFACADAAAAjAUAIAEAAI0FADACAACJBQAgAwAAAIwFACABAACNBQAwAgAAiQUAIAkLAACIDAAguAQBAAAAAcAEQAAAAAHBBEAAAAAB8AQAAACVBQKIBQEAAAABjgUBAAAAAZIFQAAAAAGTBUAAAAABAUIAAJEFACAIuAQBAAAAAcAEQAAAAAHBBEAAAAAB8AQAAACVBQKIBQEAAAABjgUBAAAAAZIFQAAAAAGTBUAAAAABAUIAAJMFADABQgAAkwUAMAkLAAD8CwAguAQBAIgJACHABEAAigkAIcEEQACKCQAh8AQAAPsLlQUiiAUBAIgJACGOBQEAiQkAIZIFQACKCQAhkwVAAIoJACECAAAAiQUAIEIAAJYFACAIuAQBAIgJACHABEAAigkAIcEEQACKCQAh8AQAAPsLlQUiiAUBAIgJACGOBQEAiQkAIZIFQACKCQAhkwVAAIoJACECAAAAjAUAIEIAAJgFACACAAAAjAUAIEIAAJgFACADAAAAiQUAIEkAAJEFACBKAACWBQAgAQAAAIkFACABAAAAjAUAIAQMAAD4CwAgTwAA-gsAIFAAAPkLACCOBQAAhAkAIAu1BAAAgggAMLYEAACfBQAQtwQAAIIIADC4BAEAygcAIcAEQADMBwAhwQRAAMwHACHwBAAAgwiVBSKIBQEAygcAIY4FAQDLBwAhkgVAAMwHACGTBUAAzAcAIQMAAACMBQAgAQAAngUAME4AAJ8FACADAAAAjAUAIAEAAI0FADACAACJBQAgAQAAAEwAIAEAAABMACADAAAASgAgAQAASwAwAgAATAAgAwAAAEoAIAEAAEsAMAIAAEwAIAMAAABKACABAABLADACAABMACARBwAA6gsAIAkAAOsLACAVAADnCwAgFwAA6AsAIBgAAOkLACAaAAD3CwAgGwAA7AsAILgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAABiAUBAAAAAY4FAQAAAAGPBQIAAAABkAUBAAAAAZEFAQAAAAEBQgAApwUAIAq4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAYgFAQAAAAGOBQEAAAABjwUCAAAAAZAFAQAAAAGRBQEAAAABAUIAAKkFADABQgAAqQUAMAEAAAAYACABAAAAUQAgEQcAAMgLACAJAADJCwAgFQAAxQsAIBcAAMYLACAYAADHCwAgGgAA9gsAIBsAAMoLACC4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAhiAUBAIgJACGOBQEAiQkAIY8FAgDDCwAhkAUBAIgJACGRBQEAiQkAIQIAAABMACBCAACuBQAgCrgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACGIBQEAiAkAIY4FAQCJCQAhjwUCAMMLACGQBQEAiAkAIZEFAQCJCQAhAgAAAEoAIEIAALAFACACAAAASgAgQgAAsAUAIAEAAAAYACABAAAAUQAgAwAAAEwAIEkAAKcFACBKAACuBQAgAQAAAEwAIAEAAABKACAJDAAA8QsAIE8AAPQLACBQAADzCwAgwQEAAPILACDCAQAA9QsAIL4EAACECQAgjgUAAIQJACCPBQAAhAkAIJEFAACECQAgDbUEAAD_BwAwtgQAALkFABC3BAAA_wcAMLgEAQDKBwAhvQQBAMoHACG-BAEAywcAIcAEQADMBwAhwQRAAMwHACGIBQEAygcAIY4FAQDLBwAhjwUCAIAIACGQBQEAygcAIZEFAQDLBwAhAwAAAEoAIAEAALgFADBOAAC5BQAgAwAAAEoAIAEAAEsAMAIAAEwAIAoVAAD-BwAgGQAA_QcAILUEAAD8BwAwtgQAAL8FABC3BAAA_AcAMLgEAQAAAAG9BAEA3QcAIYgFAQDdBwAhiQVAAOEHACGKBUAA4QcAIQEAAAC8BQAgAQAAALwFACAKFQAA_gcAIBkAAP0HACC1BAAA_AcAMLYEAAC_BQAQtwQAAPwHADC4BAEA3QcAIb0EAQDdBwAhiAUBAN0HACGJBUAA4QcAIYoFQADhBwAhAhUAAPALACAZAADvCwAgAwAAAL8FACABAADABQAwAgAAvAUAIAMAAAC_BQAgAQAAwAUAMAIAALwFACADAAAAvwUAIAEAAMAFADACAAC8BQAgBxUAAO4LACAZAADtCwAguAQBAAAAAb0EAQAAAAGIBQEAAAABiQVAAAAAAYoFQAAAAAEBQgAAxAUAIAW4BAEAAAABvQQBAAAAAYgFAQAAAAGJBUAAAAABigVAAAAAAQFCAADGBQAwAUIAAMYFADAHFQAArwsAIBkAAK4LACC4BAEAiAkAIb0EAQCICQAhiAUBAIgJACGJBUAAigkAIYoFQACKCQAhAgAAALwFACBCAADJBQAgBbgEAQCICQAhvQQBAIgJACGIBQEAiAkAIYkFQACKCQAhigVAAIoJACECAAAAvwUAIEIAAMsFACACAAAAvwUAIEIAAMsFACADAAAAvAUAIEkAAMQFACBKAADJBQAgAQAAALwFACABAAAAvwUAIAMMAACrCwAgTwAArQsAIFAAAKwLACAItQQAAPsHADC2BAAA0gUAELcEAAD7BwAwuAQBAMoHACG9BAEAygcAIYgFAQDKBwAhiQVAAMwHACGKBUAAzAcAIQMAAAC_BQAgAQAA0QUAME4AANIFACADAAAAvwUAIAEAAMAFADACAAC8BQAgDSIAAOIHACC1BAAA-gcAMLYEAADUAQAQtwQAAPoHADC4BAEAAAABwARAAOEHACHBBEAA4QcAIc4EAQDdBwAhzwQBAN0HACHUBAAA3wcAINYEIADgBwAhhgUBAAAAAYcFAADWBwAgAQAAANUFACABAAAA1QUAIAEiAADPCgAgAwAAANQBACABAADYBQAwAgAA1QUAIAMAAADUAQAgAQAA2AUAMAIAANUFACADAAAA1AEAIAEAANgFADACAADVBQAgCiIAAKoLACC4BAEAAAABwARAAAAAAcEEQAAAAAHOBAEAAAABzwQBAAAAAdQEgAAAAAHWBCAAAAABhgUBAAAAAYcFAACpCwAgAUIAANwFACAJuAQBAAAAAcAEQAAAAAHBBEAAAAABzgQBAAAAAc8EAQAAAAHUBIAAAAAB1gQgAAAAAYYFAQAAAAGHBQAAqQsAIAFCAADeBQAwAUIAAN4FADAKIgAAqAsAILgEAQCICQAhwARAAIoJACHBBEAAigkAIc4EAQCICQAhzwQBAIgJACHUBIAAAAAB1gQgAMoKACGGBQEAiAkAIYcFAACnCwAgAgAAANUFACBCAADhBQAgCbgEAQCICQAhwARAAIoJACHBBEAAigkAIc4EAQCICQAhzwQBAIgJACHUBIAAAAAB1gQgAMoKACGGBQEAiAkAIYcFAACnCwAgAgAAANQBACBCAADjBQAgAgAAANQBACBCAADjBQAgAwAAANUFACBJAADcBQAgSgAA4QUAIAEAAADVBQAgAQAAANQBACADDAAApAsAIE8AAKYLACBQAAClCwAgDLUEAAD5BwAwtgQAAOoFABC3BAAA-QcAMLgEAQDKBwAhwARAAMwHACHBBEAAzAcAIc4EAQDKBwAhzwQBAMoHACHUBAAA1wcAINYEIADYBwAhhgUBAMoHACGHBQAA1gcAIAMAAADUAQAgAQAA6QUAME4AAOoFACADAAAA1AEAIAEAANgFADACAADVBQAgAQAAAF8AIAEAAABfACADAAAAXQAgAQAAXgAwAgAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAMAAABdACABAABeADACAABfACAQHgAAowsAICEAAIILACAiAACDCwAgIwAAhAsAILgEAQAAAAHABEAAAAABwQRAAAAAAeQEAQAAAAHuBAEAAAAB8AQAAACGBQLxBAEAAAAB8gRAAAAAAfMEQAAAAAH0BAEAAAAB9QQBAAAAAYYFAQAAAAEBQgAA8gUAIAy4BAEAAAABwARAAAAAAcEEQAAAAAHkBAEAAAAB7gQBAAAAAfAEAAAAhgUC8QQBAAAAAfIEQAAAAAHzBEAAAAAB9AQBAAAAAfUEAQAAAAGGBQEAAAABAUIAAPQFADABQgAA9AUAMAEAAABjACABAAAAZQAgEB4AAKILACAhAAD-CgAgIgAA_woAICMAAIALACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHkBAEAiQkAIe4EAQCJCQAh8AQAAPwKhgUi8QQBAIkJACHyBEAAsQkAIfMEQACKCQAh9AQBAIgJACH1BAEAiQkAIYYFAQCICQAhAgAAAF8AIEIAAPkFACAMuAQBAIgJACHABEAAigkAIcEEQACKCQAh5AQBAIkJACHuBAEAiQkAIfAEAAD8CoYFIvEEAQCJCQAh8gRAALEJACHzBEAAigkAIfQEAQCICQAh9QQBAIkJACGGBQEAiAkAIQIAAABdACBCAAD7BQAgAgAAAF0AIEIAAPsFACABAAAAYwAgAQAAAGUAIAMAAABfACBJAADyBQAgSgAA-QUAIAEAAABfACABAAAAXQAgCAwAAJ8LACBPAAChCwAgUAAAoAsAIOQEAACECQAg7gQAAIQJACDxBAAAhAkAIPIEAACECQAg9QQAAIQJACAPtQQAAPUHADC2BAAAhAYAELcEAAD1BwAwuAQBAMoHACHABEAAzAcAIcEEQADMBwAh5AQBAMsHACHuBAEAywcAIfAEAAD2B4YFIvEEAQDLBwAh8gRAAOcHACHzBEAAzAcAIfQEAQDKBwAh9QQBAMsHACGGBQEAygcAIQMAAABdACABAACDBgAwTgAAhAYAIAMAAABdACABAABeADACAABfACABAAAAewAgAQAAAHsAIAMAAABlACABAAB6ADACAAB7ACADAAAAZQAgAQAAegAwAgAAewAgAwAAAGUAIAEAAHoAMAIAAHsAIA4DAACbCwAgBwAAmQsAIAkAAJoLACAVAACcCwAgHwAAnQsAICQAAJ4LACC4BAEAAAABvAQBAAAAAb0EAQAAAAG-BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABhAUBAAAAAQFCAACMBgAgCLgEAQAAAAG8BAEAAAABvQQBAAAAAb4EAQAAAAG_BAEAAAABwARAAAAAAcEEQAAAAAGEBQEAAAABAUIAAI4GADABQgAAjgYAMAEAAAAYACAOAwAA7goAIAcAAOwKACAJAADtCgAgFQAA7woAIB8AAPAKACAkAADxCgAguAQBAIgJACG8BAEAiQkAIb0EAQCICQAhvgQBAIkJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACGEBQEAiAkAIQIAAAB7ACBCAACSBgAgCLgEAQCICQAhvAQBAIkJACG9BAEAiAkAIb4EAQCJCQAhvwQBAIgJACHABEAAigkAIcEEQACKCQAhhAUBAIgJACECAAAAZQAgQgAAlAYAIAIAAABlACBCAACUBgAgAQAAABgAIAMAAAB7ACBJAACMBgAgSgAAkgYAIAEAAAB7ACABAAAAZQAgBQwAAOkKACBPAADrCgAgUAAA6goAILwEAACECQAgvgQAAIQJACALtQQAAPQHADC2BAAAnAYAELcEAAD0BwAwuAQBAMoHACG8BAEAywcAIb0EAQDKBwAhvgQBAMsHACG_BAEAygcAIcAEQADMBwAhwQRAAMwHACGEBQEAygcAIQMAAABlACABAACbBgAwTgAAnAYAIAMAAABlACABAAB6ADACAAB7ACABAAAAiwEAIAEAAACLAQAgAwAAADYAIAEAAIoBADACAACLAQAgAwAAADYAIAEAAIoBADACAACLAQAgAwAAADYAIAEAAIoBADACAACLAQAgGAcAAKQJACAJAAClCQAgDgAAowkAIBIAAJQKACC4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAeIEAQAAAAH2BAEAAAAB9wQIAAAAAfgECAAAAAH5BAgAAAAB-gQIAAAAAfsECAAAAAH8BAgAAAAB_QQIAAAAAf4ECAAAAAH_BAgAAAABgAUIAAAAAYEFCAAAAAGCBQgAAAABgwUIAAAAAQFCAACkBgAgFLgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4gQBAAAAAfYEAQAAAAH3BAgAAAAB-AQIAAAAAfkECAAAAAH6BAgAAAAB-wQIAAAAAfwECAAAAAH9BAgAAAAB_gQIAAAAAf8ECAAAAAGABQgAAAABgQUIAAAAAYIFCAAAAAGDBQgAAAABAUIAAKYGADABQgAApgYAMAEAAAAYACAYBwAAoAkAIAkAAKEJACAOAACfCQAgEgAAkwoAILgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHiBAEAiAkAIfYEAQCICQAh9wQIAJ0JACH4BAgAnQkAIfkECACdCQAh-gQIAJ0JACH7BAgAnQkAIfwECACdCQAh_QQIAJ0JACH-BAgAnQkAIf8ECACdCQAhgAUIAJ0JACGBBQgAnQkAIYIFCACdCQAhgwUIAJ0JACECAAAAiwEAIEIAAKoGACAUuAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIeIEAQCICQAh9gQBAIgJACH3BAgAnQkAIfgECACdCQAh-QQIAJ0JACH6BAgAnQkAIfsECACdCQAh_AQIAJ0JACH9BAgAnQkAIf4ECACdCQAh_wQIAJ0JACGABQgAnQkAIYEFCACdCQAhggUIAJ0JACGDBQgAnQkAIQIAAAA2ACBCAACsBgAgAgAAADYAIEIAAKwGACABAAAAGAAgAwAAAIsBACBJAACkBgAgSgAAqgYAIAEAAACLAQAgAQAAADYAIBMMAADkCgAgTwAA5woAIFAAAOYKACDBAQAA5QoAIMIBAADoCgAgvgQAAIQJACD3BAAAhAkAIPgEAACECQAg-QQAAIQJACD6BAAAhAkAIPsEAACECQAg_AQAAIQJACD9BAAAhAkAIP4EAACECQAg_wQAAIQJACCABQAAhAkAIIEFAACECQAgggUAAIQJACCDBQAAhAkAIBe1BAAA8AcAMLYEAAC0BgAQtwQAAPAHADC4BAEAygcAIb0EAQDKBwAhvgQBAMsHACHABEAAzAcAIcEEQADMBwAh4gQBAMoHACH2BAEAygcAIfcECADxBwAh-AQIAPEHACH5BAgA8QcAIfoECADxBwAh-wQIAPEHACH8BAgA8QcAIf0ECADxBwAh_gQIAPEHACH_BAgA8QcAIYAFCADxBwAhgQUIAPEHACGCBQgA8QcAIYMFCADxBwAhAwAAADYAIAEAALMGADBOAAC0BgAgAwAAADYAIAEAAIoBADACAACLAQAgAQAAAIEBACABAAAAgQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIAMAAAB_ACABAACAAQAwAgAAgQEAIBQHAAC8CQAgCQAAvQkAIBIAAOMKACAhAAC5CQAgIwAAuwkAICoAALoJACC4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAc0EAQAAAAHiBAEAAAAB7gQBAAAAAfAEAAAA8AQC8QQBAAAAAfIEQAAAAAHzBEAAAAAB9AQBAAAAAfUEAQAAAAEBQgAAvAYAIA64BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAc0EAQAAAAHiBAEAAAAB7gQBAAAAAfAEAAAA8AQC8QQBAAAAAfIEQAAAAAHzBEAAAAAB9AQBAAAAAfUEAQAAAAEBQgAAvgYAMAFCAAC-BgAwAQAAAGMAIAEAAAAOACABAAAAGAAgFAcAALYJACAJAAC3CQAgEgAA4goAICEAALMJACAjAAC1CQAgKgAAtAkAILgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHNBAEAiAkAIeIEAQCJCQAh7gQBAIkJACHwBAAAsAnwBCLxBAEAiQkAIfIEQACxCQAh8wRAAIoJACH0BAEAiAkAIfUEAQCJCQAhAgAAAIEBACBCAADEBgAgDrgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHNBAEAiAkAIeIEAQCJCQAh7gQBAIkJACHwBAAAsAnwBCLxBAEAiQkAIfIEQACxCQAh8wRAAIoJACH0BAEAiAkAIfUEAQCJCQAhAgAAAH8AIEIAAMYGACACAAAAfwAgQgAAxgYAIAEAAABjACABAAAADgAgAQAAABgAIAMAAACBAQAgSQAAvAYAIEoAAMQGACABAAAAgQEAIAEAAAB_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_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-BAEAygcAIb8EAQDKBwAhwARAAMwHACHBBEAAzAcAIQ4MAADOBwAgTwAA1AcAIFAAANQHACDCBAEAAAABwwQBAAAABMQEAQAAAATFBAEAAAABxgQBAAAAAccEAQAAAAHIBAEAAAAByQQBANMHACHKBAEAAAABywQBAAAAAcwEAQAAAAEODAAA0QcAIE8AANIHACBQAADSBwAgwgQBAAAAAcMEAQAAAAXEBAEAAAAFxQQBAAAAAcYEAQAAAAHHBAEAAAAByAQBAAAAAckEAQDQBwAhygQBAAAAAcsEAQAAAAHMBAEAAAABCwwAAM4HACBPAADPBwAgUAAAzwcAIMIEQAAAAAHDBEAAAAAExARAAAAABMUEQAAAAAHGBEAAAAABxwRAAAAAAcgEQAAAAAHJBEAAzQcAIQsMAADOBwAgTwAAzwcAIFAAAM8HACDCBEAAAAABwwRAAAAABMQEQAAAAATFBEAAAAABxgRAAAAAAccEQAAAAAHIBEAAAAAByQRAAM0HACEIwgQCAAAAAcMEAgAAAATEBAIAAAAExQQCAAAAAcYEAgAAAAHHBAIAAAAByAQCAAAAAckEAgDOBwAhCMIEQAAAAAHDBEAAAAAExARAAAAABMUEQAAAAAHGBEAAAAABxwRAAAAAAcgEQAAAAAHJBEAAzwcAIQ4MAADRBwAgTwAA0gcAIFAAANIHACDCBAEAAAABwwQBAAAABcQEAQAAAAXFBAEAAAABxgQBAAAAAccEAQAAAAHIBAEAAAAByQQBANAHACHKBAEAAAABywQBAAAAAcwEAQAAAAEIwgQCAAAAAcMEAgAAAAXEBAIAAAAFxQQCAAAAAcYEAgAAAAHHBAIAAAAByAQCAAAAAckEAgDRBwAhC8IEAQAAAAHDBAEAAAAFxAQBAAAABcUEAQAAAAHGBAEAAAABxwQBAAAAAcgEAQAAAAHJBAEA0gcAIcoEAQAAAAHLBAEAAAABzAQBAAAAAQ4MAADOBwAgTwAA1AcAIFAAANQHACDCBAEAAAABwwQBAAAABMQEAQAAAATFBAEAAAABxgQBAAAAAccEAQAAAAHIBAEAAAAByQQBANMHACHKBAEAAAABywQBAAAAAcwEAQAAAAELwgQBAAAAAcMEAQAAAATEBAEAAAAExQQBAAAAAcYEAQAAAAHHBAEAAAAByAQBAAAAAckEAQDUBwAh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_AEIvEEAQDLBwAh8gRAAOcHACHzBEAAzAcAIfQEAQDKBwAh9QQBAMsHACEHDAAAzgcAIE8AAO8HACBQAADvBwAgwgQAAADwBALDBAAAAPAECMQEAAAA8AQIyQQAAO4H8AQiBwwAAM4HACBPAADvBwAgUAAA7wcAIMIEAAAA8AQCwwQAAADwBAjEBAAAAPAECMkEAADuB_AEIgTCBAAAAPAEAsMEAAAA8AQIxAQAAADwBAjJBAAA7wfwBCIXtQQAAPAHADC2BAAAtAYAELcEAADwBwAwuAQBAMoHACG9BAEAygcAIb4EAQDLBwAhwARAAMwHACHBBEAAzAcAIeIEAQDKBwAh9gQBAMoHACH3BAgA8QcAIfgECADxBwAh-QQIAPEHACH6BAgA8QcAIfsECADxBwAh_AQIAPEHACH9BAgA8QcAIf4ECADxBwAh_wQIAPEHACGABQgA8QcAIYEFCADxBwAhggUIAPEHACGDBQgA8QcAIQ0MAADRBwAgTwAA8wcAIFAAAPMHACDBAQAA8wcAIMIBAADzBwAgwgQIAAAAAcMECAAAAAXEBAgAAAAFxQQIAAAAAcYECAAAAAHHBAgAAAAByAQIAAAAAckECADyBwAhDQwAANEHACBPAADzBwAgUAAA8wcAIMEBAADzBwAgwgEAAPMHACDCBAgAAAABwwQIAAAABcQECAAAAAXFBAgAAAABxgQIAAAAAccECAAAAAHIBAgAAAAByQQIAPIHACEIwgQIAAAAAcMECAAAAAXEBAgAAAAFxQQIAAAAAcYECAAAAAHHBAgAAAAByAQIAAAAAckECADzBwAhC7UEAAD0BwAwtgQAAJwGABC3BAAA9AcAMLgEAQDKBwAhvAQBAMsHACG9BAEAygcAIb4EAQDLBwAhvwQBAMoHACHABEAAzAcAIcEEQADMBwAhhAUBAMoHACEPtQQAAPUHADC2BAAAhAYAELcEAAD1BwAwuAQBAMoHACHABEAAzAcAIcEEQADMBwAh5AQBAMsHACHuBAEAywcAIfAEAAD2B4YFIvEEAQDLBwAh8gRAAOcHACHzBEAAzAcAIfQEAQDKBwAh9QQBAMsHACGGBQEAygcAIQcMAADOBwAgTwAA-AcAIFAAAPgHACDCBAAAAIYFAsMEAAAAhgUIxAQAAACGBQjJBAAA9weGBSIHDAAAzgcAIE8AAPgHACBQAAD4BwAgwgQAAACGBQLDBAAAAIYFCMQEAAAAhgUIyQQAAPcHhgUiBMIEAAAAhgUCwwQAAACGBQjEBAAAAIYFCMkEAAD4B4YFIgy1BAAA-QcAMLYEAADqBQAQtwQAAPkHADC4BAEAygcAIcAEQADMBwAhwQRAAMwHACHOBAEAygcAIc8EAQDKBwAh1AQAANcHACDWBCAA2AcAIYYFAQDKBwAhhwUAANYHACANIgAA4gcAILUEAAD6BwAwtgQAANQBABC3BAAA-gcAMLgEAQDdBwAhwARAAOEHACHBBEAA4QcAIc4EAQDdBwAhzwQBAN0HACHUBAAA3wcAINYEIADgBwAhhgUBAN0HACGHBQAA1gcAIAi1BAAA-wcAMLYEAADSBQAQtwQAAPsHADC4BAEAygcAIb0EAQDKBwAhiAUBAMoHACGJBUAAzAcAIYoFQADMBwAhChUAAP4HACAZAAD9BwAgtQQAAPwHADC2BAAAvwUAELcEAAD8BwAwuAQBAN0HACG9BAEA3QcAIYgFAQDdBwAhiQVAAOEHACGKBUAA4QcAIQOLBQAASgAgjAUAAEoAII0FAABKACADiwUAACYAIIwFAAAmACCNBQAAJgAgDbUEAAD_BwAwtgQAALkFABC3BAAA_wcAMLgEAQDKBwAhvQQBAMoHACG-BAEAywcAIcAEQADMBwAhwQRAAMwHACGIBQEAygcAIY4FAQDLBwAhjwUCAIAIACGQBQEAygcAIZEFAQDLBwAhDQwAANEHACBPAADRBwAgUAAA0QcAIMEBAADzBwAgwgEAANEHACDCBAIAAAABwwQCAAAABcQEAgAAAAXFBAIAAAABxgQCAAAAAccEAgAAAAHIBAIAAAAByQQCAIEIACENDAAA0QcAIE8AANEHACBQAADRBwAgwQEAAPMHACDCAQAA0QcAIMIEAgAAAAHDBAIAAAAFxAQCAAAABcUEAgAAAAHGBAIAAAABxwQCAAAAAcgEAgAAAAHJBAIAgQgAIQu1BAAAgggAMLYEAACfBQAQtwQAAIIIADC4BAEAygcAIcAEQADMBwAhwQRAAMwHACHwBAAAgwiVBSKIBQEAygcAIY4FAQDLBwAhkgVAAMwHACGTBUAAzAcAIQcMAADOBwAgTwAAhQgAIFAAAIUIACDCBAAAAJUFAsMEAAAAlQUIxAQAAACVBQjJBAAAhAiVBSIHDAAAzgcAIE8AAIUIACBQAACFCAAgwgQAAACVBQLDBAAAAJUFCMQEAAAAlQUIyQQAAIQIlQUiBMIEAAAAlQUCwwQAAACVBQjEBAAAAJUFCMkEAACFCJUFIgwLAACICAAgtQQAAIYIADC2BAAAjAUAELcEAACGCAAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAh8AQAAIcIlQUiiAUBAN0HACGOBQEA3gcAIZIFQADhBwAhkwVAAOEHACEEwgQAAACVBQLDBAAAAJUFCMQEAAAAlQUIyQQAAIUIlQUiA4sFAAAqACCMBQAAKgAgjQUAACoAIAy1BAAAiQgAMLYEAACGBQAQtwQAAIkIADC4BAEAygcAIcAEQADMBwAhwQRAAMwHACH2BAEAygcAIYgFAQDKBwAhjgUBAMsHACGVBQEAywcAIZYFAQDKBwAhlwUBAMoHACEOtQQAAIoIADC2BAAA8AQAELcEAACKCAAwuAQBAMoHACG9BAEAygcAIb4EAQDKBwAhwARAAMwHACHBBEAAzAcAIekEAQDKBwAhjgUBAMsHACGYBQEAywcAIZkFQADnBwAhmgUIAPEHACGbBQgA8QcAIQ-1BAAAiwgAMLYEAADaBAAQtwQAAIsIADC4BAEAygcAIb0EAQDKBwAhvgQBAMsHACHABEAAzAcAIcEEQADMBwAh6QQBAMoHACGcBQEAywcAIZ0FAQDKBwAhngUAANYHACCfBQEAywcAIaAFAQDLBwAhoQUBAMoHACEQIAAAjQgAILUEAACMCAAwtgQAAMcEABC3BAAAjAgAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHpBAEA3QcAIZwFAQDeBwAhnQUBAN0HACGeBQAA1gcAIJ8FAQDeBwAhoAUBAN4HACGhBQEA3QcAIQOLBQAAXQAgjAUAAF0AII0FAABdACAPtQQAAI4IADC2BAAAwQQAELcEAACOCAAwuAQBAMoHACG9BAEAygcAIb4EAQDLBwAhwARAAMwHACHBBEAAzAcAIekEAQDKBwAhnAUBAMsHACGdBQEAygcAIZ4FAADWBwAgnwUBAMsHACGgBQEAywcAIaEFAQDKBwAhECAAAJAIACC1BAAAjwgAMLYEAACuBAAQtwQAAI8IADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh6QQBAN0HACGcBQEA3gcAIZ0FAQDdBwAhngUAANYHACCfBQEA3gcAIaAFAQDeBwAhoQUBAN0HACEDiwUAAH8AIIwFAAB_ACCNBQAAfwAgEbUEAACRCAAwtgQAAKgEABC3BAAAkQgAMLgEAQDKBwAhvQQBAMsHACHABEAAzAcAIcEEQADMBwAh8AQAAJMIqQUi8gRAAOcHACGOBQEAywcAIaIFAQDKBwAhowUBAMoHACGkBQEAywcAIaYFAACSCKYFI6cFAQDLBwAhqQUBAMsHACGqBQEAywcAIQcMAADRBwAgTwAAlwgAIFAAAJcIACDCBAAAAKYFA8MEAAAApgUJxAQAAACmBQnJBAAAlgimBSMHDAAAzgcAIE8AAJUIACBQAACVCAAgwgQAAACpBQLDBAAAAKkFCMQEAAAAqQUIyQQAAJQIqQUiBwwAAM4HACBPAACVCAAgUAAAlQgAIMIEAAAAqQUCwwQAAACpBQjEBAAAAKkFCMkEAACUCKkFIgTCBAAAAKkFAsMEAAAAqQUIxAQAAACpBQjJBAAAlQipBSIHDAAA0QcAIE8AAJcIACBQAACXCAAgwgQAAACmBQPDBAAAAKYFCcQEAAAApgUJyQQAAJYIpgUjBMIEAAAApgUDwwQAAACmBQnEBAAAAKYFCckEAACXCKYFIwu1BAAAmAgAMLYEAACOBAAQtwQAAJgIADC4BAEAygcAIcAEQADMBwAhwQRAAMwHACHsBAAAkgimBSOIBQEAygcAIY4FAQDLBwAhpAUBAMsHACGnBQEAywcAIRsGAACgCAAgFQAA_gcAIBcAAKMIACAZAAD9BwAgJQAAnAgAICYAAJ0IACAnAACfCAAgKAAAoQgAICkAAKIIACArAACQCAAgLAAApQgAIC0AAKYIACAuAACnCAAgMAAAmwgAIDEAAJ4IACA0AACkCAAgtQQAAJkIADC2BAAAFgAQtwQAAJkIADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACHsBAAAmgimBSOIBQEA3QcAIY4FAQDeBwAhpAUBAN4HACGnBQEA3gcAIQTCBAAAAKYFA8MEAAAApgUJxAQAAACmBQnJBAAAlwimBSMDiwUAABIAIIwFAAASACCNBQAAEgAgA4sFAAAdACCMBQAAHQAgjQUAAB0AIAOLBQAAUQAgjAUAAFEAII0FAABRACADiwUAAJwBACCMBQAAnAEAII0FAACcAQAgA4sFAAAhACCMBQAAIQAgjQUAACEAIAOLBQAACwAgjAUAAAsAII0FAAALACADiwUAAA4AIIwFAAAOACCNBQAADgAgA4sFAABlACCMBQAAZQAgjQUAAGUAIAOLBQAAQAAgjAUAAEAAII0FAABAACADiwUAAKcBACCMBQAApwEAII0FAACnAQAgA4sFAABFACCMBQAARQAgjQUAAEUAIAOLBQAAOwAgjAUAADsAII0FAAA7ACADiwUAADYAIIwFAAA2ACCNBQAANgAgCrUEAACoCAAwtgQAAPYDABC3BAAAqAgAMLgEAQDKBwAhvQQBAMsHACHABEAAzAcAIcEEQADMBwAhjgUBAMsHACGkBQEAywcAIasFAQDKBwAhCrUEAACpCAAwtgQAAN4DABC3BAAAqQgAMLgEAQDKBwAhwARAAMwHACHBBEAAzAcAIY4FAQDLBwAhnwUBAMsHACGkBQEAywcAIasFAQDKBwAhD7UEAACqCAAwtgQAAMYDABC3BAAAqggAMLgEAQDKBwAhvQQBAMoHACG-BAEAywcAIcAEQADMBwAhwQRAAMwHACHgBAEAygcAIeEEAQDKBwAh4gQBAMoHACHkBAEAygcAIZAFAQDKBwAhoAUBAMsHACGsBUAAzAcAIQ21BAAAqwgAMLYEAACsAwAQtwQAAKsIADC4BAEAygcAIb0EAQDKBwAhvgQBAMoHACHABEAAzAcAIcEEQADMBwAhjgUBAMsHACGaBQIAgAgAIaAFAQDLBwAhrQUBAMoHACGuBQEAygcAIQy1BAAArAgAMLYEAACUAwAQtwQAAKwIADC4BAEAygcAIb0EAQDKBwAhwARAAMwHACHBBEAAzAcAIYgFAQDLBwAhrwUBAMoHACGwBQEAygcAIbEFAgCtCAAhswUAAK4IswUiDQwAAM4HACBPAADOBwAgUAAAzgcAIMEBAACyCAAgwgEAAM4HACDCBAIAAAABwwQCAAAABMQEAgAAAATFBAIAAAABxgQCAAAAAccEAgAAAAHIBAIAAAAByQQCALEIACEHDAAAzgcAIE8AALAIACBQAACwCAAgwgQAAACzBQLDBAAAALMFCMQEAAAAswUIyQQAAK8IswUiBwwAAM4HACBPAACwCAAgUAAAsAgAIMIEAAAAswUCwwQAAACzBQjEBAAAALMFCMkEAACvCLMFIgTCBAAAALMFAsMEAAAAswUIxAQAAACzBQjJBAAAsAizBSINDAAAzgcAIE8AAM4HACBQAADOBwAgwQEAALIIACDCAQAAzgcAIMIEAgAAAAHDBAIAAAAExAQCAAAABMUEAgAAAAHGBAIAAAABxwQCAAAAAcgEAgAAAAHJBAIAsQgAIQjCBAgAAAABwwQIAAAABMQECAAAAATFBAgAAAABxgQIAAAAAccECAAAAAHIBAgAAAAByQQIALIIACEKtQQAALMIADC2BAAA_gIAELcEAACzCAAwuAQBAMoHACG9BAEAygcAIb4EAQDLBwAhwARAAMwHACHBBEAAzAcAIYgFAQDKBwAhjgUBAMsHACEJtQQAALQIADC2BAAA5gIAELcEAAC0CAAwuAQBAMoHACHABEAAzAcAIcEEQADMBwAhtAUBAMoHACG1BQEAygcAIbYFQADMBwAhCbUEAAC1CAAwtgQAANMCABC3BAAAtQgAMLgEAQDdBwAhwARAAOEHACHBBEAA4QcAIbQFAQDdBwAhtQUBAN0HACG2BUAA4QcAIRC1BAAAtggAMLYEAADNAgAQtwQAALYIADC4BAEAygcAIb8EAQDKBwAhwARAAMwHACHBBEAAzAcAIbcFAQDKBwAhuAUBAMoHACG5BQEAywcAIboFAQDLBwAhuwUBAMsHACG8BUAA5wcAIb0FQADnBwAhvgUBAMsHACG_BQEAywcAIQu1BAAAtwgAMLYEAAC3AgAQtwQAALcIADC4BAEAygcAIb8EAQDKBwAhwARAAMwHACHBBEAAzAcAIbYFQADMBwAhwAUBAMoHACHBBQEAywcAIcIFAQDLBwAhErUEAAC4CAAwtgQAAKECABC3BAAAuAgAMLgEAQDKBwAhvAQBAMsHACHABEAAzAcAIcEEQADMBwAhiAUBAMoHACHDBQEAygcAIcQFIADYBwAhxQUBAMsHACHGBQEAywcAIccFAQDLBwAhyAUBAMsHACHJBQEAywcAIcoFAQDLBwAhywUBAMoHACHMBQEAygcAIR8EAAC6CAAgBQAAuwgAIAYAAKAIACASAAChCAAgHgAAoggAICsAAJAIACA0AACkCAAgNwAApAgAIDgAAJAIACA5AAC8CAAgOgAAjQgAIDsAAI0IACA8AAC9CAAgtQQAALkIADC2BAAAYwAQtwQAALkIADC4BAEA3QcAIbwEAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhwwUBAN0HACHEBSAA4AcAIcUFAQDeBwAhxgUBAN4HACHHBQEA3gcAIcgFAQDeBwAhyQUBAN4HACHKBQEA3gcAIcsFAQDdBwAhzAUBAN0HACEDiwUAAAMAIIwFAAADACCNBQAAAwAgA4sFAAAHACCMBQAABwAgjQUAAAcAIBMqAADiBwAgtQQAANwHADC2BAAA0AEAELcEAADcBwAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAhzQQBAN0HACHOBAEA3QcAIc8EAQDdBwAh0AQBAN0HACHRBAEA3gcAIdIEAADWBwAg0wQAANYHACDUBAAA3wcAINUEAADfBwAg1gQgAOAHACHVBQAA0AEAINYFAADQAQAgDyIAAOIHACC1BAAA-gcAMLYEAADUAQAQtwQAAPoHADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACHOBAEA3QcAIc8EAQDdBwAh1AQAAN8HACDWBCAA4AcAIYYFAQDdBwAhhwUAANYHACDVBQAA1AEAINYFAADUAQAgCbUEAAC-CAAwtgQAAIkCABC3BAAAvggAMLgEAQDKBwAhwARAAMwHACHBBEAAzAcAIfAEAAC_CM8FIvYEAQDKBwAhzQVAAMwHACEHDAAAzgcAIE8AAMEIACBQAADBCAAgwgQAAADPBQLDBAAAAM8FCMQEAAAAzwUIyQQAAMAIzwUiBwwAAM4HACBPAADBCAAgUAAAwQgAIMIEAAAAzwUCwwQAAADPBQjEBAAAAM8FCMkEAADACM8FIgTCBAAAAM8FAsMEAAAAzwUIxAQAAADPBQjJBAAAwQjPBSIJtQQAAMIIADC2BAAA8wEAELcEAADCCAAwuAQBAMoHACG9BAEAygcAIb8EAQDKBwAhwARAAMwHACHBBEAAzAcAIcsFAADDCNAFIgcMAADOBwAgTwAAxQgAIFAAAMUIACDCBAAAANAFAsMEAAAA0AUIxAQAAADQBQjJBAAAxAjQBSIHDAAAzgcAIE8AAMUIACBQAADFCAAgwgQAAADQBQLDBAAAANAFCMQEAAAA0AUIyQQAAMQI0AUiBMIEAAAA0AUCwwQAAADQBQjEBAAAANAFCMkEAADFCNAFIhQHAADKCAAgMgAA4gcAIDMAAMkIACC1BAAAxggAMLYEAACnAQAQtwQAAMYIADC4BAEA3QcAIb0EAQDeBwAhwARAAOEHACHBBEAA4QcAIfAEAADHCKkFIvIEQADICAAhjgUBAN4HACGiBQEA3QcAIaMFAQDdBwAhpAUBAN4HACGmBQAAmgimBSOnBQEA3gcAIakFAQDeBwAhqgUBAN4HACEEwgQAAACpBQLDBAAAAKkFCMQEAAAAqQUIyQQAAJUIqQUiCMIEQAAAAAHDBEAAAAAFxARAAAAABcUEQAAAAAHGBEAAAAABxwRAAAAAAcgEQAAAAAHJBEAA6QcAISEEAAC6CAAgBQAAuwgAIAYAAKAIACASAAChCAAgHgAAoggAICsAAJAIACA0AACkCAAgNwAApAgAIDgAAJAIACA5AAC8CAAgOgAAjQgAIDsAAI0IACA8AAC9CAAgtQQAALkIADC2BAAAYwAQtwQAALkIADC4BAEA3QcAIbwEAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhwwUBAN0HACHEBSAA4AcAIcUFAQDeBwAhxgUBAN4HACHHBQEA3gcAIcgFAQDeBwAhyQUBAN4HACHKBQEA3gcAIcsFAQDdBwAhzAUBAN0HACHVBQAAYwAg1gUAAGMAIB0GAACgCAAgFQAA_gcAIBcAAKMIACAZAAD9BwAgJQAAnAgAICYAAJ0IACAnAACfCAAgKAAAoQgAICkAAKIIACArAACQCAAgLAAApQgAIC0AAKYIACAuAACnCAAgMAAAmwgAIDEAAJ4IACA0AACkCAAgtQQAAJkIADC2BAAAFgAQtwQAAJkIADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACHsBAAAmgimBSOIBQEA3QcAIY4FAQDeBwAhpAUBAN4HACGnBQEA3gcAIdUFAAAWACDWBQAAFgAgDgcAAM4IACAPAACICAAgtQQAAMsIADC2BAAAnAEAELcEAADLCAAwuAQBAN0HACG9BAEA3QcAIcAEQADhBwAhwQRAAOEHACGIBQEA3gcAIa8FAQDdBwAhsAUBAN0HACGxBQIAzAgAIbMFAADNCLMFIgjCBAIAAAABwwQCAAAABMQEAgAAAATFBAIAAAABxgQCAAAAAccEAgAAAAHIBAIAAAAByQQCAM4HACEEwgQAAACzBQLDBAAAALMFCMQEAAAAswUIyQQAALAIswUiHQYAAKAIACAVAAD-BwAgFwAAowgAIBkAAP0HACAlAACcCAAgJgAAnQgAICcAAJ8IACAoAAChCAAgKQAAoggAICsAAJAIACAsAAClCAAgLQAApggAIC4AAKcIACAwAACbCAAgMQAAnggAIDQAAKQIACC1BAAAmQgAMLYEAAAWABC3BAAAmQgAMLgEAQDdBwAhwARAAOEHACHBBEAA4QcAIewEAACaCKYFI4gFAQDdBwAhjgUBAN4HACGkBQEA3gcAIacFAQDeBwAh1QUAABYAINYFAAAWACAbBwAAzggAIAkAANMIACAOAADRCAAgEgAA0ggAILUEAADPCAAwtgQAADYAELcEAADPCAAwuAQBAN0HACG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIeIEAQDdBwAh9gQBAN0HACH3BAgA0AgAIfgECADQCAAh-QQIANAIACH6BAgA0AgAIfsECADQCAAh_AQIANAIACH9BAgA0AgAIf4ECADQCAAh_wQIANAIACGABQgA0AgAIYEFCADQCAAhggUIANAIACGDBQgA0AgAIQjCBAgAAAABwwQIAAAABcQECAAAAAXFBAgAAAABxgQIAAAAAccECAAAAAHIBAgAAAAByQQIAPMHACEcBwAAzggAIAkAANMIACAKAAD3CAAgCwAAiAgAIBEAAPUIACASAADSCAAgEwAA9ggAIBQAAOkIACAWAADmCAAgGgAA4ggAIB4AAO0IACC1BAAA9AgAMLYEAAAmABC3BAAA9AgAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHgBAEA3QcAIeEEAQDdBwAh4gQBAN0HACHkBAEA3QcAIZAFAQDdBwAhoAUBAN4HACGsBUAA4QcAIdUFAAAmACDWBQAAJgAgFwMAAOIHACAHAADOCAAgCQAA-QgAIBUAAP4HACAXAACjCAAgGAAApQgAIDUAAJAIACA2AACnCAAgtQQAAP8IADC2BAAADgAQtwQAAP8IADC4BAEA3QcAIbkEAQDdBwAhugQBAN0HACG7BAEA3QcAIbwEAQDeBwAhvQQBAN0HACG-BAEA3QcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIdUFAAAOACDWBQAADgAgGQgAAPwIACAVAAD-BwAgFwAAowgAIBkAAP0HACAlAACcCAAgJgAAnQgAICcAAJ8IACAoAAChCAAgKQAAoggAICsAAJAIACAsAAClCAAgLQAApggAIC4AAKcIACC1BAAA-wgAMLYEAAAYABC3BAAA-wgAMLgEAQDdBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhnwUBAN4HACGkBQEA3gcAIasFAQDdBwAh1QUAABgAINYFAAAYACACzQQBAAAAAfQEAQAAAAEXBwAAzggAIAkAANMIACASAADYCAAgIQAA1wgAICMAAMkIACAqAADiBwAgtQQAANUIADC2BAAAfwAQtwQAANUIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAhzQQBAN0HACHiBAEA3gcAIe4EAQDeBwAh8AQAANYI8AQi8QQBAN4HACHyBEAAyAgAIfMEQADhBwAh9AQBAN0HACH1BAEA3gcAIQTCBAAAAPAEAsMEAAAA8AQIxAQAAADwBAjJBAAA7wfwBCISIAAAkAgAILUEAACPCAAwtgQAAK4EABC3BAAAjwgAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHpBAEA3QcAIZwFAQDeBwAhnQUBAN0HACGeBQAA1gcAIJ8FAQDeBwAhoAUBAN4HACGhBQEA3QcAIdUFAACuBAAg1gUAAK4EACAXAwAA4gcAIAcAAM4IACAJAAD5CAAgFQAA_gcAIBcAAKMIACAYAAClCAAgNQAAkAgAIDYAAKcIACC1BAAA_wgAMLYEAAAOABC3BAAA_wgAMLgEAQDdBwAhuQQBAN0HACG6BAEA3QcAIbsEAQDdBwAhvAQBAN4HACG9BAEA3QcAIb4EAQDdBwAhvwQBAN0HACHABEAA4QcAIcEEQADhBwAh1QUAAA4AINYFAAAOACARAwAA4gcAIAcAAM4IACAJAADTCAAgFQAA_gcAIB8AAKYIACAkAACNCAAgtQQAANkIADC2BAAAZQAQtwQAANkIADC4BAEA3QcAIbwEAQDeBwAhvQQBAN0HACG-BAEA3gcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIYQFAQDdBwAhDQcAAM4IACAJAADTCAAgGQAA_QcAILUEAADaCAAwtgQAAFEAELcEAADaCAAwuAQBAN0HACG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhjgUBAN4HACEC9AQBAAAAAYYFAQAAAAETHgAA3wgAICEAAN4IACAiAADiBwAgIwAAyQgAILUEAADcCAAwtgQAAF0AELcEAADcCAAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAh5AQBAN4HACHuBAEA3gcAIfAEAADdCIYFIvEEAQDeBwAh8gRAAMgIACHzBEAA4QcAIfQEAQDdBwAh9QQBAN4HACGGBQEA3QcAIQTCBAAAAIYFAsMEAAAAhgUIxAQAAACGBQjJBAAA-AeGBSISIAAAjQgAILUEAACMCAAwtgQAAMcEABC3BAAAjAgAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHpBAEA3QcAIZwFAQDeBwAhnQUBAN0HACGeBQAA1gcAIJ8FAQDeBwAhoAUBAN4HACGhBQEA3QcAIdUFAADHBAAg1gUAAMcEACATAwAA4gcAIAcAAM4IACAJAADTCAAgFQAA_gcAIB8AAKYIACAkAACNCAAgtQQAANkIADC2BAAAZQAQtwQAANkIADC4BAEA3QcAIbwEAQDeBwAhvQQBAN0HACG-BAEA3gcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIYQFAQDdBwAh1QUAAGUAINYFAABlACAUBwAAzggAIAkAANMIACAVAAD-BwAgFwAAowgAIBgAAKUIACAaAADiCAAgGwAA4wgAILUEAADgCAAwtgQAAEoAELcEAADgCAAwuAQBAN0HACG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhjgUBAN4HACGPBQIA4QgAIZAFAQDdBwAhkQUBAN4HACEIwgQCAAAAAcMEAgAAAAXEBAIAAAAFxQQCAAAAAcYEAgAAAAHHBAIAAAAByAQCAAAAAckEAgDRBwAhDBUAAP4HACAZAAD9BwAgtQQAAPwHADC2BAAAvwUAELcEAAD8BwAwuAQBAN0HACG9BAEA3QcAIYgFAQDdBwAhiQVAAOEHACGKBUAA4QcAIdUFAAC_BQAg1gUAAL8FACAPBwAAzggAIAkAANMIACAZAAD9BwAgtQQAANoIADC2BAAAUQAQtwQAANoIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAhiAUBAN0HACGOBQEA3gcAIdUFAABRACDWBQAAUQAgEwcAAM4IACAJAADTCAAgEgAA0ggAIBYAAOYIACAcAACmCAAgtQQAAOQIADC2BAAARQAQtwQAAOQIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4AQBAN0HACHiBAEA3QcAIekEAQDdBwAh6gQBAN4HACHsBAAA5QjsBCLtBEAAyAgAIQTCBAAAAOwEAsMEAAAA7AQIxAQAAADsBAjJBAAA6wfsBCIWBwAAzggAIAkAANMIACAVAAD-BwAgFwAAowgAIBgAAKUIACAaAADiCAAgGwAA4wgAILUEAADgCAAwtgQAAEoAELcEAADgCAAwuAQBAN0HACG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIYgFAQDdBwAhjgUBAN4HACGPBQIA4QgAIZAFAQDdBwAhkQUBAN4HACHVBQAASgAg1gUAAEoAIALgBAEAAAAB4QQBAAAAARAHAADOCAAgCQAA0wgAIBIAANIIACAUAADpCAAgFgAA5ggAILUEAADoCAAwtgQAAEAAELcEAADoCAAwuAQBAN0HACG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIeAEAQDdBwAh4QQBAN0HACHiBAEA3QcAIRQHAADOCAAgCQAA-QgAIAoAAPcIACAVAAD-BwAgFwAAowgAILUEAAD4CAAwtgQAACEAELcEAAD4CAAwuAQBAN0HACG9BAEA3QcAIb4EAQDdBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhmgUCAOEIACGgBQEA3gcAIa0FAQDdBwAhrgUBAN0HACHVBQAAIQAg1gUAACEAIALjBAEAAAAB5AQBAAAAARIHAADOCAAgCQAA0wgAIB0AAOwIACAeAADtCAAgtQQAAOsIADC2BAAAOwAQtwQAAOsIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4wQBAN0HACHkBAEA3QcAIeUEAQDeBwAh5gQBAN4HACHnBAEA3gcAIegEQADhBwAhFQcAAM4IACAJAADTCAAgEgAA0ggAIBYAAOYIACAcAACmCAAgtQQAAOQIADC2BAAARQAQtwQAAOQIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4AQBAN0HACHiBAEA3QcAIekEAQDdBwAh6gQBAN4HACHsBAAA5QjsBCLtBEAAyAgAIdUFAABFACDWBQAARQAgEwMAAOIHACAHAADOCAAgCQAA0wgAIBUAAP4HACAfAACmCAAgJAAAjQgAILUEAADZCAAwtgQAAGUAELcEAADZCAAwuAQBAN0HACG8BAEA3gcAIb0EAQDdBwAhvgQBAN4HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACGEBQEA3QcAIdUFAABlACDWBQAAZQAgAvYEAQAAAAHNBUAAAAABCg4AANEIACC1BAAA7wgAMLYEAAAyABC3BAAA7wgAMLgEAQDdBwAhwARAAOEHACHBBEAA4QcAIfAEAADwCM8FIvYEAQDdBwAhzQVAAOEHACEEwgQAAADPBQLDBAAAAM8FCMQEAAAAzwUIyQQAAMEIzwUiDw0AAPIIACAOAADRCAAgEAAA8wgAILUEAADxCAAwtgQAACoAELcEAADxCAAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAh9gQBAN0HACGIBQEA3QcAIY4FAQDeBwAhlQUBAN4HACGWBQEA3QcAIZcFAQDdBwAhDgsAAIgIACC1BAAAhggAMLYEAACMBQAQtwQAAIYIADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACHwBAAAhwiVBSKIBQEA3QcAIY4FAQDeBwAhkgVAAOEHACGTBUAA4QcAIdUFAACMBQAg1gUAAIwFACAQBwAAzggAIA8AAIgIACC1BAAAywgAMLYEAACcAQAQtwQAAMsIADC4BAEA3QcAIb0EAQDdBwAhwARAAOEHACHBBEAA4QcAIYgFAQDeBwAhrwUBAN0HACGwBQEA3QcAIbEFAgDMCAAhswUAAM0IswUi1QUAAJwBACDWBQAAnAEAIBoHAADOCAAgCQAA0wgAIAoAAPcIACALAACICAAgEQAA9QgAIBIAANIIACATAAD2CAAgFAAA6QgAIBYAAOYIACAaAADiCAAgHgAA7QgAILUEAAD0CAAwtgQAACYAELcEAAD0CAAwuAQBAN0HACG9BAEA3QcAIb4EAQDeBwAhwARAAOEHACHBBEAA4QcAIeAEAQDdBwAh4QQBAN0HACHiBAEA3QcAIeQEAQDdBwAhkAUBAN0HACGgBQEA3gcAIawFQADhBwAhA4sFAAAyACCMBQAAMgAgjQUAADIAIB0HAADOCAAgCQAA0wgAIA4AANEIACASAADSCAAgtQQAAM8IADC2BAAANgAQtwQAAM8IADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4gQBAN0HACH2BAEA3QcAIfcECADQCAAh-AQIANAIACH5BAgA0AgAIfoECADQCAAh-wQIANAIACH8BAgA0AgAIf0ECADQCAAh_gQIANAIACH_BAgA0AgAIYAFCADQCAAhgQUIANAIACGCBQgA0AgAIYMFCADQCAAh1QUAADYAINYFAAA2ACAUBwAAzggAIAkAAPkIACAUAACfCAAgFQAA_gcAILUEAAD6CAAwtgQAAB0AELcEAAD6CAAwuAQBAN0HACG9BAEA3QcAIb4EAQDdBwAhwARAAOEHACHBBEAA4QcAIekEAQDdBwAhjgUBAN4HACGYBQEA3gcAIZkFQADICAAhmgUIANAIACGbBQgA0AgAIdUFAAAdACDWBQAAHQAgEgcAAM4IACAJAAD5CAAgCgAA9wgAIBUAAP4HACAXAACjCAAgtQQAAPgIADC2BAAAIQAQtwQAAPgIADC4BAEA3QcAIb0EAQDdBwAhvgQBAN0HACHABEAA4QcAIcEEQADhBwAhjgUBAN4HACGaBQIA4QgAIaAFAQDeBwAhrQUBAN0HACGuBQEA3QcAIRkIAAD8CAAgFQAA_gcAIBcAAKMIACAZAAD9BwAgJQAAnAgAICYAAJ0IACAnAACfCAAgKAAAoQgAICkAAKIIACArAACQCAAgLAAApQgAIC0AAKYIACAuAACnCAAgtQQAAPsIADC2BAAAGAAQtwQAAPsIADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACGOBQEA3gcAIZ8FAQDeBwAhpAUBAN4HACGrBQEA3QcAIdUFAAAYACDWBQAAGAAgEgcAAM4IACAJAAD5CAAgFAAAnwgAIBUAAP4HACC1BAAA-ggAMLYEAAAdABC3BAAA-ggAMLgEAQDdBwAhvQQBAN0HACG-BAEA3QcAIcAEQADhBwAhwQRAAOEHACHpBAEA3QcAIY4FAQDeBwAhmAUBAN4HACGZBUAAyAgAIZoFCADQCAAhmwUIANAIACEXCAAA_AgAIBUAAP4HACAXAACjCAAgGQAA_QcAICUAAJwIACAmAACdCAAgJwAAnwgAICgAAKEIACApAACiCAAgKwAAkAgAICwAAKUIACAtAACmCAAgLgAApwgAILUEAAD7CAAwtgQAABgAELcEAAD7CAAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAhjgUBAN4HACGfBQEA3gcAIaQFAQDeBwAhqwUBAN0HACEOBwAAyggAIC8AAP4IACC1BAAA_QgAMLYEAAASABC3BAAA_QgAMLgEAQDdBwAhvQQBAN4HACHABEAA4QcAIcEEQADhBwAhjgUBAN4HACGkBQEA3gcAIasFAQDdBwAh1QUAABIAINYFAAASACAMBwAAyggAIC8AAP4IACC1BAAA_QgAMLYEAAASABC3BAAA_QgAMLgEAQDdBwAhvQQBAN4HACHABEAA4QcAIcEEQADhBwAhjgUBAN4HACGkBQEA3gcAIasFAQDdBwAhA4sFAAAYACCMBQAAGAAgjQUAABgAIBUDAADiBwAgBwAAzggAIAkAAPkIACAVAAD-BwAgFwAAowgAIBgAAKUIACA1AACQCAAgNgAApwgAILUEAAD_CAAwtgQAAA4AELcEAAD_CAAwuAQBAN0HACG5BAEA3QcAIboEAQDdBwAhuwQBAN0HACG8BAEA3gcAIb0EAQDdBwAhvgQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACELAwAA4gcAIAcAAM4IACC1BAAAgAkAMLYEAAALABC3BAAAgAkAMLgEAQDdBwAhvQQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACHLBQAAgQnQBSIEwgQAAADQBQLDBAAAANAFCMQEAAAA0AUIyQQAAMUI0AUiEQMAAOIHACC1BAAAggkAMLYEAAAHABC3BAAAggkAMLgEAQDdBwAhvwQBAN0HACHABEAA4QcAIcEEQADhBwAhtwUBAN0HACG4BQEA3QcAIbkFAQDeBwAhugUBAN4HACG7BQEA3gcAIbwFQADICAAhvQVAAMgIACG-BQEA3gcAIb8FAQDeBwAhDAMAAOIHACC1BAAAgwkAMLYEAAADABC3BAAAgwkAMLgEAQDdBwAhvwQBAN0HACHABEAA4QcAIcEEQADhBwAhtgVAAOEHACHABQEA3QcAIcEFAQDeBwAhwgUBAN4HACEAAAAAAdoFAQAAAAEB2gUBAAAAAQHaBUAAAAABBUkAANETACBKAADuFAAg1wUAANITACDYBQAA7RQAIN0FAAD5AwAgC0kAAPkJADBKAAD-CQAw1wUAAPoJADDYBQAA-wkAMNkFAAD8CQAg2gUAAP0JADDbBQAA_QkAMNwFAAD9CQAw3QUAAP0JADDeBQAA_wkAMN8FAACACgAwC0kAAOUJADBKAADqCQAw1wUAAOYJADDYBQAA5wkAMNkFAADoCQAg2gUAAOkJADDbBQAA6QkAMNwFAADpCQAw3QUAAOkJADDeBQAA6wkAMN8FAADsCQAwC0kAAL4JADBKAADDCQAw1wUAAL8JADDYBQAAwAkAMNkFAADBCQAg2gUAAMIJADDbBQAAwgkAMNwFAADCCQAw3QUAAMIJADDeBQAAxAkAMN8FAADFCQAwC0kAAKYJADBKAACrCQAw1wUAAKcJADDYBQAAqAkAMNkFAACpCQAg2gUAAKoJADDbBQAAqgkAMNwFAACqCQAw3QUAAKoJADDeBQAArAkAMN8FAACtCQAwC0kAAJMJADBKAACYCQAw1wUAAJQJADDYBQAAlQkAMNkFAACWCQAg2gUAAJcJADDbBQAAlwkAMNwFAACXCQAw3QUAAJcJADDeBQAAmQkAMN8FAACaCQAwBUkAAM8TACBKAADrFAAg1wUAANATACDYBQAA6hQAIN0FAAAaACAFSQAAzRMAIEoAAOgUACDXBQAAzhMAINgFAADnFAAg3QUAAIwCACAWBwAApAkAIAkAAKUJACAOAACjCQAguAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAH2BAEAAAAB9wQIAAAAAfgECAAAAAH5BAgAAAAB-gQIAAAAAfsECAAAAAH8BAgAAAAB_QQIAAAAAf4ECAAAAAH_BAgAAAABgAUIAAAAAYEFCAAAAAGCBQgAAAABgwUIAAAAAQIAAACLAQAgSQAAogkAIAMAAACLAQAgSQAAogkAIEoAAJ4JACABQgAA5hQAMBsHAADOCAAgCQAA0wgAIA4AANEIACASAADSCAAgtQQAAM8IADC2BAAANgAQtwQAAM8IADC4BAEAAAABvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHiBAEA3QcAIfYEAQAAAAH3BAgA0AgAIfgECADQCAAh-QQIANAIACH6BAgA0AgAIfsECADQCAAh_AQIANAIACH9BAgA0AgAIf4ECADQCAAh_wQIANAIACGABQgA0AgAIYEFCADQCAAhggUIANAIACGDBQgA0AgAIQIAAACLAQAgQgAAngkAIAIAAACbCQAgQgAAnAkAIBe1BAAAmgkAMLYEAACbCQAQtwQAAJoJADC4BAEA3QcAIb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAh4gQBAN0HACH2BAEA3QcAIfcECADQCAAh-AQIANAIACH5BAgA0AgAIfoECADQCAAh-wQIANAIACH8BAgA0AgAIf0ECADQCAAh_gQIANAIACH_BAgA0AgAIYAFCADQCAAhgQUIANAIACGCBQgA0AgAIYMFCADQCAAhF7UEAACaCQAwtgQAAJsJABC3BAAAmgkAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACHiBAEA3QcAIfYEAQDdBwAh9wQIANAIACH4BAgA0AgAIfkECADQCAAh-gQIANAIACH7BAgA0AgAIfwECADQCAAh_QQIANAIACH-BAgA0AgAIf8ECADQCAAhgAUIANAIACGBBQgA0AgAIYIFCADQCAAhgwUIANAIACETuAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIfYEAQCICQAh9wQIAJ0JACH4BAgAnQkAIfkECACdCQAh-gQIAJ0JACH7BAgAnQkAIfwECACdCQAh_QQIAJ0JACH-BAgAnQkAIf8ECACdCQAhgAUIAJ0JACGBBQgAnQkAIYIFCACdCQAhgwUIAJ0JACEF2gUIAAAAAeAFCAAAAAHhBQgAAAAB4gUIAAAAAeMFCAAAAAEWBwAAoAkAIAkAAKEJACAOAACfCQAguAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIfYEAQCICQAh9wQIAJ0JACH4BAgAnQkAIfkECACdCQAh-gQIAJ0JACH7BAgAnQkAIfwECACdCQAh_QQIAJ0JACH-BAgAnQkAIf8ECACdCQAhgAUIAJ0JACGBBQgAnQkAIYIFCACdCQAhgwUIAJ0JACEFSQAA2xQAIEoAAOQUACDXBQAA3BQAINgFAADjFAAg3QUAACgAIAVJAADZFAAgSgAA4RQAINcFAADaFAAg2AUAAOAUACDdBQAA-QMAIAdJAADXFAAgSgAA3hQAINcFAADYFAAg2AUAAN0UACDbBQAAGAAg3AUAABgAIN0FAAAaACAWBwAApAkAIAkAAKUJACAOAACjCQAguAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAH2BAEAAAAB9wQIAAAAAfgECAAAAAH5BAgAAAAB-gQIAAAAAfsECAAAAAH8BAgAAAAB_QQIAAAAAf4ECAAAAAH_BAgAAAABgAUIAAAAAYEFCAAAAAGCBQgAAAABgwUIAAAAAQNJAADbFAAg1wUAANwUACDdBQAAKAAgA0kAANkUACDXBQAA2hQAIN0FAAD5AwAgA0kAANcUACDXBQAA2BQAIN0FAAAaACASBwAAvAkAIAkAAL0JACAhAAC5CQAgIwAAuwkAICoAALoJACC4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAc0EAQAAAAHuBAEAAAAB8AQAAADwBALxBAEAAAAB8gRAAAAAAfMEQAAAAAH0BAEAAAAB9QQBAAAAAQIAAACBAQAgSQAAuAkAIAMAAACBAQAgSQAAuAkAIEoAALIJACABQgAA1hQAMBgHAADOCAAgCQAA0wgAIBIAANgIACAhAADXCAAgIwAAyQgAICoAAOIHACC1BAAA1QgAMLYEAAB_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_EwAg1wUAANwTACDYBQAA_hMAIN0FAABMACAHSQAA2RMAIEoAAPwTACDXBQAA2hMAINgFAAD7EwAg2wUAABgAINwFAAAYACDdBQAAGgAgB0kAANcTACBKAAD5EwAg1wUAANgTACDYBQAA-BMAINsFAAAdACDcBQAAHQAg3QUAAB8AIAVJAADVEwAgSgAA9hMAINcFAADWEwAg2AUAAPUTACDdBQAAvAUAIAVJAADTEwAgSgAA8xMAINcFAADUEwAg2AUAAPITACDdBQAA-QMAIBYHAACkCQAgCQAApQkAIBIAAJQKACC4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAeIEAQAAAAH3BAgAAAAB-AQIAAAAAfkECAAAAAH6BAgAAAAB-wQIAAAAAfwECAAAAAH9BAgAAAAB_gQIAAAAAf8ECAAAAAGABQgAAAABgQUIAAAAAYIFCAAAAAGDBQgAAAABAgAAAIsBACBJAACOCgAgAwAAADYAIEkAAI4KACBKAACSCgAgGAAAADYAIAcAAKAJACAJAAChCQAgEgAAkwoAIEIAAJIKACC4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAh4gQBAIgJACH3BAgAnQkAIfgECACdCQAh-QQIAJ0JACH6BAgAnQkAIfsECACdCQAh_AQIAJ0JACH9BAgAnQkAIf4ECACdCQAh_wQIAJ0JACGABQgAnQkAIYEFCACdCQAhggUIAJ0JACGDBQgAnQkAIRYHAACgCQAgCQAAoQkAIBIAAJMKACC4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAh4gQBAIgJACH3BAgAnQkAIfgECACdCQAh-QQIAJ0JACH6BAgAnQkAIfsECACdCQAh_AQIAJ0JACH9BAgAnQkAIf4ECACdCQAh_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-QMAIANJAADREwAg1wUAANITACDdBQAA-QMAIARJAAD5CQAw1wUAAPoJADDZBQAA_AkAIN0FAAD9CQAwBEkAAOUJADDXBQAA5gkAMNkFAADoCQAg3QUAAOkJADAESQAAvgkAMNcFAAC_CQAw2QUAAMEJACDdBQAAwgkAMARJAACmCQAw1wUAAKcJADDZBQAAqQkAIN0FAACqCQAwBEkAAJMJADDXBQAAlAkAMNkFAACWCQAg3QUAAJcJADADSQAAzxMAINcFAADQEwAg3QUAABoAIANJAADNEwAg1wUAAM4TACDdBQAAjAIAIAAAAALaBQEAAAAE5AUBAAAABQLaBQEAAAAE5AUBAAAABQHaBSAAAAABBUkAAMgTACBKAADLEwAg1wUAAMkTACDYBQAAyhMAIN0FAACMAgAgAdoFAQAAAAQB2gUBAAAABANJAADIEwAg1wUAAMkTACDdBQAAjAIAIBQEAAC8EQAgBQAAvREAIAYAAPkPACASAAD6DwAgHgAA-w8AICsAAOoMACA0AAD9DwAgNwAA_Q8AIDgAAOoMACA5AAC-EQAgOgAA2QwAIDsAANkMACA8AAC_EQAgvAQAAIQJACDFBQAAhAkAIMYFAACECQAgxwUAAIQJACDIBQAAhAkAIMkFAACECQAgygUAAIQJACAAAAAFSQAAwxMAIEoAAMYTACDXBQAAxBMAINgFAADFEwAg3QUAABAAIANJAADDEwAg1wUAAMQTACDdBQAAEAAgAAAABUkAAL4TACBKAADBEwAg1wUAAL8TACDYBQAAwBMAIN0FAABHACADSQAAvhMAINcFAAC_EwAg3QUAAEcAIAAAAAVJAAC5EwAgSgAAvBMAINcFAAC6EwAg2AUAALsTACDdBQAAEAAgA0kAALkTACDXBQAAuhMAIN0FAAAQACAAAAAHSQAAtBMAIEoAALcTACDXBQAAtRMAINgFAAC2EwAg2wUAAA4AINwFAAAOACDdBQAAEAAgA0kAALQTACDXBQAAtRMAIN0FAAAQACAAAAAAAAAAAAVJAACSEwAgSgAAshMAINcFAACTEwAg2AUAALETACDdBQAA-QMAIAdJAACQEwAgSgAArxMAINcFAACREwAg2AUAAK4TACDbBQAAGAAg3AUAABgAIN0FAAAaACAFSQAAjhMAIEoAAKwTACDXBQAAjxMAINgFAACrEwAg3QUAAIwCACALSQAAjgsAMEoAAJILADDXBQAAjwsAMNgFAACQCwAw2QUAAJELACDaBQAA_QkAMNsFAAD9CQAw3AUAAP0JADDdBQAA_QkAMN4FAACTCwAw3wUAAIAKADALSQAAhQsAMEoAAIkLADDXBQAAhgsAMNgFAACHCwAw2QUAAIgLACDaBQAA0gkAMNsFAADSCQAw3AUAANIJADDdBQAA0gkAMN4FAACKCwAw3wUAANUJADALSQAA8goAMEoAAPcKADDXBQAA8woAMNgFAAD0CgAw2QUAAPUKACDaBQAA9goAMNsFAAD2CgAw3AUAAPYKADDdBQAA9goAMN4FAAD4CgAw3wUAAPkKADAOIQAAggsAICIAAIMLACAjAACECwAguAQBAAAAAcAEQAAAAAHBBEAAAAAB7gQBAAAAAfAEAAAAhgUC8QQBAAAAAfIEQAAAAAHzBEAAAAAB9AQBAAAAAfUEAQAAAAGGBQEAAAABAgAAAF8AIEkAAIELACADAAAAXwAgSQAAgQsAIEoAAP0KACABQgAAqhMAMBQeAADfCAAgIQAA3ggAICIAAOIHACAjAADJCAAgtQQAANwIADC2BAAAXQAQtwQAANwIADC4BAEAAAABwARAAOEHACHBBEAA4QcAIeQEAQDeBwAh7gQBAN4HACHwBAAA3QiGBSLxBAEA3gcAIfIEQADICAAh8wRAAOEHACH0BAEA3QcAIfUEAQDeBwAhhgUBAN0HACHRBQAA2wgAIAIAAABfACBCAAD9CgAgAgAAAPoKACBCAAD7CgAgD7UEAAD5CgAwtgQAAPoKABC3BAAA-QoAMLgEAQDdBwAhwARAAOEHACHBBEAA4QcAIeQEAQDeBwAh7gQBAN4HACHwBAAA3QiGBSLxBAEA3gcAIfIEQADICAAh8wRAAOEHACH0BAEA3QcAIfUEAQDeBwAhhgUBAN0HACEPtQQAAPkKADC2BAAA-goAELcEAAD5CgAwuAQBAN0HACHABEAA4QcAIcEEQADhBwAh5AQBAN4HACHuBAEA3gcAIfAEAADdCIYFIvEEAQDeBwAh8gRAAMgIACHzBEAA4QcAIfQEAQDdBwAh9QQBAN4HACGGBQEA3QcAIQu4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHuBAEAiQkAIfAEAAD8CoYFIvEEAQCJCQAh8gRAALEJACHzBEAAigkAIfQEAQCICQAh9QQBAIkJACGGBQEAiAkAIQHaBQAAAIYFAg4hAAD-CgAgIgAA_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_CwAw3wUAAMALADALSQAAsAsAMEoAALQLADDXBQAAsQsAMNgFAACyCwAw2QUAALMLACDaBQAA_QkAMNsFAAD9CQAw3AUAAP0JADDdBQAA_QkAMN4FAAC1CwAw3wUAAIAKADAVBwAAvAoAIAkAALkKACAKAAC6CgAgCwAAswoAIBEAALQKACASAACYCwAgEwAAtQoAIBQAALYKACAWAAC4CgAgHgAAtwoAILgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4AQBAAAAAeEEAQAAAAHiBAEAAAAB5AQBAAAAAaAFAQAAAAGsBUAAAAABAgAAACgAIEkAALgLACADAAAAKAAgSQAAuAsAIEoAALcLACABQgAAgxMAMAIAAAAoACBCAAC3CwAgAgAAAIEKACBCAAC2CwAgC7gEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHgBAEAiAkAIeEEAQCICQAh4gQBAIgJACHkBAEAiAkAIaAFAQCJCQAhrAVAAIoJACEVBwAAjQoAIAkAAIoKACAKAACLCgAgCwAAhAoAIBEAAIUKACASAACWCwAgEwAAhgoAIBQAAIcKACAWAACJCgAgHgAAiAoAILgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHgBAEAiAkAIeEEAQCICQAh4gQBAIgJACHkBAEAiAkAIaAFAQCJCQAhrAVAAIoJACEVBwAAvAoAIAkAALkKACAKAAC6CgAgCwAAswoAIBEAALQKACASAACYCwAgEwAAtQoAIBQAALYKACAWAAC4CgAgHgAAtwoAILgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4AQBAAAAAeEEAQAAAAHiBAEAAAAB5AQBAAAAAaAFAQAAAAGsBUAAAAABDwcAAOoLACAJAADrCwAgFQAA5wsAIBcAAOgLACAYAADpCwAgGwAA7AsAILgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAABiAUBAAAAAY4FAQAAAAGPBQIAAAABkQUBAAAAAQIAAABMACBJAADmCwAgAwAAAEwAIEkAAOYLACBKAADECwAgAUIAAIITADAUBwAAzggAIAkAANMIACAVAAD-BwAgFwAAowgAIBgAAKUIACAaAADiCAAgGwAA4wgAILUEAADgCAAwtgQAAEoAELcEAADgCAAwuAQBAAAAAb0EAQDdBwAhvgQBAN4HACHABEAA4QcAIcEEQADhBwAhiAUBAN0HACGOBQEA3gcAIY8FAgDhCAAhkAUBAN0HACGRBQEA3gcAIQIAAABMACBCAADECwAgAgAAAMELACBCAADCCwAgDbUEAADACwAwtgQAAMELABC3BAAAwAsAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACGIBQEA3QcAIY4FAQDeBwAhjwUCAOEIACGQBQEA3QcAIZEFAQDeBwAhDbUEAADACwAwtgQAAMELABC3BAAAwAsAMLgEAQDdBwAhvQQBAN0HACG-BAEA3gcAIcAEQADhBwAhwQRAAOEHACGIBQEA3QcAIY4FAQDeBwAhjwUCAOEIACGQBQEA3QcAIZEFAQDeBwAhCbgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACGIBQEAiAkAIY4FAQCJCQAhjwUCAMMLACGRBQEAiQkAIQXaBQIAAAAB4AUCAAAAAeEFAgAAAAHiBQIAAAAB4wUCAAAAAQ8HAADICwAgCQAAyQsAIBUAAMULACAXAADGCwAgGAAAxwsAIBsAAMoLACC4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAhiAUBAIgJACGOBQEAiQkAIY8FAgDDCwAhkQUBAIkJACELSQAA3QsAMEoAAOELADDXBQAA3gsAMNgFAADfCwAw2QUAAOALACDaBQAA_QkAMNsFAAD9CQAw3AUAAP0JADDdBQAA_QkAMN4FAADiCwAw3wUAAIAKADALSQAA1AsAMEoAANgLADDXBQAA1QsAMNgFAADWCwAw2QUAANcLACDaBQAA6QkAMNsFAADpCQAw3AUAAOkJADDdBQAA6QkAMN4FAADZCwAw3wUAAOwJADALSQAAywsAMEoAAM8LADDXBQAAzAsAMNgFAADNCwAw2QUAAM4LACDaBQAAwgkAMNsFAADCCQAw3AUAAMIJADDdBQAAwgkAMN4FAADQCwAw3wUAAMUJADAFSQAA9BIAIEoAAIATACDXBQAA9RIAINgFAAD_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_wsAMNkFAACADAAg2gUAAKYKADDbBQAApgoAMNwFAACmCgAw3QUAAKYKADDeBQAAggwAMN8FAACpCgAwCg4AAIcMACAQAACxCgAguAQBAAAAAcAEQAAAAAHBBEAAAAAB9gQBAAAAAYgFAQAAAAGOBQEAAAABlQUBAAAAAZcFAQAAAAECAAAALAAgSQAAhgwAIAMAAAAsACBJAACGDAAgSgAAhAwAIAFCAADqEgAwAgAAACwAIEIAAIQMACACAAAAqgoAIEIAAIMMACAIuAQBAIgJACHABEAAigkAIcEEQACKCQAh9gQBAIgJACGIBQEAiAkAIY4FAQCJCQAhlQUBAIkJACGXBQEAiAkAIQoOAACFDAAgEAAArgoAILgEAQCICQAhwARAAIoJACHBBEAAigkAIfYEAQCICQAhiAUBAIgJACGOBQEAiQkAIZUFAQCJCQAhlwUBAIgJACEFSQAA5RIAIEoAAOgSACDXBQAA5hIAINgFAADnEgAg3QUAACgAIAoOAACHDAAgEAAAsQoAILgEAQAAAAHABEAAAAABwQRAAAAAAfYEAQAAAAGIBQEAAAABjgUBAAAAAZUFAQAAAAGXBQEAAAABA0kAAOUSACDXBQAA5hIAIN0FAAAoACAESQAA_QsAMNcFAAD-CwAw2QUAAIAMACDdBQAApgoAMAAAAAAAAAAAAAtJAACfDAAwSgAApAwAMNcFAACgDAAw2AUAAKEMADDZBQAAogwAINoFAACjDAAw2wUAAKMMADDcBQAAowwAMN0FAACjDAAw3gUAAKUMADDfBQAApgwAMAtJAACWDAAwSgAAmgwAMNcFAACXDAAw2AUAAJgMADDZBQAAmQwAINoFAAD9CQAw2wUAAP0JADDcBQAA_QkAMN0FAAD9CQAw3gUAAJsMADDfBQAAgAoAMAVJAADPEgAgSgAA4xIAINcFAADQEgAg2AUAAOISACDdBQAA-QMAIAVJAADNEgAgSgAA4BIAINcFAADOEgAg2AUAAN8SACDdBQAAGgAgFQcAALwKACAJAAC5CgAgCwAAswoAIBEAALQKACASAACYCwAgEwAAtQoAIBQAALYKACAWAAC4CgAgGgAAuwoAIB4AALcKACC4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAeAEAQAAAAHhBAEAAAAB4gQBAAAAAeQEAQAAAAGQBQEAAAABrAVAAAAAAQIAAAAoACBJAACeDAAgAwAAACgAIEkAAJ4MACBKAACdDAAgAUIAAN4SADACAAAAKAAgQgAAnQwAIAIAAACBCgAgQgAAnAwAIAu4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAh4AQBAIgJACHhBAEAiAkAIeIEAQCICQAh5AQBAIgJACGQBQEAiAkAIawFQACKCQAhFQcAAI0KACAJAACKCgAgCwAAhAoAIBEAAIUKACASAACWCwAgEwAAhgoAIBQAAIcKACAWAACJCgAgGgAAjAoAIB4AAIgKACC4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAh4AQBAIgJACHhBAEAiAkAIeIEAQCICQAh5AQBAIgJACGQBQEAiAkAIawFQACKCQAhFQcAALwKACAJAAC5CgAgCwAAswoAIBEAALQKACASAACYCwAgEwAAtQoAIBQAALYKACAWAAC4CgAgGgAAuwoAIB4AALcKACC4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAeAEAQAAAAHhBAEAAAAB4gQBAAAAAeQEAQAAAAGQBQEAAAABrAVAAAAAAQ0HAADBDAAgCQAAwgwAIBUAAMMMACAXAADEDAAguAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAGOBQEAAAABmgUCAAAAAa0FAQAAAAGuBQEAAAABAgAAACMAIEkAAMAMACADAAAAIwAgSQAAwAwAIEoAAKkMACABQgAA3RIAMBIHAADOCAAgCQAA-QgAIAoAAPcIACAVAAD-BwAgFwAAowgAILUEAAD4CAAwtgQAACEAELcEAAD4CAAwuAQBAAAAAb0EAQDdBwAhvgQBAN0HACHABEAA4QcAIcEEQADhBwAhjgUBAN4HACGaBQIA4QgAIaAFAQDeBwAhrQUBAAAAAa4FAQDdBwAhAgAAACMAIEIAAKkMACACAAAApwwAIEIAAKgMACANtQQAAKYMADC2BAAApwwAELcEAACmDAAwuAQBAN0HACG9BAEA3QcAIb4EAQDdBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhmgUCAOEIACGgBQEA3gcAIa0FAQDdBwAhrgUBAN0HACENtQQAAKYMADC2BAAApwwAELcEAACmDAAwuAQBAN0HACG9BAEA3QcAIb4EAQDdBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhmgUCAOEIACGgBQEA3gcAIa0FAQDdBwAhrgUBAN0HACEJuAQBAIgJACG9BAEAiAkAIb4EAQCICQAhwARAAIoJACHBBEAAigkAIY4FAQCJCQAhmgUCAMMLACGtBQEAiAkAIa4FAQCICQAhDQcAAKoMACAJAACrDAAgFQAArAwAIBcAAK0MACC4BAEAiAkAIb0EAQCICQAhvgQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGaBQIAwwsAIa0FAQCICQAhrgUBAIgJACEFSQAA0xIAIEoAANsSACDXBQAA1BIAINgFAADaEgAg3QUAAPkDACAFSQAA0RIAIEoAANgSACDXBQAA0hIAINgFAADXEgAg3QUAABoAIAtJAAC3DAAwSgAAuwwAMNcFAAC4DAAw2AUAALkMADDZBQAAugwAINoFAAD9CQAw2wUAAP0JADDcBQAA_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_AqGBSLxBAEAiQkAIfIEQACxCQAh8wRAAIoJACH1BAEAiQkAIYYFAQCICQAhDh4AAKILACAiAAD_CgAgIwAAgAsAILgEAQCICQAhwARAAIoJACHBBEAAigkAIeQEAQCJCQAh7gQBAIkJACHwBAAA_AqGBSLxBAEAiQkAIfIEQACxCQAh8wRAAIoJACH1BAEAiQkAIYYFAQCICQAhDh4AAKMLACAiAACDCwAgIwAAhAsAILgEAQAAAAHABEAAAAABwQRAAAAAAeQEAQAAAAHuBAEAAAAB8AQAAACGBQLxBAEAAAAB8gRAAAAAAfMEQAAAAAH1BAEAAAABhgUBAAAAAQHaBQEAAAAEBEkAAM4MADDXBQAAzwwAMNkFAADRDAAg3QUAAPYKADAAAAAAAtoFAQAAAATkBQEAAAAFC0kAAN8MADBKAADjDAAw1wUAAOAMADDYBQAA4QwAMNkFAADiDAAg2gUAAKoJADDbBQAAqgkAMNwFAACqCQAw3QUAAKoJADDeBQAA5AwAMN8FAACtCQAwEgcAALwJACAJAAC9CQAgEgAA4woAICMAALsJACAqAAC6CQAguAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAHNBAEAAAAB4gQBAAAAAe4EAQAAAAHwBAAAAPAEAvEEAQAAAAHyBEAAAAAB8wRAAAAAAfUEAQAAAAECAAAAgQEAIEkAAOcMACADAAAAgQEAIEkAAOcMACBKAADmDAAgAUIAAMsSADACAAAAgQEAIEIAAOYMACACAAAArgkAIEIAAOUMACANuAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIc0EAQCICQAh4gQBAIkJACHuBAEAiQkAIfAEAACwCfAEIvEEAQCJCQAh8gRAALEJACHzBEAAigkAIfUEAQCJCQAhEgcAALYJACAJAAC3CQAgEgAA4goAICMAALUJACAqAAC0CQAguAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIc0EAQCICQAh4gQBAIkJACHuBAEAiQkAIfAEAACwCfAEIvEEAQCJCQAh8gRAALEJACHzBEAAigkAIfUEAQCJCQAhEgcAALwJACAJAAC9CQAgEgAA4woAICMAALsJACAqAAC6CQAguAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAHNBAEAAAAB4gQBAAAAAe4EAQAAAAHwBAAAAPAEAvEEAQAAAAHyBEAAAAAB8wRAAAAAAfUEAQAAAAEB2gUBAAAABARJAADfDAAw1wUAAOAMADDZBQAA4gwAIN0FAACqCQAwAAAAAAHaBQAAAKYFAwHaBQAAAKkFAgVJAADAEgAgSgAAyRIAINcFAADBEgAg2AUAAMgSACDdBQAAjAIAIAdJAAC-EgAgSgAAxhIAINcFAAC_EgAg2AUAAMUSACDbBQAAYwAg3AUAAGMAIN0FAACMAgAgB0kAALwSACBKAADDEgAg1wUAAL0SACDYBQAAwhIAINsFAAAWACDcBQAAFgAg3QUAAPkDACADSQAAwBIAINcFAADBEgAg3QUAAIwCACADSQAAvhIAINcFAAC_EgAg3QUAAIwCACADSQAAvBIAINcFAAC9EgAg3QUAAPkDACAAAAALSQAAxA4AMEoAAMkOADDXBQAAxQ4AMNgFAADGDgAw2QUAAMcOACDaBQAAyA4AMNsFAADIDgAw3AUAAMgOADDdBQAAyA4AMN4FAADKDgAw3wUAAMsOADALSQAAuA4AMEoAAL0OADDXBQAAuQ4AMNgFAAC6DgAw2QUAALsOACDaBQAAvA4AMNsFAAC8DgAw3AUAALwOADDdBQAAvA4AMN4FAAC-DgAw3wUAAL8OADALSQAAnw4AMEoAAKQOADDXBQAAoA4AMNgFAAChDgAw2QUAAKIOACDaBQAAow4AMNsFAACjDgAw3AUAAKMOADDdBQAAow4AMN4FAAClDgAw3wUAAKYOADALSQAAhg4AMEoAAIsOADDXBQAAhw4AMNgFAACIDgAw2QUAAIkOACDaBQAAig4AMNsFAACKDgAw3AUAAIoOADDdBQAAig4AMN4FAACMDgAw3wUAAI0OADALSQAA_Q0AMEoAAIEOADDXBQAA_g0AMNgFAAD_DQAw2QUAAIAOACDaBQAAvQsAMNsFAAC9CwAw3AUAAL0LADDdBQAAvQsAMN4FAACCDgAw3wUAAMALADALSQAA8g0AMEoAAPYNADDXBQAA8w0AMNgFAAD0DQAw2QUAAPUNACDaBQAAowwAMNsFAACjDAAw3AUAAKMMADDdBQAAowwAMN4FAAD3DQAw3wUAAKYMADALSQAA4w0AMEoAAOgNADDXBQAA5A0AMNgFAADlDQAw2QUAAOYNACDaBQAA5w0AMNsFAADnDQAw3AUAAOcNADDdBQAA5w0AMN4FAADpDQAw3wUAAOoNADALSQAA1w0AMEoAANwNADDXBQAA2A0AMNgFAADZDQAw2QUAANoNACDaBQAA2w0AMNsFAADbDQAw3AUAANsNADDdBQAA2w0AMN4FAADdDQAw3wUAAN4NADALSQAAyw0AMEoAANANADDXBQAAzA0AMNgFAADNDQAw2QUAAM4NACDaBQAAzw0AMNsFAADPDQAw3AUAAM8NADDdBQAAzw0AMN4FAADRDQAw3wUAANINADALSQAAwg0AMEoAAMYNADDXBQAAww0AMNgFAADEDQAw2QUAAMUNACDaBQAA_QkAMNsFAAD9CQAw3AUAAP0JADDdBQAA_QkAMN4FAADHDQAw3wUAAIAKADALSQAAuQ0AMEoAAL0NADDXBQAAug0AMNgFAAC7DQAw2QUAALwNACDaBQAA6QkAMNsFAADpCQAw3AUAAOkJADDdBQAA6QkAMN4FAAC-DQAw3wUAAOwJADALSQAArQ0AMEoAALINADDXBQAArg0AMNgFAACvDQAw2QUAALANACDaBQAAsQ0AMNsFAACxDQAw3AUAALENADDdBQAAsQ0AMN4FAACzDQAw3wUAALQNADALSQAApA0AMEoAAKgNADDXBQAApQ0AMNgFAACmDQAw2QUAAKcNACDaBQAAqgkAMNsFAACqCQAw3AUAAKoJADDdBQAAqgkAMN4FAACpDQAw3wUAAK0JADALSQAAmw0AMEoAAJ8NADDXBQAAnA0AMNgFAACdDQAw2QUAAJ4NACDaBQAAwgkAMNsFAADCCQAw3AUAAMIJADDdBQAAwgkAMN4FAACgDQAw3wUAAMUJADALSQAAkg0AMEoAAJYNADDXBQAAkw0AMNgFAACUDQAw2QUAAJUNACDaBQAA0gkAMNsFAADSCQAw3AUAANIJADDdBQAA0gkAMN4FAACXDQAw3wUAANUJADALSQAAiQ0AMEoAAI0NADDXBQAAig0AMNgFAACLDQAw2QUAAIwNACDaBQAAlwkAMNsFAACXCQAw3AUAAJcJADDdBQAAlwkAMN4FAACODQAw3wUAAJoJADAWCQAApQkAIA4AAKMJACASAACUCgAguAQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAeIEAQAAAAH2BAEAAAAB9wQIAAAAAfgECAAAAAH5BAgAAAAB-gQIAAAAAfsECAAAAAH8BAgAAAAB_QQIAAAAAf4ECAAAAAH_BAgAAAABgAUIAAAAAYEFCAAAAAGCBQgAAAABgwUIAAAAAQIAAACLAQAgSQAAkQ0AIAMAAACLAQAgSQAAkQ0AIEoAAJANACABQgAAuxIAMAIAAACLAQAgQgAAkA0AIAIAAACbCQAgQgAAjw0AIBO4BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIeIEAQCICQAh9gQBAIgJACH3BAgAnQkAIfgECACdCQAh-QQIAJ0JACH6BAgAnQkAIfsECACdCQAh_AQIAJ0JACH9BAgAnQkAIf4ECACdCQAh_wQIAJ0JACGABQgAnQkAIYEFCACdCQAhggUIAJ0JACGDBQgAnQkAIRYJAAChCQAgDgAAnwkAIBIAAJMKACC4BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIeIEAQCICQAh9gQBAIgJACH3BAgAnQkAIfgECACdCQAh-QQIAJ0JACH6BAgAnQkAIfsECACdCQAh_AQIAJ0JACH9BAgAnQkAIf4ECACdCQAh_wQIAJ0JACGABQgAnQkAIYEFCACdCQAhggUIAJ0JACGDBQgAnQkAIRYJAAClCQAgDgAAowkAIBIAAJQKACC4BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4gQBAAAAAfYEAQAAAAH3BAgAAAAB-AQIAAAAAfkECAAAAAH6BAgAAAAB-wQIAAAAAfwECAAAAAH9BAgAAAAB_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_gcAIB8AAKYIACAkAACNCAAgtQQAANkIADC2BAAAZQAQtwQAANkIADC4BAEAAAABvAQBAN4HACG9BAEA3QcAIb4EAQDeBwAhvwQBAN0HACHABEAA4QcAIcEEQADhBwAhhAUBAAAAAQIAAAB7ACBCAADVDQAgAgAAANMNACBCAADUDQAgC7UEAADSDQAwtgQAANMNABC3BAAA0g0AMLgEAQDdBwAhvAQBAN4HACG9BAEA3QcAIb4EAQDeBwAhvwQBAN0HACHABEAA4QcAIcEEQADhBwAhhAUBAN0HACELtQQAANINADC2BAAA0w0AELcEAADSDQAwuAQBAN0HACG8BAEA3gcAIb0EAQDdBwAhvgQBAN4HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACGEBQEA3QcAIQe4BAEAiAkAIbwEAQCJCQAhvgQBAIkJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACGEBQEAiAkAIQwDAADuCgAgCQAA7QoAIBUAAO8KACAfAADwCgAgJAAA8QoAILgEAQCICQAhvAQBAIkJACG-BAEAiQkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIYQFAQCICQAhDAMAAJsLACAJAACaCwAgFQAAnAsAIB8AAJ0LACAkAACeCwAguAQBAAAAAbwEAQAAAAG-BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABhAUBAAAAARADAADECgAgCQAAwwoAIBUAAL4KACAXAAC_CgAgGAAAwAoAIDUAAMEKACA2AADCCgAguAQBAAAAAbkEAQAAAAG6BAEAAAABuwQBAAAAAbwEAQAAAAG-BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABAgAAABAAIEkAAOINACADAAAAEAAgSQAA4g0AIEoAAOENACABQgAAsxIAMBUDAADiBwAgBwAAzggAIAkAAPkIACAVAAD-BwAgFwAAowgAIBgAAKUIACA1AACQCAAgNgAApwgAILUEAAD_CAAwtgQAAA4AELcEAAD_CAAwuAQBAAAAAbkEAQAAAAG6BAEAAAABuwQBAN0HACG8BAEA3gcAIb0EAQDdBwAhvgQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACECAAAAEAAgQgAA4Q0AIAIAAADfDQAgQgAA4A0AIA21BAAA3g0AMLYEAADfDQAQtwQAAN4NADC4BAEA3QcAIbkEAQDdBwAhugQBAN0HACG7BAEA3QcAIbwEAQDeBwAhvQQBAN0HACG-BAEA3QcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIQ21BAAA3g0AMLYEAADfDQAQtwQAAN4NADC4BAEA3QcAIbkEAQDdBwAhugQBAN0HACG7BAEA3QcAIbwEAQDeBwAhvQQBAN0HACG-BAEA3QcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIQm4BAEAiAkAIbkEAQCICQAhugQBAIgJACG7BAEAiAkAIbwEAQCJCQAhvgQBAIgJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACEQAwAAkgkAIAkAAJEJACAVAACMCQAgFwAAjQkAIBgAAI4JACA1AACPCQAgNgAAkAkAILgEAQCICQAhuQQBAIgJACG6BAEAiAkAIbsEAQCICQAhvAQBAIkJACG-BAEAiAkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIRADAADECgAgCQAAwwoAIBUAAL4KACAXAAC_CgAgGAAAwAoAIDUAAMEKACA2AADCCgAguAQBAAAAAbkEAQAAAAG6BAEAAAABuwQBAAAAAbwEAQAAAAG-BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABBgMAAPENACC4BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABywUAAADQBQICAAAAAQAgSQAA8A0AIAMAAAABACBJAADwDQAgSgAA7g0AIAFCAACyEgAwCwMAAOIHACAHAADOCAAgtQQAAIAJADC2BAAACwAQtwQAAIAJADC4BAEAAAABvQQBAN0HACG_BAEAAAABwARAAOEHACHBBEAA4QcAIcsFAACBCdAFIgIAAAABACBCAADuDQAgAgAAAOsNACBCAADsDQAgCbUEAADqDQAwtgQAAOsNABC3BAAA6g0AMLgEAQDdBwAhvQQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACHLBQAAgQnQBSIJtQQAAOoNADC2BAAA6w0AELcEAADqDQAwuAQBAN0HACG9BAEA3QcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIcsFAACBCdAFIgW4BAEAiAkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIcsFAADtDdAFIgHaBQAAANAFAgYDAADvDQAguAQBAIgJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACHLBQAA7Q3QBSIFSQAArRIAIEoAALASACDXBQAArhIAINgFAACvEgAg3QUAAIwCACAGAwAA8Q0AILgEAQAAAAG_BAEAAAABwARAAAAAAcEEQAAAAAHLBQAAANAFAgNJAACtEgAg1wUAAK4SACDdBQAAjAIAIA0JAADCDAAgCgAA_A0AIBUAAMMMACAXAADEDAAguAQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAY4FAQAAAAGaBQIAAAABoAUBAAAAAa0FAQAAAAGuBQEAAAABAgAAACMAIEkAAPsNACADAAAAIwAgSQAA-w0AIEoAAPkNACABQgAArBIAMAIAAAAjACBCAAD5DQAgAgAAAKcMACBCAAD4DQAgCbgEAQCICQAhvgQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGaBQIAwwsAIaAFAQCJCQAhrQUBAIgJACGuBQEAiAkAIQ0JAACrDAAgCgAA-g0AIBUAAKwMACAXAACtDAAguAQBAIgJACG-BAEAiAkAIcAEQACKCQAhwQRAAIoJACGOBQEAiQkAIZoFAgDDCwAhoAUBAIkJACGtBQEAiAkAIa4FAQCICQAhB0kAAKcSACBKAACqEgAg1wUAAKgSACDYBQAAqRIAINsFAAAdACDcBQAAHQAg3QUAAB8AIA0JAADCDAAgCgAA_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_gcAILUEAAD6CAAwtgQAAB0AELcEAAD6CAAwuAQBAAAAAb0EAQDdBwAhvgQBAN0HACHABEAA4QcAIcEEQADhBwAh6QQBAN0HACGOBQEA3gcAIZgFAQDeBwAhmQVAAMgIACGaBQgA0AgAIZsFCADQCAAhAgAAAB8AIEIAAMIOACACAAAAwA4AIEIAAMEOACAOtQQAAL8OADC2BAAAwA4AELcEAAC_DgAwuAQBAN0HACG9BAEA3QcAIb4EAQDdBwAhwARAAOEHACHBBEAA4QcAIekEAQDdBwAhjgUBAN4HACGYBQEA3gcAIZkFQADICAAhmgUIANAIACGbBQgA0AgAIQ61BAAAvw4AMLYEAADADgAQtwQAAL8OADC4BAEA3QcAIb0EAQDdBwAhvgQBAN0HACHABEAA4QcAIcEEQADhBwAh6QQBAN0HACGOBQEA3gcAIZgFAQDeBwAhmQVAAMgIACGaBQgA0AgAIZsFCADQCAAhCrgEAQCICQAhvgQBAIgJACHABEAAigkAIcEEQACKCQAh6QQBAIgJACGOBQEAiQkAIZgFAQCJCQAhmQVAALEJACGaBQgAnQkAIZsFCACdCQAhDQkAAJUMACAUAACSDAAgFQAAkwwAILgEAQCICQAhvgQBAIgJACHABEAAigkAIcEEQACKCQAh6QQBAIgJACGOBQEAiQkAIZgFAQCJCQAhmQVAALEJACGaBQgAnQkAIZsFCACdCQAhDQkAAMgMACAUAADFDAAgFQAAxgwAILgEAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAHpBAEAAAABjgUBAAAAAZgFAQAAAAGZBUAAAAABmgUIAAAAAZsFCAAAAAEHLwAA4w8AILgEAQAAAAHABEAAAAABwQRAAAAAAY4FAQAAAAGkBQEAAAABqwUBAAAAAQIAAAAUACBJAADiDwAgAwAAABQAIEkAAOIPACBKAADODgAgAUIAAJsSADAMBwAAyggAIC8AAP4IACC1BAAA_QgAMLYEAAASABC3BAAA_QgAMLgEAQAAAAG9BAEA3gcAIcAEQADhBwAhwQRAAOEHACGOBQEA3gcAIaQFAQDeBwAhqwUBAN0HACECAAAAFAAgQgAAzg4AIAIAAADMDgAgQgAAzQ4AIAq1BAAAyw4AMLYEAADMDgAQtwQAAMsOADC4BAEA3QcAIb0EAQDeBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhpAUBAN4HACGrBQEA3QcAIQq1BAAAyw4AMLYEAADMDgAQtwQAAMsOADC4BAEA3QcAIb0EAQDeBwAhwARAAOEHACHBBEAA4QcAIY4FAQDeBwAhpAUBAN4HACGrBQEA3QcAIQa4BAEAiAkAIcAEQACKCQAhwQRAAIoJACGOBQEAiQkAIaQFAQCJCQAhqwUBAIgJACEHLwAAzw4AILgEAQCICQAhwARAAIoJACHBBEAAigkAIY4FAQCJCQAhpAUBAIkJACGrBQEAiAkAIQtJAADQDgAwSgAA1Q4AMNcFAADRDgAw2AUAANIOADDZBQAA0w4AINoFAADUDgAw2wUAANQOADDcBQAA1A4AMN0FAADUDgAw3gUAANYOADDfBQAA1w4AMBIVAADcDwAgFwAA3Q8AIBkAANkPACAlAADWDwAgJgAA1w8AICcAANgPACAoAADaDwAgKQAA2w8AICsAAN4PACAsAADfDwAgLQAA4A8AIC4AAOEPACC4BAEAAAABwARAAAAAAcEEQAAAAAGOBQEAAAABpAUBAAAAAasFAQAAAAECAAAAGgAgSQAA1Q8AIAMAAAAaACBJAADVDwAgSgAA2g4AIAFCAACaEgAwFwgAAPwIACAVAAD-BwAgFwAAowgAIBkAAP0HACAlAACcCAAgJgAAnQgAICcAAJ8IACAoAAChCAAgKQAAoggAICsAAJAIACAsAAClCAAgLQAApggAIC4AAKcIACC1BAAA-wgAMLYEAAAYABC3BAAA-wgAMLgEAQAAAAHABEAA4QcAIcEEQADhBwAhjgUBAN4HACGfBQEA3gcAIaQFAQDeBwAhqwUBAN0HACECAAAAGgAgQgAA2g4AIAIAAADYDgAgQgAA2Q4AIAq1BAAA1w4AMLYEAADYDgAQtwQAANcOADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACGOBQEA3gcAIZ8FAQDeBwAhpAUBAN4HACGrBQEA3QcAIQq1BAAA1w4AMLYEAADYDgAQtwQAANcOADC4BAEA3QcAIcAEQADhBwAhwQRAAOEHACGOBQEA3gcAIZ8FAQDeBwAhpAUBAN4HACGrBQEA3QcAIQa4BAEAiAkAIcAEQACKCQAhwQRAAIoJACGOBQEAiQkAIaQFAQCJCQAhqwUBAIgJACESFQAA4Q4AIBcAAOIOACAZAADeDgAgJQAA2w4AICYAANwOACAnAADdDgAgKAAA3w4AICkAAOAOACArAADjDgAgLAAA5A4AIC0AAOUOACAuAADmDgAguAQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGkBQEAiQkAIasFAQCICQAhC0kAAMwPADBKAADQDwAw1wUAAM0PADDYBQAAzg8AMNkFAADPDwAg2gUAALwOADDbBQAAvA4AMNwFAAC8DgAw3QUAALwOADDeBQAA0Q8AMN8FAAC_DgAwC0kAAMEPADBKAADFDwAw1wUAAMIPADDYBQAAww8AMNkFAADEDwAg2gUAAKMOADDbBQAAow4AMNwFAACjDgAw3QUAAKMOADDeBQAAxg8AMN8FAACmDgAwC0kAALgPADBKAAC8DwAw1wUAALkPADDYBQAAug8AMNkFAAC7DwAg2gUAAKMMADDbBQAAowwAMNwFAACjDAAw3QUAAKMMADDeBQAAvQ8AMN8FAACmDAAwC0kAAK8PADBKAACzDwAw1wUAALAPADDYBQAAsQ8AMNkFAACyDwAg2gUAAL0LADDbBQAAvQsAMNwFAAC9CwAw3QUAAL0LADDeBQAAtA8AMN8FAADACwAwC0kAAKYPADBKAACqDwAw1wUAAKcPADDYBQAAqA8AMNkFAACpDwAg2gUAANsNADDbBQAA2w0AMNwFAADbDQAw3QUAANsNADDeBQAAqw8AMN8FAADeDQAwC0kAAJ0PADBKAAChDwAw1wUAAJ4PADDYBQAAnw8AMNkFAACgDwAg2gUAAM8NADDbBQAAzw0AMNwFAADPDQAw3QUAAM8NADDeBQAAog8AMN8FAADSDQAwC0kAAJQPADBKAACYDwAw1wUAAJUPADDYBQAAlg8AMNkFAACXDwAg2gUAAP0JADDbBQAA_QkAMNwFAAD9CQAw3QUAAP0JADDeBQAAmQ8AMN8FAACACgAwC0kAAIsPADBKAACPDwAw1wUAAIwPADDYBQAAjQ8AMNkFAACODwAg2gUAAOkJADDbBQAA6QkAMNwFAADpCQAw3QUAAOkJADDeBQAAkA8AMN8FAADsCQAwC0kAAIIPADBKAACGDwAw1wUAAIMPADDYBQAAhA8AMNkFAACFDwAg2gUAAKoJADDbBQAAqgkAMNwFAACqCQAw3QUAAKoJADDeBQAAhw8AMN8FAACtCQAwC0kAAPkOADBKAAD9DgAw1wUAAPoOADDYBQAA-w4AMNkFAAD8DgAg2gUAAMIJADDbBQAAwgkAMNwFAADCCQAw3QUAAMIJADDeBQAA_g4AMN8FAADFCQAwC0kAAPAOADBKAAD0DgAw1wUAAPEOADDYBQAA8g4AMNkFAADzDgAg2gUAANIJADDbBQAA0gkAMNwFAADSCQAw3QUAANIJADDeBQAA9Q4AMN8FAADVCQAwC0kAAOcOADBKAADrDgAw1wUAAOgOADDYBQAA6Q4AMNkFAADqDgAg2gUAAJcJADDbBQAAlwkAMNwFAACXCQAw3QUAAJcJADDeBQAA7A4AMN8FAACaCQAwFgcAAKQJACAOAACjCQAgEgAAlAoAILgEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAHiBAEAAAAB9gQBAAAAAfcECAAAAAH4BAgAAAAB-QQIAAAAAfoECAAAAAH7BAgAAAAB_AQIAAAAAf0ECAAAAAH-BAgAAAAB_wQIAAAAAYAFCAAAAAGBBQgAAAABggUIAAAAAYMFCAAAAAECAAAAiwEAIEkAAO8OACADAAAAiwEAIEkAAO8OACBKAADuDgAgAUIAAJkSADACAAAAiwEAIEIAAO4OACACAAAAmwkAIEIAAO0OACATuAQBAIgJACG9BAEAiAkAIcAEQACKCQAhwQRAAIoJACHiBAEAiAkAIfYEAQCICQAh9wQIAJ0JACH4BAgAnQkAIfkECACdCQAh-gQIAJ0JACH7BAgAnQkAIfwECACdCQAh_QQIAJ0JACH-BAgAnQkAIf8ECACdCQAhgAUIAJ0JACGBBQgAnQkAIYIFCACdCQAhgwUIAJ0JACEWBwAAoAkAIA4AAJ8JACASAACTCgAguAQBAIgJACG9BAEAiAkAIcAEQACKCQAhwQRAAIoJACHiBAEAiAkAIfYEAQCICQAh9wQIAJ0JACH4BAgAnQkAIfkECACdCQAh-gQIAJ0JACH7BAgAnQkAIfwECACdCQAh_QQIAJ0JACH-BAgAnQkAIf8ECACdCQAhgAUIAJ0JACGBBQgAnQkAIYIFCACdCQAhgwUIAJ0JACEWBwAApAkAIA4AAKMJACASAACUCgAguAQBAAAAAb0EAQAAAAHABEAAAAABwQRAAAAAAeIEAQAAAAH2BAEAAAAB9wQIAAAAAfgECAAAAAH5BAgAAAAB-gQIAAAAAfsECAAAAAH8BAgAAAAB_QQIAAAAAf4ECAAAAAH_BAgAAAABgAUIAAAAAYEFCAAAAAGCBQgAAAABgwUIAAAAAQ0HAADeCQAgHQAA2QoAIB4AAN0JACC4BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAAB4wQBAAAAAeQEAQAAAAHlBAEAAAAB5gQBAAAAAecEAQAAAAHoBEAAAAABAgAAAD0AIEkAAPgOACADAAAAPQAgSQAA-A4AIEoAAPcOACABQgAAmBIAMAIAAAA9ACBCAAD3DgAgAgAAANYJACBCAAD2DgAgCrgEAQCICQAhvQQBAIgJACHABEAAigkAIcEEQACKCQAh4wQBAIgJACHkBAEAiAkAIeUEAQCJCQAh5gQBAIkJACHnBAEAiQkAIegEQACKCQAhDQcAANoJACAdAADYCgAgHgAA2QkAILgEAQCICQAhvQQBAIgJACHABEAAigkAIcEEQACKCQAh4wQBAIgJACHkBAEAiAkAIeUEAQCJCQAh5gQBAIkJACHnBAEAiQkAIegEQACKCQAhDQcAAN4JACAdAADZCgAgHgAA3QkAILgEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAHjBAEAAAAB5AQBAAAAAeUEAQAAAAHmBAEAAAAB5wQBAAAAAegEQAAAAAEOBwAA4gkAIBIAAN4KACAWAADhCQAgHAAA5AkAILgEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAHgBAEAAAAB4gQBAAAAAekEAQAAAAHqBAEAAAAB7AQAAADsBALtBEAAAAABAgAAAEcAIEkAAIEPACADAAAARwAgSQAAgQ8AIEoAAIAPACABQgAAlxIAMAIAAABHACBCAACADwAgAgAAAMYJACBCAAD_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_BAEAAAABwARAAAAAAcEEQAAAAAGEBQEAAAABAgAAAHsAIEkAAKUPACADAAAAewAgSQAApQ8AIEoAAKQPACABQgAAkxIAMAIAAAB7ACBCAACkDwAgAgAAANMNACBCAACjDwAgB7gEAQCICQAhvAQBAIkJACG9BAEAiAkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIYQFAQCICQAhDAMAAO4KACAHAADsCgAgFQAA7woAIB8AAPAKACAkAADxCgAguAQBAIgJACG8BAEAiQkAIb0EAQCICQAhvwQBAIgJACHABEAAigkAIcEEQACKCQAhhAUBAIgJACEMAwAAmwsAIAcAAJkLACAVAACcCwAgHwAAnQsAICQAAJ4LACC4BAEAAAABvAQBAAAAAb0EAQAAAAG_BAEAAAABwARAAAAAAcEEQAAAAAGEBQEAAAABEAMAAMQKACAHAAC9CgAgFQAAvgoAIBcAAL8KACAYAADACgAgNQAAwQoAIDYAAMIKACC4BAEAAAABuQQBAAAAAboEAQAAAAG7BAEAAAABvAQBAAAAAb0EAQAAAAG_BAEAAAABwARAAAAAAcEEQAAAAAECAAAAEAAgSQAArg8AIAMAAAAQACBJAACuDwAgSgAArQ8AIAFCAACSEgAwAgAAABAAIEIAAK0PACACAAAA3w0AIEIAAKwPACAJuAQBAIgJACG5BAEAiAkAIboEAQCICQAhuwQBAIgJACG8BAEAiQkAIb0EAQCICQAhvwQBAIgJACHABEAAigkAIcEEQACKCQAhEAMAAJIJACAHAACLCQAgFQAAjAkAIBcAAI0JACAYAACOCQAgNQAAjwkAIDYAAJAJACC4BAEAiAkAIbkEAQCICQAhugQBAIgJACG7BAEAiAkAIbwEAQCJCQAhvQQBAIgJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACEQAwAAxAoAIAcAAL0KACAVAAC-CgAgFwAAvwoAIBgAAMAKACA1AADBCgAgNgAAwgoAILgEAQAAAAG5BAEAAAABugQBAAAAAbsEAQAAAAG8BAEAAAABvQQBAAAAAb8EAQAAAAHABEAAAAABwQRAAAAAAQ8HAADqCwAgFQAA5wsAIBcAAOgLACAYAADpCwAgGgAA9wsAIBsAAOwLACC4BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAABiAUBAAAAAY4FAQAAAAGPBQIAAAABkAUBAAAAAZEFAQAAAAECAAAATAAgSQAAtw8AIAMAAABMACBJAAC3DwAgSgAAtg8AIAFCAACREgAwAgAAAEwAIEIAALYPACACAAAAwQsAIEIAALUPACAJuAQBAIgJACG9BAEAiAkAIcAEQACKCQAhwQRAAIoJACGIBQEAiAkAIY4FAQCJCQAhjwUCAMMLACGQBQEAiAkAIZEFAQCJCQAhDwcAAMgLACAVAADFCwAgFwAAxgsAIBgAAMcLACAaAAD2CwAgGwAAygsAILgEAQCICQAhvQQBAIgJACHABEAAigkAIcEEQACKCQAhiAUBAIgJACGOBQEAiQkAIY8FAgDDCwAhkAUBAIgJACGRBQEAiQkAIQ8HAADqCwAgFQAA5wsAIBcAAOgLACAYAADpCwAgGgAA9wsAIBsAAOwLACC4BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAABiAUBAAAAAY4FAQAAAAGPBQIAAAABkAUBAAAAAZEFAQAAAAENBwAAwQwAIAoAAPwNACAVAADDDAAgFwAAxAwAILgEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAGOBQEAAAABmgUCAAAAAaAFAQAAAAGtBQEAAAABrgUBAAAAAQIAAAAjACBJAADADwAgAwAAACMAIEkAAMAPACBKAAC_DwAgAUIAAJASADACAAAAIwAgQgAAvw8AIAIAAACnDAAgQgAAvg8AIAm4BAEAiAkAIb0EAQCICQAhwARAAIoJACHBBEAAigkAIY4FAQCJCQAhmgUCAMMLACGgBQEAiQkAIa0FAQCICQAhrgUBAIgJACENBwAAqgwAIAoAAPoNACAVAACsDAAgFwAArQwAILgEAQCICQAhvQQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGaBQIAwwsAIaAFAQCJCQAhrQUBAIgJACGuBQEAiAkAIQ0HAADBDAAgCgAA_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_g0AMNkFAACADgAg3QUAAL0LADAESQAA8g0AMNcFAADzDQAw2QUAAPUNACDdBQAAowwAMARJAADjDQAw1wUAAOQNADDZBQAA5g0AIN0FAADnDQAwBEkAANcNADDXBQAA2A0AMNkFAADaDQAg3QUAANsNADAESQAAyw0AMNcFAADMDQAw2QUAAM4NACDdBQAAzw0AMARJAADCDQAw1wUAAMMNADDZBQAAxQ0AIN0FAAD9CQAwBEkAALkNADDXBQAAug0AMNkFAAC8DQAg3QUAAOkJADAESQAArQ0AMNcFAACuDQAw2QUAALANACDdBQAAsQ0AMARJAACkDQAw1wUAAKUNADDZBQAApw0AIN0FAACqCQAwBEkAAJsNADDXBQAAnA0AMNkFAACeDQAg3QUAAMIJADAESQAAkg0AMNcFAACTDQAw2QUAAJUNACDdBQAA0gkAMARJAACJDQAw1wUAAIoNADDZBQAAjA0AIN0FAACXCQAwAAAAAAAAAAAAAAAAAAAAAAdJAACEEgAgSgAAhxIAINcFAACFEgAg2AUAAIYSACDbBQAAFgAg3AUAABYAIN0FAAD5AwAgA0kAAIQSACDXBQAAhRIAIN0FAAD5AwAgAAAAB0kAAP8RACBKAACCEgAg1wUAAIASACDYBQAAgRIAINsFAAASACDcBQAAEgAg3QUAABQAIANJAAD_EQAg1wUAAIASACDdBQAAFAAgAAAAAAAAAAAAAAAAAAVJAAD6EQAgSgAA_REAINcFAAD7EQAg2AUAAPwRACDdBQAA-QMAIANJAAD6EQAg1wUAAPsRACDdBQAA-QMAIAAAAAAAAAAAAAVJAAD1EQAgSgAA-BEAINcFAAD2EQAg2AUAAPcRACDdBQAAjAIAIANJAAD1EQAg1wUAAPYRACDdBQAAjAIAIAAAAAVJAADwEQAgSgAA8xEAINcFAADxEQAg2AUAAPIRACDdBQAAjAIAIANJAADwEQAg1wUAAPERACDdBQAAjAIAIAAAAAtJAACjEQAwSgAAqBEAMNcFAACkEQAw2AUAAKURADDZBQAAphEAINoFAACnEQAw2wUAAKcRADDcBQAApxEAMN0FAACnEQAw3gUAAKkRADDfBQAAqhEAMAtJAACXEQAwSgAAnBEAMNcFAACYEQAw2AUAAJkRADDZBQAAmhEAINoFAACbEQAw2wUAAJsRADDcBQAAmxEAMN0FAACbEQAw3gUAAJ0RADDfBQAAnhEAMAtJAACMEQAwSgAAkBEAMNcFAACNEQAw2AUAAI4RADDZBQAAjxEAINoFAADnDQAw2wUAAOcNADDcBQAA5w0AMN0FAADnDQAw3gUAAJERADDfBQAA6g0AMAtJAACDEQAwSgAAhxEAMNcFAACEEQAw2AUAAIURADDZBQAAhhEAINoFAADbDQAw2wUAANsNADDcBQAA2w0AMN0FAADbDQAw3gUAAIgRADDfBQAA3g0AMAtJAAD6EAAwSgAA_hAAMNcFAAD7EAAw2AUAAPwQADDZBQAA_RAAINoFAADPDQAw2wUAAM8NADDcBQAAzw0AMN0FAADPDQAw3gUAAP8QADDfBQAA0g0AMAtJAADxEAAwSgAA9RAAMNcFAADyEAAw2AUAAPMQADDZBQAA9BAAINoFAACxDQAw2wUAALENADDcBQAAsQ0AMN0FAACxDQAw3gUAAPYQADDfBQAAtA0AMAtJAADoEAAwSgAA7BAAMNcFAADpEAAw2AUAAOoQADDZBQAA6xAAINoFAACxDQAw2wUAALENADDcBQAAsQ0AMN0FAACxDQAw3gUAAO0QADDfBQAAtA0AMAtJAADfEAAwSgAA4xAAMNcFAADgEAAw2AUAAOEQADDZBQAA4hAAINoFAACqCQAw2wUAAKoJADDcBQAAqgkAMN0FAACqCQAw3gUAAOQQADDfBQAArQkAMAtJAADWEAAwSgAA2hAAMNcFAADXEAAw2AUAANgQADDZBQAA2RAAINoFAACqCQAw2wUAAKoJADDcBQAAqgkAMN0FAACqCQAw3gUAANsQADDfBQAArQkAMAdJAADREAAgSgAA1BAAINcFAADSEAAg2AUAANMQACDbBQAA0AEAINwFAADQAQAg3QUAAJsHACALSQAAyBAAMEoAAMwQADDXBQAAyRAAMNgFAADKEAAw2QUAAMsQACDaBQAA9goAMNsFAAD2CgAw3AUAAPYKADDdBQAA9goAMN4FAADNEAAw3wUAAPkKADALSQAAvxAAMEoAAMMQADDXBQAAwBAAMNgFAADBEAAw2QUAAMIQACDaBQAA9goAMNsFAAD2CgAw3AUAAPYKADDdBQAA9goAMN4FAADEEAAw3wUAAPkKADAHSQAAuhAAIEoAAL0QACDXBQAAuxAAINgFAAC8EAAg2wUAANQBACDcBQAA1AEAIN0FAADVBQAgCLgEAQAAAAHABEAAAAABwQRAAAAAAc4EAQAAAAHPBAEAAAAB1ASAAAAAAdYEIAAAAAGHBQAAqQsAIAIAAADVBQAgSQAAuhAAIAMAAADUAQAgSQAAuhAAIEoAAL4QACAKAAAA1AEAIEIAAL4QACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHOBAEAiAkAIc8EAQCICQAh1ASAAAAAAdYEIADKCgAhhwUAAKcLACAIuAQBAIgJACHABEAAigkAIcEEQACKCQAhzgQBAIgJACHPBAEAiAkAIdQEgAAAAAHWBCAAygoAIYcFAACnCwAgDh4AAKMLACAhAACCCwAgIgAAgwsAILgEAQAAAAHABEAAAAABwQRAAAAAAeQEAQAAAAHuBAEAAAAB8AQAAACGBQLxBAEAAAAB8gRAAAAAAfMEQAAAAAH0BAEAAAABhgUBAAAAAQIAAABfACBJAADHEAAgAwAAAF8AIEkAAMcQACBKAADGEAAgAUIAAO8RADACAAAAXwAgQgAAxhAAIAIAAAD6CgAgQgAAxRAAIAu4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHkBAEAiQkAIe4EAQCJCQAh8AQAAPwKhgUi8QQBAIkJACHyBEAAsQkAIfMEQACKCQAh9AQBAIgJACGGBQEAiAkAIQ4eAACiCwAgIQAA_goAICIAAP8KACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHkBAEAiQkAIe4EAQCJCQAh8AQAAPwKhgUi8QQBAIkJACHyBEAAsQkAIfMEQACKCQAh9AQBAIgJACGGBQEAiAkAIQ4eAACjCwAgIQAAggsAICIAAIMLACC4BAEAAAABwARAAAAAAcEEQAAAAAHkBAEAAAAB7gQBAAAAAfAEAAAAhgUC8QQBAAAAAfIEQAAAAAHzBEAAAAAB9AQBAAAAAYYFAQAAAAEOHgAAowsAICEAAIILACAjAACECwAguAQBAAAAAcAEQAAAAAHBBEAAAAAB5AQBAAAAAe4EAQAAAAHwBAAAAIYFAvEEAQAAAAHyBEAAAAAB8wRAAAAAAfQEAQAAAAH1BAEAAAABAgAAAF8AIEkAANAQACADAAAAXwAgSQAA0BAAIEoAAM8QACABQgAA7hEAMAIAAABfACBCAADPEAAgAgAAAPoKACBCAADOEAAgC7gEAQCICQAhwARAAIoJACHBBEAAigkAIeQEAQCJCQAh7gQBAIkJACHwBAAA_AqGBSLxBAEAiQkAIfIEQACxCQAh8wRAAIoJACH0BAEAiAkAIfUEAQCJCQAhDh4AAKILACAhAAD-CgAgIwAAgAsAILgEAQCICQAhwARAAIoJACHBBEAAigkAIeQEAQCJCQAh7gQBAIkJACHwBAAA_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_CgAgGAAAwAoAIDUAAMEKACA2AADCCgAguAQBAAAAAbkEAQAAAAG6BAEAAAABuwQBAAAAAbwEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAABAgAAABAAIEkAAIsRACADAAAAEAAgSQAAixEAIEoAAIoRACABQgAA6BEAMAIAAAAQACBCAACKEQAgAgAAAN8NACBCAACJEQAgCbgEAQCICQAhuQQBAIgJACG6BAEAiAkAIbsEAQCICQAhvAQBAIkJACG9BAEAiAkAIb4EAQCICQAhwARAAIoJACHBBEAAigkAIRAHAACLCQAgCQAAkQkAIBUAAIwJACAXAACNCQAgGAAAjgkAIDUAAI8JACA2AACQCQAguAQBAIgJACG5BAEAiAkAIboEAQCICQAhuwQBAIgJACG8BAEAiQkAIb0EAQCICQAhvgQBAIgJACHABEAAigkAIcEEQACKCQAhEAcAAL0KACAJAADDCgAgFQAAvgoAIBcAAL8KACAYAADACgAgNQAAwQoAIDYAAMIKACC4BAEAAAABuQQBAAAAAboEAQAAAAG7BAEAAAABvAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAEGBwAAlhEAILgEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAHLBQAAANAFAgIAAAABACBJAACVEQAgAwAAAAEAIEkAAJURACBKAACTEQAgAUIAAOcRADACAAAAAQAgQgAAkxEAIAIAAADrDQAgQgAAkhEAIAW4BAEAiAkAIb0EAQCICQAhwARAAIoJACHBBEAAigkAIcsFAADtDdAFIgYHAACUEQAguAQBAIgJACG9BAEAiAkAIcAEQACKCQAhwQRAAIoJACHLBQAA7Q3QBSIFSQAA4hEAIEoAAOURACDXBQAA4xEAINgFAADkEQAg3QUAAPkDACAGBwAAlhEAILgEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAHLBQAAANAFAgNJAADiEQAg1wUAAOMRACDdBQAA-QMAIAy4BAEAAAABwARAAAAAAcEEQAAAAAG3BQEAAAABuAUBAAAAAbkFAQAAAAG6BQEAAAABuwUBAAAAAbwFQAAAAAG9BUAAAAABvgUBAAAAAb8FAQAAAAECAAAACQAgSQAAohEAIAMAAAAJACBJAACiEQAgSgAAoREAIAFCAADhEQAwEQMAAOIHACC1BAAAggkAMLYEAAAHABC3BAAAggkAMLgEAQAAAAG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACG3BQEA3QcAIbgFAQDdBwAhuQUBAN4HACG6BQEA3gcAIbsFAQDeBwAhvAVAAMgIACG9BUAAyAgAIb4FAQDeBwAhvwUBAN4HACECAAAACQAgQgAAoREAIAIAAACfEQAgQgAAoBEAIBC1BAAAnhEAMLYEAACfEQAQtwQAAJ4RADC4BAEA3QcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIbcFAQDdBwAhuAUBAN0HACG5BQEA3gcAIboFAQDeBwAhuwUBAN4HACG8BUAAyAgAIb0FQADICAAhvgUBAN4HACG_BQEA3gcAIRC1BAAAnhEAMLYEAACfEQAQtwQAAJ4RADC4BAEA3QcAIb8EAQDdBwAhwARAAOEHACHBBEAA4QcAIbcFAQDdBwAhuAUBAN0HACG5BQEA3gcAIboFAQDeBwAhuwUBAN4HACG8BUAAyAgAIb0FQADICAAhvgUBAN4HACG_BQEA3gcAIQy4BAEAiAkAIcAEQACKCQAhwQRAAIoJACG3BQEAiAkAIbgFAQCICQAhuQUBAIkJACG6BQEAiQkAIbsFAQCJCQAhvAVAALEJACG9BUAAsQkAIb4FAQCJCQAhvwUBAIkJACEMuAQBAIgJACHABEAAigkAIcEEQACKCQAhtwUBAIgJACG4BQEAiAkAIbkFAQCJCQAhugUBAIkJACG7BQEAiQkAIbwFQACxCQAhvQVAALEJACG-BQEAiQkAIb8FAQCJCQAhDLgEAQAAAAHABEAAAAABwQRAAAAAAbcFAQAAAAG4BQEAAAABuQUBAAAAAboFAQAAAAG7BQEAAAABvAVAAAAAAb0FQAAAAAG-BQEAAAABvwUBAAAAAQe4BAEAAAABwARAAAAAAcEEQAAAAAG2BUAAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABAgAAAAUAIEkAAK4RACADAAAABQAgSQAArhEAIEoAAK0RACABQgAA4BEAMAwDAADiBwAgtQQAAIMJADC2BAAAAwAQtwQAAIMJADC4BAEAAAABvwQBAN0HACHABEAA4QcAIcEEQADhBwAhtgVAAOEHACHABQEAAAABwQUBAN4HACHCBQEA3gcAIQIAAAAFACBCAACtEQAgAgAAAKsRACBCAACsEQAgC7UEAACqEQAwtgQAAKsRABC3BAAAqhEAMLgEAQDdBwAhvwQBAN0HACHABEAA4QcAIcEEQADhBwAhtgVAAOEHACHABQEA3QcAIcEFAQDeBwAhwgUBAN4HACELtQQAAKoRADC2BAAAqxEAELcEAACqEQAwuAQBAN0HACG_BAEA3QcAIcAEQADhBwAhwQRAAOEHACG2BUAA4QcAIcAFAQDdBwAhwQUBAN4HACHCBQEA3gcAIQe4BAEAiAkAIcAEQACKCQAhwQRAAIoJACG2BUAAigkAIcAFAQCICQAhwQUBAIkJACHCBQEAiQkAIQe4BAEAiAkAIcAEQACKCQAhwQRAAIoJACG2BUAAigkAIcAFAQCICQAhwQUBAIkJACHCBQEAiQkAIQe4BAEAAAABwARAAAAAAcEEQAAAAAG2BUAAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABBEkAAKMRADDXBQAApBEAMNkFAACmEQAg3QUAAKcRADAESQAAlxEAMNcFAACYEQAw2QUAAJoRACDdBQAAmxEAMARJAACMEQAw1wUAAI0RADDZBQAAjxEAIN0FAADnDQAwBEkAAIMRADDXBQAAhBEAMNkFAACGEQAg3QUAANsNADAESQAA-hAAMNcFAAD7EAAw2QUAAP0QACDdBQAAzw0AMARJAADxEAAw1wUAAPIQADDZBQAA9BAAIN0FAACxDQAwBEkAAOgQADDXBQAA6RAAMNkFAADrEAAg3QUAALENADAESQAA3xAAMNcFAADgEAAw2QUAAOIQACDdBQAAqgkAMARJAADWEAAw1wUAANcQADDZBQAA2RAAIN0FAACqCQAwA0kAANEQACDXBQAA0hAAIN0FAACbBwAgBEkAAMgQADDXBQAAyRAAMNkFAADLEAAg3QUAAPYKADAESQAAvxAAMNcFAADAEAAw2QUAAMIQACDdBQAA9goAMANJAAC6EAAg1wUAALsQACDdBQAA1QUAIAAAAioAAM8KACDRBAAAhAkAIAEiAADPCgAgAAAABUkAANsRACBKAADeEQAg1wUAANwRACDYBQAA3REAIN0FAAAoACADSQAA2xEAINcFAADcEQAg3QUAACgAIAAAABQGAAD5DwAgFQAA8AsAIBcAAPwPACAZAADvCwAgJQAA9Q8AICYAAPYPACAnAAD4DwAgKAAA-g8AICkAAPsPACArAADqDAAgLAAA_g8AIC0AAP8PACAuAACAEAAgMAAA9A8AIDEAAPcPACA0AAD9DwAg7AQAAIQJACCOBQAAhAkAIKQFAACECQAgpwUAAIQJACANBwAAyBEAIAkAAMsRACAKAADYEQAgCwAAiQwAIBEAANYRACASAADKEQAgEwAA1xEAIBQAANIRACAWAADREQAgGgAAzxEAIB4AAM4RACC-BAAAhAkAIKAFAACECQAgCQMAAM8KACAHAADIEQAgCQAAyxEAIBUAAPALACAXAAD8DwAgGAAA_g8AIDUAAOoMACA2AACAEAAgvAQAAIQJACAQCAAA2REAIBUAAPALACAXAAD8DwAgGQAA7wsAICUAAPUPACAmAAD2DwAgJwAA-A8AICgAAPoPACApAAD7DwAgKwAA6gwAICwAAP4PACAtAAD_DwAgLgAAgBAAII4FAACECQAgnwUAAIQJACCkBQAAhAkAIAUgAADqDAAgvgQAAIQJACCcBQAAhAkAIJ8FAACECQAgoAUAAIQJACAFIAAA2QwAIL4EAACECQAgnAUAAIQJACCfBQAAhAkAIKAFAACECQAgCAMAAM8KACAHAADIEQAgCQAAyxEAIBUAAPALACAfAAD_DwAgJAAA2QwAILwEAACECQAgvgQAAIQJACACFQAA8AsAIBkAAO8LACAFBwAAyBEAIAkAAMsRACAZAADvCwAgvgQAAIQJACCOBQAAhAkAIAsHAADIEQAgCQAAyxEAIBUAAPALACAXAAD8DwAgGAAA_g8AIBoAAM8RACAbAADQEQAgvgQAAIQJACCOBQAAhAkAII8FAACECQAgkQUAAIQJACAIBwAAyBEAIAkAAMsRACAKAADYEQAgFQAA8AsAIBcAAPwPACCOBQAAhAkAIJoFAACECQAgoAUAAIQJACAIBwAAyBEAIAkAAMsRACASAADKEQAgFgAA0REAIBwAAP8PACC-BAAAhAkAIOoEAACECQAg7QQAAIQJACACCwAAiQwAII4FAACECQAgAwcAAMgRACAPAACJDAAgiAUAAIQJACAAEgcAAMgRACAJAADLEQAgDgAAyREAIBIAAMoRACC-BAAAhAkAIPcEAACECQAg-AQAAIQJACD5BAAAhAkAIPoEAACECQAg-wQAAIQJACD8BAAAhAkAIP0EAACECQAg_gQAAIQJACD_BAAAhAkAIIAFAACECQAggQUAAIQJACCCBQAAhAkAIIMFAACECQAgCQcAAMgRACAJAADLEQAgFAAA-A8AIBUAAPALACCOBQAAhAkAIJgFAACECQAgmQUAAIQJACCaBQAAhAkAIJsFAACECQAgBQcAAMgRACAvAADaEQAgvQQAAIQJACCOBQAAhAkAIKQFAACECQAgABYHAAC8CgAgCQAAuQoAIAoAALoKACALAACzCgAgEgAAmAsAIBMAALUKACAUAAC2CgAgFgAAuAoAIBoAALsKACAeAAC3CgAguAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAHgBAEAAAAB4QQBAAAAAeIEAQAAAAHkBAEAAAABkAUBAAAAAaAFAQAAAAGsBUAAAAABAgAAACgAIEkAANsRACADAAAAJgAgSQAA2xEAIEoAAN8RACAYAAAAJgAgBwAAjQoAIAkAAIoKACAKAACLCgAgCwAAhAoAIBIAAJYLACATAACGCgAgFAAAhwoAIBYAAIkKACAaAACMCgAgHgAAiAoAIEIAAN8RACC4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAh4AQBAIgJACHhBAEAiAkAIeIEAQCICQAh5AQBAIgJACGQBQEAiAkAIaAFAQCJCQAhrAVAAIoJACEWBwAAjQoAIAkAAIoKACAKAACLCgAgCwAAhAoAIBIAAJYLACATAACGCgAgFAAAhwoAIBYAAIkKACAaAACMCgAgHgAAiAoAILgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHgBAEAiAkAIeEEAQCICQAh4gQBAIgJACHkBAEAiAkAIZAFAQCICQAhoAUBAIkJACGsBUAAigkAIQe4BAEAAAABwARAAAAAAcEEQAAAAAG2BUAAAAABwAUBAAAAAcEFAQAAAAHCBQEAAAABDLgEAQAAAAHABEAAAAABwQRAAAAAAbcFAQAAAAG4BQEAAAABuQUBAAAAAboFAQAAAAG7BQEAAAABvAVAAAAAAb0FQAAAAAG-BQEAAAABvwUBAAAAARcVAADtDwAgFwAA7g8AIBkAAOgPACAlAADlDwAgJgAA5g8AICcAAOkPACAoAADrDwAgKQAA7A8AICsAAPAPACAsAADxDwAgLQAA8g8AIC4AAPMPACAwAADkDwAgMQAA5w8AIDQAAO8PACC4BAEAAAABwARAAAAAAcEEQAAAAAHsBAAAAKYFA4gFAQAAAAGOBQEAAAABpAUBAAAAAacFAQAAAAECAAAA-QMAIEkAAOIRACADAAAAFgAgSQAA4hEAIEoAAOYRACAZAAAAFgAgFQAAgg0AIBcAAIMNACAZAAD9DAAgJQAA-gwAICYAAPsMACAnAAD-DAAgKAAAgA0AICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAuAACIDQAgMAAA-QwAIDEAAPwMACA0AACEDQAgQgAA5hEAILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhFxUAAIINACAXAACDDQAgGQAA_QwAICUAAPoMACAmAAD7DAAgJwAA_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-QMAIEkAAPoRACADAAAAFgAgSQAA-hEAIEoAAP4RACAZAAAAFgAgBgAA_wwAIBUAAIINACAXAACDDQAgGQAA_QwAICUAAPoMACAmAAD7DAAgJwAA_gwAICgAAIANACApAACBDQAgKwAAhQ0AICwAAIYNACAtAACHDQAgLgAAiA0AIDAAAPkMACA0AACEDQAgQgAA_hEAILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhFwYAAP8MACAVAACCDQAgFwAAgw0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgNAAAhA0AILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhCAcAAIUQACC4BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAABjgUBAAAAAaQFAQAAAAGrBQEAAAABAgAAABQAIEkAAP8RACADAAAAEgAgSQAA_xEAIEoAAIMSACAKAAAAEgAgBwAAhBAAIEIAAIMSACC4BAEAiAkAIb0EAQCJCQAhwARAAIoJACHBBEAAigkAIY4FAQCJCQAhpAUBAIkJACGrBQEAiAkAIQgHAACEEAAguAQBAIgJACG9BAEAiQkAIcAEQACKCQAhwQRAAIoJACGOBQEAiQkAIaQFAQCJCQAhqwUBAIgJACEXBgAA6g8AIBUAAO0PACAXAADuDwAgGQAA6A8AICUAAOUPACAmAADmDwAgJwAA6Q8AICgAAOsPACApAADsDwAgKwAA8A8AICwAAPEPACAtAADyDwAgLgAA8w8AIDEAAOcPACA0AADvDwAguAQBAAAAAcAEQAAAAAHBBEAAAAAB7AQAAACmBQOIBQEAAAABjgUBAAAAAaQFAQAAAAGnBQEAAAABAgAAAPkDACBJAACEEgAgAwAAABYAIEkAAIQSACBKAACIEgAgGQAAABYAIAYAAP8MACAVAACCDQAgFwAAgw0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAxAAD8DAAgNAAAhA0AIEIAAIgSACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHsBAAA7gymBSOIBQEAiAkAIY4FAQCJCQAhpAUBAIkJACGnBQEAiQkAIRcGAAD_DAAgFQAAgg0AIBcAAIMNACAZAAD9DAAgJQAA-gwAICYAAPsMACAnAAD-DAAgKAAAgA0AICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAuAACIDQAgMQAA_AwAIDQAAIQNACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHsBAAA7gymBSOIBQEAiAkAIY4FAQCJCQAhpAUBAIkJACGnBQEAiQkAIQq4BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAAB6QQBAAAAAY4FAQAAAAGYBQEAAAABmQVAAAAAAZoFCAAAAAGbBQgAAAABFwYAAOoPACAVAADtDwAgFwAA7g8AIBkAAOgPACAlAADlDwAgJwAA6Q8AICgAAOsPACApAADsDwAgKwAA8A8AICwAAPEPACAtAADyDwAgLgAA8w8AIDAAAOQPACAxAADnDwAgNAAA7w8AILgEAQAAAAHABEAAAAABwQRAAAAAAewEAAAApgUDiAUBAAAAAY4FAQAAAAGkBQEAAAABpwUBAAAAAQIAAAD5AwAgSQAAihIAIAMAAAAWACBJAACKEgAgSgAAjhIAIBkAAAAWACAGAAD_DAAgFQAAgg0AIBcAAIMNACAZAAD9DAAgJQAA-gwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_AwAIDQAAIQNACBCAACOEgAguAQBAIgJACHABEAAigkAIcEEQACKCQAh7AQAAO4MpgUjiAUBAIgJACGOBQEAiQkAIaQFAQCJCQAhpwUBAIkJACEXBgAA_wwAIBUAAIINACAXAACDDQAgGQAA_QwAICUAAPoMACAnAAD-DAAgKAAAgA0AICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAuAACIDQAgMAAA-QwAIDEAAPwMACA0AACEDQAguAQBAIgJACHABEAAigkAIcEEQACKCQAh7AQAAO4MpgUjiAUBAIgJACGOBQEAiQkAIaQFAQCJCQAhpwUBAIkJACEGuAQBAAAAAb0EAQAAAAHABEAAAAABwQRAAAAAAYgFAQAAAAGOBQEAAAABCbgEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAGOBQEAAAABmgUCAAAAAaAFAQAAAAGtBQEAAAABrgUBAAAAAQm4BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAABiAUBAAAAAY4FAQAAAAGPBQIAAAABkAUBAAAAAZEFAQAAAAEJuAQBAAAAAbkEAQAAAAG6BAEAAAABuwQBAAAAAbwEAQAAAAG9BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABB7gEAQAAAAG8BAEAAAABvQQBAAAAAb8EAQAAAAHABEAAAAABwQRAAAAAAYQFAQAAAAELuAQBAAAAAb0EAQAAAAHABEAAAAABwQRAAAAAAeAEAQAAAAHhBAEAAAAB4gQBAAAAAeQEAQAAAAGQBQEAAAABoAUBAAAAAawFQAAAAAEHuAQBAAAAAb0EAQAAAAHABEAAAAABwQRAAAAAAeAEAQAAAAHhBAEAAAAB4gQBAAAAAQ24BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAABzQQBAAAAAeIEAQAAAAHuBAEAAAAB8AQAAADwBALxBAEAAAAB8gRAAAAAAfMEQAAAAAH0BAEAAAAB9QQBAAAAAQq4BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAAB4AQBAAAAAeIEAQAAAAHpBAEAAAAB6gQBAAAAAewEAAAA7AQC7QRAAAAAAQq4BAEAAAABvQQBAAAAAcAEQAAAAAHBBEAAAAAB4wQBAAAAAeQEAQAAAAHlBAEAAAAB5gQBAAAAAecEAQAAAAHoBEAAAAABE7gEAQAAAAG9BAEAAAABwARAAAAAAcEEQAAAAAHiBAEAAAAB9gQBAAAAAfcECAAAAAH4BAgAAAAB-QQIAAAAAfoECAAAAAH7BAgAAAAB_AQIAAAAAf0ECAAAAAH-BAgAAAAB_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_BAEAAAABwARAAAAAAcEEQAAAAAHLBQAAANAFAgm4BAEAAAABuQQBAAAAAboEAQAAAAG7BAEAAAABvAQBAAAAAb4EAQAAAAG_BAEAAAABwARAAAAAAcEEQAAAAAEHuAQBAAAAAbwEAQAAAAG-BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABhAUBAAAAAQu4BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4AQBAAAAAeEEAQAAAAHiBAEAAAAB5AQBAAAAAZAFAQAAAAGgBQEAAAABrAVAAAAAAQe4BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4AQBAAAAAeEEAQAAAAHiBAEAAAABDbgEAQAAAAHABEAAAAABwQRAAAAAAfAEAAAAqQUC8gRAAAAAAY4FAQAAAAGiBQEAAAABowUBAAAAAaQFAQAAAAGmBQAAAKYFA6cFAQAAAAGpBQEAAAABqgUBAAAAAQ24BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAABzQQBAAAAAeIEAQAAAAHuBAEAAAAB8AQAAADwBALxBAEAAAAB8gRAAAAAAfMEQAAAAAH0BAEAAAAB9QQBAAAAAQq4BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4AQBAAAAAeIEAQAAAAHpBAEAAAAB6gQBAAAAAewEAAAA7AQC7QRAAAAAAQq4BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4wQBAAAAAeQEAQAAAAHlBAEAAAAB5gQBAAAAAecEAQAAAAHoBEAAAAABE7gEAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAHiBAEAAAAB9gQBAAAAAfcECAAAAAH4BAgAAAAB-QQIAAAAAfoECAAAAAH7BAgAAAAB_AQIAAAAAf0ECAAAAAH-BAgAAAAB_wQIAAAAAYAFCAAAAAGBBQgAAAABggUIAAAAAYMFCAAAAAEXBgAA6g8AIBUAAO0PACAXAADuDwAgGQAA6A8AICUAAOUPACAmAADmDwAgJwAA6Q8AICgAAOsPACApAADsDwAgKwAA8A8AICwAAPEPACAtAADyDwAgLgAA8w8AIDAAAOQPACAxAADnDwAguAQBAAAAAcAEQAAAAAHBBEAAAAAB7AQAAACmBQOIBQEAAAABjgUBAAAAAaQFAQAAAAGnBQEAAAABAgAAAPkDACBJAAC8EgAgGwQAAK8RACAFAACwEQAgBgAAsREAIBIAALIRACAeAACzEQAgKwAAthEAIDQAALQRACA4AAC3EQAgOQAAuBEAIDoAALkRACA7AAC6EQAgPAAAuxEAILgEAQAAAAG8BAEAAAABwARAAAAAAcEEQAAAAAGIBQEAAAABwwUBAAAAAcQFIAAAAAHFBQEAAAABxgUBAAAAAccFAQAAAAHIBQEAAAAByQUBAAAAAcoFAQAAAAHLBQEAAAABzAUBAAAAAQIAAACMAgAgSQAAvhIAIBsEAACvEQAgBQAAsBEAIAYAALERACASAACyEQAgHgAAsxEAICsAALYRACA3AAC1EQAgOAAAtxEAIDkAALgRACA6AAC5EQAgOwAAuhEAIDwAALsRACC4BAEAAAABvAQBAAAAAcAEQAAAAAHBBEAAAAABiAUBAAAAAcMFAQAAAAHEBSAAAAABxQUBAAAAAcYFAQAAAAHHBQEAAAAByAUBAAAAAckFAQAAAAHKBQEAAAABywUBAAAAAcwFAQAAAAECAAAAjAIAIEkAAMASACADAAAAFgAgSQAAvBIAIEoAAMQSACAZAAAAFgAgBgAA_wwAIBUAAIINACAXAACDDQAgGQAA_QwAICUAAPoMACAmAAD7DAAgJwAA_gwAICgAAIANACApAACBDQAgKwAAhQ0AICwAAIYNACAtAACHDQAgLgAAiA0AIDAAAPkMACAxAAD8DAAgQgAAxBIAILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhFwYAAP8MACAVAACCDQAgFwAAgw0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_AwAILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhAwAAAGMAIEkAAL4SACBKAADHEgAgHQAAAGMAIAQAAK0QACAFAACuEAAgBgAArxAAIBIAALAQACAeAACxEAAgKwAAtBAAIDQAALIQACA4AAC1EAAgOQAAthAAIDoAALcQACA7AAC4EAAgPAAAuRAAIEIAAMcSACC4BAEAiAkAIbwEAQCJCQAhwARAAIoJACHBBEAAigkAIYgFAQCICQAhwwUBAIgJACHEBSAAygoAIcUFAQCJCQAhxgUBAIkJACHHBQEAiQkAIcgFAQCJCQAhyQUBAIkJACHKBQEAiQkAIcsFAQCICQAhzAUBAIgJACEbBAAArRAAIAUAAK4QACAGAACvEAAgEgAAsBAAIB4AALEQACArAAC0EAAgNAAAshAAIDgAALUQACA5AAC2EAAgOgAAtxAAIDsAALgQACA8AAC5EAAguAQBAIgJACG8BAEAiQkAIcAEQACKCQAhwQRAAIoJACGIBQEAiAkAIcMFAQCICQAhxAUgAMoKACHFBQEAiQkAIcYFAQCJCQAhxwUBAIkJACHIBQEAiQkAIckFAQCJCQAhygUBAIkJACHLBQEAiAkAIcwFAQCICQAhAwAAAGMAIEkAAMASACBKAADKEgAgHQAAAGMAIAQAAK0QACAFAACuEAAgBgAArxAAIBIAALAQACAeAACxEAAgKwAAtBAAIDcAALMQACA4AAC1EAAgOQAAthAAIDoAALcQACA7AAC4EAAgPAAAuRAAIEIAAMoSACC4BAEAiAkAIbwEAQCJCQAhwARAAIoJACHBBEAAigkAIYgFAQCICQAhwwUBAIgJACHEBSAAygoAIcUFAQCJCQAhxgUBAIkJACHHBQEAiQkAIcgFAQCJCQAhyQUBAIkJACHKBQEAiQkAIcsFAQCICQAhzAUBAIgJACEbBAAArRAAIAUAAK4QACAGAACvEAAgEgAAsBAAIB4AALEQACArAAC0EAAgNwAAsxAAIDgAALUQACA5AAC2EAAgOgAAtxAAIDsAALgQACA8AAC5EAAguAQBAIgJACG8BAEAiQkAIcAEQACKCQAhwQRAAIoJACGIBQEAiAkAIcMFAQCICQAhxAUgAMoKACHFBQEAiQkAIcYFAQCJCQAhxwUBAIkJACHIBQEAiQkAIckFAQCJCQAhygUBAIkJACHLBQEAiAkAIcwFAQCICQAhDbgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAABzQQBAAAAAeIEAQAAAAHuBAEAAAAB8AQAAADwBALxBAEAAAAB8gRAAAAAAfMEQAAAAAH1BAEAAAABC7gEAQAAAAHABEAAAAABwQRAAAAAAeQEAQAAAAHuBAEAAAAB8AQAAACGBQLxBAEAAAAB8gRAAAAAAfMEQAAAAAH1BAEAAAABhgUBAAAAARMIAACKEAAgFQAA3A8AIBcAAN0PACAZAADZDwAgJgAA1w8AICcAANgPACAoAADaDwAgKQAA2w8AICsAAN4PACAsAADfDwAgLQAA4A8AIC4AAOEPACC4BAEAAAABwARAAAAAAcEEQAAAAAGOBQEAAAABnwUBAAAAAaQFAQAAAAGrBQEAAAABAgAAABoAIEkAAM0SACAXBgAA6g8AIBUAAO0PACAXAADuDwAgGQAA6A8AICYAAOYPACAnAADpDwAgKAAA6w8AICkAAOwPACArAADwDwAgLAAA8Q8AIC0AAPIPACAuAADzDwAgMAAA5A8AIDEAAOcPACA0AADvDwAguAQBAAAAAcAEQAAAAAHBBEAAAAAB7AQAAACmBQOIBQEAAAABjgUBAAAAAaQFAQAAAAGnBQEAAAABAgAAAPkDACBJAADPEgAgEwgAAIoQACAVAADcDwAgFwAA3Q8AIBkAANkPACAlAADWDwAgJgAA1w8AICgAANoPACApAADbDwAgKwAA3g8AICwAAN8PACAtAADgDwAgLgAA4Q8AILgEAQAAAAHABEAAAAABwQRAAAAAAY4FAQAAAAGfBQEAAAABpAUBAAAAAasFAQAAAAECAAAAGgAgSQAA0RIAIBcGAADqDwAgFQAA7Q8AIBcAAO4PACAZAADoDwAgJQAA5Q8AICYAAOYPACAoAADrDwAgKQAA7A8AICsAAPAPACAsAADxDwAgLQAA8g8AIC4AAPMPACAwAADkDwAgMQAA5w8AIDQAAO8PACC4BAEAAAABwARAAAAAAcEEQAAAAAHsBAAAAKYFA4gFAQAAAAGOBQEAAAABpAUBAAAAAacFAQAAAAECAAAA-QMAIEkAANMSACALuAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAHgBAEAAAAB4gQBAAAAAeQEAQAAAAGQBQEAAAABoAUBAAAAAawFQAAAAAEHuAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAHgBAEAAAAB4gQBAAAAAQMAAAAYACBJAADREgAgSgAA2RIAIBUAAAAYACAIAACJEAAgFQAA4Q4AIBcAAOIOACAZAADeDgAgJQAA2w4AICYAANwOACAoAADfDgAgKQAA4A4AICsAAOMOACAsAADkDgAgLQAA5Q4AIC4AAOYOACBCAADZEgAguAQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGfBQEAiQkAIaQFAQCJCQAhqwUBAIgJACETCAAAiRAAIBUAAOEOACAXAADiDgAgGQAA3g4AICUAANsOACAmAADcDgAgKAAA3w4AICkAAOAOACArAADjDgAgLAAA5A4AIC0AAOUOACAuAADmDgAguAQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGfBQEAiQkAIaQFAQCJCQAhqwUBAIgJACEDAAAAFgAgSQAA0xIAIEoAANwSACAZAAAAFgAgBgAA_wwAIBUAAIINACAXAACDDQAgGQAA_QwAICUAAPoMACAmAAD7DAAgKAAAgA0AICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAuAACIDQAgMAAA-QwAIDEAAPwMACA0AACEDQAgQgAA3BIAILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhFwYAAP8MACAVAACCDQAgFwAAgw0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICgAAIANACApAACBDQAgKwAAhQ0AICwAAIYNACAtAACHDQAgLgAAiA0AIDAAAPkMACAxAAD8DAAgNAAAhA0AILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhCbgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAABjgUBAAAAAZoFAgAAAAGtBQEAAAABrgUBAAAAAQu4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAeAEAQAAAAHhBAEAAAAB4gQBAAAAAeQEAQAAAAGQBQEAAAABrAVAAAAAAQMAAAAYACBJAADNEgAgSgAA4RIAIBUAAAAYACAIAACJEAAgFQAA4Q4AIBcAAOIOACAZAADeDgAgJgAA3A4AICcAAN0OACAoAADfDgAgKQAA4A4AICsAAOMOACAsAADkDgAgLQAA5Q4AIC4AAOYOACBCAADhEgAguAQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGfBQEAiQkAIaQFAQCJCQAhqwUBAIgJACETCAAAiRAAIBUAAOEOACAXAADiDgAgGQAA3g4AICYAANwOACAnAADdDgAgKAAA3w4AICkAAOAOACArAADjDgAgLAAA5A4AIC0AAOUOACAuAADmDgAguAQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGfBQEAiQkAIaQFAQCJCQAhqwUBAIgJACEDAAAAFgAgSQAAzxIAIEoAAOQSACAZAAAAFgAgBgAA_wwAIBUAAIINACAXAACDDQAgGQAA_QwAICYAAPsMACAnAAD-DAAgKAAAgA0AICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAuAACIDQAgMAAA-QwAIDEAAPwMACA0AACEDQAgQgAA5BIAILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhFwYAAP8MACAVAACCDQAgFwAAgw0AIBkAAP0MACAmAAD7DAAgJwAA_gwAICgAAIANACApAACBDQAgKwAAhQ0AICwAAIYNACAtAACHDQAgLgAAiA0AIDAAAPkMACAxAAD8DAAgNAAAhA0AILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhFgcAALwKACAJAAC5CgAgCgAAugoAIBEAALQKACASAACYCwAgEwAAtQoAIBQAALYKACAWAAC4CgAgGgAAuwoAIB4AALcKACC4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAeAEAQAAAAHhBAEAAAAB4gQBAAAAAeQEAQAAAAGQBQEAAAABoAUBAAAAAawFQAAAAAECAAAAKAAgSQAA5RIAIAMAAAAmACBJAADlEgAgSgAA6RIAIBgAAAAmACAHAACNCgAgCQAAigoAIAoAAIsKACARAACFCgAgEgAAlgsAIBMAAIYKACAUAACHCgAgFgAAiQoAIBoAAIwKACAeAACICgAgQgAA6RIAILgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHgBAEAiAkAIeEEAQCICQAh4gQBAIgJACHkBAEAiAkAIZAFAQCICQAhoAUBAIkJACGsBUAAigkAIRYHAACNCgAgCQAAigoAIAoAAIsKACARAACFCgAgEgAAlgsAIBMAAIYKACAUAACHCgAgFgAAiQoAIBoAAIwKACAeAACICgAguAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIeAEAQCICQAh4QQBAIgJACHiBAEAiAkAIeQEAQCICQAhkAUBAIgJACGgBQEAiQkAIawFQACKCQAhCLgEAQAAAAHABEAAAAABwQRAAAAAAfYEAQAAAAGIBQEAAAABjgUBAAAAAZUFAQAAAAGXBQEAAAABBhUAAO4LACC4BAEAAAABvQQBAAAAAYgFAQAAAAGJBUAAAAABigVAAAAAAQIAAAC8BQAgSQAA6xIAIAMAAAC_BQAgSQAA6xIAIEoAAO8SACAIAAAAvwUAIBUAAK8LACBCAADvEgAguAQBAIgJACG9BAEAiAkAIYgFAQCICQAhiQVAAIoJACGKBUAAigkAIQYVAACvCwAguAQBAIgJACG9BAEAiAkAIYgFAQCICQAhiQVAAIoJACGKBUAAigkAIQkHAADLDwAgCQAAtg4AILgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAABiAUBAAAAAY4FAQAAAAECAAAAdQAgSQAA8BIAIBMIAACKEAAgFQAA3A8AIBcAAN0PACAlAADWDwAgJgAA1w8AICcAANgPACAoAADaDwAgKQAA2w8AICsAAN4PACAsAADfDwAgLQAA4A8AIC4AAOEPACC4BAEAAAABwARAAAAAAcEEQAAAAAGOBQEAAAABnwUBAAAAAaQFAQAAAAGrBQEAAAABAgAAABoAIEkAAPISACAXBgAA6g8AIBUAAO0PACAXAADuDwAgJQAA5Q8AICYAAOYPACAnAADpDwAgKAAA6w8AICkAAOwPACArAADwDwAgLAAA8Q8AIC0AAPIPACAuAADzDwAgMAAA5A8AIDEAAOcPACA0AADvDwAguAQBAAAAAcAEQAAAAAHBBEAAAAAB7AQAAACmBQOIBQEAAAABjgUBAAAAAaQFAQAAAAGnBQEAAAABAgAAAPkDACBJAAD0EgAgC7gEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4QQBAAAAAeIEAQAAAAHkBAEAAAABkAUBAAAAAaAFAQAAAAGsBUAAAAABB7gEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4QQBAAAAAeIEAQAAAAEKuAQBAAAAAb0EAQAAAAG-BAEAAAABwARAAAAAAcEEQAAAAAHiBAEAAAAB6QQBAAAAAeoEAQAAAAHsBAAAAOwEAu0EQAAAAAEDAAAAUQAgSQAA8BIAIEoAAPsSACALAAAAUQAgBwAAyQ8AIAkAAKoOACBCAAD7EgAguAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIYgFAQCICQAhjgUBAIkJACEJBwAAyQ8AIAkAAKoOACC4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAhiAUBAIgJACGOBQEAiQkAIQMAAAAYACBJAADyEgAgSgAA_hIAIBUAAAAYACAIAACJEAAgFQAA4Q4AIBcAAOIOACAlAADbDgAgJgAA3A4AICcAAN0OACAoAADfDgAgKQAA4A4AICsAAOMOACAsAADkDgAgLQAA5Q4AIC4AAOYOACBCAAD-EgAguAQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGfBQEAiQkAIaQFAQCJCQAhqwUBAIgJACETCAAAiRAAIBUAAOEOACAXAADiDgAgJQAA2w4AICYAANwOACAnAADdDgAgKAAA3w4AICkAAOAOACArAADjDgAgLAAA5A4AIC0AAOUOACAuAADmDgAguAQBAIgJACHABEAAigkAIcEEQACKCQAhjgUBAIkJACGfBQEAiQkAIaQFAQCJCQAhqwUBAIgJACEDAAAAFgAgSQAA9BIAIEoAAIETACAZAAAAFgAgBgAA_wwAIBUAAIINACAXAACDDQAgJQAA-gwAICYAAPsMACAnAAD-DAAgKAAAgA0AICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAuAACIDQAgMAAA-QwAIDEAAPwMACA0AACEDQAgQgAAgRMAILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhFwYAAP8MACAVAACCDQAgFwAAgw0AICUAAPoMACAmAAD7DAAgJwAA_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_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_DAAgFQAAgg0AIBcAAIMNACAZAAD9DAAgJQAA-gwAICYAAPsMACAnAAD-DAAgKAAAgA0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_AwAIDQAAIQNACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHsBAAA7gymBSOIBQEAiAkAIY4FAQCJCQAhpAUBAIkJACGnBQEAiQkAIREDAADECgAgBwAAvQoAIAkAAMMKACAVAAC-CgAgFwAAvwoAIBgAAMAKACA2AADCCgAguAQBAAAAAbkEAQAAAAG6BAEAAAABuwQBAAAAAbwEAQAAAAG9BAEAAAABvgQBAAAAAb8EAQAAAAHABEAAAAABwQRAAAAAAQIAAAAQACBJAAC0EwAgAwAAAA4AIEkAALQTACBKAAC4EwAgEwAAAA4AIAMAAJIJACAHAACLCQAgCQAAkQkAIBUAAIwJACAXAACNCQAgGAAAjgkAIDYAAJAJACBCAAC4EwAguAQBAIgJACG5BAEAiAkAIboEAQCICQAhuwQBAIgJACG8BAEAiQkAIb0EAQCICQAhvgQBAIgJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACERAwAAkgkAIAcAAIsJACAJAACRCQAgFQAAjAkAIBcAAI0JACAYAACOCQAgNgAAkAkAILgEAQCICQAhuQQBAIgJACG6BAEAiAkAIbsEAQCICQAhvAQBAIkJACG9BAEAiAkAIb4EAQCICQAhvwQBAIgJACHABEAAigkAIcEEQACKCQAhEQMAAMQKACAHAAC9CgAgCQAAwwoAIBUAAL4KACAXAAC_CgAgNQAAwQoAIDYAAMIKACC4BAEAAAABuQQBAAAAAboEAQAAAAG7BAEAAAABvAQBAAAAAb0EAQAAAAG-BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABAgAAABAAIEkAALkTACADAAAADgAgSQAAuRMAIEoAAL0TACATAAAADgAgAwAAkgkAIAcAAIsJACAJAACRCQAgFQAAjAkAIBcAAI0JACA1AACPCQAgNgAAkAkAIEIAAL0TACC4BAEAiAkAIbkEAQCICQAhugQBAIgJACG7BAEAiAkAIbwEAQCJCQAhvQQBAIgJACG-BAEAiAkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIREDAACSCQAgBwAAiwkAIAkAAJEJACAVAACMCQAgFwAAjQkAIDUAAI8JACA2AACQCQAguAQBAIgJACG5BAEAiAkAIboEAQCICQAhuwQBAIgJACG8BAEAiQkAIb0EAQCICQAhvgQBAIgJACG_BAEAiAkAIcAEQACKCQAhwQRAAIoJACEPBwAA4gkAIAkAAOMJACASAADeCgAgFgAA4QkAILgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB4AQBAAAAAeIEAQAAAAHpBAEAAAAB6gQBAAAAAewEAAAA7AQC7QRAAAAAAQIAAABHACBJAAC-EwAgAwAAAEUAIEkAAL4TACBKAADCEwAgEQAAAEUAIAcAAMsJACAJAADMCQAgEgAA3QoAIBYAAMoJACBCAADCEwAguAQBAIgJACG9BAEAiAkAIb4EAQCJCQAhwARAAIoJACHBBEAAigkAIeAEAQCICQAh4gQBAIgJACHpBAEAiAkAIeoEAQCJCQAh7AQAAMgJ7AQi7QRAALEJACEPBwAAywkAIAkAAMwJACASAADdCgAgFgAAygkAILgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHgBAEAiAkAIeIEAQCICQAh6QQBAIgJACHqBAEAiQkAIewEAADICewEIu0EQACxCQAhEQMAAMQKACAHAAC9CgAgCQAAwwoAIBUAAL4KACAYAADACgAgNQAAwQoAIDYAAMIKACC4BAEAAAABuQQBAAAAAboEAQAAAAG7BAEAAAABvAQBAAAAAb0EAQAAAAG-BAEAAAABvwQBAAAAAcAEQAAAAAHBBEAAAAABAgAAABAAIEkAAMMTACADAAAADgAgSQAAwxMAIEoAAMcTACATAAAADgAgAwAAkgkAIAcAAIsJACAJAACRCQAgFQAAjAkAIBgAAI4JACA1AACPCQAgNgAAkAkAIEIAAMcTACC4BAEAiAkAIbkEAQCICQAhugQBAIgJACG7BAEAiAkAIbwEAQCJCQAhvQQBAIgJACG-BAEAiAkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIREDAACSCQAgBwAAiwkAIAkAAJEJACAVAACMCQAgGAAAjgkAIDUAAI8JACA2AACQCQAguAQBAIgJACG5BAEAiAkAIboEAQCICQAhuwQBAIgJACG8BAEAiQkAIb0EAQCICQAhvgQBAIgJACG_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_BAEAAAABwARAAAAAAcEEQAAAAAECAAAAEAAgSQAA7RMAIAMAAAAOACBJAADtEwAgSgAA8RMAIBMAAAAOACADAACSCQAgBwAAiwkAIAkAAJEJACAVAACMCQAgFwAAjQkAIBgAAI4JACA1AACPCQAgQgAA8RMAILgEAQCICQAhuQQBAIgJACG6BAEAiAkAIbsEAQCICQAhvAQBAIkJACG9BAEAiAkAIb4EAQCICQAhvwQBAIgJACHABEAAigkAIcEEQACKCQAhEQMAAJIJACAHAACLCQAgCQAAkQkAIBUAAIwJACAXAACNCQAgGAAAjgkAIDUAAI8JACC4BAEAiAkAIbkEAQCICQAhugQBAIgJACG7BAEAiAkAIbwEAQCJCQAhvQQBAIgJACG-BAEAiAkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIQMAAAAWACBJAADTEwAgSgAA9BMAIBkAAAAWACAGAAD_DAAgFwAAgw0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_AwAIDQAAIQNACBCAAD0EwAguAQBAIgJACHABEAAigkAIcEEQACKCQAh7AQAAO4MpgUjiAUBAIgJACGOBQEAiQkAIaQFAQCJCQAhpwUBAIkJACEXBgAA_wwAIBcAAIMNACAZAAD9DAAgJQAA-gwAICYAAPsMACAnAAD-DAAgKAAAgA0AICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAuAACIDQAgMAAA-QwAIDEAAPwMACA0AACEDQAguAQBAIgJACHABEAAigkAIcEEQACKCQAh7AQAAO4MpgUjiAUBAIgJACGOBQEAiQkAIaQFAQCJCQAhpwUBAIkJACEDAAAAvwUAIEkAANUTACBKAAD3EwAgCAAAAL8FACAZAACuCwAgQgAA9xMAILgEAQCICQAhvQQBAIgJACGIBQEAiAkAIYkFQACKCQAhigVAAIoJACEGGQAArgsAILgEAQCICQAhvQQBAIgJACGIBQEAiAkAIYkFQACKCQAhigVAAIoJACEDAAAAHQAgSQAA1xMAIEoAAPoTACAQAAAAHQAgBwAAlAwAIAkAAJUMACAUAACSDAAgQgAA-hMAILgEAQCICQAhvQQBAIgJACG-BAEAiAkAIcAEQACKCQAhwQRAAIoJACHpBAEAiAkAIY4FAQCJCQAhmAUBAIkJACGZBUAAsQkAIZoFCACdCQAhmwUIAJ0JACEOBwAAlAwAIAkAAJUMACAUAACSDAAguAQBAIgJACG9BAEAiAkAIb4EAQCICQAhwARAAIoJACHBBEAAigkAIekEAQCICQAhjgUBAIkJACGYBQEAiQkAIZkFQACxCQAhmgUIAJ0JACGbBQgAnQkAIQMAAAAYACBJAADZEwAgSgAA_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_QwAICUAAPoMACAmAAD7DAAgJwAA_gwAICgAAIANACApAACBDQAgKwAAhQ0AICwAAIYNACAtAACHDQAgLgAAiA0AIDAAAPkMACAxAAD8DAAgNAAAhA0AIEIAAJUUACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHsBAAA7gymBSOIBQEAiAkAIY4FAQCJCQAhpAUBAIkJACGnBQEAiQkAIRcGAAD_DAAgFQAAgg0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_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_wwAIBUAAIINACAXAACDDQAgGQAA_QwAICUAAPoMACAmAAD7DAAgJwAA_gwAICgAAIANACApAACBDQAgKwAAhQ0AICwAAIYNACAuAACIDQAgMAAA-QwAIDEAAPwMACA0AACEDQAgQgAArhQAILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhFwYAAP8MACAVAACCDQAgFwAAgw0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAsAACGDQAgLgAAiA0AIDAAAPkMACAxAAD8DAAgNAAAhA0AILgEAQCICQAhwARAAIoJACHBBEAAigkAIewEAADuDKYFI4gFAQCICQAhjgUBAIkJACGkBQEAiQkAIacFAQCJCQAhAwAAAGUAIEkAAKcUACBKAACxFAAgDwAAAGUAIAMAAO4KACAHAADsCgAgCQAA7QoAIBUAAO8KACAkAADxCgAgQgAAsRQAILgEAQCICQAhvAQBAIkJACG9BAEAiAkAIb4EAQCJCQAhvwQBAIgJACHABEAAigkAIcEEQACKCQAhhAUBAIgJACENAwAA7goAIAcAAOwKACAJAADtCgAgFQAA7woAICQAAPEKACC4BAEAiAkAIbwEAQCJCQAhvQQBAIgJACG-BAEAiQkAIb8EAQCICQAhwARAAIoJACHBBEAAigkAIYQFAQCICQAhCrgEAQAAAAG9BAEAAAABvgQBAAAAAcAEQAAAAAHBBEAAAAAB5AQBAAAAAeUEAQAAAAHmBAEAAAAB5wQBAAAAAegEQAAAAAEDAAAAGAAgSQAAnRQAIEoAALUUACAVAAAAGAAgCAAAiRAAIBUAAOEOACAXAADiDgAgGQAA3g4AICUAANsOACAmAADcDgAgJwAA3Q4AICgAAN8OACApAADgDgAgKwAA4w4AIC0AAOUOACAuAADmDgAgQgAAtRQAILgEAQCICQAhwARAAIoJACHBBEAAigkAIY4FAQCJCQAhnwUBAIkJACGkBQEAiQkAIasFAQCICQAhEwgAAIkQACAVAADhDgAgFwAA4g4AIBkAAN4OACAlAADbDgAgJgAA3A4AICcAAN0OACAoAADfDgAgKQAA4A4AICsAAOMOACAtAADlDgAgLgAA5g4AILgEAQCICQAhwARAAIoJACHBBEAAigkAIY4FAQCJCQAhnwUBAIkJACGkBQEAiQkAIasFAQCICQAhAwAAABYAIEkAAJ8UACBKAAC4FAAgGQAAABYAIAYAAP8MACAVAACCDQAgFwAAgw0AIBkAAP0MACAlAAD6DAAgJgAA-wwAICcAAP4MACAoAACADQAgKQAAgQ0AICsAAIUNACAtAACHDQAgLgAAiA0AIDAAAPkMACAxAAD8DAAgNAAAhA0AIEIAALgUACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACHsBAAA7gymBSOIBQEAiAkAIY4FAQCJCQAhpAUBAIkJACGnBQEAiQkAIRcGAAD_DAAgFQAAgg0AIBcAAIMNACAZAAD9DAAgJQAA-gwAICYAAPsMACAnAAD-DAAgKAAAgA0AICkAAIENACArAACFDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_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_DAAgFQAAgg0AIBcAAIMNACAZAAD9DAAgJQAA-gwAICYAAPsMACAnAAD-DAAgKAAAgA0AICkAAIENACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_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_DAAgFQAAgg0AIBcAAIMNACAZAAD9DAAgJQAA-gwAICYAAPsMACAnAAD-DAAgKAAAgA0AICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAwAAD5DAAgMQAA_AwAIDQAAIQNACBCAADiFAAguAQBAIgJACHABEAAigkAIcEEQACKCQAh7AQAAO4MpgUjiAUBAIgJACGOBQEAiQkAIaQFAQCJCQAhpwUBAIkJACEXBgAA_wwAIBUAAIINACAXAACDDQAgGQAA_QwAICUAAPoMACAmAAD7DAAgJwAA_gwAICgAAIANACApAACBDQAgKwAAhQ0AICwAAIYNACAtAACHDQAgMAAA-QwAIDEAAPwMACA0AACEDQAguAQBAIgJACHABEAAigkAIcEEQACKCQAh7AQAAO4MpgUjiAUBAIgJACGOBQEAiQkAIaQFAQCJCQAhpwUBAIkJACEDAAAAJgAgSQAA2xQAIEoAAOUUACAYAAAAJgAgBwAAjQoAIAkAAIoKACAKAACLCgAgCwAAhAoAIBEAAIUKACASAACWCwAgFAAAhwoAIBYAAIkKACAaAACMCgAgHgAAiAoAIEIAAOUUACC4BAEAiAkAIb0EAQCICQAhvgQBAIkJACHABEAAigkAIcEEQACKCQAh4AQBAIgJACHhBAEAiAkAIeIEAQCICQAh5AQBAIgJACGQBQEAiAkAIaAFAQCJCQAhrAVAAIoJACEWBwAAjQoAIAkAAIoKACAKAACLCgAgCwAAhAoAIBEAAIUKACASAACWCwAgFAAAhwoAIBYAAIkKACAaAACMCgAgHgAAiAoAILgEAQCICQAhvQQBAIgJACG-BAEAiQkAIcAEQACKCQAhwQRAAIoJACHgBAEAiAkAIeEEAQCICQAh4gQBAIgJACHkBAEAiAkAIZAFAQCICQAhoAUBAIkJACGsBUAAigkAIRO4BAEAAAABvQQBAAAAAb4EAQAAAAHABEAAAAABwQRAAAAAAfYEAQAAAAH3BAgAAAAB-AQIAAAAAfkECAAAAAH6BAgAAAAB-wQIAAAAAfwECAAAAAH9BAgAAAAB_gQIAAAAAf8ECAAAAAGABQgAAAABgQUIAAAAAYIFCAAAAAGDBQgAAAABAwAAAGMAIEkAAM0TACBKAADpFAAgHQAAAGMAIAQAAK0QACAFAACuEAAgBgAArxAAIB4AALEQACArAAC0EAAgNAAAshAAIDcAALMQACA4AAC1EAAgOQAAthAAIDoAALcQACA7AAC4EAAgPAAAuRAAIEIAAOkUACC4BAEAiAkAIbwEAQCJCQAhwARAAIoJACHBBEAAigkAIYgFAQCICQAhwwUBAIgJACHEBSAAygoAIcUFAQCJCQAhxgUBAIkJACHHBQEAiQkAIcgFAQCJCQAhyQUBAIkJACHKBQEAiQkAIcsFAQCICQAhzAUBAIgJACEbBAAArRAAIAUAAK4QACAGAACvEAAgHgAAsRAAICsAALQQACA0AACyEAAgNwAAsxAAIDgAALUQACA5AAC2EAAgOgAAtxAAIDsAALgQACA8AAC5EAAguAQBAIgJACG8BAEAiQkAIcAEQACKCQAhwQRAAIoJACGIBQEAiAkAIcMFAQCICQAhxAUgAMoKACHFBQEAiQkAIcYFAQCJCQAhxwUBAIkJACHIBQEAiQkAIckFAQCJCQAhygUBAIkJACHLBQEAiAkAIcwFAQCICQAhAwAAABgAIEkAAM8TACBKAADsFAAgFQAAABgAIAgAAIkQACAVAADhDgAgFwAA4g4AIBkAAN4OACAlAADbDgAgJgAA3A4AICcAAN0OACApAADgDgAgKwAA4w4AICwAAOQOACAtAADlDgAgLgAA5g4AIEIAAOwUACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACGOBQEAiQkAIZ8FAQCJCQAhpAUBAIkJACGrBQEAiAkAIRMIAACJEAAgFQAA4Q4AIBcAAOIOACAZAADeDgAgJQAA2w4AICYAANwOACAnAADdDgAgKQAA4A4AICsAAOMOACAsAADkDgAgLQAA5Q4AIC4AAOYOACC4BAEAiAkAIcAEQACKCQAhwQRAAIoJACGOBQEAiQkAIZ8FAQCJCQAhpAUBAIkJACGrBQEAiAkAIQMAAAAWACBJAADREwAgSgAA7xQAIBkAAAAWACAGAAD_DAAgFQAAgg0AIBcAAIMNACAZAAD9DAAgJQAA-gwAICYAAPsMACAnAAD-DAAgKQAAgQ0AICsAAIUNACAsAACGDQAgLQAAhw0AIC4AAIgNACAwAAD5DAAgMQAA_AwAIDQAAIQNACBCAADvFAAguAQBAIgJACHABEAAigkAIcEEQACKCQAh7AQAAO4MpgUjiAUBAIgJACGOBQEAiQkAIaQFAQCJCQAhpwUBAIkJACEXBgAA_wwAIBUAAIINACAXAACDDQAgGQAA_QwAICUAAPoMACAmAAD7DAAgJwAA_gwAICkAAIENACArAACFDQAgLAAAhg0AIC0AAIcNACAuAACIDQAgMAAA-QwAIDEAAPwMACA0AACEDQAguAQBAIgJACHABEAAigkAIcEEQACKCQAh7AQAAO4MpgUjiAUBAIgJACGOBQEAiQkAIaQFAQCJCQAhpwUBAIkJACECAwACBwAGDgQGAwUKBAYNAQwALxIRBR7LARMrzgElNMwBKjfNASo4zwElOdEBLTrSAR470wEePNUBLgEDAAIBAwACCQMAAgcABgkACAwALBXBAQsXwgEXGMMBFTXEASU2xQESEQaiAQEMACsVpQELF6YBFxmgARYlmgEJJpsBGiehAQooowEFKaQBEyutASUsrgEVLa8BFC6wARIwFQcxnwEPNKoBKgMHFwYMACkvGwgOCBwHDAAoFX0LF34XGXgWJSAJJnYaJ3cKKHkFKXwTK4IBJSyIARUtiQEULowBEgUHAAYJAAgMACQUJAoVcQsGBwAGCQAICiUJDAAjFSkLF24XDAcABglqCAprCQstDAwAIhE1ERIABRM3EhQAChYAFhoAGB4AEwMNAA0OAAsQAA8CCy4MDAAOAQsvAAMHAAYMABAPMAwBDzEAAQ4ACwQHAAYJOAgOAAsSAAUHAwACBwAGCTkIDAAhFToLHz4UJGAeBAcABglcCB0AFR4AEwYHAAYJWQgMAB0SAAUWABYcWhQIBwAGCUkIDAAcFT8LF0MXGEgVGgAYG1IaBQcABglECBIABRQAChYAFgMMABkVTgsZTRYCFVAAGU8ABAcABglTCAwAGxlUFgEZVQADFVYAF1cAGFgAARxbAAQeZhMhAB8iAAIjZAICDAAgIGEeASBiAAMVZwAfaAAkaQACC2wAEW0AAhVvABdwAAIUcgAVcwAGBwAGCYcBCBKGAQUhACYjhQECKgACAgwAJyCDASUBIIQBAAwVkwEAF5QBABmQAQAljQEAJo4BACePAQAokQEAKZIBACuVAQAslgEALZcBAC6YAQABL5kBAAMHrAEGMgACM6sBAhAGtwEAFboBABe7AQAZtQEAJbIBACazAQAntgEAKLgBACm5AQArvQEALL4BAC2_AQAuwAEAMLEBADG0AQA0vAEABRXGAQAXxwEAGMgBADXJAQA2ygEAASoAAgEiAAILBNYBAAXXAQAG2AEAEtkBAB7aAQAr3QEANNsBADfcAQA43gEAOt8BADvgAQAAAgMAAgcABgIDAAIHAAYDDAA0TwA1UAA2AAAAAwwANE8ANVAANgEOAAsBDgALAwwAO08APFAAPQAAAAMMADtPADxQAD0AAAMMAEJPAENQAEQAAAADDABCTwBDUABEAQMAAgEDAAIDDABJTwBKUABLAAAAAwwASU8ASlAASwEDAAIBAwACAwwAUE8AUVAAUgAAAAMMAFBPAFFQAFIAAAADDABYTwBZUABaAAAAAwwAWE8AWVAAWgIHAAYJ8wIIAgcABgn5AggDDABfTwBgUABhAAAAAwwAX08AYFAAYQEHAAYBBwAGBQwAZk8AaVAAasEBAGfCAQBoAAAAAAAFDABmTwBpUABqwQEAZ8IBAGgDBwAGCQAICqEDCQMHAAYJAAgKpwMJBQwAb08AclAAc8EBAHDCAQBxAAAAAAAFDABvTwByUABzwQEAcMIBAHEIBwAGCbkDCAq6AwkSAAUUAAoWABYaABgeABMIBwAGCcADCArBAwkSAAUUAAoWABYaABgeABMDDAB4TwB5UAB6AAAAAwwAeE8AeVAAegEI0wMHAQjZAwcDDAB_TwCAAVAAgQEAAAADDAB_TwCAAVAAgQEBB-sDBgEH8QMGAwwAhgFPAIcBUACIAQAAAAMMAIYBTwCHAVAAiAEAAAMMAI0BTwCOAVAAjwEAAAADDACNAU8AjgFQAI8BAwecBAYyAAIzmwQCAwejBAYyAAIzogQCAwwAlAFPAJUBUACWAQAAAAMMAJQBTwCVAVAAlgEAAAMMAJsBTwCcAVAAnQEAAAADDACbAU8AnAFQAJ0BAAADDACiAU8AowFQAKQBAAAAAwwAogFPAKMBUACkAQIHAAYJAAgCBwAGCQAIBQwAqQFPAKwBUACtAcEBAKoBwgEAqwEAAAAAAAUMAKkBTwCsAVAArQHBAQCqAcIBAKsBAw0ADQ4ACxAADwMNAA0OAAsQAA8DDACyAU8AswFQALQBAAAAAwwAsgFPALMBUAC0AQAAAwwAuQFPALoBUAC7AQAAAAMMALkBTwC6AVAAuwEEBwAGCawFCBoAGButBRoEBwAGCbMFCBoAGBu0BRoFDADAAU8AwwFQAMQBwQEAwQHCAQDCAQAAAAAABQwAwAFPAMMBUADEAcEBAMEBwgEAwgEAAAMMAMkBTwDKAVAAywEAAAADDADJAU8AygFQAMsBASIAAgEiAAIDDADQAU8A0QFQANIBAAAAAwwA0AFPANEBUADSAQQe-AUTIQAfIgACI_cFAgQe_wUTIQAfIgACI_4FAgMMANcBTwDYAVAA2QEAAAADDADXAU8A2AFQANkBAwMAAgcABgmRBggDAwACBwAGCZcGCAMMAN4BTwDfAVAA4AEAAAADDADeAU8A3wFQAOABBAcABgmpBggOAAsSAAUEBwAGCa8GCA4ACxIABQUMAOUBTwDoAVAA6QHBAQDmAcIBAOcBAAAAAAAFDADlAU8A6AFQAOkBwQEA5gHCAQDnAQYHAAYJwwYIEsIGBSEAJiPBBgIqAAIGBwAGCcsGCBLKBgUhACYjyQYCKgACAwwA7gFPAO8BUADwAQAAAAMMAO4BTwDvAVAA8AEEBwAGCd0GCBIABRYAFgQHAAYJ4wYIEgAFFgAWAwwA9QFPAPYBUAD3AQAAAAMMAPUBTwD2AVAA9wEEBwAGCfUGCB0AFR4AEwQHAAYJ-wYIHQAVHgATAwwA_AFPAP0BUAD-AQAAAAMMAPwBTwD9AVAA_gEFBwAGCY0HCBIABRQAChYAFgUHAAYJkwcIEgAFFAAKFgAWAwwAgwJPAIQCUACFAgAAAAMMAIMCTwCEAlAAhQIBKgACASoAAgMMAIoCTwCLAlAAjAIAAAADDACKAk8AiwJQAIwCAwMAAgcABgkACAMDAAIHAAYJAAgDDACRAk8AkgJQAJMCAAAAAwwAkQJPAJICUACTAj0CAT7hAQE_4gEBQOMBAUHkAQFD5gEBROgBMEXpATFG6wEBR-0BMEjuATJL7wEBTPABAU3xATBR9AEzUvUBN1P2ARFU9wERVfgBEVb5ARFX-gERWPwBEVn-ATBa_wE4W4ECEVyDAjBdhAI5XoUCEV-GAhFghwIwYYoCOmKLAj5jjQICZI4CAmWQAgJmkQICZ5ICAmiUAgJplgIwapcCP2uZAgJsmwIwbZwCQG6dAgJvngICcJ8CMHGiAkFyowJFc6QCA3SlAgN1pgIDdqcCA3eoAgN4qgIDeawCMHqtAkZ7rwIDfLECMH2yAkd-swIDf7QCA4ABtQIwgQG4AkiCAbkCTIMBugIEhAG7AgSFAbwCBIYBvQIEhwG-AgSIAcACBIkBwgIwigHDAk2LAcUCBIwBxwIwjQHIAk6OAckCBI8BygIEkAHLAjCRAc4CT5IBzwJTkwHRAlSUAdICVJUB1QJUlgHWAlSXAdcCVJgB2QJUmQHbAjCaAdwCVZsB3gJUnAHgAjCdAeECVp4B4gJUnwHjAlSgAeQCMKEB5wJXogHoAlujAekCGqQB6gIapQHrAhqmAewCGqcB7QIaqAHvAhqpAfECMKoB8gJcqwH1AhqsAfcCMK0B-AJdrgH6AhqvAfsCGrAB_AIwsQH_Al6yAYADYrMBgQMPtAGCAw-1AYMDD7YBhAMPtwGFAw-4AYcDD7kBiQMwugGKA2O7AYwDD7wBjgMwvQGPA2S-AZADD78BkQMPwAGSAzDDAZUDZcQBlgNrxQGXAwrGAZgDCscBmQMKyAGaAwrJAZsDCsoBnQMKywGfAzDMAaADbM0BowMKzgGlAzDPAaYDbdABqAMK0QGpAwrSAaoDMNMBrQNu1AGuA3TVAa8DC9YBsAML1wGxAwvYAbIDC9kBswML2gG1AwvbAbcDMNwBuAN13QG8AwveAb4DMN8BvwN24AHCAwvhAcMDC-IBxAMw4wHHA3fkAcgDe-UByQMI5gHKAwjnAcsDCOgBzAMI6QHNAwjqAc8DCOsB0QMw7AHSA3ztAdUDCO4B1wMw7wHYA33wAdoDCPEB2wMI8gHcAzDzAd8DfvQB4AOCAfUB4QMH9gHiAwf3AeMDB_gB5AMH-QHlAwf6AecDB_sB6QMw_AHqA4MB_QHtAwf-Ae8DMP8B8AOEAYAC8gMHgQLzAweCAvQDMIMC9wOFAYQC-AOJAYUC-gMGhgL7AwaHAv0DBogC_gMGiQL_AwaKAoEEBosCgwQwjAKEBIoBjQKGBAaOAogEMI8CiQSLAZACigQGkQKLBAaSAowEMJMCjwSMAZQCkASQAZUCkQQqlgKSBCqXApMEKpgClAQqmQKVBCqaApcEKpsCmQQwnAKaBJEBnQKeBCqeAqAEMJ8CoQSSAaACpAQqoQKlBCqiAqYEMKMCqQSTAaQCqgSXAaUCrAQmpgKtBCanArAEJqgCsQQmqQKyBCaqArQEJqsCtgQwrAK3BJgBrQK5BCauArsEMK8CvASZAbACvQQmsQK-BCayAr8EMLMCwgSaAbQCwwSeAbUCxQQftgLGBB-3AskEH7gCygQfuQLLBB-6As0EH7sCzwQwvALQBJ8BvQLSBB--AtQEML8C1QSgAcAC1gQfwQLXBB_CAtgEMMMC2wShAcQC3ASlAcUC3QQJxgLeBAnHAt8ECcgC4AQJyQLhBAnKAuMECcsC5QQwzALmBKYBzQLoBAnOAuoEMM8C6wSnAdAC7AQJ0QLtBAnSAu4EMNMC8QSoAdQC8gSuAdUC8wQM1gL0BAzXAvUEDNgC9gQM2QL3BAzaAvkEDNsC-wQw3AL8BK8B3QL-BAzeAoAFMN8CgQWwAeACggUM4QKDBQziAoQFMOMChwWxAeQCiAW1AeUCigUN5gKLBQ3nAo4FDegCjwUN6QKQBQ3qApIFDesClAUw7AKVBbYB7QKXBQ3uApkFMO8CmgW3AfACmwUN8QKcBQ3yAp0FMPMCoAW4AfQCoQW8AfUCogUW9gKjBRb3AqQFFvgCpQUW-QKmBRb6AqgFFvsCqgUw_AKrBb0B_QKvBRb-ArEFMP8CsgW-AYADtQUWgQO2BRaCA7cFMIMDugW_AYQDuwXFAYUDvQUYhgO-BRiHA8EFGIgDwgUYiQPDBRiKA8UFGIsDxwUwjAPIBcYBjQPKBRiOA8wFMI8DzQXHAZADzgUYkQPPBRiSA9AFMJMD0wXIAZQD1AXMAZUD1gUulgPXBS6XA9kFLpgD2gUumQPbBS6aA90FLpsD3wUwnAPgBc0BnQPiBS6eA-QFMJ8D5QXOAaAD5gUuoQPnBS6iA-gFMKMD6wXPAaQD7AXTAaUD7QUepgPuBR6nA-8FHqgD8AUeqQPxBR6qA_MFHqsD9QUwrAP2BdQBrQP6BR6uA_wFMK8D_QXVAbADgAYesQOBBh6yA4IGMLMDhQbWAbQDhgbaAbUDhwYTtgOIBhO3A4kGE7gDigYTuQOLBhO6A40GE7sDjwYwvAOQBtsBvQOTBhO-A5UGML8DlgbcAcADmAYTwQOZBhPCA5oGMMMDnQbdAcQDngbhAcUDnwYSxgOgBhLHA6EGEsgDogYSyQOjBhLKA6UGEssDpwYwzAOoBuIBzQOrBhLOA60GMM8DrgbjAdADsAYS0QOxBhLSA7IGMNMDtQbkAdQDtgbqAdUDtwYl1gO4BiXXA7kGJdgDugYl2QO7BiXaA70GJdsDvwYw3APABusB3QPFBiXeA8cGMN8DyAbsAeADzAYl4QPNBiXiA84GMOMD0QbtAeQD0gbxAeUD0wYV5gPUBhXnA9UGFegD1gYV6QPXBhXqA9kGFesD2wYw7APcBvIB7QPfBhXuA-EGMO8D4gbzAfAD5AYV8QPlBhXyA-YGMPMD6Qb0AfQD6gb4AfUD6wYU9gPsBhT3A-0GFPgD7gYU-QPvBhT6A_EGFPsD8wYw_AP0BvkB_QP3BhT-A_kGMP8D-gb6AYAE_AYUgQT9BhSCBP4GMIMEgQf7AYQEggf_AYUEgwcXhgSEBxeHBIUHF4gEhgcXiQSHBxeKBIkHF4sEiwcwjASMB4ACjQSPBxeOBJEHMI8EkgeBApAElAcXkQSVBxeSBJYHMJMEmQeCApQEmgeGApUEnActlgSdBy2XBJ8HLZgEoActmQShBy2aBKMHLZsEpQcwnASmB4cCnQSoBy2eBKoHMJ8EqweIAqAErActoQStBy2iBK4HMKMEsQeJAqQEsgeNAqUEswcFpgS0BwWnBLUHBagEtgcFqQS3BwWqBLkHBasEuwcwrAS8B44CrQS-BwWuBMAHMK8EwQePArAEwgcFsQTDBwWyBMQHMLMExweQArQEyAeUAg"
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
          role: true
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
    role: session.user.role
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
  const profile = await prisma.teacherProfile.create({
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
  const profile = await prisma.studentProfile.create({
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
  console.log("Registering user with payload:", payload);
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
  console.log("Registration data:", data);
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
var AuthService = {
  registerUser,
  loginUser,
  getCurrentUserProfile
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
var AuthController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getCurrentUserProfile: getCurrentUserProfile2
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
router2.get(
  "/me",
  requireSessionRole("SUPERADMIN", "ADMIN", "TEACHER", "STUDENT"),
  AuthController.getCurrentUserProfile
);
var AuthRoutes = router2;

// src/app/module/facultyProfile/facultyProfile.route.ts
import { Router as Router3 } from "express";

// src/app/module/facultyProfile/facultyProfile.service.ts
function createHttpError2(statusCode, message) {
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
    throw createHttpError2(403, "Only faculty admins can update faculty display name");
  }
  const normalizedName = (payload.fullName ?? payload.name ?? "").trim();
  const hasFacultyMutation = Boolean(payload.fullName || payload.name || payload.shortName || payload.description) || Boolean(payload.facultyId);
  if (hasFacultyMutation && !normalizedName) {
    throw createHttpError2(400, "Full name is required when updating faculty details");
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
          throw createHttpError2(
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
        throw createHttpError2(404, "Faculty not found");
      }
      if (!targetFaculty.institutionId || targetFaculty.institutionId !== adminProfile.institutionId) {
        throw createHttpError2(403, "You can only update faculty under your institution");
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
    throw createHttpError2(403, "Only faculty admins can view faculty profile");
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
    throw createHttpError2(403, "Only faculty admins can create departments");
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
      throw createHttpError2(404, "Faculty not found for this institution");
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
      throw createHttpError2(
        404,
        "No faculty found for this institution. Update faculty profile first"
      );
    }
    if (faculties.length > 1) {
      throw createHttpError2(400, "Multiple faculties found. Please provide facultyId");
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
function createHttpError3(statusCode, message) {
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
    throw createHttpError3(403, "Only institution admins can manage semesters");
  }
  if (creatorAdminProfile.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError3(403, "Only institution admins can manage semesters");
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
    throw createHttpError3(400, "Invalid startDate or endDate");
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate <= today) {
    throw createHttpError3(400, "startDate must be after today");
  }
  if (startDate >= endDate) {
    throw createHttpError3(400, "startDate must be before endDate");
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
    throw createHttpError3(404, "Semester not found for this institution");
  }
  let nextStartDate = existingSemester.startDate;
  let nextEndDate = existingSemester.endDate;
  if (payload.startDate) {
    const parsedStartDate = new Date(payload.startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw createHttpError3(400, "Invalid startDate");
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedStartDate <= today) {
      throw createHttpError3(400, "startDate must be after today");
    }
    nextStartDate = parsedStartDate;
  }
  if (payload.endDate) {
    const parsedEndDate = new Date(payload.endDate);
    if (Number.isNaN(parsedEndDate.getTime())) {
      throw createHttpError3(400, "Invalid endDate");
    }
    nextEndDate = parsedEndDate;
  }
  if (nextStartDate >= nextEndDate) {
    throw createHttpError3(400, "startDate must be before endDate");
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
    throw createHttpError3(404, "Semester not found for this institution");
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
    throw createHttpError3(403, "Only institution-level admins can view faculties");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, "DEPARTMENT")) {
    throw createHttpError3(403, "You are not allowed to view faculties for department creation");
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
    throw createHttpError3(403, "Only institution-level admins can create sub-admin accounts");
  }
  if (!canCreateSubAdmin(creatorAdminProfile.role, payload.accountType)) {
    throw createHttpError3(
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
    throw createHttpError3(500, "Failed to create account");
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
        throw createHttpError3(404, "Faculty not found for this institution");
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
          throw createHttpError3(
            400,
            "Cannot create department without a faculty. Provide faculty fields first"
          );
        }
        if (faculties.length > 1) {
          throw createHttpError3(
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
function createHttpError4(statusCode, message) {
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
    throw createHttpError4(400, "You are already assigned to an institution");
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
    throw createHttpError4(400, "You already have a pending application");
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
    throw createHttpError4(404, "Application not found");
  }
  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError4(400, "Application already reviewed");
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
function createHttpError5(statusCode, message) {
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
    throw createHttpError5(403, "Only admin users under an institution can manage postings");
  }
  return adminProfile;
}
async function resolveScopedIds(userId, payload) {
  const context = await resolveAdminContext(userId);
  if (context.role === AdminRole.INSTITUTIONADMIN) {
    if (!payload.facultyId || !payload.departmentId) {
      throw createHttpError5(
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
      throw createHttpError5(404, "Faculty not found for this institution");
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
      throw createHttpError5(404, "Department not found under selected faculty");
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
      throw createHttpError5(400, "Faculty admin must provide departmentId");
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
      throw createHttpError5(404, "Department not found for this institution");
    }
    if (!department.facultyId) {
      throw createHttpError5(400, "Department is not assigned to a faculty");
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
      throw createHttpError5(404, "Department not found for this institution");
    }
    if (departments.length > 1) {
      throw createHttpError5(400, "Multiple departments found. Contact institution admin to resolve mapping");
    }
    return {
      institutionId: context.institutionId,
      facultyId: departments[0].facultyId,
      departmentId: departments[0].id,
      programId: null
    };
  }
  throw createHttpError5(403, "Unsupported admin role for posting management");
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
  throw createHttpError5(403, "Unsupported admin role for posting options");
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
function createHttpError6(statusCode, message) {
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
    throw createHttpError6(404, "Student account not found");
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
    throw createHttpError6(403, "Student is not assigned to any institution yet");
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
    throw createHttpError6(404, "Classwork not found");
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
    throw createHttpError6(403, "You are not registered in this classwork section");
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
    throw createHttpError6(409, "Submission already exists. Please update it.");
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
    throw createHttpError6(404, "Submission not found");
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
    throw createHttpError6(404, "Submission not found");
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
    throw createHttpError6(409, "Application profile already exists. Use update instead.");
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
    throw createHttpError6(404, "Application profile not found");
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
    throw createHttpError6(404, "Application profile not found");
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
    throw createHttpError6(
      400,
      "Complete your application profile and upload required documents before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError6(400, "You are already assigned to an institution");
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
    throw createHttpError6(404, "Student admission posting not found");
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
    throw createHttpError6(409, "You already applied to this admission post");
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
function createHttpError7(statusCode, message) {
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
    throw createHttpError7(400, "Invalid date");
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
    throw createHttpError7(400, `${fieldName} cannot be negative`);
  }
  if (value > maxValue) {
    throw createHttpError7(400, `${fieldName} cannot exceed ${maxValue}`);
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
    throw createHttpError7(404, "User not found");
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
    throw createHttpError7(403, "Teacher is not assigned to any institution yet");
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
    throw createHttpError7(403, "Only institution admins can perform this action");
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
    throw createHttpError7(409, "Application profile already exists. Use update instead.");
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
    throw createHttpError7(404, "Application profile not found");
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
    throw createHttpError7(404, "Application profile not found");
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
    throw createHttpError7(
      400,
      "Complete your application profile (academic records, experiences, resume, and skills) before applying."
    );
  }
  if (context.profile?.institutionId) {
    throw createHttpError7(400, "You are already assigned to an institution");
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
    throw createHttpError7(404, "Teacher posting not found");
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
    throw createHttpError7(409, "You already applied to this posting");
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
      throw createHttpError7(403, "You are not assigned to this section");
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
    throw createHttpError7(403, "You are not assigned to this section");
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
    throw createHttpError7(404, "Classwork not found");
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
    throw createHttpError7(404, "Classwork not found");
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
    throw createHttpError7(404, "No students found for this section");
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
    throw createHttpError7(404, "No students found for this section");
  }
  const allowedRegistrationIds = new Set(registrations.map((item) => item.id));
  for (const item of payload.items) {
    if (!allowedRegistrationIds.has(item.courseRegistrationId)) {
      throw createHttpError7(400, "One or more attendance records are outside your assigned section");
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
    throw createHttpError7(404, "No students found for this section");
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
    throw createHttpError7(404, "Course registration not found for this teacher");
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
      throw createHttpError7(400, `${field} is not allowed for this course type`);
    }
    enforceMaxMark(value, max, field);
    dataToSave[field] = toTwoDecimals2(value);
  }
  if (Object.keys(dataToSave).length === 0) {
    throw createHttpError7(400, "No valid marks field provided for this course type");
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
    throw createHttpError7(404, "Application not found");
  }
  if (application.status === TeacherJobApplicationStatus.APPROVED || application.status === TeacherJobApplicationStatus.REJECTED) {
    throw createHttpError7(400, "Application has already been reviewed");
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
    throw createHttpError7(400, "departmentId is required to approve this application");
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
    throw createHttpError7(404, "Department not found for this institution");
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
      throw createHttpError7(400, "teacherInitial, teachersId and designation are required for approval");
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
