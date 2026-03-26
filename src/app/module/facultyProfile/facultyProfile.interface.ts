export interface IUpdateFacultyDisplayNamePayload {
  name?: string;
  fullName?: string;
  facultyId?: string;
  shortName?: string;
  description?: string;
}

export interface IUpdatedFacultyDisplayNameResult {
  userId: string;
  name: string;
  facultyId: string | null;
  facultyName: string | null;
}

export interface IFacultyProfileDetailsResult {
  userId: string;
  institutionId: string;
  facultyId: string | null;
  fullName: string;
  shortName: string | null;
  description: string | null;
}

export interface ICreateFacultyDepartmentPayload {
  fullName: string;
  shortName?: string;
  description?: string;
  facultyId?: string;
}

export interface IFacultyDepartmentResult {
  id: string;
  fullName: string;
  shortName: string | null;
  description: string | null;
  facultyId: string | null;
  createdAt: Date;
}
