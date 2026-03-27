import { AttendanceStatus, TeacherClassworkType, TeacherJobApplicationStatus } from "../../../generated/prisma/enums";

export interface ICreateTeacherJobApplicationPayload {
  coverLetter?: string;
}

export interface ITeacherAcademicRecord {
  degree: string;
  institute: string;
  result: string;
  year: number;
}

export interface ITeacherExperienceRecord {
  organization: string;
  title: string;
  startDate: string;
  endDate?: string;
  responsibilities?: string;
}

export interface ICreateTeacherApplicationProfilePayload {
  headline: string;
  about: string;
  resumeUrl: string;
  portfolioUrl?: string;
  skills: string[];
  certifications?: string[];
  academicRecords: ITeacherAcademicRecord[];
  experiences: ITeacherExperienceRecord[];
}

export interface IUpdateTeacherApplicationProfilePayload {
  headline?: string;
  about?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
  certifications?: string[];
  academicRecords?: ITeacherAcademicRecord[];
  experiences?: ITeacherExperienceRecord[];
}

export interface IUpdateTeacherProfilePayload {
  name?: string;
  image?: string;
  bio?: string;
  designation?: string;
  contactNo?: string;
  presentAddress?: string;
  permanentAddress?: string;
  bloodGroup?: string;
  gender?: string;
}

export interface IListTeacherClassworksQuery {
  sectionId?: string;
  type?: TeacherClassworkType;
}

export interface ICreateTeacherClassworkPayload {
  sectionId: string;
  type: TeacherClassworkType;
  title: string;
  content?: string;
  dueAt?: string;
}

export interface IUpdateTeacherClassworkPayload {
  type?: TeacherClassworkType;
  title?: string;
  content?: string;
  dueAt?: string;
}

export interface IGetSectionAttendanceQuery {
  sectionId: string;
  date: string;
}

export interface IUpsertSectionAttendancePayload {
  sectionId: string;
  date: string;
  items: Array<{
    courseRegistrationId: string;
    status: AttendanceStatus;
  }>;
}

export interface IReviewTeacherJobApplicationPayload {
  status: TeacherJobApplicationStatus;
  responseMessage?: string;
  rejectionReason?: string;
  teacherInitial?: string;
  teachersId?: string;
  designation?: string;
  bio?: string;
  departmentId?: string;
}

export interface IListSectionMarksQuery {
  sectionId: string;
}

export interface IUpsertSectionMarkPayload {
  labReport?: number;
  labTask?: number;
  project?: number;
  projectReport?: number;
  presentation?: number;
  labEvaluation?: number;
  viva?: number;
  quiz1?: number;
  quiz2?: number;
  quiz3?: number;
  assignment?: number;
  midterm?: number;
  finalExam?: number;
}
