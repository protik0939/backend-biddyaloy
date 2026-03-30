import {
  AccountStatus,
  InstitutionTransferEntityType,
  InstitutionTransferStatus,
  StudentAdmissionApplicationStatus,
} from "../../../generated/prisma/enums";

export interface IUpdateDepartmentProfilePayload {
  fullName?: string;
  shortName?: string;
  description?: string;
  departmentId?: string;
  image?: string;
  name?: string;
  contactNo?: string;
  presentAddress?: string;
  permanentAddress?: string;
  bloodGroup?: string;
  gender?: string;
}

export interface ICreateSemesterPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface ICreateSchedulePayload {
  name: string;
  description?: string;
  semesterId: string;
  startTime: string;
  endTime: string;
  status?: "CLASS_SLOT" | "BREAK_SLOT";
  departmentId?: string;
}

export interface IUpdateSchedulePayload {
  name?: string;
  description?: string;
  semesterId?: string;
  startTime?: string;
  endTime?: string;
  status?: "CLASS_SLOT" | "BREAK_SLOT";
}

export interface IUpdateSemesterPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface ICreateSectionPayload {
  name: string;
  semesterId: string;
  batchId: string;
  sectionCapacity?: number;
  description?: string;
  departmentId?: string;
}

export interface IUpdateSectionPayload {
  name?: string;
  semesterId?: string;
  batchId?: string;
  sectionCapacity?: number;
  description?: string;
}

export interface ICreateBatchPayload {
  name: string;
  description?: string;
  departmentId?: string;
}

export interface IUpdateBatchPayload {
  name?: string;
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
  credits?: number;
  programId?: string;
}

export interface IUpdateCoursePayload {
  courseCode?: string;
  courseTitle?: string;
  description?: string;
  credits?: number;
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
  studentsId: string;
  bio?: string;
  departmentId?: string;
}

export interface IUpdateStudentPayload {
  bio?: string;
  accountStatus?: AccountStatus;
}

export interface ICreateCourseRegistrationPayload {
  courseId: string;
  studentProfileId: string;
  sectionId: string;
  programId?: string;
  semesterId: string;
  departmentId?: string;
  registrationDate?: string;
}

export interface IUpdateCourseRegistrationPayload {
  courseId?: string;
  studentProfileId?: string;
  sectionId?: string;
  programId?: string;
  semesterId?: string;
  registrationDate?: string;
}

export interface IUpsertSectionCourseTeacherAssignmentPayload {
  sectionId: string;
  courseId: string;
  teacherProfileId: string;
  semesterId: string;
  departmentId?: string;
}

export interface ICreateRoutinePayload {
  name: string;
  description?: string;
  version?: string;
  scheduleId: string;
  courseRegistrationId: string;
  classRoomId: string;
  departmentId?: string;
}

export interface IUpdateRoutinePayload {
  name?: string;
  description?: string;
  version?: string;
  scheduleId?: string;
  courseRegistrationId?: string;
  classRoomId?: string;
}

export interface IListStudentAdmissionApplicationsQuery {
  status?: StudentAdmissionApplicationStatus;
}

export interface IReviewStudentAdmissionApplicationPayload {
  status: StudentAdmissionApplicationStatus;
  responseMessage?: string;
  rejectionReason?: string;
  studentsId?: string;
  bio?: string;
}

export interface IUpsertDepartmentFeeConfigurationPayload {
  semesterId: string;
  totalFeeAmount: number;
  monthlyFeeAmount: number;
  currency?: string;
}

export interface IListDepartmentFeeConfigurationsQuery {
  semesterId?: string;
}

export interface ICreateInstitutionTransferRequestPayload {
  entityType: InstitutionTransferEntityType;
  profileId: string;
  targetInstitutionId: string;
  requestMessage?: string;
}

export interface IListInstitutionTransferRequestsQuery {
  status?: InstitutionTransferStatus;
  entityType?: InstitutionTransferEntityType;
}

export interface IReviewInstitutionTransferRequestPayload {
  status: InstitutionTransferStatus;
  responseMessage?: string;
  targetDepartmentId?: string;
}
