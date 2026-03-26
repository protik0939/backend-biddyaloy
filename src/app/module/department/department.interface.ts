import { AccountStatus } from "../../../generated/prisma/enums";

export interface IUpdateDepartmentProfilePayload {
  fullName: string;
  shortName?: string;
  description?: string;
  departmentId?: string;
}

export interface ICreateSemesterPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface IUpdateSemesterPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface ICreateSectionPayload {
  name: string;
  semesterId: string;
  sectionCapacity?: number;
  description?: string;
  departmentId?: string;
}

export interface IUpdateSectionPayload {
  name?: string;
  semesterId?: string;
  sectionCapacity?: number;
  description?: string;
}

export interface ICreateProgramPayload {
  title: string;
  shortTitle?: string;
  description?: string;
  credits?: number;
  cost?: number;
  departmentId?: string;
}

export interface IUpdateProgramPayload {
  title?: string;
  shortTitle?: string;
  description?: string;
  credits?: number;
  cost?: number;
}

export interface ICreateCoursePayload {
  courseCode: string;
  courseTitle: string;
  description?: string;
  programId: string;
}

export interface IUpdateCoursePayload {
  courseCode?: string;
  courseTitle?: string;
  description?: string;
  programId?: string;
}

export interface ICreateTeacherPayload {
  name: string;
  email: string;
  password: string;
  teacherInitial: string;
  teachersId: string;
  designation: string;
  bio?: string;
  departmentId?: string;
}

export interface IUpdateTeacherPayload {
  designation?: string;
  bio?: string;
  accountStatus?: AccountStatus;
}

export interface ICreateStudentPayload {
  name: string;
  email: string;
  password: string;
  studentInitial: string;
  studentsId: string;
  bio?: string;
  departmentId?: string;
}

export interface IUpdateStudentPayload {
  bio?: string;
  accountStatus?: AccountStatus;
}
