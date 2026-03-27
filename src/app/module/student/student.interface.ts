import { TeacherClassworkType } from "../../../generated/prisma/enums";

export interface IStudentAcademicRecord {
  examName: string;
  institute: string;
  result: string;
  year: number;
}

export interface ICreateStudentApplicationProfilePayload {
  headline: string;
  about: string;
  documentUrls: string[];
  academicRecords: IStudentAcademicRecord[];
}

export interface IUpdateStudentApplicationProfilePayload {
  headline?: string;
  about?: string;
  documentUrls?: string[];
  academicRecords?: IStudentAcademicRecord[];
}

export interface ICreateStudentAdmissionApplicationPayload {
  coverLetter?: string;
}

export interface IListStudentTimelineQuery {
  semesterId?: string;
  type?: TeacherClassworkType;
}

export interface IListStudentRegisteredCoursesQuery {
  semesterId?: string;
}

export interface IListStudentResultQuery {
  semesterId: string;
}

export interface ICreateStudentSubmissionPayload {
  classworkId: string;
  responseText?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface IUpdateStudentSubmissionPayload {
  responseText?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface IUpdateStudentProfilePayload {
  name?: string;
  image?: string;
  bio?: string;
  contactNo?: string;
  presentAddress?: string;
  permanentAddress?: string;
  bloodGroup?: string;
  gender?: string;
}
